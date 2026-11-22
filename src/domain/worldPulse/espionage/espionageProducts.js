/**
 * espionageProducts.js — ES-3: THE THREE TYPED PRODUCTS. What a spy brings home, and the
 * one road it travels to become a belief.
 *
 * docs/DESIGN_FP_ARCH_ES.md §3.6 (CONFIRM / ACQUIRE / REFUTE), §3.7 (the gradient's
 * landing rule), §3.14 (the grade at close). The STAGE that walks the ledger and calls
 * these is `espionageProductStage.js`; everything here is pure over its arguments.
 *
 * ── J-ES-5, THE WRITER BOUNDARY, AND WHY IT IS SCANNED RATHER THAN TRUSTED ──────────────
 * All three products write through `reconcileBelief` as SYNTHETIC BeliefReports — the
 * generosityKernel precedent, verbatim — and NEVER through `applyBeliefOverrides`. That is
 * not a style preference. The paid-plant road's `PAID_PLANT_OVERRIDE_KEYS` is an exact
 * six-key closed envelope: a payload carrying an axis field would be SILENTLY REJECTED by
 * it, and the product would look like it had landed while writing nothing. It is the
 * LIAR's road besides, and this program's whole claim is that its products are honest.
 * `tests/domain/espionageProducts.test.js` SOURCE-SCANS the whole espionage module set for
 * that import and runs the scan against a planted one, because a boundary nobody can see
 * being crossed is a boundary nobody is keeping.
 *
 * ── THE OBSERVED RECORD IS NEVER PURER THAN THE PLACE IT WAS READ ───────────────────────
 * `observedReadAt` produces what the agent heard, and `productGroundTruth` composes it as
 * `{...prior, ...whatTheSpyActuallyREAD}` — the generosityKernel shape. Every slot the
 * agent could NOT read therefore equals the prior, so the contradiction term is exactly
 * zero on it and no opinion is fabricated. Two readings feed it and they differ in kind:
 *
 *   AT A WAYPOINT the agent hears the HOST's own belief about the subject — including its
 *     faithLabel and its conditionsBands. Nobody sees past the host's errors: that is the
 *     epistemic constitution, and a host with no belief about the subject yields NOTHING
 *     rather than a neutral guess.
 *   AT THE TARGET the agent sees the PLACE: he counts granaries and roads and he knows what
 *     the place's posture toward home is. So the target read carries `conditionsBands` and
 *     the declared `allianceLabel`, and NOTHING ELSE — no strengthBand, no readiness, and
 *     NO faithLabel. The first two because a covert visitor does not muster a garrison; the
 *     third for a different reason worth naming, because it is a discipline and not a
 *     limit: `groundTruthFaith` is beliefMap-PRIVATE, and re-spelling a truth-side faith
 *     read here would mint the second spelling J-WR-10 forbids. A faith correction reaches
 *     this program through a HOST's belief row, which already carries the field. The
 *     target's own belief row is not an option either way — self-belief is never written
 *     (HZ10), so `beliefRecord(x, x)` is a slot the estate has by design left empty.
 *
 * ── ⛔ STOP-ES3-1 IS CLOSED, AND IT CLOSED BY A CUT RATHER THAN A DECLARATION (EP-r) ────
 * ES-3 measured that `ENVOY_COVERT_LEG_REFS` admitted `exports` while THERE WAS NO SUCH
 * SLOT: `conditionsBands` carries exactly `pullBand / routePositionBand / storesBand /
 * tierBand`, `scarcityBands` is keyed by GOOD CATEGORY, the string `exports` appears
 * nowhere in `beliefAxisSubjects.js`, and `loserExports` is a TRUTH read inside
 * `peaceTermsAppraisal`. Minting the slot is a NEW persisted key family, which §1's
 * zero-new-keys fight forbids, so ES-3 DECLARED the dead member here instead —
 * `LEG_SLOTS.exports` was `null` and an ACQUIRE naming it reported the leg in
 * `legsUnfilled` rather than landing three of four and grading itself `met`.
 *
 * EP-r CUT THE MEMBER, on the argument that the declaration was the workaround. This same
 * vocabulary already excluded `pullBand` BY RULE, one member earlier, for the IDENTICAL
 * property — no espionage product can ever fill it. Two members with the same property
 * treated two different ways is the defect, not the cure. `exports` is now absent from the
 * vocabulary, so the mint and the persist side both REFUSE it by name (`invalid_leg_refs`)
 * instead of accepting a word that could only ever come home empty.
 *
 * ⚠ THE `legsUnfilled` MACHINERY AND THE GRADE CAP ARE KEPT, AND THEY ARE NOT VESTIGIAL.
 * Two live arms still drive them: a leg whose belief FAMILY is dark is unfillable for a
 * second and entirely legitimate reason (`conditionsLit !== true`), and a CORE leg whose
 * slot the observed read never carried is a third. What the cut removed is only the leg
 * that could never be filled in ANY world.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation of an input.
 *
 * @enforced-by tests/domain/espionageProducts.test.js,
 *   tests/property/espionageProductsDormancyFence.test.js
 */
