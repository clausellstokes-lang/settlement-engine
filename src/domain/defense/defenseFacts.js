/**
 * domain/defense/defenseFacts.js — ONE SET OF DEFENCE FACTS (lane DEFENSE, 2026-11-03).
 *
 * What defends this place, whether it has a hospital or only a healer, and how many months
 * of food it holds, answered ONCE. Every sentence or row that mentions a garrison, soldiers,
 * walls, a watch, a hospital, a Guard Captain or a Garrison Commander asks this first; a
 * sentence whose thing is absent names what IS there (militia, watch, palisade, an
 * adventurers' hall) or says nothing.
 *
 * ⭐ IT READS THE ENGINE'S OWN ROSTER, NEVER A WORD IN A SENTENCE. The force half is
 * `standingDefenseForces` (the live, ruin-filtered partition `generateDefenseProfile` files
 * from); the generation-time snapshot `defenseProfile.institutions` is not read, because a
 * ruined citadel stays in it forever. The months of food are the engine's own figure,
 * `economicState.foodSecurity.storageMonths` (`foodGenerator.js :: generateFoodSecurity`),
 * never a building-name test for a granary.
 *
 * ⚠ ONE ADDITION TO THE BUCKETS, stated. The healer half is new: the old `hasHospital` flag
 * (`priorityHelpers.js :: getInstitutionNames`) is true for a 1st-level healer or a
 * monastery, so the word "hospital" was printed over both. Here `hasHospital` is a real
 * hospital and `hasHealer` is a healer, an infirmary or a monastic house.
 *
 * The thorp militia row is named `Household levy`. Since lane DEFENSE-2 (2026-11-03) the
 * bucket vocabulary (`DEFENSE_BUCKET_KEYWORDS.militia`) matches it, so the engine's scores, the
 * defence desk and this answer all read a levy thorp as having a militia, in one place.
 *
 * Pure: no randomness, no clock, no generator import.
 */

import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';
import { standingDefenseForces } from '../institutions/defenseInstitutionBuckets.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { SIEGE_PRODUCTION_KEPT } from '../../data/foodImportRates.js';

/**
 * @typedef {object} DefenseFacts
 * @property {boolean} hasWalls any standing enclosure: stone walls, a citadel, a palisade or earthworks
 * @property {'stone'|'palisade'|null} wallKind `stone` when any enclosure is masonry, `palisade` when the only one is timber or earth
 * @property {boolean} hasPalisade the place's enclosure is a palisade or earthwork and nothing stronger
 * @property {boolean} hasGarrison a garrison, barracks or professional guard stands
 * @property {boolean} hasWatch a town or city watch stands
 * @property {boolean} hasMilitia a citizen militia stands
 * @property {boolean} hasMercenary a mercenary company or free company stands
 * @property {boolean} hasGate the place keeps a gate: stone walls (which carry their gates) or a gate row of its own
 * @property {boolean} hasCommander a garrison stands, so someone commands one (the Garrison Commander's licence)
 * @property {boolean} hasCharter an adventurers' charter hall or guild stands
 * @property {string|null} forceName the roster name of the force that holds the place (garrison, then watch, militia, hired company, charter hall), or null
 * @property {ReadonlyArray<string>} defenceNames the roster names of every standing defence the defence purse pays for (enclosures and forces)
 * @property {boolean} hasHospital a real hospital stands
 * @property {boolean} hasHealer a healer, an infirmary or a monastic house tends the sick
 * @property {string|null} healerName the roster name of the healer, infirmary or monastic house, or null
 * @property {number|null} storedFoodMonths the engine's months of stored food, or null when the record carries none
 */

/** @param {unknown} inst @returns {string} */
const nameOf = (inst) => String(nativeSemanticName(inst) || '');

/** @param {ReadonlyArray<string>} names @param {RegExp} re @returns {string|null} */
const firstMatching = (names, re) => names.find((n) => re.test(n)) ?? null;

const HOSPITAL_RE = /\bhospital/i;
const HEALER_RE = /\bhealer\b|\binfirmar|\bmonaster|\bfriary\b/i;
const TIMBER_ENCLOSURE_RE = /palisade|earthwork/i;
// The town free company is a hired company the bucket vocabulary does not spell
// (`DEFENSE_BUCKET_KEYWORDS.mercenary`; F1, 2026-11-04). The bucket table is persisted
// generator output, so the reader counts the row here and the table stays byte-identical.
const FREE_COMPANY_RE = /\bfree company\b/i;
const GATE_RE = /\bgates?\b/i;

/**
 * THE ONE ANSWER to "what defends this place, who tends its sick, how long can it eat".
 *
 * @param {{ institutions?: unknown, economicState?: unknown } | null | undefined} settlement
 * @returns {Readonly<DefenseFacts>}
 */
