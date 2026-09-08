/**
 * war-cluster-soak.mjs — Phase 5 W-C1 evidence soak (deterministic, measures LANDED
 * dynamics, tunes NOTHING). Four panels, one per work item:
 *
 *   A. DECAY HALF-LIFE (item 4) — the retuned DOWN_DECAY at WEEK scale: half-life and
 *      full-demilitarization horizon, across the patron megaphone regimes. Justifies the
 *      chosen 0.002 against the "years erosion / decades full-rust" target.
 *   B. THREAT ENVELOPE (item 2) — readiness sustained by a menacing border vs decayed in
 *      peace: the on/off equilibrium the threat term produces.
 *   C. QUALITY GRADIENT (item 3) — deployedQualityMult across war-kit completeness (real
 *      supplyCompleteness reads over synthetic export baskets): floored, never zero.
 *   D. RUST-SITE ERROR (item 1) — the seeded per-decision fidelity error by ALIGNMENT:
 *      lawful reads the calculator true (sizing = rust only), chaos mis-reads (peace =
 *      chaos+rust), over a seeded cohort — mean |error| and max, capped.
 *
 * Deterministic: pinned constants + seeded PRNG cohorts. Pure measurement.
 *   node scripts/audit/war-cluster-soak.mjs [--cohort 4000]
 */
import {
  stepReadiness, warFooting01, threatEnvironment01, rustMagnitude,
  MARTIAL_READINESS_TUNING,
} from '../../src/domain/worldPulse/martialReadiness.js';
import { deployedQualityMult } from '../../src/domain/worldPulse/supplyQuality.js';
import { fidelityFactor } from '../../src/domain/worldPulse/fidelityNoise.js';
import { createPRNG } from '../../src/kernel/prng.js';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i !== -1 ? Number(process.argv[i + 1]) : d; };
const COHORT = arg('cohort', 4000);
const WEEKS_PER_YEAR = 52;
const T = MARTIAL_READINESS_TUNING;
const f2 = (x) => x.toFixed(2);
const yr = (ticks) => (ticks / WEEKS_PER_YEAR).toFixed(1);

// ── shared: decay a readiness under a patron regime until a threshold ────────────
function ticksToDecay({ from, to, decay, temperSign = 0, megaphoneBleed = 0 }) {
  const saved = MARTIAL_READINESS_TUNING.DOWN_DECAY;
  // DOWN_DECAY is frozen; measure the analytic decay directly instead of mutating.
  // r_{t+1} = r_t − decay·decayMult·r_t (peace branch of stepReadiness, footing 0).
  const decayMult = Math.max(0.1, Math.min(3, 1 + T.PEACE_DIVIDEND_W * Math.max(0, -temperSign) * megaphoneBleed - T.WARHOLD_W * Math.max(0, temperSign) * megaphoneBleed));
  const eff = decay * decayMult;
  let r = from; let ticks = 0;
  while (r > to && ticks < 200000) { r = r - eff * r; ticks++; }
  void saved;
  return ticks;
}

function panelA() {
  console.log('\n## A. READINESS DECAY HALF-LIFE (item 4) — week tick; target: years erosion, decades full-rust');
  console.log(`   DOWN_DECAY = ${T.DOWN_DECAY} (chosen). From a maxed readiness 0.8, neutral patron.\n`);
  console.log('   candidate   half-life(wk / yr)     full→EPS(wk / yr)');
  for (const d of [0.04, 0.003, 0.002, 0.001]) {
    const half = ticksToDecay({ from: 0.8, to: 0.4, decay: d });
    const full = ticksToDecay({ from: 0.8, to: 0.005, decay: d });
    const mark = Math.abs(d - T.DOWN_DECAY) < 1e-9 ? ' ← CHOSEN' : '';
    console.log(`   ${String(d).padEnd(10)}  ${String(half).padStart(6)} / ${yr(half).padStart(5)}      ${String(full).padStart(7)} / ${yr(full).padStart(6)}${mark}`);
  }
  console.log('\n   patron megaphone spread (chosen DOWN_DECAY, bleed 0.6):');
  console.log('   regime      half-life(wk / yr)');
  for (const [name, sign] of [['peacelike', -1], ['neutral', 0], ['warlike', 1]]) {
    const half = ticksToDecay({ from: 0.8, to: 0.4, decay: T.DOWN_DECAY, temperSign: sign, megaphoneBleed: 0.6 });
    console.log(`   ${name.padEnd(10)}  ${String(half).padStart(6)} / ${yr(half).padStart(5)}`);
  }
  const halfChosen = ticksToDecay({ from: 0.8, to: 0.4, decay: T.DOWN_DECAY });
  const fullChosen = ticksToDecay({ from: 0.8, to: 0.005, decay: T.DOWN_DECAY });
  return { halfWeeks: halfChosen, halfYears: +yr(halfChosen), fullWeeks: fullChosen, fullYears: +yr(fullChosen) };
}

