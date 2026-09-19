/**
 * domain/prose/holderTable.js — SEAM car 5b: THE HOLDER TABLE (SITTING §Q, owner "Do it",
 * 2026-09-08; REGISTER CARD amendment S3; MOVE-GRAMMAR §4.4.3).
 *
 * ⚠ AN INSTRUMENT, NOT A PRODUCT SURFACE. It is the THIRTEENTH module of the prose island and
 * the census walker's fence arm (e) holds it there by bytes: nothing under `src/` outside
 * `src/domain/prose/` and `src/domain/institutions/institutionTable.js` may name it. It is
 * PURE and HEADLESS: no store, no clock, no RNG, no I/O. Every source it measures arrives as a
 * string or as a settlement object from the caller.
 *
 * ── WHAT IT IS FOR, IN ONE SENTENCE ────────────────────────────────────────────────
 * Every fact the record states has a SOURCE: the holder of the record that fact comes from in
 * this town. This module carries the two hops the ruling names, and nothing else:
 *
 *   (1) FIELD -> HOLDER KIND. A frozen table keyed on the producing field's own token, each
 *       row citing the PRODUCER that writes it (file:line) and carrying a `read` flag the gate
 *       can catch lying about. A field no row names is SOURCE-UNRESOLVED, never guessed.
 *   (2) HOLDER KIND -> THIS TOWN'S INSTITUTION, through the institution table's own reader:
 *       an institution whose INSTANTIATED service rows carry one of the kind's record-keeping
 *       services is the holder of that record here. With no such institution the holder is
 *       `null` WITH ITS REASON, and the standing beside it is absent rather than assumed.
 *
 * ── THE IDIOM IS `COLUMN_SOURCES`, DELIBERATELY ────────────────────────────────────
 * `institutionTable.js:121` already carries a frozen per-column source roster whose rows each
 * hold a spec citation and a `read` flag, with `sourcesAllRead` / `unreadSourcesOf` as its
 * arms and a walker that asserts the implication AND the positive twin (a row flipped to
 * `read: true` without the code that reads it reds on the twin, not on the flag). This table
 * is built in that shape so the same arms convict it: `sourcesAllCited` and `uncitedSourcesOf`
 * are the same two functions over this roster.
 *
 * ── WHAT A HOLDER IS, AND WHAT IT IS NOT ───────────────────────────────────────────
 * A holder is an INSTITUTION and its standing. It is NEVER a named person, and that is a
 * measured limit rather than a preference: `COLUMN_SOURCES.holderRole` is a hardcoded null
 * because no typed NPC-to-institution edge exists anywhere in the estate (the name-regex
 * inference at `npcProfile.js:341-353` exists and the institution table refuses to call it).
 * So the DM face names the office, never the officer, and the reason is in the register.
 *
 * ── THE THREE STANDINGS THE REGISTER ANSWERS WITH, AND THE FOURTH A TOWN ADDS ──────
 * `LICENSED` (a holder can be named), `OFFICE` (the fact comes from the office's own books, so
 * a citation cites the speaker: MOVE-GRAMMAR §4.4.3 calls that a finding) and
 * `SOURCE-UNRESOLVED` (no row, or a kind with no institution behind it). A town adds
 * `INTERESTED`: the holder is a power in this town, by TYPED capture, corruption or control
 * facts only. A standing fact the engine does not hold for a town is reported ABSENT and is
 * never inferred from anything else.
 *
 * @enforced-by tests/lint/proseWiringCensus.walker.test.js
 */
import {
  DUTY_SERVICE_KINDS, instantiatedServices, officesOf,
} from '../institutions/institutionTable.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';

/**
 * The loosely-typed settlement shape this table reads, written out rather than cast to `any`
 * exactly as `institutionTable.js`'s own `TableSettlement` is (the estate's any-cast ratchet
 * allows a new file zero holes and says so in its own words: fix the types, do not widen). It
 * names ONLY the fields the two hops consult, which is also the honest documentation of this
 * module's reach into a settlement.
 * @typedef {object} HolderSettlement
 * @property {ReadonlyArray<{name?: string, impairments?: ReadonlyArray<{type?: string}>}>} [institutions]
 * @property {Record<string, ReadonlyArray<{name?: string, institution?: string,
 *   desc?: string}>>} [availableServices]
 * @property {ReadonlyArray<{role?: string, title?: string}>} [npcs]
 * @property {{governingName?: string, criminalCaptureState?: string,
 *   factions?: ReadonlyArray<{faction?: string, isGoverning?: boolean,
 *   captureState?: string}>}} [powerStructure]
 */

/**
 * THE CLOSED LIST OF RECORD-HOLDER KINDS (SITTING §Q.1, the owner's own enumeration: coin to
 * the treasury; the garrison to the muster roll; the people and the dead to the census and the
 * parish; trade and tolls to the toll bar and the market; crimes and impairments to the watch;
 * the past to the elders and the tradition tables; the look of things to the road). `office` is
 * the compiling record itself and is a kind so that a fact with no outside holder answers with
 * a name rather than with a silence.
 * @type {ReadonlyArray<string>}
 */
export const HOLDER_KINDS = Object.freeze([
  'treasury', 'muster', 'census', 'parish', 'toll-bar', 'market',
  'watch', 'court', 'elders', 'tradition', 'road', 'office',
]);

/** The kind that is the record itself. A citation on it is a finding, not a licence. */
export const OFFICE_KIND = 'office';

/** The standings the REGISTER can answer with, before any town is named. */
export const SOURCE_STANDINGS = Object.freeze(['LICENSED', 'OFFICE', 'SOURCE-UNRESOLVED']);

/** The standing a TOWN adds: the holder of this record is a power with an interest in it. */
export const INTERESTED = 'INTERESTED';

