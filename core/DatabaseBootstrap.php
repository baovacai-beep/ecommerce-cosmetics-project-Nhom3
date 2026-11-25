<?php
declare(strict_types=1);

/**
 * DatabaseBootstrap
 * Tự động khởi tạo CSDL local từ database/bakemate_schema.sql (cho cả MySQL và SQLite fallback)
 * và tự phục hồi 4 tài khoản mẫu khi hash Bcrypt bị lỗi định dạng hoặc từ bản SQL cũ.
 * Không lưu mật khẩu plaintext trong mã nguồn PHP (lấy hash chuẩn từ file SQL).
 */
class DatabaseBootstrap
{
    private const LEGACY_BAD_HASHES = [
        '$2y$10$FvG8pHMPrP1tZJriXM/pdu47Slh3papfN4NACBxUIJCxmodWqyuLG',
        '$2y$10$NQ0QruBs3iF8OZ7343DXHuKgVwnoJ5Yad/m9XgiS4bsaD6gLTHmYC',
        '$2y$10$AfyI6Ezd5yyNIIXmfEJXK.R4SDkn14izY25MM4K0nZWS1GMqnL8jK',
        '$2y$10$d.0o2WzDW4y8akVLrKet2.D0pwgjFueVbGIJi425QrAINpUbRwOnW',
    ];

    public static function schemaPath(): string
    {
        return dirname(__DIR__) . DIRECTORY_SEPARATOR . 'database' . DIRECTORY_SEPARATOR . 'bakemate_schema.sql';
    }

    public static function sqlitePath(): string
    {
        return dirname(__DIR__) . DIRECTORY_SEPARATOR . 'database' . DIRECTORY_SEPARATOR . 'bakemate_local.sqlite';
    }

    /**
     * Đọc danh sách 4 tài khoản mẫu cùng Bcrypt hash chuẩn trực tiếp từ bakemate_schema.sql.
     *
     * @return array<int, array{id:int, full_name:string, email:string, phone:string, password_hash:string, role:string, is_super_admin:int, token_version:int}>
     */
    public static function extractSeedUsers(): array
    {
        $path = self::schemaPath();
        if (!is_file($path) || !is_readable($path)) {
            return [];
        }
        $sql = file_get_contents($path);
        if (!is_string($sql) || $sql === '') {
            return [];
        }

        $pattern = "/\(\s*([1-4])\s*,\s*'([^']+)'\s*,\s*'([^']+@bakemate\.vn)'\s*,\s*'([^']*)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*([01])\s*,\s*(\d+)\s*\)/u";
        if (!preg_match_all($pattern, $sql, $matches, PREG_SET_ORDER)) {
            return [];
        }

        $users = [];
        foreach ($matches as $m) {
            $hash = $m[5];
            if (!str_starts_with($hash, '$2y$') || strlen($hash) !== 60) {
                continue;
            }
            $users[] = [
                'id' => (int) $m[1],
                'full_name' => $m[2],
                'email' => strtolower(trim($m[3])),
                'phone' => trim($m[4]),
                'password_hash' => $hash,
                'role' => $m[6],
                'is_super_admin' => (int) $m[7],
                'token_version' => max(1, (int) $m[8]),
            ];
        }
        return $users;
    }

    /**
     * Tạo kết nối PDO MySQL ở mức Server (không chọn sẵn dbname) để phục vụ bootstrap.
     */
    public static function connectServer(array $cfg): PDO
    {
        $hosts = [(string) ($cfg['host'] ?? '127.0.0.1')];
        if ($hosts[0] === '127.0.0.1') {
            $hosts[] = 'localhost';
        } elseif ($hosts[0] === 'localhost') {
            $hosts[] = '127.0.0.1';
        }

        $lastErr = null;
        foreach ($hosts as $h) {
            $dsn = sprintf(
                'mysql:host=%s;port=%d;charset=%s',
                $h,
                (int) ($cfg['port'] ?? 3306),
                (string) ($cfg['charset'] ?? 'utf8mb4')
            );
            try {
                return new PDO($dsn, (string) $cfg['username'], (string) $cfg['password'], [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_TIMEOUT => 2,
                    PDO::ATTR_EMULATE_PREPARES => true,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
                ]);
            } catch (PDOException $e) {
                $lastErr = $e;
            }
        }
        throw $lastErr ?? new RuntimeException('Không thể kết nối tới MySQL Server.');
    }

