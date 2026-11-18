<?php
declare(strict_types=1);

/**
 * User
 * Lớp cha trừu tượng cho người dùng BakeMate (Encapsulation + Inheritance).
 */
abstract class User
{
    private int $id = 0;
    protected string $fullName = '';
    protected string $email = '';
    protected string $phone = '';
    protected string $role = 'customer';

    public function __construct(int $id, string $fullName, string $email, string $phone = '')
    {
        $this->id = $id;
        $this->setFullName($fullName);
        $this->setEmail($email);
        $this->phone = trim($phone);
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getFullName(): string
    {
        return $this->fullName;
    }

    public function setFullName(string $fullName): void
    {
        $clean = trim($fullName);
        if (mb_strlen($clean, 'UTF-8') < 2) {
            throw new InvalidArgumentException('Họ tên phải có ít nhất 2 ký tự.');
        }
        $this->fullName = $clean;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): void
    {
        $clean = strtolower(trim($email));
        if (!filter_var($clean, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Địa chỉ email không hợp lệ.');
        }
        $this->email = $clean;
    }

    public function getRole(): string
    {
        return $this->role;
    }

    abstract public function getRoleLabel(): string;

    /**
     * @return string[]
     */
    abstract public function getPermissions(): array;
}
