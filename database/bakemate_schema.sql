CREATE DATABASE IF NOT EXISTS db_bakemate CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_bakemate;

SET NAMES utf8mb4;
SET time_zone = '+07:00';
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS order_cancel_requests;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS wishlist_items;
DROP TABLE IF EXISTS user_pantry;
DROP TABLE IF EXISTS recipe_tools;
DROP TABLE IF EXISTS recipe_ingredients;
DROP TABLE IF EXISTS recipe_tips;
DROP TABLE IF EXISTS recipe_steps;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS product_reviews;
DROP TABLE IF EXISTS product_specs;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS product_subcategories;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS subcategories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS blog_posts;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS security_logs;
DROP TABLE IF EXISTS otp_tokens;
DROP TABLE IF EXISTS user_addresses;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    phone VARCHAR(20) NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'staff', 'admin') NOT NULL DEFAULT 'customer',
    is_super_admin TINYINT(1) NOT NULL DEFAULT 0,
    token_version INT UNSIGNED NOT NULL DEFAULT 1,
    failed_attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
    lock_until DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_addresses (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    recipient_name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    zone_type ENUM('hcm', 'province') NOT NULL DEFAULT 'hcm',
    is_default TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_addr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE otp_tokens (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(160) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    purpose VARCHAR(40) NOT NULL DEFAULT 'forgot_password',
    expires_at DATETIME NOT NULL,
    cooldown_until DATETIME NOT NULL,
    attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
    is_used TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_otp_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE security_logs (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NULL,
    email VARCHAR(160) NULL,
    event_type VARCHAR(60) NOT NULL DEFAULT 'auth_alert',
    ip_address VARCHAR(64) NULL,
    user_agent VARCHAR(255) NULL,
    detail VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_seclog_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    image_path VARCHAR(255) NULL,
    sort_order INT UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE subcategories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id INT UNSIGNED NOT NULL,
    name VARCHAR(120) NOT NULL UNIQUE,
    slug VARCHAR(140) NOT NULL UNIQUE,
    sort_order INT UNSIGNED NOT NULL DEFAULT 1,
    CONSTRAINT fk_subcat_cat FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE brands (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(180) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    category_id INT UNSIGNED NOT NULL,
    brand_id INT UNSIGNED NOT NULL,
    packaging_label VARCHAR(120) NOT NULL DEFAULT 'Tiêu chuẩn',
    description TEXT NOT NULL,
    origin VARCHAR(100) NOT NULL DEFAULT 'Việt Nam',
    rating_avg DECIMAL(3,2) NOT NULL DEFAULT 4.80,
    review_count INT UNSIGNED NOT NULL DEFAULT 0,
    sold_count_label VARCHAR(50) NOT NULL DEFAULT 'Mới lên kệ',
    unit_label VARCHAR(40) NOT NULL DEFAULT 'sản phẩm',
    is_perishable TINYINT(1) NOT NULL DEFAULT 0,
    stock_status ENUM('in_stock', 'out_of_stock', 'coming_soon') NOT NULL DEFAULT 'in_stock',
    is_featured TINYINT(1) NOT NULL DEFAULT 0,
    is_new TINYINT(1) NOT NULL DEFAULT 0,
    on_sale TINYINT(1) NOT NULL DEFAULT 0,
    is_hidden TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_prod_cat FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_prod_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE product_subcategories (
    product_id INT UNSIGNED NOT NULL,
    subcategory_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (product_id, subcategory_id),
    CONSTRAINT fk_psub_prod FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_psub_sub FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE product_variants (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    option_index TINYINT UNSIGNED NOT NULL DEFAULT 0,
    short_label VARCHAR(120) NOT NULL,
    unit_amount DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    unit_type VARCHAR(30) NOT NULL DEFAULT 'sản phẩm',
    price INT UNSIGNED NOT NULL,
    old_price INT UNSIGNED NOT NULL,
    stock_qty INT UNSIGNED NOT NULL DEFAULT 50,
    is_default TINYINT(1) NOT NULL DEFAULT 0,
    UNIQUE KEY uk_prod_opt (product_id, option_index),
    CONSTRAINT fk_var_prod FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE product_images (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    sort_order TINYINT UNSIGNED NOT NULL DEFAULT 1,
    CONSTRAINT fk_img_prod FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE product_specs (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    spec_key VARCHAR(120) NOT NULL,
    spec_value VARCHAR(500) NOT NULL,
    sort_order TINYINT UNSIGNED NOT NULL DEFAULT 1,
    CONSTRAINT fk_spec_prod FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE product_reviews (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NULL,
    reviewer_name VARCHAR(120) NOT NULL,
    rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
    comment TEXT NOT NULL,
    image_path VARCHAR(255) NULL,
    status ENUM('approved', 'hidden') NOT NULL DEFAULT 'approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rev_prod FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rev_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE recipes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(120) NOT NULL UNIQUE,
    code VARCHAR(40) NOT NULL,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(500) NOT NULL,
    category VARCHAR(80) NOT NULL,
    tags_json TEXT NOT NULL,
    rating_avg DECIMAL(3,2) NOT NULL DEFAULT 4.80,
    bake_minutes SMALLINT UNSIGNED NOT NULL DEFAULT 30,
    time_label VARCHAR(60) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    default_servings SMALLINT UNSIGNED NOT NULL DEFAULT 4,
    servings_unit VARCHAR(100) NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    author VARCHAR(120) NOT NULL,
    is_published TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE recipe_steps (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT UNSIGNED NOT NULL,
    step_order TINYINT UNSIGNED NOT NULL,
    instruction TEXT NOT NULL,
    CONSTRAINT fk_step_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE recipe_tips (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT UNSIGNED NOT NULL,
    tip_order TINYINT UNSIGNED NOT NULL,
    tip_text TEXT NOT NULL,
    CONSTRAINT fk_tip_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE recipe_ingredients (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT UNSIGNED NOT NULL,
    sort_order TINYINT UNSIGNED NOT NULL DEFAULT 1,
    name VARCHAR(180) NOT NULL,
    base_amount DECIMAL(10,2) NOT NULL,
    unit VARCHAR(40) NOT NULL,
    product_id INT UNSIGNED NULL,
    variant_option_index TINYINT UNSIGNED NOT NULL DEFAULT 0,
    package_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    note VARCHAR(255) NULL,
    CONSTRAINT fk_ring_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ring_prod FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE recipe_tools (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT UNSIGNED NOT NULL,
    sort_order TINYINT UNSIGNED NOT NULL DEFAULT 1,
    name VARCHAR(180) NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    variant_option_index TINYINT UNSIGNED NOT NULL DEFAULT 0,
    description VARCHAR(255) NULL,
    CONSTRAINT fk_rtool_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rtool_prod FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_pantry (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    recipe_id INT UNSIGNED NOT NULL,
    ingredient_key VARCHAR(120) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_pantry_user_rec_key (user_id, recipe_id, ingredient_key),
    CONSTRAINT fk_pantry_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_pantry_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE wishlist_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_wish_user_prod (user_id, product_id),
    CONSTRAINT fk_wish_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_wish_prod FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE coupons (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(40) NOT NULL UNIQUE,
    discount_scope ENUM('product', 'shipping') NOT NULL DEFAULT 'product',
    discount_type ENUM('percent', 'fixed') NOT NULL DEFAULT 'percent',
    discount_value INT UNSIGNED NOT NULL DEFAULT 0,
    min_subtotal INT UNSIGNED NOT NULL DEFAULT 0,
    usage_limit INT UNSIGNED NOT NULL DEFAULT 1000,
    used_count INT UNSIGNED NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    expired_at DATETIME NULL,
    description VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cart_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    option_index TINYINT UNSIGNED NOT NULL DEFAULT 0,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    recipe_group_id VARCHAR(120) NULL,
    is_selected TINYINT(1) NOT NULL DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_cart_item (user_id, product_id, option_index, recipe_group_id),
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cart_prod FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE orders (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(30) NOT NULL UNIQUE,
    user_id INT UNSIGNED NULL,
    customer_name VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(160) NULL,
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    zone_type ENUM('hcm', 'province') NOT NULL DEFAULT 'hcm',
    shipping_method VARCHAR(40) NOT NULL DEFAULT 'fast',
    shipping_method_label VARCHAR(120) NOT NULL DEFAULT 'Giao hàng nhanh',
    shipping_fee INT UNSIGNED NOT NULL DEFAULT 25000,
    payment_method ENUM('cod', 'vietqr', 'ewallet') NOT NULL DEFAULT 'cod',
    ewallet_provider VARCHAR(40) NULL,
    payment_status ENUM('unpaid', 'pending_verify', 'paid') NOT NULL DEFAULT 'unpaid',
    product_coupon_code VARCHAR(40) NULL,
    shipping_coupon_code VARCHAR(40) NULL,
    subtotal INT UNSIGNED NOT NULL DEFAULT 0,
    discount_product INT UNSIGNED NOT NULL DEFAULT 0,
    discount_shipping INT UNSIGNED NOT NULL DEFAULT 0,
    total_amount INT UNSIGNED NOT NULL DEFAULT 0,
    note VARCHAR(500) NULL,
    status ENUM('pending', 'preparing', 'shipping', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_ord_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NULL,
    product_name VARCHAR(200) NOT NULL,
    variant_label VARCHAR(120) NOT NULL,
    option_index TINYINT UNSIGNED NOT NULL DEFAULT 0,
    unit_price INT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    line_total INT UNSIGNED NOT NULL,
    recipe_group_id VARCHAR(120) NULL,
    is_perishable TINYINT(1) NOT NULL DEFAULT 0,
    CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_oi_prod FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_cancel_requests (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NULL,
    reason VARCHAR(500) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    admin_note VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ocr_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ocr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE blog_posts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(140) NOT NULL UNIQUE,
    recipe_slug VARCHAR(120) NULL,
    title VARCHAR(240) NOT NULL,
    category VARCHAR(100) NOT NULL,
    read_time VARCHAR(60) NOT NULL,
    difficulty VARCHAR(40) NOT NULL,
    author VARCHAR(120) NOT NULL,
    published_at_label VARCHAR(40) NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    keywords_text VARCHAR(255) NULL,
    excerpt TEXT NOT NULL,
    steps_json LONGTEXT NOT NULL,
    is_published TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE contacts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NULL,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL,
    phone VARCHAR(20) NULL,
    topic VARCHAR(120) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'in_progress', 'resolved') NOT NULL DEFAULT 'new',
    staff_reply TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cnt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (id, full_name, email, phone, password_hash, role, is_super_admin, token_version) VALUES
  (1, 'Gia Bảo (Super Admin)', 'superadmin@bakemate.vn', '0901000001', '$2y$10$FvG8pHMPrP1tZJriXM/pdu47Slh3papfN4NACBxUIJCxmodWqyuLG', 'admin', 1, 1),
  (2, 'Bảo Ngọc (Admin)', 'admin@bakemate.vn', '0901000002', '$2y$10$NQ0QruBs3iF8OZ7343DXHuKgVwnoJ5Yad/m9XgiS4bsaD6gLTHmYC', 'admin', 0, 1),
  (3, 'Minh Thư (Nhân viên)', 'staff@bakemate.vn', '0901000003', '$2y$10$AfyI6Ezd5yyNIIXmfEJXK.R4SDkn14izY25MM4K0nZWS1GMqnL8jK', 'staff', 0, 1),
  (4, 'Nguyễn Thương (Khách hàng)', 'khachhang@bakemate.vn', '0909123456', '$2y$10$d.0o2WzDW4y8akVLrKet2.D0pwgjFueVbGIJi425QrAINpUbRwOnW', 'customer', 0, 1);

INSERT INTO user_addresses (user_id, recipient_name, phone, province, district, ward, street_address, zone_type, is_default) VALUES
  (4, 'Nguyễn Thương', '0909123456', 'TP. Hồ Chí Minh', 'Quận 3', 'Phường Võ Thị Sáu', '59C Nguyễn Đình Chiểu', 'hcm', 1);

INSERT INTO categories (id, name, slug, description, image_path, sort_order) VALUES
  (1, 'Nguyên liệu', 'nguyen-lieu', 'Nguyên liệu chọn lọc chuẩn hàm lượng protein, bơ sữa nhập khẩu.', 'images/categories/cat-ingredients.jpg', 1),
  (2, 'Dụng cụ', 'dung-cu', 'Cân điện tử, nhiệt kế, phới lồng và khuôn nướng chính xác.', 'images/categories/cat-tools.jpg', 2),
  (3, 'Phụ kiện & Đóng gói', 'phu-kien-dong-goi', 'Hộp bánh mica, túi bắt kem, đui inox và cup giấy.', 'images/categories/cat-packaging.jpg', 3);

INSERT INTO subcategories (id, category_id, name, slug, sort_order) VALUES
  (1, 1, 'Bột và nguyên liệu khô', 'bot-va-nguyen-lieu-kho', 1),
  (2, 1, 'Chocolate và tạo vị', 'chocolate-va-tao-vi', 2),
  (3, 1, 'Bơ, sữa và kem', 'bo-sua-va-kem', 3),
  (4, 1, 'Nguyên liệu tạo cấu trúc', 'nguyen-lieu-tao-cau-truc', 4),
  (5, 2, 'Khuôn bánh', 'khuon-banh', 5),
  (6, 2, 'Dụng cụ cân, đong', 'dung-cu-can-dong', 6),
  (7, 2, 'Dụng cụ trộn', 'dung-cu-tron', 7),
  (8, 2, 'Dụng cụ trang trí', 'dung-cu-trang-tri', 8),
  (9, 3, 'Hộp và túi đựng bánh', 'hop-va-tui-dung-banh', 9),
  (10, 3, 'Đế và khay bánh', 'de-va-khay-banh', 10),
  (11, 3, 'Trang trí bánh', 'trang-tri-banh', 11),
  (12, 3, 'Bảo quản nguyên liệu', 'bao-quan-nguyen-lieu', 12);

INSERT INTO brands (id, name, slug) VALUES
  (1, 'Baker''s Choice', 'baker-s-choice'),
  (2, 'Meizan', 'meizan'),
  (3, 'Hershey''s', 'hershey-s'),
  (4, 'Izumi', 'izumi'),
  (5, 'Anchor', 'anchor'),
  (6, 'BakeMate', 'bakemate'),
  (7, 'Biên Hòa', 'bien-hoa'),
  (8, 'BakeMate Fresh', 'bakemate-fresh');

INSERT INTO products (id, slug, name, category_id, brand_id, packaging_label, description, origin, rating_avg, review_count, sold_count_label, unit_label, is_perishable, stock_status, is_featured, is_new, on_sale, is_hidden) VALUES
  (1, 'bot-mi-baker-s-choice-so-8-1', 'Bột mì Baker''s Choice số 8', 1, 1, 'Gói 1kg', 'Bột mì số 8 có hàm lượng protein thấp (8-9%), thích hợp làm bánh bông lan, cupcake, muffin và các loại bánh mềm xốp.', 'Việt Nam', 4.80, 124, '1.8k', 'gói', 0, 'in_stock', 1, 0, 1, 0),
  (2, 'bot-mi-baker-s-choice-so-11-2', 'Bột mì Baker''s Choice số 11', 1, 1, 'Gói 1kg', 'Bột mì số 11 giàu protein phù hợp làm bánh mì hoa cúc, baguette và các loại bánh cần kết cấu dai, đàn hồi.', 'Việt Nam', 4.70, 86, '1.2k', 'gói', 0, 'in_stock', 1, 0, 1, 0),
  (3, 'bot-mi-da-dung-meizan-3', 'Bột mì đa dụng Meizan', 1, 2, 'Gói 1kg', 'Bột mì đa dụng tiện lợi có thể sử dụng linh hoạt cho bánh quy bơ, muffin, pancake và chế biến thực phẩm.', 'Việt Nam', 4.90, 185, '1.5k', 'gói', 0, 'in_stock', 1, 0, 1, 0),
  (4, 'bot-cacao-nguyen-chat-hershey-s-4', 'Bột cacao nguyên chất Hershey''s', 1, 3, 'Hộp 100g', 'Bột cacao nguyên chất không đường dùng tạo hương vị chocolate đậm đà cho brownie, bánh quy và mousse.', 'Mỹ', 4.90, 98, '1.1k', 'hộp', 0, 'in_stock', 1, 1, 1, 0),
  (5, 'bot-matcha-lam-banh-5', 'Bột Matcha làm bánh', 1, 4, 'Gói 100g', 'Bột matcha trà xanh nghiền mịn dùng làm cupcake, chiffon, tiramisu và các món tráng miệng chuẩn vị Nhật.', 'Nhật Bản', 4.80, 74, '680', 'gói', 0, 'in_stock', 1, 1, 1, 0),
  (6, 'whipping-cream-anchor-6', 'Whipping Cream Anchor', 1, 5, 'Hộp 250ml', 'Kem tươi béo mịn 35.1% dùng để đánh bông, chà láng trang trí bánh kem, làm mousse và panna cotta.', 'New Zealand', 4.80, 156, '1.9k', 'hộp', 1, 'in_stock', 0, 0, 1, 0),
  (7, 'can-dien-tu-nha-bep-7', 'Cân điện tử nhà bếp', 2, 6, 'Mẫu 5kg / 1g', 'Cân điện tử độ chia 1g hỗ trợ cân đo chính xác bột, đường, bơ và định lượng chuẩn theo từng công thức bánh.', 'Nhập khẩu', 4.80, 112, '920', 'cái', 0, 'in_stock', 1, 0, 0, 0),
  (8, 'ca-dong-nguyen-lieu-8', 'Ca đong nguyên liệu', 2, 6, 'Ca 500ml', 'Ca đong nhựa nguyên sinh có vạch chia ml và cup rõ nét giúp đo lường nước, sữa và nguyên liệu lỏng.', 'Việt Nam', 4.70, 64, '780', 'cái', 0, 'in_stock', 0, 0, 0, 0),
  (9, 'thia-dong-dinh-luong-9', 'Thìa đong định lượng', 2, 6, 'Bộ 5 thìa', 'Bộ 5 thìa đong tsp/tbsp hỗ trợ định lượng chuẩn các nguyên liệu nhỏ như bột nở, baking soda, muối và vani.', 'Nhập khẩu', 4.80, 79, '1.0k', 'bộ', 0, 'in_stock', 0, 1, 0, 0),
  (10, 'nhiet-ke-dien-tu-nha-bep-10', 'Nhiệt kế điện tử nhà bếp', 2, 6, 'Đầu dò tiêu chuẩn', 'Nhiệt kế đầu dò inox hỗ trợ kiểm tra nhiệt độ đường thắng caramel, nước kích men nở và socola đun chảy.', 'Nhập khẩu', 4.70, 49, '540', 'cái', 0, 'in_stock', 0, 1, 1, 0),
  (11, 'tui-bat-kem-dung-mot-lan-11', 'Túi bắt kem dùng một lần', 3, 6, 'Túi 50 cái', 'Túi bắt kem nhựa PE dày vân nhám chống trượt hỗ trợ tạo hình su kem, trang trí bánh kem và cupcake.', 'Việt Nam', 4.90, 88, '1.4k', 'gói', 0, 'in_stock', 0, 0, 0, 0),
  (12, 'bo-lat-anchor-227g-12', 'Bơ lạt Anchor (227g)', 1, 5, 'Khối 227g', 'Bơ lạt nhập khẩu New Zealand làm từ sữa bò tươi tự nhiên, mang lại hương thơm béo ngậy cho bánh quy và bánh mì hoa cúc.', 'New Zealand', 4.90, 214, '2.3k', 'khối', 1, 'in_stock', 1, 0, 1, 0),
  (13, 'duong-tinh-luyen-bien-hoa-1kg-13', 'Đường tinh luyện Biên Hòa (1kg)', 1, 7, 'Túi 1kg', 'Đường cát trắng tinh luyện hạt mịn dễ tan khi đánh cùng trứng và bơ, phù hợp cho mọi loại bánh ngọt.', 'Việt Nam', 4.80, 142, '2.1k', 'túi', 0, 'in_stock', 0, 0, 0, 0),
  (14, 'cream-of-tartar-baker-s-100g-14', 'Cream of Tartar Baker''s (100g)', 1, 1, 'Hộp 100g', 'Bột ổn định lòng trắng trứng giúp bọt khí bền vững khi đánh bông làm bánh bông lan chiffon và meringue.', 'Nhập khẩu', 4.90, 68, '890', 'hộp', 0, 'in_stock', 0, 0, 1, 0),
  (15, 'trung-ga-tuoi-chuan-vi-vi-10-qua-15', 'Trứng gà tươi chuẩn vị (Vỉ 10 quả)', 1, 8, 'Vỉ 10 quả', 'Vỉ 10 trứng gà tươi chọn lọc kích cỡ đồng đều (55-60g/quả), lòng đỏ sánh đậm giúp bánh lên màu vàng ươm.', 'Việt Nam', 4.90, 173, '2.4k', 'vỉ', 1, 'in_stock', 0, 0, 0, 0),
  (16, 'phoi-long-danh-trung-inox-16', 'Phới lồng đánh trứng Inox', 2, 6, 'Cỡ 25cm', 'Phới lồng thép không gỉ tay cầm gỗ chắc chắn giúp đánh bông lòng đỏ, trộn đều hỗn hợp bột và sốt kem mịn mượt.', 'Nhập khẩu', 4.80, 62, '740', 'cái', 0, 'in_stock', 0, 0, 1, 0),
  (17, 'khuon-banh-bong-lan-tron-chong-dinh-20cm-17', 'Khuôn bánh bông lan tròn chống dính (20cm)', 2, 6, 'Đường kính 20cm', 'Khuôn đế rời đường kính 20cm truyền nhiệt đều và phủ chống dính an toàn, giúp tách bánh bông lan dễ dàng.', 'Nhập khẩu', 4.90, 105, '980', 'cái', 0, 'in_stock', 1, 1, 1, 0),
  (18, 'giay-nen-nuong-banh-chong-dinh-cuon-5m-18', 'Giấy nến nướng bánh chống dính (Cuộn 5m)', 3, 6, 'Cuộn 5m × 30cm', 'Giấy nến phủ silicone chống dính 2 mặt chịu nhiệt tới 230°C, giúp lót khay nướng cookie và khuôn bánh sạch sẽ.', 'Việt Nam', 4.80, 132, '1.7k', 'cuộn', 0, 'in_stock', 0, 0, 0, 0),
  (19, 'cup-giay-nuong-banh-cupcake-50-cai-19', 'Cup giấy nướng bánh Cupcake (50 cái)', 3, 6, 'Lốc 50 cup', 'Bộ 50 cup giấy xếp ly dày dặn chống thấm dầu, giữ phom bánh cupcake và muffin đứng đẹp trong lò nướng.', 'Việt Nam', 4.90, 118, '1.6k', 'lốc', 0, 'in_stock', 0, 1, 0, 0),
  (20, 'bo-dui-bat-kem-inox-12-dau-20', 'Bộ đui bắt kem Inox 12 đầu', 3, 6, 'Bộ 12 đui + khớp nối', 'Bộ 12 đui tạo hình sao, hoa hồng, lá, viền sò bằng inox 304 liền khối kèm khớp nối tiện lợi cho trang trí bánh.', 'Nhập khẩu', 4.90, 94, '1.1k', 'bộ', 0, 'in_stock', 0, 1, 1, 0),
  (21, 'hop-giay-dung-banh-kem-co-quai-xach-21', 'Hộp giấy đựng bánh kem có quai xách', 3, 6, 'Set 2 hộp (25×25×18cm)', 'Hộp đựng bánh kích thước 25x25x18cm có quai xách chắc chắn và cửa sổ mica trong suốt sang trọng để mang biếu tặng.', 'Việt Nam', 4.80, 77, '960', 'set', 0, 'in_stock', 0, 0, 0, 0),
  (22, 'bo-khuon-banh-tart-vo-so-chong-dinh-22', 'Bộ khuôn bánh Tart vỏ sò chống dính', 2, 6, 'Bộ 6 khuôn mini', 'Bộ 6 khuôn Tart mini phủ chống dính cao cấp giúp tạo hình vỏ bánh Tart giòn rụm, tách khuôn nhanh không vỡ viền.', 'Nhập khẩu', 4.90, 18, 'Sắp mở bán', 'bộ', 0, 'coming_soon', 0, 1, 0, 0),
  (23, 'bot-tron-san-banh-bong-lan-vani-23', 'Bột trộn sẵn Bánh Bông Lan Vani', 1, 1, 'Gói 500g', 'Bột trộn sẵn hương vani tự nhiên dành cho người bận rộn, chỉ cần thêm trứng và bơ để nướng cốt bông lan xốp mịn.', 'Việt Nam', 4.80, 24, 'Sắp mở bán', 'gói', 0, 'coming_soon', 0, 1, 0, 0);

INSERT INTO product_subcategories (product_id, subcategory_id) VALUES
  (1, 1),
  (2, 1),
  (3, 1),
  (4, 2),
  (5, 2),
  (6, 3),
  (7, 6),
  (8, 6),
  (9, 6),
  (10, 6),
  (11, 9),
  (11, 11),
  (11, 8),
  (12, 3),
  (13, 1),
  (14, 4),
  (15, 4),
  (16, 7),
  (17, 5),
  (17, 10),
  (18, 10),
  (18, 12),
  (19, 10),
  (19, 11),
  (20, 11),
  (20, 8),
  (21, 9),
  (21, 12),
  (22, 5),
  (22, 10),
  (23, 1),
  (23, 2);

INSERT INTO product_variants (product_id, option_index, short_label, unit_amount, unit_type, price, old_price, stock_qty, is_default) VALUES
  (1, 0, 'Gói 1kg', 1000.00, 'g', 52000, 64000, 180, 1),
  (1, 1, 'Túi 500g', 500.00, 'g', 28000, 34000, 180, 0),
  (1, 2, 'Túi 300g', 300.00, 'g', 19000, 24000, 180, 0),
  (1, 3, 'Gói 100g dùng thử', 100.00, 'g', 9000, 12000, 180, 0),
  (2, 0, 'Gói 1kg', 1000.00, 'g', 45000, 54000, 140, 1),
  (2, 1, 'Túi 500g', 500.00, 'g', 25000, 30000, 140, 0),
  (2, 2, 'Túi 300g', 300.00, 'g', 17000, 22000, 140, 0),
  (2, 3, 'Gói 100g dùng thử', 100.00, 'g', 8000, 11000, 140, 0),
  (3, 0, 'Gói 1kg', 1000.00, 'g', 32000, 40000, 150, 1),
  (3, 1, 'Túi 500g', 500.00, 'g', 18000, 23000, 150, 0),
  (3, 2, 'Túi 300g', 300.00, 'g', 13000, 17000, 150, 0),
  (3, 3, 'Gói 100g dùng thử', 100.00, 'g', 6500, 9000, 150, 0),
  (4, 0, 'Hộp 100g', 100.00, 'g', 65000, 78000, 85, 1),
  (4, 1, 'Hộp 226g', 226.00, 'g', 135000, 160000, 85, 0),
  (5, 0, 'Gói 100g', 100.00, 'g', 75000, 90000, 65, 1),
  (5, 1, 'Gói 200g', 200.00, 'g', 140000, 165000, 65, 0),
  (6, 0, 'Hộp 250ml', 250.00, 'ml', 45000, 54000, 90, 1),
  (6, 1, 'Hộp 1 Lít', 1000.00, 'ml', 155000, 180000, 90, 0),
  (7, 0, 'Mẫu tiêu chuẩn (5kg/1g)', 5000.00, 'g', 120000, 120000, 70, 1),
  (7, 1, 'Kèm khay & pin dự phòng', 1.00, 'sản phẩm', 145000, 145000, 70, 0),
  (8, 0, 'Ca 500ml', 500.00, 'ml', 45000, 45000, 120, 1),
  (8, 1, 'Ca 1000ml', 1000.00, 'ml', 68000, 68000, 120, 0),
  (9, 0, 'Bộ 5 thìa tiêu chuẩn', 1.00, 'sản phẩm', 35000, 35000, 135, 1),
  (9, 1, 'Bộ 8 thìa inox', 1.00, 'sản phẩm', 58000, 58000, 135, 0),
  (10, 0, 'Đầu dò tiêu chuẩn', 1.00, 'sản phẩm', 95000, 115000, 60, 1),
  (10, 1, 'Đầu dò dài chuyên dụng', 1.00, 'sản phẩm', 118000, 140000, 60, 0),
  (11, 0, 'Túi 50 cái cỡ vừa', 1.00, 'sản phẩm', 25000, 25000, 220, 1),
  (11, 1, 'Túi 100 cái cỡ lớn', 1.00, 'sản phẩm', 42000, 42000, 220, 0),
  (12, 0, 'Khối 227g', 227.00, 'g', 68000, 82000, 110, 1),
  (12, 1, 'Combo 2 khối (454g)', 454.00, 'g', 130000, 158000, 110, 0),
  (13, 0, 'Túi 1kg', 1000.00, 'g', 28000, 28000, 200, 1),
  (13, 1, 'Túi 500g', 500.00, 'g', 16000, 16000, 200, 0),
  (14, 0, 'Hộp 100g', 100.00, 'g', 48000, 58000, 95, 1),
  (14, 1, 'Gói 50g dùng thử', 50.00, 'g', 27000, 34000, 95, 0),
  (15, 0, 'Vỉ 10 quả', 10.00, 'quả', 34000, 34000, 80, 1),
  (15, 1, 'Hộp 6 quả', 6.00, 'quả', 22000, 22000, 80, 0),
  (16, 0, 'Cỡ 25cm tiêu chuẩn', 1.00, 'sản phẩm', 42000, 52000, 95, 1),
  (16, 1, 'Cỡ 30cm cán dài', 1.00, 'sản phẩm', 54000, 66000, 95, 0),
  (17, 0, 'Đường kính 20cm (Đế rời)', 1.00, 'sản phẩm', 115000, 140000, 75, 1),
  (17, 1, 'Đường kính 22cm (Đế rời)', 1.00, 'sản phẩm', 135000, 165000, 75, 0),
  (18, 0, 'Cuộn 5m × 30cm', 1.00, 'sản phẩm', 29000, 29000, 190, 1),
  (18, 1, 'Cuộn 10m × 30cm', 1.00, 'sản phẩm', 52000, 52000, 190, 0),
  (19, 0, 'Lốc 50 cup tiêu chuẩn', 1.00, 'sản phẩm', 24000, 24000, 240, 1),
  (19, 1, 'Lốc 100 cup', 1.00, 'sản phẩm', 44000, 44000, 240, 0),
  (20, 0, 'Bộ 12 đui + khớp nối', 1.00, 'sản phẩm', 65000, 79000, 88, 1),
  (20, 1, 'Bộ 24 đui chuyên nghiệp', 1.00, 'sản phẩm', 115000, 140000, 88, 0),
  (21, 0, 'Set 2 hộp (25×25×18cm)', 1.00, 'sản phẩm', 38000, 38000, 145, 1),
  (21, 1, 'Set 5 hộp tiết kiệm', 1.00, 'sản phẩm', 88000, 88000, 145, 0),
  (22, 0, 'Bộ 6 khuôn Tart mini', 1.00, 'sản phẩm', 135000, 135000, 0, 1),
  (23, 0, 'Gói 500g', 500.00, 'g', 58000, 58000, 0, 1);

INSERT INTO product_images (product_id, image_path, sort_order) VALUES
  (1, 'images/products/bot-mi-so-8-1.jpg', 1),
  (1, 'images/products/bot-mi-so-8-2.jpg', 2),
  (1, 'images/products/bot-mi-so-8-3.jpg', 3),
  (2, 'images/products/bot-mi-so-11-1.jpg', 1),
  (2, 'images/products/bot-mi-so-11-2.jpg', 2),
  (2, 'images/products/bot-mi-so-11-3.jpg', 3),
  (3, 'images/products/bot-mi-meizan-1.jpg', 1),
  (3, 'images/products/bot-mi-meizan-2.jpg', 2),
  (3, 'images/products/bot-mi-meizan-3.jpg', 3),
  (4, 'images/products/bot-cacao-hershey-1.jpg', 1),
  (4, 'images/products/bot-cacao-hershey-2.jpg', 2),
  (4, 'images/products/bot-cacao-hershey-3.jpg', 3),
  (5, 'images/products/matcha-lam-banh-1.jpg', 1),
  (5, 'images/products/matcha-lam-banh-2.jpg', 2),
  (5, 'images/products/matcha-lam-banh-3.jpg', 3),
  (6, 'images/products/whipping-cream-1.jpg', 1),
  (6, 'images/products/whipping-cream-2.jpg', 2),
  (6, 'images/products/whipping-cream-3.jpg', 3),
  (7, 'images/products/can-dien-tu-1.jpg', 1),
  (7, 'images/products/can-dien-tu-2.jpg', 2),
  (7, 'images/products/can-dien-tu-3.jpg', 3),
  (8, 'images/products/ca-dong-1.jpg', 1),
  (8, 'images/products/ca-dong-2.jpg', 2),
  (8, 'images/products/ca-dong-3.jpg', 3),
  (9, 'images/products/thia-dong-1.jpg', 1),
  (9, 'images/products/thia-dong-2.jpg', 2),
  (9, 'images/products/thia-dong-3.jpg', 3),
  (10, 'images/products/nhiet-ke-1.jpg', 1),
  (10, 'images/products/nhiet-ke-2.jpg', 2),
  (10, 'images/products/nhiet-ke-3.jpg', 3),
  (11, 'images/products/tui-bat-kem-1.jpg', 1),
  (11, 'images/products/tui-bat-kem-2.jpg', 2),
  (11, 'images/products/tui-bat-kem-3.jpg', 3),
  (12, 'images/products/bo-lat-anchor-1.jpg', 1),
  (12, 'images/products/bo-lat-anchor-2.jpg', 2),
  (12, 'images/products/bo-lat-anchor-3.jpg', 3),
  (13, 'images/products/duong-tinh-luyen-1.jpg', 1),
  (13, 'images/products/duong-tinh-luyen-2.jpg', 2),
  (13, 'images/products/duong-tinh-luyen-3.jpg', 3),
  (14, 'images/products/cream-of-tartar-1.jpg', 1),
  (14, 'images/products/cream-of-tartar-2.jpg', 2),
  (14, 'images/products/cream-of-tartar-3.jpg', 3),
  (15, 'images/products/trung-ga-tuoi-1.jpg', 1),
  (15, 'images/products/trung-ga-tuoi-2.jpg', 2),
  (15, 'images/products/trung-ga-tuoi-3.jpg', 3),
  (16, 'images/products/phoi-long-1.jpg', 1),
  (16, 'images/products/phoi-long-2.jpg', 2),
  (16, 'images/products/phoi-long-3.jpg', 3),
  (17, 'images/products/khuon-banh-tron-1.jpg', 1),
  (17, 'images/products/khuon-banh-tron-2.jpg', 2),
  (17, 'images/products/khuon-banh-tron-3.jpg', 3),
  (18, 'images/products/giay-nen-1.jpg', 1),
  (18, 'images/products/giay-nen-2.jpg', 2),
  (18, 'images/products/giay-nen-3.jpg', 3),
  (19, 'images/products/cup-giay-1.jpg', 1),
  (19, 'images/products/cup-giay-2.jpg', 2),
  (19, 'images/products/cup-giay-3.jpg', 3),
  (20, 'images/products/bo-dui-bat-kem-1.jpg', 1),
  (20, 'images/products/bo-dui-bat-kem-2.jpg', 2),
  (20, 'images/products/bo-dui-bat-kem-3.jpg', 3),
  (21, 'images/products/hop-dung-banh-1.jpg', 1),
  (21, 'images/products/hop-dung-banh-2.jpg', 2),
  (21, 'images/products/hop-dung-banh-3.jpg', 3),
  (22, 'images/categories/cat-tools.jpg', 1),
  (23, 'images/about-ingredients.jpg', 1);

INSERT INTO product_specs (product_id, spec_key, spec_value, sort_order) VALUES
  (1, 'Thương hiệu', 'Baker''s Choice (Interflour Việt Nam)', 1),
  (1, 'Hàm lượng Protein', '8.0% – 9.0% (Bột mì số 8 chuyên bánh mềm xốp)', 2),
  (1, 'Thành phần', '100% lúa mì chọn lọc xay mịn, không chất tẩy trắng', 3),
  (1, 'Công dụng phù hợp', 'Thích hợp làm bánh bông lan, chiffon, cupcake, muffin và các loại bánh mềm xốp.', 4),
  (1, 'Hướng dẫn sử dụng', 'Rây mịn bột trước khi trộn để hỗn hợp tơi xốp và không vón cục.', 5),
  (1, 'Quy cách bảo quản', 'Bảo quản nơi khô ráo, thoáng mát, buộc kín miệng túi sau khi mở.', 6),
  (2, 'Thương hiệu', 'Baker''s Choice (Interflour Việt Nam)', 1),
  (2, 'Hàm lượng Protein', '11.5% – 13.0% (Tạo màng gluten dai khỏe chuẩn bánh mì)', 2),
  (2, 'Thành phần', '100% lúa mì cứng chất lượng cao', 3),
  (2, 'Công dụng phù hợp', 'Phù hợp làm bánh mì hoa cúc, baguette, bánh mì sữa Hokkaido và đế pizza.', 4),
  (2, 'Hướng dẫn sử dụng', 'Kết hợp cùng men nở và nhồi bột đúng thời gian để đạt độ dai thớ tối ưu.', 5),
  (2, 'Quy cách bảo quản', 'Bảo quản nơi khô ráo, thoáng mát, tránh ẩm mốc.', 6),
  (3, 'Thương hiệu', 'MEIZAN (Tập đoàn FFM Berhad & Wilmar)', 1),
  (3, 'Hàm lượng Protein', '9.5% – 11.5% (Đạt độ đàn hồi dẻo dai chuẩn đa dụng)', 2),
  (3, 'Thành phần', '100% lúa mì hảo hạng nhập khẩu, bổ sung vi chất sắt và kẽm', 3),
  (3, 'Ứng dụng phù hợp', 'Bánh muffin, pancake, bánh quy bơ, bánh bao và các món nướng gia đình.', 4),
  (3, 'Quy cách bảo quản', 'Bảo quản nơi khô ráo, sạch sẽ, thoáng mát, tránh nơi có mùi nồng.', 5),
  (4, 'Thương hiệu', 'Hershey''s (100% Cacao Natural Unsweetened)', 1),
  (4, 'Thành phần', '100% bột cacao tự nhiên nguyên chất không đường, không chất bảo quản', 2),
  (4, 'Đặc điểm hương vị', 'Màu nâu đậm tự nhiên, vị chocolate nguyên bản, hương thơm nồng ấm', 3),
  (4, 'Ứng dụng phù hợp', 'Tạo hương vị chocolate đậm đà cho brownie, muffin, bánh quy và mousse.', 4),
  (4, 'Quy cách bảo quản', 'Bảo quản nơi khô ráo, đậy kín nắp sau khi dùng.', 5),
  (5, 'Thương hiệu', 'BakeMate Selected (Culinary Matcha)', 1),
  (5, 'Thành phần', '100% lá trà xanh nghiền mịn chuyên dụng làm bánh', 2),
  (5, 'Đặc điểm màu sắc', 'Bột siêu mịn dễ hòa tan, màu xanh dịu tự nhiên và hương trà thanh nhẹ', 3),
  (5, 'Ứng dụng phù hợp', 'Dùng làm cupcake, chiffon, bánh quy và tiramisu trà xanh.', 4),
  (5, 'Quy cách bảo quản', 'Đậy kín túi zip, tránh ánh sáng trực tiếp và nhiệt độ cao.', 5),
  (6, 'Thương hiệu', 'Anchor (Kem tươi sữa bò tiệt trùng không đường)', 1),
  (6, 'Hàm lượng chất béo', '35.1% chất béo sữa tự nhiên, đánh bông mịn đứng form', 2),
  (6, 'Ứng dụng phù hợp', 'Đánh bông chà láng bánh kem, làm nhân su kem, mousse và panna cotta.', 3),
  (6, 'Hướng dẫn sử dụng', 'Làm lạnh hộp kem và âu đánh ở 2 – 4°C trước khi đánh bông.', 4),
  (6, 'Quy cách bảo quản', 'Bảo quản ngăn mát tủ lạnh (2 – 4°C), không cấp đông.', 5),
  (7, 'Thương hiệu', 'BakeMate Kitchen Tools', 1),
  (7, 'Tải trọng & Độ chia', 'Cân tối đa 5kg | Độ chia chính xác 1g', 2),
  (7, 'Tính năng nổi bật', 'Chuyển đổi g / oz / ml; nút Tare trừ bì tiện lợi, màn hình LCD rõ nét', 3),
  (7, 'Công dụng phù hợp', 'Cân đo chính xác từng gram bột, đường, bơ, men nở cho mọi công thức bánh.', 4),
  (7, 'Quy cách bảo quản', 'Lau bằng khăn ẩm nhẹ, tránh ngâm nước, bảo quản nơi khô ráo.', 5),
  (8, 'Thương hiệu', 'BakeMate Kitchen Tools', 1),
  (8, 'Chất liệu', 'Nhựa PP nguyên sinh an toàn thực phẩm, trong suốt', 2),
  (8, 'Thang đo dung tích', 'Vạch chia ml và cup rõ nét hai mặt, vòi rót chống nhỏ giọt', 3),
  (8, 'Công dụng phù hợp', 'Đo lường chính xác lượng nước, sữa tươi, mật ong và chất lỏng.', 4),
  (8, 'Quy cách bảo quản', 'Rửa sạch sau sử dụng, tránh đặt sát nguồn lửa trực tiếp.', 5),
  (9, 'Thương hiệu', 'BakeMate Kitchen Tools', 1),
  (9, 'Quy cách bộ thìa', '5 cỡ chuẩn tsp / tbsp (1.25ml, 2.5ml, 5ml, 7.5ml, 15ml)', 2),
  (9, 'Công dụng phù hợp', 'Định lượng chuẩn các nguyên liệu nhỏ như Cream of Tartar, men nở, vani, muối.', 3),
  (9, 'Hướng dẫn sử dụng', 'Gạt ngang miệng thìa bằng sống dao để đúng dung tích tiêu chuẩn.', 4),
  (9, 'Quy cách bảo quản', 'Lau khô sau khi rửa và móc gọn vào khoen giữ.', 5),
  (10, 'Thương hiệu', 'BakeMate Kitchen Tools', 1),
  (10, 'Dải đo nhiệt độ', '-50°C đến 300°C | Hiển thị nhanh trên màn hình điện tử', 2),
  (10, 'Chất liệu đầu dò', 'Thép không gỉ 304 an toàn thực phẩm, dễ vệ sinh', 3),
  (10, 'Công dụng phù hợp', 'Kiểm tra nhiệt độ sữa ấm kích men nở, đun chảy bơ socola, thắng đường caramel.', 4),
  (10, 'Quy cách bảo quản', 'Lau sạch đầu dò inox, không ngâm thân máy vào nước.', 5),
  (11, 'Thương hiệu', 'BakeMate Packaging & Tools', 1),
  (11, 'Chất liệu', 'Nhựa PE thực phẩm dày dặn, bề mặt vân nhám chống trơn trượt', 2),
  (11, 'Tính tương thích', 'Lắp vừa mọi loại đui bắt kem inox hoặc cắt đầu bóp trực tiếp', 3),
  (11, 'Công dụng phù hợp', 'Trang trí kem cupcake, tạo hình bánh quy bơ và bơm nhân su kem.', 4),
  (11, 'Quy cách bảo quản', 'Bảo quản nơi khô ráo, sạch sẽ, tránh nhiệt độ cao.', 5),
  (12, 'Thương hiệu', 'Anchor (Fonterra New Zealand)', 1),
  (12, 'Thành phần', 'Bơ sữa bò nguyên chất 82.9% chất béo sữa, không muối', 2),
  (12, 'Đặc điểm hương vị', 'Vàng tự nhiên, mềm dẻo ở nhiệt độ phòng, mùi thơm bơ sữa béo ngậy', 3),
  (12, 'Ứng dụng phù hợp', 'Nguyên liệu không thể thiếu cho bánh mì hoa cúc, quy bơ, brownie và croissant.', 4),
  (12, 'Quy cách bảo quản', 'Bảo quản ngăn mát tủ lạnh (2–4°C) hoặc ngăn đông nếu dùng lâu dài.', 5),
  (13, 'Thương hiệu', 'Đường Biên Hòa (TTC Sugar)', 1),
  (13, 'Độ tinh khiết', '≥ 99.8% Sucrose, hạt đường trắng mịn đều, không tẩy trắng', 2),
  (13, 'Công dụng phù hợp', 'Tan nhanh khi đánh bông trứng làm bông lan, nấu caramel và tạo vị ngọt thanh.', 3),
  (13, 'Quy cách bảo quản', 'Đậy kín hộp hoặc buộc chặt túi sau sử dụng, tránh nơi ẩm ướt.', 4),
  (14, 'Thương hiệu', 'Baker''s Baking Essentials', 1),
  (14, 'Thành phần', '100% Potassium Bitartrate tinh khiết dùng trong làm bánh', 2),
  (14, 'Công dụng nổi bật', 'Ổn định bọt khí lòng trắng trứng giúp bánh bông lan, chiffon nở cao không xẹp.', 3),
  (14, 'Liều lượng khuyên dùng', '1/4 – 1/2 thìa cà phê (khoảng 1–2g) cho 4 lòng trắng trứng.', 4),
  (14, 'Quy cách bảo quản', 'Đậy kín nắp sau khi mở, đặt nơi khô ráo thoáng mát.', 5),
  (15, 'Thương hiệu', 'BakeMate Farm Fresh Eggs', 1),
  (15, 'Khối lượng quả', '55 – 60g/quả đồng đều (đúng chuẩn cân nặng công thức làm bánh)', 2),
  (15, 'Đặc điểm chất lượng', 'Lòng trắng sánh trong dễ đánh bông, lòng đỏ đậm màu tạo hương thơm béo', 3),
  (15, 'Giao hàng & Đóng gói', 'Đựng trong vỉ bảo vệ chống sốc chuyên dụng, giao nhanh trong 2h nội thành.', 4),
  (15, 'Quy cách bảo quản', 'Bảo quản ngăn mát tủ lạnh và để về nhiệt độ phòng trước khi đánh bánh 30 phút.', 5),
  (16, 'Thương hiệu', 'BakeMate Kitchen Tools', 1),
  (16, 'Chất liệu', 'Thép không gỉ 304 đan 10 nan đàn hồi, tay cầm gỗ sồi tự nhiên', 2),
  (16, 'Kích thước', 'Dài 25cm (Tiêu chuẩn) hoặc 30cm (Cán dài đánh âu sâu)', 3),
  (16, 'Công dụng phù hợp', 'Đánh đều lòng đỏ trứng, trộn bột loãng, hòa kem tươi và sốt custard.', 4),
  (16, 'Quy cách bảo quản', 'Rửa sạch ngay sau khi dùng, treo ráo bằng móc inox cuối tay cầm.', 5),
  (17, 'Thương hiệu', 'BakeMate Bakeware', 1),
  (17, 'Chất liệu', 'Hợp kim nhôm Anodized phủ chống dính cao cấp, đế rời tiện tách bánh', 2),
  (17, 'Kích thước chuẩn', 'Đường kính 20cm × Chiều cao 7.5cm (hoặc cỡ 22cm)', 3),
  (17, 'Công dụng phù hợp', 'Nướng cốt bông lan sinh nhật, chiffon, cheesecake và đổ mousse lạnh.', 4),
  (17, 'Quy cách bảo quản', 'Dùng mút mềm vệ sinh sau khi nguội, không dùng cọ sắt làm trầy lớp phủ.', 5),
  (18, 'Thương hiệu', 'BakeMate Baking Essentials', 1),
  (18, 'Chất liệu & An toàn', 'Bột gỗ nguyên chất phủ silicone chống dính 2 mặt, không chứa PFAS', 2),
  (18, 'Khả năng chịu nhiệt', 'Chịu nhiệt lên đến 230°C (an toàn với lò nướng và nồi chiên không dầu)', 3),
  (18, 'Công dụng phù hợp', 'Lót đáy khuôn brownie, bánh bông lan, nướng bánh quy bơ không bám khay.', 4),
  (18, 'Quy cách bảo quản', 'Bảo quản hộp nơi khô ráo, sử dụng thanh răng cưa trên hộp để cắt nhanh.', 5),
  (19, 'Thương hiệu', 'BakeMate Packaging & Tools', 1),
  (19, 'Chất liệu', 'Giấy kraft thực phẩm định lượng dày chống thấm dầu mỡ', 2),
  (19, 'Kích thước chuẩn', 'Đường kính đáy 5cm × Cao 3.8cm (vừa khay 6 hoặc 12 lỗ)', 3),
  (19, 'Công dụng phù hợp', 'Nướng trực tiếp muffin chocolate, cupcake trà xanh giữ phom đứng đẹp.', 4),
  (19, 'Quy cách bảo quản', 'Đậy kín hộp nhựa bảo vệ tránh bụi ẩm và giữ nếp xếp ly.', 5),
  (20, 'Thương hiệu', 'BakeMate Kitchen Tools', 1),
  (20, 'Chất liệu & Phụ kiện', '12 đui Inox 304 đúc liền khối chống gỉ + khớp nối nhựa PP', 2),
  (20, 'Kiểu hoa văn', 'Đui sao mở/đóng, đui cánh hoa hồng, đui lá, viền sò, đui viết nét', 3),
  (20, 'Công dụng phù hợp', 'Trang trí kem cupcake, bánh sinh nhật và bắt bột bánh quy bơ tạo hình.', 4),
  (20, 'Quy cách bảo quản', 'Rửa nước ấm để sạch bơ kem, lau khô và cất trong hộp nhựa kèm theo.', 5),
  (21, 'Thương hiệu', 'BakeMate Packaging & Tools', 1),
  (21, 'Kích thước hộp', '25 × 25 × 18cm (vừa bánh tròn 20cm kèm đế vàng)', 2),
  (21, 'Chất liệu', 'Giấy Ivory 350gsm dày cứng kết hợp cửa sổ mica trong suốt và quai xách', 3),
  (21, 'Công dụng phù hợp', 'Đóng gói bảo vệ bánh kem, mousse, hoa cúc gọn gàng khi biếu tặng bạn bè.', 4),
  (21, 'Quy cách bảo quản', 'Để phẳng ở nơi khô thoáng, gấp gọn theo nếp cấn sẵn khi sử dụng.', 5),
  (22, 'Thương hiệu', 'BakeMate Bakeware', 1),
  (22, 'Chất liệu', 'Thép carbon phủ chống dính cao cấp, viền gợn sóng cổ điển', 2),
  (22, 'Quy cách', 'Bộ 6 khuôn Tart mini đường kính 8cm × cao 2.2cm', 3),
  (22, 'Trạng thái', 'Sản phẩm sắp mở bán — thêm vào Yêu thích để nhận thông báo sớm', 4),
  (23, 'Thương hiệu', 'Baker''s Choice', 1),
  (23, 'Thành phần', 'Bột mì số 8, đường xay mịn, bột nở và hương vani tự nhiên', 2),
  (23, 'Quy cách', 'Gói 500g tiện lợi (nướng được 2 ổ bánh tròn 18cm)', 3),
  (23, 'Trạng thái', 'Sản phẩm sắp mở bán — thêm vào Yêu thích để nhận thông báo sớm', 4);

INSERT INTO coupons (code, discount_scope, discount_type, discount_value, min_subtotal, usage_limit, used_count, is_active, description) VALUES
  ('CHAOBANMOI', 'product', 'percent', 10, 0, 1000, 0, 1, 'Giảm 10% cho đơn hàng đầu tiên'),
  ('FREESHIP20', 'shipping', 'fixed', 20000, 200000, 1000, 0, 1, 'Freeship 20.000 ₫ cho đơn từ 200.000 ₫');

INSERT INTO recipes (id, slug, code, title, subtitle, category, tags_json, rating_avg, bake_minutes, time_label, difficulty, default_servings, servings_unit, image_path, author, is_published) VALUES
  (1, 'recipe-bong-lan', 'RECIPE NO. 01', 'Bánh bông lan cơ bản', 'Cốt bánh mềm ẩm, bông xốp nhẹ tan nhờ bột mì số 8 và kỹ thuật ổn định lòng trắng.', 'Bánh ngọt', '["Bánh ngọt","Bánh kem"]', 4.90, 40, '55 phút', 'Dễ', 4, 'khẩu phần (1 ổ 20cm)', 'images/about-baking.jpg', 'Minh Thư · BakeMate Studio', 1),
  (2, 'recipe-matcha-cupcake', 'RECIPE NO. 02', 'Cupcake vanilla & kem Matcha', 'Những chiếc cupcake thơm ngậy kết hợp bột mì số 8 và lớp kem whipping mịn mượt.', 'Bánh ngọt', '["Bánh ngọt","Bánh kem"]', 4.80, 22, '45 phút', 'Dễ', 6, 'chiếc cupcake', 'images/about-sharing-cakes.jpg', 'Bảo Ngọc · BakeMate Kitchen', 1),
  (3, 'recipe-banh-quy-bo', 'RECIPE NO. 03', 'Cookies bơ Đan Mạch giòn tan', 'Hương bơ sữa Anchor 82.9% béo ngậy cùng từng đường vân hoa cúc giòn xốp.', 'Bánh quy', '["Bánh quy"]', 4.90, 18, '35 phút', 'Trung bình', 6, 'phần (khoảng 30 chiếc)', 'images/about-beginner.jpg', 'Đen Ny · BakeMate Craft', 1),
  (4, 'recipe-hoa-cuc', 'RECIPE NO. 04', 'Bánh mì hoa cúc ngàn lớp', 'Từng thớ bánh dai mềm kéo sợi hòa quyện bơ sữa thơm lừng chuẩn vị Pháp.', 'Bánh mì', '["Bánh mì"]', 4.80, 28, '90 phút', 'Trung bình', 4, 'phần (2 ổ 450g)', 'images/about-young-bakers.jpg', 'Gia Bảo · BakeMate Kitchen', 1),
  (5, 'recipe-muffin-socola', 'RECIPE NO. 05', 'Muffin Chocolate Hạnh Nhân', 'Không cần máy đánh trứng — 40 phút có ngay khay muffin cacao Hershey''s đậm đà.', 'Bánh ngọt', '["Bánh ngọt"]', 4.90, 25, '40 phút', 'Dễ', 6, 'chiếc muffin', 'images/banner.jpg', 'Bảo Ngọc · BakeMate Community', 1),
  (6, 'recipe-brownie', 'RECIPE NO. 06', 'Bánh Brownie Chocolate mặt bóng', 'Lớp vỏ nứt giòn nhẹ bọc lấy phần ruột ẩm dẻo đậm vị cacao nguyên chất.', 'Bánh ngọt', '["Bánh ngọt"]', 4.90, 25, '45 phút', 'Dễ', 6, 'miếng vuông', 'images/contact-baking.jpg', 'Nguyễn Thương · BakeMate Baker', 1),
  (7, 'recipe-mousse-socola', 'RECIPE NO. 07', 'Bánh Mousse Socola lạnh mịn mượt', 'Công thức không cần lò nướng mát lạnh tan chảy, tách khuôn đế rời sắc nét.', 'Tráng miệng', '["Tráng miệng","Bánh kem","Bánh không cần lò nướng"]', 4.80, 15, '75 phút', 'Trung bình', 4, 'phần (1 ổ 20cm)', 'images/about-ingredients.jpg', 'Minh Thư · BakeMate Studio', 1),
  (8, 'recipe-pancake', 'RECIPE NO. 08', 'Bánh Pancake mật ong bữa sáng', 'Chỉ 25 phút với bột mì đa dụng Meizan cho chồng bánh vàng ươm mềm xốp.', 'Bánh ngọt', '["Bánh ngọt","Bánh không cần lò nướng"]', 4.80, 10, '25 phút', 'Dễ', 4, 'phần (8 chiếc)', 'images/products/bot-mi-meizan-1.jpg', 'Nguyễn Thương · BakeMate Baker', 1);

INSERT INTO recipe_steps (recipe_id, step_order, instruction) VALUES
  (1, 1, 'Tách riêng lòng đỏ và lòng trắng trứng gà; làm nóng trước lò nướng ở 165°C trong 15 phút.'),
  (1, 2, 'Khuấy đều lòng đỏ với sữa tươi, dầu ăn và rây Bột mì số 8 vào trộn đến khi hỗn hợp mịn mượt không vón cục.'),
  (1, 3, 'Đánh bông lòng trắng trứng với Cream of Tartar và Đường tinh luyện chia làm 3 lần đến khi đạt chóp mềm uốn cong.'),
  (1, 4, 'Chia hỗn hợp lòng trắng thành 3 phần, trộn nhẹ (fold) vào âu lòng đỏ rồi đổ vào khuôn 20cm nướng 40–45 phút.'),
  (2, 1, 'Xếp cup giấy nướng bánh vào khay muffin và bật lò làm nóng trước ở 175°C.'),
  (2, 2, 'Đánh tan bơ lạt Anchor mềm với đường tinh luyện đến khi chuyển màu kem nhạt, cho từng quả trứng vào đánh đều.'),
  (2, 3, 'Rây bột mì số 8 và bột Matcha vào âu, trộn nhẹ tay vừa quyện hết bột khô.'),
  (2, 4, 'Múc bột vào cup giấy nướng 22 phút; để nguội hẳn rồi dùng túi bắt kem + đui sao trang trí Whipping Cream lên mặt bánh.'),
  (3, 1, 'Đánh bông Bơ lạt Anchor với đường tinh luyện đến khi bông mịn sáng màu.'),
  (3, 2, 'Rây Bột mì Baker''s Choice số 8 vào âu, dùng phới trộn đều thành khối bột mịn dẻo.'),
  (3, 3, 'Lắp đui sao lớn vào túi bắt kem, cho bột vào và bóp tạo hình bông hoa trên khay đã lót giấy nến.'),
  (3, 4, 'Nướng ở 170°C khoảng 15–18 phút đến khi viền bánh ngả vàng thơm giòn.'),
  (4, 1, 'Cân chuẩn 260g Bột mì số 11, hòa tan men nở với sữa ấm 38°C và đường tinh luyện.'),
  (4, 2, 'Nhồi bột cùng trứng đến khi kết khối dẻo mịn, thêm từng lát Bơ lạt Anchor nhồi tiếp đến khi kéo được màng mỏng không rách.'),
  (4, 3, 'Ủ bột lần 1 trong 50 phút cho nở gấp đôi; chia dải, cán mỏng và thắt bím gọn đặt vào khuôn.'),
  (4, 4, 'Ủ lần 2 thêm 35 phút rồi nướng ở 175°C trong 25–28 phút đến khi vỏ vàng ruộm thơm nức.'),
  (5, 1, 'Làm nóng lò 180°C và xếp 12 cup giấy nướng bánh vào khay muffin.'),
  (5, 2, 'Đun chảy Bơ lạt Anchor rồi khuấy tan Bột cacao Hershey''s cùng đường tinh luyện.'),
  (5, 3, 'Đánh tan trứng với sữa, đổ vào âu bơ cacao rồi rây Bột mì đa dụng Meizan vào khuấy vừa quyện.'),
  (5, 4, 'Chia đều bột vào cup giấy và nướng 22–25 phút ở 180°C.'),
  (6, 1, 'Đun cách thủy Bơ lạt Anchor và Bột cacao Hershey''s ở 50–55°C cho quyện bóng mịn.'),
  (6, 2, 'Đánh trứng và đường đến khi hỗn hợp sáng màu, đường tan hoàn toàn rồi trộn vào bơ cacao.'),
  (6, 3, 'Rây nhẹ 85g Bột mì đa dụng Meizan vào hỗn hợp socola, trộn nhẹ vừa hết bột trắng.'),
  (6, 4, 'Đổ vào khay lót giấy nến chống dính và nướng ở 175°C trong 24–26 phút.'),
  (7, 1, 'Hòa tan 35g Bột cacao Hershey''s với nước/sữa ấm cho mịn mượt rồi để nguội về khoảng 35°C.'),
  (7, 2, 'Đánh bông lạnh Whipping Cream Anchor bằng phới lồng đến khi sánh đặc tạo vân mềm chảy nhẹ.'),
  (7, 3, 'Trộn nhẹ (fold) sốt cacao vào kem tươi rồi đổ vào khuôn tròn đế rời 20cm.'),
  (7, 4, 'Làm lạnh ngăn mát tối thiểu 4 giờ trước khi tách khuôn và rắc thêm lớp cacao mịn.'),
  (8, 1, 'Đánh tan trứng gà với đường, sữa tươi và bơ đun chảy trong ca đong có vạch chia ml.'),
  (8, 2, 'Rây 150g Bột mì đa dụng Meizan vào khuấy đều vừa tan bột (hỗn hợp sánh chảy mịn).'),
  (8, 3, 'Làm nóng chảo chống dính lửa vừa nhỏ, rót từng muỗng bột đều tay đợi bọt khí nổ nhẹ rồi lật mặt.'),
  (8, 4, 'Xếp chồng Pancake ra đĩa, ăn kèm mật ong và lát Bơ lạt Anchor.');

INSERT INTO recipe_tips (recipe_id, tip_order, tip_text) VALUES
  (1, 1, 'Dùng trứng gà ở nhiệt độ phòng giúp lòng trắng dễ đánh bông đạt chóp mềm và không bị tách nước.'),
  (1, 2, 'Luôn rây mịn bột mì số 8 trước khi trộn (fold) theo một chiều từ dưới đáy âu lên để giữ trọn bọt khí.'),
  (1, 3, 'Úp ngược khuôn ngay khi lấy ra khỏi lò để cốt bánh giữ độ cao phẳng mịn không bị xẹp mặt.'),
  (2, 1, 'Whipping Cream cần giữ lạnh sâu 2–4°C trước khi đánh để lên phom đứng sắc nét khi bắt đui.'),
  (2, 2, 'Chỉ đổ bột đầy khoảng 2/3 cup giấy để bánh nở tròn đẹp không bị tràn viền khi nướng.'),
  (3, 1, 'Bơ lạt chỉ nên để mềm ấn nhẹ lún tay (khoảng 18–20°C), không đun chảy lỏng sẽ làm bánh bị chảy bè khi nướng.'),
  (3, 2, 'Làm lạnh khay bánh đã bắt hình 15 phút trong ngăn mát trước khi đưa vào lò để vân hoa giữ nguyên nét.'),
  (4, 1, 'Bắt buộc dùng Bột mì số 11 giàu protein (11.5–13%) để tạo mạng gluten dai khỏe giúp bánh kéo sợi.'),
  (4, 2, 'Kiểm tra nhiệt độ sữa ấm quanh 38°C bằng nhiệt kế điện tử để kích hoạt men nở đạt hiệu quả tốt nhất.'),
  (5, 1, 'Hòa tan cacao vào bơ ấm giúp khơi dậy hương thơm chocolate sâu hơn hẳn khi trộn khô.'),
  (5, 2, 'Không khuấy quá lâu sau khi rây bột mì đa dụng Meizan để bánh giữ độ tơi xốp đặc trưng.'),
  (6, 1, 'Giữ hỗn hợp bơ + cacao đun cách thủy quanh 50–55°C và đánh tan hoàn toàn đường với trứng để mặt bánh bóng vỡ.'),
  (6, 2, 'Lót dư hai mép giấy nến để dễ dàng nhấc nguyên khối Brownie ra khỏi khay cắt vuông vức.'),
  (7, 1, 'Làm lạnh âu trộn 15 phút trước khi đánh Whipping Cream giúp kem bông mịn nhanh mà không bị tách bơ.'),
  (7, 2, 'Dùng khăn ấm lau nhẹ thành ngoài khuôn đế rời trước khi đẩy đáy bánh lên để viền Mousse phẳng bóng.'),
  (8, 1, 'Để bột nghỉ 10 phút trước khi áp chảo và rót bột bằng ca đong chia vạch giúp bánh tròn đều kích cỡ.'),
  (8, 2, 'Chỉ lật mặt bánh khi thấy bề mặt sủi bọt khí đều và mép bánh hơi se khô.');

INSERT INTO recipe_ingredients (recipe_id, sort_order, name, base_amount, unit, product_id, variant_option_index, package_amount, note) VALUES
  (1, 1, 'Bột mì Baker''s Choice số 8', 120.00, 'g', 1, 2, 300.00, NULL),
  (1, 2, 'Đường tinh luyện Biên Hòa', 100.00, 'g', 13, 1, 500.00, NULL),
  (1, 3, 'Trứng gà tươi chuẩn vị', 4.00, 'quả', 15, 1, 6.00, NULL),
  (1, 4, 'Cream of Tartar Baker''s', 4.00, 'g', 14, 1, 50.00, NULL),
  (1, 5, 'Tinh chất vani thực phẩm', 5.00, 'ml', NULL, 0, 0.00, 'Gia vị sẵn có tại bếp'),
  (2, 1, 'Bột mì Baker''s Choice số 8', 140.00, 'g', 1, 2, 300.00, NULL),
  (2, 2, 'Bột Matcha làm bánh', 12.00, 'g', 5, 0, 100.00, NULL),
  (2, 3, 'Whipping Cream Anchor', 200.00, 'ml', 6, 0, 250.00, NULL),
  (2, 4, 'Bơ lạt Anchor', 85.00, 'g', 12, 0, 227.00, NULL),
  (2, 5, 'Đường tinh luyện Biên Hòa', 90.00, 'g', 13, 1, 500.00, NULL),
  (3, 1, 'Bột mì Baker''s Choice số 8', 180.00, 'g', 1, 2, 300.00, NULL),
  (3, 2, 'Bơ lạt Anchor (227g)', 150.00, 'g', 12, 0, 227.00, NULL),
  (3, 3, 'Đường tinh luyện Biên Hòa', 75.00, 'g', 13, 1, 500.00, NULL),
  (3, 4, 'Trứng gà tươi chuẩn vị', 1.00, 'quả', 15, 1, 6.00, NULL),
  (4, 1, 'Bột mì Baker''s Choice số 11', 260.00, 'g', 2, 2, 300.00, NULL),
  (4, 2, 'Bơ lạt Anchor (227g)', 110.00, 'g', 12, 0, 227.00, NULL),
  (4, 3, 'Trứng gà tươi chuẩn vị', 3.00, 'quả', 15, 1, 6.00, NULL),
  (4, 4, 'Đường tinh luyện Biên Hòa', 70.00, 'g', 13, 1, 500.00, NULL),
  (5, 1, 'Bột mì đa dụng Meizan', 150.00, 'g', 3, 2, 300.00, NULL),
  (5, 2, 'Bột cacao nguyên chất Hershey''s', 35.00, 'g', 4, 0, 100.00, NULL),
  (5, 3, 'Bơ lạt Anchor (227g)', 80.00, 'g', 12, 0, 227.00, NULL),
  (5, 4, 'Đường tinh luyện Biên Hòa', 90.00, 'g', 13, 1, 500.00, NULL),
  (6, 1, 'Bột mì đa dụng Meizan', 85.00, 'g', 3, 3, 100.00, NULL),
  (6, 2, 'Bột cacao nguyên chất Hershey''s', 50.00, 'g', 4, 0, 100.00, NULL),
  (6, 3, 'Bơ lạt Anchor (227g)', 120.00, 'g', 12, 0, 227.00, NULL),
  (6, 4, 'Đường tinh luyện Biên Hòa', 110.00, 'g', 13, 1, 500.00, NULL),
  (7, 1, 'Whipping Cream Anchor', 250.00, 'ml', 6, 0, 250.00, NULL),
  (7, 2, 'Bột cacao nguyên chất Hershey''s', 35.00, 'g', 4, 0, 100.00, NULL),
  (7, 3, 'Đường tinh luyện Biên Hòa', 45.00, 'g', 13, 1, 500.00, NULL),
  (8, 1, 'Bột mì đa dụng Meizan', 150.00, 'g', 3, 2, 300.00, NULL),
  (8, 2, 'Trứng gà tươi chuẩn vị', 2.00, 'quả', 15, 1, 6.00, NULL),
  (8, 3, 'Đường tinh luyện Biên Hòa', 40.00, 'g', 13, 1, 500.00, NULL),
  (8, 4, 'Bơ lạt Anchor (227g)', 30.00, 'g', 12, 0, 227.00, NULL);

INSERT INTO recipe_tools (recipe_id, sort_order, name, product_id, variant_option_index, description) VALUES
  (1, 1, 'Khuôn bánh bông lan tròn chống dính (20cm)', 17, 0, 'Đế rời dễ tách bánh nguyên vẹn'),
  (1, 2, 'Phới lồng đánh trứng Inox', 16, 0, 'Đánh tan lòng đỏ và trộn bột mịn'),
  (1, 3, 'Cân điện tử nhà bếp', 7, 0, 'Cân chính xác định lượng 1g'),
  (2, 1, 'Cup giấy nướng bánh Cupcake (50 cái)', 19, 0, 'Giữ phom đứng và chống thấm dầu'),
  (2, 2, 'Túi bắt kem dùng một lần', 11, 0, 'Bóp kem mượt đều không trượt tay'),
  (2, 3, 'Bộ đui bắt kem Inox 12 đầu', 20, 0, 'Tạo vân hoa hồng & ngôi sao sắc nét'),
  (3, 1, 'Giấy nến nướng bánh chống dính', 18, 0, 'Lót khay chống dính lấy bánh dễ dàng'),
  (3, 2, 'Túi bắt kem dùng một lần', 11, 0, 'Chịu lực tốt khi bắt bột quy đặc'),
  (3, 3, 'Bộ đui bắt kem Inox 12 đầu', 20, 0, 'Đầu đui sao tạo vân bánh quy bơ'),
  (4, 1, 'Cân điện tử nhà bếp', 7, 0, 'Đong chuẩn bột mì, bơ và men'),
  (4, 2, 'Nhiệt kế điện tử nhà bếp', 10, 0, 'Đo chuẩn 38°C kích hoạt men nở'),
  (5, 1, 'Cup giấy nướng bánh Cupcake (50 cái)', 19, 0, 'Tiện lợi chia khay nướng sạch sẽ'),
  (5, 2, 'Phới lồng đánh trứng Inox', 16, 0, 'Trộn đều nhanh gọn không cần máy'),
  (6, 1, 'Giấy nến nướng bánh chống dính', 18, 0, 'Nhấc khối bánh ra cắt vuông sắc nét'),
  (6, 2, 'Nhiệt kế điện tử nhà bếp', 10, 0, 'Canh nhiệt đun cách thủy 50–55°C'),
  (7, 1, 'Khuôn bánh bông lan tròn chống dính (20cm)', 17, 0, 'Thiết kế đế rời giúp tách bánh lạnh dễ dàng'),
  (7, 2, 'Phới lồng đánh trứng Inox', 16, 0, 'Đánh kem tươi sánh mượt'),
  (8, 1, 'Ca đong nguyên liệu', 8, 0, 'Đong sữa & rót bột tròn đều'),
  (8, 2, 'Thìa đong định lượng', 9, 0, 'Đong chuẩn vani và bột nở');

INSERT INTO blog_posts (id, slug, recipe_slug, title, category, read_time, difficulty, author, published_at_label, image_path, keywords_text, excerpt, steps_json, is_published) VALUES
  (1, 'post-bong-lan-chiffon', 'recipe-bong-lan', 'Bí quyết làm Bánh Bông Lan Chiffon mềm ẩm, nở cao không xẹp mặt', 'Công thức làm bánh', '55 phút thực hiện', 'Dễ', 'Minh Thư · BakeMate Studio', '08/11/2026', 'images/about-baking.jpg', 'bông lan, bông lan chiffon, bột mì số 8, cream of tartar', 'Chọn đúng bột mì số 8 có hàm lượng protein thấp 8–9% và ổn định lòng trắng trứng với Cream of Tartar giúp cốt bánh bông nhẹ tan ngay trong miệng.', '["Tách riêng 5 lòng đỏ và 5 lòng trắng trứng gà ở nhiệt độ phòng; làm nóng trước lò ở 160°C trong 15 phút.","Trộn đều lòng đỏ với sữa tươi, dầu ăn và rây 120g Bột mì số 8 vào khuấy theo một chiều cho mịn mượt.","Đánh bông lòng trắng với 1\\/2 thìa Cream of Tartar và 100g đường tinh luyện theo 3 lần chia cho đến khi đạt chóp mềm uốn cong.","Trộn nhẹ nhàng (fold) hỗn hợp lòng trắng vào âu lòng đỏ theo kỹ thuật hất từ đáy âu lên để không vỡ bọt khí.","Đổ bột vào khuôn tròn 20cm và nướng cách thủy hoặc nướng ở 155–160°C trong 45 phút, úp ngược khuôn ngay khi lấy ra."]', 1),
  (2, 'post-banh-mi-hoa-cuc', 'recipe-hoa-cuc', 'Cách làm Bánh Mì Hoa Cúc ngàn lớp thơm lừng bơ sữa tại nhà', 'Công thức làm bánh', '90 phút thực hiện', 'Vừa', 'Gia Bảo · BakeMate Kitchen', '06/11/2026', 'images/about-young-bakers.jpg', 'bánh mì hoa cúc, bột mì số 11, bơ lạt anchor', 'Bí mật tạo nên từng thớ bánh dai mềm kéo sợi nằm ở bột mì số 11 giàu gluten kết hợp cùng bơ lạt Anchor nguyên chất 82.9% béo sữa.', '["Cân chuẩn 260g Bột mì Baker''s Choice số 11, trộn cùng men nở, đường tinh luyện và sữa ấm 38°C.","Nhồi bột đến khi kết khối dẻo mịn, sau đó cho từng lát bơ lạt Anchor ở nhiệt độ phòng vào nhồi tiếp đến khi kéo được màng mỏng không rách.","Ủ bột lần 1 trong 50 phút cho nở gấp đôi; chia bột làm 3 hoặc 6 phần bằng nhau, cán dài và thắt bím đặt vào khuôn.","Ủ lần 2 thêm 35 phút, phết lớp trứng đánh loãng lên mặt bánh rồi nướng ở 175°C khoảng 25–28 phút đến khi chín vàng ruộm."]', 1),
  (3, 'post-muffin-socola', 'recipe-muffin-socola', 'Muffin Chocolate Hạnh Nhân chỉ 40 phút cho buổi trà chiều', 'Công thức làm bánh', '40 phút thực hiện', 'Dễ', 'Bảo Ngọc · BakeMate Community', '05/11/2026', 'images/banner.jpg', 'muffin, socola, bột cacao, cup giấy', 'Không cần máy đánh trứng cầu kỳ — chỉ với phới lồng tay, bột cacao Hershey''s nguyên chất và cup giấy nướng bánh là bạn đã có ngay khay muffin thơm nồng.', '["Xếp 12 cup giấy nướng bánh vào khay muffin; làm nóng lò nướng ở 180°C trước 10 phút.","Đun chảy 80g bơ lạt Anchor cùng một chút dầu ăn, hòa tan đều với 35g bột cacao Hershey''s để khơi dậy mùi socola đậm đà.","Rây 150g bột mì đa dụng Meizan cùng bột nở vào âu hỗn hợp ướt, khuấy vừa quyện hết bột khô (tránh trộn quá tay gây chai bánh).","Chia đều bột đầy 2\\/3 cup giấy và nướng ở 180°C trong 22–25 phút cho đến khi tăm xiên vào rút ra sạch."]', 1),
  (4, 'post-phan-biet-bot-mi', 'recipe-matcha-cupcake', 'Phân biệt Bột Mì Số 8, Số 11 và Đa Dụng — Mua đúng khỏi tốn tiền oan', 'Nguyên liệu làm bánh', '5 phút đọc', 'Dễ', 'Như Hậu · BakeMate Content', '03/11/2026', 'images/about-ingredients.jpg', 'phân biệt bột mì, bột mì số 8, bột mì số 11, bông lan, cupcake', 'Tại sao làm bánh bông lan dùng bột mì số 11 lại bị cứng, còn làm bánh mì dùng bột số 8 lại dễ bở? Tìm hiểu ngay tỉ lệ protein và quy cách túi 100g–1kg tối ưu.', '["Bột mì số 8 (Cake Flour, 8–9% protein): Ít gluten giúp bánh bông lan, chiffon, cupcake matcha mềm xốp và giữ độ ẩm lâu.","Bột mì số 11 (Bread Flour, 11.5–13% protein): Gluten cao tạo mạng lưới giữ khí khỏe, bắt buộc phải có cho bánh mì hoa cúc, baguette và đế pizza.","Bột mì đa dụng (All-Purpose, 9.5–11.5% protein): Cân bằng linh hoạt giữa mềm và giòn, phù hợp cho muffin, bánh quy, pancake bữa sáng.","Mẹo tiết kiệm BakeMate: Nếu mới thử làm 1 mẻ bánh nhỏ, hãy chọn quy cách túi 100g hoặc 300g ngay tại trang chi tiết sản phẩm để tránh tồn bột quá hạn."]', 1),
  (5, 'post-brownie-giot-am', 'recipe-brownie', 'Kỹ thuật nướng Bánh Brownie Chocolate mặt bóng vỡ, ruột ẩm dẻo', 'Kiến thức làm bánh', '45 phút thực hiện', 'Dễ', 'Nguyễn Thương · BakeMate Baker', '01/11/2026', 'images/contact-baking.jpg', 'brownie, socola, giấy nến, nhiệt kế', 'Hai bí quyết vàng quyết định thành công của khay Brownie chuẩn Mỹ: nhiệt độ bơ-cacao cách thủy 50°C và lót giấy nến chống dính để nhấc nguyên khối.', '["Dùng nhiệt kế điện tử kiểm tra hỗn hợp 120g bơ lạt và 50g bột cacao Hershey''s khi đun cách thủy, giữ quanh 50–55°C.","Đánh trứng và đường đến khi đường tan hoàn toàn và bề mặt hơi sánh sáng — đây là bí quyết tạo lớp mặt bóng nứt đặc trưng.","Trộn nhẹ 85g bột mì đa dụng (túi nhỏ 100g vừa khít công thức) vào hỗn hợp cacao rồi đổ lên khay đã lót sẵn giấy nến nướng bánh.","Nướng ở 175°C khoảng 24–26 phút; để nguội hoàn toàn trước khi nhấc hai đầu giấy nến cắt thành 9 miếng vuông gọn sắc."]', 1),
  (6, 'post-banh-quy-bo', 'recipe-banh-quy-bo', 'Cẩm nang cân đo và bắt đui Bánh Quy Bơ Đan Mạch giòn tan sắc nét', 'Dụng cụ làm bánh', '40 phút thực hiện', 'Dễ', 'Đen Ny · BakeMate Craft', '29/10/2026', 'images/about-sharing-cakes.jpg', 'bánh quy bơ, cookies, đui bắt kem, cân điện tử', 'Chỉ cần cân điện tử chia chuẩn 1g, bơ lạt mềm đánh bông trắng ngà và bộ đui bắt kem Inox 304, bạn sẽ dễ dàng cho ra lò mẻ bánh quy hoa hồng giòn rụm.', '["Cân chính xác 150g bơ lạt Anchor để mềm ở nhiệt độ phòng (không chảy nước), đánh bông cùng đường bột đến khi chuyển màu kem nhạt.","Trộn 180g Bột mì số 8 đã rây mịn vào âu bơ theo kỹ thuật cắt bột để khối bột mềm dẻo nhưng không quá chảy.","Lắp đui sao mở trong bộ 12 đui Inox vào túi bắt kem vân nhám chống trượt, cho bột vào nửa túi và bắt thành từng bông hoa lên khay lót giấy nến.","Làm lạnh khay bánh 15 phút trước khi cho vào lò ở 170°C trong 15–18 phút giúp giữ vân bánh sắc nét không bị chảy dẹt."]', 1),
  (7, 'post-mousse-socola', 'recipe-mousse-socola', 'Bánh Mousse Socola Lạnh mịn mượt không cần lò nướng, tách khuôn sắc nét', 'Kiến thức làm bánh', '75 phút thực hiện', 'Vừa', 'Minh Thư · BakeMate Studio', '27/10/2026', 'images/about-ingredients.jpg', 'mousse, whipping cream, bông lan lạnh, khuôn đế rời', 'Chỉ cần Whipping Cream Anchor làm lạnh đúng 2–4°C, bột cacao Hershey''s đậm vị, phới lồng Inox và khuôn đế rời 20cm để tạo nên chiếc mousse tan chảy mát lạnh.', '["Hòa tan 35g bột cacao Hershey''s với 60ml nước ấm hoặc sữa ấm bằng phới lồng Inox sao cho hỗn hợp bóng mượt không vón cục, để nguội về khoảng 35°C.","Làm lạnh âu trộn và đánh 250ml Whipping Cream Anchor lạnh với phới lồng đến khi kem sánh đặc, tạo vân mềm nhưng vẫn chảy nhẹ.","Trộn nhẹ (fold) hỗn hợp cacao vào kem tươi đã đánh theo một chiều cho hòa quyện đều, đổ vào khuôn tròn đế rời 20cm đã lót sẵn đế bánh.","Giữ lạnh trong ngăn mát ít nhất 4 giờ cho bánh định hình hoàn toàn, dùng khăn ấm lau quanh thành khuôn rồi đẩy nhẹ phần đế rời để tách bánh nguyên vẹn."]', 1),
  (8, 'post-pancake-mat-ong', 'recipe-pancake', 'Bánh Pancake Mật Ong bữa sáng mềm xốp chỉ 25 phút với bột mì đa dụng', 'Mẹo & kinh nghiệm', '25 phút thực hiện', 'Dễ', 'Bảo Ngọc · BakeMate Kitchen', '25/10/2026', 'images/about-beginner.jpg', 'pancake, bữa sáng, bột mì đa dụng, ca đong', 'Công thức bữa sáng nhanh gọn tại nhà: định lượng sữa tươi bằng ca đong chia ml rõ nét, đánh tan trứng gà tươi cùng 150g bột mì đa dụng Meizan cho mẻ pancake vàng ươm.', '["Rây 150g bột mì đa dụng Meizan (chọn túi 300g tiết kiệm) cùng 40g đường tinh luyện và một chút muối vào âu trộn.","Dùng ca đong đo chuẩn 180ml sữa tươi, đập 2 quả trứng gà tươi vào khuấy nhẹ rồi rót từ từ vào âu bột khô.","Khuấy đều vừa quyện đến khi hỗn hợp hơi sánh mịn (không cần đánh quá kỹ để bánh giữ độ xốp), để bột nghỉ 10 phút.","Làm nóng chảo chống dính ở lửa vừa nhỏ, dùng ca đong rót từng muôi bột tròn đều; lật mặt khi bề mặt nổi bọt khí và nướng thêm 1 phút đến khi vàng đều hai mặt."]', 1);

DROP PROCEDURE IF EXISTS sp_adjust_variant_stock;
DROP PROCEDURE IF EXISTS sp_cancel_order_restore_stock;

DELIMITER //
CREATE PROCEDURE sp_adjust_variant_stock(IN p_product_id INT, IN p_option_index INT, IN p_qty_delta INT)
BEGIN
    DECLARE v_cur_stock INT DEFAULT 0;
    SELECT stock_qty INTO v_cur_stock
    FROM product_variants
    WHERE product_id = p_product_id AND option_index = p_option_index
    FOR UPDATE;

    IF (v_cur_stock + p_qty_delta) < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'So luong ton kho khong du de thuc hien giao dich.';
    END IF;

    UPDATE product_variants
    SET stock_qty = stock_qty + p_qty_delta
    WHERE product_id = p_product_id AND option_index = p_option_index;
END //

CREATE PROCEDURE sp_cancel_order_restore_stock(IN p_order_id INT)
BEGIN
    DECLARE v_status VARCHAR(30);
    SELECT status INTO v_status FROM orders WHERE id = p_order_id FOR UPDATE;

    IF v_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Khong tim thay don hang.';
    END IF;

    IF v_status = 'cancelled' OR v_status = 'completed' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Don hang khong con o trang thai cho phep huy.';
    END IF;

    UPDATE product_variants pv
    INNER JOIN order_items oi ON oi.product_id = pv.product_id AND oi.option_index = pv.option_index
    SET pv.stock_qty = pv.stock_qty + oi.quantity
    WHERE oi.order_id = p_order_id;

    UPDATE orders SET status = 'cancelled' WHERE id = p_order_id;
END //
DELIMITER ;
SET FOREIGN_KEY_CHECKS = 1;
