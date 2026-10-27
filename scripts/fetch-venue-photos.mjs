#!/usr/bin/env node
/* Download the Stögeralm photos into public/assets so the site self-hosts them.
 *
 * Only run this once stoegeralm.de has given permission to host their photos.
 * Until then the site hotlinks them, which is slower and can break without
 * warning.
 *
 *   npm run fetch-venue-photos
 *
 * Afterwards, swap the remote URLs in src/data/wedding-data.js for the local
 * paths the script prints.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { wedding } from "../src/data/wedding-data.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "assets", "venue");

const remote = wedding.venuePhotos.filter((p) => /^https?:/.test(p.src));
if (!remote.length) {
  console.log("Nothing to do: every venue photo is already a local path.");
  process.exit(0);
}

await mkdir(out, { recursive: true });

const mapping = [];
for (const [i, photo] of remote.entries()) {
  const name = `stoegeralm-${String(i + 1).padStart(2, "0")}.jpg`;
  const res = await fetch(photo.src);
  if (!res.ok) {
    console.error(`  ✗ ${photo.src} → ${res.status}`);
    continue;
  }
  await writeFile(join(out, name), Buffer.from(await res.arrayBuffer()));
  mapping.push({ from: photo.src, to: `assets/venue/${name}`, alt: photo.alt });
  console.log(`  ✓ ${name}`);
}

console.log("\nNow replace the venuePhotos src values in src/data/wedding-data.js:\n");
mapping.forEach((m) => console.log(`  { src: "${m.to}", alt: ${JSON.stringify(m.alt)} },`));
