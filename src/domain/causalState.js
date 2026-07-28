/**
 * domain/causalState.js — Unified causal state substrate.
 *
 * Tier 2.4 of the roadmap. Today's settlement state is scattered across
 * a dozen subsystem-specific fields (`economicState.foodSecurity`,
 * `powerStructure.publicLegitimacy`, `safetyProfile.blackMarketCapture`,
 * etc.). Each one reads its own narrow slice and produces its own
 * narrow output. This module unifies the substrate so every subsystem
 * (events, conditions, factions, supply chains, NPCs, AI overlay) can
 * read from one canonical map.
 *
 *   deriveCausalState(settlement) -> {
 *     variables: { food_security: SystemVariable, ... },   // 14 entries
 *     bands:     { food_security: 'adequate', ... },        // flat band map
 *     scores:    { food_security: 65, ... },                // flat 0-100 score map
 *     summary:   { surplus: string[], adequate: [], ... },  // group by band
 *   }
 *
 * Each SystemVariable has structured contributors so consumers can
 * answer "why is food_security strained?" by reading the chain of
 * deltas that produced the score. This is the Phase 7 trace pattern
 * applied at the system-variable level.
 *
 * Relationship to existing code:
 *   - This file does NOT replace `domain/state/deriveSystemState.js`.
 *     That module produces a 4-dimension UI-facing summary
 *     (resilience / volatility / externalThreat / resourcePressure)
 *     deliberately consolidated for DM-facing display. This file
 *     produces the underlying 14-variable substrate the roadmap calls
 *     for. The UI surface can later derive FROM this substrate
 *     (Strangler Fig) without breaking consumers today.
 *   - The 5-band vocabulary (surplus / adequate / strained / critical
 *     / collapsed) matches Tier 5.4's qualitative-banding direction
 *     and is the canonical substrate vocabulary going forward.
 *
 * Inputs the substrate reads from:
 *   - Phase 9  factionProfile.js          — archetype + power
 *   - Phase 10 supplyChainState.js        — canonical chain statuses
 *   - Phase 13 npcProfile.js              — NPC composition
 *   - Phase 16 activeConditions.js        — canonical condition state
 *   - Settlement generator output         — population, prosperity,
 *                                            stressors, defenseProfile,
 *                                            safetyProfile, etc.
 *
 * Pure functions only. No imports from src/lib. No I/O, no state.
 */

import { deriveAllSupplyChainStates } from './supplyChainState.js';
import { liveInstitutions } from './institutions/institutionRoster.js';
import { deriveAllFactionProfiles } from './factionProfile.js';
import { deityLawDirection, DEITY_LAW_TUNING } from './corruption.js';
import { deriveAllActiveConditions } from './activeConditions.js';
import { deriveAllNpcProfiles } from './npcProfile.js';
import { tradeRouteSemantics } from './tradeRouteSemantics.js';
import { canonStressors } from './canonicalAccessors.js';
import { foodLedger } from './foodLedger.js';
import { institutionIsLawOrder } from './institutionClassify.js';
import { governanceLedger } from './governanceLedger.js';
import { magicLedger } from './magicLedger.js';
import { healingLedger } from './healingLedger.js';
import { defenseLedger } from './defenseLedger.js';
import { WAR_RECOVERY_CONDITIONS, UPSWING_LIFT_CONDITIONS } from './worldPulse/archetypeCatalog.js';
// DEITY_RANK_AUTHORITY is single-sourced in the dependency-free leaf
// domain/deityConstants.js (amended W2b contract): the engine imports the LEAF,
// never display/deityEffects.js — routing through deityEffects would close the
// causalState > deityEffects > magicProfile > causalState cycle (deityEffects
// re-exports magicProfile's deity-magic constants; magicProfile reads
// deriveCausalState), which the shrink-only layer-boundary baseline forbids.
// deityEffects re-exports the same leaf object for display consumers, so the
// major/minor/cult religious-authority lift still has exactly one source.
import { DEITY_RANK_AUTHORITY } from './deityConstants.js';

// Phase 4 W-F4 (piety sites #6/#9): the LOCAL piety amplifier, read straight off
// the projected read-model (config.faithProfile.piety, minted by the pulse at
// tick END and consumed at the next tick's derive — the anti-runaway tick-START
// measurement). A PLAIN FIELD READ, deliberately not a worldPulse import: it keeps
// causalState off the cycle-sensitive layer boundary the header guards, and reads
// 1.0 when absent — so GENERATION (which never projects a piety record) and every
// deity-free settlement stay byte-identical. `localMult` ∈ ~[0.65,1.65] is the raw
// local amplifier (clergy-distorted); `megaphoneLaw` ∈ [0.4,1] is the LAW-channel
// opposed-runner-up dampener (an orderly rival muting a chaotic patron, or vice
// versa) that the law-derived lift (site #9) takes per the per-axis dampener rule.
/** @param {CausalSettlementSource | null | undefined} s
 *  @returns {{ localMult: number, megaphoneLaw: number }} */
function pietyLocalAmp(s) {
  // The projected piety read-model is not declared on CausalSettlementSource.config
  // (it is minted by the pulse), so bridge through `unknown` to a structural read —
  // no `any` (the domain any-ratchet stays flat). Absent record ⇒ 1.0.
  const cfg = /** @type {{ faithProfile?: { piety?: { localMult?: number, dampener?: { megaphoneLaw?: number } } } } | undefined} */ (
    /** @type {unknown} */ (s?.config));
  const p = cfg?.faithProfile?.piety;
  const localMult = p && Number.isFinite(p.localMult) ? Number(p.localMult) : 1;
  const megaphoneLaw = p && p.dampener && Number.isFinite(p.dampener.megaphoneLaw) ? Number(p.dampener.megaphoneLaw) : 1;
  return { localMult, megaphoneLaw };
}

// ── Local typedefs ───────────────────────────────────────────────────────

/** @typedef {import('./settlement.schema.js').FactionProfile} FactionProfile */
/** @typedef {import('./supplyChainState.js').DerivedSupplyChainState} DerivedSupplyChainState */
/** @typedef {import('./settlement.schema.js').NpcProfile} NpcProfile */
/** @typedef {import('./activeConditions.js').ActiveCondition} ActiveCondition */

/**
 * The 5-band vocabulary (see CAUSAL_BANDS below).
 * @typedef {'surplus'|'adequate'|'strained'|'critical'|'collapsed'} CausalBand
 */

/**
 * An embedded primary-deity snapshot (the embed-on-assign bridge). Self-contained
 * so the derivers never touch customContent. `rankAxis` (major/minor/cult) drives
 * religious_authority; `lawAxis` (lawful/chaotic) drives law_order. A legacy
 * 3-axis deity carries no lawAxis ⇒ dormant law term.
 * @typedef {Object} PrimaryDeitySnapshot
 * @property {string} [rankAxis]
 * @property {string} [lawAxis]
 * @property {string} [name]
 * @property {string} [_deityRef]
 */

/**
 * Settlement shape as the derivers actually read it — the legacy generator
 * fields this substrate consumes. (CanonicalSettlement in
 * settlement.schema.js does not yet declare these generator-era fields;
 * see crossFileNeeds.)
 * @typedef {Object} CausalSettlementSource
 * @property {number | {total?: number} | null} [population]
 * @property {{monsterThreat?: string, tradeRouteAccess?: string, magicLevel?: string,
 *             priorityMagic?: number, magicExists?: boolean, government?: unknown,
 *             primaryDeitySnapshot?: PrimaryDeitySnapshot | null}} [config]
 * @property {string} [tradeRouteAccess]
 * @property {string} [magicLevel]
 * @property {unknown} [stressors]
 * @property {unknown} [stress]
 * @property {unknown} [stresses]
 * @property {{governingName?: string, government?: unknown, publicLegitimacy?: {score?: unknown, label?: unknown} | number | null}} [powerStructure]
 * @property {import('./defenseLedger.js').DefenseLedgerSource['defenseProfile'] & {hasWalls?: boolean} | null} [defenseProfile]
 * @property {{prosperity?: unknown, economicComplexity?: unknown,
 *             safetyProfile?: {blackMarketCapture?: number},
 *             activeChains?: import('./supplyChainState.js').LegacyChain[]}} [economicState]
 * @property {{blackMarketCapture?: number}} [safetyProfile]
 * @property {unknown[]} [institutions]
 */

/**
 * One derived substrate variable with its trace.
 * @typedef {Object} SystemVariable
 * @property {string} variable
 * @property {number} score
 * @property {CausalBand} band
 * @property {CausalContributor[]} contributors
 */

/**
 * Result of a per-variable deriver, before finalization.
 * @typedef {{score: number, contributors: CausalContributor[]}} DeriverResult
 */

