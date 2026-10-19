# Project Plan – Dự án BakeMate

Dự án: **BakeMate – Hệ thống thương mại điện tử cung cấp nguyên liệu và dụng cụ làm bánh theo công thức**  
Học phần: **Phát triển ứng dụng Thương mại điện tử** – Giảng viên hướng dẫn: **TS. Nguyễn Mạnh Tuấn**  
Đơn vị: **Khoa Công nghệ thông tin kinh doanh – Trường Công nghệ và Thiết kế UEH**  
Thời gian thực hiện: **8 tuần** (Học kỳ cuối năm 2026) – Quy mô: **Nhóm 3 (8 thành viên)**

---

## 1. Thành viên và vai trò dự án

Căn cứ vào danh sách phân nhóm lớp học phần, cơ cấu phân công trách nhiệm của Nhóm 3 được thiết lập đảm bảo mỗi thành viên đều có vai trò chủ chốt, sản phẩm đầu ra độc lập và phối hợp chặt chẽ theo mô hình Agile/Scrum:

| STT | Họ và tên | Mã sinh viên | Vai trò chính | Trách nhiệm cụ thể trong dự án |
| :---: | :--- | :---: | :--- | :--- |
| 1 | **Trần Thị Bảo Ngọc** | 31241025665 | **Trưởng nhóm / Project Coordinator** | Điều phối tiến độ tổng thể, quản trị GitHub Repository, phân rã và giao việc qua GitHub Issues, kiểm duyệt Pull Request vào nhánh `main`. |
| 2 | **Hồ Gia Bảo** | 31241023360 | **Backend Lead / Planning Specialist** | Chịu trách nhiệm lập kế hoạch dự án (`PROJECT_PLAN.md`), thiết kế cấu trúc API xử lý thuật toán quy đổi định lượng (F08) và logic ghép nối SKU (F09). |
| 3 | **Dương Thúy Hiền** | 31241024221 | **Business Analyst / QA & Testing** | Đồng phụ trách kế hoạch dự án, phân tích yêu cầu kỹ thuật, xây dựng kịch bản kiểm thử (Test Cases) cho luồng mua hàng và nghiệm thu chức năng. |
| 4 | **Trần Lê Như Hậu** | 31241027195 | **UI/UX Designer / Frontend Dev** | Thiết kế Wireframe/Prototype trên Figma, xây dựng Design System, lập trình giao diện Trang chủ (F01) và Trang công thức làm bánh (F05, F06). |
| 5 | **Siu Đen Ny** | 31241026935 | **System Analyst / Backend Dev** | Mô tả luồng nghiệp vụ (`business-workflow.md`), giám sát tài liệu AI (`AI_USAGE_LOG.md`), lập trình module Giỏ hàng (F12) và Đặt hàng COD/QR (F13). |
| 6 | **Vũ Ngọc Minh Thư** | 31241026051 | **Frontend Developer / Content Lead** | Đặc tả tài liệu yêu cầu (`REQUIREMENTS.md`), lập trình giao diện Danh mục sản phẩm (F02) và Bộ lọc đa thuộc tính (F03), chuẩn hóa dữ liệu hình ảnh. |
| 7 | **Nguyễn Thị Hoài Thương** | 31241026283 | **Database Architect / Backend Dev** | Thiết kế sơ đồ thực thể liên kết ERD, triển khai CSDL quan hệ (MySQL/SQL Server), lập trình các chức năng quản trị Admin CRUD Catalog & Tồn kho (F14, F16). |
| 8 | **Phạm Hoài Thương** | 31241025110 | **UI/UX & Frontend Developer** | Khảo sát đối thủ cạnh tranh (`competitor-analysis.md`), hỗ trợ soạn thảo `README.md`, lập trình giao diện Chi tiết sản phẩm (F04) và tối ưu Responsive Mobile. |

---

## 2. Các giai đoạn thực hiện (Project Milestones)

Dự án được triển khai xuyên suốt 8 tuần, chia làm 6 giai đoạn nối tiếp nhau nhằm đảm bảo phiên bản khả dụng tối thiểu (MVP) được vận hành ổn định trước khi hoàn thiện báo cáo:

```text
[Tuần 1] ──> [Tuần 2] ──> [Tuần 3 - 4] ──> [Tuần 5 - 6] ──> [Tuần 7] ──> [Tuần 8]
Khảo sát &   Thiết kế     Phát triển      Phát triển        Tích hợp &    Triển khai &
Xác định     Giao diện    Frontend &      Backend &         Kiểm thử      Báo cáo
Yêu cầu      UI/UX        Client Logic    Cơ sở dữ liệu     Toàn diện     Nghiệm thu
