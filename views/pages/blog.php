<?php
declare(strict_types=1);
$cats = ['all' => 'Tất cả', 'Bí quyết làm bánh' => 'Bí quyết làm bánh', 'Hiểu về nguyên liệu' => 'Hiểu về nguyên liệu', 'Kỹ thuật & dụng cụ' => 'Kỹ thuật & dụng cụ', 'Cảm hứng vào bếp' => 'Cảm hứng vào bếp'];
$selCat = (string) ($selectedCategory ?? 'all');
?>
<main class="php-page-container">
  <div class="php-card" style="background:linear-gradient(135deg,#fff8ed,#f9ebd4);margin-bottom:24px;">
    <h1 style="margin:0 0 8px;color:#70452b;">Blog &amp; Cẩm Nang Làm Bánh BakeMate</h1>
    <p style="margin:0;color:#6e4b34;">Chia sẻ kiến thức nguyên liệu, bí quyết chọn dụng cụ và hướng dẫn làm bánh tại nhà theo từng công thức.</p>
  </div>

  <form method="get" action="<?= App::e(App::url('index.php')) ?>" class="php-card" style="display:grid;gap:14px;margin-bottom:22px;">
    <input type="hidden" name="c" value="home">
    <input type="hidden" name="a" value="blog">
    <input type="hidden" name="category" value="<?= App::e($selCat) ?>">
    <div class="blog-search-form" style="max-width:460px;">
      <input type="search" name="q" value="<?= App::e($searchQuery ?? '') ?>" class="form-input blog-search-input" placeholder="Tìm bài viết, mẹo làm bánh...">
      <button type="submit" class="btn btn--primary blog-search-form__btn">Tìm</button>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <?php foreach ($cats as $ck => $cl): ?>
        <a href="<?= App::e(App::url('?c=home&a=blog&category=' . urlencode($ck))) ?>"
           class="btn btn--sm <?= ($selCat === $ck || ($selCat === 'Tất cả' && $ck === 'all')) ? 'btn--primary' : 'btn--outline' ?>">
          <?= App::e($cl) ?>
        </a>
      <?php endforeach; ?>
    </div>
  </form>

  <?php if (empty($posts)): ?>
    <div class="php-card" style="text-align:center;padding:42px 20px;">
      <h2 style="color:#70452b;margin-top:0;">Không tìm thấy bài viết phù hợp</h2>
      <a href="<?= App::e(App::url('?c=home&a=blog')) ?>" class="btn btn--primary">Xem tất cả bài viết</a>
    </div>
  <?php else: ?>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;">
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
                <span><?= App::e($post['read_time']) ?></span>
                <?php if (!empty($post['difficulty'])): ?>
                  <span>·</span>
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
</main>
