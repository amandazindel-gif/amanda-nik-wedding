/* The guest directory, fetched from the "Guest list" tab of the RSVP
   spreadsheet at runtime.

   The Apps Script will not return the directory without the passphrase, so the
   contact details are not readable just by finding the endpoint URL. The
   passphrase is never in this code: a guest types it, and we keep it in this
   browser so they only do that once. */

const CFG = window.__WED_GUESTS || { sheetScriptUrl: "" };
const STORE_KEY = "wed.guests.pass";

const grid = document.querySelector("[data-guest-table]");
const tbody = document.querySelector("[data-guest-body]");
const count = document.querySelector("[data-guest-count]");
const none = document.querySelector("[data-guest-none]");
const filterInput = document.querySelector("[data-guest-filter]");
const loading = document.querySelector("[data-guest-loading]");
const empty = document.querySelector("[data-guest-empty]");
const error = document.querySelector("[data-guest-error]");
const lock = document.querySelector("[data-guest-lock]");
const lockForm = document.querySelector("[data-guest-lock-form]");
const lockInput = document.querySelector("[data-guest-pass]");
const lockError = document.querySelector("[data-guest-lock-error]");

let all = [];
let sortKey = "name";
let sortDir = 1;

/* Storage throws in some private windows, so never let it break the page. */
const remembered = () => {
  try { return localStorage.getItem(STORE_KEY) || ""; } catch (e) { return ""; }
};
const remember = (value) => {
  try { localStorage.setItem(STORE_KEY, value); } catch (e) { /* fine */ }
};
const forget = () => {
  try { localStorage.removeItem(STORE_KEY); } catch (e) { /* fine */ }
};

function show(state) {
  if (lock) lock.hidden = state !== "lock";
  if (loading) loading.hidden = state !== "loading";
  if (empty) empty.hidden = state !== "empty";
  if (error) error.hidden = state !== "error";
  if (grid) grid.hidden = state !== "table";
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
  const q = ((filterInput && filterInput.value) || "").trim().toLowerCase();
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

/**
 * @returns "ok" | "locked" | "empty" | "error"
 */
async function fetchDirectory(pass) {
  try {
    const res = await fetch(`${CFG.sheetScriptUrl}?directory=1&key=${encodeURIComponent(pass)}`);
    if (!res.ok) return "error";
    const data = await res.json();
    if (data && data.locked) return "locked";
    const list = Array.isArray(data.guests) ? data.guests : [];
    if (!list.length) return "empty";
    all = list;
    return "ok";
  } catch (e) {
    return "error";
  }
}

async function unlock(pass, { fromStore = false } = {}) {
  show("loading");
  const result = await fetchDirectory(pass);

  if (result === "ok") {
    remember(pass);
    render();
    show("table");
    return;
  }
  if (result === "locked") {
    // A saved passphrase that stopped working means it was changed.
    if (fromStore) forget();
    if (lockError) lockError.hidden = fromStore;
    show("lock");
    return;
  }
  show(result === "empty" ? "empty" : "error");
}

if (lockForm) {
  lockForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (lockError) lockError.hidden = true;
    const pass = (lockInput.value || "").trim();
    if (pass) unlock(pass);
  });
}

function start() {
  if (!CFG.sheetScriptUrl) {
    show(tbody && tbody.children.length ? "table" : "empty");
    return;
  }
  const saved = remembered();
  if (saved) return unlock(saved, { fromStore: true });
  show("lock");
  if (lockInput) lockInput.focus();
}

start();
