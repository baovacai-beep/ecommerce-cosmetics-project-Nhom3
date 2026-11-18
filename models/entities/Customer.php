<?php
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . 'User.php';

class Customer extends User
{
    protected string $role = 'customer';

    public function getRoleLabel(): string
    {
        return 'Khách hàng (Customer)';
    }

    public function getPermissions(): array
    {
        return ['browse', 'cart', 'checkout', 'orders.own', 'wishlist', 'review', 'pantry'];
    }
}
