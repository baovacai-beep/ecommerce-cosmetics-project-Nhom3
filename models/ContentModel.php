<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR . 'Model.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'ProductModel.php';

/**
 * ContentModel
 * Quản lý Blog, Danh sách yêu thích (Wishlist), Liên hệ (Contacts),
 * Khuyến mãi (Coupons), Kiểm duyệt Đánh giá và Thống kê Dashboard Admin/Staff.
 */
class ContentModel extends Model
{
    public function getBlogPosts(string $category = 'all', string $q = '', bool $includeUnpublished = false): array
    {
        $sql = 'SELECT * FROM blog_posts WHERE 1=1';
        $params = [];
        if (!$includeUnpublished) {
            $sql .= ' AND is_published = 1';
        }
        if ($category !== '' && $category !== 'all' && $category !== 'Tất cả') {
            $sql .= ' AND category = ?';
            $params[] = $category;
        }
        $sql .= ' ORDER BY id ASC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        $qNorm = ProductModel::normalizeSearch($q);
        $out = [];
        foreach ($rows as $row) {
            $steps = json_decode((string) ($row['steps_json'] ?? '[]'), true);
            $row['steps'] = is_array($steps) ? $steps : [];
            $gallery = json_decode((string) ($row['gallery_json'] ?? '[]'), true);
            $row['gallery'] = is_array($gallery) && !empty($gallery) ? $gallery : [$row['image_path']];
            $content = json_decode((string) ($row['content_json'] ?? ''), true);
            $row['content'] = is_array($content) ? $content : null;
            if ($qNorm !== '') {
                $hay = ProductModel::normalizeSearch($row['title'] . ' ' . $row['category'] . ' ' . $row['keywords_text'] . ' ' . $row['excerpt']);
                if (!str_contains($hay, $qNorm)) {
                    continue;
                }
            }
            $out[] = $row;
        }
        return $out;
    }

    public function getBlogPost(string|int $idOrSlug): ?array
    {
        $val = trim((string) $idOrSlug);
        $stmt = ctype_digit($val)
            ? $this->db->prepare('SELECT * FROM blog_posts WHERE id = ? LIMIT 1')
            : $this->db->prepare('SELECT * FROM blog_posts WHERE slug = ? LIMIT 1');
        $stmt->execute([ctype_digit($val) ? (int) $val : $val]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }
        $steps = json_decode((string) ($row['steps_json'] ?? '[]'), true);
        $row['steps'] = is_array($steps) ? $steps : [];
        $gallery = json_decode((string) ($row['gallery_json'] ?? '[]'), true);
        $row['gallery'] = is_array($gallery) && !empty($gallery) ? $gallery : [$row['image_path']];
        $content = json_decode((string) ($row['content_json'] ?? ''), true);
        $row['content'] = is_array($content) ? $content : null;
        return $row;
    }

    public function saveBlogPost(array $data): array
    {
        $id = (int) ($data['id'] ?? 0);
        $title = trim((string) ($data['title'] ?? ''));
        $category = trim((string) ($data['category'] ?? 'Bí quyết làm bánh'));
        $excerpt = trim((string) ($data['excerpt'] ?? ''));
        $author = trim((string) ($data['author'] ?? 'BakeMate Studio'));
        $readTime = trim((string) ($data['read_time'] ?? '5 phút đọc'));
        $diff = trim((string) ($data['difficulty'] ?? 'Dễ'));
        $image = trim((string) ($data['image_path'] ?? 'images/about-baking.jpg')) ?: 'images/about-baking.jpg';
        $recipeSlug = trim((string) ($data['recipe_slug'] ?? '')) ?: null;
        $steps = array_values(array_filter(array_map('trim', explode("\n", (string) ($data['steps_text'] ?? '')))));
        $stepsJson = json_encode($steps, JSON_UNESCAPED_UNICODE);

        if ($id > 0) {
            $this->db->prepare(
                'UPDATE blog_posts SET title = ?, category = ?, excerpt = ?, author = ?, read_time = ?, difficulty = ?, image_path = ?, recipe_slug = ?, steps_json = ? WHERE id = ?'
            )->execute([$title, $category, $excerpt, $author, $readTime, $diff, $image, $recipeSlug, $stepsJson, $id]);
        } else {
            $slug = 'post-' . preg_replace('/[^a-z0-9]+/', '-', ProductModel::normalizeSearch($title)) . '-' . time();
            $this->db->prepare(
                'INSERT INTO blog_posts (slug, recipe_slug, title, category, read_time, difficulty, author, published_at_label, image_path, keywords_text, excerpt, steps_json, is_published)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)'
            )->execute([trim($slug, '-'), $recipeSlug, $title, $category, $readTime, $diff, $author, date('d/m/Y'), $image, $category, $excerpt, $stepsJson]);
            $id = (int) $this->db->lastInsertId();
        }
        return ['ok' => true, 'id' => $id, 'message' => 'Đã lưu bài viết Blog thành công!'];
    }

