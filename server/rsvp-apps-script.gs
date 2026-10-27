/**
 * Amanda & Nik — RSVP connector for Google Sheets
 *
 * SETUP (one time, ~3 minutes)
 * 1. Open the guest list sheet → Extensions → Apps Script.
 * 2. Delete anything in Code.gs and paste this whole file. Save.
 * 3. Deploy → New deployment → type "Web app".
 *      Execute as: Me
 *      Who has access: Anyone
 *    Click Deploy, authorize, and copy the Web app URL (ends in /exec).
 * 4. Send that URL back (it goes in wedding-data.js → sheetScriptUrl).
 * If you edit this script later: Deploy → Manage deployments → edit → New version.
 *
 * What it does
 *  GET              → returns ONLY names + plus-one info for the RSVP lookup.
 *                     Phone, address and reception details never leave the sheet.
 *  GET ?directory=1 → returns name, side, phone and email for the guests who
 *                     ticked "add me to the guest list", and nobody else. This
 *                     feeds the Guests page. Anyone who can open the website can
 *                     read it, which is the point of a shared contact list, but
 *                     it is why only opted-in guests are ever included.
 *  POST             → appends one row per guest to a tab called "RSVPs"
 *                     (created automatically).
 *
 * Parties: guests who share the same address are grouped into one invitation,
 * so one person can RSVP for their whole household.
 */

const GUEST_TAB_GID = 1473395423;   // the tab from your link (#gid=...)
const RSVP_TAB_NAME = "RSVPs";

function guestSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheets().find(s => s.getSheetId() === GUEST_TAB_GID) || ss.getSheets()[0];
}

function col_(headers, names) {
  const h = headers.map(x => String(x).toLowerCase().replace(/[^a-z0-9]/g, ""));
  for (const n of names) { const i = h.indexOf(n); if (i >= 0) return i; }
  for (const n of names) { const i = h.findIndex(x => x && x.indexOf(n) >= 0); if (i >= 0) return i; }
  return -1;
}

// The header row is whichever of the first 15 rows mentions "first" and "last".
function headerRow_(rows) {
  for (let i = 0; i < Math.min(15, rows.length); i++) {
    const t = rows[i].map(x => String(x).toLowerCase());
    if (t.some(x => x.indexOf("first") >= 0) && t.some(x => x.indexOf("last") >= 0)) return i;
  }
  return 0;
}

/* Columns on the RSVPs tab, in order. Rows are written by looking the header
   up by name, so adding one here is safe for a sheet that already exists. */
const RSVP_HEADERS = ["Submitted", "Invitation", "Guest", "Plus one?", "Welcome party", "Wedding day",
  "Meal", "Dietary", "Add to guest list", "Side", "Phone", "Email", "Song request", "Notes"];

const YES = /^(y|yes|true|1|x|✓)$/i;

function rsvpSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(RSVP_TAB_NAME);
  if (!sh) {
    sh = ss.insertSheet(RSVP_TAB_NAME);
    sh.appendRow(RSVP_HEADERS);
    sh.setFrozenRows(1);
    return sh;
  }
  // The tab may predate a column (Side was added later); append what's missing.
  const headers = sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0];
  const have = headers.map(h => String(h).toLowerCase().trim());
  const missing = RSVP_HEADERS.filter(h => have.indexOf(h.toLowerCase()) < 0);
  if (missing.length) sh.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
  return sh;
}

