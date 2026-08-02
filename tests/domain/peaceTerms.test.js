/**
 * peaceTerms.test.js — W-PEACE-2 THE PRICE OF PEACE battery
 * (DESIGN_PEACE_ENGINE.md §11 term catalog, §12 compliance, §13 composability,
 * §15 prize ranking + term limits).
 *
 * THE BATTERY (the wave brief, verbatim):
 *   - term-catalog pins: each term type — mint + execute + expire + a negative control.
 *   - prize-ranking pin: the victor demands what IT values from what THEY have,
 *     with a DECEPTION case (a fog-deceived victor misprices — belief, not truth).
 *   - duration-cap structural pin: a term without expiresTick is unrepresentable.
 *   - compliance/fog pin: a cheated distant victor sees 'honored' over a true breach.
 *   - treaty_default feed pin: a detected default MINTS the warReasons casus
 *     (closing W-PEACE-1's registration seam).
 *
 * The pins drive the pure functions + the mover directly (deterministic, non-
 * flaky) rather than depending on a full sim reaching sue-for-peace.
 */

import { describe, it, expect } from 'vitest';

import {
  advanceTreaties, termBudgetFor, resolveVictor, believedAdvantage,
  appraiseLoserPortfolio, draftTerms, evolveCompliance, alignmentPress,
  treatiesForPair, demilitarizationCapFor, treatyBlocksWar, occupationHoldFor, treatyPairKey,
  termLabel, TERM_CATALOG, TERM_TYPES, TERM_FAMILIES, PEACE_TERMS_TUNING,
} from '../../src/domain/worldPulse/peaceTerms.js';
import { repudiateTreaty } from '../../src/domain/worldPulse/treatyBreach.js';
import { TREATY_TRANSFER_TUNING } from '../../src/domain/worldPulse/treatyTransfer.js';
import { TREATY_ENFORCEMENT_TUNING } from '../../src/domain/worldPulse/treatyEnforcement.js';
import { advanceWarReasons, warReasonsFor } from '../../src/domain/worldPulse/warReasons.js';
import { GOVERNING_SEAT_KEY } from '../../src/domain/worldPulse/beliefMap.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';

const LIT = { warLayerEnabled: true, peaceEngineEnabled: true };

/** A snapshot item with enough texture for settlementStrength + archetype/exports.
 *  `storageMonths` null ⇒ NO food model at all (the "nothing to levy" negative control);
 *  a number materializes a real granary the treaty's stream terms can actually draw on. */
function item(id, { tier = 'town', population = 1800, category = 'military', exports = [], patron = null, storageMonths = null } = {}) {
  return {
    id, name: id.charAt(0).toUpperCase() + id.slice(1),
    settlement: {
      name: id, tier, population,
      config: { tradeRouteAccess: 'road', priorityMilitary: 35, ...(patron ? { primaryDeitySnapshot: patron } : {}) },
      // A State Granary gives both parties a REAL 8-month storage ceiling
      // (foodStockpile.storageCapacityMonths), so a levy has headroom to land in and the
      // applicator's capacity clamp is not what the pins are secretly measuring.
      institutions: storageMonths == null ? [] : [{ name: 'State Granary', type: 'economic' }],
      economicState: {
        prosperity: 'Prosperous', primaryExports: exports, primaryImports: [],
        ...(storageMonths == null ? {} : { foodSecurity: { storageMonths, dailyNeed: 100, dailyProduction: 100, deficitPct: 0, surplusPct: 0, resilienceScore: 50 } }),
      },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ faction: `${category} seat`, category, power: 78, isGoverning: true }],
        conflicts: [],
      },
      npcs: [], activeConditions: [],
    },
  };
}

const deity = (ref, align) => ({ _deityRef: ref, name: ref, alignmentAxis: align, lawAxis: 'neutral', rankAxis: 'major' });

function snapshotFor(items, edges = []) {
  return { byId: new Map(items.map((i) => [String(i.id), i])), regionalGraph: { edges } };
}

const edge = (from, to, type = 'hostile') => ({ id: `edge.${from}.${to}`, from, to, relationshipType: type });

/** A lit world where the war between attacker↔target has JUST ended by a
 *  negotiated peace: the edge has de-escalated off 'hostile' and carries a fresh
 *  'sue_for_peace' incident (the durable signal advanceTreaties mints on). */
function suingWorld(attacker, target, tick, extra = {}) {
  const key = `edge.${attacker}.${target}`;
  return {
    tick,
    simulationRules: { ...LIT },
    calendar: { elapsedWeeks: 30 },
    deployments: {},
    warExhaustion: { [attacker]: 0.7, [target]: 0.8 },
    relationshipStates: {
      [key]: {
        relationshipType: 'cold_war', resentment: 0.6, trust: 0.1, lastTransitionTick: tick,
        recentIncidents: [{ tick, type: 'strategy_sue_for_peace', outcomeId: `candidate.strategy.sue_for_peace.${attacker}.${tick}` }],
      },
    },
    ...extra,
  };
}

