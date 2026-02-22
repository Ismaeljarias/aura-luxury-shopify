(function () {
  "use strict";

  const sliders = new Map();

  function initTestimonialsSlider(sectionId) {
    const section = document.querySelector(
      `.testimonials-slider[data-section-id="${sectionId}"]`,
    );
    if (!section) return;

    const track = section.querySelector(".testimonials-slider__track");
    const prevBtn = section.querySelector(".testimonials-slider__button--prev");
    const nextBtn = section.querySelector(".testimonials-slider__button--next");

    if (!track) return;

    const cards = track.querySelectorAll(".testimonial-card");
    if (cards.length === 0) return;

    let currentIndex = 0;
    let autoplayInterval = null;
    const autoplay = track.dataset.autoplay === "true";

    // Clean up existing instance
    if (sliders.has(sectionId)) {
      cleanupTestimonialsSlider(sectionId);
    }

    const slider = {
      currentIndex,
      autoplayInterval,
      prevBtn,
      nextBtn,
      track,
      cards,
    };

    sliders.set(sectionId, slider);

    function updateSlider() {
      const offset = -currentIndex * 100;
      track.style.transform = `translateX(${offset}%)`;

      if (prevBtn) {
        prevBtn.disabled = currentIndex === 0;
      }
      if (nextBtn) {
        nextBtn.disabled = currentIndex === cards.length - 1;
      }

      slider.currentIndex = currentIndex;
    }

    function goToNext() {
      if (currentIndex < cards.length - 1) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateSlider();
    }

    function goToPrev() {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = cards.length - 1;
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

    updateSlider();
    startAutoplay();

    // Pause autoplay on hover
    section.addEventListener("mouseenter", stopAutoplay);
    section.addEventListener("mouseleave", startAutoplay);
  }

  function cleanupTestimonialsSlider(sectionId) {
    const slider = sliders.get(sectionId);
    if (!slider) return;

    if (slider.autoplayInterval) {
      clearInterval(slider.autoplayInterval);
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
