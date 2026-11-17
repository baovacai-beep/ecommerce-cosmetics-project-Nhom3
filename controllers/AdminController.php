<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR . 'Controller.php';

class AdminController extends Controller
{
    public function index(): void
    {
        $orderModel = $this->model('OrderModel');
        $productModel = $this->model('ProductModel');
        $recipeModel = $this->model('RecipeModel');
        $userModel = $this->model('UserModel');
        $contentModel = $this->model('ContentModel');

        $cancelRequests = $this->getCancelRequests($orderModel);

        $this->view('pages/admin', [
            'pageTitle' => 'Trung tâm Quản trị (Admin) | BakeMate',
            'activeNav' => 'admin',
            'stats' => $contentModel->getDashboardStats(),
            'orders' => $orderModel->getAllOrders(),
            'cancelRequests' => $cancelRequests,
            'products' => $productModel->getCatalog([], true),
            'recipes' => $recipeModel->getAllRecipes([], true),
            'coupons' => $contentModel->getAllCoupons(),
            'blogPosts' => $contentModel->getBlogPosts('all', '', true),
            'reviews' => $contentModel->getAllReviews(),
            'users' => $userModel->getAllUsers(),
            'securityLogs' => $userModel->getSecurityLogs(25),
            'contacts' => $contentModel->getAllContacts(),
        ]);
    }

    private function getCancelRequests(object $orderModel): array
    {
        $orders = $orderModel->getAllOrders();
        $out = [];
        foreach ($orders as $o) {
            if (!empty($o['cancel_request'])) {
                $req = $o['cancel_request'];
                $req['order_code'] = $o['order_code'];
                $req['customer_name'] = $o['customer_name'];
                $req['order_status'] = $o['status'];
                $out[] = $req;
            }
        }
        return $out;
    }

    public function ajaxSaveProduct(): void
    {
        Rbac::requireRolesJson(['admin']);
        $this->requirePostJson();

        $imagePath = trim((string) ($_POST['image_path'] ?? ''));
        if (!empty($_FILES['product_image']['name'])) {
            $up = UploadService::storeImage($_FILES['product_image'], 'products');
            if (!$up['ok']) {
                $this->jsonResponse('error', 422, [], $up['error']);
            }
            $imagePath = $up['path'];
        }

        try {
            $res = $this->model('ProductModel')->saveAdminProduct([
                'id' => (int) ($_POST['id'] ?? 0),
                'name' => (string) ($_POST['name'] ?? ''),
                'category_name' => (string) ($_POST['category_name'] ?? 'Nguyên liệu'),
                'brand_name' => (string) ($_POST['brand_name'] ?? 'BakeMate'),
                'packaging_label' => (string) ($_POST['packaging_label'] ?? 'Tiêu chuẩn'),
                'price' => (int) ($_POST['price'] ?? 0),
                'old_price' => (int) ($_POST['old_price'] ?? 0),
                'stock_qty' => (int) ($_POST['stock_qty'] ?? 0),
                'stock_status' => (string) ($_POST['stock_status'] ?? 'in_stock'),
                'description' => (string) ($_POST['description'] ?? ''),
                'is_perishable' => !empty($_POST['is_perishable']),
                'is_new' => !empty($_POST['is_new']),
                'is_featured' => !empty($_POST['is_featured']),
                'image_path' => $imagePath,
            ]);
            $this->jsonResponse('success', 200, $res, $res['message']);
        } catch (InvalidArgumentException $e) {
            $this->jsonResponse('error', 422, [], $e->getMessage());
        }
    }

    public function ajaxToggleProductVisibility(): void
    {
        Rbac::requireRolesJson(['admin']);
        $this->requirePostJson();
        $in = $this->jsonInput();
        $res = $this->model('ProductModel')->toggleVisibility((int) ($in['product_id'] ?? 0));
        $this->jsonResponse($res['ok'] ? 'success' : 'error', $res['ok'] ? 200 : 404, $res, $res['message']);
    }

    public function ajaxSaveRecipe(): void
    {
        Rbac::requireRolesJson(['admin']);
        $this->requirePostJson();
        $in = $this->jsonInput();
        try {
            $res = $this->model('RecipeModel')->saveAdminRecipe($in);
            $this->jsonResponse('success', 200, $res, $res['message']);
        } catch (InvalidArgumentException $e) {
            $this->jsonResponse('error', 422, [], $e->getMessage());
        }
    }

    public function ajaxDeleteRecipe(): void
    {
        Rbac::requireRolesJson(['admin']);
        $this->requirePostJson();
        $in = $this->jsonInput();
        $ok = $this->model('RecipeModel')->deleteRecipe((int) ($in['recipe_id'] ?? 0));
        $this->jsonResponse($ok ? 'success' : 'error', $ok ? 200 : 400, [], $ok ? 'Đã xóa công thức.' : 'Không thể xóa công thức.');
    }

