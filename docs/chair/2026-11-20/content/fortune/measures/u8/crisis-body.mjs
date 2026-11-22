// U8 measure (b) and the pin's census (c), READ-ONLY: node crisis-body.mjs <tree> <dark|lit> <seedsPerStress> [sizes]
// Births through the create boundary (birthConfig), every crisis the power step knows forced alone (the dials may add
// another), `seedsPerStress` seeds each: 15 crises x N seeds = the births a size. Lit is the explicit arm
// `{ ...birthConfig(cfg), _fortuneLawVersion: 2 }`. The crisis's own powers are read by the cure's own vocabulary
// (applyDensityLaw.js :: isCrisisOwnPower), imported from THIS checkout so a pre-cure tree is read by the same words.
// Counts: places where an active crisis has NO power of its own on the final roster (any crisis; and the forced one); and (c) where the record states a
// crisis (the one its stability line names) while the roster or the cast holds no body for it.
import { fileURLToPath } from 'node:url';
const T = process.argv[2]; const LIT = process.argv[3] === 'lit'; const N = Number(process.argv[4] || 10);
const SIZES = (process.argv[5] || 'thorp,hamlet,village,town,city,metropolis').split(',');
const HERE = fileURLToPath(new URL('../../../../../../../', import.meta.url));
const { isCrisisOwnPower } = await import(`${HERE}src/generators/density/applyDensityLaw.js`);
const { STRESS_POWER_FACES } = await import(`${HERE}src/data/stressPowerFaces.js`);
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
const { membersByRank } = await import(`${T}/src/domain/people/membership.js`);
const { leaderlessLineOf } = await import(`${T}/src/domain/people/stressPowerFaces.js`);
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const STRESSES = [...new Set([...STRESS_POWER_FACES.map((r) => r.stress), 'indebted', 'recently_betrayed', 'infiltrated', 'mass_migration', 'slave_revolt'])];
const { STATED_CRISIS_ORDER: STATED_ORDER } = await import(`${HERE}src/generators/density/applyDensityLaw.js`);
const typesOf = (s) => [...new Set((Array.isArray(s.stress) ? s.stress : [s.stress]).map((x) => (typeof x === 'string' ? x : x?.type)).filter(Boolean))];
const out = { tree: T, law: LIT ? 2 : 1, perSize: {}, missing: [], unbodied: [] };
for (const tier of SIZES) {
  let births = 0, crisisPlaces = 0, miss = 0, forcedMiss = 0, unbodied = 0;
  for (const stress of STRESSES) for (let i = 0; i < N; i++) {
    const seed = `u8-${stress}-${tier}-${i}`;
    const base = birthConfig({ ...DIALS, settType: tier, selectedStresses: [stress], selectedStressesRandom: false });
    const s = generateSettlementPipeline(LIT ? { ...base, _fortuneLawVersion: 2 } : base, null, { seed, customContent: {} });
    births += 1;
    const factions = s.powerStructure?.factions || [];
    const types = typesOf(s).filter((t) => STRESSES.includes(t));
    if (types.length) crisisPlaces += 1;
    const lacking = types.filter((t) => !factions.some((f) => isCrisisOwnPower(t, f)));
    if (lacking.includes(stress)) forcedMiss += 1;
    if (lacking.length) { miss += 1; out.missing.push({ seed, tier, lacking, roster: factions.map((f) => f.faction), stability: s.powerStructure?.stability }); }
    // (c): the crisis the stability line states (the first of the record's crises in power/governanceNarrative.js ::
    // applyStressStability's order) has a power on the roster, and that power a body: a card or its declared leaderless line
    const stated = STATED_ORDER.filter((t) => types.includes(t)).slice(0, 1);
    const noBody = stated.filter((t) => !factions.some((f) => isCrisisOwnPower(t, f)
      && (membersByRank(s.npcs || [], f.faction).length > 0 || leaderlessLineOf(s, f.faction) !== '')));
    if (noBody.length) { unbodied += 1; out.unbodied.push({ seed, tier, noBody, roster: factions.map((f) => f.faction), cast: (s.npcs || []).length, stability: s.powerStructure?.stability }); }
  }
  out.perSize[tier] = { births, crisisPlaces, noPowerOfItsCrisis: miss, noPowerOfTheForcedCrisis: forcedMiss, statedWithoutBody: unbodied };
  console.error(tier, JSON.stringify(out.perSize[tier]));
}
console.log(JSON.stringify(out, null, 1));
