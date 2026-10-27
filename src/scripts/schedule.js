/* Schedule: day tabs, expandable events, and the venue photo rail. */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const tabs = [...document.querySelectorAll("[data-day-tab]")];
const panels = [...document.querySelectorAll("[data-day-panel]")];
const venues = [...document.querySelectorAll("[data-venue-panel]")];

function selectDay(id, focus) {
  tabs.forEach((t) => {
    const on = t.dataset.dayTab === id;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    if (on && focus) t.focus();
  });
  panels.forEach((p) => { p.hidden = p.dataset.dayPanel !== id; });
  venues.forEach((v) => { v.hidden = v.dataset.venuePanel !== id; });
}

tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectDay(tab.dataset.dayTab, false));
  tab.addEventListener("keydown", (e) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    selectDay(tabs[(i + dir + tabs.length) % tabs.length].dataset.dayTab, true);
  });
});

document.querySelectorAll("[data-event-toggle]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (panel) panel.hidden = open;
    const chevron = btn.querySelector(".event__chevron");
    if (chevron) chevron.textContent = open ? "+" : "–";
  });
});

document.querySelectorAll("[data-venue-panel]").forEach((wrap) => {
  const track = wrap.querySelector("[data-gallery-track]");
  if (!track) return;
  const scroll = (dir) =>
    track.scrollBy({ left: dir * track.clientWidth * 0.9, behavior: reduceMotion ? "auto" : "smooth" });
  wrap.querySelector("[data-gallery-prev]")?.addEventListener("click", () => scroll(-1));
  wrap.querySelector("[data-gallery-next]")?.addEventListener("click", () => scroll(1));
});
