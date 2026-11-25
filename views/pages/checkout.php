<?php
declare(strict_types=1);
$defaultAddr = $addresses[0] ?? null;
$initName = (string) ($defaultAddr['recipient_name'] ?? ($currentUser['full_name'] ?? ''));
$initPhone = (string) ($defaultAddr['phone'] ?? ($currentUser['phone'] ?? ''));
$initProvince = (string) ($defaultAddr['province'] ?? 'TP. Hồ Chí Minh');
$initDistrict = (string) ($defaultAddr['district'] ?? 'Quận 3');
$initWard = (string) ($defaultAddr['ward'] ?? 'Phường Võ Thị Sáu');
$initStreet = (string) ($defaultAddr['street_address'] ?? '');
?>
<main class="page-container">
  <nav class="breadcrumb" aria-label="Đường dẫn điều hướng">
    <ul class="breadcrumb__list">
      <li class="breadcrumb__item"><a href="<?= App::e(App::url('')) ?>">Trang chủ</a></li>
      <li class="breadcrumb__separator">/</li>
      <li class="breadcrumb__item"><a href="<?= App::e(App::url('?c=order&a=cart')) ?>">Giỏ hàng</a></li>
      <li class="breadcrumb__separator">/</li>
      <li class="breadcrumb__item active">Thanh toán</li>
    </ul>
  </nav>

  <div class="cart-page__header">
    <div>
      <h1 class="cart-page__title">Thanh toán đơn hàng</h1>
      <p class="cart-page__subtitle">Xác nhận địa chỉ giao nhận, chọn gói vận chuyển phù hợp và hoàn tất thanh toán.</p>
    </div>
    <span class="cart-page__count-pill"><?= (int) ($summary['selected_count'] ?? 0) ?> sản phẩm được chọn</span>
  </div>

  <nav class="checkout-progress" aria-label="Tiến trình đặt hàng">
    <div class="checkout-progress__step is-done">
      <span class="checkout-progress__num">1</span>
      <span>Giỏ hàng</span>
    </div>
    <div class="checkout-progress__step is-active" aria-current="step">
      <span class="checkout-progress__num">2</span>
      <span>Thông tin &amp; Thanh toán</span>
    </div>
    <div class="checkout-progress__step">
      <span class="checkout-progress__num">3</span>
      <span>Hoàn tất đơn hàng</span>
    </div>
  </nav>

  <?php if (empty($summary['items'])): ?>
    <section class="cart-empty">
      <h2 class="cart-empty__title">Bạn chưa có sản phẩm nào cần thanh toán</h2>
      <p class="cart-empty__desc">Hãy chọn nguyên liệu hoặc combo công thức trong giỏ hàng trước khi tiến hành thanh toán nhé.</p>
      <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:12px;">
        <a href="<?= App::e(App::url('?c=order&a=cart')) ?>" class="btn btn--primary">Quay lại giỏ hàng</a>
        <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="btn btn--outline-dark">Khám phá sản phẩm</a>
        <a href="<?= App::e(App::url('?c=order&a=orders')) ?>" class="btn btn--outline-dark">Xem đơn hàng đã đặt</a>
      </div>
    </section>
  <?php else: ?>
    <section class="checkout-address-banner" style="flex-wrap:wrap;" aria-label="Địa chỉ nhận hàng">
      <div style="flex:1;min-width:250px;">
        <div class="checkout-address-banner__title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span>Địa Chỉ Nhận Hàng</span>
        </div>
        <div id="active-address-display" class="checkout-address-banner__meta">
          <?= $initName !== '' ? App::e($initName . ($initPhone !== '' ? ' (' . $initPhone . ')' : '') . ' — ') : '' ?>
          <?= App::e(trim(($initStreet !== '' ? $initStreet . ', ' : '') . $initWard . ', ' . $initDistrict . ', ' . $initProvince, ', ')) ?>
        </div>
      </div>
      <button type="button" id="btn-open-addr-modal" class="btn btn--outline-dark" style="white-space:nowrap;">
        + Thêm / Thay đổi địa chỉ
      </button>
    </section>

    <form id="checkout-form" class="cart-layout">
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div class="cart-items-panel">
          <div class="cart-panel__head">
            <h2 class="cart-panel__title">Thông tin người nhận &amp; Giao hàng</h2>
          </div>

          <?php if (!empty($summary['has_perishable'])): ?>
            <div class="checkout-perishable-alert" style="margin-bottom:14px;">
              Đơn hàng có <strong>hàng tươi bảo quản lạnh</strong> (Bơ/Whipping Cream/Trứng). Hệ thống tự động kiểm tra vùng giao nội thành TP.HCM ở cả trình duyệt và máy chủ.
            </div>
          <?php endif; ?>

          <div style="display:grid;gap:14px;">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;">
              <div class="form-group" style="margin:0;">
                <label for="co-name" class="form-label">Họ và tên người nhận <span class="required-mark">*</span></label>
                <input id="co-name" name="customer_name" type="text" class="form-input" value="<?= App::e($initName) ?>" required>
              </div>
              <div class="form-group" style="margin:0;">
                <label for="co-phone" class="form-label">Số điện thoại (10 số VN) <span class="required-mark">*</span></label>
                <input id="co-phone" name="customer_phone" type="tel" class="form-input" value="<?= App::e($initPhone) ?>" required>
              </div>
            </div>
            <div class="form-group" style="margin:0;">
              <label for="co-email" class="form-label">Email nhận hóa đơn</label>
              <input id="co-email" name="customer_email" type="email" class="form-input" value="<?= App::e($currentUser['email'] ?? '') ?>">
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;">
              <div class="form-group" style="margin:0;">
                <label for="co-province" class="form-label">Tỉnh / Thành phố <span class="required-mark">*</span></label>
                <select id="co-province" name="province" class="form-input" required></select>
              </div>
              <div class="form-group" style="margin:0;">
                <label for="co-district" class="form-label">Quận / Huyện <span class="required-mark">*</span></label>
                <select id="co-district" name="district" class="form-input" required></select>
              </div>
              <div class="form-group" style="margin:0;">
                <label for="co-ward" class="form-label">Phường / Xã <span class="required-mark">*</span></label>
                <select id="co-ward" name="ward" class="form-input" required></select>
              </div>
            </div>

            <div class="form-group" style="margin:0;">
              <label for="co-street" class="form-label">Số nhà, tên đường cụ thể <span class="required-mark">*</span></label>
              <input id="co-street" name="street_address" type="text" class="form-input" value="<?= App::e($initStreet) ?>" placeholder="Ví dụ: 59C Nguyễn Đình Chiểu" required>
            </div>
          </div>
        </div>

        <div class="cart-items-panel">
          <div class="cart-panel__head" style="margin-bottom:12px;">
            <h2 class="cart-panel__title">Phương thức vận chuyển</h2>
            <span id="checkout-zone-badge" class="cart-page__count-pill"><?= App::e($initProvince) ?></span>
          </div>
          <p style="font-size:13px;color:var(--accent-sub);margin-bottom:12px;">
            Tùy chọn vận chuyển được cập nhật tự động theo khu vực địa chỉ nhận hàng bạn đang chọn.
          </p>
          <div id="co-perishable-block" class="checkout-perishable-alert is-blocked" hidden style="margin-bottom:12px;"></div>
          <div id="co-shipping-methods" style="display:flex;flex-direction:column;gap:10px;"></div>
        </div>

        <div class="cart-items-panel">
          <div class="cart-panel__head" style="margin-bottom:12px;">
            <h2 class="cart-panel__title">Lời nhắn &amp; Phương thức thanh toán</h2>
          </div>

          <div class="form-group">
            <label for="co-note" class="form-label">Lời nhắn cho Shop</label>
            <textarea id="co-note" name="note" rows="2" class="form-input" placeholder="Ví dụ: Giao giờ hành chính, đóng gói riêng kem lạnh..."></textarea>
          </div>

          <div class="payment-method-box" style="margin-top:8px;">
            <span class="form-label">Phương thức thanh toán</span>
            <label class="payment-option" style="margin-bottom:8px;">
              <input type="radio" name="payment_method" value="cod" checked>
              <span>
                <strong>Thanh toán khi nhận hàng (COD)</strong>
                <small>Kiểm tra đủ quy cách sản phẩm trước khi thanh toán tiền mặt.</small>
              </span>
            </label>
            <label class="payment-option" style="margin-bottom:8px;">
              <input type="radio" name="payment_method" value="vietqr">
              <span>
                <strong>Chuyển khoản ngân hàng (VietQR)</strong>
                <small>Hiển thị mã QR quét nhanh với đúng số tiền &amp; nội dung đơn hàng.</small>
              </span>
            </label>
            <label class="payment-option">
              <input type="radio" name="payment_method" value="ewallet">
              <span>
                <strong>Ví điện tử (MoMo / VNPAY / ZaloPay)</strong>
                <small>Chọn ví liên kết để hoàn tất giao dịch trực tuyến.</small>
              </span>
            </label>
            <div id="co-ewallet-wrap" hidden style="padding:8px 0 0 26px;">
              <select name="ewallet_provider" class="form-input" style="max-width:240px;">
                <option value="MoMo">Ví MoMo</option>
                <option value="VNPAY">Cổng VNPAY-QR</option>
                <option value="ZaloPay">Ví ZaloPay</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <aside class="cart-summary-panel">
        <div class="cart-summary-card" style="position:sticky;top:24px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:2px solid var(--secondary-color);padding-bottom:10px;margin-bottom:14px;">
            <h2 style="font-size:18px;font-weight:700;color:var(--primary-color);margin:0;">Đơn hàng (<?= (int) $summary['selected_count'] ?> món)</h2>
            <a href="<?= App::e(App::url('?c=order&a=cart')) ?>" style="font-size:13px;font-weight:700;color:var(--accent-cta);">Chỉnh sửa giỏ &rarr;</a>
          </div>

          <div style="display:grid;gap:10px;max-height:280px;overflow-y:auto;margin-bottom:14px;border-bottom:1px solid #f0e4d3;padding-bottom:12px;">
            <?php foreach ($summary['items'] as $it): ?>
              <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:13.5px;">
                <div style="display:flex;align-items:center;gap:10px;min-width:0;">
                  <?php if (!empty($it['image'])): ?>
                    <img src="<?= App::e(App::asset($it['image'])) ?>" alt="" style="width:44px;height:44px;object-fit:cover;border-radius:8px;border:1px solid var(--secondary-color);flex-shrink:0;">
                  <?php endif; ?>
                  <div style="min-width:0;">
                    <strong style="color:var(--text-color);display:block;"><?= App::e($it['name']) ?></strong>
                    <div style="font-size:12px;color:var(--accent-sub);"><?= App::e($it['variant_label']) ?> &times; <?= (int) $it['quantity'] ?></div>
                  </div>
                </div>
                <strong style="color:var(--primary-color);white-space:nowrap;"><?= App::e(App::formatCurrency((int) $it['line_total'])) ?></strong>
              </div>
            <?php endforeach; ?>
          </div>

          <div class="cart-summary-row">
            <span>Tạm tính</span>
            <strong id="co-subtotal"><?= App::e(App::formatCurrency((int) $summary['selected_subtotal'])) ?></strong>
          </div>
          <div class="cart-summary-row">
            <span>Phí vận chuyển</span>
            <strong id="co-ship-fee"><?= App::e(App::formatCurrency((int) $summary['shipping_fee'])) ?></strong>
          </div>
          <div class="cart-summary-row cart-summary-row--discount">
            <span>Giảm giá áp dụng</span>
            <strong id="co-discount">&minus;<?= App::e(App::formatCurrency((int) $summary['discount_product'] + (int) $summary['discount_shipping'])) ?></strong>
          </div>
          <div class="cart-summary-row cart-summary-row--total">
            <span>Tổng thanh toán</span>
            <strong id="co-total"><?= App::e(App::formatCurrency((int) $summary['total_amount'])) ?></strong>
          </div>

          <button type="submit" id="btn-place-order" class="btn btn--primary btn--checkout btn--full" style="margin-top:16px;">Xác nhận đặt hàng</button>
        </div>
      </aside>
    </form>
  <?php endif; ?>
