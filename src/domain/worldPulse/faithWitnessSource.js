/**
 * domain/worldPulse/faithWitnessSource.js — THE FAITH PULL AS A WITNESS-PLANE
 * SOURCE (W-FAITH D5(2), car F3c act 2b, registered under §806/F14).
 *
 * The influence field beside this file moves SETTLEMENT CHANNELS. This one moves
 * PEOPLE, and the split is the volume's own risk #1 made structural:
 *
 *   • boon / bane  → settlement effect channels          (`faithField.js`)
 *   • the deity's authored CHARACTER → the witness plane  (this file)
 *
 * Nothing is carried on both roads, so neither can restate the other. In particular
 * the TEMPER never reaches a channel: it already has exactly one mechanical
 * coupling, the signed warlike drive in `disposition.js`, and a second would be the
 * double-count D1 forbids wearing a new subsystem's clothes.
 *
 * ⛔⛔ THE FUNNEL IS NOT IN THIS TREE, AND THAT IS THE CENTRAL FACT ABOUT THIS FILE.
 * `foldLivedExperience`, `EXPERIENCE_TABLE` and `livedExperienceSources.js` live on
 * W-LIVES's stack (L2+L3+L4). This adapter therefore produces the funnel's INTAKE
 * SHAPE without importing it, and every vocabulary it shares with the funnel is
 * MIRRORED under a reconcile pin that flips to a live equality the moment the two
 * cars share a tree (§863's consist). See `tests/domain/faithWitnessSource.test.js`.
 *
 * ⛔ AND ONE DEBT IS OWED OUT OF THIS TREE. There is NO faith-exposure kind in the
 * funnel's closed 31-kind vocabulary: `god_fortunes_rose/fell` are receipted but
 * already carry L4 adapters (the §856 non-overlap pin forbids reuse), and
 * `dwell_milieu` — the one receipted AMBIENT kind — is roads-owned. So
 * `FAITH_WITNESS_KIND` below is a kind this car MINTS and the other stack's catalog
 * must ADMIT. Until it does, this adapter's output is refused at the funnel door by
 * construction, which is the correct dormant state; the reconcile pin is what makes
 * the debt impossible to forget.
 *
 * ── F9 AS AMENDED (§853), SATISFIED STRUCTURALLY RATHER THAN REMEMBERED ─────────
 * Ambient sources emit at INTERVAL CADENCE with TIME-INTEGRATED magnitude; no source
 * may emit per-tick sub-floor pulls; no sub-floor accumulator state exists. This
 * adapter obeys all three by ARITHMETIC, not by discipline:
 *
 *   1. It integrates time itself — `cadences = floor(dweltTicks / AMBIENT_CADENCE)`
 *      — and emits NOTHING below one whole cadence. A soul who has dwelt eleven
 *      weeks among a faith has not yet been marked by it.
 *   2. It declares `spanTicks = cadences × AMBIENT_CADENCE`, a whole multiple. The
 *      funnel scales magnitude by `spanTicks / AMBIENT_CADENCE`, so the scale is an
 *      INTEGER ≥ 1 and the smallest thing this source can ever produce is exactly
 *      one `faint` band — the materialization floor itself, never under it.
 *      ⭐ That is why this file names no epsilon: expressed entirely in the closed
 *      band vocabulary, it cannot disagree with the funnel about a number it never
 *      spells. A sub-floor pull is not merely unemitted here, it is NOT
 *      CONSTRUCTIBLE.
 *   3. It holds no state at all. Dwell arrives from the caller; nothing accumulates
 *      here between calls.
 *
 * ⚠ THE MAGIC GATE DOES NOT APPLY HERE, AND THE ASYMMETRY IS DELIBERATE. D3 gates
 * boon and bane because they are MECHANICAL terms, and says they "survive as
 * cultural emphasis in prose only" where magic is dead. A god's character working on
 * the people who live among its priests IS that cultural emphasis. Gating it would
 * delete the very thing D3 says survives.
 *
 * ── THE WRATHFUL SHARPENING (W-FAITH F5c) ───────────────────────────────────────
 * A deity holding the TEMPER vice position (wrathful, under `deityFlaws.js`'s
 * candidate table) is felt MORE KEENLY while its faith fortunes fall: that one
 * pull's exposure demotion is reduced by one rung, floored at 0, so the authored
 * level stays a hard ceiling (§856's ladder law, held by arithmetic). The fortunes
 * arrive as an OPTIONAL `pantheon` argument — the per-deity ledger
 * (`worldState.pantheon`), handed in by the caller exactly as the seed is, never
 * guessed off a settlement. Absent, nothing sharpens and every pre-flaw caller is
 * byte-identical. Per-position attachment is literal: the sharpening rides the
 * TEMPER:vice token itself, and every other pull of the same god keeps its plain
 * exposure demotion.
 *
 * PURE: no rng, no wall-clock, no mutation, codepoint-ordered output.
 */