/**
 * ⭐ THE STATE'S OWN ORGANS — the four kinds a SETTLEMENT-WIDE capture of the ruling structure
 * reaches, and the only four (SITTING §R c-22, correcting the seam fold's P7).
 *
 * ⛔ THE GROUND, AND WHY IT IS FOUR AND NOT TWELVE. Car 5b reported capture "structurally
 * absent at birth" and measured INTERESTED at 0 on all 768 RATE towns. The figure was right
 * and the ground was false: every generated town carries `powerStructure.criminalCaptureState`
 * (`src/generators/power/rulingStructure.js:797` — the very line this table maps to the WATCH),
 * on the same five-rung ladder `standingOf` already consumes, reading none 495 · adversarial
 * 194 · equilibrium 64 · corrupted 15 over the corpus, with 79 towns carrying a non-`none`
 * `captureState` on a faction entry. The car reported the fact ABSENT rather than asking
 * whether it licenses a per-institution standing.
 *
 * It cannot license one for every kind: the fact is SETTLEMENT-wide while a standing asks
 * about ONE institution, so feeding it straight through would mark every holder in a corrupted
 * town interested, which is its own error. The chair's ruling draws the line where the fact
 * actually reaches: a captured ruling structure IS the state, so the OFFICE (the compiler
 * itself sits under that power), the COURT, the TREASURY and the WATCH are interested parties
 * in their own records by that fact alone. The muster, the parish, the market, the elders, the
 * road and the rest keep their own books and are NOT marked by it — for them an interest is a
 * WORLD-RUN fact and stays measured-zero at birth.
 * @type {ReadonlyArray<string>}
 */
export const STATE_ORGAN_KINDS = Object.freeze(['office', 'court', 'treasury', 'watch']);

/**
 * THE BIRTH-TIME CAPTURE OF THE RULING STRUCTURE, read from the town and never inferred.
 *
 * Both fields are typed and both are optional: a settlement that carries neither answers
 * `{criminal: null, faction: null, captured: false}` and `standingOf` reports the absence
 * rather than reading `false`. `captured` is `not none` on either, which is the ladder's own
 * reading — `adversarial` and `equilibrium` are contested states of the same capture arc, and
 * a record whose holder is contesting its own capture is exactly the interested party
 * SITTING §Q.2 names.
 * @param {HolderSettlement} settlement
 * @returns {{criminal: string|null, faction: string|null, captured: boolean}}
 */
export function capturedRulingStructure(settlement) {
  const power = settlement?.powerStructure;
  const criminal = typeof power?.criminalCaptureState === 'string' ? power.criminalCaptureState : null;
  /** @type {ReadonlyArray<{captureState?: string}>} */
  const factions = Array.isArray(power?.factions) ? power.factions : [];
  const captured = factions
    .map((entry) => (typeof entry?.captureState === 'string' ? entry.captureState : null))
    .filter((state) => state !== null && state !== 'none');
  const faction = captured.length ? String(captured[0]) : null;
  return {
    criminal,
    faction,
    captured: (criminal !== null && criminal !== 'none') || faction !== null,
  };
}

/**
 * ⭐ THE MAPPING TABLE — one row per producing FIELD TOKEN, each cited to the writer that
 * produces it. The `cite` is a `file:line` inside the producer index's own two trees
 * (`src/generators/**` and `src/domain/**`), and the walker re-derives every one of them from
 * a LIVE `astTokens` pass: a citation that has gone stale, or that never existed, reds by name.
 *
 * ⛔ THE TABLE IS SHORT ON PURPOSE AND THE SILENCES ARE THE FINDING. A token whose producers
 * are scattered over dozens of unrelated files (`label`, `key`, `status`, `severity`, `name`,
 * `band`, `tier`) names no record holder, and a row for one would be an inference wearing a
 * citation. Those fields land SOURCE-UNRESOLVED and are counted, which is the wiring debt the
 * WAVE inherits rather than a hole this car quietly filled.
 *
 * ⚠ THREE ROWS WERE DRAFTED AND WITHDRAWN ON THEIR OWN EVIDENCE, recorded so the next author
 * does not re-propose them: `granary` (its only writers are a prose phrase map and a binding
 * counter, neither of which keeps a store's record), `church` (a `pick()` inside a history
 * strand and a classifier regex) and `ledger` (seven writers across the treasury, the peace
 * terms, the pantheon and three lifecycles, so the token names no one holder).
 * @type {Readonly<Record<string, {kind: string, cite: string, read: boolean, note?: string}>>}
 */
