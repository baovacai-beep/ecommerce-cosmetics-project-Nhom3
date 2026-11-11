/*
 * =====================================================
 * BAKEMATE - BĂNG CHUYỀN BANNER & KHÁM PHÁ DANH MỤC (TRANG CHỦ)
 * Tệp: js/home.js
 * Chức năng:
 *  - Hero Banner tự động lướt & chuyển đổi mượt mà giữa 3 banner nổi bật
 *  - Carousel Editorial Image Card "Khám phá thế giới làm bánh" tự động lướt & xoay vòng
 * =====================================================
 */

(function () {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /**
   * Khởi tạo Hero Banner Carousel ở đầu trang chủ.
   */
  function initHeroCarousel() {
    const root = document.getElementById("hero-carousel");
    if (!root) {
      return;
    }

    const slides = Array.from(root.querySelectorAll(".hero-slide"));
    const dots = Array.from(root.querySelectorAll(".hero-carousel__dot"));
    const prevBtn = root.querySelector(".hero-carousel__prev");
    const nextBtn = root.querySelector(".hero-carousel__next");
    const progressBar = root.querySelector(".hero-carousel__progress-fill");

    if (slides.length <= 1) {
      return;
    }

    const AUTOPLAY_DELAY = 5500;
    let activeIndex = 0;
    let autoplayTimer = null;
    let isPaused = false;
    let touchStartX = 0;

    function restartProgressBar() {
      if (!progressBar || prefersReducedMotion) {
        return;
      }
      progressBar.style.transition = "none";
      progressBar.style.width = "0%";
      void progressBar.offsetWidth;
      progressBar.style.transition = `width ${AUTOPLAY_DELAY}ms linear`;
      progressBar.style.width = isPaused ? "0%" : "100%";
    }

    function goToSlide(nextIndex) {
      const total = slides.length;
      const targetIndex = ((nextIndex % total) + total) % total;
      if (targetIndex === activeIndex && slides[activeIndex].classList.contains("is-active")) {
        return;
      }

      slides.forEach((slide, idx) => {
        const isTarget = idx === targetIndex;
        slide.classList.toggle("is-active", isTarget);
        slide.setAttribute("aria-hidden", isTarget ? "false" : "true");
      });

      dots.forEach((dot, idx) => {
        const isTarget = idx === targetIndex;
        dot.classList.toggle("is-active", isTarget);
        dot.setAttribute("aria-selected", isTarget ? "true" : "false");
      });

      activeIndex = targetIndex;
      restartProgressBar();
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
      if (progressBar) {
        progressBar.style.transition = "none";
        progressBar.style.width = "0%";
      }
    }

    function startAutoplay() {
      stopAutoplay();
      if (prefersReducedMotion || isPaused) {
        return;
      }
      restartProgressBar();
      autoplayTimer = window.setInterval(() => {
        goToSlide(activeIndex + 1);
      }, AUTOPLAY_DELAY);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goToSlide(activeIndex - 1);
        startAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goToSlide(activeIndex + 1);
        startAutoplay();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", function () {
        goToSlide(idx);
        startAutoplay();
      });
    });

    root.addEventListener("mouseenter", function () {
      isPaused = true;
      stopAutoplay();
    });

    root.addEventListener("mouseleave", function () {
      isPaused = false;
      startAutoplay();
    });

    root.addEventListener("focusin", function () {
      isPaused = true;
      stopAutoplay();
    });

    root.addEventListener("focusout", function (event) {
      if (!root.contains(event.relatedTarget)) {
        isPaused = false;
        startAutoplay();
      }
    });

    root.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        goToSlide(activeIndex - 1);
        startAutoplay();
      } else if (event.key === "ArrowRight") {
        goToSlide(activeIndex + 1);
        startAutoplay();
      }
    });

    root.addEventListener(
      "touchstart",
      function (event) {
        if (event.touches && event.touches[0]) {
          touchStartX = event.touches[0].clientX;
        }
      },
      { passive: true }
    );

    root.addEventListener(
      "touchend",
      function (event) {
        if (!event.changedTouches || !event.changedTouches[0]) {
          return;
        }
        const deltaX = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(deltaX) > 45) {
          goToSlide(deltaX < 0 ? activeIndex + 1 : activeIndex - 1);
          startAutoplay();
        }
      },
      { passive: true }
    );

    goToSlide(0);
    startAutoplay();
  }

  /**
   * Khởi tạo Editorial Category Carousel ("Khám phá thế giới làm bánh").
   */
  function initCategoryCarousel() {
    const root = document.getElementById("category-carousel");
    const viewport = document.getElementById("category-carousel-viewport");
    const track = document.getElementById("home-category-track");
    const dotsContainer = document.getElementById("category-carousel-dots");
    const prevBtn = document.getElementById("category-prev-btn");
    const nextBtn = document.getElementById("category-next-btn");
    const toggleBtn = document.getElementById("category-autoplay-btn");

    if (!root || !viewport || !track) {
      return;
    }

    const cards = Array.from(track.querySelectorAll(".category-card"));
    if (cards.length === 0) {
      return;
    }

    const AUTOPLAY_DELAY = 3800;
    let activeIndex = 0;
    let visibleCount = 3;
    let maxIndex = 0;
    let userPaused = false;
    let hoverPaused = false;
    let autoplayTimer = null;
    let touchStartX = 0;

    function computeVisibleCount() {
      const width = window.innerWidth;
      if (width <= 640) {
        return 1;
      }
      if (width <= 1024) {
        return 2;
      }
      return 3;
    }

    function buildDots() {
      if (!dotsContainer) {
        return;
      }
      dotsContainer.innerHTML = "";
      const pageCount = maxIndex + 1;
      for (let i = 0; i < pageCount; i += 1) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = `category-carousel__dot${i === activeIndex ? " is-active" : ""}`;
        dot.setAttribute("aria-label", `Xem nhóm danh mục ${i + 1}`);
        dot.setAttribute("aria-pressed", i === activeIndex ? "true" : "false");
        dot.addEventListener("click", function () {
          setIndex(i);
          syncAutoplay();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateCardsState() {
      const spotlightIndex =
        visibleCount === 3
          ? Math.min(cards.length - 1, activeIndex + 1)
          : activeIndex;

      cards.forEach((card, idx) => {
        const isVisible = idx >= activeIndex && idx < activeIndex + visibleCount;
        card.classList.toggle("is-in-view", isVisible);
        card.classList.toggle("is-spotlight", idx === spotlightIndex);
      });

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll(".category-carousel__dot");
        dots.forEach((dot, idx) => {
          const isActive = idx === activeIndex;
          dot.classList.toggle("is-active", isActive);
          dot.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
      }
    }

    function applyTransform() {
      const firstCard = cards[0];
      if (!firstCard) {
        return;
      }
      const computedTrack = window.getComputedStyle(track);
      const gapPx = parseFloat(computedTrack.columnGap || computedTrack.gap || "0") || 0;
      const cardWidth = firstCard.getBoundingClientRect().width;
      const offsetPx = activeIndex * (cardWidth + gapPx);
      track.style.transform = `translate3d(-${offsetPx}px, 0, 0)`;
    }

    function setIndex(nextIndex) {
      const totalPositions = maxIndex + 1;
      if (totalPositions <= 1) {
        activeIndex = 0;
      } else {
        activeIndex = ((nextIndex % totalPositions) + totalPositions) % totalPositions;
      }
      applyTransform();
      updateCardsState();
    }

    function refreshLayout() {
      const nextVisible = computeVisibleCount();
      const nextMax = Math.max(0, cards.length - nextVisible);
      const changed = nextVisible !== visibleCount || nextMax !== maxIndex;
      visibleCount = nextVisible;
      maxIndex = nextMax;
      if (activeIndex > maxIndex) {
        activeIndex = maxIndex;
      }
      if (changed || (dotsContainer && dotsContainer.children.length !== maxIndex + 1)) {
        buildDots();
      }
      applyTransform();
      updateCardsState();
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function syncAutoplay() {
      stopAutoplay();
      if (prefersReducedMotion || userPaused || hoverPaused || maxIndex <= 0) {
        return;
      }
      autoplayTimer = window.setInterval(() => {
        setIndex(activeIndex + 1);
      }, AUTOPLAY_DELAY);
    }

    function updateToggleLabel() {
      if (!toggleBtn) {
        return;
      }
      toggleBtn.classList.toggle("is-paused", userPaused);
      toggleBtn.setAttribute("aria-pressed", userPaused ? "true" : "false");
      toggleBtn.setAttribute(
        "aria-label",
        userPaused ? "Tiếp tục tự động lướt danh mục" : "Tạm dừng tự động lướt danh mục"
      );
      const labelEl = toggleBtn.querySelector(".js-carousel-toggle-label");
      if (labelEl) {
        labelEl.textContent = userPaused ? "Tự động lướt" : "Đang lướt";
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        setIndex(activeIndex - 1);
        syncAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        setIndex(activeIndex + 1);
        syncAutoplay();
      });
    }

    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        userPaused = !userPaused;
        updateToggleLabel();
        syncAutoplay();
      });
    }

    root.addEventListener("mouseenter", function () {
      hoverPaused = true;
      stopAutoplay();
    });

    root.addEventListener("mouseleave", function () {
      hoverPaused = false;
      syncAutoplay();
    });

    root.addEventListener("focusin", function () {
      hoverPaused = true;
      stopAutoplay();
    });

    root.addEventListener("focusout", function (event) {
      if (!root.contains(event.relatedTarget)) {
        hoverPaused = false;
        syncAutoplay();
      }
    });

    viewport.addEventListener(
      "touchstart",
      function (event) {
        if (event.touches && event.touches[0]) {
          touchStartX = event.touches[0].clientX;
        }
      },
      { passive: true }
    );

    viewport.addEventListener(
      "touchend",
      function (event) {
        if (!event.changedTouches || !event.changedTouches[0]) {
          return;
        }
        const deltaX = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(deltaX) > 40) {
          setIndex(deltaX < 0 ? activeIndex + 1 : activeIndex - 1);
          syncAutoplay();
        }
      },
      { passive: true }
    );

    let resizeTimer = null;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(refreshLayout, 80);
    });

    refreshLayout();
    updateToggleLabel();
    syncAutoplay();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeroCarousel();
    initCategoryCarousel();
  });
})();
