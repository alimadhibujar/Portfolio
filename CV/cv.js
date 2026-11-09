import { imgData } from "./../JS/dataImage.js";

// DOM Elements
const loadingOverlay = document.querySelector(".loading-overlay");
const profileImage = document.getElementById("imageProfile");
const copyBtn = document.getElementById("copy-email-btn");
const cvOnlineElement = document.getElementById("CV-online");
const qrSection = document.querySelector(".qr-section");
const cvContainer = document.getElementById("cv-container");
const themeToggle = document.getElementById("theme-toggle");
const printBtn = document.getElementById("print-btn");
const downloadBtn = document.getElementById("download-btn");

// Set profile image
if (profileImage) {
  profileImage.src = imgData;
}

// Toast Notification System
class ToastNotification {
  constructor() {
    this.container = document.getElementById("toast-container");
    this.toasts = [];
  }

  show(message, type = "success", duration = 3000) {
    if (!this.container) return null;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icon =
      type === "success" ? "fa-check-circle" : "fa-exclamation-circle";

    toast.innerHTML = `
      <i class="fa ${icon} toast-icon" aria-hidden="true"></i>
      <span class="toast-message">${message}</span>
    `;

    this.container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    const timeoutId = setTimeout(() => {
      this.hide(toast);
    }, duration);

    this.toasts.push({ element: toast, timeoutId });
    return toast;
  }

  hide(toast) {
    toast.classList.remove("show");

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      const index = this.toasts.findIndex((t) => t.element === toast);
      if (index > -1) {
        this.toasts.splice(index, 1);
      }
    }, 300);
  }
}

const toastNotification = new ToastNotification();

// Initialize Interactive Features
function init() {
  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }

  if (downloadBtn) {
    downloadBtn.addEventListener("click", downloadPDF);
  }

  initSkillBars();
  initScrollReveal();
  initCopyEmail();
  initSkillProjectSync();
  initSpotlight();
  initThemeToggle();
}

// Animate skill bars + set tooltip text
function initSkillBars() {
  const skillBars = document.querySelectorAll(".skill-bar");
  skillBars.forEach((bar, index) => {
    const targetPercentage = parseInt(bar.getAttribute("data-percentage"), 10);
    const tooltip = bar.querySelector(".tooltip");
    if (tooltip) {
      tooltip.textContent = `${targetPercentage}%`;
    }

    bar.style.setProperty("--skill-level", "0%");

    setTimeout(
      () => {
        bar.style.setProperty("--skill-level", `${targetPercentage}%`);
      },
      150 + index * 100,
    );
  });
}

// IntersectionObserver reveal-on-scroll for CV sections
function initScrollReveal() {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mainContent = document.querySelector(".main-content");
  if (!mainContent) return;

  const sections = mainContent.querySelectorAll("section");
  sections.forEach((s) => s.classList.add("cv-reveal"));

  if (prefersReduced) return;

  sections.forEach((s) => s.classList.add("is-hidden"));

  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("is-hidden");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.1,
    },
  );

  sections.forEach((s) => io.observe(s));
}

// Utilities to reveal/restore sections for output (print/PDF)
function revealAllForOutput() {
  const hidden = Array.from(document.querySelectorAll(".cv-reveal.is-hidden"));
  hidden.forEach((s) => s.classList.remove("is-hidden"));
  return hidden;
}

function restoreHiddenAfterOutput(hiddenNodes) {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced || !hiddenNodes) return;
  hiddenNodes.forEach((n) => n.classList.add("is-hidden"));
}

// Print Event Listeners
let hiddenForPrint = null;

window.addEventListener("beforeprint", () => {
  hiddenForPrint = revealAllForOutput();
  toastNotification.show("Preparing CV for printing...", "success", 2000);
});

window.addEventListener("afterprint", () => {
  restoreHiddenAfterOutput(hiddenForPrint);
  hiddenForPrint = null;
  setTimeout(() => {
    toastNotification.show("Print dialog closed", "success", 2000);
  }, 500);
});

// PDF Generation Helpers
function showLoading() {
  if (loadingOverlay) loadingOverlay.setAttribute("aria-hidden", "false");
}

function hideLoading() {
  if (loadingOverlay) loadingOverlay.setAttribute("aria-hidden", "true");
}

