/**
 * tests/fixtures/brackwaterTables.js — THE FOUR BRACKWATER TABLES and the entry they judge.
 *
 * THE LESSON, IN ONE LINE. A row licenses a NOUN and a PREDICATE; only a CLOSED COLUMN
 * licenses a QUANTIFIER. The owner's three-sentence block is the estate's standing example
 * of a sentence that reads perfectly and asserts four things the world does not hold, and
 * these tables are how the walker is proved to key on the TABLE rather than on the words.
 *
 * ⚠ THE SENTENCES ARE A FIXTURE, NOT CORPUS PROSE. No file in the repo carries them (the
 * chair's own grep, CLERK-LAWS §1.4); they are assembled here from the fragments the spec
 * quotes, as DATA under tests/fixtures/, and nothing in `src/` or `docs/content/` moves.
 *
 * THE FOUR TABLES, and what each is for:
 *   (a) EMPTY   — the product as it stands today: no bailiff office anywhere in the estate,
 *                 no count duty on any office, and `whoIsExempt` null on every settlement.
 *   (b) FULL    — every row the owner might add: a bailiff, a count duty, an exemption for
 *                 the priest. The quantifiers STILL fail, because persons are open.
 *   (c) CLOSED  — (b) with `closed(whoIsCounted) = true`, a table the product can never
 *                 produce. The quantifier arm falls silent, which is what proves the arm
 *                 keys on the FLAG and not on the noun.
 *   (d) ROW-CLOSED — the FOURTH fixture the chair's sitting owed (SITTING B.4.7): rows that
 *                 carry `closed: true` at the ROW while the COLUMN is false. It must behave
 *                 exactly like (b). It is the only table that discriminates a per-COLUMN
 *                 reading from a per-ROW one, and without it a walker that read the row's
 *                 flag would pass all three of the others.
 */

/**
 * The owner's block, one entry, three sentences.
 * @type {Readonly<{id: string, text: string, block: string, pool: string, slots: string[]}>}
 */
export const BRACKWATER_ENTRY = Object.freeze({
  id: 'fixture::brackwater',
  text: 'Three hundred souls at Brackwater, and a bailiff who counts every one of them at the tithe. '
    + 'The catch goes upriver salted. '
    + 'The priest is the only person the bailiff does not count.',
  block: 'FIXTURE-BRACKWATER',
  pool: '*',
  slots: [],
});

/**
 * (a) THE PRODUCT TODAY. Every column the sentences reach is empty, and the two that can
 * never close are open.
 * @type {import('../../src/domain/prose/entryWalker.js').EntryGround}
 */
export const TABLE_EMPTY = Object.freeze({
  scope: 'settlement',
  columns: Object.freeze({
    institution: Object.freeze({ closed: true, values: Object.freeze([]) }),
    office: Object.freeze({ closed: false, values: Object.freeze([]) }),
    holderRole: Object.freeze({ closed: false, values: Object.freeze([]) }),
    whatItCounts: Object.freeze({ closed: true, values: Object.freeze([]) }),
    // PERSONS ARE NEVER CLOSED — on this or any settlement, forever. The population is a
    // NUMBER, never an enumeration, so no roll of persons exists to close.
    whoIsCounted: Object.freeze({ closed: false, values: null }),
    whoIsExempt: Object.freeze({ closed: false, values: Object.freeze([]), nullEverywhere: true }),
  }),
  rows: Object.freeze([]),
  joins: Object.freeze([]),
  eventProvenance: false,
  siblings: Object.freeze([]),
});

/** The rows (b), (c) and (d) share: a bailiff who counts, and a priest who is exempt. */
const FULL_ROWS = Object.freeze([
  Object.freeze({
    institution: 'the tithe barn', office: 'Bailiff', holderRole: 'Bailiff',
    whatItCounts: 'tithe-count', whoIsExempt: null,
  }),
  Object.freeze({
    institution: 'the shrine', office: 'Priest', holderRole: 'Priest',
    whatItCounts: null, whoIsExempt: 'priest from tithe-count',
  }),
]);

