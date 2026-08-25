/**
 * resolveExportSeam — the shared export seam for SettlementDetail: resolves
 * the owning campaign (plain cloneable data) and the faith premium gate for a
 * saved settlement. Used by BOTH export formats (PDF + Foundry module) so
 * they can never drift.
 *
 * W4f dead-path fix: the owning campaign is resolved so a premium canon
 * export actually carries the live-world Faith & War chapter. Membership is
 * the store's String-normalized scan (matches isSettlementClockBound —
 * number/string id mixes resolve).
 *
 * F41: the campaign payload must be PLAIN CLONEABLE DATA — a nameById map,
 * never a nameFor function. A function would DataCloneError the PDF worker
 * postMessage and silently demote every export to the main-thread fallback.
 * liveWorld.js prefers nameById natively.
 */
import { isCampaignActive } from '../../lib/campaigns.js';

/**
 * @param {any} liveStore — a useStore.getState() snapshot
 * @param {string|number|null} saveId
 * @returns {{ campaign: any, faithUnlocked: boolean }}
 */
export function resolveExportSeam(liveStore, saveId) {
  const sid = saveId != null ? String(saveId) : null;
  const owning = sid
    ? (liveStore.campaigns || []).find(
        c => isCampaignActive(c) && (c.settlementIds || []).map(String).includes(sid),
      ) || null
    : null;
  let campaign = null;
  if (owning) {
    const memberIds = new Set((owning.settlementIds || []).map(String));
    const memberSaves = (liveStore.savedSettlements || [])
      .filter(e => memberIds.has(String(e?.id)));
    /** @type {Record<string, string>} */
    const nameById = {};
    for (const entry of memberSaves) {
      const id = entry?.id ?? entry?.settlement?.id;
      const name = entry?.name || entry?.settlement?.name;
      if (id != null && name) nameById[String(id)] = name;
    }
    campaign = {
      settlementId: saveId,
      worldState: owning.worldState || null,
      regionalGraph: owning.regionalGraph || owning.worldState?.regionalGraph || null,
      settlements: memberSaves,
      nameById,
    };
  }
  // The faith premium seam — mirrors FaithSection's screen gate
  // (tier === 'premium' || elevated). Free / lapsed / anon exports thread
  // false, so faithChapterVisible's default-safe gate stays load-bearing.
  const faithUnlocked = liveStore.auth?.tier === 'premium'
    || (typeof liveStore.isElevated === 'function' ? liveStore.isElevated() : false);
  return { campaign, faithUnlocked };
}

export default resolveExportSeam;
