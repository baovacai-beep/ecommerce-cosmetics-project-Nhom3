<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'interfaces' . DIRECTORY_SEPARATOR . 'PackagingCalculatorInterface.php';

/**
 * IngredientPackagingCalculator
 * Tính số gói nguyên liệu tối ưu: đủ định lượng, đủ tồn kho và hạn chế lượng dư.
 */
class IngredientPackagingCalculator implements PackagingCalculatorInterface
{
    public function calculateRequiredPacks(float $neededAmount, array $variants): array
    {
        if (!is_finite($neededAmount) || $neededAmount <= 0 || empty($variants)) {
            return ['packs' => 0, 'variant' => null, 'surplus' => 0.0];
        }

        $bestVariant = null;
        $bestPacks = 0;
        $bestSurplus = INF;
        $bestCost = INF;

        foreach ($variants as $variant) {
            $unitAmount = (float) ($variant['unit_amount'] ?? 0);
            if (!is_finite($unitAmount) || $unitAmount <= 0) {
                continue;
            }

            // Trừ sai số số thực rất nhỏ để trường hợp chia hết không bị làm tròn dư.
            $packs = max(1, (int) ceil(($neededAmount - 0.000001) / $unitAmount));
            if (array_key_exists('stock_qty', $variant) && (int) $variant['stock_qty'] < $packs) {
                continue;
            }

            $surplus = max(0.0, ($packs * $unitAmount) - $neededAmount);
            $cost = max(0, (int) ($variant['price'] ?? 0)) * $packs;
            $hasLessSurplus = $surplus < ($bestSurplus - 0.000001);
            $sameSurplus = abs($surplus - $bestSurplus) <= 0.000001;
            $hasFewerPacks = $sameSurplus && ($bestPacks === 0 || $packs < $bestPacks);
            $samePackCount = $sameSurplus && $packs === $bestPacks;
            $hasLowerCost = $samePackCount && $cost < $bestCost;

            if ($bestVariant === null || $hasLessSurplus || $hasFewerPacks || $hasLowerCost) {
                $bestVariant = $variant;
                $bestPacks = $packs;
                $bestSurplus = $surplus;
                $bestCost = $cost;
            }
        }

        if ($bestVariant === null) {
            return ['packs' => 0, 'variant' => null, 'surplus' => 0.0];
        }

        return [
            'packs' => $bestPacks,
            'variant' => $bestVariant,
            'surplus' => round($bestSurplus, 2),
        ];
    }
}
