// ============ Mobile Navigation ============
const openNav = document.querySelector(".icon");
const panelSaid = document.querySelector(".panel__main-side");
const overLay = document.querySelector(".overlay");

// Opening mobile nav menu
if (openNav && panelSaid && overLay) {
  openNav.addEventListener("click", () => {
    panelSaid.style.width = "200px";
    overLay.style.width = "100vw";
  });
}

// Closing mobile nav menu when clicking closeBtn or overlay
window.addEventListener("click", (e) => {
  const closeNav = document.querySelector(".closeBtn");
  if (e.target === overLay || e.target === closeNav) {
    overLay.style.width = "0vw";
    panelSaid.style.width = "0vw";
  }
});

// Closing mobile nav menu when clicking nav links (re-checked live via
// matchMedia so resizing / rotating the device keeps behaviour correct)
const navLinks = document.querySelectorAll(".navlink");
const isMobileNav = () => window.matchMedia("(max-width: 768px)").matches;
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (!isMobileNav()) return;
    overLay.style.width = "0vw";
    panelSaid.style.width = "0vw";
  });
});

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
      ? ["Welcome to my page !", "I'm a web developer !", "Nice to meet you !"]
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
    textDisplay.textContent = currentPhrase.join("");

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
    setTimeout(loop, time);
  }

  loop();
})();

// ============ Text Area Letter Flying Effect ============
const text = document.querySelector("#letters");
const keypress = document.querySelector("#keypress");

