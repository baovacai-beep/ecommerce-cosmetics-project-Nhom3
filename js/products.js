/*
 * =====================================================
 * BAKEMATE - DỮ LIỆU SẢN PHẨM & KẾT XUẤT DOM
 * Người phụ trách: Bảo Ngọc
 * Số lượng: 11 sản phẩm
 * =====================================================
 */

const products = [
    // 1. Bột mì Baker's Choice số 8
    {
        id: 1,
        name: "Bột mì Baker's Choice số 8",
        price: 52000,
        originalPrice: 60000,
        rating: 4.8,
        reviewCount: 112,
        category: "Nguyên liệu",
        image: "images/products/bot-mi-so-8-1.jpg",
        description: "Bột mì số 8 có hàm lượng protein thấp, thích hợp làm bánh bông lan, cupcake, muffin và các loại bánh mềm xốp.",
        isFeatured: true
    },

    // 2. Bột mì Baker's Choice số 11
    {
        id: 2,
        name: "Bột mì Baker's Choice số 11",
        price: 45000,
        originalPrice: 50000,
        rating: 4.7,
        reviewCount: 95,
        category: "Nguyên liệu",
        image: "images/products/bot-mi-so-11-1.jpg",
        description: "Bột mì số 11 phù hợp làm bánh mì và các loại bánh cần độ dai, đàn hồi.",
        isFeatured: false
    },

    // 3. Bột mì đa dụng Meizan
    {
        id: 3,
        name: "Bột mì đa dụng Meizan",
        price: 32000,
        originalPrice: 38000,
        rating: 4.9,
        reviewCount: 140,
        category: "Nguyên liệu",
        image: "images/products/bot-mi-meizan-1.jpg",
        description: "Bột mì đa dụng có thể sử dụng trong nhiều công thức làm bánh và chế biến thực phẩm.",
        isFeatured: true
    },

    // 4. Bột cacao nguyên chất Hershey's
    {
        id: 4,
        name: "Bột cacao nguyên chất Hershey's",
        price: 65000,
        originalPrice: 75000,
        rating: 4.9,
        reviewCount: 88,
        category: "Nguyên liệu",
        image: "images/products/bot-cacao-hershey-1.jpg",
        description: "Bột cacao dùng tạo hương vị chocolate và màu sắc đặc trưng cho bánh brownie, bánh quy và các món tráng miệng.",
        isFeatured: true
    },

    // 5. Bột Matcha làm bánh
    {
        id: 5,
        name: "Bột Matcha làm bánh",
        price: 75000,
        originalPrice: 85000,
        rating: 4.6,
        reviewCount: 60,
        category: "Nguyên liệu",
        image: "images/products/matcha-lam-banh-1.jpg",
        description: "Bột matcha dùng làm bánh cupcake, bánh quy và các món tráng miệng có hương vị trà xanh.",
        isFeatured: false
    },

    // 6. Whipping Cream
    {
        id: 6,
        name: "Whipping Cream",
        price: 45000,
        originalPrice: 52000,
        rating: 4.8,
        reviewCount: 130,
        category: "Nguyên liệu",
        image: "images/products/whipping-cream-1.jpg",
        description: "Kem tươi dùng để đánh bông, trang trí bánh kem, làm mousse và các món tráng miệng.",
        isFeatured: true
    },

    // 7. Cân điện tử nhà bếp
    {
        id: 7,
        name: "Cân điện tử nhà bếp",
        price: 120000,
        originalPrice: 140000,
        rating: 4.9,
        reviewCount: 205,
        category: "Dụng cụ",
        image: "images/products/can-dien-tu-1.jpg",
        description: "Cân điện tử hỗ trợ cân đo chính xác khối lượng bột, đường, bơ và các nguyên liệu làm bánh.",
        isFeatured: true
    },

    // 8. Ca đong nguyên liệu
    {
        id: 8,
        name: "Ca đong nguyên liệu",
        price: 45000,
        originalPrice: 50000,
        rating: 4.5,
        reviewCount: 45,
        category: "Dụng cụ",
        image: "images/products/ca-dong-1.jpg",
        description: "Ca đong có vạch chia giúp đo lường lượng nước, sữa và các nguyên liệu dạng lỏng trong công thức.",
        isFeatured: false
    },

    // 9. Thìa đong định lượng
    {
        id: 9,
        name: "Thìa đong định lượng",
        price: 35000,
        originalPrice: 40000,
        rating: 4.7,
        reviewCount: 72,
        category: "Dụng cụ",
        image: "images/products/thia-dong-1.jpg",
        description: "Bộ thìa đong hỗ trợ định lượng các nguyên liệu có khối lượng nhỏ như bột nở, muối và vani.",
        isFeatured: false
    },

    // 10. Nhiệt kế điện tử nhà bếp
    {
        id: 10,
        name: "Nhiệt kế điện tử nhà bếp",
        price: 95000,
        originalPrice: 110000,
        rating: 4.8,
        reviewCount: 84,
        category: "Dụng cụ",
        image: "images/products/nhiet-ke-1.jpg",
        description: "Nhiệt kế điện tử hỗ trợ kiểm tra nhiệt độ nguyên liệu trong quá trình chế biến và làm bánh.",
        isFeatured: false
    },

    // 11. Túi bắt kem dùng một lần
    {
        id: 11,
        name: "Túi bắt kem dùng một lần",
        price: 25000,
        originalPrice: 30000,
        rating: 4.6,
        reviewCount: 55,
        category: "Dụng cụ",
        image: "images/products/tui-bat-kem-1.jpg",
        description: "Túi bắt kem hỗ trợ tạo hình và trang trí bánh kem, cupcake cùng nhiều loại bánh khác.",
        isFeatured: false
    }
];


