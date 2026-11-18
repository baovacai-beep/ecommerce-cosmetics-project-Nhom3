<?php
declare(strict_types=1);
$statusLabels = ['pending' => 'Chờ xác nhận', 'preparing' => 'Đang chuẩn bị', 'shipping' => 'Đang giao hàng', 'completed' => 'Hoàn tất', 'cancelled' => 'Đã hủy'];
?>
<main class="php-page-container">
  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
    <div>
      <span style="padding:4px 10px;border-radius:999px;background:#fff8ed;border:1px solid #c88b52;font-size:12px;font-weight:700;color:#70452b;">
        <?= !empty($currentUser['is_super_admin']) ? 'Super Admin · Toàn quyền hệ thống' : 'Quản trị viên (Admin)' ?>
      </span>
      <h1 style="margin:6px 0 4px;color:#70452b;">Trung tâm Quản trị BakeMate</h1>
      <p style="margin:0;color:#7c5c46;font-size:13.5px;">Xin chào <?= App::e($currentUser['full_name'] ?? '') ?> — Quản lý Sản phẩm, Công thức, Đơn hàng, Voucher, Blog, Tài khoản &amp; Nhật ký bảo mật.</p>
    </div>
    <div style="display:flex;gap:10px;">
      <a href="<?= App::e(App::url('')) ?>" class="btn btn--outline btn--sm">Xem cửa hàng</a>
      <a href="<?= App::e(App::url('?c=auth&a=logout')) ?>" class="btn btn--primary btn--sm">Đăng xuất</a>
    </div>
  </div>

  <!-- KPI Cards -->
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px;margin-bottom:22px;">
    <div class="php-card"><span style="font-size:12px;color:#7c5c46;">Tổng doanh thu</span><div style="font-size:22px;font-weight:800;color:#70452b;"><?= App::e(App::formatCurrency((int) ($stats['total_revenue'] ?? 0))) ?></div></div>
    <div class="php-card"><span style="font-size:12px;color:#7c5c46;">Đơn hàng / Chờ duyệt</span><div style="font-size:22px;font-weight:800;color:#70452b;"><?= (int) ($stats['total_orders'] ?? 0) ?> / <?= (int) ($stats['pending_orders'] ?? 0) ?></div></div>
    <div class="php-card"><span style="font-size:12px;color:#7c5c46;">Sản phẩm / Công thức</span><div style="font-size:22px;font-weight:800;color:#70452b;"><?= (int) ($stats['active_products'] ?? 0) ?> / <?= (int) ($stats['total_recipes'] ?? 0) ?></div></div>
    <div class="php-card"><span style="font-size:12px;color:#7c5c46;">Tài khoản / Liên hệ mới</span><div style="font-size:22px;font-weight:800;color:#70452b;"><?= (int) ($stats['total_users'] ?? 0) ?> / <?= (int) ($stats['new_contacts'] ?? 0) ?></div></div>
  </div>

  <!-- Tabs Navigation -->
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px;">
    <?php foreach ([
        'orders' => 'Đơn hàng & Hủy đơn',
        'products' => 'Sản phẩm & Kho',
        'recipes' => 'Công thức (F15)',
        'coupons' => 'Voucher (F22)',
        'blog' => 'Blog CMS',
        'reviews' => 'Đánh giá (F21)',
        'users' => 'Tài khoản & Logs',
        'contacts' => 'Liên hệ',
    ] as $tk => $tl): ?>
      <button type="button" class="btn btn--sm <?= $tk === 'orders' ? 'btn--primary' : 'btn--outline' ?> js-admin-tab-btn" data-tab="<?= $tk ?>"><?= App::e($tl) ?></button>
    <?php endforeach; ?>
  </div>

  <!-- Tab 1: Orders + Cancel Requests -->
  <section class="php-card js-admin-panel" data-panel="orders">
    <h2 style="margin:0 0 12px;color:#70452b;">Quản lý Đơn hàng</h2>
    <?php if (!empty($cancelRequests)): ?>
      <div style="background:#fff8ed;border:1px solid #e6c9a2;border-radius:10px;padding:12px;margin-bottom:16px;">
        <strong style="color:#b45309;">Yêu cầu hủy đơn cần duyệt (<?= count($cancelRequests) ?>):</strong>
        <?php foreach ($cancelRequests as $cr): ?>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f0e4d3;font-size:13.5px;">
            <span>Đơn <strong>#<?= App::e($cr['order_code']) ?></strong> (<?= App::e($cr['customer_name']) ?>): <?= App::e($cr['reason']) ?> — <strong><?= App::e($cr['status']) ?></strong></span>
            <?php if ($cr['status'] === 'pending'): ?>
              <div style="display:flex;gap:6px;">
                <button type="button" class="btn btn--primary btn--sm js-admin-cancel-decision" data-id="<?= (int) $cr['id'] ?>" data-decision="approve">Duyệt hủy &amp; Hoàn kho</button>
                <button type="button" class="btn btn--outline btn--sm js-admin-cancel-decision" data-id="<?= (int) $cr['id'] ?>" data-decision="reject">Từ chối</button>
              </div>
            <?php endif; ?>
          </div>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>

    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
        <thead>
          <tr style="background:#fff8ed;color:#70452b;text-align:left;">
            <th style="padding:10px;">Mã đơn</th>
            <th style="padding:10px;">Khách hàng</th>
            <th style="padding:10px;">Tổng tiền</th>
            <th style="padding:10px;">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($orders as $o): ?>
            <tr style="border-bottom:1px solid #f0e4d3;">
              <td style="padding:10px;font-weight:700;">#<?= App::e($o['order_code']) ?></td>
              <td style="padding:10px;"><?= App::e($o['customer_name']) ?> · <?= App::e($o['customer_phone']) ?><div style="font-size:12px;color:#7c5c46;"><?= App::e($o['street_address'] . ', ' . $o['province']) ?></div></td>
              <td style="padding:10px;font-weight:700;"><?= App::e(App::formatCurrency((int) $o['total_amount'])) ?></td>
              <td style="padding:10px;">
                <select class="form-input js-admin-order-status" data-order-id="<?= (int) $o['id'] ?>" style="width:auto;">
                  <?php foreach ($statusLabels as $sk => $sl): ?>
                    <option value="<?= $sk ?>" <?= $o['status'] === $sk ? 'selected' : '' ?>><?= App::e($sl) ?></option>
                  <?php endforeach; ?>
                </select>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </section>

  <!-- Tab 2: Products CRUD -->
  <section class="php-card js-admin-panel" data-panel="products" hidden>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
      <h2 style="margin:0;color:#70452b;">Quản lý Sản phẩm &amp; Tồn kho</h2>
      <button type="button" class="btn btn--primary btn--sm" id="btn-admin-new-prod">+ Thêm sản phẩm mới</button>
    </div>

    <form id="admin-prod-form" enctype="multipart/form-data" hidden style="background:#fff8ed;border:1px solid #e6c9a2;border-radius:12px;padding:16px;margin-bottom:18px;display:grid;gap:10px;">
      <input type="hidden" name="id" id="ap-id" value="0">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;">
        <input type="text" name="name" id="ap-name" class="form-input" placeholder="Tên sản phẩm *" required>
        <select name="category_name" id="ap-cat" class="form-input">
          <option value="Nguyên liệu">Nguyên liệu</option>
          <option value="Dụng cụ">Dụng cụ</option>
          <option value="Phụ kiện & Đóng gói">Phụ kiện &amp; Đóng gói</option>
        </select>
        <input type="text" name="brand_name" id="ap-brand" class="form-input" placeholder="Thương hiệu" value="BakeMate">
        <input type="text" name="packaging_label" id="ap-pack" class="form-input" placeholder="Quy cách (vd: Gói 500g)" value="Tiêu chuẩn">
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;">
        <input type="number" name="price" id="ap-price" class="form-input" placeholder="Giá bán (đ) *" min="1000" required>
        <input type="number" name="old_price" id="ap-old-price" class="form-input" placeholder="Giá gốc (đ)" min="1000">
        <input type="number" name="stock_qty" id="ap-stock" class="form-input" placeholder="Tồn kho" min="0" value="50">
        <select name="stock_status" id="ap-status" class="form-input">
          <option value="in_stock">Còn hàng</option>
          <option value="out_of_stock">Hết hàng</option>
          <option value="coming_soon">Sắp mở bán</option>
        </select>
      </div>
      <textarea name="description" id="ap-desc" class="form-input" rows="2" placeholder="Mô tả sản phẩm..."></textarea>
      <div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center;">
        <label><input type="checkbox" name="is_perishable" id="ap-perish" value="1"> Hàng tươi lạnh</label>
        <label><input type="checkbox" name="is_new" id="ap-new" value="1"> Sản phẩm mới</label>
        <label><input type="checkbox" name="is_featured" id="ap-feat" value="1"> Nổi bật</label>
        <input type="file" name="product_image" accept="image/jpeg,image/png,image/webp" class="form-input" style="max-width:260px;">
      </div>
      <div style="display:flex;gap:10px;">
        <button type="submit" class="btn btn--primary btn--sm">Lưu sản phẩm</button>
        <button type="button" class="btn btn--outline btn--sm" id="btn-admin-cancel-prod">Đóng</button>
      </div>
    </form>

    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
        <thead>
          <tr style="background:#fff8ed;color:#70452b;text-align:left;">
            <th style="padding:10px;">ID</th>
            <th style="padding:10px;">Sản phẩm</th>
            <th style="padding:10px;">Danh mục</th>
            <th style="padding:10px;">Giá</th>
            <th style="padding:10px;">Kho</th>
            <th style="padding:10px;">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($products as $p): ?>
            <tr style="border-bottom:1px solid #f0e4d3;<?= !empty($p['is_hidden']) ? 'opacity:0.55;' : '' ?>">
              <td style="padding:10px;">#<?= (int) $p['id'] ?></td>
              <td style="padding:10px;font-weight:700;color:#70452b;"><?= App::e($p['name']) ?></td>
              <td style="padding:10px;"><?= App::e($p['category_name']) ?></td>
              <td style="padding:10px;"><?= App::e(App::formatCurrency((int) $p['default_price'])) ?></td>
              <td style="padding:10px;"><?= (int) $p['default_stock_qty'] ?></td>
              <td style="padding:10px;display:flex;gap:6px;">
                <button type="button" class="btn btn--outline btn--sm js-admin-edit-prod"
                        data-prod='<?= App::e(json_encode([
                            'id' => (int) $p['id'],
                            'name' => $p['name'],
                            'category_name' => $p['category_name'],
                            'brand_name' => $p['brand_name'],
                            'packaging_label' => $p['packaging_label'],
                            'price' => (int) $p['default_price'],
                            'old_price' => (int) $p['default_old_price'],
                            'stock_qty' => (int) $p['default_stock_qty'],
                            'stock_status' => $p['stock_status'],
                            'description' => $p['description'],
                            'is_perishable' => !empty($p['is_perishable']),
                            'is_new' => !empty($p['is_new']),
                            'is_featured' => !empty($p['is_featured']),
                        ], JSON_UNESCAPED_UNICODE)) ?>'>Sửa</button>
                <button type="button" class="btn btn--outline btn--sm js-admin-hide-prod" data-id="<?= (int) $p['id'] ?>"><?= !empty($p['is_hidden']) ? 'Hiện lại' : 'Ẩn SP' ?></button>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </section>

  <!-- Tab 3: Recipes CRUD (F15) -->
  <section class="php-card js-admin-panel" data-panel="recipes" hidden>
    <h2 style="margin:0 0 12px;color:#70452b;">Quản lý Công thức làm bánh (F15)</h2>
    <form id="admin-recipe-form" style="background:#fff8ed;border-radius:12px;padding:14px;margin-bottom:16px;display:grid;gap:10px;">
      <input type="hidden" name="id" id="ar-id" value="0">
      <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:10px;">
        <input type="text" name="title" id="ar-title" class="form-input" placeholder="Tên công thức mới *" required>
        <input type="text" name="category" id="ar-cat" class="form-input" value="Bánh ngọt" placeholder="Danh mục">
        <input type="number" name="default_servings" id="ar-serv" class="form-input" min="1" value="4" placeholder="Số phần gốc">
        <input type="number" name="bake_minutes" id="ar-mins" class="form-input" min="5" value="35" placeholder="Phút nướng">
      </div>
      <input type="text" name="subtitle" id="ar-sub" class="form-input" placeholder="Mô tả ngắn công thức">
      <textarea name="steps_text" id="ar-steps" class="form-input" rows="3" placeholder="Mỗi dòng 1 bước hướng dẫn làm bánh..."></textarea>
      <label><input type="checkbox" name="is_published" value="1" checked> Công khai công thức</label>
      <div><button type="submit" class="btn btn--primary btn--sm">Lưu công thức</button></div>
    </form>

    <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
      <tbody>
        <?php foreach ($recipes as $rc): ?>
          <tr style="border-bottom:1px solid #f0e4d3;">
            <td style="padding:8px;font-weight:700;color:#70452b;"><?= App::e($rc['title']) ?></td>
            <td style="padding:8px;"><?= App::e($rc['category']) ?> · <?= (int) $rc['default_servings'] ?> phần</td>
            <td style="padding:8px;text-align:right;">
              <button type="button" class="btn btn--outline btn--sm js-admin-del-recipe" data-id="<?= (int) $rc['id'] ?>">Xóa</button>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </section>

  <!-- Tab 4: Coupons (F22) -->
  <section class="php-card js-admin-panel" data-panel="coupons" hidden>
    <h2 style="margin:0 0 12px;color:#70452b;">Quản lý Mã khuyến mãi (F22)</h2>
    <form id="admin-coupon-form" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;background:#fff8ed;padding:14px;border-radius:10px;margin-bottom:16px;">
      <input type="text" name="code" class="form-input" placeholder="Mã (vd: TET20)" required>
      <select name="discount_scope" class="form-input"><option value="product">Giảm tiền hàng</option><option value="shipping">Freeship</option></select>
      <select name="discount_type" class="form-input"><option value="percent">Theo %</option><option value="fixed">Số tiền cố định (đ)</option></select>
      <input type="number" name="discount_value" class="form-input" placeholder="Giá trị giảm" min="1" required>
      <input type="number" name="min_subtotal" class="form-input" placeholder="Đơn tối thiểu" min="0" value="0">
      <input type="text" name="description" class="form-input" placeholder="Mô tả ưu đãi" required>
      <button type="submit" class="btn btn--primary btn--sm">Lưu Voucher</button>
    </form>
    <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
      <tbody>
        <?php foreach ($coupons as $cp): ?>
          <tr style="border-bottom:1px solid #f0e4d3;">
            <td style="padding:8px;font-weight:800;color:#70452b;"><?= App::e($cp['code']) ?></td>
            <td style="padding:8px;"><?= App::e($cp['description']) ?></td>
            <td style="padding:8px;">Đã dùng: <?= (int) $cp['used_count'] ?> / <?= (int) $cp['usage_limit'] ?></td>
            <td style="padding:8px;"><button type="button" class="btn btn--outline btn--sm js-admin-toggle-coupon" data-id="<?= (int) $cp['id'] ?>"><?= !empty($cp['is_active']) ? 'Đang bật' : 'Đang tắt' ?></button></td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </section>

  <!-- Tab 5: Blog CMS -->
  <section class="php-card js-admin-panel" data-panel="blog" hidden>
    <h2 style="margin:0 0 12px;color:#70452b;">Quản lý Bài viết Blog</h2>
    <form id="admin-blog-form" style="display:grid;gap:10px;background:#fff8ed;padding:14px;border-radius:10px;margin-bottom:16px;">
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:10px;">
        <input type="text" name="title" class="form-input" placeholder="Tiêu đề bài viết *" required>
        <select name="category" class="form-input">
          <option value="Kiến thức làm bánh">Kiến thức làm bánh</option>
          <option value="Nguyên liệu làm bánh">Nguyên liệu làm bánh</option>
          <option value="Dụng cụ làm bánh">Dụng cụ làm bánh</option>
          <option value="Công thức làm bánh">Công thức làm bánh</option>
          <option value="Mẹo & kinh nghiệm">Mẹo &amp; kinh nghiệm</option>
        </select>
      </div>
      <textarea name="excerpt" class="form-input" rows="2" placeholder="Tóm tắt bài viết *" required></textarea>
      <textarea name="steps_text" class="form-input" rows="2" placeholder="Nội dung từng đoạn (mỗi dòng 1 đoạn)..."></textarea>
      <div><button type="submit" class="btn btn--primary btn--sm">Đăng bài Blog mới</button></div>
    </form>
    <?php foreach ($blogPosts as $bp): ?>
      <div style="padding:8px 0;border-bottom:1px solid #f0e4d3;font-size:13.5px;">
        <strong><?= App::e($bp['title']) ?></strong> · <span style="color:#7c5c46;"><?= App::e($bp['category']) ?></span>
      </div>
    <?php endforeach; ?>
  </section>

  <!-- Tab 6: Reviews Moderation (F21) -->
  <section class="php-card js-admin-panel" data-panel="reviews" hidden>
    <h2 style="margin:0 0 12px;color:#70452b;">Kiểm duyệt Đánh giá sản phẩm (F21)</h2>
    <?php if (empty($reviews)): ?>
      <p style="color:#7c5c46;">Chưa có đánh giá nào được gửi từ khách hàng.</p>
    <?php else: ?>
      <?php foreach ($reviews as $rv): ?>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f0e4d3;font-size:13.5px;">
          <div>
            <strong><?= App::e($rv['reviewer_name']) ?></strong> đánh giá <strong><?= App::e($rv['product_name']) ?></strong> (<?= (int) $rv['rating'] ?>/5):
            <div style="color:#4a2d1b;"><?= App::e($rv['comment']) ?></div>
          </div>
          <button type="button" class="btn btn--outline btn--sm js-admin-mod-review" data-id="<?= (int) $rv['id'] ?>" data-status="<?= $rv['status'] === 'approved' ? 'hidden' : 'approved' ?>">
            <?= $rv['status'] === 'approved' ? 'Ẩn đánh giá' : 'Hiện lại' ?>
          </button>
        </div>
      <?php endforeach; ?>
    <?php endif; ?>
  </section>

  <!-- Tab 7: Users & Security Logs -->
  <section class="php-card js-admin-panel" data-panel="users" hidden>
    <h2 style="margin:0 0 12px;color:#70452b;">Tài khoản &amp; Nhật ký bảo mật</h2>

    <?php if (!empty($currentUser['is_super_admin'])): ?>
      <form id="admin-create-priv-form" style="background:#fff8ed;padding:14px;border-radius:10px;margin-bottom:16px;display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;">
        <input type="text" name="full_name" class="form-input" placeholder="Họ tên *" required>
        <input type="email" name="email" class="form-input" placeholder="Email *" required>
        <input type="tel" name="phone" class="form-input" placeholder="Số điện thoại">
        <input type="password" name="password" class="form-input" placeholder="Mật khẩu (>=8 ký tự) *" minlength="8" required>
        <select name="role" class="form-input"><option value="staff">Nhân viên (Staff)</option><option value="admin">Quản trị viên (Admin)</option></select>
        <button type="submit" class="btn btn--primary btn--sm">Cấp tài khoản</button>
      </form>
    <?php endif; ?>

    <table style="width:100%;border-collapse:collapse;font-size:13.5px;margin-bottom:20px;">
      <tbody>
        <?php foreach ($users as $u):
          $isLocked = !empty($u['lock_until']) && strtotime((string) $u['lock_until']) > time();
        ?>
          <tr style="border-bottom:1px solid #f0e4d3;">
            <td style="padding:8px;"><strong><?= App::e($u['full_name']) ?></strong><div style="font-size:12px;color:#7c5c46;"><?= App::e($u['email']) ?></div></td>
            <td style="padding:8px;"><?= App::e(strtoupper((string) $u['role'])) ?><?= !empty($u['is_super_admin']) ? ' (SUPER)' : '' ?></td>
            <td style="padding:8px;">Sai: <?= (int) $u['failed_attempts'] ?> <?= $isLocked ? '<strong style="color:#b91c1c;">Đang khóa</strong>' : 'Hoạt động' ?></td>
            <td style="padding:8px;"><button type="button" class="btn btn--outline btn--sm js-admin-lock-user" data-id="<?= (int) $u['id'] ?>"><?= $isLocked ? 'Mở khóa' : 'Khóa' ?></button></td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>

    <h3 style="margin:0 0 8px;color:#70452b;font-size:16px;">Security Logs gần nhất</h3>
    <div style="max-height:220px;overflow-y:auto;font-size:12.5px;border:1px solid #f0e4d3;border-radius:8px;padding:10px;">
      <?php foreach ($securityLogs as $lg): ?>
        <div style="padding:5px 0;border-bottom:1px dashed #f0e4d3;">
          <strong>[<?= App::e($lg['event_type']) ?>]</strong> <?= App::e($lg['email'] ?? '') ?> — <?= App::e($lg['detail']) ?> (<?= App::e($lg['created_at']) ?>)
        </div>
      <?php endforeach; ?>
    </div>
  </section>

  <!-- Tab 8: Contacts -->
  <section class="php-card js-admin-panel" data-panel="contacts" hidden>
    <h2 style="margin:0 0 12px;color:#70452b;">Tin nhắn Liên hệ từ Khách hàng</h2>
    <?php if (empty($contacts)): ?>
      <p style="color:#7c5c46;">Chưa có tin nhắn liên hệ nào.</p>
    <?php else: ?>
      <?php foreach ($contacts as $c): ?>
        <div style="border:1px solid #efe3d2;border-radius:10px;padding:12px;margin-bottom:10px;">
          <strong><?= App::e($c['full_name']) ?></strong> (<?= App::e($c['email']) ?>) · Chủ đề: <?= App::e($c['topic']) ?> · Trạng thái: <strong><?= App::e($c['status']) ?></strong>
          <p style="margin:6px 0;font-size:13.5px;"><?= App::e($c['message']) ?></p>
          <div style="display:flex;gap:8px;">
            <input type="text" class="form-input js-admin-cnt-reply" data-id="<?= (int) $c['id'] ?>" value="<?= App::e($c['staff_reply'] ?? '') ?>" placeholder="Ghi chú phản hồi...">
            <button type="button" class="btn btn--primary btn--sm js-admin-cnt-btn" data-id="<?= (int) $c['id'] ?>">Đánh dấu Đã xử lý</button>
          </div>
        </div>
      <?php endforeach; ?>
    <?php endif; ?>
  </section>
