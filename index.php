<?php
declare(strict_types=1);

/**
 * BakeMate Front Controller (index.php)
 * Điểm vào duy nhất: nạp cấu hình, autoload, múi giờ, bộ đệm xuất, Session & điều phối MVC.
 */

$rootDir = __DIR__;

// Hỗ trợ phục vụ tĩnh an toàn và chuyển hướng các link *.html sang tuyến đường PHP MVC
if (PHP_SAPI === 'cli-server') {
    $reqPath = (string) parse_url((string) ($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH);
    if (preg_match('#^/(\.env|\.git|config/|core/|database/|models/|controllers/|views/|.*\.(sql|md|log)$)#i', $reqPath)) {
        http_response_code(403);
        echo '403 Forbidden';
        return true;
    }

    $htmlMap = [
        '/index.html' => '',
        '/products.html' => 'products',
        '/product-detail.html' => 'product-detail',
        '/recipes.html' => 'recipes',
        '/recipe-detail.html' => 'recipe-detail',
        '/cart.html' => 'cart',
        '/checkout.html' => 'checkout',
        '/order-success.html' => 'order-success',
        '/orders.html' => 'orders',
        '/wishlist.html' => 'wishlist',
        '/blog.html' => 'blog',
        '/blog-detail.html' => 'blog-detail',
        '/about.html' => 'about',
        '/contact.html' => 'contact',
        '/login.html' => 'login',
        '/register.html' => 'register',
        '/forgot-password.html' => 'forgot-password',
        '/admin.html' => 'admin',
    ];
    $lowerPath = strtolower($reqPath);
    if (isset($htmlMap[$lowerPath])) {
        $qs = (string) ($_SERVER['QUERY_STRING'] ?? '');
        $target = '/' . $htmlMap[$lowerPath] . ($qs !== '' ? '?' . $qs : '');
        header('Location: ' . $target, true, 302);
        return true;
    }

    $fileOnDisk = $rootDir . str_replace('/', DIRECTORY_SEPARATOR, $reqPath);
    if ($reqPath !== '/' && $reqPath !== '/index.php' && is_file($fileOnDisk)) {
        return false;
    }
}

spl_autoload_register(static function (string $className) use ($rootDir): void {
    $dirs = [
        $rootDir . DIRECTORY_SEPARATOR . 'core',
        $rootDir . DIRECTORY_SEPARATOR . 'models',
        $rootDir . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'entities',
        $rootDir . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'interfaces',
        $rootDir . DIRECTORY_SEPARATOR . 'controllers',
    ];
    foreach ($dirs as $dir) {
        $candidate = $dir . DIRECTORY_SEPARATOR . $className . '.php';
        if (is_file($candidate)) {
            require_once $candidate;
            return;
        }
    }
});

Env::load($rootDir . DIRECTORY_SEPARATOR . '.env');

$appConfig = require $rootDir . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'app.php';
date_default_timezone_set((string) ($appConfig['timezone'] ?? 'Asia/Ho_Chi_Minh'));

$isDebug = (bool) ($appConfig['debug'] ?? false);
set_exception_handler(static function (Throwable $e) use ($isDebug): void {
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
    http_response_code(500);
    if (App::isAjaxRequest()) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'status' => 'error',
            'code' => 500,
            'data' => $isDebug ? [
                'exception' => get_class($e),
                'file' => basename($e->getFile()),
                'line' => $e->getLine(),
            ] : new stdClass(),
            'message' => $isDebug ? $e->getMessage() : 'Hệ thống đang bận, vui lòng thử lại sau.',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return;
    }
    header('Content-Type: text/html; charset=utf-8');
    $detail = $isDebug
        ? '<p><code>' . App::e(get_class($e) . ': ' . $e->getMessage() . ' (' . basename($e->getFile()) . ':' . $e->getLine() . ')') . '</code></p>'
        : '<p>Vui lòng quay lại sau hoặc liên hệ quản trị viên BakeMate.</p>';
    echo '<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><title>500 - Lỗi hệ thống | BakeMate</title></head><body><h1>500 - Đã xảy ra lỗi máy chủ</h1>' . $detail . '</body></html>';
});

ob_start();
App::initSession();

$app = new App();
$app->dispatch();
