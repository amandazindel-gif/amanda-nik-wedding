import { esc, url, asset } from "../components/util.js";

export default function home(W) {
  const chapters = W.chapters
    .map(
      (c, i) => `
      <article class="chapter" id="chapter-${i + 1}">
        <div class="chapter__media">
          <img src="${asset(c.photo)}" alt="${esc(c.photoAlt)}"${i > 0 ? ' loading="lazy"' : ""}${
            c.filter ? ` style="filter:${esc(c.filter)}"` : ""
          }>
        </div>
        <div class="chapter__text">
          <p class="chapter__when">${esc(c.when)}</p>
          <h2 class="chapter__title">${esc(c.title)}</h2>
          <p class="chapter__body">${esc(c.body)}</p>
          <dl class="chapter__meta">
            <div>
              <dt>Where</dt>
              <dd>${esc(c.where)}</dd>
            </div>
          </dl>
          <a class="btn btn--forest chapter__cta" href="${url(c.href)}">${esc(c.cta)}</a>
        </div>
      </article>`
    )
    .join("");

  const strip = W.venuePhotos
    .slice(0, 6)
    .map((p) => `<img src="${asset(p.src)}" alt="${esc(p.alt)}" loading="lazy">`)
    .join("\n          ");

  const body = `
<main>
  <div class="scroll-progress" data-under-nav>
    <div><div class="scroll-progress__bar" data-scroll-progress></div></div>
  </div>

  <section class="hero">
    <img class="hero__img" src="${asset("assets/hero-c.jpg")}" alt="Amanda and Nik leaning against a rock at sunset, drinking from cans against a big cloudy sky" fetchpriority="high">
    <div class="hero__scrim" aria-hidden="true"></div>
    <div class="hero__inner">
      <p class="hero__date">Thursday, June 17, 2027 · Schliersee, Bavaria, Germany</p>
      <h1 class="hero__names">Amanda <span class="hero__amp" aria-hidden="true">&amp;</span><span class="visually-hidden">and</span> Nik</h1>
      <div class="hero__actions">
        <a class="hero__btn hero__btn--solid" href="${url("/rsvp/")}">RSVP</a>
        <a class="hero__btn hero__btn--ghost" href="#chapter-1">Start the journey</a>
      </div>
      <div class="countdown" data-countdown data-target="${esc(W.weddingISO)}" aria-label="Countdown to the wedding">
        <div class="countdown__unit"><span class="countdown__v" data-unit="days">—</span><span class="countdown__k">days</span></div>
        <div class="countdown__unit"><span class="countdown__v" data-unit="hrs">—</span><span class="countdown__k">hrs</span></div>
        <div class="countdown__unit"><span class="countdown__v" data-unit="min">—</span><span class="countdown__k">min</span></div>
        <div class="countdown__unit"><span class="countdown__v" data-unit="sec">—</span><span class="countdown__k">sec</span></div>
      </div>
    </div>
  </section>

  <section class="home-lede">
    <div class="home-lede__grid">
      <p class="home-lede__eyebrow">Meet us in the Bavarian Alps</p>
      <p class="home-lede__line">Stunning views, lake swims, meadow vows, and a dance floor that'll run on beer and brezen.</p>
    </div>
  </section>

  <section class="chapters">
    <div class="chapters__list">${chapters}
    </div>
  </section>

  <section class="todo-block">
    <div class="todo-block__inner">
      <p class="todo-block__eyebrow">Before you book anything</p>
      <h2>Three things to do quickly.</h2>
      <div class="todo-block__grid">
        <div class="todo-block__item">
          <h3>Put a tracker on flights</h3>
          <p>Four to six months out is the sweet spot for transatlantic fares. Set an alert on Munich (MUC) now and pounce when it drops.</p>
          <a href="${url("/travel/")}">Getting here →</a>
        </div>
        <div class="todo-block__item">
          <h3>Beds go fast</h3>
          <p>June is high season and most places want 2–3 nights minimum. We have rooms reserved at two hotels, but there are also other holiday apartments, Airbnb's, etc. Either way, grab your room quickly, the village is small.</p>
          <a href="${url("/stay/")}">Where to stay →</a>
        </div>
        <div class="todo-block__item">
          <h3>Passport expiration check</h3>
          <p>Go look at yours today! It has to be valid at least three months past the trip and issued within the last ten years. Renewals take a while, so make sure yours is up to date!</p>
          <a href="${url("/faq/")}">Travel docs &amp; FAQ →</a>
        </div>
      </div>
    </div>
  </section>

  <section class="strip">
    <div class="wrap-wide">
      <div class="strip__head">
        <h2>This is the place</h2>
        <a href="${url("/schedule/")}" style="font-size:15px;font-weight:700">Full gallery and schedule →</a>
      </div>
      <div class="strip__grid">
          ${strip}
      </div>
    </div>
  </section>

  <section class="closer">
    <div class="closer__inner">
      <p class="closer__script">One more thing</p>
      <h2>Tell us you're coming</h2>
      <p>It takes about a minute, and it lets us plan hotels, shuttles, food and how much beer is enough (but the limit may not exist). Due to our limited capacity, we ask you<br><b>please reply by ${esc(W.rsvpDeadline)}.</b></p>
      <a class="btn btn--primary btn--raised" href="${url("/rsvp/")}">RSVP now</a>
    </div>
  </section>
</main>`;

  return {
    route: "/",
    title: "Amanda & Nik · Schliersee, 17 June 2027",
    desc: "Amanda and Nik are getting married at the Stögeralm above the Schliersee on 17 June 2027. Schedule, travel, where to stay and RSVP.",
    current: "home",
    body,
    scripts: ["scripts/home.js"]
  };
}
