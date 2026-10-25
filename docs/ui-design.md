# BakeMate – UI Design & Architecture Guidelines

Tài liệu quy chuẩn cấu trúc mã nguồn, hệ thống thành phần dùng chung và nguyên tắc phối hợp giao diện cho dự án **BakeMate** (Học phần Phát triển ứng dụng TMĐT – UEH).

---

## 1. Cấu trúc thư mục dự án (Directory Architecture)

Hệ thống được tổ chức theo mô hình web tĩnh chuẩn mực phục vụ giai đoạn phát triển giao diện HTML5 & CSS3:

```text
ecommerce-cosmetics-project-Nhom3/
├── index.html              # Trang chủ: Banner, công thức nổi bật, sản phẩm bán chạy
├── products.html           # Danh mục sản phẩm: Lưới hiển thị nguyên liệu & dụng cụ (>= 8 SP)
├── product-detail.html     # Chi tiết sản phẩm: Ảnh lớn, thông số đóng gói, nút đặt mua
├── about.html              # Giới thiệu: Câu chuyện thương hiệu, giá trị cốt lõi, liên hệ
├── css/
│   └── style.css           # Bảng quy tắc định dạng giao diện dùng chung toàn website
├── images/                 # Kho tài nguyên đa phương tiện (Ảnh banner, ảnh sản phẩm, logo)
│   ├── banner.jpg
│   ├── product-1.jpg
│   └── ...
├── docs/                   # Hồ sơ tài liệu thiết kế và quy trình nghiệp vụ
│   ├── ui-design.md        # Bản đặc tả quy chuẩn giao diện và cấu trúc dự án
│   ├── competitor-analysis.md
│   └── business-workflow.md
├── README.md               # Giới thiệu tổng quan dự án và hướng dẫn vận hành
├── REQUIREMENTS.md         # Bảng đặc tả 28 yêu cầu chức năng (F01 - F28)
├── PROJECT_PLAN.md         # Phân công công việc và tiến độ 8 tuần của nhóm
└── AGENTS.md               # Quy định hướng dẫn AI hỗ trợ dự án
