/*
 * =====================================================
 * BAKEMATE - TÌM KIẾM, LỌC VÀ SẮP XẾP SẢN PHẨM
 * Tệp: js/search-filter.js (Bước 2 & 3)
 * =====================================================
 */

(function () {
  const productData = window.products || [];

  const searchForm = document.getElementById("product-search-form");
  const searchInput = document.getElementById("product-search");
  const categoryFilter = document.getElementById("category-filter");
  const priceSort = document.getElementById("price-sort");
  const resetFiltersBtn = document.getElementById("reset-filters-btn");
  const productList = document.getElementById("product-list");
  const noProductsMessage = document.getElementById("no-products-message");
  const resultCount = document.getElementById("product-result-count");
  const FALLBACK_IMG = window.FALLBACK_PRODUCT_IMAGE || "images/logo.jpg";

  /**
   * Chuẩn hóa chuỗi tiếng Việt để tìm kiếm không phân biệt hoa thường hay dấu.
   */
  function normalizeText(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .trim();
  }

  /**
   * Tạo thẻ sản phẩm chuẩn DOM với badge danh mục, giá và cụm nút Xem chi tiết / Thêm vào giỏ.
   */
  function createProductCard(product) {
    const article = document.createElement("article");
    article.className = "product-card";

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

    const categoryBadge = document.createElement("span");
    categoryBadge.className = "product-card__category";
    categoryBadge.textContent = product.category;

    const title = document.createElement("h3");
    title.className = "product-card__title";
    title.textContent = product.name;

    const price = document.createElement("p");
    price.className = "product-card__price";
    price.textContent =
      typeof window.formatCurrency === "function"
        ? window.formatCurrency(product.price)
        : Number(product.price).toLocaleString("vi-VN") + " ₫";

    const actionsWrap = document.createElement("div");
    actionsWrap.className = "product-card__actions";

    const detailLink = document.createElement("a");
    detailLink.href = `product-detail.html?id=${product.id}`;
    detailLink.className = "btn btn--outline-dark product-card__btn";
    detailLink.textContent = "Xem chi tiết";

    const addCartBtn = document.createElement("button");
    addCartBtn.type = "button";
    addCartBtn.className = "btn btn--primary product-card__add-btn";
    addCartBtn.textContent = "Thêm vào giỏ";
    addCartBtn.setAttribute("aria-label", `Thêm ${product.name} vào giỏ hàng`);
    addCartBtn.addEventListener("click", function () {
      if (typeof window.addToCart !== "function") {
        return;
      }
      const result = window.addToCart(product.id, 1, 0, null);
      if (typeof window.showCartToast === "function") {
        window.showCartToast(result.message, {
          type: result.success ? (result.capped ? "warning" : "success") : "warning"
        });
      }
    });

    actionsWrap.append(detailLink, addCartBtn);
    content.append(categoryBadge, title, price, actionsWrap);
    article.append(imageLink, content);

    return article;
  }

  /**
   * Kết xuất danh sách thẻ sản phẩm vào DOM (#product-list).
   */
  function renderProducts(list) {
    if (!productList) {
      return;
    }

    const safeList = Array.isArray(list) ? list : [];
    productList.innerHTML = "";

    if (safeList.length === 0) {
      if (noProductsMessage) {
        noProductsMessage.hidden = false;
      }
    } else {
      if (noProductsMessage) {
        noProductsMessage.hidden = true;
      }
      safeList.forEach((product) => {
        productList.appendChild(createProductCard(product));
      });
    }

    if (resultCount) {
      resultCount.textContent = `Tìm thấy ${safeList.length} sản phẩm`;
    }
  }

  /**
   * Kết hợp đồng thời tìm kiếm từ khóa, lọc danh mục và sắp xếp giá trên bản sao mảng gốc.
   */
  function updateProducts() {
    const keyword = normalizeText(searchInput ? searchInput.value : "");
    const selectedCategory = categoryFilter ? categoryFilter.value : "all";
    const selectedSort = priceSort ? priceSort.value : "default";

    let filteredProducts = [...productData];

    if (keyword !== "") {
      filteredProducts = filteredProducts.filter((product) =>
        normalizeText(product.name).includes(keyword) ||
        normalizeText(product.category).includes(keyword)
      );
    }

    if (selectedCategory !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (selectedSort === "asc") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "desc") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    renderProducts(filteredProducts);
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

  if (categoryFilter) {
    categoryFilter.addEventListener("change", updateProducts);
  }

  if (priceSort) {
    priceSort.addEventListener("change", updateProducts);
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", function () {
      if (searchInput) searchInput.value = "";
      if (categoryFilter) categoryFilter.value = "all";
      if (priceSort) priceSort.value = "default";
      if (window.location.search && window.history && typeof window.history.replaceState === "function") {
        try {
          window.history.replaceState({}, "", window.location.pathname + window.location.hash);
        } catch (error) {
          // Bỏ qua nếu môi trường trình duyệt hạn chế replaceState
        }
      }
      updateProducts();
    });
  }

  // Đọc tham số q và category trên URL nếu có (ví dụ products.html?q=bot&category=Nguyên%20liệu)
  const urlParams = new URLSearchParams(window.location.search);
  if (searchInput) {
    const q = (urlParams.get("q") || "").trim();
    if (q) {
      searchInput.value = q;
    }
  }
  if (categoryFilter) {
    const urlCat = (urlParams.get("category") || "").trim();
    if (urlCat) {
      const normalizedUrlCat = normalizeText(urlCat);
      const matchedOption =
        Array.from(categoryFilter.options).find((opt) => opt.value === urlCat) ||
        Array.from(categoryFilter.options).find(
          (opt) => opt.value !== "all" && normalizeText(opt.value) === normalizedUrlCat
        );
      if (matchedOption) {
        categoryFilter.value = matchedOption.value;
      }
    }
  }

  updateProducts();

  if (typeof window !== "undefined") {
    window.renderProducts = renderProducts;
    window.updateProducts = updateProducts;
    window.applyFiltersAndSort = updateProducts;
  }
})();
