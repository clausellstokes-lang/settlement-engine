/**
 * espionageCareer.js — ES-5c: §3.14 THE PROMOTION-RISK REGISTER, the career grain.
 *
 * docs/DESIGN_FP_ARCH_ES.md §3.14 (J-ES-17). The ambitious who are abroad defend a
 * contested rung WEAKER than the rivals who never left: a seat is held by being in the
 * room, and the longer its holder is away — on a rung with windows open, with a live
 * rivalry around it — the less of his standing survives the next bid. The amendment's
 * other grain, the CREDIT at mission close (`freshMissionGradeFor` into the ladder's
 * maintenance road), does NOT fit beside this one and is ES-5d's.
 *
 * PURE, and it WRITES NOTHING. A DERIVED read over three structures this wave does not
 * own: the whereabouts mirror carried by each settlement roster entry (written only by
 * `advanceRoads`), the agency layer (`worldState.npcStates[nid]`, written only by
 * `npcAgency.js`), and the ladder's own window vocabulary (which arrives as a plain
 * number). No persistence, no regen, no undo, no migration seam applies — the
 * `presentShare01` / `ransomDwellRead` precedent, and §1's zero-new-keys law.
 *
 * ⚠ THE ROSTER ADDRESS IS DELIBERATELY NOT SPELLED IN DOTTED FORM ANYWHERE IN THIS FILE.
 * `tests/domain/roadsParticipation.test.js` keeps a SOURCE-SCANNED inventory of roster
 * readers in worldPulse/spatial, and this leaf is not one — it reads no roster at all, the
 * single npc record arrives as an argument (dependency inversion, as with the exposure
 * number). Writing the dotted address in this header made the scan convict the file on its
 * own PROSE, which is the recorded "a comment that spells a scanned matcher convicts
 * itself" hazard. Naming a non-reader in a readers census would have made the next real
 * reader indistinguishable from a footnote, so the prose was reworded instead. Say "the
 * roster entry's whereabouts mirror" in words here; never in the scanned form.
 *
 * ── ⚠⚠ `whereabouts.sinceTick` HOLDS A WEEK, NOT A TICK. THE FIELD NAME LIES ──────────
 * It is written `sinceTick: num(mm.departTick, 0)` by `advanceRoads`, and `departTick` is
 * stamped from `weekClock`, which is `calendar.elapsedWeeks` — the SAME clock the ladder
 * reads as its `weeks`. So `awayWeeks = weeks - sinceTick` is unit-correct with NO
 * conversion, and `PROMOTION_AWAY_CAP_WEEKS: 12` is directly comparable to it. There is
 * no `TICKS_PER_WEEK` constant anywhere in `src/domain/` — a future reader who trusts the
 * field name will divide by a constant that does not exist and silently shrink every
 * absence by an order of magnitude. Recorded as ES-5c deviation D4.
 *
 * ── ⚠ THE DECLARED ONE-TICK LAG (§0.2, CR-ES5B-2 — ACCEPTED, DECLARED AND PINNED) ─────
 * `advanceRoads` writes `npc.whereabouts` in the consequence_fold stage, LAST in the
 * tick; `advanceNpcLadder` runs strictly earlier (the pulse composes the ladder chain and
 * THEN roads — `advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoads`
 * calls its `...AndTraditions` prior before `advanceRoads`). So the ladder always reads
 * LAST tick's mirror, and this register inherits that lag UNCHANGED and UNIFORM. Moving
 * the consumer later is not available: FP L1 banks pulseKernel.js and applyWorldPulse.js
 * at zero headroom, so no wave reorders the pulse. An UNDECLARED lag is the bug; this one
 * is declared here and pinned by acceptance case A5.
 *
 * ── ⛔ THIS LEAF MUST NEVER IMPORT ANY `npcLadder*` FILE ──────────────────────────────
 * The edge runs INFO→INTERIOR in exactly one direction (`npcLadderChallenge.js` imports
 * THIS file, licensed by the CPL-20 row `ES5C_CAREER_LADDER_COUPLING`). Importing back
 * would close the loop, and a barrel hop drags the whole ladder family into the espionage
 * closure. Dependency inversion is why `careerRiskFor` takes a plain `rungExposure01`
 * number and an already-resolved `nid` rather than reaching for a ladder object — and it
 * is also what lets a test drop any single term.
 *
 * DARK ⇒ NOTHING: `careerRiskFor` returns 0 on one `espionageActive` read before it
 * touches a world object, so a dark world — espionage-dark, ladder-dark or roads-dark —
 * pays a single flag read and the defense score is BYTE-IDENTICAL. The lit shift is a
 * DISCLOSED one-time ladder-outcome move under ⟨F6⟩, fenced by its own golden pair.
 */
import { clamp01 } from '../../../kernel/math.js';
import { WHEREABOUTS_STATES } from '../../roads/state.js';
import { espionageActive } from './espionageGate.js';
import { promotionRisk01Core } from './espionageMath.js';

/**
 * THE AWAY SET — DERIVED FROM THE FROZEN EXPORT, NEVER RE-TYPED AS A LITERAL.
 *
 * §3.14's vocabulary is exactly `WHEREABOUTS_STATES` minus `hostage`, spelled as a filter
 * over the roads export rather than as the triple `['traveling', 'visiting', 'returning']`
 * so that the day roads adds a fifth state it joins the away set instead of escaping the
 * discount in silence. A hostage is ALREADY off-stage — §3.11 and §3.14 both exclude them
 * by name — so a captive is not also fined for the captivity. Case A3 drives EVERY member
 * of the frozen export and asserts the partition, so this filter cannot go stale.
 * @type {ReadonlyArray<string>}
 */
