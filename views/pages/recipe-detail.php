<?php
declare(strict_types=1);
?>
<main class="php-page-container">
  <?php if (!$recipe): ?>
    <div class="php-card" style="text-align:center;padding:48px 20px;background:#fff8ed;border:1.5px dashed #c88b52;">
      <h1 style="color:#70452b;margin-top:0;">Công thức không tồn tại</h1>
      <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="btn btn--primary">Quay lại Kho công thức</a>
    </div>
  <?php else: ?>
    <nav style="font-size:13.5px;color:#7c5c46;margin-bottom:16px;">
      <a href="<?= App::e(App::url('')) ?>">Trang chủ</a> &rsaquo;
      <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>">Công thức</a> &rsaquo;
      <span><?= App::e($recipe['title']) ?></span>
    </nav>

    <section class="php-card" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;align-items:center;margin-bottom:24px;">
      <img src="<?= App::e(App::asset($recipe['image_path'])) ?>" alt="<?= App::e($recipe['title']) ?>" style="width:100%;height:300px;object-fit:cover;border-radius:12px;">
      <div>
        <h1 style="margin:0 0 10px;color:#70452b;font-size:28px;"><?= App::e($recipe['title']) ?></h1>
        <p style="color:#4a2d1b;line-height:1.65;margin-bottom:16px;"><?= App::e($recipe['subtitle']) ?></p>
        <div style="display:grid;gap:6px;font-size:13.5px;color:#70452b;background:#fff8ed;padding:12px 14px;border-radius:10px;">
          <div>Thời gian: <strong><?= App::e($recipe['time_label']) ?></strong></div>
          <div>Độ khó: <strong><?= App::e($recipe['difficulty']) ?></strong></div>
          <div>Thành phẩm: <strong><?= App::e($recipe['yield_label'] ?? ((int) $recipe['default_servings'] . ' ' . $recipe['servings_unit'])) ?></strong></div>
          <div>Đánh giá: <strong>&#9733; <?= App::e($recipe['rating_avg']) ?></strong></div>
        </div>
      </div>
    </section>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:24px;align-items:start;">
      <!-- Cột 1: Recipe-to-Cart Scaler + Pantry Memory -->
      <section class="php-card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px;">
          <h2 style="margin:0;color:#70452b;font-size:20px;">Nguyên liệu &amp; Quy đổi</h2>
          <div style="display:flex;align-items:center;gap:8px;">
            <label for="recipe-servings-input" style="font-size:13px;font-weight:700;color:#70452b;"><?= App::e($recipe['servings_unit']) ?>:</label>
            <button type="button" class="btn btn--outline btn--sm" id="btn-servings-minus">−</button>
            <input id="recipe-servings-input" type="number" min="1" max="50" step="1" inputmode="numeric" value="<?= (int) $recipe['current_servings'] ?>" style="width:54px;text-align:center;" class="form-input">
            <button type="button" class="btn btn--outline btn--sm" id="btn-servings-plus">+</button>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin:0 0 12px;">
          <p style="font-size:12.5px;color:#7c5c46;margin:0;">Đánh dấu <strong>"Đã có ở bếp"</strong> nếu bạn đã sẵn có nguyên liệu để loại trừ khỏi đơn mua.</p>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button type="button" id="btn-select-all-ing" class="btn btn--outline btn--sm" style="padding:4px 10px;font-size:12px;">Chọn tất cả</button>
            <button type="button" id="btn-unselect-all-ing" class="btn btn--outline btn--sm" style="padding:4px 10px;font-size:12px;">Bỏ chọn tất cả</button>
          </div>
        </div>

        <!-- Bảng tổng hợp số tiền đã chọn ở trên -->
        <div id="recipe-top-summary-card" style="padding:14px 16px;margin-bottom:16px;border-radius:14px;background:#fff8ed;border:1.5px solid #e4d1ba;display:grid;gap:8px;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;color:#5c402d;">
            <span>Khẩu phần đang quy đổi:</span>
            <strong id="recipe-top-servings" style="color:#4a2d1b;"><?= (int) $recipe['current_servings'] ?> <?= App::e($recipe['servings_unit']) ?></strong>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;color:#5c402d;">
            <span>Số món đã chọn:</span>
            <strong id="recipe-top-count" style="color:#4a2d1b;">0 món</strong>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;color:#5c402d;">
            <span>Tiền nguyên liệu:</span>
            <strong id="recipe-top-ing-cost" style="color:#4a2d1b;"><?= App::e(App::formatCurrency((int) $recipe['estimated_ingredients_cost'])) ?></strong>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;color:#5c402d;">
            <span>Tiền dụng cụ còn thiếu:</span>
            <strong id="recipe-top-tool-cost" style="color:#4a2d1b;"><?= App::e(App::formatCurrency((int) $recipe['estimated_tools_cost'])) ?></strong>
          </div>
          <div style="border-top:1px dashed #d9c2a6;padding-top:10px;margin-top:2px;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-weight:800;font-size:15px;color:#70452b;">Tổng số tiền:</span>
            <strong id="recipe-top-total" style="font-size:21px;color:#70452b;"><?= App::e(App::formatCurrency((int) $recipe['estimated_ingredients_cost'] + (int) $recipe['estimated_tools_cost'])) ?></strong>
          </div>
          <button type="button" id="btn-add-recipe-combo-top" class="btn btn--primary btn--full js-add-recipe-combo-trigger">
            Thêm nguyên liệu &amp; dụng cụ đã chọn vào giỏ
          </button>
        </div>

        <div id="recipe-ingredients-list" style="display:grid;gap:10px;margin-bottom:18px;">
          <?php foreach ($recipe['ingredients'] as $ing):
            $hasProduct = !empty($ing['purchase_available']) && !empty($ing['product_id']) && !empty($ing['product']) && !empty($ing['variant']);
            $checked = $hasProduct && empty($ing['in_pantry']);
          ?>
            <div class="recipe-ing-row" style="border:1px solid #efe3d2;border-radius:10px;padding:10px 12px;background:#fffdf9;">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;color:#4a2d1b;">
                  <?php if ($hasProduct): ?>
                    <input type="checkbox" class="js-combo-ing-check"
                           data-key="<?= App::e($ing['key']) ?>"
                           data-product-id="<?= (int) $ing['product_id'] ?>"
                           data-option-index="<?= (int) $ing['option_index'] ?>"
                           data-qty="<?= (int) $ing['packs_needed'] ?>"
                           data-price="<?= (int) $ing['variant']['price'] ?>"
                           <?= $checked ? 'checked' : '' ?>>
                  <?php endif; ?>
                  <span><?= App::e($ing['name']) ?>: <strong class="js-ing-amount" data-base="<?= (float) $ing['base_amount'] ?>"><?= App::e($ing['scaled_amount']) ?></strong> <?= App::e($ing['unit']) ?></span>
                </label>

                <label style="font-size:12px;color:#7c5c46;display:flex;align-items:center;gap:4px;cursor:pointer;">
                  <input type="checkbox" class="js-pantry-toggle" data-recipe-id="<?= (int) $recipe['id'] ?>" data-key="<?= App::e($ing['key']) ?>" <?= !empty($ing['in_pantry']) ? 'checked' : '' ?>>
                  <span>Đã có ở bếp</span>
                </label>
              </div>

              <?php if ($hasProduct): ?>
                <div class="js-ing-pack-info" style="font-size:12.5px;color:#7c5c46;margin-top:4px;padding-left:24px;">
                  Đề xuất mua: <strong><?= (int) $ing['packs_needed'] ?> &times; <?= App::e($ing['variant']['short_label']) ?></strong>
                  (<?= App::e(App::formatCurrency((int) $ing['variant']['price'] * (int) $ing['packs_needed'])) ?>)
                  <?php if ($ing['surplus'] > 0): ?> · Dư dự kiến <?= App::e($ing['surplus']) ?> <?= App::e($ing['unit']) ?><?php endif; ?>
                  <span style="display:inline-block;margin-left:6px;padding:1px 7px;border-radius:999px;background:#ecfdf5;color:#15803d;font-size:11px;font-weight:700;">Còn hàng (Kho: <?= (int) ($ing['stock_qty'] ?? 0) ?>)</span>
                </div>
              <?php elseif (!empty($ing['availability_note']) || !empty($ing['note'])): ?>
                <div style="font-size:12px;color:#9c7c65;margin-top:4px;"><?= App::e($ing['availability_note'] ?: $ing['note']) ?></div>
              <?php endif; ?>
            </div>
          <?php endforeach; ?>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin:0 0 10px;">
          <h3 style="margin:0;color:#70452b;font-size:17px;">Dụng cụ đề xuất (tích chọn món còn thiếu)</h3>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button type="button" id="btn-select-all-tools" class="btn btn--outline btn--sm" style="padding:4px 10px;font-size:12px;">Chọn tất cả</button>
            <button type="button" id="btn-unselect-all-tools" class="btn btn--outline btn--sm" style="padding:4px 10px;font-size:12px;">Bỏ chọn tất cả</button>
          </div>
        </div>
        <div style="display:grid;gap:8px;margin-bottom:18px;">
          <?php foreach ($recipe['tools'] as $tl):
            $toolImg = !empty($tl['product']['primary_image']) ? (string) $tl['product']['primary_image'] : (string) $recipe['image_path'];
            $toolStockQty = (int) ($tl['stock_qty'] ?? 0);
            $toolInStock = !empty($tl['purchase_available']) && !empty($tl['variant']) && $toolStockQty > 0;
          ?>
            <label style="display:flex;justify-content:space-between;align-items:center;gap:12px;border:1px solid #efe3d2;border-radius:10px;padding:10px 12px;background:#fffdf9;cursor:<?= $toolInStock ? 'pointer' : 'default' ?>;">
              <span style="display:flex;align-items:center;gap:10px;">
                <?php if ($toolInStock): ?>
                  <input type="checkbox" class="js-combo-tool-check"
                         data-product-id="<?= (int) $tl['product_id'] ?>"
                         data-option-index="<?= (int) $tl['option_index'] ?>"
                         data-qty="1"
                         data-price="<?= (int) $tl['variant']['price'] ?>" checked>
                <?php else: ?>
                  <input type="checkbox" disabled aria-label="Dụng cụ hiện không khả dụng">
                <?php endif; ?>
                <img src="<?= App::e(App::asset($toolImg)) ?>" alt="<?= App::e($tl['name']) ?>" loading="lazy" class="recipe-tool-card__thumb">
                <span>
                  <strong style="color:#4a2d1b;display:block;font-size:13.5px;"><?= App::e($tl['name']) ?></strong>
                  <span style="font-size:12px;color:#7c5c46;display:block;"><?= App::e($tl['description']) ?></span>
                  <?php if (!$toolInStock): ?>
                    <span style="display:inline-block;margin-top:4px;padding:2px 8px;border-radius:999px;background:#fef2f2;color:#b91c1c;font-size:11.5px;font-weight:700;"><?= App::e($tl['availability_note'] ?: 'Hết hàng') ?></span>
                  <?php else: ?>
                    <span style="font-size:12px;color:#7c5c46;display:inline-block;margin-top:2px;">Quy cách: <?= App::e($tl['variant']['short_label']) ?></span>
                    <span style="display:inline-block;margin-left:6px;padding:2px 8px;border-radius:999px;background:#ecfdf5;color:#15803d;font-size:11.5px;font-weight:700;">Còn hàng (Kho: <?= $toolStockQty ?>)</span>
                  <?php endif; ?>
                </span>
              </span>
              <?php if ($toolInStock): ?>
                <strong style="color:#70452b;font-size:13.5px;white-space:nowrap;"><?= App::e(App::formatCurrency((int) $tl['variant']['price'])) ?></strong>
              <?php else: ?>
                <strong style="color:#b91c1c;font-size:12px;white-space:nowrap;">Hết hàng</strong>
              <?php endif; ?>
            </label>
          <?php endforeach; ?>
        </div>

        <div style="padding:14px;background:#fff8ed;border-radius:10px;display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <span style="font-weight:700;color:#70452b;">Tổng cộng:</span>
          <strong id="recipe-combo-total" style="font-size:20px;color:#70452b;"><?= App::e(App::formatCurrency((int) $recipe['estimated_ingredients_cost'] + (int) $recipe['estimated_tools_cost'])) ?></strong>
        </div>

        <button type="button" id="btn-add-recipe-combo" class="btn btn--primary btn--full js-add-recipe-combo-trigger" data-recipe-slug="<?= App::e($recipe['slug']) ?>">
          Thêm nguyên liệu &amp; dụng cụ đã chọn vào giỏ
        </button>
        <a href="<?= App::e(App::url('?c=order&a=cart')) ?>" style="display:block;text-align:center;margin-top:12px;font-size:16px;font-weight:800;color:#70452b;text-decoration:underline;">
          Xem giỏ hàng &rarr;
        </a>
      </section>

      <!-- Cột 2: Hướng dẫn từng bước + Thanh tiến độ % + Đồng hồ nướng bánh -->
      <section style="display:grid;gap:20px;">
        <div class="php-card recipe-progress-card" id="recipe-progress-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <h2 style="margin:0;color:#70452b;font-size:20px;">Cách làm - Từng bước thật dễ dàng</h2>
            <span id="recipe-progress-text" style="font-weight:700;color:#c88b52;font-size:14px;">0% hoàn thành</span>
          </div>
          <div style="height:10px;background:#f2e5d5;border-radius:999px;overflow:hidden;margin-bottom:16px;">
            <div id="recipe-progress-bar" role="progressbar" aria-label="Tiến độ thực hiện công thức" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" style="height:100%;width:0%;background:#c88b52;transition:width .25s ease, background .25s ease;"></div>
          </div>

          <div id="recipe-complete-callout" class="recipe-complete-callout" hidden style="margin-bottom:14px;">
            <div>
              <strong>🎉 Chúc mừng bạn đã hoàn thành món bánh <?= App::e($recipe['title']) ?>!</strong>
              <p>Bạn có muốn chia sẻ trải nghiệm làm bánh của mình không?</p>
            </div>
            <button type="button" id="btn-scroll-to-review" class="btn btn--primary btn--sm" style="white-space:nowrap;">
              &darr; Chia sẻ cảm nhận ngay
            </button>
          </div>

          <div style="display:grid;gap:10px;">
            <?php foreach ($recipe['steps'] as $sIdx => $stepText): ?>
              <label style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border:1px solid #efe3d2;border-radius:10px;cursor:pointer;">
                <input type="checkbox" class="js-recipe-step-check" data-step="<?= $sIdx ?>" style="margin-top:4px;">
                <span style="font-size:14px;color:#4a2d1b;line-height:1.6;"><strong>Bước <?= $sIdx + 1 ?>:</strong> <?= App::e($stepText) ?></span>
              </label>
            <?php endforeach; ?>
          </div>
        </div>

        <div class="php-card" style="background:#fff8ed;">
          <h3 style="margin:0 0 8px;color:#70452b;font-size:18px;">Đồng hồ hẹn giờ nướng / ủ bánh</h3>
          <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <label style="font-size:13px;color:#5c402d;font-weight:600;">
                Phút:
                <input type="number" id="timer-custom-min" class="form-input" min="0" max="180" value="<?= (int) $recipe['bake_minutes'] ?>" style="width:68px;text-align:center;margin-left:4px;">
              </label>
              <label style="font-size:13px;color:#5c402d;font-weight:600;">
                Giây:
                <input type="number" id="timer-custom-sec" class="form-input" min="0" max="59" value="0" style="width:64px;text-align:center;margin-left:4px;">
              </label>
            </div>
            <div id="baking-timer-display" style="font-size:32px;font-weight:800;color:#70452b;font-variant-numeric:tabular-nums;">
              <?= str_pad((string) $recipe['bake_minutes'], 2, '0', STR_PAD_LEFT) ?>:00
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="btn btn--primary btn--sm" id="timer-start">Bắt đầu</button>
              <button type="button" class="btn btn--outline btn--sm" id="timer-pause">Tạm dừng</button>
              <button type="button" class="btn btn--outline btn--sm" id="timer-reset">Đặt lại</button>
            </div>
          </div>
        </div>

        <?php if (!empty($recipe['tips'])): ?>
          <div class="php-card">
            <h3 style="margin:0 0 10px;color:#70452b;font-size:18px;">Mẹo thành công từ BakeMate</h3>
            <ul style="margin:0;padding-left:18px;color:#4a2d1b;line-height:1.65;font-size:14px;">
              <?php foreach ($recipe['tips'] as $tip): ?>
                <li style="margin-bottom:6px;"><?= App::e($tip) ?></li>
              <?php endforeach; ?>
            </ul>
          </div>
        <?php endif; ?>
      </section>
    </div>

    <section id="recipe-reviews-section" class="php-card" style="margin-top:24px;">
      <h2 style="margin:0 0 10px;color:#70452b;font-size:20px;">Căn bếp của bạn, câu chuyện của bạn</h2>
      <p style="margin:0 0 12px;color:#7c5c46;font-size:14px;">Chia sẻ cảm nhận sau khi thực hiện công thức <strong><?= App::e($recipe['title']) ?></strong> cùng cộng đồng BakeMate.</p>
      <form id="php-recipe-share-form" style="display:grid;gap:10px;max-width:640px;">
        <textarea id="php-recipe-share-text" class="form-textarea" rows="3" placeholder="Chia sẻ cảm nhận..." required></textarea>
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
          <button type="submit" class="btn btn--primary btn--sm">Gửi chia sẻ trải nghiệm</button>
          <span id="php-recipe-share-msg" style="font-size:13px;color:#15803d;font-weight:600;" hidden></span>
        </div>
      </form>
    </section>

    <?php if (!empty($relatedRecipes)): ?>
      <section style="margin-top:28px;" aria-label="Công thức gợi ý tiếp theo">
        <h2 style="margin:0 0 14px;color:#70452b;font-size:21px;">Thêm cảm hứng cho lần vào bếp tiếp theo</h2>
        <div class="blog-related-grid">
          <?php foreach ($relatedRecipes as $relRec): ?>
            <article class="php-card related-hover-card" style="padding:14px;display:flex;flex-direction:column;gap:8px;">
              <a href="<?= App::e(App::url('?c=recipe&a=detail&id=' . urlencode($relRec['slug']))) ?>" class="related-hover-card__media">
                <img src="<?= App::e(App::asset($relRec['image_path'])) ?>" alt="<?= App::e($relRec['title']) ?>" loading="lazy" class="related-hover-card__img">
              </a>
              <span class="product-card__category" style="font-size:11.5px;"><?= App::e($relRec['category']) ?> · <?= App::e($relRec['difficulty']) ?></span>
              <h3 style="margin:0;font-size:16px;line-height:1.4;color:#4a2d1b;">
                <a href="<?= App::e(App::url('?c=recipe&a=detail&id=' . urlencode($relRec['slug']))) ?>" style="color:inherit;"><?= App::e($relRec['title']) ?></a>
              </h3>
              <p style="margin:0;font-size:12.5px;color:#7c5c46;"><?= App::e($relRec['time_label']) ?></p>
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
  const servInput = document.getElementById("recipe-servings-input");
  const totalEl = document.getElementById("recipe-combo-total");
  const topServingsEl = document.getElementById("recipe-top-servings");
  const topCountEl = document.getElementById("recipe-top-count");
  const topIngCostEl = document.getElementById("recipe-top-ing-cost");
  const topToolCostEl = document.getElementById("recipe-top-tool-cost");
  const topTotalEl = document.getElementById("recipe-top-total");
  const ingredientsList = document.getElementById("recipe-ingredients-list");
  const addComboBtns = Array.from(document.querySelectorAll(".js-add-recipe-combo-trigger"));
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
    if (totalEl) totalEl.textContent = fmt(sum);
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
    document.querySelectorAll(".js-combo-ing-check").forEach((cb) => {
      cb.checked = true;
    });
    recalcComboTotal();
  });

  document.getElementById("btn-unselect-all-ing")?.addEventListener("click", () => {
    document.querySelectorAll(".js-combo-ing-check").forEach((cb) => {
      cb.checked = false;
    });
    recalcComboTotal();
  });

  document.getElementById("btn-select-all-tools")?.addEventListener("click", () => {
    document.querySelectorAll(".js-combo-tool-check").forEach((cb) => {
      cb.checked = true;
    });
    recalcComboTotal();
  });

  document.getElementById("btn-unselect-all-tools")?.addEventListener("click", () => {
    document.querySelectorAll(".js-combo-tool-check").forEach((cb) => {
      cb.checked = false;
    });
    recalcComboTotal();
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

    // Giữ lại lựa chọn thủ công của khách khi thay đổi số phần.
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
          const unavailableNote = ing.availability_note || ing.note || "";
          return `
            <div class="recipe-ing-row" style="border:1px solid #efe3d2;border-radius:10px;padding:10px 12px;background:#fffdf9;">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;color:#4a2d1b;">
                  ${hasProd ? `<input type="checkbox" class="js-combo-ing-check" data-key="${esc(ing.key)}" data-product-id="${ing.product_id}" data-option-index="${ing.option_index}" data-qty="${ing.packs_needed}" data-price="${ing.variant.price}" ${checked ? "checked" : ""}>` : ""}
                  <span>${esc(ing.name)}: <strong>${esc(ing.scaled_amount)}</strong> ${esc(ing.unit)}</span>
                </label>
                <label style="font-size:12px;color:#7c5c46;display:flex;align-items:center;gap:4px;cursor:pointer;">
                  <input type="checkbox" class="js-pantry-toggle" data-recipe-id="${recipeId}" data-key="${esc(ing.key)}" ${ing.in_pantry ? "checked" : ""}>
                  <span>Đã có ở bếp</span>
                </label>
              </div>
              ${hasProd ? `<div style="font-size:12.5px;color:#7c5c46;margin-top:4px;padding-left:24px;">Đề xuất mua: <strong>${ing.packs_needed} &times; ${esc(ing.variant.short_label)}</strong> (${fmt(ing.variant.price * ing.packs_needed)})${ing.surplus > 0 ? ` · Dư dự kiến ${esc(ing.surplus)} ${esc(ing.unit)}` : ""} <span style="display:inline-block;margin-left:6px;padding:1px 7px;border-radius:999px;background:#ecfdf5;color:#15803d;font-size:11px;font-weight:700;">Còn hàng (Kho: ${Number(ing.stock_qty || ing.variant.stock_qty || 0)})</span></div>` : (unavailableNote ? `<div style="font-size:12px;color:#9c7c65;margin-top:4px;">${esc(unavailableNote)}</div>` : "")}
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
        const row = cb.closest(".recipe-ing-row");
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

  addComboBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const items = [];
      document.querySelectorAll(".js-combo-ing-check:checked, .js-combo-tool-check:checked").forEach((cb) => {
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
        updateAddButtonState();
      }
    });
  });

  // Step Progress Bar + Celebratory 100% Callout
  const progressCard = document.getElementById("recipe-progress-card");
  const stepChecks = Array.from(document.querySelectorAll(".js-recipe-step-check"));
  const progBar = document.getElementById("recipe-progress-bar");
  const progTxt = document.getElementById("recipe-progress-text");
  const completeCallout = document.getElementById("recipe-complete-callout");
  const updateProgress = () => {
    const total = stepChecks.length;
    const done = stepChecks.filter((checkbox) => checkbox.checked).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const isComplete = total > 0 && done === total;
    if (progBar) {
      progBar.style.width = pct + "%";
      progBar.style.background = isComplete ? "linear-gradient(90deg, #f472b6, #f59e0b, #10b981)" : "#c88b52";
      progBar.setAttribute("aria-valuenow", String(pct));
    }
    if (progTxt) progTxt.textContent = pct + "% hoàn thành";
    if (progressCard) progressCard.classList.toggle("is-complete", isComplete);
    if (completeCallout) completeCallout.hidden = !isComplete;
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

  // Baking Countdown Timer (Phút / Giây tùy chỉnh)
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
