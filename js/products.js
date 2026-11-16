/*
 * =====================================================
 * BAKEMATE - DỮ LIỆU SẢN PHẨM CHUNG
 * Người phụ trách: Bảo Ngọc
 * Số lượng: 23 sản phẩm chuẩn hóa (3 danh mục chính + nhóm phụ Mega Menu)
 *
 * Cấu trúc dữ liệu cốt lõi thống nhất (Buổi 3):
 * id, name, price, category, image, description
 * Mở rộng cho Bộ lọc nâng cao & Quản trị (F03, F14, F16):
 * brand, subCategories, packagingLabel, oldPrice, stockStatus, isNew, onSale, featured, hidden
 * =====================================================
 */

const baseProducts = [
    // 1. Bột mì Baker's Choice số 8
    {
        id: 1,
        name: "Bột mì Baker's Choice số 8",
        price: 52000,
        oldPrice: 64000,
        category: "Nguyên liệu",
        subCategories: ["Bột và nguyên liệu khô"],
        brand: "Baker's Choice",
        packagingLabel: "Gói 1kg",
        stockStatus: "in_stock",
        isNew: false,
        onSale: true,
        featured: true,
        image: "images/products/bot-mi-so-8-1.jpg",
        description: "Bột mì số 8 có hàm lượng protein thấp (8-9%), thích hợp làm bánh bông lan, cupcake, muffin và các loại bánh mềm xốp."
    },

    // 2. Bột mì Baker's Choice số 11
    {
        id: 2,
        name: "Bột mì Baker's Choice số 11",
        price: 45000,
        oldPrice: 54000,
        category: "Nguyên liệu",
        subCategories: ["Bột và nguyên liệu khô"],
        brand: "Baker's Choice",
        packagingLabel: "Gói 1kg",
        stockStatus: "in_stock",
        isNew: false,
        onSale: true,
        featured: true,
        image: "images/products/bot-mi-so-11-1.jpg",
        description: "Bột mì số 11 giàu protein phù hợp làm bánh mì hoa cúc, baguette và các loại bánh cần kết cấu dai, đàn hồi."
    },

    // 3. Bột mì đa dụng Meizan
    {
        id: 3,
        name: "Bột mì đa dụng Meizan",
        price: 32000,
        oldPrice: 40000,
        category: "Nguyên liệu",
        subCategories: ["Bột và nguyên liệu khô"],
        brand: "Meizan",
        packagingLabel: "Gói 1kg",
        stockStatus: "in_stock",
        isNew: false,
        onSale: true,
        featured: true,
        image: "images/products/bot-mi-meizan-1.jpg",
        description: "Bột mì đa dụng tiện lợi có thể sử dụng linh hoạt cho bánh quy bơ, muffin, pancake và chế biến thực phẩm."
    },

    // 4. Bột cacao nguyên chất Hershey's
    {
        id: 4,
        name: "Bột cacao nguyên chất Hershey's",
        price: 65000,
        oldPrice: 78000,
        category: "Nguyên liệu",
        subCategories: ["Chocolate và tạo vị"],
        brand: "Hershey's",
        packagingLabel: "Hộp 100g",
        stockStatus: "in_stock",
        isNew: true,
        onSale: true,
        featured: true,
        image: "images/products/bot-cacao-hershey-1.jpg",
        description: "Bột cacao nguyên chất không đường dùng tạo hương vị chocolate đậm đà cho brownie, bánh quy và mousse."
    },

    // 5. Bột Matcha làm bánh
    {
        id: 5,
        name: "Bột Matcha làm bánh",
        price: 75000,
        oldPrice: 90000,
        category: "Nguyên liệu",
        subCategories: ["Chocolate và tạo vị"],
        brand: "Izumi",
        packagingLabel: "Gói 100g",
        stockStatus: "in_stock",
        isNew: true,
        onSale: true,
        featured: true,
        image: "images/products/matcha-lam-banh-1.jpg",
        description: "Bột matcha trà xanh nghiền mịn dùng làm cupcake, chiffon, tiramisu và các món tráng miệng chuẩn vị Nhật."
    },

    // 6. Whipping Cream Anchor
    {
        id: 6,
        name: "Whipping Cream Anchor",
        price: 45000,
        oldPrice: 54000,
        category: "Nguyên liệu",
        subCategories: ["Bơ, sữa và kem"],
        brand: "Anchor",
        packagingLabel: "Hộp 250ml",
        stockStatus: "in_stock",
        isNew: false,
        onSale: true,
        featured: false,
        isPerishable: true,
        image: "images/products/whipping-cream-1.jpg",
        description: "Kem tươi béo mịn 35.1% dùng để đánh bông, chà láng trang trí bánh kem, làm mousse và panna cotta."
    },

    // 7. Cân điện tử nhà bếp
    {
        id: 7,
        name: "Cân điện tử nhà bếp",
        price: 120000,
        oldPrice: 120000,
        category: "Dụng cụ",
        subCategories: ["Dụng cụ cân, đong"],
        brand: "BakeMate",
        packagingLabel: "Mẫu 5kg / 1g",
        stockStatus: "in_stock",
        isNew: false,
        onSale: false,
        featured: true,
        image: "images/products/can-dien-tu-1.jpg",
        description: "Cân điện tử độ chia 1g hỗ trợ cân đo chính xác bột, đường, bơ và định lượng chuẩn theo từng công thức bánh."
    },

    // 8. Ca đong nguyên liệu
    {
        id: 8,
        name: "Ca đong nguyên liệu",
        price: 45000,
        oldPrice: 45000,
        category: "Dụng cụ",
        subCategories: ["Dụng cụ cân, đong"],
        brand: "BakeMate",
        packagingLabel: "Ca 500ml",
        stockStatus: "in_stock",
        isNew: false,
        onSale: false,
        featured: false,
        image: "images/products/ca-dong-1.jpg",
        description: "Ca đong nhựa nguyên sinh có vạch chia ml và cup rõ nét giúp đo lường nước, sữa và nguyên liệu lỏng."
    },

    // 9. Thìa đong định lượng
    {
        id: 9,
        name: "Thìa đong định lượng",
        price: 35000,
        oldPrice: 35000,
        category: "Dụng cụ",
        subCategories: ["Dụng cụ cân, đong"],
        brand: "BakeMate",
        packagingLabel: "Bộ 5 thìa",
        stockStatus: "in_stock",
        isNew: true,
        onSale: false,
        featured: false,
        image: "images/products/thia-dong-1.jpg",
        description: "Bộ 5 thìa đong tsp/tbsp hỗ trợ định lượng chuẩn các nguyên liệu nhỏ như bột nở, baking soda, muối và vani."
    },

    // 10. Nhiệt kế điện tử nhà bếp
    {
        id: 10,
        name: "Nhiệt kế điện tử nhà bếp",
        price: 95000,
        oldPrice: 115000,
        category: "Dụng cụ",
        subCategories: ["Dụng cụ cân, đong"],
        brand: "BakeMate",
        packagingLabel: "Đầu dò tiêu chuẩn",
        stockStatus: "in_stock",
        isNew: true,
        onSale: true,
        featured: false,
        image: "images/products/nhiet-ke-1.jpg",
        description: "Nhiệt kế đầu dò inox hỗ trợ kiểm tra nhiệt độ đường thắng caramel, nước kích men nở và socola đun chảy."
    },

    // 11. Túi bắt kem dùng một lần
    {
        id: 11,
        name: "Túi bắt kem dùng một lần",
        price: 25000,
        oldPrice: 25000,
        category: "Phụ kiện & Đóng gói",
        subCategories: ["Hộp và túi đựng bánh", "Trang trí bánh", "Dụng cụ trang trí"],
        brand: "BakeMate",
        packagingLabel: "Túi 50 cái",
        stockStatus: "in_stock",
        isNew: false,
        onSale: false,
        featured: false,
        image: "images/products/tui-bat-kem-1.jpg",
        description: "Túi bắt kem nhựa PE dày vân nhám chống trượt hỗ trợ tạo hình su kem, trang trí bánh kem và cupcake."
    },

    // 12. Bơ lạt Anchor (227g)
    {
        id: 12,
        name: "Bơ lạt Anchor (227g)",
        price: 68000,
        oldPrice: 82000,
        category: "Nguyên liệu",
        subCategories: ["Bơ, sữa và kem"],
        brand: "Anchor",
        packagingLabel: "Khối 227g",
        stockStatus: "in_stock",
        isNew: false,
        onSale: true,
        featured: true,
        isPerishable: true,
        image: "images/products/bo-lat-anchor-1.jpg",
        description: "Bơ lạt nhập khẩu New Zealand làm từ sữa bò tươi tự nhiên, mang lại hương thơm béo ngậy cho bánh quy và bánh mì hoa cúc."
    },

    // 13. Đường tinh luyện Biên Hòa (1kg)
    {
        id: 13,
        name: "Đường tinh luyện Biên Hòa (1kg)",
        price: 28000,
        oldPrice: 28000,
        category: "Nguyên liệu",
        subCategories: ["Bột và nguyên liệu khô"],
        brand: "Biên Hòa",
        packagingLabel: "Túi 1kg",
        stockStatus: "in_stock",
        isNew: false,
        onSale: false,
        featured: false,
        image: "images/products/duong-tinh-luyen-1.jpg",
        description: "Đường cát trắng tinh luyện hạt mịn dễ tan khi đánh cùng trứng và bơ, phù hợp cho mọi loại bánh ngọt."
    },

    // 14. Cream of Tartar Baker's (100g)
    {
        id: 14,
        name: "Cream of Tartar Baker's (100g)",
        price: 48000,
        oldPrice: 58000,
        category: "Nguyên liệu",
        subCategories: ["Nguyên liệu tạo cấu trúc"],
        brand: "Baker's Choice",
        packagingLabel: "Hộp 100g",
        stockStatus: "in_stock",
        isNew: false,
        onSale: true,
        featured: false,
        image: "images/products/cream-of-tartar-1.jpg",
        description: "Bột ổn định lòng trắng trứng giúp bọt khí bền vững khi đánh bông làm bánh bông lan chiffon và meringue."
    },

    // 15. Trứng gà tươi chuẩn vị (Vỉ 10 quả)
    {
        id: 15,
        name: "Trứng gà tươi chuẩn vị (Vỉ 10 quả)",
        price: 34000,
        oldPrice: 34000,
        category: "Nguyên liệu",
        subCategories: ["Nguyên liệu tạo cấu trúc"],
        brand: "BakeMate Fresh",
        packagingLabel: "Vỉ 10 quả",
        stockStatus: "in_stock",
        isNew: false,
        onSale: false,
        featured: false,
        isPerishable: true,
        image: "images/products/trung-ga-tuoi-1.jpg",
        description: "Vỉ 10 trứng gà tươi chọn lọc kích cỡ đồng đều (55-60g/quả), lòng đỏ sánh đậm giúp bánh lên màu vàng ươm."
    },

    // 16. Phới lồng đánh trứng Inox
    {
        id: 16,
        name: "Phới lồng đánh trứng Inox",
        price: 42000,
        oldPrice: 52000,
        category: "Dụng cụ",
        subCategories: ["Dụng cụ trộn"],
        brand: "BakeMate",
        packagingLabel: "Cỡ 25cm",
        stockStatus: "in_stock",
        isNew: false,
        onSale: true,
        featured: false,
        image: "images/products/phoi-long-1.jpg",
        description: "Phới lồng thép không gỉ tay cầm gỗ chắc chắn giúp đánh bông lòng đỏ, trộn đều hỗn hợp bột và sốt kem mịn mượt."
    },

    // 17. Khuôn bánh bông lan tròn chống dính (20cm)
    {
        id: 17,
        name: "Khuôn bánh bông lan tròn chống dính (20cm)",
        price: 115000,
        oldPrice: 140000,
        category: "Dụng cụ",
        subCategories: ["Khuôn bánh", "Đế và khay bánh"],
        brand: "BakeMate",
        packagingLabel: "Đường kính 20cm",
        stockStatus: "in_stock",
        isNew: true,
        onSale: true,
        featured: true,
        image: "images/products/khuon-banh-tron-1.jpg",
        description: "Khuôn đế rời đường kính 20cm truyền nhiệt đều và phủ chống dính an toàn, giúp tách bánh bông lan dễ dàng."
    },

    // 18. Giấy nến nướng bánh chống dính (Cuộn 5m)
    {
        id: 18,
        name: "Giấy nến nướng bánh chống dính (Cuộn 5m)",
        price: 29000,
        oldPrice: 29000,
        category: "Phụ kiện & Đóng gói",
        subCategories: ["Đế và khay bánh", "Bảo quản nguyên liệu"],
        brand: "BakeMate",
        packagingLabel: "Cuộn 5m × 30cm",
        stockStatus: "in_stock",
        isNew: false,
        onSale: false,
        featured: false,
        image: "images/products/giay-nen-1.jpg",
        description: "Giấy nến phủ silicone chống dính 2 mặt chịu nhiệt tới 230°C, giúp lót khay nướng cookie và khuôn bánh sạch sẽ."
    },

    // 19. Cup giấy nướng bánh Cupcake (50 cái)
    {
        id: 19,
        name: "Cup giấy nướng bánh Cupcake (50 cái)",
        price: 24000,
        oldPrice: 24000,
        category: "Phụ kiện & Đóng gói",
        subCategories: ["Đế và khay bánh", "Trang trí bánh"],
        brand: "BakeMate",
        packagingLabel: "Lốc 50 cup",
        stockStatus: "in_stock",
        isNew: true,
        onSale: false,
        featured: false,
        image: "images/products/cup-giay-1.jpg",
        description: "Bộ 50 cup giấy xếp ly dày dặn chống thấm dầu, giữ phom bánh cupcake và muffin đứng đẹp trong lò nướng."
    },

    // 20. Bộ đui bắt kem Inox 12 đầu
    {
        id: 20,
        name: "Bộ đui bắt kem Inox 12 đầu",
        price: 65000,
        oldPrice: 79000,
        category: "Phụ kiện & Đóng gói",
        subCategories: ["Trang trí bánh", "Dụng cụ trang trí"],
        brand: "BakeMate",
        packagingLabel: "Bộ 12 đui + khớp nối",
        stockStatus: "in_stock",
        isNew: true,
        onSale: true,
        featured: false,
        image: "images/products/bo-dui-bat-kem-1.jpg",
        description: "Bộ 12 đui tạo hình sao, hoa hồng, lá, viền sò bằng inox 304 liền khối kèm khớp nối tiện lợi cho trang trí bánh."
    },

    // 21. Hộp giấy đựng bánh kem có quai xách
    {
        id: 21,
        name: "Hộp giấy đựng bánh kem có quai xách",
        price: 38000,
        oldPrice: 38000,
        category: "Phụ kiện & Đóng gói",
        subCategories: ["Hộp và túi đựng bánh", "Bảo quản nguyên liệu"],
        brand: "BakeMate",
        packagingLabel: "Set 2 hộp (25×25×18cm)",
        stockStatus: "in_stock",
        isNew: false,
        onSale: false,
        featured: false,
        image: "images/products/hop-dung-banh-1.jpg",
        description: "Hộp đựng bánh kích thước 25x25x18cm có quai xách chắc chắn và cửa sổ mica trong suốt sang trọng để mang biếu tặng."
    },

    // 22. Bộ khuôn bánh Tart vỏ sò chống dính (Sắp có hàng)
    {
        id: 22,
        name: "Bộ khuôn bánh Tart vỏ sò chống dính",
        price: 135000,
        oldPrice: 135000,
        category: "Dụng cụ",
        subCategories: ["Khuôn bánh", "Đế và khay bánh"],
        brand: "BakeMate",
        packagingLabel: "Bộ 6 khuôn mini",
        stockStatus: "coming_soon",
        isNew: true,
        onSale: false,
        featured: false,
        image: "images/categories/cat-tools.jpg",
        description: "Bộ 6 khuôn Tart mini phủ chống dính cao cấp giúp tạo hình vỏ bánh Tart giòn rụm, tách khuôn nhanh không vỡ viền."
    },

    // 23. Bột trộn sẵn Bánh Bông Lan Vani (Sắp có hàng)
    {
        id: 23,
        name: "Bột trộn sẵn Bánh Bông Lan Vani",
        price: 58000,
        oldPrice: 58000,
        category: "Nguyên liệu",
        subCategories: ["Bột và nguyên liệu khô", "Chocolate và tạo vị"],
        brand: "Baker's Choice",
        packagingLabel: "Gói 500g",
        stockStatus: "coming_soon",
        isNew: true,
        onSale: false,
        featured: false,
        image: "images/about-ingredients.jpg",
        description: "Bột trộn sẵn hương vani tự nhiên dành cho người bận rộn, chỉ cần thêm trứng và bơ để nướng cốt bông lan xốp mịn."
    }
];

