/*
 * =====================================================
 * BAKEMATE - XỬ LÝ FORM LIÊN HỆ & LƯU TIN NHẮN (contact.html)
 * Tệp: js/contact.js
 * =====================================================
 */

(function () {
  function setErr(inputId, errorId, msg) {
    const input = document.getElementById(inputId);
    const err = document.getElementById(errorId);
    if (err) err.textContent = msg || "";
    if (input) {
      input.classList.toggle("is-invalid", Boolean(msg));
      input.setAttribute("aria-invalid", msg ? "true" : "false");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const nameEl = document.getElementById("contact-fullname");
    const emailEl = document.getElementById("contact-email");
    const phoneEl = document.getElementById("contact-phone");
    const topicEl = document.getElementById("contact-topic");
    const msgEl = document.getElementById("contact-message");
    const alertBox = document.getElementById("contact-form-alert");
    const successBox = document.getElementById("contact-form-success");

    // Điền sẵn tên & email nếu người dùng đã đăng nhập
    const currentUser =
      typeof window.BakeAuth === "object" && typeof window.BakeAuth.getCurrentUser === "function"
        ? window.BakeAuth.getCurrentUser()
        : null;
    if (currentUser) {
      if (nameEl && !nameEl.value) nameEl.value = currentUser.fullName || "";
      if (emailEl && !emailEl.value) emailEl.value = currentUser.email || "";
      if (phoneEl && !phoneEl.value) phoneEl.value = currentUser.phone || "";
    }

    [
      ["contact-fullname", "error-contact-name"],
      ["contact-email", "error-contact-email"],
      ["contact-phone", "error-contact-phone"],
      ["contact-topic", "error-contact-topic"],
      ["contact-message", "error-contact-message"]
    ].forEach(([iid, eid]) => {
      const el = document.getElementById(iid);
      if (el) {
        el.addEventListener("input", () => setErr(iid, eid, ""));
        el.addEventListener("change", () => setErr(iid, eid, ""));
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (successBox) successBox.hidden = true;

      const fullName = nameEl ? nameEl.value.trim() : "";
      const email = emailEl ? emailEl.value.trim() : "";
      const phone = phoneEl ? phoneEl.value.replace(/[\s.-]/g, "").trim() : "";
      const topic = topicEl ? topicEl.value.trim() : "";
      const message = msgEl ? msgEl.value.trim() : "";

      let ok = true;
      let firstInvalid = null;

      if (fullName.length < 2) {
        setErr("contact-fullname", "error-contact-name", "Vui lòng nhập họ và tên (tối thiểu 2 ký tự).");
        ok = false;
        firstInvalid = firstInvalid || nameEl;
      } else {
        setErr("contact-fullname", "error-contact-name", "");
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        setErr("contact-email", "error-contact-email", "Vui lòng nhập địa chỉ email hợp lệ.");
        ok = false;
        firstInvalid = firstInvalid || emailEl;
      } else {
        setErr("contact-email", "error-contact-email", "");
      }

      if (phone !== "" && !/^(0[35789])[0-9]{8}$/.test(phone)) {
        setErr("contact-phone", "error-contact-phone", "Số điện thoại Việt Nam phải gồm 10 chữ số.");
        ok = false;
        firstInvalid = firstInvalid || phoneEl;
      } else {
        setErr("contact-phone", "error-contact-phone", "");
      }

      if (!topic) {
        setErr("contact-topic", "error-contact-topic", "Vui lòng chọn chủ đề liên hệ.");
        ok = false;
        firstInvalid = firstInvalid || topicEl;
      } else {
        setErr("contact-topic", "error-contact-topic", "");
      }

      if (message.length < 10) {
        setErr("contact-message", "error-contact-message", "Vui lòng nhập nội dung chi tiết tối thiểu 10 ký tự.");
        ok = false;
        firstInvalid = firstInvalid || msgEl;
      } else {
        setErr("contact-message", "error-contact-message", "");
      }

      if (!ok) {
        if (alertBox) {
          alertBox.textContent = "Vui lòng kiểm tra lại các thông tin liên hệ được đánh dấu đỏ.";
          alertBox.hidden = false;
        }
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (alertBox) alertBox.hidden = true;

      if (typeof window.saveContactMessage === "function") {
        window.saveContactMessage({
          fullName,
          email,
          phone,
          topic,
          message,
          status: "Mới tiếp nhận"
        });
      }

      form.reset();
      if (successBox) {
        successBox.textContent =
          "Cảm ơn bạn đã liên hệ! Lời nhắn đã được gửi tới đội ngũ BakeMate và sẽ được phản hồi trong 24 giờ.";
        successBox.hidden = false;
      }
      if (typeof window.showCartToast === "function") {
        window.showCartToast("Gửi liên hệ thành công! BakeMate sẽ phản hồi bạn sớm nhất.", {
          type: "success"
        });
      }
    });

    // Khởi tạo Accordion Câu hỏi thường gặp (FAQ)
    const faqTriggers = document.querySelectorAll(".js-faq-trigger");
    faqTriggers.forEach((trigger) => {
      trigger.addEventListener("click", function () {
        const item = trigger.closest(".faq-item");
        if (!item) return;
        const panel = item.querySelector(".faq-item__panel");
        const nextOpen = !item.classList.contains("is-open");

        document.querySelectorAll("#faq-list .faq-item").forEach((other) => {
          if (other !== item) {
            other.classList.remove("is-open");
            const otherBtn = other.querySelector(".js-faq-trigger");
            const otherPanel = other.querySelector(".faq-item__panel");
            if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
            if (otherPanel) otherPanel.hidden = true;
          }
        });

        item.classList.toggle("is-open", nextOpen);
        trigger.setAttribute("aria-expanded", nextOpen ? "true" : "false");
        if (panel) panel.hidden = !nextOpen;
      });
    });
  });
})();