/**
 * The full derived substrate.
 * @typedef {Object} CausalState
 * @property {Record<string, SystemVariable>} variables
 * @property {Record<string, CausalBand>} bands
 * @property {Record<string, number>} scores
 * @property {Record<CausalBand, string[]>} summary
 */

/**
 * One entry of the compareCausalState() delta list.
 * @typedef {Object} CausalStateDelta
 * @property {string} variable
 * @property {number} before
 * @property {number} after
 * @property {number} change
 * @property {CausalBand} bandBefore
 * @property {CausalBand} bandAfter
 * @property {'higher_is_better'|'lower_is_better'} polarity
 * @property {string} explanation
 */

// ── Per-settlement derivation memo ───────────────────────────────────────
//
// deriveCausalState runs all 16 derivers against the SAME settlement object, and
// they collectively re-derive deriveAllActiveConditions / deriveAllFactionProfiles
// many times per call — each walking the full roster from scratch. Both depend
// SOLELY on the settlement object, so a WeakMap keyed on the settlement IDENTITY
// yields correct HITS within one deriveCausalState call and correct MISSES when
// the settlement actually changes (copy-on-write ⇒ a changed settlement is a NEW
// object reference). Byte-identical to re-deriving — the cached arrays are READ-
// ONLY at every call site (for-of / find / filter / map, never mutated) — and the
// WeakMap lets entries be GC'd once the settlement object is unreferenced.

/** @type {WeakMap<object, ActiveCondition[]>} */
const activeConditionsMemo = new WeakMap();
/** @type {WeakMap<object, ReturnType<typeof deriveAllFactionProfiles>>} */
const factionProfilesMemo = new WeakMap();

/**
 * Memoized deriveAllActiveConditions, keyed on the settlement identity.
 * Byte-identical to calling deriveAllActiveConditions(s) directly.
 * @param {CausalSettlementSource | null | undefined} s
 * @returns {ActiveCondition[]}
 */
function cachedActiveConditions(s) {
  if (!s || typeof s !== 'object') return deriveAllActiveConditions(s);
  const hit = activeConditionsMemo.get(s);
  if (hit) return hit;
  const derived = deriveAllActiveConditions(s);
  activeConditionsMemo.set(s, derived);
  return derived;
}

/**
 * Memoized deriveAllFactionProfiles, keyed on the settlement identity.
 * Byte-identical to calling deriveAllFactionProfiles(s) directly.
 * @param {CausalSettlementSource | null | undefined} s
 * @returns {ReturnType<typeof deriveAllFactionProfiles>}
 */
function cachedFactionProfiles(s) {
  if (!s || typeof s !== 'object') return deriveAllFactionProfiles(s);
  const hit = factionProfilesMemo.get(s);
  if (hit) return hit;
  const derived = deriveAllFactionProfiles(s);
  factionProfilesMemo.set(s, derived);
  return derived;
}

// ── Condition polarity + wall detection ──────────────────────────────────

// Recovery conditions are LIFTS, not pressures: siege_lifted AND its documented
// polarity clone occupation_lifted (a liberation) both RAISE the systems they
// declare. Sourced from the war-layer archetype catalog so a new recovery
// archetype lands here without re-typing the strings.
// W-LIFECYCLE: steading_tributary is the parent's bounded satellite read — a lift
// (severity-capped at the lazy kernel; planted fully-specified, no catalog template).
const LIFT_ARCHETYPES = new Set([...WAR_RECOVERY_CONDITIONS, ...UPSWING_LIFT_CONDITIONS, 'steading_tributary']);

/** +1 for a recovery/lift condition, -1 for a pressure. @param {ActiveCondition} cond */
function conditionDirection(cond) {
  return LIFT_ARCHETYPES.has(cond?.archetype) ? +1 : -1;
}

/**
 * THE single active-condition scan — the one implementation of the
 * affectedSystems join every deriver used to hand-roll. The polarity bug class
 * (a recovery lift read as a pressure) appeared independently in THREE
 * hand-written copies (food, trade, ruling_authority) before this existed; a
 * deriver that calls this cannot re-create it. causalStateConditionScan.test.js
 * pins that no deriver hand-rolls the join outside this helper.
 *
 * Modes:
 *   'signed' — conditionDirection() signs severity*scale: lifts RAISE the
 *              variable, pressures LOWER it. labels/tails are [positive, negative].
 *   'drain'  — pressure-only: always subtracts (labor, healing, housing…).
 *   'gain'   — pressure RAISES the variable (criminal_opportunity, the
 *              religious-pressure amplifier).
 * Zero-magnitude conditions are skipped uniformly (no phantom zero-delta
 * contributor entries — the old copies disagreed on this).
 *
 * @param {CausalSettlementSource} s
 * @param {CausalContributor[]} contributors
 * @param {string} system  affectedSystems key (must be a SYSTEM_VARIABLES entry)
 * @param {{ scale: number, mode?: 'signed'|'drain'|'gain',
 *           effect: string|[string,string], tail: string|[string,string],
 *           special?: (cond: ActiveCondition) => number|null, ownsArchetype?: string }} spec
 * @returns {number} total score delta applied by this scan
 */
function applyConditions(s, contributors, system, spec) {
  const { scale, mode = 'signed', effect, tail, special = null, ownsArchetype = null } = spec;
  let total = 0;
  for (const cond of cachedActiveConditions(s)) {
    if (special) {
      const consumed = special(cond);
      if (consumed != null) { total += consumed; continue; }
    }
    if (ownsArchetype && cond.archetype === ownsArchetype) continue;
    if (!cond.affectedSystems.includes(system)) continue;
    const base = Math.round(cond.severity * scale);
    if (base === 0) continue;
    if (mode === 'signed') {
      const direction = conditionDirection(cond);
      const magnitude = base * direction;
      const positive = direction > 0;
      total += magnitude;
      push(contributors, cond.id, positive ? effect[0] : effect[1], magnitude,
        `${cond.label} ${positive ? tail[0] : tail[1]}`);
    } else {
      const magnitude = mode === 'gain' ? base : -base;
      total += magnitude;
      push(contributors, cond.id, /** @type {string} */ (effect), magnitude, `${cond.label} ${tail}`);
    }
  }
  return total;
}

/**
 * True when the defense profile carries REAL walls — an explicit hasWalls flag,
 * a non-empty classified walls group (defenseGenerator's institutions.walls), or
 * a legacy non-empty walls descriptor. Deliberately reads the DATA, never a
 * regex over JSON.stringify: the profile always contains the literal key
 * "walls" (even as walls: []), so a stringify match granted every settlement
 * the walled bonus whether or not a single wall stood.
 * @param {{ hasWalls?: unknown, walls?: unknown, institutions?: { walls?: unknown } } | null | undefined} def
 * @returns {boolean}
 */
export function defenseProfileHasWalls(def) {
  if (!def || typeof def !== 'object') return false;
  if (def.hasWalls === true) return true;
  for (const walls of [def.walls, def.institutions?.walls]) {
    if (Array.isArray(walls)) { if (walls.length > 0) return true; continue; }
    if (typeof walls === 'string' && walls.trim() !== '') return true;
    if (walls && typeof walls === 'object' && Object.keys(walls).length > 0) return true;
  }
  return false;
}

// ── Canonical catalog ────────────────────────────────────────────────────

/**
 * The 14 canonical system variables per the roadmap. Frozen so the
 * shape of the substrate is stable; consumers can rely on iterating
 * this array to cover every dimension.
 */
export const SYSTEM_VARIABLES = Object.freeze([
  'food_security',
  'labor_capacity',
  'public_legitimacy',
  'ruling_authority',
  'faction_power',
  'trade_connectivity',
  'healing_capacity',
  'defense_readiness',
  'criminal_opportunity',
  'religious_authority',
  'housing_pressure',
  'infrastructure_condition',
  'magical_stability',
  'social_trust',
  'economic_capacity',
  'law_order',
]);

/**
 * The canonical 5-band vocabulary. Per Tier 5.4 this is the
 * vocabulary user-facing surfaces (PDF / UI / AI) should display
 * instead of raw numeric scores.
 */
export const CAUSAL_BANDS = Object.freeze([
  'surplus',
  'adequate',
  'strained',
  'critical',
  'collapsed',
]);

// ── Score / band conversion ──────────────────────────────────────────────

/**
 * Map a 0..100 score to a band. Boundaries:
 *   ≥75 surplus | ≥50 adequate | ≥30 strained | ≥15 critical | else collapsed
 *
 * 50 is the neutral / no-information score and lands in 'adequate' —
 * the substrate is default-optimistic; surfaces only flag pressure
 * when there's evidence for it.
 *
 * @param {unknown} score
 * @returns {CausalBand}
 */
