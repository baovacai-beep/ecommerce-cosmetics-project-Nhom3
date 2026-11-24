
/*
 * =====================================================
 * BAKEMATE - DANH SÁCH YÊU THÍCH (wishlist.html)
 * Tệp: js/wishlist.js
 * Đồng bộ Product Card với trang chủ (home.js)
 * =====================================================
 */

(function () {
  const FALLBACK_IMG =
    window.FALLBACK_PRODUCT_IMAGE || "images/logo.jpg";

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

  // =====================================================
  // 1. RENDER DANH SÁCH YÊU THÍCH
  // =====================================================

  function renderWishlistPage() {
    const root = document.getElementById("wishlist-root");
    const totalPill = document.getElementById("wishlist-total-pill");

    if (!root) return;

    const wl =
      typeof window.getWishlist === "function"
        ? window.getWishlist()
        : { products: [], recipes: [] };

    const savedProducts = (wl.products || [])
      .map((id) =>
        typeof window.getProduct === "function"
          ? window.getProduct(id)
          : null
      )
      .filter(Boolean);

    const savedRecipes = (wl.recipes || [])
      .map((id) =>
        typeof window.getRecipeById === "function"
          ? window.getRecipeById(id)
          : null
      )
      .filter(Boolean);

    const total = savedProducts.length + savedRecipes.length;

    if (totalPill) {
      totalPill.textContent = `${total} mục đã lưu`;
    }

    const showProducts =
      (activeTab === "all" || activeTab === "products") &&
      savedProducts.length > 0;

    const showRecipes =
      (activeTab === "all" || activeTab === "recipes") &&
      savedRecipes.length > 0;

    // EMPTY STATE
    if (!showProducts && !showRecipes) {
      root.innerHTML = `
        <section class="cart-empty">
          <h2 class="cart-empty__title">
            Danh sách yêu thích đang trống
          </h2>

          <p class="cart-empty__desc">
            Nhấn biểu tượng trái tim trên bất kỳ sản phẩm
            hoặc công thức nào để lưu lại vào danh sách này.
          </p>

          <div style="
            display:flex;
            justify-content:center;
            gap:12px;
            flex-wrap:wrap;
          ">
            <a href="products.html" class="btn btn--primary">
              Khám phá sản phẩm
            </a>

            <a href="recipes.html" class="btn btn--outline-dark">
              Khám phá công thức
            </a>
          </div>
        </section>
      `;

      return;
    }

    const parts = [];

    // =====================================================
    // 2. SẢN PHẨM YÊU THÍCH
    // ĐỒNG BỘ 100% CẤU TRÚC CLASS VỚI HOME.JS
    // =====================================================

    if (showProducts) {
      parts.push(`
        <section
          class="wishlist-products-section"
          aria-label="Sản phẩm đã yêu thích"
          style="margin-bottom:36px;"
        >

          <h2
            class="section-heading"
            style="text-align:left;margin-bottom:16px;"
          >
            Sản phẩm yêu thích (${savedProducts.length})
          </h2>

          <div class="product-grid">

            ${savedProducts
              .map((product) => {
                const isSoon =
                  product.stockStatus === "coming_soon" ||
                  product.stockStatus === "out_of_stock";

                const hasSale =
                  Number(product.oldPrice) >
                  Number(product.price);

                const saleBadge =
                  !isSoon && (product.onSale || hasSale);

                return `
                  <article class="product-card">

                    ${
                      isSoon
                        ? `
                          <span class="
                            product-card__status-tag
                            product-card__status-tag--soon
                          ">
                            Hết hàng
                          </span>
                        `
                        : saleBadge
                          ? `
                            <span class="
                              product-card__status-tag
                              product-card__status-tag--sale
                            ">
                              Giảm giá
                            </span>
                          `
                          : ""
                    }

                    <!-- HÌNH ẢNH SẢN PHẨM -->

                    <a
                      href="product-detail.html?id=${encodeURIComponent(product.id)}"
                      class="product-card__image-link"
                      aria-label="Xem chi tiết ${escapeHtml(product.name)}"
                    >

                      <div class="product-card__image-wrap">

                        <img
                          src="${escapeHtml(product.image || FALLBACK_IMG)}"
                          alt="${escapeHtml(product.name)}"
                          class="product-card__image"
                          loading="lazy"
                          onerror="this.onerror=null;this.src='${FALLBACK_IMG}';"
                        >

                      </div>

                    </a>

                    <!-- NỘI DUNG SẢN PHẨM -->

                    <div class="product-card__content">

                      <!-- DANH MỤC + TRÁI TIM -->

                      <div class="product-card__meta-row">

                        <span class="product-card__category">
                          ${escapeHtml(product.category || "Sản phẩm")}
                        </span>

                        <button
                          type="button"
                          class="product-card__wish is-active js-wish-remove-prod"
                          data-product-id="${escapeHtml(product.id)}"
                          aria-label="Bỏ yêu thích ${escapeHtml(product.name)}"
                          title="Bỏ yêu thích"
                        >

                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                          >
                            <path d="
                              M19 14c1.49-1.46 3-3.21 3-5.5
                              A5.5 5.5 0 0 0 16.5 3
                              c-1.76 0-3 .5-4.5 2
                              -1.5-1.5-2.74-2-4.5-2
                              A5.5 5.5 0 0 0 2 8.5
                              c0 2.3 1.5 4.05 3 5.5l7 7Z
                            "/>
                          </svg>

                        </button>

                      </div>

                      <!-- TÊN SẢN PHẨM -->

                      <h3 class="product-card__title">

                        <a href="product-detail.html?id=${encodeURIComponent(product.id)}">
                          ${escapeHtml(product.name)}
                        </a>

                      </h3>

                      <!-- QUY CÁCH ĐÓNG GÓI -->

                      <p class="product-card__packaging">
                        ${escapeHtml(product.packagingLabel || "Tiêu chuẩn")}
                      </p>

                      <!-- GIÁ BÁN -->

                      <div class="product-card__price-row">

                        <span class="product-card__price">
                          ${escapeHtml(formatPrice(product.price))}
                        </span>

                        ${
                          hasSale
                            ? `
                              <span class="product-card__old-price">
                                ${escapeHtml(formatPrice(product.oldPrice))}
                              </span>
                            `
                            : ""
                        }

                      </div>

                      <!-- NÚT THÊM VÀO GIỎ -->

                      <div class="product-card__actions">

                        <button
                          type="button"
                          class="
                            btn
                            btn--primary
                            product-card__add-btn
                            product-card__add-btn--brown
                            js-wish-add-cart
                          "
                          data-product-id="${escapeHtml(product.id)}"
                          ${isSoon ? "disabled" : ""}
                        >
                          ${isSoon ? "Hết hàng" : "Thêm vào giỏ"}
                        </button>

                      </div>

                    </div>

                  </article>
                `;
              })
              .join("")}

          </div>

        </section>
      `);
    }

    // =====================================================
    // 3. CÔNG THỨC YÊU THÍCH
    // GIỮ NGUYÊN THIẾT KẾ VÀ CHỨC NĂNG CŨ
    // =====================================================

    if (showRecipes) {
      parts.push(`
        <section aria-label="Công thức đã lưu">

          <h2
            class="section-heading"
            style="text-align:left;margin-bottom:16px;"
          >
            Công thức đã lưu (${savedRecipes.length})
          </h2>

          <div class="recipes-editorial-grid">

            ${savedRecipes
              .map(
                (recipe) => `
                  <article class="recipe-poster-card">

                    <img
                      src="${escapeHtml(recipe.image || FALLBACK_IMG)}"
                      alt="${escapeHtml(recipe.title)}"
                      class="recipe-poster-card__img"
                      onerror="this.onerror=null;this.src='${FALLBACK_IMG}';"
                    >

                    <div
                      class="recipe-poster-card__scrim"
                      aria-hidden="true"
                    ></div>

                    <button
                      type="button"
                      class="
                        recipe-poster-card__wish
                        is-active
                        js-wish-remove-recipe
                      "
                      data-recipe-id="${escapeHtml(recipe.id)}"
                      aria-label="Bỏ lưu công thức"
                    >

                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <path d="
                          M19 14c1.49-1.46 3-3.21 3-5.5
                          A5.5 5.5 0 0 0 16.5 3
                          c-1.76 0-3 .5-4.5 2
                          -1.5-1.5-2.74-2-4.5-2
                          A5.5 5.5 0 0 0 2 8.5
                          c0 2.3 1.5 4.05 3 5.5l7 7Z
                        "/>
                      </svg>

                    </button>

                    <div class="recipe-poster-card__body">

                      <span class="recipe-poster-card__code">
                        ${escapeHtml(recipe.code || "RECIPE")}
                      </span>

                      <h3 class="recipe-poster-card__title">
                        ${escapeHtml(recipe.title)}
                      </h3>

                      <div class="recipe-poster-card__meta">
                        <span>${escapeHtml(recipe.time)}</span>
                        <span>·</span>
                        <span>${escapeHtml(recipe.diff)}</span>
                      </div>

                      <a
                        href="recipe-detail.html?id=${encodeURIComponent(recipe.id)}"
                        class="recipe-poster-card__cta"
                      >
                        Xem công thức &rarr;
                      </a>

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

  // =====================================================
  // 4. SỰ KIỆN TAB LỌC YÊU THÍCH
  // =====================================================

  document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".js-wish-tab").forEach((btn) => {

      btn.addEventListener("click", function () {

        activeTab = btn.dataset.tab || "all";

        document.querySelectorAll(".js-wish-tab").forEach((b) => {
          b.classList.toggle("active", b === btn);
        });

        renderWishlistPage();

      });

    });

    // =====================================================
    // 5. XỬ LÝ SỰ KIỆN SẢN PHẨM VÀ CÔNG THỨC
    // =====================================================

    const root = document.getElementById("wishlist-root");

    if (root) {

      root.addEventListener("click", function (event) {

        // BỎ YÊU THÍCH SẢN PHẨM

        const rmProd = event.target.closest(".js-wish-remove-prod");

        if (rmProd && window.toggleWishlistProduct) {

          const res = window.toggleWishlistProduct(
            Number(rmProd.dataset.productId)
          );

          if (window.showCartToast) {
            window.showCartToast(res.message, {
              type: "success"
            });
          }

          renderWishlistPage();
          return;
        }

        // BỎ LƯU CÔNG THỨC

        const rmRec = event.target.closest(".js-wish-remove-recipe");

        if (rmRec && window.toggleWishlistRecipe) {

          const res = window.toggleWishlistRecipe(
            rmRec.dataset.recipeId
          );

          if (window.showCartToast) {
            window.showCartToast(res.message, {
              type: "success"
            });
          }

          renderWishlistPage();
          return;
        }

        // THÊM SẢN PHẨM VÀO GIỎ HÀNG

        const addCart = event.target.closest(".js-wish-add-cart");

        if (addCart && window.addToCart) {

          const res = window.addToCart(
            Number(addCart.dataset.productId),
            1,
            0,
            null
          );

          if (window.showCartToast) {

            window.showCartToast(res.message, {
              type: res.success ? "success" : "warning",
              showCartLink: Boolean(res.success)
            });

          }

        }

      });

    }

    // =====================================================
    // 6. ĐỒNG BỘ KHI WISHLIST THAY ĐỔI
    // =====================================================

    window.addEventListener(
      "bakemate:wishlistChanged",
      renderWishlistPage
    );

    renderWishlistPage();

  });

})();
