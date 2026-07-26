/**
 * instantWorldBody.js — the lazily-loaded BODY of the Instant World store action
 * (W-R2 INSTANT WORLD). Mirrors the campaignSpatialCanonize lazy-body pattern:
 * the slice keeps only a thin action that dynamic-imports this module, so the
 * composer + region graph + generator this pulls stay OUT of the first-paint
 * entry closure. Zero eager bytes.
 *
 * This is the BUTTON client (client #1). It calls the pure, tier-blind composer
 * (the same programmatic API the soak harness + Surveyor S5 consume), persists
 * each minted member as a real save, and commits the staged campaign to the
 * store — landing the user IN an active realm, fully amendable, with the SPATIAL
 * canonize left as their next deliberate act.
 *
 * TIER-BLIND: this body never reads auth tier or entitlements. The premium gate
 * lives at the interface entry (the Instant World card). It does bind durable
 * writes to the current auth owner so an account switch cannot split one world
 * across two libraries; owner identity never reaches the composer.
 */
import { saves as savesService } from '../lib/saves.js';
import { deriveGraphWithDiscoveredCandidates } from '../domain/region/discoverDependencyCandidates.js';
import { ensureRegionalGraph } from '../domain/region/index.js';
import { composeInstantWorld } from '../lib/instantWorld/composeInstantWorld.js';
import { generateSeed } from '../kernel/prng.js';
import { accountRuntimeBinding } from './campaignContentBindingModel.js';
import {
  campaignSessionChangedError,
  captureCampaignSession,
  isCurrentCampaignSession,
  persistCampaignState,
  newCampaignId,
} from './campaignSliceShared.js';

// NOTE: no dedicated analytics event is emitted here — a NEW EVENTS name is an
// eager string on the first-paint-imported registry, and the zero-eager pin has
// only a ~tens-of-bytes margin. Instant-world telemetry is a DELIBERATELY
// DEFERRED seam: add it once the first-paint budget is measured with headroom
// (or enrich an existing campaign event), not as a silent eager add.

/**
 * @typedef {{
 *   ok: boolean,
 *   reason?: string,
 *   message?: string,
 *   previousAccountSaveCount?: number,
 *   cleanupIncompleteCount?: number,
 *   campaignId?: string,
 *   seed?: string,
 *   settlementCount?: number,
 * }} InstantWorldResult
 */

function accountChangedResult(previousAccountSaveCount) {
  if (previousAccountSaveCount === 0) {
    return {
      ok: false,
      reason: 'auth_session_changed',
      message: 'Your account changed before any realm settlements were created.',
    };
  }

  const settlementNoun = `settlement${previousAccountSaveCount === 1 ? '' : 's'}`;
  const remainVerb = `remain${previousAccountSaveCount === 1 ? 's' : ''}`;
  const objectPronoun = previousAccountSaveCount === 1 ? 'it' : 'them';
  return {
    ok: false,
    reason: 'auth_session_changed',
    previousAccountSaveCount,
    message: [
      'Your account changed while the realm was being built.',
      `${previousAccountSaveCount} ${settlementNoun} already created ${remainVerb}`,
      `in the previous account; sign back into that account to review or delete ${objectPronoun}.`,
    ].join(' '),
  };
}

async function cleanupPersistedSaves(saveIds, ownerId) {
  let incompleteCount = 0;
  for (const saveId of saveIds) {
    try {
      await savesService.delete(saveId, ownerId);
    } catch {
      incompleteCount += 1;
    }
  }
  return incompleteCount;
}

/**
 * Compose, persist, and commit one staged Instant World.
 *
 * Persistence is deliberately sequential: every durable save is followed by an
 * owner/session recheck before the next write. The campaign enters local state
 * only after all member saves have landed under the same session.
 *
 * @param {{
 *   set: Function,
 *   get: Function,
 *   basicConfig?: object,
 *   options?: { seed?: string, name?: string },
 * }} args
 * @returns {Promise<InstantWorldResult>}
 */