import { getSpatialLedger, setSpatialLedger } from '../../spatial/distanceRead.js';
import {
  BELIEF_TUNING,
  GOVERNING_SEAT_KEY,
  beliefRecord,
  beliefsActive,
  reconcileBelief,
} from '../beliefMap.js';
import { beliefAxesActive, subjectAxesActive } from '../beliefAxes.js';
import { missionGradeFor } from './espionageMath.js';

/**
 * ES-3's own constants — kept out of `ESPIONAGE_TUNING` for the reason ES-2's
 * `GAUNTLET_TUNING` records (that export's key set is pinned as a totality). Raw-authored
 * proposals until the owner signs them (L5, THE PROMISE).
 */
export const PRODUCT_TUNING = Object.freeze({
  /**
   * ⚠ FLOORED STRICTLY ABOVE ZERO, AND THE REASON IS IN `reconcileBelief`. That function
   * carries a documented degenerate zero-weight guard for non-rumorNetwork callers: a NEW
   * belief whose only report aggregates to weight 0 makes the blend 0/0. The guard catches
   * it, but a product that relies on a guard to avoid poisoning the belief ledger is a
   * product that has not decided what it means. A mission that reached a place and heard
   * something is never zero-complete.
   */
  COMPLETENESS_FLOOR: 0.25,
  /** The synthetic report's ledger score (the generosityKernel synthetic-report idiom). */
  REPORT_SCORE: 60,
});

/**
 * WHICH APPRAISAL LEG MAPS ONTO WHICH BELIEF SLOT. Closed, and TOTAL over the five members
 * of `ENVOY_COVERT_LEG_REFS`. EVERY MEMBER NOW MAPS TO A REAL SLOT, because EP-r cut the
 * one member that mapped to NOTHING (the header records the argument). Totality remains the
 * law and the pin still measures it both ways: a leg the table OMITTED would read as an
 * unrecognised word and the mission would grade itself as though nobody had asked.
 *
 * ⚠ THE `null` ARM OF THIS TYPE SURVIVES THE CUT ON PURPOSE, and EP-r pins it rather than
 * leaving it unreachable. `productGroundTruth` looks a ref up in this table WITHOUT
 * re-validating it against `COVERT_LEG_REF_SET`, so a ref from outside the vocabulary has
 * to report UNFILLED rather than dereference `undefined` and throw. That arm is now driven
 * by a NON-VOCABULARY ref in the pin, which is the only way it can be reached at all once
 * no lawful member maps to null.
 * @type {Readonly<Record<string, {slot: string, family: 'core'|'conditions'}|null>>}
 */