export function causalBand(score) {
  const s = typeof score === 'number' ? Math.max(0, Math.min(100, score)) : 50;
  if (s >= 75) return 'surplus';
  if (s >= 50) return 'adequate';
  if (s >= 30) return 'strained';
  if (s >= 15) return 'critical';
  return 'collapsed';
}

/**
 * Round-trip: band → numeric center.
 * @param {string} band
 * @returns {number}
 */
export function defaultScoreForCausalBand(band) {
  switch (band) {
    case 'surplus':    return 85;
    case 'adequate':   return 62;
    case 'strained':   return 40;
    case 'critical':   return 22;
    default:           return 7;   // collapsed
  }
}

// ── Contributor helper ───────────────────────────────────────────────────

/**
 * @typedef {Object} CausalContributor
 * @property {string} source   — Stable id of the input ('chain.food_security.x',
 *                                'condition.plague.y', 'faction.merchant_guilds').
 * @property {string} effect   — Short tag ('stable', 'strained', 'pressure', 'lift', ...).
 * @property {number} delta    — Signed integer added to the variable's score.
 * @property {string} reason   — Human-readable explanation.
 */

/**
 * @param {CausalContributor[]} contributors
 * @param {string} source
 * @param {string} effect
 * @param {number} delta
 * @param {string} reason
 * @returns {void}
 */
function push(contributors, source, effect, delta, reason) {
  contributors.push({ source, effect, delta, reason });
}

// ── Population helper ────────────────────────────────────────────────────

/**
 * @param {CausalSettlementSource | null | undefined} settlement
 * @returns {number}
 */
function populationOf(settlement) {
  const pop = settlement?.population;
  if (typeof pop === 'number') return pop;
  if (pop && typeof pop === 'object' && typeof pop.total === 'number') return pop.total;
  return 0;
}

// ── Per-variable derivations ─────────────────────────────────────────────
//
// Every deriver takes the settlement and returns:
//   { score: number, contributors: CausalContributor[] }
// The composer finalizes by clamping the score to 0..100 and adding
// the band + the variable name.
//
// Each deriver starts from a neutral 50 baseline and adjusts via
// structured push() calls so the contributors list is the trace of
// exactly how the score got to its final value.

/**
 * @param {CausalSettlementSource} s
 * @returns {DeriverResult}
 */
function deriveFoodSecurity(s) {
  let score = 50;
  /** @type {CausalContributor[]} */
  const contributors = [];

  // Supply chain stability for the food_security need
  /** @type {DerivedSupplyChainState[]} */
  const chains = deriveAllSupplyChainStates(s);
  const foodChains = chains.filter(c => c.needKey === 'food_security');
  for (const c of foodChains) {
    if (c.status === 'stable') {
      score += 8; push(contributors, c.id, 'stable', +8, `${c.name} runs normally.`);
    } else if (c.status === 'strained' || c.status === 'substituted') {
      score -= 8; push(contributors, c.id, c.status, -8, `${c.name} is ${c.status}.`);
    } else if (c.status === 'scarce') {
      score -= 15; push(contributors, c.id, 'scarce', -15, `${c.name} produces below normal.`);
    } else if (c.status === 'blocked' || c.status === 'captured') {
      score -= 20; push(contributors, c.id, c.status, -20, `${c.name} is ${c.status}.`);
    } else if (c.status === 'collapsing') {
      score -= 28; push(contributors, c.id, 'collapsing', -28, `${c.name} is collapsing.`);
    }
  }

  score += applyConditions(s, contributors, 'food_security', {
    scale: 20, effect: ['lift', 'pressure'], tail: ['restores food security.', 'taxes food security.'],
  });

  // Generator food band, via the conserved ledger. The old code read
  // `surplusMonths`/`deficitMonths` — fields foodGenerator never produces — so this
  // contribution was silently dead. The ledger reads the real quantities
  // (surplusPct/deficitPct), so a food deficit now actually lowers food_security.
  const food = foodLedger(s);
  if (food.present) {
    if (food.surplusPct >= 40) {
      score += 5; push(contributors, 'economicState.foodSecurity', 'surplus', +5, `${food.surplusPct}% grain surplus.`);
    }
    if (food.deficitPct > 0) {
      const d = food.deficitPct > 40 ? 15 : food.deficitPct > 15 ? 10 : 5;
      score -= d; push(contributors, 'economicState.foodSecurity', 'deficit', -d, `${food.deficitPct}% food deficit.`);
    }
  }

  return { score, contributors };
}

/**
 * @param {CausalSettlementSource} s
 * @returns {DeriverResult}
 */
function deriveLaborCapacity(s) {
  let score = 50;
  /** @type {CausalContributor[]} */
  const contributors = [];

  // Population scaling
  const pop = populationOf(s);
  if (pop >= 5000) { score += 10; push(contributors, 'population', 'broad', +10, `Population ${pop} provides a deep labor pool.`); }
  else if (pop >= 1000) { score += 5; push(contributors, 'population', 'adequate', +5, `Population ${pop} carries enough hands.`); }
  else if (pop > 0 && pop < 200) { score -= 5; push(contributors, 'population', 'thin', -5, `Population ${pop} leaves little slack.`); }

  score += applyConditions(s, contributors, 'labor_capacity', {
    scale: 20, mode: 'drain', effect: 'pressure', tail: 'reduces available labor.',
  });

  return { score, contributors };
}

/**
 * @param {CausalSettlementSource} s
 * @returns {DeriverResult}
 */
function derivePublicLegitimacy(s) {
  let score = 50;
  /** @type {CausalContributor[]} */
  const contributors = [];

  // Read the conserved legitimacy quantity via the governance ledger. This lens IS
  // legitimacy, so it uses the score verbatim (other lenses weight it differently).
  const gov = governanceLedger(s);
  if (gov.present) {
    score = gov.legitimacyScore;
    push(contributors, 'powerStructure.publicLegitimacy', gov.legitimacyLabel || 'measured', 0,
      `Governing legitimacy score: ${gov.legitimacyScore} (${gov.legitimacyLabel || 'unbanded'}).`);
  }

  score += applyConditions(s, contributors, 'public_legitimacy', {
    scale: 15, effect: ['lift', 'pressure'], tail: ['lifts public legitimacy.', 'erodes public legitimacy.'],
  });

  // A monster-plagued region indicts the crown only when the garrison
  // visibly cannot answer it — plagued threat over a weak measured defense
  // reads as "the crown cannot protect us." Small and conservative; a strong
  // garrison under the same threat pays nothing (protection delivered).
  if (s.config?.monsterThreat === 'plagued') {
    const led = defenseLedger(s);
    if (led.present && led.readinessScore < 40) {
      score -= 6;
      push(contributors, 'config.monsterThreat', 'unprotected', -6,
        `Monsters plague the region and defense readiness is ${led.readinessScore}. The crown cannot protect its people.`);
    }
  }

  return { score, contributors };
}

/**
 * @param {CausalSettlementSource} s
 * @returns {DeriverResult}
 */
function deriveRulingAuthority(s) {
  let score = 50;
  /** @type {CausalContributor[]} */
  const contributors = [];

  // Combination of governing legitimacy + governing faction power. Legitimacy via the
  // conserved governance ledger; this lens weights it 0.5.
  const gov = governanceLedger(s);
  if (gov.present) {
    const c = Math.round((gov.legitimacyScore - 50) * 0.5);
    if (c !== 0) {
      score += c;
      push(contributors, 'powerStructure.publicLegitimacy', gov.legitimacyLabel || 'measured', c,
        `Governing legitimacy ${gov.legitimacyScore} contributes ${c >= 0 ? '+' : ''}${c}.`);
    }
  }

  // Identify the governing faction's power. Match the SAME way the precedent
  // does (timeProgression.js:194/195, factionProfile.js legitimacyFor):
  // governingName is the governing roster faction's EXACT name, so an exact
  // case-insensitive equality against the profile's name is the correct join.
  // The old `lower.includes(firstToken)` matched any faction sharing a leading
  // token — e.g. a "Merchant League" government wrongly drew its authority from
  // a "Merchant Guilds" faction. A whole-word startsWith is kept as a narrow
  // fallback ONLY when no exact name matches, so legacy rosters whose
  // governingName carries a trailing qualifier (e.g. "Merchant Guilds Council"
  // vs a "Merchant Guilds" faction) still resolve — but it is anchored on a
  // word boundary so it can never re-introduce the substring misroute.
  const profiles = cachedFactionProfiles(s);
  const governingName = s.powerStructure?.governingName || '';
  if (governingName && profiles.length) {
    const lower = governingName.toLowerCase();
    let govFaction = profiles.find(p => p.name && p.name.toLowerCase() === lower);
    if (!govFaction) {
      govFaction = profiles.find(p => {
        if (!p.name) return false;
        const pn = p.name.toLowerCase();
        // Whole-word startsWith: governingName begins with the faction name
        // followed by a word boundary (or is exactly it), never mid-token.
        return lower === pn || lower.startsWith(`${pn} `);
      });
    }
    if (govFaction && typeof govFaction.power === 'number') {
      const c = Math.round((govFaction.power - 30) * 0.5);
      if (c !== 0) {
        score += c;
        push(contributors, govFaction.id, 'governing_power', c, `${govFaction.name} commands power ${govFaction.power}.`);
      }
    }
  }

  // Conditions that DECLARE ruling_authority (lift rebuilds, pressure cripples).
  score += applyConditions(s, contributors, 'ruling_authority', {
    scale: 18, effect: ['restored', 'undermined'], tail: ['rebuilds the ability to govern.', 'cripples the ability to govern.'],
  });

  return { score, contributors };
}

