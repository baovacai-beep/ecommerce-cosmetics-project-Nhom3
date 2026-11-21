<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR . 'Controller.php';

class OrderController extends Controller
{
    public function cart(): void
    {
        $orderModel = $this->model('OrderModel');
        $user = Rbac::currentUser();
        $uid = $user ? (int) $user['id'] : null;
        $summary = $orderModel->getCartSummary($uid, false);

        $this->view('pages/cart', [
            'pageTitle' => 'Giỏ hàng | BakeMate',
            'activeNav' => 'cart',
            'summary' => $summary,
        ]);
    }

    public function checkout(): void
    {
        $orderModel = $this->model('OrderModel');
        $userModel = $this->model('UserModel');
        $user = Rbac::currentUser();
        $uid = $user ? (int) $user['id'] : null;

        $summary = $orderModel->getCartSummary($uid, true);
        $addresses = $uid ? $userModel->getAddresses($uid) : ($_SESSION['bakemate_guest_addresses'] ?? []);

        $this->view('pages/checkout', [
            'pageTitle' => 'Thanh toán đơn hàng | BakeMate',
            'activeNav' => 'cart',
            'summary' => $summary,
            'addresses' => $addresses,
            'locationsJson' => json_encode(ShippingService::VN_LOCATIONS, JSON_UNESCAPED_UNICODE),
            'shippingZonesJson' => json_encode(ShippingService::SHIPPING_ZONES, JSON_UNESCAPED_UNICODE),
        ]);
    }

    public function orderSuccess(): void
    {
        $orderModel = $this->model('OrderModel');
        $code = trim((string) ($_GET['code'] ?? $_SESSION['bakemate_last_order_code'] ?? ''));
        $user = Rbac::currentUser();
        $uid = $user ? (int) $user['id'] : null;
        $order = $code !== '' ? $orderModel->getOrderByCodeForViewer($code, $uid) : null;
        $vietQr = ($order && $order['payment_method'] === 'vietqr')
            ? VietQrBankService::buildPaymentPayload((string) $order['order_code'], (int) $order['total_amount'])
            : null;

        $this->view('pages/order-success', [
            'pageTitle' => ($order ? 'Đặt hàng thành công #' . $order['order_code'] : 'Hóa đơn đơn hàng') . ' | BakeMate',
            'activeNav' => 'orders',
            'order' => $order,
            'vietQr' => $vietQr,
        ]);
    }

    public function orders(): void
    {
        $orderModel = $this->model('OrderModel');
        $user = Rbac::currentUser();
        $uid = $user ? (int) $user['id'] : null;

        $q = trim((string) ($_GET['q'] ?? ''));
        $status = trim((string) ($_GET['status'] ?? 'all'));
        $orders = $orderModel->getOrdersForViewer($uid, $q, $status);

        $this->view('pages/orders', [
            'pageTitle' => 'Theo dõi & Lịch sử đơn hàng | BakeMate',
            'activeNav' => 'orders',
            'orders' => $orders,
            'searchQuery' => $q,
            'statusFilter' => $status,
        ]);
    }

    public function ajaxCartAdd(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $pid = (int) ($in['product_id'] ?? 0);
        $opt = (int) ($in['option_index'] ?? 0);
        $qty = max(1, (int) ($in['quantity'] ?? 1));
        $group = trim((string) ($in['recipe_group_id'] ?? ''));

        $orderModel = $this->model('OrderModel');
        $user = Rbac::currentUser();
        $uid = $user ? (int) $user['id'] : null;

        $res = $orderModel->addItemToCart($uid, $pid, $opt, $qty, $group);
        if (!$res['ok']) {
            $this->jsonResponse('error', 409, [], $res['message']);
        }
        $summary = $orderModel->getCartSummary($uid);
        $this->jsonResponse('success', 200, ['cart_count' => $summary['total_count'], 'summary' => $summary], $res['message']);
    }

    public function ajaxCartUpdate(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $pid = (int) ($in['product_id'] ?? 0);
        $opt = (int) ($in['option_index'] ?? 0);
        $qty = (int) ($in['quantity'] ?? 1);
        $group = trim((string) ($in['recipe_group_id'] ?? ''));

        $orderModel = $this->model('OrderModel');
        $user = Rbac::currentUser();
        $uid = $user ? (int) $user['id'] : null;

        $res = $orderModel->updateQuantity($uid, $pid, $opt, $group, $qty);
        if (!$res['ok']) {
            $this->jsonResponse('error', 409, [], $res['message']);
        }
        $summary = $orderModel->getCartSummary($uid);
        $this->jsonResponse('success', 200, ['summary' => $summary, 'cart_count' => $summary['total_count']], $res['message']);
    }

