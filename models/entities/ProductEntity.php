<?php
declare(strict_types=1);

/**
 * ProductEntity
 * Lớp trừu tượng cho sản phẩm BakeMate (Encapsulation + Inheritance + Polymorphism).
 */
abstract class ProductEntity
{
    private int $id;
    protected string $name = '';
    protected string $category = '';
    protected bool $isPerishable = false;

    public function __construct(int $id, string $name, string $category, bool $isPerishable = false)
    {
        $this->id = $id;
        $this->setName($name);
        $this->category = trim($category);
        $this->isPerishable = $isPerishable;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $clean = trim($name);
        if (mb_strlen($clean, 'UTF-8') < 2) {
            throw new InvalidArgumentException('Tên sản phẩm phải có ít nhất 2 ký tự.');
        }
        $this->name = $clean;
    }

    public function isPerishable(): bool
    {
        return $this->isPerishable;
    }

    abstract public function getStorageRequirement(): string;
}
