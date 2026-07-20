/**
 * roads/ops.js — THE PARTY'S HAND (ENGINE LIFT #5; DESIGN_THE_ROADS.md §11). The two
 * roads-hostage intervention op bodies: `ransom-npc` and `rescue-npc`.
 *
 * ── THE MARKER MODEL (the stasis-collision precedent, §3) ──────────────────────────
 * The roads mover (roadsKernel.advanceLitRoads) is the SINGLE WRITER of
 * spatialLedgers.roads (law 6). A party op therefore NEVER writes the ransom ledger
 * directly — exactly as a DM stasis-npc on a traveller writes only npc.stasis and the
 * mover reacts (§3 DM-op collisions). These ops write ONE marker onto the hostage's
 * whereabouts mirror — `whereabouts.partyRelease = 'ransom' | 'rescue'` — and the mover,
 * on its next tick's RANSOM PASS, consumes it as an early-release event with the
 * kind-specific write schedule:
 *   • ransom  → release + returning leg; the captor STILL books the prosperity pulse
 *     (the party met the price), but the home seat skips the final legitimacy hit AND
 *     the pillar prosperity debit (the party's coin covered them, not the treasury).
 *   • rescue  → release + returning leg; NO captor credit; the covert conversion is
 *     VOIDED (leverage broken, not bargained); the captor↔home relationship worsens
 *     through the EXISTING inflame_relationship party impact (partyImpactKinds.js —
 *     the dispatcher fires recordPartyImpact; no new relationship writer here).
 * The marker rides INSIDE whereabouts, which the mover fully rewrites every tick from
 * the ledger — so it is self-clearing: the tick that consumes it writes the returning
 * mission's whereabouts (no marker) in its place. A stale marker on a non-hostage is a
 * no-op the mirror pass drops.
 *
 * ── SECRET BY CONSTRUCTION ── the marker lives on npc.whereabouts, which is never added
 * to any public/gallery allowlist (§15) — it ships nowhere.
 *
 * ── DORMANCY ── none of this runs unless a party op is used on a live hostage; goldens
 * are byte-identical. Pure, deterministic, side-effect-free.
 *
 * @enforced-by tests/domain/roadsParty.test.js
 */

/** The two release modes and their edit-kind spellings. */
export const ROADS_RELEASE_MODE = Object.freeze({ 'ransom-npc': 'ransom', 'rescue-npc': 'rescue' });

/** A roads-editable NPC (only the fields the ops read/write).
 * @typedef {{ whereabouts?: { state?: string, placeId?: string, partyRelease?: string } &
 *   Record<string, unknown> } & Record<string, unknown>} RoadsOpNpc */
/** @typedef {{ npcs?: RoadsOpNpc[] } & Record<string, unknown>} RoadsOpSettlement */

/**
 * Is this NPC a roads HOSTAGE (the only valid target of a party intervention)? Pure, total.
 * @param {unknown} npc @returns {boolean}
 */
export function isRoadsHostage(npc) {
  const w = npc && typeof npc === 'object' ? /** @type {Record<string, unknown>} */ (npc).whereabouts : null;
  return !!(w && typeof w === 'object' && /** @type {Record<string, unknown>} */ (w).state === 'hostage');
}

/**
 * Apply a party hostage-intervention: stamp `whereabouts.partyRelease = mode` so the mover
 * releases the captive on its next tick (§11). Pure — returns { ok, reason, settlement } with
 * a NEW settlement (never mutates the input). Refuses a non-hostage / bad index / unknown kind.
 * @param {RoadsOpSettlement} settlement @param {number} npcIndex @param {string} editKind  'ransom-npc' | 'rescue-npc'
 * @returns {{ ok: boolean, reason: string|null, settlement: RoadsOpSettlement }}
 */
export function applyRoadsPartyRelease(settlement, npcIndex, editKind) {
  const mode = (/** @type {Record<string, string>} */ (ROADS_RELEASE_MODE))[editKind];
  if (!mode) return { ok: false, reason: `unknown roads op "${String(editKind)}"`, settlement };
  const npcs = settlement?.npcs;
  if (!Array.isArray(npcs) || !npcs[npcIndex]) return { ok: false, reason: 'no npc at index', settlement };
  const prev = npcs[npcIndex];
  if (!isRoadsHostage(prev)) return { ok: false, reason: 'not a roads hostage', settlement };
  const w = /** @type {Record<string, unknown>} */ (prev.whereabouts || {});
  const nextNpcs = npcs.slice();
  nextNpcs[npcIndex] = { ...prev, whereabouts: { ...w, partyRelease: mode } };
  return { ok: true, reason: null, settlement: { ...settlement, npcs: nextNpcs } };
}

/**
 * The captor id a hostage is held at (whereabouts.placeId), for the rescue op's inflame
 * target + the ransom/rescue display copy. '' when unreadable. Pure.
 * @param {unknown} npc @returns {string}
 */
export function captorOfHostage(npc) {
  const w = npc && typeof npc === 'object' ? /** @type {Record<string, unknown>} */ (npc).whereabouts : null;
  return w && typeof w === 'object' ? String(/** @type {Record<string, unknown>} */ (w).placeId || '') : '';
}

/**
 * Build the EXISTING inflame_relationship party-impact action for a rescue (partyImpactKinds.js
 * — reused verbatim; no new relationship writer). The jailbreak worsens the captor↔home edge.
 * Returns null when either endpoint is missing. Pure.
 * @param {string} homeId  the hostage's home settlement (the edited save)
 * @param {string} captorId  whereabouts.placeId
 * @returns {{ kind: 'inflame_relationship', settlementId: string, relationshipTargetId: string }|null}
 */
export function roadsRescueImpactAction(homeId, captorId) {
  const h = String(homeId || ''); const c = String(captorId || '');
  if (!h || !c || h === c) return null;
  return { kind: 'inflame_relationship', settlementId: h, relationshipTargetId: c };
}
