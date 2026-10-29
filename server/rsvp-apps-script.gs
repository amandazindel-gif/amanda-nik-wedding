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
 *  GET ?directory=1 → returns the "Guest list" tab: name, side, phone and email
 *                     for the rows marked "Show on website". This feeds the
 *                     Guests page. Anyone who can open the website can read it,
 *                     which is the point of a shared contact list, but it is
 *                     why only opted-in guests are ever included.
 *  POST             → appends one row per guest to the "RSVPs" tab (the full
 *                     log) and updates that guest's row on "Guest list".
 *                     Both tabs are created automatically.
 *
 * Tabs this script owns
 *  RSVPs       every reply as it came in, one row per guest. Never edited.
 *  Guest list  the shared contact list, one row per person. Safe to edit:
 *              tidy a number, or set "Show on website" to No to hide someone
 *              (that holds until they RSVP again, since their own choice wins).
 *              Sheet menu → Wedding site → Rebuild guest list from RSVPs.
 *
 * Parties: guests who share the same address are grouped into one invitation,
 * so one person can RSVP for their whole household.
 */

const GUEST_TAB_GID = 1473395423;   // the tab from your link (#gid=...)
const RSVP_TAB_NAME = "RSVPs";
const DIRECTORY_TAB_NAME = "Guest list";

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

/* ===========================================================================
   THE "Guest list" TAB
   The shared contact list the website shows. The script keeps it up to date as
   RSVPs arrive, and you can edit it by hand: fix a typo, tidy a phone number,
   or set "Show on website" to No to hide someone without deleting them.
   It is what the website reads, so your edits are what guests see.
   A guest who RSVPs again overwrites their own row, nothing else.
   =========================================================================== */
const DIRECTORY_HEADERS = ["Name", "Side", "Phone", "Email", "Show on website", "Updated"];

function directorySheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(DIRECTORY_TAB_NAME);
  if (!sh) {
    sh = ss.insertSheet(DIRECTORY_TAB_NAME);
    sh.appendRow(DIRECTORY_HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, DIRECTORY_HEADERS.length).setFontWeight("bold");
    sh.setColumnWidth(1, 200);
    sh.setColumnWidth(4, 240);
  }
  return sh;
}

/**
 * Add or update one row per guest, matched on name.
 * entries: [{ name, side, phone, email, show }]
 */
function upsertDirectory_(entries) {
  if (!entries.length) return 0;
  const sh = directorySheet_();
  const last = sh.getLastRow();
  const width = DIRECTORY_HEADERS.length;
  const rows = last > 1 ? sh.getRange(2, 1, last - 1, width).getValues() : [];

  const index = {};
  rows.forEach((r, i) => {
    const k = String(r[0] || "").trim().toLowerCase();
    if (k) index[k] = i;
  });

  const now = new Date();
  const appends = [];
  entries.forEach(e => {
    const name = String(e.name || "").trim();
    const key = name.toLowerCase();
    if (!key) return;

    if (key in index) {
      const r = rows[index[key]];
      // Only overwrite what the guest actually sent. Someone re-replying to
      // change a meal shouldn't wipe the number they gave us last time.
      if (e.side) r[1] = e.side;
      if (e.phone) r[2] = e.phone;
      if (e.email) r[3] = e.email;
      // The guest's own latest choice decides this, so opting out and back in
      // works. A No you set by hand holds until that guest replies again.
      r[4] = e.show ? "Yes" : "No";
      r[5] = now;
    } else {
      appends.push([name, e.side || "", e.phone || "", e.email || "", e.show ? "Yes" : "No", now]);
    }
  });

  if (rows.length) sh.getRange(2, 1, rows.length, width).setValues(rows);
  if (appends.length) sh.getRange(sh.getLastRow() + 1, 1, appends.length, width).setValues(appends);
  return entries.length;
}

/* Every guest's most recent RSVP, as directory entries. */
function latestFromRsvps_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(RSVP_TAB_NAME);
  if (!sh || sh.getLastRow() < 2) return [];

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
  if (c.name < 0) return [];

  const latest = {};
  all.slice(1).forEach(r => {
    const name = String(r[c.name] || "").trim();
    if (!name) return;
    const key = name.toLowerCase();
    const when = c.when >= 0 ? new Date(r[c.when]).getTime() || 0 : 0;
    if (latest[key] && latest[key].when > when) return;
    latest[key] = {
      when: when,
      entry: {
        name: name,
        side: c.side >= 0 ? String(r[c.side] || "").trim() : "",
        phone: c.phone >= 0 ? String(r[c.phone] || "").trim() : "",
        email: c.email >= 0 ? String(r[c.email] || "").trim() : "",
        show: c.share >= 0 ? YES.test(String(r[c.share] || "").trim()) : false
      }
    };
  });
  return Object.keys(latest).map(k => latest[k].entry);
}

/** What the website's Guests page reads. Only rows marked Show on website. */
function directory_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DIRECTORY_TAB_NAME);
  const out = { guests: [] };
  if (!sh || sh.getLastRow() < 2) return jsonOut_(out);

  const all = sh.getDataRange().getValues();
  const headers = all[0];
  const c = {
    name: col_(headers, ["name"]),
    side: col_(headers, ["side"]),
    phone: col_(headers, ["phone"]),
    email: col_(headers, ["email"]),
    show: col_(headers, ["showonwebsite", "show"])
  };
  if (c.name < 0) return jsonOut_(out);

  out.guests = all.slice(1)
    .filter(r => c.show < 0 || YES.test(String(r[c.show] || "").trim()))
    .map(r => ({
      name: String(r[c.name] || "").trim(),
      side: c.side >= 0 ? String(r[c.side] || "").trim() : "",
      phone: c.phone >= 0 ? String(r[c.phone] || "").trim() : "",
      email: c.email >= 0 ? String(r[c.email] || "").trim() : ""
    }))
    .filter(g => g.name && (g.phone || g.email))
    .sort((a, b) => a.name.localeCompare(b.name));
  return jsonOut_(out);
}

/* Sheet menu: Wedding site → Rebuild guest list from RSVPs.
   Use it the first time, or any time the tab drifts from the RSVPs log. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Wedding site")
    .addItem("Rebuild guest list from RSVPs", "rebuildDirectory")
    .addToUi();
}

function rebuildDirectory() {
  const n = upsertDirectory_(latestFromRsvps_());
  SpreadsheetApp.getUi().alert(
    n
      ? "Guest list updated from " + n + " RSVP" + (n === 1 ? "" : "s") + ".\n\n" +
        "Rows you hid stay hidden. The website updates on the next page load."
      : "No RSVPs to read yet, so nothing changed."
  );
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

    // Keep the "Guest list" tab, and so the website, in step with this reply.
    upsertDirectory_((d.guests || [])
      .filter(g => String(g.name || "").trim())
      .map(g => ({
        name: g.name,
        side: d.side || "",
        phone: g.phone || d.phone || "",
        email: g.email || d.email || "",
        show: !!d.shareContact && (g.welcomeParty || g.weddingDay)
      })));

    return jsonOut_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}
