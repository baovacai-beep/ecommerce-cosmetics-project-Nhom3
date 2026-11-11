/*
 * =====================================================
 * BAKEMATE - DỮ LIỆU SẢN PHẨM CHUNG
 * Người phụ trách: Bảo Ngọc
 * Số lượng: 21 sản phẩm chuẩn hóa (3 danh mục)
 *
 * Cấu trúc dữ liệu thống nhất:
 * id, name, price, category, image, description
 * Danh mục chuẩn: "Nguyên liệu", "Dụng cụ", "Phụ kiện & Đóng gói"
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
        description: "Bột mì số 8 có hàm lượng protein thấp (8-9%), thích hợp làm bánh bông lan, cupcake, muffin và các loại bánh mềm xốp."
    },

    // 2. Bột mì Baker's Choice số 11
    {
        id: 2,
        name: "Bột mì Baker's Choice số 11",
        price: 45000,
        category: "Nguyên liệu",
        image: "images/products/bot-mi-so-11-1.jpg",
        description: "Bột mì số 11 giàu protein phù hợp làm bánh mì hoa cúc, baguette và các loại bánh cần kết cấu dai, đàn hồi."
    },

    // 3. Bột mì đa dụng Meizan
    {
        id: 3,
        name: "Bột mì đa dụng Meizan",
        price: 32000,
        category: "Nguyên liệu",
        image: "images/products/bot-mi-meizan-1.jpg",
        description: "Bột mì đa dụng tiện lợi có thể sử dụng linh hoạt cho bánh quy bơ, muffin, pancake và chế biến thực phẩm."
    },

    // 4. Bột cacao nguyên chất Hershey's
    {
        id: 4,
        name: "Bột cacao nguyên chất Hershey's",
        price: 65000,
        category: "Nguyên liệu",
        image: "images/products/bot-cacao-hershey-1.jpg",
        description: "Bột cacao nguyên chất không đường dùng tạo hương vị chocolate đậm đà cho brownie, bánh quy và mousse."
    },

    // 5. Bột Matcha làm bánh
    {
        id: 5,
        name: "Bột Matcha làm bánh",
        price: 75000,
        category: "Nguyên liệu",
        image: "images/products/matcha-lam-banh-1.jpg",
        description: "Bột matcha trà xanh nghiền mịn dùng làm cupcake, chiffon, tiramisu và các món tráng miệng chuẩn vị Nhật."
    },

    // 6. Whipping Cream Anchor
    {
        id: 6,
        name: "Whipping Cream Anchor",
        price: 45000,
        category: "Nguyên liệu",
        image: "images/products/whipping-cream-1.jpg",
        description: "Kem tươi béo mịn 35.1% dùng để đánh bông, chà láng trang trí bánh kem, làm mousse và panna cotta."
    },

    // 7. Cân điện tử nhà bếp
    {
        id: 7,
        name: "Cân điện tử nhà bếp",
        price: 120000,
        category: "Dụng cụ",
        image: "images/products/can-dien-tu-1.jpg",
        description: "Cân điện tử độ chia 1g hỗ trợ cân đo chính xác bột, đường, bơ và định lượng chuẩn theo từng công thức bánh."
    },

    // 8. Ca đong nguyên liệu
    {
        id: 8,
        name: "Ca đong nguyên liệu",
        price: 45000,
        category: "Dụng cụ",
        image: "images/products/ca-dong-1.jpg",
        description: "Ca đong nhựa nguyên sinh có vạch chia ml và cup rõ nét giúp đo lường nước, sữa và nguyên liệu lỏng."
    },

    // 9. Thìa đong định lượng
    {
        id: 9,
        name: "Thìa đong định lượng",
        price: 35000,
        category: "Dụng cụ",
        image: "images/products/thia-dong-1.jpg",
        description: "Bộ 5 thìa đong tsp/tbsp hỗ trợ định lượng chuẩn các nguyên liệu nhỏ như bột nở, baking soda, muối và vani."
    },

    // 10. Nhiệt kế điện tử nhà bếp
    {
        id: 10,
        name: "Nhiệt kế điện tử nhà bếp",
        price: 95000,
        category: "Dụng cụ",
        image: "images/products/nhiet-ke-1.jpg",
        description: "Nhiệt kế đầu dò inox hỗ trợ kiểm tra nhiệt độ đường thắng caramel, nước kích men nở và socola đun chảy."
    },

    // 11. Túi bắt kem dùng một lần
    {
        id: 11,
        name: "Túi bắt kem dùng một lần",
        price: 25000,
        category: "Phụ kiện & Đóng gói",
        image: "images/products/tui-bat-kem-1.jpg",
        description: "Túi bắt kem nhựa PE dày vân nhám chống trượt hỗ trợ tạo hình su kem, trang trí bánh kem và cupcake."
    },

    // 12. Bơ lạt Anchor (227g)
    {
        id: 12,
        name: "Bơ lạt Anchor (227g)",
        price: 68000,
        category: "Nguyên liệu",
        image: "images/products/bo-lat-anchor-1.jpg",
        description: "Bơ lạt nhập khẩu New Zealand làm từ sữa bò tươi tự nhiên, mang lại hương thơm béo ngậy cho bánh quy và bánh mì hoa cúc."
    },

    // 13. Đường tinh luyện Biên Hòa (1kg)
    {
        id: 13,
        name: "Đường tinh luyện Biên Hòa (1kg)",
        price: 28000,
        category: "Nguyên liệu",
        image: "images/products/duong-tinh-luyen-1.jpg",
        description: "Đường cát trắng tinh luyện hạt mịn dễ tan khi đánh cùng trứng và bơ, phù hợp cho mọi loại bánh ngọt."
    },

    // 14. Cream of Tartar Baker's (100g)
    {
        id: 14,
        name: "Cream of Tartar Baker's (100g)",
        price: 48000,
        category: "Nguyên liệu",
        image: "images/products/cream-of-tartar-1.jpg",
        description: "Bột ổn định lòng trắng trứng giúp bọt khí bền vững khi đánh bông làm bánh bông lan chiffon và meringue."
    },

    // 15. Trứng gà tươi chuẩn vị (Vỉ 10 quả)
    {
        id: 15,
        name: "Trứng gà tươi chuẩn vị (Vỉ 10 quả)",
        price: 34000,
        category: "Nguyên liệu",
        image: "images/products/trung-ga-tuoi-1.jpg",
        description: "Vỉ 10 trứng gà tươi chọn lọc kích cỡ đồng đều (55-60g/quả), lòng đỏ sánh đậm giúp bánh lên màu vàng ươm."
    },

    // 16. Phới lồng đánh trứng Inox
    {
        id: 16,
        name: "Phới lồng đánh trứng Inox",
        price: 42000,
        category: "Dụng cụ",
        image: "images/products/phoi-long-1.jpg",
        description: "Phới lồng thép không gỉ tay cầm gỗ chắc chắn giúp đánh bông lòng đỏ, trộn đều hỗn hợp bột và sốt kem mịn mượt."
    },

    // 17. Khuôn bánh bông lan tròn chống dính (20cm)
    {
        id: 17,
        name: "Khuôn bánh bông lan tròn chống dính (20cm)",
        price: 115000,
        category: "Dụng cụ",
        image: "images/products/khuon-banh-tron-1.jpg",
        description: "Khuôn đế rời đường kính 20cm truyền nhiệt đều và phủ chống dính an toàn, giúp tách bánh bông lan dễ dàng."
    },

    // 18. Giấy nến nướng bánh chống dính (Cuộn 5m)
    {
        id: 18,
        name: "Giấy nến nướng bánh chống dính (Cuộn 5m)",
        price: 29000,
        category: "Phụ kiện & Đóng gói",
        image: "images/products/giay-nen-1.jpg",
        description: "Giấy nến phủ silicone chống dính 2 mặt chịu nhiệt tới 230°C, giúp lót khay nướng cookie và khuôn bánh sạch sẽ."
    },

    // 19. Cup giấy nướng bánh Cupcake (50 cái)
    {
        id: 19,
        name: "Cup giấy nướng bánh Cupcake (50 cái)",
        price: 24000,
        category: "Phụ kiện & Đóng gói",
        image: "images/products/cup-giay-1.jpg",
        description: "Bộ 50 cup giấy xếp ly dày dặn chống thấm dầu, giữ phom bánh cupcake và muffin đứng đẹp trong lò nướng."
    },

    // 20. Bộ đui bắt kem Inox 12 đầu
    {
        id: 20,
        name: "Bộ đui bắt kem Inox 12 đầu",
        price: 65000,
        category: "Phụ kiện & Đóng gói",
        image: "images/products/bo-dui-bat-kem-1.jpg",
        description: "Bộ 12 đui tạo hình sao, hoa hồng, lá, viền sò bằng inox 304 liền khối kèm khớp nối tiện lợi cho trang trí bánh."
    },

    // 21. Hộp giấy đựng bánh kem có quai xách
    {
        id: 21,
        name: "Hộp giấy đựng bánh kem có quai xách",
        price: 38000,
        category: "Phụ kiện & Đóng gói",
        image: "images/products/hop-dung-banh-1.jpg",
        description: "Hộp đựng bánh kích thước 25x25x18cm có quai xách chắc chắn và cửa sổ mica trong suốt sang trọng để mang biếu tặng."
    }
];

// Gắn vào window để các script trình duyệt sử dụng ổn định
if (typeof window !== "undefined") {
    window.products = products;
}

// Hỗ trợ nạp module trong môi trường Node.js khi kiểm thử
if (typeof module !== "undefined" && module.exports) {
    module.exports = products;
}
