/**
 * espionage/infiltrationDepth.js — THE TWO NEW RUNGS (W-OPS car O3; DESIGN_W_OPS.md §3,
 * and §8b's PANEL FOLD — F4, F8, F15 — which OUTRANKS §3).
 *
 * WHAT THIS HOLDS. The L3 PLACED and L4 SEATED rungs of the infiltration ladder: the
 * placement mission kinds and their receipt qualification, the L4 enrollment through the
 * corruption web's own creation seam, and the self-limiting brake that keeps a placement
 * from running forever. It holds NO espionage arithmetic of its own — §7 risk 3 ("a second
 * espionage system by accident") is avoided by extending exactly the three points the
 * volume names (ES §3.4b upward, §3.10 scaling, §3.5 taint) and deferring everything else
 * by charter.
 *
 * ── ⛔ WHY THIS LEAF LIVES IN `espionage/` AND NOT IN `operations/` ────────────
 *
 * `tests/lint/couplingInclusion.walker.test.js` claims this directory outright:
 * `/^src\/domain\/worldPulse\/espionage\//` is an INFO-layer DIRECTORY pattern, written so
 * "every future ES leaf is claimed the day it lands, which is what stops the unclaimed
 * census from trailing the estate again". A leaf under `operations/` matches NO layer
 * family, so it lands as a NEW UNLAYERED MODULE and grows that walker's frozen census.
 * Measured at this car's base: the census is ALREADY over by two, and one of the two is
 * `operations/missionAcceptance.js`. This car does not make it three. The home is also the
 * charter's own: these rungs EXTEND ES §3.4/§3.4b upward, so the espionage family owns the
 * subject, which is the reading that table draws everywhere.
 *
 * ── ⭐⭐ F4, THE BRAKE: A RAMP IS NOT A BRAKE UNTIL SOMETHING FIXED IS WEIGHED ──
 *
 * The fold rules that "L3/L4 get their explicit brake: placement-vetting events ride a
 * monotone per-interval ramp of the dwellRamp shape — the same self-limiting construction,
 * ruled rather than hoped." The construction being named is `gatherOrGovernRead`'s, and it
 * has TWO halves, not one: a hazard that climbs monotonically AND an appetite that does
 * not move. A ramp alone is only a multiplier; it terminates nothing. So this leaf ships
 * both halves — `placementVettingRamp` for the climb and `holdOrWithdrawRead` for the
 * fixed bar it is weighed against — and the termination is asserted as a property over the
 * whole reachable interval range rather than asserted about in prose.
 *
 * The fixed bar is O2's, not a second reading: `missionAcceptance.freezeRegisterAtRooting`
 * is the snapshot a placement was accepted with, and `registerGoverning` is the one place
 * that choice is made. This leaf takes the resulting number as an ARGUMENT and names its
 * producer in `INFILTRATION_PROVENANCE`. Re-deriving an appetite here would be a second
 * answer to the question F4 exists to give exactly one answer to.
 *
 * ── ⭐ THE SHAPE LAW IS MACHINERY, NOT A COMMENT ──────────────────────────────
 *
 * "Of the dwellRamp shape" is a phrase a later table could satisfy in the letter and break
 * in the spirit. `rampLawViolations` states the three clauses that make such a table
 * self-limiting — index 0 is EXACTLY 1 (so a placement that never re-vets is priced as
 * though the ramp did not exist), monotone non-decreasing, and non-empty (so the plateau
 * exists) — and the suite runs it over BOTH this leaf's table and ES's own `DWELL_RAMP`.
 * A future ramp that does not satisfy it reds on the law rather than on a golden.
 *
 * ── ⛔ F15: THE COVER IS RECON-THEN-OWNER-GATE, SO NO COVER IS BUILT HERE ──────
 *
 * `declaredPurpose` rides the ERRAND ROW (`errandMint.errandSpineFields`) and terminal
 * errands are EVICTED from persistence, so a standing cover really is new persisted
 * schema. It is not built. `STANDING_COVER_GATE` records what the owner is being asked to
 * admit, INCLUDING the half the fold did not name — see that row's own note.
 *
 * ── DARK: NO PRODUCTION CALLER, AND NO FLAG IS MINTED HERE ────────────────────
 *
 * Nothing under `src/` imports this module, and the suite walks the tree to assert the
 * empty importer set. NO FLAG IS MINTED: the door is `infiltrationDepthEnabled`
 * (DESIGN_W_OPS §6), and lighting it is the CR-WR10-C VIRTUAL-FLAG MINT — one by-name
 * `=== true` read, a manifest entry in `ENGINE_GATED_VIRTUAL_RULE_KEYS`, an AUTHORED row
 * in `VIRTUAL_SUBSYSTEM_ROWS`, and a dormancy fence, ALL IN ONE COMMIT. This car names the
 * door and does not write that read, which is the SAME disposition sibling car O1 recorded
 * for `missionDispatcherEnabled` and for the same measured reason: the authored row cannot
 * land while `subsystemRowsVirtual.js` sits at its 800-line ceiling. Naming the wall is how
 * the flag car meets a known cost instead of discovering one.
 *
 * Every door-bearing export here takes an explicit `lit` argument instead, and returns
 * `null` when it is anything but `true` — zero keys written, which is the volume §6
 * dormancy law verbatim.
 *
 * PURE. No world state written, no clock, no PRNG, no I/O, no mutation, no store. Every
 * input arrives as an argument.
 *
 * @see docs/DESIGN_W_OPS.md §3 (the ladder), §6 (gates), §8b (F4, F8, F15), §9 (owner rows)
 * @see docs/DESIGN_FP_ARCH_ES.md §3.4b (the rooted dwell this extends), §3.5, §3.10
 * @enforced-by tests/domain/infiltrationDepth.test.js
 */
