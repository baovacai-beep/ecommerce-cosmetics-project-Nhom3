/*
 * =====================================================
 * BAKEMATE - THEO DÕI ĐƠN HÀNG & LỊCH SỬ MUA (orders.html)
 * Tệp: js/orders.js
 * =====================================================
 */

(function () {
  const STEPS = ["Chờ xác nhận", "Đang chuẩn bị", "Đang giao hàng", "Hoàn tất"];

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

  function formatOrderDate(iso) {
    try {
      return new Date(iso).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return iso || "";
    }
  }

  let activeStatus = "all";

  function buildTimelineHtml(status) {
    if (status === "Đã hủy") {
      return `
        <div style="padding:10px 14px;border-radius:8px;background-color:#fef2f2;border:1px solid #fecaca;color:#b91c1c;font-size:13px;font-weight:700;margin:12px 0;">
          Đơn hàng đã được hủy theo yêu cầu.
        </div>
      `;
    }
    const activeIdx = Math.max(0, STEPS.indexOf(status || "Chờ xác nhận"));
    return `
      <div class="order-timeline" aria-label="Tiến trình giao hàng">
        ${STEPS.map((label, idx) => {
          const isDone = idx <= activeIdx;
          return `
            <div class="order-step ${isDone ? "is-done" : ""}">
              <span class="order-step__dot">${idx + 1}</span>
              <div>${escapeHtml(label)}</div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderOrders() {
    const root = document.getElementById("orders-list-root");
    const searchInput = document.getElementById("orders-search-input");
    if (!root) return;

    const allOrders = typeof window.getOrders === "function" ? window.getOrders() : [];
    const kw = String(searchInput ? searchInput.value : "").trim().toLowerCase();

    const filtered = allOrders.filter((ord) => {
      const matchStatus = activeStatus === "all" || (ord.status || "Chờ xác nhận") === activeStatus;
      const matchKw =
        !kw ||
        String(ord.orderCode || "").toLowerCase().includes(kw) ||
        String(ord.customer?.fullName || "").toLowerCase().includes(kw) ||
        String(ord.customer?.phone || "").toLowerCase().includes(kw);
      return matchStatus && matchKw;
    });

    if (allOrders.length === 0) {
      root.innerHTML = `
        <section class="cart-empty">
          <h2 class="cart-empty__title">Bạn chưa có đơn hàng nào</h2>
          <p class="cart-empty__desc">Khi bạn hoàn tất đặt hàng tại trang Thanh toán, đơn hàng với mã #BM-XXXXXX sẽ xuất hiện tại đây.</p>
          <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
            <a href="products.html" class="btn btn--primary">Khám phá sản phẩm</a>
            <a href="recipes.html" class="btn btn--outline-dark">Chọn combo công thức</a>
          </div>
        </section>
      `;
      return;
    }

    if (filtered.length === 0) {
      root.innerHTML = `
        <div class="no-products-message">
          <strong>Không tìm thấy đơn hàng nào khớp bộ lọc</strong>
          <p>Hãy thử đổi trạng thái lọc hoặc xóa từ khóa tìm kiếm.</p>
        </div>
      `;
      return;
    }

    root.innerHTML = filtered
      .map((order) => {
        const status = order.status || "Chờ xác nhận";
        const pillStyle =
          status === "Đã hủy"
            ? "background-color:#fee2e2;color:#b91c1c;"
            : status === "Hoàn tất"
            ? "background-color:#dcfce7;color:#15803d;"
            : "";

        const itemsHtml = (order.items || [])
          .map((item) => {
            const opt = item.optionLabel ? ` (${escapeHtml(item.optionLabel)})` : "";
            return `
              <li style="display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px dashed #eedfc9;">
                <span>${escapeHtml(item.name)}${opt} × <strong>${item.quantity}</strong></span>
                <strong>${formatPrice(item.lineTotal)}</strong>
              </li>
            `;
          })
          .join("");

        return `
          <article class="order-history-card" style="background:#ffffff;padding:20px;">
            <div class="order-history-card__top">
              <div>
                <strong class="order-code">${escapeHtml(order.orderCode)}</strong>
                <span class="order-history-card__date">${escapeHtml(formatOrderDate(order.createdAt))}</span>
              </div>
              <span class="order-status-pill" style="${pillStyle}">
                ${escapeHtml(status)} · ${escapeHtml(order.paymentMethod || "COD")}
              </span>
            </div>

            ${buildTimelineHtml(status)}

            <p class="order-history-card__customer">
              <strong>Người nhận:</strong> ${escapeHtml(order.customer?.fullName)} (${escapeHtml(order.customer?.phone)}) — ${escapeHtml(order.customer?.address)}
            </p>
            ${
              order.shippingMethod
                ? `<p style="font-size:13px;color:var(--accent-sub);margin-bottom:8px;"><strong>Vận chuyển:</strong> ${escapeHtml(order.shippingMethod)} (${formatPrice(order.shippingFee || 0)})</p>`
                : ""
            }

            <ul style="list-style:none;margin:8px 0 12px;font-size:13.5px;">${itemsHtml}</ul>

            <div class="order-history-card__bottom">
              <span>
                Tổng số lượng: ${Number(order.totalQuantity) || 0} sản phẩm
                ${
                  order.couponCode && order.discountAmount > 0
                    ? `<span class="order-history-card__coupon">Mã ${escapeHtml(order.couponCode)} (-${formatPrice(order.discountAmount)})</span>`
                    : ""
                }
              </span>
              <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
                <strong>Tổng thanh toán: ${formatPrice(order.total)}</strong>
                ${
                  status === "Chờ xác nhận"
                    ? `<button type="button" class="btn-clear-cart js-cancel-order" data-order-code="${escapeHtml(order.orderCode)}">Hủy đơn hàng</button>`
                    : ""
                }
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".js-order-filter");
    const searchInput = document.getElementById("orders-search-input");
    const clearBtn = document.getElementById("btn-clear-orders");
    const root = document.getElementById("orders-list-root");

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        activeStatus = btn.dataset.status || "all";
        filterButtons.forEach((b) => b.classList.toggle("active", b === btn));
        renderOrders();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", renderOrders);
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", async function () {
        if (window.getOrders && window.getOrders().length === 0) return;
        const ok =
          typeof window.showBakeConfirm === "function"
            ? await window.showBakeConfirm({
                title: "Xóa lịch sử đơn hàng",
                message: "Bạn có muốn xóa toàn bộ lịch sử đơn hàng thử nghiệm trên trình duyệt?",
                confirmText: "Đồng ý",
                cancelText: "Hủy bỏ"
              })
            : true;
        if (!ok) return;
        if (window.clearOrders) window.clearOrders();
        renderOrders();
        if (window.showCartToast) window.showCartToast("Đã xóa lịch sử đơn hàng.", { type: "success" });
      });
    }

    if (root) {
      root.addEventListener("click", async function (event) {
        const cancelBtn = event.target.closest(".js-cancel-order");
        if (!cancelBtn) return;
        const code = cancelBtn.dataset.orderCode;
        const ok =
          typeof window.showBakeConfirm === "function"
            ? await window.showBakeConfirm({
                title: "Xác nhận hủy đơn",
                message: `Bạn có chắc muốn hủy đơn hàng ${code}?`,
                confirmText: "Đồng ý hủy",
                cancelText: "Giữ lại đơn"
              })
            : true;
        if (!ok) return;
        if (window.updateOrderStatus) {
          window.updateOrderStatus(code, "Đã hủy");
          renderOrders();
          if (window.showCartToast) {
            window.showCartToast(`Đã hủy đơn hàng ${code}.`, { type: "success" });
          }
        }
      });
    }

    renderOrders();
  });
})();
