
/*
 * =====================================================
 * BAKEMATE - DỮ LIỆU SẢN PHẨM
 * Người phụ trách: Bảo Ngọc
 * Số lượng: 11 sản phẩm
 *
 * Cấu trúc dữ liệu thống nhất theo yêu cầu nhóm:
 * id, name, price, category, image, description
 * =====================================================
 */

const products = [
    // 1. Bột mì Baker's Choice số 8
    {
        id: 1,
        name: "Bột mì Baker's Choice số 8",
        price: 52000,
        category: "Nguyên liệu",
        image: "images/products/bot-mi-so-8-1.jpg",
        description: "Bột mì số 8 có hàm lượng protein thấp, thích hợp làm bánh bông lan, cupcake, muffin và các loại bánh mềm xốp."
    },

    // 2. Bột mì Baker's Choice số 11
    {
        id: 2,
        name: "Bột mì Baker's Choice số 11",
        price: 45000,
        category: "Nguyên liệu",
        image: "images/products/bot-mi-so-11-1.jpg",
        description: "Bột mì số 11 phù hợp làm bánh mì và các loại bánh cần độ dai, đàn hồi."
    },

    // 3. Bột mì đa dụng Meizan
    {
        id: 3,
        name: "Bột mì đa dụng Meizan",
        price: 32000,
        category: "Nguyên liệu",
        image: "images/products/bot-mi-meizan-1.jpg",
        description: "Bột mì đa dụng có thể sử dụng trong nhiều công thức làm bánh và chế biến thực phẩm."
    },

    // 4. Bột cacao nguyên chất Hershey's
    {
        id: 4,
        name: "Bột cacao nguyên chất Hershey's",
        price: 65000,
        category: "Nguyên liệu",
        image: "images/products/bot-cacao-hershey-1.jpg",
        description: "Bột cacao dùng tạo hương vị chocolate và màu sắc đặc trưng cho bánh brownie, bánh quy và các món tráng miệng."
    },

    // 5. Bột Matcha làm bánh
    {
        id: 5,
        name: "Bột Matcha làm bánh",
        price: 75000,
        category: "Nguyên liệu",
        image: "images/products/matcha-lam-banh-1.jpg",
        description: "Bột matcha dùng làm bánh cupcake, bánh quy và các món tráng miệng có hương vị trà xanh."
    },

    // 6. Whipping Cream
    {
        id: 6,
        name: "Whipping Cream",
        price: 45000,
        category: "Nguyên liệu",
        image: "images/products/whipping-cream-1.jpg",
        description: "Kem tươi dùng để đánh bông, trang trí bánh kem, làm mousse và các món tráng miệng."
    },

    // 7. Cân điện tử nhà bếp
    {
        id: 7,
        name: "Cân điện tử nhà bếp",
        price: 120000,
        category: "Dụng cụ",
        image: "images/products/can-dien-tu-1.jpg",
        description: "Cân điện tử hỗ trợ cân đo chính xác khối lượng bột, đường, bơ và các nguyên liệu làm bánh."
    },

    // 8. Ca đong nguyên liệu
    {
        id: 8,
        name: "Ca đong nguyên liệu",
        price: 45000,
        category: "Dụng cụ",
        image: "images/products/ca-dong-1.jpg",
        description: "Ca đong có vạch chia giúp đo lường lượng nước, sữa và các nguyên liệu dạng lỏng trong công thức."
    },

    // 9. Thìa đong định lượng
    {
        id: 9,
        name: "Thìa đong định lượng",
        price: 35000,
        category: "Dụng cụ",
        image: "images/products/thia-dong-1.jpg",
        description: "Bộ thìa đong hỗ trợ định lượng các nguyên liệu có khối lượng nhỏ như bột nở, muối và vani."
    },

    // 10. Nhiệt kế điện tử nhà bếp
    {
        id: 10,
        name: "Nhiệt kế điện tử nhà bếp",
        price: 95000,
        category: "Dụng cụ",
        image: "images/products/nhiet-ke-1.jpg",
        description: "Nhiệt kế điện tử hỗ trợ kiểm tra nhiệt độ nguyên liệu trong quá trình chế biến và làm bánh."
    },

    // 11. Túi bắt kem dùng một lần
    {
        id: 11,
        name: "Túi bắt kem dùng một lần",
        price: 25000,
        category: "Dụng cụ",
        image: "images/products/tui-bat-kem-1.jpg",
        description: "Túi bắt kem hỗ trợ tạo hình và trang trí bánh kem, cupcake cùng nhiều loại bánh khác."
    }
];

// Cho phép các trang HTML sử dụng dữ liệu sản phẩm
if (typeof window !== "undefined") {
    window.products = products;
}

// Hỗ trợ sử dụng dữ liệu trong Node.js
if (typeof module !== "undefined" && module.exports) {
    module.exports = products;
}