import { dwellRamp, round4 } from './espionageMath.js';

/**
 * THE LADDER, closed and frozen. L0–L2 are ES's own built shapes and are named here with
 * their homes and NOTHING ELSE — this volume re-rules no ES math, so a rung that already
 * exists contributes a name and an address, never a number. L3/L4 are this car's.
 *
 * `access` is the one word that says what the rung BUYS, because that is the axis the two
 * new rungs actually move along: L1 sees the place, L3 reads the institution's interior,
 * L4 sits in the room where it is decided.
 *
 * @type {ReadonlyArray<Readonly<{level:number, name:string, access:string, status:string,
 *   home:string}>>}
 */
export const INFILTRATION_LEVELS = Object.freeze([
  Object.freeze({
    level: 0,
    name: 'passing_ear',
    access: 'waypoint hearing on a journey: the host\'s own beliefs',
    status: 'built',
    home: 'src/domain/worldPulse/espionage/espionageGauntlet.js#covertDwellRead',
  }),
  Object.freeze({
    level: 1,
    name: 'observer',
    access: 'the target dwell: counting granaries, seeing the place',
    status: 'built',
    home: 'src/domain/worldPulse/espionage/espionageGauntlet.js#covertDwellRead',
  }),
  Object.freeze({
    level: 2,
    name: 'rooted',
    access: 'the gather-or-govern dwell: re-sampling on a ramping catch',
    status: 'built',
    home: 'src/domain/worldPulse/espionage/espionageGauntlet.js#gatherOrGovernRead',
  }),
  Object.freeze({
    level: 3,
    name: 'placed',
    access: 'the INSTITUTION\'s interior: its roster, its backing, its doctrine posture',
    status: 'new',
    home: 'src/domain/worldPulse/espionage/infiltrationDepth.js#PLACEMENT_MISSION_KINDS',
  }),
  Object.freeze({
    level: 4,
    name: 'seated',
    access: 'a court or faction SEAT held under foreign will: the mole',
    status: 'new',
    home: 'src/domain/worldPulse/espionage/infiltrationDepth.js#placementEnrollment',
  }),
]);

/** The rung names, in level order — the totality export the house idiom asks for. */
export const INFILTRATION_LEVEL_NAMES = Object.freeze(INFILTRATION_LEVELS.map((r) => r.name));

/** The two rungs this volume adds. Named as a set so a census can ask about them alone. */
export const NEW_INFILTRATION_LEVELS = Object.freeze(
  INFILTRATION_LEVELS.filter((row) => row.status === 'new').map((row) => row.name),
);

