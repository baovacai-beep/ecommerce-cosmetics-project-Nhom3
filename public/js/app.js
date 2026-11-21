/*
 * BakeMate PHP OOP MVC Global Helper & Interactions
 * File: public/js/app.js
 * Modules:
 *  - Design System & Global AJAX (getJson, postJson, postForm, apiUrl)
 *  - Global Toast Notifications (success, error, warning, info) with auto-dismiss & close
 *  - Global Modal & Confirmation Dialog (showConfirm)
 *  - Promo Topbar Copy with fallback clipboard
 *  - 3-Column Mega Menu for Desktop (hover debounce, keyboard focus, Escape)
 *  - Mobile Drawer & 3-Column Mobile Mega Menu Accordion
 *  - Live Search Suggestion
 *  - Header Badges Synchronization (Cart & Wishlist)
 *  - Footer Customer Support Policy Modal
 */
(function () {
  "use strict";

  const cfg = window.BAKEMATE_PHP || {
    baseUrl: "/",
    indexUrl: "/index.php",
    csrfToken: "",
    user: null
  };

  /**
   * Escape HTML entities to prevent XSS
   */
  function escapeHtml(val) {
    return String(val == null ? "" : val)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Format numeric price into Vietnamese Dong format
   */
  function formatPrice(val) {
    return Number(val || 0).toLocaleString("vi-VN") + " ₫";
  }

  /**
   * Build safe public asset URL from relative or normalized path
   */
  function assetUrl(relativePath) {
    const raw = String(relativePath || "images/logo.jpg").trim();
    if (/^https?:\/\//i.test(raw) || raw.startsWith("/")) {
      return raw;
    }
    const clean = raw.replace(/^\/+/, "");
    const normalized = clean.startsWith("public/") ? clean : "public/" + clean;
    const base = String(cfg.baseUrl || "/").replace(/\/+$/, "") + "/";
    return base + normalized;
  }

  /**
   * Build MVC URL with query parameters
   */
  function apiUrl(controller, action, queryParams) {
    const u = new URL(cfg.indexUrl, window.location.origin);
    if (controller) u.searchParams.set("c", controller);
    if (action) u.searchParams.set("a", action);
    if (queryParams && typeof queryParams === "object") {
      Object.entries(queryParams).forEach(([k, v]) => {
        if (Array.isArray(v)) {
          v.forEach((item) => u.searchParams.append(k + "[]", item));
        } else if (v !== undefined && v !== null && v !== "") {
          u.searchParams.set(k, String(v));
        }
      });
    }
    return u.toString();
  }

  /**
   * Copy text to clipboard with fallback for non-secure or older contexts
   */
  async function copyToClipboard(text) {
    if (!text) return false;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      // Fallback below
    }

    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.top = "-9999px";
      textArea.style.left = "-9999px";
      textArea.setAttribute("readonly", "");
      document.body.appendChild(textArea);
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    } catch (e) {
      return false;
    }
  }

  /**
   * Global AJAX GET helper
   */
  async function getJson(controller, action, queryParams) {
    const url = apiUrl(controller, action, queryParams);
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      }
    }).catch(() => {
      throw new Error("Lỗi kết nối máy chủ. Vui lòng kiểm tra đường truyền mạng.");
    });

    const data = await res.json().catch(() => ({
      status: "error",
      code: res.status,
      message: "Phản hồi máy chủ không hợp lệ."
    }));

    if (!res.ok || data.status === "error") {
      throw new Error(data.message || "Không thể xử lý yêu cầu.");
    }
    return data;
  }

  /**
   * Global AJAX POST JSON helper
   */
  async function postJson(controller, action, payload) {
    const url = apiUrl(controller, action);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-Token": cfg.csrfToken || ""
      },
      body: JSON.stringify(payload || {})
    }).catch(() => {
      throw new Error("Lỗi kết nối máy chủ. Vui lòng thử lại.");
    });

    const data = await res.json().catch(() => ({
      status: "error",
      code: res.status,
      message: "Phản hồi máy chủ không hợp lệ."
    }));

    if (!res.ok || data.status === "error") {
      throw new Error(data.message || "Không thể xử lý yêu cầu.");
    }
    return data;
  }

  /**
   * Global AJAX POST FormData helper
   */
  async function postForm(controller, action, formData) {
    if (formData instanceof FormData && cfg.csrfToken && !formData.has("csrf_token")) {
      formData.append("csrf_token", cfg.csrfToken);
    }
    const url = apiUrl(controller, action);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-Token": cfg.csrfToken || ""
      },
      body: formData
    }).catch(() => {
      throw new Error("Lỗi kết nối máy chủ. Vui lòng thử lại.");
    });

    const data = await res.json().catch(() => ({
      status: "error",
      code: res.status,
      message: "Phản hồi máy chủ không hợp lệ."
    }));

    if (!res.ok || data.status === "error") {
      throw new Error(data.message || "Không thể xử lý yêu cầu.");
    }
    return data;
  }

  /**
   * Toast notification icons
   */
  const TOAST_ICONS = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`,
    error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  };

  /**
   * Display a consistent Toast notification
   */
  function showToast(message, type, duration) {
    let wrap = document.getElementById("bm-toast-container");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "bm-toast-container";
      wrap.className = "bm-toast-container";
      wrap.setAttribute("aria-live", "polite");
      document.body.appendChild(wrap);
    }

    const tType = (type === "success" || type === "error" || type === "warning") ? type : "info";
    const tDuration = typeof duration === "number" ? duration : 3400;

    const toast = document.createElement("div");
    toast.className = `bm-toast bm-toast--${tType}`;
    toast.setAttribute("role", "status");

    toast.innerHTML = `
      <span class="bm-toast__icon">${TOAST_ICONS[tType]}</span>
      <div class="bm-toast__content">
        <span class="bm-toast__msg">${escapeHtml(message || "")}</span>
      </div>
      <button type="button" class="bm-toast__close" aria-label="Đóng thông báo">&times;</button>
    `;

    wrap.appendChild(toast);

    let dismissTimer = null;
    let isDismissed = false;

    function dismissToast() {
      if (isDismissed) return;
      isDismissed = true;
      if (dismissTimer) clearTimeout(dismissTimer);
      toast.classList.add("is-leaving");
      window.setTimeout(() => {
        toast.remove();
      }, 260);
    }

    function startTimer() {
      dismissTimer = window.setTimeout(dismissToast, tDuration);
    }

    function pauseTimer() {
      if (dismissTimer) clearTimeout(dismissTimer);
    }

    const closeBtn = toast.querySelector(".bm-toast__close");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dismissToast();
      });
    }

    toast.addEventListener("mouseenter", pauseTimer);
    toast.addEventListener("mouseleave", startTimer);

    startTimer();
  }

  /**
   * Custom Confirmation Modal with Promise
   */
  function showConfirm(message, title) {
    return new Promise((resolve) => {
      const backdrop = document.getElementById("bm-confirm-modal");
      const titleEl = document.getElementById("bm-confirm-title");
      const msgEl = document.getElementById("bm-confirm-msg");
      const okBtn = document.getElementById("bm-confirm-ok");
      const cancelBtn = document.getElementById("bm-confirm-cancel");
      const closeBtn = backdrop ? backdrop.querySelector(".js-confirm-close") : null;

      if (!backdrop || !okBtn || !cancelBtn) {
        // Fallback to browser confirm
        resolve(window.confirm(message || "Bạn chắc chắn muốn thực hiện?"));
        return;
      }

      if (titleEl) titleEl.textContent = title || "Xác nhận thao tác";
      if (msgEl) msgEl.textContent = message || "Bạn chắc chắn muốn thực hiện?";
      backdrop.hidden = false;
      document.body.style.overflow = "hidden";

      function cleanup(ans) {
        backdrop.hidden = true;
        document.body.style.overflow = "";
        okBtn.removeEventListener("click", onOk);
        cancelBtn.removeEventListener("click", onCancel);
        if (closeBtn) closeBtn.removeEventListener("click", onCancel);
        document.removeEventListener("keydown", onKey);
        backdrop.removeEventListener("click", onBackdrop);
        resolve(ans);
      }

      function onOk() { cleanup(true); }
      function onCancel() { cleanup(false); }

      function onKey(e) {
        if (e.key === "Escape") cleanup(false);
        if (e.key === "Enter") cleanup(true);
      }

      function onBackdrop(e) {
        if (e.target === backdrop) cleanup(false);
      }

      okBtn.addEventListener("click", onOk);
      cancelBtn.addEventListener("click", onCancel);
      if (closeBtn) closeBtn.addEventListener("click", onCancel);
      document.addEventListener("keydown", onKey);
      backdrop.addEventListener("click", onBackdrop);

      // Focus OK button for accessible keyboard flow
      okBtn.focus();
    });
  }

  /**
   * Synchronize Cart & Wishlist counters
   */
  function updateBadges(cartCount, wishCount) {
    if (typeof cartCount === "number") {
      const cartEl = document.getElementById("cart-badge");
      if (cartEl) {
        cartEl.textContent = String(cartCount);
        cartEl.classList.toggle("is-empty", cartCount === 0);
      }
    }
    if (typeof wishCount === "number") {
      const wishEls = document.querySelectorAll(".js-wishlist-badge, #wishlist-badge");
      wishEls.forEach((el) => {
        el.textContent = String(wishCount);
        el.classList.toggle("is-empty", wishCount === 0);
      });
    }
  }

  /*
   * Initialize layout interactions when DOM is ready
   */
  document.addEventListener("DOMContentLoaded", function () {
    // -------------------------------------------------------------
    // 1. Promo Topbar Coupon Copy
    // -------------------------------------------------------------
    const promoButtons = document.querySelectorAll(".js-copy-promo");
    promoButtons.forEach((btn) => {
      btn.addEventListener("click", async function (e) {
        e.preventDefault();
        const code = btn.getAttribute("data-coupon") || "";
        if (!code) return;

        const success = await copyToClipboard(code);
        if (success) {
          btn.classList.add("is-copied");
          const label = btn.querySelector(".js-copy-promo-label");
          const originalText = label ? label.textContent : "";
          if (label) label.textContent = "Đã chép";

          setTimeout(() => {
            btn.classList.remove("is-copied");
            if (label) label.textContent = originalText || "Sao chép";
          }, 2000);

          showToast("Đã sao chép mã ưu đãi " + code + "!", "success");
        } else {
          showToast("Mã ưu đãi: " + code + " (không thể tự động sao chép)", "info");
        }
      });
    });

    // -------------------------------------------------------------
    // 2. 3-Column Mega Menu (Desktop & Touch)
    // -------------------------------------------------------------
    const megaItem = document.querySelector(".site-header__menu-item.has-megamenu");
    if (megaItem) {
      let closeTimer = null;
      const trigger = megaItem.querySelector(".js-megamenu-trigger");
      const panel = megaItem.querySelector(".mega-menu");

      const openMega = () => {
        if (closeTimer) clearTimeout(closeTimer);
        megaItem.classList.add("is-open");
        if (trigger) trigger.setAttribute("aria-expanded", "true");
      };

      const closeMega = () => {
        if (closeTimer) clearTimeout(closeTimer);
        megaItem.classList.remove("is-open");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      };

      const scheduleClose = () => {
        if (closeTimer) clearTimeout(closeTimer);
        closeTimer = setTimeout(closeMega, 220);
      };

      // Desktop hover
      megaItem.addEventListener("mouseenter", () => {
        if (window.innerWidth > 1024) openMega();
      });
      megaItem.addEventListener("mouseleave", () => {
        if (window.innerWidth > 1024) scheduleClose();
      });

      // Keyboard accessibility
      megaItem.addEventListener("focusin", () => {
        if (window.innerWidth > 1024) openMega();
      });
      megaItem.addEventListener("focusout", (e) => {
        if (window.innerWidth > 1024 && !megaItem.contains(e.relatedTarget)) {
          scheduleClose();
        }
      });

      // Touch / Click on Tablet & Small screens
      if (trigger) {
        trigger.addEventListener("click", (e) => {
          if (window.innerWidth <= 1024) {
            e.preventDefault();
            const isOpen = megaItem.classList.contains("is-open");
            if (isOpen) {
              closeMega();
            } else {
              openMega();
            }
          }
        });
      }

      // Escape key closes mega menu
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && megaItem.classList.contains("is-open")) {
          const wasInside = megaItem.contains(document.activeElement);
          closeMega();
          if (wasInside && trigger) trigger.focus();
        }
      });

      // Click outside closes
      document.addEventListener("click", (e) => {
        if (megaItem.classList.contains("is-open") && !megaItem.contains(e.target)) {
          closeMega();
        }
      });

      // Click on any link inside megamenu closes it
      if (panel) {
        panel.querySelectorAll("a").forEach((link) => {
          link.addEventListener("click", closeMega);
        });
      }
    }

    // -------------------------------------------------------------
    // 3. Mobile Navigation Drawer & Accordion Mega Menu
    // -------------------------------------------------------------
    const mobToggle = document.querySelector(".js-mobile-menu-toggle");
    const mobDrawer = document.querySelector(".js-mobile-drawer");
    const mobCloseBtns = document.querySelectorAll(".js-mobile-drawer-close");

    function openMobileDrawer() {
      if (!mobDrawer) return;
      mobDrawer.hidden = false;
      document.body.style.overflow = "hidden";
      if (mobToggle) mobToggle.setAttribute("aria-expanded", "true");
    }

    function closeMobileDrawer() {
      if (!mobDrawer) return;
      mobDrawer.hidden = true;
      document.body.style.overflow = "";
      if (mobToggle) mobToggle.setAttribute("aria-expanded", "false");
    }

    if (mobToggle && mobDrawer) {
      mobToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        if (mobDrawer.hidden) openMobileDrawer();
        else closeMobileDrawer();
      });
    }

    mobCloseBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        closeMobileDrawer();
      });
    });

    if (mobDrawer) {
      mobDrawer.addEventListener("click", (e) => {
        if (e.target === mobDrawer || e.target.classList.contains("mobile-drawer__backdrop")) {
          closeMobileDrawer();
        }
      });
    }

    // Mobile Mega Menu Accordion Toggle
    const mobileSubToggles = document.querySelectorAll(".js-mobile-sub-toggle");
    mobileSubToggles.forEach((subToggle) => {
      subToggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const parentItem = subToggle.closest(".js-mobile-megamenu-item");
        const subMenu = parentItem ? parentItem.querySelector(".js-mobile-sub-menu") : null;
        if (!subMenu) return;

        const isCurrentlyHidden = subMenu.hidden;
        subMenu.hidden = !isCurrentlyHidden;
        subToggle.setAttribute("aria-expanded", isCurrentlyHidden ? "true" : "false");
        subToggle.classList.toggle("is-open", isCurrentlyHidden);
        if (parentItem) parentItem.classList.toggle("is-expanded", isCurrentlyHidden);
      });
    });

    // Close mobile drawer on desktop resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024 && mobDrawer && !mobDrawer.hidden) {
        closeMobileDrawer();
      }
    });

    // -------------------------------------------------------------
    // 4. Header Account Dropdown
    // -------------------------------------------------------------
    const accWrap = document.querySelector(".js-account-wrap");
    const accTrigger = document.querySelector(".js-account-trigger");
    if (accWrap && accTrigger) {
      accTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const next = !accWrap.classList.contains("is-open");
        accWrap.classList.toggle("is-open", next);
        accTrigger.setAttribute("aria-expanded", next ? "true" : "false");
      });

      document.addEventListener("click", (e) => {
        if (!accWrap.contains(e.target)) {
          accWrap.classList.remove("is-open");
          accTrigger.setAttribute("aria-expanded", "false");
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && accWrap.classList.contains("is-open")) {
          accWrap.classList.remove("is-open");
          accTrigger.setAttribute("aria-expanded", "false");
          accTrigger.focus();
        }
      });
    }

    // -------------------------------------------------------------
    // 5. Header Quick Search Live Suggest
    // -------------------------------------------------------------
    const searchInput = document.querySelector(".js-header-search-input");
    const suggestBox = document.querySelector(".js-search-suggest");
    if (searchInput && suggestBox) {
      let sTimer = null;
      searchInput.addEventListener("input", () => {
        const kw = searchInput.value.trim();
        if (sTimer) clearTimeout(sTimer);
        if (kw.length < 2) {
          suggestBox.hidden = true;
          suggestBox.innerHTML = "";
          return;
        }

        sTimer = setTimeout(async () => {
          try {
            const json = await getJson("product", "ajaxQuickSearch", { q: kw });
            const items = (json.data && json.data.items) || [];
            if (!items.length) {
              suggestBox.innerHTML = `
                <div style="padding:10px 14px;color:#7c5c46;font-size:13px;text-align:center;">
                  Không tìm thấy sản phẩm cho "${escapeHtml(kw)}"
                </div>
              `;
              suggestBox.hidden = false;
              return;
            }

            suggestBox.innerHTML = items.map((it) => `
              <a href="${escapeHtml(apiUrl("product", "detail", { id: it.id }))}" class="search-suggest-item">
                <img src="${escapeHtml(assetUrl(it.image))}" alt="${escapeHtml(it.name)}" width="38" height="38" style="border-radius:6px;object-fit:cover;flex-shrink:0;">
                <div style="flex:1;min-width:0;">
                  <div style="font-weight:600;color:#70452b;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(it.name)}</div>
                  <div style="font-size:12px;color:#c88b52;font-weight:700;">${formatPrice(it.price)}</div>
                </div>
              </a>
            `).join("");
            suggestBox.hidden = false;
          } catch (e) {
            suggestBox.hidden = true;
          }
        }, 220);
      });

      document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !suggestBox.contains(e.target)) {
          suggestBox.hidden = true;
        }
      });

      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          suggestBox.hidden = true;
        }
      });
    }

    // -------------------------------------------------------------
    // 6. Global Quick Add to Cart & Wishlist Toggle
    // -------------------------------------------------------------
    document.body.addEventListener("click", async function (event) {
      const addBtn = event.target.closest(".js-quick-add-cart");
      if (addBtn) {
        event.preventDefault();
        const pid = Number(addBtn.getAttribute("data-product-id"));
        const opt = Number(addBtn.getAttribute("data-option-index") || 0);
        try {
          addBtn.disabled = true;
          const res = await postJson("order", "ajaxCartAdd", { product_id: pid, option_index: opt, quantity: 1 });
          updateBadges(res.data.cart_count, undefined);
          showToast(res.message || "Đã thêm sản phẩm vào giỏ hàng!", "success");
        } catch (err) {
          showToast(err.message, "error");
        } finally {
          addBtn.disabled = false;
        }
        return;
      }

      const wishBtn = event.target.closest(".js-wishlist-toggle");
      if (wishBtn) {
        event.preventDefault();
        const pid = Number(wishBtn.getAttribute("data-product-id"));
        try {
          const res = await postJson("product", "ajaxToggleWishlist", { product_id: pid });
          const added = Boolean(res.data.added);
          document.querySelectorAll(`.js-wishlist-toggle[data-product-id="${pid}"]`).forEach((b) => {
            b.classList.toggle("is-active", added);
            const svg = b.querySelector("svg");
            if (svg) svg.setAttribute("fill", added ? "currentColor" : "none");
          });
          updateBadges(undefined, res.data.count);
          showToast(res.message || (added ? "Đã thêm vào danh sách yêu thích!" : "Đã bỏ khỏi danh sách yêu thích!"), "success");
        } catch (err) {
          showToast(err.message, "error");
        }
      }
    });

    // -------------------------------------------------------------
    // 7. Footer Customer Support Policy Modal
    // -------------------------------------------------------------
    const POLICY_CONTENT = {
      guide: {
        title: "Hướng dẫn mua hàng & Đặt hàng theo công thức",
        html: `
          <p><strong>Bước 1 - Khám phá:</strong> Bạn có thể tìm kiếm nguyên liệu lẻ tại mục <a href="${escapeHtml(apiUrl("product", "catalog"))}" style="color:#f59e0b;font-weight:600;">Sản phẩm</a> hoặc chọn món bánh yêu thích tại mục <a href="${escapeHtml(apiUrl("recipe", "index"))}" style="color:#f59e0b;font-weight:600;">Công thức</a>.</p>
          <p><strong>Bước 2 - Tính toán định lượng (Recipe-to-Cart):</strong> Khi xem công thức, hãy nhập số phần bánh bạn muốn làm. Hệ thống BakeMate sẽ tự động tính đúng định lượng gram, gợi ý kích thước bao bì phù hợp và cho phép thêm toàn bộ combo vào giỏ hàng chỉ với 1 cú click.</p>
          <p><strong>Bước 3 - Kiểm tra giỏ hàng:</strong> Vào Giỏ hàng, bạn có thể tick chọn từng sản phẩm, chọn mã giảm giá (như <code>CHAOBANMOI</code>, <code>FREESHIP20</code>) và ấn <strong>Tiến hành đặt hàng</strong>.</p>
          <p><strong>Bước 4 - Thanh toán & Nhận hàng:</strong> Điền thông tin nhận hàng, lựa chọn phương thức giao nhận (Hỏa tốc 2H hoặc Giao tiêu chuẩn) và thanh toán qua VietQR, MoMo hoặc COD.</p>
        `
      },
      shipping: {
        title: "Chính sách giao hàng & Bảo quản lạnh chuyên dụng",
        html: `
          <p><strong>1. Khu vực Nội thành TP.HCM:</strong></p>
          <ul style="padding-left:20px;margin-bottom:12px;line-height:1.65;">
            <li><strong>Giao tiêu chuẩn (4–6 giờ):</strong> Phí giao 20.000₫ (Miễn phí cho đơn hàng từ 200.000₫).</li>
            <li><strong>Hỏa tốc (2 giờ):</strong> Phí giao 40.000₫. Áp dụng cho các quận nội thành.</li>
            <li><strong>Nhận tại cửa hàng:</strong> Miễn phí tại 59C Nguyễn Đình Chiểu, Quận 3, TP.HCM.</li>
          </ul>
          <p><strong>2. Quy chuẩn hàng tươi lạnh:</strong></p>
          <p>Đối với các nguyên liệu nhạy cảm nhiệt độ như <em>Whipping Cream, Bơ lạt động vật, Phô mai Cream Cheese, Men tươi</em>, BakeMate luôn đóng gói kèm túi đá gel giữ nhiệt tiêu chuẩn thực phẩm, đảm bảo giữ lạnh suốt 4 tiếng khi giao hàng.</p>
          <p><strong>3. Giao hàng toàn quốc:</strong></p>
          <p>BakeMate hợp tác cùng GHN và GHTK giao các nguyên liệu khô và dụng cụ đến tất cả các tỉnh thành trong 2–4 ngày làm việc.</p>
        `
      },
      returns: {
        title: "Chính sách đổi trả & Bảo hành 1-1 trong 48 giờ",
        html: `
          <p>BakeMate cam kết mang đến những nguyên liệu đạt chuẩn an toàn vệ sinh thực phẩm và hạn sử dụng rõ ràng. Chúng tôi áp dụng chính sách <strong>đổi mới 1-1 hoặc hoàn tiền 100%</strong> trong các trường hợp sau:</p>
          <ul style="padding-left:20px;margin-bottom:12px;line-height:1.65;">
            <li>Hàng bị rách bao bì, vỡ hỏng hoặc biến chất trong quá trình vận chuyển.</li>
            <li>Giao sai chủng loại, thiếu khối lượng hoặc sai quy cách so với đơn đặt.</li>
            <li>Sản phẩm cận date (dưới 30 ngày) mà không có thông báo trước.</li>
          </ul>
          <p><strong>Thời hạn khiếu nại:</strong> Trong vòng <strong>48 giờ</strong> kể từ lúc nhận hàng, quý khách vui lòng chụp ảnh hoặc quay video kiện hàng và liên hệ Hotline <strong>1900 8888</strong> hoặc gửi tin nhắn tại trang Liên hệ để được hỗ trợ nhanh nhất.</p>
        `
      }
    };

    const pModal = document.getElementById("bm-policy-modal");
    const pTitle = document.getElementById("bm-policy-title");
    const pBody = document.getElementById("bm-policy-body");

    function openPolicyModal(key) {
      const doc = POLICY_CONTENT[key];
      if (doc && pModal && pTitle && pBody) {
        pTitle.textContent = doc.title;
        pBody.innerHTML = doc.html;
        pModal.hidden = false;
        document.body.style.overflow = "hidden";
      }
    }

    function closePolicyModal() {
      if (pModal) {
        pModal.hidden = true;
        document.body.style.overflow = "";
      }
    }

    document.querySelectorAll(".js-policy-trigger").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const key = link.getAttribute("data-policy");
        openPolicyModal(key);
      });
    });

    document.querySelectorAll(".js-policy-close").forEach((b) => {
      b.addEventListener("click", (e) => {
        e.preventDefault();
        closePolicyModal();
      });
    });

    if (pModal) {
      pModal.addEventListener("click", (e) => {
        if (e.target === pModal) closePolicyModal();
      });
    }

    // Global Escape key handler for open modals & drawers
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (pModal && !pModal.hidden) closePolicyModal();
        if (mobDrawer && !mobDrawer.hidden) closeMobileDrawer();
      }
    });
  });

  /**
   * Expose global helper interface on window
   */
  window.BakeApp = {
    cfg,
    assetUrl,
    apiUrl,
    getJson,
    postJson,
    postForm,
    escapeHtml,
    formatPrice,
    showToast,
    showConfirm,
    updateBadges
  };

  // Aliases for developer convenience across views
  window.showToast = showToast;
  window.showConfirm = showConfirm;
  window.BakeToast = { show: showToast };
})();
