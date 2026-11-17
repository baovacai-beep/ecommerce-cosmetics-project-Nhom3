<?php
declare(strict_types=1);

$selectedCats = is_array($filters['category'] ?? null) ? $filters['category'] : (empty($filters['category']) ? [] : [$filters['category']]);
$selectedSubs = is_array($filters['sub'] ?? null) ? $filters['sub'] : (empty($filters['sub']) ? [] : [$filters['sub']]);
$selectedBrands = is_array($filters['brand'] ?? null) ? $filters['brand'] : (empty($filters['brand']) ? [] : [$filters['brand']]);
$selectedStocks = is_array($filters['stock'] ?? null) ? $filters['stock'] : [];
$minBound = 0;
$maxBound = max(150000, (int) ($filterMeta['max_price'] ?? 150000));
$curMin = is_numeric($filters['min_price'] ?? '') ? (int) $filters['min_price'] : $minBound;
$curMax = is_numeric($filters['max_price'] ?? '') ? (int) $filters['max_price'] : $maxBound;

$subByCat = [];
foreach ($filterMeta['subcategories'] as $sc) {
    $subByCat[$sc['category_name']][] = $sc['name'];
}
?>
<main class="page-container">
  <nav class="breadcrumb" aria-label="Đường dẫn điều hướng">
    <ul class="breadcrumb__list">
      <li class="breadcrumb__item"><a href="<?= App::e(App::url('')) ?>">Trang chủ</a></li>
      <li class="breadcrumb__separator">/</li>
      <li class="breadcrumb__item active">Sản phẩm</li>
    </ul>
  </nav>

  <div class="products-layout" id="san-pham-noi-bat">
    <!-- BỘ LỌC BÊN TRÁI (SIDEBAR) -->
    <aside class="products-sidebar is-mobile-hidden" id="products-sidebar" aria-label="Bộ lọc sản phẩm">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <h2 class="products-sidebar__title" style="margin:0;">Bộ lọc sản phẩm</h2>
        <button type="button" class="products-sidebar__reset-link" id="btn-reset-filters">Đặt lại</button>
      </div>

      <div style="margin-bottom:14px;">
        <label for="catalog-search-input" class="visually-hidden">Tìm kiếm theo tên</label>
        <input id="catalog-search-input" type="search" class="filter-price-input" style="width:100%;" placeholder="Tìm bột mì, bơ, khuôn..." value="<?= App::e($filters['q'] ?? '') ?>">
      </div>

      <?php foreach ($filterMeta['categories'] as $cat):
        $cname = (string) $cat['name'];
        $subs = $subByCat[$cname] ?? [];
        $hasActiveSub = count(array_intersect($selectedSubs, $subs)) > 0;
        $isExpanded = in_array($cname, $selectedCats, true) || $hasActiveSub || ($cname === 'Nguyên liệu' && empty($selectedCats) && empty($selectedSubs));
      ?>
        <div class="filter-group <?= $isExpanded ? '' : 'is-collapsed' ?>">
          <button type="button" class="filter-group__head js-filter-acc-toggle" aria-expanded="<?= $isExpanded ? 'true' : 'false' ?>">
            <span><?= App::e($cname) ?></span>
            <span class="js-acc-sign"><?= $isExpanded ? '−' : '+' ?></span>
          </button>
          <div class="filter-group__body">
            <label class="filter-check">
              <input type="checkbox" class="js-filter-cat" value="<?= App::e($cname) ?>" <?= in_array($cname, $selectedCats, true) ? 'checked' : '' ?>>
              <span>Tất cả <?= App::e($cname) ?></span>
            </label>
            <?php foreach ($subs as $subName): ?>
              <label class="filter-check">
                <input type="checkbox" class="js-filter-sub" value="<?= App::e($subName) ?>" <?= in_array($subName, $selectedSubs, true) ? 'checked' : '' ?>>
                <span><?= App::e($subName) ?></span>
              </label>
            <?php endforeach; ?>
          </div>
        </div>
      <?php endforeach; ?>

      <!-- Khoảng giá (Dual-handle Slider khớp CSS style.css) -->
      <div class="filter-group">
        <button type="button" class="filter-group__head js-filter-acc-toggle" aria-expanded="true">
          <span>Khoảng giá</span>
          <span class="js-acc-sign">−</span>
        </button>
        <div class="filter-group__body">
          <div class="price-slider-readout" aria-live="polite">
            <span id="price-readout-min"><?= App::e(App::formatCurrency($curMin)) ?></span>
            <span>–</span>
            <span id="price-readout-max"><?= App::e(App::formatCurrency($curMax)) ?></span>
          </div>
          <div class="price-slider-track-wrap">
            <div class="price-slider-rail" aria-hidden="true">
              <div class="price-slider-fill" id="price-slider-fill"></div>
            </div>
            <input type="range" id="price-slider-min" class="price-slider-input price-slider-input--min" min="0" max="<?= $maxBound ?>" step="1000" value="<?= $curMin ?>" aria-label="Kéo chọn giá tối thiểu">
            <input type="range" id="price-slider-max" class="price-slider-input price-slider-input--max" min="0" max="<?= $maxBound ?>" step="1000" value="<?= $curMax ?>" aria-label="Kéo chọn giá tối đa">
          </div>
          <div class="filter-price-inputs-grid">
            <div class="filter-price-field">
              <label for="price-min-input" class="filter-price-field__label">Tối thiểu (₫)</label>
              <input id="price-min-input" type="number" class="filter-price-input" min="0" max="<?= $maxBound ?>" step="1000" value="<?= $curMin ?>" aria-label="Giá tối thiểu">
            </div>
            <div class="filter-price-field">
              <label for="price-max-input" class="filter-price-field__label">Tối đa (₫)</label>
              <input id="price-max-input" type="number" class="filter-price-input" min="0" max="<?= $maxBound ?>" step="1000" value="<?= $curMax ?>" aria-label="Giá tối đa">
            </div>
          </div>
          <div class="price-quick-presets" role="group" aria-label="Chọn nhanh khoảng giá">
            <button type="button" class="price-preset-btn js-price-preset is-active" data-min="0" data-max="<?= $maxBound ?>">Tất cả</button>
            <button type="button" class="price-preset-btn js-price-preset" data-min="0" data-max="50000">Dưới 50K</button>
            <button type="button" class="price-preset-btn js-price-preset" data-min="50000" data-max="100000">50K – 100K</button>
            <button type="button" class="price-preset-btn js-price-preset" data-min="100000" data-max="<?= $maxBound ?>">Trên 100K</button>
          </div>
        </div>
      </div>

      <!-- Thương hiệu -->
      <div class="filter-group <?= !empty($selectedBrands) ? '' : 'is-collapsed' ?>">
        <button type="button" class="filter-group__head js-filter-acc-toggle" aria-expanded="<?= !empty($selectedBrands) ? 'true' : 'false' ?>">
          <span>Thương hiệu</span>
          <span class="js-acc-sign"><?= !empty($selectedBrands) ? '−' : '+' ?></span>
        </button>
        <div class="filter-group__body">
          <?php foreach ($filterMeta['brands'] as $br): ?>
            <label class="filter-check">
              <input type="checkbox" class="js-filter-brand" value="<?= App::e($br['name']) ?>" <?= in_array($br['name'], $selectedBrands, true) ? 'checked' : '' ?>>
              <span><?= App::e($br['name']) ?></span>
            </label>
          <?php endforeach; ?>
        </div>
      </div>

      <!-- Tình trạng sản phẩm -->
      <div class="filter-group">
        <button type="button" class="filter-group__head js-filter-acc-toggle" aria-expanded="true">
          <span>Tình trạng sản phẩm</span>
          <span class="js-acc-sign">−</span>
        </button>
        <div class="filter-group__body">
          <?php foreach ([
              'in_stock' => 'Còn hàng',
              'new' => 'Sản phẩm mới',
              'sale' => 'Đang giảm giá',
              'coming_soon' => 'Sắp có hàng',
          ] as $sk => $sl): ?>
            <label class="filter-check">
              <input type="checkbox" class="js-filter-stock" value="<?= $sk ?>" <?= in_array($sk, $selectedStocks, true) ? 'checked' : '' ?>>
              <span><?= App::e($sl) ?></span>
            </label>
          <?php endforeach; ?>
        </div>
      </div>
    </aside>

    <!-- CỘT PHẢI: HEADER SẮP XẾP + LƯỚI SẢN PHẨM -->
    <section aria-label="Danh sách sản phẩm">
      <div class="products-main-header">
        <div>
          <h1 class="products-main-header__title" id="products-page-heading">Tất cả sản phẩm</h1>
          <p id="product-count-label" class="products-main-header__sub" aria-live="polite">
            Hiển thị <strong><?= count($products) ?></strong> sản phẩm
          </p>
        </div>

        <div class="products-sort-wrap">
          <button type="button" class="btn btn--outline-dark mobile-filter-toggle js-mobile-filter-toggle">Bộ lọc</button>
          <label class="visually-hidden" for="catalog-sort-select">Sắp xếp sản phẩm</label>
          <select id="catalog-sort-select" class="products-sort-select">
            <option value="featured" <?= ($filters['sort'] ?? '') === 'featured' ? 'selected' : '' ?>>Sắp xếp: Mặc định</option>
            <option value="price-asc" <?= ($filters['sort'] ?? '') === 'price-asc' ? 'selected' : '' ?>>Giá: Thấp đến cao</option>
            <option value="price-desc" <?= ($filters['sort'] ?? '') === 'price-desc' ? 'selected' : '' ?>>Giá: Cao đến thấp</option>
            <option value="newest" <?= ($filters['sort'] ?? '') === 'newest' ? 'selected' : '' ?>>Sản phẩm mới trước</option>
            <option value="name-asc" <?= ($filters['sort'] ?? '') === 'name-asc' ? 'selected' : '' ?>>Tên: A - Z</option>
          </select>
        </div>
      </div>

      <div class="product-grid" id="catalog-product-grid">
        <?php if (empty($products)): ?>
          <div class="no-products-message" style="grid-column:1 / -1;">
            <strong>Không tìm thấy sản phẩm nào phù hợp</strong>
            <p>Hãy thử từ khóa khác, nới rộng khoảng giá hoặc nhấn "Đặt lại" để xem toàn bộ danh mục của BakeMate.</p>
          </div>
        <?php else: ?>
          <?php foreach ($products as $p): ?>
            <?php require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'partials' . DIRECTORY_SEPARATOR . 'product-card.php'; ?>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
    </section>
  </div>

  <?php if (!empty($recentProducts)): ?>
    <section class="recent-viewed-section" id="recent-viewed-section">
      <div class="home-section-head">
        <div>
          <h2 class="home-section-head__title">Sản phẩm đã xem gần đây</h2>
        </div>
        <button type="button" class="btn btn--outline btn--sm js-clear-recent">Xóa lịch sử</button>
      </div>
      <div class="recent-viewed-grid">
        <?php foreach ($recentProducts as $p): ?>
          <?php require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'partials' . DIRECTORY_SEPARATOR . 'product-card.php'; ?>
        <?php endforeach; ?>
      </div>
    </section>
  <?php endif; ?>