/**
 * THIS CAR'S OWN CONSTANTS, and they are deliberately NOT appended to `ESPIONAGE_TUNING`.
 * That export is ES-0's frozen arithmetic surface and its KEYS ARE PINNED AS A SET, so a
 * wave that appended to it would move a pinned totality for constants that belong to a
 * rung rather than to a formula. `GAUNTLET_TUNING` is the estate's own precedent for
 * exactly this, and this follows it.
 *
 * ⛔ RAW-AUTHORED CANDIDATE, UNSIGNED. DESIGN_W_OPS §9 row 2 reserves "placement/vetting
 * sharpness" to the owner's pen. The table below is a PROPOSAL and nothing here is tuned.
 */
export const INFILTRATION_DEPTH_TUNING = Object.freeze({
  /**
   * §3's L3 catch model: institutional vetting is SPARSER and SHARPER than the market-face
   * ramp — a placed man is not re-examined every week, but when he is examined it is by
   * people whose job it is. Same SHAPE as `DWELL_RAMP` (index 0 exactly 1, monotone,
   * plateau at the top), steeper span. Proposal only.
   */
  PLACEMENT_RAMP: Object.freeze([1, 1.4, 2, 2.8]),
  /**
   * The backstop on placement re-vetting intervals, the `DWELL_RESAMPLE_CAP` idiom: the
   * SOFT bound (hold-or-withdraw) must bind first on every reachable input, or the cap is
   * a dead band. The suite asserts exactly that rather than trusting it.
   */
  PLACEMENT_RESAMPLE_CAP: 8,
});

/**
 * ⭐ THE SELF-LIMITING RAMP LAW, stated as the three clauses that make a ramp table a
 * BRAKE rather than a multiplier. Returns the violated clause names — EMPTY means lawful.
 *
 * Written as a predicate over a TABLE rather than as an assertion about one table, because
 * "of the dwellRamp shape" is a phrase and a phrase checks nothing: the suite runs this
 * over ES's `DWELL_RAMP` and over this leaf's `PLACEMENT_RAMP`, so the two can never drift
 * into different constructions while both claiming the same one.
 *
 * @param {unknown} table
 * @returns {readonly string[]}
 */
export function rampLawViolations(table) {
  /** @type {string[]} */
  const broken = [];
  const rows = Array.isArray(table) ? table : [];
  if (!rows.length) broken.push('non_empty');
  // Index 0 must be EXACTLY 1, not merely small: it is what makes a placement that never
  // re-vets byte-identical to one priced with no ramp at all.
  if (rows[0] !== 1) broken.push('identity_at_zero');
  for (let i = 1; i < rows.length; i += 1) {
    const prev = rows[i - 1];
    const here = rows[i];
    if (typeof prev !== 'number' || typeof here !== 'number' || !(here >= prev)) {
      broken.push('monotone_non_decreasing');
      break;
    }
  }
  return Object.freeze(broken);
}

/**
 * THE L3/L4 BRAKE'S CLIMB (§8b F4). Interval 0 is the placement itself and is exactly 1;
 * 1+ are re-vetting intervals; the top band is the plateau for every interval past the
 * table. Out-of-range input is CLAMPED rather than rejected — this is a multiplier in a
 * product, and returning null would turn a bad index into a NaN two frames away, which is
 * `dwellRamp`'s own stated reason for the same choice.
 *
 * @param {unknown} intervalIdx 0 = the placement; 1+ = institutional re-vetting intervals.
 * @returns {number} >= 1
 */
export function placementVettingRamp(intervalIdx) {
  const ramp = INFILTRATION_DEPTH_TUNING.PLACEMENT_RAMP;
  const index = Math.max(0, Math.trunc(Number(intervalIdx)) || 0);
  return ramp[Math.min(index, ramp.length - 1)];
}

/**
 * The `dwellRamp` value for the same interval, re-exposed under this leaf's name so a
 * consumer at L0–L2 depth reaches ES's table and never this one. It exists so the two
 * ramps have ONE call site shape and a caller cannot pick the wrong table by accident.
 *
 * @param {unknown} level        an `INFILTRATION_LEVELS` level number
 * @param {unknown} intervalIdx
 * @returns {number} >= 1
 */
export function rampForLevel(level, intervalIdx) {
  const rung = Math.trunc(Number(level)) || 0;
  return rung >= 3 ? placementVettingRamp(intervalIdx) : dwellRamp(intervalIdx);
}

