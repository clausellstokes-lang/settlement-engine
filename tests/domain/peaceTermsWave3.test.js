/**
 * peaceTermsWave3.test.js — W-PEACE-3 TREATIES AS DOCUMENTS + COALITIONS AT THE
 * TABLE (DESIGN_PEACE_ENGINE.md §7 coalition/separate-exit, §13 composability +
 * legibility, §14.4 legibility of motive).
 *
 * THE BATTERY (the wave brief, verbatim):
 *   - document read-model pins: a fraying treaty names its weakest term; the
 *     structured document renders ledger facts; the irony brief gains the treaty
 *     line; the house-voice register guard (totality + register) holds.
 *   - coalition pins: joint vs peel, betrayal priced, the fracture feeds the
 *     coalition_fracture peace reason.
 *   - mediation pins: a named mediator, bounded budget softening, both-edge trust.
 *
 * The pins drive the pure functions + the mover directly (deterministic, non-
 * flaky) rather than depending on a full sim reaching sue-for-peace.
 */

import { describe, it, expect } from 'vitest';

import {
  advanceTreaties, treatyPairKey,
  coBesiegersOf, chooseCoalitionMode, fracturesAbandoning,
  treatyDocument, treatyDocumentsForSettlement, treatyFrayingSummary, frayingTermOf,
  findCrossPressuredMediator, termLabel,
  TERM_CATALOG, TERM_FAMILIES, PEACE_TERMS_TUNING,
} from '../../src/domain/worldPulse/peaceTerms.js';
import { CURRENT_TREATY_TICKS_PER_YEAR } from '../../src/domain/worldPulse/treatyClock.js';
import { advancePeaceReasons, warCausalBrief } from '../../src/domain/worldPulse/peaceReasons.js';
import {
  TREATY_COMPLIANCE_VOICE, TREATY_COMPLIANCE_FLOOR, treatyStrainLine,
  renderTreatyDocument, renderTreatiesForSettlement,
} from '../../src/domain/display/treatyDocument.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { migrateDispositionStats } from '../../src/domain/worldPulse/dispositionLedger.js';
import { fractureCredibilityDeltas } from '../../src/domain/worldPulse/informationStatecraft.js';

const LIT = { warLayerEnabled: true, peaceEngineEnabled: true };
const NOW = '2026-01-01T00:00:00.000Z';

