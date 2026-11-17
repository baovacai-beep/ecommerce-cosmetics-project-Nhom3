<?php
declare(strict_types=1);

$flipJson = array_map(static function (array $r): array {
    $comboItems = [];
    $comboPrice = 0;
    foreach ($r['ingredients'] as $ing) {
        if (!empty($ing['product_id']) && !empty($ing['variant'])) {
            $qty = max(1, (int) ($ing['packs_needed'] ?? 1));
            $comboItems[] = [
                'product_id' => (int) $ing['product_id'],
                'option_index' => (int) ($ing['option_index'] ?? 0),
                'quantity' => $qty,
            ];
            $comboPrice += ((int) $ing['variant']['price']) * $qty;
        }
    }
    return [
        'id' => (int) $r['id'],
        'slug' => (string) $r['slug'],
        'code' => (string) $r['code'],
        'title' => (string) $r['title'],
        'subtitle' => (string) $r['subtitle'],
        'time' => (string) $r['time_label'],
        'diff' => (string) $r['difficulty'],
        'defaultServings' => (int) $r['default_servings'],
        'image' => App::asset((string) $r['image_path']),
        'ingredients' => array_slice(array_map(static fn(array $ing): string => $ing['base_amount'] . $ing['unit'] . ' ' . $ing['name'], $r['ingredients']), 0, 4),
        'steps' => array_slice($r['steps'] ?? [], 0, 3),
        'comboItems' => $comboItems,
        'comboTotal' => $comboPrice,
    ];
}, $flipbookRecipes ?? []);
?>
<section class="hero-carousel" id="hero-carousel" aria-roledescription="carousel" aria-label="Banner nổi bật BakeMate">
  <div class="hero-carousel__slides">
    <article class="hero-slide is-active" aria-hidden="false">
      <div class="hero-slide__bg" style="background-image: url('<?= App::e(App::asset('images/banner.jpg')) ?>');"></div>
      <div class="hero-slide__overlay"></div>
      <div class="hero-banner__content">
        <span class="hero-banner__badge">Lấy công thức làm trung tâm</span>
        <h1 class="hero-banner__title">Làm bánh chuẩn vị<br>Nguyên liệu chuẩn tay</h1>
        <p class="hero-banner__desc">
          Chọn công thức yêu thích, tự động quy đổi định lượng chuẩn xác và nhận trọn gói nguyên liệu, dụng cụ vừa đủ dùng tận cửa nhà.
        </p>
        <div class="hero-banner__actions">
          <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="btn btn--primary">Khám phá công thức</a>
          <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="btn btn--outline">Mua nguyên liệu</a>
          <a href="<?= App::e(App::url('?c=home&a=blog')) ?>" class="btn btn--outline">Xem Blog</a>
        </div>
      </div>
    </article>

    <article class="hero-slide" aria-hidden="true">
      <div class="hero-slide__bg" style="background-image: url('<?= App::e(App::asset('images/contact-baking.jpg')) ?>');"></div>
      <div class="hero-slide__overlay"></div>
      <div class="hero-banner__content">
        <span class="hero-banner__badge">Linh hoạt định lượng từ 100g</span>
        <h2 class="hero-banner__title">Chuẩn bị vừa vặn<br>Không lo dư thừa bột</h2>
        <p class="hero-banner__desc">
          Dễ dàng chọn túi 100g, 300g, 500g hoặc 1kg đúng nhu cầu từng mẻ bánh, đảm bảo độ tươi mới và tiết kiệm tối đa chi phí.
        </p>
        <div class="hero-banner__actions">
          <a href="<?= App::e(App::url('?c=product&a=catalog&category=' . urlencode('Nguyên liệu'))) ?>" class="btn btn--primary">Chọn nguyên liệu ngay</a>
          <a href="<?= App::e(App::url('?c=product&a=catalog&category=' . urlencode('Dụng cụ'))) ?>" class="btn btn--outline">Xem dụng cụ căn bếp</a>
        </div>
      </div>
    </article>

    <article class="hero-slide" aria-hidden="true">
      <div class="hero-slide__bg" style="background-image: url('<?= App::e(App::asset('images/about-baking.jpg')) ?>');"></div>
      <div class="hero-slide__overlay"></div>
      <div class="hero-banner__content">
        <span class="hero-banner__badge">Ưu đãi thành viên mới · Giảm 10%</span>
        <h2 class="hero-banner__title">Combo công thức 1 chạm<br>Giao hỏa tốc trong 2 giờ</h2>
        <p class="hero-banner__desc">
          Gom nhanh toàn bộ nguyên liệu và dụng cụ theo từng công thức bánh thơm ngon. Nhập mã CHAOBANMOI để nhận ưu đãi đơn đầu tiên.
        </p>
        <div class="hero-banner__actions">
          <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="btn btn--primary">Chọn combo công thức</a>
          <a href="<?= App::e(App::url('?c=order&a=cart')) ?>" class="btn btn--outline">Đi tới giỏ hàng</a>
        </div>
      </div>
    </article>
  </div>

  <div class="hero-carousel__controls">
    <button type="button" class="hero-carousel__arrow hero-carousel__prev" aria-label="Banner trước">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
    </button>
    <div class="hero-carousel__dots" role="tablist" aria-label="Chọn banner hiển thị">
      <button type="button" class="hero-carousel__dot is-active" role="tab" aria-selected="true" aria-label="Banner 1"></button>
      <button type="button" class="hero-carousel__dot" role="tab" aria-selected="false" aria-label="Banner 2"></button>
      <button type="button" class="hero-carousel__dot" role="tab" aria-selected="false" aria-label="Banner 3"></button>
    </div>
    <button type="button" class="hero-carousel__arrow hero-carousel__next" aria-label="Banner tiếp theo">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
    </button>
  </div>
  <div class="hero-carousel__progress" aria-hidden="true">
    <div class="hero-carousel__progress-fill"></div>
  </div>
