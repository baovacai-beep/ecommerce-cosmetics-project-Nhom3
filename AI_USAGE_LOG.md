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

AI_USAGE_LOG.md – Nhật ký sử dụng AI của dự án BakeMate (Chương 2)
2. Nhật ký sử dụng AI
Lần sử dụng 1: Lập kế hoạch triển khai giao diện – Prompt 1
Công cụ AI: Gemini

Mục đích: Hỗ trợ lập kế hoạch Buổi 2 từ yêu cầu nghiệp vụ đã được nhóm xác định ở Buổi 1; chia nhiệm vụ và ưu tiên hoàn thiện các trang giao diện bắt buộc.

Prompt chính (tóm tắt): Nhóm cung cấp chủ đề BakeMate, điểm khác biệt Smart Recipe-to-Cart, khách hàng mục tiêu, ba website tham khảo Beemart, Abby, Foodland, các chức năng dự kiến và thông tin nhóm gồm tám thành viên. AI được yêu cầu xác định nội dung bốn trang index.html, products.html, product-detail.html, about.html; liệt kê thành phần dùng chung; đề xuất tổ chức CSS và ảnh; chia lộ trình thành các nhiệm vụ; lập tiêu chí hoàn thành; dự báo xung đột CSS, lỗi bố cục và responsive. Nhóm yêu cầu chưa viết mã, chưa đề xuất backend, cơ sở dữ liệu hoặc thanh toán trực tuyến.

Kết quả AI đề xuất:
- Xác định bốn trang HTML bắt buộc và nội dung cơ bản cho từng trang; danh sách sản phẩm tối thiểu tám sản phẩm.
- Đề xuất các thành phần thống nhất: header, menu, footer, màu sắc, font chữ, thẻ sản phẩm, nút CTA và hover/focus.
- Đề xuất lộ trình tổ chức thư mục, thiết kế, lập trình, tích hợp, kiểm tra responsive và hoàn thiện báo cáo/GitHub.
- Nêu tiêu chí như liên kết menu đúng, ảnh không bị mất, giao diện cơ bản không tràn ngang.
Phản biện / nội dung nhóm xem xét: Kế hoạch AI là gợi ý, không bảo đảm tiến độ thực tế. Để tránh quá phạm vi, cần phân biệt bốn trang bắt buộc với trang công thức, giỏ hàng hoặc các tính năng nghiệp vụ chưa yêu cầu hoàn thiện trong Buổi 2.

Quyết định của nhóm: Tập trung xây dựng bốn trang HTML theo yêu cầu; sử dụng một file CSS chung css/style.css và thư mục images/; chia nhiệm vụ theo các mốc và đầu ra đã ghi trong bảng kế hoạch của báo cáo. Các chức năng động Recipe-to-Cart được giữ ở mức định hướng giao diện trong Buổi 2, không mô tả là đã hoạt động đầy đủ.

Tài liệu đối chiếu: Mục 2.2 của báo cáo Chương 2, bảng kế hoạch và phân công nhiệm vụ.

Người kiểm tra: Bảo Ngọc
Lần sử dụng 2: Kiểm tra cấu trúc thư mục dự án – Prompt 2
Công cụ AI: Chat GPT

Mục đích: Rà soát cách sắp xếp mã nguồn và tài nguyên trước khi nhiều thành viên cùng triển khai.

Prompt chính (tóm tắt): Nhóm cung cấp cấu trúc dự án với bốn file HTML ở thư mục gốc, css/style.css, thư mục images/, docs/ui-design.md và README.md; yêu cầu AI đánh giá kiến trúc thư mục, đề xuất cách tổ chức file, thành phần dùng chung, quy ước đặt tên file/class, đường dẫn tương đối và các rủi ro khi tích hợp. Không tạo lại dự án hoặc dùng framework CSS.

Kết quả AI đề xuất:
- Giữ bốn file HTML tại thư mục gốc; quản lý định dạng bằng css/style.css, hình ảnh trong images/ và đặc tả tại docs/ui-design.md.
- Dùng các thành phần header/footer, product card và CTA nhất quán trên cả bốn trang.
- Sử dụng quy ước file kebab-case, class CSS theo cấu trúc dễ phân biệt/BEM và đường dẫn tương đối.
- Cảnh báo xung đột selector, header/footer không đồng bộ và lỗi đường dẫn ảnh khi đưa code lên GitHub.
Phản biện / nội dung nhóm xem xét: Không cần chia CSS thành nhiều file trong giai đoạn còn ít trang; đồng thời việc đặt tên class cần theo một quy ước thực sự được các thành viên sử dụng thống nhất.