export const LEG_SLOTS = Object.freeze({
  readiness: Object.freeze({ slot: 'readiness', family: /** @type {'core'} */ ('core') }),
  routePositionBand: Object.freeze({ slot: 'routePositionBand', family: /** @type {'conditions'} */ ('conditions') }),
  storesBand: Object.freeze({ slot: 'storesBand', family: /** @type {'conditions'} */ ('conditions') }),
  strength: Object.freeze({ slot: 'strengthBand', family: /** @type {'core'} */ ('core') }),
  tierBand: Object.freeze({ slot: 'tierBand', family: /** @type {'conditions'} */ ('conditions') }),
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @param {unknown} value @param {number} fallback @returns {number} */
function num(value, fallback) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/** @param {number} value @returns {number} */
function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/**
 * §3.4b — THE IDENTITY OF ONE DWELL INTERVAL, expressed as the tick its read is stamped
 * with. Interval 0 is the minted stay and anchors at ARRIVAL; every rooted interval anchors
 * one `DWELL_INTERVAL_TICKS` window further on.
 *
 * ⚠ THIS IS THE EXACTLY-ONCE KEY, AND IT WORKS BECAUSE DWELL WINDOWS ARE DISJOINT. A
 * traveller stands at one stop at a time and a leg's arrival is strictly after the previous
 * leg's departure, so no two (stop, interval) pairs on one mission can anchor at the same
 * tick. That is what lets the gradient stay exactly the five fields §1 signed off — an
 * accrual keyed on (subject, anchor) needs no sixth key and no "already gathered" byte, the
 * same idempotence-by-identity the gauntlet's roll uses one file over.
 *
 * @param {{arrivalTick?: unknown, plannedStayTicks?: unknown, intervalIdx?: unknown,
 *   intervalTicks?: unknown}} args
 * @returns {number}
 */
export function gatheringAnchorTick({
  arrivalTick, plannedStayTicks, intervalIdx, intervalTicks,
} = {}) {
  const arrival = Math.max(0, Math.trunc(num(arrivalTick, 0)));
  const index = Math.max(0, Math.trunc(num(intervalIdx, 0)));
  if (index === 0) return arrival;
  const stay = Math.max(0, Math.trunc(num(plannedStayTicks, 0)));
  const window = Math.max(1, Math.trunc(num(intervalTicks, 1)));
  return arrival + stay + (index - 1) * window;
}

/**
 * §3.7 — WHAT THE AGENT READ AT ONE STOP, as belief-record slots.
 *
 * Returns null for the HONESTY NEGATIVE: a waypoint host that holds no belief about the
 * subject yields nothing at all, and a caller that turned that into a neutral guess would
 * be inventing a court's opinion. The target arm cannot be null — a place is always
 * readable to somebody standing in it.
 *
 * THE PERFORMANCE OVERLAY IS THE ASSERTED BAND, NOT THE BELIEVED ONE. Where the host
 * carries a live lie about the subject and the agent is only a visitor, the told version
 * carries what the host ASSERTS. An entered agent reads past it, and a delta-tapped agent
 * gets the lie handed to him as well — which is what `lieSeen` carries to the REFUTE.
 *
 * @param {{tap?: unknown, isTarget?: unknown, hostRecord?: unknown, hostLie?: unknown,
 *   targetFacts?: unknown}} args
 * @returns {{slots: Record<string, unknown>, conditions: Record<string, unknown>|null,
 *   lieSeen: boolean, hostConfidence01: number, hostUpdatedTick: number}|null}
 */
export function observedReadAt({ tap, isTarget, hostRecord, hostLie, targetFacts } = {}) {
  const word = String(tap);
  if (isTarget === true) {
    const facts = recordOf(targetFacts);
    /** @type {Record<string, unknown>} */
    const slots = {};
    if (typeof facts.allianceLabel === 'string') slots.allianceLabel = facts.allianceLabel;
    if ('faithLabel' in facts) slots.faithLabel = facts.faithLabel ?? null;
    const conditions = recordOf(facts.conditionsBands);
    return {
      slots,
      conditions: Object.keys(conditions).length ? conditions : null,
      lieSeen: false,
      // A place seen first-hand is not a record with a staleness; the cap arm knows the
      // target case and never consults these two.
      hostConfidence01: 1,
      hostUpdatedTick: 0,
    };
  }
  const held = hostRecord && typeof hostRecord === 'object' && !Array.isArray(hostRecord)
    ? /** @type {Record<string, unknown>} */ (hostRecord)
    : null;
  if (!held) return null;
  const lie = recordOf(hostLie);
  const hasLie = typeof lie.assertedBand === 'number' && Number.isFinite(lie.assertedBand);
  /** @type {Record<string, unknown>} */
  const slots = {
    readiness: num(held.readiness, BELIEF_TUNING.NEUTRAL_READINESS),
    strengthBand: num(held.strengthBand, BELIEF_TUNING.NEUTRAL_STRENGTH_BAND),
  };
  if (typeof held.allianceLabel === 'string') slots.allianceLabel = held.allianceLabel;
  if ('faithLabel' in held) slots.faithLabel = held.faithLabel ?? null;
  if (hasLie && word === 'performance') slots.strengthBand = Number(lie.assertedBand);
  const conditions = recordOf(held.conditionsBands);
  return {
    slots,
    conditions: Object.keys(conditions).length ? conditions : null,
    lieSeen: hasLie && word === 'delta',
    hostConfidence01: num(held.confidence01, 0),
    hostUpdatedTick: num(held.lastUpdateTick, 0),
  };
}

/**
 * §3.6 — THE GROUND-TRUTH ARGUMENT ONE PRODUCT HANDS `reconcileBelief`, and the legs it
 * could not fill.
 *
 * The three products differ in exactly ONE thing and it is which observed slots cross:
 *   CONFIRM  crosses NOTHING. The report asserts the current believed value, so the
 *            contradiction term is zero by construction and `confidence01` rises by
 *            `weight × CONF_GAIN` alone. That is the whole product, and it is why it needs
 *            no tuning of its own.
 *   ACQUIRE  crosses ONLY the slots its `legRefs` name. A mission sent for the granary does
 *            not come back with an opinion about the garrison. An acquire that named NO
 *            legs is a general reconnaissance and crosses everything readable — the
 *            vocabulary makes `legRefs` conditional, and a lawful mission must not be inert.
 *   REFUTE   crosses everything readable. Contradiction is the point: the same fold that
 *            re-anchors the value collapses the confidence that was wrong.
 *
 * ⚠ TWO PRODUCTS REFUSE WITHOUT A PRIOR, AND THE REFUSAL IS THE NO-FABRICATION RULE. A
 * CONFIRM with no prior belief has nothing to assert and a REFUTE has nothing to
 * contradict; landing either would MATERIALIZE a neutral opinion the court never held and
 * stamp it with a spy's confidence. ACQUIRE is the one product that may create a belief,
 * which is exactly the `unknown → known` road the sovereignty market's distant legs need.
 *
 * @param {{product?: unknown, prior?: unknown, read?: unknown, legRefs?: unknown,
 *   conditionsLit?: unknown}} args
 * @returns {{groundTruth: Record<string, unknown>, legsFilled: string[],
 *   legsUnfilled: string[], crossed: string[], refusal: string}}
 */
export function productGroundTruth({ product, prior, read, legRefs, conditionsLit } = {}) {
  const observed = read && typeof read === 'object' ? recordOf(read) : {};
  const slots = recordOf(observed.slots);
  const conditions = recordOf(observed.conditions);
  const held = prior && typeof prior === 'object' && !Array.isArray(prior)
    ? /** @type {Record<string, unknown>} */ (prior)
    : null;
  /** @type {Record<string, unknown>} */
  const base = held ? { ...held } : {
    allianceLabel: 'unknown',
    confidence01: 0,
    faithLabel: null,
    lastUpdateTick: 0,
    readiness: BELIEF_TUNING.NEUTRAL_READINESS,
    strengthBand: BELIEF_TUNING.NEUTRAL_STRENGTH_BAND,
  };
  const word = String(product);
  /** @type {string[]} */
  const legsFilled = [];
  /** @type {string[]} */
  const legsUnfilled = [];
  /** @type {string[]} */
  const crossed = [];
  const cross = (/** @type {string} */ key, /** @type {unknown} */ value) => {
    base[key] = value;
    crossed.push(key);
  };
  const refs = Array.isArray(legRefs) ? legRefs.map((ref) => text(ref)).filter(Boolean) : [];
  const sweeping = word === 'refute' || (word === 'acquire' && !refs.length);
  if (!held && (word === 'confirm' || word === 'refute')) {
    return {
      groundTruth: base,
      legsFilled,
      legsUnfilled,
      crossed,
      refusal: word === 'confirm' ? 'nothing_to_confirm' : 'nothing_to_refute',
    };
  }
  if (sweeping) {
    for (const key of Object.keys(slots).sort()) cross(key, slots[key]);
    if (Object.keys(conditions).length && conditionsLit === true) {
      base.conditionsBands = { ...recordOf(base.conditionsBands), ...conditions };
      crossed.push('conditionsBands');
    }
  } else if (word === 'acquire') {
    /** @type {Record<string, unknown>} */
    const nextConditions = { ...recordOf(base.conditionsBands) };
    let conditionsTouched = false;
    for (const ref of [...refs].sort()) {
      const mapping = LEG_SLOTS[ref];
      if (!mapping) { legsUnfilled.push(ref); continue; }
      if (mapping.family === 'core') {
        if (!(mapping.slot in slots)) { legsUnfilled.push(ref); continue; }
        cross(mapping.slot, slots[mapping.slot]);
        legsFilled.push(ref);
        continue;
      }
      if (conditionsLit !== true || !(mapping.slot in conditions)) {
        legsUnfilled.push(ref);
        continue;
      }
      nextConditions[mapping.slot] = conditions[mapping.slot];
      conditionsTouched = true;
      legsFilled.push(ref);
    }
    if (conditionsTouched) {
      base.conditionsBands = nextConditions;
      crossed.push('conditionsBands');
    }
  }
  return { groundTruth: base, legsFilled, legsUnfilled, crossed, refusal: '' };
}

/**
 * §3.6's common report shape — ONE synthetic BeliefReport, first-hand and fresh.
 *
 * ⚠ MEASURED DIVERGENCE FROM THE VOLUME, RECORDED RATHER THAN SILENTLY RECONCILED. §3.6
 * writes `arrivalTick: <landing tick>` into this shape. The LIVE `BeliefReport` typedef
 * (beliefMap.js) carries `ageTicks`, not `arrivalTick`, and `aggregateReports` decays on
 * `ageTicks`; a report carrying `arrivalTick` would have been a key nothing reads and a
 * recency term silently pinned at zero age. The tree wins: the landing tick is what the
 * caller passes as `now`, and the report is fresh at landing, so `ageTicks` is 0.
 *
 * @param {{product?: unknown, errandId?: unknown, sourceId?: unknown, accuracy01?: unknown,
 *   completeness01?: unknown}} args
 * @returns {Record<string, unknown>}
 */
export function buildProductReport({
  product, errandId, sourceId, accuracy01, completeness01,
} = {}) {
  const accuracy = Math.max(0, Math.min(1, num(accuracy01, 0)));
  const completeness = Math.max(PRODUCT_TUNING.COMPLETENESS_FLOOR,
    Math.min(1, num(completeness01, 0)));
  const source = text(sourceId);
  return {
    accuracy01: round4(accuracy),
    ageTicks: 0,
    completeness01: round4(completeness),
    hopCount: 0,
    independentSources: 1,
    score: PRODUCT_TUNING.REPORT_SCORE,
    sortKey: `espionage.${String(product)}.${text(errandId)}`,
    // The credibility closure weighs this — a discredited agent's word is worth less, which
    // is the taint model reaching the product for free rather than through coupling code.
    ...(source ? { sourceId: source } : {}),
  };
}

/**
 * §3.7 — LOSE THE SPY, KEEP THE INTEL. Which gathered partials can still land.
 *
 * THE WHOLE ASYMMETRY IS THIS FUNCTION, and it is stated once so the two arms cannot drift:
 *   MAGIC  — every partial already marked `sentHome` LANDED at its send tick and stays
 *            landed; everything unsent dies with the man.
 *   MUNDANE— nothing has left the agent's head, so a capture loses the spy AND the whole
 *            gradient. The patience timeout carries the drama.
 * With no capture, everything gathered lands at the home mouth in either world.
 *
 * @param {{gathered?: unknown, captured?: unknown, magic?: unknown}} args
 * @returns {{landable: Array<Record<string, unknown>>, lost: Array<Record<string, unknown>>,
 *   reason: string}}
 */
export function landableGatherings({ gathered, captured, magic } = {}) {
  const rows = (Array.isArray(gathered) ? gathered : []).map(recordOf);
  if (captured !== true) return { landable: rows, lost: [], reason: 'uncaught' };
  if (magic === true) {
    const landable = rows.filter((row) => row.sentHome === true);
    return {
      landable,
      lost: rows.filter((row) => row.sentHome !== true),
      reason: 'caught_magic_partials_kept',
    };
  }
  return { landable: [], lost: rows, reason: 'caught_mundane_all_lost' };
}

/**
 * §3.14 — THE GRADE AT CLOSE, against the bar the mission was SENT to clear.
 *
 * The bar is `demand` and the arithmetic is ES-0's `missionGradeFor`: one bar, three
 * consumers (the deliberation dispatch, the magic early resolve, and this), and no second
 * spelling of "how sure did we need to be".
 *
 * ⚠ AN UNFILLED LEG CAPS THE GRADE AT `partial`. A mission that landed a high confidence
 * while leaving a leg it was sent for unfillable did not do what it was asked; grading it
 * `met` would let STOP-ES3-1's dead leg report success. Pure, and never persisted.
 *
 * @param {{demand?: unknown, landedConfidence01?: unknown, legsUnfilled?: unknown}} args
 * @returns {{grade: string, bestConfidence01: number, capped: boolean}}
 */
export function freshMissionGradeFor({ demand, landedConfidence01, legsUnfilled } = {}) {
  const best = Math.max(0, Math.min(1, num(landedConfidence01, 0)));
  const grade = missionGradeFor({ bestConfidence01: best, demand });
  const unfilled = Array.isArray(legsUnfilled) ? legsUnfilled.length : 0;
  if (unfilled > 0 && (grade === 'met' || grade === 'exceeded')) {
    return { grade: 'partial', bestConfidence01: best, capped: true };
  }
  return { grade, bestConfidence01: best, capped: false };
}

/**
 * §3.6 — LAND ONE PRODUCT: the belief write, through the ONE road.
 *
 * `reconcileBelief` does the arithmetic and `foldBeliefAxes` folds the axis families when
 * they are lit — this function's whole job is to hand them lawful arguments and to write
 * the result into the observer's governing-seat slot without disturbing any other slot.
 *
 * THE DEGRADED ARM IS DECLARED, NEVER SILENT (the SP-C idiom). With
 * `believedConditionsEnabled` dark the axis legs are untouched and `familiesAbsent` names
 * the missing family on the receipt, because a product that quietly dropped half its
 * payload is the ghost-write class.
 *
 * @param {{worldState?: unknown, observerId?: unknown, subjectId?: unknown,
 *   groundTruth?: unknown, reports?: unknown, tick?: unknown,
 *   credibilityOf?: ((sourceId: string) => number)|null}} args
 * @returns {{worldState: unknown, changed: boolean, record: Record<string, unknown>|null,
 *   familiesAbsent: ReadonlyArray<string>, reason: string}}
 */
export function landEspionageProduct({
  worldState, observerId, subjectId, groundTruth, reports, tick, credibilityOf = null,
} = {}) {
  const observer = text(observerId);
  const subject = text(subjectId);
  const rows = Array.isArray(reports) ? reports : [];
  const inert = (/** @type {string} */ reason) => ({
    worldState, changed: false, record: null, familiesAbsent: Object.freeze([]), reason,
  });
  if (!observer || !subject || observer === subject) return inert('invalid_pair');
  if (!rows.length) return inert('no_reports');
  if (!beliefsActive(/** @type {Parameters<typeof beliefsActive>[0]} */ (worldState))) {
    return inert('beliefs_dark');
  }
  const axesLit = beliefAxesActive(
    /** @type {Parameters<typeof beliefAxesActive>[0]} */ (worldState),
  );
  const gates = subjectAxesActive(
    /** @type {Parameters<typeof subjectAxesActive>[0]} */ (worldState),
  );
  /** @type {string[]} */
  const familiesAbsent = [];
  if (!axesLit) familiesAbsent.push('beliefAxes');
  if (!gates || gates.conditions !== true) familiesAbsent.push('believedConditions');
  const prior = beliefRecord(
    /** @type {Parameters<typeof beliefRecord>[0]} */ (worldState), observer, subject,
  );
  const truth = recordOf(groundTruth);
  // D-1's two fields are REQUIRED by the axis fold and are absent from a cold record. The
  // seeds below are the axis family's OWN neutral answers (`trendBandFromHistory` returns 0
  // for an absent history; an unresolved observance is null), so seeding them states no
  // opinion the observer did not already hold.
  const composed = axesLit
    ? {
      ...truth,
      populationTrendBand: num(truth.populationTrendBand, num(recordOf(prior).populationTrendBand, 0)),
      observanceLabel: truth.observanceLabel ?? recordOf(prior).observanceLabel ?? null,
    }
    : truth;
  const next = reconcileBelief({
    prior: /** @type {Parameters<typeof reconcileBelief>[0]['prior']} */ (prior),
    groundTruth: /** @type {Parameters<typeof reconcileBelief>[0]['groundTruth']} */ (
      /** @type {unknown} */ (composed)
    ),
    reports: /** @type {Parameters<typeof reconcileBelief>[0]['reports']} */ (
      /** @type {unknown} */ (rows)
    ),
    now: Math.max(0, Math.trunc(num(tick, 0))),
    credibilityOf,
    axesActive: axesLit,
    subjectId: subject,
    subjectAxes: gates,
  });
  const maps = recordOf(getSpatialLedger(
    /** @type {Parameters<typeof getSpatialLedger>[0]} */ (worldState), 'beliefMaps',
  ));
  const byFaction = recordOf(maps[observer]);
  const seat = recordOf(byFaction[GOVERNING_SEAT_KEY]);
  if (JSON.stringify(seat[subject]) === JSON.stringify(next)) {
    return {
      worldState,
      changed: false,
      record: /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (next)),
      familiesAbsent: Object.freeze(familiesAbsent),
      reason: 'unchanged',
    };
  }
  const nextMaps = {
    ...maps,
    [observer]: { ...byFaction, [GOVERNING_SEAT_KEY]: { ...seat, [subject]: next } },
  };
  return {
    worldState: setSpatialLedger(
      /** @type {Parameters<typeof setSpatialLedger>[0]} */ (worldState), 'beliefMaps', nextMaps,
    ),
    changed: true,
    record: /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (next)),
    familiesAbsent: Object.freeze(familiesAbsent),
    reason: 'landed',
  };
}