function getColorScheme(isDarkMode) {
  return {
    backgroundColor: isDarkMode ? "#1a1f24" : "#ffffff",
    textColor: isDarkMode ? "hsl(216, 20%, 85%)" : "#2d3436",
    primaryColor: isDarkMode ? "#64a6d3" : "#2c6e9b",
    secondaryColor: isDarkMode ? "hsl(203, 58%, 71%)" : "#4a90c0",
    accentColor: isDarkMode ? "#ff8585" : "#e67373",
    sidebarBg: isDarkMode ? "#242a33" : "#f7f9fc",
    skillBarBg: isDarkMode ? "#2c3440" : "#e0e7ec",
    linkColor: isDarkMode ? "hsl(204, 56%, 75%)" : "#2c6e9b",
    dateColor: isDarkMode ? "#a0aec0" : "#6c757d",
    badgeBorder: isDarkMode
      ? "rgba(100, 166, 211, 0.45)"
      : "rgba(44, 110, 155, 0.4)",
    qrCardBg: isDarkMode
      ? "rgba(100, 166, 211, 0.08)"
      : "rgba(44, 110, 155, 0.08)",
    qrCardBorder: isDarkMode
      ? "rgba(100, 166, 211, 0.35)"
      : "rgba(44, 110, 155, 0.35)",
  };
}

/**
 * Applies explicit inline styles required by html2canvas (which cannot parse color-mix)
 * and returns a restore function that reverts all touched elements back to their exact prior state.
 */
