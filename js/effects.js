function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticle(container, className) {
  const element = document.createElement("span");
  element.className = className;
  container.appendChild(element);
  return element;
}

/**
 * Static count of animated stars; their twinkle and drift are handled by CSS so
 * the browser can keep the background smooth.
 */
export function createStars(container) {
  const starCount = Math.min(210, Math.max(82, Math.floor(window.innerWidth / 7)));
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < starCount; index += 1) {
    const star = document.createElement("span");
    const size = randomBetween(1, index % 9 === 0 ? 3.6 : 2.2);

    star.className = "star";
    star.style.left = `${randomBetween(0, 100)}%`;
    star.style.top = `${randomBetween(0, 100)}%`;
    star.style.setProperty("--star-size", `${size}px`);
    star.style.setProperty("--duration", `${randomBetween(2.4, 7.5)}s`);
    star.style.setProperty("--delay", `${randomBetween(-7, 0)}s`);
    star.style.setProperty("--min-opacity", randomBetween(0.18, 0.46));
    star.style.setProperty("--max-opacity", randomBetween(0.68, 1));
    star.style.setProperty("--drift-x", `${randomBetween(-10, 10)}px`);
    star.style.setProperty("--drift-y", `${randomBetween(-8, 8)}px`);
    fragment.appendChild(star);
  }

  container.appendChild(fragment);
}

export function startPetals(container) {
  const spawn = () => {
    const petal = createParticle(container, "petal");
    const start = randomBetween(-8, 108);
    const end = start + randomBetween(-28, 28);

    petal.style.setProperty("--petal-size", `${randomBetween(9, 23)}px`);
    petal.style.setProperty("--start-x", `${start}vw`);
    petal.style.setProperty("--end-x", `${end}vw`);
    petal.style.setProperty("--rotation", `${randomBetween(180, 780)}deg`);
    petal.style.setProperty("--duration", `${randomBetween(8, 16)}s`);
    petal.addEventListener("animationend", () => petal.remove(), { once: true });

    window.setTimeout(spawn, randomBetween(260, 720));
  };

  spawn();
}

export function startFloatingHearts(container) {
  const spawn = () => {
    const heart = createParticle(container, "mini-heart");
    const start = randomBetween(0, 100);

    heart.textContent = "❤";
    heart.style.setProperty("--heart-size", `${randomBetween(13, 26)}px`);
    heart.style.setProperty("--start-x", `${start}vw`);
    heart.style.setProperty("--end-x", `${start + randomBetween(-18, 18)}vw`);
    heart.style.setProperty("--rotation", `${randomBetween(-100, 100)}deg`);
    heart.style.setProperty("--duration", `${randomBetween(7, 14)}s`);
    heart.addEventListener("animationend", () => heart.remove(), { once: true });

    window.setTimeout(spawn, randomBetween(900, 1800));
  };

  spawn();
}
