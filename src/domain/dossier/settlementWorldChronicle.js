/**
 * domain/dossier/settlementWorldChronicle.js — project the campaign's world-pulse
 * history into per-settlement Chronicle rows.
 *
 * THE SETTLEMENT-CHRONICLE SEAM (owner bug 2026-07-22: "advanced a month and nothing
 * showed there"). The settlement Chronicle's world sources were wired to
 * campaignState.worldPulse.events + campaignState.worldState.eventLog — per-save paths
 * the world advance NEVER writes (campaignStateForWorldPulse stamps only
 * {lastTick,lastInterval,updatedAt}; the campaign's events live on
 * campaign.worldState.pulseHistory). This projects that ALREADY-PERSISTED history into
 * per-settlement buildChronicleFeed-shaped rows — a pure READ, no new record
 * production — each carrying THE NEWS ADDRESS LAW's four parts.
 *
 * FIRST-PAINT ISOLATION: kept in its OWN module (not chronicleFeed.js) because
 * chronicleFeed is pulled into the eager store closure via aiSlice, and its budget has
 * ~zero headroom. This module is imported ONLY by the lazy OutputContainer, so its
 * bytes land in the deferred dossier chunk, never first paint.
 *
 * @enforced-by tests/domain/dossier/settlementWorldChronicle.test.js
 */

/**
 * The dynamic pulse-record boundary, typed structurally: only the fields this
 * projection actually reads, all optional (records are legacy-tolerant).
 * @typedef {Object} PulseRowLike
 * @property {string|number} [targetSaveId]
 * @property {{ affectedSettlementIds?: unknown }} [stressor]
 * @property {unknown} [settlementIds]
 * @property {unknown} [affectedSettlementIds]
 * @property {unknown} [relationshipKey]
 * @property {{ settlementId?: string|number }} [proposalPayload]
 * @property {string} [candidateType]
 * @property {string} [impactKind]
 * @property {string} [type]
 * @property {string} [kind]
 * @property {string|number} [factionId]
 * @property {unknown} [reasons]
 * @property {string} [title]
 * @property {string} [headline]
 * @property {string} [summary]
 * @property {string} [severity]
 * @property {string|number} [npcId]
 * @property {string|number} [id]
 *
 * @typedef {Object} PulseRecordLike
 * @property {string|number} [id]
 * @property {number} [tick]
 * @property {string} [createdAt]
 * @property {unknown} [selectedOutcomes]
 * @property {unknown} [impactDigest]
 *
 * @typedef {Object} SavedSettlementLike
 * @property {string|number} [id]
 * @property {string} [name]
 * @property {{ name?: string }} [settlement]
 *
 * @typedef {Object} WorldStateLike
 * @property {unknown} [pulseHistory]
 */

/** @param {unknown} v @returns {unknown[]} */
function arr(v) { return Array.isArray(v) ? v : []; }

const byStr = (/** @type {string} */ a, /** @type {string} */ b) => (a < b ? -1 : a > b ? 1 : 0);

/** Split a relationshipKey ("a::b" / "a>b" / "a-b") into endpoint tokens.
 *  @param {unknown} key @returns {string[]} */
function relationshipKeyParts(key) {
  return key ? String(key).split(/[:|>-]+/).filter(Boolean) : [];
}

/** Settlement ids a pulse outcome/impact touches — the reliable settlement
 *  discriminators ONLY (targetSaveId, explicit settlementIds lists,
 *  stressor.affectedSettlementIds, relationshipKey endpoints, proposal settlementId),
 *  NOT the npc/faction key union chronicleGraph.entityKeysOf mixes in.
 *  @param {PulseRowLike | null | undefined} o @returns {Set<string>} */
function settlementIdsOfPulseRow(o) {
  /** @type {Set<string>} */
  const ids = new Set();
  const add = (/** @type {unknown} */ v) => { if (v != null && v !== '') ids.add(String(v)); };
  add(o?.targetSaveId);
  for (const id of arr(o?.stressor?.affectedSettlementIds)) add(id);
  for (const id of arr(o?.settlementIds)) add(id);            // impactDigest rows
  for (const id of arr(o?.affectedSettlementIds)) add(id);
  for (const part of relationshipKeyParts(o?.relationshipKey)) add(part);
  if (o?.proposalPayload?.settlementId) add(o.proposalPayload.settlementId);
  return ids;
}

