<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'interfaces' . DIRECTORY_SEPARATOR . 'PaymentMethodInterface.php';

class VietQrPayment implements PaymentMethodInterface
{
    public function getMethodCode(): string
    {
        return 'vietqr';
    }

    public function pay(string $orderCode, int $amount): array
    {
        $qrPayload = VietQrBankService::buildPaymentPayload($orderCode, $amount);
        return [
            'payment_status' => 'pending_verify',
            'message' => 'Đơn hàng ' . $orderCode . ' đã tạo. Vui lòng quét mã VietQR để hoàn tất thanh toán.',
            'payload' => $qrPayload,
        ];
    }
}
