// U4 instrument: birth N towns a size under law 1 and law 2 (the fixture arm), dump the readings FS7 reads.
//   node births.mjs <tree> <out.json> [perSize=20] [prefix=u4]
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const [, , treeArg, outArg, nArg = '20', prefix = 'u4'] = process.argv;
const L = resolve(treeArg);
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { governanceAccountOf, legitimacyCausesOf } = await import(`${L}/src/domain/display/governanceAccount.js`);
const { legitimacyLensPoolKey, capturePoolKey } = await import(`${L}/src/domain/display/stateProse/powerStateProse.js`);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
await loadGenerationLawPayloads();
const out = [];
for (const law of [1, 2]) for (const size of SIZES) for (let i = 0; i < +nArg; i++) {
  const seed = `${prefix}-${size}-${i}`;
  const base = birthConfig({ ...DEFAULT_CONFIG, settType: size });
  const cfg = law === 2 ? { ...base, _fortuneLawVersion: 2 } : base;
  const t = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
  const leg = t.powerStructure?.publicLegitimacy || {};
  const acct = governanceAccountOf(t);
  out.push({
    law, size, seed, name: t.name,
    prosperity: t.economicState?.prosperity, standingLabel: t.economicState?.prosperityStanding,
    legLabel: leg.label, score: leg.score, breakdown: leg.breakdown,
    defence: t.defenseProfile?.readiness?.label ?? t.defenseProfile?.readinessLabel ?? null,
    safety: t.economicState?.safetyProfile?.safetyLabel, capture: t.powerStructure?.criminalCaptureState,
    stress: (Array.isArray(t.stress) ? t.stress : t.stress ? [t.stress] : []).map((s) => s?.type ?? s),
    causesAdverse: legitimacyCausesOf(leg.breakdown, true, t.economicState?.safetyProfile?.safetyLabel),
    causesFav: legitimacyCausesOf(leg.breakdown, false),
    lensKey: legitimacyLensPoolKey(leg), captureKey: capturePoolKey(t.powerStructure?.criminalCaptureState, leg.breakdown),
    account: acct?.text ?? null,
    situationDesc: t.economicState?.situationDesc ?? null,
  });
}
writeFileSync(outArg, JSON.stringify(out, null, 1));
console.log(`births ${out.length}`);
