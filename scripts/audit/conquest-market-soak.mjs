/**
 * conquest-market-soak.mjs — Phase 5 W-C2 evidence soak (deterministic, measures LANDED
 * dynamics, tunes NOTHING). Four panels, one per mechanic the brief calls out:
 *
 *   A. CONQUEST-YIELD ENVELOPE by conqueror PLANE — captive yield across the good→evil
 *      axis: EVIL PROFITS, GOOD FORECLOSES (conscience forecloses the revenue), with the
 *      loot channel amoral across planes. Shows the gradient + the pop-tier scaling.
 *   B. LOOT-PULSE DECAY PROFILE — a single sack's loot pulse over WEEKS: half-life, the
 *      prosperity lift it drives, and the return to ~0 (a pulse, not a rebase).
 *   C. MERCENARY SUPPLEMENT vs PROSPERITY-DRAIN TRADEOFF — the three rented-force legs
 *      across shortfall × presence: readiness BOUGHT vs prosperity PAID, both bounded.
 *   D. FIDELITY-PENALTY DISTRIBUTION — the hired-steel misread over a seeded cohort, and
 *      its COMPOSITION with rust at the war-decision read, capped under TOTAL_MAX.
 *
 * Deterministic: pinned constants + seeded PRNG cohorts. Pure measurement.
 *   node scripts/audit/conquest-market-soak.mjs [--cohort 4000]
 */
import {
  CONQUEST_FEED_TUNING,
  captiveGate, captiveYieldRaw, lootYieldRaw, prosperityPulseOf, advanceConquestFeeds,
} from '../../src/domain/worldPulse/conquestFeeds.js';
import {
  MERCENARY_MARKET_TUNING, warExposure01, nativeCapability01,
} from '../../src/domain/worldPulse/mercenaryMarket.js';
import { fidelityFactor, FIDELITY_TUNING } from '../../src/domain/worldPulse/fidelityNoise.js';
import { rustMagnitude } from '../../src/domain/worldPulse/martialReadiness.js';
import { createPRNG } from '../../src/kernel/prng.js';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i !== -1 ? Number(process.argv[i + 1]) : d; };
const COHORT = arg('cohort', 4000);
const WEEKS_PER_YEAR = 52;
const CFT = CONQUEST_FEED_TUNING;
const MT = MERCENARY_MARKET_TUNING;
const f2 = (x) => x.toFixed(2);
const f3 = (x) => x.toFixed(3);
const yr = (t) => (t / WEEKS_PER_YEAR).toFixed(1);

const deity = (alignmentAxis, lawAxis = 'neutral') => ({ alignmentAxis, lawAxis });
const slaveVictor = (patron) => ({ institutions: [{ name: 'Slave market', status: 'active' }], config: patron ? { primaryDeitySnapshot: patron } : {} });
const taken = (tier) => ({ tier, population: 0, institutions: [] });

// ── A. CONQUEST-YIELD ENVELOPE by conqueror plane ────────────────────────────────
function panelA() {
  console.log('\n## A. CONQUEST-YIELD ENVELOPE by conqueror PLANE — a metropolis falls (sack, severity 0.8)');
  console.log(`   Captive channel gated by the cruelty-axis conscience read (ABOLITION_FLOOR ${CFT.ABOLITION_FLOOR}).`);
  console.log('   Every victor runs a slave market; the LOOT channel is amoral (plane-independent).\n');
  console.log('   plane          abolitionRead   permitted   captiveYield   lootYield');
  const T = taken('metropolis');
  const out = {};
  for (const [name, patron] of [
    ['lawful-good', deity('good', 'lawful')],
    ['neutral-good', deity('good', 'neutral')],
    ['chaotic-good', deity('good', 'chaotic')],
    ['true-neutral', deity('neutral', 'neutral')],
    ['lawful-evil', deity('evil', 'lawful')],
    ['chaotic-evil', deity('evil', 'chaotic')],
    ['(deity-free)', null],
  ]) {
    const gate = captiveGate(slaveVictor(patron));
    const captive = gate.permitted ? captiveYieldRaw(T, 0.8) : 0;
    const loot = lootYieldRaw(T, 'sack');
    out[name] = { abolitionRead: +gate.abolitionRead.toFixed(3), permitted: gate.permitted, captive: +captive.toFixed(3), loot: +loot.toFixed(3) };
    const mark = gate.permitted ? '' : '   ← FORECLOSED (revenue LOST)';
    console.log(`   ${name.padEnd(14)} ${f3(gate.abolitionRead).padStart(8)}      ${(gate.permitted ? 'yes' : 'NO ').padStart(6)}     ${f3(captive).padStart(6)}        ${f3(loot).padStart(6)}${mark}`);
  }
  console.log('\n   captive yield by TAKEN tier (evil victor, severity 0.8):');
  console.log('   taken tier     captiveYield');
  for (const tier of ['thorp', 'village', 'town', 'city', 'metropolis']) {
    const y = captiveYieldRaw(taken(tier), 0.8);
    out[`tier:${tier}`] = +y.toFixed(3);
    console.log(`   ${tier.padEnd(14)} ${f3(y).padStart(6)}`);
  }
  console.log('\n   READING: good planes FORECLOSE the captive trade (yield lost, no laundering); neutral/evil');
  console.log('            profit; loot is amoral. Yield rises with the taken town\'s tier — the gradient.');
  return out;
}

