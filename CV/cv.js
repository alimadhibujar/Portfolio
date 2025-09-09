import { imgData } from "./../JS/dataImage.js";

document.addEventListener("DOMContentLoaded", function () {
  // Initialize toast notifications for print
  initializePrintToasts();

  document
    .getElementById("download-btn")
    .addEventListener("click", downloadPDF);

  // Animate skill bars
  const skillLevels = document.querySelectorAll(".skill-level");
  skillLevels.forEach((skill) => {
    const width = skill.style.width;
    skill.style.width = "0";
    setTimeout(() => {
      skill.style.width = width;
    }, 100);
  });

  // Initialize tooltips
  const skillBars = document.querySelectorAll(".skill-bar");
  skillBars.forEach((bar) => {
    const percentage = bar.getAttribute("data-percentage");
    const tooltip = bar.querySelector(".tooltip");
    tooltip.textContent = percentage + "%";
    bar.style.setProperty("--skill-level", percentage + "%"); // crating var(--skill-level: "data-percentage" ) to use in css
  });

  // IntersectionObserver reveal-on-scroll for CV sections
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const container = document.querySelector(".main-content");
  const sections = Array.from(container.querySelectorAll("section"));

  // Add reveal classes
  sections.forEach((s) => s.classList.add("cv-reveal"));

  if (prefersReduced) {
    // Reveal immediately; no movement
    sections.forEach((s) => s.classList.remove("is-hidden"));
  } else {
    sections.forEach((s) => s.classList.add("is-hidden"));
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("is-hidden");
        } else if (!prefersReduced) {
          // Allow re-entrance animation when motion allowed
          entry.target.classList.add("is-hidden");
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.1,
    }
  );

  sections.forEach((s) => io.observe(s));

  // Initialize copy email functionality
  initializeCopyEmail();
});

// Get elements
const loadingOverlay = document.querySelector(".loading-overlay");
const profileImage = document.getElementById("imageProfile");
profileImage.src = imgData;
profileImage.style.animationName = "scale-in-center";
const copyBtn = document.getElementById("copy-email-btn");

function showLoading() {
  loadingOverlay.setAttribute("aria-hidden", "false");
}

function hideLoading() {
  loadingOverlay.setAttribute("aria-hidden", "true");
}

// Define color schemes for PDF generation
function getColorScheme(isDarkMode) {
  return {
    backgroundColor: isDarkMode ? "#1a1f24" : "#fff",
    textColor: isDarkMode ? "hsl(216, 20%, 85%)" : "#2d3436",
    primaryColor: isDarkMode ? "#64a6d3" : "#2c6e9b",
    secondaryColor: isDarkMode ? "hsl(203, 58%, 71%)" : "#4a90c0",
    accentColor: isDarkMode ? "#ff8585" : "#e67373",
    sidebarBg: isDarkMode ? "#242a33" : "#f7f9fc",
    skillBarBg: isDarkMode ? "#2c3440" : "#e0e7ec",
    headerBg: isDarkMode ? "#2c3440" : "#4a7b9d",
    linkColor: isDarkMode ? "hsl(204, 56%, 75%)" : "#2c6e9b",
    dateColor: isDarkMode ? "#a0aec0" : "#6c757d",
  };
}

