(function () {
  "use strict";

  const sliders = new Map();

  function initTestimonialsSlider(sectionId) {
    const section = document.querySelector(
      `.testimonials-slider[data-section-id="${sectionId}"]`,
    );
    if (!section) return;

    const wrapper = section.querySelector(".testimonials-slider__wrapper");
    const track = section.querySelector(".testimonials-slider__track");
    const prevBtn = section.querySelector(".testimonials-slider__button--prev");
    const nextBtn = section.querySelector(".testimonials-slider__button--next");
    const dotsContainer = section.querySelector(".testimonials-slider__dots");

    if (!track || !wrapper) return;

    const cards = track.querySelectorAll(".testimonial-card");
    if (cards.length === 0) return;

    // Only activate slider mode if there are 4+ testimonials
    const isSliderMode = track.dataset.slider === "true";
    if (!isSliderMode) {
      // Static grid mode (1-3 testimonials)
      return;
    }

    let currentPage = 0;
    let autoplayInterval = null;
    const autoplay = track.dataset.autoplay === "true";

    // Calculate items per page based on viewport width
    function getItemsPerPage() {
      const width = window.innerWidth;
      if (width < 768) return 1; // Mobile: 1 card
      if (width < 1024) return 2; // Tablet: 2 cards
      return 3; // Desktop: 3 cards
    }

    // Clean up existing instance
    if (sliders.has(sectionId)) {
      cleanupTestimonialsSlider(sectionId);
    }

    const slider = {
      currentPage,
      autoplayInterval,
      prevBtn,
      nextBtn,
      track,
      cards,
      dots: [],
    };

    sliders.set(sectionId, slider);

    // Calculate total number of pages (batches based on screen size)
    function getTotalPages() {
      const itemsPerPage = getItemsPerPage();
      return Math.ceil(cards.length / itemsPerPage);
    }

    // Create dots based on number of pages
    function createDots() {
      if (!dotsContainer) return;

      dotsContainer.innerHTML = "";
      slider.dots = [];

      const totalPages = getTotalPages();

      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement("button");
        dot.className = "testimonials-slider__dot";
        dot.setAttribute("aria-label", `Go to page ${i + 1}`);
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToPage(i));
        dotsContainer.appendChild(dot);
        slider.dots.push(dot);
      }
    }

    function updateSlider() {
      // Calculate offset based on current page and items per page
      const itemsPerPage = getItemsPerPage();
      const firstCardIndex = currentPage * itemsPerPage;

      if (cards[firstCardIndex]) {
        const offset = -cards[firstCardIndex].offsetLeft;
        track.style.transform = `translateX(${offset}px)`;
      }

      const totalPages = getTotalPages();

      if (prevBtn) {
        prevBtn.disabled = currentPage === 0;
      }
      if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages - 1;
      }

      // Update dots
      slider.dots.forEach((dot, index) => {
        if (index === currentPage) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });

      slider.currentPage = currentPage;
    }

    function goToPage(pageIndex) {
      const totalPages = getTotalPages();
      currentPage = Math.max(0, Math.min(pageIndex, totalPages - 1));
      updateSlider();
      stopAutoplay();
    }

    function goToNext() {
      const totalPages = getTotalPages();
      if (currentPage < totalPages - 1) {
        currentPage++;
      } else {
        currentPage = 0; // Loop back to start
      }
      updateSlider();
    }

    function goToPrev() {
      const totalPages = getTotalPages();
      if (currentPage > 0) {
        currentPage--;
      } else {
        currentPage = totalPages - 1; // Loop to end
      }
      updateSlider();
    }

    function startAutoplay() {
      if (!autoplay) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReducedMotion) return;

      stopAutoplay();
      autoplayInterval = setInterval(goToNext, 5000);
      slider.autoplayInterval = autoplayInterval;
    }

    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
        slider.autoplayInterval = null;
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        goToNext();
        stopAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        goToPrev();
        stopAutoplay();
      });
    }

    // Handle window resize
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Recalculate current page on resize to prevent going out of bounds
        const totalPages = getTotalPages();
        currentPage = Math.min(currentPage, totalPages - 1);

        // Recreate dots if number of pages changed
        const currentDotsCount = slider.dots.length;
        if (currentDotsCount !== totalPages) {
          createDots();
        }

        updateSlider();
      }, 150);
    };
    window.addEventListener("resize", handleResize);

    // Initialize
    createDots();
    updateSlider();
    startAutoplay();

    // Pause autoplay on hover
    section.addEventListener("mouseenter", stopAutoplay);
    section.addEventListener("mouseleave", startAutoplay);

    // Store handlers for cleanup
    slider.resizeHandler = handleResize;
  }

  function cleanupTestimonialsSlider(sectionId) {
    const slider = sliders.get(sectionId);
    if (!slider) return;

    if (slider.autoplayInterval) {
      clearInterval(slider.autoplayInterval);
    }

    if (slider.resizeHandler) {
      window.removeEventListener("resize", slider.resizeHandler);
    }

    const section = document.querySelector(
      `.testimonials-slider[data-section-id="${sectionId}"]`,
    );
    if (section) {
      const newSection = section.cloneNode(true);
      section.parentNode.replaceChild(newSection, section);
    }

    sliders.delete(sectionId);
  }

  // Initialize on load
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".testimonials-slider").forEach((section) => {
      const sectionId = section.dataset.sectionId;
      if (sectionId) {
        initTestimonialsSlider(sectionId);
      }
    });
  });

  // Theme Editor events
  document.addEventListener("shopify:section:load", function (e) {
    initTestimonialsSlider(e.detail.sectionId);
  });

  document.addEventListener("shopify:section:unload", function (e) {
    cleanupTestimonialsSlider(e.detail.sectionId);
  });
})();
