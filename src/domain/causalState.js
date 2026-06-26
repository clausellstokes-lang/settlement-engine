/**
 * domain/causalState.js — Unified causal state substrate.
 *
 * Today's settlement state is scattered across
 * a dozen subsystem-specific fields (`economicState.foodSecurity`,
 * `powerStructure.publicLegitimacy`, `safetyProfile.blackMarketCapture`,
 * etc.). Each one reads its own narrow slice and produces its own
 * narrow output. This module unifies the substrate so every subsystem
 * (events, conditions, factions, supply chains, NPCs, AI overlay) can
 * read from one canonical map.
 *
 *   deriveCausalState(settlement) -> {
 *     variables: { food_security: SystemVariable, ... },   // 16 entries
 *     bands:     { food_security: 'adequate', ... },        // flat band map
 *     scores:    { food_security: 65, ... },                // flat 0-100 score map
 *     summary:   { surplus: string[], adequate: [], ... },  // group by band
 *   }
 *
 * Each SystemVariable has structured contributors so consumers can
 * answer "why is food_security strained?" by reading the chain of
 * deltas that produced the score. This is the trace pattern
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
 *     / collapsed) matches the qualitative-banding direction
 *     and is the canonical substrate vocabulary going forward.
 *
 * Inputs the substrate reads from:
 *   - factionProfile.js          — archetype + power
 *   - supplyChainState.js        — canonical chain statuses
 *   - npcProfile.js              — NPC composition
 *   - activeConditions.js        — canonical condition state
 *   - Settlement generator output         — population, prosperity,
 *                                            stressors, defenseProfile,
 *                                            safetyProfile, etc.
 *
 * Pure functions only. No imports from src/lib. No I/O, no state.
 */

import { deriveAllSupplyChainStates } from './supplyChainState.js';
import { deriveAllFactionProfiles } from './factionProfile.js';
import { deityLawDirection, DEITY_LAW_TUNING } from './corruption.js';
import { deriveAllActiveConditions } from './activeConditions.js';
import { deriveAllNpcProfiles } from './npcProfile.js';
import { tradeRouteSemantics } from './tradeRouteSemantics.js';
import { canonStressors } from './canonicalAccessors.js';
import { foodLedger } from './foodLedger.js';
import { governanceLedger } from './governanceLedger.js';
import { magicLedger } from './magicLedger.js';
import { healingLedger } from './healingLedger.js';
import { defenseLedger } from './defenseLedger.js';

// ── Per-settlement derivation memo ───────────────────────────────────────
//
// deriveCausalState runs all 16 derivers against the SAME settlement object,
// and they collectively re-derive deriveAllActiveConditions ~17x and
// deriveAllFactionProfiles ~6x per call — each derivation walking the full
// roster from scratch. Both depend SOLELY on the settlement object (neither
// reads any other state), so a WeakMap keyed on the settlement IDENTITY yields
// correct cache HITS for the repeated reads within one deriveCausalState call
// and correct MISSES when the settlement actually changes (copy-on-write ⇒ a
// changed settlement is a NEW object reference). This mirrors worldSnapshot.js's
// derivationCache exactly. The cached arrays are READ-ONLY at every call site
// (for-of / find / filter / map — never mutated), so sharing the reference is
// byte-identical to re-deriving: same input ⇒ same output, just computed once.
// WeakMap lets entries be GC'd once the settlement object is unreferenced, so
// the memo never leaks across calls.

/** @type {WeakMap<object, any[]>} */
const activeConditionsMemo = new WeakMap();
/** @type {WeakMap<object, any[]>} */
const factionProfilesMemo = new WeakMap();

/**
 * Memoized deriveAllActiveConditions, keyed on the settlement identity.
 * Byte-identical to calling deriveAllActiveConditions(s) directly — only the
 * repeated derivations within a single deriveCausalState call are collapsed.
 * @param {any} s
 * @returns {any[]}
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
 * @param {any} s
 * @returns {any[]}
 */
function cachedFactionProfiles(s) {
  if (!s || typeof s !== 'object') return deriveAllFactionProfiles(s);
  const hit = factionProfilesMemo.get(s);
  if (hit) return hit;
  const derived = deriveAllFactionProfiles(s);
  factionProfilesMemo.set(s, derived);
  return derived;
}

// ── Canonical catalog ────────────────────────────────────────────────────