function applyPdfStyles(isDarkMode) {
  const colors = getColorScheme(isDarkMode);
  const snapshots = [];

  const setStyles = (selectorOrEl, styles) => {
    const elements =
      typeof selectorOrEl === "string"
        ? document.querySelectorAll(selectorOrEl)
        : [selectorOrEl];

    elements.forEach((el) => {
      if (!el) return;
      const prev = {};
      for (const [prop, val] of Object.entries(styles)) {
        prev[prop] = el.style[prop];
        el.style[prop] = val;
      }
      snapshots.push({ el, prev });
    });
  };

  setStyles(document.body, {
    transition: "none",
    backgroundColor: colors.backgroundColor,
  });

  setStyles(".container", {
    transition: "none",
    backgroundColor: colors.backgroundColor,
    color: colors.textColor,
  });

  setStyles(".sidebar", {
    transition: "none",
    backgroundColor: colors.sidebarBg,
  });

  setStyles(".skill-bar", {
    backgroundColor: colors.skillBarBg,
  });

  setStyles(".skill-level", {
    background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.accentColor})`,
  });

  setStyles("a", {
    color: colors.linkColor,
  });

  setStyles(".date-range", {
    color: colors.dateColor,
  });

  setStyles("h2", {
    color: colors.primaryColor,
    borderBottomColor: colors.primaryColor,
  });

  setStyles("h3", {
    color: colors.secondaryColor,
  });

  setStyles(".main-content header", {
    background: isDarkMode
      ? "radial-gradient(circle farthest-corner at top left, #2c3440 0%, #374a5c 85%)"
      : "radial-gradient(circle farthest-corner at top left, rgba(44, 62, 80, 0.9) 0%, #4a7b9d 85%)",
  });

  setStyles(".tech-badges", {
    transition: "none",
    opacity: "1",
    backgroundColor: colors.backgroundColor,
  });

  setStyles(".tech-badge", {
    transition: "none",
    background: colors.backgroundColor,
    backgroundColor: colors.backgroundColor,
    borderColor: colors.badgeBorder,
    color: colors.primaryColor,
  });

  setStyles(".qr-card", {
    background: colors.qrCardBg,
    borderColor: colors.qrCardBorder,
    textDecoration: "none",
  });

  return function restorePdfStyles() {
    for (let i = snapshots.length - 1; i >= 0; i--) {
      const { el, prev } = snapshots[i];
      for (const [prop, val] of Object.entries(prev)) {
        el.style[prop] = val;
      }
    }
  };
}

// Download PDF with toast notifications and guaranteed cleanup
async function downloadPDF() {
  showLoading();
  toastNotification.show("Generating PDF...", "success", 4000);

  const isDarkMode = isDarkModeActive();
  const hiddenBefore = revealAllForOutput();
  const restoreStyles = applyPdfStyles(isDarkMode);
  const toolTips = document.querySelectorAll(".tooltip");

  try {
    if (profileImage) profileImage.style.animation = "none";
    if (cvOnlineElement) cvOnlineElement.style.display = "block";
    if (qrSection) qrSection.style.display = "block";
    if (copyBtn) copyBtn.style.display = "none";
    toolTips.forEach((t) => {
      t.style.display = "none";
    });

    const opt = {
      margin: [0, 0],
      filename: "Bujar-Alimadhi-CV.pdf",
      image: { type: "jpeg", quality: 0.98 },
      enableLinks: true,
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        backgroundColor: getColorScheme(isDarkMode).backgroundColor,
      },
      jsPDF: {
        unit: "mm",
        format: "letter",
        orientation: "portrait",
      },
    };

    await html2pdf().set(opt).from(cvContainer).save();
    toastNotification.show("CV downloaded successfully!", "success", 3000);
  } catch (error) {
    console.error("PDF generation failed:", error);
    toastNotification.show(
      "Error generating PDF. Please try again.",
      "error",
      4000,
    );
  } finally {
    restoreStyles();
    restoreHiddenAfterOutput(hiddenBefore);
    hideLoading();

    if (profileImage) profileImage.style.animation = "";
    if (cvOnlineElement) cvOnlineElement.style.display = "";
    if (qrSection) qrSection.style.display = "";
    if (copyBtn) copyBtn.style.display = "";
    toolTips.forEach((t) => {
      t.style.display = "";
    });
  }
}

// Theme Management
function isDarkModeActive() {
  return document.documentElement.classList.contains("dark-mode");
}

function updateThemeUI() {
  if (!themeToggle) return;
  const isDark = isDarkModeActive();
  const label = themeToggle.querySelector(".label");
  if (label) {
    label.textContent = isDark ? "Light Mode" : "Dark Mode";
  }
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode",
  );
}

function initThemeToggle() {
  updateThemeUI();

  if (!themeToggle) return;

  themeToggle.addEventListener("click", () => {
    const isDark = !isDarkModeActive();

    const applyTheme = () => {
      document.documentElement.classList.toggle("dark-mode", isDark);
      try {
        localStorage.setItem("theme", isDark ? "dark" : "light");
      } catch (e) {}
      updateThemeUI();
    };

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!document.startViewTransition || prefersReduced) {
      applyTheme();
      return;
    }

    // View Transition API: circular reveal from button centre
    const rect = themeToggle.getBoundingClientRect();
    const cx = Math.round(rect.left + rect.width / 2);
    const cy = Math.round(rect.top + rect.height / 2);
    const maxR = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy),
    );

    document.documentElement.style.setProperty("--vt-cx", `${cx}px`);
    document.documentElement.style.setProperty("--vt-cy", `${cy}px`);
    document.documentElement.style.setProperty("--vt-r", `${maxR}px`);

    document.documentElement.classList.add("spa-transition");
    const transition = document.startViewTransition(applyTheme);

    transition.finished.finally(() => {
      document.documentElement.classList.remove("spa-transition");
    });
  });
}

// Global Keyboard Shortcuts: P -> Print, D -> Download PDF, T -> Toggle Theme, Ctrl/Cmd+Shift+C -> Copy Email
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + Shift + C to copy email
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toUpperCase() === "C") {
    e.preventDefault();
    if (copyBtn) copyBtn.click();
    return;
  }

  const target = e.target;
  const tag = target && target.tagName ? target.tagName.toLowerCase() : "";
  const isTypingContext =
    tag === "input" || tag === "textarea" || target.isContentEditable === true;

  if (isTypingContext || e.ctrlKey || e.metaKey || e.altKey) return;

  const key = e.key.toLowerCase();

  if (key === "p") {
    e.preventDefault();
    if (printBtn) {
      printBtn.focus({ preventScroll: true });
      setTimeout(() => printBtn.blur(), 600);
    }
    window.print();
  } else if (key === "d") {
    e.preventDefault();
    if (downloadBtn) {
      downloadBtn.click();
      downloadBtn.focus({ preventScroll: true });
      setTimeout(() => downloadBtn.blur(), 600);
    } else {
      downloadPDF();
    }
  } else if (key === "t") {
    e.preventDefault();
    const nextTheme = isDarkModeActive() ? "light" : "dark";
    toastNotification.show(
      `Switched to ${nextTheme} mode (Shortcut: T)`,
      "success",
      2000,
    );

    if (themeToggle) {
      themeToggle.click();
      themeToggle.focus({ preventScroll: true });
      setTimeout(() => themeToggle.blur(), 600);
    }
  }
});

// Copy Email Functionality
function initCopyEmail() {
  const emailAddress = document.getElementById("email-address");
  if (!copyBtn || !emailAddress) return;

  copyBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const email = emailAddress.textContent.trim();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        handleCopySuccess();
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = email;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand("copy");
          if (successful) {
            handleCopySuccess();
          } else {
            throw new Error("Copy command failed");
          }
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error("Failed to copy email:", err);
      toastNotification.show("Failed to copy email", "error");
    }
  });

  function handleCopySuccess() {
    copyBtn.classList.add("copied");
    const originalIcon = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';

    toastNotification.show("Email copied to clipboard!", "success");

    setTimeout(() => {
      copyBtn.classList.remove("copied");
      copyBtn.innerHTML = originalIcon;
    }, 2000);

    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
  }
}

// Interactive Skill-to-Project Sync
function initSkillProjectSync() {
  const skillItems = document.querySelectorAll(".skills-list > li[data-skill]");
  const projectList = document.querySelector(".project-list");
  const projectItems = document.querySelectorAll(
    ".project-list > li[data-tech]",
  );

  if (!projectList || skillItems.length === 0 || projectItems.length === 0) {
    return;
  }

  // Render tech pills next to each project
  projectItems.forEach((item) => {
    const rawTech = item.getAttribute("data-tech") || "";
    const techs = rawTech.split(",").filter(Boolean);
    const badgeContainer = document.createElement("span");
    badgeContainer.className = "tech-badges";

    techs.forEach((tech) => {
      const badge = document.createElement("span");
      badge.className = "tech-badge";
      badge.dataset.techName = tech.trim().toLowerCase();
      badge.textContent = tech.trim();
      badgeContainer.appendChild(badge);
    });
    item.appendChild(badgeContainer);
  });

  const applyFilter = (skillName) => {
    projectList.classList.add("filtering-active");
    projectItems.forEach((proj) => {
      const techs = (proj.getAttribute("data-tech") || "")
        .toLowerCase()
        .split(",")
        .map((t) => t.trim());
      const isMatch = techs.includes(skillName);
      proj.classList.toggle("skill-match", isMatch);

      proj.querySelectorAll(".tech-badge").forEach((b) => {
        b.classList.toggle("badge-match", b.dataset.techName === skillName);
      });
    });
  };

  const clearFilter = () => {
    projectList.classList.remove("filtering-active");
    projectItems.forEach((proj) => {
      proj.classList.remove("skill-match");
      proj.querySelectorAll(".tech-badge").forEach((b) => {
        b.classList.remove("badge-match");
      });
    });
  };

  const restoreActiveOrClear = () => {
    const activeSkill = document.querySelector(
      ".skills-list > li.active-skill",
    );
    if (activeSkill) {
      applyFilter(
        (activeSkill.getAttribute("data-skill") || "").toLowerCase().trim(),
      );
    } else {
      clearFilter();
    }
  };

  skillItems.forEach((skillItem) => {
    const skillName = (skillItem.getAttribute("data-skill") || "")
      .toLowerCase()
      .trim();

    skillItem.addEventListener("mouseenter", () => applyFilter(skillName));
    skillItem.addEventListener("mouseleave", restoreActiveOrClear);
    skillItem.addEventListener("focus", () => applyFilter(skillName));
    skillItem.addEventListener("blur", restoreActiveOrClear);

    skillItem.addEventListener("click", () => {
      const isAlreadyActive = skillItem.classList.contains("active-skill");
      skillItems.forEach((s) => {
        s.classList.remove("active-skill");
        s.setAttribute("aria-pressed", "false");
      });

      if (!isAlreadyActive) {
        skillItem.classList.add("active-skill");
        skillItem.setAttribute("aria-pressed", "true");
        applyFilter(skillName);
      } else {
        clearFilter();
      }
    });

    skillItem.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        skillItem.click();
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".skills-list") &&
      !e.target.closest(".project-list")
    ) {
      const activeSkill = document.querySelector(
        ".skills-list > li.active-skill",
      );
      if (activeSkill) {
        activeSkill.classList.remove("active-skill");
        activeSkill.setAttribute("aria-pressed", "false");
        clearFilter();
      }
    }
  });
}

// Glassmorphic Spotlight Cursor Glow (throttled with requestAnimationFrame)
function initSpotlight() {
  if (!cvContainer) return;

  let rafId = null;

  cvContainer.addEventListener(
    "mousemove",
    (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const rect = cvContainer.getBoundingClientRect();
        cvContainer.style.setProperty(
          "--mouse-x",
          `${e.clientX - rect.left}px`,
        );
        cvContainer.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        rafId = null;
      });
    },
    { passive: true },
  );
}

init();
