## 1. Quy trình sử dụng AI trong dự án nhóm

Nhóm sử dụng các công cụ AI để hỗ trợ phân tích yêu cầu, đề xuất chức năng và phản biện các nội dung chưa phù hợp với phạm vi dự án **BakeMate – Website bán nguyên liệu và dụng cụ làm bánh theo công thức**.

Quy trình sử dụng AI gồm các bước sau:

**Bước 1 – AI phân tích:** Nhóm cung cấp thông tin đề tài, khách hàng mục tiêu, vấn đề kinh doanh và các website tham khảo cho ChatGPT để hỗ trợ phân tích yêu cầu và đề xuất chức năng.

**Bước 2 – AI phản biện:** Nhóm sử dụng Gemini để đánh giá các đề xuất của ChatGPT, phát hiện những yêu cầu chưa rõ ràng, thiếu sót hoặc vượt quá phạm vi dự án.

**Bước 3 – Nhóm thảo luận:** Các thành viên xem xét kết quả của hai công cụ AI, đối chiếu với mục tiêu kinh doanh, thời gian và khả năng triển khai để lựa chọn phương án phù hợp.

**Bước 4 – Cập nhật tài liệu:** Nhóm tổng hợp các yêu cầu đã thống nhất và hoàn thiện tài liệu `REQUIREMENTS.md`.

**Bước 5 – Ghi nhận việc sử dụng AI:** Nhóm cập nhật `AI_USAGE_LOG.md`, ghi lại công cụ, mục đích, prompt chính, kết quả đề xuất, phản biện và quyết định của nhóm.

**Bước 6 – Sử dụng tài liệu làm căn cứ phát triển:** Trong các giai đoạn tiếp theo, nhóm sử dụng những yêu cầu đã thống nhất để thiết kế, lập trình và kiểm thử website. AI chỉ đóng vai trò hỗ trợ, không tự ý bổ sung chức năng ngoài phạm vi dự án.

## 2. Nhật ký sử dụng AI

### Lần sử dụng 1: Phân tích yêu cầu dự án

**Công cụ AI:** ChatGPT

**Mục đích:**

Hỗ trợ phân tích yêu cầu nghiệp vụ, xác định các chức năng cần thiết và đề xuất phạm vi phát triển website thương mại điện tử BakeMate.

**Prompt chính (tóm tắt):**

Nhóm yêu cầu ChatGPT đóng vai trò chuyên gia phân tích nghiệp vụ cho dự án thương mại điện tử.

Nhóm cung cấp thông tin về BakeMate, bao gồm sản phẩm kinh doanh, khách hàng mục tiêu, vấn đề kinh doanh, giải pháp đề xuất và các website tham khảo.

Yêu cầu AI đề xuất:

- Mục tiêu và phạm vi dự án.
- Các nhóm người dùng và quyền hạn.
- Danh sách chức năng cần có.
- Quy trình nghiệp vụ chính.
- Yêu cầu phi chức năng.
- Các chức năng ưu tiên trong phiên bản đầu tiên.
- Các chức năng nâng cao có thể bổ sung.
- Rủi ro triển khai và cách giảm thiểu.

**Kết quả AI đề xuất:**

ChatGPT đã hỗ trợ nhóm:

- Xác định mục tiêu và phạm vi dự án BakeMate.
- Đề xuất ba nhóm người dùng: Guest, Customer và Admin.
- Đề xuất các chức năng cơ bản như quản lý sản phẩm, danh mục, tìm kiếm, giỏ hàng và đặt hàng.
- Đề xuất các chức năng đặc trưng: điều chỉnh số phần bánh, tự động tính định lượng nguyên liệu, ghép quy cách đóng gói, gợi ý dụng cụ và tạo giỏ hàng từ công thức.
- Mô tả quy trình nghiệp vụ từ lựa chọn công thức đến đặt hàng.
- Phân loại chức năng theo mức độ ưu tiên và đề xuất biện pháp giảm thiểu rủi ro.

**Phản biện:**

Một số đề xuất của ChatGPT chưa làm rõ quy tắc xử lý nghiệp vụ như cách tính định lượng, lựa chọn quy cách đóng gói, kiểm tra tồn kho và xử lý lỗi khi đặt hàng. Ngoài ra, một số chức năng nâng cao có thể vượt quá khả năng triển khai của nhóm.

**Quyết định của nhóm:**

Nhóm lựa chọn các chức năng phù hợp với mục tiêu kinh doanh của BakeMate, đặc biệt ưu tiên quy trình mua hàng theo công thức.

Các chức năng như xem công thức, điều chỉnh số phần bánh, tính định lượng, ghép quy cách đóng gói, lựa chọn nguyên liệu và tạo giỏ hàng từ công thức được giữ lại làm chức năng cốt lõi.

Những chức năng phức tạp như chatbot AI, cá nhân hóa và tích hợp dịch vụ bên ngoài được đưa vào phạm vi mở rộng.

Nhóm tiếp tục sử dụng Gemini để phản biện và làm rõ các đề xuất trước khi hoàn thiện yêu cầu.

