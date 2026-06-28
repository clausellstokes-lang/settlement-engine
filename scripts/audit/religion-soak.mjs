/**
 * religion-soak.mjs — LIVE-loop balance soak for the religion system. Unlike the
 * probe (which freezes legitimacy), this runs the FULL per-settlement pulse
 * (advanceReligionStates) so growth ↔ legitimacy ↔ contest evolve together over a
 * campaign, across many seeds and ruler-corruption levels. It answers the question
 * the probe can't: in a corrupt region, does evil rise RELIABLY-BUT-NOT-MONOLITHICALLY,
 * or overrun everything? Plus degeneracy guards (share drift, stuck schisms, NaN).
 *
 *   node scripts/audit/religion-soak.mjs [--seeds 40] [--ticks 60]
 */
import { advanceReligionStates } from '../../src/domain/worldPulse/religiousContest.js';
import { patronSnapshot } from '../../src/domain/worldPulse/religionState.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i !== -1 ? Number(process.argv[i + 1]) : d; };
const SEEDS = arg('seeds', 40);
const TICKS = arg('ticks', 60);
const RULES = { religionDynamicsEnabled: true };
const NOW = '2026-01-01T00:00:00.000Z';
const pct = (x) => `${(x * 100).toFixed(0)}%`.padStart(4);
const f2 = (x) => x.toFixed(2);

const deity = (name, temper, align, rank = 'minor') => ({ _deityRef: `custom:lu_${name}`, name, temperamentAxis: temper, alignmentAxis: align, rankAxis: rank, lawAxis: 'neutral' });
const isEvil = (snap) => snap && snap.alignmentAxis === 'evil';

// Ruler flavour → powerStructure + npcs + institutions feeding the compromise chain.
function rulership(kind) {
  if (kind === 'clean') return {
    powerStructure: { governingName: 'Council', publicLegitimacy: { score: 70 }, factions: [{ id: 'f.gov', name: 'Council', archetype: 'government', power: 65 }] },
    npcs: [{ id: 'n.c', name: 'Steward', importance: 'pillar', linkedFactionIds: ['f.gov'], personality: { dominant: 'principled' } }],
    institutions: [{ id: 'i.temple', name: 'Temple', category: 'religious', status: 'active' }],
    economicState: { prosperity: 'prosperous', primaryExports: [], primaryImports: [] },
  };
  if (kind === 'corrupt') return {
    powerStructure: { governingName: 'The Ring', publicLegitimacy: { score: 40 }, factions: [{ id: 'f.crime', name: 'The Ring', archetype: 'criminal', power: 60 }] },
    npcs: [{ id: 'n.b', name: 'Boss', importance: 'key', linkedFactionIds: ['f.crime'], personality: { dominant: 'greedy', flaw: 'greedy' }, flaw: 'greedy' }],
    institutions: [{ id: 'i.thieves', name: 'Thieves Guild', category: 'criminal', status: 'active' }],
    economicState: { prosperity: 'average', primaryExports: [], primaryImports: [] },
  };
  return { // deep
    powerStructure: { governingName: 'The Syndicate', publicLegitimacy: { score: 20 }, factions: [{ id: 'f.crime', name: 'The Syndicate', archetype: 'criminal', power: 80 }] },
    npcs: [{ id: 'n.k', name: 'Kingpin', importance: 'pillar', linkedFactionIds: ['f.crime'], personality: { dominant: 'ruthless', flaw: 'ruthless' }, flaw: 'ruthless' }],
    institutions: [{ id: 'i.thieves', name: 'Thieves Guild', category: 'criminal', status: 'active' }, { id: 'i.smug', name: 'Smugglers', category: 'criminal', status: 'active' }],
    economicState: { prosperity: 'struggling', primaryExports: [], primaryImports: [] },
  };
}

