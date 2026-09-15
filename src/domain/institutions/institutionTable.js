/**
 * institutionTable.js — THE INSTITUTION TABLE (CLERK-LAWS §1): a per-settlement, typed,
 * READ-TIME projection of what the world holds about each institution and each office.
 *
 * ── WHAT IT IS FOR, IN ONE SENTENCE ────────────────────────────────────────────────
 * It is the one structure a clerk's sentence about who holds, who counts, who is counted,
 * who is exempt, what an institution does and does not do, and where it came from, must be
 * READ FROM — never written toward. The Brackwater lesson in one line: **a row licenses a
 * NOUN and a PREDICATE; only a CLOSED COLUMN licenses a QUANTIFIER.**
 *
 * ── WHAT IT IS NOT, AND THE FENCES THAT KEEP IT SO ─────────────────────────────────
 * DERIVED, never persisted. Generation never imports it (the `institutionFounding.js`
 * precedent: a headless leaf, golden-inert by construction). It has NO WRITER. It adds no
 * `exempt` field and no `bailiff` role — both are engine-side, golden-bound and OWNER-GATED
 * (CLERK-LAWS §4). It is not shown on the DM page — that is D10, a product surface, and the
 * owner's to sign. It is not a closed vocabulary of offices, not a template that fills a
 * slot per row, not a runtime gate, and not a substitute for the STATE-KEY: a block's
 * STATE-KEY licenses the block's STATE words and this table licenses its INSTITUTION words,
 * and a sentence may need both.
 *
 * ── THE ONE THING THE TABLE CAN NEVER SAY ──────────────────────────────────────────
 * `whoIsCounted.closed` is FALSE on every settlement, forever, and not because the data is
 * thin. The population is a NUMBER; no roll of persons exists anywhere in the engine; there
 * is nothing to close. So "every household", "everyone", "the only person" are refused after
 * every row the owner might ever add. The `closed` flag is therefore PER COLUMN and not per
 * settlement and not per row — because the Brackwater "only" quantifies over PERSONS, and
 * persons are open on every settlement forever.
 *
 * ── THE RUIN FILTER IS ROUTED, NOT RE-SPELLED — THROUGH THE ROWS *AND* THE COLUMNS ──
 * The roster is the LIVE roster (`liveInstitutions`), so a ruined citadel carries no wall
 * duty. That import is also what keeps this file compliant with the estate's ruin-filter
 * ratchet rather than exempt from it.
 *
 * ⚠ THE FIRST CUT ROUTED IT FOR THE ROWS AND NOT FOR THE COLUMNS, and the columns are what a
 * clerk's sentence reads. `whatItDoes` and `whatItCounts` were built from the UNFILTERED
 * `instantiatedServices()`, so a service row naming an institution outside the live roster
 * entered the column anyway. MEASURED over 30 generated settlements of six tiers: **23 such
 * rows**, every one naming a parenthetical pseudo-institution the roster never held —
 * `(lawless)`, `(informal)`, `(street gang)`, `(arcane underground)`, `(smuggling)` — and
 * `census-city`'s `whatItDoes` carried `Arcane services (illicit)` on that ground. **Zero of
 * the 23 are duty-kind**, so no Brackwater-class sentence was licensed by it today; it was
 * latent, and it is closed here rather than banked.
 *
 * ── A COLUMN IS `closed: true` ONLY WHEN EVERY SOURCE THE SPEC NAMES IS READ ────────
 * The chair's honesty rule (SITTING §L.2 item 62; CLERK-LAWS §1.2 NOTE; Part B §18). Three
 * columns shipped `closed: true` on partial fills, two of them with a `basis` naming a source
 * the code never opened, and `holderRole` carried `basis: 'inferred'` over a hardcoded
 * `null` — a basis describing an inference the code does not make. Over-licensing a
 * quantifier is the forbidden direction; a duty the world holds and the table refuses is the
 * lesser fault, and both are cured here. `COLUMN_SOURCES` publishes, per column, every source
 * CLERK-LAWS §1.2 names and whether this module reads it, and `closed` is DERIVED from that
 * roster rather than asserted beside it — so a closed flag with an unread source cannot be
 * written by hand at all.
 *
 * PURE, HEADLESS. No store, no clock, no RNG, no I/O.
 *
 * @enforced-by tests/lint/institutionTable.walker.test.js
 */
import { liveInstitutions } from './institutionRoster.js';
import { institutionFoundingOf } from '../institutionFounding.js';
import { governingFactionOf } from '../rulingPower.js';

