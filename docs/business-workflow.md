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
```
### 1.2. Các bước thực hiện chi tiết

1. **Khám phá và chọn món bánh:**  
   Khách hàng duyệt thư viện công thức (F05) theo bộ lọc (độ khó, thời gian, loại bánh) và chọn món bánh dự kiến thực hiện (ví dụ: *Bánh Tiramisu truyền thống*).

2. **Tải thông tin chi tiết:**  
   Hệ thống truy xuất dữ liệu từ CSDL và hiển thị trang chi tiết công thức (F06) gồm: số phần bánh gốc ($S_{gốc} = 4$), các bước làm bánh kèm danh sách nguyên liệu định lượng chuẩn và bộ dụng cụ đề xuất.

3. **Tùy chỉnh khẩu phần làm bánh (Servings):**  
   Khách hàng nhập số phần bánh thực tế muốn làm (ví dụ: $S_{mới} = 8$ phần).

4. **Quy đổi định lượng tự động:**  
   Hệ thống áp dụng thuật toán tỷ lệ tức thì ở phía Client/Server:

   $$\text{Định lượng mới} = \text{Định lượng gốc} \times \left( \frac{S_{mới}}{S_{gốc}} \right)$$

   > **Ví dụ:** Công thức gốc 4 phần cần $200\text{g}$ Mascarpone $\rightarrow$ Đổi thành 8 phần cần đúng $400\text{g}$ Mascarpone.

5. **Khớp quy cách đóng gói thương mại (SKU Mapping):**  
   Hệ thống quét danh mục sản phẩm đang mở bán để khớp lượng nguyên liệu cần dùng với quy cách đóng gói nhỏ nhất thỏa mãn nhu cầu:
   * **Nhu cầu:** $400\text{g}$ Mascarpone.
   * **Quy cách bán tại kho:** Hộp $250\text{g}$ và Hộp $500\text{g}$.
   * **Logic đề xuất:** Hệ thống gợi ý chọn 01 hộp $500\text{g}$ (hoặc 02 hộp $250\text{g}$ theo thuật toán tối ưu tổng chi phí), hiển thị rõ:
     * *Lượng cần dùng:* $400\text{g}$
     * *Quy cách mua:* $500\text{g}$
     * *Lượng dư dự kiến:* $100\text{g}$

6. **Hiển thị bảng chọn nguyên liệu và dụng cụ (Interactive Checklist):**  
   Hệ thống hiển thị toàn bộ nguyên liệu kèm sản phẩm bán tương ứng, và danh sách dụng cụ cần thiết (phới lồng, khuôn bánh, cân tiểu ly). Tất cả các mục mặc định được tích chọn sẵn.

7. **Khách hàng lọc bỏ các món đã sở hữu:**  
   Khách hàng bỏ tích chọn (uncheck) ở các mục nhà đã có sẵn (ví dụ: đã có sẵn đường tinh luyện và cân điện tử). Chi phí tạm tính tự động trừ các món này ra.

8. **Đưa vào giỏ hàng:**  
   Khách hàng nhấn *"Thêm các món đã chọn vào giỏ hàng"* (F11). Hệ thống kiểm tra số lượng tồn kho thực tế, nếu hợp lệ sẽ đẩy trực tiếp các SKU vào giỏ hàng (F12) mà không làm gián đoạn việc xem công thức.

9. **Đặt hàng (Checkout):**  
   Khách hàng chuyển sang trang Giỏ hàng, kiểm tra lại danh sách, nhập thông tin nhận hàng, chọn phương thức thanh toán (COD hoặc chuyển khoản qua mã VietQR) và nhấn *"Xác nhận đặt hàng"* (F13).

---

### 1.3. Các trường hợp ngoại lệ và xử lý lỗi

* **Số phần bánh nhập không hợp lệ:**  
  Nếu khách hàng nhập số âm, số 0 hoặc chữ cái, hệ thống chặn sự kiện, hiển thị tooltip cảnh báo và tự động khôi phục về số phần bánh mặc định.

* **Nguyên liệu trong công thức tạm hết hàng (Out of Stock):**  
  Tại danh sách Checklist, sản phẩm tương ứng bị làm mờ, gắn nhãn *"Tạm hết hàng"* và bỏ tích chọn mặc định, đồng thời thông báo khách hàng cần tự chuẩn bị nguyên liệu này ở bên ngoài.

* **Số lượng mua vượt quá tồn kho khả dụng:**  
  Hệ thống cảnh báo số lượng tối đa có thể mua ngay tại bước bấm thêm vào giỏ.
