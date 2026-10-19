# BakeMate - Nguyên liệu và dụng cụ làm bánh theo công thức

## 1. Giới thiệu
BakeMate là website thương mại điện tử chuyên kinh doanh nguyên liệu làm bánh (bột mì, đường, bột cacao, chocolate, bơ, kem tươi...) và dụng cụ làm bánh (khuôn bánh, phới lồng, cân điện tử, spatula, giấy nến...), kết hợp kho công thức làm bánh thông minh.

Vấn đề kinh doanh cần giải quyết:
Khách hàng, đặc biệt là người mới bắt đầu làm bánh tại nhà, thường gặp khó khăn khi xác định đầy đủ danh mục nguyên liệu và dụng cụ cần thiết cho từng món bánh. Khi muốn thay đổi số phần bánh, việc tự tính toán lại định lượng dễ gây nhầm lẫn khiến bánh không đạt chuẩn. Khách hàng cũng khó chọn quy cách đóng gói phù hợp với lượng cần dùng, dẫn đến việc mua thiếu hoặc mua dư gây lãng phí. Ngoài ra, việc tìm kiếm từng sản phẩm riêng lẻ tốn nhiều thời gian và gây khó khăn trong việc ước tính tổng chi phí trước khi làm bánh.

Website giải quyết vấn đề bằng cách cho phép khách hàng chọn công thức, điều chỉnh số phần bánh để hệ thống tự động tính lại định lượng nguyên liệu. Hệ thống đối chiếu lượng cần dùng với quy cách đóng gói thực tế đang bán, hiển thị số lượng cần mua và chi phí dự kiến. Khách hàng có thể bỏ chọn các món đã có sẵn tại nhà, chọn thêm dụng cụ cần thiết và đưa toàn bộ sản phẩm vào giỏ hàng để đặt mua trực tiếp.

## 2. Khách hàng mục tiêu
- Người mới học làm bánh.
- Sinh viên và người trẻ yêu thích tự làm bánh tại nhà.
- Người thường xuyên tự làm bánh cho gia đình, bạn bè hoặc chuẩn bị cho các dịp đặc biệt.

## 3. Chức năng chính
1. Hiển thị trang chủ.
2. Hiển thị danh mục sản phẩm.
3. Tìm kiếm, lọc và sắp xếp sản phẩm.
4. Hiển thị trang chi tiết sản phẩm.
5. Hiển thị danh sách công thức làm bánh.
6. Hiển thị chi tiết công thức.
7. Điều chỉnh số phần bánh cần làm.
8. Tự động tính toán định lượng nguyên liệu theo số phần bánh.
9. Ghép nguyên liệu trong công thức với quy cách đóng gói sản phẩm.
10. Gợi ý dụng cụ làm bánh phù hợp với công thức.
11. Tạo giỏ hàng nguyên liệu trực tiếp từ công thức.
12. Chỉnh sửa số lượng sản phẩm trong giỏ hàng.
13. Đăng ký và đăng nhập tài khoản.
14. Quản lý giỏ hàng.
15. Đặt hàng và thanh toán (checkout).
16. Áp dụng voucher và mã giảm giá.
17. Tính phí vận chuyển.
18. Hỗ trợ các phương thức thanh toán.
19. Theo dõi và quản lý đơn hàng.
20. Đánh giá sản phẩm.
21. Quản trị sản phẩm, danh mục sản phẩm, công thức làm bánh, tồn kho, khách hàng, đơn hàng, khuyến mãi.

## 4. Thành viên

| STT | Họ và tên | Vai trò | Trách nhiệm và công việc phụ trách |
| :---: | :--- | :--- | :--- |
| 1 | **Trần Thị Bảo Ngọc** | Project Manager (PM) & BA | Điều phối công việc nhóm, theo dõi tiến độ, quản lý GitHub và phân tích nghiệp vụ. |
| 2 | **Trần Lê Như Hậu** | Business Analyst (BA) | Khảo sát nhu cầu khách hàng, xác định yêu cầu chức năng và viết tài liệu đặc tả. |
| 3 | **Phạm Hoài Thương** | QA & Tester | Lập kế hoạch kiểm thử, thiết kế kịch bản kiểm thử (Test Cases), kiểm thử luồng chức năng và báo cáo lỗi. |
| 4 | **Hồ Gia Bảo** | QA & Documentation / Developer | Kiểm soát chất lượng tài liệu dự án, hỗ trợ thiết kế cơ sở dữ liệu và lập trình Backend. |
| 5 | **Vũ Ngọc Minh Thư** | UI/UX Designer | Thiết kế giao diện website trên Figma, chuẩn bị hình ảnh minh họa và tài nguyên đồ họa. |
| 6 | **Siu Đen Ny** | Frontend Developer | Xây dựng giao diện web bằng HTML/CSS/JavaScript, đảm bảo responsive trên mobile và desktop. |
| 7 | **Dương Thúy Hiền** | Backend Developer | Thiết kế cơ sở dữ liệu (ERD), viết API và xử lý logic lưu trữ phía máy chủ. |
| 8 | **Nguyễn Hoài Thương** | Fullstack / Backend Developer | Lập trình logic tính toán định lượng theo khẩu phần, ghép nối SKU vào giỏ hàng và tối ưu luồng xử lý. |

## 5. Công nghệ dự kiến
- Frontend: HTML5, CSS3, JavaScript, Bootstrap 5.
- Backend: Laravel (PHP) hoặc ASP.NET Core MVC.
- Cơ sở dữ liệu: MySQL hoặc SQL Server.
- Quản lý phiên bản và tiến độ: Git, GitHub.

## 6. Kế hoạch thực hiện

| Giai đoạn | Thời gian | Nội dung công việc chính |
| :--- | :---: | :--- |
| **Giai đoạn 1** | Tuần 1 | Khảo sát thị trường, lựa chọn đề tài, phân tích 3 website tương tự và khởi tạo tài liệu nền tảng trên GitHub. |
| **Giai đoạn 2** | Tuần 2 - 3 | Thiết kế wireframe, prototype trên Figma và thiết kế mô hình thực thể quan hệ cơ sở dữ liệu (ERD). |
| **Giai đoạn 3** | Tuần 4 - 5 | Xây dựng giao diện Frontend các trang chính; thiết lập Backend CRUD cho sản phẩm, danh mục và công thức. |
| **Giai đoạn 4** | Tuần 6 | Hiện thực hóa thuật toán cốt lõi: Tính toán lại định lượng theo Servings và ghép nối SKU quy cách đóng gói vào giỏ hàng. |
| **Giai đoạn 5** | Tuần 7 | Tích hợp hệ thống, kiểm thử luồng mua hàng (Functional Testing), kiểm tra bảo mật cơ bản và sửa lỗi. |
| **Giai đoạn 6** | Tuần 8 | Triển khai website lên môi trường chạy thực tế, hoàn thiện báo cáo đồ án và chuẩn bị bảo vệ trước hội đồng. |

## 7. Liên kết
- Bảng yêu cầu: [REQUIREMENTS.md](REQUIREMENTS.md)
- Kế hoạch: [PROJECT_PLAN.md](PROJECT_PLAN.md)
- Phân tích website: [docs/competitor-analysis.md](docs/competitor-analysis.md)
- Quy tắc hướng dẫn AI: [AGENTS.md](AGENTS.md)
- Nhật ký sử dụng AI: [AI_USAGE_LOG.md](AI_USAGE_LOG.md)
- Quy trình nghiệp vụ: [docs/business-workflow.md](docs/business-workflow.md)
