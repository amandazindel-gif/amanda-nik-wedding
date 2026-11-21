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
          <p>When I moved to Denver, a relationship wasn't on the agenda (at least not right away). The plan was friends first, me first, romance later. That plan lasted about one month before I downloaded Bumble, and Nik was my very first date in the city. I still feel incredibly lucky for that.</p>
          <p>Our first date was brunch at Ophelia's Electric Soapbox. We had so much in common, but travel was easily the topic we talked about most. I even impressed Nik by paying for a drink with Guatemalan currency.</p>
          <p>It didn't take long for me to realize Nik was everything I've ever wanted in a partner. He loves me for me, makes me laugh constantly, never says no to an adventure, and is happiest when everyone's together. Most importantly, Daisy approved of him right away, and that was non-negotiable because we were a package deal. I've never felt more like myself than I do with him.</p>
          <p>Our first international trip together was Munich, where I fell in love with the Alps. So when Nik suggested getting married there, I was all in.</p>
        </div>
      </article>
      <article class="story-voice story-voice--nik">
        <p class="story-voice__eyebrow">Nik's version</p>
        <h2>A bad dad joke did the trick</h2>
        <div class="story-voice__body">
          <p>Amanda had paid for the premium version of Bumble which immediately matched her with Denver's best talent. Fresh off of a failed dream to be a reality tv star on some lame dating show, I was swiping for love. Amanda responded to a bad dad joke I had listed for one of my prompts, so if that doesn't scream a match I don't know what does.</p>
          <p>When Amanda and I first met, I felt that I had always known her. It didn't take much time to know that this was something different, and something that I never wanted to let go of. For the first time, everything just felt like it was supposed to be and not once have I looked back on us.</p>
          <p>Obviously one of our bonds is travel, and what better way to get to know someone than to do it together. Fairly quickly we started exploring the world together, with our first stop being the Bavarian Alps. With my family ties to the region, I wanted to show her how special this place was to me. Little did we know it would soon have that much more meaning for both of us :)</p>
        </div>
      </article>
    </div>
  </section>

  <section class="section" style="padding-top:48px">
    <div class="story-map-card">
      <p class="eyebrow">The map so far</p>
      <h2>Ground we've covered</h2>
      <p>Seventy-six countries between us, fifty-six once you stop double counting, and ten we saw together. Germany is the one we kept coming back to, and this time you're all coming with us.</p>
      <div class="story-map" data-story-map role="img" aria-label="World map across North and Central America, South America, Europe, Africa, Asia and Oceania. Countries one of us has visited are pale green, the ten we travelled together are dark green, and Germany is marked in terracotta."></div>
      <div class="story-map__legend">
        <span><span class="story-map__swatch story-map__swatch--one" aria-hidden="true"></span>One of us</span>
        <span><span class="story-map__swatch story-map__swatch--both" aria-hidden="true"></span>Together</span>
        <span><span class="story-map__swatch story-map__swatch--next" aria-hidden="true"></span>Where we're getting married</span>
      </div>
    </div>
  </section>

  <section class="section section--last" style="padding-top:40px">
    <div class="story-daisy">
      <div>
        <h2>Daisy Girl</h2>
        <p>Queen of side eye but the sweetest girl in the world. Amanda adopted her during Covid when she was two years old. She lived in Chicago, Tucson, and finally Denver. Nik fell for her on day one, which was good, because we were a package deal. She's sitting this one out, but she's in every part of how we got here, and she'll be at the door when we land.</p>
        <p>Feel free to ask her a question in the chat box. She doesn't have thumbs but she'll respond as quickly as she can.</p>
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
      together: W.countriesTogether,
      next: "Germany",
      islands: W.mapIslands
    })};</script>`,
    scripts: ["scripts/story-map.js"]
  };
}
