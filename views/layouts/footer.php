<?php
declare(strict_types=1);
?>
<footer class="site-footer">
  <div class="footer-container">
    <div class="footer-col">
      <h3 class="footer-col__title">BakeMate - Làm bánh chuẩn vị</h3>
      <p class="footer-col__desc">Nền tảng thương mại điện tử cung cấp nguyên liệu, dụng cụ và phụ kiện làm bánh theo công thức hàng đầu.</p>
      <p class="footer-col__contact">Slogan: Làm bánh chuẩn vị, nguyên liệu chuẩn tay.</p>
    </div>
    <div class="footer-col">
      <h3 class="footer-col__title">Khám phá</h3>
      <ul class="footer-col__list">
        <li><a href="<?= App::e(App::url('')) ?>">Trang chủ</a></li>
        <li><a href="<?= App::e(App::url('?c=product&a=catalog')) ?>">Sản phẩm</a></li>
        <li><a href="<?= App::e(App::url('?c=recipe&a=index')) ?>">Công thức</a></li>
        <li><a href="<?= App::e(App::url('?c=home&a=blog')) ?>">Blog làm bánh</a></li>
        <li><a href="<?= App::e(App::url('?c=home&a=about')) ?>">Về chúng tôi</a></li>
        <li><a href="<?= App::e(App::url('?c=order&a=orders')) ?>">Theo dõi đơn hàng</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3 class="footer-col__title">Hỗ trợ khách hàng</h3>
      <ul class="footer-policy-list">
        <li><a href="#" class="js-policy-trigger" data-policy="guide">Hướng dẫn mua hàng</a></li>
        <li><a href="#" class="js-policy-trigger" data-policy="shipping">Chính sách giao hàng</a></li>
        <li><a href="#" class="js-policy-trigger" data-policy="returns">Chính sách đổi trả</a></li>
        <li><a href="<?= App::e(App::url('?c=home&a=contact#faq-section')) ?>">Câu hỏi thường gặp (FAQ)</a></li>
        <li><a href="<?= App::e(App::url('?c=product&a=wishlist')) ?>">Danh sách yêu thích</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3 class="footer-col__title">Liên hệ</h3>
      <p class="footer-col__contact">59C Nguyễn Đình Chiểu, Quận 3, TP.HCM</p>
      <p class="footer-col__contact">Hotline: 1900 8888</p>
      <p class="footer-col__contact">Email: support@bakemate.vn</p>
      <p class="footer-col__contact">Giờ phục vụ: 08:30 – 21:00 (Hằng ngày)</p>
      <p class="footer-col__contact"><a href="<?= App::e(App::url('?c=home&a=contact')) ?>">Gửi tin nhắn hỗ trợ &rarr;</a></p>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2026 BakeMate - Dự án học phần TMĐT Nhóm 3 (Phiên bản PHP OOP MVC + MySQL).</p>
  </div>
</footer>

<div class="bm-modal-backdrop" id="bm-policy-modal" hidden>
  <div class="bm-modal" role="dialog" aria-modal="true" aria-labelledby="bm-policy-title">
    <div class="bm-modal__head">
      <h3 id="bm-policy-title">Chính sách BakeMate</h3>
      <button type="button" class="btn btn--outline btn--sm js-policy-close">Đóng</button>
    </div>
    <div class="bm-modal__body" id="bm-policy-body"></div>
  </div>
</div>

<div class="bm-modal-backdrop" id="bm-confirm-modal" hidden>
  <div class="bm-modal" role="dialog" aria-modal="true" aria-labelledby="bm-confirm-title">
    <div class="bm-modal__head">
      <h3 id="bm-confirm-title">Xác nhận thao tác</h3>
    </div>
    <div class="bm-modal__body">
      <p id="bm-confirm-msg"></p>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px;">
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