export const HOLDER_SOURCES = Object.freeze({
  // ── the treasury: the town's coin, its revenue and the arithmetic that closes or does not ──
  incomeSources: Object.freeze({ kind: 'treasury', cite: 'src/generators/economy/economicState.js:873', read: true }),
  viable: Object.freeze({ kind: 'treasury', cite: 'src/generators/economy/viability.js:565', read: true }),
  criticalIssueCount: Object.freeze({ kind: 'treasury', cite: 'src/generators/economy/viability.js:585', read: true }),
  economicViability: Object.freeze({ kind: 'treasury', cite: 'src/generators/steps/assembleSettlement.js:100', read: true }),

  // ── the market: what the town makes, sends and takes in ──
  primaryExports: Object.freeze({ kind: 'market', cite: 'src/generators/economy/economicState.js:812', read: true }),
  primaryImports: Object.freeze({ kind: 'market', cite: 'src/generators/economy/economicState.js:812', read: true }),
  localProduction: Object.freeze({ kind: 'market', cite: 'src/generators/economy/economicState.js:822', read: true }),
  isEntrepot: Object.freeze({ kind: 'market', cite: 'src/generators/economy/economicState.js:878', read: true }),
  activeChains: Object.freeze({ kind: 'market', cite: 'src/generators/economy/economicState.js:821', read: true }),
  exportPosture: Object.freeze({ kind: 'market', cite: 'src/domain/display/dossierViewModel.js:558', read: true }),
  economicStrengths: Object.freeze({ kind: 'market', cite: 'src/generators/resourceGenerator.js:499', read: true }),
  strategicValue: Object.freeze({ kind: 'market', cite: 'src/generators/resourceGenerator.js:500', read: true }),
  exploitation: Object.freeze({ kind: 'market', cite: 'src/generators/resourceGenerator.js:417', read: true }),

  // ── the toll bar: the route, and what may and may not pass along it ──
  tradeRouteAccess: Object.freeze({ kind: 'toll-bar', cite: 'src/generators/steps/resolveConfig.js:195', read: true }),
  blockaded: Object.freeze({ kind: 'toll-bar', cite: 'src/domain/worldPulse/foodStockpile.js:417', read: true }),
  blockadeBypass: Object.freeze({ kind: 'toll-bar', cite: 'src/domain/worldPulse/foodStockpile.js:418', read: true }),

  // ── the muster roll: the walls, the men under arms and what the war does to them ──
  walls: Object.freeze({ kind: 'muster', cite: 'src/domain/institutions/defenseInstitutionBuckets.js:84', read: true }),
  garrison: Object.freeze({ kind: 'muster', cite: 'src/domain/institutions/defenseInstitutionBuckets.js:88', read: true }),
  militia: Object.freeze({ kind: 'muster', cite: 'src/domain/institutions/defenseInstitutionBuckets.js:92', read: true }),
  mercenary: Object.freeze({ kind: 'muster', cite: 'src/domain/institutions/defenseInstitutionBuckets.js:98', read: true }),
  charter: Object.freeze({ kind: 'muster', cite: 'src/domain/institutions/defenseInstitutionBuckets.js:101', read: true }),
  force: Object.freeze({ kind: 'muster', cite: 'src/generators/threatDefensePolicy.js:13', read: true }),
  magicDependency: Object.freeze({ kind: 'muster', cite: 'src/generators/defenseGenerator.js:458', read: true }),
  economicGates: Object.freeze({ kind: 'muster', cite: 'src/generators/defenseGenerator.js:467', read: true }),
  besiegedBy: Object.freeze({ kind: 'muster', cite: 'src/domain/display/warStatus.js:297', read: true }),
  besiegingTargets: Object.freeze({ kind: 'muster', cite: 'src/domain/display/warStatus.js:297', read: true }),
  ticksToDeploy: Object.freeze({ kind: 'muster', cite: 'src/domain/display/mobilizationStatus.js:94', read: true }),
  stretchedThin: Object.freeze({ kind: 'muster', cite: 'src/domain/display/occupationStatus.js:145', read: true }),

  // ── the watch: crime, the black market, and who has been bought ──
  watch: Object.freeze({
    kind: 'watch',
    cite: 'src/domain/institutions/defenseInstitutionBuckets.js:95',
    read: true,
    note: 'the watch bucket sits beside the garrison and the militia in the DEFENCE table, and'
      + ' the token is mapped to the WATCH rather than to the muster on the ruling\'s own'
      + ' grain: the muster roll counts men under arms, and the watch keeps its own count.',
  }),
  blackMarketCapture: Object.freeze({ kind: 'watch', cite: 'src/generators/safetyProfile.js:691', read: true }),
  criminalCaptureState: Object.freeze({ kind: 'watch', cite: 'src/generators/power/rulingStructure.js:797', read: true }),
  safetyProfile: Object.freeze({ kind: 'watch', cite: 'src/generators/economy/economicState.js:884', read: true }),

  // ── the court: the seat, its legitimacy, the blocs under it and the treaties it signs ──
  govMultiplier: Object.freeze({ kind: 'court', cite: 'src/generators/factionDynamics.js:127', read: true }),
  governanceFractured: Object.freeze({ kind: 'court', cite: 'src/generators/factionDynamics.js:133', read: true }),
  breakdown: Object.freeze({ kind: 'court', cite: 'src/generators/factionDynamics.js:179', read: true }),
  blocs: Object.freeze({ kind: 'court', cite: 'src/domain/worldPulse/settlementPolitics.js:992', read: true }),
  stability: Object.freeze({ kind: 'court', cite: 'src/generators/power/rulingStructure.js:702', read: true }),
  recentConflict: Object.freeze({ kind: 'court', cite: 'src/generators/power/rulingStructure.js:702', read: true }),
  termLines: Object.freeze({ kind: 'court', cite: 'src/domain/display/treatyDocument.js:362', read: true }),
  fraying: Object.freeze({ kind: 'court', cite: 'src/domain/worldPulse/peaceTermsDocument.js:233', read: true }),
  yearsRemaining: Object.freeze({ kind: 'court', cite: 'src/domain/worldPulse/peaceTermsDocument.js:230', read: true }),

  // ── the parish: the faith, and the dead ──
  piety: Object.freeze({ kind: 'parish', cite: 'src/domain/worldPulse/religionState.js:645', read: true }),
  unaffiliated: Object.freeze({ kind: 'parish', cite: 'src/domain/worldPulse/religionState.js:644', read: true }),

  // ── the elders: how long ago a thing happened ──
  yearsAgo: Object.freeze({ kind: 'elders', cite: 'src/generators/historyGenerator.js:289', read: true }),

  // ── the road: the look of the country, which anyone travelling it can see ──
  terrainType: Object.freeze({ kind: 'road', cite: 'src/generators/steps/resolveConfig.js:203', read: true }),
  monsterThreat: Object.freeze({ kind: 'road', cite: 'src/generators/steps/resolveConfig.js:198', read: true }),

  // ── the office itself: the record's own audit of the record ──
  structuralViolations: Object.freeze({ kind: 'office', cite: 'src/generators/steps/assembleSettlement.js:119', read: true }),
  structuralSuggestions: Object.freeze({ kind: 'office', cite: 'src/generators/steps/assembleSettlement.js:120', read: true }),
  prominentRelationship: Object.freeze({ kind: 'office', cite: 'src/generators/narrativeGenerator.js:1113', read: true }),
});

