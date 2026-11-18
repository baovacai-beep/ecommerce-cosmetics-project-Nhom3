<?php
declare(strict_types=1);

/**
 * Database
 * Kết nối PDO Singleton bảo đảm 1 request chỉ dùng tối đa 1 kết nối CSDL
 * và bật tắt Prepared Statements thật để chống SQL Injection.
 */
class Database
{
    private static ?PDO $instance = null;
    private static array $config = [];

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

            $dsn = sprintf(
                'mysql:host=%s;port=%d;dbname=%s;charset=%s',
                $cfg['host'],
                (int) $cfg['port'],
                $cfg['dbname'],
                $cfg['charset']
            );

            self::$instance = new PDO($dsn, $cfg['username'], $cfg['password'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
            ]);
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
