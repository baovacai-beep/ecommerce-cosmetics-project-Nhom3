<?php
declare(strict_types=1);

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR . 'Controller.php';

class AuthController extends Controller
{
    private function sanitizeRedirect(string $redirect): string
    {
        $clean = trim($redirect);
        if ($clean === '' || str_starts_with($clean, 'http://') || str_starts_with($clean, 'https://') || str_starts_with($clean, '//')) {
            return '';
        }
        return $clean;
    }

    public function login(): void
    {
        $user = Rbac::currentUser();
        if ($user) {
            $target = $user['role'] === 'admin'
                ? App::url('?c=admin&a=index')
                : ($user['role'] === 'staff' ? App::url('?c=staff&a=index') : App::url(''));
            header('Location: ' . $target);
            exit;
        }

        $this->view('pages/login', [
            'pageTitle' => 'Đăng nhập | BakeMate',
            'activeNav' => '',
            'redirect' => $this->sanitizeRedirect((string) ($_GET['redirect'] ?? '')),
        ]);
    }

    public function register(): void
    {
        if (Rbac::currentUser()) {
            header('Location: ' . App::url(''));
            exit;
        }
        $this->view('pages/register', [
            'pageTitle' => 'Đăng ký tài khoản | BakeMate',
            'activeNav' => '',
        ]);
    }

    public function forgotPassword(): void
    {
        $this->view('pages/forgot-password', [
            'pageTitle' => 'Quên mật khẩu & Xác thực OTP | BakeMate',
            'activeNav' => '',
        ]);
    }

    public function profile(): void
    {
        $user = Rbac::currentUser();
        if (!$user) {
            header('Location: ' . App::url('?c=auth&a=login'));
            exit;
        }
        $userModel = $this->model('UserModel');
        $addresses = $userModel->getAddresses((int) $user['id']);

        $this->view('pages/profile', [
            'pageTitle' => 'Hồ sơ tài khoản | BakeMate',
            'activeNav' => '',
            'profileUser' => $user,
            'addresses' => $addresses,
            'locationsJson' => json_encode(ShippingService::VN_LOCATIONS, JSON_UNESCAPED_UNICODE),
        ]);
    }

    public function logout(): void
    {
        Rbac::logoutUser();
        header('Location: ' . App::url(''));
        exit;
    }

    public function ajaxLogin(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $email = trim((string) ($in['identifier'] ?? $in['email'] ?? ''));
        $password = (string) ($in['password'] ?? '');
        $redirect = $this->sanitizeRedirect((string) ($in['redirect'] ?? ''));

        if ($email === '' || $password === '') {
            $this->jsonResponse('error', 422, [], 'Vui lòng nhập đầy đủ email/SĐT và mật khẩu.');
        }

        $userModel = $this->model('UserModel');
        $res = $userModel->authenticate($email, $password);
        if (!$res['ok']) {
            $this->jsonResponse('error', (int) ($res['code'] ?? 401), [], $res['message']);
        }

        $user = $res['user'];
        Rbac::loginUser($user);

        // Đồng bộ giỏ hàng & yêu thích từ Guest Session sang DB tài khoản
        $orderModel = $this->model('OrderModel');
        $contentModel = $this->model('ContentModel');
        $orderModel->mergeGuestCartToDb((int) $user['id']);
        $contentModel->mergeGuestWishlistToDb((int) $user['id']);

        $defaultRedirect = match ($user['role']) {
            'admin' => App::url('?c=admin&a=index'),
            'staff' => App::url('?c=staff&a=index'),
            default => App::url(''),
        };

        $this->jsonResponse('success', 200, [
            'role' => $user['role'],
            'redirect_url' => $redirect !== '' ? $redirect : $defaultRedirect,
        ], 'Đăng nhập thành công! Chào mừng ' . $user['full_name']);
    }

