/**
 * domain/intent/opVocabulary.js — the CLIENT builder of the intent-compiler's TOOL SCHEMA
 * (Surveyor S3, DESIGN_AI_CONTROL_SURFACE §2 stage 3).
 *
 * The op registry IS the tool schema. Mirroring S1's retrieval architecture (the client
 * builds the bundle and POSTs it; the edge validates shape + membership), the client
 * builds the op-VOCABULARY descriptor here from the SAME registries the manual UI uses —
 * the 40-type canon-event registry (src/domain/events/registry.js) + the 12 party-impact
 * kinds (src/domain/worldPulse/partyImpactKinds.js) — and POSTs it to the interpret-session
 * edge, which grounds the compiler on it and rejects any op outside it (the schema wall).
 *
 * PURITY / BUDGET: no transport, no side effects, no eager importer. Read only by the lazy
 * interpret panel/transport (rides the AiAnalystPanel lazy chunk), so it costs ZERO eager
 * bytes. It emits only registered type strings — never engine internals.
 */

import { EVENT_TYPES } from '../events/registry.js';
import { PARTY_IMPACT_KINDS } from '../worldPulse/partyImpactKinds.js';

/**
 * The identity-mutating canon-event types — those that remove, replace, or re-seat a NAMED
 * entity. Under a CANONIZED campaign phase these need explicit DM consent (the CANON_IDENTITY
 * protected flag). A frozen subset of EVENT_TYPES; the pin asserts every member is a real
 * registered type (so a rename in the registry can never leave a stale identity guard).
 */
export const IDENTITY_EVENT_TYPES = Object.freeze([
  'KILL_NPC', 'PROMOTE_NPC', 'DEMOTE_NPC', 'ASSIGN_NPC_TO_ROLE', 'KILL_LEADER',
  'DESTROY_SETTLEMENT', 'CHANGE_RULING_POWER', 'REMOVE_INSTITUTION',
  // Wave R-1 (named-fate cluster, atlas queue #2): exposing a CORRUPT NPC does not
  // just flag them — exposeCorruptNpc (mutateEntities.js) ousts the named character
  // and installs a generated successor in their seat. A roster deletion hidden in a
  // verb chosen for another purpose needs the same explicit consent as KILL_NPC.
  'EXPOSE_CORRUPTION',
]);

/**
 * The identity-mutating PARTY-IMPACT kinds — the party arm's counterpart to
 * IDENTITY_EVENT_TYPES (Wave R-1, atlas queue #2). The party vocabulary never rode
 * the identity guard at all, yet `remove_npc` deletes the named NPC's roster row
 * outright (partyImpact.js 'remove_npc' outcome) — strictly more destructive than
 * KILL_NPC's tombstone. Party impacts always address a canonized campaign world,
 * so consent for these is NOT phase-gated.
 */
export const IDENTITY_PARTY_KINDS = Object.freeze(['remove_npc']);

/**
 * The identity event types whose consent is NOT phase-gated (Wave R-1 MUST-FIX).
 * The CANON_IDENTITY gate scopes canon verbs to the canonized phase on the theory
 * that a draft edit is authorial — but EXPOSE_CORRUPTION DELETES its target
 * (exposeCorruptNpc ousts the corrupt NPC and seats a generated successor,
 * mutateEntities.js) in draft exactly as in canon, so the phase gate is wrong for
 * it — the same argument that made the party arm's remove_npc phase-independent.
 * KILL_NPC/KILL_LEADER stay phase-gated: a draft kill leaves a tombstone, a
 * genuinely different (authorial, recoverable) act. Subset of IDENTITY_EVENT_TYPES.
 * MIRRORS the edge's PHASE_INDEPENDENT_IDENTITY_EVENT_TYPES (interpretCore.ts).
 */
export const PHASE_INDEPENDENT_IDENTITY_EVENT_TYPES = Object.freeze(['EXPOSE_CORRUPTION']);

/** The identity consent-flag value — one spelling, two computers: MIRRORS the edge's
 *  PROTECTED_FLAGS.CANON_IDENTITY (interpret-session/interpretCore.ts). The edge stamps
 *  it at compile; applyIdentityConsentFlags re-derives it client-side so the review
 *  barrier holds even against an older deployed edge. */
export const CANON_IDENTITY_FLAG = 'canon_identity';

/**
 * Build the op-vocabulary descriptor the client POSTs to interpret-session. Pure.
 * @returns {{ canonEventTypes: string[], partyImpactKinds: string[],
 *            identityEventTypes: string[], identityPartyKinds: string[] }}
 */
export function buildOpVocabulary() {
  const canonEventTypes = [...EVENT_TYPES];
  const canonSet = /** @type {Set<string>} */ (new Set(canonEventTypes));
  const partyImpactKinds = Object.keys(PARTY_IMPACT_KINDS);
  return {
    canonEventTypes,
    partyImpactKinds,
    // Keep only identity types/kinds that are actually registered (defensive against drift).
    identityEventTypes: IDENTITY_EVENT_TYPES.filter((t) => canonSet.has(t)),
    identityPartyKinds: IDENTITY_PARTY_KINDS.filter((k) => partyImpactKinds.includes(k)),
  };
}

