<?php
declare(strict_types=1);

/**
 * ProductVariantEntity
 * Đóng gói quy cách đóng gói và kiểm tra tính hợp lệ của giá bán / tồn kho.
 */
class ProductVariantEntity
{
    private string $shortLabel;
    private int $price = 0;
    private int $oldPrice = 0;
    private int $stockQty = 0;

    public function __construct(string $shortLabel, int $price, int $oldPrice = 0, int $stockQty = 0)
    {
        $cleanLabel = trim($shortLabel);
        if ($cleanLabel === '') {
            throw new InvalidArgumentException('Nhãn quy cách đóng gói không được để trống.');
        }
        $this->shortLabel = $cleanLabel;
        $this->setPrice($price);
        $this->oldPrice = max($this->price, $oldPrice);
        $this->setStockQty($stockQty);
    }

    public function setPrice(int $price): void
    {
        if ($price <= 0) {
            throw new InvalidArgumentException('Giá bán sản phẩm phải lớn hơn 0 đ.');
        }
        $this->price = $price;
    }

    public function setStockQty(int $qty): void
    {
        if ($qty < 0) {
            throw new InvalidArgumentException('Số lượng tồn kho không được âm.');
        }
        $this->stockQty = $qty;
    }

    public function getPrice(): int
    {
        return $this->price;
    }

    public function getOldPrice(): int
    {
        return $this->oldPrice;
    }

    public function getStockQty(): int
    {
        return $this->stockQty;
    }

    public function getShortLabel(): string
    {
        return $this->shortLabel;
    }
}
