/* Runs on every page: nav, the shared carousel, and the Ask Daisy widget. */

import { initDaisy } from "./daisy.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------------- nav ---- */
function initNav() {
  const header = document.querySelector("[data-site-nav]");
  const burger = document.querySelector("[data-nav-burger]");
  const panel = document.querySelector("[data-nav-panel]");
  if (!header) return;

  // The bar is fixed, so reserve its measured height rather than hardcoding it:
  // the logo size changes across breakpoints and a stale value leaves a gap.
  // Measure the bar, not the whole header, so an open mobile panel overlays the
  // page instead of shoving it down.
  const bar = header.querySelector(".site-nav__bar") || header;
  const measure = () => {
    const h = Math.floor(bar.getBoundingClientRect().height);
    if (!h) return;
    document.body.style.paddingTop = h + "px";
    document.documentElement.style.setProperty("--nav-h", h + "px");
  };
  measure();
  window.addEventListener("resize", measure);
  if (window.ResizeObserver) new ResizeObserver(measure).observe(header);

  const setOpen = (open) => {
    if (!panel) return;
    panel.dataset.open = String(open);
    if (burger) {
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    measure();
  };

  if (burger) burger.addEventListener("click", () => setOpen(panel.dataset.open !== "true"));
  if (panel) panel.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });

  const mq = window.matchMedia("(max-width: 960px)");
  const onBreakpoint = () => { if (!mq.matches) setOpen(false); };
  mq.addEventListener ? mq.addEventListener("change", onBreakpoint) : mq.addListener(onBreakpoint);
}

/* ---------------------------------------------------------- carousels ---- */
export function initCarousels(root = document) {
  root.querySelectorAll("[data-carousel]").forEach((car) => {
    if (car.dataset.ready === "1") return;
    car.dataset.ready = "1";
    const track = car.querySelector("[data-car-track]");
    const dots = [...car.querySelectorAll(".carousel__dots span")];
    const slides = track ? track.children.length : 0;
    if (!track || slides < 2) return;

    const index = () => Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
    const go = (dir) => {
      const i = (index() + dir + slides) % slides;
      track.scrollTo({ left: i * track.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
    };

    car.querySelector("[data-car-prev]")?.addEventListener("click", () => go(-1));
    car.querySelector("[data-car-next]")?.addEventListener("click", () => go(1));

    let raf = 0;
    track.addEventListener(
      "scroll",
      () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const i = index();
          dots.forEach((d, j) => {
            if (j === i) d.setAttribute("data-active", "true");
            else d.removeAttribute("data-active");
          });
        });
      },
      { passive: true }
    );

    // Arrow keys when the carousel has focus.
    car.tabIndex = car.tabIndex >= 0 ? car.tabIndex : 0;
    car.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    });
  });
}

/* ------------------------------------------------------------- boot ------ */
initNav();
initCarousels();
initDaisy();
