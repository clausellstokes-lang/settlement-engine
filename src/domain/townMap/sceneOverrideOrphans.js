/**
 * Explicit orphan handling for the 3D cosmetic-edit overlay.
 *
 * A scene override is keyed by a canonical building anchor. Canonical settlement
 * truth can legitimately change after the edit was saved (for example, an
 * institution is removed), leaving an override with no current render target.
 * That is not permission to delete or retarget the user's work automatically.
 *
 * This module therefore separates three operations:
 *
 *   1. inspect — report missing targets without mutating the overlay;
 *   2. remove — explicitly discard one still-orphaned override; and
 *   3. relink — atomically move one still-orphaned override to an explicitly
 *      chosen, currently unoccupied canonical building anchor.
 *
 * Every write composes the map-edit wall's existing normalization helpers. The
 * caller owns persistence and undo by committing the returned container once.
 */

import {
  normalizeMapEdits,
  readSceneOverrides,
  withSceneOverride,
  withoutSceneOverride,
} from './mapEdits.js';

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @param {string} left @param {string} right */
function compareCodepoint(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

/**
 * Build the current, selectable building-target inventory from a manifest.
 * Building records remain authoritative for editability; semantics supply only
 * the human label. Duplicate anchors fail closed to one deterministic target.
 *
 * @param {unknown} manifest
 * @returns {Array<{anchor:string, sceneId:string, label:string}>}
 */
export function sceneOverrideTargets(manifest) {
  const record = isRecord(manifest) ? manifest : {};
  const buildings = Array.isArray(record.buildings) ? record.buildings : [];
  const semantics = Array.isArray(record.semantics) ? record.semantics : [];
  const semanticBySceneId = new Map();

  for (const value of semantics) {
    if (!isRecord(value)) continue;
    const sceneId = text(value.sceneId);
    if (sceneId && !semanticBySceneId.has(sceneId)) {
      semanticBySceneId.set(sceneId, value);
    }
  }

  const byAnchor = new Map();
  for (const value of buildings) {
    if (!isRecord(value)) continue;
    const anchor = text(value.anchorKey);
    const sceneId = text(value.semanticId || value.id);
    if (!anchor || !sceneId || byAnchor.has(anchor)) continue;
    const semantic = semanticBySceneId.get(sceneId);
    byAnchor.set(anchor, {
      anchor,
      sceneId,
      label: text(semantic?.label) || anchor,
    });
  }

  return [...byAnchor.values()].sort((left, right) => (
    compareCodepoint(left.label, right.label)
    || compareCodepoint(left.anchor, right.anchor)
  ));
}

/**
 * Inspect the overlay against the current canonical building inventory.
 *
 * Occupied targets are intentionally excluded from `availableTargets`: relinking
 * must never merge with or overwrite a different saved appearance implicitly.
 *
 * @param {unknown} edits
 * @param {unknown} manifest
 * @returns {{
 *   orphans:Array<{anchor:string, override:Record<string, unknown>}>,
 *   targets:Array<{anchor:string, sceneId:string, label:string}>,
 *   availableTargets:Array<{anchor:string, sceneId:string, label:string}>,
 * }}
 */
export function inspectSceneOverrideOrphans(edits, manifest) {
  const overrides = readSceneOverrides(
    /** @type {Parameters<typeof readSceneOverrides>[0]} */ (edits),
  );
  const targets = sceneOverrideTargets(manifest);
  const validAnchors = new Set(targets.map((target) => target.anchor));
  const occupiedAnchors = new Set(
    overrides
      .filter((override) => validAnchors.has(override.anchor))
      .map((override) => override.anchor),
  );

  return {
    orphans: overrides
      .filter((override) => !validAnchors.has(override.anchor))
      .map((override) => ({
        anchor: override.anchor,
        override: { ...override },
      })),
    targets,
    availableTargets: targets.filter((target) => !occupiedAnchors.has(target.anchor)),
  };
}

/**
 * Remove one override only if it remains orphaned in the supplied manifest.
 * A stale UI cannot erase an override whose canonical target reappeared.
 *
 * @param {unknown} edits
 * @param {unknown} manifest
 * @param {unknown} orphanAnchor
 * @returns {{ok:true, edits:ReturnType<typeof normalizeMapEdits>}|{ok:false, reason:'not-orphan', edits:ReturnType<typeof normalizeMapEdits>}}
 */
export function removeSceneOverrideOrphan(edits, manifest, orphanAnchor) {
  const anchor = text(orphanAnchor);
  const normalized = normalizeMapEdits(
    /** @type {Parameters<typeof normalizeMapEdits>[0]} */ (edits),
  );
  const report = inspectSceneOverrideOrphans(normalized, manifest);
  if (!report.orphans.some((orphan) => orphan.anchor === anchor)) {
    return { ok: false, reason: 'not-orphan', edits: normalized };
  }
  return {
    ok: true,
    edits: withoutSceneOverride(normalized, anchor),
  };
}

/**
 * Move one orphan to one explicit, current, unoccupied target in a single
 * normalized edit. The result is suitable for one parent history/persistence
 * commit, so undo restores the original orphan exactly.
 *
 * @param {unknown} edits
 * @param {unknown} manifest
 * @param {unknown} orphanAnchor
 * @param {unknown} targetAnchor
 * @returns {{
 *   ok:true,
 *   edits:ReturnType<typeof normalizeMapEdits>,
 *   target:{anchor:string, sceneId:string, label:string},
 * }|{
 *   ok:false,
 *   reason:'not-orphan'|'missing-target'|'target-occupied',
 *   edits:ReturnType<typeof normalizeMapEdits>,
 * }}
 */
export function relinkSceneOverrideOrphan(
  edits,
  manifest,
  orphanAnchor,
  targetAnchor,
) {
  const sourceAnchor = text(orphanAnchor);
  const destinationAnchor = text(targetAnchor);
  const normalized = normalizeMapEdits(
    /** @type {Parameters<typeof normalizeMapEdits>[0]} */ (edits),
  );
  const report = inspectSceneOverrideOrphans(normalized, manifest);
  const orphan = report.orphans.find((entry) => entry.anchor === sourceAnchor);
  if (!orphan) {
    return { ok: false, reason: 'not-orphan', edits: normalized };
  }

  const target = report.targets.find((entry) => entry.anchor === destinationAnchor);
  if (!target) {
    return { ok: false, reason: 'missing-target', edits: normalized };
  }
  if (!report.availableTargets.some((entry) => entry.anchor === destinationAnchor)) {
    return { ok: false, reason: 'target-occupied', edits: normalized };
  }

  const patch = { ...orphan.override };
  delete patch.anchor;
  const withoutOrphan = withoutSceneOverride(normalized, sourceAnchor);
  return {
    ok: true,
    edits: withSceneOverride(withoutOrphan, destinationAnchor, patch),
    target,
  };
}
