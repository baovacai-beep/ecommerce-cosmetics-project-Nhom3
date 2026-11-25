<?php
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . 'DatabaseBootstrap.php';

/**
 * Database
 * Kết nối PDO Singleton hỗ trợ đa môi trường:
 *  - Kết nối MySQL mặc định khi bật XAMPP/MySQL (tự tạo db_bakemate nếu chưa có);
 *  - Tự động chuyển sang SQLite nội bộ (database/bakemate_local.sqlite) ở môi trường local/CLI
 *    khi chưa bật MySQL để chạy ngay chỉ bằng lệnh Serve trên index.php.
 */
class Database
{
    private static ?PDO $instance = null;
    private static array $config = [];
    private static bool $localIntegrityChecked = false;
    private static string $activeDriver = 'mysql';

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

    private static function connectSqlite(): PDO
    {
        $sqlitePath = DatabaseBootstrap::sqlitePath();
        $pdo = new PDO('sqlite:' . $sqlitePath, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $pdo->exec('PRAGMA foreign_keys = ON');
        $pdo->exec('PRAGMA busy_timeout = 5000');
        self::$activeDriver = 'sqlite';
        self::$config['driver'] = 'sqlite';
        self::$config['dbname'] = basename($sqlitePath);
        return $pdo;
    }

    public static function getInstance(): PDO
    {
        if (self::$instance === null) {
            $cfg = require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'database.php';
            self::$config = $cfg;

            $isLocalDev = ($cfg['mode'] ?? 'localhost') !== 'hosting';
            $requestedDriver = strtolower(trim((string) Env::get('DB_DRIVER', '')));

            if ($requestedDriver === 'sqlite' && $isLocalDev && extension_loaded('pdo_sqlite')) {
                $connected = self::connectSqlite();
                self::$instance = $connected;
                if (!self::$localIntegrityChecked) {
                    self::$localIntegrityChecked = true;
                    DatabaseBootstrap::ensureLocalIntegrity(self::$instance, self::$config, false);
                }
                return self::$instance;
            }

            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_TIMEOUT => $isLocalDev ? 2 : 5,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
            ];

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

            if (extension_loaded('pdo_mysql')) {
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
                        self::$activeDriver = 'mysql';
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
                    try {
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
                        self::$activeDriver = 'mysql';
                        self::$localIntegrityChecked = true;
                    } catch (Throwable $e) {
                        $lastErr = $e;
                    }
                }
            }

            // Fallback tự động sang SQLite cục bộ khi không bật XAMPP/MySQL trên máy thành viên
            if ($connected === null && $isLocalDev && extension_loaded('pdo_sqlite')) {
                $connected = self::connectSqlite();
            }

            if ($connected === null) {
                throw $lastErr ?? new RuntimeException('Không thể kết nối CSDL MySQL hoặc SQLite.');
            }

            self::$instance = $connected;

            if ($isLocalDev && !self::$localIntegrityChecked) {
                self::$localIntegrityChecked = true;
                DatabaseBootstrap::ensureLocalIntegrity(self::$instance, self::$config, false);
            }
        }

        return self::$instance;
    }

    public static function getActiveDriver(): string
    {
        if (self::$instance === null) {
            self::getInstance();
        }
        return self::$activeDriver;
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
            'driver' => self::$activeDriver,
            'mode' => (string) (self::$config['mode'] ?? 'localhost'),
            'host' => (string) (self::$config['host'] ?? ''),
            'port' => (int) (self::$config['port'] ?? 3306),
            'dbname' => (string) (self::$config['dbname'] ?? ''),
            'charset' => (string) (self::$config['charset'] ?? 'utf8mb4'),
        ];
    }
}
