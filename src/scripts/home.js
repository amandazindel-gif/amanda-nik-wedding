/* Home: the countdown and the scroll-progress bar under the nav. */

const bar = document.querySelector("[data-scroll-progress]");
if (bar) {
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight || 1;
    const p = Math.min(1, Math.max(0, window.scrollY / max));
    bar.style.width = (p * 100).toFixed(2) + "%";
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

const counter = document.querySelector("[data-countdown]");
if (counter) {
  const target = new Date(counter.dataset.target).getTime();
  const units = {};
  counter.querySelectorAll("[data-unit]").forEach((el) => { units[el.dataset.unit] = el; });
  const pad = (n) => String(n).padStart(2, "0");

  const tick = () => {
    const s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    units.days.textContent = String(Math.floor(s / 86400));
    units.hrs.textContent = pad(Math.floor(s / 3600) % 24);
    units.min.textContent = pad(Math.floor(s / 60) % 60);
    units.sec.textContent = pad(s % 60);
  };
  tick();
  setInterval(tick, 1000);
}
