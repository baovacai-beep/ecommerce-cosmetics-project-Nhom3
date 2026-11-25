<?php
declare(strict_types=1);
$cats = [
    'all' => 'Tất cả',
    'Bí quyết làm bánh' => 'Bí quyết làm bánh',
    'Hiểu về nguyên liệu' => 'Hiểu về nguyên liệu',
    'Kỹ thuật & dụng cụ' => 'Kỹ thuật & dụng cụ',
    'Cảm hứng vào bếp' => 'Cảm hứng vào bếp',
];
$selCat = (string) ($selectedCategory ?? 'all');
?>
<main class="page-container blog-page">
  <nav class="breadcrumb" aria-label="Đường dẫn điều hướng">
    <ul class="breadcrumb__list">
      <li class="breadcrumb__item"><a href="<?= App::e(App::url('')) ?>">Trang chủ</a></li>
      <li class="breadcrumb__separator">/</li>
      <li class="breadcrumb__item active">Blog làm bánh</li>
    </ul>
  </nav>

  <section class="blog-hero">
    <div class="blog-hero__content">
      <span class="about-eyebrow">Góc Bếp BakeMate</span>
      <h1 class="blog-hero__title">Blog Kiến Thức &amp; Mẹo Chọn Nguyên Liệu</h1>
      <p class="blog-hero__desc">
        Khám phá hướng dẫn làm bánh chi tiết từng bước, mẹo chọn bột chuẩn vị và thêm trọn bộ nguyên liệu đúng quy cách đóng gói vào giỏ hàng chỉ bằng 1 lần chạm.
      </p>
    </div>
    <div class="blog-hero__voucher">
      <span class="blog-hero__voucher-badge">Tích hợp Recipe-to-Cart</span>
      <p>Đọc bài viết và mở ngay trang <strong>Công thức</strong> để tự động quy đổi định lượng theo số khẩu phần bạn muốn!</p>
    </div>
  </section>

  <!-- Bộ lọc chủ đề & Tìm kiếm bài viết -->
  <section class="blog-toolbar" aria-label="Lọc bài viết Blog">
    <div class="blog-filters" role="group" aria-label="Lọc theo chủ đề">
      <?php foreach ($cats as $ck => $cl):
        $isActive = ($selCat === $ck || ($selCat === 'Tất cả' && $ck === 'all'));
      ?>
        <a href="<?= App::e(App::url('?c=home&a=blog&category=' . urlencode($ck) . ($searchQuery !== '' ? '&q=' . urlencode($searchQuery) : ''))) ?>"
           class="blog-filter-btn <?= $isActive ? 'active' : '' ?>">
          <?= App::e($cl) ?>
        </a>
      <?php endforeach; ?>
    </div>

    <div class="blog-search-wrap">
      <form method="get" action="<?= App::e(App::url('index.php')) ?>" class="blog-search-form" role="search">
        <input type="hidden" name="c" value="home">
        <input type="hidden" name="a" value="blog">
        <input type="hidden" name="category" value="<?= App::e($selCat) ?>">
        <label class="visually-hidden" for="blog-search">Tìm bài viết, công thức</label>
        <input
          type="search"
          id="blog-search"
          name="q"
          value="<?= App::e($searchQuery ?? '') ?>"
          class="form-input blog-search-input"
          placeholder="Tìm bài viết, mẹo làm bánh..."
          autocomplete="off"
        >
        <button type="submit" class="btn btn--primary blog-search-form__btn">Tìm</button>
      </form>
      <span class="blog-count-pill" id="blog-count" aria-live="polite"><?= count($posts) ?> bài viết</span>
    </div>
  </section>

  <!-- Lưới bài viết Blog -->
  <section aria-label="Danh sách bài viết Blog">
    <?php if (empty($posts)): ?>
      <div class="no-products-message">
        <span class="no-products-message__icon" aria-hidden="true">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
        </span>
        <strong>Rất tiếc, không tìm thấy kết quả phù hợp</strong>
        <p>Hãy thử tìm với từ khóa khác (ví dụ: bông lan, bột mì, cacao, brownie) hoặc đặt lại bộ lọc chủ đề.</p>
        <a href="<?= App::e(App::url('?c=home&a=blog')) ?>" class="btn btn--primary" style="margin-top:14px;">Xem tất cả bài viết</a>
      </div>
    <?php else: ?>
      <div class="blog-grid" id="blog-grid">
        <?php foreach ($posts as $post):
          $postUrl = App::url('?c=home&a=blogDetail&id=' . urlencode($post['slug']));
        ?>
          <article class="blog-card">
            <a href="<?= App::e($postUrl) ?>" class="blog-card__media" aria-label="<?= App::e($post['title']) ?>">
              <img src="<?= App::e(App::asset($post['image_path'])) ?>" alt="<?= App::e($post['title']) ?>" class="blog-card__img" loading="lazy">
              <span class="blog-card__category"><?= App::e($post['category']) ?></span>
            </a>
            <div class="blog-card__body">
              <div>
                <div class="blog-card__meta">
                  <span class="meta-inline">
                    <svg class="blog-meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <?= App::e($post['read_time']) ?>
                  </span>
                  <?php if (!empty($post['difficulty'])): ?>
                    <span>&middot;</span>
                    <span>Độ khó: <?= App::e($post['difficulty']) ?></span>
                  <?php endif; ?>
                </div>
                <h2 class="blog-card__title">
                  <a href="<?= App::e($postUrl) ?>"><?= App::e($post['title']) ?></a>
                </h2>
                <p class="blog-card__excerpt"><?= App::e($post['excerpt']) ?></p>
              </div>
              <div class="blog-card__bottom" style="display:flex;flex-direction:row;justify-content:space-between;align-items:center;border-top:1px solid #f0e4d3;padding-top:10px;font-size:12.5px;color:#7c5c46;">
                <span><?= App::e($post['published_at_label']) ?></span>
                <a href="<?= App::e($postUrl) ?>" class="blog-card__readmore">Đọc tiếp <span class="blog-card__arrow" aria-hidden="true">&rarr;</span></a>
              </div>
            </div>
          </article>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </section>
</main>
