/* What to wear: the full-body photo carousels on each dress-code card. */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("[data-dress-carousel]").forEach((car) => {
  const slides = car.querySelector("[data-dress-slides]");
  const dots = [...car.querySelectorAll("[data-dress-dots] button")];
  const n = slides ? slides.children.length : 0;
  if (!slides || n < 2) return;

  let i = 0;
  const go = (next) => {
    i = (next + n) % n;
    slides.style.transition = reduceMotion ? "none" : "";
    slides.style.transform = `translateX(-${i * 100}%)`;
    dots.forEach((d, j) => d.setAttribute("aria-current", String(j === i)));
  };

  car.querySelector("[data-dress-prev]").addEventListener("click", () => go(i - 1));
  car.querySelector("[data-dress-next]").addEventListener("click", () => go(i + 1));
  dots.forEach((d, j) => d.addEventListener("click", () => go(j)));

  car.tabIndex = 0;
  car.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
  });

  // Swipe on touch.
  let x0 = null;
  car.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  car.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
    x0 = null;
  }, { passive: true });
});
