/*
 * =====================================================
 * BAKEMATE - QUẢN LÝ XÁC THỰC & PHÂN QUYỀN (CUSTOMER / ADMIN)
 * Tệp: js/auth.js
 * Hỗ trợ: Đăng ký (Customer mặc định), Đăng nhập, Phân quyền điều hướng,
 * Khóa tạm Admin khi sai > 5 lần (30 phút), Quên mật khẩu 3 bước OTP & Force Logout.
 * =====================================================
 */

(function () {
  const USERS_STORAGE_KEY = "bakemate_users";
  const SESSION_STORAGE_KEY = "bakemate_session";
  const OTP_STORAGE_KEY = "bakemate_otp_state";
  const SECURITY_LOG_KEY = "bakemate_security_logs";
  const ADMIN_MAX_FAILED_ATTEMPTS = 5;
  const ADMIN_LOCK_DURATION_MS = 30 * 60 * 1000; // 30 phút

  /**
   * Hàm băm 64-bit cũ (chỉ giữ để đối chiếu nâng cấp tài khoản cũ đã lưu trước đó trong localStorage).
   */
  function legacyHash64(rawText) {
    const str = String(rawText || "");
    let h1 = 0xdeadbeef ^ str.length;
    let h2 = 0x41c6ce57 ^ str.length;
    for (let i = 0; i < str.length; i += 1) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
  }

  /**
   * Hàm băm MD5 chuẩn RFC 1321 (32 ký tự hex chữ thường, hỗ trợ UTF-8).
   * Lưu ý bảo mật: chỉ phục vụ mô phỏng đồ án client-side không có backend; triển khai thực tế cần bcrypt/Argon2 phía server.
   */
  function hashMd5(rawText) {
    const input = String(rawText == null ? "" : rawText);
    const bytes = [];
    if (typeof TextEncoder !== "undefined") {
      const encoded = new TextEncoder().encode(input);
      for (let i = 0; i < encoded.length; i += 1) bytes.push(encoded[i]);
    } else {
      const utf8Str = unescape(encodeURIComponent(input));
      for (let i = 0; i < utf8Str.length; i += 1) bytes.push(utf8Str.charCodeAt(i));
    }

    const origBitLen = bytes.length * 8;
    bytes.push(0x80);
    while ((bytes.length % 64) !== 56) {
      bytes.push(0);
    }
    const lowBits = origBitLen >>> 0;
    const highBits = Math.floor(origBitLen / 0x100000000) >>> 0;
    bytes.push(
      lowBits & 0xff,
      (lowBits >>> 8) & 0xff,
      (lowBits >>> 16) & 0xff,
      (lowBits >>> 24) & 0xff,
      highBits & 0xff,
      (highBits >>> 8) & 0xff,
      (highBits >>> 16) & 0xff,
      (highBits >>> 24) & 0xff
    );

    const S = [
      7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
      5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
      4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
      6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
    ];
    const K = [
      0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
      0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
      0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
      0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
      0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
      0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
      0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
      0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
    ];

    let a0 = 0x67452301;
    let b0 = 0xefcdab89;
    let c0 = 0x98badcfe;
    let d0 = 0x10325476;

    const M = new Array(16);
    for (let offset = 0; offset < bytes.length; offset += 64) {
      for (let j = 0; j < 16; j += 1) {
        const idx = offset + j * 4;
        M[j] =
          (bytes[idx] |
            (bytes[idx + 1] << 8) |
            (bytes[idx + 2] << 16) |
            (bytes[idx + 3] << 24)) >>>
          0;
      }

      let A = a0;
      let B = b0;
      let C = c0;
      let D = d0;

      for (let i = 0; i < 64; i += 1) {
        let F;
        let g;
        if (i < 16) {
          F = (B & C) | (~B & D);
          g = i;
        } else if (i < 32) {
          F = (D & B) | (~D & C);
          g = (5 * i + 1) % 16;
        } else if (i < 48) {
          F = B ^ C ^ D;
          g = (3 * i + 5) % 16;
        } else {
          F = C ^ (B | ~D);
          g = (7 * i) % 16;
        }
        const sum = (F + A + K[i] + M[g]) >>> 0;
        const rotated = ((sum << S[i]) | (sum >>> (32 - S[i]))) >>> 0;
        A = D;
        D = C;
        C = B;
        B = (B + rotated) >>> 0;
      }

      a0 = (a0 + A) >>> 0;
      b0 = (b0 + B) >>> 0;
      c0 = (c0 + C) >>> 0;
      d0 = (d0 + D) >>> 0;
    }

    function toHexLE(word) {
      let hex = "";
      for (let b = 0; b < 4; b += 1) {
        const byteVal = (word >>> (b * 8)) & 0xff;
        hex += (byteVal < 16 ? "0" : "") + byteVal.toString(16);
      }
      return hex;
    }

    return toHexLE(a0) + toHexLE(b0) + toHexLE(c0) + toHexLE(d0);
  }

  function hashSecret(rawText) {
    return hashMd5(rawText);
  }

  function normalizePhone(phone) {
    return String(phone || "").replace(/[\s.-]/g, "").trim();
  }

  function validateEmail(email) {
    const clean = String(email || "").trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean);
  }

  function validateVNPhone(phone) {
    const clean = normalizePhone(phone);
    return /^(0[35789])[0-9]{8}$/.test(clean);
  }

  function evaluatePasswordStrength(password) {
    const value = String(password || "");
    if (!value) {
      return { level: "none", score: 0, label: "Chưa nhập mật khẩu" };
    }
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value) && value.length >= 10) score += 1;

    if (value.length < 8 || score <= 1) {
      return { level: "weak", score: 1, label: "Yếu (tối thiểu 8 ký tự)" };
    }
    if (score === 2) {
      return { level: "medium", score: 2, label: "Trung bình" };
    }
    return { level: "strong", score: 3, label: "Mạnh" };
  }

  function getUsers() {
    try {
      const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveUsers(users) {
    try {
      window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn("Không thể lưu danh sách tài khoản:", e);
    }
    return users;
  }

  function logSecurityAlert(email, message) {
    try {
      const raw = window.localStorage.getItem(SECURITY_LOG_KEY);
      const logs = raw ? JSON.parse(raw) : [];
      const next = [
        {
          id: `sec-${Date.now()}`,
          email,
          message,
          createdAt: new Date().toISOString()
        },
        ...(Array.isArray(logs) ? logs : [])
      ].slice(0, 20);
      window.localStorage.setItem(SECURITY_LOG_KEY, JSON.stringify(next));
    } catch (e) {
      // ignore
    }
  }

  function getSecurityLogs() {
    try {
      const raw = window.localStorage.getItem(SECURITY_LOG_KEY);
      const logs = raw ? JSON.parse(raw) : [];
      return Array.isArray(logs) ? logs : [];
    } catch (e) {
      return [];
    }
  }

  function getSessionData() {
    try {
      const rawLocal = window.localStorage.getItem(SESSION_STORAGE_KEY);
      const rawSession = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
      const raw = rawLocal || rawSession;
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function saveSessionData(session, rememberMe) {
    try {
      const serialized = JSON.stringify(session);
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      if (rememberMe) {
        window.localStorage.setItem(SESSION_STORAGE_KEY, serialized);
      } else {
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, serialized);
      }
    } catch (e) {
      console.warn("Không thể lưu phiên đăng nhập:", e);
    }
    window.dispatchEvent(new CustomEvent("bakemate:authChanged", { detail: session }));
  }

  function clearSessionData() {
    try {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    window.dispatchEvent(new CustomEvent("bakemate:authChanged", { detail: null }));
  }

  /**
   * Trả về thông tin người dùng hiện tại nếu tokenVersion còn hiệu lực.
   */
  function getCurrentUser() {
    const session = getSessionData();
    if (!session || !session.userId) {
      return null;
    }
    const users = getUsers();
    const matched = users.find((u) => u.id === session.userId);
    if (!matched) {
      return session.isDemoQuickSession ? session : null;
    }
    if (Number(matched.tokenVersion || 1) !== Number(session.tokenVersion || 1)) {
      clearSessionData();
      return null;
    }
    return Object.assign({}, session, {
      fullName: matched.fullName,
      email: matched.email,
      phone: matched.phone,
      role: matched.role,
      isSuperAdmin: Boolean(matched.isSuperAdmin)
    });
  }

  /**
   * Đăng ký tài khoản công khai — luôn gán quyền mặc định role: 'customer'.
   */
  function registerCustomer({ fullName, email, phone, password, confirmPassword, agreedTerms }) {
    const cleanName = String(fullName || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanPhone = normalizePhone(phone);

    if (cleanName.length < 2) {
      return { success: false, message: "Vui lòng nhập họ và tên hợp lệ (tối thiểu 2 ký tự)." };
    }
    if (!validateEmail(cleanEmail)) {
      return { success: false, message: "Định dạng Email chưa hợp lệ." };
    }
    if (!validateVNPhone(cleanPhone)) {
      return { success: false, message: "Số điện thoại Việt Nam phải gồm 10 chữ số (bắt đầu bằng 03, 05, 07, 08 hoặc 09)." };
    }
    if (String(password || "").length < 8) {
      return { success: false, message: "Mật khẩu phải có ít nhất 8 ký tự." };
    }
    if (password !== confirmPassword) {
      return { success: false, message: "Xác nhận mật khẩu chưa trùng khớp." };
    }
    if (!agreedTerms) {
      return { success: false, message: "Vui lòng đồng ý với Điều khoản dịch vụ & Chính sách bảo mật." };
    }

    const users = getUsers();
    const duplicate = users.find(
      (u) => u.email.toLowerCase() === cleanEmail || normalizePhone(u.phone) === cleanPhone
    );
    if (duplicate) {
      return { success: false, message: "Email hoặc số điện thoại đã tồn tại trên hệ thống." };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      secretDigest: hashSecret(password),
      role: "customer", // Luôn mặc định Customer; tuyệt đối không tự đăng ký Admin tại form public
      isSuperAdmin: false,
      tokenVersion: 1,
      failedAttempts: 0,
      lockUntil: 0,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    return {
      success: true,
      user: { id: newUser.id, fullName: newUser.fullName, email: newUser.email, role: newUser.role },
      message: "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận."
    };
  }

  /**
   * Đăng nhập theo Email hoặc Số điện thoại + kiểm tra khóa Admin sau 5 lần sai.
   */
  function loginAccount({ identifier, password, rememberMe = true }) {
    const cleanIdentifier = String(identifier || "").trim();
    const normalizedPhone = normalizePhone(cleanIdentifier);
    const lowerEmail = cleanIdentifier.toLowerCase();

    if (!cleanIdentifier || !password) {
      return { success: false, message: "Vui lòng nhập đầy đủ Email/Số điện thoại và mật khẩu." };
    }

    const users = getUsers();
    const userIndex = users.findIndex(
      (u) => u.email.toLowerCase() === lowerEmail || normalizePhone(u.phone) === normalizedPhone
    );

    if (userIndex === -1) {
      return { success: false, message: "Email hoặc mật khẩu chưa chính xác." };
    }

    const user = users[userIndex];
    const now = Date.now();

    if (user.role === "admin" && Number(user.lockUntil || 0) > now) {
      const remainMin = Math.ceil((Number(user.lockUntil) - now) / 60000);
      return {
        success: false,
        locked: true,
        message: `Tài khoản Quản trị viên đang bị khóa tạm thời do nhập sai mật khẩu quá 5 lần. Vui lòng thử lại sau ${remainMin} phút.`
      };
    }

    const md5Digest = hashSecret(password);
    const matchesMd5 = user.secretDigest === md5Digest;
    const matchesLegacy = !/^[a-f0-9]{32}$/.test(String(user.secretDigest || "")) && user.secretDigest === legacyHash64(password);

    if (!matchesMd5 && !matchesLegacy) {
      const nextFails = Number(user.failedAttempts || 0) + 1;
      user.failedAttempts = nextFails;

      if (user.role === "admin" && nextFails > ADMIN_MAX_FAILED_ATTEMPTS) {
        user.lockUntil = now + ADMIN_LOCK_DURATION_MS;
        user.failedAttempts = 0;
        users[userIndex] = user;
        saveUsers(users);
        logSecurityAlert(
          user.email,
          "Cảnh báo an ninh: Tài khoản Admin bị khóa 30 phút do nhập sai mật khẩu quá 5 lần."
        );
        return {
          success: false,
          locked: true,
          message: "Sai mật khẩu quá 5 lần! Tài khoản Admin đã bị khóa tạm thời 30 phút và đã gửi email cảnh báo an ninh."
        };
      }

      users[userIndex] = user;
      saveUsers(users);
      return { success: false, message: "Email hoặc mật khẩu chưa chính xác." };
    }

    // Đăng nhập thành công (tự nâng cấp băm cũ sang MD5 chuẩn nếu cần)
    user.secretDigest = md5Digest;
    user.failedAttempts = 0;
    user.lockUntil = 0;
    users[userIndex] = user;
    saveUsers(users);

    const session = {
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isSuperAdmin: Boolean(user.isSuperAdmin),
      tokenVersion: Number(user.tokenVersion || 1),
      issuedAt: new Date().toISOString()
    };

    saveSessionData(session, Boolean(rememberMe));

    return {
      success: true,
      role: user.role,
      user: session,
      redirectUrl: user.role === "admin" ? "admin.html" : "index.html",
      message: `Chào mừng ${user.fullName} quay lại với BakeMate!`
    };
  }

  /**
   * Khởi tạo & đăng nhập nhanh tài khoản thử nghiệm trên giao diện học tập (không lưu mật khẩu cứng trong mã nguồn).
   */
  function ensureAndLoginDemoAccount(targetRole) {
    const role = targetRole === "admin" ? "admin" : "customer";
    const users = getUsers();
    const demoEmail = role === "admin" ? "admin.demo@bakemate.vn" : "khachhang.demo@bakemate.vn";
    let user = users.find((u) => u.email === demoEmail);

    if (!user) {
      const randomPass = `bm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      user = {
        id: role === "admin" ? "demo-admin-01" : "demo-customer-01",
        fullName: role === "admin" ? "Quản trị viên BakeMate" : "Nguyễn Bảo Ngọc",
        email: demoEmail,
        phone: role === "admin" ? "0909000001" : "0912345678",
        secretDigest: hashSecret(randomPass),
        role,
        isSuperAdmin: role === "admin",
        tokenVersion: 1,
        failedAttempts: 0,
        lockUntil: 0,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      saveUsers(users);
    }

    const session = {
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isSuperAdmin: Boolean(user.isSuperAdmin),
      tokenVersion: Number(user.tokenVersion || 1),
      issuedAt: new Date().toISOString()
    };

    saveSessionData(session, true);
    return {
      success: true,
      role: user.role,
      user: session,
      redirectUrl: user.role === "admin" ? "admin.html" : "index.html"
    };
  }

  /**
   * Đăng nhập MXH giả lập (Google / Facebook) — mặc định Customer.
   */
  function socialLoginDemo(providerName) {
    const provider = providerName === "Facebook" ? "Facebook" : "Google";
    const demoEmail = provider === "Google" ? "google.baker@bakemate.vn" : "facebook.baker@bakemate.vn";
    const users = getUsers();
    let user = users.find((u) => u.email === demoEmail);

    if (!user) {
      user = {
        id: `social-${provider.toLowerCase()}-01`,
        fullName: `Khách hàng ${provider}`,
        email: demoEmail,
        phone: provider === "Google" ? "0933112233" : "0944556677",
        secretDigest: hashSecret(`oauth-${Date.now()}`),
        role: "customer",
        isSuperAdmin: false,
        tokenVersion: 1,
        failedAttempts: 0,
        lockUntil: 0,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      saveUsers(users);
    }

    const session = {
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: "customer",
      isSuperAdmin: false,
      tokenVersion: Number(user.tokenVersion || 1),
      issuedAt: new Date().toISOString()
    };

    saveSessionData(session, true);
    return {
      success: true,
      role: "customer",
      user: session,
      message: `Đăng nhập bằng ${provider} thành công!`
    };
  }

  // ==================== QUÊN MẬT KHẨU 3 BƯỚC OTP ====================

  function requestPasswordOtp(rawEmail) {
    const cleanEmail = String(rawEmail || "").trim().toLowerCase();
    if (!validateEmail(cleanEmail)) {
      return { success: false, message: "Vui lòng nhập địa chỉ email hợp lệ." };
    }
    const users = getUsers();
    const matched = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!matched) {
      return {
        success: false,
        message: "Không tìm thấy tài khoản với email này. Bạn có thể đăng ký mới hoặc dùng tài khoản demo trên trang Đăng nhập."
      };
    }

    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const state = {
      email: cleanEmail,
      otpCode,
      verified: false,
      expiresAt: Date.now() + 120 * 1000 // 01:59
    };

    try {
      window.sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // ignore
    }

    return {
      success: true,
      email: cleanEmail,
      otpDemo: otpCode,
      message: `Mã OTP 6 chữ số đã được gửi tới ${cleanEmail}. (Mã thử nghiệm: ${otpCode})`
    };
  }

  function verifyPasswordOtp(rawEmail, otpInput) {
    const cleanEmail = String(rawEmail || "").trim().toLowerCase();
    const cleanOtp = String(otpInput || "").trim();

    try {
      const raw = window.sessionStorage.getItem(OTP_STORAGE_KEY);
      if (!raw) {
        return { success: false, message: "Phiên OTP đã hết hạn. Vui lòng gửi lại mã mới." };
      }
      const state = JSON.parse(raw);
      if (state.email !== cleanEmail) {
        return { success: false, message: "Email xác thực không khớp." };
      }
      if (Date.now() > Number(state.expiresAt)) {
        return { success: false, message: "Mã OTP đã hết hạn. Vui lòng nhấn gửi lại mã." };
      }
      if (cleanOtp !== state.otpCode) {
        return { success: false, message: "Mã OTP chưa chính xác. Vui lòng kiểm tra lại 6 chữ số." };
      }
      state.verified = true;
      window.sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(state));
      return { success: true, message: "Xác thực OTP thành công! Mời bạn đặt mật khẩu mới." };
    } catch (e) {
      return { success: false, message: "Không thể xác thực OTP." };
    }
  }

  function resetAccountPassword(rawEmail, newPassword, confirmPassword) {
    const cleanEmail = String(rawEmail || "").trim().toLowerCase();
    if (String(newPassword || "").length < 8) {
      return { success: false, message: "Mật khẩu mới phải có ít nhất 8 ký tự." };
    }
    if (newPassword !== confirmPassword) {
      return { success: false, message: "Mật khẩu xác nhận chưa trùng khớp." };
    }

    try {
      const raw = window.sessionStorage.getItem(OTP_STORAGE_KEY);
      const state = raw ? JSON.parse(raw) : null;
      if (!state || !state.verified || state.email !== cleanEmail) {
        return { success: false, message: "Vui lòng hoàn thành bước xác nhận OTP trước." };
      }
    } catch (e) {
      return { success: false, message: "Phiên đặt lại mật khẩu không hợp lệ." };
    }

    const users = getUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
    if (idx === -1) {
      return { success: false, message: "Không tìm thấy tài khoản." };
    }

    const target = users[idx];
    target.secretDigest = hashSecret(newPassword);
    target.failedAttempts = 0;
    target.lockUntil = 0;

    let securityNotice = "";
    if (target.role === "admin") {
      // Hủy toàn bộ Session/Token cũ trên mọi thiết bị + cảnh báo an ninh
      target.tokenVersion = Number(target.tokenVersion || 1) + 1;
      clearSessionData();
      securityNotice =
        " Đã hủy toàn bộ phiên đăng nhập trên thiết bị khác (Force Logout) và gửi Email cảnh báo an ninh tới hộp thư Admin.";
      logSecurityAlert(target.email, "Admin đã đặt lại mật khẩu thành công. Hệ thống đã Force Logout mọi phiên khác.");
    }

    users[idx] = target;
    saveUsers(users);
    window.sessionStorage.removeItem(OTP_STORAGE_KEY);

    return {
      success: true,
      role: target.role,
      message: `Đổi mật khẩu thành công!${securityNotice}`
    };
  }

  // ==================== SUPER ADMIN: CẤP QUYỀN & MỞ KHÓA ====================

  function createAdminAccountBySuperAdmin({ fullName, email, phone, password }) {
    const current = getCurrentUser();
    if (!current || current.role !== "admin" || !current.isSuperAdmin) {
      return { success: false, message: "Chỉ Super Admin mới có quyền cấp tài khoản quản trị." };
    }
    const cleanName = String(fullName || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanPhone = normalizePhone(phone);
    if (cleanName.length < 2 || !validateEmail(cleanEmail) || !validateVNPhone(cleanPhone) || String(password || "").length < 8) {
      return { success: false, message: "Vui lòng nhập đầy đủ họ tên, email, SĐT Việt Nam và mật khẩu tối thiểu 8 ký tự." };
    }

    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: "Email đã tồn tại trong hệ thống." };
    }

    const newAdmin = {
      id: `admin-${Date.now()}`,
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      secretDigest: hashSecret(password),
      role: "admin",
      isSuperAdmin: false,
      tokenVersion: 1,
      failedAttempts: 0,
      lockUntil: 0,
      createdAt: new Date().toISOString()
    };
    users.push(newAdmin);
    saveUsers(users);
    logSecurityAlert(current.email, `Super Admin đã cấp quyền tài khoản quản trị mới cho ${cleanEmail}.`);
    return { success: true, user: newAdmin, message: `Đã cấp tài khoản Quản trị viên cho ${cleanEmail}.` };
  }

  function unlockUserAccount(userId) {
    const users = getUsers().map((u) =>
      u.id === userId ? Object.assign({}, u, { failedAttempts: 0, lockUntil: 0 }) : u
    );
    saveUsers(users);
    return users;
  }

  function logoutAccount() {
    clearSessionData();
  }

  if (typeof window !== "undefined") {
    window.BakeAuth = {
      validateEmail,
      validateVNPhone,
      evaluatePasswordStrength,
      getUsers,
      getCurrentUser,
      registerCustomer,
      loginAccount,
      logoutAccount,
      ensureAndLoginDemoAccount,
      socialLoginDemo,
      requestPasswordOtp,
      verifyPasswordOtp,
      resetAccountPassword,
      createAdminAccountBySuperAdmin,
      unlockUserAccount,
      getSecurityLogs,
      hashMd5
    };
  }
})();
