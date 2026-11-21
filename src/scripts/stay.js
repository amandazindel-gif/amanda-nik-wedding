/* Room-rate dialogs on the Stay page. One <dialog> per hotel, opened by that
   hotel's "Click for Pricing" button. */

document.querySelectorAll("[data-rates-open]").forEach((btn) => {
  const dialog = document.querySelector(`[data-rates="${btn.dataset.ratesOpen}"]`);
  if (!dialog) return;

  btn.addEventListener("click", () => {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", ""); // very old browsers: still readable
  });

  dialog.querySelector("[data-rates-close]")?.addEventListener("click", () => dialog.close());

  // Clicking the backdrop closes it. The dialog's own box is inset, so a click
  // landing outside those bounds came from the backdrop.
  dialog.addEventListener("click", (e) => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    const outside =
      e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    if (outside) dialog.close();
  });
});
