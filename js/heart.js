const HEART_PADDING = 0.78;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Creates normalized heart positions from the classic parametric heart curve.
 * The returned points are independent from the viewport and are scaled later.
 */
export function createHeartPositions(total) {
  const rawPoints = [];

  for (let index = 0; index < total; index += 1) {
    const turn = index / total;
    const angle = turn * Math.PI * 2;
    const shell = 0.58 + (index % 5) * 0.105;
    const x = 16 * Math.sin(angle) ** 3 * shell;
    const y =
      (13 * Math.cos(angle) -
        5 * Math.cos(2 * angle) -
        2 * Math.cos(3 * angle) -
        Math.cos(4 * angle)) *
      shell;

    rawPoints.push({ x, y, r: randomBetween(-14, 14) });
  }

  const minX = Math.min(...rawPoints.map((point) => point.x));
  const maxX = Math.max(...rawPoints.map((point) => point.x));
  const minY = Math.min(...rawPoints.map((point) => point.y));
  const maxY = Math.max(...rawPoints.map((point) => point.y));

  return rawPoints.map((point) => ({
    x: (point.x - minX) / (maxX - minX),
    y: 1 - (point.y - minY) / (maxY - minY),
    r: point.r,
  }));
}

function getStageMetrics(container) {
  const bounds = container.getBoundingClientRect();
  const availableWidth = bounds.width;
  const availableHeight = bounds.height;
  const square = Math.min(availableWidth, availableHeight * 1.05) * HEART_PADDING;

  return {
    width: square,
    height: square * 0.9,
  };
}

function getRandomEntrance() {
  const side = Math.floor(Math.random() * 4);
  const spreadX = randomBetween(-52, 52);
  const spreadY = randomBetween(-48, 48);

  if (side === 0) return { x: `calc(-58vw + ${spreadX}px)`, y: `${spreadY}vh` };
  if (side === 1) return { x: `calc(58vw + ${spreadX}px)`, y: `${spreadY}vh` };
  if (side === 2) return { x: `${spreadX}vw`, y: `calc(-58vh + ${spreadY}px)` };
  return { x: `${spreadX}vw`, y: `calc(58vh + ${spreadY}px)` };
}

/**
 * Places cards offscreen first, then animates them toward normalized positions
 * in a responsive heart.
 */
export function animatePhotosToHeart(container, photoCards, onComplete) {
  const positions = createHeartPositions(photoCards.length);
  const metrics = getStageMetrics(container);
  let longestDelay = 0;

  photoCards.forEach((card, index) => {
    const entrance = getRandomEntrance();
    const point = positions[index];
    const x = (point.x - 0.5) * metrics.width;
    const y = (point.y - 0.5) * metrics.height;
    const delay = index * 28 + randomBetween(0, 260);

    longestDelay = Math.max(longestDelay, delay);
    card.style.setProperty("--tx", entrance.x);
    card.style.setProperty("--ty", entrance.y);
    card.style.setProperty("--rot", `${randomBetween(-35, 35)}deg`);
    card.style.zIndex = String(index + 1);

    window.setTimeout(() => {
      card.classList.add("arrived");
      card.style.transitionTimingFunction = "cubic-bezier(0.22, 1.35, 0.32, 1)";
      card.style.setProperty("--tx", `${x}px`);
      card.style.setProperty("--ty", `${y}px`);
      card.style.setProperty("--rot", `${point.r}deg`);
    }, delay);
  });

  window.setTimeout(() => {
    container.classList.add("completed");
    onComplete?.();
  }, longestDelay + 2600);
}

/**
 * Recalculates the current heart after a resize without replaying the entrance
 * animation, keeping the shape intact from phones to wide monitors.
 */
export function resizeHeart(container, photoCards) {
  const positions = createHeartPositions(photoCards.length);
  const metrics = getStageMetrics(container);

  photoCards.forEach((card, index) => {
    const point = positions[index];
    card.style.setProperty("--tx", `${(point.x - 0.5) * metrics.width}px`);
    card.style.setProperty("--ty", `${(point.y - 0.5) * metrics.height}px`);
    card.style.setProperty("--rot", `${point.r}deg`);
  });
}

export function setupParallax(container) {
  window.addEventListener("mousemove", (event) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const x = (event.clientX / window.innerWidth - 0.5) * 18;
    const y = (event.clientY / window.innerHeight - 0.5) * 14;
    container.style.setProperty("--parallax-x", `${x}px`);
    container.style.setProperty("--parallax-y", `${y}px`);
  });

  if ("DeviceOrientationEvent" in window) {
    window.addEventListener(
      "deviceorientation",
      (event) => {
        if (!window.matchMedia("(pointer: coarse)").matches) return;
        const x = Math.max(-8, Math.min(8, (event.gamma || 0) * 0.45));
        const y = Math.max(-8, Math.min(8, (event.beta || 0) * 0.24));
        container.style.setProperty("--parallax-x", `${x}px`);
        container.style.setProperty("--parallax-y", `${y}px`);
      },
      { passive: true },
    );
  }
}
