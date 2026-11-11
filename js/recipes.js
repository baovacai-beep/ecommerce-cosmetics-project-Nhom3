/*
 * =====================================================
 * BAKEMATE - TRANG CÔNG THỨC & CHI TIẾT CÔNG THỨC (RECIPES)
 * Tệp: js/recipes.js (Hỗ trợ recipes.html & recipe-detail.html)
 * Bao gồm: Lọc danh mục công thức, Yêu thích, Chia sẻ link,
 * Quy đổi định lượng theo khẩu phần & Recipe-to-Cart thông minh.
 * =====================================================
 */

(function () {
  const FALLBACK_IMG = window.FALLBACK_PRODUCT_IMAGE || "images/logo.jpg";
  const PANTRY_STORAGE_KEY = "bakemate_pantry_remember";
  const RECIPE_PROGRESS_KEY = "bakemate_recipe_progress";

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
      .replace(/Đ/g, "d")
      .trim();
  }

  function readStorageJson(key) {
    if (typeof window === "undefined" || !window.localStorage) return {};
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function writeStorageJson(key, obj) {
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(obj));
    } catch (e) {}
  }

  function formatPrice(value) {
    return typeof window.formatCurrency === "function"
      ? window.formatCurrency(value)
      : Number(value).toLocaleString("vi-VN") + " ₫";
  }

  function formatAmount(value) {
    const num = Number(value) || 0;
    const rounded = Math.round(num * 10) / 10;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1).replace(/\.0$/, "");
  }

  function getRecipesList() {
    if (typeof window.getRecipes === "function") {
      return window.getRecipes();
    }
    return Array.isArray(window.RECIPES_LIST) ? window.RECIPES_LIST : [];
  }

  function buildPosterCardHtml(recipe) {
    const wished =
      typeof window.isRecipeWishlisted === "function"
        ? window.isRecipeWishlisted(recipe.id)
        : false;
    return `
      <article class="recipe-poster-card">
        <img
          src="${escapeHtml(recipe.image || FALLBACK_IMG)}"
          alt="${escapeHtml(recipe.title)}"
          class="recipe-poster-card__img"
          loading="lazy"
          onerror="this.onerror=null;this.src='${FALLBACK_IMG}';"
        >
        <div class="recipe-poster-card__scrim" aria-hidden="true"></div>
        <button
          type="button"
          class="recipe-poster-card__wish js-recipe-wish ${wished ? "is-active" : ""}"
          data-recipe-id="${escapeHtml(recipe.id)}"
          aria-pressed="${wished ? "true" : "false"}"
          aria-label="${wished ? "Bỏ lưu công thức" : "Lưu công thức vào yêu thích"}"
          title="${wished ? "Đã lưu vào yêu thích" : "Lưu công thức"}"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </button>
        <div class="recipe-poster-card__body">
          <span class="recipe-poster-card__code">${escapeHtml(recipe.code || "BAKING RECIPE")}</span>
          <h2 class="recipe-poster-card__title">${escapeHtml(recipe.title)}</h2>
          <div class="recipe-poster-card__meta">
            <span>★ ${escapeHtml(recipe.rating || "4.8")}</span>
            <span>·</span>
            <span>${escapeHtml(recipe.time)}</span>
            <span>·</span>
            <span>${escapeHtml(recipe.diff)}</span>
            <span>·</span>
            <span>${escapeHtml(recipe.category)}</span>
          </div>
          <a href="recipe-detail.html?id=${encodeURIComponent(recipe.id)}" class="recipe-poster-card__cta">
            Xem công thức &rarr;
          </a>
        </div>
      </article>
    `;
  }

  /* =====================================================
   * 1. TRANG DANH SÁCH CÔNG THỨC (recipes.html)
   * ===================================================== */
  let activeCategory = "all";

  function parseMinutes(timeStr) {
    const match = String(timeStr || "").match(/\d+/);
    return match ? Number(match[0]) : 45;
  }

  function matchRecipeSearch(recipe, normQ) {
    if (!normQ) return true;
    const ingNames = Array.isArray(recipe.ingredients)
      ? recipe.ingredients.map((i) => i && i.name ? i.name : "")
      : [];
    const fields = [
      recipe.title,
      recipe.subtitle,
      recipe.category,
      ...(Array.isArray(recipe.tags) ? recipe.tags : []),
      ...ingNames
    ];
    return fields.some((f) => normalizeText(f).includes(normQ));
  }

  function renderRecipesGrid() {
    const grid = document.getElementById("recipes-grid");
    if (!grid) return;

    const searchInput = document.getElementById("recipe-search-input");
    const diffSelect = document.getElementById("recipe-filter-diff");
    const timeSelect = document.getElementById("recipe-filter-time");
    const countPill = document.getElementById("recipe-count-pill");

    const normQ = normalizeText(searchInput ? searchInput.value : "");
    const activeDiff = diffSelect ? diffSelect.value : "all";
    const activeTime = timeSelect ? timeSelect.value : "all";

    const allRecipes = getRecipesList();
    const filtered = allRecipes.filter((r) => {
      const catOk =
        activeCategory === "all" ||
        r.category === activeCategory ||
        (Array.isArray(r.tags) && r.tags.includes(activeCategory));
      if (!catOk) return false;

      if (activeDiff !== "all" && r.diff !== activeDiff) return false;

      if (activeTime !== "all") {
        const mins = parseMinutes(r.time);
        if (activeTime === "fast" && mins > 35) return false;
        if (activeTime === "medium" && (mins <= 35 || mins > 60)) return false;
        if (activeTime === "long" && mins <= 60) return false;
      }

      return matchRecipeSearch(r, normQ);
    });

    if (countPill) {
      countPill.textContent = `${filtered.length} công thức`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="no-products-message" style="grid-column: 1 / -1;">
          <strong>Chưa tìm thấy công thức phù hợp</strong>
          <p>Hãy thử từ khóa khác hoặc đặt lại bộ lọc danh mục, độ khó và thời gian.</p>
          <button type="button" id="btn-recipe-reset-filters" class="btn btn--primary" style="margin-top:10px;">Xem tất cả công thức</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(buildPosterCardHtml).join("");
  }

  function initRecipesIndexPage() {
    const grid = document.getElementById("recipes-grid");
    if (!grid) return;

    const filterButtons = document.querySelectorAll(".js-recipe-filter");
    const searchInput = document.getElementById("recipe-search-input");
    const diffSelect = document.getElementById("recipe-filter-diff");
    const timeSelect = document.getElementById("recipe-filter-time");

    const params = new URLSearchParams(window.location.search);
    const paramCat = (params.get("category") || "").trim();
    const paramQ = (params.get("q") || "").trim();
    const paramDiff = (params.get("diff") || "").trim();
    const paramTime = (params.get("time") || "").trim();

    if (paramCat) {
      filterButtons.forEach((b) => {
        if ((b.dataset.category || "") === paramCat) {
          activeCategory = paramCat;
        }
      });
      filterButtons.forEach((b) => b.classList.toggle("active", (b.dataset.category || "all") === activeCategory));
    }
    if (paramQ && searchInput) searchInput.value = paramQ;
    if (paramDiff && diffSelect) diffSelect.value = paramDiff;
    if (paramTime && timeSelect) timeSelect.value = paramTime;

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        activeCategory = btn.dataset.category || "all";
        filterButtons.forEach((b) => b.classList.toggle("active", b === btn));
        renderRecipesGrid();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", renderRecipesGrid);
    }
    if (diffSelect) {
      diffSelect.addEventListener("change", renderRecipesGrid);
    }
    if (timeSelect) {
      timeSelect.addEventListener("change", renderRecipesGrid);
    }

    grid.addEventListener("click", function (event) {
      const resetBtn = event.target.closest("#btn-recipe-reset-filters");
      if (resetBtn) {
        activeCategory = "all";
        filterButtons.forEach((b) => b.classList.toggle("active", (b.dataset.category || "all") === "all"));
        if (searchInput) searchInput.value = "";
        if (diffSelect) diffSelect.value = "all";
        if (timeSelect) timeSelect.value = "all";
        renderRecipesGrid();
        return;
      }

      const wishBtn = event.target.closest(".js-recipe-wish");
      if (!wishBtn) return;
      const recipeId = wishBtn.dataset.recipeId;
      if (recipeId && typeof window.toggleWishlistRecipe === "function") {
        const res = window.toggleWishlistRecipe(recipeId);
        wishBtn.classList.toggle("is-active", res.wishlisted);
        wishBtn.setAttribute("aria-pressed", res.wishlisted ? "true" : "false");
        if (typeof window.showCartToast === "function") {
          window.showCartToast(res.message, { type: "success" });
        }
      }
    });

    window.addEventListener("bakemate:wishlistChanged", renderRecipesGrid);
    renderRecipesGrid();
  }

  /* =====================================================
   * 2. TRANG CHI TIẾT CÔNG THỨC (recipe-detail.html)
   * ===================================================== */
  function initRecipeDetailPage() {
    const root = document.getElementById("recipe-detail-root");
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const recipeId = (params.get("id") || "").trim();
    const allRecipes = getRecipesList();
    const recipe =
      (typeof window.getRecipeById === "function" ? window.getRecipeById(recipeId) : null) ||
      allRecipes.find((r) => r.id === recipeId) ||
      null;

    const breadcrumbCurrent = document.getElementById("recipe-breadcrumb-current");

    if (!recipe) {
      document.title = "Công thức không tồn tại | BakeMate";
      if (breadcrumbCurrent) breadcrumbCurrent.textContent = "Không tìm thấy công thức";
      root.innerHTML = `
        <div class="no-products-message">
          <strong>Không tìm thấy công thức bạn yêu cầu</strong>
          <p>Mã công thức không hợp lệ hoặc đã được cập nhật.</p>
          <a href="recipes.html" class="btn btn--primary" style="margin-top:10px;">Xem tất cả công thức</a>
        </div>
      `;
      return;
    }

    document.title = `${recipe.title} | Công thức BakeMate`;
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = recipe.title;

    let currentServings = Math.max(1, Number(recipe.defaultServings) || 4);
    const defaultServings = Math.max(1, Number(recipe.defaultServings) || 4);

    // Track checkbox selection index cho các nguyên liệu có productId khả dụng + Pantry Memory
    const allPantryMap = readStorageJson(PANTRY_STORAGE_KEY);
    const savedOwnedSet = new Set(
      Array.isArray(allPantryMap[recipe.id]) ? allPantryMap[recipe.id].map((n) => Number(n)) : []
    );
    const availableIndices = [];
    const checkedIndices = new Set();
    (recipe.ingredients || []).forEach((ing, idx) => {
      const product = ing.productId && typeof window.getProduct === "function" ? window.getProduct(ing.productId) : null;
      if (product && product.stockStatus !== "coming_soon") {
        availableIndices.push(idx);
        if (!savedOwnedSet.has(idx)) {
          checkedIndices.add(idx);
        }
      }
    });

    function persistPantryRemember() {
      const map = readStorageJson(PANTRY_STORAGE_KEY);
      map[recipe.id] = availableIndices.filter((i) => !checkedIndices.has(i));
      writeStorageJson(PANTRY_STORAGE_KEY, map);
    }

    // Track tiến độ các bước thực hiện (Step Completion Progress)
    const allStepProgressMap = readStorageJson(RECIPE_PROGRESS_KEY);
    const completedSteps = new Set(
      Array.isArray(allStepProgressMap[recipe.id]) ? allStepProgressMap[recipe.id].map((n) => Number(n)) : []
    );

    function persistStepProgress() {
      const map = readStorageJson(RECIPE_PROGRESS_KEY);
      map[recipe.id] = Array.from(completedSteps).sort((a, b) => a - b);
      writeStorageJson(RECIPE_PROGRESS_KEY, map);
    }

    const totalStepsCount = Array.isArray(recipe.steps) ? recipe.steps.length : 0;
    const defaultBakeMins = Math.max(1, Number(recipe.bakeMinutes) || parseMinutes(recipe.time) || 25);

    function formatTimerClock(secs) {
      const s = Math.max(0, Math.floor(Number(secs) || 0));
      const mm = Math.floor(s / 60);
      const ss = s % 60;
      return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
    }

    function computeIngredientRows() {
      return (recipe.ingredients || []).map((ing, idx) => {
        const scaledAmount = (Number(ing.baseAmount) || 0) * (currentServings / defaultServings);
        const product =
          ing.productId && typeof window.getProduct === "function"
            ? window.getProduct(ing.productId)
            : null;
        const available = Boolean(product && product.stockStatus !== "coming_soon");
        const option =
          product && typeof window.getProductOption === "function"
            ? window.getProductOption(product.id, ing.optionIndex || 0)
            : null;
        const unitPrice = option ? Number(option.price) : product ? Number(product.price) : 0;
        const pkgAmount = Number(ing.packageAmount) || 0;
        const pkgCount = available && pkgAmount > 0 ? Math.max(1, Math.ceil(scaledAmount / pkgAmount)) : available ? 1 : 0;
        const lineTotal = available ? unitPrice * pkgCount : 0;

        return {
          idx,
          ing,
          scaledAmount,
          product,
          option,
          available,
          pkgCount,
          unitPrice,
          lineTotal
        };
      });
    }

    const wishedInit =
      typeof window.isRecipeWishlisted === "function"
        ? window.isRecipeWishlisted(recipe.id)
        : false;

    const inspirationRecipes = allRecipes.filter((r) => r.id !== recipe.id).slice(0, 3);

    root.innerHTML = `
      <!-- 1. Hero Công thức -->
      <section class="recipe-detail-hero">
        <div>
          <p class="recipe-detail-hero__eyebrow">BAKING JOURNAL / ${escapeHtml(recipe.code || "RECIPE")}</p>
          <h1 class="recipe-detail-hero__title">${escapeHtml(recipe.title)}</h1>
          <p class="recipe-detail-hero__desc">${escapeHtml(recipe.subtitle)}</p>
          <p style="font-size:13.5px;color:#7c5c46;margin-bottom:18px;font-weight:600;">
            Thời gian: ${escapeHtml(recipe.time)} · Độ khó: ${escapeHtml(recipe.diff)} · Khẩu phần chuẩn: ${defaultServings} ${escapeHtml(recipe.servingsUnit || "phần")} · ${escapeHtml(recipe.author || "BakeMate Kitchen")}
          </p>
          <div class="recipe-detail-hero__actions">
            <button
              type="button"
              id="btn-recipe-wish"
              class="btn--wishlist-detail ${wishedInit ? "is-active" : ""}"
              aria-pressed="${wishedInit ? "true" : "false"}"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
              <span>${wishedInit ? "Đã lưu công thức" : "Lưu công thức"}</span>
            </button>
            <button type="button" id="btn-recipe-share" class="btn btn--outline-dark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              <span>Chia sẻ</span>
            </button>
          </div>
        </div>
        <div class="recipe-detail-hero__media">
          <img
            src="${escapeHtml(recipe.image || FALLBACK_IMG)}"
            alt="${escapeHtml(recipe.title)}"
            onerror="this.onerror=null;this.src='${FALLBACK_IMG}';"
          >
        </div>
      </section>

      <!-- 2. Quy đổi khẩu phần & Giỏ đồ làm bánh -->
      <section class="recipe-calc-section" aria-label="Quy đổi nguyên liệu và thêm vào giỏ hàng">
        <h2 class="section-heading" style="text-align:left;margin-bottom:4px;">Nguyên liệu &amp; giỏ đồ làm bánh</h2>
        <p style="font-size:14px;color:var(--accent-sub);">Điều chỉnh số khẩu phần để BakeMate tự động quy đổi định lượng và số lượng đóng gói phù hợp.</p>

        <div class="recipe-calc-layout">
          <div class="recipe-ingredients-card">
            <div class="recipe-servings-bar">
              <div>
                <strong style="color:#4a2e19;font-size:15px;">Khẩu phần:</strong>
                <span style="font-size:13px;color:var(--accent-sub);">(${escapeHtml(recipe.servingsUnit || "phần")})</span>
              </div>
              <div class="recipe-servings-stepper" role="group" aria-label="Điều chỉnh khẩu phần">
                <button type="button" id="btn-servings-minus" aria-label="Giảm khẩu phần">-</button>
                <span id="recipe-servings-val">${currentServings}</span>
                <button type="button" id="btn-servings-plus" aria-label="Tăng khẩu phần">+</button>
              </div>
            </div>

            <div id="recipe-ingredients-list">
              <!-- Render động từ renderCalculator() -->
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:12px;padding-top:10px;border-top:1px dashed #eadbc6;">
              <span style="font-size:12px;color:#7c5c46;">Bỏ chọn nguyên liệu đã có sẵn — BakeMate sẽ tự động ghi nhớ cho bếp của bạn.</span>
              <button type="button" id="btn-reset-ing-selection" class="btn btn--outline-dark" style="padding:4px 10px;font-size:12px;">Chọn lại tất cả</button>
            </div>
          </div>

          <aside class="recipe-cart-summary-card" aria-label="Tổng hợp giỏ hàng công thức">
            <h3>Từ công thức đến giỏ hàng</h3>
            <p class="recipe-cart-summary-card__sub">Chọn các nguyên liệu bạn còn thiếu để thêm gọn thành 1 combo công thức trong giỏ.</p>

            <div class="recipe-cart-summary-card__stat">
              <span>Khẩu phần đang chọn:</span>
              <strong id="recipe-summary-servings">${currentServings} phần</strong>
            </div>
            <div class="recipe-cart-summary-card__stat">
              <span>Số món đã chọn:</span>
              <strong id="recipe-selected-count">0 món</strong>
            </div>

            <div class="recipe-cart-summary-card__total" id="recipe-summary-total">0 ₫</div>

            <div class="recipe-cart-summary-card__btns">
              <button type="button" id="btn-add-selected-ing" class="btn btn--primary">
                Thêm nguyên liệu đã chọn vào giỏ
              </button>
              <button type="button" id="btn-add-all-ing" class="btn btn--outline-dark">
                Thêm tất cả nguyên liệu vào giỏ
              </button>
            </div>

            <p style="font-size:12.5px;color:#7c5c46;margin-top:14px;line-height:1.5;text-align:center;">
              Sản phẩm sẽ được nhóm theo công thức trong giỏ hàng · <a href="cart.html" style="color:var(--primary-color);font-weight:700;text-decoration:underline;">Xem giỏ hàng</a>
            </p>
          </aside>
        </div>
      </section>

      <!-- 3. Dụng cụ cần chuẩn bị -->
      <section style="margin-bottom:32px;" aria-label="Dụng cụ cần chuẩn bị">
        <h2 class="section-heading" style="text-align:left;margin-bottom:6px;">Dụng cụ cần chuẩn bị</h2>
        <div class="recipe-tools-grid">
          ${(recipe.tools || [])
            .map((tool) => {
              const prod =
                tool.productId && typeof window.getProduct === "function"
                  ? window.getProduct(tool.productId)
                  : null;
              const opt =
                prod && typeof window.getProductOption === "function"
                  ? window.getProductOption(prod.id, tool.optionIndex || 0)
                  : null;
              const price = opt ? opt.price : prod ? prod.price : 0;
              return `
                <div class="recipe-tool-card">
                  <div>
                    <a href="product-detail.html?id=${tool.productId}" style="font-weight:700;color:#4a2e19;font-size:14.5px;">${escapeHtml(tool.name)}</a>
                    <p style="font-size:12.5px;color:var(--accent-sub);margin:2px 0 4px;">${escapeHtml(tool.desc || "")}</p>
                    <strong style="font-size:14px;color:var(--accent-cta);">${formatPrice(price)}</strong>
                  </div>
                  <button
                    type="button"
                    class="btn btn--outline-dark js-add-tool-btn"
                    data-product-id="${tool.productId}"
                    data-option-index="${tool.optionIndex || 0}"
                    style="padding:7px 12px;font-size:12.5px;white-space:nowrap;"
                  >
                    + Thêm vào giỏ
                  </button>
                </div>
              `;
            })
            .join("")}
        </div>
      </section>

      <!-- 4. Cách làm từng bước + Đồng hồ nướng bánh -->
      <section style="margin-bottom:28px;" aria-label="Các bước thực hiện">
        <h2 class="section-heading" style="text-align:left;margin-bottom:10px;">Cách làm - Từng bước thật dễ dàng</h2>

        <div class="recipe-progress-card">
          <div class="recipe-progress-head">
            <span>Tiến độ vào bếp của bạn</span>
            <span id="recipe-progress-text">0/${totalStepsCount} bước (0%)</span>
          </div>
          <div class="recipe-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="recipe-progress-bar">
            <div class="recipe-progress-bar__fill" id="recipe-progress-fill"></div>
          </div>
        </div>

        <div class="baking-timer-card" aria-label="Đồng hồ đếm ngược làm bánh">
          <div>
            <strong style="display:block;font-size:15px;color:#4a2e19;">Đồng hồ hẹn giờ nướng / ủ bánh</strong>
            <span style="font-size:12.5px;color:#7c5c46;">Khuyến nghị công thức: ${defaultBakeMins} phút · Có thể chỉnh tăng giảm 5 phút</span>
          </div>
          <div class="baking-timer__clock" id="baking-timer-clock" aria-live="polite">${formatTimerClock(defaultBakeMins * 60)}</div>
          <div class="baking-timer__actions">
            <button type="button" id="btn-timer-minus" class="btn btn--outline-dark" style="padding:7px 11px;font-size:12.5px;">-5 phút</button>
            <button type="button" id="btn-timer-plus" class="btn btn--outline-dark" style="padding:7px 11px;font-size:12.5px;">+5 phút</button>
            <button type="button" id="btn-timer-toggle" class="btn btn--primary" style="padding:7px 15px;font-size:12.5px;">Bắt đầu</button>
            <button type="button" id="btn-timer-reset" class="btn btn--outline-dark" style="padding:7px 11px;font-size:12.5px;">Đặt lại</button>
          </div>
        </div>

        <div class="recipe-steps-list" id="recipe-steps-list">
          ${(recipe.steps || [])
            .map((step, idx) => {
              const isDone = completedSteps.has(idx);
              return `
              <article class="recipe-step-card${isDone ? " is-completed" : ""}" data-step-card="${idx}">
                <div class="recipe-step-card__top">
                  <span class="recipe-step-card__num">${String(idx + 1).padStart(2, "0")}</span>
                  <label class="recipe-step-card__check">
                    <input type="checkbox" class="js-step-check" data-step-index="${idx}" ${isDone ? "checked" : ""}>
                    <span>${isDone ? "Đã hoàn thành" : "Đánh dấu xong"}</span>
                  </label>
                </div>
                <p style="font-size:14.5px;color:#4a2e19;line-height:1.6;">${escapeHtml(step)}</p>
              </article>
            `;
            })
            .join("")}
        </div>
      </section>

      <!-- 5. Lưu ý thành công -->
      <section class="recipe-tips-box" aria-label="Lưu ý cho mẻ bánh trọn vẹn">
        <h2>Một chút lưu ý cho mẻ bánh trọn vẹn</h2>
        <ul>
          ${(recipe.tips || []).map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}
        </ul>
      </section>

      <!-- 6. Căn bếp của bạn, câu chuyện của bạn (Đánh giá công thức) -->
      <section class="reviews-section" id="recipe-reviews-section" aria-label="Đánh giá công thức từ cộng đồng">
        <h2 class="section-heading" style="text-align:left;margin-bottom:14px;">Căn bếp của bạn, câu chuyện của bạn</h2>
        <div id="recipe-reviews-container"></div>
      </section>

      <!-- 7. Thêm cảm hứng cho lần vào bếp tiếp theo -->
      ${
        inspirationRecipes.length > 0
          ? `
          <section style="margin-top:34px;" aria-label="Công thức gợi ý tiếp theo">
            <h2 class="section-heading" style="text-align:left;margin-bottom:16px;">Thêm cảm hứng cho lần vào bếp tiếp theo</h2>
            <div class="recipes-editorial-grid" id="recipe-inspiration-grid">
              ${inspirationRecipes.map(buildPosterCardHtml).join("")}
            </div>
          </section>
        `
          : ""
      }
    `;

    function renderCalculator() {
      const rows = computeIngredientRows();
      const listEl = document.getElementById("recipe-ingredients-list");
      const valEl = document.getElementById("recipe-servings-val");
      const summaryServingsEl = document.getElementById("recipe-summary-servings");
      const selectedCountEl = document.getElementById("recipe-selected-count");
      const totalEl = document.getElementById("recipe-summary-total");
      const addSelectedBtn = document.getElementById("btn-add-selected-ing");

      if (valEl) valEl.textContent = String(currentServings);
      if (summaryServingsEl) summaryServingsEl.textContent = `${currentServings} phần`;

      if (listEl) {
        listEl.innerHTML = rows
          .map((row) => {
            const qtyLabel = `${formatAmount(row.scaledAmount)} ${row.ing.unit}`;
            if (!row.available) {
              return `
                <div class="recipe-ingredient-row">
                  <div class="recipe-ingredient-row__left">
                    <span style="display:inline-flex;width:17px;justify-content:center;color:#9a7b64;font-weight:700;">—</span>
                    <div>
                      <strong>${escapeHtml(row.ing.name)}</strong>
                      <span class="recipe-ingredient-row__qty">${escapeHtml(qtyLabel)}${row.ing.note ? ` · ${escapeHtml(row.ing.note)}` : ""}</span>
                    </div>
                  </div>
                  <div class="recipe-ingredient-row__right">
                    <span class="recipe-ingredient-row__unmatched">Chưa có sản phẩm phù hợp</span>
                  </div>
                </div>
              `;
            }

            const isChecked = checkedIndices.has(row.idx);
            return `
              <div class="recipe-ingredient-row">
                <label class="recipe-ingredient-row__left" style="cursor:pointer;">
                  <input type="checkbox" class="js-ing-check" data-ing-index="${row.idx}" ${isChecked ? "checked" : ""}>
                  <div>
                    <strong>${escapeHtml(row.ing.name)}</strong>
                    <span class="recipe-ingredient-row__qty">Cần dùng: ${escapeHtml(qtyLabel)}</span>
                  </div>
                </label>
                <div class="recipe-ingredient-row__right">
                  <a href="product-detail.html?id=${row.product.id}" class="recipe-ingredient-row__match">${escapeHtml(row.product.name)}</a>
                  <div style="font-size:12px;color:#7c5c46;">
                    ${row.pkgCount} × ${escapeHtml(row.option ? row.option.shortLabel : "tiêu chuẩn")} = <strong style="color:var(--accent-cta);">${formatPrice(row.lineTotal)}</strong>
                  </div>
                </div>
              </div>
            `;
          })
          .join("");
      }

      const selectedRows = rows.filter((r) => r.available && checkedIndices.has(r.idx));
      const totalSelected = selectedRows.reduce((sum, r) => sum + r.lineTotal, 0);

      if (selectedCountEl) {
        selectedCountEl.textContent = `${selectedRows.length} nguyên liệu`;
      }
      if (totalEl) {
        totalEl.textContent = `Ước tính: ${formatPrice(totalSelected)}`;
      }
      if (addSelectedBtn) {
        addSelectedBtn.disabled = selectedRows.length === 0;
      }
    }

    function renderRecipeReviews() {
      const container = document.getElementById("recipe-reviews-container");
      if (!container) return;

      const list = typeof window.getReviews === "function" ? window.getReviews("recipe", recipe.id) : [];
      const user =
        typeof window.BakeAuth === "object" && typeof window.BakeAuth.getCurrentUser === "function"
          ? window.BakeAuth.getCurrentUser()
          : null;

      let formHtml = "";
      if (user) {
        formHtml = `
          <form class="review-form-box" id="recipe-review-form">
            <p style="font-size:14px;font-weight:700;color:#4a2e19;margin-bottom:8px;">Chia sẻ thành quả mẻ bánh của bạn (${escapeHtml(user.fullName)})</p>
            <div class="review-stars-input" role="group" aria-label="Chọn số sao">
              <button type="button" class="review-star-btn js-rstar-btn" data-rating="1">1 ★</button>
              <button type="button" class="review-star-btn js-rstar-btn" data-rating="2">2 ★</button>
              <button type="button" class="review-star-btn js-rstar-btn" data-rating="3">3 ★</button>
              <button type="button" class="review-star-btn js-rstar-btn" data-rating="4">4 ★</button>
              <button type="button" class="review-star-btn js-rstar-btn is-active" data-rating="5">5 ★</button>
            </div>
            <input type="hidden" id="recipe-review-rating" value="5">
            <textarea id="recipe-review-comment" class="form-textarea" rows="3" placeholder="Bạn đã làm món này theo tỷ lệ quy đổi như thế nào?" required style="margin-bottom:10px;"></textarea>
            <div class="form-group" style="margin-bottom:12px;">
              <label class="form-label" for="recipe-review-photo" style="font-size:13px;font-weight:700;color:#5c402d;display:block;margin-bottom:6px;">Ảnh thành phẩm (tùy chọn)</label>
              <input type="file" id="recipe-review-photo" accept="image/*" class="form-input" style="padding:8px;">
              <div id="recipe-review-preview-wrap" class="review-photo-preview-wrap" hidden>
                <img id="recipe-review-preview-img" class="review-photo-preview-img" alt="Xem trước ảnh thành phẩm">
                <button type="button" id="btn-clear-recipe-photo" class="btn btn--outline-dark" style="padding:5px 10px;font-size:12px;">Xóa ảnh</button>
              </div>
            </div>
            <button type="submit" class="btn btn--primary">Gửi câu chuyện &amp; đánh giá</button>
          </form>
        `;
      } else {
        const redirectTarget = encodeURIComponent(window.location.pathname.split("/").pop() + window.location.search);
        formHtml = `
          <div class="reviews-empty-card">
            <strong>Chưa có câu chuyện nào được chia sẻ</strong>
            <p>Hãy là người đầu tiên đăng nhập để chia sẻ kinh nghiệm thực hiện công thức này cùng cộng đồng BakeMate.</p>
            <a href="login.html?redirect=${redirectTarget}" class="btn btn--primary">Đăng nhập để đánh giá</a>
          </div>
        `;
      }

      const listHtml =
        list.length > 0
          ? `
            <div class="reviews-list">
              ${list
                .map((rev) => {
                  const stars = "★".repeat(rev.rating) + "☆".repeat(5 - rev.rating);
                  const dateLabel = rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("vi-VN") : "";
                  return `
                    <article class="review-item">
                      <div class="review-item__head">
                        <strong>${escapeHtml(rev.userName)}</strong>
                        <span class="review-item__stars">${stars} · <small style="color:#8c6a52;font-weight:500;">${escapeHtml(dateLabel)}</small></span>
                      </div>
                      <p style="font-size:14px;color:#4a2e19;line-height:1.55;">${escapeHtml(rev.comment)}</p>
                      ${
                        rev.imageDataUrl
                          ? `<div style="margin-top:8px;"><img src="${escapeHtml(rev.imageDataUrl)}" alt="Ảnh thành phẩm từ ${escapeHtml(rev.userName)}" class="review-photo-preview-img"></div>`
                          : ""
                      }
                    </article>
                  `;
                })
                .join("")}
            </div>
          `
          : "";

      container.innerHTML = formHtml + listHtml;

      let uploadedPhotoDataUrl = "";
      const photoInput = document.getElementById("recipe-review-photo");
      const previewWrap = document.getElementById("recipe-review-preview-wrap");
      const previewImg = document.getElementById("recipe-review-preview-img");
      const btnClearPhoto = document.getElementById("btn-clear-recipe-photo");

      if (photoInput) {
        photoInput.addEventListener("change", function () {
          const file = photoInput.files && photoInput.files[0];
          if (!file || !file.type || !file.type.startsWith("image/")) {
            uploadedPhotoDataUrl = "";
            if (previewWrap) previewWrap.hidden = true;
            return;
          }
          const reader = new FileReader();
          reader.onload = function (ev) {
            const resUrl = String(ev.target && ev.target.result ? ev.target.result : "");
            if (resUrl.length > 440000) {
              if (typeof window.showCartToast === "function") {
                window.showCartToast("Ảnh quá lớn (vui lòng chọn ảnh dưới 300KB).", { type: "warning" });
              }
              photoInput.value = "";
              uploadedPhotoDataUrl = "";
              if (previewWrap) previewWrap.hidden = true;
              return;
            }
            uploadedPhotoDataUrl = resUrl;
            if (previewImg) previewImg.src = resUrl;
            if (previewWrap) previewWrap.hidden = false;
          };
          reader.readAsDataURL(file);
        });
      }

      if (btnClearPhoto) {
        btnClearPhoto.addEventListener("click", function () {
          uploadedPhotoDataUrl = "";
          if (photoInput) photoInput.value = "";
          if (previewWrap) previewWrap.hidden = true;
        });
      }

      const starBtns = container.querySelectorAll(".js-rstar-btn");
      const ratingInput = document.getElementById("recipe-review-rating");
      starBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          const val = btn.dataset.rating || "5";
          if (ratingInput) ratingInput.value = val;
          starBtns.forEach((b) => b.classList.toggle("is-active", Number(b.dataset.rating) <= Number(val)));
        });
      });

      const form = document.getElementById("recipe-review-form");
      if (form) {
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          const commentEl = document.getElementById("recipe-review-comment");
          const rating = ratingInput ? Number(ratingInput.value) : 5;
          const comment = commentEl ? commentEl.value.trim() : "";
          if (comment.length < 3) {
            if (typeof window.showCartToast === "function") {
              window.showCartToast("Vui lòng nhập nội dung chia sẻ tối thiểu 3 ký tự.", { type: "warning" });
            }
            return;
          }
          if (typeof window.addReview === "function") {
            window.addReview({
              targetType: "recipe",
              targetId: recipe.id,
              userId: user.userId,
              userName: user.fullName,
              rating,
              comment,
              imageDataUrl: uploadedPhotoDataUrl
            });
            if (typeof window.showCartToast === "function") {
              window.showCartToast("Cảm ơn bạn đã chia sẻ câu chuyện vào bếp!", { type: "success" });
            }
            renderRecipeReviews();
          }
        });
      }
    }

    function updateStepProgressUI() {
      const progressText = document.getElementById("recipe-progress-text");
      const progressBar = document.getElementById("recipe-progress-bar");
      const progressFill = document.getElementById("recipe-progress-fill");
      const total = Math.max(1, totalStepsCount);
      const done = Array.from(completedSteps).filter((idx) => idx >= 0 && idx < totalStepsCount).length;
      const pct = totalStepsCount > 0 ? Math.round((done / total) * 100) : 0;

      if (progressText) progressText.textContent = `${done}/${totalStepsCount} bước (${pct}%)`;
      if (progressBar) progressBar.setAttribute("aria-valuenow", String(pct));
      if (progressFill) progressFill.style.width = `${pct}%`;
    }

    const stepsListEl = document.getElementById("recipe-steps-list");
    if (stepsListEl) {
      stepsListEl.addEventListener("change", function (event) {
        const cb = event.target.closest(".js-step-check");
        if (!cb) return;
        const idx = Number(cb.dataset.stepIndex);
        if (cb.checked) {
          completedSteps.add(idx);
        } else {
          completedSteps.delete(idx);
        }
        const card = cb.closest(".recipe-step-card");
        if (card) card.classList.toggle("is-completed", cb.checked);
        const labelSpan = cb.parentElement ? cb.parentElement.querySelector("span") : null;
        if (labelSpan) labelSpan.textContent = cb.checked ? "Đã hoàn thành" : "Đánh dấu xong";
        persistStepProgress();
        updateStepProgressUI();
      });
    }

    // Đồng hồ đếm ngược nướng / ủ bánh (Baking Countdown Timer)
    let timerSecondsLeft = defaultBakeMins * 60;
    let timerIntervalId = null;
    let timerRunning = false;

    const timerClockEl = document.getElementById("baking-timer-clock");
    const timerToggleBtn = document.getElementById("btn-timer-toggle");
    const timerResetBtn = document.getElementById("btn-timer-reset");
    const timerMinusBtn = document.getElementById("btn-timer-minus");
    const timerPlusBtn = document.getElementById("btn-timer-plus");

    function renderTimerUI() {
      if (timerClockEl) timerClockEl.textContent = formatTimerClock(timerSecondsLeft);
      if (timerToggleBtn) {
        timerToggleBtn.textContent = timerRunning
          ? "Tạm dừng"
          : timerSecondsLeft < defaultBakeMins * 60 && timerSecondsLeft > 0
          ? "Tiếp tục"
          : "Bắt đầu";
      }
    }

    function stopBakingTimer() {
      if (timerIntervalId) {
        window.clearInterval(timerIntervalId);
        timerIntervalId = null;
      }
      timerRunning = false;
      renderTimerUI();
    }

    if (timerToggleBtn) {
      timerToggleBtn.addEventListener("click", function () {
        if (timerRunning) {
          stopBakingTimer();
          return;
        }
        if (timerSecondsLeft <= 0) {
          timerSecondsLeft = defaultBakeMins * 60;
        }
        timerRunning = true;
        renderTimerUI();
        timerIntervalId = window.setInterval(function () {
          timerSecondsLeft -= 1;
          if (timerSecondsLeft <= 0) {
            timerSecondsLeft = 0;
            stopBakingTimer();
            if (typeof window.showCartToast === "function") {
              window.showCartToast(`Hết giờ hẹn (${recipe.title})! Hãy kiểm tra mẻ bánh của bạn.`, {
                type: "success"
              });
            }
            return;
          }
          renderTimerUI();
        }, 1000);
      });
    }

    if (timerResetBtn) {
      timerResetBtn.addEventListener("click", function () {
        stopBakingTimer();
        timerSecondsLeft = defaultBakeMins * 60;
        renderTimerUI();
      });
    }

    if (timerMinusBtn) {
      timerMinusBtn.addEventListener("click", function () {
        timerSecondsLeft = Math.max(60, timerSecondsLeft - 300);
        renderTimerUI();
      });
    }

    if (timerPlusBtn) {
      timerPlusBtn.addEventListener("click", function () {
        timerSecondsLeft = Math.min(180 * 60, timerSecondsLeft + 300);
        renderTimerUI();
      });
    }

    // Bind stepper, checkboxes, combo add & wishlist/share
    const minusBtn = document.getElementById("btn-servings-minus");
    const plusBtn = document.getElementById("btn-servings-plus");
    const ingListEl = document.getElementById("recipe-ingredients-list");
    const resetIngBtn = document.getElementById("btn-reset-ing-selection");
    const addSelectedBtn = document.getElementById("btn-add-selected-ing");
    const addAllBtn = document.getElementById("btn-add-all-ing");
    const wishBtn = document.getElementById("btn-recipe-wish");
    const shareBtn = document.getElementById("btn-recipe-share");

    if (minusBtn) {
      minusBtn.addEventListener("click", function () {
        if (currentServings > 1) {
          currentServings -= 1;
          renderCalculator();
        }
      });
    }

    if (plusBtn) {
      plusBtn.addEventListener("click", function () {
        if (currentServings < 50) {
          currentServings += 1;
          renderCalculator();
        }
      });
    }

    if (ingListEl) {
      ingListEl.addEventListener("change", function (event) {
        const cb = event.target.closest(".js-ing-check");
        if (!cb) return;
        const idx = Number(cb.dataset.ingIndex);
        if (cb.checked) {
          checkedIndices.add(idx);
        } else {
          checkedIndices.delete(idx);
        }
        persistPantryRemember();
        renderCalculator();
      });
    }

    if (resetIngBtn) {
      resetIngBtn.addEventListener("click", function () {
        availableIndices.forEach((idx) => checkedIndices.add(idx));
        persistPantryRemember();
        renderCalculator();
      });
    }

    function addIngredientsSubset(onlySelected) {
      if (typeof window.addRecipeComboToCart !== "function") return;
      const rows = computeIngredientRows().filter((r) => r.available);
      const targets = onlySelected ? rows.filter((r) => checkedIndices.has(r.idx)) : rows;
      if (targets.length === 0) {
        if (typeof window.showCartToast === "function") {
          window.showCartToast("Vui lòng chọn ít nhất 1 nguyên liệu để thêm vào giỏ.", { type: "warning" });
        }
        return;
      }
      const customItems = targets.map((r) => ({
        productId: r.product.id,
        optionIndex: r.ing.optionIndex || 0,
        quantity: r.pkgCount || 1
      }));
      const res = window.addRecipeComboToCart(recipe.id, customItems);
      if (typeof window.showCartToast === "function") {
        window.showCartToast(res.message, {
          type: res.success ? "success" : "warning",
          showCartLink: Boolean(res.success)
        });
      }
    }

    if (addSelectedBtn) {
      addSelectedBtn.addEventListener("click", () => addIngredientsSubset(true));
    }

    if (addAllBtn) {
      addAllBtn.addEventListener("click", () => {
        computeIngredientRows().forEach((r) => {
          if (r.available) checkedIndices.add(r.idx);
        });
        renderCalculator();
        addIngredientsSubset(false);
      });
    }

    if (wishBtn) {
      wishBtn.addEventListener("click", function () {
        if (typeof window.toggleWishlistRecipe !== "function") return;
        const res = window.toggleWishlistRecipe(recipe.id);
        wishBtn.classList.toggle("is-active", res.wishlisted);
        wishBtn.setAttribute("aria-pressed", res.wishlisted ? "true" : "false");
        const spanEl = wishBtn.querySelector("span");
        if (spanEl) spanEl.textContent = res.wishlisted ? "Đã lưu công thức" : "Lưu công thức";
        if (typeof window.showCartToast === "function") {
          window.showCartToast(res.message, { type: "success" });
        }
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener("click", function () {
        const shareUrl = window.location.href;
        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
          navigator.clipboard.writeText(shareUrl).then(() => {
            if (typeof window.showCartToast === "function") {
              window.showCartToast("Đã sao chép liên kết công thức để chia sẻ!", { type: "success" });
            }
          });
        } else if (typeof window.showCartToast === "function") {
          window.showCartToast("Liên kết hiện tại đã sẵn sàng để chia sẻ.", { type: "success" });
        }
      });
    }

    root.addEventListener("click", function (event) {
      const toolBtn = event.target.closest(".js-add-tool-btn");
      if (toolBtn && typeof window.addToCart === "function") {
        const pid = Number(toolBtn.dataset.productId);
        const optIdx = Number(toolBtn.dataset.optionIndex) || 0;
        const res = window.addToCart(pid, 1, optIdx, recipe.id);
        if (typeof window.showCartToast === "function") {
          window.showCartToast(res.message, {
            type: res.success ? "success" : "warning",
            showCartLink: Boolean(res.success)
          });
        }
        return;
      }

      const inspWish = event.target.closest("#recipe-inspiration-grid .js-recipe-wish");
      if (inspWish && typeof window.toggleWishlistRecipe === "function") {
        const rid = inspWish.dataset.recipeId;
        const res = window.toggleWishlistRecipe(rid);
        inspWish.classList.toggle("is-active", res.wishlisted);
        if (typeof window.showCartToast === "function") {
          window.showCartToast(res.message, { type: "success" });
        }
      }
    });

    renderCalculator();
    updateStepProgressUI();
    renderTimerUI();
    renderRecipeReviews();
    window.addEventListener("bakemate:authChanged", renderRecipeReviews);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initRecipesIndexPage();
    initRecipeDetailPage();
  });
})();
