/*
 * =====================================================
 * BAKEMATE - KHO BÀI VIẾT BLOG & KIẾN THỨC LÀM BÁNH
 * Tệp: js/blog-data.js (Dùng chung cho blog.html & blog-detail.html)
 * =====================================================
 */

(function () {
  const BLOG_POSTS = [
    {
      id: "post-bong-lan-chiffon",
      recipeGroupId: "recipe-bong-lan",
      title: "Bí quyết làm Bánh Bông Lan Chiffon mềm ẩm, nở cao không xẹp mặt",
      category: "Công thức làm bánh",
      readTime: "55 phút thực hiện",
      diff: "Dễ",
      author: "Minh Thư · BakeMate Studio",
      publishedAt: "08/11/2026",
      image: "images/about-baking.jpg",
      keywords: ["bông lan", "bông lan chiffon", "bột mì số 8", "cream of tartar"],
      excerpt:
        "Chọn đúng bột mì số 8 có hàm lượng protein thấp 8–9% và ổn định lòng trắng trứng với Cream of Tartar giúp cốt bánh bông nhẹ tan ngay trong miệng.",
      steps: [
        "Tách riêng 5 lòng đỏ và 5 lòng trắng trứng gà ở nhiệt độ phòng; làm nóng trước lò ở 160°C trong 15 phút.",
        "Trộn đều lòng đỏ với sữa tươi, dầu ăn và rây 120g Bột mì số 8 vào khuấy theo một chiều cho mịn mượt.",
        "Đánh bông lòng trắng với 1/2 thìa Cream of Tartar và 100g đường tinh luyện theo 3 lần chia cho đến khi đạt chóp mềm uốn cong.",
        "Trộn nhẹ nhàng (fold) hỗn hợp lòng trắng vào âu lòng đỏ theo kỹ thuật hất từ đáy âu lên để không vỡ bọt khí.",
        "Đổ bột vào khuôn tròn 20cm và nướng cách thủy hoặc nướng ở 155–160°C trong 45 phút, úp ngược khuôn ngay khi lấy ra."
      ]
    },
    {
      id: "post-banh-mi-hoa-cuc",
      recipeGroupId: "recipe-hoa-cuc",
      title: "Cách làm Bánh Mì Hoa Cúc ngàn lớp thơm lừng bơ sữa tại nhà",
      category: "Công thức làm bánh",
      readTime: "90 phút thực hiện",
      diff: "Vừa",
      author: "Gia Bảo · BakeMate Kitchen",
      publishedAt: "06/11/2026",
      image: "images/about-young-bakers.jpg",
      keywords: ["bánh mì hoa cúc", "bột mì số 11", "bơ lạt anchor"],
      excerpt:
        "Bí mật tạo nên từng thớ bánh dai mềm kéo sợi nằm ở bột mì số 11 giàu gluten kết hợp cùng bơ lạt Anchor nguyên chất 82.9% béo sữa.",
      steps: [
        "Cân chuẩn 260g Bột mì Baker's Choice số 11, trộn cùng men nở, đường tinh luyện và sữa ấm 38°C.",
        "Nhồi bột đến khi kết khối dẻo mịn, sau đó cho từng lát bơ lạt Anchor ở nhiệt độ phòng vào nhồi tiếp đến khi kéo được màng mỏng không rách.",
        "Ủ bột lần 1 trong 50 phút cho nở gấp đôi; chia bột làm 3 hoặc 6 phần bằng nhau, cán dài và thắt bím đặt vào khuôn.",
        "Ủ lần 2 thêm 35 phút, phết lớp trứng đánh loãng lên mặt bánh rồi nướng ở 175°C khoảng 25–28 phút đến khi chín vàng ruộm."
      ]
    },
    {
      id: "post-muffin-socola",
      recipeGroupId: "recipe-muffin-socola",
      title: "Muffin Chocolate Hạnh Nhân chỉ 40 phút cho buổi trà chiều",
      category: "Công thức làm bánh",
      readTime: "40 phút thực hiện",
      diff: "Dễ",
      author: "Bảo Ngọc · BakeMate Community",
      publishedAt: "05/11/2026",
      image: "images/banner.jpg",
      keywords: ["muffin", "socola", "bột cacao", "cup giấy"],
      excerpt:
        "Không cần máy đánh trứng cầu kỳ — chỉ với phới lồng tay, bột cacao Hershey's nguyên chất và cup giấy nướng bánh là bạn đã có ngay khay muffin thơm nồng.",
      steps: [
        "Xếp 12 cup giấy nướng bánh vào khay muffin; làm nóng lò nướng ở 180°C trước 10 phút.",
        "Đun chảy 80g bơ lạt Anchor cùng một chút dầu ăn, hòa tan đều với 35g bột cacao Hershey's để khơi dậy mùi socola đậm đà.",
        "Rây 150g bột mì đa dụng Meizan cùng bột nở vào âu hỗn hợp ướt, khuấy vừa quyện hết bột khô (tránh trộn quá tay gây chai bánh).",
        "Chia đều bột đầy 2/3 cup giấy và nướng ở 180°C trong 22–25 phút cho đến khi tăm xiên vào rút ra sạch."
      ]
    },
    {
      id: "post-phan-biet-bot-mi",
      recipeGroupId: "recipe-matcha-cupcake",
      title: "Phân biệt Bột Mì Số 8, Số 11 và Đa Dụng — Mua đúng khỏi tốn tiền oan",
      category: "Nguyên liệu làm bánh",
      readTime: "5 phút đọc",
      diff: "Dễ",
      author: "Như Hậu · BakeMate Content",
      publishedAt: "03/11/2026",
      image: "images/about-ingredients.jpg",
      keywords: ["phân biệt bột mì", "bột mì số 8", "bột mì số 11", "bông lan", "cupcake"],
      excerpt:
        "Tại sao làm bánh bông lan dùng bột mì số 11 lại bị cứng, còn làm bánh mì dùng bột số 8 lại dễ bở? Tìm hiểu ngay tỉ lệ protein và quy cách túi 100g–1kg tối ưu.",
      steps: [
        "Bột mì số 8 (Cake Flour, 8–9% protein): Ít gluten giúp bánh bông lan, chiffon, cupcake matcha mềm xốp và giữ độ ẩm lâu.",
        "Bột mì số 11 (Bread Flour, 11.5–13% protein): Gluten cao tạo mạng lưới giữ khí khỏe, bắt buộc phải có cho bánh mì hoa cúc, baguette và đế pizza.",
        "Bột mì đa dụng (All-Purpose, 9.5–11.5% protein): Cân bằng linh hoạt giữa mềm và giòn, phù hợp cho muffin, bánh quy, pancake bữa sáng.",
        "Mẹo tiết kiệm BakeMate: Nếu mới thử làm 1 mẻ bánh nhỏ, hãy chọn quy cách túi 100g hoặc 300g ngay tại trang chi tiết sản phẩm để tránh tồn bột quá hạn."
      ]
    },
    {
      id: "post-brownie-giot-am",
      recipeGroupId: "recipe-brownie",
      title: "Kỹ thuật nướng Bánh Brownie Chocolate mặt bóng vỡ, ruột ẩm dẻo",
      category: "Kiến thức làm bánh",
      readTime: "45 phút thực hiện",
      diff: "Dễ",
      author: "Nguyễn Thương · BakeMate Baker",
      publishedAt: "01/11/2026",
      image: "images/contact-baking.jpg",
      keywords: ["brownie", "socola", "giấy nến", "nhiệt kế"],
      excerpt:
        "Hai bí quyết vàng quyết định thành công của khay Brownie chuẩn Mỹ: nhiệt độ bơ-cacao cách thủy 50°C và lót giấy nến chống dính để nhấc nguyên khối.",
      steps: [
        "Dùng nhiệt kế điện tử kiểm tra hỗn hợp 120g bơ lạt và 50g bột cacao Hershey's khi đun cách thủy, giữ quanh 50–55°C.",
        "Đánh trứng và đường đến khi đường tan hoàn toàn và bề mặt hơi sánh sáng — đây là bí quyết tạo lớp mặt bóng nứt đặc trưng.",
        "Trộn nhẹ 85g bột mì đa dụng (túi nhỏ 100g vừa khít công thức) vào hỗn hợp cacao rồi đổ lên khay đã lót sẵn giấy nến nướng bánh.",
        "Nướng ở 175°C khoảng 24–26 phút; để nguội hoàn toàn trước khi nhấc hai đầu giấy nến cắt thành 9 miếng vuông gọn sắc."
      ]
    },
    {
      id: "post-banh-quy-bo",
      recipeGroupId: "recipe-banh-quy-bo",
      title: "Cẩm nang cân đo và bắt đui Bánh Quy Bơ Đan Mạch giòn tan sắc nét",
      category: "Dụng cụ làm bánh",
      readTime: "40 phút thực hiện",
      diff: "Dễ",
      author: "Đen Ny · BakeMate Craft",
      publishedAt: "29/10/2026",
      image: "images/about-sharing-cakes.jpg",
      keywords: ["bánh quy bơ", "cookies", "đui bắt kem", "cân điện tử"],
      excerpt:
        "Chỉ cần cân điện tử chia chuẩn 1g, bơ lạt mềm đánh bông trắng ngà và bộ đui bắt kem Inox 304, bạn sẽ dễ dàng cho ra lò mẻ bánh quy hoa hồng giòn rụm.",
      steps: [
        "Cân chính xác 150g bơ lạt Anchor để mềm ở nhiệt độ phòng (không chảy nước), đánh bông cùng đường bột đến khi chuyển màu kem nhạt.",
        "Trộn 180g Bột mì số 8 đã rây mịn vào âu bơ theo kỹ thuật cắt bột để khối bột mềm dẻo nhưng không quá chảy.",
        "Lắp đui sao mở trong bộ 12 đui Inox vào túi bắt kem vân nhám chống trượt, cho bột vào nửa túi và bắt thành từng bông hoa lên khay lót giấy nến.",
        "Làm lạnh khay bánh 15 phút trước khi cho vào lò ở 170°C trong 15–18 phút giúp giữ vân bánh sắc nét không bị chảy dẹt."
      ]
    },
    {
      id: "post-mousse-socola",
      recipeGroupId: "recipe-mousse-socola",
      title: "Bánh Mousse Socola Lạnh mịn mượt không cần lò nướng, tách khuôn sắc nét",
      category: "Kiến thức làm bánh",
      readTime: "75 phút thực hiện",
      diff: "Vừa",
      author: "Minh Thư · BakeMate Studio",
      publishedAt: "27/10/2026",
      image: "images/about-ingredients.jpg",
      keywords: ["mousse", "whipping cream", "bông lan lạnh", "khuôn đế rời"],
      excerpt:
        "Chỉ cần Whipping Cream Anchor làm lạnh đúng 2–4°C, bột cacao Hershey's đậm vị, phới lồng Inox và khuôn đế rời 20cm để tạo nên chiếc mousse tan chảy mát lạnh.",
      steps: [
        "Hòa tan 35g bột cacao Hershey's với 60ml nước ấm hoặc sữa ấm bằng phới lồng Inox sao cho hỗn hợp bóng mượt không vón cục, để nguội về khoảng 35°C.",
        "Làm lạnh âu trộn và đánh 250ml Whipping Cream Anchor lạnh với phới lồng đến khi kem sánh đặc, tạo vân mềm nhưng vẫn chảy nhẹ.",
        "Trộn nhẹ (fold) hỗn hợp cacao vào kem tươi đã đánh theo một chiều cho hòa quyện đều, đổ vào khuôn tròn đế rời 20cm đã lót sẵn đế bánh.",
        "Giữ lạnh trong ngăn mát ít nhất 4 giờ cho bánh định hình hoàn toàn, dùng khăn ấm lau quanh thành khuôn rồi đẩy nhẹ phần đế rời để tách bánh nguyên vẹn."
      ]
    },
    {
      id: "post-pancake-mat-ong",
      recipeGroupId: "recipe-pancake",
      title: "Bánh Pancake Mật Ong bữa sáng mềm xốp chỉ 25 phút với bột mì đa dụng",
      category: "Mẹo & kinh nghiệm",
      readTime: "25 phút thực hiện",
      diff: "Dễ",
      author: "Bảo Ngọc · BakeMate Kitchen",
      publishedAt: "25/10/2026",
      image: "images/about-beginner.jpg",
      keywords: ["pancake", "bữa sáng", "bột mì đa dụng", "ca đong"],
      excerpt:
        "Công thức bữa sáng nhanh gọn tại nhà: định lượng sữa tươi bằng ca đong chia ml rõ nét, đánh tan trứng gà tươi cùng 150g bột mì đa dụng Meizan cho mẻ pancake vàng ươm.",
      steps: [
        "Rây 150g bột mì đa dụng Meizan (chọn túi 300g tiết kiệm) cùng 40g đường tinh luyện và một chút muối vào âu trộn.",
        "Dùng ca đong đo chuẩn 180ml sữa tươi, đập 2 quả trứng gà tươi vào khuấy nhẹ rồi rót từ từ vào âu bột khô.",
        "Khuấy đều vừa quyện đến khi hỗn hợp hơi sánh mịn (không cần đánh quá kỹ để bánh giữ độ xốp), để bột nghỉ 10 phút.",
        "Làm nóng chảo chống dính ở lửa vừa nhỏ, dùng ca đong rót từng muôi bột tròn đều; lật mặt khi bề mặt nổi bọt khí và nướng thêm 1 phút đến khi vàng đều hai mặt."
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
