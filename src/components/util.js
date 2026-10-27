/* Small helpers shared by every page template. */

let BASE = "/";

/** Called once by build.mjs before any page renders. */
export function setBase(base) {
  BASE = base.endsWith("/") ? base : base + "/";
}

export function getBase() {
  return BASE;
}

/** Escape text for use in HTML text nodes and double-quoted attributes. */
export function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Site route ("/wear/") to a href that survives a project Pages path. */
export function url(route) {
  if (!route) return BASE;
  if (/^(https?:|mailto:|tel:|#)/.test(route)) return route;
  return BASE + String(route).replace(/^\/+/, "");
}

/** Asset path ("assets/hero-c.jpg") to a href. Remote URLs pass through. */
export function asset(path) {
  if (/^https?:/.test(path)) return path;
  return BASE + String(path).replace(/^\/+/, "");
}

/** Render a list of photos as the shared swipe/arrow carousel. */
export function carousel(photos, { className = "", lazy = true } = {}) {
  const list = (photos || []).filter((p) => p && p.src);
  if (!list.length) return "";
  const many = list.length > 1;
  const slides = list
    .map(
      (p, i) =>
        `<img src="${asset(p.src)}" alt="${esc(p.alt || "")}"${lazy && i > 0 ? ' loading="lazy"' : lazy ? ' loading="lazy"' : ""} draggable="false"${
          p.objectPosition ? ` style="object-position:${esc(p.objectPosition)}"` : ""
        }>`
    )
    .join("");
  const controls = many
    ? `<button type="button" class="carousel__btn carousel__btn--prev" data-car-prev aria-label="Previous photo"><span aria-hidden="true">‹</span></button>
       <button type="button" class="carousel__btn carousel__btn--next" data-car-next aria-label="Next photo"><span aria-hidden="true">›</span></button>
       <div class="carousel__dots" aria-hidden="true">${list
         .map((_, i) => `<span${i === 0 ? ' data-active="true"' : ""}></span>`)
         .join("")}</div>`
    : "";
  return `<div class="carousel ${className}" data-carousel>
  <div class="carousel__track" data-car-track>${slides}</div>
  ${controls}
</div>`;
}
