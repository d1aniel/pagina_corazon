export const photos = Array.from({ length: 120 }, (_, index) => `photo${index + 1}.jpeg`);

/**
 * Builds all photo nodes from the photos array so the HTML never has to be
 * edited when more memories are added.
 */
export function createGallery(container, imageBasePath = "assets/images/") {
  const fragment = document.createDocumentFragment();

  photos.forEach((fileName, index) => {
    const card = document.createElement("button");
    const image = document.createElement("img");

    card.type = "button";
    card.className = "photo-card";
    card.dataset.index = String(index);
    card.dataset.file = fileName;
    card.setAttribute("aria-label", `Ver recuerdo ${index + 1}`);

    image.src = `${imageBasePath}${fileName}`;
    image.alt = `Recuerdo romantico ${index + 1}`;
    image.loading = index < 16 ? "eager" : "lazy";
    image.decoding = "async";

    card.appendChild(image);
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
  return [...container.querySelectorAll(".photo-card")];
}

/**
 * Mobile-friendly enlarged view. On desktop it also works from keyboard focus
 * or click, but hover remains the quickest interaction.
 */
export function setupLightbox(lightbox, lightboxImage, photoCards) {
  const openLightbox = (card) => {
    const image = card.querySelector("img");
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.remove("hidden");
    lightbox.classList.add("flex");
  };

  const closeLightbox = () => {
    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");
    lightboxImage.removeAttribute("src");
    lightboxImage.alt = "";
  };

  photoCards.forEach((card) => {
    card.addEventListener("click", () => openLightbox(card));
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.classList.contains("hidden")) {
      closeLightbox();
    }
  });
}
