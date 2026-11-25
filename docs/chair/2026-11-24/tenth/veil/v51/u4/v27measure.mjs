// RULING V27 (6)'s RE-MEASURE (VEIL-51 unit 4; offline, the twin with the door's stored row): over both stored pools, each
// place with EACH of its powers hand-hidden in turn (hidden: true), Reveal off and DM, the twin's served document read with
// the stored row (V27's belt) and without it (the narrower set). Counts: served descs naming, by the lane's fold, a power of
// the stored row the served document does not name (must be 0 with the stored row); descs the stored belt withholds (with
// minus without), three examples. Usage: node v27measure.mjs <codeTree> <poolDir>...
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const [tree, ...pools] = process.argv.slice(2);
const veil = await import(join(tree, 'src/domain/display/galleryVeil.js'));
const { buildNameSearch } = await import(join(tree, 'src/domain/display/gallerySecondHomes.js'));
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const ov = veil.writeShareVeil({}, OPEN.map((a) => ({ address: a, hidden: false })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
const lists = (d) => [d?.powerStructure?.factions, d?.factions].filter(Array.isArray).flat().filter((f) => f && typeof f === 'object');
const namesOf = (f) => [f.faction, f.name].filter((v) => typeof v === 'string' && v !== '');
for (const dir of pools) {
  const t = { reads: 0, hiding: 0, faults: 0, faultsNarrow: 0, withheldByRule: 0 }; const ex = []; const fx = [];
  for (const fn of readdirSync(dir).filter((n) => /^r3m-.*\.json$/.test(n)).sort()) {
    const rec = JSON.parse(readFileSync(join(dir, fn), 'utf8')); const doc = rec.data || rec.settlement || rec;
    const ps = Array.isArray(doc.powerStructure?.factions) ? doc.powerStructure.factions : [];
    for (let i = 0; i < ps.length; i += 1) {
      if (!ps[i] || typeof ps[i] !== 'object' || ps[i].isGoverning) continue;
      const x = structuredClone(doc); x.powerStructure.factions[i] = { ...x.powerStructure.factions[i], hidden: true };
      for (const dm of [false, true]) {
        const read = (st) => veil.projectShareVeil(veil.galleryPayloadFor(structuredClone(x), { shareDm: dm, memberOverrides: ov }), ov, st ? { stored: st } : undefined);
        const wide = read(x); const narrow = read(null);
        t.reads += 1;
        const served = new Set(lists(wide).flatMap(namesOf));
        const out = [...new Set(lists(x).filter((f) => !namesOf(f).some((n) => served.has(n))).flatMap(namesOf))];
        if (!out.length) continue;
        t.hiding += 1;
        const search = buildNameSearch(out, [...served]);
        const fault = (d) => lists(d).filter((f) => typeof f.desc === 'string' && search && search.hit(f.desc));
        const fw = fault(wide); const fnw = fault(narrow);
        t.faults += fw.length; t.faultsNarrow += fnw.length;
        if (fw.length && fx.length < 3) fx.push(`${fn} hide=${namesOf(ps[i])[0]} dm=${dm}: ${namesOf(fw[0])[0]}: ${fw[0].desc.slice(0, 120)}`);
        const nd = new Map(lists(narrow).map((f) => [namesOf(f)[0], f]));
        for (const f of lists(wide)) {
          const n = nd.get(namesOf(f)[0]);
          if (n && typeof n.desc === 'string' && !('desc' in f)) { t.withheldByRule += 1; if (ex.length < 3) ex.push(`${fn} hide=${namesOf(ps[i])[0]} dm=${dm}: ${namesOf(f)[0]}'s desc withheld whole: "${n.desc.slice(0, 110)}"`); }
        }
      }
    }
  }
  console.log(`POOL ${dir}: reads ${t.reads} (place x hidden power x Reveal), hiding reads ${t.hiding}; served descs naming a stored power not served: WITH the stored row ${t.faults}, without it ${t.faultsNarrow}; descs the stored belt withholds whole ${t.withheldByRule}`);
  for (const e of ex) console.log(`  withheld e.g. ${e}`);
  for (const e of fx) console.log(`  FAULT ${e}`);
}
