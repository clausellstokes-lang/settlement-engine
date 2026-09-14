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
 *   public     everywhere — the town's people as a whole, owed to no power and backed by no
 *              row (ADDENDUM 18 ruling 28; car 8b-W-18n). Its ROLES follow the tier
 *              (`PUBLIC_ROLES_BY_TIER`), plural always, never an office.
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
  INSTITUTION_ROLES, PUBLIC_ROLES_BY_TIER, ROSTER_OFFICE_TITLES, SOURCE_FALLBACK_ROLES,
} from '../../../data/institutionRoles.js';
import {
  COMPROMISABLE_SOURCES, FACE_SOURCES, PUBLIC_SOURCE, UNIVERSAL_SOURCES, scribeBlocksFrom,
} from './stateProseKernel.js';

/**
 * The settlement's Scribe artefact, or null. Typed as an unknown member read rather than cast,
 * because the artefact's own shape is the kernel's to validate and this file only has to hand it
 * over. `src/domain/display/` is the one subtree the FINITE-SEMANTICS pin exempts, and drawing the
 * prose is exactly why.
 * @param {{[key: string]: unknown}|null|undefined} settlement @returns {unknown}
 */
function proseOf(settlement) {
  return settlement && typeof settlement === 'object' ? settlement.prose : null;
}

/**
 * The engine fingerprint a rendered artefact must match before its words may be drawn (design §7).
 * It is the WORLD'S own two versions, read off the settlement, rather than this build's constants:
 * a settlement stamps `generatorVersion` and `simulationVersion` at generation and a migration is
 * what moves either one, so this is exactly "the world's pinned version" the design names, and it
 * needs no import to read.
 * @param {{[key: string]: unknown}|null|undefined} settlement
 * @returns {string}
 */
function engineVersionOf(settlement) {
  const gen = settlement ? settlement.generatorVersion : undefined;
  const sim = settlement ? settlement.simulationVersion : undefined;
  return `gen-${String(gen ?? '')}/sim-${String(sim ?? '')}`;
}

/**
 * The sources that resolve on every town, whatever it holds: the STRANGER, who has the roads,
 * and the PUBLIC (ADDENDUM 18 ruling 28; car 8b-W-18n), who is the town's people as a whole and
 * is seated by nothing because nothing backs it. The list is the kernel's, so a word added to
 * one and not the other is a defect rather than a silence.
 */
export const ALWAYS_SOURCES = UNIVERSAL_SOURCES;

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
      // ⛔ A ROW THAT LENDS TWO SOURCES SPLITS ITS ROLES (`for`). The meeting hall seats both
      // the `hall` and the `court`, and without the split a `[court]` face spoke in the
      // hall's voice. An entry with no `for` goes to every source its row lends.
      if (Array.isArray(entry.for) && !entry.for.includes(source)) continue;
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
  const publicTier = settlement && typeof settlement === 'object' && typeof settlement.tier === 'string'
    ? settlement.tier.toLowerCase() : '';
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
  // ⭐⭐ THE PUBLIC'S ROSTER IS THE TIER'S (ADDENDUM 18 ruling 28 edge (f); car 8b-W-18n).
  // It is set HERE rather than in `SOURCE_FALLBACK_ROLES` because the public is not a source
  // that fell through the table — it has no catalogue row to fall through FROM, and what it is
  // called is a fact about the tier and nothing else. `tiers: null` matches every tier and sits
  // last, so an unknown or missing tier reads as the town-and-above roster rather than silence.
  const publicRow = PUBLIC_ROLES_BY_TIER.find((r) => r.tiers === null || r.tiers.includes(publicTier))
    || PUBLIC_ROLES_BY_TIER[PUBLIC_ROLES_BY_TIER.length - 1];
  out.set(PUBLIC_SOURCE, publicRow.roles.map((entry) => ({ role: entry.role, n: entry.n })));
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
 * ⭐⭐ WHICH OF THIS TOWN'S SOURCES THE ENGINE HOLDS A SECRET ABOUT (ADDENDUM 18 ruling 26;
 * car 8b-W-18m).
 *
 * A source is COMPROMISED where a COVERT FIELD of the simulation puts it under somebody else's
 * hand. The page never says so; the draw makes that source speak, and what it says is its own
 * concealment (`compromisedDraw` in the kernel). This function is the ONE reader of which
 * covert fields exist, and it reads the settlement and nothing else.
 *
 * ── THE COVERT FIELDS, EACH NAMED WITH WHAT IT COMPROMISES ──────────────────────────
 *   `powerStructure.criminalCaptureState` at `corrupted` or `capture` → the HALL.
 *     The producer's own five-state ladder (`defenseStateProse.js` CRIMINAL_CAPTURE_POOL, and
 *     DS-DEF-4's own pools say it in words: at `corrupted` "the hall's decisions are not the
 *     hall's"). The two lower rungs are NOT covert — `adversarial` is an open fight and
 *     `equilibrium` an open accommodation — so they compromise nothing.
 *   a bloc carrying `covert: true` → the WATCH and the COURT.
 *     `settlementPolitics`'s covert bloc, the same field `powerStateProse.js` reads at its
 *     presence lens (`blocs.some((b) => b?.covert === true)`). A conspiracy that has not been
 *     dragged into the light holds enforcement and law before it holds anything else.
 *
 * ⛔ TWO THINGS RULING 26 NAMES THAT THE ENGINE DOES NOT RECORD, omitted and reported OPEN:
 *   THE UNEXPOSED OFFICER. The roster's `Corrupt Official` is a role the dossier PRINTS, on
 *     the `occupied` and `insurgency` stresses — a public fact, not a covert one. There is no
 *     field anywhere that records an officer whose corruption is still hidden.
 *   THE CULT'S HAND ON THE REGISTER. A creed's settlement standing is recorded (`cult` /
 *     `established` / `ascendant`) and it is PUBLIC: no covert flag stands beside it. Until a
 *     field records that the hand is hidden, `register` is not compromisable — and the
 *     kernel's `COMPROMISABLE_SOURCES` refuses the tag on it, so a writer cannot tag a
 *     conspiracy the simulation never held.
 *
 * ⚠ AND THE FIELDS ARE WORLD-PULSE FIELDS, measured rather than assumed: over forty freshly
 * generated towns `criminalCaptureState` is `none` on all forty, and no fresh settlement
 * carries `blocs` at all. The mechanism is therefore INERT on a fresh generation and lights
 * only on a world that has been advanced — which is the same shape as every other pulse field
 * the desks read, and is why the suite drives it on a settlement whose fields are set by hand.
 *
 * ⛔ A `Set` BUILT WITH `add` ON STRING LITERALS, never an object keyed on a source word: the
 * wiring census would read `watch` and `court` as WRITES of world state. The discipline this
 * file keeps throughout.
 *
 * @param {{powerStructure?: unknown, [key: string]: unknown}|null|undefined} settlement
 * @returns {Set<string>} a subset of the kernel's `COMPROMISABLE_SOURCES`
 */
