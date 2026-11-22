/**
 * cause-lifecycle-soak.mjs — Phase 5 W-C5 evidence soak (deterministic, measures LANDED
 * dynamics, tunes NOTHING). Drives advanceCauseLifecycle directly over seeded cohorts —
 * the same discipline as conquest-market-soak (drive the leaf, measure the envelope):
 *
 *   A. OUTCOME DISTRIBUTION BY TRAIT PLANE — the principled-reform vs corruptible-recause
 *      gradient at resolution, holding climate + an available alternative cause constant.
 *   B. REFORM CLIMATE GRADIENT — the SAME plane across rotten→clean climates: rotten cities
 *      rarely reform, a devout-good purge climate invites it.
 *   C. RE-CAUSE COHERENCE AUDIT — every adopted cause verifiably REAL in-state at adoption
 *      (never invented). Reports the invented-cause count (must be 0).
 *   D. TERMINAL FREQUENCIES — the exposure arc (covert→revealed) and the infrastructure-death
 *      re-adjudication resolve-vs-recatch split by plane.
 *   E. AGE-BAND DISTRIBUTION of surviving (historicized) corruption over origin age — the
 *      temporal register the display derives, and the years-past historicize threshold.
 *
 * Deterministic: seeded PRNG cohorts, pinned constants. Pure measurement.
 *   node scripts/audit/cause-lifecycle-soak.mjs [--cohort 4000]
 */
import {
  advanceCauseLifecycle, LIFECYCLE_TUNING, reformClimate01,
} from '../../src/domain/worldPulse/causeLifecycle.js';
import {
  readCauseContext, presentCauseClasses,
} from '../../src/domain/worldPulse/causeVocabulary.js';
import { npcId } from '../../src/domain/worldPulse/npcAgency.js';
import { ageBandForElapsed } from '../../src/domain/ageBands.js';
import { createPRNG } from '../../src/kernel/prng.js';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i !== -1 ? Number(process.argv[i + 1]) : d; };
const COHORT = arg('cohort', 4000);
const HOLD = LIFECYCLE_TUNING.RESOLUTION_HOLD_TICKS;
const pct = (n, d) => (d ? (100 * n / d).toFixed(1) + '%' : '  0.0%');

// ── plane fixtures (authored personality → npcTraitPlane) ────────────────────────
const PLANES = {
  'principled-good': { dominant: 'principled', flaw: 'honest', modifier: 'incorruptible' },
  'dutiful-lawful':  { dominant: 'dutiful', flaw: 'loyal', modifier: 'disciplined' },
  'steady-neutral':  { dominant: 'disciplined' },
  'greedy-corrupt':  { dominant: 'ambitious', flaw: 'greedy', modifier: 'self-serving' },
  'ruthless-dark':   { dominant: 'cruel', flaw: 'corrupt', modifier: 'ruthless' },
};

// Build a settlement item whose attributed cause (underfunded) is now CLEAR, with an
// optional alternative real cause present (siege), and a chosen climate.
function scenario({ personality, alt = true, climate = {} }) {
  const npc = { id: 'cap', name: 'Captain', corrupt: true, personality };
  const scores = { economic_capacity: 90, law_order: climate.lawOrder ?? 55 };
  const conditions = alt ? ['siege'] : [];
  const config = climate.goodPatron ? { primaryDeitySnapshot: { alignmentAxis: 'good' } }
    : climate.evilPatron ? { primaryDeitySnapshot: { alignmentAxis: 'evil' } } : {};
  const powerStructure = climate.captured ? { criminalCaptureState: 'capture' } : {};
  const settlement = { name: 'S', npcs: [npc], institutions: [], config, powerStructure, activeConditions: conditions.map((a) => ({ archetype: a })) };
  const item = { id: 'a', settlement, causal: { scores }, activeConditions: settlement.activeConditions };
  return { item, npc };
}

// Run ONE resolution decision at a given seed; return the path + (for re-cause) the
// adopted cause and whether it was real in-state.
function resolveDecision({ personality, alt = true, climate = {}, role = 'military', seed }) {
  const { item, npc } = scenario({ personality, alt, climate });
  const conditionId = npcId('a', npc, 0);
  const prior = { a: { [conditionId]: { causeClass: 'underfunded', family: 'economic', stage: 'attributed', role, situation: 'compromised-covert', originTick: 0, resolveHold: HOLD - 1, priorCauses: [] } } };
  const worldState = { npcStates: { [conditionId]: { roleArchetype: role } } };
  const out = advanceCauseLifecycle({ snapshot: { settlements: [item] }, worldState, priorLedger: prior, rng: createPRNG(seed), tick: 20 });
  if (out.reforms.length) return { path: 'reform' };
  const rec = out.causeLifecycleByCid?.a?.[conditionId];
  if (!rec) return { path: 'none' };
  if (rec.stage === 're-caused') {
    const ctx = readCauseContext(item, worldState, 'a');
    const real = presentCauseClasses(ctx).includes(rec.causeClass);
    return { path: 'recause', adopted: rec.causeClass, real };
  }
  if (rec.stage === 'historicized') return { path: 'historicize' };
  return { path: rec.stage };
}

