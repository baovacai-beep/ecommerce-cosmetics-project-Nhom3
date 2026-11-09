// Dữ liệu gốc được tách từ product-detail.html; giữ nguyên các thuộc tính.
window.productsData = {
      "bot-bap": {
        shortName: "Bột bắp",
        fullName: "Bột bắp Taky Food Cao Cấp (Cornstarch)",
        brand: "Taky Food",
        origin: "Việt Nam",
        images: [
          "images/product-1.jpg"
          // Bạn có thể thêm ảnh tiếp theo vào đây, ví dụ: "images/product-1-back.jpg"
        ],
        rating: "4.9",
        reviews: "142",
        sold: "1.8k",
        basePrice: "12.000₫",
        oldPrice: "15.000₫",
        saveText: "Tiết kiệm 3.000₫",
        discountBadge: "-20%",
        stock: "180",
        unit: "gói",
        options: [
          { label: "Gói 150g - 12.000₫", price: "12.000₫", old: "15.000₫", save: "Tiết kiệm 3.000₫" },
          { label: "Gói 500g - 32.000₫", price: "32.000₫", old: "40.000₫", save: "Tiết kiệm 8.000₫" }
        ],
        specs: [
          { k: "Thương hiệu", v: "Taky Food (Tài Ký)" },
          { k: "Thành phần", v: "100% tinh bột bắp nguyên chất chọn lọc, không biến đổi gen" },
          { k: "Độ ẩm tối đa", v: "Dưới 13.5% (bột trắng mịn màng, tơi xốp, không vón cục)" },
          { k: "Ứng dụng phù hợp", v: "Làm mềm xốp bánh bông lan, bánh Chiffon, tạo độ sánh mịn cho nhân kem su kem, pudding, sốt custard" },
          { k: "Quy cách bảo quản", v: "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng mặt trời. Buộc kín miệng túi sau mỗi lần sử dụng." }
        ],
        recipes: [
          { title: "Bánh Bông Lan Chiffon Mềm Tan", time: "50 phút", usage: "30g Bột bắp Taky", diff: "Dễ", img: "images/about-baking.jpg" },
          { title: "Nhân Kem Custard Su Kem Béo Ngậy", time: "30 phút", usage: "25g Bột bắp Taky", diff: "Dễ", img: "images/about-young-bakers.jpg" },
          { title: "Bánh Quy Bơ Thơm Giòn Tan", time: "45 phút", usage: "40g Bột bắp Taky", diff: "Vừa", img: "images/banner.jpg" }
        ],
        related: [
          { name: "Bột mì Meizan Cao Cấp", price: "27.000₫", img: "images/product-2.jpg", hash: "#bot-mi" },
          { name: "Sữa tươi Vinamilk 100%", price: "41.000₫", img: "images/product-8.jpg", hash: "#bot-sua-tuoi" },
          { name: "Đường Biên Hòa Pure", price: "39.000₫", img: "images/product-6.jpg", hash: "#bot-duong" }
        ]
      },
      "bot-mi": {
        shortName: "Bột mì",
        fullName: "Bột mì Meizan Đa Dụng Cao Cấp (All-Purpose Flour)",
        brand: "MEIZAN",
        origin: "Việt Nam",
        images: [
          "images/product-2.jpg",
          // Muốn thêm ảnh cho Bột mì Meizan, bạn chỉ cần bỏ ảnh vào thư mục images/ và thêm đường dẫn vào đây:
          "images/product-2-back.jpg",
          "images/product-2-details.jpg"
        ],
        rating: "4.9",
        reviews: "215",
        sold: "2.8k",
        basePrice: "27.000₫",
        oldPrice: "34.000₫",
        saveText: "Tiết kiệm 7.000₫",
        discountBadge: "-21%",
        stock: "150",
        unit: "gói",
        options: [
          { label: "Gói 500g - 27.000₫", price: "27.000₫", old: "34.000₫", save: "Tiết kiệm 7.000₫" },
          { label: "Gói 1kg - 48.000₫", price: "48.000₫", old: "60.000₫", save: "Tiết kiệm 12.000₫" }
        ],
        specs: [
          { k: "Thương hiệu", v: "MEIZAN (Tập đoàn FFM Berhad & Wilmar)" },
          { k: "Hàm lượng Protein", v: "9.5% – 11.5% (Đạt độ đàn hồi dẻo dai chuẩn đa dụng cao cấp)" },
          { k: "Thành phần", v: "100% lúa mì hảo hạng nhập khẩu, bổ sung vi chất sắt và kẽm" },
          { k: "Ứng dụng phù hợp", v: "Bánh bông lan, bánh quy bơ, bánh muffin, pancake, bánh bao, há cảo và mì sợi tươi" },
          { k: "Quy cách bảo quản", v: "Bảo quản nơi khô ráo, sạch sẽ, thoáng mát, tránh để gần hóa chất hay nơi có mùi nồng." }
        ],
        recipes: [
          { title: "Bánh Mì Hoa Cúc Thơm Lừng Bơ Sữa", time: "90 phút", usage: "260g Bột mì Meizan", diff: "Vừa", img: "images/about-young-bakers.jpg" },
          { title: "Bánh Muffin Chocolate Hạnh Nhân", time: "40 phút", usage: "150g Bột mì Meizan", diff: "Dễ", img: "images/banner.jpg" },
          { title: "Bánh Pancake Mật Ong Cho Bữa Sáng", time: "25 phút", usage: "120g Bột mì Meizan", diff: "Dễ", img: "images/about-baking.jpg" }
        ],
        related: [
          { name: "Bột vani Vianco Bướm", price: "6.600₫", img: "images/product-4.jpg", hash: "#bot-vani" },
          { name: "Trứng gà tươi sạch", price: "28.000₫", img: "images/product-9.jpg", hash: "#bot-trung" },
          { name: "Bột Tartar Baker's Choice", price: "17.000₫", img: "images/product-3.jpg", hash: "#bot-tartar" }
        ]
      },
      "bot-tartar": {
        shortName: "Bột Tartar",
        fullName: "Bột Tartar Baker's Choice Ổn Định Lòng Trắng Trứng",
        brand: "Baker's Choice",
        origin: "Việt Nam",
        images: [
          "images/product-3.jpg"
        ],
        rating: "4.8",
        reviews: "96",
        sold: "850",
        basePrice: "17.000₫",
        oldPrice: "22.000₫",
        saveText: "Tiết kiệm 5.000₫",
        discountBadge: "-23%",
        stock: "95",
        unit: "hũ",
        options: [
          { label: "Hũ 45g - 17.000₫", price: "17.000₫", old: "22.000₫", save: "Tiết kiệm 5.000₫" },
          { label: "Hũ 100g - 32.000₫", price: "32.000₫", old: "40.000₫", save: "Tiết kiệm 8.000₫" }
        ],
        specs: [
          { k: "Thương hiệu", v: "Baker's Choice (Cream of Tartar)" },
          { k: "Thành phần", v: "Potassium Hydrogen Tartrate (E336i) 100% tinh khiết đạt chuẩn thực phẩm" },
          { k: "Công dụng chính", v: "Tạo môi trường axit nhẹ giúp bọt khí lòng trắng trứng bền vững, chống xẹp bánh khi nướng, làm trắng mịn ruột bánh" },
          { k: "Ứng dụng phù hợp", v: "Bánh bông lan Chiffon, Macaron, Meringue kẹo đường, Souffle, Angel Food Cake" },
          { k: "Quy cách bảo quản", v: "Vặn chặt nắp sau khi mở. Bảo quản nơi khô ráo, tránh nhiệt độ cao và độ ẩm cao." }
        ],
        recipes: [
          { title: "Bánh Bông Lan Chiffon Phô Mai", time: "60 phút", usage: "2g Bột Tartar", diff: "Vừa", img: "images/about-young-bakers.jpg" },
          { title: "Bánh Meringue Kẹo Đường Xốp", time: "70 phút", usage: "1.5g Bột Tartar", diff: "Dễ", img: "images/banner.jpg" },
          { title: "Bánh Macaron Kiểu Pháp Vỏ Mịn", time: "90 phút", usage: "2g Bột Tartar", diff: "Khó", img: "images/about-baking.jpg" }
        ],
        related: [
          { name: "Trứng gà tươi sạch", price: "28.000₫", img: "images/product-9.jpg", hash: "#bot-trung" },
          { name: "Đường Biên Hòa Pure", price: "39.000₫", img: "images/product-6.jpg", hash: "#bot-duong" },
          { name: "Bột mì Meizan Cao Cấp", price: "27.000₫", img: "images/product-2.jpg", hash: "#bot-mi" }
        ]
      },
      "bot-vani": {
        shortName: "Bột vani",
        fullName: "Bột Vani Vianco Hiệu Bướm Bướm Thơm Lừng",
        brand: "Vianco",
        origin: "Việt Nam",
        images: [
          "images/product-4.jpg"
        ],
        rating: "4.9",
        reviews: "180",
        sold: "3.2k",
        basePrice: "6.600₫",
        oldPrice: "8.500₫",
        saveText: "Tiết kiệm 1.900₫",
        discountBadge: "-22%",
        stock: "350",
        unit: "lốc",
        options: [
          { label: "Lốc 10 gói (5g/gói) - 6.600₫", price: "6.600₫", old: "8.500₫", save: "Tiết kiệm 1.900₫" },
          { label: "Hộp 50g tiện lợi - 25.000₫", price: "25.000₫", old: "30.000₫", save: "Tiết kiệm 5.000₫" }
        ],
        specs: [
          { k: "Thương hiệu", v: "Vianco (Hiệu Bướm Bướm - Hãng gia vị truyền thống từ 1958)" },
          { k: "Thành phần", v: "Vanillin tổng hợp nguyên chất 100%, đường dextrose" },
          { k: "Đặc điểm mùi vị", v: "Mùi vani ngọt ngào quyến rũ, khử tanh trứng cực tốt, giữ hương thơm bền sau khi nướng nhiệt cao" },
          { k: "Ứng dụng phù hợp", v: "Bánh bông lan, bánh flan caramel, chè khúc bạch, kem lạnh, bánh quy bơ" },
          { k: "Quy cách bảo quản", v: "Để nơi khô ráo, thoáng mát, bọc kín sau khi dùng để tránh bay hương." }
        ],
        recipes: [
          { title: "Bánh Flan Caramen Mềm Mịn", time: "40 phút", usage: "1 gói Vani Vianco", diff: "Dễ", img: "images/about-baking.jpg" },
          { title: "Bánh Bông Lan Vani Nướng Nồi Cơm", time: "45 phút", usage: "1 gói Vani Vianco", diff: "Dễ", img: "images/about-young-bakers.jpg" },
          { title: "Kem Custard Trứng Sữa Thơm Lừng", time: "30 phút", usage: "1 gói Vani Vianco", diff: "Dễ", img: "images/banner.jpg" }
        ],
        related: [
          { name: "Sữa tươi Vinamilk 100%", price: "41.000₫", img: "images/product-8.jpg", hash: "#bot-sua-tuoi" },
          { name: "Trứng gà tươi sạch", price: "28.000₫", img: "images/product-9.jpg", hash: "#bot-trung" },
          { name: "Bột mì Meizan Cao Cấp", price: "27.000₫", img: "images/product-2.jpg", hash: "#bot-mi" }
        ]
      },
      "dau-an": {
        shortName: "Dầu ăn",
        fullName: "Dầu Ăn Tường An Cooking Oil Chuyên Dụng Làm Bánh",
        brand: "Tường An",
        origin: "Việt Nam",
        images: [
          "images/product-5.jpg"
        ],
        rating: "4.9",
        reviews: "110",
        sold: "940",
        basePrice: "54.000₫",
        oldPrice: "65.000₫",
        saveText: "Tiết kiệm 11.000₫",
        discountBadge: "-17%",
        stock: "120",
        unit: "chai",
        options: [
          { label: "Chai 1 Lít - 54.000₫", price: "54.000₫", old: "65.000₫", save: "Tiết kiệm 11.000₫" },
          { label: "Can 2 Lít - 102.000₫", price: "102.000₫", old: "120.000₫", save: "Tiết kiệm 18.000₫" }
        ],
        specs: [
          { k: "Thương hiệu", v: "Tường An (Cooking Oil Đỏ)" },
          { k: "Thành phần", v: "Dầu olein cọ tinh luyện, dầu đậu nành, dầu hạt cải, Vitamin A" },
          { k: "Đặc điểm làm bánh", v: "Màu dầu sáng trong, mùi vị thanh dịu không nồng ngấy, giúp bánh xốp ẩm lâu ngày không bị khô cứng khi trữ lạnh" },
          { k: "Ứng dụng phù hợp", v: "Bánh bông lan cuộn, bánh chiffon, bánh chuối nướng, bánh mì hoa cúc, quét chống dính khuôn nướng" },
          { k: "Quy cách bảo quản", v: "Bảo quản nơi thoáng mát, tránh ánh nắng trực tiếp, đậy kín nắp sau khi rót." }
        ],
        recipes: [
          { title: "Bánh Bông Lan Cuộn Mứt Dâu", time: "45 phút", usage: "40ml Dầu Tường An", diff: "Vừa", img: "images/about-young-bakers.jpg" },
          { title: "Bánh Bông Lan Đài Loan Mềm Ẩm", time: "55 phút", usage: "50ml Dầu Tường An", diff: "Vừa", img: "images/banner.jpg" },
          { title: "Bánh Chuối Nướng Thơm Lừng", time: "50 phút", usage: "30ml Dầu Tường An", diff: "Dễ", img: "images/about-baking.jpg" }
        ],
        related: [
          { name: "Bột mì Meizan Cao Cấp", price: "27.000₫", img: "images/product-2.jpg", hash: "#bot-mi" },
          { name: "Bột bắp Taky Food", price: "12.000₫", img: "images/product-1.jpg", hash: "#bot-bap" },
          { name: "Trứng gà tươi sạch", price: "28.000₫", img: "images/product-9.jpg", hash: "#bot-trung" }
        ]
      },
      "bot-duong": {
        shortName: "Đường",
        fullName: "Đường Tinh Luyện Biên Hòa Pure (Pure Sugar)",
        brand: "Biên Hòa Pure",
        origin: "Việt Nam",
        images: [
          "images/product-6.jpg"
        ],
        rating: "5.0",
        reviews: "320",
        sold: "4.1k",
        basePrice: "39.000₫",
        oldPrice: "46.000₫",
        saveText: "Tiết kiệm 7.000₫",
        discountBadge: "-15%",
        stock: "260",
        unit: "gói",
        options: [
          { label: "Gói 1kg - 39.000₫", price: "39.000₫", old: "46.000₫", save: "Tiết kiệm 7.000₫" },
          { label: "Túi 500g - 21.000₫", price: "21.000₫", old: "25.000₫", save: "Tiết kiệm 4.000₫" }
        ],
        specs: [
          { k: "Thương hiệu", v: "Đường Biên Hòa (TTC Sugar)" },
          { k: "Thành phần", v: "100% đường mía tinh luyện cao cấp tự nhiên, độ tinh khiết > 99.8%" },
          { k: "Đặc tính hạt đường", v: "Hạt đường trắng trong óng ánh, kích thước hạt đều, tan cực nhanh trong bột và bơ sữa" },
          { k: "Ứng dụng phù hợp", v: "Cốt bánh sinh nhật gato, bánh quy bơ, nấu caramen flan, siro hoa quả, kem whipping" },
          { k: "Quy cách bảo quản", v: "Đựng trong hộp kín nắp hoặc hũ thủy tinh, để nơi khô ráo, tránh kiến và côn trùng." }
        ],
        recipes: [
          { title: "Cốt Bánh Gato Sinh Nhật Chuẩn Xốp", time: "50 phút", usage: "80g Đường Biên Hòa", diff: "Vừa", img: "images/banner.jpg" },
          { title: "Bánh Quy Bơ Danisa Giòn Rụm", time: "40 phút", usage: "60g Đường Biên Hòa", diff: "Dễ", img: "images/about-baking.jpg" },
          { title: "Bánh Mousse Dâu Tây Thanh Mát", time: "60 phút", usage: "50g Đường Biên Hòa", diff: "Vừa", img: "images/about-young-bakers.jpg" }
        ],
        related: [
          { name: "Bột mì Meizan Cao Cấp", price: "27.000₫", img: "images/product-2.jpg", hash: "#bot-mi" },
          { name: "Sữa tươi Vinamilk 100%", price: "41.000₫", img: "images/product-8.jpg", hash: "#bot-sua-tuoi" },
          { name: "Bột Tartar Baker's Choice", price: "17.000₫", img: "images/product-3.jpg", hash: "#bot-tartar" }
        ]
      },
      "bot-muoi": {
        shortName: "Muối",
        fullName: "Muối I-ốt Bạc Liêu Basalco Hạt Mịn Làm Bánh",
        brand: "Basalco",
        origin: "Việt Nam",
        images: [
          "images/product-7.jpg"
        ],
        rating: "4.9",
        reviews: "85",
        sold: "1.1k",
        basePrice: "7.000₫",
        oldPrice: "9.000₫",
        saveText: "Tiết kiệm 2.000₫",
        discountBadge: "-22%",
        stock: "300",
        unit: "gói",
        options: [
          { label: "Gói 500g - 7.000₫", price: "7.000₫", old: "9.000₫", save: "Tiết kiệm 2.000₫" },
          { label: "Gói 1kg - 12.000₫", price: "12.000₫", old: "15.000₫", save: "Tiết kiệm 3.000₫" }
        ],
        specs: [
          { k: "Thương hiệu", v: "Basalco (Muối Bạc Liêu nổi tiếng)" },
          { k: "Thành phần", v: "Muối biển Bạc Liêu sấy sạch tự nhiên (NaCl ≥ 97%), bổ sung hàm lượng vi chất I-ốt an toàn" },
          { k: "Vai trò trong làm bánh", v: "Cân bằng vị ngọt, làm nổi bật mùi bơ sữa, củng cố sợi gluten giúp bột bánh mì dẻo dai hơn" },
          { k: "Ứng dụng phù hợp", v: "Bánh mì Baguette, bánh bông lan trứng muối, sốt caramel muối biển, bánh quy mặn" },
          { k: "Quy cách bảo quản", v: "Để nơi khô ráo, tránh ẩm ướt, đậy kín sau khi mở bao bì." }
        ],
        recipes: [
          { title: "Bánh Bông Lan Trứng Muối Chà Bông", time: "60 phút", usage: "2g Muối Basalco", diff: "Vừa", img: "images/about-young-bakers.jpg" },
          { title: "Sốt Caramel Muối Mặn Béo", time: "20 phút", usage: "3g Muối Basalco", diff: "Dễ", img: "images/banner.jpg" },
          { title: "Bánh Mì Baguette Vỏ Giòn Rụm", time: "80 phút", usage: "5g Muối Basalco", diff: "Vừa", img: "images/about-baking.jpg" }
        ],
        related: [
          { name: "Bột mì Meizan Cao Cấp", price: "27.000₫", img: "images/product-2.jpg", hash: "#bot-mi" },
          { name: "Dầu ăn Tường An", price: "54.000₫", img: "images/product-5.jpg", hash: "#dau-an" },
          { name: "Đường Biên Hòa Pure", price: "39.000₫", img: "images/product-6.jpg", hash: "#bot-duong" }
        ]
      },
      "bot-sua-tuoi": {
        shortName: "Sữa tươi",
        fullName: "Sữa Tươi Tiệt Trùng Vinamilk 100% Không Đường",
        brand: "Vinamilk",
        origin: "Việt Nam",
        images: [
          "images/product-8.jpg"
        ],
        rating: "5.0",
        reviews: "290",
        sold: "3.5k",
        basePrice: "41.000₫",
        oldPrice: "48.000₫",
        saveText: "Tiết kiệm 7.000₫",
        discountBadge: "-15%",
        stock: "140",
        unit: "hộp",
        options: [
          { label: "Hộp 1 Lít - 41.000₫", price: "41.000₫", old: "48.000₫", save: "Tiết kiệm 7.000₫" },
          { label: "Lốc 4 hộp 180ml - 34.000₫", price: "34.000₫", old: "39.000₫", save: "Tiết kiệm 5.000₫" }
        ],
        specs: [
          { k: "Thương hiệu", v: "Vinamilk 100% Sữa Tươi Tiệt Trùng" },
          { k: "Thành phần", v: "100% sữa bò tươi nguyên chất tiệt trùng, không chất bảo quản, không đường" },
          { k: "Đặc điểm hương vị", v: "Vị thanh ngậy tự nhiên, thơm mát, bổ sung canxi và khoáng chất cho cấu trúc bánh" },
          { k: "Công dụng làm bánh", v: "Cung cấp độ ẩm mịn, làm bánh xốp mềm và tạo mùi thơm đặc trưng của bơ sữa" },
          { k: "Quy cách bảo quản", v: "Bảo quản nơi khô ráo thoáng mát. Sau khi mở nắp hộp 1L bắt buộc bảo quản lạnh (2 - 4°C) và dùng trong 3 ngày." }
        ],
        recipes: [
          { title: "Bánh Mì Ngọt Hokkaido Xé Sợi", time: "90 phút", usage: "150ml Sữa Vinamilk", diff: "Vừa", img: "images/about-baking.jpg" },
          { title: "Bánh Flan Trứng Sữa Caramen", time: "45 phút", usage: "500ml Sữa Vinamilk", diff: "Dễ", img: "images/about-young-bakers.jpg" },
          { title: "Bánh Crepe Ngàn Lớp Vani Sữa", time: "60 phút", usage: "400ml Sữa Vinamilk", diff: "Vừa", img: "images/banner.jpg" }
        ],
        related: [
          { name: "Bột mì Meizan Cao Cấp", price: "27.000₫", img: "images/product-2.jpg", hash: "#bot-mi" },
          { name: "Trứng gà tươi sạch", price: "28.000₫", img: "images/product-9.jpg", hash: "#bot-trung" },
          { name: "Bột vani Vianco Bướm", price: "6.600₫", img: "images/product-4.jpg", hash: "#bot-vani" }
        ]
      },
      "bot-trung": {
        shortName: "Trứng",
        fullName: "Trứng Gà Tươi Sạch Khay 10 Quả Tiệt Trùng",
        brand: "Ba Huân / Nông Trại Sạch",
        origin: "Việt Nam",
        images: [
          "images/product-9.jpg"
        ],
        rating: "4.9",
        reviews: "195",
        sold: "2.4k",
        basePrice: "28.000₫",
        oldPrice: "35.000₫",
        saveText: "Tiết kiệm 7.000₫",
        discountBadge: "-20%",
        stock: "110",
        unit: "vỉ",
        options: [
          { label: "Vỉ 10 quả - 28.000₫", price: "28.000₫", old: "35.000₫", save: "Tiết kiệm 7.000₫" },
          { label: "Vỉ 6 quả - 18.000₫", price: "18.000₫", old: "22.000₫", save: "Tiết kiệm 4.000₫" }
        ],
        specs: [
          { k: "Thương hiệu", v: "Nông Trại Trứng Gà Sạch Ba Huân / V.Food" },
          { k: "Quy chuẩn chất lượng", v: "Trứng gà tươi mới loại 1 (trọng lượng đều 60g - 65g/quả), tiệt trùng tia UV khử khuẩn vỏ" },
          { k: "Vai trò trong làm bánh", v: "Lòng trắng đánh bông tạo độ phồng nở; lòng đỏ tạo màu vàng ươm óng ả và độ béo ngậy đặc trưng" },
          { k: "Ứng dụng phù hợp", v: "Cốt bánh Gato, Chiffon, Su kem, Tart trứng, bánh bông lan cuộn, bánh mì hoa cúc" },
          { k: "Quy cách bảo quản", v: "Bảo quản trong ngăn mát tủ lạnh (4 - 8°C) để giữ lòng trắng đậm đặc dễ đánh bông nhất. Hạn dùng 30 ngày." }
        ],
        recipes: [
          { title: "Bánh Gato Sinh Nhật Trứng Sữa", time: "60 phút", usage: "4 quả Trứng gà tươi", diff: "Vừa", img: "images/banner.jpg" },
          { title: "Bánh Tart Trứng Kiểu Hồng Kông", time: "45 phút", usage: "3 quả Trứng gà tươi", diff: "Dễ", img: "images/about-baking.jpg" },
          { title: "Bánh Su Kem Vỏ Giòn Craquelin", time: "50 phút", usage: "3 quả Trứng gà tươi", diff: "Vừa", img: "images/about-young-bakers.jpg" }
        ],
        related: [
          { name: "Bột mì Meizan Cao Cấp", price: "27.000₫", img: "images/product-2.jpg", hash: "#bot-mi" },
          { name: "Bột Tartar Baker's Choice", price: "17.000₫", img: "images/product-3.jpg", hash: "#bot-tartar" },
          { name: "Đường Biên Hòa Pure", price: "39.000₫", img: "images/product-6.jpg", hash: "#bot-duong" }
        ]
      }
    };
