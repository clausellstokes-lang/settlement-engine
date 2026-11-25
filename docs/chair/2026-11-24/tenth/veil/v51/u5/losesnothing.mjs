// V20 (c) "loses nothing" (VEIL-51 unit 5; offline, the twin): over both stored pools, each place at Reveal off and DM and the
// default veil and the opened one; on every read whose served document names EVERY stored power (nothing withheld), the served
// document with the stored row equals the one without it, leaf for leaf. Usage: node losesnothing.mjs <codeTree> <poolDir>...
import { readFileSync, readdirSync } from 'node:fs'; import { join } from 'node:path';
const [tree, ...pools] = process.argv.slice(2);
const veil = await import(join(tree, 'src/domain/display/galleryVeil.js'));
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const settings = { default: veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' }),
  open: veil.writeShareVeil({}, OPEN.map((a) => ({ address: a, hidden: false })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' }) };
const lists = (d) => [d?.powerStructure?.factions, d?.factions].filter(Array.isArray).flat().filter((f) => f && typeof f === 'object');
const namesOf = (f) => [f.faction, f.name].filter((v) => typeof v === 'string' && v !== '');
const strip = (d) => JSON.stringify(d, (k, v) => (k === 'id' || /Id$/.test(k) || k === 'from' || k === 'to' ? undefined : v)); // ids re-keyed per call
for (const dir of pools) {
  let reads = 0, nothing = 0, differ = 0; const ex = [];
  for (const fn of readdirSync(dir).filter((n) => /^r3m-.*\.json$/.test(n)).sort()) {
    const rec = JSON.parse(readFileSync(join(dir, fn), 'utf8')); const doc = rec.data || rec.settlement || rec;
    for (const dm of [false, true]) for (const [k, ov] of Object.entries(settings)) {
      const read = (st) => veil.projectShareVeil(veil.galleryPayloadFor(structuredClone(doc), { shareDm: dm, memberOverrides: ov }), ov, st ? { stored: doc } : undefined);
      const a = read(true); reads += 1;
      const served = new Set(lists(a).flatMap(namesOf));
      if (lists(doc).some((f) => !namesOf(f).some((n) => served.has(n)))) continue;
      nothing += 1;
      const b = read(false);
      if (strip(a) !== strip(b)) { differ += 1; if (ex.length < 3) ex.push(`${fn} dm=${dm} ${k}`); }
    }
  }
  console.log(`POOL ${dir}: reads ${reads}; nothing-hidden reads ${nothing}; differing with the stored row ${differ} ${ex.join('; ')}`);
}
