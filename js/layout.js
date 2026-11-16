/*
 * =====================================================
 * BAKEMATE - ĐIỀU KHIỂN GIAO DIỆN CHUNG TOÀN WEBSITE
 * Tệp: js/layout.js
 * Chức năng:
 *  - Thanh Topbar cảnh báo Admin khi xem giao diện khách hàng
 *  - Mega Menu 3 cột cho mục "Sản phẩm" & Menu Mobile Drawer
 *  - Gợi ý tìm kiếm nhanh trên Header
 *  - Đồng bộ trạng thái Tài khoản (Guest / Customer / Admin), Yêu thích, Giỏ hàng
 *  - Modal Chính sách hỗ trợ khách hàng ở Footer
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

  function normalizeText(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .trim();
  }

  /**
   * 1. Thanh Topbar thông báo quyền Quản trị viên (nếu Admin đang xem trang khách hàng)
   */
  function renderAdminNoticeBar() {
    const existing = document.getElementById("bakemate-admin-topbar");
    const isAdminPage = window.location.pathname.endsWith("admin.html");
    if (isAdminPage) {
      if (existing) existing.remove();
      return;
    }

    const user =
      typeof window.BakeAuth === "object" && typeof window.BakeAuth.getCurrentUser === "function"
        ? window.BakeAuth.getCurrentUser()
        : null;

    if (!user || user.role !== "admin") {
      if (existing) existing.remove();
      return;
    }

    if (existing) return;

    const bar = document.createElement("div");
    bar.id = "bakemate-admin-topbar";
    bar.className = "admin-presence-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Trạng thái Quản trị viên");
    bar.innerHTML = `
      <div class="admin-presence-bar__inner">
        <span class="admin-presence-bar__text">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Bạn đang đăng nhập với quyền <strong>Quản trị viên</strong> (${escapeHtml(user.fullName)})
        </span>
        <a href="admin.html" class="admin-presence-bar__btn">Đi tới Admin Dashboard &rarr;</a>
      </div>
    `;
    document.body.insertBefore(bar, document.body.firstChild);
  }

  /**
   * 2. Cụm Tài khoản trên Header (Guest / Customer / Admin Dropdown)
   */
  function renderHeaderAccount() {
    const slots = document.querySelectorAll(".js-account-wrap");
    if (!slots.length) return;

    const user =
      typeof window.BakeAuth === "object" && typeof window.BakeAuth.getCurrentUser === "function"
        ? window.BakeAuth.getCurrentUser()
        : null;

    slots.forEach((slot) => {
      const btn = slot.querySelector(".js-account-trigger");
      const menu = slot.querySelector(".js-account-menu");
      if (!btn || !menu) return;

      if (!user) {
        btn.classList.remove("is-logged-in");
        btn.setAttribute("aria-label", "Tài khoản: Đăng nhập hoặc Đăng ký");
        btn.title = "Đăng nhập / Đăng ký";
        const label = btn.querySelector(".js-account-name");
        if (label) {
          label.textContent = "";
          label.hidden = true;
        }
        menu.innerHTML = `
          <div class="account-dropdown__head">
            <strong>Tài khoản BakeMate</strong>
            <span>Đăng nhập để tích điểm &amp; quản lý đơn hàng</span>
          </div>
          <a href="login.html" class="account-dropdown__item">
            <span>Đăng nhập</span>
          </a>
          <a href="register.html" class="account-dropdown__item">
            <span>Đăng ký thành viên mới</span>
          </a>
          <a href="forgot-password.html" class="account-dropdown__item">
            <span>Quên mật khẩu</span>
          </a>
          <div class="account-dropdown__divider"></div>
          <a href="orders.html" class="account-dropdown__item">
            <span>Theo dõi đơn hàng</span>
          </a>
        `;
      } else {
        btn.classList.add("is-logged-in");
        btn.setAttribute("aria-label", `Tài khoản: ${user.fullName}`);
        btn.title = `${user.fullName} (${user.role === "admin" ? "Quản trị viên" : "Khách hàng"})`;
        const shortName = String(user.fullName || "Thành viên").split(" ").slice(-1)[0];
        const label = btn.querySelector(".js-account-name");
        if (label) {
          label.textContent = shortName;
          label.hidden = false;
        }
        menu.innerHTML = `
          <div class="account-dropdown__head">
            <strong>${escapeHtml(user.fullName)}</strong>
            <span class="account-role-pill ${user.role === "admin" ? "is-admin" : ""}">
              ${user.role === "admin" ? "Quản trị viên (Admin)" : "Khách hàng thân thiết"}
            </span>
          </div>
          ${
            user.role === "admin"
              ? `<a href="admin.html" class="account-dropdown__item account-dropdown__item--highlight"><span>Admin Dashboard</span></a>`
              : ""
          }
          <a href="orders.html" class="account-dropdown__item"><span>Đơn hàng &amp; Lịch sử mua</span></a>
          <a href="wishlist.html" class="account-dropdown__item"><span>Sản phẩm &amp; Công thức yêu thích</span></a>
          <div class="account-dropdown__divider"></div>
          <button type="button" class="account-dropdown__item account-dropdown__item--danger js-logout-btn">
            <span>Đăng xuất</span>
          </button>
        `;

        const logoutBtn = menu.querySelector(".js-logout-btn");
        if (logoutBtn) {
          logoutBtn.addEventListener("click", function () {
            if (window.BakeAuth && typeof window.BakeAuth.logoutAccount === "function") {
              window.BakeAuth.logoutAccount();
            }
            if (typeof window.showCartToast === "function") {
              window.showCartToast("Bạn đã đăng xuất khỏi tài khoản BakeMate.", { type: "success" });
            }
            if (window.location.pathname.endsWith("admin.html")) {
              window.location.href = "index.html";
            }
          });
        }
      }
    });
  }

  /**
   * 3. Mega Menu Sản phẩm & Mobile Menu Drawer
   */
  function initNavigationInteractions() {
    const megaParents = document.querySelectorAll(".has-megamenu");
    megaParents.forEach((parent) => {
      const trigger = parent.querySelector(".js-megamenu-trigger");
      const panel = parent.querySelector(".mega-menu");
      if (!trigger || !panel) return;

      let closeTimer = null;

      function cancelClose() {
        if (closeTimer) {
          clearTimeout(closeTimer);
          closeTimer = null;
        }
      }

      function openMega() {
        cancelClose();
        parent.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }

      function closeMegaImmediate() {
        cancelClose();
        parent.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      }

      function scheduleCloseMega() {
        cancelClose();
        closeTimer = setTimeout(closeMegaImmediate, 220);
      }

      trigger.addEventListener("click", function (event) {
        if (window.innerWidth <= 1024) {
          event.preventDefault();
          const willOpen = !parent.classList.contains("is-open");
          if (willOpen) openMega();
          else closeMegaImmediate();
        }
      });

      parent.addEventListener("mouseenter", function () {
        if (window.innerWidth > 1024) {
          openMega();
        }
      });

      parent.addEventListener("mouseleave", function () {
        if (window.innerWidth > 1024) {
          scheduleCloseMega();
        }
      });

      panel.addEventListener("mouseenter", function () {
        if (window.innerWidth > 1024) {
          openMega();
        }
      });

      panel.addEventListener("mouseleave", function () {
        if (window.innerWidth > 1024) {
          scheduleCloseMega();
        }
      });

      parent.addEventListener("focusin", function () {
        if (window.innerWidth > 1024) {
          openMega();
        }
      });

      parent.addEventListener("focusout", function (event) {
        if (window.innerWidth > 1024 && !parent.contains(event.relatedTarget)) {
          scheduleCloseMega();
        }
      });

      panel.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", function () {
          closeMegaImmediate();
        });
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      document.querySelectorAll(".has-megamenu.is-open").forEach((item) => {
        const wasInside = item.contains(document.activeElement);
        item.classList.remove("is-open");
        const trig = item.querySelector(".js-megamenu-trigger");
        if (trig) {
          trig.setAttribute("aria-expanded", "false");
          if (wasInside) trig.focus();
        }
      });
    });

    // Account dropdown click toggle
    document.querySelectorAll(".js-account-wrap").forEach((wrap) => {
      const btn = wrap.querySelector(".js-account-trigger");
      if (!btn) return;
      btn.addEventListener("click", function (event) {
        event.stopPropagation();
        const isOpen = wrap.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    });

    document.addEventListener("click", function (event) {
      document.querySelectorAll(".js-account-wrap.is-open").forEach((wrap) => {
        if (!wrap.contains(event.target)) {
          wrap.classList.remove("is-open");
          const btn = wrap.querySelector(".js-account-trigger");
          if (btn) btn.setAttribute("aria-expanded", "false");
        }
      });
      document.querySelectorAll(".has-megamenu.is-open").forEach((item) => {
        if (!item.contains(event.target)) {
          item.classList.remove("is-open");
          const trig = item.querySelector(".js-megamenu-trigger");
          if (trig) trig.setAttribute("aria-expanded", "false");
        }
      });
    });

    // Mobile hamburger menu toggle
    const mobileToggle = document.querySelector(".js-mobile-menu-toggle");
    const headerNav = document.querySelector(".site-header__nav");
    if (mobileToggle && headerNav) {
      mobileToggle.addEventListener("click", function () {
        const opened = headerNav.classList.toggle("is-mobile-open");
        mobileToggle.setAttribute("aria-expanded", opened ? "true" : "false");
      });
    }
  }

  /**
   * 4. Gợi ý tìm kiếm nhanh trên thanh Search Header
   */
  function initHeaderSearchSuggest() {
    const searchForms = document.querySelectorAll(".site-header__search");
    searchForms.forEach((form) => {
      const input = form.querySelector("input[type='search']");
      if (!input || form.id === "product-search-form") return; // products.html lọc trực tiếp trên trang

      let dropdown = form.querySelector(".header-search-suggest");
      if (!dropdown) {
        dropdown = document.createElement("div");
        dropdown.className = "header-search-suggest";
        dropdown.hidden = true;
        form.appendChild(dropdown);
      }

      input.addEventListener("input", function () {
        const kw = normalizeText(input.value);
        if (!kw) {
          dropdown.hidden = true;
          dropdown.innerHTML = "";
          return;
        }

        const catalog =
          typeof window.buildMergedProducts === "function"
            ? window.buildMergedProducts()
            : window.products || [];
        const matchedProducts = catalog
          .filter((p) => normalizeText(p.name).includes(kw) || normalizeText(p.category).includes(kw))
          .slice(0, 4);

        const recipes = typeof window.getRecipes === "function" ? window.getRecipes() : [];
        const matchedRecipes = recipes
          .filter((r) => normalizeText(r.title).includes(kw))
          .slice(0, 2);

        if (matchedProducts.length === 0 && matchedRecipes.length === 0) {
          dropdown.innerHTML = `<div class="header-search-suggest__empty">Rất tiếc, không tìm thấy kết quả phù hợp với "${escapeHtml(input.value)}".</div>`;
          dropdown.hidden = false;
          return;
        }

        let html = "";
        matchedProducts.forEach((p) => {
          html += `
            <a href="product-detail.html?id=${p.id}" class="header-search-suggest__item">
              <img src="${escapeHtml(p.image)}" alt="" class="header-search-suggest__img" onerror="this.src='images/logo.jpg'">
              <div class="header-search-suggest__meta">
                <strong>${escapeHtml(p.name)}</strong>
                <span>Sản phẩm · ${typeof window.formatCurrency === "function" ? window.formatCurrency(p.price) : p.price + " ₫"}</span>
              </div>
            </a>
          `;
        });
        matchedRecipes.forEach((r) => {
          html += `
            <a href="recipe-detail.html?id=${escapeHtml(r.id)}" class="header-search-suggest__item">
              <img src="${escapeHtml(r.image)}" alt="" class="header-search-suggest__img" onerror="this.src='images/logo.jpg'">
              <div class="header-search-suggest__meta">
                <strong>${escapeHtml(r.title)}</strong>
                <span>Công thức · ${escapeHtml(r.time)}</span>
              </div>
            </a>
          `;
        });
        dropdown.innerHTML = html;
        dropdown.hidden = false;
      });

      document.addEventListener("click", function (e) {
        if (!form.contains(e.target)) {
          dropdown.hidden = true;
        }
      });
    });
  }

  /**
   * 5. Modal Chính sách hỗ trợ khách hàng (Hướng dẫn mua hàng / Giao hàng / Đổi trả) ở Footer
   */
  const SUPPORT_POLICIES = {
    guide: {
      title: "Hướng dẫn mua hàng tại BakeMate",
      body: `
        <ol class="policy-modal-list">
          <li><strong>Tìm sản phẩm hoặc bắt đầu từ Công thức:</strong> Chọn nguyên liệu theo quy cách 100g – 1kg ở mục <em>Sản phẩm</em>, hoặc chọn món bánh tại mục <em>Công thức</em> để tự động quy đổi khẩu phần và gom đủ nguyên liệu.</li>
          <li><strong>Kiểm tra Giỏ hàng &amp; Mã ưu đãi:</strong> Nhập mã <code>CHAOBANMOI</code> (giảm 10% đơn đầu tiên) hoặc <code>FREESHIP20</code> (Freeship 20.000 ₫ cho đơn từ 200.000 ₫).</li>
          <li><strong>Chọn địa chỉ &amp; Đặt hàng COD:</strong> Chọn phương thức vận chuyển phù hợp khu vực giao hàng và xác nhận đơn với mã theo dõi <code>#BM-XXXXXX</code>.</li>
        </ol>
      `
    },
    shipping: {
      title: "Chính sách giao hàng & Biểu phí",
      body: `
        <p style="margin-bottom: 12px;">BakeMate hỗ trợ giao hàng linh hoạt toàn quốc với biểu phí minh bạch:</p>
        <ul class="policy-modal-list">
          <li><strong>Nội thành TP.HCM:</strong> Lấy tại cửa hàng (<strong>0 ₫</strong>) · Giao hàng nhanh 4–6h (<strong>20.000 ₫</strong>) · Hỏa tốc 2h cho kem lạnh/bơ tươi (<strong>40.000 ₫</strong>).</li>
          <li><strong>Ngoại thành &amp; Tỉnh khác:</strong> Giao Hàng Nhanh GHN (<strong>30.000 ₫</strong>) · Giao Hàng Tiết Kiệm GHTK (<strong>20.000 ₫</strong>).</li>
          <li><strong>Ưu đãi Freeship:</strong> Nhập mã <code>FREESHIP20</code> để được giảm ngay <strong>20.000 ₫</strong> phí vận chuyển cho đơn từ <strong>200.000 ₫</strong>.</li>
        </ul>
      `
    },
    returns: {
      title: "Chính sách đổi trả trong 48 giờ",
      body: `
        <ul class="policy-modal-list">
          <li><strong>Điều kiện đổi trả miễn phí:</strong> Bao bì bị rách/ẩm mốc trong quá trình vận chuyển, giao nhầm quy cách hoặc nguyên liệu cận hạn sử dụng.</li>
          <li><strong>Thời hạn tiếp nhận:</strong> Trong vòng <strong>48 giờ</strong> kể từ khi nhận hàng (khuyến khích quay video khi mở kiện hàng để hỗ trợ xử lý trong 2 giờ).</li>
          <li><strong>Kênh tiếp nhận nhanh:</strong> Hotline <strong>1900 8888</strong>, Email <strong>support@bakemate.vn</strong> hoặc gửi biểu mẫu tại trang <a href="contact.html" style="color: var(--accent-cta); font-weight: 700;">Liên hệ</a>.</li>
        </ul>
      `
    }
  };

  function initFooterPolicyLinks() {
    document.querySelectorAll(".js-policy-trigger").forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        const key = link.dataset.policy;
        const policy = SUPPORT_POLICIES[key];
        if (!policy) return;

        const existing = document.getElementById("bakemate-policy-modal");
        if (existing) existing.remove();

        const modal = document.createElement("div");
        modal.id = "bakemate-policy-modal";
        modal.className = "bake-modal-backdrop";
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.innerHTML = `
          <div class="bake-confirm-card bake-policy-card">
            <div class="bake-policy-card__head">
              <h3>${escapeHtml(policy.title)}</h3>
              <button type="button" class="bake-modal-close js-close-policy" aria-label="Đóng hộp thoại">&times;</button>
            </div>
            <div class="bake-policy-card__body">${policy.body}</div>
            <div class="bake-confirm-card__actions" style="justify-content: flex-end; margin-top: 18px;">
              <button type="button" class="btn btn--primary js-close-policy">Đã hiểu</button>
            </div>
          </div>
        `;
        const closeModal = () => modal.remove();
        modal.querySelectorAll(".js-close-policy").forEach((btn) => btn.addEventListener("click", closeModal));
        modal.addEventListener("click", (e) => {
          if (e.target === modal) closeModal();
        });
        document.body.appendChild(modal);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderAdminNoticeBar();
    renderHeaderAccount();
    initNavigationInteractions();
    initHeaderSearchSuggest();
    initFooterPolicyLinks();
  });

  window.addEventListener("bakemate:authChanged", function () {
    renderAdminNoticeBar();
    renderHeaderAccount();
  });

  if (typeof window !== "undefined") {
    window.BakeLayout = {
      renderAdminNoticeBar,
      renderHeaderAccount
    };
  }
})();
