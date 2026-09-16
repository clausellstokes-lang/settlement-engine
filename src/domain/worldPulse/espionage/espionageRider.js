/**
 * espionageRider.js — ES-Da: §3.4 THE COMPOSITE RIDER, covert cargo on an embassy the
 * court was already sending.
 *
 * docs/DESIGN_FP_ARCH_ES.md §3.4 (the composite mission), §3.5 (the tainted journey),
 * §3.9 (the doctrine read). This leaf answers ONE question — does the embassy this court
 * has already decided to send also carry a watcher, and what is he being sent to settle? —
 * and composes the lawful `covert` sub-record when the answer is yes.
 *
 * ⭐ NOTHING NEW TRAVELS. The traveller, the route, the speed, the concurrency cap, the
 * transit refusals and the persistence are all the peace embassy's, unchanged. This leaf
 * mints no row, schedules no stage, casts no second operative and opens no second
 * purposeful-travel substrate (J-SP-2). It returns CARGO; `envoyDiplomacy.js` hands that
 * cargo to the `mintEnvoyErrand` call the war lane was already about to make.
 *
 * ── ⛔ THIS LEAF MUST NEVER CALL `mintErrandSpine`, DIRECTLY OR THROUGH A RE-EXPORT ────
 * `tests/lint/errandConsumerRegistry.walker.test.js` pins the minter set at EXACT equality
 * and resolves aliases, namespaces and re-export hops to a fixed point, so renaming an
 * import would not dodge it. A fourth minter would also need an `ERRAND_CONSUMERS` row,
 * and adding one would red that walker's DIRECTION 2 (a `built:true` row whose module does
 * not mint). The rider composes; the errand head mints. Those are different verbs and the
 * registry is what keeps them different.
 *
 * ── ⛔ AND IT MUST NEVER SPELL THE ERRAND'S CLASS FIELD ────────────────────────────────
 * The same walker reds any module outside the five-file errand family that names the
 * row's three conditional face fields, and this leaf is outside that family. The class
 * word is written ONCE, as a string literal, at the `envoyDiplomacy.js` call site — a
 * string-literal value escapes the walker's pattern where a variable or a shorthand does
 * not, and the escape is one character wide. Keeping the word out of this file entirely is
 * belt-and-braces: the leaf cannot drift into the walker's jurisdiction later.
 *
 * ── ⚠ WHAT THE REGISTRY CANNOT SEE, RECORDED RATHER THAN DESIGNED AROUND ──────────────
 * `ERRAND_CONSUMERS` credits `espionageMissions.js` as the built `covert` consumer, and
 * that row stays true by its own test (the module still reaches the spine). But after this
 * wave the module that actually causes covert rows to EXIST is `envoyDiplomacy.js`, and no
 * walker can see that. Restructuring the registry to say so would red DIRECTION 2 in both
 * directions, so the gap is recorded here and in the completion receipt instead — the
 * CR-ES5B-4 precedent for a fail-open invisibility nobody can cheaply close.
 *
 * ── DARK ⇒ NOTHING, AND THE BYTE IDENTITY IS A CONSTRUCTION RATHER THAN A CARE ────────
 * Door 1 refuses on `espionageActive` BEFORE this leaf touches a single world object, and
 * a refusing rider returns `covert: null`, which the call site spreads as `{}`. The
 * argument object handed to `mintEnvoyErrand` is therefore byte-for-byte the object that
 * existed before this wave — not an object that happens to compare equal. Absent, `false`,
 * `0` and `'true'` are one world, because the gate's read is the strict `=== true` form.
 *
 * ⚠ EVERY DOOR RETURNS ITS OWN REASON, and that is not decoration. A conjunction whose
 * arms cannot be dropped one at a time is a conjunction nobody has proven, so each refusal
 * below is separately reachable and separately named.
 *
 * ZERO NEW TUNING VALUES. Every threshold the rider needs already exists: the cadence
 * weight is the doctrine leaf's own composed `frequency01`, and the demand bar comes from
 * the ONE bar function so the mission's bar, the early-resolve threshold and the grade at
 * close cannot disagree.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation. The one
 * stochastic choice is a keyed hash over the estate's own stream (L1).
 *
 * @enforced-by tests/domain/espionageRider.test.js,
 *   tests/property/espionageRiderDormancyFence.test.js
 */