function doGet(e) {
  if (e && e.parameter && e.parameter.directory) return directory_();
  const sheet = guestSheet_();
  const all = sheet.getDataRange().getValues();
  const hr = headerRow_(all);
  const headers = all[hr];
  const rows = all.slice(hr + 1);
  const cFirst = col_(headers, ["firstname", "first", "fname", "given"]);
  const cLast = col_(headers, ["lastname", "last", "lname", "surname", "family"]);
  const cPlus = col_(headers, ["plusone", "plus1", "plus"]);
  const cAddr = col_(headers, ["address", "mailingaddress"]);

  const parties = {};
  const order = [];
  rows.forEach((r, i) => {
    i = i + hr;
    const name = [r[cFirst], r[cLast]].map(v => String(v || "").trim()).filter(Boolean).join(" ");
    if (!name) return;
    const addr = cAddr >= 0 ? String(r[cAddr] || "").toLowerCase().replace(/[^a-z0-9]/g, "") : "";
    const key = addr || "row" + (i + 2);
    if (!parties[key]) {
      parties[key] = { id: "P" + (order.length + 1), members: [], plusOneName: "", plusOneOpen: false };
      order.push(key);
    }
    const p = parties[key];
    p.members.push(name);
    const plus = cPlus >= 0 ? String(r[cPlus] || "").trim() : "";
    if (/^(y|yes|true|1|x|✓|plus one|\+1)$/i.test(plus)) p.plusOneOpen = true;
    else if (plus && !/^(n|no|false|0|-)$/i.test(plus)) p.plusOneName = plus;
  });

  const invitees = order.map(k => parties[k]);
  const out = { invitees };
  if (e && e.parameter && e.parameter.debug) {
    out.debug = { tab: sheet.getName(), tabId: sheet.getSheetId(), headerRow: hr + 1, headers: headers, cols: { first: cFirst, last: cLast, plus: cPlus, address: cAddr }, dataRows: rows.length };
  }
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * The shared contact list behind the Guests page.
 * Only guests who ticked the box are included, and only ever name, side, phone
 * and email. Meals, dietary needs, songs and notes stay in the sheet.
 * If someone replies twice, their most recent submission wins.
 */
function directory_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(RSVP_TAB_NAME);
  const out = { guests: [] };
  if (!sh || sh.getLastRow() < 2) return jsonOut_(out);

  const all = sh.getDataRange().getValues();
  const headers = all[0];
  const c = {
    when: col_(headers, ["submitted"]),
    name: col_(headers, ["guest"]),
    share: col_(headers, ["addtoguestlist"]),
    side: col_(headers, ["side"]),
    phone: col_(headers, ["phone"]),
    email: col_(headers, ["email"])
  };
  if (c.name < 0 || c.share < 0) return jsonOut_(out);

  const latest = {};
  all.slice(1).forEach(r => {
    if (!YES.test(String(r[c.share] || "").trim())) return;
    const name = String(r[c.name] || "").trim();
    if (!name) return;
    const key = name.toLowerCase();
    const when = c.when >= 0 ? new Date(r[c.when]).getTime() || 0 : 0;
    if (latest[key] && latest[key].when > when) return;
    latest[key] = {
      when: when,
      guest: {
        name: name,
        side: c.side >= 0 ? String(r[c.side] || "").trim() : "",
        phone: c.phone >= 0 ? String(r[c.phone] || "").trim() : "",
        email: c.email >= 0 ? String(r[c.email] || "").trim() : ""
      }
    };
  });

  out.guests = Object.keys(latest)
    .map(k => latest[k].guest)
    .filter(g => g.phone || g.email)
    .sort((a, b) => a.name.localeCompare(b.name));
  return jsonOut_(out);
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const sh = rsvpSheet_();
    const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0]
      .map(h => String(h).toLowerCase().trim());
    const now = new Date();

    (d.guests || []).forEach(g => {
      // Phone and email are per person now; fall back to the party-level
      // values that older versions of the form sent.
      const values = {
        "submitted": now,
        "invitation": d.partyId || "",
        "guest": g.name || "",
        "plus one?": g.isPlusOne ? "Yes" : "",
        "welcome party": g.welcomeParty ? "Yes" : "No",
        "wedding day": g.weddingDay ? "Yes" : "No",
        "meal": g.meal || "",
        "dietary": g.dietary || "",
        "add to guest list": d.shareContact ? "Yes" : "No",
        "side": d.side || "",
        "phone": g.phone || d.phone || "",
        "email": g.email || d.email || "",
        "song request": d.song || "",
        "notes": d.notes || ""
      };
      sh.appendRow(headers.map(h => (h in values ? values[h] : "")));
    });

    return jsonOut_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}