    /**
     * Nạp file SQL MySQL (hỗ trợ DELIMITER // cho Stored Procedures).
     */
    public static function importSchema(PDO $pdo, string $targetDbName): void
    {
        $path = self::schemaPath();
        if (!is_file($path) || !is_readable($path)) {
            throw new RuntimeException('Không tìm thấy tệp database/bakemate_schema.sql để khởi tạo CSDL.');
        }
        $raw = file_get_contents($path);
        if (!is_string($raw) || $raw === '') {
            throw new RuntimeException('Tệp database/bakemate_schema.sql rỗng hoặc không đọc được.');
        }

        $safeDb = preg_replace('/[^a-zA-Z0-9_]/', '', $targetDbName) ?: 'db_bakemate';
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$safeDb}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $pdo->exec("USE `{$safeDb}`");

        $normalized = str_replace(["\r\n", "\r"], "\n", $raw);
        $lines = explode("\n", $normalized);
        $delimiter = ';';
        $buffer = '';

        foreach ($lines as $line) {
            $trimmed = trim($line);
            if ($trimmed === '' || str_starts_with($trimmed, '--')) {
                continue;
            }
            if (preg_match('/^DELIMITER\s+(\S+)$/i', $trimmed, $dm)) {
                $delimiter = $dm[1];
                continue;
            }
            if (preg_match('/^CREATE\s+DATABASE\b/i', $trimmed) || preg_match('/^USE\s+db_bakemate\s*;$/i', $trimmed)) {
                continue;
            }

            $buffer .= $line . "\n";
            $check = rtrim($buffer);
            if ($delimiter !== '' && str_ends_with($check, $delimiter)) {
                $stmtSql = trim(substr($check, 0, -strlen($delimiter)));
                $buffer = '';
                if ($stmtSql !== '') {
                    $pdo->exec($stmtSql);
                }
            }
        }