Quyết định của nhóm: Giữ mô hình bốn file HTML ở gốc, một style.css dùng chung, thư mục images/; chuẩn hóa màu, kiểu chữ, tên class, đường dẫn tương đối và cập nhật tài liệu docs/ui-design.md.

Tài liệu đối chiếu: Mục 3.2 và ảnh chụp cấu trúc repository trong báo cáo.

Người kiểm tra: Gia Bảo
Lần sử dụng 3: Thiết kế giao diện tổng thể bốn trang – Prompt 3 (Mục 4.1)
Công cụ AI: Chat GPT

Mục đích: Xây dựng đặc tả bố cục và hệ thống thiết kế thống nhất trước khi lập trình HTML/CSS.

Prompt chính (tóm tắt): Nhóm mô tả bốn trang HTML, điểm khác biệt của BakeMate, đối tượng khách hàng, yêu cầu giao diện ấm cúng như tiệm bánh và cấu trúc dự án. Yêu cầu AI đề xuất bố cục từng trang, thành phần dùng chung, bảng màu, kiểu chữ, vị trí hình ảnh/nội dung, cách điều hướng và nguyên tắc dễ sử dụng; chỉ đặc tả, chưa viết mã.

Kết quả AI đề xuất:
- Định hướng trang chủ với banner công thức và sản phẩm nổi bật; trang danh sách sử dụng lưới sản phẩm; trang chi tiết tập trung thông tin, quy cách; trang giới thiệu làm rõ câu chuyện và giá trị BakeMate.
- Đề xuất bộ màu nâu bánh nướng #70452B, kem sáng #FFF8ED, vàng kem #F2D9A6, caramel #C88B52, vàng mật ong #F59E0B.
- Thống nhất font Be Vietnam Pro, vùng nội dung tối đa 1200px, header/footer dùng chung, product card, recipe card và CTA.
- Nêu quy tắc ảnh sản phẩm 1:1, responsive theo desktop/tablet/mobile và khả năng điều hướng giữa bốn trang.
Phản biện / nội dung nhóm xem xét: Các khối về danh sách công thức, giỏ hàng và liên kết công thức có thể được đặc tả hoặc trình bày minh họa nhưng không đồng nghĩa nhóm đã xây dựng đủ chức năng động ở Buổi 2. Cần bảo đảm nút điều hướng không hứa hẹn chức năng chưa triển khai.

Quyết định của nhóm: Sử dụng một design system chung với tông màu nâu–kem–vàng, font Be Vietnam Pro, vùng nội dung tối đa 1200px; tập trung đặc tả và triển khai bốn trang bắt buộc theo bảng Mục 4.2–4.5.

Tài liệu đối chiếu: Mục 4.1–4.5 và tài liệu docs/ui-design.md.

Người kiểm tra: Minh Thư
Lần sử dụng 4: Hỗ trợ xây dựng Header và Hero Banner – Prompt 4
Công cụ AI: Chat GPT

Mục đích: Tham khảo cách triển khai phần đầu trang và banner trang chủ bằng HTML5/CSS3, tuân thủ bộ quy chuẩn giao diện.

Prompt chính (tóm tắt): Nhóm gửi cấu trúc header và các quy tắc CSS hiện có; yêu cầu AI giải thích bố cục rồi chỉ đề xuất phần HTML/CSS cần bổ sung hoặc chỉnh sửa. Header cần logo, menu ba trang, ô tìm kiếm, biểu tượng giỏ hàng; banner có ảnh nền, tiêu đề và CTA; dùng semantic HTML, Flexbox, hover, focus, responsive. Không viết lại toàn bộ dự án, không JavaScript/framework CSS.

