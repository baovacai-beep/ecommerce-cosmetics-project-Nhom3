<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR . 'Model.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'entities' . DIRECTORY_SEPARATOR . 'CodPayment.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'entities' . DIRECTORY_SEPARATOR . 'VietQrPayment.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'entities' . DIRECTORY_SEPARATOR . 'EWalletPayment.php';

/**
 * OrderModel
 * Quản lý giỏ hàng (Session Guest + DB Customer + merge khi đăng nhập),
 * cộng dồn 2 voucher (product + shipping), đặt hàng ACID trừ tồn kho biến thể,
 * kiểm tra hàng tươi lạnh (is_perishable) phía Server và lịch sử / hủy đơn.
 */
class OrderModel extends Model
{
    public const MAX_QTY = 99;

    private function normalizeGroup(?string $group): string
    {
        return trim((string) $group);
    }

    public function getRawCart(?int $userId): array
    {
        if ($userId !== null && $userId > 0) {
            $stmt = $this->db->prepare(
                'SELECT product_id, option_index, quantity, COALESCE(recipe_group_id, "") AS recipe_group_id, is_selected
                 FROM cart_items WHERE user_id = ? ORDER BY id ASC'
            );
            $stmt->execute([$userId]);
            return $stmt->fetchAll();
        }
        $sess = $_SESSION['bakemate_cart'] ?? [];
        return is_array($sess) ? array_values($sess) : [];
    }

    private function saveGuestCart(array $items): void
    {
        $_SESSION['bakemate_cart'] = array_values($items);
    }

    public function mergeGuestCartToDb(int $userId): void
    {
        $guestItems = $_SESSION['bakemate_cart'] ?? [];
        if (!is_array($guestItems) || empty($guestItems)) {
            return;
        }
        foreach ($guestItems as $item) {
            $this->addItemToCart(
                $userId,
                (int) ($item['product_id'] ?? 0),
                (int) ($item['option_index'] ?? 0),
                (int) ($item['quantity'] ?? 1),
                (string) ($item['recipe_group_id'] ?? '')
            );
        }
        unset($_SESSION['bakemate_cart']);
    }

    public function addItemToCart(?int $userId, int $productId, int $optionIndex = 0, int $quantity = 1, ?string $recipeGroupId = null): array
    {
        $qty = max(1, min(self::MAX_QTY, $quantity));
        $group = $this->normalizeGroup($recipeGroupId);

        // Kiểm tra sản phẩm & biến thể hợp lệ trong DB
        $stmt = $this->db->prepare(
            "SELECT p.id, p.name, p.stock_status, v.stock_qty, v.price
             FROM products p
             INNER JOIN product_variants v ON v.product_id = p.id
             WHERE p.id = ? AND v.option_index = ? AND p.is_hidden = 0 LIMIT 1"
        );
        $stmt->execute([$productId, $optionIndex]);
        $row = $stmt->fetch();
        if (!$row) {
            return ['ok' => false, 'message' => 'Sản phẩm hoặc quy cách đóng gói không tồn tại.'];
        }
        if ($row['stock_status'] === 'coming_soon' || $row['stock_status'] === 'out_of_stock' || (int) $row['stock_qty'] <= 0) {
            return ['ok' => false, 'message' => 'Sản phẩm hiện đang hết hàng hoặc sắp mở bán.'];
        }
        $maxAllowed = min(self::MAX_QTY, (int) $row['stock_qty']);

        if ($userId !== null && $userId > 0) {
            $curStmt = $this->db->prepare(
                'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ? AND option_index = ? AND COALESCE(recipe_group_id, "") = ? LIMIT 1'
            );
            $curStmt->execute([$userId, $productId, $optionIndex, $group]);
            $existing = $curStmt->fetch();
            if ($existing) {
                $nextQty = min($maxAllowed, (int) $existing['quantity'] + $qty);
                $this->db->prepare('UPDATE cart_items SET quantity = ?, is_selected = 1 WHERE id = ?')->execute([$nextQty, (int) $existing['id']]);
            } else {
                $this->db->prepare(
                    'INSERT INTO cart_items (user_id, product_id, option_index, quantity, recipe_group_id, is_selected) VALUES (?, ?, ?, ?, ?, 1)'
                )->execute([$userId, $productId, $optionIndex, min($maxAllowed, $qty), $group]);
            }
        } else {
            $items = $this->getRawCart(null);
            $found = false;
            foreach ($items as &$it) {
                if ((int) $it['product_id'] === $productId && (int) $it['option_index'] === $optionIndex && $this->normalizeGroup($it['recipe_group_id'] ?? '') === $group) {
                    $it['quantity'] = min($maxAllowed, (int) $it['quantity'] + $qty);
                    $it['is_selected'] = 1;
                    $found = true;
                    break;
                }
            }
            unset($it);
            if (!$found) {
                $items[] = [
                    'product_id' => $productId,
                    'option_index' => $optionIndex,
                    'quantity' => min($maxAllowed, $qty),
                    'recipe_group_id' => $group,
                    'is_selected' => 1,
                ];
            }
            $this->saveGuestCart($items);
        }

        return ['ok' => true, 'message' => 'Đã thêm "' . $row['name'] . '" vào giỏ hàng!'];
    }