**Người kiểm tra:** Siu Đen Ny

### Lần sử dụng 2: Phản biện yêu cầu dự án

**Công cụ AI:** Gemini

**Mục đích:**

Đánh giá độc lập các yêu cầu do ChatGPT đề xuất, phát hiện những điểm chưa hợp lý, thiếu sót và các chức năng có nguy cơ vượt quá phạm vi đồ án.

**Prompt chính (tóm tắt):**

Nhóm yêu cầu Gemini đóng vai trò người phản biện độc lập cho dự án website thương mại điện tử của sinh viên.

Nhóm cung cấp mô tả dự án BakeMate, vấn đề kinh doanh, khách hàng mục tiêu, kết quả khảo sát website và danh sách chức năng do ChatGPT đề xuất.

Yêu cầu AI đánh giá:

- Các chức năng có thực sự giải quyết vấn đề kinh doanh không?
- Có yêu cầu nào trùng lặp hoặc không cần thiết không?
- Có chức năng nào vượt quá phạm vi thực hiện không?
- Có thiếu chức năng hoặc quy trình nghiệp vụ quan trọng không?
- Có rủi ro về dữ liệu, bảo mật và quyền riêng tư không?
- Có yêu cầu nào chưa đủ rõ để lập trình và kiểm thử không?

AI cần nêu lý do và đề xuất hướng điều chỉnh cho từng vấn đề.

**Kết quả phản biện:**

Gemini đưa ra các nhận xét và đề xuất:

- Cần làm rõ quy tắc tính toán định lượng nguyên liệu khi thay đổi số phần bánh.
- Cần xác định cách lựa chọn quy cách đóng gói, số lượng gói, lượng dư và chi phí dự kiến.
- Cần cho phép khách hàng bỏ chọn nguyên liệu và dụng cụ đã có sẵn.
- Cần kiểm tra tồn kho, giá bán và thông tin nhận hàng trước khi tạo đơn.
- Cần bổ sung cách xử lý sản phẩm hết hàng, dữ liệu không hợp lệ và đặt hàng thất bại.
- Cần làm rõ quyền hạn của khách hàng và quản trị viên.
- Nên giới hạn các chức năng nâng cao để phù hợp với thời gian và khả năng triển khai.

**Quyết định của nhóm:**

Sau khi xem xét kết quả phản biện, nhóm thống nhất:

**Giữ lại:**
- Các chức năng thương mại điện tử cơ bản như xem sản phẩm, tìm kiếm, quản lý giỏ hàng và đặt hàng.
- Các chức năng đặc trưng của BakeMate gồm điều chỉnh số phần bánh, tính định lượng, ghép quy cách đóng gói và tạo giỏ hàng từ công thức.
- Các chức năng quản trị sản phẩm, công thức, tồn kho và đơn hàng.

**Điều chỉnh và bổ sung:**
- Làm rõ quy tắc quy đổi định lượng và tính số lượng sản phẩm cần mua.
- Bổ sung kiểm tra tồn kho và xử lý trường hợp sản phẩm không đủ hàng.
- Cho phép khách hàng chọn hoặc bỏ chọn nguyên liệu, dụng cụ trước khi thêm vào giỏ hàng.
- Bổ sung kiểm tra thông tin đặt hàng và xử lý lỗi.
- Làm rõ quyền hạn người dùng và chức năng theo dõi trạng thái đơn hàng.

**Giới hạn phạm vi:**
- Sử dụng COD làm phương thức thanh toán cơ bản trong phiên bản đầu tiên.
- Các phương thức thanh toán khác được xem xét theo tiến độ thực hiện.
- Chưa ưu tiên tích hợp cổng thanh toán trực tuyến, vận chuyển tự động hoặc thuật toán tối ưu giỏ hàng phức tạp.
- Chatbot AI và các chức năng cá nhân hóa được đưa vào phạm vi mở rộng.

Những nội dung đã thống nhất được sử dụng làm cơ sở hoàn thiện tài liệu `REQUIREMENTS.md`.

**Người kiểm tra:** Trần Thị Bảo Ngọc

## 3. Kết luận

Trong quá trình phân tích yêu cầu dự án BakeMate, nhóm đã sử dụng ChatGPT để hỗ trợ phân tích và đề xuất chức năng, sau đó sử dụng Gemini để phản biện và đánh giá các yêu cầu.

Kết quả từ hai công cụ AI giúp nhóm xác định rõ hơn phạm vi dự án, các chức năng cốt lõi, những nội dung cần điều chỉnh và các chức năng có thể phát triển sau.

Nhóm không sử dụng nguyên trạng mọi đề xuất của AI mà xem xét, lựa chọn và điều chỉnh dựa trên mục tiêu kinh doanh, nguồn lực và thời gian thực hiện đồ án.

**AI chỉ đóng vai trò hỗ trợ. Quyết định cuối cùng về yêu cầu và phạm vi dự án thuộc về các thành viên trong nhóm.**

Các yêu cầu đã thống nhất được tổng hợp trong tài liệu `REQUIREMENTS.md` để làm căn cứ cho các giai đoạn phát triển tiếp theo.