Kết quả AI đề xuất:
- Dùng <header>, <nav>, <section> và Flexbox để chia khu vực logo – menu – công cụ tìm kiếm/giỏ hàng.
- Bố trí Hero Banner với ảnh nền, lớp phủ gradient, tiêu đề “Làm bánh chuẩn vị – Nguyên liệu chuẩn tay” và liên kết tới trang Sản phẩm/Giới thiệu.
- Đề xuất header sticky, kiểu dáng CTA, :hover, :focus-visible và Media Query khi màn hình nhỏ.
- Cung cấp mã HTML/CSS kèm giải thích về cấu trúc và các thuộc tính chính.
Phản biện / nội dung nhóm xem xét: Vì chỉ yêu cầu bản dựng giao diện, biểu tượng giỏ hàng và ô tìm kiếm không được hiểu là đã có logic mua hàng/tìm kiếm động. Phải kiểm tra đường dẫn nút và không giữ một liên kết tới file chưa tồn tại.

Quyết định của nhóm: Triển khai header và banner theo bộ màu, bố cục chung; dùng các liên kết nằm trong phạm vi bốn trang HTML, bổ sung CSS tương tác/responsive vào style.css và giữ nguyên nguyên tắc không sử dụng JavaScript ở bước này.

Tài liệu đối chiếu: Mục 5.2, ảnh và đoạn mã header/hero trong báo cáo.

Người kiểm tra: Phạm Thương, 
Lần sử dụng 5: Xây dựng trang danh sách sản phẩm – Prompt 5
Công cụ AI: Chat GPT

Mục đích: Hỗ trợ tạo bố cục thẻ sản phẩm cho products.html từ dữ liệu nguyên liệu BakeMate.

Prompt chính (tóm tắt): Nhóm cung cấp mã index.html, style.css, danh sách chín sản phẩm kèm giá/ảnh; yêu cầu AI hoàn thiện lưới sản phẩm ít nhất tám mặt hàng, có ảnh/tên/giá/nút xem chi tiết, khoảng cách đồng đều, CSS Grid hoặc Flexbox, hover/focus và responsive; không dùng JavaScript, framework hay backend.

Kết quả AI đề xuất:
- Đề xuất các thẻ product card cho chín sản phẩm, bố cục dạng lưới nhiều cột trên desktop và điều chỉnh theo màn hình.
- Gợi ý quy tắc CSS để giữ ảnh, nội dung, nút xem chi tiết đồng đều.
- Kèm giải thích lựa chọn CSS Grid cho lưới sản phẩm.
Phản biện: Đề xuất AI ban đầu đặt toàn bộ danh sách sản phẩm vào index.html nên không đúng yêu cầu tổ chức trang: trang danh sách phải là products.html.

Quyết định của nhóm: Chuyển lưới sản phẩm sang products.html, giữ trang chủ tập trung nội dung giới thiệu và CTA “Xem tất cả sản phẩm” điều hướng về trang danh sách. Rà soát các thẻ sản phẩm và liên kết xem chi tiết. Nội dung này có hình trước–sau trong báo cáo.

Tài liệu đối chiếu: Mục 6.2–6.4, các hình minh họa kết quả ban đầu và sau chỉnh sửa.

Người kiểm tra: Như Hậu, Nguyễn Thương.
Lần sử dụng 6: Xây dựng trang chi tiết sản phẩm – Prompt 6A
Công cụ AI: Gemini

Mục đích: Hỗ trợ triển khai product-detail.html, đặc biệt bố cục sản phẩm và khối liên kết công thức – điểm khác biệt của BakeMate.

Prompt chính (tóm tắt): Nhóm cung cấp quy chuẩn màu/font, header/footer, thông tin ví dụ sản phẩm Bột Mì Số 13 Chuyên Dụng Làm Bánh Mì, hai quy cách 500g/1kg, thuộc tính sản phẩm, công thức liên quan và sản phẩm mua kèm. Yêu cầu AI tạo phần HTML/CSS cần thiết cho trang chi tiết với Breadcrumb, ảnh chính/thumbnail, thông tin giá, lựa chọn quy cách, số lượng, nút mua, khối “Sản phẩm này dùng cho công thức nào?”, responsive 768px/390px và hover/focus. Không JavaScript/backend/thư viện ngoài.

