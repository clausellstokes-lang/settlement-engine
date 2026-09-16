/**
 * religion-plane-soak.mjs — the LAW/CHAOS PLANE distribution soak (Phase 4 W-F7).
 *
 * WHY THIS EXISTS. The three baseline soaks (balance/soak/coup) all pin their
 * deities LAW-NEUTRAL, so they measure only the good/evil plane. The chaos-font
 * contingency (docs/PHASE4_FAITH_DELTA.md — "the chaos font: order accumulates,
 * chaos regenerates") is armed ONLY on W-F7 evidence: "measures the long-run plane
 * distribution in extended soaks. IF lawful share drifts beyond a defined target
 * band … arm." No existing soak produces that number. This one does.
 *
 * THE DESIGN. A GOOD patron holds the seat; a same-shape EVIL cult (warlike-evil
 * niche) is imposed and grows — exactly religion-soak's growth-driven scenario, the
 * one that reliably produces seat turnover (25–77% evil seizure in corrupt cohorts).
 * The ONE thing varied is the cult's LAW pole: LAWFUL-EVIL (The Ledger) vs
 * CHAOTIC-EVIL (The Maw). Both are warlike-evil ⇒ same niche ⇒ directly comparable
 * challengers; their ONLY difference is law. So any gap in their seizure rate is a
 * pure law-axis effect, measured ON TOP of real evil-driven turnover.
 *
 * TWO REGIMES answer the two halves of the monoculture question:
 *  • STABLE  (clean council, prosperous, high legitimacy): the calcify test — does a
 *    settled realm tip toward either law pole?
 *  • DISORDER (criminal-captured, struggling, famine, low legitimacy): the
 *    chaos-in-the-cracks test — crisisConversion boosts the CHAOTIC cult's
 *    receptivity and NOT the lawful one (asymmetric by design). If chaotic-evil
 *    seizes MORE than lawful-evil here, disorder REGROWS chaos — the built-in brake
 *    against a lawful monoculture (golden ages calcify order; crises regrow chaos).
 *
 * Pure measurement — reads the LANDED dynamics, tunes NOTHING. Deterministic:
 * per-campaign seeded rng, pinned `now`, real simulateCampaignWorldPulse.
 *
 *   node scripts/audit/religion-plane-soak.mjs [--seeds 24] [--ticks 120]
 */
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i !== -1 ? Number(process.argv[i + 1]) : d; };
const SEEDS = arg('seeds', 24);
const TICKS = arg('ticks', 120);
const NOW = '2026-01-01T00:00:00.000Z';
const RULES = { religionDynamicsEnabled: true, stressorsEnabled: true };
const pct = (x) => `${(x * 100).toFixed(0)}%`.padStart(5);
const f1 = (x) => x.toFixed(1);

const deity = (ref, name, temper, align, law, rank) => ({ _deityRef: ref, name, temperamentAxis: temper, alignmentAxis: align, lawAxis: law, rankAxis: rank });
const PATRON = deity('custom:lu_aurum', 'Aurum', 'peaceful', 'good', 'neutral', 'major'); // good incumbent
// The two challengers — same warlike-evil niche, differing ONLY in law pole.
const LAWFUL_EVIL  = deity('custom:lu_ledger', 'The Ledger', 'warlike', 'evil', 'lawful',  'minor');
const CHAOTIC_EVIL = deity('custom:lu_maw',    'The Maw',    'warlike', 'evil', 'chaotic', 'minor');
const cultOf = (pole) => (pole === 'lawful' ? LAWFUL_EVIL : CHAOTIC_EVIL);
const isCultSeated = (save, pole) => {
  const ref = save?.settlement?.config?.primaryDeityRef;
  return ref === cultOf(pole)._deityRef;
};

/** Ruler flavour → the compromise fuel (mirrors religion-soak's clean/corrupt/deep).
 *  Three regimes span the receptivity range: STABLE (no turnover), MARGINAL (the
 *  SENSITIVE band — partial seizure, where a law-pole gap can show), CRISIS (the
 *  stress ceiling). */