const PRODUCTS_OVERRIDE_KEY = "bakemate_products_override";

/**
 * Gộp danh sách sản phẩm gốc với các chỉnh sửa/bổ sung từ Admin Dashboard (localStorage).
 */
function buildMergedProducts() {
    let customStore = { edited: {}, added: [], hiddenIds: [] };
    if (typeof window !== "undefined" && window.localStorage) {
        try {
            const raw = window.localStorage.getItem(PRODUCTS_OVERRIDE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === "object") {
                    customStore = {
                        edited: parsed.edited || {},
                        added: Array.isArray(parsed.added) ? parsed.added : [],
                        hiddenIds: Array.isArray(parsed.hiddenIds) ? parsed.hiddenIds.map(Number) : []
                    };
                }
            }
        } catch (error) {
            console.warn("Không thể đọc dữ liệu sản phẩm tùy chỉnh:", error);
        }
    }

    const merged = baseProducts
        .filter((item) => !customStore.hiddenIds.includes(Number(item.id)))
        .map((item) => {
            const patch = customStore.edited[String(item.id)];
            return patch ? Object.assign({}, item, patch) : Object.assign({}, item);
        });

    customStore.added.forEach((extra) => {
        if (extra && extra.id && !customStore.hiddenIds.includes(Number(extra.id))) {
            merged.push(Object.assign({}, extra));
        }
    });

    return merged;
}

