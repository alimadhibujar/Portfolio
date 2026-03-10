/**
 * Theme Toggle — light / dark with View Transition API
 * Persists choice in localStorage.
 */
(function () {
  const STORAGE_KEY = "theme-preference";
  const html = document.documentElement;
  const toggle = document.getElementById("theme-toggle");

  // Determine initial theme (localStorage → system preference → dark)
  function getPreference() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    // Update the toggle icon
    if (toggle) {
      toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
      );
      toggle.querySelector(".theme-toggle__sun").style.display =
        theme === "dark" ? "block" : "none";
      toggle.querySelector(".theme-toggle__moon").style.display =
        theme === "light" ? "block" : "none";
    }
  }

  // Apply on load
  applyTheme(getPreference());

  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";

    // Use View Transition API if available
    if (document.startViewTransition) {
      document.documentElement.classList.add("spa-transition");
      const transition = document.startViewTransition(() => {
        applyTheme(next);
      });
      transition.finished.finally(() => {
        document.documentElement.classList.remove("spa-transition");
      });
    } else {
      applyTheme(next);
    }

    localStorage.setItem(STORAGE_KEY, next);
  });
})();