/**
 * The 16 canonical system variables per the roadmap. Frozen so the
 * shape of the substrate is stable; consumers can rely on iterating
 * this array to cover every dimension.
 *
 * `economic_capacity` (15th) is the live "war-affordability / economic slack"
 * dial added for the geopolitical war layer (see docs/GEOPOLITICAL_WAR_LAYER.md):
 * economicState.prosperity/economicComplexity are generation-frozen, so
 * they seed a BASELINE that active conditions (war_drain / vassal_extraction /
 * market_shock / occupation extraction) move live — the seam the homeostasis loop
 * and the trade-war contest read. Distinct from trade_connectivity (routes/chains).
 *
 * `law_order` (16th) is the rule-of-law dial added the same way: it
 * reads government archetype, public legitimacy, the internal-security score, the
 * law/order institution roster, and the crime/corruption signals — higher = more
 * lawful/ordered. Purely ADDITIVE — it reads only signals other derivers already
 * read, so the existing 15 scores are byte-identical. The lawful/chaotic deity
 * axis will later couple INTO this.
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
 * The canonical 5-band vocabulary. This is the
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
 */
export function causalBand(/** @type {any} */ score) {
  const s = typeof score === 'number' ? Math.max(0, Math.min(100, score)) : 50;
  if (s >= 75) return 'surplus';
  if (s >= 50) return 'adequate';
  if (s >= 30) return 'strained';
  if (s >= 15) return 'critical';
  return 'collapsed';
}

