// MEASURE-WORDING's tally. usage: node tally-wording.mjs <dir holding rows.<size>.jsonl>
// Prints count lines, then per fault one row per DISTINCT sentence (field path · text): places, sizes, flagged count.
import { readFileSync, readdirSync } from 'node:fs';
const dir = process.argv[2];
const rows = readdirSync(dir).filter((f) => /^rows\.\w+\.jsonl$/.test(f))
  .flatMap((f) => readFileSync(`${dir}/${f}`, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)));
console.log(`COUNT places ${rows.length}; walkMatches ${rows.filter((r) => r.walkMatches).length}`);

/** Group items (each with .key, .row, .flagged) by key: places, sizes, flagged places. */
function group(items) {
  const m = new Map();
  for (const { key, row, flagged, extra } of items) {
    const g = m.get(key) || { places: new Set(), sizes: {}, flagged: new Set(), extra: new Map() };
    if (!g.places.has(row.seed)) g.sizes[row.size] = (g.sizes[row.size] || 0) + 1;
    g.places.add(row.seed);
    if (flagged) g.flagged.add(row.seed);
    if (extra) g.extra.set(extra, (g.extra.get(extra) || 0) + 1);
    m.set(key, g);
  }
  return [...m.entries()].sort((a, b) => b[1].places.size - a[1].places.size);
}
const show = (title, groups) => {
  console.log(`\n## ${title}: ${groups.length} distinct`);
  for (const [k, g] of groups) {
    const ex = g.extra.size ? ` extra=${JSON.stringify(Object.fromEntries(g.extra))}` : '';
    console.log(`- places ${g.places.size} flagged ${g.flagged.size} sizes ${JSON.stringify(g.sizes)}${ex}\n  ${k}`);
  }
};

// FAULT 1: every tier-noun finding, by field and whole field text
const f1 = rows.flatMap((r) => r.f1.map((x) => ({ key: `${x.field} :: [${x.phrase}] ${x.text}`, row: r, flagged: true })));
console.log(`COUNT f1 findings ${f1.length}; places ${new Set(f1.map((x) => x.row.seed)).size}; receipt tier-noun ${rows.reduce((a, r) => a + r.receiptTierNoun, 0)}`);
show('FAULT 1 (tier-noun)', group(f1));

// FAULT 2: every string with "hospital"
const f2 = rows.flatMap((r) => r.f2.map((x) => ({ key: `${x.field} :: ${x.text}${x.inst ? ` [inst: ${x.inst.name} / ${x.inst.category}]` : ''}`,
  row: r, flagged: x.flagged.some((d) => /^hospital/.test(d)), extra: `hasHospital=${r.hasHospital} hasHealer=${r.hasHealer} healer=${r.healerName}` })));
console.log(`COUNT f2 strings ${f2.length}; places ${new Set(f2.map((x) => x.row.seed)).size}; flagged places ${new Set(f2.filter((x) => x.flagged).map((x) => x.row.seed)).size}; receipt hospital ${rows.reduce((a, r) => a + r.receiptHospital, 0)}`);
console.log(`COUNT places with hasHospital ${rows.filter((r) => r.hasHospital).length}`);
show('FAULT 2 (hospital)', group(f2));

// FAULT 3: every "walled apart" / "keep apart" string, with its owner's words
const f3 = rows.flatMap((r) => r.f3.map((x) => ({ key: `${x.field} :: ${x.text}`, row: r, flagged: x.flagged.some((d) => /^walls/.test(d)), extra: `hasWalls=${r.hasWalls}` })));
console.log(`COUNT f3 strings ${f3.length}; places ${new Set(f3.map((x) => x.row.seed)).size}; flagged places ${new Set(f3.filter((x) => x.flagged).map((x) => x.row.seed)).size}; receipt walled-apart ${rows.reduce((a, r) => a + r.receiptWalledApart, 0)}`);
show('FAULT 3 (walled apart)', group(f3));
console.log('\n## FAULT 3 owners (distinct)');
const owners = new Map();
for (const r of rows) for (const x of r.f3) { const k = `${x.field} :: ${JSON.stringify(x.owner)}`; owners.set(k, (owners.get(k) || 0) + 1); }
for (const [k, n] of owners) console.log(`- ${n} × ${k}`);