    public function updateQuantity(?int $userId, int $productId, int $optionIndex, ?string $recipeGroupId, int $newQty): array
    {
        $group = $this->normalizeGroup($recipeGroupId);
        if ($newQty <= 0) {
            return $this->removeItem($userId, $productId, $optionIndex, $group);
        }

        $vStmt = $this->db->prepare('SELECT stock_qty FROM product_variants WHERE product_id = ? AND option_index = ? LIMIT 1');
        $vStmt->execute([$productId, $optionIndex]);
        $stockQty = (int) ($vStmt->fetchColumn() ?: 0);
        if ($stockQty <= 0) {
            return ['ok' => false, 'message' => 'Sản phẩm đã hết tồn kho.'];
        }
        $clamped = max(1, min(self::MAX_QTY, $stockQty, $newQty));

        if ($userId !== null && $userId > 0) {
            $this->db->prepare(
                'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ? AND option_index = ? AND COALESCE(recipe_group_id, "") = ?'
            )->execute([$clamped, $userId, $productId, $optionIndex, $group]);
        } else {
            $items = $this->getRawCart(null);
            foreach ($items as &$it) {
                if ((int) $it['product_id'] === $productId && (int) $it['option_index'] === $optionIndex && $this->normalizeGroup($it['recipe_group_id'] ?? '') === $group) {
                    $it['quantity'] = $clamped;
                    break;
                }
            }
            unset($it);
            $this->saveGuestCart($items);
        }

        return ['ok' => true, 'quantity' => $clamped, 'message' => 'Đã cập nhật số lượng.'];
    }

    public function removeItem(?int $userId, int $productId, int $optionIndex, ?string $recipeGroupId): array
    {
        $group = $this->normalizeGroup($recipeGroupId);
        if ($userId !== null && $userId > 0) {
            $this->db->prepare(
                'DELETE FROM cart_items WHERE user_id = ? AND product_id = ? AND option_index = ? AND COALESCE(recipe_group_id, "") = ?'
            )->execute([$userId, $productId, $optionIndex, $group]);
        } else {
            $items = array_values(array_filter(
                $this->getRawCart(null),
                fn(array $it): bool => !((int) $it['product_id'] === $productId && (int) $it['option_index'] === $optionIndex && $this->normalizeGroup($it['recipe_group_id'] ?? '') === $group)
            ));
            $this->saveGuestCart($items);
        }
        return ['ok' => true, 'message' => 'Đã xóa sản phẩm khỏi giỏ hàng.'];
    }

    public function removeComboGroup(?int $userId, string $recipeGroupId): array
    {
        $group = $this->normalizeGroup($recipeGroupId);
        if ($group === '') {
            return ['ok' => false, 'message' => 'Nhóm công thức không hợp lệ.'];
        }
        if ($userId !== null && $userId > 0) {
            $this->db->prepare('DELETE FROM cart_items WHERE user_id = ? AND COALESCE(recipe_group_id, "") = ?')->execute([$userId, $group]);
        } else {
            $items = array_values(array_filter(
                $this->getRawCart(null),
                fn(array $it): bool => $this->normalizeGroup($it['recipe_group_id'] ?? '') !== $group
            ));
            $this->saveGuestCart($items);
        }
        return ['ok' => true, 'message' => 'Đã xóa toàn bộ combo công thức khỏi giỏ hàng.'];
    }

