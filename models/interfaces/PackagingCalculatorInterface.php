<?php
declare(strict_types=1);

/**
 * PackagingCalculatorInterface
 * Hợp đồng chung để tính số gói / dụng cụ cần mua theo định lượng.
 */
interface PackagingCalculatorInterface
{
    /**
     * Tính phương án đóng gói đáp ứng định lượng và tồn kho hiện có.
     *
     * Các phần tử variants có thể chứa unit_amount, stock_qty, price và option_index.
     * Nếu có stock_qty, calculator chỉ được chọn biến thể đủ tồn kho cho số gói cần mua.
     *
     * @param array<int, array<string, mixed>> $variants
     * @return array{packs:int, variant:array<string,mixed>|null, surplus:float}
     *         packs = 0 và variant = null khi không có phương án hợp lệ.
     */
    public function calculateRequiredPacks(float $neededAmount, array $variants): array;
}
