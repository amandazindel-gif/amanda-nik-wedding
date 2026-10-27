import { esc, asset } from "../components/util.js";

function dressCard(dc) {
  const single = dc.photos.length === 1;
  const slides = dc.photos
    .map(
      (p, i) =>
        `<img src="${asset(p.src)}" alt="${esc(p.alt)}"${i > 0 ? ' loading="lazy"' : ""} style="object-position:${esc(
          p.objectPosition || "50% 50%"
        )}">`
    )
    .join("\n              ");
  const dots = dc.photos
    .map(
      (_, i) =>
        `<button type="button" data-slide="${i}" aria-current="${i === 0}" aria-label="Photo ${i + 1} of ${dc.photos.length}"></button>`
    )
    .join("");

  const media = single
    ? `<div class="dress-card__media"><div class="dress-card__slides">${slides}</div></div>`
    : `<div class="dress-card__media" data-dress-carousel aria-roledescription="carousel" aria-label="${esc(dc.title)} photos">
            <div class="dress-card__slides" data-dress-slides>
              ${slides}
            </div>
            <button type="button" class="dress-card__btn dress-card__btn--prev" data-dress-prev aria-label="Previous photo">‹</button>
            <button type="button" class="dress-card__btn dress-card__btn--next" data-dress-next aria-label="Next photo">›</button>
            <div class="dress-card__dots" data-dress-dots>${dots}</div>
          </div>`;

  const list = (items, no) =>
    items.length
      ? `<ul class="dress-list">
            ${items
              .map(
                (t) =>
                  `<li><span class="dress-list__mark${no ? " dress-list__mark--no" : ""}" aria-hidden="true">${
                    no ? "✕" : "✓"
                  }</span><span>${esc(t)}</span></li>`
              )
              .join("\n            ")}
          </ul>`
      : "";

  return `
        <div class="dress-card dress-card--${esc(dc.theme)}">
          ${media}
          <p class="dress-card__eyebrow">${esc(dc.eyebrow)}</p>
          <h2>${esc(dc.title)}</h2>
          ${dc.intro ? `<p class="dress-card__intro">${esc(dc.intro)}</p>` : ""}
          ${dc.dos.length ? '<p class="dress-card__label">Do</p>' : ""}
          ${list(dc.dos, false)}
          ${dc.donts.length ? '<p class="dress-card__label dress-card__label--dont">Don\'t</p>' : ""}
          ${list(dc.donts, true)}
          ${
            dc.links.length
              ? `<div class="dress-card__links">${dc.links
                  .map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`)
                  .join("")}</div>`
              : ""
          }
        </div>`;
}

export default function wear(W) {
  const packItems = W.packList
    .map((t) => `<li><span aria-hidden="true"></span><span>${esc(t)}</span></li>`)
    .join("\n          ");

  const strip = W.venuePhotos
    .slice(4, 7)
    .map((p) => `<img src="${asset(p.src)}" alt="${esc(p.alt)}" loading="lazy">`)
    .join("\n      ");

  const body = `
<main>
  <section class="section">
    <div class="wrap">
      <div class="page-head">
        <p class="eyebrow">What to wear &amp; pack</p>
        <h1>Mountain weather, party clothes</h1>
        <p>Warm days and cool evenings. Dress for a garden party at altitude.</p>
      </div>
      <div class="wear-grid">${W.dressCodes.map(dressCard).join("")}
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:40px">
    <div class="weather-pack">
      <div class="weather">
        <h2>June, roughly</h2>
        <p>Warm days, cool mountain nights, and the odd afternoon storm that rolls through and passes.</p>
        <div class="weather__row">
          <div class="weather__stat">
            <p>Afternoon · valley</p>
            <p class="weather__big weather__big--warm">68–77°F</p>
            <p class="weather__sub">20–25°C</p>
          </div>
          <div class="weather__stat">
            <p>Evening · alm</p>
            <p class="weather__big">46–54°F</p>
            <p class="weather__sub">8–12°C</p>
          </div>
        </div>
        <div class="weather__stat">
          <p>Chance of a shower</p>
          <p class="weather__big">Decent</p>
          <p class="weather__sub">The alm has a roof, so the plan doesn't change.</p>
        </div>
      </div>
      <div class="pack">
        <h2>Pack list</h2>
        <ul>
          ${packItems}
        </ul>
      </div>
    </div>
  </section>

  <section style="padding:34px 16px 60px">
    <div class="wear-strip">
      ${strip}
    </div>
    <p class="placeholder-note wrap">Schliersee photos: stoegeralm.de</p>
  </section>
</main>`;

  return {
    route: "/wear/",
    title: "What to Wear · Amanda & Nik",
    desc: "Tracht for the Wednesday welcome party, Alpine cocktail for the wedding day, lake casual for Friday, plus a pack list.",
    current: "wear",
    body,
    scripts: ["scripts/wear.js"]
  };
}
