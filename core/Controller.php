<?php
declare(strict_types=1);

/**
 * Controller
 * Lớp cơ sở cho mọi Controller MVC, cung cấp view(), model() và jsonResponse() chuẩn Envelope.
 */
abstract class Controller
{
    protected array $appConfig;

    public function __construct()
    {
        $this->appConfig = require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'app.php';
    }

    protected function model(string $modelName, ?PDO $db = null): object
    {
        $modelFile = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . $modelName . '.php';
        if (!is_file($modelFile)) {
            throw new RuntimeException("Model không tồn tại: {$modelName}");
        }
        require_once $modelFile;
        return new $modelName($db);
    }

    protected function view(string $viewName, array $data = [], ?string $layout = 'main'): void
    {
        $viewFile = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'views' . DIRECTORY_SEPARATOR . str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $viewName) . '.php';
        if (!is_file($viewFile)) {
            throw new RuntimeException("View không tồn tại: {$viewName}");
        }

        $currentUser = Rbac::currentUser();
        $appConfig = $this->appConfig;
        extract($data, EXTR_SKIP);

        if ($layout === null) {
            require $viewFile;
            return;
        }

        $viewsRoot = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'views' . DIRECTORY_SEPARATOR;
        require $viewsRoot . 'layouts' . DIRECTORY_SEPARATOR . 'header.php';
        require $viewsRoot . 'layouts' . DIRECTORY_SEPARATOR . 'navbar.php';
        require $viewFile;
        require $viewsRoot . 'layouts' . DIRECTORY_SEPARATOR . 'footer.php';
    }

    protected function jsonResponse(string $status, int $code, mixed $data = [], string $message = ''): never
    {
        while (ob_get_level() > 0) {
            @ob_end_clean();
        }

        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        header('X-Content-Type-Options: nosniff');

        echo json_encode([
            'status' => $status,
            'code' => $code,
            'data' => $data,
            'message' => $message,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    protected function jsonInput(): array
    {
        $raw = App::getRawBody();
        if ($raw !== '') {
            $parsed = json_decode($raw, true);
            if (is_array($parsed)) {
                return $parsed;
            }
        }
        return $_POST;
    }

    protected function requireCsrfJson(): void
    {
        if (!Csrf::verifyRequest()) {
            $this->jsonResponse('error', 403, [], 'Phiên làm việc hết hạn hoặc mã CSRF không hợp lệ. Vui lòng tải lại trang.');
        }
    }

    protected function requirePostJson(): void
    {
        if (strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET')) !== 'POST') {
            $this->jsonResponse('error', 405, [], 'Phương thức HTTP không được hỗ trợ.');
        }
        $this->requireCsrfJson();
    }

    protected function redirect(string $path, int $status = 302): never
    {
        while (ob_get_level() > 0) {
            ob_end_clean();
        }
        http_response_code($status);
        header('Location: ' . App::url($path));
        exit;
    }
}
