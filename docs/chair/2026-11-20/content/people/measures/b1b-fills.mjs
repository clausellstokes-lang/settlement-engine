// PEOPLE-1 B1b (2026-11-20; the chair's ruling of 16:51 UTC, (c) and (e)): THE FILL LIST. Every distinct filled sentence that
// carries {house}, {export} or {import}, over 600 places (hxd-<size>-0..99, born as the chair's instrument births them), for
// `npcs[].activeConstraint` (CONSTRAINT_VARIANTS) and, for the security reader at the join, `npcs[].structuralPosition`
// (POSITION_VARIANTS); then every house a wording names, pool by pool.
// Usage: node b1b-fills.mjs <built tree>   (prints the list; the committed copy is b1b-fills.out.txt)
const [, , L] = process.argv;
if (!L) throw new Error('usage: node b1b-fills.mjs <built tree>');
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { CONSTRAINT_VARIANTS, POSITION_VARIANTS } = await import(`${L}/src/data/npcStructureVariants.js`);
await loadGenerationLawPayloads();

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const slotted = (pools) => Object.entries(pools).flatMap(([key, pool]) => pool.map((row, at) => ({ key, at, row })).filter((r) => /\{(?:house|export|import)\}/.test(r.row.text)))
  .map((r) => ({ ...r, slots: [...r.row.text.matchAll(/\{(house|export|import)\}/g)].map((m) => m[1]), re: new RegExp(`^${esc(r.row.text).replace(/\\\{(?:house|export|import)\\\}/g, '(.+)')}$`) }));
const FIELDS = [['activeConstraint', slotted(CONSTRAINT_VARIANTS)], ['structuralPosition', slotted(POSITION_VARIANTS)]];
const HOUSE_TAIL = / Still .+ as well\.$/;
/** field → sentence → { key, at, places } ; field → pool → house → places */
const sentences = Object.fromEntries(FIELDS.map(([f]) => [f, new Map()]));
const houses = Object.fromEntries(FIELDS.map(([f]) => [f, new Map()]));
for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
  for (let i = 0; i < 100; i++) {
    const seed = `hxd-${size}-${i}`;
    const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    for (const c of s.npcs || []) {
      for (const [field, rows] of FIELDS) {
        const text = String(c[field] || '').replace(HOUSE_TAIL, '');
        if (!text) continue;
        for (const r of rows) {
          const m = r.re.exec(text);
          if (!m) continue;
          const e = sentences[field].get(text) || { key: r.key, at: r.at, places: new Set() };
          e.places.add(seed); sentences[field].set(text, e);
          r.slots.forEach((slot, k) => {
            if (slot !== 'house') return;
            const byPool = houses[field].get(`${r.key}#${r.at}`) || new Map();
            const set = byPool.get(m[k + 1]) || new Set(); set.add(seed); byPool.set(m[k + 1], set);
            houses[field].set(`${r.key}#${r.at}`, byPool);
          });
        }
      }
    }
  }
}
const out = ['# B1b fill list (100 places a size, hxd seeds): every distinct filled sentence carrying {house}, {export} or {import}; places'];
for (const [field] of FIELDS) {
  out.push('', `## ${field}: ${sentences[field].size} distinct filled sentences`);
  for (const [text, e] of [...sentences[field]].sort((a, b) => a[1].key.localeCompare(b[1].key) || a[1].at - b[1].at || a[0].localeCompare(b[0]))) out.push(`fill ${field} | ${e.key}#${e.at} | ${e.places.size} | ${text}`);
}
out.push('', '# (e)(2): every house a wording names, pool by pool (none is of a hideable kind: the `own house` atom answers only for a house stamped public at birth)');
for (const [field] of FIELDS) {
  for (const [pool, byHouse] of [...houses[field]].sort()) out.push(`house ${field} | ${pool} | ${[...byHouse].sort().map(([h, set]) => `${h} (${set.size})`).join(' · ')}`);
}
console.log(out.join('\n'));