// Apply direct styles for PDF generation
function applyPdfStyles(isDarkMode) {
  const colors = getColorScheme(isDarkMode);
  const originalStyles = {};

  // Store and set container styles
  const container = document.querySelector(".container");
  originalStyles.container = {
    backgroundColor: container.style.backgroundColor,
    color: container.style.color,
  };
  container.style.backgroundColor = colors.backgroundColor;
  container.style.color = colors.textColor;

  // Store and set sidebar styles
  const sidebar = document.querySelector(".sidebar");
  originalStyles.sidebar = {
    backgroundColor: sidebar.style.backgroundColor,
  };
  sidebar.style.backgroundColor = colors.sidebarBg;

  // Store and set skill bars
  const skillBars = document.querySelectorAll(".skill-bar");
  originalStyles.skillBars = [];
  skillBars.forEach((bar, index) => {
    originalStyles.skillBars[index] = {
      backgroundColor: bar.style.backgroundColor,
    };
    bar.style.backgroundColor = colors.skillBarBg;
  });

  // Store and set skill levels
  const skillLevels = document.querySelectorAll(".skill-level");
  originalStyles.skillLevels = [];
  skillLevels.forEach((level, index) => {
    originalStyles.skillLevels[index] = {
      background: level.style.background,
    };
    level.style.background = `linear-gradient(90deg, ${colors.primaryColor}, ${colors.accentColor})`;
  });

  // Store and set links
  const links = document.querySelectorAll("a");
  originalStyles.links = [];
  links.forEach((link, index) => {
    originalStyles.links[index] = {
      color: link.style.color,
    };
    link.style.color = colors.linkColor;
  });

  // Store and set dates
  const dates = document.querySelectorAll(".date-range");
  originalStyles.dates = [];
  dates.forEach((date, index) => {
    originalStyles.dates[index] = {
      color: date.style.color,
    };
    date.style.color = colors.dateColor;
  });

  // Store and set headers
  const headers = document.querySelectorAll("h2");
  originalStyles.headers = [];
  headers.forEach((header, index) => {
    originalStyles.headers[index] = {
      color: header.style.color,
      borderBottomColor: header.style.borderBottomColor,
    };
    header.style.color = colors.primaryColor;
    header.style.borderBottomColor = colors.primaryColor;
  });

  // Store and set subheaders
  const subheaders = document.querySelectorAll("h3");
  originalStyles.subheaders = [];
  subheaders.forEach((subheader, index) => {
    originalStyles.subheaders[index] = {
      color: subheader.style.color,
    };
    subheader.style.color = colors.secondaryColor;
  });

  // Store and set main header background
  const mainHeader = document.querySelector(".main-content header");
  originalStyles.mainHeader = {
    background: mainHeader.style.background,
  };
  mainHeader.style.background = isDarkMode
    ? `radial-gradient(circle farthest-corner at top left, #2c3440 0%, #374a5c 85%)`
    : `radial-gradient(circle farthest-corner at top left, rgba(44, 62, 80, 0.9) 0%, #4a7b9d 85%)`;

  return originalStyles;
}

// Restore original styles
function restoreStyles(originalStyles) {
  // Restore container
  const container = document.querySelector(".container");
  container.style.backgroundColor = originalStyles.container.backgroundColor;
  container.style.color = originalStyles.container.color;

  // Restore sidebar
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.backgroundColor = originalStyles.sidebar.backgroundColor;

  // Restore skill bars
  const skillBars = document.querySelectorAll(".skill-bar");
  skillBars.forEach((bar, index) => {
    bar.style.backgroundColor = originalStyles.skillBars[index].backgroundColor;
  });

  // Restore skill levels
  const skillLevels = document.querySelectorAll(".skill-level");
  skillLevels.forEach((level, index) => {
    level.style.background = originalStyles.skillLevels[index].background;
  });

  // Restore links
  const links = document.querySelectorAll("a");
  links.forEach((link, index) => {
    link.style.color = originalStyles.links[index].color;
  });

  // Restore dates
  const dates = document.querySelectorAll(".date-range");
  dates.forEach((date, index) => {
    date.style.color = originalStyles.dates[index].color;
  });

  // Restore headers
  const headers = document.querySelectorAll("h2");
  headers.forEach((header, index) => {
    header.style.color = originalStyles.headers[index].color;
    header.style.borderBottomColor =
      originalStyles.headers[index].borderBottomColor;
  });

  // Restore subheaders
  const subheaders = document.querySelectorAll("h3");
  subheaders.forEach((subheader, index) => {
    subheader.style.color = originalStyles.subheaders[index].color;
  });

  // Restore main header
  const mainHeader = document.querySelector(".main-content header");
  mainHeader.style.background = originalStyles.mainHeader.background;
}