/**
 * ⭐ WHICH INSTITUTION KEEPS WHICH RECORD — the kind's RECORD-KEEPING SERVICE NAMES, taken
 * from the shipped service catalog verbatim and never invented. An institution of this town
 * holds the kind's record when one of its INSTANTIATED service rows carries one of these
 * names, which is the institution table's own reader (`instantiatedServices`) and the same
 * standard it uses for a duty: a row the world actually wrote, never a catalog probability.
 *
 * ⚠ `dutyNamed` RECORDS AN HONEST DEPARTURE RATHER THAN HIDING IT. `DUTY_SERVICE_KINDS`
 * (`institutionTable.js:106`) is the estate's one duty vocabulary and this table reuses it
 * rather than minting a parallel one, but the regex names COUNTING duties — tithes, taxes,
 * tolls, records, registers, musters, rolls, the census — and a court's trials and a watch's
 * crime reports are records it does not name. So each kind declares how many of its service
 * names the regex admits; the walker re-measures the integer, and a kind whose services the
 * regex does not name says so in the register instead of widening the regex.
 *
 * ⚠ `Record keeping` IS DELIBERATELY IN NO LIST. It is carried by the Church/Temple, by the
 * Lord's steward and by the Parish churches alike, so it names the parish and the office in
 * one breath; a kind claiming it would claim a holder it cannot tell apart.
 * ⛔ IT IS AN ARRAY OF ROWS AND NOT A MAP KEYED ON THE KIND, and the reason is a MEASURED
 * defect this car caused and cured. The wiring census's PRODUCER INDEX reads every object
 * literal key under `src/domain/**` as a WRITE of world state, so a table keyed on the kind
 * minted `court`, `elders`, `parish` and `toll-bar` as producer tokens of the estate. `court`
 * is a field the defence desk reads, and four DS-DEF-2 rows moved their `absent` label from
 * `not-produced` to `measured` on the strength of an INSTRUMENT naming a kind. That is car
 * 3f-0's rule seen from the other side: a module hands over a name as a VALUE, never as a key
 * it does not write.
 * @type {ReadonlyArray<{kind: string, services: ReadonlyArray<string>, rosterBacked: boolean,
 *   dutyNamed: number, cite: string, note?: string}>}
 */
export const HOLDER_RECORDS = Object.freeze([
  Object.freeze({
    kind: 'treasury',
    services: Object.freeze(['Tax collection', 'Tax payment', 'Taxation and tolls', 'Tithe and dues']),
    rosterBacked: true,
    dutyNamed: 4,
    cite: 'src/data/institutionServices.js (Village headman, City administration, Weekly market, City-state government, Lord\'s appointee, Village reeve, Town hall)',
  }),
  Object.freeze({
    kind: 'muster',
    services: Object.freeze(['Muster training']),
    rosterBacked: true,
    dutyNamed: 1,
    cite: 'src/data/institutionServices.js (Citizen militia)',
    note: 'ONE institution in the whole shipped roster keeps a muster: the Citizen militia. A'
      + ' town with a Garrison and no militia has men under arms and no roll of them, which is'
      + ' the sharpest wiring debt this table found.',
  }),
  Object.freeze({
    kind: 'census',
    services: Object.freeze(['Citizen registration', 'Noble registration']),
    rosterBacked: true,
    dutyNamed: 2,
    cite: 'src/data/institutionServices.js (Democratic assembly, Royal seat)',
  }),
  Object.freeze({
    kind: 'parish',
    services: Object.freeze(['Register of the dead', 'Central register', 'Records']),
    rosterBacked: true,
    dutyNamed: 3,
    cite: 'src/data/institutionServices.js (Parish burial grounds, Cemetery network, Parish church)',
  }),
  Object.freeze({
    kind: 'toll-bar',
    services: Object.freeze(['Toll collection', 'Customs brokerage', 'Market charter and tolls']),
    rosterBacked: true,
    dutyNamed: 3,
    cite: 'src/data/institutionServices.js (Gates (if walled), Major Port, Town council)',
  }),
  Object.freeze({
    kind: 'market',
    services: Object.freeze(['Weekly market', 'Public auctions']),
    rosterBacked: true,
    dutyNamed: 0,
    cite: 'src/data/institutionServices.js (Market square)',
  }),
  Object.freeze({
    kind: 'watch',
    services: Object.freeze(['Crime reporting', 'Crime response', 'Missing persons']),
    rosterBacked: true,
    dutyNamed: 0,
    cite: 'src/data/institutionServices.js (Professional city watch, Town watch)',
  }),
  Object.freeze({
    kind: 'court',
    services: Object.freeze(['Criminal trials', 'Civil disputes', 'Notary services', 'Criminal proceedings', 'Civil litigation', 'Appeals']),
    rosterBacked: true,
    dutyNamed: 0,
    cite: 'src/data/institutionServices.js (Courthouse, Multiple court buildings)',
  }),
  Object.freeze({
    kind: 'elders',
    services: Object.freeze(['Record of custom']),
    rosterBacked: true,
    dutyNamed: 1,
    cite: 'src/data/institutionServices.js (Household elder, Village elder, Village headman, Town council)',
  }),
  Object.freeze({
    kind: 'tradition',
    services: Object.freeze([]),
    rosterBacked: false,
    dutyNamed: 0,
    cite: 'src/data/institutionServices.js (NONE)',
    note: 'THE ONE KIND WITH NO INSTITUTION ANYWHERE IN THE SHIPPED ROSTER. The tradition tables'
      + ' are the engine\'s own and no institution of any tier offers a service that keeps them,'
      + ' so a fact whose only holder would be the tradition is SOURCE-UNRESOLVED in every town'
      + ' the product can generate. Recorded as the WAVE\'s wiring debt, not cured here.',
  }),
  Object.freeze({
    kind: 'road',
    services: Object.freeze(['Road register', 'Way-bill registration']),
    rosterBacked: true,
    dutyNamed: 2,
    cite: 'src/data/institutionServices.js (Listening post, Waystation)',
  }),
  Object.freeze({
    kind: 'office',
    services: Object.freeze(['Public records', 'Public record access', 'Record filing']),
    rosterBacked: true,
    dutyNamed: 3,
    cite: 'src/data/institutionServices.js (City administration, City hall, Town hall)',
    note: 'the office keeps its own books, so a CITATION on a fact sourced here is a finding'
      + ' (MOVE-GRAMMAR §4.4.3): the record would be citing the speaker.',
  }),
]);

/**
 * The record row for a kind, or `undefined` where the closed list does not carry one.
 * @param {string} kind
 * @returns {{kind: string, services: ReadonlyArray<string>, rosterBacked: boolean,
 *   dutyNamed: number, cite: string, note?: string}|undefined}
 */
export function recordOf(kind) {
  return HOLDER_RECORDS.find((row) => row.kind === kind);
}

/**
 * THE SOURCE CEILING on this table, exactly as `sourcesAllRead` is the institution table's.
 * @param {string} kind
 * @returns {boolean} is every mapping row for this kind cited to a producer this module claims
 *   to have read?
 */
