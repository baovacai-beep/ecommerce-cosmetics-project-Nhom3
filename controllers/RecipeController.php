<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR . 'Controller.php';

class RecipeController extends Controller
{
    private const RECIPE_TAGS = [
        'Tất cả',
        'Bánh ngọt',
        'Bánh kem',
        'Bánh quy',
        'Bánh mì',
        'Tráng miệng',
        'Bánh không cần lò nướng',
    ];

    private const RECIPE_DIFFICULTIES = ['Tất cả', 'Dễ', 'Trung bình'];
    private const RECIPE_TIME_FILTERS = [0, 30, 60, 61];

    public function index(): void
    {
        $recipeModel = $this->model('RecipeModel');
        $rawQuery = $_GET['q'] ?? '';
        $rawTag = $_GET['tag'] ?? 'Tất cả';
        $rawDifficulty = $_GET['difficulty'] ?? 'Tất cả';
        $rawMaxMinutes = $_GET['max_minutes'] ?? 0;

        $query = is_string($rawQuery) ? trim($rawQuery) : '';
        $tag = is_string($rawTag) ? trim($rawTag) : 'Tất cả';
        $difficulty = is_string($rawDifficulty) ? trim($rawDifficulty) : 'Tất cả';
        if (!in_array($tag, self::RECIPE_TAGS, true)) {
            $tag = 'Tất cả';
        }
        if (!in_array($difficulty, self::RECIPE_DIFFICULTIES, true)) {
            $difficulty = 'Tất cả';
        }

        $maxMinutes = is_scalar($rawMaxMinutes)
            ? filter_var((string) $rawMaxMinutes, FILTER_VALIDATE_INT)
            : false;
        if ($maxMinutes === false || !in_array($maxMinutes, self::RECIPE_TIME_FILTERS, true)) {
            $maxMinutes = 0;
        }

        $filters = [
            'q' => $query,
            'tag' => $tag,
            'difficulty' => $difficulty,
            'max_minutes' => $maxMinutes,
        ];
        $recipes = $recipeModel->getAllRecipes($filters, false);

        $this->view('pages/recipes', [
            'pageTitle' => 'Thư viện Công thức làm bánh | BakeMate',
            'activeNav' => 'recipes',
            'recipes' => $recipes,
            'filters' => $filters,
            'tagsList' => self::RECIPE_TAGS,
        ]);
    }

    public function detail(): void
    {
        $recipeModel = $this->model('RecipeModel');
        $user = Rbac::currentUser();
        $uid = $user ? (int) $user['id'] : null;

        $idOrSlug = trim((string) ($_GET['id'] ?? $_GET['slug'] ?? ''));
        $rawServings = $_GET['servings'] ?? null;
        $servings = (is_string($rawServings) && preg_match('/^\d+$/D', trim($rawServings)))
            ? (int) trim($rawServings)
            : null;
        $recipe = $idOrSlug !== '' ? $recipeModel->getRecipeDetail($idOrSlug, $servings, $uid) : null;

        $this->view('pages/recipe-detail', [
            'pageTitle' => ($recipe ? $recipe['title'] : 'Công thức không tồn tại') . ' | BakeMate',
            'activeNav' => 'recipes',
            'recipe' => $recipe,
        ]);
    }

    public function ajaxScale(): void
    {
        $idOrSlug = trim((string) ($_GET['id'] ?? ''));
        $rawServings = $_GET['servings'] ?? null;
        $validServings = is_string($rawServings) && preg_match('/^\d+$/D', trim($rawServings));
        $servings = $validServings ? (int) trim($rawServings) : 0;
        if ($idOrSlug === '' || !$validServings || $servings < 1 || $servings > 50) {
            $this->jsonResponse('error', 422, [], 'Số phần bánh phải là số nguyên trong khoảng 1–50.');
        }

        $recipeModel = $this->model('RecipeModel');
        $user = Rbac::currentUser();
        $recipe = $recipeModel->getRecipeDetail($idOrSlug, $servings, $user ? (int) $user['id'] : null);
        if (!$recipe) {
            $this->jsonResponse('error', 404, [], 'Không tìm thấy công thức.');
        }

        $this->jsonResponse('success', 200, [
            'servings' => $recipe['current_servings'],
            'ingredients' => $recipe['ingredients'],
            'tools' => $recipe['tools'],
            'estimated_ingredients_cost' => $recipe['estimated_ingredients_cost'],
            'estimated_tools_cost' => $recipe['estimated_tools_cost'],
        ], 'Đã quy đổi định lượng theo ' . $servings . ' phần.');
    }