Kết quả AI đề xuất:
- Đề xuất giao diện chi tiết sản phẩm hai cột bằng CSS Grid: ảnh ở trái, nội dung và thao tác ở phải.
- Bổ sung Breadcrumb, ảnh vuông 1:1 với object-fit, thumbnail, giá và các lựa chọn quy cách đóng gói.
- Đề xuất khối liên kết các công thức có sử dụng nguyên liệu, khối sản phẩm mua kèm và phần thông số/bảo quản.
- Đề xuất responsive chuyển hai cột thành một cột và trạng thái :focus-visible.
Phản biện / nội dung nhóm xem xét: Ảnh kết quả trong báo cáo thể hiện mẫu sản phẩm bột mì Meizan, trong khi prompt dùng Bột Mì Số 13; cần soát để tránh lẫn tên, ảnh, giá và quy cách của hai mẫu. Các nút chọn thumbnail, đổi số lượng hoặc mua hàng chỉ là giao diện nếu chưa có JavaScript.

Quyết định của nhóm: Sử dụng bố cục hai cột, thống nhất thành phần dùng chung và khối liên kết sản phẩm–công thức ở mức giao diện. Phạm vi Buổi 2 chỉ yêu cầu một trang chi tiết sản phẩm mẫu, chưa kết luận các thao tác động đã hoạt động đầy đủ. Cần thống nhất lại dữ liệu hiển thị của sản phẩm trước khi chốt.

Tài liệu đối chiếu: Mục 7.1–7.2 và ảnh minh họa trang chi tiết sản phẩm.

Người kiểm tra: Đen Ny, Gia Bảo
Lần sử dụng 7: Xây dựng trang Giới thiệu cửa hàng – Prompt 6B
Công cụ AI: Chat GPT

Mục đích: Hỗ trợ tổ chức nội dung và mã giao diện trang about.html phù hợp định hướng thương hiệu BakeMate.

Prompt chính (tóm tắt): Nhóm mô tả cửa hàng, khách hàng mục tiêu, điểm nổi bật chuyển từ công thức sang danh sách nguyên liệu cần mua và mã header/CSS hiện tại. AI được yêu cầu chia nội dung giới thiệu thành các phần, thiết kế tiêu đề/hình ảnh, bố cục dễ đọc, semantic HTML, phong cách thống nhất và responsive; chỉ bổ sung phần mã cần thiết, không sử dụng JavaScript/framework CSS hoặc tự tạo thông tin kinh doanh không có trong dữ liệu.

Kết quả AI đề xuất:
- Gợi ý trang Giới thiệu với phần mở đầu về BakeMate, câu chuyện và giá trị thương hiệu.
- Thể hiện khách hàng mục tiêu, điểm khác biệt mua nguyên liệu theo công thức và quy trình trải nghiệm đơn giản.
- Đề xuất bố cục xen kẽ văn bản/hình ảnh, thẻ giới thiệu, CTA và phần thông tin liên hệ.
- Cung cấp mẫu HTML/CSS đồng bộ với header/footer và bảng màu.
Phản biện / nội dung nhóm xem xét: Thông tin địa chỉ, điện thoại, email và câu chuyện thương hiệu không nên được AI tự bịa rồi trình bày như thông tin cửa hàng đã xác minh. Nút dẫn đến tính năng chưa triển khai phải có đích phù hợp với bản demo.

Quyết định của nhóm: Giữ cấu trúc giới thiệu dễ đọc, nhấn mạnh BakeMate lấy công thức làm trung tâm, dùng tông màu/kiểu chữ thống nhất; chỉ đưa vào thông tin liên hệ được nhóm xác nhận hoặc ghi dưới dạng dữ liệu minh họa rõ ràng.

Tài liệu đối chiếu: Mục 7.4 và ảnh kết quả giao diện about.html.

Người kiểm tra: Như Hậu, Hiền
Lần sử dụng 8: Kiểm tra và đề xuất chỉnh sửa Responsive – Prompt 7
Công cụ AI: Chat GPT

Mục đích: Phân tích các vấn đề giao diện sau khi nhóm kiểm tra bằng Chrome DevTools ở 1366px, 768px và 390px.

Prompt chính (tóm tắt): Nhóm cung cấp ảnh chụp trước khi sửa và mã CSS của header, thanh tìm kiếm, lưới sản phẩm và banner; yêu cầu AI chỉ ra vấn đề responsive, đề xuất CSS/Media Query và giải thích lợi ích từng thay đổi. Báo cáo không ghi nguyên văn toàn bộ Prompt 7 trong một khối riêng; đây là phần tóm tắt từ Mục 8.2.