export function sourcesAllCited(kind) {
  const rows = Object.values(HOLDER_SOURCES).filter((r) => r.kind === kind);
  if (rows.length === 0) return false;
  return rows.every((r) => r.read === true && typeof r.cite === 'string' && r.cite.includes(':'));
}

/**
 * The rows of a kind whose producer this module does NOT claim to read, for a basis clause
 * and for the gate's message.
 * @param {string} kind
 * @returns {string[]}
 */
export function uncitedSourcesOf(kind) {
  return Object.entries(HOLDER_SOURCES)
    .filter(([, r]) => r.kind === kind && r.read !== true)
    .map(([token, r]) => `${token} (${r.cite})`);
}

/**
 * ⭐ THE TABLE RUNG'S FIELDS, RECOVERED FROM THE CENSUS'S OWN SYNTHETIC LABEL (the car-5b cure
 * SITTING §Q.4 step 1 and the chair's ADDENDUM 2 name). Rung 3 writes
 * `"<reader expression> (via <TABLE> in <file>)"` into `fieldsRead` and `reads` alike, so a
 * reader that tokenised the whole string would learn the TABLE's name, the FILE's name and the
 * word `via` and would call them fields.
 *
 * ⛔ AND IT IS WHY THIS FUNCTION EXISTS RATHER THAN A `startsWith` SKIP. Arm A0b declares
 * itself NOT-EXECUTABLE on DS-DEF-2 because no text can claim an instrument label (SEAM car 5,
 * §5.8 item 1), and the chair ruled that the `source` column must NOT inherit that blindness: a
 * tabled key function's rows resolve their holder through the TABLE'S OWN FIELDS exactly as a
 * literal-key row does. The reader expression's call NAMES are wrappers, not fields, so they
 * are dropped and the identifiers that remain are the reading.
 * @param {string} field a census `reads` entry, table label or plain path
 * @returns {string[]} the field expressions the label reads, or [field] when it is not a label
 */
