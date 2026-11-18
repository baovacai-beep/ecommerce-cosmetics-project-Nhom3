<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR . 'Controller.php';

class ProductController extends Controller
{
    private function sanitizeCatalogFilters(array $source): array
    {
        $category = $source['category'] ?? [];
        if (!is_array($category)) {
            $category = $category !== '' ? [$category] : [];
        }

        $sub = $source['sub'] ?? [];
        if (!is_array($sub)) {
            $sub = $sub !== '' ? [$sub] : [];
        }

        $brand = $source['brand'] ?? [];
        if (!is_array($brand)) {
            $brand = $brand !== '' ? [$brand] : [];
        }

        $stock = $source['stock'] ?? [];
        if (!is_array($stock)) {
            $stock = $stock !== '' ? [$stock] : [];
        }

        $minPrice = $source['min_price'] ?? '';
        if ($minPrice !== '' && is_numeric($minPrice)) {
            $minPrice = max(0, (int) $minPrice);
        } else {
            $minPrice = '';
        }

        $maxPrice = $source['max_price'] ?? '';
        if ($maxPrice !== '' && is_numeric($maxPrice)) {
            $maxPrice = max(0, (int) $maxPrice);
        } else {
            $maxPrice = '';
        }

        $allowedSorts = ['featured', 'price-asc', 'price-desc', 'name-asc', 'name-desc', 'newest'];
        $sort = trim((string) ($source['sort'] ?? 'featured'));
        if (!in_array($sort, $allowedSorts, true)) {
            $sort = 'featured';
        }

        return [
            'q' => trim((string) ($source['q'] ?? '')),
            'category' => array_values(array_filter(array_map('trim', $category))),
            'sub' => array_values(array_filter(array_map('trim', $sub))),
            'brand' => array_values(array_filter(array_map('trim', $brand))),
            'min_price' => $minPrice,
            'max_price' => $maxPrice,
            'stock' => array_values(array_filter(array_map('trim', $stock))),
            'sort' => $sort,
        ];
    }

    public function catalog(): void
    {
        $productModel = $this->model('ProductModel');
        $contentModel = $this->model('ContentModel');
        $user = Rbac::currentUser();

        $filters = $this->sanitizeCatalogFilters($_GET);

        $meta = $productModel->getFilterMetadata();
        $products = $productModel->getCatalog($filters, false);
        $recentProducts = $productModel->getRecentlyViewed(0, 4);
        $wishlistIds = $contentModel->getWishlistIds($user ? (int) $user['id'] : null);

        $this->view('pages/products', [
            'pageTitle' => 'Sản phẩm làm bánh | BakeMate',
            'activeNav' => 'products',
            'filterMeta' => $meta,
            'products' => $products,
            'filters' => $filters,
            'recentProducts' => $recentProducts,
            'wishlistIds' => $wishlistIds,
        ]);
    }

    public function detail(): void
    {
        $productModel = $this->model('ProductModel');
        $contentModel = $this->model('ContentModel');
        $user = Rbac::currentUser();

        $id = (int) ($_GET['id'] ?? 0);
        $slug = trim((string) ($_GET['slug'] ?? ''));

        $product = null;
        if ($id > 0) {
            $product = $productModel->getProductDetail($id);
        } elseif ($slug !== '') {
            $product = $productModel->getProductDetailBySlug($slug);
        }

        if ($product) {
            $productModel->trackRecentlyViewed((int) $product['id']);
        }
        $recentProducts = $productModel->getRecentlyViewed($product ? (int) $product['id'] : $id, 4);
        $wishlistIds = $contentModel->getWishlistIds($user ? (int) $user['id'] : null);

        $this->view('pages/product-detail', [
            'pageTitle' => ($product ? $product['name'] : 'Sản phẩm không tồn tại') . ' | BakeMate',
            'activeNav' => 'products',
            'product' => $product,
            'recentProducts' => $recentProducts,
            'wishlistIds' => $wishlistIds,
        ]);
    }

