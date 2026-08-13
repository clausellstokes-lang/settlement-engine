/**
 * domain/worldPulse/treatyBreachCredibility.js — GR-4c: THE OATH THAT FINALLY COSTS
 * SOMETHING.
 *
 * `spatialLedgers.credibility` shipped as a saturating, decaying per-settlement stock
 * with a LIVE reader chain — `credibilityScoreOf` → `reserveFor` →
 * `OATHBREAKER_PENALTY` — and a rendered surface behind it. What was absent was the
 * PRODUCER: no treaty breach had ever written a credibility delta, so a court could
 * tear up one oath after another and every counterparty went on treating its word as
 * good. This leaf is the missing half, and it is deliberately nothing more than the
 * arithmetic: primitives in, one delta out.
 *
 * ⭐ IT READS NO TREATY RECORD AND NO LEDGER. Its input is the VERDICT object
 * `repudiateTreaty` already builds before any ledger write — `{ breachType, severity01,
 * defaultedBy }` — so the grading is COMPOSED rather than re-authored: `severity01` is
 * `1` on the DM's open repudiation and GR-4a's own graded band on the succession road
 * (`DISAVOW_ABOVE`, `COUP_BORN_SEVERITY`, `LINEAL_SEVERITY`). "A succession is lighter
 * than an open repudiation" is therefore already in the tree; nothing here re-decides it.
 *
 * ⛔⛔ CR-GR4C-1 — WHY THE FRACTURE-FOLD IDIOM WAS NOT COPIED, AND WHY THIS TAKES NO
 * `worldState` AND NO TICK. The design routed this charge through
 * `fractureCredibilityDeltas`, which then scanned the treaties ledger for records stamped
 * `fracture.tick === now`. THAT WINDOW WAS DEAD, and it was measured rather than
 * reasoned: the reader runs inside `advanceInformationStatecraft` (one production call
 * site, from `pulseKernel.js`), the only writers of `treaty.fracture` are in
 * `peaceTerms.js`, and both sit inside the SAME `simulateCampaignWorldPulse` call with
 * the reader ~507 lines AHEAD of the writer. So in tick T no fracture can yet carry
 * `fracture.tick === T`; at T+1 the reader asks for T+1 while the record still holds T,
 * and the treaty advance carries `fracture` forward verbatim, so the two never become
 * equal again. A charge mounted there would have been born dead.
 *
 * ⛔ THEREFORE: the charge is taken at the ACT, in `repudiateTreaty`, and this leaf is
 * shaped so the dead idiom CANNOT re-enter it — no `worldState` parameter, no tick
 * parameter, no ledger read, and nothing here to scan. If a later lane feels the urge to
 * "restore consistency" by re-adding a tick predicate, that urge is the defect. The
 * repair of the fracture window itself is a SECOND behavior family behind a DIFFERENT
 * flag (`infoStatecraftEnabled` alone, with no oath gate), and was not this one's to take.
 * The named micro-act **GR-4e** completed that repair on 2026-08-13: the existing fold
 * at T+1 now reads a treaty fracture stamped T, while GR-4c's oath charge stays act-local.
 *
 * @enforced-by tests/domain/treatyBreachCredibility.test.js
 */

import { clamp01 } from '../../kernel/math.js';
import { isRepudiationBreach } from './treatyBreachTypes.js';

/** @typedef {import('./informationStatecraft.js').CredibilityDelta} CredibilityDelta */

/**
 * GR-4c's one authored number.
 *
 * ⚠ UNSOAKED — rides the endgame tuning signature. It is MODULE-LOCAL and frozen on the
 * CR-GR4-4 precedent rather than a `CREDIBILITY_TUNING` key, because a new tuning key is
 * a tuning act and tuning is owner-signed. It is not a free dial: `0.05` is the measured
 * value at which the design's headline claim comes true — the acceptance reserve's
 * oathbreaker term saturates on the THIRD open repudiation, a lineal heir's disavowal is
 * lighter (the fourth), and a coup-born seat never closes the door in four, because the
 * world understands a revolution. At `0.08` the door shuts on the second and at `0.125`
 * on the first.
 */
export const BREACH_CREDIBILITY_TUNING = Object.freeze({ CHARGE_BASE: 0.05 });

/** @param {number} v */
function round4(v) { return Math.round(v * 10000) / 10000; }

/**
 * The credibility charge one broken oath earns its breaker: exactly ONE delta, never a
 * list, banded by the severity the breach verdict already carries.
 *
 * ⛔ CR-GR4C-2 — `kind: 'fracture'` IS A SCALING CHOICE, NOT A SEMANTIC ONE. The kind is
 * never persisted (the ledger stores only `{score,lastUpdateTick,holder}`); it selects
 * which landed `CREDIBILITY_TUNING` constant the fold applies — `FRACTURE_FALL_W` — and
 * no output can distinguish this from a coalition fracture, nor does any need to. A
 * fifth, breach-specific kind would need a new tuning key, which is an owner act.
 *
 * TOTAL BY CONTRACT: `null`, `undefined`, a non-object, a blank breaker, a non-finite
 * severity, or a breach type outside the frozen vocabulary each answer `[]` without
 * throwing. Membership is asked of `isRepudiationBreach` so the vocabulary keeps exactly
 * one home.
 *
 * @param {unknown} verdict the breach verdict — `{ breachType, severity01, defaultedBy }`
 * @returns {CredibilityDelta[]} one delta, or none
 */
export function breachCredibilityDeltas(verdict) {
  const record = /** @type {Record<string, unknown>} */ (
    verdict && typeof verdict === 'object' ? verdict : {}
  );
  if (!isRepudiationBreach(record)) return [];
  const id = String(record.defaultedBy ?? '').trim();
  if (!id) return [];
  const severity01 = Number(record.severity01);
  if (!Number.isFinite(severity01)) return [];
  const magnitude01 = round4(clamp01(BREACH_CREDIBILITY_TUNING.CHARGE_BASE * severity01));
  return [{ id, kind: 'fracture', magnitude01 }];
}
