/*
 * =====================================================
 * BAKEMATE - QUẢN LÝ LOCALSTORAGE & HÀM GIỎ HÀNG DÙNG CHUNG
 * Tệp: js/storage.js (Bước 6)
 * Khóa localStorage: "bakemate_cart", "bakemate_orders"
 * Cấu trúc mỗi phần tử giỏ hàng: { productId: Number, optionIndex: Number, quantity: Number }
 * =====================================================
 */

const CART_STORAGE_KEY = "bakemate_cart";
const ORDERS_STORAGE_KEY = "bakemate_orders";
const MAX_CART_QUANTITY = 99;
const FALLBACK_PRODUCT_IMAGE = "images/logo.jpg";

/**
 * Quy cách đóng gói chuẩn theo từng ID sản phẩm trong products.js.
 * Mục đầu tiên (index 0) luôn đồng bộ 100% với đơn giá gốc product.price.
 */
const PRODUCT_PACKAGING_OPTIONS = {
  1: [
    { shortLabel: "Gói 1kg", price: 52000, oldPrice: 64000 },
    { shortLabel: "Gói 500g", price: 28000, oldPrice: 34000 }
  ],
  2: [
    { shortLabel: "Gói 1kg", price: 45000, oldPrice: 54000 },
    { shortLabel: "Gói 500g", price: 25000, oldPrice: 30000 }
  ],
  3: [
    { shortLabel: "Gói 1kg", price: 32000, oldPrice: 40000 },
    { shortLabel: "Gói 500g", price: 18000, oldPrice: 23000 }
  ],
  4: [
    { shortLabel: "Hộp 100g", price: 65000, oldPrice: 78000 },
    { shortLabel: "Hộp 226g", price: 135000, oldPrice: 160000 }
  ],
  5: [
    { shortLabel: "Gói 100g", price: 75000, oldPrice: 90000 },
    { shortLabel: "Gói 200g", price: 140000, oldPrice: 165000 }
  ],
  6: [
    { shortLabel: "Hộp 250ml", price: 45000, oldPrice: 54000 },
    { shortLabel: "Hộp 1 Lít", price: 155000, oldPrice: 180000 }
  ],
  7: [
    { shortLabel: "Mẫu tiêu chuẩn (5kg/1g)", price: 120000, oldPrice: 150000 },
    { shortLabel: "Kèm khay & pin dự phòng", price: 145000, oldPrice: 175000 }
  ],
  8: [
    { shortLabel: "Ca 500ml", price: 45000, oldPrice: 55000 },
    { shortLabel: "Ca 1000ml", price: 68000, oldPrice: 82000 }
  ],
  9: [
    { shortLabel: "Bộ 5 thìa tiêu chuẩn", price: 35000, oldPrice: 44000 },
    { shortLabel: "Bộ 8 thìa inox", price: 58000, oldPrice: 70000 }
  ],
  10: [
    { shortLabel: "Đầu dò tiêu chuẩn", price: 95000, oldPrice: 115000 },
    { shortLabel: "Đầu dò dài chuyên dụng", price: 118000, oldPrice: 140000 }
  ],
  11: [
    { shortLabel: "Túi 50 cái cỡ vừa", price: 25000, oldPrice: 32000 },
    { shortLabel: "Túi 100 cái cỡ lớn", price: 42000, oldPrice: 52000 }
  ]
};

/**
 * Định dạng số tiền VND theo chuẩn Việt Nam.
 */
function formatCurrency(amount) {
  const numericAmount = Number(amount);
  const safeAmount = Number.isFinite(numericAmount) ? numericAmount : 0;
  return new Intl.NumberFormat("vi-VN").format(safeAmount) + " ₫";
}

/**
 * Lấy danh sách sản phẩm dùng chung từ products.js.
 */
function getProductCatalog() {
  if (typeof window !== "undefined" && Array.isArray(window.products)) {
    return window.products;
  }
  return [];
}

/**
 * Tìm sản phẩm theo ID (Number).
 */
function getProduct(productId) {
  const id = Number(productId);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  const catalog = getProductCatalog();
  return catalog.find((item) => Number(item.id) === id) || null;
}

/**
 * Lấy danh sách quy cách đóng gói hợp lệ cho một sản phẩm.
 */
