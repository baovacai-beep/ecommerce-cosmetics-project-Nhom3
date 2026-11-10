
// ========================================
// BAKEMATE - TIM KIEM, LOC VA SAP XEP
// ========================================

// Lay du lieu san pham tu products.js
const productData = window.products || [];

// Lay cac phan tu HTML
const searchForm = document.getElementById("product-search-form");
const searchInput = document.getElementById("product-search");
const categoryFilter = document.getElementById("category-filter");
const priceSort = document.getElementById("price-sort");
const resetFiltersBtn = document.getElementById("reset-filters-btn");
const productList = document.getElementById("product-list");
const noProductsMessage = document.getElementById("no-products-message");
const resultCount = document.getElementById("product-result-count");
const FALLBACK_IMG = window.FALLBACK_PRODUCT_IMAGE || "images/logo.jpg";

// Chuan hoa chu de tim kiem khong phan biet dau
function normalizeText(text) {
    return String(text)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .trim();
}

// Tao mot the san pham
// Tạo một thẻ sản phẩm có chứa URLSearchParams ID
function createProductCard(product, index) {
    const article = document.createElement("article");
    article.className = "product-card";

    // 1. Gắn ID động vào đường dẫn thẻ ảnh
    const imageLink = document.createElement("a");
    imageLink.href = `product-detail.html?id=${product.id}`;
    imageLink.className = "product-card__image-link";
    imageLink.setAttribute("aria-label", "Xem chi tiết " + product.name);

    const imageWrap = document.createElement("div");
    imageWrap.className = "product-card__image-wrap";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.className = "product-card__image";
    image.loading = "lazy";

    // Ảnh dự phòng nếu đường dẫn ảnh chưa tồn tại
    image.onerror = function () {
        this.onerror = null;
        this.src = FALLBACK_IMG;
    };

    imageWrap.appendChild(image);
    imageLink.appendChild(imageWrap);

    const content = document.createElement("div");
    content.className = "product-card__content";

    const title = document.createElement("h3");
    title.className = "product-card__title";
    title.textContent = product.name;

    const price = document.createElement("p");
    price.className = "product-card__price";
    price.textContent = typeof window.formatCurrency === "function"
        ? window.formatCurrency(product.price)
        : Number(product.price).toLocaleString("vi-VN") + " ₫";

    // Cụm nút hành động: Xem chi tiết & Thêm vào giỏ
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
    addCartBtn.setAttribute("aria-label", "Thêm " + product.name + " vào giỏ hàng");
    addCartBtn.addEventListener("click", function () {
        if (typeof window.addToCart !== "function") {
            return;
        }
        const result = window.addToCart(product.id, 1);
        if (typeof window.showCartToast === "function") {
            window.showCartToast(result.message, {
                type: result.success ? (result.capped ? "warning" : "success") : "warning"
            });
        }
    });

    actionsWrap.append(detailLink, addCartBtn);
    content.append(title, price, actionsWrap);
    article.append(imageLink, content);

    return article;
}

// Hien thi danh sach san pham
function renderProducts(list) {
    if (!productList) {
        return;
    }

    productList.innerHTML = "";

    if (list.length === 0) {
        if (noProductsMessage) noProductsMessage.hidden = false;
    } else {
        if (noProductsMessage) noProductsMessage.hidden = true;

        list.forEach((product, index) => {
            productList.appendChild(createProductCard(product, index));
        });
    }

    if (resultCount) {
        resultCount.textContent = "Tìm thấy " + list.length + " sản phẩm";
    }
}

// Xu ly tim kiem, loc va sap xep
function updateProducts() {
    const keyword = normalizeText(searchInput ? searchInput.value : "");
    const selectedCategory = categoryFilter ? categoryFilter.value : "all";
    const selectedSort = priceSort ? priceSort.value : "default";

    // Tao mang moi, khong sua mang products ban dau
    let filteredProducts = [...productData];

    // 1. Tim kiem theo ten san pham
    if (keyword !== "") {
        filteredProducts = filteredProducts.filter(product =>
            normalizeText(product.name).includes(keyword)
        );
    }

    // 2. Loc theo danh muc
    if (selectedCategory !== "all") {
        filteredProducts = filteredProducts.filter(product =>
            product.category === selectedCategory
        );
    }

    // 3. Sap xep theo gia
    if (selectedSort === "asc") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "desc") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    // 4. Cap nhat giao dien
    renderProducts(filteredProducts);
}

// Cap nhat danh sach khi nhap tu khoa
if (searchInput) {
    searchInput.addEventListener("input", updateProducts);
}

// Ngan form tai lai trang khi bam nut Tim
if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        updateProducts();
    });
}

// Cap nhat khi thay doi danh muc
if (categoryFilter) {
    categoryFilter.addEventListener("change", updateProducts);
}

// Cap nhat khi thay doi cach sap xep
if (priceSort) {
    priceSort.addEventListener("change", updateProducts);
}

// Dat lai bo loc
if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", function () {
        if (searchInput) searchInput.value = "";
        if (categoryFilter) categoryFilter.value = "all";
        if (priceSort) priceSort.value = "default";
        updateProducts();
    });
}

// Doc tu khoa tren URL neu co, vi du products.html?q=bot-mi
if (searchInput) {
    const urlParams = new URLSearchParams(window.location.search);
    searchInput.value = (urlParams.get("q") || "").trim();
}

// Hien thi san pham lan dau
updateProducts();