</main>

<script>
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".js-admin-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      document.querySelectorAll(".js-admin-tab-btn").forEach((b) => {
        b.classList.toggle("btn--primary", b === btn);
        b.classList.toggle("btn--outline", b !== btn);
      });
      document.querySelectorAll(".js-admin-panel").forEach((p) => {
        p.hidden = p.dataset.panel !== target;
      });
    });
  });

  document.querySelectorAll(".js-admin-order-status").forEach((sel) => {
    sel.addEventListener("change", async () => {
      try {
        const res = await window.BakeApp.postJson("admin", "ajaxUpdateOrderStatus", { order_id: Number(sel.dataset.orderId), status: sel.value });
        window.BakeApp.showToast(res.message, "success");
      } catch (err) { window.BakeApp.showToast(err.message, "error"); }
    });
  });

  document.querySelectorAll(".js-admin-cancel-decision").forEach((b) => {
    b.addEventListener("click", async () => {
      try {
        const res = await window.BakeApp.postJson("admin", "ajaxHandleCancelRequest", { request_id: Number(b.dataset.id), decision: b.dataset.decision });
        window.BakeApp.showToast(res.message, "success");
        window.location.reload();
      } catch (err) { window.BakeApp.showToast(err.message, "error"); }
    });
  });

  const prodForm = document.getElementById("admin-prod-form");
  document.getElementById("btn-admin-new-prod")?.addEventListener("click", () => {
    prodForm.reset();
    document.getElementById("ap-id").value = "0";
    prodForm.hidden = false;
  });
  document.getElementById("btn-admin-cancel-prod")?.addEventListener("click", () => { prodForm.hidden = true; });
  document.querySelectorAll(".js-admin-edit-prod").forEach((b) => {
    b.addEventListener("click", () => {
      const d = JSON.parse(b.dataset.prod);
      document.getElementById("ap-id").value = d.id;
      document.getElementById("ap-name").value = d.name;
      document.getElementById("ap-cat").value = d.category_name;
      document.getElementById("ap-brand").value = d.brand_name;
      document.getElementById("ap-pack").value = d.packaging_label;
      document.getElementById("ap-price").value = d.price;
      document.getElementById("ap-old-price").value = d.old_price;
      document.getElementById("ap-stock").value = d.stock_qty;
      document.getElementById("ap-status").value = d.stock_status;
      document.getElementById("ap-desc").value = d.description;
      document.getElementById("ap-perish").checked = Boolean(d.is_perishable);
      document.getElementById("ap-new").checked = Boolean(d.is_new);
      document.getElementById("ap-feat").checked = Boolean(d.is_featured);
      prodForm.hidden = false;
    });
  });
  prodForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const res = await window.BakeApp.postForm("admin", "ajaxSaveProduct", new FormData(prodForm));
      window.BakeApp.showToast(res.message, "success");
      window.location.reload();
    } catch (err) { window.BakeApp.showToast(err.message, "error"); }
  });
  document.querySelectorAll(".js-admin-hide-prod").forEach((b) => {
    b.addEventListener("click", async () => {
      const res = await window.BakeApp.postJson("admin", "ajaxToggleProductVisibility", { product_id: Number(b.dataset.id) });
      window.BakeApp.showToast(res.message, "success");
      window.location.reload();
    });
  });

  document.getElementById("admin-recipe-form")?.addEventListener("submit", async function (e) {
    e.preventDefault();
    try {
      const res = await window.BakeApp.postJson("admin", "ajaxSaveRecipe", Object.fromEntries(new FormData(this).entries()));
      window.BakeApp.showToast(res.message, "success");
      window.location.reload();
    } catch (err) { window.BakeApp.showToast(err.message, "error"); }
  });
  document.querySelectorAll(".js-admin-del-recipe").forEach((b) => {
    b.addEventListener("click", async () => {
      if (!(await window.BakeApp.showConfirm("Xóa công thức này khỏi CSDL?"))) return;
      await window.BakeApp.postJson("admin", "ajaxDeleteRecipe", { recipe_id: Number(b.dataset.id) });
      window.location.reload();
    });
  });

  document.getElementById("admin-coupon-form")?.addEventListener("submit", async function (e) {
    e.preventDefault();
    try {
      const res = await window.BakeApp.postJson("admin", "ajaxSaveCoupon", Object.fromEntries(new FormData(this).entries()));
      window.BakeApp.showToast(res.message, "success");
      window.location.reload();
    } catch (err) { window.BakeApp.showToast(err.message, "error"); }
  });
  document.querySelectorAll(".js-admin-toggle-coupon").forEach((b) => {
    b.addEventListener("click", async () => {
      await window.BakeApp.postJson("admin", "ajaxToggleCoupon", { coupon_id: Number(b.dataset.id) });
      window.location.reload();
    });
  });

  document.getElementById("admin-blog-form")?.addEventListener("submit", async function (e) {
    e.preventDefault();
    const res = await window.BakeApp.postJson("admin", "ajaxSaveBlogPost", Object.fromEntries(new FormData(this).entries()));
    window.BakeApp.showToast(res.message, "success");
    window.location.reload();
  });

  document.querySelectorAll(".js-admin-mod-review").forEach((b) => {
    b.addEventListener("click", async () => {
      await window.BakeApp.postJson("admin", "ajaxModerateReview", { review_id: Number(b.dataset.id), status: b.dataset.status });
      window.location.reload();
    });
  });

  document.querySelectorAll(".js-admin-lock-user").forEach((b) => {
    b.addEventListener("click", async () => {
      try {
        const res = await window.BakeApp.postJson("admin", "ajaxToggleUserLock", { user_id: Number(b.dataset.id) });
        window.BakeApp.showToast(res.message, "success");
        window.location.reload();
      } catch (err) { window.BakeApp.showToast(err.message, "error"); }
    });
  });

  document.getElementById("admin-create-priv-form")?.addEventListener("submit", async function (e) {
    e.preventDefault();
    try {
      const res = await window.BakeApp.postJson("admin", "ajaxCreatePrivilegedUser", Object.fromEntries(new FormData(this).entries()));
      window.BakeApp.showToast(res.message, "success");
      window.location.reload();
    } catch (err) { window.BakeApp.showToast(err.message, "error"); }
  });

  document.querySelectorAll(".js-admin-cnt-btn").forEach((b) => {
    b.addEventListener("click", async () => {
      const id = Number(b.dataset.id);
      const reply = document.querySelector(`.js-admin-cnt-reply[data-id="${id}"]`)?.value || "";
      await window.BakeApp.postJson("admin", "ajaxReplyContact", { contact_id: id, status: "resolved", reply });
      window.location.reload();
    });
  });
});
</script>
