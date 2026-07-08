import "./style.css";

const ITEMS = 9;

function buildGallery(): string {
  return Array.from(
    { length: ITEMS },
    (_, i) => `
    <div
      class="oeuvre-item"
      data-index="${i}"
      role="button"
      tabindex="0"
      aria-label="Work ${i + 1}"
    >
      <div class="oeuvre-frame"></div>
    </div>
  `,
  ).join("");
}

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = `
    <header class="oeuvre-header">
      <a href="/" class="oeuvre-logo" aria-label="Back to home">
        <img src="/hero-title.png" alt="Jasmine Wu" />
      </a>
    </header>

    <main class="oeuvre-main">
      
      <div class="oeuvre-gallery">${buildGallery()}</div>
    </main>

    <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="View work">
      <button class="lightbox__close" id="lightbox-close" aria-label="Close">&times;</button>
      <div class="lightbox__content" id="lightbox-content">
        <div class="lightbox__frame"></div>
      </div>
    </div>
  `;

  initLightbox();
}

function initLightbox() {
  const lightbox = document.getElementById("lightbox")!;
  const closeBtn = document.getElementById("lightbox-close")!;

  function open() {
    lightbox.classList.add("is-open");
    document.body.classList.add("modal-open");
  }

  function close() {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("modal-open");
  }

  document.querySelectorAll<HTMLElement>(".oeuvre-item").forEach((item) => {
    item.addEventListener("click", () => open());
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });

  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) close();
  });
}
