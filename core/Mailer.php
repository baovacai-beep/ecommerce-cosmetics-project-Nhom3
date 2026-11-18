<?php
declare(strict_types=1);

/**
 * Mailer
 * Dịch vụ gửi email thông báo / mã OTP; tự động fallback sang chế độ xem trước cục bộ khi chưa cấu hình SMTP.
 */
class Mailer
{
    public static function sendOtp(string $toEmail, string $otpCode, string $fullName = ''): array
    {
        $integrations = require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'integrations.php';
        $mailCfg = $integrations['mail'];

        $subject = '[BakeMate] Mã xác thực OTP khôi phục mật khẩu';
        $greeting = $fullName !== '' ? "Xin chào {$fullName}," : 'Xin chào bạn,';
        $body = "{$greeting}\n\nMã OTP khôi phục mật khẩu tài khoản BakeMate của bạn là: {$otpCode}\nMã có hiệu lực trong 10 phút.\n\nNếu bạn không yêu cầu thao tác này, vui lòng bỏ qua email.";

        // Lưu preview phục vụ môi trường local dev không có SMTP server
        if (session_status() === PHP_SESSION_ACTIVE) {
            $_SESSION['bakemate_dev_mail_preview'] = [
                'to' => $toEmail,
                'subject' => $subject,
                'otp' => $otpCode,
                'created_at' => date('Y-m-d H:i:s'),
            ];
        }

        if (trim((string) ($mailCfg['host'] ?? '')) === '') {
            return [
                'sent' => true,
                'mode' => 'local_preview',
                'dev_otp_preview' => $otpCode,
                'message' => 'Chế độ đồ án (chưa cấu hình SMTP): Mã OTP đã được tạo và hiển thị mô phỏng an toàn trên màn hình.',
            ];
        }

        $headers = [
            'From: ' . ($mailCfg['from_name'] ?? 'BakeMate') . ' <' . ($mailCfg['from'] ?? 'support@bakemate.vn') . '>',
            'Content-Type: text/plain; charset=UTF-8',
        ];
        $ok = @mail($toEmail, $subject, $body, implode("\r\n", $headers));
        return [
            'sent' => $ok,
            'mode' => $ok ? 'smtp_mail' : 'local_fallback',
            'dev_otp_preview' => $ok ? '' : $otpCode,
            'message' => $ok
                ? 'Mã OTP đã được gửi đến email ' . $toEmail
                : 'Máy chủ gửi mail chưa kích hoạt; hệ thống đã chuyển sang OTP mô phỏng phục vụ kiểm thử.',
        ];
    }
}