function distribution(fn) {
  const d = { reform: 0, recause: 0, historicize: 0, other: 0 };
  for (let i = 0; i < COHORT; i++) {
    const p = fn(`seed-${i}`).path;
    if (d[p] !== undefined) d[p] += 1; else d.other += 1;
  }
  return d;
}

function panelA() {
  console.log('\n## A. OUTCOME DISTRIBUTION BY TRAIT PLANE (climate held at law_order 55, alt cause present)');
  console.log('   The character-derived gradient: conscience reforms, appetite re-causes, habit historicizes.\n');
  console.log('   plane              reform     re-cause   historicize');
  const out = {};
  for (const [name, personality] of Object.entries(PLANES)) {
    const d = distribution((seed) => resolveDecision({ personality, seed }));
    out[name] = d;
    console.log(`   ${name.padEnd(17)} ${pct(d.reform, COHORT).padStart(7)}    ${pct(d.recause, COHORT).padStart(7)}    ${pct(d.historicize, COHORT).padStart(7)}`);
  }
  console.log('\n   READING: good planes lean REFORM, corrupt planes lean RE-CAUSE, steady/neutral leans HISTORICIZE.');
  return out;
}

function panelB() {
  console.log('\n## B. REFORM CLIMATE GRADIENT (a moderate plane across rotten→clean climates)');
  console.log('   Same bearer (dutiful-lawful); only the settlement climate changes.\n');
  console.log('   climate                       reformClimate   reform     historicize');
  const personality = PLANES['dutiful-lawful'];
  const climates = [
    ['captured + evil patron', { captured: true, evilPatron: true, lawOrder: 25 }],
    ['low order, neutral',      { lawOrder: 30 }],
    ['moderate',                { lawOrder: 55 }],
    ['high order',              { lawOrder: 85 }],
    ['devout-good purge',       { lawOrder: 85, goodPatron: true }],
  ];
  const out = {};
  for (const [name, climate] of climates) {
    const { item } = scenario({ personality, climate });
    const ctx = readCauseContext(item, { npcStates: {} }, 'a');
    const rc = reformClimate01(ctx, item.settlement);
    const d = distribution((seed) => resolveDecision({ personality, climate, seed }));
    out[name] = { reformClimate: +rc.toFixed(3), reform: d.reform, historicize: d.historicize, recause: d.recause };
    console.log(`   ${name.padEnd(28)} ${rc.toFixed(3).padStart(7)}       ${pct(d.reform, COHORT).padStart(7)}    ${pct(d.historicize, COHORT).padStart(7)}`);
  }
  console.log('\n   READING: rotten cities rarely reform; a high-order, devout-good climate invites the purge arc.');
  return out;
}

function panelC() {
  console.log('\n## C. RE-CAUSE COHERENCE AUDIT — every adopted cause must be REAL in-state at adoption');
  let recauses = 0; let invented = 0;
  const adopted = {};
  for (const personality of Object.values(PLANES)) {
    for (let i = 0; i < COHORT; i++) {
      const r = resolveDecision({ personality, seed: `coh-${i}` });
      if (r.path !== 'recause') continue;
      recauses += 1;
      adopted[r.adopted] = (adopted[r.adopted] || 0) + 1;
      if (!r.real) invented += 1;
    }
  }
  console.log(`   re-cause events: ${recauses}   adopted causes: ${Object.keys(adopted).join(', ') || '(none)'}`);
  console.log(`   INVENTED (not real in-state at adoption): ${invented}   ← must be 0`);
  console.log('\n   READING: re-cause draws ONLY from presentCauseClasses — the new cause is always a live condition.');
  return { recauses, invented, adopted };
}

