// motion.js — scroll-linked hero response + sticky-nav hairline border.
// No dependencies. rAF-throttled. Respects prefers-reduced-motion.
// No browser-storage APIs anywhere.

(function () {
  "use strict";

  const HERO_SCROLL_RANGE = 200;        // 0→200px scroll maps the full hero transform
  const HERO_SCALE_MIN = 0.95;          // 100% → 95% at max scroll
  const HERO_OPACITY_MIN = 0.3;         // 100% → 30%  at max scroll
  const OTHER_PAGE_THRESHOLD = 64;      // non-Home pages trigger sticky border past this

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hero = document.querySelector(".hero__headline");
  const heroSection = document.querySelector(".hero");
  const header = document.querySelector(".site-header");

  let navThreshold = OTHER_PAGE_THRESHOLD;
  let ticking = false;

  function measureThreshold() {
    // Nav sticky-border triggers once the user has scrolled past the hero section
    // (headline + supporting line) on Home, or past 64px on other pages.
    if (heroSection) {
      const rect = heroSection.getBoundingClientRect();
      navThreshold = Math.max(64, window.scrollY + rect.bottom);
    } else {
      navThreshold = OTHER_PAGE_THRESHOLD;
    }
  }

  function clearHeroTransform() {
    if (!hero) return;
    hero.style.transform = "";
    hero.style.opacity = "";
  }

  function update() {
    const y = Math.max(window.scrollY, 0);

    if (hero) {
      if (reducedMotion.matches) {
        clearHeroTransform();
      } else {
        const t = Math.min(y / HERO_SCROLL_RANGE, 1);
        const scale = 1 - (1 - HERO_SCALE_MIN) * t;
        const opacity = 1 - (1 - HERO_OPACITY_MIN) * t;
        hero.style.transform = "scale(" + scale.toFixed(4) + ")";
        hero.style.opacity = opacity.toFixed(4);
      }
    }

    if (header) {
      if (y > navThreshold) {
        header.setAttribute("data-scrolled", "true");
      } else {
        header.removeAttribute("data-scrolled");
      }
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  function onResize() {
    measureThreshold();
    onScroll();
  }

  function handleReducedChange() {
    clearHeroTransform();
    onScroll();
  }

  measureThreshold();
  update();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });

  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener("change", handleReducedChange);
  } else if (reducedMotion.addListener) {
    reducedMotion.addListener(handleReducedChange);
  }
})();