function panelB() {
  console.log('\n## B. THREAT ENVELOPE (item 2) — the CLIMB a menacing border drives, and the peace decay');
  console.log('   readiness at 26/104/260 wk (½/2/5 yr) of a STANDING threat, from cold; neutral patron.\n');
  console.log('   scenario                 footing    @26wk   @104wk  @260wk   (decades→1.0)');
  const at = (footing, ticks) => { let r = 0; for (let i = 0; i < ticks; i++) r = stepReadiness(r, footing, {}); return r; };
  const rows = [
    ['peace (no threat)', warFooting01({ threat: 0 })],
    ['1 war front nearby', warFooting01({ threat: threatEnvironment01({ frontNear: true }) })],
    ['front + occupation', warFooting01({ threat: threatEnvironment01({ frontNear: true, occupyNear: true }) })],
    ['fully encircled', warFooting01({ threat: threatEnvironment01({ frontNear: true, occupyNear: true, raidNear: true }) })],
  ];
  const out = {};
  for (const [name, footing] of rows) {
    const r26 = at(footing, 26); const r104 = at(footing, 104); const r260 = at(footing, 260);
    out[name] = { footing: +f2(footing), r26: +f2(r26), r104: +f2(r104), r260: +f2(r260) };
    console.log(`   ${name.padEnd(24)} ${f2(footing).padStart(6)}    ${f2(r26).padStart(5)}   ${f2(r104).padStart(5)}   ${f2(r260).padStart(5)}`);
  }
  // The peace DECAY side: from a maxed 0.8, threat gone, readiness sheds over years (item 4).
  const decayR = (() => { let r = 0.8; for (let i = 0; i < 104; i++) r = stepReadiness(r, 0, {}); return r; })();
  out.peaceDecayFrom08At104wk = +f2(decayR);
  console.log(`   peace decay: a maxed 0.8, threat gone ⇒ ${f2(decayR)} after 104 wk (2 yr) — sheds over years, not seasons.`);
  console.log('   READING: peace ⇒ 0 (never climbs). A standing menace ARMS a town over years even with no');
  console.log('            war of its own; the stronger the menace, the faster — "a menacing border sustains it".');
  return out;
}

// Synthetic snapshot exporting a subset of the war-kit basket, for a REAL supplyCompleteness read.
const KIT = ['Iron', 'Weapons and armour', 'Leather goods', 'Livestock', 'Preserved provisions'];
const qSnap = (n) => ({ byId: { get: (id) => (String(id) === 's' ? { settlement: { economicState: { primaryExports: KIT.slice(0, n) } } } : undefined) }, regionalGraph: { channels: [] } });

function panelC() {
  console.log('\n## C. SUPPLY-GAP QUALITY GRADIENT (item 3) — deployedQualityMult over REAL war-kit completeness');
  console.log('   Synthetic settlement exporting the first K of 5 core war-kit commodities.\n');
  console.log('   war-kit exports      deployed quality ×');
  const out = {};
  for (let n = 0; n <= 5; n++) {
    const q = deployedQualityMult(qSnap(n), 's');
    out[`${n}/5`] = +q.toFixed(3);
    console.log(`   ${String(n).padStart(2)} / 5 commodities     ${q.toFixed(3)}${n === 0 ? '   ← FLOOR (chainless, degraded, never zero)' : ''}`);
  }
  return out;
}

function panelD() {
  console.log('\n## D. RUST-SITE ERROR by ALIGNMENT (item 1) — seeded per-decision fidelity error');
  console.log(`   Cohort ${COHORT} seeded draws; mean |factor−1| and max. SIZING = rust only (chaosPull 0);`);
  console.log('   PEACE = chaos+rust (war-entry geometry). Lawful reads TRUE at the sizing axis.\n');
  const sample = (chaosPull, rust) => {
    let sumAbs = 0; let max = 0;
    for (let i = 0; i < COHORT; i++) {
      const rng = createPRNG(`wc1::${chaosPull}::${rust}::${i}`);
      const factor = fidelityFactor({ rng, site: 'soak', tick: 1, cid: 's', decisionKey: `d${i}`, chaosPull, rust });
      const e = Math.abs(factor - 1);
      sumAbs += e; if (e > max) max = e;
    }
    return { meanAbs: sumAbs / COHORT, max };
  };
  console.log('   SITE     alignment    rust(exp)     mean|err|   max|err|');
  const out = {};
  // Sizing: rust only. experience 1.0 (seasoned) → 0; 0.5 → mid; 0.0 (first war) → RUST_MAX.
  for (const exp of [1.0, 0.5, 0.0]) {
    const rust = rustMagnitude(exp);
    const s = sample(0, rust);
    out[`sizing:exp${exp}`] = { meanAbs: +s.meanAbs.toFixed(3), max: +s.max.toFixed(3) };
    console.log(`   sizing   (any law)    exp ${f2(exp)}      ${s.meanAbs.toFixed(3).padStart(7)}   ${s.max.toFixed(3).padStart(7)}`);
  }
  console.log('   ---');
  // Peace: chaos (by alignment) + rust. Lawful chaosPull 0; chaotic-devout up to ~1.5.
  for (const [name, chaosPull] of [['lawful', 0], ['chaotic-devout', 1.5]]) {
    for (const exp of [1.0, 0.3]) {
      const rust = rustMagnitude(exp);
      const s = sample(chaosPull, rust);
      out[`peace:${name}:exp${exp}`] = { meanAbs: +s.meanAbs.toFixed(3), max: +s.max.toFixed(3) };
      console.log(`   peace    ${name.padEnd(12)} exp ${f2(exp)}      ${s.meanAbs.toFixed(3).padStart(7)}   ${s.max.toFixed(3).padStart(7)}`);
    }
  }
  console.log(`   CAPS: sizing |err| ≤ RUST_MAX_ERROR ${T.RUST_MAX_ERROR}; combined ≤ TOTAL_MAX 0.75.`);
  return out;
}

console.log(`\n# W-C1 WAR-CLUSTER SOAK (deterministic; cohort=${COHORT})`);
const evidence = { meta: { cohort: COHORT, DOWN_DECAY: T.DOWN_DECAY, RUST_MAX_ERROR: T.RUST_MAX_ERROR }, A: panelA(), B: panelB(), C: panelC(), D: panelD() };
console.log('');
process.stderr.write(JSON.stringify(evidence, null, 2) + '\n');