// ── A) SUBSTRATE + CATALOG ───────────────────────────────────────────────────

describe('W-PEACE-2 catalog + substrate', () => {
  it('the term catalog is total, typed, and every spec is well-formed', () => {
    expect(TERM_TYPES.length).toBeGreaterThanOrEqual(9);
    for (const type of TERM_TYPES) {
      const spec = TERM_CATALOG[type];
      expect(spec, `${type} has a spec`).toBeTruthy();
      expect(TERM_FAMILIES).toContain(spec.family);
      expect(spec.weight).toBeGreaterThan(0);
      expect(spec.maxYears).toBeGreaterThanOrEqual(spec.baseYears);
      expect(['transfer', 'overlay', 'readiness_cap', 'war_block', 'occupation_hold', 'seam']).toContain(spec.executor);
    }
  });

  it('resolveVictor: the believed-stronger party is the victor; a tie breaks codepoint-stable', () => {
    const items = [item('iron', { tier: 'city', population: 60000 }), item('weak', { tier: 'village', population: 280 })];
    const snap = snapshotFor(items, [edge('iron', 'weak')]);
    const ws = { simulationRules: { ...LIT } };
    const truthFor = (id) => (id === 'iron' ? 0.8 : 0.35);
    const r = resolveVictor('iron', 'weak', ws, truthFor);
    expect(r.victorId).toBe('iron');
    expect(r.loserId).toBe('weak');
    expect(r.believedMargin).toBeCloseTo(0.45, 5);
    // Exact tie ⇒ codepoint tiebreak (dormant-belief parity).
    const flat = resolveVictor('b', 'a', ws, () => 0.5);
    expect(flat.victorId).toBe('a');
  });

  it('termBudgetFor: parity is a WHITE PEACE (zero budget); a clear margin buys a budget that scales', () => {
    expect(termBudgetFor(0.02).whitePeace).toBe(true);
    expect(termBudgetFor(0.02).budget).toBe(0);
    const modest = termBudgetFor(0.15);
    const crushing = termBudgetFor(0.5);
    expect(modest.whitePeace).toBe(false);
    expect(modest.budget).toBeGreaterThan(0);
    expect(crushing.budget).toBeGreaterThan(modest.budget);
    expect(crushing.budget).toBeLessThanOrEqual(PEACE_TERMS_TUNING.BUDGET_MAX);
  });

  it('alignmentPress: a good-aligned victor asks light, an evil one presses hard', () => {
    const good = alignmentPress(item('saint', { patron: deity('Dawn', 'good') }));
    const evil = alignmentPress(item('tyrant', { patron: deity('Maw', 'evil') }));
    expect(evil).toBeGreaterThan(good);
  });
});

// ── B) PRIZE RANKING (§15.1) + THE DECEPTION CASE ───────────────────────────

