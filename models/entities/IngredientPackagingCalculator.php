<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'interfaces' . DIRECTORY_SEPARATOR . 'PackagingCalculatorInterface.php';

/**
 * IngredientPackagingCalculator
 * Tính quy cách đóng gói nguyên liệu tối ưu (làm tròn lên, ưu tiên gói vừa khít ít dư nhất).
 */
class IngredientPackagingCalculator implements PackagingCalculatorInterface
{
    public function calculateRequiredPacks(float $neededAmount, array $variants): array
    {
        if (empty($variants)) {
            return ['packs' => 0, 'variant' => null, 'surplus' => 0.0];
        }

        // Sắp xếp từ gói nhỏ đến lớn dựa trên unit_amount
        usort($variants, static fn(array $a, array $b): int => ((float) ($a['unit_amount'] ?? 0)) <=> ((float) ($b['unit_amount'] ?? 0)));

        $bestVariant = $variants[0];
        $bestPacks = 1;
        $bestSurplus = INF;

        foreach ($variants as $v) {
            $unitAmt = max(0.01, (float) ($v['unit_amount'] ?? 1));
            $packs = max(1, (int) ceil($neededAmount / $unitAmt));
            $surplus = ($packs * $unitAmt) - $neededAmount;
            // Ưu tiên lượng dư ít nhất, nếu bằng thì chọn 1 gói thay vì nhiều gói lẻ
            if ($surplus < $bestSurplus || ($surplus === $bestSurplus && $packs < $bestPacks)) {
                $bestSurplus = $surplus;
                $bestPacks = $packs;
                $bestVariant = $v;
            }
        }

        return [
            'packs' => $bestPacks,
            'variant' => $bestVariant,
            'surplus' => round(max(0.0, (float) $bestSurplus), 2),
        ];
    }
}
