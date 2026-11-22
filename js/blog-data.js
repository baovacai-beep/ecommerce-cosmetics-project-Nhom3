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
        "readTime": "Khoảng 65–75 phút",
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
        "excerpt": "Bánh Chiffon nổi tiếng với kết cấu nhẹ, mềm mịn và vị ngọt dịu. Cùng BakeMate khám phá cách đánh lòng trắng trứng, trộn bột và nướng bánh để có thành phẩm bông xốp, nở đều mà không bị xẹp.",
        "steps": [
            "Tách riêng lòng đỏ và lòng trắng trứng gà ở nhiệt độ phòng; làm nóng trước lò ở 165°C trong 15 phút.",
            "Trộn đều lòng đỏ với Sữa tươi Vinamilk, dầu ăn và rây 120g Bột mì số 8 vào khuấy theo một chiều cho mịn mượt.",
            "Đánh bông lòng trắng với 4g Bột làm bánh Tartar và 100g đường tinh luyện theo 3 lần chia cho đến khi đạt chóp mềm uốn cong.",
            "Trộn nhẹ nhàng (fold) hỗn hợp lòng trắng vào âu lòng đỏ theo kỹ thuật hất từ đáy âu lên để không vỡ bọt khí.",
            "Đổ bột vào khuôn tròn 20cm và nướng 40–45 phút ở 160–165°C, úp ngược khuôn ngay khi lấy ra để bánh không bị xẹp mặt."
        ],
        "content": {
            "yield_note": "1 bánh Chiffon khuôn 18 cm",
            "intro_title": "Bánh Chiffon có gì đặc biệt?",
            "intro_paragraphs": [
                "Chiffon là một loại bánh bông lan có kết cấu nhẹ và thoáng khí nhờ sử dụng lòng trắng trứng đánh bông. Khác với những loại bánh bơ đặc và chắc, Chiffon mang đến cảm giác mềm mịn, ẩm nhẹ và tan trong miệng.",
                "Tuy nhiên, đây cũng là loại bánh khiến nhiều người mới bắt đầu gặp khó khăn. Bánh có thể nở đẹp trong lò nhưng lại xẹp sau khi lấy ra, hoặc phần ruột bị chai và có nhiều lỗ khí lớn.",
                "Để khắc phục những tình trạng này, điều quan trọng nhất là đánh trứng đúng cách, trộn bột nhẹ tay và để bánh nguội đúng kỹ thuật."
            ],
            "hero_caption": "Ảnh 1: Bánh Chiffon đã nướng và cắt lát",
            "prep_groups": [
                {
                    "label": "Phần lòng đỏ",
                    "items": [
                        "4 lòng đỏ trứng gà",
                        "60 g bột mì số 8",
                        "40 ml sữa tươi không đường",
                        "35 ml dầu ăn",
                        "20 g đường",
                        "1/2 thìa cà phê vani"
                    ]
                },
                {
                    "label": "Phần lòng trắng",
                    "items": [
                        "4 lòng trắng trứng gà",
                        "50 g đường",
                        "1/2 thìa cà phê nước cốt chanh hoặc một lượng cream of tartar phù hợp"
                    ]
                },
                {
                    "label": "Dụng cụ",
                    "items": [
                        "Khuôn Chiffon 18 cm có ống giữa và đáy rời, máy đánh trứng, phới lồng, phới dẹt và rây bột"
                    ]
                }
            ],
            "step_blocks": [
                {
                    "title": "Bước 1. Chuẩn bị hỗn hợp lòng đỏ",
                    "paragraphs": [
                        "Cho lòng đỏ trứng, sữa tươi, dầu ăn, đường và vani vào tô. Dùng phới lồng khuấy đều đến khi hỗn hợp đồng nhất.",
                        "Rây bột mì vào tô, trộn nhẹ cho đến khi không còn bột khô. Không khuấy quá lâu vì có thể làm hỗn hợp trở nên dai."
                    ],
                    "image": "images/blog/bai-01/2.png",
                    "caption": "Ảnh 2: Hỗn hợp lòng đỏ và bột mì sau khi trộn."
                },
                {
                    "title": "Bước 2. Đánh bông lòng trắng trứng",
                    "paragraphs": [
                        "Cho lòng trắng vào tô sạch, khô và không dính dầu mỡ. Đánh ở tốc độ thấp cho xuất hiện bọt khí nhỏ, thêm nước cốt chanh rồi chia đường thành ba lần cho vào.",
                        "Tiếp tục đánh đến khi lòng trắng tạo chóp đứng nhưng phần đầu hơi cong. Hỗn hợp đạt yêu cầu sẽ bóng mịn, không bị khô hoặc vón cục."
                    ],
                    "image": "images/blog/bai-01/3.png",
                    "caption": "Ảnh 3: Lòng trắng trứng đạt trạng thái chóp mềm đến gần chóp cứng."
                },
                {
                    "title": "Bước 3. Trộn hai hỗn hợp",
                    "paragraphs": [
                        "Lấy khoảng một phần ba lòng trắng đã đánh bông cho vào hỗn hợp lòng đỏ và trộn nhẹ để làm hỗn hợp bớt đặc.",
                        "Sau đó đổ trở lại phần lòng trắng còn lại, dùng phới dẹt thực hiện thao tác hất từ dưới lên và xoay tô. Trộn vừa đủ để hỗn hợp đồng nhất, tránh làm vỡ quá nhiều bọt khí."
                    ]
                },
                {
                    "title": "Bước 4. Nướng bánh",
                    "paragraphs": [
                        "Làm nóng lò trước ở khoảng 160°C. Đổ bột vào khuôn Chiffon sạch, không chống dính ở thành khuôn để bánh có thể bám và leo lên trong quá trình nướng.",
                        "Nướng khoảng 40–50 phút, tùy đặc điểm của lò. Khi bánh có màu vàng đều, mặt bánh đàn hồi và que thử không dính bột ướt thì có thể lấy ra."
                    ]
                },
                {
                    "title": "Bước 5. Úp khuôn và để nguội",
                    "paragraphs": [
                        "Ngay sau khi lấy khỏi lò, úp ngược khuôn và để bánh nguội hoàn toàn trước khi gỡ khuôn.",
                        "Đây là bước quan trọng giúp hạn chế việc bánh co lại hoặc xẹp dưới sức nặng của chính nó."
                    ]
                }
            ],
            "mistakes_title": "Ba lỗi thường gặp khi làm Chiffon",
            "mistakes": [
                {
                    "label": "Bánh bị xẹp sau khi nướng",
                    "desc": "Có thể do bánh chưa chín hoàn toàn, lòng trắng chưa đạt hoặc không úp khuôn khi làm nguội."
                },
                {
                    "label": "Bánh bị chai, đặc",
                    "desc": "Thường xuất hiện khi trộn bột quá mạnh làm vỡ bọt khí."
                },
                {
                    "label": "Bánh nứt mặt quá nhiều",
                    "desc": "Có thể do nhiệt phía trên cao hoặc khuôn đặt quá gần thanh nhiệt."
                }
            ],
            "tips": [
                "Hãy cân nguyên liệu bằng cân điện tử thay vì ước lượng bằng mắt. Đồng thời, làm quen với nhiệt độ thực tế của lò nướng sẽ giúp bạn đạt thành phẩm ổn định hơn sau mỗi lần thực hiện."
            ],
            "conclusion": [
                "Một chiếc Chiffon mềm mịn không nhất thiết phải đến từ công thức phức tạp. Chỉ cần hiểu đúng vai trò của từng nguyên liệu, thực hiện nhẹ tay và kiên nhẫn ở bước làm nguội, bạn sẽ dễ dàng tạo nên một món bánh thơm ngon để thưởng thức cùng gia đình."
            ],
            "related_slugs": [
                "post-phan-biet-bot-mi",
                "post-muffin-socola",
                "post-banh-quy-bo"
            ]
        }
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
        "readTime": "Khoảng 5 phút đọc",
        "diff": "Trung bình",
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
        "excerpt": "Bánh mì hoa cúc hấp dẫn bởi hương bơ sữa thơm dịu, phần ruột mềm dai và những thớ bánh kéo sợi đẹp mắt. Cùng BakeMate khám phá kỹ thuật nhào bột, kiểm tra gluten và những mẹo đơn giản giúp bánh nở mềm ngay tại nhà.",
        "steps": [
            "Hòa tan 8g Men nở Mauripan với 100ml Sữa tươi Vinamilk ấm 38°C (kiểm tra bằng nhiệt kế điện tử) và đường tinh luyện, để men nổi bọt gạch cua sau 10 phút.",
            "Trộn 260g Bột mì số 11 cùng trứng gà thành khối kết dính, sau đó nhào đẩy-gập (push & fold) nhịp nhàng theo hướng dẫn video của King Arthur Baking.",
            "Thêm từng lát Bơ lạt Anchor mềm vào nhào tiếp 10–12 phút đến khi kéo được màng mỏng đàn hồi (windowpane test) không rách.",
            "Ủ bột lần 1 trong 50 phút cho nở gấp đôi, chia 3 dải thắt bím đặt khuôn, ủ lần 2 thêm 35 phút rồi nướng ở 175°C trong 25–28 phút."
        ],
        "content": {
            "yield_note": "2 ổ bánh mì hoa cúc (~450 g/ổ)",
            "intro_title": "Bánh mì hoa cúc có gì đặc biệt?",
            "intro_paragraphs": [
                "Bánh mì hoa cúc được yêu thích nhờ lớp vỏ vàng óng, hương thơm đặc trưng của bơ sữa và phần ruột mềm mại, có thể xé thành từng thớ. Để đạt được kết cấu này, người làm bánh cần chú ý đến việc lựa chọn nguyên liệu, nhào bột và kiểm soát quá trình ủ.",
                "Không ít người mới bắt đầu gặp tình trạng bánh bị đặc ruột, khô cứng hoặc không kéo sợi như mong muốn. Nguyên nhân thường đến từ việc khối bột chưa phát triển đủ gluten hoặc quá trình ủ chưa phù hợp."
            ],
            "hero_caption": "Ảnh 1: Bánh mì hoa cúc",
            "step_blocks": [
                {
                    "title": "1. Lựa chọn nguyên liệu phù hợp",
                    "paragraphs": [
                        "Để bánh mì hoa cúc có độ mềm dai và hương vị thơm ngon, bạn cần chú ý đến các nguyên liệu chính: Bột mì số 11 hỗ trợ phát triển mạng lưới gluten; Men nở giúp bột lên men; Trứng và sữa tươi tạo độ mềm và màu vàng; Bơ lạt mang lại hương thơm đặc trưng; Đường và muối cân bằng vị và điều tiết quá trình lên men. Nên cân nguyên liệu theo công thức thay vì ước lượng bằng mắt để đạt kết quả ổn định."
                    ]
                },
                {
                    "title": "2. Kỹ thuật nhào bột đúng cách (Trộn, Nhào thêm bơ & Kiểm tra đàn hồi)",
                    "paragraphs": [
                        "Bước 1 — Trộn nguyên liệu: Cho bột mì, men, đường, trứng và sữa vào tô, trộn đến khi hình thành khối bột. Ban đầu bột có thể hơi dính tay, vì vậy không nên vội thêm quá nhiều bột khô.",
                        "Bước 2 — Nhào bột và thêm bơ: Dùng lòng bàn tay đẩy bột ra trước, gấp lại rồi xoay khối bột. Khi bột đã bắt đầu có độ đàn hồi, thêm bơ mềm từng phần và tiếp tục nhào đến khi hỗn hợp đồng nhất, bề mặt mịn hơn.",
                        "Bước 3 — Kiểm tra độ đàn hồi: Lấy một phần bột nhỏ và nhẹ nhàng kéo giãn. Nếu bột có thể tạo thành lớp màng tương đối mỏng mà không rách ngay, đó là dấu hiệu gluten đã phát triển tốt."
                    ],
                    "video_label": "How to Knead Bread Dough (King Arthur Baking)",
                    "video_article_url": "https://www.kingarthurbaking.com/videos/baking-skills/how-to-knead-bread-dough"
                },
                {
                    "title": "3. Ủ bột và tạo hình bánh",
                    "paragraphs": [
                        "Sau khi nhào đạt yêu cầu, đặt bột vào tô, đậy kín và ủ theo hướng dẫn của công thức đến khi bột nở phù hợp.",
                        "Tiếp theo, chia bột thành các phần bằng nhau, tạo thành những dải dài rồi tết lại để tạo hình bánh mì hoa cúc. Sau khi tạo hình, tiếp tục ủ lần hai trước khi nướng. Không nên ủ quá mức vì bánh có thể giảm khả năng giữ cấu trúc."
                    ],
                    "image": "images/blog/bai-03/2.jfif",
                    "caption": "Ảnh 2: Khối bột bánh mì hoa cúc được tết thành hình trước khi nướng."
                }
            ],
            "mistakes_title": "Những lỗi thường gặp",
            "mistakes": [
                {
                    "label": "Bánh không nở",
                    "desc": "Có thể do men hoạt động yếu, nhiệt độ ủ chưa phù hợp hoặc bột chưa phát triển đủ gluten."
                },
                {
                    "label": "Bánh bị khô, đặc",
                    "desc": "Thường liên quan đến việc thêm quá nhiều bột mì, tỷ lệ chất lỏng chưa phù hợp hoặc nướng quá lâu."
                },
                {
                    "label": "Bánh không kéo sợi",
                    "desc": "Có thể do kỹ thuật nhào chưa đạt, lựa chọn loại bột chưa phù hợp hoặc quá trình tạo hình chưa đúng."
                }
            ],
            "tips": [
                "Để bánh mì hoa cúc đạt kết cấu mềm dai, hãy chú ý quan sát trạng thái khối bột thay vì chỉ dựa vào thời gian nhào. Đồng thời, kiểm soát nhiệt độ trong quá trình nhào và ủ để bột phát triển ổn định.",
                "Nếu mới bắt đầu, bạn nên làm theo một công thức cố định và ghi lại kết quả sau mỗi lần thực hiện để dễ dàng cải thiện."
            ],
            "conclusion": [
                "Bí quyết làm bánh mì hoa cúc thơm ngon không chỉ nằm ở nguyên liệu mà còn ở kỹ thuật nhào và ủ bột. Khi hiểu cách gluten phát triển và biết nhận diện trạng thái bột phù hợp, bạn sẽ tự tin hơn để tạo ra những chiếc bánh mềm dai, thơm bơ sữa ngay tại nhà."
            ],
            "related_slugs": [
                "post-phan-biet-bot-mi",
                "post-banh-quy-bo",
                "post-bong-lan-chiffon"
            ]
        },
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
        "readTime": "Khoảng 5 phút đọc",
        "diff": "Dễ – Trung bình",
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
        "excerpt": "Brownie hấp dẫn bởi hương chocolate đậm đà, lớp vỏ mỏng bóng nhẹ và phần ruột mềm ẩm. Cùng BakeMate khám phá 5 bí quyết đơn giản từ cách chọn chocolate, đánh trứng đến kiểm soát nhiệt độ nướng để có những chiếc Brownie thơm ngon ngay tại nhà.",
        "steps": [
            "Bí quyết 1 — Nhiệt độ tan bơ cacao: Giữ ở 50–55°C bằng nhiệt kế điện tử để cacao thơm sâu mà không bị cháy khét.",
            "Bí quyết 2 — Hòa tan đường hoàn toàn: Đánh trứng với 110g đường tinh luyện cho tới khi sệt mịn để tạo lớp màng đường bóng nứt trên mặt.",
            "Bí quyết 3 — Lượng bột tối thiểu: Chỉ dùng 85g Bột mì đa dụng Meizan (gói 100g) và trộn fold nhẹ để ruột bánh mềm dẻo.",
            "Bí quyết 4 & 5 — Lót giấy nến dư mép khuôn và canh đúng 25 phút ở 175°C, để nguội hẳn trước khi cắt thành miếng vuông sắc nét."
        ],
        "content": {
            "yield_note": "1 khay Brownie vuông 20 cm (~9 miếng)",
            "intro_title": "Điều gì khiến Brownie trở nên đặc biệt?",
            "intro_paragraphs": [
                "Brownie là món bánh chocolate được yêu thích nhờ hương vị đậm đà và kết cấu mềm ẩm đặc trưng. Khác với bánh bông lan nhẹ xốp, Brownie thường có phần ruột đặc hơn, mềm dẻo và mang đến cảm giác chocolate rõ rệt trong từng miếng bánh.",
                "Một chiếc Brownie hấp dẫn thường có lớp vỏ mỏng hơi bóng, xuất hiện những đường nứt nhẹ trên bề mặt. Tuy nhiên, không ít người gặp tình trạng bánh khô cứng, quá đặc hoặc không tạo được lớp vỏ như mong muốn. Để cải thiện thành phẩm, bạn có thể bắt đầu từ 5 bí quyết dưới đây."
            ],
            "hero_caption": "Ảnh 1: Brownie Chocolate thành phẩm với lớp mặt bóng, nứt nhẹ và phần ruột mềm ẩm khi cắt.",
            "step_blocks": [
                {
                    "title": "1. Lựa chọn chocolate phù hợp",
                    "paragraphs": [
                        "Chocolate là nguyên liệu quyết định phần lớn hương vị của Brownie. Bạn có thể sử dụng chocolate đen với hàm lượng cacao phù hợp để tạo vị đậm đà và cân bằng độ ngọt.",
                        "Chocolate cần được làm tan nhẹ nhàng cùng bơ theo hướng dẫn của công thức. Tránh đun ở nhiệt độ quá cao vì hỗn hợp có thể bị quá nóng hoặc ảnh hưởng đến chất lượng thành phẩm.",
                        "Nếu công thức sử dụng cả chocolate và bột cacao, không nên tự ý thay thế hoàn toàn nguyên liệu này bằng nguyên liệu kia vì chúng có thành phần chất béo và độ đậm đặc khác nhau."
                    ]
                },
                {
                    "title": "2. Đánh trứng và đường đúng cách",
                    "paragraphs": [
                        "Trứng không chỉ giúp liên kết nguyên liệu mà còn ảnh hưởng đến kết cấu và bề mặt bánh. Ở nhiều công thức Brownie, việc đánh trứng cùng đường đến khi hỗn hợp sáng màu và hơi đặc có thể góp phần tạo nên lớp vỏ mỏng bóng đẹp sau khi nướng.",
                        "Bạn nên sử dụng đường theo định lượng của công thức, tránh giảm quá nhiều vì điều này có thể làm thay đổi cấu trúc bánh."
                    ],
                    "image": "images/blog/bai-05/2.jpg",
                    "caption": "Ảnh 2: Hỗn hợp trứng và đường được đánh đến khi sáng màu, có độ sánh nhẹ."
                },
                {
                    "title": "3. Trộn bột nhẹ tay, tránh trộn quá lâu",
                    "paragraphs": [
                        "Sau khi kết hợp chocolate, bơ và hỗn hợp trứng, cho bột mì vào rồi dùng phới dẹt trộn nhẹ đến khi không còn bột khô.",
                        "Không nên khuấy quá mạnh hoặc quá lâu vì có thể làm thay đổi kết cấu mong muốn của Brownie. Hãy giữ đúng tỷ lệ bột mì, chocolate và chất béo thay vì tự ý thêm bột."
                    ]
                },
                {
                    "title": "4. Kiểm soát nhiệt độ và thời gian nướng",
                    "paragraphs": [
                        "Nướng quá lâu là một trong những nguyên nhân phổ biến khiến Brownie bị khô. Với khuôn vuông 20 cm, có thể bắt đầu tham khảo mức nhiệt khoảng 170–175°C và theo dõi bánh trong quá trình nướng.",
                        "Đối với Brownie mềm ẩm, que thử có thể còn bám một ít vụn bánh ẩm nhưng không nên có bột sống chảy lỏng."
                    ]
                },
                {
                    "title": "5. Để bánh nguội trước khi cắt",
                    "paragraphs": [
                        "Sau khi lấy khỏi lò, Brownie cần thời gian để ổn định kết cấu. Nếu cắt bánh khi còn quá nóng, phần ruột có thể bị vỡ hoặc dính vào dao.",
                        "Hãy để bánh nguội trong khuôn một thời gian, sau đó lấy ra và cắt bằng dao sạch. Bạn có thể lau dao giữa các lần cắt để miếng bánh có đường cắt đẹp hơn."
                    ],
                    "image": "images/blog/bai-05/3.jfif",
                    "caption": "Ảnh 3: Những miếng Brownie được cắt vuông vắn."
                }
            ],
            "mistakes_title": "Ba lỗi thường gặp khi làm Brownie",
            "mistakes": [
                {
                    "label": "Bánh bị khô, cứng",
                    "desc": "Có thể do nướng quá lâu, nhiệt độ cao hoặc sử dụng quá nhiều bột mì."
                },
                {
                    "label": "Bánh quá đặc, nặng",
                    "desc": "Thường liên quan đến tỷ lệ nguyên liệu hoặc kỹ thuật đánh trứng và trộn bột chưa phù hợp."
                },
                {
                    "label": "Mặt bánh không bóng",
                    "desc": "Có thể do cách hòa tan đường, kỹ thuật đánh trứng hoặc tỷ lệ nguyên liệu trong công thức."
                }
            ],
            "tips": [
                "Để Brownie có hương vị thơm ngon và kết cấu mềm ẩm, hãy cân chính xác nguyên liệu, chọn chocolate phù hợp và tránh nướng bánh quá lâu.",
                "Nếu mới bắt đầu, bạn nên làm theo một công thức cố định và chỉ điều chỉnh từng yếu tố sau khi đã hiểu rõ ảnh hưởng của chúng đến thành phẩm."
            ],
            "conclusion": [
                "Một chiếc Brownie thơm ngon không chỉ phụ thuộc vào chất lượng chocolate mà còn nằm ở cách xử lý trứng, đường, bột mì và thời gian nướng.",
                "Chỉ cần chú ý đến những chi tiết nhỏ trong quá trình thực hiện, bạn sẽ dễ dàng cải thiện kết cấu bánh và tạo nên những miếng Brownie mềm ẩm, đậm vị chocolate để thưởng thức cùng gia đình."
            ],
            "related_slugs": [
                "post-muffin-socola",
                "post-banh-quy-bo",
                "post-mousse-socola"
            ]
        }
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
        "readTime": "Khoảng 25 phút + 4 giờ lạnh",
        "diff": "Dễ",
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
        "excerpt": "Không cần lò nướng hay kỹ thuật làm bánh phức tạp, bạn vẫn có thể tự tay chuẩn bị món Mousse Chocolate mềm mịn, mát lạnh và đậm vị chocolate. Cùng BakeMate khám phá công thức đơn giản để tạo nên món tráng miệng hấp dẫn ngay tại nhà.",
        "steps": [
            "Ngâm mềm 10g Lá Gelatine Ewald trong nước đá lạnh 5–10 phút rồi vắt ráo; hòa tan 35g cacao Hershey's với 120ml Sữa tươi Vinamilk ấm và khuấy tan gelatine.",
            "Làm lạnh âu Inox và đánh 250ml Whipping Cream Anchor lạnh đến khi kem sánh đặc tạo vân mềm chảy nhẹ (soft peak).",
            "Trộn nhẹ (fold) sốt cacao đã nguội bớt (~30°C) vào kem tươi theo một chiều cho hòa quyện đều, đổ vào khuôn tròn đế rời 20cm.",
            "Giữ lạnh ngăn mát ít nhất 4 giờ cho bánh định hình hoàn toàn, dùng khăn ấm lau nhẹ quanh thành khuôn rồi tách bánh ra Đế Lót Bánh Mousse."
        ],
        "content": {
            "yield_note": "4 ly Mousse Chocolate (4 người ăn)",
            "intro_title": "Mousse Chocolate có gì đặc biệt?",
            "intro_paragraphs": [
                "Mousse Chocolate là món tráng miệng được yêu thích nhờ kết cấu mềm nhẹ, mịn mượt và hương vị chocolate đậm đà. Khác với bánh nướng thông thường, mousse không cần sử dụng lò nướng mà chủ yếu được làm từ chocolate kết hợp cùng kem tươi đánh bông.",
                "Điểm hấp dẫn của món bánh nằm ở sự cân bằng giữa vị đắng nhẹ của chocolate và độ béo của kem tươi. Khi được làm lạnh đúng cách, mousse có kết cấu mềm mịn, tan nhẹ trong miệng và rất thích hợp để thưởng thức trong những ngày thời tiết nóng.",
                "Tuy nhiên, nếu xử lý chocolate hoặc đánh kem chưa đúng, mousse có thể bị lợn cợn, tách lớp hoặc không giữ được độ mềm mịn như mong muốn."
            ],
            "hero_caption": "Ảnh 1: Mousse Chocolate thành phẩm trong ly thủy tinh, trang trí chocolate bào hoặc bột cacao.",
            "prep_groups": [
                {
                    "label": "Phần mousse",
                    "items": [
                        "150 g chocolate đen (khoảng 50–70% cacao)",
                        "300 ml whipping cream lạnh",
                        "15–25 g đường bột, tùy độ ngọt của chocolate",
                        "1/2 thìa cà phê vani"
                    ]
                },
                {
                    "label": "Phần trang trí",
                    "items": [
                        "Chocolate bào hoặc bột cacao",
                        "Trái cây tươi (không bắt buộc)"
                    ]
                },
                {
                    "label": "Dụng cụ",
                    "items": [
                        "Tô trộn, máy đánh trứng hoặc phới lồng, phới dẹt, nồi nhỏ và 4 ly đựng mousse"
                    ]
                }
            ],
            "step_blocks": [
                {
                    "title": "Bước 1. Làm tan chocolate",
                    "paragraphs": [
                        "Cắt nhỏ chocolate rồi cho vào tô chịu nhiệt. Đun nóng 100 ml whipping cream đến khi bắt đầu bốc hơi nhẹ, không cần đun sôi mạnh.",
                        "Rót kem nóng vào chocolate, để khoảng một phút rồi khuấy nhẹ đến khi chocolate tan hoàn toàn và hỗn hợp trở nên mịn. Để hỗn hợp nguội bớt trước khi kết hợp với phần kem đánh bông."
                    ],
                    "image": "images/blog/bai-07/2.jfif",
                    "caption": "Ảnh 2: Chocolate được làm tan."
                },
                {
                    "title": "Bước 2. Đánh bông whipping cream",
                    "paragraphs": [
                        "Cho 200 ml whipping cream còn lại vào tô sạch, thêm đường bột và vani.",
                        "Dùng máy đánh trứng đánh ở tốc độ vừa đến khi kem tạo chóp mềm, có độ bông nhẹ nhưng vẫn giữ được kết cấu mịn. Không nên đánh quá lâu khiến kem bị quá cứng hoặc tách nước."
                    ]
                },
                {
                    "title": "Bước 3. Trộn hỗn hợp mousse",
                    "paragraphs": [
                        "Lấy khoảng một phần ba lượng kem đã đánh bông cho vào hỗn hợp chocolate, trộn nhẹ để làm hỗn hợp bớt đặc.",
                        "Tiếp tục thêm phần kem còn lại và dùng phới dẹt thực hiện kỹ thuật fold, hất nhẹ từ dưới lên cho đến khi các nguyên liệu hòa quyện. Thao tác nhẹ tay giúp giữ lại độ thoáng khí đặc trưng của mousse."
                    ]
                },
                {
                    "title": "Bước 4. Chia ly và làm lạnh",
                    "paragraphs": [
                        "Chia hỗn hợp mousse vào 4 ly hoặc cốc nhỏ, đậy kín và đặt trong ngăn mát tủ lạnh ít nhất 4 giờ để mousse ổn định kết cấu.",
                        "Không nên dùng ngay sau khi trộn vì mousse cần thời gian làm lạnh để đạt độ đặc và hương vị phù hợp."
                    ]
                }
            ],
            "mistakes_title": "Ba lỗi thường gặp khi làm Mousse Chocolate",
            "mistakes": [
                {
                    "label": "Mousse bị lợn cợn",
                    "desc": "Có thể do chocolate chưa tan hoàn toàn hoặc hỗn hợp chocolate quá nguội, đông lại khi kết hợp với kem."
                },
                {
                    "label": "Mousse bị tách lớp",
                    "desc": "Thường liên quan đến việc trộn chocolate khi còn quá nóng hoặc đánh whipping cream quá mức."
                },
                {
                    "label": "Mousse không đủ độ bông",
                    "desc": "Có thể do kem chưa được làm lạnh phù hợp hoặc chưa được đánh đến trạng thái cần thiết."
                }
            ],
            "tips": [
                "Để mousse có kết cấu mềm mịn, hãy sử dụng whipping cream đủ lạnh và chọn chocolate có hương vị phù hợp với khẩu vị.",
                "Khi trộn chocolate với kem đánh bông, nên thực hiện nhẹ tay và chú ý nhiệt độ của hỗn hợp. Ngoài ra, hãy để mousse làm lạnh đủ thời gian trước khi thưởng thức để đạt hương vị và kết cấu tốt nhất."
            ],
            "conclusion": [
                "Mousse Chocolate là lựa chọn thú vị cho những ai yêu thích chocolate nhưng không muốn thực hiện các công thức nướng bánh phức tạp.",
                "Chỉ với một vài nguyên liệu quen thuộc và sự khéo léo trong cách đánh kem, trộn chocolate, bạn đã có thể tạo nên món tráng miệng mềm mịn, mát lạnh để thưởng thức cùng gia đình và bạn bè."
            ],
            "related_slugs": [
                "post-brownie-giot-am",
                "post-muffin-socola",
                "post-banh-quy-bo"
            ]
        }
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