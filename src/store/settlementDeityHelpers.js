/**
 * settlementDeityHelpers.js — the deity/cult assignment action bodies extracted
 * from settlementSlice (god-slice decomposition, review-remediation #5).
 *
 * Both are the STORE half of the embed-on-assign bridge: they resolve a deity ref
 * against customContent HERE (intent time, where the store is available), build a
 * self-contained frozen snapshot, and dispatch through `state.applyEvent(...)` with
 * the snapshot already in the payload — so the pure mutate.js handler and the
 * pulse/derivers read ONLY `config.*DeitySnapshot(s)`, never the store, preserving
 * the headless / single-snapshot determinism contract (subsystemActivation.js
 * flips the religion gate the instant a member carries config.primaryDeitySnapshot
 * or a non-empty config.cultDeitySnapshots).
 *
 * They hold no state: each takes the slice's `get` and returns the resulting log
 * entry (or null when nothing happened). Moving them here shrinks settlementSlice
 * with no behaviour change — the slice keeps thin action methods that delegate
 * straight through, so the public API (names, signatures, return values) is
 * byte-identical. They dispatch via applyEvent and never touch the cloud-write
 * suppression / flush invariant themselves.
 *
 * Wave 4f composition note: deity-ref RESOLUTION runs through a customRegistry
 * built from the active execution context. Standalone work uses the editable
 * account library; campaign work uses its pinned content binding. The registry
 * carries the `deities` category, so authored deity refs resolve without letting
 * a later account edit rewrite established campaign canon.
 *
 * Identity minting (the cross-account collision fix): the ref we EMBED is NOT the
 * `custom:<localUid>` we resolve with — it is a stable, account-scoped identity
 * ref `deity:<scope>:<slug>` minted here via mintDeityRef(raw). scope is the
 * authoring account's localUid for the deity, so two accounts' same-named homebrew
 * gods carry distinct refs and never identity-merge in a shared campaign (the
 * pantheon ratchet keys by this ref; deityIdOf's bare `deity:<name>` fallback,
 * which name-collides, is now unreachable for an assigned deity). Resolution still
 * accepts the incoming `custom:<localUid>`; only the embedded identity changed.
 */

import { buildRegistry, mintDeityRef } from '../lib/customRegistry.js';
import { reconcileCultImposition } from '../domain/worldPulse/religionState.js';
import { deitySnapshotFrom } from '../domain/deitySnapshot.js';
import { customContentForActiveContext } from './activeCustomContentContext.js';

// The zero-import authority lives in domain so headless preview/event paths and
// store intent paths share one source without reversing the engine dependency.
// This module remains dynamically loaded; re-exporting the leaf preserves the
// established helper API without re-anchoring the registry graph.
export { deitySnapshotFrom } from '../domain/deitySnapshot.js';

// ── The PANEL-LANE premium gate for deity writes (owner-queue #27, Wave R-0
// Lane D) — the store seam under the setPrimaryDeity/imposeCult actions (the
// panel + map mounts' dispatch path). SCOPE, honestly: this is NOT the only
// lane that writes deity events. The composer builds the same
// SET_PRIMARY_DEITY / IMPOSE_CULT events itself (eventComposer/buildEvent.js)
// and commits them through EventComposer's applyEvent / applyBatch /
// queued-intention paths without ever crossing this seam — that lane rides the
// canStageDeityEvent UI gates. Single-sourcing the premium check across BOTH
// lanes is Wave R-4's premium-gate scan (docs/CAPABILITY_REMEDIATION_PLAN.md).
// The frozen typed refusal the gate returns. `code` is the machine handle;
// reasons/unlocks carry the SAME translated sentences the affordance manifest's
// SET_PRIMARY_DEITY / IMPOSE_CULT predicates speak (the manifest is a lazy leaf
// the store must not import, so the sentences are pinned equal by test instead
// of by import — tests/store/deityWriteGate.test.js).
export const DEITY_WRITE_REFUSAL = Object.freeze({
  refused: true,
  code: 'custom_content_required',
  reasons: Object.freeze(['Deities come from your custom Compendium.']),
  unlocks: Object.freeze(['Requires premium custom content.']),
});

