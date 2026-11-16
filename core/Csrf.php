<?php
declare(strict_types=1);

/**
 * Csrf
 * Sinh và xác thực mã chống giả mạo yêu cầu CSRF bằng hash_equals().
 */
class Csrf
{
    private const SESSION_KEY = 'bakemate_csrf_token';

    public static function token(): string
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            return '';
        }
        if (empty($_SESSION[self::SESSION_KEY]) || !is_string($_SESSION[self::SESSION_KEY])) {
            $_SESSION[self::SESSION_KEY] = bin2hex(random_bytes(32));
        }
        return $_SESSION[self::SESSION_KEY];
    }

    public static function verify(?string $candidate): bool
    {
        $expected = self::token();
        if ($expected === '' || !is_string($candidate) || $candidate === '') {
            return false;
        }
        return hash_equals($expected, $candidate);
    }

    public static function extractFromRequest(): string
    {
        $headerToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if (is_string($headerToken) && $headerToken !== '') {
            return trim($headerToken);
        }
        $postToken = $_POST['csrf_token'] ?? '';
        if (is_string($postToken) && $postToken !== '') {
            return trim($postToken);
        }
        $rawBody = App::getRawBody();
        if ($rawBody !== '') {
            $decoded = json_decode($rawBody, true);
            if (is_array($decoded) && !empty($decoded['csrf_token'])) {
                return trim((string) $decoded['csrf_token']);
            }
        }
        return '';
    }

    public static function verifyRequest(): bool
    {
        return self::verify(self::extractFromRequest());
    }

    public static function metaTag(): string
    {
        return '<meta name="csrf-token" content="' . htmlspecialchars(self::token(), ENT_QUOTES, 'UTF-8') . '">';
    }

    public static function inputField(): string
    {
        return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars(self::token(), ENT_QUOTES, 'UTF-8') . '">';
    }
}
