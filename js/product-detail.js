// =========================================================
// BAKEMATE - ĐỌC DỮ LIỆU TỪ URL VÀ ĐỔ VÀO TRANG CHI TIẾT
// Tệp: js/product-detail.js
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
    // 1. Lấy dữ liệu 11 sản phẩm đã nạp từ js/products.js
    const productList = window.products || [];

    // 2. Đọc tham số id từ URL (ví dụ: product-detail.html?id=4)
    const urlParams = new URLSearchParams(window.location.search);
    const productIdStr = urlParams.get("id");
    const productId = Number(productIdStr);

    // 3. Lấy các thẻ DOM cần thay đổi trên trang product-detail.html
    const detailBox = document.getElementById("product-detail-box");
    const breadcrumbCurrent = document.getElementById("breadcrumb-current");
    const mainImg = document.getElementById("main-product-img");
    const productTitle = document.getElementById("product-title");
    const productPrice = document.getElementById("product-price");
    const productOldPrice = document.getElementById("product-old-price");
    const productSaveTag = document.getElementById("product-save-tag");
    const productBrand = document.getElementById("product-brand");
    const specsTableBody = document.getElementById("specs-table-body");
    const relatedContainer = document.getElementById("related-products-container");

    const btnMinus = document.getElementById("btn-qty-minus");
    const btnPlus = document.getElementById("btn-qty-plus");
    const qtyInput = document.getElementById("product-qty");

    // 4. Tìm sản phẩm tương ứng trong danh sách dựa vào productId
    const product = productList.find((item) => item.id === productId);

    // 5. Nếu KHÔNG tìm thấy sản phẩm hoặc ID trên URL bị sai/thiếu
    if (!product) {
        if (detailBox) {
            detailBox.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background-color: var(--bg-color, #fff8ed); border-radius: 8px; width: 100%;">
                    <h2 style="color: var(--primary-color, #70452b); margin-bottom: 16px;">Sản phẩm không tồn tại!</h2>
                    <p style="color: #666; margin-bottom: 24px;">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.</p>
                    <a href="products.html" class="btn btn--primary">Quay lại danh sách sản phẩm</a>
                </div>
            `;
        }
        return;
    }

    // 6. ĐÈ DỮ LIỆU MỚI LÊN HÀNG CỨNG "BỘT MÌ MEIZAN" MẶC ĐỊNH TRÊN HTML
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = product.name;
    if (productTitle) productTitle.textContent = product.name;
    document.title = `${product.name} - BakeMate`;

    if (mainImg) {
        mainImg.src = product.image;
        mainImg.alt = product.name;
        mainImg.onerror = function () {
            this.onerror = null;
            this.src = "images/products/bot-mi-so-8-1.jpg";
        };
    }

    // 6.1 Cập nhật Giá tiền hiện tại
    if (productPrice) {
        productPrice.textContent = Number(product.price).toLocaleString("vi-VN") + " ₫";
    }

    // 6.2 Ẩn bớt giá cũ / tag tiết kiệm cứng của Meizan nếu không dùng
    if (productOldPrice) productOldPrice.style.display = "none";
    if (productSaveTag) productSaveTag.style.display = "none";

    // 6.3 Cập nhật Thương hiệu & Danh mục
    if (productBrand) {
        productBrand.innerHTML = `Danh mục: <strong>${product.category}</strong> | Thương hiệu: <strong>BakeMate</strong>`;
    }

    // 6.4 Đổ thông số kỹ thuật & Mô tả vào bảng specs-table-body
    if (specsTableBody) {
        specsTableBody.innerHTML = `
            <tr>
                <td style="font-weight: bold; width: 30%;">Tên sản phẩm</td>
                <td>${product.name}</td>
            </tr>
            <tr>
                <td style="font-weight: bold;">Danh mục</td>
                <td>${product.category}</td>
            </tr>
            <tr>
                <td style="font-weight: bold;">Mô tả sản phẩm</td>
                <td>${product.description}</td>
            </tr>
        `;
    }

    // 7. Xử lý tăng / giảm số lượng
    if (btnMinus && btnPlus && qtyInput) {
        btnMinus.addEventListener("click", function () {
            let currentQty = parseInt(qtyInput.value) || 1;
            if (currentQty > 1) {
                qtyInput.value = currentQty - 1;
            }
        });

        btnPlus.addEventListener("click", function () {
            let currentQty = parseInt(qtyInput.value) || 1;
            if (currentQty < 99) {
                qtyInput.value = currentQty + 1;
            }
        });
    }

    // 8. Hiển thị các sản phẩm mua kèm / liên quan (Cùng Category)
    if (relatedContainer) {
        const relatedList = productList
            .filter((p) => p.category === product.category && p.id !== product.id)
            .slice(0, 4);

        if (relatedList.length > 0) {
            relatedContainer.innerHTML = relatedList
                .map(
                    (item) => `
                    <article class="product-card">
                        <a href="product-detail.html?id=${item.id}" class="product-card__image-link">
                            <div class="product-card__image-wrap">
                                <img src="${item.image}" alt="${item.name}" class="product-card__image" onerror="this.onerror=null;this.src='images/products/bot-mi-so-8-1.jpg';">
                            </div>
                        </a>
                        <div class="product-card__content">
                            <h3 class="product-card__title">${item.name}</h3>
                            <p class="product-card__price">${Number(item.price).toLocaleString("vi-VN")} ₫</p>
                            <a href="product-detail.html?id=${item.id}" class="btn btn--primary product-card__btn">Xem chi tiết</a>
                        </div>
                    </article>
                `
                )
                .join("");
        }
    }
});