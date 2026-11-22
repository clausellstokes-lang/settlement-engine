/**
 * domain/npc/characterEdit.js — THE EDIT SURFACE'S ADMISSION WALL AND ITS ONE
 * LAWFUL WRITER (W-LIVES car L8; DESIGN_W_LIVES.md §7, §2).
 *
 * WHAT THIS HOLDS. The authored core — `npc.character = { axes: { [axisId]:
 * {pole, level} } }` — is the USER'S half of a paradigm chart, and the engine is
 * forbidden to touch it (§2: what a life does to a soul lives in the drift map,
 * never here). This module is the ONE door through which that half is written,
 * and the wall a payload must clear to reach it.
 *
 * ── THE RECON THAT GATED THIS CAR, AND WHAT IT RULED ────────────────────────
 *
 * The design volume carried an undischarged RECON ROW since §798 ("confirm the
 * NPC edit surface — settlement editor vs compendium"), and the substrate wave
 * that cured the READ left the WRITER'S HOME undecided because of it. Walked
 * here with executed probes; the four findings that decided the shape below:
 *
 * 1. TWO EDIT DOORS EXIST AND THEY DISAGREE ON KEYING. The pending-edit QUEUE
 *    (`store/settlementPendingEditWriters.js#applyNpcOp`) is keyed on the roster
 *    id; the INLINE card path (`applyUserEditAction`, mounted from
 *    `components/new/npcComponents.jsx`) is keyed on the array INDEX.
 *    `QUEUE_WIRED_PROSE_PATHS` has NO `npc` entry at all, so NPC authoring is
 *    the inline path — which is what §7's "NPC authoring rides the
 *    settlement-editor path" resolves to on this tree.
 *
 * 2. ⛔ THE CHART MUST NOT JOIN `EDITABLE_FIELDS`, AND THE REASON IS EXECUTED,
 *    NOT STYLISTIC. That registry is "tightly scoped to PROSE ONLY" by its own
 *    header, and three consumers depend on it:
 *      • `settlementPendingEdits.js` compares with `getEffectiveValue(...) ===
 *        payload.value`. On an OBJECT that is reference equality, so it is
 *        ALWAYS false — the `no_effect` gate could never refuse a no-op and the
 *        `alreadyApplied` idempotence check could never report applied.
 *      • `walkUserEdits` -> `buildAiGroundingPayload().userEdits` would carry the
 *        whole chart object into the AI's PROSE grounding as if it were an
 *        authored sentence. Measured: it does, verbatim, without erroring.
 *      • the estate already parked `npc 'personality'` off the queue for exactly
 *        this shape reason (settlementPendingEdits.js's register).
 *    So the chart gets its OWN wall — this file — and stays out of both.
 *
 * 3. ⭐ REGEN SURVIVAL COSTS EXACTLY ONE FLAG, AND IT IS NOT `_userEdits`.
 *    `canonStatus.tagEntityCanon` promotes an entity carrying `_authored` to
 *    `{source:'user', canonStatus:'canon', locked:true}`, and
 *    `regenerationPolicy.PRESERVATION_RULES` rates `npc` at canon / canon /
 *    locked across nudge / rebalance / reforge. Executed end-to-end through the
 *    real `mergePreservedNpcs`: with `_authored` alone the chart survives all
 *    three modes; with NO marker it is destroyed in all three. That is why the
 *    writer below stamps `_authored` and nothing else — it buys the whole
 *    lifecycle without borrowing the prose registry's machinery.
 *
 * 4. THE AUTHORED CORE NEEDS NO UID. `npc.id` is POSITIONAL
 *    (`generators/npcGenerator.js` stamps `npc_${idx+1}`), and a preserved
 *    keeper INHERITS a fresh slot's id — measured, a keeper moved npc_3 -> npc_2
 *    while `npc_3` came to name a different person. Every id-keyed SIDECAR is
 *    exposed to that rebind (which is why L2 moved drift onto npcLedger's
 *    durable `wnpc_` identity and why `regenIdentityFold.js` exists). The core
 *    is immune BY CONSTRUCTION: it lives ON the record, so it travels with the
 *    person through the substitution and has no key to be re-bound.
 *
 * ── LIFECYCLE, WALKED (create / read / persist / regen / undo / import) ──────
 *
 * CREATE + READ: here. PERSIST + UNDO: `snapshotSettlement` is a deep JSON clone
 * with `versionHistory` stripped — carried. IMPORT: `normalizeSettlement` (the
 * settlementMigrations chain) carries unknown npc keys through untouched.
 * REGEN: finding 3. MIGRATE: nothing owed — the save row is
 * `data jsonb not null, -- full settlement JSON` (migration 001) with no
 * per-npc-key CHECK anywhere, so this is JS-side additive.
 *
 * ⚠ DELIBERATELY NOT CURED, documented so nobody re-finds it: the chart does NOT
 * survive a GALLERY publish/import round trip. `display/publicSafe.js` reduces
 * every NPC to an 11-key allowlist whose client literal is byte-pinned to the
 * SQL `npc_allowed` array (migrations 130/142/189). Admitting `character` there
 * is a privacy-posture decision AND a SQL migration — OWNER-GATED, and keeping
 * it out is precisely what keeps this car additive.
 *
 * ── THE RECONCILE SEAM ──────────────────────────────────────────────────────
 *
 * A sibling line cured the three hand-spelled reads of this key into ONE
 * accessor, `authoredCharacterOf`, exported from `characterDrift.js`. That
 * accessor is UNLANDED on this base, so it is NAMED here and NOT imported — the
 * `characterDrift.js` idiom for L1's unlanded catalog, and the reason
 * `CHART_WRITER_SEAM` below exists: at the reconcile the two halves meet at one
 * address instead of being searched for. See the seam's own note.
 *
 * PURE. No store, no clock, no PRNG, no React, no I/O, NO MUTATION — a caller's
 * npc is never written through; the writer returns the SAME reference when
 * nothing changed and a new object when something did.
 *
 * DARK: nothing in `src/` imports this module. The mount is a later car.
 *
 * @see docs/DESIGN_W_LIVES.md §2, §7
 * @enforced-by tests/domain/npc/characterEdit.test.js
 */

