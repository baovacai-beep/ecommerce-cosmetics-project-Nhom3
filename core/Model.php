<?php
declare(strict_types=1);

/**
 * Model
 * Lớp cơ sở trừu tượng cho tất cả các Model tầng dữ liệu, hỗ trợ Dependency Injection (?PDO $db).
 */
abstract class Model
{
    protected PDO $db;

    public function __construct(?PDO $db = null)
    {
        $this->db = $db ?? Database::getInstance();
    }
}
