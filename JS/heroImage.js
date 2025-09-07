import { imgData } from "./dataImage.js";

document.addEventListener("DOMContentLoaded", () => {
  let renderer, scene, camera, points;
  const samplingInterval = 1;
  const centerVector = new THREE.Vector3(0, 0, 0);

  let targetPositions = null; // clear image positions (centered & scaled)
  let startPositions = null; // scattered positions (used for reverse drag effect)
  let currentPositions = null; // current positions for the point cloud
  let originalColors = null; // store original colors for restoration
  let currentColors = null; // current colors for dynamic effects

  // For the initial load animation (scatter -> clear)
  let animationStartTime = null;
  let loadAnimationDone = false;

  // Drag-related variables for reverse (clear -> scatter) animation
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let currentDragDelta = { x: 0, y: 0 };
  let initialDragDelta = { x: 0, y: 0 }; // To store drag delta at release start
  let currentDragProgress = 0; // 0 = clear image, 1 = fully scattered state
  let dragReleaseAnimating = false;
  let dragReleaseStartTime = null;
  const dragThreshold = 300; // drag distance (px) for full scatter effect
  const dragReleaseDuration = 700; // ms for the release animation

  // Vortex effect parameters
  const vortexStrength = 0.8; // Controls the intensity of the swirl
  const vortexRadius = 300; // Effective radius of the vortex
  const depthFactor = 60; // How much the particles move in Z direction during drag
  const dragDecayFactor = 0.92; // Decay factor for smooth animation when released

  // Tilt-related variables for mouseover effect
  let mouseX = 0; // Normalized X position [-1, 1]
  let mouseY = 0; // Normalized Y position [-1, 1]
  let mouseWorldX = 0; // Mouse position in world coordinates
  let mouseWorldY = 0;
  const maxTiltAngle = 20; // Maximum tilt in degrees

  // Magnetic cursor effect
  const magneticRadius = 120; // Radius of magnetic influence
  const magneticStrength = 0.3; // Strength of magnetic pull
  let isMagneticActive = false;

  // Wave/Ripple effect
  let waveAnimations = []; // Array to track multiple wave animations
  const waveSpeed = 0.8; // Speed of wave propagation
  const waveMaxRadius = 400; // Maximum radius of wave
  const waveStrength = 30; // Strength of wave displacement

  // Breathing animation
  const breathingSpeed = 0.001; // Speed of breathing animation
  const breathingAmplitude = 5; // Amplitude of breathing effect

  // Particle trail effect
  let particleHistory = [];
  const historyLength = 5; // Number of history frames to keep
  let trailOpacity = 0; // Current trail opacity (increases during movement)

  // Natural color enhancement (subtle glow/brightness)
  let colorEnhancement = 0; // Amount of color enhancement (0 to 1)
  const colorEnhanceSpeed = 0.03; // Speed of color transition
  const maxBrightnessBoost = 0.15; // Maximum brightness increase (subtle)
  const warmthFactor = 0.05; // Slight warm tint during interaction

  // To scale the clear image to max-width=400px and max-height=397px
  let imgWidth = 0;
  let imgHeight = 0;
  let imageScale = 1; // computed scale factor

  const init = () => {
    const canvas = document.getElementById("heroImage");
    // Set consistent canvas dimensions
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight || canvas.width * (9 / 16);

    const ww = window.innerWidth;
    const wh = window.innerHeight;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(ww, wh);
    renderer.setPixelRatio(window.devicePixelRatio);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, ww / wh, 0.1, 2000);
    camera.position.set(0, 0, 500);
    camera.lookAt(centerVector);
    scene.add(camera);

    const image = new Image();
    image.onload = () => {
      imgWidth = image.width;
      imgHeight = image.height;
      createPointCloud(getImageData(image));
      // Start load animation: from scattered (startPositions) to clear (targetPositions)
      animationStartTime = performance.now();
      requestAnimationFrame(render);
    };
    image.onerror = () => {
      console.error("Error loading image!");
    };
    image.src = imgData;

    window.addEventListener("resize", onResize, false);
    setupInteractionEvents(canvas);
  };

  const getImageData = (image) => {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = image.width;
    tempCanvas.height = image.height;
    const ctx = tempCanvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    return ctx.getImageData(0, 0, image.width, image.height);
  };

  const createPointCloud = (imagedata) => {
    const positions = [];
    const colors = [];
    // Loop through the image data sampling every N pixels.
    for (let y = 0; y < imagedata.height; y += samplingInterval) {
      for (let x = 0; x < imagedata.width; x += samplingInterval) {
        const alphaIndex = (x + imagedata.width * y) * 4 + 3;
        if (imagedata.data[alphaIndex] > 0) {
          // Calculate clear image positions centered at (0,0)
          const px = x - imagedata.width / 2;
          const py = -y + imagedata.height / 2;
          const pz = 0;
          positions.push(px, py, pz);
          const r = imagedata.data[(x + imagedata.width * y) * 4] / 255;
          const g = imagedata.data[(x + imagedata.width * y) * 4 + 1] / 255;
          const b = imagedata.data[(x + imagedata.width * y) * 4 + 2] / 255;
          colors.push(r, g, b);
        }
      }
    }
    // Compute scale factor so that the clear image fits within 400px x 397px.
    imageScale = Math.min(400 / imagedata.width, 360 / imagedata.height);
    for (let i = 0; i < positions.length; i++) {
      positions[i] *= imageScale;
    }

    // Set targetPositions to the clear (centered & scaled) positions.
    targetPositions = new Float32Array(positions);
    // Create startPositions for the scattered state.
    startPositions = new Float32Array(positions.length);
    currentPositions = new Float32Array(positions.length);
    // Store original colors and create current colors array
    originalColors = new Float32Array(colors);
    currentColors = new Float32Array(colors);

    // Initialize particle history for trail effect
    for (let i = 0; i < historyLength; i++) {
      particleHistory.push(new Float32Array(positions.length));
    }

    // Scatter range is relative to the clear image size.
    const scatterRange = 500 * imageScale;
    for (let i = 0; i < positions.length; i++) {
      startPositions[i] = positions[i] + (Math.random() - 0.5) * scatterRange;
      currentPositions[i] = startPositions[i];
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(currentPositions, 3)
    );
    geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(currentColors, 3)
    );
    geometry.computeVertexNormals();

    const material = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      sizeAttenuation: true,
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);
  };

  const onResize = () => {
    const canvas = document.getElementById("heroImage");
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    renderer.setSize(ww, wh);
    camera.aspect = ww / wh;
    camera.updateProjectionMatrix();
  };

  // Convert screen coordinates to world coordinates
  const screenToWorld = (screenX, screenY) => {
    const vector = new THREE.Vector3(screenX, -screenY, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    return { x: pos.x, y: pos.y };
  };

  // Setup mouse, touch, and click events for all interactions
  const setupInteractionEvents = (canvas) => {
    // Click event for wave ripple effect
    canvas.addEventListener("click", (e) => {
      if (!loadAnimationDone) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const clickY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      const worldPos = screenToWorld(clickX, clickY);

      // Add new wave animation
      waveAnimations.push({
        centerX: worldPos.x,
        centerY: worldPos.y,
        startTime: performance.now(),
        radius: 0,
      });

      // Limit number of concurrent waves
      if (waveAnimations.length > 5) {
        waveAnimations.shift();
      }
    });

    canvas.addEventListener("mousedown", (e) => {
      isDragging = true;
      dragReleaseAnimating = false; // cancel any release animation
      dragStart = { x: e.clientX, y: e.clientY };
      currentDragDelta = { x: 0, y: 0 };
      isMagneticActive = false; // Disable magnetic effect during drag
    });

    canvas.addEventListener("mousemove", (e) => {
      if (isDragging) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        currentDragDelta = { x: dx, y: dy };
        const dragDistance = Math.sqrt(dx * dx + dy * dy);
        currentDragProgress = Math.min(1, dragDistance / dragThreshold);
      }
      // Update mouse position for tilt and magnetic effects
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      // Convert to world coordinates for magnetic effect
      const worldPos = screenToWorld(mouseX, -mouseY);
      mouseWorldX = worldPos.x;
      mouseWorldY = worldPos.y;

      // Enable magnetic effect when not dragging
      if (!isDragging && loadAnimationDone) {
        isMagneticActive = true;
      }
    });

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      // Capture drag delta at release for smooth return
      initialDragDelta.x = currentDragDelta.x;
      initialDragDelta.y = currentDragDelta.y;
      dragReleaseAnimating = true;
      dragReleaseStartTime = performance.now();
      isMagneticActive = true; // Re-enable magnetic effect
    };

    canvas.addEventListener("mouseup", endDrag, false);
    canvas.addEventListener("mouseleave", () => {
      endDrag();
      // Reset tilt and magnetic effect when mouse leaves canvas
      mouseX = 0;
      mouseY = 0;
      isMagneticActive = false;
    });

    canvas.addEventListener("mouseenter", () => {
      if (!isDragging && loadAnimationDone) {
        isMagneticActive = true;
      }
    });

    // Setup touch events for mobile/tablet support
    canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length > 0) {
        isDragging = true;
        dragReleaseAnimating = false;
        const touch = e.touches[0];
        dragStart = { x: touch.clientX, y: touch.clientY };
        currentDragDelta = { x: 0, y: 0 };
        isMagneticActive = false;

        // Trigger wave on touch
        const rect = canvas.getBoundingClientRect();
        const touchX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const touchY = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        const worldPos = screenToWorld(touchX, touchY);
        waveAnimations.push({
          centerX: worldPos.x,
          centerY: worldPos.y,
          startTime: performance.now(),
          radius: 0,
        });
      }
    });

    canvas.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const dx = touch.clientX - dragStart.x;
      const dy = touch.clientY - dragStart.y;
      currentDragDelta = { x: dx, y: dy };
      const dragDistance = Math.sqrt(dx * dx + dy * dy);
      currentDragProgress = Math.min(1, dragDistance / dragThreshold);
      // Update mouse position for tilt
      const rect = canvas.getBoundingClientRect();
      mouseX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = ((touch.clientY - rect.top) / rect.height) * 2 - 1;
    });

    canvas.addEventListener("touchend", endDrag, false);
  };

  // Update particle history for trail effect
  const updateParticleHistory = () => {
    // Shift history arrays
    const oldestHistory = particleHistory.shift();
    for (let i = 0; i < currentPositions.length; i++) {
      oldestHistory[i] = currentPositions[i];
    }
    particleHistory.push(oldestHistory);
  };

  // Apply natural color enhancement (subtle brightness and warmth)
  const applyNaturalColorEnhancement = (intensity) => {
    for (let i = 0; i < originalColors.length; i += 3) {
      const r = originalColors[i];
      const g = originalColors[i + 1];
      const b = originalColors[i + 2];

      // Calculate luminance for adaptive enhancement
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

      // Apply subtle brightness boost (more for darker colors, less for bright ones)
      const brightnessBoost =
        maxBrightnessBoost * intensity * (1 - luminance * 0.5);

      // Add slight warm tint (increase red/yellow slightly)
      currentColors[i] = Math.min(
        1,
        r + brightnessBoost + warmthFactor * intensity
      ); // Red
      currentColors[i + 1] = Math.min(
        1,
        g + brightnessBoost + warmthFactor * intensity * 0.7
      ); // Green (less for warmth)
      currentColors[i + 2] = Math.min(1, b + brightnessBoost); // Blue (no warmth added)
    }
  };

  const render = () => {
    requestAnimationFrame(render);
    const now = performance.now();

    // Initial load animation (scatter to clear)
    if (!isDragging && !dragReleaseAnimating && !loadAnimationDone) {
      const elapsed = now - animationStartTime;
      const progress = Math.min(elapsed / 2000, 1);
      for (let i = 0; i < currentPositions.length; i++) {
        currentPositions[i] =
          startPositions[i] * (1 - progress) + targetPositions[i] * progress;
      }
      if (progress === 1) {
        loadAnimationDone = true;
      }
      points.geometry.attributes.position.array.set(currentPositions);
      points.geometry.attributes.position.needsUpdate = true;
    }

    // After load animation is done, handle all effects
    if (loadAnimationDone) {
      // Start with target positions
      for (let i = 0; i < currentPositions.length; i++) {
        currentPositions[i] = targetPositions[i];
      }

      // Apply breathing animation (idle state)
      const breathingOffset =
        Math.sin(now * breathingSpeed) * breathingAmplitude;
      for (let i = 2; i < currentPositions.length; i += 3) {
        currentPositions[i] += breathingOffset;
      }

      // Apply wave ripple effects
      waveAnimations = waveAnimations.filter((wave) => {
        const waveAge = now - wave.startTime;
        wave.radius = waveAge * waveSpeed;

        if (wave.radius > waveMaxRadius) {
          return false; // Remove completed waves
        }

        const waveProgress = wave.radius / waveMaxRadius;
        const waveAmplitude =
          waveStrength * (1 - waveProgress) * Math.sin(waveProgress * Math.PI);

        for (let i = 0; i < currentPositions.length; i += 3) {
          const dx = targetPositions[i] - wave.centerX;
          const dy = targetPositions[i + 1] - wave.centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Create ring-like wave
          const waveDistance = Math.abs(distance - wave.radius);
          if (waveDistance < 50) {
            const waveFactor = 1 - waveDistance / 50;
            const waveEffect = waveAmplitude * waveFactor;

            // Displace particles perpendicular to wave
            currentPositions[i + 2] += waveEffect;

            // Add slight radial displacement
            const radialFactor = waveEffect * 0.2;
            currentPositions[i] += (dx / distance) * radialFactor;
            currentPositions[i + 1] += (dy / distance) * radialFactor;
          }
        }

        return true; // Keep active waves
      });

      // Apply magnetic cursor effect
      if (isMagneticActive && !isDragging) {
        for (let i = 0; i < currentPositions.length; i += 3) {
          const dx = currentPositions[i] - mouseWorldX;
          const dy = currentPositions[i + 1] - mouseWorldY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < magneticRadius && distance > 0) {
            const falloff = 1 - distance / magneticRadius;
            const magneticForce = falloff * falloff * magneticStrength;

            // Pull particles towards cursor
            currentPositions[i] -= (dx / distance) * magneticForce * 10;
            currentPositions[i + 1] -= (dy / distance) * magneticForce * 10;
            currentPositions[i + 2] += falloff * 5; // Slight Z displacement
          }
        }
      }

      // Handle drag vortex effect
      if (isDragging || dragReleaseAnimating) {
        // Calculate vortex center in normalized coordinates
        const dragCenterX = currentDragDelta.x;
        const dragCenterY = currentDragDelta.y;
        const dragMagnitude = Math.sqrt(
          dragCenterX * dragCenterX + dragCenterY * dragCenterY
        );

        // Get effective drag progress
        if (dragReleaseAnimating) {
          const releaseElapsed = now - dragReleaseStartTime;
          const releaseProgress = Math.min(
            releaseElapsed / dragReleaseDuration,
            1
          );
          currentDragProgress = (1 - releaseProgress) * dragDecayFactor;
          currentDragDelta.x = initialDragDelta.x * (1 - releaseProgress);
          currentDragDelta.y = initialDragDelta.y * (1 - releaseProgress);
          if (releaseProgress === 1) {
            dragReleaseAnimating = false;
            currentDragDelta = { x: 0, y: 0 };
          }
        }

        // Apply vortex swirl effect to each point
        for (let i = 0; i < currentPositions.length; i += 3) {
          // Get target position (clear image)
          const targetX = targetPositions[i];
          const targetY = targetPositions[i + 1];
          const targetZ = targetPositions[i + 2];

          // Calculate distance from point to drag center
          const dx = targetX - dragCenterX * 0.25; // Scale down drag influence
          const dy = targetY - dragCenterY * 0.25;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Calculate vortex influence based on distance (stronger near center)
          const falloff = Math.max(0, 1 - distance / vortexRadius);
          const vortexInfluence =
            falloff * currentDragProgress * vortexStrength;

          // Calculate point angle relative to drag center
          const pointAngle = Math.atan2(dy, dx);

          // Determine rotation direction based on drag motion
          const dragDirectionAngle = Math.atan2(
            currentDragDelta.y,
            currentDragDelta.x
          );

          // Calculate the angle between the point and drag direction
          const angleDifference = Math.atan2(
            Math.sin(pointAngle - dragDirectionAngle),
            Math.cos(pointAngle - dragDirectionAngle)
          );

          // Set direction multiplier based on which side of the drag vector the point is on
          const directionMultiplier = angleDifference > 0 ? 1 : -1;

          // Calculate swirl angle offset based on distance and drag magnitude
          const swirlAngle =
            directionMultiplier * dragMagnitude * 0.01 * vortexInfluence;

          // Apply rotation to point
          const rotatedAngle = pointAngle + swirlAngle;
          const rotationRadius = distance * (1 + vortexInfluence * 0.2); // Slight outward motion

          // Calculate new position with vortex effect applied
          currentPositions[i] =
            targetX +
            (Math.cos(rotatedAngle) - Math.cos(pointAngle)) *
              rotationRadius *
              vortexInfluence;
          currentPositions[i + 1] =
            targetY +
            (Math.sin(rotatedAngle) - Math.sin(pointAngle)) *
              rotationRadius *
              vortexInfluence;

          // Add depth movement (Z-axis) to create 3D effect
          const zOffset =
            falloff *
            currentDragProgress *
            depthFactor *
            (Math.sin(distance * 0.05 + now * 0.001) * 0.5 + 0.5);
          currentPositions[i + 2] = targetZ + zOffset;

          // Apply some scatter based on distance from center (weaker than the original)
          const scatterX = (startPositions[i] - targetX) * 0.3;
          const scatterY = (startPositions[i + 1] - targetY) * 0.3;
          const scatterZ = (startPositions[i + 2] - targetZ) * 0.3;

          currentPositions[i] += scatterX * currentDragProgress * falloff;
          currentPositions[i + 1] += scatterY * currentDragProgress * falloff;
          currentPositions[i + 2] += scatterZ * currentDragProgress * falloff;
        }

        // Increase color enhancement during drag
        colorEnhancement = Math.min(1, colorEnhancement + colorEnhanceSpeed);
      } else if (!isMagneticActive) {
        // Apply tilt effect on mouseover (when not dragging or magnetic)
        const tiltY = mouseX * maxTiltAngle; // Rotate around Y-axis
        const tiltX = -mouseY * maxTiltAngle; // Rotate around X-axis
        const rotationMatrixX = new THREE.Matrix4().makeRotationX(
          THREE.MathUtils.degToRad(tiltX)
        );
        const rotationMatrixY = new THREE.Matrix4().makeRotationY(
          THREE.MathUtils.degToRad(tiltY)
        );
        const totalRotationMatrix = new THREE.Matrix4().multiplyMatrices(
          rotationMatrixY,
          rotationMatrixX
        );

        for (let i = 0; i < currentPositions.length; i += 3) {
          const targetVec = new THREE.Vector3(
            currentPositions[i],
            currentPositions[i + 1],
            currentPositions[i + 2]
          );
          const rotatedVec = targetVec
            .clone()
            .applyMatrix4(totalRotationMatrix);
          currentPositions[i] = rotatedVec.x;
          currentPositions[i + 1] = rotatedVec.y;
          currentPositions[i + 2] = rotatedVec.z;
        }
      }

      // Update color enhancement
      if (isDragging || isMagneticActive || waveAnimations.length > 0) {
        colorEnhancement = Math.min(1, colorEnhancement + colorEnhanceSpeed);
      } else {
        colorEnhancement = Math.max(0, colorEnhancement - colorEnhanceSpeed);
      }

      // Apply natural color enhancement
      if (colorEnhancement > 0) {
        applyNaturalColorEnhancement(colorEnhancement);
        points.geometry.attributes.color.array.set(currentColors);
        points.geometry.attributes.color.needsUpdate = true;
      } else {
        // Reset to original colors when no enhancement
        points.geometry.attributes.color.array.set(originalColors);
        points.geometry.attributes.color.needsUpdate = true;
      }

      // Update particle trail opacity based on movement
      const movement =
        Math.abs(currentDragDelta.x) + Math.abs(currentDragDelta.y);
      if (movement > 5 || waveAnimations.length > 0) {
        trailOpacity = Math.min(0.5, trailOpacity + 0.05);
      } else {
        trailOpacity = Math.max(0, trailOpacity - 0.02);
      }

      // Update material opacity for trail effect
      points.material.opacity = 1 - trailOpacity * 0.3;

      // Update particle history for next frame
      if (trailOpacity > 0.01) {
        updateParticleHistory();
      }

      // Update point cloud geometry
      points.geometry.attributes.position.array.set(currentPositions);
      points.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  };

  init();
});