/** Round-trip: band → numeric center. */
export function defaultScoreForCausalBand(/** @type {any} */ band) {
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

function push(/** @type {any[]} */ contributors, /** @type {any} */ source, /** @type {any} */ effect, /** @type {any} */ delta, /** @type {any} */ reason) {
  contributors.push({ source, effect, delta, reason });
}

// ── Population helper ────────────────────────────────────────────────────

function populationOf(/** @type {any} */ settlement) {
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

function deriveFoodSecurity(/** @type {any} */ s) {
  let score = 50;
  /** @type {any[]} */
  const contributors = [];

  // Supply chain stability for the food_security need
  const chains = deriveAllSupplyChainStates(s);
  const foodChains = chains.filter((/** @type {any} */ c) => c.needKey === 'food_security');
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

  // Active conditions that affect food_security
  for (const cond of cachedActiveConditions(s)) {
    if (!cond.affectedSystems.includes('food_security')) continue;
    const magnitude = Math.round(cond.severity * 20);
    if (magnitude === 0) continue;
    score -= magnitude;
    push(contributors, cond.id, 'pressure', -magnitude, `${cond.label} taxes food security.`);
  }

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

function deriveLaborCapacity(/** @type {any} */ s) {
  let score = 50;
  /** @type {any[]} */
  const contributors = [];

  // Population scaling
  const pop = populationOf(s);
  if (pop >= 5000) { score += 10; push(contributors, 'population', 'broad', +10, `Population ${pop} provides a deep labor pool.`); }
  else if (pop >= 1000) { score += 5; push(contributors, 'population', 'adequate', +5, `Population ${pop} carries enough hands.`); }
  else if (pop > 0 && pop < 200) { score -= 5; push(contributors, 'population', 'thin', -5, `Population ${pop} leaves little slack.`); }

  // Active conditions that affect labor (plague especially)
  for (const cond of cachedActiveConditions(s)) {
    if (!cond.affectedSystems.includes('labor_capacity')) continue;
    const magnitude = Math.round(cond.severity * 20);
    if (magnitude === 0) continue;
    score -= magnitude;
    push(contributors, cond.id, 'pressure', -magnitude, `${cond.label} reduces available labor.`);
  }

  return { score, contributors };
}

function derivePublicLegitimacy(/** @type {any} */ s) {
  let score = 50;
  /** @type {any[]} */
  const contributors = [];

  // Read the conserved legitimacy quantity via the governance ledger. This lens IS
  // legitimacy, so it uses the score verbatim (other lenses weight it differently).
  const gov = governanceLedger(s);
  if (gov.present) {
    score = gov.legitimacyScore;
    push(contributors, 'powerStructure.publicLegitimacy', gov.legitimacyLabel || 'measured', 0,
      `Governing legitimacy score: ${gov.legitimacyScore} (${gov.legitimacyLabel || 'unbanded'}).`);
  }

  // Active conditions that affect public_legitimacy (corruption etc.)
  for (const cond of cachedActiveConditions(s)) {
    if (!cond.affectedSystems.includes('public_legitimacy')) continue;
    const direction = cond.archetype === 'siege_lifted' ? +1 : -1;
    const magnitude = Math.round(cond.severity * 15) * direction;
    if (magnitude === 0) continue;
    score += magnitude;
    push(contributors, cond.id, direction > 0 ? 'lift' : 'pressure', magnitude,
      `${cond.label} ${direction > 0 ? 'lifts' : 'erodes'} public legitimacy.`);
  }

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

function deriveRulingAuthority(/** @type {any} */ s) {
  let score = 50;
  /** @type {any[]} */
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
    let govFaction = profiles.find((/** @type {any} */ p) => p.name && p.name.toLowerCase() === lower);
    if (!govFaction) {
      govFaction = profiles.find((/** @type {any} */ p) => {
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

  // Active conditions that affect ruling_authority
  for (const cond of cachedActiveConditions(s)) {
    if (!cond.affectedSystems.includes('public_legitimacy')
     && !cond.affectedSystems.includes('faction_power')) continue;
    if (cond.archetype === 'corruption_exposed') {
      const m = Math.round(cond.severity * 18);
      score -= m;
      push(contributors, cond.id, 'undermined', -m, `${cond.label} cripples the ability to govern.`);
    }
  }

  return { score, contributors };
}

function deriveFactionPower(/** @type {any} */ s) {
  let score = 50;
  /** @type {any[]} */
  const contributors = [];

  // Healthy faction system = balance with a clear governing center.
  // We use the power-share spread among profiles.
  const profiles = cachedFactionProfiles(s);
  if (profiles.length === 0) {
    return { score: 50, contributors: [{ source: 'powerStructure', effect: 'neutral', delta: 0, reason: 'No factions to evaluate.' }] };
  }
  const powers = profiles.map((/** @type {any} */ p) => p.power || 0);
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

  // Active conditions affecting faction_power
  for (const cond of cachedActiveConditions(s)) {
    if (!cond.affectedSystems.includes('faction_power')) continue;
    const magnitude = Math.round(cond.severity * 15);
    score -= magnitude;
    push(contributors, cond.id, 'destabilized', -magnitude, `${cond.label} destabilizes the faction system.`);
  }

  return { score, contributors };
}

function deriveTradeConnectivity(/** @type {any} */ s) {
  let score = 50;
  /** @type {any[]} */
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
  // trade chains never fed connectivity at all.
  const chains = deriveAllSupplyChainStates(s);
  const tradeChains = chains.filter((/** @type {any} */ c) => c.needKey === 'trade_entrepot');
  for (const c of tradeChains) {
    if (c.status === 'stable') { score += 5; push(contributors, c.id, 'stable', +5, `${c.name} runs normally.`); }
    else if (c.status !== 'stable') {
      const m = c.status === 'blocked' || c.status === 'collapsing' ? -18 : -8;
      score += m;
      push(contributors, c.id, c.status, m, `${c.name} is ${c.status}.`);
    }
  }

  // Active conditions
  for (const cond of cachedActiveConditions(s)) {
    if (!cond.affectedSystems.includes('trade_connectivity')) continue;
    const magnitude = Math.round(cond.severity * 18);
    score -= magnitude;
    push(contributors, cond.id, 'cut', -magnitude, `${cond.label} disrupts trade flows.`);
  }

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
/** @param {any} s */
function deriveEconomicCapacity(s) {
  /** @type {any[]} */
  const contributors = [];
  const eco = s.economicState || {};
  const prosperity = String(eco.prosperity || '').trim();
  const base = /** @type {Record<string, number>} */ (PROSPERITY_BASE)[prosperity.toLowerCase()] ?? 50;
  let score = base;
  push(contributors, 'economicState.prosperity', prosperity || 'unknown', base - 50,
    prosperity ? `Prosperity is ${prosperity}.` : 'Prosperity unrecorded: neutral baseline.');

  // Diversified economies absorb shocks; concentrated/specialized ones are brittle.
  const complexity = String(eco.economicComplexity || '').toLowerCase();
  if (/diversified/.test(complexity)) {
    score += 6; push(contributors, 'economicState.economicComplexity', 'diversified', +6, 'A diversified economy is resilient.');
  } else if (/concentrated|specialized/.test(complexity)) {
    score -= 6; push(contributors, 'economicState.economicComplexity', 'concentrated', -6, 'A concentrated economy is brittle.');
  }

  // Active conditions move economic capacity live — the war-layer seam.
  for (const cond of cachedActiveConditions(s)) {
    // war_spoils is the INVERSE of war_drain/war_exhaustion: the CAPPED
    // benefit a stabilized occupation yields RELIEVES the occupier's war economy
    // (extends supply endurance) rather than draining it. It is the ONLY economic-
    // capacity condition that adds a POSITIVE magnitude — and the occupation layer
    // HARD-CAPS its severity (the anti-snowball containment), so this relief is bounded
    // no matter how many settlements the occupier holds. A lighter scale than the drain
    // (war is never free): occupations soften, but never erase, the cost of campaigning.
    if (cond.archetype === 'war_spoils') {
      const magnitude = Math.round(cond.severity * 12);
      score += magnitude;
      push(contributors, cond.id, 'spoils', +magnitude, `${cond.label} sustains the war economy (capped).`);
      continue;
    }
    if (!cond.affectedSystems.includes('economic_capacity')) continue;
    const magnitude = Math.round(cond.severity * 18);
    score -= magnitude;
    push(contributors, cond.id, 'drain', -magnitude, `${cond.label} drains the war economy.`);
  }

  return { score, contributors };
}

// law_order — how lawful / ordered the settlement is. Higher = a strong rule of
// law (courts, watch, an authoritative government, low corruption); lower = an
// anarchic / lawless settlement where crime and corruption run the streets. The
// 16th SYSTEM_VARIABLE, added the same way economic_capacity was — purely
// ADDITIVE: it reads only signals other derivers already read (governance
// ledger, defense ledger's internal-order score, the safetyProfile crime
// signals, the criminal faction, and the institution roster), so the existing
// 15 scores are byte-identical. The lawful/chaotic deity axis will later couple
// INTO this; this deriver only establishes the variable + a sensible base.
//
// Government archetypes that concentrate authority (autocracy, military rule,
// theocracy, monarchy/lordship) lift law_order; anarchic / weakly-governed forms
// (communes, free cities, peasant/frontier governance) lower it. A government
// string absent from BOTH lists contributes nothing.
const LAWFUL_GOVERNMENT_PATTERN = /autocra|authoritarian|militar|junta|despot|tyrann|imperial|monarch|lordship|theocra|magocra|ecclesiastical|magistrat/i;
const ANARCHIC_GOVERNMENT_PATTERN = /anarch|commune|free city|free council|peasant|frontier|lawless|warlord|failed/i;
// Institutions that embody the rule of law: courts, the watch/guard, magistrates,
// gaols. Mirrors healingLedger's name-pattern classifier — name-only, defensive.
const LAW_ORDER_INSTITUTION_PATTERN = /court|magistrat|tribunal|watch|constab|gaol|jail|prison|assize|sheriff|marshal|justice/i;

/** @param {any} s */
function deriveLawOrder(s) {
  let score = 50;
  /** @type {any[]} */
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
  // teeth. Classified by name like healingLedger's healer pattern.
  const institutions = Array.isArray(s?.institutions) ? s.institutions : [];
  const lawCount = institutions.filter((/** @type {any} */ i) => LAW_ORDER_INSTITUTION_PATTERN.test(String(i?.name || ''))).length;
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
  const safety = s?.economicState?.safetyProfile || s?.safetyProfile || {};
  if (typeof safety.blackMarketCapture === 'number' && safety.blackMarketCapture > 0) {
    const c = Math.round(safety.blackMarketCapture * 0.3);
    if (c !== 0) {
      score -= c;
      push(contributors, 'safetyProfile.blackMarketCapture', 'crime', -c,
        `Black-market capture at ${safety.blackMarketCapture}% undermines lawful order.`);
    }
  }
  const profiles = cachedFactionProfiles(s);
  const criminal = profiles.find((/** @type {any} */ p) => p.archetype === 'criminal');
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
  // status. A condition that does NOT declare law_order is ignored, so no-op for
  // every settlement today (none declare it yet) ⇒ byte-identical.
  for (const cond of cachedActiveConditions(s)) {
    if (!cond.affectedSystems.includes('law_order')) continue;
    const direction = cond.archetype === 'siege_lifted' ? +1 : -1;
    const magnitude = Math.round(cond.severity * 15) * direction;
    if (magnitude === 0) continue;
    score += magnitude;
    push(contributors, cond.id, direction > 0 ? 'restored' : 'eroded', magnitude,
      `${cond.label} ${direction > 0 ? 'restores' : 'erodes'} the rule of law.`);
  }

  // Deity term — DORMANT until assigned, exactly like the deity term
  // in deriveReligiousAuthority. Only a settlement with an embedded
  // primaryDeitySnapshot whose lawAxis is lawful/chaotic reads this; a deity-free
  // settlement, a legacy 3-axis deity (no lawAxis ⇒ dir 0), and a law-NEUTRAL
  // deity all see NONE of it ⇒ byte-identical. A lawful patron RAISES order
  // (oaths kept, courts backed); a chaotic patron LOWERS it (order tolerated to
  // erode, corruption shrugged at). This is the law-axis lever; the good/evil
  // axis touches corruption ONSET/EXPOSURE through a SEPARATE path (corruption.js
  // npcDeityDisfavor), so the two never double-count.
  const lawDir = deityLawDirection(s?.config?.primaryDeitySnapshot);
  if (lawDir !== 0) {
    const lift = lawDir * DEITY_LAW_TUNING.lawOrderSwing;
    score += lift;
    const deity = s.config.primaryDeitySnapshot;
    push(contributors, deity._deityRef || 'primaryDeity', lawDir > 0 ? 'lawful_patron' : 'chaotic_patron', lift,
      `${deity.name || 'The patron deity'} (${deity.lawAxis}) ${lawDir > 0
        ? 'strengthens law & order'
        : 'erodes order and tolerates corruption'}.`);
  }

  return { score, contributors };
}

function deriveHealingCapacity(/** @type {any} */ s) {
  let score = 50;
  /** @type {any[]} */
  const contributors = [];

  // Institutions whose names suggest healing capacity (canonical classifier via healingLedger).
  // Offered healing services rescue the harsh "absent" penalty (informal care):
  // a town providing wound care / medical care / relief is not "no healing", just not robust.
  const heal = healingLedger(s);
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

  // Active conditions
  for (const cond of cachedActiveConditions(s)) {
    if (!cond.affectedSystems.includes('healing_capacity')) continue;
    const magnitude = Math.round(cond.severity * 20);
    score -= magnitude;
    push(contributors, cond.id, 'overrun', -magnitude, `${cond.label} overwhelms healing capacity.`);
  }

  return { score, contributors };
}

function deriveDefenseReadiness(/** @type {any} */ s) {
  let score = 50;
  /** @type {any[]} */
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
  // Wall, garrison, walls present
  if (def.hasWalls === true || /wall|rampart|palisade/i.test(JSON.stringify(def))) {
    score += 6;
    push(contributors, 'defenseProfile', 'walled', +6, 'Defensive walls in place.');
  }

  // Active conditions
  for (const cond of cachedActiveConditions(s)) {
    if (!cond.affectedSystems.includes('defense_readiness')) continue;
    const direction = cond.archetype === 'siege_lifted' ? +1 : -1;
    const magnitude = Math.round(cond.severity * 12) * direction;
    score += magnitude;
    push(contributors, cond.id, direction > 0 ? 'recovering' : 'strained', magnitude,
      `${cond.label} ${direction > 0 ? 'restores' : 'taxes'} defense readiness.`);
  }

  return { score, contributors };
}

function deriveCriminalOpportunity(/** @type {any} */ s) {
  let score = 50;
  /** @type {any[]} */
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
  const criminal = profiles.find((/** @type {any} */ p) => p.archetype === 'criminal');
  if (criminal && typeof criminal.power === 'number') {
    const c = Math.round((criminal.power - 20) * 0.4);
    if (c !== 0) {
      score += c;
      push(contributors, criminal.id, 'criminal_power', c, `${criminal.name} influence is ${criminal.power}.`);
    }
  }

  // Active conditions
  for (const cond of cachedActiveConditions(s)) {
    if (!cond.affectedSystems.includes('criminal_opportunity')) continue;
    const magnitude = Math.round(cond.severity * 15);
    score += magnitude;
    push(contributors, cond.id, 'opening', magnitude, `${cond.label} opens new criminal opportunities.`);
  }

  return { score, contributors };
}

// How strongly an assigned primary deity lifts religious_authority, by rank.
// A major god is a pillar of the pantheon; a cult is a fringe following. Absent
// from this map ⇒ no deity term (the dormancy guarantee — a deity-free
// settlement never reads any of this).
export const DEITY_RANK_AUTHORITY = Object.freeze({ major: 18, minor: 10, cult: 5 });

/** @param {any} s */
function deriveReligiousAuthority(s) {
  let score = 50;
  /** @type {any[]} */
  const contributors = [];

  const profiles = cachedFactionProfiles(s);
  const religious = profiles.find((/** @type {any} */ p) => p.archetype === 'religious');
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
  // now declares `religious_authority`, so a
  // regional spread presses the substrate here. Filtered on the affectedSystems
  // contract like every other deriver; signed by the condition's status.
  for (const cond of cachedActiveConditions(s)) {
    if (!cond.affectedSystems.includes('religious_authority')) continue;
    const magnitude = Math.round(cond.severity * 15);
    if (magnitude === 0) continue;
    score += magnitude;
    push(contributors, cond.id, 'religious_pressure', magnitude,
      `${cond.label} amplifies religious authority.`);
  }

  // Deity term — DORMANT until assigned. Only a settlement with an embedded
  // primaryDeitySnapshot (the embed-on-assign bridge) reads this; a deity-free
  // settlement sees NONE of it, so its score is unchanged except by the
  // condition scan above. Tier-scaled: a major god lifts more than a cult. The
  // snapshot is self-contained — we never touch customContent here.
  const deity = s.config?.primaryDeitySnapshot;
  if (deity && /** @type {Record<string, number>} */ (DEITY_RANK_AUTHORITY)[deity.rankAxis] != null) {
    const lift = /** @type {Record<string, number>} */ (DEITY_RANK_AUTHORITY)[deity.rankAxis];
    score += lift;
    push(contributors, deity._deityRef || 'primaryDeity', 'deity_patronage', lift,
      `${deity.name || 'The patron deity'} (${deity.rankAxis}) anchors religious authority.`);
  }

  return { score, contributors };
}

function deriveHousingPressure(/** @type {any} */ s) {
  // INVERTED: high score = LOW pressure (consistent with the other vars
  // where higher = better). Variable name kept for roadmap parity.
  let score = 50;
  /** @type {any[]} */
  const contributors = [];

  const pop = populationOf(s);
  // Without a real housing dataset, use population×stressors heuristic.
  const stressors = canonStressors(s);
  // 'migration' added: /migrant/ does not substring-match 'mass_migration',
  // so the generation stress type never registered as housing pressure.
  const refugeeStress = stressors.find((/** @type {any} */ st) => /refugee|displaced|influx|migrant|migration/i.test(String(st?.type || st?.name || st)));
  if (refugeeStress) {
    score -= 18;
    push(contributors, 'stressors.refugee', 'influx', -18, 'Refugee influx strains available housing.');
  } else {
    // Migration that arrives as a CONDITION — a regional spread or an
    // authored migration event produces regional_migration_pressure without
    // any local stressor — must still press housing, modestly (a default-
    // severity wave reads -6 against the local stressor's -18). Skipped when
    // the stressor registered above: promotion mints this same archetype from
    // that stressor, and counting both would double-penalize one crisis.
    // Filtered on the affectedSystems contract like every other deriver, so
    // the explanation/AI surfaces list exactly what the substrate charges.
    for (const cond of cachedActiveConditions(s)) {
      if (!cond.affectedSystems.includes('housing_pressure')) continue;
      const magnitude = Math.round(cond.severity * 12);
      if (magnitude === 0) continue;
      score -= magnitude;
      push(contributors, cond.id, 'influx', -magnitude, `${cond.label} pushes arrivals into limited housing.`);
    }
  }
  if (pop >= 5000) { score -= 4; push(contributors, 'population', 'dense', -4, `Population ${pop} pushes housing demand.`); }
  return { score, contributors };
}

function deriveInfrastructureCondition(/** @type {any} */ s) {
  let score = 50;
  /** @type {any[]} */
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
    // No defense profile (un-generated / legacy) — infer from institution count.
    const instCount = Array.isArray(s.institutions) ? s.institutions.length : 0;
    if (instCount >= 15) { score += 10; push(contributors, 'institutions', 'dense', +10, `${instCount} institutions imply robust infrastructure.`); }
    else if (instCount <= 5) { score -= 6; push(contributors, 'institutions', 'thin', -6, `${instCount} institutions imply thin infrastructure.`); }
  }

  return { score, contributors };
}

function deriveMagicalStability(/** @type {any} */ s) {
  let score = 50;
  /** @type {any[]} */
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
  const arcane = profiles.find((/** @type {any} */ p) => p.archetype === 'arcane');
  if (arcane) {
    score += 5;
    push(contributors, arcane.id, 'arcane_present', +5, `${arcane.name} provides arcane oversight.`);
  }

  // Active conditions that affect magical_stability (the
  // magical_instability archetype the deadzone/instability stressor family
  // promotes to). Until this scan, magical_stability was the one substrate
  // variable no condition could reach.
  for (const cond of cachedActiveConditions(s)) {
    if (!cond.affectedSystems.includes('magical_stability')) continue;
    const magnitude = Math.round(cond.severity * 15);
    if (magnitude === 0) continue;
    score -= magnitude;
    push(contributors, cond.id, 'destabilized', -magnitude, `${cond.label} destabilizes the local weave.`);
  }

  return { score, contributors };
}

function deriveSocialTrust(/** @type {any} */ s) {
  let score = 50;
  /** @type {any[]} */
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
  for (const cond of cachedActiveConditions(s)) {
    if (!cond.affectedSystems.includes('social_trust')) continue;
    const magnitude = Math.round(cond.severity * 15);
    score -= magnitude;
    push(contributors, cond.id, 'erodes', -magnitude, `${cond.label} erodes communal trust.`);
  }

  // Dominant-NPC removal stress
  const dominantNpcs = deriveAllNpcProfiles(s).filter((/** @type {any} */ p) => p.rank === 'dominant');
  if (dominantNpcs.length === 0) {
    score -= 4;
    push(contributors, 'npcs', 'no_dominant', -4, 'No dominant figures anchor public confidence.');
  }

  return { score, contributors };
}

// ── Composer ─────────────────────────────────────────────────────────────

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

function finalizeVariable(/** @type {any} */ name, /** @type {any} */ raw, /** @type {any} */ contributors) {
  const score = Math.max(0, Math.min(100, Math.round(raw)));
  // Band off the polarity-ADJUSTED score. criminal_opportunity is the lone
  // lower-is-better variable: a high score means rampant crime, which must read
  // as a problem band (strained/critical), not "surplus"/Abundant. The raw score
  // is kept as-is — pressureModel and the delta renderers handle polarity via
  // variablePolarity() themselves; only the qualitative band flips here.
  const banded = variablePolarity(name) === 'lower_is_better' ? 100 - score : score;
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
 * @param {any} settlement
 * @returns {any}    SystemVariable, or null for unknown variable.
 */
export function deriveSystemVariable(variable, settlement) {
  if (!variable || !(/** @type {any} */ (DERIVERS)[variable])) return null;
  if (!settlement) return finalizeVariable(variable, 50, []);
  const { score, contributors } = /** @type {any} */ (DERIVERS)[variable](settlement);
  return finalizeVariable(variable, score, contributors);
}

/**
 * Derive the full causal substrate.
 *
 * @param {any} settlement
 * @returns {any} {
 *   variables: { [name]: SystemVariable },
 *   bands:     { [name]: CausalBand },
 *   scores:    { [name]: number },
 *   summary:   { surplus: string[], adequate: string[], strained: string[],
 *                critical: string[], collapsed: string[] },
 * }
 */
export function deriveCausalState(settlement) {
  /** @type {any} */
  const variables = {};
  for (const name of SYSTEM_VARIABLES) {
    if (!settlement) {
      variables[name] = finalizeVariable(name, 50, []);
    } else {
      const { score, contributors } = /** @type {any} */ (DERIVERS)[name](settlement);
      variables[name] = finalizeVariable(name, score, contributors);
    }
  }
  /** @type {any} */
  const bands = {};
  /** @type {any} */
  const scores = {};
  /** @type {any} */
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

/** Convenience accessor — band for one variable. */
export function bandForVariable(/** @type {any} */ settlement, /** @type {any} */ variable) {
  const v = deriveSystemVariable(variable, settlement);
  return v ? v.band : null;
}

/** Returns all variables currently at strained/critical/collapsed bands. */
export function pressuresOn(/** @type {any} */ settlement) {
  const state = deriveCausalState(settlement);
  return [...state.summary.strained, ...state.summary.critical, ...state.summary.collapsed];
}

// Problem-term phrasing for lower_is_better variables. Their band is computed
// off the INVERTED score, so a 'collapsed'/'critical' band means the underlying
// value (e.g. criminal_opportunity) is HIGH — a problem. Reusing the raw band
// word in the summary ("Collapsed: criminal_opportunity") reads as a positive
// (crime collapsed = good) when it actually means rampant crime. These lines
// phrase the worst bands in problem terms instead.
const LOWER_IS_BETTER_PROBLEM_TERM = Object.freeze({
  collapsed: 'Rampant',
  critical:  'Acute',
  strained:  'Elevated',
});

/**
 * Human-readable summary of what's wrong (or right) with the settlement
 * right now. Returns an array of single-line strings.
 */
export function summarizeCausalState(/** @type {any} */ settlement) {
  const state = deriveCausalState(settlement);
  const out = [];
  // Pull lower_is_better variables out of the raw-band lines so the band word
  // never reads inverted; emit them with problem-term phrasing afterwards.
  const inverted = (/** @type {any} */ name) => variablePolarity(name) === 'lower_is_better';
  const higherOnly = (/** @type {any} */ band) => state.summary[band].filter((/** @type {any} */ n) => !inverted(n));
  if (higherOnly('collapsed').length) {
    out.push(`Collapsed: ${higherOnly('collapsed').join(', ')}.`);
  }
  if (higherOnly('critical').length) {
    out.push(`Critical: ${higherOnly('critical').join(', ')}.`);
  }
  if (higherOnly('strained').length) {
    out.push(`Strained: ${higherOnly('strained').join(', ')}.`);
  }
  // lower_is_better problems, phrased in problem terms (rampant/acute/elevated).
  for (const band of ['collapsed', 'critical', 'strained']) {
    const problems = state.summary[band].filter(inverted);
    if (problems.length) {
      out.push(`${/** @type {any} */ (LOWER_IS_BETTER_PROBLEM_TERM)[band]}: ${problems.join(', ')}.`);
    }
  }
  if (higherOnly('surplus').length) {
    out.push(`Surplus: ${higherOnly('surplus').join(', ')}.`);
  }
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

export function variablePolarity(/** @type {any} */ variable) {
  if (HIGHER_IS_BETTER.has(variable)) return 'higher_is_better';
  if (LOWER_IS_BETTER.has(variable))  return 'lower_is_better';
  return 'higher_is_better';
}

// ── compareCausalState ──────────────────────────────────────────────────
//
// Returns a structured delta list for two CausalState snapshots. Used
// by the event pipeline so the substrate-layer delta is
// reported alongside the legacy 4-dimension delta. Mirrors the shape of
// compareSystemState so consumers can render the two side-by-side.

const VARIABLE_LABEL = Object.freeze({
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

function explainCausalDelta(/** @type {any} */ variable, /** @type {any} */ before, /** @type {any} */ after, /** @type {any} */ change, /** @type {any} */ bandBefore, /** @type {any} */ bandAfter) {
  const label = /** @type {any} */ (VARIABLE_LABEL)[variable] || variable;
  const polar = variablePolarity(variable);
  const dir = change > 0 ? 'rose' : 'fell';
  const mag = Math.abs(change) >= 15 ? 'sharply' : Math.abs(change) >= 7 ? 'noticeably' : 'slightly';
  const better = (polar === 'higher_is_better' && change > 0) ||
                 (polar === 'lower_is_better'  && change < 0);
  if (bandBefore !== bandAfter) {
    return `${label} ${dir} ${mag} (${bandBefore} → ${bandAfter})${better ? '' : '. Pressure increased'}`;
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
 */
export function compareCausalState(/** @type {any} */ before, /** @type {any} */ after) {
  if (!before || !after) return [];
  const out = [];
  for (const name of SYSTEM_VARIABLES) {
    const b = before.scores?.[name];
    const a = after.scores?.[name];
    if (typeof b !== 'number' || typeof a !== 'number') continue;
    const change = a - b;
    if (change === 0) continue;
    const bandBefore = before.bands?.[name] || causalBand(b);
    const bandAfter  = after.bands?.[name]  || causalBand(a);
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
