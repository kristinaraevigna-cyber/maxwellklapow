// main.js — shared behaviours: mobile nav toggle.
// Deferred; no dependencies; no browser-storage APIs anywhere.

(function () {
  "use strict";

  function initNavToggle() {
    const nav = document.querySelector(".site-nav");
    const toggle = nav && nav.querySelector(".nav-toggle");
    const list = nav && nav.querySelector(".nav-list");
    if (!nav || !toggle || !list) return;

    toggle.addEventListener("click", function () {
      const open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", open ? "false" : "true");
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
    });

    // Close on viewport resize above mobile breakpoint.
    const mql = window.matchMedia("(min-width: 768px)");
    const reset = function (e) {
      if (e.matches) {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      }
    };
    if (mql.addEventListener) mql.addEventListener("change", reset);
    else if (mql.addListener) mql.addListener(reset);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavToggle);
  } else {
    initNavToggle();
  }
})();
