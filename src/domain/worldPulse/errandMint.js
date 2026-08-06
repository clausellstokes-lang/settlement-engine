/**
 * errandMint.js — SP-D. THE GENERALIZED ERRAND MINT HEAD, and the errand spine's one gate.
 *
 * WHAT THIS LEAF IS FOR. `worldState.envoyErrands` was minted for a war: two purposes,
 * one caller, six war flags welded to its door. SP-1/SP-D makes it the estate's ONE
 * purposeful-travel substrate IN PLACE (J-SP-2 — the ledger does not move, chair ruling
 * CR-FP-10 confirmed keep-in-place), and this leaf is the head that generalizes it: it
 * takes a purpose CLASS and a declared/true split, validates both against the closed
 * vocabulary, prices the journey through the family's ONE transit seam, and hands the
 * writer a field block. Five unbuilt volumes mint through here — TRADE's factors,
 * FAITH's legates and pilgrims, ES-1/IN-4's couriers, INTERIOR's emigres — and the
 * consumer registry in the vocabulary leaf is what keeps that a fact rather than a hope.
 *
 * WHY A NEW LEAF AND NOT THE WRITER (the L8 lazy-leaf recipe). `envoyErrand.js` is the
 * family HEAD and it gains ONE delegation call here — nothing else. The SP volume records
 * that file as "AT the effective ceiling"; re-measured at this build it is 695 effective
 * lines against the 800-line domain ceiling, so the ceiling is NOT the binding reason and
 * this header says so rather than inheriting a figure. The binding reason is the one the
 * volume's own collision map gives: the envoy family is the war lane's most recently
 * edited surface, and a delegation-shaped extension keeps this wave's diff small and
 * attributable inside it.
 *
 * ⚠ THE GATE IS READ EXACTLY ONCE IN THE TREE, AND IT IS READ HERE. `errandSpineEnabled`
 * is a VIRTUAL flag under the CQ5 law (FP §3, CR-WR10-C): absent from
 * DEFAULT_SIMULATION_RULES and from every preset spread, so a campaign that never lights
 * it pays ZERO persisted bytes; read strictly with `=== true`, so ABSENT and FALSE are
 * identical at the decision site; manifested in `ENGINE_GATED_VIRTUAL_RULE_KEYS` with its
 * AUTHORED certification row in the SAME COMMIT as this, its first real gate read. ONE
 * by-name read is deliberate on both sides: by NAME because a frozen-list `.every()`
 * conjunction is a computed member access that attributes to no key and hides a wired
 * flag from the engine-gated-key census (lane WW-A shipped exactly that); ONCE because
 * two doors on one flag is how a deleted guard hides behind a surviving one.
 *
 * ⚠ DARK IGNORES THE SPINE ARGUMENTS ENTIRELY — it does not refuse them. A dark world is
 * one in which these fields DO NOT EXIST, so a caller that supplies a purpose class gets
 * an errand without one and the same refusal reasons the war path produced before this
 * leaf existed. That is dormancy, not permissiveness: the dark arm can never WRITE a
 * class, and `tests/property/errandSpineDormancyFence.test.js` hashes a live ten-tick
 * run to prove the ledger is byte-identical either way.
 *
 * ⚠ THE ROUTE PLAN IS NORMALIZED HERE, THROUGH `normalizeRoutePlan`, AND THAT IS THE M
 * SPEED LAW BINDING EVERY PURPOSE CLASS BY CONSTRUCTION. This leaf is an INJECTED-PLAN
 * VALIDATOR in `tests/lint/namedPersonTransitTotality.walker.test.js`'s manifest: it
 * validates a plan the transit owner priced and has no import through which it could
 * grow a local speed floor or clock fraction. A commercial errand and a covert errand
 * cannot travel at different speeds, because there is no second place to say how fast
 * anyone walks.
 *
 * K3 (NOBODY IS EVER CURRENT): the reach is the vocabulary leaf and the transit leaf.
 * Neither can hand back a settlement's real strength, stock or pressure.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation.
 *
 * @enforced-by tests/domain/errandMint.test.js,
 *   tests/property/errandSpineDormancyFence.test.js,
 *   tests/lint/errandConsumerRegistry.walker.test.js,
 *   tests/lint/namedPersonTransitTotality.walker.test.js
 */
import {
  PURPOSE_CLASS_SET,
  asObject,
  purposeClassOf,
  text,
} from './envoyErrandVocabulary.js';
import { errandSpineBlock } from './envoyErrandRecords.js';
import { normalizeRoutePlan } from './envoyErrandTransit.js';

/**
 * THE ONE DOOR. Strict, by name, absent-is-dark.
 *
 * @param {unknown} worldState
 * @returns {boolean}
 */
export function errandSpineActive(worldState) {
  const rules = asObject(asObject(worldState).simulationRules);
  return rules.errandSpineEnabled === true;
}