import { compareCodepoint } from '../deterministicSort.js';
import { AXIS_LEVELS, positionValue } from './characterDrift.js';

/** The roster-record key the authored core lives under (DESIGN_W_LIVES §2). */
export const AUTHORED_CHART_KEY = 'character';

/**
 * The flag the canon tagger reads, and the ONE thing this writer stamps.
 * Spelled as a constant so a second writer can never invent a second spelling of
 * the marker that buys regen survival.
 */
export const AUTHORED_MARKER_KEY = '_authored';

/** The two sides of every axis. Neutral is the ABSENCE of a pole, never a third word. */
export const AXIS_POLES = Object.freeze(['virtue', 'vice']);

/**
 * ⭐ THE RECONCILE SEAM — the meeting point of this car's WRITE half and the
 * substrate line's READ half.
 *
 * The sibling cure folded every read of the authored core into one accessor,
 * `authoredCharacterOf(entity)` in `characterDrift.js`. It does not exist on this
 * base, so importing it would make this car unbuildable alone (the same reason
 * `characterDrift.js` MIRRORS L1's `AXIS_LEVELS` instead of importing
 * `paradigmAxisCatalog.js`). At the reconcile, `writeAuthoredChart` becomes that
 * accessor's writer-half and the pair is the single-writer/single-reader module
 * for this key; nothing else in `src/` may spell `.character` on an npc.
 *
 * Named in code so the reconcile has an ADDRESS rather than a search.
 */
export const CHART_WRITER_SEAM = Object.freeze({
  readerModule: 'src/domain/npc/characterDrift.js',
  readerSymbol: 'authoredCharacterOf',
  readerLanded: false,
  writerModule: 'src/domain/npc/characterEdit.js',
  writerSymbol: 'writeAuthoredChart',
  note: 'UNLANDED on this base and therefore NAMED, never imported. At the '
    + 'reconcile the reader and this writer are the one module pair that may '
    + 'spell npc.character.',
});

/**
 * The CLOSED refusal vocabulary. Closedness is the point: a caller renders a
 * reason, and a reason invented at a call site is a reason no surface can
 * translate. Every refusal below is one of these.
 */
export const CHART_REFUSALS = Object.freeze([
  'chart_not_an_object',
  'axes_not_an_object',
  'axis_unnamed',
  'axis_unknown',
  'position_malformed',
  'position_incomplete',
  'pole_unknown',
  'level_unknown',
  'npc_not_an_object',
]);

/**
 * Provenance, in the module, so a reader who arrives at the code before the docs
 * learns the signature status here (the L1/L2 idiom).
 */
