<?php
declare(strict_types=1);
?>
<main class="page-container" id="order-success-root">
  <nav class="breadcrumb" aria-label="Đường dẫn điều hướng">
    <ul class="breadcrumb__list">
      <li class="breadcrumb__item"><a href="<?= App::e(App::url('')) ?>">Trang chủ</a></li>
      <li class="breadcrumb__separator">/</li>
      <li class="breadcrumb__item"><a href="<?= App::e(App::url('?c=order&a=cart')) ?>">Giỏ hàng</a></li>
      <li class="breadcrumb__separator">/</li>
      <li class="breadcrumb__item active">Hoàn tất đơn hàng</li>
    </ul>
  </nav>

  <nav class="checkout-progress" aria-label="Tiến trình đặt hàng">
    <div class="checkout-progress__step is-done">
      <span class="checkout-progress__num">1</span>
      <span>Giỏ hàng</span>
    </div>
    <div class="checkout-progress__step is-done">
      <span class="checkout-progress__num">2</span>
      <span>Thông tin &amp; Thanh toán</span>
    </div>
    <div class="checkout-progress__step is-done" aria-current="step">
      <span class="checkout-progress__num">3</span>
      <span>Hoàn tất đơn hàng</span>
    </div>
  </nav>

  <?php if (!$order): ?>
    <div class="order-success-card" style="text-align:center;">
      <h1 class="cart-page__title" style="margin-bottom:10px;">Không tìm thấy hóa đơn đơn hàng</h1>
      <p class="cart-empty__desc">Mã đơn không tồn tại hoặc bạn không có quyền xem hóa đơn này.</p>
      <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:12px;">
        <a href="<?= App::e(App::url('?c=order&a=orders')) ?>" class="btn btn--primary">Tra cứu đơn hàng</a>
        <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="btn btn--outline-dark">Khám phá sản phẩm</a>
      </div>
    </div>
  <?php else: ?>
    <div class="order-success-card">
      <span class="order-success-card__badge">Đặt hàng thành công</span>
      <h1 class="cart-page__title" style="margin-bottom:6px;">Cảm ơn <?= App::e($order['customer_name']) ?> đã đặt hàng tại BakeMate!</h1>
      <p style="font-size:14.5px;color:#5c402d;line-height:1.6;">
        Mã đơn hàng của bạn là <strong class="order-code">#<?= App::e($order['order_code']) ?></strong>
        <?php if (!empty($order['created_at'])): ?> &middot; Đặt lúc <strong><?= App::e($order['created_at']) ?></strong><?php endif; ?>.
      </p>

      <?php if ($vietQr): ?>
        <div class="payment-extra-box" style="margin-top:16px;">
          <div class="vietqr-box">
            <img src="<?= App::e($vietQr['qr_image_url']) ?>" alt="Mã VietQR thanh toán" style="width:168px;border-radius:10px;background:#fff;border:1px solid #eedfc9;">
            <div style="flex:1;min-width:220px;">
              <strong style="display:block;font-size:15px;color:var(--primary-color);margin-bottom:6px;">Quét mã VietQR để hoàn tất chuyển khoản</strong>
              <p style="font-size:13.5px;color:#5c402d;margin:3px 0;">Ngân hàng: <strong><?= App::e($vietQr['bank_id']) ?></strong> &middot; STK: <strong><?= App::e($vietQr['account_no']) ?></strong></p>
              <p style="font-size:13.5px;color:#5c402d;margin:3px 0;">Chủ TK: <strong><?= App::e($vietQr['account_name']) ?></strong> &middot; Số tiền: <strong style="color:#b45309;"><?= App::e(App::formatCurrency((int) $vietQr['amount'])) ?></strong></p>
              <p style="font-size:13.5px;color:#5c402d;margin:3px 0 10px;">Nội dung CK: <strong><?= App::e($vietQr['transfer_memo']) ?></strong></p>
              <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                <span id="qr-pay-status" class="order-status-pill" style="background:<?= $order['payment_status'] === 'paid' ? '#dcfce7' : '#fef3c7' ?>;color:<?= $order['payment_status'] === 'paid' ? '#15803d' : '#92400e' ?>;">
                  Trạng thái: <?= $order['payment_status'] === 'paid' ? 'Đã thanh toán' : 'Chờ xác nhận' ?>
                </span>
                <?php if ($order['payment_status'] !== 'paid'): ?>
                  <button type="button" class="btn btn--primary btn--sm" id="btn-verify-vietqr" data-code="<?= App::e($order['order_code']) ?>">Xác nhận đã chuyển khoản</button>
                <?php endif; ?>
              </div>
            </div>
          </div>
        </div>
      <?php endif; ?>

      <div class="order-success-grid">
        <div class="order-success-panel">
          <h2 style="font-size:16px;font-weight:800;color:var(--primary-color);margin-bottom:10px;">Thông tin nhận hàng &amp; giao vận</h2>
          <p><strong>Người nhận:</strong> <?= App::e($order['customer_name']) ?> (<?= App::e($order['customer_phone']) ?>)</p>
          <p><strong>Địa chỉ:</strong> <?= App::e($order['street_address'] . ', ' . $order['ward'] . ', ' . $order['district'] . ', ' . $order['province']) ?></p>
          <p><strong>Vận chuyển:</strong> <?= App::e($order['shipping_method_label']) ?></p>
          <p><strong>Thanh toán:</strong> <?= App::e(strtoupper((string) $order['payment_method'])) ?></p>
          <?php if (!empty($order['note'])): ?>
            <p><strong>Lời nhắn cho Shop:</strong> <?= App::e($order['note']) ?></p>
          <?php endif; ?>
        </div>

        <div class="order-success-panel">
          <h2 style="font-size:16px;font-weight:800;color:var(--primary-color);margin-bottom:10px;">Chi tiết đơn hàng (<?= count($order['items']) ?> dòng)</h2>
          <ul class="order-confirmation__list" style="margin-bottom:10px;">
            <?php foreach ($order['items'] as $it): ?>
              <li>
                <span><?= App::e($it['product_name']) ?> (<?= App::e($it['variant_label']) ?>) &times; <?= (int) $it['quantity'] ?></span>
                <strong><?= App::e(App::formatCurrency((int) $it['line_total'])) ?></strong>
              </li>
            <?php endforeach; ?>
          </ul>
          <p style="display:flex;justify-content:space-between;margin:4px 0;">
            <span>Tạm tính:</span><strong><?= App::e(App::formatCurrency((int) $order['subtotal'])) ?></strong>
          </p>
          <p style="display:flex;justify-content:space-between;margin:4px 0;">
            <span>Phí giao hàng:</span><strong><?= App::e(App::formatCurrency((int) $order['shipping_fee'])) ?></strong>
          </p>
          <p style="display:flex;justify-content:space-between;margin:4px 0;color:#15803d;">
            <span>Giảm giá:</span><strong>&minus;<?= App::e(App::formatCurrency((int) $order['discount_product'] + (int) $order['discount_shipping'])) ?></strong>
          </p>
          <div class="order-confirmation__total" style="margin-top:10px;padding-top:10px;border-top:1px dashed #dfd0bc;">
            <span>Tổng thanh toán:</span>
            <strong><?= App::e(App::formatCurrency((int) $order['total_amount'])) ?></strong>
          </div>
        </div>
      </div>

      <div class="order-confirmation__actions">
        <a href="<?= App::e(App::url('?c=order&a=orders')) ?>" class="btn btn--primary">Theo dõi đơn hàng &rarr;</a>
        <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="btn btn--outline-dark">Tiếp tục mua sắm</a>
        <a href="<?= App::e(App::url('')) ?>" class="btn btn--outline-dark">Về trang chủ</a>
      </div>
    </div>
  <?php endif; ?>
</main>

<script>
document.getElementById("btn-verify-vietqr")?.addEventListener("click", async function () {
  try {
    const res = await window.BakeApp.postJson("order", "ajaxVerifyVietQr", { order_code: this.dataset.code });
    const badge = document.getElementById("qr-pay-status");
    if (badge) {
      badge.textContent = "Trạng thái: Đã thanh toán";
      badge.style.background = "#dcfce7";
      badge.style.color = "#15803d";
    }
    this.remove();
    window.BakeApp.showToast(res.message, "success");
  } catch (err) {
    window.BakeApp.showToast(err.message, "error");
  }
});
</script>