const AWAY_STATES = Object.freeze(WHEREABOUTS_STATES.filter((state) => state !== 'hostage'));

/** The only npc shape this leaf reads.
 *  @typedef {{ whereabouts?: { state?: unknown, sinceTick?: unknown } }} CareerNpc */
/** The only npcStates shape this leaf reads.
 *  @typedef {{ ambitionHeat?: unknown, rivalryTargets?: unknown }} CareerAgencyRow */

/**
 * §3.14 THE REGISTER, the leaf's named surface.
 *
 * ⚠ THIS IS A CONSUMER WIDENING, NOT A SECOND SPELLING — the `operativeNotoriety01`
 * precedent, verbatim in shape. The arithmetic is `promotionRisk01Core`'s, imported from
 * espionageMath.js and applied unchanged; J-WR-10 forbids a rival spelling of an existing
 * pure leaf, and re-deriving the three-term fold here would let the register and the ES-0
 * core disagree about what "abroad on a contested rung" costs. What this function adds is
 * a NAME the ladder composition can address and a home for the register's own docblock;
 * `tests/domain/espionageCareer.test.js` pins its output equal to the core's over a
 * driven input matrix, so a future edit that quietly re-derives the fold reds.
 *
 * @param {{ awayWeeks?: unknown, rungExposure01?: unknown, rivalPressure01?: unknown }} [input]
 * @returns {number} 0..1, round4. NEVER NaN, negative, or undefined.
 */
export function promotionRisk01For(input = {}) {
  return promotionRisk01Core(input);
}

/**
 * THE PER-DEFENDER COMPOSER — what one rung-holder's absence costs him this advance.
 *
 * TAKES NO LADDER OBJECT, BY CONSTRUCTION (dependency inversion, the `presentShare01`
 * precedent). The caller supplies the already-resolved `nid`, the elapsed `weeks` off the
 * calendar it already read, and `rungExposure01` as a plain 0..1 number — so this leaf
 * imports nothing from any consumer, and a test can drop any single term.
 *
 * ⚠ `rungExposure01` ARRIVES DERIVED, AND ITS SPAN IS PINNED TO ITS PRODUCER. The ladder
 * computes it as `clamp01(windows.length / RUNG_EXPOSURE_WINDOW_SPAN)` from the
 * `openWindows` array it has ALREADY built four lines earlier, so the exposure is stated
 * in the ladder's own vulnerability vocabulary rather than invented here, at zero extra
 * cost, and the span lives beside the window list it counts. Doing the division here
 * would require importing `CHALLENGE_TUNING`, which is the loop this leaf must never
 * close.
 *
 * ⚠ `rivalPressure01` READS THE AGENCY ROW'S AMBITION HALF, GATED ON A LIVE RIVALRY, and
 * that composition is an ES-5c judgment rather than a charter sentence (deviation D9).
 * The row carries exactly two ambition/rivalry fields: `ambitionHeat` (a scalar the agency
 * layer `clamp01`s at every write, so it is 0..1 BY CONSTRUCTION) and `rivalryTargets` (a
 * pruned list of npc ids). A seat entangled in NO live rivalry feels no rival pressure,
 * which is what the term is named for; a seat that is entangled feels it at the heat of
 * the promotion-seeking around it. ⛔ The INBOUND reading — scanning every other agency
 * row for one that targets this nid — is refused deliberately: it is O(roster) per
 * defender per rung per faction per tick on the hot path §10 warns about, and the cure
 * for a hot-path red is a STOP, never a cache. The asymmetry is therefore accepted and
 * recorded rather than paid for.
 *
 * @param {unknown} worldState
 * @param {unknown} npc the defender's roster entry (the whereabouts mirror's owner)
 * @param {unknown} nid the defender's canonical npc pulse id, already minted by the caller
 * @param {unknown} weeks `calendar.elapsedWeeks`, the SAME clock `sinceTick` was written from
 * @param {unknown} rungExposure01 0..1, the ladder's own window-derived exposure
 * @returns {number} 0..1, round4. Exactly `0` when espionage is dark, the npc is not away,
 *   or the npc is a hostage. NEVER NaN, negative, or undefined.
 */
export function careerRiskFor(worldState, npc, nid, weeks, rungExposure01) {
  // THE BYTE-IDENTICAL DARK PATH: one flag read, before any world object is touched.
  if (espionageActive(worldState) !== true) return 0;
  const row = /** @type {CareerNpc} */ (npc ?? {});
  const where = row.whereabouts;
  if (!where || typeof where !== 'object') return 0;
  if (!AWAY_STATES.includes(String(where.state ?? ''))) return 0;
  // The subtraction needs NO conversion: both sides are `calendar.elapsedWeeks` (see the
  // header). A `sinceTick` in the FUTURE yields a negative elapsed and floors at 0 rather
  // than crediting a departure that has not happened.
  const since = Number(where.sinceTick);
  if (!Number.isFinite(since)) return 0;
  const elapsed = Number(weeks);
  const awayWeeks = Math.max(0, (Number.isFinite(elapsed) ? elapsed : 0) - since);
  const states = /** @type {{ npcStates?: Record<string, unknown> }} */ (worldState ?? {}).npcStates;
  const agency = /** @type {CareerAgencyRow | null} */ (
    states && typeof states === 'object' ? (states[String(nid)] ?? null) : null
  );
  const rivals = agency && Array.isArray(agency.rivalryTargets) ? agency.rivalryTargets.length : 0;
  const rivalPressure01 = rivals > 0 ? clamp01(Number(agency?.ambitionHeat)) : 0;
  return promotionRisk01For({
    awayWeeks,
    rungExposure01: clamp01(Number(rungExposure01)),
    rivalPressure01,
  });
}
