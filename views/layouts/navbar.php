<?php
declare(strict_types=1);

$active = isset($activeNav) ? (string) $activeNav : '';
$user = Rbac::currentUser();
$orderModelNav = new OrderModel();
$contentModelNav = new ContentModel();
$cartCount = (int) ($orderModelNav->getCartSummary($user ? (int) $user['id'] : null)['total_count'] ?? 0);
$wishCount = count($contentModelNav->getWishlistIds($user ? (int) $user['id'] : null));
$isAdminArea = in_array($active, ['admin', 'staff'], true);
?>
<?php if ($user && in_array($user['role'], ['admin', 'staff'], true) && !$isAdminArea): ?>
  <div id="bakemate-admin-topbar" class="admin-notice-topbar" role="region" aria-label="Thông báo phiên quản trị">
    <div class="admin-notice-topbar__inner">
      <span>Đang đăng nhập với quyền <strong><?= App::e(strtoupper((string) $user['role'])) ?></strong> (<?= App::e($user['full_name']) ?>)</span>
      <div style="display:flex;gap:10px;align-items:center;">
        <?php if ($user['role'] === 'admin'): ?>
          <a href="<?= App::e(App::url('?c=admin&a=index')) ?>" class="btn btn--outline btn--sm">Vào Admin Dashboard</a>
        <?php endif; ?>
        <a href="<?= App::e(App::url('?c=staff&a=index')) ?>" class="btn btn--outline btn--sm">Bàn làm việc Staff</a>
      </div>
    </div>
  </div>
<?php endif; ?>

<div class="promo-topbar" role="region" aria-label="Ưu đãi thành viên BakeMate">
  <div class="promo-topbar__inner">
    <span class="promo-topbar__left">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
        <path d="M9 9h.01"/><path d="M15 15h.01"/><path d="m15 9-6 6"/>
      </svg>
      <span>Ưu đãi thành viên BakeMate</span>
    </span>
    <div class="promo-topbar__codes">
      <div class="promo-topbar__item">
        <span>Giảm 10% đơn đầu:</span>
        <span class="promo-topbar__code-badge">CHAOBANMOI</span>
        <button type="button" class="promo-topbar__copy js-copy-promo" data-coupon="CHAOBANMOI" aria-label="Sao chép mã CHAOBANMOI">
          <span class="js-copy-promo-label">Sao chép</span>
        </button>
      </div>
      <div class="promo-topbar__item">
        <span>Freeship 20K (đơn từ 200K):</span>
        <span class="promo-topbar__code-badge">FREESHIP20</span>
        <button type="button" class="promo-topbar__copy js-copy-promo" data-coupon="FREESHIP20" aria-label="Sao chép mã FREESHIP20">
          <span class="js-copy-promo-label">Sao chép</span>
        </button>
      </div>
    </div>
  </div>
</div>