    public function getWishlistIds(?int $userId): array
    {
        if ($userId !== null && $userId > 0) {
            $stmt = $this->db->prepare('SELECT product_id FROM wishlist_items WHERE user_id = ? ORDER BY id DESC');
            $stmt->execute([$userId]);
            return array_map('intval', array_column($stmt->fetchAll(), 'product_id'));
        }
        $sess = $_SESSION['bakemate_wishlist'] ?? [];
        return is_array($sess) ? array_values(array_map('intval', $sess)) : [];
    }

    public function mergeGuestWishlistToDb(int $userId): void
    {
        $guestIds = $_SESSION['bakemate_wishlist'] ?? [];
        if (!is_array($guestIds) || empty($guestIds)) {
            return;
        }
        $stmt = $this->db->prepare($this->insertIgnoreVerb() . ' wishlist_items (user_id, product_id) VALUES (?, ?)');
        foreach ($guestIds as $pid) {
            if ((int) $pid > 0) {
                $stmt->execute([$userId, (int) $pid]);
            }
        }
        unset($_SESSION['bakemate_wishlist']);
    }

    public function toggleWishlist(?int $userId, int $productId): array
    {
        $ids = $this->getWishlistIds($userId);
        $added = !in_array($productId, $ids, true);

        if ($userId !== null && $userId > 0) {
            if ($added) {
                $this->db->prepare($this->insertIgnoreVerb() . ' wishlist_items (user_id, product_id) VALUES (?, ?)')->execute([$userId, $productId]);
            } else {
                $this->db->prepare('DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?')->execute([$userId, $productId]);
            }
        } else {
            if ($added) {
                array_unshift($ids, $productId);
            } else {
                $ids = array_values(array_filter($ids, static fn(int $id): bool => $id !== $productId));
            }
            $_SESSION['bakemate_wishlist'] = $ids;
        }

        $nextIds = $this->getWishlistIds($userId);
        return [
            'ok' => true,
            'added' => $added,
            'count' => count($nextIds),
            'ids' => $nextIds,
            'message' => $added ? 'Đã thêm sản phẩm vào danh sách yêu thích.' : 'Đã bỏ sản phẩm khỏi danh sách yêu thích.',
        ];
    }

    public function getWishlistProducts(?int $userId): array
    {
        $ids = $this->getWishlistIds($userId);
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
        return $stmt->fetchAll();
    }

