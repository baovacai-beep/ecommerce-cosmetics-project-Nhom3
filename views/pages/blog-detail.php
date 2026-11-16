<?php
declare(strict_types=1);
?>
<main class="php-page-container">
  <?php if (!$post): ?>
    <div class="php-card" style="text-align:center;padding:48px 20px;">
      <h1 style="color:#70452b;margin-top:0;">Bài viết không tồn tại</h1>
      <a href="<?= App::e(App::url('?c=home&a=blog')) ?>" class="btn btn--primary">Quay lại trang Blog</a>
    </div>
  <?php else: ?>
    <nav style="font-size:13.5px;color:#7c5c46;margin-bottom:16px;">
      <a href="<?= App::e(App::url('')) ?>">Trang chủ</a> &rsaquo;
      <a href="<?= App::e(App::url('?c=home&a=blog')) ?>">Blog</a> &rsaquo;
      <span><?= App::e($post['title']) ?></span>
    </nav>

    <article class="php-card" style="max-width:860px;margin:0 auto;">
      <span class="product-card__category"><?= App::e($post['category']) ?> · <?= App::e($post['read_time']) ?></span>
      <h1 style="margin:8px 0 10px;color:#70452b;font-size:28px;"><?= App::e($post['title']) ?></h1>
      <p style="font-size:13.5px;color:#7c5c46;margin:0 0 18px;">Tác giả: <strong><?= App::e($post['author']) ?></strong> · Ngày đăng: <?= App::e($post['published_at_label']) ?></p>

      <img src="<?= App::e(App::asset($post['image_path'])) ?>" alt="<?= App::e($post['title']) ?>" style="width:100%;max-height:380px;object-fit:cover;border-radius:12px;margin-bottom:18px;">

      <p style="font-size:16px;font-weight:600;color:#4a2d1b;line-height:1.7;background:#fff8ed;padding:14px 16px;border-left:4px solid #c88b52;border-radius:8px;margin-bottom:18px;">
        <?= App::e($post['excerpt']) ?>
      </p>

      <h2 style="color:#70452b;font-size:20px;">Các bước thực hiện &amp; Lưu ý quan trọng</h2>
      <ol style="padding-left:20px;line-height:1.75;color:#4a2d1b;font-size:15px;">
        <?php foreach ($post['steps'] as $st): ?>
          <li style="margin-bottom:10px;"><?= App::e($st) ?></li>
        <?php endforeach; ?>
      </ol>

      <?php if (!empty($relatedRecipe)): ?>
        <div style="margin-top:24px;padding:18px;border:2px dashed #c88b52;border-radius:12px;background:#fff8ed;display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;">
          <div>
            <span style="font-size:12px;font-weight:700;color:#c88b52;text-transform:uppercase;">Recipe-to-Cart Độc quyền</span>
            <h3 style="margin:4px 0;color:#70452b;"><?= App::e($relatedRecipe['title']) ?></h3>
            <p style="margin:0;font-size:13.5px;color:#7c5c46;">Ước tính nguyên liệu: <strong><?= App::e(App::formatCurrency((int) $relatedRecipe['estimated_ingredients_cost'])) ?></strong></p>
          </div>
          <a href="<?= App::e(App::url('?c=recipe&a=detail&id=' . urlencode($relatedRecipe['slug']))) ?>" class="btn btn--primary">Mở công thức &amp; Chọn mua combo</a>
        </div>
      <?php endif; ?>
    </article>
  <?php endif; ?>
</main>
