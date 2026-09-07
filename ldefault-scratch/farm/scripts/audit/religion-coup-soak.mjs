/**
 * religion-coup-soak.mjs — the END-TO-END PAYOFF soak. Proves the divine-mandate
 * coupling: for a THEOCRACY, a CONTESTED/discredited patron erodes publicLegitimacy
 * which feeds the COUP cluster — so religious upheaval drives regime change. Unlike
 * religion-soak (a fast in-place path that bypasses the kernel), this drives the REAL
 * pulse (simulateCampaignWorldPulse) so applyDivineMandate + coupSpawnGate +
 * coupVerdictOutcomes all run.
 *
 * Three cohorts isolate the mandate's effect:
 *   secure-theo     — major good patron, clean rule, government 'Theocracy', NO rival.
 *                     Mandate PROPS legitimacy → coups blocked.
 *   contested-theo  — weak good patron + a strong SAME-NICHE evil rival under a rotten
 *                     temple-state, government 'Theocracy'. Patron discredited →
 *                     mandate ERODES legitimacy below the coup gate → coups.
 *   contested-rep   — identical to contested-theo but government 'Town Council' (no
 *                     divine mandate). THE CONTROL: same faith turmoil, no legitimacy
 *                     erosion from religion → far fewer coups. Isolates the coupling.
 *
 *   node scripts/audit/religion-coup-soak.mjs [--seeds 10] [--ticks 100]
 *
 * Determinism: seeded via campaign.worldState.rngSeed; fixed `now`; no Math.random.
 */
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i !== -1 ? Number(process.argv[i + 1]) : d; };
const SEEDS = arg('seeds', 10);
const TICKS = arg('ticks', 100);
const NOW = '2026-01-01T00:00:00.000Z';
const RULES = { religionDynamicsEnabled: true, stressorsEnabled: true };
const pct = (x) => `${(x * 100).toFixed(0)}%`.padStart(4);
const f1 = (x) => x.toFixed(1);

const deity = (name, temper, align, rank = 'minor') => ({ _deityRef: `custom:lu_${name}`, name, temperamentAxis: temper, alignmentAxis: align, rankAxis: rank, lawAxis: 'neutral' });

