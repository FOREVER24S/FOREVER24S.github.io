/* ============================================================
   site.js — one file, no dependencies.
   Sections: 1 theme  2 header  3 hero entrance  4 reveals
             5 filters  6 BibTeX  7 print  8 misc
   Everything degrades gracefully: with JS disabled the page still
   reads and navigates (boot.js only adds .js and sets the theme).
   ============================================================ */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Theme ---------- */
  var toggle = doc.getElementById("themeToggle");

  function setTheme(next) {
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    if (toggle) {
      var dark = next === "dark";
      toggle.setAttribute("aria-pressed", String(dark));
      toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    }
    var meta = doc.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "dark" ? "#0E1720" : "#F5F8F9");
  }

  if (toggle) {
    setTheme(root.getAttribute("data-theme") || "light");
    toggle.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  /* ---------- 2. Header, progress rail, mobile nav ---------- */
  var head = doc.getElementById("siteHead");
  var rail = doc.getElementById("progressBar");
  var nav = doc.getElementById("nav");
  var navToggle = doc.getElementById("navToggle");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || doc.documentElement.scrollTop;
    if (head) head.classList.toggle("is-scrolled", y > 8);
    if (rail) {
      var max = doc.documentElement.scrollHeight - window.innerHeight;
      rail.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    }
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  if (nav && navToggle) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    doc.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) closeNav();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 880) closeNav();
    });
  }

  /* ---------- 3. Hero entrance ---------- */
  function markReady() {
    doc.body.classList.add("is-ready");
  }
  if (reduce) {
    markReady();
  } else {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(markReady);
    });
  }

  /* ---------- 4. Scroll reveals ---------- */
  var revealables = doc.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add("is-in"); });
  }

  /* ---------- 5. Filters and search ---------- */
  function chipGroup(group, onChange) {
    var buttons = Array.prototype.slice.call(group.querySelectorAll("[data-filter], [data-type]"));
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        if (onChange) onChange();
      });
    });
    return function value() {
      var on = buttons.filter(function (b) { return b.getAttribute("aria-pressed") === "true"; })[0];
      if (!on) return "all";
      return on.getAttribute("data-filter") || on.getAttribute("data-type") || "all";
    };
  }

  /* 5a. Projects page */
  var projectList = doc.getElementById("projectList");
  var projectFilters = doc.getElementById("projectFilters");
  var projectCount = doc.getElementById("projectCount");
  var projectEmpty = doc.getElementById("projectEmpty");

  if (projectList && projectFilters) {
    var projects = Array.prototype.slice.call(projectList.querySelectorAll(".project"));
    var projectGroups = Array.prototype.slice.call(projectList.querySelectorAll("[data-group]"));
    var applyProjects = function () {
      var want = projectValue();
      var shown = 0;
      projects.forEach(function (p) {
        var tags = (p.getAttribute("data-tags") || "").split(/\s+/);
        var ok = want === "all" || tags.indexOf(want) !== -1;
        p.hidden = !ok;
        if (ok) shown++;
      });
      projectGroups.forEach(function (g) {
        var any = Array.prototype.some.call(g.querySelectorAll(".project"), function (p) { return !p.hidden; });
        g.hidden = !any;
      });
      if (projectCount) projectCount.textContent = shown + (shown === 1 ? " project" : " projects");
      if (projectEmpty) projectEmpty.hidden = shown !== 0;
    };
    var projectValue = chipGroup(projectFilters, applyProjects);
    applyProjects();
  }

  /* 5b. Publications page */
  var pubList = doc.getElementById("pubList");
  var pubTypes = doc.getElementById("pubTypes");
  var pubSearch = doc.getElementById("pubSearch");
  var pubCount = doc.getElementById("pubCount");
  var pubEmpty = doc.getElementById("pubEmpty");

  if (pubList && pubTypes) {
    var groups = Array.prototype.slice.call(pubList.querySelectorAll("[data-group]"));
    var pubs = Array.prototype.slice.call(pubList.querySelectorAll(".pub"));

    var applyPubs = function () {
      var want = pubValue();
      var q = pubSearch ? pubSearch.value.trim().toLowerCase() : "";
      var shown = 0;
      pubs.forEach(function (p) {
        var type = p.getAttribute("data-type") || "";
        var text = (p.textContent || "").toLowerCase();
        var ok = (want === "all" || type === want) && (q === "" || text.indexOf(q) !== -1);
        p.hidden = !ok;
        if (ok) shown++;
      });
      groups.forEach(function (g) {
        var any = Array.prototype.some.call(g.querySelectorAll(".pub"), function (p) { return !p.hidden; });
        g.hidden = !any;
      });
      if (pubCount) pubCount.textContent = shown + (shown === 1 ? " paper" : " papers");
      if (pubEmpty) pubEmpty.hidden = shown !== 0;
    };
    var pubValue = chipGroup(pubTypes, applyPubs);
    if (pubSearch) {
      pubSearch.addEventListener("input", applyPubs);
      pubSearch.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { pubSearch.value = ""; applyPubs(); }
      });
    }
    applyPubs();
  }

  /* ---------- 6. Copy BibTeX ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = doc.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      doc.body.appendChild(ta);
      ta.select();
      try { doc.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
      doc.body.removeChild(ta);
    });
  }

  Array.prototype.forEach.call(doc.querySelectorAll(".js-cite"), function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-bib");
      var src = doc.querySelector('script[data-bib="' + id + '"]');
      if (!src) return;
      var label = btn.textContent;
      // Some browsers leave clipboard.writeText() pending without user
      // activation, so race it against a short timer and fall back either way.
      Promise.race([
        copyText(src.textContent.trim()),
        new Promise(function (_, reject) { setTimeout(function () { reject(new Error("timeout")); }, 900); })
      ]).then(function () {
        btn.textContent = "Copied ✓";
        setTimeout(function () {
          btn.textContent = label;
        }, 1800);
      }).catch(function () {
        // Clipboard blocked (no user activation, or a locked-down browser):
        // print the entry and select it, so a manual copy is one keystroke away.
        var host = btn.closest(".pub") || btn.closest(".row");
        if (!host) return;
        var pre = host.querySelector(".bib-fallback");
        if (!pre) {
          pre = doc.createElement("pre");
          pre.className = "bib-fallback";
          pre.setAttribute("tabindex", "0");
          pre.textContent = src.textContent.trim();
          var anchor = btn.closest(".lnks") || btn.parentNode;
          anchor.parentNode.insertBefore(pre, anchor.nextSibling);
        }
        var sel = window.getSelection();
        if (sel) {
          var range = doc.createRange();
          range.selectNodeContents(pre);
          sel.removeAllRanges();
          sel.addRange(range);
        }
        btn.textContent = "Selected below";
        setTimeout(function () { btn.textContent = label; }, 2600);
      });
    });
  });

  /* ---------- 7. Print ---------- */
  var printBtn = doc.getElementById("printCv");
  if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

  /* ---------- 8. Misc ---------- */
  var year = doc.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Anchor links to a hidden (filtered-out) paper: reveal it first.
  if (pubList && window.location.hash) {
    var target = doc.querySelector(window.location.hash);
    if (target && target.hidden) target.hidden = false;
  }
})();
