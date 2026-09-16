/**
 * galleryImportMap.js — lazy, owner-fenced import of shared gallery maps.
 *
 * Gallery payloads cross both a trust boundary and an auth-session boundary.
 * This module keeps the cold import graph out of the eager campaign slice,
 * scrubs shared settlement data, rejects unsafe backdrop URLs, and re-checks
 * the captured owner session after every asynchronous boundary. A partially
 * completed campaign import is either rolled back for that same owner or
 * reported explicitly when an auth rotation makes rollback unsafe.
 */

import { saves as savesService } from '../lib/saves.js';
import { scrubImportedConfig } from '../lib/importScrub.js';
import { track, EVENTS } from '../lib/analytics.js';
import { remapSettlementParentRefForImport } from '../domain/settlementParentRef.js';
import {
  campaignSessionChangedError,
  captureCampaignSession,
  isCurrentCampaignSession,
} from './campaignSliceShared.js';

// ── Trust and session boundaries ─────────────────────────────────────────────

/**
 * Gallery rows are untrusted shared input, and this URL is later rendered as an
 * SVG image href. Only HTTP(S) URLs may survive the import boundary.
 */
function isSafeBackdropUrl(value) {
  if (!value) return false;

  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

/** Capture the authenticated owner session that may receive imported state. */
function captureGalleryImportSession(state) {
  const ownerId = state?.auth?.user?.id;
  const session = ownerId ? captureCampaignSession(state, ownerId) : null;
  if (!session) {
    throw campaignSessionChangedError();
  }
  return session;
}

/**
 * Describe an auth rotation without pretending already-created rows vanished.
 */
function gallerySessionChangedAfterWrites(createdCount = 0, cause = null) {
  /** @type {Error & {
   *   code?: string,
   *   campaignId?: unknown,
   *   previousAccountSaveCount?: number,
   *   cause?: unknown,
   * }} */
  const error = campaignSessionChangedError();
  const count = Math.max(0, Number(createdCount) || 0);

  if (count > 0) {
    const settlementSuffix = count === 1 ? '' : 's';
    const remainVerb = count === 1 ? 'remains' : 'remain';
    const objectPronoun = count === 1 ? 'it' : 'them';
    error.message = [
      `Your account changed while the import was running. ${count} copied settlement${settlementSuffix} ${remainVerb} in the previous account;`,
      `sign back into that account to review or delete ${objectPronoun}.`,
    ].join(' ');
    error.previousAccountSaveCount = count;
  }
  if (cause) {
    error.cause = cause;
  }

  return error;
}

/** Reject work whose captured owner session no longer matches the live store. */
function assertGalleryImportSession(get, session, previousAccountSaveCount = 0) {
  if (!isCurrentCampaignSession(get(), session)) {
    throw gallerySessionChangedAfterWrites(previousAccountSaveCount);
  }
}

/**
 * Best-effort rollback for rows created before a same-owner import failure.
 *
 * This helper must never run after auth rotation: the new credentials cannot be
 * used to delete rows that belong to the previous account.
 */
async function cleanupImportedSaves(saveIds, ownerId) {
  let cleanupIncompleteCount = 0;

  for (const saveId of saveIds) {
    try {
      await savesService.delete(saveId, ownerId);
    } catch {
      cleanupIncompleteCount += 1;
    }
  }

  return cleanupIncompleteCount;
}

// ── Single-map import ────────────────────────────────────────────────────────

/**
 * Import one shared map into a new local campaign.
 *
 * @param {Function} get Zustand state reader
 * @param {string} slug public gallery slug
 * @param {object|null} expectedSession session already captured by the campaign importer
 * @returns {Promise<unknown>} the new campaign identifier
 */
export async function importGalleryMapImpl(get, slug, expectedSession = null) {
  const initialState = get();
  const role = initialState.auth?.role;
  const canCreate = (
    initialState.auth?.tier === 'premium'
    || role === 'developer'
    || role === 'admin'
  );
  if (!canCreate) {
    throw new Error('Importing maps is a premium feature.');
  }

  const session = expectedSession || captureGalleryImportSession(initialState);
  assertGalleryImportSession(get, session);

  const { fetchGalleryMap } = await import('../lib/gallery.js');
  const shared = await fetchGalleryMap(slug);
  assertGalleryImportSession(get, session);
  if (!shared) {
    throw new Error('That shared map is no longer available.');
  }

  const backdrop = shared.backdrop || {};

  const mapState = {
    schemaVersion: 2,
    placements: {},
    labels: [],
    markers: [],
    forests: [],
  };

  if (backdrop.customBackdrop?.imageUrl) {
    let imageUrl = backdrop.customBackdrop.imageUrl;
    if (!isSafeBackdropUrl(imageUrl)) {
      throw new Error('That shared map has no importable backdrop.');
    }

    const ownerId = session.ownerId;
    try {
      const { uploadMapBackdrop } = await import('../lib/imageUpload.js');
      assertGalleryImportSession(get, session);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      assertGalleryImportSession(get, session);

      if (ownerId && blob?.size) {
        const upload = await uploadMapBackdrop(blob, {
          ownerId,
          campaignId: 'imported',
          contentType: blob.type,
        });
        imageUrl = upload.url;
      }
    } catch {
      // A safe shared public URL remains a valid fallback.
    }

    assertGalleryImportSession(get, session);
    mapState.customBackdrop = {
      imageUrl,
      w: Number(backdrop.customBackdrop.w) || 0,
      h: Number(backdrop.customBackdrop.h) || 0,
    };
  } else if (backdrop.fmgSnapshot) {
    // Never import another user's raw serialized SVG snapshot. Keep only the
    // seed so comparable geography can be regenerated on this device.
    mapState.seed = backdrop.seed ?? null;
  } else {
    throw new Error('That shared map has no backdrop to import.');
  }

  assertGalleryImportSession(get, session);
  const campaignName = shared.name ? `${shared.name} (imported)` : 'Imported map';
  const newId = get().createCampaign(campaignName);
  if (!newId) {
    throw new Error('Could not create a campaign for the imported map.');
  }

  get().saveCampaignMap(newId, mapState);
  try {
    track(EVENTS.GALLERY_IMPORTED, { kind: 'map' });
  } catch {
    // Analytics never affects import.
  }

  return newId;
}

// ── Campaign import ──────────────────────────────────────────────────────────

/**
 * Import a shared map and its settlement members into the captured owner.
 *
 * Each save commit is fenced independently. Ordinary failures roll back rows
 * created during this attempt; auth rotation leaves prior-owner rows untouched
 * and returns an error that discloses how many remain.
 *
 * @param {Function} get Zustand state reader
 * @param {Function} set Zustand Immer writer
 * @param {string} slug public gallery slug
 * @returns {Promise<unknown>} the new campaign identifier
 */
export async function importGalleryMapWithCampaignImpl(get, set, slug) {
  const initialState = get();
  const role = initialState.auth?.role;
  const canCreate = (
    initialState.auth?.tier === 'premium'
    || role === 'developer'
    || role === 'admin'
  );
  if (!canCreate) {
    throw new Error('Importing campaigns is a premium feature.');
  }

  const session = captureGalleryImportSession(initialState);
  const isSessionCurrent = () => isCurrentCampaignSession(get(), session);
  const saveOptions = { expectedOwnerId: session.ownerId, isSessionCurrent };
  assertGalleryImportSession(get, session);

  const { fetchGalleryMap } = await import('../lib/gallery.js');
  const payload = await fetchGalleryMap(slug);
  assertGalleryImportSession(get, session);
  if (!payload) {
    throw new Error('That shared campaign is no longer available.');
  }
  if (payload.kind !== 'map_with_campaign') {
    return importGalleryMapImpl(get, slug, session);
  }

  const members = Array.isArray(payload.members) ? payload.members : [];
  const sharedMap = (payload.mapState && typeof payload.mapState === 'object')
    ? payload.mapState
    : {};

  const maxSaves = typeof initialState.maxSaves === 'function'
    ? initialState.maxSaves()
    : Infinity;
  const activeSaveCount = (initialState.savedSettlements || []).length;
  if (
    Number.isFinite(maxSaves)
    && activeSaveCount + members.length > maxSaves
  ) {
    throw new Error(`Not enough save slots: this campaign needs ${members.length} settlement slot(s).`);
  }

  const { normalizeSettlement } = await import('../domain/normalizeSettlement.js');
  assertGalleryImportSession(get, session);
  const saveIdBySourceId = Object.create(null);
  const importedEntries = [];

  try {
    for (const member of members) {
      assertGalleryImportSession(get, session, importedEntries.length);
      const sourceSettlement = (
        member.settlement
        && typeof member.settlement === 'object'
      )
        ? member.settlement
        : {};
      const entry = {
        name: member.name || sourceSettlement.name || 'Imported settlement',
        tier: member.tier || sourceSettlement.tier,
        settlement: normalizeSettlement({
          ...sourceSettlement,
          neighbourNetwork: [],
          neighborRelationship: null,
          interSettlementRelationships: [],
        }),
        // Imported faith/deity embeds stay dormant; this is the same single
        // scrub seam used by standalone gallery and account imports.
        config: scrubImportedConfig(sourceSettlement.config) || null,
        seed: sourceSettlement._seed || sourceSettlement.config?._seed || null,
        aiData: {},
        campaignState: { phase: 'canon', eventLog: [] },
        versionHistory: [],
      };

      const newSaveId = await savesService.save(entry, saveOptions);
      saveIdBySourceId[String(member.old_id)] = newSaveId;
      importedEntries.push({ ...entry, id: newSaveId, savedAt: Date.now() });
    }

    // The save service mints ids, so only the complete source→destination table
    // can re-address a child's historical parent receipt. Persist that projection
    // before exposing any entry in the live cache. A parent absent from this import
    // deliberately leaves the source receipt untouched; no regional lineage edge is
    // synthesized from historical provenance.
    for (let i = 0; i < importedEntries.length; i += 1) {
      const current = importedEntries[i];
      const settlement = remapSettlementParentRefForImport(
        current.settlement,
        saveIdBySourceId,
      );
      if (settlement === current.settlement) continue;
      assertGalleryImportSession(get, session, importedEntries.length);
      await savesService.update(current.id, { settlement }, saveOptions);
      importedEntries[i] = { ...current, settlement };
    }
    assertGalleryImportSession(get, session, importedEntries.length);
  } catch (error) {
    if (error?.code === 'auth_session_changed') {
      // The current B credentials cannot delete rows committed for A. Preserve
      // B-integrity and tell the caller exactly what remains in A.
      throw gallerySessionChangedAfterWrites(importedEntries.length, error);
    }

    const cleanupIncompleteCount = await cleanupImportedSaves(
      Object.values(saveIdBySourceId),
      session.ownerId,
    );
    const partialCopy = cleanupIncompleteCount === 1 ? 'copy may' : 'copies may';
    const message = cleanupIncompleteCount > 0
      ? `Import failed while copying settlements; ${cleanupIncompleteCount} partial ${partialCopy} remain in the importing account.`
      : 'Import failed while copying settlements; copied settlements were removed.';
    /** @type {Error & { cleanupIncompleteCount?: number }} */
    const wrapped = new Error(message, { cause: error });
    if (cleanupIncompleteCount > 0) {
      wrapped.cleanupIncompleteCount = cleanupIncompleteCount;
    }
    throw wrapped;
  }

  const mapState = {
    schemaVersion: 2,
    placements: {},
    labels: [],
    markers: [],
    forests: [],
  };
  const sharedBackdrop = sharedMap.customBackdrop;

  if (sharedBackdrop?.imageUrl) {
    let imageUrl = sharedBackdrop.imageUrl;
    const ownerId = session.ownerId;

    try {
      const { uploadMapBackdrop } = await import('../lib/imageUpload.js');
      assertGalleryImportSession(get, session, importedEntries.length);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      assertGalleryImportSession(get, session, importedEntries.length);

      if (ownerId && blob?.size) {
        const upload = await uploadMapBackdrop(blob, {
          ownerId,
          campaignId: 'imported',
          contentType: blob.type,
        });
        imageUrl = upload.url;
      }
    } catch {
      // An unsafe fallback is dropped below.
    }

    assertGalleryImportSession(get, session, importedEntries.length);
    mapState.customBackdrop = isSafeBackdropUrl(imageUrl)
      ? {
        imageUrl,
        w: Number(sharedBackdrop.w) || 0,
        h: Number(sharedBackdrop.h) || 0,
      }
      : null;
  } else if (sharedMap.fmgSnapshot) {
    // Never import another user's raw serialized SVG snapshot.
    mapState.seed = sharedMap.seed ?? null;
  }

  const srcPlacements = (sharedMap.placements && typeof sharedMap.placements === 'object')
    ? sharedMap.placements
    : {};

  for (const [burgId, placement] of Object.entries(srcPlacements)) {
    const newSettlementId = saveIdBySourceId[String(placement?.settlementId)];
    if (!newSettlementId) continue;
    mapState.placements[burgId] = { ...placement, settlementId: newSettlementId };
  }
  mapState.labels = Array.isArray(sharedMap.labels) ? sharedMap.labels : [];
  mapState.markers = Array.isArray(sharedMap.markers) ? sharedMap.markers : [];
  mapState.forests = Array.isArray(sharedMap.forests) ? sharedMap.forests : [];

  assertGalleryImportSession(get, session, importedEntries.length);
  set(state => {
    for (const entry of importedEntries) {
      state.savedSettlements.push(entry);
    }
  });

  const campaignId = get().createCampaign(
    payload.name ? `${payload.name} (imported)` : 'Imported campaign',
  );
  if (!campaignId) {
    throw new Error('Could not create the imported campaign.');
  }

  set(state => {
    const campaign = state.campaigns.find(item => item.id === campaignId);
    if (campaign) {
      campaign.settlementIds = Object.values(saveIdBySourceId);
    }
  });

  get().saveCampaignMap(campaignId, mapState);
  try {
    track(EVENTS.GALLERY_IMPORTED, {
      kind: 'map_with_campaign',
      member_count: members.length,
    });
  } catch {
    // Analytics never affects import.
  }

  return campaignId;
}