/** @type {ReadonlyArray<string>} */
const APPETITE_ABSENT = Object.freeze(['appetite']);
/** @type {ReadonlyArray<string>} */
const HAZARD_ABSENT = Object.freeze(['hazard']);
/** @type {ReadonlyArray<string>} */
const BOTH_ABSENT = Object.freeze(['appetite', 'hazard']);
/** @type {ReadonlyArray<string>} */
const NO_TERMS_ABSENT = Object.freeze([]);

/**
 * A real, finite `number`, or null. DELIBERATELY NOT `Number(v)`: `Number(null)` and
 * `Number('')` are both a FINITE 0, so a caller passing `null` for a term it does not hold
 * would be recorded as having supplied ZERO. Here that collapse is not even numerically
 * invisible — an appetite folded to 0 is a man who withdraws from everything, and an
 * appetite nobody read is a man nobody asked. They must not produce the same receipt.
 *
 * @param {unknown} value
 * @returns {number|null}
 */
function unit01(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return Math.max(0, Math.min(1, value));
}

/**
 * ⭐ THE BRAKE (§8b F4). A placed or seated operative re-decides each interval whether one
 * more interval inside is worth the climbing vetting odds, against an appetite that DOES
 * NOT MOVE — the register frozen when the placement was accepted. Fixed bar, monotone
 * climb ⇒ every placement terminates BY CONSTRUCTION rather than by the cap, and the cap
 * below is a backstop that must never be the thing that binds.
 *
 * The risk weighed is the one the NEXT interval would carry, not the current one:
 * `gatherOrGovernRead`'s own reasoning, and it is load-bearing — deciding on the interval
 * he is already standing in lets a man stay one interval past the odds he actually refused.
 *
 * ⚠ ABSENCE IS DECLARED, NEVER FOLDED. An unreadable appetite and an unreadable hazard both
 * withdraw, because withdrawing is the safe direction — but each names itself in
 * `termsAbsent` and in `reason`, so a receipt can tell "he would not risk it" from "nobody
 * priced it". The numeric outcome coincides; the fact does not.
 *
 * @param {Object} args
 * @param {unknown} [args.intervalIdx]  the interval he is currently in
 * @param {unknown} [args.appetite01]   the FROZEN acceptance bar (see the header)
 * @param {unknown} [args.hazard01]     the base institutional vetting hazard, 0..1
 * @returns {{choice:'hold'|'withdraw', vettingRisk01:number, termsAbsent:readonly string[],
 *   reason:string, intervalIdx:number}}
 */
export function holdOrWithdrawRead({ intervalIdx, appetite01, hazard01 } = {}) {
  const here = Math.max(0, Math.trunc(Number(intervalIdx)) || 0);
  const appetite = unit01(appetite01);
  const hazard = unit01(hazard01);
  const termsAbsent = appetite === null && hazard === null
    ? BOTH_ABSENT
    : appetite === null
      ? APPETITE_ABSENT
      : hazard === null
        ? HAZARD_ABSENT
        : NO_TERMS_ABSENT;

  if (appetite === null || hazard === null) {
    return {
      choice: 'withdraw',
      vettingRisk01: 0,
      termsAbsent,
      reason: appetite === null ? 'appetite_unreadable' : 'hazard_unreadable',
      intervalIdx: here,
    };
  }
  const next = here + 1;
  if (next > INFILTRATION_DEPTH_TUNING.PLACEMENT_RESAMPLE_CAP) {
    return {
      choice: 'withdraw', vettingRisk01: 1, termsAbsent, reason: 'resample_cap', intervalIdx: here,
    };
  }
  // Bounded into 0..1 by construction: the ramp only ever raises, and the clamp is what
  // keeps a steep table from producing a risk nobody could refuse for the wrong reason.
  const vettingRisk01 = round4(Math.min(1, hazard * placementVettingRamp(next)));
  return vettingRisk01 < appetite
    ? {
      choice: 'hold', vettingRisk01, termsAbsent, reason: 'risk_under_appetite', intervalIdx: here,
    }
    : {
      choice: 'withdraw', vettingRisk01, termsAbsent, reason: 'risk_over_appetite', intervalIdx: here,
    };
}

