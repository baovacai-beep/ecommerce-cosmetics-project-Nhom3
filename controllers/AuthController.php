<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR . 'Controller.php';

class AuthController extends Controller
{
    
private function sanitizeRedirect(string $redirect): string
{
    $clean = trim($redirect);

    // Không cho phép giá trị rỗng hoặc ký tự điều khiển.
    if ($clean === '' || preg_match('/[\x00-\x1F\x7F]/', $clean)) {
        return '';
    }

   
    // Chặn backslash và đường dẫn bắt đầu bằng //.
    if (str_contains($clean, '\\') || str_starts_with($clean, '//')) {
        return '';
    }


    // Chặn URL tuyệt đối, URL có giao thức và URL bắt đầu bằng //.
    if (
        str_starts_with($clean, '//')
        || preg_match('/^[a-z][a-z0-9+.-]*:/i', $clean)
    ) {
        return '';
    }

    // Chỉ chấp nhận đường dẫn nội bộ bắt đầu bằng /.
    if (!str_starts_with($clean, '/')) {
        return '';
    }

    // Chặn một số dạng mã hóa có thể làm thay đổi cách hiểu URL.
    if (preg_match('/%(?:2f|5c|0[0-9a-f]|1[0-9a-f]|7f)/i', $clean)) {
        return '';
    }

    // Đảm bảo đường dẫn thuộc ứng dụng BakeMate.
    $base = App::basePath();

    if (
        $base !== ''
        && $clean !== $base
        && !str_starts_with($clean, $base . '/')
    ) {
        return '';
    }

    // Không chuyển hướng vòng lặp về các trang đăng nhập/đăng ký/đăng xuất.
    $lower = strtolower($clean);
    if (
        str_ends_with($lower, '/login')
        || str_ends_with($lower, '/register')
        || str_ends_with($lower, '/logout')
        || preg_match('/[?&]c=auth&a=(?:login|register|logout)(?:&|$)/i', $lower)
    ) {
        return '';
    }

    return $clean;
}

private function normalizeVnPhone(string $raw): string
{
    $clean = preg_replace('/[\s.-]/', '', trim($raw)) ?? '';
    if (str_starts_with($clean, '+84')) {
        $clean = '0' . substr($clean, 3);
    } elseif (str_starts_with($clean, '84') && strlen($clean) === 11) {
        $clean = '0' . substr($clean, 2);
    }
    return $clean;
}


    public function login(): void
    {
        $user = Rbac::currentUser();
        if ($user) {
            $target = $user['role'] === 'admin'
                ? App::url('?c=admin&a=index')
                : ($user['role'] === 'staff' ? App::url('?c=staff&a=index') : App::url(''));
            header('Location: ' . $target);
            exit;
        }

        $integrations = require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'integrations.php';
        $googleClientId = (string) ($integrations['google_oauth']['client_id'] ?? '');

        $this->view('pages/login', [
            'pageTitle' => 'Đăng nhập | BakeMate',
            'activeNav' => '',
            'googleClientId' => $googleClientId,
            'redirect' => $this->sanitizeRedirect((string) ($_GET['redirect'] ?? '')),
        ]);
    }

    public function register(): void
    {
        if (Rbac::currentUser()) {
            header('Location: ' . App::url(''));
            exit;
        }

        $integrations = require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'integrations.php';
        $googleClientId = (string) ($integrations['google_oauth']['client_id'] ?? '');

        $this->view('pages/register', [
            'pageTitle' => 'Đăng ký tài khoản | BakeMate',
            'activeNav' => '',
            'googleClientId' => $googleClientId,
        ]);
    }

    public function forgotPassword(): void
    {
        $this->view('pages/forgot-password', [
            'pageTitle' => 'Quên mật khẩu & Xác thực OTP | BakeMate',
            'activeNav' => '',
        ]);
    }

