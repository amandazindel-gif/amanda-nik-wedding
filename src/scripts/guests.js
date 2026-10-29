/* The guest directory, fetched from the "Guest list" tab of the RSVP
   spreadsheet at runtime. The Apps Script returns only the rows marked
   "Show on website", so no contact details are ever committed to this repo. */

const CFG = window.__WED_GUESTS || { sheetScriptUrl: "" };

const wrap = document.querySelector("[data-guest-table]");
const tbody = document.querySelector("[data-guest-body]");
const count = document.querySelector("[data-guest-count]");
const none = document.querySelector("[data-guest-none]");
const filterInput = document.querySelector("[data-guest-filter]");
const loading = document.querySelector("[data-guest-loading]");
const empty = document.querySelector("[data-guest-empty]");
const error = document.querySelector("[data-guest-error]");

let all = [];
let sortKey = "name";
let sortDir = 1;

function show(state) {
  if (loading) loading.hidden = state !== "loading";
  if (empty) empty.hidden = state !== "empty";
  if (error) error.hidden = state !== "error";
  if (wrap) wrap.hidden = state !== "table";
}

function cell(text, href) {
  const td = document.createElement("td");
  if (text && href) {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = text;
    td.appendChild(a);
  } else {
    td.textContent = text || "";
  }
  return td;
}

function render() {
  const q = (filterInput && filterInput.value || "").trim().toLowerCase();
  const rows = all
    .filter((g) => !q || (g.name + " " + (g.side || "")).toLowerCase().includes(q))
    .sort((a, b) => String(a[sortKey] || "").localeCompare(String(b[sortKey] || "")) * sortDir);

  tbody.textContent = "";
  rows.forEach((g) => {
    const tr = document.createElement("tr");

    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = g.name;
    tr.appendChild(th);

    tr.appendChild(cell(g.side));
    tr.appendChild(cell(g.phone, g.phone ? "tel:" + String(g.phone).replace(/[^+0-9]/g, "") : null));
    tr.appendChild(cell(g.email, g.email ? "mailto:" + g.email : null));

    tbody.appendChild(tr);
  });

  if (none) none.hidden = rows.length > 0;
  if (count) {
    count.textContent = q
      ? `${rows.length} of ${all.length}`
      : `${all.length} ${all.length === 1 ? "guest" : "guests"}`;
  }

  document.querySelectorAll("[data-sort]").forEach((btn) => {
    const on = btn.dataset.sort === sortKey;
    btn.closest("th").setAttribute("aria-sort", on ? (sortDir === 1 ? "ascending" : "descending") : "none");
  });
}

document.querySelectorAll("[data-sort]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.sort;
    if (key === sortKey) sortDir = -sortDir;
    else { sortKey = key; sortDir = 1; }
    render();
  });
});

if (filterInput) filterInput.addEventListener("input", render);

async function load() {
  if (!CFG.sheetScriptUrl) {
    show(tbody && tbody.children.length ? "table" : "empty");
    return;
  }

  show(tbody && tbody.children.length ? "table" : "loading");

  try {
    const res = await fetch(CFG.sheetScriptUrl + "?directory=1");
    if (!res.ok) throw new Error("bad status");
    const data = await res.json();
    const list = Array.isArray(data.guests) ? data.guests : [];

    if (!list.length) return show("empty");

    all = list;
    render();
    show("table");
  } catch (e) {
    // Keep a server-rendered seed on screen rather than replacing it with an error.
    show(tbody && tbody.children.length ? "table" : "error");
  }
}

load();
