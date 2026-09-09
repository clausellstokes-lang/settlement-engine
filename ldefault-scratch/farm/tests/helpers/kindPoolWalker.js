/**
 * tests/helpers/kindPoolWalker.js — THE SHARED KIND-POOL WALKER TEMPLATE (SP-E).
 *
 * THE STRUCTURAL BLOCKER THIS REMOVES. Nine per-program kind-pool walkers live under
 * tests/lint today, and four of them (commercial, envoy, grammar, sovereignty) open with
 * a hand-TRANSCRIBED copy of the same three-row table:
 *
 *     const FLOOR_BY_SIGNIFICANCE = Object.freeze({ routine: 8, notable: 6, major: 4 });
 *
 * A transcription is a fork that has not drifted YET. Every later FP volume was on course
 * to paste a fifth, sixth and seventh copy, and the moment one of them mistypes a number
 * the estate has two frequency laws and no walker can tell which is the law. The cure is
 * the one bandFamilies.js already chose for the significance words themselves: derive,
 * never re-type. This module computes the floors ARITHMETICALLY from
 * `SIGNIFICANCE_CLASSES`' own rank, so the table has no second author.
 *
 * ── THE FREQUENCY-SCALED FLOOR, AND WHY IT INVERTS ──────────────────────────────
 *
 * The floor scales with how OFTEN a kind fires, not with how much it matters. A `major`
 * kind is by construction RARE — a reader meets it once a campaign, so four voices are
 * plenty. A `routine` kind is CHRONIC — a reader meets it every season, and four voices
 * become wallpaper by the second year. So the ladder runs BACKWARDS against significance
 * rank, which is exactly the shape a hand-typed table gets wrong:
 *
 *     routine (rank 0, chronic) -> 8      notable (rank 1) -> 6      major (rank 2, rare) -> 4
 *
 * Derived as `CHRONIC_FLOOR - rank * CADENCE_STEP`. The two constants are SP-E's §7 tuning
 * row ("the frequency-cadence class boundaries") and the owner signs them at the soak redo;
 * the SHAPE — one floor per class of the one family, descending by rank — is this module's.
 *
 * ── THE CONSTITUTION'S OWN SENTENCE, MADE MECHANICAL ────────────────────────────
 *
 * "A two-variant chronic kind is exactly as broken as an unregistered one." That is not a
 * figure of speech and this module refuses to let it be one: an unregistered kind is modelled
 * as a row with an EMPTY pool, and `floorReasons` therefore returns the identical typed
 * reason — `['starved']` — for both. tests/helpers/kindPoolWalker.test.js EXECUTES that
 * equality rather than asserting the sentence in a comment.
 *
 * ── WHY THE REASONS ARE A TYPED SET AND NEVER A BOOLEAN ─────────────────────────
 *
 * This estate has been bitten by the credit-side enumeration that FAILS OPEN: a guard that
 * answers "is this row OK?" with a boolean cannot see a clause that was deleted, and three
 * such guards passed all thirty-one of their arms with the load-bearing clause removed.
 * Every predicate here returns a SORTED ARRAY OF TYPED REASONS so a caller pins it with
 * `toEqual` and a deleted clause changes the value rather than merely relaxing a bound.
 *
 * PURE HELPER MODULE: no describe/test here. A test file's exports re-register its suites in
 * every importer (the tests/helpers/dormancyOracle.js incident) — the guard on this guard
 * lives in the sibling `.test.js`.
 */
import { SIGNIFICANCE_CLASSES, significanceRankOf } from '../../src/domain/worldPulse/bandFamilies.js';

/**
 * The chronic (rank-0) floor. SP-E §7 tuning row; owner-signed at the soak redo. The spine
 * states chronic as a RANGE (8-12) and this is its floor: a walker enforces the minimum the
 * corpus must never fall below, never the depth a content wave should aspire to.
 */
export const CHRONIC_FLOOR = 8;

/** Variants shed per step UP the significance ladder (rarer kind, shallower floor). */
export const CADENCE_STEP = 2;

