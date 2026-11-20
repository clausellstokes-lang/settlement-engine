// RUN (from the repository root):
//   node docs/chair/2026-11-20/content/page/build/CARD-SERVED/standingDrift.mjs <base tree> <tip tree> > <out>.txt
// PAGE-4 CARD-SERVED's measure over the born corpora (the chair's 300 `hxd-<size>-<i>` and the census's 720, the same
// births as build/CARD/bornHash.mjs, born in the TIP tree): for every person, the Standing line by the BASE reader and by
// the TIP reader (cardStandingRead.js :: cardStandingLine; the view row's `firstOfLine` is the same parts joined, pinned
// by the served test). Counts: the first-of memberships whose power the roster holds with no figure, those whose power
// the roster does not hold, and the lines that differ.
const [B, T] = process.argv.slice(2);
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${T}/src/store/configSlice.js`);
const { SIZES, censusPlan, configOf } = await import(`${T}/tests/components/pageCensusWalk.shared.mjs`);
const base = await import(`${B}/src/domain/display/cardStandingRead.js`);
const tip = await import(`${T}/src/domain/display/cardStandingRead.js`);

await loadGenerationLawPayloads();
const c = { docs: 0, people: 0, firstOf: 0, firstOfFigureless: 0, firstOfUnheld: 0, linesDiffer: 0 };
/** @param {string} key @param {any} doc */
function measure(key, doc) {
  c.docs += 1;
  const fs = doc?.powerStructure?.factions || [];
  const byName = new Map(fs.map((/** @type {any} */ f) => [String(f?.faction || f?.name || ''), f]));
  for (const n of doc?.npcs || []) {
    c.people += 1;
    for (const m of Array.isArray(n?.memberships) ? n.memberships : []) {
      if (m?.rank !== 1) continue;
      c.firstOf += 1;
      const f = byName.get(String(m.power));
      if (!f) { c.firstOfUnheld += 1; console.log(`UNHELD ${key} ${n.name} :: ${m.power}`); }
      else if (!Number.isFinite(typeof f.power === 'number' ? f.power : Number.NaN)) { c.firstOfFigureless += 1; console.log(`FIGURELESS ${key} ${n.name} :: ${m.power}`); }
    }
    const a = base.cardStandingLine(n, doc); const b = tip.cardStandingLine(n, doc);
    if (a !== b) { c.linesDiffer += 1; console.log(`DIFFER ${key} ${n.name} :: ${JSON.stringify(a)} -> ${JSON.stringify(b)}`); }
  }
}
for (const size of SIZES) for (let i = 0; i < 50; i++) {
  const seed = `hxd-${size}-${i}`;
  measure(seed, generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }));
}
for (const row of censusPlan('r2')) measure(row.seed, generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} }));
console.log(`COUNTS ${JSON.stringify(c)}`);
