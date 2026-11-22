/**
 * domain/npc/characterEditView.js — THE EDIT VIEW'S MODEL: THE WHOLE CHART, WITH
 * A READ-ONLY DRIFT GHOST BESIDE THE AUTHORED CORE (W-LIVES car L8;
 * DESIGN_W_LIVES.md §7).
 *
 * THE OWNER ARCHITECTURE THIS IMPLEMENTS, VERBATIM: "the edit view renders the
 * WHOLE chart with a read-only drift GHOST beside the authored core." §7 spells
 * the rest — "every axis on its spectrum, most at neutral; the user sets any
 * position at any band on any axes (all-neutral legal). For NPCs the pen moves
 * the CORE; a read-only ghost shows the drifted effective position beside the
 * anchor — drift made visible exactly where the user authors. Gods: same chart,
 * no ghost."
 *
 * ── WHY THIS IS A MODEL AND NOT A COMPONENT ─────────────────────────────────
 *
 * Three reasons, and the third is the load-bearing one.
 *
 * 1. It is testable as arithmetic. A component would need a mount, a route and a
 *    store to assert that a ghost sits where the drift put it.
 * 2. It stays out of the first-paint closure. The estate re-parents heavy domain
 *    modules into the eager chunk whenever an eager surface imports them (the
 *    lesson `regenerationPolicy.js`'s header records); a leaf with no React
 *    cannot be dragged anywhere.
 * 3. ⭐ IT KEEPS THE CAR DARK WITHOUT A FLAG. There is no route to light, no
 *    toggle to leave off and no config to default. Nothing in `src/` imports
 *    this file, so the whole car is inert by ABSENCE rather than by a switch
 *    somebody could flip — which is a stronger dormancy claim than a flag,
 *    because a flag can be turned on by accident and an unimported module
 *    cannot. The mount is a later car.
 *
 * ── THE GHOST IS READ-ONLY BY CONSTRUCTION, NOT BY CONVENTION ───────────────
 *
 * A row carries the ghost as VALUES. There is no setter, no path, no axis handle
 * and no writer anywhere in this module — the one lawful writer is
 * `characterEdit.js#writeAuthoredChart`, and it takes a CHART, never a row. So a
 * surface that wanted to let the user drag the ghost would have to invent a
 * write path this module does not give it, rather than merely forget to disable
 * a control. That is the difference between a guarantee and a habit.
 *
 * ── "THE WHOLE CHART" NEEDS A ROSTER, AND THE ROSTER IS INJECTED ────────────
 *
 * §7's "every axis on its spectrum, MOST AT NEUTRAL" is a claim about a ROSTER:
 * the neutral rows are the axes the soul does NOT hold, and a chart alone cannot
 * name them. That roster is car L1's `paradigmAxisCatalog.js`, which is UNLANDED
 * on this base — so it is INJECTED, exactly as `characterReadModel.js` injects
 * L1's `wordForAxisPosition` as `project` rather than importing it.
 *
 * ⚠ AND THE MODEL SAYS WHICH IT GOT. Without a roster the rows are the UNION of
 * the axes the soul holds and the axes it has drifted on — an honest chart of
 * this person, but NOT "the whole chart", and `whole` is false so no caller can
 * mistake the second for the first. An edit view that silently showed a soul
 * only the axes they had already set would be an edit view the user could never
 * author a NEW position on, and it would look completely correct.
 *
 * ── ARITHMETIC IS BORROWED, NEVER RE-SPELLED ────────────────────────────────
 *
 * `effectiveCharacter` (the §4 chokepoint) composes the ghost and `positionValue`
 * values it. Nothing here computes a position: a second opinion about what
 * `marked vice` is worth is the exact defect the chokepoint exists to prevent,
 * and an edit surface holding one would show the user a different person from
 * the one every consumer sees.
 *
 * PURE. No store, no clock, no PRNG, no React, no I/O, no mutation. Every row and
 * every model is frozen, and axes are codepoint-ordered so two calls over the
 * same soul cannot disagree about row order.
 *
 * DARK: nothing in `src/` imports this module.
 *
 * @see docs/DESIGN_W_LIVES.md §7
 * @enforced-by tests/domain/npc/characterEdit.test.js
 */