/**
 * The premium/tier gate every PANEL-LANE deity write (the setPrimaryDeity /
 * imposeCult store actions) consults at the store seam. It wraps the
 * authoritative entitlement selector — authSlice's `canUseCustomContent()`
 * (elevated roles or a tier whose TIER_GATE grants customContent) — the exact
 * selector every UI mirror (composer ctx, panel branches, manifest predicate)
 * already reads. FAIL-CLOSED: a state without the selector refuses, exactly
 * like the UI spelling
 * `typeof s.canUseCustomContent === 'function' ? s.canUseCustomContent() : false`.
 *
 * JUDGMENT — lapsed accounts may SHED (Wave R-0 verifier fix #3; recorded in
 * the wave plan, docs/CAPABILITY_REMEDIATION_PLAN.md; VETOABLE — the veto is
 * to flip this branch back to refuse-all-unentitled): an unentitled account
 * whose settlement OWNS a live embed (a lapsed subscriber, by the panel's own
 * tier-matrix definition) MAY make a `shed` write — clear the patron / remove
 * a cult — but never assign or change. Refusing the shed locked a lapsed
 * subscriber INTO deity content they could no longer remove, incoherent with
 * the ungated undoLastEvent reversing the identical config change. Free tier
 * (unentitled, no embed) is unchanged: refused both directions.
 *
 * Returns null when the write may proceed, else the frozen typed refusal
 * (never a log entry — callers can distinguish it from an applyEvent envelope
 * by `refused: true`).
 * @param {any} state  the store state (a slice `get()` result)
 * @param {{ shed?: boolean }} [opts]  shed: the write only REMOVES owned deity
 *   content (clear patron / remove cult) — the lapsed-allowed direction
 * @returns {typeof DEITY_WRITE_REFUSAL | null}
 */
export function deityWriteGate(state, { shed = false } = {}) {
  const entitled = typeof state?.canUseCustomContent === 'function'
    && state.canUseCustomContent() === true;
  if (entitled) return null;
  if (shed) {
    // Shed-only allowance keys on embed OWNERSHIP, not the entitlement value:
    // an embed can only have been assigned while entitled, so owning one IS
    // the lapsed marker (the same test the panel's LAPSED branch runs).
    const config = state?.settlement?.config || {};
    const ownsLiveEmbed = Boolean(config.primaryDeitySnapshot)
      || (Array.isArray(config.cultDeitySnapshots) && config.cultDeitySnapshots.length > 0);
    if (ownsLiveEmbed) return null;
  }
  return DEITY_WRITE_REFUSAL;
}

/**
 * Assign (or clear) the current settlement's primary deity — the STORE half of
 * the embed-on-assign bridge. This is the ONLY place a deity ref is resolved
 * against customContent: we look the authored deity up here, build a frozen
 * snapshot, and dispatch SET_PRIMARY_DEITY with the snapshot already in the
 * payload. The pure mutate.js handler commits it.
 *
 * Pass a falsy `deityRefId` to clear the assignment (returns to dormant). Premium
 * gating is ENFORCED HERE at the store seam (deityWriteGate → the authoritative
 * canUseCustomContent selector, fail-closed): an unentitled ASSIGN is refused
 * with the typed DEITY_WRITE_REFUSAL before any event is built — the documented
 * D.0 fail-open ("enforced at the UI only") is closed (owner-queue #27). The
 * CLEAR path is a `shed` write: allowed for a lapsed account that owns a live
 * embed (the recorded deityWriteGate JUDGMENT), refused for free tier.
 *
 * @param {() => any} get           the slice's store getter
 * @param {string|null} deityRefId  a `custom:<localUid>` ref, or null to clear
 * @returns the resulting log entry, the typed refusal, or null if nothing happened
 */
