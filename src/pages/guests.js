import { esc, url } from "../components/util.js";

/* Guests who opted in live in the RSVP spreadsheet, not in this repo, so the
   table is filled at runtime from the "Guest list" tab. Anything in `guests`
   in the data file is rendered server-side as a seed and replaced once the
   fetch lands. */
export function guestRow(g) {
  return `
            <tr>
              <th scope="row">${esc(g.name)}</th>
              <td>${esc(g.side || "")}</td>
              <td>${g.phone ? `<a href="tel:${esc(String(g.phone).replace(/[^+0-9]/g, ""))}">${esc(g.phone)}</a>` : ""}</td>
              <td>${g.email ? `<a href="mailto:${esc(g.email)}">${esc(g.email)}</a>` : ""}</td>
            </tr>`;
}

export default function guests(W) {
  const seed = W.guests || [];

  const body = `
<main>
  <section class="section section--last">
    <div style="max-width:1000px;margin:0 auto">
      <div class="page-head" style="margin-bottom:26px">
        <p class="eyebrow">Who's coming</p>
        <h1>The little black book</h1>
        <p style="max-width:54ch;color:var(--nav-link);text-wrap:pretty">A shared contact list, so you can round people up for breakfast, split a taxi from the station, or find out who else is on your flight.</p>
      </div>

      <div class="guest-table-wrap" data-guest-table ${seed.length ? "" : "hidden"}>
        <div class="guest-table__bar">
          <p class="result-count" data-guest-count aria-live="polite" style="margin:0">${
            seed.length ? `${seed.length} ${seed.length === 1 ? "guest" : "guests"}` : ""
          }</p>
          <label class="guest-table__search">
            <span class="visually-hidden">Filter the guest list</span>
            <input type="search" data-guest-filter placeholder="Filter by name…" autocomplete="off">
          </label>
        </div>
        <div class="guest-table__scroll">
          <table class="guest-table">
            <thead>
              <tr>
                <th scope="col"><button type="button" data-sort="name" aria-label="Sort by name">Name</button></th>
                <th scope="col"><button type="button" data-sort="side" aria-label="Sort by side">Side</button></th>
                <th scope="col">Phone</th>
                <th scope="col">Email</th>
              </tr>
            </thead>
            <tbody data-guest-body>${seed.map(guestRow).join("")}
            </tbody>
          </table>
        </div>
        <p class="guest-table__none" data-guest-none hidden>No one matches that.</p>
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
