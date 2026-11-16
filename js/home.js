/*
 * =====================================================
 * BAKEMATE - BĂNG CHUYỀN BANNER, YÊU THÍCH & SÁCH LẬT CÔNG THỨC (TRANG CHỦ)
 * Tệp: js/home.js
 * =====================================================
 */

(function () {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const FALLBACK_IMG = window.FALLBACK_PRODUCT_IMAGE || "images/logo.jpg";

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
      : Number(value).toLocaleString("vi-VN") + " ₫";
  }

  /**
   * 1. Hero Banner Carousel
   */
  function initHeroCarousel() {
    const root = document.getElementById("hero-carousel");
    if (!root) return;

    const slides = Array.from(root.querySelectorAll(".hero-slide"));
    const dots = Array.from(root.querySelectorAll(".hero-carousel__dot"));
    const prevBtn = root.querySelector(".hero-carousel__prev");
    const nextBtn = root.querySelector(".hero-carousel__next");
    const progressBar = root.querySelector(".hero-carousel__progress-fill");

    if (slides.length <= 1) return;

    const AUTOPLAY_DELAY = 5500;
    let activeIndex = 0;
    let autoplayTimer = null;
    let isPaused = false;
    let touchStartX = 0;

    function restartProgressBar() {
      if (!progressBar || prefersReducedMotion) return;
      progressBar.style.transition = "none";
      progressBar.style.width = "0%";
      void progressBar.offsetWidth;
      progressBar.style.transition = `width ${AUTOPLAY_DELAY}ms linear`;
      progressBar.style.width = isPaused ? "0%" : "100%";
    }

    function goToSlide(nextIndex) {
      const total = slides.length;
      const targetIndex = ((nextIndex % total) + total) % total;
      if (targetIndex === activeIndex && slides[activeIndex].classList.contains("is-active")) return;

      slides.forEach((slide, idx) => {
        const isTarget = idx === targetIndex;
        slide.classList.toggle("is-active", isTarget);
        slide.setAttribute("aria-hidden", isTarget ? "false" : "true");
      });

      dots.forEach((dot, idx) => {
        const isTarget = idx === targetIndex;
        dot.classList.toggle("is-active", isTarget);
        dot.setAttribute("aria-selected", isTarget ? "true" : "false");
      });

      activeIndex = targetIndex;
      restartProgressBar();
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
      if (progressBar) {
        progressBar.style.transition = "none";
        progressBar.style.width = "0%";
      }
    }

    function startAutoplay() {
      stopAutoplay();
      if (prefersReducedMotion || isPaused) return;
      restartProgressBar();
      autoplayTimer = window.setInterval(() => {
        goToSlide(activeIndex + 1);
      }, AUTOPLAY_DELAY);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goToSlide(activeIndex - 1);
        startAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goToSlide(activeIndex + 1);
        startAutoplay();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", function () {
        goToSlide(idx);
        startAutoplay();
      });
    });

    root.addEventListener("mouseenter", function () {
      isPaused = true;
      stopAutoplay();
    });

    root.addEventListener("mouseleave", function () {
      isPaused = false;
      startAutoplay();
    });

    root.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        goToSlide(activeIndex - 1);
        startAutoplay();
      } else if (event.key === "ArrowRight") {
        goToSlide(activeIndex + 1);
        startAutoplay();
      }
    });

    root.addEventListener(
      "touchstart",
      function (event) {
        if (event.touches && event.touches[0]) touchStartX = event.touches[0].clientX;
      },
      { passive: true }
    );

    root.addEventListener(
      "touchend",
      function (event) {
        if (!event.changedTouches || !event.changedTouches[0]) return;
        const deltaX = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(deltaX) > 45) {
          goToSlide(deltaX < 0 ? activeIndex + 1 : activeIndex - 1);
          startAutoplay();
        }
      },
      { passive: true }
    );

    goToSlide(0);
    startAutoplay();
  }

  /**
   * 2. Editorial Category Carousel ("Khám phá thế giới làm bánh")
   */
  function initCategoryCarousel() {
    const root = document.getElementById("category-carousel");
    const viewport = document.getElementById("category-carousel-viewport");
    const track = document.getElementById("home-category-track");
    const dotsContainer = document.getElementById("category-carousel-dots");
    const prevBtn = document.getElementById("category-prev-btn");
    const nextBtn = document.getElementById("category-next-btn");
    const toggleBtn = document.getElementById("category-autoplay-btn");

    if (!root || !viewport || !track) return;

    const cards = Array.from(track.querySelectorAll(".category-card"));
    if (cards.length === 0) return;

    const AUTOPLAY_DELAY = 3800;
    let activeIndex = 0;
    let visibleCount = 3;
    let maxIndex = 0;
    let userPaused = false;
    let hoverPaused = false;
    let autoplayTimer = null;
    let touchStartX = 0;

    function computeVisibleCount() {
      const width = window.innerWidth;
      if (width <= 640) return 1;
      if (width <= 1024) return 2;
      return 3;
    }

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = "";
      const pageCount = maxIndex + 1;
      for (let i = 0; i < pageCount; i += 1) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = `category-carousel__dot${i === activeIndex ? " is-active" : ""}`;
        dot.setAttribute("aria-label", `Xem nhóm danh mục ${i + 1}`);
        dot.setAttribute("aria-pressed", i === activeIndex ? "true" : "false");
        dot.addEventListener("click", function () {
          setIndex(i);
          syncAutoplay();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateCardsState() {
      const spotlightIndex =
        visibleCount === 3 ? Math.min(cards.length - 1, activeIndex + 1) : activeIndex;

      cards.forEach((card, idx) => {
        const isVisible = idx >= activeIndex && idx < activeIndex + visibleCount;
        card.classList.toggle("is-in-view", isVisible);
        card.classList.toggle("is-spotlight", idx === spotlightIndex);
      });

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll(".category-carousel__dot");
        dots.forEach((dot, idx) => {
          const isActive = idx === activeIndex;
          dot.classList.toggle("is-active", isActive);
          dot.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
      }
    }

    function applyTransform() {
      const firstCard = cards[0];
      if (!firstCard) return;
      const computedTrack = window.getComputedStyle(track);
      const gapPx = parseFloat(computedTrack.columnGap || computedTrack.gap || "0") || 0;
      const cardWidth = firstCard.getBoundingClientRect().width;
      const offsetPx = activeIndex * (cardWidth + gapPx);
      track.style.transform = `translate3d(-${offsetPx}px, 0, 0)`;
    }

    function setIndex(nextIndex) {
      const totalPositions = maxIndex + 1;
      activeIndex = totalPositions <= 1 ? 0 : ((nextIndex % totalPositions) + totalPositions) % totalPositions;
      applyTransform();
      updateCardsState();
    }

    function refreshLayout() {
      const nextVisible = computeVisibleCount();
      const nextMax = Math.max(0, cards.length - nextVisible);
      const changed = nextVisible !== visibleCount || nextMax !== maxIndex;
      visibleCount = nextVisible;
      maxIndex = nextMax;
      if (activeIndex > maxIndex) activeIndex = maxIndex;
      if (changed || (dotsContainer && dotsContainer.children.length !== maxIndex + 1)) {
        buildDots();
      }
      applyTransform();
      updateCardsState();
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function syncAutoplay() {
      stopAutoplay();
      if (prefersReducedMotion || userPaused || hoverPaused || maxIndex <= 0) return;
      autoplayTimer = window.setInterval(() => {
        setIndex(activeIndex + 1);
      }, AUTOPLAY_DELAY);
    }

    function updateToggleLabel() {
      if (!toggleBtn) return;
      toggleBtn.classList.toggle("is-paused", userPaused);
      toggleBtn.setAttribute("aria-pressed", userPaused ? "true" : "false");
      toggleBtn.setAttribute(
        "aria-label",
        userPaused ? "Bật tự động trượt danh mục" : "Tạm dừng tự động trượt danh mục"
      );
      const iconEl = toggleBtn.querySelector(".js-carousel-toggle-icon");
      if (iconEl) {
        iconEl.innerHTML = userPaused
          ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>'
          : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
      }
      const labelEl = toggleBtn.querySelector(".js-carousel-toggle-label");
      if (labelEl) {
        labelEl.textContent = userPaused ? "Tự động trượt" : "Tạm dừng";
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        setIndex(activeIndex - 1);
        syncAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        setIndex(activeIndex + 1);
        syncAutoplay();
      });
    }

    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        userPaused = !userPaused;
        updateToggleLabel();
        syncAutoplay();
      });
    }

    root.addEventListener("mouseenter", function () {
      hoverPaused = true;
      stopAutoplay();
    });

    root.addEventListener("mouseleave", function () {
      hoverPaused = false;
      syncAutoplay();
    });

    viewport.addEventListener(
      "touchstart",
      function (event) {
        if (event.touches && event.touches[0]) touchStartX = event.touches[0].clientX;
      },
      { passive: true }
    );

    viewport.addEventListener(
      "touchend",
      function (event) {
        if (!event.changedTouches || !event.changedTouches[0]) return;
        const deltaX = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(deltaX) > 40) {
          setIndex(deltaX < 0 ? activeIndex + 1 : activeIndex - 1);
          syncAutoplay();
        }
      },
      { passive: true }
    );

    let resizeTimer = null;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(refreshLayout, 80);
    });

    refreshLayout();
    updateToggleLabel();
    syncAutoplay();
  }

  /**
   * 3. Render 4 "Những sản phẩm được yêu thích"
   */
  function renderHomeFavorites() {
    const grid = document.getElementById("home-favorites-grid");
    if (!grid) return;

    const catalog =
      typeof window.buildMergedProducts === "function"
        ? window.buildMergedProducts()
        : window.products || [];

    const favoriteIds = [1, 12, 4, 17];
    let featured = favoriteIds
      .map((id) => catalog.find((p) => Number(p.id) === id))
      .filter(Boolean);

    if (featured.length < 4) {
      catalog.forEach((p) => {
        if (featured.length < 4 && !featured.some((item) => Number(item.id) === Number(p.id))) {
          featured.push(p);
        }
      });
    }

    grid.innerHTML = featured
      .map((p) => {
        const wished = typeof window.isProductWishlisted === "function" && window.isProductWishlisted(p.id);
        const hasSale = Number(p.oldPrice) > Number(p.price);
        return `
          <article class="product-card">
            ${p.onSale ? `<span class="product-card__status-tag product-card__status-tag--sale">Giảm giá</span>` : ""}
            <a href="product-detail.html?id=${p.id}" class="product-card__image-link" aria-label="Xem chi tiết ${escapeHtml(p.name)}">
              <div class="product-card__image-wrap">
                <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" class="product-card__image" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMG}';">
              </div>
            </a>
            <div class="product-card__content">
              <div class="product-card__meta-row">
                <span class="product-card__category">${escapeHtml(p.category)}</span>
                <button
                  type="button"
                  class="product-card__wish js-home-wish ${wished ? "is-active" : ""}"
                  data-product-id="${p.id}"
                  aria-label="${wished ? "Bỏ yêu thích" : "Thêm vào yêu thích"} ${escapeHtml(p.name)}"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
              </div>
              <h3 class="product-card__title">
                <a href="product-detail.html?id=${p.id}">${escapeHtml(p.name)}</a>
              </h3>
              <p class="product-card__packaging">${escapeHtml(p.packagingLabel || "Tiêu chuẩn")}</p>
              <div class="product-card__price-row">
                <span class="product-card__price">${escapeHtml(formatPrice(p.price))}</span>
                ${hasSale ? `<span class="product-card__old-price">${escapeHtml(formatPrice(p.oldPrice))}</span>` : ""}
              </div>
              <div class="product-card__actions">
                <button type="button" class="btn btn--primary product-card__add-btn product-card__add-btn--brown js-home-add-cart" data-product-id="${p.id}">
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    grid.onclick = function (event) {
      const wishBtn = event.target.closest(".js-home-wish");
      if (wishBtn && typeof window.toggleWishlistProduct === "function") {
        const pid = Number(wishBtn.dataset.productId);
        const res = window.toggleWishlistProduct(pid);
        wishBtn.classList.toggle("is-active", res.wishlisted);
        if (typeof window.showCartToast === "function") {
          window.showCartToast(res.message, { type: "success" });
        }
        return;
      }

      const addBtn = event.target.closest(".js-home-add-cart");
      if (addBtn && typeof window.addToCart === "function") {
        const pid = Number(addBtn.dataset.productId);
        const res = window.addToCart(pid, 1, 0, null);
        if (typeof window.showCartToast === "function") {
          window.showCartToast(res.message, {
            type: res.success ? "success" : "warning",
            showCartLink: true
          });
        }
      }
    };
  }

  /**
   * 4. Sách lật 3D "Công thức gợi ý"
   */
  function initRecipeFlipbook() {
    const container = document.getElementById("recipe-flipbook");
    if (!container) return;

    const recipes = typeof window.getRecipes === "function" ? window.getRecipes() : window.RECIPES_LIST || [];
    if (!recipes.length) return;

    let currentIndex = 0;

    function getComboTotal(recipe) {
      if (!recipe || !Array.isArray(recipe.ingredients)) return 0;
      return recipe.ingredients.reduce((sum, ing) => {
        if (!ing.productId || typeof window.getProductOption !== "function") return sum;
        const opt = window.getProductOption(ing.productId, ing.optionIndex || 0);
        return sum + (opt ? Number(opt.price) : 0);
      }, 0);
    }

    function renderBook(directionClass) {
      const recipe = recipes[currentIndex];
      const wished = typeof window.isRecipeWishlisted === "function" && window.isRecipeWishlisted(recipe.id);
      const comboTotal = getComboTotal(recipe);

      container.innerHTML = `
        <div class="recipe-flipbook-stage">
          <article class="recipe-flipbook-book ${directionClass || ""}">
            <div class="flipbook-page flipbook-page--left">
              <div class="flipbook-photo-wrap">
                <img src="${escapeHtml(recipe.image)}" alt="${escapeHtml(recipe.title)}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}';">
                <span class="flipbook-bookmark">${escapeHtml(recipe.code || `TRANG ${currentIndex + 1}`)}</span>
                <button type="button" class="flipbook-wish-btn js-flip-wish ${wished ? "is-active" : ""}" data-recipe-id="${escapeHtml(recipe.id)}" aria-label="Lưu công thức ${escapeHtml(recipe.title)}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
              </div>
              <div class="flipbook-left-caption">
                <span>Thời gian: <strong>${escapeHtml(recipe.time)}</strong> · Độ khó: <strong>${escapeHtml(recipe.diff)}</strong></span>
                <span>Trang ${currentIndex + 1} / ${recipes.length}</span>
              </div>
            </div>

            <div class="flipbook-page flipbook-page--right">
              <div>
                <p class="flipbook-right__eyebrow">BAKING JOURNAL · KHẨU PHẦN MẶC ĐỊNH ${recipe.defaultServings} PHẦN</p>
                <h3 class="flipbook-right__title">${escapeHtml(recipe.title)}</h3>
                <p class="flipbook-right__desc">${escapeHtml(recipe.subtitle)}</p>

                <div class="flipbook-ingredients-chips">
                  ${(recipe.ingredients || [])
                    .slice(0, 4)
                    .map((ing) => `<span class="flipbook-chip">${ing.baseAmount}${escapeHtml(ing.unit)} ${escapeHtml(ing.name)}</span>`)
                    .join("")}
                </div>

                <ol class="flipbook-steps-preview">
                  ${(recipe.steps || [])
                    .slice(0, 3)
                    .map((s) => `<li>${escapeHtml(s)}</li>`)
                    .join("")}
                </ol>
              </div>

              <div class="flipbook-right__footer">
                <a href="recipe-detail.html?id=${escapeHtml(recipe.id)}" class="btn btn--primary" style="background-color: var(--primary-color); border-color: var(--primary-color);">
                  Xem công thức chi tiết &rarr;
                </a>
                <button type="button" class="btn btn--outline-dark js-flip-add-combo" data-recipe-id="${escapeHtml(recipe.id)}">
                  + Combo (${escapeHtml(formatPrice(comboTotal))})
                </button>
              </div>
            </div>
          </article>
        </div>

        <div class="flipbook-controls">
          <button type="button" class="btn btn--outline-dark js-flip-prev" aria-label="Lật về công thức trước">
            &larr; Trang trước
          </button>

          <div class="flipbook-page-pills" role="tablist" aria-label="Chọn trang sách công thức">
            ${recipes
              .map(
                (r, idx) => `
                  <button
                    type="button"
                    class="flipbook-page-pill js-flip-goto ${idx === currentIndex ? "is-active" : ""}"
                    data-index="${idx}"
                    aria-selected="${idx === currentIndex ? "true" : "false"}"
                  >
                    ${idx + 1}. ${escapeHtml(r.title.split(" ").slice(0, 3).join(" "))}
                  </button>
                `
              )
              .join("")}
          </div>

          <button type="button" class="btn btn--outline-dark js-flip-next" aria-label="Lật sang công thức tiếp theo">
            Lật trang tiếp &rarr;
          </button>
        </div>
      `;
    }

    container.addEventListener("click", function (event) {
      if (event.target.closest(".js-flip-prev")) {
        currentIndex = (currentIndex - 1 + recipes.length) % recipes.length;
        renderBook("is-turning-prev");
        return;
      }
      if (event.target.closest(".js-flip-next")) {
        currentIndex = (currentIndex + 1) % recipes.length;
        renderBook("is-turning-next");
        return;
      }
      const pill = event.target.closest(".js-flip-goto");
      if (pill) {
        const nextIdx = Number(pill.dataset.index);
        if (Number.isFinite(nextIdx) && nextIdx !== currentIndex) {
          const dir = nextIdx > currentIndex ? "is-turning-next" : "is-turning-prev";
          currentIndex = nextIdx;
          renderBook(dir);
        }
        return;
      }
      const wishBtn = event.target.closest(".js-flip-wish");
      if (wishBtn && typeof window.toggleWishlistRecipe === "function") {
        const res = window.toggleWishlistRecipe(wishBtn.dataset.recipeId);
        wishBtn.classList.toggle("is-active", res.wishlisted);
        if (typeof window.showCartToast === "function") {
          window.showCartToast(res.message, { type: "success" });
        }
        return;
      }
      const addComboBtn = event.target.closest(".js-flip-add-combo");
      if (addComboBtn && typeof window.addRecipeComboToCart === "function") {
        const res = window.addRecipeComboToCart(addComboBtn.dataset.recipeId);
        if (typeof window.showCartToast === "function") {
          window.showCartToast(res.message, {
            type: res.success ? "success" : "warning",
            showCartLink: true
          });
        }
      }
    });

    renderBook("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeroCarousel();
    initCategoryCarousel();
    renderHomeFavorites();
    initRecipeFlipbook();
  });

  window.addEventListener("bakemate:wishlistChanged", function () {
    renderHomeFavorites();
  });
})();