function getProductOptions(productId) {
  const id = Number(productId);
  const product = getProduct(id);
  const basePrice = product ? Number(product.price) : 0;
  const preset = PRODUCT_PACKAGING_OPTIONS[id];

  if (Array.isArray(preset) && preset.length > 0) {
    return preset.map((opt, idx) => {
      const price = idx === 0 && product ? basePrice : Number(opt.price);
      const oldPrice = Number(opt.oldPrice) > price ? Number(opt.oldPrice) : Math.round(price * 1.2);
      const saveAmount = Math.max(0, oldPrice - price);
      const discountPercent = oldPrice > price ? Math.round((saveAmount / oldPrice) * 100) : 0;
      return {
        optionIndex: idx,
        shortLabel: opt.shortLabel,
        label: `${opt.shortLabel} - ${formatCurrency(price)}`,
        price,
        oldPrice,
        saveAmount,
        discountPercent
      };
    });
  }

  const fallbackOld = Math.round(basePrice * 1.2);
  const fallbackSave = Math.max(0, fallbackOld - basePrice);
  return [
    {
      optionIndex: 0,
      shortLabel: "Tiêu chuẩn",
      label: `Tiêu chuẩn - ${formatCurrency(basePrice)}`,
      price: basePrice,
      oldPrice: fallbackOld,
      saveAmount: fallbackSave,
      discountPercent: fallbackOld > basePrice ? Math.round((fallbackSave / fallbackOld) * 100) : 0
    }
  ];
}

/**
 * Chuẩn hóa chỉ số quy cách đóng gói (optionIndex).
 */
function normalizeOptionIndex(productId, optionIndex) {
  const options = getProductOptions(productId);
  const parsed = Math.floor(Number(optionIndex));
  if (!Number.isFinite(parsed) || parsed < 0 || parsed >= options.length) {
    return 0;
  }
  return parsed;
}

/**
 * Lấy chi tiết một quy cách cụ thể theo productId và optionIndex.
 */
function getProductOption(productId, optionIndex = 0) {
  const options = getProductOptions(productId);
  const normalizedIdx = normalizeOptionIndex(productId, optionIndex);
  return options[normalizedIdx] || options[0];
}

/**
 * Làm sạch dữ liệu giỏ hàng: loại bỏ bản ghi sai định dạng,
 * gộp trùng (productId, optionIndex) và giới hạn số lượng trong [1, MAX_CART_QUANTITY].
 */
function sanitizeCartItems(rawItems) {
  if (!Array.isArray(rawItems)) {
    return [];
  }

  const catalog = getProductCatalog();
  const hasCatalog = catalog.length > 0;
  const mergedMap = new Map();

  rawItems.forEach((entry) => {
    if (!entry || typeof entry !== "object") {
      return;
    }

    const productId = Number(entry.productId);
    const quantity = Math.floor(Number(entry.quantity));

    if (!Number.isInteger(productId) || productId <= 0) {
      return;
    }
    if (!Number.isFinite(quantity) || quantity < 1) {
      return;
    }
    if (hasCatalog && !getProduct(productId)) {
      return;
    }

    const optionIndex = normalizeOptionIndex(productId, entry.optionIndex);
    const key = `${productId}:${optionIndex}`;
    const prev = mergedMap.get(key);
    const nextQty = Math.min(MAX_CART_QUANTITY, (prev ? prev.quantity : 0) + quantity);
    mergedMap.set(key, { productId, optionIndex, quantity: nextQty });
  });

  return Array.from(mergedMap.values());
}

/**
 * Đọc dữ liệu giỏ hàng từ localStorage.
 */
function getCart() {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return sanitizeCartItems(parsed);
  } catch (error) {
    console.warn("Không thể đọc giỏ hàng từ localStorage:", error);
    return [];
  }
}

/**
 * Aliases tương thích tên hàm theo tài liệu nhóm.
 */
function loadCart() {
  return getCart();
}

/**
 * Lưu dữ liệu giỏ hàng vào localStorage, cập nhật badge và phát sự kiện đồng bộ.
 */
function saveCart(cartItems) {
  const cleanCart = sanitizeCartItems(cartItems);

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cleanCart));
  } catch (error) {
    console.error("Không thể lưu giỏ hàng vào localStorage:", error);
  }

  updateCartBadge(cleanCart);

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("bakemate:cartChanged", {
        detail: {
          cart: cleanCart,
          count: getCartCount(cleanCart),
          total: getCartTotal(cleanCart)
        }
      })
    );
  }

  return cleanCart;
}

/**
 * Thêm sản phẩm (kèm quy cách đóng gói) vào giỏ hàng hoặc cộng dồn số lượng nếu đã tồn tại.
 */
