/**
 * store/canonLifecycleTelemetry.js — the canonize/uncanonize analytics tail as a
 * LAZY LEAF (Wave R-1). Fire-and-forget cold path, kept OFF the eager first-paint
 * chunk (the roadsRescueInflame idiom): CANON_PHASE_CHANGED for both directions;
 * the research fingerprint + generation milestone only when ENTERING canon.
 *
 * Behavior-preserving move out of settlementSlice.js (same dynamic imports, same
 * guards, same payloads) — the eager bytes it frees pay for the R-1 lifecycle
 * logic (the uncanonize tombstone + the destroy confirm gate) added there.
 */

/**
 * @param {*} after the store state (get()) after the phase transition persisted
 * @param {{ fromPhase: string, toPhase: 'canon'|'draft' }} transition
 */
export function fireCanonLifecycleTelemetry(after, { fromPhase, toPhase }) {
  import('../lib/analytics.js').then(({ track, EVENTS }) => {
    track(EVENTS.CANON_PHASE_CHANGED, { from_phase: fromPhase, to_phase: toPhase });
  }).catch(() => {});
  if (toPhase !== 'canon' || !after?.settlement) return;
  // captureFingerprint('canonized') snapshots the structural shape at canon
  // (skips silently without a stable settlement uuid / consent).
  const activeSaveId = after.activeSaveId || null;
  if (activeSaveId) {
    const save = after.savedSettlements.find(
      (/** @type {{ id?: unknown }} */ s) => String(s.id) === String(activeSaveId),
    ) || null;
    import('../lib/researchCapture.js').then(({ captureFingerprint }) => {
      captureFingerprint('canonized', after.settlement, { save, settlementUuid: activeSaveId });
    }).catch(() => {});
  }
  // Wave E1 — 'canonize' milestone on the generation-id spine. generationId is
  // held in-store (reset on hydrate), so re-derive from the save's seed+stamp
  // when a reloaded save has no live id.
  import('../lib/generationTelemetry.js').then(({ recordGenerationMilestone }) => {
    recordGenerationMilestone('canonize', after.settlement, {
      generationId: after.generationId, seed: after.lastSeed, stampIso: after.generatedAt,
    });
  }).catch(() => {});
}
