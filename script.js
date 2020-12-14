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

window.addEventListener("click", () => {
  const closeNav = document.querySelector(".closebtn");
  if (event.target == overLay || event.target == closeNav) {
    overLay.style.width = "0vw";
    panelSaid.style.width = "0vw";
  }
});

const frontBox = document.querySelector(".flip-img");
const soundEffect = "https://assets.codepen.io/567707/audio-ding.wav";

frontBox.addEventListener("mouseover", (e) => new Audio(soundEffect).play());

// function scanDocument() {
//   let sectionList = document.querySelector(".hidden");
//   sectionList.forEach(function (section) {
//     var introText = document.getElementById("about");
//     var introPosition = introText.getBoundingClientRect().top;
//     var screenPosition = window.innerHeight / 1.3;
//     if (introPosition < screenPosition) {
//       section.classList.remove("hidden");
//     }
//   });
// }

// window.addEventListener("scroll", scanDocument);
