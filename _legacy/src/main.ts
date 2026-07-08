import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  document.documentElement.classList.add("is-landing");

  app.innerHTML = `
    <main>
      <section class="hero" aria-label="Featured work">
        <img
          class="hero__cat hero__cat--left"
          src="/cat-left.png"
          alt="Graphite study of a cat, left"
        />

        <div class="cat-scribble cat-scribble--left" aria-hidden="true">
          <svg width="200" height="70" viewBox="0 0 200 70" fill="none" overflow="visible">
            <path class="cs-path" d=""/>
            <text class="cs-label" x="210" y="12" text-anchor="start">view works</text>
          </svg>
        </div>

        <img
          class="hero__title-img"
          src="/hero-title.png"
          alt="Jasmine Wu"
        />

        <div class="cat-scribble cat-scribble--right" aria-hidden="true">
          <svg width="200" height="160" viewBox="0 0 200 160" fill="none" overflow="visible">
            <path class="cs-path" d=""/>
            <text class="cs-label" x="116" y="2" text-anchor="end">contact me</text>
          </svg>
        </div>

        <img
          class="hero__cat hero__cat--right"
          src="/cat-right.png"
          alt="Graphite study of a cat, right"
        />
      </section>
    </main>

    <!-- Contact modal -->
    <div class="contact-modal" id="contact-modal" role="dialog" aria-modal="true" aria-label="Contact Jasmine">
      <div class="contact-modal__inner">
        <button class="contact-modal__close" id="modal-close" aria-label="Close">&times;</button>
        <p class="contact-modal__label">Contact</p>
        <h2 class="contact-modal__title">Leave a message.</h2>
        <form class="contact-form" id="contact-form" novalidate>
          <div class="contact-form__row">
            <label for="cf-name">Name</label>
            <input id="cf-name" name="name" type="text" placeholder="Your name" autocomplete="name" />
          </div>
          <div class="contact-form__row">
            <label for="cf-email">Email</label>
            <input id="cf-email" name="email" type="email" placeholder="your@email.com" autocomplete="email" />
          </div>
          <div class="contact-form__row">
            <label for="cf-message">Message</label>
            <textarea id="cf-message" name="message" rows="5" placeholder="Commissions, prints, hello…"></textarea>
          </div>
          <button class="contact-form__submit" type="submit">Send</button>
        </form>
      </div>
    </div>
  `;

  initCatScribbles();
  initModal();
}

// ---- Modal -------------------------------------------------------------------

function initModal() {
  const modal = document.getElementById("contact-modal")!;
  const closeBtn = document.getElementById("modal-close")!;
  const form = document.getElementById("contact-form") as HTMLFormElement;

  function openModal() {
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
  }

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    closeModal();
    form.reset();
  });

  // Expose openModal for the cat click handler
  (window as Window & { openContactModal?: () => void }).openContactModal = openModal;
}

// ---- Scribble path generation ------------------------------------------------

type Pt = [number, number];

function rnd(base: number, range: number): number {
  return base + (Math.random() - 0.5) * 2 * range;
}

function catmullRomPath(pts: Pt[]): string {
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1);
    const cp1y = (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1);
    const cp2x = (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1);
    const cp2y = (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1);
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

function leftScribblePath(): string {
  return catmullRomPath([
    [-20, 30],
    [rnd(50, 8),  rnd(40, 8)],
    [rnd(100, 8), rnd(26, 8)],
    [rnd(148, 5), rnd(14, 4)],
    [rnd(168, 4), rnd(2,  3)],
    [rnd(158, 4), rnd(22, 4)],
    [rnd(182, 5), rnd(12, 4)],
    [196, 8],
  ]);
}

function rightScribblePath(): string {
  return catmullRomPath([
    [192, 150],
    [rnd(192, 5), rnd(108, 5)],
    [rnd(202, 5), rnd(72,  5)],
    [rnd(192, 5), rnd(40,  5)],
    [rnd(160, 5), rnd(22,  4)],
    [130, 10],
  ]);
}

// ------------------------------------------------------------------------------

function initCatScribbles() {
  const hero = document.querySelector<HTMLElement>(".hero");
  const catL = document.querySelector<HTMLElement>(".hero__cat--left");
  const catR = document.querySelector<HTMLElement>(".hero__cat--right");
  const scribL = document.querySelector<HTMLElement>(".cat-scribble--left");
  const scribR = document.querySelector<HTMLElement>(".cat-scribble--right");

  if (!hero || !catL || !catR || !scribL || !scribR) return;

  function positionScribble(
    cat: HTMLElement,
    scrib: HTMLElement,
    side: "left" | "right",
  ) {
    const cr = cat.getBoundingClientRect();
    const hr = hero!.getBoundingClientRect();
    if (side === "left") {
      scrib.style.left = `${cr.right - hr.left - 22}px`;
      scrib.style.right = "";
      scrib.style.top = `${cr.top - hr.top + cr.height * 0.62}px`;
    } else {
      const catVisibleRight = Math.min(cr.right, hr.left + hr.width);
      const catVisibleCenter = (cr.left + catVisibleRight) / 2;
      scrib.style.left = `${catVisibleCenter - hr.left - 100}px`;
      scrib.style.right = "";
      scrib.style.top = `${cr.top - hr.top - 120}px`;
    }
  }

  function activateScribble(scrib: HTMLElement) {
    const path = scrib.querySelector<SVGGeometryElement>(".cs-path")!;
    const label = scrib.querySelector<Element>(".cs-label")!;

    const isLeft = scrib.classList.contains("cat-scribble--left");
    path.setAttribute("d", isLeft ? leftScribblePath() : rightScribblePath());

    const len = path.getTotalLength();
    path.style.setProperty("--cs-len", String(len));
    path.style.strokeDasharray = String(len);

    [path, label].forEach((el) => el.classList.remove("cs-animate"));
    path.getBoundingClientRect();

    scrib.classList.add("is-active");
    path.classList.add("cs-animate");
    label.classList.add("cs-animate");
  }

  function deactivateScribble(scrib: HTMLElement) {
    scrib.classList.remove("is-active");
    scrib
      .querySelectorAll(".cs-path, .cs-label")
      .forEach((el) => el.classList.remove("cs-animate"));
  }

  catL.addEventListener("mouseenter", () => {
    positionScribble(catL, scribL, "left");
    activateScribble(scribL);
  });
  catL.addEventListener("mouseleave", () => deactivateScribble(scribL));
  catL.addEventListener("click", () => {
    window.location.href = "/works.html";
  });

  catR.addEventListener("mouseenter", () => {
    positionScribble(catR, scribR, "right");
    activateScribble(scribR);
  });
  catR.addEventListener("mouseleave", () => deactivateScribble(scribR));
  catR.addEventListener("click", () => {
    (window as Window & { openContactModal?: () => void }).openContactModal?.();
  });
}
