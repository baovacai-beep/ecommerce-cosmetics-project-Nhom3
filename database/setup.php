<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('403 Forbidden: Script nay chi duoc phep chay qua CLI.');
}

$rootDir = dirname(__DIR__);
require_once $rootDir . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR . 'Env.php';
require_once $rootDir . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR . 'DatabaseBootstrap.php';

$envPath = $rootDir . DIRECTORY_SEPARATOR . '.env';
$envExample = $rootDir . DIRECTORY_SEPARATOR . '.env.example';
if (!is_file($envPath) && is_file($envExample)) {
    @copy($envExample, $envPath);
    echo "[INIT] Da tao file .env tu .env.example.\n";
}

Env::load($envPath);
$cfg = require $rootDir . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'database.php';

$args = $argv ?? [];
$forceReset = in_array('--reset', $args, true);

try {
    $srv = DatabaseBootstrap::connectServer($cfg);
    $dbName = (string) ($cfg['dbname'] ?? 'db_bakemate');

    if ($forceReset) {
        echo "[RESET] Dang nap lai toan bo database/bakemate_schema.sql vao `{$dbName}`...\n";
        DatabaseBootstrap::importSchema($srv, $dbName);
    } else {
        $safeDb = preg_replace('/[^a-zA-Z0-9_]/', '', $dbName) ?: 'db_bakemate';
        $srv->exec("CREATE DATABASE IF NOT EXISTS `{$safeDb}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $srv->exec("USE `{$safeDb}`");
    }

    require_once $rootDir . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR . 'Database.php';
    $pdo = Database::getInstance();
    $actions = DatabaseBootstrap::ensureLocalIntegrity($pdo, $cfg, true);

    echo "[OK] Da dong bo CSDL `{$dbName}` tren {$cfg['host']}:{$cfg['port']}.\n";
    if (!empty($actions)) {
        echo "[ACTIONS] " . implode(', ', $actions) . "\n";
    }

    $rows = $pdo->query("SELECT id, email, role, is_super_admin, failed_attempts, lock_until, CHAR_LENGTH(password_hash) AS hash_len FROM users WHERE email IN ('superadmin@bakemate.vn','admin@bakemate.vn','staff@bakemate.vn','khachhang@bakemate.vn') ORDER BY id")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($rows as $r) {
        $sa = !empty($r['is_super_admin']) ? ' (Super Admin)' : '';
        echo sprintf(
            " - #%d %-24s | role=%-8s%s | hash_len=%d | fails=%d | unlocked\n",
            (int) $r['id'],
            (string) $r['email'],
            (string) $r['role'],
            $sa,
            (int) $r['hash_len'],
            (int) $r['failed_attempts']
        );
    }
    exit(0);
} catch (Throwable $e) {
    fwrite(STDERR, "[ERROR] Khong the thiet lap CSDL: " . $e->getMessage() . "\n");
    exit(1);
}