import { INTERVAL_WEEKS } from './intervalWeeks.js';
import { AXIS_LEVELS } from '../npc/paradigmAxisCatalog.js';
import { pietyMultOf } from './piety.js';
import { memberWeight } from './faithField.js';
import { wrathSharpenedDemotion } from './deityFlaws.js';
import { FAITH_WITNESS_TUNING } from './faithTuningSurface.js';

/**
 * THE KIND THIS CAR MINTS AND THE OTHER STACK'S CATALOG MUST ADMIT.
 *
 * Named for the row it stands beside: `dwell_milieu` is what a settlement's conduct
 * teaches a soul who lives in it; `faith_milieu` is what its GODS do. Witness plane,
 * `milieu` family, ambient — the same shape, a different teacher.
 */
export const FAITH_WITNESS_KIND = 'faith_milieu';

/** The plane and family this kind must be admitted under. Mirrored; pinned. */
export const FAITH_WITNESS_PLANE = 'witness';
export const FAITH_WITNESS_FAMILY = 'milieu';

/**
 * The ambient cadence, IMPORTED rather than mirrored — `intervalWeeks.js` exists in
 * this tree, so the 13 is the estate's own constant and not a second copy of it.
 * One season: the funnel's `AMBIENT_CADENCE_TICKS` is this same expression.
 */
export const AMBIENT_CADENCE_TICKS = INTERVAL_WEEKS.one_season;

/**
 * The funnel's pull bands, ascending. MIRRORED from `livedExperienceCatalog`'s
 * `PULL_BANDS` (not in this tree) and pinned against `AXIS_LEVELS`, which IS —
 * the two ladders are three rungs each and the adapter maps rung-for-rung.
 * @type {readonly string[]}
 */
export const PULL_BANDS = Object.freeze(['faint', 'firm', 'heavy']);

/**
 * W-FAITH F6c — THE TUNING MOVED TO THE SIGNATURE SURFACE. `FAITH_WITNESS_TUNING`
 * (FULL_EXPOSURE, PART_EXPOSURE — owner-unsigned candidates, §763) now lives in
 * `faithTuningSurface.js`, the one file the owner's pen edits, and is re-exported
 * here VERBATIM — the same object, not a copy — so every existing import path still
 * resolves. The step-DOWN ladder law (§856) and its notes moved with the thresholds.
 */
export { FAITH_WITNESS_TUNING };

/** @typedef {import('../settlement.schema.js').SimSettlement} SimSettlement */
/** @typedef {import('./faithField.js').FaithMember} FaithMember */
/** @typedef {import('./faithField.js').FaithReligionState} FaithReligionState */
/** @typedef {{ axisId: string, pole: string, band: string }} WitnessPull */
/** @typedef {{ kind: string, plane: string, settlementId: string, settlementSeed: string, npc: Record<string, unknown>, eventId: string, spanTicks: number, pulls: readonly WitnessPull[] }} WitnessEntry */

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v : '');

