import { esc, asset } from "../components/util.js";

export default function story(W) {
  const figures = W.storyPhotos
    .map((p) => {
      const crop = p.scale ? " story-figure--crop" : "";
      const style = p.scale
        ? ` style="object-position:${esc(p.objectPosition || "50% 50%")};transform:scale(${p.scale});transform-origin:${esc(
            p.transformOrigin || "50% 50%"
          )}"`
        : "";
      return `
        <figure class="story-figure${crop}" tabindex="0">
          <img src="${asset(p.src)}" alt="${esc(p.alt)}" loading="lazy"${style}>
          <figcaption>
            <span class="story-figure__place">${esc(p.place)}</span>
            <span class="story-figure__country">${esc(p.country)}</span>
          </figcaption>
        </figure>`;
    })
    .join("");

  const body = `
<main>
  <section class="section">
    <div class="story-intro">
      <p class="eyebrow">Our story, short version</p>
      <h1>Of all the places we've been, this is the one we want to share with you.</h1>
      <div class="story-grid">${figures}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="story-quote">
      <blockquote>
        <p>"Thank you for being part of our story. Nothing makes us happier than bringing people together, and now we get to have everyone we love in one of our favorite places in the world."</p>
        <footer>Amanda &amp; Nik</footer>
      </blockquote>
    </div>
  </section>

  <section class="section" style="padding-top:40px">
    <div class="story-voices">
      <article class="story-voice story-voice--amanda">
        <p class="story-voice__eyebrow">Amanda's version</p>
        <h2>My first date in a new city</h2>
        <div class="story-voice__body">
          <p>I moved to Denver, downloaded Bumble, and Nik was my very first date in the city. I always feel very lucky about that.</p>
          <p>Our first date was at Ophelia's Electric Soapbox for brunch. We had so much in common, but travel was easily the topic we talked about the most. I even impressed Nik by paying for a drink with Guatemalan currency.</p>
          <p>It didn't take long for me to realize Nik was everything I've ever wanted in a partner. I've never felt more myself than I am with him.</p>
          <p>Our very first international trip together was Munich, where I fell in love with the countryside in the Alps.</p>
        </div>
      </article>
      <article class="story-voice story-voice--nik">
        <p class="story-voice__eyebrow">Nik's version</p>
        <h2>I grew up going to Germany.</h2>
        <div class="story-voice__body">
          <!-- PLACEHOLDER · Nik's copy still to come. -->
          <p>More soon.</p>
        </div>
      </article>
    </div>
  </section>

  <section class="section" style="padding-top:48px">
    <div class="story-map-card">
      <p class="eyebrow">The map so far</p>
      <h2>Where we've been, the two of us</h2>
      <p>Sixty-odd countries between us, nine of them together. Germany is the one we kept coming back to, and this time you're all coming with us.</p>
      <div class="story-map" data-story-map role="img" aria-label="World map with the countries Amanda and Nik have travelled highlighted in green across North and Central America, South America, Europe, Africa and Asia, with Germany marked in terracotta"></div>
      <div class="story-map__legend">
        <span><span class="story-map__swatch" aria-hidden="true"></span>Countries we've been to</span>
      </div>
    </div>
  </section>

  <section class="section section--last" style="padding-top:40px">
    <div class="story-daisy">
      <div>
        <h2>Daisy Girl</h2>
        <p>Queen of side eye but the sweetest girl in the world. Amanda adopted her during Covid when she was two years old. She lived in Chicago, Tucson, and finally Denver. Nik fell for her on day one, which was good, because we were a package deal. She's sitting this one out, but she's in every part of how we got here, and she'll be at the door when we land.</p>
      </div>
      <div class="story-daisy__photo">
        <img src="${asset("assets/daisy-photo.jpg")}" alt="Amanda kissing Daisy on a rocky outcrop in the forest while Nik looks on, golden evening light behind them" loading="lazy">
      </div>
    </div>
  </section>
</main>`;

  return {
    route: "/story/",
    title: "Our Story · Amanda & Nik",
    desc: "How Amanda and Nik met, where they have travelled together, and why they chose the Bavarian Alps.",
    current: "story",
    body,
    head: `<script>window.__WED_MAP = ${JSON.stringify({
      been: W.countriesVisited,
      next: "Germany",
      islands: W.mapIslands
    })};</script>`,
    scripts: ["scripts/story-map.js"]
  };
}
