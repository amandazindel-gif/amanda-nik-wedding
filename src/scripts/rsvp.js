/* RSVP: name lookup against the Google Sheet, the party's reply, and submit.

   Apps Script web apps don't answer CORS preflight, so the POST goes out as
   text/plain with a JSON body (a "simple" request) in no-cors mode. That means
   we can't read the response, only that the request left the browser. */

const CFG = window.__WED_RSVP || { sheetScriptUrl: "", invitees: [], mealOptions: [] };
const MEALS = CFG.mealOptions.length ? CFG.mealOptions : [{ id: "beef", label: "Bavarian BBQ" }];

const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const stages = {
  lookup: $('[data-stage="lookup"]'),
  form: $('[data-stage="form"]'),
  done: $('[data-stage="done"]')
};

const lookupForm = $("[data-lookup-form]");
const suggestionsBox = $("[data-suggestions]");
const needFullName = $("[data-need-full-name]");
const notFoundBox = $("[data-not-found]");
const listStatus = $("[data-list-status]");
const peopleBox = $("[data-people]");
const rsvpForm = $("[data-rsvp-form]");
const shareBox = $("[data-share]");
const shareFields = $$("[data-share-fields]");
const sendError = $("[data-send-error]");

let sheetList = null;
let listReady = Promise.resolve();
let state = { partyId: null, people: [], sending: false };

