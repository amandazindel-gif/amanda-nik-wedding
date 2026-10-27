import { esc, url, carousel } from "../components/util.js";

export default function stay(W) {
  const cards = W.hotels
    .map((h) => {
      const photos = [{ src: h.photo, alt: h.photoAlt }].concat(h.gallery || []).filter((p) => p.src);
      return `
        <div class="card hotel-card">
          ${carousel(photos)}
          <div class="hotel-card__body">
            <div class="hotel-card__meta">
              <span class="hotel-card__tier">${esc(h.tier)}</span>
              <span class="hotel-card__price">${esc(h.price)}</span>
            </div>
            <h2>${esc(h.name)}</h2>
            <p class="hotel-card__desc">${esc(h.desc)}</p>
            ${h.distance ? `<p class="hotel-card__distance">${esc(h.distance)}</p>` : ""}
            <div class="hotel-card__actions">
              <a class="btn btn--primary" href="${esc(h.bookingUrl)}" target="_blank" rel="noreferrer">Book</a>
              <a class="btn btn--outline" href="${h.mapsUrl ? esc(h.mapsUrl) : url("/travel/")}"${
                h.mapsUrl ? ' target="_blank" rel="noreferrer"' : ""
              }>See on map</a>
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
        <p class="eyebrow">Where to sleep</p>
        <h1>Book early, seriously</h1>
        <p>June is high season and many places in the region ask for a 2–3 night minimum. The village is small and it fills up.</p>
      </div>
      <div class="hotel-grid">${cards}
      </div>
      <p class="placeholder-note">PLACEHOLDER · room-block codes and final booking links</p>
    </div>
  </section>

  <section class="section section--last" style="padding-top:40px">
    <div class="note-pair">
      <div>
        <h2>Where should I actually stay?</h2>
        <p>In Schliersee village or right on the lake. Everything we're doing is within a few minutes of there, and the shuttles pick up at the station.</p>
      </div>
      <div>
        <h2>Traveling as a group?</h2>
        <p>An apartment beats four hotel rooms. Message us before you book and we'll tell you who else is looking — several families are sharing houses.</p>
      </div>
    </div>
  </section>
</main>`;

  return {
    route: "/stay/",
    title: "Stay · Amanda & Nik",
    desc: "Where to sleep in Schliersee: the Seehotel on the lake, the Terofal in the village, and apartments around the water.",
    current: "stay",
    body
  };
}
