import { esc, url, asset } from "../components/util.js";

const ORDER = ["Logistics", "Attire", "Wedding events", "Odds & ends"];

export default function faq(W) {
  const faqs = W.faqs;
  const seen = new Set(faqs.map((f) => f.cat || "Odds & ends"));
  const titles = ORDER.filter((t) => seen.has(t)).concat([...seen].filter((t) => !ORDER.includes(t)));

  let n = 0;
  const groups = titles
    .map((title) => {
      const items = faqs
        .filter((f) => (f.cat || "Odds & ends") === title)
        .map((f) => {
          const id = `faq-${++n}`;
          const answer =
            esc(f.a) +
            (f.link
              ? `${esc(f.link.pre || "")}<a href="${url(f.link.href)}">${esc(f.link.text)}</a>${esc(f.link.post || "")}`
              : "");
          return `
              <div class="faq-item">
                <button type="button" class="faq-item__q" data-faq-toggle aria-expanded="false" aria-controls="${id}">
                  <span>${esc(f.q)}</span>
                  <span class="faq-item__sign" aria-hidden="true">+</span>
                </button>
                <p class="faq-item__a" id="${id}" hidden>${answer}</p>
              </div>`;
        })
        .join("");
      return `
        <section>
          <div class="faq-group__head"><h2>${esc(title)}</h2></div>
          <div class="faq-items">${items}
          </div>
        </section>`;
    })
    .join("");

  const body = `
<main>
  <section class="section section--last">
    <div style="max-width:820px;margin:0 auto">
      <div class="page-head">
        <p class="eyebrow">Questions</p>
        <h1>Everything else</h1>
      </div>
      <div class="faq-groups">${groups}
      </div>

      <div class="gift-note">
        <div>
          <p class="gift-note__eyebrow">Gifts</p>
          <h2>No registry. No gifts.</h2>
          <p>Most of you are traveling around the world for us, so we won't be accepting any gifts. Nik says if you give us a gift, you're uninvited. If you truly can't help yourself, Amanda's rule is that it has to be made by you: a burned CD, scrapbook, drawing, a bad joke. And Daisy does accept treats and toys of any kind.</p>
        </div>
        <img src="${asset("assets/daisy-line.png")}" alt="Line drawing of Daisy the dog, grinning" loading="lazy">
      </div>
    </div>
  </section>
</main>`;

  return {
    route: "/faq/",
    title: "FAQ · Amanda & Nik",
    desc: "Passports, cash, tipping, the rain plan, kids, accessibility and gifts, answered.",
    current: "faq",
    body,
    scripts: ["scripts/faq.js"]
  };
}
