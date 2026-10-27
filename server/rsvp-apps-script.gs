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
 *  GET  → returns ONLY names + plus-one info for the RSVP lookup.
 *         Phone, address and reception details never leave the sheet.
 *  POST → appends one row per guest to a tab called "RSVPs" (created automatically).
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

function doGet(e) {
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

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(RSVP_TAB_NAME);
    if (!sh) {
      sh = ss.insertSheet(RSVP_TAB_NAME);
      sh.appendRow(["Submitted", "Invitation", "Guest", "Plus one?", "Welcome party", "Wedding day",
        "Meal", "Dietary", "Add to guest list", "Phone", "Email", "Song request", "Notes"]);
      sh.setFrozenRows(1);
    }
    const now = new Date();
    (d.guests || []).forEach(g => {
      sh.appendRow([now, d.partyId || "", g.name || "", g.isPlusOne ? "Yes" : "",
        g.welcomeParty ? "Yes" : "No", g.weddingDay ? "Yes" : "No",
        g.meal || "", g.dietary || "", d.shareContact ? "Yes" : "No",
        d.phone || "", d.email || "", d.song || "", d.notes || ""]);
    });
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
