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
      "1": {
          "shortName": "Bột mì Baker's Choice số 8",
          "brand": "Baker's Choice",
          "origin": "Việt Nam",
          "rating": "4.8",
          "reviews": "124",
          "sold": "1.8k",
          "unit": "gói",
          "stock": "180",
          "images": [
              "images/products/bot-mi-baker-s-choice-so-8-1.webp",
              "images/products/bot-mi-baker-s-choice-so-8-2.webp"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "Baker's Choice (Interflour Việt Nam)"
              },
              {
                  "k": "Hàm lượng Protein",
                  "v": "8.0% – 9.0% (Bột mì số 8 chuyên bánh mềm xốp)"
              },
              {
                  "k": "Thành phần",
                  "v": "100% lúa mì chọn lọc xay mịn, không chất tẩy trắng"
              },
              {
                  "k": "Công dụng phù hợp",
                  "v": "Thích hợp làm bánh bông lan, chiffon, cupcake, muffin và các loại bánh mềm xốp."
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Rây mịn bột trước khi trộn để hỗn hợp tơi xốp và không vón cục."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Bảo quản nơi khô ráo, thoáng mát, buộc kín miệng túi sau khi mở."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-bong-lan",
                  "title": "Bánh bông lan cơ bản",
                  "time": "60 phút",
                  "diff": "Trung bình",
                  "usage": "Bột mì Baker's Choice số 8",
                  "img": "images/recipes/banh-bong-lan-co-ban.jpg"
              },
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Bột mì Baker's Choice số 8",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              },
              {
                  "recipeGroupId": "recipe-banh-quy-bo",
                  "title": "Cookies bơ",
                  "time": "40 phút",
                  "diff": "Dễ",
                  "usage": "Bột mì Baker's Choice số 8",
                  "img": "images/recipes/cookies-bo.jpg"
              }
          ],
          "relatedIds": []
      },
      "2": {
          "shortName": "Bột mì Baker's Choice số 11",
          "brand": "Baker's Choice",
          "origin": "Việt Nam",
          "rating": "4.7",
          "reviews": "86",
          "sold": "1.2k",
          "unit": "gói",
          "stock": "140",
          "images": [
              "images/products/bot-mi-baker-s-choice-so-11-1.webp",
              "images/products/bot-mi-baker-s-choice-so-11-2.webp",
              "images/products/bot-mi-baker-s-choice-so-11-3.webp"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "Baker's Choice (Interflour Việt Nam)"
              },
              {
                  "k": "Hàm lượng Protein",
                  "v": "11.5% – 13.0% (Tạo màng gluten dai khỏe chuẩn bánh mì)"
              },
              {
                  "k": "Thành phần",
                  "v": "100% lúa mì cứng chất lượng cao"
              },
              {
                  "k": "Công dụng phù hợp",
                  "v": "Phù hợp làm bánh mì hoa cúc, baguette, bánh mì sữa Hokkaido và đế pizza."
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Kết hợp cùng men nở và nhồi bột đúng thời gian để đạt độ dai thớ tối ưu."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Bảo quản nơi khô ráo, thoáng mát, tránh ẩm mốc."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-hoa-cuc",
                  "title": "Bánh mì hoa cúc",
                  "time": "120 phút",
                  "diff": "Khó",
                  "usage": "Bột mì Baker's Choice số 11",
                  "img": "images/recipes/banh-mi-hoa-cuc.jpg"
              }
          ],
          "relatedIds": []
      },
      "3": {
          "shortName": "Bột mì đa dụng Meizan",
          "brand": "Meizan",
          "origin": "Việt Nam",
          "rating": "4.9",
          "reviews": "185",
          "sold": "1.5k",
          "unit": "gói",
          "stock": "150",
          "images": [
              "images/products/bot-mi-meizan-1.jpg",
              "images/products/bot-mi-meizan-2.jpg",
              "images/products/bot-mi-meizan-3.jpg"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "MEIZAN (Tập đoàn FFM Berhad & Wilmar)"
              },
              {
                  "k": "Hàm lượng Protein",
                  "v": "9.5% – 11.5% (Đạt độ đàn hồi dẻo dai chuẩn đa dụng)"
              },
              {
                  "k": "Thành phần",
                  "v": "100% lúa mì hảo hạng nhập khẩu, bổ sung vi chất sắt và kẽm"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Bánh muffin, pancake, bánh quy bơ, bánh bao và các món nướng gia đình."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Bảo quản nơi khô ráo, sạch sẽ, thoáng mát, tránh nơi có mùi nồng."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-muffin-socola",
                  "title": "Bánh Chocolate Muffin",
                  "time": "45 phút",
                  "diff": "Dễ",
                  "usage": "Bột mì đa dụng Meizan",
                  "img": "images/recipes/banh-chocolate-muffin.jpg"
              },
              {
                  "recipeGroupId": "recipe-brownie",
                  "title": "Bánh Brownie",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Bột mì đa dụng Meizan",
                  "img": "images/recipes/banh-brownie.jpg"
              },
              {
                  "recipeGroupId": "recipe-pancake",
                  "title": "Bánh Pancake mật ong",
                  "time": "25 phút",
                  "diff": "Dễ",
                  "usage": "Bột mì đa dụng Meizan",
                  "img": "images/recipes/banh-pancake-mat-ong.jpg"
              }
          ],
          "relatedIds": []
      },
      "4": {
          "shortName": "Bột cacao nguyên chất Hershey's",
          "brand": "Hershey's",
          "origin": "Mỹ",
          "rating": "4.9",
          "reviews": "98",
          "sold": "1.1k",
          "unit": "hộp",
          "stock": "85",
          "images": [
              "images/products/bot-cacao-nguyen-chat-hershey-s-1.jpg",
              "images/products/bot-cacao-nguyen-chat-hershey-s-2.jpg",
              "images/products/bot-cacao-nguyen-chat-hershey-s-3.jpg"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "Hershey's (100% Cacao Natural Unsweetened)"
              },
              {
                  "k": "Thành phần",
                  "v": "100% bột cacao tự nhiên nguyên chất không đường, không chất bảo quản"
              },
              {
                  "k": "Đặc điểm hương vị",
                  "v": "Màu nâu đậm tự nhiên, vị chocolate nguyên bản, hương thơm nồng ấm"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Tạo hương vị chocolate đậm đà cho brownie, muffin, bánh quy và mousse."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Bảo quản nơi khô ráo, đậy kín nắp sau khi dùng."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-muffin-socola",
                  "title": "Bánh Chocolate Muffin",
                  "time": "45 phút",
                  "diff": "Dễ",
                  "usage": "Bột cacao nguyên chất Hershey's",
                  "img": "images/recipes/banh-chocolate-muffin.jpg"
              },
              {
                  "recipeGroupId": "recipe-brownie",
                  "title": "Bánh Brownie",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Bột cacao nguyên chất Hershey's",
                  "img": "images/recipes/banh-brownie.jpg"
              },
              {
                  "recipeGroupId": "recipe-mousse-socola",
                  "title": "Bánh Mousse Chocolate",
                  "time": "75 phút",
                  "diff": "Trung bình",
                  "usage": "Bột cacao nguyên chất Hershey's",
                  "img": "images/recipes/banh-mousse-chocolate.jpg"
              }
          ],
          "relatedIds": []
      },
      "5": {
          "shortName": "Bột Matcha",
          "brand": "365 Whole Foods Market",
          "origin": "Nhật Bản",
          "rating": "4.8",
          "reviews": "74",
          "sold": "680",
          "unit": "gói",
          "stock": "65",
          "images": [
              "images/products/bot-matcha-1.webp",
              "images/products/bot-matcha-2.webp"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "BakeMate Selected (Culinary Matcha)"
              },
              {
                  "k": "Thành phần",
                  "v": "100% lá trà xanh nghiền mịn chuyên dụng làm bánh"
              },
              {
                  "k": "Đặc điểm màu sắc",
                  "v": "Bột siêu mịn dễ hòa tan, màu xanh dịu tự nhiên và hương trà thanh nhẹ"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Dùng làm cupcake, chiffon, bánh quy và tiramisu trà xanh."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Đậy kín túi zip, tránh ánh sáng trực tiếp và nhiệt độ cao."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Bột Matcha",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              }
          ],
          "relatedIds": []
      },
      "6": {
          "shortName": "Whipping Cream Anchor",
          "brand": "Anchor",
          "origin": "New Zealand",
          "rating": "4.8",
          "reviews": "156",
          "sold": "1.9k",
          "unit": "hộp",
          "stock": "90",
          "images": [
              "images/products/whipping-cream-anchor-1.jpg",
              "images/products/whipping-cream-anchor-2.webp",
              "images/products/whipping-cream-anchor-3.jpg",
              "images/products/whipping-cream-anchor-4.webp"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "Anchor (Kem tươi sữa bò tiệt trùng không đường)"
              },
              {
                  "k": "Hàm lượng chất béo",
                  "v": "35.1% chất béo sữa tự nhiên, đánh bông mịn đứng form"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Đánh bông chà láng bánh kem, làm nhân su kem, mousse và panna cotta."
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Làm lạnh hộp kem và âu đánh ở 2 – 4°C trước khi đánh bông."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Bảo quản ngăn mát tủ lạnh (2 – 4°C), không cấp đông."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Whipping Cream Anchor",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              },
              {
                  "recipeGroupId": "recipe-mousse-socola",
                  "title": "Bánh Mousse Chocolate",
                  "time": "75 phút",
                  "diff": "Trung bình",
                  "usage": "Whipping Cream Anchor",
                  "img": "images/recipes/banh-mousse-chocolate.jpg"
              }
          ],
          "relatedIds": []
      },
      "7": {
          "shortName": "Cân điện tử nhà bếp",
          "brand": "BakeMate",
          "origin": "Nhập khẩu",
          "rating": "4.8",
          "reviews": "112",
          "sold": "920",
          "unit": "cái",
          "stock": "70",
          "images": [
              "images/products/can-dien-tu-1.jpg",
              "images/products/can-dien-tu-2.jpg",
              "images/products/can-dien-tu-3.jpg"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "BakeMate Kitchen Tools"
              },
              {
                  "k": "Tải trọng & Độ chia",
                  "v": "Cân tối đa 5kg | Độ chia chính xác 1g"
              },
              {
                  "k": "Tính năng nổi bật",
                  "v": "Chuyển đổi g / oz / ml; nút Tare trừ bì tiện lợi, màn hình LCD rõ nét"
              },
              {
                  "k": "Công dụng phù hợp",
                  "v": "Cân đo chính xác từng gram bột, đường, bơ, men nở cho mọi công thức bánh."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Lau bằng khăn ẩm nhẹ, tránh ngâm nước, bảo quản nơi khô ráo."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-bong-lan",
                  "title": "Bánh bông lan cơ bản",
                  "time": "60 phút",
                  "diff": "Trung bình",
                  "usage": "Cân điện tử nhà bếp",
                  "img": "images/recipes/banh-bong-lan-co-ban.jpg"
              },
              {
                  "recipeGroupId": "recipe-hoa-cuc",
                  "title": "Bánh mì hoa cúc",
                  "time": "120 phút",
                  "diff": "Khó",
                  "usage": "Cân điện tử nhà bếp",
                  "img": "images/recipes/banh-mi-hoa-cuc.jpg"
              }
          ],
          "relatedIds": []
      },
      "8": {
          "shortName": "Ca đong nguyên liệu",
          "brand": "BakeMate",
          "origin": "Việt Nam",
          "rating": "4.7",
          "reviews": "64",
          "sold": "780",
          "unit": "cái",
          "stock": "120",
          "images": [
              "images/products/ca-dong-nguyen-lieu-1.webp",
              "images/products/ca-dong-nguyen-lieu-2.jpg",
              "images/products/ca-dong-nguyen-lieu-3.webp",
              "images/products/ca-dong-nguyen-lieu-4.jpg"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "BakeMate Kitchen Tools"
              },
              {
                  "k": "Chất liệu",
                  "v": "Nhựa PP nguyên sinh an toàn thực phẩm, trong suốt"
              },
              {
                  "k": "Thang đo dung tích",
                  "v": "Vạch chia ml và cup rõ nét hai mặt, vòi rót chống nhỏ giọt"
              },
              {
                  "k": "Công dụng phù hợp",
                  "v": "Đo lường chính xác lượng nước, sữa tươi, mật ong và chất lỏng."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Rửa sạch sau sử dụng, tránh đặt sát nguồn lửa trực tiếp."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-pancake",
                  "title": "Bánh Pancake mật ong",
                  "time": "25 phút",
                  "diff": "Dễ",
                  "usage": "Ca đong nguyên liệu",
                  "img": "images/recipes/banh-pancake-mat-ong.jpg"
              }
          ],
          "relatedIds": []
      },
      "9": {
          "shortName": "Thìa đong định lượng",
          "brand": "BakeMate",
          "origin": "Nhập khẩu",
          "rating": "4.8",
          "reviews": "79",
          "sold": "1.0k",
          "unit": "bộ",
          "stock": "135",
          "images": [
              "images/products/thia-dong-dinh-luong-1.webp",
              "images/products/thia-dong-dinh-luong-2.jpg"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "BakeMate Kitchen Tools"
              },
              {
                  "k": "Quy cách bộ thìa",
                  "v": "5 cỡ chuẩn tsp / tbsp (1.25ml, 2.5ml, 5ml, 7.5ml, 15ml)"
              },
              {
                  "k": "Công dụng phù hợp",
                  "v": "Định lượng chuẩn các nguyên liệu nhỏ như Cream of Tartar, men nở, vani, muối."
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Gạt ngang miệng thìa bằng sống dao để đúng dung tích tiêu chuẩn."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Lau khô sau khi rửa và móc gọn vào khoen giữ."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-pancake",
                  "title": "Bánh Pancake mật ong",
                  "time": "25 phút",
                  "diff": "Dễ",
                  "usage": "Thìa đong định lượng",
                  "img": "images/recipes/banh-pancake-mat-ong.jpg"
              }
          ],
          "relatedIds": []
      },
      "10": {
          "shortName": "Nhiệt kế điện tử nhà bếp",
          "brand": "BakeMate",
          "origin": "Nhập khẩu",
          "rating": "4.7",
          "reviews": "49",
          "sold": "540",
          "unit": "cái",
          "stock": "60",
          "images": [
              "images/products/nhiet-ke-dien-tu-nha-bep-1.webp",
              "images/products/nhiet-ke-dien-tu-nha-bep-2.webp",
              "images/products/nhiet-ke-dien-tu-nha-bep-3.jpg"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "BakeMate Kitchen Tools"
              },
              {
                  "k": "Dải đo nhiệt độ",
                  "v": "-50°C đến 300°C | Hiển thị nhanh trên màn hình điện tử"
              },
              {
                  "k": "Chất liệu đầu dò",
                  "v": "Thép không gỉ 304 an toàn thực phẩm, dễ vệ sinh"
              },
              {
                  "k": "Công dụng phù hợp",
                  "v": "Kiểm tra nhiệt độ sữa ấm kích men nở, đun chảy bơ socola, thắng đường caramel."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Lau sạch đầu dò inox, không ngâm thân máy vào nước."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-hoa-cuc",
                  "title": "Bánh mì hoa cúc",
                  "time": "120 phút",
                  "diff": "Khó",
                  "usage": "Nhiệt kế điện tử nhà bếp",
                  "img": "images/recipes/banh-mi-hoa-cuc.jpg"
              },
              {
                  "recipeGroupId": "recipe-brownie",
                  "title": "Bánh Brownie",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Nhiệt kế điện tử nhà bếp",
                  "img": "images/recipes/banh-brownie.jpg"
              }
          ],
          "relatedIds": []
      },
      "11": {
          "shortName": "Túi bắt kem dùng một lần",
          "brand": "BakeMate",
          "origin": "Việt Nam",
          "rating": "4.9",
          "reviews": "88",
          "sold": "1.4k",
          "unit": "gói",
          "stock": "220",
          "images": [
              "images/products/tui-bat-kem-dung-mot-lan-1.webp",
              "images/products/tui-bat-kem-dung-mot-lan-2.webp"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "BakeMate Packaging & Tools"
              },
              {
                  "k": "Chất liệu",
                  "v": "Nhựa PE thực phẩm dày dặn, bề mặt vân nhám chống trơn trượt"
              },
              {
                  "k": "Tính tương thích",
                  "v": "Lắp vừa mọi loại đui bắt kem inox hoặc cắt đầu bóp trực tiếp"
              },
              {
                  "k": "Công dụng phù hợp",
                  "v": "Trang trí kem cupcake, tạo hình bánh quy bơ và bơm nhân su kem."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Bảo quản nơi khô ráo, sạch sẽ, tránh nhiệt độ cao."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Túi bắt kem dùng một lần",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              },
              {
                  "recipeGroupId": "recipe-banh-quy-bo",
                  "title": "Cookies bơ",
                  "time": "40 phút",
                  "diff": "Dễ",
                  "usage": "Túi bắt kem dùng một lần",
                  "img": "images/recipes/cookies-bo.jpg"
              }
          ],
          "relatedIds": []
      },
      "12": {
          "shortName": "Bơ lạt Anchor",
          "brand": "Anchor",
          "origin": "New Zealand",
          "rating": "3.5",
          "reviews": "214",
          "sold": "2.3k",
          "unit": "khối",
          "stock": "110",
          "images": [
              "images/products/bo-lat-anchor-1.jpg",
              "images/products/bo-lat-anchor-2.jpg",
              "images/products/bo-lat-anchor-3.webp"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "Anchor (Fonterra New Zealand)"
              },
              {
                  "k": "Thành phần",
                  "v": "Bơ sữa bò nguyên chất 82.9% chất béo sữa, không muối"
              },
              {
                  "k": "Đặc điểm hương vị",
                  "v": "Vàng tự nhiên, mềm dẻo ở nhiệt độ phòng, mùi thơm bơ sữa béo ngậy"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Nguyên liệu không thể thiếu cho bánh mì hoa cúc, quy bơ, brownie và croissant."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Bảo quản ngăn mát tủ lạnh (2–4°C) hoặc ngăn đông nếu dùng lâu dài."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Bơ lạt Anchor",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              },
              {
                  "recipeGroupId": "recipe-banh-quy-bo",
                  "title": "Cookies bơ",
                  "time": "40 phút",
                  "diff": "Dễ",
                  "usage": "Bơ lạt Anchor",
                  "img": "images/recipes/cookies-bo.jpg"
              },
              {
                  "recipeGroupId": "recipe-hoa-cuc",
                  "title": "Bánh mì hoa cúc",
                  "time": "120 phút",
                  "diff": "Khó",
                  "usage": "Bơ lạt Anchor",
                  "img": "images/recipes/banh-mi-hoa-cuc.jpg"
              }
          ],
          "relatedIds": []
      },
      "13": {
          "shortName": "Đường tinh luyện Biên Hòa",
          "brand": "Biên Hòa",
          "origin": "Việt Nam",
          "rating": "4.8",
          "reviews": "142",
          "sold": "2.1k",
          "unit": "túi",
          "stock": "200",
          "images": [
              "images/products/duong-tinh-luyen-bien-hoa-1.jpg",
              "images/products/duong-tinh-luyen-bien-hoa-2.jpg",
              "images/products/duong-tinh-luyen-bien-hoa-3.webp"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "Đường Biên Hòa (TTC Sugar)"
              },
              {
                  "k": "Độ tinh khiết",
                  "v": "≥ 99.8% Sucrose, hạt đường trắng mịn đều, không tẩy trắng"
              },
              {
                  "k": "Công dụng phù hợp",
                  "v": "Tan nhanh khi đánh bông trứng làm bông lan, nấu caramel và tạo vị ngọt thanh."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Đậy kín hộp hoặc buộc chặt túi sau sử dụng, tránh nơi ẩm ướt."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-bong-lan",
                  "title": "Bánh bông lan cơ bản",
                  "time": "60 phút",
                  "diff": "Trung bình",
                  "usage": "Đường tinh luyện Biên Hòa",
                  "img": "images/recipes/banh-bong-lan-co-ban.jpg"
              },
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Đường tinh luyện Biên Hòa",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              },
              {
                  "recipeGroupId": "recipe-banh-quy-bo",
                  "title": "Cookies bơ",
                  "time": "40 phút",
                  "diff": "Dễ",
                  "usage": "Đường tinh luyện Biên Hòa",
                  "img": "images/recipes/cookies-bo.jpg"
              }
          ],
          "relatedIds": []
      },
      "14": {
          "shortName": "Bột làm bánh Tartar",
          "brand": "Baker's Choice",
          "origin": "Nhập khẩu",
          "rating": "4.9",
          "reviews": "68",
          "sold": "890",
          "unit": "hộp",
          "stock": "95",
          "images": [
              "images/products/bot-lam-banh-tartar-1.webp",
              "images/products/bot-lam-banh-tartar-2.png"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "Baker's Baking Essentials"
              },
              {
                  "k": "Thành phần",
                  "v": "100% Potassium Bitartrate tinh khiết dùng trong làm bánh"
              },
              {
                  "k": "Công dụng nổi bật",
                  "v": "Ổn định bọt khí lòng trắng trứng giúp bánh bông lan, chiffon nở cao không xẹp."
              },
              {
                  "k": "Liều lượng khuyên dùng",
                  "v": "1/4 – 1/2 thìa cà phê (khoảng 1–2g) cho 4 lòng trắng trứng."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Đậy kín nắp sau khi mở, đặt nơi khô ráo thoáng mát."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-bong-lan",
                  "title": "Bánh bông lan cơ bản",
                  "time": "60 phút",
                  "diff": "Trung bình",
                  "usage": "Bột làm bánh Tartar",
                  "img": "images/recipes/banh-bong-lan-co-ban.jpg"
              }
          ],
          "relatedIds": []
      },
      "15": {
          "shortName": "Trứng gà",
          "brand": "BakeMate Fresh",
          "origin": "Việt Nam",
          "rating": "4.9",
          "reviews": "173",
          "sold": "2.4k",
          "unit": "vỉ",
          "stock": "80",
          "images": [
              "images/products/trung-ga-1.jpg",
              "images/products/trung-ga-2.jpg",
              "images/products/trung-ga-3.webp"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "BakeMate Farm Fresh Eggs"
              },
              {
                  "k": "Khối lượng quả",
                  "v": "55 – 60g/quả đồng đều (đúng chuẩn cân nặng công thức làm bánh)"
              },
              {
                  "k": "Đặc điểm chất lượng",
                  "v": "Lòng trắng sánh trong dễ đánh bông, lòng đỏ đậm màu tạo hương thơm béo"
              },
              {
                  "k": "Giao hàng & Đóng gói",
                  "v": "Đựng trong vỉ bảo vệ chống sốc chuyên dụng, giao nhanh trong 2h nội thành."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Bảo quản ngăn mát tủ lạnh và để về nhiệt độ phòng trước khi đánh bánh 30 phút."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-bong-lan",
                  "title": "Bánh bông lan cơ bản",
                  "time": "60 phút",
                  "diff": "Trung bình",
                  "usage": "Trứng gà",
                  "img": "images/recipes/banh-bong-lan-co-ban.jpg"
              },
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Trứng gà",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              },
              {
                  "recipeGroupId": "recipe-banh-quy-bo",
                  "title": "Cookies bơ",
                  "time": "40 phút",
                  "diff": "Dễ",
                  "usage": "Trứng gà",
                  "img": "images/recipes/cookies-bo.jpg"
              }
          ],
          "relatedIds": []
      },
      "16": {
          "shortName": "Phới lồng đánh trứng Inox",
          "brand": "BakeMate",
          "origin": "Nhập khẩu",
          "rating": "4.8",
          "reviews": "62",
          "sold": "740",
          "unit": "cái",
          "stock": "95",
          "images": [
              "images/products/phoi-long-danh-trung-inox-1.jpg",
              "images/products/phoi-long-danh-trung-inox-2.jpg",
              "images/products/phoi-long-danh-trung-inox-3.jpg"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "BakeMate Kitchen Tools"
              },
              {
                  "k": "Chất liệu",
                  "v": "Thép không gỉ 304 đan 10 nan đàn hồi, tay cầm gỗ sồi tự nhiên"
              },
              {
                  "k": "Kích thước",
                  "v": "Dài 25cm (Tiêu chuẩn) hoặc 30cm (Cán dài đánh âu sâu)"
              },
              {
                  "k": "Công dụng phù hợp",
                  "v": "Đánh đều lòng đỏ trứng, trộn bột loãng, hòa kem tươi và sốt custard."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Rửa sạch ngay sau khi dùng, treo ráo bằng móc inox cuối tay cầm."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-muffin-socola",
                  "title": "Bánh Chocolate Muffin",
                  "time": "45 phút",
                  "diff": "Dễ",
                  "usage": "Phới lồng đánh trứng Inox",
                  "img": "images/recipes/banh-chocolate-muffin.jpg"
              },
              {
                  "recipeGroupId": "recipe-mousse-socola",
                  "title": "Bánh Mousse Chocolate",
                  "time": "75 phút",
                  "diff": "Trung bình",
                  "usage": "Phới lồng đánh trứng Inox",
                  "img": "images/recipes/banh-mousse-chocolate.jpg"
              }
          ],
          "relatedIds": []
      },
      "17": {
          "shortName": "Khuôn bánh bông lan tròn chống dính",
          "brand": "BakeMate",
          "origin": "Nhập khẩu",
          "rating": "4.9",
          "reviews": "105",
          "sold": "980",
          "unit": "cái",
          "stock": "75",
          "images": [
              "images/products/khuon-banh-tron-1.jpg",
              "images/products/khuon-banh-tron-2.jpg",
              "images/products/khuon-banh-tron-3.jpg"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "BakeMate Bakeware"
              },
              {
                  "k": "Chất liệu",
                  "v": "Hợp kim nhôm Anodized phủ chống dính cao cấp, đế rời tiện tách bánh"
              },
              {
                  "k": "Kích thước chuẩn",
                  "v": "Đường kính 20cm × Chiều cao 7.5cm (hoặc cỡ 22cm)"
              },
              {
                  "k": "Công dụng phù hợp",
                  "v": "Nướng cốt bông lan sinh nhật, chiffon, cheesecake và đổ mousse lạnh."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Dùng mút mềm vệ sinh sau khi nguội, không dùng cọ sắt làm trầy lớp phủ."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-bong-lan",
                  "title": "Bánh bông lan cơ bản",
                  "time": "60 phút",
                  "diff": "Trung bình",
                  "usage": "Khuôn bánh bông lan tròn chống dính (20cm)",
                  "img": "images/recipes/banh-bong-lan-co-ban.jpg"
              },
              {
                  "recipeGroupId": "recipe-mousse-socola",
                  "title": "Bánh Mousse Chocolate",
                  "time": "75 phút",
                  "diff": "Trung bình",
                  "usage": "Khuôn bánh bông lan tròn chống dính (20cm)",
                  "img": "images/recipes/banh-mousse-chocolate.jpg"
              }
          ],
          "relatedIds": []
      },
      "18": {
          "shortName": "Giấy nến nướng bánh chống dính",
          "brand": "BakeMate",
          "origin": "Việt Nam",
          "rating": "4.8",
          "reviews": "132",
          "sold": "1.7k",
          "unit": "cuộn",
          "stock": "190",
          "images": [
              "images/products/giay-nen-1.jpg",
              "images/products/giay-nen-2.jpg",
              "images/products/giay-nen-3.jpg"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "BakeMate Baking Essentials"
              },
              {
                  "k": "Chất liệu & An toàn",
                  "v": "Bột gỗ nguyên chất phủ silicone chống dính 2 mặt, không chứa PFAS"
              },
              {
                  "k": "Khả năng chịu nhiệt",
                  "v": "Chịu nhiệt lên đến 230°C (an toàn với lò nướng và nồi chiên không dầu)"
              },
              {
                  "k": "Công dụng phù hợp",
                  "v": "Lót đáy khuôn brownie, bánh bông lan, nướng bánh quy bơ không bám khay."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Bảo quản hộp nơi khô ráo, sử dụng thanh răng cưa trên hộp để cắt nhanh."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-banh-quy-bo",
                  "title": "Cookies bơ",
                  "time": "40 phút",
                  "diff": "Dễ",
                  "usage": "Giấy nến nướng bánh chống dính",
                  "img": "images/recipes/cookies-bo.jpg"
              },
              {
                  "recipeGroupId": "recipe-brownie",
                  "title": "Bánh Brownie",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Giấy nến nướng bánh chống dính",
                  "img": "images/recipes/banh-brownie.jpg"
              }
          ],
          "relatedIds": []
      },
      "19": {
          "shortName": "Cup giấy nướng bánh Cupcake",
          "brand": "BakeMate",
          "origin": "Việt Nam",
          "rating": "4.9",
          "reviews": "118",
          "sold": "1.6k",
          "unit": "lốc",
          "stock": "240",
          "images": [
              "images/products/cup-giay-1.jpg",
              "images/products/cup-giay-2.jpg",
              "images/products/cup-giay-3.jpg"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "BakeMate Packaging & Tools"
              },
              {
                  "k": "Chất liệu",
                  "v": "Giấy kraft thực phẩm định lượng dày chống thấm dầu mỡ"
              },
              {
                  "k": "Kích thước chuẩn",
                  "v": "Đường kính đáy 5cm × Cao 3.8cm (vừa khay 6 hoặc 12 lỗ)"
              },
              {
                  "k": "Công dụng phù hợp",
                  "v": "Nướng trực tiếp muffin chocolate, cupcake trà xanh giữ phom đứng đẹp."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Đậy kín hộp nhựa bảo vệ tránh bụi ẩm và giữ nếp xếp ly."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Cup giấy nướng bánh Cupcake",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              },
              {
                  "recipeGroupId": "recipe-muffin-socola",
                  "title": "Bánh Chocolate Muffin",
                  "time": "45 phút",
                  "diff": "Dễ",
                  "usage": "Cup giấy nướng bánh Cupcake",
                  "img": "images/recipes/banh-chocolate-muffin.jpg"
              }
          ],
          "relatedIds": []
      },
      "20": {
          "shortName": "Bộ đui bắt kem Inox",
          "brand": "BakeMate",
          "origin": "Nhập khẩu",
          "rating": "4.9",
          "reviews": "94",
          "sold": "1.1k",
          "unit": "bộ",
          "stock": "88",
          "images": [
              "images/products/bo-dui-bat-kem-inox-1.webp",
              "images/products/bo-dui-bat-kem-inox-2.webp",
              "images/products/bo-dui-bat-kem-inox-3.jpg"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "BakeMate Kitchen Tools"
              },
              {
                  "k": "Chất liệu & Phụ kiện",
                  "v": "12 đui Inox 304 đúc liền khối chống gỉ + khớp nối nhựa PP"
              },
              {
                  "k": "Kiểu hoa văn",
                  "v": "Đui sao mở/đóng, đui cánh hoa hồng, đui lá, viền sò, đui viết nét"
              },
              {
                  "k": "Công dụng phù hợp",
                  "v": "Trang trí kem cupcake, bánh sinh nhật và bắt bột bánh quy bơ tạo hình."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Rửa nước ấm để sạch bơ kem, lau khô và cất trong hộp nhựa kèm theo."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Bộ đui bắt kem Inox",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              },
              {
                  "recipeGroupId": "recipe-banh-quy-bo",
                  "title": "Cookies bơ",
                  "time": "40 phút",
                  "diff": "Dễ",
                  "usage": "Bộ đui bắt kem Inox",
                  "img": "images/recipes/cookies-bo.jpg"
              }
          ],
          "relatedIds": []
      },
      "21": {
          "shortName": "Hộp giấy đựng bánh kem có quai xách",
          "brand": "BakeMate",
          "origin": "Việt Nam",
          "rating": "4.8",
          "reviews": "77",
          "sold": "960",
          "unit": "set",
          "stock": "145",
          "images": [
              "images/products/hop-dung-banh-1.jpg",
              "images/products/hop-dung-banh-2.jpg",
              "images/products/hop-dung-banh-3.jpg"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "BakeMate Packaging & Tools"
              },
              {
                  "k": "Kích thước hộp",
                  "v": "25 × 25 × 18cm (vừa bánh tròn 20cm kèm đế vàng)"
              },
              {
                  "k": "Chất liệu",
                  "v": "Giấy Ivory 350gsm dày cứng kết hợp cửa sổ mica trong suốt và quai xách"
              },
              {
                  "k": "Công dụng phù hợp",
                  "v": "Đóng gói bảo vệ bánh kem, mousse, hoa cúc gọn gàng khi biếu tặng bạn bè."
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Để phẳng ở nơi khô thoáng, gấp gọn theo nếp cấn sẵn khi sử dụng."
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Hộp giấy đựng bánh kem có quai xách",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              }
          ],
          "relatedIds": []
      },
      "24": {
          "shortName": "Sữa Tươi Tiệt Trùng Không Đường Vinamilk 100%",
          "brand": "Vinamilk",
          "origin": "Việt Nam",
          "rating": "4.9",
          "reviews": "312",
          "sold": "4.5k",
          "unit": "hộp",
          "stock": "120",
          "images": [
              "images/products/sua-tuoi-vinamilk-1.webp",
              "images/products/sua-tuoi-vinamilk-2.webp",
              "images/products/sua-tuoi-vinamilk-3.jpg"
          ],
          "specs": [
              {
                  "k": "Mã sản phẩm",
                  "v": "#BM-010"
              },
              {
                  "k": "Thương hiệu",
                  "v": "Vinamilk (Sữa tươi tiệt trùng 100% không đường)"
              },
              {
                  "k": "Thành phần & Dinh dưỡng",
                  "v": "100% sữa bò tươi nguyên chất, hàm lượng chất béo ~3.2g/100ml, giàu canxi và đạm tự nhiên"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Làm cốt bánh bông lan, bánh flan, panna cotta, nhân kem trứng (custard) và nhào bột bánh mì"
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Lắc đều trước khi dùng. Dùng trực tiếp ở nhiệt độ phòng hoặc đun ấm nhẹ tùy theo yêu cầu công thức"
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Bảo quản nơi khô ráo, thoáng mát khi chưa mở nắp. Sau khi mở nắp, đậy kín và bảo quản ngăn mát tủ lạnh (2–4°C), dùng hết trong 3–4 ngày"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-bong-lan",
                  "title": "Bánh bông lan cơ bản",
                  "time": "60 phút",
                  "diff": "Trung bình",
                  "usage": "Sữa Tươi Tiệt Trùng Không Đường Vinamilk 100%",
                  "img": "images/recipes/banh-bong-lan-co-ban.jpg"
              },
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Sữa Tươi Tiệt Trùng Không Đường Vinamilk 100%",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              },
              {
                  "recipeGroupId": "recipe-hoa-cuc",
                  "title": "Bánh mì hoa cúc",
                  "time": "120 phút",
                  "diff": "Khó",
                  "usage": "Sữa Tươi Tiệt Trùng Không Đường Vinamilk 100%",
                  "img": "images/recipes/banh-mi-hoa-cuc.jpg"
              }
          ],
          "relatedIds": []
      },
      "25": {
          "shortName": "Lá Gelatine Ewald Bronze",
          "brand": "Ewald",
          "origin": "Đức",
          "rating": "4.9",
          "reviews": "168",
          "sold": "2.3k",
          "unit": "hộp",
          "stock": "55",
          "images": [
              "images/products/la-gelatine-ewald-bronze-1.jpg",
              "images/products/la-gelatine-ewald-bronze-2.jpg",
              "images/products/la-gelatine-ewald-bronze-3.jpg"
          ],
          "specs": [
              {
                  "k": "Mã sản phẩm",
                  "v": "#BM-011"
              },
              {
                  "k": "Thương hiệu",
                  "v": "Ewald Gelatine (Dòng Bronze, nhập khẩu Đức)"
              },
              {
                  "k": "Hàm lượng & Đặc tính",
                  "v": "100% nguyên chất, độ bloom chuẩn dòng Bronze, không mùi không vị"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Làm bánh Mousse Chocolate, Panna Cotta, thạch trái cây và các món tráng miệng lạnh"
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Ngâm lá gelatine trong nước lạnh khoảng 5–7 phút cho mềm, vớt ra vắt nhẹ rồi hòa tan vào hỗn hợp ấm"
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và đậy kín sau khi sử dụng"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-mousse-socola",
                  "title": "Bánh Mousse Chocolate",
                  "time": "75 phút",
                  "diff": "Trung bình",
                  "usage": "Lá Gelatine Ewald Bronze",
                  "img": "images/recipes/banh-mousse-chocolate.jpg"
              }
          ],
          "relatedIds": []
      },
      "26": {
          "shortName": "Baking Soda",
          "brand": "Arm & Hammer",
          "origin": "Mỹ",
          "rating": "4.9",
          "reviews": "245",
          "sold": "3.1k",
          "unit": "hộp",
          "stock": "110",
          "images": [
              "images/products/baking-soda-1.webp",
              "images/products/baking-soda-2.webp",
              "images/products/baking-soda-3.webp"
          ],
          "specs": [
              {
                  "k": "Mã sản phẩm",
                  "v": "#BM-012"
              },
              {
                  "k": "Thương hiệu",
                  "v": "Arm & Hammer (Pure Baking Soda, nhập khẩu Mỹ)"
              },
              {
                  "k": "Thành phần & Đặc tính",
                  "v": "100% Sodium Bicarbonate tinh khiết, chất tạo nở tự nhiên, an toàn thực phẩm"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Làm bánh Cookies bơ, bánh Chocolate Muffin, bánh quy gừng và các dòng bánh cần độ xốp giòn"
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Trộn đều bột baking soda với bột mì (khô) trước khi rây và trộn vào hỗn hợp lỏng để bánh nở đều"
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Bảo quản nơi khô ráo, thoáng mát, đậy kín nắp hộp sau khi sử dụng để tránh bị hút ẩm"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-muffin-socola",
                  "title": "Bánh Chocolate Muffin",
                  "time": "45 phút",
                  "diff": "Dễ",
                  "usage": "Baking Soda",
                  "img": "images/recipes/banh-chocolate-muffin.jpg"
              },
              {
                  "recipeGroupId": "recipe-pancake",
                  "title": "Bánh Pancake mật ong",
                  "time": "25 phút",
                  "diff": "Dễ",
                  "usage": "Baking Soda",
                  "img": "images/recipes/banh-pancake-mat-ong.jpg"
              }
          ],
          "relatedIds": []
      },
      "27": {
          "shortName": "Men nở",
          "brand": "Mauripan",
          "origin": "Anh",
          "rating": "4.9",
          "reviews": "195",
          "sold": "3.8k",
          "unit": "gói",
          "stock": "250",
          "images": [
              "images/products/men-no-1.webp",
              "images/products/men-no-2.jpg"
          ],
          "specs": [
              {
                  "k": "Mã sản phẩm",
                  "v": "#BM-013"
              },
              {
                  "k": "Thương hiệu",
                  "v": "Mauripan (Instant Dry Yeast, men chịu ngọt cao)"
              },
              {
                  "k": "Thành phần & Đặc tính",
                  "v": "Men tự nhiên Saccharomyces cerevisiae, độ nở mạnh, không cần kích hoạt trước"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Làm bánh mì hoa cúc, bánh mì ngọt, bánh bao, brioche và các loại bánh mì lên men"
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Trộn trực tiếp men khô vào bột mì (tránh để men tiếp xúc trực tiếp với muối hoặc đá lạnh trước khi trộn đều)"
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Bảo quản nơi khô ráo, thoáng mát. Sau khi cắt gói nên dùng hết hoặc kẹp kín miệng, bảo quản ngăn mát tủ lạnh"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-hoa-cuc",
                  "title": "Bánh mì hoa cúc",
                  "time": "120 phút",
                  "diff": "Khó",
                  "usage": "Men nở",
                  "img": "images/recipes/banh-mi-hoa-cuc.jpg"
              }
          ],
          "relatedIds": []
      },
      "28": {
          "shortName": "Máy Đánh Trứng Cầm Tay Philips HR3705",
          "brand": "Philips",
          "origin": "Hà Lan",
          "rating": "4.9",
          "reviews": "142",
          "sold": "890",
          "unit": "bộ",
          "stock": "35",
          "images": [
              "images/products/may-danh-trung-cam-tay-philips-hr3705-1.jpg",
              "images/products/may-danh-trung-cam-tay-philips-hr3705-2.webp",
              "images/products/may-danh-trung-cam-tay-philips-hr3705-3.jpg"
          ],
          "specs": [
              {
                  "k": "Mã sản phẩm",
                  "v": "#BM-014"
              },
              {
                  "k": "Thương hiệu",
                  "v": "Philips (HR3705 Daily Collection)"
              },
              {
                  "k": "Thông số kỹ thuật",
                  "v": "Công suất 300W, 5 tốc độ + Chế độ Turbo tăng cường, chất liệu nhựa cao cấp và thép không gỉ"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Đánh bông Whipping cream, đánh trứng làm bánh bông lan, trộn bột làm bánh mì, cupcake, muffin"
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Lắp chặt que đánh/nhào trước khi cắm điện. Không hoạt động liên tục quá 5 phút mỗi lần để bảo vệ động cơ"
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Vệ sinh que đánh bằng nước ấm và xà phòng sau khi dùng. Lau sạch thân máy bằng khăn mềm, cất nơi khô ráo"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-bong-lan",
                  "title": "Bánh bông lan cơ bản",
                  "time": "60 phút",
                  "diff": "Trung bình",
                  "usage": "Máy Đánh Trứng Cầm Tay Philips HR3705",
                  "img": "images/recipes/banh-bong-lan-co-ban.jpg"
              },
              {
                  "recipeGroupId": "recipe-mousse-socola",
                  "title": "Bánh Mousse Chocolate",
                  "time": "75 phút",
                  "diff": "Trung bình",
                  "usage": "Máy Đánh Trứng Cầm Tay Philips HR3705",
                  "img": "images/recipes/banh-mousse-chocolate.jpg"
              }
          ],
          "relatedIds": []
      },
      "29": {
          "shortName": "Tô Trộn Inox",
          "brand": "Sanneng",
          "origin": "Trung Quốc",
          "rating": "4.9",
          "reviews": "178",
          "sold": "1.4k",
          "unit": "cái",
          "stock": "60",
          "images": [
              "images/products/to-tron-inox-1.jpg",
              "images/products/to-tron-inox-2.webp",
              "images/products/to-tron-inox-3.jpg"
          ],
          "specs": [
              {
                  "k": "Mã sản phẩm",
                  "v": "#BM-015"
              },
              {
                  "k": "Thương hiệu",
                  "v": "Sanneng (Inox 304 thực phẩm cao cấp)"
              },
              {
                  "k": "Chất liệu & Kích thước",
                  "v": "Inox không gỉ dày dặn, có các size tùy chọn từ 18cm đến 26cm (hoặc mua trọn bộ 5 cái)"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Dùng để đánh trứng, trộn bột làm bánh bông lan, nhào bột bánh mì, đựng nguyên liệu làm bánh"
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Rửa sạch trước và sau khi sử dụng. Có thể dùng an toàn trong máy rửa bát"
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Bảo quản nơi khô ráo, thoáng mát sau khi lau khô nước"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-bong-lan",
                  "title": "Bánh bông lan cơ bản",
                  "time": "60 phút",
                  "diff": "Trung bình",
                  "usage": "Tô Trộn Inox",
                  "img": "images/recipes/banh-bong-lan-co-ban.jpg"
              },
              {
                  "recipeGroupId": "recipe-hoa-cuc",
                  "title": "Bánh mì hoa cúc",
                  "time": "120 phút",
                  "diff": "Khó",
                  "usage": "Tô Trộn Inox",
                  "img": "images/recipes/banh-mi-hoa-cuc.jpg"
              },
              {
                  "recipeGroupId": "recipe-brownie",
                  "title": "Bánh Brownie",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Tô Trộn Inox",
                  "img": "images/recipes/banh-brownie.jpg"
              }
          ],
          "relatedIds": []
      },
      "30": {
          "shortName": "Rây Bột",
          "brand": "Sanneng",
          "origin": "Đài Loan",
          "rating": "4.9",
          "reviews": "162",
          "sold": "2.1k",
          "unit": "cái",
          "stock": "95",
          "images": [
              "images/products/ray-bot-1.jpg",
              "images/products/ray-bot-2.jpg",
              "images/products/ray-bot-3.jpg",
              "images/products/ray-bot-4.jpg"
          ],
          "specs": [
              {
                  "k": "Mã sản phẩm",
                  "v": "#BM-016"
              },
              {
                  "k": "Thương hiệu",
                  "v": "Sanneng (Inox 304 thực phẩm cao cấp)"
              },
              {
                  "k": "Chất liệu & Kích thước",
                  "v": "Inox không gỉ dày dặn, mắt lưới mịn đan khít, tay cầm dài kèm móc treo tiện dụng"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Rây bột mì, bột cacao, bột matcha trước khi trộn; lọc hỗn hợp trứng sữa làm bánh flan, mousse"
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Gác tai móc của rây lên thành tô trộn, đổ bột vào và gõ nhẹ vào thành rây để bột rơi đều"
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Rửa sạch ngay sau khi dùng để tránh bột khô bám kẹt vào mắt lưới, lau khô trước khi cất"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-bong-lan",
                  "title": "Bánh bông lan cơ bản",
                  "time": "60 phút",
                  "diff": "Trung bình",
                  "usage": "Rây Bột",
                  "img": "images/recipes/banh-bong-lan-co-ban.jpg"
              },
              {
                  "recipeGroupId": "recipe-muffin-socola",
                  "title": "Bánh Chocolate Muffin",
                  "time": "45 phút",
                  "diff": "Dễ",
                  "usage": "Rây Bột",
                  "img": "images/recipes/banh-chocolate-muffin.jpg"
              },
              {
                  "recipeGroupId": "recipe-pancake",
                  "title": "Bánh Pancake mật ong",
                  "time": "25 phút",
                  "diff": "Dễ",
                  "usage": "Rây Bột",
                  "img": "images/recipes/banh-pancake-mat-ong.jpg"
              }
          ],
          "relatedIds": []
      },
      "31": {
          "shortName": "Khuôn Nướng Cupcake & Muffin",
          "brand": "Sanneng",
          "origin": "Trung Quốc",
          "rating": "4.9",
          "reviews": "158",
          "sold": "1.6k",
          "unit": "cái",
          "stock": "75",
          "images": [
              "images/products/khuon-nuong-cupcake-muffin-6-lo-chong-dinh-1.jpg",
              "images/products/khuon-nuong-cupcake-muffin-6-lo-chong-dinh-2.jpg",
              "images/products/khuon-nuong-cupcake-muffin-6-lo-chong-dinh-3.jpg",
              "images/products/khuon-nuong-cupcake-muffin-6-lo-chong-dinh-4.jpg"
          ],
          "specs": [
              {
                  "k": "Mã sản phẩm",
                  "v": "#BM-017"
              },
              {
                  "k": "Thương hiệu",
                  "v": "Sanneng (Thép carbon phủ chống dính)"
              },
              {
                  "k": "Chất liệu & Kích thước",
                  "v": "Thép carbon dày dặn, dẫn nhiệt đều, khay gồm 6 lỗ tròn tiêu chuẩn nướng bánh cupcake/muffin"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Nướng bánh Cupcake Matcha, bánh Chocolate Muffin, bánh tart nhỏ và các loại bánh nướng khuôn nhỏ"
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Nên lót thêm giấy lót cup giấy vào khuôn trước khi đổ bột để bánh đẹp hơn và dễ lấy ra"
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Rửa bằng mút mềm và nước ấm, không dùng búi sắt cọ rửa để bảo vệ lớp chống dính, lau khô trước khi cất"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Khuôn Nướng Cupcake & Muffin",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              },
              {
                  "recipeGroupId": "recipe-muffin-socola",
                  "title": "Bánh Chocolate Muffin",
                  "time": "45 phút",
                  "diff": "Dễ",
                  "usage": "Khuôn Nướng Cupcake & Muffin",
                  "img": "images/recipes/banh-chocolate-muffin.jpg"
              }
          ],
          "relatedIds": []
      },
      "32": {
          "shortName": "Khuôn Silicon",
          "brand": "Silikomart",
          "origin": "Ý",
          "rating": "4.8",
          "reviews": "134",
          "sold": "1.1k",
          "unit": "cái",
          "stock": "80",
          "images": [
              "images/products/khuon-silicon-1.jpg",
              "images/products/khuon-silicon-2.jpg",
              "images/products/khuon-silicon-3.jpg",
              "images/products/khuon-silicon-4.jpg"
          ],
          "specs": [
              {
                  "k": "Mã sản phẩm",
                  "v": "#BM-018"
              },
              {
                  "k": "Thương hiệu",
                  "v": "Silikomart (Silicon thực phẩm nguyên sinh an toàn)"
              },
              {
                  "k": "Chất liệu & Kích thước",
                  "v": "Silicon dẻo cao cấp chịu nhiệt tốt từ -40°C đến 230°C, bề mặt chống dính tối ưu"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Làm kẹo dẻo, đổ khuôn socola nghệ thuật, thạch trái cây mini và các món tráng miệng"
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Đặt khuôn lên một khay phẳng trước khi đổ nguyên liệu để dễ di chuyển vào tủ lạnh hoặc lò nướng"
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Rửa sạch bằng nước ấm, lau khô hoặc để ráo. Tránh tiếp xúc trực tiếp với ngọn lửa hoặc vật sắc nhọn"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-bong-lan",
                  "title": "Bánh bông lan cơ bản",
                  "time": "60 phút",
                  "diff": "Trung bình",
                  "usage": "Khuôn Silicon",
                  "img": "images/recipes/banh-bong-lan-co-ban.jpg"
              }
          ],
          "relatedIds": []
      },
      "33": {
          "shortName": "Bàn Xoay Bánh Kem",
          "brand": "Sanneng",
          "origin": "Đài Loan",
          "rating": "4.9",
          "reviews": "185",
          "sold": "1.5k",
          "unit": "cái",
          "stock": "65",
          "images": [
              "images/products/ban-xoay-banh-1.jpg",
              "images/products/ban-xoay-banh-2.jpg",
              "images/products/ban-xoay-banh-3.jpg"
          ],
          "specs": [
              {
                  "k": "Mã sản phẩm",
                  "v": "#BM-019"
              },
              {
                  "k": "Thương hiệu",
                  "v": "Sanneng (Nhựa ABS nguyên sinh an toàn thực phẩm)"
              },
              {
                  "k": "Chất liệu & Kích thước",
                  "v": "Nhựa ABS cứng cáp, đường kính mặt bàn xoay 27.5cm (hoặc 35cm), chiều cao 6.5cm"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Dùng để chà láng cốt bánh gato, bóp kem trang trí bánh sinh nhật, bánh kem mousse và trưng bày bánh"
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Đặt cốt bánh lên tâm bàn xoay, kết hợp cùng dao chà láng để xoay mượt mà khi phủ kem"
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Dùng khăn ẩm lau sạch hoặc rửa nhẹ nhàng sau khi dùng, tránh để nước ngâm trực tiếp vào ổ bi trục xoay"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-bong-lan",
                  "title": "Bánh bông lan cơ bản",
                  "time": "60 phút",
                  "diff": "Trung bình",
                  "usage": "Bàn Xoay Bánh Kem",
                  "img": "images/recipes/banh-bong-lan-co-ban.jpg"
              }
          ],
          "relatedIds": []
      },
      "34": {
          "shortName": "Hộp Đựng Cupcake",
          "brand": "Sanneng",
          "origin": "Đài Loan",
          "rating": "4.9",
          "reviews": "142",
          "sold": "1.2k",
          "unit": "cái",
          "stock": "150",
          "images": [
              "images/products/hop-cupcake-1.jpg",
              "images/products/hop-cupcake-2.jpg",
              "images/products/hop-cupcake-3.jpg",
              "images/products/hop-cupcake-4.jpg",
              "images/products/hop-cupcake-5.jpg"
          ],
          "specs": [
              {
                  "k": "Mã sản phẩm",
                  "v": "#BM-020"
              },
              {
                  "k": "Thương hiệu",
                  "v": "Sanneng (Giấy Kraft/Ivory thực phẩm cao cấp)"
              },
              {
                  "k": "Chất liệu & Kích thước",
                  "v": "Giấy thực phẩm cứng cáp, thiết kế cửa sổ kính trong suốt, khay đựng cố định bánh"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Đóng gói và bảo quản bánh Cupcake, bánh Muffin, bánh tart để làm quà tặng hoặc bán hàng"
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Dựng khung hộp, lót khay định hình bên trong và đặt các viên bánh cupcake đã trang trí vào ngay ngắn"
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Bảo quản nơi khô ráo, thoáng mát, tránh nơi ẩm ướt để giữ độ cứng cho hộp giấy"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Hộp Đựng Cupcake",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              }
          ],
          "relatedIds": []
      },
      "35": {
          "shortName": "Túi Giấy Kraft Đựng Bánh",
          "brand": "Sanneng",
          "origin": "Đài Loan",
          "rating": "4.9",
          "reviews": "210",
          "sold": "2.5k",
          "unit": "cái",
          "stock": "300",
          "images": [
              "images/products/tui-giay-kraft-dung-banh-1.jpg",
              "images/products/tui-giay-kraft-dung-banh-2.jpg",
              "images/products/tui-giay-kraft-dung-banh-3.jpg"
          ],
          "specs": [
              {
                  "k": "Mã sản phẩm",
                  "v": "#BM-021"
              },
              {
                  "k": "Thương hiệu",
                  "v": "Sanneng (Giấy Kraft nguyên sinh định lượng cao)"
              },
              {
                  "k": "Chất liệu & Kích thước",
                  "v": "Giấy kraft nâu dày dặn, đáy vuông chịu lực tốt, quai xách xoắn chắc chắn"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Đựng hộp bánh gato, hộp đựng cupcake, hộp bánh cookies làm quà tặng trong các dịp lễ, sinh nhật"
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Mở phẳng đáy túi, đặt hộp bánh ngay ngắn vào bên trong để giữ cố định form dáng"
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Bảo quản nơi khô ráo, thoáng mát, tránh tiếp xúc trực tiếp với nước và độ ẩm cao"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Túi Giấy Kraft Đựng Bánh",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              }
          ],
          "relatedIds": []
      },
      "36": {
          "shortName": "Túi Zip Đựng Bánh",
          "brand": "Sanneng",
          "origin": "Đài Loan",
          "rating": "4.9",
          "reviews": "165",
          "sold": "2.8k",
          "unit": "cái",
          "stock": "450",
          "images": [
              "images/products/tui-zip-1.jpg",
              "images/products/tui-zip-2.jpg",
              "images/products/tui-zip-3.jpg"
          ],
          "specs": [
              {
                  "k": "Mã sản phẩm",
                  "v": "#BM-022"
              },
              {
                  "k": "Thương hiệu",
                  "v": "Sanneng (Nhựa PE thực phẩm cao cấp trong suốt)"
              },
              {
                  "k": "Chất liệu & Kích thước",
                  "v": "Nhựa PE nguyên sinh dày dặn, đường viền khóa zip chắc chắn, chống thấm khí và ẩm tốt"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Đựng bánh cookies, bánh quy bơ, kẹo dẻo, các loại hạt dinh dưỡng và nguyên liệu làm bánh khô"
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Cho bánh đã nguội hẳn vào túi, miết chặt đường khóa zip từ đầu này sang đầu kia để đóng kín"
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và nhiệt độ cao"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-banh-quy-bo",
                  "title": "Cookies bơ",
                  "time": "40 phút",
                  "diff": "Dễ",
                  "usage": "Túi Zip Đựng Bánh",
                  "img": "images/recipes/cookies-bo.jpg"
              }
          ],
          "relatedIds": []
      },
      "37": {
          "shortName": "Đế Bánh Kem",
          "brand": "Sanneng",
          "origin": "Đài Loan",
          "rating": "4.9",
          "reviews": "175",
          "sold": "3.4k",
          "unit": "cái",
          "stock": "500",
          "images": [
              "images/products/de-banh-kem-1.jpg",
              "images/products/de-banh-kem-2.jpg",
              "images/products/de-banh-kem-3.jpg"
          ],
          "specs": [
              {
                  "k": "Mã sản phẩm",
                  "v": "#BM-023"
              },
              {
                  "k": "Thương hiệu",
                  "v": "Sanneng (Giấy bìa ép cứng cao cấp chống thấm)"
              },
              {
                  "k": "Chất liệu & Kích thước",
                  "v": "Bìa cứng ép nhiều lớp dày dặn, có hai phân loại dáng tròn và dáng vuông tiện dụng"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Dùng làm đế kê lót dưới cốt bánh kem, bánh gato, bánh sinh nhật để trang trí và vận chuyển"
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Đặt đế bánh lên bàn xoay trước khi chà láng cốt bánh để tiện lợi nhấc bánh ra sau khi hoàn thiện"
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Bảo quản nơi khô ráo, thoáng mát, tránh tiếp xúc trực tiếp với nước hoặc môi trường ẩm ướt"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-bong-lan",
                  "title": "Bánh bông lan cơ bản",
                  "time": "60 phút",
                  "diff": "Trung bình",
                  "usage": "Đế Bánh Kem",
                  "img": "images/recipes/banh-bong-lan-co-ban.jpg"
              }
          ],
          "relatedIds": []
      },
      "38": {
          "shortName": "Khay Giấy Đựng Bánh Kèm Nắp Trong",
          "brand": "Sanneng",
          "origin": "Đài Loan",
          "rating": "4.9",
          "reviews": "156",
          "sold": "2.3k",
          "unit": "cái",
          "stock": "220",
          "images": [
              "images/products/khay-giay-dung-banh-kem-nap-trong-1.jpg",
              "images/products/khay-giay-dung-banh-kem-nap-trong-2.jpg",
              "images/products/khay-giay-dung-banh-kem-nap-trong-3.jpg"
          ],
          "specs": [
              {
                  "k": "Mã sản phẩm",
                  "v": "#BM-024"
              },
              {
                  "k": "Thương hiệu",
                  "v": "Sanneng (Giấy Kraft nguyên sinh & Nhựa PET nguyên sinh)"
              },
              {
                  "k": "Chất liệu & Kích thước",
                  "v": "Đế khay giấy kraft chống thấm dầu kèm nắp vòm trong suốt PET, có 3 size S, M, L đa dạng lựa chọn"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Đựng bánh Tiramisu, bánh cuộn Swiss Roll, bánh su kem, các loại bánh ngọt mang đi (takeaway)"
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Đặt bánh ngay ngắn vào khay giấy, đậy nắp nhựa PET khớp chặt các gờ để cố định chắc chắn"
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và nhiệt độ quá cao"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-brownie",
                  "title": "Bánh Brownie",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Khay Giấy Đựng Bánh Kèm Nắp Trong",
                  "img": "images/recipes/banh-brownie.jpg"
              }
          ],
          "relatedIds": []
      },
      "39": {
          "shortName": "Khay Nhôm Nướng Bánh",
          "brand": "Sanneng",
          "origin": "Đài Loan",
          "rating": "4.9",
          "reviews": "192",
          "sold": "2.6k",
          "unit": "cái",
          "stock": "110",
          "images": [
              "images/products/khay-nhom-nuong-banh-1.jpg",
              "images/products/khay-nhom-nuong-banh-2.jpg",
              "images/products/khay-nhom-nuong-banh-3.jpg",
              "images/products/khay-nhom-nuong-banh-4.jpg"
          ],
          "specs": [
              {
                  "k": "Mã sản phẩm",
                  "v": "#BM-025"
              },
              {
                  "k": "Thương hiệu",
                  "v": "Sanneng (Hợp kim nhôm đúc thực phẩm cao cấp)"
              },
              {
                  "k": "Chất liệu & Kích thước",
                  "v": "Nhôm nguyên chất dày dặn, tản nhiệt đều, có 2 phân loại chính gồm dòng thành thấp và dòng thành cao"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Nướng bánh quy, bánh cuộn (thành thấp) hoặc nướng bánh bông lan Đài Loan, bánh gato, bánh mì (thành cao)"
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Nên lót một lớp giấy nến chống dính vào lòng khay trước khi đổ bột để lấy bánh ra dễ dàng và vệ sinh nhanh chóng"
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Rửa sạch bằng mút mềm sau khi dùng, lau khô hoàn toàn và cất ở nơi khô ráo"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-banh-quy-bo",
                  "title": "Cookies bơ",
                  "time": "40 phút",
                  "diff": "Dễ",
                  "usage": "Khay Nhôm Nướng Bánh",
                  "img": "images/recipes/cookies-bo.jpg"
              },
              {
                  "recipeGroupId": "recipe-hoa-cuc",
                  "title": "Bánh mì hoa cúc",
                  "time": "120 phút",
                  "diff": "Khó",
                  "usage": "Khay Nhôm Nướng Bánh",
                  "img": "images/recipes/banh-mi-hoa-cuc.jpg"
              }
          ],
          "relatedIds": []
      },
      "40": {
          "shortName": "Đế Lót Bánh Mousse",
          "brand": "Sanneng",
          "origin": "Đài Loan",
          "rating": "4.9",
          "reviews": "188",
          "sold": "3.1k",
          "unit": "cái",
          "stock": "600",
          "images": [
              "images/products/de-lot-banh-mousse-1.jpg"
          ],
          "specs": [
              {
                  "k": "Mã sản phẩm",
                  "v": "#BM-026"
              },
              {
                  "k": "Thương hiệu",
                  "v": "Sanneng (Giấy bìa ép cứng phủ lớp chống thấm thực phẩm)"
              },
              {
                  "k": "Chất liệu & Kích thước",
                  "v": "Giấy ép cứng cáp, chống thấm nước và dầu tốt, gồm các phân loại tròn 5cm, tròn 8cm, vuông 10cm và bạc 12cm"
              },
              {
                  "k": "Ứng dụng phù hợp",
                  "v": "Dùng làm đế kê lót các loại bánh mousse, bánh flan gâteaux, bánh ngọt mini phục vụ tiệc hoặc bán take-away"
              },
              {
                  "k": "Hướng dẫn sử dụng",
                  "v": "Đặt trực tiếp bánh mousse hoặc bánh ngọt nhỏ lên bề mặt đế trước khi trưng bày hoặc đóng gói vào hộp"
              },
              {
                  "k": "Quy cách bảo quản",
                  "v": "Bảo quản nơi khô ráo, thoáng mát, tránh tiếp xúc trực tiếp với nước hoặc nơi ẩm ướt"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-mousse-socola",
                  "title": "Bánh Mousse Chocolate",
                  "time": "75 phút",
                  "diff": "Trung bình",
                  "usage": "Đế Lót Bánh Mousse",
                  "img": "images/recipes/banh-mousse-chocolate.jpg"
              }
          ],
          "relatedIds": []
      },
      "41": {
          "shortName": "Nến Sinh Nhật",
          "brand": "Sanneng",
          "origin": "Đài Loan",
          "rating": "4.8",
          "reviews": "83",
          "sold": "2.1k",
          "unit": "bộ",
          "stock": "400",
          "images": [
              "images/products/nen-sinh-nhat-1.jpg",
              "images/products/nen-sinh-nhat-2.jpg",
              "images/products/nen-sinh-nhat-3.jpg",
              "images/products/nen-sinh-nhat-4.jpg",
              "images/products/nen-sinh-nhat-5.jpg",
              "images/products/nen-sinh-nhat-6.jpg",
              "images/products/nen-sinh-nhat-7.jpg"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "Sanneng"
              },
              {
                  "k": "Xuất xứ",
                  "v": "Đài Loan"
              },
              {
                  "k": "Mẫu mã",
                  "v": "Số 0-9 / Xoắn / Dài / Ngôi sao / Kim tuyến"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Nến Sinh Nhật",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              }
          ],
          "relatedIds": []
      },
      "42": {
          "shortName": "Topper Trang Trí Bánh Sinh Nhật",
          "brand": "Sanneng",
          "origin": "Đài Loan",
          "rating": "4.9",
          "reviews": "91",
          "sold": "1.7k",
          "unit": "cái",
          "stock": "350",
          "images": [
              "images/products/topper-trang-tri-banh-sinh-nhat-1.jpg",
              "images/products/topper-trang-tri-banh-sinh-nhat-2.jpg",
              "images/products/topper-trang-tri-banh-sinh-nhat-3.jpg",
              "images/products/topper-trang-tri-banh-sinh-nhat-4.jpg",
              "images/products/topper-trang-tri-banh-sinh-nhat-5.jpg",
              "images/products/topper-trang-tri-banh-sinh-nhat-6.jpg"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "Sanneng"
              },
              {
                  "k": "Xuất xứ",
                  "v": "Đài Loan"
              },
              {
                  "k": "Phân loại",
                  "v": "Happy Birthday / Acrylic / Trái tim / Công chúa / Hoạt hình"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Topper Trang Trí Bánh Sinh Nhật",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              }
          ],
          "relatedIds": []
      },
      "43": {
          "shortName": "Sticker Niêm Phong",
          "brand": "Sanneng",
          "origin": "Đài Loan",
          "rating": "4.9",
          "reviews": "119",
          "sold": "3.1k",
          "unit": "cuộn",
          "stock": "800",
          "images": [
              "images/products/sticker-niem-phong-1.png",
              "images/products/sticker-niem-phong-2.jpg"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "Sanneng"
              },
              {
                  "k": "Xuất xứ",
                  "v": "Đài Loan"
              },
              {
                  "k": "Quy cách",
                  "v": "Cuộn tiêu chuẩn sẵn keo dán"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Sticker Niêm Phong",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              }
          ],
          "relatedIds": []
      },
      "44": {
          "shortName": "Ruy Băng",
          "brand": "Sanneng",
          "origin": "Đài Loan",
          "rating": "4.8",
          "reviews": "77",
          "sold": "2.0k",
          "unit": "cuộn",
          "stock": "500",
          "images": [
              "images/products/ruy-bang-1.jpg",
              "images/products/ruy-bang-2.jpg",
              "images/products/ruy-bang-3.jpg",
              "images/products/ruy-bang-4.jpg"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "Sanneng"
              },
              {
                  "k": "Xuất xứ",
                  "v": "Đài Loan"
              },
              {
                  "k": "Chất liệu",
                  "v": "Vải lụa Satin mềm mượt bền màu"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Ruy Băng",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              }
          ],
          "relatedIds": []
      },
      "45": {
          "shortName": "Hũ Nhựa Đựng Thực Phẩm",
          "brand": "Sanneng",
          "origin": "Đài Loan",
          "rating": "4.8",
          "reviews": "68",
          "sold": "1.6k",
          "unit": "hũ",
          "stock": "320",
          "images": [
              "images/products/hu-nhua-dung-thuc-pham-1.jpg",
              "images/products/hu-nhua-dung-thuc-pham-2.jpg",
              "images/products/hu-nhua-dung-thuc-pham-3.jpg"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "Sanneng"
              },
              {
                  "k": "Xuất xứ",
                  "v": "Đài Loan"
              },
              {
                  "k": "Kích cỡ",
                  "v": "Size S / Size M / Size L"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Hũ Nhựa Đựng Thực Phẩm",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              }
          ],
          "relatedIds": []
      },
      "46": {
          "shortName": "Lọ Thủy Tinh Đựng Thực Phẩm",
          "brand": "Sanneng",
          "origin": "Đài Loan",
          "rating": "4.9",
          "reviews": "72",
          "sold": "1.2k",
          "unit": "lọ",
          "stock": "280",
          "images": [
              "images/products/lo-thuy-tinh-dung-thuc-pham-1.jpg",
              "images/products/lo-thuy-tinh-dung-thuc-pham-2.jpg",
              "images/products/lo-thuy-tinh-dung-thuc-pham-3.jpg"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "Sanneng"
              },
              {
                  "k": "Xuất xứ",
                  "v": "Đài Loan"
              },
              {
                  "k": "Kích cỡ",
                  "v": "Size S / Size M / Size L"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Lọ Thủy Tinh Đựng Thực Phẩm",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              }
          ],
          "relatedIds": []
      },
      "47": {
          "shortName": "Kẹp Miệng Túi Thực Phẩm",
          "brand": "Sanneng",
          "origin": "Đài Loan",
          "rating": "4.8",
          "reviews": "61",
          "sold": "1.8k",
          "unit": "cái",
          "stock": "450",
          "images": [
              "images/products/kep-mieng-tui-thuc-pham-1.jpg",
              "images/products/kep-mieng-tui-thuc-pham-2.jpg",
              "images/products/kep-mieng-tui-thuc-pham-3.jpg"
          ],
          "specs": [
              {
                  "k": "Thương hiệu",
                  "v": "Sanneng"
              },
              {
                  "k": "Xuất xứ",
                  "v": "Đài Loan"
              },
              {
                  "k": "Chiều dài",
                  "v": "11cm tiêu chuẩn"
              }
          ],
          "recipes": [
              {
                  "recipeGroupId": "recipe-matcha-cupcake",
                  "title": "Bánh cupcake Matcha",
                  "time": "50 phút",
                  "diff": "Dễ",
                  "usage": "Kẹp Miệng Túi Thực Phẩm",
                  "img": "images/recipes/banh-cupcake-matcha.jpg"
              }
          ],
          "relatedIds": []
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
      sold: (product.stockStatus === "coming_soon" || product.stockStatus === "out_of_stock") ? "Hết hàng" : "Mới lên kệ",
      unit: product.packagingLabel || "sản phẩm",
      stock: (product.stockStatus === "coming_soon" || product.stockStatus === "out_of_stock") ? "0" : "50",
      images: [product.image || FALLBACK_IMG],
      specs: [
        { k: "Thương hiệu", v: product.brand || "BakeMate" },
        { k: "Danh mục", v: product.category },
        { k: "Quy cách đóng gói", v: product.packagingLabel || "Tiêu chuẩn" },
        { k: "Mô tả sản phẩm", v: product.description || "Sản phẩm chất lượng cao cho người làm bánh." }
      ],
      recipes: [
        { recipeGroupId: "recipe-bong-lan", title: "Bánh bông lan cơ bản", time: "60 phút", usage: product.name, diff: "Trung bình", img: "images/recipes/banh-bong-lan-co-ban.jpg" }
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
  const isComingSoon = product.stockStatus === "coming_soon" || product.stockStatus === "out_of_stock";
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
    const baseCount = Number(meta.reviews || 0);
    const totalCount = baseCount + userReviews.length;
    let displayRating = Number(meta.rating || 5);
    if (userReviews.length > 0 && totalCount > 0) {
      const userSum = userReviews.reduce((acc, item) => acc + (Number(item.rating) || 5), 0);
      displayRating = Math.round((((displayRating * baseCount) + userSum) / totalCount) * 10) / 10;
    }
    if (productRating) {
      productRating.innerHTML = `★★★★★ <strong>${escapeHtml(displayRating.toFixed(1))}</strong> (${escapeHtml(totalCount)} đánh giá)`;
    }
  }
  updateRatingSummaryDisplay();

  if (productSold) {
    productSold.innerHTML = isComingSoon
      ? `Trạng thái: <strong>Hết hàng</strong>`
      : `Đã bán <strong>${escapeHtml(meta.sold)}</strong>`;
  }

  if (productCodeMeta) {
    productCodeMeta.innerHTML = `Mã: <strong>${escapeHtml(codeText)}</strong>`;
  }

  if (productCategoryMeta) {
    productCategoryMeta.innerHTML = `Danh mục: <strong>${escapeHtml(product.category)}</strong>`;
  }

  if (productStockPill) {
    if (isComingSoon) {
      productStockPill.textContent = "Hết hàng";
      productStockPill.classList.remove("in-stock");
      productStockPill.style.backgroundColor = "#4a2e19";
      productStockPill.style.color = "#f2d9a6";
    } else {
      productStockPill.textContent = "Còn hàng";
    }
  }

  if (stockHint) {
    stockHint.textContent = isComingSoon
      ? "Sản phẩm hiện tạm hết hàng — lưu Yêu thích để nhận thông báo khi về hàng"
      : `Kho còn ${meta.stock} ${meta.unit}`;
  }

  if (isComingSoon) {
    if (btnAddToCart) {
      btnAddToCart.disabled = true;
      btnAddToCart.style.opacity = "0.6";
      btnAddToCart.style.cursor = "not-allowed";
      const lbl = btnAddToCart.querySelector(".js-add-cart-label");
      if (lbl) lbl.textContent = "Hết hàng";
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
          <span class="pill-radio__btn">${escapeHtml(opt.shortLabel || String(opt.label || "").split(" - ")[0])}</span>
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
  function renderStarVisualHtml(ratingVal, sizePx) {
    const val = Math.round(Math.max(0.5, Math.min(5, Number(ratingVal) || 5)) * 2) / 2;
    const pct = (val / 5) * 100;
    const fs = Number(sizePx) || 16;
    return `
      <span class="bm-star-picker" style="font-size:${fs}px;pointer-events:none;vertical-align:middle;" aria-label="${val.toFixed(1)} sao">
        <span class="bm-star-picker__bg">★★★★★</span>
        <span class="bm-star-picker__fill" style="width:${pct}%;">★★★★★</span>
      </span>
    `;
  }

  function renderProductReviews() {
    if (!reviewsContainer) return;
    const list =
      typeof window.getReviews === "function" ? window.getReviews("product", product.id) : [];
    const currentUser =
      typeof window.BakeAuth === "object" && typeof window.BakeAuth.getCurrentUser === "function"
        ? window.BakeAuth.getCurrentUser()
        : null;

    let selectedRating = 5.0;

    let reviewsHtml = "";
    if (list.length > 0) {
      reviewsHtml = `
        <div class="reviews-list">
          ${list
            .map((rev) => {
              const revVal = Math.round(Math.max(0.5, Math.min(5, Number(rev.rating) || 5)) * 2) / 2;
              const dateLabel = rev.createdAt
                ? new Date(rev.createdAt).toLocaleDateString("vi-VN")
                : "";
              const isOwner = currentUser && String(rev.userId) === String(currentUser.userId);
              return `
                <article class="review-item" data-review-id="${escapeHtml(rev.id)}">
                  <div class="review-item__head">
                    <strong>${escapeHtml(rev.userName)}</strong>
                    <span class="review-item__stars" aria-label="${revVal.toFixed(1)} sao">
                      ${renderStarVisualHtml(revVal, 15)}
                      <strong style="margin-left:4px;font-size:12px;color:#b45309;">${revVal.toFixed(1)}</strong>
                      · <small style="color: var(--accent-sub); font-weight: 500;">${escapeHtml(dateLabel)}</small>
                    </span>
                  </div>
                  <p class="js-review-comment-text" style="font-size: 14px; color: #5c402d; line-height: 1.55;">${escapeHtml(rev.comment)}</p>
                  ${
                    rev.imageDataUrl
                      ? `<div style="margin-top:8px;"><img src="${escapeHtml(rev.imageDataUrl)}" alt="Ảnh thành phẩm từ ${escapeHtml(rev.userName)}" class="review-photo-preview-img"></div>`
                      : ""
                  }
                  ${
                    isOwner
                      ? `
                        <div class="review-item__actions" style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
                          <button type="button" class="btn btn--outline-dark js-edit-review-btn" data-review-id="${escapeHtml(rev.id)}" style="padding:4px 10px;font-size:12px;">Sửa</button>
                          <button type="button" class="btn btn--outline-dark js-delete-review-btn" data-review-id="${escapeHtml(rev.id)}" style="padding:4px 10px;font-size:12px;color:#8b1e24;border-color:#e5b3b6;">Xóa</button>
                        </div>
                        <form class="js-inline-edit-form" data-review-id="${escapeHtml(rev.id)}" hidden style="margin-top:10px;padding:12px;background:#fcf8f3;border:1px solid #eadcc9;border-radius:10px;">
                          <div class="bm-star-picker-wrap" style="margin-bottom:8px;">
                            <label style="font-size:12px;font-weight:700;color:#4a2e19;">Số sao:</label>
                            <input type="range" class="bm-star-range js-edit-star-range" min="0.5" max="5" step="0.5" value="${revVal.toFixed(1)}">
                            <span class="js-edit-star-val" style="font-size:13px;font-weight:700;color:#b45309;">${revVal.toFixed(1)} ★</span>
                          </div>
                          <textarea class="form-textarea js-edit-comment-input" rows="2" required style="margin-bottom:8px;">${escapeHtml(rev.comment)}</textarea>
                          <div style="display:flex;gap:8px;">
                            <button type="submit" class="btn btn--primary" style="padding:5px 12px;font-size:12px;">Lưu thay đổi</button>
                            <button type="button" class="btn btn--outline-dark js-cancel-edit-review" style="padding:5px 12px;font-size:12px;">Hủy</button>
                          </div>
                        </form>
                      `
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
        <div class="bm-star-picker-wrap" style="margin-bottom: 12px;">
          <div id="bm-review-star-picker" class="bm-star-picker" role="slider" tabindex="0" aria-label="Chọn số sao từ 0.5 đến 5.0" aria-valuemin="0.5" aria-valuemax="5" aria-valuenow="5.0">
            <div class="bm-star-picker__bg">★★★★★</div>
            <div id="bm-review-star-fill" class="bm-star-picker__fill" style="width: 100%;">★★★★★</div>
          </div>
          <input type="range" id="bm-review-star-range" class="bm-star-range" min="0.5" max="5" step="0.5" value="5" aria-label="Thanh chọn số sao chi tiết">
          <strong id="bm-review-star-label" style="font-size: 13px; color: #b45309;">5.0 / 5.0 ★</strong>
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label class="visually-hidden" for="review-comment-input">Nội dung đánh giá</label>
          <textarea id="review-comment-input" class="form-textarea" rows="3" placeholder="Chia sẻ cảm nhận..." required></textarea>
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

    const starPicker = document.getElementById("bm-review-star-picker");
    const starFill = document.getElementById("bm-review-star-fill");
    const starRange = document.getElementById("bm-review-star-range");
    const starLabel = document.getElementById("bm-review-star-label");

    function applyStarRating(val) {
      const clamped = Math.round(Math.max(0.5, Math.min(5, Number(val) || 5)) * 2) / 2;
      selectedRating = clamped;
      if (starFill) starFill.style.width = `${(clamped / 5) * 100}%`;
      if (starRange) starRange.value = clamped.toFixed(1);
      if (starLabel) starLabel.textContent = `${clamped.toFixed(1)} / 5.0 ★`;
      if (starPicker) starPicker.setAttribute("aria-valuenow", clamped.toFixed(1));
    }

    if (starPicker) {
      let dragging = false;
      function ratingFromPointer(ev) {
        const rect = starPicker.getBoundingClientRect();
        const ratio = rect.width > 0 ? (ev.clientX - rect.left) / rect.width : 1;
        const stepped = Math.ceil(Math.max(0.1, Math.min(1, ratio)) * 10) / 2;
        return Math.max(0.5, Math.min(5, stepped));
      }
      starPicker.addEventListener("pointerdown", function (ev) {
        dragging = true;
        applyStarRating(ratingFromPointer(ev));
      });
      starPicker.addEventListener("pointermove", function (ev) {
        if (dragging) applyStarRating(ratingFromPointer(ev));
      });
      window.addEventListener("pointerup", function () {
        dragging = false;
      });
      starPicker.addEventListener("keydown", function (ev) {
        if (ev.key === "ArrowLeft" || ev.key === "ArrowDown") {
          ev.preventDefault();
          applyStarRating(selectedRating - 0.5);
        } else if (ev.key === "ArrowRight" || ev.key === "ArrowUp") {
          ev.preventDefault();
          applyStarRating(selectedRating + 0.5);
        }
      });
    }

    if (starRange) {
      starRange.addEventListener("input", function () {
        applyStarRating(starRange.value);
      });
    }

    reviewsContainer.querySelectorAll(".js-edit-review-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const article = btn.closest(".review-item");
        const form = article ? article.querySelector(".js-inline-edit-form") : null;
        if (form) form.hidden = !form.hidden;
      });
    });

    reviewsContainer.querySelectorAll(".js-cancel-edit-review").forEach((btn) => {
      btn.addEventListener("click", function () {
        const form = btn.closest(".js-inline-edit-form");
        if (form) form.hidden = true;
      });
    });

    reviewsContainer.querySelectorAll(".js-edit-star-range").forEach((rangeEl) => {
      rangeEl.addEventListener("input", function () {
        const valEl = rangeEl.parentElement ? rangeEl.parentElement.querySelector(".js-edit-star-val") : null;
        if (valEl) valEl.textContent = `${Number(rangeEl.value).toFixed(1)} ★`;
      });
    });

    reviewsContainer.querySelectorAll(".js-inline-edit-form").forEach((form) => {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        const revId = form.getAttribute("data-review-id");
        const rangeEl = form.querySelector(".js-edit-star-range");
        const commentEl = form.querySelector(".js-edit-comment-input");
        const nextText = commentEl ? commentEl.value.trim() : "";
        if (nextText.length < 4) {
          if (typeof window.showCartToast === "function") {
            window.showCartToast("Vui lòng nhập nhận xét tối thiểu 4 ký tự.", { type: "warning" });
          }
          return;
        }
        if (typeof window.updateReview === "function") {
          window.updateReview(revId, currentUser.userId, rangeEl ? rangeEl.value : 5, nextText);
        }
        updateRatingSummaryDisplay();
        renderProductReviews();
        if (typeof window.showCartToast === "function") {
          window.showCartToast("Đã cập nhật đánh giá của bạn!", { type: "success" });
        }
      });
    });

    reviewsContainer.querySelectorAll(".js-delete-review-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const revId = btn.getAttribute("data-review-id");
        if (typeof window.deleteReview === "function" && window.deleteReview(revId, currentUser.userId)) {
          updateRatingSummaryDisplay();
          renderProductReviews();
          if (typeof window.showCartToast === "function") {
            window.showCartToast("Đã xóa đánh giá.", { type: "info" });
          }
        }
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
