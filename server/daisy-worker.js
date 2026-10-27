/**
 * Ask Daisy proxy — Cloudflare Worker.
 *
 * The site is static, so the Anthropic API key can never live in it. This
 * Worker holds the key, builds the system prompt and the knowledge base
 * server-side, and hands back only { answer }.
 *
 * Deploy (once):
 *   1. npm create cloudflare@latest daisy-proxy   (or paste this into the
 *      Cloudflare dashboard → Workers → Create → Edit code)
 *   2. Set the secrets and variables:
 *        npx wrangler secret put ANTHROPIC_API_KEY
 *        ALLOWED_ORIGIN  = https://<your-pages-domain>     (Settings → Variables)
 *   3. Deploy, then put the Worker URL in src/data/wedding-data.js as
 *      `daisyEndpoint` and rebuild the site.
 *
 * If this Worker is unreachable or returns anything but { answer }, the site
 * falls back to keyword matching against the FAQ. Nothing breaks.
 */

// claude-haiku-5-5 is the cheaper swap if the bill ever matters; for the
// handful of questions a wedding site gets, Sonnet is the better answer.
const MODEL = "claude-sonnet-5-5";
const MAX_TOKENS = 400;

/* A very small in-memory limiter. Workers isolates are short-lived, so this is
   a speed bump for accidents, not a security control. For something stricter,
   put a Durable Object or KV counter here. */
const RATE = { windowMs: 60_000, max: 12 };
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const bucket = (hits.get(ip) || []).filter((t) => now - t < RATE.windowMs);
  bucket.push(now);
  hits.set(ip, bucket);
  if (hits.size > 5000) hits.clear();
  return bucket.length > RATE.max;
}

function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}

const json = (body, status, env) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(env) }
  });

/* ---------------------------------------------------------------- facts --- */
/* Keep this in step with src/data/wedding-data.js. It is duplicated on purpose:
   the Worker deploys separately from the site. */
const KNOWLEDGE = `WEDDING FACTS
Amanda and Nik marry Thursday 17 June 2027 at Stögeralm, an alm above the Schliersee in the Bavarian Alps. Meadow ceremony overlooking the lake. Welcome party the night before, Wednesday 16 June, at the Markus Wasmeier Open-Air Museum, Bavarian themed, Tracht (dirndl/lederhosen) encouraged. Schliersee is very walkable: as long as guests stay in or near the village, they are within easy walking distance of everything in town, and the alm is only a 3 to 5 minute drive (shuttle provided on the wedding day). Never say stays are 20 minutes from the venue. Nearest airport is Munich (MUC), about an hour away by train or car. Guests arrive Tuesday 15 or Wednesday 16 June; Friday 18 is a slow day at the lake and Saturday 19 is departures. Adults only. No gifts unless handmade. RSVP by 31 December 2026.

SCHEDULE
Wednesday 16 June: 5:00 PM train from Schliersee Bahnhof to Fischhausen-Neuhaus, 5:30 PM museum tour, 6:30 to 10:00 PM welcome party at the Markus Wasmeier Open-Air Museum, last train back 10:45 PM.
Thursday 17 June: 2:00 PM shuttles from the Terofal, 2:30 PM coffee and cake at the Stögeralm, 3:30 PM ceremony, 4:45 PM cocktails, 6:00 PM dinner, party until 2:00 AM with shuttles down at 11:00 PM, midnight and 2:00 AM.
Friday 18 June: nothing formal, a recovery day at the lake.

STAY
Seehotel Schlierseer Hof, on the lake, where most guests are staying. Terofal Boutique Hotel, in the village. Apartments on Vrbo and Airbnb around the lake. June is high season and most places want a 2 to 3 night minimum, so book early.

ATTIRE
Wednesday: Tracht strongly encouraged, dirndl or lederhosen, rentals around 50 to 60 euros delivered to the hotel. Thursday: Alpine cocktail, midi or long dresses, summer or linen suits, a layer for the evening, flats or block heels because of grass and gravel, no black tie and no stilettos. Friday: lake casual.

THINGS TO DO
The Schliersee lakefront, the Schliersbergalm cable car and alpine coaster, the Vitalwelt spa, the bench above the church, day trips to the Tegernsee and to the Eibsee and Garmisch, the Wallbergbahn and the Brecherspitz ridge hike.

FAQ
Passports must be valid at least three months past departure from the EU and issued within the last ten years. Cards are widely accepted but bring a couple of hundred euros in cash. Service is included; round up or about 5 to 10 percent for a nice meal. June: around 22C/72F in the day, about 10C/50F on the mountain at night, with the odd thunderstorm. If it rains only the ceremony spot moves, under the awnings at the venue. Adults only, both nights. The alm has vehicle access to the top, a step-free route to the ceremony, dinner and dancing, and an accessible toilet. Daisy is not coming; she stays home. No registry and no gifts.`;

const SYSTEM = `You are Daisy, Amanda and Nik's dog, acting as a friendly concierge on their wedding website. The person chatting with you is always a wedding GUEST, never Amanda or Nik. Refer to the couple in the third person ("Amanda and Nik are getting married"), never "you're getting married" or "your wedding". Address the guest as "you" only for their own plans (travel, RSVP, what to wear). Answer guest questions using ONLY the facts below. When a site page has more detail, link it inline with markdown like [the Travel page](/travel/), at most one or two links per answer. Valid pages only: /, /story/, /schedule/, /travel/, /stay/, /explore/, /wear/, /guests/, /faq/, /rsvp/. Warm, plain, a little cheeky, 2 to 4 short sentences, no emoji, no lists unless asked. NEVER use em dashes or en dashes; use commas, periods or the word "to" instead. If a detail is not in the facts (exact times, prices), say it's still being finalised and point them to the right page. Occasionally a light dog joke, sparingly.

${KNOWLEDGE}`;

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(env) });
    if (request.method !== "POST") return json({ error: "Use POST" }, 405, env);

    const origin = request.headers.get("Origin");
    if (env.ALLOWED_ORIGIN && origin && origin !== env.ALLOWED_ORIGIN) {
      return json({ error: "Not allowed" }, 403, env);
    }

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (rateLimited(ip)) return json({ error: "Slow down" }, 429, env);

    let question = "";
    try {
      const body = await request.json();
      question = String(body.question || "").slice(0, 500).trim();
    } catch {
      return json({ error: "Bad request" }, 400, env);
    }
    if (!question) return json({ error: "No question" }, 400, env);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: SYSTEM,
          messages: [{ role: "user", content: question }]
        })
      });
      if (!res.ok) return json({ error: "Upstream error" }, 502, env);
      const data = await res.json();
      const answer = (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("")
        .trim();
      if (!answer) return json({ error: "Empty answer" }, 502, env);
      return json({ answer }, 200, env);
    } catch {
      return json({ error: "Upstream error" }, 502, env);
    }
  }
};
