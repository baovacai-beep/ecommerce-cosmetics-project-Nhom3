# BakeMate – Website Thương Mại Điện Tử Nguyên Liệu & Dụng Cụ Làm Bánh

> **Môn học:** Phát triển ứng dụng Web / Thương mại điện tử (UEH)
> **Giảng viên hướng dẫn:** TS. Nguyễn Mạnh Tuấn (tuannm@ueh.edu.vn)
> **Nhóm thực hiện:** Nhóm 3
> **Giai đoạn:** Buổi 2 – Triển khai giao diện tĩnh (HTML5 & CSS3)

---

## 1. Giới thiệu dự án
BakeMate là website thương mại điện tử chuyên kinh doanh nguyên liệu và dụng cụ làm bánh theo giải pháp cốt lõi "Lấy công thức làm trung tâm" (Recipe-to-Cart). Dự án giải quyết các rào cản thường gặp của người mới làm bánh:
- Tiếp cận quy trình làm bánh từ món bánh muốn thực hiện thay vì tìm kiếm nguyên liệu rời rạc.
- Đối chiếu công thức với quy cách đóng gói nhỏ nhất vừa đủ dùng, hạn chế tối đa việc mua thiếu hoặc dư thừa nguyên liệu gây lãng phí.
- Tích hợp liên kết hai chiều giữa nguyên liệu và kho công thức làm bánh (UVP).

Trong khuôn khổ Buổi 2, nhóm đã hoàn thành toàn bộ khung giao diện tĩnh đa trang, đảm bảo tính nhất quán về thẩm mỹ, đúng chuẩn thẻ ngữ nghĩa HTML5 và tối ưu khả năng tương thích trên nhiều thiết bị.

---

## 2. Cấu trúc thư mục dự án
Hệ thống mã nguồn được tổ chức theo cấu trúc chuẩn web tĩnh:

* index.html: Trang chủ (Header sticky, Hero Banner, Khám phá thương hiệu)
* products.html: Danh sách sản phẩm (Lưới 9 nguyên liệu làm bánh cơ bản)
* product-detail.html: Chi tiết sản phẩm (Bột mì số 13, chọn quy cách, khối UVP)
* about.html: Giới thiệu (Câu chuyện, điểm khác biệt, quy trình, thông tin liên hệ)
* css/style.css: Tệp CSS dùng chung toàn hệ thống (Design tokens, Grid, Flexbox)
* images/: Thư mục hình ảnh sản phẩm, banner, logo và hình minh họa
* docs/: Tài liệu thiết kế giao diện (ui-design.md, wireframe)
* README.md: Tài liệu hướng dẫn và mô tả dự án

---

## 3. Danh sách các trang giao diện
1. Trang chủ (index.html):
   - Thanh Header cố định (position: sticky) chứa Logo thương hiệu, Menu điều hướng 3 trang, Ô tìm kiếm và biểu tượng giỏ hàng.
   - Khối Hero Banner với thông điệp "Làm bánh chuẩn vị - Nguyên liệu chuẩn tay" cùng 2 nút kêu gọi hành động (CTA: Khám phá sản phẩm / Về BakeMate).
   - Khối giới thiệu định vị giải pháp mua nguyên liệu theo công thức bánh.
2. Trang danh sách sản phẩm (products.html):
   - Hiển thị 9 mặt hàng nguyên liệu làm bánh cơ bản (Bột bắp, Bột mì, Bột Tartar, Bột vani, Dầu ăn, Đường, Muối, Sữa tươi, Trứng).
   - Bố cục lưới CSS Grid đồng bộ, mỗi thẻ bao gồm hình ảnh vuông chuẩn 1:1, tên sản phẩm, giá niêm yết và nút xem chi tiết.
3. Trang chi tiết sản phẩm (product-detail.html):
   - Bố cục 2 cột cân xứng: Media Gallery bên trái; thông tin sản phẩm, bộ chọn quy cách đóng gói (Gói 500g / 1kg), bộ điều chỉnh số lượng và nút mua hàng bên phải.
   - Bảng thông số kỹ thuật và hướng dẫn bảo quản nguyên liệu.
   - Khối UVP độc quyền BakeMate: Gợi ý các công thức bánh tương thích với nguyên liệu (Bánh mì hoa cúc, Baguette, Pizza).
   - Khối danh sách sản phẩm mua kèm thường gặp.
