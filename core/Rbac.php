<?php
declare(strict_types=1);

/**
 * Rbac
 * Quản lý phân quyền Role-Based Access Control (guest, customer, staff, admin)
 * kèm kiểm tra token_version từ DB và ràng buộc IP/User-Agent cho Admin.
 */
class Rbac
{
    private const SESSION_KEY = 'bakemate_auth_user';

    /**
     * Bản đồ quyền truy cập trang & API theo vai trò.
     */
    public const PAGE_PERMISSIONS = [
        'home.index' => ['guest', 'customer', 'staff', 'admin'],
        'home.about' => ['guest', 'customer', 'staff', 'admin'],
        'home.contact' => ['guest', 'customer', 'staff', 'admin'],
        'home.blog' => ['guest', 'customer', 'staff', 'admin'],
        'home.blogDetail' => ['guest', 'customer', 'staff', 'admin'],
        'product.catalog' => ['guest', 'customer', 'staff', 'admin'],
        'product.detail' => ['guest', 'customer', 'staff', 'admin'],
        'product.wishlist' => ['guest', 'customer', 'staff', 'admin'],
        'recipe.index' => ['guest', 'customer', 'staff', 'admin'],
        'recipe.detail' => ['guest', 'customer', 'staff', 'admin'],
        'order.cart' => ['guest', 'customer', 'staff', 'admin'],
        'order.checkout' => ['guest', 'customer', 'staff', 'admin'],
        'order.orderSuccess' => ['guest', 'customer', 'staff', 'admin'],
        'order.orders' => ['guest', 'customer', 'staff', 'admin'],
        'auth.login' => ['guest', 'customer', 'staff', 'admin'],
        'auth.register' => ['guest', 'customer', 'staff', 'admin'],
        'auth.forgotPassword' => ['guest', 'customer', 'staff', 'admin'],
        'auth.profile' => ['customer', 'staff', 'admin'],
        'staff.index' => ['staff', 'admin'],
        'admin.index' => ['admin'],
    ];

    public static function normalizeIp(?string $ip): string
    {
        $raw = trim((string) $ip);
        if ($raw === '' || $raw === '::1') {
            return '127.0.0.1';
        }
        return $raw;
    }

    public static function normalizeUa(?string $ua): string
    {
        return substr(trim((string) $ua), 0, 180);
    }