function show(stage) {
  Object.entries(stages).forEach(([k, el]) => { if (el) el.hidden = k !== stage; });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function list() {
  return sheetList || CFG.invitees || [];
}

/* ------------------------------------------------- load the guest list --- */
if (CFG.sheetScriptUrl) {
  if (listStatus) listStatus.textContent = "Loading the guest list…";
  listReady = fetch(CFG.sheetScriptUrl)
    .then((r) => r.json())
    .then((j) => {
      if (Array.isArray(j.invitees)) sheetList = j.invitees;
      if (listStatus) listStatus.textContent = "";
    })
    .catch(() => {
      if (listStatus) listStatus.textContent = "Couldn't load the guest list. Refresh to try again.";
    });
}

/* --------------------------------------------------------------- match --- */
function match(query) {
  const n = norm(query);
  if (!n) return { exact: null, near: [] };
  const rows = [];
  list().forEach((party) => {
    const names = (party.members || [])
      .concat(party.also || [], party.plusOneName ? [party.plusOneName] : []);
    names.forEach((nm) => rows.push({ party, name: nm, key: norm(nm) }));
  });
  const exact = rows.find((r) => r.key === n);
  if (exact) return { exact, near: [] };
  const near = rows
    .filter((r) => {
      const parts = r.key.split(" ");
      return r.key.indexOf(n) >= 0 || parts.some((p) => p === n || (n.length > 2 && p.indexOf(n) === 0));
    })
    .slice(0, 5);
  return { exact: null, near };
}

/* ------------------------------------------------------------ the form --- */
function blankPerson(name, opts = {}) {
  return {
    name: name || "",
    welcome: true,
    wedding: true,
    meal: MEALS[0].id,
    diet: "",
    phone: "",
    email: "",
    isPlusOne: !!opts.isPlusOne,
    needsName: !!opts.needsName
  };
}

function personCard(p, i) {
  const heading = p.name || (p.isPlusOne ? "Your plus one" : "Guest");
  const mealOptions = MEALS.map((m) => `<option value="${m.id}">${m.label}</option>`).join("");
  return `
  <div class="person" data-person="${i}">
    <div class="person__head">
      <h2 data-person-heading>${heading}</h2>
      <span class="person__tag">${p.isPlusOne ? "Plus one" : "On the list"}</span>
    </div>
    ${
      p.needsName
        ? `<label class="field" style="margin-bottom:14px">
             <span>Their name</span>
             <input type="text" data-field="name" value="${p.name}" placeholder="First and last">
           </label>`
        : ""
    }
    <div class="check-list">
      <label class="check">
        <input type="checkbox" data-field="welcome" checked>
        <span><strong>Welcome party</strong>, Wednesday, June 16<small>Tracht, beer, pretzels</small></span>
      </label>
      <label class="check">
        <input type="checkbox" data-field="wedding" checked>
        <span><strong>Wedding day</strong>, Thursday, June 17<small>Stögeralm</small></span>
      </label>
    </div>
    <div class="person__meal" data-attending>
      <label class="field">
        <span>Meal</span>
        <select data-field="meal">${mealOptions}</select>
      </label>
      <label class="field">
        <span>Allergies or dietary needs</span>
        <input type="text" data-field="diet" placeholder="Nut allergy, gluten free, no pork">
      </label>
    </div>
    <p class="person__regrets" data-regrets hidden>Not coming to either. We'll miss you, and we'll drink one for you.</p>
  </div>`;
}

function headline() {
  const firsts = state.people.map((p) => (p.name || "").trim().split(" ")[0]).filter(Boolean);
  if (!firsts.length) return "Hi there!";
  if (firsts.length === 1) return `Hi ${firsts[0]}!`;
  return `Hi ${firsts.slice(0, -1).join(", ")} and ${firsts[firsts.length - 1]}!`;
}

function syncPersonUi(card, p) {
  const attending = p.welcome || p.wedding;
  card.querySelector("[data-attending]").hidden = !attending;
  card.querySelector("[data-regrets]").hidden = attending;
  card.querySelector("[data-person-heading]").textContent =
    p.name || (p.isPlusOne ? "Your plus one" : "Guest");
}

function syncAllPersonUi() {
  $$("[data-person]", peopleBox).forEach((card) => syncPersonUi(card, state.people[Number(card.dataset.person)]));
}

/* Contact details sit directly under the "add me to the guest list" box, so
   they're where you're looking when you tick it. One pair per person who is
   actually coming. Values live in state, so re-rendering never loses a keystroke. */
function renderShareContacts() {
  const host = $("[data-share-people]");
  if (!host) return;
  host.textContent = "";

  state.people.forEach((p, i) => {
    if (!(p.welcome || p.wedding)) return;

    const group = document.createElement("div");
    group.className = "share-person";

    const label = document.createElement("p");
    label.className = "share-person__name";
    label.textContent = p.name || (p.isPlusOne ? "Your plus one" : "Guest");
    group.appendChild(label);

    const fields = document.createElement("div");
    fields.className = "share-fields";

    [
      { key: "phone", type: "tel", label: "Phone", placeholder: "+1 555 123 4567", autocomplete: "tel" },
      { key: "email", type: "email", label: "Email", placeholder: "you@example.com", autocomplete: "email" }
    ].forEach((f) => {
      const wrap = document.createElement("label");
      wrap.className = "field";
      const span = document.createElement("span");
      span.textContent = f.label;
      const input = document.createElement("input");
      input.type = f.type;
      input.placeholder = f.placeholder;
      input.autocomplete = f.autocomplete;
      input.value = p[f.key] || "";
      input.addEventListener("input", () => { state.people[i][f.key] = input.value; });
      wrap.append(span, input);
      fields.appendChild(wrap);
    });

    group.appendChild(fields);
    host.appendChild(group);
  });
}

function renderParty() {
  peopleBox.innerHTML = state.people.map(personCard).join("");
  $("[data-form-headline]").textContent = headline();

  $$("[data-person]", peopleBox).forEach((card) => {
    const i = Number(card.dataset.person);
    const p = state.people[i];
    card.addEventListener("input", (e) => {
      const field = e.target.dataset.field;
      if (!field) return;
      p[field] = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      syncPersonUi(card, p);
      // Attendance or a name change alters who needs contact fields.
      if (field === "welcome" || field === "wedding" || field === "name") renderShareContacts();
    });
    syncPersonUi(card, p);
  });

  renderShareContacts();
}

function openParty(party) {
  const members = (party.members || []).slice();
  state.partyId = party.id || null;
  state.people = members.map((m) => blankPerson(m));
  if (party.plusOneName) state.people.push(blankPerson(party.plusOneName, { isPlusOne: true }));
  if (party.plusOneOpen) state.people.push(blankPerson("", { isPlusOne: true, needsName: true }));
  renderParty();
  show("form");
}

/* -------------------------------------------------------------- lookup --- */
function hideNotices() {
  [suggestionsBox, needFullName, notFoundBox].forEach((el) => { if (el) el.hidden = true; });
  if (suggestionsBox) $$("button", suggestionsBox).forEach((b) => b.remove());
}

lookupForm.addEventListener("input", hideNotices);

lookupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideNotices();
  const first = lookupForm.elements.first.value;
  const last = lookupForm.elements.last.value;
  const query = `${first} ${last}`.trim();

  if (norm(query).split(" ").filter(Boolean).length < 2) {
    needFullName.hidden = false;
    return;
  }

  // The sheet takes a second or two to wake up. Searching before it answers
  // would check the three-name sample list and wrongly tell a real guest they
  // aren't invited, so wait for it.
  const submit = lookupForm.querySelector('button[type="submit"]');
  if (submit) {
    submit.disabled = true;
    submit.textContent = "Looking…";
  }
  await listReady;
  if (submit) {
    submit.disabled = false;
    submit.textContent = "Find me";
  }

  const r = match(query);
  if (r.exact) return openParty(r.exact.party);
  if (r.near.length === 1) return openParty(r.near[0].party);

  if (r.near.length) {
    suggestionsBox.hidden = false;
    r.near.forEach((n) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "suggestion";
      const extra = (n.party.members || []).length > 1 ? `+ ${(n.party.members || []).length - 1} more` : "";
      btn.innerHTML = `<span></span><span></span>`;
      btn.children[0].textContent = n.name;
      btn.children[1].textContent = extra;
      btn.addEventListener("click", () => openParty(n.party));
      suggestionsBox.appendChild(btn);
    });
    return;
  }

  notFoundBox.hidden = false;
  $("[data-manual]").onclick = () => {
    state.partyId = "MANUAL";
    state.people = [blankPerson(query)];
    renderParty();
    show("form");
  };
});