// ── B. LOOT-PULSE DECAY PROFILE ──────────────────────────────────────────────────
function panelB() {
  console.log('\n## B. LOOT-PULSE DECAY PROFILE — one metropolis sack, then peace (week tick)');
  console.log(`   LOOT_DECAY ${CFT.LOOT_DECAY} ⇒ half-life ${(Math.log(0.5) / Math.log(1 - CFT.LOOT_DECAY)).toFixed(1)} wk. A pulse, not a rebase.\n`);
  const table = { V: { settlement: { tier: 'town' } }, T: { settlement: taken('metropolis') } };
  const snapshot = { byId: { get: (id) => table[String(id)] } };
  let ledger = advanceConquestFeeds({ snapshot, priorLedger: null, conquests: [{ victorId: 'V', takenId: 'T', kind: 'sack', severity: 0.8 }] }).conquestFeedsByCid;
  const peak = ledger.V.loot;
  console.log('   week    loot pulse    prosperity lift (economy-health +)');
  const marks = new Set([0, 4, 13, 26, 52, 104]);
  const out = { peak: +peak.toFixed(3), samples: {} };
  let half = null; let cleared = null;
  for (let w = 0; w <= 260; w += 1) {
    if (w > 0) {
      const next = advanceConquestFeeds({ snapshot, priorLedger: ledger, conquests: [] }).conquestFeedsByCid;
      ledger = next;
    }
    const loot = ledger ? ledger.V.loot : 0;
    const lift = ledger ? prosperityPulseOf(ledger.V) : 0;
    if (half === null && loot <= peak / 2) half = w;
    if (cleared === null && loot <= CFT.EPS) cleared = w;
    if (marks.has(w)) {
      out.samples[`wk${w}`] = { loot: +loot.toFixed(4), lift: +lift.toFixed(4) };
      console.log(`   ${String(w).padStart(4)}    ${f3(loot).padStart(6)}        ${f3(lift).padStart(6)}`);
    }
    if (!ledger) break;
  }
  out.halfLifeWk = half; out.clearedWk = cleared;
  console.log(`\n   half-life ${half} wk (~${yr(half)} yr); pulse clears (≤ EPS) at ${cleared} wk (~${yr(cleared)} yr) ⇒ returns to byte-neutral.`);
  console.log('   READING: the market boom fades over a season+, then the ledger drops — no permanent step-change.');
  return out;
}

// ── C. MERCENARY SUPPLEMENT vs PROSPERITY-DRAIN TRADEOFF ──────────────────────────
function panelC() {
  console.log('\n## C. RENTED-FORCE TRADEOFF — readiness BOUGHT vs prosperity PAID (activity = shortfall × presence)');
  console.log(`   SUPPLEMENT_MAX ${MT.SUPPLEMENT_MAX} · COST_MAX ${MT.COST_MAX} · FIDELITY_MAX ${MT.FIDELITY_MAX} (all bounded).\n`);
  console.log('   shortfall  presence   activity   supplement(+readiness)   upkeepCost(−prosperity)   fidelityPenalty');
  const out = {};
  for (const shortfall of [0.25, 0.5, 0.75, 1.0]) {
    for (const presence of [0.5, 1.0]) {
      const activity = shortfall * presence;
      const supplement = MT.SUPPLEMENT_MAX * activity;
      const cost = MT.COST_MAX * activity;
      const fidelity = MT.FIDELITY_MAX * activity;
      out[`s${shortfall}:p${presence}`] = { activity: +activity.toFixed(3), supplement: +supplement.toFixed(3), cost: +cost.toFixed(3), fidelity: +fidelity.toFixed(3) };
      console.log(`   ${f2(shortfall).padStart(6)}     ${f2(presence).padStart(4)}      ${f2(activity).padStart(5)}       ${f3(supplement).padStart(7)}                 ${f3(cost).padStart(7)}                  ${f3(fidelity).padStart(7)}`);
    }
  }
  // Illustrate the shortfall derivation: a menaced, unready, ill-supplied town has the highest demand.
  console.log('\n   shortfall = exposure − native capability (illustrative):');
  console.log('   scenario                          exposure   capability   shortfall');
  const scen = [
    ['menaced+engaged, unready, floor-kit', warExposure01(1, true), nativeCapability01(0, 0.55)],
    ['menaced border, half-ready, half-kit', warExposure01(1, false), nativeCapability01(0.5, 0.8)],
    ['engaged, seasoned, well-supplied', warExposure01(0.5, true), nativeCapability01(0.9, 1.0)],
  ];
  for (const [name, exposure, capability] of scen) {
    const shortfall = Math.max(0, Math.min(1, exposure - capability));
    out[`scen:${name}`] = { exposure: +exposure.toFixed(3), capability: +capability.toFixed(3), shortfall: +shortfall.toFixed(3) };
    console.log(`   ${name.padEnd(34)} ${f3(exposure).padStart(6)}     ${f3(capability).padStart(6)}      ${f3(shortfall).padStart(6)}`);
  }
  console.log('\n   READING: buying force costs prosperity in proportion — guns-vs-butter. A ready, well-supplied');
  console.log('            town has ~0 shortfall ⇒ no market ⇒ byte-neutral. Every leg scales with activity.');
  return out;
}