    public function setSelection(?int $userId, array $targets, bool $selected): array
    {
        $val = $selected ? 1 : 0;
        if ($userId !== null && $userId > 0) {
            if ($targets === ['ALL']) {
                $this->db->prepare('UPDATE cart_items SET is_selected = ? WHERE user_id = ?')->execute([$val, $userId]);
            } else {
                $stmt = $this->db->prepare(
                    'UPDATE cart_items SET is_selected = ? WHERE user_id = ? AND product_id = ? AND option_index = ? AND COALESCE(recipe_group_id, "") = ?'
                );
                foreach ($targets as $t) {
                    $stmt->execute([$val, $userId, (int) ($t['product_id'] ?? 0), (int) ($t['option_index'] ?? 0), $this->normalizeGroup($t['recipe_group_id'] ?? '')]);
                }
            }
        } else {
            $items = $this->getRawCart(null);
            foreach ($items as &$it) {
                if ($targets === ['ALL']) {
                    $it['is_selected'] = $val;
                    continue;
                }
                foreach ($targets as $t) {
                    if ((int) $it['product_id'] === (int) ($t['product_id'] ?? 0)
                        && (int) $it['option_index'] === (int) ($t['option_index'] ?? 0)
                        && $this->normalizeGroup($it['recipe_group_id'] ?? '') === $this->normalizeGroup($t['recipe_group_id'] ?? '')) {
                        $it['is_selected'] = $val;
                    }
                }
            }
            unset($it);
            $this->saveGuestCart($items);
        }
        return ['ok' => true, 'message' => 'Đã cập nhật lựa chọn sản phẩm.'];
    }

    public function getAppliedCoupons(): array
    {
        $saved = $_SESSION['bakemate_coupons'] ?? ['product' => null, 'shipping' => null];
        return [
            'product' => !empty($saved['product']) ? (string) $saved['product'] : null,
            'shipping' => !empty($saved['shipping']) ? (string) $saved['shipping'] : null,
        ];
    }

    public function applyCouponCode(string $rawCode, int $currentSubtotal): array
    {
        $code = strtoupper(trim($rawCode));
        if ($code === '') {
            return ['ok' => false, 'message' => 'Vui lòng nhập mã ưu đãi.'];
        }
        $stmt = $this->db->prepare(
            'SELECT * FROM coupons WHERE code = ? AND is_active = 1 AND used_count < usage_limit AND (expired_at IS NULL OR expired_at >= NOW()) LIMIT 1'
        );
        $stmt->execute([$code]);
        $coupon = $stmt->fetch();
        if (!$coupon) {
            return ['ok' => false, 'message' => "Mã giảm giá \"{$code}\" không tồn tại hoặc đã hết hạn."];
        }
        if ($currentSubtotal < (int) $coupon['min_subtotal']) {
            return ['ok' => false, 'message' => 'Đơn hàng chưa đạt mức tối thiểu ' . App::formatCurrency((int) $coupon['min_subtotal']) . ' để áp dụng mã ' . $code . '.'];
        }

        $cur = $this->getAppliedCoupons();
        $scope = $coupon['discount_scope'] === 'shipping' ? 'shipping' : 'product';
        $cur[$scope] = $code;
        $_SESSION['bakemate_coupons'] = $cur;
        return ['ok' => true, 'coupon' => $coupon, 'message' => "Đã áp dụng mã {$code}: {$coupon['description']}"];
    }

    public function removeCoupon(string $scope): void
    {
        $cur = $this->getAppliedCoupons();
        if (in_array($scope, ['product', 'shipping'], true)) {
            $cur[$scope] = null;
        } else {
            $cur = ['product' => null, 'shipping' => null];
        }
        $_SESSION['bakemate_coupons'] = $cur;
    }

    public function calculateCouponsDiscount(int $subtotal, int $shippingFee, array $couponCodes): array
    {
        $discountProduct = 0;
        $discountShipping = 0;
        $appliedDetails = [];

        foreach (['product', 'shipping'] as $scope) {
            $code = $couponCodes[$scope] ?? null;
            if (!$code) {
                continue;
            }
            $stmt = $this->db->prepare(
                'SELECT * FROM coupons WHERE code = ? AND is_active = 1 AND used_count < usage_limit AND (expired_at IS NULL OR expired_at >= NOW()) LIMIT 1'
            );
            $stmt->execute([$code]);
            $c = $stmt->fetch();
            if (!$c || $subtotal < (int) $c['min_subtotal']) {
                continue;
            }
            if ($c['discount_scope'] === 'shipping') {
                $val = $c['discount_type'] === 'percent'
                    ? (int) floor($shippingFee * ((int) $c['discount_value'] / 100))
                    : (int) $c['discount_value'];
                $discountShipping = min($shippingFee, max(0, $val));
            } else {
                $val = $c['discount_type'] === 'percent'
                    ? (int) floor($subtotal * ((int) $c['discount_value'] / 100))
                    : (int) $c['discount_value'];
                $discountProduct = min($subtotal, max(0, $val));
            }
            $appliedDetails[$scope] = $c;
        }

        return [
            'discount_product' => $discountProduct,
            'discount_shipping' => $discountShipping,
            'details' => $appliedDetails,
        ];
    }

