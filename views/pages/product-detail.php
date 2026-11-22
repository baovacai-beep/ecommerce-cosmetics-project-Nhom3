<?php
declare(strict_types=1);
?>
<main class="page-container">
  <nav class="breadcrumb" aria-label="Đường dẫn điều hướng">
    <ul class="breadcrumb__list">
      <li class="breadcrumb__item"><a href="<?= App::e(App::url('')) ?>">Trang chủ</a></li>
      <li class="breadcrumb__separator">/</li>
      <li class="breadcrumb__item"><a href="<?= App::e(App::url('?c=product&a=catalog')) ?>">Sản phẩm</a></li>
      <li class="breadcrumb__separator">/</li>
      <li class="breadcrumb__item active"><?= App::e($product ? $product['name'] : 'Không tìm thấy') ?></li>
    </ul>
  </nav>

  <?php if (!$product): ?>
    <div class="php-card" style="text-align:center;padding:56px 20px;background:#fff8ed;border:1.5px dashed #c88b52;">
      <h1 style="color:#70452b;margin-top:0;">Sản phẩm không tồn tại hoặc đã ngừng kinh doanh</h1>
      <p style="color:#7c5c46;max-width:520px;margin:0 auto 24px;">Mã sản phẩm bạn truy cập không hợp lệ hoặc mặt hàng đã được cập nhật khỏi danh mục hiện tại.</p>
      <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="btn btn--primary">Quay lại danh sách sản phẩm</a>
    </div>
  <?php else:
    $variants = $product['variants'] ?? [];
    $defVar = $variants[0] ?? ['price' => 0, 'old_price' => 0, 'stock_qty' => 0, 'short_label' => 'Tiêu chuẩn', 'option_index' => 0];
    $defPrice = (int) $defVar['price'];
    $defOld = (int) $defVar['old_price'];
    $defDiscPct = $defOld > $defPrice ? (int) round((($defOld - $defPrice) / max(1, $defOld)) * 100) : 0;
    $isComingSoon = $product['stock_status'] === 'coming_soon' || $product['stock_status'] === 'out_of_stock';
    $isWish = in_array((int) $product['id'], $wishlistIds ?? [], true);
    $unitLabel = (string) ($product['unit_label'] ?? 'gói');
    $myReviewIds = (session_status() === PHP_SESSION_ACTIVE) ? array_map('intval', (array) ($_SESSION['bakemate_my_reviews'] ?? [])) : [];
  ?>
    <article class="product-detail">
      <div class="product-detail__gallery">
        <div class="gallery__main-wrap">
          <?php if ($defDiscPct > 0): ?>
            <span class="badge badge--discount" id="badge-discount">-<?= $defDiscPct ?>%</span>
          <?php endif; ?>
          <span class="badge badge--authentic">Chính hãng</span>
          <img id="pd-main-img" src="<?= App::e(App::asset((string) $product['images'][0])) ?>" alt="<?= App::e($product['name']) ?>" class="gallery__main-img">
        </div>

        <div class="gallery__thumbs">
          <?php foreach ($product['images'] as $idx => $img): ?>
            <button type="button" class="thumb-btn js-pd-thumb <?= $idx === 0 ? 'active' : '' ?>" data-src="<?= App::e(App::asset((string) $img)) ?>" aria-label="Xem góc ảnh <?= $idx + 1 ?>">
              <img src="<?= App::e(App::asset((string) $img)) ?>" alt="Góc ảnh <?= $idx + 1 ?>">
            </button>
          <?php endforeach; ?>
        </div>
      </div>

      <div class="product-detail__info">
        <span class="product-detail__brand">Thương hiệu: <strong><?= App::e($product['brand_name']) ?></strong> | Xuất xứ: <?= App::e($product['origin']) ?></span>
        <div class="pd-title-row">
          <h1 class="product-detail__title"><?= App::e($product['name']) ?></h1>
          <button type="button" class="wishlist-heart-btn pd-title-wish-btn js-wishlist-toggle <?= $isWish ? 'is-active' : '' ?>" data-product-id="<?= (int) $product['id'] ?>" aria-label="<?= $isWish ? 'Bỏ yêu thích' : 'Thêm vào yêu thích' ?>" title="Yêu thích sản phẩm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="<?= $isWish ? 'currentColor' : 'none' ?>" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </button>
        </div>

        <div class="product-detail__meta">
          <span class="meta__rating">&#9733;&#9733;&#9733;&#9733;&#9733; <strong><?= App::e($product['rating_avg']) ?></strong> (<?= (int) $product['review_count'] + count($product['reviews']) ?> đánh giá)</span>
          <span class="meta__divider">|</span>
          <span class="meta__sold"><?= $isComingSoon ? 'Trạng thái: <strong>Hết hàng</strong>' : 'Đã bán <strong>' . App::e($product['sold_count_label']) . '</strong>' ?></span>
          <span class="meta__divider">|</span>
          <span class="meta__code">Mã: <strong>#BM-<?= str_pad((string) $product['id'], 3, '0', STR_PAD_LEFT) ?></strong></span>
          <span class="meta__divider">|</span>
          <span class="meta__category">Danh mục: <strong><?= App::e($product['category_name']) ?></strong></span>
          <span class="meta__divider">|</span>
          <span class="meta__stock <?= $isComingSoon ? '' : 'in-stock' ?>" id="pd-stock-pill">
            <?= $isComingSoon ? 'Hết hàng' : ('Còn ' . (int) $defVar['stock_qty'] . ' ' . App::e($unitLabel)) ?>
          </span>
        </div>

        <div class="price-box">
          <div class="price-box__row">
            <span class="price-box__current" id="pd-price"><?= App::e(App::formatCurrency($defPrice)) ?></span>
            <del class="price-box__original" id="pd-old-price" style="<?= $defOld > $defPrice ? '' : 'display:none;' ?>"><?= App::e(App::formatCurrency($defOld)) ?></del>
            <span class="price-box__tag" id="pd-save-tag" style="<?= $defOld > $defPrice ? '' : 'display:none;' ?>">Tiết kiệm <?= App::e(App::formatCurrency(max(0, $defOld - $defPrice))) ?></span>
          </div>
          <p class="price-box__note">Đơn giá đã bao gồm VAT. Đảm bảo nguyên liệu chuẩn mới &amp; đóng gói an toàn.</p>
        </div>

        <p class="product-detail__desc"><?= App::e($product['description']) ?></p>

        <div class="option-group">
          <label class="option-group__label">Quy cách đóng gói:</label>
          <div class="option-group__pills">
            <?php foreach ($variants as $v): ?>
              <label class="pill-radio">
                <input type="radio"
                       name="pd_variant"
                       class="js-variant-pill"
                       value="<?= (int) $v['option_index'] ?>"
                       data-option-index="<?= (int) $v['option_index'] ?>"
                       data-price="<?= (int) $v['price'] ?>"
                       data-old-price="<?= (int) $v['old_price'] ?>"
                       data-stock="<?= (int) $v['stock_qty'] ?>"
                       <?= (int) $v['option_index'] === 0 ? 'checked' : '' ?>>
                <span class="pill-radio__btn"><?= App::e($v['short_label']) ?></span>
              </label>
            <?php endforeach; ?>
          </div>
        </div>

        <?php if (!$isComingSoon && (int) $defVar['stock_qty'] > 0): ?>
          <div class="quantity-group">
            <label class="quantity-group__label" for="pd-qty-input">Số lượng:</label>
            <div class="quantity-group__control">
              <button type="button" class="qty-btn" id="pd-qty-minus" aria-label="Giảm số lượng">−</button>
              <input type="number" id="pd-qty-input" class="qty-input" value="1" min="1" max="99">
              <button type="button" class="qty-btn" id="pd-qty-plus" aria-label="Tăng số lượng">+</button>
            </div>
            <span class="quantity-group__hint" id="pd-stock-hint">Kho còn <?= (int) $defVar['stock_qty'] ?> <?= App::e($unitLabel) ?></span>
          </div>

          <div class="product-detail__actions">
            <button type="button" class="btn btn--cart" id="pd-btn-add" data-product-id="<?= (int) $product['id'] ?>">Thêm vào giỏ hàng</button>
            <button type="button" class="btn btn--buy" id="pd-btn-buy" data-product-id="<?= (int) $product['id'] ?>">Mua ngay</button>
          </div>
        <?php else: ?>
          <div class="product-detail__actions">
            <button type="button" class="btn btn--outline-dark btn--full" disabled>Hết hàng</button>
          </div>
        <?php endif; ?>

        <div class="policy-box">
          <div class="policy-item">
            <span class="policy-item__text">Giao hàng hỏa tốc nội thành TP.HCM trong 2 giờ</span>
          </div>
          <div class="policy-item">
            <span class="policy-item__text">Đổi trả miễn phí trong 48h nếu bao bì ẩm rách hoặc sai quy cách</span>
          </div>
        </div>

        <?php if (!empty($product['is_perishable'])): ?>
          <div id="pd-perishable-notice" class="checkout-perishable-alert" style="margin-top:12px;margin-bottom:0;">
            <strong>Hàng bảo quản lạnh / tươi sống:</strong> Sản phẩm chỉ hỗ trợ <strong>Hỏa tốc (2h)</strong> hoặc <strong>Lấy tại cửa hàng</strong> trong nội thành TP.HCM để giữ trọn độ tươi ngon.
          </div>
        <?php endif; ?>
      </div>
    </article>

    <section class="product-specs-section">
      <h2 class="section-heading">Thông số kỹ thuật &amp; Hướng dẫn bảo quản</h2>
      <div class="specs-table-wrap">
        <table class="specs-table">
          <tbody>
            <tr>
              <th>Chuẩn bảo quản</th>
              <td><?= App::e($product['storage_requirement']) ?></td>
            </tr>
            <?php foreach ($product['specs'] as $sp): ?>
              <tr>
                <th><?= App::e($sp['spec_key']) ?></th>
                <td><?= App::e($sp['spec_value']) ?></td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </section>

    <section class="reviews-section" id="product-reviews-section">
      <h2 class="section-heading" style="text-align:left;margin-bottom:14px;">Đánh giá sản phẩm</h2>
      <form id="pd-review-form" enctype="multipart/form-data" class="php-card" style="display:grid;gap:12px;background:#fff8ed;margin-bottom:18px;">
        <input type="hidden" name="product_id" value="<?= (int) $product['id'] ?>">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;align-items:end;">
          <div>
            <label for="rev-name" class="form-label">Tên của bạn *</label>
            <input id="rev-name" name="reviewer_name" type="text" class="form-input" value="<?= App::e($currentUser['full_name'] ?? '') ?>" required>
          </div>
          <div>
            <label class="form-label" for="rev-rating-slider">Đánh giá sao (<strong id="rev-rating-readout">5.0</strong> / 5.0 sao) *</label>
            <input type="hidden" id="rev-rating" name="rating" value="5.0">
            <div class="bm-star-picker-wrap">
              <div class="bm-star-picker" id="bm-star-picker" role="slider" aria-label="Chọn số sao từ 0.5 đến 5.0" aria-valuemin="0.5" aria-valuemax="5" aria-valuenow="5" tabindex="0">
                <div class="bm-star-picker__bg" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <div class="bm-star-picker__fill" id="bm-star-fill" style="width:100%;" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              </div>
              <input type="range" id="rev-rating-slider" min="0.5" max="5" step="0.5" value="5" class="bm-star-range" aria-label="Thanh kéo chọn 0.5 đến 5 sao">
            </div>
          </div>
        </div>
        <div>
          <label for="rev-comment" class="form-label">Nhận xét thực tế *</label>
          <textarea id="rev-comment" name="comment" class="form-input" rows="3" placeholder="Chia sẻ cảm nhận..." required></textarea>
        </div>
        <div>
          <label for="rev-img" class="form-label">Ảnh thành phẩm (JPG/PNG/WEBP tối đa 3MB, không bắt buộc)</label>
          <input id="rev-img" name="review_image" type="file" accept="image/jpeg,image/png,image/webp" class="form-input">
        </div>
        <div>
          <button type="submit" class="btn btn--primary">Gửi đánh giá</button>
        </div>
      </form>

      <div style="display:grid;gap:12px;">
        <?php if (empty($product['reviews'])): ?>
          <p style="color:#7c5c46;font-size:14px;">Chưa có bình luận mới — hãy là người đầu tiên chia sẻ thành phẩm!</p>
        <?php else: ?>
          <?php foreach ($product['reviews'] as $rv):
            $rvId = (int) $rv['id'];
            $rvRating = number_format((float) $rv['rating'], 1);
            $canEdit = ($currentUser && (int) ($rv['user_id'] ?? 0) === (int) $currentUser['id']) || in_array($rvId, $myReviewIds, true);
          ?>
            <div class="php-card pd-review-item" data-review-id="<?= $rvId ?>" style="padding:14px;">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;font-size:13px;color:#7c5c46;">
                <strong style="color:#70452b;"><?= App::e($rv['reviewer_name']) ?> · <span class="js-rv-rating"><?= App::e($rvRating) ?></span>/5.0 sao</strong>
                <div style="display:flex;align-items:center;gap:10px;">
                  <span><?= App::e($rv['created_at']) ?></span>
                  <?php if ($canEdit): ?>
                    <button type="button" class="btn btn--outline btn--sm js-rv-edit" data-id="<?= $rvId ?>" data-rating="<?= App::e($rvRating) ?>" data-comment="<?= App::e($rv['comment']) ?>">Sửa</button>
                    <button type="button" class="btn btn--outline btn--sm js-rv-delete" data-id="<?= $rvId ?>" style="color:#b91c1c;border-color:#fca5a5;">Xóa</button>
                  <?php endif; ?>
                </div>
              </div>
              <p class="js-rv-comment" style="margin:6px 0 0;color:#4a2d1b;font-size:14px;"><?= App::e($rv['comment']) ?></p>
              <?php if (!empty($rv['image_path'])): ?>
                <img src="<?= App::e(App::asset((string) $rv['image_path'])) ?>" alt="Ảnh đánh giá" style="margin-top:8px;max-width:140px;border-radius:8px;">
              <?php endif; ?>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
    </section>

    <?php if (!empty($product['related_recipes'])): ?>
      <section class="recipe-crosslink-section">
        <div class="section-header-flex">
          <div>
            <h2 class="section-heading">Sản phẩm này dùng cho công thức nào?</h2>
            <p class="section-desc">Khám phá các công thức làm bánh chuẩn vị và tự động gom trọn bộ nguyên liệu cần mua chỉ với 1 click:</p>
          </div>
          <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="link-more">Xem tất cả công thức &rarr;</a>
        </div>
        <div class="recipe-grid">
          <?php foreach ($product['related_recipes'] as $rr): ?>
            <a href="<?= App::e(App::url('?c=recipe&a=detail&id=' . urlencode($rr['slug']))) ?>" class="recipe-card" style="text-decoration:none;">
              <img src="<?= App::e(App::asset($rr['image_path'])) ?>" alt="" class="recipe-card__img">
              <div class="recipe-card__body">
                <span class="recipe-card__meta"><?= App::e($rr['time_label']) ?> · <?= App::e($rr['difficulty']) ?></span>
                <h3 class="recipe-card__title"><?= App::e($rr['title']) ?></h3>
              </div>
            </a>
          <?php endforeach; ?>
        </div>
      </section>
    <?php endif; ?>

    <?php if (!empty($product['related_products'])): ?>
      <section class="related-products-section">
        <h2 class="section-heading">Thường được mua cùng</h2>
        <div class="product-grid">
          <?php foreach ($product['related_products'] as $p): ?>
            <?php require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'partials' . DIRECTORY_SEPARATOR . 'product-card.php'; ?>
          <?php endforeach; ?>
        </div>
      </section>
    <?php endif; ?>

    <?php if (!empty($recentProducts)): ?>
      <section class="recent-viewed-section" id="pd-recent-viewed-section">
        <div class="home-section-head">
          <div>
            <h2 class="home-section-head__title">Sản phẩm đã xem gần đây</h2>
          </div>
        </div>
        <div class="recent-viewed-grid">
          <?php foreach ($recentProducts as $p): ?>
            <?php require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'partials' . DIRECTORY_SEPARATOR . 'product-card.php'; ?>
          <?php endforeach; ?>
        </div>
      </section>
    <?php endif; ?>
  <?php endif; ?>
