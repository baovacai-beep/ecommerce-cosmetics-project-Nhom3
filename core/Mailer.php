<?php
declare(strict_types=1);

/**
 * Mailer
 * Dịch vụ gửi OTP qua email.
 * Chỉ cho phép xem trước OTP khi chạy ở môi trường local.
 */
class Mailer
{
    public static function sendOtp(string $toEmail, string $otpCode, string $fullName = ''): array
    {
        $integrations = require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'integrations.php';
        $mailCfg = $integrations['mail'];

        $isLocal = strtolower(trim((string) Env::get('APP_ENV', 'production'))) === 'local';

        $subject = '[BakeMate] Mã xác thực OTP khôi phục mật khẩu';
        $greeting = $fullName !== '' ? "Xin chào {$fullName}," : 'Xin chào bạn,';
        $body = "{$greeting}\n\nMã OTP khôi phục mật khẩu tài khoản BakeMate của bạn là: {$otpCode}\nMã có hiệu lực trong 10 phút.\n\nNếu bạn không yêu cầu thao tác này, vui lòng bỏ qua email.";

        // Chỉ lưu OTP xem trước trong phiên local để kiểm thử.
        if ($isLocal && session_status() === PHP_SESSION_ACTIVE) {
            $_SESSION['bakemate_dev_mail_preview'] = [
                'to' => $toEmail,
                'subject' => $subject,
                'otp' => $otpCode,
                'created_at' => date('Y-m-d H:i:s'),
            ];
        }

        if (trim((string) ($mailCfg['host'] ?? '')) === '') {
            if ($isLocal) {
                return [
                    'sent' => false,
                    'mode' => 'local_preview',
                    'dev_otp_preview' => $otpCode,
                    'message' => 'Chế độ local: Mã OTP được hiển thị để phục vụ kiểm thử.',
                ];
            }

            return [
                'sent' => false,
                'mode' => 'mail_unavailable',
                'dev_otp_preview' => '',
                'message' => 'Dịch vụ gửi OTP tạm thời không khả dụng. Vui lòng thử lại sau.',
            ];
        }

        $headers = [
            'From: ' . ($mailCfg['from_name'] ?? 'BakeMate') . ' <' . ($mailCfg['from'] ?? 'support@bakemate.vn') . '>',
            'Content-Type: text/plain; charset=UTF-8',
        ];

        $ok = @mail($toEmail, $subject, $body, implode("\r\n", $headers));

        if ($ok) {
            return [
                'sent' => true,
                'mode' => 'smtp_mail',
                'dev_otp_preview' => '',
                'message' => 'Mã OTP đã được gửi đến email ' . $toEmail,
            ];
        }

        return [
            'sent' => false,
            'mode' => $isLocal ? 'local_fallback' : 'mail_failed',
            'dev_otp_preview' => $isLocal ? $otpCode : '',
            'message' => $isLocal
                ? 'Máy chủ gửi mail chưa kích hoạt; dùng OTP mô phỏng để kiểm thử.'
                : 'Không thể gửi OTP. Vui lòng thử lại sau.',
        ];
    }
}
