/* Travel: the pin picker that drives the embedded map, and the train/car tabs. */

const pins = window.__WED_PINS || [];
const frame = document.querySelector("[data-pin-map]");
const chips = [...document.querySelectorAll("[data-pin]")];
const kind = document.querySelector("[data-pin-kind]");
const name = document.querySelector("[data-pin-name]");
const desc = document.querySelector("[data-pin-desc]");
const link = document.querySelector("[data-pin-link]");

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const pin = pins[Number(chip.dataset.pin)];
    if (!pin) return;
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
    if (frame) frame.src = pin.mapSrc;
    if (kind) kind.textContent = pin.kind;
    if (name) name.textContent = pin.name;
    if (desc) desc.textContent = pin.desc;
    if (link) link.href = pin.mapsUrl;
  });
});

const modeTabs = [...document.querySelectorAll("[data-mode]")];
const modePanels = [...document.querySelectorAll("[data-mode-panel]")];

function selectMode(mode, focus) {
  modeTabs.forEach((t) => {
    const on = t.dataset.mode === mode;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    if (on && focus) t.focus();
  });
  modePanels.forEach((p) => { p.hidden = p.dataset.modePanel !== mode; });
}

modeTabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectMode(tab.dataset.mode, false));
  tab.addEventListener("keydown", (e) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    selectMode(modeTabs[(i + dir + modeTabs.length) % modeTabs.length].dataset.mode, true);
  });
});
