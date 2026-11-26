/*
 * =====================================================
 * BAKEMATE - XỬ LÝ TRANG THANH TOÁN (checkout.html)
 * Tệp: js/checkout.js
 * Tính năng:
 * - Lấy đúng các sản phẩm đã tick chọn từ giỏ hàng (Partial Checkout)
 * - Bảo vệ hàng tươi lạnh (isPerishable: #6, #12, #15): Hỏa tốc 2h / Lấy tại shop ở TP.HCM, chặn giao tỉnh
 * - 3 cấp dropdown Tỉnh -> Quận -> Phường cho form địa chỉ mới
 * - Cộng dồn 1 mã giảm đơn + 1 mã Freeship (CHAOBANMOI + FREESHIP20)
 * - Thanh toán COD / VietQR (mã QR SVG) / Ví điện tử (MoMo / VNPAY / ZaloPay)
 * - Xóa đúng món đã đặt và chuyển sang trang order-success.html
 * =====================================================
 */

(function () {
  const FALLBACK_IMG = window.FALLBACK_PRODUCT_IMAGE || "images/logo.jpg";

  const VN_LOCATIONS = {
    "TP. Hồ Chí Minh": {
      "Quận 1": { zone: "hcm", wards: ["Phường Bến Nghé", "Phường Bến Thành", "Phường Đa Kao", "Phường Tân Định"] },
      "Quận 3": { zone: "hcm", wards: ["Phường Võ Thị Sáu", "Phường 4", "Phường 5", "Phường 9"] },
      "Quận 5": { zone: "hcm", wards: ["Phường 1", "Phường 4", "Phường 8", "Phường 11"] },
      "Quận 10": { zone: "hcm", wards: ["Phường 6", "Phường 10", "Phường 12", "Phường 14"] },
      "Quận Phú Nhuận": { zone: "hcm", wards: ["Phường 1", "Phường 5", "Phường 9", "Phường 15"] },
      "Quận Bình Thạnh": { zone: "hcm", wards: ["Phường 1", "Phường 11", "Phường 19", "Phường 22"] },
      "TP. Thủ Đức (Ngoại thành)": { zone: "province", wards: ["Phường Hiệp Phú", "Phường Thảo Điền", "Phường Linh Trung", "Phường Phước Long B"] }
    },
    "TP. Hà Nội": {
      "Quận Đống Đa": { zone: "province", wards: ["Phường Láng Thượng", "Phường Ô Chợ Dừa", "Phường Trung Liệt"] },
      "Quận Hoàn Kiếm": { zone: "province", wards: ["Phường Hàng Trống", "Phường Tràng Tiền", "Phường Cửa Nam"] },
      "Quận Cầu Giấy": { zone: "province", wards: ["Phường Dịch Vọng", "Phường Nghĩa Tân", "Phường Yên Hòa"] }
    },
    "TP. Đà Nẵng": {
      "Quận Hải Châu": { zone: "province", wards: ["Phường Hải Châu 1", "Phường Thạch Thang", "Phường Hòa Cường Bắc"] },
      "Quận Thanh Khê": { zone: "province", wards: ["Phường Thạc Gián", "Phường Vĩnh Trung"] }
    },
    "Lâm Đồng": {
      "TP. Đà Lạt": { zone: "province", wards: ["Phường 1", "Phường 3", "Phường 8"] }
    },
    "Bình Dương": {
      "TP. Thủ Dầu Một": { zone: "province", wards: ["Phường Phú Cường", "Phường Chánh Nghĩa", "Phường Hiệp Thành"] }
    },
    "TP. Cần Thơ": {
      "Quận Ninh Kiều": { zone: "province", wards: ["Phường Tân An", "Phường Xuân Khánh", "Phường An Hòa"] }
    }
  };

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatPrice(val) {
    return typeof window.formatCurrency === "function"
      ? window.formatCurrency(val)
      : Number(val).toLocaleString("vi-VN") + " ₫";
  }

  let selectedAddressId = null;
  let selectedShippingMethodId = null;
  let selectedWalletBrand = "MoMo";
  let newAddrType = "Nhà Riêng";

  function getCheckoutItems() {
    if (typeof window.getSelectedCartItems === "function") {
      return window.getSelectedCartItems();
    }
    return typeof window.getCart === "function" ? window.getCart() : [];
  }

  function checkHasPerishable(items) {
    if (typeof window.hasPerishableItems === "function") {
      return window.hasPerishableItems(items);
    }
    return (items || []).some((entry) => [6, 12, 15].includes(Number(entry.productId)));
  }

  function getActiveAddress() {
    const list = typeof window.getAddresses === "function" ? window.getAddresses() : [];
    if (list.length === 0) return null;
    if (selectedAddressId) {
      const found = list.find((a) => a.id === selectedAddressId);
      if (found) return found;
    }
    const def = list.find((a) => a.isDefault) || list[0];
    selectedAddressId = def.id;
    return def;
  }

  function getShippingMethodsForZone(zone) {
    const zones = window.SHIPPING_ZONES || {};
    const z = zones[zone] || zones.hcm;
    return z && Array.isArray(z.methods) ? z.methods : [];
  }

  function isMethodAllowedForPerishable(zone, methodId, hasPerishable) {
    if (!hasPerishable) return true;
    if (zone === "province") return false;
    return methodId === "express" || methodId === "pickup";
  }

  function getSelectedShippingMethod(zone, hasPerishable) {
    const methods = getShippingMethodsForZone(zone);
    if (methods.length === 0) {
      return { id: "default", name: "Giao hàng tiêu chuẩn", fee: 25000, eta: "", allowed: !hasPerishable || zone !== "province" };
    }

    const allowedMethods = methods.filter((m) => isMethodAllowedForPerishable(zone, m.id, hasPerishable));
    const matchedAllowed = allowedMethods.find((m) => m.id === selectedShippingMethodId);
    if (matchedAllowed) {
      return Object.assign({}, matchedAllowed, { allowed: true });
    }

    if (hasPerishable && zone === "hcm") {
      const preferredCold = allowedMethods.find((m) => m.id === "express") || allowedMethods[0];
      if (preferredCold) {
        selectedShippingMethodId = preferredCold.id;
        return Object.assign({}, preferredCold, { allowed: true });
      }
    }

    if (allowedMethods.length === 0) {
      const fallback = methods[0];
      return Object.assign({}, fallback, { allowed: false });
    }

    const preferred =
      allowedMethods.find((m) => m.id === "fast" || m.id === "ghtk") || allowedMethods[0];
    selectedShippingMethodId = preferred.id;
    return Object.assign({}, preferred, { allowed: true });
  }

  function buildVietQrSvg() {
    return `
      <svg class="vietqr-box__svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mã QR thanh toán BakeMate VietQR">
        <rect width="120" height="120" fill="#ffffff"/>
        <rect x="8" y="8" width="28" height="28" fill="none" stroke="#4a2e19" stroke-width="5"/>
        <rect x="16" y="16" width="12" height="12" fill="#4a2e19"/>
        <rect x="84" y="8" width="28" height="28" fill="none" stroke="#4a2e19" stroke-width="5"/>
        <rect x="92" y="16" width="12" height="12" fill="#4a2e19"/>
        <rect x="8" y="84" width="28" height="28" fill="none" stroke="#4a2e19" stroke-width="5"/>
        <rect x="16" y="92" width="12" height="12" fill="#4a2e19"/>
        <path d="M44 10h8v8h-8zm16 0h8v8h-8zm12 8h8v8h-8zM44 26h12v8H44zm24 4h8v12h-8zM10 46h12v8H10zm18 0h10v10H28zm20-2h14v12H48zm20 4h8v8h-8zm16 0h12v8H84zm18 8h10v10h-10zM12 62h8v12h-8zm16 4h14v8H28zm22-4h10v10H50zm20 2h12v14H70zm20 4h10v10H90zM46 82h10v10H46zm18 4h10v10H64zm18-4h12v10H82zm16 14h14v14H98zM46 98h14v12H46zm22 2h12v10H68z" fill="#4a2e19"/>
        <rect x="48" y="48" width="24" height="24" rx="4" fill="#fff8ed" stroke="#d97706" stroke-width="2"/>
        <text x="60" y="64" text-anchor="middle" font-size="11" font-weight="800" fill="#70452b" font-family="Arial, sans-serif">BM</text>
      </svg>
    `;
  }

  function renderPaymentExtra(finalTotal) {
    const extraBox = document.getElementById("checkout-payment-extra");
    if (!extraBox) return;
    const paymentRadio = document.querySelector("input[name='checkoutPayment']:checked");
    const method = paymentRadio ? paymentRadio.value : "COD";

    if (method === "Chuyển khoản VietQR") {
      extraBox.hidden = false;
      extraBox.innerHTML = `
        <div class="vietqr-box">
          ${buildVietQrSvg()}
          <div style="flex:1;min-width:200px;">
            <strong style="display:block;font-size:14.5px;color:#4a2e19;margin-bottom:6px;">Thông tin chuyển khoản VietQR (Mô phỏng)</strong>
            <p style="font-size:13px;color:#5c402d;margin:2px 0;">Ngân hàng: <strong>Vietcombank (VCB)</strong></p>
            <p style="font-size:13px;color:#5c402d;margin:2px 0;">Số tài khoản: <strong>0071 0012 34568</strong> · Chủ TK: <strong>BAKEMATE STORE</strong></p>
            <p style="font-size:13px;color:#5c402d;margin:2px 0;">Số tiền: <strong style="color:#b45309;font-size:15px;">${formatPrice(finalTotal)}</strong></p>
            <p style="font-size:12.5px;color:#7c5c46;margin-top:6px;">Nội dung CK sẽ hiển thị kèm mã đơn <strong>#BM-XXXXXX</strong> ngay ở trang xác nhận.</p>
          </div>
        </div>
      `;
      return;
    }

    if (method === "Ví điện tử") {
      extraBox.hidden = false;
      extraBox.innerHTML = `
        <div>
          <strong style="display:block;font-size:14px;color:#4a2e19;margin-bottom:4px;">Chọn ví điện tử liên kết (Mô phỏng cục bộ)</strong>
          <p style="font-size:12.5px;color:#7c5c46;">Chọn ví để ghi nhận phương thức thanh toán trên biên nhận đơn hàng:</p>
          <div class="ewallet-options">
            ${["MoMo", "VNPAY", "ZaloPay"]
              .map(
                (w) =>
                  `<button type="button" class="ewallet-pill js-ewallet-pill${selectedWalletBrand === w ? " is-active" : ""}" data-wallet="${w}">${w}</button>`
              )
              .join("")}
          </div>
        </div>
      `;
      return;
    }

    extraBox.hidden = true;
    extraBox.innerHTML = "";
  }

  function renderAddressBanner() {
    const container = document.getElementById("active-address-display");
    if (!container) return;
    const addr = getActiveAddress();
    if (!addr) {
      container.innerHTML = `<span style="color:#dc2626;">Chưa có địa chỉ nhận hàng. Nhấn "Thay đổi" để thêm mới.</span>`;
      return;
    }
    const zoneLabel = addr.zone === "province" ? "Ngoại thành / Tỉnh khác" : "Nội thành TP.HCM";
    container.innerHTML = `
      <strong>${escapeHtml(addr.fullName)} (${escapeHtml(addr.phone)})</strong>
      <span> · ${escapeHtml(addr.street)}, ${escapeHtml(addr.areaLabel)}</span>
      ${addr.isDefault ? `<span class="promo-badge" style="margin-left:6px;background:#fef3c7;color:#92400e;border-color:#f59e0b;">Mặc định</span>` : ""}
      <span class="promo-badge" style="margin-left:4px;background:#fff8ed;color:#70452b;">${escapeHtml(addr.type || "Nhà Riêng")}</span>
      <span class="promo-badge" style="margin-left:4px;background:#eef2ff;color:#3730a3;border-color:#c7d2fe;">${escapeHtml(zoneLabel)}</span>
    `;
  }

  function renderShippingMethods() {
    const items = getCheckoutItems();
    const hasPerishable = checkHasPerishable(items);
    const addr = getActiveAddress();
    const zone = addr ? addr.zone : "hcm";
    const zoneMeta = (window.SHIPPING_ZONES && window.SHIPPING_ZONES[zone]) || { label: "Nội thành TP.HCM", methods: [] };
    const zoneBadge = document.getElementById("checkout-zone-badge");
    const alertBox = document.getElementById("checkout-perishable-alert");
    const listEl = document.getElementById("shipping-methods-list");
    const placeOrderBtn = document.getElementById("btn-place-order");

    if (zoneBadge) zoneBadge.textContent = zoneMeta.label;
    if (!listEl) return;

    const currentMethod = getSelectedShippingMethod(zone, hasPerishable);
    const isProvinceBlocked = hasPerishable && zone === "province";

    if (alertBox) {
      if (isProvinceBlocked) {
        alertBox.hidden = false;
        alertBox.classList.add("is-blocked");
        alertBox.innerHTML = `
          <strong>Không hỗ trợ giao hàng tươi lạnh đi ngoại thành / tỉnh:</strong>
          Đơn hàng có chứa sản phẩm cần giữ lạnh (Whipping Cream, Bơ lạt Anchor hoặc Trứng gà tươi).
          BakeMate chỉ hỗ trợ giao hàng nhóm này tại <strong>Nội thành TP.HCM</strong> (Hỏa tốc 2h hoặc Lấy tại cửa hàng). Vui lòng đổi địa chỉ Nội thành TP.HCM hoặc quay lại giỏ hàng bỏ chọn món tươi lạnh.
        `;
      } else if (hasPerishable) {
        alertBox.hidden = false;
        alertBox.classList.remove("is-blocked");
        alertBox.innerHTML = `
          <strong>Chế độ hàng bảo quản lạnh (TP.HCM):</strong>
          Hệ thống tự động ưu tiên gói <strong>Hỏa tốc (2h)</strong> hoặc <strong>Lấy tại cửa hàng</strong> để đảm bảo chất lượng nguyên liệu tươi.
        `;
      } else {
        alertBox.hidden = true;
        alertBox.classList.remove("is-blocked");
        alertBox.innerHTML = "";
      }
    }

    if (placeOrderBtn) {
      placeOrderBtn.disabled = isProvinceBlocked || items.length === 0;
      placeOrderBtn.textContent = isProvinceBlocked
        ? "Đổi địa chỉ TP.HCM để giao hàng lạnh"
        : "Đặt hàng ngay";
    }

    listEl.innerHTML = zoneMeta.methods
      .map((m) => {
        const allowed = isMethodAllowedForPerishable(zone, m.id, hasPerishable);
        const isSel = allowed && m.id === currentMethod.id;
        return `
          <label class="shipping-method-card${isSel ? " is-selected" : ""}${allowed ? "" : " is-disabled"}">
            <span style="display:flex;align-items:flex-start;gap:10px;">
              <input
                type="radio"
                name="checkoutShipMethod"
                value="${escapeHtml(m.id)}"
                ${isSel ? "checked" : ""}
                ${allowed ? "" : "disabled"}
                style="margin-top:3px;accent-color:#f39c12;"
              >
              <span>
                <strong style="display:block;font-size:14px;color:#4a2e19;">
                  ${escapeHtml(m.name)}
                  ${!allowed ? `<span class="promo-badge" style="margin-left:6px;background:#fee2e2;color:#b91c1c;border-color:#fca5a5;">Không hỗ trợ hàng lạnh</span>` : ""}
                </strong>
                <small style="color:var(--accent-sub);font-size:12.5px;">${escapeHtml(m.eta)}</small>
              </span>
            </span>
            <strong style="color:${m.fee === 0 ? "#15803d" : "var(--accent-cta)"};white-space:nowrap;">
              ${m.fee === 0 ? "Miễn phí (0 ₫)" : formatPrice(m.fee)}
            </strong>
          </label>
        `;
      })
      .join("");
  }

  function showCouponMsg(msg, isError) {
    const el = document.getElementById("checkout-coupon-feedback");
    if (!el) return;
    el.textContent = msg || "";
    el.classList.toggle("is-error", Boolean(isError && msg));
    el.classList.toggle("is-success", Boolean(!isError && msg));
  }

  function renderCheckoutCouponChips(savedCodes, activeSet) {
    const chipsBox = document.getElementById("checkout-coupon-chips");
    if (!chipsBox) return;
    if (!Array.isArray(savedCodes) || savedCodes.length === 0) {
      chipsBox.innerHTML = "";
      return;
    }
    chipsBox.innerHTML = savedCodes
      .map((code) => {
        const active = activeSet.has(code);
        return `
          <span class="coupon-applied-chip" style="${active ? "" : "opacity:0.65;border-style:dashed;"}">
            <span>${escapeHtml(code)}${active ? "" : " (Chưa đủ đk)"}</span>
            <button type="button" class="coupon-applied-chip__remove js-checkout-remove-chip" data-code="${escapeHtml(code)}" aria-label="Gỡ mã ${escapeHtml(code)}">&times;</button>
          </span>
        `;
      })
      .join("");
  }

  function renderCheckoutTotals() {
    const selectedItems = getCheckoutItems();
    const hasPerishable = checkHasPerishable(selectedItems);
    const subtotal = typeof window.getCartTotal === "function" ? window.getCartTotal(selectedItems) : 0;
    const addr = getActiveAddress();
    const method = getSelectedShippingMethod(addr ? addr.zone : "hcm", hasPerishable);
    const savedCoupons =
      typeof window.getSavedCoupons === "function"
        ? window.getSavedCoupons()
        : window.getSavedCoupon && window.getSavedCoupon()
        ? [window.getSavedCoupon()]
        : [];

    const discountInfo =
      typeof window.calculateDiscount === "function"
        ? window.calculateDiscount(subtotal, savedCoupons, method.fee)
        : {
            couponCode: null,
            couponCodes: [],
            droppedCoupons: [],
            productCoupon: null,
            shippingCoupon: null,
            discountAmount: 0,
            shippingDiscount: 0,
            totalSavings: 0,
            effectiveShippingFee: method.fee,
            finalTotal: subtotal + method.fee
          };

    const subtotalEl = document.getElementById("checkout-subtotal");
    const shipLabelEl = document.getElementById("checkout-ship-label");
    const shipEl = document.getElementById("checkout-shipping");
    const shipDiscountRow = document.getElementById("checkout-ship-discount-row");
    const shipDiscountLabel = document.getElementById("checkout-ship-discount-label");
    const shipDiscountVal = document.getElementById("checkout-ship-discount");
    const discountRow = document.getElementById("checkout-discount-row");
    const discountLabel = document.getElementById("checkout-discount-label");
    const discountVal = document.getElementById("checkout-discount");
    const totalEl = document.getElementById("checkout-total");
    const savingsRow = document.getElementById("checkout-savings-row");
    const savingsVal = document.getElementById("checkout-savings");
    const removeBtn = document.getElementById("checkout-remove-coupon");

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (shipLabelEl) shipLabelEl.textContent = `Phí vận chuyển (${method.name})`;
    if (shipEl) {
      if (discountInfo.shippingDiscount > 0) {
        shipEl.innerHTML = `<del style="color:#9a7b64;font-weight:400;margin-right:6px;">${formatPrice(method.fee)}</del>${formatPrice(discountInfo.effectiveShippingFee)}`;
      } else {
        shipEl.textContent = method.fee === 0 ? "0 ₫" : formatPrice(discountInfo.effectiveShippingFee);
      }
    }

    if (shipDiscountRow && shipDiscountVal) {
      if (discountInfo.shippingDiscount > 0) {
        shipDiscountRow.hidden = false;
        if (shipDiscountLabel) {
          shipDiscountLabel.textContent = `Ưu đãi vận chuyển (${discountInfo.shippingCoupon || "FREESHIP20"})`;
        }
        shipDiscountVal.textContent = `-${formatPrice(discountInfo.shippingDiscount)}`;
      } else {
        shipDiscountRow.hidden = true;
      }
    }

    if (discountRow && discountVal) {
      if (discountInfo.discountAmount > 0) {
        discountRow.hidden = false;
        if (discountLabel) {
          discountLabel.textContent = `Giảm giá (${discountInfo.productCoupon || discountInfo.couponCode} -10%)`;
        }
        discountVal.textContent = `-${formatPrice(discountInfo.discountAmount)}`;
      } else {
        discountRow.hidden = true;
      }
    }

    if (totalEl) totalEl.textContent = formatPrice(discountInfo.finalTotal);

    const totalSavings = Number(discountInfo.totalSavings || 0);
    if (savingsRow && savingsVal) {
      if (totalSavings > 0) {
        savingsRow.hidden = false;
        savingsVal.textContent = formatPrice(totalSavings);
      } else {
        savingsRow.hidden = true;
      }
    }

    const activeSet = new Set(discountInfo.couponCodes || []);
    renderCheckoutCouponChips(savedCoupons, activeSet);

    if (removeBtn) removeBtn.hidden = savedCoupons.length === 0;
    if (savedCoupons.length > 0) {
      if (Array.isArray(discountInfo.droppedCoupons) && discountInfo.droppedCoupons.length > 0) {
        showCouponMsg(discountInfo.droppedCoupons[0].reason, true);
      } else if (activeSet.size > 0) {
        showCouponMsg(`Đang áp dụng: ${Array.from(activeSet).join(" + ")}.`, false);
      }
    } else {
      showCouponMsg("", false);
    }

    renderPaymentExtra(discountInfo.finalTotal);
  }

  function renderCheckoutItems() {
    const allCart = typeof window.getCart === "function" ? window.getCart() : [];
    const selectedItems = getCheckoutItems();
    const countEl = document.getElementById("checkout-item-count");
    const listEl = document.getElementById("checkout-items-list");
    const emptyBox = document.getElementById("checkout-empty-box");
    const emptyTitle = document.getElementById("checkout-empty-title");
    const emptyDesc = document.getElementById("checkout-empty-desc");
    const bannerBox = document.getElementById("checkout-address-banner");
    const mainGrid = document.getElementById("checkout-main-grid");

    const selectedCount = typeof window.getCartCount === "function" ? window.getCartCount(selectedItems) : 0;
    if (selectedCount === 0) {
      if (emptyBox) {
        emptyBox.hidden = false;
        if (allCart.length > 0) {
          if (emptyTitle) emptyTitle.textContent = "Bạn chưa chọn sản phẩm nào để thanh toán";
          if (emptyDesc) {
            emptyDesc.textContent =
              "Giỏ hàng vẫn còn sản phẩm nhưng chưa có món nào được tick chọn. Vui lòng quay lại giỏ hàng để chọn sản phẩm cần mua.";
          }
        }
      }
      if (bannerBox) bannerBox.hidden = true;
      if (mainGrid) mainGrid.hidden = true;
      return;
    }

    if (emptyBox) emptyBox.hidden = true;
    if (bannerBox) bannerBox.hidden = false;
    if (mainGrid) mainGrid.hidden = false;
    if (countEl) countEl.textContent = String(selectedCount);

    if (!listEl) return;
    listEl.innerHTML = selectedItems
      .map((entry) => {
        const prod = window.getProduct ? window.getProduct(entry.productId) : null;
        if (!prod) return "";
        const opt = window.getProductOption ? window.getProductOption(prod.id, entry.optionIndex) : null;
        const unitPrice = opt ? Number(opt.price) : Number(prod.price);
        const lineTotal = unitPrice * Number(entry.quantity);
        const isPerishable = checkHasPerishable([entry]);
        return `
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;padding-bottom:10px;border-bottom:1px solid #f0e3d0;">
            <div style="display:flex;align-items:center;gap:10px;min-width:0;">
              <img src="${escapeHtml(prod.image || FALLBACK_IMG)}" alt="${escapeHtml(prod.name)}" style="width:52px;height:52px;border-radius:8px;object-fit:cover;border:1px solid #eadbc6;" onerror="this.onerror=null;this.src='${FALLBACK_IMG}';">
              <div style="min-width:0;">
                <strong style="display:block;font-size:14px;color:#4a2e19;">${escapeHtml(prod.name)}</strong>
                <small style="color:var(--accent-sub);font-size:12.5px;">
                  ${opt ? escapeHtml(opt.shortLabel) : ""} · SL: ${entry.quantity}
                  ${entry.recipeGroupId ? ` · <em style="color:var(--primary-color);">[Combo]</em>` : ""}
                  ${isPerishable ? ` · <strong style="color:#b45309;">[Hàng lạnh]</strong>` : ""}
                </small>
              </div>
            </div>
            <strong style="color:#4a2e19;white-space:nowrap;">${formatPrice(lineTotal)}</strong>
          </div>
        `;
      })
      .join("");
  }

  function renderAddressPickerModalList() {
    const listEl = document.getElementById("address-list-container");
    if (!listEl) return;
    const addresses = typeof window.getAddresses === "function" ? window.getAddresses() : [];
    const active = getActiveAddress();

    listEl.innerHTML = addresses
      .map((addr) => {
        const isCurrent = active && active.id === addr.id;
        return `
          <div class="shipping-method-card ${isCurrent ? "is-selected" : ""}" style="align-items:flex-start;">
            <label style="display:flex;align-items:flex-start;gap:10px;flex:1;cursor:pointer;">
              <input type="radio" name="pickAddrRadio" class="js-pick-addr-radio" value="${escapeHtml(addr.id)}" ${isCurrent ? "checked" : ""} style="margin-top:4px;accent-color:#f39c12;">
              <span>
                <strong style="color:#4a2e19;font-size:14px;">${escapeHtml(addr.fullName)} · ${escapeHtml(addr.phone)}</strong>
                <span style="display:block;font-size:13px;color:#6b4e3b;margin-top:2px;">${escapeHtml(addr.street)}, ${escapeHtml(addr.areaLabel)}</span>
                <span style="display:inline-flex;gap:6px;flex-wrap:wrap;margin-top:6px;">
                  ${addr.isDefault ? `<span class="promo-badge" style="background:#fef3c7;color:#92400e;border-color:#f59e0b;font-size:11px;">Mặc định</span>` : ""}
                  <span class="promo-badge" style="font-size:11px;">${escapeHtml(addr.type || "Nhà Riêng")}</span>
                  <span class="promo-badge" style="font-size:11px;">${addr.zone === "province" ? "Ngoại thành / Tỉnh khác" : "Nội thành TP.HCM"}</span>
                </span>
              </span>
            </label>
            ${
              !addr.isDefault
                ? `<button type="button" class="btn btn--outline-dark js-set-default-addr" data-addr-id="${escapeHtml(addr.id)}" style="padding:4px 10px;font-size:12px;white-space:nowrap;">Đặt mặc định</button>`
                : ""
            }
          </div>
        `;
      })
      .join("");
  }

  function initAddressCascade() {
    const citySelect = document.getElementById("addr-city");
    const distSelect = document.getElementById("addr-district");
    const wardSelect = document.getElementById("addr-ward");
    const zoneSelect = document.getElementById("addr-zone");
    const areaInput = document.getElementById("addr-area");
    if (!citySelect || !distSelect || !wardSelect) return;

    const cities = Object.keys(VN_LOCATIONS);
    citySelect.innerHTML = cities.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");

    function syncAreaOutput() {
      const c = citySelect.value;
      const d = distSelect.value;
      const w = wardSelect.value;
      const dMeta = VN_LOCATIONS[c] && VN_LOCATIONS[c][d];
      if (zoneSelect && dMeta) {
        zoneSelect.value = dMeta.zone;
      }
      if (areaInput && c && d && w) {
        areaInput.value = `${w}, ${d}, ${c}`;
      }
    }

    function populateWards() {
      const c = citySelect.value;
      const d = distSelect.value;
      const dMeta = VN_LOCATIONS[c] && VN_LOCATIONS[c][d];
      const wards = dMeta ? dMeta.wards : [];
      wardSelect.innerHTML = wards.map((w) => `<option value="${escapeHtml(w)}">${escapeHtml(w)}</option>`).join("");
      syncAreaOutput();
    }

    function populateDistricts() {
      const c = citySelect.value;
      const distMap = VN_LOCATIONS[c] || {};
      const dists = Object.keys(distMap);
      distSelect.innerHTML = dists.map((d) => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join("");
      populateWards();
    }

    citySelect.addEventListener("change", populateDistricts);
    distSelect.addEventListener("change", populateWards);
    wardSelect.addEventListener("change", syncAreaOutput);
    populateDistricts();
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderCheckoutItems();
    renderAddressBanner();
    renderShippingMethods();
    renderCheckoutTotals();
    initAddressCascade();

    const shipList = document.getElementById("shipping-methods-list");
    if (shipList) {
      shipList.addEventListener("change", function (event) {
        const radio = event.target.closest("input[name='checkoutShipMethod']");
        if (!radio || radio.disabled) return;
        selectedShippingMethodId = radio.value;
        renderShippingMethods();
        renderCheckoutTotals();
      });
    }

    document.querySelectorAll("input[name='checkoutPayment']").forEach((radio) => {
      radio.addEventListener("change", function () {
        renderCheckoutTotals();
      });
    });

    const paymentExtraBox = document.getElementById("checkout-payment-extra");
    if (paymentExtraBox) {
      paymentExtraBox.addEventListener("click", function (event) {
        const pill = event.target.closest(".js-ewallet-pill");
        if (!pill) return;
        selectedWalletBrand = pill.dataset.wallet || "MoMo";
        paymentExtraBox.querySelectorAll(".js-ewallet-pill").forEach((b) => b.classList.toggle("is-active", b === pill));
      });
    }

    const couponForm = document.getElementById("checkout-coupon-form");
    const couponInput = document.getElementById("checkout-coupon-input");
    const couponChips = document.getElementById("checkout-coupon-chips");
    const removeCouponBtn = document.getElementById("checkout-remove-coupon");

    function applyCheckoutVoucher(code) {
      const selectedItems = getCheckoutItems();
      const subtotal = window.getCartTotal ? window.getCartTotal(selectedItems) : 0;
      const res = window.addCouponCode
        ? window.addCouponCode(code, subtotal)
        : window.setSavedCoupon
        ? window.setSavedCoupon(code, subtotal)
        : { valid: false };
      if (!res.valid) {
        showCouponMsg(res.message || "Mã không hợp lệ.", true);
        return;
      }
      if (couponInput) couponInput.value = "";
      showCouponMsg(res.message, false);
      renderCheckoutTotals();
    }

    if (couponForm && couponInput) {
      couponForm.addEventListener("submit", function (event) {
        event.preventDefault();
        applyCheckoutVoucher(couponInput.value.trim());
      });
    }

    document.querySelectorAll(".js-quick-voucher").forEach((btn) => {
      btn.addEventListener("click", function () {
        applyCheckoutVoucher(btn.dataset.code || "");
      });
    });

    if (couponChips) {
      couponChips.addEventListener("click", function (event) {
        const rmBtn = event.target.closest(".js-checkout-remove-chip");
        if (!rmBtn || typeof window.removeSavedCoupon !== "function") return;
        window.removeSavedCoupon(rmBtn.dataset.code);
        showCouponMsg(`Đã gỡ mã ${rmBtn.dataset.code}.`, false);
        renderCheckoutTotals();
      });
    }

    if (removeCouponBtn) {
      removeCouponBtn.addEventListener("click", function () {
        if (window.clearSavedCoupons) window.clearSavedCoupons();
        else if (window.clearSavedCoupon) window.clearSavedCoupon();
        if (couponInput) couponInput.value = "";
        showCouponMsg("Đã gỡ tất cả mã ưu đãi.", false);
        renderCheckoutTotals();
      });
    }

    const pickerModal = document.getElementById("address-picker-modal");
    const addModal = document.getElementById("address-add-modal");
    const changeAddrBtn = document.getElementById("btn-change-address");

    if (changeAddrBtn && pickerModal) {
      changeAddrBtn.addEventListener("click", function () {
        renderAddressPickerModalList();
        pickerModal.hidden = false;
      });
    }

    document.querySelectorAll(".js-close-addr-picker").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (pickerModal) pickerModal.hidden = true;
      });
    });

    if (pickerModal) {
      pickerModal.addEventListener("click", function (event) {
        if (event.target === pickerModal) {
          pickerModal.hidden = true;
          return;
        }
        const radio = event.target.closest(".js-pick-addr-radio");
        if (radio) {
          selectedAddressId = radio.value;
          selectedShippingMethodId = null;
          renderAddressPickerModalList();
          renderAddressBanner();
          renderShippingMethods();
          renderCheckoutTotals();
          return;
        }
        const defBtn = event.target.closest(".js-set-default-addr");
        if (defBtn && window.setDefaultAddress) {
          const aid = defBtn.dataset.addrId;
          window.setDefaultAddress(aid);
          selectedAddressId = aid;
          selectedShippingMethodId = null;
          renderAddressPickerModalList();
          renderAddressBanner();
          renderShippingMethods();
          renderCheckoutTotals();
        }
      });
    }

    const openAddBtn = document.getElementById("btn-open-add-address");
    if (openAddBtn && addModal) {
      openAddBtn.addEventListener("click", function () {
        if (pickerModal) pickerModal.hidden = true;
        addModal.hidden = false;
      });
    }

    document.querySelectorAll(".js-close-addr-add").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (addModal) addModal.hidden = true;
      });
    });

    if (addModal) {
      addModal.addEventListener("click", (e) => {
        if (e.target === addModal) addModal.hidden = true;
      });
    }

    const suggestInput = document.getElementById("addr-location-suggest");
    const zoneSelect = document.getElementById("addr-zone");
    const areaInput = document.getElementById("addr-area");
    if (suggestInput && areaInput && zoneSelect) {
      suggestInput.addEventListener("change", function () {
        const val = suggestInput.value.trim();
        if (!val) return;
        areaInput.value = val;
        const lower = val.toLowerCase();
        if (lower.includes("quận 3") || lower.includes("quận 1") || (lower.includes("hồ chí minh") && !lower.includes("ngoại thành"))) {
          zoneSelect.value = "hcm";
        } else {
          zoneSelect.value = "province";
        }
      });
    }

    document.querySelectorAll(".js-addr-type-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        newAddrType = btn.dataset.type === "Văn Phòng" ? "Văn Phòng" : "Nhà Riêng";
        document.querySelectorAll(".js-addr-type-btn").forEach((b) => b.classList.toggle("active", b === btn));
      });
    });

    const newAddrForm = document.getElementById("new-address-form");
    if (newAddrForm) {
      newAddrForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const errEl = document.getElementById("addr-form-error");
        const zone = zoneSelect ? zoneSelect.value : "hcm";
        const areaLabel = areaInput ? areaInput.value.trim() : "";
        const street = (document.getElementById("addr-street")?.value || "").trim();
        const fullName = (document.getElementById("addr-fullname")?.value || "").trim();
        const phone = (document.getElementById("addr-phone")?.value || "").replace(/[\s.-]/g, "").trim();
        const isDefault = Boolean(document.getElementById("addr-is-default")?.checked);

        if (areaLabel.length < 4 || street.length < 4 || fullName.length < 2 || !/^(0[35789])[0-9]{8}$/.test(phone)) {
          if (errEl) {
            errEl.textContent = "Vui lòng nhập đầy đủ Tỉnh/Quận, Địa chỉ cụ thể, Họ tên và SĐT Việt Nam hợp lệ (10 số).";
          }
          return;
        }
        if (errEl) errEl.textContent = "";

        if (window.addAddress) {
          const saved = window.addAddress({
            fullName,
            phone,
            zone,
            areaLabel,
            street,
            type: newAddrType,
            isDefault
          });
          selectedAddressId = saved.id;
          selectedShippingMethodId = null;
          newAddrForm.reset();
          initAddressCascade();
          if (addModal) addModal.hidden = true;
          renderAddressBanner();
          renderShippingMethods();
          renderCheckoutTotals();
          if (window.showCartToast) {
            window.showCartToast("Đã lưu địa chỉ mới và cập nhật biểu phí vận chuyển!", { type: "success" });
          }
        }
      });
    }

    // Đặt hàng -> Lưu & chuyển tới trang order-success.html
    const placeOrderBtn = document.getElementById("btn-place-order");
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener("click", function () {
        const selectedItems = getCheckoutItems();
        if (selectedItems.length === 0) {
          if (window.showCartToast) window.showCartToast("Chưa có sản phẩm nào được chọn để thanh toán!", { type: "warning" });
          return;
        }
        const addr = getActiveAddress();
        if (!addr) {
          if (window.showCartToast) window.showCartToast("Vui lòng chọn hoặc thêm địa chỉ nhận hàng!", { type: "warning" });
          return;
        }

        const hasPerishable = checkHasPerishable(selectedItems);
        if (hasPerishable && addr.zone === "province") {
          if (window.showCartToast) {
            window.showCartToast("Đơn hàng tươi lạnh chỉ giao tại Nội thành TP.HCM (Hỏa tốc 2h hoặc Lấy tại shop).", { type: "warning" });
          }
          return;
        }

        const method = getSelectedShippingMethod(addr.zone, hasPerishable);
        const subtotal = window.getCartTotal ? window.getCartTotal(selectedItems) : 0;
        const savedCoupons = window.getSavedCoupons ? window.getSavedCoupons() : [];
        const discountInfo = window.calculateDiscount
          ? window.calculateDiscount(subtotal, savedCoupons, method.fee)
          : { couponCode: null, discountAmount: 0, shippingDiscount: 0, effectiveShippingFee: method.fee, finalTotal: subtotal + method.fee };

        let totalQuantity = 0;
        const orderItems = selectedItems
          .map((entry) => {
            const prod = window.getProduct ? window.getProduct(entry.productId) : null;
            if (!prod) return null;
            const opt = window.getProductOption ? window.getProductOption(prod.id, entry.optionIndex) : null;
            const unitPrice = opt ? Number(opt.price) : Number(prod.price);
            totalQuantity += Number(entry.quantity);
            return {
              productId: prod.id,
              name: prod.name,
              optionIndex: Number(entry.optionIndex) || 0,
              optionLabel: opt ? opt.shortLabel : "",
              recipeGroupId: entry.recipeGroupId || null,
              price: unitPrice,
              image: prod.image,
              quantity: Number(entry.quantity),
              lineTotal: unitPrice * Number(entry.quantity)
            };
          })
          .filter(Boolean);

        const shopNote = (document.getElementById("checkout-shop-note")?.value || "").trim();
        const paymentRadio = document.querySelector("input[name='checkoutPayment']:checked");
        const basePayment = paymentRadio ? paymentRadio.value : "COD";
        const paymentMethod =
          basePayment === "Ví điện tử" ? `Ví điện tử (${selectedWalletBrand})` : basePayment;
        const currentUser = window.BakeAuth && window.BakeAuth.getCurrentUser ? window.BakeAuth.getCurrentUser() : null;

        const order = {
          orderCode: window.createOrderCode ? window.createOrderCode() : `#BM-${Date.now().toString().slice(-6)}`,
          createdAt: new Date().toISOString(),
          status: "Chờ xác nhận",
          paymentMethod,
          paymentBaseMethod: basePayment,
          shippingMethod: method.name,
          shippingEta: method.eta,
          shippingZone: addr.zone,
          hasPerishable,
          userId: currentUser ? currentUser.userId : null,
          customer: {
            fullName: addr.fullName,
            phone: addr.phone,
            email: currentUser ? currentUser.email : "",
            address: `${addr.street}, ${addr.areaLabel}`,
            note: shopNote
          },
          items: orderItems,
          totalQuantity,
          subtotal,
          couponCode: discountInfo.couponCode,
          discountAmount: Number(discountInfo.discountAmount || 0) + Number(discountInfo.shippingDiscount || 0),
          productDiscountAmount: Number(discountInfo.discountAmount || 0),
          shippingDiscountAmount: Number(discountInfo.shippingDiscount || 0),
          baseShippingFee: method.fee,
          shippingFee: discountInfo.effectiveShippingFee,
          total: discountInfo.finalTotal
        };

        if (window.saveOrder) window.saveOrder(order);
        if (typeof window.removeOrderedCartItems === "function") {
          window.removeOrderedCartItems(selectedItems);
        } else if (window.clearCart) {
          window.clearCart();
        }
        if (window.clearSavedCoupons) window.clearSavedCoupons();
        else if (window.clearSavedCoupon) window.clearSavedCoupon();

        window.location.href = `order-success.html?code=${encodeURIComponent(order.orderCode)}`;
      });
    }
  });
})();
