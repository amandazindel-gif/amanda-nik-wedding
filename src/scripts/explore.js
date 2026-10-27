/* Explore: filter the "things to do" cards by tag. */

const grid = document.querySelector("[data-explore-grid]");
const chips = [...document.querySelectorAll("[data-filter]")];
const count = document.querySelector("[data-result-count]");
const cards = grid ? [...grid.querySelectorAll(".explore-card")] : [];

function apply(filter) {
  let shown = 0;
  cards.forEach((card) => {
    const tags = (card.dataset.tags || "").split("|").filter(Boolean);
    const on = filter === "All" || tags.includes(filter);
    card.hidden = !on;
    if (on) shown++;
  });
  chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filter === filter)));
  if (count) count.textContent = shown + (shown === 1 ? " place" : " places");
}

chips.forEach((chip) => chip.addEventListener("click", () => apply(chip.dataset.filter)));