describe('W-PEACE-2 prize ranking — the victor asks for what IT values (with fog)', () => {
  const loser = item('weak', { tier: 'village', population: 280, exports: [{ name: 'Silver' }] });

  function appraiseAs(victor, ws = { simulationRules: { ...LIT } }, loserTruth = 0.4) {
    return appraiseLoserPortfolio({
      victorId: 'v', loserId: 'weak', worldState: ws,
      victorItem: victor, loserItem: loser,
      victorPressure: { food: 0.6, economy: 0.6, trade: 0.2 }, // an economically-strained victor
      victorThreat01: 0.6, loserTruthStrength: loserTruth, loserAllyStrength01: 0.4,
    });
  }

  it('a MERCHANT victor ranks economic extraction above a MILITARY victor does', () => {
    const merchant = appraiseAs(item('v', { category: 'merchant' }));
    const military = appraiseAs(item('v', { category: 'military' }));
    const econOf = (list) => Math.max(...list.filter((a) => a.termType === 'resource_share' || a.termType === 'tribute').map((a) => a.value));
    const milOf = (list) => Math.max(...list.filter((a) => a.termType === 'demilitarization' || a.termType === 'occupation_continuation').map((a) => a.value));
    expect(econOf(merchant)).toBeGreaterThan(econOf(military));
    expect(milOf(military)).toBeGreaterThan(milOf(merchant));
  });

  it('the ranking names what the victor wants: an export-scarce merchant beside an ally-poor loser tops resource_share on the named good', () => {
    // An ally-POOR loser (0.1) ⇒ its friends are no prize; the silver is.
    const ranked = appraiseLoserPortfolio({
      victorId: 'v', loserId: 'weak', worldState: { simulationRules: { ...LIT } },
      victorItem: item('v', { category: 'merchant' }), loserItem: loser,
      victorPressure: { food: 0.6, economy: 0.6, trade: 0.2 },
      victorThreat01: 0.3, loserTruthStrength: 0.5, loserAllyStrength01: 0.1,
    });
    const top = ranked[0];
    expect(['resource_share', 'tribute']).toContain(top.termType);
    const share = ranked.find((a) => a.termType === 'resource_share');
    expect(share?.good).toBe('Silver'); // it was always the silver they wanted
  });

  it('DECEPTION (§15.1): a fog-deceived victor misprices — over-estimating the foe UNDER-values the prize', () => {
    // Truth: the loser is weak (0.4). Belief: the victor's court believes it STRONG
    // (band 4 ⇒ ~0.9), so the believed advantage collapses and the ask shrinks.
    const foggedWs = {
      simulationRules: { ...LIT, infoMode: 'full' }, spatialCanonVersion: 1,
      spatialLedgers: { beliefMaps: { v: { [GOVERNING_SEAT_KEY]: { weak: { readiness: 0.8, strengthBand: 4, allianceLabel: 'hostile', faithLabel: null, confidence01: 0.8, lastUpdateTick: 9 } } } } },
    };
    const truthRank = appraiseAs(item('v', { category: 'merchant' }));
    const fogRank = appraiseAs(item('v', { category: 'merchant' }), foggedWs);
    const treasuryTruth = truthRank.find((a) => a.assetClass === 'treasury')?.value || 0;
    const treasuryFog = fogRank.find((a) => a.assetClass === 'treasury')?.value || 0;
    // The believed-richer-foe fog INFLATES the perceived wealth ⇒ the appraisal moves.
    expect(treasuryFog).not.toBe(treasuryTruth);
    // And the BUDGET the fog mints diverges from the truth budget (the misprice).
    const truthMargin = believedAdvantage('v', 'weak', { simulationRules: { ...LIT } }, (id) => (id === 'v' ? 0.75 : 0.4));
    const fogMargin = believedAdvantage('v', 'weak', foggedWs, (id) => (id === 'v' ? 0.75 : 0.4));
    expect(termBudgetFor(fogMargin).budget).toBeLessThan(termBudgetFor(truthMargin).budget);
  });
});

// ── C) DURATION-CAP STRUCTURAL PIN (§15.2) ──────────────────────────────────

describe('W-PEACE-2 duration caps — perpetual extraction is structurally unrepresentable', () => {
  it('draftTerms: EVERY term carries an expiresTick strictly after mint and within its hard ceiling', () => {
    const ranked = [
      { assetClass: 'treasury', termType: 'tribute', value: 0.9 },
      { assetClass: 'military_posture', termType: 'demilitarization', value: 0.8 },
      { assetClass: 'security', termType: 'non_aggression', value: 0.7 },
    ];
    const { terms } = draftTerms({ ranked, budget: 3.0, margin01: 1.0, press: 1.4, tick: 100 });
    expect(terms.length).toBeGreaterThan(0);
    for (const t of terms) {
      expect(Number.isFinite(t.expiresTick), `${t.type} has a finite expiresTick`).toBe(true);
      expect(t.expiresTick, `${t.type} expires strictly after mint`).toBeGreaterThan(t.mintedTick);
      const capTicks = TERM_CATALOG[t.type].maxYears * PEACE_TERMS_TUNING.TICKS_PER_YEAR;
      expect(t.expiresTick - t.mintedTick, `${t.type} within its hard ceiling`).toBeLessThanOrEqual(capTicks);
      expect(t.complianceState).toBe('honored');
    }
  });

  it('draftTerms: budget is respected and no family/type stacks twice (§13)', () => {
    const ranked = TERM_TYPES.map((termType, i) => ({ assetClass: 'x', termType, value: 1 - i * 0.01 }));
    const { terms, budgetSpent } = draftTerms({ ranked, budget: 3.0, margin01: 0.6, press: 1.0, tick: 0 });
    expect(budgetSpent).toBeLessThanOrEqual(3.0 + 1e-6);
    expect(terms.length).toBeLessThanOrEqual(PEACE_TERMS_TUNING.TOP_ASSETS);
    expect(new Set(terms.map((t) => t.type)).size).toBe(terms.length);
    expect(new Set(terms.map((t) => t.family)).size).toBe(terms.length);
  });

  it('a longer term SPENDS MORE of the same budget (§15.2 — victors trade breadth against length)', () => {
    const ranked = [{ assetClass: 'treasury', termType: 'tribute', value: 0.9 }];
    const short = draftTerms({ ranked, budget: 3.0, margin01: 0.2, press: 0.6, tick: 0 }).terms[0];
    const long = draftTerms({ ranked, budget: 3.0, margin01: 1.0, press: 1.4, tick: 0 }).terms[0];
    expect(long.expiresTick).toBeGreaterThan(short.expiresTick);
    expect(long.weightSpent).toBeGreaterThan(short.weightSpent);
  });
});

