/*
 * =====================================================
 * BAKEMATE - TRANG BLOG CÔNG THỨC & KIẾN THỨC LÀM BÁNH
 * Tệp: js/blog.js (Tích hợp Recipe-to-Cart cho blog.html)
 * =====================================================
 */

(function () {
  const FALLBACK_IMG = window.FALLBACK_PRODUCT_IMAGE || "images/logo.jpg";

  const BLOG_POSTS = [
    {
      id: "post-bong-lan-chiffon",
      recipeGroupId: "recipe-bong-lan",
      title: "Bí quyết làm Bánh Bông Lan Chiffon mềm ẩm, nở cao không xẹp mặt",
      category: "Công thức chuẩn vị",
      readTime: "55 phút thực hiện",
      diff: "Dễ",
      author: "Minh Thư · BakeMate Studio",
      publishedAt: "08/11/2026",
      image: "images/about-baking.jpg",
      excerpt:
        "Chọn đúng bột mì số 8 có hàm lượng protein thấp 8–9% và ổn định lòng trắng trứng với Cream of Tartar giúp cốt bánh bông nhẹ tan ngay trong miệng.",
      steps: [
        "Tách riêng 5 lòng đỏ và 5 lòng trắng trứng gà ở nhiệt độ phòng; làm nóng trước lò ở 160°C trong 15 phút.",
        "Trộn đều lòng đỏ với sữa tươi, dầu ăn và rây 120g Bột mì số 8 vào khuấy theo một chiều cho mịn mượt.",
        "Đánh bông lòng trắng với 1/2 thìa Cream of Tartar và 100g đường tinh luyện theo 3 lần chia cho đến khi đạt chóp mềm uốn cong.",
        "Trộn nhẹ nhàng (fold) hỗn hợp lòng trắng vào âu lòng đỏ theo kỹ thuật hất từ đáy âu lên để không vỡ bọt khí.",
        "Đổ bột vào khuôn tròn 20cm và nướng cách thủy hoặc nướng ở 155–160°C trong 45 phút, úp ngược khuôn ngay khi lấy ra."
      ]
    },
    {
      id: "post-banh-mi-hoa-cuc",
      recipeGroupId: "recipe-hoa-cuc",
      title: "Cách làm Bánh Mì Hoa Cúc ngàn lớp thơm lừng bơ sữa tại nhà",
      category: "Công thức chuẩn vị",
      readTime: "90 phút thực hiện",
      diff: "Vừa",
      author: "Gia Bảo · BakeMate Kitchen",
      publishedAt: "06/11/2026",
      image: "images/about-young-bakers.jpg",
      excerpt:
        "Bí mật tạo nên từng thớ bánh dai mềm kéo sợi nằm ở bột mì số 11 giàu gluten kết hợp cùng bơ lạt Anchor nguyên chất 82.9% béo sữa.",
      steps: [
        "Cân chuẩn 260g Bột mì Baker's Choice số 11, trộn cùng men nở, đường tinh luyện và sữa ấm 38°C.",
        "Nhồi bột đến khi kết khối dẻo mịn, sau đó cho từng lát bơ lạt Anchor ở nhiệt độ phòng vào nhồi tiếp đến khi kéo được màng mỏng không rách.",
        "Ủ bột lần 1 trong 50 phút cho nở gấp đôi; chia bột làm 3 hoặc 6 phần bằng nhau, cán dài và thắt bím đặt vào khuôn.",
        "Ủ lần 2 thêm 35 phút, phết lớp trứng đánh loãng lên mặt bánh rồi nướng ở 175°C khoảng 25–28 phút đến khi chín vàng ruộm."
      ]
    },
    {
      id: "post-muffin-socola",
      recipeGroupId: "recipe-muffin-socola",
      title: "Muffin Chocolate Hạnh Nhân chỉ 40 phút cho buổi trà chiều",
      category: "Công thức chuẩn vị",
      readTime: "40 phút thực hiện",
      diff: "Dễ",
      author: "Bảo Ngọc · BakeMate Community",
      publishedAt: "05/11/2026",
      image: "images/banner.jpg",
      excerpt:
        "Không cần máy đánh trứng cầu kỳ — chỉ với phới lồng tay, bột cacao Hershey's nguyên chất và cup giấy nướng bánh là bạn đã có ngay khay muffin thơm nồng.",
      steps: [
        "Xếp 12 cup giấy nướng bánh vào khay muffin; làm nóng lò nướng ở 180°C trước 10 phút.",
        "Đun chảy 80g bơ lạt Anchor cùng một chút dầu ăn, hòa tan đều với 35g bột cacao Hershey's để khơi dậy mùi socola đậm đà.",
        "Rây 150g bột mì đa dụng Meizan cùng bột nở vào âu hỗn hợp ướt, khuấy vừa quyện hết bột khô (tránh trộn quá tay gây chai bánh).",
        "Chia đều bột đầy 2/3 cup giấy và nướng ở 180°C trong 22–25 phút cho đến khi tăm xiên vào rút ra sạch."
      ]
    },
    {
      id: "post-phan-biet-bot-mi",
      recipeGroupId: "recipe-matcha-cupcake",
      title: "Phân biệt Bột Mì Số 8, Số 11 và Đa Dụng — Mua đúng khỏi tốn tiền oan",
      category: "Mẹo chọn nguyên liệu",
      readTime: "5 phút đọc",
      diff: "Dễ",
      author: "Như Hậu · BakeMate Content",
      publishedAt: "03/11/2026",
      image: "images/about-ingredients.jpg",
      excerpt:
        "Tại sao làm bánh bông lan dùng bột mì số 11 lại bị cứng, còn làm bánh mì dùng bột số 8 lại dễ bở? Tìm hiểu ngay tỉ lệ protein và quy cách túi 100g–1kg tối ưu.",
      steps: [
        "Bột mì số 8 (Cake Flour, 8–9% protein): Ít gluten giúp bánh bông lan, chiffon, cupcake matcha mềm xốp và giữ độ ẩm lâu.",
        "Bột mì số 11 (Bread Flour, 11.5–13% protein): Gluten cao tạo mạng lưới giữ khí khỏe, bắt buộc phải có cho bánh mì hoa cúc, baguette và đế pizza.",
        "Bột mì đa dụng (All-Purpose, 9.5–11.5% protein): Cân bằng linh hoạt giữa mềm và giòn, phù hợp cho muffin, bánh quy, pancake bữa sáng.",
        "Mẹo tiết kiệm BakeMate: Nếu mới thử làm 1 mẻ bánh nhỏ, hãy chọn quy cách túi 100g hoặc 300g ngay tại trang chi tiết sản phẩm để tránh tồn bột quá hạn."
      ]
    },
    {
      id: "post-brownie-giot-am",
      recipeGroupId: "recipe-brownie",
      title: "Kỹ thuật nướng Bánh Brownie Chocolate mặt bóng vỡ, ruột ẩm dẻo",
      category: "Kỹ thuật làm bánh",
      readTime: "45 phút thực hiện",
      diff: "Dễ",
      author: "Nguyễn Thương · BakeMate Baker",
      publishedAt: "01/11/2026",
      image: "images/contact-baking.jpg",
      excerpt:
        "Hai bí quyết vàng quyết định thành công của khay Brownie chuẩn Mỹ: nhiệt độ bơ-cacao cách thủy 50°C và lót giấy nến chống dính để nhấc nguyên khối.",
      steps: [
        "Dùng nhiệt kế điện tử kiểm tra hỗn hợp 120g bơ lạt và 50g bột cacao Hershey's khi đun cách thủy, giữ quanh 50–55°C.",
        "Đánh trứng và đường đến khi đường tan hoàn toàn và bề mặt hơi sánh sáng — đây là bí quyết tạo lớp mặt bóng nứt đặc trưng.",
        "Trộn nhẹ 85g bột mì đa dụng (túi nhỏ 100g vừa khít công thức) vào hỗn hợp cacao rồi đổ lên khay đã lót sẵn giấy nến nướng bánh.",
        "Nướng ở 175°C khoảng 24–26 phút; để nguội hoàn toàn trước khi nhấc hai đầu giấy nến cắt thành 9 miếng vuông gọn sắc."
      ]
    },
    {
      id: "post-banh-quy-bo",
      recipeGroupId: "recipe-banh-quy-bo",
      title: "Cẩm nang cân đo và bắt đui Bánh Quy Bơ Đan Mạch giòn tan sắc nét",
      category: "Công thức chuẩn vị",
      readTime: "40 phút thực hiện",
      diff: "Dễ",
      author: "Đen Ny · BakeMate Craft",
      publishedAt: "29/10/2026",
      image: "images/about-sharing-cakes.jpg",
      excerpt:
        "Chỉ cần cân điện tử chia chuẩn 1g, bơ lạt mềm đánh bông trắng ngà và bộ đui bắt kem Inox 304, bạn sẽ dễ dàng cho ra lò mẻ bánh quy hoa hồng giòn rụm.",
      steps: [
        "Cân chính xác 150g bơ lạt Anchor để mềm ở nhiệt độ phòng (không chảy nước), đánh bông cùng đường bột đến khi chuyển màu kem nhạt.",
        "Trộn 180g Bột mì số 8 đã rây mịn vào âu bơ theo kỹ thuật cắt bột để khối bột mềm dẻo nhưng không quá chảy.",
        "Lắp đui sao mở trong bộ 12 đui Inox vào túi bắt kem vân nhám chống trượt, cho bột vào nửa túi và bắt thành từng bông hoa lên khay lót giấy nến.",
        "Làm lạnh khay bánh 15 phút trước khi cho vào lò ở 170°C trong 15–18 phút giúp giữ vân bánh sắc nét không bị chảy dẹt."
      ]
    }
  ];

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeText(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .trim();
  }

  function formatPrice(value) {
    return typeof window.formatCurrency === "function"
      ? window.formatCurrency(value)
      : Number(value).toLocaleString("vi-VN") + " ₫";
  }

  function getComboBreakdown(recipeGroupId) {
    const combo =
      typeof window.getRecipeComboInfo === "function"
        ? window.getRecipeComboInfo(recipeGroupId)
        : null;

    if (!combo || !Array.isArray(combo.items)) {
      return { title: "Combo nguyên liệu", items: [], total: 0 };
    }

    let total = 0;
    const resolvedItems = combo.items.map((entry) => {
      const product = typeof window.getProduct === "function" ? window.getProduct(entry.productId) : null;
      const option =
        typeof window.getProductOption === "function"
          ? window.getProductOption(entry.productId, entry.optionIndex || 0)
          : null;
      const unitPrice = option ? Number(option.price) : product ? Number(product.price) : 0;
      const lineTotal = unitPrice * (entry.quantity || 1);
      total += lineTotal;
      return {
        productId: entry.productId,
        name: product ? product.name : `Sản phẩm #${entry.productId}`,
        optionLabel: option ? option.shortLabel : "",
        usage: entry.usage || "",
        unitPrice,
        lineTotal
      };
    });

    return {
      title: combo.title,
      servings: combo.servings || "1 công thức",
      items: resolvedItems,
      total
    };
  }

  let activeCategory = "all";

  function renderBlogList() {
    const grid = document.getElementById("blog-grid");
    const emptyEl = document.getElementById("blog-empty");
    const countEl = document.getElementById("blog-count");
    const searchInput = document.getElementById("blog-search");

    if (!grid) return;

    const keyword = normalizeText(searchInput ? searchInput.value : "");
    const filtered = BLOG_POSTS.filter((post) => {
      const matchCat = activeCategory === "all" || post.category === activeCategory;
      const matchKeyword =
        keyword === "" ||
        normalizeText(post.title).includes(keyword) ||
        normalizeText(post.excerpt).includes(keyword) ||
        normalizeText(post.category).includes(keyword);
      return matchCat && matchKeyword;
    });

    if (countEl) {
      countEl.textContent = `${filtered.length} bài viết`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = "";
      if (emptyEl) emptyEl.hidden = false;
      return;
    }

    if (emptyEl) emptyEl.hidden = true;

    grid.innerHTML = filtered
      .map((post) => {
        const combo = getComboBreakdown(post.recipeGroupId);
        return `
          <article class="blog-card" id="${escapeHtml(post.recipeGroupId)}">
            <div class="blog-card__media">
              <img
                src="${escapeHtml(post.image)}"
                alt="${escapeHtml(post.title)}"
                class="blog-card__img"
                loading="lazy"
                onerror="this.onerror=null;this.src='${FALLBACK_IMG}';"
              >
              <span class="blog-card__category">${escapeHtml(post.category)}</span>
            </div>
            <div class="blog-card__body">
              <div class="blog-card__meta">
                <span class="meta-inline">
                  <svg class="blog-meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  ${escapeHtml(post.readTime)}
                </span>
                <span>·</span>
                <span>Độ khó: ${escapeHtml(post.diff)}</span>
              </div>
              <h2 class="blog-card__title">${escapeHtml(post.title)}</h2>
              <p class="blog-card__excerpt">${escapeHtml(post.excerpt)}</p>
              <div class="blog-card__combo-preview">
                <span>Bộ nguyên liệu (${combo.items.length} món):</span>
                <strong>${escapeHtml(formatPrice(combo.total))}</strong>
              </div>
              <div class="blog-card__actions">
                <button type="button" class="btn btn--outline-dark js-open-blog-post" data-post-id="${escapeHtml(post.id)}">
                  Đọc hướng dẫn
                </button>
                <button type="button" class="btn btn--primary js-blog-add-combo" data-recipe-group-id="${escapeHtml(post.recipeGroupId)}">
                  + Thêm combo vào giỏ
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function openPostModal(post) {
    const modal = document.getElementById("blog-modal");
    const modalBody = document.getElementById("blog-modal-body");
    if (!modal || !modalBody || !post) return;

    const combo = getComboBreakdown(post.recipeGroupId);

    modalBody.innerHTML = `
      <div class="blog-modal__hero">
        <img
          src="${escapeHtml(post.image)}"
          alt="${escapeHtml(post.title)}"
          class="blog-modal__img"
          onerror="this.onerror=null;this.src='${FALLBACK_IMG}';"
        >
      </div>
      <div class="blog-modal__header">
        <span class="blog-modal__badge">${escapeHtml(post.category)}</span>
        <h2 class="blog-modal__title" id="blog-modal-title">${escapeHtml(post.title)}</h2>
        <p class="blog-modal__meta">${escapeHtml(post.author)} · ${escapeHtml(post.publishedAt)} · ${escapeHtml(post.readTime)}</p>
      </div>
      <p class="blog-modal__lead">${escapeHtml(post.excerpt)}</p>

      <div class="blog-modal__section">
        <h3>Các bước thực hiện chuẩn BakeMate</h3>
        <ol class="blog-modal__steps">
          ${post.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
        </ol>
      </div>

      <div class="blog-modal__combo-box">
        <div class="blog-modal__combo-head">
          <div>
            <span class="sub-badge">Giải pháp Recipe-to-Cart</span>
            <h3>${escapeHtml(combo.title)}</h3>
            <p>Khẩu phần gợi ý: ${escapeHtml(combo.servings)}</p>
          </div>
          <div class="blog-modal__combo-total">
            <span>Trọn bộ chỉ</span>
            <strong>${escapeHtml(formatPrice(combo.total))}</strong>
          </div>
        </div>

        <ul class="blog-modal__ingredient-list">
          ${combo.items
            .map(
              (item) => `
              <li>
                <div>
                  <a href="product-detail.html?id=${item.productId}">${escapeHtml(item.name)}</a>
                  ${item.optionLabel ? `<span class="ingredient-opt">(${escapeHtml(item.optionLabel)})</span>` : ""}
                  <small>${escapeHtml(item.usage)}</small>
                </div>
                <strong>${escapeHtml(formatPrice(item.lineTotal))}</strong>
              </li>
            `
            )
            .join("")}
        </ul>

        <div class="blog-modal__combo-actions">
          <button
            type="button"
            class="btn btn--primary js-blog-add-combo"
            data-recipe-group-id="${escapeHtml(post.recipeGroupId)}"
          >
            Thêm trọn bộ nguyên liệu vào giỏ
          </button>
          <a href="cart.html" class="btn btn--outline-dark">Đi tới giỏ hàng</a>
        </div>
      </div>
    `;

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    const closeBtn = document.getElementById("blog-modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function closePostModal() {
    const modal = document.getElementById("blog-modal");
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  function handleAddCombo(recipeGroupId) {
    if (typeof window.addRecipeComboToCart !== "function") {
      return;
    }
    const result = window.addRecipeComboToCart(recipeGroupId);
    if (typeof window.showCartToast === "function") {
      window.showCartToast(result.message, {
        type: result.success ? "success" : "warning"
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".js-blog-filter");
    const searchInput = document.getElementById("blog-search");
    const resetBtn = document.getElementById("blog-reset-btn");
    const grid = document.getElementById("blog-grid");
    const modal = document.getElementById("blog-modal");
    const modalClose = document.getElementById("blog-modal-close");

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        activeCategory = btn.dataset.category || "all";
        filterButtons.forEach((b) => b.classList.toggle("active", b === btn));
        renderBlogList();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", renderBlogList);
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        activeCategory = "all";
        if (searchInput) searchInput.value = "";
        filterButtons.forEach((b) => b.classList.toggle("active", b.dataset.category === "all"));
        renderBlogList();
      });
    }

    if (grid) {
      grid.addEventListener("click", function (event) {
        const openBtn = event.target.closest(".js-open-blog-post");
        if (openBtn) {
          const targetPost = BLOG_POSTS.find((p) => p.id === openBtn.dataset.postId);
          if (targetPost) openPostModal(targetPost);
          return;
        }

        const comboBtn = event.target.closest(".js-blog-add-combo");
        if (comboBtn) {
          handleAddCombo(comboBtn.dataset.recipeGroupId);
        }
      });
    }

    if (modal) {
      modal.addEventListener("click", function (event) {
        if (event.target === modal) {
          closePostModal();
          return;
        }
        const comboBtn = event.target.closest(".js-blog-add-combo");
        if (comboBtn) {
          handleAddCombo(comboBtn.dataset.recipeGroupId);
        }
      });
    }

    if (modalClose) {
      modalClose.addEventListener("click", closePostModal);
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closePostModal();
      }
    });

    renderBlogList();

    // Nếu điều hướng từ product-detail.html#recipe-... thì mở sẵn bài viết tương ứng
    const hash = window.location.hash.replace(/^#/, "").trim();
    if (hash) {
      const matched = BLOG_POSTS.find((p) => p.recipeGroupId === hash || p.id === hash);
      if (matched) {
        openPostModal(matched);
      }
    }
  });
})();
