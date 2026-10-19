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
1.2. Các bước thực hiện chi tiếtKhám phá và chọn món bánh: Khách hàng duyệt thư viện công thức (F05) theo bộ lọc (độ khó, thời gian, loại bánh) và chọn món bánh dự kiến thực hiện (ví dụ: Bánh Tiramisu truyền thống).Tải thông tin chi tiết: Hệ thống truy xuất dữ liệu từ CSDL và hiển thị trang chi tiết công thức (F06) gồm: số phần bánh gốc ($S_{gốc} = 4$), các bước làm bánh kèm danh sách nguyên liệu định lượng chuẩn và bộ dụng cụ đề xuất.Tùy chỉnh khẩu phần làm bánh (Servings): Khách hàng nhập số phần bánh thực tế muốn làm (ví dụ: $S_{mới} = 8$ phần).Quy đổi định lượng tự động: Hệ thống áp dụng thuật toán tỷ lệ tức thì ở phía Client/Server:$$\text{Định lượng mới} = \text{Định lượng gốc} \times \left( \frac{S_{mới}}{S_{gốc}} \right)$$Ví dụ: Công thức gốc 4 phần cần $200\text{g}$ Mascarpone $\rightarrow$ Đổi thành 8 phần cần đúng $400\text{g}$ Mascarpone.Khớp quy cách đóng gói thương mại (SKU Mapping): Hệ thống quét danh mục sản phẩm đang mở bán để khớp lượng nguyên liệu cần dùng với quy cách đóng gói nhỏ nhất thỏa mãn nhu cầu:Nhu cầu: $400\text{g}$ Mascarpone.Quy cách bán tại kho: Hộp $250\text{g}$ và Hộp $500\text{g}$.Logic đề xuất: Hệ thống gợi ý chọn 01 hộp $500\text{g}$ (hoặc 02 hộp $250\text{g}$ theo thuật toán tối ưu tổng chi phí), hiển thị rõ: Lượng cần dùng: 400g – Quy cách mua: 500g – Lượng dư dự kiến: 100g.Hiển thị bảng chọn nguyên liệu và dụng cụ (Interactive Checklist): Hệ thống hiển thị toàn bộ nguyên liệu kèm sản phẩm bán tương ứng, và danh sách dụng cụ cần thiết (phới lồng, khuôn bánh, cân tiểu ly). Tất cả các mục mặc định được tích chọn sẵn.Khách hàng lọc bỏ các món đã sở hữu: Khách hàng bỏ tích chọn (uncheck) ở các mục nhà đã có sẵn (ví dụ: đã có sẵn đường tinh luyện và cân điện tử). Chi phí tạm tính tự động trừ các món này ra.Đưa vào giỏ hàng: Khách hàng nhấn "Thêm các món đã chọn vào giỏ hàng" (F11). Hệ thống kiểm tra số lượng tồn kho thực tế, nếu hợp lệ sẽ đẩy trực tiếp các SKU vào giỏ hàng (F12) mà không làm gián đoạn việc xem công thức.Đặt hàng (Checkout): Khách hàng chuyển sang trang Giỏ hàng, kiểm tra lại danh sách, nhập thông tin nhận hàng, chọn phương thức thanh toán (COD hoặc chuyển khoản qua mã VietQR) và nhấn "Xác nhận đặt hàng" (F13).1.3. Các trường hợp ngoại lệ và xử lý lỗiSố phần bánh nhập không hợp lệ: Nếu khách hàng nhập số âm, số 0 hoặc chữ cái, hệ thống chặn sự kiện, hiển thị tooltip cảnh báo và tự động khôi phục về số phần bánh mặc định.Nguyên liệu trong công thức tạm hết hàng (Out of Stock): Tại danh sách Checklist, sản phẩm tương ứng bị làm mờ, gắn nhãn "Tạm hết hàng" và bỏ tích chọn mặc định, đồng thời thông báo khách hàng cần tự chuẩn bị nguyên liệu này ở bên ngoài.Số lượng mua vượt quá tồn kho khả dụng: Hệ thống cảnh báo số lượng tối đa có thể mua ngay tại bước bấm thêm vào giỏ.2. Quy trình BW-02: Xử lý đơn hàng, cập nhật tồn kho và theo dõi giao nhận (Order Fulfillment)Quy trình này kiểm soát tính toàn vẹn dữ liệu đơn hàng, đảm bảo việc trừ tồn kho chính xác, minh bạch trạng thái xử lý giữa khách hàng và bộ phận vận hành cửa hàng.2.1. Sơ đồ trạng thái đơn hàng (Order State Machine)Plaintext[Khách đặt hàng] ──> (1. Chờ xác nhận / Pending)
```text
                             │
                             ├── (Admin hủy / Khách hủy) ──> [Đơn đã hủy / Cancelled]
                             │                                 (Hoàn lại tồn kho)
                             ▼
                     (2. Đã xác nhận / Confirmed)
                             │
                             ▼
                     (3. Đang đóng gói / Processing)
                             │
                             ▼
                     (4. Đang giao hàng / Shipping)
                             │
                             ├── (Giao thất bại) ──────────> [Chuyển hoàn / Returned]
                             │
                             ▼
                     (5. Hoàn tất / Completed)
```
2.2. Các bước thực hiện chi tiếtKhởi tạo và ghi nhận đơn hàng:Sau khi khách hàng nhấn xác nhận đặt đơn tại trang Checkout, hệ thống kích hoạt transaction phía cơ sở dữ liệu:Kiểm tra lại giá bán và số lượng tồn kho thực tế của từng SKU.Lưu thông tin đơn hàng vào bảng Orders (Trạng thái: Pending - Chờ xác nhận).Sao lưu ảnh chụp thông tin sản phẩm và giá bán tại thời điểm mua vào bảng Order_Details (đảm bảo nếu giá bán sau này thay đổi thì dữ liệu lịch sử đơn cũ không bị ảnh hưởng).Tạm khóa số lượng hàng trong kho tương ứng với đơn hàng.Hệ thống sinh mã đơn hàng ngẫu nhiên (ví dụ: #BM-8921) và hiển thị thông báo đặt hàng thành công kèm hướng dẫn thanh toán.Tiếp nhận và xác nhận đơn hàng (Phía Quản trị viên):Quản trị viên truy cập bảng điều khiển Admin (F17), lọc danh sách các đơn hàng mới ở trạng thái Pending.Kiểm tra tính hợp lệ của địa chỉ nhận hàng, số điện thoại và ghi chú khách hàng.Nếu hợp lệ: Bấm "Xác nhận đơn hàng", trạng thái chuyển sang Confirmed.Nếu có sai sót (thông tin ảo, gọi xác nhận không được): Bấm "Hủy đơn", hệ thống mở khóa hoàn trả số lượng tồn kho đã giữ.Đóng gói và bàn giao vận chuyển:Nhân viên kho in phiếu đóng gói (Pick list) chứa danh sách SKU, số lượng gói và vị trí kệ hàng.Cập nhật trạng thái sang Processing (Đang đóng gói) và thực hiện trừ trực tiếp số lượng tồn kho khả dụng trong CSDL (F16).Sau khi hoàn tất đóng gói, bàn giao kiện hàng cho bưu tá giao hàng, cập nhật trạng thái sang Shipping (Đang giao hàng).Khách hàng theo dõi trạng thái đơn hàng:Khách hàng đã đăng nhập có thể vào mục "Lịch sử đơn hàng" (F19) để xem tiến độ.Khách vãng lai có thể sử dụng công cụ tra cứu nhanh bằng cách nhập Mã đơn hàng + Số điện thoại nhận hàng để xem trạng thái xử lý hiện tại mà không cần tạo tài khoản.Giao hàng và hoàn tất:Khách hàng nhận gói hàng, kiểm tra tem niêm phong và thanh toán tiền mặt (COD) hoặc xác nhận đã chuyển khoản thành công.Quản trị viên cập nhật trạng thái đơn thành Completed. Hệ thống ghi nhận doanh thu vào báo cáo tài chính.2.3. Quy định xử lý hủy đơn hàngKhách hàng chủ động hủy đơn: Chỉ được phép hủy trực tiếp trên giao diện website khi đơn hàng đang ở trạng thái Pending (Chưa xác nhận). Nếu đơn đã chuyển sang Processing hoặc Shipping, nút hủy sẽ bị ẩn và khách hàng phải liên hệ trực tiếp hotline để can thiệp.Hoàn trả tồn kho tự động: Bất kỳ thao tác hủy đơn nào thành công đều kích hoạt trigger hoàn trả lại số lượng tồn kho tương ứng cho các sản phẩm liên quan.3. Quy trình BW-03: Quản trị công thức và thiết lập ánh xạ định lượng sang SKU (Recipe & SKU Mapping)Quy trình dành riêng cho Quản trị viên (Admin) nhằm chuẩn hóa cấu trúc dữ liệu cho kho công thức làm bánh, đảm bảo hệ thống có đủ thông tin để thuật toán quy đổi định lượng và gợi ý mua hàng vận hành chính xác.3.1. Sơ đồ luồng quản trị (Admin Flow)Plaintext[Admin Dashboard]
```text
       │
       ├── 1. Khởi tạo công thức mới (Tên, mô tả, số phần gốc, thời gian, độ khó)
       │
       ├── 2. Thiết lập danh sách nguyên liệu định lượng chuẩn
       │         │
       │         ├── Nhập tên nguyên liệu & đơn vị tính (g, ml, quả)
       │         └── Nhập định lượng chuẩn tương ứng với số phần gốc
       │
       ├── 3. Cấu hình ánh xạ sang SKU sản phẩm thương mại (SKU Mapping)
       │         │
       │         ├── Tìm kiếm SKU trong kho sản phẩm (bột mì 500g, bơ lạt 200g...)
       │         └── Thiết lập quy tắc khớp (ưu tiên gói nhỏ hay gói lớn)
       │
       ├── 4. Gán danh mục dụng cụ cần thiết cho công thức
       │
       └── 5. Kiểm thử tính toán thử nghiệm ──> Xuất bản công khai (Publish)
```
3.2. Các bước thực hiện chi tiếtKhởi tạo thông tin chung của công thức làm bánh:Admin đăng nhập trang quản trị, chọn mục "Quản lý công thức" (F15) $\rightarrow$ Bấm "Thêm công thức mới".Nhập tiêu đề món bánh, đoạn mô tả ngắn, danh mục phân loại (Bánh mì, Bánh ngọt, Bánh quy, Bánh lạnh), độ khó (Dễ, Trung bình, Nâng cao), thời gian chuẩn bị và thời gian nướng.Khai báo Số phần bánh gốc ($S_{gốc}$) làm căn cứ quy đổi (bắt buộc $S_{gốc} > 0$, ví dụ: chuẩn 1 khuôn 6 phần).Khai báo danh mục nguyên liệu và định lượng chuẩn:Thêm từng thành phần nguyên liệu cấu thành món bánh.Với mỗi nguyên liệu, khai báo:Tên nguyên liệu: (ví dụ: Bột mì số 13).Định lượng chuẩn: (ví dụ: $300$).Đơn vị đo: (ví dụ: $\text{g}$).Thuộc tính: Bắt buộc hay Tùy chọn (cho phép thay thế).Cấu hình ma trận ánh xạ SKU đóng gói (SKU Mapping Configuration):Đây là bước mấu chốt để tính năng Recipe-to-Cart hoạt động: Admin liên kết nguyên liệu công thức với một hoặc nhiều sản phẩm thực tế đang kinh doanh trong bảng Products:Nguyên liệu Bột mì số 13 được ánh xạ tới 2 SKU: SKU-BM13-500 (Gói 500g) và SKU-BM13-1000 (Gói 1kg).Thiết lập trọng số ưu tiên: Hệ thống sẽ ưu tiên chọn SKU có dung tích gần nhất với nhu cầu sau quy đổi để hạn chế lượng dư thừa cho người mua.Gán dụng cụ làm bánh đề xuất:Admin chọn từ bảng Catalog các dụng cụ bắt buộc phải có để thực hiện món bánh (ví dụ: Khuôn loaf nướng bánh, Phới lồng đánh trứng, Giấy nến chống dính).Đánh dấu rõ dụng cụ nào là bắt buộc, dụng cụ nào là phụ trợ nâng cao.Kiểm thử logic và xuất bản (Publish):Admin nhập thử một số phần ngẫu nhiên (ví dụ: thử quy đổi từ 6 phần lên 12 phần) ngay tại giao diện xem trước (Preview) để kiểm tra:Định lượng nguyên liệu có nhân đôi chính xác không.Số gói SKU đề xuất có tăng tương ứng không.Các dụng cụ có hiển thị đầy đủ không.Sau khi kiểm tra đạt chuẩn, Admin bấm "Xuất bản". Công thức sẽ lập tức hiển thị công khai trên website cho khách hàng trải nghiệm mua sắm.3.3. Ràng buộc dữ liệu và an toàn hệ thốngToàn vẹn tham chiếu (Referential Integrity): Hệ thống ngăn chặn thao tác xóa một sản phẩm trong kho nếu sản phẩm đó đang là SKU duy nhất được ánh xạ vào một công thức đang hiển thị công khai.Cảnh báo dữ liệu rỗng: Không cho phép xuất bản công thức nếu thiếu các trường bắt buộc: Số phần gốc, danh sách nguyên liệu hoặc chưa liên kết SKU bán hàng.
