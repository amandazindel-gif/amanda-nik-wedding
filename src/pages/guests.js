import { esc, url } from "../components/util.js";

export default function guests(W) {
  const list = W.guests || [];

  const directory = list
    .map(
      (g) => `
          <div class="guest-card">
            <p class="guest-card__name">${esc(g.name)}</p>
            <p class="guest-card__side">${esc(g.side || "")}</p>
            <div class="guest-card__links">
              ${g.phone ? `<a href="tel:${esc(String(g.phone).replace(/[^+0-9]/g, ""))}">${esc(g.phone)}</a>` : ""}
              ${g.email ? `<a href="mailto:${esc(g.email)}">${esc(g.email)}</a>` : ""}
            </div>
          </div>`
    )
    .join("");

  const empty = `
      <div class="guests-empty">
        <p class="guests-empty__eyebrow">Coming soon</p>
        <h2>This will fill up as the RSVPs come in.</h2>
        <p>Once we know who's joining us, we'll list everyone here with their preferred contact information. This is only for guests who tick the box on the RSVP form. We won't add anyone to the list who doesn't want to be included.</p>
        <a class="btn btn--primary btn--caps" href="${url("/rsvp/")}" style="min-height:48px;padding:0 22px">RSVP now</a>
      </div>`;

  const body = `
<main>
  <section class="section section--last">
    <div style="max-width:900px;margin:0 auto">
      <div class="page-head" style="margin-bottom:26px">
        <p class="eyebrow">Who's coming</p>
        <h1>The little black book</h1>
        <p style="max-width:54ch;color:var(--nav-link);text-wrap:pretty">A shared contact list, so you can round people up for breakfast, split a taxi from the station, or find out who else is on your flight.</p>
      </div>
      ${list.length ? `<div class="guest-grid">${directory}\n      </div>` : empty}
    </div>
  </section>
</main>`;

  return {
    route: "/guests/",
    title: "Who's coming · Amanda & Nik",
    desc: "A shared contact list for guests travelling to Schliersee, for everyone who opts in on their RSVP.",
    current: "guests",
    body
  };
}
