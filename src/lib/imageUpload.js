/**
 * imageUpload.js — gallery cover image uploads to Supabase Storage (§3).
 *
 * The cropper (ImageCropper) produces a landscape JPEG Blob; this module
 * validates the SOURCE file the user picked, uploads the cropped blob under the
 * owner's folder, and returns a public URL that goes straight into the existing
 * `gallery_image_url` text column (no schema change needed for the URL).
 *
 * Storage layout (provisioned by migration 028):
 *   bucket `gallery-images` (public read) · objects keyed `{ownerId}/{file}`
 *   RLS: authenticated users may write/replace/delete only under their own uid.
 *
 * The pure validators are unit-tested; the network call is a thin wrapper.
 */

import { supabase, isConfigured } from './supabase.js';

export const GALLERY_IMAGE_BUCKET = 'gallery-images';

/** Accepted SOURCE image types (the crop always re-encodes to JPEG). */
export const ACCEPTED_IMAGE_TYPES = Object.freeze([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
]);

/** Max source-file size: 8 MB. The cropped JPEG we upload is far smaller. */
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/**
 * Validate a user-picked image File before we bother decoding it.
 * Returns { ok: true } or { ok: false, error } — never throws.
 */
export function validateImageFile(file) {
  if (!file) return { ok: false, error: 'No file selected.' };
  const type = String(file.type || '').toLowerCase();
  if (!ACCEPTED_IMAGE_TYPES.includes(type)) {
    return { ok: false, error: 'Use a JPEG, PNG, WebP, or GIF image.' };
  }
  const size = Number(file.size) || 0;
  if (size <= 0) return { ok: false, error: 'That file looks empty.' };
  if (size > MAX_IMAGE_BYTES) {
    return { ok: false, error: `Image is too large (max ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))} MB).` };
  }
  return { ok: true };
}

/**
 * Given a Supabase public URL for an object in our bucket, return the object
 * path (`{ownerId}/{file}`) — or null if the URL isn't one of ours. Pure +
 * tested so deletion targets the right key.
 */
