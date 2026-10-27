# Amanda & Nik · Schliersee, 17 June 2027

The wedding website. Ten pages, a live RSVP that writes to a Google Sheet, and
Daisy, the couple's dog, answering guest questions in a chat widget.

Built as a plain static site so it can live on GitHub Pages for free, forever,
with nothing to keep running.

| | |
|---|---|
| **Pages** | `/` · `/story/` · `/schedule/` · `/travel/` · `/stay/` · `/explore/` · `/wear/` · `/guests/` · `/faq/` · `/rsvp/` |
| **Stack** | Node build script, no dependencies. Plain HTML, CSS and ES modules out the other end. |
| **Hosting** | GitHub Pages, deployed by GitHub Actions on every push to `main`. |
| **RSVP** | Google Apps Script web app → the guest-list spreadsheet. |
| **Ask Daisy** | Optional serverless proxy to the Anthropic API, with an offline fallback. |

---

## Editing the content

**Almost everything guests read lives in one file: [`src/data/wedding-data.js`](src/data/wedding-data.js).**
Schedule, hotels, things to do, restaurants, FAQs, map pins, dress codes, the
pack list, the home-page chapters. Change it there and every page that uses it
updates on the next build.

Things that are *not* in that file, because they appear exactly once:

| What | Where |
|---|---|
| Home-page hero, the "three things to do quickly" block, the closing RSVP block | [`src/pages/home.js`](src/pages/home.js) |
| Amanda's and Nik's story copy | [`src/pages/story.js`](src/pages/story.js) |
| Travel page route steps and the "getting around" cards | [`src/pages/travel.js`](src/pages/travel.js) |
| June weather numbers | [`src/pages/wear.js`](src/pages/wear.js) |
| Colours, type, spacing | [`src/styles/site.css`](src/styles/site.css) (design tokens live at the top) |

Photos go in `public/assets/`. Reference them as `assets/<name>.jpg` — the build
adds the right prefix.

```bash
npm run dev     # build, then preview on http://localhost:4173
npm run build   # just build into dist/
```

No `npm install` needed. Node 18 or newer.

---

## Deploying

The site deploys itself. Push to `main` and the
[Pages workflow](.github/workflows/pages.yml) builds `dist/` and publishes it.

First time only, in the repository: **Settings → Pages → Build and deployment →
Source: GitHub Actions**.

The build reads three environment variables, all set for you by the workflow:

- `BASE_URL` — the path the site is served from. `/` for a user site,
  `/<repo>/` for a project site. Needed because every link and image is
  prefixed with it.
- `SITE_ORIGIN` — used to write `sitemap.xml`.
- `CNAME` — a custom domain. To use one, add a repository **variable** named
  `CNAME` (Settings → Secrets and variables → Actions → Variables) set to e.g.
  `amandaandnik.com`, point the domain's DNS at GitHub Pages, then tick
  *Enforce HTTPS* under Settings → Pages.

To build a project-site copy locally:

```bash
BASE_URL=/amanda-nik-wedding/ npm run build
```

---

## The RSVP

1. A guest types their first and last name on `/rsvp/`.
2. The page `GET`s the Apps Script URL, which returns **names and plus-one info
   only** — no phone numbers or addresses leave the sheet.
3. Names are matched case- and accent-insensitively against each party's
   members, nicknames (`also`) and named plus-one. One match opens that whole
   party; several offer a "did you mean" list; none offers a manual reply.
4. Submitting `POST`s one JSON payload; the script appends one row per guest to
   a tab called **RSVPs**, creating it if needed.

The server side is [`server/rsvp-apps-script.gs`](server/rsvp-apps-script.gs).
Setup steps are in its header. **To redeploy after editing it:** Apps Script →
Deploy → Manage deployments → edit the deployment → New version. The `/exec`
URL stays the same, so nothing in this repo changes.

Two things worth knowing:

- Apps Script web apps don't answer CORS preflight, so the POST goes out as
  `text/plain` with a JSON body in `no-cors` mode. That is deliberate — don't
  "fix" it to `application/json`, it will stop working. It also means the
  browser can't read the response, only confirm the request left.