/**
 * (b) EVERY ROW THE OWNER MIGHT ADD, with persons still open.
 * @type {import('../../src/domain/prose/entryWalker.js').EntryGround}
 */
export const TABLE_FULL = Object.freeze({
  scope: 'settlement',
  columns: Object.freeze({
    institution: Object.freeze({ closed: true, values: Object.freeze(['the tithe barn', 'the shrine']) }),
    office: Object.freeze({ closed: false, values: Object.freeze(['Bailiff', 'Priest']) }),
    holderRole: Object.freeze({ closed: false, values: Object.freeze(['Bailiff', 'Priest']) }),
    whatItCounts: Object.freeze({ closed: true, values: Object.freeze(['tithe-count']) }),
    whoIsCounted: Object.freeze({ closed: false, values: null }),
    whoIsExempt: Object.freeze({ closed: true, values: Object.freeze(['priest from tithe-count']) }),
  }),
  rows: FULL_ROWS,
  joins: Object.freeze(['Bailiff→the tithe barn', 'Priest→the shrine']),
  eventProvenance: false,
  siblings: Object.freeze([]),
});

/**
 * (c) THE SYNTHETIC TABLE THE PRODUCT CAN NEVER PRODUCE: the persons column CLOSED.
 * @type {import('../../src/domain/prose/entryWalker.js').EntryGround}
 */
export const TABLE_CLOSED = Object.freeze({
  ...TABLE_FULL,
  columns: Object.freeze({
    ...TABLE_FULL.columns,
    whoIsCounted: Object.freeze({ closed: true, values: Object.freeze(['the tithe roll']) }),
  }),
});

/**
 * (d) THE FOURTH FIXTURE — rows flagged `closed: true` while the COLUMN stays open. A
 * walker reading the ROW's flag passes the quantifiers here; a walker reading the COLUMN's
 * fails them, exactly as in (b).
 * @type {import('../../src/domain/prose/entryWalker.js').EntryGround}
 */
export const TABLE_ROW_CLOSED = Object.freeze({
  ...TABLE_FULL,
  rows: Object.freeze(FULL_ROWS.map((r) => Object.freeze({ ...r, closed: true }))),
});

/**
 * THE POSITIVE CONTROLS — corpus-shaped sentences that MUST resolve. A walker that reds on
 * these has a detector doing the judging, which is the failure mode FINITE SEMANTICS names.
 * @type {ReadonlyArray<{id: string, text: string, why: string}>}
 */
export const POSITIVE_CONTROLS = Object.freeze([
  Object.freeze({
    id: 'control::banded-count',
    text: 'A few souls left {settlement} this season, few enough that everyone can name them.',
    why: 'DS-POP-1\'s banded count: the band word IS the licensed rendering of the population field',
  }),
  Object.freeze({
    id: 'control::pre-seed',
    text: 'The hall has stood since the founding.',
    why: 'a PRE_SEED provenance licenses "since the founding" and no year',
  }),
  Object.freeze({
    id: 'control::lack',
    text: 'There is no watch here.',
    why: 'R-DA-02\'s LACK: the world holds the absence, and contradictions.js computes exactly it',
  }),
]);

/**
 * THE NL-4 GENDER FIXTURE — one ladder line, two bearers. One must FAIL and one must PASS,
 * or the arm is reading the sentence rather than the field.
 * @type {ReadonlyArray<{id: string, text: string, gender: string, expect: string}>}
 */
export const GENDER_FIXTURE = Object.freeze([
  Object.freeze({
    id: 'fixture::ladder-male-bearer',
    text: 'He keeps the roll himself, and has since the last muster.',
    gender: 'male',
    expect: 'PASS',
  }),
  Object.freeze({
    id: 'fixture::ladder-female-bearer',
    text: 'He keeps the roll himself, and has since the last muster.',
    gender: 'female',
    expect: 'FAIL',
  }),
]);
