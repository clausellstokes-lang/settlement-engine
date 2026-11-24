// VEIL-51 UNIT 4 (1): THE PLANTED POSITIVE for wd (NAMES), a DATA plant (no instrument is edited): node plant.mjs <stored dir> <out dir>
// Copies every <seed>.json of a stored set; in each of the PLANTED seeds (a criminal power stored, NOT one of N104's natural
// places) the FIRST non-criminal power's `desc` gains one sentence naming that criminal power. Where a read withholds the
// criminal power and shows the other, wd must count the planted path; where it shows both, the served name is cut and nothing counts.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const [, , IN, OUT] = process.argv;
const PLANTED = ['r3m-city-indebted-0-46', 'r3m-city-infiltrated-0-42', 'r3m-city-none-1-107', 'r3m-city-insurgency-1-104'];
mkdirSync(OUT, { recursive: true });
const log = [];
for (const f of readdirSync(IN).filter((x) => x.endsWith('.json'))) {
  const doc = JSON.parse(readFileSync(`${IN}/${f}`, 'utf8'));
  const seed = f.replace(/\.json$/, '');
  if (PLANTED.includes(seed)) {
    const ps = doc.powerStructure.factions;
    const crim = ps.find((p) => p.category === 'criminal');
    const host = ps.find((p) => p.category !== 'criminal');
    if (!crim || !host) throw new Error(`${seed}: no criminal or no host power`);
    const name = crim.faction || crim.name;
    host.desc = `${host.desc} PLANT: they keep a wary eye on the ${name}.`;
    log.push(`${seed}\thost ${host.faction || host.name}\tnames ${name}`);
  }
  writeFileSync(`${OUT}/${f}`, JSON.stringify(doc));
}
writeFileSync(`${OUT}/PLANT.txt`, log.join('\n') + '\n');
console.log(log.join('\n'));
if (log.length !== PLANTED.length) { console.error('A PLANT MISSED'); process.exit(2); }
