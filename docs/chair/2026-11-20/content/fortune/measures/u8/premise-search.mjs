// U8c (A): the guard's premise over LIT births, read in an instrumented scratch copy (log-only): a small place where
// the dual hat folded the office's face (seatFacesFoldedByDualHat 1) whose crisis power IS seated by the density plan
// with the office and the house counted as two (`wouldCut` notes where the same plan with the cast's bare count
// would not seat it: the fold would cut it). Never reads the final roster (the outcome). The instrument is
// premise-search.patch (log-only) on a git archive of 88c8bf25f; the guard's eight hash equal with and without it.
// usage: node premise-search.mjs <inst tree> <plain tree> <N>
import { createHash } from 'node:crypto';
const [I, P, NARG] = process.argv.slice(2); const N = Number(NARG || 200);
const load = async (T) => ({ gen: (await import(`${T}/src/generators/generateSettlementPipeline.js`)).generateSettlementPipeline, b: await import(`${T}/src/domain/density/densityCreateBoundary.js`) });
const inst = await load(I); const plain = await load(P);
await inst.b.loadGenerationLawPayloads(); await plain.b.loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const GUARD = [['rvf-occupied-thorp-6','thorp','occupied','Occupation Authority'],['rvf-occupied-hamlet-5','hamlet','occupied','Occupation Authority'],['rvf-slave_revolt-thorp-5','thorp','slave_revolt','Revolt Leadership'],['rvf-wartime-thorp-2','thorp','wartime','War Council'],['rvf-famine-thorp-0','thorp','famine','Grain Holders'],['rvw-thorp-86','thorp',null,'The Highborn Circle'],['rvw-hamlet-66','hamlet',null,'Monster Hunters / Adventurers'],['rvf-politically_fractured-hamlet-3','hamlet','politically_fractured','The Independent Bloc']];
const cfgOf = (settType, stress) => (stress ? { ...DIALS, settType, selectedStresses: [stress], selectedStressesRandom: false } : { ...DIALS, settType });
const premise = (seed, settType, stress, power) => {
  globalThis.__U8C = [];
  const s = inst.gen({ ...inst.b.birthConfig(cfgOf(settType, stress)), _fortuneLawVersion: 2 }, null, { seed, customContent: {} });
  const d = globalThis.__U8C.at(-1) || {}; globalThis.__U8C = null;
  const meets = d.folded === 1 && (d.seated || []).includes(power);
  const wouldCut = meets && !(d.unfolded || []).includes(power);
  return { seed, meets, wouldCut, folded: d.folded, npcs: d.npcs, seated: d.seated, unfolded: d.unfolded, digest: createHash('sha256').update(JSON.stringify(s)).digest('hex').slice(0, 12) };
};
const out = { guard: [], search: {} };
// the instrument moves nothing: the guard's eight, lit, hash equal with and without it
for (const [seed, settType, stress, power] of GUARD) {
  const r = premise(seed, settType, stress, power);
  const p = plain.gen({ ...plain.b.birthConfig(cfgOf(settType, stress)), _fortuneLawVersion: 2 }, null, { seed, customContent: {} });
  r.plainDigest = createHash('sha256').update(JSON.stringify(p)).digest('hex').slice(0, 12);
  out.guard.push(r);
}
// the search, the guard's own seed families for the three moved cases, lowest index first
const FAMILIES = [['rvf-slave_revolt-thorp', 'thorp', 'slave_revolt', 'Revolt Leadership'], ['rvf-wartime-thorp', 'thorp', 'wartime', 'War Council'], ['rvw-thorp', 'thorp', null, 'The Highborn Circle']];
for (const [fam, settType, stress, power] of FAMILIES) {
  const hits = [];
  for (let i = 0; i < N; i++) { const r = premise(`${fam}-${i}`, settType, stress, power); if (r.meets) hits.push([r.seed, r.wouldCut]); }
  out.search[fam] = { scanned: N, candidates: hits.length, wouldCut: hits.filter((h) => h[1]).length, first: hits.slice(0, 5) };
}
console.log(JSON.stringify(out, null, 1));
