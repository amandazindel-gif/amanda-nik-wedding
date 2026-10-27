/* Our Story: the world map of everywhere they have been.
   d3 + topojson are loaded from a CDN only on this page. If either fails to
   load the map simply doesn't draw; nothing else on the page depends on it. */

const CFG = window.__WED_MAP || { been: [], next: "Germany", islands: [] };
const ATLAS = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json";

function script(src, integrity) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.crossOrigin = "anonymous";
    if (integrity) s.integrity = integrity;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function draw() {
  const el = document.querySelector("[data-story-map]");
  if (!el) return;

  await script(
    "https://unpkg.com/d3@7.9.0/dist/d3.min.js",
    "sha384-CjloA8y00+1SDAUkjs099PVfnY2KmDC2BZnws9kh8D/lX1s46w6EPhpXdqMfjK6i"
  );
  await script(
    "https://unpkg.com/topojson-client@3.1.0/dist/topojson-client.min.js",
    "sha384-Ukv1p/xTma6P4/2bY5KzWBw+ydSpXmhCMtyciIQVDJ1RmOxtCYNMF1uXT9T63H67"
  );

  const topo = await d3.json(ATLAS);
  const land = topojson.feature(topo, topo.objects.countries);

  const W = 960;
  const H = 470;
  const projection = d3.geoNaturalEarth1().fitExtent([[6, 6], [W - 6, H - 6]], land);
  const path = d3.geoPath(projection);

  const svg = d3
    .select(el)
    .append("svg")
    .attr("viewBox", `0 0 ${W} ${H}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("aria-hidden", "true");

  svg
    .append("g")
    .selectAll("path")
    .data(land.features)
    .join("path")
    .attr("d", path)
    .attr("fill", (d) => {
      const n = d.properties && d.properties.name;
      if (n === CFG.next) return "#B8674A";
      return CFG.been.indexOf(n) >= 0 ? "#7C8C6B" : "#E8E4D6";
    })
    .attr("stroke", "#FFFDF8")
    .attr("stroke-width", 0.6);

  // Small island states are absent from the 1:110m geometry, so mark them.
  const g = svg.append("g");
  (CFG.islands || []).forEach((isl) => {
    const q = projection(isl.lonLat);
    if (!q) return;
    g.append("circle")
      .attr("cx", q[0])
      .attr("cy", q[1])
      .attr("r", 3.4)
      .attr("fill", "#7C8C6B")
      .attr("stroke", "#FFFDF8")
      .attr("stroke-width", 0.8);
  });
}

draw().catch(() => {});