/**
 * The ELEVEN columns. `closed` is not among them: it is a PROPERTY of each column, per
 * CLERK-LAWS §1.2's own correction, and lives on the column rather than in the list.
 * @type {ReadonlyArray<string>}
 */
export const TABLE_COLUMNS = Object.freeze([
  'settlement',
  'institution',
  'office',
  'holderRole',
  'whatItCounts',
  'whoIsCounted',
  'whoIsExempt',
  'whatItDoes',
  'whatItDoesNotDo',
  'provenance',
  'sustainer',
]);

/**
 * The DUTY KINDS a service row may carry — the closed list `whatItCounts` is filtered to.
 * Published, because the column's contents depend on it. MEASURED at 3b1c0eaa5: over twelve
 * generated settlements of four tiers, 702 instantiated service rows carried 19 of these
 * kinds, spelled `Record keeping`, `Tax collection`, `Toll collection`, `Tax payment`,
 * `Custom commission(s)`, `Customs bypass`, `Road register` and `Register of the dead`.
 *
 * ⚠ BARE `custom` IS DELIBERATELY ABSENT. With it in, `Custom enchanting` — an arcane
 * SERVICE, not a customs duty — entered the column on the estate scan. A duty column that
 * admits a craft service licenses a clerk's sentence about a duty the town does not have,
 * which is the whole fault this table exists to make impossible.
 *
 * ⚠ AND THE PLURALS WERE MISSING, WHICH ONLY SHOWED WHEN THE SECOND SOURCE WAS READ. The
 * stems were singular-only for `tithe`, `tax` and `toll` while `records?`, `rolls?` and
 * `custom commissions?` already carried their plural. Service NAMES are singular by house
 * style, so nothing was lost there; the fired INCOME rows are plural by house style — `Market
 * Taxes`, `Church Tithes`, `Gate Tolls` — and every one of them was refused by a duty filter
 * that would have admitted `Market Tax`. MEASURED over 30 settlements (1,678 service rows,
 * 195 income rows, 375 + 22 distinct names): the plural stems admit **the same 11 service
 * names, exactly** — nothing new and nothing lost — and **3 income sources** that were
 * refused before. A widening that admits nothing new on the source it already read is a
 * spelling repair rather than a loosened predicate.
 * @type {RegExp}
 */
export const DUTY_SERVICE_KINDS = /\b(tithes?|dues|tax(?:es)?|taxation|tolls?|customs|custom commissions?|record keeping|records?|registers?|registration|census|levy|levies|musters?|rolls?)\b/i;

/**
 * THE SOURCE ROSTER, PER COLUMN — CLERK-LAWS §1.2's own "what fills it TODAY" cells, and
 * whether THIS module reads each one. `closed` is derived from it (`closureOf`), never
 * written beside it.
 *
 * ⭐ IT IS A DECLARATION THE GATE CAN CATCH LYING, not documentation. Each row carries the
 * spec's citation and a `read` flag; the walker asserts the implication (`closed ⇒ every
 * source read`) AND that a source marked read actually contributes on a settlement built to
 * exercise it — the positive twin. A row flipped to `read: true` without the code that reads
 * it therefore reds on the twin, not on the flag.
 * @type {Readonly<Record<string, ReadonlyArray<{source: string, cite: string, read: boolean,
 *   note?: string}>>>}
 */