export function defenseFactsOf(settlement) {
  const forces = standingDefenseForces(settlement);
  const roster = liveInstitutions(settlement).map(nameOf).filter(Boolean);

  const wallNames = forces.walls.names;
  const stone = wallNames.some((n) => !TIMBER_ENCLOSURE_RE.test(n));
  const hasWalls = wallNames.length > 0;
  const wallKind = hasWalls ? (stone ? 'stone' : 'palisade') : null;

  const forceName = forces.garrison.names[0]
    ?? forces.watch.names[0]
    ?? forces.militia.names[0]
    ?? forces.mercenary.names[0]
    ?? forces.charter.names[0]
    ?? null;
  const defenceNames = [...new Set([
    ...wallNames,
    ...forces.garrison.names,
    ...forces.watch.names,
    ...forces.militia.names,
    ...forces.mercenary.names,
    ...forces.charter.names,
  ])];

  const healerName = firstMatching(roster, HEALER_RE);
  const economicState = /** @type {{ foodSecurity?: { storageMonths?: unknown } } | null | undefined} */ (
    settlement?.economicState
  );
  const months = economicState?.foodSecurity?.storageMonths;

  return Object.freeze({
    hasWalls,
    wallKind,
    hasPalisade: wallKind === 'palisade',
    hasGarrison: forces.garrison.present,
    hasWatch: forces.watch.present,
    hasMilitia: forces.militia.present,
    hasMercenary: forces.mercenary.present || roster.some((n) => FREE_COMPANY_RE.test(n)),
    hasGate: wallKind === 'stone' || roster.some((n) => GATE_RE.test(n)),
    hasCommander: forces.garrison.present,
    hasCharter: forces.charter.present,
    forceName,
    defenceNames: Object.freeze(defenceNames),
    hasHospital: roster.some((n) => HOSPITAL_RE.test(n)),
    hasHealer: healerName !== null,
    healerName,
    storedFoodMonths: typeof months === 'number' && Number.isFinite(months) ? months : null,
  });
}

// ── THE WALLS ANSWER FOR THE DOSSIER'S STATE PROSE (F10 WALLS-WORD, rung 1C, 2026-11-04) ──
// The state-prose kernel's `walls` dimension (`stateProseKernel.js :: STATE_MARK_DIMENSIONS`)
// is answered HERE and nowhere else: a variant marked `walls` speaks only where an enclosure
// stands, its twin marked `no walls` only where none does. The two words are the kernel's;
// this module does not import the kernel (a display leaf), so they are spelled once below and
// `tests/domain/wallsWordDossierProse.test.js` holds them equal to the kernel's.

/**
 * The kernel's `walls` dimension word for this place. Typed `object` because every desk holds
 * its own narrow view of the settlement; the reader takes the roster from whichever it is.
 * @param {object | null | undefined} settlement
 * @returns {'walls'|'no walls'}
 */
export function wallsDimensionOf(settlement) {
  const record = /** @type {{ institutions?: unknown } | null | undefined} */ (settlement);
  return defenseFactsOf(record).hasWalls ? 'walls' : 'no walls';
}

/**
 * A desk's options with the `walls` dimension answered for this place. Every other dimension
 * the caller already answered is kept.
 * @template {object} T
 * @param {object | null | undefined} settlement
 * @param {T} options
 * @returns {T & { dimensions: Record<string, string> }}
 */
export function wallsAnswered(settlement, options) {
  const given = /** @type {{ dimensions?: Record<string, string> } | null | undefined} */ (options)?.dimensions;
  return Object.assign({}, options, { dimensions: { ...(given || {}), walls: wallsDimensionOf(settlement) } });
}

// ── THE DEFENCE ROLES (R6, soak 1000 rung 1, 2026-11-04) ─────────────────────────────────
// A role that commands a force is held only where the force stands on the place's own record,
// never by the tier alone: the NPC generator's mandated "Guard Captain" of every village, town
// and city (npcGenerator.js :: generateNPCs, TIER_MANDATORY_ROLES) read the tier. The reading is
// the defence-words check's own (`coherence/defenseWordsFindings.js`, its Guard Captain term).

/** @type {Readonly<Record<string, (f: DefenseFacts) => boolean>>} */
const ROLE_NEEDS = Object.freeze({
  'Guard Captain': (f) => f.hasGarrison || f.hasWatch || f.hasMilitia,
  // F1 (rung 1B): a Garrison Commander commands a garrison; the stress rows and the pool seated
  // one over a town watch (28 settlements at rung 1, 32 at rung 1B).
  'Garrison Commander': (f) => f.hasCommander,
});

/**
 * @typedef {object} ForceWords
 * @property {string} body the force as a body, bare: `garrison`, `hired company`, `watch`, `militia`, or `guard` where none stands
 * @property {string} members its people: `soldiers`, `watchmen`, `militia`, or `guards`
 * @property {string} member one of them: `soldier`, `watchman`, `militiaman`, or `guard`
 */

/** @type {Readonly<ForceWords>} */
export const GARRISON_WORDS = Object.freeze({ body: 'garrison', members: 'soldiers', member: 'soldier' });
const MERCENARY_WORDS = Object.freeze({ body: 'hired company', members: 'soldiers', member: 'soldier' });
const WATCH_WORDS = Object.freeze({ body: 'watch', members: 'watchmen', member: 'watchman' });
const MILITIA_WORDS = Object.freeze({ body: 'militia', members: 'militia', member: 'militiaman' });
const GUARD_WORDS = Object.freeze({ body: 'guard', members: 'guards', member: 'guard' });

