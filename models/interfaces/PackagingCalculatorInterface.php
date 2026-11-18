<?php
declare(strict_types=1);

/**
 * PackagingCalculatorInterface
 * Hợp đồng trừu tượng tính số lượng gói / dụng cụ tối thiểu cần mua theo định lượng.
 */
interface PackagingCalculatorInterface
{
    /**
     * @param array<int, array<string, mixed>> $variants
     * @return array{packs:int, variant:array<string,mixed>|null, surplus:float}
     */
    public function calculateRequiredPacks(float $neededAmount, array $variants): array;
}
