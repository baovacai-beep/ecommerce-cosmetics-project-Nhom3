<?php
declare(strict_types=1);
/**
 * Partial thẻ sản phẩm dùng chung (Trang chủ, Danh mục, Yêu thích, Đã xem gần đây).
 * Khớp hoàn toàn class CSS chuẩn trong public/css/style.css.
 */
$pid = (int) ($p['id'] ?? 0);
$imgSrc = App::asset((string) ($p['primary_image'] ?? $p['image_path'] ?? 'images/logo.jpg'));
$price = (int) ($p['default_price'] ?? $p['price'] ?? 0);
$oldPrice = (int) ($p['default_old_price'] ?? $p['old_price'] ?? $price);
$isComingSoon = (($p['stock_status'] ?? 'in_stock') === 'coming_soon');
$isOutOfStock = (($p['stock_status'] ?? 'in_stock') === 'out_of_stock');
$isWish = in_array($pid, $wishlistIds ?? [], true);
?>
<article class="product-card" data-product-id="<?= $pid ?>">
  <a href="<?= App::e(App::url('?c=product&a=detail&id=' . $pid)) ?>" class="product-card__image-link" style="position:relative;">
    <div class="product-card__image-wrap">
      <img src="<?= App::e($imgSrc) ?>" alt="<?= App::e($p['name']) ?>" class="product-card__image" loading="lazy">
    </div>
    <?php if (!empty($p['is_perishable'])): ?>
      <span class="product-card__tag product-card__tag--cold">Tươi lạnh</span>
    <?php elseif ($isComingSoon || $isOutOfStock): ?>
      <span class="product-card__tag product-card__tag--soon">Hết hàng</span>
    <?php elseif (!empty($p['is_new'])): ?>
      <span class="product-card__tag product-card__tag--new">Mới</span>
    <?php elseif ($oldPrice > $price): ?>
      <span class="product-card__tag product-card__tag--sale">-<?= (int) round((($oldPrice - $price) / max(1, $oldPrice)) * 100) ?>%</span>
    <?php endif; ?>
  </a>

  <div class="product-card__content">
    <div class="product-card__top-meta" style="margin-top:0;margin-bottom:6px;">
      <span class="product-card__category" style="margin-bottom:0;"><?= App::e($p['category_name'] ?? 'Sản phẩm') ?></span>
      <button type="button"
              class="wishlist-heart-btn js-wishlist-toggle <?= $isWish ? 'is-active' : '' ?>"
              data-product-id="<?= $pid ?>"
              aria-label="<?= $isWish ? 'Bỏ yêu thích' : 'Thêm vào yêu thích' ?>">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="<?= $isWish ? 'currentColor' : 'none' ?>" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      </button>
    </div>

    <h3 class="product-card__title">
      <a href="<?= App::e(App::url('?c=product&a=detail&id=' . $pid)) ?>" style="color:inherit;text-decoration:none;"><?= App::e($p['name']) ?></a>
    </h3>
    <p class="product-card__pack" style="margin:0 0 8px;font-size:12.5px;color:#7c5c46;"><?= App::e($p['packaging_label'] ?? $p['default_variant_label'] ?? '') ?></p>

    <div class="product-card__price-row">
      <span class="product-card__price"><?= App::e(App::formatCurrency($price)) ?></span>
      <?php if ($oldPrice > $price): ?>
        <span class="product-card__old-price"><?= App::e(App::formatCurrency($oldPrice)) ?></span>
      <?php endif; ?>
    </div>

    <div class="product-card__actions" style="margin-top:auto;display:grid;gap:8px;padding-top:10px;">
      <?php if ($isComingSoon || $isOutOfStock): ?>
        <button type="button" class="btn btn--outline-dark btn--full" disabled>Hết hàng</button>
      <?php else: ?>
        <button type="button" class="btn btn--primary btn--full js-quick-add-cart" data-product-id="<?= $pid ?>" data-option-index="0">Thêm vào giỏ</button>
      <?php endif; ?>
      <a href="<?= App::e(App::url('?c=product&a=detail&id=' . $pid)) ?>" class="btn btn--outline-dark btn--full">Xem chi tiết</a>
    </div>
  </div>
</article>