export function tableFieldsOf(field) {
  const text = String(field ?? '');
  const label = text.match(/^(.*) \(via [^()]* in [^()]*\)$/);
  if (!label) return text ? [text] : [];
  // Drop every identifier that is immediately followed by `(`: those are the wrapper calls
  // (`text`, `scoreBand`, `beastsRowSituation`), never the reading they wrap.
  const body = label[1].replace(/\b[A-Za-z_$][\w$]*\s*\(/g, '(');
  const parts = body.split(/[^A-Za-z_$0-9.]+/).map((p) => p.replace(/^\.+|\.+$/g, '')).filter(Boolean);
  return [...new Set(parts)];
}

/**
 * THE FIRST HOP — a read path to its holder kind, most specific segment first.
 *
 * ⭐ THE WALK IS RIGHT TO LEFT AND THERE IS NO DIFFUSENESS CEILING, because the table itself is
 * the filter: `forces.garrison.present` answers on `garrison` because `present` names no row,
 * and `settlement.defenseProfile.economicGates.military` answers on `economicGates` because
 * `military` names none. A ceiling on how many files may write a token would have been a
 * number this module invented, and car 7's tuning-register lesson is that such a number
 * quietly becomes a design constraint nobody re-asked.
 * ⛔ THE TABLE IS AN ARGUMENT WITH A DEFAULT, AND THAT IS THE ONE TEST SEAM THIS MODULE HAS.
 * The brief's own plant is "a table that maps every field to the office must red (the office
 * may not be the source of the muster)", and a frozen module constant cannot be planted from
 * outside without editing the product file. Car 4's `seatOf` takes `S2_SIGNED` the same way and
 * car 4's projection takes its census reader the same way, for the same reason: a refusal
 * nobody can drive is a refusal nobody has measured. No caller in `src/` passes it.
 * @param {string} field one read path, or one table-label field expression
 * @param {Readonly<Record<string, {kind: string, cite: string, read: boolean}>>} [sources]
 * @returns {{kind: string, token: string, cite: string}|null}
 */
export function holderKindOfField(field, sources = HOLDER_SOURCES) {
  const segments = String(field ?? '').split(/[^A-Za-z_$0-9]+/).filter(Boolean);
  for (let i = segments.length - 1; i >= 0; i -= 1) {
    const row = sources[segments[i]];
    if (row) return { kind: row.kind, token: segments[i], cite: row.cite };
  }
  return null;
}

/**
 * @typedef {object} FieldSource
 * @property {string} field the read path as the census spells it
 * @property {string} kind the holder kind, or '' where none resolved
 * @property {string} token the field token that answered
 * @property {string} cite the producer the mapping row cites
 * @property {'LICENSED'|'OFFICE'|'SOURCE-UNRESOLVED'} standing
 * @property {string} reason the typed ground, from a closed vocabulary
 */

/** The closed reason vocabulary a field's standing carries. */
export const FIELD_REASONS = Object.freeze({
  ROW: 'row',
  OFFICE: 'the office\'s own books',
  NO_MAPPING: 'no mapping row names any token of this field',
  NO_INSTITUTION: 'the holder kind has no institution in the shipped roster',
});

/**
 * THE PER-FIELD SOURCE — the row of the register a reader can audit one field at a time.
 * @param {string} field
 * @param {Readonly<Record<string, {kind: string, cite: string, read: boolean}>>} [sources]
 * @returns {FieldSource}
 */
export function fieldSourceOf(field, sources = HOLDER_SOURCES) {
  const hit = holderKindOfField(field, sources);
  if (!hit) {
    return {
      field, kind: '', token: '', cite: '', standing: 'SOURCE-UNRESOLVED', reason: FIELD_REASONS.NO_MAPPING,
    };
  }
  const record = recordOf(hit.kind);
  if (hit.kind === OFFICE_KIND) {
    return { field, ...hit, standing: 'OFFICE', reason: FIELD_REASONS.OFFICE };
  }
  if (!record || record.rosterBacked !== true) {
    return {
      field, ...hit, standing: 'SOURCE-UNRESOLVED', reason: FIELD_REASONS.NO_INSTITUTION,
    };
  }
  return { field, ...hit, standing: 'LICENSED', reason: FIELD_REASONS.ROW };
}

/** The closed vocabulary a register row's null holder carries as its reason. */
export const HOLDER_REASONS = Object.freeze({
  TOWN: 'town-resolved: the register is not a town, so the holder is named by holdersOf(kind, settlement)',
  OFFICE: 'the office itself compiles this fact, so no outside record is cited',
  NO_INSTITUTION: 'no institution in the shipped roster keeps this kind of record',
  UNRESOLVED: 'no mapping row resolves any field this pool reads',
});

/**
 * ⭐⭐ THE `source` COLUMN — one census row's whole source, town-independent.
 *
 * ⛔ THE ROW TAKES THE STRONGEST OF ITS FIELDS AND NOT THE WEAKEST, and the ground is arm
 * A13's own question. A citation names the holder of the record ONE cited fact comes from, so
 * a pool that reads three fields of which one has a licensed holder may lawfully cite THAT
 * holder; a fail-closed row would have refused a citation the ruling licenses. Every field's
 * own standing ships beside it in `fields`, so nothing the weakest reading knows is lost.
 *
 * ⛔ `holder` AND `standing`'s TOWN HALF ARE NULL HERE BY CONSTRUCTION, WITH THE REASON. The
 * census is a register over the corpus and knows no settlement; `holdersOf` and `standingOf`
 * below answer for a town, and `sourceOfForTown` composes the two.
 * ⛔ `stateOrgan` IS OPTIONAL AND IS EMITTED ONLY WHERE IT IS TRUE (SITTING §R c-22), which is
 * the `readsCount` idiom: an absent key is the answer `no`, and the register's diff stays the
 * size of the rows the rule actually reaches.
 * @param {{reads?: ReadonlyArray<string>, fieldsRead?: ReadonlyArray<string>}} row
 * @param {Readonly<Record<string, {kind: string, cite: string, read: boolean}>>} [sources]
 * @returns {{kind: string, kinds: string[], fields: Record<string, string>,
 *   holder: null, holderReason: string, standing: string, twoSource: boolean,
 *   stateOrgan?: boolean}}
 */
export function sourceOfRow(row, sources = HOLDER_SOURCES) {
  const reads = Array.isArray(row?.reads) && row.reads.length
    ? row.reads
    : (Array.isArray(row?.fieldsRead) ? row.fieldsRead : []);
  /** @type {Record<string, string>} */
  const fields = {};
  /** @type {FieldSource[]} */
  const resolved = [];
  for (const read of reads) {
    for (const field of tableFieldsOf(read)) {
      const source = fieldSourceOf(field, sources);
      resolved.push(source);
      fields[field] = source.kind;
    }
  }
  const licensed = resolved.filter((r) => r.standing === 'LICENSED');
  const office = resolved.filter((r) => r.standing === 'OFFICE');
  const kinds = [...new Set(licensed.map((r) => r.kind))].sort();
  if (licensed.length) {
    return {
      kind: kinds.join(' + '),
      kinds,
      fields,
      holder: null,
      holderReason: HOLDER_REASONS.TOWN,
      standing: 'LICENSED',
      twoSource: kinds.length > 1,
      // ⭐ EMITTED ON THE AFFECTED ROWS ONLY (SITTING §R c-22). The register knows no town, so
      // its `standing` can never read INTERESTED; what it CAN say, and now does, is which rows
      // a town's captured ruling structure is able to move. A row with no state organ among
      // its kinds carries no key at all, which is the `readsCount` idiom and keeps the diff to
      // the rows the rule reaches.
      ...(kinds.some((k) => STATE_ORGAN_KINDS.includes(k)) ? { stateOrgan: true } : {}),
    };
  }
  if (office.length) {
    return {
      kind: OFFICE_KIND,
      kinds: [OFFICE_KIND],
      fields,
      holder: null,
      holderReason: HOLDER_REASONS.OFFICE,
      standing: 'OFFICE',
      twoSource: false,
      // The office IS a state organ: the compiler sits under the power that was captured.
      stateOrgan: true,
    };
  }
  const kindless = resolved.some((r) => r.reason === FIELD_REASONS.NO_INSTITUTION);
  return {
    kind: '',
    kinds: [],
    fields,
    holder: null,
    holderReason: kindless ? HOLDER_REASONS.NO_INSTITUTION : HOLDER_REASONS.UNRESOLVED,
    standing: 'SOURCE-UNRESOLVED',
    twoSource: false,
  };
}

/**
 * THE SECOND HOP — THIS TOWN'S holders of a kind's record.
 *
 * The reader is the institution table's own `instantiatedServices`, so a service row naming an
 * institution the live roster does not hold is the caller's to filter exactly as the table
 * filters it; a row naming NO institution is a settlement-level service and holds no record for
 * anybody, so it is dropped here.
 * @param {string} kind
 * @param {HolderSettlement} settlement
 * @returns {string[]} the institutions of this town that keep the kind's record, sorted
 */
export function holdersOf(kind, settlement) {
  const record = recordOf(kind);
  if (!record || record.services.length === 0) return [];
  const wanted = new Set(record.services);
  // ⛔ THE RUIN FILTER IS ROUTED, NOT RE-SPELLED, and it is routed for the SERVICE ROWS and not
  // only for the roster (`institutionTable.js`'s own measured lesson: the first cut of that
  // table filtered the rows and not the columns, and 23 service rows naming an institution the
  // live roster never held entered a column anyway). A calamity-ruined records office keeps no
  // record, so a service row naming one names no holder.
  const live = new Set(liveInstitutions(settlement).map((inst) => String(inst?.name || '')).filter(Boolean));
  /** @type {Set<string>} */
  const held = new Set();
  for (const row of instantiatedServices(settlement)) {
    if (row.institution && live.has(row.institution) && wanted.has(row.name)) held.add(row.institution);
  }
  return [...held].sort();
}

/**
 * ⭐ THE STANDING OF ONE HOLDER, FROM TYPED FACTS ONLY, WITH THE ABSENCES NAMED.
 *
 * ⛔ A FACT THE ENGINE DOES NOT HOLD FOR THIS TOWN IS `null` AND IS LISTED IN `absent`, NEVER
 * INFERRED FROM A NEIGHBOURING ONE. A headless generated settlement carries no faction states
 * and no world state, so `captured` (`worldPulse/factionCapture.js:136` reads `factionStates`)
 * and `patron` (`worldPulse/brokeragePatronage.js:228` reads a `worldState`) are absent on
 * every town the RATE corpus builds, and they say so rather than reading `false`.
 * ⭐ THE FOURTH ARGUMENT IS THE KIND, AND WITHOUT IT THE BIRTH-TIME CAPTURE IS NOT READ AT ALL
 * (SITTING §R c-22). A settlement-wide capture of the ruling structure reaches the STATE'S OWN
 * ORGANS and nothing else, so this function cannot decide it from the institution's name: the
 * caller says which KIND of record is being sourced, and a kind outside `STATE_ORGAN_KINDS`
 * has the fact recorded as ABSENT-BY-RULE rather than read. A caller that names no kind gets
 * the pre-5c reading exactly, which is why every existing call site is unmoved.
 * @param {string} institution
 * @param {HolderSettlement} settlement
 * @param {{compromised?: {covert: ReadonlyArray<string>, revealed: ReadonlyArray<string>},
 *   captureState?: string|null, patron?: string|null}} [world]
 *   the realm-level facts a settlement does not carry, supplied by the caller exactly as the
 *   institution table takes its `treatyTerms`: absent means ABSENT, never false
 * @param {string|null} [kind] the record-holder kind this institution is being asked about
 * @returns {{corrupt: boolean, impaired: boolean, controlled: boolean|null,
 *   captured: boolean|null, capturedAtBirth: boolean|null, marks: string[], absent: string[],
 *   interested: boolean}}
 */
export function standingOf(institution, settlement, world = {}, kind = null) {
  const name = String(institution || '');
  const compromised = world.compromised || { covert: [], revealed: [] };
  const corrupt = compromised.covert.includes(name) || compromised.revealed.includes(name);
  // `Array.isArray` is declared `arg is any[]`, so a bare guard would WIDEN the typed roster
  // row to `any` and the two callbacks below would lose their shape. Naming the shape the
  // typedef already declares is `institutionTable.js`'s own idiom here, not a cast.
  // THE SAME ROUTE, for the same reason: a ruined institution has no standing to report.
  /** @type {ReadonlyArray<{name?: string, impairments?: ReadonlyArray<{type?: string}>}>} */
  const rows = liveInstitutions(settlement);
  const row = rows.find((inst) => String(inst?.name || '') === name);
  /** @type {ReadonlyArray<{type?: string}>} */
  const impairments = Array.isArray(row?.impairments) ? row.impairments : [];
  const impaired = impairments.length > 0;
  const corruptImpairment = impairments.some((imp) => String(imp?.type || '') === 'corruption');
  /** @type {string[]} */
  const absent = [];
  /** @type {boolean|null} */
  let captured = null;
  if (typeof world.captureState === 'string') captured = world.captureState === 'corrupted' || world.captureState === 'capture';
  else absent.push('captured (no faction states: worldPulse/factionCapture.js:136 reads factionStates)');
  /** @type {boolean|null} */
  let controlled = null;
  if (typeof world.patron === 'string') controlled = world.patron.length > 0;
  else absent.push('controlled (no world state: worldPulse/brokeragePatronage.js:228 reads a worldState)');
  /** @type {string[]} */
  const marks = [];
  if (corrupt) marks.push('corrupt');
  if (corruptImpairment) marks.push('corruption-impaired');
  if (impaired && !corruptImpairment) marks.push('impaired');
  if (captured === true) marks.push('captured');
  if (controlled === true) marks.push('controlled');
  // ⭐ THE BIRTH-TIME CAPTURE (SITTING §R c-22). Read for a STATE ORGAN only; for every other
  // kind the settlement-wide fact is refused BY RULE and the refusal is PRINTED in `absent`,
  // so a reader can tell "this kind is not reached by it" from "this town does not hold it".
  const organ = STATE_ORGAN_KINDS.includes(String(kind || ''));
  /** @type {boolean|null} */
  let capturedAtBirth = null;
  if (kind === null) {
    absent.push('captured-at-birth (the caller named no kind, so the ruling structure was not read)');
  } else if (!organ) {
    absent.push(`captured-at-birth (${kind} is not one of the state's own organs: a settlement-wide capture of the ruling structure does not reach a holder that keeps its own books)`);
  } else {
    const birth = capturedRulingStructure(settlement);
    if (birth.criminal === null && birth.faction === null) {
      absent.push('captured-at-birth (this settlement carries no powerStructure.criminalCaptureState and no faction captureState)');
    } else {
      capturedAtBirth = birth.captured;
      if (capturedAtBirth) {
        const ground = [
          birth.criminal && birth.criminal !== 'none' ? `criminalCaptureState ${birth.criminal}` : null,
          birth.faction ? `faction captureState ${birth.faction}` : null,
        ].filter(Boolean).join(' + ');
        marks.push(`captured-at-birth (${ground})`);
      }
    }
  }
  return {
    corrupt,
    impaired,
    controlled,
    captured,
    capturedAtBirth,
    marks,
    absent,
    interested: corrupt || corruptImpairment || captured === true || controlled === true
      || capturedAtBirth === true,
  };
}

/**
 * THE WHOLE SOURCE FOR A TOWN — the register's row with its holder and standing filled in.
 * This is the shape arm A13's `sourceOf` reads: `{kind, holder, standing}`, with `INTERESTED`
 * as the fourth standing a town can add.
 * @param {{reads?: ReadonlyArray<string>, fieldsRead?: ReadonlyArray<string>}} row
 * @param {HolderSettlement} settlement
 * @param {{compromised?: {covert: ReadonlyArray<string>, revealed: ReadonlyArray<string>},
 *   captureState?: string|null, patron?: string|null}} [world]
 * @returns {{kind: string, holder: string|null, standing: string, holders: string[],
 *   marks: string[], absent: string[]}}
 */
export function sourceOfForTown(row, settlement, world = {}) {
  const base = sourceOfRow(row);
  if (base.standing !== 'LICENSED') {
    return {
      kind: base.kind, holder: null, standing: base.standing, holders: [], marks: [], absent: [],
    };
  }
  // ⛔ THE PAIR, NOT THE NAME. A holder is reached THROUGH a kind, and since SITTING §R c-22
  // the kind decides whether the ruling structure's capture reaches it, so the two travel
  // together. Deduped on the pair: one institution keeping two kinds' records is asked twice,
  // once per kind, and may be interested in one and not the other.
  /** @type {Array<{kind: string, holder: string}>} */
  const pairs = [];
  /** @type {Set<string>} */
  const seen = new Set();
  for (const kind of base.kinds) {
    for (const holder of holdersOf(kind, settlement)) {
      if (seen.has(`${kind}::${holder}`)) continue;
      seen.add(`${kind}::${holder}`);
      pairs.push({ kind, holder });
    }
  }
  const named = [...new Set(pairs.map((pair) => pair.holder))].sort();
  if (named.length === 0) {
    return {
      kind: base.kind,
      holder: null,
      standing: 'LICENSED',
      holders: [],
      marks: [],
      absent: ['holder (this town instantiates no institution that keeps this record)'],
    };
  }
  /** @type {string[]} */
  const marks = [];
  /** @type {string[]} */
  const absent = [];
  let interested = false;
  for (const { kind, holder } of pairs) {
    const standing = standingOf(holder, settlement, world, kind);
    if (standing.interested) interested = true;
    for (const mark of standing.marks) marks.push(`${holder}: ${mark}`);
    for (const gap of standing.absent) if (!absent.includes(gap)) absent.push(gap);
  }
  return {
    kind: base.kind,
    holder: named[0],
    standing: interested ? INTERESTED : 'LICENSED',
    holders: named,
    marks,
    absent,
  };
}

/**
 * THE CENSUS OF THE TABLE ITSELF — what each kind holds, for a receipt to print beside
 * SITTING §Q.1's own enumeration. The shape follows `columnCensus` (`institutionTable.js:582`)
 * so the two registers read the same way.
 * @returns {Array<{kind: string, fields: number, services: number, dutyNamed: number,
 *   rosterBacked: boolean, tokens: string}>}
 */
export function holderCensus() {
  return HOLDER_KINDS.map((kind) => {
    const tokens = Object.entries(HOLDER_SOURCES).filter(([, r]) => r.kind === kind).map(([t]) => t);
    const record = recordOf(kind);
    return {
      kind,
      fields: tokens.length,
      services: record ? record.services.length : 0,
      dutyNamed: record ? record.dutyNamed : 0,
      rosterBacked: Boolean(record && record.rosterBacked),
      tokens: tokens.sort().join(' · '),
    };
  });
}

/**
 * THE OFFICE THAT COMPILES THE RECORD, in this town's own words. The register card declares the
 * office once at the front and never again, so a caller that wants to name it reads it here
 * rather than spelling a noun of its own.
 * @param {HolderSettlement} settlement
 * @returns {string[]} the offices the settlement holds, as the institution table reads them
 */
export function compilingOfficesOf(settlement) {
  return officesOf(settlement);
}

/**
 * THE DUTY VOCABULARY THIS TABLE REUSES, re-exported by NAME so a reader can see there is one
 * and only one. A kind's `dutyNamed` integer is this regex counted over its service list, and
 * the walker re-derives every one of them.
 * @param {string} service
 * @returns {boolean}
 */
export function isDutyNamed(service) {
  return DUTY_SERVICE_KINDS.test(String(service || ''));
}

/**
 * ⭐ THE SOURCE CENSUS OVER A WHOLE ROW SET — the integers the ruling asks to be printed:
 * LICENSED / OFFICE / SOURCE-UNRESOLVED per FIELD and per ROW, the per-kind field counts, the
 * two grounds a field can be unresolved on kept apart, and the two-source rows counted.
 *
 * ⛔ THE TWO UNRESOLVED GROUNDS DO NOT SHARE A NUMBER. A field no mapping row names and a field
 * whose kind has no institution anywhere in the shipped roster are both SOURCE-UNRESOLVED and
 * they are different debts: the first is a table this car did not widen, the second is a hole
 * in the shipped roster that no table can close. Collapsing them would have hidden the second.
 * @param {ReadonlyArray<{source?: {kinds: string[], fields: Record<string, string>,
 *   standing: string, twoSource: boolean}}>} rows
 * @returns {{rows: Record<string, number>, fields: Record<string, number>,
 *   byKind: Array<[string, number]>, unresolvedGrounds: Record<string, number>,
 *   twoSourceRows: number, rowsWithNoReading: number,
 *   kindsWithNoInstitution: string[]}}
 */
export function sourceSummary(rows) {
  /** @type {Record<string, number>} */
  const rowTotals = {
    LICENSED: 0, OFFICE: 0, 'SOURCE-UNRESOLVED': 0,
  };
  /** @type {Record<string, number>} */
  const fieldTotals = {
    LICENSED: 0, OFFICE: 0, 'SOURCE-UNRESOLVED': 0,
  };
  /** @type {Record<string, number>} */
  const grounds = { 'no-mapping': 0, 'no-institution-in-roster': 0 };
  /** @type {Map<string, number>} */
  const byKind = new Map();
  let twoSourceRows = 0;
  let rowsWithNoReading = 0;
  for (const row of rows) {
    const source = row.source;
    if (!source) continue;
    rowTotals[source.standing] = (rowTotals[source.standing] || 0) + 1;
    if (source.twoSource) twoSourceRows += 1;
    const entries = Object.entries(source.fields);
    if (entries.length === 0) rowsWithNoReading += 1;
    for (const [field, kind] of entries) {
      const cell = fieldSourceOf(field);
      fieldTotals[cell.standing] = (fieldTotals[cell.standing] || 0) + 1;
      if (cell.standing === 'SOURCE-UNRESOLVED') {
        grounds[cell.reason === FIELD_REASONS.NO_INSTITUTION ? 'no-institution-in-roster' : 'no-mapping'] += 1;
      }
      if (kind) byKind.set(kind, (byKind.get(kind) || 0) + 1);
    }
  }
  return {
    rows: rowTotals,
    fields: fieldTotals,
    byKind: [...byKind].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)),
    unresolvedGrounds: grounds,
    twoSourceRows,
    rowsWithNoReading,
    kindsWithNoInstitution: HOLDER_KINDS.filter((k) => !recordOf(k)?.rosterBacked),
  };
}
