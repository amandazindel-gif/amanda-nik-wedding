import { esc, url } from "../components/util.js";

/* Guests who opted in live in the RSVP spreadsheet, not in this repo, so the
   directory is fetched at runtime. Anything in `guests` in the data file is
   rendered server-side as a seed and replaced once the fetch lands. */
export function guestCard(g) {
  return `
          <div class="guest-card">
            <p class="guest-card__name">${esc(g.name)}</p>
            ${g.side ? `<p class="guest-card__side">${esc(g.side)}</p>` : ""}
            <div class="guest-card__links">
              ${g.phone ? `<a href="tel:${esc(String(g.phone).replace(/[^+0-9]/g, ""))}">${esc(g.phone)}</a>` : ""}
              ${g.email ? `<a href="mailto:${esc(g.email)}">${esc(g.email)}</a>` : ""}
            </div>
          </div>`;
}

export default function guests(W) {
  const seed = W.guests || [];

  const body = `
<main>
  <section class="section section--last">
    <div style="max-width:900px;margin:0 auto">
      <div class="page-head" style="margin-bottom:26px">
        <p class="eyebrow">Who's coming</p>
        <h1>The little black book</h1>
        <p style="max-width:54ch;color:var(--nav-link);text-wrap:pretty">A shared contact list, so you can round people up for breakfast, split a taxi from the station, or find out who else is on your flight.</p>
      </div>

      <p class="result-count" data-guest-count aria-live="polite" ${seed.length ? "" : "hidden"}>${
        seed.length ? `${seed.length} ${seed.length === 1 ? "guest" : "guests"}` : ""
      }</p>

      <div class="guest-grid" data-guest-grid ${seed.length ? "" : "hidden"}>${seed.map(guestCard).join("")}
      </div>

      <div class="guests-empty" data-guest-loading ${seed.length ? "hidden" : ""}>
        <p class="guests-empty__eyebrow">One moment</p>
        <h2>Fetching the list…</h2>
      </div>

      <div class="guests-empty" data-guest-empty hidden>
        <p class="guests-empty__eyebrow">Coming soon</p>
        <h2>This will fill up as the RSVPs come in.</h2>
        <p>Once we know who's joining us, we'll list everyone here with their preferred contact information. This is only for guests who tick the box on the RSVP form. We won't add anyone to the list who doesn't want to be included.</p>
        <a class="btn btn--primary btn--caps" href="${url("/rsvp/")}" style="min-height:48px;padding:0 22px">RSVP now</a>
      </div>

      <div class="guests-empty" data-guest-error hidden>
        <p class="guests-empty__eyebrow">Hmm</p>
        <h2>The list didn't load.</h2>
        <p>Refresh the page and it'll usually sort itself out. If it keeps happening, text Amanda or Nik.</p>
      </div>
    </div>
  </section>
</main>`;

  return {
    route: "/guests/",
    title: "Who's coming · Amanda & Nik",
    desc: "A shared contact list for guests travelling to Schliersee, for everyone who opts in on their RSVP.",
    current: "guests",
    body,
    head: `<script>window.__WED_GUESTS = ${JSON.stringify({ sheetScriptUrl: W.sheetScriptUrl })};</script>`,
    scripts: ["scripts/guests.js"]
  };
}
