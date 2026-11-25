<?php
declare(strict_types=1);
?>
<footer class="site-footer">
  <div class="footer-container">
    <div class="footer-col footer-col--brand">
      <div class="footer-brand">
        <h3 class="footer-brand__title">BakeMate</h3>
        <span class="footer-brand__tagline">Làm bánh chuẩn vị, nguyên liệu chuẩn tay</span>
      </div>
      <p class="footer-col__desc">Nền tảng thương mại điện tử chuyên cung cấp nguyên liệu, dụng cụ và phụ kiện làm bánh chuẩn công thức hàng đầu dành cho người yêu bánh tại Việt Nam.</p>
    </div>

    <div class="footer-col">
      <h3 class="footer-col__title">Khám phá</h3>
      <ul class="footer-col__list">
        <li><a href="<?= App::e(App::url('')) ?>">Trang chủ</a></li>
        <li><a href="<?= App::e(App::url('?c=product&a=catalog')) ?>">Danh mục sản phẩm</a></li>
        <li><a href="<?= App::e(App::url('?c=recipe&a=index')) ?>">Công thức làm bánh</a></li>
        <li><a href="<?= App::e(App::url('?c=home&a=blog')) ?>">Blog làm bánh</a></li>
        <li><a href="<?= App::e(App::url('?c=home&a=about')) ?>">Về BakeMate</a></li>
        <li><a href="<?= App::e(App::url('?c=order&a=orders')) ?>">Theo dõi đơn hàng</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h3 class="footer-col__title">Hỗ trợ khách hàng</h3>
      <ul class="footer-col__list footer-policy-list">
        <li><a href="#" class="js-policy-trigger" data-policy="guide">Hướng dẫn mua hàng</a></li>
        <li><a href="#" class="js-policy-trigger" data-policy="shipping">Chính sách giao hàng &amp; Bảo quản</a></li>
        <li><a href="#" class="js-policy-trigger" data-policy="returns">Chính sách đổi trả &amp; Hoàn tiền</a></li>
        <li><a href="<?= App::e(App::url('?c=home&a=contact#faq-section')) ?>">Câu hỏi thường gặp (FAQ)</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h3 class="footer-col__title">Thông tin liên hệ</h3>
      <p class="footer-col__contact">59C Nguyễn Đình Chiểu, Quận 3, TP.HCM</p>
      <p class="footer-col__contact">Hotline: <strong>1900 8888</strong></p>
      <p class="footer-col__contact">Email: support@bakemate.vn</p>
      <p class="footer-col__contact">Giờ phục vụ: 08:30 – 21:00 (Hằng ngày)</p>
      <p class="footer-col__contact footer-col__cta">
        <a href="<?= App::e(App::url('?c=home&a=contact')) ?>" class="footer-contact-link">Gửi tin nhắn hỗ trợ &rarr;</a>
      </p>
    </div>
  </div>

  <div class="footer-bottom">
    <div class="footer-bottom__inner">
      <p class="footer-bottom__copy">&copy; 2026 BakeMate - Dự án học phần TMĐT Nhóm 3 (Phiên bản PHP OOP MVC + MySQL).</p>
      <div class="footer-bottom__payments" aria-label="Phương thức thanh toán chấp nhận">
        <span class="payment-badge payment-badge--logo" title="Tiền mặt (COD)" aria-label="Tiền mặt (COD)">
          <svg width="34" height="22" viewBox="0 0 36 24" fill="none" aria-hidden="true">
            <rect x="6" y="2.5" width="27" height="15" rx="2.5" fill="#bbf7d0" stroke="#15803d" stroke-width="1.6"/>
            <rect x="2" y="6.5" width="27" height="15" rx="2.5" fill="#dcfce7" stroke="#15803d" stroke-width="1.7"/>
            <circle cx="15.5" cy="14" r="3.4" fill="#16a34a" opacity="0.22" stroke="#15803d" stroke-width="1.4"/>
            <circle cx="6.2" cy="14" r="1.1" fill="#15803d"/>
            <circle cx="24.8" cy="14" r="1.1" fill="#15803d"/>
          </svg>
        </span>

        <span class="payment-badge payment-badge--logo" title="Chuyển khoản VietQR" aria-label="Chuyển khoản VietQR">
          <svg width="72" height="22" viewBox="0 0 88 24" fill="none" aria-hidden="true">
            <rect x="2" y="4" width="6.5" height="6.5" rx="1.2" stroke="#00529C" stroke-width="1.8"/>
            <rect x="4.1" y="6.1" width="2.3" height="2.3" fill="#D92027"/>
            <rect x="11.5" y="4" width="6.5" height="6.5" rx="1.2" stroke="#00529C" stroke-width="1.8"/>
            <rect x="13.6" y="6.1" width="2.3" height="2.3" fill="#00529C"/>
            <rect x="2" y="13.5" width="6.5" height="6.5" rx="1.2" stroke="#00529C" stroke-width="1.8"/>
            <rect x="4.1" y="15.6" width="2.3" height="2.3" fill="#00529C"/>
            <rect x="11.5" y="13.5" width="2.8" height="2.8" rx="0.5" fill="#D92027"/>
            <rect x="15.4" y="13.5" width="2.6" height="2.6" rx="0.5" fill="#00529C"/>
            <rect x="11.5" y="17.2" width="6.5" height="2.8" rx="0.6" fill="#00529C"/>
            <text x="23" y="16.8" font-family="Be Vietnam Pro, Arial, sans-serif" font-size="13" font-weight="800" fill="#00529C">Viet</text>
            <text x="51" y="16.8" font-family="Be Vietnam Pro, Arial, sans-serif" font-size="13" font-weight="800" fill="#D92027">QR</text>
          </svg>
        </span>

        <span class="payment-badge payment-badge--logo" title="Ví điện tử MoMo" aria-label="Ví điện tử MoMo">
          <svg width="70" height="22" viewBox="0 0 84 24" fill="none" aria-hidden="true">
            <rect x="1" y="2" width="20" height="20" rx="5" fill="#A50064"/>
            <text x="11" y="10.8" text-anchor="middle" font-family="Be Vietnam Pro, Arial, sans-serif" font-size="7.2" font-weight="800" fill="#FFFFFF">mo</text>
            <text x="11" y="18.6" text-anchor="middle" font-family="Be Vietnam Pro, Arial, sans-serif" font-size="7.2" font-weight="800" fill="#FFFFFF">mo</text>
            <text x="26" y="16.6" font-family="Be Vietnam Pro, Arial, sans-serif" font-size="13" font-weight="800" fill="#A50064">MoMo</text>
          </svg>
        </span>

        <span class="payment-badge payment-badge--logo" title="VNPAY-QR" aria-label="VNPAY-QR">
          <svg width="86" height="22" viewBox="0 0 104 24" fill="none" aria-hidden="true">
            <path d="M2 5L8.2 18.5L11.6 11.2L8.4 5H2Z" fill="#E61E2A"/>
            <path d="M8.2 18.5L14.8 5H19.2L12.4 18.5H8.2Z" fill="#005BAA"/>
            <text x="22" y="16.6" font-family="Be Vietnam Pro, Arial, sans-serif" font-size="12.5" font-weight="800" fill="#E61E2A">VN</text>
            <text x="41.5" y="16.6" font-family="Be Vietnam Pro, Arial, sans-serif" font-size="12.5" font-weight="800" fill="#005BAA">PAY</text>
            <rect x="71" y="5" width="29" height="14" rx="3" fill="#005BAA"/>
            <text x="85.5" y="15.2" text-anchor="middle" font-family="Be Vietnam Pro, Arial, sans-serif" font-size="9.5" font-weight="800" fill="#FFFFFF">QR</text>
          </svg>
        </span>
      </div>
    </div>
  </div>
