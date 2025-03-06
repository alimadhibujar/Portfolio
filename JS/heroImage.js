// heroImage.js
import { imgData } from "./dataImage.js";

document.addEventListener("DOMContentLoaded", () => {
  let renderer, scene, camera, points;
  const samplingInterval = 1;
  const centerVector = new THREE.Vector3(0, 0, 0);

  let targetPositions = null; // clear image positions (centered & scaled)
  let startPositions = null; // scattered positions (used for reverse drag effect)
  let currentPositions = null; // current positions for the point cloud

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
  const maxTiltAngle = 20; // Maximum tilt in degrees

  // To scale the clear image to max-width=400px and max-height=397px
  let imgWidth = 0;
  let imgHeight = 0;
  let imageScale = 1; // computed scale factor

  const init = () => {
    const canvas = document.getElementById("heroImage");
    // Set canvas max dimensions
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.width * (9 / 16);

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
    setupDragEvents(canvas);
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
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const material = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
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

  // Setup mouse and touch events for drag and tilt interactions.
  const setupDragEvents = (canvas) => {
    canvas.addEventListener("mousedown", (e) => {
      isDragging = true;
      dragReleaseAnimating = false; // cancel any release animation
      dragStart = { x: e.clientX, y: e.clientY };
      currentDragDelta = { x: 0, y: 0 };
    });

    canvas.addEventListener("mousemove", (e) => {
      if (isDragging) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        currentDragDelta = { x: dx, y: dy };
        const dragDistance = Math.sqrt(dx * dx + dy * dy);
        currentDragProgress = Math.min(1, dragDistance / dragThreshold);
      }
      // Update mouse position for tilt effect even during drag (though tilt won't apply)
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    });

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      // Capture drag delta at release for smooth return
      initialDragDelta.x = currentDragDelta.x;
      initialDragDelta.y = currentDragDelta.y;
      dragReleaseAnimating = true;
      dragReleaseStartTime = performance.now();
    };

    canvas.addEventListener("mouseup", endDrag, false);
    canvas.addEventListener("mouseleave", () => {
      endDrag();
      // Reset tilt when mouse leaves canvas
      mouseX = 0;
      mouseY = 0;
    });

    // Setup touch events for mobile/tablet support
    canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length > 0) {
        isDragging = true;
        dragReleaseAnimating = false;
        const touch = e.touches[0];
        dragStart = { x: touch.clientX, y: touch.clientY };
        currentDragDelta = { x: 0, y: 0 };
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
      // Update mouse position for tilt (though not used during drag)
      const rect = canvas.getBoundingClientRect();
      mouseX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = ((touch.clientY - rect.top) / rect.height) * 2 - 1;
    });
    canvas.addEventListener("touchend", endDrag, false);
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

    // After load animation is done, handle drag or tilt
    if (loadAnimationDone) {
      if (isDragging || dragReleaseAnimating) {
        // Calculate vortex center in normalized coordinates
        const dragCenterX = currentDragDelta.x;
        const dragCenterY = currentDragDelta.y;
        const dragMagnitude = Math.sqrt(
          dragCenterX * dragCenterX + dragCenterY * dragCenterY
        );
        const dragAngle = Math.atan2(dragCenterY, dragCenterX);

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
          // Get the angle of the drag vector
          const dragDirectionAngle = Math.atan2(
            currentDragDelta.y,
            currentDragDelta.x
          );

          // Calculate the angle between the point and drag direction
          // This will determine if we should rotate clockwise or counter-clockwise
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
      } else {
        // Tilt effect on mouseover
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
            targetPositions[i],
            targetPositions[i + 1],
            targetPositions[i + 2]
          );
          const rotatedVec = targetVec
            .clone()
            .applyMatrix4(totalRotationMatrix);
          currentPositions[i] = rotatedVec.x;
          currentPositions[i + 1] = rotatedVec.y;
          currentPositions[i + 2] = rotatedVec.z;
        }
      }

      // Update point cloud geometry
      points.geometry.attributes.position.array.set(currentPositions);
      points.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  };

  init();
});
