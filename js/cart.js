/*
 * =====================================================
 * BAKEMATE - GIAO DIỆN & XỬ LÝ GIỎ HÀNG
 * Tệp: js/cart.js (Bước 5 + Checkbox chọn mua + Cộng dồn Voucher + Combo Recipe-to-Cart)
 * =====================================================
 */

(function () {
  const MAX_QTY = 99;
  const FALLBACK_IMG = window.FALLBACK_PRODUCT_IMAGE || "images/logo.jpg";
  const DEFAULT_SHIPPING = typeof window.DEFAULT_SHIPPING_FEE === "number" ? window.DEFAULT_SHIPPING_FEE : 25000;

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getGroupAttr(recipeGroupId) {
    return recipeGroupId ? String(recipeGroupId) : "";
  }

  function parseGroupAttr(value) {
    if (!value || typeof value !== "string" || value.trim() === "") {
      return null;
    }
    return value.trim();
  }

  function getItemKey(item) {
    if (typeof window.getCartItemKey === "function") {
      return window.getCartItemKey(item);
    }
    return `${Number(item.productId)}|${Number(item.optionIndex || 0)}|${parseGroupAttr(item.recipeGroupId) || ""}`;
  }

  function askConfirm(options) {
    if (typeof window.showBakeConfirm === "function") {
      return window.showBakeConfirm(options);
    }
    return Promise.resolve(true);
  }

  /**
   * Tạo HTML cho 1 dòng sản phẩm trong giỏ (có checkbox chọn thanh toán từng món).
   */
  function renderCartItemRow({ item, product, selectedSet }) {
    const optionIndex = Number(item.optionIndex) || 0;
    const recipeGroupId = getGroupAttr(item.recipeGroupId);
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
    const safeGroupAttr = escapeHtml(recipeGroupId);
    const labelWithOption = safeOption ? `${safeName} (${safeOption})` : safeName;
    const itemKey = getItemKey(item);
    const isChecked = selectedSet ? selectedSet.has(itemKey) : true;
    const isPerishable =
      typeof window.isProductPerishable === "function"
        ? window.isProductPerishable(product)
        : Boolean(product.isPerishable);

    return `
      <div
        class="cart-item${isChecked ? "" : " cart-item--unchecked"}"
        data-product-id="${product.id}"
        data-option-index="${optionIndex}"
        data-recipe-group-id="${safeGroupAttr}"
        data-cart-key="${escapeHtml(itemKey)}"
      >
        <div class="cart-item__cell cart-item__product-cell" data-label="Sản phẩm">
          <div class="cart-item__product">
            <input
              type="checkbox"
              class="cart-item-checkbox js-cart-item-check"
              data-cart-key="${escapeHtml(itemKey)}"
              ${isChecked ? "checked" : ""}
              aria-label="Chọn ${labelWithOption} để thanh toán"
            >
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
              <span class="cart-item__category">
                ${safeCategory}${safeOption ? ` · Quy cách: <strong>${safeOption}</strong>` : ""}
                ${isPerishable ? ` · <span style="color:#b45309;font-weight:700;">Hàng lạnh (TP.HCM 2h)</span>` : ""}
              </span>
            </div>
          </div>
        </div>
        <div class="cart-item__cell cart-item__price" data-label="Đơn giá">
          ${window.formatCurrency(unitPrice)}
        </div>
        <div class="cart-item__cell cart-item__qty-cell" data-label="Số lượng">
          <div class="cart-qty-control">
            <button
              type="button"
              class="qty-btn js-qty-minus"
              data-product-id="${product.id}"
              data-option-index="${optionIndex}"
              data-recipe-group-id="${safeGroupAttr}"
              aria-label="Giảm số lượng ${labelWithOption}"
            >-</button>
            <input
              type="number"
              class="qty-input js-qty-input"
              data-product-id="${product.id}"
              data-option-index="${optionIndex}"
              data-recipe-group-id="${safeGroupAttr}"
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
              data-recipe-group-id="${safeGroupAttr}"
              aria-label="Tăng số lượng ${labelWithOption}"
              ${item.quantity >= MAX_QTY ? "disabled" : ""}
            >+</button>
          </div>
        </div>
        <div class="cart-item__cell cart-item__subtotal" data-label="Thành tiền">
          <strong>${window.formatCurrency(lineTotal)}</strong>
        </div>
        <div class="cart-item__cell cart-item__action" data-label="Thao tác">
          <button
            type="button"
            class="btn-remove-item js-remove-item"
            data-product-id="${product.id}"
            data-option-index="${optionIndex}"
            data-recipe-group-id="${safeGroupAttr}"
            aria-label="Xóa ${labelWithOption} khỏi giỏ hàng"
          >
            Xóa
          </button>
        </div>
      </div>
    `;
  }

  function showCouponFeedback(message, isError) {
    const feedback = document.getElementById("coupon-feedback");
    if (!feedback) return;
    feedback.textContent = message || "";
    feedback.classList.toggle("is-error", Boolean(isError && message));
    feedback.classList.toggle("is-success", Boolean(!isError && message));
  }

  function renderAppliedCouponChips(savedCodes, activeCouponSet, hasSelectedItems) {
    const chipsContainer = document.getElementById("cart-coupon-chips");
    if (!chipsContainer) return;

    if (!Array.isArray(savedCodes) || savedCodes.length === 0) {
      chipsContainer.innerHTML = "";
      return;
    }

    chipsContainer.innerHTML = savedCodes
      .map((code) => {
        const isActive = hasSelectedItems && activeCouponSet.has(code);
        const meta = window.VALID_COUPONS && window.VALID_COUPONS[code];
        const desc = meta ? meta.description : code;
        return `
          <span class="coupon-applied-chip" style="${isActive ? "" : "opacity:0.65;border-style:dashed;"}" title="${escapeHtml(desc)}">
            <span>${escapeHtml(code)}${isActive ? "" : " (Chưa đủ điều kiện)"}</span>
            <button
              type="button"
              class="coupon-applied-chip__remove js-remove-coupon-chip"
              data-code="${escapeHtml(code)}"
              aria-label="Gỡ mã ${escapeHtml(code)}"
            >&times;</button>
          </span>
        `;
      })
      .join("");
  }

  /**
   * Cập nhật khối Tóm tắt giỏ hàng theo các món đã tick chọn và hỗ trợ cộng dồn voucher.
   */
  function updateCartSummaryDisplay(totalCartCount, selectedCount, subtotal) {
    const pageCountEl = document.getElementById("cart-page-count");
    const summaryCountEl = document.getElementById("cart-summary-count");
    const summarySubtotalEl = document.getElementById("cart-summary-subtotal");
    const discountRowEl = document.getElementById("cart-summary-discount-row");
    const discountLabelEl = document.getElementById("cart-summary-discount-label");
    const discountValueEl = document.getElementById("cart-summary-discount");
    const shipDiscountRowEl = document.getElementById("cart-summary-ship-discount-row");
    const shipDiscountLabelEl = document.getElementById("cart-summary-ship-discount-label");
    const shipDiscountValueEl = document.getElementById("cart-summary-ship-discount");
    const summaryShippingEl = document.getElementById("cart-summary-shipping");
    const summaryTotalEl = document.getElementById("cart-summary-total");
    const removeCouponBtn = document.getElementById("btn-remove-coupon");
    const checkoutBtn = document.getElementById("btn-proceed-checkout");

    const hasItems = selectedCount > 0 && subtotal > 0;
    const baseShip = hasItems ? DEFAULT_SHIPPING : 0;
    const savedCoupons =
      typeof window.getSavedCoupons === "function"
        ? window.getSavedCoupons()
        : window.getSavedCoupon && window.getSavedCoupon()
        ? [window.getSavedCoupon()]
        : [];

    const discountInfo =
      typeof window.calculateDiscount === "function"
        ? window.calculateDiscount(subtotal, savedCoupons, baseShip)
        : {
            couponCode: null,
            couponCodes: [],
            activeCoupons: [],
            droppedCoupons: [],
            productCoupon: null,
            shippingCoupon: null,
            discountAmount: 0,
            shippingDiscount: 0,
            effectiveShippingFee: baseShip,
            finalTotal: subtotal + baseShip
          };

    if (pageCountEl) {
      pageCountEl.textContent = `${totalCartCount} sản phẩm`;
    }
    if (summaryCountEl) summaryCountEl.textContent = `${selectedCount} sản phẩm`;
    if (summarySubtotalEl) summarySubtotalEl.textContent = window.formatCurrency(subtotal);

    if (summaryShippingEl) {
      if (!hasItems) {
        summaryShippingEl.textContent = "0 ₫";
      } else if (discountInfo.shippingDiscount > 0) {
        summaryShippingEl.innerHTML = `<del style="color:#9a7b64;font-weight:500;margin-right:6px;">${window.formatCurrency(baseShip)}</del>${window.formatCurrency(discountInfo.effectiveShippingFee)}`;
      } else {
        summaryShippingEl.textContent = window.formatCurrency(discountInfo.effectiveShippingFee);
      }
    }

    if (shipDiscountRowEl && shipDiscountValueEl) {
      if (hasItems && discountInfo.shippingDiscount > 0) {
        shipDiscountRowEl.hidden = false;
        if (shipDiscountLabelEl) {
          shipDiscountLabelEl.textContent = `Ưu đãi vận chuyển (${discountInfo.shippingCoupon || "FREESHIP20"})`;
        }
        shipDiscountValueEl.textContent = `-${window.formatCurrency(discountInfo.shippingDiscount)}`;
      } else {
        shipDiscountRowEl.hidden = true;
      }
    }

    if (discountRowEl && discountValueEl) {
      if (hasItems && discountInfo.discountAmount > 0) {
        discountRowEl.hidden = false;
        if (discountLabelEl) {
          discountLabelEl.textContent = `Giảm giá (${discountInfo.productCoupon || discountInfo.couponCode} -10%)`;
        }
        discountValueEl.textContent = `-${window.formatCurrency(discountInfo.discountAmount)}`;
      } else {
        discountRowEl.hidden = true;
      }
    }

    if (summaryTotalEl) {
      summaryTotalEl.textContent = window.formatCurrency(hasItems ? discountInfo.finalTotal : 0);
    }

    const activeCouponSet = new Set(discountInfo.couponCodes || []);
    renderAppliedCouponChips(savedCoupons, activeCouponSet, hasItems);

    if (savedCoupons.length > 0 && hasItems) {
      if (Array.isArray(discountInfo.droppedCoupons) && discountInfo.droppedCoupons.length > 0) {
        showCouponFeedback(discountInfo.droppedCoupons[0].reason, true);
      } else if (activeCouponSet.size > 0) {
        showCouponFeedback(`Đang áp dụng: ${Array.from(activeCouponSet).join(" + ")}.`, false);
      }
    } else if (savedCoupons.length === 0) {
      showCouponFeedback("", false);
    }

    if (removeCouponBtn) {
      removeCouponBtn.hidden = savedCoupons.length === 0;
    }

    if (checkoutBtn) {
      const canCheckout = hasItems;
      checkoutBtn.classList.toggle("btn--disabled", !canCheckout);
      checkoutBtn.setAttribute("aria-disabled", canCheckout ? "false" : "true");
    }
  }

  /**
   * Render danh sách sản phẩm trong giỏ (phân tách hàng mua lẻ và từng combo recipeGroupId)
   * kèm checkbox chọn từng món / cả combo.
   */
  function renderCart() {
    const cart = typeof window.getCart === "function" ? window.getCart() : [];
    const emptyState = document.getElementById("cart-empty-state");
    const layoutEl = document.getElementById("cart-content-layout");
    const groupsContainer = document.getElementById("cart-items-body");
    const selectAllCheckbox = document.getElementById("cart-select-all");
    const selectAllLabel = document.getElementById("cart-select-all-label");
    const selectedStatusEl = document.getElementById("cart-selected-status");

    if (!groupsContainer || !emptyState || !layoutEl) {
      return;
    }

    const validEntries = cart
      .map((item) => {
        const product = typeof window.getProduct === "function" ? window.getProduct(item.productId) : null;
        return product ? { item, product } : null;
      })
      .filter(Boolean);

    if (validEntries.length === 0) {
      groupsContainer.innerHTML = "";
      emptyState.hidden = false;
      layoutEl.hidden = true;
      updateCartSummaryDisplay(0, 0, 0);
      return;
    }

    emptyState.hidden = true;
    layoutEl.hidden = false;

    const totalCartCount = typeof window.getCartCount === "function" ? window.getCartCount(cart) : 0;
    const selectedKeys =
      typeof window.getSelectedCartKeys === "function"
        ? window.getSelectedCartKeys(cart)
        : cart.map(getItemKey);
    const selectedSet = new Set(selectedKeys);

    const selectedItems = validEntries.filter(({ item }) => selectedSet.has(getItemKey(item))).map((e) => e.item);
    const selectedCount = typeof window.getCartCount === "function" ? window.getCartCount(selectedItems) : 0;
    const selectedSubtotal = typeof window.getCartTotal === "function" ? window.getCartTotal(selectedItems) : 0;

    if (selectAllCheckbox) {
      selectAllCheckbox.checked = validEntries.length > 0 && validEntries.every(({ item }) => selectedSet.has(getItemKey(item)));
    }
    if (selectAllLabel) {
      selectAllLabel.textContent = `Chọn tất cả (${selectedItems.length}/${validEntries.length} dòng)`;
    }
    if (selectedStatusEl) {
      selectedStatusEl.textContent =
        selectedCount > 0
          ? `Đã chọn ${selectedCount} sản phẩm để thanh toán`
          : "Chưa chọn sản phẩm nào";
      selectedStatusEl.style.color = selectedCount > 0 ? "#15803d" : "#b91c1c";
    }

    const standaloneEntries = [];
    const recipeGroupsMap = new Map();

    validEntries.forEach((entry) => {
      const groupId = parseGroupAttr(entry.item.recipeGroupId);
      if (!groupId) {
        standaloneEntries.push(entry);
      } else {
        if (!recipeGroupsMap.has(groupId)) {
          recipeGroupsMap.set(groupId, []);
        }
        recipeGroupsMap.get(groupId).push(entry);
      }
    });

    const htmlParts = [];

    if (standaloneEntries.length > 0) {
      htmlParts.push(`
        <section class="cart-group cart-group--standalone" aria-label="Sản phẩm mua lẻ">
          ${standaloneEntries.map((e) => renderCartItemRow({ item: e.item, product: e.product, selectedSet })).join("")}
        </section>
      `);
    }

    recipeGroupsMap.forEach((groupEntries, groupId) => {
      const comboInfo =
        typeof window.getRecipeComboInfo === "function"
          ? window.getRecipeComboInfo(groupId)
          : { title: `Combo công thức (${groupId})` };

      const allGroupSelected = groupEntries.every(({ item }) => selectedSet.has(getItemKey(item)));

      const groupTotal = groupEntries.reduce((sum, { item, product }) => {
        const option =
          typeof window.getProductOption === "function"
            ? window.getProductOption(product.id, item.optionIndex)
            : null;
        const unitPrice = option ? Number(option.price) : Number(product.price);
        return sum + unitPrice * Number(item.quantity);
      }, 0);

      htmlParts.push(`
        <section
          class="cart-group cart-group--recipe"
          data-recipe-group-id="${escapeHtml(groupId)}"
          aria-label="${escapeHtml(comboInfo.title)}"
        >
          <div class="cart-group__header">
            <div class="cart-group__title-wrap">
              <input
                type="checkbox"
                class="cart-item-checkbox js-combo-check"
                data-recipe-group-id="${escapeHtml(groupId)}"
                ${allGroupSelected ? "checked" : ""}
                aria-label="Chọn cả combo ${escapeHtml(comboInfo.title)}"
              >
              <span class="cart-group__badge">Combo công thức</span>
              <h3 class="cart-group__title">${escapeHtml(comboInfo.title)}</h3>
            </div>
            <div class="cart-group__meta">
              <span class="cart-group__subtotal">
                Tạm tính combo: <strong>${window.formatCurrency(groupTotal)}</strong>
              </span>
              <button
                type="button"
                class="btn-remove-combo js-remove-recipe-combo"
                data-recipe-group-id="${escapeHtml(groupId)}"
                aria-label="Xóa cả combo ${escapeHtml(comboInfo.title)}"
              >
                Xóa cả combo
              </button>
            </div>
          </div>
          <div class="cart-group__items">
            ${groupEntries.map((e) => renderCartItemRow({ item: e.item, product: e.product, selectedSet })).join("")}
          </div>
        </section>
      `);
    });

    groupsContainer.innerHTML = htmlParts.join("");
    updateCartSummaryDisplay(totalCartCount, selectedCount, selectedSubtotal);
  }

  function findCartItem(productId, optionIndex, recipeGroupId) {
    const cart = window.getCart();
    return cart.find(
      (item) =>
        item.productId === productId &&
        Number(item.optionIndex || 0) === optionIndex &&
        parseGroupAttr(item.recipeGroupId) === recipeGroupId
    );
  }

  async function promptRemoveOnZero(productId, optionIndex, recipeGroupId) {
    const product = window.getProduct(productId);
    const productName = product ? product.name : "sản phẩm này";
    const confirmed = await askConfirm({
      title: "Xác nhận xóa",
      message: "Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?",
      confirmText: "Đồng ý",
      cancelText: "Hủy bỏ"
    });
    if (!confirmed) {
      return false;
    }
    window.removeFromCart(productId, optionIndex, recipeGroupId);
    window.showCartToast(`Đã xóa "${productName}" khỏi giỏ hàng.`, { showCartLink: false });
    return true;
  }

  function initCartEvents() {
    const groupsContainer = document.getElementById("cart-items-body");
    const selectAllCheckbox = document.getElementById("cart-select-all");
    const clearBtn = document.getElementById("btn-clear-cart");
    const couponForm = document.getElementById("cart-coupon-form");
    const couponInput = document.getElementById("coupon-code-input");
    const removeCouponBtn = document.getElementById("btn-remove-coupon");
    const couponChips = document.getElementById("cart-coupon-chips");
    const proceedCheckoutBtn = document.getElementById("btn-proceed-checkout");

    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener("change", function () {
        if (typeof window.setSelectedCartKeys !== "function") return;
        const cart = window.getCart ? window.getCart() : [];
        const nextKeys = selectAllCheckbox.checked ? cart.map(getItemKey) : [];
        window.setSelectedCartKeys(nextKeys);
        renderCart();
      });
    }

    if (groupsContainer) {
      groupsContainer.addEventListener("click", async function (event) {
        const removeComboBtn = event.target.closest(".js-remove-recipe-combo");
        if (removeComboBtn) {
          const groupId = parseGroupAttr(removeComboBtn.dataset.recipeGroupId);
          if (groupId && typeof window.removeRecipeGroup === "function") {
            const comboInfo =
              typeof window.getRecipeComboInfo === "function"
                ? window.getRecipeComboInfo(groupId)
                : { title: groupId };
            const confirmed = await askConfirm({
              title: "Xác nhận xóa combo",
              message: `Bạn có muốn xóa trọn bộ "${comboInfo.title}" khỏi giỏ hàng?`,
              confirmText: "Đồng ý",
              cancelText: "Hủy bỏ"
            });
            if (!confirmed) return;
            window.removeRecipeGroup(groupId);
            window.showCartToast(`Đã xóa trọn bộ "${comboInfo.title}" khỏi giỏ hàng.`, {
              showCartLink: false
            });
          }
          return;
        }

        const minusBtn = event.target.closest(".js-qty-minus");
        if (minusBtn) {
          const productId = Number(minusBtn.dataset.productId);
          const optionIndex = Number(minusBtn.dataset.optionIndex) || 0;
          const recipeGroupId = parseGroupAttr(minusBtn.dataset.recipeGroupId);
          const current = findCartItem(productId, optionIndex, recipeGroupId);
          if (current) {
            if (current.quantity <= 1) {
              await promptRemoveOnZero(productId, optionIndex, recipeGroupId);
              return;
            }
            window.updateQuantity(productId, current.quantity - 1, optionIndex, recipeGroupId);
          }
          return;
        }

        const plusBtn = event.target.closest(".js-qty-plus");
        if (plusBtn) {
          const productId = Number(plusBtn.dataset.productId);
          const optionIndex = Number(plusBtn.dataset.optionIndex) || 0;
          const recipeGroupId = parseGroupAttr(plusBtn.dataset.recipeGroupId);
          const current = findCartItem(productId, optionIndex, recipeGroupId);
          if (current) {
            if (current.quantity >= MAX_QTY) {
              window.showCartToast(`Số lượng tối đa cho mỗi sản phẩm là ${MAX_QTY}.`, {
                type: "warning",
                showCartLink: false
              });
              return;
            }
            window.updateQuantity(productId, current.quantity + 1, optionIndex, recipeGroupId);
          }
          return;
        }

        const removeBtn = event.target.closest(".js-remove-item");
        if (removeBtn) {
          const productId = Number(removeBtn.dataset.productId);
          const optionIndex = Number(removeBtn.dataset.optionIndex) || 0;
          const recipeGroupId = parseGroupAttr(removeBtn.dataset.recipeGroupId);
          const confirmed = await askConfirm({
            title: "Xác nhận xóa",
            message: "Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?",
            confirmText: "Đồng ý",
            cancelText: "Hủy bỏ"
          });
          if (!confirmed) return;

          const product = window.getProduct(productId);
          const option =
            typeof window.getProductOption === "function"
              ? window.getProductOption(productId, optionIndex)
              : null;
          window.removeFromCart(productId, optionIndex, recipeGroupId);
          const optText = option && option.shortLabel ? ` (${option.shortLabel})` : "";
          window.showCartToast(
            product ? `Đã xóa "${product.name}"${optText} khỏi giỏ hàng.` : "Đã xóa sản phẩm khỏi giỏ hàng.",
            { showCartLink: false }
          );
        }
      });

      groupsContainer.addEventListener("change", async function (event) {
        const itemCheckbox = event.target.closest(".js-cart-item-check");
        if (itemCheckbox && typeof window.setSelectedCartKeys === "function") {
          const cart = window.getCart();
          const currentKeys = new Set(window.getSelectedCartKeys(cart));
          const key = itemCheckbox.dataset.cartKey;
          if (itemCheckbox.checked) {
            currentKeys.add(key);
          } else {
            currentKeys.delete(key);
          }
          window.setSelectedCartKeys(Array.from(currentKeys));
          renderCart();
          return;
        }

        const comboCheckbox = event.target.closest(".js-combo-check");
        if (comboCheckbox && typeof window.setSelectedCartKeys === "function") {
          const groupId = parseGroupAttr(comboCheckbox.dataset.recipeGroupId);
          const cart = window.getCart();
          const currentKeys = new Set(window.getSelectedCartKeys(cart));
          cart
            .filter((item) => parseGroupAttr(item.recipeGroupId) === groupId)
            .forEach((item) => {
              const key = getItemKey(item);
              if (comboCheckbox.checked) {
                currentKeys.add(key);
              } else {
                currentKeys.delete(key);
              }
            });
          window.setSelectedCartKeys(Array.from(currentKeys));
          renderCart();
          return;
        }

        const qtyInput = event.target.closest(".js-qty-input");
        if (!qtyInput) {
          return;
        }

        const productId = Number(qtyInput.dataset.productId);
        const optionIndex = Number(qtyInput.dataset.optionIndex) || 0;
        const recipeGroupId = parseGroupAttr(qtyInput.dataset.recipeGroupId);
        const current = findCartItem(productId, optionIndex, recipeGroupId);
        const rawStr = String(qtyInput.value == null ? "" : qtyInput.value).trim();

        if (rawStr === "") {
          qtyInput.value = current ? current.quantity : 1;
          return;
        }

        const rawValue = Number(rawStr);

        if (rawValue === 0) {
          const removed = await promptRemoveOnZero(productId, optionIndex, recipeGroupId);
          if (!removed && current) {
            qtyInput.value = current.quantity;
          }
          return;
        }

        if (!Number.isFinite(rawValue) || Math.floor(rawValue) < 1) {
          window.updateQuantity(productId, 1, optionIndex, recipeGroupId);
          window.showCartToast("Số lượng không hợp lệ (tối thiểu là 1). Đã đặt lại về 1.", {
            type: "warning",
            showCartLink: false
          });
          return;
        }

        const result = window.updateQuantity(productId, rawValue, optionIndex, recipeGroupId);
        if (result.capped) {
          window.showCartToast(`Số lượng tối đa cho mỗi sản phẩm là ${MAX_QTY}.`, {
            type: "warning",
            showCartLink: false
          });
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", async function () {
        if (window.getCartCount() === 0) {
          return;
        }
        const confirmed = await askConfirm({
          title: "Xóa toàn bộ giỏ hàng",
          message: "Bạn có chắc muốn xóa toàn bộ sản phẩm khỏi giỏ hàng?",
          confirmText: "Đồng ý",
          cancelText: "Hủy bỏ"
        });
        if (confirmed) {
          window.clearCart();
          window.showCartToast("Đã xóa toàn bộ sản phẩm trong giỏ hàng.", { showCartLink: false });
        }
      });
    }

    if (proceedCheckoutBtn) {
      proceedCheckoutBtn.addEventListener("click", function (event) {
        if (window.getCartCount() === 0) {
          event.preventDefault();
          window.showCartToast("Giỏ hàng của bạn đang trống. Hãy chọn thêm sản phẩm nhé!", {
            type: "warning",
            showCartLink: false
          });
          return;
        }
        const selected = typeof window.getSelectedCartItems === "function" ? window.getSelectedCartItems() : window.getCart();
        if (!selected || selected.length === 0) {
          event.preventDefault();
          window.showCartToast("Vui lòng tick chọn ít nhất 1 sản phẩm để thanh toán.", {
            type: "warning",
            showCartLink: false
          });
        }
      });
    }

    function applyCartVoucherCode(code) {
      const selected = typeof window.getSelectedCartItems === "function" ? window.getSelectedCartItems() : window.getCart();
      const selectedSubtotal = typeof window.getCartTotal === "function" ? window.getCartTotal(selected) : 0;
      const result =
        typeof window.addCouponCode === "function"
          ? window.addCouponCode(code, selectedSubtotal)
          : window.setSavedCoupon
          ? window.setSavedCoupon(code, selectedSubtotal)
          : { valid: false, message: "Chức năng mã giảm giá chưa sẵn sàng." };

      if (!result.valid) {
        showCouponFeedback(result.message, true);
        if (couponInput) {
          couponInput.classList.add("is-invalid");
          couponInput.focus();
        }
        return;
      }

      if (couponInput) {
        couponInput.classList.remove("is-invalid");
        couponInput.value = "";
      }
      showCouponFeedback(result.message, false);
      renderCart();
    }

    if (couponForm && couponInput) {
      couponForm.addEventListener("submit", function (event) {
        event.preventDefault();
        applyCartVoucherCode(couponInput.value.trim());
      });

      couponInput.addEventListener("input", function () {
        couponInput.classList.remove("is-invalid");
      });
    }

    document.querySelectorAll(".js-cart-quick-voucher").forEach((btn) => {
      btn.addEventListener("click", function () {
        applyCartVoucherCode(btn.dataset.code || "");
      });
    });

    if (couponChips) {
      couponChips.addEventListener("click", function (event) {
        const rmBtn = event.target.closest(".js-remove-coupon-chip");
        if (!rmBtn) return;
        const targetCode = rmBtn.dataset.code;
        if (typeof window.removeSavedCoupon === "function") {
          window.removeSavedCoupon(targetCode);
          showCouponFeedback(`Đã gỡ mã ${targetCode}.`, false);
          renderCart();
        }
      });
    }

    if (removeCouponBtn) {
      removeCouponBtn.addEventListener("click", function () {
        if (typeof window.clearSavedCoupons === "function") {
          window.clearSavedCoupons();
        } else if (typeof window.clearSavedCoupon === "function") {
          window.clearSavedCoupon();
        }
        if (couponInput) {
          couponInput.value = "";
          couponInput.classList.remove("is-invalid");
        }
        showCouponFeedback("Đã gỡ tất cả mã giảm giá.", false);
        renderCart();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderCart();
    initCartEvents();
  });

  window.addEventListener("bakemate:cartChanged", function () {
    renderCart();
  });

  window.renderCart = renderCart;
})();
