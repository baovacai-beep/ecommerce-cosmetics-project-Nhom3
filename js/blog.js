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
    const detailHref = `blog-detail.html?id=${encodeURIComponent(post.id)}`;
    return `
      <article class="blog-card" id="${escapeHtml(post.recipeGroupId)}">
        <a href="${detailHref}" class="blog-card__media" aria-label="${escapeHtml(post.title)}">
          <img
            src="${escapeHtml(post.image)}"
            alt="${escapeHtml(post.title)}"
            class="blog-card__img"
            loading="lazy"
            onerror="this.onerror=null;this.src='${FALLBACK_IMG}';"
          >
          <span class="blog-card__category">${escapeHtml(post.category)}</span>
        </a>
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
          <h2 class="blog-card__title"><a href="${detailHref}">${escapeHtml(post.title)}</a></h2>
          <p class="blog-card__excerpt">${escapeHtml(post.excerpt)}</p>
          <div class="blog-card__bottom">
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
    const rich = post.content && typeof post.content === "object" ? post.content : null;

    const richHtml = rich
      ? `
        ${
          rich.intro_title || (Array.isArray(rich.intro_paragraphs) && rich.intro_paragraphs.length)
            ? `
              <section class="blog-modal__section blog-editorial-block">
                ${rich.intro_title ? `<h2>${escapeHtml(rich.intro_title)}</h2>` : ""}
                ${(rich.intro_paragraphs || []).map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
              </section>
            `
            : ""
        }
        ${
          Array.isArray(rich.prep_groups) && rich.prep_groups.length
            ? `
              <section class="blog-modal__section blog-editorial-block" style="background:#fdf8f1;border:1px solid #efe3d2;border-radius:12px;padding:16px 18px;">
                <h2>Chuẩn bị nguyên liệu &amp; dụng cụ</h2>
                ${rich.prep_groups
                  .map(
                    (grp) => `
                      <div style="margin-top:10px;">
                        <strong style="color:#4a2e19;display:block;margin-bottom:4px;">${escapeHtml(grp.label || "")}:</strong>
                        <ul style="margin:0;padding-left:20px;line-height:1.65;">
                          ${(grp.items || []).map((it) => `<li>${escapeHtml(it)}</li>`).join("")}
                        </ul>
                      </div>
                    `
                  )
                  .join("")}
              </section>
            `
            : ""
        }
        ${
          Array.isArray(rich.step_blocks) && rich.step_blocks.length
            ? `
              <section class="blog-modal__section blog-editorial-block">
                ${rich.step_blocks
                  .map(
                    (blk) => `
                      <div style="margin-bottom:20px;">
                        <h3 style="color:#70452b;font-size:18px;margin:0 0 8px;">${escapeHtml(blk.title || "")}</h3>
                        ${(blk.paragraphs || []).map((sp) => `<p style="margin:0 0 8px;line-height:1.7;">${escapeHtml(sp)}</p>`).join("")}
                        ${
                          blk.video_article_url
                            ? `<p style="margin:8px 0 0;"><a href="${escapeHtml(blk.video_article_url)}" target="_blank" rel="noopener noreferrer" class="btn btn--outline-dark">🎬 ${escapeHtml(blk.video_label || "Xem video hướng dẫn thực hành")} &nearr;</a></p>`
                            : ""
                        }
                        ${
                          blk.image
                            ? `
                              <figure style="margin:12px 0 6px;">
                                <img src="${escapeHtml(blk.image)}" alt="${escapeHtml(blk.caption || post.title)}" loading="lazy" style="width:100%;max-height:360px;object-fit:cover;border-radius:10px;" onerror="this.onerror=null;this.src='${FALLBACK_IMG}';">
                                ${blk.caption ? `<figcaption class="blog-figcaption">${escapeHtml(blk.caption)}</figcaption>` : ""}
                              </figure>
                            `
                            : ""
                        }
                      </div>
                    `
                  )
                  .join("")}
              </section>
            `
            : ""
        }
        ${
          Array.isArray(rich.mistakes) && rich.mistakes.length
            ? `
              <section class="blog-modal__section blog-mistakes-box">
                <h2>${escapeHtml(rich.mistakes_title || "Những lỗi thường gặp")}</h2>
                <ul style="margin:0;padding-left:20px;line-height:1.7;">
                  ${rich.mistakes
                    .map((mk) => `<li style="margin-bottom:6px;"><strong>${escapeHtml(mk.label || "")}:</strong> ${escapeHtml(mk.desc || "")}</li>`)
                    .join("")}
                </ul>
              </section>
            `
            : ""
        }
        ${
          Array.isArray(rich.tips) && rich.tips.length
            ? `
              <section class="blog-modal__section blog-editorial-block" style="background:#fffaf2;border-left:4px solid #c88b52;padding:14px 16px;border-radius:8px;">
                <h2>Mẹo nhỏ từ BakeMate</h2>
                ${rich.tips.map((tp) => `<p style="margin:0 0 6px;">${escapeHtml(tp)}</p>`).join("")}
              </section>
            `
            : ""
        }
        ${
          Array.isArray(rich.conclusion) && rich.conclusion.length
            ? `
              <section class="blog-modal__section blog-editorial-block">
                <h2>Lời kết</h2>
                ${rich.conclusion.map((cp) => `<p style="margin:0 0 8px;">${escapeHtml(cp)}</p>`).join("")}
              </section>
            `
            : ""
        }
      `
      : `
        <section class="blog-modal__section">
          <h2>Các bước thực hiện chuẩn BakeMate</h2>
          <ol class="blog-modal__steps">
            ${(post.steps || []).map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
          </ol>
        </section>

        ${
          Array.isArray(post.gallery) && post.gallery.length > 1
            ? `
              <section class="blog-modal__section">
                <h2>Hình ảnh minh họa thực tế</h2>
                <div class="blog-gallery-grid">
                  ${post.gallery
                    .map(
                      (imgPath) =>
                        `<img src="${escapeHtml(imgPath)}" alt="${escapeHtml(post.title)}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMG}';">`
                    )
                    .join("")}
                </div>
              </section>
            `
            : ""
        }
      `;

    detailRoot.innerHTML = `
      <article class="blog-article-container">
        <div class="blog-modal__hero">
          <img
            src="${escapeHtml(post.image)}"
            alt="${escapeHtml(post.title)}"
            class="blog-modal__img"
            onerror="this.onerror=null;this.src='${FALLBACK_IMG}';"
          >
          ${rich && rich.hero_caption ? `<p class="blog-figcaption">${escapeHtml(rich.hero_caption)}</p>` : ""}
        </div>

        <div class="blog-modal__header">
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px;">
            <span class="blog-modal__badge">${escapeHtml(post.category)}</span>
            ${post.displayMode ? `<span class="blog-format-badge" style="position:static;">${escapeHtml(post.displayMode)}</span>` : ""}
          </div>
          <h1 class="blog-modal__title">${escapeHtml(post.title)}</h1>
          <p class="blog-modal__meta">${escapeHtml(post.author)} · ${escapeHtml(post.publishedAt)} · ${escapeHtml(post.readTime)} · Độ khó: ${escapeHtml(post.diff)}${rich && rich.yield_note ? ` · Khẩu phần: ${escapeHtml(rich.yield_note)}` : ""}</p>
        </div>

        <p class="blog-modal__lead">${escapeHtml(post.excerpt)}</p>

        ${
          post.videoUrl
            ? `
              <section class="blog-video-box" aria-label="Video hướng dẫn thực hành">
                <strong style="display:block;color:#70452b;margin-bottom:10px;font-size:15px;">
                  🎬 ${escapeHtml(post.videoTitle || "Video hướng dẫn thực hành")}
                </strong>
                <div class="blog-video-embed">
                  <iframe
                    src="${escapeHtml(post.videoUrl)}"
                    title="${escapeHtml(post.videoTitle || post.title)}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    loading="lazy"
                  ></iframe>
                </div>
                <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;align-items:center;">
                  <a href="${escapeHtml(String(post.videoUrl).replace("/embed/", "/watch?v="))}" target="_blank" rel="noopener noreferrer" class="btn btn--outline-dark">
                    Mở video trên YouTube (King Arthur Baking) &nearr;
                  </a>
                  ${
                    post.id === "post-banh-quy-bo"
                      ? `<a href="product-detail.html?id=7" class="btn btn--primary">Xem Cân điện tử nhà bếp tại Shop &rarr;</a>`
                      : ""
                  }
                </div>
              </section>
            `
            : ""
        }

        ${
          post.id === "post-phan-biet-bot-mi"
            ? `
              <section style="margin:18px 0;">
                <h2 style="color:#70452b;font-size:19px;margin-bottom:8px;">Bảng so sánh nhanh 3 loại bột mì tại BakeMate</h2>
                <table class="blog-compare-table">
                  <thead>
                    <tr>
                      <th>Loại bột</th>
                      <th>Hàm lượng Protein</th>
                      <th>Món bánh phù hợp</th>
                      <th>Sản phẩm Shop</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Bột mì số 8 (Cake Flour)</strong></td>
                      <td>8% – 9%</td>
                      <td>Bông lan, Chiffon, Cupcake, Cookies</td>
                      <td><a href="product-detail.html?id=1" style="font-weight:700;color:#8b1e24;">Bột mì Baker's Choice số 8 &rarr;</a></td>
                    </tr>
                    <tr>
                      <td><strong>Bột mì số 11 (Bread Flour)</strong></td>
                      <td>11.5% – 13%</td>
                      <td>Bánh mì hoa cúc, Baguette, Pizza</td>
                      <td><a href="product-detail.html?id=2" style="font-weight:700;color:#8b1e24;">Bột mì Baker's Choice số 11 &rarr;</a></td>
                    </tr>
                    <tr>
                      <td><strong>Bột mì đa dụng (All-Purpose)</strong></td>
                      <td>9.5% – 11.5%</td>
                      <td>Muffin, Brownie, Pancake</td>
                      <td><a href="product-detail.html?id=3" style="font-weight:700;color:#8b1e24;">Bột mì đa dụng Meizan &rarr;</a></td>
                    </tr>
                  </tbody>
                </table>
              </section>
            `
            : ""
        }

        ${richHtml}

        <section class="blog-modal__combo-box" aria-label="Combo nguyên liệu Recipe-to-Cart">
          <div class="blog-modal__combo-head">
            <div>
              <span class="sub-badge">Chuẩn bị nguyên liệu cùng BakeMate</span>
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
            <a href="recipe-detail.html?id=${encodeURIComponent(post.recipeGroupId)}" class="btn btn--outline-dark blog-modal__combo-btn">
              Điều chỉnh khẩu phần
            </a>
            <button
              type="button"
              class="btn btn--primary js-blog-add-combo blog-modal__combo-btn"
              data-recipe-group-id="${escapeHtml(post.recipeGroupId)}"
            >
              Thêm combo vào giỏ
            </button>
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
      let related = [];
      if (rich && Array.isArray(rich.related_slugs) && rich.related_slugs.length > 0) {
        const byId = new Map(posts.map((p) => [p.id, p]));
        related = rich.related_slugs
          .map((slug) => byId.get(slug))
          .filter((p) => p && p.id !== post.id);
      }
      if (related.length < 3) {
        const seenIds = new Set(related.map((p) => p.id));
        const sameCategory = posts.filter((p) => p.id !== post.id && !seenIds.has(p.id) && p.category === post.category);
        const others = posts.filter((p) => p.id !== post.id && !seenIds.has(p.id) && p.category !== post.category);
        related = [...related, ...sameCategory, ...others];
      }
      related = related.slice(0, 3);
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
