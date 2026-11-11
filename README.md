# BakeMate – Website Thương Mại Điện Tử Nguyên Liệu & Dụng Cụ Làm Bánh

> **Tên kho lưu trữ chuẩn hóa:** `bakemate-ecommerce-project`
> **Môn học:** Phát triển ứng dụng Web / Thương mại điện tử (UEH)
> **Giảng viên hướng dẫn:** TS. Nguyễn Mạnh Tuấn (tuannm@ueh.edu.vn)
> **Nhóm thực hiện:** Nhóm 3 (Gia Bảo, Bảo Ngọc, Minh Thư, Nguyễn Thương, Hiền, Đen Ny, Phạm Thương, Như Hậu)
> **Giai đoạn hiện tại:** Buổi 3 – Hoàn thiện tương tác JavaScript, Giỏ hàng `localStorage` (`bakemate_cart`) & Đặt hàng COD (F12, F13)

---

## 1. Giới thiệu dự án

**BakeMate** là nền tảng thương mại điện tử kinh doanh nguyên liệu, dụng cụ và phụ kiện làm bánh theo định hướng **"Lấy công thức làm trung tâm" (Recipe-to-Cart)**. Website giúp người làm bánh tại nhà — đặc biệt là người mới bắt đầu — chọn đúng nguyên liệu theo hàm lượng protein/quy cách đóng gói vừa đủ dùng (`100g`, `300g`, `500g`, `1kg`) hoặc thêm trọn bộ nguyên liệu của một công thức vào giỏ chỉ với 1 lần nhấn.

Trong giai đoạn Buổi 3, nhóm đã hoàn thiện toàn bộ logic JavaScript thuần (Vanilla ES6 theo kiến trúc mô-đun `js/` dùng chung), mở rộng danh mục lên **21 sản phẩm** kèm **63 ảnh gallery chuẩn hóa**, bổ sung trang **Blog công thức (`blog.html`)**, hoàn thiện tính năng nhóm giỏ hàng theo công thức (`recipeGroupId`), mã ưu đãi `CHAOBANMOI` (-10%), và luồng đặt hàng COD lưu cục bộ (`localStorage`).

---

## 2. Cấu trúc thư mục dự án

```text
bakemate-ecommerce-project/
├── index.html              # Trang chủ (Header, Hero Carousel 3 banner, Category Carousel 6 thẻ, Promo Bar)
├── products.html           # Danh mục 21 sản phẩm (Tìm kiếm tức thì, Lọc 3 danh mục, Sắp xếp giá)
├── product-detail.html     # Chi tiết sản phẩm động (?id=1..21), Gallery 3 ảnh, Quy cách 100g–1kg, Recipe-to-Cart
├── blog.html               # Blog hướng dẫn làm bánh theo công thức & thêm combo vào giỏ
├── cart.html               # Giỏ hàng phân nhóm (mua lẻ vs combo recipeGroupId), mã CHAOBANMOI & đặt hàng COD
├── about.html              # Câu chuyện thương hiệu, giá trị cốt lõi, quy trình và thông tin liên hệ
├── css/
│   └── style.css           # Design tokens BakeMate & Responsive (1366px / 768px / 390px)
├── js/
│   ├── products.js         # Dữ liệu 21 sản phẩm (3 danh mục: Nguyên liệu, Dụng cụ, Phụ kiện & Đóng gói)
│   ├── storage.js          # Khóa bakemate_cart / bakemate_orders / bakemate_coupon, Copy Promo & Recipe Combo Catalog
│   ├── home.js             # Hero Carousel & Editorial Category Carousel tự động lướt/xoay vòng trên index.html
│   ├── search-filter.js    # renderProducts(), applyFiltersAndSort(), đọc URL ?q= & ?category=
│   ├── product-detail.js   # Chi tiết động 21 SP, 3 ảnh/SP, kiểm tra ID không tồn tại, nút Thêm combo
│   ├── cart.js             # Nhóm viền nét đứt caramel cho combo, xác nhận xóa 1->0, CHAOBANMOI, COD F13
│   └── blog.js             # Lọc chủ đề, modal công thức chi tiết & Thêm combo nguyên liệu
├── images/
│   ├── categories/         # Ảnh Editorial Card danh mục trang chủ (cat-ingredients.jpg, cat-tools.jpg, cat-packaging.jpg)
│   ├── products/           # 63 ảnh sản phẩm chuẩn (<slug>-1.jpg .. -3.jpg) cho đủ 21 mặt hàng
│   └── ...                 # Banner, logo, favicon và ảnh minh họa góc bếp
├── docs/
│   ├── ui-design.md        # Bản đặc tả giao diện & Design Tokens chuẩn
│   ├── test-report.md      # Kịch bản kiểm thử toàn diện & Nhật ký sửa lỗi Buổi 3
│   ├── competitor-analysis.md
│   └── business-workflow.md
├── REQUIREMENTS.md         # Đặc tả yêu cầu F01 - F28 & NFR01 - NFR10
├── PROJECT_PLAN.md         # Phân công công việc chi tiết của 8 thành viên
├── AGENTS.md               # Nguyên tắc phối hợp AI trong dự án
└── AI_USAGE_LOG.md         # Nhật ký sử dụng & phản biện AI (Buổi 1 – Buổi 3)
```

