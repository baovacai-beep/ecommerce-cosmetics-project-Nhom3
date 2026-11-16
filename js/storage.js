/*
 * =====================================================
 * BAKEMATE - QUẢN LÝ LOCALSTORAGE & HÀM DÙNG CHUNG TOÀN HỆ THỐNG
 * Tệp: js/storage.js
 * Hỗ trợ: Giỏ hàng (bakemate_cart + cart), Yêu thích (Wishlist),
 * Coupon (CHAOBANMOI, FREESHIP20), Vận chuyển theo khu vực,
 * Sổ địa chỉ, Đánh giá sản phẩm/công thức, Đơn hàng COD, Toast & Confirm Modal.
 * =====================================================
 */

(function () {
  const CART_STORAGE_KEY = "bakemate_cart";
  const LEGACY_CART_KEY = "cart";
  const ORDERS_STORAGE_KEY = "bakemate_orders";
  const LAST_ORDER_KEY = "bakemate_last_order";
  const COUPON_STORAGE_KEY = "bakemate_coupon";
  const COUPONS_STORAGE_KEY = "bakemate_coupons";
  const CART_SELECTION_KEY = "bakemate_cart_selection";
  const RECENT_PRODUCTS_KEY = "bakemate_recent_products";
  const WISHLIST_STORAGE_KEY = "bakemate_wishlist";
  const ADDRESSES_STORAGE_KEY = "bakemate_addresses";
  const REVIEWS_STORAGE_KEY = "bakemate_reviews";
  const CONTACTS_STORAGE_KEY = "bakemate_contacts";
  const MAX_CART_QUANTITY = 99;
  const MAX_RECENT_PRODUCTS = 8;
  const DEFAULT_SHIPPING_FEE = 25000;
  const FALLBACK_PRODUCT_IMAGE = "images/logo.jpg";

  /**
   * Danh sách mã giảm giá hỗ trợ.
   */
  const VALID_COUPONS = {
    CHAOBANMOI: {
      code: "CHAOBANMOI",
      type: "percent",
      discountRate: 0.1,
      discountAmount: 0,
      minSubtotal: 0,
      description: "Giảm 10% cho đơn hàng đầu tiên"
    },
    FREESHIP20: {
      code: "FREESHIP20",
      type: "shipping",
      discountRate: 0,
      discountAmount: 20000,
      minSubtotal: 200000,
      description: "Freeship 20.000 ₫ cho đơn từ 200.000 ₫"
    }
  };

  /**
   * Bảng phương thức vận chuyển theo khu vực giao hàng.
   */
  const SHIPPING_ZONES = {
    hcm: {
      label: "Nội thành TP.HCM",
      methods: [
        { id: "pickup", name: "Lấy tại cửa hàng", fee: 0, eta: "Nhận trong ngày tại 59C Nguyễn Đình Chiểu, Q.3" },
        { id: "fast", name: "Giao hàng nhanh", fee: 20000, eta: "Dự kiến giao trong 4–6 giờ" },
        { id: "express", name: "Hỏa tốc (2h)", fee: 40000, eta: "Giao ngay trong vòng 2 giờ" }
      ]
    },
    province: {
      label: "Ngoại thành / Tỉnh khác",
      methods: [
        { id: "ghn", name: "Giao Hàng Nhanh (GHN)", fee: 30000, eta: "Dự kiến 2–3 ngày làm việc" },
        { id: "ghtk", name: "Giao Hàng Tiết Kiệm (GHTK)", fee: 20000, eta: "Dự kiến 3–4 ngày làm việc" }
      ]
    }
  };

  /**
   * Quy cách đóng gói chuẩn theo từng ID sản phẩm (1..23) trong js/products.js.
   * Mục đầu tiên (index 0) luôn đồng bộ 100% với đơn giá gốc product.price.
   */
  const PRODUCT_PACKAGING_OPTIONS = {
    1: [
      { shortLabel: "Gói 1kg", price: 52000, oldPrice: 64000 },
      { shortLabel: "Túi 500g", price: 28000, oldPrice: 34000 },
      { shortLabel: "Túi 300g", price: 19000, oldPrice: 24000 },
      { shortLabel: "Gói 100g dùng thử", price: 9000, oldPrice: 12000 }
    ],
    2: [
      { shortLabel: "Gói 1kg", price: 45000, oldPrice: 54000 },
      { shortLabel: "Túi 500g", price: 25000, oldPrice: 30000 },
      { shortLabel: "Túi 300g", price: 17000, oldPrice: 22000 },
      { shortLabel: "Gói 100g dùng thử", price: 8000, oldPrice: 11000 }
    ],
    3: [
      { shortLabel: "Gói 1kg", price: 32000, oldPrice: 40000 },
      { shortLabel: "Túi 500g", price: 18000, oldPrice: 23000 },
      { shortLabel: "Túi 300g", price: 13000, oldPrice: 17000 },
      { shortLabel: "Gói 100g dùng thử", price: 6500, oldPrice: 9000 }
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
      { shortLabel: "Mẫu tiêu chuẩn (5kg/1g)", price: 120000, oldPrice: 120000 },
      { shortLabel: "Kèm khay & pin dự phòng", price: 145000, oldPrice: 145000 }
    ],
    8: [
      { shortLabel: "Ca 500ml", price: 45000, oldPrice: 45000 },
      { shortLabel: "Ca 1000ml", price: 68000, oldPrice: 68000 }
    ],
    9: [
      { shortLabel: "Bộ 5 thìa tiêu chuẩn", price: 35000, oldPrice: 35000 },
      { shortLabel: "Bộ 8 thìa inox", price: 58000, oldPrice: 58000 }
    ],
    10: [
      { shortLabel: "Đầu dò tiêu chuẩn", price: 95000, oldPrice: 115000 },
      { shortLabel: "Đầu dò dài chuyên dụng", price: 118000, oldPrice: 140000 }
    ],
    11: [
      { shortLabel: "Túi 50 cái cỡ vừa", price: 25000, oldPrice: 25000 },
      { shortLabel: "Túi 100 cái cỡ lớn", price: 42000, oldPrice: 42000 }
    ],
    12: [
      { shortLabel: "Khối 227g", price: 68000, oldPrice: 82000 },
      { shortLabel: "Combo 2 khối (454g)", price: 130000, oldPrice: 158000 }
    ],
    13: [
      { shortLabel: "Túi 1kg", price: 28000, oldPrice: 28000 },
      { shortLabel: "Túi 500g", price: 16000, oldPrice: 16000 }
    ],
    14: [
      { shortLabel: "Hộp 100g", price: 48000, oldPrice: 58000 },
      { shortLabel: "Gói 50g dùng thử", price: 27000, oldPrice: 34000 }
    ],
    15: [
      { shortLabel: "Vỉ 10 quả", price: 34000, oldPrice: 34000 },
      { shortLabel: "Hộp 6 quả", price: 22000, oldPrice: 22000 }
    ],
    16: [
      { shortLabel: "Cỡ 25cm tiêu chuẩn", price: 42000, oldPrice: 52000 },
      { shortLabel: "Cỡ 30cm cán dài", price: 54000, oldPrice: 66000 }
    ],
    17: [
      { shortLabel: "Đường kính 20cm (Đế rời)", price: 115000, oldPrice: 140000 },
      { shortLabel: "Đường kính 22cm (Đế rời)", price: 135000, oldPrice: 165000 }
    ],
    18: [
      { shortLabel: "Cuộn 5m × 30cm", price: 29000, oldPrice: 29000 },
      { shortLabel: "Cuộn 10m × 30cm", price: 52000, oldPrice: 52000 }
    ],
    19: [
      { shortLabel: "Lốc 50 cup tiêu chuẩn", price: 24000, oldPrice: 24000 },
      { shortLabel: "Lốc 100 cup", price: 44000, oldPrice: 44000 }
    ],
    20: [
      { shortLabel: "Bộ 12 đui + khớp nối", price: 65000, oldPrice: 79000 },
      { shortLabel: "Bộ 24 đui chuyên nghiệp", price: 115000, oldPrice: 140000 }
    ],
    21: [
      { shortLabel: "Set 2 hộp (25×25×18cm)", price: 38000, oldPrice: 38000 },
      { shortLabel: "Set 5 hộp tiết kiệm", price: 88000, oldPrice: 88000 }
    ],
    22: [
      { shortLabel: "Bộ 6 khuôn Tart mini", price: 135000, oldPrice: 135000 }
    ],
    23: [
      { shortLabel: "Gói 500g", price: 58000, oldPrice: 58000 }
    ]
  };

  /**
   * Kho Combo Recipe-to-Cart dùng chung.
   */
  const RECIPE_COMBO_CATALOG = {
    "recipe-bong-lan": {
      id: "recipe-bong-lan",
      title: "Combo Bánh Bông Lan Cơ Bản (Chiffon)",
      time: "55 phút",
      diff: "Dễ",
      servings: "4 khẩu phần (1 ổ 20cm)",
      image: "images/about-baking.jpg",
      items: [
        { productId: 1, optionIndex: 2, quantity: 1, usage: "120g Bột mì số 8 (chọn túi 300g tiết kiệm)" },
        { productId: 15, optionIndex: 1, quantity: 1, usage: "4 quả Trứng gà tươi (hộp 6 quả)" },
        { productId: 13, optionIndex: 1, quantity: 1, usage: "100g Đường tinh luyện (túi 500g)" },
        { productId: 14, optionIndex: 1, quantity: 1, usage: "4g Cream of Tartar ổn định lòng trắng" }
      ]
    },
    "recipe-matcha-cupcake": {
      id: "recipe-matcha-cupcake",
      title: "Combo Cupcake Vanilla & Matcha",
      time: "45 phút",
      diff: "Dễ",
      servings: "6 chiếc Cupcake",
      image: "images/about-sharing-cakes.jpg",
      items: [
        { productId: 1, optionIndex: 2, quantity: 1, usage: "140g Bột mì số 8 mềm mịn (túi 300g)" },
        { productId: 5, optionIndex: 0, quantity: 1, usage: "12g Bột Matcha Nhật Bản" },
        { productId: 6, optionIndex: 0, quantity: 1, usage: "200ml Whipping Cream Anchor đánh bông" },
        { productId: 12, optionIndex: 0, quantity: 1, usage: "85g Bơ lạt Anchor mềm" },
        { productId: 19, optionIndex: 0, quantity: 1, usage: "12 Cup giấy xếp ly nướng cupcake" }
      ]
    },
    "recipe-banh-quy-bo": {
      id: "recipe-banh-quy-bo",
      title: "Combo Cookies Bơ Đan Mạch Giòn Tan",
      time: "35 phút",
      diff: "Trung bình",
      servings: "6 phần (~30 chiếc)",
      image: "images/about-beginner.jpg",
      items: [
        { productId: 1, optionIndex: 2, quantity: 1, usage: "180g Bột mì số 8 (túi 300g)" },
        { productId: 12, optionIndex: 0, quantity: 1, usage: "150g Bơ lạt Anchor đánh bông" },
        { productId: 13, optionIndex: 1, quantity: 1, usage: "75g Đường tinh luyện (túi 500g)" },
        { productId: 11, optionIndex: 0, quantity: 1, usage: "Túi bắt kem PE dày bóp bột quy" },
        { productId: 20, optionIndex: 0, quantity: 1, usage: "Bộ đui bắt kem tạo vân hoa cúc sắc nét" }
      ]
    },
    "recipe-hoa-cuc": {
      id: "recipe-hoa-cuc",
      title: "Combo Bánh Mì Hoa Cúc Ngàn Lớp",
      time: "90 phút",
      diff: "Trung bình",
      servings: "4 phần (2 ổ 450g)",
      image: "images/about-young-bakers.jpg",
      items: [
        { productId: 2, optionIndex: 2, quantity: 1, usage: "260g Bột mì số 11 dai khỏe (túi 300g)" },
        { productId: 12, optionIndex: 0, quantity: 1, usage: "110g Bơ lạt Anchor thơm ngậy" },
        { productId: 15, optionIndex: 1, quantity: 1, usage: "3 quả Trứng gà tươi (hộp 6 quả)" },
        { productId: 13, optionIndex: 1, quantity: 1, usage: "70g Đường tinh luyện (túi 500g)" }
      ]
    },
    "recipe-muffin-socola": {
      id: "recipe-muffin-socola",
      title: "Combo Bánh Muffin Chocolate Hạnh Nhân",
      time: "40 phút",
      diff: "Dễ",
      servings: "6 chiếc Muffin",
      image: "images/banner.jpg",
      items: [
        { productId: 3, optionIndex: 2, quantity: 1, usage: "150g Bột mì đa dụng Meizan (túi 300g)" },
        { productId: 4, optionIndex: 0, quantity: 1, usage: "35g Bột cacao Hershey's nguyên chất" },
        { productId: 12, optionIndex: 0, quantity: 1, usage: "80g Bơ lạt Anchor đun chảy" },
        { productId: 19, optionIndex: 0, quantity: 1, usage: "12 Cup giấy nướng bánh chống thấm" }
      ]
    },
    "recipe-brownie": {
      id: "recipe-brownie",
      title: "Combo Bánh Brownie Chocolate Đậm Vị",
      time: "45 phút",
      diff: "Dễ",
      servings: "6 miếng vuông",
      image: "images/contact-baking.jpg",
      items: [
        { productId: 3, optionIndex: 3, quantity: 1, usage: "85g Bột mì đa dụng Meizan (gói 100g)" },
        { productId: 4, optionIndex: 0, quantity: 1, usage: "50g Bột cacao Hershey's" },
        { productId: 12, optionIndex: 0, quantity: 1, usage: "120g Bơ lạt Anchor" },
        { productId: 18, optionIndex: 0, quantity: 1, usage: "1 cuộn Giấy nến lót khuôn chống dính" }
      ]
    },
    "recipe-mousse-socola": {
      id: "recipe-mousse-socola",
      title: "Combo Bánh Mousse Socola Lạnh Mịn Mượt",
      time: "75 phút",
      diff: "Trung bình",
      servings: "4 phần (1 bánh 20cm)",
      image: "images/about-ingredients.jpg",
      items: [
        { productId: 6, optionIndex: 0, quantity: 1, usage: "250ml Whipping Cream Anchor lạnh" },
        { productId: 4, optionIndex: 0, quantity: 1, usage: "35g Bột cacao Hershey's" },
        { productId: 16, optionIndex: 0, quantity: 1, usage: "1 Phới lồng đánh bông kem mịn" },
        { productId: 17, optionIndex: 0, quantity: 1, usage: "1 Khuôn đế rời 20cm dễ tách bánh lạnh" }
      ]
    },
    "recipe-pancake": {
      id: "recipe-pancake",
      title: "Combo Bánh Pancake Mật Ong Bữa Sáng",
      time: "25 phút",
      diff: "Dễ",
      servings: "4 phần (8 chiếc)",
      image: "images/products/bot-mi-meizan-1.jpg",
      items: [
        { productId: 3, optionIndex: 2, quantity: 1, usage: "150g Bột mì đa dụng Meizan (túi 300g)" },
        { productId: 15, optionIndex: 1, quantity: 1, usage: "2 quả Trứng gà tươi (hộp 6 quả)" },
        { productId: 13, optionIndex: 1, quantity: 1, usage: "40g Đường tinh luyện (túi 500g)" },
        { productId: 8, optionIndex: 0, quantity: 1, usage: "1 Ca đong chia ml đong sữa & rót bột" }
      ]
    }
  };

  function formatCurrency(amount) {
    const numericAmount = Number(amount);
    const safeAmount = Number.isFinite(numericAmount) ? numericAmount : 0;
    return new Intl.NumberFormat("vi-VN").format(safeAmount) + " ₫";
  }

  function normalizeRecipeGroupId(value) {
    if (typeof value !== "string") {
      return null;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  function getRecipeComboInfo(recipeGroupId) {
    const normalized = normalizeRecipeGroupId(recipeGroupId);
    if (!normalized) {
      return null;
    }
    if (RECIPE_COMBO_CATALOG[normalized]) {
      return RECIPE_COMBO_CATALOG[normalized];
    }
    if (typeof window.getRecipeById === "function") {
      const fromData = window.getRecipeById(normalized);
      if (fromData) {
        return {
          id: fromData.id,
          title: `Combo ${fromData.title}`,
          time: fromData.time,
          diff: fromData.diff,
          servings: `${fromData.defaultServings} ${fromData.servingsUnit || "phần"}`,
          image: fromData.image,
          items: (fromData.ingredients || [])
            .filter((ing) => ing.productId)
            .map((ing) => ({
              productId: ing.productId,
              optionIndex: ing.optionIndex || 0,
              quantity: 1,
              usage: `${ing.baseAmount}${ing.unit} ${ing.name}`
            }))
        };
      }
    }
    return {
      id: normalized,
      title: `Combo công thức (${normalized})`,
      time: "Chuẩn vị BakeMate",
      diff: "Dễ",
      servings: "1 công thức",
      image: "images/about-baking.jpg",
      items: []
    };
  }

  function getProductCatalog() {
    if (typeof window !== "undefined") {
      if (typeof window.buildMergedProducts === "function") {
        return window.buildMergedProducts();
      }
      if (Array.isArray(window.products)) {
        return window.products;
      }
    }
    return [];
  }

  function getProduct(productId) {
    const id = Number(productId);
    if (!Number.isInteger(id) || id <= 0) {
      return null;
    }
    const catalog = getProductCatalog();
    return catalog.find((item) => Number(item.id) === id) || null;
  }

  function getProductOptions(productId) {
    const id = Number(productId);
    const product = getProduct(id);
    const basePrice = product ? Number(product.price) : 0;
    const preset = PRODUCT_PACKAGING_OPTIONS[id];

    if (Array.isArray(preset) && preset.length > 0) {
      return preset.map((opt, idx) => {
        const price = idx === 0 && product ? basePrice : Number(opt.price);
        const explicitOld =
          idx === 0 && product && Number(product.oldPrice) > 0
            ? Number(product.oldPrice)
            : Number(opt.oldPrice);
        const oldPrice = explicitOld > price ? explicitOld : price;
        const saveAmount = Math.max(0, oldPrice - price);
        const discountPercent = oldPrice > price ? Math.round((saveAmount / oldPrice) * 100) : 0;
        return {
          optionIndex: idx,
          shortLabel: idx === 0 && product && product.packagingLabel ? product.packagingLabel : opt.shortLabel,
          label: `${idx === 0 && product && product.packagingLabel ? product.packagingLabel : opt.shortLabel} - ${formatCurrency(price)}`,
          price,
          oldPrice,
          saveAmount,
          discountPercent
        };
      });
    }

    const labelName = (product && product.packagingLabel) || "Tiêu chuẩn";
    const explicitOld = product && Number(product.oldPrice) > basePrice ? Number(product.oldPrice) : basePrice;
    const saveAmount = Math.max(0, explicitOld - basePrice);
    return [
      {
        optionIndex: 0,
        shortLabel: labelName,
        label: `${labelName} - ${formatCurrency(basePrice)}`,
        price: basePrice,
        oldPrice: explicitOld,
        saveAmount,
        discountPercent: explicitOld > basePrice ? Math.round((saveAmount / explicitOld) * 100) : 0
      }
    ];
  }

  function normalizeOptionIndex(productId, optionIndex) {
    const options = getProductOptions(productId);
    const parsed = Math.floor(Number(optionIndex));
    if (!Number.isFinite(parsed) || parsed < 0 || parsed >= options.length) {
      return 0;
    }
    return parsed;
  }

  function getProductOption(productId, optionIndex = 0) {
    const options = getProductOptions(productId);
    const normalizedIdx = normalizeOptionIndex(productId, optionIndex);
    return options[normalizedIdx] || options[0];
  }

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
      const recipeGroupId = normalizeRecipeGroupId(entry.recipeGroupId);
      const key = `${productId}:${optionIndex}:${recipeGroupId || ""}`;
      const prev = mergedMap.get(key);
      const nextQty = Math.min(MAX_CART_QUANTITY, (prev ? prev.quantity : 0) + quantity);
      mergedMap.set(key, { productId, optionIndex, quantity: nextQty, recipeGroupId });
    });

    return Array.from(mergedMap.values());
  }

  function getCart() {
    try {
      const raw =
        window.localStorage.getItem(CART_STORAGE_KEY) ||
        window.localStorage.getItem(LEGACY_CART_KEY);
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

  function loadCart() {
    return getCart();
  }

  function saveCart(cartItems) {
    const cleanCart = sanitizeCartItems(cartItems);
    const serialized = JSON.stringify(cleanCart);

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, serialized);
      window.localStorage.setItem(LEGACY_CART_KEY, serialized);
      syncCartSelectionWithCart(cleanCart);
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

  function getCartItemKey(item) {
    if (!item) return "";
    return `${Number(item.productId)}|${Number(item.optionIndex || 0)}|${normalizeRecipeGroupId(item.recipeGroupId) || ""}`;
  }

  function syncCartSelectionWithCart(cartItems) {
    try {
      const list = Array.isArray(cartItems) ? cartItems : getCart();
      if (list.length === 0) {
        window.localStorage.removeItem(CART_SELECTION_KEY);
        return;
      }
      const rawSel = window.localStorage.getItem(CART_SELECTION_KEY);
      if (rawSel === null) return;
      const parsed = JSON.parse(rawSel);
      if (!Array.isArray(parsed)) return;
      const validKeys = new Set(list.map(getCartItemKey));
      const pruned = parsed.map(String).filter((k) => validKeys.has(k));
      window.localStorage.setItem(CART_SELECTION_KEY, JSON.stringify(Array.from(new Set(pruned))));
    } catch (e) {
      console.warn("Không thể đồng bộ lựa chọn giỏ hàng:", e);
    }
  }

  function getSelectedCartKeys(cartOverride) {
    const cart = Array.isArray(cartOverride) ? cartOverride : getCart();
    if (cart.length === 0) return [];
    const allKeys = cart.map(getCartItemKey);
    try {
      const raw = window.localStorage.getItem(CART_SELECTION_KEY);
      if (raw === null) return allKeys;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return allKeys;
      const validSet = new Set(allKeys);
      return Array.from(new Set(parsed.map(String).filter((k) => validSet.has(k))));
    } catch (e) {
      return allKeys;
    }
  }

  function setSelectedCartKeys(keys) {
    const cart = getCart();
    const validSet = new Set(cart.map(getCartItemKey));
    const clean = Array.from(new Set((Array.isArray(keys) ? keys : []).map(String).filter((k) => validSet.has(k))));
    try {
      window.localStorage.setItem(CART_SELECTION_KEY, JSON.stringify(clean));
    } catch (e) {
      console.warn("Không thể lưu danh sách chọn trong giỏ hàng:", e);
    }
    return clean;
  }

  function getSelectedCartItems(cartOverride) {
    const cart = Array.isArray(cartOverride) ? cartOverride : getCart();
    if (cart.length === 0) return [];
    const selectedSet = new Set(getSelectedCartKeys(cart));
    return cart.filter((item) => selectedSet.has(getCartItemKey(item)));
  }

  function removeOrderedCartItems(orderedItems) {
    const orderedKeys = new Set(
      (Array.isArray(orderedItems) ? orderedItems : []).map(getCartItemKey).filter(Boolean)
    );
    if (orderedKeys.size === 0) {
      return getCart();
    }
    const cart = getCart();
    const remaining = cart.filter((item) => !orderedKeys.has(getCartItemKey(item)));
    return saveCart(remaining);
  }

  const externalPerishableCheck =
    typeof window !== "undefined" && typeof window.isProductPerishable === "function"
      ? window.isProductPerishable
      : null;

  function isProductPerishable(productOrId) {
    if (externalPerishableCheck && externalPerishableCheck !== isProductPerishable) {
      return externalPerishableCheck(productOrId);
    }
    if (!productOrId) return false;
    const id = typeof productOrId === "object" ? Number(productOrId.id || productOrId.productId) : Number(productOrId);
    const prod = typeof productOrId === "object" && productOrId.isPerishable === true ? productOrId : getProduct(id);
    return Boolean((prod && prod.isPerishable === true) || [6, 12, 15].includes(id));
  }

  function hasPerishableItems(items) {
    const list = Array.isArray(items) ? items : [];
    return list.some((item) => isProductPerishable(item.productId || item.id || item));
  }

  function addToCart(productId, quantity = 1, optionIndex = 0, recipeGroupId = null) {
    const id = Number(productId);
    const parsedQty = Math.floor(Number(quantity));
    const normalizedGroupId = normalizeRecipeGroupId(recipeGroupId);

    if (!Number.isInteger(id) || id <= 0) {
      return { success: false, message: "Mã sản phẩm không hợp lệ." };
    }

    if (!Number.isFinite(parsedQty) || parsedQty < 1) {
      return { success: false, message: "Số lượng thêm vào giỏ phải lớn hơn hoặc bằng 1." };
    }

    const catalog = getProductCatalog();
    const product = getProduct(id);
    if (catalog.length > 0 && !product) {
      return { success: false, message: "Sản phẩm không tồn tại trong hệ thống." };
    }

    if (product && product.stockStatus === "coming_soon") {
      return {
        success: false,
        message: `"${product.name}" hiện đang sắp về hàng, bạn có thể lưu vào Yêu thích để nhận thông báo sớm.`
      };
    }

    const normalizedOptionIndex = normalizeOptionIndex(id, optionIndex);
    const option = getProductOption(id, normalizedOptionIndex);
    const cart = getCart();
    const existingItem = cart.find(
      (item) =>
        item.productId === id &&
        Number(item.optionIndex || 0) === normalizedOptionIndex &&
        normalizeRecipeGroupId(item.recipeGroupId) === normalizedGroupId
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
        quantity: initialQty,
        recipeGroupId: normalizedGroupId
      });
    }

    const updatedCart = saveCart(cart);
    const savedItem = updatedCart.find(
      (item) =>
        item.productId === id &&
        Number(item.optionIndex || 0) === normalizedOptionIndex &&
        normalizeRecipeGroupId(item.recipeGroupId) === normalizedGroupId
    );

    if (savedItem) {
      try {
        if (window.localStorage.getItem(CART_SELECTION_KEY) !== null) {
          const currentSelected = getSelectedCartKeys(updatedCart);
          const itemKey = getCartItemKey(savedItem);
          if (!currentSelected.includes(itemKey)) {
            setSelectedCartKeys([...currentSelected, itemKey]);
          }
        }
      } catch (e) {}
    }

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

  function addRecipeComboToCart(recipeGroupId, customItems) {
    const normalizedGroupId = normalizeRecipeGroupId(recipeGroupId);
    if (!normalizedGroupId) {
      return { success: false, message: "Mã công thức không hợp lệ." };
    }

    const comboInfo = getRecipeComboInfo(normalizedGroupId);
    const itemsToAdd =
      Array.isArray(customItems) && customItems.length > 0
        ? customItems
        : comboInfo
        ? comboInfo.items
        : [];

    if (!itemsToAdd || itemsToAdd.length === 0) {
      return { success: false, message: "Công thức chưa có danh sách nguyên liệu." };
    }

    let addedCount = 0;
    let cappedAny = false;

    itemsToAdd.forEach((entry) => {
      const pid = Number(entry.productId);
      if (!Number.isInteger(pid) || pid <= 0) return;
      const result = addToCart(
        pid,
        Math.max(1, Math.floor(Number(entry.quantity) || 1)),
        Number(entry.optionIndex) || 0,
        normalizedGroupId
      );
      if (result.success) {
        addedCount += 1;
        if (result.capped) cappedAny = true;
      }
    });

    if (addedCount === 0) {
      return { success: false, message: "Không có nguyên liệu khả dụng để thêm vào giỏ." };
    }

    const comboTitle = comboInfo ? comboInfo.title : normalizedGroupId;
    return {
      success: true,
      capped: cappedAny,
      addedCount,
      cart: getCart(),
      message: `Đã thêm trọn bộ ${addedCount} sản phẩm của "${comboTitle}" vào giỏ!`
    };
  }

  function updateQuantity(productId, newQuantity, optionIndex = 0, recipeGroupId = null) {
    const id = Number(productId);
    const normalizedOptionIndex = normalizeOptionIndex(id, optionIndex);
    const normalizedGroupId = normalizeRecipeGroupId(recipeGroupId);
    const parsedQty = Math.floor(Number(newQuantity));
    const cart = getCart();
    const targetIndex = cart.findIndex(
      (item) =>
        item.productId === id &&
        Number(item.optionIndex || 0) === normalizedOptionIndex &&
        normalizeRecipeGroupId(item.recipeGroupId) === normalizedGroupId
    );

    if (targetIndex === -1) {
      return { success: false, cart, message: "Không tìm thấy sản phẩm trong giỏ." };
    }

    if (!Number.isFinite(parsedQty) || parsedQty < 1) {
      cart.splice(targetIndex, 1);
      const updated = saveCart(cart);
      return { success: true, removed: true, cart: updated, message: "Đã xóa sản phẩm khỏi giỏ hàng." };
    }

    let capped = false;
    let safeQty = parsedQty;
    if (safeQty > MAX_CART_QUANTITY) {
      safeQty = MAX_CART_QUANTITY;
      capped = true;
    }

    cart[targetIndex].quantity = safeQty;
    const updated = saveCart(cart);

    return {
      success: true,
      removed: false,
      capped,
      quantity: safeQty,
      cart: updated,
      message: capped
        ? `Số lượng tối đa cho mỗi sản phẩm là ${MAX_CART_QUANTITY}.`
        : "Đã cập nhật số lượng."
    };
  }

  function removeFromCart(productId, optionIndex = 0, recipeGroupId = null) {
    const id = Number(productId);
    const normalizedOptionIndex = normalizeOptionIndex(id, optionIndex);
    const normalizedGroupId = normalizeRecipeGroupId(recipeGroupId);
    const cart = getCart();
    const nextCart = cart.filter(
      (item) =>
        !(
          item.productId === id &&
          Number(item.optionIndex || 0) === normalizedOptionIndex &&
          normalizeRecipeGroupId(item.recipeGroupId) === normalizedGroupId
        )
    );
    return saveCart(nextCart);
  }

  function removeRecipeGroup(recipeGroupId) {
    const normalizedGroupId = normalizeRecipeGroupId(recipeGroupId);
    if (!normalizedGroupId) {
      return getCart();
    }
    const cart = getCart();
    const nextCart = cart.filter(
      (item) => normalizeRecipeGroupId(item.recipeGroupId) !== normalizedGroupId
    );
    return saveCart(nextCart);
  }

  function clearCart() {
    return saveCart([]);
  }

  function getCartCount(cartOverride) {
    const cart = Array.isArray(cartOverride) ? cartOverride : getCart();
    return cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  }

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

  // ==================== COUPON & SHIPPING LOGIC ====================

  function validateCouponCode(rawCode, subtotalOverride) {
    const normalized = String(rawCode || "").trim().toUpperCase();
    if (!normalized) {
      return {
        valid: false,
        code: "",
        discountRate: 0,
        message: "Vui lòng nhập mã giảm giá."
      };
    }

    const coupon = VALID_COUPONS[normalized];
    if (!coupon) {
      return {
        valid: false,
        code: normalized,
        discountRate: 0,
        message: "Mã giảm giá không hợp lệ. Gợi ý: CHAOBANMOI (-10%) hoặc FREESHIP20 (Freeship 20K đơn từ 200K)."
      };
    }

    const subtotalToCheck =
      typeof subtotalOverride === "number" ? subtotalOverride : getCartTotal();

    if (coupon.minSubtotal > 0 && subtotalToCheck < coupon.minSubtotal) {
      return {
        valid: false,
        code: coupon.code,
        discountRate: 0,
        minSubtotal: coupon.minSubtotal,
        message: `Mã ${coupon.code} chỉ áp dụng cho đơn từ ${formatCurrency(coupon.minSubtotal)} (bạn cần mua thêm ${formatCurrency(coupon.minSubtotal - subtotalToCheck)}).`
      };
    }

    return {
      valid: true,
      code: coupon.code,
      type: coupon.type,
      discountRate: coupon.discountRate,
      discountAmount: coupon.discountAmount,
      minSubtotal: coupon.minSubtotal,
      description: coupon.description,
      message: `Áp dụng thành công mã ${coupon.code}: ${coupon.description}!`
    };
  }

  function getSavedCoupons() {
    try {
      const rawMulti = window.localStorage.getItem(COUPONS_STORAGE_KEY);
      if (rawMulti) {
        const parsed = JSON.parse(rawMulti);
        if (Array.isArray(parsed)) {
          return Array.from(
            new Set(
              parsed
                .map((c) => String(c || "").trim().toUpperCase())
                .filter((c) => Boolean(VALID_COUPONS[c]))
            )
          );
        }
      }
      const rawSingle = window.localStorage.getItem(COUPON_STORAGE_KEY);
      if (rawSingle) {
        const normalized = String(rawSingle).trim().toUpperCase();
        if (VALID_COUPONS[normalized]) return [normalized];
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  function persistCouponCodes(codes) {
    const clean = Array.from(
      new Set(
        (Array.isArray(codes) ? codes : [])
          .map((c) => String(c || "").trim().toUpperCase())
          .filter((c) => Boolean(VALID_COUPONS[c]))
      )
    );
    try {
      if (clean.length === 0) {
        window.localStorage.removeItem(COUPONS_STORAGE_KEY);
        window.localStorage.removeItem(COUPON_STORAGE_KEY);
      } else {
        window.localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(clean));
        window.localStorage.setItem(COUPON_STORAGE_KEY, clean[0]);
      }
    } catch (error) {
      console.warn("Không thể lưu danh sách mã giảm giá:", error);
    }
    return clean;
  }

  function getSavedCoupon() {
    try {
      const raw = window.localStorage.getItem(COUPON_STORAGE_KEY);
      if (raw) {
        const normalized = String(raw).trim().toUpperCase();
        if (VALID_COUPONS[normalized]) return normalized;
      }
      const list = getSavedCoupons();
      return list.length > 0 ? list[0] : null;
    } catch (error) {
      return null;
    }
  }

  function setSavedCoupon(rawCode, subtotalOverride) {
    const res = validateCouponCode(rawCode, subtotalOverride);
    if (!res.valid) {
      return res;
    }
    try {
      window.localStorage.setItem(COUPON_STORAGE_KEY, res.code);
      window.localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify([res.code]));
    } catch (error) {
      console.warn("Không thể lưu mã giảm giá vào localStorage:", error);
    }
    return res;
  }

  function addCouponCode(rawCode, subtotalOverride) {
    const res = validateCouponCode(rawCode, subtotalOverride);
    if (!res.valid) {
      return res;
    }
    const current = getSavedCoupons();
    if (current.includes(res.code)) {
      return {
        valid: false,
        code: res.code,
        message: `Mã ${res.code} đã được áp dụng cho đơn hàng này.`
      };
    }

    const incomingGroup = res.type === "shipping" ? "shipping" : "product";
    const filtered = current.filter((code) => {
      const meta = VALID_COUPONS[code];
      const existingGroup = meta && meta.type === "shipping" ? "shipping" : "product";
      return existingGroup !== incomingGroup;
    });

    const nextCodes = persistCouponCodes([...filtered, res.code]);
    return Object.assign({}, res, {
      coupons: nextCodes,
      message:
        nextCodes.length > 1
          ? `Áp dụng cộng dồn thành công mã ${nextCodes.join(" + ")}!`
          : res.message
    });
  }

  function removeSavedCoupon(rawCode) {
    const target = String(rawCode || "").trim().toUpperCase();
    const current = getSavedCoupons();
    return persistCouponCodes(current.filter((code) => code !== target));
  }

  function clearSavedCoupon() {
    try {
      window.localStorage.removeItem(COUPON_STORAGE_KEY);
      window.localStorage.removeItem(COUPONS_STORAGE_KEY);
    } catch (error) {
      console.warn("Không thể xóa mã giảm giá:", error);
    }
  }

  function clearSavedCoupons() {
    clearSavedCoupon();
  }

  function calculateDiscount(subtotal, couponInput, baseShippingFee = DEFAULT_SHIPPING_FEE) {
    const safeSubtotal = Math.max(0, Number(subtotal) || 0);
    const safeShip = Math.max(0, Number(baseShippingFee) || 0);

    if (Array.isArray(couponInput)) {
      const uniqueCodes = Array.from(
        new Set(couponInput.map((c) => String(c || "").trim().toUpperCase()).filter(Boolean))
      );
      let productCoupon = null;
      let shippingCoupon = null;
      const activeCoupons = [];
      const droppedCoupons = [];

      uniqueCodes.forEach((code) => {
        const check = validateCouponCode(code, safeSubtotal);
        if (!check.valid || safeSubtotal === 0) {
          droppedCoupons.push({ code, reason: check.message });
          return;
        }
        if (check.type === "shipping") {
          if (!shippingCoupon) {
            shippingCoupon = check;
            activeCoupons.push(check);
          }
        } else if (!productCoupon) {
          productCoupon = check;
          activeCoupons.push(check);
        }
      });

      const discountAmount = productCoupon
        ? Math.min(safeSubtotal, Math.round(safeSubtotal * (Number(productCoupon.discountRate) || 0)))
        : 0;
      const afterDiscount = Math.max(0, safeSubtotal - discountAmount);
      const shippingDiscount = shippingCoupon
        ? Math.min(safeShip, Number(shippingCoupon.discountAmount) || 0)
        : 0;
      const effectiveShippingFee = Math.max(0, safeShip - shippingDiscount);
      const activeCodes = activeCoupons.map((c) => c.code);

      return {
        couponCode: activeCodes.length > 0 ? activeCodes.join(" + ") : null,
        couponCodes: activeCodes,
        activeCoupons,
        droppedCoupons,
        productCoupon: productCoupon ? productCoupon.code : null,
        shippingCoupon: shippingCoupon ? shippingCoupon.code : null,
        couponType:
          productCoupon && shippingCoupon
            ? "stacked"
            : productCoupon
            ? productCoupon.type
            : shippingCoupon
            ? "shipping"
            : null,
        discountRate: productCoupon ? Number(productCoupon.discountRate) || 0 : 0,
        discountAmount,
        shippingDiscount,
        totalSavings: discountAmount + shippingDiscount,
        baseShippingFee: safeShip,
        effectiveShippingFee,
        finalTotal: afterDiscount + effectiveShippingFee,
        productSubtotalAfterDiscount: afterDiscount
      };
    }

    const check = couponInput ? validateCouponCode(couponInput, safeSubtotal) : { valid: false };

    if (!check.valid || safeSubtotal === 0) {
      return {
        couponCode: null,
        couponCodes: [],
        couponType: null,
        discountRate: 0,
        discountAmount: 0,
        shippingDiscount: 0,
        totalSavings: 0,
        baseShippingFee: safeShip,
        effectiveShippingFee: safeShip,
        finalTotal: safeSubtotal + safeShip,
        productSubtotalAfterDiscount: safeSubtotal
      };
    }

    if (check.type === "shipping") {
      const shippingDiscount = Math.min(safeShip, Number(check.discountAmount) || 0);
      const effectiveShippingFee = Math.max(0, safeShip - shippingDiscount);
      return {
        couponCode: check.code,
        couponCodes: [check.code],
        couponType: "shipping",
        discountRate: 0,
        discountAmount: shippingDiscount,
        shippingDiscount,
        totalSavings: shippingDiscount,
        baseShippingFee: safeShip,
        effectiveShippingFee,
        finalTotal: safeSubtotal + effectiveShippingFee,
        productSubtotalAfterDiscount: safeSubtotal
      };
    }

    const discountAmount = Math.round(safeSubtotal * (Number(check.discountRate) || 0));
    const afterDiscount = Math.max(0, safeSubtotal - discountAmount);
    return {
      couponCode: check.code,
      couponCodes: [check.code],
      couponType: "percent",
      discountRate: check.discountRate,
      discountAmount,
      shippingDiscount: 0,
      totalSavings: discountAmount,
      baseShippingFee: safeShip,
      effectiveShippingFee: safeShip,
      finalTotal: afterDiscount + safeShip,
      productSubtotalAfterDiscount: afterDiscount
    };
  }

  // ==================== RECENTLY VIEWED (SẢN PHẨM ĐÃ XEM GẦN ĐÂY) ====================

  function getRecentProducts() {
    try {
      const raw = window.localStorage.getItem(RECENT_PRODUCTS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map(Number)
        .filter((id) => Number.isInteger(id) && id > 0 && Boolean(getProduct(id)))
        .slice(0, MAX_RECENT_PRODUCTS);
    } catch (error) {
      return [];
    }
  }

  function addRecentProduct(productId) {
    const id = Number(productId);
    if (!Number.isInteger(id) || id <= 0 || !getProduct(id)) {
      return getRecentProducts();
    }
    const current = getRecentProducts().filter((x) => x !== id);
    const next = [id, ...current].slice(0, MAX_RECENT_PRODUCTS);
    try {
      window.localStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn("Không thể lưu sản phẩm vừa xem:", error);
    }
    window.dispatchEvent(new CustomEvent("bakemate:recentProductsChanged", { detail: { ids: next } }));
    return next;
  }

  function clearRecentProducts() {
    try {
      window.localStorage.removeItem(RECENT_PRODUCTS_KEY);
    } catch (error) {}
    window.dispatchEvent(new CustomEvent("bakemate:recentProductsChanged", { detail: { ids: [] } }));
  }

  // ==================== WISHLIST (YÊU THÍCH) ====================

  function getWishlist() {
    try {
      const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (!raw) return { products: [], recipes: [] };
      const parsed = JSON.parse(raw);
      return {
        products: Array.isArray(parsed.products) ? parsed.products.map(Number).filter(Boolean) : [],
        recipes: Array.isArray(parsed.recipes) ? parsed.recipes.map(String).filter(Boolean) : []
      };
    } catch (error) {
      return { products: [], recipes: [] };
    }
  }

  function saveWishlist(wl) {
    const clean = {
      products: Array.from(new Set((wl.products || []).map(Number).filter(Boolean))),
      recipes: Array.from(new Set((wl.recipes || []).map(String).filter(Boolean)))
    };
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(clean));
    } catch (error) {
      console.warn("Không thể lưu danh sách yêu thích:", error);
    }
    updateWishlistBadge(clean);
    window.dispatchEvent(new CustomEvent("bakemate:wishlistChanged", { detail: clean }));
    return clean;
  }

  function isProductWishlisted(productId) {
    return getWishlist().products.includes(Number(productId));
  }

  function isRecipeWishlisted(recipeId) {
    return getWishlist().recipes.includes(String(recipeId));
  }

  function toggleWishlistProduct(productId) {
    const id = Number(productId);
    const wl = getWishlist();
    const exists = wl.products.includes(id);
    if (exists) {
      wl.products = wl.products.filter((x) => x !== id);
    } else {
      wl.products.unshift(id);
    }
    saveWishlist(wl);
    const product = getProduct(id);
    const name = product ? product.name : "sản phẩm";
    return {
      wishlisted: !exists,
      wishlist: wl,
      message: exists ? `Đã bỏ "${name}" khỏi danh sách yêu thích.` : `Đã thêm "${name}" vào danh sách yêu thích!`
    };
  }

  function toggleWishlistRecipe(recipeId) {
    const id = String(recipeId || "").trim();
    const wl = getWishlist();
    const exists = wl.recipes.includes(id);
    if (exists) {
      wl.recipes = wl.recipes.filter((x) => x !== id);
    } else {
      wl.recipes.unshift(id);
    }
    saveWishlist(wl);
    const recipe = typeof window.getRecipeById === "function" ? window.getRecipeById(id) : null;
    const title = recipe ? recipe.title : "công thức";
    return {
      wishlisted: !exists,
      wishlist: wl,
      message: exists ? `Đã bỏ lưu "${title}" khỏi yêu thích.` : `Đã lưu công thức "${title}" vào yêu thích!`
    };
  }

  function getWishlistCount(wlOverride) {
    const wl = wlOverride || getWishlist();
    return (wl.products ? wl.products.length : 0) + (wl.recipes ? wl.recipes.length : 0);
  }

  function updateWishlistBadge(wlOverride) {
    const count = getWishlistCount(wlOverride);
    const badges = document.querySelectorAll(".js-wishlist-badge, #wishlist-badge");
    badges.forEach((badge) => {
      badge.textContent = count > 99 ? "99+" : String(count);
      badge.classList.toggle("is-empty", count === 0);
    });
    const links = document.querySelectorAll(".site-header__wishlist");
    links.forEach((link) => {
      link.setAttribute("aria-label", `Danh sách yêu thích (${count} mục)`);
      link.setAttribute("title", `Danh sách yêu thích (${count} mục)`);
    });
    return count;
  }

  // ==================== ADDRESS BOOK (ĐỊA CHỈ GIAO HÀNG) ====================

  const SEED_SAMPLE_ADDRESSES = [
    {
      id: "addr-default-1",
      fullName: "Bảo Ngọc",
      phone: "0912345678",
      zone: "hcm",
      areaLabel: "Phường 6, Quận 3, TP. Hồ Chí Minh",
      street: "59C Nguyễn Đình Chiểu",
      type: "Nhà Riêng",
      isDefault: true
    },
    {
      id: "addr-default-2",
      fullName: "Minh Thư (Văn phòng)",
      phone: "0987654321",
      zone: "province",
      areaLabel: "Phường Hiệp Phú, TP. Thủ Đức (Ngoại thành)",
      street: "279 Nguyễn Văn Tăng, Tòa nhà S2",
      type: "Văn Phòng",
      isDefault: false
    }
  ];

  function getAddresses() {
    try {
      const raw = window.localStorage.getItem(ADDRESSES_STORAGE_KEY);
      if (!raw) {
        window.localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(SEED_SAMPLE_ADDRESSES));
        return [...SEED_SAMPLE_ADDRESSES];
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...SEED_SAMPLE_ADDRESSES];
    } catch (error) {
      return [...SEED_SAMPLE_ADDRESSES];
    }
  }

  function saveAddressesList(list) {
    try {
      window.localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Không thể lưu sổ địa chỉ:", e);
    }
    return list;
  }

  function addAddress(newAddr) {
    const list = getAddresses();
    const id = `addr-${Date.now()}`;
    const entry = {
      id,
      fullName: String(newAddr.fullName || "").trim(),
      phone: String(newAddr.phone || "").trim(),
      zone: newAddr.zone === "province" ? "province" : "hcm",
      areaLabel: String(newAddr.areaLabel || "").trim(),
      street: String(newAddr.street || "").trim(),
      type: newAddr.type === "Văn Phòng" ? "Văn Phòng" : "Nhà Riêng",
      isDefault: Boolean(newAddr.isDefault)
    };
    const nextList = entry.isDefault
      ? list.map((a) => Object.assign({}, a, { isDefault: false }))
      : [...list];
    nextList.unshift(entry);
    saveAddressesList(nextList);
    return entry;
  }

  function setDefaultAddress(addressId) {
    const list = getAddresses().map((a) =>
      Object.assign({}, a, { isDefault: a.id === addressId })
    );
    saveAddressesList(list);
    return list;
  }

  // ==================== REVIEWS (ĐÁNH GIÁ SẢN PHẨM & CÔNG THỨC) ====================

  function getReviews(targetType, targetId) {
    try {
      const raw = window.localStorage.getItem(REVIEWS_STORAGE_KEY);
      const all = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(all)) return [];
      return all.filter(
        (r) => r.targetType === targetType && String(r.targetId) === String(targetId)
      );
    } catch (e) {
      return [];
    }
  }

  function addReview(entry) {
    try {
      const raw = window.localStorage.getItem(REVIEWS_STORAGE_KEY);
      const all = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(all) ? all : [];
      const safeImage =
        typeof entry.imageDataUrl === "string" &&
        entry.imageDataUrl.startsWith("data:image/") &&
        entry.imageDataUrl.length <= 450000
          ? entry.imageDataUrl
          : "";
      const record = {
        id: `rev-${Date.now()}`,
        targetType: entry.targetType || "product",
        targetId: String(entry.targetId),
        userId: entry.userId || "guest",
        userName: entry.userName || "Khách hàng BakeMate",
        rating: Math.max(1, Math.min(5, Number(entry.rating) || 5)),
        comment: String(entry.comment || "").trim(),
        imageDataUrl: safeImage,
        createdAt: new Date().toISOString()
      };
      list.unshift(record);
      window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(list));
      return record;
    } catch (e) {
      return null;
    }
  }

  // ==================== HEADER BADGES & NOTIFICATIONS ====================

  function updateCartBadge(cartOverride) {
    const count = getCartCount(cartOverride);
    const cartLinks = document.querySelectorAll(".site-header__cart");

    cartLinks.forEach((link) => {
      let badge = link.querySelector(".site-header__cart-badge") || link.querySelector("#cart-badge");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "site-header__cart-badge";
        badge.id = "cart-badge";
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

  let toastTimer = null;
  function showCartToast(message, options = {}) {
    const { type = "success", showCartLink = false, duration = 3000 } = options;

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
   * Hộp thoại xác nhận chuẩn UI BakeMate (thay thế window.confirm mặc định).
   */
  function showBakeConfirm(options = {}) {
    const {
      title = "Xác nhận thao tác",
      message = "Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?",
      confirmText = "Đồng ý",
      cancelText = "Hủy bỏ"
    } = options;

    return new Promise((resolve) => {
      const existing = document.getElementById("bakemate-confirm-modal");
      if (existing) existing.remove();

      const backdrop = document.createElement("div");
      backdrop.id = "bakemate-confirm-modal";
      backdrop.className = "bake-modal-backdrop";
      backdrop.setAttribute("role", "dialog");
      backdrop.setAttribute("aria-modal", "true");
      backdrop.innerHTML = `
        <div class="bake-confirm-card">
          <div class="bake-confirm-card__icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
            </svg>
          </div>
          <h3 class="bake-confirm-card__title"></h3>
          <p class="bake-confirm-card__message"></p>
          <div class="bake-confirm-card__actions">
            <button type="button" class="btn btn--outline-dark js-confirm-cancel"></button>
            <button type="button" class="btn btn--primary js-confirm-ok"></button>
          </div>
        </div>
      `;

      backdrop.querySelector(".bake-confirm-card__title").textContent = title;
      backdrop.querySelector(".bake-confirm-card__message").textContent = message;
      backdrop.querySelector(".js-confirm-cancel").textContent = cancelText;
      backdrop.querySelector(".js-confirm-ok").textContent = confirmText;

      function closeWith(value) {
        backdrop.remove();
        document.removeEventListener("keydown", onEsc);
        resolve(value);
      }

      function onEsc(e) {
        if (e.key === "Escape") closeWith(false);
      }

      backdrop.querySelector(".js-confirm-ok").addEventListener("click", () => closeWith(true));
      backdrop.querySelector(".js-confirm-cancel").addEventListener("click", () => closeWith(false));
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) closeWith(false);
      });
      document.addEventListener("keydown", onEsc);

      document.body.appendChild(backdrop);
      backdrop.querySelector(".js-confirm-ok").focus();
    });
  }

  // ==================== ORDERS (ĐƠN HÀNG COD) ====================

  function getOrders() {
    try {
      const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn("Không thể đọc danh sách đơn hàng:", error);
      return [];
    }
  }

  function createOrderCode() {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `#BM-${randomDigits}`;
  }

  function saveOrder(order) {
    const orders = getOrders();
    const normalizedOrder = Object.assign(
      {
        status: "Chờ xác nhận",
        shippingFee: DEFAULT_SHIPPING_FEE
      },
      order
    );
    const nextOrders = [normalizedOrder, ...orders].slice(0, 30);
    try {
      window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(nextOrders));
      window.localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(normalizedOrder));
    } catch (error) {
      console.error("Không thể lưu đơn hàng vào localStorage:", error);
    }
    return normalizedOrder;
  }

  function getLastOrderSnapshot(orderCode) {
    try {
      if (orderCode) {
        const found = getOrders().find((o) => String(o.orderCode) === String(orderCode));
        if (found) return found;
      }
      const raw = window.localStorage.getItem(LAST_ORDER_KEY);
      if (raw) return JSON.parse(raw);
      const list = getOrders();
      return list.length > 0 ? list[0] : null;
    } catch (error) {
      return null;
    }
  }

  function updateOrderStatus(orderCode, nextStatus) {
    const orders = getOrders();
    const updated = orders.map((ord) =>
      ord.orderCode === orderCode ? Object.assign({}, ord, { status: nextStatus }) : ord
    );
    try {
      window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    return updated;
  }

  function clearOrders() {
    try {
      window.localStorage.removeItem(ORDERS_STORAGE_KEY);
    } catch (error) {
      console.error("Không thể xóa lịch sử đơn hàng:", error);
    }
  }

  // ==================== CONTACT MESSAGES ====================

  function saveContactMessage(msg) {
    try {
      const raw = window.localStorage.getItem(CONTACTS_STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const next = [Object.assign({ id: `msg-${Date.now()}`, createdAt: new Date().toISOString() }, msg), ...(Array.isArray(list) ? list : [])];
      window.localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(next.slice(0, 30)));
      return next[0];
    } catch (e) {
      return null;
    }
  }

  // ==================== CLIPBOARD & PROMO COPY ====================

  function copyTextToClipboard(text) {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopyText(text));
    }
    return Promise.resolve(fallbackCopyText(text));
  }

  function fallbackCopyText(text) {
    try {
      const tempInput = document.createElement("textarea");
      tempInput.value = text;
      tempInput.setAttribute("readonly", "");
      tempInput.style.position = "fixed";
      tempInput.style.left = "-9999px";
      document.body.appendChild(tempInput);
      tempInput.select();
      const copied = document.execCommand("copy");
      tempInput.remove();
      return copied;
    } catch (error) {
      return false;
    }
  }

  function initPromoCopyButtons() {
    const copyButtons = document.querySelectorAll(".js-copy-promo");
    if (!copyButtons || copyButtons.length === 0) return;

    copyButtons.forEach((btn) => {
      if (btn.dataset.copyBound === "true") return;
      btn.dataset.copyBound = "true";

      let resetTimer = null;
      btn.addEventListener("click", function () {
        const couponCode = (btn.dataset.coupon || "CHAOBANMOI").trim().toUpperCase();
        const couponMeta = VALID_COUPONS[couponCode];
        copyTextToClipboard(couponCode).then(() => {
          btn.classList.add("is-copied");
          const labelEl = btn.querySelector(".js-copy-promo-label");
          if (labelEl) labelEl.textContent = "Đã sao chép!";

          showCartToast(
            `Đã sao chép mã ${couponCode}${couponMeta ? ` (${couponMeta.description})` : ""}.`,
            { type: "success" }
          );

          if (resetTimer) window.clearTimeout(resetTimer);
          resetTimer = window.setTimeout(() => {
            btn.classList.remove("is-copied");
            if (labelEl) labelEl.textContent = "Sao chép";
          }, 2200);
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateCartBadge();
    updateWishlistBadge();
    initPromoCopyButtons();
  });

  window.addEventListener("storage", function (event) {
    if (event.key === CART_STORAGE_KEY || event.key === LEGACY_CART_KEY) {
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
    if (event.key === WISHLIST_STORAGE_KEY) {
      updateWishlistBadge();
      window.dispatchEvent(new CustomEvent("bakemate:wishlistChanged", { detail: getWishlist() }));
    }
  });

  if (typeof window !== "undefined") {
    window.CART_STORAGE_KEY = CART_STORAGE_KEY;
    window.ORDERS_STORAGE_KEY = ORDERS_STORAGE_KEY;
    window.LAST_ORDER_KEY = LAST_ORDER_KEY;
    window.COUPON_STORAGE_KEY = COUPON_STORAGE_KEY;
    window.COUPONS_STORAGE_KEY = COUPONS_STORAGE_KEY;
    window.CART_SELECTION_KEY = CART_SELECTION_KEY;
    window.RECENT_PRODUCTS_KEY = RECENT_PRODUCTS_KEY;
    window.WISHLIST_STORAGE_KEY = WISHLIST_STORAGE_KEY;
    window.DEFAULT_SHIPPING_FEE = DEFAULT_SHIPPING_FEE;
    window.SHIPPING_ZONES = SHIPPING_ZONES;
    window.VALID_COUPONS = VALID_COUPONS;
    window.FALLBACK_PRODUCT_IMAGE = FALLBACK_PRODUCT_IMAGE;
    window.RECIPE_COMBO_CATALOG = RECIPE_COMBO_CATALOG;
    window.getRecipeComboInfo = getRecipeComboInfo;
    window.normalizeRecipeGroupId = normalizeRecipeGroupId;
    window.formatCurrency = formatCurrency;
    window.getProduct = getProduct;
    window.getProductOptions = getProductOptions;
    window.getProductOption = getProductOption;
    window.isProductPerishable = isProductPerishable;
    window.hasPerishableItems = hasPerishableItems;
    window.getCart = getCart;
    window.loadCart = loadCart;
    window.saveCart = saveCart;
    window.getCartItemKey = getCartItemKey;
    window.getSelectedCartKeys = getSelectedCartKeys;
    window.setSelectedCartKeys = setSelectedCartKeys;
    window.getSelectedCartItems = getSelectedCartItems;
    window.removeOrderedCartItems = removeOrderedCartItems;
    window.addToCart = addToCart;
    window.addRecipeComboToCart = addRecipeComboToCart;
    window.updateQuantity = updateQuantity;
    window.removeFromCart = removeFromCart;
    window.removeRecipeGroup = removeRecipeGroup;
    window.clearCart = clearCart;
    window.getCartCount = getCartCount;
    window.getCartTotal = getCartTotal;
    window.validateCouponCode = validateCouponCode;
    window.getSavedCoupon = getSavedCoupon;
    window.setSavedCoupon = setSavedCoupon;
    window.clearSavedCoupon = clearSavedCoupon;
    window.getSavedCoupons = getSavedCoupons;
    window.addCouponCode = addCouponCode;
    window.removeSavedCoupon = removeSavedCoupon;
    window.clearSavedCoupons = clearSavedCoupons;
    window.calculateDiscount = calculateDiscount;
    window.getRecentProducts = getRecentProducts;
    window.addRecentProduct = addRecentProduct;
    window.clearRecentProducts = clearRecentProducts;
    window.getWishlist = getWishlist;
    window.saveWishlist = saveWishlist;
    window.isProductWishlisted = isProductWishlisted;
    window.isRecipeWishlisted = isRecipeWishlisted;
    window.toggleWishlistProduct = toggleWishlistProduct;
    window.toggleWishlistRecipe = toggleWishlistRecipe;
    window.getWishlistCount = getWishlistCount;
    window.updateWishlistBadge = updateWishlistBadge;
    window.getAddresses = getAddresses;
    window.addAddress = addAddress;
    window.setDefaultAddress = setDefaultAddress;
    window.getReviews = getReviews;
    window.addReview = addReview;
    window.updateCartBadge = updateCartBadge;
    window.showCartToast = showCartToast;
    window.showBakeConfirm = showBakeConfirm;
    window.getOrders = getOrders;
    window.saveOrder = saveOrder;
    window.getLastOrderSnapshot = getLastOrderSnapshot;
    window.updateOrderStatus = updateOrderStatus;
    window.clearOrders = clearOrders;
    window.createOrderCode = createOrderCode;
    window.saveContactMessage = saveContactMessage;
    window.initPromoCopyButtons = initPromoCopyButtons;
  }
})();
