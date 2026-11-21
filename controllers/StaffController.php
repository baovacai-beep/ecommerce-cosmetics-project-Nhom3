<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR . 'Controller.php';

class StaffController extends Controller
{
    public function index(): void
    {
        $orderModel = $this->model('OrderModel');
        $productModel = $this->model('ProductModel');
        $contentModel = $this->model('ContentModel');

        $this->view('pages/staff', [
            'pageTitle' => 'Bàn làm việc Nhân viên | BakeMate',
            'activeNav' => 'staff',
            'orders' => $orderModel->getAllOrders(),
            'products' => $productModel->getCatalog([], true),
            'contacts' => $contentModel->getAllContacts(),
            'stats' => $contentModel->getDashboardStats(),
        ]);
    }

    public function ajaxUpdateOrderStatus(): void
    {
        Rbac::requireRolesJson(['staff', 'admin']);
        $this->requirePostJson();
        $in = $this->jsonInput();
        $res = $this->model('OrderModel')->updateOrderStatus((int) ($in['order_id'] ?? 0), trim((string) ($in['status'] ?? '')));
        if (!$res['ok']) {
            $this->jsonResponse('error', 422, [], $res['message']);
        }
        $this->jsonResponse('success', 200, $res, $res['message']);
    }

    public function ajaxVerifyPayment(): void
    {
        Rbac::requireRolesJson(['staff', 'admin']);
        $this->requirePostJson();
        $in = $this->jsonInput();
        $res = $this->model('OrderModel')->markOrderPaid((int) ($in['order_id'] ?? 0));
        if (empty($res['ok'])) {
            $this->jsonResponse('error', 422, [], $res['message']);
        }
        $this->jsonResponse('success', 200, [], $res['message']);
    }

    public function ajaxUpdateStock(): void
    {
        Rbac::requireRolesJson(['staff', 'admin']);
        $this->requirePostJson();
        $in = $this->jsonInput();
        $res = $this->model('ProductModel')->updateVariantStock((int) ($in['product_id'] ?? 0), (int) ($in['stock_qty'] ?? 0));
        $this->jsonResponse('success', 200, $res, $res['message']);
    }

    public function ajaxReplyContact(): void
    {
        Rbac::requireRolesJson(['staff', 'admin']);
        $this->requirePostJson();
        $in = $this->jsonInput();
        $ok = $this->model('ContentModel')->updateContact((int) ($in['contact_id'] ?? 0), trim((string) ($in['status'] ?? 'resolved')), trim((string) ($in['reply'] ?? '')));
        $this->jsonResponse($ok ? 'success' : 'error', $ok ? 200 : 400, [], $ok ? 'Đã cập nhật phản hồi liên hệ.' : 'Không thể cập nhật liên hệ.');
    }
}