---

## 3. Các tính năng đã triển khai hoạt động (Buổi 3)

1. **Quản lý danh mục 21 sản phẩm & Tìm kiếm/Lọc/Sắp xếp (`products.html` + `js/products.js` + `js/search-filter.js`):**
   - Chuẩn hóa 21 sản phẩm theo 6 trường (`id, name, price, category, image, description`) và đúng 3 danh mục lớn: **`Nguyên liệu`** (10 món), **`Dụng cụ`** (6 món), **`Phụ kiện & Đóng gói`** (5 món).
   - Tìm kiếm tức thì không phân biệt hoa thường hay dấu tiếng Việt, hỗ trợ đọc tham số `?q=` và `?category=` trên URL.
   - Lọc theo danh mục + sắp xếp giá tăng/giảm bất biến trên bản sao mảng `[...products]`; hiển thị Empty State thân thiện khi không có kết quả.
2. **Trang chi tiết sản phẩm động & Gallery 3 ảnh (`product-detail.html` + `js/product-detail.js`):**
   - Đọc `URLSearchParams` (`?id=1..21`); bắt lỗi an toàn với thông báo *"Sản phẩm không tồn tại hoặc đã ngừng kinh doanh"* khi ID sai/thiếu.
   - Gallery 3 ảnh cho từng sản phẩm (`images/products/<slug>-1..3.jpg`), đổi giá/tiết kiệm live khi chuyển pill quy cách đóng gói (đặc biệt bổ sung đủ 4 mức `1kg / 500g / 300g / 100g dùng thử` cho 3 dòng bột mì `#1–#3`).
   - Nút **"+ Thêm combo công thức vào giỏ"** trực tiếp từ khối Recipe Cross-link UVP.
3. **Blog công thức làm bánh (`blog.html` + `js/blog.js`):**
   - 6 bài viết hướng dẫn thực tế, lọc theo chủ đề & tìm kiếm, modal đọc hướng dẫn từng bước kèm bảng tính chi phí combo và nút thêm trọn bộ nguyên liệu vào giỏ.
