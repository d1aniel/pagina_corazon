import { createStars, startFloatingHearts, startPetals } from "./effects.js";
import { createGallery, setupLightbox } from "./gallery.js";
import { animatePhotosToHeart, resizeHeart, setupParallax } from "./heart.js";

const elements = {
  intro: document.querySelector("#intro"),
  startButton: document.querySelector("#start-button"),
  musicToggle: document.querySelector("#music-toggle"),
  muteToggle: document.querySelector("#mute-toggle"),
  audio: document.querySelector("#love-song"),
  heartField: document.querySelector("#heart-field"),
  starField: document.querySelector("#star-field"),
  petalField: document.querySelector("#petal-field"),
  floatingHearts: document.querySelector("#floating-hearts"),
  finalMessage: document.querySelector("#final-message"),
  lightbox: document.querySelector("#lightbox"),
  lightboxImage: document.querySelector("#lightbox-image"),
};

let hasStarted = false;
let photoCards = [];

function revealMusicControls() {
  elements.musicToggle.classList.remove("hidden");
  elements.muteToggle.classList.remove("hidden");
}

function updateMusicButtons() {
  elements.musicToggle.textContent = elements.audio.paused ? "▶" : "⏸";
  elements.musicToggle.setAttribute("aria-label", elements.audio.paused ? "Reanudar musica" : "Pausar musica");
  elements.musicToggle.setAttribute("aria-pressed", String(!elements.audio.paused));

  elements.muteToggle.textContent = elements.audio.muted ? "🔇" : "🔊";
  elements.muteToggle.setAttribute("aria-label", elements.audio.muted ? "Activar sonido" : "Silenciar musica");
  elements.muteToggle.setAttribute("aria-pressed", String(elements.audio.muted));
}

async function playMusic() {
  try {
    await elements.audio.play();
  } catch {
    elements.musicToggle.textContent = "▶";
  } finally {
    updateMusicButtons();
  }
}

function bindAudioControls() {
  elements.musicToggle.addEventListener("click", async () => {
    if (elements.audio.paused) {
      await playMusic();
    } else {
      elements.audio.pause();
      updateMusicButtons();
    }
  });

  elements.muteToggle.addEventListener("click", () => {
    elements.audio.muted = !elements.audio.muted;
    updateMusicButtons();
  });
}

function startExperience() {
  if (hasStarted) return;
  hasStarted = true;

  elements.intro.classList.add("intro-leaving");
  revealMusicControls();
  playMusic();

  animatePhotosToHeart(elements.heartField, photoCards, () => {
    elements.finalMessage.classList.add("visible");
  });
}

function bindResize() {
  let resizeFrame = 0;

  window.addEventListener("resize", () => {
    if (!hasStarted) return;
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => resizeHeart(elements.heartField, photoCards));
  });
}

function init() {
  createStars(elements.starField);
  startPetals(elements.petalField);
  startFloatingHearts(elements.floatingHearts);

  photoCards = createGallery(elements.heartField);
  setupLightbox(elements.lightbox, elements.lightboxImage, photoCards);
  setupParallax(elements.heartField);
  bindAudioControls();
  bindResize();

  elements.startButton.addEventListener("click", startExperience);
  updateMusicButtons();
}

init();
