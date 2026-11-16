/*
 * =====================================================
 * BAKEMATE - ADMIN DASHBOARD & RBAC CONTROLLER (admin.html)
 * Tệp: js/admin.js
 * Chức năng:
 *  - Bảo vệ RBAC (chỉ role === 'admin' được phép thao tác)
 *  - Thống kê doanh thu, đơn hàng, sản phẩm, tài khoản
 *  - Quản lý trạng thái Đơn hàng (localStorage)
 *  - CRUD Sản phẩm thông qua bakemate_products_override
 *  - Quản lý Tài khoản, Mở khóa tài khoản bị lock, Cấp Admin (Super Admin) & Security Logs
 *  - Tiếp nhận & xử lý tin nhắn Liên hệ (bakemate_contacts)
 * =====================================================
 */

(function () {
  const CONTACTS_STORAGE_KEY = "bakemate_contacts";
  const FALLBACK_IMG = window.FALLBACK_PRODUCT_IMAGE || "images/logo.jpg";
  const ORDER_STATUS_LIST = [
    "Chờ xác nhận",
    "Đang chuẩn bị",
    "Đang giao hàng",
    "Hoàn tất",
    "Đã hủy"
  ];

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

  function formatDateTime(iso) {
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

  function getOverrideKey() {
    return window.PRODUCTS_OVERRIDE_KEY || "bakemate_products_override";
  }

  function readProductOverride() {
    try {
      const raw = window.localStorage.getItem(getOverrideKey());
      if (!raw) return { edited: {}, added: [], hiddenIds: [] };
      const parsed = JSON.parse(raw);
      return {
        edited: parsed && typeof parsed.edited === "object" ? parsed.edited : {},
        added: parsed && Array.isArray(parsed.added) ? parsed.added : [],
        hiddenIds: parsed && Array.isArray(parsed.hiddenIds) ? parsed.hiddenIds.map(Number) : []
      };
    } catch (e) {
      return { edited: {}, added: [], hiddenIds: [] };
    }
  }

  function writeProductOverride(store) {
    try {
      window.localStorage.setItem(getOverrideKey(), JSON.stringify(store));
    } catch (e) {
      console.warn("Không thể lưu cấu hình sản phẩm:", e);
    }
    if (typeof window.refreshProductsCatalog === "function") {
      window.refreshProductsCatalog();
    }
  }

  function readContacts() {
    try {
      const raw = window.localStorage.getItem(CONTACTS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function writeContacts(list) {
    try {
      window.localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Không thể cập nhật tin nhắn liên hệ:", e);
    }
  }

  function verifyAdminAccess() {
    const user = window.BakeAuth ? window.BakeAuth.getCurrentUser() : null;
    const deniedEl = document.getElementById("admin-access-denied");
    const deniedDesc = document.getElementById("admin-denied-desc");
    const shellEl = document.getElementById("admin-dashboard-shell");

    if (!user) {
      if (shellEl) shellEl.hidden = true;
      if (deniedEl) deniedEl.hidden = false;
      window.location.replace("login.html?redirect=admin.html");
      return null;
    }

    if (user.role !== "admin") {
      if (shellEl) shellEl.hidden = true;
      if (deniedEl) deniedEl.hidden = false;
      if (deniedDesc) {
        deniedDesc.textContent = `Tài khoản "${user.fullName}" đang mang quyền Khách hàng (Customer) nên không thể truy cập Bảng điều khiển Quản trị viên.`;
      }
      return null;
    }

    if (deniedEl) deniedEl.hidden = true;
    if (shellEl) shellEl.hidden = false;
    return user;
  }

  document.addEventListener("DOMContentLoaded", function () {
    const currentAdmin = verifyAdminAccess();
    if (!currentAdmin) return;

    const rolePill = document.getElementById("admin-role-pill");
    const welcomeMeta = document.getElementById("admin-welcome-meta");
    if (rolePill) {
      rolePill.textContent = currentAdmin.isSuperAdmin
        ? "Super Admin · Toàn quyền hệ thống"
        : "Quản trị viên (Admin)";
    }
    if (welcomeMeta) {
      welcomeMeta.textContent = `Xin chào ${currentAdmin.fullName} (${currentAdmin.email}) — Phiên quản trị đang hoạt động.`;
    }

    const logoutBtn = document.getElementById("btn-admin-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        if (window.BakeAuth) window.BakeAuth.logoutAccount();
        window.location.href = "index.html";
      });
    }

    // ==================== STATS SUMMARY ====================
    function renderStats() {
      const orders = typeof window.getOrders === "function" ? window.getOrders() : [];
      const catalog =
        typeof window.buildMergedProducts === "function"
          ? window.buildMergedProducts()
          : window.products || [];
      const users = window.BakeAuth ? window.BakeAuth.getUsers() : [];
      const logs = window.BakeAuth ? window.BakeAuth.getSecurityLogs() : [];

      const validRevenue = orders
        .filter((o) => o.status !== "Đã hủy")
        .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      const pendingCount = orders.filter((o) => (o.status || "Chờ xác nhận") === "Chờ xác nhận").length;
      const comingSoonCount = catalog.filter((p) => p.stockStatus === "coming_soon").length;
      const lockedCount = users.filter((u) => Number(u.lockUntil || 0) > Date.now()).length;

      const revEl = document.getElementById("stat-revenue");
      const ordEl = document.getElementById("stat-orders");
      const prodEl = document.getElementById("stat-products");
      const usrEl = document.getElementById("stat-users");

      if (revEl) revEl.textContent = formatPrice(validRevenue);
      if (ordEl) ordEl.textContent = `${orders.length} (${pendingCount} mới)`;
      if (prodEl) prodEl.textContent = `${catalog.length} (${comingSoonCount} sắp về)`;
      if (usrEl) usrEl.textContent = `${users.length} TK · ${lockedCount} khóa · ${logs.length} log`;
    }

    // ==================== TAB 1: ORDERS ====================
    const orderStatusFilter = document.getElementById("admin-order-status-filter");
    const orderSearchInput = document.getElementById("admin-order-search");
    const ordersTbody = document.getElementById("admin-orders-tbody");

    function renderOrdersTable() {
      if (!ordersTbody) return;
      const orders = typeof window.getOrders === "function" ? window.getOrders() : [];
      const statusVal = orderStatusFilter ? orderStatusFilter.value : "all";
      const kw = String(orderSearchInput ? orderSearchInput.value : "").trim().toLowerCase();

      const filtered = orders.filter((o) => {
        const currentStatus = o.status || "Chờ xác nhận";
        const matchStatus = statusVal === "all" || currentStatus === statusVal;
        const matchKw =
          !kw ||
          String(o.orderCode || "").toLowerCase().includes(kw) ||
          String(o.customer?.fullName || "").toLowerCase().includes(kw) ||
          String(o.customer?.phone || "").toLowerCase().includes(kw);
        return matchStatus && matchKw;
      });

      if (filtered.length === 0) {
        ordersTbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--accent-sub);">Chưa có đơn hàng nào khớp bộ lọc.</td></tr>`;
        return;
      }

      ordersTbody.innerHTML = filtered
        .map((ord) => {
          const st = ord.status || "Chờ xác nhận";
          const itemsSummary = (ord.items || [])
            .map((it) => `${escapeHtml(it.name)} × ${it.quantity}`)
            .join(", ");
          return `
            <tr>
              <td>
                <strong class="order-code">${escapeHtml(ord.orderCode)}</strong>
                <div style="font-size:12px;color:#7c5c46;margin-top:2px;">${escapeHtml(formatDateTime(ord.createdAt))}</div>
              </td>
              <td>
                <strong>${escapeHtml(ord.customer?.fullName || "Khách")}</strong> (${escapeHtml(ord.customer?.phone || "")})
                <div style="font-size:12px;color:#7c5c46;max-width:250px;">${escapeHtml(ord.customer?.address || "")}</div>
              </td>
              <td style="max-width:240px;font-size:12.5px;color:#4a2e19;">${itemsSummary}</td>
              <td>
                <strong style="color:var(--accent-cta);">${formatPrice(ord.total)}</strong>
                <div style="font-size:12px;color:#7c5c46;">${escapeHtml(ord.paymentMethod || "COD")}</div>
              </td>
              <td>
                <select class="form-input js-admin-order-status" data-order-code="${escapeHtml(ord.orderCode)}" style="min-width:155px;padding:6px 10px;font-size:13px;">
                  ${ORDER_STATUS_LIST.map(
                    (opt) => `<option value="${escapeHtml(opt)}" ${opt === st ? "selected" : ""}>${escapeHtml(opt)}</option>`
                  ).join("")}
                </select>
              </td>
            </tr>
          `;
        })
        .join("");
    }

    if (orderStatusFilter) orderStatusFilter.addEventListener("change", renderOrdersTable);
    if (orderSearchInput) orderSearchInput.addEventListener("input", renderOrdersTable);
    if (ordersTbody) {
      ordersTbody.addEventListener("change", function (event) {
        const select = event.target.closest(".js-admin-order-status");
        if (!select) return;
        const code = select.dataset.orderCode;
        const nextStatus = select.value;
        if (typeof window.updateOrderStatus === "function") {
          window.updateOrderStatus(code, nextStatus);
          renderStats();
          if (typeof window.showCartToast === "function") {
            window.showCartToast(`Đã cập nhật đơn ${code} sang "${nextStatus}".`, { type: "success" });
          }
        }
      });
    }

    // ==================== TAB 2: PRODUCTS CRUD ====================
    const productsTbody = document.getElementById("admin-products-tbody");
    const productSearchInput = document.getElementById("admin-product-search");
    const addProductBtn = document.getElementById("btn-admin-add-product");
    const resetProductsBtn = document.getElementById("btn-admin-reset-products");
    const prodModal = document.getElementById("admin-product-modal");
    const prodModalTitle = document.getElementById("admin-prod-modal-title");
    const prodForm = document.getElementById("admin-product-form");

    function renderProductsTable() {
      if (!productsTbody) return;
      const catalog =
        typeof window.buildMergedProducts === "function"
          ? window.buildMergedProducts()
          : window.products || [];
      const kw = String(productSearchInput ? productSearchInput.value : "").trim().toLowerCase();

      const filtered = catalog.filter((p) => {
        if (!kw) return true;
        return (
          String(p.name || "").toLowerCase().includes(kw) ||
          String(p.brand || "").toLowerCase().includes(kw) ||
          String(p.category || "").toLowerCase().includes(kw)
        );
      });

      if (filtered.length === 0) {
        productsTbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--accent-sub);">Không tìm thấy sản phẩm phù hợp.</td></tr>`;
        return;
      }

      productsTbody.innerHTML = filtered
        .map((p) => {
          const isSoon = p.stockStatus === "coming_soon";
          return `
            <tr>
              <td><strong>#${p.id}</strong></td>
              <td>
                <div style="display:flex;align-items:center;gap:10px;">
                  <img src="${escapeHtml(p.image || FALLBACK_IMG)}" alt="" style="width:44px;height:44px;border-radius:8px;object-fit:cover;border:1px solid #eadbc6;" onerror="this.onerror=null;this.src='${FALLBACK_IMG}';">
                  <div>
                    <strong style="display:block;color:#4a2e19;">${escapeHtml(p.name)}</strong>
                    <span style="font-size:12px;color:#7c5c46;">${escapeHtml(p.brand || "BakeMate")}</span>
                  </div>
                </div>
              </td>
              <td>
                <span>${escapeHtml(p.category)}</span>
                <div style="font-size:11.5px;color:#8c6a52;">${escapeHtml(Array.isArray(p.subCategories) ? p.subCategories.join(", ") : "")}</div>
              </td>
              <td>
                <strong style="color:var(--accent-cta);">${formatPrice(p.price)}</strong>
                <div style="font-size:12px;color:#7c5c46;">${escapeHtml(p.packagingLabel || "Tiêu chuẩn")}</div>
              </td>
              <td>
                <button type="button" class="blog-filter-btn js-toggle-stock" data-id="${p.id}" style="padding:4px 10px;font-size:12px;${isSoon ? "background:#4a2e19;color:#f2d9a6;border-color:#4a2e19;" : "background:#dcfce7;color:#15803d;border-color:#86efac;"}">
                  ${isSoon ? "Sắp có hàng" : "Còn hàng"}
                </button>
              </td>
              <td>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button type="button" class="btn btn--outline-dark js-edit-prod" data-id="${p.id}" style="padding:5px 10px;font-size:12px;">Sửa</button>
                  <button type="button" class="btn-clear-cart js-hide-prod" data-id="${p.id}" style="padding:5px 10px;font-size:12px;">Ẩn</button>
                </div>
              </td>
            </tr>
          `;
        })
        .join("");
    }

    function openProductModal(product) {
      if (!prodModal || !prodForm) return;
      document.getElementById("ap-form-error").textContent = "";
      if (product) {
        prodModalTitle.textContent = `Chỉnh sửa sản phẩm #${product.id}`;
        document.getElementById("ap-id").value = String(product.id);
        document.getElementById("ap-name").value = product.name || "";
        document.getElementById("ap-category").value = product.category || "Nguyên liệu";
        document.getElementById("ap-subcategory").value = Array.isArray(product.subCategories)
          ? product.subCategories[0] || ""
          : "";
        document.getElementById("ap-brand").value = product.brand || "BakeMate";
        document.getElementById("ap-packaging").value = product.packagingLabel || "";
        document.getElementById("ap-price").value = Number(product.price) || "";
        document.getElementById("ap-oldprice").value = Number(product.oldPrice) || "";
        document.getElementById("ap-stock").value = product.stockStatus || "in_stock";
        document.getElementById("ap-image").value = product.image || "images/about-ingredients.jpg";
        document.getElementById("ap-desc").value = product.description || "";
      } else {
        prodModalTitle.textContent = "Thêm sản phẩm mới";
        prodForm.reset();
        document.getElementById("ap-id").value = "";
        document.getElementById("ap-image").value = "images/about-ingredients.jpg";
      }
      prodModal.hidden = false;
    }

    if (addProductBtn) {
      addProductBtn.addEventListener("click", () => openProductModal(null));
    }

    document.querySelectorAll(".js-close-prod-modal").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (prodModal) prodModal.hidden = true;
      });
    });

    if (prodModal) {
      prodModal.addEventListener("click", function (event) {
        if (event.target === prodModal) prodModal.hidden = true;
      });
    }

    if (prodForm) {
      prodForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const errEl = document.getElementById("ap-form-error");
        errEl.textContent = "";

        const idVal = document.getElementById("ap-id").value.trim();
        const name = document.getElementById("ap-name").value.trim();
        const category = document.getElementById("ap-category").value;
        const subCategory = document.getElementById("ap-subcategory").value.trim();
        const brand = document.getElementById("ap-brand").value.trim() || "BakeMate";
        const packagingLabel = document.getElementById("ap-packaging").value.trim() || "Tiêu chuẩn";
        const price = Number(document.getElementById("ap-price").value);
        const oldPriceRaw = Number(document.getElementById("ap-oldprice").value);
        const stockStatus = document.getElementById("ap-stock").value === "coming_soon" ? "coming_soon" : "in_stock";
        const image = document.getElementById("ap-image").value.trim() || "images/about-ingredients.jpg";
        const description = document.getElementById("ap-desc").value.trim() || "Sản phẩm chất lượng cao tại BakeMate.";

        if (name.length < 2 || !Number.isFinite(price) || price < 1000) {
          errEl.textContent = "Vui lòng nhập tên sản phẩm hợp lệ và giá bán tối thiểu 1.000 ₫.";
          return;
        }

        const oldPrice = oldPriceRaw > price ? oldPriceRaw : price;
        const store = readProductOverride();

        if (idVal) {
          const numericId = Number(idVal);
          const addedIdx = store.added.findIndex((item) => Number(item.id) === numericId);
          const patch = {
            name,
            category,
            subCategories: subCategory ? [subCategory] : [],
            brand,
            packagingLabel,
            price,
            oldPrice,
            onSale: oldPrice > price,
            stockStatus,
            image,
            description
          };
          if (addedIdx !== -1) {
            store.added[addedIdx] = Object.assign({}, store.added[addedIdx], patch);
          } else {
            store.edited[String(numericId)] = Object.assign({}, store.edited[String(numericId)] || {}, patch);
          }
          writeProductOverride(store);
          if (typeof window.showCartToast === "function") {
            window.showCartToast(`Đã cập nhật sản phẩm "${name}".`, { type: "success" });
          }
        } else {
          const catalog =
            typeof window.buildMergedProducts === "function"
              ? window.buildMergedProducts()
              : window.products || [];
          const maxId = catalog.reduce((m, item) => Math.max(m, Number(item.id) || 0), 23);
          const newProd = {
            id: maxId + 1,
            name,
            price,
            oldPrice,
            category,
            subCategories: subCategory ? [subCategory] : ["Bột và nguyên liệu khô"],
            brand,
            packagingLabel,
            stockStatus,
            isNew: true,
            onSale: oldPrice > price,
            featured: false,
            image,
            description
          };
          store.added.push(newProd);
          writeProductOverride(store);
          if (typeof window.showCartToast === "function") {
            window.showCartToast(`Đã thêm mới "${name}" (#${newProd.id}) vào danh mục.`, { type: "success" });
          }
        }

        prodModal.hidden = true;
        renderProductsTable();
        renderStats();
      });
    }

    if (resetProductsBtn) {
      resetProductsBtn.addEventListener("click", async function () {
        const ok =
          typeof window.showBakeConfirm === "function"
            ? await window.showBakeConfirm({
                title: "Khôi phục danh mục gốc",
                message: "Xóa toàn bộ thay đổi/thêm mới sản phẩm tùy chỉnh và khôi phục 23 sản phẩm mặc định?",
                confirmText: "Khôi phục",
                cancelText: "Hủy"
              })
            : true;
        if (!ok) return;
        window.localStorage.removeItem(getOverrideKey());
        if (typeof window.refreshProductsCatalog === "function") {
          window.refreshProductsCatalog();
        }
        renderProductsTable();
        renderStats();
        if (typeof window.showCartToast === "function") {
          window.showCartToast("Đã khôi phục 23 sản phẩm gốc.", { type: "success" });
        }
      });
    }

    if (productSearchInput) productSearchInput.addEventListener("input", renderProductsTable);

    if (productsTbody) {
      productsTbody.addEventListener("click", async function (event) {
        const toggleBtn = event.target.closest(".js-toggle-stock");
        if (toggleBtn) {
          const id = Number(toggleBtn.dataset.id);
          const catalog = typeof window.buildMergedProducts === "function" ? window.buildMergedProducts() : [];
          const prod = catalog.find((p) => Number(p.id) === id);
          if (!prod) return;
          const nextStock = prod.stockStatus === "coming_soon" ? "in_stock" : "coming_soon";
          const store = readProductOverride();
          const addedIdx = store.added.findIndex((item) => Number(item.id) === id);
          if (addedIdx !== -1) {
            store.added[addedIdx].stockStatus = nextStock;
          } else {
            store.edited[String(id)] = Object.assign({}, store.edited[String(id)] || {}, { stockStatus: nextStock });
          }
          writeProductOverride(store);
          renderProductsTable();
          renderStats();
          if (typeof window.showCartToast === "function") {
            window.showCartToast(`Đã chuyển "${prod.name}" sang "${nextStock === "in_stock" ? "Còn hàng" : "Sắp có hàng"}".`, { type: "success" });
          }
          return;
        }

        const editBtn = event.target.closest(".js-edit-prod");
        if (editBtn) {
          const id = Number(editBtn.dataset.id);
          const catalog = typeof window.buildMergedProducts === "function" ? window.buildMergedProducts() : [];
          const prod = catalog.find((p) => Number(p.id) === id);
          if (prod) openProductModal(prod);
          return;
        }

        const hideBtn = event.target.closest(".js-hide-prod");
        if (hideBtn) {
          const id = Number(hideBtn.dataset.id);
          const catalog = typeof window.buildMergedProducts === "function" ? window.buildMergedProducts() : [];
          const prod = catalog.find((p) => Number(p.id) === id);
          if (!prod) return;
          const ok =
            typeof window.showBakeConfirm === "function"
              ? await window.showBakeConfirm({
                  title: "Ẩn sản phẩm khỏi cửa hàng",
                  message: `Bạn có chắc muốn ẩn "${prod.name}" khỏi trang Sản phẩm?`,
                  confirmText: "Đồng ý ẩn",
                  cancelText: "Hủy"
                })
              : true;
          if (!ok) return;
          const store = readProductOverride();
          if (!store.hiddenIds.includes(id)) store.hiddenIds.push(id);
          writeProductOverride(store);
          renderProductsTable();
          renderStats();
          if (typeof window.showCartToast === "function") {
            window.showCartToast(`Đã ẩn "${prod.name}". Nhấn "Khôi phục danh mục gốc" nếu muốn hiện lại.`, { type: "success" });
          }
        }
      });
    }

    // ==================== TAB 3: USERS & SECURITY ====================
    const usersTbody = document.getElementById("admin-users-tbody");
    const secLogsTbody = document.getElementById("admin-security-logs-tbody");
    const superAdminBox = document.getElementById("super-admin-create-box");
    const createAdminForm = document.getElementById("admin-create-admin-form");

    if (superAdminBox) {
      superAdminBox.hidden = !currentAdmin.isSuperAdmin;
    }

    function renderUsersAndLogs() {
      const users = window.BakeAuth ? window.BakeAuth.getUsers() : [];
      const logs = window.BakeAuth ? window.BakeAuth.getSecurityLogs() : [];

      if (usersTbody) {
        if (users.length === 0) {
          usersTbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:20px;">Chưa có dữ liệu tài khoản.</td></tr>`;
        } else {
          usersTbody.innerHTML = users
            .map((u) => {
              const isLocked = Number(u.lockUntil || 0) > Date.now();
              const roleBadge = u.isSuperAdmin
                ? `<span class="account-role-pill is-admin">Super Admin</span>`
                : u.role === "admin"
                ? `<span class="account-role-pill is-admin">Admin</span>`
                : `<span class="account-role-pill">Customer</span>`;
              const statusHtml = isLocked
                ? `<span style="color:#dc2626;font-weight:700;">Khóa tạm (sai &gt; 5 lần)</span>`
                : `<span style="color:#15803d;font-weight:600;">Hoạt động bình thường</span>`;
              return `
                <tr>
                  <td><strong>${escapeHtml(u.fullName)}</strong></td>
                  <td>
                    <div>${escapeHtml(u.email)}</div>
                    <small style="color:#7c5c46;">${escapeHtml(u.phone || "")}</small>
                  </td>
                  <td>${roleBadge}</td>
                  <td>${statusHtml}</td>
                  <td>
                    ${
                      isLocked
                        ? `<button type="button" class="btn btn--primary js-unlock-user" data-user-id="${escapeHtml(u.id)}" style="padding:5px 10px;font-size:12px;">Mở khóa</button>`
                        : `<span style="font-size:12px;color:#9c826b;">—</span>`
                    }
                  </td>
                </tr>
              `;
            })
            .join("");
        }
      }

      if (secLogsTbody) {
        if (logs.length === 0) {
          secLogsTbody.innerHTML = `<tr><td colspan="3" style="text-align:center;padding:20px;color:var(--accent-sub);">Chưa có cảnh báo bảo mật nào được ghi nhận.</td></tr>`;
        } else {
          secLogsTbody.innerHTML = logs
            .map(
              (log) => `
              <tr>
                <td style="white-space:nowrap;">${escapeHtml(formatDateTime(log.createdAt))}</td>
                <td><strong>${escapeHtml(log.email)}</strong></td>
                <td style="color:#b45309;font-weight:600;">${escapeHtml(log.message)}</td>
              </tr>
            `
            )
            .join("");
        }
      }
    }

    if (usersTbody) {
      usersTbody.addEventListener("click", function (event) {
        const unlockBtn = event.target.closest(".js-unlock-user");
        if (!unlockBtn || !window.BakeAuth) return;
        const userId = unlockBtn.dataset.userId;
        window.BakeAuth.unlockUserAccount(userId);
        renderUsersAndLogs();
        renderStats();
        if (typeof window.showCartToast === "function") {
          window.showCartToast("Đã mở khóa tài khoản thành công.", { type: "success" });
        }
      });
    }

    if (createAdminForm) {
      createAdminForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const fb = document.getElementById("sa-form-feedback");
        fb.textContent = "";
        fb.style.color = "#dc2626";

        if (!window.BakeAuth) return;
        const res = window.BakeAuth.createAdminAccountBySuperAdmin({
          fullName: document.getElementById("sa-fullname").value,
          email: document.getElementById("sa-email").value,
          phone: document.getElementById("sa-phone").value,
          password: document.getElementById("sa-password").value
        });

        if (!res.success) {
          fb.textContent = res.message;
          return;
        }

        fb.style.color = "#15803d";
        fb.textContent = res.message;
        createAdminForm.reset();
        renderUsersAndLogs();
        renderStats();
        if (typeof window.showCartToast === "function") {
          window.showCartToast(res.message, { type: "success" });
        }
      });
    }

    // ==================== TAB 4: CONTACTS ====================
    const contactsTbody = document.getElementById("admin-contacts-tbody");

    function renderContactsTable() {
      if (!contactsTbody) return;
      const list = readContacts();
      if (list.length === 0) {
        contactsTbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--accent-sub);">Chưa có tin nhắn liên hệ nào từ khách hàng.</td></tr>`;
        return;
      }

      contactsTbody.innerHTML = list
        .map((msg) => {
          const resolved = Boolean(msg.resolved || msg.status === "Đã xử lý");
          return `
            <tr>
              <td style="white-space:nowrap;font-size:12.5px;">${escapeHtml(formatDateTime(msg.createdAt))}</td>
              <td>
                <strong>${escapeHtml(msg.fullName || msg.name || "Khách")}</strong>
                <div style="font-size:12px;color:#7c5c46;">${escapeHtml(msg.email || "")} · ${escapeHtml(msg.phone || "")}</div>
              </td>
              <td style="max-width:300px;">
                <strong style="display:block;color:#4a2e19;">${escapeHtml(msg.topic || msg.subject || "Tư vấn sản phẩm")}</strong>
                <span style="font-size:12.5px;color:#6b4e3b;">${escapeHtml(msg.message || "")}</span>
              </td>
              <td>
                <span style="font-weight:700;color:${resolved ? "#15803d" : "#b45309"};">
                  ${resolved ? "Đã xử lý" : escapeHtml(msg.status || "Mới tiếp nhận")}
                </span>
              </td>
              <td>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  ${
                    !resolved
                      ? `<button type="button" class="btn btn--outline-dark js-resolve-contact" data-id="${escapeHtml(msg.id)}" style="padding:5px 10px;font-size:12px;">Đánh dấu đã xử lý</button>`
                      : ""
                  }
                  <button type="button" class="btn-clear-cart js-delete-contact" data-id="${escapeHtml(msg.id)}" style="padding:5px 10px;font-size:12px;">Xóa</button>
                </div>
              </td>
            </tr>
          `;
        })
        .join("");
    }

    if (contactsTbody) {
      contactsTbody.addEventListener("click", async function (event) {
        const resolveBtn = event.target.closest(".js-resolve-contact");
        if (resolveBtn) {
          const id = resolveBtn.dataset.id;
          const next = readContacts().map((m) =>
            m.id === id ? Object.assign({}, m, { resolved: true, status: "Đã xử lý" }) : m
          );
          writeContacts(next);
          renderContactsTable();
          if (typeof window.showCartToast === "function") {
            window.showCartToast("Đã đánh dấu xử lý tin nhắn liên hệ.", { type: "success" });
          }
          return;
        }

        const delBtn = event.target.closest(".js-delete-contact");
        if (delBtn) {
          const id = delBtn.dataset.id;
          const ok =
            typeof window.showBakeConfirm === "function"
              ? await window.showBakeConfirm({
                  title: "Xóa tin nhắn liên hệ",
                  message: "Bạn có chắc muốn xóa phản hồi khách hàng này?",
                  confirmText: "Xóa",
                  cancelText: "Hủy"
                })
              : true;
          if (!ok) return;
          const next = readContacts().filter((m) => m.id !== id);
          writeContacts(next);
          renderContactsTable();
        }
      });
    }

    // ==================== TAB SWITCHING ====================
    const tabs = document.querySelectorAll(".js-admin-tab");
    const panels = document.querySelectorAll(".js-admin-panel");
    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        const target = tab.dataset.tab;
        tabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle("active", active);
          t.setAttribute("aria-selected", active ? "true" : "false");
        });
        panels.forEach((p) => {
          p.hidden = p.id !== `tab-panel-${target}`;
        });
      });
    });

    // Render toàn bộ dữ liệu ban đầu
    renderStats();
    renderOrdersTable();
    renderProductsTable();
    renderUsersAndLogs();
    renderContactsTable();

    // Lắng nghe thay đổi phiên đăng nhập từ tab khác hoặc lệnh Force Logout
    window.addEventListener("bakemate:authChanged", function () {
      const stillAdmin = verifyAdminAccess();
      if (!stillAdmin) return;
      renderStats();
      renderUsersAndLogs();
    });

    window.addEventListener("storage", function (event) {
      if (!event.key || event.key.indexOf("bakemate") !== -1) {
        const stillAdmin = verifyAdminAccess();
        if (!stillAdmin) return;
        renderStats();
        renderOrdersTable();
        renderProductsTable();
        renderUsersAndLogs();
        renderContactsTable();
      }
    });
  });
})();
