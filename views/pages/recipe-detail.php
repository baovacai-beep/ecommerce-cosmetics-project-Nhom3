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
        <span style="font-size:12.5px;font-weight:700;color:#c88b52;"><?= App::e($recipe['code']) ?> · <?= App::e($recipe['category']) ?></span>
        <h1 style="margin:6px 0 10px;color:#70452b;font-size:28px;"><?= App::e($recipe['title']) ?></h1>
        <p style="color:#4a2d1b;line-height:1.65;margin-bottom:16px;"><?= App::e($recipe['subtitle']) ?></p>
        <div style="display:flex;gap:14px;flex-wrap:wrap;font-size:13.5px;color:#70452b;background:#fff8ed;padding:12px 14px;border-radius:10px;">
          <span>Thời gian: <strong><?= App::e($recipe['time_label']) ?></strong></span>
          <span>Độ khó: <strong><?= App::e($recipe['difficulty']) ?></strong></span>
          <span>Chuẩn gốc: <strong><?= (int) $recipe['default_servings'] ?> <?= App::e($recipe['servings_unit']) ?></strong></span>
          <span>Đánh giá: <strong>&#9733; <?= App::e($recipe['rating_avg']) ?></strong></span>
        </div>
      </div>
    </section>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:24px;align-items:start;">
      <!-- Cột 1: Recipe-to-Cart Scaler + Pantry Memory -->
      <section class="php-card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px;">
          <h2 style="margin:0;color:#70452b;font-size:20px;">Nguyên liệu &amp; Quy đổi</h2>
          <div style="display:flex;align-items:center;gap:8px;">
            <label for="recipe-servings-input" style="font-size:13px;font-weight:700;color:#70452b;">Số phần:</label>
            <button type="button" class="btn btn--outline btn--sm" id="btn-servings-minus">−</button>
            <input id="recipe-servings-input" type="number" min="1" max="50" value="<?= (int) $recipe['current_servings'] ?>" style="width:54px;text-align:center;" class="form-input">
            <button type="button" class="btn btn--outline btn--sm" id="btn-servings-plus">+</button>
          </div>
        </div>

        <p style="font-size:12.5px;color:#7c5c46;margin-top:0;">Đánh dấu <strong>"Đã có ở bếp"</strong> nếu bạn đã sẵn có nguyên liệu để loại trừ khỏi đơn mua.</p>

        <div id="recipe-ingredients-list" style="display:grid;gap:10px;margin-bottom:18px;">
          <?php foreach ($recipe['ingredients'] as $ing):
            $hasProduct = !empty($ing['product_id']) && !empty($ing['variant']);
            $checked = $hasProduct && empty($ing['in_pantry']);
          ?>
            <div class="recipe-ing-row" style="border:1px solid #efe3d2;border-radius:10px;padding:10px 12px;background:#fffdf9;">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;color:#4a2d1b;">
                  <?php if ($hasProduct): ?>
                    <input type="checkbox" class="js-combo-ing-check"
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
                </div>
              <?php elseif (!empty($ing['note'])): ?>
                <div style="font-size:12px;color:#9c7c65;margin-top:4px;"><?= App::e($ing['note']) ?></div>
              <?php endif; ?>
            </div>
          <?php endforeach; ?>
        </div>

        <h3 style="margin:0 0 10px;color:#70452b;font-size:17px;">Dụng cụ đề xuất (chọn món còn thiếu)</h3>
        <div style="display:grid;gap:8px;margin-bottom:18px;">
          <?php foreach ($recipe['tools'] as $tl): ?>
            <?php if (!empty($tl['variant'])): ?>
              <label style="display:flex;justify-content:space-between;align-items:center;border:1px solid #efe3d2;border-radius:10px;padding:10px 12px;cursor:pointer;">
                <span style="display:flex;align-items:center;gap:8px;">
                  <input type="checkbox" class="js-combo-tool-check"
                         data-product-id="<?= (int) $tl['product_id'] ?>"
                         data-option-index="<?= (int) $tl['option_index'] ?>"
                         data-qty="1"
                         data-price="<?= (int) $tl['variant']['price'] ?>" checked>
                  <span>
                    <strong style="color:#4a2d1b;display:block;font-size:13.5px;"><?= App::e($tl['name']) ?></strong>
                    <span style="font-size:12px;color:#7c5c46;"><?= App::e($tl['description']) ?></span>
                  </span>
                </span>
                <strong style="color:#70452b;font-size:13.5px;"><?= App::e(App::formatCurrency((int) $tl['variant']['price'])) ?></strong>
              </label>
            <?php endif; ?>
          <?php endforeach; ?>
        </div>

        <div style="padding:14px;background:#fff8ed;border-radius:10px;display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <span style="font-weight:700;color:#70452b;">Tạm tính combo đã chọn:</span>
          <strong id="recipe-combo-total" style="font-size:20px;color:#70452b;"><?= App::e(App::formatCurrency((int) $recipe['estimated_ingredients_cost'] + (int) $recipe['estimated_tools_cost'])) ?></strong>
        </div>

        <button type="button" id="btn-add-recipe-combo" class="btn btn--primary btn--full" data-recipe-slug="<?= App::e($recipe['slug']) ?>">
          Thêm nguyên liệu &amp; dụng cụ đã chọn vào giỏ
        </button>
      </section>

      <!-- Cột 2: Hướng dẫn từng bước + Thanh tiến độ % + Đồng hồ nướng bánh -->
      <section style="display:grid;gap:20px;">
        <div class="php-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <h2 style="margin:0;color:#70452b;font-size:20px;">Hướng dẫn thực hiện</h2>
            <span id="recipe-progress-text" style="font-weight:700;color:#c88b52;font-size:14px;">0% hoàn thành</span>
          </div>
          <div style="height:8px;background:#f2e5d5;border-radius:999px;overflow:hidden;margin-bottom:16px;">
            <div id="recipe-progress-bar" style="height:100%;width:0%;background:#c88b52;transition:width .25s ease;"></div>
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
          <h3 style="margin:0 0 8px;color:#70452b;font-size:18px;">Đồng hồ đếm ngược nướng bánh (Baking Timer)</h3>
          <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
            <div id="baking-timer-display" style="font-size:32px;font-weight:800;color:#70452b;font-variant-numeric:tabular-nums;">
              <?= str_pad((string) $recipe['bake_minutes'], 2, '0', STR_PAD_LEFT) ?>:00
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="btn btn--primary btn--sm" id="timer-start">Bắt đầu</button>
              <button type="button" class="btn btn--outline btn--sm" id="timer-pause">Tạm dừng</button>
              <button type="button" class="btn btn--outline btn--sm" id="timer-reset">Đặt lại</button>
              <button type="button" class="btn btn--outline btn--sm" id="timer-minus5">−5 phút</button>
              <button type="button" class="btn btn--outline btn--sm" id="timer-plus5">+5 phút</button>
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
  <?php endif; ?>