<header class="site-header">
  <div class="header-container">
    <a href="<?= App::e(App::url('')) ?>" class="site-header__logo-link" aria-label="Trang chủ BakeMate">
      <img src="<?= App::e(App::asset('images/logo.jpg')) ?>" alt="Logo BakeMate" class="site-header__logo-img">
    </a>

    <nav class="site-header__nav" aria-label="Điều hướng chính">
      <ul class="site-header__menu">
        <li class="site-header__menu-item">
          <a href="<?= App::e(App::url('')) ?>" class="site-header__menu-link <?= $active === 'home' ? 'active' : '' ?>" <?= $active === 'home' ? 'aria-current="page"' : '' ?>>Trang chủ</a>
        </li>
        <li class="site-header__menu-item has-megamenu">
          <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="site-header__menu-link js-megamenu-trigger <?= $active === 'products' ? 'active' : '' ?>" aria-expanded="false" aria-haspopup="true" aria-controls="desktop-megamenu">
            Sản phẩm
            <svg class="megamenu-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
          </a>
          <div class="mega-menu" id="desktop-megamenu" role="region" aria-label="Danh mục sản phẩm BakeMate">
            <div class="mega-menu__grid">
              <div class="mega-menu__col">
                <h3 class="mega-menu__col-title"><a href="<?= App::e(App::url('?c=product&a=catalog&category=' . urlencode('Nguyên liệu'))) ?>" class="mega-menu__col-link">Nguyên liệu làm bánh</a></h3>
                <ul class="mega-menu__list">
                  <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Bột và nguyên liệu khô'))) ?>" class="mega-menu__link">Bột và nguyên liệu khô</a></li>
                  <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Chocolate và tạo vị'))) ?>" class="mega-menu__link">Chocolate và tạo vị</a></li>
                  <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Bơ, sữa và kem'))) ?>" class="mega-menu__link">Bơ, sữa và kem</a></li>
                  <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Nguyên liệu tạo cấu trúc'))) ?>" class="mega-menu__link">Nguyên liệu tạo cấu trúc</a></li>
                </ul>
              </div>
              <div class="mega-menu__col">
                <h3 class="mega-menu__col-title"><a href="<?= App::e(App::url('?c=product&a=catalog&category=' . urlencode('Dụng cụ'))) ?>" class="mega-menu__col-link">Dụng cụ làm bánh</a></h3>
                <ul class="mega-menu__list">
                  <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Khuôn bánh'))) ?>" class="mega-menu__link">Khuôn bánh</a></li>
                  <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Dụng cụ cân, đong'))) ?>" class="mega-menu__link">Dụng cụ cân, đong</a></li>
                  <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Dụng cụ trộn'))) ?>" class="mega-menu__link">Dụng cụ trộn</a></li>
                  <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Dụng cụ trang trí'))) ?>" class="mega-menu__link">Dụng cụ trang trí</a></li>
                </ul>
              </div>
              <div class="mega-menu__col">
                <h3 class="mega-menu__col-title"><a href="<?= App::e(App::url('?c=product&a=catalog&category=' . urlencode('Phụ kiện & Đóng gói'))) ?>" class="mega-menu__col-link">Phụ kiện &amp; đóng gói</a></h3>
                <ul class="mega-menu__list">
                  <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Hộp và túi đựng bánh'))) ?>" class="mega-menu__link">Hộp và túi đựng bánh</a></li>
                  <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Đế và khay bánh'))) ?>" class="mega-menu__link">Đế và khay bánh</a></li>
                  <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Trang trí bánh'))) ?>" class="mega-menu__link">Trang trí bánh</a></li>
                  <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Bảo quản nguyên liệu'))) ?>" class="mega-menu__link">Bảo quản nguyên liệu</a></li>
                </ul>
              </div>
            </div>
            <div class="mega-menu__footer">
              <span class="mega-menu__footer-promo">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                Freeship đơn từ 200K · Giảm 10% đơn đầu (mã: <strong>CHAOBANMOI</strong>)
              </span>
              <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="mega-menu__footer-cta">Xem tất cả sản phẩm &rarr;</a>
            </div>
          </div>
        </li>
        <li class="site-header__menu-item"><a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="site-header__menu-link <?= $active === 'recipes' ? 'active' : '' ?>">Công thức</a></li>
        <li class="site-header__menu-item"><a href="<?= App::e(App::url('?c=home&a=blog')) ?>" class="site-header__menu-link <?= $active === 'blog' ? 'active' : '' ?>">Blog</a></li>
        <li class="site-header__menu-item"><a href="<?= App::e(App::url('?c=home&a=about')) ?>" class="site-header__menu-link <?= $active === 'about' ? 'active' : '' ?>">Về chúng tôi</a></li>
        <li class="site-header__menu-item"><a href="<?= App::e(App::url('?c=home&a=contact')) ?>" class="site-header__menu-link <?= $active === 'contact' ? 'active' : '' ?>">Liên hệ</a></li>
      </ul>
    </nav>

    <div class="site-header__actions">
      <form class="site-header__search js-header-search-form" action="<?= App::e(App::url('index.php')) ?>" method="get" role="search">
        <input type="hidden" name="c" value="product">
        <input type="hidden" name="a" value="catalog">
        <label class="visually-hidden" for="header-search-input">Tìm nguyên liệu, dụng cụ làm bánh</label>
        <input id="header-search-input" type="search" name="q" value="<?= App::e($_GET['q'] ?? '') ?>" placeholder="Tìm nguyên liệu, công thức..." class="site-header__search-input js-header-search-input" autocomplete="off">
        <button type="submit" class="site-header__search-btn">Tìm</button>
        <div class="search-suggest-box js-search-suggest" hidden></div>
      </form>

      <a href="<?= App::e(App::url('?c=product&a=wishlist')) ?>" class="site-header__icon-btn site-header__wishlist" aria-label="Danh sách yêu thích">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
        <span class="site-header__cart-badge js-wishlist-badge <?= $wishCount === 0 ? 'is-empty' : '' ?>" id="wishlist-badge"><?= $wishCount ?></span>
      </a>

      <a href="<?= App::e(App::url('?c=order&a=cart')) ?>" class="site-header__cart" aria-label="Giỏ hàng">
        <span class="site-header__cart-icon" aria-hidden="true">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
        </span>
        <span class="site-header__cart-badge <?= $cartCount === 0 ? 'is-empty' : '' ?>" id="cart-badge" aria-live="polite"><?= $cartCount ?></span>
      </a>

      <div class="account-wrap js-account-wrap">
        <button type="button" class="site-header__icon-btn account-trigger js-account-trigger" aria-expanded="false" aria-label="Tài khoản">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <?php if ($user): ?>
            <span class="account-trigger__name js-account-name"><?= App::e($user['full_name']) ?></span>
          <?php endif; ?>
        </button>
        <div class="account-dropdown js-account-menu" role="menu">
          <?php if ($user): ?>
            <div class="account-dropdown__head">
              <strong><?= App::e($user['full_name']) ?></strong>
              <span><?= App::e($user['email']) ?> · <?= App::e(strtoupper((string) $user['role'])) ?></span>
            </div>
            <a href="<?= App::e(App::url('?c=auth&a=profile')) ?>" class="account-dropdown__item">Hồ sơ cá nhân &amp; Địa chỉ</a>
            <a href="<?= App::e(App::url('?c=order&a=orders')) ?>" class="account-dropdown__item">Theo dõi đơn hàng</a>
            <a href="<?= App::e(App::url('?c=product&a=wishlist')) ?>" class="account-dropdown__item">Sản phẩm yêu thích</a>
            <?php if (in_array($user['role'], ['staff', 'admin'], true)): ?>
              <a href="<?= App::e(App::url('?c=staff&a=index')) ?>" class="account-dropdown__item">Bàn làm việc Nhân viên</a>
            <?php endif; ?>
            <?php if ($user['role'] === 'admin'): ?>
              <a href="<?= App::e(App::url('?c=admin&a=index')) ?>" class="account-dropdown__item"><strong>Admin Dashboard</strong></a>
            <?php endif; ?>
            <a href="<?= App::e(App::url('?c=auth&a=logout')) ?>" class="account-dropdown__item" style="color:#b91c1c;">Đăng xuất</a>
          <?php else: ?>
            <a href="<?= App::e(App::url('?c=auth&a=login')) ?>" class="account-dropdown__item"><strong>Đăng nhập</strong></a>
            <a href="<?= App::e(App::url('?c=auth&a=register')) ?>" class="account-dropdown__item">Đăng ký tài khoản</a>
            <a href="<?= App::e(App::url('?c=order&a=orders')) ?>" class="account-dropdown__item">Tra cứu đơn hàng</a>
          <?php endif; ?>
        </div>
      </div>

      <button type="button" class="mobile-menu-toggle js-mobile-menu-toggle" aria-expanded="false" aria-label="Mở menu điều hướng">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
    </div>
  </div>