/**
 * The authored chart positions of a deity snapshot, as a list.
 *
 * ⚠ `characterAxes` IS `string-or-string-list` (act 1's J1 — the one embed key that
 * travels without `String()` coercion, precisely so a list survives as a list). A
 * reader that assumed a string would silently see `'A:virtue:marked,B:vice:a_touch'`
 * as one malformed token and teach nothing; a reader that assumed a list would miss
 * every single-position deity. Both shapes are read here.
 *
 * @param {Record<string, unknown> | null | undefined} snapshot
 * @returns {string[]}
 */
function chartPositions(snapshot) {
  const raw = snapshot?.characterAxes;
  if (typeof raw === 'string') return raw ? [raw] : [];
  if (Array.isArray(raw)) return raw.filter((t) => typeof t === 'string' && t);
  return [];
}

/**
 * One `AXIS:pole:level` token as a funnel pull, at an exposure-demoted band.
 *
 * Returns null when the token is malformed OR when exposure demotes the lesson below
 * the floor — declining to emit rather than emitting something the funnel would
 * refuse. ⭐ "A truly faint exposure honestly never marks" (§853) is enforced HERE,
 * at the source, which is exactly where the amended F9 puts it.
 *
 * @param {string} token
 * @param {number} demotion how many rungs exposure takes off the authored level
 * @returns {WitnessPull | null}
 */
function pullFromPosition(token, demotion) {
  const parts = String(token).split(':');
  if (parts.length !== 3) return null;
  const [axisId, pole, level] = parts;
  // Set membership on every field — an authored value outside the closed vocabulary
  // teaches nothing rather than being coerced into a band.
  if (!axisId || (pole !== 'virtue' && pole !== 'vice')) return null;
  const authoredRung = AXIS_LEVELS.indexOf(level);
  if (authoredRung < 0) return null;
  const rung = authoredRung - demotion;
  if (rung < 0) return null;                       // below the floor ⇒ silence
  return Object.freeze({ axisId, pole, band: PULL_BANDS[rung] });
}

/**
 * How many rungs a given exposure takes off the authored level.
 * @param {number} exposure `memberWeight × pietyMult`
 * @returns {number} 0, 1 or 2
 */
export function exposureDemotion(exposure) {
  if (exposure >= FAITH_WITNESS_TUNING.FULL_EXPOSURE) return 0;
  if (exposure >= FAITH_WITNESS_TUNING.PART_EXPOSURE) return 1;
  return 2;
}

/**
 * THE ADAPTER. One soul's dwell among one settlement's pantheon, as funnel intake.
 *
 * ⭐ THE PULL SOURCE IS THE DEITY'S AUTHORED `characterAxes`, and that choice is what
 * makes this adapter possible with ZERO invented vocabulary: the authored token is
 * already `AXIS:pole:level`, which maps rung-for-rung onto the funnel's
 * `{axisId, pole, band}`. Act 1's embed carry is what makes it readable from a
 * committed snapshot at all — before that commit the builder stripped the key, and
 * this file could not have existed.
 *
 * ONE ENTRY PER DEITY, not one per settlement: each god is a distinct exposure with
 * its own weight, and folding them into one entry would average away the difference
 * between a dominant patron and a fringe cult — the very thing the field exists to
 * stop doing.
 *
 * DORMANT ⇒ an EMPTY array (not a null, not an entry with no pulls): a funnel caller
 * distinguishes "nothing to teach" from "something malformed" by count alone.
 *
 * ⚠ `settlementSeed` ARRIVES FROM THE CALLER AND IS NOT READ OFF THE SETTLEMENT, and
 * that is a correction the estate's own instrument forced. An earlier cut read
 * `settlement.placeSeed ?? settlement.seed`; `check-observed-shape-readers` refused
 * both as reads of keys no writer produces — and it was right. A settlement carries
 * no seed: `pulseKernel` resolves one as `save.seed || settlement.seed || id`, i.e.
 * from the SAVE. So this adapter asks for it rather than guessing, exactly as L4's
 * `milieuEntries` asks for its host vector rather than inventing a direction for a
 * city it has not read.
 *
 * @param {Object} args
 * @param {SimSettlement | null | undefined} args.settlement
 * @param {FaithReligionState | null | undefined} args.religionState
 * @param {Record<string, unknown> | null | undefined} args.npc the dwelling soul
 * @param {number} args.dweltTicks ticks this soul has dwelt among this faith
 * @param {string} args.eventId the evidence this lesson binds to
 * @param {string} [args.settlementSeed] the save's seed for this settlement
 * @param {Record<string, { wins?: unknown, losses?: unknown }> | null | undefined} [args.pantheon]
 *   the per-deity faith-fortunes ledger (`worldState.pantheon`), keyed by the SAME
 *   refs the religion state keys its members by (applyWorldPulse pins that identity).
 *   Handed in by the caller, never read off a settlement; absent means no sharpening.
 * @returns {readonly WitnessEntry[]}
 */