export function setPrimaryDeityImpl(get, deityRefId) {
  const state = get();
  if (!state.settlement) return null;

  // FAIL-CLOSED premium gate (the panel-lane seam) — an unentitled ASSIGN is
  // refused BEFORE any dispatch. A falsy ref is the CLEAR — a shed-direction
  // write the gate allows for a lapsed account owning a live embed (JUDGMENT
  // recorded on deityWriteGate; veto = flip the branch back).
  const refusal = deityWriteGate(state, { shed: !deityRefId });
  if (refusal) return refusal;

  if (!deityRefId) {
    return state.applyEvent({
      type: 'SET_PRIMARY_DEITY',
      targetId: null,
      payload: { deityRef: null, snapshot: null },
    });
  }

  // Resolve the ref → authored deity → frozen snapshot. Resolution happens HERE
  // (intent time, store layer), never inside the pulse.
  const registry = buildRegistry(customContentForActiveContext(state));
  const entry = registry.resolve(deityRefId);
  const raw = entry?.raw;
  if (!raw) return null;                              // unknown ref — refuse.
  // Embed the account-scoped IDENTITY ref, not the resolution ref (see header).
  const deityRef = mintDeityRef(raw) || deityRefId;
  return state.applyEvent({
    type: 'SET_PRIMARY_DEITY',
    targetId: deityRef,
    payload: { deityRef, snapshot: deitySnapshotFrom(raw) },
  });
}

/**
 * Impose (or remove) a CULT-level deity on the current settlement — the cult
 * counterpart of setPrimaryDeity. Same embed-on-assign bridge: resolve the ref
 * HERE, dispatch IMPOSE_CULT with the snapshot in the payload, and let the pure
 * handler reconcile it against tier capacity + niche.
 *
 * Pass a falsy `deityRefId` to remove the cult named by `removeRef` (or, with no
 * removeRef, clear all cults). Before dispatching an ADD we run the SAME pure
 * reconciliation as the handler and refuse (return null, no log entry) when the
 * cult can't be seated — so a full small settlement or a patron-niche clash never
 * logs a no-op.
 *
 * Premium gating is ENFORCED HERE at the store seam, exactly as in
 * setPrimaryDeityImpl: deityWriteGate refuses an unentitled IMPOSE (typed,
 * fail-closed) before the resolution or the placement probe run. The REMOVE
 * path is a `shed` write: allowed for a lapsed account that owns a live embed
 * (the recorded deityWriteGate JUDGMENT), refused for free tier.
 *
 * @param {() => any} get            the slice's store getter
 * @param {string|null} deityRefId   a `custom:<localUid>` ref, or null to remove
 * @param {string|null} [removeRef]  when clearing, the specific cult ref to drop
 * @returns the resulting log entry, the typed refusal, or null if nothing happened
 */
export function imposeCultImpl(get, deityRefId, removeRef = null) {
  const state = get();
  if (!state.settlement) return null;

  // FAIL-CLOSED premium gate (the panel-lane seam) — same seam as
  // setPrimaryDeity. A falsy ref is the REMOVE — a shed-direction write the
  // gate allows for a lapsed account owning a live embed (JUDGMENT recorded
  // on deityWriteGate; veto = flip the branch back).
  const refusal = deityWriteGate(state, { shed: !deityRefId });
  if (refusal) return refusal;

  const config = state.settlement.config || {};

  if (!deityRefId) {
    // Remove path — a no-op if there's nothing to drop.
    const cults = Array.isArray(config.cultDeitySnapshots) ? config.cultDeitySnapshots : [];
    if (!cults.length) return null;
    if (removeRef && !cults.some(c => String(c?._deityRef || c?.name || '') === String(removeRef))) return null;
    return state.applyEvent({
      type: 'IMPOSE_CULT',
      targetId: removeRef || null,
      payload: { deityRef: removeRef || null, snapshot: null },
    });
  }

  // Resolve the ref → authored deity → frozen snapshot (intent time, store layer).
  const registry = buildRegistry(customContentForActiveContext(state));
  const entry = registry.resolve(deityRefId);
  const raw = entry?.raw;
  if (!raw) return null;                              // unknown ref — refuse.
  // Embed the account-scoped IDENTITY ref, not the resolution ref (see header).
  const deityRef = mintDeityRef(raw) || deityRefId;
  const snapshot = deitySnapshotFrom(raw);
  // Pre-check placement with the same pure rule the handler uses, so a refused
  // imposition never logs a no-op event.
  const probe = reconcileCultImposition({
    patron: config.primaryDeitySnapshot || null,
    cults: Array.isArray(config.cultDeitySnapshots) ? config.cultDeitySnapshots : [],
    tier: state.settlement.tier || config.tier || 'village',
    deity: { _deityRef: deityRef, ...snapshot },
  });
  if (probe.action === 'refused') return null;
  return state.applyEvent({
    type: 'IMPOSE_CULT',
    targetId: deityRef,
    payload: { deityRef, snapshot },
  });
}