Kết quả AI đề xuất:
- Thay chiều rộng cố định của thanh tìm kiếm bằng Flexbox.
- Xem xét menu tự xuống dòng, bố cục một hoặc hai cột ở 390px, điều chỉnh banner/ảnh sản phẩm, chiều cao nút và header trên màn hình trung gian.
- Phát hiện khai báo Media Query trùng lặp và khả năng banner nền đã có chữ, làm chữ hiển thị lặp.
Phản biện: Không áp dụng mọi đề xuất chỉ vì AI nêu ra; phải căn cứ vào lỗi có thể quan sát và thử lại trên trình duyệt. Bố cục hai cột sản phẩm đang phù hợp và không cần chuyển thành một cột chỉ theo gợi ý.

Quyết định của nhóm:
- Đã áp dụng: Mở rộng thanh tìm kiếm trên màn hình tối đa 480px bằng Flexbox; ảnh trước–sau ở 390px cho thấy nội dung gợi ý hiển thị nhiều hơn.
- Giữ nguyên: Lưới sản phẩm hai cột và menu đang hoạt động phù hợp.
- Đã chọn nhưng chưa thực hiện: Dọn quy tắc CSS Grid/Media Query trùng lặp.
- Chờ kiểm tra: Kiểm tra ảnh nền banner có sẵn chữ hay không.
Tài liệu đối chiếu: Mục 8.2, bảng đề xuất và quyết định, ảnh kiểm tra 1366px/768px/390px trước–sau.

Người kiểm tra: Đen Ny
Lần sử dụng 9: Cải thiện hiệu ứng Hover/Focus bằng CSS3 – Prompt 8
Công cụ AI: Gemini

Mục đích: Tham khảo cách làm rõ phản hồi khi tương tác với menu, product card, nút CTA và các ô nhập liệu mà không gây xô lệch giao diện.

Prompt chính (tóm tắt): Nhóm cung cấp các thành phần HTML/CSS và bảng màu BakeMate, yêu cầu AI đề xuất trạng thái :hover, :focus-visible, :active, hiệu ứng chuyển động phù hợp và cách cải thiện trải nghiệm bàn phím; giữ HTML5/CSS3, không bổ sung JavaScript/framework hoặc thay đổi phạm vi chức năng.

Kết quả AI đề xuất:
- Sử dụng transition, thay đổi màu/đổ bóng và transform vừa phải cho menu, nút, thẻ sản phẩm.
- Tạo viền outline dễ nhìn với :focus-visible cho người dùng thao tác bàn phím.
- Hạn chế thay đổi width, height, margin, padding hoặc độ dày viền khi hover để tránh xô lệch bố cục.
- Đề xuất áp dụng trạng thái tương tác thống nhất giữa các trang.
Phản biện: Một số hiệu ứng làm đẹp có thể gây giật, dịch chuyển khối hoặc cản trở bàn phím nếu sử dụng sai. Trong phần câu hỏi đánh giá AI của báo cáo, nhóm nêu ví dụ một đề xuất CSS hover chưa phù hợp đã được rà soát và điều chỉnh theo nguyên tắc không gây thay đổi layout.

Quyết định của nhóm: Chuẩn hóa hover/focus của menu, product card và CTA; ưu tiên màu, bóng và transform thay vì thay đổi kích thước khung; dùng :focus-visible để giữ khả năng quan sát khi điều hướng bàn phím. Các hiệu ứng được kiểm tra qua ảnh minh họa trong báo cáo.

Tài liệu đối chiếu: Mục 9.1–9.3, bảng trạng thái tương tác và phần trả lời câu hỏi đánh giá nội dung AI.

Người kiểm tra: Gia Bảo
Lần sử dụng 10: Lập danh sách rà soát toàn website – Prompt 9A
Công cụ AI: Chat GPT

Mục đích: Hỗ trợ nhóm lập danh sách kiểm tra cuối Buổi 2 đối với bốn trang HTML và tài nguyên chung.

Prompt chính (tóm tắt): Nhóm mô tả mã các file index.html, products.html, product-detail.html, about.html, css/style.css, images/; yêu cầu AI kiểm tra liên kết, tính nhất quán CSS, đường dẫn ảnh, số lượng sản phẩm tối thiểu, bố cục, responsive, hover/focus. Với mỗi vấn đề, nêu cách kiểm tra và hướng sửa; không khẳng định tồn tại lỗi nếu thiếu bằng chứng và không viết lại dự án.

