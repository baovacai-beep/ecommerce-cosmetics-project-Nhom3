<?php
declare(strict_types=1);
$stepsMap = ['pending' => 0, 'preparing' => 1, 'shipping' => 2, 'completed' => 3];
$labelsMap = ['pending' => 'Chờ xác nhận', 'preparing' => 'Đang chuẩn bị', 'shipping' => 'Đang giao hàng', 'completed' => 'Hoàn tất', 'cancelled' => 'Đã hủy'];
$curStatus = (string) ($statusFilter ?? 'all');
$curQuery = (string) ($searchQuery ?? '');
?>
<main class="page-container">
  <nav class="breadcrumb" aria-label="Đường dẫn điều hướng">
    <ul class="breadcrumb__list">
      <li class="breadcrumb__item"><a href="<?= App::e(App::url('')) ?>">Trang chủ</a></li>
      <li class="breadcrumb__separator">/</li>
      <li class="breadcrumb__item active">Theo dõi đơn hàng</li>
    </ul>
  </nav>

  <div class="cart-page__header">
    <div>
      <h1 class="cart-page__title">Theo dõi &amp; Lịch sử đơn hàng</h1>
      <p class="cart-page__subtitle">Tra cứu nhanh bằng mã đơn hàng (#BM-XXXXXXXXXXXX) hoặc xem toàn bộ đơn gắn với tài khoản của bạn.</p>
    </div>
    <span class="cart-page__count-pill"><?= count($orders) ?> đơn hàng</span>
  </div>

  <div class="blog-toolbar">
    <div class="blog-filters" role="group" aria-label="Lọc theo trạng thái đơn hàng">
      <?php
      $allUrl = '?c=order&a=orders&status=all' . ($curQuery !== '' ? '&q=' . urlencode($curQuery) : '');
      ?>
      <a href="<?= App::e(App::url($allUrl)) ?>" class="blog-filter-btn <?= $curStatus === 'all' ? 'active' : '' ?>" style="text-decoration:none;">Tất cả</a>
      <?php foreach ($labelsMap as $k => $v):
        $stUrl = '?c=order&a=orders&status=' . urlencode($k) . ($curQuery !== '' ? '&q=' . urlencode($curQuery) : '');
      ?>
        <a href="<?= App::e(App::url($stUrl)) ?>" class="blog-filter-btn <?= $curStatus === $k ? 'active' : '' ?>" style="text-decoration:none;"><?= App::e($v) ?></a>
      <?php endforeach; ?>
    </div>

    <div class="blog-search-wrap">
      <form method="get" action="<?= App::e(App::url('index.php')) ?>" class="blog-search-form">
        <input type="hidden" name="c" value="order">
        <input type="hidden" name="a" value="orders">
        <input type="hidden" name="status" value="<?= App::e($curStatus) ?>">
        <input type="search" id="orders-search-input" name="q" value="<?= App::e($curQuery) ?>" class="form-input blog-search-input" placeholder="Nhập mã #BM-... hoặc SĐT...">
        <button type="submit" class="btn btn--primary blog-search-form__btn">Tra cứu</button>
      </form>
    </div>
  </div>

  <?php if (empty($orders)): ?>
    <section class="cart-empty">
      <h2 class="cart-empty__title">Chưa tìm thấy đơn hàng nào</h2>
      <p class="cart-empty__desc">Nếu bạn là khách vãng lai, hãy nhập đúng mã đơn #BM-XXXXXXXXXXXX vào ô tìm kiếm hoặc khám phá nguyên liệu để đặt đơn đầu tiên.</p>
      <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
        <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="btn btn--primary">Khám phá sản phẩm</a>
        <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="btn btn--outline-dark">Chọn combo công thức</a>
      </div>
    </section>
  <?php else: ?>
    <div style="display:grid;gap:18px;">
      <?php foreach ($orders as $ord):
        $st = (string) ($ord['status'] ?? 'pending');
        $activeIdx = $stepsMap[$st] ?? 0;
        $pillStyle = $st === 'cancelled'
          ? 'background-color:#fee2e2;color:#b91c1c;'
          : ($st === 'completed' ? 'background-color:#dcfce7;color:#15803d;' : '');
      ?>
        <article class="order-history-card" style="background:#ffffff;padding:22px;">
          <div class="order-history-card__top">
            <div>
              <strong class="order-code">#<?= App::e($ord['order_code']) ?></strong>
              <span class="order-history-card__date"><?= App::e($ord['created_at']) ?></span>
            </div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
              <span class="order-status-pill" style="<?= $pillStyle ?>">
                <?= App::e($labelsMap[$st] ?? $st) ?> &middot; <?= App::e(strtoupper((string) $ord['payment_method'])) ?>
              </span>
              <span class="order-status-pill" style="background:<?= $ord['payment_status'] === 'paid' ? '#dcfce7' : '#fef3c7' ?>;color:<?= $ord['payment_status'] === 'paid' ? '#15803d' : '#92400e' ?>;">
                <?= $ord['payment_status'] === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán' ?>
              </span>
            </div>
          </div>

          <?php if ($st === 'cancelled'): ?>
            <div style="padding:10px 14px;border-radius:8px;background-color:#fef2f2;border:1px solid #fecaca;color:#b91c1c;font-size:13px;font-weight:700;margin:12px 0;">
              Đơn hàng đã được hủy và tồn kho đã được hoàn lại.
            </div>
          <?php else: ?>
            <div class="order-timeline" aria-label="Tiến trình giao hàng" style="margin:14px 0;">
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

          <p class="order-history-card__customer">
            <strong>Giao tới:</strong> <?= App::e($ord['street_address'] . ', ' . $ord['district'] . ', ' . $ord['province']) ?>
          </p>

          <ul style="list-style:none;margin:10px 0 12px;padding:0;font-size:13.5px;">
            <?php foreach ($ord['items'] as $it): ?>
              <li style="display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px dashed #eedfc9;">
                <span><?= App::e($it['product_name']) ?> (<?= App::e($it['variant_label']) ?>) &times; <strong><?= (int) $it['quantity'] ?></strong></span>
                <strong><?= App::e(App::formatCurrency((int) $it['line_total'])) ?></strong>
              </li>
            <?php endforeach; ?>
          </ul>

          <div class="order-history-card__bottom">
            <span><?= count($ord['items']) ?> dòng sản phẩm</span>
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
              <strong>Tổng thanh toán: <?= App::e(App::formatCurrency((int) $ord['total_amount'])) ?></strong>
              <?php if (in_array($st, ['pending', 'preparing'], true) && empty($ord['cancel_request'])): ?>
                <button type="button" class="btn-clear-cart js-req-cancel" data-order-id="<?= (int) $ord['id'] ?>">Yêu cầu hủy đơn</button>
              <?php elseif (!empty($ord['cancel_request'])): ?>
                <span style="font-size:12.5px;color:#b45309;font-weight:700;">Yêu cầu hủy: <?= App::e($ord['cancel_request']['status']) ?></span>
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
