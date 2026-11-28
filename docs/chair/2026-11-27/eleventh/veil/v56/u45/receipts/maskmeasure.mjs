// U45B, VEIL-56 step 3: THE MASK GAP, MEASURED BEFORE ANY RULE (offline, the twin with the door's stored row).
// Over both stored pools, each place with EACH non-governing power hand-hidden in turn (hidden: true), Reveal off and DM,
// the twin's served document (projectShareVeil over galleryPayloadFor, live mode, stored = the live row). THE ORACLE IS THE
// RAW STORED TOWN: for each served desc that holds the projection's mask (publicSafe.js :: HIDDEN_POWER_MASK), the STORED
// desc of the same row, cut by the twin's table (standingBase), is asked whether it names the hidden power (the lane's fold,
// buildNameSearch). Classes: GAP (a masked name of the hidden power: what V25 (2) means to withhold), CLEAN (a mask with no
// hidden name behind it in the stored base: what the proposed rule would over-withhold). Also: reads that hide nothing
// (the mask on them must be 0), and THE PLANT (N4's arm 1): an unknown-form tail "Their quarrel with <hidden> is older than
// the walls." on a shown power's stored desc. Usage: node maskmeasure.mjs <tree> <pool>...
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const [tree, ...pools] = process.argv.slice(2);
const veil = await import(join(tree, 'src/domain/display/galleryVeil.js'));
const { buildNameSearch } = await import(join(tree, 'src/domain/display/gallerySecondHomes.js'));
const { standingBase } = await import(join(tree, 'src/domain/display/galleryWithholdAlways.js'));
const { HIDDEN_POWER_MASK: MASK } = await import(join(tree, 'src/domain/display/publicSafe.js'));
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const ov = veil.writeShareVeil({}, OPEN.map((a) => ({ address: a, hidden: false })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
const lists = (d) => [d?.powerStructure?.factions, d?.factions].filter(Array.isArray).flat().filter((f) => f && typeof f === 'object');
const namesOf = (f) => [f.faction, f.name].filter((v) => typeof v === 'string' && v !== '');
const read = (x, dm) => veil.projectShareVeil(veil.galleryPayloadFor(structuredClone(x), { shareDm: dm, memberOverrides: ov }), ov, { stored: x });
console.log(`maskmeasure tree=${tree} mask=${JSON.stringify(MASK)} ${new Date().toISOString()}`);
for (const dir of pools) {
  const t = { docs: 0, open: 0, openMask: 0, openDescs: 0, reads: 0, descs: 0, mask: 0, gap: 0, clean: 0, plants: 0, plantServed: 0, plantMask: 0, plantName: 0, rawMask: 0 };
  const ex = { gap: [], clean: [], plant: [] };
  for (const fn of readdirSync(dir).filter((n) => /^r3m-.*\.json$/.test(n)).sort()) {
    const rec = JSON.parse(readFileSync(join(dir, fn), 'utf8')); const doc = rec.data || rec.settlement || rec;
    t.docs += 1;
    t.rawMask += lists(doc).filter((f) => typeof f.desc === 'string' && f.desc.includes(MASK)).length;
    for (const dm of [false, true]) { const o = read(doc, dm); t.open += 1; for (const f of lists(o)) if (typeof f.desc === 'string') { t.openDescs += 1; if (f.desc.includes(MASK)) t.openMask += 1; } }
    const ps = Array.isArray(doc.powerStructure?.factions) ? doc.powerStructure.factions : [];
    const storedByName = new Map(lists(doc).flatMap((f) => namesOf(f).map((n) => [n, f])));
    for (let i = 0; i < ps.length; i += 1) {
      if (!ps[i] || typeof ps[i] !== 'object' || ps[i].isGoverning) continue;
      const hid = namesOf(ps[i]);
      const x = structuredClone(doc); x.powerStructure.factions[i] = { ...x.powerStructure.factions[i], hidden: true };
      const others = ps.map((f, j) => [f, j]).filter(([f, j]) => j !== i && f && namesOf(f).length && !hid.includes(namesOf(f)[0]));
      const search = buildNameSearch(hid, others.flatMap(([f]) => namesOf(f)));
      for (const dm of [false, true]) {
        const o = read(x, dm); t.reads += 1;
        for (const f of lists(o)) {
          if (typeof f.desc !== 'string') continue;
          t.descs += 1;
          if (!f.desc.includes(MASK)) continue;
          t.mask += 1;
          const st = namesOf(f).map((n) => storedByName.get(n)).find(Boolean);
          const base = st && typeof st.desc === 'string' ? standingBase(st.desc) : '';
          const k = search && search.hit(base) ? 'gap' : 'clean';
          t[k] += 1;
          if (ex[k].length < 3) ex[k].push(`${fn} hide=${hid[0]} dm=${dm}: ${namesOf(f)[0]}: "${f.desc.slice(0, 150)}"`);
        }
        // THE PLANT (N4 arm 1): the first shown non-governing power's stored desc gains a tail naming the hidden power
        const j = others.find(([f]) => !f.isGoverning)?.[1];
        if (j === undefined) continue;
        const y = structuredClone(x); const tail = ` Their quarrel with ${hid[0]} is older than the walls.`;
        y.powerStructure.factions[j] = { ...y.powerStructure.factions[j], desc: `${String(y.powerStructure.factions[j].desc || '')}${tail}` };
        const p = lists(read(y, dm)).find((f) => namesOf(f)[0] === namesOf(y.powerStructure.factions[j])[0]);
        t.plants += 1;
        if (p && typeof p.desc === 'string') { t.plantServed += 1; if (p.desc.includes(MASK)) t.plantMask += 1; if (search && search.hit(p.desc)) t.plantName += 1; if (ex.plant.length < 3) ex.plant.push(`${fn} hide=${hid[0]} dm=${dm}: "${p.desc.slice(-90)}"`); }
      }
    }
  }
  console.log(`POOL ${dir}: docs ${t.docs}; stored descs holding the mask raw ${t.rawMask}; NOTHING-HIDDEN reads ${t.open} (${t.openDescs} served descs), served with the mask ${t.openMask}`);
  console.log(`  HIDING reads ${t.reads} (place x hidden power x Reveal), served descs ${t.descs}; served WITH THE MASK ${t.mask}: GAP (the stored base names the hidden power) ${t.gap}, CLEAN (it does not) ${t.clean}`);
  console.log(`  PLANT (unknown-form tail naming the hidden power): ${t.plants} reads, served ${t.plantServed} (with the mask ${t.plantMask}, with the name ${t.plantName})`);
  for (const k of ['gap', 'clean', 'plant']) for (const e of ex[k]) console.log(`  ${k.toUpperCase()} e.g. ${e}`);
}