</section>

<main class="site-main">
  <!-- 3.1 Danh mục & Gợi ý theo bếp (Carousel 6 thẻ tự trượt) -->
  <section class="products-section category-discovery home-intro-section" aria-labelledby="discovery-heading">
    <div class="category-discovery__header">
      <span class="category-discovery__eyebrow">Danh mục &amp; Gợi ý theo bếp</span>
      <h2 class="products-section__title" id="discovery-heading">Khám phá thế giới làm bánh cùng BakeMate</h2>
      <p class="products-section__desc">Từ những nguyên liệu cơ bản đến dụng cụ chuyên dụng và phụ kiện đóng gói, BakeMate giúp bạn chuẩn bị đầy đủ chỉ trong vài bước gọn nhẹ.</p>
    </div>

    <div class="category-carousel" id="category-carousel" aria-roledescription="carousel" aria-label="Danh mục làm bánh nổi bật">
      <div class="category-carousel__toolbar">
        <button type="button" class="category-carousel__status js-carousel-toggle" id="category-autoplay-btn" aria-pressed="false">
          <span class="js-carousel-toggle-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          </span>
          <span class="js-carousel-toggle-label">Tạm dừng</span>
        </button>
        <div class="category-carousel__nav-group">
          <button type="button" class="carousel-nav-btn" id="category-prev-btn" aria-label="Xem thẻ danh mục trước">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button type="button" class="carousel-nav-btn" id="category-next-btn" aria-label="Xem thẻ danh mục tiếp theo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <div class="category-carousel__viewport" id="category-carousel-viewport">
        <div class="category-carousel__track" id="home-category-track">
          <a href="<?= App::e(App::url('?c=product&a=catalog&category=' . urlencode('Nguyên liệu'))) ?>" class="category-card">
            <div class="category-card__image-wrap">
              <img src="<?= App::e(App::asset('images/categories/cat-ingredients.jpg')) ?>" alt="Nguyên liệu làm bánh" class="category-card__img" loading="lazy">
              <span class="category-card__scrim" aria-hidden="true"></span>
              <span class="category-card__badge">11 sản phẩm</span>
            </div>
            <div class="category-card__body">
              <h3 class="category-card__title">Nguyên liệu làm bánh</h3>
              <p class="category-card__desc">Bột mì số 8, số 11, bơ lạt Anchor, đường tinh luyện, cacao, matcha và kem tươi.</p>
              <span class="category-card__link">Khám phá nguyên liệu &rarr;</span>
            </div>
          </a>

          <a href="<?= App::e(App::url('?c=product&a=catalog&category=' . urlencode('Dụng cụ'))) ?>" class="category-card">
            <div class="category-card__image-wrap">
              <img src="<?= App::e(App::asset('images/categories/cat-tools.jpg')) ?>" alt="Dụng cụ căn bếp" class="category-card__img" loading="lazy">
              <span class="category-card__scrim" aria-hidden="true"></span>
              <span class="category-card__badge">7 sản phẩm</span>
            </div>
            <div class="category-card__body">
              <h3 class="category-card__title">Dụng cụ căn bếp</h3>
              <p class="category-card__desc">Cân điện tử 1g, ca đong, thìa đong, nhiệt kế, phới lồng và khuôn bánh chống dính.</p>
              <span class="category-card__link">Khám phá dụng cụ &rarr;</span>
            </div>
          </a>

          <a href="<?= App::e(App::url('?c=product&a=catalog&category=' . urlencode('Phụ kiện & Đóng gói'))) ?>" class="category-card">
            <div class="category-card__image-wrap">
              <img src="<?= App::e(App::asset('images/categories/cat-packaging.jpg')) ?>" alt="Phụ kiện & Đóng gói" class="category-card__img" loading="lazy">
              <span class="category-card__scrim" aria-hidden="true"></span>
              <span class="category-card__badge">5 sản phẩm</span>
            </div>
            <div class="category-card__body">
              <h3 class="category-card__title">Phụ kiện &amp; Đóng gói</h3>
              <p class="category-card__desc">Túi bắt kem, bộ đui inox 12 đầu, giấy nến, cup giấy cupcake và hộp đựng bánh có quai.</p>
              <span class="category-card__link">Khám phá phụ kiện &rarr;</span>
            </div>
          </a>

          <a href="<?= App::e(App::url('?c=product&a=catalog&q=Anchor')) ?>" class="category-card">
            <div class="category-card__image-wrap">
              <img src="<?= App::e(App::asset('images/products/bo-lat-anchor-2.jpg')) ?>" alt="Bơ lạt Anchor New Zealand" class="category-card__img" loading="lazy">
              <span class="category-card__scrim" aria-hidden="true"></span>
              <span class="category-card__badge">Chuẩn nhập khẩu</span>
            </div>
            <div class="category-card__body">
              <h3 class="category-card__title">Bơ lạt &amp; Kem sữa</h3>
              <p class="category-card__desc">Bơ lạt Anchor 82.9% béo sữa và Whipping Cream cho bánh mì hoa cúc, mousse tan chảy.</p>
              <span class="category-card__link">Xem dòng bơ kem &rarr;</span>
            </div>
          </a>

          <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="category-card">
            <div class="category-card__image-wrap">
              <img src="<?= App::e(App::asset('images/about-beginner.jpg')) ?>" alt="Combo theo công thức" class="category-card__img" loading="lazy">
              <span class="category-card__scrim" aria-hidden="true"></span>
              <span class="category-card__badge">Recipe-to-Cart</span>
            </div>
            <div class="category-card__body">
              <h3 class="category-card__title">Combo theo công thức</h3>
              <p class="category-card__desc">Gom trọn bộ nguyên liệu đúng tỷ lệ cho Chiffon, Hoa Cúc, Brownie chỉ với 1 lần bấm.</p>
              <span class="category-card__link">Chọn công thức ngay &rarr;</span>
            </div>
          </a>

          <a href="<?= App::e(App::url('?c=recipe&a=detail&id=recipe-bong-lan')) ?>" class="category-card">
            <div class="category-card__image-wrap">
              <img src="<?= App::e(App::asset('images/about-sharing-cakes.jpg')) ?>" alt="Bánh tặng gia đình" class="category-card__img" loading="lazy">
              <span class="category-card__scrim" aria-hidden="true"></span>
              <span class="category-card__badge">Hướng dẫn A–Z</span>
            </div>
            <div class="category-card__body">
              <h3 class="category-card__title">Bánh tặng gia đình</h3>
              <p class="category-card__desc">Tự tính khẩu phần và hướng dẫn chi tiết từng bước giúp người mới làm bánh thành công.</p>
              <span class="category-card__link">Mở công thức ngay &rarr;</span>
            </div>
          </a>
        </div>
      </div>

      <div class="category-carousel__dots" id="category-carousel-dots" aria-label="Trang danh mục"></div>
    </div>

    <div class="home-intro-cta">
      <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="btn btn--primary">Xem tất cả sản phẩm</a>
      <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="btn btn--outline-dark">Khám phá Công thức &amp; Chọn combo</a>
    </div>
  </section>

  <!-- 3.1b Bạn muốn làm bánh gì hôm nay? -->
  <section class="home-quick-bake" aria-labelledby="quick-bake-heading">
    <div class="home-section-head">
      <div>
        <h2 class="home-section-head__title" id="quick-bake-heading">Bạn muốn làm bánh gì hôm nay?</h2>
        <p class="home-section-head__sub">Chọn nhanh món bánh yêu thích để mở bảng quy đổi khẩu phần và gom đủ nguyên liệu chỉ trong 1 chạm.</p>
      </div>
      <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="home-section-head__link">Xem tất cả công thức &rarr;</a>
    </div>

    <div class="quick-bake-grid">
      <?php foreach ([
          ['slug' => 'recipe-bong-lan', 'tag' => 'Dễ · 55 phút', 'title' => 'Bánh Bông Lan Cơ Bản', 'desc' => 'Cốt bánh mềm ẩm, bông xốp chuẩn bột mì số 8, đường tinh luyện và Cream of Tartar.'],
          ['slug' => 'recipe-banh-quy-bo', 'tag' => '35 phút · 30 chiếc', 'title' => 'Cookies Bơ Đan Mạch', 'desc' => 'Hương bơ lạt Anchor 82.9% béo sữa giòn tan, dễ tạo vân hoa hồng bằng đui Inox 304.'],
          ['slug' => 'recipe-hoa-cuc', 'tag' => 'Trung bình · 90 phút', 'title' => 'Bánh Mì Hoa Cúc', 'desc' => 'Từng thớ bánh dai mềm kéo sợi với bột mì số 11 giàu gluten và bơ sữa nhập khẩu.'],
          ['slug' => 'recipe-mousse-socola', 'tag' => 'Không cần lò nướng', 'title' => 'Mousse Socola Lạnh', 'desc' => 'Mát lạnh tan chảy với Whipping Cream Anchor đánh bông mịn và bột cacao Hershey\'s.'],
      ] as $qb): ?>
        <a href="<?= App::e(App::url('?c=recipe&a=detail&id=' . urlencode($qb['slug']))) ?>" class="quick-bake-card">
          <div>
            <span class="quick-bake-card__tag"><?= App::e($qb['tag']) ?></span>
            <h3 class="quick-bake-card__title"><?= App::e($qb['title']) ?></h3>
            <p class="quick-bake-card__desc"><?= App::e($qb['desc']) ?></p>
          </div>
          <span class="quick-bake-card__cta">Chọn combo nguyên liệu &rarr;</span>
        </a>
      <?php endforeach; ?>
    </div>
  </section>

  <!-- 3.2 Những sản phẩm được yêu thích -->
  <section class="home-favorites-section" aria-labelledby="favorites-heading">
    <div class="home-section-head">
      <div>
        <h2 class="home-section-head__title" id="favorites-heading">Những sản phẩm được yêu thích</h2>
        <p class="home-section-head__sub">Chọn lựa những nguyên liệu và dụng cụ phù hợp cho chiếc bánh hoàn hảo.</p>
      </div>
      <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="home-section-head__link">Xem tất cả sản phẩm &rarr;</a>
    </div>

    <div class="product-grid">
      <?php foreach ($featuredProducts as $p): ?>
        <?php require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'partials' . DIRECTORY_SEPARATOR . 'product-card.php'; ?>
      <?php endforeach; ?>
    </div>
  </section>

  <!-- 3.3 Công thức gợi ý (Sách lật 3D tương tác nối DB) -->
  <section class="recipe-flipbook-section" aria-labelledby="flipbook-heading">
    <div class="home-section-head">
      <div>
        <h2 class="home-section-head__title" id="flipbook-heading">Công thức gợi ý</h2>
        <p class="home-section-head__sub">Mỗi công thức là một hành trình sáng tạo, bắt đầu từ những điều giản đơn.</p>
      </div>
      <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="home-section-head__link">Xem tất cả công thức &rarr;</a>
    </div>

    <div class="recipe-flipbook-wrap" id="recipe-flipbook"></div>
  </section>
