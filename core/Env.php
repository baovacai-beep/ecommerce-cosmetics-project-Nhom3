<?php
declare(strict_types=1);

/**
 * Env
 * Đọc biến môi trường từ tệp .env tại thư mục gốc dự án.
 */
class Env
{
    private static bool $loaded = false;
    private static array $vars = [];

    public static function load(?string $filePath = null): void
    {
        if (self::$loaded) {
            return;
        }
        $path = $filePath ?? dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env';
        if (is_file($path) && is_readable($path)) {
            $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            if (is_array($lines)) {
                foreach ($lines as $line) {
                    $trimmed = trim($line);
                    if ($trimmed === '' || str_starts_with($trimmed, '#')) {
                        continue;
                    }
                    $eqPos = strpos($trimmed, '=');
                    if ($eqPos === false) {
                        continue;
                    }
                    $key = trim(substr($trimmed, 0, $eqPos));
                    $val = trim(substr($trimmed, $eqPos + 1));
                    if (strlen($val) >= 2) {
                        $first = $val[0];
                        $last = $val[strlen($val) - 1];
                        if (($first === '"' && $last === '"') || ($first === "'" && $last === "'")) {
                            $val = substr($val, 1, -1);
                        }
                    }
                    if ($key !== '') {
                        self::$vars[$key] = $val;
                        if (getenv($key) === false) {
                            putenv($key . '=' . $val);
                        }
                        $_ENV[$key] = $val;
                    }
                }
            }
        }
        self::$loaded = true;
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        self::load();
        if (array_key_exists($key, self::$vars)) {
            return self::$vars[$key];
        }
        $envVal = getenv($key);
        return $envVal !== false ? $envVal : $default;
    }
}
