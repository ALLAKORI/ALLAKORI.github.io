/* Portfolio hacker-pro pack v20261008 - fast, subtle, recruiter-safe */
(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia && window.matchMedia("(hover: none)").matches;
  var isMobile = window.innerWidth < 840;

  /* ---------- Boot preloader ---------- */
  function initBoot() {
    if (document.getElementById("boot")) return;
    var seen = false;
    try { seen = sessionStorage.getItem("ak-boot-seen") === "1"; } catch (e) {}
    var boot = document.createElement("div");
    boot.id = "boot";
    boot.setAttribute("aria-hidden", "true");
    boot.innerHTML =
      '<div class="boot-box">' +
      '<div class="b-line"><span class="b-prompt">root@allakori:~$</span><span>./init_portfolio.sh</span></div>' +
      '<div class="b-line"><span class="b-ok">[ok]</span><span>loading proof, labs, writeups...</span></div>' +
      '<div class="b-line"><span class="b-ok">[ok]</span><span>access granted</span></div>' +
      '<div class="boot-bar"><i></i></div></div>';
    document.body.appendChild(boot);
    requestAnimationFrame(function () { document.body.classList.add("loaded"); });
    var ms = reducedMotion ? 60 : (seen ? 380 : 950);
    setTimeout(function () {
      boot.classList.add("done");
      document.body.classList.add("loaded");
      try { sessionStorage.setItem("ak-boot-seen", "1"); } catch (e) {}
      setTimeout(function () { if (boot.parentNode) boot.parentNode.removeChild(boot); }, 350);
    }, ms);
    // Safety: never block page
    setTimeout(function () {
      if (document.getElementById("boot")) {
        boot.classList.add("done");
        document.body.classList.add("loaded");
      }
    }, 2200);
  }

  /* ---------- Matrix rain (very subtle) ---------- */
  function initMatrix() {
    if (reducedMotion || isMobile || isTouch) return;
    if (document.getElementById("matrix-bg")) return;
    if (!window.requestAnimationFrame) return;
    try {
      var canvas = document.createElement("canvas");
      canvas.id = "matrix-bg";
      canvas.setAttribute("aria-hidden", "true");
      document.body.insertBefore(canvas, document.body.firstChild);
      var ctx = canvas.getContext("2d");
      var chars = "01アイチ0123459$#/+*<>;".split("");
      var fontSize = 14, columns = 0, drops = [];
      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);
        drops = [];
        for (var i = 0; i < columns; i++) drops[i] = Math.random() * -40;
      }
      resize();
      window.addEventListener("resize", resize);
      var last = 0;
      function draw(t) {
        if (document.hidden) { requestAnimationFrame(draw); return; }
        if (t - last < 66) { requestAnimationFrame(draw); return; }
        last = t;
        ctx.fillStyle = "rgba(13,16,20,0.28)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = fontSize + "px monospace";
        for (var i = 0; i < drops.length; i++) {
          var ch = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillStyle = Math.random() > 0.92 ? "rgba(112,213,139,0.5)" : "rgba(88,213,255,0.28)";
          ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.976) drops[i] = 0;
          drops[i]++;
        }
        requestAnimationFrame(draw);
      }
      requestAnimationFrame(draw);
    } catch (e) {}
  }

  /* ---------- Spotlight ---------- */
  function initSpotlight() {
    if (reducedMotion || isTouch) return;
    var raf = null, x = window.innerWidth / 2, y = 120;
    function apply() {
      raf = null;
      document.documentElement.style.setProperty("--mx", x + "px");
      document.documentElement.style.setProperty("--my", y + "px");
      document.body.style.setProperty("--mx", x + "px");
      document.body.style.setProperty("--my", y + "px");
    }
    document.addEventListener("mousemove", function (e) {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
    apply();
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var targets = $$(".section, .hero, .card, .proof-card, .feature, .skill-box, .stat, .contact-panel, .timeline-item, .about-panel, .post-row, .evidence-card");
    if (!targets.length) return;
    targets.forEach(function (el) { el.classList.add("reveal"); });
    // Hero visible immediately for LCP
    var hero = $(".hero");
    if (hero) hero.classList.add("visible");
    if (reducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(function (el) { observer.observe(el); });
    // Stagger grid children
    $$(".grid, .stats, .skills-grid").forEach(function (grid) {
      Array.prototype.forEach.call(grid.children, function (child, i) {
        child.style.transitionDelay = Math.min(i * 70, 350) + "ms";
      });
    });
  }

  /* ---------- Real terminal typing ---------- */
  function initTyping() {
    var box = $(".terminal-lines");
    if (!box || reducedMotion) return;
    var seq = [
      { cmd: "$ whoami", out: "Kossi Richard Allado", cls: "t-strong" },
      { cmd: "$ focus --pfe", out: "Cybersecurity, AI Security and secure software", cls: "ok" },
      { cmd: "$ evidence --show", out: "PFA CyberVeille PME, Chatbot USMS RAG, CSIA CTF 1st, Splunk DFIR, Linux hardening, HTB x11.", cls: "" }
    ];
    box.innerHTML = "";
    var cursor = document.createElement("span");
    cursor.className = "terminal-cursor";
    function lineEl(text, isCmd, cls) {
      var div = document.createElement("div");
      div.className = "t-line";
      if (isCmd) {
        var prompt = document.createElement("span");
        prompt.className = "cmd";
        prompt.textContent = "$ ";
        div.appendChild(prompt);
        var rest = document.createElement("span");
        rest.textContent = text.replace(/^\$\s*/, "");
        div.appendChild(rest);
        return { el: div, typeTarget: rest, full: rest.textContent };
      }
      var out = document.createElement("span");
      if (cls) out.className = cls;
      if (cls === "t-strong") {
        var b = document.createElement("strong");
        b.textContent = "";
        out.appendChild(b);
        div.appendChild(out);
        return { el: div, typeTarget: b, full: text };
      }
      out.textContent = "";
      div.appendChild(out);
      return { el: div, typeTarget: out, full: text };
    }
    var queue = [];
    seq.forEach(function (s) {
      queue.push({ text: s.cmd, isCmd: true, cls: "" });
      queue.push({ text: s.out, isCmd: false, cls: s.cls });
    });
    var li = 0;
    function typeNext() {
      if (li >= queue.length) { box.appendChild(cursor); return; }
      var item = queue[li];
      var built = lineEl(item.text, item.isCmd, item.cls);
      box.appendChild(built.el);
      built.el.appendChild(cursor);
      var full = built.full;
      built.typeTarget.textContent = "";
      var ci = 0;
      var speed = item.isCmd ? 34 : 12;
      (function tick() {
        ci++;
        built.typeTarget.textContent = full.slice(0, ci);
        if (ci < full.length) {
          setTimeout(tick, speed + Math.random() * 18);
        } else {
          li++;
          setTimeout(typeNext, item.isCmd ? 160 : 320);
        }
      })();
    }
    setTimeout(typeNext, 1100);
  }

  /* ---------- Animated counters ---------- */
  function initCounters() {
    var stats = $$(".stat strong");
    if (!stats.length) return;
    function animate(el) {
      var original = el.textContent.trim();
      var m = original.match(/(\d+)/);
      if (!m || reducedMotion) return;
      var target = parseInt(m[1], 10);
      if (isNaN(target) || target <= 1) { el.parentNode.classList.add("counted"); return; }
      // "Top 1%" -> count down 98->1 looks hacker; others count up
      var isTop = /top/i.test(original);
      var start = isTop ? 98 : 0;
      var dur = 1100, t0 = null;
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.round(start + (target - start) * eased);
        el.textContent = original.replace(/(\d+)/, String(val));
        if (p < 1) requestAnimationFrame(step);
        else {
          el.textContent = original;
          var stat = el.closest(".stat");
          if (stat) stat.classList.add("counted");
        }
      }
      requestAnimationFrame(step);
    }
    if (!("IntersectionObserver" in window) || reducedMotion) {
      stats.forEach(animate); return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animate(en.target); obs.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    stats.forEach(function (s) { obs.observe(s); });
  }

  /* ---------- Scroll progress + back to top ---------- */
  function initProgress() {
    var bar = document.createElement("div");
    bar.id = "scroll-progress";
    document.body.appendChild(bar);
    var btn = document.createElement("button");
    btn.id = "toTop";
    btn.textContent = "^";
    btn.setAttribute("aria-label", "Back to top");
    document.body.appendChild(btn);
    function onScroll() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.width = p + "%";
      if (h.scrollTop > 600) btn.classList.add("show");
      else btn.classList.remove("show");
    }
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Card tilt ---------- */
  function initTilt() {
    if (reducedMotion || isTouch || isMobile) return;
    var cards = $$(".card, .skill-box, .stat, .feature, .about-panel");
    cards.forEach(function (card) {
      card.classList.add("tilt");
      var raf = null;
      card.addEventListener("mousemove", function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = "perspective(800px) rotateX(" + (-py * 5).toFixed(2) + "deg) rotateY(" + (px * 6).toFixed(2) + "deg) translateY(-2px)";
        });
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---------- Scramble on H1 ---------- */
  function initScramble() {
    if (reducedMotion || isTouch) return;
    var h1 = $("h1");
    if (!h1) return;
    var glyphs = "!<>-_\\/[]{}—=+*^?#01";
    var original = h1.textContent;
    var busy = false;
    h1.addEventListener("mouseenter", function () {
      if (busy) return; busy = true;
      h1.classList.add("scrambling");
      var iter = 0, total = 14;
      var iv = setInterval(function () {
        h1.textContent = original.split("").map(function (ch, i) {
          if (ch === " " || ch === "\n") return ch;
          if (i < (iter / total) * original.length) return original[i];
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        }).join("");
        iter++;
        if (iter > total) {
          clearInterval(iv);
          h1.innerHTML = original.replace(/\n/g, "<br>");
          // restore accent span if it was there
          if (!h1.querySelector(".accent")) {
            h1.innerHTML = h1.innerHTML.replace(/(proof|PFE readiness|verification|full technical blog|labs, and method)/i, '<span class="accent">$1</span>');
          }
          h1.classList.remove("scrambling");
          busy = false;
        }
      }, 30);
    });
  }

  /* ---------- Command palette Ctrl+K ---------- */
  function initPalette() {
    var overlay = document.createElement("div");
    overlay.id = "palette";
    overlay.innerHTML =
      '<div class="palette-box" role="dialog" aria-label="Command palette">' +
      '<input id="palette-input" type="text" placeholder="root@allakori:~$ type a command...  (try: cv, proof, labs)" autocomplete="off" />' +
      '<div class="palette-list" id="palette-list"></div></div>';
    document.body.appendChild(overlay);
    var input = $("#palette-input", overlay);
    var list = $("#palette-list", overlay);
    var actions = [
      { name: "Go Home", hint: "01", run: function () { go("index.html"); } },
      { name: "Go Proof — certificates & CTF", hint: "02", run: function () { go("proof.html"); } },
      { name: "Go Labs", hint: "03", run: function () { go("labs.html"); } },
      { name: "Go Writeups", hint: "04", run: function () { go("writeups.html"); } },
      { name: "Go Projects", hint: "05", run: function () { go("projects.html"); } },
      { name: "Download CV (PFE 2027)", hint: "cv", run: function () { window.open("assets/cv/cv_pfe_2027_software_ai_cybersecurity_allado.pdf?v=20260917-pfe", "_blank"); } },
      { name: "Copy email", hint: "mail", run: function () { copyEmail(); } },
      { name: "Open TryHackMe profile", hint: "thm", run: function () { window.open("https://tryhackme.com/p/allakori", "_blank"); } },
      { name: "Open HackTheBox profile", hint: "htb", run: function () { window.open("https://profile.hackthebox.com/profile/019d03a0-4529-7233-b8f5-6fe1e7a7e02b", "_blank"); } },
      { name: "Open GitHub", hint: "gh", run: function () { window.open("https://github.com/ALLAKORI", "_blank"); } },
      { name: "Open LinkedIn", hint: "in", run: function () { window.open("https://www.linkedin.com/in/kossi-richard-allado-50177b2a5", "_blank"); } }
    ];
    function go(href) { window.location.href = href; }
    function copyEmail() {
      var mail = "alladokossirichard2025@gmail.com";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(mail).then(function () { toast("email copied"); }, function () { prompt("Copy email:", mail); });
      } else { prompt("Copy email:", mail); }
    }
    function toast(msg) {
      var t = document.createElement("div");
      t.textContent = "> " + msg + " [ok]";
      t.style.cssText = "position:fixed;bottom:70px;left:50%;transform:translateX(-50%);z-index:400;background:#0e1218;border:1px solid rgba(112,213,139,.4);color:#70d58b;font-family:monospace;font-size:.75rem;padding:8px 14px;border-radius:8px;";
      document.body.appendChild(t);
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 1600);
    }
    var activeIdx = 0, filtered = actions.slice();
    function render() {
      list.innerHTML = "";
      filtered.forEach(function (a, i) {
        var b = document.createElement("button");
        b.className = "palette-item" + (i === activeIdx ? " active" : "");
        b.innerHTML = "";
        var n = document.createElement("span"); n.textContent = "> " + a.name;
        var h = document.createElement("small"); h.textContent = a.hint;
        b.appendChild(n); b.appendChild(h);
        b.addEventListener("click", function () { close(); a.run(); });
        list.appendChild(b);
      });
      if (!filtered.length) {
        var empty = document.createElement("div");
        empty.className = "palette-item";
        empty.textContent = "no match — try: cv, proof, labs, mail";
        list.appendChild(empty);
      }
    }
    function open() {
      overlay.classList.add("open");
      input.value = ""; activeIdx = 0; filtered = actions.slice(); render();
      setTimeout(function () { input.focus(); }, 30);
    }
    function close() { overlay.classList.remove("open"); }
    function isOpen() { return overlay.classList.contains("open"); }
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen()) close(); else open();
      } else if (e.key === "Escape" && isOpen()) close();
      else if (isOpen() && e.key === "ArrowDown") { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, filtered.length - 1); render(); }
      else if (isOpen() && e.key === "ArrowUp") { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); render(); }
      else if (isOpen() && e.key === "Enter") { e.preventDefault(); if (filtered[activeIdx]) { var a = filtered[activeIdx]; close(); a.run(); } }
    });
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      activeIdx = 0;
      filtered = actions.filter(function (a) { return a.name.toLowerCase().indexOf(q) !== -1 || a.hint.indexOf(q) !== -1; });
      render();
    });
    // Hint chip in topline
    var topline = $(".topline");
    if (topline && !isMobile) {
      var hint = document.createElement("button");
      hint.className = "palette-hint";
      hint.type = "button";
      hint.innerHTML = '<span class="kbd">Ctrl</span> + <span class="kbd">K</span> commands';
      hint.addEventListener("click", open);
      topline.appendChild(hint);
    }
  }

  /* ---------- Page leave transition ---------- */
  function initTransitions() {
    if (reducedMotion) return;
    $$('a[href$=".html"]').forEach(function (a) {
      // Don't hijack lightbox image links or palette
      if (a.classList.contains("no-transition")) return;
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href");
        if (!href || href.indexOf("http") === 0 || e.metaKey || e.ctrlKey) return;
        // Let lightbox handle image links
        if (/\.(png|jpe?g|webp)(\?|$|#)/i.test(href) && a.querySelector("img")) return;
        e.preventDefault();
        document.body.classList.add("leaving");
        setTimeout(function () { window.location.href = href; }, 150);
      });
    });
  }

  /* ---------- Lightbox for proof / feature images ---------- */
  function initLightbox() {
    var links = $$('a[href$=".png"], a[href$=".jpg"], a[href$=".jpeg"], a[href$=".webp"], a[href*=".png?"], a[href*=".jpg?"], a[href*=".jpeg?"]');
    links = links.filter(function (a) { return a.querySelector("img"); });
    if (!links.length) return;
    var overlay = document.createElement("div");
    overlay.id = "lightbox";
    overlay.innerHTML = '<div class="lightbox-box"><img id="lightbox-img" alt="" /><div class="lightbox-bar"><span id="lightbox-cap"></span><span><button type="button" id="lightbox-prev">&larr; prev</button> <button type="button" id="lightbox-next">next &rarr;</button> <button type="button" id="lightbox-close">esc ×</button></span></div></div>';
    document.body.appendChild(overlay);
    var img = $("#lightbox-img", overlay);
    var cap = $("#lightbox-cap", overlay);
    var idx = 0;
    function show(i) {
      idx = (i + links.length) % links.length;
      var a = links[idx];
      var im = a.querySelector("img");
      var src = a.getAttribute("href");
      img.setAttribute("src", src);
      img.setAttribute("alt", im ? (im.getAttribute("alt") || "") : "");
      cap.textContent = ((im && im.getAttribute("alt")) || a.textContent.trim() || "preview") + "  [" + (idx + 1) + "/" + links.length + "]";
    }
    function open(i) { show(i); overlay.classList.add("open"); document.body.style.overflow = "hidden"; }
    function close() { overlay.classList.remove("open"); document.body.style.overflow = ""; }
    links.forEach(function (a, i) {
      a.classList.add("no-transition");
      var im = a.querySelector("img");
      if (im) im.classList.add("zoomable");
      // Open in lightbox instead of new tab (still allow ctrl+click for new tab)
      a.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        open(i);
      });
    });
    $("#lightbox-close", overlay).addEventListener("click", close);
    $("#lightbox-prev", overlay).addEventListener("click", function (e) { e.stopPropagation(); show(idx - 1); });
    $("#lightbox-next", overlay).addEventListener("click", function (e) { e.stopPropagation(); show(idx + 1); });
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    document.addEventListener("keydown", function (e) {
      if (!overlay.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") show(idx + 1);
      else if (e.key === "ArrowLeft") show(idx - 1);
    });
  }

  /* ---------- Live search + filters (writeups / proof) ---------- */
  function initFilters() {
    var grid = $(".writeup-grid") || null;
    var proofGrids = $$(".grid.grid-3");
    var target = null, cards = [], cats = [];
    if (grid) {
      target = grid;
      cards = $$(".writeup-card", grid);
      cats = ["all", "htb", "tryhackme", "ctf", "pwn", "web", "ad"];
    } else if (document.querySelector(".proof-card")) {
      // Proof page: filter across all proof grids
      cards = $$(".proof-card");
      if (!cards.length) return;
      target = cards[0].parentNode;
      cats = ["all", "certif", "ctf", "thm", "verify"];
    } else return;

    // Build toolbar
    var bar = document.createElement("div");
    bar.className = "filter-toolbar";
    var searchWrap = document.createElement("label");
    searchWrap.className = "filter-search";
    searchWrap.innerHTML = "<span>$</span>";
    var input = document.createElement("input");
    input.type = "search";
    input.placeholder = grid ? "filter writeups...  (try: ad, kerberos, pwn)" : "filter proof...  (try: cisco, ctf, thm)";
    input.setAttribute("aria-label", "Filter items");
    searchWrap.appendChild(input);
    var btns = document.createElement("div");
    btns.className = "filter-btns";
    var count = document.createElement("span");
    count.className = "filter-count";
    bar.appendChild(searchWrap);
    bar.appendChild(btns);
    bar.appendChild(count);
    target.parentNode.insertBefore(bar, target);

    var active = "all";
    cats.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "filter-btn" + (c === "all" ? " active" : "");
      b.textContent = c === "ad" ? "AD" : c;
      b.dataset.filter = c;
      b.addEventListener("click", function () {
        active = c;
        $$(".filter-btn", btns).forEach(function (x) { x.classList.toggle("active", x === b); });
        apply();
        if (grid) location.hash = c === "all" ? " " : c;
      });
      btns.appendChild(b);
    });

    // Empty state
    var empty = document.createElement("div");
    empty.className = "filter-empty";
    empty.style.display = "none";
    empty.textContent = "> no match — try another keyword [0 result]";
    target.appendChild(empty);

    var norm = function (s) {
      return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };
    function apply() {
      var q = norm(input.value.trim());
      var n = 0;
      cards.forEach(function (card) {
        var hay = norm(card.textContent);
        var okQ = !q || hay.indexOf(q) !== -1;
        var okC = active === "all" || hay.indexOf(active) !== -1 ||
          (active === "certif" && /certificate|certification|verify|completed|transcript/i.test(card.textContent)) ||
          (active === "verify" && /verify|profile/i.test(card.textContent));
        var show = okQ && okC;
        card.classList.toggle("hidden-by-filter", !show);
        if (show) n++;
      });
      empty.style.display = n ? "none" : "block";
      count.textContent = n + "/" + cards.length + " shown";
      // Re-trigger reveal for newly shown
      cards.forEach(function (c) { if (!c.classList.contains("hidden-by-filter")) c.classList.add("visible"); });
    }
    var t = null;
    input.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(apply, 120);
    });
    // Deep-link: #pwn, #ctf... preselect
    try {
      var h = (location.hash || "").replace("#", "").toLowerCase();
      if (h && cats.indexOf(h) !== -1) {
        active = h;
        $$(".filter-btn", btns).forEach(function (x) { x.classList.toggle("active", x.dataset.filter === h); });
      } else if (h === "active-directory") {
        active = "ad";
        $$(".filter-btn", btns).forEach(function (x) { x.classList.toggle("active", x.dataset.filter === "ad"); });
      }
    } catch (e) {}
    apply();
  }

  /* ---------- Copy email buttons ---------- */
  function initCopyEmail() {
    $$('a[href^="mailto:"]').forEach(function (a) {
      if (a.nextElementSibling && a.nextElementSibling.classList.contains("copy-btn")) return;
      var mail = (a.getAttribute("href") || "").replace(/^mailto:/, "").split("?")[0];
      if (!mail) return;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "copy-btn";
      b.textContent = "copy";
      b.setAttribute("aria-label", "Copy email " + mail);
      b.addEventListener("click", function () {
        function done() {
          b.textContent = "copied [ok]";
          setTimeout(function () { b.textContent = "copy"; }, 1500);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(mail).then(done, function () { window.prompt("Copy email:", mail); });
        } else window.prompt("Copy email:", mail);
      });
      a.parentNode.insertBefore(b, a.nextSibling);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initBoot();
    initMatrix();
    initSpotlight();
    initReveal();
    initTyping();
    initCounters();
    initProgress();
    initTilt();
    initScramble();
    initPalette();
    initLightbox();
    initFilters();
    initCopyEmail();
    initTransitions();
  });
})();
