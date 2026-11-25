<?php
declare(strict_types=1);

/**
 * Model
 * Lớp cơ sở trừu tượng cho tất cả các Model tầng dữ liệu, hỗ trợ Dependency Injection (?PDO $db)
 * và tương thích cả hai driver MySQL & SQLite (fallback khi không bật XAMPP).
 */
abstract class Model
{
    protected PDO $db;

    public function __construct(?PDO $db = null)
    {
        $this->db = $db ?? Database::getInstance();
    }

    protected function isMysql(): bool
    {
        return strtolower((string) $this->db->getAttribute(PDO::ATTR_DRIVER_NAME)) === 'mysql';
    }

    protected function insertIgnoreVerb(): string
    {
        return $this->isMysql() ? 'INSERT IGNORE INTO' : 'INSERT OR IGNORE INTO';
    }

    protected function forUpdateSuffix(bool $lockRows = true): string
    {
        return ($lockRows && $this->isMysql()) ? ' FOR UPDATE' : '';
    }
}
