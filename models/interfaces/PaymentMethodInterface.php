<?php
declare(strict_types=1);

/**
 * PaymentMethodInterface
 * Hợp đồng trừu tượng cho mọi phương thức thanh toán (COD, VietQR, Ví điện tử).
 */
interface PaymentMethodInterface
{
    public function getMethodCode(): string;

    /**
     * Thực hiện xử lý giao dịch cho đơn hàng.
     *
     * @return array{payment_status:string, message:string, payload:array}
     */
    public function pay(string $orderCode, int $amount): array;
}
