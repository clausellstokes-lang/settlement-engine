/**
 * story-census.mjs — THE STORY CENSUS (bar 97's own instrument, C5).
 *
 * The seeded decade-walkthrough the bar names: retell ten years of a realm as a
 * story and MEASURE that the story holds — arcs exist, arcs connect (link-depth
 * through the receipted cause graph), the same seed narrates identically, and the
 * telling never contradicts itself (no event cites a cause that was never alive;
 * no news names a settlement outside the realm). The sibling scripts/audit/ soaks
 * are subsystem DISTRIBUTION drives; this one is the narrative-integrity census
 * over the composed world pulse.
 *
 * Deterministic: fixed seed, fixed `now`, monthly ticks. Pure measurement plus
 * ASSERTIONS — any violated floor sets a nonzero exit code with the violation
 * named. Floors were MEASURED first (2026-07-21 landing run: 2,380 events, 96
 * chained, max link-depth 2, 2 governed classes birthing [succession_coup 90 +
 * economic_shock 4 — the same fixture-shaped dominance the cacophony soak's
 * honesty note records], 16 stressor arcs, 240 news entries, zero dangling
 * citations) and set GENEROUSLY below measurement — a regression floor, not a
 * design band.
 *
 *   node scripts/audit/story-census.mjs [--years 10]
 */
import { createHash } from 'node:crypto';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { dramaClassOf, isChainedConsequence } from '../../src/domain/worldPulse/narrativeTempo.js';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i !== -1 ? Number(process.argv[i + 1]) : d; };
const YEARS = arg('years', 10);
const TICKS = YEARS * 12; // one_month ticks
const NOW = '2026-01-01T00:00:00.000Z';
const SEED = 'story-census-seed';
const GRAIN = 'Bulk grain and foodstuffs';
const IDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

