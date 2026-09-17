/* Portfolio micro-interactions */
(function () {
  "use strict";

  /* Reveal on scroll */
  function initReveal() {
    var targets = document.querySelectorAll(
      ".section, .hero, .card, .proof-card, .feature, .skill-box, .stat, .contact-panel, .timeline-item"
    );
    if (!targets.length) return;

    targets.forEach(function (el) {
      el.classList.add("reveal");
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* Terminal typing effect */
  function initTyping() {
    var terminalLines = document.querySelector(".terminal-lines");
    if (!terminalLines) return;

    var strongEl = terminalLines.querySelector("strong");
    if (!strongEl) return;

    var cursor = document.createElement("span");
    cursor.className = "terminal-cursor";
    strongEl.appendChild(cursor);

    var lines = terminalLines.querySelectorAll("span:not(.cmd):not(.ok)");
    var textSpans = [];
    lines.forEach(function (span) {
      if (span.textContent.trim() && !span.querySelector(".cmd")) {
        textSpans.push(span);
      }
    });

    var delay = 600;
    textSpans.forEach(function (span, i) {
      span.style.opacity = "0";
      setTimeout(function () {
        span.style.opacity = "1";
        span.style.transition = "opacity 0.3s ease";
      }, delay + i * 400);
    });

    setTimeout(function () {
      if (cursor.parentNode) cursor.remove();
    }, delay + textSpans.length * 400 + 800);
  }

  /* Stagger reveal for grid items */
  function initStaggerReveal() {
    var grids = document.querySelectorAll(".grid, .stats, .skills-grid");
    grids.forEach(function (grid) {
      var children = grid.children;
      Array.prototype.forEach.call(children, function (child, i) {
        child.style.transitionDelay = i * 80 + "ms";
      });
    });
  }

  /* Init */
  document.addEventListener("DOMContentLoaded", function () {
    initReveal();
    initTyping();
    initStaggerReveal();
  });
})();