</main>

<script>
document.addEventListener("DOMContentLoaded", function () {
  const maxBound = <?= (int) $maxBound ?>;
  const minInput = document.getElementById("price-min-input");
  const maxInput = document.getElementById("price-max-input");
  const sliderMin = document.getElementById("price-slider-min");
  const sliderMax = document.getElementById("price-slider-max");
  const fill = document.getElementById("price-slider-fill");
  const readMin = document.getElementById("price-readout-min");
  const readMax = document.getElementById("price-readout-max");
  const searchInput = document.getElementById("catalog-search-input");
  const sortSelect = document.getElementById("catalog-sort-select");
  const grid = document.getElementById("catalog-product-grid");
  const countLabel = document.getElementById("product-count-label");
  const sidebar = document.getElementById("products-sidebar");

  document.querySelector(".js-mobile-filter-toggle")?.addEventListener("click", () => {
    sidebar?.classList.toggle("is-mobile-hidden");
  });

  document.querySelectorAll(".js-filter-acc-toggle").forEach((btn) => {
    btn.addEventListener("click", function () {
      const grp = btn.closest(".filter-group");
      if (!grp) return;
      const collapsed = grp.classList.toggle("is-collapsed");
      btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
      const sign = btn.querySelector(".js-acc-sign");
      if (sign) sign.textContent = collapsed ? "+" : "−";
    });
  });

  function updateSliderVisual() {
    if (!sliderMin || !sliderMax || !fill) return;
    const minV = Number(sliderMin.value);
    const maxV = Number(sliderMax.value);
    const leftPct = (minV / maxBound) * 100;
    const rightPct = 100 - (maxV / maxBound) * 100;
    fill.style.left = leftPct + "%";
    fill.style.right = rightPct + "%";
    if (readMin) readMin.textContent = window.BakeApp.formatPrice(minV);
    if (readMax) readMax.textContent = window.BakeApp.formatPrice(maxV);
  }

  let debounceTimer = null;
  function scheduleFilter() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runAjaxFilter, 180);
  }

  async function runAjaxFilter() {
    const params = {
      q: searchInput ? searchInput.value.trim() : "",
      sort: sortSelect ? sortSelect.value : "featured",
      min_price: minInput ? minInput.value : 0,
      max_price: maxInput ? maxInput.value : maxBound,
      category: Array.from(document.querySelectorAll(".js-filter-cat:checked")).map((c) => c.value),
      sub: Array.from(document.querySelectorAll(".js-filter-sub:checked")).map((c) => c.value),
      brand: Array.from(document.querySelectorAll(".js-filter-brand:checked")).map((c) => c.value),
      stock: Array.from(document.querySelectorAll(".js-filter-stock:checked")).map((c) => c.value)
    };

    try {
      const res = await fetch(window.BakeApp.apiUrl("product", "ajaxFilter", params));
      const json = await res.json();
      const items = (json.data && json.data.products) || [];
      const wishIds = (json.data && json.data.wishlist_ids) || [];
      if (countLabel) countLabel.innerHTML = "Hiển thị <strong>" + items.length + "</strong> sản phẩm";
      if (!grid) return;

      if (!items.length) {
        grid.innerHTML = '<div class="no-products-message" style="grid-column:1 / -1;"><strong>Không tìm thấy sản phẩm nào phù hợp</strong><p>Hãy thử từ khóa khác hoặc nới rộng khoảng giá.</p></div>';
        return;
      }

      const esc = window.BakeApp.escapeHtml;
      const fmt = window.BakeApp.formatPrice;
      const cfg = window.BAKEMATE_PHP;

      grid.innerHTML = items.map((p) => {
        const pid = Number(p.id);
        const price = Number(p.default_price || 0);
        const oldPrice = Number(p.default_old_price || price);
        const imgUrl = esc(cfg.baseUrl + "public/" + (p.primary_image || "images/logo.jpg"));
        const detailUrl = esc(window.BakeApp.apiUrl("product", "detail", { id: pid }));
        const isWish = wishIds.includes(pid);
        let tagHtml = "";
        if (Number(p.is_perishable) === 1) tagHtml = '<span class="product-card__tag product-card__tag--cold">Tươi lạnh</span>';
        else if (p.stock_status === "coming_soon") tagHtml = '<span class="product-card__tag product-card__tag--soon">Sắp mở bán</span>';
        else if (Number(p.is_new) === 1) tagHtml = '<span class="product-card__tag product-card__tag--new">Mới</span>';
        else if (oldPrice > price) tagHtml = `<span class="product-card__tag product-card__tag--sale">-${Math.round(((oldPrice - price) / Math.max(1, oldPrice)) * 100)}%</span>`;

        const actionBtn = (p.stock_status === "coming_soon" || p.stock_status === "out_of_stock")
          ? `<button type="button" class="btn btn--outline-dark btn--full" disabled>${p.stock_status === "coming_soon" ? "Sắp có hàng" : "Tạm hết hàng"}</button>`
          : `<button type="button" class="btn btn--primary btn--full js-quick-add-cart" data-product-id="${pid}" data-option-index="0">Thêm vào giỏ</button>`;

        return `
          <article class="product-card" data-product-id="${pid}">
            <a href="${detailUrl}" class="product-card__image-link" style="position:relative;">
              <div class="product-card__image-wrap">
                <img src="${imgUrl}" alt="${esc(p.name)}" class="product-card__image" loading="lazy">
              </div>
              ${tagHtml}
            </a>
            <div class="product-card__content">
              <div class="product-card__top-meta" style="margin-top:0;margin-bottom:6px;">
                <span class="product-card__category" style="margin-bottom:0;">${esc(p.category_name)}</span>
                <button type="button" class="wishlist-heart-btn js-wishlist-toggle ${isWish ? "is-active" : ""}" data-product-id="${pid}" aria-label="Yêu thích">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWish ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
              </div>
              <h3 class="product-card__title"><a href="${detailUrl}" style="color:inherit;text-decoration:none;">${esc(p.name)}</a></h3>
              <p class="product-card__pack" style="margin:0 0 8px;font-size:12.5px;color:#7c5c46;">${esc(p.packaging_label || p.default_variant_label || "")}</p>
              <div class="product-card__price-row">
                <span class="product-card__price">${fmt(price)}</span>
                ${oldPrice > price ? `<span class="product-card__old-price">${fmt(oldPrice)}</span>` : ""}
              </div>
              <div class="product-card__actions" style="margin-top:auto;display:grid;gap:8px;padding-top:10px;">
                ${actionBtn}
                <a href="${detailUrl}" class="btn btn--outline-dark btn--full">Xem chi tiết</a>
              </div>
            </div>
          </article>
        `;
      }).join("");
    } catch (e) {
      window.BakeApp.showToast("Không thể tải bộ lọc sản phẩm.", "error");
    }
  }

  function syncFromSliders(changedMin) {
    let minV = Number(sliderMin.value);
    let maxV = Number(sliderMax.value);
    if (minV > maxV) {
      if (changedMin) { maxV = minV; sliderMax.value = maxV; }
      else { minV = maxV; sliderMin.value = minV; }
    }
    minInput.value = minV;
    maxInput.value = maxV;
    updateSliderVisual();
    scheduleFilter();
  }

  if (sliderMin) sliderMin.addEventListener("input", () => syncFromSliders(true));
  if (sliderMax) sliderMax.addEventListener("input", () => syncFromSliders(false));
  if (minInput) minInput.addEventListener("input", () => {
    const v = Math.max(0, Math.min(Number(minInput.value || 0), Number(maxInput.value || maxBound)));
    sliderMin.value = v;
    updateSliderVisual();
    scheduleFilter();
  });
  if (maxInput) maxInput.addEventListener("input", () => {
    const v = Math.min(maxBound, Math.max(Number(maxInput.value || maxBound), Number(minInput.value || 0)));
    sliderMax.value = v;
    updateSliderVisual();
    scheduleFilter();
  });

  document.querySelectorAll(".js-price-preset").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".js-price-preset").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const mn = Number(btn.getAttribute("data-min") || 0);
      const mx = Number(btn.getAttribute("data-max") || maxBound);
      sliderMin.value = mn;
      sliderMax.value = mx;
      minInput.value = mn;
      maxInput.value = mx;
      updateSliderVisual();
      runAjaxFilter();
    });
  });

  document.querySelectorAll(".js-filter-cat, .js-filter-sub, .js-filter-brand, .js-filter-stock").forEach((cb) => {
    cb.addEventListener("change", runAjaxFilter);
  });
  if (searchInput) searchInput.addEventListener("input", scheduleFilter);
  if (sortSelect) sortSelect.addEventListener("change", runAjaxFilter);

  document.getElementById("btn-reset-filters")?.addEventListener("click", () => {
    window.location.href = window.BakeApp.apiUrl("product", "catalog");
  });

  document.querySelectorAll(".js-clear-recent").forEach((b) => {
    b.addEventListener("click", async () => {
      await window.BakeApp.postJson("product", "ajaxClearRecent", {});
      document.getElementById("recent-viewed-section")?.remove();
    });
  });

  updateSliderVisual();
});
</script>