Kết quả AI/nhận xét trình bày trong báo cáo:
- Đề xuất cách tự kiểm tra href, src, việc tải CSS chung, số lượng thẻ sản phẩm và trạng thái tương tác.
- Báo cáo ghi nhận nhìn chung liên kết, CSS, bố cục và responsive đáp ứng mục tiêu bản demo.
- Phần kiểm tra ảnh có ghi vấn đề một số ảnh trong trang chi tiết sản phẩm chưa khớp tên/nội dung.
Phản biện: Nhận xét AI không thay thế kiểm thử trên trình duyệt. Đặc biệt, kết quả phần này về ảnh khác với kết luận “hình ảnh phù hợp” trong bảng kiểm thử mã nguồn ở Mục 10.4; phải đối chiếu lại phiên bản giao diện và ảnh thực tế, không khẳng định đồng thời cả hai.

Quyết định của nhóm: Sử dụng danh sách kiểm tra để rà soát bốn trang, kiểm tra liên kết/ảnh và giao diện trên trình duyệt. Giữ những đánh giá đã có minh chứng, tiếp tục xác minh các ảnh sản phẩm và các chức năng mới ở mức giao diện.

Tài liệu đối chiếu: Mục 10.1–10.2 và ảnh kiểm tra tương ứng.

Người kiểm tra: Bảo Ngọc 
Lần sử dụng 11: Đánh giá mã nguồn Frontend – Prompt 9B (Mục 10.3)
Công cụ AI: Chat GPT

Mục đích: Đánh giá chất lượng HTML/CSS trong đúng phạm vi bài tập, phân biệt lỗi của mã hiện có với các tính năng chưa yêu cầu triển khai.

Prompt chính (tóm tắt): Nhóm yêu cầu AI đóng vai trò chuyên gia rà soát Frontend, phân tích HTML semantic, sự thống nhất giữa bốn trang, CSS class/biến, Grid/Flexbox, responsive, hover/focus, đường dẫn liên kết/ảnh và mức độ bám wireframe. Với mỗi nhận xét, nêu vị trí file, lý do, mức ưu tiên và cách sửa. Không xem việc thiếu JavaScript, backend, giỏ hàng động là lỗi bắt buộc của bản demo giao diện, và không tự suy đoán kết quả thử nghiệm trình duyệt.

Kết quả AI đề xuất:
- Chỉ ra nhiều fragment URL trên products.html có nguy cơ không tìm được id tương ứng tại product-detail.html (bản demo chỉ có một trang chi tiết mẫu).
- Ghi nhận form tìm kiếm và nút đổi ảnh/thay số lượng/giỏ hàng chưa có JavaScript để thực hiện chức năng động.
- Đề nghị kiểm tra tên class CSS, selector dư, Media Query và kiểm tra thực tế trên nhiều màn hình.
- Nhận xét cấu trúc HTML semantic, CSS Grid/Flexbox, biến CSS và header/footer tương đối thống nhất.
Phản biện: Cần phân biệt “liên kết mở được trang” với “liên kết cuộn đến đúng id”. Các nút chưa có xử lý JavaScript là giới hạn của bản demo nếu chưa thuộc phạm vi Buổi 2, không nên tự mở rộng dự án. Khả năng responsive phải kiểm bằng DevTools, không xác nhận chỉ dựa vào việc có Media Query.

Quyết định của nhóm: Báo cáo ghi nhóm chọn hai vấn đề để kiểm tra thực tế: fragment sản phẩm và hình ảnh sản phẩm. Kết quả kiểm tra ghi nhận có liên kết fragment thiếu id tương ứng, cần bổ sung hoặc điều chỉnh ở giai đoạn hoàn thiện. Với hình ảnh, bảng kiểm thử Mục 10.4 ghi nhận đang phù hợp, nhưng cần đối chiếu lại nhận xét khác trong Prompt 9A trước khi chốt nhật ký. Nhóm giữ phạm vi một trang chi tiết sản phẩm mẫu và không tự mở rộng sang ứng dụng động.

Tài liệu đối chiếu: Mục 10.3–10.4, bảng các vấn đề AI đề xuất và bảng nhóm kiểm thử.

Người kiểm tra: Minh Thư
Lần sử dụng 12: Hỗ trợ soạn README.md – Prompt 9C
Công cụ AI: Chat GPT

