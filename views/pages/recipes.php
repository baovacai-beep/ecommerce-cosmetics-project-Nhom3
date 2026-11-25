<?php
declare(strict_types=1);

$activeTag = (string) ($filters['tag'] ?? 'Tất cả');
$activeDiff = (string) ($filters['difficulty'] ?? 'Tất cả');
$activeTime = (int) ($filters['max_minutes'] ?? 0);
$activeQuery = (string) ($filters['q'] ?? '');
?>
<main class="page-container">
  <nav class="breadcrumb" aria-label="Đường dẫn điều hướng">
    <ul class="breadcrumb__list">
      <li class="breadcrumb__item"><a href="<?= App::e(App::url('')) ?>">Trang chủ</a></li>
      <li class="breadcrumb__separator">/</li>
      <li class="breadcrumb__item active">Công thức làm bánh</li>
    </ul>
  </nav>

  <section class="recipes-hero">
    <span class="about-eyebrow">BakeMate Baking Journal</span>
    <h1 class="recipes-hero__title">Công thức từ căn bếp BakeMate</h1>
    <p class="recipes-hero__desc">
      Chọn món bánh bạn yêu thích, tự động quy đổi định lượng theo số khẩu phần mong muốn và đưa trọn bộ nguyên liệu chuẩn xác vào giỏ hàng chỉ bằng một lần chạm.
    </p>
  </section>

  <div class="recipes-filter-bar" role="group" aria-label="Lọc công thức theo nhóm bánh">
    <?php foreach ($tagsList as $tag):
      $labelTag = $tag === 'Tất cả' ? 'Tất cả (8)' : $tag;
    ?>
      <a href="<?= App::e(App::url('?' . http_build_query([
          'c' => 'recipe',
          'a' => 'index',
          'tag' => $tag,
          'q' => $activeQuery,
          'difficulty' => $activeDiff,
          'max_minutes' => $activeTime,
      ]))) ?>"
         class="blog-filter-btn <?= $activeTag === $tag ? 'active' : '' ?>"><?= App::e($labelTag) ?></a>
    <?php endforeach; ?>
  </div>

  <form method="get" action="<?= App::e(App::url('index.php')) ?>" class="recipes-controls-panel" aria-label="Lọc công thức theo độ khó và thời gian">
    <input type="hidden" name="c" value="recipe">
    <input type="hidden" name="a" value="index">
    <input type="hidden" name="tag" value="<?= App::e($activeTag) ?>">

    <div class="recipes-controls-panel__right" style="width:100%;justify-content:flex-start;">
      <select id="recipe-filter-diff" name="difficulty" class="form-input" style="width:auto;min-width:155px;" aria-label="Lọc theo độ khó" onchange="this.form.submit()">
        <option value="Tất cả">Độ khó</option>
        <option value="Dễ" <?= $activeDiff === 'Dễ' ? 'selected' : '' ?>>Dễ</option>
        <option value="Trung bình" <?= $activeDiff === 'Trung bình' ? 'selected' : '' ?>>Trung bình</option>
        <option value="Khó" <?= $activeDiff === 'Khó' ? 'selected' : '' ?>>Khó</option>
      </select>
      <select id="recipe-filter-time" name="max_minutes" class="form-input" style="width:auto;min-width:170px;" aria-label="Lọc theo thời gian" onchange="this.form.submit()">
        <option value="0">Thời gian</option>
        <option value="30" <?= $activeTime === 30 ? 'selected' : '' ?>>Nhanh (&le; 35 phút)</option>
        <option value="60" <?= $activeTime === 60 ? 'selected' : '' ?>>Vừa (36 – 60 phút)</option>
        <option value="61" <?= $activeTime === 61 ? 'selected' : '' ?>>Công phu (&gt; 60 phút)</option>
      </select>
      <span class="blog-count-pill" id="recipe-count-pill" aria-live="polite" style="align-self:center;"><?= count($recipes) ?> công thức</span>
    </div>
  </form>

  <?php if (empty($recipes)): ?>
    <div class="no-products-message">
      <strong>Không tìm thấy công thức phù hợp với bộ lọc hiện tại</strong>
      <p>Hãy thử đổi nhóm bánh, độ khó hoặc đặt lại bộ lọc để xem toàn bộ 8 công thức BakeMate.</p>
      <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="btn btn--primary" style="margin-top:12px;">Xem tất cả công thức</a>
    </div>
  <?php else: ?>
    <section aria-label="Danh sách công thức BakeMate">
      <div class="recipes-editorial-grid" id="recipes-grid">
        <?php foreach ($recipes as $r):
          $recUrl = App::url('?c=recipe&a=detail&id=' . urlencode($r['slug']));
        ?>
          <article class="recipe-poster-card" data-recipe-url="<?= App::e($recUrl) ?>" style="cursor:pointer;">
            <img
              src="<?= App::e(App::asset($r['image_path'])) ?>"
              alt="<?= App::e($r['title']) ?>"
              class="recipe-poster-card__img"
              loading="lazy"
            >
            <div class="recipe-poster-card__scrim" aria-hidden="true"></div>
            <span class="recipe-poster-card__badge-corner"><?= App::e($r['difficulty']) ?></span>
            <div class="recipe-poster-card__body">
              <span class="recipe-poster-card__code"><?= App::e($r['code'] ?: 'BAKING RECIPE') ?></span>
              <h2 class="recipe-poster-card__title"><?= App::e($r['title']) ?></h2>
              <div class="recipe-poster-card__meta">
                <span>&#9733; <?= App::e($r['rating_avg'] ?? '4.8') ?></span>
                <span>&middot;</span>
                <span><?= App::e($r['time_label']) ?></span>
                <span>&middot;</span>
                <span><?= App::e($r['people_label'] ?? '4 người') ?></span>
              </div>
              <a href="<?= App::e($recUrl) ?>" class="recipe-poster-card__cta" style="position:relative;z-index:4;">
                Xem công thức &rarr;
              </a>
            </div>
          </article>
        <?php endforeach; ?>
      </div>
    </section>
  <?php endif; ?>
</main>