/**
 * THE ONE FLOOR TABLE, DERIVED. Keyed by the significance family's own words, in the
 * family's own order — so a fourth class added to bandFamilies.js gets a floor here for
 * free, and no volume can author a fifth table.
 * @type {Readonly<Record<string, number>>}
 */
export const FREQUENCY_FLOORS = Object.freeze(Object.fromEntries(
  SIGNIFICANCE_CLASSES.map((cls) => [cls, CHRONIC_FLOOR - significanceRankOf(cls) * CADENCE_STEP]),
));

/**
 * The typed reasons a row can carry. Exported so a walker can pin a reason SET against this
 * closed vocabulary instead of matching on message text.
 * @type {readonly string[]}
 */
export const POOL_REASONS = Object.freeze([
  'desk-drift',
  'slot-arity',
  'starved',
  'unknown-significance',
  'unphrased',
]);

/**
 * @typedef {object} KindPoolRow
 * @property {string} kind
 * @property {string} significance
 * @property {readonly unknown[]} [pool]
 * @property {readonly unknown[]} [requiredSlots]
 * @property {string|null} [audience]
 * @property {string|null} [section]
 */

/**
 * @typedef {object} FloorOptions
 * @property {Readonly<Record<string, number>>} [floors]  override table (mutant harnesses only)
 * @property {Readonly<Record<string, number>>} [declaredExceptions]  classes OUTSIDE the
 *   significance family that a program has declared a floor for, with a written reason at the
 *   call site. GR-0's `n/a` is the live one: a dossier line or a DM chip files no Herald desk,
 *   so it has no significance class, yet a reader meets it as often as a notable kind.
 */

/**
 * The floor a kind's OWN significance class demands. Throws on a class that is neither in the
 * family nor declared — a silent fallback would file a starved kind at whatever depth the
 * fallback chose, which is the exact failure the derivation exists to prevent.
 * @param {string} significance
 * @param {FloorOptions} [options]
 * @returns {number}
 */
export function floorFor(significance, options = {}) {
  const table = options.floors || FREQUENCY_FLOORS;
  const declared = options.declaredExceptions || {};
  if (Object.hasOwn(table, significance)) return table[significance];
  if (Object.hasOwn(declared, significance)) return declared[significance];
  throw new Error(
    `kindPoolWalker.floorFor: unknown significance ${JSON.stringify(significance)} — the family is`
    + ` [${SIGNIFICANCE_CLASSES.join(', ')}]. Assign the kind to a class, or declare an explicit`
    + ' floor exception with a written reason at the call site.',
  );
}

/**
 * THE FREQUENCY-SCALED FLOOR PREDICATE, ALONE. Isolated from the registration joins below so
 * the constitution's "a two-variant chronic kind reds exactly as an unregistered one" can be
 * compared as a value: an unregistered kind is a row with no pool, and both land on
 * `['starved']` with nothing else in the set to make them differ.
 * @param {KindPoolRow} row
 * @param {FloorOptions} [options]
 * @returns {string[]} sorted typed reasons; `[]` when the row meets its own floor
 */
export function floorReasons(row, options = {}) {
  const significance = row?.significance;
  let floor;
  try {
    floor = floorFor(String(significance), options);
  } catch {
    return ['unknown-significance'];
  }
  const depth = Array.isArray(row?.pool) ? row.pool.length : 0;
  return depth < floor ? ['starved'] : [];
}

/**
 * The measured depth of a row's pool. An absent or non-array pool measures ZERO rather than
 * throwing: that is precisely the unregistered case, and it must flow through the same
 * arithmetic as a registered-but-shallow one.
 * @param {KindPoolRow} row
 * @returns {number}
 */
export function poolDepth(row) {
  return Array.isArray(row?.pool) ? row.pool.length : 0;
}

/**
 * @typedef {object} JoinReaders
 * @property {Record<string, unknown>} [phrases]  WHAT_PHRASES, for the reader-phrase join
 * @property {(kind: string) => string} [sectionOf]  SECTION_OF, for the desk-authority join
 * @property {Record<string, string>} [sectionAliases]  declared registry-section -> desk
 *   rewrites. The envoy family files `adjudication` rows at the `events` desk by design;
 *   naming the rewrite here keeps it a decision instead of a special case inside a loop.
 */