function panelD() {
  console.log('\n## D. TERMINAL FREQUENCIES');
  // Exposure: a covert record whose settlement now carries a REVEALED compromised institution.
  const npc = { id: 'cap', name: 'Captain', corrupt: true, personality: PLANES['steady-neutral'] };
  const conditionId = npcId('a', npc, 0);
  const revealedItem = {
    id: 'a',
    settlement: { name: 'S', npcs: [npc], institutions: [{ name: 'Town watch', impairments: [{ type: 'corruption', covert: false }] }], powerStructure: { criminalCaptureState: 'capture' }, activeConditions: [] },
    causal: { scores: {} }, activeConditions: [],
  };
  const priorCovert = { a: { [conditionId]: { causeClass: 'captured', family: 'corruption', stage: 'attributed', role: 'military', situation: 'compromised-covert', originTick: 2, resolveHold: 0, priorCauses: [] } } };
  const exp = advanceCauseLifecycle({ snapshot: { settlements: [revealedItem] }, worldState: { npcStates: { [conditionId]: { roleArchetype: 'military' } } }, priorLedger: priorCovert, rng: createPRNG('exp'), tick: 10 });
  const exposed = exp.causeLifecycleByCid.a[conditionId].stage === 'exposed-public';
  console.log(`   EXPOSURE (covert→revealed): stamps exposed-public = ${exposed} (quiet lifecycle stops, public arc takes over)`);

  // Re-adjudication: a destroyed sustaining institution, resolve-vs-recatch by plane.
  console.log('\n   RE-ADJUDICATION (sustaining institution destroyed) — resolve vs re-catch by plane:');
  console.log('   plane              resolve    re-catch');
  const out = { exposedStamped: exposed, readjudicate: {} };
  for (const [name, personality] of Object.entries(PLANES)) {
    let resolve = 0; let recatch = 0;
    for (let i = 0; i < COHORT; i++) {
      const b = { id: 'cap', name: 'Captain', corrupt: true, personality, corruptTies: { criminalInstitution: 'Smuggling ring' } };
      const cid2 = npcId('a', b, 0);
      const item = {
        id: 'a',
        settlement: { name: 'S', npcs: [b], institutions: [{ name: 'Smuggling ring', status: 'remnant', worldPulseFate: 'captured_by_local_powers' }], activeConditions: [{ archetype: 'siege' }] },
        causal: { scores: { economic_capacity: 90 } }, activeConditions: [{ archetype: 'siege' }],
      };
      const prior = { a: { [cid2]: { causeClass: 'captured', family: 'corruption', stage: 'attributed', role: 'criminal', situation: 'compromised-covert', originTick: 2, resolveHold: 0, priorCauses: [] } } };
      const r = advanceCauseLifecycle({ snapshot: { settlements: [item] }, worldState: { npcStates: { [cid2]: { roleArchetype: 'criminal' } } }, priorLedger: prior, rng: createPRNG(`ra-${name}-${i}`), tick: 12 });
      if (r.reforms.length) resolve += 1; else recatch += 1;
    }
    out.readjudicate[name] = { resolve, recatch };
    console.log(`   ${name.padEnd(17)} ${pct(resolve, COHORT).padStart(7)}    ${pct(recatch, COHORT).padStart(7)}`);
  }
  console.log('\n   READING: habit never survives DEMOLISHED infrastructure intact — the dark reach for a new patron,');
  console.log('            the principled let it die. The exposure terminal supersedes the quiet lifecycle.');
  return out;
}

function panelE() {
  console.log('\n## E. AGE-BAND DISTRIBUTION of surviving (historicized) corruption over origin age');
  console.log('   The temporal register the display derives from originTick vs the current tick.\n');
  console.log('   origin age (wk)   band            historicize register');
  const out = {};
  for (const age of [1, 3, 8, 13, 14, 26, 49, 52, 53, 200]) {
    const band = ageBandForElapsed(age);
    out[`wk${age}`] = band;
    const register = band === 'years-past' ? '"the lean years" (permitted)' : 'fresh / recent (lean-years FORBIDDEN)';
    console.log(`   ${String(age).padStart(6)}            ${band.padEnd(14)}  ${register}`);
  }
  console.log('\n   READING: historicizing "lean years" language is impossible below the years threshold (>52wk) —');
  console.log('            a freshly-resolved cause reads fresh; only years-past corruption reads as history.');
  return out;
}

console.log(`\n# W-C5 CAUSE-LIFECYCLE SOAK (deterministic; cohort=${COHORT}; RESOLUTION_HOLD ${HOLD}wk)`);
const evidence = {
  meta: { cohort: COHORT, RESOLUTION_HOLD_TICKS: HOLD, tuning: LIFECYCLE_TUNING },
  A: panelA(), B: panelB(), C: panelC(), D: panelD(), E: panelE(),
};
console.log('');
process.stderr.write(JSON.stringify(evidence, null, 2) + '\n');
