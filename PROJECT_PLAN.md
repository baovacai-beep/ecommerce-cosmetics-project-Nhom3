# PROJECT PLAN – BakeMate (`bakemate-ecommerce-project`)

## 1. Thành viên và vai trò

| Thành viên | Vai trò chính | Trách nhiệm tổng quát & Module Buổi 3 |
|---|---|---|
| Hồ Gia Bảo | Tech Lead / Core Architecture / QA Docs | Thiết kế kiến trúc JS mô-đun hóa (`js/storage.js`), chuẩn hóa `bakemate_cart` (`recipeGroupId`), mã giảm giá `CHAOBANMOI`, điều phối Git/PR & tài liệu tổng hợp. |
| Trần Thị Bảo Ngọc | Project Manager / BA / Data Lead | Điều phối tiến độ nhóm, chuẩn hóa dữ liệu 21 sản phẩm & 3 danh mục (`js/products.js`), kiểm soát phạm vi `REQUIREMENTS.md`. |
| Vũ Ngọc Minh Thư | UI/UX Designer / Frontend Filter | Thiết kế hệ thống Design Tokens (`css/style.css`), triển khai `js/search-filter.js` (`renderProducts`, `applyFiltersAndSort`) và giao diện `products.html`. |
| Nguyễn Hoài Thương | Frontend Developer | Triển khai `js/product-detail.js`, gallery đa ảnh cho 21 mặt hàng, quy cách đóng gói `100g–1kg`, khối Recipe Cross-link và kiểm tra ID URL. |
| Siu Đen Ny | UI/UX & Cart Developer | Thiết kế và lập trình `cart.html`, `js/cart.js` (bảng giỏ hàng, nhóm viền nét đứt `recipeGroupId`, đồng bộ `bakemate_cart`). |
| Dương Thúy Hiền | Cart & Checkout Developer (F12, F13) | Hoàn thiện tương tác giỏ hàng F12, luồng kiểm tra form đặt hàng COD (F13), lịch sử đơn hàng và tích hợp `CHAOBANMOI`. |
| Trần Lê Như Hậu | BA / Blog Content & Recipe Integration | Soạn nội dung công thức, kết nối giải pháp Recipe-to-Cart trên `blog.html` & `js/blog.js`, hỗ trợ tài liệu nghiệp vụ. |
| Phạm Hoài Thương | QA Tester & Bug Verification | Lập bảng nghiệm thu 14 Test Cases (`docs/test-report.md`), kiểm thử hồi quy, đối chiếu Responsive (`1366/768/390px`) và báo cáo lỗi đã fix. |

---

## 2. Bảng phân công chi tiết Buổi 3 (Theo tiến độ chuẩn 8 bước)

