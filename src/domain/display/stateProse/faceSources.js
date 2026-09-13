/**
 * domain/display/stateProse/faceSources.js — WHICH POWERS OF A TOWN CAN SPEAK (ADDENDUM 18
 * ruling 15; car 8b-W-18c).
 *
 * WHAT THIS IS. Each pool state of the REWRITE corpus carries one face per SOURCE — a power
 * of the town: the hall, the tavern, the guilds, the register, the elders, the muster, the
 * watch, the garrison, the gate, the market, the court, the stranger. A town DRAWS ONE among
 * the faces whose source EXISTS ON THAT TOWN (`stateProseKernel.js` `drawFace`, over
 * `eligibleFaces`). This module is the ONE reader that answers "which sources exist here":
 * it turns a settlement into the set of vocabulary words that resolve on it, and the desks
 * hand that set to the composer once per entry point (`withFaceSources`).
 *
 * ── WHY THIS IS ITS OWN MODULE AND NOT A KERNEL LIMB ─────────────────────────────────
 * The kernel is a PURE, HEADLESS LEAF (no imports, no settlement) and the composer's import
 * list is fenced at the kernel plus three frozen leaves (`composeStateProseFence.test.js`),
 * so neither may read a roster. The seating is a fact about the TOWN — the institution
 * roster, ruin-filtered through the canonical accessor, and the force buckets — and the
 * modules that already know it live under `src/domain/institutions/`. This file imports
 * those and the kernel's vocabulary, and NOTHING under `src/domain/prose/` (the prose island
 * is byte-fenced off the product; ruling 13b's holder table is the RESEARCH instrument this
 * mirrors, not a dependency).
 *
 * ── THE SEATING (ADDENDUM 18 ruling 13b, measured on the holder table) ───────────────
 *   stranger   everywhere — the universal source; a face with no tag is his
 *   elders     below town (thorp · hamlet · village), the tier's `Record of custom`
 *   hall       a live `Town hall` / `City hall` row
 *   tavern     a live taverns / inn / alehouse row (`Alehouse` at hamlet, `Taverns (5-20)`
 *              at town, `Inns and taverns (district)` at city)
 *   guild      a live `Craft guilds` row
 *   register   a live parish / church / temple / abbey row that STANDS HERE — never the
 *              thorp's `Access to parish church`, which is a walk to someone else's register
 *   muster     the militia bucket present (`standingDefenseForces`)
 *   watch      the watch bucket present
 *   garrison   the garrison bucket present
 *   gate       a gate-bearing wall row — the `hasGates` reading of `priorityHelpers.js`
 *   market     a market row — the `hasMarket` reading
 *   court      a court row — the `hasCourtSystem` reading
 *
 * ⛔ THE THREE FLAG LISTS ARE RE-SPELLED FROM `src/generators/priorityHelpers.js` RATHER THAN
 * IMPORTED, because that module keeps `getInstitutionNames` private and no display module
 * imports from `src/generators/` today. The re-spelling is held to the source by a test that
 * reads the generator file and asserts each list appears there verbatim, so a drift reds by
 * name rather than seating a power the engine no longer recognises.
 *
 * ⛔⛔ NO OBJECT LITERAL IN THIS FILE IS KEYED ON A SOURCE WORD. The wiring census's producer
 * index reads every object-literal key and member assignment under `src/domain/**` as a
 * WRITE of world state (`scripts/wiring-census.mjs` `producerCitations`), and `court`,
 * `watch`, `garrison` and `market` are fields the desks READ: a map keyed on them would mint
 * four false producers and move the census's `absent` labels, which is exactly the defect the
 * holder table recorded and cured at its own birth. The roster is built with `Set#add` on
 * string literals, and the keyword lists are arrays.
 *
 * PURE: no clock, no RNG, no store. Reads the settlement it is handed and nothing else.
 *
 * @enforced-by tests/domain/faceSources.test.js
 * @enforced-by tests/lint/composeStateProseFence.test.js (the import fence)
 */
import { liveInstitutions } from '../../institutions/institutionRoster.js';
import { standingDefenseForces } from '../../institutions/defenseInstitutionBuckets.js';
import { nativeSemanticName } from '../../content/customContentSemanticAuthority.js';
import { FACE_SOURCES, UNIVERSAL_SOURCE } from './stateProseKernel.js';

/** The sources that resolve on every town, whatever it holds. */
export const ALWAYS_SOURCES = Object.freeze([UNIVERSAL_SOURCE]);

/** The tiers below town, where the elders keep the record of custom (ruling 13b). */
const ELDER_TIERS = Object.freeze(['thorp', 'hamlet', 'village']);

