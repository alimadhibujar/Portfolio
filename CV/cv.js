import { imgData } from "./../JS/dataImage.js";

document.addEventListener("DOMContentLoaded", function () {
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
});

// Get elements
const loadingOverlay = document.querySelector(".loading-overlay");
const profileImage = document.getElementById("imageProfile");
profileImage.src = imgData;
profileImage.style.animationName = "scale-in-center";

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

// DownLoad Pdf
async function downloadPDF() {
  showLoading();
  try {
    // Get the container
    const element = document.getElementById("cv-container");

    // Detect if dark mode is active
    const isDarkMode = element.classList.contains("dark-mode");

    // Remove animation in downloaded version
    profileImage.style.animationName = "";

    // Hide tooltips
    const toolTips = document.querySelectorAll(".tooltip");
    toolTips.forEach((tooltip) => {
      tooltip.style.display = "none";
    });

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

    // Restore the original styles
    restoreStyles(originalStyles);
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("Error generating PDF. Please try again or use the print option.");
  } finally {
    hideLoading();
    // Returning previous styles
    profileImage.style.animationName = "scale-in-center";
    const toolTips = document.querySelectorAll(".tooltip");
    toolTips.forEach((tooltip) => {
      tooltip.style.display = "block";
    });
  }
}

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
