# BakeMate – UI Design & Architecture Guidelines

Tài liệu quy chuẩn cấu trúc mã nguồn, hệ thống thành phần dùng chung và nguyên tắc phối hợp giao diện cho dự án **BakeMate** (Học phần Phát triển ứng dụng TMĐT – UEH).

---

## 1. Cấu trúc thư mục dự án (Directory Architecture)

Hệ thống được tổ chức theo mô hình đa trang tĩnh HTML5 + CSS3 kết hợp JavaScript mô-đun hóa (Phương án A — bảo toàn kiến trúc `js/` hiện có của nhóm):

```text
bakemate-ecommerce-project/
├── index.html              # Trang chủ: Hero Carousel 3 banner, Category Carousel 6 thẻ tự động lướt, Promo Bar
├── products.html           # Danh mục sản phẩm: Lưới 21 sản phẩm chuẩn 3 danh mục, tìm kiếm/lọc/sắp xếp
├── product-detail.html     # Chi tiết sản phẩm: Gallery 3 ảnh, quy cách đóng gói, Recipe-to-Cart, mua kèm
├── blog.html               # Blog công thức & kỹ thuật làm bánh kèm nút thêm trọn bộ combo
├── cart.html               # Giỏ hàng & Thanh toán COD: Nhóm recipeGroupId, mã CHAOBANMOI, F12 & F13
├── about.html              # Giới thiệu: Câu chuyện thương hiệu, giá trị cốt lõi, liên hệ
├── css/
│   └── style.css           # Design tokens & stylesheet dùng chung toàn hệ thống (1366/768/390px)
├── js/
│   ├── products.js         # Dữ liệu chuẩn 21 sản phẩm (6 trường + 3 danh mục thống nhất)
│   ├── storage.js          # IIFE Quản lý localStorage (bakemate_cart, bakemate_orders, bakemate_coupon), Toast & Copy Promo
│   ├── home.js             # IIFE Điều khiển Hero Carousel & Editorial Category Carousel trên index.html
│   ├── search-filter.js    # IIFE Kết xuất danh sách & applyFiltersAndSort() (tìm kiếm, lọc, sắp xếp)
│   ├── product-detail.js   # Gallery đa ảnh, quy cách 100g–1kg, Recipe Cross-link, kiểm tra ID hợp lệ
│   ├── cart.js             # IIFE Render nhóm mua lẻ/combo, sửa/xóa 1->0 confirm, mã CHAOBANMOI, form COD F13
│   └── blog.js             # IIFE Lọc bài viết, modal hướng dẫn từng bước & Thêm combo vào giỏ
├── images/
│   ├── categories/         # Ảnh Editorial Image Card danh mục (cat-ingredients.jpg, cat-tools.jpg, cat-packaging.jpg)
│   ├── products/           # 63 ảnh sản phẩm chuẩn hóa (<slug>-1.jpg .. -3.jpg cho 21 mặt hàng)
│   ├── banner.jpg, logo.jpg, about-*.jpg, contact-baking.jpg ...
├── docs/
│   ├── ui-design.md        # Bản đặc tả quy chuẩn giao diện và kiến trúc dự án
│   ├── test-report.md      # Kịch bản nghiệm thu 14 Test Cases, nhật ký sửa lỗi & phân công Buổi 3
│   ├── competitor-analysis.md
│   └── business-workflow.md
├── README.md               # Giới thiệu tổng quan dự án và hướng dẫn vận hành
├── REQUIREMENTS.md         # Bảng đặc tả 28 yêu cầu chức năng (F01 - F28) & NFR01 - NFR10
├── PROJECT_PLAN.md         # Phân công công việc và tiến độ thực hiện của nhóm
├── AGENTS.md               # Quy định hướng dẫn AI hỗ trợ dự án
└── AI_USAGE_LOG.md         # Nhật ký sử dụng và phản biện công cụ AI qua từng buổi
```

> **Lưu ý về định danh thư mục nộp bài:** Tên kho lưu trữ chuẩn hóa của dự án là `bakemate-ecommerce-project` (khi đóng gói ZIP hoặc đổi tên trên GitHub, sử dụng tên `bakemate-ecommerce-project` thay cho tên kho cũ trước đây).

---

## 2. Hệ thống thành phần dùng chung (Design System & Reusable Components)

### 2.1. Bảng màu thương hiệu & Phông chữ (Design Tokens)

| Phân nhóm màu / Token | Mã màu / Giá trị | Mô tả ứng dụng thực tế |
| :--- | :---: | :--- |
| **`--primary-color` (Chủ đạo)** | `#70452B` | Sắc nâu bánh nướng ấm áp — dùng cho Header, Footer, tiêu đề và chữ chính. |
| **`--bg-color` (Nền kem sáng)** | `#FFF8ED` | Nền tổng thể website dịu mắt và nền khối Combo công thức nét đứt caramel. |
| **`--secondary-color` (Vàng kem)** | `#F2D9A6` | Viền thẻ sản phẩm, nền pill quy cách đang chọn và đường phân cách mềm. |
| **`--accent-sub` (Caramel)** | `#C88B52` | Văn bản phụ, đường viền nét đứt (`2px dashed #C88B52`) bọc nhóm Combo Recipe-to-Cart. |
| **`--accent-cta` (Vàng mật ong)** | `#F59E0B` | Nút CTA chính, trạng thái `:hover` / `.active`, giá sản phẩm và viền `:focus-visible`. |
| **`--font-main` (Phông chữ)** | `'Be Vietnam Pro'` | Phông chữ tiếng Việt hiện đại (trọng số 400–800) thống nhất trên mọi trang. |

