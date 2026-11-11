# BÁO CÁO NGHIỆM THU & KIỂM THỬ BUỔI 3 – BAKEMATE (`bakemate-ecommerce-project`)

> **Phụ trách kiểm thử:** Phạm Hoài Thương (QA Tester), Hồ Gia Bảo (Tech Lead)  
> **Môi trường kiểm thử:** Microsoft Edge Headless (Chromium DOM + CSS Layout Inspection) & Kiểm toán tài nguyên tĩnh  
> **Trạng thái nghiệm thu:** **Đạt (PASS) toàn bộ kịch bản kiểm thử gốc (14 Test Cases) & kiểm thử nâng cấp giao diện Zero-Emoji / Carousel / Responsive 18 lượt render** sau lần chỉnh sửa mã nguồn cuối cùng

---

## 1. Kiến trúc Module & Thứ tự nạp Script chuẩn (Bước 1 – Buổi 3)

Website **BakeMate** được triển khai theo **Phương án A** (HTML5 ngữ nghĩa + `css/style.css` dùng chung + Vanilla JavaScript ES6 mô-đun hóa trong `js/`, cô lập phạm vi bằng IIFE).

### 1.1. Bảng phân công Module & Điều kiện phụ thuộc

| Thành viên | Nhiệm vụ chính | Tệp mã nguồn bàn giao | Điều kiện phụ thuộc | Tiêu chí nghiệm thu (Acceptance Criteria) |
|---|---|---|---|---|
| **Hồ Gia Bảo** (Tech Lead) | Kiến trúc JS, khóa `localStorage`, API dùng chung `bakemate_cart` (`recipeGroupId`), mã `CHAOBANMOI` & tổng hợp tài liệu | `js/storage.js`, `README.md`, `docs/ui-design.md`, `AI_USAGE_LOG.md` | Thống nhất Design System Buổi 2 | Mọi module chạy độc lập không xung đột biến toàn cục; đồng bộ Header Badge trên 6 trang; áp dụng giảm giá 10% chính xác. |
| **Trần Thị Bảo Ngọc** (PM / Data) | Chuẩn hóa 21 sản phẩm (6 trường, 3 danh mục lớn) và đồng bộ 63 ảnh sản phẩm | `js/products.js`, `images/products/*`, `PROJECT_PLAN.md` | `REQUIREMENTS.md` | 100% ảnh `images/products/<slug>-1..3.jpg` tồn tại; 3 danh mục khớp `Nguyên liệu`, `Dụng cụ`, `Phụ kiện & Đóng gói`. |
| **Vũ Ngọc Minh Thư** (UI/UX & Filter) | Kết xuất lưới sản phẩm, tìm kiếm không dấu, lọc 3 danh mục & sắp xếp bất biến | `products.html`, `js/search-filter.js`, `css/style.css` | `js/products.js`, `js/storage.js` | `applyFiltersAndSort()` lọc/sắp xếp không sửa mảng gốc; đọc URL `?q=` & `?category=`; hiện Empty State khi 0 kết quả. |
| **Nguyễn Hoài Thương** (Detail Dev) | Trang chi tiết động `?id=1..21`, Gallery 3 ảnh, quy cách đóng gói `100g–1kg`, Recipe Cross-link | `product-detail.html`, `js/product-detail.js` | `js/products.js`, `js/storage.js` | Đổi giá/tiết kiệm live khi chọn pill; ID sai báo lỗi thân thiện + ẩn khối phụ; nút thêm combo hoạt động. |
| **Siu Đen Ny** (Cart UI & State) | Giao diện giỏ hàng phân nhóm mua lẻ vs Combo `recipeGroupId` viền nét đứt caramel | `cart.html`, `js/cart.js`, `css/style.css` | `js/storage.js` | Tách rõ nhóm `recipeGroupId: null` và từng combo nét đứt `#C88B52`; nút `Xóa cả combo` và `1->0 confirm` hoạt động. |
| **Dương Thúy Hiền** (Checkout F12/F13) | Form mã giảm giá `CHAOBANMOI`, kiểm tra form COD F13, tạo mã `#BM-XXXXXX` & lịch sử đơn | `cart.html`, `js/cart.js`, `js/storage.js` | `js/cart.js` bảng giỏ hàng | Form trống/sai SĐT bị từ chối rõ lỗi; đặt hàng thành công trừ giảm giá đúng, xóa giỏ hàng & lưu `bakemate_orders`. |
| **Trần Lê Như Hậu** (Blog & Content) | Trang Blog công thức 6 bài viết, lọc chủ đề, modal hướng dẫn & nút Recipe-to-Cart | `blog.html`, `js/blog.js` | `js/products.js`, `js/storage.js` | Mở bài từ modal hoặc `#recipe-...` hash URL; hiển thị bảng chi phí combo và thêm trọn bộ nguyên liệu vào giỏ. |
| **Phạm Hoài Thương** (QA Tester) | Kiểm toán ảnh/link, chạy 14 Test Cases chức năng & Responsive `1366/768/390px`, ghi log fix lỗi | `docs/test-report.md` | Hoàn thiện toàn bộ trang | 0 liên kết gãy, 0 ảnh 404, 0 lỗi `scrollWidth > innerWidth` ở 3 khung màn hình, nghiệm thu đủ luồng F01–F13. |

