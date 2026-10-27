import { esc, url, asset } from "../components/util.js";
import { icon } from "../components/icons.js";

function eventHtml(ev, dayId, i) {
  const details = [
    ["Dress", ev.dress],
    ["Transport", ev.transport],
    ["Good to know", ev.note]
  ].filter(([, v]) => v && v !== "—");
  const expandable = details.length > 0;
  const panelId = `ev-${dayId}-${i}`;

  const actions = `
          <div class="event__actions">
            ${ev.mapsUrl ? `<a class="btn btn--outline" href="${esc(ev.mapsUrl)}" target="_blank" rel="noreferrer">Directions</a>` : ""}
            ${
              ev.link
                ? `<a class="btn btn--outline-terracotta" href="${url(ev.link.href)}"${
                    /^https?:/.test(ev.link.href) ? ' target="_blank" rel="noopener"' : ""
                  }>${esc(ev.link.label)}</a>`
                : ""
            }
          </div>`;

  const main = `
          <span class="event__main">
            <span class="event__time">${esc(ev.time)}</span>
            <span class="event__title">${esc(ev.title)}</span>
            ${ev.place ? `<span class="event__place">${esc(ev.place)}</span>` : ""}
            ${ev.blurb ? `<span class="event__blurb">${esc(ev.blurb)}</span>` : ""}
          </span>`;

  if (!expandable) {
    return `
        <div class="event">
          <div class="event__summary" style="cursor:default">
            <span class="event__icon" aria-hidden="true">${icon(ev.icon)}</span>${main}
          </div>
          ${ev.mapsUrl || ev.link ? `<div class="event__detail" style="border-top:0;padding-top:0">${actions}</div>` : ""}
        </div>`;
  }

  return `
        <div class="event">
          <button type="button" class="event__summary" data-event-toggle aria-expanded="false" aria-controls="${panelId}">
            <span class="event__icon" aria-hidden="true">${icon(ev.icon)}</span>${main}
            <span class="event__chevron" aria-hidden="true">+</span>
          </button>
          <div class="event__detail" id="${panelId}" hidden>
            <dl>
              ${details.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("\n              ")}
            </dl>
            ${actions}
          </div>
        </div>`;
}

export default function schedule(W) {
  const photosFor = (day) => (day.venue.photos === "museum" ? W.museumPhotos : W.venuePhotos);

  const tabs = W.days
    .map(
      (d, i) => `
        <button type="button" class="day-tab" role="tab" id="tab-${d.id}" aria-controls="panel-${d.id}"
                aria-selected="${i === 0}" data-day-tab="${d.id}"${i === 0 ? "" : ' tabindex="-1"'}>
          <span class="day-tab__weekday">${esc(d.weekday)}</span>
          <span class="day-tab__date">${esc(d.dateLabel)}</span>
          <span class="day-tab__short">${esc(d.short)}</span>
        </button>`
    )
    .join("");

  const panels = W.days
    .map(
      (d, i) => `
      <div class="day-panel" role="tabpanel" id="panel-${d.id}" aria-labelledby="tab-${d.id}" data-day-panel="${d.id}"${
        i === 0 ? "" : " hidden"
      }>
        <div class="day-panel__head">
          <h2>${esc(d.title)}</h2>
          <span class="day-panel__date">${esc(d.longDate)}</span>
        </div>
        <p class="day-panel__intro">${esc(d.intro)}</p>
        <div class="day-panel__events">
          ${d.events.length ? d.events.map((e, j) => eventHtml(e, d.id, j)).join("") : `<p class="day-panel__empty">Nothing scheduled. Head to <a href="${url("/explore/")}">Explore</a> for ideas.</p>`}
        </div>
      </div>`
    )
    .join("");

  const venues = W.days
    .map(
      (d, i) => `
    <div data-venue-panel="${d.id}"${i === 0 ? "" : " hidden"}>
      <div class="venue-section__head">
        <p class="eyebrow">${esc(d.venue.label)}</p>
        <h2>${esc(d.venue.name)}</h2>
        <p>${esc(d.venue.blurb)}</p>
      </div>
      <div class="venue-gallery" aria-roledescription="carousel" aria-label="${esc(d.venue.name)} photos">
        <div class="venue-gallery__track" data-gallery-track>
          ${photosFor(d)
            .map((p) => `<img src="${asset(p.src)}" alt="${esc(p.alt)}" loading="lazy">`)
            .join("\n          ")}
        </div>
        <button type="button" class="venue-gallery__btn venue-gallery__btn--prev" data-gallery-prev aria-label="Previous photos">‹</button>
        <button type="button" class="venue-gallery__btn venue-gallery__btn--next" data-gallery-next aria-label="Next photos">›</button>
      </div>
      ${d.venue.credit ? `<p class="venue-credit">${esc(d.venue.credit)}</p>` : ""}
    </div>`
    )
    .join("");

  const body = `
<main>
  <section class="section">
    <div class="wrap">
      <div class="page-head">
        <p class="eyebrow">The itinerary</p>
        <h1>Here's the schedule.</h1>
        <p>Pick a day. Tap any event for dress code, transport and more details.</p>
      </div>

      <div class="day-tabs" role="tablist" aria-label="Days">${tabs}
      </div>
      ${panels}
    </div>
  </section>

  <section class="venue-section">
    <div class="wrap">${venues}
    </div>
  </section>
</main>`;

  return {
    route: "/schedule/",
    title: "Schedule · Amanda & Nik",
    desc: "Day by day: the Wednesday welcome party at the Markus Wasmeier museum, the wedding at the Stögeralm, and a slow Friday by the lake.",
    current: "schedule",
    body,
    scripts: ["scripts/schedule.js"]
  };
}
