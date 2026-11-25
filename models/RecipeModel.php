<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR . 'Model.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'ProductModel.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'entities' . DIRECTORY_SEPARATOR . 'RecipeEntity.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'entities' . DIRECTORY_SEPARATOR . 'IngredientPackagingCalculator.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'entities' . DIRECTORY_SEPARATOR . 'ToolPackagingCalculator.php';

/**
 * RecipeModel
 * Truy vấn thư viện công thức, quy đổi định lượng theo khẩu phần,
 * ghép quy cách đóng gói (PackagingCalculatorInterface) và lưu Pantry Memory.
 */
class RecipeModel extends Model
{
    public function getAllRecipes(array $filters = [], bool $includeUnpublished = false): array
    {
        $sql = 'SELECT * FROM recipes WHERE 1=1';
        if (!$includeUnpublished) {
            $sql .= ' AND is_published = 1';
        }
        $sql .= ' ORDER BY id ASC';
        $rows = $this->db->query($sql)->fetchAll();

        $qNorm = ProductModel::normalizeSearch((string) ($filters['q'] ?? ''));
        $tagFilter = trim((string) ($filters['tag'] ?? ''));
        $diffFilter = trim((string) ($filters['difficulty'] ?? ''));
        $timeFilter = (int) ($filters['max_minutes'] ?? 0);

        $result = [];
        foreach ($rows as $row) {
            $tags = json_decode((string) ($row['tags_json'] ?? '[]'), true);
            $row['tags'] = is_array($tags) ? $tags : [];

            if ($tagFilter !== '' && $tagFilter !== 'Tất cả') {
                if ($row['category'] !== $tagFilter && !in_array($tagFilter, $row['tags'], true)) {
                    continue;
                }
            }
            if ($diffFilter !== '' && $diffFilter !== 'Tất cả' && $row['difficulty'] !== $diffFilter) {
                continue;
            }
            if ($timeFilter > 0) {
                $totalMins = $this->extractTotalMinutes((string) $row['time_label'], (int) $row['bake_minutes']);
                if ($timeFilter === 30 && $totalMins > 35) continue;
                if ($timeFilter === 60 && ($totalMins < 36 || $totalMins > 65)) continue;
                if ($timeFilter === 61 && $totalMins <= 65) continue;
            }
            if ($qNorm !== '') {
                $hay = ProductModel::normalizeSearch($row['title'] . ' ' . $row['subtitle'] . ' ' . $row['category'] . ' ' . implode(' ', $row['tags']));
                if (!str_contains($hay, $qNorm)) {
                    continue;
                }
            }
            $result[] = $row;
        }
        return $result;
    }

    private function extractTotalMinutes(string $timeLabel, int $bakeMinutes): int
    {
        if (preg_match('/(\d+)/', $timeLabel, $m)) {
            return (int) $m[1];
        }
        return $bakeMinutes;
    }

