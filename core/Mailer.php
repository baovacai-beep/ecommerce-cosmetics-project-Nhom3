<?php
declare(strict_types=1);

// 1. NHÚNG THỦ CÔNG 3 FILE TỪ THƯ MỤC core/PHPMailer/
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/PHPMailer/Exception.php';
require_once __DIR__ . '/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/SMTP.php';

/**
 * Mailer
 * Dịch vụ gửi email tự động (OTP đăng ký, OTP quên mật khẩu, Đơn hàng) qua PHPMailer & Gmail SMTP
 */
class Mailer
{
    /**
     * Khởi tạo đối tượng PHPMailer kết nối Gmail SMTP
     */
    private static function createMailer(): ?PHPMailer
    {
        $integrations = require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'integrations.php';
        $cfg = $integrations['mail'] ?? [];

        // Kiểm tra nếu chưa cấu hình trong .env thì trả về null
        if (empty($cfg['host']) || empty($cfg['user']) || empty($cfg['pass'])) {
            return null;
        }

        $mail = new PHPMailer(true);

        // 2. Cấu hình máy chủ SMTP
        // $mail->SMTPDebug = SMTP::DEBUG_SERVER; // Bật dòng này nếu cần kiểm tra log chi tiết
        $mail->isSMTP();
        $mail->Host       = (string) $cfg['host'];           // smtp.gmail.com
        $mail->SMTPAuth   = true;
        $mail->Username   = (string) $cfg['user'];           // Email Gmail của bạn
        $mail->Password   = (string) $cfg['pass'];           // Mật khẩu ứng dụng 16 ký tự
        $mail->CharSet    = 'UTF-8';                         // Hỗ trợ tiếng Việt có dấu
        
        $port = (int) ($cfg['port'] ?? 587);
        $mail->Port = $port;
        if ($port === 465) {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        } else {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        }

        // Cấu hình người gửi
        $mail->setFrom((string) ($cfg['from'] ?? $cfg['user']), (string) ($cfg['from_name'] ?? 'BakeMate'));

        return $mail;
    }

    /**
     * Gửi mã OTP (cho cả Đăng ký và Quên mật khẩu)
     */
    public static function sendOtp(string $toEmail, string $otpCode, string $fullName = '', string $purpose = 'forgot_password'): array
    {
        $isLocal = strtolower(trim((string) Env::get('APP_ENV', 'local'))) === 'local';
        $isRegister = ($purpose === 'register');

        $subject = $isRegister 
            ? '[BakeMate] Mã OTP xác thực đăng ký tài khoản' 
            : '[BakeMate] Mã OTP khôi phục mật khẩu';

        $greeting = $fullName !== '' ? "Xin chào <strong>{$fullName}</strong>," : 'Xin chào bạn,';
        $actionText = $isRegister 
            ? 'Cảm ơn bạn đã đăng ký tài khoản tại BakeMate. Mã xác thực email của bạn là:'
            : 'Bạn vừa yêu cầu khôi phục mật khẩu tài khoản BakeMate. Mã xác thực của bạn là:';

        $htmlBody = "
        <div style='font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #fed7aa; border-radius: 10px; background: #fffcf8;'>
            <h2 style='color: #70452b; margin-top: 0;'>BakeMate Bakery</h2>
            <p>{$greeting}</p>
            <p>{$actionText}</p>
            <div style='text-align: center; margin: 25px 0;'>
                <span style='font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #b45309; background: #fef3c7; padding: 10px 20px; border-radius: 8px; border: 1px dashed #f59e0b;'>{$otpCode}</span>
            </div>
            <p style='color: #64748b; font-size: 13px;'>Mã có hiệu lực trong vòng <strong>5 phút</strong>. Vui lòng không chia sẻ mã này cho người khác.</p>
        </div>";

        // Lưu preview OTP vào session nếu chạy ở localhost phục vụ việc test
        if ($isLocal && session_status() === PHP_SESSION_ACTIVE) {
            $_SESSION['bakemate_dev_mail_preview'] = [
                'to' => $toEmail,
                'subject' => $subject,
                'otp' => $otpCode,
                'created_at' => date('Y-m-d H:i:s'),
            ];
        }

        try {
            $mail = self::createMailer();
            if (!$mail) {
                return [
                    'sent' => false,
                    'mode' => $isLocal ? 'local_preview' : 'mail_unavailable',
                    'dev_otp_preview' => $isLocal ? $otpCode : '',
                    'message' => $isLocal ? 'Chế độ Local: Đã sinh OTP test (chưa cấu hình Gmail SMTP).' : 'Chưa cấu hình mail trong .env',
                ];
            }

            $mail->addAddress($toEmail);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $htmlBody;
            $mail->AltBody = strip_tags($htmlBody);

            $mail->send();

            return [
                'sent' => true,
                'mode' => 'smtp_mail',
                'dev_otp_preview' => '',
                'message' => 'Mã OTP đã được gửi đến email ' . $toEmail,
            ];
        } catch (Exception $e) {
            error_log('Lỗi PHPMailer: ' . $e->getMessage());
            return [
                'sent' => false,
                'mode' => $isLocal ? 'local_fallback' : 'mail_failed',
                'dev_otp_preview' => $isLocal ? $otpCode : '',
                'message' => 'Lỗi gửi mail: ' . $mail->ErrorInfo,
            ];
        }
    }
}