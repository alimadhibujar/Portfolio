const openNav = document.querySelector(".icon");
const panelSaid = document.querySelector(".panel__main-side");
const overLay = document.querySelector(".overlay");
// Opening mobile nav menu
openNav.addEventListener("click", () => {
  panelSaid.style.width = "200px";
  overLay.style.width = "100vw";
});
// Closing mobile nav menu when we clicking to closeBtn or to overlay
window.addEventListener("click", (e) => {
  const closeNav = document.querySelector(".closeBtn");
  if (e.target === overLay || e.target === closeNav) {
    overLay.style.width = "0vw";
    panelSaid.style.width = "0vw";
  }
  // Shorthand
  // if ([overLay, closeNav].includes(e.target)) {
  //   overLay.style.width = "0vw";
  //   panelSaid.style.width = "0vw";
  // }
});
// Closing mobile nav menu when we clicking to nav links
const navLinks = document.querySelectorAll(".navlink");
document.body.clientWidth <= 768 &&
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      overLay.style.width = "0vw";
      panelSaid.style.width = "0vw";
    });
  });

// Custom smooth scrolling for all navigation links to prevent layout issues
navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    const href = this.querySelector("a").getAttribute("href");

    // Only handle internal hash links
    if (href.charAt(0) === "#") {
      e.preventDefault();

      const targetSection = document.querySelector(href);
      if (!targetSection) return;

      // Get correct scroll position
      const mainContent = document.querySelector(".panel__main-content");
      const offsetTop = targetSection.offsetTop;

      // Special handling for contact section to prevent gap issues
      if (href === "#contact") {
        // For contact section, use a slightly different scroll approach to prevent the gap
        const mainContent = document.querySelector(".panel__main-content");

        // Add class to disable smooth scrolling temporarily
        mainContent.classList.add("scrolling-to-contact");

        // Apply scroll
        mainContent.scrollTo({
          top: offsetTop - 10, // Small offset to prevent the gap
          behavior: "smooth",
        });

        // Remove class after animation completes
        setTimeout(() => {
          mainContent.classList.remove("scrolling-to-contact");
        }, 1000);
      } else {
        // Normal smooth scroll for other sections
        mainContent.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }

      // Still update the URL hash for proper history/bookmarking, but without scrolling
      window.history.pushState(null, null, href);
    }
  });
});

// shadow effect when mouse over and out of image-container.
// Self-Invoked Function
(function titleShadow() {
  const heroImg = document.querySelector(".image-container");
  const nameTitle = document.getElementById("name-title");

  heroImg.addEventListener("mouseover", (e) => {
    nameTitleStyle = `text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1),
      -1px -1px 2px rgb(41, 40, 40), 2px 1px 2px rgba(0, 0, 0, 0.7);
      transform: translate(0, 0)`;
    nameTitle.style = nameTitleStyle;
  });

  heroImg.addEventListener("mouseout", (e) => {
    const nameTitleStyle = `transform: translate(-1px, -1px);textShadow = 0 -1px 0 #7289da, 1px 1px 1px black,
      2px 2px 10px rgba(0, 0, 0, 0.15), 4px 5px 10px rgba(0, 0, 0, 0.15),
      6px 9px 10px rgba(0, 0, 0, 0.15), 8px 15px 10px rgba(0, 0, 0, 0.15),
      10px 20px 10px rgba(0, 0, 0, 0.15), 15px 30px 10px rgba(0, 0, 0, 0.15)`;
    nameTitle.style = nameTitleStyle;
  });
})();

// sections fade in effect and setActiveLink.
function sectionFadeEffect() {
  /* because of "rootMargin: -275px"
  let option = {
    root: null,
    rootMargin: "-275px 0px",
    threshold: 0.05,
  }
  section dose not appear in mobile
  making responsive intersection*/
  const options =
    window.innerHeight > 768
      ? { rootMargin: "-275px 0px", threshold: 0.05 }
      : { rootMargin: "0px", threshold: 0.2 };

  let observer = new IntersectionObserver(beTouching, options);
  document.querySelectorAll(".hidden").forEach((section) => {
    observer.observe(section);
  });
  function beTouching(entries, observe) {
    entries.forEach((entry) => {
      // variables for setActiveLink
      const id = entry.target.getAttribute("id");
      let link = document.querySelector(`.list__links li a[href="#${id}"]`);

      if (entry.isIntersecting) {
        entry.target.classList.remove("hidden");
        // prevent errors when link is null
        if (!link) return;
        link.parentElement.classList.add("active");
      } else {
        entry.target.classList.add("hidden");
        link.parentElement.classList.remove("active");
      }
    });
  }
}
sectionFadeEffect();

// Typing effect in the home section
(function typingEffect() {
  const textDisplay = document.getElementById("text");
  let phrases = [];
  document.body.clientWidth < 500
    ? (phrases = [
        "Welcome to my page",
        "I'm a web developer !",
        "Nice to meet you !",
      ])
    : (phrases = [
        "Welcome to my portfolio !",
        "I'm a front-end web developer !",
        "Nice to meet you !",
      ]);
  let i = 0;
  let j = 0;
  let currentPhrase = [];
  let isDeleting = false;
  let isEnd = false;

  function loop() {
    isEnd = false;
    textDisplay.innerHTML = currentPhrase.join("");

    if (i < phrases.length) {
      if (!isDeleting && j <= phrases[i].length) {
        currentPhrase.push(phrases[i][j]);
        j++;
        textDisplay.innerHTML = currentPhrase.join("");
      }

      if (isDeleting && j <= phrases[i].length) {
        currentPhrase.pop(phrases[i][j]);
        j--;
        textDisplay.innerHTML = currentPhrase.join("");
      }

      if (j == phrases[i].length) {
        isEnd = true;
        isDeleting = true;
      }

      if (isDeleting && j === 0) {
        currentPhrase = [];
        isDeleting = false;
        i++;
        if (i === phrases.length) {
          i = 0;
        }
      }
    }
    const spedUp = Math.random() * (80 - 50) + 50;
    const normalSpeed = Math.random() * (300 - 200) + 200;
    const time = isEnd ? 2000 : isDeleting ? spedUp : normalSpeed;
    setTimeout(() => requestAnimationFrame(loop), time);
  }

  requestAnimationFrame(loop);
})();

//  text area letter flying effect
// https://codepen.io/chris22smith/pen/MWKXbvx
const text = document.querySelector("#letters");
const keypress = document.querySelector("#keypress");
function type(event) {
  if (
    event.keyCode &&
    ((event.keyCode >= 48 && event.keyCode <= 90) ||
      (event.keyCode >= 186 && event.keyCode <= 222))
  ) {
    const char = event.key;
    const span = document.createElement("span");
    span.textContent = char;
    keypress.appendChild(span);
    setTimeout(function () {
      span.parentNode.removeChild(span);
    }, 750);
  }
}

text.addEventListener("keydown", type);
// Cleanup on page unload
window.addEventListener("unload", () => {
  text.removeEventListener("keydown", type);
});

// creating the current year in footer
const year = document.getElementById("year");
year.textContent = new Date().getFullYear();
year.style.fontSize = "1rem";

// Window resize handler to maintain proper scroll behavior
window.addEventListener("resize", function () {
  // Reset any scroll-related classes when window is resized
  const mainContent = document.querySelector(".panel__main-content");
  if (mainContent.classList.contains("scrolling-to-contact")) {
    mainContent.classList.remove("scrolling-to-contact");
  }
});