- If `sheetScriptUrl` is empty, the page falls back to the sample `invitees[]`
  list in the data file.

### Still to test

The lookup has been checked end to end against the live sheet (it returns the
real party list and opens the right party). **A real submission has not been
sent**, because that writes a row into the live spreadsheet. Before launch,
submit one test RSVP, confirm the row lands on the RSVPs tab, and delete it.

---

## Ask Daisy

The chat widget works in two modes:

- **Without a proxy** (the default): Daisy answers from keyword matching
  against the FAQ in the data file. No network, no cost, no key. Good answers
  for the common questions, nothing more.
- **With a proxy**: set `daisyEndpoint` in the data file to a URL that accepts
  `{ question }` and returns `{ answer }`. [`server/daisy-worker.js`](server/daisy-worker.js)
  is a ready-to-deploy Cloudflare Worker that holds the Anthropic API key,
  builds the prompt server-side, rate-limits by IP and restricts CORS to the
  site origin. Deployment steps are in its header.

**Never put an API key in this repo.** The site is public and so is everything
it ships.

If the proxy is down or slow, the client silently uses the fallback. Daisy's
replies have any em or en dashes stripped, and markdown links like
`[the Travel page](/travel/)` become real in-site links.

---

## Before launch

- [ ] **Venue photos.** The Stögeralm photos on the Schedule and What to Wear
      pages are still hotlinked from `stoegeralm.de`. Get permission, then run
      `npm run fetch-venue-photos` and paste the printed paths into
      `venuePhotos` in the data file.
- [ ] **More museum photos** for the Wednesday carousel (`museumPhotos`).
      There are two.
- [ ] **Confirm the ceremony time** in `weddingISO` — the countdown and the
      calendar maths both read it.
- [ ] **`contactEmail`** is a placeholder.
- [ ] **Nik's story copy** on `/story/` is a stub.
- [ ] **Tracht rental link** on `/wear/` is `#RENT-LINK-PLACEHOLDER`.
- [ ] **Room-block codes and final booking links** on `/stay/`.
- [ ] **Send one test RSVP** (see above).
- [ ] Decide whether to deploy the Daisy proxy.

---

## How the build works

`build.mjs` imports the data, renders each page module to
`dist/<route>/index.html`, and copies `public/`, `src/styles/` and
`src/scripts/` across. It also writes `.nojekyll`, a `404.html` that keeps the
nav, and `scripts/daisy-data.js` (the FAQ copy Daisy's fallback needs).

```
build.mjs                 the whole build
serve.mjs                 local preview with clean URLs
src/data/wedding-data.js  ← the content
src/components/           layout, helpers, icons
src/pages/                one module per route
src/styles/site.css       design tokens and every style
src/scripts/              browser code, one file per page plus site.js
public/assets/            photos, the monogram, Daisy, the script font
server/                   Apps Script RSVP backend, Daisy Worker
scripts/                  one-off maintenance scripts
```

Each page module returns `{ route, title, desc, current, body, head?, scripts? }`
and the layout wraps it. Adding a page means writing a module and adding it to
the `PAGES` array in `build.mjs` (and to `NAV_LINKS` in
`src/components/layout.js` if it should appear in the nav).

### Notes for whoever picks this up next

- **The fixed nav measures itself.** Hardcoding its height left a 2px gap above
  the home hero when the logo grew. `site.js` measures the bar and sets both
  `body { padding-top }` and the `--nav-h` custom property, which the home
  scroll-progress bar sits against.
- **`[hidden]` is the toggle everywhere**, and it is forced with `!important`
  because the components set `display` themselves.
- **Fonts**: Playfair Display and Montserrat from Google Fonts, New Icon Script
  self-hosted (licensed `.otf`, plus a `.woff2` generated from it). The
  `@font-face` URL is relative to the stylesheet so it survives a base path.
- **Images** were compressed for the web; the garden-attire screenshots were
  converted from PNG to JPEG, which took them from 9 MB to under 2 MB.
- **d3 and topojson** load from a CDN on the Our Story page only, with subresource
  integrity. If they fail, the map simply doesn't draw.