/**
 * @param {CausalSettlementSource} s
 * @returns {DeriverResult}
 */
function deriveFactionPower(s) {
  let score = 50;
  /** @type {CausalContributor[]} */
  const contributors = [];

  // Healthy faction system = balance with a clear governing center.
  // We use the power-share spread among profiles.
  const profiles = cachedFactionProfiles(s);
  if (profiles.length === 0) {
    return { score: 50, contributors: [{ source: 'powerStructure', effect: 'neutral', delta: 0, reason: 'No factions to evaluate.' }] };
  }
  const powers = profiles.map(p => p.power || 0);
  const total = powers.reduce((a, b) => a + b, 0);
  const top = Math.max(...powers);
  const dominantShare = total > 0 ? top / total : 0;

  if (dominantShare >= 0.55) {
    score += 8;
    push(contributors, 'powerStructure.factions', 'concentrated', +8,
      `Top faction holds ${Math.round(dominantShare * 100)}% of power.`);
  } else if (dominantShare <= 0.30) {
    score -= 8;
    push(contributors, 'powerStructure.factions', 'fractured', -8,
      `No faction holds clear primacy (top share ${Math.round(dominantShare * 100)}%).`);
  }

  score += applyConditions(s, contributors, 'faction_power', {
    scale: 15, mode: 'drain', effect: 'destabilized', tail: 'destabilizes the faction system.',
  });

  return { score, contributors };
}

/**
 * @param {CausalSettlementSource} s
 * @returns {DeriverResult}
 */
function deriveTradeConnectivity(s) {
  let score = 50;
  /** @type {CausalContributor[]} */
  const contributors = [];

  // Trade access from generator config. Canonical semantics map EVERY emitted
  // value (road/river/crossroads/port/coastal/isolated) and the legacy
  // major/minor/standard/none into a tier + score — so river/crossroads/port no
  // longer fall through to a neutral 0 (the bug this fixed).
  const trade = s.config?.tradeRouteAccess || s.tradeRouteAccess;
  const tradeSem = tradeRouteSemantics(trade);
  if (tradeSem.connectivity !== 0) {
    score += tradeSem.connectivity;
    push(contributors, 'config.tradeRouteAccess', tradeSem.tier, tradeSem.connectivity,
      tradeSem.isolated ? 'Settlement is isolated from regional trade.'
        : tradeSem.tier === 'major' ? `Settlement sits on a major trade route (${trade}).`
        : `Settlement has ${trade} trade access.`);
  }

  // Trade supply chains. The real need-group key is 'trade_entrepot'
  // (supplyChainData.js) — the old 'trade' filter matched nothing, so
  // trade chains never fed connectivity at all (Cohesion Wave 5 #2).
  /** @type {DerivedSupplyChainState[]} */
  const chains = deriveAllSupplyChainStates(s);
  const tradeChains = chains.filter(c => c.needKey === 'trade_entrepot');
  for (const c of tradeChains) {
    if (c.status === 'stable') { score += 5; push(contributors, c.id, 'stable', +5, `${c.name} runs normally.`); }
    // @ts-ignore -- redundant guard (the else-branch already excludes 'stable'); kept byte-identical for the golden master.
    else if (c.status !== 'stable') {
      const m = c.status === 'blocked' || c.status === 'collapsing' ? -18 : -8;
      score += m;
      push(contributors, c.id, c.status, m, `${c.name} is ${c.status}.`);
    }
  }

  // A lifted siege/occupation REOPENS routes (lift restores, pressure cuts).
  score += applyConditions(s, contributors, 'trade_connectivity', {
    scale: 18, effect: ['restored', 'cut'], tail: ['reopens trade flows.', 'disrupts trade flows.'],
  });

  return { score, contributors };
}

// economic_capacity — live war-affordability / economic slack. prosperity +
// economicComplexity are generation-frozen, so they seed the BASELINE; active
// conditions (war_drain / vassal_extraction / market_shock / occupation
// extraction) move it live. This — NOT the frozen prosperity string and NOT
// trade_connectivity — is what the war homeostasis loop and the trade-war
// contest read. (See docs/GEOPOLITICAL_WAR_LAYER.md.)
const PROSPERITY_BASE = Object.freeze({
  impoverished: 22, subsistence: 28, struggling: 30, poor: 38, modest: 46,
  moderate: 50, comfortable: 62, prosperous: 74, wealthy: 86, thriving: 88,
});
/**
 * @param {CausalSettlementSource} s
 * @returns {DeriverResult}
 */
function deriveEconomicCapacity(s) {
  /** @type {CausalContributor[]} */
  const contributors = [];
  const eco = s.economicState;
  const prosperity = String(eco?.prosperity || '').trim();
  const base = /** @type {Record<string, number>} */ (PROSPERITY_BASE)[prosperity.toLowerCase()] ?? 50;
  let score = base;
  push(contributors, 'economicState.prosperity', prosperity || 'unknown', base - 50,
    prosperity ? `Prosperity is ${prosperity}.` : 'Prosperity unrecorded: neutral baseline.');

  // Diversified economies absorb shocks; concentrated/specialized ones are brittle.
  const complexity = String(eco?.economicComplexity || '').toLowerCase();
  if (/diversified/.test(complexity)) {
    score += 6; push(contributors, 'economicState.economicComplexity', 'diversified', +6, 'A diversified economy is resilient.');
  } else if (/concentrated|specialized/.test(complexity)) {
    score -= 6; push(contributors, 'economicState.economicComplexity', 'concentrated', -6, 'A concentrated economy is brittle.');
  }

  // Active conditions move economic capacity live — the war-layer seam.
  // war_spoils is the INVERSE of war_drain/war_exhaustion: the CAPPED benefit a
  // stabilized occupation yields RELIEVES the occupier's war economy rather than
  // draining it — the ONLY economic-capacity condition with a POSITIVE magnitude.
  // The occupation layer HARD-CAPS its severity (anti-snowball), and it rides a
  // lighter scale than the drain (war is never free): occupations soften, never
  // erase, the cost of campaigning. Consumed by the `special` seam BEFORE the
  // affectedSystems filter, preserving the original in-loop interleave order.
  score += applyConditions(s, contributors, 'economic_capacity', {
    scale: 18, mode: 'drain', effect: 'drain', tail: 'drains the war economy.',
    ownsArchetype: 'war_spoils',
    special: (cond) => {
      if (cond.archetype !== 'war_spoils') return null;
      const magnitude = Math.round(cond.severity * 12);
      if (magnitude !== 0) push(contributors, cond.id, 'spoils', +magnitude, `${cond.label} sustains the war economy (capped).`);
      return magnitude;
    },
  });

  return { score, contributors };
}

// law_order — how lawful / ordered the settlement is. Higher = a strong rule of
// law (courts, watch, an authoritative government, low corruption); lower = an
// anarchic / lawless settlement where crime and corruption run the streets. The
// 16th SYSTEM_VARIABLE, added the same way economic_capacity was — purely
// ADDITIVE: it reads only signals other derivers already read (governance
// ledger, defense ledger's internal-order score, the safetyProfile crime
// signals, the criminal faction, and the institution roster), so the existing
// 15 scores are byte-identical. The lawful/chaotic deity axis couples INTO this.
//
// Government archetypes that concentrate authority (autocracy, military rule,
// theocracy, monarchy/lordship) lift law_order; anarchic / weakly-governed forms
// (communes, free cities, peasant/frontier governance) lower it. A government
// string absent from BOTH lists contributes nothing.
const LAWFUL_GOVERNMENT_PATTERN = /autocra|authoritarian|militar|junta|despot|tyrann|imperial|monarch|lordship|theocra|magocra|ecclesiastical|magistrat/i;
const ANARCHIC_GOVERNMENT_PATTERN = /anarch|commune|free city|free council|peasant|frontier|lawless|warlord|failed/i;
// (Law-and-order institution classification lives in domain/institutionClassify.js
// as the id-first, rename-proof institutionIsLawOrder — used below.)

