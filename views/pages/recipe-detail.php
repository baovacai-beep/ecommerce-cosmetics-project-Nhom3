<?php
declare(strict_types=1);
?>
<main class="page-container">
  <?php if (!$recipe): ?>
    <div class="no-products-message">
      <strong>Không tìm thấy công thức bạn yêu cầu</strong>
      <p>Mã công thức không hợp lệ hoặc đã được cập nhật.</p>
      <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="btn btn--primary" style="margin-top:10px;">Xem tất cả công thức</a>
    </div>
  <?php else: ?>
    <nav class="breadcrumb" aria-label="Đường dẫn điều hướng">
      <ul class="breadcrumb__list">
        <li class="breadcrumb__item"><a href="<?= App::e(App::url('')) ?>">Trang chủ</a></li>
        <li class="breadcrumb__separator">/</li>
        <li class="breadcrumb__item"><a href="<?= App::e(App::url('?c=recipe&a=index')) ?>">Công thức</a></li>
        <li class="breadcrumb__separator">/</li>
        <li class="breadcrumb__item active"><?= App::e($recipe['title']) ?></li>
      </ul>
    </nav>

    <!-- 1. Hero Công thức (đồng bộ .recipe-detail-hero bản HTML) -->
    <section class="recipe-detail-hero">
      <div>
        <h1 class="recipe-detail-hero__title"><?= App::e($recipe['title']) ?></h1>
        <p class="recipe-detail-hero__desc"><?= App::e($recipe['subtitle']) ?></p>
        <div class="recipe-detail-meta-stack" style="font-size:13.5px;color:#7c5c46;margin-bottom:18px;display:grid;gap:6px;line-height:1.5;">
          <div>Thời gian: <strong style="color:#4a2e19;"><?= App::e($recipe['time_label']) ?></strong></div>
          <div>Độ khó: <strong style="color:#4a2e19;"><?= App::e($recipe['difficulty']) ?></strong></div>
          <div>Thành phẩm: <strong style="color:#4a2e19;"><?= App::e($recipe['yield_label'] ?? ((int) $recipe['default_servings'] . ' ' . $recipe['servings_unit'])) ?></strong></div>
          <div>Đánh giá: <strong style="color:#4a2e19;">&#9733; <?= App::e($recipe['rating_avg']) ?></strong></div>
        </div>
        <div class="recipe-detail-hero__actions">
          <button type="button" id="btn-recipe-share" class="btn btn--outline-dark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            <span>Chia sẻ</span>
          </button>
          <a href="#recipe-calc-section" class="btn btn--primary">Quy đổi &amp; Chọn nguyên liệu</a>
        </div>
      </div>
      <div class="recipe-detail-hero__media">
        <img src="<?= App::e(App::asset($recipe['image_path'])) ?>" alt="<?= App::e($recipe['title']) ?>">
      </div>
    </section>

    <!-- 2. Quy đổi khẩu phần & Bảng tổng số tiền ở cột phải phía trên -->
    <section id="recipe-calc-section" class="recipe-calc-section" aria-label="Quy đổi nguyên liệu và thêm vào giỏ hàng">
      <h2 class="section-heading" style="text-align:left;margin-bottom:4px;">Nguyên liệu &amp; giỏ đồ làm bánh</h2>
      <p style="font-size:14px;color:var(--accent-sub);margin:0;">Điều chỉnh số khẩu phần để BakeMate tự động quy đổi định lượng và số lượng đóng gói phù hợp.</p>

      <div class="recipe-calc-layout">
        <!-- Cột trái: Bảng quy đổi nguyên liệu -->
        <div class="recipe-ingredients-card">
          <div class="recipe-servings-bar">
            <div>
              <strong style="color:#4a2e19;font-size:15px;"><?= App::e($recipe['servings_unit']) ?>:</strong>
            </div>
            <div class="recipe-servings-stepper" role="group" aria-label="Điều chỉnh khẩu phần">
              <button type="button" id="btn-servings-minus" aria-label="Giảm">&minus;</button>
              <input id="recipe-servings-input" type="number" min="1" max="50" step="1" inputmode="numeric" value="<?= (int) $recipe['current_servings'] ?>" aria-label="Số khẩu phần" style="width:42px;border:none;text-align:center;font-weight:700;color:#4a2e19;background:transparent;">
              <button type="button" id="btn-servings-plus" aria-label="Tăng">+</button>
            </div>
          </div>

          <div id="recipe-ingredients-list">
            <?php foreach ($recipe['ingredients'] as $ing):
              $hasProduct = !empty($ing['purchase_available']) && !empty($ing['product_id']) && !empty($ing['product']) && !empty($ing['variant']);
              $checked = $hasProduct && empty($ing['in_pantry']);
              $ingStockQty = (int) ($ing['stock_qty'] ?? ($ing['variant']['stock_qty'] ?? 0));
            ?>
              <div class="recipe-ingredient-row">
                <div class="recipe-ingredient-row__left">
                  <?php if ($hasProduct): ?>
                    <input type="checkbox" class="js-combo-ing-check"
                           data-key="<?= App::e($ing['key']) ?>"
                           data-product-id="<?= (int) $ing['product_id'] ?>"
                           data-option-index="<?= (int) $ing['option_index'] ?>"
                           data-qty="<?= (int) $ing['packs_needed'] ?>"
                           data-price="<?= (int) $ing['variant']['price'] ?>"
                           <?= $checked ? 'checked' : '' ?>
                           aria-label="Chọn <?= App::e($ing['name']) ?>">
                  <?php else: ?>
                    <span style="display:inline-flex;width:17px;justify-content:center;color:#9a7b64;font-weight:700;">&mdash;</span>
                  <?php endif; ?>
                  <div>
                    <strong><?= App::e($ing['name']) ?></strong>
                    <span class="recipe-ingredient-row__qty">
                      Cần dùng: <span class="js-ing-amount" data-base="<?= (float) $ing['base_amount'] ?>"><?= App::e($ing['scaled_amount']) ?></span> <?= App::e($ing['unit']) ?>
                    </span>
                    <?php if ($hasProduct): ?>
                      <label style="display:inline-flex;align-items:center;gap:4px;margin-left:8px;font-size:12px;color:#7c5c46;cursor:pointer;">
                        <input type="checkbox" class="js-pantry-toggle" data-recipe-id="<?= (int) $recipe['id'] ?>" data-key="<?= App::e($ing['key']) ?>" <?= !empty($ing['in_pantry']) ? 'checked' : '' ?>>
                        <span>Đã có ở bếp</span>
                      </label>
                    <?php endif; ?>
                  </div>
                </div>
                <div class="recipe-ingredient-row__right">
                  <?php if ($hasProduct): ?>
                    <a href="<?= App::e(App::url('?c=product&a=detail&id=' . (int) $ing['product_id'])) ?>" class="recipe-ingredient-row__match"><?= App::e($ing['product']['name']) ?></a>
                    <div style="font-size:12px;color:#7c5c46;">
                      <?= (int) $ing['packs_needed'] ?> &times; <?= App::e($ing['variant']['short_label']) ?> =
                      <strong style="color:var(--accent-cta);"><?= App::e(App::formatCurrency((int) $ing['variant']['price'] * (int) $ing['packs_needed'])) ?></strong>
                    </div>
                    <div style="margin-top:3px;">
                      <span style="display:inline-block;padding:1px 7px;border-radius:999px;background:#ecfdf5;color:#15803d;font-size:11px;font-weight:700;">Còn hàng (Kho: <?= $ingStockQty ?>)</span>
                    </div>
                  <?php else: ?>
                    <span class="recipe-ingredient-row__unmatched"><?= App::e($ing['availability_note'] ?: ($ing['note'] ?: 'Chưa có sản phẩm phù hợp')) ?></span>
                  <?php endif; ?>
                </div>
              </div>
            <?php endforeach; ?>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:12px;padding-top:10px;border-top:1px dashed #eadbc6;">
            <span style="font-size:12px;color:#7c5c46;">Bỏ chọn nguyên liệu đã có sẵn — BakeMate sẽ tự động ghi nhớ cho bếp của bạn.</span>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button type="button" id="btn-select-all-ing" class="btn btn--outline-dark" style="padding:4px 10px;font-size:12px;">Chọn tất cả</button>
              <button type="button" id="btn-unselect-all-ing" class="btn btn--outline-dark" style="padding:4px 10px;font-size:12px;">Bỏ chọn tất cả</button>
            </div>
          </div>
        </div>

        <!-- Cột phải phía trên: Bảng tổng số tiền & thêm combo vào giỏ (giống ảnh HTML) -->
        <aside id="recipe-top-summary-card" class="recipe-cart-summary-card" style="position:sticky;top:86px;" aria-label="Tổng hợp giỏ hàng công thức">
          <h3>Tổng hợp nguyên liệu &amp; dụng cụ</h3>
          <p class="recipe-cart-summary-card__sub">Tích chọn nguyên liệu và dụng cụ còn thiếu để tự động cộng tổng tiền bên dưới.</p>

          <div class="recipe-cart-summary-card__stat">
            <span><?= App::e($recipe['servings_unit']) ?>:</span>
            <strong id="recipe-top-servings"><?= (int) $recipe['current_servings'] ?> <?= App::e($recipe['servings_unit']) ?></strong>
          </div>
          <div class="recipe-cart-summary-card__stat">
            <span>Số món đã chọn:</span>
            <strong id="recipe-top-count">0 món</strong>
          </div>
          <div class="recipe-cart-summary-card__stat">
            <span>Tiền nguyên liệu:</span>
            <strong id="recipe-top-ing-cost"><?= App::e(App::formatCurrency((int) $recipe['estimated_ingredients_cost'])) ?></strong>
          </div>
          <div class="recipe-cart-summary-card__stat">
            <span>Tiền dụng cụ còn thiếu:</span>
            <strong id="recipe-top-tool-cost"><?= App::e(App::formatCurrency((int) $recipe['estimated_tools_cost'])) ?></strong>
          </div>

          <div class="recipe-cart-summary-card__total" style="border-top:1px dashed #d9c2a6;padding-top:10px;margin-top:6px;display:flex;justify-content:space-between;align-items:center;">
            <span>Tổng số tiền:</span>
            <strong id="recipe-top-total"><?= App::e(App::formatCurrency((int) $recipe['estimated_ingredients_cost'] + (int) $recipe['estimated_tools_cost'])) ?></strong>
          </div>

          <div class="recipe-cart-summary-card__btns">
            <button type="button" id="btn-add-recipe-combo-top" class="btn btn--primary js-add-recipe-combo-trigger" data-recipe-slug="<?= App::e($recipe['slug']) ?>">
              Thêm nguyên liệu &amp; dụng cụ đã chọn
            </button>
            <button type="button" id="btn-add-all-combo" class="btn btn--outline-dark">
              Thêm tất cả nguyên liệu &amp; dụng cụ
            </button>
          </div>

          <p style="font-size:12.5px;color:#7c5c46;margin-top:14px;line-height:1.5;text-align:center;">
            Sản phẩm sẽ được nhóm theo công thức trong giỏ hàng
          </p>
          <a href="<?= App::e(App::url('?c=order&a=cart')) ?>" class="recipe-view-cart-link" style="display:block;text-align:center;margin-top:10px;font-size:16px;font-weight:800;color:var(--primary-color);text-decoration:underline;">
            Xem giỏ hàng &rarr;
          </a>
        </aside>
      </div>
    </section>

    <!-- 3. Dụng cụ cần chuẩn bị (Lưới 3 cột giống HTML + checkbox cộng tổng tiền vào bảng trên + nút + Thêm) -->
    <section style="margin-bottom:32px;" aria-label="Dụng cụ cần chuẩn bị">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:6px;">
        <div>
          <h2 class="section-heading" style="text-align:left;margin-bottom:4px;">Dụng cụ cần chuẩn bị (chọn món còn thiếu)</h2>
          <p style="font-size:13.5px;color:var(--accent-sub);margin:0;">Tích chọn các dụng cụ bạn còn thiếu để tính vào tổng số tiền ở trên hoặc thêm lẻ vào giỏ.</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" id="btn-select-all-tools" class="btn btn--outline-dark" style="padding:6px 12px;font-size:12.5px;">Chọn tất cả dụng cụ</button>
          <button type="button" id="btn-unselect-all-tools" class="btn btn--outline-dark" style="padding:6px 12px;font-size:12.5px;">Bỏ chọn tất cả</button>
        </div>
      </div>

      <div class="recipe-tools-grid">
        <?php foreach ($recipe['tools'] as $tl):
          $toolImg = !empty($tl['product']['primary_image']) ? (string) $tl['product']['primary_image'] : (string) $recipe['image_path'];
          $toolStockQty = (int) ($tl['stock_qty'] ?? 0);
          $toolInStock = !empty($tl['purchase_available']) && !empty($tl['variant']) && $toolStockQty > 0;
        ?>
          <div class="recipe-tool-card recipe-tool-card--with-action">
            <div class="recipe-tool-card__left">
              <?php if ($toolInStock): ?>
                <input type="checkbox"
                       class="js-combo-tool-check"
                       data-product-id="<?= (int) $tl['product_id'] ?>"
                       data-option-index="<?= (int) $tl['option_index'] ?>"
                       data-qty="1"
                       data-price="<?= (int) $tl['variant']['price'] ?>"
                       checked
                       aria-label="Chọn dụng cụ <?= App::e($tl['name']) ?>"
                       style="width:17px;height:17px;accent-color:var(--primary-color);flex-shrink:0;cursor:pointer;">
              <?php else: ?>
                <input type="checkbox" disabled aria-label="Dụng cụ hiện hết hàng" style="width:17px;height:17px;flex-shrink:0;">
              <?php endif; ?>
              <img src="<?= App::e(App::asset($toolImg)) ?>" alt="<?= App::e($tl['name']) ?>" loading="lazy" class="recipe-tool-card__thumb">
              <div class="recipe-tool-card__info">
                <?php if (!empty($tl['product_id'])): ?>
                  <a href="<?= App::e(App::url('?c=product&a=detail&id=' . (int) $tl['product_id'])) ?>" class="recipe-tool-card__name"><?= App::e($tl['name']) ?></a>
                <?php else: ?>
                  <strong class="recipe-tool-card__name"><?= App::e($tl['name']) ?></strong>
                <?php endif; ?>
                <p class="recipe-tool-card__desc"><?= App::e($tl['description']) ?></p>
              </div>
            </div>
            <div class="recipe-tool-card__footer">
              <?php if ($toolInStock): ?>
                <div class="recipe-tool-card__price-row">
                  <strong class="recipe-tool-card__price"><?= App::e(App::formatCurrency((int) $tl['variant']['price'])) ?></strong>
                  <span class="recipe-tool-card__stock-pill">Còn hàng (Kho: <?= $toolStockQty ?>)</span>
                </div>
                <button
                  type="button"
                  class="btn btn--outline-dark js-add-single-tool recipe-tool-card__add-btn"
                  data-product-id="<?= (int) $tl['product_id'] ?>"
                  data-option-index="<?= (int) $tl['option_index'] ?>"
                >
                  + Thêm vào giỏ
                </button>
              <?php else: ?>
                <div class="recipe-tool-card__price-row">
                  <span class="recipe-tool-card__stock-pill is-out"><?= App::e($tl['availability_note'] ?: 'Hết hàng') ?></span>
                </div>
                <span style="font-size:12px;color:#8b1e24;font-weight:600;white-space:nowrap;">Hết hàng</span>
              <?php endif; ?>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </section>

    <!-- 4. Cách làm từng bước + Đồng hồ nướng bánh -->
    <section style="margin-bottom:28px;" aria-label="Các bước thực hiện">
      <h2 class="section-heading" style="text-align:left;margin-bottom:10px;">Cách làm - Từng bước thật dễ dàng</h2>

      <div class="recipe-progress-card" id="recipe-progress-card">
        <div class="recipe-progress-head">
          <span>Tiến độ vào bếp của bạn</span>
          <span id="recipe-progress-text">0/<?= count($recipe['steps']) ?> bước (0%)</span>
        </div>
        <div class="recipe-progress-bar" role="progressbar" aria-label="Tiến độ thực hiện công thức" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="recipe-progress-bar">
          <div class="recipe-progress-bar__fill" id="recipe-progress-fill" style="width:0%;"></div>
        </div>
        <div id="recipe-complete-callout" class="recipe-complete-callout" hidden>
          <div>
            <strong>🎉 Chúc mừng bạn đã hoàn thành món bánh <?= App::e($recipe['title']) ?>!</strong>
            <p>Bạn có muốn chia sẻ trải nghiệm làm bánh của mình không?</p>
          </div>
          <button type="button" id="btn-scroll-to-review" class="btn btn--primary" style="white-space:nowrap;">
            &darr; Chia sẻ cảm nhận ngay
          </button>
        </div>
      </div>

      <div class="baking-timer-card" aria-label="Đồng hồ đếm ngược làm bánh">
        <div>
          <strong style="display:block;font-size:15px;color:#4a2e19;">Đồng hồ hẹn giờ nướng / ủ bánh</strong>
          <div class="baking-timer__inputs" style="display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap;">
            <label style="font-size:12.5px;color:#5c402d;display:inline-flex;align-items:center;gap:5px;">
              Phút:
              <input type="number" id="timer-custom-min" class="form-input" min="0" max="180" value="<?= (int) $recipe['bake_minutes'] ?>" style="width:68px;padding:5px 8px;text-align:center;">
            </label>
            <label style="font-size:12.5px;color:#5c402d;display:inline-flex;align-items:center;gap:5px;">
              Giây:
              <input type="number" id="timer-custom-sec" class="form-input" min="0" max="59" value="0" style="width:64px;padding:5px 8px;text-align:center;">
            </label>
          </div>
        </div>
        <div class="baking-timer__clock" id="baking-timer-display" aria-live="polite">
          <?= str_pad((string) $recipe['bake_minutes'], 2, '0', STR_PAD_LEFT) ?>:00
        </div>
        <div class="baking-timer__actions">
          <button type="button" id="timer-start" class="btn btn--primary" style="padding:7px 14px;font-size:12.5px;">Bắt đầu</button>
          <button type="button" id="timer-pause" class="btn btn--outline-dark" style="padding:7px 12px;font-size:12.5px;">Tạm dừng</button>
          <button type="button" id="timer-reset" class="btn btn--outline-dark" style="padding:7px 12px;font-size:12.5px;">Đặt lại</button>
        </div>
      </div>

      <div class="recipe-steps-list" id="recipe-steps-list">
        <?php foreach ($recipe['steps'] as $sIdx => $stepText): ?>
          <article class="recipe-step-card">
            <div class="recipe-step-card__top">
              <span class="recipe-step-card__num"><?= str_pad((string) ($sIdx + 1), 2, '0', STR_PAD_LEFT) ?></span>
              <label class="recipe-step-card__check">
                <input type="checkbox" class="js-recipe-step-check" data-step="<?= $sIdx ?>">
                <span class="js-step-label">Đánh dấu xong</span>
              </label>
            </div>
            <p style="font-size:14.5px;color:#4a2e19;line-height:1.6;margin:0;"><?= App::e($stepText) ?></p>
          </article>
        <?php endforeach; ?>
      </div>
    </section>

    <!-- 5. Lưu ý thành công -->
    <?php if (!empty($recipe['tips'])): ?>
      <section class="recipe-tips-box" aria-label="Lưu ý cho mẻ bánh trọn vẹn">
        <h2>Một chút lưu ý cho mẻ bánh trọn vẹn</h2>
        <ul>
          <?php foreach ($recipe['tips'] as $tip): ?>
            <li><?= App::e($tip) ?></li>
          <?php endforeach; ?>
        </ul>
      </section>
    <?php endif; ?>

    <!-- 6. Căn bếp của bạn, câu chuyện của bạn -->
    <section class="reviews-section" id="recipe-reviews-section" aria-label="Đánh giá công thức từ cộng đồng">
      <h2 class="section-heading" style="text-align:left;margin-bottom:14px;">Căn bếp của bạn, câu chuyện của bạn</h2>
      <p style="margin:0 0 12px;color:#7c5c46;font-size:14px;">Chia sẻ cảm nhận sau khi thực hiện công thức <strong><?= App::e($recipe['title']) ?></strong> cùng cộng đồng BakeMate.</p>
      <form id="php-recipe-share-form" class="review-form-box" style="max-width:640px;">
        <textarea id="php-recipe-share-text" class="form-textarea" rows="3" placeholder="Bạn đã làm món này theo tỷ lệ quy đổi như thế nào?" required style="margin-bottom:10px;"></textarea>
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
          <button type="submit" class="btn btn--primary" style="padding:8px 16px;font-size:13.5px;">Gửi chia sẻ trải nghiệm</button>
          <span id="php-recipe-share-msg" style="font-size:13px;color:#15803d;font-weight:600;" hidden></span>
        </div>
      </form>
    </section>

    <!-- 7. Thêm cảm hứng cho lần vào bếp tiếp theo (Poster cards đồng bộ HTML) -->
    <?php if (!empty($relatedRecipes)): ?>
      <section style="margin-top:34px;" aria-label="Công thức gợi ý tiếp theo">
        <h2 class="section-heading" style="text-align:left;margin-bottom:16px;">Thêm cảm hứng cho lần vào bếp tiếp theo</h2>
        <div class="recipes-editorial-grid">
          <?php foreach ($relatedRecipes as $relRec):
            $relUrl = App::url('?c=recipe&a=detail&id=' . urlencode($relRec['slug']));
          ?>
            <article class="recipe-poster-card" data-recipe-url="<?= App::e($relUrl) ?>" style="cursor:pointer;">
              <img src="<?= App::e(App::asset($relRec['image_path'])) ?>" alt="<?= App::e($relRec['title']) ?>" class="recipe-poster-card__img" loading="lazy">
              <div class="recipe-poster-card__scrim" aria-hidden="true"></div>
              <span class="recipe-poster-card__badge-corner"><?= App::e($relRec['difficulty']) ?></span>
              <div class="recipe-poster-card__body">
                <span class="recipe-poster-card__code"><?= App::e($relRec['code'] ?: 'BAKING RECIPE') ?></span>
                <h3 class="recipe-poster-card__title"><?= App::e($relRec['title']) ?></h3>
                <div class="recipe-poster-card__meta">
                  <span>&#9733; <?= App::e($relRec['rating_avg'] ?? '4.8') ?></span>
                  <span>&middot;</span>
                  <span><?= App::e($relRec['time_label']) ?></span>
                  <span>&middot;</span>
                  <span><?= App::e($relRec['people_label'] ?? '4 người') ?></span>
                </div>
                <a href="<?= App::e($relUrl) ?>" class="recipe-poster-card__cta" style="position:relative;z-index:4;">Xem công thức &rarr;</a>
              </div>
            </article>
          <?php endforeach; ?>
        </div>
      </section>
    <?php endif; ?>
  <?php endif; ?>