export function faithWitnessEntries({ settlement, religionState, npc, dweltTicks, eventId, settlementSeed, pantheon }) {
  // 1 — THE CADENCE GATE. Integrated time, floor-divided; nothing below one whole
  // season. This is the F9 cure, and it runs before any other work.
  const cadences = Math.floor((Number(dweltTicks) || 0) / AMBIENT_CADENCE_TICKS);
  if (cadences < 1) return Object.freeze([]);

  const deities = religionState && typeof religionState.deities === 'object' && religionState.deities
    ? religionState.deities : null;
  if (!deities || !npc) return Object.freeze([]);

  const patronRef = str(religionState?.patronRef);
  // Absent settlement ⇒ the same literal 1 `pietyMultOf` answers for an absent
  // record; narrowed here rather than cast, so the null case is visible.
  const piety = settlement ? pietyMultOf(settlement) : 1;
  const settlementId = str(settlement?.id);
  const seed = str(settlementSeed);
  const spanTicks = cadences * AMBIENT_CADENCE_TICKS;

  /** @type {WitnessEntry[]} */
  const out = [];
  for (const ref of Object.keys(deities).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))) {
    const member = deities[ref];
    if (!member || member.suppressed) continue;
    const positions = chartPositions(member.snapshot);
    if (positions.length === 0) continue;          // an unauthored god teaches nothing

    const exposure = memberWeight(member, ref === patronRef) * piety;
    const demotion = exposureDemotion(exposure);
    // W-FAITH F5c — the wrathful sharpening reads THIS deity's fortunes entry. The
    // demotion is resolved PER TOKEN: only the vice position the modulation attaches
    // to is sharpened, and only while the fortunes fall. It can recover a pull that
    // exposure had silenced (a wrathful god faintly felt through a small cult as its
    // fortunes fall) — deliberate, and pinned as such in the unit suite.
    const fortunes = pantheon && typeof pantheon === 'object' ? pantheon[ref] : undefined;
    /** @type {WitnessPull[]} */
    const pulls = [];
    for (const token of positions) {
      const pull = pullFromPosition(token, wrathSharpenedDemotion(token, demotion, fortunes));
      if (pull) pulls.push(pull);
    }
    // An entry with no surviving pull is NOT emitted: the funnel would refuse it,
    // and a refusal receipt for a lesson nobody meant to teach is noise in a ledger
    // whose whole value is that its refusals mean something.
    if (pulls.length === 0) continue;

    pulls.sort((a, b) => (a.axisId < b.axisId ? -1 : a.axisId > b.axisId ? 1 : 0));
    out.push(Object.freeze({
      kind: FAITH_WITNESS_KIND,
      plane: FAITH_WITNESS_PLANE,
      settlementId,
      settlementSeed: seed,
      npc: /** @type {Record<string, unknown>} */ (npc),
      // Composed so two gods of one pantheon are DISTINCT evidence rather than two
      // rows claiming the same event — the funnel keys receipts on this.
      eventId: `${str(eventId)}.${ref}`,
      spanTicks,
      pulls: Object.freeze([...pulls]),
    }));
  }
  return Object.freeze(out);
}
