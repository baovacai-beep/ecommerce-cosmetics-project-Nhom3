<?php
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . 'AbstractPaymentMethod.php';

class VietQrPayment extends AbstractPaymentMethod
{
    public function getMethodCode(): string
    {
        return 'vietqr';
    }

    public function getDisplayName(): string
    {
        return 'Chuyển khoản ngân hàng (VietQR)';
    }

    public function supportsAutoVerification(): bool
    {
        return true;
    }

    protected function executePayment(string $orderCode, int $amount): array
    {
        $qrPayload = VietQrBankService::buildPaymentPayload($orderCode, $amount);
        return $this->buildPayResult(
            'pending_verify',
            'Đơn hàng ' . $orderCode . ' đã tạo. Vui lòng quét mã VietQR để hoàn tất thanh toán.',
            $qrPayload
        );
    }
}
