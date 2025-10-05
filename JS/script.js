// ============ Mobile Navigation ============
const openNav = document.querySelector(".icon");
const panelSaid = document.querySelector(".panel__main-side");
const overLay = document.querySelector(".overlay");

// Opening mobile nav menu
openNav.addEventListener("click", () => {
  panelSaid.style.width = "200px";
  overLay.style.width = "100vw";
});

// Closing mobile nav menu when clicking closeBtn or overlay
window.addEventListener("click", (e) => {
  const closeNav = document.querySelector(".closeBtn");
  if (e.target === overLay || e.target === closeNav) {
    overLay.style.width = "0vw";
    panelSaid.style.width = "0vw";
  }
});

// Closing mobile nav menu when clicking nav links
const navLinks = document.querySelectorAll(".navlink");
if (document.body.clientWidth <= 768) {
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      overLay.style.width = "0vw";
      panelSaid.style.width = "0vw";
    });
  });
}

// ============ Hero Image Shadow Effect ============
(function titleShadow() {
  const heroImg = document.querySelector(".image-container");
  const nameTitle = document.getElementById("name-title");

  if (!heroImg || !nameTitle) return;

  const hoverStyle = `text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1),
    -1px -1px 2px rgb(41, 40, 40), 2px 1px 2px rgba(0, 0, 0, 0.7);
    transform: translate(0, 0)`;

  const defaultStyle = `transform: translate(-1px, -1px);
    text-shadow: 0 -1px 0 #7289da, 1px 1px 1px black,
    2px 2px 10px rgba(0, 0, 0, 0.15), 4px 5px 10px rgba(0, 0, 0, 0.15),
    6px 9px 10px rgba(0, 0, 0, 0.15), 8px 15px 10px rgba(0, 0, 0, 0.15),
    10px 20px 10px rgba(0, 0, 0, 0.15), 15px 30px 10px rgba(0, 0, 0, 0.15)`;

  heroImg.addEventListener("mouseover", () => {
    nameTitle.style.cssText = hoverStyle;
  });

  heroImg.addEventListener("mouseout", () => {
    nameTitle.style.cssText = defaultStyle;
  });
})();

// ============ Section Fade Effect & Active Link ============
function sectionFadeEffect() {
  const options =
    window.innerHeight > 768
      ? { rootMargin: "-275px 0px", threshold: 0.05 }
      : { rootMargin: "0px", threshold: 0.2 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      const link = document.querySelector(`.list__links li a[href="#${id}"]`);

      if (entry.isIntersecting) {
        entry.target.classList.remove("hidden");
        if (link) {
          link.parentElement.classList.add("active");
        }
      } else {
        entry.target.classList.add("hidden");
        if (link) {
          link.parentElement.classList.remove("active");
        }
      }
    });
  }, options);

  document.querySelectorAll(".hidden").forEach((section) => {
    observer.observe(section);
  });
}
sectionFadeEffect();

// ============ Typing Effect ============
(function typingEffect() {
  const textDisplay = document.getElementById("text");
  if (!textDisplay) return;

  const phrases =
    document.body.clientWidth < 500
      ? ["Welcome to my page", "I'm a web developer !", "Nice to meet you !"]
      : [
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
      }

      if (isDeleting && j <= phrases[i].length) {
        currentPhrase.pop();
        j--;
      }

      if (j === phrases[i].length) {
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

    const speedUp = Math.random() * (80 - 50) + 50;
    const normalSpeed = Math.random() * (300 - 200) + 200;
    const time = isEnd ? 2000 : isDeleting ? speedUp : normalSpeed;
    setTimeout(() => requestAnimationFrame(loop), time);
  }

  requestAnimationFrame(loop);
})();

// ============ Text Area Letter Flying Effect ============
const text = document.querySelector("#letters");
const keypress = document.querySelector("#keypress");

if (text && keypress) {
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
      setTimeout(() => {
        span.remove();
      }, 750);
    }
  }

  text.addEventListener("keydown", type);

  window.addEventListener("unload", () => {
    text.removeEventListener("keydown", type);
  });
}

