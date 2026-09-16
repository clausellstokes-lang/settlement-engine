/**
 * domain/events/stalenessKey.js — THE STALENESS LAW's key (Composer V2 §5).
 *
 * A preview is trustworthy only for (this exact event payload) × (this exact
 * settlement state). The key captures the payload half: a stable serialization
 * of every commit-relevant event field EXCEPT the id (the compose-session id is
 * stable across dial turns by design, and two same-payload builds must key
 * equal whether or not a re-mint happened). The settlement half is REFERENCE
 * identity — the store replaces the settlement object on every mutation (apply,
 * world-pulse advance, undo, regeneration), so `preview._forSettlement !==
 * current settlement` is the exact "world changed underneath" signal with zero
 * hashing cost.
 *
 * The apply-prefers-pendingPreview bypass is retired on this key: apply always
 * commits the freshly-built form event, and the pane's preview is valid iff its
 * key + settlement reference still match — an edited form can never commit a
 * stale preview.
 *
 * Pure leaf; no imports.
 */

/**
 * Stable payload key for a composed event. Field order is fixed here (not
 * spread from the event) so key equality means payload equality regardless of
 * construction order; `id` is deliberately excluded (see module doc).
 * @param {Object|null|undefined} event
 * @returns {string}
 */
export function eventStalenessKey(event) {
  if (!event) return '';
  const e = /** @type {Record<string, unknown>} */ (event);
  return JSON.stringify({
    type: e.type ?? null,
    targetId: e.targetId ?? null,
    payload: e.payload ?? null,
    cause: e.cause ?? null,
    partyCaused: e.partyCaused ?? null,
    description: e.description ?? null,
  });
}
