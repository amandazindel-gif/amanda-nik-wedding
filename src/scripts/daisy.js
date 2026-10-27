/* Ask Daisy: the peeking dog, the chat dialog, and the keyword fallback that
   answers when no proxy is configured or the call fails.

   The model call goes through a small serverless proxy (see
   server/daisy-worker.js) because the Anthropic API key must never ship in a
   static site. Set `daisyEndpoint` in src/data/wedding-data.js. */

import { DAISY } from "./daisy-data.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const base = window.__WED_BASE || "/";

/* Pages Daisy is allowed to link to, keyed by the route she writes. */
const PAGES = ["/", "/story/", "/schedule/", "/travel/", "/stay/", "/explore/", "/wear/", "/guests/", "/faq/", "/rsvp/"];

function fallback(question) {
  const s = String(question).toLowerCase();
  const hit = DAISY.faqs.find((f) => {
    const words = f.q.toLowerCase().replace(/[^a-z ]/g, "").split(" ").filter((w) => w.length > 3);
    return words.some((w) => s.indexOf(w) >= 0);
  });
  if (hit && hit.a) return hit.a;
  if (/wear|dress|tracht|dirndl|lederhos/.test(s))
    return "Wednesday is Bavarian, so Tracht is encouraged, but a nice shirt or dress is perfectly fine. Thursday is Alpine cocktail on uneven alpine ground, so bring shoes you can walk and dance in. Full details on [the What to Wear page](/wear/).";
  if (/get here|travel|train|airport|munich|muc|drive/.test(s))
    return "Fly into Munich (MUC), then it's about an hour to Schliersee on the Bayerische Oberlandbahn from München Hbf, or by car. Everything is on [the Travel page](/travel/), including step-free options.";
  if (/stay|hotel|room|book/.test(s))
    return "Seehotel Schlierseer Hof is right on the lake, Terofal is in the village, and there are apartments nearby. Many places want a 2 to 3 night minimum in June, so book early. See [the Stay page](/stay/).";
  if (/when|date|time|schedule/.test(s))
    return "The wedding is Thursday 17 June 2027 at Stögeralm, with the welcome party the night before on Wednesday 16 June. Day-by-day times are on [the Schedule page](/schedule/).";
  return "I'm a dog, so my knowledge has limits, but [the FAQ page](/faq/) covers passports, cash, weather and the rain plan. Anything else, ask Amanda or Nik directly.";
}

/* Markdown-ish [text](/route/) links become real in-site links. */
function renderText(row, text) {
  const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m;
  const s = String(text);
  while ((m = re.exec(s))) {
    row.appendChild(document.createTextNode(s.slice(last, m.index)));
    const route = m[2].replace(/\.dc\.html$/i, "").toLowerCase();
    const match = PAGES.find((p) => p === m[2] || p === route || p.replace(/\//g, "") === route.replace(/\//g, ""));
    if (match) {
      const a = document.createElement("a");
      a.href = base + match.replace(/^\/+/, "");
      a.textContent = m[1];
      row.appendChild(a);
    } else {
      row.appendChild(document.createTextNode(m[1]));
    }
    last = m.index + m[0].length;
  }
  row.appendChild(document.createTextNode(s.slice(last)));
}

export function initDaisy() {
  const peek = document.querySelector("[data-daisy-peek]");
  const chat = document.querySelector("[data-daisy-chat]");
  const log = document.querySelector("[data-daisy-log]");
  const chipWrap = document.querySelector("[data-daisy-chips]");
  const form = document.querySelector("[data-daisy-form]");
  const input = form && form.querySelector("[data-daisy-input]");
  if (!peek || !chat || !log || !form) return;

  let started = false;
  let busy = false;

  /* Daisy slides out once you're into the page, and ducks away near the end. */
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight || 1;
    const p = window.scrollY / max;
    peek.dataset.show = String(p > 0.12 && p < 0.94);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  function push(who, text) {
    const row = document.createElement("div");
    row.className = "daisy-msg daisy-msg--" + (who === "you" ? "you" : "daisy");
    if (who === "you") row.textContent = text;
    else renderText(row, text);
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return row;
  }

  function renderChips(list) {
    chipWrap.innerHTML = "";
    (list || []).forEach((t) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "daisy-chip";
      b.textContent = t;
      b.addEventListener("click", () => ask(t));
      chipWrap.appendChild(b);
    });
  }

  async function ask(question) {
    if (busy) return;
    busy = true;
    push("you", question);
    renderChips([]);
    const thinking = push("daisy", "sniffing around…");

    let answer = null;
    if (DAISY.endpoint) {
      try {
        const res = await fetch(DAISY.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question })
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.answer) answer = String(data.answer);
        }
      } catch (e) {
        answer = null;
      }
    }

    thinking.remove();
    // Daisy never uses dashes; strip any the model slips in.
    const clean = (t) => String(t).replace(/\s*[—–]\s*/g, ", ").trim();
    push("daisy", answer ? clean(answer) : fallback(question));
    busy = false;
  }

  function open(isOpen) {
    chat.dataset.open = String(isOpen);
    peek.hidden = isOpen;
    if (isOpen) {
      if (!started) {
        started = true;
        push(
          "daisy",
          "Hi! I'm Daisy, Amanda and Nik's dog and unpaid trip concierge. I know the schedule, the venues, how to get here and what to wear. What do you need?"
        );
        let chips = [];
        try { chips = JSON.parse(chipWrap.dataset.initial || "[]"); } catch (e) { chips = []; }
        renderChips(chips);
      }
      if (input) setTimeout(() => input.focus(), reduceMotion ? 0 : 60);
    }
  }

  document.querySelector("[data-daisy-open]")?.addEventListener("click", () => open(true));
  document.querySelector("[data-daisy-close]")?.addEventListener("click", () => open(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && chat.dataset.open === "true") open(false);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = (input.value || "").trim();
    if (!q) return;
    input.value = "";
    ask(q);
  });
}