---

### 2.2. Khung điều hướng chuẩn, Quy tắc Zero-Emoji SVG & Banner Voucher

* Mọi trang HTML đều dùng `<header class="site-header">` sticky tối đa `1200px` với biểu tượng giỏ hàng inline SVG nét mảnh (`.site-header__cart-icon`) và 4 liên kết chuẩn hóa:
  * `index.html` — **Trang chủ**
  * `products.html` — **Sản phẩm** (kích hoạt `.active` trên `products.html` và `product-detail.html`)
  * `blog.html` — **Blog** (kích hoạt `.active` trên `blog.html`)
  * `about.html` — **Giới thiệu** (kích hoạt `.active` trên `about.html`)
  * Riêng `cart.html` chỉ kích hoạt `.active` ở biểu tượng giỏ hàng `.site-header__cart`, tuyệt đối **không** gán `.active` lên mục `Sản phẩm`.
* **Quy chuẩn Icon chuyên nghiệp (Zero-Emoji):** Tuyệt đối không sử dụng emoji ký tự trên UI. Mọi biểu tượng (giỏ hàng Header, phiếu ưu đãi Voucher, đồng hồ/khẩu phần công thức, kính lúp tìm kiếm, mũi tên điều hướng) đều dùng SVG nét mảnh (`stroke-width: 1.8–2.2`) hoặc ảnh chụp thực tế.
* **Banner Voucher khuyến mãi (`.promo-ticket-band` / `.promo-ticket-bar`):** Đặt thành một dải nền kem riêng ngay phía trên `<footer class="site-footer">` trên toàn bộ 6 trang HTML. Thẻ `.promo-ticket-bar` dùng nền gradient nâu `#70452B → #5b361f`, viền nét đứt caramel `1.5px dashed #C88B52`, bo góc `12px`, biểu tượng SVG vé giảm giá màu `#F59E0B`, huy hiệu `.promo-badge` chữ nâu `#451a03` nổi bật và nút `.js-copy-promo` (*"Sao chép mã"*) sao chép **`CHAOBANMOI`** vào clipboard kèm Toast xác nhận. Footer phía dưới giữ cấu trúc 3 cột (`BakeMate - Đồng hành cùng gian bếp`, `Lối tắt`, `Hỗ trợ khách hàng`).

---

### 2.3. Quy chuẩn Thẻ sản phẩm, Trang chủ Carousel & Nhóm Giỏ hàng Recipe-to-Cart

* **Banner Trang chủ (`#hero-carousel` & `#category-carousel`):** Trang `index.html` sử dụng Hero Carousel 3 banner toàn chiều rộng tự động chuyển mỗi `5.5s` kèm thanh tiến trình mật ong `#F59E0B`, nút Prev/Next, dots điều hướng và tạm dừng khi hover/focus. Phía dưới là khu vực *"Khám phá thế giới làm bánh cùng BakeMate"* gồm 6 **Editorial Image Card** (`.category-card` khung ảnh tỷ lệ `16 / 10` zoom `scale(1.04)` khi hover, huy hiệu số lượng sản phẩm/nhãn chủ đề, thân thẻ chữ nâu + CTA mũi tên SVG caramel) tự động lướt xoay vòng mỗi `3.8s`, hiển thị `3` thẻ (desktop `> 1024px`), `2` thẻ (tablet `<= 1024px`) hoặc `1` thẻ (mobile `<= 640px`), có nút bật/tạm dừng (`#category-autoplay-btn`) và hỗ trợ vuốt chạm.
* **Thẻ sản phẩm (`.product-card`):** Dùng ảnh tỷ lệ `aspect-ratio: 1 / 1` (`object-fit: cover`), hiển thị nhãn danh mục chuẩn thuộc đúng 3 nhóm (`Nguyên liệu`, `Dụng cụ`, `Phụ kiện & Đóng gói`), tên tối đa 2 dòng (`line-clamp: 2`), đơn giá `Intl.NumberFormat('vi-VN')` và 2 nút `Xem chi tiết` + `Thêm vào giỏ`.
* **Cấu trúc item trong `bakemate_cart`:** `{ productId, optionIndex, quantity, recipeGroupId }` với `recipeGroupId: null` cho hàng mua lẻ và chuỗi slug (vd `'recipe-bong-lan'`) cho combo công thức. Hàng combo được gom vào khối `.cart-group--recipe` viền nét đứt `#C88B52`, nền `#FFF8ED`, kèm nút `Xóa cả combo`.

---

## 3. Quy ước kỹ thuật và kiểm soát tích hợp

* **Quy tắc đường dẫn tương đối (Relative Path):** Toàn bộ CSS, JS và ảnh dùng đường dẫn tương đối (`css/style.css`, `js/storage.js`, `images/products/...`) để chạy ổn định trên cả File Explorer (`file://`), Live Server và GitHub Pages.
* **Thứ tự nạp Script chuẩn:** `js/products.js` → `js/storage.js` → script riêng từng trang (`home.js` / `search-filter.js` / `product-detail.js` / `cart.js` / `blog.js`; riêng `about.html` dùng `products.js` + `storage.js`), tất cả được cô lập trong IIFE để tránh xung đột biến toàn cục.
* **Quy chuẩn đặt tên:** Tệp HTML viết dạng `kebab-case`, hàm/biến dùng `camelCase`, hằng số cấu hình dùng `UPPER_SNAKE_CASE`.
