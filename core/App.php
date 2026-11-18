<?php
declare(strict_types=1);

/**
 * App
 * Front Controller điều phối tuyến đường (?c=...&a=... và Clean URL),
 * quản lý Session, URL Helper, Asset Cache-busting và Escape XSS.
 */
class App
{
    private static ?string $rawBodyCache = null;

    private const CLEAN_ROUTES = [
        '' => ['home', 'index'],
        'index' => ['home', 'index'],
        'home' => ['home', 'index'],
        'about' => ['home', 'about'],
        'contact' => ['home', 'contact'],
        'blog' => ['home', 'blog'],
        'blog-detail' => ['home', 'blogDetail'],
        'products' => ['product', 'catalog'],
        'product-detail' => ['product', 'detail'],
        'wishlist' => ['product', 'wishlist'],
        'recipes' => ['recipe', 'index'],
        'recipe-detail' => ['recipe', 'detail'],
        'cart' => ['order', 'cart'],
        'checkout' => ['order', 'checkout'],
        'order-success' => ['order', 'orderSuccess'],
        'orders' => ['order', 'orders'],
        'login' => ['auth', 'login'],
        'register' => ['auth', 'register'],
        'forgot-password' => ['auth', 'forgotPassword'],
        'logout' => ['auth', 'logout'],
        'profile' => ['auth', 'profile'],
        'staff' => ['staff', 'index'],
        'admin' => ['admin', 'index'],
    ];

    private const CONTROLLER_MAP = [
        'home' => 'HomeController',
        'product' => 'ProductController',
        'recipe' => 'RecipeController',
        'order' => 'OrderController',
        'auth' => 'AuthController',
        'staff' => 'StaffController',
        'admin' => 'AdminController',
    ];

    public static function initSession(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }

        $isHttps = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
        session_set_cookie_params([
            'lifetime' => 0,
            'path' => self::basePath() === '' ? '/' : self::basePath() . '/',
            'domain' => '',
            'secure' => $isHttps,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        session_name('BAKEMATESESSID');
        @session_start();
    }

    public static function getRawBody(): string
    {
        if (self::$rawBodyCache === null) {
            $raw = @file_get_contents('php://input');
            self::$rawBodyCache = is_string($raw) ? $raw : '';
        }
        return self::$rawBodyCache;
    }

    public static function basePath(): string
    {
        $configured = rtrim((string) Env::get('APP_URL', ''), '/');
        if ($configured !== '') {
            $path = (string) parse_url($configured, PHP_URL_PATH);
            return rtrim($path, '/');
        }
        $scriptName = str_replace('\\', '/', (string) ($_SERVER['SCRIPT_NAME'] ?? '/index.php'));
        $dir = str_replace('\\', '/', dirname($scriptName));
        if ($dir === '/' || $dir === '.' || $dir === '\\') {
            return '';
        }
        return rtrim($dir, '/');
    }

    public static function url(string $path = ''): string
    {
        $base = self::basePath();
        $clean = ltrim($path, '/');
        if ($clean === '') {
            return $base === '' ? '/' : $base . '/';
        }
        if (str_starts_with($clean, '?')) {
            return ($base === '' ? '' : $base) . '/index.php' . $clean;
        }
        return ($base === '' ? '' : $base) . '/' . $clean;
    }

    public static function asset(string $relativePath): string
    {
        $clean = ltrim($relativePath, '/');
        if (!str_starts_with($clean, 'public/')) {
            $publicCandidate = 'public/' . $clean;
            $full = dirname(__DIR__) . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $publicCandidate);
            if (is_file($full)) {
                $clean = $publicCandidate;
            }
        }
        $fullPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $clean);
        $version = is_file($fullPath) ? '?v=' . filemtime($fullPath) : '';
        return self::url($clean) . $version;
    }

    public static function e(mixed $value): string
    {
        return htmlspecialchars((string) ($value ?? ''), ENT_QUOTES, 'UTF-8');
    }

    public static function isAjaxRequest(): bool
    {
        $requestedWith = strtolower((string) ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? ''));
        $accept = strtolower((string) ($_SERVER['HTTP_ACCEPT'] ?? ''));
        $contentType = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
        $action = (string) ($_GET['a'] ?? '');

        return $requestedWith === 'xmlhttprequest'
            || str_contains($accept, 'application/json')
            || str_contains($contentType, 'application/json')
            || str_starts_with($action, 'ajax');
    }

    public static function formatCurrency(int|float|string $amount): string
    {
        return number_format((float) $amount, 0, ',', '.') . ' ₫';
    }

    public static function resolveRoute(): array
    {
        $c = trim((string) ($_GET['c'] ?? ''));
        $a = trim((string) ($_GET['a'] ?? ''));

        if ($c !== '') {
            $c = strtolower($c);
            $a = $a !== '' ? $a : 'index';
            return [$c, $a];
        }

        $routeParam = trim((string) ($_GET['route'] ?? ''), '/');
        if ($routeParam === '') {
            $uriPath = (string) parse_url((string) ($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH);
            $base = self::basePath();
            if ($base !== '' && str_starts_with($uriPath, $base)) {
                $uriPath = substr($uriPath, strlen($base));
            }
            $routeParam = trim($uriPath, '/');
            if ($routeParam === 'index.php') {
                $routeParam = '';
            }
        }

        $routeKey = strtolower($routeParam);
        $routeKey = preg_replace('/\.php$/', '', $routeKey) ?? $routeKey;

        if (isset(self::CLEAN_ROUTES[$routeKey])) {
            return self::CLEAN_ROUTES[$routeKey];
        }

        // Hỗ trợ dạng ?route=controller/action
        if (str_contains($routeParam, '/')) {
            $parts = explode('/', $routeParam, 2);
            $segC = strtolower(trim($parts[0]));
            $segA = trim($parts[1]);
            if (isset(self::CONTROLLER_MAP[$segC])) {
                return [$segC, $segA !== '' ? $segA : 'index'];
            }
        }

        return ['home', 'notFound'];
    }

    public function dispatch(): void
    {
        [$controllerKey, $action] = self::resolveRoute();
        $controllerClass = self::CONTROLLER_MAP[$controllerKey] ?? 'HomeController';
        if (!isset(self::CONTROLLER_MAP[$controllerKey])) {
            $action = 'notFound';
        }

        $controllerFile = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'controllers' . DIRECTORY_SEPARATOR . $controllerClass . '.php';
        if (!is_file($controllerFile)) {
            http_response_code(404);
            echo 'Controller not found.';
            return;
        }
        require_once $controllerFile;

        $controller = new $controllerClass();
        if (str_starts_with($action, '__') || !method_exists($controller, $action) || !is_callable([$controller, $action])) {
            $action = 'notFound';
            $controller = new HomeController();
        }

        $routePermissionKey = $controllerKey . '.' . $action;
        if (!str_starts_with($action, 'ajax')) {
            Rbac::checkPagePermission($routePermissionKey);
        }

        $controller->{$action}();
    }
}
