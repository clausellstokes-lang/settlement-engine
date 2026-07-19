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
 * Wave 4f composition note: deity-ref RESOLUTION runs through
 * buildRegistryFromStore → the customRegistry, which now carries the `deities`
 * category — so an authored deity ref resolves and the embed path is LIVE (the
 * dormant-but-correct 4a state is closed).
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

import { buildRegistryFromStore, mintDeityRef } from '../lib/customRegistry.js';
import { reconcileCultImposition } from '../domain/worldPulse/religionState.js';
import { deitySnapshotFrom } from './deitySnapshot.js';

// deitySnapshotFrom lives in the zero-import ./deitySnapshot.js leaf since the
// de-eager lane (2026-07-19): this module is now loaded ONLY via dynamic import
// (the async store actions), and the composer field's static need for the
// snapshot builder must not re-anchor the whole registry graph. Re-exported
// verbatim so existing importers keep the single source of truth.
export { deitySnapshotFrom } from './deitySnapshot.js';

/**
 * Assign (or clear) the current settlement's primary deity — the STORE half of
 * the embed-on-assign bridge. This is the ONLY place a deity ref is resolved
 * against customContent: we look the authored deity up here, build a frozen
 * snapshot, and dispatch SET_PRIMARY_DEITY with the snapshot already in the
 * payload. The pure mutate.js handler commits it.
 *
 * Pass a falsy `deityRefId` to clear the assignment (returns to dormant). Premium
 * gating is enforced at the UI (canUseCustomContent); a free user who somehow
 * dispatched this still can't advance time, so the assignment is inert (D.0).
 *
 * @param {() => any} get           the slice's store getter
 * @param {string|null} deityRefId  a `custom:<localUid>` ref, or null to clear
 * @returns the resulting log entry, or null if nothing happened
 */
export function setPrimaryDeityImpl(get, deityRefId) {
  const state = get();
  if (!state.settlement) return null;

  if (!deityRefId) {
    return state.applyEvent({
      type: 'SET_PRIMARY_DEITY',
      targetId: null,
      payload: { deityRef: null, snapshot: null },
    });
  }

  // Resolve the ref → authored deity → frozen snapshot. Resolution happens HERE
  // (intent time, store layer), never inside the pulse.
  const registry = buildRegistryFromStore(get);
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
 * @param {() => any} get            the slice's store getter
 * @param {string|null} deityRefId   a `custom:<localUid>` ref, or null to remove
 * @param {string|null} [removeRef]  when clearing, the specific cult ref to drop
 * @returns the resulting log entry, or null if nothing happened
 */
export function imposeCultImpl(get, deityRefId, removeRef = null) {
  const state = get();
  if (!state.settlement) return null;
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
  const registry = buildRegistryFromStore(get);
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
