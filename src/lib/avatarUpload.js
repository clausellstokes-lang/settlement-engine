/**
 * avatarUpload.js — the profile-image pipeline (DESIGN_PROFILE_IMAGE.md §2/§3).
 *
 * ⚠️ THIS IS THE PRODUCT'S FIRST USER-SUPPLIED PUBLIC IMAGERY. The pipeline and
 * the moderation discipline around it ARE the feature, not overhead. Two rules
 * carry most of the weight, and both are structural rather than procedural:
 *
 *   1. EXIF DIES HERE, BY CONSTRUCTION (§3.4). Every stored byte is produced by
 *      a canvas re-encode, so GPS coordinates, device identifiers and capture
 *      timestamps are gone because there is no code path that could carry them —
 *      not because a scrubbing step remembered to run. There is deliberately NO
 *      "already the right size and format, pass the file through" shortcut.
 *      ⚠️ src/lib/imageUpload.js's downscaleImageFile DOES have such a shortcut
 *      (`if (scale === 1 && /png|webp/) resolve({ blob: file })`), which stores
 *      the user's ORIGINAL bytes, metadata included. That is a different lane's
 *      surface (map backdrops) and is reported, not silently changed here — but
 *      it is exactly the trap this module refuses to copy.
 *
 *   2. THE HASH IS THE CACHE-BUSTER (§2). Objects are content-addressed and
 *      immutable, so replacing an avatar WRITES A NEW OBJECT and repoints the
 *      profile; it never mutates one in place. No `?v=` query strings, no cache
 *      invalidation to get wrong, and a long-cache header is safe by definition.
 *      The superseded object is swept by an explicit GC call at persist time —
 *      never trusted to expire.
 *
 * ── THE SIZE LADDER, AND WHY IT IS PRE-DERIVED (a judgment, vetoable)
 * The design offers two arms: store the master ONLY and derive 128/32 through
 * Supabase image transformations IF the project's plan includes them, otherwise
 * pre-derive all three client-side. This ships the PRE-DERIVE arm, because the
 * plan check is not something this build can run, and pre-deriving is correct on
 * every plan while the transform arm is correct on only some. The cost is two
 * extra small objects per avatar (a 128 and a 32 WebP, together a few KB). If the
 * owner confirms transformations are available, `buildAvatarLadder` is the one
 * function to change and nothing else moves. Say "veto" to take the other arm.
 *
 * ── LAYERING
 * The pure parts — validation, path naming, hashing, the ladder's shape — are
 * unit-tested; the canvas encode and the network call are thin, injectable
 * wrappers. That split is the same one src/lib/imageUpload.js established.
 * The size-ladder URL math lives in src/lib/publicIdentity.js (pure, zero
 * imports) and this module consumes it, never the other way round.
 */

import { AVATAR_RUNGS } from './publicIdentity.js';
import { supabase, isConfigured } from './supabase.js';

/**
 * The avatars bucket — NEW, and deliberately not the gallery bucket.
 *
 * The recorded audit lesson (§3.5): `gallery-images` is provisioned on a
 * public-write pattern for a different lane's needs. Reusing it would inherit
 * that lane's RLS shape for the product's most identity-sensitive object. A
 * separate bucket lets the avatars policy be exactly what avatars need: a user
 * writes ONLY under their own id, everyone reads.
 */
export const AVATAR_BUCKET = 'avatars';

/** Accepted SOURCE types. The stored asset is always WebP regardless (§3.1). */
export const ACCEPTED_AVATAR_TYPES = Object.freeze(['image/png', 'image/jpeg', 'image/webp']);

/** HEIC is converted where the browser decodes it, and plainly refused where it does not. */
export const HEIC_TYPES = Object.freeze(['image/heic', 'image/heif']);

/** Source caps (§3.1). */
export const MAX_AVATAR_BYTES = 10 * 1024 * 1024;
export const MIN_AVATAR_DIMENSION = 128;

/** The authored WebP quality band for the stored master and its rungs. */
export const AVATAR_WEBP_QUALITY = 0.9;

/** The authored per-day upload band (§3.6). Enforced server-side; mirrored here for copy. */
export const AVATAR_UPLOADS_PER_DAY = 20;

