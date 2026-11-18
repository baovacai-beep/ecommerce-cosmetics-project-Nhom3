<?php
declare(strict_types=1);
?>
<main class="php-page-container">
  <div style="margin-bottom:22px;">
    <h1 style="margin:0 0 6px;color:#70452b;">Sản phẩm yêu thích của bạn</h1>
    <p style="margin:0;color:#7c5c46;">Lưu giữ nguyên liệu và dụng cụ cần mua cho lần làm bánh tiếp theo.</p>
  </div>

  <?php if (empty($products)): ?>
    <div class="php-card" style="text-align:center;padding:48px 20px;background:#fff8ed;border:1.5px dashed #c88b52;">
      <h2 style="color:#70452b;margin-top:0;">Danh sách yêu thích đang trống</h2>
      <p style="color:#7c5c46;">Nhấn biểu tượng trái tim trên bất kỳ sản phẩm nào để lưu lại tại đây.</p>
      <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="btn btn--primary">Khám phá sản phẩm</a>
    </div>
  <?php else: ?>
    <div class="product-grid">
      <?php foreach ($products as $p): ?>
        <?php require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'partials' . DIRECTORY_SEPARATOR . 'product-card.php'; ?>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</main>