/**
 * @param {CausalSettlementSource} s
 * @returns {DeriverResult}
 */
function deriveLawOrder(s) {
  let score = 50;
  /** @type {CausalContributor[]} */
  const contributors = [];

  // Governing legitimacy: a legitimate order can enforce its law; a contested
  // one cannot. Weighted 0.4 (lighter than ruling_authority's 0.5 — legitimacy
  // is necessary but not sufficient for order). Reads the conserved quantity.
  const gov = governanceLedger(s);
  if (gov.present) {
    const c = Math.round((gov.legitimacyScore - 50) * 0.4);
    if (c !== 0) {
      score += c;
      push(contributors, 'powerStructure.publicLegitimacy', gov.legitimacyLabel || 'measured', c,
        `Governing legitimacy ${gov.legitimacyScore} underwrites the rule of law.`);
    }
  }

  // Government archetype — authoritarian/lawful forms enforce order; anarchic
  // forms cede it. Read the persisted government TYPE string (powerGenerator
  // returns it on powerStructure.government).
  const governmentLabel = String(s?.powerStructure?.government || s?.config?.government || '');
  if (governmentLabel) {
    if (LAWFUL_GOVERNMENT_PATTERN.test(governmentLabel)) {
      score += 8;
      push(contributors, 'powerStructure.government', 'authoritarian', +8,
        `${governmentLabel} concentrates authority and enforces order.`);
    } else if (ANARCHIC_GOVERNMENT_PATTERN.test(governmentLabel)) {
      score -= 8;
      push(contributors, 'powerStructure.government', 'anarchic', -8,
        `${governmentLabel} disperses authority, leaving order loosely held.`);
    }
  }

  // Internal security / public order — the defense ledger's `internal` score is
  // exactly "internal security / public order", so it is the most direct order
  // signal we have. Weighted 0.4 off its 50 baseline.
  const led = defenseLedger(s);
  if (led.present) {
    const c = Math.round((led.internal - 50) * 0.4);
    if (c !== 0) {
      score += c;
      push(contributors, 'defenseProfile.scores.internal', 'public_order', c,
        `Internal-security score ${led.internal} reflects how well order is kept.`);
    }
  }

  // Law/order institutions — courts, the watch, magistrates, gaols give the law
  // teeth. Id-first (rename-proof) via institutionClassify; a DM-renamed-but-stamped
  // court still counts. id-match === the old name rule for the current corpus.
  // LIVE roster only — a calamity-razed court/gaol/watch upholds no law (ruin-filter class).
  const institutions = liveInstitutions(s);
  const lawCount = institutions.filter(i => institutionIsLawOrder(/** @type {{ catalogId?: string, name?: string }} */ (i))).length;
  if (lawCount >= 2) {
    score += 10; push(contributors, 'institutions', 'broad', +10, `${lawCount} law-and-order institutions uphold the courts and the watch.`);
  } else if (lawCount === 1) {
    score += 5; push(contributors, 'institutions', 'limited', +5, 'A single law-and-order institution maintains the peace.');
  } else if (institutions.length > 0) {
    score -= 6; push(contributors, 'institutions', 'absent', -6, 'No courts or watch. Order rests on informal mechanisms.');
  }

  // Criminal / corruption signals erode the rule of law. Black-market capture is
  // a direct measure of how much crime has displaced lawful commerce; a powerful
  // criminal faction means the streets answer to it, not the law.
  const safety = s?.economicState?.safetyProfile || s?.safetyProfile;
  if (safety && typeof safety.blackMarketCapture === 'number' && safety.blackMarketCapture > 0) {
    const c = Math.round(safety.blackMarketCapture * 0.3);
    if (c !== 0) {
      score -= c;
      push(contributors, 'safetyProfile.blackMarketCapture', 'crime', -c,
        `Black-market capture at ${safety.blackMarketCapture}% undermines lawful order.`);
    }
  }
  const profiles = cachedFactionProfiles(s);
  const criminal = profiles.find(p => p.archetype === 'criminal');
  if (criminal && typeof criminal.power === 'number' && criminal.power > 30) {
    const c = Math.round((criminal.power - 30) * 0.35);
    if (c !== 0) {
      score -= c;
      push(contributors, criminal.id, 'criminal_power', -c, `${criminal.name} (power ${criminal.power}) rivals the law.`);
    }
  }

  // Active conditions move law_order live (the war/religion-layer seam, mirroring
  // deriveEconomicCapacity). corruption_exposed / unrest / occupation-style
  // archetypes that declare law_order press here; signed by the condition's
  // status. [domain-top-state-2] succession_void residual conditions now DECLARE
  // law_order (its stale →criminal_opportunity alias was dropped), so this scan is
  // live for lawless-interregnum settlements; a condition that does NOT declare
  // law_order is still ignored (byte-identical for every other settlement).
  score += applyConditions(s, contributors, 'law_order', {
    scale: 15, effect: ['restored', 'eroded'], tail: ['restores the rule of law.', 'erodes the rule of law.'],
  });

  // Deity term — DORMANT until assigned, exactly like the deity term in
  // deriveReligiousAuthority. Only a settlement with an embedded
  // primaryDeitySnapshot whose lawAxis is lawful/chaotic reads this; a deity-free
  // settlement, a legacy 3-axis deity (no lawAxis ⇒ dir 0), and a law-NEUTRAL
  // deity all see NONE of it ⇒ byte-identical. A lawful patron RAISES order; a
  // chaotic patron LOWERS it. This is the law-axis lever; the good/evil axis
  // touches corruption onset/exposure through a SEPARATE path (corruption.js), so
  // the two never double-count.
  const lawDir = deityLawDirection(s?.config?.primaryDeitySnapshot);
  if (lawDir !== 0) {
    // Site #9 (a LAW-derived site): piety amplifies the law swing, dampened on the
    // LAW channel by an opposed runner-up (megaphoneLaw) — the orderly rival muting
    // a chaotic patron's erosion, or the chaotic rival muting a lawful patron's
    // grip, per the per-axis opposed-runner-up rule. amp = 1.0 (no record) ⇒
    // Math.round(±swing) = the original integer lift, suffix omitted ⇒ byte-identical.
    const { localMult, megaphoneLaw } = pietyLocalAmp(s);
    const amp = localMult * megaphoneLaw;
    const lift = Math.round(lawDir * DEITY_LAW_TUNING.lawOrderSwing * amp);
    score += lift;
    const deity = s.config?.primaryDeitySnapshot;
    push(contributors, deity?._deityRef || 'primaryDeity', lawDir > 0 ? 'lawful_patron' : 'chaotic_patron', lift,
      `${deity?.name || 'The patron deity'} (${deity?.lawAxis}) ${lawDir > 0
        ? 'strengthens law & order'
        : 'erodes order and tolerates corruption'}${amp !== 1 ? ` (piety ×${amp.toFixed(2)})` : ''}.`);
  }

  return { score, contributors };
}

/**
 * @param {CausalSettlementSource} s
 * @returns {DeriverResult}
 */
function deriveHealingCapacity(s) {
  let score = 50;
  /** @type {CausalContributor[]} */
  const contributors = [];

  // Institutions whose names suggest healing capacity (canonical classifier via healingLedger).
  // Offered healing services rescue the harsh "absent" penalty (informal care; P3.3b Stage 4b):
  // a town providing wound care / medical care / relief is not "no healing", just not robust.
  const heal = healingLedger(/** @type {import('./healingLedger.js').HealingSettlementView} */ (s));
  const healers = heal.healerCount;
  if (healers >= 3) {
    score += 12; push(contributors, 'institutions', 'broad', +12, `${healers} healing-capable institutions present.`);
  } else if (healers >= 1) {
    score += 6; push(contributors, 'institutions', 'limited', +6, `${healers} healing-capable institution(s).`);
  } else if (heal.services.length > 0) {
    score -= 2; push(contributors, 'availableServices.healing', 'services_only', -2, `${heal.services.length} healing service(s) offered, but no dedicated institution.`);
  } else {
    score -= 10; push(contributors, 'institutions', 'absent', -10, 'No dedicated healing institutions found.');
  }

  score += applyConditions(s, contributors, 'healing_capacity', {
    scale: 20, mode: 'drain', effect: 'overrun', tail: 'overwhelms healing capacity.',
  });

  return { score, contributors };
}