/**
 * THE FIVE L6 JOINS as one typed reason set: the frequency floor, the significance class, the
 * requiredSlots arity, the reader phrase, and the desk authority. A program's walker calls this
 * per row and pins the result with `toEqual([])`, so a NEW join failure changes the value
 * instead of merely failing a boolean that was already false for another reason.
 * @param {KindPoolRow} row
 * @param {JoinReaders} [joins]
 * @param {FloorOptions} [options]
 * @returns {string[]} sorted typed reasons
 */
export function registrationReasons(row, joins = {}, options = {}) {
  const reasons = new Set(floorReasons(row, options));
  const kind = String(row?.kind ?? '');

  if (Array.isArray(row?.pool) && Array.isArray(row?.requiredSlots)
    && row.requiredSlots.length !== row.pool.length) {
    reasons.add('slot-arity');
  }
  if (joins.phrases && !joins.phrases[kind]) reasons.add('unphrased');
  if (joins.sectionOf && row?.section != null) {
    const declared = joins.sectionAliases?.[String(row.section)] ?? String(row.section);
    if (joins.sectionOf(kind) !== declared) reasons.add('desk-drift');
  }
  return [...reasons].sort();
}

/**
 * Every row that fails its own floor, as violation ROWS rather than a count. L7's attribution
 * law: a walker reports WHICH kind at WHAT depth against WHICH floor, because a bare number
 * cannot be diffed against a base state and a colour cannot be attributed at all.
 * @param {Iterable<KindPoolRow>} rows
 * @param {FloorOptions} [options]
 * @returns {{ kind: string, significance: string, depth: number, floor: number|null }[]}
 */
export function floorViolations(rows, options = {}) {
  const out = [];
  for (const row of rows) {
    if (!floorReasons(row, options).length) continue;
    /** @type {number | null} */
    let floor;
    try {
      floor = floorFor(String(row?.significance), options);
    } catch {
      // An unknown class has NO floor to report. Null says so; a fabricated number would put
      // a fictional bound in a violation row a reviewer is meant to act on.
      floor = null;
    }
    out.push({
      kind: String(row?.kind ?? ''),
      significance: String(row?.significance ?? ''),
      depth: poolDepth(row),
      floor,
    });
  }
  return out.sort((a, b) => a.kind.localeCompare(b.kind));
}

/**
 * THE NEGATIVE CONTROLS, SHIPPED WITH THE TEMPLATE. Exported as data so every program's walker
 * executes the same two probes rather than each one inventing its own — and so a program that
 * copies this template cannot copy it WITHOUT its controls.
 *
 * `UNREGISTERED_PROBE` is the kind no registry holds. `CHRONIC_TWO_VARIANT_PROBE` is the kind a
 * registry DOES hold, at a depth a chronic reader exhausts in one season. The constitution says
 * they are the same defect; `floorReasons` says so in values.
 */
export const UNREGISTERED_PROBE = Object.freeze({
  kind: 'sp_e_unregistered_probe',
  significance: 'routine',
  pool: Object.freeze([]),
  requiredSlots: Object.freeze([]),
});

export const CHRONIC_TWO_VARIANT_PROBE = Object.freeze({
  kind: 'sp_e_chronic_two_variant_probe',
  significance: 'routine',
  pool: Object.freeze(['a first voice', 'a second voice']),
  requiredSlots: Object.freeze([[], []]),
});

/**
 * A chronic kind at exactly its floor — the POSITIVE control. Without it, a predicate that
 * returned `['starved']` for absolutely everything would satisfy both probes above and prove
 * nothing at all.
 */
export const CHRONIC_COMPLIANT_PROBE = Object.freeze({
  kind: 'sp_e_chronic_compliant_probe',
  significance: 'routine',
  pool: Object.freeze(Array.from({ length: CHRONIC_FLOOR }, (_, i) => `voice ${i + 1}`)),
  requiredSlots: Object.freeze(Array.from({ length: CHRONIC_FLOOR }, () => [])),
});
