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
import { officesOf } from '../../institutions/institutionTable.js';
import { nativeSemanticName } from '../../content/customContentSemanticAuthority.js';
import {
  INSTITUTION_ROLES, ROSTER_OFFICE_TITLES, SOURCE_FALLBACK_ROLES,
} from '../../../data/institutionRoles.js';
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
  for (const name of names) for (const word of sourcesOfRowName(name)) out.add(word);
  const forces = standingDefenseForces(settlement);
  if (forces.militia.present) out.add('muster');
  if (forces.watch.present) out.add('watch');
  if (forces.garrison.present) out.add('garrison');
  // The vocabulary is CLOSED at the kernel; a word added above and not there is a defect
  // this line makes loud in the suite rather than silent on the page.
  for (const word of out) if (!FACE_SOURCES.includes(word)) out.delete(word);
  return out;
}

/**
 * ⭐ WHICH SOURCES ONE CATALOGUE ROW LENDS, by its printed name — the per-row half of
 * `sourcesOf`, extracted at car 8b-W-18l so `rolesOf` can walk the SAME predicates row by row
 * instead of a second spelling of them drifting beside the first.
 *
 * ⛔ THE FORCE SOURCES ARE NOT HERE, deliberately. `muster`, `watch` and `garrison` are seated
 * by `standingDefenseForces` — a TYPED bucket with a ruin filter and a count — and not by a
 * keyword over a name. A row name cannot answer for them, so this function does not pretend
 * to: both callers read the buckets themselves.
 *
 * @param {string} name the row's semantic name, ALREADY lower-cased
 * @returns {string[]} the source words this row lends; may be empty, or several
 */
export function sourcesOfRowName(name) {
  /** @type {string[]} */
  const out = [];
  const names = [name];
  if (anyNamed(names, HALL_NAMES)) out.push('hall');
  if (anyNamed(names, TAVERN_NAMES) || INN_RE.test(name)) out.push('tavern');
  if (anyNamed(names, GUILD_NAMES)) out.push('guild');
  if (!name.startsWith(REGISTER_EXCLUDE_PREFIX)
    && REGISTER_NAMES.some((keyword) => name.includes(keyword))) out.push('register');
  if (anyNamed(names, GATE_NAMES)) out.push('gate');
  if (anyNamed(names, MARKET_NAMES)) out.push('market');
  if (anyNamed(names, COURT_NAMES)) out.push('court');
  return out;
}

/** The three force buckets, paired with the source each seats. An ARRAY, never a map. */
const FORCE_BUCKET_SOURCES = Object.freeze([
  Object.freeze({ bucket: 'militia', source: 'muster' }),
  Object.freeze({ bucket: 'watch', source: 'watch' }),
  Object.freeze({ bucket: 'garrison', source: 'garrison' }),
]);

/** The role table's rows, lower-cased once, so a lookup is by the same key the roster reads. */
const ROLE_ROWS_BY_LOWER_NAME = new Map(
  Object.entries(INSTITUTION_ROLES).map(([row, roles]) => [row.toLowerCase(), roles]),
);

/**
 * Add every role a named row lends to each source it lends to, skipping an `office` role the
 * town's own roster does not print (ruling 25 edge (a)).
 * @param {Map<string, Array<{role: string, n: string}>>} out
 * @param {ReadonlyArray<string>} sources
 * @param {string} rowName the row's semantic name, any case
 * @param {ReadonlySet<string>} offices lower-cased office titles this town prints
 */
function addRowRoles(out, sources, rowName, offices) {
  const roles = ROLE_ROWS_BY_LOWER_NAME.get(String(rowName).toLowerCase());
  if (!roles || sources.length === 0) return;
  for (const source of sources) {
    if (!FACE_SOURCES.includes(source)) continue;
    const held = out.get(source) || [];
    for (const entry of roles) {
      if (entry.office === true && !offices.has(entry.role.toLowerCase())) continue;
      if (!held.some((row) => row.role === entry.role)) held.push({ role: entry.role, n: entry.n });
    }
    out.set(source, held);
  }
}