</main>

<?php if ($recipe): ?>
<script>
document.addEventListener("DOMContentLoaded", function () {
  const recipeSlug = <?= json_encode((string) $recipe['slug']) ?>;
  const recipeId = <?= (int) $recipe['id'] ?>;
  const servingsUnit = <?= json_encode((string) $recipe['servings_unit']) ?>;
  const totalStepsCount = <?= count($recipe['steps']) ?>;
  const servInput = document.getElementById("recipe-servings-input");
  const topServingsEl = document.getElementById("recipe-top-servings");
  const topCountEl = document.getElementById("recipe-top-count");
  const topIngCostEl = document.getElementById("recipe-top-ing-cost");
  const topToolCostEl = document.getElementById("recipe-top-tool-cost");
  const topTotalEl = document.getElementById("recipe-top-total");
  const ingredientsList = document.getElementById("recipe-ingredients-list");
  const addComboBtns = Array.from(document.querySelectorAll(".js-add-recipe-combo-trigger"));
  const addAllBtn = document.getElementById("btn-add-all-combo");
  let lastValidServings = Number(servInput?.value) || 1;
  let latestScaleRequest = 0;

  function recalcComboTotal() {
    let ingSum = 0;
    let toolSum = 0;
    let selectedCount = 0;
    document.querySelectorAll(".js-combo-ing-check:checked").forEach((cb) => {
      const qty = Number(cb.getAttribute("data-qty") || 1);
      const price = Number(cb.getAttribute("data-price") || 0);
      ingSum += qty * price;
      selectedCount++;
    });
    document.querySelectorAll(".js-combo-tool-check:checked").forEach((cb) => {
      const qty = Number(cb.getAttribute("data-qty") || 1);
      const price = Number(cb.getAttribute("data-price") || 0);
      toolSum += qty * price;
      selectedCount++;
    });
    const sum = ingSum + toolSum;
    const fmt = window.BakeApp.formatPrice;
    if (topTotalEl) topTotalEl.textContent = fmt(sum);
    if (topIngCostEl) topIngCostEl.textContent = fmt(ingSum);
    if (topToolCostEl) topToolCostEl.textContent = fmt(toolSum);
    if (topCountEl) topCountEl.textContent = selectedCount + " món";
    if (topServingsEl && servInput) topServingsEl.textContent = servInput.value + " " + servingsUnit;
    updateAddButtonState();
  }

  function updateAddButtonState() {
    const hasSelection = Boolean(document.querySelector(".js-combo-ing-check:checked, .js-combo-tool-check:checked"));
    addComboBtns.forEach((btn) => {
      btn.disabled = !hasSelection;
    });
  }

  document.querySelectorAll(".js-combo-ing-check, .js-combo-tool-check").forEach((cb) => {
    cb.addEventListener("change", recalcComboTotal);
  });

  document.getElementById("btn-select-all-ing")?.addEventListener("click", () => {
    document.querySelectorAll(".js-combo-ing-check").forEach((cb) => { cb.checked = true; });
    recalcComboTotal();
  });

  document.getElementById("btn-unselect-all-ing")?.addEventListener("click", () => {
    document.querySelectorAll(".js-combo-ing-check").forEach((cb) => { cb.checked = false; });
    recalcComboTotal();
  });

  document.getElementById("btn-select-all-tools")?.addEventListener("click", () => {
    document.querySelectorAll(".js-combo-tool-check").forEach((cb) => { cb.checked = true; });
    recalcComboTotal();
  });

  document.getElementById("btn-unselect-all-tools")?.addEventListener("click", () => {
    document.querySelectorAll(".js-combo-tool-check").forEach((cb) => { cb.checked = false; });
    recalcComboTotal();
  });

  document.getElementById("btn-recipe-share")?.addEventListener("click", async () => {
    const url = window.location.href;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }
      window.BakeApp.showToast("Đã sao chép liên kết công thức để chia sẻ!", "success");
    } catch (_) {
      window.BakeApp.showToast("Bạn có thể sao chép đường dẫn trên thanh địa chỉ để chia sẻ.", "info");
    }
  });

  async function scaleServings(rawValue) {
    const requestId = ++latestScaleRequest;
    const raw = String(rawValue ?? "").trim();
    if (!/^\d+$/.test(raw)) {
      if (servInput) servInput.value = String(lastValidServings);
      window.BakeApp.showToast("Số phần bánh phải là số nguyên từ 1 đến 50.", "error");
      return;
    }

    const val = Number(raw);
    if (!Number.isSafeInteger(val) || val < 1 || val > 50) {
      if (servInput) servInput.value = String(lastValidServings);
      window.BakeApp.showToast("Số phần bánh phải nằm trong khoảng 1–50.", "error");
      return;
    }

    const previousValue = lastValidServings;
    if (servInput) servInput.value = String(val);

    const selectedIngredientKeys = new Set(
      Array.from(document.querySelectorAll(".js-combo-ing-check:checked"))
        .map((cb) => cb.getAttribute("data-key"))
        .filter(Boolean)
    );

    try {
      const res = await fetch(window.BakeApp.apiUrl("recipe", "ajaxScale", { id: recipeSlug, servings: val }));
      const json = await res.json();
      if (!res.ok || json.status === "error") throw new Error(json.message || "Không thể quy đổi khẩu phần.");
      if (requestId !== latestScaleRequest) return;

      const esc = window.BakeApp.escapeHtml;
      const fmt = window.BakeApp.formatPrice;
      const ings = json.data?.ingredients || [];

      if (ingredientsList) {
        ingredientsList.innerHTML = ings.map((ing) => {
          const hasProd = Boolean(ing.purchase_available && ing.product_id && ing.product && ing.variant);
          const checked = hasProd && !ing.in_pantry && selectedIngredientKeys.has(ing.key);
          const unavailableNote = ing.availability_note || ing.note || "Chưa có sản phẩm phù hợp";
          const detailUrl = <?= json_encode(App::url('?c=product&a=detail&id=')) ?> + encodeURIComponent(ing.product_id || "");
          const stockQty = Number(ing.stock_qty || ing.variant?.stock_qty || 0);
          return `
            <div class="recipe-ingredient-row">
              <div class="recipe-ingredient-row__left">
                ${hasProd
                  ? `<input type="checkbox" class="js-combo-ing-check" data-key="${esc(ing.key)}" data-product-id="${ing.product_id}" data-option-index="${ing.option_index}" data-qty="${ing.packs_needed}" data-price="${ing.variant.price}" ${checked ? "checked" : ""}>`
                  : `<span style="display:inline-flex;width:17px;justify-content:center;color:#9a7b64;font-weight:700;">&mdash;</span>`
                }
                <div>
                  <strong>${esc(ing.name)}</strong>
                  <span class="recipe-ingredient-row__qty">Cần dùng: ${esc(ing.scaled_amount)} ${esc(ing.unit)}</span>
                  ${hasProd ? `
                    <label style="display:inline-flex;align-items:center;gap:4px;margin-left:8px;font-size:12px;color:#7c5c46;cursor:pointer;">
                      <input type="checkbox" class="js-pantry-toggle" data-recipe-id="${recipeId}" data-key="${esc(ing.key)}" ${ing.in_pantry ? "checked" : ""}>
                      <span>Đã có ở bếp</span>
                    </label>` : ""}
                </div>
              </div>
              <div class="recipe-ingredient-row__right">
                ${hasProd ? `
                  <a href="${detailUrl}" class="recipe-ingredient-row__match">${esc(ing.product.name)}</a>
                  <div style="font-size:12px;color:#7c5c46;">
                    ${ing.packs_needed} &times; ${esc(ing.variant.short_label)} = <strong style="color:var(--accent-cta);">${fmt(ing.variant.price * ing.packs_needed)}</strong>
                  </div>
                  <div style="margin-top:3px;">
                    <span style="display:inline-block;padding:1px 7px;border-radius:999px;background:#ecfdf5;color:#15803d;font-size:11px;font-weight:700;">Còn hàng (Kho: ${stockQty})</span>
                  </div>` : `<span class="recipe-ingredient-row__unmatched">${esc(unavailableNote)}</span>`}
              </div>
            </div>
          `;
        }).join("");

        ingredientsList.querySelectorAll(".js-combo-ing-check").forEach((cb) => cb.addEventListener("change", recalcComboTotal));
        bindPantryEvents();
      }

      lastValidServings = val;
      recalcComboTotal();
    } catch (err) {
      if (requestId !== latestScaleRequest) return;
      if (servInput) servInput.value = String(previousValue);
      window.BakeApp.showToast(err.message || "Không thể quy đổi khẩu phần.", "error");
    }
  }

  function bindPantryEvents() {
    document.querySelectorAll(".js-pantry-toggle").forEach((cb) => {
      cb.addEventListener("change", async () => {
        const key = cb.getAttribute("data-key");
        const owned = cb.checked;
        const previousOwned = !owned;
        const row = cb.closest(".recipe-ingredient-row");
        const itemCheck = row ? row.querySelector(".js-combo-ing-check") : null;
        const previousItemChecked = itemCheck ? itemCheck.checked : false;

        if (itemCheck) {
          itemCheck.checked = !owned;
          recalcComboTotal();
        }
        cb.disabled = true;
        try {
          const res = await window.BakeApp.postJson("recipe", "ajaxTogglePantry", {
            recipe_id: recipeId,
            ingredient_key: key,
            owned: owned
          });
          window.BakeApp.showToast(res.message, "info");
        } catch (err) {
          cb.checked = previousOwned;
          if (itemCheck) itemCheck.checked = previousItemChecked;
          recalcComboTotal();
          window.BakeApp.showToast(err.message || "Không thể lưu trạng thái nguyên liệu trong bếp.", "error");
        } finally {
          cb.disabled = false;
        }
      });
    });
  }
  bindPantryEvents();

  const btnMin = document.getElementById("btn-servings-minus");
  const btnPls = document.getElementById("btn-servings-plus");
  if (btnMin) btnMin.addEventListener("click", () => scaleServings(Number(servInput?.value || lastValidServings) - 1));
  if (btnPls) btnPls.addEventListener("click", () => scaleServings(Number(servInput?.value || lastValidServings) + 1));
  if (servInput) servInput.addEventListener("change", () => scaleServings(servInput.value));

  async function submitComboItems(selector) {
    const items = [];
    document.querySelectorAll(selector).forEach((cb) => {
      items.push({
        product_id: Number(cb.getAttribute("data-product-id")),
        option_index: Number(cb.getAttribute("data-option-index") || 0),
        quantity: Number(cb.getAttribute("data-qty") || 1)
      });
    });
    if (items.length === 0) {
      window.BakeApp.showToast("Vui lòng chọn ít nhất một nguyên liệu hoặc dụng cụ.", "info");
      return;
    }

    addComboBtns.forEach((b) => { b.disabled = true; });
    if (addAllBtn) addAllBtn.disabled = true;
    try {
      const res = await window.BakeApp.postJson("recipe", "ajaxAddComboToCart", {
        recipe_group_id: recipeSlug,
        items
      });
      window.BakeApp.updateBadges(res.data.cart_count);
      const skipped = Array.isArray(res.data.skipped) ? res.data.skipped : [];
      const message = skipped.length ? `${res.message} ${skipped.join(" ")}` : res.message;
      window.BakeApp.showToast(message, skipped.length ? "info" : "success");
    } catch (err) {
      window.BakeApp.showToast(err.message, "error");
    } finally {
      if (addAllBtn) addAllBtn.disabled = false;
      updateAddButtonState();
    }
  }

  addComboBtns.forEach((btn) => {
    btn.addEventListener("click", () => submitComboItems(".js-combo-ing-check:checked, .js-combo-tool-check:checked"));
  });

  if (addAllBtn) {
    addAllBtn.addEventListener("click", () => submitComboItems(".js-combo-ing-check, .js-combo-tool-check"));
  }

  document.querySelectorAll(".js-add-single-tool").forEach((btn) => {
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      try {
        const res = await window.BakeApp.postJson("order", "ajaxCartAdd", {
          product_id: Number(btn.getAttribute("data-product-id")),
          option_index: Number(btn.getAttribute("data-option-index") || 0),
          quantity: 1
        });
        window.BakeApp.updateBadges(res.data.cart_count);
        window.BakeApp.showToast(res.message || "Đã thêm dụng cụ vào giỏ hàng!", "success");
      } catch (err) {
        window.BakeApp.showToast(err.message, "error");
      } finally {
        btn.disabled = false;
      }
    });
  });

  // Step Progress Bar
  const progressCard = document.getElementById("recipe-progress-card");
  const stepChecks = Array.from(document.querySelectorAll(".js-recipe-step-check"));
  const progBar = document.getElementById("recipe-progress-bar");
  const progFill = document.getElementById("recipe-progress-fill");
  const progTxt = document.getElementById("recipe-progress-text");
  const completeCallout = document.getElementById("recipe-complete-callout");
  const updateProgress = () => {
    const total = stepChecks.length;
    const done = stepChecks.filter((checkbox) => checkbox.checked).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const isComplete = total > 0 && done === total;
    if (progFill) progFill.style.width = pct + "%";
    if (progBar) progBar.setAttribute("aria-valuenow", String(pct));
    if (progTxt) progTxt.textContent = `${done}/${totalStepsCount} bước (${pct}%)`;
    if (progressCard) progressCard.classList.toggle("is-complete", isComplete);
    if (completeCallout) completeCallout.hidden = !isComplete;
    stepChecks.forEach((cb) => {
      const card = cb.closest(".recipe-step-card");
      const lbl = card?.querySelector(".js-step-label");
      if (card) card.classList.toggle("is-completed", cb.checked);
      if (lbl) lbl.textContent = cb.checked ? "Đã hoàn thành" : "Đánh dấu xong";
    });
  };
  stepChecks.forEach((checkbox) => checkbox.addEventListener("change", updateProgress));
  updateProgress();

  document.getElementById("btn-scroll-to-review")?.addEventListener("click", () => {
    document.getElementById("recipe-reviews-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("php-recipe-share-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const ta = document.getElementById("php-recipe-share-text");
    const msg = document.getElementById("php-recipe-share-msg");
    if (!ta || ta.value.trim().length < 4) return;
    if (msg) {
      msg.textContent = "Cảm ơn bạn đã chia sẻ câu chuyện vào bếp với BakeMate!";
      msg.hidden = false;
    }
    window.BakeApp.showToast("Đã ghi nhận cảm nhận làm bánh của bạn!", "success");
    ta.value = "";
  });

  // Baking Countdown Timer
  const defaultSec = <?= (int) $recipe['bake_minutes'] * 60 ?>;
  let remainSec = defaultSec;
  let timerInt = null;
  const disp = document.getElementById("baking-timer-display");
  const minInput = document.getElementById("timer-custom-min");
  const secInput = document.getElementById("timer-custom-sec");
  const readCustomSec = () => {
    const m = Math.max(0, Math.min(180, Math.floor(Number(minInput?.value || 0))));
    const s = Math.max(0, Math.min(59, Math.floor(Number(secInput?.value || 0))));
    return m * 60 + s;
  };
  const renderTimer = () => {
    const minutes = Math.floor(remainSec / 60);
    const seconds = remainSec % 60;
    if (disp) disp.textContent = String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  };
  const stopTimer = () => {
    if (timerInt !== null) {
      clearInterval(timerInt);
      timerInt = null;
    }
  };
  [minInput, secInput].forEach((inp) => {
    inp?.addEventListener("change", () => {
      if (timerInt === null) {
        remainSec = readCustomSec();
        renderTimer();
      }
    });
  });

  document.getElementById("timer-start")?.addEventListener("click", () => {
    if (timerInt !== null) return;
    if (remainSec <= 0) remainSec = readCustomSec() || defaultSec;
    if (remainSec <= 0) {
      window.BakeApp.showToast("Vui lòng nhập phút hoặc giây lớn hơn 0.", "info");
      return;
    }
    timerInt = setInterval(() => {
      remainSec = Math.max(0, remainSec - 1);
      renderTimer();
      if (remainSec === 0) {
        stopTimer();
        window.BakeApp.showToast("Hết giờ nướng bánh! Kiểm tra lò ngay nhé.", "success");
      }
    }, 1000);
  });
  document.getElementById("timer-pause")?.addEventListener("click", stopTimer);
  document.getElementById("timer-reset")?.addEventListener("click", () => {
    stopTimer();
    remainSec = readCustomSec();
    renderTimer();
  });

  recalcComboTotal();
  renderTimer();
});
</script>
<?php endif; ?>
