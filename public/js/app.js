/*
 * BakeMate PHP MVC Global AJAX & UI Helper (public/js/app.js)
 */
(function () {
  const cfg = window.BAKEMATE_PHP || { baseUrl: "/", indexUrl: "/index.php", csrfToken: "", user: null };

  function escapeHtml(val) {
    return String(val == null ? "" : val)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatPrice(val) {
    return Number(val || 0).toLocaleString("vi-VN") + " ₫";
  }

  function apiUrl(controller, action, queryParams) {
    const u = new URL(cfg.indexUrl, window.location.origin);
    u.searchParams.set("c", controller);
    u.searchParams.set("a", action);
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

  async function postJson(controller, action, payload) {
    const res = await fetch(apiUrl(controller, action), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": cfg.csrfToken || ""
      },
      body: JSON.stringify(payload || {})
    });
    const data = await res.json().catch(() => ({ status: "error", code: res.status, message: "Lỗi kết nối máy chủ." }));
    if (!res.ok || data.status === "error") {
      throw new Error(data.message || "Không thể xử lý yêu cầu.");
    }
    return data;
  }

  async function postForm(controller, action, formData) {
    formData.append("csrf_token", cfg.csrfToken || "");
    const res = await fetch(apiUrl(controller, action), {
      method: "POST",
      headers: {
        "X-CSRF-Token": cfg.csrfToken || ""
      },
      body: formData
    });
    const data = await res.json().catch(() => ({ status: "error", code: res.status, message: "Lỗi kết nối máy chủ." }));
    if (!res.ok || data.status === "error") {
      throw new Error(data.message || "Không thể xử lý yêu cầu.");
    }
    return data;
  }

  function showToast(message, type) {
    const wrap = document.getElementById("bm-toast-container");
    if (!wrap) return;
    const toast = document.createElement("div");
    toast.className = "bm-toast bm-toast--" + (type || "info");
    toast.textContent = message;
    wrap.appendChild(toast);
    window.setTimeout(() => {
      toast.classList.add("is-leaving");
      window.setTimeout(() => toast.remove(), 260);
    }, 3200);
  }

  function showConfirm(message, title) {
    return new Promise((resolve) => {
      const backdrop = document.getElementById("bm-confirm-modal");
      const titleEl = document.getElementById("bm-confirm-title");
      const msgEl = document.getElementById("bm-confirm-msg");
      const okBtn = document.getElementById("bm-confirm-ok");
      const cancelBtn = document.getElementById("bm-confirm-cancel");
      if (!backdrop || !okBtn || !cancelBtn) {
        resolve(true);
        return;
      }
      if (titleEl) titleEl.textContent = title || "Xác nhận thao tác";
      if (msgEl) msgEl.textContent = message || "Bạn chắc chắn muốn thực hiện?";
      backdrop.hidden = false;

      function cleanup(ans) {
        backdrop.hidden = true;
        okBtn.removeEventListener("click", onOk);
        cancelBtn.removeEventListener("click", onCancel);
        resolve(ans);
      }
      function onOk() { cleanup(true); }
      function onCancel() { cleanup(false); }

      okBtn.addEventListener("click", onOk);
      cancelBtn.addEventListener("click", onCancel);
    });
  }

  function updateBadges(cartCount, wishCount) {
    const cartEl = document.getElementById("cart-badge");
    if (cartEl && typeof cartCount === "number") {
      cartEl.textContent = String(cartCount);
      cartEl.classList.toggle("is-empty", cartCount === 0);
    }
    const wishEl = document.getElementById("wishlist-badge");
    if (wishEl && typeof wishCount === "number") {
      wishEl.textContent = String(wishCount);
      wishEl.classList.toggle("is-empty", wishCount === 0);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    // 1. Copy Promo Topbar
    document.querySelectorAll(".js-copy-promo").forEach((btn) => {
      btn.addEventListener("click", async function () {
        const code = btn.getAttribute("data-coupon") || "";
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(code);
          }
        } catch (e) {}
        const lbl = btn.querySelector(".js-copy-promo-label");
        if (lbl) {
          lbl.textContent = "Đã chép";
          setTimeout(() => { lbl.textContent = "Sao chép"; }, 1800);
        }
        showToast("Đã sao chép mã " + code + "!", "success");
      });
    });

    // 2. Mega Menu hover + focus + Escape với debounce 220ms
    const megaItem = document.querySelector(".site-header__menu-item.has-megamenu");
    if (megaItem) {
      let closeTimer = null;
      const trigger = megaItem.querySelector(".js-megamenu-trigger");
      const openMega = () => {
        if (closeTimer) clearTimeout(closeTimer);
        megaItem.classList.add("is-open");
        if (trigger) trigger.setAttribute("aria-expanded", "true");
      };
      const scheduleClose = () => {
        closeTimer = setTimeout(() => {
          megaItem.classList.remove("is-open");
          if (trigger) trigger.setAttribute("aria-expanded", "false");
        }, 220);
      };
      megaItem.addEventListener("mouseenter", openMega);
      megaItem.addEventListener("mouseleave", scheduleClose);
      megaItem.addEventListener("focusin", openMega);
      megaItem.addEventListener("focusout", (e) => {
        if (!megaItem.contains(e.relatedTarget)) scheduleClose();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          megaItem.classList.remove("is-open");
          if (trigger) trigger.setAttribute("aria-expanded", "false");
        }
      });
    }

    // 3. Account Dropdown & Mobile Drawer
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
    }

    const mobToggle = document.querySelector(".js-mobile-menu-toggle");
    const mobDrawer = document.querySelector(".js-mobile-drawer");
    const mobClose = document.querySelector(".js-mobile-drawer-close");
    if (mobToggle && mobDrawer) {
      mobToggle.addEventListener("click", () => { mobDrawer.hidden = false; });
      if (mobClose) mobClose.addEventListener("click", () => { mobDrawer.hidden = true; });
      mobDrawer.addEventListener("click", (e) => { if (e.target === mobDrawer) mobDrawer.hidden = true; });
    }

    // 4. Header Quick Search Suggest
    const searchInput = document.querySelector(".js-header-search-input");
    const suggestBox = document.querySelector(".js-search-suggest");
    if (searchInput && suggestBox) {
      let sTimer = null;
      searchInput.addEventListener("input", () => {
        const kw = searchInput.value.trim();
        if (sTimer) clearTimeout(sTimer);
        if (kw.length < 2) {
          suggestBox.hidden = true;
          return;
        }
        sTimer = setTimeout(async () => {
          try {
            const res = await fetch(apiUrl("product", "ajaxQuickSearch", { q: kw }));
            const json = await res.json();
            const items = (json.data && json.data.items) || [];
            if (!items.length) {
              suggestBox.hidden = true;
              return;
            }
            suggestBox.innerHTML = items.map((it) => `
              <a href="${escapeHtml(apiUrl("product", "detail", { id: it.id }))}" class="search-suggest-item">
                <img src="${escapeHtml(cfg.baseUrl + "public/" + it.image)}" alt="" width="36" height="36" style="border-radius:6px;object-fit:cover;">
                <div>
                  <div style="font-weight:600;color:#70452b;">${escapeHtml(it.name)}</div>
                  <div style="font-size:12px;color:#c88b52;">${formatPrice(it.price)}</div>
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
    }

    // 5. Global Quick Add to Cart & Wishlist Toggle
    document.body.addEventListener("click", async function (event) {
      const addBtn = event.target.closest(".js-quick-add-cart");
      if (addBtn) {
        const pid = Number(addBtn.getAttribute("data-product-id"));
        const opt = Number(addBtn.getAttribute("data-option-index") || 0);
        try {
          addBtn.disabled = true;
          const res = await postJson("order", "ajaxCartAdd", { product_id: pid, option_index: opt, quantity: 1 });
          updateBadges(res.data.cart_count, undefined);
          showToast(res.message, "success");
        } catch (err) {
          showToast(err.message, "error");
        } finally {
          addBtn.disabled = false;
        }
        return;
      }

      const wishBtn = event.target.closest(".js-wishlist-toggle");
      if (wishBtn) {
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
          showToast(res.message, "success");
        } catch (err) {
          showToast(err.message, "error");
        }
      }
    });

    // 6. Footer Policy Modal
    const POLICY_CONTENT = {
      guide: {
        title: "Hướng dẫn mua hàng & Recipe-to-Cart",
        html: "<p><strong>Bước 1:</strong> Chọn nguyên liệu lẻ ở mục Sản phẩm hoặc mở trang Công thức để chọn món bánh bạn muốn làm.</p><p><strong>Bước 2:</strong> Điều chỉnh số phần bánh — hệ thống tự quy đổi định lượng & gợi ý quy cách túi nhỏ tiết kiệm.</p><p><strong>Bước 3:</strong> Tick chọn các sản phẩm muốn mua tại Giỏ hàng và tiến hành Thanh toán.</p>"
      },
      shipping: {
        title: "Chính sách giao hàng & Bảo quản lạnh",
        html: "<p>- <strong>Nội thành TP.HCM:</strong> Giao nhanh 4–6h (20.000 đ) hoặc Hỏa tốc 2h (40.000 đ). Hàng tươi lạnh (Whipping Cream, Bơ lạt, Trứng gà) chỉ giao Hỏa tốc 2h hoặc Nhận tại 59C Nguyễn Đình Chiểu, Q.3.</p><p>- <strong>Ngoại thành & Tỉnh thành:</strong> Giao hàng qua GHN / GHTK trong 2–4 ngày làm việc.</p>"
      },
      returns: {
        title: "Chính sách đổi trả & Hoàn tiền",
        html: "<p>BakeMate hỗ trợ đổi mới 1-1 trong vòng 48 giờ nếu nguyên liệu bị hư hỏng khi vận chuyển, sai quy cách hoặc thiếu sản phẩm so với đơn đặt.</p>"
      }
    };
    const pModal = document.getElementById("bm-policy-modal");
    const pTitle = document.getElementById("bm-policy-title");
    const pBody = document.getElementById("bm-policy-body");
    document.querySelectorAll(".js-policy-trigger").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const key = link.getAttribute("data-policy");
        const doc = POLICY_CONTENT[key];
        if (doc && pModal && pTitle && pBody) {
          pTitle.textContent = doc.title;
          pBody.innerHTML = doc.html;
          pModal.hidden = false;
        }
      });
    });
    document.querySelectorAll(".js-policy-close").forEach((b) => {
      b.addEventListener("click", () => { if (pModal) pModal.hidden = true; });
    });
    if (pModal) {
      pModal.addEventListener("click", (e) => { if (e.target === pModal) pModal.hidden = true; });
    }
  });

  window.BakeApp = {
    apiUrl,
    postJson,
    postForm,
    escapeHtml,
    formatPrice,
    showToast,
    showConfirm,
    updateBadges
  };
})();
