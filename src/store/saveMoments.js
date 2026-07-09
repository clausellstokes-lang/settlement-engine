/**
 * saveMoments.js — save-time pricing moments + research capture (F34 revival).
 *
 * The store's `saveSettlement` action used to host the first_save / third_save
 * pricing moments and the 'saved' structural research capture, but it was DEAD:
 * every real save path (SaveToLibraryButton and the SAVE_SETTLEMENT auth intent)
 * calls savesService.save() directly, so the funnel side effects never fired.
 *
 * This module extracts those side effects into a small, testable helper invoked
 * from the REAL save chokepoints. Idempotent per save id, so a re-render or a
 * double-invoke can't double-fire a moment.
 *
 * The decision (which moment a save earns) is a pure function so it can be pinned
 * without touching the store, the pricing-moment cooldown, or the network.
 */

import { activeSaveCount } from '../lib/saveAccess.js';
import { saves as savesService } from '../lib/saves.js';

// Session-scoped dedupe: a given save id fires its moment/capture at most once.
const _firedSaveIds = new Set();

/** Test seam — clear the per-session dedupe set between cases. */
export function _resetSaveMomentsForTest() {
  _firedSaveIds.clear();
}

/**
 * Which pricing moment (if any) does a save earn, given the AUTHORITATIVE active
 * save count AFTER the save landed and the user's save cap?
 *
 * Mirrors the retired saveSettlement action exactly:
 *   - first_save: the save that brings the library to exactly 1 (was activeCount===0 pre-push).
 *   - third_save: the save that brings a 3-cap library to exactly 3 (was activeCount===2 && max===3).
 *
 * @param {number} postSaveActiveCount active saves including the one just made
 * @param {number} maxSaves            the user's save cap
 * @returns {'first_save'|'third_save'|null}
 */
export function saveMomentReason(postSaveActiveCount, maxSaves) {
  if (postSaveActiveCount === 1) return 'first_save';
  if (postSaveActiveCount === 3 && maxSaves === 3) return 'third_save';
  return null;
}

/**
 * Fire the save-moment side effects (pricing moment + research capture) for a
 * freshly-persisted save. Idempotent per save id; never throws.
 *
 * @param {Object}   opts
 * @param {string|number} opts.saveId          the id savesService.save() returned
 * @param {Object}   opts.settlement            the saved settlement payload
 * @param {number}   opts.postSaveActiveCount   active saves after this save
 * @param {number}   [opts.maxSaves]            the user's save cap
 * @param {string}   [opts.tier]                auth tier (premium/dev/admin skip the moment)
 * @param {(content:Object)=>void} [opts.openPricingMoment] store-bound opener
 * @returns {Promise<{fired:boolean, reason:('first_save'|'third_save'|null), deduped?:boolean}>}
 */
export async function recordSaveMoment({
  saveId,
  settlement,
  postSaveActiveCount,
  maxSaves,
  tier,
  openPricingMoment,
}) {
  if (saveId == null) return { fired: false, reason: null };
  const key = String(saveId);
  if (_firedSaveIds.has(key)) return { fired: false, reason: null, deduped: true };
  _firedSaveIds.add(key);

  const reason = saveMomentReason(postSaveActiveCount, maxSaves);

  // Pricing moment — fire-and-forget; the moment library enforces a 24h per-moment
  // cooldown and skips premium/dev/admin, so this can't spam.
  if (reason) {
    import('../lib/pricingMoments.js').then(({ triggerPricingMoment }) => {
      triggerPricingMoment(reason, (content) => {
        if (typeof openPricingMoment === 'function') openPricingMoment(content);
      }, { tier });
    }).catch(() => { /* never block a save */ });
  }

  // Structural research snapshot at the 'saved' lifecycle moment — consent-gated
  // and best-effort inside captureFingerprint; never throws, never affects saves.
  import('../lib/researchCapture.js').then(({ captureFingerprint }) => {
    captureFingerprint('saved', settlement, {
      save: { ...settlement, id: saveId },
      settlementUuid: String(saveId),
    });
  }).catch(() => { /* research capture is best-effort */ });

  return { fired: true, reason };
}

/**
 * Store/service-plumbed convenience for the real save chokepoints. Reads the
 * authoritative post-save active count from savesService and the opener / cap /
 * tier from the passed store, then delegates to recordSaveMoment. Never throws.
 *
 * @param {Object} opts
 * @param {string|number} opts.saveId the id savesService.save() returned
 * @param {Object} opts.settlement    the saved settlement payload
 * @param {{ getState: () => any }} opts.store the zustand store (useStore)
 */
export async function recordSaveMomentForActiveSave({ saveId, settlement, store }) {
  try {
    const st = store?.getState?.() || {};
    // Authoritative count AFTER the save persisted (savesService is the source of
    // truth; the store's savedSettlements cache may not be re-hydrated yet). Fall
    // back to the cache if the count query fails.
    let postSaveActiveCount;
    try { postSaveActiveCount = await savesService.count(); }
    catch { postSaveActiveCount = activeSaveCount(st.savedSettlements); }

    const maxSaves = typeof st.maxSaves === 'function' ? st.maxSaves() : undefined;
    const tier = st.auth?.tier;
    const openPricingMoment = typeof st.setActivePricingMoment === 'function'
      ? st.setActivePricingMoment
      : undefined;

    return await recordSaveMoment({
      saveId,
      settlement,
      postSaveActiveCount,
      maxSaves,
      tier,
      openPricingMoment,
    });
  } catch {
    return { fired: false, reason: null };
  }
}
