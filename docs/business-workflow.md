# Business Workflow Specification – Dự án BakeMate

Tài liệu đặc tả các quy trình nghiệp vụ chính của hệ thống thương mại điện tử **BakeMate**.  
Dự án tập trung giải quyết bài toán mua sắm nguyên liệu và dụng cụ làm bánh tích hợp theo công thức, tối ưu hóa trải nghiệm chuyển đổi từ nhu cầu thực tế sang giỏ hàng mua sắm trọn gói.

---

## Danh mục quy trình nghiệp vụ

| Mã quy trình | Tên quy trình nghiệp vụ | Tác nhân chính (Actors) | Chức năng liên quan |
| :---: | :--- | :--- | :---: |
| **BW-01** | Mua sắm nguyên liệu và dụng cụ theo công thức làm bánh (Recipe-to-Cart) | Khách vãng lai, Khách hàng, Hệ thống | F05 – F13 |
| **BW-02** | Xử lý đơn hàng, cập nhật tồn kho và theo dõi giao nhận (Order Fulfillment) | Khách hàng, Quản trị viên (Admin), Hệ thống | F12, F13, F16, F17, F19 |
| **BW-03** | Quản trị công thức và thiết lập ánh xạ định lượng sang SKU (Recipe & SKU Mapping) | Quản trị viên (Admin), Cơ sở dữ liệu | F04, F14, F15, F16 |

---

## 1. Quy trình BW-01: Mua sắm nguyên liệu & dụng cụ theo công thức (Recipe-to-Cart)

Đây là quy trình nghiệp vụ cốt lõi tạo nên giá trị khác biệt (Unique Value Proposition - UVP) của BakeMate so với các website bán lẻ thông thường. Quy trình hỗ trợ khách hàng tính toán định lượng tự động, chọn quy cách đóng gói phù hợp và chủ động loại trừ các vật dụng đã có sẵn ở nhà.

### 1.1. Sơ đồ luồng nghiệp vụ (Workflow Diagram)

```text
[Khách hàng]                     [Hệ thống BakeMate]                  [Cơ sở dữ liệu]
      │                                    │                                  │
      ├─── 1. Chọn công thức bánh ────────>│                                  │
      │                                    ├── 2. Truy vấn công thức & SKU ──>│
      │                                    │<── Trả dữ liệu chuẩn gốc ────────┤
      │<── 3. Hiển thị trang công thức ────┤                                  │
      │                                    │                                  │
      ├─── 4. Nhập số phần bánh mới ──────>│                                  │
      │                                    ├── 5. Quy đổi định lượng (F08)    │
      │                                    ├── 6. Khớp quy cách đóng gói (F09)│
      │                                    ├── 7. Gợi ý bộ dụng cụ (F10)      │
      │<── 8. Hiển thị Checklist mua sắm ──┤                                  │
      │                                    │                                  │
      ├─── 9. Bỏ chọn món đã có sẵn ──────>│                                  │
      ├─── 10. Bấm "Thêm vào giỏ hàng" ───>│                                  │
      │                                    ├── 11. Kiểm tra tồn kho khả dụng ─>│
      │                                    ├── 12. Khởi tạo/Cập nhật giỏ hàng │
      │<── 13. Thông báo thành công ───────┤                                  │
      │                                    │                                  │
      ├─── 14. Tiến hành Checkout ────────>│                                  │
      │                                    ├── 15. Tạo đơn hàng (Trạng thái Mới)
      │<── 16. Xác nhận đơn & Mã tra cứu ──┤                                  │