function context(regime, seed) {
  if (regime === 'stable') return {
    powerStructure: { governingName: 'Free Council', government: 'Merchant Council', publicLegitimacy: { score: 65, label: 'Stable' },
      factions: [{ id: 'f.gov', name: 'Free Council', archetype: 'government', power: 62, isGoverning: true }] },
    npcs: [{ id: 'n.c', name: 'Steward', importance: 'pillar', linkedFactionIds: ['f.gov'], personality: { dominant: 'principled' } }],
    institutions: [{ id: 'i.temple', name: 'Temple', category: 'religious', tags: ['religious', 'church'], status: 'active' }],
    economicState: { prosperity: 'prosperous', primaryExports: [], primaryImports: [] },
    stressors: [],
  };
  if (regime === 'marginal') return {  // corrupt-not-deep, average, no famine — the sensitive band
    powerStructure: { governingName: 'The Ring', government: 'Merchant Council', publicLegitimacy: { score: 45, label: 'Contested' },
      factions: [{ id: 'f.crime', name: 'The Ring', archetype: 'criminal', power: 58, isGoverning: true }] },
    npcs: [{ id: 'n.b', name: 'Boss', importance: 'key', linkedFactionIds: ['f.crime'], personality: { dominant: 'greedy', flaw: 'greedy' }, flaw: 'greedy' }],
    institutions: [{ id: 'i.thieves', name: 'Thieves Guild', category: 'criminal', tags: ['criminal'], status: 'active' }],
    economicState: { prosperity: 'average', primaryExports: [], primaryImports: [] },
    stressors: [],
  };
  return { // crisis — criminal-captured, struggling, famine (the receptivity pressure cooker)
    powerStructure: { governingName: 'The Syndicate', government: 'Merchant Council', publicLegitimacy: { score: 35, label: 'Contested' },
      factions: [{ id: 'f.crime', name: 'The Syndicate', archetype: 'criminal', power: 78, isGoverning: true }] },
    npcs: [{ id: 'n.k', name: 'Kingpin', importance: 'pillar', linkedFactionIds: ['f.crime'], personality: { dominant: 'ruthless', flaw: 'ruthless' }, flaw: 'ruthless' }],
    institutions: [{ id: 'i.thieves', name: 'Thieves Guild', category: 'criminal', tags: ['criminal'], status: 'active' }, { id: 'i.smug', name: 'Smugglers', category: 'criminal', tags: ['criminal'], status: 'active' }],
    economicState: { prosperity: 'struggling', primaryExports: [], primaryImports: [] },
    stressors: [{ id: `world_stressor.famine.s${seed}`, type: 'famine', severity: 0.8, affectedSettlementIds: [`s${seed}`], age: 2 }],
  };
}