export const COLUMN_SOURCES = Object.freeze({
  institution: Object.freeze([
    Object.freeze({ source: 'settlement.institutions[] through the live filter', cite: 'settlement.schema.js:272; institutionRoster.js:38-42, :53-56', read: true }),
  ]),
  office: Object.freeze([
    Object.freeze({ source: 'the NPC roster\'s role and title nouns', cite: 'settlement.schema.js:429-431, :951-953', read: true }),
    Object.freeze({ source: 'the governing seat\'s designation', cite: 'rulingPower.js:224-230', read: true }),
  ]),
  holderRole: Object.freeze([
    Object.freeze({
      source: 'a typed NPC→institution edge',
      cite: 'CLERK-LAWS §1.2 (the column\'s "what is MISSING" cell)',
      read: false,
      note: 'none exists; `npcProfile.js:341-353` infers a link by name regex and this module '
        + 'does not call it. The value is a hardcoded null, so the basis is `absent` and not '
        + '`inferred`: a basis names what the code DOES.',
    }),
  ]),
  whatItCounts: Object.freeze([
    Object.freeze({ source: 'the settlement\'s INSTANTIATED service rows, on a LIVE institution', cite: 'institutionServices.js:23, :41, :45, …', read: true }),
    Object.freeze({ source: 'the fired economy income rows', cite: 'economicState.js:215-233 ("Church Tithes", gated on religionInfluence > 55 && hasReligiousInst)', read: true }),
    Object.freeze({
      source: 'economicState.treasury.coinFlows.taxed',
      cite: 'settlement.schema.js:628-635 (the ledger is a member of SimEconomicState); '
        + 'written by worldPulse/treasury.js:1253; read there by treasuryRecordOf :625',
      read: true,
      note: 'THE PATH WAS WRONG IN CAR 9 AND IS CORRECTED HERE (INSTR-912 car 11, measured). '
        + 'Car 9 read `settlement.treasury`, which NO writer in the estate produces (the '
        + 'ledger lives at `settlement.economicState.treasury`), so the read degraded to NaN '
        + 'on every world forever and the observed-shape ratchet convicted it. Still ABSENT '
        + 'AT BIRTH at the corrected path: the ledger is a world-pulse structure no generator '
        + 'writes, and the key is absent on every world that has not ticked under a lit '
        + '`treasuryEnabled` (schema:672), so the ABSENT branch is still the one every '
        + 'generated settlement takes, but it is now absent BECAUSE THE WORLD HAS NOT '
        + 'TICKED, not because the code was asking the wrong object. It is a LAST-TICK '
        + 'MAGNITUDE, not a duty name, so it can corroborate a tax duty the other two '
        + 'sources already name and can never carry one they miss, which is why reading it '
        + 'does not widen the column and why §1.2\'s own MISSING cell names only the service '
        + 'row and the income row as what a duty word must resolve to.',
    }),
  ]),
  whoIsCounted: Object.freeze([
    Object.freeze({ source: 'settlement.population through the caller\'s QUANTITY_BANDS reader', cite: 'settlement.schema.js:357; demographicsHerald.js:72-80', read: true }),
    Object.freeze({
      source: 'a roll of persons',
      cite: 'CLERK-LAWS §1.2 (the column\'s "what is MISSING" cell)',
      read: false,
      note: 'NONE EXISTS AND NONE EVER WILL. The population is a number; there is nothing to '
        + 'enumerate. This row is why the column is open by LAW and not merely by measurement.',
    }),
  ]),
  whoIsExempt: Object.freeze([
    Object.freeze({ source: 'the treaty TOLL-EXEMPTION term family', cite: 'peaceTermsCatalog.js; RECEIPT_POOLS_TRADE.md:924', read: true }),
  ]),
  whatItDoes: Object.freeze([
    Object.freeze({ source: 'the instantiated service NAMES, on a LIVE institution', cite: 'institutionServices.js', read: true }),
    Object.freeze({ source: 'the catalog `desc`', cite: 'institutionalCatalog.js:1054-1059', read: false, note: 'captured by `instantiatedServices` and used by nothing: the desc is PROSE about the KIND, and turning it into duty nouns needs a detector this module refuses to be (§1.2: it licenses the duty NOUN the desc itself names, which is a reader\'s judgment and not a field).' }),
    Object.freeze({ source: 'the seeded description variants', cite: 'institutionDescVariants.js:1-15', read: false }),
    Object.freeze({ source: 'the identity side-car', cite: 'institutionVocabulary.js:1-40', read: false }),
    Object.freeze({ source: 'the defence projection', cite: 'defenseInstitutionBuckets.js', read: false }),
    Object.freeze({ source: 'the backing faction and the finite basis phrases', cite: 'institutionProfile.js:182-192; powerSupport.js:58-75', read: false }),
  ]),
  whatItDoesNotDo: Object.freeze([
    Object.freeze({ source: 'status in {ruined, removed, destroyed, remnant}', cite: 'institutionRoster.js:30-41', read: true, note: 'read on every row, and STRUCTURALLY SILENT on a LIVE one, because `isLiveInstitution` removes exactly the rows that could carry it. Measured: held = 0 on all three census tiers.' }),
    Object.freeze({ source: 'typed impairments', cite: 'corruption.js:677', read: true }),
    Object.freeze({ source: '_worldPulseInactive', cite: 'institutionRoster.js:40', read: true, note: 'read on every row, and unreachable for the same reason as the status: `isLiveInstitution` returns false the moment it is true.' }),
    Object.freeze({
      source: 'a service row with `on: false`',
      cite: 'CLERK-LAWS §1.2',
      read: false,
      note: 'THE FIELD DOES NOT EXIST ON THE DATA. Measured over three tiers: 199 '
        + '`availableServices` rows, ZERO carrying an `on` key at all: the `on`/`p` pair is '
        + 'the catalog MENU\'s, and the instantiated row drops it. So the column cannot '
        + 'enumerate what an institution declines to do, and cannot close.',
    }),
  ]),
  provenance: Object.freeze([
    Object.freeze({ source: 'institutionFoundingOf: the three typed kinds', cite: 'institutionFounding.js:44-46, :141-148', read: true }),
  ]),
  sustainer: Object.freeze([
    Object.freeze({ source: 'the R6 receipt\'s localSustainerGone and the re-adjudication terminal\'s institution', cite: 'NL-4', read: false }),
  ]),
});