// ── fixture (the cacophony-soak realm shape; tempo UNLIT so every producer,
//    seam and bypass alike, contributes to the story) ─────────────────────────
function st(name, { exports = [], imports = [], patch = {} } = {}) {
  return {
    name, tier: 'town', population: 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: [],
    economicState: { primaryExports: exports, primaryImports: imports },
    powerStructure: {
      publicLegitimacy: { score: 26, label: 'Legitimacy Crisis' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 68 },
        { faction: 'Temple Wardens', category: 'religious', power: 57 },
        { faction: 'City Guard', category: 'military', power: 50 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: [],
    ...patch,
  };
}
const save = (id, name, opts) => ({ id, name, phase: 'canon', settlement: st(name, opts), campaignState: { phase: 'canon', eventLog: [], locks: {} } });
const ch = (to) => ({ id: `ch.a.${to}`, type: 'trade_dependency', from: 'a', to, goods: [{ id: 'grain', label: GRAIN }], strength: 0.7, status: 'confirmed' });
function makeSaves() {
  return IDS.map((id, i) => (i === 0
    ? save(id, 'Ashford', { exports: [GRAIN], patch: { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.85 }] } })
    : save(id, `S${id.toUpperCase()}`, { imports: [GRAIN], ...(i < 3 ? { patch: { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.78 }] } } : {}) })));
}
function makeCampaign() {
  return {
    id: 'story-census', name: 'Story Census', settlementIds: [...IDS],
    worldState: {
      rngSeed: SEED, tick: 1, calendar: { elapsedWeeks: 4 },
      stressors: [
        { id: 'world_stressor.famine.a', type: 'famine', severity: 0.92, affectedSettlementIds: ['a'], age: 3 },
        { id: 'world_stressor.famine.b', type: 'famine', severity: 0.85, affectedSettlementIds: ['b'], age: 2 },
        { id: 'world_stressor.disease_outbreak.c', type: 'disease_outbreak', severity: 0.74, affectedSettlementIds: ['c'], age: 1 },
      ],
    },
    regionalGraph: ensureRegionalGraph({
      edges: IDS.slice(1).map((to) => ({ id: `e.a.${to}`, from: 'a', to, relationshipType: 'trade_partner' })),
      channels: IDS.slice(1).map(ch),
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
}

const citedStressors = (o) => {
  const causes = o?.condition && Array.isArray(o.condition.causes) ? o.condition.causes : [];
  return causes.map((c) => c?.source).filter((s) => typeof s === 'string' && s.startsWith('world_stressor.'));
};

/** Drive one full decade; return every measurement the census asserts on. */
function walkDecade() {
  let campaign = makeCampaign();
  let saves = makeSaves();

  /** stressor id -> link depth of the arc it roots (fixture roots = 1) */
  const stressorDepth = new Map((campaign.worldState.stressors).map((s) => [s.id, 1]));
  const stressorIdsSeen = new Set(stressorDepth.keys());

  let totalEvents = 0;
  let chainedEvents = 0;
  let maxLinkDepth = 1;
  let danglingCitations = 0;
  /** @type {Record<string, number>} governed spontaneous births by drama class */
  const byClass = {};
  /** @type {number[]} landed events per year (a silent year = a dead decade slice) */
  const perYear = new Array(YEARS).fill(0);
  /** @type {string[]} the retell — one line per landed event, in world order */
  const retell = [];
  /** @type {number[]} depth histogram: depthCounts[d] = events at link-depth d */
  const depthCounts = [];

  let finalNews = { entries: [] };

  for (let t = 0; t < TICKS; t++) {
    const year = Math.floor(t / 12) + 1;
    const month = (t % 12) + 1;
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });

    /** this tick's events with their computed depths (for new-stressor attribution) */
    const tickEvents = [];
    for (const o of r.selected || []) {
      totalEvents += 1;
      perYear[year - 1] += 1;
      const cited = citedStressors(o);
      let depth = 1;
      if (cited.length > 0) {
        chainedEvents += 1;
        for (const src of cited) {
          if (!stressorIdsSeen.has(src)) danglingCitations += 1;
          depth = Math.max(depth, 1 + (stressorDepth.get(src) ?? 1));
        }
      }
      maxLinkDepth = Math.max(maxLinkDepth, depth);
      depthCounts[depth] = (depthCounts[depth] || 0) + 1;
      tickEvents.push({ o, depth });

      const cls = dramaClassOf(o);
      if (cls !== null && !isChainedConsequence(o)) byClass[cls] = (byClass[cls] || 0) + 1;

      retell.push(`y${year} m${month}  [d${depth}] ${o.candidateType}${o.targetSaveId ? ` @${o.targetSaveId}` : ''}: ${o.headline || '(no headline)'}`);
    }

    // New stressors inherit the depth of the deepest event of their own type this
    // tick (birth/spread/escalate produce the record) — the arc genealogy.
    for (const s of r.worldState.stressors || []) {
      if (stressorIdsSeen.has(s.id)) continue;
      stressorIdsSeen.add(s.id);
      const producers = tickEvents.filter(({ o }) =>
        typeof o.candidateType === 'string'
        && (o.candidateType === `stressor_birth_${s.type}` || o.candidateType === `stressor_spread_${s.type}` || o.candidateType === `stressor_escalate_${s.type}`));
      stressorDepth.set(s.id, producers.length ? Math.max(...producers.map((e) => e.depth)) : 1);
    }

    const upd = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((sv) => (upd.has(sv.id) ? { ...sv, settlement: upd.get(sv.id) } : sv));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph, wizardNews: r.wizardNews || campaign.wizardNews };
    finalNews = campaign.wizardNews || finalNews;
  }

  // News integrity: every surviving entry names only realm settlements.
  const realm = new Set(IDS);
  let newsChecked = 0;
  let newsViolations = 0;
  for (const e of finalNews.entries || []) {
    newsChecked += 1;
    for (const sid of e.settlementIds || []) {
      if (!realm.has(String(sid))) newsViolations += 1;
    }
  }

  return {
    totalEvents, chainedEvents, maxLinkDepth, danglingCitations, byClass, perYear,
    depthCounts, retell, newsChecked, newsViolations,
    stressorArcs: stressorIdsSeen.size,
    retellHash: createHash('sha256').update(retell.join('\n')).digest('hex'),
  };
}

