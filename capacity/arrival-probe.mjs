/**
 * arrival-probe.mjs — LANE HORIZON-B6, read-only.
 *
 * The C3 ARRIVAL arm computes `within30`, `within60`, the per-settlement first-filling
 * year and `crowdingLines`, but those figures only reach a reader through an assertion
 * MESSAGE, which vitest prints only on FAILURE. On a green run they are computed and
 * discarded. The design's C3 row says the arm "PRINTS the measured arrival year as a
 * FINDING beside CAP-7"; this probe prints them without touching a product byte.
 *
 * It replicates `envelope()` from tests/domain/demographicsEnvelope.test.js VERBATIM
 * (same fixture, same seed, same PRNG stream, same 52-tick year) so the numbers it
 * prints are the numbers the arm read.
 *
 * Lives outside the repo. Writes nothing. Run: node <this file>
 */
const DOCK = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';

const { createPRNG } = await import(`${DOCK}/src/kernel/prng.js`);
const { advanceDemographics } = await import(`${DOCK}/src/domain/worldPulse/demographicsKernel.js`);
const { overflowBandOf, overflowRankOf } = await import(`${DOCK}/src/domain/worldPulse/demographicsResponses.js`);
const { crowdingCrossingOf } = await import(`${DOCK}/src/domain/worldPulse/demographicsHerald.js`);
const { LIT, boundsOf, realmUpdates, snapshotOf } = await import(`${DOCK}/tests/helpers/demographicsRealmFixture.js`);

const CAMPAIGN_YEARS = 30;
const ARRIVAL_YEARS = 60;
const MOTION_FLOOR_01 = 0.0025;

function envelope(step, years, seed = 'envelope-seed-1') {
  let live = realmUpdates();
  const bounds = boundsOf(live);
  const series = new Map(live.map((u) => [u.saveId, [u.settlement.population]]));
  const firstFilling = new Map();
  let crowdingLines = 0;
  const fillingRank = overflowRankOf('filling');
  for (let t = 1; t <= years * 52; t += 1) {
    const r = step({
      snapshot: snapshotOf(live), worldState: LIT, settlementUpdates: live,
      rng: createPRNG(`${seed}::tick:${t}::one_week`), tick: t,
    });
    live = r.settlementUpdates;
    for (const receipt of (Array.isArray(r.receipts) ? r.receipts : [])) {
      if (crowdingCrossingOf(receipt) != null) crowdingLines += 1;
    }
    if (t % 52 !== 0) continue;
    const year = t / 52;
    for (const u of live) {
      series.get(u.saveId).push(u.settlement.population);
      const rank = overflowRankOf(overflowBandOf(u.settlement.population / Math.max(1, bounds.get(u.saveId))));
      if (rank >= fillingRank && !firstFilling.has(u.saveId)) firstFilling.set(u.saveId, year);
    }
  }
  return { series, bounds, firstFilling, crowdingLines };
}

function movingShare(series, years) {
  let transitions = 0;
  let moved = 0;
  for (const [, s] of series) {
    for (let y = 1; y <= years; y += 1) {
      transitions += 1;
      if (s[y - 1] > 0 && Math.abs(s[y] - s[y - 1]) / s[y - 1] >= MOTION_FLOOR_01) moved += 1;
    }
  }
  return { transitions, moved, share: transitions ? moved / transitions : 0 };
}

const growthRatios = (series, years) => [...series].map(([id, s]) => ({ id, ratio: s[years] / s[0] }));

const cured = envelope(advanceDemographics, ARRIVAL_YEARS);

const arrivals = [...cured.firstFilling];
const within30 = arrivals.filter(([, year]) => year <= CAMPAIGN_YEARS);
const within60 = arrivals.filter(([, year]) => year <= ARRIVAL_YEARS);
const motion = movingShare(cured.series, CAMPAIGN_YEARS);
const ratios = growthRatios(cured.series, CAMPAIGN_YEARS);
const ratioValues = ratios.map((r) => r.ratio);
const frozen = [...cured.series].filter(([, s]) => s[CAMPAIGN_YEARS] === s[0]).map(([id]) => id);

console.log('# C3 ENVELOPE — the figures the green arms compute and discard');
console.log(`realm settlements: ${cured.series.size}`);
console.log('');
console.log('## THE ARRIVAL (the finding beside CAP-7)');
console.log(`first-filling year, per settlement (only those that ever arrive within ${ARRIVAL_YEARS} y):`);
for (const [id, year] of arrivals.sort((a, b) => a[1] - b[1])) {
  console.log(`  ${id.padEnd(12)} year ${year}${year <= CAMPAIGN_YEARS ? '   (inside the 30-year campaign)' : '   (AFTER the campaign a customer plays)'}`);
}
const never = [...cured.series.keys()].filter((id) => !cured.firstFilling.has(id));
for (const id of never) console.log(`  ${id.padEnd(12)} never reaches the filling band in ${ARRIVAL_YEARS} years`);
console.log(`within30 = ${within30.length} of ${cured.series.size}`);
console.log(`within60 = ${within60.length} of ${cured.series.size}`);
console.log(`crowdingLines fired over ${ARRIVAL_YEARS} years = ${cured.crowdingLines}`);
console.log('');
console.log('## STATE MOTION (bar 0.05)');
console.log(`moved ${motion.moved} of ${motion.transitions} settlement-year transitions; share = ${motion.share.toFixed(4)}`);
console.log('');
console.log('## DIFFERENTIATION (bar 0.10)');
for (const { id, ratio } of ratios) console.log(`  ${id.padEnd(12)} 30-year ratio ${ratio.toFixed(4)}`);
console.log(`spread = ${(Math.max(...ratioValues) - Math.min(...ratioValues)).toFixed(4)}`);
console.log('');
console.log('## NO FLOOR');
console.log(`settlements unmoved over 30 years: ${frozen.length ? frozen.join(', ') : 'none'}`);
console.log('');
console.log('## 60-YEAR OCCUPANCY (population / bound at year 60)');
for (const [id, s] of cured.series) {
  const bound = cured.bounds.get(id);
  console.log(`  ${id.padEnd(12)} start ${String(s[0]).padStart(6)}  y30 ${String(s[CAMPAIGN_YEARS]).padStart(6)}  y60 ${String(s[ARRIVAL_YEARS]).padStart(6)}  bound ${String(Math.round(bound)).padStart(6)}  y60/bound ${(s[ARRIVAL_YEARS] / bound).toFixed(4)}`);
}
