/* -----------------------------------------------
/* How to use? : Check the GitHub README
/* ----------------------------------------------- */

/* To load a config file (particles.json) you need to host this demo (MAMP/WAMP/local)... */

// particlesJS.load("particles-js", "particles.json", function () {
//   console.log("particles.json loaded - callback");
// });

/* Otherwise just put the config content (json): */

if (window.innerWidth < 768) {
  // Load mobile configuration (with value: 40 and speed: 2)
  particlesJS(
    "bg-js",

    {
      particles: {
        number: {
          value: 40,
          density: {
            enable: true,
            value_area: 1200,
          },
        },
        color: {
          value: "ffffff",
        },
        shape: {
          type: "image",
          stroke: {
            width: 0,
            color: "#ffffff",
          },
          polygon: {
            nb_sides: 5,
          },
          image: {
            //src: "https://static.wixstatic.com/media/2cd43b_6de62798d69649d0b42219c15bec7b32~mv2_d_3190_2212_s_2.png/v1/fill/w_320,h_220,q_90/2cd43b_6de62798d69649d0b42219c15bec7b32~mv2_d_3190_2212_s_2.png",
            //width: 320,
            //height: 200,

            // src: "http://www.dynamicdigital.us/wp-content/uploads/2013/02/starburst_white_300_drop_2.png",
            src: "img/snow.png",
            width: 100,
            height: 100,
          },
        },
        opacity: {
          value: 0.7,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            opacity_min: 0,
            sync: false,
          },
        },
        size: {
          value: 7,
          //value: 35,
          random: true,
          anim: {
            enable: true,
            speed: 4,
            size_min: 1,
            sync: false,
          },
        },
        line_linked: {
          enable: false,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          //speed: 4,
          direction: "bottom",
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
            distance: 250,
            size: 0,
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
    }
  );
} else {
  // Load desktop configuration (original with value: 80 and speed: 5)
  particlesJS(
    "bg-js",

    {
      particles: {
        number: {
          value: 50,
          //value: 25,
          density: {
            enable: true,
            value_area: 1200,
          },
        },
        color: {
          value: "ffffff",
        },
        shape: {
          type: "image",
          stroke: {
            width: 0,
            color: "#ffffff",
          },
          polygon: {
            nb_sides: 5,
          },
          image: {
            //src: "https://static.wixstatic.com/media/2cd43b_6de62798d69649d0b42219c15bec7b32~mv2_d_3190_2212_s_2.png/v1/fill/w_320,h_220,q_90/2cd43b_6de62798d69649d0b42219c15bec7b32~mv2_d_3190_2212_s_2.png",
            //width: 320,
            //height: 200,

            // src: "http://www.dynamicdigital.us/wp-content/uploads/2013/02/starburst_white_300_drop_2.png",
            src: "img/snow.png",
            width: 100,
            height: 100,
          },
        },
        opacity: {
          value: 0.7,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            opacity_min: 0,
            sync: false,
          },
        },
        size: {
          value: 7,
          //value: 35,
          random: true,
          anim: {
            enable: true,
            speed: 4,
            size_min: 1,
            sync: false,
          },
        },
        line_linked: {
          enable: false,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 3,
          //speed: 4,
          direction: "bottom",
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
            distance: 250,
            size: 0,
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
    }
  );
}
