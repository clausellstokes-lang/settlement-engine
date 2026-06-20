/**
 * domain/worldPulse/subsystemActivation.js — the reusable "dormant-until-enabled"
 * activation gate for premium simulation subsystems.
 *
 * A subsystem (religion today; future opt-in mechanics tomorrow) stays a PURE
 * NO-OP until its activation predicate holds for the current world snapshot. A
 * campaign that never opts in therefore runs the legacy engine byte-for-byte —
 * the dormancy guarantee that keeps every existing save and golden master stable.
 *
 * Design constraints (load-bearing — keep them true):
 *  - DERIVED, never stored. Activation is read off the pre-computed snapshot, not a
 *    worldState flag, so an imported/forged ledger can never spoof an active
 *    subsystem and the save shape never has to carry an activation bit.
 *  - READ-ONLY and rng-FREE. A gate consumes no randomness and writes nothing, so a
 *    dormant subsystem can never perturb the deterministic stream or the world.
 *  - Registry-based so adding a subsystem is one declarative entry, not a scattered
 *    inline `settlements.some(...)` repeated at every call site.
 */

/**
 * @typedef {(snapshot: any) => boolean} ActivationPredicate
 */

/**
 * @param {any} snapshot
 * @returns {any[]}
 */
function settlementItems(snapshot) {
  return snapshot && Array.isArray(snapshot.settlements) ? snapshot.settlements : [];
}

/**
 * The religion layer activates the instant ANY member settlement carries an
 * embedded primary-deity snapshot (stamped at assign-time by SET_PRIMARY_DEITY).
 * It reads the resolved `config.primaryDeitySnapshot` — never customContent — because
 * the pulse is intentionally decoupled from the store. Until then the campaign's
 * religious behaviour is exactly the legacy `deriveReligiousAuthority` path.
 *
 * @type {ActivationPredicate}
 */
function religionActive(snapshot) {
  return settlementItems(snapshot).some(
    /** @param {any} item */
    item => Boolean(item?.settlement?.config?.primaryDeitySnapshot),
  );
}

/**
 * The declarative gate registry. One entry per opt-in subsystem.
 * @type {Readonly<Record<string, ActivationPredicate>>}
 */
export const SUBSYSTEM_GATES = Object.freeze({
  religion: religionActive,
});

/**
 * Resolve whether a subsystem is active for this snapshot. Accepts a registered
 * gate key or an ad-hoc predicate. Pure and total: an unknown key or a malformed
 * snapshot yields `false` (dormant) rather than throwing — a subsystem only ever
 * switches ON on an affirmative, well-formed signal.
 *
 * @param {any} snapshot - a built world snapshot (read-only)
 * @param {keyof typeof SUBSYSTEM_GATES | ActivationPredicate} gate
 * @returns {boolean}
 */
export function isSubsystemActive(snapshot, gate) {
  const predicate = typeof gate === 'function' ? gate : SUBSYSTEM_GATES[gate];
  if (typeof predicate !== 'function') return false;
  return predicate(snapshot) === true;
}