/** A snapshot item with enough texture for settlementStrength + archetype/exports/patron. */
function item(id, { tier = 'town', population = 1800, category = 'military', exports = [], patron = null } = {}) {
  return {
    id, name: id.charAt(0).toUpperCase() + id.slice(1),
    settlement: {
      name: id, tier, population,
      config: { tradeRouteAccess: 'road', priorityMilitary: 35, ...(patron ? { primaryDeitySnapshot: patron } : {}) },
      institutions: [],
      economicState: { prosperity: 'Prosperous', primaryExports: exports, primaryImports: [] },
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
const edge = (from, to, type = 'hostile') => ({ id: `edge.${from}.${to}`, from, to, relationshipType: type });
function snapshotFor(items, edges = []) {
  return { byId: new Map(items.map((i) => [String(i.id), i])), regionalGraph: { edges } };
}
function advance(worldState, items, edges, tick = worldState.tick, pIndex = null) {
  return advanceTreaties({ snapshot: snapshotFor(items, edges), worldState, graph: { edges }, pIndex, tick, now: NOW });
}

/** A lit world where attacker↔target JUST de-escalated by a negotiated peace. */
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

// ── A) MEDIATION AT THE TABLE (§13) ──────────────────────────────────────────

describe('W-PEACE-3 mediation — a named broker softens the terms and earns trust both ways', () => {
  // Mid is a faith-brother of Iron (shared patron Dawn) and an alignment-kin of
  // Weak (different patron Dusk, same good alignment) — the cross-cut cleavage
  // that makes crossPressureMediation return crossPressured.
  const iron = item('iron', { tier: 'city', population: 60000, patron: deity('Dawn', 'good') });
  const weak = item('weak', { tier: 'village', population: 280, exports: [{ name: 'Grain' }], patron: deity('Dusk', 'good') });
  const mid = item('mid', { tier: 'town', population: 2200, patron: deity('Dawn', 'good') });
  const items = [iron, weak, mid];
  const mediatedEdges = [edge('iron', 'weak'), edge('iron', 'mid', 'trade_partner'), edge('weak', 'mid', 'trade_partner')];
  const bareEdges = [edge('iron', 'weak')];

  it('findCrossPressuredMediator: Mid, torn between Iron and Weak, is the broker', () => {
    const m = findCrossPressuredMediator(snapshotFor(items, mediatedEdges), { edges: mediatedEdges }, 'iron', 'weak');
    expect(m).toBeTruthy();
    expect(m.id).toBe('mid');
    // No broker when no third stands between the pair.
    expect(findCrossPressuredMediator(snapshotFor(items, bareEdges), { edges: bareEdges }, 'iron', 'weak')).toBeNull();
  });

  it('a mediated peace NAMES the mediator, softens the budget (bounded), and bumps trust on BOTH mediator edges', () => {
    const mediatedOut = advance(suingWorld('iron', 'weak', 5), items, mediatedEdges, 5);
    const bareOut = advance(suingWorld('iron', 'weak', 5), items, bareEdges, 5);
    const mediatedTreaty = getSpatialLedger(mediatedOut.worldState, 'treaties')[treatyPairKey('iron', 'weak')];
    const bareTreaty = getSpatialLedger(bareOut.worldState, 'treaties')[treatyPairKey('iron', 'weak')];

    // NAMED in the ledger + receipts.
    expect(mediatedTreaty.mediator).toEqual({ id: 'mid', name: 'Mid' });
    expect(mediatedTreaty.receipts.some((r) => /Brokered by Mid/.test(r))).toBe(true);
    expect(bareTreaty.mediator).toBeUndefined();

    // BOUNDED SOFTENING: the mediated budget is exactly (1 - MEDIATION_SOFTEN)×.
    expect(mediatedTreaty.budgetGranted).toBeCloseTo(bareTreaty.budgetGranted * (1 - PEACE_TERMS_TUNING.MEDIATION_SOFTEN), 4);
    expect(mediatedTreaty.budgetGranted).toBeLessThan(bareTreaty.budgetGranted);

    // BOTH-EDGE TRUST: the broker earns standing in both courts (E1 reactions).
    const rs = mediatedOut.worldState.relationshipStates;
    expect(rs['edge.iron.mid'].trust).toBeGreaterThan(0);
    expect(rs['edge.weak.mid'].trust).toBeGreaterThan(0);
    expect(rs['edge.iron.mid'].recentIncidents.some((i) => i.type === 'mediation')).toBe(true);
    expect(rs['edge.weak.mid'].recentIncidents.some((i) => i.type === 'mediation')).toBe(true);
  });

  it('applies the qualified mediator\'s diplomatic disposition once, then teaches the landed mediation once', () => {
    const dispositionEntry = (stock01) => {
      const entry = migrateDispositionStats({ mid: { wins: 0, losses: 0, score: 0 } }, 5).mid;
      entry.channels.diplomatic = {
        stock01,
        band: stock01 > 0.8 ? 'dominant' : stock01 < 0.2 ? 'restrained' : 'settled',
      };
      return entry;
    };
    const run = (stock01) => advance(suingWorld('iron', 'weak', 5, {
      simulationRules: { ...LIT, dispositionChannelsEnabled: true },
      dispositionStats: { mid: dispositionEntry(stock01) },
    }), items, mediatedEdges, 5);

    const eager = run(1);
    const neutral = run(0.5);
    const wary = run(0);
    const treatyOf = (result) => getSpatialLedger(result.worldState, 'treaties')[treatyPairKey('iron', 'weak')];
    expect(treatyOf(eager).budgetGranted).toBeLessThan(treatyOf(neutral).budgetGranted);
    expect(treatyOf(neutral).budgetGranted).toBeLessThan(treatyOf(wary).budgetGranted);
    expect(treatyOf(eager).receipts).toContain(
      'Kept agreements have taught this court confidence in parley.',
    );
    expect(eager.dispositionDeltas).toContainEqual({
      id: 'mid', channel: 'diplomatic', outcome: 'win', sourceKind: 'mediation_landed',
    });
    expect(eager.dispositionDeltas.filter((delta) => delta.id === 'mid')).toHaveLength(1);
  });
});

// ── B) COALITION NEGOTIATION + THE SEPARATE EXIT (§7) ────────────────────────

describe('W-PEACE-3 coalition mode — the §H-loaded joint-vs-peel read (deterministic)', () => {
  it('chooseCoalitionMode: no coalition ⇒ joint; worn + weak-tied ⇒ peel; fresh + close ⇒ joint', () => {
    expect(chooseCoalitionMode({ victorExhaustion01: 0.9, avgTie01: 0, coalitionSize: 1 }).mode).toBe('joint');
    expect(chooseCoalitionMode({ victorExhaustion01: 0.9, avgTie01: 0.0, coalitionSize: 2 }).mode).toBe('separate_exit');
    expect(chooseCoalitionMode({ victorExhaustion01: 0.0, avgTie01: 0.9, coalitionSize: 2 }).mode).toBe('joint');
  });

  it('coBesiegersOf: the other attackers sharing the loser as a target, codepoint-ordered', () => {
    const deployments = { iron: { targetId: 'weak' }, ally: { targetId: 'weak' }, bystander: { targetId: 'other' } };
    expect(coBesiegersOf(deployments, 'iron', 'weak')).toEqual(['ally']);
    expect(coBesiegersOf({}, 'iron', 'weak')).toEqual([]);
  });

  const iron = item('iron', { tier: 'city', population: 60000, category: 'military' });
  const weak = item('weak', { tier: 'village', population: 280, exports: [{ name: 'Grain' }] });
  const ally = item('ally', { tier: 'town', population: 4000, category: 'military' });
  const items = [iron, weak, ally];
  const edges = [edge('iron', 'weak'), edge('ally', 'weak'), edge('iron', 'ally', 'trade_partner')];

  /** iron + ally both besiege weak; iron de-escalates. tie sets the peel read. */
  function coalitionWorld(ironExhaustion, ironAllyTrust) {
    const ws = suingWorld('iron', 'weak', 5, {
      deployments: { iron: { targetId: 'weak' }, ally: { targetId: 'weak' } },
      warExhaustion: { iron: ironExhaustion, weak: 0.8, ally: 0.3 },
    });
    ws.relationshipStates['edge.iron.ally'] = { relationshipType: 'trade_partner', trust: ironAllyTrust, resentment: 0 };
    return ws;
  }

  it('JOINT: a fresh, tightly-tied coalition binds the loser jointly — roster + strength shares, no betrayal', () => {
    const out = advance(coalitionWorld(0.0, 0.9), items, edges, 5);
    const treaty = getSpatialLedger(out.worldState, 'treaties')[treatyPairKey('iron', 'weak')];
    expect(treaty.separateExit).toBeUndefined();
    expect(treaty.coalitionScope).toEqual(['ally', 'iron']);
    expect(Object.keys(treaty.shares).sort()).toEqual(['ally', 'iron']);
    const shareSum = Object.values(treaty.shares).reduce((s, v) => s + v, 0);
    expect(shareSum).toBeCloseTo(1, 3);
    // Iron (the city) brought more strength ⇒ the larger share.
    expect(treaty.shares.iron).toBeGreaterThan(treaty.shares.ally);
    // No betrayal on the ally edge (nobody was abandoned).
    const allyEdge = out.worldState.relationshipStates['edge.iron.ally'];
    expect((allyEdge.recentIncidents || []).some((i) => i.type === 'coalition_betrayal')).toBe(false);
    expect(treaty.receipts.some((r) => /coalition peace/i.test(r))).toBe(true);
  });

  it('SEPARATE EXIT: a worn, weak-tied member peels — a lighter solo peace, betrayal priced, a fracture record typed', () => {
    const jointBudget = getSpatialLedger(advance(coalitionWorld(0.0, 0.9), items, edges, 5).worldState, 'treaties')[treatyPairKey('iron', 'weak')].budgetGranted;
    const out = advance(coalitionWorld(0.8, 0.0), items, edges, 5);
    const treaty = getSpatialLedger(out.worldState, 'treaties')[treatyPairKey('iron', 'weak')];

    expect(treaty.separateExit).toBe(true);
    expect(treaty.coalitionScope).toBeUndefined(); // a peel is not a joint scope

    // The typed FRACTURE record (§7): deserter, abandoned co-besiegers, the
    // recorded credibility hit (the W-DOCTRINE-2 reliability seam).
    expect(treaty.fracture.deserter).toBe('iron');
    expect(treaty.fracture.abandoned).toEqual(['ally']);
    expect(treaty.fracture.coalitionSize).toBe(2);
    expect(treaty.fracture.credibilityHit).toBeCloseTo(PEACE_TERMS_TUNING.CREDIBILITY_HIT, 4);
    expect(treaty.fracture.tick).toBe(5);
    expect(fractureCredibilityDeltas(out.worldState, 5)).toEqual([]);
    expect(fractureCredibilityDeltas(out.worldState, 6)).toEqual([
      { id: 'iron', kind: 'fracture', magnitude01: PEACE_TERMS_TUNING.CREDIBILITY_HIT },
    ]);
    expect(fractureCredibilityDeltas(out.worldState, 7)).toEqual([]);

    // A LIGHTER solo bargain than the joint peace would have imposed.
    expect(treaty.budgetGranted).toBeCloseTo(jointBudget * PEACE_TERMS_TUNING.SEPARATE_EXIT_BUDGET, 4);
    expect(treaty.budgetGranted).toBeLessThan(jointBudget);

    // BETRAYAL PRICED through the E1 incident machinery: resentment up on the
    // abandoned ally's edge to the deserter, typed 'coalition_betrayal' (the
    // /betray/ revanchism clock reads it).
    const allyEdge = out.worldState.relationshipStates['edge.iron.ally'];
    expect(allyEdge.resentment).toBeGreaterThanOrEqual(PEACE_TERMS_TUNING.BETRAYAL_RESENTMENT_W);
    expect(allyEdge.recentIncidents.some((i) => i.type === 'coalition_betrayal')).toBe(true);
  });
});

// ── C) THE FRACTURE RECORD FEEDS THE coalition_fracture PEACE REASON ──────────

describe('W-PEACE-3 fracture → the peace reason consumes the record', () => {
  const iron = item('iron', { tier: 'city', population: 60000 });
  const weak = item('weak', { tier: 'village', population: 280 });
  const ally = item('ally', { tier: 'town', population: 4000 });
  const items = [iron, weak, ally];
  const edges = [edge('iron', 'weak'), edge('ally', 'weak'), edge('iron', 'ally', 'trade_partner')];

  it('fracturesAbandoning: a live fracture naming a party among the abandoned surfaces it; a stale one does not', () => {
    const ws = {
      tick: 10, simulationRules: { ...LIT },
      spatialLedgers: { treaties: { [treatyPairKey('iron', 'weak')]: {
        parties: ['iron', 'weak'], victorId: 'iron', loserId: 'weak', terms: [],
        fracture: { deserter: 'iron', abandoned: ['ally'], coalitionSize: 2, tick: 8 },
      } } },
    };
    expect(fracturesAbandoning(ws, 'ally', 10).length).toBe(1);
    expect(fracturesAbandoning(ws, 'nobody', 10).length).toBe(0);
    // Outside the fracture window ⇒ no longer live.
    expect(fracturesAbandoning(ws, 'ally', 8 + PEACE_TERMS_TUNING.FRACTURE_WINDOW + 1).length).toBe(0);
  });

  it("the abandoned ally's coalition_fracture peace reason FIRES off the fracture record", () => {
    // ally still besieges weak; iron peeled (fracture abandons ally). Even with
    // iron's deployment still counted, the record lifts the peak ⇒ the reason fires.
    const ws = {
      tick: 10, simulationRules: { ...LIT }, calendar: { elapsedWeeks: 30 },
      deployments: { ally: { targetId: 'weak' }, iron: { targetId: 'weak' } },
      warExhaustion: {}, relationshipStates: {},
      spatialLedgers: { treaties: { [treatyPairKey('iron', 'weak')]: {
        parties: ['iron', 'weak'], victorId: 'iron', loserId: 'weak', terms: [{ type: 'tribute', expiresTick: 100 }],
        separateExit: true, fracture: { deserter: 'iron', abandoned: ['ally'], coalitionSize: 2, tick: 9 },
      } } },
    };
    const out = advancePeaceReasons({ snapshot: snapshotFor(items, edges), worldState: ws, graph: { edges }, pIndex: null, tick: 10 });
    const peaceLedger = getSpatialLedger(out.worldState, 'peaceReasons') || {};
    const allyCase = peaceLedger['ally>weak'];
    expect(allyCase, 'ally holds a case for peace with weak').toBeTruthy();
    expect(allyCase.reasons.coalition_fracture, 'the fracture record fed the coalition_fracture reason').toBeTruthy();
    expect(allyCase.reasons.coalition_fracture.score).toBeGreaterThan(0);
  });
});

// ── D) TREATY-DOCUMENT READ-MODEL (§13 legibility) ───────────────────────────

describe('W-PEACE-3 treaty document — the legible artifact', () => {
  function treatyLedgerWorld(terms, patch = {}, tick = 60) {
    return {
      tick, simulationRules: { ...LIT },
      spatialLedgers: { treaties: { [treatyPairKey('iron', 'weak')]: {
        parties: ['iron', 'weak'], victorId: 'iron', loserId: 'weak', victorName: 'Ironhold', loserName: 'Weakmoor',
        mintedTick: 12, believedMarginAtSignature: 0.4, budgetGranted: 3, budgetSpent: 2, complianceState: 'honored',
        treatyTicksPerYear: CURRENT_TREATY_TICKS_PER_YEAR,
        terms, receipts: ['The Peace of Weakmoor.'], ...patch,
      } } },
    };
  }
  const term = (type, patch = {}) => ({
    type, family: TERM_CATALOG[type].family, magnitude: 0.4, mintedTick: 12,
    expiresTick: 60 + (3 * CURRENT_TREATY_TICKS_PER_YEAR),
    weightSpent: TERM_CATALOG[type].weight, complianceState: 'honored', trueState: 'honored', burden01: 0, receipt: `${type}`, ...patch,
  });

  it('treatyDocument renders ledger facts: parties, terms with years remaining, per-term compliance', () => {
    const ws = treatyLedgerWorld([
      term('tribute', { expiresTick: 60 + (3 * CURRENT_TREATY_TICKS_PER_YEAR) }),
    ], {}, 60);
    const doc = treatyDocument(ws, treatyPairKey('iron', 'weak'));
    expect(doc.victorName).toBe('Ironhold');
    expect(doc.loserName).toBe('Weakmoor');
    expect(doc.terms.length).toBe(1);
    expect(doc.terms[0].type).toBe('tribute');
    expect(doc.terms[0].yearsRemaining).toBe(3);
    expect(doc.terms[0].complianceState).toBe('honored');
    // A pair with no treaty ⇒ null; a dark world ⇒ null.
    expect(treatyDocument(ws, treatyPairKey('iron', 'other'))).toBeNull();
    expect(treatyDocument({ tick: 1 }, treatyPairKey('iron', 'weak'))).toBeNull();
  });

  it('reads legacy and current treaty clocks independently in the same ledger', () => {
    const ws = treatyLedgerWorld([
      term('tribute', { expiresTick: 60 + CURRENT_TREATY_TICKS_PER_YEAR }),
    ], {}, 60);
    ws.spatialLedgers.treaties[treatyPairKey('old', 'debtor')] = {
      parties: ['old', 'debtor'], victorId: 'old', loserId: 'debtor', victorName: 'Oldcourt', loserName: 'Debtorford',
      mintedTick: 12, believedMarginAtSignature: 0.4, budgetGranted: 3, budgetSpent: 2, complianceState: 'honored',
      // Intentionally markerless: this persisted treaty keeps the historical
      // twelve-tick year rather than being reinterpreted under the current clock.
      terms: [term('tribute', { expiresTick: 60 + 36 })], receipts: ['The Old Peace.'],
    };

    const current = treatyDocument(ws, treatyPairKey('iron', 'weak'));
    const legacy = treatyDocument(ws, treatyPairKey('old', 'debtor'));
    expect(current.terms[0].yearsRemaining).toBe(1);
    expect(legacy.terms[0].yearsRemaining).toBe(3);
  });

  it('A FRAYING treaty NAMES its weakest term (the seam nearest default)', () => {
    // tribute honored, demilitarization strained, occupation defaulted ⇒ occupation frays worst.
    const ws = treatyLedgerWorld([
      term('tribute', { complianceState: 'honored' }),
      term('demilitarization', { complianceState: 'strained' }),
      term('occupation_continuation', { complianceState: 'defaulted' }),
    ]);
    const doc = treatyDocument(ws, treatyPairKey('iron', 'weak'));
    expect(doc.frayingType).toBe('occupation_continuation');
    expect(doc.terms.find((t) => t.type === 'occupation_continuation').fraying).toBe(true);
    expect(doc.terms.find((t) => t.type === 'tribute').fraying).toBe(false);
    // An all-honored treaty has no fraying seam.
    const clean = treatyDocument(treatyLedgerWorld([term('tribute')]), treatyPairKey('iron', 'weak'));
    expect(clean.frayingType).toBeNull();
    expect(frayingTermOf([], 0)).toBeNull();
  });

  it('treatyFrayingSummary + the §14.4 IRONY treaty line render the fraying peace', () => {
    const strained = treatyLedgerWorld([term('tribute', { complianceState: 'strained' }), term('non_aggression', { complianceState: 'honored' })]);
    const treaty = getSpatialLedger(strained, 'treaties')[treatyPairKey('iron', 'weak')];
    const summary = treatyFrayingSummary(treaty, 60);
    expect(summary.total).toBe(2);
    expect(summary.honored).toBe(1);
    expect(summary.frayingType).toBe('tribute');
    expect(summary.line).toMatch(/holds by 1 term of 2; the tribute frays/);

    // The irony brief GAINS the treaty line (§14.4) when a treaty stands between the pair.
    const brief = warCausalBrief(strained, 'iron', 'weak');
    expect(brief.treatyLine).toBe(summary.line);
    // No treaty ⇒ no line.
    expect(warCausalBrief({ tick: 1 }, 'iron', 'weak').treatyLine).toBeNull();
  });

  it('treatyDocumentsForSettlement lists every treaty where the settlement is a party', () => {
    const ws = treatyLedgerWorld([term('tribute')]);
    expect(treatyDocumentsForSettlement(ws, 'iron').length).toBe(1);
    expect(treatyDocumentsForSettlement(ws, 'weak').length).toBe(1);
    expect(treatyDocumentsForSettlement(ws, 'stranger').length).toBe(0);
  });
});

// ── E) HOUSE-VOICE REGISTER GUARD (the newsVoice walker idiom) ───────────────

describe('W-PEACE-3 house voice — totality + register guard', () => {
  const STATES = ['honored', 'strained', 'defaulted'];

  it('every term FAMILY has a house-voice row for every compliance state (totality)', () => {
    for (const family of TERM_FAMILIES) {
      expect(TREATY_COMPLIANCE_VOICE[family], `family ${family} has a voice row`).toBeTruthy();
      for (const state of STATES) {
        expect(typeof TREATY_COMPLIANCE_VOICE[family][state], `${family}/${state} authored`).toBe('string');
      }
    }
  });

  it('every voice line is register-appropriate: non-empty, terminal punctuation, no template tokens', () => {
    const allRows = [...Object.values(TREATY_COMPLIANCE_VOICE), TREATY_COMPLIANCE_FLOOR];
    for (const row of allRows) {
      for (const state of STATES) {
        const line = row[state];
        expect(line.length, 'non-empty').toBeGreaterThan(0);
        expect(/[.!?]$/.test(line), `"${line}" ends in terminal punctuation`).toBe(true);
        expect(/[{}]|\$\{|%s/.test(line), `"${line}" carries no template tokens`).toBe(false);
        // Settlement-agnostic: no ">" pair keys or obvious id leaks.
        expect(/>/.test(line)).toBe(false);
      }
    }
  });

  it('treatyStrainLine keys by family × state and falls to the floor for an unknown family', () => {
    expect(treatyStrainLine('economic', 'strained')).toBe(TREATY_COMPLIANCE_VOICE.economic.strained);
    expect(treatyStrainLine('economic', 'defaulted')).toBe(TREATY_COMPLIANCE_VOICE.economic.defaulted);
    expect(treatyStrainLine('made_up_family', 'honored')).toBe(TREATY_COMPLIANCE_FLOOR.honored);
  });

  it('renderTreatyDocument dresses each term in the house voice and names the fraying seam', () => {
    const ws = {
      tick: 60, simulationRules: { ...LIT },
      spatialLedgers: { treaties: { [treatyPairKey('iron', 'weak')]: {
        parties: ['iron', 'weak'], victorId: 'iron', loserId: 'weak', victorName: 'Ironhold', loserName: 'Weakmoor',
        mintedTick: 12, believedMarginAtSignature: 0.4, budgetGranted: 3, budgetSpent: 2, complianceState: 'strained',
        treatyTicksPerYear: CURRENT_TREATY_TICKS_PER_YEAR,
        terms: [{ type: 'tribute', family: 'economic', magnitude: 0.4, mintedTick: 12, expiresTick: 60 + (3 * CURRENT_TREATY_TICKS_PER_YEAR), weightSpent: 1, complianceState: 'strained', trueState: 'strained', burden01: 0.5, receipt: 't' }],
        receipts: ['The Peace of Weakmoor.'],
      } } },
    };
    const view = renderTreatyDocument(ws, treatyPairKey('iron', 'weak'));
    expect(view.title).toBe('The Peace of Weakmoor');
    expect(view.termLines[0].yearsRemaining).toBe(3);
    expect(view.termLines[0].strainLine).toBe(TREATY_COMPLIANCE_VOICE.economic.strained);
    expect(view.frayingLine).toMatch(/tribute/);
    expect(view.frayingLine).toContain(termLabel('tribute'));
    // The settlement-scoped render is total on a dark world.
    expect(renderTreatiesForSettlement({ tick: 1 }, 'iron')).toEqual([]);
    expect(renderTreatyDocument({ tick: 1 }, treatyPairKey('iron', 'weak'))).toBeNull();
  });
});
