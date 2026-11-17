<?php
declare(strict_types=1);
$statusLabels = ['pending' => 'Chờ xác nhận', 'preparing' => 'Đang chuẩn bị', 'shipping' => 'Đang giao hàng', 'completed' => 'Hoàn tất', 'cancelled' => 'Đã hủy'];
?>
<main class="php-page-container">
  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
    <div>
      <h1 style="margin:0;color:#70452b;">Bàn làm việc Nhân viên (Staff Workbench)</h1>
      <p style="margin:4px 0 0;color:#7c5c46;font-size:14px;">Xử lý đơn hàng, đối soát chuyển khoản, kiểm tồn kho và phản hồi khách hàng.</p>
    </div>
    <div style="display:flex;gap:10px;">
      <?php if (!empty($currentUser['role']) && $currentUser['role'] === 'admin'): ?>
        <a href="<?= App::e(App::url('?c=admin&a=index')) ?>" class="btn btn--primary btn--sm">Mở Admin Dashboard</a>
      <?php endif; ?>
      <a href="<?= App::e(App::url('?c=auth&a=logout')) ?>" class="btn btn--outline btn--sm">Đăng xuất</a>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:24px;">
    <div class="php-card"><span style="font-size:12.5px;color:#7c5c46;">Đơn chờ xác nhận</span><div style="font-size:24px;font-weight:800;color:#70452b;"><?= (int) ($stats['pending_orders'] ?? 0) ?></div></div>
    <div class="php-card"><span style="font-size:12.5px;color:#7c5c46;">Tổng đơn hàng</span><div style="font-size:24px;font-weight:800;color:#70452b;"><?= (int) ($stats['total_orders'] ?? 0) ?></div></div>
    <div class="php-card"><span style="font-size:12.5px;color:#7c5c46;">Biến thể sắp hết (&le;10)</span><div style="font-size:24px;font-weight:800;color:#b45309;"><?= (int) ($stats['low_stock_variants'] ?? 0) ?></div></div>
    <div class="php-card"><span style="font-size:12.5px;color:#7c5c46;">Liên hệ mới</span><div style="font-size:24px;font-weight:800;color:#15803d;"><?= (int) ($stats['new_contacts'] ?? 0) ?></div></div>
  </div>

  <section class="php-card" style="margin-bottom:24px;overflow-x:auto;">
    <h2 style="margin:0 0 12px;color:#70452b;font-size:19px;">Đơn hàng cần xử lý</h2>
    <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
      <thead>
        <tr style="background:#fff8ed;color:#70452b;text-align:left;">
          <th style="padding:10px;">Mã đơn</th>
          <th style="padding:10px;">Khách hàng</th>
          <th style="padding:10px;">Tổng tiền</th>
          <th style="padding:10px;">Thanh toán</th>
          <th style="padding:10px;">Trạng thái đơn</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($orders as $o): ?>
          <tr style="border-bottom:1px solid #f0e4d3;">
            <td style="padding:10px;font-weight:700;color:#70452b;">#<?= App::e($o['order_code']) ?></td>
            <td style="padding:10px;"><?= App::e($o['customer_name']) ?> (<?= App::e($o['customer_phone']) ?>)<div style="font-size:12px;color:#7c5c46;"><?= App::e($o['province']) ?></div></td>
            <td style="padding:10px;font-weight:700;"><?= App::e(App::formatCurrency((int) $o['total_amount'])) ?></td>
            <td style="padding:10px;">
              <?= App::e(strtoupper((string) $o['payment_method'])) ?> · <strong><?= App::e($o['payment_status']) ?></strong>
              <?php if ($o['payment_status'] !== 'paid'): ?>
                <button type="button" class="btn btn--outline btn--sm js-staff-verify-pay" data-order-id="<?= (int) $o['id'] ?>" style="margin-left:6px;font-size:11px;">Xác nhận đã thu</button>
              <?php endif; ?>
            </td>
            <td style="padding:10px;">
              <select class="form-input js-staff-order-status" data-order-id="<?= (int) $o['id'] ?>" style="width:auto;">
                <?php foreach ($statusLabels as $sk => $sl): ?>
                  <option value="<?= $sk ?>" <?= $o['status'] === $sk ? 'selected' : '' ?>><?= App::e($sl) ?></option>
                <?php endforeach; ?>
              </select>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </section>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px;">
    <section class="php-card" style="overflow-x:auto;">
      <h2 style="margin:0 0 12px;color:#70452b;font-size:19px;">Cập nhật tồn kho nhanh</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
        <tbody>
          <?php foreach (array_slice($products, 0, 12) as $p): ?>
            <tr style="border-bottom:1px solid #f0e4d3;">
              <td style="padding:8px;"><?= App::e($p['name']) ?></td>
              <td style="padding:8px;width:90px;"><input type="number" min="0" value="<?= (int) $p['default_stock_qty'] ?>" class="form-input js-staff-stock-input" data-product-id="<?= (int) $p['id'] ?>"></td>
              <td style="padding:8px;width:80px;"><button type="button" class="btn btn--primary btn--sm js-staff-stock-save" data-product-id="<?= (int) $p['id'] ?>">Lưu</button></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </section>

    <section class="php-card">
      <h2 style="margin:0 0 12px;color:#70452b;font-size:19px;">Tin nhắn CSKH</h2>
      <div style="display:grid;gap:10px;">
        <?php if (empty($contacts)): ?>
          <p style="color:#7c5c46;">Chưa có tin nhắn liên hệ nào.</p>
        <?php else: ?>
          <?php foreach ($contacts as $c): ?>
            <div style="border:1px solid #efe3d2;border-radius:10px;padding:12px;">
              <strong><?= App::e($c['full_name']) ?></strong> (<?= App::e($c['email']) ?>) — <span style="color:#c88b52;font-size:12px;font-weight:700;"><?= App::e($c['status']) ?></span>
              <p style="margin:6px 0;font-size:13.5px;"><?= App::e($c['message']) ?></p>
              <div style="display:flex;gap:8px;">
                <input type="text" class="form-input js-staff-reply-input" data-id="<?= (int) $c['id'] ?>" value="<?= App::e($c['staff_reply'] ?? '') ?>" placeholder="Ghi chú phản hồi...">
                <button type="button" class="btn btn--primary btn--sm js-staff-reply-btn" data-id="<?= (int) $c['id'] ?>">Hoàn tất</button>
              </div>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
    </section>
  </div>
