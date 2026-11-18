<?php
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . 'AbstractPaymentMethod.php';

class CodPayment extends AbstractPaymentMethod
{
    public function getMethodCode(): string
    {
        return 'cod';
    }

    public function getDisplayName(): string
    {
        return 'Thanh toán khi nhận hàng (COD)';
    }

    protected function executePayment(string $orderCode, int $amount): array
    {
        return $this->buildPayResult(
            'unpaid',
            'Đặt hàng COD thành công. Bạn sẽ thanh toán ' . App::formatCurrency($amount) . ' khi nhận hàng.',
            [
                'order_code' => $orderCode,
                'method' => $this->getMethodCode(),
                'amount' => $amount,
                'currency' => $this->getCurrency(),
            ]
        );
    }
}