/**
 * THE COLUMNS THE LAW HOLDS OPEN whatever their sources say — each with the reason, because a
 * flag with no reason is a flag someone will flip.
 * @type {Readonly<Record<string, string>>}
 */
export const OPEN_BY_LAW = Object.freeze({
  whoIsCounted: 'the population is a NUMBER and no roll of persons exists anywhere in the engine;'
    + ' there is nothing to close, on any settlement, forever (CLERK-LAWS §1.2, §1.4)',
  office: 'the structural NPC roster is a SAMPLE (one to three per faction, factionRoles.js\''
    + ' own header), so a town holds offices the roster does not name',
  holderRole: 'no typed NPC→institution edge exists; the value is null on every row',
  sustainer: 'NL-4\'s addition, carried whole and not re-measured here',
});

/**
 * THE SOURCE CEILING on a column's `closed` flag: true only where every source CLERK-LAWS
 * §1.2 names for it is read by this module.
 *
 * ⭐ IT IS A CEILING, NOT THE FLAG. A column may sit BELOW it for a law of its own
 * (`OPEN_BY_LAW`) or for a per-settlement measurement (`whoIsExempt` closes only where a
 * treaty term is actually held). What it forbids is the other direction — the direction that
 * over-licenses a quantifier — and that is the whole of the chair's honesty rule: `closed`
 * implies every named source read.
 * @param {string} column
 * @returns {boolean}
 */
export function sourcesAllRead(column) {
  const sources = COLUMN_SOURCES[column];
  if (!Array.isArray(sources) || sources.length === 0) return false;
  return sources.every((row) => row.read === true);
}

/**
 * The unread sources of a column, for a basis clause and for the gate's message.
 * @param {string} column
 * @returns {string[]}
 */
export function unreadSourcesOf(column) {
  return (COLUMN_SOURCES[column] || []).filter((r) => !r.read).map((r) => `${r.source} (${r.cite})`);
}

/** Non-active statuses, in the roster accessor's own vocabulary. */
const RUIN_STATUS = new Set(['ruined', 'removed', 'destroyed', 'remnant']);

/** @param {unknown} v @returns {string} */
const text = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * The loosely-typed settlement shape this projection reads. It names ONLY the fields the
 * table consults, which is also the honest documentation of its reach: a reader can see the
 * whole input surface without opening `settlement.schema.js`.
 *
 * ⭐ WRITTEN OUT RATHER THAN CAST TO `any`, because the estate's any-cast ratchet allows a new
 * file exactly ZERO holes and says so in its own words: *fix the types, do not widen*. Eleven
 * casts became this typedef, and the typedef is more useful than the casts were.
 * @typedef {object} TableSettlement
 * @property {string} [id]
 * @property {string} [name]
 * @property {number} [population]
 * @property {ReadonlyArray<InstitutionRow>} [institutions]
 * @property {ReadonlyArray<{role?: string, title?: string}>} [npcs]
 * @property {{governingName?: string, factions?: ReadonlyArray<{faction?: string,
 *   isGoverning?: boolean}>}} [powerStructure]
 * @property {Record<string, ReadonlyArray<{name?: string, institution?: string,
 *   desc?: string}>>} [availableServices]
 * @property {ReadonlyArray<unknown>} [services]
 * @property {{incomeSources?: ReadonlyArray<{source?: string}>,
 *   treasury?: {coinFlows?: {taxed?: number}}}} [economicState]
 */

/**
 * One roster row, as the table reads it.
 * @typedef {object} InstitutionRow
 * @property {string} [name]
 * @property {string} [catalogId]
 * @property {string} [category]
 * @property {string} [status]
 * @property {boolean} [_worldPulseInactive]
 * @property {ReadonlyArray<{type?: string}>} [impairments]
 */

/**
 * @typedef {object} TableColumn
 * @property {boolean} closed
 * @property {ReadonlyArray<string>} values
 * @property {string} basis how the column was filled, in one clause
 * @property {boolean} [nullEverywhere] true only where the column is null on EVERY settlement
 *   the product can generate — a MEASURED claim, never an assumption
 */

