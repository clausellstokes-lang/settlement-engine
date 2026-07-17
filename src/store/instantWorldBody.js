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
 * TIER-BLIND: this body reads no auth/tier. The premium gate lives at the
 * interface entry (the Instant World card) — tier never reaches the composer.
 */
import { saves as savesService } from '../lib/saves.js';
import { deriveGraphWithDiscoveredCandidates } from '../domain/region/discoverDependencyCandidates.js';
import { ensureRegionalGraph } from '../domain/region/index.js';
import { composeInstantWorld } from '../lib/instantWorld/composeInstantWorld.js';
import { generateSeed } from '../kernel/prng.js';
import { persistCampaignState, newCampaignId } from './campaignSliceShared.js';
// NOTE: no dedicated analytics event is emitted here — a NEW EVENTS name is an
// eager string on the first-paint-imported registry, and the zero-eager pin has
// only a ~tens-of-bytes margin. Instant-world telemetry is a DELIBERATELY
// DEFERRED seam: add it once the first-paint budget is measured with headroom
// (or enrich an existing campaign event), not as a silent eager add.

/**
 * Compose + persist + commit a staged Instant World.
 *
 * @param {{ set:Function, get:Function, basicConfig?:object, options?:{ seed?:string, name?:string } }} args
 * @returns {Promise<{ ok:boolean, reason?:string, campaignId?:string, seed?:string, settlementCount?:number }>}
 */
export async function runInstantWorld({ set, get, basicConfig = {}, options = {} }) {
  const seed = options.seed || generateSeed();
  // One wall-clock stamp threaded through the whole artifact (the composer is a
  // pure domain kernel and defaults to a fixed epoch; the binding supplies real
  // time so saves/campaign timestamps are current).
  const now = new Date().toISOString();

  // Compose the tier-blind bundle (no store, no auth) with real time.
  const bundle = composeInstantWorld({ seed, basicConfig, name: options.name, clock: () => now });
  const memberCount = bundle.settlements.length;

  // Slot pre-flight (premium = unlimited in practice; defensive for other tiers
  // if the action is ever reached without the interface gate).
  const st = get();
  const max = (typeof st.maxSaves === 'function') ? st.maxSaves() : Infinity;
  const activeNow = (st.savedSettlements || []).length;
  if (Number.isFinite(max) && activeNow + memberCount > max) {
    return { ok: false, reason: 'not_enough_slots', settlementCount: memberCount };
  }

  // Persist each member as a real save (the service assigns durable ids);
  // remap the composer's provisional ids → the real ids.
  const idMap = {};
  const persistedSaves = [];
  try {
    for (const entry of bundle.settlements) {
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
      const newId = await savesService.save(saveEntry);
      idMap[entry.id] = newId;
      persistedSaves.push({ ...saveEntry, id: newId, savedAt: entry.savedAt });
    }
  } catch (err) {
    // Roll back any partial inserts so a failed compose doesn't orphan saves.
    for (const oid of Object.values(idMap)) {
      try { await savesService.delete(oid); } catch { /* best-effort cleanup */ }
    }
    return { ok: false, reason: 'save_failed' };
  }

  // Commit the campaign + members to the store in one transaction (same `now`).
  let campaignId = null;
  set((/** @type {any} */ state) => {
    for (const s of persistedSaves) state.savedSettlements.push(s);

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
      settlementIds: persistedSaves.map(s => s.id),
      regionalGraph,
      mapState: { ...bundle.campaign.mapState, placements, savedAt: now },
      createdAt: now,
      updatedAt: now,
    };
    state.campaigns.unshift(campaign);
    persistCampaignState(state, campaignId);
  });

  if (!campaignId) return { ok: false, reason: 'commit_failed' };

  // Land the user in the new realm (also fires the capped world catch-up).
  get().setActiveCampaign(campaignId);

  return { ok: true, campaignId, seed, settlementCount: memberCount };
}
