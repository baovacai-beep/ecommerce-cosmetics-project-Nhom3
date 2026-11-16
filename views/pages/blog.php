<?php
declare(strict_types=1);
$cats = ['all' => 'Tất cả', 'Kiến thức làm bánh' => 'Kiến thức làm bánh', 'Nguyên liệu làm bánh' => 'Nguyên liệu làm bánh', 'Dụng cụ làm bánh' => 'Dụng cụ làm bánh', 'Công thức làm bánh' => 'Công thức làm bánh', 'Mẹo & kinh nghiệm' => 'Mẹo & kinh nghiệm'];
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
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <input type="search" name="q" value="<?= App::e($searchQuery ?? '') ?>" class="form-input" style="flex:1;min-width:220px;" placeholder="Tìm kiếm bài viết, từ khóa (bột mì, brownie, mousse)...">
      <button type="submit" class="btn btn--primary">Tìm bài viết</button>
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
      <?php foreach ($posts as $post): ?>
        <article class="php-card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;">
          <img src="<?= App::e(App::asset($post['image_path'])) ?>" alt="<?= App::e($post['title']) ?>" style="width:100%;height:190px;object-fit:cover;">
          <div style="padding:16px;flex:1;display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <span class="product-card__category"><?= App::e($post['category']) ?> · <?= App::e($post['read_time']) ?></span>
              <h2 style="margin:6px 0 8px;font-size:17.5px;color:#70452b;">
                <a href="<?= App::e(App::url('?c=home&a=blogDetail&id=' . urlencode($post['slug']))) ?>" style="color:inherit;text-decoration:none;"><?= App::e($post['title']) ?></a>
              </h2>
              <p style="font-size:13.5px;color:#6e4b34;line-height:1.6;margin:0 0 12px;"><?= App::e($post['excerpt']) ?></p>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid #f0e4d3;padding-top:10px;font-size:12.5px;color:#7c5c46;">
              <span><?= App::e($post['published_at_label']) ?></span>
              <a href="<?= App::e(App::url('?c=home&a=blogDetail&id=' . urlencode($post['slug']))) ?>" style="font-weight:700;color:#70452b;text-decoration:none;">Đọc tiếp &rarr;</a>
            </div>
          </div>
        </article>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</main>
