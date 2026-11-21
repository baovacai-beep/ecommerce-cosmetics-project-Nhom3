<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'interfaces' . DIRECTORY_SEPARATOR . 'PackagingCalculatorInterface.php';

/**
 * ToolPackagingCalculator
 * Chọn một dụng cụ còn hàng; không nhân số lượng dụng cụ theo khẩu phần bánh.
 */
class ToolPackagingCalculator implements PackagingCalculatorInterface
{
    public function calculateRequiredPacks(float $neededAmount, array $variants): array
    {
        if ($neededAmount <= 0 || empty($variants)) {
            return ['packs' => 0, 'variant' => null, 'surplus' => 0.0];
        }

        foreach ($variants as $variant) {
            if (array_key_exists('stock_qty', $variant) && (int) $variant['stock_qty'] < 1) {
                continue;
            }

            return [
                'packs' => 1,
                'variant' => $variant,
                'surplus' => 0.0,
            ];
        }

        return ['packs' => 0, 'variant' => null, 'surplus' => 0.0];
    }
}