// ============ Projects Data ============
const projectsData = {
  side1: {
    id: "side1",
    title: "Gallery of Pets",
    desc: "A responsive gallery showcasing pets with filtering and smooth animations.",
    tech: ["React", "React-Hooks", "CSS", "Vite"],
    details:
      "Goal: Build a fun, responsive gallery with performance-friendly interactions. Contribution: Built layout, responsive grid, search, filter, pagination, suggestions, api, logic, lazy-loading, skeleton-css and many more smooth animations.",
    media: {
      type: "image",
      src: "img/Gallery-of-Pets.webp",
      alt: "Gallery of Pets preview",
    },
    live: "https://alimadhibujar.github.io/Gallery-of-Pets/",
    repo: "https://github.com/alimadhibujar/Gallery-of-Pets",
  },
  side2: {
    id: "side2",
    title: "Rock-Paper-Scissors (React)",
    desc: "Classic Rock-Paper-Scissors implemented in React with score persistence.",
    tech: ["React", "CSS Modules", "Vite"],
    details:
      "Goal: Practice component-driven UI and state management. Contribution: Architected components, game logic, score persistence, and animations.",
    media: {
      type: "image",
      src: "img/reactGame.webp",
      alt: "React game preview",
    },
    live: "https://alimadhibujar.github.io/React-Rock-Scissors-Paper/",
    repo: "https://github.com/alimadhibujar/React-Rock-Scissors-Paper",
  },
  side3: {
    id: "side3",
    title: "Tetris (React)",
    desc: "A Tetris clone built in React with custom hooks and keyboard controls.",
    tech: ["React", "Hooks", "Canvas"],
    details:
      "Goal: Implement a classic game with React patterns. Contribution: Collision, rotation, row clearing, custom hooks, and rendering optimizations.",
    media: {
      type: "image",
      src: "img/Tetris-Game.webp",
      alt: "Tetris game preview",
    },
    live: "https://codepen.io/alimadhibujar/full/mybzoNg",
    repo: "https://codepen.io/alimadhibujar/pen/mybzoNg",
  },
  side4: {
    id: "side4",
    title: "TikTok React App",
    desc: "A TikTok-like UI built with React demonstrating feed and interactions.",
    tech: ["React", "CSS", "React-Hooks"],
    details:
      "Goal: Recreate a modern short-video feed interface. Contribution: UI composition, interactions, and responsive design.",
    media: {
      type: "image",
      src: "img/tikTok.webp",
      alt: "TikTok React App preview",
    },
    live: "https://alimadhibujar.github.io/Tik-Tok-React-App/",
    repo: "https://github.com/alimadhibujar/Tik-Tok-React-App",
  },
  side5: {
    id: "side5",
    title: "React Photo Gallery",
    desc: "A responsive photo gallery built in React with lightbox experience.",
    tech: ["React", "React-hooks", "CSS", "JavaScript"],
    details:
      "Goal: Showcase images with pleasant UX and responsiveness. Contribution: Grid system, css-skeleton-loading, modals/lightbox, keyboard navigation.",
    media: {
      type: "image",
      src: "img/Photo-Gallery.webp",
      alt: "React Photo Gallery preview",
    },
    live: "https://alimadhibujar.github.io/Photo-Gallery/",
    repo: "https://github.com/alimadhibujar/Photo-Gallery",
  },
};

// Map Swiper slides to project ids
const swiperMap = [
  { selectorIndex: 0, id: "side1" },
  { selectorIndex: 1, id: "side3" },
  { selectorIndex: 2, id: "side2" },
  { selectorIndex: 3, id: "side5" },
  { selectorIndex: 4, id: "side4" },
];

// ============ Project Modal ============
const modal = document.getElementById("projectModal");
const modalDialog = modal?.querySelector(".modal__dialog");
const modalMedia = modal?.querySelector("#projectModalMedia");
const modalTitle = modal?.querySelector("#projectModalTitle");
const modalDesc = modal?.querySelector("#projectModalDesc");
const modalTech = modal?.querySelector("#projectModalTech");
const modalDetails = modal?.querySelector("#projectModalDetails");
const modalLive = modal?.querySelector("#projectModalLive");
const modalRepo = modal?.querySelector("#projectModalRepo");

function createTechChip(name) {
  const iconMap = {
    HTML: "fa-html5",
    SCSS: "fa-scss",
    CSS: "fa-css3",
    "CSS Modules": "fa-css3",
    JavaScript: "fa-code",
    React: "fa-react",
    Hooks: "fa-react",
    "React-Hooks": "fa-react",
    Vite: "fa-bolt",
    Canvas: "fa-picture-o",
  };

  const i = document.createElement("i");
  i.className = `fa ${iconMap[name] || "fa-tag"}`;

  const span = document.createElement("span");
  span.textContent = name;

  const chip = document.createElement("span");
  chip.className = "tech-chip";
  chip.append(i, span);

  return chip;
}