function addToCart(productId, quantity = 1, optionIndex = 0) {
  const id = Number(productId);
  const parsedQty = Math.floor(Number(quantity));

  if (!Number.isInteger(id) || id <= 0) {
    return {
      success: false,
      message: "Mã sản phẩm không hợp lệ."
    };
  }

  if (!Number.isFinite(parsedQty) || parsedQty < 1) {
    return {
      success: false,
      message: "Số lượng thêm vào giỏ phải lớn hơn hoặc bằng 1."
    };
  }

  const catalog = getProductCatalog();
  const product = getProduct(id);
  if (catalog.length > 0 && !product) {
    return {
      success: false,
      message: "Sản phẩm không tồn tại trong hệ thống."
    };
  }

  const normalizedOptionIndex = normalizeOptionIndex(id, optionIndex);
  const option = getProductOption(id, normalizedOptionIndex);
  const cart = getCart();
  const existingItem = cart.find(
    (item) => item.productId === id && Number(item.optionIndex || 0) === normalizedOptionIndex
  );
  let capped = false;

  if (existingItem) {
    const newQty = existingItem.quantity + parsedQty;
    if (newQty > MAX_CART_QUANTITY) {
      existingItem.quantity = MAX_CART_QUANTITY;
      capped = true;
    } else {
      existingItem.quantity = newQty;
    }
  } else {
    const initialQty = Math.min(MAX_CART_QUANTITY, parsedQty);
    if (parsedQty > MAX_CART_QUANTITY) {
      capped = true;
    }
    cart.push({
      productId: id,
      optionIndex: normalizedOptionIndex,
      quantity: initialQty
    });
  }

  const updatedCart = saveCart(cart);
  const savedItem = updatedCart.find(
    (item) => item.productId === id && Number(item.optionIndex || 0) === normalizedOptionIndex
  );

  const optionSuffix = option && option.shortLabel ? ` (${option.shortLabel})` : "";
  let message = product
    ? `Đã thêm "${product.name}"${optionSuffix} vào giỏ hàng.`
    : "Đã thêm sản phẩm vào giỏ hàng.";
  if (capped) {
    message = `Số lượng tối đa cho mỗi sản phẩm là ${MAX_CART_QUANTITY}. Đã cập nhật về mức tối đa.`;
  }

  return {
    success: true,
    capped,
    item: savedItem,
    option,
    product,
    cart: updatedCart,
    message
  };
}

/**
 * Cập nhật số lượng của một dòng sản phẩm theo (productId, optionIndex) trong giỏ (giới hạn 1..99).
 */
function updateQuantity(productId, newQuantity, optionIndex = 0) {
  const id = Number(productId);
  const parsedQty = Math.floor(Number(newQuantity));

  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, message: "Mã sản phẩm không hợp lệ." };
  }
  if (!Number.isFinite(parsedQty)) {
    return { success: false, message: "Số lượng không hợp lệ." };
  }

  const normalizedOptionIndex = normalizeOptionIndex(id, optionIndex);
  const clampedQty = Math.max(1, Math.min(MAX_CART_QUANTITY, parsedQty));
  const cart = getCart();
  const target = cart.find(
    (item) => item.productId === id && Number(item.optionIndex || 0) === normalizedOptionIndex
  );

  if (!target) {
    return { success: false, message: "Sản phẩm không có trong giỏ hàng." };
  }

  target.quantity = clampedQty;
  const updatedCart = saveCart(cart);

  return {
    success: true,
    capped: parsedQty > MAX_CART_QUANTITY,
    quantity: clampedQty,
    optionIndex: normalizedOptionIndex,
    cart: updatedCart
  };
}

/**
 * Xóa một dòng sản phẩm khỏi giỏ hàng theo (productId, optionIndex).
 */
function removeFromCart(productId, optionIndex = 0) {
  const id = Number(productId);
  const normalizedOptionIndex = normalizeOptionIndex(id, optionIndex);
  const cart = getCart();
  const nextCart = cart.filter(
    (item) => !(item.productId === id && Number(item.optionIndex || 0) === normalizedOptionIndex)
  );
  return saveCart(nextCart);
}

/**
 * Xóa toàn bộ sản phẩm trong giỏ hàng.
 */
function clearCart() {
  return saveCart([]);
}

/**
 * Tính tổng số lượng sản phẩm trong giỏ.
 */
