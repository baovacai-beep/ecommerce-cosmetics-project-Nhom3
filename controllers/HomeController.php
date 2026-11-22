<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR . 'Controller.php';

class HomeController extends Controller
{
    public function index(): void
    {
        $productModel = $this->model('ProductModel');
        $recipeModel = $this->model('RecipeModel');
        $contentModel = $this->model('ContentModel');
        $user = Rbac::currentUser();

        $featured = $productModel->getFeaturedProducts(4);
        $rawRecipes = $recipeModel->getAllRecipes();
        $flipbookRecipes = [];
        foreach ($rawRecipes as $rec) {
            $detail = $recipeModel->getRecipeDetail((int) $rec['id']);
            if ($detail) {
                $flipbookRecipes[] = $detail;
            }
        }
        $posts = array_slice($contentModel->getBlogPosts(), 0, 3);
        $wishlistIds = $contentModel->getWishlistIds($user ? (int) $user['id'] : null);

        $this->view('pages/home', [
            'pageTitle' => 'BakeMate - Làm bánh chuẩn vị, nguyên liệu chuẩn tay',
            'activeNav' => 'home',
            'featuredProducts' => $featured,
            'flipbookRecipes' => $flipbookRecipes,
            'latestPosts' => $posts,
            'wishlistIds' => $wishlistIds,
        ]);
    }

    public function about(): void
    {
        $this->view('pages/about', [
            'pageTitle' => 'Về chúng tôi | BakeMate',
            'activeNav' => 'about',
        ]);
    }

    public function contact(): void
    {
        $this->view('pages/contact', [
            'pageTitle' => 'Liên hệ & Hỗ trợ | BakeMate',
            'activeNav' => 'contact',
        ]);
    }

    public function blog(): void
    {
        $contentModel = $this->model('ContentModel');
        $category = trim((string) ($_GET['category'] ?? 'all'));
        $q = trim((string) ($_GET['q'] ?? ''));
        $posts = $contentModel->getBlogPosts($category, $q);

        $this->view('pages/blog', [
            'pageTitle' => 'Blog & Kiến thức làm bánh | BakeMate',
            'activeNav' => 'blog',
            'posts' => $posts,
            'selectedCategory' => $category,
            'searchQuery' => $q,
        ]);
    }

    public function blogDetail(): void
    {
        $contentModel = $this->model('ContentModel');
        $recipeModel = $this->model('RecipeModel');
        $idOrSlug = trim((string) ($_GET['id'] ?? $_GET['slug'] ?? ''));
        $post = $idOrSlug !== '' ? $contentModel->getBlogPost($idOrSlug) : null;
        $relatedRecipe = ($post && !empty($post['recipe_slug']))
            ? $recipeModel->getRecipeDetail((string) $post['recipe_slug'])
            : null;
        $allPosts = $contentModel->getBlogPosts();
        $relatedSlugs = is_array($post['content']['related_slugs'] ?? null)
            ? $post['content']['related_slugs']
            : [];
        $otherPosts = [];
        if (!empty($relatedSlugs)) {
            $bySlug = [];
            foreach ($allPosts as $p) {
                $bySlug[(string) $p['slug']] = $p;
            }
            foreach ($relatedSlugs as $rSlug) {
                if (isset($bySlug[$rSlug]) && (!$post || (int) $bySlug[$rSlug]['id'] !== (int) $post['id'])) {
                    $otherPosts[] = $bySlug[$rSlug];
                }
            }
        }
        if (count($otherPosts) < 3) {
            $seenIds = array_map(static fn(array $p): int => (int) $p['id'], $otherPosts);
            foreach ($allPosts as $p) {
                $pid = (int) $p['id'];
                if ($post && $pid === (int) $post['id']) {
                    continue;
                }
                if (in_array($pid, $seenIds, true)) {
                    continue;
                }
                $otherPosts[] = $p;
                $seenIds[] = $pid;
                if (count($otherPosts) >= 3) {
                    break;
                }
            }
        }
        $otherPosts = array_slice($otherPosts, 0, 3);

        $this->view('pages/blog-detail', [
            'pageTitle' => ($post ? $post['title'] : 'Bài viết không tồn tại') . ' | BakeMate',
            'activeNav' => 'blog',
            'post' => $post,
            'relatedRecipe' => $relatedRecipe,
            'otherPosts' => $otherPosts,
        ]);
    }

    public function ajaxSubmitContact(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();

        if (!TurnstileService::verify((string) ($in['cf_turnstile_response'] ?? ''))) {
            $this->jsonResponse('error', 400, [], 'Xác thực chống spam không thành công.');
        }

        $fullName = trim((string) ($in['full_name'] ?? ''));
        $email = trim((string) ($in['email'] ?? ''));
        $phone = preg_replace('/[\s.-]/', '', trim((string) ($in['phone'] ?? ''))) ?? '';
        $topic = trim((string) ($in['topic'] ?? ''));
        $message = trim((string) ($in['message'] ?? ''));

        if (mb_strlen($fullName, 'UTF-8') < 2) {
            $this->jsonResponse('error', 422, [], 'Vui lòng nhập họ tên tối thiểu 2 ký tự.');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->jsonResponse('error', 422, [], 'Địa chỉ email không hợp lệ.');
        }
        if ($phone !== '' && !preg_match('/^(0[35789])[0-9]{8}$/', $phone)) {
            $this->jsonResponse('error', 422, [], 'Số điện thoại Việt Nam phải gồm 10 chữ số.');
        }
        if ($topic === '' || mb_strlen($message, 'UTF-8') < 10) {
            $this->jsonResponse('error', 422, [], 'Vui lòng chọn chủ đề và nhập nội dung tối thiểu 10 ký tự.');
        }

        $contentModel = $this->model('ContentModel');
        $user = Rbac::currentUser();
        $id = $contentModel->saveContact([
            'full_name' => $fullName,
            'email' => $email,
            'phone' => $phone,
            'topic' => $topic,
            'message' => $message,
        ], $user ? (int) $user['id'] : null);

        $this->jsonResponse('success', 200, ['id' => $id], 'Cảm ơn bạn đã liên hệ! Đội ngũ BakeMate sẽ phản hồi trong vòng 24 giờ.');
    }

    public function notFound(): void
    {
        http_response_code(404);
        $this->view('pages/404', [
            'pageTitle' => 'Không tìm thấy trang | BakeMate',
            'activeNav' => '',
        ]);
    }
}
