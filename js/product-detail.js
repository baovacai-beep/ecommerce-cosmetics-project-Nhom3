/*
 * =========================================================
 * BAKEMATE - ĐỌC DỮ LIỆU TỪ URL VÀ ĐỔ VÀO TRANG CHI TIẾT
 * Tệp: js/product-detail.js (Bước 4 + 21 SP + Recipe-to-Cart)
 * Kết hợp đầy đủ giao diện Buổi 2 (Gallery 3 ảnh, Giá ưu đãi,
 * Quy cách đóng gói, Bảng thông số, Recipe Cross-link UVP, Mini Cards)
 * với dữ liệu 21 sản phẩm (js/products.js) và giỏ hàng (js/storage.js).
 * =========================================================
 */

document.addEventListener("DOMContentLoaded", function () {
  const FALLBACK_IMG = window.FALLBACK_PRODUCT_IMAGE || "images/logo.jpg";
  const MAX_QTY = 99;

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

  // 1. Dữ liệu chi tiết đầy đủ cho toàn bộ 21 sản phẩm (1..21) kèm 3 ảnh/sản phẩm trong images/products/
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
      images: [
        "images/products/bot-mi-so-8-1.jpg",
        "images/products/bot-mi-so-8-2.jpg",
        "images/products/bot-mi-so-8-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "Baker's Choice (Interflour Việt Nam)" },
        { k: "Hàm lượng Protein", v: "8.0% – 9.0% (Bột mì số 8 chuyên bánh mềm xốp)" },
        { k: "Thành phần", v: "100% lúa mì chọn lọc xay mịn, không chất tẩy trắng" },
        { k: "Công dụng phù hợp", v: "Thích hợp làm bánh bông lan, chiffon, cupcake, muffin và các loại bánh mềm xốp." },
        { k: "Hướng dẫn sử dụng", v: "Rây mịn bột trước khi trộn để hỗn hợp tơi xốp và không vón cục." },
        { k: "Quy cách bảo quản", v: "Bảo quản nơi khô ráo, thoáng mát, buộc kín miệng túi sau khi mở." }
      ],
      recipes: [
        { recipeGroupId: "recipe-bong-lan", title: "Bánh Bông Lan Chiffon Mềm Tan", time: "55 phút", usage: "120g Bột mì số 8 (túi 300g)", diff: "Dễ", img: "images/about-baking.jpg" },
        { recipeGroupId: "recipe-matcha-cupcake", title: "Cupcake Matcha Kem Phô Mai", time: "50 phút", usage: "140g Bột mì số 8 (túi 300g)", diff: "Dễ", img: "images/about-sharing-cakes.jpg" },
        { recipeGroupId: "recipe-banh-quy-bo", title: "Bánh Quy Bơ Đan Mạch Giòn Xốp", time: "40 phút", usage: "180g Bột mì số 8 (túi 300g)", diff: "Dễ", img: "images/about-beginner.jpg" }
      ],
      relatedIds: [15, 13, 14]
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
      images: [
        "images/products/bot-mi-so-11-1.jpg",
        "images/products/bot-mi-so-11-2.jpg",
        "images/products/bot-mi-so-11-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "Baker's Choice (Interflour Việt Nam)" },
        { k: "Hàm lượng Protein", v: "11.5% – 13.0% (Tạo màng gluten dai khỏe chuẩn bánh mì)" },
        { k: "Thành phần", v: "100% lúa mì cứng chất lượng cao" },
        { k: "Công dụng phù hợp", v: "Phù hợp làm bánh mì hoa cúc, baguette, bánh mì sữa Hokkaido và đế pizza." },
        { k: "Hướng dẫn sử dụng", v: "Kết hợp cùng men nở và nhồi bột đúng thời gian để đạt độ dai thớ tối ưu." },
        { k: "Quy cách bảo quản", v: "Bảo quản nơi khô ráo, thoáng mát, tránh ẩm mốc." }
      ],
      recipes: [
        { recipeGroupId: "recipe-hoa-cuc", title: "Bánh Mì Hoa Cúc Thơm Lừng Bơ Sữa", time: "90 phút", usage: "260g Bột mì số 11 (túi 300g)", diff: "Vừa", img: "images/about-young-bakers.jpg" },
        { recipeGroupId: "recipe-bong-lan", title: "Bánh Bông Lan Chiffon Mềm Tan", time: "55 phút", usage: "Phối trộn tỉ lệ nhỏ cho bánh nở đứng", diff: "Dễ", img: "images/about-baking.jpg" },
        { recipeGroupId: "recipe-muffin-socola", title: "Bánh Muffin Chocolate Hạnh Nhân", time: "40 phút", usage: "Phối trộn tạo độ chắc phần đế bánh", diff: "Dễ", img: "images/banner.jpg" }
      ],
      relatedIds: [12, 1, 3]
    },
    3: {
      shortName: "Bột mì Meizan",
      brand: "MEIZAN",
      origin: "Việt Nam",
      rating: "4.9",
      reviews: "185",
      sold: "1.5k",
      unit: "gói",
      stock: "150",
      images: [
        "images/products/bot-mi-meizan-1.jpg",
        "images/products/bot-mi-meizan-2.jpg",
        "images/products/bot-mi-meizan-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "MEIZAN (Tập đoàn FFM Berhad & Wilmar)" },
        { k: "Hàm lượng Protein", v: "9.5% – 11.5% (Đạt độ đàn hồi dẻo dai chuẩn đa dụng)" },
        { k: "Thành phần", v: "100% lúa mì hảo hạng nhập khẩu, bổ sung vi chất sắt và kẽm" },
        { k: "Ứng dụng phù hợp", v: "Bánh muffin, pancake, bánh quy bơ, bánh bao và các món nướng gia đình." },
        { k: "Quy cách bảo quản", v: "Bảo quản nơi khô ráo, sạch sẽ, thoáng mát, tránh nơi có mùi nồng." }
      ],
      recipes: [
        { recipeGroupId: "recipe-muffin-socola", title: "Bánh Muffin Chocolate Hạnh Nhân", time: "40 phút", usage: "150g Bột mì Meizan (túi 300g)", diff: "Dễ", img: "images/banner.jpg" },
        { recipeGroupId: "recipe-pancake", title: "Bánh Pancake Mật Ong Bữa Sáng", time: "25 phút", usage: "150g Bột mì Meizan (túi 300g)", diff: "Dễ", img: "images/about-baking.jpg" },
        { recipeGroupId: "recipe-brownie", title: "Bánh Brownie Chocolate Đậm Vị", time: "45 phút", usage: "85g Bột mì Meizan (gói 100g)", diff: "Dễ", img: "images/contact-baking.jpg" }
      ],
      relatedIds: [4, 12, 13]
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
      images: [
        "images/products/bot-cacao-hershey-1.jpg",
        "images/products/bot-cacao-hershey-2.jpg",
        "images/products/bot-cacao-hershey-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "Hershey's (100% Cacao Natural Unsweetened)" },
        { k: "Thành phần", v: "100% bột cacao tự nhiên nguyên chất không đường, không chất bảo quản" },
        { k: "Đặc điểm hương vị", v: "Màu nâu đậm tự nhiên, vị chocolate nguyên bản, hương thơm nồng ấm" },
        { k: "Ứng dụng phù hợp", v: "Tạo hương vị chocolate đậm đà cho brownie, muffin, bánh quy và mousse." },
        { k: "Quy cách bảo quản", v: "Bảo quản nơi khô ráo, đậy kín nắp sau khi dùng." }
      ],
      recipes: [
        { recipeGroupId: "recipe-brownie", title: "Bánh Brownie Chocolate Đậm Vị", time: "45 phút", usage: "50g Bột cacao Hershey's", diff: "Dễ", img: "images/contact-baking.jpg" },
        { recipeGroupId: "recipe-muffin-socola", title: "Bánh Muffin Chocolate Hạnh Nhân", time: "40 phút", usage: "35g Bột cacao Hershey's", diff: "Dễ", img: "images/banner.jpg" },
        { recipeGroupId: "recipe-mousse-socola", title: "Bánh Mousse Socola Lạnh Mịn Mượt", time: "75 phút", usage: "35g Bột cacao Hershey's", diff: "Vừa", img: "images/about-ingredients.jpg" }
      ],
      relatedIds: [12, 3, 6]
    },
    5: {
      shortName: "Bột Matcha",
      brand: "BakeMate Selected",
      origin: "Nhật Bản",
      rating: "4.8",
      reviews: "74",
      sold: "680",
      unit: "gói",
      stock: "65",
      images: [
        "images/products/matcha-lam-banh-1.jpg",
        "images/products/matcha-lam-banh-2.jpg",
        "images/products/matcha-lam-banh-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "BakeMate Selected (Culinary Matcha)" },
        { k: "Thành phần", v: "100% lá trà xanh nghiền mịn chuyên dụng làm bánh" },
        { k: "Đặc điểm màu sắc", v: "Bột siêu mịn dễ hòa tan, màu xanh dịu tự nhiên và hương trà thanh nhẹ" },
        { k: "Ứng dụng phù hợp", v: "Dùng làm cupcake, chiffon, bánh quy và tiramisu trà xanh." },
        { k: "Quy cách bảo quản", v: "Đậy kín túi zip, tránh ánh sáng trực tiếp và nhiệt độ cao." }
      ],
      recipes: [
        { recipeGroupId: "recipe-matcha-cupcake", title: "Cupcake Matcha Kem Phô Mai", time: "50 phút", usage: "12g Bột Matcha Nhật Bản", diff: "Dễ", img: "images/about-sharing-cakes.jpg" },
        { recipeGroupId: "recipe-bong-lan", title: "Bánh Bông Lan Chiffon Vị Trà Xanh", time: "55 phút", usage: "15g Bột Matcha pha nước ấm", diff: "Dễ", img: "images/about-baking.jpg" },
        { recipeGroupId: "recipe-banh-quy-bo", title: "Bánh Quy Bơ Trà Xanh Giòn Xốp", time: "40 phút", usage: "15g Bột Matcha Nhật Bản", diff: "Dễ", img: "images/about-beginner.jpg" }
      ],
      relatedIds: [1, 6, 19]
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
      images: [
        "images/products/whipping-cream-1.jpg",
        "images/products/whipping-cream-2.jpg",
        "images/products/whipping-cream-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "Anchor (Kem tươi sữa bò tiệt trùng không đường)" },
        { k: "Hàm lượng chất béo", v: "35.1% chất béo sữa tự nhiên, đánh bông mịn đứng form" },
        { k: "Ứng dụng phù hợp", v: "Đánh bông chà láng bánh kem, làm nhân su kem, mousse và panna cotta." },
        { k: "Hướng dẫn sử dụng", v: "Làm lạnh hộp kem và âu đánh ở 2 – 4°C trước khi đánh bông." },
        { k: "Quy cách bảo quản", v: "Bảo quản ngăn mát tủ lạnh (2 – 4°C), không cấp đông." }
      ],
      recipes: [
        { recipeGroupId: "recipe-mousse-socola", title: "Bánh Mousse Socola Lạnh Mịn Mượt", time: "75 phút", usage: "250ml Whipping Cream Anchor", diff: "Vừa", img: "images/about-ingredients.jpg" },
        { recipeGroupId: "recipe-matcha-cupcake", title: "Cupcake Matcha Kem Phô Mai", time: "50 phút", usage: "200ml Whipping Cream bắt kem", diff: "Dễ", img: "images/about-sharing-cakes.jpg" },
        { recipeGroupId: "recipe-bong-lan", title: "Bông Lan Cuộn Kem Tươi Béo Ngậy", time: "55 phút", usage: "180ml Whipping Cream nhân kem", diff: "Dễ", img: "images/about-baking.jpg" }
      ],
      relatedIds: [4, 16, 17]
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
      images: [
        "images/products/can-dien-tu-1.jpg",
        "images/products/can-dien-tu-2.jpg",
        "images/products/can-dien-tu-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "BakeMate Kitchen Tools" },
        { k: "Tải trọng & Độ chia", v: "Cân tối đa 5kg | Độ chia chính xác 1g" },
        { k: "Tính năng nổi bật", v: "Chuyển đổi g / oz / ml; nút Tare trừ bì tiện lợi, màn hình LCD rõ nét" },
        { k: "Công dụng phù hợp", v: "Cân đo chính xác từng gram bột, đường, bơ, men nở cho mọi công thức bánh." },
        { k: "Quy cách bảo quản", v: "Lau bằng khăn ẩm nhẹ, tránh ngâm nước, bảo quản nơi khô ráo." }
      ],
      recipes: [
        { recipeGroupId: "recipe-banh-quy-bo", title: "Bánh Quy Bơ Định Lượng Chuẩn Xác", time: "40 phút", usage: "Cân 180g bột & 150g bơ chuẩn gram", diff: "Dễ", img: "images/about-beginner.jpg" },
        { recipeGroupId: "recipe-hoa-cuc", title: "Bánh Mì Hoa Cúc Chuẩn Công Thức", time: "90 phút", usage: "Cân 260g bột mì số 11 & bơ lạt", diff: "Vừa", img: "images/about-young-bakers.jpg" },
        { recipeGroupId: "recipe-bong-lan", title: "Bánh Bông Lan Chiffon Mềm Tan", time: "55 phút", usage: "Cân bột & đường tỉ lệ chuẩn", diff: "Dễ", img: "images/about-baking.jpg" }
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
      images: [
        "images/products/ca-dong-1.jpg",
        "images/products/ca-dong-2.jpg",
        "images/products/ca-dong-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "BakeMate Kitchen Tools" },
        { k: "Chất liệu", v: "Nhựa PP nguyên sinh an toàn thực phẩm, trong suốt" },
        { k: "Thang đo dung tích", v: "Vạch chia ml và cup rõ nét hai mặt, vòi rót chống nhỏ giọt" },
        { k: "Công dụng phù hợp", v: "Đo lường chính xác lượng nước, sữa tươi, mật ong và chất lỏng." },
        { k: "Quy cách bảo quản", v: "Rửa sạch sau sử dụng, tránh đặt sát nguồn lửa trực tiếp." }
      ],
      recipes: [
        { recipeGroupId: "recipe-pancake", title: "Bánh Pancake Mật Ong Bữa Sáng", time: "25 phút", usage: "Đong sữa & rót bột đều mặt chảo", diff: "Dễ", img: "images/about-baking.jpg" },
        { recipeGroupId: "recipe-bong-lan", title: "Bánh Bông Lan Chiffon Mềm Tan", time: "55 phút", usage: "Đong sữa tươi & dầu ăn chuẩn ml", diff: "Dễ", img: "images/about-baking.jpg" },
        { recipeGroupId: "recipe-mousse-socola", title: "Bánh Mousse Socola Lạnh Mịn Mượt", time: "75 phút", usage: "Đong kem tươi & gelatin hòa tan", diff: "Vừa", img: "images/about-ingredients.jpg" }
      ],
      relatedIds: [7, 9, 16]
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
      images: [
        "images/products/thia-dong-1.jpg",
        "images/products/thia-dong-2.jpg",
        "images/products/thia-dong-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "BakeMate Kitchen Tools" },
        { k: "Quy cách bộ thìa", v: "5 cỡ chuẩn tsp / tbsp (1.25ml, 2.5ml, 5ml, 7.5ml, 15ml)" },
        { k: "Công dụng phù hợp", v: "Định lượng chuẩn các nguyên liệu nhỏ như Cream of Tartar, men nở, vani, muối." },
        { k: "Hướng dẫn sử dụng", v: "Gạt ngang miệng thìa bằng sống dao để đúng dung tích tiêu chuẩn." },
        { k: "Quy cách bảo quản", v: "Lau khô sau khi rửa và móc gọn vào khoen giữ." }
      ],
      recipes: [
        { recipeGroupId: "recipe-matcha-cupcake", title: "Cupcake Matcha Kem Phô Mai", time: "50 phút", usage: "Đong chuẩn bột trà xanh & bột nở", diff: "Dễ", img: "images/about-sharing-cakes.jpg" },
        { recipeGroupId: "recipe-bong-lan", title: "Bánh Bông Lan Chiffon Mềm Tan", time: "55 phút", usage: "Đong 1/2 tsp Cream of Tartar", diff: "Dễ", img: "images/about-baking.jpg" },
        { recipeGroupId: "recipe-pancake", title: "Bánh Pancake Mật Ong Bữa Sáng", time: "25 phút", usage: "Đong bột nở & tinh chất vani", diff: "Dễ", img: "images/about-baking.jpg" }
      ],
      relatedIds: [7, 8, 14]
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
      images: [
        "images/products/nhiet-ke-1.jpg",
        "images/products/nhiet-ke-2.jpg",
        "images/products/nhiet-ke-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "BakeMate Kitchen Tools" },
        { k: "Dải đo nhiệt độ", v: "-50°C đến 300°C | Hiển thị nhanh trên màn hình điện tử" },
        { k: "Chất liệu đầu dò", v: "Thép không gỉ 304 an toàn thực phẩm, dễ vệ sinh" },
        { k: "Công dụng phù hợp", v: "Kiểm tra nhiệt độ sữa ấm kích men nở, đun chảy bơ socola, thắng đường caramel." },
        { k: "Quy cách bảo quản", v: "Lau sạch đầu dò inox, không ngâm thân máy vào nước." }
      ],
      recipes: [
        { recipeGroupId: "recipe-hoa-cuc", title: "Bánh Mì Hoa Cúc Men Nở Đạt Chuẩn", time: "90 phút", usage: "Kiểm tra sữa ấm 38°C kích men", diff: "Vừa", img: "images/about-young-bakers.jpg" },
        { recipeGroupId: "recipe-mousse-socola", title: "Bánh Mousse Socola Lạnh Mịn Mượt", time: "75 phút", usage: "Kiểm tra nhiệt độ chảy socola 45°C", diff: "Vừa", img: "images/about-ingredients.jpg" },
        { recipeGroupId: "recipe-brownie", title: "Bánh Brownie Chocolate Đậm Vị", time: "45 phút", usage: "Đo nhiệt độ bơ cacao đun cách thủy", diff: "Dễ", img: "images/contact-baking.jpg" }
      ],
      relatedIds: [7, 8, 16]
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
      images: [
        "images/products/tui-bat-kem-1.jpg",
        "images/products/tui-bat-kem-2.jpg",
        "images/products/tui-bat-kem-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "BakeMate Packaging & Tools" },
        { k: "Chất liệu", v: "Nhựa PE thực phẩm dày dặn, bề mặt vân nhám chống trơn trượt" },
        { k: "Tính tương thích", v: "Lắp vừa mọi loại đui bắt kem inox hoặc cắt đầu bóp trực tiếp" },
        { k: "Công dụng phù hợp", v: "Trang trí kem cupcake, tạo hình bánh quy bơ và bơm nhân su kem." },
        { k: "Quy cách bảo quản", v: "Bảo quản nơi khô ráo, sạch sẽ, tránh nhiệt độ cao." }
      ],
      recipes: [
        { recipeGroupId: "recipe-banh-quy-bo", title: "Bánh Quy Bơ Đan Mạch Tạo Hình Đui", time: "40 phút", usage: "Bóp bột bánh quy đều đẹp không bục", diff: "Dễ", img: "images/about-beginner.jpg" },
        { recipeGroupId: "recipe-matcha-cupcake", title: "Cupcake Matcha Kem Phô Mai", time: "50 phút", usage: "Bắt xoáy kem tươi lên mặt cupcake", diff: "Dễ", img: "images/about-sharing-cakes.jpg" },
        { recipeGroupId: "recipe-mousse-socola", title: "Trang Trí Bánh Mousse Socola", time: "75 phút", usage: "Bắt viền kem trang trí sang trọng", diff: "Vừa", img: "images/about-ingredients.jpg" }
      ],
      relatedIds: [20, 6, 19]
    },
    12: {
      shortName: "Bơ lạt Anchor",
      brand: "Anchor",
      origin: "New Zealand",
      rating: "4.9",
      reviews: "214",
      sold: "2.3k",
      unit: "khối",
      stock: "110",
      images: [
        "images/products/bo-lat-anchor-1.jpg",
        "images/products/bo-lat-anchor-2.jpg",
        "images/products/bo-lat-anchor-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "Anchor (Fonterra New Zealand)" },
        { k: "Thành phần", v: "Bơ sữa bò nguyên chất 82.9% chất béo sữa, không muối" },
        { k: "Đặc điểm hương vị", v: "Vàng tự nhiên, mềm dẻo ở nhiệt độ phòng, mùi thơm bơ sữa béo ngậy" },
        { k: "Ứng dụng phù hợp", v: "Nguyên liệu không thể thiếu cho bánh mì hoa cúc, quy bơ, brownie và croissant." },
        { k: "Quy cách bảo quản", v: "Bảo quản ngăn mát tủ lạnh (2–4°C) hoặc ngăn đông nếu dùng lâu dài." }
      ],
      recipes: [
        { recipeGroupId: "recipe-banh-quy-bo", title: "Bánh Quy Bơ Đan Mạch Giòn Xốp", time: "40 phút", usage: "150g Bơ lạt Anchor đánh bông", diff: "Dễ", img: "images/about-beginner.jpg" },
        { recipeGroupId: "recipe-hoa-cuc", title: "Bánh Mì Hoa Cúc Thơm Lừng Bơ Sữa", time: "90 phút", usage: "110g Bơ lạt Anchor tạo thớ dai mềm", diff: "Vừa", img: "images/about-young-bakers.jpg" },
        { recipeGroupId: "recipe-brownie", title: "Bánh Brownie Chocolate Đậm Vị", time: "45 phút", usage: "120g Bơ lạt đun chảy mịn mượt", diff: "Dễ", img: "images/contact-baking.jpg" }
      ],
      relatedIds: [1, 2, 4]
    },
    13: {
      shortName: "Đường tinh luyện",
      brand: "Biên Hòa",
      origin: "Việt Nam",
      rating: "4.8",
      reviews: "142",
      sold: "2.1k",
      unit: "túi",
      stock: "200",
      images: [
        "images/products/duong-tinh-luyen-1.jpg",
        "images/products/duong-tinh-luyen-2.jpg",
        "images/products/duong-tinh-luyen-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "Đường Biên Hòa (TTC Sugar)" },
        { k: "Độ tinh khiết", v: "≥ 99.8% Sucrose, hạt đường trắng mịn đều, không tẩy trắng" },
        { k: "Công dụng phù hợp", v: "Tan nhanh khi đánh bông trứng làm bông lan, nấu caramel và tạo vị ngọt thanh." },
        { k: "Quy cách bảo quản", v: "Đậy kín hộp hoặc buộc chặt túi sau sử dụng, tránh nơi ẩm ướt." }
      ],
      recipes: [
        { recipeGroupId: "recipe-bong-lan", title: "Bánh Bông Lan Chiffon Mềm Tan", time: "55 phút", usage: "100g Đường đánh bông lòng trắng", diff: "Dễ", img: "images/about-baking.jpg" },
        { recipeGroupId: "recipe-hoa-cuc", title: "Bánh Mì Hoa Cúc Thơm Lừng Bơ Sữa", time: "90 phút", usage: "70g Đường tinh luyện cân bằng vị", diff: "Vừa", img: "images/about-young-bakers.jpg" },
        { recipeGroupId: "recipe-pancake", title: "Bánh Pancake Mật Ong Bữa Sáng", time: "25 phút", usage: "40g Đường giúp vỏ bánh vàng đều", diff: "Dễ", img: "images/about-baking.jpg" }
      ],
      relatedIds: [1, 15, 14]
    },
    14: {
      shortName: "Cream of Tartar",
      brand: "Baker's",
      origin: "Nhập khẩu",
      rating: "4.9",
      reviews: "68",
      sold: "890",
      unit: "hộp",
      stock: "95",
      images: [
        "images/products/cream-of-tartar-1.jpg",
        "images/products/cream-of-tartar-2.jpg",
        "images/products/cream-of-tartar-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "Baker's Baking Essentials" },
        { k: "Thành phần", v: "100% Potassium Bitartrate tinh khiết dùng trong làm bánh" },
        { k: "Công dụng nổi bật", v: "Ổn định bọt khí lòng trắng trứng giúp bánh bông lan, chiffon nở cao không xẹp." },
        { k: "Liều lượng khuyên dùng", v: "1/4 – 1/2 thìa cà phê (khoảng 1–2g) cho 4 lòng trắng trứng." },
        { k: "Quy cách bảo quản", v: "Đậy kín nắp sau khi mở, đặt nơi khô ráo thoáng mát." }
      ],
      recipes: [
        { recipeGroupId: "recipe-bong-lan", title: "Bánh Bông Lan Chiffon Mềm Tan", time: "55 phút", usage: "1/2 tsp Cream of Tartar đánh bông trứng", diff: "Dễ", img: "images/about-baking.jpg" },
        { recipeGroupId: "recipe-matcha-cupcake", title: "Cupcake Matcha Bông Mịn", time: "50 phút", usage: "Ổn định cốt bánh trà xanh tơi xốp", diff: "Dễ", img: "images/about-sharing-cakes.jpg" },
        { recipeGroupId: "recipe-banh-quy-bo", title: "Meringue & Bánh Quy Bơ Giòn Xốp", time: "40 phút", usage: "Giữ vân kem trứng lâu tan", diff: "Dễ", img: "images/about-beginner.jpg" }
      ],
      relatedIds: [1, 15, 9]
    },
    15: {
      shortName: "Trứng gà tươi",
      brand: "BakeMate Farm",
      origin: "Việt Nam",
      rating: "4.9",
      reviews: "173",
      sold: "2.4k",
      unit: "vỉ",
      stock: "80",
      images: [
        "images/products/trung-ga-tuoi-1.jpg",
        "images/products/trung-ga-tuoi-2.jpg",
        "images/products/trung-ga-tuoi-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "BakeMate Farm Fresh Eggs" },
        { k: "Khối lượng quả", v: "55 – 60g/quả đồng đều (đúng chuẩn cân nặng công thức làm bánh)" },
        { k: "Đặc điểm chất lượng", v: "Lòng trắng sánh trong dễ đánh bông, lòng đỏ đậm màu tạo hương thơm béo" },
        { k: "Giao hàng & Đóng gói", v: "Đựng trong vỉ bảo vệ chống sốc chuyên dụng, giao nhanh trong 2h nội thành." },
        { k: "Quy cách bảo quản", v: "Bảo quản ngăn mát tủ lạnh và để về nhiệt độ phòng trước khi đánh bánh 30 phút." }
      ],
      recipes: [
        { recipeGroupId: "recipe-bong-lan", title: "Bánh Bông Lan Chiffon Mềm Tan", time: "55 phút", usage: "5 quả Trứng gà tươi tách lòng", diff: "Dễ", img: "images/about-baking.jpg" },
        { recipeGroupId: "recipe-hoa-cuc", title: "Bánh Mì Hoa Cúc Thơm Lừng Bơ Sữa", time: "90 phút", usage: "3 quả Trứng gà tạo độ vàng dai", diff: "Vừa", img: "images/about-young-bakers.jpg" },
        { recipeGroupId: "recipe-pancake", title: "Bánh Pancake Mật Ong Bữa Sáng", time: "25 phút", usage: "2 quả Trứng gà tươi đánh sánh", diff: "Dễ", img: "images/about-baking.jpg" }
      ],
      relatedIds: [1, 13, 14]
    },
    16: {
      shortName: "Phới lồng Inox",
      brand: "BakeMate Tools",
      origin: "Nhập khẩu",
      rating: "4.8",
      reviews: "62",
      sold: "740",
      unit: "cái",
      stock: "95",
      images: [
        "images/products/phoi-long-1.jpg",
        "images/products/phoi-long-2.jpg",
        "images/products/phoi-long-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "BakeMate Kitchen Tools" },
        { k: "Chất liệu", v: "Thép không gỉ 304 đan 10 nan đàn hồi, tay cầm gỗ sồi tự nhiên" },
        { k: "Kích thước", v: "Dài 25cm (Tiêu chuẩn) hoặc 30cm (Cán dài đánh âu sâu)" },
        { k: "Công dụng phù hợp", v: "Đánh đều lòng đỏ trứng, trộn bột loãng, hòa kem tươi và sốt custard." },
        { k: "Quy cách bảo quản", v: "Rửa sạch ngay sau khi dùng, treo ráo bằng móc inox cuối tay cầm." }
      ],
      recipes: [
        { recipeGroupId: "recipe-mousse-socola", title: "Bánh Mousse Socola Lạnh Mịn Mượt", time: "75 phút", usage: "Đánh kem tươi và hòa socola mịn mượt", diff: "Vừa", img: "images/about-ingredients.jpg" },
        { recipeGroupId: "recipe-pancake", title: "Bánh Pancake Mật Ong Bữa Sáng", time: "25 phút", usage: "Khuấy bột mịn không vón cục", diff: "Dễ", img: "images/about-baking.jpg" },
        { recipeGroupId: "recipe-bong-lan", title: "Bánh Bông Lan Chiffon Mềm Tan", time: "55 phút", usage: "Đánh hòa quyện hỗn hợp lòng đỏ sữa", diff: "Dễ", img: "images/about-baking.jpg" }
      ],
      relatedIds: [8, 17, 7]
    },
    17: {
      shortName: "Khuôn tròn 20cm",
      brand: "BakeMate Bakeware",
      origin: "Nhập khẩu",
      rating: "4.9",
      reviews: "105",
      sold: "980",
      unit: "cái",
      stock: "75",
      images: [
        "images/products/khuon-banh-tron-1.jpg",
        "images/products/khuon-banh-tron-2.jpg",
        "images/products/khuon-banh-tron-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "BakeMate Bakeware" },
        { k: "Chất liệu", v: "Hợp kim nhôm Anodized phủ chống dính cao cấp, đế rời tiện tách bánh" },
        { k: "Kích thước chuẩn", v: "Đường kính 20cm × Chiều cao 7.5cm (hoặc cỡ 22cm)" },
        { k: "Công dụng phù hợp", v: "Nướng cốt bông lan sinh nhật, chiffon, cheesecake và đổ mousse lạnh." },
        { k: "Quy cách bảo quản", v: "Dùng mút mềm vệ sinh sau khi nguội, không dùng cọ sắt làm trầy lớp phủ." }
      ],
      recipes: [
        { recipeGroupId: "recipe-mousse-socola", title: "Bánh Mousse Socola Lạnh Mịn Mượt", time: "75 phút", usage: "Khuôn đế rời 20cm tháo bánh sắc nét", diff: "Vừa", img: "images/about-ingredients.jpg" },
        { recipeGroupId: "recipe-bong-lan", title: "Bánh Bông Lan Chiffon Mềm Tan", time: "55 phút", usage: "Nướng cốt bánh 20cm cao đều đẹp", diff: "Dễ", img: "images/about-baking.jpg" },
        { recipeGroupId: "recipe-hoa-cuc", title: "Bánh Mì Sữa Tạo Hình Tròn Trong Khuôn", time: "90 phút", usage: "Ủ và nướng bánh mì mềm mịn đều cạnh", diff: "Vừa", img: "images/about-young-bakers.jpg" }
      ],
      relatedIds: [18, 1, 6]
    },
    18: {
      shortName: "Giấy nến nướng bánh",
      brand: "BakeMate",
      origin: "Việt Nam",
      rating: "4.8",
      reviews: "132",
      sold: "1.7k",
      unit: "cuộn",
      stock: "190",
      images: [
        "images/products/giay-nen-1.jpg",
        "images/products/giay-nen-2.jpg",
        "images/products/giay-nen-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "BakeMate Baking Essentials" },
        { k: "Chất liệu & An toàn", v: "Bột gỗ nguyên chất phủ silicone chống dính 2 mặt, không chứa PFAS" },
        { k: "Khả năng chịu nhiệt", v: "Chịu nhiệt lên đến 230°C (an toàn với lò nướng và nồi chiên không dầu)" },
        { k: "Công dụng phù hợp", v: "Lót đáy khuôn brownie, bánh bông lan, nướng bánh quy bơ không bám khay." },
        { k: "Quy cách bảo quản", v: "Bảo quản hộp nơi khô ráo, sử dụng thanh răng cưa trên hộp để cắt nhanh." }
      ],
      recipes: [
        { recipeGroupId: "recipe-brownie", title: "Bánh Brownie Chocolate Đậm Vị", time: "45 phút", usage: "Lót khuôn nhấc bánh brownie gọn gàng", diff: "Dễ", img: "images/contact-baking.jpg" },
        { recipeGroupId: "recipe-banh-quy-bo", title: "Bánh Quy Bơ Đan Mạch Giòn Xốp", time: "40 phút", usage: "Lót khay nướng cookie vàng giòn mặt đáy", diff: "Dễ", img: "images/about-beginner.jpg" },
        { recipeGroupId: "recipe-bong-lan", title: "Bánh Bông Lan Cuộn Không Dính Vỏ", time: "55 phút", usage: "Lót khay phẳng nướng cốt bánh cuộn", diff: "Dễ", img: "images/about-baking.jpg" }
      ],
      relatedIds: [17, 19, 12]
    },
    19: {
      shortName: "Cup giấy Cupcake",
      brand: "BakeMate",
      origin: "Việt Nam",
      rating: "4.9",
      reviews: "118",
      sold: "1.6k",
      unit: "lốc",
      stock: "240",
      images: [
        "images/products/cup-giay-1.jpg",
        "images/products/cup-giay-2.jpg",
        "images/products/cup-giay-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "BakeMate Packaging & Tools" },
        { k: "Chất liệu", v: "Giấy kraft thực phẩm định lượng dày chống thấm dầu mỡ" },
        { k: "Kích thước chuẩn", v: "Đường kính đáy 5cm × Cao 3.8cm (vừa khay 6 hoặc 12 lỗ)" },
        { k: "Công dụng phù hợp", v: "Nướng trực tiếp muffin chocolate, cupcake trà xanh giữ phom đứng đẹp." },
        { k: "Quy cách bảo quản", v: "Đậy kín hộp nhựa bảo vệ tránh bụi ẩm và giữ nếp xếp ly." }
      ],
      recipes: [
        { recipeGroupId: "recipe-muffin-socola", title: "Bánh Muffin Chocolate Hạnh Nhân", time: "40 phút", usage: "Dùng 12 cup giấy nướng trực tiếp", diff: "Dễ", img: "images/banner.jpg" },
        { recipeGroupId: "recipe-matcha-cupcake", title: "Cupcake Matcha Kem Phô Mai", time: "50 phút", usage: "12 Cup giấy giữ dáng bánh mềm xốp", diff: "Dễ", img: "images/about-sharing-cakes.jpg" },
        { recipeGroupId: "recipe-bong-lan", title: "Bông Lan Mini Cupcake Cho Bé", time: "55 phút", usage: "Chia khẩu phần nhỏ dễ nướng và bảo quản", diff: "Dễ", img: "images/about-baking.jpg" }
      ],
      relatedIds: [11, 20, 4]
    },
    20: {
      shortName: "Bộ đui bắt kem",
      brand: "BakeMate Tools",
      origin: "Nhập khẩu",
      rating: "4.9",
      reviews: "94",
      sold: "1.1k",
      unit: "bộ",
      stock: "88",
      images: [
        "images/products/bo-dui-bat-kem-1.jpg",
        "images/products/bo-dui-bat-kem-2.jpg",
        "images/products/bo-dui-bat-kem-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "BakeMate Kitchen Tools" },
        { k: "Chất liệu & Phụ kiện", v: "12 đui Inox 304 đúc liền khối chống gỉ + khớp nối nhựa PP" },
        { k: "Kiểu hoa văn", v: "Đui sao mở/đóng, đui cánh hoa hồng, đui lá, viền sò, đui viết nét" },
        { k: "Công dụng phù hợp", v: "Trang trí kem cupcake, bánh sinh nhật và bắt bột bánh quy bơ tạo hình." },
        { k: "Quy cách bảo quản", v: "Rửa nước ấm để sạch bơ kem, lau khô và cất trong hộp nhựa kèm theo." }
      ],
      recipes: [
        { recipeGroupId: "recipe-banh-quy-bo", title: "Bánh Quy Bơ Đan Mạch Giòn Xốp", time: "40 phút", usage: "Dùng đui sao tạo vân bánh quy sắc nét", diff: "Dễ", img: "images/about-beginner.jpg" },
        { recipeGroupId: "recipe-matcha-cupcake", title: "Cupcake Matcha Kem Phô Mai", time: "50 phút", usage: "Bắt kem hoa trà xanh trang trí đỉnh bánh", diff: "Dễ", img: "images/about-sharing-cakes.jpg" },
        { recipeGroupId: "recipe-mousse-socola", title: "Bánh Mousse Socola Bắt Viền Kem", time: "75 phút", usage: "Tạo hoa văn kem viền bánh tinh tế", diff: "Vừa", img: "images/about-ingredients.jpg" }
      ],
      relatedIds: [11, 6, 19]
    },
    21: {
      shortName: "Hộp đựng bánh",
      brand: "BakeMate Packaging",
      origin: "Việt Nam",
      rating: "4.8",
      reviews: "77",
      sold: "960",
      unit: "set",
      stock: "145",
      images: [
        "images/products/hop-dung-banh-1.jpg",
        "images/products/hop-dung-banh-2.jpg",
        "images/products/hop-dung-banh-3.jpg"
      ],
      specs: [
        { k: "Thương hiệu", v: "BakeMate Packaging & Tools" },
        { k: "Kích thước hộp", v: "25 × 25 × 18cm (vừa bánh tròn 20cm kèm đế vàng)" },
        { k: "Chất liệu", v: "Giấy Ivory 350gsm dày cứng kết hợp cửa sổ mica trong suốt và quai xách" },
        { k: "Công dụng phù hợp", v: "Đóng gói bảo vệ bánh kem, mousse, hoa cúc gọn gàng khi biếu tặng bạn bè." },
        { k: "Quy cách bảo quản", v: "Để phẳng ở nơi khô thoáng, gấp gọn theo nếp cấn sẵn khi sử dụng." }
      ],
      recipes: [
        { recipeGroupId: "recipe-mousse-socola", title: "Hộp Biếu Bánh Mousse Socola 20cm", time: "75 phút", usage: "Đặt vừa khuôn bánh 20cm chống xô lệch", diff: "Vừa", img: "images/about-ingredients.jpg" },
        { recipeGroupId: "recipe-bong-lan", title: "Hộp Đựng Bánh Bông Lan Sinh Nhật", time: "55 phút", usage: "Gói quà sang trọng tặng người thân", diff: "Dễ", img: "images/about-baking.jpg" },
        { recipeGroupId: "recipe-hoa-cuc", title: "Hộp Mang Tặng Bánh Mì Hoa Cúc", time: "90 phút", usage: "Giữ bánh sạch sẽ khi di chuyển xa", diff: "Vừa", img: "images/about-young-bakers.jpg" }
      ],
      relatedIds: [17, 19, 11]
    },
    22: {
      shortName: "Bộ khuôn Tart mini",
      brand: "BakeMate Bakeware",
      origin: "Nhập khẩu",
      rating: "4.9",
      reviews: "18",
      sold: "Sắp mở bán",
      unit: "bộ",
      stock: "0",
      images: ["images/categories/cat-tools.jpg"],
      specs: [
        { k: "Thương hiệu", v: "BakeMate Bakeware" },
        { k: "Chất liệu", v: "Thép carbon phủ chống dính cao cấp, viền gợn sóng cổ điển" },
        { k: "Quy cách", v: "Bộ 6 khuôn Tart mini đường kính 8cm × cao 2.2cm" },
        { k: "Trạng thái", v: "Sản phẩm sắp mở bán — thêm vào Yêu thích để nhận thông báo sớm" }
      ],
      recipes: [
        { recipeGroupId: "recipe-banh-quy-bo", title: "Đế Tart Bơ Trứng Giòn Xốp", time: "35 phút", usage: "Nướng vỏ tart đều màu dễ tách khuôn", diff: "Trung bình", img: "images/about-beginner.jpg" }
      ],
      relatedIds: [17, 12, 1]
    },
    23: {
      shortName: "Bột trộn sẵn Bông Lan",
      brand: "Baker's Choice",
      origin: "Việt Nam",
      rating: "4.8",
      reviews: "24",
      sold: "Sắp mở bán",
      unit: "gói",
      stock: "0",
      images: ["images/about-ingredients.jpg"],
      specs: [
        { k: "Thương hiệu", v: "Baker's Choice" },
        { k: "Thành phần", v: "Bột mì số 8, đường xay mịn, bột nở và hương vani tự nhiên" },
        { k: "Quy cách", v: "Gói 500g tiện lợi (nướng được 2 ổ bánh tròn 18cm)" },
        { k: "Trạng thái", v: "Sản phẩm sắp mở bán — thêm vào Yêu thích để nhận thông báo sớm" }
      ],
      recipes: [
        { recipeGroupId: "recipe-bong-lan", title: "Bánh Bông Lan Cơ Bản Cấp Tốc", time: "55 phút", usage: "Chỉ cần thêm trứng gà và bơ lạt", diff: "Dễ", img: "images/about-baking.jpg" }
      ],
      relatedIds: [15, 17, 12]
    }
  };

  function getDetailMeta(product) {
    const preset = PRODUCT_DETAIL_META[Number(product.id)];
    if (preset) {
      return preset;
    }
    return {
      shortName: product.name,
      brand: product.brand || "BakeMate",
      origin: "Việt Nam",
      rating: "4.8",
      reviews: "0",
      sold: product.stockStatus === "coming_soon" ? "Sắp mở bán" : "Mới lên kệ",
      unit: product.packagingLabel || "sản phẩm",
      stock: product.stockStatus === "coming_soon" ? "0" : "50",
      images: [product.image || FALLBACK_IMG],
      specs: [
        { k: "Thương hiệu", v: product.brand || "BakeMate" },
        { k: "Danh mục", v: product.category },
        { k: "Quy cách đóng gói", v: product.packagingLabel || "Tiêu chuẩn" },
        { k: "Mô tả sản phẩm", v: product.description || "Sản phẩm chất lượng cao cho người làm bánh." }
      ],
      recipes: [
        { recipeGroupId: "recipe-bong-lan", title: "Bánh Bông Lan Cơ Bản Tại Nhà", time: "55 phút", usage: product.name, diff: "Dễ", img: "images/about-baking.jpg" }
      ],
      relatedIds: []
    };
  }

  const productList =
    typeof window.buildMergedProducts === "function"
      ? window.buildMergedProducts()
      : window.products || [];
  const urlParams = new URLSearchParams(window.location.search);
  const productIdStr = urlParams.get("id");
  const productId = Number(productIdStr);

  const detailBox = document.getElementById("product-detail-box");
  const breadcrumbCurrent = document.getElementById("breadcrumb-current");
  const mainImg = document.getElementById("main-product-img");
  const thumbsContainer = document.getElementById("gallery-thumbs-container");
  const productBrand = document.getElementById("product-brand");
  const productTitle = document.getElementById("product-title");
  const productDescription = document.getElementById("product-description");
  const productRating = document.getElementById("product-rating");
  const productSold = document.getElementById("product-sold");
  const productCodeMeta = document.getElementById("product-code-meta");
  const productCategoryMeta = document.getElementById("product-category-meta");
  const productStockPill = document.getElementById("product-stock-pill");
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
  const reviewsContainer = document.getElementById("product-reviews-container");
  const reviewsSection = document.getElementById("product-reviews-section");

  const specsSection = document.querySelector(".product-specs-section");
  const recipeSection = document.querySelector(".recipe-crosslink-section");
  const relatedSection = document.querySelector(".related-products-section");
  const perishableNotice = document.getElementById("pd-perishable-notice");
  const recentSection = document.getElementById("pd-recent-viewed-section");
  const recentGrid = document.getElementById("pd-recent-viewed-grid");
  const btnClearRecent = document.getElementById("btn-clear-recent-pd");

  const btnMinus = document.getElementById("btn-qty-minus");
  const btnPlus = document.getElementById("btn-qty-plus");
  const qtyInput = document.getElementById("product-qty");
  const btnAddToCart = document.getElementById("btn-add-to-cart");
  const btnBuyNow = document.getElementById("btn-buy-now");
  const btnWishlistDetail = document.getElementById("btn-wishlist-detail");

  const product = productList.find((item) => Number(item.id) === productId);

  // Xử lý an toàn khi thiếu ID hoặc ID không tồn tại
  if (!product) {
    document.title = "Sản phẩm không tồn tại | BakeMate";
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = "Sản phẩm không tồn tại";
    if (detailBox) {
      detailBox.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 56px 20px; background-color: var(--bg-color, #fff8ed); border: 1.5px dashed var(--accent-sub, #c88b52); border-radius: 12px; width: 100%;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 68px; height: 68px; border-radius: 50%; background-color: rgba(200, 139, 82, 0.14); color: var(--primary-color, #70452b); margin-bottom: 14px;" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/>
            </svg>
          </div>
          <h1 style="color: var(--primary-color, #70452b); font-size: 24px; margin-bottom: 12px;">Sản phẩm không tồn tại hoặc đã ngừng kinh doanh</h1>
          <p style="color: var(--accent-sub, #70452b); margin-bottom: 24px; max-width: 520px; margin-left: auto; margin-right: auto;">
            Rất tiếc, mã sản phẩm bạn truy cập không hợp lệ hoặc mặt hàng đã được cập nhật khỏi danh mục hiện tại.
          </p>
          <a href="products.html" class="btn btn--primary">Quay lại danh sách sản phẩm</a>
        </div>
      `;
    }
    if (specsSection) specsSection.hidden = true;
    if (reviewsSection) reviewsSection.hidden = true;
    if (recipeSection) recipeSection.hidden = true;
    if (relatedSection) relatedSection.hidden = true;
    if (recentSection) recentSection.hidden = true;
    return;
  }

  if (typeof window.addRecentProduct === "function") {
    window.addRecentProduct(product.id);
  }

  const isPerishable =
    typeof window.isProductPerishable === "function"
      ? window.isProductPerishable(product)
      : Boolean(product.isPerishable);
  if (perishableNotice) {
    perishableNotice.hidden = !isPerishable;
  }

  const meta = getDetailMeta(product);
  const isComingSoon = product.stockStatus === "coming_soon";
  const codeText = `#BM-${String(product.id).padStart(3, "0")}`;

  document.title = `${product.name} | BakeMate`;
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = product.name;
  if (productTitle) productTitle.textContent = product.name;
  if (productDescription) productDescription.textContent = product.description || "";

  if (productBrand) {
    productBrand.innerHTML = `Thương hiệu: <strong>${escapeHtml(meta.brand)}</strong> | Xuất xứ: ${escapeHtml(meta.origin)}`;
  }

  function updateRatingSummaryDisplay() {
    const userReviews =
      typeof window.getReviews === "function" ? window.getReviews("product", product.id) : [];
    const totalCount = Number(meta.reviews || 0) + userReviews.length;
    if (productRating) {
      productRating.innerHTML = `★★★★★ <strong>${escapeHtml(meta.rating)}</strong> (${escapeHtml(totalCount)} đánh giá)`;
    }
  }
  updateRatingSummaryDisplay();

  if (productSold) {
    productSold.innerHTML = isComingSoon
      ? `Trạng thái: <strong>Sắp mở bán</strong>`
      : `Đã bán <strong>${escapeHtml(meta.sold)}</strong> ${escapeHtml(meta.unit)}`;
  }

  if (productCodeMeta) {
    productCodeMeta.innerHTML = `Mã: <strong>${escapeHtml(codeText)}</strong>`;
  }

  if (productCategoryMeta) {
    productCategoryMeta.innerHTML = `Danh mục: <strong>${escapeHtml(product.category)}</strong>`;
  }

  if (productStockPill) {
    if (isComingSoon) {
      productStockPill.textContent = "Sắp có hàng";
      productStockPill.classList.remove("in-stock");
      productStockPill.style.backgroundColor = "#4a2e19";
      productStockPill.style.color = "#f2d9a6";
    } else {
      productStockPill.textContent = "Còn hàng";
    }
  }

  if (stockHint) {
    stockHint.textContent = isComingSoon
      ? "Sản phẩm sắp về kho BakeMate — lưu Yêu thích để nhận thông báo sớm"
      : `Kho còn ${meta.stock} ${meta.unit} sẵn sàng giao`;
  }

  if (isComingSoon) {
    if (btnAddToCart) {
      btnAddToCart.disabled = true;
      btnAddToCart.style.opacity = "0.6";
      btnAddToCart.style.cursor = "not-allowed";
      const lbl = btnAddToCart.querySelector(".js-add-cart-label");
      if (lbl) lbl.textContent = "Sắp có hàng";
    }
    if (btnBuyNow) {
      btnBuyNow.disabled = true;
      btnBuyNow.style.opacity = "0.6";
      btnBuyNow.style.cursor = "not-allowed";
    }
  }

  // Gallery 3 ảnh theo từng sản phẩm
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

  // Quy cách đóng gói & Giá bán đồng bộ với js/storage.js
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

  // Bảng Thông số kỹ thuật & Hướng dẫn bảo quản
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

  // Khối UVP Recipe-to-Cart ("Sản phẩm này dùng cho công thức nào?")
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
            <p class="recipe-card__info">
              <span class="meta-inline">
                <svg class="recipe-card__meta-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${escapeHtml(r.time)}
              </span>
              <span class="meta-sep" aria-hidden="true">|</span>
              <span class="meta-inline">
                <svg class="recipe-card__meta-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Chuẩn phần bánh
              </span>
            </p>
            <p class="recipe-card__usage">Công thức dùng: <strong>${escapeHtml(r.usage)}</strong></p>
            <div class="recipe-card__actions">
              <button type="button" class="btn btn--recipe js-add-recipe-combo" data-recipe-group-id="${escapeHtml(r.recipeGroupId || "recipe-bong-lan")}">
                + Thêm combo công thức vào giỏ
              </button>
              <a href="recipe-detail.html?id=${escapeHtml(r.recipeGroupId || "recipe-bong-lan")}" class="recipe-card__blog-link">
                Xem công thức &amp; Quy đổi &rarr;
              </a>
            </div>
          </div>
        </div>
      `)
      .join("");

    recipeContainer.addEventListener("click", function (event) {
      const comboBtn = event.target.closest(".js-add-recipe-combo");
      if (!comboBtn || typeof window.addRecipeComboToCart !== "function") {
        return;
      }
      const groupId = comboBtn.dataset.recipeGroupId;
      const result = window.addRecipeComboToCart(groupId);
      if (typeof window.showCartToast === "function") {
        window.showCartToast(result.message, {
          type: result.success ? "success" : "warning"
        });
      }
    });
  } else if (recipeSection) {
    recipeSection.hidden = true;
  }

  // Tăng / giảm số lượng
  function getSelectedQuantity() {
    if (!qtyInput) return 1;
    const parsed = Math.floor(Number(qtyInput.value));
    if (!Number.isFinite(parsed) || parsed < 1) return 1;
    return Math.min(MAX_QTY, parsed);
  }

  if (btnMinus && btnPlus && qtyInput) {
    btnMinus.addEventListener("click", function () {
      const currentQty = getSelectedQuantity();
      qtyInput.value = currentQty > 1 ? currentQty - 1 : 1;
    });

    btnPlus.addEventListener("click", function () {
      const currentQty = getSelectedQuantity();
      qtyInput.value = currentQty < MAX_QTY ? currentQty + 1 : MAX_QTY;
    });

    qtyInput.addEventListener("change", function () {
      qtyInput.value = getSelectedQuantity();
    });
  }

  // Thêm vào giỏ hàng & Mua ngay (mua lẻ -> recipeGroupId: null)
  if (btnAddToCart) {
    btnAddToCart.addEventListener("click", function () {
      if (typeof window.addToCart !== "function") {
        return;
      }
      const rawParsed = qtyInput ? Math.floor(Number(qtyInput.value)) : 1;
      const qty = getSelectedQuantity();
      if (qtyInput) {
        qtyInput.value = qty;
      }
      const addQty = Number.isFinite(rawParsed) && rawParsed > MAX_QTY ? rawParsed : qty;
      const result = window.addToCart(product.id, addQty, selectedOptionIndex, null);
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
      if (qtyInput) {
        qtyInput.value = qty;
      }
      const result = window.addToCart(product.id, qty, selectedOptionIndex, null);
      if (result.success) {
        window.location.href = "cart.html";
      } else if (typeof window.showCartToast === "function") {
        window.showCartToast(result.message, { type: "warning", showCartLink: false });
      }
    });
  }

  if (btnWishlistDetail) {
    function syncWishBtn() {
      const wished =
        typeof window.isProductWishlisted === "function" &&
        window.isProductWishlisted(product.id);
      btnWishlistDetail.classList.toggle("is-active", wished);
      btnWishlistDetail.setAttribute("aria-pressed", wished ? "true" : "false");
      const lbl = btnWishlistDetail.querySelector(".js-wish-detail-label");
      if (lbl) lbl.textContent = wished ? "Đã thích" : "Yêu thích";
    }
    syncWishBtn();

    btnWishlistDetail.addEventListener("click", function () {
      if (typeof window.toggleWishlistProduct !== "function") return;
      const res = window.toggleWishlistProduct(product.id);
      syncWishBtn();
      if (typeof window.showCartToast === "function") {
        window.showCartToast(res.message, { type: "success" });
      }
    });

    window.addEventListener("bakemate:wishlistChanged", syncWishBtn);
  }

  // Khối Đánh giá sản phẩm (dưới Thông số kỹ thuật)
  function renderProductReviews() {
    if (!reviewsContainer) return;
    const list =
      typeof window.getReviews === "function" ? window.getReviews("product", product.id) : [];
    const currentUser =
      typeof window.BakeAuth === "object" && typeof window.BakeAuth.getCurrentUser === "function"
        ? window.BakeAuth.getCurrentUser()
        : null;

    let selectedRating = 5;

    let reviewsHtml = "";
    if (list.length > 0) {
      reviewsHtml = `
        <div class="reviews-list">
          ${list
            .map((rev) => {
              const stars = "★".repeat(rev.rating) + "☆".repeat(Math.max(0, 5 - rev.rating));
              const dateLabel = rev.createdAt
                ? new Date(rev.createdAt).toLocaleDateString("vi-VN")
                : "";
              return `
                <article class="review-item">
                  <div class="review-item__head">
                    <strong>${escapeHtml(rev.userName)}</strong>
                    <span class="review-item__stars" aria-label="${rev.rating} sao">${stars} · <small style="color: var(--accent-sub); font-weight: 500;">${escapeHtml(dateLabel)}</small></span>
                  </div>
                  <p style="font-size: 14px; color: #5c402d; line-height: 1.55;">${escapeHtml(rev.comment)}</p>
                  ${
                    rev.imageDataUrl
                      ? `<div style="margin-top:8px;"><img src="${escapeHtml(rev.imageDataUrl)}" alt="Ảnh thành phẩm từ ${escapeHtml(rev.userName)}" class="review-photo-preview-img"></div>`
                      : ""
                  }
                </article>
              `;
            })
            .join("")}
        </div>
      `;
    }

    if (!currentUser) {
      if (list.length === 0) {
        reviewsContainer.innerHTML = `
          <div class="reviews-empty-card">
            <strong>Chưa có đánh giá</strong>
            <p>Hãy chia sẻ trải nghiệm của bạn sau khi sử dụng sản phẩm.</p>
            <a href="login.html?redirect=${encodeURIComponent(window.location.pathname.split("/").pop() + window.location.search)}" class="btn btn--outline-dark">
              Đăng nhập để đánh giá
            </a>
          </div>
        `;
      } else {
        reviewsContainer.innerHTML = `
          <div class="reviews-empty-card" style="margin-bottom: 16px;">
            <p style="margin-bottom: 10px;">Bạn đã sử dụng sản phẩm này? Đăng nhập để gửi đánh giá mới.</p>
            <a href="login.html?redirect=${encodeURIComponent(window.location.pathname.split("/").pop() + window.location.search)}" class="btn btn--outline-dark">
              Đăng nhập để đánh giá
            </a>
          </div>
          ${reviewsHtml}
        `;
      }
      return;
    }

    reviewsContainer.innerHTML = `
      <form id="product-review-form" class="review-form-box">
        <p style="font-size: 14px; font-weight: 700; color: #4a2e19; margin-bottom: 8px;">
          Gửi đánh giá với tên: ${escapeHtml(currentUser.fullName)}
        </p>
        <div class="review-stars-input" role="group" aria-label="Chọn số sao đánh giá">
          ${[5, 4, 3, 2, 1]
            .map(
              (s) =>
                `<button type="button" class="review-star-btn js-star-choice${s === 5 ? " is-active" : ""}" data-star="${s}">${s} ★</button>`
            )
            .join("")}
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label class="visually-hidden" for="review-comment-input">Nội dung đánh giá</label>
          <textarea id="review-comment-input" class="form-textarea" rows="3" placeholder="Chia sẻ cảm nhận về chất lượng, độ tươi hoặc mùi vị khi làm bánh..." required></textarea>
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label class="form-label" for="review-photo-input" style="font-size:13px;font-weight:700;color:#5c402d;display:block;margin-bottom:6px;">Ảnh đính kèm (tùy chọn)</label>
          <input type="file" id="review-photo-input" accept="image/*" class="form-input" style="padding:8px;">
          <div id="review-photo-preview-wrap" class="review-photo-preview-wrap" hidden>
            <img id="review-photo-preview-img" class="review-photo-preview-img" alt="Xem trước ảnh đánh giá">
            <button type="button" id="btn-clear-review-photo" class="btn btn--outline-dark" style="padding:5px 10px;font-size:12px;">Xóa ảnh</button>
          </div>
        </div>
        <button type="submit" class="btn btn--primary">Gửi đánh giá</button>
      </form>
      ${
        list.length > 0
          ? reviewsHtml
          : `<p style="font-size: 14px; color: var(--accent-sub);">Chưa có đánh giá nào được gửi từ cộng đồng. Hãy trở thành người đầu tiên!</p>`
      }
    `;

    let uploadedPhotoDataUrl = "";
    const photoInput = document.getElementById("review-photo-input");
    const previewWrap = document.getElementById("review-photo-preview-wrap");
    const previewImg = document.getElementById("review-photo-preview-img");
    const btnClearPhoto = document.getElementById("btn-clear-review-photo");

    if (photoInput) {
      photoInput.addEventListener("change", function () {
        const file = photoInput.files && photoInput.files[0];
        if (!file || !file.type || !file.type.startsWith("image/")) {
          uploadedPhotoDataUrl = "";
          if (previewWrap) previewWrap.hidden = true;
          return;
        }
        const reader = new FileReader();
        reader.onload = function (ev) {
          const resUrl = String(ev.target && ev.target.result ? ev.target.result : "");
          if (resUrl.length > 440000) {
            if (typeof window.showCartToast === "function") {
              window.showCartToast("Ảnh quá lớn (vui lòng chọn ảnh dưới 300KB).", { type: "warning" });
            }
            photoInput.value = "";
            uploadedPhotoDataUrl = "";
            if (previewWrap) previewWrap.hidden = true;
            return;
          }
          uploadedPhotoDataUrl = resUrl;
          if (previewImg) previewImg.src = resUrl;
          if (previewWrap) previewWrap.hidden = false;
        };
        reader.readAsDataURL(file);
      });
    }

    if (btnClearPhoto) {
      btnClearPhoto.addEventListener("click", function () {
        uploadedPhotoDataUrl = "";
        if (photoInput) photoInput.value = "";
        if (previewWrap) previewWrap.hidden = true;
      });
    }

    const starBtns = reviewsContainer.querySelectorAll(".js-star-choice");
    starBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        selectedRating = Number(btn.dataset.star) || 5;
        starBtns.forEach((b) => b.classList.toggle("is-active", Number(b.dataset.star) === selectedRating));
      });
    });

    const reviewForm = document.getElementById("product-review-form");
    if (reviewForm) {
      reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const commentEl = document.getElementById("review-comment-input");
        const commentText = commentEl ? commentEl.value.trim() : "";
        if (commentText.length < 4) {
          if (typeof window.showCartToast === "function") {
            window.showCartToast("Vui lòng nhập nhận xét tối thiểu 4 ký tự.", { type: "warning" });
          }
          if (commentEl) commentEl.focus();
          return;
        }
        if (typeof window.addReview === "function") {
          window.addReview({
            targetType: "product",
            targetId: product.id,
            userId: currentUser.userId,
            userName: currentUser.fullName,
            rating: selectedRating,
            comment: commentText,
            imageDataUrl: uploadedPhotoDataUrl
          });
        }
        updateRatingSummaryDisplay();
        renderProductReviews();
        if (typeof window.showCartToast === "function") {
          window.showCartToast("Cảm ơn bạn đã gửi đánh giá sản phẩm!", { type: "success" });
        }
      });
    }
  }

  renderProductReviews();
  window.addEventListener("bakemate:authChanged", renderProductReviews);

  // Khối "Thường được mua cùng"
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
        const result = window.addToCart(targetId, 1, 0, null);
        if (typeof window.showCartToast === "function") {
          window.showCartToast(result.message, {
            type: result.success ? (result.capped ? "warning" : "success") : "warning"
          });
        }
      });
    }
  }

  function renderPdRecentViewed() {
    if (!recentSection || !recentGrid || typeof window.getRecentProducts !== "function") {
      return;
    }
    const ids = window.getRecentProducts().filter((id) => Number(id) !== Number(product.id));
    const recentItems = ids
      .map((id) => productList.find((p) => Number(p.id) === Number(id)))
      .filter(Boolean)
      .slice(0, 4);

    if (recentItems.length === 0) {
      recentSection.hidden = true;
      recentGrid.innerHTML = "";
      return;
    }

    recentSection.hidden = false;
    recentGrid.innerHTML = recentItems
      .map(
        (item) => `
          <a href="product-detail.html?id=${item.id}" class="recent-viewed-card">
            <div class="recent-viewed-card__img-wrap">
              <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="recent-viewed-card__img" onerror="this.onerror=null;this.src='${escapeHtml(FALLBACK_IMG)}';">
            </div>
            <div class="recent-viewed-card__body">
              <div class="recent-viewed-card__title">${escapeHtml(item.name)}</div>
              <div class="recent-viewed-card__meta">${escapeHtml(item.brand || "BakeMate")} · ${escapeHtml(item.packagingLabel || item.category)}</div>
              <div class="recent-viewed-card__price">${escapeHtml(formatPrice(item.price))}</div>
            </div>
          </a>
        `
      )
      .join("");
  }

  renderPdRecentViewed();
  if (btnClearRecent) {
    btnClearRecent.addEventListener("click", function () {
      if (typeof window.clearRecentProducts === "function") {
        window.clearRecentProducts();
        renderPdRecentViewed();
      }
    });
  }
});