import { compareCodepoint } from '../deterministicSort.js';
import { AXIS_LEVELS, NEUTRAL_POSITION, effectiveCharacter, positionValue } from './characterDrift.js';
import { AXIS_POLES, storedChartOf } from './characterEdit.js';

/**
 * The position a row shows when a soul holds no opinion on an axis. FROZEN and
 * shared: every neutral row is the same object, so a renderer comparing rows by
 * identity gets the answer it expects and the model cannot leak a mutable cell.
 */
export const NEUTRAL_POSITION_CELL = Object.freeze({ pole: '', level: '', value: NEUTRAL_POSITION });

/**
 * The spectrum a row is drawn on, ascending from the vice extreme to the virtue
 * extreme — the ladder the UI lays a control across. DERIVED from the authored
 * vocabulary rather than authored again, so a fourth band would widen the
 * control without anyone editing this file.
 * @type {readonly Readonly<{pole: string, level: string, value: number}>[]}
 */
export const SPECTRUM_RUNGS = Object.freeze([
  // The vice side runs from its EXTREME inward, so the ladder reads left to right
  // as one continuous journey rather than as two lists meeting in the middle.
  ...[...AXIS_LEVELS].reverse().map((level) => Object.freeze({
    pole: 'vice', level, value: -(AXIS_LEVELS.indexOf(level) + 1),
  })),
  NEUTRAL_POSITION_CELL,
  ...AXIS_LEVELS.map((level, i) => Object.freeze({ pole: 'virtue', level, value: i + 1 })),
]);

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {number} a finite number, or 0 */
function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * One authored `{pole, level}` as the cell a row carries: the pair plus the
 * signed value, so a renderer can place a control without re-deriving the
 * arithmetic and a test can assert the placement without parsing words.
 * @param {unknown} position @returns {Readonly<{pole: string, level: string, value: number}>}
 */
function cellOf(position) {
  const p = asObject(position);
  const pole = String(p.pole ?? '');
  const level = String(p.level ?? '');
  if (!AXIS_POLES.includes(pole) || !AXIS_LEVELS.includes(level)) return NEUTRAL_POSITION_CELL;
  // The two guards above ARE the narrowing; the cast states what they proved.
  const authored = /** @type {{pole: 'virtue'|'vice', level: string}} */ ({ pole, level });
  return Object.freeze({ pole, level, value: positionValue(authored) });
}

/**
 * The axes a row set covers: the injected roster when there is one, otherwise
 * the union of what the soul HOLDS and what it has DRIFTED on.
 *
 * The union half matters more than it looks: an axis a life pushed a soul onto
 * has no authored cell at all, so a chart-only walk would leave the ghost with
 * nowhere to stand and the drift would be invisible in the one view whose entire
 * purpose is to show it.
 *
 * @param {unknown} npc @param {unknown} drift @param {readonly string[]|null} roster
 * @returns {string[]} codepoint-ordered
 */
function axisIdsFor(npc, drift, roster) {
  if (roster) return roster.map(String).slice().sort(compareCodepoint);
  const held = Object.keys(asObject(storedChartOf(npc).axes));
  const moved = Object.keys(asObject(drift));
  return [...new Set([...held, ...moved])].sort(compareCodepoint);
}

/**
 * @typedef {Object} EditChartRow
 * @property {string} axisId
 * @property {Readonly<{pole: string, level: string, value: number}>} core   the AUTHORED anchor — the only half the pen moves
 * @property {Readonly<{pole: string, level: string, value: number}>|null} ghost  the effective position, or null when this view carries no ghost
 * @property {number} offset      the stored drift offset in bands, 0 when undrifted
 * @property {boolean} drifted    a stored offset exists for this axis
 * @property {boolean} displaced  the ghost stands on a DIFFERENT band from the core
 * @property {boolean} neutral    the authored anchor holds no pole
 */