### 1.2. Quy chuẩn khóa `localStorage` & Thứ tự nạp Script

- **Khóa lưu trữ thống nhất:** `bakemate_cart` (danh sách item `{ productId, optionIndex, quantity, recipeGroupId }`), `bakemate_orders` (lịch sử đơn hàng COD), `bakemate_coupon` (mã ưu đãi đang áp dụng).
- **Thứ tự `<script>` bắt buộc trên các trang:**
  1. `index.html`: `js/products.js` → `js/storage.js` → `js/home.js`
  2. `about.html`: `js/products.js` → `js/storage.js`
  3. `products.html`: `js/products.js` → `js/storage.js` → `js/search-filter.js`
  4. `product-detail.html`: `js/products.js` → `js/storage.js` → `js/product-detail.js`
  5. `blog.html`: `js/products.js` → `js/storage.js` → `js/blog.js`
  6. `cart.html`: `js/products.js` → `js/storage.js` → `js/cart.js`

---

## 2. Bảng nghiệm thu 14 Test Cases kiểm thử

| Mã TC | Chức năng / Luồng kiểm thử | Kịch bản & Dữ liệu đầu vào | Kết quả thực tế quan sát được | Kết luận |
|---|---|---|---|---|
| **TC01** | Hiển thị danh mục 21 sản phẩm (`F02`) | Mở `products.html` (1366px), kiểm tra `.product-card`, nhãn `.product-card__category`, ảnh sản phẩm. | Hiển thị đúng `21` thẻ; toàn bộ danh mục thuộc 3 nhóm (`Nguyên liệu`, `Dụng cụ`, `Phụ kiện & Đóng gói`); `brokenImgs=0`. | **PASS** |
| **TC02** | Tìm kiếm, Lọc, Sắp xếp & Empty State (`F03`) | Nhập `"bot"` + chọn `"Nguyên liệu"` + sắp xếp `"asc"`; sau đó lọc `"Phụ kiện & Đóng gói"`; gõ `"xyzkhongtontai"`. | Trả về 5 loại bột giá tăng `[32000, 45000, 52000, 65000, 75000]`; `window.products` gốc giữ nguyên 21 phần tử; nhóm phụ kiện ra `5` món; chuỗi lạ hiện thông báo không tìm thấy. | **PASS** |
| **TC03** | Đọc tham số URL (`?category=`) | Truy cập `products.html?category=D%E1%BB%A5ng%20c%E1%BB%A5`. | Ô chọn `#category-filter` tự gán `"Dụng cụ"` và lưới hiển thị đúng `6` sản phẩm dụng cụ. | **PASS** |
| **TC04** | Chi tiết SP, 3 ảnh & 4 mức bột mì (`F04`, `F16`) | Mở `product-detail.html?id=1`, bấm chọn quy cách thứ 3 (`Túi 300g`), bấm thumbnail ảnh 2. | Có đủ `3` ảnh thumbnail, `4` mức quy cách bột mì (`1kg`, `500g`, `300g`, `100g`), giá nhảy về `19.000 ₫`, ảnh chính đổi sang `images/products/bot-mi-so-8-2.jpg`, `brokenPdImgs=0`. | **PASS** |
| **TC05** | Xử lý ID sản phẩm không hợp lệ (`NFR02`) | Mở `product-detail.html?id=999`. | Hiển thị thông báo *"Sản phẩm không tồn tại hoặc đã ngừng kinh doanh"* kèm nút quay lại `products.html`; ẩn khối thông số/công thức/liên quan (`specsHidden=true`). | **PASS** |
| **TC06** | Thêm hàng lẻ vào `bakemate_cart` & Badge (`F12`) | Tại `product-detail.html?id=1`, chọn `Túi 300g`, nhập SL `2`, bấm `"Thêm vào giỏ hàng"`. | `localStorage['bakemate_cart']` lưu `[{"productId":1,"optionIndex":2,"quantity":2,"recipeGroupId":null}]`; badge Header cập nhật thành `2`. | **PASS** |
| **TC07** | Blog Combo + Giỏ hàng nét đứt & Active Header (`F11`, `F12`) | Mở `blog.html`, lọc chủ đề 2, mở modal bài 1, bấm thêm combo; mở `cart.html`. | Menu `Sản phẩm` trên `cart.html` không có `.active` (`prodActive=false`), icon giỏ hàng có `.active` (`cartActive=true`); giỏ hàng tách riêng `1` hàng lẻ và khối `.cart-group--recipe` gồm `4` món với `borderStyle === "dashed"`. | **PASS** |
| **TC08** | Giảm SL `1 -> 0` hỏi xác nhận & Xóa cả combo (`F12`) | Trên `cart.html`, bấm `-` ở item SL `1` trong combo: lần 1 chọn Cancel, lần 2 chọn OK; bấm `"Xóa cả combo"`. | `confirm()` được gọi 2 lần; Cancel giữ nguyên SL `1`; OK xóa item còn `3` món; bấm `"Xóa cả combo"` xóa sạch nhóm combo và giữ nguyên `1` hàng lẻ. | **PASS** |
| **TC09** | Áp dụng & từ chối mã giảm giá `CHAOBANMOI` (`F20`) | Tại `cart.html` (tạm tính `38.000 ₫`), nhập `"SALE50"`, sau đó nhập `"CHAOBANMOI"`. | `"SALE50"` hiện báo lỗi đỏ (`.is-error`) và giữ ẩn dòng giảm giá; `"CHAOBANMOI"` giảm 10% (`-3.800 ₫`), tổng thanh toán cập nhật đúng `34.200 ₫`. | **PASS** |
| **TC10** | Đặt hàng COD (`F13`) kèm mã giảm giá (`F13`) | Bấm đặt hàng khi form rỗng; sau đó điền hợp lệ (`Nguyễn Thị Demo`, `0912345678`, địa chỉ Q.3) và xác nhận. | Lần rỗng bị chặn (`#customer-name.is-invalid`, chưa tạo đơn); lần hợp lệ tạo đơn `#BM-XXXXXX` với `couponCode="CHAOBANMOI"`, `total=34200`, xóa rỗng `bakemate_cart`, hiện khối xác nhận và lịch sử đơn. | **PASS** |
| **TC11** | Kiểm thử Responsive 1366 / 768 / 390px & Promo Bar (`NFR01`) | Duyệt đủ 6 trang (`index`, `products`, `product-detail?id=12`, `blog`, `cart` có cả hàng lẻ + combo, `about`) tại `1366px`, `768px`, `390px`. | `0` lỗi tràn ngang across `18` lượt render (`scrollWidth <= innerWidth`), `brokenImgs=0`, số dot Category Carousel tự thích ứng (`4` @1366px, `5` @768px, `6` @390px), đủ `6` trang có `.promo-ticket-bar` & `.js-copy-promo` ngoài `<footer>` và SVG giỏ hàng. | **PASS** |
| **TC12** | Combo từ Chi tiết SP + Deep-link Blog `#hash` + Tìm URL (`F03`, `F11`) | Bấm nút combo tại `product-detail.html?id=1`; mở `blog.html#recipe-hoa-cuc`; mở `products.html?q=kem`. | Combo thêm đủ `4` món vào `bakemate_cart`; `blog.html#recipe-hoa-cuc` tự mở modal bài viết đúng (`!hidden`) và thêm combo + checkout COD `#BM-889425` thành công; `products.html?q=kem` trả về sản phẩm khớp từ khóa. | **PASS** |
| **TC13** | Kiểm toán liên kết, ảnh sản phẩm & Zero-Emoji SVG | Chạy script `audit.ps1` quét toàn bộ `.html`, `.js`, `.css` (emoji ký tự/numeric entity, đường dẫn `images/...`, Header SVG cart, Promo bar). | `Total missing images: 0` (đủ 63 ảnh `images/products/`, 3 ảnh `images/categories/`, banner & icon); `promoBar=True`, `svgCart=True`, `promoInsideFooter=False` trên 6/6 HTML; 0 emoji ký tự (chỉ giữ 2 chuỗi sao đánh giá `★★★★★` hợp lệ ở chi tiết SP). | **PASS** |
| **TC14** | Kiểm tra thị giác qua ảnh chụp màn hình thực tế | Chụp màn hình `index.html` (`1366px` & `390px`), `products.html`, `about.html` (`1366px`). | Hero Carousel 3 slide, 3 thẻ Editorial Image Card thẳng hàng (ảnh bột/nguyên liệu, dụng cụ, hộp đựng bánh BakeMate), dải Promo Ticket Bar nét đứt caramel tách biệt trước Footer kèm icon ticket `%` rõ nét, không vỡ chữ/lệch cột. | **PASS** |
| **TC15** | Hero Carousel & Editorial Category Carousel (`index.html`) | Kiểm thử `#hero-carousel` (Prev/Next/Dot) và `#category-carousel` (Next 4 lần xoay vòng, Play/Pause `#category-autoplay-btn`, lọc Thẻ 3). | `hero=[0->1->2->1]`, `cards=6`, `dots=4` (@1366px), `transform='translate3d(-393.328px, 0px, 0px)'`, xoay vòng về `dot[0]` (`wrapped=true`), `pauseToggle=true/true`, link Thẻ 3 lọc đúng `5` sản phẩm `Phụ kiện & Đóng gói`. | **PASS** |
| **TC16** | Banner Voucher & Nút Sao chép mã `CHAOBANMOI` | Kiểm tra `.promo-ticket-bar` nằm ngoài `<footer>`, bấm `.js-copy-promo` trên `index.html`. | `insideFooter=false`, nút chuyển trạng thái `.is-copied` (*"Đã sao chép!"*), hiển thị Toast xác nhận chứa mã `CHAOBANMOI`, `domHasEmoji=false`. | **PASS** |

