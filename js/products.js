/*
 * =====================================================
 * BAKEMATE - DỮ LIỆU SẢN PHẨM CHUNG
 * Số lượng: 45 sản phẩm chuẩn hóa (3 danh mục chính + nhóm phụ Mega Menu)
 * =====================================================
 */

const baseProducts = [
    {
        "id": 1,
        "name": "Bột mì Baker's Choice số 8",
        "price": 52000,
        "oldPrice": 64000,
        "category": "Nguyên liệu",
        "subCategories": [
            "Bột và nguyên liệu khô"
        ],
        "brand": "Baker's Choice",
        "packagingLabel": "Gói 1kg",
        "stockStatus": "in_stock",
        "isNew": false,
        "onSale": true,
        "featured": true,
        "image": "images/products/bot-mi-baker-s-choice-so-8-1.webp",
        "description": "Bột mì số 8 có hàm lượng protein thấp (8-9%), thích hợp làm bánh bông lan, cupcake, muffin và các loại bánh mềm xốp."
    },
    {
        "id": 2,
        "name": "Bột mì Baker's Choice số 11",
        "price": 45000,
        "oldPrice": 54000,
        "category": "Nguyên liệu",
        "subCategories": [
            "Bột và nguyên liệu khô"
        ],
        "brand": "Baker's Choice",
        "packagingLabel": "Gói 1kg",
        "stockStatus": "in_stock",
        "isNew": false,
        "onSale": true,
        "featured": true,
        "image": "images/products/bot-mi-baker-s-choice-so-11-1.webp",
        "description": "Bột mì số 11 giàu protein phù hợp làm bánh mì hoa cúc, baguette và các loại bánh cần kết cấu dai, đàn hồi."
    },
    {
        "id": 3,
        "name": "Bột mì đa dụng Meizan",
        "price": 32000,
        "oldPrice": 40000,
        "category": "Nguyên liệu",
        "subCategories": [
            "Bột và nguyên liệu khô"
        ],
        "brand": "Meizan",
        "packagingLabel": "Gói 1kg",
        "stockStatus": "in_stock",
        "isNew": false,
        "onSale": true,
        "featured": true,
        "image": "images/products/bot-mi-meizan-1.jpg",
        "description": "Bột mì đa dụng tiện lợi có thể sử dụng linh hoạt cho bánh quy bơ, muffin, pancake và chế biến thực phẩm."
    },
    {
        "id": 4,
        "name": "Bột cacao nguyên chất Hershey's",
        "price": 65000,
        "oldPrice": 78000,
        "category": "Nguyên liệu",
        "subCategories": [
            "Chocolate và tạo vị"
        ],
        "brand": "Hershey's",
        "packagingLabel": "Hộp 100g",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": true,
        "image": "images/products/bot-cacao-nguyen-chat-hershey-s-1.jpg",
        "description": "Bột cacao nguyên chất không đường dùng tạo hương vị chocolate đậm đà cho brownie, bánh quy và mousse."
    },
    {
        "id": 5,
        "name": "Bột Matcha",
        "price": 75000,
        "oldPrice": 90000,
        "category": "Nguyên liệu",
        "subCategories": [
            "Chocolate và tạo vị"
        ],
        "brand": "365 Whole Foods Market",
        "packagingLabel": "Gói 100g",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": true,
        "image": "images/products/bot-matcha-1.webp",
        "description": "Bột matcha trà xanh nghiền mịn dùng làm cupcake, chiffon, tiramisu và các món tráng miệng chuẩn vị Nhật."
    },
    {
        "id": 6,
        "name": "Whipping Cream Anchor",
        "price": 45000,
        "oldPrice": 54000,
        "category": "Nguyên liệu",
        "subCategories": [
            "Bơ, sữa và kem"
        ],
        "brand": "Anchor",
        "packagingLabel": "Hộp 250ml",
        "stockStatus": "in_stock",
        "isNew": false,
        "onSale": true,
        "featured": false,
        "image": "images/products/whipping-cream-anchor-1.jpg",
        "description": "Kem tươi béo mịn 35.1% dùng để đánh bông, chà láng trang trí bánh kem, làm mousse và panna cotta.",
        "isPerishable": true
    },
    {
        "id": 7,
        "name": "Cân điện tử nhà bếp",
        "price": 120000,
        "oldPrice": 120000,
        "category": "Dụng cụ",
        "subCategories": [
            "Dụng cụ cân, đong"
        ],
        "brand": "BakeMate",
        "packagingLabel": "Mẫu 5kg / 1g",
        "stockStatus": "in_stock",
        "isNew": false,
        "onSale": false,
        "featured": true,
        "image": "images/products/can-dien-tu-1.jpg",
        "description": "Cân điện tử độ chia 1g hỗ trợ cân đo chính xác bột, đường, bơ và định lượng chuẩn theo từng công thức bánh."
    },
    {
        "id": 8,
        "name": "Ca đong nguyên liệu",
        "price": 45000,
        "oldPrice": 45000,
        "category": "Dụng cụ",
        "subCategories": [
            "Dụng cụ cân, đong"
        ],
        "brand": "BakeMate",
        "packagingLabel": "Ca 500ml",
        "stockStatus": "in_stock",
        "isNew": false,
        "onSale": false,
        "featured": false,
        "image": "images/products/ca-dong-nguyen-lieu-1.webp",
        "description": "Ca đong nhựa nguyên sinh có vạch chia ml và cup rõ nét giúp đo lường nước, sữa và nguyên liệu lỏng."
    },
    {
        "id": 9,
        "name": "Thìa đong định lượng",
        "price": 35000,
        "oldPrice": 35000,
        "category": "Dụng cụ",
        "subCategories": [
            "Dụng cụ cân, đong"
        ],
        "brand": "BakeMate",
        "packagingLabel": "Bộ 5 thìa",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": false,
        "featured": false,
        "image": "images/products/thia-dong-dinh-luong-1.webp",
        "description": "Bộ 5 thìa đong tsp/tbsp hỗ trợ định lượng chuẩn các nguyên liệu nhỏ như bột nở, baking soda, muối và vani."
    },
    {
        "id": 10,
        "name": "Nhiệt kế điện tử nhà bếp",
        "price": 95000,
        "oldPrice": 115000,
        "category": "Dụng cụ",
        "subCategories": [
            "Dụng cụ cân, đong"
        ],
        "brand": "BakeMate",
        "packagingLabel": "Đầu dò tiêu chuẩn",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/nhiet-ke-dien-tu-nha-bep-1.webp",
        "description": "Nhiệt kế đầu dò inox hỗ trợ kiểm tra nhiệt độ đường thắng caramel, nước kích men nở và socola đun chảy."
    },
    {
        "id": 11,
        "name": "Túi bắt kem dùng một lần",
        "price": 25000,
        "oldPrice": 25000,
        "category": "Phụ kiện & Đóng gói",
        "subCategories": [
            "Dụng cụ trang trí",
            "Trang trí bánh"
        ],
        "brand": "BakeMate",
        "packagingLabel": "Túi 50 cái",
        "stockStatus": "in_stock",
        "isNew": false,
        "onSale": false,
        "featured": false,
        "image": "images/products/tui-bat-kem-dung-mot-lan-1.webp",
        "description": "Túi bắt kem nhựa PE dày vân nhám chống trượt hỗ trợ tạo hình su kem, trang trí bánh kem và cupcake."
    },
    {
        "id": 12,
        "name": "Bơ lạt Anchor",
        "price": 68000,
        "oldPrice": 82000,
        "category": "Nguyên liệu",
        "subCategories": [
            "Bơ, sữa và kem"
        ],
        "brand": "Anchor",
        "packagingLabel": "Khối chuẩn",
        "stockStatus": "in_stock",
        "isNew": false,
        "onSale": true,
        "featured": true,
        "image": "images/products/bo-lat-anchor-1.jpg",
        "description": "Bơ lạt nhập khẩu New Zealand làm từ sữa bò tươi tự nhiên, mang lại hương thơm béo ngậy cho bánh quy và bánh mì hoa cúc.",
        "isPerishable": true
    },
    {
        "id": 13,
        "name": "Đường tinh luyện Biên Hòa",
        "price": 28000,
        "oldPrice": 28000,
        "category": "Nguyên liệu",
        "subCategories": [
            "Bột và nguyên liệu khô"
        ],
        "brand": "Biên Hòa",
        "packagingLabel": "Túi 1kg",
        "stockStatus": "in_stock",
        "isNew": false,
        "onSale": false,
        "featured": false,
        "image": "images/products/duong-tinh-luyen-bien-hoa-1.jpg",
        "description": "Đường cát trắng tinh luyện hạt mịn dễ tan khi đánh cùng trứng và bơ, phù hợp cho mọi loại bánh ngọt."
    },
    {
        "id": 14,
        "name": "Bột làm bánh Tartar",
        "price": 48000,
        "oldPrice": 58000,
        "category": "Nguyên liệu",
        "subCategories": [
            "Nguyên liệu tạo cấu trúc"
        ],
        "brand": "Baker's Choice",
        "packagingLabel": "Hộp 100g",
        "stockStatus": "in_stock",
        "isNew": false,
        "onSale": true,
        "featured": false,
        "image": "images/products/bot-lam-banh-tartar-1.webp",
        "description": "Bột ổn định lòng trắng trứng giúp bọt khí bền vững khi đánh bông làm bánh bông lan chiffon và meringue."
    },
    {
        "id": 15,
        "name": "Trứng gà",
        "price": 34000,
        "oldPrice": 34000,
        "category": "Nguyên liệu",
        "subCategories": [
            "Nguyên liệu tạo cấu trúc"
        ],
        "brand": "BakeMate Fresh",
        "packagingLabel": "Vỉ 10 quả",
        "stockStatus": "in_stock",
        "isNew": false,
        "onSale": false,
        "featured": false,
        "image": "images/products/trung-ga-1.jpg",
        "description": "Vỉ 10 trứng gà tươi chọn lọc kích cỡ đồng đều (55-60g/quả), lòng đỏ sánh đậm giúp bánh lên màu vàng ươm.",
        "isPerishable": true
    },
    {
        "id": 16,
        "name": "Phới lồng đánh trứng Inox",
        "price": 42000,
        "oldPrice": 52000,
        "category": "Dụng cụ",
        "subCategories": [
            "Dụng cụ trộn"
        ],
        "brand": "BakeMate",
        "packagingLabel": "Cỡ 25cm",
        "stockStatus": "in_stock",
        "isNew": false,
        "onSale": true,
        "featured": false,
        "image": "images/products/phoi-long-danh-trung-inox-1.jpg",
        "description": "Phới lồng thép không gỉ tay cầm gỗ chắc chắn giúp đánh bông lòng đỏ, trộn đều hỗn hợp bột và sốt kem mịn mượt."
    },
    {
        "id": 17,
        "name": "Khuôn bánh bông lan tròn chống dính",
        "price": 115000,
        "oldPrice": 140000,
        "category": "Dụng cụ",
        "subCategories": [
            "Khuôn bánh",
            "Đế và khay bánh"
        ],
        "brand": "BakeMate",
        "packagingLabel": "Đường kính 20cm",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": true,
        "image": "images/products/khuon-banh-tron-1.jpg",
        "description": "Khuôn đế rời đường kính 20cm truyền nhiệt đều và phủ chống dính an toàn, giúp tách bánh bông lan dễ dàng."
    },
    {
        "id": 18,
        "name": "Giấy nến nướng bánh chống dính",
        "price": 29000,
        "oldPrice": 29000,
        "category": "Phụ kiện & Đóng gói",
        "subCategories": [
            "Đế và khay bánh"
        ],
        "brand": "BakeMate",
        "packagingLabel": "Cuộn 5m × 30cm",
        "stockStatus": "in_stock",
        "isNew": false,
        "onSale": false,
        "featured": false,
        "image": "images/products/giay-nen-1.jpg",
        "description": "Giấy nến phủ silicone chống dính 2 mặt chịu nhiệt tới 230°C, giúp lót khay nướng cookie và khuôn bánh sạch sẽ."
    },
    {
        "id": 19,
        "name": "Cup giấy nướng bánh Cupcake",
        "price": 24000,
        "oldPrice": 24000,
        "category": "Phụ kiện & Đóng gói",
        "subCategories": [
            "Đế và khay bánh",
            "Trang trí bánh"
        ],
        "brand": "BakeMate",
        "packagingLabel": "Lốc 50 cup",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": false,
        "featured": false,
        "image": "images/products/cup-giay-1.jpg",
        "description": "Bộ 50 cup giấy xếp ly dày dặn chống thấm dầu, giữ phom bánh cupcake và muffin đứng đẹp trong lò nướng."
    },
    {
        "id": 20,
        "name": "Bộ đui bắt kem Inox",
        "price": 65000,
        "oldPrice": 79000,
        "category": "Phụ kiện & Đóng gói",
        "subCategories": [
            "Dụng cụ trang trí",
            "Trang trí bánh"
        ],
        "brand": "BakeMate",
        "packagingLabel": "Bộ 12 đui + khớp nối",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/bo-dui-bat-kem-inox-1.webp",
        "description": "Bộ 12 đui tạo hình sao, hoa hồng, lá, viền sò bằng inox 304 liền khối kèm khớp nối tiện lợi cho trang trí bánh."
    },
    {
        "id": 21,
        "name": "Hộp giấy đựng bánh kem có quai xách",
        "price": 38000,
        "oldPrice": 38000,
        "category": "Phụ kiện & Đóng gói",
        "subCategories": [
            "Hộp và túi đựng bánh"
        ],
        "brand": "BakeMate",
        "packagingLabel": "Set 2 hộp (25×25×18cm)",
        "stockStatus": "in_stock",
        "isNew": false,
        "onSale": false,
        "featured": false,
        "image": "images/products/hop-dung-banh-1.jpg",
        "description": "Hộp đựng bánh kích thước 25x25x18cm có quai xách chắc chắn và cửa sổ mica trong suốt sang trọng để mang biếu tặng."
    },
    {
        "id": 24,
        "name": "Sữa Tươi Tiệt Trùng Không Đường Vinamilk 100%",
        "price": 34000,
        "oldPrice": 39000,
        "category": "Nguyên liệu",
        "subCategories": [
            "Bơ, sữa và kem"
        ],
        "brand": "Vinamilk",
        "packagingLabel": "Hộp 1 Lít",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": true,
        "image": "images/products/sua-tuoi-vinamilk-1.webp",
        "description": "Sữa tươi tiệt trùng 100% nguyên chất không đường Vinamilk giàu dưỡng chất, giúp cốt bánh mềm ẩm, thơm béo tự nhiên cho bông lan, pudding và flan.",
        "isPerishable": true
    },
    {
        "id": 25,
        "name": "Lá Gelatine Ewald Bronze",
        "price": 45000,
        "oldPrice": 55000,
        "category": "Nguyên liệu",
        "subCategories": [
            "Nguyên liệu tạo cấu trúc"
        ],
        "brand": "Ewald",
        "packagingLabel": "Gói chiết lẻ 100g",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/la-gelatine-ewald-bronze-1.jpg",
        "description": "Lá Gelatine Ewald Bronze nhập khẩu Đức độ Bloom 135-155 chuẩn, giúp tạo đông mịn mượt không tách nước cho Mousse, Panna Cotta và Cheesecake lạnh."
    },
    {
        "id": 26,
        "name": "Baking Soda",
        "price": 32000,
        "oldPrice": 38000,
        "category": "Nguyên liệu",
        "subCategories": [
            "Nguyên liệu tạo cấu trúc"
        ],
        "brand": "Arm & Hammer",
        "packagingLabel": "Hộp 226g",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/baking-soda-1.webp",
        "description": "Baking Soda (Muối nở) tinh khiết Arm & Hammer giúp bánh quy giòn xốp, muffin nở đều và cân bằng độ chua trong công thức có cacao/buttermilk."
    },
    {
        "id": 27,
        "name": "Men nở",
        "price": 5000,
        "oldPrice": 7000,
        "category": "Nguyên liệu",
        "subCategories": [
            "Nguyên liệu tạo cấu trúc"
        ],
        "brand": "Mauripan",
        "packagingLabel": "Gói lẻ 10g",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": true,
        "image": "images/products/men-no-1.webp",
        "description": "Men nở khô ngọt Mauripan hoạt tính mạnh, phù hợp kích nở bột bánh mì hoa cúc, bánh mì ngọt và bánh bao cực kỳ ổn định."
    },
    {
        "id": 28,
        "name": "Máy Đánh Trứng Cầm Tay Philips HR3705",
        "price": 690000,
        "oldPrice": 850000,
        "category": "Dụng cụ",
        "subCategories": [
            "Dụng cụ trộn"
        ],
        "brand": "Philips",
        "packagingLabel": "Nguyên bộ",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": true,
        "image": "images/products/may-danh-trung-cam-tay-philips-hr3705-1.jpg",
        "description": "Máy đánh trứng cầm tay Philips HR3705 công suất 300W với 5 tốc độ + Turbo, que đánh thép không gỉ hình nón giúp đánh bông trứng & kem nhanh gấp đôi."
    },
    {
        "id": 29,
        "name": "Tô Trộn Inox",
        "price": 35000,
        "oldPrice": 45000,
        "category": "Dụng cụ",
        "subCategories": [
            "Dụng cụ trộn"
        ],
        "brand": "Sanneng",
        "packagingLabel": "Tô đơn lẻ size 22cm",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/to-tron-inox-1.jpg",
        "description": "Âu / Tô trộn Inox dày dặn không gỉ sét, lòng sâu chống văng khi đánh kem và đánh trứng bằng máy cầm tay, dễ vệ sinh."
    },
    {
        "id": 30,
        "name": "Rây Bột",
        "price": 28000,
        "oldPrice": 35000,
        "category": "Dụng cụ",
        "subCategories": [
            "Dụng cụ trộn"
        ],
        "brand": "Sanneng",
        "packagingLabel": "Size 16cm",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/ray-bot-1.jpg",
        "description": "Rây bột lưới mịn inox Sanneng giúp lọc tơi bột mì, cacao, matcha và đường bột hoàn toàn không vón cục trước khi fold bánh."
    },
    {
        "id": 31,
        "name": "Khuôn Nướng Cupcake & Muffin",
        "price": 85000,
        "oldPrice": 110000,
        "category": "Dụng cụ",
        "subCategories": [
            "Khuôn bánh"
        ],
        "brand": "Sanneng",
        "packagingLabel": "Khay 6 lỗ chuẩn",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": true,
        "image": "images/products/khuon-nuong-cupcake-muffin-6-lo-chong-dinh-1.jpg",
        "description": "Khay khuôn nướng cupcake và muffin thép carbon phủ chống dính 2 mặt giúp truyền nhiệt đồng đều, bánh nở đứng phom không dính đáy."
    },
    {
        "id": 32,
        "name": "Khuôn Silicon",
        "price": 45000,
        "oldPrice": 58000,
        "category": "Dụng cụ",
        "subCategories": [
            "Khuôn bánh"
        ],
        "brand": "Silikomart",
        "packagingLabel": "5 ô",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/khuon-silicon-1.jpg",
        "description": "Khuôn silicon thực phẩm dẻo cao cấp Silikomart chịu nhiệt -40°C đến 230°C, hoàn hảo cho bánh mousse, thạch rau câu và socola tạo hình."
    },
    {
        "id": 33,
        "name": "Bàn Xoay Bánh Kem",
        "price": 75000,
        "oldPrice": 95000,
        "category": "Dụng cụ",
        "subCategories": [
            "Dụng cụ trang trí"
        ],
        "brand": "Sanneng",
        "packagingLabel": "Đường kính 27.5cm",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/ban-xoay-banh-1.jpg",
        "description": "Bàn xoay chà láng bánh kem ổ bi xoay 360 độ êm mượt chống rung lắc, có vạch chia đường kính tiện căn tâm ổ bánh."
    },
    {
        "id": 34,
        "name": "Hộp Đựng Cupcake",
        "price": 8000,
        "oldPrice": 13000,
        "category": "Phụ kiện & Đóng gói",
        "subCategories": [
            "Hộp và túi đựng bánh"
        ],
        "brand": "Sanneng",
        "packagingLabel": "Hộp 1 bánh",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/hop-cupcake-1.jpg",
        "description": "Hộp giấy đựng cupcake kèm khay giữ đế cố định và mặt kính mica trong suốt giúp bảo vệ lớp kem bắt bông khi di chuyển."
    },
    {
        "id": 35,
        "name": "Túi Giấy Kraft Đựng Bánh",
        "price": 6000,
        "oldPrice": 8000,
        "category": "Phụ kiện & Đóng gói",
        "subCategories": [
            "Hộp và túi đựng bánh"
        ],
        "brand": "Sanneng",
        "packagingLabel": "Size S",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/tui-giay-kraft-dung-banh-1.jpg",
        "description": "Túi giấy Kraft nâu thân thiện môi trường, đáy vuông đứng vững sang trọng chuyên đựng bánh mì hoa cúc, cookie và hộp bánh tặng."
    },
    {
        "id": 36,
        "name": "Túi Zip Đựng Bánh",
        "price": 3000,
        "oldPrice": 4000,
        "category": "Phụ kiện & Đóng gói",
        "subCategories": [
            "Hộp và túi đựng bánh"
        ],
        "brand": "Sanneng",
        "packagingLabel": "Size trung bình đa năng",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/tui-zip-1.jpg",
        "description": "Túi zip khóa kéo kín hơi chống ẩm cực tốt cho bánh quy bơ, granola và nguyên liệu khô chiết lẻ."
    },
    {
        "id": 37,
        "name": "Đế Bánh Kem",
        "price": 4000,
        "oldPrice": 6000,
        "category": "Phụ kiện & Đóng gói",
        "subCategories": [
            "Đế và khay bánh"
        ],
        "brand": "Sanneng",
        "packagingLabel": "Đế tròn 20cm",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/de-banh-kem-1.jpg",
        "description": "Đế lót bánh kem carton cứng ép màng chống thấm dầu ẩm, chịu lực tốt giúp nâng đỡ và trưng bày bánh sinh nhật sang trọng."
    },
    {
        "id": 38,
        "name": "Khay Giấy Đựng Bánh Kèm Nắp Trong",
        "price": 8000,
        "oldPrice": 10000,
        "category": "Phụ kiện & Đóng gói",
        "subCategories": [
            "Đế và khay bánh"
        ],
        "brand": "Sanneng",
        "packagingLabel": "Size S",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/khay-giay-dung-banh-kem-nap-trong-1.jpg",
        "description": "Khay giấy chịu dầu kèm nắp nhựa PET trong suốt gài khít, lý tưởng đựng bánh bông lan cuộn, tiramisu và bánh mì hoa cúc."
    },
    {
        "id": 39,
        "name": "Khay Nhôm Nướng Bánh",
        "price": 65000,
        "oldPrice": 80000,
        "category": "Dụng cụ",
        "subCategories": [
            "Khuôn bánh"
        ],
        "brand": "Sanneng",
        "packagingLabel": "Khay thành thấp",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/khay-nhom-nuong-banh-1.jpg",
        "description": "Khay nhôm nguyên khối dẫn nhiệt cực nhanh và đều, chuyên nướng cookie bơ, bánh mì, su kem và bông lan cuộn."
    },
    {
        "id": 40,
        "name": "Đế Lót Bánh Mousse",
        "price": 2000,
        "oldPrice": 3000,
        "category": "Phụ kiện & Đóng gói",
        "subCategories": [
            "Đế và khay bánh"
        ],
        "brand": "Sanneng",
        "packagingLabel": "Đế mousse mini tròn 5cm",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/de-lot-banh-mousse-1.jpg",
        "description": "Đế giấy cứng phủ bạc/vàng sang trọng có tai cầm tiện nhấc bánh mousse, tiramisu mini và cheesecake ra khỏi hộp."
    },
    {
        "id": 41,
        "name": "Nến Sinh Nhật",
        "price": 5000,
        "oldPrice": 7000,
        "category": "Phụ kiện & Đóng gói",
        "subCategories": [
            "Trang trí bánh"
        ],
        "brand": "Sanneng",
        "packagingLabel": "Nến số 0-9",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/nen-sinh-nhat-1.jpg",
        "description": "Nến sinh nhật sáp thực vật an toàn ít khói với nhiều mẫu thời thượng: nến số, nến xoắn pastel, nến dài thanh mảnh và nến kim tuyến."
    },
    {
        "id": 42,
        "name": "Topper Trang Trí Bánh Sinh Nhật",
        "price": 10000,
        "oldPrice": 14000,
        "category": "Phụ kiện & Đóng gói",
        "subCategories": [
            "Trang trí bánh"
        ],
        "brand": "Sanneng",
        "packagingLabel": "Topper Happy Birthday",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/topper-trang-tri-banh-sinh-nhat-1.jpg",
        "description": "Phụ kiện que cắm topper trang trí bánh sinh nhật chất liệu acrylic sáng bóng và giấy ép kim sắc nét, tạo điểm nhấn nổi bật cho chiếc bánh."
    },
    {
        "id": 43,
        "name": "Sticker Niêm Phong",
        "price": 2000,
        "oldPrice": 3000,
        "category": "Phụ kiện & Đóng gói",
        "subCategories": [
            "Trang trí bánh"
        ],
        "brand": "Sanneng",
        "packagingLabel": "Cuộn tiêu chuẩn",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/sticker-niem-phong-1.png",
        "description": "Tem dán niêm phong hộp bánh và túi bánh handmade sắc nét keo bám chắc, tạo sự chỉn chu chuyên nghiệp cho quà tặng."
    },
    {
        "id": 44,
        "name": "Ruy Băng",
        "price": 5000,
        "oldPrice": 7000,
        "category": "Phụ kiện & Đóng gói",
        "subCategories": [
            "Trang trí bánh"
        ],
        "brand": "Sanneng",
        "packagingLabel": "Cuộn 1m",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/ruy-bang-1.jpg",
        "description": "Dây ruy băng lụa satin cao cấp bản đẹp giúp thắt nơ hộp bánh kem, hộp cookie biếu tặng cực kỳ tinh tế."
    },
    {
        "id": 45,
        "name": "Hũ Nhựa Đựng Thực Phẩm",
        "price": 5000,
        "oldPrice": 7000,
        "category": "Phụ kiện & Đóng gói",
        "subCategories": [
            "Hộp và túi đựng bánh"
        ],
        "brand": "Sanneng",
        "packagingLabel": "Size S",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/hu-nhua-dung-thuc-pham-1.jpg",
        "description": "Hũ nhựa PET trong suốt nắp vặn kín khí đạt chuẩn an toàn thực phẩm, lý tưởng đựng bánh quy, tiramisu, bông lan trứng muối và hạt khô."
    },
    {
        "id": 46,
        "name": "Lọ Thủy Tinh Đựng Thực Phẩm",
        "price": 12000,
        "oldPrice": 16000,
        "category": "Phụ kiện & Đóng gói",
        "subCategories": [
            "Hộp và túi đựng bánh"
        ],
        "brand": "Sanneng",
        "packagingLabel": "Size S",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/lo-thuy-tinh-dung-thuc-pham-1.jpg",
        "description": "Lọ thủy tinh dày chịu nhiệt nắp thiếc/gỗ kín hơi chuyên đựng sữa chua, panna cotta, pudding nướng và bảo quản nguyên liệu bột khô."
    },
    {
        "id": 47,
        "name": "Kẹp Miệng Túi Thực Phẩm",
        "price": 3000,
        "oldPrice": 5000,
        "category": "Phụ kiện & Đóng gói",
        "subCategories": [
            "Hộp và túi đựng bánh"
        ],
        "brand": "Sanneng",
        "packagingLabel": "Cái tiêu chuẩn 11cm",
        "stockStatus": "in_stock",
        "isNew": true,
        "onSale": true,
        "featured": false,
        "image": "images/products/kep-mieng-tui-thuc-pham-1.jpg",
        "description": "Thanh kẹp miệng túi nhựa PP chắc chắn giúp khóa kín các túi bột mì, đường, hạt và túi bánh ăn dở không bị ẩm."
    }
];

const PRODUCTS_OVERRIDE_KEY = "bakemate_products_override";

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

const PERISHABLE_PRODUCT_IDS = [6, 12, 15, 24];

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

if (typeof module !== "undefined" && module.exports) {
    module.exports = products;
}