/**
 * @param {CausalSettlementSource} s
 * @returns {DeriverResult}
 */
function deriveDefenseReadiness(s) {
  let score = 50;
  /** @type {CausalContributor[]} */
  const contributors = [];

  const def = s.defenseProfile || {};
  // Read the persisted numeric readiness via the conserved defense ledger.
  const led = defenseLedger(s);
  if (led.present) {
    const c = Math.round((led.readinessScore - 50) * 0.6);
    score += c;
    push(contributors, 'defenseProfile.readiness.score', 'measured', c,
      `Defense readiness score: ${led.readinessScore}.`);
  }
  // Walls present — read the classified walls DATA, not a stringify regex
  // (the profile always contains the literal key "walls", so the old regex
  // granted every settlement this bonus).
  if (defenseProfileHasWalls(def)) {
    score += 6;
    push(contributors, 'defenseProfile', 'walled', +6, 'Defensive walls in place.');
  }

  // Active conditions (lift restores, pressure strains)
  score += applyConditions(s, contributors, 'defense_readiness', {
    scale: 12, effect: ['recovering', 'strained'], tail: ['restores defense readiness.', 'taxes defense readiness.'],
  });

  return { score, contributors };
}

/**
 * @param {CausalSettlementSource} s
 * @returns {DeriverResult}
 */
function deriveCriminalOpportunity(s) {
  let score = 50;
  /** @type {CausalContributor[]} */
  const contributors = [];

  // Direct: blackMarketCapture if available
  const safety = s.economicState?.safetyProfile || s.safetyProfile || {};
  if (typeof safety.blackMarketCapture === 'number') {
    const c = Math.round(safety.blackMarketCapture * 0.4);
    score += c;
    push(contributors, 'safetyProfile.blackMarketCapture', 'capture', c,
      `Black-market capture at ${safety.blackMarketCapture}%.`);
  }

  // Faction power: criminal factions
  const profiles = cachedFactionProfiles(s);
  const criminal = profiles.find(p => p.archetype === 'criminal');
  if (criminal && typeof criminal.power === 'number') {
    const c = Math.round((criminal.power - 20) * 0.4);
    if (c !== 0) {
      score += c;
      push(contributors, criminal.id, 'criminal_power', c, `${criminal.name} influence is ${criminal.power}.`);
    }
  }

  // Active conditions — pressure RAISES criminal opportunity (gain mode).
  score += applyConditions(s, contributors, 'criminal_opportunity', {
    scale: 15, mode: 'gain', effect: 'opening', tail: 'opens new criminal opportunities.',
  });

  return { score, contributors };
}

/**
 * @param {CausalSettlementSource} s
 * @returns {DeriverResult}
 */
function deriveReligiousAuthority(s) {
  let score = 50;
  /** @type {CausalContributor[]} */
  const contributors = [];

  const profiles = cachedFactionProfiles(s);
  const religious = profiles.find(p => p.archetype === 'religious');
  if (religious && typeof religious.power === 'number') {
    const c = Math.round((religious.power - 20) * 0.6);
    score += c;
    push(contributors, religious.id, 'religious_power', c, `${religious.name} carries power ${religious.power}.`);
  } else {
    score -= 5;
    push(contributors, 'powerStructure', 'no_religious', -5, 'No religious faction in the power structure.');
  }

  // Active conditions move religious authority live — the religion-layer seam
  // (mirrors deriveEconomicCapacity's condition scan). regional_religious_pressure
  // now declares `religious_authority`, so a regional spread presses the substrate
  // here. Filtered on the affectedSystems contract like every other deriver;
  // signed by the condition's status.
  score += applyConditions(s, contributors, 'religious_authority', {
    scale: 15, mode: 'gain', effect: 'religious_pressure', tail: 'amplifies religious authority.',
  });

  // Deity term — DORMANT until assigned. Only a settlement with an embedded
  // primaryDeitySnapshot (the embed-on-assign bridge) reads this; a deity-free
  // settlement sees NONE of it, so its score is unchanged except by the condition
  // scan above. Tier-scaled: a major god lifts more than a cult. The snapshot is
  // self-contained — we never touch customContent here. DEITY_RANK_AUTHORITY is
  // imported from the deityConstants.js leaf (the single source; deityEffects.js
  // re-exports the same object for display consumers).
  const deity = s.config?.primaryDeitySnapshot;
  const rankLift = deity ? /** @type {Record<string, number>} */ (DEITY_RANK_AUTHORITY)[String(deity.rankAxis)] : undefined;
  if (deity && rankLift != null) {
    // Site #6: a devout settlement's patron anchors authority harder — the LOCAL
    // piety amplifier (localMult) scales the rank lift, inside the score clamp.
    // localMult = 1.0 (no projected record) ⇒ Math.round(rankLift) = rankLift and
    // the suffix is omitted ⇒ byte-identical for generation / deity-free / tick-0.
    const { localMult } = pietyLocalAmp(s);
    const lift = Math.round(rankLift * localMult);
    score += lift;
    push(contributors, deity._deityRef || 'primaryDeity', 'deity_patronage', lift,
      `${deity.name || 'The patron deity'} (${deity.rankAxis}) anchors religious authority${localMult !== 1 ? ` (piety ×${localMult.toFixed(2)})` : ''}.`);
  }

  return { score, contributors };
}

/**
 * @param {CausalSettlementSource} s
 * @returns {DeriverResult}
 */
function deriveHousingPressure(s) {
  // INVERTED: high score = LOW pressure (consistent with the other vars
  // where higher = better). Variable name kept for roadmap parity.
  let score = 50;
  /** @type {CausalContributor[]} */
  const contributors = [];

  const pop = populationOf(s);
  // Without a real housing dataset, use population×stressors heuristic.
  const stressors = canonStressors(s);
  // 'migration' added: /migrant/ does not substring-match 'mass_migration',
  // so the generation stress type never registered as housing pressure.
  // @ts-ignore -- canonStressors() returns Array<object>: entries are heterogeneous (string | {type} | {name}); String() handles every shape.
  const refugeeStress = stressors.find(st => /refugee|displaced|influx|migrant|migration/i.test(String(st?.type || st?.name || st)));
  if (refugeeStress) {
    score -= 18;
    push(contributors, 'stressors.refugee', 'influx', -18, 'Refugee influx strains available housing.');
  } else {
    // Wave 7: migration that arrives as a CONDITION — a regional spread or an
    // authored migration event produces regional_migration_pressure without
    // any local stressor — must still press housing, modestly (a default-
    // severity wave reads -6 against the local stressor's -18). Skipped when
    // the stressor registered above: promotion mints this same archetype from
    // that stressor, and counting both would double-penalize one crisis.
    // Filtered on the affectedSystems contract like every other deriver, so
    // the explanation/AI surfaces list exactly what the substrate charges.
    score += applyConditions(s, contributors, 'housing_pressure', {
      scale: 12, mode: 'drain', effect: 'influx', tail: 'pushes arrivals into limited housing.',
    });
  }
  if (pop >= 5000) { score -= 4; push(contributors, 'population', 'dense', -4, `Population ${pop} pushes housing demand.`); }
  return { score, contributors };
}

/**
 * @param {CausalSettlementSource} s
 * @returns {DeriverResult}
 */
function deriveInfrastructureCondition(s) {
  let score = 50;
  /** @type {CausalContributor[]} */
  const contributors = [];

  // Anchor infrastructure to the persisted defense scores via the conserved defense ledger:
  // military already folds in walls/fortification-chain health, economic folds in siege
  // logistics, so their mean is a real "built robustness" signal.
  const led = defenseLedger(s);
  if (led.present) {
    const infra = (led.military + led.economic) / 2;
    const c = Math.round((infra - 50) * 0.6);
    score += c;
    push(contributors, 'defenseProfile.scores', 'measured', c,
      `Fortification + logistics scores imply infrastructure ~${Math.round(infra)}.`);
  } else {
    // No defense profile (un-generated / legacy) — infer from LIVE institution count
    // (ruined rows must not inflate inferred infrastructure; ruin-filter class).
    const instCount = liveInstitutions(s).length;
    if (instCount >= 15) { score += 10; push(contributors, 'institutions', 'dense', +10, `${instCount} institutions imply robust infrastructure.`); }
    else if (instCount <= 5) { score -= 6; push(contributors, 'institutions', 'thin', -6, `${instCount} institutions imply thin infrastructure.`); }
  }

  return { score, contributors };
}

/**
 * @param {CausalSettlementSource} s
 * @returns {DeriverResult}
 */