Mục đích: Hỗ trợ chuẩn bị nội dung hướng dẫn và giới thiệu repository BakeMate sau khi hoàn thiện bản giao diện Buổi 2.

Prompt chính (tóm tắt): Nhóm cung cấp tên BakeMate, danh sách bốn file HTML, css/style.css, đặc điểm từng trang, công nghệ HTML5/CSS3/Grid/Flexbox/Media Query, các điểm nổi bật, hạn chế chưa có JavaScript/backend và yêu cầu AI soạn README.md gồm giới thiệu, cây thư mục, các trang, công nghệ, cách mở/chạy, cách kiểm tra responsive và hạn chế.

Kết quả AI đề xuất: Chưa có phản hồi AI được trình bày riêng trong tài liệu Chương 2. Vì vậy không ghi khẳng định AI đã tạo ra README hoàn chỉnh. Nhóm cần đối chiếu với lịch sử hội thoại hoặc bản README thực tế nếu muốn xác nhận kết quả.

Phản biện / nội dung nhóm cần kiểm tra: Trong prompt có mô tả “đã loại bỏ Media Query trùng lặp”, nhưng mục Responsive trước đó ghi nhận công việc này được chọn nhưng chưa thực hiện. Cần kiểm tra mã style.css/lịch sử commit và sửa mô tả README theo trạng thái thực tế. Các lời khẳng định “đạt chuẩn” accessibility cũng cần có tiêu chí kiểm chứng rõ ràng.

Quyết định của nhóm: Sử dụng README để giới thiệu đúng bản demo giao diện bốn trang, không nhận đã hoàn thiện tìm kiếm, giỏ hàng động, thanh toán hoặc backend. Chỉ công bố các điều chỉnh thực sự đã làm và kiểm tra. Nội dung README hoặc kết quả AI cụ thể cần nhóm xác nhận trước khi chuyển mục này thành nhật ký hoàn tất.

Tài liệu đối chiếu: Mục 10.5–10.6, hình minh chứng GitHub và file README.md trong repository.

Trạng thái xác minh: Bảo Ngọc 

Người kiểm tra: Phạm Thương 
3. Tổng hợp các phản biện và quyết định tiêu biểu của nhóm
Nội dung AI hỗ trợ	Vấn đề hoặc đề xuất cần kiểm chứng	Hướng xử lý được ghi trong báo cáo
Lập kế hoạch và tổ chức dự án	Nguy cơ làm quá phạm vi Buổi 2	Tập trung 4 trang HTML, một file CSS chung; giữ tính năng nâng cao ở phạm vi định hướng
Danh sách sản phẩm	AI đặt sản phẩm vào index.html	Chuyển sang products.html, bổ sung liên kết xem tất cả sản phẩm
Trang chi tiết sản phẩm	Dữ liệu sản phẩm mẫu và ảnh hiển thị cần đồng bộ	Giữ một trang chi tiết mẫu; rà tên/ảnh/giá/quy cách trước khi chốt
Responsive	Ô tìm kiếm bị chật ở 390px	Đã điều chỉnh Flexbox và ghi nhận ảnh trước/sau
Responsive	AI gợi ý đổi lưới sản phẩm thành một cột	Không áp dụng; giữ 2 cột vì giao diện hiện tại phù hợp
CSS responsive	Media Query trùng lặp	Chọn hướng dọn mã nhưng báo cáo ghi chưa thực hiện ở thời điểm kiểm tra
Banner trang chủ	Có thể bị lặp chữ từ ảnh nền	Chờ kiểm tra ảnh gốc trước khi thay
Hover/Focus	Hiệu ứng có thể gây xô lệch bố cục	Ưu tiên màu, bóng, transform vừa phải và :focus-visible
Rà soát mã nguồn	Liên kết fragment không có ID đích tương ứng	Ghi nhận để chỉnh khi hoàn thiện; vẫn giữ một trang chi tiết mẫu
Rà soát ảnh	Hai phần báo cáo có nhận xét khác nhau	Kiểm tra lại cùng phiên bản trang và ảnh trước khi kết luận
README	Prompt nêu việc đã dọn CSS trùng nhưng phần khác ghi chưa làm	Chỉ ghi thay đổi đã hoàn tất và có thể đối chiếu
