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
    <?php foreach ($tagsList as $tag): ?>
      <a href="<?= App::e(App::url('?' . http_build_query([
          'c' => 'recipe',
          'a' => 'index',
          'tag' => $tag,
          'q' => $activeQuery,
          'difficulty' => $activeDiff,
          'max_minutes' => $activeTime,
      ]))) ?>"
         class="blog-filter-btn <?= $activeTag === $tag ? 'active' : '' ?>"><?= App::e($tag) ?></a>
    <?php endforeach; ?>
  </div>

  <form method="get" action="<?= App::e(App::url('index.php')) ?>" class="recipes-controls-panel" aria-label="Tìm kiếm và lọc nâng cao công thức">
    <input type="hidden" name="c" value="recipe">
    <input type="hidden" name="a" value="index">
    <input type="hidden" name="tag" value="<?= App::e($activeTag) ?>">

    <div class="recipes-controls-panel__left">
      <label class="visually-hidden" for="recipe-search-input">Tìm tên bánh hoặc nguyên liệu</label>
      <input type="search" id="recipe-search-input" name="q" class="form-input" value="<?= App::e($filters['q'] ?? '') ?>" placeholder="Tìm theo tên bánh, nguyên liệu (bột số 8, cacao, bơ lạt)..." style="flex:1 1 240px;min-width:0;">
    </div>
    <div class="recipes-controls-panel__right">
      <select id="recipe-filter-diff" name="difficulty" class="form-input" style="width:auto;min-width:150px;">
        <option value="Tất cả">Tất cả độ khó</option>
        <option value="Dễ" <?= $activeDiff === 'Dễ' ? 'selected' : '' ?>>Độ khó: Dễ</option>
        <option value="Trung bình" <?= $activeDiff === 'Trung bình' ? 'selected' : '' ?>>Độ khó: Trung bình</option>
      </select>
      <select id="recipe-filter-time" name="max_minutes" class="form-input" style="width:auto;min-width:165px;">
        <option value="0">Mọi thời gian</option>
        <option value="30" <?= $activeTime === 30 ? 'selected' : '' ?>>Nhanh (&le; 35 phút)</option>
        <option value="60" <?= $activeTime === 60 ? 'selected' : '' ?>>Vừa (36 – 65 phút)</option>
        <option value="61" <?= $activeTime === 61 ? 'selected' : '' ?>>Công phu (&gt; 65 phút)</option>
      </select>
      <button type="submit" class="btn btn--primary btn--sm">Lọc</button>
      <span class="blog-count-pill"><?= count($recipes) ?> công thức</span>
    </div>
  </form>

  <?php if (empty($recipes)): ?>
    <div class="php-card" style="text-align:center;padding:42px 20px;background:#fff8ed;border:1.5px dashed #c88b52;">
      <h2 style="color:#70452b;margin-top:0;">Không tìm thấy công thức phù hợp</h2>
      <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="btn btn--primary">Xem toàn bộ công thức</a>
    </div>
  <?php else: ?>
    <div class="recipes-editorial-grid">
      <?php foreach ($recipes as $r): ?>
        <article class="recipe-editorial-card php-card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;">
          <img src="<?= App::e(App::asset($r['image_path'])) ?>" alt="<?= App::e($r['title']) ?>" style="width:100%;height:200px;object-fit:cover;">
          <div style="padding:18px;flex:1;display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <div style="display:flex;justify-content:space-between;font-size:12px;color:#c88b52;font-weight:700;">
                <span><?= App::e($r['code']) ?> · <?= App::e($r['category']) ?></span>
                <span>&#9733; <?= App::e($r['rating_avg']) ?></span>
              </div>
              <h2 style="margin:8px 0;font-size:18px;color:#70452b;"><?= App::e($r['title']) ?></h2>
              <p style="font-size:13.5px;color:#6e4b34;margin:0 0 12px;line-height:1.55;"><?= App::e($r['subtitle']) ?></p>
              <div style="font-size:12.5px;color:#7c5c46;margin-bottom:14px;">
                Thời gian: <strong><?= App::e($r['time_label']) ?></strong> · Độ khó: <strong><?= App::e($r['difficulty']) ?></strong>
              </div>
            </div>
            <a href="<?= App::e(App::url('?c=recipe&a=detail&id=' . urlencode($r['slug']))) ?>" class="btn btn--primary btn--full">Mở công thức &amp; Chọn combo</a>
          </div>
        </article>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</main>
