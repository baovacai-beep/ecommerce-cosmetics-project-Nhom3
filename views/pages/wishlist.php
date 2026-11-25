<?php
declare(strict_types=1);
?>
<main class="page-container">
  <nav class="breadcrumb" aria-label="Đường dẫn điều hướng">
    <ul class="breadcrumb__list">
      <li class="breadcrumb__item"><a href="<?= App::e(App::url('')) ?>">Trang chủ</a></li>
      <li class="breadcrumb__separator">/</li>
      <li class="breadcrumb__item active">Danh sách yêu thích</li>
    </ul>
  </nav>

  <div class="cart-page__header">
    <div>
      <h1 class="cart-page__title">Danh sách yêu thích của bạn</h1>
      <p class="cart-page__subtitle">Lưu giữ nguyên liệu và dụng cụ cần mua cho lần làm bánh tiếp theo.</p>
    </div>
    <span class="cart-page__count-pill"><?= count($products ?? []) ?> sản phẩm đã lưu</span>
  </div>

  <?php if (empty($products)): ?>
    <section class="cart-empty">
      <span class="cart-empty__icon" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      </span>
      <h2 class="cart-empty__title">Bạn chưa lưu sản phẩm yêu thích nào</h2>
      <p class="cart-empty__desc">Nhấn biểu tượng trái tim trên mỗi sản phẩm để lưu vào danh sách yêu thích và mua nhanh khi cần.</p>
      <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
        <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="btn btn--primary">Khám phá sản phẩm</a>
        <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="btn btn--outline-dark">Xem thư viện công thức</a>
      </div>
    </section>
  <?php else: ?>
    <div class="product-grid">
      <?php foreach ($products as $p): ?>
        <?php require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'partials' . DIRECTORY_SEPARATOR . 'product-card.php'; ?>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</main>
