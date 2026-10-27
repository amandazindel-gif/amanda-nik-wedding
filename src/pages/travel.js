import { esc, asset } from "../components/util.js";

const TRAIN_URL =
  "https://www.google.com/maps/dir/?api=1&origin=Munich+Airport+(MUC)&destination=Schliersee+Bahnhof,+83727+Schliersee&travelmode=transit";
const DRIVE_URL =
  "https://www.google.com/maps/dir/?api=1&origin=Munich+Airport+(MUC)&destination=Schliersee,+Germany&travelmode=driving";

function step(title, note, last) {
  return `
              <li class="step">
                <span class="step__marker" aria-hidden="true">
                  <span class="step__dot"></span>
                  ${last ? "" : '<span class="step__line"></span>'}
                </span>
                <span class="step__text">
                  <span class="step__title">${esc(title)}</span>
                  <span class="step__note">${esc(note)}</span>
                </span>
              </li>`;
}

function mapSrc(pin) {
  const q = pin.address || (pin.lat && pin.lng ? `${pin.lat},${pin.lng} (${pin.name})` : `${pin.name}, Bayern, Germany`);
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=14&output=embed`;
}

export default function travel(W) {
  const pins = W.pins;
  const first = pins[0];

  const chips = pins
    .map(
      (p, i) =>
        `<button type="button" class="pin-chip" data-pin="${i}" aria-pressed="${i === 0}">${esc(p.name)}</button>`
    )
    .join("\n              ");

  const body = `
<main>
  <section style="padding:20px 16px 0">
    <div class="wrap">
      <div class="travel-hero">
        <img src="${asset("assets/explore-lake-shore.jpg")}" alt="The Schliersee under big summer clouds, mountains reflected in the water" fetchpriority="high">
        <div class="travel-hero__scrim" aria-hidden="true"></div>
        <div class="travel-hero__text">
          <p class="travel-hero__eyebrow">Travel</p>
          <h1>Getting to Schliersee</h1>
        </div>
      </div>
      <div class="travel-lede">
        <p><b>Fly into Munich (MUC). If you're already in Europe, budget airlines also fly into Memmingen (FMM), though it adds logistical complexity. From MUC, it's an easy train ride or drive south to Schliersee.</b> Nothing starts until Wednesday evening, but we recommend arriving Tuesday so you have time to explore.</p>
        <div class="travel-lede__actions">
          <a class="btn btn--primary btn--caps" href="${TRAIN_URL}" target="_blank" rel="noopener">Train directions</a>
          <a class="btn btn--outline btn--caps" href="${DRIVE_URL}" target="_blank" rel="noopener">Driving directions</a>
        </div>
      </div>
    </div>
  </section>

  <section style="padding:28px 16px 0">
    <div class="wrap">
      <div class="page-head" style="margin-bottom:22px">
        <h2 style="margin:0;font-family:var(--serif);font-weight:600;font-size:clamp(28px,5vw,44px);color:var(--ink)">The most important destinations.</h2>
        <p style="margin:8px auto 0;max-width:52ch;font-size:16px;color:var(--nav-link)">Schliersee is a quaint German town and very easy to navigate, but to ensure no one gets lost, we've included the most important locations on the map below.</p>
      </div>
      <div class="map-split">
        <div class="map-frame">
          <iframe title="Google map of Schliersee showing the selected location" data-pin-map src="${esc(mapSrc(first))}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
        </div>
        <div>
          <div class="pin-card">
            <p class="pin-card__kind" data-pin-kind>${esc(first.kind)}</p>
            <h3 data-pin-name>${esc(first.name)}</h3>
            <p data-pin-desc>${esc(first.desc)}</p>
            <a class="btn btn--primary" data-pin-link href="${esc(first.mapsUrl)}" target="_blank" rel="noreferrer">Directions</a>
          </div>
          <div class="pin-chips">
              ${chips}
          </div>
        </div>
      </div>
    </div>
  </section>

  <section style="padding:48px 16px 0">
    <div class="route-card">
      <div class="route-card__head">
        <div>
          <p class="route-card__eyebrow">The route</p>
          <h2>From the airport to the lake</h2>
        </div>
        <div class="mode-tabs" role="tablist" aria-label="How you're travelling">
          <button type="button" class="mode-tab" role="tab" id="tab-train" aria-controls="panel-train" aria-selected="true" data-mode="train">By train</button>
          <button type="button" class="mode-tab" role="tab" id="tab-car" aria-controls="panel-car" aria-selected="false" data-mode="car" tabindex="-1">By car</button>
        </div>
      </div>

      <div class="mode-panel" role="tabpanel" id="panel-train" aria-labelledby="tab-train" data-mode-panel="train">
        <div>
          <ol class="steps">
            ${step("Munich Airport (MUC)", "Follow the green S signs down to the S-Bahn and ride into the city.", false)}
            ${step("München Hauptbahnhof", "Change to the blue-and-white BRB toward Bayrischzell. Roughly hourly.", false)}
            ${step("Schliersee", "Hop off at Schliersee. The village and the lake are a short walk away.", true)}
          </ol>
          <div class="route-card__actions">
            <a class="btn btn--primary btn--caps" href="${TRAIN_URL}" target="_blank" rel="noopener">Train directions</a>
            <a class="btn btn--outline btn--caps" href="https://www.mvg.de/services/mobile-services/mvgo.html" target="_blank" rel="noopener">Get the MVGO app</a>
          </div>
          <p class="route-card__fine">Buy tickets at the machine on the platform (cards and cash) or in the app. The same line runs past Schliersee toward Bayrischzell if you want to keep exploring.</p>
        </div>
        <div class="route-photos">
          <img src="${asset("assets/travel-platform.jpg")}" alt="Nik giving two thumbs up on the platform at Schliersee station, the blue-and-white BRB train beside him" loading="lazy">
          <img src="${asset("assets/travel-ticket-machine.jpg")}" alt="The blue BRB ticket machine on the Schliersee platform, a train to München Hbf waiting behind it" loading="lazy">
        </div>
      </div>

      <div class="mode-panel" role="tabpanel" id="panel-car" aria-labelledby="tab-car" data-mode-panel="car" hidden>
        <div>
          <ol class="steps">
            ${step("Munich Airport (MUC)", "Pick up your car and head toward the A8.", false)}
            ${step("A8, then A952 and B307", "Easy and scenic, and handy if you want to explore the region.", false)}
            ${step("Schliersee", "About an hour door to door, traffic willing.", true)}
          </ol>
          <div class="route-card__actions">
            <a class="btn btn--primary btn--caps" href="${DRIVE_URL}" target="_blank" rel="noopener">Driving directions</a>
            <a class="btn btn--outline btn--caps" href="https://www.google.com/maps/search/parking+Schliersee" target="_blank" rel="noopener">Parking options</a>
          </div>
        </div>
        <div class="parking-note">
          <p class="parking-note__eyebrow">About parking</p>
          <p>Village parking is fine, and hotel parking runs about $20 a day.</p>
          <p><strong>Parking at the alm is very limited</strong>, so please take the shuttle on the wedding day.</p>
        </div>
      </div>
    </div>
  </section>

  <section style="padding:20px 16px 64px">
    <div class="getting-around">
      <div class="getting-around__head">
        <p>Once you're here</p>
        <h2>Getting around</h2>
      </div>
      <div>
        <span class="getting-around__icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4.5" r="1.8"/><path d="M10.5 21l2-6.5-2.5-2.5 1-4.5 3 2.5 2.5 1"/><path d="M11 8L8 10l-1 3.5"/><path d="M12.5 14.5L15 17l1 4"/></svg></span>
        <h3>On foot</h3>
        <p class="getting-around__copy">Schliersee is small and walkable. Hotels, cafés and the lake are all a few minutes apart.</p>
      </div>
      <div>
        <span class="getting-around__icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="12" height="13" rx="3"/><path d="M6 10h12"/><circle cx="9" cy="13" r="0.6" fill="currentColor"/><circle cx="15" cy="13" r="0.6" fill="currentColor"/><path d="M8 19l-2 2M16 19l2 2M9 16l-1 3h8l-1-3"/></svg></span>
        <h3>Welcome party</h3>
        <p class="getting-around__copy">Hop on the train. It's clean, easy, and just one stop to the other side of the lake.</p>
      </div>
      <div>
        <span class="getting-around__icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9"/><path d="M3 16h18v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M4 11h16"/><circle cx="7.5" cy="19.5" r="1.3"/><circle cx="16.5" cy="19.5" r="1.3"/></svg></span>
        <h3>Wedding day</h3>
        <p class="getting-around__copy">We'll run shuttles up to the alm and send times closer to the day.</p>
      </div>
    </div>
  </section>
</main>`;

  return {
    route: "/travel/",
    title: "Travel · Amanda & Nik",
    desc: "Munich Airport to Schliersee by train or car, the key addresses on a map, and how to get around once you arrive.",
    current: "travel",
    body,
    head: `<script>window.__WED_PINS = ${JSON.stringify(
      pins.map((p) => ({ kind: p.kind, name: p.name, desc: p.desc, mapsUrl: p.mapsUrl, mapSrc: mapSrc(p) }))
    )};</script>`,
    scripts: ["scripts/travel.js"]
  };
}
