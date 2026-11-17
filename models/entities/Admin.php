<?php
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . 'User.php';

class Admin extends User
{
    protected string $role = 'admin';
    private bool $isSuperAdmin;

    public function __construct(int $id, string $fullName, string $email, string $phone = '', bool $isSuperAdmin = false)
    {
        parent::__construct($id, $fullName, $email, $phone);
        $this->isSuperAdmin = $isSuperAdmin;
    }

    public function isSuperAdmin(): bool
    {
        return $this->isSuperAdmin;
    }

    public function getRoleLabel(): string
    {
        return $this->isSuperAdmin ? 'Super Admin · Toàn quyền' : 'Quản trị viên (Admin)';
    }

    public function getPermissions(): array
    {
        $base = ['admin.dashboard', 'admin.products', 'admin.recipes', 'admin.orders', 'admin.coupons', 'admin.blog', 'admin.reviews', 'admin.contacts', 'admin.users'];
        if ($this->isSuperAdmin) {
            $base[] = 'admin.create_admin';
        }
        return $base;
    }
}
