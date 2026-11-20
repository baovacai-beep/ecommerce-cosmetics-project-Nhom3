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
<!-- 1. Hero Carousel (3 slide, nút chuyển, chỉ báo slide, tự động chuyển & responsive) -->
<section class="hero-carousel" id="hero-carousel" aria-roledescription="carousel" aria-label="Banner nổi bật BakeMate" tabindex="0">
  <div class="hero-carousel__slides">
    <article class="hero-slide is-active" aria-hidden="false" aria-label="Slide 1 trên 3: Làm bánh chuẩn vị, nguyên liệu chuẩn tay">
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

    <article class="hero-slide" aria-hidden="true" aria-label="Slide 2 trên 3: Linh hoạt định lượng từ 100g">
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

    <article class="hero-slide" aria-hidden="true" aria-label="Slide 3 trên 3: Ưu đãi thành viên mới · Giảm 10%">
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
    <button type="button" class="hero-carousel__arrow hero-carousel__prev" aria-label="Banner trước (Phím mũi tên trái)">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
    </button>
    <div class="hero-carousel__dots" role="tablist" aria-label="Chọn banner hiển thị">
      <button type="button" class="hero-carousel__dot is-active" role="tab" aria-selected="true" aria-label="Banner 1"></button>
      <button type="button" class="hero-carousel__dot" role="tab" aria-selected="false" aria-label="Banner 2"></button>
      <button type="button" class="hero-carousel__dot" role="tab" aria-selected="false" aria-label="Banner 3"></button>
    </div>
    <button type="button" class="hero-carousel__arrow hero-carousel__next" aria-label="Banner tiếp theo (Phím mũi tên phải)">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
    </button>
  </div>
  <div class="hero-carousel__progress" aria-hidden="true">
    <div class="hero-carousel__progress-fill"></div>
  </div>
</section>

