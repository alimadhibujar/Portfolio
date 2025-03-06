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

// DownLoad Pdf
async function downloadPDF() {
  showLoading();
  try {
    // changing some style for the Cv pdf version
    const element = document.getElementById("cv-container"); // the element which is going to download
    profileImage.style.animationName = ""; // removing the animation in DownLoading version
    const toolTips = document.querySelectorAll(".tooltip");
    toolTips.forEach((tooltip) => {
      tooltip.style.display = "none"; // hiding toolTip
    });
    const opt = {
      margin: [10, 0],
      filename: "Bujar-Alimadhi-CV.pdf", // the name of downLoaded files
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

    await html2pdf().set(opt).from(element).save(); // cdn online converter html to pdf
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("Error generating PDF. Please try again or use the print option.");
  } finally {
    hideLoading();
    // returning prev style
    profileImage.style.animationName = "scale-in-center"; // reassuming the animation after DownLoading
    const toolTips = document.querySelectorAll(".tooltip");
    toolTips.forEach((tooltip) => {
      tooltip.style.display = "block"; // show toolTip
    });
  }
}

// inline html style for better pdf download style
function updateLinkColors() {
  const container = document.querySelector(".container");
  const isDark = container.classList.contains("dark-mode");
  const color = isDark ? "hsl(204, 39%, 77%)" : "#2a5c82";
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    link.style.color = color;
  });
}

// Dark - Mode Toggle
const container = document.querySelector(".container");
const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
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
