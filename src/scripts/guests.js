/* The guest directory, fetched from the RSVP spreadsheet at runtime.
   The Apps Script returns only the guests who ticked "add me to the guest
   list", and only their name, side, phone and email, so no contact details
   are ever committed to this repo. */

const CFG = window.__WED_GUESTS || { sheetScriptUrl: "" };

const grid = document.querySelector("[data-guest-grid]");
const count = document.querySelector("[data-guest-count]");
const loading = document.querySelector("[data-guest-loading]");
const empty = document.querySelector("[data-guest-empty]");
const error = document.querySelector("[data-guest-error]");

function show(state) {
  if (loading) loading.hidden = state !== "loading";
  if (empty) empty.hidden = state !== "empty";
  if (error) error.hidden = state !== "error";
  if (grid) grid.hidden = state !== "list";
  if (count) count.hidden = state !== "list";
}

function card(g) {
  const el = document.createElement("div");
  el.className = "guest-card";

  const name = document.createElement("p");
  name.className = "guest-card__name";
  name.textContent = g.name;
  el.appendChild(name);

  if (g.side) {
    const side = document.createElement("p");
    side.className = "guest-card__side";
    side.textContent = g.side;
    el.appendChild(side);
  }

  const links = document.createElement("div");
  links.className = "guest-card__links";
  if (g.phone) {
    const a = document.createElement("a");
    a.href = "tel:" + String(g.phone).replace(/[^+0-9]/g, "");
    a.textContent = g.phone;
    links.appendChild(a);
  }
  if (g.email) {
    const a = document.createElement("a");
    a.href = "mailto:" + g.email;
    a.textContent = g.email;
    links.appendChild(a);
  }
  el.appendChild(links);
  return el;
}

async function load() {
  if (!CFG.sheetScriptUrl) {
    // No endpoint configured: fall back to whatever was rendered server-side.
    show(grid && grid.children.length ? "list" : "empty");
    return;
  }

  show(grid && grid.children.length ? "list" : "loading");

  try {
    const res = await fetch(CFG.sheetScriptUrl + "?directory=1");
    if (!res.ok) throw new Error("bad status");
    const data = await res.json();
    const list = Array.isArray(data.guests) ? data.guests : [];

    if (!list.length) return show("empty");

    grid.textContent = "";
    list.forEach((g) => grid.appendChild(card(g)));
    if (count) count.textContent = list.length + (list.length === 1 ? " guest" : " guests");
    show("list");
  } catch (e) {
    // Keep a server-rendered seed on screen rather than replacing it with an error.
    show(grid && grid.children.length ? "list" : "error");
  }
}

load();
