/* Evidence Atlas. Local, keyboard-accessible tabs — no external dependencies. */
(function () {
  "use strict";
  function initialize() {
    var atlas = document.querySelector("[data-evidence-atlas]");
    if (!atlas) return;
    var tabs = Array.prototype.slice.call(atlas.querySelectorAll("[data-atlas-topic]"));
    var panels = Array.prototype.slice.call(atlas.querySelectorAll("[data-atlas-panel]"));
    if (tabs.length < 2 || panels.length !== tabs.length) return;
    function activate(id, focus) {
      var selected = tabs.find(function (tab) { return tab.dataset.atlasTopic === id; });
      if (!selected) return;
      tabs.forEach(function (tab) {
        var active = tab === selected;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      panels.forEach(function (panel) { panel.hidden = panel.dataset.atlasPanel !== id; });
      if (focus) selected.focus();
    }
    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () { activate(tab.dataset.atlasTopic, false); });
      tab.addEventListener("keydown", function (event) {
        var next = -1;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;
        if (next < 0) return;
        event.preventDefault();
        activate(tabs[next].dataset.atlasTopic, true);
      });
    });
    activate(tabs[0].dataset.atlasTopic, false);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
  else initialize();
})();
