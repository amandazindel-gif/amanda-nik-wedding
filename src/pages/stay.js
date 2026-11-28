import { esc, url, asset, carousel } from "../components/util.js";

/* "+49 (0) 8026 92 92 00" -> "+498026929200". The (0) is for domestic dialling
   and must not appear in an international tel: link. */
function telHref(phone) {
  return "+" + String(phone).replace(/\(0\)/g, "").replace(/\D/g, "");
}

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* One dialog per hotel with rates, opened by its "Click for Pricing" button. */
function ratesDialog(h) {
  const rows = h.rooms
    .map(
      (r) => `
            <tr>
              <th scope="row">${esc(r.type)}</th>
              <td>${esc(r.details)}</td>
              <td class="rates__price">${esc(r.perNight)}</td>
            </tr>`
    )
    .join("");

  return `
  <dialog class="rates" data-rates="${esc(slug(h.name))}" aria-labelledby="rates-${esc(slug(h.name))}-title">
    <div class="rates__head">
      <div>
        <p class="rates__eyebrow">Room rates</p>
        <h2 id="rates-${esc(slug(h.name))}-title">${esc(h.name)}</h2>
      </div>
      <button type="button" class="rates__close" data-rates-close aria-label="Close">×</button>
    </div>
    <div class="rates__scroll">
      <table class="rates__table">
        <thead>
          <tr><th scope="col">Room type</th><th scope="col">Details</th><th scope="col">Per night</th></tr>
        </thead>
        <tbody>${rows}
        </tbody>
      </table>
    </div>
    <p class="rates__fine">Per room, per night, breakfast included.${
      h.availableDates ? ` Rooms are held ${esc(h.availableDates)}; other nights can be requested.` : ""
    } Contact the hotel direct to book.</p>
  </dialog>`;
}

export default function stay(W) {
  // A hotel with listed:false stays in the data but off this page.
  const listed = W.hotels.filter((h) => h.listed !== false);

  const cards = listed
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
              if (h.availableDates) perks.push(["📅", `Available ${h.availableDates}`]);
              if (h.breakfast) perks.push(["☕", "Breakfast included"]);
              if (h.minNights) perks.push(["🌙", `${h.minNights}-night minimum`]);
              return perks.length
                ? `<div class="hotel-card__perks">${perks
                    .map(([icon, text]) => `<span class="hotel-card__perk"><span aria-hidden="true">${icon}</span> ${esc(text)}</span>`)
                    .join("")}</div>`
                : "";
            })()}
            ${h.availableNote ? `<p class="hotel-card__fine">${esc(h.availableNote)}</p>` : ""}
            ${
              h.bookEmail || h.bookPhone
                ? // Booked direct with the hotel rather than through a site.
                  `<ul class="hotel-card__contact">
              ${[
                h.bookEmail
                  ? `<li><span>Email to Book:</span> <a href="mailto:${esc(h.bookEmail)}">${esc(h.bookEmail)}</a></li>`
                  : "",
                h.bookPhone
                  ? `<li><span>Call to Book:</span> <a href="tel:${esc(telHref(h.bookPhone))}">${esc(h.bookPhone)}</a></li>`
                  : ""
              ].filter(Boolean).join("\n              ")}
            </ul>
            <div class="hotel-card__actions">
              ${[
                h.rooms && h.rooms.length
                  ? `<button type="button" class="btn btn--primary" data-rates-open="${esc(slug(h.name))}">Click for Pricing</button>`
                  : "",
                h.websiteUrl
                  ? `<a class="btn btn--outline" href="${esc(h.websiteUrl)}" target="_blank" rel="noreferrer">Website</a>`
                  : ""
              ].filter(Boolean).join("\n              ")}
            </div>`
                : `<div class="hotel-card__actions">
              <a class="btn btn--primary" href="${esc(h.bookingUrl)}" target="_blank" rel="noreferrer">${esc(h.bookingLabel || "Book")}</a>
              ${
                h.altBookingUrl
                  ? `<a class="btn btn--outline" href="${esc(h.altBookingUrl)}" target="_blank" rel="noreferrer">${esc(h.altBookingLabel || "More options")}</a>`
                  : ""
              }
            </div>`
            }
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
      ${listed.filter((h) => h.rooms && h.rooms.length).map(ratesDialog).join("")}
    </div>
  </section>

  <section class="section section--last" style="padding-top:40px">
    <div class="note-pair note-pair--single">
      <div>
        <h2>Where should I actually stay?</h2>
        <p>In Schliersee village or right on the lake. Everywhere we've listed sits within a five minute walk of everywhere else, which is where we'll be hanging out between events, and where the shuttles pick up.</p>
        <p>We'll be at the Terofal in the middle of the village with some of the family. It isn't on the list above, but the wedding-day shuttles leave from right outside it.</p>
      </div>
    </div>
  </section>
</main>`;

  return {
    route: "/stay/",
    title: "Stay · Amanda & Nik",
    desc: "Where to sleep in Schliersee: the Seehotel on the lake, apartments and hotels in the village, and places around the water.",
    current: "stay",
    body,
    scripts: ["scripts/stay.js"]
  };
}