/**
 * THE PLACEMENT MISSION KINDS, in sibling car O1's `MISSION_KIND_CATALOG` ROW SHAPE so the
 * landing UNIONS them into that one catalog instead of meeting a second one.
 *
 * ⛔ THE FIELD NAMES ARE THE INTERFACE AND THAT IS WHY THEY MATCH. O1's catalog is not at
 * this car's tip (the two lines are siblings, not a chain), so the rows below cannot be
 * constructed by its constructor — but a set of mission kinds under a DIFFERENT row shape
 * is a fork of the one home, which is the single thing the volume's §7 risk 3 names. This
 * export is therefore an EXTENSION SET, deliberately not spelled `MISSION_KIND_CATALOG`,
 * so the union at the landing is an append rather than a collision.
 *
 * ⭐ THE TASK QUALIFICATION LAW (§0) IS ENCODED AS TWO FIELDS, NOT ONE. "A mission kind
 * registers only if its resolution writes an ALREADY-RECEIPTED outcome family" — and for
 * L3 the family EXISTS while its writer does not yet, because §6 holds L3/L4 capture
 * receipts behind the arm the ES charter opens. Collapsing that into a single boolean
 * would make a later reader conclude either "unqualified" (false — the family is real and
 * named) or "ready to wire" (false — nothing writes it yet). Both fields, always.
 *
 * @type {ReadonlyArray<Readonly<{kind:string, operationClass:string, level:number,
 *   receiptFamily:string, receiptWriter:string, receiptModule:string, sourceVerdict:string,
 *   writerLanded:boolean, sourceNote:string, signedBy:string|null}>>}
 */
export const PLACEMENT_MISSION_KINDS = Object.freeze([
  Object.freeze({
    kind: 'place_agent',
    operationClass: 'MISSION',
    level: 3,
    receiptFamily: 'foreign_guest_hold_covert',
    receiptWriter: 'FOREIGN_GUEST_HOLD_COVERT_CAUSE',
    receiptModule: 'src/domain/worldPulse/foreignGuestHold.js',
    sourceVerdict: 'verified',
    writerLanded: false,
    sourceNote:
      'the L3 placement operation; its FAILURE writes the covert-cause custody hold, which '
      + 'is a live record family with a live cause word, but §6 holds the L3/L4 capture '
      + 'WRITE behind the arm the ES charter opens, so the family qualifies the kind and '
      + 'the writer has not landed',
    signedBy: null,
  }),
  Object.freeze({
    kind: 'seat_agent',
    operationClass: 'MISSION',
    level: 4,
    receiptFamily: 'foreign_corruption_exposure',
    receiptWriter: 'applyForeignExposureBlowback',
    receiptModule: 'src/domain/worldPulse/corruptionWeb.js',
    sourceVerdict: 'verified',
    writerLanded: true,
    sourceNote:
      'the L4 seating operation; F8 rules the placed seat IS the web\'s foreign-leashed '
      + 'seat reached by a second door, so its exposure runs the web\'s own §4 blowback '
      + 'lane verbatim: grievance, credibility charge, legitimacy in both courts',
    signedBy: null,
  }),
]);

/** The kind words alone, the totality export. */
export const PLACEMENT_MISSION_KIND_WORDS = Object.freeze(
  PLACEMENT_MISSION_KINDS.map((row) => row.kind),
);

/**
 * ⭐⭐ THE F8 GATE CENSUS, WITH A DENOMINATOR. F8 rules that "L4 placement ENROLLS THROUGH
 * THE WEB'S CREATION SEAM — the per-patron live-asset cap and recruitment-degradation rules
 * apply to placed seats exactly as to corrupted ones", and that "applies verbatim" covers
 * creation, resolution, grip and exposure alike.
 *
 * "Verbatim" is only checkable against a DENOMINATOR, so every gate in
 * `advanceCorruptionWeb`'s stack is dispositioned here — applied, replaced, or inapplicable
 * with a reason. Two of the five CANNOT apply, and finding that out at the spec is the
 * whole reason the fold asked for this row rather than for an implementation:
 *
 *   • THE E0 TEMPO GATE IS REPLACED, NOT DROPPED. That gate exists to make an UNWILLED
 *     recruitment rare — a patron court quietly deciding, on a loaded die, to try someone.
 *     A placement is WILLED: it was chartered, cast, vetted and accepted through the one
 *     operation walk before it ever reaches this seam. The mission IS the initiation, and
 *     rolling the rarity die again would price the same decision twice.
 *   • THE TARGET-NPC PICK CANNOT APPLY AT ALL, and this is the sharp one. The web MINTS its
 *     asset by turning a corruptible, clean LOCAL (`mintAssetInto`'s importance-rank pick).
 *     The whole point of L4 is that the seat is held by YOUR OWN MAN — the placed spy — not
 *     by a turned local. So `no_eligible_npc` has no L4 meaning: there is no local to find,
 *     and a wiring that reused that pick would silently convert every mole into a
 *     defector-in-place and quietly delete the rung.
 *
 * @type {ReadonlyArray<Readonly<{gate:string, disposition:string, note:string}>>}
 */