export const CHART_EDIT_PROVENANCE = Object.freeze({
  status: 'STRUCTURE DECIDED; the axis roster itself is owner-taste and UNSIGNED',
  signedBy: null,
  wallRuling: 'the chart does NOT join EDITABLE_FIELDS. See finding 2 in the header',
  markerRuling: '_authored alone buys regen survival in all three modes (executed)',
  ownerRows: Object.freeze([
    'the axis roster (DESIGN_W_LIVES §1.1 is a DRAFT for the pen): until it is '
      + 'signed, admission without an injected roster is SHAPE-ONLY and says so',
    'whether clearing a chart back to all-neutral should un-canon the NPC. This '
      + 'writer NEVER clears the marker: it cannot know whether a prose edit set '
      + 'it, and over-preserving a soul is the safe direction',
  ]),
  consumers: 'NONE by design; the mount is a later car',
});

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {boolean} */
function isPlainObject(v) {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

/**
 * @param {string} reason a CHART_REFUSALS member
 * @param {string} [axisId] the axis the refusal is about, when it is about one
 * @returns {{ok: false, reason: string, axisId: string}}
 */
function refuse(reason, axisId = '') {
  return { ok: false, reason, axisId };
}

/**
 * ⭐ THE WALL. Validate and NORMALIZE an authored chart, fail-closed.
 *
 * ALL-NEUTRAL IS LEGAL (§7: "the user sets any position at any band on any axes,
 * all-neutral legal"), and it normalizes to `{axes:{}}` — sparsity is structural
 * here, exactly as it is in the drift map, so a soul the user deliberately left
 * blank is byte-identical to one nobody ever opened.
 *
 * A HALF-SPELLED POSITION IS REFUSED, NOT NEUTRALIZED. `{pole:'virtue'}` with no
 * level reads as NEUTRAL through `positionValue` (the rung lookup misses), so
 * silently admitting it would throw the user's stated pole away and show them a
 * neutral axis they just set. `{}` is a different thing — an explicitly EMPTY
 * cell, which is what neutral looks like — and is admitted and dropped.
 *
 * NORMALIZATION IS A REDUCTION: every admitted cell is rebuilt as exactly
 * `{pole, level}` in that order, and axis keys are codepoint-ordered, so two
 * charts that mean the same thing serialize to the same bytes and no unknown
 * sibling key can ride in on a cell.
 *
 * @param {unknown} chart the candidate `{axes:{...}}`
 * @param {Object} [options]
 * @param {readonly string[]|null} [options.axes] the authorised axis roster (L1's
 *   catalog, injected — it is UNLANDED on this base, so this module never
 *   imports it). Omitted ⇒ admission is SHAPE-ONLY and `rosterChecked` is false.
 * @returns {{ok: true, chart: {axes: Record<string, {pole: string, level: string}>},
 *   rosterChecked: boolean, neutralAxisIds: readonly string[]}
 *   | {ok: false, reason: string, axisId: string}}
 */
export function admitAuthoredChart(chart, options = {}) {
  if (!isPlainObject(chart)) return refuse('chart_not_an_object');
  const rawAxes = /** @type {Record<string, unknown>} */ (chart).axes;
  if (rawAxes !== undefined && !isPlainObject(rawAxes)) return refuse('axes_not_an_object');

  const roster = Array.isArray(options.axes) ? options.axes.map(String) : null;
  const source = asObject(rawAxes);
  /** @type {Record<string, {pole: string, level: string}>} */
  const axes = {};
  /** @type {string[]} */
  const neutral = [];

  for (const axisId of Object.keys(source).sort(compareCodepoint)) {
    if (!axisId.trim()) return refuse('axis_unnamed', axisId);
    if (roster && !roster.includes(axisId)) return refuse('axis_unknown', axisId);

    const cell = source[axisId];
    if (!isPlainObject(cell)) return refuse('position_malformed', axisId);
    const { pole, level } = /** @type {{pole?: unknown, level?: unknown}} */ (cell);

    // An explicitly EMPTY cell is how neutral is spelled; drop it into sparsity.
    if (pole === undefined && level === undefined) { neutral.push(axisId); continue; }
    // Anything half-spelled is a stated intention this module refuses to lose.
    if (pole === undefined || level === undefined) return refuse('position_incomplete', axisId);
    if (!AXIS_POLES.includes(/** @type {string} */ (pole))) return refuse('pole_unknown', axisId);
    if (!AXIS_LEVELS.includes(/** @type {string} */ (level))) return refuse('level_unknown', axisId);

    axes[axisId] = { pole: /** @type {string} */ (pole), level: /** @type {string} */ (level) };
  }

  return {
    ok: true,
    chart: { axes },
    rosterChecked: roster !== null,
    neutralAxisIds: Object.freeze(neutral),
  };
}

/**
 * Are two admitted charts the same claim? Both sides are already reductions with
 * codepoint-ordered keys and exactly `{pole, level}` cells, so a serialization
 * compare is an EQUALITY here rather than the usual approximation of one.
 *
 * ⚠ This is why the writer admits BOTH sides before comparing. Comparing a raw
 * stored chart against an admitted one would compare bytes that mean the same
 * thing and call them different — and comparing with `===`, which is what the
 * prose queue does, is reference equality and is always false on an object.
 *
 * @param {unknown} a @param {unknown} b @returns {boolean}
 */
function sameClaim(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * ⭐ THE ONE LAWFUL WRITER of `npc.character`.
 *
 * Admits, then writes, then stamps the canon marker — in that order, so a
 * refused payload can never leave a marker behind on a record it did not change.
 *
 * NON-MUTATING, and returns the SAME npc reference when the claim did not move,
 * so a caller's change detector cannot be defeated by a no-op write (the
 * `characterDrift.js` / `regenIdentityFold.js` contract, kept here so the two
 * halves of one chart behave the same way).
 *
 * SIBLING KEYS ON `character` ARE PRESERVED. The core is `{axes}` today, and
 * `effectiveCharacter` spreads the core before overwriting `axes` for exactly
 * this reason: a future sibling key belongs to whoever minted it, and a writer
 * that silently dropped it would be destroying authored data to tidy a shape.
 *
 * THE MARKER IS NEVER CLEARED. Writing an all-neutral chart leaves `_authored`
 * exactly as it found it: this module cannot know whether a prose edit set it,
 * and un-canonning an NPC would hand them back to the next reroll. Over-
 * preserving is the safe direction, and it is an owner row above.
 *
 * @param {unknown} npc the roster record (never written through)
 * @param {unknown} chart the candidate authored chart
 * @param {Object} [options]
 * @param {readonly string[]|null} [options.axes] the authorised axis roster; see
 *   `admitAuthoredChart`
 * @returns {{ok: true, npc: Record<string, unknown>, changed: boolean, rosterChecked: boolean}
 *   | {ok: false, reason: string, axisId: string, npc: unknown, changed: false}}
 */
export function writeAuthoredChart(npc, chart, options = {}) {
  if (!isPlainObject(npc)) return { ...refuse('npc_not_an_object'), npc, changed: false };

  const admitted = admitAuthoredChart(chart, options);
  if (admitted.ok !== true) {
    // REBUILT, NOT SPREAD. Spreading the refusal would carry `chart` and
    // `neutralAxisIds` into a result that admitted nothing — a refusal shaped like
    // a success is the kind of thing a caller reads past.
    const failed = /** @type {{reason: string, axisId: string}} */ (/** @type {unknown} */ (admitted));
    return { ok: false, reason: failed.reason, axisId: failed.axisId, npc, changed: false };
  }

  const record = /** @type {Record<string, unknown>} */ (npc);
  const existingCore = asObject(record[AUTHORED_CHART_KEY]);
  const existing = admitAuthoredChart({ axes: existingCore.axes }, {});
  const unchanged = existing.ok
    && sameClaim(existing.chart.axes, admitted.chart.axes)
    && record[AUTHORED_MARKER_KEY] === true;

  if (unchanged) {
    return { ok: true, npc: record, changed: false, rosterChecked: admitted.rosterChecked };
  }

  return {
    ok: true,
    npc: {
      ...record,
      [AUTHORED_CHART_KEY]: { ...existingCore, axes: admitted.chart.axes },
      [AUTHORED_MARKER_KEY]: true,
    },
    changed: true,
    rosterChecked: admitted.rosterChecked,
  };
}

/**
 * The authored core as this module reads it — the WRITE half's own read, so the
 * writer never has to spell `.character` twice and a caller can ask what is
 * stored without reaching past the wall.
 *
 * ⚠ NOT a second home for the substrate line's `authoredCharacterOf`: that one
 * is the READER every consumer routes through, and this one exists only because
 * it is UNLANDED here (see `CHART_WRITER_SEAM`). At the reconcile this body
 * becomes a call to it and this comment is what tells the reconciler so.
 *
 * @param {unknown} npc @returns {Record<string, unknown>}
 */
export function storedChartOf(npc) {
  return asObject(asObject(npc)[AUTHORED_CHART_KEY]);
}

/**
 * The authored positions as the continuous signed values every downstream order
 * reads, for the axes the soul actually holds. Delegates the arithmetic to
 * `positionValue` so the edit surface and the read model can never disagree
 * about what `marked vice` is worth.
 *
 * @param {unknown} npc @returns {Record<string, number>}
 */
export function authoredValuesOf(npc) {
  const axes = asObject(storedChartOf(npc).axes);
  /** @type {Record<string, number>} */
  const values = {};
  for (const axisId of Object.keys(axes).sort(compareCodepoint)) {
    values[axisId] = positionValue(
      /** @type {{pole?: 'virtue'|'vice', level?: string}} */ (axes[axisId]),
    );
  }
  return values;
}