// ── D) COMPLIANCE / FOG (§12) ────────────────────────────────────────────────

describe('W-PEACE-2 compliance under fog — a cheated distant victor', () => {
  it('evolveCompliance: capacity sets the TRUE state; a fog-blind victor OBSERVES honored over a true breach', () => {
    // A healthy loser + a watching victor: honored, seen honored.
    const seen = evolveCompliance({ loserCapacity01: 0.9, monitorReach01: 0.95 });
    expect(seen.trueState).toBe('honored');
    expect(seen.observedState).toBe('honored');
    // A strained loser + a watching victor: the strain is SEEN.
    const caught = evolveCompliance({ loserCapacity01: 0.3, monitorReach01: 0.95 });
    expect(caught.trueState).toBe('defaulted');
    expect(caught.observedState).toBe('defaulted');
    // A strained loser + a FOG-BLIND distant victor: the default GHOSTS — the
    // victor believes the treaty kept (§12.2 non-detection rewards the cheat).
    const cheated = evolveCompliance({ loserCapacity01: 0.3, monitorReach01: 0.2 });
    expect(cheated.trueState).toBe('defaulted');
    expect(cheated.observedState).toBe('honored');
  });
});

// ── E) TERM-CATALOG PINS via the mover: MINT · EXECUTE · EXPIRE · NEGATIVE ───

/** Run advanceTreaties once. `settlementUpdates` mirrors the kernel's pending per-settlement
 *  writes (the shape the food applicator folds onto), so the material executor has somewhere
 *  real to move grain to and from. */
function advance(worldState, items, edges, tick = worldState.tick, pIndex = null) {
  const settlementUpdates = items.map((i) => ({ saveId: String(i.id), settlement: i.settlement }));
  return advanceTreaties({ snapshot: snapshotFor(items, edges), worldState, settlementUpdates, graph: { edges }, pIndex, tick, now: '2026-01-01T00:00:00.000Z' });
}

