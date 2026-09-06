/**
 * institution-ecology-soak.mjs — Phase 5 W-C3 evidence soak (deterministic, measures
 * LANDED dynamics, tunes NOTHING). Four panels, one per mechanic the brief calls out:
 *
 *   A. FOUNDING-RATE ENVELOPE by patron PLANE (the almshouse gradient) — years-to-found a
 *      benevolent vs an exploitative institution across the good→evil / law→chaos planes.
 *      GOOD planes found MERCY, never cruelty; CRUEL planes the reverse. Founding is a
 *      years-scale event; the panel shows it never fires inside a golden's few-tick window.
 *   B. TOLERANCE-NORMALIZATION convergence under sustained trade — a good town's cruelty
 *      tolerance drifting toward an evil partner: the multi-year half-life, the ±CAP that
 *      forbids full conversion, and the mass asymmetry (a metropolis norms a hamlet HARD,
 *      the hamlet barely norms back).
 *   C. FAITH-PRESCRIBES pressure over carrier hops — the abolition arc a proselytizing good
 *      faith drives on a convert's slave market, and how it DECAYS with mass attenuation
 *      (a big patron abolishes a small convert's market; a small one barely moves it).
 *   D. EMBARGO-AS-CONSCIENCE incidence + trade-score cost — the conscience multiplier a
 *      buyer applies to a supplier across the buyer-plane × supplier-institution grid.
 *      A saint curtails the flesh market hard; a cruel buyer pays no conscience cost.
 *
 * Deterministic: pinned constants + closed-form integrators. Pure measurement.
 *   node scripts/audit/institution-ecology-soak.mjs
 */
import {
  MORAL_PRESSURE_TUNING, foundingFitFromTolerance, stepFoundingViability,
  moralViabilityPressure, stepAbolitionViability,
} from '../../src/domain/worldPulse/moralInstitutionPressure.js';
import {
  TOLERANCE_TUNING, patronConviction, advanceInstitutionTolerance, institutionConscience,
} from '../../src/domain/worldPulse/institutionTolerance.js';
import { FOUNDING_INSTITUTIONS, foundingEntryByName } from '../../src/domain/worldPulse/foundingCatalog.js';
import { neighbourFaithInfluence, TIER_MASS } from '../../src/domain/worldPulse/religionState.js';

const WEEKS_PER_YEAR = 52;
const yr = (t) => (t / WEEKS_PER_YEAR).toFixed(2);
const f2 = (x) => (Number.isFinite(x) ? x.toFixed(2) : String(x));
const f3 = (x) => (Number.isFinite(x) ? x.toFixed(3) : String(x));
const pad = (s, n) => String(s).padEnd(n);

const deity = (name, alignmentAxis, lawAxis) => ({ name, alignmentAxis, lawAxis });
const PLANES = [
  deity('LG', 'good', 'lawful'), deity('NG', 'good', 'neutral'), deity('CG', 'good', 'chaotic'),
  deity('LN', 'neutral', 'lawful'), deity('TN', 'neutral', 'neutral'), deity('CN', 'neutral', 'chaotic'),
  deity('LE', 'evil', 'lawful'), deity('NE', 'evil', 'neutral'), deity('CE', 'evil', 'chaotic'),
];
const DEVOUT_BLEED = 0.6;   // a devout town's moral/law megaphone (the abolition-test shape)