<main class="site-main">
  <!-- 2. Category Carousel (6 thẻ danh mục, có thể điều hướng & liên kết tới danh sách sản phẩm phù hợp) -->
  <section class="products-section category-discovery home-intro-section" aria-labelledby="discovery-heading">
    <div class="category-discovery__header">
      <span class="category-discovery__eyebrow">Danh mục &amp; Gợi ý theo bếp</span>
      <h2 class="products-section__title" id="discovery-heading">Khám phá thế giới làm bánh cùng BakeMate</h2>
      <p class="products-section__desc">Từ những nguyên liệu cơ bản đến dụng cụ chuyên dụng và phụ kiện đóng gói, BakeMate giúp bạn chuẩn bị đầy đủ chỉ trong vài bước gọn nhẹ.</p>
    </div>

    <div class="category-carousel" id="category-carousel" aria-roledescription="carousel" aria-label="Danh mục làm bánh nổi bật" tabindex="0">
      <div class="category-carousel__toolbar">
        <button type="button" class="category-carousel__status js-carousel-toggle" id="category-autoplay-btn" aria-pressed="false" aria-label="Tạm dừng tự động trượt danh mục">
          <span class="js-carousel-toggle-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          </span>
          <span class="js-carousel-toggle-label">Tạm dừng</span>
        </button>
        <div class="category-carousel__nav-group">
          <button type="button" class="carousel-nav-btn" id="category-prev-btn" aria-label="Xem thẻ danh mục trước (Phím mũi tên trái)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button type="button" class="carousel-nav-btn" id="category-next-btn" aria-label="Xem thẻ danh mục tiếp theo (Phím mũi tên phải)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <div class="category-carousel__viewport" id="category-carousel-viewport">
        <div class="category-carousel__track" id="home-category-track">
          <!-- Thẻ 1: Nguyên liệu làm bánh -->
          <a href="<?= App::e(App::url('?c=product&a=catalog&category=' . urlencode('Nguyên liệu'))) ?>" class="category-card" aria-label="Danh mục Nguyên liệu làm bánh - 11 sản phẩm">
            <div class="category-card__image-wrap">
              <img src="<?= App::e(App::asset('images/categories/cat-ingredients.jpg')) ?>" alt="Nguyên liệu làm bánh tươi và khô" class="category-card__img" loading="lazy">
              <span class="category-card__scrim" aria-hidden="true"></span>
              <span class="category-card__badge">11 sản phẩm</span>
            </div>
            <div class="category-card__body">
              <h3 class="category-card__title">Nguyên liệu làm bánh</h3>
              <p class="category-card__desc">Bột mì số 8, số 11, bơ lạt Anchor, đường tinh luyện, cacao, matcha và kem tươi.</p>
              <span class="category-card__link">Khám phá nguyên liệu &rarr;</span>
            </div>
          </a>

          <!-- Thẻ 2: Dụng cụ căn bếp -->
          <a href="<?= App::e(App::url('?c=product&a=catalog&category=' . urlencode('Dụng cụ'))) ?>" class="category-card" aria-label="Danh mục Dụng cụ căn bếp - 7 sản phẩm">
            <div class="category-card__image-wrap">
              <img src="<?= App::e(App::asset('images/categories/cat-tools.jpg')) ?>" alt="Dụng cụ làm bánh chuyên dụng" class="category-card__img" loading="lazy">
              <span class="category-card__scrim" aria-hidden="true"></span>
              <span class="category-card__badge">7 sản phẩm</span>
            </div>
            <div class="category-card__body">
              <h3 class="category-card__title">Dụng cụ căn bếp</h3>
              <p class="category-card__desc">Cân điện tử 1g, ca đong, thìa đong, nhiệt kế, phới lồng và khuôn bánh chống dính.</p>
              <span class="category-card__link">Khám phá dụng cụ &rarr;</span>
            </div>
          </a>

          <!-- Thẻ 3: Phụ kiện & Đóng gói -->
          <a href="<?= App::e(App::url('?c=product&a=catalog&category=' . urlencode('Phụ kiện & Đóng gói'))) ?>" class="category-card" aria-label="Danh mục Phụ kiện & Đóng gói - 5 sản phẩm">
            <div class="category-card__image-wrap">
              <img src="<?= App::e(App::asset('images/categories/cat-packaging.jpg')) ?>" alt="Phụ kiện và hộp túi đựng bánh" class="category-card__img" loading="lazy">
              <span class="category-card__scrim" aria-hidden="true"></span>
              <span class="category-card__badge">5 sản phẩm</span>
            </div>
            <div class="category-card__body">
              <h3 class="category-card__title">Phụ kiện &amp; Đóng gói</h3>
              <p class="category-card__desc">Túi bắt kem, bộ đui inox 12 đầu, giấy nến, cup giấy cupcake và hộp đựng bánh có quai.</p>
              <span class="category-card__link">Khám phá phụ kiện &rarr;</span>
            </div>
          </a>

          <!-- Thẻ 4: Bơ lạt & Kem sữa -->
          <a href="<?= App::e(App::url('?c=product&a=catalog&category=' . urlencode('Nguyên liệu') . '&sub=' . urlencode('Bơ, sữa và kem'))) ?>" class="category-card" aria-label="Dòng sản phẩm Bơ lạt & Kem sữa chuẩn nhập khẩu">
            <div class="category-card__image-wrap">
              <img src="<?= App::e(App::asset('images/products/bo-lat-anchor-2.jpg')) ?>" alt="Bơ lạt Anchor New Zealand cắt lát" class="category-card__img" loading="lazy">
              <span class="category-card__scrim" aria-hidden="true"></span>
              <span class="category-card__badge">Chuẩn nhập khẩu</span>
            </div>
            <div class="category-card__body">
              <h3 class="category-card__title">Bơ lạt &amp; Kem sữa</h3>
              <p class="category-card__desc">Bơ lạt Anchor 82.9% béo sữa và Whipping Cream cho bánh mì hoa cúc, mousse tan chảy.</p>
              <span class="category-card__link">Xem dòng bơ kem &rarr;</span>
            </div>
          </a>

          <!-- Thẻ 5: Bột & Men nở làm bánh -->
          <a href="<?= App::e(App::url('?c=product&a=catalog&category=' . urlencode('Nguyên liệu') . '&sub=' . urlencode('Bột và nguyên liệu khô'))) ?>" class="category-card" aria-label="Danh mục Bột & Nguyên liệu khô chuẩn làm bánh">
            <div class="category-card__image-wrap">
              <img src="<?= App::e(App::asset('images/about-ingredients.jpg')) ?>" alt="Bột và các nguyên liệu khô chọn lọc" class="category-card__img" loading="lazy">
              <span class="category-card__scrim" aria-hidden="true"></span>
              <span class="category-card__badge">Độ mịn tiêu chuẩn</span>
            </div>
            <div class="category-card__body">
              <h3 class="category-card__title">Bột &amp; Men nở làm bánh</h3>
              <p class="category-card__desc">Bột mì số 8, số 11 Meizan, đường tinh luyện, bột cacao Hershey's và bột matcha hảo hạng.</p>
              <span class="category-card__link">Xem các loại bột &rarr;</span>
            </div>
          </a>

          <!-- Thẻ 6: Khuôn & Khay nướng bánh -->
          <a href="<?= App::e(App::url('?c=product&a=catalog&category=' . urlencode('Dụng cụ') . '&sub=' . urlencode('Khuôn bánh'))) ?>" class="category-card" aria-label="Danh mục Khuôn và khay nướng bánh chống dính">
            <div class="category-card__image-wrap">
              <img src="<?= App::e(App::asset('images/products/khuon-banh-tron-1.jpg')) ?>" alt="Khuôn bánh tròn chống dính đế rời" class="category-card__img" loading="lazy">
              <span class="category-card__scrim" aria-hidden="true"></span>
              <span class="category-card__badge">Chống dính cao cấp</span>
            </div>
            <div class="category-card__body">
              <h3 class="category-card__title">Khuôn &amp; Khay nướng bánh</h3>
              <p class="category-card__desc">Khuôn bánh tròn đế rời 20cm, khuôn tart vỏ sò và giấy nến nướng bánh chống dính chịu nhiệt.</p>
              <span class="category-card__link">Xem khuôn nướng &rarr;</span>
            </div>
          </a>
        </div>
      </div>

      <div class="category-carousel__dots" id="category-carousel-dots" aria-label="Chỉ báo trang danh mục"></div>
    </div>

    <div class="home-intro-cta">
      <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="btn btn--primary">Xem tất cả sản phẩm</a>
      <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="btn btn--outline-dark">Khám phá Công thức &amp; Chọn combo</a>
    </div>
  </section>

  <!-- 3. Quick-Bake (4 thẻ giới thiệu các lựa chọn làm bánh nhanh, liên kết công thức có sẵn) -->
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
        <a href="<?= App::e(App::url('?c=recipe&a=detail&id=' . urlencode($qb['slug']))) ?>" class="quick-bake-card" aria-label="<?= App::e($qb['title']) ?> - <?= App::e($qb['tag']) ?>">
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

  <!-- Những sản phẩm được yêu thích -->
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

  <!-- 4. Flipbook 3D (Hiệu ứng lật trang 3D, nút điều hướng, hỗ trợ di động & phương án hiển thị thay thế khi không hỗ trợ 3D) -->
  <section class="recipe-flipbook-section" aria-labelledby="flipbook-heading">
    <div class="home-section-head">
      <div>
        <h2 class="home-section-head__title" id="flipbook-heading">Công thức gợi ý</h2>
        <p class="home-section-head__sub">Mỗi công thức là một hành trình sáng tạo, bắt đầu từ những điều giản đơn.</p>
      </div>
      <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="home-section-head__link">Xem tất cả công thức &rarr;</a>
    </div>

    <div class="recipe-flipbook-wrap" id="recipe-flipbook" tabindex="0" aria-label="Sách lật công thức làm bánh BakeMate"></div>
  </section>
