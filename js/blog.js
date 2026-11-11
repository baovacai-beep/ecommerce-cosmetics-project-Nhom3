/*
 * =====================================================
 * BAKEMATE - TRANG BLOG CÔNG THỨC & KIẾN THỨC LÀM BÁNH
 * Tệp: js/blog.js (Hỗ trợ blog.html & blog-detail.html)
 * =====================================================
 */

(function () {
  const FALLBACK_IMG = window.FALLBACK_PRODUCT_IMAGE || "images/logo.jpg";

  function getPosts() {
    return Array.isArray(window.BLOG_POSTS) ? window.BLOG_POSTS : [];
  }

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
      .replace(/Đ/g, "d")
      .trim();
  }

  function formatPrice(value) {
    return typeof window.formatCurrency === "function"
      ? window.formatCurrency(value)
      : Number(value).toLocaleString("vi-VN") + " ₫";
  }

  /**
   * Tô đậm phần từ khóa khớp trong tiêu đề bài viết (an toàn XSS).
   */
  function highlightMatch(originalText, rawQuery) {
    const safeText = String(originalText || "");
    const cleanQuery = normalizeText(rawQuery);
    if (!cleanQuery) return escapeHtml(safeText);

    // Tạo mảng ánh xạ từ vị trí ký tự đã chuẩn hóa về chỉ số ký tự gốc
    const normChars = [];
    const indexMap = [];
    for (let i = 0; i < safeText.length; i += 1) {
      const ch = safeText[i]
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d");
      for (let j = 0; j < ch.length; j += 1) {
        normChars.push(ch[j]);
        indexMap.push(i);
      }
    }

    const normJoined = normChars.join("");
    const matchStartNorm = normJoined.indexOf(cleanQuery);
    if (matchStartNorm === -1) {
      return escapeHtml(safeText);
    }

    const matchEndNorm = matchStartNorm + cleanQuery.length - 1;
    const origStart = indexMap[matchStartNorm];
    const origEnd = indexMap[matchEndNorm] + 1;

    return (
      escapeHtml(safeText.slice(0, origStart)) +
      "<strong>" +
      escapeHtml(safeText.slice(origStart, origEnd)) +
      "</strong>" +
      escapeHtml(safeText.slice(origEnd))
    );
  }

  function getComboBreakdown(recipeGroupId) {
    const combo =
      typeof window.getRecipeComboInfo === "function"
        ? window.getRecipeComboInfo(recipeGroupId)
        : null;

    if (!combo || !Array.isArray(combo.items)) {
      return { title: "Combo nguyên liệu", servings: "1 công thức", items: [], total: 0 };
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

  function buildBlogCardHtml(post) {
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
            <a href="blog-detail.html?id=${encodeURIComponent(post.id)}" class="btn btn--outline-dark">
              Đọc hướng dẫn
            </a>
            <button type="button" class="btn btn--primary js-blog-add-combo" data-recipe-group-id="${escapeHtml(post.recipeGroupId)}">
              + Thêm combo vào giỏ
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function handleAddCombo(recipeGroupId) {
    if (typeof window.addRecipeComboToCart !== "function") {
      return;
    }
    const result = window.addRecipeComboToCart(recipeGroupId);
    if (typeof window.showCartToast === "function") {
      window.showCartToast(result.message, {
        type: result.success ? "success" : "warning",
        showCartLink: Boolean(result.success)
      });
    }
  }

  function matchPostByQuery(post, normKeyword) {
    if (!normKeyword) return true;
    const haystacks = [
      post.title,
      post.category,
      post.excerpt,
      ...(Array.isArray(post.keywords) ? post.keywords : [])
    ];
    return haystacks.some((text) => normalizeText(text).includes(normKeyword));
  }

  /* =====================================================
   * TRANG DANH SÁCH BLOG (blog.html)
   * ===================================================== */
  let activeCategory = "all";

  function renderBlogList() {
    const grid = document.getElementById("blog-grid");
    const emptyEl = document.getElementById("blog-empty");
    const countEl = document.getElementById("blog-count");
    const searchInput = document.getElementById("blog-search");

    if (!grid) return;

    const posts = getPosts();
    const keyword = normalizeText(searchInput ? searchInput.value : "");
    const filtered = posts.filter((post) => {
      const matchCat = activeCategory === "all" || post.category === activeCategory;
      return matchCat && matchPostByQuery(post, keyword);
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
    grid.innerHTML = filtered.map(buildBlogCardHtml).join("");
  }

  function renderSearchDropdown(rawValue) {
    const dropdown = document.getElementById("blog-search-dropdown");
    if (!dropdown) return;

    const norm = normalizeText(rawValue);
    if (!norm) {
      dropdown.hidden = true;
      dropdown.innerHTML = "";
      return;
    }

    const matched = getPosts().filter((post) => matchPostByQuery(post, norm)).slice(0, 6);

    if (matched.length === 0) {
      dropdown.innerHTML = `
        <div class="blog-search-suggest-empty" role="option" aria-selected="false">
          Rất tiếc, không tìm thấy kết quả phù hợp.
        </div>
      `;
      dropdown.hidden = false;
      return;
    }

    dropdown.innerHTML = matched
      .map(
        (post) => `
          <button
            type="button"
            class="blog-search-suggest-item js-blog-suggest-pick"
            role="option"
            data-post-id="${escapeHtml(post.id)}"
          >
            <img
              src="${escapeHtml(post.image)}"
              alt=""
              style="width:36px;height:36px;border-radius:6px;object-fit:cover;flex-shrink:0;"
              onerror="this.onerror=null;this.src='${FALLBACK_IMG}';"
            >
            <span style="flex:1;min-width:0;">
              <span style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                ${highlightMatch(post.title, rawValue)}
              </span>
              <small style="display:block;font-size:11.5px;color:#8c6a52;">
                ${escapeHtml(post.category)} · ${escapeHtml(post.readTime)}
              </small>
            </span>
          </button>
        `
      )
      .join("");
    dropdown.hidden = false;
  }

  function initBlogListPage() {
    const grid = document.getElementById("blog-grid");
    if (!grid) return;

    const filterButtons = document.querySelectorAll(".js-blog-filter");
    const searchForm = document.getElementById("blog-search-form");
    const searchInput = document.getElementById("blog-search");
    const dropdown = document.getElementById("blog-search-dropdown");
    const resetBtn = document.getElementById("blog-reset-btn");

    const urlParams = new URLSearchParams(window.location.search);
    const paramCat = (urlParams.get("category") || "").trim();
    const paramQ = (urlParams.get("q") || "").trim();
    if (paramCat) {
      filterButtons.forEach((b) => {
        if ((b.dataset.category || "") === paramCat) {
          activeCategory = paramCat;
        }
      });
      filterButtons.forEach((b) => b.classList.toggle("active", (b.dataset.category || "all") === activeCategory));
    }
    if (paramQ && searchInput) {
      searchInput.value = paramQ;
    }

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        activeCategory = btn.dataset.category || "all";
        filterButtons.forEach((b) => b.classList.toggle("active", b === btn));
        renderBlogList();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        renderSearchDropdown(searchInput.value);
        renderBlogList();
      });

      searchInput.addEventListener("focus", function () {
        if (normalizeText(searchInput.value)) {
          renderSearchDropdown(searchInput.value);
        }
      });
    }

    if (searchForm) {
      searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        renderBlogList();
        if (dropdown) dropdown.hidden = true;
      });
    }

    if (dropdown) {
      dropdown.addEventListener("click", function (event) {
        const pick = event.target.closest(".js-blog-suggest-pick");
        if (!pick) return;
        const postId = pick.dataset.postId;
        if (postId) {
          window.location.href = `blog-detail.html?id=${encodeURIComponent(postId)}`;
        }
      });
    }

    document.addEventListener("click", function (event) {
      if (searchForm && dropdown && !searchForm.contains(event.target)) {
        dropdown.hidden = true;
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && dropdown) {
        dropdown.hidden = true;
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        activeCategory = "all";
        if (searchInput) searchInput.value = "";
        if (dropdown) dropdown.hidden = true;
        filterButtons.forEach((b) => b.classList.toggle("active", b.dataset.category === "all"));
        renderBlogList();
      });
    }

    grid.addEventListener("click", function (event) {
      const comboBtn = event.target.closest(".js-blog-add-combo");
      if (comboBtn) {
        handleAddCombo(comboBtn.dataset.recipeGroupId);
      }
    });

    renderBlogList();

    // Hỗ trợ neo hash #recipe-... cũ nếu có liên kết nội bộ trỏ tới
    const hash = window.location.hash.replace(/^#/, "").trim();
    if (hash) {
      const targetEl = document.getElementById(hash);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  /* =====================================================
   * TRANG CHI TIẾT BÀI VIẾT BLOG (blog-detail.html)
   * ===================================================== */
  function initBlogDetailPage() {
    const detailRoot = document.getElementById("blog-detail-root");
    if (!detailRoot) return;

    const posts = getPosts();
    const params = new URLSearchParams(window.location.search);
    const idParam = (params.get("id") || "").trim();

    let post =
      typeof window.getBlogPostById === "function" ? window.getBlogPostById(idParam) : null;
    if (!post && idParam) {
      post = posts.find((p) => p.recipeGroupId === idParam || p.id === idParam) || null;
    }

    const breadcrumbCurrent = document.getElementById("blog-breadcrumb-current");
    const relatedGrid = document.getElementById("blog-related-grid");

    if (!post) {
      document.title = "Không tìm thấy bài viết | Blog BakeMate";
      if (breadcrumbCurrent) breadcrumbCurrent.textContent = "Không tìm thấy bài viết";
      detailRoot.innerHTML = `
        <article class="blog-article-container" style="text-align:center;">
          <h1 class="blog-modal__title">Rất tiếc, bài viết không tồn tại</h1>
          <p class="blog-modal__lead">Đường dẫn bài viết có thể đã thay đổi hoặc không còn khả dụng.</p>
          <a href="blog.html" class="btn btn--primary">Quay lại trang Blog</a>
        </article>
      `;
      if (relatedGrid) {
        relatedGrid.innerHTML = posts.slice(0, 3).map(buildBlogCardHtml).join("");
      }
      return;
    }

    document.title = `${post.title} | Blog BakeMate`;
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = post.title;

    const combo = getComboBreakdown(post.recipeGroupId);

    detailRoot.innerHTML = `
      <article class="blog-article-container">
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
          <h1 class="blog-modal__title">${escapeHtml(post.title)}</h1>
          <p class="blog-modal__meta">${escapeHtml(post.author)} · ${escapeHtml(post.publishedAt)} · ${escapeHtml(post.readTime)} · Độ khó: ${escapeHtml(post.diff)}</p>
        </div>

        <p class="blog-modal__lead">${escapeHtml(post.excerpt)}</p>

        <section class="blog-modal__section">
          <h2>Các bước thực hiện chuẩn BakeMate</h2>
          <ol class="blog-modal__steps">
            ${(post.steps || []).map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
          </ol>
        </section>

        <section class="blog-modal__combo-box" aria-label="Combo nguyên liệu Recipe-to-Cart">
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
              + Thêm trọn bộ nguyên liệu vào giỏ
            </button>
            <a href="recipe-detail.html?id=${encodeURIComponent(post.recipeGroupId)}" class="btn btn--outline-dark">
              Quy đổi khẩu phần trong Công thức &rarr;
            </a>
            <a href="cart.html" class="btn btn--outline-dark">Đi tới giỏ hàng</a>
          </div>
        </section>
      </article>
    `;

    detailRoot.addEventListener("click", function (event) {
      const comboBtn = event.target.closest(".js-blog-add-combo");
      if (comboBtn) {
        handleAddCombo(comboBtn.dataset.recipeGroupId);
      }
    });

    if (relatedGrid) {
      const sameCategory = posts.filter((p) => p.id !== post.id && p.category === post.category);
      const others = posts.filter((p) => p.id !== post.id && p.category !== post.category);
      const related = [...sameCategory, ...others].slice(0, 3);
      relatedGrid.innerHTML = related.map(buildBlogCardHtml).join("");
      relatedGrid.addEventListener("click", function (event) {
        const comboBtn = event.target.closest(".js-blog-add-combo");
        if (comboBtn) {
          handleAddCombo(comboBtn.dataset.recipeGroupId);
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initBlogListPage();
    initBlogDetailPage();
  });
})();