function deriveMagicalStability(s) {
  let score = 50;
  /** @type {CausalContributor[]} */
  const contributors = [];

  // Read via the conserved magic ledger (canonical band vocabulary). Behaviour-preserving:
  // an un-generated settlement keeps the old 'low' default; 'medium'/'none' stay neutral for
  // stability exactly as before, while high lifts and low limits it.
  const m = magicLedger(s);
  const band = m.present ? m.magicLevel : 'low';
  if (band === 'high') { score += 10; push(contributors, 'config.priorityMagic', 'high', +10, `High magic investment supports arcane stability.`); }
  else if (band === 'low') { score -= 5; push(contributors, 'config.priorityMagic', 'low', -5, `Low magic investment limits arcane resilience.`); }

  // Arcane factions present?
  const profiles = cachedFactionProfiles(s);
  const arcane = profiles.find(p => p.archetype === 'arcane');
  if (arcane) {
    score += 5;
    push(contributors, arcane.id, 'arcane_present', +5, `${arcane.name} provides arcane oversight.`);
  }

  // Active conditions that affect magical_stability (the magical_instability
  // archetype the deadzone/instability stressor family promotes to). Until this
  // scan, magical_stability was the one substrate variable no condition reached.
  score += applyConditions(s, contributors, 'magical_stability', {
    scale: 15, mode: 'drain', effect: 'destabilized', tail: 'destabilizes the local weave.',
  });

  return { score, contributors };
}

/**
 * @param {CausalSettlementSource} s
 * @returns {DeriverResult}
 */
function deriveSocialTrust(s) {
  let score = 50;
  /** @type {CausalContributor[]} */
  const contributors = [];

  // Strongly downstream of public legitimacy. Read via the conserved governance
  // ledger (like derivePublicLegitimacy / deriveRulingAuthority) so legacy saves
  // that persist a bare numeric legitimacy still move social_trust — previously
  // this lens silently ignored a collapsing government on those saves.
  const gov = governanceLedger(s);
  if (gov.present) {
    const c = Math.round((gov.legitimacyScore - 50) * 0.4);
    score += c;
    push(contributors, 'powerStructure.publicLegitimacy', 'tracks_legitimacy', c,
      `Public legitimacy ${gov.legitimacyScore} colors trust.`);
  }

  // Conditions that affect social_trust
  score += applyConditions(s, contributors, 'social_trust', {
    scale: 15, mode: 'drain', effect: 'erodes', tail: 'erodes communal trust.',
  });

  // Dominant-NPC removal stress
  // @ts-ignore -- deriveAllNpcProfiles (npcProfile.js, owned elsewhere) is still untyped; once it returns NpcProfile[] this ignore is inert.
  const dominantNpcs = deriveAllNpcProfiles(s).filter(p => p.rank === 'dominant');
  if (dominantNpcs.length === 0) {
    score -= 4;
    push(contributors, 'npcs', 'no_dominant', -4, 'No dominant figures anchor public confidence.');
  }

  return { score, contributors };
}

// ── Composer ─────────────────────────────────────────────────────────────

/** @type {Readonly<Record<string, (s: CausalSettlementSource) => DeriverResult>>} */
const DERIVERS = Object.freeze({
  food_security:           deriveFoodSecurity,
  labor_capacity:          deriveLaborCapacity,
  public_legitimacy:       derivePublicLegitimacy,
  ruling_authority:        deriveRulingAuthority,
  faction_power:           deriveFactionPower,
  trade_connectivity:      deriveTradeConnectivity,
  healing_capacity:        deriveHealingCapacity,
  defense_readiness:       deriveDefenseReadiness,
  criminal_opportunity:    deriveCriminalOpportunity,
  religious_authority:     deriveReligiousAuthority,
  housing_pressure:        deriveHousingPressure,
  infrastructure_condition: deriveInfrastructureCondition,
  magical_stability:       deriveMagicalStability,
  social_trust:            deriveSocialTrust,
  economic_capacity:       deriveEconomicCapacity,
  law_order:               deriveLawOrder,
});

/**
 * Orient a raw 0-100 variable score onto the BAND axis. The band ladder is
 * higher-is-better; a lower_is_better variable therefore walks it from the other
 * end. The single source for that flip, so finalizeVariable and every fallback
 * band computed elsewhere in this file cannot drift apart.
 * @param {string} name
 * @param {number} score
 * @returns {number}
 */
function orientCausalScore(name, score) {
  return variablePolarity(name) === 'lower_is_better' ? 100 - score : score;
}

/**
 * @param {string} name
 * @param {number} raw
 * @param {CausalContributor[]} contributors
 * @returns {SystemVariable}
 */
function finalizeVariable(name, raw, contributors) {
  // A non-finite raw (malformed contributor) would clamp to NaN and poison the
  // band + every downstream delta; fall back to the 50 neutral deriver baseline.
  const safeRaw = Number.isFinite(raw) ? raw : 50;
  const score = Math.max(0, Math.min(100, Math.round(safeRaw)));
  // Band off the polarity-ADJUSTED score. criminal_opportunity is the lone
  // lower-is-better variable: a high score means rampant crime, which must read
  // as a problem band (strained/critical), not "surplus"/Abundant. The raw score
  // is kept as-is — pressureModel and the delta renderers handle polarity via
  // variablePolarity() themselves; only the qualitative band flips here.
  const banded = orientCausalScore(name, score);
  return {
    variable: name,
    score,
    band: causalBand(banded),
    contributors,
  };
}

/**
 * Derive a single named system variable. Useful when a consumer only
 * cares about one dimension (e.g. the AI overlay grounding a claim
 * about food security).
 *
 * @param {string} variable   One of SYSTEM_VARIABLES.
 * @param {CausalSettlementSource | null | undefined} settlement
 * @returns {SystemVariable | null}    SystemVariable, or null for unknown variable.
 */
export function deriveSystemVariable(variable, settlement) {
  if (!variable || !DERIVERS[variable]) return null;
  if (!settlement) return finalizeVariable(variable, 50, []);
  const { score, contributors } = DERIVERS[variable](settlement);
  return finalizeVariable(variable, score, contributors);
}

/**
 * Derive the full causal substrate.
 *
 * @param {CausalSettlementSource | null | undefined} settlement
 * @returns {CausalState} {
 *   variables: { [name]: SystemVariable },
 *   bands:     { [name]: CausalBand },
 *   scores:    { [name]: number },
 *   summary:   { surplus: string[], adequate: string[], strained: string[],
 *                critical: string[], collapsed: string[] },
 * }
 */
export function deriveCausalState(settlement) {
  /** @type {Record<string, SystemVariable>} */
  const variables = {};
  for (const name of SYSTEM_VARIABLES) {
    if (!settlement) {
      variables[name] = finalizeVariable(name, 50, []);
    } else {
      const { score, contributors } = DERIVERS[name](settlement);
      variables[name] = finalizeVariable(name, score, contributors);
    }
  }
  /** @type {Record<string, CausalBand>} */
  const bands = {};
  /** @type {Record<string, number>} */
  const scores = {};
  /** @type {Record<CausalBand, string[]>} */
  const summary = { surplus: [], adequate: [], strained: [], critical: [], collapsed: [] };
  for (const name of SYSTEM_VARIABLES) {
    const v = variables[name];
    bands[name] = v.band;
    scores[name] = v.score;
    summary[v.band].push(name);
  }
  return { variables, bands, scores, summary };
}

// ── Diagnostic helpers ───────────────────────────────────────────────────

/**
 * Convenience accessor — band for one variable.
 * @param {CausalSettlementSource | null | undefined} settlement
 * @param {string} variable
 * @returns {CausalBand | null}
 */
export function bandForVariable(settlement, variable) {
  const v = deriveSystemVariable(variable, settlement);
  return v ? v.band : null;
}

/**
 * Returns all variables currently at strained/critical/collapsed bands.
 * @param {CausalSettlementSource | null | undefined} settlement
 * @returns {string[]}
 */
export function pressuresOn(settlement) {
  const state = deriveCausalState(settlement);
  return [...state.summary.strained, ...state.summary.critical, ...state.summary.collapsed];
}

// THE LOWER-IS-BETTER LADDER — the display word for every band a lower_is_better
// variable can carry, worst to best. Their band is computed off the INVERTED
// score, so the raw band word says the opposite of the truth at BOTH ends:
//   • a 'collapsed'/'critical' band means the underlying value (e.g.
//     criminal_opportunity) is HIGH, and "Collapsed: criminal_opportunity" reads
//     as a positive (crime collapsed = good) when it means rampant crime;
//   • a benign 'adequate'/'surplus' band means the value is LOW, and the pill
//     "Criminal opportunity · ADEQUATE" reads as the crime being adequate.
// The first three words closed the problem end. The benign two close the other,
// so no band can reach a reader carrying the raw word. The ladder is total over
// CAUSAL_BANDS by construction, and the walker
// (tests/lint/bandPolaritySingleSourceScan.test.js) holds it that way.
const LOWER_IS_BETTER_BAND_TERM = Object.freeze({
  collapsed: 'Rampant',
  critical:  'Acute',
  strained:  'Elevated',
  adequate:  'Contained',
  surplus:   'Negligible',
});