export async function runInstantWorld({ set, get, basicConfig = {}, options = {} }) {
  const seed = options.seed || generateSeed();
  // One wall-clock stamp threaded through the whole artifact (the composer is a
  // pure domain kernel and defaults to a fixed epoch; the binding supplies real
  // time so saves/campaign timestamps are current).
  const now = new Date().toISOString();

  // Resolve one account snapshot before composition. The composer remains
  // tier-blind and store-free: it receives only this reviewed, immutable input.
  // The resulting members and the campaign cutoff therefore cannot disagree on
  // which definitions and tunables governed the instant realm's birth.
  const stateAtStart = get();
  const {
    failedClosed: contentResolutionFailed,
    runtime: accountRuntime,
    binding: contentBinding,
  } = accountRuntimeBinding(stateAtStart);
  const effectiveRuntime = contentResolutionFailed
    ? {
        customContent: {},
        tunables: {},
      }
    : {
        customContent: accountRuntime.customContent || {},
        tunables: accountRuntime.tunables || {},
      };

  // Capture auth before the synchronous composition work as well as before the
  // first durable write. JavaScript cannot interleave an account switch during
  // the composer, but this keeps the transaction's authority boundary honest.
  const session = captureCampaignSession(stateAtStart);

  // Compose the tier-blind bundle with real time and the exact content cutoff.
  const bundle = composeInstantWorld({
    seed,
    basicConfig,
    name: options.name,
    clock: () => now,
    contentRuntime: {
      ...effectiveRuntime,
      explicitConfigFields: stateAtStart.configExplicitFields || {},
      provenance: {
        scope: 'campaign',
        environment: contentBinding.environment,
        bindingHash: contentBinding.bindingHash,
      },
    },
  });
  const memberCount = bundle.settlements.length;

  // Slot pre-flight (premium = unlimited in practice; defensive for other tiers
  // if the action is ever reached without the interface gate).
  const isSessionCurrent = () => isCurrentCampaignSession(get(), session);
  const assertSessionCurrent = () => {
    if (!isSessionCurrent()) throw campaignSessionChangedError();
  };
  const saveOptions = { expectedOwnerId: session.ownerId, isSessionCurrent };
  const max = typeof stateAtStart.maxSaves === 'function'
    ? stateAtStart.maxSaves()
    : Infinity;
  const activeNow = (stateAtStart.savedSettlements || []).length;
  if (Number.isFinite(max) && activeNow + memberCount > max) {
    return { ok: false, reason: 'not_enough_slots', settlementCount: memberCount };
  }

  // Persist each member as a real save (the service assigns durable ids);
  // remap the composer's provisional ids → the real ids.
  const idMap = {};
  const persistedSaves = [];
  try {
    for (const entry of bundle.settlements) {
      assertSessionCurrent();
      const saveEntry = {
        name: entry.name,
        tier: entry.tier,
        settlement: entry.settlement,
        config: entry.config,
        seed: entry.seed,
        aiData: {},
        campaignState: entry.campaignState, // { phase: 'canon', eventLog: [] }
        versionHistory: [],
      };
      const newId = await savesService.save(saveEntry, saveOptions);
      idMap[entry.id] = newId;
      persistedSaves.push({ ...saveEntry, id: newId, savedAt: entry.savedAt });
      assertSessionCurrent();
    }
  } catch (err) {
    if (err?.code === 'auth_session_changed') {
      // Old-owner rows cannot be deleted with the replacement credentials.
      // Preserve the new account and report the durable rows left in the old one.
      return accountChangedResult(persistedSaves.length);
    }
    // With the original owner still current, attempt cleanup. Failure remains
    // visible in the result instead of being described as an atomic rollback.
    const cleanupIncompleteCount = await cleanupPersistedSaves(
      Object.values(idMap),
      session.ownerId,
    );
    return {
      ok: false,
      reason: 'save_failed',
      ...(cleanupIncompleteCount > 0 ? { cleanupIncompleteCount } : {}),
    };
  }

  // Commit the campaign + members to the store in one transaction (same `now`).
  if (!isSessionCurrent()) {
    return accountChangedResult(persistedSaves.length);
  }
  let campaignId = null;
  set((/** @type {any} */ state) => {
    for (const save of persistedSaves) {
      state.savedSettlements.push(save);
    }

    // Remap placements onto the real save ids (site order === member order).
    const placements = {};
    bundle.plan.sites.forEach((site, i) => {
      placements[site.burgId] = {
        settlementId: idMap[bundle.settlements[i].id],
        x: site.x,
        y: site.y,
        cellId: null,
        placedAt: now,
      };
    });

    // Re-derive the staged connections against the real-id saves (the composer
    // already computed this over its provisional ids; re-deriving keeps the
    // persisted graph's node ids in lockstep with the persisted saves).
    const regionalGraph = deriveGraphWithDiscoveredCandidates(
      persistedSaves,
      ensureRegionalGraph(),
      { now },
    );

    campaignId = newCampaignId();
    const campaign = {
      ...bundle.campaign,
      id: campaignId,
      settlementIds: persistedSaves.map(save => save.id),
      regionalGraph,
      mapState: { ...bundle.campaign.mapState, placements, savedAt: now },
      createdAt: now,
      updatedAt: now,
      contentBinding,
      contentBindingHistory: [],
      contentBindingStatus: contentResolutionFailed
        ? 'environment-failed-closed'
        : 'pinned',
    };
    state.campaigns.unshift(campaign);
    persistCampaignState(state, campaignId);
  });

  if (!campaignId) {
    return { ok: false, reason: 'commit_failed' };
  }

  // Land the user in the new realm (also fires the capped world catch-up).
  get().setActiveCampaign(campaignId);

  return { ok: true, campaignId, seed, settlementCount: memberCount };
}
