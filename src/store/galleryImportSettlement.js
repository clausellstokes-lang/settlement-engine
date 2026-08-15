/**
 * galleryImportSettlement.js — the body of campaignSlice's importGallerySettlement
 * action, extracted to a LAZY sibling so neither the gallery client, the
 * settlement migration chain (normalizeSettlement's transitive closure), nor this
 * cold-path logic ride the first-paint entry. campaignSlice keeps only a thin
 * `await import('./galleryImportSettlement.js')` wrapper; this runs on import-click.
 *
 * Clone a public, owner-opted-in gallery dossier into the caller's library. The
 * import_gallery_dossier RPC (048) is server-authoritative: it returns the payload
 * only for a gallery_importable dossier to a signed-in caller AND is premium-gated
 * server-side (current_user_has_premium_access, migration 120); the 014 BEFORE
 * INSERT trigger enforces the per-tier slot cap on save. The client tier check
 * here is the same UX affordance the map-import path uses (a clean message + no
 * wasted round-trip). The clone is the public-safe projection (DM-private content
 * already stripped server-side); cross-settlement refs and the generation seed are
 * dropped, and provenance is stamped. Returns the new save id.
 */

import { fetchDossierForImport } from '../lib/gallery.js';
import { normalizeSettlement } from '../domain/normalizeSettlement.js';
import { saves as savesService } from '../lib/saves.js';
import { track, EVENTS } from '../lib/analytics.js';
import { scrubImportedConfig } from '../lib/importScrub.js';

export async function importGallerySettlementImpl(get, set, slug) {
  const st = get();
  if (!st.auth?.user) throw new Error('Sign in to import settlements.');
  // Premium gate (parity with importGalleryMap): tier==='premium' covers both
  // Cartographer and Founder; developer/admin roles pass for testing. Sharing to
  // the gallery is free — this gate is on IMPORT only. The import RPC is the
  // server-authoritative gate; this is a clean message + no wasted round-trip.
  const role = st.auth?.role;
  const canImport = st.auth?.tier === 'premium' || role === 'developer' || role === 'admin';
  if (!canImport) throw new Error('Importing settlements is a premium feature.');
  // Slot pre-flight for a friendly message; the 014 trigger is the real gate.
  const max = (typeof st.maxSaves === 'function') ? st.maxSaves() : Infinity;
  const activeNow = (st.savedSettlements || []).length;
  if (Number.isFinite(max) && activeNow + 1 > max) {
    throw new Error('Your library is full. Free up a slot or upgrade to import more settlements.');
  }
  const dossier = await fetchDossierForImport(slug);
  if (!dossier) throw new Error('That settlement is not available to import.');
  const src = (dossier.settlement && typeof dossier.settlement === 'object') ? dossier.settlement : {};
  const importedAt = new Date().toISOString();
  const entry = {
    name: `${dossier.name || src.name || 'Imported settlement'} (imported)`,
    tier: dossier.tier || src.tier,
    // Static clone of the public-safe projection. Strip cross-settlement refs
    // (they would re-trigger supabaseSave's back-link wiring into the importer's
    // unrelated saves) and scrub EVERY generation seed — top-level and the one
    // embedded in settlement.config — so an imported copy can NEVER regenerate the
    // unsanitized original via the deterministic engine.
    //
    // normalizeSettlement wraps the built clone — parity with the account-file
    // import (accountImport.js normalizes the exact same shape); the gallery path
    // was the omission. This canonicalizes BOTH the persisted row and the
    // in-memory savedSettlements push below.
    settlement: normalizeSettlement({
      ...src,
      neighbourNetwork: [],
      neighborRelationship: null,
      interSettlementRelationships: [],
      _seed: undefined,
      // Strip the seed AND the religion/faith embed bridge: an imported settlement
      // must arrive DORMANT — no foreign pantheon. The single-writer scrub drops the
      // seed, primaryDeityRef, primaryDeitySnapshot, cultDeitySnapshots, and the
      // faithProfile projection (store-4 — cultDeitySnapshots was previously missed
      // here, so DM-imposed cults imported live and activated the religion subsystem).
      config: scrubImportedConfig(src.config),
      importedFrom: { slug, sourceName: dossier.name || src.name || null, importedAt },
    }),
    config: null,
    seed: null,
    aiData: {},
    campaignState: { phase: 'draft', eventLog: [] },
    versionHistory: [],
  };
  let newSaveId;
  try {
    newSaveId = await savesService.save(entry);
  } catch (err) {
    // Surface the save-limit trigger's message verbatim (server-authoritative).
    throw new Error(err?.message || 'Import failed while saving the settlement.', { cause: err });
  }
  set(state => { state.savedSettlements.push({ ...entry, id: newSaveId, savedAt: Date.now() }); });
  try { track(EVENTS.GALLERY_IMPORTED, { kind: 'settlement' }); } catch { /* analytics never affects import */ }
  return newSaveId;
}
