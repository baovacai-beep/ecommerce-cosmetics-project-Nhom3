<?php
declare(strict_types=1);
$defaultAddr = $addresses[0] ?? null;
?>
<main class="php-page-container">
  <div class="checkout-progress" role="list" aria-label="Tiến trình đặt hàng" style="margin-bottom:22px;">
    <div class="checkout-progress__step is-done">1. Giỏ hàng</div>
    <div class="checkout-progress__step is-active">2. Thông tin &amp; Thanh toán</div>
    <div class="checkout-progress__step">3. Hoàn tất</div>
  </div>

  <?php if (empty($summary['items'])): ?>
    <div class="php-card" style="text-align:center;padding:48px 20px;background:#fff8ed;border:1.5px dashed #c88b52;">
      <h1 style="color:#70452b;margin-top:0;">Chưa có sản phẩm nào được chọn để thanh toán</h1>
      <a href="<?= App::e(App::url('?c=order&a=cart')) ?>" class="btn btn--primary">Quay lại Giỏ hàng</a>
    </div>
  <?php else: ?>
    <form id="checkout-form" class="php-grid-main-aside">
      <section style="display:grid;gap:20px;">
        <div class="php-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
            <h2 style="margin:0;color:#70452b;font-size:19px;">Địa chỉ nhận hàng</h2>
            <button type="button" class="btn btn--outline btn--sm" id="btn-open-addr-modal">+ Thêm / Sửa địa chỉ</button>
          </div>

          <?php if (!empty($summary['has_perishable'])): ?>
            <div style="padding:10px 14px;border-radius:8px;background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af;font-size:13px;margin-bottom:14px;">
              Đơn hàng có <strong>hàng tươi bảo quản lạnh</strong> (Bơ/Whipping Cream/Trứng). Hệ thống tự động kiểm tra vùng giao nội thành TP.HCM ở cả trình duyệt và máy chủ.
            </div>
          <?php endif; ?>

          <div style="display:grid;gap:12px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
              <div>
                <label for="co-name" style="font-size:13px;font-weight:700;color:#70452b;">Họ và tên người nhận *</label>
                <input id="co-name" name="customer_name" type="text" class="form-input" value="<?= App::e($defaultAddr['recipient_name'] ?? ($currentUser['full_name'] ?? '')) ?>" required>
              </div>
              <div>
                <label for="co-phone" style="font-size:13px;font-weight:700;color:#70452b;">Số điện thoại (10 số VN) *</label>
                <input id="co-phone" name="customer_phone" type="tel" class="form-input" value="<?= App::e($defaultAddr['phone'] ?? ($currentUser['phone'] ?? '')) ?>" required>
              </div>
            </div>
            <div>
              <label for="co-email" style="font-size:13px;font-weight:700;color:#70452b;">Email nhận hóa đơn</label>
              <input id="co-email" name="customer_email" type="email" class="form-input" value="<?= App::e($currentUser['email'] ?? '') ?>">
            </div>

            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
              <div>
                <label for="co-province" style="font-size:12.5px;font-weight:700;color:#70452b;">Tỉnh / Thành phố *</label>
                <select id="co-province" name="province" class="form-input" required></select>
              </div>
              <div>
                <label for="co-district" style="font-size:12.5px;font-weight:700;color:#70452b;">Quận / Huyện *</label>
                <select id="co-district" name="district" class="form-input" required></select>
              </div>
              <div>
                <label for="co-ward" style="font-size:12.5px;font-weight:700;color:#70452b;">Phường / Xã *</label>
                <select id="co-ward" name="ward" class="form-input" required></select>
              </div>
            </div>

            <div>
              <label for="co-street" style="font-size:13px;font-weight:700;color:#70452b;">Số nhà, tên đường cụ thể *</label>
              <input id="co-street" name="street_address" type="text" class="form-input" value="<?= App::e($defaultAddr['street_address'] ?? '') ?>" placeholder="Ví dụ: 59C Nguyễn Đình Chiểu" required>
            </div>
          </div>
        </div>

        <div class="php-card">
          <h2 style="margin:0 0 12px;color:#70452b;font-size:19px;">Phương thức vận chuyển</h2>
          <div id="co-perishable-block" class="is-blocked" hidden style="padding:12px 14px;border-radius:10px;background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;font-size:13.5px;margin-bottom:12px;"></div>
          <div id="co-shipping-methods" style="display:grid;gap:10px;"></div>
        </div>

        <div class="php-card">
          <h2 style="margin:0 0 12px;color:#70452b;font-size:19px;">Phương thức thanh toán</h2>
          <div style="display:grid;gap:10px;">
            <label style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid #ebd9c3;border-radius:10px;cursor:pointer;">
              <input type="radio" name="payment_method" value="cod" checked>
              <span><strong>Thanh toán khi nhận hàng (COD)</strong> — Kiểm tra hàng trước khi thanh toán.</span>
            </label>
            <label style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid #ebd9c3;border-radius:10px;cursor:pointer;">
              <input type="radio" name="payment_method" value="vietqr">
              <span><strong>Chuyển khoản ngân hàng (VietQR)</strong> — Hiển thị mã QR theo đúng mã đơn & đối soát Casso.</span>
            </label>
            <label style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid #ebd9c3;border-radius:10px;cursor:pointer;">
              <input type="radio" name="payment_method" value="ewallet">
              <span><strong>Ví điện tử</strong> (MoMo / VNPAY / ZaloPay)</span>
            </label>
            <div id="co-ewallet-wrap" hidden style="padding-left:26px;">
              <select name="ewallet_provider" class="form-input" style="max-width:220px;">
                <option value="MoMo">Ví MoMo</option>
                <option value="VNPAY">Cổng VNPAY-QR</option>
                <option value="ZaloPay">Ví ZaloPay</option>
              </select>
            </div>
          </div>

          <div style="margin-top:14px;">
            <label for="co-note" style="font-size:13px;font-weight:700;color:#70452b;">Ghi chú giao hàng</label>
            <textarea id="co-note" name="note" rows="2" class="form-input" placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi tới..."></textarea>
          </div>
        </div>
      </section>

      <aside class="php-card" style="position:sticky;top:20px;">
        <h2 style="margin:0 0 12px;color:#70452b;font-size:19px;">Đơn hàng (<?= (int) $summary['selected_count'] ?> món)</h2>
        <div style="display:grid;gap:10px;max-height:280px;overflow-y:auto;margin-bottom:14px;border-bottom:1px solid #f0e4d3;padding-bottom:12px;">
          <?php foreach ($summary['items'] as $it): ?>
            <div style="display:flex;justify-content:space-between;gap:10px;font-size:13.5px;">
              <div>
                <strong style="color:#4a2d1b;"><?= App::e($it['name']) ?></strong>
                <div style="font-size:12px;color:#7c5c46;"><?= App::e($it['variant_label']) ?> &times; <?= (int) $it['quantity'] ?></div>
              </div>
              <strong style="color:#70452b;white-space:nowrap;"><?= App::e(App::formatCurrency((int) $it['line_total'])) ?></strong>
            </div>
          <?php endforeach; ?>
        </div>

        <div style="display:grid;gap:8px;font-size:14px;color:#4a2d1b;">
          <div style="display:flex;justify-content:space-between;">
            <span>Tạm tính</span>
            <strong id="co-subtotal"><?= App::e(App::formatCurrency((int) $summary['selected_subtotal'])) ?></strong>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span>Phí vận chuyển</span>
            <strong id="co-ship-fee"><?= App::e(App::formatCurrency((int) $summary['shipping_fee'])) ?></strong>
          </div>
          <div style="display:flex;justify-content:space-between;color:#166534;">
            <span>Giảm giá áp dụng</span>
            <strong id="co-discount">−<?= App::e(App::formatCurrency((int) $summary['discount_product'] + (int) $summary['discount_shipping'])) ?></strong>
          </div>
          <div style="display:flex;justify-content:space-between;border-top:1px solid #ebd9c3;padding-top:10px;font-size:18px;color:#70452b;">
            <strong>Tổng thanh toán</strong>
            <strong id="co-total"><?= App::e(App::formatCurrency((int) $summary['total_amount'])) ?></strong>
          </div>
        </div>

        <button type="submit" id="btn-place-order" class="btn btn--primary btn--full" style="margin-top:16px;">Xác nhận đặt hàng</button>
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
  const shipWrap = document.getElementById("co-shipping-methods");
  const blockBox = document.getElementById("co-perishable-block");
  const placeBtn = document.getElementById("btn-place-order");

  function fillCascade(pSel, dSel, wSel, defP, defD, defW) {
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
    pSel.addEventListener("change", () => { updateDist(); refreshShippingPreview(); });
    dSel.addEventListener("change", () => { updateWard(); refreshShippingPreview(); });
    updateDist();
  }

  let selectedShipMethod = "fast";
  async function refreshShippingPreview() {
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
        <label style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border:1px solid #ebd9c3;border-radius:10px;cursor:pointer;">
          <span style="display:flex;align-items:center;gap:8px;">
            <input type="radio" name="shipping_method" value="${window.BakeApp.escapeHtml(m.id)}" ${m.id === selectedShipMethod ? "checked" : ""}>
            <span><strong style="color:#4a2d1b;">${window.BakeApp.escapeHtml(m.name)}</strong><div style="font-size:12px;color:#7c5c46;">${window.BakeApp.escapeHtml(m.eta)}</div></span>
          </span>
          <strong style="color:#70452b;">${m.fee === 0 ? "Miễn phí" : window.BakeApp.formatPrice(m.fee)}</strong>
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

  fillCascade(
    provEl,
    distEl,
    wardEl,
    <?= json_encode((string) ($defaultAddr['province'] ?? 'TP. Hồ Chí Minh')) ?>,
    <?= json_encode((string) ($defaultAddr['district'] ?? 'Quận 3')) ?>,
    <?= json_encode((string) ($defaultAddr['ward'] ?? 'Phường Võ Thị Sáu')) ?>
  );
  refreshShippingPreview();

  document.querySelectorAll('input[name="payment_method"]').forEach((r) => {
    r.addEventListener("change", () => {
      const ew = document.getElementById("co-ewallet-wrap");
      if (ew) ew.hidden = r.value !== "ewallet";
    });
  });

  // Modal Address
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
      document.getElementById("co-name").value = a.recipient_name;
      document.getElementById("co-phone").value = a.phone;
      document.getElementById("co-street").value = a.street_address;
      fillCascade(provEl, distEl, wardEl, a.province, a.district, a.ward);
      refreshShippingPreview();
      addrModal.hidden = true;
      window.BakeApp.showToast(res.message, "success");
    } catch (err) {
      window.BakeApp.showToast(err.message, "error");
    }
  });

  // Submit Order
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
