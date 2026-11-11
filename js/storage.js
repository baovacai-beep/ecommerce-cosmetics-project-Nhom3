/*
 * =====================================================
 * BAKEMATE - QUẢN LÝ LOCALSTORAGE & HÀM GIỎ HÀNG DÙNG CHUNG
 * Tệp: js/storage.js (Bước 6 + Recipe-to-Cart + Mã giảm giá + F13)
 * Khóa localStorage: "bakemate_cart", "bakemate_orders", "bakemate_coupon"
 * Cấu trúc mỗi phần tử giỏ hàng:
 * { productId: Number, optionIndex: Number, quantity: Number, recipeGroupId: String | null }
 * =====================================================
 */

(function () {
  const CART_STORAGE_KEY = "bakemate_cart";
  const ORDERS_STORAGE_KEY = "bakemate_orders";
  const COUPON_STORAGE_KEY = "bakemate_coupon";
  const MAX_CART_QUANTITY = 99;
  const FALLBACK_PRODUCT_IMAGE = "images/logo.jpg";

  /**
   * Danh sách mã giảm giá hợp lệ hỗ trợ khi đặt hàng.
   */
  const VALID_COUPONS = {
    CHAOBANMOI: {
      code: "CHAOBANMOI",
      discountRate: 0.1,
      description: "Giảm 10% cho đơn hàng đầu tiên"
    }
  };

  /**
   * Quy cách đóng gói chuẩn theo từng ID sản phẩm (1..21) trong js/products.js.
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
    ],
    12: [
      { shortLabel: "Khối 227g", price: 68000, oldPrice: 82000 },
      { shortLabel: "Combo 2 khối (454g)", price: 130000, oldPrice: 158000 }
    ],
    13: [
      { shortLabel: "Túi 1kg", price: 28000, oldPrice: 35000 },
      { shortLabel: "Túi 500g", price: 16000, oldPrice: 20000 }
    ],
    14: [
      { shortLabel: "Hộp 100g", price: 48000, oldPrice: 58000 },
      { shortLabel: "Gói 50g dùng thử", price: 27000, oldPrice: 34000 }
    ],
    15: [
      { shortLabel: "Vỉ 10 quả", price: 34000, oldPrice: 40000 },
      { shortLabel: "Hộp 6 quả", price: 22000, oldPrice: 27000 }
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
      { shortLabel: "Cuộn 5m × 30cm", price: 29000, oldPrice: 36000 },
      { shortLabel: "Cuộn 10m × 30cm", price: 52000, oldPrice: 64000 }
    ],
    19: [
      { shortLabel: "Lốc 50 cup tiêu chuẩn", price: 24000, oldPrice: 30000 },
      { shortLabel: "Lốc 100 cup", price: 44000, oldPrice: 55000 }
    ],
    20: [
      { shortLabel: "Bộ 12 đui + khớp nối", price: 65000, oldPrice: 79000 },
      { shortLabel: "Bộ 24 đui chuyên nghiệp", price: 115000, oldPrice: 140000 }
    ],
    21: [
      { shortLabel: "Set 2 hộp (25×25×18cm)", price: 38000, oldPrice: 48000 },
      { shortLabel: "Set 5 hộp tiết kiệm", price: 88000, oldPrice: 110000 }
    ]
  };

  /**
   * Kho Combo Recipe-to-Cart dùng chung giữa Chi tiết sản phẩm, Blog và Giỏ hàng.
   */
  const RECIPE_COMBO_CATALOG = {
    "recipe-bong-lan": {
      id: "recipe-bong-lan",
      title: "Combo Bánh Bông Lan Chiffon Mềm Tan",
      time: "55 phút",
      diff: "Dễ",
      servings: "1 ổ bánh 20cm (6–8 phần)",
      image: "images/about-baking.jpg",
      items: [
        { productId: 1, optionIndex: 2, quantity: 1, usage: "120g Bột mì số 8 (chọn túi 300g tiết kiệm)" },
        { productId: 15, optionIndex: 0, quantity: 1, usage: "5 quả Trứng gà tươi (vỉ 10 quả)" },
        { productId: 13, optionIndex: 1, quantity: 1, usage: "100g Đường tinh luyện (túi 500g)" },
        { productId: 14, optionIndex: 1, quantity: 1, usage: "1/2 thìa Cream of Tartar ổn định lòng trắng" }
      ]
    },
    "recipe-hoa-cuc": {
      id: "recipe-hoa-cuc",
      title: "Combo Bánh Mì Hoa Cúc Thơm Lừng Bơ Sữa",
      time: "90 phút",
      diff: "Vừa",
      servings: "2 ổ bánh hoa cúc 450g",
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
      servings: "12 chiếc Muffin vừa",
      image: "images/banner.jpg",
      items: [
        { productId: 3, optionIndex: 2, quantity: 1, usage: "150g Bột mì đa dụng Meizan (túi 300g)" },
        { productId: 4, optionIndex: 0, quantity: 1, usage: "35g Bột cacao Hershey's nguyên chất" },
        { productId: 12, optionIndex: 0, quantity: 1, usage: "80g Bơ lạt Anchor đun chảy" },
        { productId: 19, optionIndex: 0, quantity: 1, usage: "12 Cup giấy nướng bánh chống thấm" }
      ]
    },
    "recipe-matcha-cupcake": {
      id: "recipe-matcha-cupcake",
      title: "Combo Cupcake Matcha Kem Phô Mai",
      time: "50 phút",
      diff: "Dễ",
      servings: "12 chiếc Cupcake trà xanh",
      image: "images/about-sharing-cakes.jpg",
      items: [
        { productId: 1, optionIndex: 2, quantity: 1, usage: "140g Bột mì số 8 mềm mịn (túi 300g)" },
        { productId: 5, optionIndex: 0, quantity: 1, usage: "12g Bột Matcha Nhật Bản" },
        { productId: 6, optionIndex: 0, quantity: 1, usage: "200ml Whipping Cream Anchor đánh bông" },
        { productId: 19, optionIndex: 0, quantity: 1, usage: "12 Cup giấy xếp ly nướng cupcake" }
      ]
    },
    "recipe-brownie": {
      id: "recipe-brownie",
      title: "Combo Bánh Brownie Chocolate Đậm Vị",
      time: "45 phút",
      diff: "Dễ",
      servings: "Khay 20×20cm (9 miếng vuông)",
      image: "images/contact-baking.jpg",
      items: [
        { productId: 3, optionIndex: 3, quantity: 1, usage: "85g Bột mì đa dụng Meizan (gói 100g)" },
        { productId: 4, optionIndex: 0, quantity: 1, usage: "50g Bột cacao Hershey's" },
        { productId: 12, optionIndex: 0, quantity: 1, usage: "120g Bơ lạt Anchor" },
        { productId: 18, optionIndex: 0, quantity: 1, usage: "1 tờ Giấy nến lót khuôn chống dính" }
      ]
    },
    "recipe-mousse-socola": {
      id: "recipe-mousse-socola",
      title: "Combo Bánh Mousse Socola Lạnh Mịn Mượt",
      time: "75 phút",
      diff: "Vừa",
      servings: "1 bánh tròn 20cm không cần lò",
      image: "images/about-ingredients.jpg",
      items: [
        { productId: 6, optionIndex: 0, quantity: 1, usage: "250ml Whipping Cream Anchor lạnh" },
        { productId: 4, optionIndex: 0, quantity: 1, usage: "35g Bột cacao Hershey's" },
        { productId: 16, optionIndex: 0, quantity: 1, usage: "1 Phới lồng đánh bông kem mịn" },
        { productId: 17, optionIndex: 0, quantity: 1, usage: "1 Khuôn đế rời 20cm dễ tách bánh lạnh" }
      ]
    },
    "recipe-banh-quy-bo": {
      id: "recipe-banh-quy-bo",
      title: "Combo Bánh Quy Bơ Đan Mạch Giòn Xốp",
      time: "40 phút",
      diff: "Dễ",
      servings: "35–40 chiếc bánh quy bơ",
      image: "images/about-beginner.jpg",
      items: [
        { productId: 1, optionIndex: 2, quantity: 1, usage: "180g Bột mì số 8 (túi 300g)" },
        { productId: 12, optionIndex: 0, quantity: 1, usage: "150g Bơ lạt Anchor đánh bông" },
        { productId: 11, optionIndex: 0, quantity: 1, usage: "Túi bắt kem PE dày bóp bột quy" },
        { productId: 20, optionIndex: 0, quantity: 1, usage: "Bộ đui bắt kem tạo vân hoa cúc sắc nét" }
      ]
    },
    "recipe-pancake": {
      id: "recipe-pancake",
      title: "Combo Bánh Pancake Mật Ong Bữa Sáng",
      time: "25 phút",
      diff: "Dễ",
      servings: "8 chiếc Pancake vàng ươm",
      image: "images/about-baking.jpg",
      items: [
        { productId: 3, optionIndex: 2, quantity: 1, usage: "150g Bột mì đa dụng Meizan (túi 300g)" },
        { productId: 15, optionIndex: 1, quantity: 1, usage: "2 quả Trứng gà tươi (hộp 6 quả)" },
        { productId: 13, optionIndex: 1, quantity: 1, usage: "40g Đường tinh luyện (túi 500g)" },
        { productId: 8, optionIndex: 0, quantity: 1, usage: "1 Ca đong chia ml đong sữa & rót bột" }
      ]
    }
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
   * Chuẩn hóa recipeGroupId: null nếu mua lẻ, hoặc chuỗi mã công thức (ví dụ 'recipe-bong-lan').
   */
  function normalizeRecipeGroupId(value) {
    if (typeof value !== "string") {
      return null;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  /**
   * Lấy thông tin mô tả combo công thức theo recipeGroupId.
   */
  function getRecipeComboInfo(recipeGroupId) {
    const normalized = normalizeRecipeGroupId(recipeGroupId);
    if (!normalized) {
      return null;
    }
    return RECIPE_COMBO_CATALOG[normalized] || {
      id: normalized,
      title: `Combo công thức (${normalized})`,
      time: "Chuẩn vị BakeMate",
      diff: "Dễ",
      servings: "1 công thức",
      image: "images/about-baking.jpg",
      items: []
    };
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
   * gộp trùng theo (productId, optionIndex, recipeGroupId) và giới hạn số lượng [1, 99].
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
      const recipeGroupId = normalizeRecipeGroupId(entry.recipeGroupId);
      const key = `${productId}:${optionIndex}:${recipeGroupId || ""}`;
      const prev = mergedMap.get(key);
      const nextQty = Math.min(MAX_CART_QUANTITY, (prev ? prev.quantity : 0) + quantity);
      mergedMap.set(key, { productId, optionIndex, quantity: nextQty, recipeGroupId });
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
   * Thêm sản phẩm (kèm quy cách và recipeGroupId) vào giỏ hàng hoặc cộng dồn số lượng.
   */
  function addToCart(productId, quantity = 1, optionIndex = 0, recipeGroupId = null) {
    const id = Number(productId);
    const parsedQty = Math.floor(Number(quantity));
    const normalizedGroupId = normalizeRecipeGroupId(recipeGroupId);

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
   * Thêm trọn bộ nguyên liệu theo combo công thức (Recipe-to-Cart).
   */
  function addRecipeComboToCart(recipeGroupId, customItems) {
    const normalizedGroupId = normalizeRecipeGroupId(recipeGroupId);
    if (!normalizedGroupId) {
      return {
        success: false,
        addedCount: 0,
        message: "Mã công thức không hợp lệ."
      };
    }

    const comboInfo = getRecipeComboInfo(normalizedGroupId);
    const itemsToAdd = Array.isArray(customItems) && customItems.length > 0
      ? customItems
      : comboInfo.items || [];

    if (itemsToAdd.length === 0) {
      return {
        success: false,
        addedCount: 0,
        message: "Không tìm thấy nguyên liệu trong combo công thức này."
      };
    }

    let addedCount = 0;
    itemsToAdd.forEach((entry) => {
      const res = addToCart(entry.productId, entry.quantity || 1, entry.optionIndex || 0, normalizedGroupId);
      if (res && res.success) {
        addedCount += 1;
      }
    });

    if (addedCount === 0) {
      return {
        success: false,
        addedCount: 0,
        message: "Không thể thêm nguyên liệu của công thức vào giỏ hàng."
      };
    }

    return {
      success: true,
      addedCount,
      recipeGroupId: normalizedGroupId,
      comboTitle: comboInfo.title,
      cart: getCart(),
      message: `Đã thêm trọn bộ ${addedCount} món của "${comboInfo.title}" vào giỏ hàng.`
    };
  }

  /**
   * Cập nhật số lượng của một dòng sản phẩm theo (productId, optionIndex, recipeGroupId).
   */
  function updateQuantity(productId, newQuantity, optionIndex = 0, recipeGroupId = null) {
    const id = Number(productId);
    const parsedQty = Math.floor(Number(newQuantity));
    const normalizedGroupId = normalizeRecipeGroupId(recipeGroupId);

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
      (item) =>
        item.productId === id &&
        Number(item.optionIndex || 0) === normalizedOptionIndex &&
        normalizeRecipeGroupId(item.recipeGroupId) === normalizedGroupId
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
      recipeGroupId: normalizedGroupId,
      cart: updatedCart
    };
  }

  /**
   * Xóa một dòng sản phẩm khỏi giỏ hàng theo (productId, optionIndex, recipeGroupId).
   */
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

  /**
   * Xóa toàn bộ sản phẩm thuộc một nhóm combo công thức (recipeGroupId).
   */
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
   * Kiểm tra và áp dụng mã giảm giá (CHAOBANMOI -> giảm 10%).
   */
  function validateCouponCode(rawCode) {
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
        message: "Mã giảm giá không hợp lệ hoặc đã hết hạn. Gợi ý: nhập CHAOBANMOI để được giảm 10%."
      };
    }

    return {
      valid: true,
      code: coupon.code,
      discountRate: coupon.discountRate,
      description: coupon.description,
      message: `Áp dụng thành công mã ${coupon.code}: ${coupon.description}!`
    };
  }

  function getSavedCoupon() {
    try {
      const raw = window.localStorage.getItem(COUPON_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const res = validateCouponCode(raw);
      return res.valid ? res.code : null;
    } catch (error) {
      return null;
    }
  }

  function setSavedCoupon(rawCode) {
    const res = validateCouponCode(rawCode);
    if (!res.valid) {
      return res;
    }
    try {
      window.localStorage.setItem(COUPON_STORAGE_KEY, res.code);
    } catch (error) {
      console.warn("Không thể lưu mã giảm giá vào localStorage:", error);
    }
    return res;
  }

  function clearSavedCoupon() {
    try {
      window.localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch (error) {
      console.warn("Không thể xóa mã giảm giá:", error);
    }
  }

  function calculateDiscount(subtotal, couponCode) {
    const safeSubtotal = Math.max(0, Number(subtotal) || 0);
    const check = validateCouponCode(couponCode);
    if (!check.valid || safeSubtotal === 0) {
      return {
        couponCode: null,
        discountRate: 0,
        discountAmount: 0,
        finalTotal: safeSubtotal
      };
    }
    const discountAmount = Math.round(safeSubtotal * check.discountRate);
    return {
      couponCode: check.code,
      discountRate: check.discountRate,
      discountAmount,
      finalTotal: Math.max(0, safeSubtotal - discountAmount)
    };
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

  /**
   * Sao chép chuỗi văn bản an toàn vào Clipboard (hỗ trợ cả HTTPS và file:// cục bộ).
   */
  function copyTextToClipboard(text) {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      return navigator.clipboard.writeText(text).catch(() => {
        return fallbackCopyText(text);
      });
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

  /**
   * Gắn sự kiện sao chép mã ưu đãi CHAOBANMOI trên thanh Promo Ticket toàn website.
   */
  function initPromoCopyButtons() {
    const copyButtons = document.querySelectorAll(".js-copy-promo");
    if (!copyButtons || copyButtons.length === 0) {
      return;
    }

    copyButtons.forEach((btn) => {
      if (btn.dataset.copyBound === "true") {
        return;
      }
      btn.dataset.copyBound = "true";

      let resetTimer = null;
      btn.addEventListener("click", function () {
        const couponCode = (btn.dataset.coupon || "CHAOBANMOI").trim().toUpperCase();
        copyTextToClipboard(couponCode).then(() => {
          btn.classList.add("is-copied");
          const labelEl = btn.querySelector(".js-copy-promo-label");
          if (labelEl) {
            labelEl.textContent = "Đã sao chép!";
          }

          showCartToast(
            `Đã sao chép mã ${couponCode} (-10% cho đơn hàng đầu tiên).`,
            { type: "success" }
          );

          if (resetTimer) {
            window.clearTimeout(resetTimer);
          }
          resetTimer = window.setTimeout(() => {
            btn.classList.remove("is-copied");
            if (labelEl) {
              labelEl.textContent = "Sao chép mã";
            }
          }, 2200);
        });
      });
    });
  }

  // Tự động đồng bộ badge Header khi tải trang và khi có thay đổi giữa các tab
  document.addEventListener("DOMContentLoaded", function () {
    updateCartBadge();
    initPromoCopyButtons();
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
    window.COUPON_STORAGE_KEY = COUPON_STORAGE_KEY;
    window.FALLBACK_PRODUCT_IMAGE = FALLBACK_PRODUCT_IMAGE;
    window.RECIPE_COMBO_CATALOG = RECIPE_COMBO_CATALOG;
    window.getRecipeComboInfo = getRecipeComboInfo;
    window.normalizeRecipeGroupId = normalizeRecipeGroupId;
    window.formatCurrency = formatCurrency;
    window.getProduct = getProduct;
    window.getProductOptions = getProductOptions;
    window.getProductOption = getProductOption;
    window.getCart = getCart;
    window.loadCart = loadCart;
    window.saveCart = saveCart;
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
    window.calculateDiscount = calculateDiscount;
    window.updateCartBadge = updateCartBadge;
    window.showCartToast = showCartToast;
    window.getOrders = getOrders;
    window.saveOrder = saveOrder;
    window.clearOrders = clearOrders;
    window.createOrderCode = createOrderCode;
  }
})();
