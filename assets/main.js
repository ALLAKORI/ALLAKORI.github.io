/* Portfolio hacker-pro pack v20261008 - fast, subtle, recruiter-safe */
(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia && window.matchMedia("(hover: none)").matches;
  var isMobile = window.innerWidth < 840;

  /* Current site language (set by lang.js, defaults to English) */
  function currentLang() {
    try { return localStorage.getItem("portfolio-lang") === "fr" ? "fr" : "en"; } catch (e) { return "en"; }
  }
  var CV_EN_URL = "assets/cv/cv_pfe_2027_software_ai_cybersecurity_allado.pdf?v=20260917-pfe";
  var CV_FR_URL = "assets/cv/cv_pfa_cybersecurite_kossi_richard_allado.pdf?v=20260702-main-cv";
  function cvUrl() { return currentLang() === "fr" ? CV_FR_URL : CV_EN_URL; }

  /* ---------- Staged boot terminal (fast, tied to real load) ---------- */
  function initBoot() {
    if (document.getElementById("boot")) return;
    var seen = false;
    try { seen = sessionStorage.getItem("ak-boot-seen") === "1"; } catch (e) {}
    document.body.classList.add("loaded");
    if (reducedMotion) {
      try { sessionStorage.setItem("ak-boot-seen", "1"); } catch (e) {}
      return;
    }
    var boot = document.createElement("div");
    boot.id = "boot";
    boot.setAttribute("aria-hidden", "true");
    boot.innerHTML = '<div class="boot-box"><div class="boot-lines"></div><div class="boot-bar"><i></i></div></div>';
    document.body.appendChild(boot);
    var linesBox = boot.querySelector(".boot-lines");
    var steps = [
      ["./init_portfolio.sh --pfe-2027", "prompt"],
      ["mounting proof / labs / writeups ...", "ok"],
      ["linking htb + thm profiles ...", "ok"],
      ["compiling hacker effects ...", "ok"],
      ["access granted — welcome, recruiter", "ok"]
    ];
    var seq = seen ? [steps[0], steps[steps.length - 1]] : steps;
    var li = 0, fast = seen, finished = false;
    window.addEventListener("load", function () { fast = true; });
    function finish() {
      if (finished) return;
      finished = true;
      boot.classList.add("done");
      try { sessionStorage.setItem("ak-boot-seen", "1"); } catch (e) {}
      setTimeout(function () { if (boot.parentNode) boot.parentNode.removeChild(boot); }, 350);
    }
    function addLine() {
      if (finished) return;
      if (li >= seq.length) { finish(); return; }
      var s = seq[li];
      var div = document.createElement("div");
      div.className = "b-line";
      if (s[1] === "prompt") div.innerHTML = '<span class="b-prompt">root@allakori:~$</span><span></span>';
      else div.innerHTML = '<span class="b-ok">[ok]</span><span></span>';
      linesBox.appendChild(div);
      var target = div.querySelector("span:last-child");
      var full = s[0], ci = 0;
      (function tick() {
        if (finished) return;
        ci += fast ? 6 : 3;
        target.textContent = full.slice(0, ci);
        if (ci < full.length) setTimeout(tick, fast ? 4 : 11);
        else { li++; setTimeout(addLine, fast ? 40 : 110); }
      })();
    }
    addLine();
    setTimeout(finish, 2600); // absolute safety: never trap the visitor
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

  /* ---------- Live looping terminal (never static) ---------- */
  var SCREENS = [
    [
      { cmd: "$ whoami", out: "Kossi Richard Allado", cls: "t-strong" },
      { cmd: "$ focus --pfe", out: "Cybersecurity, AI Security and secure software", cls: "ok" },
      { cmd: "$ evidence --show", out: "PFA CyberVeille PME, Chatbot USMS RAG, CSIA CTF 1st, Splunk DFIR, Linux hardening, HTB x11.", cls: "" }
    ],
    [
      { cmd: "$ thm --rank", out: "Top 1% globally — Jr Pentester, SOC L1, AI Security", cls: "ok" },
      { cmd: "$ htb --season 11", out: "11 machines documented: AD, Kerberos, CVE mapping, DFIR", cls: "" },
      { cmd: "$ ctf --last", out: "CSIA CTF 2026 — 1st place with GHOSTSHELL", cls: "t-strong" }
    ],
    [
      { cmd: "$ cat contact.txt", out: "Beni Mellal, MA — FR/EN — PFE 2027", cls: "" },
      { cmd: "$ ./hire_me --dry-run", out: "SOC/DFIR • Offensive Security • AI Security [ready]", cls: "ok" }
    ]
  ];
  function initTyping() {
    var box = $(".terminal-lines");
    if (!box) return;
    if (reducedMotion) {
      // Static fallback: first screen, no animation
      box.innerHTML = "";
      SCREENS[0].forEach(function (s) {
        var div = document.createElement("div");
        div.className = "t-line";
        var p = document.createElement("span");
        p.className = "cmd";
        p.textContent = "$ ";
        var r = document.createElement("span");
        r.textContent = s.cmd.replace(/^\$\s*/, "");
        div.appendChild(p); div.appendChild(r);
        box.appendChild(div);
        var out = document.createElement("div");
        out.className = "t-line";
        if (s.cls === "t-strong") { var b = document.createElement("strong"); b.textContent = s.out; out.appendChild(b); }
        else { var o = document.createElement("span"); if (s.cls) o.className = s.cls; o.textContent = s.out; out.appendChild(o); }
        box.appendChild(out);
      });
      return;
    }
    box.innerHTML = "";
    var cursor = document.createElement("span");
    cursor.className = "terminal-cursor";
    var screenIdx = 0, alive = true;
    document.addEventListener("visibilitychange", function () {
      alive = !document.hidden;
    });
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
    function playScreen(si) {
      var seq = SCREENS[si % SCREENS.length];
      // wipe with quick clear effect
      box.innerHTML = "";
      var queue = [];
      seq.forEach(function (s) {
        queue.push({ text: s.cmd, isCmd: true, cls: "" });
        queue.push({ text: s.out, isCmd: false, cls: s.cls });
      });
      var li = 0;
      function typeNext() {
        if (!alive) { setTimeout(typeNext, 800); return; }
        if (li >= queue.length) {
          box.appendChild(cursor);
          // hold screen, then next
          setTimeout(function () { playScreen(si + 1); }, 3400);
          return;
        }
        var item = queue[li];
        var built = lineEl(item.text, item.isCmd, item.cls);
        box.appendChild(built.el);
        built.el.appendChild(cursor);
        var full = built.full;
        built.typeTarget.textContent = "";
        var ci = 0;
        var speed = item.isCmd ? 38 : 13;
        (function tick() {
          if (!alive) { setTimeout(tick, 500); return; }
          ci++;
          built.typeTarget.textContent = full.slice(0, ci);
          if (ci < full.length) {
            setTimeout(tick, speed + Math.random() * 20);
          } else {
            li++;
            setTimeout(typeNext, item.isCmd ? 170 : 330);
          }
        })();
      }
      typeNext();
    }
    setTimeout(function () { playScreen(0); }, 1100);
  }

  /* ---------- Rotating availability badge (always moving) ---------- */
  function initRotator() {
    if (reducedMotion) return;
    var badge = $(".availability");
    if (!badge) return;
    var msgsEN = [
      "Preparing for PFE 2027 opportunities",
      "Open to SOC / DFIR discussions",
      "HTB Season 11 documented — THM Top 1%",
      "CSIA CTF 2026 — 1st place GHOSTSHELL"
    ];
    var msgsFR = [
      "Préparation des candidatures PFE 2027",
      "Ouvert aux discussions SOC / DFIR",
      "HTB Season 11 documentée — THM Top 1%",
      "CSIA CTF 2026 — 1re place GHOSTSHELL"
    ];
    // Rotator follows the site language, even mid-cycle
    if (currentLang() === "fr") badge.textContent = msgsFR[0];
    var i = 0;
    setInterval(function () {
      if (document.hidden) return;
      var msgs = currentLang() === "fr" ? msgsFR : msgsEN;
      i = (i + 1) % msgs.length;
      badge.style.opacity = "0";
      badge.style.transform = "translateY(4px)";
      setTimeout(function () {
        badge.textContent = msgs[i];
        badge.style.transition = "opacity .3s, transform .3s";
        badge.style.opacity = "1";
        badge.style.transform = "none";
      }, 220);
    }, 4200);
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

  /* ---------- Interactive terminal (real input, simulated shell) ---------- */
  var TERM_FILES = {
    "about.txt": "Kossi Richard Allado — Cybersecurity & AI engineering student (ENSA Beni Mellal).\nPFE 2027 target: SOC/DFIR, Offensive Security, AI Security, secure software.\nMethod: reproduce, document, explain, connect to real security operations.",
    "skills.txt": "[blue]  Splunk, auditd, Volatility, IOC reasoning, timelines\n[red]   SQLi/XSS, CTF, enumeration, MITM understanding\n[id]    Keycloak, MFA/TOTP, PKI, SSH hardening, RBAC\n[ai]    RAG (FastAPI/Next.js/Postgres), scikit-learn, local LLMs",
    "contact.txt": "mail:  alladokossirichard2025@gmail.com\nlinkedin: /in/kossi-richard-allado-50177b2a5\ngithub: @ALLAKORI\nbase:  Beni Mellal, Morocco (FR/EN)",
    "pfe.txt": "Seeking: final-year internship (PFE 2027), cybersecurity focus.\nCompleted PFA: CyberVeille PME with CMRPI (URL threat intel MVP).\nOpen to: SOC/DFIR, offensive security, AI security, secure software.",
    "ctf.txt": "CSIA CTF 2026 ....... 1st place (GHOSTSHELL)\nTryHackMe ............ Top 1% globally\nHTB Season 11 ........ 11 machines documented (see writeups page)\nCiteFlag 2026 ........ finalist, 6th place"
  };
  function initTerminal() {
    if (document.getElementById("term")) return;
    var overlay = document.createElement("div");
    overlay.id = "term";
    overlay.innerHTML =
      '<div class="term-box" role="dialog" aria-label="Interactive terminal">' +
      '<div class="term-head"><span class="terminal-top"><span></span><span></span><span></span></span><span class="term-title">allakori — zsh</span><button type="button" id="term-close" aria-label="Close terminal">×</button></div>' +
      '<div class="term-out" id="term-out"></div>' +
      '<div class="term-row"><span class="b-prompt">visitor@allakori:~$</span><input id="term-in" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Terminal input" placeholder="try: help" /></div></div>';
    document.body.appendChild(overlay);
    var out = $("#term-out", overlay);
    var input = $("#term-in", overlay);
    var hist = [], hi = -1;

    function print(text, cls) {
      var div = document.createElement("div");
      div.className = "term-line" + (cls ? " " + cls : "");
      div.textContent = text;
      out.appendChild(div);
      while (out.children.length > 200) out.removeChild(out.firstChild);
      out.scrollTop = out.scrollHeight;
    }
    function printCmd(cmd) {
      var div = document.createElement("div");
      div.className = "term-line term-echo";
      div.textContent = "visitor@allakori:~$ " + cmd;
      out.appendChild(div);
    }
    var CMDS = {
      help: function () {
        print("available commands:", "t-dim");
        print("  help        this message");
        print("  whoami      who is this guy?");
        print("  ls          list ~/ files");
        print("  cat <file>  read a file (try: cat about.txt)");
        print("  skills      stack overview");
        print("  ctf         CTF record");
        print("  contact     how to reach me");
        print("  cv          download the CV (follows site language)");
        print("  htb/thm/gh/in  open profiles");
        print("  date        current date");
        print("  echo <txt>  say something");
        print("  clear       wipe the screen");
        print("  exit        close the terminal");
      },
      whoami: function () { print("Kossi Richard Allado — future PFE 2027 intern, hired soon (hopefully by you).", "t-ok"); },
      ls: function () { print("about.txt  skills.txt  contact.txt  pfe.txt  ctf.txt  cv.pdf"); },
      skills: function () { print(TERM_FILES["skills.txt"]); },
      contact: function () { print(TERM_FILES["contact.txt"]); },
      pfe: function () { print(TERM_FILES["pfe.txt"]); },
      ctf: function () { print(TERM_FILES["ctf.txt"]); },
      date: function () { print(new Date().toString()); },
      clear: function () { out.innerHTML = ""; },
      exit: function () { close(); },
      cv: function () { print("opening CV... (" + cvUrl() + ")", "t-ok"); window.open(cvUrl(), "_blank"); },
      htb: function () { print("opening HackTheBox profile @allakori ...", "t-ok"); window.open("https://profile.hackthebox.com/profile/019d03a0-4529-7233-b8f5-6fe1e7a7e02b", "_blank"); },
      thm: function () { print("opening TryHackMe profile (Top 1%) ...", "t-ok"); window.open("https://tryhackme.com/p/allakori", "_blank"); },
      gh: function () { print("opening GitHub @ALLAKORI ...", "t-ok"); window.open("https://github.com/ALLAKORI", "_blank"); },
      in: function () { print("opening LinkedIn ...", "t-ok"); window.open("https://www.linkedin.com/in/kossi-richard-allado-50177b2a5", "_blank"); },
      github: function () { CMDS.gh(); },
      linkedin: function () { CMDS.in(); },
      email: function () {
        var mail = "alladokossirichard2025@gmail.com";
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(mail);
        print(mail + "  (copied to clipboard)", "t-ok");
      },
      sudo: function () { print("[sudo] allakori is already root. Nice try.", "t-err"); },
      banner: function () { print("  ___  _    _      _              _", "t-ok"); print(" / _ || |  | |    | |   __ _  | |__   ___  _ __  _", "t-ok"); print(" |(_)|| |  | |__  | |  / _` | | '_ \\ / _ \\| '__|(_)", "t-ok"); print("  __ _| |__|____| | |_| (_| | | |_) | (_) | |    _", "t-ok"); print(" |___|____|      |_|\\__,_| |_.__/ \\___/|_|   (_)", "t-ok"); }
    };
    function run(raw) {
      var cmd = (raw || "").trim();
      if (!cmd) return;
      printCmd(cmd);
      hist.push(cmd); hi = hist.length;
      var parts = cmd.split(/\s+/);
      var base = parts[0].toLowerCase();
      if (base === "cat") {
        var f = (parts[1] || "").toLowerCase();
        if (!f) print("usage: cat <file>   (try: ls first)", "t-err");
        else if (f === "cv.pdf" || f === "cv") CMDS.cv();
        else if (TERM_FILES[f]) print(TERM_FILES[f]);
        else print("cat: " + parts[1] + ": no such file — try 'ls'", "t-err");
        return;
      }
      if (base === "echo") { print(parts.slice(1).join(" ")); return; }
      if (CMDS[base]) { CMDS[base](); return; }
      print(cmd.split(/\s+/)[0] + ": command not found — try 'help'", "t-err");
    }
    function open() {
      overlay.classList.add("open");
      if (!out.children.length) {
        print("connected to allakori-secure-shell v2.6 — type 'help' to start.", "t-dim");
        print("tip: 'cat ctf.txt' is worth it.", "t-dim");
      }
      setTimeout(function () { input.focus(); }, 60);
    }
    function close() { overlay.classList.remove("open"); input.blur(); }
    function isOpen() { return overlay.classList.contains("open"); }
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { run(input.value); input.value = ""; }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (hist.length) { hi = Math.max(0, hi - 1); input.value = hist[hi] || ""; } }
      else if (e.key === "ArrowDown") { e.preventDefault(); if (hist.length) { hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ""; } }
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
      else if (e.target !== input) input.focus();
    });
    $("#term-close", overlay).addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) close();
      else if ((e.ctrlKey || e.metaKey) && e.key === "`") { e.preventDefault(); isOpen() ? close() : open(); }
    });
    // Entry points: topline chip + palette action
    var topline = $(".topline");
    if (topline) {
      var chip = document.createElement("button");
      chip.className = "palette-hint term-hint";
      chip.type = "button";
      chip.innerHTML = '<span class="b-prompt">&gt;_</span> terminal';
      chip.addEventListener("click", open);
      topline.appendChild(chip);
    }
    try {
      document.addEventListener("portfolio-term-open", open);
    } catch (e) {}
    // Expose opener for the palette (registered when palette builds its list)
    window.__openTerminal = open;
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
      { name: "Download CV (PFE 2027)", hint: "cv", run: function () { window.open(cvUrl(), "_blank"); } },
      { name: "Open interactive terminal", hint: "term", run: function () { if (window.__openTerminal) window.__openTerminal(); } },
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
        navigator.clipboard.writeText(mail).then(function () { toast(currentLang() === "fr" ? "email copié" : "email copied"); }, function () { prompt("Copy email:", mail); });
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
    overlay.innerHTML = '<div class="lightbox-box"><img id="lightbox-img" alt="" /><div class="lightbox-bar"><span id="lightbox-cap"></span><span><button type="button" id="lightbox-prev"></button> <button type="button" id="lightbox-next"></button> <button type="button" id="lightbox-close"></button></span></div></div>';
    document.body.appendChild(overlay);
    function lightboxLang() {
      var fr = currentLang() === "fr";
      $("#lightbox-prev", overlay).textContent = fr ? "← préc" : "← prev";
      $("#lightbox-next", overlay).textContent = fr ? "suiv →" : "next →";
      $("#lightbox-close", overlay).textContent = "esc ×";
    }
    lightboxLang();
    document.addEventListener("portfolio-lang-changed", lightboxLang);
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
    input.placeholder = "";
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
    empty.textContent = "";
    target.appendChild(empty);

    var norm = function (s) {
      return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };
    var lastN = cards.length;
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
      lastN = n;
      count.textContent = n + "/" + cards.length + (currentLang() === "fr" ? " affichés" : " shown");
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
    // Toolbar follows the site language
    function filterLang() {
      var fr = currentLang() === "fr";
      input.placeholder = grid
        ? (fr ? "filtrer les writeups...  (essaie : ad, kerberos, pwn)" : "filter writeups...  (try: ad, kerberos, pwn)")
        : (fr ? "filtrer les preuves...  (essaie : cisco, ctf, thm)" : "filter proof...  (try: cisco, ctf, thm)");
      empty.textContent = fr ? "> aucun résultat — essaie un autre mot-clé [0 résultat]" : "> no match — try another keyword [0 result]";
      var labels = { all: fr ? "tout" : "all", certif: fr ? "certifs" : "certif", verify: fr ? "vérifier" : "verify" };
      $$(".filter-btn", btns).forEach(function (x) {
        var c = x.dataset.filter;
        x.textContent = c === "ad" ? "AD" : (labels[c] || c);
      });
      count.textContent = lastN + "/" + cards.length + (fr ? " affichés" : " shown");
    }
    filterLang();
    document.addEventListener("portfolio-lang-changed", filterLang);
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
      b.textContent = currentLang() === "fr" ? "copier" : "copy";
      b.setAttribute("aria-label", "Copy email " + mail);
      b.addEventListener("click", function () {
        function done() {
          b.textContent = currentLang() === "fr" ? "copié [ok]" : "copied [ok]";
          setTimeout(function () { b.textContent = currentLang() === "fr" ? "copier" : "copy"; }, 1500);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(mail).then(done, function () { window.prompt("Copy email:", mail); });
        } else window.prompt("Copy email:", mail);
      });
      a.parentNode.insertBefore(b, a.nextSibling);
    });
    // Idle copy buttons follow the site language
    document.addEventListener("portfolio-lang-changed", function () {
      var fr = currentLang() === "fr";
      $$(".copy-btn").forEach(function (x) {
        if (x.textContent === "copy" || x.textContent === "copier") x.textContent = fr ? "copier" : "copy";
      });
    });
  }

  /* ---------- Magnetic buttons + per-card cursor glow ---------- */
  function initMagnetic() {
    if (reducedMotion || isTouch) return;
    $$(".btn, .filter-btn, .palette-hint, .copy-btn, .social a").forEach(function (el) {
      var raf = null;
      el.addEventListener("mousemove", function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var r = el.getBoundingClientRect();
          var dx = e.clientX - (r.left + r.width / 2);
          var dy = e.clientY - (r.top + r.height / 2);
          el.style.transform = "translate(" + (dx * 0.12).toFixed(1) + "px," + (dy * 0.16).toFixed(1) + "px)";
        });
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
    // Card glow follows cursor inside each card
    $$(".card, .skill-box, .stat, .about-panel, .feature, .contact-panel").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--glx", (e.clientX - r.left) + "px");
        card.style.setProperty("--gly", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---------- Scramble headings on scroll into view ---------- */
  function initScrambleView() {
    // Keep headings stable for accessibility, SEO and text extraction.
    // The former scroll scramble briefly replaced real headings with random
    // glyphs and could leave crawlers with corrupted text.
    return;
  }

  /* ---------- Skills ticker injected after hero ---------- */
  function initTicker() {
    if (reducedMotion) return;
    var hero = $(".hero");
    if (!hero || $(".ticker")) return;
    var items = ["SOC / DFIR", "Splunk", "TryHackMe Top 1%", "HTB Season 11", "CSIA CTF 1st", "Linux Hardening", "IAM • Keycloak", "AI Security", "PFE 2027"];
    var ticker = document.createElement("div");
    ticker.className = "ticker";
    ticker.setAttribute("aria-hidden", "true");
    var track = document.createElement("div");
    track.className = "ticker-track";
    var half = items.map(function (s) { return "<span class='ticker-item'><i>$</i> " + s + "</span>"; }).join("");
    track.innerHTML = half + half; // loop seamlessly
    ticker.appendChild(track);
    hero.parentNode.insertBefore(ticker, hero.nextSibling);
  }

  /* ---------- Live clock + session uptime in topline ---------- */
  function initLiveClock() {
    var mono = $(".topline .mono");
    if (!mono || $("#live-clock")) return;
    var span = document.createElement("span");
    span.id = "live-clock";
    span.className = "live-clock";
    mono.appendChild(document.createTextNode("  •  "));
    mono.appendChild(span);
    var t0 = Date.now();
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function tick() {
      var d = new Date();
      var up = Math.floor((Date.now() - t0) / 1000);
      var uh = Math.floor(up / 3600), um = Math.floor((up % 3600) / 60), us = up % 60;
      var tag = currentLang() === "fr" ? "T+" : "up";
      span.innerHTML = "<span class='live-dot'></span> " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) +
        " <span class='live-up'>" + tag + " " + pad(uh) + ":" + pad(um) + ":" + pad(us) + "</span>";
    }
    tick();
    setInterval(function () { if (!document.hidden) tick(); }, 1000);
  }

  /* ---------- Recruiter-path auto-cycle (screenshot section) ---------- */
  function initCycleSteps() {
    if (reducedMotion) return;
    var items = $$(".compact-timeline .timeline-item");
    if (items.length < 2) return;
    var i = 0, paused = false;
    items.forEach(function (it) {
      it.addEventListener("mouseenter", function () {
        paused = true;
        items.forEach(function (x) { x.classList.remove("cycle-active"); });
        it.classList.add("cycle-active");
      });
      it.addEventListener("mouseleave", function () { paused = false; });
    });
    setInterval(function () {
      if (paused || document.hidden) return;
      items.forEach(function (x) { x.classList.remove("cycle-active"); });
      items[i % items.length].classList.add("cycle-active");
      i++;
    }, 3000);
  }

  /* ---------- Custom crosshair cursor (desktop) ---------- */
  function initCursor() {
    if (reducedMotion || isTouch || isMobile) return;
    var dot = document.createElement("div");
    dot.id = "cursor-dot";
    var ring = document.createElement("div");
    ring.id = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px)";
    }, { passive: true });
    (function follow() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      requestAnimationFrame(follow);
    })();
    // Grow on interactive hover
    document.addEventListener("mouseover", function (e) {
      var t = e.target.closest ? e.target.closest("a, button, .card, input") : null;
      document.body.classList.toggle("cursor-hot", !!t);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initBoot();
    initMatrix();
    initSpotlight();
    initReveal();
    initTyping();
    initRotator();
    initCounters();
    initProgress();
    initTilt();
    initMagnetic();
    initScramble();
    initScrambleView();
    initTicker();
    initLiveClock();
    initCycleSteps();
    initCursor();
    initPalette();
    initTerminal();
    initLightbox();
    initFilters();
    initCopyEmail();
    initTransitions();
  });
})();