export function publicPathFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const marker = `/storage/v1/object/public/${GALLERY_IMAGE_BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  const path = url.slice(i + marker.length).split('?')[0];
  try {
    return decodeURIComponent(path) || null;
  } catch {
    return path || null;
  }
}

/** True when a URL points at an object in our own gallery bucket. */
export function isOwnGalleryUpload(url) {
  return publicPathFromUrl(url) != null;
}

/**
 * Upload a cropped cover Blob and return its public URL.
 * @param {Blob} blob              - JPEG blob from the cropper.
 * @param {Object} [opts]
 * @param {string} [opts.ownerId]  - The owner's auth uid (RLS folder); required at runtime.
 * @param {string} [opts.settlementId]
 * @returns {Promise<{ url: string, path: string }>}
 */
export async function uploadGalleryCover(blob, { ownerId, settlementId } = {}) {
  if (!isConfigured || !supabase) throw new Error('Image hosting is not configured.');
  if (!ownerId) throw new Error('You must be signed in to upload an image.');
  if (!blob || !blob.size) throw new Error('Nothing to upload.');

  const stamp = Date.now().toString(36);
  const base = String(settlementId || 'cover').replace(/[^a-z0-9-]/gi, '').slice(0, 40) || 'cover';
  const path = `${ownerId}/${base}-${stamp}.jpg`;

  const { error } = await supabase.storage
    .from(GALLERY_IMAGE_BUCKET)
    .upload(path, blob, { contentType: 'image/jpeg', cacheControl: '3600', upsert: true });
  if (error) {
    const msg = /bucket/i.test(error.message || '')
      ? 'Image storage isn’t set up yet (the gallery-images bucket is missing).'
      : (error.message || 'Upload failed.');
    throw new Error(msg);
  }

  const { data } = supabase.storage.from(GALLERY_IMAGE_BUCKET).getPublicUrl(path);
  const url = data?.publicUrl;
  if (!url) throw new Error('Upload succeeded but no public URL was returned.');
  return { url, path };
}

/**
 * Best-effort delete of a previously uploaded cover. No-op for external URLs
 * (pasted links) or when storage isn't configured. Never throws.
 */
export async function removeGalleryCover(url) {
  if (!isConfigured || !supabase) return;
  const path = publicPathFromUrl(url);
  if (!path) return;
  try {
    await supabase.storage.from(GALLERY_IMAGE_BUCKET).remove([path]);
  } catch {
    /* non-fatal — orphaned object is harmless */
  }
}

// ── Custom map backdrops (Project 1) ─────────────────────────────────────────
export const MAP_BACKDROP_BUCKET = 'map-backdrops';

/**
 * Decode + downscale a user-picked image to fit within maxDim on its longest
 * side, preserving PNG/WebP transparency. Returns { blob, w, h, type } where w/h
 * are the FINAL pixel dims (stored on the backdrop so placements anchor to them).
 * Browser-only (uses canvas); never throws synchronously.
 */
export function downscaleImageFile(file, maxDim = 4096) {
  return new Promise((resolve, reject) => {
    if (typeof Image === 'undefined' || typeof document === 'undefined') {
      reject(new Error('Image processing is only available in the browser.'));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const w0 = img.naturalWidth || img.width;
      const h0 = img.naturalHeight || img.height;
      if (!w0 || !h0) { reject(new Error('Could not read that image.')); return; }
      const scale = Math.min(1, maxDim / Math.max(w0, h0));
      const w = Math.max(1, Math.round(w0 * scale));
      const h = Math.max(1, Math.round(h0 * scale));
      // No resize needed and already a lossless/transparent format → keep bytes.
      if (scale === 1 && /png|webp/i.test(file.type)) {
        resolve({ blob: file, w, h, type: file.type });
        return;
      }
      try {
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const type = /png/i.test(file.type) ? 'image/png' : (/webp/i.test(file.type) ? 'image/webp' : 'image/jpeg');
        canvas.toBlob(
          (blob) => blob ? resolve({ blob, w, h, type }) : reject(new Error('Could not process that image.')),
          type, 0.92,
        );
      } catch (e) { reject(e instanceof Error ? e : new Error('Could not process that image.')); }
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read that image.')); };
    img.src = url;
  });
}

const BACKDROP_EXT = { 'image/png': 'png', 'image/webp': 'webp', 'image/jpeg': 'jpg' };

/**
 * Upload a (client-downscaled) custom map backdrop and return its public URL.
 * Unlike the gallery cover, the source format is PRESERVED (a hand-drawn map may
 * be a PNG with transparency), so the caller passes the blob's contentType.
 * @param {Blob} blob
 * @param {Object} [opts]
 * @param {string} [opts.ownerId]    - owner auth uid (RLS folder); required at
 *        runtime (throws when missing) — optional in the type so the `= {}`
 *        default destructure typechecks.
 * @param {string} [opts.campaignId]
 * @param {string} [opts.contentType] - defaults to blob.type or image/png.
 * @returns {Promise<{ url: string, path: string }>}
 */
export async function uploadMapBackdrop(blob, { ownerId, campaignId, contentType } = {}) {
  if (!isConfigured || !supabase) throw new Error('Image hosting is not configured.');
  if (!ownerId) throw new Error('You must be signed in to upload a map image.');
  if (!blob || !blob.size) throw new Error('Nothing to upload.');

  const type = String(contentType || blob.type || 'image/png').toLowerCase();
  const ext = BACKDROP_EXT[type] || 'png';
  const stamp = Date.now().toString(36);
  const base = String(campaignId || 'backdrop').replace(/[^a-z0-9-]/gi, '').slice(0, 40) || 'backdrop';
  const path = `${ownerId}/${base}-${stamp}.${ext}`;

  const { error } = await supabase.storage
    .from(MAP_BACKDROP_BUCKET)
    .upload(path, blob, { contentType: type, cacheControl: '3600', upsert: true });
  if (error) {
    const msg = /bucket/i.test(error.message || '')
      ? 'Map image storage isn’t set up yet (the map-backdrops bucket is missing).'
      : (error.message || 'Upload failed.');
    throw new Error(msg);
  }

  const { data } = supabase.storage.from(MAP_BACKDROP_BUCKET).getPublicUrl(path);
  const url = data?.publicUrl;
  if (!url) throw new Error('Upload succeeded but no public URL was returned.');
  return { url, path };
}

/** Object path (`{uid}/{file}`) for a backdrop URL, or null if not one of ours. */
export function backdropPathFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const marker = `/storage/v1/object/public/${MAP_BACKDROP_BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  const path = url.slice(i + marker.length).split('?')[0];
  try { return decodeURIComponent(path) || null; } catch { return path || null; }
}

/** Best-effort delete of a previously uploaded backdrop. Never throws. */
export async function removeMapBackdrop(url) {
  if (!isConfigured || !supabase) return;
  const path = backdropPathFromUrl(url);
  if (!path) return;
  try { await supabase.storage.from(MAP_BACKDROP_BUCKET).remove([path]); } catch { /* orphan is harmless */ }
}
