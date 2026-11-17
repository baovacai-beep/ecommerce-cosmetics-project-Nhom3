<?php
declare(strict_types=1);
?>
<main class="auth-main">
  <section class="auth-card" aria-labelledby="reg-heading">
    <div class="auth-card__head">
      <div class="auth-logo-badge">BakeMate</div>
      <h1 class="auth-card__title" id="reg-heading">Đăng ký thành viên</h1>
      <p class="auth-card__subtitle">Mỗi tài khoản mới mặc định mang quyền Khách hàng và mã hóa Bcrypt</p>
    </div>

    <div id="reg-feedback" role="alert" aria-live="polite" hidden style="margin-bottom:16px;padding:12px 14px;border-radius:10px;font-size:13.5px;font-weight:500;"></div>

    <form id="register-form" class="checkout-form" novalidate>
      <div class="form-group">
        <label for="reg-name" class="form-label">Họ và tên <span class="required-mark">*</span></label>
        <input id="reg-name" name="full_name" type="text" class="auth-input" placeholder="Nguyễn Văn An" required>
      </div>
      <div class="form-group">
        <label for="reg-email" class="form-label">Email <span class="required-mark">*</span></label>
        <input id="reg-email" name="email" type="email" class="auth-input" placeholder="an@example.com" required>
      </div>
      <div class="form-group">
        <label for="reg-phone" class="form-label">Số điện thoại</label>
        <input id="reg-phone" name="phone" type="tel" class="auth-input" placeholder="0909123456">
      </div>
      <div class="form-group">
        <label for="reg-pass" class="form-label">Mật khẩu (tối thiểu 8 ký tự) <span class="required-mark">*</span></label>
        <div class="auth-password-wrap">
          <input id="reg-pass" name="password" type="password" minlength="8" class="auth-input" required>
          <button type="button" class="auth-eye-btn js-toggle-pass" data-target="reg-pass" aria-label="Hiện/ẩn mật khẩu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
        <div id="reg-pass-strength" style="font-size:12px;margin-top:4px;color:#7c5c46;"></div>
      </div>
      <div class="form-group">
        <label for="reg-confirm" class="form-label">Xác nhận mật khẩu <span class="required-mark">*</span></label>
        <div class="auth-password-wrap">
          <input id="reg-confirm" name="confirm_password" type="password" minlength="8" class="auth-input" required>
          <button type="button" class="auth-eye-btn js-toggle-pass" data-target="reg-confirm" aria-label="Hiện/ẩn mật khẩu xác nhận">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </div>
      <button type="submit" class="auth-btn-primary">Đăng ký tài khoản</button>
    </form>

    <p style="text-align:center;font-size:13.5px;color:#6b4e3b;margin-top:18px;">
      Đã có tài khoản?
      <a href="<?= App::e(App::url('?c=auth&a=login')) ?>" style="color:#d97706;font-weight:700;">Đăng nhập ngay</a>
    </p>
  </section>
</main>

<script>
document.querySelectorAll(".js-toggle-pass").forEach((btn) => {
  btn.addEventListener("click", () => {
    const inp = document.getElementById(btn.dataset.target);
    if (inp) inp.type = inp.type === "password" ? "text" : "password";
  });
});

document.getElementById("reg-pass")?.addEventListener("input", function () {
  const v = this.value;
  const el = document.getElementById("reg-pass-strength");
  if (!el) return;
  if (!v) { el.textContent = ""; return; }
  let score = 0;
  if (v.length >= 8) score++;
  if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v) && v.length >= 10) score++;
  if (v.length < 8 || score <= 1) { el.textContent = "Độ mạnh: Yếu (tối thiểu 8 ký tự)"; el.style.color = "#b91c1c"; }
  else if (score === 2) { el.textContent = "Độ mạnh: Trung bình"; el.style.color = "#b45309"; }
  else { el.textContent = "Độ mạnh: Mạnh"; el.style.color = "#15803d"; }
});

document.getElementById("register-form")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const fb = document.getElementById("reg-feedback");
  try {
    const res = await window.BakeApp.postJson("auth", "ajaxRegister", Object.fromEntries(new FormData(this).entries()));
    window.BakeApp.showToast(res.message, "success");
    window.location.href = res.data.redirect_url || window.BAKEMATE_PHP.baseUrl;
  } catch (err) {
    if (fb) {
      fb.hidden = false;
      fb.style.background = "#fef2f2";
      fb.style.color = "#b91c1c";
      fb.textContent = err.message;
    }
  }
});
</script>