/**
 * ⭐⭐ THE ROLES EACH SEATED SOURCE CAN SPEAK THROUGH ON THIS TOWN (ADDENDUM 18 ruling 25).
 *
 * A `Map` from a source word to the roster the page may draw from — built from the town's LIVE
 * rows, so a role cannot outlive the institution that lends it, and topped up from
 * `SOURCE_FALLBACK_ROLES` for any seated source whose rows carry nothing (a custom row, a row
 * the table has not grown yet, and the two sources that are not rows at all: the `stranger`,
 * who has the roads, and the `elders`, seated by tier).
 *
 * ⛔ A `Map`, NOT AN OBJECT. The wiring census reads an object-literal key under `src/domain/**`
 * as a WRITE of world state, and `watch`, `court`, `market` and `garrison` are fields the desks
 * READ: a map keyed on them would mint four false producers. `Map#set` on a string literal is
 * the same discipline `sourcesOf` keeps with `Set#add`.
 *
 * ⭐ THE NAMED OFFICES ARE GATED ON THE TOWN'S OWN ROSTER. `officesOf` is the institution
 * table's reader of what the dossier actually prints for this settlement (its NPC roles and
 * titles, and the governing seat). An `office: true` role whose title that roster does not
 * carry is dropped here, so 'the guard captain' speaks only where a guard captain is printed.
 *
 * @param {{tier?: unknown, institutions?: unknown, npcs?: unknown, [key: string]: unknown}|null|undefined} settlement
 * @returns {Map<string, Array<{role: string, n: string}>>}
 */
export function rolesOf(settlement) {
  /** @type {Map<string, Array<{role: string, n: string}>>} */
  const out = new Map();
  const seated = sourcesOf(settlement);
  if (settlement && typeof settlement === 'object') {
    const printed = officesOf(/** @type {never} */ (settlement)) || [];
    /** @type {Set<string>} */
    const offices = new Set(printed.map((office) => {
      const row = ROSTER_OFFICE_TITLES.find((r) => r.roster.toLowerCase() === String(office).toLowerCase());
      return row ? row.title.toLowerCase() : String(office).toLowerCase();
    }));
    for (const inst of liveInstitutions(settlement)) {
      const rowName = nativeSemanticName(inst);
      if (!rowName) continue;
      addRowRoles(out, sourcesOfRowName(rowName.toLowerCase()), rowName, offices);
    }
    const forces = standingDefenseForces(settlement);
    for (const { bucket, source } of FORCE_BUCKET_SOURCES) {
      const held = forces[bucket];
      if (!held || !held.present) continue;
      for (const rowName of held.names) addRowRoles(out, [source], rowName, offices);
    }
    // The elders are seated by TIER, so their rows are the tier's government rows — already
    // walked above where one of them is in the table — and the fallback below covers the rest.
  }
  for (const { source, roles } of SOURCE_FALLBACK_ROLES) {
    if (!seated.has(source)) continue;
    const held = out.get(source) || [];
    if (held.length > 0) continue;
    out.set(source, roles.map((entry) => ({ role: entry.role, n: entry.n })));
  }
  // A seated source with no roster at all would silence every face that names it; the line
  // above makes that impossible for the twelve, and this one makes a THIRTEENTH word loud.
  for (const source of out.keys()) if (!FACE_SOURCES.includes(source)) out.delete(source);
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
  // ⭐ THE ROLES RIDE WITH THE ROSTER (car 8b-W-18l). They are computed on the same line
  // because they answer the same question one grain finer — not "which powers speak here"
  // but "through whom" — and because a read carrying a source word with no role behind it
  // would silence every face that names its slot.
  return /** @type {T & {sources: ReadonlySet<string>|ReadonlyArray<string>}} */ (
    /** @type {unknown} */ ({
      ...given,
      sources: sourcesOf(settlement),
      roles: rolesOf(settlement),
      // ⭐ ONE EXCLUSION SET PER DESK ENTRY (ruling 25 edge (e)): the composer adds each role
      // it prints, and the draw skips what is already in it until the roster is exhausted.
      printedRoles: given.printedRoles instanceof Set ? given.printedRoles : new Set(),
    })
  );
}
