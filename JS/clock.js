/**
 * Digital Clock widget
 * Modes: Time (12/24hr), Stopwatch, Countdown/Alarm.
 * Refactored: strict-mode IIFE (no globals), cached DOM references,
 * data-driven digit rendering, timestamp-based stopwatch.
 */
(function () {
  "use strict";

  const root = document.querySelector(".digital-clock");
  if (!root) return;

  // ---- Slide-in reveal ----
  // The clock starts translated out of the panel and slides into place
  // after the hero image has finished loading (its entrance animation).
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let revealed = false;
  function revealClock() {
    if (revealed) return;
    revealed = true;
    root.classList.add("is-visible");
  }

  if (prefersReducedMotion || !document.getElementById("heroImage")) {
    // No animation expected – show immediately.
    revealClock();
  } else {
    document.addEventListener("hero-image-ready", revealClock, { once: true });
    // Safety net: never leave the clock hidden if the hero module fails
    // or is slow (image load + ~2s scatter-to-clear animation).
    setTimeout(revealClock, 10000);
  }

  // ---- Cached DOM ----
  const digits = {
    H1: root.querySelector(".H1"),
    H2: root.querySelector(".H2"),
    M1: root.querySelector(".M1"),
    M2: root.querySelector(".M2"),
    S1: root.querySelector(".S1"),
    S2: root.querySelector(".S2"),
  };
  const timeHolder = root.querySelector(".TimeHolder");
  const numbers = root.querySelector(".Numbers");
  const weekDays = root.querySelectorAll(".WeekDays span");
  const formatSpans = root.querySelectorAll(".Formats span");
  const typeSpans = root.querySelectorAll(".Type span");
  const startBtn = root.querySelector(".Start");
  const pauseBtn = root.querySelector(".Pause");
  const stopBtn = root.querySelector(".Stop");
  const alarmInput = root.querySelector(".AlarmInput");
  const alarmField = root.querySelector(".AlarmInput input");

  // ---- State ----
  let mode = "time"; // 'time' | 'stopwatch' | 'alarm'
  let use12hr = false;
  let elapsed = 0; // seconds accumulated by the stopwatch/alarm
  let running = false;
  let lastTick = 0;

  /** Render one seven-segment digit. */
  function setDigit(holder, value) {
    if (!holder) return;
    holder.className = holder.dataset.base + " show" + value;
  }

  /** Render an HH MM SS triple onto the segments. */
  function render(hh, mm, ss) {
    setDigit(digits.S1, Math.floor(ss / 10));
    setDigit(digits.S2, ss % 10);
    setDigit(digits.M1, Math.floor(mm / 10));
    setDigit(digits.M2, mm % 10);
    if (use12hr && mode === "time") {
      const h = hh % 12 === 0 ? 12 : hh % 12;
      digits.H1.style.display = h < 10 ? "none" : "";
      setDigit(digits.H1, Math.floor(h / 10));
      setDigit(digits.H2, h % 10);
      const pm = hh >= 12;
      formatSpans[0].classList.toggle("active", !pm);
      formatSpans[1].classList.toggle("active", pm);
    } else {
      digits.H1.style.display = "";
      setDigit(digits.H1, Math.floor(hh / 10));
      setDigit(digits.H2, hh % 10);
      formatSpans.forEach((s) => s.classList.remove("active"));
    }
  }

  /** Highlight the current weekday (spans start at "sat"). */
  function setWeekDay(dayIndex) {
    const idx = (dayIndex + 1) % 7;
    weekDays.forEach((el, i) => el.classList.toggle("active", i === idx));
  }

  // ---- Modes ----

  function resetDigits() {
    Object.values(digits).forEach((d) => setDigit(d, 0));
  }

  function showNumbers(show) {
    numbers.style.display = show ? "" : "none";
  }

  function setControls(startActive) {
    startBtn.classList.toggle("active", startActive);
    pauseBtn.classList.toggle("active", !startActive);
    stopBtn.classList.add("active");
  }

  // ---- Alarm sound (Web Audio API digital beep) ----
  // Synced with the "clock-ring" CSS animation (0.6s ease infinite alternate
  // = a full 1.2s glow cycle): one beep-beep pattern plays per ring cycle.
  let audioCtx = null;
  const RING_CYCLE_MS = 1200;

  function playDigitalBeep() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      // Two high-pitch square wave bursts (Casio style beep-beep)
      [0, 0.12].forEach(function (offset) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "square";
        osc.frequency.setValueAtTime(2048, now + offset); // digital piezo frequency

        gain.gain.setValueAtTime(0.2, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.08);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.08);
      });
    } catch (e) {
      console.warn("Audio playback error:", e);
    }
  }

  let ringTimer = null;

  /** Start the ring effect AND its sound, kept in sync with each other. */
  function startRinging() {
    if (ringTimer) return; // already ringing
    root.classList.add("ringing");
    playDigitalBeep(); // first burst immediately, in step with the animation
    ringTimer = setInterval(playDigitalBeep, RING_CYCLE_MS);
  }

  /** Stop the ring effect and its sound at exactly the same moment. */
  function stopRinging() {
    root.classList.remove("ringing");
    if (ringTimer) {
      clearInterval(ringTimer);
      ringTimer = null;
    }
  }

  function switchMode(next) {
    mode = next;
    running = false;
    stopRinging();
    elapsed = 0;
    lastTick = 0;
    resetDigits();
    timeHolder.className =
      "TimeHolder" +
      (next === "time" ? "" : " " + (next === "stopwatch" ? "StopWatch" : "Alarm"));
    if (next !== "alarm") showNumbers(true);
    setControls(true);
    alarmInput.classList.remove("DisNone");
    if (next !== "alarm") alarmField.value = "";
  }

  // ---- Update loop (250ms for smooth stopwatch timing) ----

  setInterval(function tick() {
    const now = Date.now();

    if (mode === "time") {
      const dt = new Date(now);
      render(dt.getHours(), dt.getMinutes(), dt.getSeconds());
      setWeekDay(dt.getDay());
    } else if (running) {
      if (lastTick) elapsed += (now - lastTick) / 1000;
      lastTick = now;

      const total = Math.floor(elapsed);

      if (mode === "alarm" && alarmField.dataset.target) {
        const remaining = Number(alarmField.dataset.target) - total;
        if (remaining <= 0) {
          running = false;
          startRinging();
          render(0, 0, 0);
        } else {
          render(
            Math.floor(remaining / 3600),
            Math.floor((remaining % 3600) / 60),
            remaining % 60,
          );
        }
      } else {
        render(
          Math.floor(total / 3600),
          Math.floor((total % 3600) / 60),
          total % 60,
        );
      }
    }
  }, 250);

  // ---- Events ----

  // Mode icons: one handler, highlights the active mode so the user can
  // always see and return to the clock via the "Back to Clock" icon.
  const modeButtons = [
    { el: root.querySelector(".home-icon"), mode: "time", before: null },
    {
      el: root.querySelector(".stopwatch-icon"),
      mode: "stopwatch",
      before: null,
    },
    {
      el: root.querySelector(".fa-clock-o"),
      mode: "alarm",
      before() {
        showNumbers(false); // input takes the place of the digits until started
      },
    },
  ];

  function activateModeButton(target) {
    modeButtons.forEach(({ el }) =>
      el && el.classList.remove("active-mode"),
    );
    if (target) target.classList.add("active-mode");
  }

  modeButtons.forEach(({ el, mode: nextMode, before }) => {
    if (!el) return;
    el.addEventListener("click", () => {
      switchMode(nextMode);
      if (before) before();
      activateModeButton(el);
    });
  });

  // Time is the default highlighted mode
  activateModeButton(modeButtons[0].el);

  // 12 / 24 hr toggle
  typeSpans.forEach((span) =>
    span.addEventListener("click", () => {
      typeSpans.forEach((s) => s.classList.remove("active"));
      span.classList.add("active");
      use12hr = span.textContent.trim() === "12hr";
      if (!use12hr) formatSpans.forEach((s) => s.classList.remove("active"));
    }),
  );

  // Start
  startBtn.addEventListener("click", () => {
    stopRinging();
    if (mode === "time") return;
    if (mode === "alarm" && !running) {
      const target = parseInt(alarmField.value, 10);
      if (!(target > 0)) return;
      alarmField.dataset.target = target;
      elapsed = 0;
      lastTick = 0;
      resetDigits();
      showNumbers(true);
      alarmInput.classList.add("DisNone");
    }
    running = true;
    lastTick = 0;
    setControls(false);
  });

  // Pause
  pauseBtn.addEventListener("click", () => {
    running = false;
    setControls(true);
  });

  // Stop
  stopBtn.addEventListener("click", () => {
    running = false;
    stopRinging();
    elapsed = 0;
    delete alarmField.dataset.target;
    resetDigits();

    if (mode === "alarm") {
      showNumbers(false);
      alarmInput.classList.remove("DisNone");
      alarmField.value = "";
    }
    setControls(true);
  });
})();
