<?php
declare(strict_types=1);
?>
<main class="about-page">
  <section id="about-difference" class="about-section about-difference" aria-labelledby="about-difference-title">
    <div class="about-difference__visual">
      <img src="<?= App::e(App::asset('images/banner-about.png')) ?>" alt="BakeMate – Người bạn đồng hành cùng đam mê làm bánh" loading="lazy">
    </div>
    <div class="about-difference__content">
      <span class="about-eyebrow">Về chúng tôi · Thương hiệu BakeMate</span>
      <h1 id="about-difference-title" class="about-story__title">BakeMate – Người bạn đồng hành làm bánh tại nhà</h1>
      <p style="font-size:15.5px;line-height:1.75;color:#4a2d1b;margin-top:12px;">
        Thương hiệu BakeMate là người bạn đồng hành cùng những ai yêu thích làm bánh, mang đến giải pháp tiện lợi từ khám phá công thức, lựa chọn nguyên liệu và dụng cụ đến tự động quy đổi định lượng theo khẩu phần, giúp hành trình làm bánh trở nên đơn giản, tiết kiệm thời gian và trọn vẹn niềm vui sáng tạo.
      </p>
    </div>
  </section>

  <div class="about-story-vision-band">
    <section class="about-section about-feature-row about-feature-row--story" aria-labelledby="about-story-title">
      <figure class="about-feature-row__visual about-feature-row__visual--story">
        <img
          src="<?= App::e(App::asset('images/about-story.jpg')) ?>"
          alt="Đôi tay nhào bột bánh trên bàn bếp phủ bột mì"
          loading="lazy"
        >
      </figure>

      <div class="about-feature-row__content">
        <span class="about-eyebrow">Câu chuyện thương hiệu</span>
        <h2 id="about-story-title" class="about-feature-row__title">BakeMate – Làm bánh dễ dàng, niềm vui trọn vẹn</h2>
        <p>
          BakeMate ra đời từ mong muốn giúp hành trình làm bánh trở nên đơn giản và thuận tiện hơn cho tất cả mọi người. Chúng tôi nhận thấy rằng việc tìm kiếm công thức, lựa chọn nguyên liệu và chuẩn bị dụng cụ đôi khi khiến người yêu làm bánh mất nhiều thời gian, đặc biệt là những người mới bắt đầu.
        </p>
        <p>
          Vì vậy, BakeMate được xây dựng như một người bạn đồng hành, kết nối công thức làm bánh với nguyên liệu và dụng cụ cần thiết trên cùng một nền tảng. Với tính năng tự động quy đổi định lượng theo khẩu phần và thêm nguyên liệu vào giỏ hàng nhanh chóng, BakeMate giúp bạn tiết kiệm thời gian chuẩn bị để tập trung vào niềm vui sáng tạo trong căn bếp.
        </p>
      </div>
    </section>

    <section class="about-section about-feature-row about-feature-row--vision" aria-labelledby="about-vision-title">
      <div class="about-feature-row__content">
        <span class="about-eyebrow">Tầm nhìn</span>
        <h2 id="about-vision-title" class="about-feature-row__title">Trở thành người bạn đồng hành đáng tin cậy của cộng đồng yêu làm bánh.</h2>
        <p>
          BakeMate hướng đến việc xây dựng một nền tảng mua sắm và khám phá công thức làm bánh tiện lợi, thân thiện và dễ sử dụng. Chúng tôi mong muốn mọi người, dù mới bắt đầu hay đã có kinh nghiệm, đều có thể tự tin làm ra những chiếc bánh yêu thích, biến mỗi trải nghiệm trong căn bếp thành một hành trình sáng tạo đầy cảm hứng.
        </p>
      </div>

      <figure class="about-feature-row__visual about-feature-row__visual--vision">
        <img
          src="<?= App::e(App::asset('images/about-vision.jpg')) ?>"
          alt="Người làm bánh đang đổ bột vào tô trộn bên cạnh cân bếp"
          loading="lazy"
        >
      </figure>
    </section>
  </div>

  <section class="about-cta" aria-labelledby="about-cta-title">
    <div class="about-cta__inner">
      <span class="about-eyebrow">Bắt đầu hành trình làm bánh</span>
      <h2 id="about-cta-title">Bạn muốn làm món bánh nào tiếp theo?</h2>
      <p>Khám phá bộ công thức chuẩn vị hoặc lựa chọn ngay nguyên liệu vừa đủ cho mẻ bánh hôm nay.</p>
      <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:12px;">
        <a href="<?= App::e(App::url('?c=recipe&a=index')) ?>" class="btn btn--primary">Khám phá công thức</a>
        <a href="<?= App::e(App::url('?c=product&a=catalog')) ?>" class="btn btn--outline">Xem tất cả sản phẩm</a>
      </div>
    </div>
  </section>
</main>
