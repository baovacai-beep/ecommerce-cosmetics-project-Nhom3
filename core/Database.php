<?php
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . 'DatabaseBootstrap.php';

/**
 * Database
 * Kết nối PDO Singleton bảo đảm 1 request chỉ dùng tối đa 1 kết nối CSDL,
 * bật Prepared Statements thật để chống SQL Injection và tự khởi tạo schema local khi cần.
 */
class Database
{
    private static ?PDO $instance = null;
    private static array $config = [];
    private static bool $localIntegrityChecked = false;

    private function __construct()
    {
    }

    private function __clone()
    {
    }

    public function __wakeup()
    {
        throw new RuntimeException('Không thể unserialize Singleton Database.');
    }

    public static function getInstance(): PDO
    {
        if (self::$instance === null) {
            $cfg = require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'database.php';
            self::$config = $cfg;

            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
            ];

            $isLocalDev = ($cfg['mode'] ?? 'localhost') !== 'hosting';
            $hosts = [(string) $cfg['host']];
            if ($isLocalDev) {
                if ($hosts[0] === '127.0.0.1') {
                    $hosts[] = 'localhost';
                } elseif ($hosts[0] === 'localhost') {
                    $hosts[] = '127.0.0.1';
                }
            }

            $connected = null;
            $lastErr = null;
            $unknownDb = false;

            foreach ($hosts as $hostCandidate) {
                $dsn = sprintf(
                    'mysql:host=%s;port=%d;dbname=%s;charset=%s',
                    $hostCandidate,
                    (int) $cfg['port'],
                    $cfg['dbname'],
                    $cfg['charset']
                );
                try {
                    $connected = new PDO($dsn, $cfg['username'], $cfg['password'], $options);
                    self::$config['host'] = $hostCandidate;
                    break;
                } catch (PDOException $e) {
                    $lastErr = $e;
                    if ((string) $e->getCode() === '1049' || str_contains($e->getMessage(), 'Unknown database')) {
                        $unknownDb = true;
                        break;
                    }
                }
            }

            if ($connected === null && $unknownDb && $isLocalDev) {
                $srv = DatabaseBootstrap::connectServer($cfg);
                DatabaseBootstrap::importSchema($srv, (string) $cfg['dbname']);
                $dsnRetry = sprintf(
                    'mysql:host=%s;port=%d;dbname=%s;charset=%s',
                    (string) $cfg['host'],
                    (int) $cfg['port'],
                    $cfg['dbname'],
                    $cfg['charset']
                );
                $connected = new PDO($dsnRetry, $cfg['username'], $cfg['password'], $options);
                self::$localIntegrityChecked = true;
            }

            if ($connected === null) {
                throw $lastErr ?? new RuntimeException('Không thể kết nối CSDL MySQL.');
            }

            self::$instance = $connected;

            if ($isLocalDev && !self::$localIntegrityChecked) {
                self::$localIntegrityChecked = true;
                DatabaseBootstrap::ensureLocalIntegrity(self::$instance, self::$config, false);
            }
        }

        return self::$instance;
    }

    public static function getEnvironmentMode(): string
    {
        if (empty(self::$config)) {
            self::getInstance();
        }
        return (string) (self::$config['mode'] ?? 'localhost');
    }

    public static function ping(): bool
    {
        try {
            $stmt = self::getInstance()->query('SELECT 1');
            return $stmt !== false;
        } catch (Throwable $e) {
            return false;
        }
    }

    public static function getSafeInfo(): array
    {
        if (empty(self::$config)) {
            self::getInstance();
        }
        return [
            'mode' => (string) (self::$config['mode'] ?? 'localhost'),
            'host' => (string) (self::$config['host'] ?? ''),
            'port' => (int) (self::$config['port'] ?? 3306),
            'dbname' => (string) (self::$config['dbname'] ?? ''),
            'charset' => (string) (self::$config['charset'] ?? 'utf8mb4'),
        ];
    }
}