</main>

<?php if ($recipe): ?>
<script>
document.addEventListener("DOMContentLoaded", function () {
  const recipeSlug = <?= json_encode((string) $recipe['slug']) ?>;
  const recipeId = <?= (int) $recipe['id'] ?>;
  const servInput = document.getElementById("recipe-servings-input");
  const totalEl = document.getElementById("recipe-combo-total");

  function recalcComboTotal() {
    let sum = 0;
    document.querySelectorAll(".js-combo-ing-check:checked, .js-combo-tool-check:checked").forEach((cb) => {
      const qty = Number(cb.getAttribute("data-qty") || 1);
      const price = Number(cb.getAttribute("data-price") || 0);
      sum += qty * price;
    });
    if (totalEl) totalEl.textContent = window.BakeApp.formatPrice(sum);
  }

  document.querySelectorAll(".js-combo-ing-check, .js-combo-tool-check").forEach((cb) => {
    cb.addEventListener("change", recalcComboTotal);
  });

  async function scaleServings(newVal) {
    const val = Math.max(1, Math.min(50, Number(newVal) || 1));
    if (servInput) servInput.value = val;
    try {
      const res = await fetch(window.BakeApp.apiUrl("recipe", "ajaxScale", { id: recipeSlug, servings: val }));
      const json = await res.json();
      if (!res.ok || json.status === "error") throw new Error(json.message);

      const listEl = document.getElementById("recipe-ingredients-list");
      const esc = window.BakeApp.escapeHtml;
      const fmt = window.BakeApp.formatPrice;
      const ings = json.data.ingredients || [];

      if (listEl) {
        listEl.innerHTML = ings.map((ing) => {
          const hasProd = Boolean(ing.product_id && ing.variant);
          const checked = hasProd && !ing.in_pantry;
          return `
            <div class="recipe-ing-row" style="border:1px solid #efe3d2;border-radius:10px;padding:10px 12px;background:#fffdf9;">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;color:#4a2d1b;">
                  ${hasProd ? `<input type="checkbox" class="js-combo-ing-check" data-product-id="${ing.product_id}" data-option-index="${ing.option_index}" data-qty="${ing.packs_needed}" data-price="${ing.variant.price}" ${checked ? "checked" : ""}>` : ""}
                  <span>${esc(ing.name)}: <strong>${esc(ing.scaled_amount)}</strong> ${esc(ing.unit)}</span>
                </label>
                <label style="font-size:12px;color:#7c5c46;display:flex;align-items:center;gap:4px;cursor:pointer;">
                  <input type="checkbox" class="js-pantry-toggle" data-recipe-id="${recipeId}" data-key="${esc(ing.key)}" ${ing.in_pantry ? "checked" : ""}>
                  <span>Đã có ở bếp</span>
                </label>
              </div>
              ${hasProd ? `<div style="font-size:12.5px;color:#7c5c46;margin-top:4px;padding-left:24px;">Đề xuất mua: <strong>${ing.packs_needed} &times; ${esc(ing.variant.short_label)}</strong> (${fmt(ing.variant.price * ing.packs_needed)})${ing.surplus > 0 ? ` · Dư dự kiến ${esc(ing.surplus)} ${esc(ing.unit)}` : ""}</div>` : (ing.note ? `<div style="font-size:12px;color:#9c7c65;margin-top:4px;">${esc(ing.note)}</div>` : "")}
            </div>
          `;
        }).join("");
        document.querySelectorAll(".js-combo-ing-check").forEach((c) => c.addEventListener("change", recalcComboTotal));
        bindPantryEvents();
      }
      recalcComboTotal();
    } catch (err) {
      window.BakeApp.showToast(err.message, "error");
    }
  }

  function bindPantryEvents() {
    document.querySelectorAll(".js-pantry-toggle").forEach((cb) => {
      cb.addEventListener("change", async () => {
        const key = cb.getAttribute("data-key");
        const owned = cb.checked;
        const row = cb.closest(".recipe-ing-row");
        const itemCheck = row ? row.querySelector(".js-combo-ing-check") : null;
        if (itemCheck) {
          itemCheck.checked = !owned;
          recalcComboTotal();
        }
        try {
          const res = await window.BakeApp.postJson("recipe", "ajaxTogglePantry", {
            recipe_id: recipeId,
            ingredient_key: key,
            owned: owned
          });
          window.BakeApp.showToast(res.message, "info");
        } catch (e) {}
      });
    });
  }
  bindPantryEvents();

  const btnMin = document.getElementById("btn-servings-minus");
  const btnPls = document.getElementById("btn-servings-plus");
  if (btnMin) btnMin.addEventListener("click", () => scaleServings((Number(servInput.value) || 1) - 1));
  if (btnPls) btnPls.addEventListener("click", () => scaleServings((Number(servInput.value) || 1) + 1));
  if (servInput) servInput.addEventListener("change", () => scaleServings(servInput.value));

  const addComboBtn = document.getElementById("btn-add-recipe-combo");
  if (addComboBtn) {
    addComboBtn.addEventListener("click", async () => {
      const items = [];
      document.querySelectorAll(".js-combo-ing-check:checked, .js-combo-tool-check:checked").forEach((cb) => {
        items.push({
          product_id: Number(cb.getAttribute("data-product-id")),
          option_index: Number(cb.getAttribute("data-option-index") || 0),
          quantity: Number(cb.getAttribute("data-qty") || 1)
        });
      });
      try {
        const res = await window.BakeApp.postJson("recipe", "ajaxAddComboToCart", {
          recipe_group_id: recipeSlug,
          items
        });
        window.BakeApp.updateBadges(res.data.cart_count);
        window.BakeApp.showToast(res.message, "success");
      } catch (err) {
        window.BakeApp.showToast(err.message, "error");
      }
    });
  }

  // Step Progress Bar
  const stepChecks = Array.from(document.querySelectorAll(".js-recipe-step-check"));
  const progBar = document.getElementById("recipe-progress-bar");
  const progTxt = document.getElementById("recipe-progress-text");
  const updateProgress = () => {
    const total = stepChecks.length || 1;
    const done = stepChecks.filter((c) => c.checked).length;
    const pct = Math.round((done / total) * 100);
    if (progBar) progBar.style.width = pct + "%";
    if (progTxt) progTxt.textContent = pct + "% hoàn thành";
  };
  stepChecks.forEach((c) => c.addEventListener("change", updateProgress));

  // Baking Countdown Timer
  const defaultSec = <?= (int) $recipe['bake_minutes'] * 60 ?>;
  let remainSec = defaultSec;
  let timerInt = null;
  const disp = document.getElementById("baking-timer-display");
  const renderTimer = () => {
    const m = Math.floor(remainSec / 60);
    const s = remainSec % 60;
    if (disp) disp.textContent = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  };
  document.getElementById("timer-start")?.addEventListener("click", () => {
    if (timerInt) return;
    timerInt = setInterval(() => {
      if (remainSec > 0) {
        remainSec -= 1;
        renderTimer();
      } else {
        clearInterval(timerInt);
        timerInt = null;
        window.BakeApp.showToast("Hết giờ nướng bánh! Kiểm tra lò ngay nhé.", "success");
      }
    }, 1000);
  });
  document.getElementById("timer-pause")?.addEventListener("click", () => {
    if (timerInt) { clearInterval(timerInt); timerInt = null; }
  });
  document.getElementById("timer-reset")?.addEventListener("click", () => {
    if (timerInt) { clearInterval(timerInt); timerInt = null; }
    remainSec = defaultSec;
    renderTimer();
  });
  document.getElementById("timer-minus5")?.addEventListener("click", () => {
    remainSec = Math.max(60, remainSec - 300);
    renderTimer();
  });
  document.getElementById("timer-plus5")?.addEventListener("click", () => {
    remainSec = Math.min(7200, remainSec + 300);
    renderTimer();
  });
});
</script>
<?php endif; ?>
