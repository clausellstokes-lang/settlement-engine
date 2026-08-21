/**
 * mapDirtyFingerprint.js — the ONE content-aware "is the map dirty?" fingerprint,
 * shared by AutoSaveChip (the visible indicator) and useMapAutosave (the debounced
 * writer) so the two can never disagree (components-map-1).
 *
 * An earlier count-only key (placement ids + layer counts) left BOTH surfaces
 * blind to edits that keep the id set / counts constant: a drag-move (placement
 * x/y/cellId changes) and a rename (label/marker text changes) both slipped past
 * it. The chip's fingerprint was fixed to fold in coordinates + annotation content,
 * but the autosave HOOK kept the old count-only key — so the chip said "Unsaved
 * changes" while the autosave never fired, and a campaign switch (replaceMapState)
 * then discarded the edits. This module makes them ONE source of truth.
 *
 * Cheap enough to run on each render / store update (no deep equality).
 *
 * @param {any} m  a mapState-shaped object
 * @returns {string}
 */
export function mapDirtyFingerprint(m) {
  const s = m || {};
  const placements = Object.entries(s.placements || {})
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, p]) => `${k}:${p?.x},${p?.y},${p?.cellId ?? ''},${p?.settlementId ?? ''}`)
    .join(',');
  const labels = (s.labels || [])
    .map(l => `${l?.id}:${l?.x},${l?.y},${l?.rotation ?? 0},${l?.fontSize ?? ''},${l?.color ?? ''},${l?.fontFamily ?? ''},${l?.text ?? ''}`)
    .join(';');
  const markers = (s.markers || [])
    .map(mk => `${mk?.id}:${mk?.x},${mk?.y},${mk?.icon ?? ''},${mk?.color ?? ''},${mk?.title ?? ''},${mk?.note ?? ''}`)
    .join(';');
  const forests = (s.forests || [])
    .map(f => `${f?.id}:${f?.x},${f?.y},${f?.radius ?? ''},${f?.density ?? ''},${f?.treeStyle ?? ''}`)
    .join(';');
  return `${placements}|${labels}|${markers}|${forests}|${s.customBackdrop?.imageUrl || ''}`;
}