    public function profile(): void
    {
        $user = Rbac::currentUser();
        if (!$user) {
            header('Location: ' . App::url('?c=auth&a=login'));
            exit;
        }
        $userModel = $this->model('UserModel');
        $addresses = $userModel->getAddresses((int) $user['id']);

        $this->view('pages/profile', [
            'pageTitle' => 'Hồ sơ tài khoản | BakeMate',
            'activeNav' => '',
            'profileUser' => $user,
            'addresses' => $addresses,
            'locationsJson' => json_encode(ShippingService::VN_LOCATIONS, JSON_UNESCAPED_UNICODE),
        ]);
    }

    public function logout(): void
    {
        Rbac::logoutUser();
        header('Location: ' . App::url(''));
        exit;
    }

    public function ajaxLogin(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $email = trim((string) ($in['identifier'] ?? $in['email'] ?? ''));
        $password = (string) ($in['password'] ?? '');
        $redirect = $this->sanitizeRedirect((string) ($in['redirect'] ?? ''));

        if ($email === '' || $password === '') {
            $this->jsonResponse('error', 422, [], 'Vui lòng nhập đầy đủ email/SĐT và mật khẩu.');
        }

        $userModel = $this->model('UserModel');
        $res = $userModel->authenticate($email, $password);
        if (!$res['ok']) {
            $this->jsonResponse('error', (int) ($res['code'] ?? 401), [], $res['message']);
        }

        $user = $res['user'];
        Rbac::loginUser($user);

        // Đồng bộ giỏ hàng & yêu thích từ Guest Session sang DB tài khoản
        try {
            $orderModel = $this->model('OrderModel');
            $contentModel = $this->model('ContentModel');
            $orderModel->mergeGuestCartToDb((int) $user['id']);
            $contentModel->mergeGuestWishlistToDb((int) $user['id']);
        } catch (Throwable $e) {
            // Giữ đăng nhập thành công ngay cả khi giỏ tạm không có dữ liệu hợp lệ
        }

        $defaultRedirect = match ($user['role']) {
            'admin' => App::url('?c=admin&a=index'),
            'staff' => App::url('?c=staff&a=index'),
            default => App::url(''),
        };

        $this->jsonResponse('success', 200, [
            'role' => $user['role'],
            'redirect_url' => $redirect !== '' ? $redirect : $defaultRedirect,
        ], 'Đăng nhập thành công! Chào mừng ' . $user['full_name']);
    }

