/* Shared page shell: <head>, nav, footer and the Ask Daisy widget.
   Everything a page has in common lives here, so pages only ship their own
   <main>. */

import { esc, url, asset } from "./util.js";

export const NAV_LINKS = [
  { id: "story", label: "Our Story", href: "/story/" },
  { id: "schedule", label: "Schedule", href: "/schedule/" },
  { id: "travel", label: "Travel", href: "/travel/" },
  { id: "stay", label: "Stay", href: "/stay/" },
  { id: "explore", label: "Explore", href: "/explore/" },
  { id: "wear", label: "What to Wear", href: "/wear/" },
  { id: "guests", label: "Guests", href: "/guests/" },
  { id: "faq", label: "FAQ", href: "/faq/" }
];

const FOOTER_LINKS = [{ id: "home", label: "Home", href: "/" }]
  .concat(NAV_LINKS)
  .concat([{ id: "rsvp", label: "RSVP", href: "/rsvp/" }]);

function navHtml(current) {
  const mark = (id) => (id === current ? ' aria-current="page"' : "");
  return `
<header class="site-nav" data-site-nav>
  <div class="site-nav__bar">
    <a class="site-nav__logo" href="${url("/")}" aria-label="Amanda and Nik, home">
      <img src="${asset("assets/monogram.png")}" alt="" width="69" height="52">
    </a>
    <div class="site-nav__spacer" aria-hidden="true"></div>
    <nav class="site-nav__links" aria-label="Sections">
      ${NAV_LINKS.map((l) => `<a class="site-nav__link" href="${url(l.href)}"${mark(l.id)}>${esc(l.label)}</a>`).join("\n      ")}
    </nav>
    <button type="button" class="site-nav__burger" data-nav-burger aria-label="Open menu" aria-expanded="false" aria-controls="site-nav-panel">
      <span></span><span></span><span></span>
    </button>
    <a class="site-nav__rsvp" href="${url("/rsvp/")}"${mark("rsvp")}>RSVP</a>
  </div>
  <div class="site-nav__panel" id="site-nav-panel" data-nav-panel data-open="false">
    <nav aria-label="Sections, mobile">
      ${NAV_LINKS.concat([{ id: "rsvp", label: "RSVP", href: "/rsvp/" }])
        .map((l) => `<a class="site-nav__mobile-link" href="${url(l.href)}"${mark(l.id)}>${esc(l.label)}</a>`)
        .join("\n      ")}
    </nav>
  </div>
</header>`;
}

function footerHtml() {
  return `
<footer class="site-footer">
  <img class="site-footer__daisy" src="${asset("assets/daisy-footer.png")}" alt="" aria-hidden="true">
  <img class="site-footer__mark" src="${asset("assets/monogram.png")}" alt="Amanda and Nik monogram" width="56" height="56">
  <p>Stögeralm, Schliersee · Bavarian Alps</p>
  <nav aria-label="All pages">
    ${FOOTER_LINKS.map((l) => `<a href="${url(l.href)}">${esc(l.label)}</a>`).join("\n    ")}
  </nav>
</footer>`;
}

function daisyHtml(chips) {
  return `
<div class="daisy-peek" data-daisy-peek>
  <div class="daisy-peek__bubble">How's your Daisy? Any questions about the trip?</div>
  <button type="button" class="daisy-peek__btn" data-daisy-open aria-label="Ask Daisy a question">
    <img src="${asset("assets/daisy-standing.png")}" alt="">
  </button>
</div>

<div class="daisy-chat" data-daisy-chat role="dialog" aria-label="Ask Daisy" aria-modal="false" data-open="false">
  <div class="daisy-chat__head">
    <img src="${asset("assets/daisy-line.png")}" alt="">
    <div style="flex:1">
      <h2>Ask Daisy</h2>
      <p class="daisy-chat__role">Chief question answerer</p>
    </div>
    <button type="button" class="daisy-chat__close" data-daisy-close aria-label="Close chat">×</button>
  </div>
  <div class="daisy-chat__log" data-daisy-log role="log" aria-live="polite"></div>
  <div class="daisy-chat__chips" data-daisy-chips data-initial="${esc(JSON.stringify(chips))}"></div>
  <form class="daisy-chat__form" data-daisy-form>
    <input data-daisy-input type="text" autocomplete="off" placeholder="Ask me anything…" aria-label="Your question">
    <button type="submit">Ask</button>
  </form>
</div>`;
}

/**
 * @param {object} page
 * @param {string} page.title      full <title>
 * @param {string} page.desc       meta description
 * @param {string} page.current    nav id to mark as current
 * @param {string} page.body       the page's <main>
 * @param {string} [page.head]     extra tags for <head>
 * @param {string[]} [page.scripts] module scripts to load, relative to the site root
 * @param {object} config
 */
export function layout(page, config) {
  const { title, desc, current, body, head = "", scripts = [] } = page;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#FAF5EC">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${asset("assets/hero-c.jpg")}">
<link rel="icon" href="${asset("assets/monogram.png")}" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="${asset("assets/fonts/NewIconScript.woff2")}" as="font" type="font/woff2" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&amp;family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="${asset("styles/site.css")}">
<script>window.__WED_BASE = ${JSON.stringify(config.base)};</script>
${head}
</head>
<body>
${navHtml(current)}
${body}
${footerHtml()}
${daisyHtml(config.daisyChips)}
<script type="module" src="${asset("scripts/site.js")}"></script>
${scripts.map((s) => `<script type="module" src="${asset(s)}"></script>`).join("\n")}
</body>
</html>
`;
}