/**
 * The validated conditional field block for one mint, or `null` when the caller's class
 * cargo is not lawful.
 *
 * THE THREE FIELDS AND WHY EACH IS CONDITIONAL:
 *
 *   `purposeClass`  — written ONLY when it differs from what the mapping row already
 *     derives from the errand's purpose. A peace embassy is `diplomatic` by DATA, so
 *     writing the word onto the row would be a byte per errand restating a derivation
 *     that cannot drift (the row is the single source and `purposeClassOf` is the single
 *     reader). A covert mission wearing an embassy's purpose differs, so it is written.
 *   `declaredPurpose` + `truePurpose` — the cover story, present TOGETHER and ONLY when
 *     they differ (SP §4). Absent means the declared purpose IS the true purpose, which
 *     is the overwhelming case and costs zero bytes.
 *
 * THE INVARIANT A SUPPLIED `truePurpose` MAY NOT BREAK. The true class of an errand is
 * `purposeClassOf(row)` and nothing else. A caller may hand this head a `truePurpose` —
 * the charter's spelling, and ES-1 passes one — but if it disagrees with the resolved
 * class the mint REFUSES rather than storing two answers to one question. A row that can
 * say two different things about what an envoy is really doing is a row a later reader
 * will read the wrong half of.
 *
 * @param {{purpose?:unknown, purposeClass?:unknown, declaredPurpose?:unknown,
 *   truePurpose?:unknown}} args
 * @returns {Record<string, string>|null}
 */
export function errandSpineFields({
  purpose, purposeClass, declaredPurpose, truePurpose,
} = {}) {
  const missionPurpose = text(purpose);
  const written = purposeClass == null ? '' : text(purposeClass);
  if (written && !PURPOSE_CLASS_SET.has(written)) return null;
  // The resolved class: what a reader will get back from this row once it is written.
  const resolved = purposeClassOf({ purpose: missionPurpose, purposeClass: written });
  if (!resolved) return null;
  const declared = declaredPurpose == null ? '' : text(declaredPurpose);
  if (declared && !PURPOSE_CLASS_SET.has(declared)) return null;
  const claimedTrue = truePurpose == null ? '' : text(truePurpose);
  if (claimedTrue && claimedTrue !== resolved) return null;
  // ONE CONSTRUCTOR OF THE BLOCK, and it is the persist side's. The mint decides whether
  // the caller's cargo is LAWFUL; `errandSpineBlock` decides what a lawful row LOOKS
  // LIKE, and it has to, because it is the function that reads the row back. A second
  // drop-when-derivable rule spelled here would agree with that one until the day it
  // did not, and the disagreement would be one byte wide and completely silent.
  return errandSpineBlock({
    purposeClass: written,
    ...(declared && declared !== resolved
      ? { declaredPurpose: declared, truePurpose: resolved }
      : {}),
  }, missionPurpose);
}

/**
 * THE GENERALIZED MINT HEAD. One call, and it answers the two questions every errand mint
 * has to answer before a row exists: is this journey lawfully priced, and is this business
 * a kind of business the estate has a word for?
 *
 * The plan is normalized FIRST and unconditionally, so a dark world and a lit world refuse
 * an unpriceable journey with the same reason at the same moment — the flag can change
 * what an errand IS, never whether the roads are real.
 *
 * @param {{worldState?:unknown, purpose?:unknown, purposeClass?:unknown,
 *   declaredPurpose?:unknown, truePurpose?:unknown, routePlan?:unknown,
 *   fromId?:string, toId?:string, journey?:('outbound'|'return'),
 *   notBeforeTick?:number}} [args]
 * @returns {{ok:boolean, fields:Record<string,string>,
 *   plan:Record<string,unknown>|null, reason:string}}
 */
export function mintErrandSpine({
  worldState,
  purpose = '',
  purposeClass = null,
  declaredPurpose = null,
  truePurpose = null,
  routePlan = null,
  fromId = '',
  toId = '',
  journey = 'outbound',
  // ZERO IS THE "no departure floor" VALUE, and it is exactly equivalent to the absent
  // one rather than a substitute for it: the contract compares
  // `Number(departTick) < notBeforeTick`, every leg clock is a `wholeTick` (>= 0 or
  // rejected), and `x < null` coerces to `x < 0` — so absent and 0 accept precisely the
  // same set of plans. Spelling it 0 keeps the seam strict-typed without inventing a
  // floor no caller asked for.
  notBeforeTick = 0,
} = {}) {
  const plan = normalizeRoutePlan(routePlan, {
    fromId, toId, journey, notBeforeTick,
  });
  if (!plan) return { ok: false, fields: {}, plan: null, reason: 'invalid_route_plan' };
  // DARK: the spine fields do not exist, so nothing the caller said about them is read,
  // refused, or recorded. This is the byte-identity arm.
  if (!errandSpineActive(worldState)) {
    return { ok: true, fields: {}, plan, reason: 'dark' };
  }
  const fields = errandSpineFields({
    purpose, purposeClass, declaredPurpose, truePurpose,
  });
  if (!fields) return { ok: false, fields: {}, plan, reason: 'invalid_purpose_class' };
  return { ok: true, fields, plan, reason: 'spine' };
}