    public function getCartSummary(?int $userId, bool $onlySelected = false, ?int $overrideShippingFee = null): array
    {
        $rawItems = $this->getRawCart($userId);
        $detailedItems = [];
        $totalCount = 0;
        $selectedCount = 0;
        $selectedSubtotal = 0;
        $allSubtotal = 0;
        $hasPerishable = false;

        // Lấy map tiêu đề công thức để hiển thị header khối Combo nét đứt
        $recipeTitles = [];
        $recRows = $this->db->query('SELECT slug, title, image_path FROM recipes')->fetchAll();
        foreach ($recRows as $r) {
            $recipeTitles[(string) $r['slug']] = $r;
        }

        foreach ($rawItems as $raw) {
            $pid = (int) ($raw['product_id'] ?? 0);
            $optIdx = (int) ($raw['option_index'] ?? 0);
            $qty = max(1, (int) ($raw['quantity'] ?? 1));
            $group = $this->normalizeGroup($raw['recipe_group_id'] ?? '');
            $isSelected = isset($raw['is_selected']) ? ((int) $raw['is_selected'] === 1) : true;

            if ($onlySelected && !$isSelected) {
                continue;
            }

            $stmt = $this->db->prepare(
                "SELECT p.id, p.name, p.is_perishable, p.stock_status, c.name AS category_name,
                        v.short_label, v.price, v.old_price, v.stock_qty,
                        (SELECT pi.image_path FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order ASC LIMIT 1) AS primary_image
                 FROM products p
                 INNER JOIN categories c ON c.id = p.category_id
                 INNER JOIN product_variants v ON v.product_id = p.id AND v.option_index = ?
                 WHERE p.id = ? AND p.is_hidden = 0 LIMIT 1"
            );
            $stmt->execute([$optIdx, $pid]);
            $row = $stmt->fetch();
            if (!$row) {
                continue;
            }

            $unitPrice = (int) $row['price'];
            $lineTotal = $unitPrice * $qty;
            $totalCount += $qty;
            $allSubtotal += $lineTotal;

            if ($isSelected) {
                $selectedCount += $qty;
                $selectedSubtotal += $lineTotal;
                if (!empty($row['is_perishable'])) {
                    $hasPerishable = true;
                }
            }

            $detailedItems[] = [
                'product_id' => $pid,
                'option_index' => $optIdx,
                'name' => (string) $row['name'],
                'category_name' => (string) $row['category_name'],
                'variant_label' => (string) $row['short_label'],
                'unit_price' => $unitPrice,
                'old_price' => (int) $row['old_price'],
                'quantity' => $qty,
                'stock_qty' => (int) $row['stock_qty'],
                'line_total' => $lineTotal,
                'is_perishable' => !empty($row['is_perishable']),
                'recipe_group_id' => $group,
                'recipe_meta' => $group !== '' ? ($recipeTitles[$group] ?? ['title' => 'Combo công thức ' . $group, 'image_path' => 'images/about-baking.jpg']) : null,
                'is_selected' => $isSelected,
                'image' => (string) ($row['primary_image'] ?: 'images/logo.jpg'),
            ];
        }

        // Nhóm các item theo retail vs từng recipe_group_id
        $retailItems = [];
        $comboGroups = [];
        foreach ($detailedItems as $it) {
            if ($it['recipe_group_id'] === '') {
                $retailItems[] = $it;
            } else {
                $gid = $it['recipe_group_id'];
                if (!isset($comboGroups[$gid])) {
                    $comboGroups[$gid] = [
                        'recipe_group_id' => $gid,
                        'title' => (string) ($it['recipe_meta']['title'] ?? $gid),
                        'image' => (string) ($it['recipe_meta']['image_path'] ?? 'images/about-baking.jpg'),
                        'items' => [],
                        'combo_total' => 0,
                    ];
                }
                $comboGroups[$gid]['items'][] = $it;
                $comboGroups[$gid]['combo_total'] += $it['line_total'];
            }
        }

        $shipEst = $selectedSubtotal > 0
            ? ($overrideShippingFee !== null ? $overrideShippingFee : ShippingService::DEFAULT_SHIPPING_FEE)
            : 0;
        $coupons = $this->getAppliedCoupons();
        $disc = $this->calculateCouponsDiscount($selectedSubtotal, $shipEst, $coupons);
        $total = max(0, $selectedSubtotal - $disc['discount_product'] + max(0, $shipEst - $disc['discount_shipping']));

        return [
            'items' => $detailedItems,
            'retail_items' => $retailItems,
            'combo_groups' => array_values($comboGroups),
            'total_count' => $totalCount,
            'selected_count' => $selectedCount,
            'all_selected' => count($detailedItems) > 0 && count($detailedItems) === count(array_filter($detailedItems, static fn(array $x): bool => $x['is_selected'])),
            'all_subtotal' => $allSubtotal,
            'selected_subtotal' => $selectedSubtotal,
            'has_perishable' => $hasPerishable,
            'shipping_fee' => $shipEst,
            'applied_coupons' => $coupons,
            'coupon_details' => $disc['details'],
            'discount_product' => $disc['discount_product'],
            'discount_shipping' => $disc['discount_shipping'],
            'total_amount' => $total,
        ];
    }