---

## 3. Nhật ký các lỗi đã phát hiện & xử lý (Bug Fix Log)

| STT | Tệp liên quan | Mô tả vấn đề phát hiện | Cách khắc phục đã triển khai |
|---|---|---|---|
| **BUG-01** | `cart.html` | Khi vào trang Giỏ hàng (`cart.html`), mục menu `Sản phẩm` trên Header bị gán nhầm class `.active` (nền vàng). | Xóa class `.active` khỏi liên kết `products.html` trên `cart.html`; chỉ kích hoạt `.site-header__cart.active` cho biểu tượng giỏ hàng. |
| **BUG-02** | Tất cả 6 file HTML | Thiếu chuẩn hóa menu `Blog` và banner mã giảm giá thành viên mới `CHAOBANMOI` (-10%). | Đồng bộ 4 mục Header (`Trang chủ`, `Sản phẩm`, `Blog`, `Giới thiệu`) và triển khai dải `.promo-ticket-band` / `.promo-ticket-bar` chứa `CHAOBANMOI` ngay phía trên Footer của toàn bộ 6 trang. |
| **BUG-03** | `js/products.js`, `js/product-detail.js`, `images/products/` | Ảnh tham chiếu `images/products/*.jpg` bị thiếu thư mục thực tế gây nguy cơ lỗi 404; số lượng sản phẩm ít và danh mục chưa quy về đúng 3 nhóm chuẩn. | Tạo thư mục `images/products/` với đủ 63 ảnh (`-1.jpg .. -3.jpg` cho 21 mặt hàng); mở rộng dữ liệu lên 21 sản phẩm thuộc đúng 3 danh mục `Nguyên liệu`, `Dụng cụ`, `Phụ kiện & Đóng gói`. |
| **BUG-04** | `js/storage.js`, `js/search-filter.js`, `js/cart.js`, `js/product-detail.js` | Khai báo hằng/hàm ở top-level có nguy cơ trùng tên (`const FALLBACK_IMG`, `function escapeHtml`) và thiếu hàm `applyFiltersAndSort`. | Cô lập các module trong IIFE `(function () { ... })()`, xuất công khai `window.applyFiltersAndSort`, `window.renderProducts`, `window.addRecipeComboToCart`, `window.removeRecipeGroup`. |
| **BUG-05** | `js/storage.js`, `js/cart.js`, `css/style.css` | Giỏ hàng chưa tách rõ hàng mua lẻ và combo Recipe-to-Cart theo `recipeGroupId`; nút `-` bị disable ở SL `1` nên chưa có xác nhận `1 -> 0`; chưa hỗ trợ mã `CHAOBANMOI`. | Bổ sung `recipeGroupId` vào khóa composite item, gom combo vào hộp `.cart-group--recipe` viền `2px dashed #C88B52` kèm nút `Xóa cả combo`, mở nút `-` kích hoạt `confirm()`, thêm ô áp dụng mã `CHAOBANMOI` truyền thẳng vào đơn COD F13. |
| **BUG-06** | `css/style.css` | Ở bản chụp desktop `1366px` ban đầu của `cart.html`, cột tiêu đề `THAO TÁC` (rộng `64px`) bị ngắt xuống 2 dòng. | Nới cột 5 của `.cart-grid-head` / `.cart-item` lên `74px` kèm `white-space: nowrap`, chụp ảnh kiểm tra lại xác nhận hiển thị trên 1 dòng và `0 overflow`. |
| **BUG-07** | Tất cả 6 HTML, `js/storage.js`, `js/blog.js`, `js/product-detail.js`, `index.html`, `js/home.js` | Giao diện trang chủ dùng thẻ emoji (`🌾`, `🥣`, `🎁`, `🎂`, `🛒`, `⏱`, `📖`) thiếu tính thương mại điện tử chuyên nghiệp; banner trang chủ tĩnh. | Loại bỏ toàn bộ character emoji bằng SVG nét mảnh (cart, ticket-percent voucher, search, đồng hồ, khẩu phần); nâng cấp trang chủ thành `#hero-carousel` 3 slide + `#category-carousel` 6 Editorial Image Card tự động lướt & xoay vòng; nâng cấp Promo Ticket Bar kèm nút `.js-copy-promo`. |
| **BUG-08** | `index.html`, `images/categories/cat-packaging.jpg` | Số lượng sản phẩm trên huy hiệu Card 1 (`9 sản phẩm`) và Card 3 (`6 sản phẩm`) lệch với thực tế trong `js/products.js` (`10` Nguyên liệu / `5` Phụ kiện & Đóng gói); ảnh tạm Card 3 hiển thị túi bột mì số 8 chưa phù hợp chủ đề đóng gói. | Cập nhật huy hiệu Card 1 thành `10 sản phẩm`, Card 3 thành `5 sản phẩm` khớp kiểm thử lọc `TC-H3`; thay `cat-packaging.jpg` bằng ảnh hộp đựng bánh BakeMate (`hop-dung-banh-1.jpg`) và tối ưu icon ticket `%` rõ nét trên Promo Bar. |

---

## 4. Giới hạn hiện tại được ghi nhận

1. **Lưu trữ dữ liệu:** Giỏ hàng (`bakemate_cart`), mã ưu đãi (`bakemate_coupon`) và lịch sử đơn hàng COD (`bakemate_orders`) lưu cục bộ tại trình duyệt qua `localStorage`, chưa có Backend hay cơ sở dữ liệu máy chủ.
2. **Hình ảnh mẫu & ảnh danh mục trang chủ:** Trong 63 ảnh ở `images/products/`, một số sản phẩm mới bổ sung dùng ảnh đồ họa studio kết xuất cục bộ tạm thời; bộ ảnh danh mục `images/categories/` hiện tận dụng tạm ảnh sẵn có trong thư mục `images/` theo yêu cầu nhóm. Có thể thay thế bằng ảnh chụp thật cùng tên tệp mà không cần chỉnh sửa HTML/JS.
3. **Định danh thư mục làm việc:** Toàn bộ tài liệu đã cập nhật tên chuẩn `bakemate-ecommerce-project`; khi nộp bài/đổi tên repository GitHub hoặc nén file ZIP, nhóm cần đổi tên thư mục ngoài khớp `bakemate-ecommerce-project`.
