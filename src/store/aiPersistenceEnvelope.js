/**
 * Durable AI-data envelope construction.
 *
 * AI prose is an overlay on settlement truth. Every write must preserve the
 * Chronicle, pinned NPCs, event snapshots, and dossier notes owned by sibling
 * features. Centralizing that merge makes "regenerate one field" unable to
 * erase an unrelated durable collection.
 *
 * Chronicle context derivation is intentionally not imported here. This module
 * is part of the eager store graph, while Chronicle grounding is needed only
 * after a user starts an AI request; see aiChronicleContext.js.
 */

export function buildAiDataBlob(existing, patch) {
  const previous = existing || {};
  return {
    aiSettlement: patch.aiSettlement !== undefined
      ? patch.aiSettlement
      : (previous.aiSettlement || null),
    aiDailyLife: patch.aiDailyLife !== undefined
      ? patch.aiDailyLife
      : (previous.aiDailyLife || null),
    narrativeMode: patch.narrativeMode
      || previous.narrativeMode
      || 'raw',
    narrativeGeneratedAt: patch.narrativeGeneratedAt !== undefined
      ? patch.narrativeGeneratedAt
      : (previous.narrativeGeneratedAt || null),
    narrativeSourceFingerprint: patch.narrativeSourceFingerprint !== undefined
      ? patch.narrativeSourceFingerprint
      : (previous.narrativeSourceFingerprint || null),
    chronicle: Array.isArray(previous.chronicle)
      ? previous.chronicle
      : [],
    pinnedNpcs: Array.isArray(previous.pinnedNpcs)
      ? previous.pinnedNpcs
      : [],
    eventNarrativeSnapshots: Array.isArray(previous.eventNarrativeSnapshots)
      ? previous.eventNarrativeSnapshots
      : [],
    dossierNotes: patch.dossierNotes !== undefined
      ? patch.dossierNotes
      : (
          previous.dossierNotes
          && typeof previous.dossierNotes === 'object'
            ? previous.dossierNotes
            : null
        ),
  };
}
