// node check-D.mjs : (1) THE OLDER TOWN: every C and V birth re-stamped '0.9.0' and with NO stamp: the base and the
// candidate draw, show and share byte for byte the same? (2) traditionsTabFairAct's birth loop (its own seeds and dials),
// run with each engine, and its three counts (no vitest: the loop's arithmetic, without the render).
import { readFileSync } from 'node:fs';
const Bs = await import('/tmp/trad/out/D-base.mjs'); const Cs = await import('/tmp/trad/out/D-cand.mjs');
await Bs.loadGenerationLawPayloads(); await Cs.loadGenerationLawPayloads();
const J = JSON.stringify;
let n = 0; const diff = { '0.9.0': 0, none: 0, '0.10.0': 0 };
for (const plan of ['plan-C.json', 'plan-V.json']) for (const row of JSON.parse(readFileSync(`/tmp/trad/tools/${plan}`, 'utf8'))) {
  const town = Bs.generateSettlementPipeline(Bs.birthConfig(row.config), null, { seed: row.seed, customContent: {} }); n++;
  for (const st of ['0.9.0', 'none', '0.10.0']) {
    const t = { ...town }; if (st === 'none') delete t.generatorVersion; else t.generatorVersion = st;
    const a = J([Bs.deriveFoundingTraditions(t), Bs.shownTraditionsOf(t, []), Bs.sharedTraditionRowsOf(t)]);
    const b = J([Cs.deriveFoundingTraditions(t), Cs.shownTraditionsOf(t, []), Cs.sharedTraditionRowsOf(t)]);
    if (a !== b) diff[st]++;
  }
}
console.log(`(1) births ${n}; towns whose drawn/shown/shared set differs base vs candidate, by stamp:`, J(diff));
for (const [name, E] of [['base', Bs], ['cand', Cs]]) {
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  let withFair = 0, noM = 0, m = 0;
  for (let i = 0; i < 40 && (noM < 3 || m < 2); i++) for (const settType of ['thorp', 'village', 'city']) {
    const seed = `r2r-${settType}-${i}`;
    const town = E.generateSettlementPipeline(E.birthConfig({ ...E.DEFAULT_CONFIG, ...dials, settType }), null, { seed, customContent: {} });
    const fairs = E.deriveFoundingTraditions(town).filter((r) => r?.coreMotif?.act === 'fair');
    if (!fairs.length) continue; withFair++; (E.factsOf(town).market === true) ? m++ : noM++;
  }
  console.log(`(2) traditionsTabFairAct births on ${name}: withFair ${withFair}, withFairMarket ${m}, withFairNoMarket ${noM} (the test asks > 2, > 0, > 0)`);
}
process.exit(0);
