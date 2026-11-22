<?php
declare(strict_types=1);
?>
<main class="auth-main">
  <section class="auth-card" aria-labelledby="login-heading">
    <div class="auth-card__head">
      <div class="auth-logo-badge">BakeMate</div>
      <h1 class="auth-card__title" id="login-heading">Đăng nhập tài khoản</h1>
      <p class="auth-card__subtitle">Chào mừng quay lại với căn bếp nhỏ</p>
    </div>

    <div id="auth-feedback" role="alert" aria-live="polite" hidden style="margin-bottom:16px;padding:12px 14px;border-radius:10px;font-size:13.5px;font-weight:500;"></div>

    <form id="login-form" class="checkout-form" novalidate>
      <input type="hidden" name="redirect" value="<?= App::e($redirect ?? '') ?>">

      <div class="form-group">
        <label for="login-identifier" class="form-label">Email hoặc Số điện thoại <span class="required-mark">*</span></label>
        <input type="text" id="login-identifier" name="identifier" class="auth-input" placeholder="VD: khachhang@bakemate.vn hoặc 0909123456" autocomplete="username" required>
      </div>

      <div class="form-group">
        <label for="login-password" class="form-label">Mật khẩu <span class="required-mark">*</span></label>
        <div class="auth-password-wrap">
          <input type="password" id="login-password" name="password" class="auth-input" placeholder="Nhập mật khẩu của bạn" autocomplete="current-password" required>
          <button type="button" class="auth-eye-btn js-toggle-pass" data-target="login-password" aria-label="Hiện hoặc ẩn mật khẩu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin:2px 0 6px;">
        <span style="font-size:12.5px;color:#7c5c46;">Bảo vệ Bcrypt &amp; khóa sai &gt;5 lần</span>
        <a href="<?= App::e(App::url('?c=auth&a=forgotPassword')) ?>" style="font-size:13px;font-weight:600;color:#b45309;">Quên mật khẩu?</a>
      </div>

      <button type="submit" class="auth-btn-primary">Đăng nhập</button>
    </form>

    <div style="display:flex;align-items:center;gap:10px;margin:18px 0 6px;color:#9c826b;font-size:12px;">
      <span style="flex:1;height:1px;background:#eadbc6;"></span>
      <span>Hoặc đăng nhập nhanh với</span>
      <span style="flex:1;height:1px;background:#eadbc6;"></span>
    </div>

    <div class="auth-social-row">
      <button type="button" class="auth-social-btn js-social-login" data-provider="Google">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.25-.96 2.31-2.04 3.02l3.3 2.56c1.92-1.77 3.04-4.38 3.04-7.48 0-.72-.06-1.41-.19-2.08H12z"/>
          <path fill="#34A853" d="M12 22c2.75 0 5.06-.91 6.75-2.46l-3.3-2.56c-.91.61-2.08.98-3.45.98-2.65 0-4.9-1.79-5.7-4.2H2.89v2.64A9.99 9.99 0 0 0 12 22z"/>
          <path fill="#FBBC05" d="M6.3 13.76a5.98 5.98 0 0 1 0-3.52V7.6H2.89a10.01 10.01 0 0 0 0 8.8l3.41-2.64z"/>
          <path fill="#4285F4" d="M12 6.04c1.5 0 2.84.52 3.9 1.53l2.92-2.92C17.05 2.99 14.74 2 12 2A9.99 9.99 0 0 0 2.89 7.6l3.41 2.64C7.1 7.83 9.35 6.04 12 6.04z"/>
        </svg>
        <span>Google</span>
      </button>
      <button type="button" class="auth-social-btn js-social-login" data-provider="Facebook">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.66 4.53-4.66 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87V12h3.32l-.53 3.47h-2.79v8.38A12 12 0 0 0 24 12z"/>
        </svg>
        <span>Facebook</span>
      </button>
    </div>

    <p style="text-align:center;font-size:13.5px;color:#6b4e3b;margin-top:18px;">
      Chưa có tài khoản?
      <a href="<?= App::e(App::url('?c=auth&a=register')) ?>" style="color:#d97706;font-weight:700;">Đăng ký thành viên mới</a>
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

document.querySelectorAll(".js-social-login").forEach((btn) => {
  btn.addEventListener("click", () => {
    const provider = btn.dataset.provider || "Mạng xã hội";
    window.BakeApp?.showToast?.("Đăng nhập nhanh " + provider + " yêu cầu cấu hình OAuth trong .env; vui lòng dùng tài khoản hoặc email đã đăng ký.", "info");
  });
});

document.getElementById("login-form")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const fb = document.getElementById("auth-feedback");
  try {
    const res = await window.BakeApp.postJson("auth", "ajaxLogin", Object.fromEntries(new FormData(this).entries()));
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