    public function ajaxRegister(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();

        if (!TurnstileService::verify((string) ($in['cf_turnstile_response'] ?? ''))) {
            $this->jsonResponse('error', 400, [], 'Xác thực chống bot không thành công.');
        }

        $fullName = trim((string) ($in['full_name'] ?? ''));
        $email = trim((string) ($in['email'] ?? ''));
        $phone = trim((string) ($in['phone'] ?? ''));
        $password = (string) ($in['password'] ?? '');
        $confirm = (string) ($in['confirm_password'] ?? '');

        if (mb_strlen($fullName, 'UTF-8') < 2) {
            $this->jsonResponse('error', 422, [], 'Họ và tên phải có ít nhất 2 ký tự.');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->jsonResponse('error', 422, [], 'Địa chỉ email không hợp lệ.');
        }
        $cleanPhone = preg_replace('/[\s.-]/', '', $phone) ?? '';
        if ($cleanPhone !== '' && !preg_match('/^(0[35789])[0-9]{8}$/', $cleanPhone)) {
            $this->jsonResponse('error', 422, [], 'Số điện thoại Việt Nam phải gồm 10 chữ số.');
        }
        if (strlen($password) < 8) {
            $this->jsonResponse('error', 422, [], 'Mật khẩu phải có ít nhất 8 ký tự.');
        }
        if ($password !== $confirm) {
            $this->jsonResponse('error', 422, [], 'Mật khẩu xác nhận không khớp.');
        }

        $userModel = $this->model('UserModel');
        $res = $userModel->registerCustomer($fullName, $email, $cleanPhone, $password);
        if (!$res['ok']) {
            $this->jsonResponse('error', 409, [], $res['message']);
        }

        $user = $res['user'];
        Rbac::loginUser($user);
        $this->model('OrderModel')->mergeGuestCartToDb((int) $user['id']);
        $this->model('ContentModel')->mergeGuestWishlistToDb((int) $user['id']);

        $this->jsonResponse('success', 200, ['redirect_url' => App::url('')], $res['message']);
    }

    public function ajaxSendOtp(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $email = trim((string) ($in['email'] ?? ''));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->jsonResponse('error', 422, [], 'Vui lòng nhập email hợp lệ.');
        }

        $res = $this->model('UserModel')->createOtp($email);
        if (!$res['ok']) {
            $this->jsonResponse('error', (int) ($res['code'] ?? 400), [], $res['message']);
        }
        $this->jsonResponse('success', 200, ['dev_otp_preview' => $res['dev_otp_preview']], $res['message']);
    }

    public function ajaxVerifyOtp(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $email = trim((string) ($in['email'] ?? ''));
        $otp = trim((string) ($in['otp_code'] ?? ''));

        $res = $this->model('UserModel')->verifyOtp($email, $otp);
        if (!$res['ok']) {
            $this->jsonResponse('error', 422, [], $res['message']);
        }
        $this->jsonResponse('success', 200, [], $res['message']);
    }

    public function ajaxResetPassword(): void
    {
        $this->requirePostJson();
        $in = $this->jsonInput();
        $email = trim((string) ($in['email'] ?? ''));
        $otp = trim((string) ($in['otp_code'] ?? ''));
        $password = (string) ($in['new_password'] ?? '');
        $confirm = (string) ($in['confirm_password'] ?? '');

        if (strlen($password) < 8 || $password !== $confirm) {
            $this->jsonResponse('error', 422, [], 'Mật khẩu mới tối thiểu 8 ký tự và phải khớp xác nhận.');
        }

        $res = $this->model('UserModel')->resetPasswordWithOtp($email, $otp, $password);
        if (!$res['ok']) {
            $this->jsonResponse('error', 422, [], $res['message']);
        }
        $this->jsonResponse('success', 200, ['redirect_url' => App::url('?c=auth&a=login')], $res['message']);
    }

    public function ajaxUpdateProfile(): void
    {
        $user = Rbac::requireRolesJson(['customer', 'staff', 'admin']);
        $this->requirePostJson();
        $in = $this->jsonInput();
        $fullName = trim((string) ($in['full_name'] ?? ''));
        $phone = preg_replace('/[\s.-]/', '', trim((string) ($in['phone'] ?? ''))) ?? '';

        if (mb_strlen($fullName, 'UTF-8') < 2) {
            $this->jsonResponse('error', 422, [], 'Họ và tên phải có ít nhất 2 ký tự.');
        }
        if ($phone !== '' && !preg_match('/^(0[35789])[0-9]{8}$/', $phone)) {
            $this->jsonResponse('error', 422, [], 'Số điện thoại không đúng định dạng Việt Nam.');
        }

        $this->model('UserModel')->updateProfile((int) $user['id'], $fullName, $phone);
        $this->jsonResponse('success', 200, [], 'Đã cập nhật thông tin cá nhân thành công!');
    }

    public function ajaxChangePassword(): void
    {
        $user = Rbac::requireRolesJson(['customer', 'staff', 'admin']);
        $this->requirePostJson();
        $in = $this->jsonInput();
        $current = (string) ($in['current_password'] ?? '');
        $newPass = (string) ($in['new_password'] ?? '');
        $confirm = (string) ($in['confirm_password'] ?? '');

        if (strlen($newPass) < 8 || $newPass !== $confirm) {
            $this->jsonResponse('error', 422, [], 'Mật khẩu mới tối thiểu 8 ký tự và phải khớp xác nhận.');
        }

        $res = $this->model('UserModel')->changePassword((int) $user['id'], $current, $newPass);
        if (!$res['ok']) {
            $this->jsonResponse('error', 422, [], $res['message']);
        }
        $this->jsonResponse('success', 200, [], $res['message']);
    }
}
