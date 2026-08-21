/**
 * domain/townMap/fabric/lateGround.js — ⭐⭐ THE GROUND LAW'S LATE PASSES, AND THE VERSION EACH
 * ONE PRODUCES.
 *
 * ⭐⭐⭐ WHY THIS MODULE EXISTS AT ALL, AND IT IS A CONSEQUENCE OF THE VERSION AXIS RATHER THAN
 * A TIDYING. While the late passes ASSIGNED their results back into `shanty`, `faubourgs` and
 * `stateMarks`, they could not be lifted out of `buildFabric` — a callee that mutates its
 * caller's bindings has to sit inside the caller's scope to reach them. Naming each version
 * (MF-ARCH-2, ODQ §241.2) turns them into ordinary functions that take artifacts and return
 * artifacts, and the extraction falls out. ⭐ THE CLASS, worth the sentence: **A STAGE THAT
 * WRITES BACK CANNOT BE EXTRACTED; A STAGE THAT RETURNS A VERSION CAN.**
 *
 * TWO MEMBERS, and they are together because they are the same law reaching members that did
 * not exist when it first ran:
 *
 *   PASS 2 — the faubourg, the lean-tos and the countryside steadings (stage 6e/6d bodies).
 *   PASS 3 — the §10 state expressions and §18.4's colonized market rows (stage 7/7b bodies).
 *
 * In both, the standing town enters as PRE-ACCEPTED CLAIMS: already legal, never re-clipped and
 * never re-swept, which is what keeps these passes cheap enough to run at all.
 *
 * PURITY: pure; delegates to groundLaw. No Date, no Math.random, no runtime trig.
 */

import { enforceGround, standingBodies } from './groundLaw.js';

/**
 * ⭐ CARRY THE SWEPT GEOMETRY BACK ONTO A LATE BODY FAMILY, BY KEY.
 *
 * ⛔ THE CLIPPED POLYGON MUST COME BACK. The late bodies enter the pass under a PREFIXED key on
 * a spread copy, so the pass clips COPIES — filtering the originals by surviving key would keep
 * the UNCLIPPED bodies and draw exactly the geometry the census had just rejected. ⭐ THE CLASS,
 * the §195.0 class one more time in miniature: **A REPAIR APPLIED TO A COPY IS NOT A REPAIR**,
 * and the surface that gets drawn is the one that was not repaired.
 */
function sweepBack(list, sweptHuts, prefix) {
  /** @type {Map<string, any>} */ const byKey = new Map();
  for (const h of sweptHuts) byKey.set(String(h.key), h);
  return list.filter((b) => byKey.has(`${prefix}|${b.key}`))
    .map((b) => ({ ...b, polygon: byKey.get(`${prefix}|${b.key}`).polygon }));
}

/**
 * PASS 2 · the late bodies of stages 6d–6e.
 * ⭐ THE PASS IS PROVABLY IDEMPOTENT ON THE BODIES THAT ALREADY PASSED: a street clip fires only
 * on penetration and a party clip only on overlap, and the first pass left neither.
 *
 * @param {Object} a
 * @returns {{ huts:any[], buildings:any[], leanTos:any[], reason:string }}
 */
export function sweepLateBodies(a) {
  const lateHuts = a.huts
    .concat(a.faubourgBuildings.map((b) => ({ ...b, key: `faub|${b.key}` })))
    .concat(a.faubourgLeanTos.map((b) => ({ ...b, key: `lean|${b.key}` })));
  const pass = enforceGround({
    parcels: [], masses: [], huts: lateHuts, institutions: a.dwellings,
    preAccepted: standingBodies({
      parcels: a.parcels, merged: a.mergedKeys, masses: a.masses, institutions: a.institutions,
      fossils: a.fossils,
    }),
    channels: a.claims, merged: new Set(), frontage: a.frontage,
    // §5 W1 exit 2: the LATE bodies answer to the ground too. Without this the steadings,
    // the faubourg and the §10 state bodies were the only geometry never asked.
    sub: a.sub || null,
  });
  return {
    huts: pass.huts.filter((h) => !/^(faub|lean)\|/.test(String(h.key))),
    buildings: sweepBack(a.faubourgBuildings, pass.huts, 'faub'),
    leanTos: sweepBack(a.faubourgLeanTos, pass.huts, 'lean'),
    reason: `${pass.streetClips} street clips, ${pass.partyClips} party clips,`
      + ` ${pass.dropped} dropped over the late bodies (faubourg, lean-tos, steadings)`,
  };
}

/**
 * PASS 3 · the §10 state expressions and the §18.4 middle rows, in ONE sweep.
 * ⭐ THEY ARE THE SAME KIND OF THING — a late filled body that did not exist when the first two
 * passes ran — so they take the same law in the same pass rather than growing a fourth.
 *
 * @param {Object} a
 * @returns {{ bodies:any[], groundLawReason?:string }}
 */
export function sweepStateBodies(a) {
  const bodies = a.bodies.concat(a.rows);
  // ⚠ NO `groundLawReason` KEY AT ALL when there is nothing to sweep — never `undefined`.
  // The caller spreads this over `stateMarks`, and a key present with an undefined value
  // would OVERWRITE stateMarks' own 'not yet swept'. ⭐ A SPREAD OVERWRITES WITH UNDEFINED.
  if (!bodies.length) return { bodies };
  const pass = enforceGround({
    parcels: [], masses: [], huts: bodies, institutions: [],
    preAccepted: standingBodies({
      parcels: a.parcels, merged: a.mergedKeys, masses: a.masses, institutions: a.institutions,
      late: true, huts: a.huts, faubourgs: a.faubourgBuildings, leanTos: a.faubourgLeanTos,
      dwellings: a.dwellings, fossils: a.fossils,
    }),
    channels: a.claims, merged: new Set(), frontage: a.frontage,
    // §5 W1 exit 2: the LATE bodies answer to the ground too. Without this the steadings,
    // the faubourg and the §10 state bodies were the only geometry never asked.
    sub: a.sub || null,
  });
  return {
    bodies: pass.huts,
    groundLawReason: `${pass.streetClips} street clips, ${pass.partyClips} party clips,`
      + ` ${pass.dropped} dropped over the §10 state bodies`,
  };
}
