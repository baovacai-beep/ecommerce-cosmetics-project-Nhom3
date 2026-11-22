/*
 * =====================================================
 * BAKEMATE - KHO CÔNG THỨC CHUẨN VỊ & QUY ĐỔI ĐỊNH LƯỢNG (F05 - F11)
 * Tệp: js/recipes-data.js
 * =====================================================
 */

(function () {
  const RECIPES_LIST = [
    {
        "id": "recipe-bong-lan",
        "code": "RECIPE NO. 01",
        "title": "Bánh bông lan cơ bản",
        "subtitle": "Cốt bánh mềm ẩm, bông xốp nhẹ tan nhờ bột mì số 8 và kỹ thuật ổn định lòng trắng.",
        "category": "Bánh ngọt",
        "tags": [
            "Bánh ngọt",
            "Bánh kem"
        ],
        "rating": "4.9",
        "bakeMinutes": 45,
        "time": "60 phút",
        "diff": "Trung bình",
        "defaultServings": 1,
        "servingsUnit": "Số ổ (20cm)",
        "yieldLabel": "1 ổ 20cm (4 người ăn)",
        "peopleLabel": "4 người",
        "image": "images/recipes/banh-bong-lan-co-ban.jpg",
        "tips": [
            "Dùng trứng gà ở nhiệt độ phòng giúp lòng trắng dễ đánh bông đạt chóp mềm và không bị tách nước.",
            "Luôn rây mịn bột mì số 8 trước khi trộn (fold) theo một chiều từ dưới đáy âu lên để giữ trọn bọt khí.",
            "Úp ngược khuôn ngay khi lấy ra khỏi lò để cốt bánh giữ độ cao phẳng mịn không bị xẹp mặt."
        ],
        "steps": [
            "Tách riêng lòng đỏ và lòng trắng trứng gà ở nhiệt độ phòng; làm nóng trước lò nướng ở 165°C trong 15 phút.",
            "Khuấy đều lòng đỏ với Sữa tươi Vinamilk, dầu ăn và rây Bột mì số 8 vào trộn đến khi hỗn hợp mịn mượt.",
            "Đánh bông lòng trắng trứng với Bột làm bánh Tartar và Đường tinh luyện chia làm 3 lần đến khi đạt chóp mềm uốn cong.",
            "Chia hỗn hợp lòng trắng thành 3 phần, trộn nhẹ (fold) vào âu lòng đỏ rồi đổ vào khuôn 20cm nướng 40–45 phút."
        ],
        "ingredients": [
            {
                "name": "Bột mì Baker's Choice số 8",
                "baseAmount": 120,
                "unit": "g",
                "productId": 1,
                "optionIndex": 2,
                "packageAmount": 300
            },
            {
                "name": "Đường tinh luyện Biên Hòa",
                "baseAmount": 100,
                "unit": "g",
                "productId": 13,
                "optionIndex": 1,
                "packageAmount": 500
            },
            {
                "name": "Trứng gà",
                "baseAmount": 4,
                "unit": "quả",
                "productId": 15,
                "optionIndex": 1,
                "packageAmount": 6
            },
            {
                "name": "Sữa Tươi Tiệt Trùng Không Đường Vinamilk 100%",
                "baseAmount": 80,
                "unit": "ml",
                "productId": 24,
                "optionIndex": 1,
                "packageAmount": 720
            },
            {
                "name": "Bột làm bánh Tartar",
                "baseAmount": 4,
                "unit": "g",
                "productId": 14,
                "optionIndex": 1,
                "packageAmount": 50
            },
            {
                "name": "Tinh chất vani thực phẩm",
                "baseAmount": 5,
                "unit": "ml",
                "productId": null,
                "optionIndex": 0,
                "packageAmount": 0,
                "note": "Chưa có sản phẩm phù hợp"
            }
        ],
        "tools": [
            {
                "name": "Khuôn bánh bông lan tròn chống dính (20cm)",
                "productId": 17,
                "optionIndex": 0,
                "desc": "Đế rời dễ tách bánh nguyên vẹn"
            },
            {
                "name": "Máy Đánh Trứng Cầm Tay Philips HR3705",
                "productId": 28,
                "optionIndex": 0,
                "desc": "Đánh bông lòng trắng trứng nhanh mịn"
            },
            {
                "name": "Tô Trộn Inox",
                "productId": 29,
                "optionIndex": 0,
                "desc": "Âu rộng thoải mái trộn bột không tràn"
            },
            {
                "name": "Rây Bột",
                "productId": 30,
                "optionIndex": 0,
                "desc": "Rây mịn bột mì giúp cốt bánh tơi xốp"
            },
            {
                "name": "Cân điện tử nhà bếp",
                "productId": 7,
                "optionIndex": 0,
                "desc": "Cân chính xác định lượng 1g"
            },
            {
                "name": "Đế Bánh Kem",
                "productId": 37,
                "optionIndex": 0,
                "desc": "Đế cứng nâng bánh trang trí gọn đẹp"
            }
        ]
    },
    {
        "id": "recipe-matcha-cupcake",
        "code": "RECIPE NO. 02",
        "title": "Bánh cupcake Matcha",
        "subtitle": "Những chiếc cupcake mềm thơm kết hợp bột mì số 8, Matcha Nhật và lớp kem whipping mịn mượt.",
        "category": "Bánh ngọt",
        "tags": [
            "Bánh ngọt",
            "Bánh kem"
        ],
        "rating": "4.8",
        "bakeMinutes": 22,
        "time": "50 phút",
        "diff": "Dễ",
        "defaultServings": 6,
        "servingsUnit": "Số lượng (chiếc)",
        "yieldLabel": "6 chiếc (6 người ăn)",
        "peopleLabel": "6 người",
        "image": "images/recipes/banh-cupcake-matcha.jpg",
        "tips": [
            "Whipping Cream cần giữ lạnh sâu 2–4°C trước khi đánh để lên phom đứng sắc nét khi bắt đui.",
            "Chỉ đổ bột đầy khoảng 2/3 cup giấy để bánh nở tròn đẹp không bị tràn viền khi nướng."
        ],
        "steps": [
            "Xếp cup giấy nướng bánh vào Khuôn Nướng Cupcake & Muffin và bật lò làm nóng trước ở 175°C.",
            "Đánh tan Bơ lạt Anchor mềm với đường tinh luyện đến khi chuyển màu kem nhạt, cho trứng và sữa tươi vào đánh đều.",
            "Rây Bột mì số 8 và Bột Matcha vào âu, trộn nhẹ tay vừa quyện hết bột khô.",
            "Múc bột vào cup giấy nướng 22 phút; để nguội hẳn rồi dùng túi bắt kem + đui Inox trang trí Whipping Cream lên mặt bánh."
        ],
        "ingredients": [
            {
                "name": "Bột mì Baker's Choice số 8",
                "baseAmount": 140,
                "unit": "g",
                "productId": 1,
                "optionIndex": 2,
                "packageAmount": 300
            },
            {
                "name": "Bột Matcha",
                "baseAmount": 12,
                "unit": "g",
                "productId": 5,
                "optionIndex": 0,
                "packageAmount": 100
            },
            {
                "name": "Whipping Cream Anchor",
                "baseAmount": 200,
                "unit": "ml",
                "productId": 6,
                "optionIndex": 0,
                "packageAmount": 250
            },
            {
                "name": "Bơ lạt Anchor",
                "baseAmount": 85,
                "unit": "g",
                "productId": 12,
                "optionIndex": 0,
                "packageAmount": 227
            },
            {
                "name": "Sữa Tươi Tiệt Trùng Không Đường Vinamilk 100%",
                "baseAmount": 60,
                "unit": "ml",
                "productId": 24,
                "optionIndex": 1,
                "packageAmount": 720
            },
            {
                "name": "Đường tinh luyện Biên Hòa",
                "baseAmount": 90,
                "unit": "g",
                "productId": 13,
                "optionIndex": 1,
                "packageAmount": 500
            },
            {
                "name": "Trứng gà",
                "baseAmount": 2,
                "unit": "quả",
                "productId": 15,
                "optionIndex": 1,
                "packageAmount": 6
            }
        ],
        "tools": [
            {
                "name": "Khuôn Nướng Cupcake & Muffin",
                "productId": 31,
                "optionIndex": 0,
                "desc": "Khay 6 lỗ giữ dáng cup tròn đều"
            },
            {
                "name": "Cup giấy nướng bánh Cupcake",
                "productId": 19,
                "optionIndex": 0,
                "desc": "Giữ phom đứng và chống thấm dầu"
            },
            {
                "name": "Túi bắt kem dùng một lần",
                "productId": 11,
                "optionIndex": 0,
                "desc": "Bóp kem mượt đều không trượt tay"
            },
            {
                "name": "Bộ đui bắt kem Inox",
                "productId": 20,
                "optionIndex": 0,
                "desc": "Tạo vân hoa hồng & ngôi sao sắc nét"
            },
            {
                "name": "Hộp Đựng Cupcake",
                "productId": 34,
                "optionIndex": 1,
                "desc": "Đóng gói mang tặng lịch sự tiện lợi"
            }
        ]
    },
    {
        "id": "recipe-banh-quy-bo",
        "code": "RECIPE NO. 03",
        "title": "Cookies bơ",
        "subtitle": "Hương bơ sữa Anchor 82.9% béo ngậy cùng từng đường vân hoa cúc giòn tan.",
        "category": "Bánh quy",
        "tags": [
            "Bánh quy"
        ],
        "rating": "4.9",
        "bakeMinutes": 18,
        "time": "40 phút",
        "diff": "Dễ",
        "defaultServings": 1,
        "servingsUnit": "Số mẻ (~30 chiếc/mẻ)",
        "yieldLabel": "~30 chiếc (6 người ăn)",
        "peopleLabel": "6 người",
        "image": "images/recipes/cookies-bo.jpg",
        "tips": [
            "Bơ lạt chỉ nên để mềm ấn nhẹ lún tay (khoảng 18–20°C), không đun chảy lỏng sẽ làm bánh bị chảy bè khi nướng.",
            "Làm lạnh khay bánh đã bắt hình 15 phút trong ngăn mát trước khi đưa vào lò để vân hoa giữ nguyên nét."
        ],
        "steps": [
            "Đánh bông Bơ lạt Anchor với đường tinh luyện đến khi bông mịn sáng màu, thêm trứng gà vào đánh quyện.",
            "Rây Bột mì Baker's Choice số 8 vào âu, dùng phới trộn đều thành khối bột mịn dẻo.",
            "Lắp đui sao lớn vào túi bắt kem, cho bột vào và bóp tạo hình bông hoa trên khay nhôm đã lót giấy nến.",
            "Nướng ở 170°C khoảng 15–18 phút đến khi viền bánh ngả vàng thơm giòn, đóng gói trong túi zip giữ độ giòn lâu."
        ],
        "ingredients": [
            {
                "name": "Bột mì Baker's Choice số 8",
                "baseAmount": 180,
                "unit": "g",
                "productId": 1,
                "optionIndex": 2,
                "packageAmount": 300
            },
            {
                "name": "Bơ lạt Anchor",
                "baseAmount": 150,
                "unit": "g",
                "productId": 12,
                "optionIndex": 0,
                "packageAmount": 227
            },
            {
                "name": "Đường tinh luyện Biên Hòa",
                "baseAmount": 75,
                "unit": "g",
                "productId": 13,
                "optionIndex": 1,
                "packageAmount": 500
            },
            {
                "name": "Trứng gà",
                "baseAmount": 1,
                "unit": "quả",
                "productId": 15,
                "optionIndex": 1,
                "packageAmount": 6
            },
            {
                "name": "Muối tinh luyện",
                "baseAmount": 2,
                "unit": "g",
                "productId": null,
                "optionIndex": 0,
                "packageAmount": 0,
                "note": "Chưa có sản phẩm phù hợp"
            }
        ],
        "tools": [
            {
                "name": "Khay Nhôm Nướng Bánh",
                "productId": 39,
                "optionIndex": 0,
                "desc": "Truyền nhiệt đều giúp bánh chín vàng đồng nhất"
            },
            {
                "name": "Giấy nến nướng bánh chống dính",
                "productId": 18,
                "optionIndex": 0,
                "desc": "Lót khay chống dính lấy bánh dễ dàng"
            },
            {
                "name": "Túi bắt kem dùng một lần",
                "productId": 11,
                "optionIndex": 0,
                "desc": "Chịu lực tốt khi bắt bột quy đặc"
            },
            {
                "name": "Bộ đui bắt kem Inox",
                "productId": 20,
                "optionIndex": 0,
                "desc": "Đầu đui sao tạo vân bánh quy bơ"
            },
            {
                "name": "Túi Zip Đựng Bánh",
                "productId": 36,
                "optionIndex": 0,
                "desc": "Bảo quản bánh quy giòn lâu sau khi nướng"
            }
        ]
    },
    {
        "id": "recipe-hoa-cuc",
        "code": "RECIPE NO. 04",
        "title": "Bánh mì hoa cúc",
        "subtitle": "Từng thớ bánh dai mềm kéo sợi hòa quyện bơ sữa thơm lừng chuẩn vị Pháp.",
        "category": "Bánh mì",
        "tags": [
            "Bánh mì"
        ],
        "rating": "4.8",
        "bakeMinutes": 28,
        "time": "120 phút",
        "diff": "Khó",
        "defaultServings": 2,
        "servingsUnit": "Số ổ (450g)",
        "yieldLabel": "2 ổ 450g (4 người ăn)",
        "peopleLabel": "4 người",
        "image": "images/recipes/banh-mi-hoa-cuc.jpg",
        "tips": [
            "Bắt buộc dùng Bột mì số 11 giàu protein (11.5–13%) để tạo mạng gluten dai khỏe giúp bánh kéo sợi.",
            "Kiểm tra nhiệt độ sữa ấm quanh 38°C bằng nhiệt kế điện tử để kích hoạt men nở Mauripan đạt hiệu quả tốt nhất."
        ],
        "steps": [
            "Cân chuẩn Bột mì số 11, hòa tan Men nở với Sữa tươi Vinamilk ấm 38°C và đường tinh luyện.",
            "Nhồi bột cùng trứng đến khi kết khối dẻo mịn, thêm từng lát Bơ lạt Anchor nhồi tiếp đến khi kéo được màng mỏng không rách.",
            "Ủ bột lần 1 trong 50 phút cho nở gấp đôi; chia dải, cán mỏng và thắt bím gọn đặt vào khuôn.",
            "Ủ lần 2 thêm 35 phút rồi nướng ở 175°C trong 25–28 phút đến khi vỏ vàng ruộm thơm nức."
        ],
        "ingredients": [
            {
                "name": "Bột mì Baker's Choice số 11",
                "baseAmount": 260,
                "unit": "g",
                "productId": 2,
                "optionIndex": 2,
                "packageAmount": 300
            },
            {
                "name": "Bơ lạt Anchor",
                "baseAmount": 110,
                "unit": "g",
                "productId": 12,
                "optionIndex": 0,
                "packageAmount": 227
            },
            {
                "name": "Sữa Tươi Tiệt Trùng Không Đường Vinamilk 100%",
                "baseAmount": 100,
                "unit": "ml",
                "productId": 24,
                "optionIndex": 1,
                "packageAmount": 720
            },
            {
                "name": "Men nở",
                "baseAmount": 8,
                "unit": "g",
                "productId": 27,
                "optionIndex": 0,
                "packageAmount": 10
            },
            {
                "name": "Trứng gà",
                "baseAmount": 3,
                "unit": "quả",
                "productId": 15,
                "optionIndex": 1,
                "packageAmount": 6
            },
            {
                "name": "Đường tinh luyện Biên Hòa",
                "baseAmount": 70,
                "unit": "g",
                "productId": 13,
                "optionIndex": 1,
                "packageAmount": 500
            },
            {
                "name": "Tinh chất hoa cam",
                "baseAmount": 5,
                "unit": "ml",
                "productId": null,
                "optionIndex": 0,
                "packageAmount": 0,
                "note": "Chưa có sản phẩm phù hợp"
            }
        ],
        "tools": [
            {
                "name": "Cân điện tử nhà bếp",
                "productId": 7,
                "optionIndex": 0,
                "desc": "Đong chuẩn bột mì, bơ và men"
            },
            {
                "name": "Nhiệt kế điện tử nhà bếp",
                "productId": 10,
                "optionIndex": 0,
                "desc": "Đo chuẩn 38°C kích hoạt men nở"
            },
            {
                "name": "Tô Trộn Inox",
                "productId": 29,
                "optionIndex": 0,
                "desc": "Ủ bột sạch sẽ giữ nhiệt ổn định"
            },
            {
                "name": "Khay Nhôm Nướng Bánh",
                "productId": 39,
                "optionIndex": 1,
                "desc": "Khay thành cao giúp ổ bánh nở vồng đẹp"
            }
        ]
    },
    {
        "id": "recipe-muffin-socola",
        "code": "RECIPE NO. 05",
        "title": "Bánh Chocolate Muffin",
        "subtitle": "Không cần máy đánh trứng — 45 phút có ngay khay muffin cacao Hershey's mềm ẩm đậm vị.",
        "category": "Bánh ngọt",
        "tags": [
            "Bánh ngọt"
        ],
        "rating": "4.9",
        "bakeMinutes": 25,
        "time": "45 phút",
        "diff": "Dễ",
        "defaultServings": 6,
        "servingsUnit": "Số lượng (chiếc)",
        "yieldLabel": "6 chiếc (6 người ăn)",
        "peopleLabel": "6 người",
        "image": "images/recipes/banh-chocolate-muffin.jpg",
        "tips": [
            "Hòa tan cacao vào bơ ấm giúp khơi dậy hương thơm chocolate sâu hơn hẳn khi trộn khô.",
            "Không khuấy quá lâu sau khi rây bột mì đa dụng Meizan để bánh giữ độ tơi xốp đặc trưng."
        ],
        "steps": [
            "Làm nóng lò 180°C và xếp cup giấy nướng bánh vào Khuôn Nướng Cupcake & Muffin.",
            "Đun chảy Bơ lạt Anchor rồi khuấy tan Bột cacao Hershey's cùng đường tinh luyện.",
            "Đánh tan trứng với Sữa tươi Vinamilk, đổ vào âu bơ cacao rồi rây Bột mì đa dụng Meizan + Baking Soda vào khuấy vừa quyện.",
            "Chia đều bột đầy 2/3 cup giấy và nướng 22–25 phút ở 180°C."
        ],
        "ingredients": [
            {
                "name": "Bột mì đa dụng Meizan",
                "baseAmount": 150,
                "unit": "g",
                "productId": 3,
                "optionIndex": 2,
                "packageAmount": 300
            },
            {
                "name": "Bột cacao nguyên chất Hershey's",
                "baseAmount": 35,
                "unit": "g",
                "productId": 4,
                "optionIndex": 0,
                "packageAmount": 100
            },
            {
                "name": "Baking Soda",
                "baseAmount": 5,
                "unit": "g",
                "productId": 26,
                "optionIndex": 0,
                "packageAmount": 226
            },
            {
                "name": "Bơ lạt Anchor",
                "baseAmount": 80,
                "unit": "g",
                "productId": 12,
                "optionIndex": 0,
                "packageAmount": 227
            },
            {
                "name": "Sữa Tươi Tiệt Trùng Không Đường Vinamilk 100%",
                "baseAmount": 120,
                "unit": "ml",
                "productId": 24,
                "optionIndex": 1,
                "packageAmount": 720
            },
            {
                "name": "Đường tinh luyện Biên Hòa",
                "baseAmount": 90,
                "unit": "g",
                "productId": 13,
                "optionIndex": 1,
                "packageAmount": 500
            },
            {
                "name": "Trứng gà",
                "baseAmount": 1,
                "unit": "quả",
                "productId": 15,
                "optionIndex": 1,
                "packageAmount": 6
            }
        ],
        "tools": [
            {
                "name": "Khuôn Nướng Cupcake & Muffin",
                "productId": 31,
                "optionIndex": 0,
                "desc": "Khay 6 lỗ vừa khít cho 6 chiếc muffin"
            },
            {
                "name": "Cup giấy nướng bánh Cupcake",
                "productId": 19,
                "optionIndex": 0,
                "desc": "Tiện lợi chia khay nướng sạch sẽ"
            },
            {
                "name": "Phới lồng đánh trứng Inox",
                "productId": 16,
                "optionIndex": 0,
                "desc": "Trộn đều nhanh gọn không cần máy"
            },
            {
                "name": "Rây Bột",
                "productId": 30,
                "optionIndex": 0,
                "desc": "Giúp bột mì và cacao hòa tan không vón cục"
            }
        ]
    },
    {
        "id": "recipe-brownie",
        "code": "RECIPE NO. 06",
        "title": "Bánh Brownie",
        "subtitle": "Lớp vỏ nứt bóng đẹp đặc trưng bọc lấy phần ruột ẩm dẻo đậm vị cacao nguyên chất.",
        "category": "Bánh ngọt",
        "tags": [
            "Bánh ngọt"
        ],
        "rating": "4.9",
        "bakeMinutes": 25,
        "time": "50 phút",
        "diff": "Dễ",
        "defaultServings": 1,
        "servingsUnit": "Số khuôn (20cm)",
        "yieldLabel": "1 khuôn 20cm (4 người ăn)",
        "peopleLabel": "4 người",
        "image": "images/recipes/banh-brownie.jpg",
        "tips": [
            "Giữ hỗn hợp bơ + cacao đun cách thủy quanh 50–55°C và đánh tan hoàn toàn đường với trứng để mặt bánh bóng vỡ.",
            "Lót dư hai mép giấy nến để dễ dàng nhấc nguyên khối Brownie ra khỏi khay cắt vuông vức."
        ],
        "steps": [
            "Đun cách thủy Bơ lạt Anchor và Bột cacao Hershey's ở 50–55°C cho quyện bóng mịn.",
            "Đánh trứng gà và đường tinh luyện đến khi hỗn hợp sáng màu, đường tan hoàn toàn rồi trộn vào bơ cacao.",
            "Rây nhẹ 85g Bột mì đa dụng Meizan vào hỗn hợp socola, trộn nhẹ vừa hết bột trắng.",
            "Đổ vào khuôn lót giấy nến chống dính và nướng ở 175°C trong 24–26 phút."
        ],
        "ingredients": [
            {
                "name": "Bột mì đa dụng Meizan",
                "baseAmount": 85,
                "unit": "g",
                "productId": 3,
                "optionIndex": 3,
                "packageAmount": 100
            },
            {
                "name": "Bột cacao nguyên chất Hershey's",
                "baseAmount": 50,
                "unit": "g",
                "productId": 4,
                "optionIndex": 0,
                "packageAmount": 100
            },
            {
                "name": "Bơ lạt Anchor",
                "baseAmount": 120,
                "unit": "g",
                "productId": 12,
                "optionIndex": 0,
                "packageAmount": 227
            },
            {
                "name": "Đường tinh luyện Biên Hòa",
                "baseAmount": 110,
                "unit": "g",
                "productId": 13,
                "optionIndex": 1,
                "packageAmount": 500
            },
            {
                "name": "Trứng gà",
                "baseAmount": 2,
                "unit": "quả",
                "productId": 15,
                "optionIndex": 1,
                "packageAmount": 6
            },
            {
                "name": "Tinh chất vani & Muối",
                "baseAmount": 3,
                "unit": "g",
                "productId": null,
                "optionIndex": 0,
                "packageAmount": 0,
                "note": "Chưa có sản phẩm phù hợp"
            }
        ],
        "tools": [
            {
                "name": "Giấy nến nướng bánh chống dính",
                "productId": 18,
                "optionIndex": 0,
                "desc": "Nhấc khối bánh ra cắt vuông sắc nét"
            },
            {
                "name": "Nhiệt kế điện tử nhà bếp",
                "productId": 10,
                "optionIndex": 0,
                "desc": "Canh nhiệt đun cách thủy 50–55°C"
            },
            {
                "name": "Tô Trộn Inox",
                "productId": 29,
                "optionIndex": 0,
                "desc": "Đun cách thủy hỗn hợp bơ cacao đều nhiệt"
            },
            {
                "name": "Khay Giấy Đựng Bánh Kèm Nắp Trong",
                "productId": 38,
                "optionIndex": 1,
                "desc": "Đựng miếng Brownie mang tặng gọn gàng"
            }
        ]
    },
    {
        "id": "recipe-mousse-socola",
        "code": "RECIPE NO. 07",
        "title": "Bánh Mousse Chocolate",
        "subtitle": "Công thức không cần lò nướng mát lạnh tan chảy với Whipping Cream và Lá Gelatine Ewald chuẩn mịn.",
        "category": "Tráng miệng",
        "tags": [
            "Tráng miệng",
            "Bánh kem",
            "Bánh không cần lò nướng"
        ],
        "rating": "4.8",
        "bakeMinutes": 15,
        "time": "75 phút",
        "diff": "Trung bình",
        "defaultServings": 1,
        "servingsUnit": "Số ổ (20cm)",
        "yieldLabel": "1 ổ 20cm (4 người ăn)",
        "peopleLabel": "4 người",
        "image": "images/recipes/banh-mousse-chocolate.jpg",
        "tips": [
            "Ngâm Lá Gelatine Ewald trong nước đá lạnh 5–10 phút rồi vắt ráo trước khi khuấy tan cùng sữa cacao ấm.",
            "Làm lạnh âu trộn 15 phút trước khi đánh Whipping Cream giúp kem bông mịn nhanh mà không bị tách bơ."
        ],
        "steps": [
            "Ngâm mềm Lá Gelatine Ewald trong nước lạnh; đun ấm Sữa tươi Vinamilk và hòa tan Bột cacao Hershey's cho bóng mượt rồi khuấy tan gelatine.",
            "Đánh bông lạnh Whipping Cream Anchor đến khi sánh đặc tạo vân mềm chảy nhẹ (soft peak).",
            "Trộn nhẹ (fold) sốt cacao ấm nguội (khoảng 30°C) vào kem tươi rồi đổ vào khuôn tròn đế rời 20cm có lót đế mousse.",
            "Làm lạnh ngăn mát tối thiểu 4 giờ trước khi tách khuôn và rắc thêm lớp cacao mịn."
        ],
        "ingredients": [
            {
                "name": "Whipping Cream Anchor",
                "baseAmount": 250,
                "unit": "ml",
                "productId": 6,
                "optionIndex": 0,
                "packageAmount": 250
            },
            {
                "name": "Sữa Tươi Tiệt Trùng Không Đường Vinamilk 100%",
                "baseAmount": 120,
                "unit": "ml",
                "productId": 24,
                "optionIndex": 1,
                "packageAmount": 720
            },
            {
                "name": "Bột cacao nguyên chất Hershey's",
                "baseAmount": 35,
                "unit": "g",
                "productId": 4,
                "optionIndex": 0,
                "packageAmount": 100
            },
            {
                "name": "Lá Gelatine Ewald Bronze",
                "baseAmount": 10,
                "unit": "g",
                "productId": 25,
                "optionIndex": 0,
                "packageAmount": 100
            },
            {
                "name": "Đường tinh luyện Biên Hòa",
                "baseAmount": 45,
                "unit": "g",
                "productId": 13,
                "optionIndex": 1,
                "packageAmount": 500
            }
        ],
        "tools": [
            {
                "name": "Khuôn bánh bông lan tròn chống dính (20cm)",
                "productId": 17,
                "optionIndex": 0,
                "desc": "Thiết kế đế rời giúp tách bánh lạnh dễ dàng"
            },
            {
                "name": "Đế Lót Bánh Mousse",
                "productId": 40,
                "optionIndex": 2,
                "desc": "Đế lót cứng nâng từng phần mousse sang trọng"
            },
            {
                "name": "Phới lồng đánh trứng Inox",
                "productId": 16,
                "optionIndex": 0,
                "desc": "Trộn fold kem tươi mịn đều không tách nước"
            },
            {
                "name": "Máy Đánh Trứng Cầm Tay Philips HR3705",
                "productId": 28,
                "optionIndex": 0,
                "desc": "Đánh kem tươi whipping chuẩn độ bông"
            }
        ]
    },
    {
        "id": "recipe-pancake",
        "code": "RECIPE NO. 08",
        "title": "Bánh Pancake mật ong",
        "subtitle": "Chỉ 25 phút với bột mì đa dụng Meizan và Baking Soda cho chồng bánh vàng ươm bông xốp.",
        "category": "Bánh ngọt",
        "tags": [
            "Bánh ngọt",
            "Bánh không cần lò nướng"
        ],
        "rating": "4.8",
        "bakeMinutes": 10,
        "time": "25 phút",
        "diff": "Dễ",
        "defaultServings": 8,
        "servingsUnit": "Số lượng (chiếc)",
        "yieldLabel": "8 chiếc (4 người ăn)",
        "peopleLabel": "4 người",
        "image": "images/recipes/banh-pancake-mat-ong.jpg",
        "tips": [
            "Để bột nghỉ 10 phút trước khi áp chảo và rót bột bằng ca đong chia vạch giúp bánh tròn đều kích cỡ.",
            "Chỉ lật mặt bánh khi thấy bề mặt sủi bọt khí đều và mép bánh hơi se khô."
        ],
        "steps": [
            "Đánh tan trứng gà với đường tinh luyện, Sữa tươi Vinamilk và Bơ lạt Anchor đun chảy trong ca đong có vạch chia ml.",
            "Rây Bột mì đa dụng Meizan cùng Baking Soda vào khuấy đều vừa tan bột (hỗn hợp sánh chảy mịn).",
            "Làm nóng chảo chống dính lửa vừa nhỏ, rót từng muỗng bột đều tay đợi bọt khí nổi đều rồi lật mặt.",
            "Xếp chồng 8 chiếc Pancake ra đĩa, ăn kèm mật ong và lát Bơ lạt Anchor."
        ],
        "ingredients": [
            {
                "name": "Bột mì đa dụng Meizan",
                "baseAmount": 150,
                "unit": "g",
                "productId": 3,
                "optionIndex": 2,
                "packageAmount": 300
            },
            {
                "name": "Sữa Tươi Tiệt Trùng Không Đường Vinamilk 100%",
                "baseAmount": 180,
                "unit": "ml",
                "productId": 24,
                "optionIndex": 1,
                "packageAmount": 720
            },
            {
                "name": "Baking Soda",
                "baseAmount": 4,
                "unit": "g",
                "productId": 26,
                "optionIndex": 0,
                "packageAmount": 226
            },
            {
                "name": "Trứng gà",
                "baseAmount": 2,
                "unit": "quả",
                "productId": 15,
                "optionIndex": 1,
                "packageAmount": 6
            },
            {
                "name": "Đường tinh luyện Biên Hòa",
                "baseAmount": 40,
                "unit": "g",
                "productId": 13,
                "optionIndex": 1,
                "packageAmount": 500
            },
            {
                "name": "Bơ lạt Anchor",
                "baseAmount": 30,
                "unit": "g",
                "productId": 12,
                "optionIndex": 0,
                "packageAmount": 227
            },
            {
                "name": "Mật ong nguyên chất",
                "baseAmount": 30,
                "unit": "ml",
                "productId": null,
                "optionIndex": 0,
                "packageAmount": 0,
                "note": "Chưa có sản phẩm phù hợp"
            }
        ],
        "tools": [
            {
                "name": "Ca đong nguyên liệu",
                "productId": 8,
                "optionIndex": 0,
                "desc": "Đong sữa & rót bột tròn đều"
            },
            {
                "name": "Thìa đong định lượng",
                "productId": 9,
                "optionIndex": 0,
                "desc": "Đong chuẩn vani và Baking Soda"
            },
            {
                "name": "Rây Bột",
                "productId": 30,
                "optionIndex": 0,
                "desc": "Rây bột mì cho bánh mịn không vón"
            }
        ]
    }
];

  function getRecipes() {
    let customStore = { edited: {}, added: [], hiddenIds: [] };
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const raw = window.localStorage.getItem("bakemate_recipes_override");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") {
            customStore = parsed;
          }
        }
      } catch (e) {
        // Ignore parse failure
      }
    }
    const hidden = Array.isArray(customStore.hiddenIds) ? customStore.hiddenIds : [];
    const base = RECIPES_LIST.filter((r) => !hidden.includes(r.id)).map((r) => {
      const patch = customStore.edited && customStore.edited[r.id];
      return patch ? Object.assign({}, r, patch) : r;
    });
    const added = Array.isArray(customStore.added) ? customStore.added : [];
    return [...base, ...added.filter((r) => r && r.id && !hidden.includes(r.id))];
  }

  function getRecipeById(recipeId) {
    const id = String(recipeId || "").trim();
    return getRecipes().find((r) => r.id === id) || null;
  }

  if (typeof window !== "undefined") {
    window.RECIPES_LIST = RECIPES_LIST;
    window.getRecipes = getRecipes;
    window.getRecipeById = getRecipeById;
  }
})();