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
