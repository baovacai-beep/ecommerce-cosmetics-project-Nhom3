
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
const productList = document.getElementById("product-list");
const noProductsMessage = document.getElementById("no-products-message");
const resultCount = document.getElementById("product-result-count");

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
        this.src = "images/products/bot-mi-so-8-1.jpg";
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
    price.textContent = Number(product.price).toLocaleString("vi-VN") + " ₫";

    // 2. Gắn ID động vào nút Xem chi tiết
    const detailLink = document.createElement("a");
    detailLink.href = `product-detail.html?id=${product.id}`;
    detailLink.className = "btn btn--primary product-card__btn";
    detailLink.textContent = "Xem chi tiết";

    content.append(title, price, detailLink);
    article.append(imageLink, content);

    return article;
}

// Hien thi danh sach san pham
function renderProducts(list) {
    productList.innerHTML = "";

    if (list.length === 0) {
        noProductsMessage.hidden = false;
    } else {
        noProductsMessage.hidden = true;

        list.forEach((product, index) => {
            productList.appendChild(createProductCard(product, index));
        });
    }

    resultCount.textContent = "Tìm thấy " + list.length + " sản phẩm";
}

// Xu ly tim kiem, loc va sap xep
function updateProducts() {
    const keyword = normalizeText(searchInput.value);
    const selectedCategory = categoryFilter.value;
    const selectedSort = priceSort.value;

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
searchInput.addEventListener("input", updateProducts);

// Ngan form tai lai trang khi bam nut Tim
searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    updateProducts();
});

// Cap nhat khi thay doi danh muc
categoryFilter.addEventListener("change", updateProducts);

// Cap nhat khi thay doi cach sap xep
priceSort.addEventListener("change", updateProducts);

// Doc tu khoa tren URL neu co, vi du products.html?q=bot-mi
const urlParams = new URLSearchParams(window.location.search);
searchInput.value = urlParams.get("q") || "";

// Hien thi san pham lan dau
updateProducts();