/* =====================================================
 * HÀM ĐỊNH DẠNG TIỀN TỆ & RENDER SẢN PHẨM RA DOM
 * ===================================================== */

function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function renderProducts(list, containerId = 'product-list-container') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Không tìm thấy container với ID: ${containerId}`);
    return;
  }

  if (!list || list.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-muted">Không tìm thấy sản phẩm phù hợp.</p>
      </div>
    `;
    return;
  }

  let htmlContent = '';

  list.forEach(product => {
    const discountPercent = product.originalPrice && product.originalPrice > product.price 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
      : 0;

    htmlContent += `
      <div class="col-md-4 col-sm-6 mb-4">
        <div class="card product-card h-100 shadow-sm border-0 position-relative">
          ${discountPercent > 0 ? `<span class="badge bg-danger position-absolute top-0 start-0 m-2">-${discountPercent}%</span>` : ''}
          ${product.isFeatured ? `<span class="badge bg-warning text-dark position-absolute top-0 end-0 m-2">Bán chạy</span>` : ''}
          
          <img src="${product.image}" class="card-img-top product-img" alt="${product.name}" onerror="this.src='images/products/default.jpg'">
          
          <div class="card-body d-flex flex-column">
            <span class="text-muted small mb-1">${product.category}</span>
            <h5 class="card-title product-title">
              <a href="product-detail.html?id=${product.id}" class="text-decoration-none text-dark">${product.name}</a>
            </h5>
            
            <div class="rating-stars mb-2 text-warning small">
              ${'★'.repeat(Math.floor(product.rating || 5))}${'☆'.repeat(5 - Math.floor(product.rating || 5))}
              <span class="text-muted ms-1">(${product.reviewCount || 0})</span>
            </div>

            <div class="mt-auto">
              <div class="d-flex align-items-center mb-3">
                <span class="fw-bold text-danger fs-5 me-2">${formatCurrency(product.price)}</span>
                ${product.originalPrice && product.originalPrice > product.price ? `<span class="text-muted text-decoration-line-through small">${formatCurrency(product.originalPrice)}</span>` : ''}
              </div>
              
              <div class="d-grid gap-2">
                <a href="product-detail.html?id=${product.id}" class="btn btn-outline-primary btn-sm">Xem chi tiết</a>
                <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                  <i class="bi bi-cart-plus"></i> Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = htmlContent;
}

// Tự động chạy khi trang load xong
document.addEventListener('DOMContentLoaded', () => {
  if (typeof products !== 'undefined') {
    renderProducts(products);
  }
});

// Hỗ trợ xuất dữ liệu (Bỏ qua cảnh báo TypeScript)
// @ts-ignore
if (typeof window !== "undefined") {
    // @ts-ignore
    window.products = products;
    // @ts-ignore
    window.renderProducts = renderProducts;
}

// @ts-ignore
if (typeof module !== "undefined" && module.exports) {
    module.exports = { products, renderProducts };
}