if (text && keypress) {
  function type(event) {
    // Only printable single characters (ignores modifier combos & shortcuts)
    if (
      event.key &&
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
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
    // Embeddable full-page variant of the CodePen demo
    previewUrl: "https://cdpn.io/alimadhibujar/fullpage/mybzoNg",
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

// Elements that currently carry an inline view-transition-name for the
// project-thumbnail expansion (tracked so we only clean up what we set)
let vtThumbElements = [];

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

  // Media / Live Preview
  modalMedia.innerHTML = "";
  renderProjectPreview(data);

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

// ============ Project Live Preview ============
const DEVICE_MODES = {
  desktop: { width: null },
  tablet: { width: 768 },
  mobile: { width: 390 },
};
const PREVIEW_LOAD_TIMEOUT = 4000; // ms before falling back to the screenshot

/**
 * Renders an interactive live-site preview inside the modal media area:
 * a mock browser chrome (traffic lights + URL pill + device toggles)
 * wrapping an iframe of the project's live URL. Falls back to the static
 * screenshot if the site blocks framing / fails to load in time.
 */
function renderProjectPreview(data) {
  const previewUrl = data.previewUrl || data.live;

  // No embeddable URL available → plain static media
  if (!previewUrl) {
    appendStaticMedia(data);
    return;
  }

  modalMedia.classList.add("has-preview");

  const shell = document.createElement("div");
  shell.className = "preview-shell";

  // --- Browser chrome bar ---
  const chrome = document.createElement("div");
  chrome.className = "preview-chrome";
  chrome.innerHTML = `
    <span class="preview-dots" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="preview-url" title="${previewUrl}">${getHostname(
      previewUrl,
    )}</span>
    <span class="preview-devices">
      <button type="button" class="preview-device active" data-mode="desktop"
        aria-label="Desktop preview" title="Desktop"><i class="fa fa-desktop"></i></button>
      <button type="button" class="preview-device" data-mode="tablet"
        aria-label="Tablet preview" title="Tablet"><i class="fa fa-tablet"></i></button>
      <button type="button" class="preview-device" data-mode="mobile"
        aria-label="Mobile preview" title="Mobile"><i class="fa fa-mobile"></i></button>
      <a class="preview-open" href="${data.live || previewUrl}" target="_blank"
        rel="noopener" aria-label="Open live site in a new tab" title="Open in new tab">
        <i class="fa fa-external-link"></i>
      </a>
    </span>`;

  // --- Viewport with iframe ---
  const viewport = document.createElement("div");
  viewport.className = "preview-viewport";

  const loader = document.createElement("div");
  loader.className = "preview-loader";
  loader.innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>';

  const iframe = document.createElement("iframe");
  iframe.className = "preview-frame";
  iframe.src = previewUrl;
  iframe.title = `${data.title} live preview`;
  iframe.loading = "lazy";
  iframe.allow = "fullscreen";

  viewport.append(loader, iframe);
  shell.append(chrome, viewport);
  modalMedia.appendChild(shell);

  // Loading state → success, or fallback after timeout
  let loaded = false;
  iframe.addEventListener("load", () => {
    loaded = true;
    loader.remove();
  });
  const failTimer = setTimeout(() => {
    if (!loaded) showPreviewFallback(data);
  }, PREVIEW_LOAD_TIMEOUT);

  // --- Device switching ---
  chrome.querySelectorAll(".preview-device").forEach((btn) => {
    btn.addEventListener("click", () => {
      chrome
        .querySelectorAll(".preview-device")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const mode = DEVICE_MODES[btn.dataset.mode] || DEVICE_MODES.desktop;
      const narrow = Boolean(mode.width);
      viewport.classList.toggle("is-narrow", narrow);
      viewport.style.setProperty(
        "--device-width",
        narrow ? `${mode.width}px` : "100%",
      );
    });
  });

  // Stop pending fallback timer if the modal closes mid-load
  modal.addEventListener("modal-closed", () => clearTimeout(failTimer), {
    once: true,
  });
}

/** Static media fallback (original image/video behaviour). */
function appendStaticMedia(data) {
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
}

/** Graceful fallback: screenshot + hint when the live site can't be embedded. */
function showPreviewFallback(data) {
  modalMedia.innerHTML = "";
  modalMedia.classList.remove("has-preview");

  const wrap = document.createElement("div");
  wrap.className = "preview-fallback";

  if (data.media?.src) {
    const img = document.createElement("img");
    img.src = data.media.src;
    img.alt = data.media.alt || data.title;
    wrap.appendChild(img);
  }

  const note = document.createElement("p");
  note.textContent = "Live preview unavailable here — ";
  const link = document.createElement("a");
  link.href = data.live || "#";
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "open it in a new tab";
  note.appendChild(link);
  note.appendChild(document.createTextNode("."));
  wrap.appendChild(note);

  modalMedia.appendChild(wrap);
}

function getHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function openProjectModal(projectId) {
  const data = projectsData[projectId];
  if (!modal || !data) return;

  fillModal(data);

  // Set view-transition-name for thumbnail expansion effect.
  // NOTE: view-transition-name is an inline *style* property, not an HTML
  // attribute, so we look up the element by id / data-project instead.
  const thumbnail =
    document.getElementById(projectId) ||
    document.querySelector(`a[data-project="${projectId}"]`);
  const modalImg = modalMedia?.querySelector("img");

  vtThumbElements = [];
  if (thumbnail && modalImg) {
    thumbnail.style.viewTransitionName = `project-${projectId}-thumb`;
    modalImg.style.viewTransitionName = `project-${projectId}-thumb`;
    vtThumbElements.push(thumbnail, modalImg);
  }

  // Use view transition if supported
  if (document.startViewTransition) {
    document.documentElement.classList.add("spa-transition");
    const transition = document.startViewTransition(() => {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
    });
    transition.finished.finally(() => {
      document.documentElement.classList.remove("spa-transition");
    });
  } else {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }
}

function closeProjectModal() {
  if (!modal) return;

  if (document.startViewTransition) {
    document.documentElement.classList.add("spa-transition");
    const transition = document.startViewTransition(() => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    });
    transition.finished.finally(() => {
      document.documentElement.classList.remove("spa-transition");
    });
  } else {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  // Notify listeners (e.g. live-preview timers) that the modal is closing
  modal.dispatchEvent(new CustomEvent("modal-closed"));

  // Cleanup view-transition-names after transition — only the elements we
  // set them on, not every element with an inline style
  setTimeout(() => {
    vtThumbElements.forEach((el) => {
      el.style.viewTransitionName = "";
    });
    vtThumbElements = [];
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

// ============ Interactive 3D Cube Stage, Dock & HUD ============

(function initProjectsShowcase() {
  const projectOrder = ["side1", "side2", "side3", "side4", "side5"];

  // Exact rotation angles that bring each face straight toward the camera
  const faceAngles = {
    side1: { rx: -90, ry: 0 }, // Top face tilted forward
    side2: { rx: -12, ry: 90 }, // Left face rotated front
    side3: { rx: -12, ry: 0 }, // Front face
    side4: { rx: -12, ry: -90 }, // Right face rotated front
    side5: { rx: -12, ry: -180 }, // Back face rotated front
  };

  const cubeWrap = document.getElementById("wrapD3Cube");
  const cube = document.getElementById("D3Cube");
  const autoToggleBtn = document.getElementById("cubeAutoToggle");
  const dockPills = document.querySelectorAll(".dock-pill");

  // HUD elements
  const hudIndex = document.getElementById("hudIndex");
  const hudTitle = document.getElementById("hudTitle");
  const hudDesc = document.getElementById("hudDesc");
  const hudTech = document.getElementById("hudTech");
  const hudPreviewBtn = document.getElementById("hudPreviewBtn");
  const hudLiveLink = document.getElementById("hudLiveLink");
  const hudRepoLink = document.getElementById("hudRepoLink");
  const hudPrev = document.getElementById("hudPrev");
  const hudNext = document.getElementById("hudNext");

  let activeIndex = 0;
  let rotX = -22;
  let rotY = -38;
  let isAutoPlaying = true;
  let autoTimer = null;
  let wasDragged = false;

  function applyCubeTransform() {
    if (!cube) return;
    cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(0deg)`;
  }

  function updateHUD(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    const idx = projectOrder.indexOf(projectId);
    if (idx !== -1) activeIndex = idx;

    if (hudIndex) {
      hudIndex.textContent = `0${activeIndex + 1} / 0${projectOrder.length}`;
    }
    if (hudTitle) hudTitle.textContent = data.title;
    if (hudDesc) hudDesc.textContent = data.desc;

    if (hudTech) {
      hudTech.innerHTML = "";
      (data.tech || []).forEach((t) => hudTech.appendChild(createTechChip(t)));
    }

    if (hudLiveLink) {
      hudLiveLink.href = data.live || "#";
      hudLiveLink.style.display = data.live ? "" : "none";
    }
    if (hudRepoLink) {
      hudRepoLink.href = data.repo || "#";
      hudRepoLink.style.display = data.repo ? "" : "none";
    }

    // Highlight matching dock pill
    dockPills.forEach((pill) => {
      const isMatch = pill.dataset.projectId === projectId;
      pill.classList.toggle("active", isMatch);
      pill.setAttribute("aria-selected", String(isMatch));
    });
  }

  function focusProject(projectId, { syncSwiper = true } = {}) {
    const target = faceAngles[projectId];
    if (target) {
      rotX = target.rx;
      rotY = target.ry;
      applyCubeTransform();
    }
    updateHUD(projectId);

    // If on mobile and Swiper is initialized, slide it to the matching face
    if (syncSwiper && window.projectsSwiper) {
      const mapItem = swiperMap.find((m) => m.id === projectId);
      if (
        mapItem &&
        window.projectsSwiper.activeIndex !== mapItem.selectorIndex
      ) {
        window.projectsSwiper.slideTo(mapItem.selectorIndex);
      }
    }
  }

  function stepProject(delta) {
    const nextIdx =
      (activeIndex + delta + projectOrder.length) % projectOrder.length;
    focusProject(projectOrder[nextIdx]);
  }

  // --- Auto-Tour Controller ---
  function setAutoPlay(playing) {
    isAutoPlaying = playing;
    clearInterval(autoTimer);
    if (autoToggleBtn) {
      autoToggleBtn.classList.toggle("is-playing", playing);
      const icon = autoToggleBtn.querySelector("i");
      if (icon) icon.className = playing ? "fa fa-pause" : "fa fa-play";
    }
    if (playing) {
      autoTimer = setInterval(() => {
        // Pause auto-tour if modal is open
        if (modal?.classList.contains("is-open")) return;
        stepProject(1);
      }, 3800);
    }
  }

  autoToggleBtn?.addEventListener("click", () => {
    setAutoPlay(!isAutoPlaying);
  });

  // Pause auto-tour while hovering over the cube, resume on leave
  cubeWrap?.addEventListener("mouseenter", () => clearInterval(autoTimer));
  cubeWrap?.addEventListener("mouseleave", () => {
    if (isAutoPlaying) setAutoPlay(true);
  });

  // --- Pointer Drag-to-Rotate on Desktop Cube ---
  if (cubeWrap && cube) {
    let isPointerDown = false;
    let startX = 0;
    let startY = 0;
    let startRotX = 0;
    let startRotY = 0;

    cubeWrap.addEventListener("pointerdown", (e) => {
      isPointerDown = true;
      wasDragged = false;
      startX = e.clientX;
      startY = e.clientY;
      startRotX = rotX;
      startRotY = rotY;
      cube.classList.add("is-dragging");
    });

    window.addEventListener("pointermove", (e) => {
      if (!isPointerDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (Math.hypot(dx, dy) > 6) {
        wasDragged = true;
        if (isAutoPlaying) setAutoPlay(false);
      }

      if (wasDragged) {
        rotY = startRotY + dx * 0.55;
        rotX = Math.max(-95, Math.min(95, startRotX - dy * 0.55));
        applyCubeTransform();
      }
    });

    window.addEventListener("pointerup", () => {
      if (!isPointerDown) return;
      isPointerDown = false;
      cube.classList.remove("is-dragging");
    });
  }

  // --- Wire Desktop Cube Faces (Click opens modal unless user was dragging) ---
  projectOrder.forEach((id) => {
    const face = document.getElementById(id);
    if (!face) return;

    face.addEventListener("click", (e) => {
      e.preventDefault();
      if (wasDragged) {
        wasDragged = false;
        return;
      }
      focusProject(id);
      openProjectModal(id);
    });
  });

  // --- Wire Dock Pills & HUD Buttons ---
  dockPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      setAutoPlay(false);
      focusProject(pill.dataset.projectId);
    });
  });

  hudPrev?.addEventListener("click", () => {
    setAutoPlay(false);
    stepProject(-1);
  });

  hudNext?.addEventListener("click", () => {
    setAutoPlay(false);
    stepProject(1);
  });

  hudPreviewBtn?.addEventListener("click", () => {
    openProjectModal(projectOrder[activeIndex]);
  });

  // --- Wire Mobile Swiper Slides & Sync with HUD ---
  const slides = document.querySelectorAll(".swiper-container .swiper-slide");
  slides.forEach((slide, idx) => {
    const anchor = slide.querySelector("a");
    if (anchor) {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const map = swiperMap.find((m) => m.selectorIndex === idx);
        if (map?.id) {
          updateHUD(map.id);
          openProjectModal(map.id);
        }
      });
    }
  });

  window.addEventListener("project-swiper-change", (e) => {
    const map = swiperMap.find((m) => m.selectorIndex === e.detail?.index);
    if (map?.id) {
      focusProject(map.id, { syncSwiper: false });
    }
  });

  // Initialize initial state
  focusProject("side1", { syncSwiper: false });
  setAutoPlay(true);
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
      document.documentElement.classList.add("spa-transition");
      const transition = document.startViewTransition(scrollToSection);
      transition.finished.finally(() => {
        document.documentElement.classList.remove("spa-transition");
      });
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
