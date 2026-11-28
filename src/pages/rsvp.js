import { esc, url, asset } from "../components/util.js";

export default function rsvp(W) {
  /* The guest-list code. Shown to anyone who opted in, on both end screens:
     coming back for the code they didn't write down is exactly why someone
     looks themselves up a second time. */
  const codePanel = (hook) =>
    W.guestListCode
      ? `<div class="rsvp-code" ${hook} hidden>
          <p class="rsvp-code__label">Use this code when accessing the guest list</p>
          <p class="rsvp-code__value">${esc(W.guestListCode)}</p>
          <p class="rsvp-code__note">It unlocks the <a href="${url("/guests/")}">Guests page</a>, where everyone who opted in shares their contact details.</p>
        </div>`
      : "";

  const body = `
<main style="padding:44px 16px 70px">
  <div class="rsvp">

    <!-- Stage 1 · find your invitation -->
    <div class="rsvp-stage rsvp-lookup" data-stage="lookup">
      <div class="rsvp-head">
        <p class="eyebrow">RSVP</p>
        <h1>Find your invitation</h1>
        <p>Type your name and we'll pull up everyone on your invitation. Please reply by <strong>${esc(W.rsvpDeadline)}</strong>.</p>
      </div>
      <form class="rsvp-card" data-lookup-form novalidate>
        <div class="field-row">
          <label class="field">
            <span>First name</span>
            <input type="text" name="first" autocomplete="given-name" required>
          </label>
          <label class="field">
            <span>Last name</span>
            <input type="text" name="last" autocomplete="family-name" required>
          </label>
        </div>

        <div class="suggestions" data-suggestions hidden>
          <p>Did you mean</p>
        </div>

        <p class="notice" data-need-full-name hidden>Please enter both your first and last name.</p>

        <div class="notice" data-not-found hidden>
          <p>We can't find that name on the list. Try the name on your invitation, or your partner's name.</p>
          <button type="button" data-manual>Reply without the list</button>
        </div>

        <div class="rsvp-actions">
          <button type="submit" class="btn btn--primary btn--lg btn--raised">Find me</button>
          <span class="rsvp-status" data-list-status></span>
        </div>
      </form>
    </div>

    <!-- Stage 2 · the party's reply -->
    <div class="rsvp-stage" data-stage="form" hidden>
      <div class="rsvp-head" style="margin-bottom:20px">
        <h1 data-form-headline style="font-size:clamp(30px,5.4vw,46px)">Hi there!</h1>
        <p>Please fill out the RSVP below.</p>
      </div>
      <form class="rsvp-form" data-rsvp-form>
        <div data-people></div>

        <div class="rsvp-extras">
          <label class="check">
            <input type="checkbox" data-share>
            <span><strong>Add me to the guest list</strong><small>Share your phone and email with other guests so you can coordinate travel and plans.</small></span>
          </label>
          <div class="share-fields-block" data-share-fields hidden>
            <p class="share-note">Add a phone number or email for each person, and they'll appear on the <a href="${url("/guests/")}">Guests page</a> for other guests to find. Either one is enough.</p>
            <div data-share-people></div>
          </div>
          <label class="field">
            <span>Request your favorite song, or a song that reminds you of us.</span>
            <input type="text" data-song placeholder="Artist, Title">
          </label>
          <label class="field">
            <span>Anything we should know?</span>
            <textarea rows="3" data-notes placeholder="Arriving late, mobility needs, anything at all"></textarea>
          </label>
        </div>

        <div class="rsvp-actions">
          <button type="button" class="btn btn--outline btn--lg" data-reset>Back</button>
          <button type="submit" class="btn btn--primary btn--lg btn--raised" data-send>Send it</button>
        </div>
        <p class="notice" data-send-error hidden></p>
      </form>
    </div>

    <!-- Stage 3 · they have replied before -->
    <div class="rsvp-stage" data-stage="already" hidden>
      <div class="rsvp-card rsvp-done">
        <p class="rsvp-done__script">Hello again!</p>
        <h1>You've already replied.</h1>
        <p data-already-when>Here's what you told us.</p>
        <div class="rsvp-summary" data-already-summary></div>
        ${codePanel("data-already-code")}
        <p class="rsvp-already__note">Changed your mind, or need to fix something? Reply again and we'll go by your newest answer.</p>
        <div class="rsvp-done__actions">
          <button type="button" class="btn btn--forest" data-already-change>Change your reply</button>
          <button type="button" class="btn btn--outline" data-reset>Reply for someone else</button>
        </div>
      </div>
    </div>

    <!-- Stage 4 · confirmation -->
    <div class="rsvp-stage" data-stage="done" hidden>
      <div class="rsvp-card rsvp-done">
        <img src="${asset("assets/daisy-line.png")}" alt="Line drawing of Daisy the dog, grinning" width="170" height="170">
        <p class="rsvp-done__script">Got it!</p>
        <h1 data-confirm-headline>See you in the Alps.</h1>
        <p>Daisy has filed your reply under "important". More details will be added as we get closer.</p>
        <div class="rsvp-summary" data-summary></div>
        ${codePanel("data-guest-code")}
        <div class="rsvp-done__actions">
          <a class="btn btn--forest" href="${url("/stay/")}">Find a room</a>
          <button type="button" class="btn btn--outline" data-reset>Reply for someone else</button>
        </div>
      </div>
    </div>

  </div>
</main>`;

  return {
    route: "/rsvp/",
    title: "RSVP · Amanda & Nik",
    desc: `Find your invitation and reply by ${W.rsvpDeadline}.`,
    current: "rsvp",
    body,
    head: `<script>window.__WED_RSVP = ${JSON.stringify({
      sheetScriptUrl: W.sheetScriptUrl,
      invitees: W.invitees,
      mealOptions: W.mealOptions
    })};</script>`,
    scripts: ["scripts/rsvp.js"]
  };
}