describe('W-PEACE-2 mint — the sue-for-peace path mints a dictated treaty', () => {
  const items = [item('iron', { tier: 'city', population: 60000 }), item('weak', { tier: 'village', population: 280, exports: [{ name: 'Grain' }] })];
  const edges = [edge('iron', 'weak')];

  it('MINT: a fresh sue_for_peace recall mints a treaty with typed, duration-capped terms and a budget', () => {
    const ws = suingWorld('iron', 'weak', 5);
    const out = advance(ws, items, edges, 5);
    expect(out.changed).toBe(true);
    const ledger = getSpatialLedger(out.worldState, 'treaties');
    const treaty = ledger[treatyPairKey('iron', 'weak')];
    expect(treaty, 'iron dictates the peace over weak').toBeTruthy();
    expect(treaty.victorId).toBe('iron');
    expect(treaty.loserId).toBe('weak');
    expect(treaty.parties).toEqual(['iron', 'weak']);
    expect(treaty.terms.length).toBeGreaterThan(0);
    expect(treaty.budgetSpent).toBeLessThanOrEqual(treaty.budgetGranted + 1e-6);
    for (const t of treaty.terms) expect(t.expiresTick).toBeGreaterThan(t.mintedTick);
    const signingBeat = out.newsEntries.find((entry) => entry.kind === 'treaty_signed');
    expect(signingBeat).toBeTruthy();
    for (const term of treaty.terms) expect(signingBeat.summary).toContain(termLabel(term.type));
    expect(signingBeat.reasons).toHaveLength(treaty.terms.length);
    expect([signingBeat.summary, ...signingBeat.reasons].join(' '))
      // anchored: named terms and exact reason cardinality above prove the signing projection is live.
      .not.toMatch(/\b\d+(?:\.\d+)?\b|%|×|\b(?:budget|score|multiplier|roll|weight)\b/i);
    expect(typeof treaty.budgetSpent).toBe('number');
    expect(typeof treaty.budgetGranted).toBe('number');
  });

  it('NEGATIVE: dormant gate ⇒ no treaty, byte-identical', () => {
    const ws = { ...suingWorld('iron', 'weak', 5), simulationRules: { warLayerEnabled: true } }; // peaceEngineEnabled ABSENT
    const out = advance(ws, items, edges, 5);
    expect(out.changed).toBe(false);
    expect(out.worldState).toBe(ws);
    expect(getSpatialLedger(out.worldState, 'treaties')).toBeUndefined();
  });

  it('NEGATIVE: an edge STILL hostile (the war has not ended) ⇒ no treaty', () => {
    const ws = suingWorld('iron', 'weak', 5);
    ws.relationshipStates['edge.iron.weak'].relationshipType = 'hostile';
    const out = advance(ws, items, edges, 5);
    expect(getSpatialLedger(out.worldState, 'treaties')).toBeUndefined();
  });

  it('NEGATIVE: a de-escalation with NO sue-for-peace incident (a plain diplomatic thaw) ⇒ no treaty', () => {
    const ws = suingWorld('iron', 'weak', 5);
    ws.relationshipStates['edge.iron.weak'].recentIncidents = [{ tick: 5, type: 'trade_accord' }];
    const out = advance(ws, items, edges, 5);
    expect(getSpatialLedger(out.worldState, 'treaties')).toBeUndefined();
  });

  it('NEGATIVE: a STALE sue-for-peace incident (outside the mint window) does not mint', () => {
    const ws = suingWorld('iron', 'weak', 20);
    ws.relationshipStates['edge.iron.weak'].recentIncidents = [{ tick: 5, type: 'strategy_sue_for_peace' }]; // 15 ticks old
    const out = advance(ws, items, edges, 20);
    expect(getSpatialLedger(out.worldState, 'treaties')).toBeUndefined();
  });

  it('NEGATIVE (white peace): between believed EQUALS no extractive treaty materializes', () => {
    const equals = [item('iron', { tier: 'town', population: 1800 }), item('twin', { tier: 'town', population: 1800 })];
    const ws = suingWorld('iron', 'twin', 5);
    const out = advance(ws, equals, [edge('iron', 'twin')], 5);
    expect(getSpatialLedger(out.worldState, 'treaties')).toBeUndefined();
  });

  it('EXECUTE (compelled alliance): an ally-rich loser + a warlord victor nudges the relationship overlay', () => {
    // weak has a friend (mid) ⇒ its alliance network is a prize a warlord compels.
    const trio = [
      item('iron', { tier: 'city', population: 60000, category: 'military' }),
      item('weak', { tier: 'village', population: 280 }),
      item('mid', { tier: 'town', population: 2000 }),
    ];
    const trioEdges = [edge('iron', 'weak'), edge('weak', 'mid', 'trade_partner')];
    const ws = suingWorld('iron', 'weak', 5);
    const out = advance(ws, trio, trioEdges, 5);
    const treaty = getSpatialLedger(out.worldState, 'treaties')[treatyPairKey('iron', 'weak')];
    const compelled = treaty.terms.find((t) => t.type === 'compelled_alliance');
    expect(compelled, 'the warlord compels the ally-rich loser\'s banner').toBeTruthy();
    // The overlay nudge (the E1c overture lane) landed on the REAL loser→victor edge.
    const rel = out.worldState.relationshipStates['edge.iron.weak'];
    expect(rel, 'the compelled-alliance overlay nudge wrote the real edge').toBeTruthy();
    expect(rel.resentment).toBeGreaterThan(0); // compelled loyalty is resented
  });
});

// ── D2) EXECUTE + EXPIRE via a pre-built ledger (deterministic per-term) ─────

/** Build a treaty-ledger world directly (the advance path — no mint). */
function ledgerWorld(treaty, extra = {}) {
  return {
    tick: 10,
    simulationRules: { ...LIT },
    calendar: { elapsedWeeks: 30 },
    deployments: {},
    relationshipStates: {},
    spatialLedgers: { treaties: { [treatyPairKey(treaty.victorId, treaty.loserId)]: treaty } },
    ...extra,
  };
}

function term(type, patch = {}) {
  const spec = TERM_CATALOG[type];
  const t = {
    type, family: spec.family, magnitude: 0.4, mintedTick: 0, expiresTick: 100,
    weightSpent: spec.weight, complianceState: 'honored', trueState: 'honored', burden01: 0,
    receipt: `${type} term`, ...patch,
  };
  if (spec.stream) { t.deliveredToVictor = t.deliveredToVictor ?? 0; t.extractedFromLoser = t.extractedFromLoser ?? 0; }
  if (spec.executor === 'seam') t.seam = true;
  return t;
}

function treatyOf(terms, patch = {}) {
  return { parties: ['iron', 'weak'], victorId: 'iron', loserId: 'weak', mintedTick: 0, believedMarginAtSignature: 0.35, budgetGranted: 3, budgetSpent: 1, complianceState: 'honored', terms, receipts: ['pin'], ...patch };
}

const IW = [item('iron', { tier: 'city', population: 60000 }), item('weak', { tier: 'village', population: 280 })];
const IW_EDGES = [edge('iron', 'weak')];