/* --------------------------------------------------------------- share --- */
if (shareBox) {
  shareBox.addEventListener("change", () => {
    shareFields.forEach((el) => { el.hidden = !shareBox.checked; });
    renderShareContacts();
    // Bring the newly revealed fields into view; they're easy to miss otherwise.
    if (shareBox.checked) {
      const host = $("[data-share-people]");
      if (host) host.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
}

/* -------------------------------------------------------------- submit --- */
rsvpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (state.sending) return;

  const share = shareBox.checked;
  const payload = {
    partyId: state.partyId,
    shareContact: share,
    side: share ? $("[data-side]").value : "",
    song: $("[data-song]").value,
    notes: $("[data-notes]").value,
    guests: state.people.map((p) => {
      const attending = p.welcome || p.wedding;
      return {
        name: p.name,
        isPlusOne: p.isPlusOne,
        welcomeParty: p.welcome,
        weddingDay: p.wedding,
        meal: attending ? p.meal : null,
        dietary: p.diet,
        // Only opted-in, attending guests reach the shared directory.
        phone: share && attending ? p.phone : "",
        email: share && attending ? p.email : ""
      };
    })
  };

  const finish = () => {
    state.sending = false;
    $("[data-send]").textContent = "Send it";
    renderConfirmation(payload);
    show("done");
  };

  if (!CFG.sheetScriptUrl) return finish();

  state.sending = true;
  sendError.hidden = true;
  $("[data-send]").textContent = "Sending…";
  try {
    await fetch(CFG.sheetScriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    finish();
  } catch (err) {
    state.sending = false;
    $("[data-send]").textContent = "Send it";
    sendError.hidden = false;
    sendError.textContent =
      "Sorry, your RSVP didn't send. Check your connection and try again, or text Amanda or Nik.";
  }
});

function renderConfirmation(payload) {
  const mealLabel = (id) => (MEALS.find((m) => m.id === id) || {}).label || id || "";
  const anyYes = payload.guests.some((g) => g.welcomeParty || g.weddingDay);
  const first = (payload.guests[0] && payload.guests[0].name ? payload.guests[0].name : "").split(" ")[0];

  $("[data-confirm-headline]").textContent = anyYes
    ? first
      ? `See you in the Alps, ${first}.`
      : "See you in the Alps."
    : "Thank you for telling us.";

  const summary = $("[data-summary]");
  summary.innerHTML = "";
  payload.guests.forEach((g) => {
    const row = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = g.name || "Guest";
    const line = document.createElement("span");
    line.textContent =
      !g.welcomeParty && !g.weddingDay
        ? "Can't make it"
        : [g.welcomeParty ? "Wed" : null, g.weddingDay ? "Thu" : null].filter(Boolean).join(" + ") +
          " · " +
          mealLabel(g.meal);
    row.append(name, line);
    summary.appendChild(row);
  });
}

/* --------------------------------------------------------------- reset --- */
$$("[data-reset]").forEach((btn) =>
  btn.addEventListener("click", () => {
    state = { partyId: null, people: [], sending: false };
    lookupForm.reset();
    hideNotices();
    if (shareBox) {
      shareBox.checked = false;
      shareFields.forEach((el) => { el.hidden = true; });
    }
    rsvpForm.querySelectorAll("input[type=text], input[type=tel], input[type=email], textarea").forEach((i) => (i.value = ""));
    show("lookup");
  })
);
