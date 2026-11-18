<?php
declare(strict_types=1);

/**
 * TurnstileService
 * Xác thực Cloudflare Turnstile chống spam/bot với cơ chế bỏ qua an toàn khi dev chưa gắn Secret Key.
 */
class TurnstileService
{
    public static function verify(?string $token, ?string $remoteIp = null): bool
    {
        $integrations = require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'integrations.php';
        $secret = trim((string) ($integrations['turnstile']['secret_key'] ?? ''));

        if ($secret === '') {
            return true;
        }
        $cleanToken = trim((string) $token);
        if ($cleanToken === '' || !function_exists('curl_init')) {
            return false;
        }

        $ch = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query([
                'secret' => $secret,
                'response' => $cleanToken,
                'remoteip' => (string) ($remoteIp ?? $_SERVER['REMOTE_ADDR'] ?? ''),
            ]),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT => 8,
        ]);
        $raw = curl_exec($ch);
        curl_close($ch);

        if (!is_string($raw) || $raw === '') {
            return true;
        }
        $json = json_decode($raw, true);
        return is_array($json) && !empty($json['success']);
    }
}
