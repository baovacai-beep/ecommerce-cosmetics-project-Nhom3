/*
 * =====================================================
 * BAKEMATE - KHO BÀI VIẾT BLOG & KIẾN THỨC LÀM BÁNH
 * Tệp: js/blog-data.js (Dùng chung cho blog.html & blog-detail.html)
 * =====================================================
 */

(function () {
  const BLOG_POSTS = [
    {
        "id": "post-bong-lan-chiffon",
        "recipeGroupId": "recipe-bong-lan",
        "title": "Bí quyết làm bánh bông lan Chiffon mềm mịn, nở cao không xẹp mặt",
        "category": "Bí quyết làm bánh",
        "displayMode": "CÔNG THỨC + GIỎ",
        "readTime": "60 phút thực hiện",
        "diff": "Trung bình",
        "author": "BakeMate Studio",
        "publishedAt": "12/11/2026",
        "image": "images/blog/bai-01/1.jpg",
        "gallery": [
            "images/blog/bai-01/1.jpg",
            "images/blog/bai-01/2.png",
            "images/blog/bai-01/3.png"
        ],
        "keywords": [
            "bông lan",
            "chiffon",
            "bột mì số 8",
            "tartar",
            "combo bánh bông lan"
        ],
        "excerpt": "Chọn đúng bột mì số 8 có hàm lượng protein thấp 8–9% và ổn định lòng trắng trứng với Bột làm bánh Tartar giúp cốt bánh bông nhẹ tan ngay trong miệng.",
        "steps": [
            "Tách riêng lòng đỏ và lòng trắng trứng gà ở nhiệt độ phòng; làm nóng trước lò ở 165°C trong 15 phút.",
            "Trộn đều lòng đỏ với Sữa tươi Vinamilk, dầu ăn và rây 120g Bột mì số 8 vào khuấy theo một chiều cho mịn mượt.",
            "Đánh bông lòng trắng với 4g Bột làm bánh Tartar và 100g đường tinh luyện theo 3 lần chia cho đến khi đạt chóp mềm uốn cong.",
            "Trộn nhẹ nhàng (fold) hỗn hợp lòng trắng vào âu lòng đỏ theo kỹ thuật hất từ đáy âu lên để không vỡ bọt khí.",
            "Đổ bột vào khuôn tròn 20cm và nướng 40–45 phút ở 160–165°C, úp ngược khuôn ngay khi lấy ra để bánh không bị xẹp mặt."
        ]
    },
    {
        "id": "post-phan-biet-bot-mi",
        "recipeGroupId": "recipe-matcha-cupcake",
        "title": "Phân biệt bột mì số 8, số 11 và bột mì đa dụng: Chọn đúng bột cho từng loại bánh",
        "category": "Hiểu về nguyên liệu",
        "displayMode": "CHỮ + HÌNH",
        "readTime": "5 phút đọc",
        "diff": "Dễ",
        "author": "BakeMate Studio",
        "publishedAt": "10/11/2026",
        "image": "images/blog/bai-02/1.jfif",
        "gallery": [
            "images/blog/bai-02/1.jfif",
            "images/blog/bai-02/2.jfif",
            "images/blog/bai-02/3.jpg"
        ],
        "keywords": [
            "phân biệt bột mì",
            "bột mì số 8",
            "bột mì số 11",
            "bột mì đa dụng",
            "protein"
        ],
        "excerpt": "Tại sao làm bánh bông lan dùng bột mì số 11 lại dễ bị cứng, còn làm bánh mì hoa cúc dùng bột số 8 lại kém dai? Bảng đối chiếu protein và cách chọn gói 100g–1kg giúp bạn mua chuẩn ngay từ lần đầu.",
        "steps": [
            "Bột mì Baker's Choice số 8 (Cake Flour · 8–9% protein): Mịn nhẹ, ít gluten giúp bông lan, chiffon, cupcake và cookies bơ mềm xốp tơi nhẹ.",
            "Bột mì Baker's Choice số 11 (Bread Flour · 11.5–13% protein): Gluten cao tạo mạng lưới giữ khí khỏe, lý tưởng cho bánh mì hoa cúc, sandwich và baguette.",
            "Bột mì đa dụng Meizan (All-Purpose · 9.5–11.5% protein): Cân bằng linh hoạt giữa mềm và giòn, phù hợp làm Chocolate Muffin, Brownie và Pancake.",
            "Gợi ý tiết kiệm tại BakeMate: Cửa hàng có đủ cả 3 sản phẩm Bột mì số 8 (#1), Bột mì số 11 (#2) và Bột mì đa dụng Meizan (#3) với quy cách túi nhỏ 100g/300g đến 1kg."
        ]
    },
    {
        "id": "post-banh-mi-hoa-cuc",
        "recipeGroupId": "recipe-hoa-cuc",
        "title": "Bánh mì hoa cúc thơm bơ sữa: Bí quyết nhào bột mềm dai, kéo sợi đẹp",
        "category": "Kỹ thuật & dụng cụ",
        "displayMode": "CHỮ + VIDEO",
        "readTime": "120 phút thực hiện",
        "diff": "Khó",
        "author": "BakeMate Studio",
        "publishedAt": "08/11/2026",
        "image": "images/blog/bai-03/1.jpg",
        "gallery": [
            "images/blog/bai-03/1.jpg",
            "images/blog/bai-03/2.jfif"
        ],
        "keywords": [
            "bánh mì hoa cúc",
            "nhào bột",
            "kéo màng",
            "bột mì số 11",
            "men nở",
            "king arthur baking"
        ],
        "excerpt": "Bí mật tạo nên từng thớ bánh dai mềm kéo sợi nằm ở bột mì số 11 giàu gluten, kích hoạt men ở đúng 38°C và kỹ thuật nhào bột gập kéo chuẩn King Arthur Baking.",
        "steps": [
            "Hòa tan 8g Men nở Mauripan với 100ml Sữa tươi Vinamilk ấm 38°C (kiểm tra bằng nhiệt kế điện tử) và đường tinh luyện, để men nổi bọt gạch cua sau 10 phút.",
            "Trộn 260g Bột mì số 11 cùng trứng gà thành khối kết dính, sau đó nhào đẩy-gập (push & fold) nhịp nhàng theo hướng dẫn video của King Arthur Baking.",
            "Thêm từng lát Bơ lạt Anchor mềm vào nhào tiếp 10–12 phút đến khi kéo được màng mỏng đàn hồi (windowpane test) không rách.",
            "Ủ bột lần 1 trong 50 phút cho nở gấp đôi, chia 3 dải thắt bím đặt khuôn, ủ lần 2 thêm 35 phút rồi nướng ở 175°C trong 25–28 phút."
        ],
        "videoUrl": "https://www.youtube.com/embed/KToPmRXEQ3c",
        "videoTitle": "Video hướng dẫn kỹ thuật nhào bột bánh mì — King Arthur Baking Company"
    },
    {
        "id": "post-muffin-socola",
        "recipeGroupId": "recipe-muffin-socola",
        "title": "Muffin Chocolate mềm ẩm: Công thức đơn giản cho người mới bắt đầu",
        "category": "Bí quyết làm bánh",
        "displayMode": "CÔNG THỨC + GIỎ",
        "readTime": "45 phút thực hiện",
        "diff": "Dễ",
        "author": "BakeMate Studio",
        "publishedAt": "06/11/2026",
        "image": "images/blog/bai-04/1.jpg",
        "gallery": [
            "images/blog/bai-04/1.jpg",
            "images/blog/bai-04/2.png",
            "images/blog/bai-04/3.jfif"
        ],
        "keywords": [
            "muffin chocolate",
            "mới bắt đầu",
            "bột cacao",
            "baking soda"
        ],
        "excerpt": "Không cần máy đánh trứng cầu kỳ — chỉ với phới lồng tay, bột cacao Hershey's nguyên chất, bột mì đa dụng Meizan và Baking Soda là bạn đã có mẻ muffin ẩm mịn.",
        "steps": [
            "Xếp 6 cup giấy nướng bánh vào Khuôn Nướng Cupcake & Muffin; làm nóng lò ở 180°C trước 10 phút.",
            "Đun chảy 80g Bơ lạt Anchor và hòa tan đều với 35g Bột cacao Hershey's để khơi dậy mùi socola đậm đà.",
            "Đánh tan 1 quả trứng với 120ml Sữa tươi Vinamilk và đường, rây 150g Bột mì đa dụng Meizan + 5g Baking Soda vào trộn vừa quyện.",
            "Chia đều bột đầy 2/3 cup giấy và nướng ở 180°C trong 22–25 phút cho đến khi tăm xiên vào rút ra sạch."
        ]
    },
    {
        "id": "post-brownie-giot-am",
        "recipeGroupId": "recipe-brownie",
        "title": "5 bí quyết giúp Brownie có lớp vỏ bóng đẹp, bên trong mềm ẩm",
        "category": "Bí quyết làm bánh",
        "displayMode": "CHỮ + HÌNH",
        "readTime": "50 phút thực hiện",
        "diff": "Dễ",
        "author": "BakeMate Studio",
        "publishedAt": "04/11/2026",
        "image": "images/blog/bai-05/1.jpg",
        "gallery": [
            "images/blog/bai-05/1.jpg",
            "images/blog/bai-05/2.jpg",
            "images/blog/bai-05/3.jfif"
        ],
        "keywords": [
            "brownie",
            "vỏ bóng",
            "ẩm dẻo",
            "giấy nến",
            "nhiệt kế"
        ],
        "excerpt": "Lớp vỏ nứt bóng như gương (crinkly top) và kết cấu ruột fudge ẩm dẻo nằm ở nhiệt độ hòa bơ-cacao 50°C, thời gian đánh tan đường và cách căn giờ nướng chuẩn.",
        "steps": [
            "Bí quyết 1 — Nhiệt độ tan bơ cacao: Giữ ở 50–55°C bằng nhiệt kế điện tử để cacao thơm sâu mà không bị cháy khét.",
            "Bí quyết 2 — Hòa tan đường hoàn toàn: Đánh trứng với 110g đường tinh luyện cho tới khi sệt mịn để tạo lớp màng đường bóng nứt trên mặt.",
            "Bí quyết 3 — Lượng bột tối thiểu: Chỉ dùng 85g Bột mì đa dụng Meizan (gói 100g) và trộn fold nhẹ để ruột bánh mềm dẻo.",
            "Bí quyết 4 & 5 — Lót giấy nến dư mép khuôn và canh đúng 25 phút ở 175°C, để nguội hẳn trước khi cắt thành miếng vuông sắc nét."
        ]
    },
    {
        "id": "post-banh-quy-bo",
        "recipeGroupId": "recipe-banh-quy-bo",
        "title": "Cân điện tử hay ca đong? Cách đo nguyên liệu chính xác khi làm bánh",
        "category": "Kỹ thuật & dụng cụ",
        "displayMode": "CHỮ + VIDEO",
        "readTime": "6 phút đọc",
        "diff": "Dễ",
        "author": "BakeMate Studio",
        "publishedAt": "02/11/2026",
        "image": "images/blog/bai-06/1.png",
        "gallery": [
            "images/blog/bai-06/1.png",
            "images/blog/bai-06.png"
        ],
        "keywords": [
            "cân điện tử",
            "ca đong",
            "đo bột mì",
            "king arthur baking",
            "gram"
        ],
        "excerpt": "Cùng một \"cốc\" bột mì nhưng múc trực tiếp có thể nặng hơn tới 30% so với dùng cân điện tử. Xem ngay hướng dẫn chuẩn xác từ King Arthur Baking và cách kết hợp cân + ca đong.",
        "steps": [
            "Nguyên liệu khô (bột mì, đường, cacao, gelatine, men nở): Luôn ưu tiên đo bằng Cân điện tử nhà bếp chia 1g vì sai số bằng 0 và không nén chặt bột.",
            "Khi dùng cup/ca đong trong tình huống gấp: Áp dụng kỹ thuật \"Fluff, Spoon & Level\" (đảo tơi bột, dùng thìa múc nhẹ vào cup và gạt ngang mặt).",
            "Chất lỏng (Sữa tươi Vinamilk, nước, Whipping Cream): Dùng Ca đong nguyên liệu đặt trên mặt phẳng ngang tầm mắt để đọc đúng vạch ml.",
            "Gợi ý từ Shop BakeMate: Trang bị sẵn Cân điện tử nhà bếp (#7), Ca đong nguyên liệu (#8) và Thìa đong định lượng (#9) để làm bánh bách phát bách trúng."
        ],
        "videoUrl": "https://www.youtube.com/embed/OFFlyjwocz0",
        "videoTitle": "Video hướng dẫn cách đong bột mì chính xác — King Arthur Baking Company"
    },
    {
        "id": "post-mousse-socola",
        "recipeGroupId": "recipe-mousse-socola",
        "title": "Mousse Chocolate không cần lò nướng: Mềm mịn, mát lạnh và đậm vị cacao",
        "category": "Bí quyết làm bánh",
        "displayMode": "CÔNG THỨC + GIỎ",
        "readTime": "75 phút thực hiện",
        "diff": "Trung bình",
        "author": "BakeMate Studio",
        "publishedAt": "30/10/2026",
        "image": "images/blog/bai-07/1.jfif",
        "gallery": [
            "images/blog/bai-07/1.jfif",
            "images/blog/bai-07/2.jfif"
        ],
        "keywords": [
            "mousse chocolate",
            "không cần lò nướng",
            "whipping cream",
            "lá gelatine ewald"
        ],
        "excerpt": "Chỉ cần Whipping Cream Anchor giữ lạnh 2–4°C, Lá Gelatine Ewald Bronze, bột cacao Hershey's đậm vị và khuôn đế rời 20cm để tạo nên chiếc Mousse tan chảy mát lạnh.",
        "steps": [
            "Ngâm mềm 10g Lá Gelatine Ewald trong nước đá lạnh 5–10 phút rồi vắt ráo; hòa tan 35g cacao Hershey's với 120ml Sữa tươi Vinamilk ấm và khuấy tan gelatine.",
            "Làm lạnh âu Inox và đánh 250ml Whipping Cream Anchor lạnh đến khi kem sánh đặc tạo vân mềm chảy nhẹ (soft peak).",
            "Trộn nhẹ (fold) sốt cacao đã nguội bớt (~30°C) vào kem tươi theo một chiều cho hòa quyện đều, đổ vào khuôn tròn đế rời 20cm.",
            "Giữ lạnh ngăn mát ít nhất 4 giờ cho bánh định hình hoàn toàn, dùng khăn ấm lau nhẹ quanh thành khuôn rồi tách bánh ra Đế Lót Bánh Mousse."
        ]
    },
    {
        "id": "post-pancake-mat-ong",
        "recipeGroupId": "recipe-pancake",
        "title": "Pancake không bông xốp? 5 lỗi thường gặp khi làm bánh tại nhà",
        "category": "Cảm hứng vào bếp",
        "displayMode": "CHỮ + HÌNH",
        "readTime": "25 phút thực hiện",
        "diff": "Dễ",
        "author": "BakeMate Studio",
        "publishedAt": "28/10/2026",
        "image": "images/blog/bai-08/1.jfif",
        "gallery": [
            "images/blog/bai-08/1.jfif",
            "images/blog/bai-08/2.jfif",
            "images/blog/bai-08/3.jfif"
        ],
        "keywords": [
            "pancake mật ong",
            "lỗi làm pancake",
            "không bông xốp",
            "baking soda",
            "bữa sáng"
        ],
        "excerpt": "Vì sao mẻ Pancake sáng cuối tuần của bạn bị xẹp mỏng hoặc dai cứng? Kiểm tra ngay 5 lỗi phổ biến từ việc khuấy bột quá kỹ tới nhiệt độ chảo áp mặt bánh.",
        "steps": [
            "Lỗi 1 — Khuấy bột quá lâu: Làm phát triển mạng gluten khiến Pancake bị dai. Chỉ khuấy vừa tan bột khô (vẫn còn vài gợn li ti là chuẩn).",
            "Lỗi 2 — Bỏ qua thời gian bột nghỉ: Hãy để âu bột nghỉ 10 phút giúp tinh bột ngậm ẩm và Baking Soda kịp hoạt hóa.",
            "Lỗi 3 — Đong thiếu cân bằng lỏng/khô: Dùng Ca đong đo đúng 180ml Sữa tươi Vinamilk cho 150g Bột mì đa dụng Meizan.",
            "Lỗi 4 & 5 — Chảo quá nóng hoặc lật bánh quá sớm: Giữ lửa vừa nhỏ và chỉ lật khi mặt bánh nổi bọt khí vỡ đều quanh mép."
        ]
    }
];

  function getBlogPostById(postId) {
    const id = String(postId || "").trim();
    return BLOG_POSTS.find((p) => p.id === id) || null;
  }

  if (typeof window !== "undefined") {
    window.BLOG_POSTS = BLOG_POSTS;
    window.getBlogPostById = getBlogPostById;
  }
})();