// Cohort → fixture. The government LABEL drives the mandate weight (/theocra/ → 1,
// council → 0). The ruling FACTION + NPCs drive the compromise that discredits the
// patron. A contested cohort gets a strong same-niche evil rival (the schism).
function cohortSave(cohort, seed) {
  const theo = cohort !== 'contested-rep';
  const rotten = cohort !== 'secure-theo';
  const government = theo ? 'Theocracy' : 'Town Council';
  // All cohorts start a WEAK seat in the CRISIS band (legitimacy 27, <30 where coups fire
  // reliably; Contested 30-45 only spawns at 35%). The mandate then SWINGS the theocracy:
  // a SECURE patron props legitimacy back OUT of crisis (the faith SAVES the throne → far
  // fewer coups); a discredited/contested one leaves it exposed. The republic gets no
  // mandate (the control). The gap secure-theo ↔ contested-rep IS the payoff.
  const START_LEGIT = 27;
  const patron = deity('aurum', 'peaceful', 'good', rotten ? 'minor' : 'major');
  const rival = rotten ? deity('vorr', 'peaceful', 'evil', 'minor') : null;
  // A non-criminal challenger faction (a military watch) must exist for a coup to be
  // possible at all — criminal factions never vie openly (coupSpawnGate). It is the
  // standing threat the eroding legitimacy unleashes; the governing seat is kept weak
  // (low power → thin ruling authority) so the coup pressure can actually build.
  const watch = { id: 'f.watch', name: 'The Iron Watch', archetype: 'military', power: 58, isGoverning: false };
  const powerStructure = rotten
    ? { governingName: 'The Hollow See', government, publicLegitimacy: { score: START_LEGIT, label: 'Wavering' },
        factions: [{ id: 'f.see', name: 'The Hollow See', archetype: 'criminal', power: 44, isGoverning: true }, watch] }
    : { governingName: 'The High Temple', government, publicLegitimacy: { score: START_LEGIT, label: 'Wavering' },
        factions: [{ id: 'f.temple', name: 'The High Temple', archetype: 'religious', power: 46, isGoverning: true }, watch] };
  const npcs = rotten
    ? [{ id: 'n.k', name: 'Hierarch', importance: 'pillar', linkedFactionIds: ['f.see'], personality: { dominant: 'ruthless', flaw: 'corrupt' }, flaw: 'corrupt' }]
    : [{ id: 'n.s', name: 'Hierophant', importance: 'pillar', linkedFactionIds: ['f.temple'], personality: { dominant: 'principled' } }];
  const institutions = [{ id: 'i.cathedral', name: 'Cathedral', category: 'religious', tags: ['religious', 'church'], priorityCategory: 'religion', status: 'active' }];
  if (rotten) institutions.push({ id: 'i.thieves', name: 'Thieves Guild', category: 'criminal', tags: ['criminal'], status: 'active' });
  return {
    id: `s${seed}`, name: `S${seed}`, phase: 'canon',
    settlement: {
      name: `S${seed}`, tier: 'city', population: 18000,
      config: { tradeRouteAccess: 'road', primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron, ...(rival ? { cultDeitySnapshots: [rival] } : {}) },
      institutions, economicState: { prosperity: rotten ? 'struggling' : 'prosperous', primaryExports: [], primaryImports: [] },
      powerStructure, npcs, activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

// One campaign: one settlement of the cohort, run TICKS pulses through the REAL kernel.
// Tracks coups (succeeded/suppressed) and the legitimacy curve.
function runCampaign(cohort, seed) {
  let saves = [cohortSave(cohort, seed)];
  let campaign = {
    id: `coup-${cohort}-${seed}`, name: 'coup', settlementIds: [saves[0].id],
    worldState: { rngSeed: `coup::${cohort}::${seed}`, tick: 1, simulationRules: RULES },
    regionalGraph: ensureRegionalGraph({ edges: [] }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  let coupBirths = 0, coupSucceeded = 0, coupResolved = 0, crisisTicks = 0;
  let legitEnd = Number(saves[0].settlement?.powerStructure?.publicLegitimacy?.score) || 50, legitMin = legitEnd;
  for (let t = 0; t < TICKS; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
    for (const o of [...(r.selected || []), ...(r.autoApplied || [])]) {
      const c = o?.candidateType || o?.type || '';
      if (c === 'stressor_birth_coup_detat') coupBirths++;        // a coup ATTEMPT begins
      else if (c === 'coup_succeeded') { coupSucceeded++; coupResolved++; }
      else if (c === 'coup_suppressed') coupResolved++;
    }
    // Thread state forward: worldState + the deep-cloned settlement updates → next saves.
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s);
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.worldState?.regionalGraph || campaign.regionalGraph };
    const leg = saves[0].settlement?.powerStructure?.publicLegitimacy?.score;
    if (typeof leg === 'number') { legitEnd = leg; legitMin = Math.min(legitMin, leg); if (leg < 30) crisisTicks++; }
  }
  return { coupBirths, coupSucceeded, coupResolved, crisisTicks, legitEnd, legitMin };
}

function soak(cohort) {
  let births = 0, succ = 0, resolved = 0, crisis = 0, legEnd = 0, legMin = 0, withCoup = 0;
  for (let seed = 0; seed < SEEDS; seed++) {
    const r = runCampaign(cohort, seed);
    births += r.coupBirths; succ += r.coupSucceeded; resolved += r.coupResolved; crisis += r.crisisTicks;
    legEnd += r.legitEnd; legMin += r.legitMin; if (r.coupBirths > 0) withCoup++;
  }
  return {
    coupBirths: births / SEEDS, coupSucc: succ / SEEDS, coupResolved: resolved / SEEDS,
    campaignsWithCoup: withCoup / SEEDS, crisisTicks: crisis / SEEDS, legEnd: legEnd / SEEDS, legMin: legMin / SEEDS,
  };
}

console.log(`\n# Religion → COUP payoff soak  (seeds=${SEEDS}, ticks=${TICKS}, one settlement/campaign, REAL kernel)`);
console.log('  All cohorts start a weak seat at legitimacy 27 (Crisis band, <30). The divine mandate is the only difference.');
console.log('\n  cohort            campaignsWithCoup  coupAttempts/camp  coupsSucceeded/camp  crisisTicks(<30)  legitEnd  legitMin');
for (const cohort of ['secure-theo', 'contested-theo', 'contested-rep']) {
  const r = soak(cohort);
  console.log(`  ${cohort.padEnd(16)}  ${pct(r.campaignsWithCoup)}             ${f1(r.coupBirths).padStart(5)}              ${f1(r.coupSucc).padStart(5)}               ${f1(r.crisisTicks).padStart(5)}            ${f1(r.legEnd).padStart(5)}     ${f1(r.legMin).padStart(5)}`);
}
console.log('\nWANT: secure-theo << contested-rep in coup attempts + crisisTicks — the SECURE faith props the throne OUT of');
console.log('      the crisis band, so its coups dry up; the mandate-less republic stays exposed. THAT gap is the payoff.');
console.log('');