    public function getRecipeDetail(string|int $idOrSlug, ?int $targetServings = null, ?int $userId = null): ?array
    {
        $val = trim((string) $idOrSlug);
        $stmt = ctype_digit($val)
            ? $this->db->prepare('SELECT * FROM recipes WHERE id = ? LIMIT 1')
            : $this->db->prepare('SELECT * FROM recipes WHERE slug = ? LIMIT 1');
        $stmt->execute([ctype_digit($val) ? (int) $val : $val]);
        $recipe = $stmt->fetch();
        if (!$recipe) {
            return null;
        }

        $rid = (int) $recipe['id'];
        $recipeEntity = new RecipeEntity($rid, (string) $recipe['title'], max(1, (int) $recipe['default_servings']));
        $servings = ($targetServings !== null && $targetServings >= 1)
            ? min(50, $targetServings)
            : $recipeEntity->getDefaultServings();

        $stepsStmt = $this->db->prepare('SELECT instruction FROM recipe_steps WHERE recipe_id = ? ORDER BY step_order ASC');
        $stepsStmt->execute([$rid]);
        $steps = array_column($stepsStmt->fetchAll(), 'instruction');

        $tipsStmt = $this->db->prepare('SELECT tip_text FROM recipe_tips WHERE recipe_id = ? ORDER BY tip_order ASC');
        $tipsStmt->execute([$rid]);
        $tips = array_column($tipsStmt->fetchAll(), 'tip_text');

        $ingStmt = $this->db->prepare('SELECT * FROM recipe_ingredients WHERE recipe_id = ? ORDER BY sort_order ASC');
        $ingStmt->execute([$rid]);
        $rawIngredients = $ingStmt->fetchAll();

        $toolStmt = $this->db->prepare('SELECT * FROM recipe_tools WHERE recipe_id = ? ORDER BY sort_order ASC');
        $toolStmt->execute([$rid]);
        $rawTools = $toolStmt->fetchAll();

        $pantryKeys = $this->getUserPantryKeys($userId, $rid);
        $ingCalc = new IngredientPackagingCalculator();
        $toolCalc = new ToolPackagingCalculator();

        $ingredients = [];
        $estimatedIngredientsCost = 0;

        foreach ($rawIngredients as $ing) {
            $scaledAmount = $recipeEntity->scaleAmount((float) $ing['base_amount'], $servings);
            $prodId = !empty($ing['product_id']) ? (int) $ing['product_id'] : null;
            $optIndex = (int) ($ing['variant_option_index'] ?? 0);
            $key = 'ing_' . ($prodId ?: ('free_' . $ing['id']));
            $inPantry = in_array($key, $pantryKeys, true);

            $variant = null;
            $packsNeeded = 0;
            $surplus = 0.0;
            $productInfo = null;
            $availabilityNote = '';

            if ($prodId !== null) {
                $pStmt = $this->db->prepare(
                    "SELECT p.id, p.name, p.stock_status, p.is_perishable,
                            (SELECT pi.image_path FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order ASC LIMIT 1) AS primary_image
                     FROM products p WHERE p.id = ? AND p.is_hidden = 0 LIMIT 1"
                );
                $pStmt->execute([$prodId]);
                $productInfo = $pStmt->fetch() ?: null;

                if ($productInfo === null) {
                    $availabilityNote = 'Sản phẩm liên kết không còn khả dụng.';
                } elseif ($productInfo['stock_status'] !== 'in_stock') {
                    $availabilityNote = $productInfo['stock_status'] === 'coming_soon'
                        ? 'Sản phẩm đang được chuẩn bị mở bán.'
                        : 'Sản phẩm hiện đã hết hàng.';
                } else {
                    $vStmt = $this->db->prepare('SELECT * FROM product_variants WHERE product_id = ? ORDER BY option_index ASC');
                    $vStmt->execute([$prodId]);
                    $variants = $vStmt->fetchAll();

                    $chosen = null;
                    foreach ($variants as $candidate) {
                        if ((int) $candidate['option_index'] === $optIndex) {
                            $chosen = $candidate;
                            break;
                        }
                    }

                    // Tôn trọng quy cách được cấu hình cho nguyên liệu; chỉ tính khi biến thể đủ tồn kho.
                    if ($chosen !== null && (float) ($ing['package_amount'] ?? 0) > 0) {
                        $chosen['unit_amount'] = (float) $ing['package_amount'];
                        $calc = $ingCalc->calculateRequiredPacks($scaledAmount, [$chosen]);
                    } else {
                        $calc = $ingCalc->calculateRequiredPacks($scaledAmount, $variants);
                    }

                    $packsNeeded = (int) $calc['packs'];
                    $variant = $calc['variant'];
                    $surplus = (float) $calc['surplus'];

                    if ($variant === null) {
                        $availabilityNote = 'Không có quy cách đóng gói còn đủ tồn kho cho định lượng này.';
                    }
                }
            } else {
                $availabilityNote = trim((string) ($ing['note'] ?? ''));
                if ($availabilityNote === '') {
                    $availabilityNote = 'Nguyên liệu chưa được liên kết với sản phẩm trong cửa hàng.';
                }
            }

            $purchaseAvailable = $productInfo !== null
                && $productInfo['stock_status'] === 'in_stock'
                && $variant !== null
                && $packsNeeded > 0;

            if ($purchaseAvailable && !$inPantry) {
                $estimatedIngredientsCost += ((int) $variant['price']) * $packsNeeded;
            }

            $ingredients[] = [
                'id' => (int) $ing['id'],
                'key' => $key,
                'name' => (string) $ing['name'],
                'base_amount' => (float) $ing['base_amount'],
                'scaled_amount' => $scaledAmount,
                'unit' => (string) $ing['unit'],
                'product_id' => $prodId,
                'product' => $productInfo,
                'variant' => $variant,
                'option_index' => $variant ? (int) $variant['option_index'] : $optIndex,
                'packs_needed' => $packsNeeded,
                'surplus' => $surplus,
                'note' => (string) ($ing['note'] ?? ''),
                'availability_note' => $availabilityNote,
                'purchase_available' => $purchaseAvailable,
                'stock_qty' => $variant ? (int) ($variant['stock_qty'] ?? 0) : 0,
                'in_pantry' => $inPantry,
            ];
        }

        $tools = [];
        $estimatedToolsCost = 0;
        foreach ($rawTools as $tool) {
            $prodId = (int) $tool['product_id'];
            $preferredOptionIndex = (int) ($tool['variant_option_index'] ?? 0);
            $pStmt = $this->db->prepare(
                "SELECT p.id, p.name, p.stock_status,
                        (SELECT pi.image_path FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order ASC LIMIT 1) AS primary_image
                 FROM products p WHERE p.id = ? AND p.is_hidden = 0 LIMIT 1"
            );
            $pStmt->execute([$prodId]);
            $productInfo = $pStmt->fetch() ?: null;

            $variant = null;
            $availabilityNote = '';
            if ($productInfo === null) {
                $availabilityNote = 'Dụng cụ liên kết không còn khả dụng.';
            } elseif ($productInfo['stock_status'] !== 'in_stock') {
                $availabilityNote = $productInfo['stock_status'] === 'coming_soon'
                    ? 'Dụng cụ đang được chuẩn bị mở bán.'
                    : 'Dụng cụ hiện đã hết hàng.';
            } else {
                $vStmt = $this->db->prepare('SELECT * FROM product_variants WHERE product_id = ? ORDER BY option_index ASC');
                $vStmt->execute([$prodId]);
                $variants = $vStmt->fetchAll();

                // Ưu tiên đúng biến thể được cấu hình; nếu biến thể đó hết hàng,
                // calculator chỉ có thể chọn một biến thể khác còn tồn kho của cùng sản phẩm.
                usort($variants, static function (array $a, array $b) use ($preferredOptionIndex): int {
                    $priorityA = (int) $a['option_index'] === $preferredOptionIndex ? 0 : (!empty($a['is_default']) ? 1 : 2);
                    $priorityB = (int) $b['option_index'] === $preferredOptionIndex ? 0 : (!empty($b['is_default']) ? 1 : 2);
                    return $priorityA <=> $priorityB;
                });

                $calc = $toolCalc->calculateRequiredPacks(1, $variants);
                $variant = $calc['variant'];
                if ($variant === null) {
                    $availabilityNote = 'Không có quy cách dụng cụ nào còn hàng.';
                }
            }

            $purchaseAvailable = $productInfo !== null
                && $productInfo['stock_status'] === 'in_stock'
                && $variant !== null;
            if ($purchaseAvailable) {
                $estimatedToolsCost += (int) $variant['price'];
            }

            $tools[] = [
                'id' => (int) $tool['id'],
                'name' => (string) $tool['name'],
                'product_id' => $prodId,
                'product' => $productInfo,
                'variant' => $variant,
                'option_index' => $variant ? (int) $variant['option_index'] : $preferredOptionIndex,
                'description' => (string) ($tool['description'] ?? ''),
                'availability_note' => $availabilityNote,
                'purchase_available' => $purchaseAvailable,
                'stock_qty' => $variant ? (int) ($variant['stock_qty'] ?? 0) : 0,
            ];
        }

        $tags = json_decode((string) ($recipe['tags_json'] ?? '[]'), true);
        $recipe['tags'] = is_array($tags) ? $tags : [];
        $recipe['current_servings'] = $servings;
        $recipe['steps'] = $steps;
        $recipe['tips'] = $tips;
        $recipe['ingredients'] = $ingredients;
        $recipe['tools'] = $tools;
        $recipe['estimated_ingredients_cost'] = $estimatedIngredientsCost;
        $recipe['estimated_tools_cost'] = $estimatedToolsCost;

        return $recipe;
    }

