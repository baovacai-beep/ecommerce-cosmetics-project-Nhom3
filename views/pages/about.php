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

  <section class="about-section about-story" aria-labelledby="about-story-title">
    <div class="about-story__heading">
      <span class="about-eyebrow">Câu chuyện thương hiệu</span>
      <h2 id="about-story-title" class="about-story__title">BakeMate – Làm bánh dễ dàng, niềm vui trọn vẹn</h2>
    </div>
    <div class="about-story__body">
      <p>
        BakeMate ra đời từ mong muốn giúp hành trình làm bánh trở nên đơn giản và thuận tiện hơn cho tất cả mọi người. Chúng tôi nhận thấy rằng việc tìm kiếm công thức, lựa chọn nguyên liệu và chuẩn bị dụng cụ đôi khi khiến người yêu làm bánh mất nhiều thời gian, đặc biệt là những người mới bắt đầu.
      </p>
      <p>
        Vì vậy, BakeMate được xây dựng như một người bạn đồng hành, kết nối công thức làm bánh với nguyên liệu và dụng cụ cần thiết trên cùng một nền tảng. Với tính năng tự động quy đổi định lượng theo khẩu phần và thêm nguyên liệu vào giỏ hàng nhanh chóng, BakeMate giúp bạn tiết kiệm thời gian chuẩn bị để tập trung vào niềm vui sáng tạo trong căn bếp.
      </p>
    </div>
  </section>

  <section class="about-section about-story" aria-labelledby="about-vision-title">
    <div class="about-story__heading">
      <span class="about-eyebrow">Tầm nhìn</span>
      <h2 id="about-vision-title" class="about-story__title">Trở thành người bạn đồng hành đáng tin cậy của cộng đồng yêu làm bánh.</h2>
    </div>
    <div class="about-story__body">
      <p>
        BakeMate hướng đến việc xây dựng một nền tảng mua sắm và khám phá công thức làm bánh tiện lợi, thân thiện và dễ sử dụng. Chúng tôi mong muốn mọi người, dù mới bắt đầu hay đã có kinh nghiệm, đều có thể tự tin làm ra những chiếc bánh yêu thích, biến mỗi trải nghiệm trong căn bếp thành một hành trình sáng tạo đầy cảm hứng.
      </p>
    </div>
  </section>

  <section class="contact-section" id="contact">
    <div class="contact-container">
      <div class="contact-content">
        <h2 class="contact-title">Liên hệ với BakeMate</h2>
        <p class="contact-description">Cần tư vấn nguyên liệu, quy cách gói nhỏ hoặc dụng cụ cho món bánh của bạn? Đội ngũ BakeMate luôn sẵn sàng đồng hành cùng bạn.</p>
        <div class="contact-info">
          <div class="contact-row">
            <span class="contact-label">Địa chỉ</span>
            <span class="contact-value">59C Nguyễn Đình Chiểu, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh</span>
          </div>
          <div class="contact-row">
            <span class="contact-label">Điện thoại</span>
            <a class="contact-value" href="tel:19008888">1900 8888</a>
          </div>
          <div class="contact-row">
            <span class="contact-label">Email</span>
            <a class="contact-value" href="mailto:support@bakemate.vn">support@bakemate.vn</a>
          </div>
          <div class="contact-row">
            <span class="contact-label">Giờ làm việc</span>
            <span class="contact-value">Thứ Hai - Chủ Nhật: 08:30 – 21:00</span>
          </div>
        </div>
        <div style="margin-top:20px;">
          <a href="<?= App::e(App::url('?c=home&a=contact')) ?>" class="btn btn--outline-dark">Gửi lời nhắn hỗ trợ &rarr;</a>
        </div>
      </div>
      <div class="contact-map-frame">
        <iframe
          title="Bản đồ BakeMate - 59C Nguyễn Đình Chiểu, Quận 3, TP.HCM"
          src="https://www.google.com/maps?q=59C%20Nguy%E1%BB%85n%20%C4%90%C3%ACnh%20Chi%E1%BB%83u%2C%20Qu%E1%BA%ADn%203%2C%20TP.HCM&output=embed"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </section>
</main>
