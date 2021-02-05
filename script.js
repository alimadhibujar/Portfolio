const nav = document.getElementById("navlinks");
const navlinks = nav.getElementsByClassName("navlink");

function setActiveLink() {
  for (let i = 0; i < navlinks.length; i++) {
    navlinks[i].addEventListener("click", function () {
      const current = document.getElementsByClassName("active");
      if (current.length > 0) {
        current[0].className = current[0].className.replace(" active", "");
      }
      this.className += " active";
    });
  }
}

setActiveLink();

const openNav = document.querySelector(".icon");
const panelSaid = document.querySelector(".panel__main-side");
const overLay = document.querySelector(".overlay");

openNav.addEventListener("click", () => {
  panelSaid.style.width = "240px";
  overLay.style.width = "100vw";
});

window.addEventListener("click", (e) => {
  const closeNav = document.querySelector(".closebtn");
  if (e.target == overLay || e.target == closeNav) {
    overLay.style.width = "0vw";
    panelSaid.style.width = "0vw";
  }
});

const frontBox = document.querySelector(".flip-img");
const soundEffect = "https://assets.codepen.io/567707/audio-ding.wav";

frontBox.addEventListener("mouseover", (e) => new Audio(soundEffect).play());

// sections fade in effect.
let options = {
  root: null,
  rootMargin: "-200px 0px",
  threshold: 0.05,
};
let observer = new IntersectionObserver(beTouching, options);
document.querySelectorAll(".hidden").forEach((section) => {
  observer.observe(section);
});
function beTouching(entries, observe) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // console.log("intersecting");
      entry.target.classList.remove("hidden");
    } else {
      entry.target.classList.add("hidden");
    }
  });
}

const year = document.getElementById("year");
year.innerHTML = new Date().getFullYear();
year.style.fontSize = "1rem";
