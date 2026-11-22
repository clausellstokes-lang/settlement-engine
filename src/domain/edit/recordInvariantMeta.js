// src/domain/edit/recordInvariantMeta.js — THE PER-CHECK METADATA TABLE. PURE FROZEN DATA.
// ⛔ IMPORTS NOTHING. No branch, no PRNG, no clock, no locale, no store, no I/O.
//
// WHAT IT IS FOR. `docs/DESIGN_EDIT_MODE_AND_DECREES.md` §22.2 item 3 gives the escalation
// ladder its shape — "the enclosing declared group from R1, then its top-level key from R1 —
// BOTH keys for a cross-key check" — and §22.3 item 5 ships the cross-key checks. A ladder
// that must take BOTH keys of a cross-key violation at step 1 needs a table that says, for
// every check, which record paths it relates and which top-level keys those paths head at.
// This is that table; `recordInvariants` stamps `kind` and `keys` onto every violation from it.
//
// ⭐ THE `arms` RULE, AND WHY IT IS NOT `keys.length > 1`. A row may declare `arms` when its
// id covers INDEPENDENT arms that relate nothing to each other. A violation then carries the
// keys of the ARM THAT FIRED, never the union, and the row is NOT cross-key. `V-FLAGVEC` is
// the only such row today: it reads the food card and the legitimacy card separately, and
// escalating it at both keys would take `powerStructure` from R1 because the FOOD card
// disagreed — the opposite of the minimal move item 3 requires.
//
// ⭐ `CROSS_KEY_CHECKS` IS DERIVED, NEVER HAND-LISTED: no `arms` and more than one key. A
// hand-list drifts the first time a check is added; the derivation cannot.
//
// ⭐ THE `paths` STRINGS ARE DATA AND STAY STRINGS. `V-DEFENSE-INST` relates its two record
// paths THROUGH this table rather than as a property chain, which is what keeps the reading
// leaf out of the ruin-filter walker's discovery set (that scan blanks string and comment
// contents by design). A path spelled as a property chain there is a STOP, not a fix.

/**
 * @typedef {'arithmetic'|'count'|'prose-count'|'referential'|'band'|'flag-vector'} InvariantKind
 * @typedef {{ kind: InvariantKind, paths: readonly string[], keys: readonly string[],
 *             arms?: readonly { id: string, keys: readonly string[] }[] }} CheckMeta
 */

/** The thirty-three checks, in DECLARED ORDER — the order violations are returned in. */
export const CHECK_IDS = Object.freeze([
  'V-DEPCOUNT', 'V-WARNCOUNT', 'V-SUMMARY-DEPS', 'V-SUMMARY-HOOKS',
  'V-FOOD-RAW', 'V-FOOD-DEF', 'V-FOOD-PCT',
  'V-FOODSEC-RAW', 'V-FOODSEC-DEF', 'V-FOODSEC-PCT', 'V-FOODSEC-CHAINS',
  'V-FOODSEC-FLAGS', 'V-BAND-FOODSEC',
  'V-ISOLATION', 'V-COND-BAND', 'V-BAND-READINESS',
  'V-INCOME-100', 'V-POWER-100',
  'V-LEGIT-SUM', 'V-LEGIT-FLAGS', 'V-BAND-LEGITIMACY', 'V-GOVERNING', 'V-FLAGVEC',
  'V-EVIDENCE-ROSTER', 'V-EVIDENCE-EVENTS', 'V-EVIDENCE-TENSION', 'V-EVIDENCE-STRESS',
  'V-EVIDENCE-CONFLICT', 'V-DEFENSE-INST', 'V-STRESS-IDENTITY',
  'V-DEFENSE-MAGICDEP', 'V-DEFENSE-TRADITIONS', 'V-HISTORY-AGE',
]);

const FOOD_BALANCE = 'economicViability.metrics.foodBalance';
const FOOD_SECURITY = 'economicState.foodSecurity';
const LEGITIMACY = 'powerStructure.publicLegitimacy';
const JUDGMENT_EVIDENCE = 'generationCoherenceReceipt.judgments[].evidence';