/**
 * Polarity-correct display word for a variable's band — the SINGLE source every
 * renderer, summarizeCausalState and the simulation causal view route through, so
 * the lower_is_better inversion lives in exactly one place. Higher-is-better bands
 * read the raw word; a lower_is_better band is computed off the INVERTED score
 * (finalizeVariable) and is re-worded at both ends of the ladder: 'collapsed' is
 * crime RAMPANT rather than gone, and 'adequate' is crime CONTAINED rather than
 * crime being an adequate amount.
 * @param {string} name  substrate variable name
 * @param {string} band  surplus/adequate/strained/critical/collapsed
 * @returns {string}
 */
export function causalBandWord(name, band) {
  if (variablePolarity(name) === 'lower_is_better') {
    return /** @type {Record<string, string>} */ (LOWER_IS_BETTER_BAND_TERM)[band] || band;
  }
  return band;
}

/**
 * Human-readable summary of what's wrong (or right) with the settlement
 * right now. Returns an array of single-line strings.
 * @param {CausalSettlementSource | null | undefined} settlement
 * @returns {string[]}
 */
export function summarizeCausalState(settlement) {
  const state = deriveCausalState(settlement);
  /** @type {string[]} */
  const out = [];
  const cap = (/** @type {string} */ w) => w.charAt(0).toUpperCase() + w.slice(1);
  const isLower = (/** @type {string} */ name) => variablePolarity(name) === 'lower_is_better';
  // Higher-is-better problems first (raw word), then lower_is_better (problem
  // terms) — every line's word comes from causalBandWord, one place for polarity.
  /** @type {((n: string) => boolean)[]} */
  const orderings = [(n) => !isLower(n), isLower];
  for (const only of orderings) {
    for (const band of /** @type {CausalBand[]} */ (['collapsed', 'critical', 'strained'])) {
      const names = state.summary[band].filter(only);
      if (names.length) out.push(`${cap(causalBandWord(names[0], band))}: ${names.join(', ')}.`);
    }
  }
  // Surplus lists only higher-is-better vars: a lower_is_better var in 'surplus'
  // means the problem is ABSENT (crime contained) — not worth a misleading line.
  const surplus = state.summary.surplus.filter((/** @type {string} */ n) => !isLower(n));
  if (surplus.length) out.push(`Surplus: ${surplus.join(', ')}.`);
  if (out.length === 0) out.push('All variables are within the adequate band.');
  return out;
}

/** Catalog accessor for tests + drift detectors + UI affordances. */
export function supportedSystemVariables() {
  return [...SYSTEM_VARIABLES];
}

// ── Variable polarity ────────────────────────────────────────────────────
// Most substrate variables are "higher is better." Two are inverted by
// name semantics — declared explicitly so consumers can render the
// right sign in deltas. (housing_pressure was deliberately inverted in
// the derivation so it matches the higher-is-better convention; the
// name is kept for roadmap parity.)

const HIGHER_IS_BETTER = new Set([
  'food_security', 'labor_capacity', 'public_legitimacy', 'ruling_authority',
  'faction_power', 'trade_connectivity', 'healing_capacity', 'defense_readiness',
  'religious_authority', 'housing_pressure', 'infrastructure_condition',
  'magical_stability', 'social_trust', 'economic_capacity', 'law_order',
]);

const LOWER_IS_BETTER = new Set([
  'criminal_opportunity',
]);

/**
 * @param {string} variable
 * @returns {'higher_is_better'|'lower_is_better'}
 */
export function variablePolarity(variable) {
  if (HIGHER_IS_BETTER.has(variable)) return 'higher_is_better';
  if (LOWER_IS_BETTER.has(variable))  return 'lower_is_better';
  return 'higher_is_better';
}

// ── compareCausalState ──────────────────────────────────────────────────
//
// Returns a structured delta list for two CausalState snapshots. Used
// by the Phase 18 event pipeline so the substrate-layer delta is
// reported alongside the legacy 4-dimension delta. Mirrors the shape of
// compareSystemState so consumers can render the two side-by-side.

/**
 * Authored, human-readable label for each substrate variable. The single source
 * of the spaced display name (the public Compendium's Living-World tab reads this
 * through gen:compendium-data rather than splitting the snake_case id at render
 * time). Every SYSTEM_VARIABLES entry must have a label here.
 * @type {Readonly<Record<string, string>>}
 */
export const VARIABLE_LABEL = Object.freeze({
  food_security:           'Food security',
  labor_capacity:          'Labor capacity',
  public_legitimacy:       'Public legitimacy',
  ruling_authority:        'Ruling authority',
  faction_power:           'Faction power',
  trade_connectivity:      'Trade connectivity',
  healing_capacity:        'Healing capacity',
  defense_readiness:       'Defense readiness',
  criminal_opportunity:    'Criminal opportunity',
  religious_authority:     'Religious authority',
  housing_pressure:        'Housing pressure',
  infrastructure_condition: 'Infrastructure condition',
  magical_stability:       'Magical stability',
  social_trust:            'Social trust',
  economic_capacity:       'Economic capacity',
  law_order:               'Law & order',
});

/**
 * @param {string} variable
 * @param {number} before
 * @param {number} after
 * @param {number} change
 * @param {CausalBand} bandBefore
 * @param {CausalBand} bandAfter
 * @returns {string}
 */
function explainCausalDelta(variable, before, after, change, bandBefore, bandAfter) {
  const label = VARIABLE_LABEL[variable] || variable;
  const polar = variablePolarity(variable);
  const dir = change > 0 ? 'rose' : 'fell';
  const mag = Math.abs(change) >= 15 ? 'sharply' : Math.abs(change) >= 7 ? 'noticeably' : 'slightly';
  const better = (polar === 'higher_is_better' && change > 0) ||
                 (polar === 'lower_is_better'  && change < 0);
  // Band WORDS, not raw bands: a lower_is_better variable's band is computed off
  // the inverted score, so the raw pair reads backwards in a sentence ("Criminal
  // opportunity rose sharply (adequate → collapsed)" says crime collapsed while
  // it in fact became rampant). causalBandWord is the one place that re-phrasing
  // lives; the other 15 variables are byte-unchanged.
  // Lower-cased for sentence context: the raw band vocabulary is already
  // lower-case, so this only touches the three problem terms and leaves the
  // fifteen higher-is-better variables byte-identical.
  if (bandBefore !== bandAfter) {
    const wordBefore = causalBandWord(variable, bandBefore).toLowerCase();
    const wordAfter  = causalBandWord(variable, bandAfter).toLowerCase();
    return `${label} ${dir} ${mag} (${wordBefore} → ${wordAfter})${better ? '' : '. Pressure increased'}`;
  }
  return `${label} ${dir} ${mag}${better ? '' : '. Pressure increased'}`;
}

/**
 * Diff two CausalState snapshots. Returns a structured delta entry per
 * variable that changed, sorted by absolute change descending.
 *
 * Each entry:
 *   { variable, before, after, change, bandBefore, bandAfter,
 *     polarity, explanation }
 *
 * @param {CausalState | null | undefined} before
 * @param {CausalState | null | undefined} after
 * @returns {CausalStateDelta[]}
 */
export function compareCausalState(before, after) {
  if (!before || !after) return [];
  /** @type {CausalStateDelta[]} */
  const out = [];
  for (const name of SYSTEM_VARIABLES) {
    const b = before.scores?.[name];
    const a = after.scores?.[name];
    if (typeof b !== 'number' || typeof a !== 'number') continue;
    const change = a - b;
    if (change === 0) continue;
    // The fallbacks orient the score exactly as finalizeVariable does; banding a
    // lower_is_better score raw here would have produced the inverse of the band
    // the model itself carries whenever a snapshot arrived without `bands`.
    const bandBefore = before.bands?.[name] || causalBand(orientCausalScore(name, b));
    const bandAfter  = after.bands?.[name]  || causalBand(orientCausalScore(name, a));
    out.push({
      variable: name,
      before: b,
      after: a,
      change,
      bandBefore,
      bandAfter,
      polarity: variablePolarity(name),
      explanation: explainCausalDelta(name, b, a, change, bandBefore, bandAfter),
    });
  }
  out.sort((x, y) => Math.abs(y.change) - Math.abs(x.change));
  return out;
}