export function compromisedSourcesOf(settlement) {
  /** @type {Set<string>} */
  const out = new Set();
  if (!settlement || typeof settlement !== 'object') return out;
  const power = /** @type {Record<string, unknown>} */ (settlement.powerStructure) || {};
  const capture = typeof power.criminalCaptureState === 'string' ? power.criminalCaptureState : '';
  if (capture === 'corrupted' || capture === 'capture') out.add('hall');
  const blocs = Array.isArray(power.blocs) ? power.blocs : [];
  if (blocs.some((bloc) => bloc && typeof bloc === 'object' && bloc.covert === true)) {
    out.add('watch');
    out.add('court');
  }
  // The closed table is the kernel's; a word added above and not there is a defect this line
  // makes loud in the suite rather than silent on the page.
  for (const word of out) if (!COMPROMISABLE_SOURCES.includes(word)) out.delete(word);
  return out;
}

/**
 * ⭐ THE YEAR THE RENDER SEES (ADDENDUM 18 ruling 26 edge (h)).
 *
 * ⛔ THE FINDING, RECORDED BECAUSE THE BRIEF ASKED WHERE THE YEAR IS AND THE ANSWER IS "NOWHERE
 * OBVIOUS". `/usr/bin/grep -rn "currentYear" src` returns NOTHING: no field of that name exists
 * anywhere in the tree, and the composer and the composed walker carry no time at all. The one
 * time quantity the display path can reach on the settlement itself is `history.age` — the
 * town's own recorded count of years, which ADVANCES when the world advances and is CONSTANT on
 * a re-read of the same year. That is exactly the two properties ruling 26 (h) asks of the
 * roll's year component, so it is the year, and this is a chair's judgment: vetoable, and
 * replaced by one line the day a `currentYear` exists.
 * @param {{history?: unknown, [key: string]: unknown}|null|undefined} settlement
 * @returns {number}
 */
