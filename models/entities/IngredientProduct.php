<?php
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . 'ProductEntity.php';

class IngredientProduct extends ProductEntity
{
    public function getStorageRequirement(): string
    {
        if ($this->isPerishable) {
            return 'Hàng tươi bảo quản lạnh (2–4°C), giao Hỏa tốc 2h nội thành TP.HCM hoặc Nhận tại cửa hàng.';
        }
        return 'Bảo quản nơi khô ráo, thoáng mát, đậy kín bao bì sau khi mở.';
    }
}
