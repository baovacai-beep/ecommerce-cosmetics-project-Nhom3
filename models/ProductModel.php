<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR . 'Model.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'entities' . DIRECTORY_SEPARATOR . 'IngredientProduct.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'entities' . DIRECTORY_SEPARATOR . 'BakingToolProduct.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'entities' . DIRECTORY_SEPARATOR . 'ProductVariantEntity.php';

/**
 * ProductModel
 * Truy vấn danh mục, bộ lọc đa chiều, biến thể quy cách, thông số,
 * đánh giá sản phẩm và thao tác CRUD quản trị trên MySQL PDO.
 */
class ProductModel extends Model
{
    public static function normalizeSearch(string $text): string
    {
        $map = [
            'à'=>'a','á'=>'a','ạ'=>'a','ả'=>'a','ã'=>'a','â'=>'a','ầ'=>'a','ấ'=>'a','ậ'=>'a','ẩ'=>'a','ẫ'=>'a','ă'=>'a','ằ'=>'a','ắ'=>'a','ặ'=>'a','ẳ'=>'a','ẵ'=>'a',
            'è'=>'e','é'=>'e','ẹ'=>'e','ẻ'=>'e','ẽ'=>'e','ê'=>'e','ề'=>'e','ế'=>'e','ệ'=>'e','ể'=>'e','ễ'=>'e',
            'ì'=>'i','í'=>'i','ị'=>'i','ỉ'=>'i','ĩ'=>'i',
            'ò'=>'o','ó'=>'o','ọ'=>'o','ỏ'=>'o','õ'=>'o','ô'=>'o','ồ'=>'o','ố'=>'o','ộ'=>'o','ổ'=>'o','ỗ'=>'o','ơ'=>'o','ờ'=>'o','ớ'=>'o','ợ'=>'o','ở'=>'o','ỡ'=>'o',
            'ù'=>'u','ú'=>'u','ụ'=>'u','ủ'=>'u','ũ'=>'u','ư'=>'u','ừ'=>'u','ứ'=>'u','ự'=>'u','ử'=>'u','ữ'=>'u',
            'ỳ'=>'y','ý'=>'y','ỵ'=>'y','ỷ'=>'y','ỹ'=>'y','đ'=>'d',
        ];
        return strtr(mb_strtolower(trim($text), 'UTF-8'), $map);
    }

    public function getFilterMetadata(): array
    {
        $categories = $this->db->query('SELECT * FROM categories ORDER BY sort_order ASC')->fetchAll();
        $subcats = $this->db->query('SELECT s.*, c.name AS category_name FROM subcategories s INNER JOIN categories c ON c.id = s.category_id ORDER BY s.sort_order ASC')->fetchAll();
        $brands = $this->db->query('SELECT * FROM brands ORDER BY name ASC')->fetchAll();
        $priceRange = $this->db->query(
            'SELECT COALESCE(MIN(v.price), 0) AS min_price, COALESCE(MAX(v.price), 200000) AS max_price
             FROM product_variants v INNER JOIN products p ON p.id = v.product_id WHERE v.option_index = 0 AND p.is_hidden = 0'
        )->fetch();

        return [
            'categories' => $categories,
            'subcategories' => $subcats,
            'brands' => $brands,
            'min_price' => (int) ($priceRange['min_price'] ?? 0),
            'max_price' => max(150000, (int) ($priceRange['max_price'] ?? 150000)),
        ];
    }

