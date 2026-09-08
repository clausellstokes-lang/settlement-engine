/**
 * domain/prose/entryGround.js — THE TYPED GROUND the entry walker judges against.
 *
 * Two grounds, because a corpus VARIANT and a rendered TOWN are different things to check.
 *
 * ── THE ESTATE GROUND ──────────────────────────────────────────────────────────────
 * A pool variant is not bound to a settlement: it is a sentence the corpus holds for ANY
 * town whose state selects it. So a corpus-wide run cannot consult a per-town row, and a
 * walker that pretended otherwise would be inventing a table. What it CAN consult is the
 * set of facts that hold on every settlement the product can generate:
 *
 *   `whoIsCounted` is OPEN, on every settlement, forever. The population is a NUMBER, never
 *     an enumeration; no roll of persons exists anywhere in the engine, so the column can
 *     never carry `closed: true` and a totality over persons is never licensed.
 *   `whoIsExempt` is NULL EVERYWHERE. Measured, not assumed: no exemption writer exists, and
 *     the one typed exemption FAMILY the world holds is a treaty TOLL term between
 *     settlements — a route's exemption from a toll, never a person's from a count.
 *   `office` holds the union of the estate's ROLE NOUNS. An office noun absent from that
 *     union is absent from every settlement's table, which is what lets `bailiff` fail
 *     without a per-town read.
 *   `whatItCounts` and `institution` are PER-SETTLEMENT and unknowable here, so they are
 *     supplied as `values: null` and their limbs declare themselves NOT-EXECUTABLE.
 *
 * ⭐ THE ROSTER IS AN INPUT, NEVER AN IMPORT. This leaf stays headless: a display-side lint
 * module that imported `src/generators/**` would pull the generator tree into the dossier
 * chunk for a list of strings. The caller derives the roster from the role catalogues and
 * hands it in — and because it is derived rather than transcribed, a renamed role changes
 * the ground instead of silently leaving a stale literal behind.
 *
 * ── THE SETTLEMENT GROUND ──────────────────────────────────────────────────────────
 * One town's institution table, with every column filled. Every limb runs. The table itself
 * is `domain/institutions/institutionTable.js` (a derived, unpersisted projection); this
 * function is only the adapter that presents its columns in the shape the walker reads.
 *
 * PURE, HEADLESS, IMPORT-FREE.
 */

/**
 * @typedef {import('./entryWalker.js').EntryGround} EntryGround
 * @typedef {import('./entryWalker.js').TableColumn} TableColumn
 */

/**
 * The estate-wide ground: what is true of EVERY settlement the product can generate.
 * @param {{officeRoster: ReadonlyArray<string>}} sources
 * @returns {EntryGround}
 */
export function estateGround(sources) {
  const roster = Array.isArray(sources?.officeRoster) ? sources.officeRoster : null;
  if (!roster || roster.length === 0) {
    throw new Error('entryGround.estateGround: the office roster is empty; derive it from the role catalogues, never transcribe it');
  }
  return Object.freeze({
    scope: /** @type {'estate'} */ ('estate'),
    columns: Object.freeze({
      // CLOSED by construction on a settlement (the roster IS the set) but UNKNOWN here.
      institution: Object.freeze({ closed: true, values: null }),
      office: Object.freeze({ closed: false, values: Object.freeze([...roster]) }),
      holderRole: Object.freeze({ closed: false, values: null }),
      whatItCounts: Object.freeze({ closed: true, values: null }),
      // Persons are never closed. This is the one column whose flag is a law rather than a
      // measurement, and it is why the Brackwater kicker stays refused after every row the
      // owner might add.
      whoIsCounted: Object.freeze({ closed: false, values: null }),
      whoIsExempt: Object.freeze({ closed: false, values: Object.freeze([]), nullEverywhere: true }),
    }),
    joins: undefined,
    eventProvenance: undefined,
    gender: undefined,
    siblings: [],
  });
}

/**
 * The estate ground for ONE entry, with the entry's own pool-cell siblings and, where the
 * caller has resolved it, the block's composed fill.
 * @param {EntryGround} base the estate ground
 * @param {{siblings?: ReadonlyArray<import('./entryWalker.js').ProseEntry>,
 *   fill?: EntryGround['fill'], eventProvenance?: boolean}} per
 * @returns {EntryGround}
 */
export function withEntryContext(base, per) {
  return {
    ...base,
    ...(per.siblings ? { siblings: per.siblings } : {}),
    ...(per.fill ? { fill: per.fill } : {}),
    ...(typeof per.eventProvenance === 'boolean' ? { eventProvenance: per.eventProvenance } : {}),
  };
}

/**
 * The per-settlement ground, from a derived institution table.
 * @param {{columns: Record<string, TableColumn>, rows?: ReadonlyArray<Record<string, unknown>>,
 *   joins?: ReadonlyArray<string>}} table
 * @returns {EntryGround}
 */
export function settlementGround(table) {
  if (!table || !table.columns) {
    throw new Error('entryGround.settlementGround: no table supplied; a settlement ground without a table is a guess');
  }
  return {
    scope: 'settlement',
    columns: table.columns,
    rows: table.rows || [],
    joins: table.joins || [],
    siblings: [],
  };
}
