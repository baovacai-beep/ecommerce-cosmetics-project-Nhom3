<?php
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . 'ProductEntity.php';

class BakingToolProduct extends ProductEntity
{
    public function getStorageRequirement(): string
    {
        return 'Vệ sinh nhẹ nhàng bằng mút mềm và lau khô sau khi sử dụng, bảo quản nơi khô thoáng.';
    }
}