// DownLoad Pdf with toast notifications
async function downloadPDF() {
  showLoading();

  // Show starting toast
  toastNotification.show("Generating PDF...", "success", 4000);

  try {
    // Get the container
    const element = document.getElementById("cv-container");

    // Ensure all sections are visible for capture
    const hiddenBefore = revealAllForOutput();

    // Detect if dark mode is active
    const isDarkMode = element.classList.contains("dark-mode");

    // Remove animation in downloaded version
    profileImage.style.animationName = "";

    // Hide tooltips and copy button for clean output in PDF
    const toolTips = document.querySelectorAll(".tooltip");
    toolTips.forEach((tooltip) => {
      tooltip.style.display = "none";
    });

    copyBtn.style.display = "none";

    // Apply explicit styles for PDF generation based on current theme
    const originalStyles = applyPdfStyles(isDarkMode);

    const opt = {
      margin: [0, 0],
      filename: "Bujar-Alimadhi-CV.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: "mm",
        format: "letter",
        orientation: "portrait",
      },
    };

    await html2pdf().set(opt).from(element).save();

    // Show success toast
    toastNotification.show("CV downloaded successfully!", "success", 3000);

    // Restore the original styles
    restoreStyles(originalStyles);
    // Restore hidden states after export
    restoreHiddenAfterOutput(hiddenBefore);
  } catch (error) {
    console.error("PDF generation failed:", error);
    // Show error toast
    toastNotification.show(
      "Error generating PDF. Please try again.",
      "error",
      4000
    );
  } finally {
    hideLoading();
    // Returning previous styles
    profileImage.style.animationName = "scale-in-center";
    const toolTips = document.querySelectorAll(".tooltip");
    toolTips.forEach((tooltip) => {
      tooltip.style.display = "block";
    });

    copyBtn.style.display = "inline-block";
  }
}

// Initialize print toast notifications
function initializePrintToasts() {
  const printBtn = document.getElementById("print-btn");

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      toastNotification.show("Opening print dialog...", "success", 2500);
    });
  }
}

// Utilities to reveal/hide sections for output (print/PDF)
function revealAllForOutput() {
  const sections = Array.from(document.querySelectorAll(".cv-reveal"));
  const hidden = [];
  sections.forEach((s) => {
    if (s.classList.contains("is-hidden")) hidden.push(s);
    s.classList.remove("is-hidden");
  });
  return hidden;
}

function restoreHiddenAfterOutput(hiddenNodes) {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return; // keep visible for reduced motion users
  (hiddenNodes || []).forEach((n) => n.classList.add("is-hidden"));
}

// Enhanced print event listeners with toasts
let _hiddenForPrint = null;
window.addEventListener("beforeprint", () => {
  _hiddenForPrint = revealAllForOutput();
  toastNotification.show("Preparing CV for printing...", "success", 2000);
});

window.addEventListener("afterprint", () => {
  restoreHiddenAfterOutput(_hiddenForPrint);
  _hiddenForPrint = null;
  // Small delay to ensure print dialog has closed
  setTimeout(() => {
    toastNotification.show("Print dialog closed", "success", 2000);
  }, 500);
});

// inline html style for better pdf download style
function updateLinkColors() {
  const container = document.querySelector(".container");
  const isDark = container.classList.contains("dark-mode");
  const color = isDark ? "hsl(204, 56%, 75%)" : "#2c6e9b";
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    link.style.color = color;
    link.style.transition = "color 0.4s ease";
  });
}

// Dark - Mode Toggle
const container = document.querySelector(".container");
const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");

if (
  savedTheme === "dark" ||
  (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches) // Check for saved theme preference or respect OS preference
) {
  container.classList.add("dark-mode");
  themeToggle.innerHTML =
    '<i class="fa fa-sun-o" aria-hidden="true"></i> Light Mode';
} else {
  container.classList.remove("dark-mode");
  themeToggle.innerHTML =
    '<i class="fa fa-moon-o" aria-hidden="true"></i> Dark Mode';
}
updateLinkColors();

themeToggle.addEventListener("click", () => {
  container.classList.toggle("dark-mode");
  const isDark = container.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggle.innerHTML = isDark
    ? '<i class="fa fa-sun-o" aria-hidden="true"></i> Light Mode'
    : '<i class="fa fa-moon-o" aria-hidden="true"></i> Dark Mode';
  updateLinkColors();
});