export const ENROLLMENT_GATE_DISPOSITION = Object.freeze([
  Object.freeze({
    gate: 'pair_already_held',
    disposition: 'applies',
    note: 'one live asset per (patron, target) pair. The web enforces it as a candidate '
      + 'SKIP with no word of its own, because it scores targets and a placement names one',
  }),
  Object.freeze({
    gate: 'per_patron_cap',
    disposition: 'applies',
    note: 'the realm-wide per-patron live-asset cap, verbatim: F8\'s named clause',
  }),
  Object.freeze({
    gate: 'upkeep_unaffordable',
    disposition: 'applies',
    note: 'the rising-upkeep affordability floor, verbatim: F8\'s named degradation',
  }),
  Object.freeze({
    gate: 'e0_deferred',
    disposition: 'replaced_by_the_mission',
    note: 'the rarity die prices an UNWILLED recruitment; a placement was already willed, '
      + 'cast, vetted and accepted, so rolling it again prices one decision twice',
  }),
  Object.freeze({
    gate: 'no_eligible_npc',
    disposition: 'inapplicable',
    note: 'the web turns a corruptible LOCAL; L4 seats your own placed man, so there is no '
      + 'local to find and reusing that pick would delete the rung',
  }),
]);

/**
 * THE ENROLLMENT DEFERRAL VOCABULARY, closed. Three words are the corruption web's OWN,
 * spelled identically so a receipt reads the same whichever door minted the asset. The
 * fourth is this leaf's, and it is declared rather than smuggled: the web has NO word for
 * an already-held pair because it filters such targets out before it scores them, while a
 * placement arrives naming its target and must be told no by name.
 *
 * @type {readonly string[]}
 */
export const ENROLLMENT_DEFERRALS = Object.freeze([
  'pair_already_held',
  'per_patron_cap',
  'upkeep_unaffordable',
  'not_lit',
]);