    public function wishlist(): void
    {
        $contentModel = $this->model('ContentModel');
        $user = Rbac::currentUser();
        $uid = $user ? (int) $user['id'] : null;

        $products = $contentModel->getWishlistProducts($uid);
        $wishlistIds = $contentModel->getWishlistIds($uid);

        $this->view('pages/wishlist', [
            'pageTitle' => 'Danh sách yêu thích | BakeMate',
            'activeNav' => '',
            'products' => $products,
            'wishlistIds' => $wishlistIds,
        ]);
    }

    public function ajaxFilter(): void
    {
        $productModel = $this->model('ProductModel');
        $contentModel = $this->model('ContentModel');
        $user = Rbac::currentUser();

        $filters = $this->sanitizeCatalogFilters($_GET);
        $products = $productModel->getCatalog($filters, false);
        $wishlistIds = $contentModel->getWishlistIds($user ? (int) $user['id'] : null);

        $this->jsonResponse('success', 200, [
            'products' => $products,
            'count' => count($products),
            'wishlist_ids' => $wishlistIds,
        ], 'Tải danh sách sản phẩm thành công.');
    }

    public function ajaxQuickSearch(): void
    {
        $q = trim((string) ($_GET['q'] ?? ''));
        if ($q === '') {
            $this->jsonResponse('success', 200, ['items' => []], 'OK');
        }
        $productModel = $this->model('ProductModel');
        $matched = array_slice($productModel->getCatalog(['q' => $q], false), 0, 5);
        $items = array_map(static fn(array $p): array => [
            'id' => (int) $p['id'],
            'name' => (string) $p['name'],
            'price' => (int) $p['default_price'],
            'image' => (string) $p['primary_image'],
            'category' => (string) $p['category_name'],
        ], $matched);
        $this->jsonResponse('success', 200, ['items' => $items], 'OK');
    }

    public function ajaxToggleWishlist(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $productId = (int) ($in['product_id'] ?? 0);
        if ($productId <= 0) {
            $this->jsonResponse('error', 400, [], 'Mã sản phẩm không hợp lệ.');
        }

        $contentModel = $this->model('ContentModel');
        $user = Rbac::currentUser();
        $res = $contentModel->toggleWishlist($user ? (int) $user['id'] : null, $productId);
        $this->jsonResponse('success', 200, $res, $res['message']);
    }

    public function ajaxSubmitReview(): void
    {
        $this->requirePostJson();
        $productId = (int) ($_POST['product_id'] ?? 0);
        $user = Rbac::currentUser();
        $name = trim((string) ($_POST['reviewer_name'] ?? ($user['full_name'] ?? '')));
        $rating = (int) ($_POST['rating'] ?? 5);
        $comment = trim((string) ($_POST['comment'] ?? ''));

        if ($productId <= 0 || mb_strlen($name, 'UTF-8') < 2 || mb_strlen($comment, 'UTF-8') < 6) {
            $this->jsonResponse('error', 422, [], 'Vui lòng nhập tên (tối thiểu 2 ký tự) và nội dung đánh giá (tối thiểu 6 ký tự).');
        }

        $imagePath = null;
        if (!empty($_FILES['review_image']['name'])) {
            $up = UploadService::storeImage($_FILES['review_image'], 'reviews');
            if (!$up['ok']) {
                $this->jsonResponse('error', 422, [], $up['error']);
            }
            $imagePath = $up['path'];
        }

        $productModel = $this->model('ProductModel');
        $review = $productModel->addReview($productId, $user ? (int) $user['id'] : null, $name, $rating, $comment, $imagePath);
        $this->jsonResponse('success', 200, ['review' => $review], 'Cảm ơn bạn đã gửi đánh giá sản phẩm!');
    }

    public function ajaxClearRecent(): void
    {
        $this->requirePostJson();
        unset($_SESSION['bakemate_recent_products']);
        $this->jsonResponse('success', 200, [], 'Đã xóa lịch sử sản phẩm đã xem gần đây.');
    }
}
