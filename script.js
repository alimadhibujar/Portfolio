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

// ("use strict");

// var canvas = document.getElementById("canvas"),
//   ctx = canvas.getContext("2d"),
//   w = (canvas.width = window.innerWidth),
//   h = (canvas.height = window.innerHeight),
//   hue = 217,
//   stars = [],
//   count = 0,
//   maxStars = 800;

// // Thanks @jackrugile for the performance tip! https://codepen.io/jackrugile/pen/BjBGoM
// // Cache gradient
// var canvas2 = document.createElement("canvas"),
//   ctx2 = canvas2.getContext("2d");
// canvas2.width = 100;
// canvas2.height = 100;
// var half = canvas2.width / 2,
//   gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
// gradient2.addColorStop(0.025, "#fff");
// gradient2.addColorStop(0.1, "hsl(" + hue + ", 61%, 33%)");
// gradient2.addColorStop(0.25, "hsl(" + hue + ", 64%, 6%)");
// gradient2.addColorStop(1, "transparent");

// ctx2.fillStyle = gradient2;
// ctx2.beginPath();
// ctx2.arc(half, half, half, 0, Math.PI * 2);
// ctx2.fill();

// // End cache

// function random(min, max) {
//   if (arguments.length < 2) {
//     max = min;
//     min = 0;
//   }

//   if (min > max) {
//     var hold = max;
//     max = min;
//     min = hold;
//   }

//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function maxOrbit(x, y) {
//   var max = Math.max(x, y),
//     diameter = Math.round(Math.sqrt(max * max + max * max));
//   return diameter / 2;
// }

// var Star = function () {
//   this.orbitRadius = random(maxOrbit(w, h));
//   this.radius = random(60, this.orbitRadius) / 12;
//   this.orbitX = w / 2;
//   this.orbitY = h / 2;
//   this.timePassed = random(0, maxStars);
//   this.speed = random(this.orbitRadius) / 80000;
//   this.alpha = random(2, 10) / 10;

//   count++;
//   stars[count] = this;
// };

// Star.prototype.draw = function () {
//   var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
//     y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
//     twinkle = random(10);

//   if (twinkle === 1 && this.alpha > 0) {
//     this.alpha -= 0.05;
//   } else if (twinkle === 2 && this.alpha < 1) {
//     this.alpha += 0.05;
//   }

//   ctx.globalAlpha = this.alpha;
//   ctx.drawImage(
//     canvas2,
//     x - this.radius / 2,
//     y - this.radius / 2,
//     this.radius,
//     this.radius
//   );
//   this.timePassed += this.speed;
// };

// for (var i = 0; i < maxStars; i++) {
//   new Star();
// }

// function animation() {
//   ctx.globalCompositeOperation = "source-over";
//   ctx.globalAlpha = 0.8;
//   ctx.fillStyle = "hsla(" + hue + ", 64%, 6%, 1)";
//   ctx.fillRect(0, 0, w, h);

//   ctx.globalCompositeOperation = "lighter";
//   for (var i = 1, l = stars.length; i < l; i++) {
//     stars[i].draw();
//   }

//   window.requestAnimationFrame(animation);
// }

// animation();