// The FED pair — the same two courts, each with a REAL granary, so the material
// executor has stock to move. The victor starts near-empty (headroom to receive) and
// the loser well above the reserve floor (something to give).
//
// POPULATIONS ARE LOAD-BEARING, and the reason is the conserved sink itself. The
// transfer moves ABSOLUTE food and re-expresses it in the recipient's own months
// (÷ its population), then FLOORS to the tenth-month. So a big victor levying a tiny
// loser really does receive an unmeasurable trickle — the beaten village's whole
// tribute is a rounding error in a metropolis's granary. That is honest physics, not
// a defect, but it means a fixture must give the PAYER the larger population for the
// credit leg to clear the tenth-month floor at all. A populous beaten city paying a
// smaller victor is the case where tribute is actually felt.
const VICTOR_MONTHS = 1;
const LOSER_MONTHS = 6;
const VICTOR_POP = 1500;
const LOSER_POP = 6000;
const FED = [
  item('iron', { tier: 'town', population: VICTOR_POP, storageMonths: VICTOR_MONTHS }),
  item('weak', { tier: 'city', population: LOSER_POP, storageMonths: LOSER_MONTHS }),
];
/** The payer/payee granary months out of an advanceTreaties result. */
const monthsIn = (out, id) => (out.settlementUpdates || [])
  .find((u) => u.saveId === id)?.settlement?.economicState?.foodSecurity?.storageMonths;

