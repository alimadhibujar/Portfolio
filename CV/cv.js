document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("download-btn")
    .addEventListener("click", downloadPDF);
  const skillLevels = document.querySelectorAll(".skill-level");
  skillLevels.forEach((skill) => {
    const width = skill.style.width;
    skill.style.width = "0";
    setTimeout(() => {
      skill.style.width = width;
    }, 100);
  });
});

// Get elements
const loadingOverlay = document.querySelector(".loading-overlay");
const profileImage = document.getElementById("imageProfile");
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
    const element = document.getElementById("cv-container");
    profileImage.style.animationName = "";
    const opt = {
      margin: [10, 0],
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
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("Error generating PDF. Please try again or use the print option.");
  } finally {
    hideLoading();
    // Re-enable animations
    profileImage.style.animationName = "scale-in-center";
  }
}