/* Keyboard shortcuts for sticky mini-toolbar with toast notifications:
   P -> Print, D -> Download PDF, T -> Toggle Theme
   Works when focus is not inside an input/textarea/contenteditable and no modifier keys are pressed.
*/
document.addEventListener("keydown", (e) => {
  // Ignore when user is typing in inputs or using modifiers
  const target = e.target;
  const tag = target && target.tagName ? target.tagName.toLowerCase() : "";
  const isTypingContext =
    tag === "input" || tag === "textarea" || target.isContentEditable === true;

  if (isTypingContext) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  // Normalize key
  const key = e.key.toLowerCase();

  if (key === "p") {
    e.preventDefault(); // avoid browser default only if we intend to print
    toastNotification.show(
      "Opening print dialog... (Shortcut: P)",
      "success",
      2500
    );
    window.print();
    // Visual feedback: briefly focus the print button
    const btn = document.getElementById("print-btn");
    if (btn) {
      btn.focus({ preventScroll: true });
      setTimeout(() => btn.blur(), 600);
    }
  } else if (key === "d") {
    e.preventDefault();
    toastNotification.show(
      "Starting PDF download... (Shortcut: D)",
      "success",
      3000
    );
    const btn = document.getElementById("download-btn");
    if (btn) {
      btn.click();
      btn.focus({ preventScroll: true });
      setTimeout(() => btn.blur(), 600);
    } else {
      // Fallback in case button not found
      downloadPDF();
    }
  } else if (key === "t") {
    e.preventDefault();
    const isDarkMode = container.classList.contains("dark-mode");
    const newTheme = isDarkMode ? "light" : "dark";
    toastNotification.show(
      `Switched to ${newTheme} mode (Shortcut: T)`,
      "success",
      2000
    );

    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.click();
      btn.focus({ preventScroll: true });
      setTimeout(() => btn.blur(), 600);
    } else {
      // Fallback toggling
      container.classList.toggle("dark-mode");
      const isDark = container.classList.contains("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      updateLinkColors();
    }
  }
});

// Toast Notification System
class ToastNotification {
  constructor() {
    this.container = document.getElementById("toast-container");
    this.toasts = [];
  }

  show(message, type = "success", duration = 3000) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icon =
      type === "success" ? "fa-check-circle" : "fa-exclamation-circle";

    toast.innerHTML = `
      <i class="fa ${icon} toast-icon" aria-hidden="true"></i>
      <span class="toast-message">${message}</span>
    `;

    this.container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    // Auto-remove after duration
    const timeoutId = setTimeout(() => {
      this.hide(toast);
    }, duration);

    // Store toast info
    this.toasts.push({ element: toast, timeoutId });

    return toast;
  }

  hide(toast) {
    toast.classList.remove("show");

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }

      // Remove from toasts array
      const index = this.toasts.findIndex((t) => t.element === toast);
      if (index > -1) {
        this.toasts.splice(index, 1);
      }
    }, 300);
  }

  hideAll() {
    this.toasts.forEach(({ element, timeoutId }) => {
      clearTimeout(timeoutId);
      this.hide(element);
    });
  }
}

// Initialize toast system
const toastNotification = new ToastNotification();

// Copy Email Functionality
function initializeCopyEmail() {
  const copyBtn = document.getElementById("copy-email-btn");
  const emailAddress = document.getElementById("email-address");

  if (!copyBtn || !emailAddress) return;

  copyBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const email = emailAddress.textContent.trim();

    try {
      // Modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        handleCopySuccess();
      } else {
        // Fallback for older browsers or non-secure contexts
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
    // Update button appearance
    copyBtn.classList.add("copied");
    const originalIcon = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';

    // Show success toast
    toastNotification.show("Email copied to clipboard!", "success");

    // Reset button after animation
    setTimeout(() => {
      copyBtn.classList.remove("copied");
      copyBtn.innerHTML = originalIcon;
    }, 2000);

    // Optional: Add haptic feedback on mobile
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
  }

  // Add keyboard support (Enter/Space)
  copyBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      copyBtn.click();
    }
  });

  // Add tooltip on hover (optional enhancement)
  let tooltipTimeout;

  copyBtn.addEventListener("mouseenter", () => {
    clearTimeout(tooltipTimeout);
    copyBtn.setAttribute("data-tooltip", "Copy email");
  });

  copyBtn.addEventListener("mouseleave", () => {
    tooltipTimeout = setTimeout(() => {
      copyBtn.removeAttribute("data-tooltip");
    }, 100);
  });
}

// Keyboard shortcut (Ctrl/Cmd + Shift + C) to copy email
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
    e.preventDefault();
    const copyBtn = document.getElementById("copy-email-btn");
    if (copyBtn) {
      copyBtn.click();
    }
  }
});