describe('W-PEACE-2 executors — each landed term executes and expires', () => {
  it('EXECUTE (streams): every stream term moves REAL granary months out of the payer and into the payee, conserved', () => {
    for (const type of ['tribute', 'resource_share', 'reparations', 'restitution']) {
      const ws = ledgerWorld(treatyOf([term(type, { magnitude: 0.3, expiresTick: 100 })]));
      const out = advance(ws, FED, IW_EDGES, 10);
      const t = getSpatialLedger(out.worldState, 'treaties')[treatyPairKey('iron', 'weak')].terms.find((x) => x.type === type);
      // QUANTITY OUT — the loser's granary actually shrank.
      const loserMonths = monthsIn(out, 'weak');
      const victorMonths = monthsIn(out, 'iron');
      expect(t.extractedFromLoser, `${type} debited the loser`).toBeGreaterThan(0);
      expect(loserMonths, `${type}: the payer's granary fell`).toBeLessThan(LOSER_MONTHS);
      // QUANTITY IN — the victor's granary actually grew.
      expect(t.deliveredToVictor, `${type} credited the victor`).toBeGreaterThan(0);
      expect(victorMonths, `${type}: the payee's granary rose`).toBeGreaterThan(VICTOR_MONTHS);
      // The ledger's own counters agree with the world's granaries (no parallel truth).
      expect(t.extractedFromLoser, `${type}: the debit counter is the real loss`).toBeCloseTo(LOSER_MONTHS - loserMonths, 6);
      expect(t.deliveredToVictor, `${type}: the credit counter is the real gain`).toBeCloseTo(victorMonths - VICTOR_MONTHS, 6);
      // CONSERVED — a transfer, never a mint. Absolute food (months x population) gained
      // can never exceed absolute food lost; the gap is the road's spoilage (the sink).
      const lost = (LOSER_MONTHS - loserMonths) * LOSER_POP;
      const gained = (victorMonths - VICTOR_MONTHS) * VICTOR_POP;
      expect(gained, `${type}: absolute food is never minted`).toBeLessThanOrEqual(lost + 1e-9);
    }
  });

  it('NEGATIVE (no granary): a payer with NO food model moves nothing — the ledger records a zero stream', () => {
    // IW carries no foodSecurity at all. The term is live and compliant; there is simply
    // nothing to levy, so no phantom quantity is invented on either side.
    const ws = ledgerWorld(treatyOf([term('tribute', { magnitude: 0.3, expiresTick: 100 })]));
    const out = advance(ws, IW, IW_EDGES, 10);
    const t = getSpatialLedger(out.worldState, 'treaties')[treatyPairKey('iron', 'weak')].terms.find((x) => x.type === 'tribute');
    expect(t.extractedFromLoser).toBe(0);
    expect(t.deliveredToVictor).toBe(0);
  });

  it('NEGATIVE (at the reserve floor): a payer whose granary sits at the untouchable reserve delivers nothing', () => {
    const starving = [
      item('iron', { tier: 'town', population: VICTOR_POP, storageMonths: VICTOR_MONTHS }),
      item('weak', { tier: 'city', population: LOSER_POP, storageMonths: TREATY_TRANSFER_TUNING.RESERVE_MONTHS }),
    ];
    const ws = ledgerWorld(treatyOf([term('tribute', { magnitude: 0.3, expiresTick: 100 })]));
    const out = advance(ws, starving, IW_EDGES, 10);
    const t = getSpatialLedger(out.worldState, 'treaties')[treatyPairKey('iron', 'weak')].terms.find((x) => x.type === 'tribute');
    expect(t.extractedFromLoser, 'a court at its reserve floor pays nothing').toBe(0);
    // …and the tick is COMPLETELY inert: no granary write at all, so the reserve is
    // untouched by construction rather than by a delta that happened to round to zero.
    expect(out.changed, 'a floored payer produces no change whatsoever').toBe(false);
    expect(out.settlementUpdates, 'and no settlement write is emitted').toBeUndefined();
  });

  it('NEGATIVE (expired): a term past its expiresTick draws no installment before it lapses', () => {
    const ws = ledgerWorld(treatyOf([
      term('tribute', { magnitude: 0.3, expiresTick: 5 }),          // already lapsed at tick 10
      term('non_aggression', { expiresTick: 100 }),                  // keeps the treaty alive to inspect
    ]));
    const out = advance(ws, FED, IW_EDGES, 10);
    expect(monthsIn(out, 'weak'), 'an expired tribute draws nothing').toBe(LOSER_MONTHS);
    expect(monthsIn(out, 'iron'), 'and credits nothing').toBe(VICTOR_MONTHS);
    const terms = getSpatialLedger(out.worldState, 'treaties')[treatyPairKey('iron', 'weak')].terms;
    expect(terms.some((x) => x.type === 'tribute'), 'and the lapsed term is gone').toBe(false);
  });

  it('EXECUTE (demilitarization): the cap is queryable while live and lifts after expiry', () => {
    const ws = ledgerWorld(treatyOf([term('demilitarization', { magnitude: 0.5, expiresTick: 100 })]));
    expect(demilitarizationCapFor(ws, 'weak', 10)).toBe(0.5);
    expect(demilitarizationCapFor(ws, 'weak', 200)).toBeNull(); // past expiry ⇒ unbound
  });

  it('EXECUTE (non_aggression): the war-block holds while live, lifts after expiry, and lifts on default', () => {
    const live = ledgerWorld(treatyOf([term('non_aggression', { expiresTick: 100 })]));
    expect(treatyBlocksWar(live, 'iron', 'weak', 10)).toBe(true);
    expect(treatyBlocksWar(live, 'iron', 'weak', 200)).toBe(false);
    const repudiated = ledgerWorld(treatyOf([term('non_aggression', { expiresTick: 100 })], { complianceState: 'defaulted' }));
    expect(treatyBlocksWar(repudiated, 'iron', 'weak', 10)).toBe(false);
  });

  it('EXECUTE (seam terms): puppet_seat + disclosure mint as typed registration seams (inert, recorded), not crashes', () => {
    const ws = ledgerWorld(treatyOf([term('puppet_seat', { expiresTick: 100 }), term('disclosure', { expiresTick: 100, family: 'informational' })]));
    const out = advance(ws, IW, IW_EDGES, 10);
    const terms = getSpatialLedger(out.worldState, 'treaties')[treatyPairKey('iron', 'weak')].terms;
    expect(terms.find((t) => t.type === 'puppet_seat')?.seam).toBe(true);
    expect(terms.find((t) => t.type === 'disclosure')?.seam).toBe(true);
  });

  it('EXPIRE: a term past its expiresTick lapses; an emptied treaty is pruned and the ledger drops', () => {
    const ws = ledgerWorld(treatyOf([term('tribute', { expiresTick: 5 })])); // already past at tick 10
    const out = advance(ws, IW, IW_EDGES, 10);
    expect(out.changed).toBe(true);
    expect(getSpatialLedger(out.worldState, 'treaties'), 'the spent treaty is pruned; drop-when-empty').toBeUndefined();
  });

  it('EXECUTE (occupation_continuation): the hold is recorded and survives while live, lapses at expiry', () => {
    const live = ledgerWorld(treatyOf([term('occupation_continuation', { expiresTick: 100 })]));
    const out = advance(live, IW, IW_EDGES, 10);
    expect(getSpatialLedger(out.worldState, 'treaties')[treatyPairKey('iron', 'weak')].terms.some((t) => t.type === 'occupation_continuation')).toBe(true);
    const expired = ledgerWorld(treatyOf([term('occupation_continuation', { expiresTick: 5 })]));
    const out2 = advance(expired, IW, IW_EDGES, 10);
    expect(getSpatialLedger(out2.worldState, 'treaties')).toBeUndefined();
  });
});

// ── E) WR-0c DELIBERATE REPUDIATION ─────────────────────────────────────────