    public function placeOrder(array $input, ?int $userId): array
    {
        $summary = $this->getCartSummary($userId, true);
        if (empty($summary['items'])) {
            return ['ok' => false, 'code' => 400, 'message' => 'Vui lòng tick chọn ít nhất 1 sản phẩm trong giỏ hàng trước khi đặt hàng.'];
        }

        $customerName = trim((string) ($input['customer_name'] ?? ''));
        $customerPhone = preg_replace('/[\s.-]/', '', trim((string) ($input['customer_phone'] ?? ''))) ?? '';
        $customerEmail = trim((string) ($input['customer_email'] ?? ''));
        $province = trim((string) ($input['province'] ?? ''));
        $district = trim((string) ($input['district'] ?? ''));
        $ward = trim((string) ($input['ward'] ?? ''));
        $street = trim((string) ($input['street_address'] ?? ''));
        $shipMethodId = trim((string) ($input['shipping_method'] ?? 'fast'));
        $payMethod = trim((string) ($input['payment_method'] ?? 'cod'));
        $ewalletProvider = trim((string) ($input['ewallet_provider'] ?? 'MoMo'));
        $note = trim((string) ($input['note'] ?? ''));

        if (mb_strlen($customerName, 'UTF-8') < 2) {
            return ['ok' => false, 'code' => 422, 'message' => 'Họ tên người nhận phải có ít nhất 2 ký tự.'];
        }
        if (!preg_match('/^(0[35789])[0-9]{8}$/', $customerPhone)) {
            return ['ok' => false, 'code' => 422, 'message' => 'Số điện thoại Việt Nam phải gồm 10 chữ số (bắt đầu 03, 05, 07, 08, 09).'];
        }
        if ($province === '' || $district === '' || $ward === '' || mb_strlen($street, 'UTF-8') < 4) {
            return ['ok' => false, 'code' => 422, 'message' => 'Vui lòng chọn đầy đủ Tỉnh/Quận/Phường và nhập địa chỉ nhận hàng cụ thể.'];
        }

        $zoneType = ShippingService::resolveZone($province, $district);
        $shipCheck = ShippingService::calculateShippingFee($zoneType, $shipMethodId, $summary['has_perishable']);
        if (!$shipCheck['valid']) {
            return ['ok' => false, 'code' => 422, 'message' => $shipCheck['reason']];
        }

        $orderCode = 'BM-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));
        $shippingFee = (int) $shipCheck['fee'];

        $this->db->beginTransaction();
        try {
            $verifiedSubtotal = 0;
            $lockedItems = [];

            foreach ($summary['items'] as $it) {
                $pid = (int) $it['product_id'];
                $optIdx = (int) $it['option_index'];
                $qty = (int) $it['quantity'];

                $vStmt = $this->db->prepare(
                    'SELECT pv.id, pv.price, pv.stock_qty, pv.short_label, p.name, p.is_perishable
                     FROM product_variants pv
                     INNER JOIN products p ON p.id = pv.product_id
                     WHERE pv.product_id = ? AND pv.option_index = ? FOR UPDATE'
                );
                $vStmt->execute([$pid, $optIdx]);
                $vRow = $vStmt->fetch();
                if (!$vRow || (int) $vRow['stock_qty'] < $qty) {
                    throw new RuntimeException('Sản phẩm "' . ($it['name'] ?? '') . '" không đủ số lượng tồn kho.');
                }

                // Trừ tồn kho an toàn bằng câu SQL atomic
                $deduct = $this->db->prepare('UPDATE product_variants SET stock_qty = stock_qty - ? WHERE id = ? AND stock_qty >= ?');
                $deduct->execute([$qty, (int) $vRow['id'], $qty]);
                if ($deduct->rowCount() !== 1) {
                    throw new RuntimeException('Không thể trừ tồn kho cho "' . $vRow['name'] . '".');
                }

                $unitPrice = (int) $vRow['price'];
                $lineTotal = $unitPrice * $qty;
                $verifiedSubtotal += $lineTotal;
                $lockedItems[] = [
                    'product_id' => $pid,
                    'product_name' => (string) $vRow['name'],
                    'variant_label' => (string) $vRow['short_label'],
                    'option_index' => $optIdx,
                    'unit_price' => $unitPrice,
                    'quantity' => $qty,
                    'line_total' => $lineTotal,
                    'recipe_group_id' => $it['recipe_group_id'] !== '' ? $it['recipe_group_id'] : null,
                    'is_perishable' => !empty($vRow['is_perishable']) ? 1 : 0,
                ];
            }

            // Tính lại khuyến mãi hoàn toàn phía Server
            $coupons = $this->getAppliedCoupons();
            $disc = $this->calculateCouponsDiscount($verifiedSubtotal, $shippingFee, $coupons);
            $finalTotal = max(0, $verifiedSubtotal - $disc['discount_product'] + max(0, $shippingFee - $disc['discount_shipping']));

            // Đa hình PaymentMethodInterface
            $paymentStrategy = match ($payMethod) {
                'vietqr' => new VietQrPayment(),
                'ewallet' => new EWalletPayment($ewalletProvider),
                default => new CodPayment(),
            };
            $paymentResult = $paymentStrategy->pay($orderCode, $finalTotal);

            $ordStmt = $this->db->prepare(
                'INSERT INTO orders (order_code, user_id, customer_name, customer_phone, customer_email, province, district, ward, street_address,
                                     zone_type, shipping_method, shipping_method_label, shipping_fee, payment_method, ewallet_provider, payment_status,
                                     product_coupon_code, shipping_coupon_code, subtotal, discount_product, discount_shipping, total_amount, note, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $ordStmt->execute([
                $orderCode,
                $userId,
                $customerName,
                $customerPhone,
                $customerEmail !== '' ? $customerEmail : null,
                $province,
                $district,
                $ward,
                $street,
                $zoneType,
                $shipCheck['method_id'],
                $shipCheck['method_name'],
                $shippingFee,
                $paymentStrategy->getMethodCode(),
                $payMethod === 'ewallet' ? $ewalletProvider : null,
                $paymentResult['payment_status'],
                isset($disc['details']['product']) ? $disc['details']['product']['code'] : null,
                isset($disc['details']['shipping']) ? $disc['details']['shipping']['code'] : null,
                $verifiedSubtotal,
                $disc['discount_product'],
                $disc['discount_shipping'],
                $finalTotal,
                $note !== '' ? $note : null,
                'pending',
            ]);
            $orderId = (int) $this->db->lastInsertId();

            $itemStmt = $this->db->prepare(
                'INSERT INTO order_items (order_id, product_id, product_name, variant_label, option_index, unit_price, quantity, line_total, recipe_group_id, is_perishable)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            foreach ($lockedItems as $li) {
                $itemStmt->execute([
                    $orderId,
                    $li['product_id'],
                    $li['product_name'],
                    $li['variant_label'],
                    $li['option_index'],
                    $li['unit_price'],
                    $li['quantity'],
                    $li['line_total'],
                    $li['recipe_group_id'],
                    $li['is_perishable'],
                ]);
            }

            foreach (['product', 'shipping'] as $sc) {
                if (isset($disc['details'][$sc]['id'])) {
                    $this->db->prepare('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?')->execute([(int) $disc['details'][$sc]['id']]);
                }
            }

            // Xóa đúng các món đã tick đặt ra khỏi giỏ hàng
            if ($userId !== null && $userId > 0) {
                $this->db->prepare('DELETE FROM cart_items WHERE user_id = ? AND is_selected = 1')->execute([$userId]);
            } else {
                $remaining = array_values(array_filter(
                    $this->getRawCart(null),
                    static fn(array $it): bool => isset($it['is_selected']) && (int) $it['is_selected'] === 0
                ));
                $this->saveGuestCart($remaining);
            }

            $this->db->commit();
        } catch (Throwable $e) {
            $this->db->rollBack();
            return ['ok' => false, 'code' => 409, 'message' => $e->getMessage()];
        }

        // Lưu phiên đơn vừa đặt cho Guest xem lại hóa đơn & theo dõi đơn
        unset($_SESSION['bakemate_coupons']);
        $_SESSION['bakemate_last_order_code'] = $orderCode;
        $tracked = $_SESSION['bakemate_guest_orders'] ?? [];
        $tracked[] = $orderCode;
        $_SESSION['bakemate_guest_orders'] = array_values(array_unique($tracked));

        return [
            'ok' => true,
            'code' => 200,
            'order_code' => $orderCode,
            'payment' => $paymentResult,
            'message' => $paymentResult['message'],
        ];
    }

    public function getOrderByCode(string $orderCode): ?array
    {
        $clean = strtoupper(ltrim(trim($orderCode), '#'));
        if ($clean === '') {
            return null;
        }
        $stmt = $this->db->prepare('SELECT * FROM orders WHERE order_code = ? LIMIT 1');
        $stmt->execute([$clean]);
        $order = $stmt->fetch();
        if (!$order) {
            return null;
        }
        $itemsStmt = $this->db->prepare('SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC');
        $itemsStmt->execute([(int) $order['id']]);
        $order['items'] = $itemsStmt->fetchAll();

        $cancelStmt = $this->db->prepare('SELECT * FROM order_cancel_requests WHERE order_id = ? ORDER BY id DESC LIMIT 1');
        $cancelStmt->execute([(int) $order['id']]);
        $order['cancel_request'] = $cancelStmt->fetch() ?: null;

        return $order;
    }

    public function getOrdersForViewer(?int $userId, string $searchCode = '', string $statusFilter = 'all'): array
    {
        $params = [];
        if ($userId !== null && $userId > 0) {
            $sql = 'SELECT * FROM orders WHERE user_id = ?';
            $params[] = $userId;
        } else {
            $guestCodes = $_SESSION['bakemate_guest_orders'] ?? [];
            if ($searchCode !== '') {
                $clean = strtoupper(ltrim(trim($searchCode), '#'));
                $guestCodes[] = $clean;
            }
            $guestCodes = array_values(array_unique(array_filter($guestCodes)));
            if (empty($guestCodes)) {
                return [];
            }
            $ph = implode(',', array_fill(0, count($guestCodes), '?'));
            $sql = "SELECT * FROM orders WHERE order_code IN ({$ph})";
            $params = $guestCodes;
        }

        if ($statusFilter !== '' && $statusFilter !== 'all') {
            $sql .= ' AND status = ?';
            $params[] = $statusFilter;
        }
        if ($searchCode !== '') {
            $cleanLike = '%' . strtoupper(ltrim(trim($searchCode), '#')) . '%';
            $sql .= ' AND (order_code LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)';
            $params[] = $cleanLike;
            $params[] = '%' . trim($searchCode) . '%';
            $params[] = '%' . trim($searchCode) . '%';
        }
        $sql .= ' ORDER BY id DESC';

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $orders = $stmt->fetchAll();

        foreach ($orders as &$ord) {
            $iStmt = $this->db->prepare('SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC');
            $iStmt->execute([(int) $ord['id']]);
            $ord['items'] = $iStmt->fetchAll();
            $cStmt = $this->db->prepare('SELECT * FROM order_cancel_requests WHERE order_id = ? ORDER BY id DESC LIMIT 1');
            $cStmt->execute([(int) $ord['id']]);
            $ord['cancel_request'] = $cStmt->fetch() ?: null;
        }
        unset($ord);
        return $orders;
    }

    public function getAllOrders(string $statusFilter = 'all', string $search = ''): array
    {
        $sql = 'SELECT * FROM orders WHERE 1=1';
        $params = [];
        if ($statusFilter !== '' && $statusFilter !== 'all') {
            $sql .= ' AND status = ?';
            $params[] = $statusFilter;
        }
        if ($search !== '') {
            $kw = '%' . trim($search) . '%';
            $sql .= ' AND (order_code LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)';
            $params[] = $kw;
            $params[] = $kw;
            $params[] = $kw;
        }
        $sql .= ' ORDER BY id DESC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $orders = $stmt->fetchAll();
        foreach ($orders as &$ord) {
            $iStmt = $this->db->prepare('SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC');
            $iStmt->execute([(int) $ord['id']]);
            $ord['items'] = $iStmt->fetchAll();
            $cStmt = $this->db->prepare('SELECT * FROM order_cancel_requests WHERE order_id = ? ORDER BY id DESC LIMIT 1');
            $cStmt->execute([(int) $ord['id']]);
            $ord['cancel_request'] = $cStmt->fetch() ?: null;
        }
        unset($ord);
        return $orders;
    }

    public function updateOrderStatus(int $orderId, string $newStatus): array
    {
        $allowed = ['pending', 'preparing', 'shipping', 'completed', 'cancelled'];
        if (!in_array($newStatus, $allowed, true)) {
            return ['ok' => false, 'message' => 'Trạng thái đơn hàng không hợp lệ.'];
        }

        $this->db->beginTransaction();
        try {
            $stmt = $this->db->prepare('SELECT * FROM orders WHERE id = ? FOR UPDATE');
            $stmt->execute([$orderId]);
            $order = $stmt->fetch();
            if (!$order) {
                $this->db->rollBack();
                return ['ok' => false, 'message' => 'Không tìm thấy đơn hàng.'];
            }

            if ($newStatus === 'cancelled' && $order['status'] !== 'cancelled') {
                $itemsStmt = $this->db->prepare('SELECT product_id, option_index, quantity FROM order_items WHERE order_id = ?');
                $itemsStmt->execute([$orderId]);
                foreach ($itemsStmt->fetchAll() as $it) {
                    if ($it['product_id']) {
                        $this->db->prepare('UPDATE product_variants SET stock_qty = stock_qty + ? WHERE product_id = ? AND option_index = ?')
                            ->execute([(int) $it['quantity'], (int) $it['product_id'], (int) $it['option_index']]);
                    }
                }
            }

            $payStatus = $order['payment_status'];
            if ($newStatus === 'completed' && $payStatus !== 'paid') {
                $payStatus = 'paid';
            }

            $this->db->prepare('UPDATE orders SET status = ?, payment_status = ? WHERE id = ?')->execute([$newStatus, $payStatus, $orderId]);
            $this->db->commit();
        } catch (Throwable $e) {
            $this->db->rollBack();
            return ['ok' => false, 'message' => $e->getMessage()];
        }

        return ['ok' => true, 'status' => $newStatus, 'message' => 'Đã cập nhật trạng thái đơn hàng thành công.'];
    }

    public function markOrderPaid(int $orderId): array
    {
        $stmt = $this->db->prepare("UPDATE orders SET payment_status = 'paid' WHERE id = ?");
        $stmt->execute([$orderId]);
        return ['ok' => true, 'message' => 'Đã xác nhận thanh toán cho đơn hàng.'];
    }

    public function requestCancelOrder(int $orderId, ?int $userId, string $reason): array
    {
        $stmt = $this->db->prepare('SELECT * FROM orders WHERE id = ? LIMIT 1');
        $stmt->execute([$orderId]);
        $order = $stmt->fetch();
        if (!$order) {
            return ['ok' => false, 'message' => 'Không tìm thấy đơn hàng.'];
        }
        if ($userId !== null && (int) $order['user_id'] !== $userId) {
            return ['ok' => false, 'message' => 'Bạn không có quyền gửi yêu cầu hủy đơn hàng này.'];
        }
        if (!in_array((string) $order['status'], ['pending', 'preparing'], true)) {
            return ['ok' => false, 'message' => 'Đơn hàng đang giao hoặc đã hoàn tất nên không thể hủy trực tiếp.'];
        }
        $ins = $this->db->prepare('INSERT INTO order_cancel_requests (order_id, user_id, reason, status) VALUES (?, ?, ?, ?)');
        $ins->execute([$orderId, $userId, trim($reason) ?: 'Khách hàng thay đổi nhu cầu', 'pending']);
        return ['ok' => true, 'message' => 'Đã gửi yêu cầu hủy đơn tới nhân viên BakeMate.'];
    }

    public function handleCancelRequest(int $requestId, string $decision, string $adminNote = ''): array
    {
        $stmt = $this->db->prepare('SELECT * FROM order_cancel_requests WHERE id = ? LIMIT 1');
        $stmt->execute([$requestId]);
        $req = $stmt->fetch();
        if (!$req) {
            return ['ok' => false, 'message' => 'Không tìm thấy yêu cầu hủy đơn.'];
        }
        $status = $decision === 'approve' ? 'approved' : 'rejected';
        $this->db->prepare('UPDATE order_cancel_requests SET status = ?, admin_note = ? WHERE id = ?')->execute([$status, $adminNote, $requestId]);
        if ($status === 'approved') {
            $this->updateOrderStatus((int) $req['order_id'], 'cancelled');
        }
        return ['ok' => true, 'message' => $status === 'approved' ? 'Đã duyệt hủy đơn và hoàn tồn kho.' : 'Đã từ chối yêu cầu hủy đơn.'];
    }
}
