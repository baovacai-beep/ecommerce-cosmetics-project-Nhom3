<?php
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . 'AbstractPaymentMethod.php';

class EWalletPayment extends AbstractPaymentMethod
{
    public const SUPPORTED_PROVIDERS = ['MoMo', 'VNPAY', 'ZaloPay'];

    private string $provider = 'MoMo';

    public function __construct(string $provider = 'MoMo')
    {
        $this->setProvider($provider);
    }

    public function setProvider(string $provider): void
    {
        $normalized = strtolower(trim($provider));
        foreach (self::SUPPORTED_PROVIDERS as $supported) {
            if (strtolower($supported) === $normalized) {
                $this->provider = $supported;
                return;
            }
        }
        $this->provider = 'MoMo';
    }

    public function getProvider(): string
    {
        return $this->provider;
    }

    public function getMethodCode(): string
    {
        return 'ewallet';
    }

    public function getDisplayName(): string
    {
        return 'Ví điện tử (' . $this->provider . ')';
    }

    protected function executePayment(string $orderCode, int $amount): array
    {
        return $this->buildPayResult(
            'paid',
            'Đã ghi nhận thanh toán ví điện tử ' . $this->provider . ' cho đơn hàng ' . $orderCode . '.',
            [
                'order_code' => $orderCode,
                'method' => $this->getMethodCode(),
                'provider' => $this->provider,
                'amount' => $amount,
                'currency' => $this->getCurrency(),
            ]
        );
    }
}
