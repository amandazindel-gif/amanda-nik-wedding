/* FAQ: one answer open at a time. */

const buttons = [...document.querySelectorAll("[data-faq-toggle]")];

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    buttons.forEach((other) => {
      const panel = document.getElementById(other.getAttribute("aria-controls"));
      const makeOpen = other === btn && !open;
      other.setAttribute("aria-expanded", String(makeOpen));
      if (panel) panel.hidden = !makeOpen;
      const sign = other.querySelector(".faq-item__sign");
      if (sign) sign.textContent = makeOpen ? "–" : "+";
    });
  });
});

// Open the first question so the page never reads as a wall of closed rows.
if (buttons[0]) buttons[0].click();
