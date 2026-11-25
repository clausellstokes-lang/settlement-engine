import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
import { loadPages } from './pages.mjs';
const SRC = process.env.RV6_SRC || '/home/user/pages53';
it('a', async () => {
  const { birth, pagesOf } = await loadPages();
  const { deriveCausalState } = await import(`${SRC}/src/domain/causalState.js`);
  const { foundationBandShown } = await import(`${SRC}/src/domain/display/foundationBandShown.js`);
  const { deriveDailyLife } = await import(`${SRC}/src/domain/dailyLife.js`);
  const out = [];
  const seeds = ['r2r-city-24', 'r2r-city-36', 'r2r-hamlet-0', 'r2r-thorp-0', 'r2r-thorp-48', 'r2s-indebted-thorp-0', 'r2s-insurgency-town-0', 'r2s-occupied-town-0', 'r2s-slave_revolt-thorp-0', 'r2r-town-0', 'r2s-infiltrated-thorp-0', 'r2s-wartime-town-0', 'r2r-hamlet-36', 'r2r-city-12', 'r2s-under_siege-town-0'];
  const V = ['criminal_opportunity', 'defense_readiness', 'law_order', 'labor_capacity'];
  for (const seed of seeds) {
    const rec = birth(seed); const { P0, P1 } = pagesOf(rec);
    const sp = P1.economicState?.safetyProfile || {}; const sp0 = P0.economicState?.safetyProfile || {};
    const keys = { cap: ['blackMarketCapture' in sp0, 'blackMarketCapture' in sp], ratio: ['safetyRatio' in sp0, 'safetyRatio' in sp], crimeTypes: ['crimeTypes' in sp0, 'crimeTypes' in sp],
      rscore: [P0.defenseProfile?.readiness?.score, P1.defenseProfile?.readiness?.score], rlabel: [P0.defenseProfile?.readiness?.label, P1.defenseProfile?.readiness?.label],
      sev: [(P0.activeConditions || []).map((c) => `${c.archetype}:${c.severity}:${c.severityBand}`), (P1.activeConditions || []).map((c) => `${c.archetype}:${c.severity}:${c.severityBand}`)],
      legacy: ['legacyAnnotations' in (P0.history || {}), 'legacyAnnotations' in (P1.history || {}), 'siegeNarrative' in (P0.history || {}), 'siegeNarrative' in (P1.history || {})],
      seed: ['_seed' in P0, '_seed' in P1] };
    const c0 = deriveCausalState(P0).variables; const c1 = deriveCausalState(P1).variables;
    const bands = Object.fromEntries(V.map((k) => [k, `${foundationBandShown(P0, k, c0[k].band)}(${c0[k].score}) => ${foundationBandShown(P1, k, c1[k].band)}(${c1[k].score})`]));
    const d0 = deriveDailyLife(P0, null).slots; const d1 = deriveDailyLife(P1, null).slots;
    const dl = Object.keys(d0).filter((k) => String(d0[k]?.text ?? '') !== String(d1[k]?.text ?? '')).map((k) => `${k}: ${d0[k]?.text} => ${d1[k]?.text}`);
    out.push({ seed, keys, bands, dl, contrib: { co: [c0.criminal_opportunity.contributors, c1.criminal_opportunity.contributors].map((l) => l.map((x) => `${x.source}:${x.delta}`)), dr: [c0.defense_readiness.contributors, c1.defense_readiness.contributors].map((l) => l.map((x) => `${x.source}:${x.delta}`)), lab: [c0.labor_capacity.contributors, c1.labor_capacity.contributors].map((l) => l.map((x) => `${x.source}:${x.delta}`)) } });
  }
  writeFileSync(`${process.env.FC_OUT}/a.json`, JSON.stringify(out, null, 1));
});
