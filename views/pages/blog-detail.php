<?php
declare(strict_types=1);
?>
<main class="page-container blog-page">
  <?php if (!$post): ?>
    <div class="no-products-message">
      <strong>Không tìm thấy bài viết bạn yêu cầu</strong>
      <p>Bài viết có thể đã được cập nhật hoặc đường dẫn chưa chính xác.</p>
      <a href="<?= App::e(App::url('?c=home&a=blog')) ?>" class="btn btn--primary" style="margin-top:12px;">Quay lại trang Blog</a>
    </div>
  <?php else: ?>
    <nav class="breadcrumb" aria-label="Đường dẫn điều hướng">
      <ul class="breadcrumb__list">
        <li class="breadcrumb__item"><a href="<?= App::e(App::url('')) ?>">Trang chủ</a></li>
        <li class="breadcrumb__separator">/</li>
        <li class="breadcrumb__item"><a href="<?= App::e(App::url('?c=home&a=blog')) ?>">Blog</a></li>
        <li class="breadcrumb__separator">/</li>
        <li class="breadcrumb__item active"><?= App::e($post['title']) ?></li>
      </ul>
    </nav>

    <article class="blog-detail-article" style="max-width:860px;margin:0 auto;background:#ffffff;border:1px solid #eadbc6;border-radius:18px;padding:28px;box-shadow:0 8px 26px rgba(74,46,25,0.06);">
      <div class="blog-modal__hero">
        <img src="<?= App::e(App::asset($post['image_path'])) ?>" alt="<?= App::e($post['title']) ?>" class="blog-modal__img">
        <?php if (!empty($post['content']['hero_caption'])): ?>
          <p class="blog-figcaption"><?= App::e($post['content']['hero_caption']) ?></p>
        <?php endif; ?>
      </div>

      <div class="blog-modal__header">
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px;">
          <span class="blog-modal__badge"><?= App::e($post['category']) ?></span>
          <?php if (!empty($post['display_mode'])): ?>
            <span class="blog-format-badge" style="position:static;"><?= App::e($post['display_mode']) ?></span>
          <?php endif; ?>
        </div>
        <h1 class="blog-modal__title"><?= App::e($post['title']) ?></h1>
        <p class="blog-modal__meta">
          <?= App::e($post['author']) ?> &middot; <?= App::e($post['published_at_label']) ?> &middot; <?= App::e($post['read_time']) ?>
          <?php if (!empty($post['difficulty'])): ?> &middot; Độ khó: <?= App::e($post['difficulty']) ?><?php endif; ?>
          <?php if (!empty($post['content']['yield_note'])): ?> &middot; Khẩu phần: <?= App::e($post['content']['yield_note']) ?><?php endif; ?>
        </p>
      </div>

      <p class="blog-modal__lead"><?= App::e($post['excerpt']) ?></p>

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
            <a href="<?= App::e(str_replace('/embed/', '/watch?v=', (string) $post['video_url'])) ?>" target="_blank" rel="noopener noreferrer" class="btn btn--outline-dark">
              Mở video trên YouTube (King Arthur Baking) &nearr;
            </a>
            <?php if ($post['slug'] === 'post-banh-quy-bo'): ?>
              <a href="<?= App::e(App::url('?c=product&a=detail&id=7')) ?>" class="btn btn--primary">
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

      <?php $rich = is_array($post['content'] ?? null) ? $post['content'] : null; ?>
      <?php if ($rich): ?>
        <?php if (!empty($rich['intro_title']) || !empty($rich['intro_paragraphs'])): ?>
          <section class="blog-editorial-block">
            <?php if (!empty($rich['intro_title'])): ?>
              <h2 style="color:#70452b;font-size:20px;margin:0 0 10px;"><?= App::e($rich['intro_title']) ?></h2>
            <?php endif; ?>
            <?php foreach (($rich['intro_paragraphs'] ?? []) as $para): ?>
              <p style="line-height:1.75;color:#4a2d1b;font-size:15px;margin:0 0 10px;"><?= App::e($para) ?></p>
            <?php endforeach; ?>
          </section>
        <?php endif; ?>

        <?php if (!empty($rich['prep_groups'])): ?>
          <section class="blog-editorial-block" style="background:#fdf8f1;border:1px solid #efe3d2;border-radius:12px;padding:16px 18px;margin:18px 0;">
            <h2 style="color:#70452b;font-size:19px;margin:0 0 10px;">Chuẩn bị nguyên liệu &amp; dụng cụ</h2>
            <div style="display:grid;gap:12px;">
              <?php foreach ($rich['prep_groups'] as $grp): ?>
                <div>
                  <strong style="color:#4a2d1b;font-size:14.5px;display:block;margin-bottom:4px;"><?= App::e($grp['label'] ?? '') ?>:</strong>
                  <ul style="margin:0;padding-left:20px;color:#4a2d1b;line-height:1.65;font-size:14.5px;">
                    <?php foreach (($grp['items'] ?? []) as $gItem): ?>
                      <li><?= App::e($gItem) ?></li>
                    <?php endforeach; ?>
                  </ul>
                </div>
              <?php endforeach; ?>
            </div>
          </section>
        <?php endif; ?>

        <?php if (!empty($rich['step_blocks'])): ?>
          <section class="blog-editorial-block">
            <?php foreach ($rich['step_blocks'] as $blk): ?>
              <div style="margin-bottom:20px;">
                <h3 style="color:#70452b;font-size:18px;margin:0 0 8px;"><?= App::e($blk['title'] ?? '') ?></h3>
                <?php foreach (($blk['paragraphs'] ?? []) as $sp): ?>
                  <p style="line-height:1.75;color:#4a2d1b;font-size:15px;margin:0 0 8px;"><?= App::e($sp) ?></p>
                <?php endforeach; ?>
                <?php if (!empty($blk['video_article_url'])): ?>
                  <p style="margin:8px 0 0;">
                    <a href="<?= App::e($blk['video_article_url']) ?>" target="_blank" rel="noopener noreferrer" class="btn btn--outline-dark">
                      🎬 <?= App::e($blk['video_label'] ?? 'Xem video hướng dẫn thực hành') ?> &nearr;
                    </a>
                  </p>
                <?php endif; ?>
                <?php if (!empty($blk['image'])): ?>
                  <figure style="margin:12px 0 6px;">
                    <img src="<?= App::e(App::asset($blk['image'])) ?>" alt="<?= App::e($blk['caption'] ?? $post['title']) ?>" loading="lazy" style="width:100%;max-height:360px;object-fit:cover;border-radius:10px;">
                    <?php if (!empty($blk['caption'])): ?>
                      <figcaption class="blog-figcaption"><?= App::e($blk['caption']) ?></figcaption>
                    <?php endif; ?>
                  </figure>
                <?php endif; ?>
              </div>
            <?php endforeach; ?>
          </section>
        <?php endif; ?>

        <?php if (!empty($rich['mistakes'])): ?>
          <section class="blog-mistakes-box">
            <h2 style="color:#70452b;font-size:19px;margin:0 0 10px;"><?= App::e($rich['mistakes_title'] ?? 'Những lỗi thường gặp') ?></h2>
            <ul style="margin:0;padding-left:20px;line-height:1.7;color:#4a2d1b;font-size:14.5px;">
              <?php foreach ($rich['mistakes'] as $mk): ?>
                <li style="margin-bottom:6px;"><strong><?= App::e($mk['label'] ?? '') ?>:</strong> <?= App::e($mk['desc'] ?? '') ?></li>
              <?php endforeach; ?>
            </ul>
          </section>
        <?php endif; ?>

        <?php if (!empty($rich['tips'])): ?>
          <section class="blog-editorial-block" style="background:#fffaf2;border-left:4px solid #c88b52;padding:14px 16px;border-radius:8px;margin:18px 0;">
            <h2 style="color:#70452b;font-size:18px;margin:0 0 8px;">Mẹo nhỏ từ BakeMate</h2>
            <?php foreach ((array) $rich['tips'] as $tp): ?>
              <p style="line-height:1.7;color:#4a2d1b;font-size:14.5px;margin:0 0 6px;"><?= App::e($tp) ?></p>
            <?php endforeach; ?>
          </section>
        <?php endif; ?>

        <?php if (!empty($rich['conclusion'])): ?>
          <section class="blog-editorial-block">
            <h2 style="color:#70452b;font-size:18px;margin:0 0 8px;">Lời kết</h2>
            <?php foreach ((array) $rich['conclusion'] as $cp): ?>
              <p style="line-height:1.75;color:#4a2d1b;font-size:15px;margin:0 0 8px;"><?= App::e($cp) ?></p>
            <?php endforeach; ?>
          </section>
        <?php endif; ?>
      <?php else: ?>
        <div class="blog-modal__section">
          <h3>Các bước thực hiện &amp; Lưu ý quan trọng</h3>
          <ol class="blog-modal__steps">
            <?php foreach ($post['steps'] as $st): ?>
              <li><?= App::e($st) ?></li>
            <?php endforeach; ?>
          </ol>
        </div>

        <?php if (count($post['gallery'] ?? []) > 1): ?>
          <section style="margin-top:18px;">
            <h3 style="color:#70452b;font-size:18px;margin-bottom:8px;">Hình ảnh minh họa thực tế</h3>
            <div class="blog-gallery-grid">
              <?php foreach ($post['gallery'] as $gImg): ?>
                <img src="<?= App::e(App::asset($gImg)) ?>" alt="<?= App::e($post['title']) ?>" loading="lazy">
              <?php endforeach; ?>
            </div>
          </section>
        <?php endif; ?>
      <?php endif; ?>

      <?php if (!empty($relatedRecipe)):
        $comboItemsPayload = [];
        foreach (($relatedRecipe['ingredients'] ?? []) as $ing) {
            if (!empty($ing['purchase_available']) && !empty($ing['product_id']) && !empty($ing['variant'])) {
                $comboItemsPayload[] = [
                    'product_id' => (int) $ing['product_id'],
                    'option_index' => (int) ($ing['option_index'] ?? 0),
                    'quantity' => max(1, (int) ($ing['packs_needed'] ?? 1)),
                ];
            }
        }
      ?>
        <section class="blog-modal__combo-box" aria-label="Combo nguyên liệu Recipe-to-Cart">
          <div class="blog-modal__combo-head">
            <div>
              <span class="sub-badge">Chuẩn bị nguyên liệu cùng BakeMate</span>
              <h3><?= App::e($relatedRecipe['title']) ?></h3>
              <p>Khẩu phần gợi ý: <?= App::e($relatedRecipe['yield_label'] ?? ((int) $relatedRecipe['default_servings'] . ' ' . $relatedRecipe['servings_unit'])) ?></p>
            </div>
            <div class="blog-modal__combo-total">
              <span>Trọn bộ chỉ</span>
              <strong><?= App::e(App::formatCurrency((int) $relatedRecipe['estimated_ingredients_cost'])) ?></strong>
            </div>
          </div>

          <ul class="blog-modal__ingredient-list">
            <?php foreach (($relatedRecipe['ingredients'] ?? []) as $ing):
              if (empty($ing['purchase_available']) || empty($ing['product']) || empty($ing['variant'])) continue;
              $linePrice = (int) $ing['variant']['price'] * max(1, (int) $ing['packs_needed']);
            ?>
              <li>
                <div>
                  <a href="<?= App::e(App::url('?c=product&a=detail&id=' . (int) $ing['product_id'])) ?>"><?= App::e($ing['product']['name']) ?></a>
                  <span class="ingredient-opt">(<?= (int) $ing['packs_needed'] ?> &times; <?= App::e($ing['variant']['short_label']) ?>)</span>
                  <small>Dùng cho công thức: <?= App::e($ing['scaled_amount']) ?> <?= App::e($ing['unit']) ?> <?= App::e($ing['name']) ?></small>
                </div>
                <strong><?= App::e(App::formatCurrency($linePrice)) ?></strong>
              </li>
            <?php endforeach; ?>
          </ul>

          <div class="blog-modal__combo-actions">
            <a href="<?= App::e(App::url('?c=recipe&a=detail&id=' . urlencode($relatedRecipe['slug']))) ?>" class="btn btn--outline-dark blog-modal__combo-btn">
              Điều chỉnh khẩu phần
            </a>
            <?php if (!empty($comboItemsPayload)): ?>
              <button type="button" id="btn-blog-add-combo" class="btn btn--primary blog-modal__combo-btn">
                Thêm combo vào giỏ
              </button>
            <?php endif; ?>
          </div>
        </section>

        <?php if (!empty($comboItemsPayload)): ?>
          <script>
          document.getElementById("btn-blog-add-combo")?.addEventListener("click", async function () {
            this.disabled = true;
            try {
              const res = await window.BakeApp.postJson("recipe", "ajaxAddComboToCart", {
                recipe_group_id: <?= json_encode((string) $relatedRecipe['slug']) ?>,
                items: <?= json_encode($comboItemsPayload) ?>
              });
              window.BakeApp.updateBadges(res.data.cart_count);
              window.BakeApp.showToast(res.message || "Đã thêm combo nguyên liệu vào giỏ hàng!", "success");
            } catch (err) {
              window.BakeApp.showToast(err.message, "error");
            } finally {
              this.disabled = false;
            }
          });
          </script>
        <?php endif; ?>
      <?php endif; ?>
    </article>

    <?php if (!empty($otherPosts)): ?>
      <section class="related-products-section" style="margin-top:40px;">
        <h2 class="section-heading">Bài viết liên quan</h2>
        <div class="blog-grid">
          <?php foreach ($otherPosts as $op):
            $opUrl = App::url('?c=home&a=blogDetail&id=' . urlencode($op['slug']));
          ?>
            <article class="blog-card">
              <a href="<?= App::e($opUrl) ?>" class="blog-card__media" aria-label="<?= App::e($op['title']) ?>">
                <img src="<?= App::e(App::asset($op['image_path'])) ?>" alt="<?= App::e($op['title']) ?>" class="blog-card__img" loading="lazy">
                <span class="blog-card__category"><?= App::e($op['category']) ?></span>
              </a>
              <div class="blog-card__body">
                <div>
                  <div class="blog-card__meta">
                    <span><?= App::e($op['read_time']) ?></span>
                  </div>
                  <h3 class="blog-card__title">
                    <a href="<?= App::e($opUrl) ?>"><?= App::e($op['title']) ?></a>
                  </h3>
                  <p class="blog-card__excerpt"><?= App::e($op['excerpt']) ?></p>
                </div>
                <div class="blog-card__bottom" style="display:flex;flex-direction:row;justify-content:space-between;align-items:center;border-top:1px solid #f0e4d3;padding-top:10px;font-size:12.5px;color:#7c5c46;">
                  <span><?= App::e($op['published_at_label']) ?></span>
                  <a href="<?= App::e($opUrl) ?>" class="blog-card__readmore">Đọc tiếp <span class="blog-card__arrow" aria-hidden="true">&rarr;</span></a>
                </div>
              </div>
            </article>
          <?php endforeach; ?>
        </div>
      </section>
    <?php endif; ?>

    <div class="back-navigation" style="margin-top:28px;">
      <a href="<?= App::e(App::url('?c=home&a=blog')) ?>" class="btn btn--outline-dark">&larr; Quay lại danh sách Blog</a>
    </div>
  <?php endif; ?>
</main>
