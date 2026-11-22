<?php
declare(strict_types=1);
$title = isset($pageTitle) ? (string) $pageTitle : 'BakeMate - Làm bánh chuẩn vị, nguyên liệu chuẩn tay';
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="BakeMate - Nền tảng thương mại điện tử cung cấp nguyên liệu, dụng cụ và phụ kiện làm bánh chuẩn công thức.">
  <meta name="theme-color" content="#70452b">
  <title><?= App::e($title) ?></title>
  <?= Csrf::metaTag() ?>

  <link rel="icon" type="image/x-icon" href="<?= App::e(App::asset('images/favicon.ico')) ?>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= App::e(App::asset('css/style.css')) ?>">
  <script>
    window.BAKEMATE_PHP = {
      baseUrl: <?= json_encode(App::url(''), JSON_UNESCAPED_SLASHES) ?>,
      indexUrl: <?= json_encode(App::url('index.php'), JSON_UNESCAPED_SLASHES) ?>,
      csrfToken: <?= json_encode(Csrf::token(), JSON_UNESCAPED_SLASHES) ?>,
      user: <?= json_encode(Rbac::currentUser() ? [
          'id' => (int) Rbac::currentUser()['id'],
          'full_name' => (string) Rbac::currentUser()['full_name'],
          'role' => (string) Rbac::currentUser()['role'],
          'is_super_admin' => !empty(Rbac::currentUser()['is_super_admin']),
      ] : null, JSON_UNESCAPED_UNICODE) ?>
    };
  </script>
</head>
<body>