/** saveId → display name, from the store's savedSettlements.
 *  @param {SavedSettlementLike[]} saves @returns {Map<string, string>} */
function settlementNameMap(saves) {
  /** @type {Map<string, string>} */
  const m = new Map();
  for (const s of /** @type {SavedSettlementLike[]} */ (arr(saves))) {
    if (s?.id == null) continue;
    m.set(String(s.id), s?.settlement?.name || s?.name || String(s.id));
  }
  return m;
}

/**
 * Project a campaign worldState's pulseHistory into Chronicle feed rows for ONE
 * settlement (saveId). Pure; reads only already-persisted data. Each row is a
 * buildChronicleFeed-shaped entry ({id,title,summary,at,severity}) plus THE NEWS
 * ADDRESS LAW `address` block. Newest-first ordering is left to buildChronicleFeed
 * (it sorts by `at`); here the walk is deterministic in record → row order.
 *
 * @param {WorldStateLike | null | undefined} worldState  campaign.worldState (raw; may be legacy)
 * @param {string|number|null|undefined} saveId  the settlement's save id
 * @param {{ savedSettlements?: SavedSettlementLike[] }} [opts]
 * @returns {Array<Record<string, unknown>>}
 */
export function settlementWorldPulseEntries(worldState, saveId, { savedSettlements = [] } = {}) {
  const history = /** @type {PulseRecordLike[]} */ (arr(worldState?.pulseHistory));
  if (!history.length || saveId == null) return [];
  const sid = String(saveId);
  const nameById = settlementNameMap(savedSettlements);
  /** @type {Array<Record<string, unknown>>} */
  const out = [];
  for (const record of history) {
    const at = record?.createdAt || null;
    const rid = record?.id != null ? String(record.id) : `wp-${record?.tick ?? 0}`;
    const rows = /** @type {PulseRowLike[]} */ ([...arr(record?.selectedOutcomes), ...arr(record?.impactDigest)]);
    let i = 0;
    for (const o of rows) {
      i += 1;
      const touched = settlementIdsOfPulseRow(o);
      if (!touched.has(sid)) continue;
      // Resolve only the ids that name a real settlement (a name map hit) — foreign
      // relationshipKey endpoints / npc-ish tokens drop out. Built as a string[] (not
      // a filter+map, which strict TS widens to (string|undefined)[]).
      /** @type {string[]} */
      const affected = [];
      /** @type {string[]} */
      const affectedIds = [];
      for (const id of touched) { const nm = nameById.get(id); if (nm) { affected.push(nm); affectedIds.push(id); } }
      const containingId = o?.targetSaveId ? String(o.targetSaveId) : sid;
      out.push({
        id: `${rid}::${o?.id ?? `row${i}`}`,
        title: o?.headline || 'World pulse event',
        summary: o?.summary || '',
        at,
        severity: o?.severity ?? null,
        // THE NEWS ADDRESS LAW — the four parts, derived from the record + saves:
        //  (1) subject chain ids (settlement always present; npc/faction when the
        //      outcome names one), (2) the typed event kind (the action), (3) the
        //      affected settlements by NAME, (4) the recorded reason.
        address: {
          subject: {
            settlementId: containingId,
            settlementName: nameById.get(containingId) || null,
            npcId: o?.npcId || null,
            factionId: o?.factionId || null,
          },
          affectedSettlements: [...new Set(affected)].sort(byStr),
          // The affected settlement SAVE IDS beside their names, so the Chronicle
          // can LINK each affected settlement to its dossier (the address chain's
          // navigable affected-settlements part) without a name→id round-trip.
          affectedSettlementIds: [...new Set(affectedIds)].sort(byStr),
          reason: (Array.isArray(o?.reasons) && o.reasons.length) ? String(o.reasons[0]) : null,
          eventKind: o?.candidateType || o?.impactKind || o?.type || o?.kind || null,
        },
      });
    }
  }
  return out;
}