/**
 * ⭐ THE WHOLE CHART, ROW BY ROW.
 *
 * Every axis in scope gets a row whether or not the soul holds a position on it —
 * that is what "every axis on its spectrum, most at neutral" means, and it is the
 * difference between an authoring surface and a summary.
 *
 * @param {Object} args
 * @param {unknown} args.npc the roster record (or any entity carrying `character`)
 * @param {Record<string, {offset?: number}>|null|undefined} [args.drift] the drift
 *   entry for THIS soul — the shape `effectiveCharacter` takes, so the caller
 *   passes what `driftEntryOf` returned and this module needs no world state
 * @param {readonly string[]|null} [args.axes] the axis roster; see the header
 * @param {boolean} [args.ghost] false for a surface with no ghost half (§7: "Gods:
 *   same chart, no ghost"). Default true.
 * @returns {readonly EditChartRow[]}
 */
export function editChartRows({ npc, drift, axes = null, ghost = true }) {
  const roster = Array.isArray(axes) ? axes : null;
  const entry = asObject(drift);
  const authored = asObject(storedChartOf(npc).axes);
  // The chokepoint composes the ghost. Absent drift it returns the authored core
  // BY REFERENCE, so an undrifted soul costs no construction here either.
  const effective = ghost
    ? asObject(asObject(effectiveCharacter(
      /** @type {{character?: unknown}|null|undefined} */ (npc),
      /** @type {Record<string, {offset: number, updatedTick: number}>} */ (entry),
    )).axes)
    : {};

  return Object.freeze(axisIdsFor(npc, entry, roster).map((axisId) => {
    const core = cellOf(authored[axisId]);
    const drifted = Object.prototype.hasOwnProperty.call(entry, axisId);
    const ghostCell = ghost ? cellOf(effective[axisId]) : null;
    return Object.freeze({
      axisId,
      core,
      ghost: ghostCell,
      offset: drifted ? num(asObject(entry[axisId]).offset) : 0,
      drifted,
      // DISPLACED IS A BAND COMPARISON, NOT AN OFFSET TEST. A sub-band offset
      // moves the value without moving the band, and a ghost drawn as "displaced"
      // while it stands on the core's own rung would be telling the user a life
      // changed somebody when it has not yet.
      displaced: !!ghostCell && ghostCell.value !== core.value,
      neutral: core.value === NEUTRAL_POSITION,
    });
  }));
}

/**
 * @typedef {Object} EditChartModel
 * @property {readonly EditChartRow[]} rows
 * @property {boolean} whole        the rows are a ROSTER, not just this soul's own axes
 * @property {boolean} authored     the soul carries at least one authored position
 * @property {boolean} ghostVisible at least one row's ghost stands off its anchor
 * @property {readonly string[]} displacedAxisIds
 * @property {readonly string[]} driftedAxisIds
 */

/**
 * The edit view's whole model: the rows plus the four questions a surface asks
 * before it draws anything.
 *
 * `authored` and `ghostVisible` are deliberately DIFFERENT questions. A soul may
 * carry no authored position and still have drifted (a life taught somebody
 * something the user never wrote down), and the view must be able to say so —
 * an "unedited" badge driven off the ghost would call that soul untouched.
 *
 * @param {Object} args see `editChartRows`
 * @param {unknown} args.npc
 * @param {Record<string, {offset?: number}>|null|undefined} [args.drift]
 * @param {readonly string[]|null} [args.axes]
 * @param {boolean} [args.ghost]
 * @returns {Readonly<EditChartModel>}
 */
export function editChartModel({ npc, drift, axes = null, ghost = true }) {
  const rows = editChartRows({ npc, drift, axes, ghost });
  return Object.freeze({
    rows,
    whole: Array.isArray(axes),
    authored: rows.some((row) => !row.neutral),
    ghostVisible: rows.some((row) => row.displaced),
    displacedAxisIds: Object.freeze(rows.filter((row) => row.displaced).map((row) => row.axisId)),
    driftedAxisIds: Object.freeze(rows.filter((row) => row.drifted).map((row) => row.axisId)),
  });
}
