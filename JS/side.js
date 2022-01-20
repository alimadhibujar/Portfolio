particlesJS("side-js", {
  particles: {
    number: {
      value: 240,
      density: {
        enable: true,
        value_area: 200,
      },
    },
    color: {
      value: ["#FFEA00", "#ffffff", "#FF0000", "#BA181B", "#008000", "#FF0054"],
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000",
      },
      polygon: {
        nb_sides: 5,
      },
      image: {
        src: "img/github.svg",
        width: 70,
        height: 70,
      },
    },
    opacity: {
      value: 1,
      random: true,
      anim: {
        enable: true,
        speed: 20,
        opacity_min: 0,
        sync: false,
      },
    },
    size: {
      value: 0.75,
      random: true,
      anim: {
        enable: true,
        speed: 20,
        size_min: 0.3,
        sync: false,
      },
    },
    line_linked: {
      enable: false,
      distance: 142.0465754938091,
      color: "#ffffff",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1,
      direction: "top",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 600,
      },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "bubble",
      },
      onclick: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1,
        },
      },
      bubble: {
        distance: 120,
        size: 5,
        duration: 2,
        opacity: 0,
        speed: 3,
      },
      repulse: {
        distance: 400,
        duration: 0.4,
      },
      push: {
        particles_nb: 4,
      },
      remove: {
        particles_nb: 2,
      },
    },
  },
  retina_detect: true,
});