/**
 * Validate a user-picked source file BEFORE decoding it.
 *
 * Every refusal states its reason in a plain sentence (§3.6) — "too large",
 * "wrong kind", "too small" are things a person can act on; "invalid input" is
 * not. Returns { ok } or { ok:false, error }; never throws.
 *
 * @param {{ type?: string, size?: number } | null | undefined} file
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
export function validateAvatarFile(file) {
  if (!file) return { ok: false, error: 'No file selected.' };
  const type = String(file.type || '').toLowerCase();
  if (HEIC_TYPES.includes(type)) {
    // Reached only where the browser could not decode it; the caller converts
    // first where it can. Say what happened and what to do about it.
    return { ok: false, error: 'This browser can’t read HEIC photos. Save it as JPEG or PNG and try again.' };
  }
  if (!ACCEPTED_AVATAR_TYPES.includes(type)) {
    return { ok: false, error: 'Use a PNG, JPEG, or WebP image.' };
  }
  const size = Number(file.size) || 0;
  if (size <= 0) return { ok: false, error: 'That file looks empty.' };
  if (size > MAX_AVATAR_BYTES) {
    return { ok: false, error: `That image is too large (max ${Math.round(MAX_AVATAR_BYTES / (1024 * 1024))} MB).` };
  }
  return { ok: true };
}

/**
 * Validate the DECODED source dimensions (§3.1: at least 128×128).
 *
 * Below the floor the letter-circle is honestly the better rendering, and saying
 * so is kinder than upscaling a thumbnail into a blurry face.
 *
 * @param {{ width?: number, height?: number }} dims
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
export function validateAvatarDimensions({ width = 0, height = 0 } = {}) {
  if (width < MIN_AVATAR_DIMENSION || height < MIN_AVATAR_DIMENSION) {
    return {
      ok: false,
      error: `That image is too small (at least ${MIN_AVATAR_DIMENSION}×${MIN_AVATAR_DIMENSION} pixels). Your initial will look better.`,
    };
  }
  return { ok: true };
}

/**
 * The content hash that NAMES the object (§2) — first 16 hex chars of SHA-256.
 *
 * Sixteen hex characters is 64 bits. This is a cache key and a name, not a
 * security boundary: nothing authenticates on it, and a collision would mean two
 * users' identical-bytes avatars share an object, which is harmless because the
 * path is already scoped per user.
 *
 * @param {Blob} blob
 * @returns {Promise<string>}
 */
export async function contentHash(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const hex = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
  return hex.slice(0, 16);
}

/**
 * The storage key for a rung: `{userId}/{hash}.webp`, with `-128` / `-32`
 * suffixes sharing the master's hash stem so the whole ladder is one sweep unit.
 *
 * The bucket name is NOT part of the path (Supabase takes it separately).
 *
 * @param {string} userId
 * @param {string} hash
 * @param {'master'|'standard'|'micro'} rung
 * @returns {string}
 */
export function avatarObjectPath(userId, hash, rung) {
  const suffix = rung === 'master' ? '' : `-${rung === 'micro' ? AVATAR_RUNGS.micro : AVATAR_RUNGS.standard}`;
  return `${userId}/${hash}${suffix}.webp`;
}

/**
 * Encode a square source into one WebP rung at `size`×`size`, THROUGH A CANVAS.
 *
 * This is the EXIF chokepoint. `drawImage` reads pixels; it cannot read metadata,
 * so the encoded output physically cannot carry any. Browser-only.
 *
 * @param {CanvasImageSource} imageSource a decoded image/bitmap, already cropped square
 * @param {number} size
 * @returns {Promise<Blob>}
 */
export function encodeAvatarRung(imageSource, size) {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('Image processing is only available in the browser.'));
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) { reject(new Error('Could not prepare that image.')); return; }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imageSource, 0, 0, size, size);
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not process that image.'))),
      'image/webp',
      AVATAR_WEBP_QUALITY,
    );
  });
}

/**
 * Build the whole ladder from ONE square source.
 *
 * `encodeRung` is injected so the pure orchestration — which rungs exist, in
 * what order, at what sizes — is testable without a real canvas, and so the
 * "no source bytes ever reach storage" pin can actually be asserted rather than
 * asserted-about.
 *
 * @param {CanvasImageSource} squareSource
 * @param {{ encodeRung?: (src: CanvasImageSource, size: number) => Promise<Blob> }} [deps]
 * @returns {Promise<{ master: Blob, standard: Blob, micro: Blob }>}
 */
