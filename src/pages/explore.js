import { esc, carousel } from "../components/util.js";

const TAGS_BY_KIND = {
  Lake: ["Relax", "Adventure"],
  View: ["Adventure"],
  Ride: ["Adventure"],
  Hike: ["Adventure"],
  Alpine: ["Adventure", "Relax"],
  Spa: ["Relax"],
  Stroll: ["Relax"],
  Culture: ["Day Trips", "Food"],
  "Day trip": ["Day Trips", "Food"]
};

const FILTERS = ["All", "Relax", "Adventure", "Day Trips"];

export default function explore(W) {
  const items = W.explore.map((x) => ({ ...x, tags: x.tags || TAGS_BY_KIND[x.kind] || [] }));

  const filters = FILTERS.map(
    (f) => `<button type="button" class="chip" data-filter="${esc(f)}" aria-pressed="${f === "All"}">${esc(f)}</button>`
  ).join("\n        ");

  const cards = items
    .map((x) => {
      const photos = [{ src: x.photo, alt: x.photoAlt }].concat(x.gallery || []).filter((p) => p.src);
      return `
          <div class="card explore-card" data-tags="${esc(x.tags.join("|"))}">
            ${carousel(photos)}
            <div class="card__body">
              <span class="card__kind">${esc(x.kind)}</span>
              <h2 class="card__title">${esc(x.name)}</h2>
              <p class="card__desc">${esc(x.desc)}</p>
              <a class="card__link" href="${esc(x.mapsUrl)}" target="_blank" rel="noreferrer">Directions →</a>
            </div>
          </div>`;
    })
    .join("");

  const food = W.food
    .map((r) => {
      const photos = [{ src: r.photo, alt: r.photoAlt }].concat(r.gallery || []).filter((p) => p.src);
      return `
          <div class="card food-card">
            ${carousel(photos)}
            <div class="card__body">
              <span class="card__kind">${esc(r.kind)}</span>
              <h3 class="card__title">${esc(r.name)}</h3>
              <p class="card__desc">${esc(r.desc)}</p>
              <div class="card__links">
                ${r.url ? `<a class="card__link" href="${esc(r.url)}" target="_blank" rel="noreferrer">Website →</a>` : ""}
                ${r.mapsUrl ? `<a class="card__link card__link--forest" href="${esc(r.mapsUrl)}" target="_blank" rel="noreferrer">Directions →</a>` : ""}
              </div>
            </div>
          </div>`;
    })
    .join("");

  const body = `
<main>
  <section class="section">
    <div class="wrap">
      <div class="page-head">
        <p class="eyebrow">Downtime</p>
        <h1>Things to do between parties</h1>
        <p>You came a long way and Schliersee has a lot to offer! Take some time to explore the beautiful scenery.</p>
      </div>
      <div class="filter-row" role="group" aria-label="Filter by type">
        ${filters}
      </div>
      <p class="result-count" data-result-count aria-live="polite">${items.length} places</p>
      <div class="grid-cards" data-explore-grid>${cards}
      </div>
    </div>
  </section>

  <section class="section section--last" style="padding-top:56px">
    <div class="wrap">
      <div class="page-head" style="margin-bottom:22px">
        <p class="eyebrow">Eat &amp; drink</p>
        <h2 style="margin:0 0 10px;font-family:var(--serif);font-weight:600;font-size:clamp(28px,5vw,44px);line-height:1.1;color:var(--ink)">Where we'd eat</h2>
        <p>Some of our favorites around the lake.</p>
      </div>
      <div class="grid-cards">${food}
      </div>
    </div>
  </section>
</main>`;

  return {
    route: "/explore/",
    title: "Explore · Amanda & Nik",
    desc: "Lake swims, cable cars, the spa, day trips to the Tegernsee and the Eibsee, and where we'd eat around Schliersee.",
    current: "explore",
    body,
    scripts: ["scripts/explore.js"]
  };
}
