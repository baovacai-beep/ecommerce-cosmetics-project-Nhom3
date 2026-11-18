<?php
declare(strict_types=1);
$stepsMap = ['pending' => 0, 'preparing' => 1, 'shipping' => 2, 'completed' => 3];
$labelsMap = ['pending' => 'Chờ xác nhận', 'preparing' => 'Đang chuẩn bị', 'shipping' => 'Đang giao hàng', 'completed' => 'Hoàn tất', 'cancelled' => 'Đã hủy'];
?>
<main class="php-page-container">
  <h1 style="margin:0 0 8px;color:#70452b;">Theo dõi &amp; Lịch sử đơn hàng</h1>
  <p style="margin:0 0 18px;color:#7c5c46;">Tra cứu bằng mã đơn hàng (#BM-XXXXXX) hoặc xem các đơn hàng gắn với tài khoản của bạn.</p>

  <form method="get" action="<?= App::e(App::url('index.php')) ?>" class="php-card" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;">
    <input type="hidden" name="c" value="order">
    <input type="hidden" name="a" value="orders">
    <input type="search" name="q" value="<?= App::e($searchQuery ?? '') ?>" class="form-input" style="flex:1;min-width:220px;" placeholder="Nhập mã đơn (#BM-...) hoặc số điện thoại">
    <select name="status" class="form-input" style="width:auto;">
      <option value="all">Tất cả trạng thái</option>
      <?php foreach ($labelsMap as $k => $v): ?>
        <option value="<?= App::e($k) ?>" <?= ($statusFilter ?? 'all') === $k ? 'selected' : '' ?>><?= App::e($v) ?></option>
      <?php endforeach; ?>
    </select>
    <button type="submit" class="btn btn--primary">Tra cứu</button>
  </form>

  <?php if (empty($orders)): ?>
    <div class="php-card" style="text-align:center;padding:48px 20px;background:#fff8ed;border:1.5px dashed #c88b52;">
      <h2 style="color:#70452b;margin-top:0;">Chưa tìm thấy đơn hàng nào</h2>
      <p style="color:#7c5c46;">Nếu bạn là khách vãng lai, hãy nhập đúng mã đơn #BM-XXXXXX vào ô tìm kiếm ở trên.</p>
    </div>
  <?php else: ?>
    <div style="display:grid;gap:18px;">
      <?php foreach ($orders as $ord):
        $st = (string) ($ord['status'] ?? 'pending');
        $activeIdx = $stepsMap[$st] ?? 0;
      ?>
        <article class="php-card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;border-bottom:1px solid #f0e4d3;padding-bottom:12px;margin-bottom:12px;">
            <div>
              <strong style="font-size:17px;color:#70452b;">Đơn #<?= App::e($ord['order_code']) ?></strong>
              <span style="font-size:13px;color:#7c5c46;margin-left:10px;"><?= App::e($ord['created_at']) ?></span>
            </div>
            <div style="display:flex;gap:8px;align-items:center;">
              <span style="padding:4px 10px;border-radius:999px;font-size:12px;font-weight:700;background:#fff8ed;border:1px solid #e6c9a2;color:#70452b;">
                <?= App::e($labelsMap[$st] ?? $st) ?>
              </span>
              <span style="padding:4px 10px;border-radius:999px;font-size:12px;font-weight:700;background:<?= $ord['payment_status'] === 'paid' ? '#ecfdf5' : '#fef3c7' ?>;color:<?= $ord['payment_status'] === 'paid' ? '#166534' : '#92400e' ?>;">
                <?= $ord['payment_status'] === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán' ?> (<?= App::e(strtoupper((string) $ord['payment_method'])) ?>)
              </span>
            </div>
          </div>

          <?php if ($st === 'cancelled'): ?>
            <div style="padding:10px 14px;border-radius:8px;background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;font-weight:700;font-size:13px;margin-bottom:12px;">
              Đơn hàng này đã bị hủy và tồn kho đã được hoàn lại.
            </div>
          <?php else: ?>
            <div class="order-timeline" style="margin:12px 0;">
              <?php foreach (['pending' => 'Chờ xác nhận', 'preparing' => 'Đang chuẩn bị', 'shipping' => 'Đang giao hàng', 'completed' => 'Hoàn tất'] as $sk => $sl):
                $stepNum = $stepsMap[$sk];
                $done = $stepNum <= $activeIdx;
              ?>
                <div class="order-step <?= $done ? 'is-done' : '' ?>">
                  <span class="order-step__dot"><?= $stepNum + 1 ?></span>
                  <div><?= App::e($sl) ?></div>
                </div>
              <?php endforeach; ?>
            </div>
          <?php endif; ?>

          <div style="display:grid;gap:6px;margin:12px 0;font-size:13.5px;">
            <?php foreach ($ord['items'] as $it): ?>
              <div style="display:flex;justify-content:space-between;">
                <span><?= App::e($it['product_name']) ?> (<?= App::e($it['variant_label']) ?>) &times; <?= (int) $it['quantity'] ?></span>
                <strong><?= App::e(App::formatCurrency((int) $it['line_total'])) ?></strong>
              </div>
            <?php endforeach; ?>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid #f0e4d3;padding-top:12px;flex-wrap:wrap;gap:10px;">
            <span style="font-size:13.5px;color:#7c5c46;">Giao tới: <?= App::e($ord['street_address'] . ', ' . $ord['district'] . ', ' . $ord['province']) ?></span>
            <div style="display:flex;align-items:center;gap:12px;">
              <strong style="font-size:16.5px;color:#70452b;">Tổng cộng: <?= App::e(App::formatCurrency((int) $ord['total_amount'])) ?></strong>
              <?php if (in_array($st, ['pending', 'preparing'], true) && empty($ord['cancel_request'])): ?>
                <button type="button" class="btn btn--outline btn--sm js-req-cancel" data-order-id="<?= (int) $ord['id'] ?>">Yêu cầu hủy đơn</button>
              <?php elseif (!empty($ord['cancel_request'])): ?>
                <span style="font-size:12px;color:#b45309;font-weight:700;">Yêu cầu hủy: <?= App::e($ord['cancel_request']['status']) ?></span>
              <?php endif; ?>
            </div>
          </div>
        </article>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</main>

<script>
document.querySelectorAll(".js-req-cancel").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const ok = await window.BakeApp.showConfirm("Bạn chắc chắn muốn gửi yêu cầu hủy đơn hàng này tới bộ phận chăm sóc khách hàng?", "Yêu cầu hủy đơn");
    if (!ok) return;
    try {
      const res = await window.BakeApp.postJson("order", "ajaxRequestCancel", {
        order_id: Number(btn.dataset.orderId),
        reason: "Khách hàng gửi yêu cầu hủy trực tuyến"
      });
      window.BakeApp.showToast(res.message, "success");
      window.location.reload();
    } catch (err) {
      window.BakeApp.showToast(err.message, "error");
    }
  });
});
</script>