</footer>

<div class="bm-modal-backdrop" id="bm-policy-modal" hidden>
  <div class="bm-modal bm-modal--cream" role="dialog" aria-modal="true" aria-labelledby="bm-policy-title">
    <div class="bm-modal__head">
      <h3 id="bm-policy-title">Chính sách BakeMate</h3>
      <button type="button" class="bm-modal__close js-policy-close" aria-label="Đóng">&times;</button>
    </div>
    <div class="bm-modal__body" id="bm-policy-body"></div>
    <div class="bm-modal__actions bm-modal__actions--single">
      <button type="button" class="btn btn--primary btn--full js-policy-close">Quay lại</button>
    </div>
  </div>
</div>

<div class="bm-modal-backdrop" id="bm-confirm-modal" hidden>
  <div class="bm-modal" role="dialog" aria-modal="true" aria-labelledby="bm-confirm-title">
    <div class="bm-modal__head">
      <h3 id="bm-confirm-title">Xác nhận thao tác</h3>
      <button type="button" class="bm-modal__close js-confirm-close" aria-label="Đóng">&times;</button>
    </div>
    <div class="bm-modal__body">
      <p id="bm-confirm-msg"></p>
      <div class="bm-modal__actions">
        <button type="button" class="btn btn--outline btn--sm" id="bm-confirm-cancel">Hủy</button>
        <button type="button" class="btn btn--primary btn--sm" id="bm-confirm-ok">Đồng ý</button>
      </div>
    </div>
  </div>
</div>

<div id="bm-toast-container" class="bm-toast-container" aria-live="polite"></div>

<script src="<?= App::e(App::asset('js/app.js')) ?>"></script>
</body>
</html>
