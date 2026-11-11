/*
 * =====================================================
 * BAKEMATE - ĐIỀU KHIỂN TRANG XÁC THỰC (Login / Register / Forgot Password)
 * Tệp: js/auth-pages.js
 * Hỗ trợ: Đăng nhập + Phân quyền điều hướng + Khóa Admin 5 lần sai,
 * Đăng ký Customer (3-tier Password Strength, Realtime Match, Eye Toggle),
 * Quên mật khẩu Wizard 3 bước OTP (6 ô nhập, đếm ngược 01:59, Force Logout Admin).
 * =====================================================
 */

(function () {
  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Chỉ cho phép điều hướng nội bộ an toàn (.html cùng nguồn).
   */
  function getSafeRedirectUrl(rawParam) {
    const val = String(rawParam || "").trim();
    if (!val) return null;
    if (/^[a-z0-9-]+\.html(\?[a-z0-9=&_%.-]*)?$/i.test(val)) {
      return val;
    }
    return null;
  }

  function showBoxFeedback(boxEl, message, variant) {
    if (!boxEl) return;
    if (!message) {
      boxEl.hidden = true;
      boxEl.textContent = "";
      return;
    }
    const styles = {
      error: "background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;",
      warning: "background:#fffbeb;border:1px solid #fde68a;color:#b45309;",
      success: "background:#f0fdf4;border:1px solid #bbf7d0;color:#15803d;"
    };
    boxEl.setAttribute("style", `margin-bottom:16px;padding:12px 14px;border-radius:10px;font-size:13.5px;font-weight:600;line-height:1.5;${styles[variant] || styles.error}`);
    boxEl.textContent = message;
    boxEl.hidden = false;
  }

  function bindPasswordEyeToggles() {
    document.querySelectorAll(".js-toggle-pass").forEach((btn) => {
      if (btn.dataset.eyeBound === "true") return;
      btn.dataset.eyeBound = "true";
      btn.addEventListener("click", function () {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        if (!input) return;
        const nextType = input.type === "password" ? "text" : "password";
        input.type = nextType;
        btn.setAttribute("aria-label", nextType === "text" ? "Ẩn mật khẩu" : "Hiện mật khẩu");
        btn.style.color = nextType === "text" ? "#d97706" : "#7c5c46";
      });
    });
  }

  function bindStrengthAndMatchMeters(passId, confirmId, fillId, textId, matchId) {
    const passEl = document.getElementById(passId);
    const confirmEl = document.getElementById(confirmId);
    const fillEl = document.getElementById(fillId);
    const textEl = document.getElementById(textId);
    const matchEl = document.getElementById(matchId);

    function updateStrength() {
      if (!passEl || !fillEl || !textEl || !window.BakeAuth) return;
      const result = window.BakeAuth.evaluatePasswordStrength(passEl.value);
      const colors = {
        none: { width: "0%", color: "#e2e8f0", textColor: "#8c6a52" },
        weak: { width: "33%", color: "#dc2626", textColor: "#dc2626" },
        medium: { width: "66%", color: "#f59e0b", textColor: "#b45309" },
        strong: { width: "100%", color: "#16a34a", textColor: "#15803d" }
      };
      const meta = colors[result.level] || colors.none;
      fillEl.style.width = meta.width;
      fillEl.style.backgroundColor = meta.color;
      textEl.style.color = meta.textColor;
      textEl.textContent = `Độ mạnh mật khẩu: ${result.label}`;
    }

    function updateMatch() {
      if (!passEl || !confirmEl || !matchEl) return;
      const p1 = passEl.value;
      const p2 = confirmEl.value;
      if (!p2) {
        matchEl.textContent = "";
        return;
      }
      if (p1 === p2) {
        matchEl.style.color = "#15803d";
        matchEl.textContent = "Mật khẩu xác nhận khớp hoàn toàn.";
      } else {
        matchEl.style.color = "#dc2626";
        matchEl.textContent = "Mật khẩu xác nhận chưa trùng khớp.";
      }
    }

    if (passEl) {
      passEl.addEventListener("input", function () {
        updateStrength();
        updateMatch();
      });
    }
    if (confirmEl) {
      confirmEl.addEventListener("input", updateMatch);
    }
  }

  function resolveDestination(userRole, safeRedirect) {
    if (safeRedirect) {
      if (safeRedirect === "admin.html" && userRole !== "admin") {
        return "index.html";
      }
      return safeRedirect;
    }
    return userRole === "admin" ? "admin.html" : "index.html";
  }

  function initLoginPage() {
    const form = document.getElementById("login-form");
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const safeRedirect = getSafeRedirectUrl(params.get("redirect"));
    const prefillEmail = params.get("email");
    const isJustRegistered = params.get("registered") === "1";

    const feedbackEl = document.getElementById("auth-feedback");
    const identifierInput = document.getElementById("login-identifier");
    const passwordInput = document.getElementById("login-password");
    const rememberInput = document.getElementById("login-remember");
    const errIdEl = document.getElementById("err-login-identifier");
    const errPassEl = document.getElementById("err-login-password");
    const activeSessionBox = document.getElementById("auth-active-session-box");
    const registerLink = document.getElementById("link-to-register");

    if (registerLink && safeRedirect) {
      registerLink.href = `register.html?redirect=${encodeURIComponent(safeRedirect)}`;
    }

    if (prefillEmail && identifierInput) {
      identifierInput.value = prefillEmail;
    }

    if (isJustRegistered) {
      showBoxFeedback(
        feedbackEl,
        "Đăng ký tài khoản thành công! Vui lòng đăng nhập để sử dụng mã CHAOBANMOI (-10%).",
        "success"
      );
    }

    const currentUser = window.BakeAuth ? window.BakeAuth.getCurrentUser() : null;
    if (currentUser && activeSessionBox) {
      const dest = resolveDestination(currentUser.role, safeRedirect);
      const roleLabel = currentUser.role === "admin" ? "Quản trị viên (Admin)" : "Khách hàng";
      activeSessionBox.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:8px;">
          <span>Bạn đang đăng nhập với tên <strong>${escapeHtml(currentUser.fullName)}</strong> (${roleLabel}).</span>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <a href="${escapeHtml(dest)}" class="btn btn--primary" style="padding:6px 12px;font-size:12.5px;">
              ${currentUser.role === "admin" ? "Đi tới Admin Dashboard" : "Tiếp tục mua sắm"}
            </a>
            <button type="button" id="btn-switch-account" class="btn btn--outline-dark" style="padding:6px 12px;font-size:12.5px;">
              Đăng xuất để đổi tài khoản
            </button>
          </div>
        </div>
      `;
      activeSessionBox.hidden = false;

      const switchBtn = document.getElementById("btn-switch-account");
      if (switchBtn) {
        switchBtn.addEventListener("click", function () {
          if (window.BakeAuth) window.BakeAuth.logoutAccount();
          activeSessionBox.hidden = true;
          showBoxFeedback(feedbackEl, "Đã đăng xuất tài khoản hiện tại. Bạn có thể đăng nhập tài khoản khác.", "success");
        });
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (errIdEl) errIdEl.textContent = "";
      if (errPassEl) errPassEl.textContent = "";
      showBoxFeedback(feedbackEl, "", "error");

      const identifier = identifierInput ? identifierInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value : "";
      const rememberMe = rememberInput ? rememberInput.checked : true;

      let hasError = false;
      if (!identifier) {
        if (errIdEl) errIdEl.textContent = "Vui lòng nhập Email hoặc Số điện thoại.";
        hasError = true;
      }
      if (!password) {
        if (errPassEl) errPassEl.textContent = "Vui lòng nhập mật khẩu.";
        hasError = true;
      }
      if (hasError || !window.BakeAuth) return;

      const res = window.BakeAuth.loginAccount({ identifier, password, rememberMe });
      if (!res.success) {
        showBoxFeedback(feedbackEl, res.message, res.locked ? "warning" : "error");
        return;
      }

      if (typeof window.showCartToast === "function") {
        window.showCartToast(res.message, { type: "success" });
      }
      const nextUrl = resolveDestination(res.role, safeRedirect);
      window.setTimeout(function () {
        window.location.href = nextUrl;
      }, 450);
    });

    document.querySelectorAll(".js-social-login").forEach((btn) => {
      btn.addEventListener("click", function () {
        if (!window.BakeAuth) return;
        const provider = btn.dataset.provider || "Google";
        const res = window.BakeAuth.socialLoginDemo(provider);
        if (res.success) {
          if (typeof window.showCartToast === "function") {
            window.showCartToast(res.message, { type: "success" });
          }
          const nextUrl = resolveDestination("customer", safeRedirect);
          window.setTimeout(function () {
            window.location.href = nextUrl;
          }, 450);
        }
      });
    });

    document.querySelectorAll(".js-demo-login").forEach((btn) => {
      btn.addEventListener("click", function () {
        if (!window.BakeAuth) return;
        const demoRole = btn.dataset.demoRole === "admin" ? "admin" : "customer";
        const res = window.BakeAuth.ensureAndLoginDemoAccount(demoRole);
        if (res.success) {
          if (typeof window.showCartToast === "function") {
            window.showCartToast(
              `Đã đăng nhập nhanh với vai trò ${res.role === "admin" ? "Quản trị viên" : "Khách hàng"}.`,
              { type: "success" }
            );
          }
          const nextUrl = resolveDestination(res.role, safeRedirect);
          window.setTimeout(function () {
            window.location.href = nextUrl;
          }, 400);
        }
      });
    });
  }

  function initRegisterPage() {
    const form = document.getElementById("register-form");
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const safeRedirect = getSafeRedirectUrl(params.get("redirect"));
    const loginLink = document.getElementById("link-to-login");
    if (loginLink && safeRedirect) {
      loginLink.href = `login.html?redirect=${encodeURIComponent(safeRedirect)}`;
    }

    bindStrengthAndMatchMeters(
      "reg-password",
      "reg-confirm",
      "reg-strength-fill",
      "reg-strength-text",
      "reg-match-hint"
    );

    const feedbackEl = document.getElementById("auth-feedback");
    const nameEl = document.getElementById("reg-fullname");
    const emailEl = document.getElementById("reg-email");
    const phoneEl = document.getElementById("reg-phone");
    const passEl = document.getElementById("reg-password");
    const confirmEl = document.getElementById("reg-confirm");
    const termsEl = document.getElementById("reg-terms");

    const errName = document.getElementById("err-reg-fullname");
    const errEmail = document.getElementById("err-reg-email");
    const errPhone = document.getElementById("err-reg-phone");
    const errPass = document.getElementById("err-reg-password");
    const errConfirm = document.getElementById("err-reg-confirm");
    const errTerms = document.getElementById("err-reg-terms");

    function clearErrors() {
      [errName, errEmail, errPhone, errPass, errConfirm, errTerms].forEach((el) => {
        if (el) el.textContent = "";
      });
      showBoxFeedback(feedbackEl, "", "error");
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors();
      if (!window.BakeAuth) return;

      const fullName = nameEl ? nameEl.value.trim() : "";
      const email = emailEl ? emailEl.value.trim() : "";
      const phone = phoneEl ? phoneEl.value.trim() : "";
      const password = passEl ? passEl.value : "";
      const confirmPassword = confirmEl ? confirmEl.value : "";
      const agreedTerms = termsEl ? termsEl.checked : false;

      let invalid = false;
      if (fullName.length < 2) {
        if (errName) errName.textContent = "Vui lòng nhập họ và tên tối thiểu 2 ký tự.";
        invalid = true;
      }
      if (!window.BakeAuth.validateEmail(email)) {
        if (errEmail) errEmail.textContent = "Email chưa đúng định dạng (VD: ten@gmail.com).";
        invalid = true;
      }
      if (!window.BakeAuth.validateVNPhone(phone)) {
        if (errPhone) errPhone.textContent = "Số điện thoại Việt Nam phải gồm 10 số (03/05/07/08/09).";
        invalid = true;
      }
      if (password.length < 8) {
        if (errPass) errPass.textContent = "Mật khẩu phải có ít nhất 8 ký tự.";
        invalid = true;
      }
      if (password !== confirmPassword) {
        if (errConfirm) errConfirm.textContent = "Xác nhận mật khẩu chưa trùng khớp.";
        invalid = true;
      }
      if (!agreedTerms) {
        if (errTerms) errTerms.textContent = "Vui lòng đồng ý Điều khoản dịch vụ & Chính sách bảo mật.";
        invalid = true;
      }
      if (invalid) return;

      const res = window.BakeAuth.registerCustomer({
        fullName,
        email,
        phone,
        password,
        confirmPassword,
        agreedTerms
      });

      if (!res.success) {
        showBoxFeedback(feedbackEl, res.message, "error");
        return;
      }

      showBoxFeedback(
        feedbackEl,
        `${res.message} Đang chuyển sang trang Đăng nhập...`,
        "success"
      );
      if (typeof window.showCartToast === "function") {
        window.showCartToast("Đăng ký thành công! Bạn đã được cấp quyền Khách hàng.", { type: "success" });
      }

      const nextParams = new URLSearchParams();
      nextParams.set("registered", "1");
      nextParams.set("email", res.user.email);
      if (safeRedirect) nextParams.set("redirect", safeRedirect);

      window.setTimeout(function () {
        window.location.href = `login.html?${nextParams.toString()}`;
      }, 1300);
    });

    document.querySelectorAll(".js-social-login").forEach((btn) => {
      btn.addEventListener("click", function () {
        if (!window.BakeAuth) return;
        const provider = btn.dataset.provider || "Google";
        const res = window.BakeAuth.socialLoginDemo(provider);
        if (res.success) {
          if (typeof window.showCartToast === "function") {
            window.showCartToast(res.message, { type: "success" });
          }
          window.setTimeout(function () {
            window.location.href = resolveDestination("customer", safeRedirect);
          }, 450);
        }
      });
    });
  }

  function initForgotPasswordPage() {
    const step1 = document.getElementById("fp-step-1");
    if (!step1) return;

    const step2 = document.getElementById("fp-step-2");
    const step3 = document.getElementById("fp-step-3");
    const stepDone = document.getElementById("fp-step-done");
    const feedbackEl = document.getElementById("fp-feedback");
    const subtitleEl = document.getElementById("fp-step-subtitle");
    const progressEl = document.getElementById("fp-progressbar");
    const progressFillEl = document.getElementById("fp-progress-fill");

    const emailInput = document.getElementById("fp-email");
    const errEmailEl = document.getElementById("err-fp-email");
    const targetEmailEl = document.getElementById("fp-target-email-display");
    const demoOtpHintEl = document.getElementById("fp-demo-otp-hint");
    const timerEl = document.getElementById("fp-timer");
    const resendBtn = document.getElementById("fp-resend-btn");
    const backStep1Btn = document.getElementById("fp-back-step1");
    const otpBoxes = Array.from(document.querySelectorAll(".js-otp-digit"));

    const newPassInput = document.getElementById("fp-new-password");
    const confirmPassInput = document.getElementById("fp-confirm-password");
    const errNewPassEl = document.getElementById("err-fp-newpass");
    const errConfirmEl = document.getElementById("err-fp-confirm");
    const doneMessageEl = document.getElementById("fp-done-message");

    bindStrengthAndMatchMeters(
      "fp-new-password",
      "fp-confirm-password",
      "fp-strength-fill",
      "fp-strength-text",
      "fp-match-hint"
    );

    let activeEmail = "";
    let countdownTimer = null;

    function setWizardStep(stepNum) {
      step1.hidden = stepNum !== 1;
      step2.hidden = stepNum !== 2;
      step3.hidden = stepNum !== 3;
      stepDone.hidden = stepNum !== 4;

      const subtitles = {
        1: "Bước 1/3: Nhập email đã đăng ký để nhận mã xác thực OTP",
        2: "Bước 2/3: Nhập mã OTP 6 chữ số vừa gửi tới email của bạn",
        3: "Bước 3/3: Thiết lập mật khẩu mới an toàn",
        4: "Hoàn tất: Mật khẩu của bạn đã được cập nhật"
      };
      if (subtitleEl) subtitleEl.textContent = subtitles[stepNum] || "";
      const pct = stepNum >= 3 ? 100 : stepNum === 2 ? 66.66 : 33.33;
      if (progressFillEl) progressFillEl.style.width = `${pct}%`;
      if (progressEl) progressEl.setAttribute("aria-valuenow", String(Math.min(3, stepNum)));
    }

    function startCountdown(seconds) {
      if (countdownTimer) window.clearInterval(countdownTimer);
      let remaining = seconds;
      if (resendBtn) resendBtn.hidden = true;

      function renderClock() {
        const min = Math.floor(remaining / 60);
        const sec = remaining % 60;
        if (timerEl) {
          timerEl.textContent = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
        }
      }

      renderClock();
      countdownTimer = window.setInterval(function () {
        remaining -= 1;
        if (remaining <= 0) {
          window.clearInterval(countdownTimer);
          countdownTimer = null;
          if (timerEl) timerEl.textContent = "00:00 (Hết hạn)";
          if (resendBtn) resendBtn.hidden = false;
          return;
        }
        renderClock();
      }, 1000);
    }

    function dispatchOtpRequest(email) {
      if (!window.BakeAuth) return false;
      const res = window.BakeAuth.requestPasswordOtp(email);
      if (!res.success) {
        showBoxFeedback(feedbackEl, res.message, "error");
        return false;
      }
      activeEmail = res.email;
      if (targetEmailEl) targetEmailEl.textContent = activeEmail;
      if (demoOtpHintEl) {
        demoOtpHintEl.innerHTML = `Mô phỏng Email OTP (dùng để kiểm thử): <strong style="font-size:15px;letter-spacing:2px;color:#b45309;">${escapeHtml(res.otpDemo)}</strong>`;
        demoOtpHintEl.hidden = false;
      }
      if (typeof window.showCartToast === "function") {
        window.showCartToast(`Mã OTP thử nghiệm: ${res.otpDemo}`, { type: "success", duration: 5000 });
      }
      showBoxFeedback(feedbackEl, "", "success");
      otpBoxes.forEach((box) => {
        box.value = "";
      });
      setWizardStep(2);
      startCountdown(119); // 01:59
      if (otpBoxes[0]) otpBoxes[0].focus();
      return true;
    }

    // 6-digit OTP box UX (auto-advance, backspace back, paste)
    otpBoxes.forEach((box, idx) => {
      box.addEventListener("input", function () {
        const clean = box.value.replace(/\D/g, "");
        box.value = clean ? clean.charAt(0) : "";
        if (box.value && idx < otpBoxes.length - 1) {
          otpBoxes[idx + 1].focus();
        }
      });

      box.addEventListener("keydown", function (event) {
        if (event.key === "Backspace" && !box.value && idx > 0) {
          otpBoxes[idx - 1].focus();
        }
      });

      box.addEventListener("paste", function (event) {
        const pasted = (event.clipboardData || window.clipboardData).getData("text");
        const digits = String(pasted || "").replace(/\D/g, "").slice(0, 6);
        if (digits.length >= 2) {
          event.preventDefault();
          otpBoxes.forEach((b, i) => {
            b.value = digits[i] || "";
          });
          const focusIdx = Math.min(digits.length, otpBoxes.length - 1);
          if (otpBoxes[focusIdx]) otpBoxes[focusIdx].focus();
        }
      });
    });

    step1.addEventListener("submit", function (event) {
      event.preventDefault();
      if (errEmailEl) errEmailEl.textContent = "";
      showBoxFeedback(feedbackEl, "", "error");
      const rawEmail = emailInput ? emailInput.value.trim() : "";
      if (!window.BakeAuth || !window.BakeAuth.validateEmail(rawEmail)) {
        if (errEmailEl) errEmailEl.textContent = "Vui lòng nhập địa chỉ email hợp lệ.";
        return;
      }
      dispatchOtpRequest(rawEmail);
    });

    if (resendBtn) {
      resendBtn.addEventListener("click", function () {
        if (activeEmail) {
          dispatchOtpRequest(activeEmail);
        }
      });
    }

    if (backStep1Btn) {
      backStep1Btn.addEventListener("click", function () {
        if (countdownTimer) window.clearInterval(countdownTimer);
        showBoxFeedback(feedbackEl, "", "error");
        setWizardStep(1);
      });
    }

    step2.addEventListener("submit", function (event) {
      event.preventDefault();
      showBoxFeedback(feedbackEl, "", "error");
      const otpCode = otpBoxes.map((b) => b.value.trim()).join("");
      if (otpCode.length !== 6) {
        showBoxFeedback(feedbackEl, "Vui lòng nhập đủ 6 chữ số mã OTP.", "error");
        return;
      }
      if (!window.BakeAuth) return;
      const res = window.BakeAuth.verifyPasswordOtp(activeEmail, otpCode);
      if (!res.success) {
        showBoxFeedback(feedbackEl, res.message, "error");
        return;
      }
      if (countdownTimer) window.clearInterval(countdownTimer);
      showBoxFeedback(feedbackEl, res.message, "success");
      setWizardStep(3);
      if (newPassInput) newPassInput.focus();
    });

    step3.addEventListener("submit", function (event) {
      event.preventDefault();
      if (errNewPassEl) errNewPassEl.textContent = "";
      if (errConfirmEl) errConfirmEl.textContent = "";
      showBoxFeedback(feedbackEl, "", "error");

      const p1 = newPassInput ? newPassInput.value : "";
      const p2 = confirmPassInput ? confirmPassInput.value : "";
      let invalid = false;

      if (p1.length < 8) {
        if (errNewPassEl) errNewPassEl.textContent = "Mật khẩu mới phải có tối thiểu 8 ký tự.";
        invalid = true;
      }
      if (p1 !== p2) {
        if (errConfirmEl) errConfirmEl.textContent = "Mật khẩu xác nhận chưa trùng khớp.";
        invalid = true;
      }
      if (invalid || !window.BakeAuth) return;

      const res = window.BakeAuth.resetAccountPassword(activeEmail, p1, p2);
      if (!res.success) {
        showBoxFeedback(feedbackEl, res.message, "error");
        return;
      }

      showBoxFeedback(feedbackEl, "", "success");
      if (doneMessageEl) doneMessageEl.textContent = res.message;
      setWizardStep(4);
      if (typeof window.showCartToast === "function") {
        window.showCartToast("Đặt lại mật khẩu thành công!", { type: "success" });
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindPasswordEyeToggles();
    initLoginPage();
    initRegisterPage();
    initForgotPasswordPage();
  });
})();
