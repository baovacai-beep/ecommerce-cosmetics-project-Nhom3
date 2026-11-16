<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'interfaces' . DIRECTORY_SEPARATOR . 'PaymentMethodInterface.php';

class CodPayment implements PaymentMethodInterface
{
    public function getMethodCode(): string
    {
        return 'cod';
    }

    public function pay(string $orderCode, int $amount): array
    {
        return [
            'payment_status' => 'unpaid',
            'message' => 'Đặt hàng COD thành công. Bạn sẽ thanh toán ' . App::formatCurrency($amount) . ' khi nhận hàng.',
            'payload' => ['order_code' => $orderCode, 'method' => 'cod'],
        ];
    }
}
