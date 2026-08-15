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

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';

import {
  advanceTreaties, termBudgetFor, resolveVictor, believedAdvantage,
  believedAdvantageFromInputs, appraiseLoserPortfolio, appraiseLoserPortfolioFromInputs,
  draftTerms, evolveCompliance, alignmentPress, alignmentPressFromInput,
  treatiesForPair, demilitarizationCapFor, treatyBlocksWar, occupationHoldFor, treatyPairKey,
  termLabel, TERM_CATALOG, TERM_TYPES, TERM_FAMILIES, TERM_EXECUTORS, PEACE_TERMS_TUNING,
} from '../../src/domain/worldPulse/peaceTerms.js';
import { repudiateTreaty } from '../../src/domain/worldPulse/treatyBreach.js';
import { TREATY_TRANSFER_TUNING } from '../../src/domain/worldPulse/treatyTransfer.js';
import { TREATY_ENFORCEMENT_TUNING } from '../../src/domain/worldPulse/treatyEnforcement.js';
import {
  CURRENT_TREATY_TICKS_PER_YEAR,
  LEGACY_TREATY_TICKS_PER_YEAR,
} from '../../src/domain/worldPulse/treatyClock.js';
import { INTERVAL_WEEKS } from '../../src/domain/worldPulse/intervalWeeks.js';
import { advanceWarReasons, warReasonsFor } from '../../src/domain/worldPulse/warReasons.js';
import { GOVERNING_SEAT_KEY } from '../../src/domain/worldPulse/beliefMap.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { buildPressureSummary } from '../../src/domain/worldPulse/relationshipEvolution.js';
import {
  TREATY_ORIENTATION_KINDS, TREATY_ROLE_WORDS, termObligationOf, treatyOrientationOf,
} from '../../src/domain/worldPulse/treatyOrientation.js';
import { draftPactSheet, signPactProposal } from '../../src/domain/worldPulse/pactFormation.js';
import { lineageOf } from '../../src/domain/worldPulse/pactAmendment.js';
import { disclosureSigningCredits } from '../../src/domain/worldPulse/peaceTermsDisclosure.js';
import { treatyDisclosureOpenedBeats } from '../../src/domain/worldPulse/treatyLifecycleVoice.js';

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
      // POINTS AT THE ONE DECLARATION, NEVER A SECOND COPY OF IT. This line used to
      // hand-restate the executor union, so GR-3's seventh kind (`grant`) reddened it
      // while the catalog and its JSDoc were both perfectly correct — the restatement
      // was the defect, not the enum member. See TERM_EXECUTORS' docstring.
      expect(TERM_EXECUTORS, `${type}'s executor is a declared kind`).toContain(spec.executor);
    }
  });

  it('the executor vocabulary is CLOSED and agrees in all three homes it is written down', () => {
    // A membership check against a declared list only bites while the list is honest, and
    // an allowlist has two ways to rot: it can miss a kind the catalog uses (the red GR-3
    // hit), or it can grow a kind nothing uses (a dead branch nobody notices). Pin BOTH
    // directions as one equality so neither can hide.
    const used = [...new Set(TERM_TYPES.map((t) => TERM_CATALOG[t].executor))].sort();
    expect(used, 'every declared executor kind is used by a row, and vice versa')
      .toEqual([...TERM_EXECUTORS].sort());
    // THE THIRD HOME IS THE TYPE UNION, and it is the one no runtime check can see —
    // typecheck failures and test failures are separate gates, so a union that drifted
    // would stay green here forever. Read the declaration and compare its members.
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../../src/domain/worldPulse/peaceTermsCatalog.js'),
      'utf8',
    );
    const union = /@typedef \{((?:'[a-z_]+'\|)*'[a-z_]+')\} TermExecutor/.exec(src);
    expect(union, 'the TermExecutor typedef must be findable — if it was renamed, re-point this scan')
      .toBeTruthy();
    expect([...union[1].matchAll(/'([a-z_]+)'/g)].map((m) => m[1]).sort(),
      'the TermExecutor type union and the TERM_EXECUTORS runtime list must carry the same members')
      .toEqual([...TERM_EXECUTORS].sort());
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

  it('the historic belief/appraisal/alignment adapters delegate byte-exactly to the input-only leaves', () => {
    const ws = { simulationRules: { ...LIT } };
    const victor = item('v', { category: 'merchant' });
    const loser = item('weak', { exports: [{ name: 'Silver' }] });
    const truthFor = (id) => (id === 'v' ? 0.8 : 0.35);
    expect(believedAdvantage('v', 'weak', ws, truthFor))
      .toBe(believedAdvantageFromInputs(0.8, 0.35));
    expect(alignmentPress(victor)).toBe(alignmentPressFromInput(0.5));
    expect(appraiseLoserPortfolio({
      victorId: 'v', loserId: 'weak', worldState: ws,
      victorItem: victor, loserItem: loser,
      victorPressure: { food: 0.6, economy: 0.4, trade: 0.2 },
      victorThreat01: 0.5, loserTruthStrength: 0.35, loserAllyStrength01: 0.3,
    })).toEqual(appraiseLoserPortfolioFromInputs({
      believedLoserStrength: 0.35,
      victorFoodPressure01: 0.6,
      victorEconomyPressure01: 0.4,
      victorTradePressure01: 0.2,
      victorThreat01: 0.5,
      loserAllyStrength01: 0.3,
      loserExports: ['Silver'],
      victorArchetype: 'merchant',
      restitutionClaim01: 0,
    }));
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

  it('the decisive-victory curve is monotone across alignment, mediation, and the .99 → 1 boundary', () => {
    // This is a PRODUCT-FED row: treasury appraisal authors tribute. The known
    // unfed reparations/non-intervention seams are deliberately not claimed here.
    const ranked = [{ assetClass: 'treasury', termType: 'tribute', value: 0.9 }];
    const years = ({ margin01, press, budget = margin01 * PEACE_TERMS_TUNING.BUDGET_MAX }) => {
      const drafted = draftTerms({ ranked, budget, margin01, press, tick: 0 }).terms[0];
      return drafted ? drafted.expiresTick / CURRENT_TREATY_TICKS_PER_YEAR : 0;
    };

    // Alignment authors a wider but still bounded ask at the same crushing margin.
    expect([
      years({ margin01: 1, press: 0.6 }),
      years({ margin01: 1, press: 1.0 }),
      years({ margin01: 1, press: 1.4 }),
    ]).toEqual([6, 10, 12]);

    // The previous unaffordability cliff is gone: a near-perfect result stays
    // live (shortened to what its 2.97 budget can buy) and perfect never shrinks it.
    const almostPerfect = years({ margin01: 0.99, press: 1.4 });
    const perfect = years({ margin01: 1, press: 1.4 });
    expect(almostPerfect).toBe(11);
    expect(perfect).toBeGreaterThanOrEqual(almostPerfect);

    // A mediated perfect victory has the same authored ask but a softened budget;
    // affordability shortens the term instead of deleting it from the treaty.
    const mediated = years({ margin01: 1, press: 1.4, budget: 2.4 });
    expect(mediated).toBe(9);
    expect(mediated).toBeLessThan(perfect);
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
    expect(treaty.treatyTicksPerYear).toBe(CURRENT_TREATY_TICKS_PER_YEAR);
    expect(treaty.treatyTicksPerYear).toBe(INTERVAL_WEEKS.one_year);
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

  it('a current one-year stream remains live at week 51 and expires before drawing at week 52', () => {
    const weeklyFed = [
      item('iron', { tier: 'town', population: VICTOR_POP, storageMonths: VICTOR_MONTHS }),
      item('weak', { tier: 'city', population: LOSER_POP, storageMonths: 8 }),
    ];
    const currentTreaty = treatyOf(
      [term('tribute', { magnitude: 1, mintedTick: 0, expiresTick: CURRENT_TREATY_TICKS_PER_YEAR })],
      { treatyTicksPerYear: CURRENT_TREATY_TICKS_PER_YEAR },
    );
    const live = advance(ledgerWorld(currentTreaty, { tick: 51 }), weeklyFed, IW_EDGES, 51);
    expect(getSpatialLedger(live.worldState, 'treaties')).toBeTruthy();
    expect(monthsIn(live, 'weak')).toBeLessThan(8);

    const expired = advance(ledgerWorld(currentTreaty, { tick: 52 }), weeklyFed, IW_EDGES, 52);
    expect(getSpatialLedger(expired.worldState, 'treaties')).toBeUndefined();
    expect(monthsIn(expired, 'weak'), 'the expiry tick draws no installment').toBe(8);
    expect(monthsIn(expired, 'iron'), 'the expiry tick credits no installment').toBe(VICTOR_MONTHS);
  });

  it('strain is annualized by each treaty clock: twelve legacy ticks equal fifty-two current ticks', () => {
    const pressure = { bySettlement: { weak: [
      { type: 'economy', severity: 1 },
      { type: 'food', severity: 1 },
    ] } };
    const incrementFor = (treatyTicksPerYear) => {
      const treaty = treatyOf(
        [term('non_aggression', { expiresTick: 500 })],
        { treatyTicksPerYear },
      );
      const ws = ledgerWorld(treaty, {
        tick: 10,
        relationshipStates: {
          'edge.iron.weak': { relationshipType: 'cold_war', resentment: 0, trust: 0.2 },
        },
      });
      const out = advance(ws, IW, IW_EDGES, 10, pressure);
      return out.worldState.relationshipStates['edge.iron.weak'].resentment;
    };

    const legacyTick = incrementFor(LEGACY_TREATY_TICKS_PER_YEAR);
    const currentTick = incrementFor(CURRENT_TREATY_TICKS_PER_YEAR);
    expect(legacyTick).toBeCloseTo(PEACE_TERMS_TUNING.STRAIN_RESENTMENT_PER_YEAR / 12, 9);
    expect(currentTick).toBeCloseTo(PEACE_TERMS_TUNING.STRAIN_RESENTMENT_PER_YEAR / 52, 9);
    expect(legacyTick * 12).toBeCloseTo(currentTick * 52, 9);
    expect(currentTick * 52).toBeCloseTo(PEACE_TERMS_TUNING.STRAIN_RESENTMENT_PER_YEAR, 9);
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

// ── G) GR-3B-ORIENT — THE PER-TERM OBLIGATION AXIS (CR-GR3B-3-R1) ───────────
//
// The axis a negotiated clause is resolved on is the term's own persisted `beneficiary`:
// the obligee is the party the clause runs to, the obligor is the counterparty, and a
// clause both courts hold binds them MUTUALLY with no transfer direction at all. A war
// or sale term carries no `beneficiary`, so it DELEGATES to the instrument reader and
// must resolve exactly as it always has.

/** A pressure index that records every `(saveId, kind)` read the mover performs, in
 *  order. It is the instrument A5 needs and it mocks NOTHING: `buildPressureSummary`
 *  reaches the index once per summary, and `victorMonitorReach(obligee, obligor, …)`
 *  reaches the same index through `truthFor(obligor)`. A changed call count, a changed
 *  order or a swapped argument pair all move this log. */
function recordingIndex(log) {
  return { get: (sid, kind) => { log.push(`${String(sid)}:${String(kind)}`); return undefined; } };
}

describe('GR-3B-ORIENT A5 — the counterforce: a war treaty is priced exactly as it always was', () => {
  it('ONE capacity summary + ONE monitor read, both for the OBLIGOR, for a THREE-term treaty', () => {
    // The expected shape is DERIVED from the real leaf rather than restated: one summary
    // is whatever `buildPressureSummary` reads, and PASS 2 performs exactly two of them.
    const oneSummary = [];
    buildPressureSummary(recordingIndex(oneSummary), 'weak');
    expect(oneSummary.length, 'the recorder really sees a summary').toBeGreaterThan(0);

    const log = [];
    const ws = ledgerWorld(treatyOf([
      term('tribute', { magnitude: 0.3 }), term('non_aggression'), term('demilitarization', { magnitude: 0.5 }),
    ]));
    advance(ws, FED, IW_EDGES, 10, recordingIndex(log));
    // MEASURED AT THE VERIFIED BASE BEFORE THE WIRING EXISTED, AND RE-MEASURED AFTER IT:
    // the capacity read and the monitor read are one summary each, in that order, and
    // THREE terms still cost two — the figures are per DIRECTION, not per clause.
    expect(log, 'the capacity read then the monitor read, both on the obligor')
      .toEqual([...oneSummary, ...oneSummary]);

    // AND THE OBLIGEE IS NEVER PRICED. A swapped `victorMonitorReach` argument pair would
    // call `truthFor('iron')` and put iron in this log.
    const ironProbe = [];
    buildPressureSummary(recordingIndex(ironProbe), 'iron');
    // anchored: the detector demonstrably CAN see the obligee one line above, so the
    // absence below is PASS 2's direction rather than a scanner that never fires.
    expect(ironProbe.some((row) => row.startsWith('iron:')), 'the detector can see it').toBe(true);
    expect(log.some((row) => row.startsWith('iron:')), 'and PASS 2 never priced it').toBe(false);
  });

  it('EVERY war and sale clause DELEGATES — the per-term reader returns the instrument answer exactly', () => {
    const sale = {
      parties: ['iron', 'weak'], sellerId: 'weak', buyerId: 'iron', mintedTick: 0,
      complianceState: 'honored', receipts: ['pin'],
      terms: [term('tribute'), term('occupation_continuation')],
    };
    const nameless = {
      parties: ['iron', 'weak'], mintedTick: 0, complianceState: 'honored', receipts: ['pin'],
      terms: [term('tribute')],
    };
    /** @type {Array<[string, Record<string, any>]>} */
    const fixtures = [
      ['a war settlement', treatyOf([term('tribute'), term('non_aggression'), term('demilitarization')])],
      ['a defaulted war settlement', treatyOf([term('tribute')], { complianceState: 'defaulted', defaultedBy: 'weak', defaultSeverity01: 0.7 })],
      ['a repudiation shell', treatyOf([term('tribute')], { breachType: 'repudiation', breachExpiresTick: 40 })],
      ['a sovereignty SALE', sale],
      ['an orientation-less record', nameless],
    ];
    for (const [why, treaty] of fixtures) {
      const instrument = treatyOrientationOf(treaty);
      for (const clause of treaty.terms) {
        expect(termObligationOf(treaty, clause), why).toEqual({
          kind: instrument.kind,
          resolved: instrument.resolved,
          mutual: false,
          obligorId: instrument.obligorId,
          obligeeId: instrument.obligeeId,
        });
      }
    }
    // THE TOTALITY CLAIM'S ONE PREMISE, MEASURED: the delegation arm is total only while no
    // war-door, carried-sheet or sale clause writes a `beneficiary` key. The day one does,
    // it silently changes courts — which is why this is asserted rather than assumed.
    for (const [why, treaty] of fixtures) {
      for (const clause of treaty.terms) {
        expect(Object.prototype.hasOwnProperty.call(clause, 'beneficiary'), why).toBe(false);
      }
    }
    // anchored: the same reader DOES resolve differently the moment the key appears, so the
    // equalities above measure the delegation arm rather than a reader that ignores terms.
    const spelled = { ...sale.terms[0], beneficiary: 'weak' };
    expect(termObligationOf(sale, spelled).obligorId, 'the key really does redirect').toBe('iron');
    expect(treatyOrientationOf(sale).obligorId, 'against the instrument answer').toBe('iron');
    const reversed = { ...sale.terms[0], beneficiary: 'iron' };
    expect(termObligationOf(sale, reversed).obligorId).toBe('weak');
  });

  it('the negotiated arm reproduces the delegated one BYTE FOR BYTE when they name the same direction', () => {
    // A war settlement's clauses all inherit one direction: the obligee is the victor. Spell
    // that out as a `beneficiary` on each clause and PASS 2 must produce the identical tick.
    const plain = treatyOf([term('tribute', { magnitude: 0.3 }), term('non_aggression')]);
    const spelledSame = treatyOf(plain.terms.map((t) => ({ ...t, beneficiary: 'iron' })));
    const spelledOther = treatyOf(plain.terms.map((t) => ({ ...t, beneficiary: 'weak' })));
    /** The whole tick, minus the key that selects the arm. */
    const tickOf = (treaty) => {
      const out = advance(ledgerWorld(JSON.parse(JSON.stringify(treaty))), FED, IW_EDGES, 10);
      const stored = getSpatialLedger(out.worldState, 'treaties')[treatyPairKey('iron', 'weak')];
      return JSON.stringify({
        treaty: { ...stored, terms: stored.terms.map(({ beneficiary, ...rest }) => rest) },
        updates: out.settlementUpdates,
        changed: out.changed,
      });
    };
    expect(tickOf(spelledSame), 'the two arms agree on every byte').toBe(tickOf(plain));
    // anchored: naming the OTHER court really does move the tick, so the equality above is
    // a byte comparison with teeth rather than one that could not have failed.
    expect(tickOf(spelledOther), 'and the reversed direction does NOT').not.toBe(tickOf(plain));
  });
});

// ── GR-3B-ORIENT — THE NEGOTIATED ARM, DRIVEN THROUGH THE REAL MINT ─────────

/** Mint a negotiated instrument through the REAL drafter and the REAL signer. Nothing
 *  below hand-builds a negotiated record: a fixture written to the resolver's own shape
 *  would mirror the deriver it is meant to measure. */
function mintPact({ fromId, toId, trigger, reciprocal = false, signTick = 10, worldState = null }) {
  const sheet = draftPactSheet({ trigger, fromId, toId, reciprocal, tick: signTick - 4 });
  return signPactProposal({
    worldState: worldState || {
      rngSeed: 'gr3b-orient', simulationRules: { pactFormationEnabled: true },
      relationshipStates: {}, spatialLedgers: {},
    },
    proposal: { from: fromId, to: toId, sheet },
    tick: signTick,
  });
}

const PACT_KEY = treatyPairKey('iron', 'weak');
const pactRecord = (signed) => getSpatialLedger(signed.worldState, 'treaties')[PACT_KEY];
const fresh = (record) => JSON.parse(JSON.stringify(record));

/** A negotiated record has no victor and no loser, so `ledgerWorld` (which keys on that
 *  pair) cannot address it. Same world, keyed by the pair key the mint actually used. */
function pactLedgerWorld(treaty, extra = {}) {
  return {
    tick: 10, simulationRules: { ...LIT }, calendar: { elapsedWeeks: 30 }, deployments: {},
    relationshipStates: {}, spatialLedgers: { treaties: { [PACT_KEY]: treaty } }, ...extra,
  };
}

/** THE WEEKLY-CLOCK PAIR. A negotiated instrument runs on the CURRENT 52-tick year, so one
 *  installment is a fifty-second of the yearly share — MEASURED to round away entirely
 *  against the FED pair's six months, which would make a movement pin vacuous. The payer
 *  gets the headroom that makes a weekly stream actually felt. */
const WEEKLY_PAYER_MONTHS = 8;
const WEEKLY = [
  item('iron', { tier: 'town', population: VICTOR_POP, storageMonths: VICTOR_MONTHS }),
  item('weak', { tier: 'city', population: LOSER_POP, storageMonths: WEEKLY_PAYER_MONTHS }),
];

/** Crushes ONE court's economy and food — enough capacity loss to observe a default. */
const crushingOne = (id) => ({
  get: (sid, kind) => (String(sid) === id && (kind === 'economy' || kind === 'food') ? { score: 95 } : undefined),
});

describe('GR-3B-ORIENT — a negotiated clause knows which court owes it', () => {
  it('A1: the stream draws the OBLIGOR\'s granary and credits the OBLIGEE\'s, and the burden is the obligor\'s', () => {
    const record = pactRecord(mintPact({ fromId: 'iron', toId: 'weak', trigger: 'trade_demand' }));
    const clause = record.terms[0];
    expect(clause.type, 'the real lens drafts an economic clause').toBe('resource_share');
    expect(TERM_CATALOG[clause.type].stream, 'and it is a real stream').toBe(true);
    expect(clause.beneficiary, 'the court that ASKED is the one it runs to').toBe('iron');
    // The clause's own receipt has always named the promiser in words; the resolution
    // agrees with it rather than with a second spelling of the same question.
    expect(clause.receipt).toContain('weak promises');
    expect(termObligationOf(record, clause)).toEqual({
      kind: 'negotiated', resolved: true, mutual: false, obligorId: 'weak', obligeeId: 'iron',
    });

    // MOVEMENT. The magnitude is raised the way every other stream pin in this file raises
    // it: at the weekly clock a base-magnitude installment MEASURES to zero after the
    // tenth-month floor, and a direction pin that moves nothing measures nothing. Every
    // datum the axis reads — beneficiary, parties, receipt — is still the real mint's.
    const out = advance(
      pactLedgerWorld(fresh({ ...record, terms: [{ ...clause, magnitude: 0.9 }] })), WEEKLY, IW_EDGES, 10,
    );
    const moved = getSpatialLedger(out.worldState, 'treaties')[PACT_KEY].terms[0];
    expect(moved.extractedFromLoser, 'the obligor actually paid').toBeGreaterThan(0);
    expect(moved.deliveredToVictor, 'the obligee actually received').toBeGreaterThan(0);
    expect(monthsIn(out, 'weak'), "the obligor's granary fell").toBeLessThan(WEEKLY_PAYER_MONTHS);
    expect(monthsIn(out, 'iron'), "and the obligee's rose").toBeGreaterThan(VICTOR_MONTHS);

    // BURDEN, CAPACITY AND THE DEFAULT NAME all follow the obligor.
    const onObligor = getSpatialLedger(
      advance(pactLedgerWorld(fresh(record)), WEEKLY, IW_EDGES, 10, crushingOne('weak')).worldState, 'treaties',
    )[PACT_KEY];
    expect(onObligor.terms[0].burden01, "the obligor's distress IS the clause's burden").toBeGreaterThan(0);
    expect(onObligor.complianceState).toBe('defaulted');
    expect(onObligor.defaultedBy, 'and the obligor is the oathbreaker').toBe('weak');
    // anchored: the SAME index aimed at the obligee leaves the clause entirely untouched,
    // so the burden above measures the direction rather than the pressure index.
    const onObligee = getSpatialLedger(
      advance(pactLedgerWorld(fresh(record)), WEEKLY, IW_EDGES, 10, crushingOne('iron')).worldState, 'treaties',
    )[PACT_KEY];
    expect(onObligee.terms[0].burden01, "the obligee's distress is not this clause's burden").toBe(0);
    expect(onObligee.complianceState).toBe('honored');
  });

  it('A4: swapping the proposer MIRRORS the obligation on a record whose key, parties and receipts do not move', () => {
    const askedMint = mintPact({ fromId: 'iron', toId: 'weak', trigger: 'trade_demand' });
    const swappedMint = mintPact({ fromId: 'weak', toId: 'iron', trigger: 'trade_demand' });
    const asked = pactRecord(askedMint);
    const swapped = pactRecord(swappedMint);

    // WHAT DOES NOT MOVE, compared between two LIVE mints rather than restated.
    expect(Object.keys(getSpatialLedger(swappedMint.worldState, 'treaties')), 'the same ledger key')
      .toEqual(Object.keys(getSpatialLedger(askedMint.worldState, 'treaties')));
    expect(swapped.parties, 'the same parties, in the same order').toEqual(asked.parties);
    expect(swapped.receipts, 'the same treaty receipts').toEqual(asked.receipts);
    expect(swapped.mintedTick).toBe(asked.mintedTick);

    // WHAT DOES: the obligation mirrors, per term.
    const a = termObligationOf(asked, asked.terms[0]);
    const b = termObligationOf(swapped, swapped.terms[0]);
    expect(a).toEqual({ kind: 'negotiated', resolved: true, mutual: false, obligorId: 'weak', obligeeId: 'iron' });
    expect(b.obligorId, 'the obligor and obligee exchange places').toBe(a.obligeeId);
    expect(b.obligeeId).toBe(a.obligorId);
    // …because the proposer DOES survive the mint — per term, as `beneficiary`, and nowhere
    // else. anchored: the invariant fields were just proved equal, so this inequality
    // locates the difference in the terms rather than anywhere a consumer reads.
    expect(JSON.stringify(swapped), 'the WHOLE record is not invariant').not.toBe(JSON.stringify(asked));
    expect(swapped.terms.map((t) => t.beneficiary)).toEqual(['weak']);
    expect(asked.terms.map((t) => t.beneficiary)).toEqual(['iron']);
  });

  it('A8: the multi-round instrument — two courts, two rounds, ONE record, two independent directions', () => {
    const first = mintPact({ fromId: 'iron', toId: 'weak', trigger: 'shared_threat', signTick: 10 });
    const second = mintPact({
      fromId: 'weak', toId: 'iron', trigger: 'trade_demand', signTick: 20, worldState: first.worldState,
    });
    expect(first.minted, 'the first round mints').toBe(true);
    expect(second.amended, 'and the second AMENDS — the pair never gains a second instrument').toBe(true);
    const record = pactRecord(second);
    expect(Object.keys(getSpatialLedger(second.worldState, 'treaties'))).toEqual([PACT_KEY]);
    expect(lineageOf(record), 'two acts on one record').toHaveLength(2);

    const duties = record.terms.map((t) => termObligationOf(record, t));
    // The security clause both courts hold binds them mutually; the economic clause weak
    // asked for binds IRON. THIS is the shape a treaty-level `proposedBy` could not have
    // expressed — one record, two clauses, and no single direction between them.
    expect(duties.filter((d) => d.mutual), 'one mutual clause').toHaveLength(1);
    expect(duties.filter((d) => !d.mutual), 'and one directed clause').toHaveLength(1);
    expect(duties.find((d) => !d.mutual)).toEqual({
      kind: 'negotiated', resolved: true, mutual: false, obligorId: 'iron', obligeeId: 'weak',
    });
    // …while the INSTRUMENT-level orientation stays unresolved at both rounds, which is
    // precisely why the axis had to be per term and why nothing about the treaty-level
    // reader needed to move.
    expect(treatyOrientationOf(record).resolved).toBe(false);
    expect(treatyOrientationOf(record).kind).toBe('unknown');

    // AND THE INSTRUMENT VOCABULARY IS STILL EXACTLY THREE MEMBERS. Widening it would bind
    // negotiated pacts into nine consumers that have never bound one.
    expect([...TREATY_ORIENTATION_KINDS].sort()).toEqual(['sale', 'unknown', 'wartime']);
    expect(Object.keys(TREATY_ROLE_WORDS).sort()).toEqual([...TREATY_ORIENTATION_KINDS].sort());
  });
});

// ── G) IN-0C — THE OPEN ARTICLE, SPOKEN AT THE SIGNING ──────────────────────

const VOICE = { ...LIT, treatyLifecycleVoiceEnabled: true };

/** A canonical carried sheet whose single clause is the disclosure article. The carried
 *  road re-appraises nothing, so it is the DETERMINISTIC way to drive a real PASS 1 mint
 *  of a named term — the `oathHolderGr1` door-2 idiom. */
function disclosureSheet(agreedTick) {
  const clause = {
    type: 'disclosure', family: 'informational', magnitude: 1,
    durationTicks: 3 * CURRENT_TREATY_TICKS_PER_YEAR, weightSpent: 0.6, burden01: 0,
    // `disclosure` is an executor:'seam' term, and normalizeCarriedClause's biconditional
    // refuses the whole sheet without the flag — consumed whole or refused whole.
    seam: true,
  };
  return {
    schemaVersion: 1,
    id: 'sheet.errand.in0c', errandId: 'errand.in0c', encounterId: 'encounter.in0c',
    episodeKey: 'episode.in0c', relationshipKey: 'edge.iron.weak',
    parties: ['iron', 'weak'], proposerId: 'iron', responderId: 'weak',
    victorId: 'iron', loserId: 'weak', agreedTick,
    pictureIds: { proposer: 'picture.iron', responder: 'picture.weak' },
    clauses: [clause],
    budgetSpent: clause.weightSpent,
    valuations: [
      { partyId: 'iron', pictureId: 'picture.iron', role: 'proposer', decision: 'accept' },
      { partyId: 'weak', pictureId: 'picture.weak', role: 'responder', decision: 'accept' },
    ],
  };
}

/** Drive the REAL PASS 1 mint through the carried-sheet door. */
function mintDisclosure(tick = 5, rules = VOICE) {
  const ws = suingWorld('iron', 'weak', tick, { simulationRules: { ...rules } });
  ws.relationshipStates['edge.iron.weak'].recentIncidents[0].carriedTermSheet = disclosureSheet(tick - 2);
  return advance(ws, IW, IW_EDGES, tick);
}

describe('IN-0C — the open article is minted ONCE, at the signing', () => {
  it('A7 — the real PASS 1 mint speaks treaty_disclosure_opened exactly once, beside the signing', () => {
    const out = mintDisclosure(5);
    const opened = out.newsEntries.filter((entry) => entry.kind === 'treaty_disclosure_opened');
    expect(opened, 'the open article was not spoken at the signing').toHaveLength(1);
    // It rides BESIDE the signing beat, never instead of it.
    expect(out.newsEntries.some((entry) => entry.kind === 'treaty_signed')).toBe(true);
    expect(opened[0].section).toBe('trade');
    expect(opened[0].audience).toBe('public');
    expect(opened[0].impactKind).toBe('treaty_disclosure_opened');
    expect(opened[0].parties).toEqual(['iron', 'weak']);
    const prose = [opened[0].headline, opened[0].summary, ...opened[0].reasons].join(' ');
    expect(prose.length, 'the beat rendered no prose at all').toBeGreaterThan(40);
    // anchored: the length floor on this same string one line up proves it is a real sentence.
    expect(prose).not.toMatch(/\{|\}|\bundefined\b|\bNaN\b|_/);
    // anchored: same non-empty `prose` string, pinned by the length floor three lines up.
    expect(prose).not.toMatch(/\d/);
  });

  it('A7 — honored stays QUIET: the article is not re-spoken on a later tick', () => {
    const first = mintDisclosure(5);
    // Advance the SAME persisted ledger a tick on. PASS 1 is idempotent inside the window,
    // so the instrument is already in the ledger and no second article may be minted.
    const later = advance({ ...first.worldState, tick: 6 }, IW, IW_EDGES, 6);
    expect(later.newsEntries.filter((entry) => entry.kind === 'treaty_disclosure_opened')).toEqual([]);
  });

  it('A7 — expiry speaks treaty_lapsed ALONE: no disclosure_expired kind exists', () => {
    const expiring = treatyOf([term('disclosure', { mintedTick: 0, expiresTick: 10 })],
      { victorName: 'Ironhold', loserName: 'Weatherby' });
    const out = advance(ledgerWorld(expiring, { simulationRules: { ...VOICE } }), IW, IW_EDGES, 10);
    const kinds = out.newsEntries.map((entry) => entry.kind);
    expect(kinds).toContain('treaty_lapsed');
    // anchored: the toContain on this same collection one line up proves `kinds` is populated.
    expect(kinds).not.toContain('disclosure_expired');
    // anchored: same live `kinds` collection, pinned non-empty by the toContain above.
    expect(kinds).not.toContain('treaty_disclosure_opened');
  });

  it('A7 — the beat fails CLOSED on an unresolved orientation', () => {
    const unresolved = { obligeeId: '', obligorId: '', obligeeName: '', obligorName: '', resolved: false };
    expect(treatyDisclosureOpenedBeats({
      treaty: {}, terms: [term('disclosure')], tick: 5, orientation: unresolved,
    })).toEqual([]);
    // NON-VACUITY: the same call with a RESOLVED orientation does mint, so the absence
    // above is the guard firing rather than the composer being inert.
    const named = { victorName: 'Ironhold', loserName: 'Weatherby' };
    const resolved = treatyOrientationOf(treatyOf([term('disclosure')], named));
    expect(treatyDisclosureOpenedBeats({
      treaty: treatyOf([term('disclosure')], named), terms: [term('disclosure')], tick: 5, orientation: resolved,
    })).toHaveLength(1);
    // …and a treaty carrying NO informational clause stays silent.
    expect(treatyDisclosureOpenedBeats({
      treaty: treatyOf([term('tribute')], named), terms: [term('tribute')], tick: 5, orientation: resolved,
    })).toEqual([]);
  });

  it('A5 — every reachable mint door stamps a TERM-LEVEL mintedTick, and the credit fires once', () => {
    const TICK = 5;
    // DOOR: the carried sheet, driven through the real mover.
    const minted = getSpatialLedger(mintDisclosure(TICK).worldState, 'treaties')[treatyPairKey('iron', 'weak')];
    for (const t of minted.terms) expect(Number.isFinite(Number(t.mintedTick)), `${t.type}: no numeric mintedTick`).toBe(true);
    expect(minted.terms.find((t) => t.type === 'disclosure').mintedTick).toBe(TICK);
    // DOOR: the war door's live appraisal — every drafted term carries its own stamp.
    const ranked = appraiseLoserPortfolio({
      victorId: 'iron', loserId: 'weak', worldState: { simulationRules: { ...LIT } },
      victorItem: item('iron', { category: 'merchant' }), loserItem: item('weak', { exports: [{ name: 'Silver' }] }),
      victorPressure: { food: 0.6, economy: 0.6, trade: 0.2 },
      victorThreat01: 0.6, loserTruthStrength: 0.4, loserAllyStrength01: 0.4,
    });
    const { terms: drafted } = draftTerms({ ranked, budget: 4, margin01: 0.8, press: 1.2, tick: TICK });
    expect(drafted.length, 'the war door drafted nothing to stamp').toBeGreaterThan(0);
    for (const t of drafted) expect(Number(t.mintedTick), `${t.type}: war-door stamp`).toBe(TICK);
    // THE CREDIT WINDOW, through the door's own persisted output: once at T+1, never at T,
    // never at T+2 — the predicate needs no marker to be exactly-once.
    const ws = { spatialLedgers: { treaties: { [treatyPairKey('iron', 'weak')]: minted } } };
    expect(disclosureSigningCredits(ws, TICK)).toEqual([]);
    expect(disclosureSigningCredits(ws, TICK + 1)).toEqual([{ id: 'weak', kind: 'proven_true' }]);
    expect(disclosureSigningCredits(ws, TICK + 2)).toEqual([]);
  });
});
