<?php
declare(strict_types=1);
?>
<main class="php-page-container">
  <div class="php-card" style="text-align:center;padding:56px 20px;background:#fff8ed;border:1.5px dashed #b91c1c;">
    <h1 style="color:#b91c1c;margin-top:0;">403 · <?= App::e($errorTitle ?? 'Không có quyền truy cập') ?></h1>
    <p style="color:#4a2d1b;max-width:540px;margin:0 auto 24px;"><?= App::e($errorDesc ?? 'Vui lòng quay lại trang chủ hoặc đăng nhập bằng tài khoản được cấp quyền.') ?></p>
    <a href="<?= App::e(App::url('')) ?>" class="btn btn--primary">Về trang chủ</a>
  </div>
</main>