</main>

<script>
(function () {
  "use strict";

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================================
     1. HERO CAROUSEL CONTROLLER
     3 slide, prev/next, indicators, autoplay 5.5s, keyboard, touch & responsive
     ========================================================================== */
  function initHeroCarousel() {
    const hero = document.getElementById("hero-carousel");
    if (!hero) return;

    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const dots = Array.from(hero.querySelectorAll(".hero-carousel__dot"));
    const prevBtn = hero.querySelector(".hero-carousel__prev");
    const nextBtn = hero.querySelector(".hero-carousel__next");
    const progressBar = hero.querySelector(".hero-carousel__progress-fill");

    if (slides.length <= 1) return;

    const AUTOPLAY_DELAY = 5500;
    let activeIdx = 0;
    let timer = null;
    let isHoverPaused = false;
    let isFocusPaused = false;
    let touchStartX = 0;

    function restartProgressBar() {
      if (!progressBar || prefersReducedMotion) return;
      progressBar.style.transition = "none";
      progressBar.style.width = "0%";
      void progressBar.offsetWidth; // Force reflow
      const isPaused = isHoverPaused || isFocusPaused || document.hidden;
      progressBar.style.transition = `width ${AUTOPLAY_DELAY}ms linear`;
      progressBar.style.width = isPaused ? "0%" : "100%";
    }

    function goToSlide(nextIndex) {
      const total = slides.length;
      activeIdx = ((nextIndex % total) + total) % total;

      slides.forEach((slide, idx) => {
        const isActive = idx === activeIdx;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", isActive ? "false" : "true");
      });

      dots.forEach((dot, idx) => {
        const isActive = idx === activeIdx;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      restartProgressBar();
    }

    function stopAutoplay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      if (progressBar) {
        progressBar.style.transition = "none";
        progressBar.style.width = "0%";
      }
    }

    function startAutoplay() {
      stopAutoplay();
      if (prefersReducedMotion || isHoverPaused || isFocusPaused || document.hidden) return;
      restartProgressBar();
      timer = setInterval(() => {
        goToSlide(activeIdx + 1);
      }, AUTOPLAY_DELAY);
    }

    prevBtn?.addEventListener("click", () => {
      goToSlide(activeIdx - 1);
      startAutoplay();
    });

    nextBtn?.addEventListener("click", () => {
      goToSlide(activeIdx + 1);
      startAutoplay();
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        goToSlide(idx);
        startAutoplay();
      });
    });

    // Tạm dừng khi hover chuột
    hero.addEventListener("mouseenter", () => {
      isHoverPaused = true;
      stopAutoplay();
    });
    hero.addEventListener("mouseleave", () => {
      isHoverPaused = false;
      startAutoplay();
    });

    // Tạm dừng khi focus phím vào các nút
    hero.addEventListener("focusin", () => {
      isFocusPaused = true;
      stopAutoplay();
    });
    hero.addEventListener("focusout", (e) => {
      if (!hero.contains(e.relatedTarget)) {
        isFocusPaused = false;
        startAutoplay();
      }
    });

    // Thao tác bàn phím ArrowLeft / ArrowRight
    hero.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToSlide(activeIdx - 1);
        startAutoplay();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToSlide(activeIdx + 1);
        startAutoplay();
      }
    });

    // Hỗ trợ cảm ứng vuốt chạm (Touch Swipe) trên mobile
    hero.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches && e.touches[0]) {
          touchStartX = e.touches[0].clientX;
        }
      },
      { passive: true }
    );

    hero.addEventListener(
      "touchend",
      (e) => {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(deltaX) > 45) {
          goToSlide(deltaX < 0 ? activeIdx + 1 : activeIdx - 1);
          startAutoplay();
        }
      },
      { passive: true }
    );

    // Tạm dừng khi ẩn tab trình duyệt
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    goToSlide(0);
    startAutoplay();
  }

  /* ==========================================================================
     2. CATEGORY CAROUSEL CONTROLLER
     6 thẻ danh mục, liên kết sản phẩm, tự động trượt, nút Play/Pause & phím
     ========================================================================== */
  function initCategoryCarousel() {
    const catRoot = document.getElementById("category-carousel");
    const catTrack = document.getElementById("home-category-track");
    const catDots = document.getElementById("category-carousel-dots");
    const catPrev = document.getElementById("category-prev-btn");
    const catNext = document.getElementById("category-next-btn");
    const catToggle = document.getElementById("category-autoplay-btn");

    if (!catRoot || !catTrack) return;

    const cards = Array.from(catTrack.querySelectorAll(".category-card"));
    if (cards.length === 0) return;

    const AUTOPLAY_DELAY = 3800;
    let cIdx = 0;
    let vis = 3;
    let maxIdx = 3;
    let userPaused = false;
    let hoverPaused = false;
    let cTimer = null;
    let touchStartX = 0;

    function computeVis() {
      const w = window.innerWidth;
      if (w <= 640) return 1;
      if (w <= 1024) return 2;
      return 3;
    }

    function buildDots() {
      if (!catDots) return;
      catDots.innerHTML = "";
      const pageCount = maxIdx + 1;
      for (let i = 0; i < pageCount; i++) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "category-carousel__dot" + (i === cIdx ? " is-active" : "");
        dot.setAttribute("aria-label", "Xem nhóm danh mục " + (i + 1));
        dot.setAttribute("aria-pressed", i === cIdx ? "true" : "false");
        dot.addEventListener("click", () => {
          setIdx(i);
          syncAuto();
        });
        catDots.appendChild(dot);
      }
    }

    function updateCardStates() {
      const spotlightIdx = vis === 3 ? Math.min(cards.length - 1, cIdx + 1) : cIdx;
      cards.forEach((card, idx) => {
        const isInView = idx >= cIdx && idx < cIdx + vis;
        card.classList.toggle("is-in-view", isInView);
        card.classList.toggle("is-spotlight", idx === spotlightIdx);
      });

      if (catDots) {
        Array.from(catDots.children).forEach((d, i) => {
          const isActive = i === cIdx;
          d.classList.toggle("is-active", isActive);
          d.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
      }
    }

    function setIdx(next) {
      const total = maxIdx + 1;
      cIdx = total <= 1 ? 0 : ((next % total) + total) % total;

      const firstCard = cards[0];
      if (firstCard) {
        const comp = window.getComputedStyle(catTrack);
        const gapPx = parseFloat(comp.columnGap || comp.gap || "20") || 20;
        const w = firstCard.getBoundingClientRect().width;
        const offsetPx = cIdx * (w + gapPx);
        catTrack.style.transform = `translate3d(-${offsetPx}px, 0, 0)`;
      }

      updateCardStates();
    }

    function refresh() {
      vis = computeVis();
      maxIdx = Math.max(0, cards.length - vis);
      if (cIdx > maxIdx) cIdx = maxIdx;
      buildDots();
      setIdx(cIdx);
    }

    function stopAuto() {
      if (cTimer) {
        clearInterval(cTimer);
        cTimer = null;
      }
    }

    function syncAuto() {
      stopAuto();
      if (prefersReducedMotion || userPaused || hoverPaused || maxIdx <= 0 || document.hidden) return;
      cTimer = setInterval(() => {
        setIdx(cIdx + 1);
      }, AUTOPLAY_DELAY);
    }

    function updateToggleLabel() {
      if (!catToggle) return;
      catToggle.classList.toggle("is-paused", userPaused);
      catToggle.setAttribute("aria-pressed", userPaused ? "true" : "false");
      catToggle.setAttribute("aria-label", userPaused ? "Bật tự động trượt danh mục" : "Tạm dừng tự động trượt danh mục");

      const icon = catToggle.querySelector(".js-carousel-toggle-icon");
      if (icon) {
        icon.innerHTML = userPaused
          ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>'
          : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
      }

      const lbl = catToggle.querySelector(".js-carousel-toggle-label");
      if (lbl) {
        lbl.textContent = userPaused ? "Tự động trượt" : "Tạm dừng";
      }
    }

    catPrev?.addEventListener("click", () => {
      setIdx(cIdx - 1);
      syncAuto();
    });

    catNext?.addEventListener("click", () => {
      setIdx(cIdx + 1);
      syncAuto();
    });

    catToggle?.addEventListener("click", () => {
      userPaused = !userPaused;
      updateToggleLabel();
      syncAuto();
    });

    catRoot.addEventListener("mouseenter", () => {
      hoverPaused = true;
      stopAuto();
    });

    catRoot.addEventListener("mouseleave", () => {
      hoverPaused = false;
      syncAuto();
    });

    // Thao tác bàn phím
    catRoot.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIdx(cIdx - 1);
        syncAuto();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setIdx(cIdx + 1);
        syncAuto();
      }
    });

    // Cảm ứng vuốt chạm
    const catViewport = document.getElementById("category-carousel-viewport") || catRoot;
    catViewport.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches && e.touches[0]) touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );

    catViewport.addEventListener(
      "touchend",
      (e) => {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(deltaX) > 40) {
          setIdx(deltaX < 0 ? cIdx + 1 : cIdx - 1);
          syncAuto();
        }
      },
      { passive: true }
    );

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAuto();
      else syncAuto();
    });

    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(refresh, 80);
    });

    refresh();
    updateToggleLabel();
    syncAuto();
  }

  /* ==========================================================================
     3. 3D RECIPE FLIPBOOK CONTROLLER
     Hiệu ứng lật trang 3D, thanh Toolbar, Fallback 2D, Mobile swipe & Add Combo
     ========================================================================== */
  function initRecipeFlipbook() {
    const flipWrap = document.getElementById("recipe-flipbook");
    const FLIP_RECIPES = <?= json_encode($flipJson, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>;

    if (!flipWrap || !Array.isArray(FLIP_RECIPES) || FLIP_RECIPES.length === 0) return;

    let fIdx = 0;
    const totalPages = FLIP_RECIPES.length;

    // Kiểm tra khả năng hỗ trợ CSS 3D Transforms trên trình duyệt
    const browserSupports3D = Boolean(
      window.CSS &&
      typeof window.CSS.supports === "function" &&
      window.CSS.supports("transform-style", "preserve-3d")
    );

    // Mặc định kích hoạt chế độ Fallback nếu trình duyệt không hỗ trợ 3D hoặc người dùng bật prefers-reduced-motion
    let isFallbackMode = !browserSupports3D || prefersReducedMotion;

    // Helper an toàn
    const esc = (val) => {
      if (window.BakeApp && typeof window.BakeApp.escapeHtml === "function") {
        return window.BakeApp.escapeHtml(val);
      }
      return String(val == null ? "" : val)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    };

    const fmt = (val) => {
      if (window.BakeApp && typeof window.BakeApp.formatPrice === "function") {
        return window.BakeApp.formatPrice(val);
      }
      return Number(val || 0).toLocaleString("vi-VN") + " ₫";
    };

    function getFavoriteRecipes() {
      try {
        const raw = localStorage.getItem("bakemate_favorite_recipes");
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }

    function toggleFavoriteRecipe(slug) {
      const favs = getFavoriteRecipes();
      const idx = favs.indexOf(slug);
      let isAdded = false;
      if (idx >= 0) {
        favs.splice(idx, 1);
        isAdded = false;
      } else {
        favs.push(slug);
        isAdded = true;
      }
      try {
        localStorage.setItem("bakemate_favorite_recipes", JSON.stringify(favs));
      } catch (e) {}
      return isAdded;
    }

    function renderBook(dirClass) {
      const r = FLIP_RECIPES[fIdx];
      const detailUrl = window.BakeApp && typeof window.BakeApp.apiUrl === "function"
        ? window.BakeApp.apiUrl("recipe", "detail", { id: r.slug })
        : `?c=recipe&a=detail&id=${encodeURIComponent(r.slug)}`;

      const favs = getFavoriteRecipes();
      const isFav = favs.includes(r.slug);

      // Cập nhật class Fallback 2D trên container
      flipWrap.classList.toggle("is-fallback-mode", isFallbackMode);

      flipWrap.innerHTML = `
        <div class="recipe-flipbook-toolbar">
          <div class="recipe-flipbook-toolbar__info">
            <span class="recipe-flipbook-toolbar__title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
              Sổ tay công thức làm bánh BakeMate
            </span>
            <span class="flipbook-mode-badge" id="flip-mode-badge">
              ${isFallbackMode ? "Chế độ 2D Tương thích" : "Chế độ 3D Journal"}
            </span>
          </div>

          <button type="button" class="flipbook-mode-btn js-flip-mode-toggle" aria-label="Chuyển đổi giữa chế độ sách 3D và giao diện phẳng 2D">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            <span class="js-flip-mode-label">${isFallbackMode ? "Bật hiệu ứng lật 3D" : "Chuyển chế độ 2D phẳng"}</span>
          </button>
        </div>

        <div class="recipe-flipbook-stage" id="flipbook-touch-stage">
          <article class="recipe-flipbook-book ${dirClass || ""}" aria-label="Công thức ${esc(r.title)} - Trang ${fIdx + 1} trên ${totalPages}">
            <!-- Trang trái: Hình ảnh, Nhãn mã số & Thời gian -->
            <div class="flipbook-page flipbook-page--left">
              <div class="flipbook-photo-wrap">
                <img src="${esc(r.image)}" alt="${esc(r.title)}" onerror="this.onerror=null;this.src='images/banner.jpg';">
                <span class="flipbook-bookmark">${esc(r.code || ("TRANG " + (fIdx + 1)))}</span>
                <button type="button" class="flipbook-wish-btn js-flip-wish ${isFav ? "is-active" : ""}" data-slug="${esc(r.slug)}" aria-label="${isFav ? "Bỏ lưu công thức" : "Lưu công thức"} ${esc(r.title)}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
              </div>
              <div class="flipbook-left-caption">
                <span>Thời gian: <strong>${esc(r.time)}</strong> · Độ khó: <strong>${esc(r.diff)}</strong></span>
                <span>Trang ${fIdx + 1} / ${totalPages}</span>
              </div>
            </div>

            <!-- Trang phải: Thông số, Nguyên liệu chip, Các bước & Nút CTA -->
            <div class="flipbook-page flipbook-page--right">
              <div>
                <p class="flipbook-right__eyebrow">BAKING JOURNAL · KHẨU PHẦN MẶC ĐỊNH ${r.defaultServings} PHẦN</p>
                <h3 class="flipbook-right__title">${esc(r.title)}</h3>
                <p class="flipbook-right__desc">${esc(r.subtitle)}</p>

                <div class="flipbook-ingredients-chips" aria-label="Nguyên liệu chính">
                  ${(r.ingredients || []).map((c) => `<span class="flipbook-chip">${esc(c)}</span>`).join("")}
                </div>

                <ol class="flipbook-steps-preview" aria-label="Các bước thực hiện tóm tắt">
                  ${(r.steps || []).map((s) => `<li>${esc(s)}</li>`).join("")}
                </ol>
              </div>

              <div class="flipbook-right__footer">
                <a href="${esc(detailUrl)}" class="btn btn--primary" style="background-color:var(--primary-color);border-color:var(--primary-color);">
                  Xem công thức chi tiết &rarr;
                </a>
                <button type="button" class="btn btn--outline-dark js-flip-add-combo" data-idx="${fIdx}" aria-label="Thêm combo nguyên liệu ${esc(r.title)} vào giỏ hàng">
                  + Combo (${esc(fmt(r.comboTotal))})
                </button>
              </div>
            </div>
          </article>
        </div>

        <!-- Điều hướng phân trang lật sách -->
        <div class="flipbook-controls">
          <button type="button" class="btn btn--outline-dark js-flip-prev" aria-label="Lật về công thức trước (Phím mũi tên trái)">
            &larr; Trang trước
          </button>

          <div class="flipbook-page-pills" role="tablist" aria-label="Chọn trực tiếp trang công thức">
            ${FLIP_RECIPES.map((rec, i) => `
              <button type="button" class="flipbook-page-pill js-flip-goto ${i === fIdx ? "is-active" : ""}" data-index="${i}" role="tab" aria-selected="${i === fIdx ? "true" : "false"}" aria-label="Lật đến trang ${i + 1}: ${esc(rec.title)}">
                ${i + 1}. ${esc(rec.title.split(" ").slice(0, 3).join(" "))}
              </button>
            `).join("")}
          </div>

          <button type="button" class="btn btn--outline-dark js-flip-next" aria-label="Lật sang công thức tiếp theo (Phím mũi tên phải)">
            Lật trang tiếp &rarr;
          </button>
        </div>
      `;

      // Hủy bỏ class animation sau khi diễn hoạt hoàn tất
      if (dirClass) {
        const bookEl = flipWrap.querySelector(".recipe-flipbook-book");
        if (bookEl) {
          setTimeout(() => {
            bookEl.classList.remove("is-turning-next", "is-turning-prev");
          }, 550);
        }
      }
    }

    function turnPage(nextIdx) {
      if (nextIdx === fIdx) return;
      const dirClass = nextIdx > fIdx ? "is-turning-next" : "is-turning-prev";
      fIdx = ((nextIdx % totalPages) + totalPages) % totalPages;
      renderBook(dirClass);
    }

    // Lắng nghe sự kiện click trong Flipbook
    flipWrap.addEventListener("click", async (e) => {
      // 1. Chuyển đổi chế độ xem 3D / Fallback 2D
      if (e.target.closest(".js-flip-mode-toggle")) {
        isFallbackMode = !isFallbackMode;
        renderBook("");
        if (window.BakeApp && typeof window.BakeApp.showToast === "function") {
          window.BakeApp.showToast(
            isFallbackMode ? "Đã chuyển sang Chế độ 2D phẳng tương thích." : "Đã bật Chế độ lật sách 3D Journal.",
            "info"
          );
        }
        return;
      }

      // 2. Trang trước
      if (e.target.closest(".js-flip-prev")) {
        const next = (fIdx - 1 + totalPages) % totalPages;
        fIdx = next;
        renderBook("is-turning-prev");
        return;
      }

      // 3. Trang tiếp theo
      if (e.target.closest(".js-flip-next")) {
        const next = (fIdx + 1) % totalPages;
        fIdx = next;
        renderBook("is-turning-next");
        return;
      }

      // 4. Bấm trực tiếp vào Pill trang
      const pill = e.target.closest(".js-flip-goto");
      if (pill) {
        const next = Number(pill.dataset.index);
        if (Number.isFinite(next)) {
          turnPage(next);
        }
        return;
      }

      // 5. Yêu thích công thức (Bookmark)
      const wishBtn = e.target.closest(".js-flip-wish");
      if (wishBtn) {
        const slug = wishBtn.dataset.slug;
        const isAdded = toggleFavoriteRecipe(slug);
        wishBtn.classList.toggle("is-active", isAdded);
        if (window.BakeApp && typeof window.BakeApp.showToast === "function") {
          window.BakeApp.showToast(
            isAdded ? "Đã lưu công thức vào danh sách yêu thích!" : "Đã bỏ lưu công thức khỏi danh sách yêu thích.",
            "success"
          );
        }
        return;
      }

      // 6. Thêm combo nguyên liệu vào giỏ hàng qua AJAX
      const addBtn = e.target.closest(".js-flip-add-combo");
      if (addBtn) {
        const r = FLIP_RECIPES[Number(addBtn.dataset.idx)];
        if (!r || !r.comboItems || r.comboItems.length === 0) {
          if (window.BakeApp && typeof window.BakeApp.showToast === "function") {
            window.BakeApp.showToast("Công thức hiện chưa có sẵn combo nguyên liệu.", "warning");
          }
          return;
        }

        try {
          addBtn.disabled = true;
          const origText = addBtn.textContent;
          addBtn.textContent = "Đang thêm...";

          if (window.BakeApp && typeof window.BakeApp.postJson === "function") {
            const res = await window.BakeApp.postJson("recipe", "ajaxAddComboToCart", {
              recipe_group_id: r.slug,
              items: r.comboItems,
            });
            if (res && res.data && typeof window.BakeApp.updateBadges === "function") {
              window.BakeApp.updateBadges(res.data.cart_count);
            }
            if (window.BakeApp.showToast) {
              window.BakeApp.showToast(res.message || "Đã thêm trọn bộ nguyên liệu vào giỏ hàng!", "success");
            }
          }
          addBtn.textContent = origText;
        } catch (err) {
          if (window.BakeApp && typeof window.BakeApp.showToast === "function") {
            window.BakeApp.showToast(err.message || "Không thể thêm combo vào giỏ hàng lúc này.", "error");
          }
        } finally {
          addBtn.disabled = false;
        }
      }
    });

    // Thao tác bàn phím ArrowLeft / ArrowRight
    flipWrap.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        fIdx = (fIdx - 1 + totalPages) % totalPages;
        renderBook("is-turning-prev");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        fIdx = (fIdx + 1) % totalPages;
        renderBook("is-turning-next");
      }
    });

    // Hỗ trợ cảm ứng vuốt chạm (Touch Swipe) trên màn hình di động
    let touchStartX = 0;
    flipWrap.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches && e.touches[0]) {
          touchStartX = e.touches[0].clientX;
        }
      },
      { passive: true }
    );

    flipWrap.addEventListener(
      "touchend",
      (e) => {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(deltaX) > 45) {
          if (deltaX < 0) {
            // Vuốt sang trái -> xem trang tiếp
            fIdx = (fIdx + 1) % totalPages;
            renderBook("is-turning-next");
          } else {
            // Vuốt sang phải -> xem trang trước
            fIdx = (fIdx - 1 + totalPages) % totalPages;
            renderBook("is-turning-prev");
          }
        }
      },
      { passive: true }
    );

    renderBook("");
  }

  // Khởi động khi tài liệu sẵn sàng
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initHeroCarousel();
      initCategoryCarousel();
      initRecipeFlipbook();
    });
  } else {
    initHeroCarousel();
    initCategoryCarousel();
    initRecipeFlipbook();
  }
})();
</script>
