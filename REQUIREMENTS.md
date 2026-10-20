# Requirements
## 1. Mục tiêu dự án
BakeMate là website thương mại điện tử chuyên bán nguyên liệu và dụng cụ làm bánh, kết hợp kho công thức làm bánh với chức năng hỗ trợ khách hàng chuẩn bị danh sách mua sắm theo từng công thức.
## Mục tiêu kinh doanh
Cung cấp một địa điểm mua sắm trực tuyến tập trung các nguyên liệu và dụng cụ làm bánh.
Giúp khách hàng, đặc biệt là người mới học làm bánh, xác định các nguyên liệu và dụng cụ cần thiết cho từng công thức.
Giảm thời gian tìm kiếm từng sản phẩm và hạn chế tình trạng mua thiếu hoặc mua dư nguyên liệu.
Giúp khách hàng ước tính chi phí nguyên liệu và dụng cụ trước khi đặt hàng.
Tạo sự khác biệt thông qua quy trình chuyển đổi từ công thức làm bánh thành giỏ hàng mua sắm.
## Giá trị mang lại cho khách hàng
Dễ lựa chọn: Công thức được trình bày kèm nguyên liệu, định lượng và dụng cụ cần thiết.
Dễ tính toán: Khách hàng có thể điều chỉnh số phần bánh và xem định lượng nguyên liệu được quy đổi tương ứng.
Dễ mua sắm: Hệ thống đề xuất quy cách đóng gói phù hợp với lượng nguyên liệu cần sử dụng.
Dễ dự toán: Khách hàng có thể xem giá sản phẩm và tổng tiền dự kiến trước khi đặt hàng.
Tiết kiệm thời gian: Khách hàng có thể thêm các nguyên liệu và dụng cụ đã chọn vào giỏ hàng từ trang công thức.
## 2. Phạm vi
## Trong phạm vi
A. Chức năng dành cho khách hàng
Hiển thị trang chủ, sản phẩm nổi bật, công thức nổi bật và chương trình khuyến mãi.
Hiển thị danh mục nguyên liệu và dụng cụ làm bánh.
Tìm kiếm, lọc và sắp xếp sản phẩm.
Xem chi tiết sản phẩm, giá bán, quy cách đóng gói và tình trạng tồn kho.
Xem danh sách và chi tiết công thức làm bánh.
Điều chỉnh số phần bánh cần làm.
Tự động quy đổi định lượng nguyên liệu theo số phần bánh.
Đề xuất quy cách đóng gói phù hợp với lượng nguyên liệu cần mua.
Hiển thị các dụng cụ được đề xuất và cho phép khách hàng chọn hoặc bỏ chọn.
Thêm nguyên liệu và dụng cụ đã chọn vào giỏ hàng từ công thức.
Xem giỏ hàng, thay đổi số lượng và xóa sản phẩm.
Nhập thông tin nhận hàng, xem tổng tiền và đặt hàng.
Hỗ trợ phương thức thanh toán khi nhận hàng (COD).
B. Chức năng quản trị
Thêm, sửa, ẩn hoặc xóa sản phẩm theo quy tắc quản lý dữ liệu.
Quản lý danh mục sản phẩm.
Quản lý quy cách đóng gói, giá bán và số lượng tồn kho.
Thêm, sửa và quản lý công thức làm bánh.
Thiết lập mối liên hệ giữa công thức, nguyên liệu, sản phẩm và dụng cụ.
Quản lý đơn hàng và cập nhật trạng thái xử lý.
Quản lý thông tin tài khoản và phân quyền quản trị.
## Ngoài phạm vi
Tích hợp API vận chuyển để tính phí và theo dõi giao hàng theo thời gian thực.
Tích hợp cổng thanh toán trực tuyến hoặc QR ngân hàng động thông qua nhà cung cấp bên thứ ba.
Hệ thống tích điểm thành viên và đổi thưởng.
Gợi ý sản phẩm cá nhân hóa bằng trí tuệ nhân tạo.
Chatbot AI tư vấn làm bánh.
Hệ thống đề xuất công thức dựa trên lịch sử mua hàng và hành vi người dùng.
Lưu danh sách nguyên liệu sẵn có tại nhà giữa nhiều phiên đăng nhập.
Tự động tối ưu giỏ hàng theo nhiều tiêu chí như giá thấp nhất, lượng nguyên liệu dư ít nhất và số gói cần mua ít nhất.
Ứng dụng di động độc lập.
Các chức năng ngoài phạm vi có thể được xem xét sau khi nhóm hoàn thành và kiểm thử luồng nghiệp vụ cốt lõi.
## 3. Người dùng
3.1. Khách vãng lai (Guest)
Mô tả: Người truy cập website chưa đăng nhập.
Quyền hạn:
Xem trang chủ, danh mục và chi tiết sản phẩm.
Tìm kiếm, lọc và sắp xếp sản phẩm.
Xem danh sách và chi tiết công thức.
Điều chỉnh số phần bánh và xem định lượng được quy đổi.
Xem quy cách đóng gói, dụng cụ đề xuất và chi phí dự kiến.
Thêm sản phẩm vào giỏ hàng và tiến hành đặt hàng theo quy trình hỗ trợ khách chưa đăng nhập.
3.2. Khách hàng (Customer)
Mô tả: Người mua hàng có tài khoản trên BakeMate.
Quyền hạn:
Thực hiện các thao tác của khách vãng lai.
Đăng ký, đăng nhập và cập nhật thông tin cá nhân.
Đặt hàng và xem thông tin đơn hàng của chính mình.
Theo dõi trạng thái xử lý đơn hàng.
Xem lịch sử mua hàng.
Không được truy cập khu vực quản trị hoặc thay đổi dữ liệu của khách hàng khác.
3.3. Quản trị viên (Admin)
Mô tả: Người chịu trách nhiệm quản lý và vận hành website.
Quyền hạn:
Quản lý sản phẩm, danh mục, giá bán, quy cách đóng gói và tồn kho.
Quản lý công thức, định lượng nguyên liệu và dụng cụ đề xuất.
Quản lý đơn hàng và cập nhật trạng thái xử lý.
Quản lý tài khoản và quyền truy cập theo phạm vi được cấp.
Xem dữ liệu phục vụ vận hành website.
Không để người dùng thông thường truy cập các chức năng quản trị.
## 4. Yêu cầu chức năng
4.1. Quy ước mức độ ưu tiên
Must: Bắt buộc đối với phiên bản đầu tiên.
Should: Nên có nếu nguồn lực và thời gian cho phép.
Could: Chức năng nâng cao, có thể phát triển sau.
4.2. Danh sách yêu cầu chức năng
F01. Trang chủ
Mô tả: Hiển thị banner, danh mục sản phẩm, công thức nổi bật, sản phẩm nổi bật và thông tin khuyến mãi nếu có.
Người sử dụng: Guest, Customer.
Mức độ ưu tiên: Must.
Tiêu chí nghiệm thu:
Trang chủ truy cập được từ menu chính.
Các khu vực nội dung được hiển thị rõ ràng.
Người dùng có thể mở trang sản phẩm hoặc công thức từ các mục được giới thiệu.
F02. Hiển thị danh mục sản phẩm
Mô tả: Phân loại sản phẩm thành các nhóm nguyên liệu và dụng cụ làm bánh.
Người sử dụng: Guest, Customer, Admin.
Mức độ ưu tiên: Must.
Tiêu chí nghiệm thu:
Sản phẩm được gắn với danh mục phù hợp.
Người dùng có thể truy cập danh mục để xem các sản phẩm liên quan.
Sản phẩm không bị hiển thị sai danh mục do dữ liệu cấu hình.
F03. Tìm kiếm, lọc và sắp xếp sản phẩm
Mô tả: Cho phép tìm sản phẩm theo tên và lọc theo danh mục, khoảng giá hoặc tình trạng tồn kho; hỗ trợ sắp xếp theo các tiêu chí có sẵn.
Người sử dụng: Guest, Customer.
Mức độ ưu tiên: Must.
Tiêu chí nghiệm thu:
Từ khóa tìm kiếm trả về sản phẩm phù hợp với dữ liệu đã nhập.
Bộ lọc chỉ hiển thị các sản phẩm thỏa mãn điều kiện được chọn.
Sắp xếp theo giá hoạt động đúng thứ tự.
Trường hợp không có kết quả, website hiển thị thông báo phù hợp.
F04. Chi tiết sản phẩm
Mô tả: Hiển thị tên, hình ảnh, mô tả, giá bán, quy cách đóng gói và tình trạng tồn kho của sản phẩm.
Người sử dụng: Guest, Customer.
Mức độ ưu tiên: Must.
Tiêu chí nghiệm thu:
Mỗi sản phẩm có trang chi tiết riêng.
Giá và quy cách đóng gói khớp với dữ liệu quản trị.
Sản phẩm hết hàng được nhận diện rõ ràng.
Người dùng không thể đặt số lượng vượt quá tồn kho khả dụng.
F05. Danh sách công thức làm bánh
Mô tả: Hiển thị kho công thức và hỗ trợ phân loại theo loại bánh, độ khó hoặc thời gian thực hiện nếu có dữ liệu.
Người sử dụng: Guest, Customer, Admin.
Mức độ ưu tiên: Must.
Tiêu chí nghiệm thu:
Công thức đã được công khai xuất hiện trong danh sách.
Mỗi công thức có tên và thông tin giới thiệu cơ bản.
Người dùng có thể mở trang chi tiết của công thức.
Công thức chưa công khai không xuất hiện với khách hàng.
F06. Chi tiết công thức
Mô tả: Hiển thị thông tin công thức, số phần gốc, nguyên liệu và định lượng gốc, hướng dẫn thực hiện và dụng cụ được đề xuất.
Người sử dụng: Guest, Customer, Admin.
Mức độ ưu tiên: Must.
Tiêu chí nghiệm thu:
Công thức hiển thị đầy đủ các nguyên liệu và định lượng đã cấu hình.
Số phần gốc được xác định rõ.
Hướng dẫn thực hiện được trình bày theo thứ tự.
Các nguyên liệu và dụng cụ có thể liên kết đến sản phẩm tương ứng khi dữ liệu liên kết tồn tại.
F07. Điều chỉnh số phần bánh
Mô tả: Cho phép khách hàng nhập hoặc tăng giảm số phần bánh cần làm.
Người sử dụng: Guest, Customer.
Mức độ ưu tiên: Must.
Tiêu chí nghiệm thu:
Người dùng có thể nhập số phần bánh hợp lệ.
Khi số phần thay đổi, định lượng nguyên liệu được cập nhật theo số phần mới.
Hệ thống từ chối giá trị không hợp lệ như số phần bằng 0, số âm hoặc dữ liệu không phải số.
Số phần gốc của công thức không bị thay đổi trong dữ liệu lưu trữ chỉ vì khách hàng điều chỉnh trên giao diện.
F08. Tự động quy đổi định lượng nguyên liệu
Mô tả: Tính định lượng mới dựa trên định lượng gốc và tỷ lệ thay đổi số phần bánh.
Công thức:
Định lượng mới = Định lượng gốc × Số phần mới / Số phần gốc
Người sử dụng: Guest, Customer.
Mức độ ưu tiên: Must.
Tiêu chí nghiệm thu:
Kết quả tính toán đúng với công thức quy đổi.
Khi số phần mới bằng số phần gốc, định lượng không thay đổi.
Tất cả nguyên liệu có định lượng hợp lệ đều được tính lại.
Đơn vị đo được hiển thị nhất quán và không tự ý cộng các đơn vị không tương thích.
F09. Ghép nguyên liệu với quy cách đóng gói
Mô tả: Ghép lượng nguyên liệu cần dùng với sản phẩm và quy cách đóng gói đang bán, tính số gói tối thiểu cần mua và chi phí dự kiến.
Người sử dụng: Guest, Customer, Admin.
Mức độ ưu tiên: Must.
Tiêu chí nghiệm thu:
Mỗi nguyên liệu trong công thức được liên kết với sản phẩm tương ứng khi có dữ liệu hợp lệ.
Số gói được tính theo nguyên tắc làm tròn lên để đáp ứng lượng cần mua.
Ví dụ: công thức cần 350 g bột mì và sản phẩm được bán theo gói 500 g thì hệ thống đề xuất 1 gói.
Hệ thống hiển thị số lượng cần dùng, số lượng phải mua và lượng dư dự kiến khi xác định được.
Chi phí dự kiến được tính từ giá bán và số gói đề xuất.
Nếu không tìm thấy sản phẩm phù hợp hoặc sản phẩm không đủ điều kiện mua, hệ thống thông báo rõ thay vì tự tạo sản phẩm thay thế.
F10. Gợi ý và lựa chọn dụng cụ
Mô tả: Hiển thị các dụng cụ được đề xuất cho công thức, cho phép khách hàng chọn hoặc bỏ chọn dụng cụ đã có.
Người sử dụng: Guest, Customer, Admin.
Mức độ ưu tiên: Must.
Tiêu chí nghiệm thu:
Các dụng cụ được cấu hình cho công thức xuất hiện trong danh sách đề xuất.
Khách hàng có thể chọn hoặc bỏ chọn từng dụng cụ.
Chỉ các dụng cụ được chọn mới được đưa vào danh sách mua hàng từ công thức.
Việc bỏ chọn dụng cụ không làm mất nguyên liệu cần thiết của công thức.
F11. Chuyển công thức thành giỏ hàng
Mô tả: Tạo giỏ hàng từ nguyên liệu và dụng cụ khách hàng đã chọn sau khi quy đổi định lượng và xác định quy cách đóng gói.
Người sử dụng: Guest, Customer.
Mức độ ưu tiên: Must.
Tiêu chí nghiệm thu:
Khách hàng có thể tạo giỏ hàng từ một công thức.
Giỏ hàng chỉ chứa các nguyên liệu và dụng cụ đã chọn.
Số lượng sản phẩm phản ánh kết quả tính toán ở F07–F10.
Sản phẩm hết hàng hoặc không đủ tồn kho được thông báo và không được thêm vượt quá số lượng khả dụng.
Tổng tiền giỏ hàng được cập nhật theo giá và số lượng sản phẩm.
Nếu một sản phẩm được thêm nhiều lần, hệ thống xử lý theo quy tắc giỏ hàng đã thống nhất, không tạo ra tổng tiền sai.
F12. Quản lý giỏ hàng
Mô tả: Cho phép khách hàng xem giỏ hàng, thay đổi số lượng và xóa sản phẩm.
Người sử dụng: Guest, Customer.
Mức độ ưu tiên: Must.
Tiêu chí nghiệm thu:
Khách hàng xem được tên, số lượng, đơn giá và thành tiền của từng sản phẩm.
Khi số lượng thay đổi, thành tiền và tổng tiền được cập nhật.
Khách hàng có thể xóa sản phẩm khỏi giỏ hàng.
Số lượng không được nhỏ hơn 1 đối với sản phẩm còn trong giỏ hàng.
Hệ thống kiểm tra tồn kho trước khi xác nhận đơn hàng.
F13. Đặt hàng và thanh toán khi nhận hàng (COD)
Mô tả: Thu thập thông tin giao hàng, kiểm tra dữ liệu đơn hàng, hiển thị tổng tiền và tạo đơn hàng với phương thức COD.
Người sử dụng: Guest, Customer, Admin.
Mức độ ưu tiên: Must.
Tiêu chí nghiệm thu:
Khách hàng phải cung cấp các trường thông tin bắt buộc theo quy định của biểu mẫu.
Hệ thống kiểm tra dữ liệu đầu vào trước khi tạo đơn hàng.
Tổng tiền được tính từ các khoản tiền hợp lệ của đơn hàng.
Đơn hàng được tạo thành công khi thông tin hợp lệ và sản phẩm đáp ứng điều kiện đặt hàng.
Sau khi đặt hàng, khách hàng nhận được thông báo xác nhận và mã đơn hàng.
Đơn hàng được lưu để quản trị viên xem và xử lý.
Hệ thống không tạo đơn hàng thành công nếu dữ liệu không hợp lệ hoặc tồn kho không đáp ứng.
F14. Quản lý sản phẩm và danh mục
Mô tả: Cung cấp chức năng quản trị để thêm, sửa, ẩn hoặc xóa sản phẩm và quản lý danh mục.
Người sử dụng: Admin.
Mức độ ưu tiên: Must.
Tiêu chí nghiệm thu:
Chỉ người có quyền quản trị phù hợp mới truy cập được chức năng.
Admin có thể thêm sản phẩm với các thông tin bắt buộc.
Admin có thể sửa thông tin sản phẩm và gán danh mục.
Sản phẩm được cập nhật hiển thị đúng trên giao diện khách hàng.
Hệ thống kiểm tra dữ liệu bắt buộc như tên, giá và danh mục trước khi lưu.
F15. Quản lý công thức và định lượng
Mô tả: Cho phép Admin tạo và cập nhật công thức, số phần gốc, nguyên liệu, định lượng và dụng cụ liên quan.
Người sử dụng: Admin.
Mức độ ưu tiên: Must.
Tiêu chí nghiệm thu:
Admin có thể tạo và chỉnh sửa công thức.
Mỗi công thức có số phần gốc hợp lệ.
Nguyên liệu, định lượng và đơn vị đo được lưu đầy đủ.
Dữ liệu công thức cập nhật được phản ánh trên trang chi tiết.
Công thức không có đủ dữ liệu cần thiết không được đưa vào quy trình tính toán và tạo giỏ hàng.
F16. Quản lý quy cách đóng gói, giá và tồn kho
Mô tả: Quản lý các quy cách bán sản phẩm, giá bán, số lượng tồn kho và mối liên kết giữa nguyên liệu trong công thức với sản phẩm thương mại.
Người sử dụng: Admin.
Mức độ ưu tiên: Must.
Tiêu chí nghiệm thu:
Admin có thể cập nhật giá, quy cách đóng gói và tồn kho.
Mỗi quy cách đóng gói có đơn vị và lượng đóng gói xác định.
Hệ thống sử dụng dữ liệu quy cách đã lưu khi tính số gói cần mua.
Thay đổi giá được phản ánh trong chi phí dự kiến của giỏ hàng mới.
Số lượng đặt mua không được vượt quá tồn kho khả dụng.
F17. Quản lý và xử lý đơn hàng
Mô tả: Cho phép Admin xem danh sách đơn hàng, xem chi tiết và cập nhật trạng thái xử lý.
Người sử dụng: Admin, Customer.
Mức độ ưu tiên: Must.
Tiêu chí nghiệm thu:
Admin xem được mã đơn, thông tin nhận hàng, sản phẩm, số lượng và tổng tiền.
Admin có thể cập nhật trạng thái đơn hàng theo quy trình được thống nhất.
Khách hàng chỉ xem được các đơn hàng thuộc tài khoản của mình nếu chức năng lịch sử đơn hàng được cung cấp.
Trạng thái đơn hàng được hiển thị nhất quán giữa khu vực quản trị và giao diện khách hàng.
Các thao tác cập nhật trạng thái không cho phép người dùng thông thường sửa dữ liệu đơn hàng.
F18. Đăng ký, đăng nhập và tài khoản
Mô tả: Cho phép khách hàng tạo tài khoản, đăng nhập và quản lý thông tin cá nhân cơ bản.
Người sử dụng: Guest, Customer, Admin.
Mức độ ưu tiên: Should.
Tiêu chí nghiệm thu:
Người dùng có thể đăng ký với thông tin hợp lệ.
Hệ thống xử lý trường hợp tài khoản đã tồn tại.
Người dùng có thể đăng nhập bằng thông tin xác thực hợp lệ.
Người dùng không thể truy cập chức năng quản trị nếu không có quyền.
Quy trình đặt hàng không bắt buộc phải đăng nhập nếu nhóm triển khai hỗ trợ mua hàng với tư cách khách vãng lai.
F19. Lịch sử và trạng thái đơn hàng
Mô tả: Cho phép khách hàng đã đăng nhập xem các đơn hàng thuộc tài khoản của mình và trạng thái hiện tại.
Người sử dụng: Customer, Admin.
Mức độ ưu tiên: Should.
Tiêu chí nghiệm thu:
Khách hàng xem được danh sách đơn hàng của chính mình.
Mỗi đơn hàng hiển thị mã đơn, ngày đặt, tổng tiền và trạng thái.
Khách hàng không thể xem thông tin đơn hàng của tài khoản khác.
Trạng thái hiển thị khớp với trạng thái được quản trị viên cập nhật.
F20. Mã giảm giá
Mô tả: Cho phép khách hàng nhập mã giảm giá hợp lệ khi đặt hàng.
Người sử dụng: Guest, Customer, Admin.
Mức độ ưu tiên: Could.
Tiêu chí nghiệm thu:
Mã hợp lệ được áp dụng theo điều kiện đã cấu hình.
Mã không hợp lệ, hết hạn hoặc không đạt điều kiện được thông báo.
Số tiền giảm không vượt quá giới hạn được quy định.
Tổng tiền sau giảm giá được tính lại chính xác.
F21. Đánh giá sản phẩm
Mô tả: Cho phép khách hàng gửi đánh giá cho sản phẩm theo quy định của website.
Người sử dụng: Customer, Admin.
Mức độ ưu tiên: Could.
Tiêu chí nghiệm thu:
Khách hàng có thể gửi đánh giá khi đáp ứng điều kiện được quy định.
Nội dung đánh giá được kiểm tra trước khi lưu.
Đánh giá được gắn với đúng sản phẩm.
Admin có thể quản lý hoặc ẩn nội dung không phù hợp theo quy tắc của website.
F22. Quản lý chương trình khuyến mãi
Mô tả: Cho phép Admin tạo và cập nhật thông tin chương trình khuyến mãi được hiển thị trên website.
Người sử dụng: Admin, Guest, Customer.
Mức độ ưu tiên: Should.
Tiêu chí nghiệm thu:
Admin có thể cập nhật nội dung và thời gian chương trình.
Chương trình đã hết hạn không được hiển thị như chương trình đang diễn ra.
Giá khuyến mãi, nếu có, phải được áp dụng nhất quán với quy tắc giá đã cấu hình.
F23. Yêu cầu hủy đơn hàng
Mô tả: Cho phép khách hàng gửi yêu cầu hủy đơn theo điều kiện và trạng thái đơn hàng được quy định.
Người sử dụng: Customer, Admin.
Mức độ ưu tiên: Should.
Tiêu chí nghiệm thu:
Khách hàng chỉ có thể gửi yêu cầu hủy khi đơn hàng đáp ứng điều kiện.
Hệ thống thông báo nếu đơn hàng không còn đủ điều kiện hủy.
Yêu cầu hủy được lưu để Admin xử lý.
Trạng thái đơn hàng được cập nhật theo kết quả xử lý, không tự động hủy các đơn đã ở trạng thái không cho phép.
F24. Thanh toán trực tuyến
Mô tả: Tích hợp một phương thức thanh toán trực tuyến thông qua nhà cung cấp phù hợp.
Người sử dụng: Customer, Admin.
Mức độ ưu tiên: Could; cần xác minh khả năng tích hợp.
Tiêu chí nghiệm thu:
Chỉ triển khai khi nhóm thống nhất nhà cung cấp và môi trường thử nghiệm.
Kết quả thanh toán được xác minh trước khi cập nhật trạng thái thanh toán.
Giao dịch thất bại không được ghi nhận là thanh toán thành công.
Thông tin bí mật và khóa tích hợp không được công khai trong mã nguồn.
F25. Tích hợp vận chuyển
Mô tả: Tích hợp dịch vụ vận chuyển để tính phí hoặc hỗ trợ theo dõi giao hàng.
Người sử dụng: Customer, Admin.
Mức độ ưu tiên: Could; cần xác minh khả năng tích hợp.
Tiêu chí nghiệm thu:
Chỉ triển khai khi nhóm thống nhất nhà cung cấp và phạm vi tích hợp.
Phí vận chuyển được hiển thị rõ ràng trước khi đặt hàng.
Khi dịch vụ ngoài không khả dụng, website không được hiển thị phí vận chuyển chưa được xác nhận như dữ liệu chính xác.
F26. Lưu danh sách nguyên liệu sẵn có
Mô tả: Cho phép khách hàng lưu danh sách nguyên liệu và dụng cụ đang có để hỗ trợ lựa chọn mua hàng trong những lần tiếp theo.
Người sử dụng: Customer.
Mức độ ưu tiên: Could.
Tiêu chí nghiệm thu:
Danh sách được lưu theo tài khoản khách hàng.
Khách hàng có thể thêm hoặc xóa nguyên liệu trong danh sách.
Hệ thống chỉ đề xuất mua các nguyên liệu chưa được đánh dấu là đã có, theo quy tắc đã cấu hình.
Dữ liệu giữa các tài khoản được tách biệt.
F27. Chatbot hỗ trợ
Mô tả: Cung cấp công cụ hỏi đáp về sản phẩm, công thức và cách sử dụng website.
Người sử dụng: Guest, Customer.
Mức độ ưu tiên: Could.
Tiêu chí nghiệm thu:
Chatbot trả lời được các câu hỏi nằm trong phạm vi nội dung được cấu hình.
Câu hỏi ngoài phạm vi được thông báo rõ hoặc hướng người dùng đến kênh hỗ trợ.
Chatbot không được tự khẳng định thông tin về giá, tồn kho hoặc đơn hàng khi chưa có dữ liệu xác thực.
F28. Gợi ý sản phẩm hoặc công thức
Mô tả: Đề xuất sản phẩm hoặc công thức dựa trên danh mục, loại bánh hoặc dữ liệu tương tác sẵn có.
Người sử dụng: Guest, Customer.
Mức độ ưu tiên: Could.
Tiêu chí nghiệm thu:
Các gợi ý phải liên quan đến danh mục hoặc tiêu chí được lựa chọn.
Chỉ gợi ý sản phẩm đang được phép hiển thị và có thông tin hợp lệ.
Nếu chưa đủ dữ liệu để cá nhân hóa, website hiển thị các sản phẩm hoặc công thức nổi bật thay thế.
## 5. Yêu cầu phi chức năng
NFR01. Khả năng đáp ứng nhiều kích thước màn hình
Website cần hiển thị và sử dụng được trên máy tính, máy tính bảng và điện thoại. Các thành phần như menu, danh sách sản phẩm, biểu mẫu và giỏ hàng không được chồng lấn làm cản trở thao tác chính.
NFR02. Kiểm tra dữ liệu đầu vào
Các trường dữ liệu như giá, số lượng, số phần bánh, định lượng nguyên liệu và thông tin nhận hàng phải được kiểm tra trước khi xử lý. Dữ liệu không hợp lệ phải được từ chối hoặc yêu cầu người dùng nhập lại.
NFR03. Tính chính xác của phép tính
Phép quy đổi định lượng phải tuân theo công thức đã xác định.
Số gói mua được tính bằng cách làm tròn lên lượng cần thiết chia cho lượng trong mỗi gói.
Tổng tiền phải dựa trên giá bán và số lượng hợp lệ.
Các phép tính phải được kiểm tra bằng bộ dữ liệu thử nghiệm có kết quả mong đợi xác định trước.
NFR04. Bảo vệ quyền truy cập
Các chức năng quản trị phải được giới hạn cho tài khoản có quyền phù hợp. Người dùng thông thường không được tự ý sửa sản phẩm, tồn kho, công thức hoặc đơn hàng của người khác.
NFR05. Bảo vệ thông tin
Website không được công khai mật khẩu, khóa API, thông tin xác thực hoặc dữ liệu cá nhân không cần thiết. Thông tin khách hàng chỉ được sử dụng trong phạm vi phục vụ hoạt động của website.
NFR06. Tính nhất quán dữ liệu
Tên sản phẩm, giá, quy cách đóng gói, tồn kho và trạng thái đơn hàng phải được sử dụng nhất quán giữa trang chi tiết, giỏ hàng, bước đặt hàng và khu vực quản trị.
NFR07. Khả năng sử dụng
Các thao tác chính - tìm công thức, thay đổi số phần, xem định lượng, chọn sản phẩm và tạo giỏ hàng - cần có hướng dẫn rõ ràng. Thông báo lỗi phải nêu được vấn đề và cách xử lý khi có thể.
NFR08. Khả năng bảo trì mã nguồn
Mã nguồn cần được tổ chức theo chức năng, có tên tệp và tên biến dễ hiểu. Logic quy đổi định lượng và ghép quy cách đóng gói cần được tách biệt đủ rõ để có thể kiểm thử và sửa đổi.
NFR09. Tính tương thích
Website cần hoạt động trên các trình duyệt phổ biến mà nhóm lựa chọn để kiểm thử. Các chức năng quan trọng không được phụ thuộc vào một thao tác chỉ khả dụng trên một loại thiết bị duy nhất.
NFR10. Khả năng kiểm thử
Các luồng chính phải có kịch bản kiểm thử, dữ liệu đầu vào và kết quả mong đợi. Tối thiểu cần kiểm thử quy đổi định lượng, tính số gói, tính tổng tiền, kiểm tra tồn kho, tạo giỏ hàng và đặt hàng.
## 6. Giới hạn và giả định
Giới hạn dự án
Thời gian thực hiện dự kiến là 8 tuần.
Quy mô nhóm dự kiến là 8 thành viên.
Dự án được thực hiện trong khuôn khổ học phần Phát triển ứng dụng WEB/TMĐT.
Nguồn lực và thời gian có giới hạn nên không triển khai toàn bộ chức năng nâng cao ngay trong phiên bản đầu tiên.
Các chức năng cần kết nối dịch vụ bên thứ ba phụ thuộc vào tài liệu kỹ thuật, quyền truy cập và môi trường thử nghiệm của nhà cung cấp.
Độ chính xác của kết quả tính toán phụ thuộc vào dữ liệu công thức, đơn vị đo, quy cách đóng gói và giá bán do nhóm cấu hình.
Website sử dụng dữ liệu sản phẩm, công thức và đơn hàng phục vụ học tập; không mặc định có hệ thống vận hành thương mại thực tế.
Giả định
Mỗi công thức có số phần gốc và định lượng nguyên liệu hợp lệ.
Nguyên liệu trong công thức có thể được liên kết với một hoặc nhiều sản phẩm đang bán.
Mỗi quy cách đóng gói có lượng đóng gói, đơn vị đo và giá bán xác định.
Hệ thống sử dụng quy tắc làm tròn lên để xác định số gói cần mua; phiên bản đầu tiên ưu tiên quy tắc đơn giản, dễ kiểm tra.
Giá bán và tồn kho được Admin cập nhật trong hệ thống.
Phương thức COD được sử dụng làm phương thức thanh toán cơ bản trong phiên bản đầu tiên.
Phí vận chuyển được xử lý theo quy tắc đơn giản do nhóm thống nhất; việc tích hợp API vận chuyển chưa được mặc định là bắt buộc.
Công nghệ cuối cùng cần được các thành viên xác nhận. WordPress/WooCommerce là phương án có thể xem xét để tận dụng chức năng thương mại điện tử có sẵn; Laravel là phương án thay thế nếu nhóm thống nhất phát triển theo hướng tự xây dựng nhiều thành phần.
Việc triển khai và nghiệm thu từng chức năng phụ thuộc vào kết quả phân công, tích hợp và kiểm thử của nhóm.
Danh sách chức năng nâng cao sẽ thực hiện nếu còn thời gian sau khi hoàn thành các chức năng Must.

