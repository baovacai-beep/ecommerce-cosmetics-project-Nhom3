/*
 * =====================================================
 * BAKEMATE - TÌM KIẾM, BỘ LỌC SIDEBAR & SẮP XẾP SẢN PHẨM
 * Tệp: js/search-filter.js (Bước 2 & 3 + Bộ lọc Sidebar đa điều kiện)
 * =====================================================
 */

(function () {
  const searchForm = document.getElementById("product-search-form");
  const searchInput = document.getElementById("product-search");
  const priceSort = document.getElementById("price-sort");
  const minPriceInput = document.getElementById("filter-price-min");
  const maxPriceInput = document.getElementById("filter-price-max");
  const priceSliderMin = document.getElementById("price-slider-min");
  const priceSliderMax = document.getElementById("price-slider-max");
  const priceSliderFill = document.getElementById("price-slider-fill");
  const priceReadoutMin = document.getElementById("price-readout-min");
  const priceReadoutMax = document.getElementById("price-readout-max");
  const pricePresetBtns = document.querySelectorAll(".js-price-preset");
  const noProductsHint = document.getElementById("no-products-hint");
  const recentViewedSection = document.getElementById("recent-viewed-section");
  const applyFiltersBtn = document.getElementById("apply-filters-btn");
  const resetFiltersBtn = document.getElementById("reset-filters-btn");
  const emptyResetBtn = document.getElementById("empty-reset-btn");
  const productList = document.getElementById("product-list");
  const noProductsMessage = document.getElementById("no-products-message");
  const resultCount = document.getElementById("product-result-count");
  const headingEl = document.getElementById("products-page-heading");
  const sidebar = document.getElementById("products-sidebar");
  const mobileFilterBtn = document.querySelector(".js-mobile-filter-toggle");
  const FALLBACK_IMG = window.FALLBACK_PRODUCT_IMAGE || "images/logo.jpg";

  function getCatalog() {
    return typeof window.buildMergedProducts === "function"
      ? window.buildMergedProducts()
      : window.products || [];
  }

  function normalizeText(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .trim();
  }

  function formatPrice(val) {
    return typeof window.formatCurrency === "function"
      ? window.formatCurrency(val)
      : Number(val).toLocaleString("vi-VN") + " ₫";
  }

  function computePriceCeiling() {
    const maxCatalog = getCatalog().reduce((maxVal, item) => Math.max(maxVal, Number(item.price) || 0), 0);
    return Math.max(150000, Math.ceil(maxCatalog / 10000) * 10000);
  }

  const PRICE_CEILING = computePriceCeiling();

  function updatePriceSliderUI(minVal, maxVal) {
    const safeMin = Math.max(0, Math.min(PRICE_CEILING, Number(minVal) || 0));
    const safeMax = Math.max(safeMin, Math.min(PRICE_CEILING, maxVal == null ? PRICE_CEILING : Number(maxVal)));

    if (priceSliderMin) {
      priceSliderMin.max = String(PRICE_CEILING);
      priceSliderMin.value = String(safeMin);
      priceSliderMin.style.zIndex = safeMin >= PRICE_CEILING - 10000 ? "5" : "3";
    }
    if (priceSliderMax) {
      priceSliderMax.max = String(PRICE_CEILING);
      priceSliderMax.value = String(safeMax);
      priceSliderMax.style.zIndex = safeMin >= PRICE_CEILING - 10000 ? "3" : "4";
    }
    if (priceSliderFill && PRICE_CEILING > 0) {
      const leftPct = (safeMin / PRICE_CEILING) * 100;
      const rightPct = 100 - (safeMax / PRICE_CEILING) * 100;
      priceSliderFill.style.left = `${leftPct}%`;
      priceSliderFill.style.right = `${rightPct}%`;
    }
    if (priceReadoutMin) priceReadoutMin.textContent = formatPrice(safeMin);
    if (priceReadoutMax) priceReadoutMax.textContent = formatPrice(safeMax);

    const rawMin = minPriceInput ? minPriceInput.value.trim() : "";
    const rawMax = maxPriceInput ? maxPriceInput.value.trim() : "";
    pricePresetBtns.forEach((btn) => {
      const pMin = String(btn.dataset.min || "");
      const pMax = String(btn.dataset.max || "");
      const isDefaultPreset = pMin === "" && pMax === "" && rawMin === "" && rawMax === "";
      const isExactPreset =
        (pMin !== "" || pMax !== "") &&
        (pMin === rawMin || (pMin === "0" && (rawMin === "" || rawMin === "0"))) &&
        (pMax === rawMax || (pMax === "" && rawMax === ""));
      btn.classList.toggle("is-active", isDefaultPreset || isExactPreset);
    });
  }

  if (minPriceInput) minPriceInput.max = String(PRICE_CEILING);
  if (maxPriceInput) {
    maxPriceInput.max = String(PRICE_CEILING);
    maxPriceInput.placeholder = Number(PRICE_CEILING).toLocaleString("vi-VN");
  }
  updatePriceSliderUI(0, PRICE_CEILING);

  function createProductCard(product) {
    const article = document.createElement("article");
    article.className = "product-card";

    // Nhãn trạng thái nổi bật
    if (product.stockStatus === "coming_soon") {
      const tag = document.createElement("span");
      tag.className = "product-card__status-tag product-card__status-tag--soon";
      tag.textContent = "Sắp có hàng";
      article.appendChild(tag);
    } else if (product.onSale && Number(product.oldPrice) > Number(product.price)) {
      const pct = Math.round(((Number(product.oldPrice) - Number(product.price)) / Number(product.oldPrice)) * 100);
      const tag = document.createElement("span");
      tag.className = "product-card__status-tag product-card__status-tag--sale";
      tag.textContent = `-${pct}%`;
      article.appendChild(tag);
    } else if (product.isNew) {
      const tag = document.createElement("span");
      tag.className = "product-card__status-tag";
      tag.textContent = "Mới";
      article.appendChild(tag);
    }

    const imageLink = document.createElement("a");
    imageLink.href = `product-detail.html?id=${product.id}`;
    imageLink.className = "product-card__image-link";
    imageLink.setAttribute("aria-label", `Xem chi tiết ${product.name}`);

    const imageWrap = document.createElement("div");
    imageWrap.className = "product-card__image-wrap";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.className = "product-card__image";
    image.loading = "lazy";
    image.onerror = function () {
      this.onerror = null;
      this.src = FALLBACK_IMG;
    };

    imageWrap.appendChild(image);
    imageLink.appendChild(imageWrap);

    const content = document.createElement("div");
    content.className = "product-card__content";

    const metaRow = document.createElement("div");
    metaRow.className = "product-card__meta-row";

    const categoryBadge = document.createElement("span");
    categoryBadge.className = "product-card__category";
    categoryBadge.textContent = product.category;

    const wished = typeof window.isProductWishlisted === "function" && window.isProductWishlisted(product.id);
    const wishBtn = document.createElement("button");
    wishBtn.type = "button";
    wishBtn.className = `product-card__wish${wished ? " is-active" : ""}`;
    wishBtn.setAttribute("aria-label", `${wished ? "Bỏ yêu thích" : "Thêm vào yêu thích"} ${product.name}`);
    wishBtn.innerHTML =
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
    wishBtn.addEventListener("click", function () {
      if (typeof window.toggleWishlistProduct !== "function") return;
      const res = window.toggleWishlistProduct(product.id);
      wishBtn.classList.toggle("is-active", res.wishlisted);
      if (typeof window.showCartToast === "function") {
        window.showCartToast(res.message, { type: "success" });
      }
    });

    metaRow.append(categoryBadge, wishBtn);

    const title = document.createElement("h3");
    title.className = "product-card__title";
    const titleLink = document.createElement("a");
    titleLink.href = `product-detail.html?id=${product.id}`;
    titleLink.textContent = product.name;
    title.appendChild(titleLink);

    const packaging = document.createElement("p");
    packaging.className = "product-card__packaging";
    packaging.textContent = product.packagingLabel || "Tiêu chuẩn";

    const priceRow = document.createElement("div");
    priceRow.className = "product-card__price-row";
    const price = document.createElement("span");
    price.className = "product-card__price";
    price.textContent = formatPrice(product.price);
    priceRow.appendChild(price);

    if (Number(product.oldPrice) > Number(product.price)) {
      const oldPrice = document.createElement("span");
      oldPrice.className = "product-card__old-price";
      oldPrice.textContent = formatPrice(product.oldPrice);
      priceRow.appendChild(oldPrice);
    }

    const actionsWrap = document.createElement("div");
    actionsWrap.className = "product-card__actions";

    const addCartBtn = document.createElement("button");
    addCartBtn.type = "button";
    addCartBtn.className = "btn btn--primary product-card__add-btn product-card__add-btn--brown";
    if (product.stockStatus === "coming_soon") {
      addCartBtn.textContent = "Sắp có hàng";
      addCartBtn.disabled = true;
      addCartBtn.style.opacity = "0.65";
      addCartBtn.style.cursor = "not-allowed";
    } else {
      addCartBtn.textContent = "Thêm vào giỏ";
      addCartBtn.setAttribute("aria-label", `Thêm ${product.name} vào giỏ hàng`);
      addCartBtn.addEventListener("click", function () {
        if (typeof window.addToCart !== "function") return;
        const result = window.addToCart(product.id, 1, 0, null);
        if (typeof window.showCartToast === "function") {
          window.showCartToast(result.message, {
            type: result.success ? (result.capped ? "warning" : "success") : "warning",
            showCartLink: true
          });
        }
      });
    }

    const detailLink = document.createElement("a");
    detailLink.href = `product-detail.html?id=${product.id}`;
    detailLink.className = "btn btn--outline-dark product-card__btn";
    detailLink.textContent = "Xem chi tiết";

    actionsWrap.append(addCartBtn, detailLink);
    content.append(metaRow, title, packaging, priceRow, actionsWrap);
    article.append(imageLink, content);

    return article;
  }

  function renderProducts(list) {
    if (!productList) return;
    const safeList = Array.isArray(list) ? list : [];
    productList.innerHTML = "";

    if (safeList.length === 0) {
      if (noProductsMessage) noProductsMessage.hidden = false;
    } else {
      if (noProductsMessage) noProductsMessage.hidden = true;
      safeList.forEach((product) => {
        productList.appendChild(createProductCard(product));
      });
    }

    if (resultCount) {
      resultCount.textContent = `Hiển thị ${safeList.length} sản phẩm phù hợp`;
    }
  }

  function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map((el) => el.value);
  }

  function updateProducts() {
    const keyword = normalizeText(searchInput ? searchInput.value : "");
    const selectedCats = getCheckedValues("cat");
    const selectedSubs = getCheckedValues("sub");
    const selectedBrands = getCheckedValues("brand");
    const selectedStatuses = getCheckedValues("status");
    const minPrice = minPriceInput && minPriceInput.value !== "" ? Number(minPriceInput.value) : null;
    const maxPrice = maxPriceInput && maxPriceInput.value !== "" ? Number(maxPriceInput.value) : null;
    const selectedSort = priceSort ? priceSort.value : "default";

    let filtered = [...getCatalog()];

    if (keyword !== "") {
      filtered = filtered.filter(
        (p) =>
          normalizeText(p.name).includes(keyword) ||
          normalizeText(p.category).includes(keyword) ||
          normalizeText(p.brand).includes(keyword) ||
          (Array.isArray(p.subCategories) &&
            p.subCategories.some((s) => normalizeText(s).includes(keyword)))
      );
    }

    if (selectedCats.length > 0 || selectedSubs.length > 0) {
      filtered = filtered.filter((p) => {
        const matchCat =
          selectedCats.length > 0 &&
          selectedCats.some((c) => normalizeText(p.category) === normalizeText(c));
        const matchSub =
          selectedSubs.length > 0 &&
          Array.isArray(p.subCategories) &&
          p.subCategories.some((sc) =>
            selectedSubs.some((sel) => normalizeText(sel) === normalizeText(sc))
          );
        return matchCat || matchSub;
      });
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) =>
        selectedBrands.some((b) => normalizeText(p.brand) === normalizeText(b))
      );
    }

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((p) =>
        selectedStatuses.some((st) => {
          if (st === "in_stock") return p.stockStatus !== "coming_soon";
          if (st === "coming_soon") return p.stockStatus === "coming_soon";
          if (st === "is_new") return Boolean(p.isNew);
          if (st === "on_sale") return Boolean(p.onSale);
          return false;
        })
      );
    }

    if (minPrice !== null && Number.isFinite(minPrice) && minPrice >= 0) {
      filtered = filtered.filter((p) => Number(p.price) >= minPrice);
    }
    if (maxPrice !== null && Number.isFinite(maxPrice) && maxPrice >= 0) {
      filtered = filtered.filter((p) => Number(p.price) <= maxPrice);
    }

    if (selectedSort === "asc") {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (selectedSort === "desc") {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (selectedSort === "newest") {
      filtered.sort((a, b) => Number(b.isNew) - Number(a.isNew) || Number(b.id) - Number(a.id));
    } else if (selectedSort === "name-asc") {
      filtered.sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "vi"));
    }

    if (noProductsHint) {
      if (minPrice !== null || maxPrice !== null) {
        const minTxt = formatPrice(minPrice !== null ? minPrice : 0);
        const maxTxt = maxPrice !== null ? formatPrice(maxPrice) : formatPrice(PRICE_CEILING);
        noProductsHint.textContent = `Khoảng giá đang chọn (${minTxt} – ${maxTxt}) chưa có sản phẩm khớp. Hãy kéo thanh trượt mở rộng khoảng giá hoặc nhấn "Xóa bộ lọc".`;
      } else {
        noProductsHint.textContent = 'Hãy thử từ khóa khác, nới rộng khoảng giá hoặc nhấn "Xóa bộ lọc" để xem toàn bộ danh mục của BakeMate.';
      }
    }

    if (headingEl) {
      if (selectedSubs.length === 1) {
        headingEl.textContent = selectedSubs[0];
      } else if (selectedCats.length === 1 && selectedSubs.length === 0) {
        headingEl.textContent = selectedCats[0];
      } else {
        headingEl.textContent = "Tất cả sản phẩm";
      }
    }

    renderProducts(filtered);
  }

  function resetAllFilters() {
    if (searchInput) searchInput.value = "";
    if (priceSort) priceSort.value = "default";
    if (minPriceInput) minPriceInput.value = "";
    if (maxPriceInput) maxPriceInput.value = "";
    updatePriceSliderUI(0, PRICE_CEILING);
    document.querySelectorAll('#products-sidebar input[type="checkbox"]').forEach((cb) => {
      cb.checked = false;
    });
    if (window.location.search && window.history && typeof window.history.replaceState === "function") {
      try {
        window.history.replaceState({}, "", window.location.pathname + window.location.hash);
      } catch (e) {
        // ignore
      }
    }
    updateProducts();
  }

  // Accordion sidebar toggles
  document.querySelectorAll(".js-filter-acc-toggle").forEach((btn) => {
    btn.addEventListener("click", function () {
      const group = btn.closest(".filter-group");
      if (!group) return;
      const collapsed = group.classList.toggle("is-collapsed");
      btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
      const sign = btn.querySelector(".js-acc-sign");
      if (sign) sign.textContent = collapsed ? "+" : "-";
    });
  });

  if (mobileFilterBtn && sidebar) {
    mobileFilterBtn.addEventListener("click", function () {
      const hidden = sidebar.classList.toggle("is-mobile-hidden");
      mobileFilterBtn.textContent = hidden ? "Bộ lọc" : "Ẩn bộ lọc";
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", updateProducts);
  }

  if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      updateProducts();
    });
  }

  if (priceSort) {
    priceSort.addEventListener("change", updateProducts);
  }

  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", updateProducts);
  }

  // Hai tay cầm Dual-Range Price Slider đồng bộ 2 chiều với ô nhập Tối thiểu / Tối đa
  function handleSliderDrag(activeSide) {
    let minVal = priceSliderMin ? Number(priceSliderMin.value) : 0;
    let maxVal = priceSliderMax ? Number(priceSliderMax.value) : PRICE_CEILING;
    if (minVal > maxVal) {
      if (activeSide === "min") minVal = maxVal;
      else maxVal = minVal;
    }
    if (minPriceInput) minPriceInput.value = minVal > 0 ? String(minVal) : "";
    if (maxPriceInput) maxPriceInput.value = maxVal < PRICE_CEILING ? String(maxVal) : "";
    updatePriceSliderUI(minVal, maxVal);
    updateProducts();
  }

  if (priceSliderMin) {
    priceSliderMin.addEventListener("input", () => handleSliderDrag("min"));
  }
  if (priceSliderMax) {
    priceSliderMax.addEventListener("input", () => handleSliderDrag("max"));
  }

  function handlePriceNumberInput(commitOrder) {
    const rawMin = minPriceInput && minPriceInput.value !== "" ? Number(minPriceInput.value) : null;
    const rawMax = maxPriceInput && maxPriceInput.value !== "" ? Number(maxPriceInput.value) : null;
    let minVal = rawMin !== null && Number.isFinite(rawMin) ? Math.max(0, Math.min(PRICE_CEILING, rawMin)) : 0;
    let maxVal = rawMax !== null && Number.isFinite(rawMax) ? Math.max(0, Math.min(PRICE_CEILING, rawMax)) : PRICE_CEILING;

    if (commitOrder && rawMin !== null && rawMax !== null && minVal > maxVal) {
      const swap = minVal;
      minVal = maxVal;
      maxVal = swap;
      if (minPriceInput) minPriceInput.value = String(minVal);
      if (maxPriceInput) maxPriceInput.value = String(maxVal);
    }

    if (minVal <= maxVal) {
      updatePriceSliderUI(minVal, maxVal);
    }
    updateProducts();
  }

  if (minPriceInput) {
    minPriceInput.addEventListener("input", () => handlePriceNumberInput(false));
    minPriceInput.addEventListener("change", () => handlePriceNumberInput(true));
  }
  if (maxPriceInput) {
    maxPriceInput.addEventListener("input", () => handlePriceNumberInput(false));
    maxPriceInput.addEventListener("change", () => handlePriceNumberInput(true));
  }

  pricePresetBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const pMin = String(btn.dataset.min || "");
      const pMax = String(btn.dataset.max || "");
      if (minPriceInput) minPriceInput.value = pMin;
      if (maxPriceInput) maxPriceInput.value = pMax;
      const numMin = pMin !== "" ? Number(pMin) : 0;
      const numMax = pMax !== "" ? Number(pMax) : PRICE_CEILING;
      updatePriceSliderUI(numMin, numMax);
      updateProducts();
    });
  });

  // Cập nhật ngay khi tick checkbox để phản hồi mượt mà
  document.querySelectorAll('#products-sidebar input[type="checkbox"]').forEach((cb) => {
    cb.addEventListener("change", updateProducts);
  });

  if (resetFiltersBtn) resetFiltersBtn.addEventListener("click", resetAllFilters);
  if (emptyResetBtn) emptyResetBtn.addEventListener("click", resetAllFilters);

  // Đồng bộ tham số URL (?q=, ?category=, ?sub=, ?brand=)
  const urlParams = new URLSearchParams(window.location.search);
  const qParam = (urlParams.get("q") || "").trim();
  const catParam = (urlParams.get("category") || "").trim();
  const subParam = (urlParams.get("sub") || "").trim();
  const brandParam = (urlParams.get("brand") || "").trim();

  function expandFilterGroup(checkbox) {
    const grp = checkbox.closest(".filter-group");
    if (grp && grp.classList.contains("is-collapsed")) {
      grp.classList.remove("is-collapsed");
      const toggleBtn = grp.querySelector(".js-filter-acc-toggle");
      if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "true");
      const sign = grp.querySelector(".js-acc-sign");
      if (sign) sign.textContent = "-";
    }
  }

  if (searchInput && qParam) {
    searchInput.value = qParam;
  }

  if (catParam) {
    const normCat = normalizeText(catParam);
    document.querySelectorAll('input[name="cat"]').forEach((cb) => {
      if (normalizeText(cb.value) === normCat) {
        cb.checked = true;
        expandFilterGroup(cb);
      }
    });
  }

  if (subParam) {
    const normSub = normalizeText(subParam);
    document.querySelectorAll('input[name="sub"]').forEach((cb) => {
      if (normalizeText(cb.value) === normSub) {
        cb.checked = true;
        expandFilterGroup(cb);
      }
    });
  }

  if (brandParam) {
    const normBrand = normalizeText(brandParam);
    document.querySelectorAll('input[name="brand"]').forEach((cb) => {
      if (normalizeText(cb.value) === normBrand) {
        cb.checked = true;
        expandFilterGroup(cb);
      }
    });
  }

  function renderRecentViewedSection() {
    if (!recentViewedSection || typeof window.getRecentProducts !== "function") return;
    const recentIds = window.getRecentProducts();
    if (!recentIds.length) {
      recentViewedSection.hidden = true;
      recentViewedSection.innerHTML = "";
      return;
    }

    const catalog = getCatalog();
    const recentProducts = recentIds
      .map((rid) => catalog.find((p) => Number(p.id) === Number(rid)))
      .filter(Boolean)
      .slice(0, 4);

    if (!recentProducts.length) {
      recentViewedSection.hidden = true;
      recentViewedSection.innerHTML = "";
      return;
    }

    recentViewedSection.hidden = false;
    recentViewedSection.innerHTML = `
      <div class="recent-viewed__head">
        <h2 class="recent-viewed__title" id="recent-viewed-title">Sản phẩm bạn đã xem gần đây</h2>
        <button type="button" class="recent-viewed__clear-btn" id="btn-clear-recent-viewed">Xóa lịch sử xem</button>
      </div>
      <div class="recent-viewed-grid">
        ${recentProducts
          .map(
            (p) => `
          <a href="product-detail.html?id=${p.id}" class="recent-viewed-card">
            <div class="recent-viewed-card__img-wrap">
              <img src="${String(p.image || FALLBACK_IMG).replace(/"/g, "&quot;")}" alt="${String(p.name).replace(/"/g, "&quot;")}" class="recent-viewed-card__img" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMG}';">
            </div>
            <div class="recent-viewed-card__body">
              <span class="recent-viewed-card__meta">${String(p.category || "")} · ${String(p.packagingLabel || "")}</span>
              <strong class="recent-viewed-card__title">${String(p.name || "")}</strong>
              <span class="recent-viewed-card__price">${formatPrice(p.price)}</span>
            </div>
          </a>
        `
          )
          .join("")}
      </div>
    `;

    const clearBtn = document.getElementById("btn-clear-recent-viewed");
    if (clearBtn && typeof window.clearRecentProducts === "function") {
      clearBtn.addEventListener("click", function () {
        window.clearRecentProducts();
        renderRecentViewedSection();
      });
    }
  }

  updateProducts();
  renderRecentViewedSection();

  window.addEventListener("bakemate:wishlistChanged", updateProducts);
  window.addEventListener("bakemate:recentProductsChanged", renderRecentViewedSection);

  if (typeof window !== "undefined") {
    window.renderProducts = renderProducts;
    window.updateProducts = updateProducts;
    window.applyFiltersAndSort = updateProducts;
    window.renderRecentViewedSection = renderRecentViewedSection;
  }
})();
