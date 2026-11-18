<?php
declare(strict_types=1);

/**
 * RecipeEntity
 * Đóng gói công thức làm bánh và quy đổi định lượng nguyên liệu theo số phần.
 */
class RecipeEntity
{
    private int $id;
    private string $title;
    private int $defaultServings;

    public function __construct(int $id, string $title, int $defaultServings)
    {
        $this->id = $id;
        $cleanTitle = trim($title);
        if (mb_strlen($cleanTitle, 'UTF-8') < 3) {
            throw new InvalidArgumentException('Tên công thức phải có ít nhất 3 ký tự.');
        }
        $this->title = $cleanTitle;
        $this->setDefaultServings($defaultServings);
    }

    public function setDefaultServings(int $servings): void
    {
        if ($servings < 1) {
            throw new InvalidArgumentException('Số phần bánh gốc phải lớn hơn hoặc bằng 1.');
        }
        $this->defaultServings = $servings;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getDefaultServings(): int
    {
        return $this->defaultServings;
    }

    public function scaleAmount(float $baseAmount, int $targetServings): float
    {
        if ($targetServings < 1) {
            throw new InvalidArgumentException('Số phần bánh cần làm phải lớn hơn hoặc bằng 1.');
        }
        return round($baseAmount * ($targetServings / $this->defaultServings), 2);
    }
}
