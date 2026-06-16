/**
 * editFingerprint.js — privacy-safe extraction of structural EDITS (Wave 3).
 *
 * The edit research plane (edit_events table + research.edits view + the edit
 * heatmap/frequency reports) was built end-to-end but had ZERO producers. This
 * is the allowlist bridge from the pending-edit queue to that plane. Edits are
 * the HIGHEST prose-risk signal (rename payloads, prose bodies), so this copies
 * ONLY the edit KIND, a derived target/tier enum, and coarse cascade COUNTS —
 * never payload.newName / payload.value / payload text / cascade summaryLines.
 * The guarantee is a TEST (tests/lib/editFingerprint.test.js).
 */

import { EDIT_KINDS } from '../domain/pendingEdits.js';

const EDIT_KIND_SET = new Set(EDIT_KINDS);
const arr = (v) => (Array.isArray(v) ? v : []);
const enumStr = (v) => (typeof v === 'string' && v.length > 0 && v.length <= 48 ? v : undefined);
const numOrU = (v) => (Number.isFinite(Number(v)) ? Number(v) : undefined);

/** edit kind → the entity it targets (enum). */
const TARGET_OF = {
  'rename-npc': 'npc', 'rename-faction': 'faction', 'rename-settlement': 'settlement',
  'add-institution': 'institution', 'remove-institution': 'institution',
  'add-resource': 'resource', 'remove-resource': 'resource',
  'add-stressor': 'stressor', 'remove-stressor': 'stressor',
  'edit-prose': 'prose',
};
/** edit kind → change tier (cosmetic|structural|prose) — same grouping the
 *  commit path's EDIT_COMMITTED counts use. */
const TIER_OF = {
  'rename-npc': 'cosmetic', 'rename-faction': 'cosmetic', 'rename-settlement': 'cosmetic',
  'add-institution': 'structural', 'remove-institution': 'structural',
  'add-resource': 'structural', 'remove-resource': 'structural',
  'add-stressor': 'structural', 'remove-stressor': 'structural',
  'edit-prose': 'prose',
};

/** Coarse cascade signal from previewCascade() — counts + impact enum only.
 *  summaryLines (prose) are deliberately dropped. */
export function extractEditCascade(cascade) {
  if (!cascade || typeof cascade !== 'object') return null;
  const dc = cascade.downstreamCounts || {};
  return {
    narrative_impact: enumStr(cascade.narrativeImpact),
    downstream: {
      npcs: numOrU(dc.npcs), hooks: numOrU(dc.hooks),
      factions: numOrU(dc.factions), linked_saves: numOrU(dc.linkedSaves),
    },
  };
}

/**
 * One redacted research row per committed edit. ctx: { settlementUuid, cascade }.
 * settlementUuid is required downstream (ingest rejects uuid-less edits), so
 * unsaved drafts simply don't produce rows.
 */
export function extractEditRows(activeEdits, ctx = {}) {
  const cascade = extractEditCascade(ctx.cascade);
  const rows = [];
  let seq = 0;
  for (const e of arr(activeEdits)) {
    const kind = enumStr(e?.kind);
    if (!kind || !EDIT_KIND_SET.has(kind)) continue;
    const target_kind = TARGET_OF[kind] || 'unknown';
    const change_tier = TIER_OF[kind] || 'structural';
    rows.push({
      settlementUuid: ctx.settlementUuid,
      kind,
      targetKind: target_kind,
      // payload_redacted carries ONLY the enum classification — never the edit's
      // prose payload (newName / value / text are excluded by construction).
      payloadRedacted: { target_kind, change_tier },
      cascade,
      editSeq: seq++,
      reverted: false,
    });
  }
  return rows;
}
