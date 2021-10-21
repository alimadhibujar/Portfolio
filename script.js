const openNav = document.querySelector(".icon");
const panelSaid = document.querySelector(".panel__main-side");
const overLay = document.querySelector(".overlay");
// Opening mobile nav menu
openNav.addEventListener("click", () => {
  panelSaid.style.width = "240px";
  overLay.style.width = "100vw";
});
// Closing mobile nav menu when we clicking to closeBtn or to overlay
window.addEventListener("click", (e) => {
  const closeNav = document.querySelector(".closeBtn");
  if (e.target == overLay || e.target == closeNav) {
    overLay.style.width = "0vw";
    panelSaid.style.width = "0vw";
  }
});
// Closing mobile nav menu when we clicking to nav links
const list = document.querySelectorAll(".navlink");
document.body.clientWidth < 500 &&
  list.forEach((li) => {
    li.addEventListener("click", (e) => {
      overLay.style.width = "0vw";
      panelSaid.style.width = "0vw";
    });
  });

// shadow effect when mouse over and out of image.
// Self-Invoked Function
(function titleShadow() {
  const frontBox = document.querySelectorAll(".flip-img");
  const nameTitle = document.getElementById("name-title");
  frontBox.forEach((box) => {
    box.addEventListener("mouseover", (e) => {
      nameTitleStyle = `text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1),
       -1px -1px 2px rgb(41, 40, 40), 2px 1px 2px rgba(0, 0, 0, 0.7);
       transform: translate(0, 0)`;
      nameTitle.style = nameTitleStyle;
    });
  });
  frontBox.forEach((box) => {
    box.addEventListener("mouseout", (e) => {
      const nameTitleStyle = `transform: translate(-1px, -1px);textShadow = 0 -1px 0 #7289da, 1px 1px 1px black,
      2px 2px 10px rgba(0, 0, 0, 0.15), 4px 5px 10px rgba(0, 0, 0, 0.15),
      6px 9px 10px rgba(0, 0, 0, 0.15), 8px 15px 10px rgba(0, 0, 0, 0.15),
      10px 20px 10px rgba(0, 0, 0, 0.15), 15px 30px 10px rgba(0, 0, 0, 0.15)`;
      nameTitle.style = nameTitleStyle;
    });
  });
})();

// sections fade in effect and setActiveLink.
function sectionFadeEffect() {
  let options = {
    root: null,
    rootMargin: "-275px 0px",
    threshold: 0.05,
  };
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
  const phrases = [
    "Welcome to my portfolio !",
    "I'm a front-end web developer !",
    "Nice to meet you !",
  ];
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
    setTimeout(loop, time);
  }

  loop();
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

// creating the current year in footer
const year = document.getElementById("year");
year.innerHTML = new Date().getFullYear();
year.style.fontSize = "1rem";