/**
 * @typedef {object} InstitutionTable
 * @property {string} settlement
 * @property {ReadonlyArray<Record<string, unknown>>} rows one per LIVE institution
 * @property {ReadonlyArray<string>} orphanServices service rows naming an institution outside
 *   the live roster — dropped from every column, and reported so the drop is measurable
 * @property {Record<string, TableColumn>} columns
 */

/**
 * The settlement's instantiated service rows, flattened out of `availableServices`.
 *
 * ⚠ THE FIELD IS `availableServices`, NOT `services`, AND THE DIFFERENCE IS A MEASUREMENT.
 * `settlement.services` is declared in the schema and is EMPTY on every settlement this
 * pipeline generates. The rows the generator actually writes land on `availableServices`,
 * keyed by category, each carrying the INSTITUTION NAME it belongs to. A table built on the
 * schema's field would have reported every duty column empty and been believed.
 *
 * ⭐ THE INTEGERS ARE NAMED-SEED FIGURES, because the first spelling of them was not
 * reproducible: it said "702 rows over twelve settlements, 697 of which name a live roster
 * row" and "0 rows over 20 settlements across four tiers" without ever naming the twelve or
 * the twenty, so nothing could re-take them. RE-TAKEN over the THIRTY settlements the gate's
 * own estate scan walks — seeds `estate-<tier>-0` … `estate-<tier>-4` over `thorp`, `hamlet`,
 * `village`, `town`, `city`, `metropolis`, culture `germanic`, terrain `grassland`, road
 * access: **1,678 instantiated service rows · 1,655 naming a LIVE institution or none · 32
 * duty-kind · `settlement.services` 0.** Reproduce with
 * `tests/lint/institutionTable.walker.test.js`'s ruin-filter arm, which walks the same thirty.
 *
 * ⛔ AND THE ZERO IS NOW PINNED, NOT MERELY RECORDED (LT40 car 2). A measurement in a
 * comment is a claim, and this one is exactly the claim a new reader would violate by
 * growing on the schema's declared-but-unwritten field. The pin is the same walker's
 * "PINS `settlement.services` PERMANENTLY ABSENT" arm, and it asserts the KEY IS ABSENT
 * rather than that its length is zero — `services: []` also has length zero, so the
 * length arm alone would pass a writer that regrew the field empty. The schema typedef
 * (`src/domain/settlement.schema.js`, `@property {Service[]} [services]`) now carries the
 * cross-link, so the declaration stops reading as a live field. POPULATING OR RETIRING
 * the field is owner-gated and output-moving in either direction:
 * `src/lib/structuralFingerprint.js:261` reads `arr(settlement.services).length` as a
 * constant 0 INSIDE a fingerprint. The other two readers of the always-empty field are
 * `src/store/settlementGenerateAction.js:384` and
 * `src/domain/worldPulse/factionCompetition.js:156`/`:186`.
 * @param {TableSettlement} settlement
 * @returns {Array<{name: string, institution: string, desc: string}>}
 */
export function instantiatedServices(settlement) {
  const bag = settlement?.availableServices;
  if (!bag || typeof bag !== 'object') return [];
  /** @type {Array<{name: string, institution: string, desc: string}>} */
  const out = [];
  for (const value of Object.values(bag)) {
    if (!Array.isArray(value)) continue;
    for (const row of value) {
      const name = text(row?.name);
      if (name) out.push({ name, institution: text(row?.institution), desc: text(row?.desc) });
    }
  }
  return out;
}

/**
 * THE FIRED ECONOMY INCOME ROWS whose source names a duty kind — CLERK-LAWS §1.2's second
 * named filler for `whatItCounts`, and the one the first cut left unread.
 *
 * ⭐ FIRED, NEVER OFFERED. `economicState.js:215-233` builds "Church Tithes" only behind
 * `religionInfluence > 55 && hasReligiousInst`, so a row present on the settlement is a duty
 * the world HELD this generation — the same standard as an instantiated service row and the
 * opposite of the catalog menu's probability. Measured at this tip: a town carries `Market
 * Taxes`, `Church Tithes`, `Gate Tolls` and `Court Fees & Fines` among eleven rows, and a
 * table that read only `availableServices` refused every one of them.
 *
 * ⚠ THE ROW IS SETTLEMENT-WIDE, NOT PER INSTITUTION. An income row names a revenue SOURCE and
 * carries no institution, so it fills the COLUMN and never a row's own `whatItCounts` — the
 * distinction the Brackwater walk turns on ("a count duty on an institution whose service
 * rows do not carry it" stays refused).
 * @param {TableSettlement} settlement
 * @returns {string[]}
 */
