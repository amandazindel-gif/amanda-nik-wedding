import { esc, url, asset, carousel } from "../components/util.js";

export default function stay(W) {
  const cards = W.hotels
    .map((h) => {
      const photos = [{ src: h.photo, alt: h.photoAlt }].concat(h.gallery || []).filter((p) => p.src);
      // Somewhere we don't have our own photo of yet: a quiet panel keeps the
      // grid even instead of leaving a hole.
      const media = photos.length
        ? carousel(photos)
        : `<div class="hotel-card__nophoto" aria-hidden="true"><img src="${asset("assets/monogram.png")}" alt=""></div>`;
      return `
        <div class="card hotel-card">
          ${media}
          <div class="hotel-card__body">
            <div class="hotel-card__meta">
              <span class="hotel-card__tier">${esc(h.tier)}</span>
              ${h.price ? `<span class="hotel-card__price">${esc(h.price)}</span>` : ""}
            </div>
            <h2>${esc(h.name)}</h2>
            <p class="hotel-card__desc">${esc(h.desc)}</p>
            ${h.distance ? `<p class="hotel-card__distance">${esc(h.distance)}</p>` : ""}
            ${(() => {
              const perks = [];
              if (h.breakfast) perks.push(["☕", "Breakfast included"]);
              if (h.minNights) perks.push(["🌙", `${h.minNights}-night minimum`]);
              return perks.length
                ? `<div class="hotel-card__perks">${perks
                    .map(([icon, text]) => `<span class="hotel-card__perk"><span aria-hidden="true">${icon}</span> ${esc(text)}</span>`)
                    .join("")}</div>`
                : "";
            })()}
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
    <div class="note-pair note-pair--single">
      <div>
        <h2>Where should I actually stay?</h2>
        <p>In Schliersee village or right on the lake. Everywhere we've listed sits within a five minute walk of everywhere else, which is where we'll be hanging out between events, and where the shuttles pick up.</p>
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
