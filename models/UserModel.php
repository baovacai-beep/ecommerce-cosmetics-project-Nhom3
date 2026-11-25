<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR . 'Model.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'entities' . DIRECTORY_SEPARATOR . 'Customer.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'entities' . DIRECTORY_SEPARATOR . 'Staff.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'entities' . DIRECTORY_SEPARATOR . 'Admin.php';

/**
 * UserModel
 * Quản lý xác thực, khóa đăng nhập sai, OTP khôi phục mật khẩu,
 * force-logout bằng token_version, sổ địa chỉ và nhật ký bảo mật.
 */
class UserModel extends Model
{
    public function findByEmail(string $email): ?array
    {
        $clean = strtolower(trim($email));
        $stmt = $this->db->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$clean]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    private function normalizePhone(string $phone): string
    {
        $clean = preg_replace('/[\s.-]/', '', trim($phone)) ?? '';
        if (str_starts_with($clean, '+84')) {
            $clean = '0' . substr($clean, 3);
        } elseif (str_starts_with($clean, '84') && strlen($clean) === 11) {
            $clean = '0' . substr($clean, 2);
        }
        return $clean;
    }

    public function findByEmailOrPhone(string $identifier): ?array
    {
        $raw = trim($identifier);
        $cleanEmail = strtolower($raw);
        $cleanPhone = $this->normalizePhone($raw);
        if ($cleanPhone !== '' && preg_match('/^[0-9+]{8,15}$/', $cleanPhone)) {
            $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ? OR (phone IS NOT NULL AND phone <> '' AND phone = ?) LIMIT 1");
            $stmt->execute([$cleanEmail, $cleanPhone]);
        } else {
            $stmt = $this->db->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
            $stmt->execute([$cleanEmail]);
        }
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function buildEntity(array $row): User
    {
        $id = (int) ($row['id'] ?? 0);
        $name = (string) ($row['full_name'] ?? 'Khách hàng');
        $email = (string) ($row['email'] ?? 'guest@bakemate.vn');
        $phone = (string) ($row['phone'] ?? '');
        $role = (string) ($row['role'] ?? 'customer');

        return match ($role) {
            'admin' => new Admin($id, $name, $email, $phone, !empty($row['is_super_admin'])),
            'staff' => new Staff($id, $name, $email, $phone),
            default => new Customer($id, $name, $email, $phone),
        };
    }

    public function logSecurity(?int $userId, ?string $email, string $eventType, string $detail): void
    {
        $ip = Rbac::normalizeIp($_SERVER['REMOTE_ADDR'] ?? '');
        $ua = Rbac::normalizeUa($_SERVER['HTTP_USER_AGENT'] ?? '');
        $stmt = $this->db->prepare(
            'INSERT INTO security_logs (user_id, email, event_type, ip_address, user_agent, detail) VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([$userId, $email, $eventType, $ip, $ua, mb_substr($detail, 0, 500, 'UTF-8')]);
    }

    public function registerCustomer(string $fullName, string $email, string $phone, string $password): array
    {
        $cleanEmail = strtolower(trim($email));
        $cleanPhone = $this->normalizePhone($phone);
        $dbPhone = $cleanPhone !== '' ? $cleanPhone : null;

        if ($this->findByEmail($cleanEmail)) {
            return ['ok' => false, 'message' => 'Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.'];
        }
        if ($dbPhone !== null) {
            $pCheck = $this->db->prepare('SELECT id FROM users WHERE phone = ? LIMIT 1');
            $pCheck->execute([$dbPhone]);
            if ($pCheck->fetch()) {
                return ['ok' => false, 'message' => 'Số điện thoại này đã được đăng ký. Vui lòng dùng số khác hoặc đăng nhập.'];
            }
        }

        // Luôn validate bằng OOP Entity
        new Customer(0, $fullName, $cleanEmail, $cleanPhone);

        $hash = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $this->db->prepare(
            'INSERT INTO users (full_name, email, phone, password_hash, role, is_super_admin, token_version) VALUES (?, ?, ?, ?, ?, 0, 1)'
        );
        $stmt->execute([trim($fullName), $cleanEmail, $dbPhone, $hash, 'customer']);
        $newId = (int) $this->db->lastInsertId();

        $user = $this->findById($newId);
        $this->logSecurity($newId, $cleanEmail, 'register', 'Đăng ký tài khoản khách hàng mới.');
        return ['ok' => true, 'user' => $user, 'message' => 'Đăng ký tài khoản thành công!'];
    }

    public function authenticate(string $identifier, string $password): array
    {
        $user = $this->findByEmailOrPhone($identifier);
        $cleanEmail = $user ? strtolower((string) $user['email']) : strtolower(trim($identifier));

        if (!$user) {
            return ['ok' => false, 'code' => 401, 'message' => 'Email/SĐT hoặc mật khẩu không chính xác.'];
        }

        if (!empty($user['lock_until']) && strtotime((string) $user['lock_until']) > time()) {
            $remainMin = (int) ceil((strtotime((string) $user['lock_until']) - time()) / 60);
            return [
                'ok' => false,
                'code' => 429,
                'message' => "Tài khoản đang tạm khóa để bảo vệ an toàn. Vui lòng thử lại sau {$remainMin} phút hoặc liên hệ Super Admin.",
            ];
        }

        if (!password_verify($password, (string) $user['password_hash'])) {
            $attempts = (int) $user['failed_attempts'] + 1;
            $maxAttempts = 5;
            if ($attempts >= $maxAttempts) {
                $lockUntil = date('Y-m-d H:i:s', time() + 1800);
                $upd = $this->db->prepare('UPDATE users SET failed_attempts = ?, lock_until = ? WHERE id = ?');
                $upd->execute([$attempts, $lockUntil, (int) $user['id']]);
                $this->logSecurity((int) $user['id'], $cleanEmail, 'account_locked', "Sai mật khẩu {$attempts} lần liên tiếp — tự động khóa 30 phút.");
                return [
                    'ok' => false,
                    'code' => 429,
                    'message' => 'Bạn đã nhập sai mật khẩu quá 5 lần. Tài khoản tạm khóa 30 phút.',
                ];
            }

            $upd = $this->db->prepare('UPDATE users SET failed_attempts = ? WHERE id = ?');
            $upd->execute([$attempts, (int) $user['id']]);
            $this->logSecurity((int) $user['id'], $cleanEmail, 'login_failed', "Đăng nhập thất bại lần {$attempts}/{$maxAttempts}.");
            return ['ok' => false, 'code' => 401, 'message' => 'Email/SĐT hoặc mật khẩu không chính xác.'];
        }

        $upd = $this->db->prepare('UPDATE users SET failed_attempts = 0, lock_until = NULL WHERE id = ?');
        $upd->execute([(int) $user['id']]);

        if (($user['role'] ?? '') === 'admin' || ($user['role'] ?? '') === 'staff') {
            $this->logSecurity((int) $user['id'], $cleanEmail, 'privileged_login', 'Đăng nhập khu vực điều hành (' . $user['role'] . ').');
        }

        return ['ok' => true, 'user' => $this->findById((int) $user['id']), 'message' => 'Đăng nhập thành công!'];
    }

    public function createOtp(string $email): array
    {
        $cleanEmail = strtolower(trim($email));
        $user = $this->findByEmail($cleanEmail);
        if (!$user) {
            return ['ok' => false, 'code' => 404, 'message' => 'Không tìm thấy tài khoản gắn với email này.'];
        }

        $stmt = $this->db->prepare('SELECT cooldown_until FROM otp_tokens WHERE email = ? ORDER BY id DESC LIMIT 1');
        $stmt->execute([$cleanEmail]);
        $last = $stmt->fetch();
        if ($last && strtotime((string) $last['cooldown_until']) > time()) {
            $wait = strtotime((string) $last['cooldown_until']) - time();
            return ['ok' => false, 'code' => 429, 'message' => "Vui lòng chờ {$wait} giây trước khi yêu cầu gửi lại mã OTP."];
        }

        $otpCode = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
        $otpHash = password_hash($otpCode, PASSWORD_BCRYPT);
        $expiresAt = date('Y-m-d H:i:s', time() + 600);
        $cooldownUntil = date('Y-m-d H:i:s', time() + 60);

        $ins = $this->db->prepare(
            'INSERT INTO otp_tokens (email, otp_hash, purpose, expires_at, cooldown_until) VALUES (?, ?, ?, ?, ?)'
        );
        $ins->execute([$cleanEmail, $otpHash, 'forgot_password', $expiresAt, $cooldownUntil]);

        $mailRes = Mailer::sendOtp($cleanEmail, $otpCode, (string) $user['full_name']);
        
        // Không báo cấp OTP thành công nếu gửi mail thất bại trên production.
        $previewAllowed = in_array(
            (string) ($mailRes['mode'] ?? ''),
            ['local_preview', 'local_fallback'],
            true
        );

        if (empty($mailRes['sent']) && !$previewAllowed) {
            return [
                'ok' => false,
                'code' => 503,
                'message' => (string) ($mailRes['message'] ?? 'Dịch vụ gửi OTP tạm thời không khả dụng.'),
            ];
        }

        $this->logSecurity((int) $user['id'], $cleanEmail, 'otp_requested', 'Yêu cầu cấp mã OTP khôi phục mật khẩu.');

        return [
            'ok' => true,
            'code' => 200,
            'message' => $mailRes['message'],
            'dev_otp_preview' => $mailRes['dev_otp_preview'] ?? '',
        ];
    }

    public function verifyOtp(string $email, string $otpCode): array
    {
        $cleanEmail = strtolower(trim($email));
        $stmt = $this->db->prepare(
            'SELECT * FROM otp_tokens WHERE email = ? AND is_used = 0 ORDER BY id DESC LIMIT 1'
        );
        $stmt->execute([$cleanEmail]);
        $row = $stmt->fetch();

        if (!$row) {
            return ['ok' => false, 'message' => 'Mã OTP không tồn tại hoặc đã được sử dụng.'];
        }
        if (strtotime((string) $row['expires_at']) < time()) {
            return ['ok' => false, 'message' => 'Mã OTP đã hết hạn (quá 10 phút). Vui lòng gửi lại mã mới.'];
        }
        if ((int) $row['attempts'] >= 5) {
            return ['ok' => false, 'message' => 'Bạn đã nhập sai OTP quá 5 lần. Vui lòng yêu cầu mã OTP mới.'];
        }
        if (!password_verify(trim($otpCode), (string) $row['otp_hash'])) {
            $this->db->prepare('UPDATE otp_tokens SET attempts = attempts + 1 WHERE id = ?')->execute([(int) $row['id']]);
            return ['ok' => false, 'message' => 'Mã OTP không chính xác.'];
        }

        return ['ok' => true, 'otp_id' => (int) $row['id'], 'message' => 'Xác thực OTP thành công.'];
    }

    public function resetPasswordWithOtp(string $email, string $otpCode, string $newPassword): array
    {
        $check = $this->verifyOtp($email, $otpCode);
        if (!$check['ok']) {
            return $check;
        }
        $cleanEmail = strtolower(trim($email));
        $user = $this->findByEmail($cleanEmail);
        if (!$user) {
            return ['ok' => false, 'message' => 'Tài khoản không tồn tại.'];
        }

        $newHash = password_hash($newPassword, PASSWORD_BCRYPT);
        $this->db->beginTransaction();
        try {
            $this->db->prepare(
                'UPDATE users SET password_hash = ?, token_version = token_version + 1, failed_attempts = 0, lock_until = NULL WHERE id = ?'
            )->execute([$newHash, (int) $user['id']]);
            $this->db->prepare('UPDATE otp_tokens SET is_used = 1 WHERE id = ?')->execute([(int) $check['otp_id']]);
            $this->db->commit();
        } catch (Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }

        $this->logSecurity((int) $user['id'], $cleanEmail, 'password_reset', 'Đặt lại mật khẩu qua OTP và thu hồi toàn bộ phiên cũ (Force Logout).');
        return ['ok' => true, 'message' => 'Đặt lại mật khẩu thành công! Toàn bộ phiên cũ đã được đăng xuất để bảo vệ tài khoản.'];
    }

    public function updateProfile(int $userId, string $fullName, string $phone): array
    {
        $cleanName = trim($fullName);
        $cleanPhone = $this->normalizePhone($phone);
        $dbPhone = $cleanPhone !== '' ? $cleanPhone : null;

        if ($dbPhone !== null) {
            $pCheck = $this->db->prepare('SELECT id FROM users WHERE phone = ? AND id <> ? LIMIT 1');
            $pCheck->execute([$dbPhone, $userId]);
            if ($pCheck->fetch()) {
                return ['ok' => false, 'message' => 'Số điện thoại này đã được sử dụng bởi tài khoản khác.'];
            }
        }

        $stmt = $this->db->prepare('UPDATE users SET full_name = ?, phone = ? WHERE id = ?');
        $stmt->execute([$cleanName, $dbPhone, $userId]);
        return ['ok' => true, 'message' => 'Đã cập nhật thông tin cá nhân thành công!'];
    }

    public function changePassword(int $userId, string $currentPassword, string $newPassword): array
    {
        $user = $this->findById($userId);
        if (!$user || !password_verify($currentPassword, (string) $user['password_hash'])) {
            return ['ok' => false, 'message' => 'Mật khẩu hiện tại không chính xác.'];
        }
        $newHash = password_hash($newPassword, PASSWORD_BCRYPT);
        $stmt = $this->db->prepare('UPDATE users SET password_hash = ?, token_version = token_version + 1 WHERE id = ?');
        $stmt->execute([$newHash, $userId]);
        $updated = $this->findById($userId);
        if ($updated) {
            Rbac::loginUser($updated);
        }
        $this->logSecurity($userId, (string) $user['email'], 'password_change', 'Người dùng tự đổi mật khẩu.');
        return ['ok' => true, 'message' => 'Đổi mật khẩu thành công!'];
    }

    public function getAddresses(int $userId): array
    {
        $stmt = $this->db->prepare('SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC');
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    public function saveAddress(int $userId, array $data): array
    {
        $province = trim((string) ($data['province'] ?? ''));
        $district = trim((string) ($data['district'] ?? ''));
        $zoneType = ShippingService::resolveZone($province, $district);
        $isDefault = !empty($data['is_default']) ? 1 : 0;

        if ($isDefault) {
            $this->db->prepare('UPDATE user_addresses SET is_default = 0 WHERE user_id = ?')->execute([$userId]);
        }

        $stmt = $this->db->prepare(
            'INSERT INTO user_addresses (user_id, recipient_name, phone, province, district, ward, street_address, zone_type, is_default)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $userId,
            trim((string) ($data['recipient_name'] ?? '')),
            preg_replace('/[\s.-]/', '', trim((string) ($data['phone'] ?? ''))) ?? '',
            $province,
            $district,
            trim((string) ($data['ward'] ?? '')),
            trim((string) ($data['street_address'] ?? '')),
            $zoneType,
            $isDefault,
        ]);

        $newId = (int) $this->db->lastInsertId();
        $row = $this->db->prepare('SELECT * FROM user_addresses WHERE id = ?');
        $row->execute([$newId]);
        return $row->fetch() ?: [];
    }

    public function getAllUsers(): array
    {
        return $this->db->query(
            'SELECT id, full_name, email, phone, role, is_super_admin, failed_attempts, lock_until, created_at FROM users ORDER BY id DESC'
        )->fetchAll();
    }

    public function getSecurityLogs(int $limit = 30): array
    {
        $stmt = $this->db->prepare('SELECT * FROM security_logs ORDER BY id DESC LIMIT ?');
        $stmt->bindValue(1, $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function toggleLock(int $targetUserId, int $actorId): array
    {
        if ($targetUserId === $actorId) {
            return ['ok' => false, 'message' => 'Không thể tự khóa tài khoản đang đăng nhập.'];
        }
        $target = $this->findById($targetUserId);
        if (!$target) {
            return ['ok' => false, 'message' => 'Không tìm thấy tài khoản.'];
        }
        $isLocked = !empty($target['lock_until']) && strtotime((string) $target['lock_until']) > time();
        if ($isLocked) {
            $this->db->prepare('UPDATE users SET failed_attempts = 0, lock_until = NULL WHERE id = ?')->execute([$targetUserId]);
            $this->logSecurity($actorId, (string) $target['email'], 'admin_unlock', 'Mở khóa tài khoản ' . $target['email']);
            return ['ok' => true, 'locked' => false, 'message' => 'Đã mở khóa tài khoản thành công.'];
        }

        $lockUntil = date('Y-m-d H:i:s', time() + 86400 * 30);
        $this->db->prepare('UPDATE users SET lock_until = ?, token_version = token_version + 1 WHERE id = ?')->execute([$lockUntil, $targetUserId]);
        $this->logSecurity($actorId, (string) $target['email'], 'admin_lock', 'Khóa tài khoản ' . $target['email']);
        return ['ok' => true, 'locked' => true, 'message' => 'Đã khóa tài khoản và đăng xuất mọi phiên hoạt động.'];
    }

    public function createPrivilegedAccount(string $fullName, string $email, string $phone, string $password, string $role): array
    {
        $cleanEmail = strtolower(trim($email));
        $cleanPhone = $this->normalizePhone($phone);
        $dbPhone = $cleanPhone !== '' ? $cleanPhone : null;

        if ($this->findByEmail($cleanEmail)) {
            return ['ok' => false, 'message' => 'Email này đã tồn tại trên hệ thống.'];
        }
        if ($dbPhone !== null) {
            $pCheck = $this->db->prepare('SELECT id FROM users WHERE phone = ? LIMIT 1');
            $pCheck->execute([$dbPhone]);
            if ($pCheck->fetch()) {
                return ['ok' => false, 'message' => 'Số điện thoại này đã tồn tại trên hệ thống.'];
            }
        }
        if (!in_array($role, ['staff', 'admin'], true)) {
            return ['ok' => false, 'message' => 'Vai trò chỉ có thể là Staff hoặc Admin.'];
        }
        $hash = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $this->db->prepare(
            'INSERT INTO users (full_name, email, phone, password_hash, role, is_super_admin, token_version) VALUES (?, ?, ?, ?, ?, 0, 1)'
        );
        $stmt->execute([trim($fullName), $cleanEmail, $dbPhone, $hash, $role]);
        $id = (int) $this->db->lastInsertId();
        $this->logSecurity($id, $cleanEmail, 'create_privileged', "Super Admin đã tạo tài khoản {$role}: {$cleanEmail}");
        return ['ok' => true, 'user' => $this->findById($id), 'message' => 'Đã tạo tài khoản ' . strtoupper($role) . ' thành công!'];
    }
}