// ── the census ────────────────────────────────────────────────────────────────
console.log(`\n# THE STORY CENSUS — seeded ${YEARS}-year walkthrough (seed "${SEED}", ${IDS.length} settlements)`);

const run1 = walkDecade();
const run2 = walkDecade();

console.log('\n## A. THE RETELL (the decade as a story — first and last chapter sampled)');
for (const line of run1.retell.slice(0, 6)) console.log(`   ${line}`);
console.log(`   … ${run1.retell.length - 12} events elided …`);
for (const line of run1.retell.slice(-6)) console.log(`   ${line}`);

console.log('\n## B. ARCS EXIST');
console.log(`   landed events: ${run1.totalEvents}   stressor arcs: ${run1.stressorArcs}   governed births by class: ${JSON.stringify(run1.byClass)}`);
console.log(`   events per year: ${JSON.stringify(run1.perYear)}`);

console.log('\n## C. ARCS CONNECT (link-depth through the receipted cause graph)');
console.log(`   chained events (citing an upstream world_stressor): ${run1.chainedEvents}`);
console.log(`   link-depth histogram (depth: events): ${JSON.stringify(Object.fromEntries(run1.depthCounts.map((n, d) => [d, n]).filter(([, n]) => n)))}`);
console.log(`   max link depth: ${run1.maxLinkDepth}`);

console.log('\n## D. NARRATES IDENTICALLY (same seed, second full walkthrough)');
console.log(`   run 1 retell sha256: ${run1.retellHash.slice(0, 16)}…`);
console.log(`   run 2 retell sha256: ${run2.retellHash.slice(0, 16)}…`);

console.log('\n## E. NEVER CONTRADICTS');
console.log(`   dangling cause citations (event cites a stressor never alive): ${run1.danglingCitations}   ← must be 0`);
console.log(`   news entries checked: ${run1.newsChecked}   naming out-of-realm settlements: ${run1.newsViolations}   ← must be 0`);

// ── assertions (floors measured 2026-07-21, set generously BELOW measurement) ─
const failures = [];
const assertFloor = (label, actual, ok) => { if (!ok) failures.push(`${label} (got ${JSON.stringify(actual)})`); };

assertFloor('arcs exist: >= 300 landed events over the decade', run1.totalEvents, run1.totalEvents >= 300);
// Measured 2 classes on this fixture (succession_coup-dominant — the cacophony
// soak's honesty note documents the same shape); the floor guards collapse-to-one.
assertFloor('arcs exist: >= 2 governed drama classes birth', Object.keys(run1.byClass).length, Object.keys(run1.byClass).length >= 2);
assertFloor('arcs exist: >= 8 stressor arcs across the decade', run1.stressorArcs, run1.stressorArcs >= 8);
assertFloor('no silent year (every year lands >= 1 event)', run1.perYear, run1.perYear.every((n) => n > 0));
assertFloor('arcs connect: >= 20 chained events cite an upstream arc', run1.chainedEvents, run1.chainedEvents >= 20);
assertFloor('arcs connect: link-depth reaches >= 2 (consequence chains actually form)', run1.maxLinkDepth, run1.maxLinkDepth >= 2);
assertFloor('never contradicts: 0 dangling cause citations', run1.danglingCitations, run1.danglingCitations === 0);
assertFloor('never contradicts: 0 out-of-realm news settlements', run1.newsViolations, run1.newsViolations === 0);
assertFloor('news surface is non-vacuous (> 50 entries survive the decade)', run1.newsChecked, run1.newsChecked > 50);
assertFloor('narrates identically: same-seed retells hash identically', run2.retellHash, run1.retellHash === run2.retellHash);

if (failures.length) {
  console.log(`\nSTORY CENSUS: FAIL — ${failures.length} violation(s):`);
  for (const f of failures) console.log(`   ✗ ${f}`);
  process.exitCode = 1;
} else {
  console.log('\nSTORY CENSUS: PASS — arcs exist, connect, narrate identically, and never contradict.');
}