    public function getCatalog(array $filters = [], bool $includeHidden = false): array
    {
        $sql = "
            SELECT p.*,
                   c.name AS category_name,
                   b.name AS brand_name,
                   v.price AS default_price,
                   v.old_price AS default_old_price,
                   v.stock_qty AS default_stock_qty,
                   v.short_label AS default_variant_label,
                   (SELECT pi.image_path FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order ASC LIMIT 1) AS primary_image,
                   GROUP_CONCAT(DISTINCT s.name ORDER BY s.sort_order SEPARATOR '|') AS sub_names
            FROM products p
            INNER JOIN categories c ON c.id = p.category_id
            INNER JOIN brands b ON b.id = p.brand_id
            LEFT JOIN product_variants v ON v.product_id = p.id AND v.option_index = 0
            LEFT JOIN product_subcategories ps ON ps.product_id = p.id
            LEFT JOIN subcategories s ON s.id = ps.subcategory_id
            WHERE 1=1
        ";
        $params = [];

        if (!$includeHidden) {
            $sql .= ' AND p.is_hidden = 0';
        }
        if (!empty($filters['category'])) {
            $cats = is_array($filters['category']) ? $filters['category'] : [$filters['category']];
            $ph = implode(',', array_fill(0, count($cats), '?'));
            $sql .= " AND c.name IN ({$ph})";
            foreach ($cats as $cat) {
                $params[] = trim((string) $cat);
            }
        }
        if (!empty($filters['brand'])) {
            $brands = is_array($filters['brand']) ? $filters['brand'] : [$filters['brand']];
            $ph = implode(',', array_fill(0, count($brands), '?'));
            $sql .= " AND b.name IN ({$ph})";
            foreach ($brands as $br) {
                $params[] = trim((string) $br);
            }
        }
        if (isset($filters['min_price']) && $filters['min_price'] !== '' && is_numeric($filters['min_price'])) {
            $sql .= ' AND v.price >= ?';
            $params[] = (int) $filters['min_price'];
        }
        if (isset($filters['max_price']) && $filters['max_price'] !== '' && is_numeric($filters['max_price'])) {
            $sql .= ' AND v.price <= ?';
            $params[] = (int) $filters['max_price'];
        }
        if (!empty($filters['stock']) && is_array($filters['stock'])) {
            $stockConds = [];
            foreach ($filters['stock'] as $st) {
                if ($st === 'in_stock') $stockConds[] = "p.stock_status = 'in_stock'";
                elseif ($st === 'new') $stockConds[] = 'p.is_new = 1';
                elseif ($st === 'sale') $stockConds[] = 'p.on_sale = 1';
                elseif ($st === 'coming_soon') $stockConds[] = "p.stock_status = 'coming_soon'";
            }
            if (!empty($stockConds)) {
                $sql .= ' AND (' . implode(' OR ', $stockConds) . ')';
            }
        }

        $sql .= ' GROUP BY p.id';

        $sort = (string) ($filters['sort'] ?? 'featured');
        $orderBy = match ($sort) {
            'price-asc' => ' ORDER BY default_price ASC, p.id ASC',
            'price-desc' => ' ORDER BY default_price DESC, p.id ASC',
            'name-asc' => ' ORDER BY p.name ASC',
            'name-desc' => ' ORDER BY p.name DESC',
            'newest' => ' ORDER BY p.is_new DESC, p.id DESC',
            default => ' ORDER BY p.is_featured DESC, p.id ASC',
        };
        $sql .= $orderBy;

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        // Lọc từ khóa không phân biệt dấu & subcategory chính xác
        $qNorm = self::normalizeSearch((string) ($filters['q'] ?? ''));
        $subFilter = !empty($filters['sub'])
            ? (is_array($filters['sub']) ? $filters['sub'] : [$filters['sub']])
            : [];

        $result = [];
        foreach ($rows as $row) {
            $subs = $row['sub_names'] !== null && $row['sub_names'] !== '' ? explode('|', (string) $row['sub_names']) : [];
            $row['subCategories'] = $subs;
            $row['primary_image'] = $row['primary_image'] ?: 'images/logo.jpg';

            if (!empty($subFilter)) {
                $matchedSub = false;
                foreach ($subFilter as $sf) {
                    if (in_array(trim((string) $sf), $subs, true)) {
                        $matchedSub = true;
                        break;
                    }
                }
                if (!$matchedSub) {
                    continue;
                }
            }

            if ($qNorm !== '') {
                $haystack = self::normalizeSearch($row['name'] . ' ' . $row['category_name'] . ' ' . $row['brand_name'] . ' ' . $row['description'] . ' ' . implode(' ', $subs));
                if (!str_contains($haystack, $qNorm)) {
                    continue;
                }
            }

            $result[] = $row;
        }

        return $result;
    }

    public function getFeaturedProducts(int $limit = 4): array
    {
        $all = $this->getCatalog(['sort' => 'featured'], false);
        $featured = array_values(array_filter($all, static fn(array $p): bool => !empty($p['is_featured'])));
        return array_slice($featured ?: $all, 0, $limit);
    }

    public function getProductDetailBySlug(string $slug): ?array
    {
        $stmt = $this->db->prepare('SELECT id FROM products WHERE slug = ? AND is_hidden = 0 LIMIT 1');
        $stmt->execute([trim($slug)]);
        $id = (int) $stmt->fetchColumn();
        return $id > 0 ? $this->getProductDetail($id) : null;
    }

