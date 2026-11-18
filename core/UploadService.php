<?php
declare(strict_types=1);

/**
 * UploadService
 * Xác thực và lưu tệp ảnh tải lên an toàn vào public/uploads/<subdir>/ dựa trên MIME thực.
 */
class UploadService
{
    private const MAX_BYTES = 3145728; // 3MB
    private const ALLOWED_MIMES = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];

    public static function storeImage(array $file, string $subDir = 'reviews'): array
    {
        if (empty($file['tmp_name']) || (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            return ['ok' => false, 'path' => '', 'error' => 'Tệp ảnh tải lên không hợp lệ.'];
        }
        if ((int) ($file['size'] ?? 0) > self::MAX_BYTES) {
            return ['ok' => false, 'path' => '', 'error' => 'Dung lượng ảnh không được vượt quá 3MB.'];
        }

        $finfo = function_exists('finfo_open') ? @finfo_open(FILEINFO_MIME_TYPE) : false;
        $mime = $finfo ? (string) @finfo_file($finfo, (string) $file['tmp_name']) : (string) @mime_content_type((string) $file['tmp_name']);
        if ($finfo) {
            @finfo_close($finfo);
        }

        if (!isset(self::ALLOWED_MIMES[$mime])) {
            return ['ok' => false, 'path' => '', 'error' => 'Chỉ chấp nhận ảnh định dạng JPG, PNG hoặc WEBP.'];
        }

        $safeDir = preg_replace('/[^a-z0-9_-]/i', '', $subDir) ?: 'reviews';
        $targetDir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $safeDir;
        if (!is_dir($targetDir)) {
            @mkdir($targetDir, 0755, true);
        }

        $ext = self::ALLOWED_MIMES[$mime];
        $fileName = date('Ymd_His') . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
        $targetPath = $targetDir . DIRECTORY_SEPARATOR . $fileName;

        $moved = is_uploaded_file((string) $file['tmp_name'])
            ? @move_uploaded_file((string) $file['tmp_name'], $targetPath)
            : @rename((string) $file['tmp_name'], $targetPath);

        if (!$moved) {
            return ['ok' => false, 'path' => '', 'error' => 'Không thể lưu tệp ảnh lên máy chủ.'];
        }

        return [
            'ok' => true,
            'path' => 'uploads/' . $safeDir . '/' . $fileName,
            'error' => '',
        ];
    }
}
