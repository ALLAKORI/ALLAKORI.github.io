/* Portfolio UI controls — no changes to destinations or route handling. */
(function () {
  "use strict";
  function init() {
    var sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;
    var profile = sidebar.querySelector(".profile");
    if (!profile) return;
    var controls = document.createElement("div");
    controls.className = "site-controls";
    var theme = document.createElement("button");
    theme.type = "button";
    theme.className = "theme-toggle";
    theme.setAttribute("aria-label", "Toggle light and dark appearance");
    var menu = document.createElement("button");
    menu.type = "button";
    menu.className = "mobile-menu-toggle";
    menu.setAttribute("aria-label", "Open navigation menu");
    menu.setAttribute("aria-expanded", "false");
    menu.innerHTML = '<span class="control-icon" aria-hidden="true">☰</span><span class="control-label">Menu</span>';
    controls.appendChild(theme);
    controls.appendChild(menu);
    profile.insertAdjacentElement("afterend", controls);
    function setTheme(mode) {
      var light = mode === "light";
      document.documentElement.setAttribute("data-theme", light ? "light" : "dark");
      theme.innerHTML = light
        ? '<span class="control-icon" aria-hidden="true">☾</span><span class="control-label">Dark mode</span>'
        : '<span class="control-icon" aria-hidden="true">☼</span><span class="control-label">Light mode</span>';
      theme.setAttribute("aria-pressed", light ? "true" : "false");
      try { localStorage.setItem("portfolio-theme-v2", mode); } catch (e) {}
    }
    var savedTheme = "light";
    try { savedTheme = localStorage.getItem("portfolio-theme-v2") || "light"; } catch (e) {}
    setTheme(savedTheme);
    theme.addEventListener("click", function () {
      setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light");
    });
    menu.addEventListener("click", function () {
      var open = sidebar.classList.toggle("is-open");
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      menu.querySelector(".control-icon").textContent = open ? "×" : "☰";
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
        sidebar.classList.remove("is-open");
        menu.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-label", "Open navigation menu");
        menu.querySelector(".control-icon").textContent = "☰";
        menu.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 840 && sidebar.classList.contains("is-open")) {
        sidebar.classList.remove("is-open");
        menu.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-label", "Open navigation menu");
        menu.querySelector(".control-icon").textContent = "☰";
      }
    });
    // Existing navigation anchors remain untouched.
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