    public function ajaxSaveCoupon(): void
    {
        Rbac::requireRolesJson(['admin']);
        $this->requirePostJson();
        $in = $this->jsonInput();
        $res = $this->model('ContentModel')->saveCoupon($in);
        $this->jsonResponse($res['ok'] ? 'success' : 'error', $res['ok'] ? 200 : 422, [], $res['message']);
    }

    public function ajaxToggleCoupon(): void
    {
        Rbac::requireRolesJson(['admin']);
        $this->requirePostJson();
        $in = $this->jsonInput();
        $ok = $this->model('ContentModel')->toggleCoupon((int) ($in['coupon_id'] ?? 0));
        $this->jsonResponse($ok ? 'success' : 'error', $ok ? 200 : 400, [], 'Đã đổi trạng thái mã ưu đãi.');
    }

    public function ajaxSaveBlogPost(): void
    {
        Rbac::requireRolesJson(['admin']);
        $this->requirePostJson();
        $in = $this->jsonInput();
        $res = $this->model('ContentModel')->saveBlogPost($in);
        $this->jsonResponse('success', 200, $res, $res['message']);
    }

    public function ajaxModerateReview(): void
    {
        Rbac::requireRolesJson(['admin']);
        $this->requirePostJson();
        $in = $this->jsonInput();
        $ok = $this->model('ContentModel')->setReviewStatus((int) ($in['review_id'] ?? 0), trim((string) ($in['status'] ?? 'approved')));
        $this->jsonResponse($ok ? 'success' : 'error', $ok ? 200 : 400, [], 'Đã cập nhật hiển thị đánh giá.');
    }

    public function ajaxToggleUserLock(): void
    {
        $actor = Rbac::requireRolesJson(['admin']);
        $this->requirePostJson();
        $in = $this->jsonInput();
        $res = $this->model('UserModel')->toggleLock((int) ($in['user_id'] ?? 0), (int) $actor['id']);
        $this->jsonResponse($res['ok'] ? 'success' : 'error', $res['ok'] ? 200 : 400, $res, $res['message']);
    }

    public function ajaxCreatePrivilegedUser(): void
    {
        $actor = Rbac::requireRolesJson(['admin']);
        $this->requirePostJson();
        if (empty($actor['is_super_admin'])) {
            $this->jsonResponse('error', 403, [], 'Chỉ Super Admin mới có quyền cấp tài khoản Quản trị / Nhân viên.');
        }
        $in = $this->jsonInput();
        $fullName = trim((string) ($in['full_name'] ?? ''));
        $email = trim((string) ($in['email'] ?? ''));
        $phone = trim((string) ($in['phone'] ?? ''));
        $password = (string) ($in['password'] ?? '');
        $role = trim((string) ($in['role'] ?? 'staff'));

        if (mb_strlen($fullName, 'UTF-8') < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 8) {
            $this->jsonResponse('error', 422, [], 'Vui lòng nhập họ tên, email hợp lệ và mật khẩu tối thiểu 8 ký tự.');
        }

        $res = $this->model('UserModel')->createPrivilegedAccount($fullName, $email, $phone, $password, $role);
        $this->jsonResponse($res['ok'] ? 'success' : 'error', $res['ok'] ? 200 : 409, [], $res['message']);
    }

    public function ajaxHandleCancelRequest(): void
    {
        Rbac::requireRolesJson(['admin']);
        $this->requirePostJson();
        $in = $this->jsonInput();
        $res = $this->model('OrderModel')->handleCancelRequest(
            (int) ($in['request_id'] ?? 0),
            trim((string) ($in['decision'] ?? 'reject')),
            trim((string) ($in['admin_note'] ?? ''))
        );
        $this->jsonResponse($res['ok'] ? 'success' : 'error', $res['ok'] ? 200 : 400, [], $res['message']);
    }

    public function ajaxUpdateOrderStatus(): void
    {
        Rbac::requireRolesJson(['admin']);
        $this->requirePostJson();
        $in = $this->jsonInput();
        $res = $this->model('OrderModel')->updateOrderStatus((int) ($in['order_id'] ?? 0), trim((string) ($in['status'] ?? '')));
        $this->jsonResponse($res['ok'] ? 'success' : 'error', $res['ok'] ? 200 : 422, $res, $res['message']);
    }

    public function ajaxReplyContact(): void
    {
        Rbac::requireRolesJson(['admin']);
        $this->requirePostJson();
        $in = $this->jsonInput();
        $ok = $this->model('ContentModel')->updateContact((int) ($in['contact_id'] ?? 0), trim((string) ($in['status'] ?? 'resolved')), trim((string) ($in['reply'] ?? '')));
        $this->jsonResponse($ok ? 'success' : 'error', $ok ? 200 : 400, [], 'Đã lưu trạng thái liên hệ.');
    }
}