// ── A. founding-rate envelope by plane ─────────────────────────────────────────
function ticksToFound(entry, patron, bleed) {
  const tol = patronConviction(patron);
  const fit = foundingFitFromTolerance(entry.lean, tol, bleed, bleed);
  if (fit <= 0) return { fit: 0, ticks: Infinity };
  let acc = 0; let t = 0;
  while (acc < MORAL_PRESSURE_TUNING.FOUNDING_FLOOR && t < 100000) { acc = stepFoundingViability(acc, fit); t++; }
  return { fit, ticks: t };
}
function panelA() {
  console.log('\n== A. FOUNDING-RATE ENVELOPE by plane (devout bleed %s) ==', DEVOUT_BLEED);
  console.log('%s | %s | %s', pad('plane', 6), pad('Almshouse (benevolent)  fit  yrs', 32), 'Fighting pit (exploit)  fit  yrs');
  const alms = foundingEntryByName('Almshouse');
  const pit = foundingEntryByName('Fighting pit');
  for (const p of PLANES) {
    const a = ticksToFound(alms, p, DEVOUT_BLEED);
    const e = ticksToFound(pit, p, DEVOUT_BLEED);
    console.log('%s | fit %s  %s yr%s | fit %s  %s yr%s',
      pad(p.name, 6),
      pad(f2(a.fit), 4), pad(a.ticks === Infinity ? '  —  ' : yr(a.ticks), 6), pad(a.ticks === Infinity ? ' (never)' : '', 8),
      pad(f2(e.fit), 4), pad(e.ticks === Infinity ? '  —  ' : yr(e.ticks), 6), e.ticks === Infinity ? ' (never)' : '');
  }
  // golden-window guard: how much accrues in an 8-tick window at the STRONGEST founding fit.
  const strongest = Math.max(...FOUNDING_INSTITUTIONS.map((en) => {
    let best = 0;
    for (const p of PLANES) best = Math.max(best, foundingFitFromTolerance(en.lean, patronConviction(p), 1, 1));
    return best;
  }));
  let acc8 = 0; for (let i = 0; i < 8; i++) acc8 = stepFoundingViability(acc8, strongest);
  console.log('  golden-window guard: max founding fit %s ⇒ %s accrued in 8 ticks (floor %s) ⇒ NO fire',
    f2(strongest), f3(acc8), MORAL_PRESSURE_TUNING.FOUNDING_FLOOR);
}

// ── B. tolerance normalization under sustained trade ───────────────────────────
function driveTolerance(settlements, edges, ticks) {
  let ws = {};
  const trace = [];
  for (let t = 0; t <= ticks; t++) {
    if (t > 0) {
      const r = advanceInstitutionTolerance({ snapshot: { settlements, regionalGraph: { edges } }, worldState: ws });
      ws = r.institutionToleranceByCid ? { institutionTolerance: r.institutionToleranceByCid } : {};
    }
    trace.push({ t, led: ws.institutionTolerance || {} });
  }
  return trace;
}
const settle = (id, patron, tier) => ({ id, name: id, settlement: { tier, config: { primaryDeitySnapshot: patron } } });
const tradeEdge = (a, b) => ({ id: `e.${a}.${b}`, from: a, to: b, relationshipType: 'trade_partner' });
function panelB() {
  console.log('\n== B. TOLERANCE NORMALIZATION under sustained trade (RATE %s, CAP %s) ==', TOLERANCE_TUNING.RATE, TOLERANCE_TUNING.CAP);
  const good = deity('LG', 'good', 'lawful'); const evil = deity('CE', 'evil', 'chaotic');
  console.log('  equal-mass town↔town — good town cruelty tolerance (baseline %s):', patronConviction(good).cruelty);
  const equal = driveTolerance([settle('g', good, 'town'), settle('e', evil, 'town')], [tradeEdge('g', 'e')], 520);
  for (const yrs of [1, 2, 5, 10]) {
    const row = equal[yrs * WEEKS_PER_YEAR];
    console.log('    year %s: offset %s ⇒ effective cruelty tolerance %s', pad(yrs, 2), f3(row.led.g?.cruelty || 0), f3(patronConviction(good).cruelty + (row.led.g?.cruelty || 0)));
  }
  // half-life of the equal-mass approach (offset reaching half its 10-yr value).
  const tenYr = equal[10 * WEEKS_PER_YEAR].led.g?.cruelty || 0;
  const half = equal.find((r) => (r.led.g?.cruelty || 0) >= tenYr / 2);
  console.log('    half-life to 10-yr level: ~%s years', half ? yr(half.t) : '—');
  console.log('  mass asymmetry — metropolis↔hamlet cruelty tolerance offset at 5 yr:');
  const asym = driveTolerance([settle('metro', evil, 'metropolis'), settle('ham', good, 'hamlet')], [tradeEdge('metro', 'ham')], 5 * WEEKS_PER_YEAR);
  const last = asym[asym.length - 1].led;
  console.log('    hamlet (mass %s): offset %s   |   metropolis (mass %s): offset %s   ⇒ %sx asymmetry',
    TIER_MASS.hamlet, f3(last.ham?.cruelty || 0), TIER_MASS.metropolis, f3(last.metro?.cruelty || 0),
    f2(Math.abs(last.ham?.cruelty || 0) / Math.max(1e-6, Math.abs(last.metro?.cruelty || 0))));
}

