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
