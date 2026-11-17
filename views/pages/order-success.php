<?php
declare(strict_types=1);
?>
<main class="php-page-container" id="order-success-root">
  <div class="checkout-progress" role="list" style="margin-bottom:22px;">
    <div class="checkout-progress__step is-done">1. Giỏ hàng</div>
    <div class="checkout-progress__step is-done">2. Thông tin &amp; Thanh toán</div>
    <div class="checkout-progress__step is-active is-done">3. Hoàn tất</div>
  </div>

  <?php if (!$order): ?>
    <div class="php-card" style="text-align:center;padding:48px 20px;">
      <h1 style="color:#70452b;margin-top:0;">Không tìm thấy hóa đơn đơn hàng</h1>
      <a href="<?= App::e(App::url('?c=order&a=orders')) ?>" class="btn btn--primary">Tra cứu đơn hàng</a>
    </div>
  <?php else: ?>
    <div class="order-success-card php-card" style="max-width:860px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:24px;">
        <span style="display:inline-block;padding:6px 14px;border-radius:999px;background:#ecfdf5;color:#166534;font-weight:700;font-size:13px;">ĐẶT HÀNG THÀNH CÔNG</span>
        <h1 style="margin:10px 0 6px;color:#70452b;">Cảm ơn <?= App::e($order['customer_name']) ?>!</h1>
        <p style="margin:0;color:#7c5c46;">Mã đơn hàng của bạn là <strong style="color:#70452b;font-size:18px;">#<?= App::e($order['order_code']) ?></strong></p>
      </div>

      <?php if ($vietQr): ?>
        <div class="php-vietqr-box">
          <img src="<?= App::e($vietQr['qr_image_url']) ?>" alt="Mã VietQR thanh toán" style="width:180px;border-radius:10px;background:#fff;">
          <div>
            <h3 style="margin:0 0 8px;color:#70452b;">Quét mã VietQR để hoàn tất thanh toán</h3>
            <p style="margin:4px 0;font-size:13.5px;">Ngân hàng: <strong><?= App::e($vietQr['bank_id']) ?></strong> · STK: <strong><?= App::e($vietQr['account_no']) ?></strong></p>
            <p style="margin:4px 0;font-size:13.5px;">Chủ TK: <strong><?= App::e($vietQr['account_name']) ?></strong> · Số tiền: <strong><?= App::e(App::formatCurrency((int) $vietQr['amount'])) ?></strong></p>
            <p style="margin:4px 0 12px;font-size:13.5px;">Nội dung CK: <strong><?= App::e($vietQr['transfer_memo']) ?></strong></p>
            <span id="qr-pay-status" style="display:inline-block;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:700;background:#fef3c7;color:#92400e;">
              Trạng thái: <?= $order['payment_status'] === 'paid' ? 'Đã thanh toán' : 'Chờ xác nhận' ?>
            </span>
            <?php if ($order['payment_status'] !== 'paid'): ?>
              <button type="button" class="btn btn--primary btn--sm" id="btn-verify-vietqr" data-code="<?= App::e($order['order_code']) ?>" style="margin-left:8px;">Xác nhận đã chuyển khoản</button>
            <?php endif; ?>
          </div>
        </div>
      <?php endif; ?>

      <div class="order-success-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:20px;font-size:14px;">
        <div style="background:#fffdf9;border:1px solid #efe3d2;border-radius:10px;padding:14px;">
          <h3 style="margin:0 0 8px;color:#70452b;font-size:15px;">Thông tin giao nhận</h3>
          <p style="margin:4px 0;">Người nhận: <strong><?= App::e($order['customer_name']) ?></strong> (<?= App::e($order['customer_phone']) ?>)</p>
          <p style="margin:4px 0;">Địa chỉ: <?= App::e($order['street_address'] . ', ' . $order['ward'] . ', ' . $order['district'] . ', ' . $order['province']) ?></p>
          <p style="margin:4px 0;">Vận chuyển: <strong><?= App::e($order['shipping_method_label']) ?></strong></p>
          <p style="margin:4px 0;">Thanh toán: <strong><?= App::e(strtoupper((string) $order['payment_method'])) ?></strong></p>
        </div>
        <div style="background:#fffdf9;border:1px solid #efe3d2;border-radius:10px;padding:14px;">
          <h3 style="margin:0 0 8px;color:#70452b;font-size:15px;">Tổng hợp thanh toán</h3>
          <p style="margin:4px 0;display:flex;justify-content:space-between;"><span>Tạm tính:</span><strong><?= App::e(App::formatCurrency((int) $order['subtotal'])) ?></strong></p>
          <p style="margin:4px 0;display:flex;justify-content:space-between;"><span>Phí giao hàng:</span><strong><?= App::e(App::formatCurrency((int) $order['shipping_fee'])) ?></strong></p>
          <p style="margin:4px 0;display:flex;justify-content:space-between;color:#166534;"><span>Giảm giá:</span><strong>−<?= App::e(App::formatCurrency((int) $order['discount_product'] + (int) $order['discount_shipping'])) ?></strong></p>
          <p style="margin:8px 0 0;padding-top:8px;border-top:1px solid #ebd9c3;display:flex;justify-content:space-between;font-size:17px;color:#70452b;"><span>Tổng cộng:</span><strong><?= App::e(App::formatCurrency((int) $order['total_amount'])) ?></strong></p>
        </div>
      </div>

      <h3 style="margin:0 0 10px;color:#70452b;font-size:16px;">Sản phẩm đã đặt</h3>
      <div style="display:grid;gap:8px;margin-bottom:22px;">
        <?php foreach ($order['items'] as $it): ?>
          <div style="display:flex;justify-content:space-between;padding:8px 12px;border:1px solid #f0e4d3;border-radius:8px;font-size:13.5px;">
            <span><strong><?= App::e($it['product_name']) ?></strong> (<?= App::e($it['variant_label']) ?>) &times; <?= (int) $it['quantity'] ?></span>
            <strong><?= App::e(App::formatCurrency((int) $it['line_total'])) ?></strong>
          </div>
        <?php endforeach; ?>
      </div>

      <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
        <a href="<?= App::e(App::url('?c=order&a=orders')) ?>" class="btn btn--primary">Theo dõi đơn hàng</a>
        <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="btn btn--outline">Tiếp tục mua sắm</a>
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
      badge.style.background = "#ecfdf5";
      badge.style.color = "#166534";
    }
    this.remove();
    window.BakeApp.showToast(res.message, "success");
  } catch (err) {
    window.BakeApp.showToast(err.message, "error");
  }
});
</script>
