<?php
declare(strict_types=1);
?>
<main class="php-page-container">
  <h1 style="margin:0 0 18px;color:#70452b;">Hồ sơ tài khoản &amp; Sổ địa chỉ</h1>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;">
    <section class="php-card">
      <h2 style="margin:0 0 12px;color:#70452b;font-size:18px;">Thông tin cá nhân</h2>
      <form id="profile-info-form" style="display:grid;gap:12px;">
        <div>
          <label style="font-size:13px;font-weight:700;color:#70452b;">Email đăng nhập</label>
          <input type="email" class="form-input" value="<?= App::e($profileUser['email']) ?>" disabled>
        </div>
        <div>
          <label for="prof-name" style="font-size:13px;font-weight:700;color:#70452b;">Họ và tên *</label>
          <input id="prof-name" name="full_name" type="text" class="form-input" value="<?= App::e($profileUser['full_name']) ?>" required>
        </div>
        <div>
          <label for="prof-phone" style="font-size:13px;font-weight:700;color:#70452b;">Số điện thoại</label>
          <input id="prof-phone" name="phone" type="tel" class="form-input" value="<?= App::e($profileUser['phone'] ?? '') ?>">
        </div>
        <button type="submit" class="btn btn--primary">Cập nhật hồ sơ</button>
      </form>
    </section>

    <section class="php-card">
      <h2 style="margin:0 0 12px;color:#70452b;font-size:18px;">Đổi mật khẩu</h2>
      <form id="profile-pass-form" style="display:grid;gap:12px;">
        <div>
          <label for="p-cur" style="font-size:13px;font-weight:700;color:#70452b;">Mật khẩu hiện tại *</label>
          <input id="p-cur" name="current_password" type="password" class="form-input" required>
        </div>
        <div>
          <label for="p-new" style="font-size:13px;font-weight:700;color:#70452b;">Mật khẩu mới (tối thiểu 8 ký tự) *</label>
          <input id="p-new" name="new_password" type="password" minlength="8" class="form-input" required>
        </div>
        <div>
          <label for="p-conf" style="font-size:13px;font-weight:700;color:#70452b;">Xác nhận mật khẩu mới *</label>
          <input id="p-conf" name="confirm_password" type="password" minlength="8" class="form-input" required>
        </div>
        <button type="submit" class="btn btn--primary">Cập nhật mật khẩu</button>
      </form>
    </section>
  </div>

  <section class="php-card" style="margin-top:24px;">
    <h2 style="margin:0 0 12px;color:#70452b;font-size:18px;">Sổ địa chỉ giao hàng đã lưu</h2>
    <?php if (empty($addresses)): ?>
      <p style="color:#7c5c46;">Chưa có địa chỉ nào được lưu. Địa chỉ sẽ tự động lưu khi bạn thêm tại trang Thanh toán.</p>
    <?php else: ?>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;">
        <?php foreach ($addresses as $ad): ?>
          <div style="border:1px solid #ebd9c3;border-radius:10px;padding:12px;background:#fffdf9;">
            <strong><?= App::e($ad['recipient_name']) ?></strong> · <?= App::e($ad['phone']) ?>
            <p style="margin:6px 0 0;font-size:13.5px;color:#4a2d1b;"><?= App::e($ad['street_address'] . ', ' . $ad['ward'] . ', ' . $ad['district'] . ', ' . $ad['province']) ?></p>
          </div>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </section>
</main>

<script>
document.getElementById("profile-info-form")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  try {
    const res = await window.BakeApp.postJson("auth", "ajaxUpdateProfile", Object.fromEntries(new FormData(this).entries()));
    window.BakeApp.showToast(res.message, "success");
  } catch (err) { window.BakeApp.showToast(err.message, "error"); }
});
document.getElementById("profile-pass-form")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  try {
    const res = await window.BakeApp.postJson("auth", "ajaxChangePassword", Object.fromEntries(new FormData(this).entries()));
    this.reset();
    window.BakeApp.showToast(res.message, "success");
  } catch (err) { window.BakeApp.showToast(err.message, "error"); }
});
</script>
