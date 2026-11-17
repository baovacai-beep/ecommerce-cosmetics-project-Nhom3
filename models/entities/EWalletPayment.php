<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'interfaces' . DIRECTORY_SEPARATOR . 'PaymentMethodInterface.php';

class EWalletPayment implements PaymentMethodInterface
{
    private string $provider;

    public function __construct(string $provider = 'MoMo')
    {
        $allowed = ['MoMo', 'VNPAY', 'ZaloPay'];
        $this->provider = in_array($provider, $allowed, true) ? $provider : 'MoMo';
    }

    public function getMethodCode(): string
    {
        return 'ewallet';
    }

    public function pay(string $orderCode, int $amount): array
    {
        return [
            'payment_status' => 'paid',
            'message' => 'Đã ghi nhận thanh toán ví điện tử ' . $this->provider . ' cho đơn hàng ' . $orderCode . '.',
            'payload' => [
                'order_code' => $orderCode,
                'provider' => $this->provider,
                'amount' => $amount,
            ],
        ];
    }
}