/** `Town hall` / `City hall` — the hall's catalogue rows, matched on the semantic name. */
const HALL_NAMES = Object.freeze(['town hall', 'city hall']);
/** Taverns, inns, the hamlet's alehouse — matched as substrings; `inn` on a word boundary. */
const TAVERN_NAMES = Object.freeze(['tavern', 'alehouse']);
const INN_RE = /\binns?\b/;
/** Every `Craft guilds (…)` row, at town, city and metropolis. */
const GUILD_NAMES = Object.freeze(['craft guild']);
/** A register stands where a parish, church, temple or house of religion STANDS. */
const REGISTER_NAMES = Object.freeze(['church', 'cathedral', 'temple', 'abbey', 'monastery', 'friary']);
/** The thorp's `Access to parish church` is a walk, not a register. */
const REGISTER_EXCLUDE_PREFIX = 'access to';
/** `hasGates`, verbatim from priorityHelpers.js. */
const GATE_NAMES = Object.freeze(['gates', 'town walls', 'city walls', 'massive walls', 'palisade']);
/** `hasMarket`, verbatim from priorityHelpers.js. */
const MARKET_NAMES = Object.freeze(['market', 'bazaar', 'fair', 'trade center', 'exchange']);
/** `hasCourtSystem`, verbatim from priorityHelpers.js. */
const COURT_NAMES = Object.freeze(['courthouse', 'court buildings', 'democratic assembly', 'city hall', 'town hall']);

/**
 * The generator's own keyword lists, exported so the test can hold them to
 * `src/generators/priorityHelpers.js` by name.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const PRIORITY_HELPER_LISTS = Object.freeze({
  hasGates: GATE_NAMES, hasMarket: MARKET_NAMES, hasCourtSystem: COURT_NAMES,
});

/**
 * Does any name carry any keyword as a substring? The generator's `hasAny`, re-spelled.
 * @param {ReadonlyArray<string>} names lower-cased
 * @param {ReadonlyArray<string>} keywords
 * @returns {boolean}
 */
function anyNamed(names, keywords) {
  return names.some((name) => keywords.some((keyword) => name.includes(keyword)));
}

/**
 * ⭐ THE ROSTER OF SOURCES THAT RESOLVE ON THIS TOWN — a subset of `FACE_SOURCES`, always
 * holding the universal source. Total over a missing or malformed settlement: `null`, `{}`,
 * a town with no roster at all, each yields `{stranger}` and never throws, because this is a
 * display path and a rung read by the stranger alone beats a crashed page.
 * @param {{tier?: unknown, institutions?: unknown, [key: string]: unknown}|null|undefined} settlement
 * @returns {Set<string>}
 */
export function sourcesOf(settlement) {
  /** @type {Set<string>} */
  const out = new Set(ALWAYS_SOURCES);
  if (!settlement || typeof settlement !== 'object') return out;
  const tier = typeof settlement.tier === 'string' ? settlement.tier.toLowerCase() : '';
  if (ELDER_TIERS.includes(tier)) out.add('elders');
  const names = liveInstitutions(settlement)
    .map((inst) => nativeSemanticName(inst).toLowerCase())
    .filter((name) => name !== '');
  if (anyNamed(names, HALL_NAMES)) out.add('hall');
  if (anyNamed(names, TAVERN_NAMES) || names.some((name) => INN_RE.test(name))) out.add('tavern');
  if (anyNamed(names, GUILD_NAMES)) out.add('guild');
  if (names.some((name) => !name.startsWith(REGISTER_EXCLUDE_PREFIX)
    && REGISTER_NAMES.some((keyword) => name.includes(keyword)))) out.add('register');
  const forces = standingDefenseForces(settlement);
  if (forces.militia.present) out.add('muster');
  if (forces.watch.present) out.add('watch');
  if (forces.garrison.present) out.add('garrison');
  if (anyNamed(names, GATE_NAMES)) out.add('gate');
  if (anyNamed(names, MARKET_NAMES)) out.add('market');
  if (anyNamed(names, COURT_NAMES)) out.add('court');
  // The vocabulary is CLOSED at the kernel; a word added above and not there is a defect
  // this line makes loud in the suite rather than silent on the page.
  for (const word of out) if (!FACE_SOURCES.includes(word)) out.delete(word);
  return out;
}

/**
 * ⭐ THE DESK'S ONE LINE. Every exported entry point of the six desks takes `(settlement, …,
 * options)` and spreads `options` into each composer call; this puts the town's roster on it
 * ONCE per entry, and leaves a roster the caller already supplied untouched — so an outer
 * entry that delegates to an inner one (the defence desk's `defenseStateProse` calls its
 * siblings) computes the set once, and a test may hand a roster of its own.
 * @template {object} T
 * @param {{institutions?: unknown, [key: string]: unknown}|null|undefined} settlement
 * @param {T} [options]
 * @returns {T & {sources: ReadonlySet<string>|ReadonlyArray<string>}}
 */
export function withFaceSources(settlement, options) {
  /** @type {Record<string, unknown>} */
  const given = options && typeof options === 'object' ? options : {};
  const held = given.sources;
  if (held instanceof Set || Array.isArray(held)) {
    return /** @type {T & {sources: ReadonlySet<string>|ReadonlyArray<string>}} */ (
      /** @type {unknown} */ (given)
    );
  }
  return /** @type {T & {sources: ReadonlySet<string>|ReadonlyArray<string>}} */ (
    /** @type {unknown} */ ({ ...given, sources: sourcesOf(settlement) })
  );
}
