/*
 * =====================================================
 * BAKEMATE - GIAO DIỆN & XỬ LÝ GIỎ HÀNG + ĐẶT HÀNG COD
 * Tệp: js/cart.js (Bước 5 & F12, F13)
 * =====================================================
 */

(function () {
  const MAX_QTY = 99;
  const FALLBACK_IMG = window.FALLBACK_PRODUCT_IMAGE || "images/logo.jpg";

  /**
   * Escape HTML để tránh XSS khi hiển thị nội dung người dùng nhập.
   */
  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Định dạng thời gian hiển thị tiếng Việt.
   */
  function formatOrderDate(isoString) {
    try {
      const date = new Date(isoString);
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return isoString;
    }
  }

  /**
   * Render danh sách sản phẩm trong giỏ hàng và bảng tóm tắt.
   */
  function renderCart() {
    const cart = typeof window.getCart === "function" ? window.getCart() : [];
    const emptyState = document.getElementById("cart-empty-state");
    const layoutEl = document.getElementById("cart-content-layout");
    const tbody = document.getElementById("cart-items-body");
    const pageCountEl = document.getElementById("cart-page-count");
    const summaryCountEl = document.getElementById("cart-summary-count");
    const summarySubtotalEl = document.getElementById("cart-summary-subtotal");
    const summaryShippingEl = document.getElementById("cart-summary-shipping");
    const summaryTotalEl = document.getElementById("cart-summary-total");

    if (!tbody || !emptyState || !layoutEl) {
      return;
    }

    const totalCount = typeof window.getCartCount === "function" ? window.getCartCount(cart) : 0;
    const subtotal = typeof window.getCartTotal === "function" ? window.getCartTotal(cart) : 0;
    const shippingFee = 0;
    const grandTotal = subtotal + shippingFee;

    if (pageCountEl) {
      pageCountEl.textContent = `${totalCount} sản phẩm`;
    }

    // Lọc các dòng có sản phẩm hợp lệ trong products.js
    const validEntries = cart
      .map((item) => {
        const product = typeof window.getProduct === "function" ? window.getProduct(item.productId) : null;
        return product ? { item, product } : null;
      })
      .filter(Boolean);

    if (validEntries.length === 0) {
      tbody.innerHTML = "";
      emptyState.hidden = false;
      layoutEl.hidden = true;
      if (summaryCountEl) summaryCountEl.textContent = "0 sản phẩm";
      if (summarySubtotalEl) summarySubtotalEl.textContent = window.formatCurrency(0);
      if (summaryTotalEl) summaryTotalEl.textContent = window.formatCurrency(0);
      return;
    }

    emptyState.hidden = true;
    layoutEl.hidden = false;

    tbody.innerHTML = validEntries
      .map(({ item, product }) => {
        const optionIndex = Number(item.optionIndex) || 0;
        const option =
          typeof window.getProductOption === "function"
            ? window.getProductOption(product.id, optionIndex)
            : { optionIndex: 0, shortLabel: "Tiêu chuẩn", price: Number(product.price) };
        const unitPrice = option ? Number(option.price) : Number(product.price);
        const lineTotal = unitPrice * Number(item.quantity);
        const safeName = escapeHtml(product.name);
        const safeCategory = escapeHtml(product.category);
        const safeOption = escapeHtml(option ? option.shortLabel : "");
        const safeImage = escapeHtml(product.image || FALLBACK_IMG);
        const labelWithOption = safeOption ? `${safeName} (${safeOption})` : safeName;

        return `
          <tr class="cart-item" data-product-id="${product.id}" data-option-index="${optionIndex}">
            <td class="cart-item__product-cell" data-label="Sản phẩm">
              <div class="cart-item__product">
                <a href="product-detail.html?id=${product.id}" class="cart-item__thumb-link">
                  <img
                    src="${safeImage}"
                    alt="${safeName}"
                    class="cart-item__img"
                    onerror="this.onerror=null;this.src='${FALLBACK_IMG}';"
                  >
                </a>
                <div class="cart-item__meta">
                  <a href="product-detail.html?id=${product.id}" class="cart-item__name">${safeName}</a>
                  <span class="cart-item__category">${safeCategory}${safeOption ? ` · Quy cách: <strong>${safeOption}</strong>` : ""}</span>
                </div>
              </div>
            </td>
            <td class="cart-item__price" data-label="Đơn giá">
              ${window.formatCurrency(unitPrice)}
            </td>
            <td class="cart-item__qty-cell" data-label="Số lượng">
              <div class="cart-qty-control">
                <button
                  type="button"
                  class="qty-btn js-qty-minus"
                  data-product-id="${product.id}"
                  data-option-index="${optionIndex}"
                  aria-label="Giảm số lượng ${labelWithOption}"
                  ${item.quantity <= 1 ? "disabled" : ""}
                >-</button>
                <input
                  type="number"
                  class="qty-input js-qty-input"
                  data-product-id="${product.id}"
                  data-option-index="${optionIndex}"
                  value="${item.quantity}"
                  min="1"
                  max="${MAX_QTY}"
                  aria-label="Số lượng ${labelWithOption}"
                >
                <button
                  type="button"
                  class="qty-btn js-qty-plus"
                  data-product-id="${product.id}"
                  data-option-index="${optionIndex}"
                  aria-label="Tăng số lượng ${labelWithOption}"
                  ${item.quantity >= MAX_QTY ? "disabled" : ""}
                >+</button>
              </div>
            </td>
            <td class="cart-item__subtotal" data-label="Thành tiền">
              <strong>${window.formatCurrency(lineTotal)}</strong>
            </td>
            <td class="cart-item__action" data-label="Thao tác">
              <button
                type="button"
                class="btn-remove-item js-remove-item"
                data-product-id="${product.id}"
                data-option-index="${optionIndex}"
                aria-label="Xóa ${labelWithOption} khỏi giỏ hàng"
              >
                Xóa
              </button>
            </td>
          </tr>
        `;
      })
      .join("");

    if (summaryCountEl) summaryCountEl.textContent = `${totalCount} sản phẩm`;
    if (summarySubtotalEl) summarySubtotalEl.textContent = window.formatCurrency(subtotal);
    if (summaryShippingEl) summaryShippingEl.textContent = "Miễn phí (0 ₫)";
    if (summaryTotalEl) summaryTotalEl.textContent = window.formatCurrency(grandTotal);
  }

  /**
   * Hiển thị khung xác nhận đơn hàng vừa đặt thành công (F13).
   */
  function renderOrderConfirmation(order) {
    const box = document.getElementById("order-confirmation-box");
    if (!box || !order) {
      return;
    }

    const itemsHtml = order.items
      .map((item) => {
        const optionSuffix = item.optionLabel ? ` (${escapeHtml(item.optionLabel)})` : "";
        return `
          <li>
            <span>${escapeHtml(item.name)}${optionSuffix} × ${item.quantity}</span>
            <strong>${window.formatCurrency(item.lineTotal)}</strong>
          </li>
        `;
      })
      .join("");

    box.innerHTML = `
      <div class="order-confirmation__badge">Đặt hàng thành công</div>
      <h2 class="order-confirmation__title">Cảm ơn bạn đã đặt hàng tại BakeMate!</h2>
      <p class="order-confirmation__desc">
        Mã đơn hàng của bạn là <strong class="order-code">${escapeHtml(order.orderCode)}</strong>.
        Đơn hàng đang ở trạng thái <strong>${escapeHtml(order.status)}</strong> với phương thức
        <strong>Thanh toán khi nhận hàng (COD)</strong>.
      </p>

      <div class="order-confirmation__grid">
        <div class="order-confirmation__info">
          <h3>Thông tin nhận hàng</h3>
          <p><strong>Người nhận:</strong> ${escapeHtml(order.customer.fullName)}</p>
          <p><strong>Số điện thoại:</strong> ${escapeHtml(order.customer.phone)}</p>
          ${order.customer.email ? `<p><strong>Email:</strong> ${escapeHtml(order.customer.email)}</p>` : ""}
          <p><strong>Địa chỉ:</strong> ${escapeHtml(order.customer.address)}</p>
          ${order.customer.note ? `<p><strong>Ghi chú:</strong> ${escapeHtml(order.customer.note)}</p>` : ""}
          <p><strong>Thời gian đặt:</strong> ${escapeHtml(formatOrderDate(order.createdAt))}</p>
        </div>

        <div class="order-confirmation__items">
          <h3>Chi tiết đơn hàng (${order.totalQuantity} sản phẩm)</h3>
          <ul class="order-confirmation__list">${itemsHtml}</ul>
          <div class="order-confirmation__total">
            <span>Tổng thanh toán (COD):</span>
            <strong>${window.formatCurrency(order.total)}</strong>
          </div>
        </div>
      </div>

      <div class="order-confirmation__actions">
        <a href="products.html" class="btn btn--primary">Tiếp tục mua sắm</a>
        <button type="button" class="btn btn--outline-dark" id="btn-close-confirmation">Đóng thông báo</button>
      </div>
    `;

    box.hidden = false;

    const closeBtn = document.getElementById("btn-close-confirmation");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        box.hidden = true;
      });
    }

    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /**
   * Hiển thị lịch sử đơn hàng COD đã lưu cục bộ trên trình duyệt.
   */
  function renderOrderHistory() {
    const section = document.getElementById("order-history-section");
    const listEl = document.getElementById("order-history-list");
    if (!section || !listEl) {
      return;
    }

    const orders = typeof window.getOrders === "function" ? window.getOrders() : [];
    if (orders.length === 0) {
      section.hidden = true;
      listEl.innerHTML = "";
      return;
    }

    section.hidden = false;
    listEl.innerHTML = orders
      .map((order) => {
        const itemsSummary = (order.items || [])
          .map((item) => {
            const optionSuffix = item.optionLabel ? ` (${escapeHtml(item.optionLabel)})` : "";
            return `${escapeHtml(item.name)}${optionSuffix} (×${item.quantity})`;
          })
          .join(", ");

        return `
          <article class="order-history-card">
            <div class="order-history-card__top">
              <div>
                <strong class="order-code">${escapeHtml(order.orderCode)}</strong>
                <span class="order-history-card__date">${escapeHtml(formatOrderDate(order.createdAt))}</span>
              </div>
              <span class="order-status-pill">${escapeHtml(order.status || "Chờ xác nhận")} · COD</span>
            </div>
            <p class="order-history-card__customer">
              <strong>Người nhận:</strong> ${escapeHtml(order.customer?.fullName)} (${escapeHtml(order.customer?.phone)}) — ${escapeHtml(order.customer?.address)}
            </p>
            <p class="order-history-card__items">
              <strong>Sản phẩm:</strong> ${itemsSummary}
            </p>
            <div class="order-history-card__bottom">
              <span>Tổng số lượng: ${Number(order.totalQuantity) || 0}</span>
              <strong>Tổng tiền: ${window.formatCurrency(order.total)}</strong>
            </div>
          </article>
        `;
      })
      .join("");
  }

  /**
   * Hiển thị hoặc xóa thông báo lỗi trên từng ô form đặt hàng COD.
   */
  function setFieldError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
      errorEl.textContent = message || "";
    }
    if (input) {
      input.classList.toggle("is-invalid", Boolean(message));
      input.setAttribute("aria-invalid", message ? "true" : "false");
    }
  }

  /**
   * Kiểm tra dữ liệu biểu mẫu đặt hàng COD theo F13 & NFR02.
   */
  function validateCheckoutForm() {
    const nameInput = document.getElementById("customer-name");
    const phoneInput = document.getElementById("customer-phone");
    const emailInput = document.getElementById("customer-email");
    const addressInput = document.getElementById("customer-address");
    const noteInput = document.getElementById("customer-note");
    const alertBox = document.getElementById("checkout-form-alert");

    const fullName = nameInput ? nameInput.value.trim() : "";
    const rawPhone = phoneInput ? phoneInput.value.trim() : "";
    const normalizedPhone = rawPhone.replace(/[\s.-]/g, "");
    const email = emailInput ? emailInput.value.trim() : "";
    const address = addressInput ? addressInput.value.trim() : "";
    const note = noteInput ? noteInput.value.trim() : "";

    let isValid = true;
    let firstInvalidEl = null;

    if (fullName.length < 2) {
      setFieldError("customer-name", "error-name", "Vui lòng nhập họ và tên người nhận (tối thiểu 2 ký tự).");
      isValid = false;
      firstInvalidEl = firstInvalidEl || nameInput;
    } else {
      setFieldError("customer-name", "error-name", "");
    }

    const vnPhoneRegex = /^(0|\+84)(3|5|7|8|9)\d{8}$/;
    if (!vnPhoneRegex.test(normalizedPhone)) {
      setFieldError(
        "customer-phone",
        "error-phone",
        "Vui lòng nhập số điện thoại Việt Nam hợp lệ (10 số, bắt đầu bằng 03, 05, 07, 08 hoặc 09)."
      );
      isValid = false;
      firstInvalidEl = firstInvalidEl || phoneInput;
    } else {
      setFieldError("customer-phone", "error-phone", "");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email !== "" && !emailRegex.test(email)) {
      setFieldError("customer-email", "error-email", "Địa chỉ email không đúng định dạng.");
      isValid = false;
      firstInvalidEl = firstInvalidEl || emailInput;
    } else {
      setFieldError("customer-email", "error-email", "");
    }

    if (address.length < 5) {
      setFieldError("customer-address", "error-address", "Vui lòng nhập địa chỉ nhận hàng đầy đủ (tối thiểu 5 ký tự).");
      isValid = false;
      firstInvalidEl = firstInvalidEl || addressInput;
    } else {
      setFieldError("customer-address", "error-address", "");
    }

    if (alertBox) {
      if (!isValid) {
        alertBox.textContent = "Vui lòng kiểm tra lại các thông tin giao hàng được đánh dấu đỏ bên dưới.";
        alertBox.hidden = false;
      } else {
        alertBox.textContent = "";
        alertBox.hidden = true;
      }
    }

    if (!isValid && firstInvalidEl) {
      firstInvalidEl.focus();
    }

    return {
      isValid,
      data: {
        fullName,
        phone: normalizedPhone,
        email,
        address,
        note
      }
    };
  }

  /**
   * Xử lý các tương tác tăng/giảm/sửa số lượng, xóa sản phẩm và đặt hàng COD.
   */
  function initCartEvents() {
    const tbody = document.getElementById("cart-items-body");
    const clearBtn = document.getElementById("btn-clear-cart");
    const checkoutForm = document.getElementById("cod-checkout-form");
    const clearOrdersBtn = document.getElementById("btn-clear-orders");

    if (tbody) {
      tbody.addEventListener("click", function (event) {
        const minusBtn = event.target.closest(".js-qty-minus");
        if (minusBtn) {
          const productId = Number(minusBtn.dataset.productId);
          const optionIndex = Number(minusBtn.dataset.optionIndex) || 0;
          const cart = window.getCart();
          const current = cart.find(
            (item) => item.productId === productId && Number(item.optionIndex || 0) === optionIndex
          );
          if (current) {
            if (current.quantity <= 1) {
              window.showCartToast("Số lượng tối thiểu là 1. Nhấn nút Xóa nếu muốn bỏ sản phẩm.", {
                type: "warning",
                showCartLink: false
              });
              return;
            }
            window.updateQuantity(productId, current.quantity - 1, optionIndex);
          }
          return;
        }

        const plusBtn = event.target.closest(".js-qty-plus");
        if (plusBtn) {
          const productId = Number(plusBtn.dataset.productId);
          const optionIndex = Number(plusBtn.dataset.optionIndex) || 0;
          const cart = window.getCart();
          const current = cart.find(
            (item) => item.productId === productId && Number(item.optionIndex || 0) === optionIndex
          );
          if (current) {
            if (current.quantity >= MAX_QTY) {
              window.showCartToast(`Số lượng tối đa cho mỗi sản phẩm là ${MAX_QTY}.`, {
                type: "warning",
                showCartLink: false
              });
              return;
            }
            window.updateQuantity(productId, current.quantity + 1, optionIndex);
          }
          return;
        }

        const removeBtn = event.target.closest(".js-remove-item");
        if (removeBtn) {
          const productId = Number(removeBtn.dataset.productId);
          const optionIndex = Number(removeBtn.dataset.optionIndex) || 0;
          const product = window.getProduct(productId);
          const option =
            typeof window.getProductOption === "function"
              ? window.getProductOption(productId, optionIndex)
              : null;
          window.removeFromCart(productId, optionIndex);
          const optText = option && option.shortLabel ? ` (${option.shortLabel})` : "";
          window.showCartToast(
            product ? `Đã xóa "${product.name}"${optText} khỏi giỏ hàng.` : "Đã xóa sản phẩm khỏi giỏ hàng.",
            { showCartLink: false }
          );
        }
      });

      tbody.addEventListener("change", function (event) {
        const qtyInput = event.target.closest(".js-qty-input");
        if (!qtyInput) {
          return;
        }

        const productId = Number(qtyInput.dataset.productId);
        const optionIndex = Number(qtyInput.dataset.optionIndex) || 0;
        const rawValue = Number(qtyInput.value);

        if (!Number.isFinite(rawValue) || Math.floor(rawValue) < 1) {
          window.updateQuantity(productId, 1, optionIndex);
          window.showCartToast("Số lượng không hợp lệ (tối thiểu là 1). Đã đặt lại về 1.", {
            type: "warning",
            showCartLink: false
          });
          return;
        }

        const result = window.updateQuantity(productId, rawValue, optionIndex);
        if (result.capped) {
          window.showCartToast(`Số lượng tối đa cho mỗi sản phẩm là ${MAX_QTY}.`, {
            type: "warning",
            showCartLink: false
          });
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        if (window.getCartCount() === 0) {
          return;
        }
        if (window.confirm("Bạn có chắc muốn xóa toàn bộ sản phẩm trong giỏ hàng?")) {
          window.clearCart();
          window.showCartToast("Đã xóa toàn bộ sản phẩm trong giỏ hàng.", { showCartLink: false });
        }
      });
    }

    if (checkoutForm) {
      // Xóa lỗi ngay khi người dùng chỉnh sửa trường đang lỗi
      const fieldPairs = [
        ["customer-name", "error-name"],
        ["customer-phone", "error-phone"],
        ["customer-email", "error-email"],
        ["customer-address", "error-address"]
      ];
      fieldPairs.forEach(([inputId, errorId]) => {
        const input = document.getElementById(inputId);
        if (input) {
          input.addEventListener("input", function () {
            setFieldError(inputId, errorId, "");
          });
        }
      });

      checkoutForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const cart = window.getCart();
        const alertBox = document.getElementById("checkout-form-alert");

        if (cart.length === 0) {
          if (alertBox) {
            alertBox.textContent = "Giỏ hàng đang trống. Vui lòng thêm sản phẩm trước khi đặt hàng.";
            alertBox.hidden = false;
          }
          window.showCartToast("Giỏ hàng đang trống!", { type: "warning", showCartLink: false });
          return;
        }

        const validation = validateCheckoutForm();
        if (!validation.isValid) {
          return;
        }

        // Tính lại toàn bộ giá và số lượng từ nguồn products.js & quy cách hợp lệ (NFR03)
        const orderItems = [];
        let totalQuantity = 0;
        let subtotal = 0;

        for (const entry of cart) {
          const product = window.getProduct(entry.productId);
          if (!product || entry.quantity < 1 || entry.quantity > MAX_QTY) {
            if (alertBox) {
              alertBox.textContent = "Có sản phẩm không hợp lệ trong giỏ hàng. Vui lòng kiểm tra lại.";
              alertBox.hidden = false;
            }
            return;
          }
          const optionIndex = Number(entry.optionIndex) || 0;
          const option =
            typeof window.getProductOption === "function"
              ? window.getProductOption(product.id, optionIndex)
              : null;
          const unitPrice = option ? Number(option.price) : Number(product.price);
          const lineTotal = unitPrice * Number(entry.quantity);
          totalQuantity += Number(entry.quantity);
          subtotal += lineTotal;
          orderItems.push({
            productId: product.id,
            name: product.name,
            optionIndex,
            optionLabel: option ? option.shortLabel : "",
            price: unitPrice,
            image: product.image,
            quantity: Number(entry.quantity),
            lineTotal
          });
        }

        const shippingFee = 0;
        const order = {
          orderCode: window.createOrderCode(),
          createdAt: new Date().toISOString(),
          status: "Chờ xác nhận",
          paymentMethod: "COD",
          customer: validation.data,
          items: orderItems,
          totalQuantity,
          subtotal,
          shippingFee,
          total: subtotal + shippingFee
        };

        window.saveOrder(order);
        window.clearCart();
        checkoutForm.reset();

        renderOrderConfirmation(order);
        renderOrderHistory();
        window.showCartToast(`Đặt hàng thành công! Mã đơn: ${order.orderCode}`, {
          showCartLink: false
        });
      });
    }

    if (clearOrdersBtn) {
      clearOrdersBtn.addEventListener("click", function () {
        if (window.confirm("Bạn có chắc muốn xóa lịch sử đơn hàng thử nghiệm trên trình duyệt?")) {
          window.clearOrders();
          renderOrderHistory();
          const box = document.getElementById("order-confirmation-box");
          if (box) box.hidden = true;
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderCart();
    renderOrderHistory();
    initCartEvents();
  });

  window.addEventListener("bakemate:cartChanged", function () {
    renderCart();
  });

  window.renderCart = renderCart;
})();
