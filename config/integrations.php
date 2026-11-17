<?php
declare(strict_types=1);

return [
    'mail' => [
        'host' => (string) Env::get('MAIL_HOST', ''),
        'port' => (int) Env::get('MAIL_PORT', 587),
        'user' => (string) Env::get('MAIL_USER', ''),
        'pass' => (string) Env::get('MAIL_PASS', ''),
        'from' => (string) Env::get('MAIL_FROM', 'support@bakemate.vn'),
        'from_name' => (string) Env::get('MAIL_FROM_NAME', 'BakeMate'),
    ],
    'vietqr' => [
        'bank_id' => (string) Env::get('VIETQR_BANK_ID', 'MB'),
        'account_no' => (string) Env::get('VIETQR_ACCOUNT_NO', '0388889999'),
        'account_name' => (string) Env::get('VIETQR_ACCOUNT_NAME', 'BAKEMATE STORE'),
    ],
    'casso' => [
        'api_key' => (string) Env::get('CASSO_API_KEY', ''),
        'webhook_secret' => (string) Env::get('CASSO_WEBHOOK_SECRET', ''),
    ],
    'turnstile' => [
        'site_key' => (string) Env::get('TURNSTILE_SITE_KEY', ''),
        'secret_key' => (string) Env::get('TURNSTILE_SECRET_KEY', ''),
    ],
    'google_oauth' => [
        'client_id' => (string) Env::get('GOOGLE_CLIENT_ID', ''),
        'client_secret' => (string) Env::get('GOOGLE_CLIENT_SECRET', ''),
    ],
    'gemini' => [
        'api_key' => (string) Env::get('GEMINI_API_KEY', ''),
    ],
    'ghn' => [
        'token' => (string) Env::get('GHN_API_TOKEN', ''),
        'shop_id' => (string) Env::get('GHN_SHOP_ID', ''),
    ],
];