</main>

<script>
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".js-staff-order-status").forEach((sel) => {
    sel.addEventListener("change", async () => {
      try {
        const res = await window.BakeApp.postJson("staff", "ajaxUpdateOrderStatus", { order_id: Number(sel.dataset.orderId), status: sel.value });
        window.BakeApp.showToast(res.message, "success");
      } catch (err) { window.BakeApp.showToast(err.message, "error"); }
    });
  });
  document.querySelectorAll(".js-staff-verify-pay").forEach((b) => {
    b.addEventListener("click", async () => {
      try {
        const res = await window.BakeApp.postJson("staff", "ajaxVerifyPayment", { order_id: Number(b.dataset.orderId) });
        window.BakeApp.showToast(res.message, "success");
        window.location.reload();
      } catch (err) { window.BakeApp.showToast(err.message, "error"); }
    });
  });
  document.querySelectorAll(".js-staff-stock-save").forEach((b) => {
    b.addEventListener("click", async () => {
      const pid = Number(b.dataset.productId);
      const inp = document.querySelector(`.js-staff-stock-input[data-product-id="${pid}"]`);
      try {
        const res = await window.BakeApp.postJson("staff", "ajaxUpdateStock", { product_id: pid, stock_qty: Number(inp.value || 0) });
        window.BakeApp.showToast(res.message, "success");
      } catch (err) { window.BakeApp.showToast(err.message, "error"); }
    });
  });
  document.querySelectorAll(".js-staff-reply-btn").forEach((b) => {
    b.addEventListener("click", async () => {
      const cid = Number(b.dataset.id);
      const inp = document.querySelector(`.js-staff-reply-input[data-id="${cid}"]`);
      try {
        const res = await window.BakeApp.postJson("staff", "ajaxReplyContact", { contact_id: cid, status: "resolved", reply: inp.value });
        window.BakeApp.showToast(res.message, "success");
        window.location.reload();
      } catch (err) { window.BakeApp.showToast(err.message, "error"); }
    });
  });
});
</script>