let products = buildMergedProducts();

const PERISHABLE_PRODUCT_IDS = [6, 12, 15];

function isProductPerishable(productOrId) {
    if (!productOrId) return false;
    if (typeof productOrId === "object") {
        if (productOrId.isPerishable === true) return true;
        return PERISHABLE_PRODUCT_IDS.includes(Number(productOrId.id));
    }
    const id = Number(productOrId);
    const catalog = typeof window !== "undefined" && Array.isArray(window.products) ? window.products : baseProducts;
    const found = catalog.find((item) => Number(item.id) === id);
    if (found && found.isPerishable === true) return true;
    return PERISHABLE_PRODUCT_IDS.includes(id);
}

// Gắn vào window để các script trình duyệt sử dụng ổn định
if (typeof window !== "undefined") {
    window.BASE_PRODUCTS = baseProducts;
    window.PERISHABLE_PRODUCT_IDS = PERISHABLE_PRODUCT_IDS;
    window.isProductPerishable = isProductPerishable;
    window.PRODUCTS_OVERRIDE_KEY = PRODUCTS_OVERRIDE_KEY;
    window.buildMergedProducts = buildMergedProducts;
    window.refreshProductsCatalog = function () {
        products = buildMergedProducts();
        window.products = products;
        return products;
    };
    window.products = products;
}

// Hỗ trợ nạp module trong môi trường Node.js khi kiểm thử
if (typeof module !== "undefined" && module.exports) {
    module.exports = products;
}