4. **Giỏ hàng `bakemate_cart` phân nhóm Recipe-to-Cart, Mã giảm giá & Đặt hàng COD F12–F13 (`cart.html` + `js/storage.js` + `js/cart.js`):**
   - Cấu trúc giỏ hàng chuẩn `{ productId, optionIndex, quantity, recipeGroupId }`.
   - Hiển thị tách biệt hàng mua lẻ (`recipeGroupId: null`) và từng khối **Combo công thức** (viền nét đứt caramel `2px dashed #C88B52`, nền kem `#FFF8ED`) kèm nút **"Xóa cả combo"**.
   - Bấm `-` khi số lượng là `1` hoặc nhập `0` hiển thị hộp thoại xác nhận trước khi xóa khỏi giỏ; tự động đồng bộ badge giỏ hàng trên Header mọi trang.
   - Nhập mã ưu đãi **`CHAOBANMOI`** giảm **10%** tổng tạm tính (hiển thị báo lỗi đỏ nếu mã sai), tự động tính lại tổng thanh toán và đính kèm vào đơn hàng COD khi xác nhận đặt hàng.
   - Form đặt hàng COD (F13) kiểm tra họ tên, số điện thoại Việt Nam, email (nếu có), địa chỉ; sinh mã đơn `#BM-XXXXXX`, lưu vào `bakemate_orders` và hiển thị lịch sử đơn hàng cục bộ.

---

## 4. Công nghệ và hệ thống Design System

- **HTML5 Semantic, CSS3 Grid/Flexbox & Vanilla JavaScript (ES6 IIFE modules).**
- **Hệ thống màu thương hiệu:** Nâu bánh nướng `#70452B` | Kem sáng `#FFF8ED` | Vàng kem `#F2D9A6` | Caramel `#C88B52` | Vàng mật ong `#F59E0B`.
- **Phông chữ:** `'Be Vietnam Pro'` (400, 500, 600, 700, 800).
- **Responsive 3 kích thước chuẩn:** Desktop `1366px`, Tablet `768px`, Mobile `390px`.

---

## 5. Hướng dẫn chạy và kiểm thử

1. **Cách mở website:**
   - Mở trực tiếp tệp `index.html` trên trình duyệt (Chrome/Edge/Firefox), **hoặc** chạy qua **Live Server** trong Visual Studio Code (`Open with Live Server` tại thư mục gốc dự án).
2. **Kịch bản kiểm thử nhanh:**
   - Truy cập `products.html`: thử tìm `"bột"`, lọc `"Phụ kiện & Đóng gói"`, sắp xếp giá tăng/giảm và gõ chuỗi bất kỳ để xem thông báo rỗng.
   - Mở `product-detail.html?id=1`: bấm chuyển 3 ảnh thumbnail, chọn quy cách `Túi 300g` (19.000 ₫), hoặc truy cập `product-detail.html?id=999` để xem màn hình xử lý ID không hợp lệ.
   - Mở `blog.html`: đọc bài *"Bánh Bông Lan Chiffon"* và bấm **"+ Thêm combo vào giỏ"**.
   - Truy cập `cart.html`: quan sát khung viền nét đứt caramel tách riêng combo với hàng mua lẻ; thử bấm `-` ở số lượng `1` để xem hộp thoại xác nhận; nhập sai mã giảm giá (vd `SALE50`) xem báo lỗi đỏ rồi nhập `CHAOBANMOI` (-10%); điền thông tin giao hàng COD và xác nhận đặt hàng để kiểm tra mã đơn `#BM-XXXXXX`.
   - Đối chiếu chi tiết kịch bản kiểm thử tại [docs/test-report.md](docs/test-report.md).

---

## 6. Giới hạn hiện tại

- Hệ thống lưu trữ giỏ hàng, đơn hàng COD và mã giảm giá hoạt động cục bộ trên trình duyệt (`localStorage`) nhằm phục vụ kiểm thử đồ án môn học; chưa kết nối cơ sở dữ liệu Backend hay cổng thanh toán trực tuyến thực tế.
- Trang quản trị Admin (F14–F17) và hệ thống đăng ký/đăng nhập tài khoản (F18) nằm ở giai đoạn tiếp theo theo lộ trình nhóm.
- Tên thư mục gốc khi kéo trực tiếp từ Git cũ vẫn có thể đang mang tên clone trước đó; khi đóng gói nộp bài/đổi tên repo trên GitHub, sử dụng tên chuẩn `bakemate-ecommerce-project`.