function fillModal(data) {
  if (
    !modalMedia ||
    !modalTitle ||
    !modalDesc ||
    !modalTech ||
    !modalDetails ||
    !modalLive ||
    !modalRepo
  )
    return;

  // Media
  modalMedia.innerHTML = "";
  if (data.media?.type === "image") {
    const img = document.createElement("img");
    img.src = data.media.src;
    img.alt = data.media.alt || data.title;
    img.loading = "lazy";
    modalMedia.appendChild(img);
  } else if (data.media?.type === "video") {
    const video = document.createElement("video");
    video.src = data.media.src;
    video.controls = true;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    modalMedia.appendChild(video);
  }

  // Text content
  modalTitle.textContent = data.title || "";
  modalDesc.textContent = data.desc || "";
  modalDetails.textContent = data.details || "";

  // Tech chips
  modalTech.innerHTML = "";
  (data.tech || []).forEach((tech) => {
    modalTech.appendChild(createTechChip(tech));
  });

  // Links
  if (data.live) {
    modalLive.href = data.live;
    modalLive.style.display = "";
  } else {
    modalLive.removeAttribute("href");
    modalLive.style.display = "none";
  }

  if (data.repo) {
    modalRepo.href = data.repo;
    modalRepo.style.display = "";
  } else {
    modalRepo.removeAttribute("href");
    modalRepo.style.display = "none";
  }
}

function openProjectModal(projectId) {
  const data = projectsData[projectId];
  if (!modal || !data) return;

  fillModal(data);

  // Set view-transition-name for thumbnail expansion effect
  const thumbnail = document.querySelector(
    `[view-transition-name="project-${projectId}-thumb"]`
  );
  const modalImg = modalMedia?.querySelector("img");

  if (thumbnail && modalImg) {
    thumbnail.style.viewTransitionName = `project-${projectId}-thumb`;
    modalImg.style.viewTransitionName = `project-${projectId}-thumb`;
  }

  // Use view transition if supported
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
    });
  } else {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }
}

function closeProjectModal() {
  if (!modal) return;

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    });
  } else {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  // Cleanup view-transition-names after transition
  setTimeout(() => {
    document
      .querySelectorAll('[style*="view-transition-name"]')
      .forEach((el) => {
        el.style.viewTransitionName = "";
      });
  }, 700);
}

// Modal close interactions
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target instanceof HTMLElement && e.target.dataset.close === "true") {
      closeProjectModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeProjectModal();
    }
  });
}

// ============ Wire Project Interactions ============
// Desktop cube faces
(function wireCubeFaces() {
  const ids = ["side1", "side2", "side3", "side4", "side5"];
  ids.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("click", (e) => {
        e.preventDefault();
        openProjectModal(id);
      });
    }
  });
})();

// Swiper slides
(function wireSwiperSlides() {
  const slides = document.querySelectorAll(".swiper-container .swiper-slide");
  slides.forEach((slide, idx) => {
    const anchor = slide.querySelector("a");
    if (anchor) {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const map = swiperMap.find((m) => m.selectorIndex === idx);
        if (map?.id) {
          openProjectModal(map.id);
        }
      });
    }
  });
})();

// ============ Footer Year ============
const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
  year.style.fontSize = "1rem";
}

// ============ Section Navigation ============
const mainContent = document.querySelector(".panel__main-content");

// Window resize handler
window.addEventListener("resize", () => {
  if (mainContent?.classList.contains("scrolling-to-contact")) {
    mainContent.classList.remove("scrolling-to-contact");
  }
});

// Enhanced navigation with view transitions
navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    const anchor = this.querySelector("a");
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href || href.charAt(0) !== "#") return;

    e.preventDefault();

    const targetSection = document.querySelector(href);
    if (!targetSection || !mainContent) return;

    const scrollToSection = () => {
      targetSection.classList.remove("hidden");
      const offsetTop = targetSection.offsetTop;

      if (href === "#contact") {
        mainContent.classList.add("scrolling-to-contact");
        mainContent.scrollTo({ top: offsetTop - 10, behavior: "smooth" });
        setTimeout(() => {
          mainContent.classList.remove("scrolling-to-contact");
        }, 1000);
      } else {
        mainContent.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    };

    // Use view transition if supported
    if (document.startViewTransition) {
      document.startViewTransition(scrollToSection);
    } else {
      scrollToSection();
    }

    // Update aria-current for accessibility
    document
      .querySelectorAll('.list__links a[aria-current="page"]')
      .forEach((a) => a.removeAttribute("aria-current"));
    anchor.setAttribute("aria-current", "page");

    // Update URL hash
    window.history.pushState(null, null, href);
  });
});
