// VEIL-51 unit 4, RULING V25's ONE MEASURE (offline, read-only): over both stored pools, every power desc (both lists),
// CUT by the one table (the twin's standingBase at the code tree), whose base contains the name of ANOTHER power of the
// same place (the lane's fold: gallerySecondHomes.js :: buildNameSearch, case-blind, the bare form; a name inside the desc
// owner's own name is opened as a served name is). Counts per pool; the classes; three examples per pool.
// Usage: node v25measure.mjs <codeTree> <poolDir>...   (writes to stdout)
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const [tree, ...pools] = process.argv.slice(2);
const { standingBase } = await import(join(tree, 'src/domain/display/galleryWithholdAlways.js'));
const { buildNameSearch } = await import(join(tree, 'src/domain/display/gallerySecondHomes.js'));
const namesOf = (f) => [f.faction, f.name].filter((v) => typeof v === 'string' && v !== '');
const nameOf = (f) => f.name || f.faction || '';
for (const dir of pools) {
  const files = readdirSync(dir).filter((n) => /^r3m-.*\.json$/.test(n)).sort();
  let places = 0, descs = 0, hits = 0; const hitPlaces = new Set(); const cls = new Map(); const ex = [];
  for (const fn of files) {
    const rec = JSON.parse(readFileSync(join(dir, fn), 'utf8'));
    const t = rec.data || rec.settlement || rec;
    const lists = [t.powerStructure?.factions, t.factions].filter(Array.isArray);
    const rows = lists.flat().filter((f) => f && typeof f === 'object');
    if (!rows.length) continue;
    places += 1;
    for (const f of rows) {
      if (typeof f.desc !== 'string' || f.desc === '') continue;
      descs += 1;
      const own = new Set(namesOf(f));
      const others = [...new Set(rows.filter((g) => g !== f).flatMap(namesOf))].filter((n) => !own.has(n));
      const named = others.filter((n) => { const s = buildNameSearch([n], [...own]); return !!s && s.hit(standingBase(f.desc)); });
      if (!named.length) continue;
      hits += 1; hitPlaces.add(fn);
      const k = typeof f.contestsNiche === 'string' && named.includes(f.contestsNiche) ? 'a density rival naming its own host' : 'other';
      cls.set(k, (cls.get(k) || 0) + 1);
      if (ex.length < 3 || (k === 'other' && !ex.some((e) => e.k === 'other'))) ex.push({ k, place: fn.replace('.json', ''), power: nameOf(f), names: named, base: standingBase(f.desc).slice(0, 160) });
    }
  }
  console.log(`POOL ${dir}: places ${places}, descs ${descs}, descs whose cut base names ANOTHER power of the place ${hits} (${hitPlaces.size} places)`);
  for (const [k, n] of cls) console.log(`  class: ${k}: ${n}`);
  for (const e of ex.slice(0, 4)) console.log(`  e.g. ${e.place} ${e.power} [${e.k}] names ${JSON.stringify(e.names)}: "${e.base}"`);
}
