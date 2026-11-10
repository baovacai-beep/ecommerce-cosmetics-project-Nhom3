// =========================================================
// BAKEMATE - ĐỌC DỮ LIỆU TỪ URL VÀ ĐỔ VÀO TRANG CHI TIẾT
// Tệp: js/product-detail.js
// Kết hợp đầy đủ giao diện Buổi 2 (Gallery đa ảnh, Giá ưu đãi,
// Quy cách đóng gói, Bảng thông số, Recipe Cross-link UVP, Mini Cards)
// với dữ liệu chuẩn 6 trường (js/products.js) và giỏ hàng (js/storage.js).
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
    const FALLBACK_IMG = window.FALLBACK_PRODUCT_IMAGE || "images/logo.jpg";
    const MAX_QTY = 99;

    // Hàm escape HTML tránh lỗi ký tự đặc biệt khi render chuỗi
    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function formatPrice(value) {
        return typeof window.formatCurrency === "function"
            ? window.formatCurrency(value)
            : Number(value).toLocaleString("vi-VN") + " ₫";
    }

    // 1. Dữ liệu bổ sung giao diện cho 11 sản phẩm theo đúng tài liệu Buổi 2
    // (Lưu ý: ảnh phụ #2, #3 đang tận dụng ảnh có sẵn trong images/; có thể thay bằng ảnh riêng bất cứ lúc nào)
    const PRODUCT_DETAIL_META = {
        1: {
            shortName: "Bột mì số 8",
            brand: "Baker's Choice",
            origin: "Việt Nam",
            rating: "4.8",
            reviews: "124",
            sold: "1.8k",
            unit: "gói",
            stock: "180",
            images: ["images/product-2.jpg", "images/product-2-back.jpg", "images/product-2-details.jpg"],
            specs: [
                { k: "Thương hiệu", v: "Baker's Choice (Interflour Việt Nam)" },
                { k: "Hàm lượng Protein", v: "8.0% – 9.0% (Bột mì số 8 chuyên bánh mềm xốp)" },
                { k: "Thành phần", v: "100% lúa mì chọn lọc xay mịn, không chất tẩy trắng" },
                { k: "Công dụng phù hợp", v: "Bột mì số 8 có hàm lượng protein thấp, thích hợp làm bánh bông lan, cupcake, muffin và các loại bánh mềm xốp." },
                { k: "Hướng dẫn sử dụng", v: "Nên rây bột trước khi trộn để bột tơi mịn, hạn chế vón cục khi nướng." },
                { k: "Quy cách bảo quản", v: "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp. Buộc kín miệng túi sau mỗi lần sử dụng." }
            ],
            recipes: [
                { title: "Bánh Bông Lan Chiffon Mềm Tan", time: "55 phút", usage: "120g Bột mì số 8", diff: "Dễ", img: "images/about-baking.jpg" },
                { title: "Cupcake Vani Bơ Sữa Thơm Lừng", time: "45 phút", usage: "150g Bột mì số 8", diff: "Dễ", img: "images/about-young-bakers.jpg" },
                { title: "Bánh Quy Bơ Đan Mạch Giòn Xốp", time: "40 phút", usage: "180g Bột mì số 8", diff: "Vừa", img: "images/banner.jpg" }
            ],
            relatedIds: [2, 3, 4]
        },
        2: {
            shortName: "Bột mì số 11",
            brand: "Baker's Choice",
            origin: "Việt Nam",
            rating: "4.7",
            reviews: "86",
            sold: "1.2k",
            unit: "gói",
            stock: "140",
            images: ["images/product-1.jpg", "images/product-2-back.jpg", "images/product-2-details.jpg"],
            specs: [
                { k: "Thương hiệu", v: "Baker's Choice (Interflour Việt Nam)" },
                { k: "Hàm lượng Protein", v: "11.5% – 13.0% (Tạo màng gluten dai khỏe chuẩn bánh mì)" },
                { k: "Thành phần", v: "100% lúa mì cứng chất lượng cao" },
                { k: "Công dụng phù hợp", v: "Bột mì số 11 phù hợp làm bánh mì và các loại bánh cần độ dai, đàn hồi." },
                { k: "Hướng dẫn sử dụng", v: "Kết hợp cùng men nở và nhồi bột đúng thời gian để đạt độ nở dai tối ưu." },
                { k: "Quy cách bảo quản", v: "Bảo quản nơi khô ráo, thoáng mát, tránh ẩm mốc và côn trùng." }
            ],
            recipes: [
                { title: "Bánh Mì Sữa Hokkaido Xé Sợi", time: "110 phút", usage: "300g Bột mì số 11", diff: "Vừa", img: "images/about-young-bakers.jpg" },
                { title: "Bánh Mì Baguette Vỏ Giòn Ruột Dai", time: "95 phút", usage: "350g Bột mì số 11", diff: "Vừa", img: "images/contact-baking.jpg" },
                { title: "Đế Bánh Pizza Giòn Xốp Tại Nhà", time: "70 phút", usage: "250g Bột mì số 11", diff: "Dễ", img: "images/about-baking.jpg" }
            ],
            relatedIds: [1, 3, 4]
        },
        3: {
            shortName: "Bột mì",
            brand: "MEIZAN",
            origin: "Việt Nam",
            rating: "4.9",
            reviews: "185",
            sold: "1.5k",
            unit: "gói",
            stock: "150",
            images: ["images/product-2.jpg", "images/product-2-back.jpg", "images/product-2-details.jpg"],
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
            relatedIds: [1, 2, 4]
        },
        4: {
            shortName: "Bột cacao",
            brand: "Hershey's",
            origin: "Mỹ",
            rating: "4.9",
            reviews: "98",
            sold: "1.1k",
            unit: "hộp",
            stock: "85",
            images: ["images/about-ingredients.jpg", "images/about-baking.jpg", "images/banner.jpg"],
            specs: [
                { k: "Thương hiệu", v: "Hershey's (100% Cacao Natural Unsweetened)" },
                { k: "Thành phần", v: "100% bột cacao tự nhiên nguyên chất không đường, không chất bảo quản" },
                { k: "Đặc điểm hương vị", v: "Màu nâu đậm tự nhiên, vị chocolate nguyên bản, hương thơm nồng ấm" },
                { k: "Ứng dụng phù hợp", v: "Bột cacao dùng tạo hương vị chocolate và màu sắc đặc trưng cho bánh brownie, bánh quy và các món tráng miệng." },
                { k: "Quy cách bảo quản", v: "Bảo quản nơi khô ráo, kín khí, tránh nhiệt độ cao và độ ẩm." }
            ],
            recipes: [
                { title: "Bánh Brownie Chocolate Hạnh Nhân", time: "45 phút", usage: "45g Bột cacao Hershey's", diff: "Dễ", img: "images/banner.jpg" },
                { title: "Bánh Quy Chocolate Chip Đậm Vị", time: "35 phút", usage: "30g Bột cacao Hershey's", diff: "Dễ", img: "images/about-sharing-cakes.jpg" },
                { title: "Bánh Mousse Socola Lạnh Mịn Mượt", time: "75 phút", usage: "35g Bột cacao Hershey's", diff: "Vừa", img: "images/about-baking.jpg" }
            ],
            relatedIds: [1, 3, 5]
        },
        5: {
            shortName: "Bột Matcha",
            brand: "BakeMate",
            origin: "Nhật Bản",
            rating: "4.8",
            reviews: "74",
            sold: "680",
            unit: "gói",
            stock: "65",
            images: ["images/product-3.jpg", "images/about-ingredients.jpg", "images/about-baking.jpg"],
            specs: [
                { k: "Thương hiệu", v: "BakeMate Selected (Culinary Matcha)" },
                { k: "Thành phần", v: "100% lá trà xanh nghiền mịn chuyên dụng làm bánh và pha chế" },
                { k: "Đặc điểm màu sắc", v: "Bột siêu mịn dễ hòa tan, màu xanh dịu tự nhiên và hương trà thanh nhẹ" },
                { k: "Ứng dụng phù hợp", v: "Bột matcha dùng làm bánh cupcake, bánh quy và các món tráng miệng có hương vị trà xanh." },
                { k: "Quy cách bảo quản", v: "Đậy kín bao bì sau khi mở, bảo quản nơi khô mát và tránh ánh sáng trực tiếp." }
            ],
            recipes: [
                { title: "Cupcake Matcha Kem Phô Mai", time: "50 phút", usage: "12g Bột Matcha", diff: "Dễ", img: "images/about-young-bakers.jpg" },
                { title: "Bánh Quy Trà Xanh Hạnh Nhân", time: "40 phút", usage: "15g Bột Matcha", diff: "Dễ", img: "images/about-sharing-cakes.jpg" },
                { title: "Tiramisu Matcha Không Cần Lò", time: "60 phút", usage: "18g Bột Matcha", diff: "Vừa", img: "images/about-baking.jpg" }
            ],
            relatedIds: [4, 6, 1]
        },
        6: {
            shortName: "Whipping Cream",
            brand: "Anchor / Emborg",
            origin: "New Zealand",
            rating: "4.8",
            reviews: "156",
            sold: "1.9k",
            unit: "hộp",
            stock: "90",
            images: ["images/product-8.jpg", "images/about-sharing-cakes.jpg", "images/about-baking.jpg"],
            specs: [
                { k: "Thương hiệu", v: "Anchor / Emborg (Kem tươi tiệt trùng không đường)" },
                { k: "Hàm lượng chất béo", v: "35.1% chất béo sữa tự nhiên, đánh bông mịn đứng form" },
                { k: "Ứng dụng phù hợp", v: "Kem tươi dùng để đánh bông, trang trí bánh kem, làm mousse và các món tráng miệng." },
                { k: "Hướng dẫn sử dụng", v: "Làm lạnh hộp kem và tô đánh ở 2 – 4°C trước khi đánh bông bằng máy." },
                { k: "Quy cách bảo quản", v: "Bảo quản ngăn mát tủ lạnh (2 – 4°C), không cấp đông; dùng hết trong 3 – 5 ngày sau mở nắp." }
            ],
            recipes: [
                { title: "Bánh Mousse Socola Béo Mịn", time: "90 phút", usage: "250ml Whipping Cream", diff: "Vừa", img: "images/banner.jpg" },
                { title: "Bánh Kem Tươi Dâu Tây Sinh Nhật", time: "75 phút", usage: "300ml Whipping Cream", diff: "Vừa", img: "images/about-sharing-cakes.jpg" },
                { title: "Panna Cotta Sữa Tươi Thanh Mát", time: "35 phút", usage: "200ml Whipping Cream", diff: "Dễ", img: "images/about-young-bakers.jpg" }
            ],
            relatedIds: [1, 4, 5]
        },
        7: {
            shortName: "Cân điện tử",
            brand: "BakeMate",
            origin: "Nhập khẩu",
            rating: "4.8",
            reviews: "112",
            sold: "920",
            unit: "cái",
            stock: "70",
            images: ["images/about-baking.jpg", "images/about-beginner.jpg", "images/contact-baking.jpg"],
            specs: [
                { k: "Thương hiệu", v: "BakeMate Kitchen Tools" },
                { k: "Tải trọng & Độ chia", v: "Cân tối đa 5kg | Độ chia chính xác 1g" },
                { k: "Tính năng nổi bật", v: "Chuyển đổi đơn vị g / oz / ml / lb; nút Tare trừ bì tiện lợi, màn hình LCD rõ nét" },
                { k: "Công dụng phù hợp", v: "Cân điện tử hỗ trợ cân đo chính xác khối lượng bột, đường, bơ và các nguyên liệu làm bánh." },
                { k: "Quy cách bảo quản", v: "Lau sạch bề mặt bằng khăn ẩm nhẹ sau sử dụng, tránh ngâm nước, bảo quản nơi khô ráo." }
            ],
            recipes: [
                { title: "Bánh Quy Bơ Định Lượng Chuẩn Xác", time: "45 phút", usage: "Cân 180g bột & 100g bơ", diff: "Dễ", img: "images/banner.jpg" },
                { title: "Bánh Macaron Kiểu Pháp Tỉ Lệ 1:1", time: "90 phút", usage: "Cân chính xác từng gram đường", diff: "Khó", img: "images/about-sharing-cakes.jpg" },
                { title: "Bánh Mì Hoa Cúc Chuẩn Công Thức", time: "95 phút", usage: "Cân men, bột & sữa chuẩn gram", diff: "Vừa", img: "images/about-young-bakers.jpg" }
            ],
            relatedIds: [8, 9, 10]
        },
        8: {
            shortName: "Ca đong",
            brand: "BakeMate",
            origin: "Việt Nam",
            rating: "4.7",
            reviews: "64",
            sold: "780",
            unit: "cái",
            stock: "120",
            images: ["images/about-beginner.jpg", "images/about-baking.jpg", "images/about-ingredients.jpg"],
            specs: [
                { k: "Thương hiệu", v: "BakeMate Kitchen Tools" },
                { k: "Chất liệu", v: "Nhựa PP nguyên sinh an toàn thực phẩm, trong suốt dễ quan sát mực chất lỏng" },
                { k: "Thang đo dung tích", v: "Vạch chia ml và cup rõ nét theo chuẩn công thức làm bánh" },
                { k: "Công dụng phù hợp", v: "Ca đong có vạch chia giúp đo lường lượng nước, sữa và các nguyên liệu dạng lỏng trong công thức." },
                { k: "Quy cách bảo quản", v: "Vệ sinh sạch sau mỗi lần sử dụng, tránh va đập mạnh hoặc đặt gần nguồn nhiệt cao." }
            ],
            recipes: [
                { title: "Bánh Flan Caramen Mềm Mịn", time: "40 phút", usage: "Đong 500ml hỗn hợp sữa trứng", diff: "Dễ", img: "images/about-baking.jpg" },
                { title: "Bánh Crepe Ngàn Lớp Đổ Chảo", time: "50 phút", usage: "Đong 350ml sữa tươi mịn", diff: "Dễ", img: "images/about-young-bakers.jpg" },
                { title: "Bánh Bông Lan Dầu Ăn & Sữa Tươi", time: "55 phút", usage: "Đong 80ml sữa & 50ml dầu", diff: "Dễ", img: "images/banner.jpg" }
            ],
            relatedIds: [7, 9, 10]
        },
        9: {
            shortName: "Thìa đong",
            brand: "BakeMate",
            origin: "Nhập khẩu",
            rating: "4.8",
            reviews: "79",
            sold: "1.0k",
            unit: "bộ",
            stock: "135",
            images: ["images/about-ingredients.jpg", "images/about-baking.jpg", "images/about-beginner.jpg"],
            specs: [
                { k: "Thương hiệu", v: "BakeMate Kitchen Tools" },
                { k: "Quy cách bộ thìa", v: "Nhiều cỡ thìa chuẩn tsp / tbsp (1.25ml, 2.5ml, 5ml, 7.5ml, 15ml)" },
                { k: "Công dụng phù hợp", v: "Bộ thìa đong hỗ trợ định lượng các nguyên liệu có khối lượng nhỏ như bột nở, muối và vani." },
                { k: "Hướng dẫn sử dụng", v: "Múc đầy nguyên liệu và dùng cạnh thẳng gạt ngang miệng thìa để định lượng chuẩn xác." },
                { k: "Quy cách bảo quản", v: "Vệ sinh sạch và lau khô hoàn toàn sau khi sử dụng, móc gọn vào khoen giữ." }
            ],
            recipes: [
                { title: "Cupcake Vani Nở Đều Đẹp", time: "45 phút", usage: "Đong 1 tsp bột nở & vani", diff: "Dễ", img: "images/about-young-bakers.jpg" },
                { title: "Bánh Quy Bơ Sữa Muối Biển", time: "40 phút", usage: "Đong 1/2 tsp muối & tinh chất vani", diff: "Dễ", img: "images/banner.jpg" },
                { title: "Bánh Pancake Sốt Mật Ong", time: "25 phút", usage: "Đong 1 tbsp đường & 1 tsp bột nở", diff: "Dễ", img: "images/about-baking.jpg" }
            ],
            relatedIds: [7, 8, 10]
        },
        10: {
            shortName: "Nhiệt kế",
            brand: "BakeMate",
            origin: "Nhập khẩu",
            rating: "4.7",
            reviews: "49",
            sold: "540",
            unit: "cái",
            stock: "60",
            images: ["images/about-baking.jpg", "images/contact-baking.jpg", "images/about-beginner.jpg"],
            specs: [
                { k: "Thương hiệu", v: "BakeMate Kitchen Tools" },
                { k: "Dải đo nhiệt độ", v: "-50°C đến 300°C | Đọc kết quả nhanh trên màn hình điện tử" },
                { k: "Chất liệu đầu dò", v: "Thép không gỉ 304 an toàn thực phẩm, dễ vệ sinh" },
                { k: "Công dụng phù hợp", v: "Nhiệt kế điện tử hỗ trợ kiểm tra nhiệt độ nguyên liệu trong quá trình chế biến và làm bánh." },
                { k: "Quy cách bảo quản", v: "Lau khô đầu dò sau khi sử dụng, không ngâm thân điện tử trong nước và tránh va đập." }
            ],
            recipes: [
                { title: "Sốt Caramel Muối Biển Chuẩn Nhiệt", time: "30 phút", usage: "Canh chuẩn 170°C khi thắng đường", diff: "Vừa", img: "images/banner.jpg" },
                { title: "Meringue Thụy Sĩ Đánh Cách Thủy", time: "45 phút", usage: "Đo lòng trắng đạt 60°C – 65°C", diff: "Vừa", img: "images/about-young-bakers.jpg" },
                { title: "Bánh Mì Men Nở Kích Hoạt Chuẩn", time: "90 phút", usage: "Kiểm tra nước ấm 38°C – 40°C", diff: "Vừa", img: "images/about-baking.jpg" }
            ],
            relatedIds: [7, 8, 9]
        },
        11: {
            shortName: "Túi bắt kem",
            brand: "BakeMate",
            origin: "Việt Nam",
            rating: "4.9",
            reviews: "88",
            sold: "1.4k",
            unit: "gói",
            stock: "220",
            images: ["images/about-sharing-cakes.jpg", "images/about-baking.jpg", "images/about-young-bakers.jpg"],
            specs: [
                { k: "Thương hiệu", v: "BakeMate Packaging & Tools" },
                { k: "Chất liệu", v: "Nhựa PE thực phẩm dày dặn, bề mặt vân nhám chống trơn trượt khi bóp" },
                { k: "Tính tương thích", v: "Dùng kèm mọi loại đui bắt kem tiêu chuẩn hoặc cắt đầu trực tiếp để bắt bông, vẽ nét" },
                { k: "Công dụng phù hợp", v: "Túi bắt kem hỗ trợ tạo hình và trang trí bánh kem, cupcake cùng nhiều loại bánh khác." },
                { k: "Quy cách bảo quản", v: "Bảo quản nơi khô ráo, sạch sẽ, tránh bụi bẩn và nhiệt độ cao." }
            ],
            recipes: [
                { title: "Cupcake Kem Bơ Hoa Hồng", time: "60 phút", usage: "Dùng 2 túi bắt kem tạo xoáy kem", diff: "Vừa", img: "images/about-sharing-cakes.jpg" },
                { title: "Bánh Su Kem Vỏ Giòn Nhân Custard", time: "55 phút", usage: "Bơm nhân kem mịn vào vỏ bánh", diff: "Vừa", img: "images/about-young-bakers.jpg" },
                { title: "Bánh Quy Bơ Tạo Hình Sò Bắt Đui", time: "45 phút", usage: "Tạo hình bột bánh quy đồng đều", diff: "Dễ", img: "images/about-baking.jpg" }
            ],
            relatedIds: [6, 7, 9]
        }
    };

    function getDetailMeta(product) {
        const preset = PRODUCT_DETAIL_META[Number(product.id)];
        if (preset) {
            return preset;
        }
        return {
            shortName: product.name,
            brand: "BakeMate",
            origin: "Việt Nam",
            rating: "4.8",
            reviews: "50",
            sold: "320",
            unit: "sản phẩm",
            stock: "100",
            images: [product.image],
            specs: [
                { k: "Thương hiệu", v: "BakeMate" },
                { k: "Danh mục", v: product.category },
                { k: "Mô tả sản phẩm", v: product.description }
            ],
            recipes: [
                { title: "Bánh Bông Lan Cơ Bản Tại Nhà", time: "50 phút", usage: product.name, diff: "Dễ", img: "images/about-baking.jpg" },
                { title: "Cupcake Vani Chuẩn Vị", time: "45 phút", usage: product.name, diff: "Dễ", img: "images/about-young-bakers.jpg" },
                { title: "Bánh Quy Bơ Thơm Giòn", time: "40 phút", usage: product.name, diff: "Dễ", img: "images/banner.jpg" }
            ],
            relatedIds: []
        };
    }

    // 2. Lấy dữ liệu sản phẩm đã nạp từ js/products.js
    const productList = window.products || [];

    // 3. Đọc tham số id từ URL (ví dụ: product-detail.html?id=3)
    const urlParams = new URLSearchParams(window.location.search);
    const productIdStr = urlParams.get("id");
    const productId = Number(productIdStr);

    // 4. Lấy các thẻ DOM cần thay đổi trên trang product-detail.html
    const detailBox = document.getElementById("product-detail-box");
    const breadcrumbCurrent = document.getElementById("breadcrumb-current");
    const mainImg = document.getElementById("main-product-img");
    const thumbsContainer = document.getElementById("gallery-thumbs-container");
    const productBrand = document.getElementById("product-brand");
    const productTitle = document.getElementById("product-title");
    const productRating = document.getElementById("product-rating");
    const productSold = document.getElementById("product-sold");
    const productCodeMeta = document.getElementById("product-code-meta");
    const productCategoryMeta = document.getElementById("product-category-meta");
    const productPrice = document.getElementById("product-price");
    const productOldPrice = document.getElementById("product-old-price");
    const productSaveTag = document.getElementById("product-save-tag");
    const badgeDiscount = document.getElementById("badge-discount");
    const optionGroup = document.getElementById("packaging-option-group");
    const pillsContainer = document.getElementById("packaging-options");
    const stockHint = document.getElementById("stock-hint");
    const specsTableBody = document.getElementById("specs-table-body");
    const recipeTitle = document.getElementById("recipe-section-title");
    const recipeContainer = document.getElementById("recipe-cards-container");
    const relatedTitle = document.getElementById("related-section-title");
    const relatedContainer = document.getElementById("related-products-container");

    const specsSection = document.querySelector(".product-specs-section");
    const recipeSection = document.querySelector(".recipe-crosslink-section");
    const relatedSection = document.querySelector(".related-products-section");

    const btnMinus = document.getElementById("btn-qty-minus");
    const btnPlus = document.getElementById("btn-qty-plus");
    const qtyInput = document.getElementById("product-qty");
    const btnAddToCart = document.getElementById("btn-add-to-cart");
    const btnBuyNow = document.getElementById("btn-buy-now");

    // 5. Tìm sản phẩm tương ứng trong danh sách dựa vào productId
    const product = productList.find((item) => Number(item.id) === productId);

    // 6. Nếu KHÔNG tìm thấy sản phẩm hoặc ID trên URL bị sai/thiếu
    if (!product) {
        document.title = "Không tìm thấy sản phẩm | BakeMate";
        if (breadcrumbCurrent) breadcrumbCurrent.textContent = "Không tìm thấy sản phẩm";
        if (detailBox) {
            detailBox.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background-color: var(--bg-color, #fff8ed); border-radius: 8px; width: 100%;">
                    <h2 style="color: var(--primary-color, #70452b); margin-bottom: 16px;">Sản phẩm không tồn tại!</h2>
                    <p style="color: #666; margin-bottom: 24px;">Sản phẩm bạn đang tìm kiếm không có trong hệ thống hoặc liên kết chưa đúng mã sản phẩm.</p>
                    <a href="products.html" class="btn btn--primary">Quay lại danh sách sản phẩm</a>
                </div>
            `;
        }
        if (specsSection) specsSection.hidden = true;
        if (recipeSection) recipeSection.hidden = true;
        if (relatedSection) relatedSection.hidden = true;
        return;
    }

    const meta = getDetailMeta(product);
    const codeText = `#BM-${String(product.id).padStart(3, "0")}`;

    // 7. Cập nhật Tiêu đề, Breadcrumb, Thương hiệu, Đánh giá, Lượt bán
    document.title = `${product.name} | BakeMate`;
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = product.name;
    if (productTitle) productTitle.textContent = product.name;

    if (productBrand) {
        productBrand.innerHTML = `Thương hiệu: <strong>${escapeHtml(meta.brand)}</strong> | Xuất xứ: ${escapeHtml(meta.origin)}`;
    }

    if (productRating) {
        productRating.innerHTML = `★★★★★ <strong>${escapeHtml(meta.rating)}</strong> (${escapeHtml(meta.reviews)} đánh giá)`;
    }

    if (productSold) {
        productSold.innerHTML = `Đã bán <strong>${escapeHtml(meta.sold)}</strong> ${escapeHtml(meta.unit)}`;
    }

    if (productCodeMeta) {
        productCodeMeta.innerHTML = `Mã: <strong>${escapeHtml(codeText)}</strong>`;
    }

    if (productCategoryMeta) {
        productCategoryMeta.innerHTML = `Danh mục: <strong>${escapeHtml(product.category)}</strong>`;
    }

    if (stockHint) {
        stockHint.textContent = `Kho còn ${meta.stock} ${meta.unit} sẵn sàng giao`;
    }

    // 8. Cập nhật Ảnh chính & Hàng Thumbnail đa ảnh
    const galleryImages = Array.isArray(meta.images) && meta.images.length > 0
        ? meta.images
        : [product.image || FALLBACK_IMG];

    if (mainImg) {
        mainImg.src = galleryImages[0];
        mainImg.alt = product.name;
        mainImg.onerror = function () {
            this.onerror = null;
            this.src = FALLBACK_IMG;
        };
    }

    if (thumbsContainer) {
        thumbsContainer.innerHTML = "";
        galleryImages.forEach((src, idx) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = `thumb-btn${idx === 0 ? " active" : ""}`;
            btn.setAttribute("aria-label", `Xem ảnh ${idx + 1} của ${product.name}`);

            const img = document.createElement("img");
            img.src = src;
            img.alt = `${meta.shortName} góc ${idx + 1}`;
            img.onerror = function () {
                this.onerror = null;
                this.src = FALLBACK_IMG;
            };

            btn.appendChild(img);
            btn.addEventListener("click", function () {
                if (mainImg) {
                    mainImg.src = src;
                    mainImg.alt = `${product.name} - ảnh ${idx + 1}`;
                }
                thumbsContainer.querySelectorAll(".thumb-btn").forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
            });

            thumbsContainer.appendChild(btn);
        });
    }

    // 9. Quy cách đóng gói & Giá bán đồng bộ với js/storage.js
    const options = typeof window.getProductOptions === "function"
        ? window.getProductOptions(product.id)
        : [{
            optionIndex: 0,
            shortLabel: "Tiêu chuẩn",
            label: `Tiêu chuẩn - ${formatPrice(product.price)}`,
            price: Number(product.price),
            oldPrice: Math.round(Number(product.price) * 1.2),
            saveAmount: Math.round(Number(product.price) * 0.2),
            discountPercent: 17
        }];

    let selectedOptionIndex = 0;

    function applySelectedOption(opt) {
        if (!opt) return;

        if (productPrice) {
            productPrice.textContent = formatPrice(opt.price);
        }

        if (productOldPrice) {
            if (opt.oldPrice > opt.price) {
                productOldPrice.style.display = "";
                productOldPrice.textContent = formatPrice(opt.oldPrice);
            } else {
                productOldPrice.style.display = "none";
            }
        }

        if (productSaveTag) {
            if (opt.saveAmount > 0) {
                productSaveTag.style.display = "";
                productSaveTag.textContent = `Tiết kiệm ${formatPrice(opt.saveAmount)}`;
            } else {
                productSaveTag.style.display = "none";
            }
        }

        if (badgeDiscount) {
            if (opt.discountPercent > 0) {
                badgeDiscount.style.display = "";
                badgeDiscount.textContent = `-${opt.discountPercent}%`;
            } else {
                badgeDiscount.style.display = "none";
            }
        }
    }

    applySelectedOption(options[0]);

    if (optionGroup && pillsContainer) {
        if (options.length > 0) {
            optionGroup.hidden = false;
            pillsContainer.innerHTML = "";
            options.forEach((opt, idx) => {
                const label = document.createElement("label");
                label.className = "pill-radio";
                label.innerHTML = `
                    <input type="radio" name="packaging" value="${opt.optionIndex}" ${idx === 0 ? "checked" : ""}>
                    <span class="pill-radio__btn">${escapeHtml(opt.label)}</span>
                `;
                const radio = label.querySelector("input");
                radio.addEventListener("change", function () {
                    if (radio.checked) {
                        selectedOptionIndex = Number(opt.optionIndex);
                        applySelectedOption(opt);
                    }
                });
                pillsContainer.appendChild(label);
            });
        } else {
            optionGroup.hidden = true;
        }
    }

    // 10. Đổ Bảng Thông số kỹ thuật & Hướng dẫn bảo quản (dùng <th> và <td> chuẩn Buổi 2)
    if (specsTableBody) {
        const rows = [
            { k: "Mã sản phẩm", v: codeText },
            { k: "Danh mục", v: product.category },
            ...meta.specs
        ];

        specsTableBody.innerHTML = rows
            .map((row) => `<tr><th>${escapeHtml(row.k)}</th><td>${escapeHtml(row.v)}</td></tr>`)
            .join("");
    }
    if (specsSection) {
        specsSection.hidden = false;
    }

    // 11. Đổ Khối UVP Công thức áp dụng ("Sản phẩm này dùng cho công thức nào?")
    if (recipeTitle) {
        recipeTitle.textContent = "Sản phẩm này dùng cho công thức nào?";
    }
    if (recipeContainer && Array.isArray(meta.recipes) && meta.recipes.length > 0) {
        if (recipeSection) recipeSection.hidden = false;
        recipeContainer.innerHTML = meta.recipes
            .map((r) => `
                <div class="recipe-card">
                    <div class="recipe-card__media">
                        <img src="${escapeHtml(r.img)}" alt="${escapeHtml(r.title)}" class="recipe-card__img" onerror="this.onerror=null;this.src='${escapeHtml(FALLBACK_IMG)}';">
                        <span class="recipe-card__tag">Độ khó: ${escapeHtml(r.diff)}</span>
                    </div>
                    <div class="recipe-card__body">
                        <h3 class="recipe-card__title">${escapeHtml(r.title)}</h3>
                        <p class="recipe-card__info">&#9201; ${escapeHtml(r.time)} | &#128100; Chuẩn phần bánh</p>
                        <p class="recipe-card__usage">Công thức dùng: <strong>${escapeHtml(r.usage)}</strong></p>
                        <a href="index.html" class="btn btn--recipe">Xem công thức &amp; Quy đổi</a>
                    </div>
                </div>
            `)
            .join("");
    } else if (recipeSection) {
        recipeSection.hidden = true;
    }

    // 12. Xử lý tăng / giảm số lượng
    function getSelectedQuantity() {
        if (!qtyInput) return 1;
        const parsed = Math.floor(Number(qtyInput.value));
        if (!Number.isFinite(parsed) || parsed < 1) return 1;
        return Math.min(MAX_QTY, parsed);
    }

    if (btnMinus && btnPlus && qtyInput) {
        btnMinus.addEventListener("click", function () {
            const currentQty = getSelectedQuantity();
            if (currentQty > 1) {
                qtyInput.value = currentQty - 1;
            }
        });

        btnPlus.addEventListener("click", function () {
            const currentQty = getSelectedQuantity();
            if (currentQty < MAX_QTY) {
                qtyInput.value = currentQty + 1;
            }
        });

        qtyInput.addEventListener("change", function () {
            qtyInput.value = getSelectedQuantity();
        });
    }

    // 13. Gắn chức năng Thêm vào giỏ hàng & Mua ngay (truyền kèm selectedOptionIndex)
    if (btnAddToCart) {
        btnAddToCart.addEventListener("click", function () {
            if (typeof window.addToCart !== "function") {
                return;
            }
            const qty = getSelectedQuantity();
            const result = window.addToCart(product.id, qty, selectedOptionIndex);
            if (typeof window.showCartToast === "function") {
                window.showCartToast(result.message, {
                    type: result.success ? (result.capped ? "warning" : "success") : "warning"
                });
            }
        });
    }

    if (btnBuyNow) {
        btnBuyNow.addEventListener("click", function () {
            if (typeof window.addToCart !== "function") {
                window.location.href = "cart.html";
                return;
            }
            const qty = getSelectedQuantity();
            const result = window.addToCart(product.id, qty, selectedOptionIndex);
            if (result.success) {
                window.location.href = "cart.html";
            } else if (typeof window.showCartToast === "function") {
                window.showCartToast(result.message, { type: "warning", showCartLink: false });
            }
        });
    }

    // 14. Hiển thị Khối "Thường được mua cùng" (.mini-card trong .products-mini-grid)
    if (relatedTitle) {
        relatedTitle.textContent = `Thường được mua cùng ${meta.shortName.toLowerCase()}`;
    }

    if (relatedContainer) {
        const relProducts = [];
        meta.relatedIds.forEach((relId) => {
            const found = productList.find((p) => Number(p.id) === Number(relId));
            if (found && Number(found.id) !== Number(product.id)) {
                relProducts.push(found);
            }
        });

        if (relProducts.length < 3) {
            productList
                .filter((p) => p.category === product.category && Number(p.id) !== Number(product.id))
                .concat(productList.filter((p) => Number(p.id) !== Number(product.id)))
                .forEach((candidate) => {
                    if (
                        relProducts.length < 3 &&
                        !relProducts.some((item) => Number(item.id) === Number(candidate.id))
                    ) {
                        relProducts.push(candidate);
                    }
                });
        }

        if (relProducts.length === 0) {
            if (relatedSection) relatedSection.hidden = true;
        } else {
            if (relatedSection) relatedSection.hidden = false;
            relatedContainer.innerHTML = "";

            relProducts.forEach((rel) => {
                const detailUrl = `product-detail.html?id=${rel.id}`;
                const card = document.createElement("div");
                card.className = "mini-card";
                card.setAttribute("tabindex", "0");
                card.setAttribute("role", "link");
                card.setAttribute("aria-label", `Xem chi tiết ${rel.name}`);
                card.innerHTML = `
                    <img src="${escapeHtml(rel.image)}" alt="${escapeHtml(rel.name)}" class="mini-card__img" onerror="this.onerror=null;this.src='${escapeHtml(FALLBACK_IMG)}';">
                    <div class="mini-card__body">
                        <h3 class="mini-card__title">${escapeHtml(rel.name)}</h3>
                        <span class="mini-card__price">${escapeHtml(formatPrice(rel.price))}</span>
                    </div>
                    <button type="button" class="btn-add-mini" data-product-id="${rel.id}" aria-label="Thêm ${escapeHtml(rel.name)} vào giỏ hàng">+ Thêm</button>
                `;

                card.addEventListener("click", function (event) {
                    if (event.target.closest(".btn-add-mini")) {
                        return;
                    }
                    window.location.href = detailUrl;
                });

                card.addEventListener("keydown", function (event) {
                    if (event.target.closest(".btn-add-mini")) {
                        return;
                    }
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        window.location.href = detailUrl;
                    }
                });

                relatedContainer.appendChild(card);
            });

            relatedContainer.addEventListener("click", function (event) {
                const addBtn = event.target.closest(".btn-add-mini");
                if (!addBtn || typeof window.addToCart !== "function") {
                    return;
                }
                const targetId = Number(addBtn.dataset.productId);
                const result = window.addToCart(targetId, 1, 0);
                if (typeof window.showCartToast === "function") {
                    window.showCartToast(result.message, {
                        type: result.success ? (result.capped ? "warning" : "success") : "warning"
                    });
                }
            });
        }
    }
});
