/*
 * =====================================================
 * BAKEMATE - HIỂN THỊ BIÊN NHẬN ĐƠN HÀNG ĐẶT THÀNH CÔNG
 * Tệp: js/order-success.js (Trang độc lập order-success.html)
 * =====================================================
 */

(function () {
  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatPrice(value) {
    return typeof window.formatCurrency === "function"
      ? window.formatCurrency(value)
      : Number(value || 0).toLocaleString("vi-VN") + " ₫";
  }

  function renderQrSnippet() {
    return `
      <svg class="vietqr-box__svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mã VietQR đơn hàng BakeMate">
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

  document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById("order-success-root");
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const queryCode = params.get("code");
    const order =
      typeof window.getLastOrderSnapshot === "function"
        ? window.getLastOrderSnapshot(queryCode)
        : null;

    if (!order) {
      root.innerHTML = `
        <div class="order-success-card" style="text-align:center;">
          <h1 class="cart-page__title" style="margin-bottom:10px;">Không tìm thấy thông tin đơn hàng gần đây</h1>
          <p class="cart-empty__desc">Có thể phiên duyệt đã xóa dữ liệu cục bộ hoặc bạn chưa hoàn tất bước đặt hàng.</p>
          <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:12px;">
            <a href="orders.html" class="btn btn--primary">Xem lịch sử đơn hàng</a>
            <a href="products.html" class="btn btn--outline-dark">Khám phá sản phẩm</a>
          </div>
        </div>
      `;
      return;
    }

    const createdLabel = order.createdAt
      ? new Date(order.createdAt).toLocaleString("vi-VN")
      : "";
    const isVietQr = String(order.paymentMethod || "").includes("VietQR");
    const transferContent = `BAKEMATE ${String(order.orderCode || "").replace("#", "")}`;
    const totalDiscountDisplay = Number(order.discountAmount || 0);

    root.innerHTML = `
      <div class="order-success-card">
        <span class="order-success-card__badge">Đặt hàng thành công</span>
        <h1 class="cart-page__title" style="margin-bottom:6px;">Cảm ơn bạn đã đặt hàng tại BakeMate!</h1>
        <p style="font-size:14.5px;color:#5c402d;line-height:1.6;">
          Mã đơn hàng của bạn là <strong class="order-code">${escapeHtml(order.orderCode)}</strong>
          ${createdLabel ? ` · Đặt lúc <strong>${escapeHtml(createdLabel)}</strong>` : ""}.
        </p>

        ${
          isVietQr
            ? `
              <div class="payment-extra-box" style="margin-top:16px;">
                <div class="vietqr-box">
                  ${renderQrSnippet()}
                  <div style="flex:1;min-width:200px;">
                    <strong style="display:block;font-size:14.5px;color:#4a2e19;margin-bottom:4px;">Quét mã VietQR để hoàn tất chuyển khoản (Mô phỏng)</strong>
                    <p style="font-size:13px;color:#5c402d;margin:2px 0;">Vietcombank · <strong>0071 0012 34568</strong> · BAKEMATE STORE</p>
                    <p style="font-size:13px;color:#5c402d;margin:2px 0;">Số tiền: <strong style="color:#b45309;">${formatPrice(order.total)}</strong></p>
                    <p style="font-size:13px;color:#5c402d;margin:2px 0;">Nội dung: <strong>${escapeHtml(transferContent)}</strong></p>
                  </div>
                </div>
              </div>
            `
            : ""
        }

        <div class="order-success-grid">
          <div class="order-success-panel">
            <h2 style="font-size:16px;font-weight:800;color:#4a2e19;margin-bottom:10px;">Thông tin nhận hàng &amp; giao vận</h2>
            <p><strong>Người nhận:</strong> ${escapeHtml(order.customer?.fullName || "")}</p>
            <p><strong>Số điện thoại:</strong> ${escapeHtml(order.customer?.phone || "")}</p>
            <p><strong>Địa chỉ:</strong> ${escapeHtml(order.customer?.address || "")}</p>
            <p><strong>Vận chuyển:</strong> ${escapeHtml(order.shippingMethod || "")}</p>
            <p><strong>Thanh toán:</strong> ${escapeHtml(order.paymentMethod || "COD")}</p>
            ${order.customer?.note ? `<p><strong>Lời nhắn cho Shop:</strong> ${escapeHtml(order.customer.note)}</p>` : ""}
          </div>

          <div class="order-success-panel">
            <h2 style="font-size:16px;font-weight:800;color:#4a2e19;margin-bottom:10px;">Chi tiết đơn hàng (${order.totalQuantity || 0} sản phẩm)</h2>
            <ul class="order-confirmation__list" style="margin-bottom:10px;">
              ${(order.items || [])
                .map(
                  (i) =>
                    `<li><span>${escapeHtml(i.name)}${i.optionLabel ? ` (${escapeHtml(i.optionLabel)})` : ""} × ${i.quantity}</span><strong>${formatPrice(i.lineTotal)}</strong></li>`
                )
                .join("")}
            </ul>
            <p style="display:flex;justify-content:space-between;margin:4px 0;">
              <span>Tạm tính:</span><strong>${formatPrice(order.subtotal)}</strong>
            </p>
            <p style="display:flex;justify-content:space-between;margin:4px 0;">
              <span>Phí vận chuyển:</span><strong>${formatPrice(order.shippingFee)}</strong>
            </p>
            ${
              totalDiscountDisplay > 0 && order.couponCode
                ? `<p style="display:flex;justify-content:space-between;margin:4px 0;color:#15803d;"><span>Ưu đãi (${escapeHtml(order.couponCode)}):</span><strong>-${formatPrice(totalDiscountDisplay)}</strong></p>`
                : ""
            }
            <div class="order-confirmation__total" style="margin-top:10px;padding-top:10px;border-top:1px dashed #dfd0bc;">
              <span>Tổng thanh toán:</span>
              <strong>${formatPrice(order.total)}</strong>
            </div>
          </div>
        </div>

        <div class="order-confirmation__actions">
          <a href="orders.html" class="btn btn--primary">Theo dõi đơn hàng &rarr;</a>
          <a href="products.html" class="btn btn--outline-dark">Tiếp tục mua sắm</a>
          <a href="index.html" class="btn btn--outline-dark">Về trang chủ</a>
        </div>
      </div>
    `;
  });
})();