    public static function loginUser(array $user): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            @session_regenerate_id(true);
        }

        $_SESSION[self::SESSION_KEY] = [
            'id' => (int) ($user['id'] ?? 0),
            'full_name' => (string) ($user['full_name'] ?? ''),
            'email' => (string) ($user['email'] ?? ''),
            'phone' => (string) ($user['phone'] ?? ''),
            'role' => (string) ($user['role'] ?? 'customer'),
            'is_super_admin' => (bool) ($user['is_super_admin'] ?? false),
            'token_version' => (int) ($user['token_version'] ?? 1),
            'ip' => self::normalizeIp($_SERVER['REMOTE_ADDR'] ?? ''),
            'ua' => self::normalizeUa($_SERVER['HTTP_USER_AGENT'] ?? ''),
        ];
    }

    public static function logoutUser(): void
    {
        unset($_SESSION[self::SESSION_KEY]);
        if (session_status() === PHP_SESSION_ACTIVE) {
            @session_regenerate_id(true);
        }
    }

    public static function currentUser(): ?array
    {
        if (session_status() !== PHP_SESSION_ACTIVE || empty($_SESSION[self::SESSION_KEY])) {
            return null;
        }

        $sess = $_SESSION[self::SESSION_KEY];
        $userId = (int) ($sess['id'] ?? 0);
        if ($userId <= 0) {
            unset($_SESSION[self::SESSION_KEY]);
            return null;
        }

        // Chống Session Hijacking cho phiên Quản trị viên bằng IP + User-Agent
        if (($sess['role'] ?? '') === 'admin') {
            $curIp = self::normalizeIp($_SERVER['REMOTE_ADDR'] ?? '');
            $curUa = self::normalizeUa($_SERVER['HTTP_USER_AGENT'] ?? '');
            if (($sess['ip'] ?? '') !== $curIp || ($sess['ua'] ?? '') !== $curUa) {
                unset($_SESSION[self::SESSION_KEY]);
                return null;
            }
        }

        // Kiểm tra token_version & trạng thái khóa từ DB
        try {
            $pdo = Database::getInstance();
            $stmt = $pdo->prepare('SELECT id, full_name, email, phone, role, is_super_admin, token_version, lock_until FROM users WHERE id = ? LIMIT 1');
            $stmt->execute([$userId]);
            $row = $stmt->fetch();
            if (!$row) {
                unset($_SESSION[self::SESSION_KEY]);
                return null;
            }
            if ((int) $row['token_version'] !== (int) ($sess['token_version'] ?? 0)) {
                unset($_SESSION[self::SESSION_KEY]);
                return null;
            }
            if (!empty($row['lock_until']) && strtotime((string) $row['lock_until']) > time()) {
                unset($_SESSION[self::SESSION_KEY]);
                return null;
            }

            $_SESSION[self::SESSION_KEY]['full_name'] = (string) $row['full_name'];
            $_SESSION[self::SESSION_KEY]['email'] = (string) $row['email'];
            $_SESSION[self::SESSION_KEY]['phone'] = (string) ($row['phone'] ?? '');
            $_SESSION[self::SESSION_KEY]['role'] = (string) $row['role'];
            $_SESSION[self::SESSION_KEY]['is_super_admin'] = (bool) $row['is_super_admin'];
            return $_SESSION[self::SESSION_KEY];
        } catch (Throwable $e) {
            return $sess;
        }
    }

    public static function currentRole(): string
    {
        $u = self::currentUser();
        return $u ? (string) $u['role'] : 'guest';
    }

    public static function checkPagePermission(string $routeKey): void
    {
        if (isset(self::PAGE_PERMISSIONS[$routeKey])) {
            $allowed = self::PAGE_PERMISSIONS[$routeKey];
        } elseif (str_starts_with($routeKey, 'admin.')) {
            $allowed = ['admin'];
        } elseif (str_starts_with($routeKey, 'staff.')) {
            $allowed = ['staff', 'admin'];
        } else {
            return;
        }
        $role = self::currentRole();
        if (!in_array($role, $allowed, true)) {
            if ($role === 'guest') {
                $target = urlencode((string) ($_SERVER['REQUEST_URI'] ?? ''));
                header('Location: ' . App::url('?c=auth&a=login&redirect=' . $target));
                exit;
            }
            http_response_code(403);
            $viewsRoot = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'views' . DIRECTORY_SEPARATOR;
            $currentUser = self::currentUser();
            $pageTitle = 'Không có quyền truy cập | BakeMate';
            $activeNav = '';
            $errorTitle = 'Bạn không có quyền truy cập khu vực này';
            $errorDesc = 'Trang bạn yêu cầu dành riêng cho ' . implode(' / ', array_map('strtoupper', $allowed)) . '. Tài khoản hiện tại của bạn đang có vai trò ' . strtoupper($role) . '.';
            require $viewsRoot . 'layouts' . DIRECTORY_SEPARATOR . 'header.php';
            require $viewsRoot . 'layouts' . DIRECTORY_SEPARATOR . 'navbar.php';
            require $viewsRoot . 'pages' . DIRECTORY_SEPARATOR . '403.php';
            require $viewsRoot . 'layouts' . DIRECTORY_SEPARATOR . 'footer.php';
            exit;
        }
    }

    public static function requireRolesJson(array $allowedRoles): array
    {
        $user = self::currentUser();
        if (!$user || !in_array((string) $user['role'], $allowedRoles, true)) {
            while (ob_get_level() > 0) {
                @ob_end_clean();
            }
            $code = $user ? 403 : 401;
            $msg = $user
                ? 'Tài khoản của bạn không có quyền thực hiện thao tác này.'
                : 'Vui lòng đăng nhập để tiếp tục.';
            http_response_code($code);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => 'error',
                'code' => $code,
                'data' => [],
                'message' => $msg,
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
        return $user;
    }
}