export function firedDutyIncome(settlement) {
  const rows = settlement?.economicState?.incomeSources;
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row) => text(row?.source))
    .filter((name) => name && DUTY_SERVICE_KINDS.test(name));
}

/**
 * Every OFFICE the settlement holds — the role nouns its own NPC roster names, plus the
 * governing seat's designation.
 *
 * ⚠ THE COLUMN IS OPEN AND STAYS OPEN. The structural NPC roster is a SAMPLE (one to three
 * per faction by its own header), so a town has offices the roster does not name. That is
 * not a gap to be filled; it is what makes the column open, and it is why "the only person
 * the bailiff does not count" is refused twice over.
 * @param {TableSettlement} settlement
 * @returns {string[]}
 */
export function officesOf(settlement) {
  const npcs = Array.isArray(settlement?.npcs) ? settlement.npcs : [];
  /** @type {Set<string>} */
  const offices = new Set();
  for (const npc of npcs) {
    const role = text(npc?.role);
    const title = text(npc?.title);
    if (role) offices.add(role);
    if (title) offices.add(title);
  }
  // A CONCRETE cast, not an `any`: the ruling-power reader declares its own settlement shape
  // (`RulingPowerSettlement`), and this table's input is a subset of it. Naming the target
  // type is what keeps the estate's any-cast ratchet at zero for this file.
  const governing = governingFactionOf(
    /** @type {import('../rulingPower.js').RulingPowerSettlement} */ (
      /** @type {unknown} */ (settlement)),
  );
  const seat = text(governing?.faction) || text(settlement?.powerStructure?.governingName);
  if (seat) offices.add(seat);
  return [...offices].sort();
}

/**
 * THE TABLE. One settlement in, eleven typed columns out.
 * @param {TableSettlement} settlement
 * @param {{treatyTerms?: ReadonlyArray<{kind?: string, route?: string, from?: string}>,
 *   bandOf?: (count: number) => string}} [world]
 *   the realm-level facts a settlement does not carry: today only the treaty TOLL-EXEMPTION
 *   term family, which is the one typed exemption the world holds anywhere — plus `bandOf`,
 *   the CLOSED QUANTITY VOCABULARY the caller speaks counts through
 * @returns {InstitutionTable}
 */