    /**
     * Xác thực và đăng nhập/đăng ký bằng Google OAuth (Google Identity Services)
     */
    public function ajaxGoogleLogin(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $credential = trim((string) ($in['credential'] ?? ''));
        $redirect = $this->sanitizeRedirect((string) ($in['redirect'] ?? ''));

        if ($credential === '') {
            $this->jsonResponse('error', 422, [], 'Không nhận được mã xác thực từ Google.');
        }

        $integrations = require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'integrations.php';
        $clientId = trim((string) ($integrations['google_oauth']['client_id'] ?? ''));

        if ($clientId === '') {
            $this->jsonResponse('error', 500, [], 'Hệ thống chưa cấu hình GOOGLE_CLIENT_ID trong .env.');
        }

        // Xác minh ID Token hoặc Access Token trực tiếp qua Google API
        $isAccessToken = !empty($in['access_token_mode']);
        if ($isAccessToken) {
            $verifyUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
            $context = stream_context_create([
                'http' => [
                    'header' => "Authorization: Bearer " . $credential,
                    'timeout' => 8,
                    'ignore_errors' => true,
                ]
            ]);
            $response = @file_get_contents($verifyUrl, false, $context);
            $payload = is_string($response) ? json_decode($response, true) : null;
            if (!is_array($payload) || empty($payload['email'])) {
                $this->jsonResponse('error', 401, [], 'Access Token Google không hợp lệ hoặc đã hết hạn.');
            }
        } else {
            $verifyUrl = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($credential);
            $context = stream_context_create([
                'http' => [
                    'timeout' => 8,
                    'ignore_errors' => true,
                ]
            ]);
            $response = @file_get_contents($verifyUrl, false, $context);
            if ($response === false) {
                $this->jsonResponse('error', 502, [], 'Không thể kết nối đến máy chủ xác thực Google.');
            }

            $payload = json_decode($response, true);
            if (!is_array($payload) || ($payload['aud'] ?? '') !== $clientId) {
                $this->jsonResponse('error', 401, [], 'Mã xác thực Google không hợp lệ hoặc đã hết hạn.');
            }
        }

        $email = strtolower(trim((string) ($payload['email'] ?? '')));
        $fullName = trim((string) ($payload['name'] ?? ''));
        if ($email === '' || empty($payload['email_verified'])) {
            $this->jsonResponse('error', 422, [], 'Tài khoản Google chưa được xác minh email.');
        }

        if ($fullName === '') {
            $fullName = strstr($email, '@', true) ?: 'Khách hàng Google';
        }

        $userModel = $this->model('UserModel');
        $user = $userModel->findByEmail($email);

        // Nếu người dùng chưa tồn tại -> Tự động đăng ký tài khoản Customer mới
        if (!$user) {
            $randomPassword = bin2hex(random_bytes(16));
            $res = $userModel->registerCustomer($fullName, $email, '', $randomPassword);
            if (!$res['ok']) {
                $this->jsonResponse('error', 500, [], 'Không thể tạo tài khoản từ Google: ' . $res['message']);
            }
            $user = $res['user'];
        }

        // Đăng nhập vào phiên làm việc
        Rbac::loginUser($user);

        // Đồng bộ giỏ hàng & yêu thích từ phiên khách vào tài khoản
        try {
            $orderModel = $this->model('OrderModel');
            $contentModel = $this->model('ContentModel');
            $orderModel->mergeGuestCartToDb((int) $user['id']);
            $contentModel->mergeGuestWishlistToDb((int) $user['id']);
        } catch (Throwable $e) {
            // Không chặn đăng nhập
        }

        // Điều hướng theo phân quyền
        $role = (string) ($user['role'] ?? 'customer');
        $target = $redirect !== '' ? $redirect : ($role === 'admin' ? App::url('?c=admin&a=index') : App::url(''));

        $this->jsonResponse('success', 200, [
            'redirect_url' => $target,
            'user' => [
                'id' => $user['id'],
                'full_name' => $user['full_name'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ], 'Đăng nhập bằng tài khoản Google thành công!');
    }

    public function ajaxSendRegisterOtp(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $email = strtolower(trim((string) ($in['email'] ?? '')));
        $fullName = trim((string) ($in['full_name'] ?? ''));

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->jsonResponse('error', 422, [], 'Vui lòng nhập địa chỉ email hợp lệ.');
        }

        $userModel = $this->model('UserModel');
        if ($userModel->findByEmail($email)) {
            $this->jsonResponse('error', 409, [], 'Email này đã có tài khoản trên hệ thống. Vui lòng đăng nhập.');
        }

        $db = Database::getInstance();
        $lastOtp = $db->prepare('SELECT cooldown_until FROM otp_tokens WHERE email = ? AND purpose = "register" ORDER BY id DESC LIMIT 1');
        $lastOtp->execute([$email]);
        $row = $lastOtp->fetch();
        if ($row && !empty($row['cooldown_until']) && strtotime((string) $row['cooldown_until']) > time()) {
            $rem = strtotime((string) $row['cooldown_until']) - time();
            $this->jsonResponse('error', 429, [], "Vui lòng đợi {$rem} giây trước khi yêu cầu mã OTP mới.");
        }

        $otpCode = (string) random_int(100000, 999999);
        $otpHash = password_hash($otpCode, PASSWORD_DEFAULT);
        $expiresAt = date('Y-m-d H:i:s', time() + 300); // 5 phút
        $cooldownUntil = date('Y-m-d H:i:s', time() + 60); // 60 giây

        $stmt = $db->prepare('INSERT INTO otp_tokens (email, otp_hash, purpose, expires_at, cooldown_until) VALUES (?, ?, "register", ?, ?)');
        $stmt->execute([$email, $otpHash, $expiresAt, $cooldownUntil]);

        $mailRes = Mailer::sendOtp($email, $otpCode, $fullName, 'register');

        $this->jsonResponse('success', 200, [
            'dev_otp_preview' => $mailRes['dev_otp_preview'] ?? ''
        ], $mailRes['message']);
    }

    public function ajaxRegister(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();

        if (!TurnstileService::verify((string) ($in['cf_turnstile_response'] ?? ''))) {
            $this->jsonResponse('error', 400, [], 'Xác thực chống bot không thành công.');
        }

        $fullName = trim((string) ($in['full_name'] ?? ''));
        $email = strtolower(trim((string) ($in['email'] ?? '')));
        $phone = trim((string) ($in['phone'] ?? ''));
        $password = (string) ($in['password'] ?? '');
        $confirm = (string) ($in['confirm_password'] ?? '');
        $otpCode = trim((string) ($in['otp_code'] ?? ''));

        if (mb_strlen($fullName, 'UTF-8') < 2) {
            $this->jsonResponse('error', 422, [], 'Họ và tên phải có ít nhất 2 ký tự.');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->jsonResponse('error', 422, [], 'Địa chỉ email không hợp lệ.');
        }
        if ($otpCode === '') {
            $this->jsonResponse('error', 422, [], 'Vui lòng nhập mã OTP đã gửi qua email.');
        }

        // Xác thực mã OTP đăng ký từ bảng otp_tokens
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM otp_tokens WHERE email = ? AND purpose = "register" AND is_used = 0 ORDER BY id DESC LIMIT 1');
        $stmt->execute([$email]);
        $tokenRow = $stmt->fetch();

        if (!$tokenRow) {
            $this->jsonResponse('error', 422, [], 'Chưa có yêu cầu gửi mã OTP cho email này. Vui lòng bấm "Nhận mã OTP".');
        }
        if (strtotime((string) $tokenRow['expires_at']) < time()) {
            $this->jsonResponse('error', 422, [], 'Mã OTP đã hết hạn (5 phút). Vui lòng nhấn nhận mã mới.');
        }
        if ((int) ($tokenRow['attempts'] ?? 0) >= 5) {
            $this->jsonResponse('error', 429, [], 'Bạn đã nhập sai OTP quá 5 lần. Vui lòng yêu cầu mã mới.');
        }

        if (!password_verify($otpCode, (string) $tokenRow['otp_hash'])) {
            $db->prepare('UPDATE otp_tokens SET attempts = attempts + 1 WHERE id = ?')->execute([(int) $tokenRow['id']]);
            $this->jsonResponse('error', 422, [], 'Mã OTP không chính xác. Vui lòng kiểm tra lại email.');
        }

        // Đánh dấu mã OTP đã sử dụng
        $db->prepare('UPDATE otp_tokens SET is_used = 1 WHERE id = ?')->execute([(int) $tokenRow['id']]);

        $cleanPhone = $this->normalizeVnPhone($phone);
        if ($cleanPhone !== '' && !preg_match('/^(0[35789])[0-9]{8}$/', $cleanPhone)) {
            $this->jsonResponse('error', 422, [], 'Số điện thoại Việt Nam phải gồm 10 chữ số.');
        }
        if (strlen($password) < 8) {
            $this->jsonResponse('error', 422, [], 'Mật khẩu phải có ít nhất 8 ký tự.');
        }
        if ($password !== $confirm) {
            $this->jsonResponse('error', 422, [], 'Mật khẩu xác nhận không khớp.');
        }

        $userModel = $this->model('UserModel');
        $res = $userModel->registerCustomer($fullName, $email, $cleanPhone, $password);
        if (!$res['ok']) {
            $this->jsonResponse('error', 409, [], $res['message']);
        }

        $user = $res['user'];
        Rbac::loginUser($user);
        try {
            $this->model('OrderModel')->mergeGuestCartToDb((int) $user['id']);
            $this->model('ContentModel')->mergeGuestWishlistToDb((int) $user['id']);
        } catch (Throwable $e) {
            // Không chặn kết quả đăng ký mới
        }

        $this->jsonResponse('success', 200, ['redirect_url' => App::url('')], $res['message']);
    }

    public function ajaxSendOtp(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $email = trim((string) ($in['email'] ?? ''));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->jsonResponse('error', 422, [], 'Vui lòng nhập email hợp lệ.');
        }

        $res = $this->model('UserModel')->createOtp($email);
        if (!$res['ok']) {
            $this->jsonResponse('error', (int) ($res['code'] ?? 400), [], $res['message']);
        }
        $this->jsonResponse('success', 200, ['dev_otp_preview' => $res['dev_otp_preview']], $res['message']);
    }

