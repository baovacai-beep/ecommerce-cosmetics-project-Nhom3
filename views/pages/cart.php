<?php
declare(strict_types=1);
$items = $summary['items'] ?? [];
$retailItems = $summary['retail_items'] ?? [];
$comboGroups = $summary['combo_groups'] ?? [];
$totalQtyCount = 0;
foreach ($items as $itRow) {
    $totalQtyCount += (int) ($itRow['quantity'] ?? 0);
}
?>
<main class="page-container cart-page">
  <nav class="breadcrumb" aria-label="Đường dẫn điều hướng">
    <ul class="breadcrumb__list">
      <li class="breadcrumb__item"><a href="<?= App::e(App::url('')) ?>">Trang chủ</a></li>
      <li class="breadcrumb__separator">/</li>
      <li class="breadcrumb__item active">Giỏ hàng</li>
    </ul>
  </nav>

  <div class="cart-page__header">
    <div>
      <h1 class="cart-page__title">Giỏ hàng BakeMate của bạn</h1>
      <p class="cart-page__subtitle">Tick chọn các nguyên liệu lẻ hoặc combo Recipe-to-Cart bạn muốn đặt hàng trong lần này.</p>
    </div>
    <span class="cart-page__count-pill">
      <?= $totalQtyCount ?> sản phẩm · Đã chọn <?= (int) $summary['selected_count'] ?>
    </span>
  </div>

  <div id="cart-root">
    <?php if (empty($items)): ?>
      <section class="cart-empty">
        <span class="cart-empty__icon" aria-hidden="true">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
        </span>
        <h2 class="cart-empty__title">Giỏ hàng BakeMate đang trống</h2>
        <p class="cart-empty__desc">Hãy khám phá nguyên liệu, dụng cụ làm bánh chất lượng hoặc chọn nhanh trọn bộ combo từ Thư viện công thức.</p>
        <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
          <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="btn btn--primary">Mua nguyên liệu</a>
          <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="btn btn--outline-dark">Chọn theo công thức</a>
        </div>
      </section>
    <?php else: ?>
      <div class="cart-layout">
        <section class="cart-items-panel">
          <div class="cart-panel__head">
            <h2 class="cart-panel__title">Danh sách sản phẩm</h2>
            <span class="cart-page__count-pill">Đã chọn <?= (int) $summary['selected_count'] ?> sản phẩm</span>
          </div>

          <div class="cart-select-toolbar">
            <label style="display:inline-flex;align-items:center;gap:8px;font-weight:700;color:var(--primary-color);cursor:pointer;">
              <input type="checkbox" id="cart-select-all" <?= !empty($summary['all_selected']) ? 'checked' : '' ?>>
              <span>Chọn tất cả sản phẩm (<?= count($items) ?> dòng)</span>
            </label>
            <span style="font-size:13px;color:var(--accent-sub);">Chọn riêng từng món hoặc theo nhóm công thức</span>
          </div>

          <div class="cart-grid-head" aria-hidden="true">
            <span>Sản phẩm</span>
            <span>Đơn giá</span>
            <span>Số lượng</span>
            <span>Thành tiền</span>
            <span>Thao tác</span>
          </div>

          <div class="cart-groups-list">
            <?php if (!empty($retailItems)): ?>
              <div class="cart-group--standalone">
                <div class="cart-group__header">
                  <div class="cart-group__title-wrap">
                    <span class="cart-group__badge">Mua lẻ</span>
                    <h3 class="cart-group__title">Nguyên liệu &amp; Dụng cụ chọn lẻ</h3>
                  </div>
                  <span class="cart-group__subtotal"><?= count($retailItems) ?> món</span>
                </div>
                <div class="cart-group__items">
                  <?php foreach ($retailItems as $it): ?>
                    <div class="cart-item">
                      <div class="cart-item__cell cart-item__product">
                        <input type="checkbox" class="js-cart-item-check"
                               aria-label="Chọn <?= App::e($it['name']) ?>"
                               data-product-id="<?= (int) $it['product_id'] ?>"
                               data-option-index="<?= (int) $it['option_index'] ?>"
                               data-group=""
                               <?= !empty($it['is_selected']) ? 'checked' : '' ?>>
                        <a href="<?= App::e(App::url('?c=product&a=detail&id=' . (int) $it['product_id'])) ?>" class="cart-item__thumb-link">
                          <img src="<?= App::e(App::asset($it['image'])) ?>" alt="<?= App::e($it['name']) ?>" class="cart-item__img">
                        </a>
                        <div class="cart-item__meta">
                          <a href="<?= App::e(App::url('?c=product&a=detail&id=' . (int) $it['product_id'])) ?>" class="cart-item__name"><?= App::e($it['name']) ?></a>
                          <span class="cart-item__category">
                            Quy cách: <?= App::e($it['variant_label']) ?><?= !empty($it['is_perishable']) ? ' · Tươi lạnh (Nội thành HCM)' : '' ?>
                          </span>
                        </div>
                      </div>
                      <div class="cart-item__cell cart-item__price">
                        <?= App::e(App::formatCurrency((int) $it['unit_price'])) ?>
                      </div>
                      <div class="cart-item__cell cart-item__qty-cell">
                        <div class="cart-qty-control">
                          <button type="button" class="qty-btn js-cart-qty-minus"
                                  aria-label="Giảm số lượng"
                                  data-product-id="<?= (int) $it['product_id'] ?>"
                                  data-option-index="<?= (int) $it['option_index'] ?>"
                                  data-group=""
                                  data-qty="<?= (int) $it['quantity'] ?>">&minus;</button>
                          <input type="number" min="0" max="99" value="<?= (int) $it['quantity'] ?>"
                                 class="qty-input js-cart-qty-input"
                                 aria-label="Số lượng <?= App::e($it['name']) ?>"
                                 data-product-id="<?= (int) $it['product_id'] ?>"
                                 data-option-index="<?= (int) $it['option_index'] ?>"
                                 data-group="">
                          <button type="button" class="qty-btn js-cart-qty-plus"
                                  aria-label="Tăng số lượng"
                                  data-product-id="<?= (int) $it['product_id'] ?>"
                                  data-option-index="<?= (int) $it['option_index'] ?>"
                                  data-group=""
                                  data-qty="<?= (int) $it['quantity'] ?>">+</button>
                        </div>
                      </div>
                      <div class="cart-item__cell cart-item__subtotal">
                        <strong><?= App::e(App::formatCurrency((int) $it['line_total'])) ?></strong>
                      </div>
                      <div class="cart-item__cell">
                        <button type="button" class="btn-remove-item js-cart-remove"
                                data-product-id="<?= (int) $it['product_id'] ?>"
                                data-option-index="<?= (int) $it['option_index'] ?>"
                                data-group="">Xóa</button>
                      </div>
                    </div>
                  <?php endforeach; ?>
                </div>
              </div>
            <?php endif; ?>

            <?php foreach ($comboGroups as $grp):
              $grpSubtotal = 0;
              foreach (($grp['items'] ?? []) as $git) {
                  $grpSubtotal += (int) ($git['line_total'] ?? 0);
              }
            ?>
              <div class="cart-group--recipe">
                <div class="cart-group__header">
                  <div class="cart-group__title-wrap">
                    <span class="cart-group__badge">Recipe-to-Cart</span>
                    <h3 class="cart-group__title"><?= App::e($grp['title']) ?></h3>
                  </div>
                  <div class="cart-group__meta">
                    <span class="cart-group__subtotal">Tổng combo: <strong><?= App::e(App::formatCurrency($grpSubtotal)) ?></strong></span>
                    <button type="button" class="btn-remove-combo js-remove-combo" data-group="<?= App::e($grp['recipe_group_id']) ?>">Xóa cả combo</button>
                  </div>
                </div>
                <div class="cart-group__items">
                  <?php foreach ($grp['items'] as $it): ?>
                    <div class="cart-item">
                      <div class="cart-item__cell cart-item__product">
                        <input type="checkbox" class="js-cart-item-check"
                               aria-label="Chọn <?= App::e($it['name']) ?>"
                               data-product-id="<?= (int) $it['product_id'] ?>"
                               data-option-index="<?= (int) $it['option_index'] ?>"
                               data-group="<?= App::e($grp['recipe_group_id']) ?>"
                               <?= !empty($it['is_selected']) ? 'checked' : '' ?>>
                        <a href="<?= App::e(App::url('?c=product&a=detail&id=' . (int) $it['product_id'])) ?>" class="cart-item__thumb-link">
                          <img src="<?= App::e(App::asset($it['image'])) ?>" alt="<?= App::e($it['name']) ?>" class="cart-item__img">
                        </a>
                        <div class="cart-item__meta">
                          <a href="<?= App::e(App::url('?c=product&a=detail&id=' . (int) $it['product_id'])) ?>" class="cart-item__name"><?= App::e($it['name']) ?></a>
                          <span class="cart-item__category">
                            Quy cách: <?= App::e($it['variant_label']) ?><?= !empty($it['is_perishable']) ? ' · Tươi lạnh' : '' ?>
                          </span>
                        </div>
                      </div>
                      <div class="cart-item__cell cart-item__price">
                        <?= App::e(App::formatCurrency((int) $it['unit_price'])) ?>
                      </div>
                      <div class="cart-item__cell cart-item__qty-cell">
                        <div class="cart-qty-control">
                          <button type="button" class="qty-btn js-cart-qty-minus"
                                  aria-label="Giảm số lượng"
                                  data-product-id="<?= (int) $it['product_id'] ?>"
                                  data-option-index="<?= (int) $it['option_index'] ?>"
                                  data-group="<?= App::e($grp['recipe_group_id']) ?>"
                                  data-qty="<?= (int) $it['quantity'] ?>">&minus;</button>
                          <input type="number" min="0" max="99" value="<?= (int) $it['quantity'] ?>"
                                 class="qty-input js-cart-qty-input"
                                 aria-label="Số lượng <?= App::e($it['name']) ?>"
                                 data-product-id="<?= (int) $it['product_id'] ?>"
                                 data-option-index="<?= (int) $it['option_index'] ?>"
                                 data-group="<?= App::e($grp['recipe_group_id']) ?>">
                          <button type="button" class="qty-btn js-cart-qty-plus"
                                  aria-label="Tăng số lượng"
                                  data-product-id="<?= (int) $it['product_id'] ?>"
                                  data-option-index="<?= (int) $it['option_index'] ?>"
                                  data-group="<?= App::e($grp['recipe_group_id']) ?>"
                                  data-qty="<?= (int) $it['quantity'] ?>">+</button>
                        </div>
                      </div>
                      <div class="cart-item__cell cart-item__subtotal">
                        <strong><?= App::e(App::formatCurrency((int) $it['line_total'])) ?></strong>
                      </div>
                      <div class="cart-item__cell">
                        <button type="button" class="btn-remove-item js-cart-remove"
                                data-product-id="<?= (int) $it['product_id'] ?>"
                                data-option-index="<?= (int) $it['option_index'] ?>"
                                data-group="<?= App::e($grp['recipe_group_id']) ?>">Xóa</button>
                      </div>
                    </div>
                  <?php endforeach; ?>
                </div>
              </div>
            <?php endforeach; ?>
          </div>

          <div class="cart-panel__footer">
            <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="btn btn--outline-dark">&larr; Mua thêm nguyên liệu</a>
            <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="btn btn--outline-dark">Xem thêm công thức</a>
          </div>
        </section>

        <!-- Cột phải: Mã giảm giá (Cộng dồn 2 mã) & Tóm tắt đơn -->
        <aside class="cart-summary-panel">
          <div class="cart-summary-card" style="position:sticky;top:24px;">
            <h2 class="cart-summary-card__title">Tóm tắt đơn hàng</h2>

            <div class="cart-coupon">
              <label for="cart-coupon-input" class="cart-coupon__label">Mã ưu đãi BakeMate (cộng dồn 2 mã)</label>
              <form id="cart-coupon-form" class="cart-coupon__row">
                <input type="text" id="cart-coupon-input" class="form-input cart-coupon__input" placeholder="Nhập CHAOBANMOI hoặc FREESHIP20">
                <button type="submit" class="btn btn--primary cart-coupon__btn">Áp dụng</button>
              </form>
              <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
                <button type="button" class="price-preset-btn js-cart-quick-voucher" data-code="CHAOBANMOI" style="font-size:11.5px;padding:4px 10px;">+ CHAOBANMOI</button>
                <button type="button" class="price-preset-btn js-cart-quick-voucher" data-code="FREESHIP20" style="font-size:11.5px;padding:4px 10px;">+ FREESHIP20</button>
              </div>
              <p id="cart-coupon-msg" style="font-size:12.5px;margin:8px 0 0;color:var(--accent-sub);">Hỗ trợ cộng dồn 1 mã giảm tiền hàng + 1 mã Freeship.</p>

              <?php if (!empty($summary['coupon_details'])): ?>
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;">
                  <?php foreach ($summary['coupon_details'] as $scope => $cInfo): ?>
                    <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:#ecfdf5;border:1px solid #bbf7d0;color:#166534;font-size:12px;font-weight:700;">
                      <?= App::e($cInfo['code']) ?>
                      <button type="button" class="js-remove-coupon" data-scope="<?= App::e($scope) ?>" style="border:none;background:none;color:#b91c1c;cursor:pointer;font-weight:800;line-height:1;">&times;</button>
                    </span>
                  <?php endforeach; ?>
                </div>
              <?php endif; ?>
            </div>

            <div class="cart-summary-row">
              <span>Tạm tính (món đã chọn)</span>
              <strong><?= App::e(App::formatCurrency((int) $summary['selected_subtotal'])) ?></strong>
            </div>
            <div class="cart-summary-row">
              <span>Phí vận chuyển tạm tính</span>
              <strong><?= App::e(App::formatCurrency((int) $summary['shipping_fee'])) ?></strong>
            </div>
            <?php if ((int) $summary['discount_product'] > 0): ?>
              <div class="cart-summary-row cart-summary-row--discount">
                <span>Giảm giá đơn hàng</span>
                <strong>&minus;<?= App::e(App::formatCurrency((int) $summary['discount_product'])) ?></strong>
              </div>
            <?php endif; ?>
            <?php if ((int) $summary['discount_shipping'] > 0): ?>
              <div class="cart-summary-row cart-summary-row--discount">
                <span>Giảm phí vận chuyển</span>
                <strong>&minus;<?= App::e(App::formatCurrency((int) $summary['discount_shipping'])) ?></strong>
              </div>
            <?php endif; ?>
            <div class="cart-summary-row cart-summary-row--total">
              <span>Tổng dự kiến</span>
              <strong><?= App::e(App::formatCurrency((int) $summary['total_amount'])) ?></strong>
            </div>

            <div style="margin-top:16px;display:grid;gap:10px;">
              <?php if ((int) $summary['selected_count'] > 0): ?>
                <a href="<?= App::e(App::url('?c=order&a=checkout')) ?>" class="btn btn--primary btn--checkout btn--full">Tiến hành thanh toán (<?= (int) $summary['selected_count'] ?> món)</a>
              <?php else: ?>
                <button type="button" class="btn btn--primary btn--checkout btn--full" disabled>Tick chọn ít nhất 1 món để thanh toán</button>
              <?php endif; ?>
              <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="btn btn--outline-dark btn--full">Tiếp tục mua sắm</a>
            </div>
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
  const cInput = document.getElementById("cart-coupon-input");
  const msgEl = document.getElementById("cart-coupon-msg");
  async function applyCouponCode(code) {
    try {
      const res = await window.BakeApp.postJson("order", "ajaxApplyCoupon", { code });
      window.BakeApp.showToast(res.message, "success");
      window.location.reload();
    } catch (err) {
      if (msgEl) { msgEl.textContent = err.message; msgEl.style.color = "#b91c1c"; }
    }
  }
  if (cForm) {
    cForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      await applyCouponCode((cInput ? cInput.value : "").trim());
    });
  }
  document.querySelectorAll(".js-cart-quick-voucher").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const code = btn.dataset.code || "";
      if (cInput) cInput.value = code;
      await applyCouponCode(code);
    });
  });

  document.querySelectorAll(".js-remove-coupon").forEach((b) => {
    b.addEventListener("click", async () => {
      await window.BakeApp.postJson("order", "ajaxRemoveCoupon", { scope: b.dataset.scope });
      window.location.reload();
    });
  });
});
</script>
