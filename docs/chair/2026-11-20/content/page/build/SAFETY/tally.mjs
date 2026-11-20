#!/usr/bin/env node
/**
 * RUN (from the repository root, at the tip):
 *   node docs/chair/2026-11-20/content/page/build/SAFETY/tally.mjs "$PWD" > docs/chair/2026-11-20/content/page/build/SAFETY/tally.out.txt
 * PAGE-1's SAFETY unit: over the guard's pools (the chair's 300 and the census's 720), how many towns the owner's line is
 * owed to (by the guard's own reference: measure B's scale against Foundations' law row) and the lines the leaf prints,
 * each with its count. Record level; the rendered proof is tests/ui/safetyOwnerGuard.test.jsx.
 */
const L = process.argv[2];
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES, censusPlan, configOf } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { deriveCausalState } = await import(`${L}/src/domain/causalState.js`);
const { foundationBandShown } = await import(`${L}/src/domain/display/foundationBandShown.js`);
const { safetyBandOf } = await import(`${L}/src/domain/display/labelBands.js`);
const { safetyShownOf } = await import(`${L}/src/domain/display/safetyShown.js`);

const SAFETY = { 'Very Safe': 4, Safe: 3, Moderate: 2, Unsafe: 1, Dangerous: 0, Controlled: 2, Tense: 2, Quarantined: 2, Strained: 1, Restricted: 1, Suspicious: 1, Desperate: 0, Volatile: 0, Critical: 0 };
const CAUSAL = { surplus: 4, adequate: 3, strained: 2, critical: 1, collapsed: 0 };
await loadGenerationLawPayloads();
const pools = { town300: [], census720: [] };
for (const size of SIZES) for (let i = 0; i < 50; i++) pools.town300.push({ size, t: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} }) });
for (const row of censusPlan('r2')) pools.census720.push({ size: row.size, t: generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} }) });
const tally = (a) => { const m = new Map(); for (const k of a) m.set(k, (m.get(k) || 0) + 1); return [...m].sort((x, y) => y[1] - x[1]); };
for (const [pool, towns] of Object.entries(pools)) {
  const rows = towns.map(({ size, t }) => {
    const label = t.economicState?.safetyProfile?.safetyLabel; const s = SAFETY[safetyBandOf(label) ?? label];
    const law = CAUSAL[foundationBandShown(t, 'law_order', deriveCausalState(t).variables.law_order.band)];
    const calm = s >= 2; const tens = t.history?.currentTensions; const list = Array.isArray(tens) ? tens : tens ? [tens] : [];
    const seat = calm && ['corrupted', 'capture'].includes(t.powerStructure?.criminalCaptureState); const wave = calm && list.some((x) => x?.type === 'crime_wave');
    const apart = Math.abs(s - law) >= 2;
    return { size, apart, above: apart && s > law, seat, wave, owed: apart || seat || wave, owner: safetyShownOf(t, 'owner').qualifier, reader: safetyShownOf(t, 'reader').qualifier, rawEqual: safetyShownOf(t).label === (label || null) };
  });
  const n = (f) => rows.filter(f).length;
  console.log(`${pool} (${rows.length}): apart ${n((r) => r.apart)} (the label above the law ${n((r) => r.above)}, below ${n((r) => r.apart && !r.above)}); seat in criminal hands under a calm word ${n((r) => r.seat)}; crime wave under a calm word ${n((r) => r.wave)}; OWED ${n((r) => r.owed)}; owner line printed ${n((r) => !!r.owner)}; owed but no line ${n((r) => r.owed && !r.owner)}; line but not owed ${n((r) => !r.owed && !!r.owner)}; reader lines ${n((r) => !!r.reader)}; reader label differs from the record ${n((r) => !r.rawEqual)}`);
  console.log(`  by size, apart: ${SIZES.map((z) => `${z} ${rows.filter((r) => r.size === z && r.apart).length}/${rows.filter((r) => r.size === z).length}`).join(' · ')}`);
  for (const [line, c] of tally(rows.filter((r) => r.owner).map((r) => r.owner))) console.log(`  ${String(c).padStart(4)}  ${line}`);
}