/**
 * Client-side identity-flag hardening (Wave R-1, atlas queue #2). The protected-consent
 * barrier (interpretReview.reviewInterpretation) acts on `op.protectedFlags`, which the
 * EDGE computes from the posted vocabulary + protected context. This re-derives the
 * CANON_IDENTITY flag locally and UNIONS it in, so a named-fate op cannot reach an
 * unconsented apply through a deployed edge that predates the party-arm rule or a
 * request whose protected context was dropped. Union-only — never removes an
 * edge-computed flag — and pure (returns a new interpretation, input untouched).
 *
 * @param {{ ops?: Array<{ family?: string, opType?: string, protectedFlags?: string[] }>|null }|null|undefined} interpretation
 * @param {{ identityLockedPhase?: boolean }} [ctx] whether the settlement phase is 'canon'
 * @returns {{ ops?: Array<{ family?: string, opType?: string, protectedFlags?: string[] }>|null }|null|undefined}
 */
export function applyIdentityConsentFlags(interpretation, { identityLockedPhase = false } = {}) {
  if (!interpretation || !Array.isArray(interpretation.ops)) return interpretation;
  const { identityEventTypes, identityPartyKinds } = buildOpVocabulary();
  const canonIdentity = new Set(identityEventTypes);
  const partyIdentity = new Set(identityPartyKinds);
  const phaseFreeIdentity = new Set(PHASE_INDEPENDENT_IDENTITY_EVENT_TYPES);
  return {
    ...interpretation,
    ops: interpretation.ops.map((op) => {
      const opType = op?.opType || '';
      const identityGraze =
        (op?.family === 'canon_event' && identityLockedPhase && canonIdentity.has(opType))
        // Deleting canon verbs are consent-gated in EVERY phase — see
        // PHASE_INDEPENDENT_IDENTITY_EVENT_TYPES above.
        || (op?.family === 'canon_event' && phaseFreeIdentity.has(opType))
        || (op?.family === 'party_impact' && partyIdentity.has(opType));
      if (!identityGraze) return op;
      const flags = Array.isArray(op.protectedFlags) ? op.protectedFlags : [];
      if (flags.includes(CANON_IDENTITY_FLAG)) return op;
      return { ...op, protectedFlags: [...flags, CANON_IDENTITY_FLAG] };
    }),
  };
}

/**
 * The consent-barrier DISCLOSURE for ops that delete a named character (Wave R-1,
 * atlas queue #2 — including path 3, the party-caused KILL → remove_npc linkage in
 * settlementSlice.applyEvent). The generic consent line says only "protected
 * constraint"; these say what is actually at stake, so consenting to a party-caused
 * kill is informed consent to the roster deletion it triggers. One string per verb,
 * individually vetoable. Returns null for ops with no deletion tail. Pure.
 *
 * @param {{ opType?: string, params?: Record<string, unknown> }|null|undefined} op
 * @returns {string|null}
 */
export function identityConsentNote(op) {
  const opType = op?.opType;
  if (opType === 'remove_npc') {
    return 'This removes the named character from the campaign roster entirely.';
  }
  if (opType === 'EXPOSE_CORRUPTION') {
    return 'If the target is a corrupt character, they are ousted and replaced by a successor.';
  }
  const partyCaused = !!(op?.params && /** @type {Record<string, unknown>} */ (op.params).partyCaused);
  if ((opType === 'KILL_NPC' || opType === 'KILL_LEADER') && partyCaused) {
    return 'Party-caused: the character’s roster entry is removed across the campaign, not just marked dead.';
  }
  return null;
}

/** An entity as the protection scan needs it (a structural slice of NPC / institution /
 *  faction shapes — only the lock markers + id are read).
 *  @typedef {{ id?: string|number, _authored?: boolean, locked?: boolean, pinned?: boolean }} ProtectableLite */

/** True iff an entity carries a DM authorship / lock marker (the protected-target signal).
 *  @param {ProtectableLite|null|undefined} entity @returns {boolean} */
function isProtectedEntity(entity) {
  return !!entity && typeof entity === 'object' &&
    (entity._authored === true || entity.locked === true || entity.pinned === true);
}

/** Collect the ids of protected entities in a collection (NPCs / institutions / factions).
 *  @param {ProtectableLite[]|undefined} list @returns {string[]} */
function protectedIdsIn(list) {
  /** @type {string[]} */
  const ids = [];
  for (const e of Array.isArray(list) ? list : []) {
    if (isProtectedEntity(e) && (typeof e.id === 'string' || typeof e.id === 'number')) ids.push(String(e.id));
  }
  return ids;
}

/**
 * Build the PROTECTED CONTEXT the client POSTs alongside the vocabulary — the ids of
 * hand-authored/locked entities + whether the campaign is canonized. The compiler flags any
 * op grazing these so the review UI raises a consent barrier. Pure.
 *
 * @param {{ npcs?: ProtectableLite[], institutions?: ProtectableLite[], factions?: ProtectableLite[] }|null} settlement
 * @param {string} [phase] the settlement's lifecycle phase ('draft' | 'canon')
 * @returns {{ protectedTargets: string[], identityLockedPhase: boolean }}
 */
export function buildProtectedContext(settlement, phase) {
  const s = settlement && typeof settlement === 'object' ? settlement : {};
  const protectedTargets = [
    ...protectedIdsIn(s.npcs),
    ...protectedIdsIn(s.institutions),
    ...protectedIdsIn(s.factions),
  ];
  return {
    protectedTargets: [...new Set(protectedTargets)],
    identityLockedPhase: phase === 'canon',
  };
}