const TIERS = ['town', 'city', 'metropolis', 'village'];
function makeSave(i, kind, patron, cultSnap) {
  const r = rulership(kind);
  const tier = TIERS[i % TIERS.length];
  return {
    id: `s${i}`, name: `S${i}`, phase: 'canon',
    settlement: {
      name: `S${i}`, tier, population: 5000,
      config: { tradeRouteAccess: 'road', primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron, ...(cultSnap ? { cultDeitySnapshots: [cultSnap] } : {}) },
      institutions: r.institutions, economicState: r.economicState, powerStructure: r.powerStructure,
      npcs: r.npcs, activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function step(campaign, saves) {
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
  const rng = createPRNG(`${campaign.worldState.rngSeed}::tick:${campaign.worldState.tick}`);
  const r = advanceReligionStates({ snapshot, worldState: campaign.worldState, tick: campaign.worldState.tick, now: NOW, rules: RULES, rng });
  const nextWS = { ...campaign.worldState, tick: campaign.worldState.tick + 1 };
  if (r.religionStates) nextWS.religionStates = r.religionStates;
  const nextSaves = saves.map((s) => {
    const st = r.religionStates?.[s.id]; const p = st ? patronSnapshot(st) : null;
    return p ? { ...s, settlement: { ...s.settlement, config: { ...s.settlement.config, primaryDeityRef: p._deityRef, primaryDeitySnapshot: p } } } : s;
  });
  return { campaign: { ...campaign, worldState: nextWS }, saves: nextSaves };
}

// One run: N independent settlements, each a GOOD patron + an imposed EVIL cult.
// schism=false ⇒ cult in a DIFFERENT niche (growth-driven rise + deterministic flip);
// schism=true ⇒ cult shares the patron's niche (the seeded contest).
// topology 'isolated' ⇒ no neighbours (a fair test of growth/contest, no prevalence
// asymmetry); 'regional' ⇒ allied chain where every neighbour holds the good patron
// (maximally entrenched — the hardest case for a heresy).
// Heterogeneous matchups so a region shows a SPREAD (an entrenched major-god patron
// resists; a weak cult-rank one falls) rather than an all-or-nothing step.
const PRANK = ['major', 'major', 'minor', 'minor', 'cult', 'minor', 'major', 'minor'];
const CRANK = ['cult', 'minor', 'minor', 'cult', 'minor', 'cult', 'cult', 'major'];
const MIX = ['clean', 'corrupt', 'deep', 'clean', 'corrupt', 'clean', 'deep', 'clean'];
function run(kind, schism, topology, seed) {
  const N = 8;
  const saves0 = Array.from({ length: N }, (_, i) => {
    const patron = deity('aurum', 'peaceful', 'good', PRANK[i]);
    const cultSnap = schism ? deity('vorr', 'peaceful', 'evil', CRANK[i]) : deity('vorr', 'warlike', 'evil', CRANK[i]);
    return makeSave(i, kind === 'mixed' ? MIX[i] : kind, patron, cultSnap);
  });
  const edges = topology === 'regional' ? saves0.slice(1).map((s, i) => ({ id: `e${i}`, from: saves0[i].id, to: s.id, relationshipType: 'allied' })) : [];
  let campaign = {
    id: `soak-${kind}-${seed}`, name: 'soak', settlementIds: saves0.map((s) => s.id),
    worldState: { rngSeed: `soak::${kind}::${schism}::${topology}::${seed}`, tick: 1, simulationRules: RULES },
    regionalGraph: ensureRegionalGraph({ edges }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  let saves = saves0;
  for (let t = 0; t < TICKS; t++) ({ campaign, saves } = step(campaign, saves));
  return { campaign };
}

// Aggregate over seeds. Tracks the imposed evil cult (custom:lu_vorr): how often it
// SEIZED the patron seat, and its average final adherent share (the growth signal).
function soak(kind, schism, topology) {
  let evilPatron = 0, settlements = 0, legitSum = 0, legitN = 0, diversitySum = 0, cultShareSum = 0;
  let shareViol = 0, nan = 0, stuckSchism = 0, allSupp = 0;
  for (let seed = 0; seed < SEEDS; seed++) {
    const states = run(kind, schism, topology, seed).campaign.worldState.religionStates || {};
    for (const id of Object.keys(states)) {
      settlements++;
      const st = states[id];
      const active = Object.values(st.deities).filter((d) => !d.suppressed);
      if (st.patronRef && isEvil(st.deities[st.patronRef]?.snapshot)) evilPatron++;
      const cult = st.deities['custom:lu_vorr'];
      cultShareSum += cult && !cult.suppressed ? (Number(cult.share) || 0) : 0;
      diversitySum += active.length || 1;
      const sum = active.reduce((a, d) => a + (Number(d.share) || 0), 0);
      if (active.length && Math.abs(sum - 100) > 0.5) shareViol++;
      if (active.length === 0) allSupp++;
      if (st.patronRef) { const pn = st.deities[st.patronRef]?.niche; if (active.filter((d) => d.niche === pn).length > 1) stuckSchism++; }
      for (const d of active) { const L = Number(d.legitimacy); if (!Number.isFinite(L)) nan++; else { legitSum += L; legitN++; } }
    }
  }
  return { evilPatronRate: evilPatron / settlements, cultShare: cultShareSum / settlements,
    avgLegit: legitN ? legitSum / legitN : 0, avgDiversity: diversitySum / settlements, shareViol, nan, stuckSchism, allSupp };
}

function table(title, schism) {
  console.log(`\n## ${title}`);
  console.log('  ruler / topology     evilPatronRate  evilCultShare  avgLegit  diversity  [shareV nan stuck allSupp]');
  for (const topology of ['isolated', 'regional']) {
    for (const kind of ['clean', 'corrupt', 'deep', 'mixed']) {
      const r = soak(kind, schism, topology);
      console.log(`  ${(kind + '/' + topology).padEnd(20)} ${pct(r.evilPatronRate)}          ${f2(r.cultShare).padStart(5)}        ${f2(r.avgLegit)}      ${f2(r.avgDiversity)}       [${r.shareViol} ${r.nan} ${r.stuckSchism} ${r.allSupp}]`);
    }
  }
}

console.log(`\n# Religion LIVE-LOOP soak  (seeds=${SEEDS}, ticks=${TICKS}, 8 settlements/run)`);
table('GROWTH-driven — good patron + imposed EVIL cult (different niche)', false);
table('SCHISM — good patron + imposed EVIL cult (SAME niche; the seeded contest)', true);
console.log('\nWANT: clean evilRate ~low; corrupt/deep rises (esp. isolated, where the cult has a fair shot)');
console.log('      but stays variable (not 100%); avgLegit mid; diversity >1; guards all [0 0 0 0].\n');