    public function getUserPantryKeys(?int $userId, int $recipeId): array
    {
        if ($userId !== null && $userId > 0) {
            $stmt = $this->db->prepare('SELECT ingredient_key FROM user_pantry WHERE user_id = ? AND recipe_id = ?');
            $stmt->execute([$userId, $recipeId]);
            return array_column($stmt->fetchAll(), 'ingredient_key');
        }
        $sess = $_SESSION['bakemate_pantry'] ?? [];
        return is_array($sess[$recipeId] ?? null) ? $sess[$recipeId] : [];
    }

    public function setPantryItem(?int $userId, int $recipeId, string $ingredientKey, bool $owned): void
    {
        $cleanKey = substr(trim($ingredientKey), 0, 120);
        if ($userId !== null && $userId > 0) {
            if ($owned) {
                $stmt = $this->db->prepare($this->insertIgnoreVerb() . ' user_pantry (user_id, recipe_id, ingredient_key) VALUES (?, ?, ?)');
                $stmt->execute([$userId, $recipeId, $cleanKey]);
            } else {
                $stmt = $this->db->prepare('DELETE FROM user_pantry WHERE user_id = ? AND recipe_id = ? AND ingredient_key = ?');
                $stmt->execute([$userId, $recipeId, $cleanKey]);
            }
            return;
        }
        $sess = $_SESSION['bakemate_pantry'] ?? [];
        $cur = is_array($sess[$recipeId] ?? null) ? $sess[$recipeId] : [];
        if ($owned) {
            if (!in_array($cleanKey, $cur, true)) {
                $cur[] = $cleanKey;
            }
        } else {
            $cur = array_values(array_filter($cur, static fn(string $k): bool => $k !== $cleanKey));
        }
        $sess[$recipeId] = $cur;
        $_SESSION['bakemate_pantry'] = $sess;
    }