    public function ajaxCartRemove(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $pid = (int) ($in['product_id'] ?? 0);
        $opt = (int) ($in['option_index'] ?? 0);
        $group = trim((string) ($in['recipe_group_id'] ?? ''));

        $orderModel = $this->model('OrderModel');
        $user = Rbac::currentUser();
        $uid = $user ? (int) $user['id'] : null;

        $res = $orderModel->removeItem($uid, $pid, $opt, $group);
        $summary = $orderModel->getCartSummary($uid);
        $this->jsonResponse('success', 200, ['summary' => $summary, 'cart_count' => $summary['total_count']], $res['message']);
    }

    public function ajaxCartRemoveCombo(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $group = trim((string) ($in['recipe_group_id'] ?? ''));

        $orderModel = $this->model('OrderModel');
        $user = Rbac::currentUser();
        $uid = $user ? (int) $user['id'] : null;

        $res = $orderModel->removeComboGroup($uid, $group);
        if (!$res['ok']) {
            $this->jsonResponse('error', 400, [], $res['message']);
        }
        $summary = $orderModel->getCartSummary($uid);
        $this->jsonResponse('success', 200, ['summary' => $summary, 'cart_count' => $summary['total_count']], $res['message']);
    }

    public function ajaxCartSelect(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $targets = $in['targets'] ?? ['ALL'];
        $selected = !empty($in['selected']);

        $orderModel = $this->model('OrderModel');
        $user = Rbac::currentUser();
        $uid = $user ? (int) $user['id'] : null;

        $orderModel->setSelection($uid, is_array($targets) ? $targets : ['ALL'], $selected);
        $summary = $orderModel->getCartSummary($uid);
        $this->jsonResponse('success', 200, ['summary' => $summary, 'cart_count' => $summary['total_count']], 'Đã cập nhật lựa chọn.');
    }

    public function ajaxApplyCoupon(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $code = trim((string) ($in['code'] ?? ''));

        $orderModel = $this->model('OrderModel');
        $user = Rbac::currentUser();
        $uid = $user ? (int) $user['id'] : null;

        $summary = $orderModel->getCartSummary($uid, true);
        $res = $orderModel->applyCouponCode($code, (int) $summary['selected_subtotal']);
        if (!$res['ok']) {
            $this->jsonResponse('error', 422, [], $res['message']);
        }
        $nextSummary = $orderModel->getCartSummary($uid);
        $this->jsonResponse('success', 200, ['summary' => $nextSummary], $res['message']);
    }

    public function ajaxRemoveCoupon(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $scope = trim((string) ($in['scope'] ?? 'all'));

        $orderModel = $this->model('OrderModel');
        $user = Rbac::currentUser();
        $uid = $user ? (int) $user['id'] : null;

        $orderModel->removeCoupon($scope);
        $summary = $orderModel->getCartSummary($uid);
        $this->jsonResponse('success', 200, ['summary' => $summary], 'Đã gỡ mã ưu đãi.');
    }

    public function ajaxShippingPreview(): void
    {
        $province = trim((string) ($_GET['province'] ?? 'TP. Hồ Chí Minh'));
        $district = trim((string) ($_GET['district'] ?? 'Quận 3'));
        $method = trim((string) ($_GET['shipping_method'] ?? 'fast'));

        $orderModel = $this->model('OrderModel');
        $user = Rbac::currentUser();
        $uid = $user ? (int) $user['id'] : null;

        $cur = $orderModel->getCartSummary($uid, true);
        $zone = ShippingService::resolveZone($province, $district);
        $avail = ShippingService::getAvailableMethods($zone, (bool) $cur['has_perishable']);
        $feeInfo = ShippingService::calculateShippingFee($zone, $method, (bool) $cur['has_perishable']);
        $updated = $orderModel->getCartSummary($uid, false, $feeInfo['valid'] ? (int) $feeInfo['fee'] : 0);

        $this->jsonResponse('success', 200, [
            'zone' => $zone,
            'blocked' => $avail['blocked'] || !$feeInfo['valid'],
            'reason' => $feeInfo['valid'] ? $avail['reason'] : $feeInfo['reason'],
            'methods' => $avail['methods'],
            'selected_method' => $feeInfo['method_id'],
            'shipping_fee' => (int) $feeInfo['fee'],
            'summary' => $updated,
        ], 'OK');
    }

