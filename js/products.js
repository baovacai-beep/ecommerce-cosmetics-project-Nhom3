
/*
 * ============================================================
 * BAKEMATE - DỮ LIỆU SẢN PHẨM DÙNG CHUNG
 * File: js/products.js
 * Mục đích:
 * - Lưu trữ dữ liệu sản phẩm
 * - Cung cấp thông tin cho trang danh sách sản phẩm
 * - Cung cấp thông tin cho trang chi tiết sản phẩm
 * - Hỗ trợ giỏ hàng và gợi ý sản phẩm
 *
 * LƯU Ý:
 * Giá bán, số lượng tồn kho và đánh giá dưới đây là dữ liệu
 * MẪU phục vụ xây dựng và kiểm thử website.
 * ============================================================
 */

(function () {
    "use strict";

    const products = [
        // =====================================================
        // 1. BỘT MÌ BAKER'S CHOICE SỐ 8
        // =====================================================
        {
            id: 1,
            sku: "BM-NL-001",
            name: "Bột mì Baker's Choice số 8",
            brand: "Baker's Choice",
            category: "nguyen-lieu",
            categoryName: "Nguyên liệu làm bánh",
            subCategory: "bot-mi",
            subCategoryName: "Bột mì",
            shortDescription: "Bột mì số 8 chuyên dùng làm bánh bông lan, cupcake, muffin và các loại bánh mềm.",
            description: "Bột mì Baker's Choice số 8 có hàm lượng protein thấp, phù hợp với các công thức bánh cần kết cấu mềm, nhẹ và xốp. Sản phẩm thích hợp cho người yêu thích làm bánh tại nhà.",
            images: [
                "images/products/bot-mi-so-8-1.jpg",
                "images/products/bot-mi-so-8-2.jpg",
                "images/products/bot-mi-so-8-3.jpg"
            ],
            unit: "gói",
            variants: [
                {
                    id: "100g",
                    label: "100g",
                    weight: "100g",
                    price: 8000,
                    originalPrice: 10000,
                    stock: 50,
                    status: "in_stock"
                },
                {
                    id: "300g",
                    label: "300g",
                    weight: "300g",
                    price: 18000,
                    originalPrice: 22000,
                    stock: 40,
                    status: "in_stock"
                },
                {
                    id: "500g",
                    label: "500g",
                    weight: "500g",
                    price: 28000,
                    originalPrice: 32000,
                    stock: 35,
                    status: "in_stock"
                },
                {
                    id: "1kg",
                    label: "1kg",
                    weight: "1kg",
                    price: 52000,
                    originalPrice: 58000,
                    stock: 20,
                    status: "in_stock"
                }
            ],
            specifications: {
                "Thương hiệu": "Baker's Choice",
                "Loại bột": "Bột mì số 8",
                "Khối lượng": "100g, 300g, 500g, 1kg",
                "Công dụng": "Làm bánh có kết cấu mềm, xốp",
                "Xuất xứ": "Theo thông tin trên bao bì"
            },
            usage: [
                "Sử dụng làm bánh bông lan, cupcake, muffin và chiffon.",
                "Nên rây bột trước khi trộn để bột tơi mịn.",
                "Kết hợp với các nguyên liệu khác theo công thức."
            ],
            storage: "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp. Đóng kín bao bì sau khi sử dụng.",
            rating: 4.8,
            reviewCount: 124,
            ratingDistribution: {
                5: 100,
                4: 18,
                3: 4,
                2: 1,
                1: 1
            },
            isFeatured: true,
            relatedProducts: [2, 3, 4],
            recipeSuggestions: [
                {
                    id: "CT-001",
                    name: "Bánh bông lan cơ bản",
                    duration: "60 phút",
                    difficulty: "Dễ",
                    image: "images/recipes/banh-bong-lan.jpg"
                },
                {
                    id: "CT-002",
                    name: "Cupcake vani",
                    duration: "45 phút",
                    difficulty: "Dễ",
                    image: "images/recipes/cupcake-vani.jpg"
                }
            ]
        },

        // =====================================================
        // 2. BỘT MÌ BAKER'S CHOICE SỐ 11
        // =====================================================
        {
            id: 2,
            sku: "BM-NL-002",
            name: "Bột mì Baker's Choice số 11",
            brand: "Baker's Choice",
            category: "nguyen-lieu",
            categoryName: "Nguyên liệu làm bánh",
            subCategory: "bot-mi",
            subCategoryName: "Bột mì",
            shortDescription: "Bột mì có hàm lượng protein cao, thích hợp làm bánh mì và các loại bánh cần độ dai.",
            description: "Bột mì Baker's Choice số 11 phù hợp với các công thức cần độ đàn hồi và cấu trúc dai hơn. Đây là nguyên liệu thường được sử dụng trong quá trình làm bánh mì và một số loại bánh nướng.",
            images: [
                "images/products/bot-mi-so-11-1.jpg",
                "images/products/bot-mi-so-11-2.jpg"
            ],
            unit: "gói",
            variants: [
                {
                    id: "1kg",
                    label: "1kg",
                    weight: "1kg",
                    price: 45000,
                    originalPrice: 50000,
                    stock: 30,
                    status: "in_stock"
                }
            ],
            specifications: {
                "Thương hiệu": "Baker's Choice",
                "Loại bột": "Bột mì số 11",
                "Khối lượng": "1kg",
                "Công dụng": "Làm bánh mì và bánh cần độ dai",
                "Xuất xứ": "Theo thông tin trên bao bì"
            },
            usage: [
                "Sử dụng làm bánh mì, bánh bao và các loại bánh cần độ dai.",
                "Kết hợp với men nở và các nguyên liệu theo công thức.",
                "Nhào bột đúng thời gian để tạo kết cấu phù hợp."
            ],
            storage: "Bảo quản nơi khô ráo, thoáng mát, tránh ẩm và côn trùng.",
            rating: 4.7,
            reviewCount: 86,
            ratingDistribution: {
                5: 65,
                4: 16,
                3: 3,
                2: 1,
                1: 1
            },
            isFeatured: true,
            relatedProducts: [1, 3, 4],
            recipeSuggestions: [
                {
                    id: "CT-003",
                    name: "Bánh mì sữa",
                    duration: "120 phút",
                    difficulty: "Trung bình",
                    image: "images/recipes/banh-mi-sua.jpg"
                }
            ]
        },

        // =====================================================
        // 3. BỘT MÌ ĐA DỤNG MEIZAN
        // =====================================================
        {
            id: 3,
            sku: "BM-NL-004",
            name: "Bột mì đa dụng Meizan",
            brand: "Meizan",
            category: "nguyen-lieu",
            categoryName: "Nguyên liệu làm bánh",
            subCategory: "bot-mi",
            subCategoryName: "Bột mì",
            shortDescription: "Bột mì đa dụng phù hợp với nhiều công thức bánh và món ăn gia đình.",
            description: "Bột mì đa dụng Meizan có thể sử dụng trong nhiều mục đích chế biến khác nhau. Sản phẩm phù hợp với người làm bánh tại nhà và những công thức không yêu cầu một loại bột chuyên biệt.",
            images: [
                "images/products/bot-mi-meizan-1.jpg",
                "images/products/bot-mi-meizan-2.jpg"
            ],
            unit: "gói",
            variants: [
                {
                    id: "1kg",
                    label: "1kg",
                    weight: "1kg",
                    price: 32000,
                    originalPrice: 36000,
                    stock: 45,
                    status: "in_stock"
                }
            ],
            specifications: {
                "Thương hiệu": "Meizan",
                "Loại bột": "Bột mì đa dụng",
                "Khối lượng": "1kg",
                "Công dụng": "Làm bánh và chế biến thực phẩm",
                "Xuất xứ": "Theo thông tin trên bao bì"
            },
            usage: [
                "Sử dụng trong các công thức bánh quy, bánh chiên và bánh nướng.",
                "Có thể kết hợp với nhiều nguyên liệu khác.",
                "Nên rây bột trước khi sử dụng."
            ],
            storage: "Bảo quản ở nơi khô thoáng, tránh ánh nắng và độ ẩm cao.",
            rating: 4.6,
            reviewCount: 73,
            ratingDistribution: {
                5: 52,
                4: 15,
                3: 4,
                2: 1,
                1: 1
            },
            isFeatured: false,
            relatedProducts: [1, 2, 4],
            recipeSuggestions: [
                {
                    id: "CT-004",
                    name: "Bánh quy bơ",
                    duration: "50 phút",
                    difficulty: "Dễ",
                    image: "images/recipes/banh-quy-bo.jpg"
                }
            ]
        },

        // =====================================================
        // 4. BỘT CACAO HERSHEY'S
        // =====================================================
        {
            id: 4,
            sku: "BM-NL-006",
            name: "Bột cacao nguyên chất Hershey's",
            brand: "Hershey's",
            category: "nguyen-lieu",
            categoryName: "Nguyên liệu làm bánh",
            subCategory: "bot-cacao",
            subCategoryName: "Bột cacao",
            shortDescription: "Bột cacao dùng tạo hương vị và màu sắc chocolate cho các món bánh.",
            description: "Bột cacao Hershey's là nguyên liệu thường được sử dụng trong các công thức bánh chocolate, brownie, bánh quy và đồ uống. Sản phẩm giúp tạo hương vị cacao đặc trưng cho thành phẩm.",
            images: [
                "images/products/bot-cacao-hershey-1.jpg",
                "images/products/bot-cacao-hershey-2.jpg"
            ],
            unit: "hộp",
            variants: [
                {
                    id: "100g",
                    label: "100g",
                    weight: "100g",
                    price: 65000,
                    originalPrice: 72000,
                    stock: 25,
                    status: "in_stock"
                }
            ],
            specifications: {
                "Thương hiệu": "Hershey's",
                "Loại sản phẩm": "Bột cacao",
                "Khối lượng": "100g",
                "Công dụng": "Làm bánh chocolate và đồ uống",
                "Xuất xứ": "Theo thông tin trên bao bì"
            },
            usage: [
                "Dùng làm bánh brownie, bánh chocolate và bánh quy.",
                "Có thể rây cùng bột mì để hạn chế vón cục.",
                "Điều chỉnh lượng sử dụng theo công thức."
            ],
            storage: "Bảo quản nơi khô ráo, kín khí, tránh nhiệt độ cao và độ ẩm.",
            rating: 4.9,
            reviewCount: 98,
            ratingDistribution: {
                5: 85,
                4: 10,
                3: 2,
                2: 1,
                1: 0
            },
            isFeatured: true,
            relatedProducts: [1, 3, 5],
            recipeSuggestions: [
                {
                    id: "CT-005",
                    name: "Brownie chocolate",
                    duration: "45 phút",
                    difficulty: "Dễ",
                    image: "images/recipes/brownie.jpg"
                }
            ]
        },

        // =====================================================
        // 5. MATCHA LÀM BÁNH
        // =====================================================
        {
            id: 5,
            sku: "BM-NL-018",
            name: "Bột Matcha làm bánh",
            brand: "BakeMate",
            category: "nguyen-lieu",
            categoryName: "Nguyên liệu làm bánh",
            subCategory: "bot-tra",
            subCategoryName: "Bột trà",
            shortDescription: "Bột matcha dùng tạo màu xanh và hương trà đặc trưng cho các món bánh.",
            description: "Bột matcha làm bánh được sử dụng trong các công thức bánh quy, cupcake, bông lan và nhiều món tráng miệng. Sản phẩm giúp tạo màu sắc và hương vị trà xanh cho thành phẩm.",
            images: [
                "images/products/matcha-lam-banh-1.jpg",
                "images/products/matcha-lam-banh-2.jpg"
            ],
            unit: "gói",
            variants: [
                {
                    id: "100g",
                    label: "100g",
                    weight: "100g",
                    price: 75000,
                    originalPrice: 85000,
                    stock: 0,
                    status: "coming_soon"
                }
            ],
            specifications: {
                "Thương hiệu": "BakeMate",
                "Loại sản phẩm": "Bột matcha",
                "Khối lượng": "100g",
                "Công dụng": "Làm bánh và món tráng miệng",
                "Xuất xứ": "Cần cập nhật theo nhà cung cấp"
            },
            usage: [
                "Sử dụng làm bánh matcha, cupcake và bánh quy.",
                "Rây bột trước khi trộn để bột phân tán đều.",
                "Điều chỉnh lượng matcha theo khẩu vị."
            ],
            storage: "Đậy kín bao bì sau khi mở, bảo quản nơi khô mát và tránh ánh sáng trực tiếp.",
            rating: 0,
            reviewCount: 0,
            ratingDistribution: {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0
            },
            isFeatured: false,
            relatedProducts: [4, 6, 1],
            recipeSuggestions: [
                {
                    id: "CT-006",
                    name: "Cupcake matcha",
                    duration: "50 phút",
                    difficulty: "Dễ",
                    image: "images/recipes/cupcake-matcha.jpg"
                }
            ]
        },

        // =====================================================
        // 6. WHIPPING CREAM
        // =====================================================
        {
            id: 6,
            sku: "BM-NL-026",
            name: "Whipping Cream",
            brand: "BakeMate",
            category: "nguyen-lieu",
            categoryName: "Nguyên liệu làm bánh",
            subCategory: "kem-sua",
            subCategoryName: "Kem và sữa",
            shortDescription: "Kem tươi dùng làm kem trang trí, mousse và các món tráng miệng.",
            description: "Whipping Cream là nguyên liệu được sử dụng trong nhiều công thức bánh và món tráng miệng. Sản phẩm có thể được đánh bông để tạo lớp kem trang trí hoặc sử dụng trong các công thức mousse và bánh lạnh.",
            images: [
                "images/products/whipping-cream-1.jpg",
                "images/products/whipping-cream-2.jpg"
            ],
            unit: "hộp",
            variants: [
                {
                    id: "250ml",
                    label: "250ml",
                    weight: "250ml",
                    price: 45000,
                    originalPrice: 50000,
                    stock: 30,
                    status: "in_stock"
                }
            ],
            specifications: {
                "Thương hiệu": "Cần cập nhật theo nhà cung cấp",
                "Loại sản phẩm": "Whipping Cream",
                "Dung tích": "250ml",
                "Công dụng": "Làm kem trang trí và món tráng miệng",
                "Bảo quản": "Theo hướng dẫn trên bao bì"
            },
            usage: [
                "Dùng làm kem trang trí bánh.",
                "Sử dụng trong công thức mousse và bánh lạnh.",
                "Làm lạnh trước khi đánh bông theo hướng dẫn của nhà sản xuất."
            ],
            storage: "Bảo quản theo hướng dẫn trên bao bì. Sau khi mở hộp cần đậy kín và sử dụng trong thời gian khuyến nghị.",
            rating: 4.7,
            reviewCount: 65,
            ratingDistribution: {
                5: 48,
                4: 13,
                3: 3,
                2: 1,
                1: 0
            },
            isFeatured: false,
            relatedProducts: [1, 4, 5],
            recipeSuggestions: [
                {
                    id: "CT-007",
                    name: "Bánh mousse chocolate",
                    duration: "120 phút",
                    difficulty: "Khó",
                    image: "images/recipes/mousse-chocolate.jpg"
                }
            ]
        },

        // =====================================================
        // 7. CÂN ĐIỆN TỬ NHÀ BẾP
        // =====================================================
        {
            id: 7,
            sku: "BM-DC-001",
            name: "Cân điện tử nhà bếp",
            brand: "BakeMate",
            category: "dung-cu",
            categoryName: "Dụng cụ làm bánh",
            subCategory: "dung-cu-do-luong",
            subCategoryName: "Dụng cụ đo lường",
            shortDescription: "Cân điện tử hỗ trợ cân nguyên liệu chính xác trong quá trình làm bánh.",
            description: "Cân điện tử nhà bếp giúp người dùng xác định khối lượng nguyên liệu theo công thức. Thiết bị hỗ trợ quá trình định lượng bột, đường, bơ và các nguyên liệu khác.",
            images: [
                "images/products/can-dien-tu-1.jpg",
                "images/products/can-dien-tu-2.jpg"
            ],
            unit: "cái",
            variants: [
                {
                    id: "standard",
                    label: "Mẫu tiêu chuẩn",
                    weight: "Mẫu tiêu chuẩn",
                    price: 120000,
                    originalPrice: 145000,
                    stock: 20,
                    status: "in_stock"
                }
            ],
            specifications: {
                "Thương hiệu": "BakeMate",
                "Loại sản phẩm": "Cân điện tử nhà bếp",
                "Đơn vị đo": "g, oz (tùy mẫu)",
                "Chức năng": "Cân nguyên liệu",
                "Chất liệu": "Theo thông tin sản phẩm thực tế"
            },
            usage: [
                "Đặt cân trên bề mặt phẳng trước khi sử dụng.",
                "Đặt vật chứa lên cân và sử dụng chức năng trừ bì nếu có.",
                "Cân nguyên liệu theo khối lượng được chỉ định trong công thức."
            ],
            storage: "Lau sạch sau khi sử dụng, tránh để nước tiếp xúc với bộ phận điện tử và bảo quản nơi khô ráo.",
            rating: 4.8,
            reviewCount: 52,
            ratingDistribution: {
                5: 42,
                4: 8,
                3: 1,
                2: 1,
                1: 0
            },
            isFeatured: true,
            relatedProducts: [8, 9, 10],
            recipeSuggestions: [
                {
                    id: "CT-008",
                    name: "Bánh quy bơ",
                    duration: "50 phút",
                    difficulty: "Dễ",
                    image: "images/recipes/banh-quy-bo.jpg"
                }
            ]
        },

        // =====================================================
        // 8. CA ĐONG NGUYÊN LIỆU
        // =====================================================
        {
            id: 8,
            sku: "BM-DC-002",
            name: "Ca đong nguyên liệu",
            brand: "BakeMate",
            category: "dung-cu",
            categoryName: "Dụng cụ làm bánh",
            subCategory: "dung-cu-do-luong",
            subCategoryName: "Dụng cụ đo lường",
            shortDescription: "Ca đong hỗ trợ đo lường chất lỏng và nguyên liệu trong công thức làm bánh.",
            description: "Ca đong nguyên liệu là dụng cụ hỗ trợ người làm bánh đo lường lượng nước, sữa và các chất lỏng khác. Thiết kế có vạch chia giúp quá trình định lượng thuận tiện hơn.",
            images: [
                "images/products/ca-dong-1.jpg",
                "images/products/ca-dong-2.jpg"
            ],
            unit: "cái",
            variants: [
                {
                    id: "500ml",
                    label: "500ml",
                    weight: "500ml",
                    price: 45000,
                    originalPrice: 55000,
                    stock: 35,
                    status: "in_stock"
                }
            ],
            specifications: {
                "Thương hiệu": "BakeMate",
                "Loại sản phẩm": "Ca đong",
                "Dung tích": "500ml",
                "Công dụng": "Đong chất lỏng và nguyên liệu",
                "Chất liệu": "Theo thông tin sản phẩm thực tế"
            },
            usage: [
                "Đổ nguyên liệu vào ca đến vạch chia cần thiết.",
                "Đặt ca trên mặt phẳng để quan sát mức nguyên liệu.",
                "Vệ sinh sau mỗi lần sử dụng."
            ],
            storage: "Bảo quản nơi sạch sẽ, khô ráo. Tránh va đập mạnh làm hư hỏng sản phẩm.",
            rating: 4.6,
            reviewCount: 38,
            ratingDistribution: {
                5: 27,
                4: 8,
                3: 2,
                2: 1,
                1: 0
            },
            isFeatured: false,
            relatedProducts: [7, 9, 10],
            recipeSuggestions: [
                {
                    id: "CT-009",
                    name: "Bánh bông lan cơ bản",
                    duration: "60 phút",
                    difficulty: "Dễ",
                    image: "images/recipes/banh-bong-lan.jpg"
                }
            ]
        },

        // =====================================================
        // 9. THÌA ĐONG ĐỊNH LƯỢNG
        // =====================================================
        {
            id: 9,
            sku: "BM-DC-003",
            name: "Thìa đong định lượng",
            brand: "BakeMate",
            category: "dung-cu",
            categoryName: "Dụng cụ làm bánh",
            subCategory: "dung-cu-do-luong",
            subCategoryName: "Dụng cụ đo lường",
            shortDescription: "Bộ thìa đong giúp định lượng các nguyên liệu với khối lượng nhỏ.",
            description: "Thìa đong định lượng hỗ trợ đo lường các nguyên liệu thường dùng với lượng nhỏ như bột nở, muối, vani và các loại gia vị. Bộ thìa phù hợp với người làm bánh tại nhà.",
            images: [
                "images/products/thia-dong-1.jpg",
                "images/products/thia-dong-2.jpg"
            ],
            unit: "bộ",
            variants: [
                {
                    id: "set",
                    label: "Bộ thìa đong",
                    weight: "Một bộ",
                    price: 35000,
                    originalPrice: 42000,
                    stock: 40,
                    status: "in_stock"
                }
            ],
            specifications: {
                "Thương hiệu": "BakeMate",
                "Loại sản phẩm": "Bộ thìa đong",
                "Công dụng": "Định lượng nguyên liệu",
                "Số lượng": "Theo mẫu sản phẩm",
                "Chất liệu": "Theo thông tin sản phẩm thực tế"
            },
            usage: [
                "Chọn thìa có dung tích phù hợp với công thức.",
                "Đong nguyên liệu và gạt phẳng bề mặt nếu cần.",
                "Vệ sinh và lau khô sau khi sử dụng."
            ],
            storage: "Bảo quản nơi khô ráo, sạch sẽ và tránh thất lạc các thìa trong bộ.",
            rating: 4.7,
            reviewCount: 44,
            ratingDistribution: {
                5: 34,
                4: 8,
                3: 1,
                2: 1,
                1: 0
            },
            isFeatured: false,
            relatedProducts: [7, 8, 10],
            recipeSuggestions: [
                {
                    id: "CT-010",
                    name: "Cupcake vani",
                    duration: "45 phút",
                    difficulty: "Dễ",
                    image: "images/recipes/cupcake-vani.jpg"
                }
            ]
        },

        // =====================================================
        // 10. NHIỆT KẾ ĐIỆN TỬ NHÀ BẾP
        // =====================================================
        {
            id: 10,
            sku: "BM-DC-004",
            name: "Nhiệt kế điện tử nhà bếp",
            brand: "BakeMate",
            category: "dung-cu",
            categoryName: "Dụng cụ làm bánh",
            subCategory: "dung-cu-do-luong",
            subCategoryName: "Dụng cụ đo lường",
            shortDescription: "Nhiệt kế điện tử hỗ trợ kiểm tra nhiệt độ nguyên liệu trong quá trình chế biến.",
            description: "Nhiệt kế điện tử nhà bếp giúp người dùng theo dõi nhiệt độ của một số nguyên liệu và hỗ trợ kiểm soát các bước trong công thức làm bánh. Sản phẩm phù hợp với những công thức cần chú ý đến nhiệt độ.",
            images: [
                "images/products/nhiet-ke-1.jpg",
                "images/products/nhiet-ke-2.jpg"
            ],
            unit: "cái",
            variants: [
                {
                    id: "standard",
                    label: "Mẫu tiêu chuẩn",
                    weight: "Mẫu tiêu chuẩn",
                    price: 95000,
                    originalPrice: 110000,
                    stock: 0,
                    status: "out_of_stock"
                }
            ],
            specifications: {
                "Thương hiệu": "BakeMate",
                "Loại sản phẩm": "Nhiệt kế điện tử",
                "Công dụng": "Đo nhiệt độ nguyên liệu",
                "Hiển thị": "Màn hình điện tử",
                "Chất liệu": "Theo thông tin sản phẩm thực tế"
            },
            usage: [
                "Đọc hướng dẫn sử dụng trước khi đo.",
                "Đặt đầu đo vào vị trí cần kiểm tra theo hướng dẫn của sản phẩm.",
                "Vệ sinh đầu đo sau khi sử dụng."
            ],
            storage: "Lau khô sau khi sử dụng, bảo quản nơi khô ráo và tránh va đập.",
            rating: 0,
            reviewCount: 0,
            ratingDistribution: {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0
            },
            isFeatured: false,
            relatedProducts: [7, 8, 9],
            recipeSuggestions: [
                {
                    id: "CT-011",
                    name: "Kẹo caramel",
                    duration: "40 phút",
                    difficulty: "Trung bình",
                    image: "images/recipes/keo-caramel.jpg"
                }
            ]
        },

        // =====================================================
        // 11. TÚI BẮT KEM DÙNG MỘT LẦN
        // =====================================================
        {
            id: 11,
            sku: "BM-PK-001",
            name: "Túi bắt kem dùng một lần",
            brand: "BakeMate",
            category: "phu-kien",
            categoryName: "Phụ kiện và đóng gói",
            subCategory: "phu-kien-trang-tri",
            subCategoryName: "Phụ kiện trang trí",
            shortDescription: "Túi bắt kem hỗ trợ tạo hình và trang trí bánh kem, cupcake và các món bánh.",
            description: "Túi bắt kem dùng một lần là phụ kiện hỗ trợ người làm bánh tạo hình kem trang trí. Sản phẩm có thể sử dụng kết hợp với các loại đui bắt kem phù hợp.",
            images: [
                "images/products/tui-bat-kem-1.jpg",
                "images/products/tui-bat-kem-2.jpg"
            ],
            unit: "bộ",
            variants: [
                {
                    id: "set",
                    label: "Bộ túi bắt kem",
                    weight: "Một bộ",
                    price: 25000,
                    originalPrice: 30000,
                    stock: 60,
                    status: "in_stock"
                }
            ],
            specifications: {
                "Thương hiệu": "BakeMate",
                "Loại sản phẩm": "Túi bắt kem dùng một lần",
                "Công dụng": "Trang trí bánh",
                "Quy cách": "Theo bộ sản phẩm",
                "Chất liệu": "Theo thông tin sản phẩm thực tế"
            },
            usage: [
                "Cho kem vào túi bắt kem với lượng phù hợp.",
                "Cắt đầu túi hoặc kết hợp với đui bắt kem.",
                "Bóp nhẹ để tạo hình trang trí theo nhu cầu."
            ],
            storage: "Bảo quản nơi khô ráo, sạch sẽ, tránh bụi bẩn và nhiệt độ cao.",
            rating: 4.8,
            reviewCount: 31,
            ratingDistribution: {
                5: 25,
                4: 5,
                3: 1,
                2: 0,
                1: 0
            },
            isFeatured: false,
            relatedProducts: [7, 8, 9],
            recipeSuggestions: [
                {
                    id: "CT-012",
                    name: "Cupcake trang trí kem",
                    duration: "60 phút",
                    difficulty: "Trung bình",
                    image: "images/recipes/cupcake-trang-tri.jpg"
                }
            ]
        }
    ];

    // =========================================================
    // NHÃN TRẠNG THÁI SẢN PHẨM
    // =========================================================

    const statusLabels = {
        in_stock: "Còn hàng",
        out_of_stock: "Hết hàng",
        coming_soon: "Sắp có hàng"
    };

    // =========================================================
    // CÁC HÀM TRUY XUẤT DỮ LIỆU SẢN PHẨM
    // =========================================================

    // Lấy sản phẩm theo ID hoặc SKU
    function getProductById(id) {
        return products.find(function (product) {
            return product.id === Number(id) || product.sku === id;
        }) || null;
    }

    // Lấy sản phẩm theo SKU
    function getProductBySku(sku) {
        return products.find(function (product) {
            return product.sku === sku;
        }) || null;
    }

    // Lấy biến thể của sản phẩm
    function getVariant(productId, variantId) {
        const product = getProductById(productId);

        if (!product) {
            return null;
        }

        return product.variants.find(function (variant) {
            return variant.id === variantId;
        }) || null;
    }

    // Lấy danh sách sản phẩm theo danh mục
    function getProductsByCategory(category) {
        return products.filter(function (product) {
            return product.category === category;
        });
    }

    // Lấy danh sách sản phẩm nổi bật
    function getFeaturedProducts() {
        return products.filter(function (product) {
            return product.isFeatured === true;
        });
    }

    // Lấy sản phẩm liên quan
    function getRelatedProducts(productId) {
        const product = getProductById(productId);

        if (!product) {
            return [];
        }

        return product.relatedProducts.map(function (id) {
            return getProductById(id);
        }).filter(Boolean);
    }

    // Kiểm tra sản phẩm có thể thêm vào giỏ hàng hay không
    function canAddToCart(productId, variantId) {
        const variant = getVariant(productId, variantId);

        if (!variant) {
            return false;
        }

        return variant.status === "in_stock" && variant.stock > 0;
    }

    // Lấy tên trạng thái sản phẩm
    function getStatusLabel(status) {
        return statusLabels[status] || "Chưa xác định";
    }

    // Tìm kiếm sản phẩm theo tên hoặc SKU
    function searchProducts(keyword) {
        const searchKeyword = String(keyword || "")
            .trim()
            .toLowerCase();

        if (!searchKeyword) {
            return products;
        }

        return products.filter(function (product) {
            return (
                product.name.toLowerCase().includes(searchKeyword) ||
                product.sku.toLowerCase().includes(searchKeyword) ||
                product.brand.toLowerCase().includes(searchKeyword)
            );
        });
    }

    // Lọc sản phẩm theo khoảng giá
    function getProductsByPrice(minPrice, maxPrice) {
        return products.filter(function (product) {
            return product.variants.some(function (variant) {
                return (
                    variant.price >= minPrice &&
                    variant.price <= maxPrice
                );
            });
        });
    }

    // Lấy giá thấp nhất của một sản phẩm
    function getMinPrice(product) {
        if (!product || !product.variants.length) {
            return 0;
        }

        return Math.min.apply(
            null,
            product.variants.map(function (variant) {
                return variant.price;
            })
        );
    }

    // Lấy tổng số sản phẩm
    function getProductCount() {
        return products.length;
    }

    // =========================================================
    // ĐỐI TƯỢNG DÙNG CHUNG CHO WEBSITE BAKEMATE
    // =========================================================

    const BakeMateStore = {
        products: products,
        statusLabels: statusLabels,

        getProductById: getProductById,
        getProductBySku: getProductBySku,
        getVariant: getVariant,
        getProductsByCategory: getProductsByCategory,
        getFeaturedProducts: getFeaturedProducts,
        getRelatedProducts: getRelatedProducts,
        canAddToCart: canAddToCart,
        getStatusLabel: getStatusLabel,
        searchProducts: searchProducts,
        getProductsByPrice: getProductsByPrice,
        getMinPrice: getMinPrice,
        getProductCount: getProductCount
    };

    // Cho phép sử dụng dữ liệu trong trình duyệt
    if (typeof window !== "undefined") {
        window.products = products;
        window.BakeMateStore = BakeMateStore;
    }

    // Hỗ trợ sử dụng trong môi trường Node.js
    if (typeof module !== "undefined" && module.exports) {
        module.exports = BakeMateStore;
    }

})();