/**
 * THE WORDS FOR THE FORCE THAT STANDS (F1, 2026-11-04): a sentence that names the place's
 * armed body takes its noun here, so "a road toll for the garrison" reads "for the watch" in a
 * town that keeps a watch and no garrison. A garrison keeps its own words, so a garrisoned place's
 * prose is unchanged to the byte; a hired company keeps the soldiers but is not called a garrison.
 *
 * @param {Pick<DefenseFacts, 'hasGarrison'|'hasWatch'|'hasMilitia'|'hasMercenary'> | null | undefined} facts
 * @returns {Readonly<ForceWords>}
 */
export function forceWordsOf(facts) {
  if (!facts || facts.hasGarrison) return GARRISON_WORDS;
  if (facts.hasMercenary) return MERCENARY_WORDS;
  if (facts.hasWatch) return WATCH_WORDS;
  if (facts.hasMilitia) return MILITIA_WORDS;
  return GUARD_WORDS;
}

/**
 * A filter for roles (a role string, or a candidate row carrying `role`): false for a defence
 * role whose force the place does not hold, true for every other role.
 *
 * @param {{ institutions?: unknown } | null | undefined} settlement
 * @returns {(row: string | { role?: unknown }) => boolean}
 */
export function defenceRoleGate(settlement) {
  const facts = defenseFactsOf(settlement);
  return (row) => {
    const role = typeof row === 'string' ? row : String(row?.role ?? '');
    const needs = Object.hasOwn(ROLE_NEEDS, role) ? ROLE_NEEDS[role] : null;
    return !needs || needs(facts);
  };
}

// ── FOOD ENDURANCE (lane DEFENSE-3, X-52, 2026-11-03) ───────────────────────────────────
// The owner: "i think stored food should have a version or reference in defense because that
// is a major compoenent of a siege warfare", then "call it food endurance rather than siege
// endurance". A READING of the one food record (`economicState.foodSecurity.foodRecord`,
// `foodBalance.js :: deriveFoodRecord`), never a second figure source: the months in store
// stay the Economy tab's row; this says how long they last once the place is shut in.

// The share of its harvest a place keeps under siege is THE FOOD WRITERS' OWN dial,
// `data/foodImportRates.js :: SIEGE_PRODUCTION_KEPT` (the outlying farmland abandoned or razed);
// this file reads it and spells no copy, so the record and this reading cannot drift.

/**
 * @typedef {object} FoodEndurance
 * @property {number} storedMonths the record's months in store (`foodRecord.storageMonths`)
 * @property {boolean} hasGranary a real granary stands (`foodRecord.hasGranary`)
 * @property {boolean} besieged the record was written under a siege, so its harvest is already the siege harvest
 * @property {number} keptShare the share of the daily need the place still grows once besieged
 * @property {number|null} fullRationMonths months the stores last at full rations, or null when what is still grown feeds the place
 * @property {number|null} halfRationMonths months the stores last on half rations, or null when what is still grown covers half rations
 */

/**
 * FOOD ENDURANCE: how long the stores carry the place under siege. The hinterland's carts and
 * the trade routes are cut (the food writer's own siege: `hinterlandSupply` 0, route
 * isolated), the place keeps `SIEGE_PRODUCTION_KEPT` of what it grows, and the stores cover the
 * rest: months = storageMonths ÷ (rations − kept share). A place already besieged at birth
 * has the siege harvest in its record, so its share is not cut twice. Magic supply is not
 * counted: the record does not say which channel survives a blockade.
 *
 * @param {{ economicState?: unknown } | null | undefined} settlement
 * @returns {Readonly<FoodEndurance> | null} null when the place carries no food record with months in store
 */
export function foodEnduranceOf(settlement) {
  const foodSecurity = /** @type {{ hasSiege?: unknown, foodRecord?: { storageMonths?: unknown, hasGranary?: unknown, grownPct?: unknown } } | null | undefined} */ (
    /** @type {{ foodSecurity?: unknown } | null | undefined} */ (settlement?.economicState)?.foodSecurity
  );
  const record = foodSecurity?.foodRecord;
  const stored = record?.storageMonths;
  if (typeof stored !== 'number' || !Number.isFinite(stored) || stored <= 0) return null;
  const grown = typeof record?.grownPct === 'number' && Number.isFinite(record.grownPct) ? Math.max(0, record.grownPct) : 0;
  const besieged = foodSecurity?.hasSiege === true;
  const keptShare = (grown / 100) * (besieged ? 1 : SIEGE_PRODUCTION_KEPT);
  // Full rations draw (1 − kept) of a month's need from the stores each month; half rations
  // draw (½ − kept), so the stores last 2·stored ÷ (1 − 2·kept) months.
  return Object.freeze({
    storedMonths: stored,
    hasGranary: record?.hasGranary === true,
    besieged,
    keptShare,
    fullRationMonths: keptShare < 1 ? stored / (1 - keptShare) : null,
    halfRationMonths: 2 * keptShare < 1 ? (2 * stored) / (1 - 2 * keptShare) : null,
  });
}
