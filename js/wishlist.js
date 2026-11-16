/*
 * =====================================================
 * BAKEMATE - DANH SÁCH YÊU THÍCH (wishlist.html)
 * Tệp: js/wishlist.js
 * =====================================================
 */

(function () {
  const FALLBACK_IMG = window.FALLBACK_PRODUCT_IMAGE || "images/logo.jpg";

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

  let activeTab = "all";

  function renderWishlistPage() {
    const root = document.getElementById("wishlist-root");
    const totalPill = document.getElementById("wishlist-total-pill");
    if (!root) return;

    const wl = typeof window.getWishlist === "function" ? window.getWishlist() : { products: [], recipes: [] };
    const savedProducts = (wl.products || [])
      .map((id) => (typeof window.getProduct === "function" ? window.getProduct(id) : null))
      .filter(Boolean);
    const savedRecipes = (wl.recipes || [])
      .map((id) => (typeof window.getRecipeById === "function" ? window.getRecipeById(id) : null))
      .filter(Boolean);

    const total = savedProducts.length + savedRecipes.length;
    if (totalPill) totalPill.textContent = `${total} mục đã lưu`;

    const showProducts = (activeTab === "all" || activeTab === "products") && savedProducts.length > 0;
    const showRecipes = (activeTab === "all" || activeTab === "recipes") && savedRecipes.length > 0;

    if (!showProducts && !showRecipes) {
      root.innerHTML = `
        <section class="cart-empty">
          <h2 class="cart-empty__title">Danh sách yêu thích đang trống</h2>
          <p class="cart-empty__desc">Nhấn biểu tượng trái tim trên bất kỳ sản phẩm hoặc công thức nào để lưu lại vào danh sách này.</p>
          <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
            <a href="products.html" class="btn btn--primary">Khám phá sản phẩm</a>
            <a href="recipes.html" class="btn btn--outline-dark">Khám phá công thức</a>
          </div>
        </section>
      `;
      return;
    }

    const parts = [];

    if (showProducts) {
      parts.push(`
        <section style="margin-bottom:36px;" aria-label="Sản phẩm đã yêu thích">
          <h2 class="section-heading" style="text-align:left;margin-bottom:16px;">Sản phẩm yêu thích (${savedProducts.length})</h2>
          <div class="product-grid">
            ${savedProducts
              .map((product) => {
                const isSoon = product.stockStatus === "coming_soon";
                return `
                  <article class="product-card">
                    ${isSoon ? `<span class="product-card__status-tag product-card__status-tag--soon">Sắp có hàng</span>` : ""}
                    <a href="product-detail.html?id=${product.id}" class="product-card__thumb">
                      <img src="${escapeHtml(product.image || FALLBACK_IMG)}" alt="${escapeHtml(product.name)}" class="product-card__img" onerror="this.onerror=null;this.src='${FALLBACK_IMG}';">
                    </a>
                    <div class="product-card__body">
                      <div class="product-card__meta-row">
                        <span class="product-card__category">${escapeHtml(product.category)}</span>
                        <button type="button" class="product-card__wish is-active js-wish-remove-prod" data-product-id="${product.id}" aria-label="Bỏ yêu thích">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                          </svg>
                        </button>
                      </div>
                      <h3 class="product-card__name"><a href="product-detail.html?id=${product.id}">${escapeHtml(product.name)}</a></h3>
                      <div class="product-card__price-row">
                        <span class="product-card__price">${formatPrice(product.price)}</span>
                      </div>
                      <button type="button" class="product-card__add-btn product-card__add-btn--brown js-wish-add-cart" data-product-id="${product.id}" ${isSoon ? "disabled" : ""}>
                        ${isSoon ? "Sắp về hàng" : "+ Thêm vào giỏ"}
                      </button>
                    </div>
                  </article>
                `;
              })
              .join("")}
          </div>
        </section>
      `);
    }

    if (showRecipes) {
      parts.push(`
        <section aria-label="Công thức đã lưu">
          <h2 class="section-heading" style="text-align:left;margin-bottom:16px;">Công thức đã lưu (${savedRecipes.length})</h2>
          <div class="recipes-editorial-grid">
            ${savedRecipes
              .map(
                (recipe) => `
                  <article class="recipe-poster-card">
                    <img src="${escapeHtml(recipe.image || FALLBACK_IMG)}" alt="${escapeHtml(recipe.title)}" class="recipe-poster-card__img" onerror="this.onerror=null;this.src='${FALLBACK_IMG}';">
                    <div class="recipe-poster-card__scrim" aria-hidden="true"></div>
                    <button type="button" class="recipe-poster-card__wish is-active js-wish-remove-recipe" data-recipe-id="${escapeHtml(recipe.id)}" aria-label="Bỏ lưu công thức">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                      </svg>
                    </button>
                    <div class="recipe-poster-card__body">
                      <span class="recipe-poster-card__code">${escapeHtml(recipe.code || "RECIPE")}</span>
                      <h3 class="recipe-poster-card__title">${escapeHtml(recipe.title)}</h3>
                      <div class="recipe-poster-card__meta"><span>${escapeHtml(recipe.time)}</span><span>·</span><span>${escapeHtml(recipe.diff)}</span></div>
                      <a href="recipe-detail.html?id=${encodeURIComponent(recipe.id)}" class="recipe-poster-card__cta">Xem công thức &rarr;</a>
                    </div>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>
      `);
    }

    root.innerHTML = parts.join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".js-wish-tab").forEach((btn) => {
      btn.addEventListener("click", function () {
        activeTab = btn.dataset.tab || "all";
        document.querySelectorAll(".js-wish-tab").forEach((b) => b.classList.toggle("active", b === btn));
        renderWishlistPage();
      });
    });

    const root = document.getElementById("wishlist-root");
    if (root) {
      root.addEventListener("click", function (event) {
        const rmProd = event.target.closest(".js-wish-remove-prod");
        if (rmProd && window.toggleWishlistProduct) {
          const res = window.toggleWishlistProduct(Number(rmProd.dataset.productId));
          if (window.showCartToast) window.showCartToast(res.message, { type: "success" });
          renderWishlistPage();
          return;
        }

        const rmRec = event.target.closest(".js-wish-remove-recipe");
        if (rmRec && window.toggleWishlistRecipe) {
          const res = window.toggleWishlistRecipe(rmRec.dataset.recipeId);
          if (window.showCartToast) window.showCartToast(res.message, { type: "success" });
          renderWishlistPage();
          return;
        }

        const addCart = event.target.closest(".js-wish-add-cart");
        if (addCart && window.addToCart) {
          const res = window.addToCart(Number(addCart.dataset.productId), 1, 0);
          if (window.showCartToast) {
            window.showCartToast(res.message, {
              type: res.success ? "success" : "warning",
              showCartLink: Boolean(res.success)
            });
          }
        }
      });
    }

    window.addEventListener("bakemate:wishlistChanged", renderWishlistPage);
    renderWishlistPage();
  });
})();