import { hash01 } from '../../region/contestMath.js';
import { espionageActive } from './espionageGate.js';
import { dispatchDemandFor, espionageDoctrineFor } from './espionageDoctrineStage.js';

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * THE RIDER DRAW'S IDENTITY — one keyed stream, spelled once (L1, zero new PRNG streams).
 *
 * Keyed on the ERRAND ID rather than on `(courtId, tick)`, and the difference is real: a
 * court may dispatch two episodes on one tick, and keying by court would hand both the
 * identical roll. The errand id derives from the offer, so the draw is deterministic and
 * replay-identical for the same world. It is deliberately NOT `dispatchCadenceKey`, whose
 * `(courtId, tick)` shape would both collide with itself here and correlate with any later
 * dispatcher that reused it.
 *
 * @param {unknown} errandId @returns {string}
 */
export function riderKey(errandId) {
  return `es.rider.${text(errandId)}`;
}

/**
 * §3.4 — DOES THIS EMBASSY CARRY A WATCHER, AND WHAT IS HE SETTLING?
 *
 * Five doors, each with its own reason. The composed sub-record is exactly the shape
 * `normalizeCovertMission` accepts, and every word in it is a member of the errand
 * vocabulary's closed sets.
 *
 * @param {{worldState?: unknown, item?: unknown, fromId?: unknown, toId?: unknown,
 *   errandId?: unknown, tick?: unknown}} [args] `tick` is ACCEPTED and READ NOWHERE — the
 *   draw is errand-keyed (see `riderKey`), so no clock enters this decision.
 * @returns {{covert: Record<string, unknown>|null, reason: string}}
 */
export function covertRiderFor({ worldState, item, fromId, toId, errandId } = {}) {
  // DOOR 1 — THE GATE, FIRST AND BEFORE ANY WORLD OBJECT IS TOUCHED. This is the
  // byte-identity arm, and it is the reason a dark world pays nothing for this wave.
  if (!espionageActive(worldState)) return { covert: null, reason: 'dark' };
  // DOOR 2 — the endpoints the sub-record is built out of. A court cannot watch itself,
  // and an unnamed stop is not a stop.
  const from = text(fromId);
  const to = text(toId);
  const errand = text(errandId);
  if (!from || !to || !errand || from === to) {
    return { covert: null, reason: 'invalid_endpoints' };
  }
  // DOOR 3 — a court whose axes did not resolve slips nobody aboard, and says so in this
  // leaf's own word rather than defaulting to a temperament it never read.
  const doctrine = espionageDoctrineFor({ worldState, item, courtId: from });
  if (!doctrine || doctrine.known !== true) return { covert: null, reason: 'no_doctrine' };
  // DOOR 4 — THE DRAW. Lawless-malicious courts slip a watcher aboard often; lawful-
  // benevolent ones rarely. The weight is the doctrine's own, so no knob is minted here.
  if (hash01(riderKey(errand)) >= Number(doctrine.frequency01)) {
    return { covert: null, reason: 'cadence_declined' };
  }
  return {
    covert: {
      // The bar this dispatch is sent to clear, from the ONE bar function. `urgent` is
      // passed EXPLICITLY rather than left to a default: the decision this embassy carries
      // is already made and accepted, so there is no siege at the gate to lower the bar.
      demand: dispatchDemandFor({ frequency01: doctrine.frequency01, urgent: false }),
      // EXACTLY ONE STOP, and it is the embassy's own destination — which is the whole
      // rider premise. The face is `declared` because the stop IS the public itinerary:
      // the embassy is openly going to this court, and the cover story is true about
      // WHERE the man goes and false only about WHY.
      //
      // ⭐ `stayTicks: 1` IS DERIVED, NOT AUTHORED, AND NOT A TUNING KNOB. `beginEnvoyReturn`
      // refuses before `parlayTick + 1`, so one tick is exactly the stay the embassy's own
      // schedule already reserves — the value is read off the errand family's own law. Zero
      // is measurably wrong: it makes the dwell interval index 1 at the arrival tick, which
      // prices every embassy as an immediately-rooted overstayer.
      itinerary: [{ face: 'declared', settlementId: to, stayTicks: 1 }],
      // `confirm` crosses no observed slot and needs no leg references, which is what keeps
      // this wave at zero new surface. A man confirming what his court already believes
      // about the court across the table is also the honest product for a peace embassy.
      product: 'confirm',
      // ⭐ THE COURT BEING SUED, AND THIS IS THE ES-D REFUSAL'S CONSTRAINT TURNED INTO THE
      // PRODUCT SEMANTICS RATHER THAN WORKED AROUND. The errand record forces a covert
      // row's endpoints to the peace offer's own, so a court can only spy on the court it
      // is suing. This wave does not fight that; it IS that.
      subjectId: to,
    },
    reason: 'rides',
  };
}