        $tail = trim($buffer);
        if ($tail !== '') {
            $pdo->exec($tail);
        }
    }

    /**
     * Chuyển đổi các chuỗi escape kiểu MySQL (\', \", \/, \\, \n, \r, \t) bên trong '...' sang chuẩn SQLite.
     */
    private static function convertMysqlStringsToSqlite(string $sql): string
    {
        $len = strlen($sql);
        $out = '';
        $inStr = false;
        for ($i = 0; $i < $len; $i++) {
            $ch = $sql[$i];
            if (!$inStr) {
                $out .= $ch;
                if ($ch === "'") {
                    $inStr = true;
                }
                continue;
            }
            if ($ch === '\\' && $i + 1 < $len) {
                $next = $sql[$i + 1];
                $i++;
                $out .= match ($next) {
                    "'" => "''",
                    '"' => '"',
                    '/' => '/',
                    '\\' => '\\',
                    'n' => "\n",
                    'r' => "\r",
                    't' => "\t",
                    '0' => "\0",
                    default => '\\' . $next,
                };
                continue;
            }
            if ($ch === "'" && $i + 1 < $len && $sql[$i + 1] === "'") {
                $out .= "''";
                $i++;
                continue;
            }
            $out .= $ch;
            if ($ch === "'") {
                $inStr = false;
            }
        }
        return $out;
    }

    /**
     * Chuyển đổi một câu DDL MySQL sang cú pháp SQLite hợp lệ.
     */
    private static function convertDdlToSqlite(string $stmt): string
    {
        $sql = preg_replace('/\b(?:BIGINT|INT|SMALLINT|TINYINT)(?:\(\d+\))?\s+UNSIGNED\s+AUTO_INCREMENT\s+PRIMARY\s+KEY/i', 'INTEGER PRIMARY KEY AUTOINCREMENT', $stmt) ?? $stmt;
        $sql = preg_replace('/\b(?:BIGINT|INT|SMALLINT|TINYINT)(?:\(\d+\))?\s+AUTO_INCREMENT\s+PRIMARY\s+KEY/i', 'INTEGER PRIMARY KEY AUTOINCREMENT', $sql) ?? $sql;
        $sql = preg_replace('/\bON\s+UPDATE\s+CURRENT_TIMESTAMP\b/i', '', $sql) ?? $sql;
        $sql = preg_replace('/\bENUM\s*\([^)]+\)/i', 'TEXT', $sql) ?? $sql;
        $sql = preg_replace('/\b(?:BIGINT|MEDIUMINT|INT|SMALLINT|TINYINT)(?:\(\d+\))?\s+UNSIGNED\b/i', 'INTEGER', $sql) ?? $sql;
        $sql = preg_replace('/\b(?:BIGINT|MEDIUMINT|INT|SMALLINT|TINYINT)\(\d+\)/i', 'INTEGER', $sql) ?? $sql;
        $sql = preg_replace('/\bUNSIGNED\b/i', '', $sql) ?? $sql;
        $sql = preg_replace('/\bDECIMAL\s*\([^)]+\)/i', 'REAL', $sql) ?? $sql;
        $sql = preg_replace('/\bLONGTEXT\b/i', 'TEXT', $sql) ?? $sql;
        $sql = preg_replace('/\b(?:DATETIME|TIMESTAMP)\b/i', 'TEXT', $sql) ?? $sql;
        $sql = preg_replace('/\bUNIQUE\s+KEY\s+\w+\s*\(/i', 'UNIQUE (', $sql) ?? $sql;
        $sql = preg_replace('/,\s*\r?\n\s*(?:KEY|INDEX)\s+\w+\s*\([^)]+\)/i', '', $sql) ?? $sql;
        $sql = preg_replace('/\)\s*ENGINE\s*=\s*InnoDB[^;]*/i', ')', $sql) ?? $sql;
        return trim($sql);
    }

    /**
     * Nạp toàn bộ schema + dữ liệu mẫu từ bakemate_schema.sql vào file SQLite nội bộ (không cần XAMPP/MySQL).
     */
    public static function importSqliteSchema(PDO $sqlitePdo): void
    {
        $path = self::schemaPath();
        if (!is_file($path) || !is_readable($path)) {
            throw new RuntimeException('Không tìm thấy database/bakemate_schema.sql để khởi tạo SQLite.');
        }
        $raw = file_get_contents($path);
        if (!is_string($raw) || $raw === '') {
            throw new RuntimeException('Tệp database/bakemate_schema.sql rỗng.');
        }

        $normalized = str_replace(["\r\n", "\r"], "\n", $raw);
        $lines = explode("\n", $normalized);
        $delimiter = ';';
        $buffer = '';

        $sqlitePdo->exec('PRAGMA foreign_keys = OFF');
        $sqlitePdo->beginTransaction();

        try {
            foreach ($lines as $line) {
                $trimmed = trim($line);
                if ($trimmed === '' || str_starts_with($trimmed, '--')) {
                    continue;
                }
                if (preg_match('/^DELIMITER\s+(\S+)$/i', $trimmed, $dm)) {
                    $delimiter = $dm[1];
                    continue;
                }
                if ($delimiter !== ';') {
                    // Bỏ qua block Stored Procedure dành riêng cho MySQL
                    continue;
                }
                if (
                    preg_match('/^CREATE\s+DATABASE\b/i', $trimmed)
                    || preg_match('/^USE\s+/i', $trimmed)
                    || preg_match('/^SET\s+/i', $trimmed)
                    || preg_match('/^DROP\s+PROCEDURE\b/i', $trimmed)
                ) {
                    continue;
                }

                $buffer .= $line . "\n";
                $check = rtrim($buffer);
                if (str_ends_with($check, ';')) {
                    $stmtSql = trim(substr($check, 0, -1));
                    $buffer = '';
                    if ($stmtSql === '') {
                        continue;
                    }
                    if (preg_match('/^(?:CREATE|DROP)\s+TABLE\b/i', $stmtSql)) {
                        $stmtSql = self::convertDdlToSqlite($stmtSql);
                    } elseif (preg_match('/^INSERT\s+/i', $stmtSql)) {
                        $stmtSql = self::convertMysqlStringsToSqlite($stmtSql);
                    }
                    $sqlitePdo->exec($stmtSql);
                }
            }

            $sqlitePdo->exec('CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_tokens(email)');
            $sqlitePdo->commit();
        } catch (Throwable $e) {
            if ($sqlitePdo->inTransaction()) {
                $sqlitePdo->rollBack();
            }
            throw $e;
        } finally {
            $sqlitePdo->exec('PRAGMA foreign_keys = ON');
        }
    }

    /**
     * Kiểm tra schema + sửa hash hỏng/cũ của 4 tài khoản mẫu trên môi trường local (MySQL hoặc SQLite).
     */
    public static function ensureLocalIntegrity(PDO $pdo, array $cfg, bool $forceRepair = false): array
    {
        $actions = [];
        $driver = strtolower((string) $pdo->getAttribute(PDO::ATTR_DRIVER_NAME));

        $hasUsersTable = false;
        try {
            if ($driver === 'sqlite') {
                $chk = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
            } else {
                $chk = $pdo->query("SHOW TABLES LIKE 'users'");
            }
            $hasUsersTable = (bool) ($chk && $chk->fetchColumn());
        } catch (Throwable $e) {
            $hasUsersTable = false;
        }

        if (!$hasUsersTable) {
            if ($driver === 'sqlite') {
                self::importSqliteSchema($pdo);
                $actions[] = 'imported_sqlite_schema';
            } else {
                $srv = self::connectServer($cfg);
                self::importSchema($srv, (string) ($cfg['dbname'] ?? 'db_bakemate'));
                $actions[] = 'imported_full_schema';
            }
        }

        $seedUsers = self::extractSeedUsers();
        if (empty($seedUsers)) {
            return $actions;
        }

        $emails = array_column($seedUsers, 'email');
        $placeholders = implode(',', array_fill(0, count($emails), '?'));
        $stmt = $pdo->prepare("SELECT id, email, password_hash, role, is_super_admin, failed_attempts, lock_until, token_version FROM users WHERE email IN ({$placeholders})");
        $stmt->execute($emails);
        $existingByEmail = [];
        foreach ($stmt->fetchAll() as $row) {
            $existingByEmail[strtolower((string) $row['email'])] = $row;
        }

        foreach ($seedUsers as $seed) {
            $email = $seed['email'];
            $existing = $existingByEmail[$email] ?? null;

            if (!$existing) {
                $ins = $pdo->prepare(
                    'INSERT INTO users (full_name, email, phone, password_hash, role, is_super_admin, token_version, failed_attempts, lock_until) VALUES (?, ?, ?, ?, ?, ?, 1, 0, NULL)'
                );
                $ins->execute([
                    $seed['full_name'],
                    $email,
                    $seed['phone'] !== '' ? $seed['phone'] : null,
                    $seed['password_hash'],
                    $seed['role'],
                    $seed['is_super_admin'],
                ]);
                $actions[] = "inserted:{$email}";
                continue;
            }

            $curHash = (string) ($existing['password_hash'] ?? '');
            $isCorruptHash = !str_starts_with($curHash, '$2y$') || strlen($curHash) !== 60;
            $isLegacySeedHash = in_array($curHash, self::LEGACY_BAD_HASHES, true);
            $roleMismatch = (string) ($existing['role'] ?? '') !== $seed['role']
                || (int) ($existing['is_super_admin'] ?? 0) !== $seed['is_super_admin'];

            if ($forceRepair || $isCorruptHash || $isLegacySeedHash || $roleMismatch) {
                $upd = $pdo->prepare(
                    'UPDATE users SET password_hash = ?, role = ?, is_super_admin = ?, failed_attempts = 0, lock_until = NULL, token_version = 1 WHERE id = ?'
                );
                $upd->execute([
                    $seed['password_hash'],
                    $seed['role'],
                    $seed['is_super_admin'],
                    (int) $existing['id'],
                ]);
                $actions[] = "repaired:{$email}";
            }
        }

        return $actions;
    }
}