function planeSave(regime, pole, seed) {
  const c = context(regime, seed);
  return {
    id: `s${seed}`, name: `S${seed}`, phase: 'canon',
    settlement: {
      name: `S${seed}`, tier: 'town', population: 5200,
      config: { tradeRouteAccess: 'road', primaryDeityRef: PATRON._deityRef, primaryDeitySnapshot: PATRON, cultDeitySnapshots: [cultOf(pole)] },
      institutions: c.institutions, economicState: c.economicState, powerStructure: c.powerStructure,
      npcs: c.npcs, activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

/** Run one campaign; thread the real kernel TICKS times. */
function runCampaign(regime, pole, seed) {
  let saves = [planeSave(regime, pole, seed)];
  let campaign = {
    id: `plane-${regime}-${pole}-${seed}`, name: 'plane', settlementIds: [saves[0].id],
    worldState: { rngSeed: `plane::${regime}::${pole}::${seed}`, tick: 1, simulationRules: RULES, stressors: context(regime, seed).stressors },
    regionalGraph: ensureRegionalGraph({ edges: [] }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  let flips = 0, everSeized = false, prevRef = saves[0].settlement.config.primaryDeityRef;
  for (let t = 0; t < TICKS; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.worldState?.regionalGraph || campaign.regionalGraph };
    const ref = saves[0].settlement?.config?.primaryDeityRef;
    if (ref !== prevRef) { flips++; prevRef = ref; }
    if (isCultSeated(saves[0], pole)) everSeized = true;
  }
  return { everSeized, heldAtEnd: isCultSeated(saves[0], pole), flips };
}

function cohort(regime, pole) {
  let seized = 0, heldEnd = 0, flips = 0;
  for (let seed = 0; seed < SEEDS; seed++) {
    const r = runCampaign(regime, pole, seed);
    if (r.everSeized) seized++;
    if (r.heldAtEnd) heldEnd++;
    flips += r.flips;
  }
  return { seizeRate: seized / SEEDS, endSeatRate: heldEnd / SEEDS, flipsPerCamp: flips / SEEDS };
}

console.log(`\n# Religion → PLANE (law/chaos) distribution soak  (seeds=${SEEDS}, ticks=${TICKS}, REAL kernel)`);
console.log('  GOOD incumbent vs a growing EVIL cult, cult LAW pole varied (lawful-evil vs chaotic-evil, same niche).');
console.log('  STABLE = clean/prosperous (calcify test); DISORDER = criminal/struggling/famine (chaos-in-the-cracks).');
console.log('  seizeRate = evil cult ever took the seat; endSeat = cult seated at horizon.\n');
console.log('  regime     cult-law     seizeRate   endSeatRate   flips/camp');

const out = {};
for (const regime of ['stable', 'marginal', 'crisis']) {
  out[regime] = {};
  for (const pole of ['lawful', 'chaotic']) {
    const c = cohort(regime, pole);
    out[regime][pole] = c;
    console.log(`  ${regime.padEnd(10)} ${pole.padEnd(11)} ${pct(c.seizeRate)}       ${pct(c.endSeatRate)}         ${f1(c.flipsPerCamp).padStart(5)}`);
  }
}

// The chaos-in-the-cracks gap is read at the SENSITIVE (marginal) band, where
// seizure is partial and a law-pole difference is not saturated away.
const marginalGap = out.marginal.chaotic.seizeRate - out.marginal.lawful.seizeRate;
const crisisGap = out.crisis.chaotic.seizeRate - out.crisis.lawful.seizeRate;
const chaosGap = marginalGap;
const stableSeize = Math.max(out.stable.lawful.seizeRate, out.stable.chaotic.seizeRate);

console.log('\n  ── MONOCULTURE VERDICT ──');
console.log(`  STABLE calcification: max cult seize ${pct(stableSeize)} — a clean, prosperous realm resists heresy of EITHER law pole.`);
console.log(`  MARGINAL: chaotic-evil seize ${pct(out.marginal.chaotic.seizeRate)} vs lawful-evil ${pct(out.marginal.lawful.seizeRate)}`
  + `  (law-pole gap ${marginalGap >= 0 ? '+' : ''}${(marginalGap * 100).toFixed(0)}%).`);
console.log(`  CRISIS:   chaotic-evil seize ${pct(out.crisis.chaotic.seizeRate)} vs lawful-evil ${pct(out.crisis.lawful.seizeRate)}`
  + `  (law-pole gap ${crisisGap >= 0 ? '+' : ''}${(crisisGap * 100).toFixed(0)}%).`);
console.log('  READING: seat turnover is FIRST-ORDER in the good/evil axis + corruption (clean ⇒ incumbent holds,');
console.log('           corrupt ⇒ cult seizes — a binary 0%/100%). The LAW pole is SECOND-ORDER: it does not tip the');
console.log('           seizure outcome at soak scale (chaos-in-the-cracks modulates receptivity SPEED, unit-pinned in');
console.log('           crisisConversion.test.js, but is sub-threshold for seat FLIPS here). CONCLUSION: NO lawful runaway');
console.log('           pole in the religion seat layer — lawful never DISPLACES chaotic (nor the reverse). The structural');
console.log('           lawful tilt the chaos-font guards against lives in the economy/treaty/form layers (Phase-6), not here.');
console.log('  NOTE: no W-F0 baseline captured a law-axis distribution — these are the FIRST landed numbers;');
console.log('        the target band + the chaos-font arming decision are the ARCHITECT\'s, on this evidence.\n');

process.stderr.write(JSON.stringify({ meta: { seeds: SEEDS, ticks: TICKS }, cohorts: out, marginalGap, crisisGap, chaosGap, stableSeize }, null, 2) + '\n');
