<?php
declare(strict_types=1);
$items = $summary['items'] ?? [];
$retailItems = $summary['retail_items'] ?? [];
$comboGroups = $summary['combo_groups'] ?? [];
?>
<main class="php-page-container">
  <h1 style="margin:0 0 18px;color:#70452b;">Giỏ hàng BakeMate của bạn</h1>

  <div id="cart-root">
    <?php if (empty($items)): ?>
      <div class="php-card" style="text-align:center;padding:52px 20px;background:#fff8ed;border:1.5px dashed #c88b52;">
        <h2 style="color:#70452b;margin-top:0;">Giỏ hàng đang trống</h2>
        <p style="color:#7c5c46;margin-bottom:20px;">Hãy chọn nguyên liệu lẻ hoặc thêm trọn bộ combo công thức để bắt đầu làm bánh.</p>
        <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
          <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="btn btn--primary">Mua nguyên liệu</a>
          <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="btn btn--outline-dark">Chọn theo công thức</a>
        </div>
      </div>
    <?php else: ?>
      <div class="php-grid-main-aside">
        <section style="display:grid;gap:18px;">
          <div class="php-card" style="padding:12px 18px;display:flex;justify-content:space-between;align-items:center;">
            <label style="display:flex;align-items:center;gap:8px;font-weight:700;color:#70452b;cursor:pointer;">
              <input type="checkbox" id="cart-select-all" <?= !empty($summary['all_selected']) ? 'checked' : '' ?>>
              <span>Chọn tất cả sản phẩm (<?= count($items) ?> dòng)</span>
            </label>
            <span style="font-size:13px;color:#7c5c46;">Đã chọn <?= (int) $summary['selected_count'] ?> sản phẩm</span>
          </div>

          <?php if (!empty($retailItems)): ?>
            <div class="php-card" style="display:grid;gap:12px;">
              <h2 style="margin:0 0 4px;font-size:17px;color:#70452b;">Sản phẩm mua lẻ</h2>
              <?php foreach ($retailItems as $it): ?>
                <div class="cart-item-row" style="display:grid;grid-template-columns:auto 72px 1fr auto auto;gap:14px;align-items:center;padding:10px 0;border-bottom:1px solid #f2e5d5;">
                  <input type="checkbox" class="js-cart-item-check"
                         data-product-id="<?= (int) $it['product_id'] ?>"
                         data-option-index="<?= (int) $it['option_index'] ?>"
                         data-group=""
                         <?= !empty($it['is_selected']) ? 'checked' : '' ?>>
                  <img src="<?= App::e(App::asset($it['image'])) ?>" alt="" style="width:72px;height:72px;object-fit:cover;border-radius:10px;">
                  <div>
                    <a href="<?= App::e(App::url('?c=product&a=detail&id=' . (int) $it['product_id'])) ?>" style="font-weight:700;color:#70452b;text-decoration:none;"><?= App::e($it['name']) ?></a>
                    <div style="font-size:12.5px;color:#7c5c46;">Quy cách: <?= App::e($it['variant_label']) ?><?= !empty($it['is_perishable']) ? ' · Tươi lạnh' : '' ?></div>
                    <div style="font-size:13.5px;font-weight:700;color:#c88b52;margin-top:4px;"><?= App::e(App::formatCurrency((int) $it['unit_price'])) ?></div>
                  </div>
                  <div style="display:inline-flex;align-items:center;border:1px solid #d6bea1;border-radius:8px;">
                    <button type="button" class="btn btn--outline btn--sm js-cart-qty-minus" style="border:none;"
                            data-product-id="<?= (int) $it['product_id'] ?>"
                            data-option-index="<?= (int) $it['option_index'] ?>"
                            data-group=""
                            data-qty="<?= (int) $it['quantity'] ?>">−</button>
                    <input type="number" min="0" max="99" value="<?= (int) $it['quantity'] ?>"
                           class="js-cart-qty-input"
                           data-product-id="<?= (int) $it['product_id'] ?>"
                           data-option-index="<?= (int) $it['option_index'] ?>"
                           data-group=""
                           style="width:46px;text-align:center;border:none;font-weight:700;">
                    <button type="button" class="btn btn--outline btn--sm js-cart-qty-plus" style="border:none;"
                            data-product-id="<?= (int) $it['product_id'] ?>"
                            data-option-index="<?= (int) $it['option_index'] ?>"
                            data-group=""
                            data-qty="<?= (int) $it['quantity'] ?>">+</button>
                  </div>
                  <div style="text-align:right;">
                    <div style="font-weight:800;color:#70452b;"><?= App::e(App::formatCurrency((int) $it['line_total'])) ?></div>
                    <button type="button" class="btn btn--outline btn--sm js-cart-remove" style="margin-top:6px;font-size:11.5px;"
                            data-product-id="<?= (int) $it['product_id'] ?>"
                            data-option-index="<?= (int) $it['option_index'] ?>"
                            data-group="">Xóa</button>
                  </div>
                </div>
              <?php endforeach; ?>
            </div>
          <?php endif; ?>

          <?php foreach ($comboGroups as $grp): ?>
            <div style="background:#fff8ed;border:2px dashed #c88b52;border-radius:14px;padding:18px;display:grid;gap:12px;">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;border-bottom:1px solid #ebd5b7;padding-bottom:10px;">
                <div>
                  <span style="font-size:11.5px;font-weight:700;color:#c88b52;text-transform:uppercase;">Combo công thức Recipe-to-Cart</span>
                  <h2 style="margin:2px 0 0;font-size:17.5px;color:#70452b;"><?= App::e($grp['title']) ?></h2>
                </div>
                <button type="button" class="btn btn--outline btn--sm js-remove-combo" data-group="<?= App::e($grp['recipe_group_id']) ?>">Xóa cả combo</button>
              </div>
              <?php foreach ($grp['items'] as $it): ?>
                <div style="display:grid;grid-template-columns:auto 64px 1fr auto auto;gap:12px;align-items:center;">
                  <input type="checkbox" class="js-cart-item-check"
                         data-product-id="<?= (int) $it['product_id'] ?>"
                         data-option-index="<?= (int) $it['option_index'] ?>"
                         data-group="<?= App::e($grp['recipe_group_id']) ?>"
                         <?= !empty($it['is_selected']) ? 'checked' : '' ?>>
                  <img src="<?= App::e(App::asset($it['image'])) ?>" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:8px;">
                  <div>
                    <a href="<?= App::e(App::url('?c=product&a=detail&id=' . (int) $it['product_id'])) ?>" style="font-weight:700;color:#70452b;text-decoration:none;"><?= App::e($it['name']) ?></a>
                    <div style="font-size:12.5px;color:#7c5c46;"><?= App::e($it['variant_label']) ?> · <?= App::e(App::formatCurrency((int) $it['unit_price'])) ?></div>
                  </div>
                  <div style="display:inline-flex;align-items:center;border:1px solid #d6bea1;border-radius:8px;background:#fff;">
                    <button type="button" class="btn btn--outline btn--sm js-cart-qty-minus" style="border:none;"
                            data-product-id="<?= (int) $it['product_id'] ?>"
                            data-option-index="<?= (int) $it['option_index'] ?>"
                            data-group="<?= App::e($grp['recipe_group_id']) ?>"
                            data-qty="<?= (int) $it['quantity'] ?>">−</button>
                    <input type="number" min="0" max="99" value="<?= (int) $it['quantity'] ?>"
                           class="js-cart-qty-input"
                           data-product-id="<?= (int) $it['product_id'] ?>"
                           data-option-index="<?= (int) $it['option_index'] ?>"
                           data-group="<?= App::e($grp['recipe_group_id']) ?>"
                           style="width:44px;text-align:center;border:none;font-weight:700;">
                    <button type="button" class="btn btn--outline btn--sm js-cart-qty-plus" style="border:none;"
                            data-product-id="<?= (int) $it['product_id'] ?>"
                            data-option-index="<?= (int) $it['option_index'] ?>"
                            data-group="<?= App::e($grp['recipe_group_id']) ?>"
                            data-qty="<?= (int) $it['quantity'] ?>">+</button>
                  </div>
                  <strong style="color:#70452b;"><?= App::e(App::formatCurrency((int) $it['line_total'])) ?></strong>
                </div>
              <?php endforeach; ?>
            </div>
          <?php endforeach; ?>
        </section>

        <!-- Cột phải: Mã giảm giá (Cộng dồn 2 mã) & Tóm tắt đơn -->
        <aside class="php-card" style="position:sticky;top:20px;">
          <h2 style="margin:0 0 14px;color:#70452b;font-size:19px;">Tóm tắt đơn hàng</h2>

          <form id="cart-coupon-form" style="display:flex;gap:8px;margin-bottom:10px;">
            <input type="text" id="cart-coupon-input" class="form-input" placeholder="Nhập mã (CHAOBANMOI, FREESHIP20)">
            <button type="submit" class="btn btn--primary btn--sm">Áp dụng</button>
          </form>
          <p id="cart-coupon-msg" style="font-size:12.5px;margin:0 0 12px;color:#7c5c46;">Hỗ trợ cộng dồn 1 mã giảm tiền hàng + 1 mã Freeship.</p>

          <?php if (!empty($summary['coupon_details'])): ?>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;">
              <?php foreach ($summary['coupon_details'] as $scope => $cInfo): ?>
                <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:#ecfdf5;color:#166534;font-size:12px;font-weight:700;">
                  <?= App::e($cInfo['code']) ?>
                  <button type="button" class="js-remove-coupon" data-scope="<?= App::e($scope) ?>" style="border:none;background:none;color:#b91c1c;cursor:pointer;font-weight:800;">&times;</button>
                </span>
              <?php endforeach; ?>
            </div>
          <?php endif; ?>

          <div style="display:grid;gap:8px;font-size:14px;color:#4a2d1b;border-top:1px solid #f0e4d3;padding-top:12px;">
            <div style="display:flex;justify-content:space-between;">
              <span>Tạm tính (món đã chọn)</span>
              <strong><?= App::e(App::formatCurrency((int) $summary['selected_subtotal'])) ?></strong>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span>Phí vận chuyển tạm tính</span>
              <strong><?= App::e(App::formatCurrency((int) $summary['shipping_fee'])) ?></strong>
            </div>
            <?php if ((int) $summary['discount_product'] > 0): ?>
              <div style="display:flex;justify-content:space-between;color:#166534;">
                <span>Giảm giá đơn hàng</span>
                <strong>−<?= App::e(App::formatCurrency((int) $summary['discount_product'])) ?></strong>
              </div>
            <?php endif; ?>
            <?php if ((int) $summary['discount_shipping'] > 0): ?>
              <div style="display:flex;justify-content:space-between;color:#166534;">
                <span>Giảm phí vận chuyển</span>
                <strong>−<?= App::e(App::formatCurrency((int) $summary['discount_shipping'])) ?></strong>
              </div>
            <?php endif; ?>
            <div style="display:flex;justify-content:space-between;border-top:1px solid #ebd9c3;padding-top:10px;font-size:18px;color:#70452b;">
              <strong>Tổng dự kiến</strong>
              <strong><?= App::e(App::formatCurrency((int) $summary['total_amount'])) ?></strong>
            </div>
          </div>

          <div style="margin-top:18px;display:grid;gap:10px;">
            <?php if ((int) $summary['selected_count'] > 0): ?>
              <a href="<?= App::e(App::url('?c=order&a=checkout')) ?>" class="btn btn--primary btn--full">Tiến hành thanh toán (<?= (int) $summary['selected_count'] ?> món)</a>
            <?php else: ?>
              <button type="button" class="btn btn--primary btn--full" disabled>Tick chọn ít nhất 1 món để thanh toán</button>
            <?php endif; ?>
            <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="btn btn--outline btn--full">Tiếp tục mua sắm</a>
          </div>
        </aside>
      </div>
    <?php endif; ?>
  </div>