    public function ajaxVerifyOtp(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $email = trim((string) ($in['email'] ?? ''));
        $otp = trim((string) ($in['otp_code'] ?? ''));

        $res = $this->model('UserModel')->verifyOtp($email, $otp);
        if (!$res['ok']) {
            $this->jsonResponse('error', 422, [], $res['message']);
        }
        $this->jsonResponse('success', 200, [], $res['message']);
    }

    public function ajaxResetPassword(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $email = trim((string) ($in['email'] ?? ''));
        $otp = trim((string) ($in['otp_code'] ?? ''));
        $password = (string) ($in['new_password'] ?? '');
        $confirm = (string) ($in['confirm_password'] ?? '');

        if (strlen($password) < 8 || $password !== $confirm) {
            $this->jsonResponse('error', 422, [], 'Mật khẩu mới tối thiểu 8 ký tự và phải khớp xác nhận.');
        }

        $res = $this->model('UserModel')->resetPasswordWithOtp($email, $otp, $password);
        if (!$res['ok']) {
            $this->jsonResponse('error', 422, [], $res['message']);
        }
        $this->jsonResponse('success', 200, ['redirect_url' => App::url('?c=auth&a=login')], $res['message']);
    }

    public function ajaxUpdateProfile(): void
    {
        $user = Rbac::requireRolesJson(['customer', 'staff', 'admin']);
        $this->requirePostJson();
        $in = $this->jsonInput();
        $fullName = trim((string) ($in['full_name'] ?? ''));
        $phone = $this->normalizeVnPhone((string) ($in['phone'] ?? ''));

        if (mb_strlen($fullName, 'UTF-8') < 2) {
            $this->jsonResponse('error', 422, [], 'Họ và tên phải có ít nhất 2 ký tự.');
        }
        if ($phone !== '' && !preg_match('/^(0[35789])[0-9]{8}$/', $phone)) {
            $this->jsonResponse('error', 422, [], 'Số điện thoại không đúng định dạng Việt Nam.');
        }

        $res = $this->model('UserModel')->updateProfile((int) $user['id'], $fullName, $phone);
        if (!$res['ok']) {
            $this->jsonResponse('error', 409, [], $res['message']);
        }
        $this->jsonResponse('success', 200, [], $res['message']);
    }

    public function ajaxChangePassword(): void
    {
        $user = Rbac::requireRolesJson(['customer', 'staff', 'admin']);
        $this->requirePostJson();
        $in = $this->jsonInput();
        $current = (string) ($in['current_password'] ?? '');
        $newPass = (string) ($in['new_password'] ?? '');
        $confirm = (string) ($in['confirm_password'] ?? '');

        if (strlen($newPass) < 8 || $newPass !== $confirm) {
            $this->jsonResponse('error', 422, [], 'Mật khẩu mới tối thiểu 8 ký tự và phải khớp xác nhận.');
        }

        $res = $this->model('UserModel')->changePassword((int) $user['id'], $current, $newPass);
        if (!$res['ok']) {
            $this->jsonResponse('error', 422, [], $res['message']);
        }
        $this->jsonResponse('success', 200, [], $res['message']);
    }
}