// ── C. faith-prescribes pressure over carrier hops ─────────────────────────────
function ticksToAbolish(pressurePerTick) {
  if (pressurePerTick <= 0) return Infinity;
  let acc = 0; let t = 0;
  while (acc < MORAL_PRESSURE_TUNING.ABOLITION_FLOOR && t < 100000) { acc = stepAbolitionViability(acc, pressurePerTick); t++; }
  return t;
}
function panelC() {
  console.log('\n== C. FAITH PRESCRIBES over carrier hops (weight %s) ==', MORAL_PRESSURE_TUNING.FAITH_PRESCRIBE_W);
  const good = deity('LG', 'good', 'lawful');
  const slave = { name: 'Slave market', status: 'active' };
  const W = MORAL_PRESSURE_TUNING.FAITH_PRESCRIBE_W;
  const BASE_CARRIER = 0.45;   // a relationship-edge carrier strength
  console.log('  a good faith abolishing a convert\'s slave market, by patron/convert MASS ratio:');
  console.log('  %s | %s | %s | %s', pad('patron→convert', 20), pad('mass wt', 8), pad('reach σ', 8), 'abolition (years)');
  for (const [bearer, target] of [['metropolis', 'hamlet'], ['city', 'town'], ['town', 'town'], ['hamlet', 'city'], ['thorp', 'metropolis']]) {
    const w = neighbourFaithInfluence(TIER_MASS[bearer], TIER_MASS[target]);
    const sigma = Math.min(1, BASE_CARRIER * w);
    const pressure = moralViabilityPressure(slave, good, sigma * W, sigma * W);
    const ticks = ticksToAbolish(pressure);
    console.log('  %s | %s | %s | %s', pad(`${bearer}→${target}`, 20), pad(f2(w), 8), pad(f3(sigma), 8), ticks === Infinity ? 'never' : `${yr(ticks)} yr`);
  }
  console.log('  (σ 0 — no carrier — ⇒ pressure 0 ⇒ the local-only lane, byte-identical.)');
}

// ── D. embargo-as-conscience incidence + trade-score cost ──────────────────────
function panelD() {
  console.log('\n== D. EMBARGO AS CONSCIENCE — trade-score multiplier (EMBARGO_W %s, FLOOR %s) ==', TOLERANCE_TUNING.EMBARGO_W, TOLERANCE_TUNING.EMBARGO_FLOOR);
  const suppliers = {
    'Slave market': [{ name: 'Slave market', status: 'active' }],
    'Fighting pit': [{ name: 'Fighting pit', status: 'active', moralLean: { cruelty: 0.55, disorder: 0.85 } }],
    'Gambling hall': [{ name: 'Gambling hall', status: 'active' }],
    'Almshouse (clean)': [{ name: 'Almshouse', status: 'active' }],
    'Bakers (none)': [{ name: 'Bakers (5-15)', status: 'active' }],
  };
  const header = ['buyer', ...Object.keys(suppliers)];
  console.log('  %s', header.map((h, i) => pad(h, i === 0 ? 6 : 18)).join('| '));
  for (const p of PLANES) {
    const tol = patronConviction(p);
    const cells = Object.values(suppliers).map((insts) => {
      const c = institutionConscience(tol, insts);
      return c.mult < 1 ? `×${f2(c.mult)} (abhor ${f2(c.abhorrence)})` : '×1.00';
    });
    console.log('  %s| %s', pad(p.name, 6), cells.map((c) => pad(c, 18)).join('| '));
  }
  console.log('  (×1.00 everywhere = the neutrality interlock: no objection ⇒ tradeWar byte-identical.)');
}

console.log('# W-C3 INSTITUTIONAL-ECOLOGY SOAK — founding gradient, tolerance drift, faith reach, conscience embargo');
console.log('# tick = 1 week; %s weeks/year. Deterministic; measures landed dynamics, tunes nothing.', WEEKS_PER_YEAR);
panelA();
panelB();
panelC();
panelD();
console.log('');