describe('WR-0c deliberate treaty breach — one verdict, every effect lifted', () => {
  it('defaults every live promise idempotently, preserves the broken shell, mints casus, then prunes at the original horizon', () => {
    const source = ledgerWorld(treatyOf([
      term('non_aggression', { expiresTick: 40 }),
      term('tribute', { expiresTick: 30, deliveredToVictor: 2, extractedFromLoser: 3 }),
      term('demilitarization', { expiresTick: 35, magnitude: 0.6 }),
      term('occupation_continuation', { expiresTick: 25 }),
    ]), { tick: 10 });

    const breached = repudiateTreaty(source, { fromId: 'iron', toId: 'weak', tick: 10 });
    expect(breached.ok).toBe(true);
    const treaty = getSpatialLedger(breached.worldState, 'treaties')[treatyPairKey('iron', 'weak')];
    expect(treaty).toMatchObject({
      complianceState: 'defaulted', defaultedBy: 'iron', defaultSeverity01: 1,
      breachType: 'repudiation', repudiatedTick: 10, breachExpiresTick: 40,
    });
    expect(treaty.terms.every((t) => t.complianceState === 'defaulted' && t.trueState === 'defaulted' && t.expiresTick === 10)).toBe(true);
    expect(treaty.terms.map((t) => t.repudiatedExpiresTick).sort((a, b) => a - b)).toEqual([25, 30, 35, 40]);

    expect(treatyBlocksWar(breached.worldState, 'iron', 'weak', 10)).toBe(false);
    expect(demilitarizationCapFor(breached.worldState, 'weak', 10)).toBeNull();
    expect(occupationHoldFor(breached.worldState, 'weak', 'iron', 10)).toBe(false);

    const repeated = repudiateTreaty(breached.worldState, { fromId: 'iron', toId: 'weak', tick: 10 });
    expect(repeated.ok).toBe(false);
    expect(repeated.code).toBe('treaty_breach_no_live_nap');
    expect(repeated.worldState).toBe(breached.worldState);

    const held = advance(breached.worldState, FED, IW_EDGES, 11);
    expect(held.changed).toBe(false);
    expect(held.worldState).toBe(breached.worldState);
    expect(held.settlementUpdates).toBeUndefined();
    const casus = advanceWarReasons({
      snapshot: snapshotFor(FED, IW_EDGES), worldState: held.worldState,
      graph: { edges: IW_EDGES }, pIndex: null, tick: 11,
    });
    expect(warReasonsFor(casus.worldState, 'weak', 'iron')?.reasons?.treaty_default?.score).toBe(1);

    const spent = advance(breached.worldState, FED, IW_EDGES, 40);
    expect(getSpatialLedger(spent.worldState, 'treaties')).toBeUndefined();
  });

  it('invalid parties and a world with no live NAP leave no residue', () => {
    const noNap = ledgerWorld(treatyOf([term('tribute', { expiresTick: 40 })]));
    for (const args of [{ fromId: 'iron', toId: 'iron', tick: 10 }, { fromId: 'iron', toId: 'weak', tick: 10 }]) {
      const out = repudiateTreaty(noNap, args);
      expect(out.ok).toBe(false);
      expect(out.worldState).toBe(noNap);
      expect(getSpatialLedger(out.worldState, 'treaties')).toEqual(getSpatialLedger(noNap, 'treaties'));
    }
  });
});

// ── F) THE TREATY_DEFAULT FEED — closing W-PEACE-1's registration seam ───────

describe('W-PEACE-2 treaty_default feed — a detected default mints the war reason (§12.4)', () => {
  it('a defaulted treaty (defaultedBy = loser) makes warReasons mint a treaty_default casus for the victor against the loser', () => {
    const items = [item('iron', { tier: 'city', population: 60000 }), item('weak', { tier: 'village', population: 280 })];
    const edges = [edge('iron', 'weak')];
    const defaulted = treatyOf(
      [term('tribute', { expiresTick: 100, complianceState: 'defaulted', trueState: 'defaulted' })],
      { complianceState: 'defaulted', defaultedBy: 'weak', defaultSeverity01: 0.7 },
    );
    const ws = ledgerWorld(defaulted, { tick: 20 });
    // Run the war-reason mover: it reads the treaties ledger for the default feed.
    const out = advanceWarReasons({ snapshot: snapshotFor(items, edges), worldState: ws, graph: { edges }, pIndex: null, tick: 20 });
    expect(out.changed).toBe(true);
    const ironCase = warReasonsFor(out.worldState, 'iron', 'weak');
    expect(ironCase, 'iron holds a case against the oathbreaker weak').toBeTruthy();
    expect(ironCase.reasons.treaty_default, 'the treaty default minted the casus (seam CLOSED)').toBeTruthy();
    expect(ironCase.reasons.treaty_default.score).toBeCloseTo(0.7, 5);
    // NEGATIVE: an HONORED treaty mints NO treaty_default casus.
    const honored = ledgerWorld(treatyOf([term('tribute', { expiresTick: 100 })]), { tick: 20 });
    const out2 = advanceWarReasons({ snapshot: snapshotFor(items, edges), worldState: honored, graph: { edges }, pIndex: null, tick: 20 });
    const honoredCase = warReasonsFor(out2.worldState, 'iron', 'weak');
    expect(honoredCase?.reasons?.treaty_default, 'an honored treaty is no casus').toBeFalsy();
  });
});