</header>

<div class="mobile-drawer js-mobile-drawer" id="mobile-nav-drawer" hidden aria-modal="true" role="dialog" aria-label="Menu điều hướng di động">
  <div class="mobile-drawer__backdrop js-mobile-drawer-close"></div>
  <div class="mobile-drawer__panel">
    <div class="mobile-drawer__head">
      <div class="mobile-drawer__brand">
        <img src="<?= App::e(App::asset('images/logo.jpg')) ?>" alt="BakeMate" class="mobile-drawer__logo">
        <div>
          <strong class="mobile-drawer__title">BakeMate</strong>
          <span class="mobile-drawer__tagline">Làm bánh chuẩn vị</span>
        </div>
      </div>
      <button type="button" class="mobile-drawer__close-btn js-mobile-drawer-close" aria-label="Đóng menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <div class="mobile-drawer__promo">
      <span class="mobile-drawer__promo-badge">Ưu đãi</span>
      <span>Nhập <strong>CHAOBANMOI</strong> giảm 10% đơn đầu!</span>
    </div>

    <nav class="mobile-drawer__nav" aria-label="Menu chính trên di động">
      <ul class="mobile-drawer__list">
        <li class="mobile-drawer__item">
          <a href="<?= App::e(App::url('')) ?>" class="mobile-drawer__link <?= $active === 'home' ? 'is-active' : '' ?>">
            Trang chủ
          </a>
        </li>

        <li class="mobile-drawer__item mobile-drawer__item--has-sub js-mobile-megamenu-item">
          <div class="mobile-drawer__item-row">
            <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="mobile-drawer__link <?= $active === 'products' ? 'is-active' : '' ?>">
              Sản phẩm
            </a>
            <button type="button" class="mobile-drawer__sub-toggle js-mobile-sub-toggle" aria-expanded="false" aria-label="Mở rộng danh mục sản phẩm">
              <svg class="mobile-sub-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
            </button>
          </div>

          <div class="mobile-sub-menu js-mobile-sub-menu" hidden>
            <div class="mobile-sub-col">
              <div class="mobile-sub-col__title">
                <a href="<?= App::e(App::url('?c=product&a=catalog&category=' . urlencode('Nguyên liệu'))) ?>">Nguyên liệu làm bánh</a>
              </div>
              <ul class="mobile-sub-col__list">
                <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Bột và nguyên liệu khô'))) ?>">Bột và nguyên liệu khô</a></li>
                <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Chocolate và tạo vị'))) ?>">Chocolate và tạo vị</a></li>
                <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Bơ, sữa và kem'))) ?>">Bơ, sữa và kem</a></li>
                <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Nguyên liệu tạo cấu trúc'))) ?>">Nguyên liệu tạo cấu trúc</a></li>
              </ul>
            </div>

            <div class="mobile-sub-col">
              <div class="mobile-sub-col__title">
                <a href="<?= App::e(App::url('?c=product&a=catalog&category=' . urlencode('Dụng cụ'))) ?>">Dụng cụ làm bánh</a>
              </div>
              <ul class="mobile-sub-col__list">
                <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Khuôn bánh'))) ?>">Khuôn bánh</a></li>
                <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Dụng cụ cân, đong'))) ?>">Dụng cụ cân, đong</a></li>
                <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Dụng cụ trộn'))) ?>">Dụng cụ trộn</a></li>
                <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Dụng cụ trang trí'))) ?>">Dụng cụ trang trí</a></li>
              </ul>
            </div>

            <div class="mobile-sub-col">
              <div class="mobile-sub-col__title">
                <a href="<?= App::e(App::url('?c=product&a=catalog&category=' . urlencode('Phụ kiện & Đóng gói'))) ?>">Phụ kiện &amp; đóng gói</a>
              </div>
              <ul class="mobile-sub-col__list">
                <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Hộp và túi đựng bánh'))) ?>">Hộp và túi đựng bánh</a></li>
                <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Đế và khay bánh'))) ?>">Đế và khay bánh</a></li>
                <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Trang trí bánh'))) ?>">Trang trí bánh</a></li>
                <li><a href="<?= App::e(App::url('?c=product&a=catalog&sub=' . urlencode('Bảo quản nguyên liệu'))) ?>">Bảo quản nguyên liệu</a></li>
              </ul>
            </div>

            <div class="mobile-sub-all">
              <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>">Xem toàn bộ sản phẩm &rarr;</a>
            </div>
          </div>
        </li>

        <li class="mobile-drawer__item"><a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="mobile-drawer__link <?= $active === 'recipes' ? 'is-active' : '' ?>">Công thức</a></li>
        <li class="mobile-drawer__item"><a href="<?= App::e(App::url('?c=home&a=blog')) ?>" class="mobile-drawer__link <?= $active === 'blog' ? 'is-active' : '' ?>">Blog làm bánh</a></li>
        <li class="mobile-drawer__item"><a href="<?= App::e(App::url('?c=home&a=about')) ?>" class="mobile-drawer__link <?= $active === 'about' ? 'is-active' : '' ?>">Về chúng tôi</a></li>
        <li class="mobile-drawer__item"><a href="<?= App::e(App::url('?c=home&a=contact')) ?>" class="mobile-drawer__link <?= $active === 'contact' ? 'is-active' : '' ?>">Liên hệ</a></li>
        <li class="mobile-drawer__item"><a href="<?= App::e(App::url('?c=order&a=orders')) ?>" class="mobile-drawer__link <?= $active === 'orders' ? 'is-active' : '' ?>">Theo dõi đơn hàng</a></li>
      </ul>
    </nav>

    <div class="mobile-drawer__footer">
      <?php if ($user): ?>
        <div class="mobile-drawer__user-box">
          <div class="mobile-drawer__user-info">
            <strong><?= App::e($user['full_name']) ?></strong>
            <span><?= App::e($user['email']) ?></span>
            <span class="mobile-drawer__role-badge"><?= App::e(strtoupper((string) $user['role'])) ?></span>
          </div>
          <div class="mobile-drawer__user-links">
            <a href="<?= App::e(App::url('?c=auth&a=profile')) ?>" class="btn btn--outline btn--sm btn--block">Hồ sơ cá nhân</a>
            <a href="<?= App::e(App::url('?c=product&a=wishlist')) ?>" class="btn btn--outline btn--sm btn--block">Yêu thích (<?= $wishCount ?>)</a>
            <?php if (in_array($user['role'], ['staff', 'admin'], true)): ?>
              <a href="<?= App::e(App::url('?c=staff&a=index')) ?>" class="btn btn--outline btn--sm btn--block">Bàn làm việc Staff</a>
            <?php endif; ?>
            <?php if ($user['role'] === 'admin'): ?>
              <a href="<?= App::e(App::url('?c=admin&a=index')) ?>" class="btn btn--primary btn--sm btn--block">Admin Dashboard</a>
            <?php endif; ?>
            <a href="<?= App::e(App::url('?c=auth&a=logout')) ?>" class="btn btn--danger btn--sm btn--block">Đăng xuất</a>
          </div>
        </div>
      <?php else: ?>
        <div class="mobile-drawer__auth-actions">
          <a href="<?= App::e(App::url('?c=auth&a=login')) ?>" class="btn btn--primary btn--sm btn--block">Đăng nhập</a>
          <a href="<?= App::e(App::url('?c=auth&a=register')) ?>" class="btn btn--outline btn--sm btn--block">Đăng ký tài khoản</a>
        </div>
      <?php endif; ?>
    </div>
  </div>
</div>