    public function getProductDetail(int $productId): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT p.*, c.name AS category_name, b.name AS brand_name
             FROM products p
             INNER JOIN categories c ON c.id = p.category_id
             INNER JOIN brands b ON b.id = p.brand_id
             WHERE p.id = ? AND p.is_hidden = 0 LIMIT 1'
        );
        $stmt->execute([$productId]);
        $product = $stmt->fetch();
        if (!$product) {
            return null;
        }

        $variantsStmt = $this->db->prepare('SELECT * FROM product_variants WHERE product_id = ? ORDER BY option_index ASC');
        $variantsStmt->execute([$productId]);
        $variants = $variantsStmt->fetchAll();

        $imagesStmt = $this->db->prepare('SELECT image_path FROM product_images WHERE product_id = ? ORDER BY sort_order ASC');
        $imagesStmt->execute([$productId]);
        $images = array_column($imagesStmt->fetchAll(), 'image_path');
        if (empty($images)) {
            $images = ['images/logo.jpg'];
        }

        $specsStmt = $this->db->prepare('SELECT spec_key, spec_value FROM product_specs WHERE product_id = ? ORDER BY sort_order ASC');
        $specsStmt->execute([$productId]);
        $specs = $specsStmt->fetchAll();

        $reviewsStmt = $this->db->prepare(
            "SELECT * FROM product_reviews WHERE product_id = ? AND status = 'approved' ORDER BY id DESC"
        );
        $reviewsStmt->execute([$productId]);
        $reviews = $reviewsStmt->fetchAll();

        // Công thức liên quan chứa sản phẩm này (nguyên liệu hoặc dụng cụ)
        $recStmt = $this->db->prepare(
            'SELECT DISTINCT r.id, r.slug, r.title, r.time_label, r.difficulty, r.image_path,
                    COALESCE(ri.name, rt.name) AS item_usage
             FROM recipes r
             LEFT JOIN recipe_ingredients ri ON ri.recipe_id = r.id AND ri.product_id = ?
             LEFT JOIN recipe_tools rt ON rt.recipe_id = r.id AND rt.product_id = ?
             WHERE (ri.product_id IS NOT NULL OR rt.product_id IS NOT NULL) AND r.is_published = 1
             LIMIT 3'
        );
        $recStmt->execute([$productId, $productId]);
        $relatedRecipes = $recStmt->fetchAll();

        // Sản phẩm liên quan cùng danh mục
        $relStmt = $this->db->prepare(
            'SELECT p.id, p.name, p.stock_status, p.is_perishable, c.name AS category_name,
                    v.price AS default_price, v.old_price AS default_old_price,
                    (SELECT pi.image_path FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order ASC LIMIT 1) AS primary_image
             FROM products p
             INNER JOIN categories c ON c.id = p.category_id
             LEFT JOIN product_variants v ON v.product_id = p.id AND v.option_index = 0
             WHERE p.category_id = ? AND p.id <> ? AND p.is_hidden = 0
             ORDER BY p.is_featured DESC, p.id ASC LIMIT 4'
        );
        $relStmt->execute([(int) $product['category_id'], $productId]);
        $relatedProducts = $relStmt->fetchAll();

        // Đa hình OOP Entity lấy hướng dẫn bảo quản
        $entity = $product['category_name'] === 'Dụng cụ'
            ? new BakingToolProduct($productId, (string) $product['name'], (string) $product['category_name'], false)
            : new IngredientProduct($productId, (string) $product['name'], (string) $product['category_name'], !empty($product['is_perishable']));

        $product['variants'] = $variants;
        $product['images'] = $images;
        $product['specs'] = $specs;
        $product['reviews'] = $reviews;
        $product['related_recipes'] = $relatedRecipes;
        $product['related_products'] = $relatedProducts;
        $product['storage_requirement'] = $entity->getStorageRequirement();

        return $product;
    }

    public function addReview(int $productId, ?int $userId, string $reviewerName, int $rating, string $comment, ?string $imagePath = null): array
    {
        $cleanRating = max(1, min(5, $rating));
        $stmt = $this->db->prepare(
            'INSERT INTO product_reviews (product_id, user_id, reviewer_name, rating, comment, image_path, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([$productId, $userId, trim($reviewerName), $cleanRating, trim($comment), $imagePath, 'approved']);
        $id = (int) $this->db->lastInsertId();
        $row = $this->db->prepare('SELECT * FROM product_reviews WHERE id = ?');
        $row->execute([$id]);
        return $row->fetch() ?: [];
    }

    public function trackRecentlyViewed(int $productId): void
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            return;
        }
        $list = $_SESSION['bakemate_recent_products'] ?? [];
        if (!is_array($list)) {
            $list = [];
        }
        $list = array_values(array_filter(array_map('intval', $list), static fn(int $id): bool => $id > 0 && $id !== $productId));
        array_unshift($list, $productId);
        $_SESSION['bakemate_recent_products'] = array_slice($list, 0, 8);
    }

    public function getRecentlyViewed(int $excludeId = 0, int $limit = 4): array
    {
        if (session_status() !== PHP_SESSION_ACTIVE || empty($_SESSION['bakemate_recent_products'])) {
            return [];
        }
        $ids = array_values(array_filter(array_map('intval', (array) $_SESSION['bakemate_recent_products']), static fn(int $id): bool => $id > 0 && $id !== $excludeId));
        $ids = array_slice($ids, 0, $limit);
        if (empty($ids)) {
            return [];
        }
        $ph = implode(',', array_fill(0, count($ids), '?'));
        $stmt = $this->db->prepare(
            "SELECT p.*, c.name AS category_name, b.name AS brand_name,
                    v.price AS default_price, v.old_price AS default_old_price,
                    (SELECT pi.image_path FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order ASC LIMIT 1) AS primary_image
             FROM products p
             INNER JOIN categories c ON c.id = p.category_id
             INNER JOIN brands b ON b.id = p.brand_id
             LEFT JOIN product_variants v ON v.product_id = p.id AND v.option_index = 0
             WHERE p.id IN ({$ph}) AND p.is_hidden = 0"
        );
        $stmt->execute($ids);
        $rows = $stmt->fetchAll();
        $indexed = [];
        foreach ($rows as $r) {
            $indexed[(int) $r['id']] = $r;
        }
        $ordered = [];
        foreach ($ids as $id) {
            if (isset($indexed[$id])) {
                $ordered[] = $indexed[$id];
            }
        }
        return $ordered;
    }

    public function saveAdminProduct(array $data): array
    {
        $id = (int) ($data['id'] ?? 0);
        $name = trim((string) ($data['name'] ?? ''));
        $price = (int) ($data['price'] ?? 0);
        $oldPrice = (int) ($data['old_price'] ?? $price);
        $stockQty = (int) ($data['stock_qty'] ?? 50);
        $packagingLabel = trim((string) ($data['packaging_label'] ?? 'Tiêu chuẩn'));

        // Validate bằng OOP Entity (Encapsulation)
        $prodEntity = new IngredientProduct($id, $name, (string) ($data['category_name'] ?? 'Nguyên liệu'), !empty($data['is_perishable']));
        $varEntity = new ProductVariantEntity($packagingLabel, $price, $oldPrice, $stockQty);

        $catName = trim((string) ($data['category_name'] ?? 'Nguyên liệu'));
        $brandName = trim((string) ($data['brand_name'] ?? 'BakeMate')) ?: 'BakeMate';

        $catStmt = $this->db->prepare('SELECT id FROM categories WHERE name = ? LIMIT 1');
        $catStmt->execute([$catName]);
        $catId = (int) ($catStmt->fetchColumn() ?: 1);

        $brandStmt = $this->db->prepare('SELECT id FROM brands WHERE name = ? LIMIT 1');
        $brandStmt->execute([$brandName]);
        $brandId = (int) $brandStmt->fetchColumn();
        if ($brandId <= 0) {
            $slugBrand = preg_replace('/[^a-z0-9]+/', '-', strtolower($brandName)) . '-' . random_int(10, 99);
            $this->db->prepare('INSERT INTO brands (name, slug) VALUES (?, ?)')->execute([$brandName, trim($slugBrand, '-')]);
            $brandId = (int) $this->db->lastInsertId();
        }

        $stockStatus = in_array((string) ($data['stock_status'] ?? ''), ['in_stock', 'out_of_stock', 'coming_soon'], true)
            ? (string) $data['stock_status']
            : 'in_stock';
        $isPerishable = !empty($data['is_perishable']) ? 1 : 0;
        $isNew = !empty($data['is_new']) ? 1 : 0;
        $onSale = $varEntity->getOldPrice() > $varEntity->getPrice() ? 1 : (!empty($data['on_sale']) ? 1 : 0);
        $isFeatured = !empty($data['is_featured']) ? 1 : 0;
        $description = trim((string) ($data['description'] ?? ''));

        $this->db->beginTransaction();
        try {
            if ($id > 0) {
                $upd = $this->db->prepare(
                    'UPDATE products SET name = ?, category_id = ?, brand_id = ?, packaging_label = ?, description = ?,
                     is_perishable = ?, stock_status = ?, is_new = ?, on_sale = ?, is_featured = ? WHERE id = ?'
                );
                $upd->execute([
                    $prodEntity->getName(),
                    $catId,
                    $brandId,
                    $varEntity->getShortLabel(),
                    $description,
                    $isPerishable,
                    $stockStatus,
                    $isNew,
                    $onSale,
                    $isFeatured,
                    $id,
                ]);
                $this->db->prepare(
                    'UPDATE product_variants SET short_label = ?, price = ?, old_price = ?, stock_qty = ? WHERE product_id = ? AND option_index = 0'
                )->execute([$varEntity->getShortLabel(), $varEntity->getPrice(), $varEntity->getOldPrice(), $varEntity->getStockQty(), $id]);

                if (!empty($data['image_path'])) {
                    $hasImg = $this->db->prepare('SELECT id FROM product_images WHERE product_id = ? ORDER BY sort_order ASC LIMIT 1');
                    $hasImg->execute([$id]);
                    $imgId = (int) $hasImg->fetchColumn();
                    if ($imgId > 0) {
                        $this->db->prepare('UPDATE product_images SET image_path = ? WHERE id = ?')->execute([(string) $data['image_path'], $imgId]);
                    } else {
                        $this->db->prepare('INSERT INTO product_images (product_id, image_path, sort_order) VALUES (?, ?, 1)')->execute([$id, (string) $data['image_path']]);
                    }
                }
            } else {
                $slug = preg_replace('/[^a-z0-9]+/', '-', self::normalizeSearch($prodEntity->getName())) . '-' . time();
                $ins = $this->db->prepare(
                    'INSERT INTO products (slug, name, category_id, brand_id, packaging_label, description, is_perishable, stock_status, is_new, on_sale, is_featured)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                );
                $ins->execute([
                    trim($slug, '-'),
                    $prodEntity->getName(),
                    $catId,
                    $brandId,
                    $varEntity->getShortLabel(),
                    $description,
                    $isPerishable,
                    $stockStatus,
                    $isNew,
                    $onSale,
                    $isFeatured,
                ]);
                $id = (int) $this->db->lastInsertId();
                $this->db->prepare(
                    'INSERT INTO product_variants (product_id, option_index, short_label, unit_amount, unit_type, price, old_price, stock_qty, is_default)
                     VALUES (?, 0, ?, 1.00, ?, ?, ?, ?, 1)'
                )->execute([$id, $varEntity->getShortLabel(), 'sản phẩm', $varEntity->getPrice(), $varEntity->getOldPrice(), $varEntity->getStockQty()]);

                $imgPath = !empty($data['image_path']) ? (string) $data['image_path'] : 'images/logo.jpg';
                $this->db->prepare('INSERT INTO product_images (product_id, image_path, sort_order) VALUES (?, ?, 1)')->execute([$id, $imgPath]);
            }
            $this->db->commit();
        } catch (Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }

        return ['ok' => true, 'id' => $id, 'message' => 'Đã lưu thông tin sản phẩm thành công!'];
    }

    public function toggleVisibility(int $productId): array
    {
        $stmt = $this->db->prepare('SELECT is_hidden FROM products WHERE id = ? LIMIT 1');
        $stmt->execute([$productId]);
        $row = $stmt->fetch();
        if (!$row) {
            return ['ok' => false, 'message' => 'Không tìm thấy sản phẩm.'];
        }
        $next = !empty($row['is_hidden']) ? 0 : 1;
        $this->db->prepare('UPDATE products SET is_hidden = ? WHERE id = ?')->execute([$next, $productId]);
        return ['ok' => true, 'is_hidden' => (bool) $next, 'message' => $next ? 'Đã ẩn sản phẩm khỏi cửa hàng.' : 'Đã hiển thị lại sản phẩm.'];
    }

    public function updateVariantStock(int $productId, int $stockQty): array
    {
        $cleanQty = max(0, $stockQty);
        $status = $cleanQty > 0 ? 'in_stock' : 'out_of_stock';
        $this->db->prepare('UPDATE product_variants SET stock_qty = ? WHERE product_id = ? AND option_index = 0')->execute([$cleanQty, $productId]);
        $this->db->prepare("UPDATE products SET stock_status = ? WHERE id = ? AND stock_status <> 'coming_soon'")->execute([$status, $productId]);
        return ['ok' => true, 'stock_qty' => $cleanQty, 'message' => 'Đã cập nhật tồn kho mới.'];
    }
}
