// unit45-an.mjs <json>: R3-CURE-5 units 4-5 counts from unit45.probe.jsx
import { readFileSync } from 'node:fs';
const t = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const H = t.filter((x) => x.hidden);
console.log(`births ${t.length}; with a hideable house ${H.length}`);
for (const dm of ['off', 'dm']) {
  const lost = H.filter((x) => x.reach[dm].length);
  console.log(`(a) power.entry's REACH, Reveal ${dm}: of ${t.length} born pages (${H.length} with a house hidden), ${lost.length} lose a criminal power's row that no hidden house raised (the counterfactual still holds it): ${lost.map((x) => `${x.seed} [${x.reach[dm].join(', ')}]`).join('; ')}`);
}
const v = t.filter((x) => x.vr42.length);
console.log(`(b) VR42 (a governing criminal power, its row kept): met by ${v.length} of ${t.length} born towns${v.length ? `: ${v.map((x) => `${x.seed} [${x.vr42}]`).join('; ')}` : ''}`);
const c = H.filter((x) => x.crimHidden); const r = H.filter((x) => x.rename);
console.log(`THE RENAMED HOUSE: towns with a criminal house hidden ${c.length}; of them with another criminal house to show and rename (one plant each) ${r.length}; the renamed shown house served ${r.filter((x) => x.rename.shownRenamed).length}; its operations-list line LOST ${r.filter((x) => x.rename.lost).length} of ${r.length}`);
for (const x of r) console.log(`  ${x.seed}: ${x.rename.house} -> "The Quiet Lantern": ops ${JSON.stringify(x.rename.opsPlain)} -> ${JSON.stringify(x.rename.opsRenamed)}${x.rename.lost ? ' LOST' : ''}`);