export function renderYearOf(settlement) {
  const history = settlement && typeof settlement === 'object'
    ? /** @type {Record<string, unknown>} */ (settlement.history) : null;
  const age = history && typeof history.age === 'number' && Number.isFinite(history.age)
    ? history.age : 0;
  return age;
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
    // ⭐⭐ THIS IS THE SHARING PATH, AND IT IS THE WHOLE OF `pageProse` (car 8b-W-18o-r). A
    // caller that already holds a roster is handed back the SAME OBJECT, identity and all — so
    // the page-level Sets and Arrays on it are the same Sets and Arrays every desk of that page
    // sees. Minting a new object here would silently give each desk its own no-repeat state,
    // which is exactly the defect slice E named.
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
      // ⭐ THE PAGE'S OPENER TRAIL (ADDENDUM 18 rulings 29 and 36; car 8b-W-18o). An ARRAY the
      // composer pushes each drawn unit's opener class onto; the draw prefers a face that does
      // not open the way the last one did. It rides here for the same reason the exclusion set
      // does — it is the PAGE's state and the composer may not read a settlement.
      drawnOpeners: Array.isArray(given.drawnOpeners) ? given.drawnOpeners : [],
      // ⭐ THE COVERT HALF (ruling 26; car 8b-W-18m): which sources the engine holds a secret
      // about, the settlement's id and the year the roll turns on. All three ride here for the
      // same reason the roster does — the composer may not read a settlement.
      compromised: compromisedSourcesOf(settlement),
      settlementId: settlement && typeof settlement === 'object'
        ? String(settlement.id ?? settlement._seed ?? '') : '',
      year: renderYearOf(settlement),
      // ⭐ THE SCRIBE'S CANDIDATE WORDS (design §5 READ; the kernel's `scribeBlocksFrom`). The ONE
      // thing the Scribe changes about drawing a page: where the composer would read a corpus
      // variant's text it reads the RENDERED text, for the variant the render was made for and no
      // other, so the drawn vid is identical and every downstream function runs unchanged. It
      // rides here for the same reason the roster and the covert half do: the composer may not
      // read a settlement, and this is the one place on the path that may. Null on every page
      // today, because the draw is OFF by default and the app pushes the flag in.
      //
      // ⭐ THE ENGINE GATE IS THE WORLD'S OWN VERSIONS, not this build's constants (design §7:
      // the display reads the artefact while its engine matches THE WORLD'S pinned version). A
      // settlement carries `generatorVersion` and `simulationVersion` as its own top-level facts,
      // so a migration that moves either one invalidates prose written under the old engine, and
      // an imported town whose artefact was rendered under different versions draws the corpus.
      // Reading the world's numbers also keeps this file's fenced six-import list untouched.
      scribe: scribeBlocksFrom(proseOf(settlement), {
        seed: typeof given.seed === 'string' ? given.seed : '',
        engineVersion: engineVersionOf(settlement),
      }),
    })
  );
}

/**
 * ⭐⭐ THE PAGE'S OWN READ — ONE PER PAGE RENDER, NOT ONE PER DESK (ADDENDUM 18, the research
 * reconciliation's slice E, "THE ARCHITECTURE'S RISK"; car 8b-W-18o-r).
 *
 * ⛔ THE DEFECT THIS ENDS, MEASURED RATHER THAN ASSERTED. Every desk entry point calls
 * `withFaceSources`, and `withFaceSources` mints the no-repeat state when the caller hands none.
 * The Defense tab calls SEVEN entry points to render ONE page. So the page carried seven
 * independent `printedRoles` Sets, and "the same role never twice on one page" (ruling 25 edge
 * (e)) was true of a DESK and false of the page: one clerk in the hall could be printed seven
 * times on one screen, once per desk, and nothing could see it.
 *
 * ⛔ AND THE STATE MUST BE DETERMINISTIC, which is the other half of slice E. It is a function
 * of exactly three things and nothing else:
 *   (seed, year)              handed in, and the same on every re-read of the same year
 *   the page's TRAVERSAL ORDER  fixed by the caller's source code, never by a clock or a map
 *                             iteration whose order could differ between two devices
 * There is no randomness here and no time: the same seed and the same year give the same page,
 * which is THE PROMISE, and the suite drives it over two hundred seeds rather than reading it.
 *
 * ⛔ IT IS NOT A CACHE AND MUST NOT BE REUSED ACROSS PAGES. Two renders of one settlement are
 * two pages and each gets its own state; a state carried between them would make the second
 * page depend on whether the first was ever drawn. Callers mint it per render, which is what
 * "one per page render" means.
 *
 * @template {object} T
 * @param {{institutions?: unknown, [key: string]: unknown}|null|undefined} settlement
 * @param {T} [options] the caller's own read — `seed`, `audience`, anything else
 * @returns {T & {sources: ReadonlySet<string>|ReadonlyArray<string>}} the read to hand to
 *   EVERY desk entry of this page, unchanged
 */
export function pageProse(settlement, options) {
  const given = options && typeof options === 'object' ? options : /** @type {T} */ ({});
  // ⛔ IT IS `withFaceSources` AND NOTHING ELSE, deliberately. A second builder here would be a
  // second place the page's keys are listed, and a key added to one and not the other is
  // exactly the trap the composer's read records at its own head. This function exists to give
  // the PAGE a name to call, not to build anything the desks do not already build.
  return withFaceSources(settlement, given);
}
