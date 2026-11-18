<?php
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . 'User.php';

class Staff extends User
{
    protected string $role = 'staff';

    public function getRoleLabel(): string
    {
        return 'Nhân viên vận hành (Staff)';
    }

    public function getPermissions(): array
    {
        return ['browse', 'staff.orders', 'staff.verify_payment', 'staff.contacts', 'staff.stock'];
    }
}
