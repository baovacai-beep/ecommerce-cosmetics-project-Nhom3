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
```
## 2. Hệ thống thành phần dùng chung (Design System & Reusable Components)

Nhằm đảm bảo 4 trang HTML có nhận diện thương hiệu nhất quán và mã nguồn không bị phân mảnh, nhóm thống nhất áp dụng các tiêu chuẩn thiết kế sau:

### 2.1. Bảng màu thương hiệu (Color Palette)

| Phân nhóm màu | Mã màu (Hex) | Mô tả ứng dụng thực tế |
| :--- | :---: | :--- |
| **Màu chủ đạo (Primary)** | `#b45309` | Sắc nâu hổ phách ấm áp – màu sắc đặc trưng của bánh nướng; dùng cho Header, logo và các nút bấm hành động chính. |
| **Màu phụ trợ (Secondary/Accent)** | `#f59e0b` / `#dc2626` | Vàng tươi mật ong (`#f59e0b`) dùng cho điểm nhấn và đánh giá sao; Đỏ nổi bật (`#dc2626`) dành riêng cho giá khuyến mãi và nhãn giảm giá (`badge`). |
| **Màu trung tính (Neutrals)** | `#fafaf9` / `#292524` / `#e7e5e4` | Nền web trắng ngà (`#fafaf9`), chữ chính xám than (`#292524`) đảm bảo độ tương phản cao, màu viền thẻ mềm mại (`#e7e5e4`). |

---

### 2.2. Khung điều hướng chuẩn (Global Header & Navigation)

* Mọi trang HTML trong dự án bắt buộc sử dụng chung cấu trúc khối: `<header class="site-header">`.
* Menu điều hướng (`<nav>`) bắt buộc chứa đầy đủ 4 liên kết trỏ chính xác đến các file HTML nằm tại thư mục gốc:
  * `index.html` — Trang chủ
  * `products.html` — Danh sách sản phẩm
  * `product-detail.html` — Chi tiết sản phẩm
  * `about.html` — Giới thiệu cửa hàng

---

### 2.3. Quy chuẩn thẻ sản phẩm (Product Card Component)

* **Cấu trúc bao ngoài:** Mỗi sản phẩm được đóng gói độc lập trong thẻ ngữ nghĩa HTML5: `<article class="product-card">`.
* **Khung ảnh chuẩn hóa:** Khung ảnh đại diện cố định tỉ lệ vuông `aspect-ratio: 1 / 1` kết hợp thuộc tính `object-fit: cover` để hình ảnh tự động lấp đầy khung mà không bị méo tỉ lệ.
* **Tiêu đề sản phẩm:** Khống chế hiển thị tối đa 2 dòng bằng thuộc tính `-webkit-line-clamp: 2`, kết hợp `overflow: hidden` và `min-height` để đảm bảo các thẻ nằm trên cùng một hàng luôn bằng nhau về chiều cao.

---

## 3. Quy ước kỹ thuật và kiểm soát tích hợp

* **Quy tắc đường dẫn tương đối (Relative Path):**  
  Toàn bộ liên kết file CSS và hình ảnh trong mã HTML bắt buộc phải sử dụng đường dẫn tương đối (ví dụ: `css/style.css`, `images/product-1.jpg`). Tuyệt đối không dùng đường dẫn tuyệt đối của máy tính cá nhân (như `C:/Users/...` hoặc `D:/...`) để tránh lỗi gãy liên kết khi đưa lên GitHub Pages.

* **Quy tắc đặt tên Class CSS:**  
  Đặt tên rõ nghĩa bằng tiếng Anh, viết toàn bộ bằng chữ thường và phân tách các từ bằng dấu gạch ngang (`kebab-case`). Tránh đặt tên chung chung, mơ hồ như `.box`, `.item`, `.text`.

* **Quy trình làm việc với Git:**  
  Khi phát triển tính năng mới hoặc dựng giao diện từng trang, thành viên không commit trực tiếp lên nhánh `main` mà phải tạo nhánh riêng (ví dụ: `feature/products-page`). Sau khi kiểm thử giao diện trên trình duyệt cá nhân đạt chuẩn, thành viên mới tạo Pull Request để nhóm review và hợp nhất vào nhánh chính.