</main>

<script>
document.addEventListener("DOMContentLoaded", function () {
  // 1. Hero Carousel
  const hero = document.getElementById("hero-carousel");
  if (hero) {
    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const dots = Array.from(hero.querySelectorAll(".hero-carousel__dot"));
    const prevBtn = hero.querySelector(".hero-carousel__prev");
    const nextBtn = hero.querySelector(".hero-carousel__next");
    const progressBar = hero.querySelector(".hero-carousel__progress-fill");
    let activeIdx = 0;
    let paused = false;
    let timer = null;

    function restartBar() {
      if (!progressBar) return;
      progressBar.style.transition = "none";
      progressBar.style.width = "0%";
      void progressBar.offsetWidth;
      progressBar.style.transition = "width 5500ms linear";
      progressBar.style.width = paused ? "0%" : "100%";
    }
    function goTo(n) {
      activeIdx = ((n % slides.length) + slides.length) % slides.length;
      slides.forEach((s, i) => {
        s.classList.toggle("is-active", i === activeIdx);
        s.setAttribute("aria-hidden", i === activeIdx ? "false" : "true");
      });
      dots.forEach((d, i) => {
        d.classList.toggle("is-active", i === activeIdx);
        d.setAttribute("aria-selected", i === activeIdx ? "true" : "false");
      });
      restartBar();
    }
    function start() {
      if (timer) clearInterval(timer);
      if (paused) return;
      restartBar();
      timer = setInterval(() => goTo(activeIdx + 1), 5500);
    }
    prevBtn?.addEventListener("click", () => { goTo(activeIdx - 1); start(); });
    nextBtn?.addEventListener("click", () => { goTo(activeIdx + 1); start(); });
    dots.forEach((d, i) => d.addEventListener("click", () => { goTo(i); start(); }));
    hero.addEventListener("mouseenter", () => { paused = true; if (timer) clearInterval(timer); });
    hero.addEventListener("mouseleave", () => { paused = false; start(); });
    goTo(0);
    start();
  }

  // 2. Category Carousel (6 thẻ tự trượt)
  const catRoot = document.getElementById("category-carousel");
  const catTrack = document.getElementById("home-category-track");
  const catDots = document.getElementById("category-carousel-dots");
  const catPrev = document.getElementById("category-prev-btn");
  const catNext = document.getElementById("category-next-btn");
  const catToggle = document.getElementById("category-autoplay-btn");
  if (catRoot && catTrack) {
    const cards = Array.from(catTrack.querySelectorAll(".category-card"));
    let cIdx = 0;
    let vis = 3;
    let maxIdx = 3;
    let uPaused = false;
    let hPaused = false;
    let cTimer = null;

    function computeVis() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }
    function buildDots() {
      if (!catDots) return;
      catDots.innerHTML = "";
      for (let i = 0; i <= maxIdx; i++) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "category-carousel__dot" + (i === cIdx ? " is-active" : "");
        b.addEventListener("click", () => { setIdx(i); syncAuto(); });
        catDots.appendChild(b);
      }
    }
    function setIdx(next) {
      const total = maxIdx + 1;
      cIdx = total <= 1 ? 0 : ((next % total) + total) % total;
      const gapPx = parseFloat(window.getComputedStyle(catTrack).columnGap || "20") || 20;
      const w = cards[0] ? cards[0].getBoundingClientRect().width : 320;
      catTrack.style.transform = `translate3d(-${cIdx * (w + gapPx)}px, 0, 0)`;
      if (catDots) {
        Array.from(catDots.children).forEach((d, i) => d.classList.toggle("is-active", i === cIdx));
      }
    }
    function refresh() {
      vis = computeVis();
      maxIdx = Math.max(0, cards.length - vis);
      if (cIdx > maxIdx) cIdx = maxIdx;
      buildDots();
      setIdx(cIdx);
    }
    function syncAuto() {
      if (cTimer) clearInterval(cTimer);
      if (!uPaused && !hPaused && maxIdx > 0) {
        cTimer = setInterval(() => setIdx(cIdx + 1), 3800);
      }
    }
    catPrev?.addEventListener("click", () => { setIdx(cIdx - 1); syncAuto(); });
    catNext?.addEventListener("click", () => { setIdx(cIdx + 1); syncAuto(); });
    catToggle?.addEventListener("click", () => {
      uPaused = !uPaused;
      const lbl = catToggle.querySelector(".js-carousel-toggle-label");
      if (lbl) lbl.textContent = uPaused ? "Tự động trượt" : "Tạm dừng";
      syncAuto();
    });
    catRoot.addEventListener("mouseenter", () => { hPaused = true; if (cTimer) clearInterval(cTimer); });
    catRoot.addEventListener("mouseleave", () => { hPaused = false; syncAuto(); });
    window.addEventListener("resize", () => setTimeout(refresh, 80));
    refresh();
    syncAuto();
  }

  // 3. 3D Recipe Flipbook (8 công thức từ MySQL + Thêm Combo AJAX)
  const flipWrap = document.getElementById("recipe-flipbook");
  const FLIP_RECIPES = <?= json_encode($flipJson, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>;
  if (flipWrap && FLIP_RECIPES.length) {
    let fIdx = 0;
    const esc = window.BakeApp.escapeHtml;
    const fmt = window.BakeApp.formatPrice;

    function renderBook(dirClass) {
      const r = FLIP_RECIPES[fIdx];
      const detailUrl = window.BakeApp.apiUrl("recipe", "detail", { id: r.slug });
      flipWrap.innerHTML = `
        <div class="recipe-flipbook-stage">
          <article class="recipe-flipbook-book ${dirClass || ""}">
            <div class="flipbook-page flipbook-page--left">
              <div class="flipbook-photo-wrap">
                <img src="${esc(r.image)}" alt="${esc(r.title)}">
                <span class="flipbook-bookmark">${esc(r.code || ("TRANG " + (fIdx + 1)))}</span>
              </div>
              <div class="flipbook-left-caption">
                <span>Thời gian: <strong>${esc(r.time)}</strong> · Độ khó: <strong>${esc(r.diff)}</strong></span>
                <span>Trang ${fIdx + 1} / ${FLIP_RECIPES.length}</span>
              </div>
            </div>

            <div class="flipbook-page flipbook-page--right">
              <div>
                <p class="flipbook-right__eyebrow">BAKING JOURNAL · KHẨU PHẦN MẶC ĐỊNH ${r.defaultServings} PHẦN</p>
                <h3 class="flipbook-right__title">${esc(r.title)}</h3>
                <p class="flipbook-right__desc">${esc(r.subtitle)}</p>
                <div class="flipbook-ingredients-chips">
                  ${(r.ingredients || []).map((c) => `<span class="flipbook-chip">${esc(c)}</span>`).join("")}
                </div>
                <ol class="flipbook-steps-preview">
                  ${(r.steps || []).map((s) => `<li>${esc(s)}</li>`).join("")}
                </ol>
              </div>
              <div class="flipbook-right__footer">
                <a href="${esc(detailUrl)}" class="btn btn--primary" style="background-color:var(--primary-color);border-color:var(--primary-color);">Xem công thức chi tiết &rarr;</a>
                <button type="button" class="btn btn--outline-dark js-flip-add-combo" data-idx="${fIdx}">+ Combo (${esc(fmt(r.comboTotal))})</button>
              </div>
            </div>
          </article>
        </div>

        <div class="flipbook-controls">
          <button type="button" class="btn btn--outline-dark js-flip-prev">&larr; Trang trước</button>
          <div class="flipbook-page-pills">
            ${FLIP_RECIPES.map((rec, i) => `
              <button type="button" class="flipbook-page-pill js-flip-goto ${i === fIdx ? "is-active" : ""}" data-index="${i}">
                ${i + 1}. ${esc(rec.title.split(" ").slice(0, 3).join(" "))}
              </button>
            `).join("")}
          </div>
          <button type="button" class="btn btn--outline-dark js-flip-next">Lật trang tiếp &rarr;</button>
        </div>
      `;
    }

    flipWrap.addEventListener("click", async (e) => {
      if (e.target.closest(".js-flip-prev")) {
        fIdx = (fIdx - 1 + FLIP_RECIPES.length) % FLIP_RECIPES.length;
        renderBook("is-turning-prev");
        return;
      }
      if (e.target.closest(".js-flip-next")) {
        fIdx = (fIdx + 1) % FLIP_RECIPES.length;
        renderBook("is-turning-next");
        return;
      }
      const pill = e.target.closest(".js-flip-goto");
      if (pill) {
        const next = Number(pill.dataset.index);
        if (next !== fIdx) {
          const dir = next > fIdx ? "is-turning-next" : "is-turning-prev";
          fIdx = next;
          renderBook(dir);
        }
        return;
      }
      const addBtn = e.target.closest(".js-flip-add-combo");
      if (addBtn) {
        const r = FLIP_RECIPES[Number(addBtn.dataset.idx)];
        try {
          addBtn.disabled = true;
          const res = await window.BakeApp.postJson("recipe", "ajaxAddComboToCart", {
            recipe_group_id: r.slug,
            items: r.comboItems
          });
          window.BakeApp.updateBadges(res.data.cart_count);
          window.BakeApp.showToast(res.message, "success");
        } catch (err) {
          window.BakeApp.showToast(err.message, "error");
        } finally {
          addBtn.disabled = false;
        }
      }
    });
    renderBook("");
  }
});
</script>
