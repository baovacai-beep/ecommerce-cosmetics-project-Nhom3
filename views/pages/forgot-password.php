<?php
declare(strict_types=1);
?>
<main class="auth-main">
  <section class="auth-card" aria-labelledby="fp-heading">
    <div class="auth-card__head">
      <div class="auth-logo-badge">BakeMate</div>
      <h1 class="auth-card__title" id="fp-heading">Khôi phục mật khẩu (OTP)</h1>
      <p class="auth-card__subtitle">Xác thực 3 bước qua Email &amp; thu hồi mọi phiên đăng nhập cũ (Force Logout)</p>
    </div>

    <div id="fp-alert" hidden style="margin-bottom:16px;padding:12px 14px;border-radius:10px;font-size:13.5px;font-weight:500;"></div>

    <form id="fp-step1" class="checkout-form">
      <div class="form-group">
        <label for="fp-email" class="form-label">Bước 1: Nhập Email tài khoản <span class="required-mark">*</span></label>
        <input id="fp-email" type="email" class="auth-input" required placeholder="khachhang@bakemate.vn">
      </div>
      <button type="submit" class="auth-btn-primary">Gửi mã OTP</button>
    </form>

    <form id="fp-step2" class="checkout-form" hidden>
      <div id="fp-otp-preview" style="padding:10px 12px;border-radius:8px;background:#fff8ed;border:1px dashed #c88b52;font-size:13px;color:#70452b;margin-bottom:12px;"></div>
      <div class="form-group">
        <label for="fp-otp" class="form-label">Bước 2: Nhập mã OTP (6 chữ số) <span class="required-mark">*</span></label>
        <input id="fp-otp" type="text" maxlength="6" class="auth-input" required>
      </div>
      <button type="submit" class="auth-btn-primary">Xác thực OTP</button>
    </form>

    <form id="fp-step3" class="checkout-form" hidden>
      <div class="form-group">
        <label for="fp-newpass" class="form-label">Bước 3: Mật khẩu mới (tối thiểu 8 ký tự) <span class="required-mark">*</span></label>
        <div class="auth-password-wrap">
          <input id="fp-newpass" type="password" minlength="8" class="auth-input" required>
          <button type="button" class="auth-eye-btn js-toggle-pass" data-target="fp-newpass" aria-label="Hiện/ẩn mật khẩu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </div>
      <div class="form-group">
        <label for="fp-confpass" class="form-label">Xác nhận mật khẩu mới <span class="required-mark">*</span></label>
        <div class="auth-password-wrap">
          <input id="fp-confpass" type="password" minlength="8" class="auth-input" required>
          <button type="button" class="auth-eye-btn js-toggle-pass" data-target="fp-confpass" aria-label="Hiện/ẩn mật khẩu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </div>
      <button type="submit" class="auth-btn-primary">Đổi mật khẩu &amp; Đăng xuất phiên cũ</button>
    </form>

    <p style="text-align:center;font-size:13.5px;color:#6b4e3b;margin-top:18px;">
      <a href="<?= App::e(App::url('?c=auth&a=login')) ?>" style="color:#70452b;font-weight:700;">&larr; Quay lại Đăng nhập</a>
    </p>
  </section>
</main>

<script>
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".js-toggle-pass").forEach((btn) => {
    btn.addEventListener("click", () => {
      const inp = document.getElementById(btn.dataset.target);
      if (inp) inp.type = inp.type === "password" ? "text" : "password";
    });
  });

  const alertEl = document.getElementById("fp-alert");
  const s1 = document.getElementById("fp-step1");
  const s2 = document.getElementById("fp-step2");
  const s3 = document.getElementById("fp-step3");
  let curEmail = "";
  let curOtp = "";

  function setAlert(msg, isErr) {
    if (!alertEl) return;
    alertEl.hidden = false;
    alertEl.style.background = isErr ? "#fef2f2" : "#dcfce7";
    alertEl.style.color = isErr ? "#b91c1c" : "#15803d";
    alertEl.textContent = msg;
  }

  s1.addEventListener("submit", async (e) => {
    e.preventDefault();
    curEmail = document.getElementById("fp-email").value.trim();
    try {
      const res = await window.BakeApp.postJson("auth", "ajaxSendOtp", { email: curEmail });
      setAlert(res.message, false);
      s1.hidden = true;
      s2.hidden = false;
      const pv = document.getElementById("fp-otp-preview");
      if (pv) {
        pv.textContent = res.data.dev_otp_preview
          ? "Chế độ Local Dev Preview — Mã OTP của bạn là: " + res.data.dev_otp_preview
          : "Vui lòng kiểm tra hộp thư email để lấy mã OTP 6 chữ số.";
      }
    } catch (err) { setAlert(err.message, true); }
  });

  s2.addEventListener("submit", async (e) => {
    e.preventDefault();
    curOtp = document.getElementById("fp-otp").value.trim();
    try {
      const res = await window.BakeApp.postJson("auth", "ajaxVerifyOtp", { email: curEmail, otp_code: curOtp });
      setAlert(res.message, false);
      s2.hidden = true;
      s3.hidden = false;
    } catch (err) { setAlert(err.message, true); }
  });

  s3.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const res = await window.BakeApp.postJson("auth", "ajaxResetPassword", {
        email: curEmail,
        otp_code: curOtp,
        new_password: document.getElementById("fp-newpass").value,
        confirm_password: document.getElementById("fp-confpass").value
      });
      window.BakeApp.showToast(res.message, "success");
      window.location.href = res.data.redirect_url;
    } catch (err) { setAlert(err.message, true); }
  });
});
</script>