// ── D. FIDELITY-PENALTY DISTRIBUTION (composition under TOTAL_MAX) ────────────────
function panelD() {
  console.log('\n## D. HIRED-STEEL FIDELITY PENALTY — seeded cohort at the war-decision read');
  console.log(`   Cohort ${COHORT}; the merc penalty is FOLDED into rust (rust + merc), summed under TOTAL_MAX ${FIDELITY_TUNING.TOTAL_MAX}.`);
  console.log('   Sworn steel = rust only; hired steel = rust + merc penalty. chaosPull 0 (lawful actor).\n');
  const sample = (rust, merc) => {
    let sum = 0; let max = 0;
    for (let i = 0; i < COHORT; i += 1) {
      const rng = createPRNG(`fid-${rust}-${merc}-${i}`);
      const factor = fidelityFactor({ rng, site: 'war_initiation', tick: 5, cid: 'c', decisionKey: `k${i}`, chaosPull: 0, rust: rust + merc });
      const err = Math.abs(factor - 1);
      sum += err; if (err > max) max = err;
    }
    return { meanAbs: sum / COHORT, max };
  };
  console.log('   force          rust(exp)   mercPenalty   mean|err|   max|err|');
  const out = {};
  const rustSeasoned = rustMagnitude(0.9);   // seasoned ⇒ ~0
  const rustRusty = rustMagnitude(0.3);      // long-peace ⇒ mid
  for (const [name, rust] of [['seasoned', rustSeasoned], ['rusty', rustRusty]]) {
    for (const merc of [0, MT.FIDELITY_MAX * 0.5, MT.FIDELITY_MAX]) {
      const s = sample(rust, merc);
      out[`${name}:merc${merc.toFixed(2)}`] = { meanAbs: +s.meanAbs.toFixed(3), max: +s.max.toFixed(3) };
      const tag = merc === 0 ? '(sworn)' : '(hired)';
      console.log(`   ${(name + ' ' + tag).padEnd(14)} ${f2(rust).padStart(5)}      ${f2(merc).padStart(6)}       ${f3(s.meanAbs).padStart(7)}   ${f3(s.max).padStart(7)}`);
    }
  }
  console.log(`\n   CAP: rust + merc summed |err| ≤ TOTAL_MAX ${FIDELITY_TUNING.TOTAL_MAX}. Hired steel degrades the read,`);
  console.log('        never dominates it — and with no active market (merc 0) it is byte-identical to sworn steel.');
  return out;
}

console.log(`\n# W-C2 CONQUEST-MARKET SOAK (deterministic; cohort=${COHORT})`);
const evidence = {
  meta: { cohort: COHORT, ABOLITION_FLOOR: CFT.ABOLITION_FLOOR, LOOT_DECAY: CFT.LOOT_DECAY, CAPTIVE_DECAY: CFT.CAPTIVE_DECAY, SUPPLEMENT_MAX: MT.SUPPLEMENT_MAX, COST_MAX: MT.COST_MAX, FIDELITY_MAX: MT.FIDELITY_MAX, TOTAL_MAX: FIDELITY_TUNING.TOTAL_MAX },
  A: panelA(), B: panelB(), C: panelC(), D: panelD(),
};
console.log('');
process.stderr.write(JSON.stringify(evidence, null, 2) + '\n');