/** @type {Readonly<Record<string, CheckMeta>>} One row per declared id. Totality is A2's arm. */
export const CHECK_META = Object.freeze({
  'V-DEPCOUNT': { kind: 'count', paths: ['economicViability.metrics.dependencyCount', 'economicViability.dependencies'], keys: ['economicViability'] },
  'V-WARNCOUNT': { kind: 'count', paths: ['economicViability.metrics.warningCount', 'economicViability.warnings'], keys: ['economicViability'] },
  'V-SUMMARY-DEPS': { kind: 'prose-count', paths: ['economicViability.summary', 'economicViability.dependencies'], keys: ['economicViability'] },
  'V-SUMMARY-HOOKS': { kind: 'prose-count', paths: ['economicViability.summary', 'economicViability.plotHooks'], keys: ['economicViability'] },
  'V-FOOD-RAW': { kind: 'arithmetic', paths: [`${FOOD_BALANCE}.rawDeficit`, `${FOOD_BALANCE}.dailyNeed`, `${FOOD_BALANCE}.dailyProduction`], keys: ['economicViability'] },
  'V-FOOD-DEF': { kind: 'arithmetic', paths: [`${FOOD_BALANCE}.deficit`, `${FOOD_BALANCE}.rawDeficit`, `${FOOD_BALANCE}.importCoverage`, `${FOOD_BALANCE}.magicFoodOffset`], keys: ['economicViability'] },
  'V-FOOD-PCT': { kind: 'arithmetic', paths: [`${FOOD_BALANCE}.deficitPercent`, `${FOOD_BALANCE}.deficit`, `${FOOD_BALANCE}.dailyNeed`], keys: ['economicViability'] },
  'V-FOODSEC-RAW': { kind: 'arithmetic', paths: [`${FOOD_SECURITY}.rawDeficit`, `${FOOD_SECURITY}.dailyNeed`, `${FOOD_SECURITY}.dailyProduction`], keys: ['economicState'] },
  'V-FOODSEC-DEF': { kind: 'arithmetic', paths: [`${FOOD_SECURITY}.deficit`, `${FOOD_SECURITY}.rawDeficit`, `${FOOD_SECURITY}.importCoverage`, `${FOOD_SECURITY}.magicOffset`], keys: ['economicState'] },
  'V-FOODSEC-PCT': { kind: 'arithmetic', paths: [`${FOOD_SECURITY}.deficitPct`, `${FOOD_SECURITY}.deficit`, `${FOOD_SECURITY}.dailyNeed`], keys: ['economicState'] },
  'V-FOODSEC-CHAINS': { kind: 'count', paths: [`${FOOD_SECURITY}.activeChainsCount`, `${FOOD_SECURITY}.activeChains`, `${FOOD_SECURITY}.chains`], keys: ['economicState'] },
  'V-FOODSEC-FLAGS': { kind: 'flag-vector', paths: [`${FOOD_SECURITY}.label`, `${FOOD_SECURITY}.isDeficit`, `${FOOD_SECURITY}.isPressured`, `${FOOD_SECURITY}.isSecure`, `${FOOD_SECURITY}.isSurplus`], keys: ['economicState'] },
  'V-BAND-FOODSEC': { kind: 'band', paths: [`${FOOD_SECURITY}.label`, `${FOOD_SECURITY}.deficitPct`, `${FOOD_SECURITY}.surplusPct`, `${FOOD_SECURITY}.hasFamine`], keys: ['economicState'] },
  'V-ISOLATION': { kind: 'arithmetic', paths: ['isolationSupport.deficit', 'isolationSupport.requiredCapacity', 'isolationSupport.capacity'], keys: ['isolationSupport'] },
  'V-COND-BAND': { kind: 'band', paths: ['activeConditions[].severityBand', 'activeConditions[].severity'], keys: ['activeConditions'] },
  'V-BAND-READINESS': { kind: 'band', paths: ['defenseProfile.readiness.label', 'defenseProfile.readiness.score'], keys: ['defenseProfile'] },
  'V-INCOME-100': { kind: 'arithmetic', paths: ['economicState.incomeSources[].percentage'], keys: ['economicState'] },
  'V-POWER-100': { kind: 'arithmetic', paths: ['powerStructure.factions[].power'], keys: ['powerStructure'] },
  'V-LEGIT-SUM': { kind: 'arithmetic', paths: [`${LEGITIMACY}.score`, `${LEGITIMACY}.breakdown`], keys: ['powerStructure'] },
  'V-LEGIT-FLAGS': { kind: 'flag-vector', paths: [`${LEGITIMACY}.label`, `${LEGITIMACY}.isEndorsed`, `${LEGITIMACY}.isApproved`, `${LEGITIMACY}.isTolerated`, `${LEGITIMACY}.isContested`, `${LEGITIMACY}.isLegitimacyCrisis`], keys: ['powerStructure'] },
  'V-BAND-LEGITIMACY': { kind: 'band', paths: [`${LEGITIMACY}.label`, `${LEGITIMACY}.score`], keys: ['powerStructure'] },
  'V-GOVERNING': { kind: 'count', paths: ['powerStructure.governingName', 'powerStructure.factions[].isGoverning'], keys: ['powerStructure'] },
  'V-FLAGVEC': {
    kind: 'flag-vector',
    paths: [`${FOOD_SECURITY}.label`, `${LEGITIMACY}.label`],
    keys: ['economicState', 'powerStructure'],
    arms: [
      { id: 'V-FLAGVEC/economicState', keys: ['economicState'] },
      { id: 'V-FLAGVEC/powerStructure', keys: ['powerStructure'] },
    ],
  },
  'V-EVIDENCE-ROSTER': { kind: 'prose-count', paths: [JUDGMENT_EVIDENCE, 'npcs', 'relationships'], keys: ['generationCoherenceReceipt', 'npcs', 'relationships'] },
  'V-EVIDENCE-EVENTS': { kind: 'prose-count', paths: [JUDGMENT_EVIDENCE, 'history.historicalEvents'], keys: ['generationCoherenceReceipt', 'history'] },
  'V-EVIDENCE-TENSION': { kind: 'referential', paths: [JUDGMENT_EVIDENCE, 'history.currentTensions'], keys: ['generationCoherenceReceipt', 'history'] },
  'V-EVIDENCE-STRESS': { kind: 'referential', paths: [JUDGMENT_EVIDENCE, 'stress.label'], keys: ['generationCoherenceReceipt', 'stress'] },
  'V-EVIDENCE-CONFLICT': { kind: 'referential', paths: [JUDGMENT_EVIDENCE, 'conflicts'], keys: ['conflicts', 'generationCoherenceReceipt'] },
  'V-DEFENSE-INST': { kind: 'referential', paths: ['defenseProfile.institutions', 'institutions'], keys: ['defenseProfile', 'institutions'] },
  'V-STRESS-IDENTITY': { kind: 'referential', paths: ['stress', 'stressors'], keys: ['stress', 'stressors'] },
  'V-DEFENSE-MAGICDEP': { kind: 'referential', paths: ['defenseProfile.scores.magicDependency', 'defenseProfile.magicDependency'], keys: ['defenseProfile'] },
  'V-DEFENSE-TRADITIONS': { kind: 'referential', paths: ['defenseProfile.scores.traditions', 'defenseProfile.traditions'], keys: ['defenseProfile'] },
  'V-HISTORY-AGE': { kind: 'referential', paths: ['history.founding.age', 'history.age'], keys: ['history'] },
});

/** DERIVED, never hand-listed: no independent arms and more than one top-level key. */
export const CROSS_KEY_CHECKS = Object.freeze(
  CHECK_IDS.filter((id) => !CHECK_META[id].arms && CHECK_META[id].keys.length > 1),
);