4. Trang giới thiệu cửa hàng (about.html):
   - Banner giới thiệu sứ mệnh thương hiệu.
   - Phân đoạn nội dung trực quan: Câu chuyện hình thành, 4 điểm khác biệt cốt lõi, 3 nhóm khách hàng mục tiêu, quy trình mua sắm 4 bước và thông tin liên hệ kèm bản đồ minh họa.

---

## 4. Công nghệ và kỹ thuật sử dụng
- HTML5 Semantic: Cấu trúc phân đoạn ngữ nghĩa rõ ràng bằng header, nav, main, section, article, figure, footer.
- Hệ thống Design Tokens (CSS Variables):
  - Màu chủ đạo (Primary): #70452B (Nâu bánh nướng).
  - Màu nền chính (Background): #FFF8ED (Kem sáng dịu mắt).
  - Màu phụ (Secondary): #F2D9A6 (Vàng kem).
  - Điểm nhấn & CTA: #F59E0B (Vàng mật ong).
  - Phông chữ chủ đạo: 'Be Vietnam Pro', sans-serif.
- CSS Grid & Flexbox:
  - Flexbox: Áp dụng cho các bố cục 1 chiều (Header, Navigation bar, Action buttons, Breadcrumb).
  - CSS Grid: Áp dụng cho các bố cục 2 chiều đa cột (Lưới 4 cột danh sách sản phẩm, bố cục 2 cột trang chi tiết).
- Trải nghiệm tương tác & Hỗ trợ tiếp cận:
  - Hiệu ứng :hover nâng nhẹ thẻ (translateY(-4px)), chuyển màu nền mượt mà qua thuộc tính transition: 0.25s ease.
  - Hỗ trợ duyệt phím Tab với :focus-visible (viền nổi bật màu vàng mật ong, cách mép 3px).
- Responsive Web Design: Tương thích trên 3 độ rộng quy chuẩn:
  - Máy tính: 1366px (bố cục đa cột dàn ngang đầy đủ).
  - Máy tính bảng: 768px (menu điều hướng rớt dòng, danh sách sản phẩm chuyển về 2 cột).
  - Điện thoại di động: 390px (tối ưu ô tìm kiếm co giãn, nút bấm mở rộng toàn màn hình).

---

## 5. Cách mở và chạy website
Dự án được xây dựng hoàn toàn bằng HTML5 và CSS3 tĩnh, không yêu cầu cài đặt môi trường server hay cấu hình cơ sở dữ liệu:
- Cách 1 (Mở trực tiếp): Tải thư mục mã nguồn về máy hoặc giải nén tệp .zip, nhấp đúp vào tệp index.html để mở bằng trình duyệt web.
- Cách 2 (Mở qua Live Server): Mở thư mục dự án trong Visual Studio Code, nhấp chuột phải vào index.html và chọn Open with Live Server.

---

## 6. Cách kiểm tra giao diện Responsive
1. Mở trang web trên trình duyệt Google Chrome.
2. Nhấn phím F12 để mở công cụ Chrome DevTools.
3. Nhấn tổ hợp phím Ctrl + Shift + M để bật thanh công cụ giả lập thiết bị (Toggle Device Toolbar).
4. Lựa chọn các độ rộng màn hình quy chuẩn để kiểm tra:
   - 1366px: Kiểm tra hiển thị đầy đủ menu, banner và lưới 4 cột sản phẩm.
   - 768px: Kiểm tra menu xuống hàng và lưới sản phẩm thu về 2 cột trên máy tính bảng.
   - 390px: Kiểm tra ô tìm kiếm co giãn linh hoạt, các khối nội dung xếp dọc không bị lỗi tràn mép ngang (overflow-x).

---

## 7. Những hạn chế hiện tại
- Chưa có mã JavaScript xử lý lọc sản phẩm thực tế theo từ khóa trên ô tìm kiếm.
- Chưa có JavaScript để chuyển đổi ảnh lớn khi click vào ảnh thu nhỏ (thumbnails) trên trang chi tiết sản phẩm.
- Các nút tăng giảm số lượng, chọn quy cách đóng gói và giỏ hàng mới dừng ở mức thể hiện giao diện tĩnh.
- Chưa kết nối cơ sở dữ liệu backend và chưa có quy trình đặt hàng/thanh toán trực tuyến thực tế.