    public function ajaxSaveAddress(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $name = trim((string) ($in['recipient_name'] ?? ''));
        $phone = preg_replace('/[\s.-]/', '', trim((string) ($in['phone'] ?? ''))) ?? '';
        $province = trim((string) ($in['province'] ?? ''));
        $district = trim((string) ($in['district'] ?? ''));
        $ward = trim((string) ($in['ward'] ?? ''));
        $street = trim((string) ($in['street_address'] ?? ''));

        if (mb_strlen($name, 'UTF-8') < 2 || !preg_match('/^(0[35789])[0-9]{8}$/', $phone) || $province === '' || $district === '' || $ward === '' || mb_strlen($street, 'UTF-8') < 4) {
            $this->jsonResponse('error', 422, [], 'Vui lòng điền đầy đủ thông tin địa chỉ nhận hàng và số điện thoại hợp lệ.');
        }

        $user = Rbac::currentUser();
        if ($user) {
            $userModel = $this->model('UserModel');
            $addr = $userModel->saveAddress((int) $user['id'], [
                'recipient_name' => $name,
                'phone' => $phone,
                'province' => $province,
                'district' => $district,
                'ward' => $ward,
                'street_address' => $street,
                'is_default' => 1,
            ]);
        } else {
            $addr = [
                'id' => time(),
                'recipient_name' => $name,
                'phone' => $phone,
                'province' => $province,
                'district' => $district,
                'ward' => $ward,
                'street_address' => $street,
                'zone_type' => ShippingService::resolveZone($province, $district),
                'is_default' => 1,
            ];
            $list = $_SESSION['bakemate_guest_addresses'] ?? [];
            foreach ($list as &$old) {
                $old['is_default'] = 0;
            }
            unset($old);
            array_unshift($list, $addr);
            $_SESSION['bakemate_guest_addresses'] = $list;
        }

        $this->jsonResponse('success', 200, ['address' => $addr], 'Đã lưu địa chỉ nhận hàng.');
    }

    public function ajaxPlaceOrder(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $orderModel = $this->model('OrderModel');
        $user = Rbac::currentUser();
        $res = $orderModel->placeOrder($in, $user ? (int) $user['id'] : null);

        if (!$res['ok']) {
            $this->jsonResponse('error', (int) ($res['code'] ?? 400), [], $res['message']);
        }
        $this->jsonResponse('success', 200, [
            'order_code' => $res['order_code'],
            'redirect_url' => App::url('?c=order&a=orderSuccess&code=' . urlencode((string) $res['order_code'])),
            'payment' => $res['payment'],
        ], $res['message']);
    }

    public function ajaxVerifyVietQr(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $orderCode = trim((string) ($in['order_code'] ?? ''));
        $orderModel = $this->model('OrderModel');
        $user = Rbac::currentUser();
        $uid = $user ? (int) $user['id'] : null;
        $order = $orderModel->getOrderByCodeForViewer($orderCode, $uid);
        if (!$order) {
            $this->jsonResponse('error', 404, [], 'Không tìm thấy đơn hàng hoặc bạn không có quyền truy cập.');
        }

        $res = CassoService::verifyTransfer((string) $order['order_code'], (int) $order['total_amount']);
        if ($res['verified']) {
            $paid = $orderModel->markOrderPaid((int) $order['id']);
            if (empty($paid['ok'])) {
                $this->jsonResponse('error', 409, [], $paid['message']);
            }
            $this->jsonResponse('success', 200, ['payment_status' => 'paid', 'mode' => $res['mode']], $res['message']);
        }
        $this->jsonResponse('error', 402, ['payment_status' => $order['payment_status']], $res['message']);
    }

    public function ajaxRequestCancel(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $orderId = (int) ($in['order_id'] ?? 0);
        $reason = trim((string) ($in['reason'] ?? ''));
        $user = Rbac::currentUser();

        $orderModel = $this->model('OrderModel');
        $res = $orderModel->requestCancelOrder($orderId, $user ? (int) $user['id'] : null, $reason);
        if (!$res['ok']) {
            $this->jsonResponse('error', 422, [], $res['message']);
        }
        $this->jsonResponse('success', 200, [], $res['message']);
    }
}
