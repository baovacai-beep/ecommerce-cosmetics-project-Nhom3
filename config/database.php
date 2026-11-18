<?php
declare(strict_types=1);

/**
 * Cấu hình kết nối CSDL đa môi trường (Localhost / Shared LAN / Production Hosting).
 */
$httpHost = strtolower((string) ($_SERVER['HTTP_HOST'] ?? 'localhost'));
$isLocalHost = in_array($httpHost, ['localhost', '127.0.0.1'], true)
    || str_starts_with($httpHost, 'localhost:')
    || str_starts_with($httpHost, '127.0.0.1:');

$lanHost = trim((string) Env::get('DB_LAN_HOST', ''));
$envName = strtolower((string) Env::get('APP_ENV', 'local'));

if ($envName === 'lan' && $lanHost !== '') {
    $detectedHost = $lanHost;
    $environmentMode = 'shared_lan';
} elseif ($isLocalHost || PHP_SAPI === 'cli') {
    $detectedHost = (string) Env::get('DB_HOST', '127.0.0.1');
    $environmentMode = 'localhost';
} else {
    $detectedHost = (string) Env::get('DB_HOST', 'localhost');
    $environmentMode = 'hosting';
}

return [
    'mode' => $environmentMode,
    'host' => $detectedHost,
    'port' => (int) Env::get('DB_PORT', 3306),
    'dbname' => (string) Env::get('DB_NAME', 'db_bakemate'),
    'username' => (string) Env::get('DB_USER', 'root'),
    'password' => (string) Env::get('DB_PASS', ''),
    'charset' => (string) Env::get('DB_CHARSET', 'utf8mb4'),
];