export async function buildAvatarLadder(squareSource, { encodeRung = encodeAvatarRung } = {}) {
  const [master, standard, micro] = await Promise.all([
    encodeRung(squareSource, AVATAR_RUNGS.master),
    encodeRung(squareSource, AVATAR_RUNGS.standard),
    encodeRung(squareSource, AVATAR_RUNGS.micro),
  ]);
  return { master, standard, micro };
}

/**
 * Upload a built ladder and return the MASTER's public URL.
 *
 * All three rungs share one content hash, so a replacement writes a wholly new
 * set and the profile pointer swings atomically from the caller's perspective.
 * `upsert:true` makes a retry of the same bytes idempotent rather than an error.
 *
 * @param {{ master: Blob, standard: Blob, micro: Blob }} ladder
 * @param {{ userId?: string }} [opts]
 * @returns {Promise<{ url: string, hash: string, paths: string[] }>}
 */
export async function uploadAvatarLadder(ladder, { userId } = {}) {
  if (!isConfigured || !supabase) throw new Error('Image hosting is not configured.');
  if (!userId) throw new Error('You must be signed in to upload a profile image.');
  if (!ladder?.master?.size) throw new Error('Nothing to upload.');

  // The MASTER's bytes name the whole ladder — one hash, one sweep unit.
  const hash = await contentHash(ladder.master);
  /** @type {Array<['master'|'standard'|'micro', Blob]>} */
  const rungs = [['master', ladder.master], ['standard', ladder.standard], ['micro', ladder.micro]];
  const paths = [];

  for (const [rung, blob] of rungs) {
    const path = avatarObjectPath(userId, hash, rung);
    const { error } = await supabase.storage.from(AVATAR_BUCKET).upload(path, blob, {
      contentType: 'image/webp',
      // Immutable by construction: a different image is a different hash, so a
      // year-long cache can never serve a stale face.
      cacheControl: '31536000',
      upsert: true,
    });
    if (error) {
      const message = /bucket/i.test(error.message || '')
        ? 'Profile image storage isn’t set up yet (the avatars bucket is missing).'
        : (error.message || 'Upload failed.');
      throw new Error(message);
    }
    paths.push(path);
  }

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(avatarObjectPath(userId, hash, 'master'));
  const url = data?.publicUrl;
  if (!url) throw new Error('Upload succeeded but no public URL was returned.');
  return { url, hash, paths };
}

/**
 * The object path for one of OUR avatar URLs, or null when the URL is not ours.
 * Pure + tested, so the sweep below can never aim at somebody else's object.
 *
 * @param {unknown} url
 * @returns {string | null}
 */
export function avatarPathFromUrl(url) {
  if (typeof url !== 'string' || !url) return null;
  const marker = `/storage/v1/object/public/${AVATAR_BUCKET}/`;
  const at = url.indexOf(marker);
  if (at === -1) return null;
  const path = url.slice(at + marker.length).split('?')[0];
  try { return decodeURIComponent(path) || null; } catch { return path || null; }
}

/**
 * Sweep a superseded avatar's WHOLE ladder (§2: "garbage-collected on a sweep,
 * never trusted to expire").
 *
 * Call at PERSIST time, never at draft time — the published profile still points
 * at the old URL until the new one is saved, and deleting early would strand a
 * live public avatar on a dead URL whenever the user cancels or the save fails.
 * That is the lesson CoverImageField's header records, applied here.
 *
 * Best-effort and never throws: an orphaned object is harmless, a thrown sweep
 * during a successful save is not.
 *
 * @param {unknown} masterUrl
 * @returns {Promise<void>}
 */
export async function sweepAvatarLadder(masterUrl) {
  if (!isConfigured || !supabase) return;
  const masterPath = avatarPathFromUrl(masterUrl);
  if (!masterPath) return;
  const stem = masterPath.replace(/\.webp$/i, '');
  const paths = [masterPath, `${stem}-${AVATAR_RUNGS.standard}.webp`, `${stem}-${AVATAR_RUNGS.micro}.webp`];
  try {
    await supabase.storage.from(AVATAR_BUCKET).remove(paths);
  } catch {
    /* an orphaned object is harmless; a thrown sweep during a good save is not */
  }
}
