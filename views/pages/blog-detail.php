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
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:4px;">
        <span class="product-card__category"><?= App::e($post['category']) ?> · <?= App::e($post['read_time']) ?></span>
        <?php if (!empty($post['display_mode'])): ?>
          <span class="blog-format-badge" style="position:static;"><?= App::e($post['display_mode']) ?></span>
        <?php endif; ?>
      </div>
      <h1 style="margin:8px 0 10px;color:#70452b;font-size:28px;"><?= App::e($post['title']) ?></h1>
      <p style="font-size:13.5px;color:#7c5c46;margin:0 0 18px;">Tác giả: <strong><?= App::e($post['author']) ?></strong> · Ngày đăng: <?= App::e($post['published_at_label']) ?></p>

      <img src="<?= App::e(App::asset($post['image_path'])) ?>" alt="<?= App::e($post['title']) ?>" style="width:100%;max-height:380px;object-fit:cover;border-radius:12px;margin-bottom:18px;">

      <p style="font-size:16px;font-weight:600;color:#4a2d1b;line-height:1.7;background:#fff8ed;padding:14px 16px;border-left:4px solid #c88b52;border-radius:8px;margin-bottom:18px;">
        <?= App::e($post['excerpt']) ?>
      </p>

      <?php if (!empty($post['video_url'])): ?>
        <section class="blog-video-box" aria-label="Video hướng dẫn thực hành">
          <strong style="display:block;color:#70452b;margin-bottom:10px;font-size:15px;">
            🎬 <?= App::e($post['video_title'] ?? 'Video hướng dẫn thực hành') ?>
          </strong>
          <div class="blog-video-embed">
            <iframe
              src="<?= App::e($post['video_url']) ?>"
              title="<?= App::e($post['video_title'] ?? $post['title']) ?>"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;align-items:center;">
            <a href="<?= App::e(str_replace('/embed/', '/watch?v=', (string) $post['video_url'])) ?>" target="_blank" rel="noopener noreferrer" class="btn btn--outline-dark btn--sm">
              Mở video trên YouTube (King Arthur Baking) &nearr;
            </a>
            <?php if ($post['slug'] === 'post-banh-quy-bo'): ?>
              <a href="<?= App::e(App::url('?c=product&a=detail&id=7')) ?>" class="btn btn--primary btn--sm">
                Xem Cân điện tử nhà bếp tại Shop &rarr;
              </a>
            <?php endif; ?>
          </div>
        </section>
      <?php endif; ?>

      <?php if ($post['slug'] === 'post-phan-biet-bot-mi'): ?>
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
                <td><a href="<?= App::e(App::url('?c=product&a=detail&id=1')) ?>" style="font-weight:700;color:#8b1e24;">Bột mì Baker's Choice số 8 &rarr;</a></td>
              </tr>
              <tr>
                <td><strong>Bột mì số 11 (Bread Flour)</strong></td>
                <td>11.5% – 13%</td>
                <td>Bánh mì hoa cúc, Baguette, Pizza</td>
                <td><a href="<?= App::e(App::url('?c=product&a=detail&id=2')) ?>" style="font-weight:700;color:#8b1e24;">Bột mì Baker's Choice số 11 &rarr;</a></td>
              </tr>
              <tr>
                <td><strong>Bột mì đa dụng (All-Purpose)</strong></td>
                <td>9.5% – 11.5%</td>
                <td>Muffin, Brownie, Pancake</td>
                <td><a href="<?= App::e(App::url('?c=product&a=detail&id=3')) ?>" style="font-weight:700;color:#8b1e24;">Bột mì đa dụng Meizan &rarr;</a></td>
              </tr>
            </tbody>
          </table>
        </section>
      <?php endif; ?>

      <h2 style="color:#70452b;font-size:20px;">Các bước thực hiện &amp; Lưu ý quan trọng</h2>
      <ol style="padding-left:20px;line-height:1.75;color:#4a2d1b;font-size:15px;">
        <?php foreach ($post['steps'] as $st): ?>
          <li style="margin-bottom:10px;"><?= App::e($st) ?></li>
        <?php endforeach; ?>
      </ol>

      <?php if (count($post['gallery'] ?? []) > 1): ?>
        <section style="margin-top:18px;">
          <h2 style="color:#70452b;font-size:18px;margin-bottom:8px;">Hình ảnh minh họa thực tế</h2>
          <div class="blog-gallery-grid">
            <?php foreach ($post['gallery'] as $gImg): ?>
              <img src="<?= App::e(App::asset($gImg)) ?>" alt="<?= App::e($post['title']) ?>" loading="lazy">
            <?php endforeach; ?>
          </div>
        </section>
      <?php endif; ?>

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
