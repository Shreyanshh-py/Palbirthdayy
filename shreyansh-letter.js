const gate = document.getElementById("gate");
const gateCard = document.querySelector(".gate__card");
const passwordInput = document.getElementById("password");
const unlockBtn = document.getElementById("unlockBtn");
const gateError = document.getElementById("gateError");
const letter = document.querySelector("main .letter");

const PASSWORD = "togepi";

function playSuccessSound() {
  // Prefer user-provided MP3.
  try {
    const audio = new Audio("./Sounds/togepi.mp3");
    audio.preload = "auto";
    audio.volume = 0.75;
    const p = audio.play();
    // In some browsers play() returns a promise that may reject.
    if (p && typeof p.catch === "function") p.catch(() => {});
    return;
  } catch {
    // fall through
  }

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const startAt = ctx.currentTime + 0.02;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, startAt);
    master.gain.exponentialRampToValueAtTime(0.25, startAt + 0.02);
    master.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.9);
    master.connect(ctx.destination);

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, startAt + i * 0.08);

      gain.gain.setValueAtTime(0.0001, startAt + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.18, startAt + i * 0.08 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + i * 0.08 + 0.22);

      osc.connect(gain);
      gain.connect(master);

      osc.start(startAt + i * 0.08);
      osc.stop(startAt + i * 0.08 + 0.25);
    });

    // Cleanup
    setTimeout(() => {
      ctx.close?.();
    }, 1200);
  } catch {
    // no-op
  }
}

function unlock() {
  const typed = (passwordInput.value || "").trim();

  if (typed === PASSWORD) {
    passwordInput.value = "";
    gateError.textContent = "";

    playSuccessSound();

    // Animate the gate away, then hide it.
    if (typeof gsap !== "undefined") {
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => gate.classList.add("gate--hidden"),
      });

      if (gateCard) {
        tl.to(gateCard, { y: -14, scale: 0.98, opacity: 0, duration: 0.45 }, 0);
      }
      tl.to(gate, { opacity: 0, duration: 0.45 }, 0.08);

      if (letter) {
        tl.fromTo(
          letter,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.85, ease: "power2.out" },
          0.2
        );
      }
    } else {
      gate.classList.add("gate--hidden");
    }
    return;
  }

  gateError.textContent = "Wrong password. Try again.";
  passwordInput.focus();
  passwordInput.select();
}

unlockBtn.addEventListener("click", unlock);

passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") unlock();
});

// Focus input on load
passwordInput.focus();
