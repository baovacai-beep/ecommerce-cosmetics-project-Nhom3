<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'interfaces' . DIRECTORY_SEPARATOR . 'PackagingCalculatorInterface.php';

/**
 * ToolPackagingCalculator
 * Tính số lượng dụng cụ đề xuất (mặc định 1 đơn vị/bộ, không nhân lên theo khẩu phần bánh).
 */
class ToolPackagingCalculator implements PackagingCalculatorInterface
{
    public function calculateRequiredPacks(float $neededAmount, array $variants): array
    {
        if (empty($variants)) {
            return ['packs' => 0, 'variant' => null, 'surplus' => 0.0];
        }
        return [
            'packs' => 1,
            'variant' => $variants[0],
            'surplus' => 0.0,
        ];
    }
}
