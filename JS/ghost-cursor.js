import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.18.2/+esm";
import { vertexShaderSource, fragmentShaderSource } from "./ghost-shaders.js";

document.addEventListener("DOMContentLoaded", () => {
  // Get the ghost canvas element and set up initial mouse state
  const canvasEl = document.querySelector("#ghost");
  const mouseThreshold = 0.1;
  const devicePixelRatio = Math.min(window.devicePixelRatio, 2);
  const mouse = {
    x: 0.25 * window.innerWidth,
    y: 0.8 * window.innerHeight,
    tX: 0.25 * window.innerWidth,
    tY: 0.8 * window.innerHeight,
    moving: false,
    controlsPadding: 0,
  };

  // Effect parameters
  const params = {
    size: 0.03,
    tail: {
      dotsNumber: 25,
      spring: 1.4,
      friction: 0.3,
      gravity: 0,
    },
    smile: 1,
    mainColor: [0.98, 0.96, 0.96],
    borderColor: [0.2, 0.5, 0.7],
    isFlatColor: false,
    // Angry state parameters
    angry: {
      isAngry: false,
      targetSize: 0.03,
      targetSmile: 1,
      targetMainColor: [0.98, 0.96, 0.96],
      targetBorderColor: [0.2, 0.5, 0.7],
      transitionSpeed: 0.1,
      releaseStartTime: 0,
      releaseDuration: 500, // Duration to return to normal (ms)
    },
    // Curious state parameters (activates on link hover)
    curious: {
      isCurious: false,
      targetSize: 0.03,
      targetSmile: 1,
      targetMainColor: [0.98, 0.96, 0.96],
      targetBorderColor: [0.2, 0.5, 0.7],
      releaseStartTime: 0,
      releaseDuration: 300, // Shorter transition for quick hovers
    },
  };

  // Store original values for reset
  const originalParams = {
    size: params.size,
    smile: params.smile,
    mainColor: [...params.mainColor],
    borderColor: [...params.borderColor],
  };

  // Original values for moods - Updated for thinking expression
  const originalCuriousParams = {
    size: params.size * 0.8, // Slightly smaller for contemplative look
    smile: -0.02, // Slight frown/neutral expression for thinking
    mainColor: [1.0, 0.8, 0.3], // Golden yellow like the thinking emoji
    borderColor: [0.3, 0.6, 0.8], // Soft blue for curiosity
  };

  // Create an offscreen canvas for the trail texture
  const textureEl = document.createElement("canvas");
  const textureCtx = textureEl.getContext("2d");
  const pointerTrail = new Array(params.tail.dotsNumber);
  const dotSize = (i) =>
    params.size *
    window.innerHeight *
    (1 - 0.2 * Math.pow((3 * i) / params.tail.dotsNumber - 1, 2));

  for (let i = 0; i < params.tail.dotsNumber; i++) {
    pointerTrail[i] = {
      x: mouse.x,
      y: mouse.y,
      vx: 0,
      vy: 0,
      opacity: 0.04 + 0.3 * Math.pow(1 - i / params.tail.dotsNumber, 4),
      bordered: 0.6 * Math.pow(1 - i / params.tail.dotsNumber, 1),
      r: dotSize(i),
    };
  }

  let uniforms;
  const gl = initShader();
  createControls();
  setupDragEvents();
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  render();

  window.addEventListener("mousemove", (e) => {
    updateMousePosition(e.clientX, e.clientY);
  });
  window.addEventListener("touchmove", (e) => {
    updateMousePosition(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
  });
  window.addEventListener("click", (e) => {
    updateMousePosition(e.clientX, e.clientY);
  });

  let movingTimer = setTimeout(() => (mouse.moving = false), 300);

  function updateMousePosition(eX, eY) {
    mouse.moving = true;
    if (mouse.controlsPadding < 0) {
      mouse.moving = false;
    }
    clearTimeout(movingTimer);
    movingTimer = setTimeout(() => {
      mouse.moving = false;
    }, 300);

    mouse.tX = eX;
    const size = params.size * window.innerHeight;
    eY -= 0.6 * size;
    mouse.tY = eY > size ? eY : size;
    mouse.tY -= mouse.controlsPadding;
  }

  function setupDragEvents() {
    const heroImage = document.querySelector("#heroImage");
    if (!heroImage) return;

    // Function to make ghost angry
    function makeGhostAngry() {
      params.angry.isAngry = true;
      params.angry.releaseStartTime = 0;
      // Set angry appearance
      params.angry.targetSize = originalParams.size * 1.3; // Bigger when angry
      params.angry.targetSmile = -0.8; // Frowning
      params.angry.targetMainColor = [0.2, 0.4, 0.6]; // main color when angry
      params.angry.targetBorderColor = [0.8, 0.2, 0.1]; // border color when angry
    }

    // Function to start ghost calming down (for angry)
    function calmGhostDown() {
      if (params.angry.isAngry) {
        params.angry.releaseStartTime = performance.now();
        params.angry.isAngry = false;
        // Set target back to normal
        params.angry.targetSize = originalParams.size;
        params.angry.targetSmile = originalParams.smile;
        params.angry.targetMainColor = [...originalParams.mainColor];
        params.angry.targetBorderColor = [...originalParams.borderColor];
      }
    }

    // Function to make ghost curious (for link hover) - Updated for thinking expression
    function makeGhostCurious() {
      params.curious.isCurious = true;
      params.curious.releaseStartTime = 0;
      // Set curious/thinking appearance
      params.curious.targetSize = originalCuriousParams.size;
      params.curious.targetSmile = originalCuriousParams.smile;
      params.curious.targetMainColor = [...originalCuriousParams.mainColor];
      params.curious.targetBorderColor = [...originalCuriousParams.borderColor];
    }

    // Function to calm ghost from curious state
    function calmCuriousDown() {
      if (params.curious.isCurious) {
        params.curious.releaseStartTime = performance.now();
        params.curious.isCurious = false;
        // Set target back to normal
        params.curious.targetSize = originalParams.size;
        params.curious.targetSmile = originalParams.smile;
        params.curious.targetMainColor = [...originalParams.mainColor];
        params.curious.targetBorderColor = [...originalParams.borderColor];
      }
    }

    // Mouse drag events (angry)
    heroImage.addEventListener("mousedown", (e) => {
      makeGhostAngry();

      const handleMouseUp = () => {
        calmGhostDown();
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mouseup", handleMouseUp);
    });

    // Touch drag events (angry)
    heroImage.addEventListener("touchstart", (e) => {
      makeGhostAngry();

      const handleTouchEnd = () => {
        calmGhostDown();
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchend", handleTouchEnd);
    });

    // HTML5 drag events (angry)
    heroImage.addEventListener("dragstart", (e) => {
      makeGhostAngry();
    });

    heroImage.addEventListener("dragend", (e) => {
      calmGhostDown();
    });

    // Link hover events (curious)
    const links = document.querySelectorAll(
      'a[href*="#"], a[href="CV/cv.html"], .social-links a, #D3Cube a, .swiper-container a, .contact-text a, .animated-link, .modal__links a'
    );
    links.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        makeGhostCurious();
      });
      link.addEventListener("mouseleave", () => {
        calmCuriousDown();
      });
    });
  }

  function updateAngryState(currentTime) {
    let progress = 1;

    // If we're in release phase, calculate progress based on time
    if (!params.angry.isAngry && params.angry.releaseStartTime > 0) {
      const elapsed = currentTime - params.angry.releaseStartTime;
      progress = Math.max(0, 1 - elapsed / params.angry.releaseDuration);

      if (elapsed >= params.angry.releaseDuration) {
        params.angry.releaseStartTime = 0;
        progress = 0;
      }
    } else if (params.angry.isAngry) {
      // Still angry, maintain angry state
      progress = 1;
    } else {
      // Not angry and no release in progress
      progress = 0;
    }

    // Smooth interpolation using easing
    const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
    const invProgress = 1 - easeProgress;

    // Interpolate size
    params.size =
      params.angry.targetSize * easeProgress +
      originalParams.size * invProgress;

    // Interpolate smile
    params.smile =
      params.angry.targetSmile * easeProgress +
      originalParams.smile * invProgress;

    // Interpolate colors
    for (let i = 0; i < 3; i++) {
      params.mainColor[i] =
        params.angry.targetMainColor[i] * easeProgress +
        originalParams.mainColor[i] * invProgress;
      params.borderColor[i] =
        params.angry.targetBorderColor[i] * easeProgress +
        originalParams.borderColor[i] * invProgress;
    }

    // Update dot sizes if size changed
    for (let i = 0; i < params.tail.dotsNumber; i++) {
      pointerTrail[i].r = dotSize(i);
    }
  }

  function updateCuriousState(currentTime) {
    let progress = 1;

    // If we're in release phase, calculate progress based on time
    if (!params.curious.isCurious && params.curious.releaseStartTime > 0) {
      const elapsed = currentTime - params.curious.releaseStartTime;
      progress = Math.max(0, 1 - elapsed / params.curious.releaseDuration);

      if (elapsed >= params.curious.releaseDuration) {
        params.curious.releaseStartTime = 0;
        progress = 0;
      }
    } else if (params.curious.isCurious) {
      // Still curious, maintain state
      progress = 1;
    } else {
      // Not curious and no release in progress
      progress = 0;
    }

    // Smooth interpolation using easing
    const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
    const invProgress = 1 - easeProgress;

    // Interpolate size (only if not overridden by angry)
    if (!params.angry.isAngry) {
      params.size =
        params.curious.targetSize * easeProgress +
        originalParams.size * invProgress;
    }

    // Interpolate smile (only if not overridden by angry)
    if (!params.angry.isAngry) {
      params.smile =
        params.curious.targetSmile * easeProgress +
        originalParams.smile * invProgress;
    }

    // Interpolate colors (prioritize angry if active, else curious)
    const activeColorSource = params.angry.isAngry
      ? originalParams
      : originalCuriousParams;
    for (let i = 0; i < 3; i++) {
      if (!params.angry.isAngry) {
        params.mainColor[i] =
          params.curious.targetMainColor[i] * easeProgress +
          originalParams.mainColor[i] * invProgress;
        params.borderColor[i] =
          params.curious.targetBorderColor[i] * easeProgress +
          originalParams.borderColor[i] * invProgress;
      }
    }

    // Update dot sizes if size changed
    for (let i = 0; i < params.tail.dotsNumber; i++) {
      pointerTrail[i].r = dotSize(i);
    }
  }

  function initShader() {
    const vsSource = vertexShaderSource;
    const fsSource = fragmentShaderSource;
    const gl =
      canvasEl.getContext("webgl") || canvasEl.getContext("experimental-webgl");

    if (!gl) {
      alert("WebGL is not supported by your browser.");
    }

    function createShader(gl, sourceCode, type) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, sourceCode);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(
          "An error occurred compiling the shaders: " +
            gl.getShaderInfoLog(shader)
        );
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, vsSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, fsSource, gl.FRAGMENT_SHADER);

    function createShaderProgram(gl, vertexShader, fragmentShader) {
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(
          "Unable to initialize the shader program: " +
            gl.getProgramInfoLog(program)
        );
        return null;
      }
      return program;
    }

    const shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);
    uniforms = getUniforms(shaderProgram);
    function getUniforms(program) {
      let uniforms = [];
      let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        let uniformName = gl.getActiveUniform(program, i).name;
        uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
      }
      return uniforms;
    }

    const vertices = new Float32Array([
      -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0,
    ]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.useProgram(shaderProgram);
    const positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Create texture from offscreen canvas
    const canvasTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, canvasTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      textureEl
    );
    gl.uniform1i(uniforms.u_texture, 0);

    gl.uniform1f(uniforms.u_size, params.size);
    gl.uniform3f(
      uniforms.u_main_color,
      params.mainColor[0],
      params.mainColor[1],
      params.mainColor[2]
    );
    gl.uniform3f(
      uniforms.u_border_color,
      params.borderColor[0],
      params.borderColor[1],
      params.borderColor[2]
    );

    return gl;
  }

  function updateTexture() {
    textureCtx.fillStyle = "black";
    textureCtx.fillRect(0, 0, textureEl.width, textureEl.height);
    pointerTrail.forEach((p, pIdx) => {
      if (pIdx === 0) {
        p.x = mouse.x;
        p.y = mouse.y;
      } else {
        p.vx += (pointerTrail[pIdx - 1].x - p.x) * params.tail.spring;
        p.vx *= params.tail.friction;
        p.vy += (pointerTrail[pIdx - 1].y - p.y) * params.tail.spring;
        p.vy *= params.tail.friction;
        p.vy += params.tail.gravity;
        p.x += p.vx;
        p.y += p.vy;
      }
      const grd = textureCtx.createRadialGradient(
        p.x,
        p.y,
        p.r * p.bordered,
        p.x,
        p.y,
        p.r
      );
      grd.addColorStop(0, "rgba(255, 255, 255, " + p.opacity + ")");
      grd.addColorStop(1, "rgba(255, 255, 255, 0)");
      textureCtx.beginPath();
      textureCtx.fillStyle = grd;
      textureCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      textureCtx.fill();
    });
  }

  function render() {
    const currentTime = performance.now();

    // Update states before rendering
    updateAngryState(currentTime);
    updateCuriousState(currentTime);

    gl.uniform1f(uniforms.u_time, currentTime);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (mouse.moving && !params.angry.isAngry && !params.curious.isCurious) {
      params.smile -= 0.05;
      params.smile = Math.max(params.smile, -0.1);
      params.tail.gravity -= 10 * params.size;
      params.tail.gravity = Math.max(params.tail.gravity, 0);
    } else if (
      !params.angry.isAngry &&
      !params.curious.isCurious &&
      params.angry.releaseStartTime === 0 &&
      params.curious.releaseStartTime === 0
    ) {
      params.smile += 0.01;
      params.smile = Math.min(params.smile, 1);
      if (params.tail.gravity > 25 * params.size) {
        params.tail.gravity =
          (25 + 5 * (1 + Math.sin(0.002 * currentTime))) * params.size;
      } else {
        params.tail.gravity += params.size;
      }
    }

    mouse.x += (mouse.tX - mouse.x) * mouseThreshold;
    mouse.y += (mouse.tY - mouse.y) * mouseThreshold;

    // Update uniforms with current values (interpolated by moods)
    gl.uniform1f(uniforms.u_size, params.size);
    gl.uniform1f(uniforms.u_smile, params.smile);
    gl.uniform3f(
      uniforms.u_main_color,
      params.mainColor[0],
      params.mainColor[1],
      params.mainColor[2]
    );
    gl.uniform3f(
      uniforms.u_border_color,
      params.borderColor[0],
      params.borderColor[1],
      params.borderColor[2]
    );
    gl.uniform2f(
      uniforms.u_pointer,
      mouse.x / window.innerWidth,
      1.0 - mouse.y / window.innerHeight
    );
    gl.uniform2f(
      uniforms.u_target_pointer,
      mouse.tX / window.innerWidth,
      1.0 - mouse.tY / window.innerHeight
    );

    updateTexture();
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      textureEl
    );
    requestAnimationFrame(render);
  }

  function resizeCanvas() {
    canvasEl.width = window.innerWidth * devicePixelRatio;
    canvasEl.height = window.innerHeight * devicePixelRatio;
    textureEl.width = window.innerWidth;
    textureEl.height = window.innerHeight;
    gl.viewport(0, 0, canvasEl.width, canvasEl.height);
    gl.uniform1f(uniforms.u_ratio, canvasEl.width / canvasEl.height);
    for (let i = 0; i < params.tail.dotsNumber; i++) {
      pointerTrail[i].r = dotSize(i);
    }
  }

  function createControls() {
    const gui = new GUI();
    gui.close();
    gui.add(params, "size", 0.02, 0.3, 0.01).onChange((v) => {
      originalParams.size = v; // Update original value when manually changed
      for (let i = 0; i < params.tail.dotsNumber; i++) {
        pointerTrail[i].r = dotSize(i);
      }
      gl.uniform1f(uniforms.u_size, params.size);
    });
    gui.addColor(params, "mainColor").onChange((v) => {
      originalParams.mainColor = [...v]; // Update original value when manually changed
      gl.uniform3f(uniforms.u_main_color, v[0], v[1], v[2]);
    });
    const borderColorControl = gui
      .addColor(params, "borderColor")
      .onChange((v) => {
        originalParams.borderColor = [...v]; // Update original value when manually changed
        gl.uniform3f(uniforms.u_border_color, v[0], v[1], v[2]);
      });
    gui.add(params, "isFlatColor").onFinishChange((v) => {
      borderColorControl.disable(v);
      gl.uniform1f(uniforms.u_flat_color, v ? 1 : 0);
    });

    // Adjust ghost effect if the GUI is hovered
    const controlsEl = document.querySelector(".lil-gui");
    if (controlsEl) {
      controlsEl.addEventListener("mouseenter", () => {
        mouse.controlsPadding = -controlsEl.getBoundingClientRect().height;
      });
      controlsEl.addEventListener("mouseleave", () => {
        mouse.controlsPadding = 0;
      });
    }
  }
});