/** The subset spelled exactly as `advanceCorruptionWeb` spells them. */
export const WEB_SHARED_DEFERRALS = Object.freeze(['per_patron_cap', 'upkeep_unaffordable']);

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * ⭐ F8 — THE L4 ENROLLMENT, DARK BY DEFAULT. Decides whether a placement may take a seat
 * under the corruption web's own scarcity, and returns the web's own deferral word when it
 * may not. Unlit ⇒ `null` ⇒ zero keys written ⇒ byte-identical, the volume §6 dormancy law
 * verbatim.
 *
 * ⛔ THE CAP IS AN ARGUMENT AND THIS LEAF DECLARES NO CAP OF ITS OWN. `MAX_ASSETS_PER_PATRON`
 * lives in exactly one place, `corruptionWeb.CORRUPTION_WEB_TUNING`, and a second copy here
 * would be a second spelling of one law — the class this estate has now been bitten by more
 * than once. The suite drives this function with the REAL tuning value imported from the
 * real module and pins the boundary against it, so the number is verified at the producer
 * while the leaf stays a pure comparator with nothing to drift.
 *
 * `liveAssets` is the web's OWN derived registry slice — `foreignAssetsByPatron(snapshot)
 * .get(patronId)` — passed in rather than re-derived, for the same reason.
 *
 * @param {Object} args
 * @param {unknown} [args.lit]                 the L4 door; anything but `true` is dark
 * @param {unknown} [args.patronId]
 * @param {unknown} [args.targetId]
 * @param {unknown} [args.liveAssets]          the patron's live foreign assets
 * @param {unknown} [args.maxAssetsPerPatron]  `CORRUPTION_WEB_TUNING.MAX_ASSETS_PER_PATRON`
 * @param {unknown} [args.upkeepAfforded]      the web's affordability verdict; only `false` refuses
 * @returns {{admitted:boolean, deferral:string, patronId:string, targetId:string,
 *   liveAssetCount:number, level:number}|null}
 */
export function placementEnrollment({
  lit, patronId, targetId, liveAssets, maxAssetsPerPatron, upkeepAfforded,
} = {}) {
  if (lit !== true) return null;
  const patron = text(patronId);
  const target = text(targetId);
  if (!patron || !target) return null;

  const assets = Array.isArray(liveAssets) ? liveAssets : [];
  const liveAssetCount = assets.length;
  /** @param {string} deferral */
  const defer = (deferral) => Object.freeze({
    admitted: false, deferral, patronId: patron, targetId: target, liveAssetCount, level: 4,
  });

  // The web's gate ORDER is preserved, and it is not cosmetic: a patron already holding
  // this target is refused for THAT reason even when it is also at cap, because the two
  // facts send a principal to different places (pick another court vs. spend nothing).
  const held = assets.some((row) => (
    text(/** @type {{targetId?: unknown}} */ (row || {}).targetId) === target
  ));
  if (held) return defer('pair_already_held');

  // A cap nobody supplied is not an infinite cap. Refusing here rather than admitting is
  // the fail-closed direction, and it is what keeps an unwired caller from minting seats
  // the web itself would have refused.
  const cap = typeof maxAssetsPerPatron === 'number' && Number.isFinite(maxAssetsPerPatron)
    ? Math.max(0, Math.trunc(maxAssetsPerPatron))
    : null;
  if (cap === null || liveAssetCount >= cap) return defer('per_patron_cap');

  // Only an explicit `false` refuses: absent is a caller that did not price upkeep, and a
  // dark door must not invent a refusal the web would not have made.
  if (upkeepAfforded === false) return defer('upkeep_unaffordable');

  return Object.freeze({
    admitted: true, deferral: '', patronId: patron, targetId: target, liveAssetCount, level: 4,
  });
}

/**
 * ⛔⛔ F15 — THE OWNER-GATE ROW FOR THE STANDING COVER. Recorded, NOT built.
 *
 * The fold rules that "`declaredPurpose` is journey-scoped and journeys terminate, so a
 * standing cover is NEW PERSISTED SCHEMA — designed at car 3's spec and admitted through
 * the owner gate, never assumed." Both halves of that premise were MEASURED at this tip
 * rather than taken on the fold's word: `declaredPurpose`/`truePurpose` are written only by
 * `errandMint.errandSpineFields` onto the errand row, and `envoyErrand.js` evicts every
 * errand whose state is in `TERMINAL_STATES` (`home`, `lost`). The cover really does die
 * with the journey.
 *
 * ⭐⭐ AND THE RECON FOUND A SECOND PRICE THE FOLD DID NOT NAME, which is the whole reason
 * the packet ordered recon BEFORE the gate. NPC ids in this estate are POSITIONAL
 * (`npc_${idx+1}`), so a section reroll does not dangle id-keyed maps — it REBINDS them,
 * and `regenIdentityFold.js` exists because that already happened: a locked keeper moved
 * slots and a corruption record silently became a stranger's. That fold now covers FOUR
 * id-keyed maps. A standing cover keyed by npc id is a FIFTH, and it inherits precisely the
 * failure that leaf calls uncatchable — "the entry exists, it is simply about the wrong
 * person". A cover that rebinds hands one man's false face to somebody else, with every
 * existence census green.
 *
 * So the owner is being asked to admit TWO things, not one: a persisted schema, and a fifth
 * entry in the regeneration identity fold that must land in the same commit as the schema.
 *
 * ── ⛔⛔ AND THERE ARE TWO CANDIDATE SHAPES, NOT ONE — WHICH IS WHY THIS IS A CHOICE ──
 *
 * The fold frames the gate as "admit a persisted schema, yes or no". Measured against the
 * substrate this volume sits on, that framing grazes a constitutional law:
 * `src/domain/npc/knownCharacter.js` (W-LIVES R2) says in its own header that there is NO
 * second personality store, that it holds NOTHING, and — GAP D — that "biography is a
 * query, not a store… No per-NPC memory store exists or may be minted."
 *
 * And DESIGN_W_OPS §3 rules the cover in exactly those terms: "the host settlement's R2
 * KNOWN character of the spy IS the cover while it holds." So the volume's own sentence
 * describes a DERIVED cover, while F15 prices a PERSISTED one. Both shapes are carried
 * below so the owner is choosing rather than approving the only shape anybody wrote down.
 *
 * The derived shape's apparent weakness is arguably the model working: knownCharacter's own
 * header makes "unreceipted drift stays private" the FEATURE — "the quiet clerk whose
 * treachery never crossed anything reads exactly as he was authored, and his betrayal, when
 * it comes, surprises everybody. That asymmetry is not a gap in the model; it IS the
 * model." A cover that holds exactly as long as nothing receipted contradicts it is that
 * same asymmetry, pointed at the spy.
 *
 * ⛔ NOT DECIDED HERE. Persistence shape is owner-gated; `signedBy` stays null and the lean
 * recorded below is vetoable.
 *
 * @type {Readonly<{row:string, status:string, signedBy:string|null, measured:readonly string[],
 *   owes:readonly string[], candidateShapes:ReadonlyArray<Readonly<{shape:string, cost:string,
 *   grazes:string}>>, chairLean:string}>}
 */
export const STANDING_COVER_GATE = Object.freeze({
  row: 'DESIGN_W_OPS#8b.F15',
  status: 'RECON_COMPLETE_AWAITING_OWNER',
  signedBy: null,
  measured: Object.freeze([
    'src/domain/worldPulse/errandMint.js#errandSpineFields (the only writer of declaredPurpose/truePurpose)',
    'src/domain/worldPulse/envoyErrandVocabulary.js#TERMINAL_STATES (home, lost)',
    'src/domain/worldPulse/envoyErrand.js (terminal errands are evicted from persistence)',
    'src/domain/npc/regenIdentityFold.js (four id-keyed maps already folded across a reroll)',
  ]),
  owes: Object.freeze([
    'a persisted cover schema, owner-admitted',
    'a FIFTH regenIdentityFold entry, in the same commit as the schema',
    'an undo/restore round-trip for the new key space',
  ]),
  candidateShapes: Object.freeze([
    Object.freeze({
      shape: 'persisted_cover_record',
      cost: 'new schema + a FIFTH regenIdentityFold entry in the same commit + an undo/restore round-trip',
      grazes: 'GAP D: "no per-NPC memory store exists or may be minted" (knownCharacter.js)',
    }),
    Object.freeze({
      shape: 'derived_cover_query',
      cost: 'the cover can assert only what is RECEIPTED',
      grazes: 'nothing: no new key space, no fold entry, and the rebind hazard cannot arise',
    }),
  ]),
  chairLean: 'derived_cover_query: §3 already words the cover as the R2 KNOWN-character read, '
    + 'and "unreceipted stays private" is the substrate\'s stated feature rather than its gap',
});

/**
 * Provenance, in the module — the L1 catalog's idiom, and every address below is resolvable
 * against the live tree so a rename in another car reds this leaf's suite instead of
 * quietly turning a citation into fiction.
 *
 * `consumes` names what this leaf takes as ARGUMENTS and never imports: O2's frozen
 * acceptance bar and the corruption web's cap and asset registry. `door` names the flag
 * this car does not mint.
 *
 * @type {Readonly<{status:string, signedBy:string|null, door:string,
 *   ownerRows:readonly string[], consumes:readonly string[], extends:readonly string[]}>}
 */
export const INFILTRATION_PROVENANCE = Object.freeze({
  status: 'CANDIDATE',
  signedBy: null,
  door: 'infiltrationDepthEnabled',
  ownerRows: Object.freeze(['DESIGN_W_OPS#9.2', 'DESIGN_W_OPS#8b.F15']),
  consumes: Object.freeze([
    'src/domain/worldPulse/operations/missionAcceptance.js#freezeRegisterAtRooting',
    'src/domain/worldPulse/corruptionWeb.js#CORRUPTION_WEB_TUNING',
    'src/domain/worldPulse/corruptionWeb.js#foreignAssetsByPatron',
  ]),
  extends: Object.freeze([
    'src/domain/worldPulse/espionage/espionageMath.js#dwellRamp',
    'src/domain/worldPulse/espionage/espionageGauntlet.js#gatherOrGovernRead',
  ]),
});