    public function saveContact(array $data, ?int $userId = null): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO contacts (user_id, full_name, email, phone, topic, message, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $userId,
            trim((string) ($data['full_name'] ?? '')),
            trim((string) ($data['email'] ?? '')),
            trim((string) ($data['phone'] ?? '')) ?: null,
            trim((string) ($data['topic'] ?? 'Tư vấn sản phẩm')),
            trim((string) ($data['message'] ?? '')),
            'new',
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function getAllContacts(): array
    {
        return $this->db->query('SELECT * FROM contacts ORDER BY id DESC')->fetchAll();
    }

    public function updateContact(int $id, string $status, string $reply = ''): bool
    {
        $allowed = ['new', 'in_progress', 'resolved'];
        $cleanStatus = in_array($status, $allowed, true) ? $status : 'in_progress';
        $stmt = $this->db->prepare('UPDATE contacts SET status = ?, staff_reply = ? WHERE id = ?');
        return $stmt->execute([$cleanStatus, trim($reply) ?: null, $id]);
    }

    public function getAllCoupons(): array
    {
        return $this->db->query('SELECT * FROM coupons ORDER BY id DESC')->fetchAll();
    }

    public function saveCoupon(array $data): array
    {
        $code = strtoupper(trim((string) ($data['code'] ?? '')));
        if ($code === '') {
            return ['ok' => false, 'message' => 'Mã voucher không được để trống.'];
        }
        $scope = ($data['discount_scope'] ?? '') === 'shipping' ? 'shipping' : 'product';
        $type = ($data['discount_type'] ?? '') === 'fixed' ? 'fixed' : 'percent';
        $val = max(1, (int) ($data['discount_value'] ?? 10));
        $minSub = max(0, (int) ($data['min_subtotal'] ?? 0));
        $limit = max(1, (int) ($data['usage_limit'] ?? 100));
        $desc = trim((string) ($data['description'] ?? 'Ưu đãi thành viên BakeMate'));

        $exists = $this->db->prepare('SELECT id FROM coupons WHERE code = ? LIMIT 1');
        $exists->execute([$code]);
        $eid = (int) $exists->fetchColumn();
        if ($eid > 0) {
            $this->db->prepare(
                'UPDATE coupons SET discount_scope = ?, discount_type = ?, discount_value = ?, min_subtotal = ?, usage_limit = ?, description = ?, is_active = 1 WHERE id = ?'
            )->execute([$scope, $type, $val, $minSub, $limit, $desc, $eid]);
        } else {
            $this->db->prepare(
                'INSERT INTO coupons (code, discount_scope, discount_type, discount_value, min_subtotal, usage_limit, is_active, description) VALUES (?, ?, ?, ?, ?, ?, 1, ?)'
            )->execute([$code, $scope, $type, $val, $minSub, $limit, $desc]);
        }
        return ['ok' => true, 'message' => "Đã lưu mã ưu đãi {$code} thành công!"];
    }

    public function toggleCoupon(int $id): bool
    {
        return $this->db->prepare('UPDATE coupons SET is_active = 1 - is_active WHERE id = ?')->execute([$id]);
    }

    public function getAllReviews(): array
    {
        return $this->db->query(
            'SELECT r.*, p.name AS product_name FROM product_reviews r INNER JOIN products p ON p.id = r.product_id ORDER BY r.id DESC'
        )->fetchAll();
    }

    public function setReviewStatus(int $id, string $status): bool
    {
        $clean = $status === 'hidden' ? 'hidden' : 'approved';
        return $this->db->prepare('UPDATE product_reviews SET status = ? WHERE id = ?')->execute([$clean, $id]);
    }

    public function getDashboardStats(): array
    {
        $row = $this->db->query(
            "SELECT
                (SELECT COUNT(*) FROM orders) AS total_orders,
                (SELECT COUNT(*) FROM orders WHERE status = 'pending') AS pending_orders,
                (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status <> 'cancelled') AS total_revenue,
                (SELECT COUNT(*) FROM products WHERE is_hidden = 0) AS active_products,
                (SELECT COUNT(*) FROM product_variants WHERE stock_qty <= 10) AS low_stock_variants,
                (SELECT COUNT(*) FROM recipes WHERE is_published = 1) AS total_recipes,
                (SELECT COUNT(*) FROM users) AS total_users,
                (SELECT COUNT(*) FROM contacts WHERE status = 'new') AS new_contacts"
        )->fetch();

        return $row ?: [];
    }
}