</main>

<script>
document.addEventListener("DOMContentLoaded", function () {
  const mainImg = document.getElementById("pd-main-img");
  document.querySelectorAll(".js-pd-thumb").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (mainImg) mainImg.src = btn.getAttribute("data-src") || "";
      document.querySelectorAll(".js-pd-thumb").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  let selectedOpt = 0;
  let maxStock = 99;
  const priceEl = document.getElementById("pd-price");
  const oldEl = document.getElementById("pd-old-price");
  const saveEl = document.getElementById("pd-save-tag");
  const stockEl = document.getElementById("pd-stock-pill");
  const hintEl = document.getElementById("pd-stock-hint");

  document.querySelectorAll(".js-variant-pill").forEach((pill) => {
    pill.addEventListener("change", () => {
      selectedOpt = Number(pill.getAttribute("data-option-index") || 0);
      const pr = Number(pill.getAttribute("data-price") || 0);
      const oldPr = Number(pill.getAttribute("data-old-price") || pr);
      maxStock = Number(pill.getAttribute("data-stock") || 0);
      if (priceEl) priceEl.textContent = window.BakeApp.formatPrice(pr);
      if (oldEl) {
        oldEl.textContent = window.BakeApp.formatPrice(oldPr);
        oldEl.style.display = oldPr > pr ? "inline" : "none";
      }
      if (saveEl) {
        saveEl.textContent = "Tiết kiệm " + window.BakeApp.formatPrice(Math.max(0, oldPr - pr));
        saveEl.style.display = oldPr > pr ? "inline-block" : "none";
      }
      if (stockEl) stockEl.textContent = "Còn " + maxStock + " " + <?= json_encode($unitLabel ?? 'gói') ?>;
      if (hintEl) hintEl.textContent = "Kho còn " + maxStock + " " + <?= json_encode($unitLabel ?? 'gói') ?>;
    });
  });

  // Thanh chọn sao mượt từng nấc 0.5 sao (Shopee style)
  const starPicker = document.getElementById("bm-star-picker");
  const starFill = document.getElementById("bm-star-fill");
  const starHidden = document.getElementById("rev-rating");
  const starReadout = document.getElementById("rev-rating-readout");
  const starSlider = document.getElementById("rev-rating-slider");
  let committedRating = 5.0;
  let isDraggingStars = false;

  function applyStarVisual(val) {
    const snapped = Math.max(0.5, Math.min(5.0, Math.round(Number(val) * 2) / 2));
    if (starFill) starFill.style.width = ((snapped / 5) * 100) + "%";
    if (starReadout) starReadout.textContent = snapped.toFixed(1);
    if (starSlider) starSlider.value = String(snapped);
    if (starPicker) starPicker.setAttribute("aria-valuenow", String(snapped));
    return snapped;
  }

  function calcRatingFromPointer(clientX) {
    if (!starPicker) return committedRating;
    const rect = starPicker.getBoundingClientRect();
    const ratio = Math.max(0.05, Math.min(1, (clientX - rect.left) / Math.max(1, rect.width)));
    return Math.max(0.5, Math.min(5.0, Math.ceil(ratio * 10) / 2));
  }

  if (starPicker) {
    starPicker.addEventListener("pointerdown", (e) => {
      isDraggingStars = true;
      committedRating = applyStarVisual(calcRatingFromPointer(e.clientX));
      if (starHidden) starHidden.value = String(committedRating);
    });
    starPicker.addEventListener("pointermove", (e) => {
      const hoverVal = calcRatingFromPointer(e.clientX);
      applyStarVisual(hoverVal);
      if (isDraggingStars) {
        committedRating = hoverVal;
        if (starHidden) starHidden.value = String(committedRating);
      }
    });
    starPicker.addEventListener("pointerleave", () => {
      isDraggingStars = false;
      applyStarVisual(committedRating);
    });
    window.addEventListener("pointerup", () => { isDraggingStars = false; });
  }
  if (starSlider) {
    starSlider.addEventListener("input", () => {
      committedRating = applyStarVisual(Number(starSlider.value));
      if (starHidden) starHidden.value = String(committedRating);
    });
  }

  document.querySelectorAll(".js-rv-edit").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const reviewId = Number(btn.dataset.id);
      const oldComment = btn.dataset.comment || "";
      const oldRating = btn.dataset.rating || "5.0";
      const nextComment = window.prompt("Cập nhật nhận xét của bạn:", oldComment);
      if (nextComment === null) return;
      const nextRatingRaw = window.prompt("Số sao (0.5 đến 5.0, bội số 0.5):", oldRating);
      if (nextRatingRaw === null) return;
      try {
        const res = await window.BakeApp.postJson("product", "ajaxUpdateReview", {
          review_id: reviewId,
          rating: Number(nextRatingRaw) || 5.0,
          comment: nextComment.trim()
        });
        window.BakeApp.showToast(res.message, "success");
        window.location.reload();
      } catch (err) {
        window.BakeApp.showToast(err.message, "error");
      }
    });
  });

  document.querySelectorAll(".js-rv-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const reviewId = Number(btn.dataset.id);
      const ok = await window.BakeApp.showConfirm("Bạn chắc chắn muốn xóa đánh giá này?", "Xóa đánh giá");
      if (!ok) return;
      try {
        const res = await window.BakeApp.postJson("product", "ajaxDeleteReview", { review_id: reviewId });
        window.BakeApp.showToast(res.message, "success");
        window.location.reload();
      } catch (err) {
        window.BakeApp.showToast(err.message, "error");
      }
    });
  });

  const qtyInput = document.getElementById("pd-qty-input");
  const clampQty = () => {
    if (!qtyInput) return 1;
    let q = parseInt(qtyInput.value, 10) || 1;
    q = Math.max(1, Math.min(99, maxStock > 0 ? maxStock : 99, q));
    qtyInput.value = q;
    return q;
  };
  document.getElementById("pd-qty-minus")?.addEventListener("click", () => { qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1); clampQty(); });
  document.getElementById("pd-qty-plus")?.addEventListener("click", () => { qtyInput.value = (parseInt(qtyInput.value, 10) || 1) + 1; clampQty(); });

  async function addAndMaybeGo(goCart) {
    const pid = Number((document.getElementById("pd-btn-add") || document.getElementById("pd-btn-buy")).dataset.productId);
    try {
      const res = await window.BakeApp.postJson("order", "ajaxCartAdd", { product_id: pid, option_index: selectedOpt, quantity: clampQty() });
      window.BakeApp.updateBadges(res.data.cart_count);
      window.BakeApp.showToast(res.message, "success");
      if (goCart) window.location.href = window.BakeApp.apiUrl("order", "cart");
    } catch (err) { window.BakeApp.showToast(err.message, "error"); }
  }
  document.getElementById("pd-btn-add")?.addEventListener("click", () => addAndMaybeGo(false));
  document.getElementById("pd-btn-buy")?.addEventListener("click", () => addAndMaybeGo(true));

  document.getElementById("pd-review-form")?.addEventListener("submit", async function (e) {
    e.preventDefault();
    try {
      const res = await window.BakeApp.postForm("product", "ajaxSubmitReview", new FormData(this));
      window.BakeApp.showToast(res.message, "success");
      window.location.reload();
    } catch (err) { window.BakeApp.showToast(err.message, "error"); }
  });
});
</script>
