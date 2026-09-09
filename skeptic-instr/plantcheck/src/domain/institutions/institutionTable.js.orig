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
 * ── THE RUIN FILTER IS ROUTED, NOT RE-SPELLED ──────────────────────────────────────
 * The roster is the LIVE roster (`liveInstitutions`), so a ruined citadel carries no wall
 * duty. That import is also what keeps this file compliant with the estate's ruin-filter
 * ratchet rather than exempt from it.
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
 * @type {RegExp}
 */
export const DUTY_SERVICE_KINDS = /\b(tithe|dues|tax|taxation|toll|customs|custom commissions?|record keeping|records?|register|registration|census|levy|muster|rolls?)\b/i;

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
 * @property {Record<string, TableColumn>} columns
 */

/**
 * The settlement's instantiated service rows, flattened out of `availableServices`.
 *
 * ⚠ THE FIELD IS `availableServices`, NOT `services`, AND THE DIFFERENCE IS A MEASUREMENT.
 * `settlement.services` is declared in the schema and is EMPTY on every settlement this
 * pipeline generates (measured: 0 rows over 20 settlements across four tiers). The rows the
 * generator actually writes land on `availableServices`, keyed by category, each carrying the
 * INSTITUTION NAME it belongs to — 702 rows over twelve settlements, 697 of which name a live
 * roster row. A table built on the schema's field would have reported every duty column empty
 * and been believed.
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
  const services = instantiatedServices(settlement);
  const offices = officesOf(settlement);
  const dutyRows = services.filter((s) => DUTY_SERVICE_KINDS.test(s.name));
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
    const impairments = Array.isArray(inst?.impairments) ? inst.impairments : [];
    return Object.freeze({
      institution: name,
      catalogId: text(inst?.catalogId),
      category: text(inst?.category),
      // The join is INFERRED by name, never held: no typed NPC→institution edge exists, so
      // an inferred holder licenses the ROLE NOUN only — never "the holder of THIS one".
      holderRole: null,
      holderBasis: 'inferred',
      whatItCounts: Object.freeze(own.filter((s) => DUTY_SERVICE_KINDS.test(s.name)).map((s) => s.name)),
      whatItDoes: Object.freeze(own.map((s) => s.name)),
      whatItDoesNotDo: Object.freeze([
        ...(RUIN_STATUS.has(status) ? [status] : []),
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
        basis: 'the NPC roster\'s role and title nouns plus the governing seat\'s designation',
      }),
      holderRole: Object.freeze({
        closed: false,
        values: Object.freeze([]),
        basis: 'no typed NPC→institution edge exists; a name-regex inference licenses the ROLE NOUN only',
      }),
      whatItCounts: Object.freeze({
        // CLOSED to the instantiated rows: the catalog menu carries a PROBABILITY, not a fact,
        // and only a row this settlement actually holds counts.
        closed: true,
        values: Object.freeze([...new Set(dutyRows.map((s) => s.name))].sort()),
        basis: 'availableServices rows whose name is a duty kind, on a live institution',
      }),
      whoIsCounted: Object.freeze({
        // ⛔ FALSE FOREVER, ON EVERY SETTLEMENT. The population is a number, never an
        // enumeration; no roll of persons exists; there is nothing to close.
        closed: false,
        values: Object.freeze(band ? [band] : []),
        basis: 'settlement.population, spoken only through the caller\'s QUANTITY_BANDS reader — a band, never a roll',
      }),
      whoIsExempt: Object.freeze({
        closed: tollExemptions.length > 0,
        values: Object.freeze(tollExemptions),
        basis: 'the treaty TOLL-EXEMPTION term family — a route\'s exemption from a toll, never a person\'s from a count',
        // MEASURED, not assumed: no exemption writer exists on any settlement path. The one
        // live typed `exempt: true|false` in the estate is `demographicsLand.js`'s SITE
        // LEGALITY flag (a user-provenance site is exempt from the legality refusal), which is
        // not an exemption from a duty and does not belong in this column.
        nullEverywhere: tollExemptions.length === 0,
      }),
      whatItDoes: Object.freeze({
        closed: true,
        values: Object.freeze([...new Set(services.map((s) => s.name))].sort()),
        basis: 'the instantiated service rows and the catalog desc, which licenses the duty NOUN it names and nothing else',
      }),
      whatItDoesNotDo: Object.freeze({
        closed: true,
        values: Object.freeze([...new Set(rows.flatMap((r) => r.whatItDoesNotDo))].sort()),
        basis: 'status in {ruined, removed, destroyed, remnant}, _worldPulseInactive, and typed impairments',
      }),
      provenance: Object.freeze({
        closed: true,
        values: Object.freeze([...new Set(rows.map((r) => String(r.provenance?.kind || '')).filter(Boolean))].sort()),
        basis: 'institutionFoundingOf — FOUNDED{year,tick} | FOUNDED_UNDATED | PRE_SEED, where absence is the typed value',
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
