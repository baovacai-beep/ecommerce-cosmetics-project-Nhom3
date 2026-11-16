<?php
declare(strict_types=1);

return [
    'name' => (string) Env::get('APP_NAME', 'BakeMate'),
    'env' => (string) Env::get('APP_ENV', 'local'),
    'debug' => filter_var(Env::get('APP_DEBUG', 'true'), FILTER_VALIDATE_BOOLEAN),
    'url' => rtrim((string) Env::get('APP_URL', ''), '/'),
    'timezone' => (string) Env::get('APP_TIMEZONE', 'Asia/Ho_Chi_Minh'),
    'default_shipping_fee' => 25000,
    'max_cart_quantity' => 99,
    'max_recent_products' => 8,
    'otp_expiry_seconds' => 600,
    'otp_cooldown_seconds' => 60,
    'admin_max_failed_attempts' => 5,
    'admin_lock_seconds' => 1800,
    'roles' => ['guest', 'customer', 'staff', 'admin'],
    'order_statuses' => ['pending', 'preparing', 'shipping', 'completed', 'cancelled'],
];