function getCartCount(cartOverride) {
  const cart = Array.isArray(cartOverride) ? cartOverride : getCart();
  return cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

/**
 * Tính tổng tiền giỏ hàng dựa trên đơn giá quy cách hợp lệ và dữ liệu trong products.js.
 */
function getCartTotal(cartOverride) {
  const cart = Array.isArray(cartOverride) ? cartOverride : getCart();
  return cart.reduce((sum, item) => {
    const product = getProduct(item.productId);
    if (!product) {
      return sum;
    }
    const option = getProductOption(item.productId, item.optionIndex);
    const unitPrice = option ? Number(option.price) : Number(product.price);
    return sum + unitPrice * Number(item.quantity);
  }, 0);
}

/**
 * Đồng bộ số lượng hiển thị trên biểu tượng giỏ hàng ở Header.
 */
function updateCartBadge(cartOverride) {
  const count = getCartCount(cartOverride);
  const cartLinks = document.querySelectorAll(".site-header__cart");

  cartLinks.forEach((link) => {
    let badge = link.querySelector(".site-header__cart-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "site-header__cart-badge";
      badge.setAttribute("aria-live", "polite");
      link.appendChild(badge);
    }

    badge.textContent = count > 99 ? "99+" : String(count);
    badge.classList.toggle("is-empty", count === 0);
    link.setAttribute("aria-label", `Giỏ hàng (${count} sản phẩm)`);
    link.setAttribute("title", `Giỏ hàng (${count} sản phẩm)`);
  });

  return count;
}

/**
 * Hiển thị thông báo ngắn (toast) khi thao tác với giỏ hàng.
 */
let toastTimer = null;
function showCartToast(message, options = {}) {
  const { type = "success", showCartLink = true, duration = 3200 } = options;

  let container = document.getElementById("bakemate-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "bakemate-toast-container";
    container.className = "bakemate-toast-container";
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);
  }

  container.innerHTML = "";

  const toast = document.createElement("div");
  toast.className = `bakemate-toast bakemate-toast--${type}`;
  toast.setAttribute("role", "status");

  const textSpan = document.createElement("span");
  textSpan.className = "bakemate-toast__text";
  textSpan.textContent = message;
  toast.appendChild(textSpan);

  if (showCartLink && !window.location.pathname.endsWith("cart.html")) {
    const link = document.createElement("a");
    link.href = "cart.html";
    link.className = "bakemate-toast__link";
    link.textContent = "Xem giỏ hàng";
    toast.appendChild(link);
  }

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "bakemate-toast__close";
  closeBtn.setAttribute("aria-label", "Đóng thông báo");
  closeBtn.textContent = "×";
  closeBtn.addEventListener("click", () => {
    toast.remove();
  });
  toast.appendChild(closeBtn);

  container.appendChild(toast);

  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }
  toastTimer = window.setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, duration);
}

/**
 * Đọc danh sách đơn hàng COD đã đặt (lưu cục bộ trên trình duyệt - F13).
 */
function getOrders() {
  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Không thể đọc danh sách đơn hàng:", error);
    return [];
  }
}

/**
 * Sinh mã đơn hàng dạng #BM-XXXXXX.
 */
function createOrderCode() {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `#BM-${randomDigits}`;
}

/**
 * Lưu đơn hàng mới vào localStorage.
 */
function saveOrder(order) {
  const orders = getOrders();
  const nextOrders = [order, ...orders].slice(0, 20);
  try {
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(nextOrders));
  } catch (error) {
    console.error("Không thể lưu đơn hàng vào localStorage:", error);
  }
  return order;
}

/**
 * Xóa lịch sử đơn hàng demo trong localStorage.
 */
function clearOrders() {
  try {
    window.localStorage.removeItem(ORDERS_STORAGE_KEY);
  } catch (error) {
    console.error("Không thể xóa lịch sử đơn hàng:", error);
  }
}

// Tự động đồng bộ badge Header khi tải trang và khi có thay đổi giữa các tab
document.addEventListener("DOMContentLoaded", function () {
  updateCartBadge();
});

window.addEventListener("storage", function (event) {
  if (event.key === CART_STORAGE_KEY) {
    const updatedCart = getCart();
    updateCartBadge(updatedCart);
    window.dispatchEvent(
      new CustomEvent("bakemate:cartChanged", {
        detail: {
          cart: updatedCart,
          count: getCartCount(updatedCart),
          total: getCartTotal(updatedCart)
        }
      })
    );
  }
});

// Gắn vào window để các trang và script dùng chung thuận tiện
if (typeof window !== "undefined") {
  window.CART_STORAGE_KEY = CART_STORAGE_KEY;
  window.ORDERS_STORAGE_KEY = ORDERS_STORAGE_KEY;
  window.FALLBACK_PRODUCT_IMAGE = FALLBACK_PRODUCT_IMAGE;
  window.formatCurrency = formatCurrency;
  window.getProduct = getProduct;
  window.getProductOptions = getProductOptions;
  window.getProductOption = getProductOption;
  window.getCart = getCart;
  window.loadCart = loadCart;
  window.saveCart = saveCart;
  window.addToCart = addToCart;
  window.updateQuantity = updateQuantity;
  window.removeFromCart = removeFromCart;
  window.clearCart = clearCart;
  window.getCartCount = getCartCount;
  window.getCartTotal = getCartTotal;
  window.updateCartBadge = updateCartBadge;
  window.showCartToast = showCartToast;
  window.getOrders = getOrders;
  window.saveOrder = saveOrder;
  window.clearOrders = clearOrders;
  window.createOrderCode = createOrderCode;
}