</main>

<script>
document.addEventListener("DOMContentLoaded", function () {
  async function updateQty(pid, opt, grp, newQty) {
    if (newQty <= 0) {
      const ok = await window.BakeApp.showConfirm("Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?", "Xóa sản phẩm");
      if (!ok) { window.location.reload(); return; }
    }
    try {
      await window.BakeApp.postJson("order", "ajaxCartUpdate", { product_id: pid, option_index: opt, recipe_group_id: grp, quantity: newQty });
      window.location.reload();
    } catch (err) {
      window.BakeApp.showToast(err.message, "error");
    }
  }

  document.querySelectorAll(".js-cart-qty-minus").forEach((b) => {
    b.addEventListener("click", () => updateQty(Number(b.dataset.productId), Number(b.dataset.optionIndex), b.dataset.group, Number(b.dataset.qty) - 1));
  });
  document.querySelectorAll(".js-cart-qty-plus").forEach((b) => {
    b.addEventListener("click", () => updateQty(Number(b.dataset.productId), Number(b.dataset.optionIndex), b.dataset.group, Number(b.dataset.qty) + 1));
  });
  document.querySelectorAll(".js-cart-qty-input").forEach((inp) => {
    inp.addEventListener("change", () => updateQty(Number(inp.dataset.productId), Number(inp.dataset.optionIndex), inp.dataset.group, parseInt(inp.value, 10) || 0));
  });

  document.querySelectorAll(".js-cart-remove").forEach((b) => {
    b.addEventListener("click", async () => {
      const ok = await window.BakeApp.showConfirm("Xác nhận bỏ sản phẩm này khỏi giỏ hàng?");
      if (!ok) return;
      await window.BakeApp.postJson("order", "ajaxCartRemove", { product_id: Number(b.dataset.productId), option_index: Number(b.dataset.optionIndex), recipe_group_id: b.dataset.group });
      window.location.reload();
    });
  });

  document.querySelectorAll(".js-remove-combo").forEach((b) => {
    b.addEventListener("click", async () => {
      const ok = await window.BakeApp.showConfirm("Xóa toàn bộ sản phẩm trong combo công thức này?");
      if (!ok) return;
      await window.BakeApp.postJson("order", "ajaxCartRemoveCombo", { recipe_group_id: b.dataset.group });
      window.location.reload();
    });
  });

  const selAll = document.getElementById("cart-select-all");
  if (selAll) {
    selAll.addEventListener("change", async () => {
      await window.BakeApp.postJson("order", "ajaxCartSelect", { targets: ["ALL"], selected: selAll.checked });
      window.location.reload();
    });
  }

  document.querySelectorAll(".js-cart-item-check").forEach((cb) => {
    cb.addEventListener("change", async () => {
      await window.BakeApp.postJson("order", "ajaxCartSelect", {
        targets: [{ product_id: Number(cb.dataset.productId), option_index: Number(cb.dataset.optionIndex), recipe_group_id: cb.dataset.group }],
        selected: cb.checked
      });
      window.location.reload();
    });
  });

  const cForm = document.getElementById("cart-coupon-form");
  if (cForm) {
    cForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const code = document.getElementById("cart-coupon-input").value.trim();
      const msgEl = document.getElementById("cart-coupon-msg");
      try {
        const res = await window.BakeApp.postJson("order", "ajaxApplyCoupon", { code });
        window.BakeApp.showToast(res.message, "success");
        window.location.reload();
      } catch (err) {
        if (msgEl) { msgEl.textContent = err.message; msgEl.style.color = "#b91c1c"; }
      }
    });
  }

  document.querySelectorAll(".js-remove-coupon").forEach((b) => {
    b.addEventListener("click", async () => {
      await window.BakeApp.postJson("order", "ajaxRemoveCoupon", { scope: b.dataset.scope });
      window.location.reload();
    });
  });
});
</script>