export function institutionTableOf(settlement, world = {}) {
  const live = liveInstitutions(settlement);
  const liveNames = new Set(live.map((inst) => text(inst?.name)).filter(Boolean));
  const allServices = instantiatedServices(settlement);
  // ⭐ THE RUIN FILTER, ROUTED FOR THE COLUMNS AS WELL AS THE ROWS. A service row naming an
  // institution the live roster does not hold is not this settlement's duty to speak of. A
  // row naming NO institution stays — it is a settlement-level service, not an orphan.
  const services = allServices.filter((row) => !row.institution || liveNames.has(row.institution));
  const orphanServices = allServices.filter((row) => row.institution && !liveNames.has(row.institution));
  const offices = officesOf(settlement);
  const dutyRows = services.filter((s) => DUTY_SERVICE_KINDS.test(s.name));
  const incomeDuties = firedDutyIncome(settlement);
  // READ AND REPORTED: a LAST-TICK magnitude, absent at birth on every tier measured. It
  // corroborates a tax duty the two naming sources already hold and carries none of its own.
  // ⛔ THE PATH IS `economicState.treasury`, NEVER `settlement.treasury` (INSTR-912 car 11,
  // measured). Car 9 read the TOP LEVEL, and no writer in the estate produces it: the only
  // writer of a coin ledger anywhere is `advanceTreasury`, which writes it INSIDE
  // `economicState` (worldPulse/treasury.js:1253), and the module's own reader takes it from
  // there (`treasuryRecordOf`, :625). A guarded top-level read cannot throw — it degrades to
  // `NaN` forever — so the ABSENT branch was structurally the only reachable one and the
  // observed-shape ratchet convicted it (`treasury on settlement`, a key no writer produces).
  // At the produced path the ratchet is silent and the read can actually fire.
  const taxedCoin = Number(settlement?.economicState?.treasury?.coinFlows?.taxed);
  const population = Number(settlement?.population);
  // ⭐ THE BAND VOCABULARY IS THE CALLER'S, NOT AN IMPORT, and the estate's tuning register is
  // what settled it. Importing `demographicsHerald.quantityWords` moved the dependent list of
  // a FROZEN tuning table (`HERALD_TUNING`) — a signed-digest surface no lane refreezes — for
  // seven strings. The band belongs to the Herald; this table asks for it and says so in the
  // column's `basis`. With no `bandOf`, `whoIsCounted` holds nothing and the column says why.
  const band = Number.isFinite(population) && typeof world.bandOf === 'function'
    ? String(world.bandOf(population))
    : '';

  const rows = live.map((inst) => {
    const name = text(inst?.name);
    const own = services.filter((s) => s.institution === name);
    const status = text(inst?.status).toLowerCase();
    // `Array.isArray` is declared `arg is any[]`, so the guard WIDENS the row's own typed
    // `impairments` shape to `any[]` and the map below loses it. Naming the shape the roster
    // row already declares is this file's idiom (the `InstitutionRow` typedef), not a cast.
    /** @type {ReadonlyArray<{type?: string}>} */
    const impairments = Array.isArray(inst?.impairments) ? inst.impairments : [];
    return Object.freeze({
      institution: name,
      catalogId: text(inst?.catalogId),
      category: text(inst?.category),
      // The join is INFERRED by name, never held: no typed NPC→institution edge exists, so
      // an inferred holder licenses the ROLE NOUN only — never "the holder of THIS one".
      holderRole: null,
      // A BASIS NAMES WHAT THE CODE DOES (SITTING §L.2 item 62). Nothing here infers a
      // holder: `npcProfile.js`'s name-regex link exists and this module does not call it,
      // so the honest basis over a hardcoded null is `absent`, not `inferred`.
      holderBasis: 'absent',
      whatItCounts: Object.freeze(own.filter((s) => DUTY_SERVICE_KINDS.test(s.name)).map((s) => s.name)),
      whatItDoes: Object.freeze(own.map((s) => s.name)),
      whatItDoesNotDo: Object.freeze([
        ...(RUIN_STATUS.has(status) ? [status] : []),
        // READ, and unreachable here by construction: `isLiveInstitution` returns false the
        // moment this flag is true, so a LIVE row never carries it. Reading it is what makes
        // the column's source roster honest rather than aspirational.
        ...(inst?._worldPulseInactive === true ? ['inactive (world pulse)'] : []),
        ...(impairments.map((i) => `impaired: ${text(i?.type) || 'unclassified'}`)),
      ]),
      provenance: institutionFoundingOf(inst),
      // ⛔ NO `exempt` FIELD IS WRITTEN HERE, on this row or any other. An exemption writer is
      // a schema act and OWNER-GATED (CLERK-LAWS §4).
      whoIsExempt: null,
    });
  });

  const tollExemptions = (world.treatyTerms || [])
    .filter((t) => /toll/i.test(String(t?.kind || '')) && /exempt/i.test(String(t?.kind || '')))
    .map((t) => `toll exemption on ${String(t?.route || 'a route')}`);

  return Object.freeze({
    settlement: text(settlement?.id) || text(settlement?.name),
    rows: Object.freeze(rows),
    // The rows the column filter DROPPED, so the fence can assert the filter did something
    // rather than assert an emptiness it never tested (measured: 23 over 30 settlements,
    // 0 duty-kind).
    orphanServices: Object.freeze(orphanServices.map((r) => `${r.name} @ ${r.institution}`)),
    columns: Object.freeze({
      institution: Object.freeze({
        // CLOSED BY CONSTRUCTION: the live roster IS the full set of this town's institutions.
        closed: true,
        values: Object.freeze(rows.map((r) => r.institution).filter(Boolean)),
        basis: 'settlement.institutions filtered by liveInstitutions (the ruin filter)',
      }),
      office: Object.freeze({
        // OPEN: the structural NPC roster is a sample, so a town has offices it does not name.
        closed: false,
        values: Object.freeze(offices),
        basis: `the NPC roster's role and title nouns plus the governing seat's designation; OPEN BY LAW: ${OPEN_BY_LAW.office}`,
      }),
      holderRole: Object.freeze({
        closed: false,
        values: Object.freeze([]),
        // The value is a hardcoded null on every row, so the basis says `absent` and not
        // `inferred`: this module makes no inference (SITTING §L.2 item 62).
        basis: `absent: ${OPEN_BY_LAW.holderRole}; a name-regex inference exists at npcProfile.js:341-353 and is not called here`,
      }),
      whatItCounts: Object.freeze({
        // CLOSED, and now honestly: every source CLERK-LAWS §1.2 names for this column is
        // read — the instantiated rows on a LIVE institution, the FIRED income rows, and
        // `economicState.treasury.coinFlows.taxed` (a magnitude, measured absent at birth,
        // and read at the path the pulse writer actually produces — INSTR-912 car 11).
        closed: sourcesAllRead('whatItCounts'),
        values: Object.freeze([...new Set([...dutyRows.map((s) => s.name), ...incomeDuties])].sort()),
        basis: 'availableServices rows whose name is a duty kind on a LIVE institution, plus the'
          + ' fired economicState income rows whose source names one'
          + (Number.isFinite(taxedCoin)
            ? `; economicState.treasury.coinFlows.taxed = ${taxedCoin}`
            : '; economicState.treasury.coinFlows.taxed absent on this settlement'),
      }),
      whoIsCounted: Object.freeze({
        // ⛔ FALSE FOREVER, ON EVERY SETTLEMENT (`OPEN_BY_LAW.whoIsCounted`). The population
        // is a number, never an enumeration; no roll of persons exists; there is nothing to
        // close. Written as the literal `false` and NOT derived, so no source roster and no
        // future flag can reach it — and so sweep plant #78's target keeps its exact bytes.
        closed: false,
        values: Object.freeze(band ? [band] : []),
        basis: 'settlement.population, spoken only through the caller\'s QUANTITY_BANDS reader: a band, never a roll',
      }),
      whoIsExempt: Object.freeze({
        closed: tollExemptions.length > 0,
        values: Object.freeze(tollExemptions),
        basis: 'the treaty TOLL-EXEMPTION term family: a route\'s exemption from a toll, never a person\'s from a count',
        // MEASURED, not assumed: no exemption writer exists on any settlement path. The one
        // live typed `exempt: true|false` in the estate is `demographicsLand.js`'s SITE
        // LEGALITY flag (a user-provenance site is exempt from the legality refusal), which is
        // not an exemption from a duty and does not belong in this column.
        nullEverywhere: tollExemptions.length === 0,
      }),
      whatItDoes: Object.freeze({
        // OPEN: five of the six sources §1.2 names are unread, so the list of what an
        // institution does is a partial fill and licenses no quantifier over it.
        closed: sourcesAllRead('whatItDoes'),
        values: Object.freeze([...new Set(services.map((s) => s.name))].sort()),
        basis: 'the instantiated service rows on a LIVE institution; UNREAD: '
          + unreadSourcesOf('whatItDoes').join(' · '),
      }),
      whatItDoesNotDo: Object.freeze({
        // OPEN, and the reason is structural rather than lazy: `isLiveInstitution` removes
        // exactly the rows that could carry a ruin status or `_worldPulseInactive`, and the
        // `on: false` service row §1.2 names does not exist on the generated data at all.
        // Measured: held = 0 on all three census tiers — a closed, empty column was the
        // clearest over-licence in the table.
        closed: sourcesAllRead('whatItDoesNotDo'),
        values: Object.freeze([...new Set(rows.flatMap((r) => r.whatItDoesNotDo))].sort()),
        basis: 'status in {ruined, removed, destroyed, remnant}, _worldPulseInactive (both read'
          + ' and both unreachable on a LIVE row) and typed impairments; UNREAD: '
          + unreadSourcesOf('whatItDoesNotDo').join(' · '),
      }),
      provenance: Object.freeze({
        closed: true,
        values: Object.freeze([...new Set(rows.map((r) => String(r.provenance?.kind || '')).filter(Boolean))].sort()),
        basis: 'institutionFoundingOf: FOUNDED{year,tick} | FOUNDED_UNDATED | PRE_SEED, where absence is the typed value',
      }),
      sustainer: Object.freeze({
        closed: false,
        values: Object.freeze([]),
        basis: 'NL-4\'s addition, carried whole and NOT re-measured here: the R6 receipt\'s localSustainerGone and the re-adjudication terminal\'s institution',
      }),
    }),
  });
}

/**
 * The column census — what each column HOLDS on this settlement, for a receipt to print
 * beside CLERK-LAWS §1.2's own table.
 * @param {InstitutionTable} table
 * @returns {Array<{column: string, closed: boolean, held: number, sample: string}>}
 */
export function columnCensus(table) {
  return TABLE_COLUMNS.filter((c) => c !== 'settlement').map((column) => {
    const col = table.columns[column];
    return {
      column,
      closed: Boolean(col?.closed),
      held: col?.values.length ?? 0,
      sample: (col?.values || []).slice(0, 3).join(' · '),
    };
  });
}
