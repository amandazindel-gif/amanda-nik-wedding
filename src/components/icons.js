/* Line icons used on the Schedule rows, drawn to match the design reference. */

const S = 'fill="none" stroke="#4F5D48" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';
const wrap = (inner) => `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${inner}</svg>`;

export const icons = {
  mountain: wrap(`<polygon points="2,19 9,7 16,19" ${S}/><polygon points="12,19 17,10 22,19" ${S}/>`),
  rings: wrap(`<circle cx="9.5" cy="14" r="5.5" ${S}/><circle cx="15.5" cy="14" r="5.5" ${S}/>`),
  fork: wrap(
    `<line x1="7" y1="3" x2="7" y2="21" ${S}/><line x1="4" y1="3" x2="4" y2="9" ${S}/><line x1="10" y1="3" x2="10" y2="9" ${S}/><line x1="17" y1="3" x2="17" y2="21" ${S}/><line x1="14" y1="3" x2="20" y2="3" ${S}/>`
  ),
  coffee: wrap(
    `<rect x="4" y="8" width="12" height="10" rx="3" ${S}/><circle cx="18.5" cy="12" r="3" ${S}/><line x1="8" y1="3" x2="8" y2="5.5" ${S}/>`
  ),
  beer: wrap(
    `<rect x="5" y="7" width="10" height="13" rx="2" ${S}/><rect x="16" y="10" width="3.5" height="6" rx="1.5" ${S}/><line x1="5" y1="11" x2="15" y2="11" ${S}/>`
  ),
  boot: wrap(`<polyline points="7,4 7,14 18,17 20,20 4,20 4,14" ${S}/>`),
  boat: wrap(`<polygon points="12,3 12,14 20,14" ${S}/><polyline points="3,17 21,17 18,21 6,21 3,17" ${S}/>`),
  bus: wrap(
    `<rect x="3" y="5" width="18" height="11" rx="2.5" ${S}/><circle cx="7.5" cy="19" r="2" ${S}/><circle cx="16.5" cy="19" r="2" ${S}/>`
  ),
  plane: wrap(`<polygon points="3,13 21,4 14,21 11,14" ${S}/>`),
  train: wrap(
    `<rect x="6" y="3" width="12" height="14" rx="3" ${S}/><line x1="6" y1="10" x2="18" y2="10" ${S}/><line x1="9" y1="17" x2="7" y2="21" ${S}/><line x1="15" y1="17" x2="17" y2="21" ${S}/>`
  ),
  museum: wrap(
    `<polyline points="3,11 12,4 21,11" ${S}/><polyline points="5,10 5,20 19,20 19,10" ${S}/><rect x="10" y="14" width="4" height="6" ${S}/>`
  ),
  music: wrap(
    `<circle cx="7" cy="18" r="3" ${S}/><line x1="10" y1="18" x2="10" y2="4" ${S}/><line x1="10" y1="4" x2="19" y2="6.5" ${S}/>`
  )
};

export function icon(kind) {
  return icons[kind] || icons.mountain;
}