| Bước công việc | Nhiệm vụ chính | Tệp mã nguồn / Đầu ra | Thành viên phụ trách | Điều kiện phụ thuộc | Tiêu chí nghiệm thu (Acceptance Criteria) | Trạng thái |
|---|---|---|---|---|---|---|
| Bước 1. Kiến trúc & Phân công module | Thiết lập quy ước đặt tên (`camelCase`, `UPPER_SNAKE_CASE`, `kebab-case`), khóa `bakemate_cart`, cấu trúc thư mục `js/` và thứ tự nạp script. | `docs/ui-design.md`, `PROJECT_PLAN.md` | Gia Bảo, Bảo Ngọc | Thống nhất Design System Buổi 2 | Mọi script tách IIFE không xung đột biến toàn cục; khóa `bakemate_cart` dùng chung mọi trang. | Hoàn tất |
| Bước 2. Chuẩn hóa dữ liệu & Render danh sách | Chuẩn hóa 21 sản phẩm (6 trường, 3 danh mục), bổ sung 63 ảnh trong `images/products/`, viết `renderProducts()`. | `js/products.js`, `images/products/*`, `products.html` | Bảo Ngọc | Cấu trúc thẻ `.product-card` đạt chuẩn | 21 sản phẩm hiển thị đúng ảnh/giá/danh mục, không lỗi 404 ảnh, định dạng tiền tệ VND. | Hoàn tất |
| Bước 3. Tìm kiếm, Lọc & Sắp xếp động | Lập trình tìm kiếm không dấu, lọc 3 danh mục, sắp xếp giá tăng/giảm bất biến `[...products]`, đọc `?q=` & `?category=`. | `js/search-filter.js` (`applyFiltersAndSort()`) | Minh Thư, Nguyễn Thương | `js/products.js` sẵn sàng | Kết hợp đồng thời từ khóa + danh mục + sắp xếp; không sửa mảng gốc; hiện Empty State khi 0 kết quả. | Hoàn tất |
| Bước 4. Trang chi tiết sản phẩm động | Đọc `URLSearchParams`, gallery 3 ảnh, chọn quy cách (`100g/300g/500g/1kg`), Recipe Cross-link & fallback khi ID sai. | `product-detail.html`, `js/product-detail.js` | Nguyễn Thương | `products.js` & `storage.js` | Đủ thông tin cho ID `1..21`, đổi giá tức thì theo pill quy cách, ID sai báo lỗi thân thiện. | Hoàn tất |
| Bước 5. Giao diện & Chức năng giỏ hàng + F13 | Bảng giỏ hàng nhóm `recipeGroupId` viền nét đứt caramel, xác nhận `1->0`, mã `CHAOBANMOI` (-10%), form COD F13. | `cart.html`, `js/cart.js`, `css/style.css` | Đen Ny, Hiền | `js/storage.js` | Hàng lẻ tách khỏi combo công thức; giảm `1->0` hỏi xác nhận; F13 tạo mã đơn `#BM-XXXXXX`. | Hoàn tất |
| Bước 6. Tích hợp `localStorage` & Blog | Hàm `addToCart`, `addRecipeComboToCart`, `removeRecipeGroup`, đồng bộ Header badge mọi trang & hoàn thiện `blog.html`. | `js/storage.js`, `blog.html`, `js/blog.js`, 6 file HTML | Gia Bảo, Đen Ny, Như Hậu | Đồng bộ cấu trúc Header/Footer | F5 giữ nguyên giỏ hàng; Header trang Giỏ hàng không tô active `Sản phẩm`; `blog.html` thêm được combo. | Hoàn tất |
| Bước 7. Tích hợp, Kiểm thử & Tối ưu UI | Chạy kiểm thử toàn trình 14 Test Cases, kiểm tra 404 ảnh/liên kết, Responsive `1366/768/390px` và ghi nhật ký fix lỗi. | `docs/test-report.md` | Phạm Thương | Hoàn thành Bước 2–6 | 100% ảnh & link hợp lệ, không vỡ bố cục 3 màn hình, 14 Test Cases đạt chuẩn. | Đang hoàn tất |
| Bước 8. Quản lý GitHub & Hồ sơ bàn giao | Rà soát `README.md`, `ui-design.md`, `AI_USAGE_LOG.md`, kiểm tra sạch sẽ repository `bakemate-ecommerce-project`. | `README.md`, `AI_USAGE_LOG.md`, nhánh tích hợp | Gia Bảo | Nghiệm thu Bước 7 | Tài liệu đồng bộ với mã nguồn thực tế, sẵn sàng trình bày và nộp bài. | Đang hoàn tất |

---

## 3. Rủi ro và phương án xử lý

| Rủi ro | Ảnh hưởng | Phương án xử lý |
|---|---|---|
| Trùng tên biến toàn cục khi gộp nhiều tệp JS | Lỗi `Identifier already been declared` làm sập script | Bọc toàn bộ controller trong IIFE `(function () { ... })()` và chỉ gắn API cần thiết lên `window`. |
| Mất đồng bộ giá khi có nhiều quy cách đóng gói | Sai tổng tiền giỏ hàng / đơn hàng F13 | Quy định index `0` của `PRODUCT_PACKAGING_OPTIONS` luôn khớp `product.price` và tính lại giá ở phía `cart.js` trước khi lưu đơn. |
| Người dùng nhập URL sản phẩm sai hoặc trống | Trang chi tiết bị trống hoặc lỗi JS `Cannot read property` | Kiểm tra `if (!product)` đầu luồng, ẩn các khối phụ và hiển thị thông báo kèm nút quay về `products.html`. |
| Xung đột CSS khi hiển thị nhóm Combo trên Mobile | Tràn ngang (`overflow-x`) ở màn hình `390px` | Sử dụng CSS Grid chuyển đổi về bố cục thẻ dọc `@media (max-width: 768px)` cho từng `.cart-item`. |
