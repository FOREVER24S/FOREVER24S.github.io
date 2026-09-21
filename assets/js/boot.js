/* Runs before first paint (not deferred): sets the theme with no flash,
   flags that JS is available, and guarantees the hero is visible even if
   site.js never loads. */
(function () {
  var d = document.documentElement;
  d.classList.add("js");

  var theme = "light";
  try {
    theme = localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  } catch (e) {}
  d.setAttribute("data-theme", theme);

  window.addEventListener("load", function () {
    setTimeout(function () {
      if (!document.body || document.body.classList.contains("is-ready")) return;
      document.body.classList.add("is-ready");
      Array.prototype.forEach.call(document.querySelectorAll("[data-reveal]"), function (el) {
        el.classList.add("is-in");
      });
    }, 1500);
  });
})();