</main>

<!-- Modal thêm địa chỉ nhanh -->
<div class="bm-modal-backdrop" id="addr-modal" hidden>
  <div class="bm-modal">
    <div class="bm-modal__head">
      <h3>Thêm địa chỉ nhận hàng mới</h3>
      <button type="button" class="btn btn--outline btn--sm" id="btn-close-addr-modal">Đóng</button>
    </div>
    <form id="addr-modal-form" style="display:grid;gap:10px;">
      <input type="text" id="m-name" class="form-input" placeholder="Họ và tên người nhận" required>
      <input type="tel" id="m-phone" class="form-input" placeholder="Số điện thoại (09...)" required>
      <select id="m-prov" class="form-input" required></select>
      <select id="m-dist" class="form-input" required></select>
      <select id="m-ward" class="form-input" required></select>
      <input type="text" id="m-street" class="form-input" placeholder="Số nhà, tên đường..." required>
      <button type="submit" class="btn btn--primary">Lưu &amp; Áp dụng địa chỉ</button>
    </form>
  </div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
  const LOCATIONS = <?= $locationsJson ?? '{}' ?>;
  const provEl = document.getElementById("co-province");
  const distEl = document.getElementById("co-district");
  const wardEl = document.getElementById("co-ward");
  const nameEl = document.getElementById("co-name");
  const phoneEl = document.getElementById("co-phone");
  const streetEl = document.getElementById("co-street");
  const bannerMetaEl = document.getElementById("active-address-display");
  const zoneBadgeEl = document.getElementById("checkout-zone-badge");
  const shipWrap = document.getElementById("co-shipping-methods");
  const blockBox = document.getElementById("co-perishable-block");
  const placeBtn = document.getElementById("btn-place-order");

  function updateBannerMeta() {
    if (!bannerMetaEl || !provEl || !distEl || !wardEl) return;
    const nm = (nameEl?.value || "").trim();
    const ph = (phoneEl?.value || "").trim();
    const st = (streetEl?.value || "").trim();
    const prefix = nm ? (ph ? `${nm} (${ph}) — ` : `${nm} — `) : "";
    const parts = [st, wardEl.value, distEl.value, provEl.value].filter(Boolean);
    bannerMetaEl.textContent = prefix + parts.join(", ");
    if (zoneBadgeEl && provEl.value) zoneBadgeEl.textContent = provEl.value;
  }

  function fillCascade(pSel, dSel, wSel, defP, defD, defW, onSync) {
    if (!pSel || !dSel || !wSel) return;
    const provs = Object.keys(LOCATIONS);
    pSel.innerHTML = provs.map((p) => `<option value="${window.BakeApp.escapeHtml(p)}">${window.BakeApp.escapeHtml(p)}</option>`).join("");
    if (defP && LOCATIONS[defP]) pSel.value = defP;

    const updateDist = () => {
      const dists = Object.keys(LOCATIONS[pSel.value] || {});
      dSel.innerHTML = dists.map((d) => `<option value="${window.BakeApp.escapeHtml(d)}">${window.BakeApp.escapeHtml(d)}</option>`).join("");
      if (defD && dists.includes(defD)) dSel.value = defD;
      updateWard();
    };
    const updateWard = () => {
      const wards = ((LOCATIONS[pSel.value] || {})[dSel.value] || {}).wards || [];
      wSel.innerHTML = wards.map((w) => `<option value="${window.BakeApp.escapeHtml(w)}">${window.BakeApp.escapeHtml(w)}</option>`).join("");
      if (defW && wards.includes(defW)) wSel.value = defW;
    };
    if (!pSel.dataset.cascadeBound) {
      pSel.addEventListener("change", () => { updateDist(); if (onSync) onSync(); });
      dSel.addEventListener("change", () => { updateWard(); if (onSync) onSync(); });
      wSel.addEventListener("change", () => { if (onSync) onSync(); });
      pSel.dataset.cascadeBound = "1";
    }
    updateDist();
  }

  let selectedShipMethod = "fast";
  async function refreshShippingPreview() {
    updateBannerMeta();
    if (!provEl || !distEl) return;
    const url = window.BakeApp.apiUrl("order", "ajaxShippingPreview", {
      province: provEl.value,
      district: distEl.value,
      shipping_method: selectedShipMethod
    });
    const res = await fetch(url);
    const json = await res.json();
    const d = json.data || {};
    if (blockBox) {
      blockBox.hidden = !d.blocked;
      blockBox.textContent = d.reason || "";
    }
    if (placeBtn) placeBtn.disabled = Boolean(d.blocked);

    if (shipWrap) {
      const methods = d.methods || [];
      selectedShipMethod = d.selected_method || (methods[0] ? methods[0].id : "fast");
      shipWrap.innerHTML = methods.map((m) => `
        <label class="shipping-method-card ${m.id === selectedShipMethod ? "is-selected" : ""}">
          <span style="display:flex;align-items:center;gap:10px;">
            <input type="radio" name="shipping_method" value="${window.BakeApp.escapeHtml(m.id)}" ${m.id === selectedShipMethod ? "checked" : ""}>
            <span>
              <strong style="color:var(--text-color);">${window.BakeApp.escapeHtml(m.name)}</strong>
              <div style="font-size:12px;color:var(--accent-sub);">${window.BakeApp.escapeHtml(m.eta)}</div>
            </span>
          </span>
          <strong style="color:var(--primary-color);white-space:nowrap;">${m.fee === 0 ? "Miễn phí" : window.BakeApp.formatPrice(m.fee)}</strong>
        </label>
      `).join("");
      shipWrap.querySelectorAll('input[name="shipping_method"]').forEach((r) => {
        r.addEventListener("change", () => { selectedShipMethod = r.value; refreshShippingPreview(); });
      });
    }

    if (d.summary) {
      const s = d.summary;
      document.getElementById("co-ship-fee").textContent = window.BakeApp.formatPrice(s.shipping_fee);
      document.getElementById("co-discount").textContent = "−" + window.BakeApp.formatPrice((s.discount_product || 0) + (s.discount_shipping || 0));
      document.getElementById("co-total").textContent = window.BakeApp.formatPrice(s.total_amount);
    }
  }

  [nameEl, phoneEl, streetEl].forEach((inp) => {
    if (inp) inp.addEventListener("input", updateBannerMeta);
  });

  fillCascade(
    provEl,
    distEl,
    wardEl,
    <?= json_encode($initProvince) ?>,
    <?= json_encode($initDistrict) ?>,
    <?= json_encode($initWard) ?>,
    refreshShippingPreview
  );
  refreshShippingPreview();

  document.querySelectorAll('input[name="payment_method"]').forEach((r) => {
    r.addEventListener("change", () => {
      const ew = document.getElementById("co-ewallet-wrap");
      if (ew) ew.hidden = r.value !== "ewallet";
    });
  });

  const addrModal = document.getElementById("addr-modal");
  fillCascade(document.getElementById("m-prov"), document.getElementById("m-dist"), document.getElementById("m-ward"), "TP. Hồ Chí Minh", "Quận 3", "Phường Võ Thị Sáu");
  document.getElementById("btn-open-addr-modal")?.addEventListener("click", () => { if (addrModal) addrModal.hidden = false; });
  document.getElementById("btn-close-addr-modal")?.addEventListener("click", () => { if (addrModal) addrModal.hidden = true; });
  document.getElementById("addr-modal-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const res = await window.BakeApp.postJson("order", "ajaxSaveAddress", {
        recipient_name: document.getElementById("m-name").value,
        phone: document.getElementById("m-phone").value,
        province: document.getElementById("m-prov").value,
        district: document.getElementById("m-dist").value,
        ward: document.getElementById("m-ward").value,
        street_address: document.getElementById("m-street").value
      });
      const a = res.data.address;
      if (nameEl) nameEl.value = a.recipient_name;
      if (phoneEl) phoneEl.value = a.phone;
      if (streetEl) streetEl.value = a.street_address;
      fillCascade(provEl, distEl, wardEl, a.province, a.district, a.ward, refreshShippingPreview);
      refreshShippingPreview();
      addrModal.hidden = true;
      window.BakeApp.showToast(res.message, "success");
    } catch (err) {
      window.BakeApp.showToast(err.message, "error");
    }
  });

  const form = document.getElementById("checkout-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());
      payload.shipping_method = selectedShipMethod;
      try {
        placeBtn.disabled = true;
        const res = await window.BakeApp.postJson("order", "ajaxPlaceOrder", payload);
        window.location.href = res.data.redirect_url;
      } catch (err) {
        placeBtn.disabled = false;
        window.BakeApp.showToast(err.message, "error");
      }
    });
  }
});
</script>
