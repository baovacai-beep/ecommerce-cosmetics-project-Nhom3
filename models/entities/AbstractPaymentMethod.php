<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'interfaces' . DIRECTORY_SEPARATOR . 'PaymentMethodInterface.php';

/**
 * AbstractPaymentMethod
 * Lớp cơ sở trừu tượng cho các phương thức thanh toán BakeMate.
 * Áp dụng 4 trụ cột OOP: Trừu tượng hóa, Đóng gói kiểm tra dữ liệu đầu vào,
 * Kế thừa hành vi dùng chung và Đa hình qua executePayment().
 */
abstract class AbstractPaymentMethod implements PaymentMethodInterface
{
    private string $currency = 'VND';

    public function getCurrency(): string
    {
        return $this->currency;
    }

    public function supportsAutoVerification(): bool
    {
        return false;
    }

    final public function pay(string $orderCode, int $amount): array
    {
        $cleanOrderCode = $this->normalizeAndValidateOrderCode($orderCode);
        $validAmount = $this->validateAmount($amount);

        return $this->executePayment($cleanOrderCode, $validAmount);
    }

    abstract protected function executePayment(string $orderCode, int $amount): array;

    protected function normalizeAndValidateOrderCode(string $orderCode): string
    {
        $clean = trim($orderCode);
        if ($clean === '') {
            throw new InvalidArgumentException('Mã đơn hàng thanh toán không được để trống.');
        }
        return $clean;
    }

    protected function validateAmount(int $amount): int
    {
        if ($amount < 0) {
            throw new InvalidArgumentException('Số tiền thanh toán không hợp lệ (không được âm).');
        }
        return $amount;
    }

    protected function buildPayResult(string $paymentStatus, string $message, array $payload = []): array
    {
        return [
            'payment_status' => $paymentStatus,
            'message' => $message,
            'payload' => $payload,
        ];
    }
}
