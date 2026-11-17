<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR . 'Controller.php';

class RecipeController extends Controller
{
    public function index(): void
    {
        $recipeModel = $this->model('RecipeModel');
        $filters = [
            'q' => trim((string) ($_GET['q'] ?? '')),
            'tag' => trim((string) ($_GET['tag'] ?? 'Tất cả')),
            'difficulty' => trim((string) ($_GET['difficulty'] ?? 'Tất cả')),
            'max_minutes' => (int) ($_GET['max_minutes'] ?? 0),
        ];
        $recipes = $recipeModel->getAllRecipes($filters, false);

        $this->view('pages/recipes', [
            'pageTitle' => 'Thư viện Công thức làm bánh | BakeMate',
            'activeNav' => 'recipes',
            'recipes' => $recipes,
            'filters' => $filters,
        ]);
    }

    public function detail(): void
    {
        $recipeModel = $this->model('RecipeModel');
        $user = Rbac::currentUser();
        $uid = $user ? (int) $user['id'] : null;

        $idOrSlug = trim((string) ($_GET['id'] ?? $_GET['slug'] ?? ''));
        $servings = isset($_GET['servings']) && is_numeric($_GET['servings']) ? (int) $_GET['servings'] : null;
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
        $servings = (int) ($_GET['servings'] ?? 0);
        if ($idOrSlug === '' || $servings < 1 || $servings > 50) {
            $this->jsonResponse('error', 422, [], 'Số phần bánh phải nằm trong khoảng 1–50.');
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
        foreach ($items as $it) {
            $pid = (int) ($it['product_id'] ?? 0);
            $opt = (int) ($it['option_index'] ?? 0);
            $qty = max(1, (int) ($it['quantity'] ?? 1));
            if ($pid <= 0) {
                continue;
            }
            $res = $orderModel->addItemToCart($uid, $pid, $opt, $qty, $recipeGroupId);
            if ($res['ok']) {
                $addedCount += $qty;
            } else {
                $skipped[] = $res['message'];
            }
        }

        $summary = $orderModel->getCartSummary($uid);
        if ($addedCount === 0) {
            $this->jsonResponse('error', 409, ['skipped' => $skipped], $skipped[0] ?? 'Không thể thêm các món đã chọn vào giỏ hàng.');
        }

        $this->jsonResponse('success', 200, [
            'added_count' => $addedCount,
            'cart_count' => $summary['total_count'],
            'skipped' => $skipped,
        ], "Đã thêm {$addedCount} sản phẩm từ combo công thức vào giỏ hàng!");
    }
}
