<?php
declare(strict_types=1);
?>
<main class="about-page">
  <section class="about-section about-story" aria-labelledby="about-story-title">
    <div class="about-story__heading">
      <span class="about-eyebrow">Về chúng tôi · Câu chuyện BakeMate</span>
      <h1 id="about-story-title" class="about-story__title">Làm bánh không chỉ bắt đầu từ căn bếp</h1>
    </div>
    <div class="about-story__body">
      <p>
        Trước khi bắt tay làm một chiếc bánh, người làm bánh cần tìm công thức, xác định nguyên liệu, chọn quy cách đóng gói và chuẩn bị dụng cụ phù hợp. Nếu phải tìm kiếm từng sản phẩm riêng lẻ, quá trình này có thể mất nhiều thời gian và dễ bỏ sót những thứ cần thiết.
      </p>
      <p>
        BakeMate được xây dựng theo hướng bắt đầu từ món bánh khách hàng muốn làm. Thay vì chỉ tìm và mua từng sản phẩm độc lập, bạn có thể tiếp cận trực tiếp công thức chuẩn vị, tự quy đổi định lượng theo số khẩu phần và thêm gọn vào giỏ hàng chỉ trong vài thao tác.
      </p>
    </div>
  </section>

  <section id="about-difference" class="about-section about-difference" aria-labelledby="about-difference-title">
    <div class="about-difference__visual">
      <img src="<?= App::e(App::asset('images/about-ingredients.jpg')) ?>" alt="Các nguyên liệu làm bánh được sắp xếp để chuẩn bị theo công thức" loading="lazy">
    </div>
    <div class="about-difference__content">
      <span class="about-eyebrow">Điểm khác biệt</span>
      <h2 id="about-difference-title">Không chỉ mua nguyên liệu, mà còn chuẩn bị theo công thức</h2>
      <p>Điểm nổi bật của BakeMate là kết nối nhu cầu làm một món bánh với quá trình lựa chọn sản phẩm. Công thức đóng vai trò trung tâm để khách hàng xác định những gì cần chuẩn bị.</p>
      <div class="about-benefits">
        <article class="about-benefit">
          <span class="about-benefit__number" aria-hidden="true">01</span>
          <div>
            <h3>Bắt đầu từ món bánh</h3>
            <p>Lấy công thức làm điểm xuất phát thay vì phải tìm từng nguyên liệu một cách rời rạc.</p>
          </div>
        </article>
        <article class="about-benefit">
          <span class="about-benefit__number" aria-hidden="true">02</span>
          <div>
            <h3>Gắn kết định lượng và quy cách</h3>
            <p>Đối chiếu lượng nguyên liệu trong công thức với quy cách đóng gói 100g–1kg để lựa chọn vừa đủ, không dư thừa.</p>
          </div>
        </article>
        <article class="about-benefit">
          <span class="about-benefit__number" aria-hidden="true">03</span>
          <div>
            <h3>Kết nối nguyên liệu và dụng cụ</h3>
            <p>Hỗ trợ rà soát các thành phần và dụng cụ cần thiết cho quá trình thực hiện món bánh.</p>
          </div>
        </article>
        <article class="about-benefit">
          <span class="about-benefit__number" aria-hidden="true">04</span>
          <div>
            <h3>Hình dung giỏ hàng và chi phí</h3>
            <p>Tổng hợp sản phẩm và chi phí dự kiến theo từng combo để khách hàng cân nhắc dễ dàng.</p>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="about-section about-audience" aria-labelledby="about-audience-title">
    <div class="about-section__heading">
      <span class="about-eyebrow">Dành cho người yêu làm bánh</span>
      <h2 id="about-audience-title">Mỗi người một hành trình, chung niềm vui làm bánh</h2>
      <p>BakeMate hướng đến những người muốn chuẩn bị nguyên liệu và dụng cụ làm bánh thuận tiện hơn, từ lần đầu trải nghiệm đến những dịp tự tay làm bánh quen thuộc.</p>
    </div>

    <div class="about-audience__grid">
      <article class="about-audience-card">
        <img src="<?= App::e(App::asset('images/about-beginner.jpg')) ?>" alt="Người mới học làm bánh" loading="lazy">
        <div class="about-audience-card__body">
          <span class="about-audience-card__label">Bắt đầu</span>
          <h3>Người mới học làm bánh</h3>
          <p>Có thêm cơ sở để xác định nguyên liệu, dụng cụ và các bước chuẩn bị rõ ràng trước khi thực hiện công thức.</p>
        </div>
      </article>
      <article class="about-audience-card">
        <img src="<?= App::e(App::asset('images/about-sharing-cakes.jpg')) ?>" alt="Làm bánh tặng người thân" loading="lazy">
        <div class="about-audience-card__body">
          <span class="about-audience-card__label">Chia sẻ</span>
          <h3>Người thường xuyên làm bánh tại nhà</h3>
          <p>Hỗ trợ chuẩn bị nhanh chóng cho những chiếc bánh dành tặng gia đình, bạn bè hoặc các dịp đặc biệt.</p>
        </div>
      </article>
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
      </div>
    </div>
  </section>
</main>