    public function ajaxTogglePantry(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $recipeId = (int) ($in['recipe_id'] ?? 0);
        $key = trim((string) ($in['ingredient_key'] ?? ''));
        $owned = !empty($in['owned']);

        if ($recipeId <= 0 || $key === '') {
            $this->jsonResponse('error', 400, [], 'Thông tin nguyên liệu không hợp lệ.');
        }

        $recipeModel = $this->model('RecipeModel');
        $user = Rbac::currentUser();
        $recipeModel->setPantryItem($user ? (int) $user['id'] : null, $recipeId, $key, $owned);
        $this->jsonResponse('success', 200, ['owned' => $owned], $owned ? 'Đã đánh dấu nguyên liệu sẵn có tại bếp.' : 'Đã bỏ đánh dấu sẵn có.');
    }

    public function ajaxAddComboToCart(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $recipeGroupId = trim((string) ($in['recipe_group_id'] ?? ''));
        $items = $in['items'] ?? [];
        if ($recipeGroupId === '' || !is_array($items) || empty($items)) {
            $this->jsonResponse('error', 400, [], 'Vui lòng chọn ít nhất 1 nguyên liệu hoặc dụng cụ để thêm vào giỏ.');
        }

        $orderModel = $this->model('OrderModel');
        $user = Rbac::currentUser();
        $uid = $user ? (int) $user['id'] : null;
        $addedCount = 0;
        $skipped = [];

        $getGroupQuantity = static function (array $cartItems, int $productId, int $optionIndex, string $groupId): int {
            $quantity = 0;
            foreach ($cartItems as $cartItem) {
                if ((int) ($cartItem['product_id'] ?? 0) === $productId
                    && (int) ($cartItem['option_index'] ?? 0) === $optionIndex
                    && trim((string) ($cartItem['recipe_group_id'] ?? '')) === $groupId) {
                    $quantity += (int) ($cartItem['quantity'] ?? 0);
                }
            }
            return $quantity;
        };

        foreach ($items as $item) {
            if (!is_array($item)) {
                $skipped[] = 'Một mặt hàng có dữ liệu không hợp lệ.';
                continue;
            }

            $productId = filter_var($item['product_id'] ?? null, FILTER_VALIDATE_INT);
            $optionIndex = filter_var($item['option_index'] ?? 0, FILTER_VALIDATE_INT);
            $quantity = filter_var($item['quantity'] ?? 1, FILTER_VALIDATE_INT);
            if ($productId === false || $productId <= 0 || $optionIndex === false || $optionIndex < 0 || $quantity === false || $quantity < 1) {
                $skipped[] = 'Một mặt hàng có mã sản phẩm, quy cách hoặc số lượng không hợp lệ.';
                continue;
            }

            $beforeQuantity = $getGroupQuantity($orderModel->getRawCart($uid), $productId, $optionIndex, $recipeGroupId);
            $result = $orderModel->addItemToCart($uid, $productId, $optionIndex, $quantity, $recipeGroupId);
            $afterQuantity = $getGroupQuantity($orderModel->getRawCart($uid), $productId, $optionIndex, $recipeGroupId);
            $actuallyAdded = max(0, $afterQuantity - $beforeQuantity);

            if (!empty($result['ok']) && $actuallyAdded > 0) {
                $addedCount += $actuallyAdded;
                if ($actuallyAdded < $quantity) {
                    $skipped[] = "Chỉ thêm được {$actuallyAdded}/{$quantity} gói của sản phẩm #{$productId} do tồn kho không đủ.";
                }
            } elseif (!empty($result['ok'])) {
                $skipped[] = "Sản phẩm #{$productId} đã đạt giới hạn tồn kho trong combo này.";
            } else {
                $skipped[] = (string) ($result['message'] ?? "Sản phẩm #{$productId} không thể thêm vào giỏ hàng do không còn đủ tồn kho.");
            }
        }

        $summary = $orderModel->getCartSummary($uid);
        if ($addedCount === 0) {
            $this->jsonResponse('error', 409, ['skipped' => $skipped], $skipped[0] ?? 'Không thể thêm các món đã chọn vào giỏ hàng.');
        }

        $message = "Đã thêm {$addedCount} sản phẩm từ combo công thức vào giỏ hàng!";
        if (!empty($skipped)) {
            $message .= ' Một số mặt hàng không thể thêm đủ số lượng hoặc không còn khả dụng.';
        }
        $this->jsonResponse('success', 200, [
            'added_count' => $addedCount,
            'cart_count' => $summary['total_count'],
            'skipped' => $skipped,
        ], $message);
    }
}
