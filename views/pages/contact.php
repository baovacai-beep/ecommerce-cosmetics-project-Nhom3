<?php
declare(strict_types=1);
$faqs = [
    ['1. Phí vận chuyển mặc định và thời gian giao hàng của BakeMate là bao lâu?', 'Tại Giỏ hàng, hệ thống tạm tính phí vận chuyển mặc định là <strong>25.000 ₫</strong>. Khi qua bước Thanh toán, nội thành TP.HCM hỗ trợ Nhận tại cửa hàng (0 ₫), Giao tiêu chuẩn 1–2 ngày (20.000 ₫) và Giao Hỏa tốc 2 giờ (40.000 ₫); các tỉnh thành khác giao từ 2–4 ngày (20.000–30.000 ₫). Nhập mã <strong>FREESHIP20</strong> để giảm 20.000 ₫ phí ship cho đơn hàng từ 200.000 ₫.'],
    ['2. Nguyên liệu tươi lạnh (Bơ lạt Anchor, Whipping Cream, Trứng gà) có giao đi tỉnh không?', 'Để giữ trọn độ tươi ngon và nhiệt độ bảo quản 2–4°C, các sản phẩm cần giữ lạnh hiện chỉ hỗ trợ giao <strong>Hỏa tốc 2 giờ trong nội thành TP.HCM</strong> hoặc nhận trực tiếp tại cửa hàng 59C Nguyễn Đình Chiểu, Quận 3. Hệ thống tự động cảnh báo và bảo vệ ở trang Thanh toán.'],
    ['3. Chức năng Recipe-to-Cart và quy đổi khẩu phần hoạt động như thế nào?', 'Khi tăng hoặc giảm số khẩu phần tại trang chi tiết Công thức, BakeMate tự động tính lại gram/ml nguyên liệu và gợi ý số túi đóng gói phù hợp. Bạn có thể đánh dấu những nguyên liệu đã có sẵn ở bếp, rồi bấm 1 nút để gom phần còn thiếu vào Giỏ hàng dưới dạng Combo riêng biệt.'],
    ['4. Tôi có thể dùng cùng lúc nhiều mã giảm giá trên một đơn hàng không?', 'Có! BakeMate cho phép cộng dồn tối đa <strong>1 mã giảm giá tiền hàng</strong> (ví dụ: <strong>CHAOBANMOI</strong> giảm 10%) cùng <strong>1 mã miễn/giảm phí vận chuyển</strong> (ví dụ: <strong>FREESHIP20</strong> giảm 20.000 ₫ ship cho đơn từ 200.000 ₫).'],
    ['5. Mới bắt đầu làm bánh thì nên chọn loại bột mì và quy cách túi nào?', 'Dùng <strong>Bột mì số 8</strong> cho bánh bông lan, chiffon, cupcake; <strong>Bột mì số 11</strong> cho bánh mì hoa cúc, baguette; và <strong>Bột mì đa dụng Meizan</strong> cho cookie, muffin, pancake. Nếu làm thử mẻ nhỏ, hãy chọn túi 100g hoặc 300g.'],
    ['6. BakeMate có hỗ trợ đổi trả nếu sản phẩm bị lỗi bao bì hoặc sai quy cách không?', 'BakeMate hỗ trợ đổi mới 1–1 trong vòng 7 ngày đối với nguyên liệu khô còn nguyên seal hoặc dụng cụ lỗi từ nhà sản xuất. Vui lòng giữ mã đơn hàng (dạng #BM-XXXXXX) và liên hệ Hotline 1900 8888.'],
];
?>
<main class="page-container">
  <nav class="breadcrumb" aria-label="Đường dẫn điều hướng">
    <ul class="breadcrumb__list">
      <li class="breadcrumb__item"><a href="<?= App::e(App::url('')) ?>">Trang chủ</a></li>
      <li class="breadcrumb__separator">/</li>
      <li class="breadcrumb__item active">Liên hệ</li>
    </ul>
  </nav>

  <section class="contact-hero-split">
    <div>
      <span class="about-eyebrow">CHÚNG MÌNH CÙNG TRÒ CHUYỆN NHÉ</span>
      <h1 class="recipes-hero__title" style="margin-top:8px;">BakeMate luôn sẵn sàng hỗ trợ bạn</h1>
      <p class="about-lead" style="margin-bottom:18px;">
        Dù bạn đang cần tư vấn công thức cho người mới bắt đầu, tìm đúng quy cách nguyên liệu 100g–1kg hay kiểm tra đơn hàng vừa đặt, đội ngũ BakeMate luôn lắng nghe và phản hồi trong thời gian sớm nhất.
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:10px;">
        <a href="#contact-form" class="btn btn--primary">Gửi tin nhắn ngay</a>
        <a href="<?= App::e(App::url('?c=order&a=orders')) ?>" class="btn btn--outline-dark">Tra cứu đơn hàng</a>
      </div>
    </div>
    <div class="contact-hero-split__media">
      <img src="<?= App::e(App::asset('images/contact-baking.jpg')) ?>" alt="Không gian bếp bánh và đội ngũ tư vấn BakeMate">
    </div>
  </section>

  <section class="contact-page-grid" aria-label="Thông tin liên hệ và biểu mẫu hỗ trợ">
    <aside class="contact-form-card" style="background-color:#fffdf9;">
      <h2 class="section-heading" style="text-align:left;font-size:21px;margin-bottom:6px;">Kết nối với BakeMate</h2>
      <p style="font-size:14px;color:var(--accent-sub);line-height:1.6;">Ghé thăm cửa hàng nguyên liệu hoặc liên hệ qua các kênh hỗ trợ trực tuyến bên dưới.</p>

      <div class="contact-info-list">
        <div class="contact-info-item">
          <strong>Địa chỉ cửa hàng</strong>
          <span>59C Nguyễn Đình Chiểu, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh</span>
        </div>
        <div class="contact-info-item">
          <strong>Hotline tư vấn (8:30 - 21:00)</strong>
          <a href="tel:19008888">1900 8888</a>
        </div>
        <div class="contact-info-item">
          <strong>Email hỗ trợ</strong>
          <a href="mailto:support@bakemate.vn">support@bakemate.vn</a>
        </div>
        <div class="contact-info-item">
          <strong>Giờ mở cửa</strong>
          <span>Thứ Hai - Chủ Nhật: 08:30 – 21:00</span>
        </div>
        <div class="contact-info-item">
          <strong>Kênh cộng đồng BakeMate</strong>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:4px;">
            <a href="<?= App::e(App::url('?c=home&a=blog')) ?>" class="price-preset-btn" style="text-decoration:none;">Baking Journal</a>
            <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="price-preset-btn" style="text-decoration:none;">Thư viện công thức</a>
            <a href="#faq-section" class="price-preset-btn" style="text-decoration:none;">Câu hỏi FAQ</a>
          </div>
        </div>
      </div>
    </aside>

    <div class="contact-form-card">
      <h2 class="section-heading" style="text-align:left;font-size:21px;margin-bottom:6px;">Gửi lời nhắn cho BakeMate</h2>
      <p style="font-size:14px;color:var(--accent-sub);margin-bottom:18px;">Điền thông tin bên dưới — tin nhắn sẽ được lưu vào MySQL và chuyển đến bộ phận chăm sóc khách hàng.</p>

      <div id="contact-feedback" hidden style="padding:12px 14px;border-radius:8px;font-size:14px;font-weight:600;margin-bottom:14px;"></div>

      <form id="contact-form" class="checkout-form">
        <div class="contact-form-row-2">
          <div class="form-group">
            <label for="c-name" class="form-label">Họ và tên <span class="required-mark">*</span></label>
            <input type="text" id="c-name" name="full_name" class="form-input" value="<?= App::e($currentUser['full_name'] ?? '') ?>" placeholder="Nguyễn Văn An" required>
          </div>
          <div class="form-group">
            <label for="c-email" class="form-label">Email <span class="required-mark">*</span></label>
            <input type="email" id="c-email" name="email" class="form-input" value="<?= App::e($currentUser['email'] ?? '') ?>" placeholder="banhngot@email.com" required>
          </div>
        </div>

        <div class="contact-form-row-2">
          <div class="form-group">
            <label for="c-phone" class="form-label">Số điện thoại</label>
            <input type="tel" id="c-phone" name="phone" class="form-input" value="<?= App::e($currentUser['phone'] ?? '') ?>" placeholder="0912345678">
          </div>
          <div class="form-group">
            <label for="c-topic" class="form-label">Chủ đề liên hệ <span class="required-mark">*</span></label>
            <select id="c-topic" name="topic" class="form-input" required>
              <option value="">-- Chọn chủ đề hỗ trợ --</option>
              <option value="Tư vấn nguyên liệu & quy cách">Tư vấn nguyên liệu &amp; quy cách</option>
              <option value="Hỗ trợ đơn hàng">Hỗ trợ đơn hàng (#BM)</option>
              <option value="Hỏi đáp công thức làm bánh">Hỏi đáp công thức làm bánh</option>
              <option value="Góp ý dịch vụ & hợp tác">Góp ý dịch vụ &amp; hợp tác</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="c-msg" class="form-label">Nội dung tin nhắn <span class="required-mark">*</span></label>
          <textarea id="c-msg" name="message" class="form-textarea" rows="4" placeholder="Mô tả câu hỏi hoặc mã đơn hàng để BakeMate hỗ trợ bạn nhanh nhất..." required></textarea>
        </div>

        <button type="submit" class="btn btn--primary" style="width:100%;">Gửi liên hệ</button>
      </form>
    </div>
  </section>

  <section id="faq-section" class="faq-section" aria-labelledby="faq-heading">
    <h2 class="section-heading" id="faq-heading" style="text-align:left;margin-bottom:14px;">Câu hỏi thường gặp (FAQ)</h2>
    <div style="display:grid;gap:10px;">
      <?php foreach ($faqs as $idx => $f): ?>
        <article class="faq-item <?= $idx === 0 ? 'is-open' : '' ?>">
          <button type="button" class="faq-item__trigger js-faq-trigger" aria-expanded="<?= $idx === 0 ? 'true' : 'false' ?>">
            <span><?= App::e($f[0]) ?></span>
            <span class="faq-item__icon" aria-hidden="true"><?= $idx === 0 ? '−' : '+' ?></span>
          </button>
          <div class="faq-item__panel" <?= $idx === 0 ? '' : 'hidden' ?>>
            <p><?= $f[1] ?></p>
          </div>
        </article>
      <?php endforeach; ?>
    </div>
  </section>
</main>

<script>
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".js-faq-trigger").forEach((tr) => {
    tr.addEventListener("click", () => {
      const item = tr.closest(".faq-item");
      const panel = item ? item.querySelector(".faq-item__panel") : null;
      const icon = tr.querySelector(".faq-item__icon");
      if (!item || !panel) return;
      const open = item.classList.contains("is-open");
      item.classList.toggle("is-open", !open);
      tr.setAttribute("aria-expanded", open ? "false" : "true");
      panel.hidden = open;
      if (icon) icon.textContent = open ? "+" : "−";
    });
  });

  const form = document.getElementById("contact-form");
  const fb = document.getElementById("contact-feedback");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const res = await window.BakeApp.postJson("home", "ajaxSubmitContact", Object.fromEntries(new FormData(form).entries()));
        if (fb) {
          fb.hidden = false;
          fb.style.background = "#dcfce7";
          fb.style.color = "#15803d";
          fb.textContent = res.message;
        }
        form.reset();
        window.BakeApp.showToast(res.message, "success");
      } catch (err) {
        if (fb) {
          fb.hidden = false;
          fb.style.background = "#fef2f2";
          fb.style.color = "#b91c1c";
          fb.textContent = err.message;
        }
      }
    });
  }
});
</script>