    public function saveAdminRecipe(array $data): array
    {
        $id = (int) ($data['id'] ?? 0);
        $title = trim((string) ($data['title'] ?? ''));
        $servings = (int) ($data['default_servings'] ?? 4);
        new RecipeEntity($id, $title, $servings);

        $subtitle = trim((string) ($data['subtitle'] ?? ''));
        $category = trim((string) ($data['category'] ?? 'Bánh ngọt')) ?: 'Bánh ngọt';
        $difficulty = trim((string) ($data['difficulty'] ?? 'Dễ')) ?: 'Dễ';
        $bakeMinutes = max(5, (int) ($data['bake_minutes'] ?? 30));
        $timeLabel = trim((string) ($data['time_label'] ?? ($bakeMinutes . ' phút')));
        $servingsUnit = trim((string) ($data['servings_unit'] ?? 'khẩu phần'));
        $author = trim((string) ($data['author'] ?? 'BakeMate Studio'));
        $imagePath = trim((string) ($data['image_path'] ?? 'images/about-baking.jpg')) ?: 'images/about-baking.jpg';
        $isPublished = !empty($data['is_published']) ? 1 : 0;
        $tagsJson = json_encode([$category], JSON_UNESCAPED_UNICODE);

        $steps = array_values(array_filter(array_map('trim', explode("\n", (string) ($data['steps_text'] ?? '')))));

        $this->db->beginTransaction();
        try {
            if ($id > 0) {
                $this->db->prepare(
                    'UPDATE recipes SET title = ?, subtitle = ?, category = ?, tags_json = ?, bake_minutes = ?, time_label = ?,
                     difficulty = ?, default_servings = ?, servings_unit = ?, image_path = ?, author = ?, is_published = ? WHERE id = ?'
                )->execute([$title, $subtitle, $category, $tagsJson, $bakeMinutes, $timeLabel, $difficulty, $servings, $servingsUnit, $imagePath, $author, $isPublished, $id]);

                if (!empty($steps)) {
                    $this->db->prepare('DELETE FROM recipe_steps WHERE recipe_id = ?')->execute([$id]);
                    $sStmt = $this->db->prepare('INSERT INTO recipe_steps (recipe_id, step_order, instruction) VALUES (?, ?, ?)');
                    foreach ($steps as $idx => $st) {
                        $sStmt->execute([$id, $idx + 1, $st]);
                    }
                }
            } else {
                $slug = 'recipe-' . preg_replace('/[^a-z0-9]+/', '-', ProductModel::normalizeSearch($title)) . '-' . time();
                $code = 'RECIPE NO. ' . str_pad((string) random_int(10, 99), 2, '0', STR_PAD_LEFT);
                $this->db->prepare(
                    'INSERT INTO recipes (slug, code, title, subtitle, category, tags_json, bake_minutes, time_label, difficulty, default_servings, servings_unit, image_path, author, is_published)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                )->execute([trim($slug, '-'), $code, $title, $subtitle, $category, $tagsJson, $bakeMinutes, $timeLabel, $difficulty, $servings, $servingsUnit, $imagePath, $author, $isPublished]);
                $id = (int) $this->db->lastInsertId();

                $sStmt = $this->db->prepare('INSERT INTO recipe_steps (recipe_id, step_order, instruction) VALUES (?, ?, ?)');
                foreach ($steps as $idx => $st) {
                    $sStmt->execute([$id, $idx + 1, $st]);
                }
            }
            $this->db->commit();
        } catch (Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }
        return ['ok' => true, 'id' => $id, 'message' => 'Đã lưu công thức thành công!'];
    }

    public function deleteRecipe(int $id): bool
    {
        $stmt = $this->db->prepare('DELETE FROM recipes WHERE id = ?');
        return $stmt->execute([$id]);
    }
}
