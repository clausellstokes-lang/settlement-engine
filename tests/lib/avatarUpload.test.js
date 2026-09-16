/**
 * avatarUpload.test.js — the profile-image pipeline's pure surface
 * (DESIGN_PROFILE_IMAGE.md §2/§3, and the §7 pins that do not need a network).
 *
 * THE PIN THAT MATTERS MOST is the EXIF one. §3.4 asks for "a fixture upload
 * carrying full EXIF round-trips to a stored object with zero metadata blocks".
 * A unit suite has no real canvas and no real storage, so asserting the ABSENCE
 * of metadata in an encoded blob here would be theatre — jsdom's toBlob is a
 * stub, and a green test would prove nothing about a browser.
 *
 * So this suite pins the property that ACTUALLY makes the guarantee true, and
 * pins it where it can be known: the source File's bytes are never among the
 * bytes handed to storage. Every stored rung comes out of the encoder. If a
 * future edit adds a "already square, already WebP, just upload the file"
 * shortcut — precisely the shortcut imageUpload.js's downscaleImageFile has —
 * this test goes red, which is the failure mode worth catching. The end-to-end
 * metadata assertion belongs to a browser-level check and is recorded as such
 * rather than faked here.
 */
import { describe, expect, test, vi } from 'vitest';

import {
  ACCEPTED_AVATAR_TYPES, AVATAR_BUCKET, MAX_AVATAR_BYTES, MIN_AVATAR_DIMENSION,
  avatarObjectPath, avatarPathFromUrl, buildAvatarLadder, contentHash,
  validateAvatarDimensions, validateAvatarFile,
} from '../../src/lib/avatarUpload.js';
import { AVATAR_RUNGS } from '../../src/lib/publicIdentity.js';

const file = (type, size) => ({ type, size });

describe('source validation — every refusal is a plain sentence', () => {
  test('accepts the three source types the design names', () => {
    for (const type of ACCEPTED_AVATAR_TYPES) {
      expect(validateAvatarFile(file(type, 1024))).toEqual({ ok: true });
    }
  });

  test('refuses an unsupported kind, by name', () => {
    const result = validateAvatarFile(file('image/gif', 1024));
    expect(result.ok).toBe(false);
    expect(result.error).toBe('Use a PNG, JPEG, or WebP image.');
  });

  test('refuses HEIC with a sentence that says what to DO', () => {
    const result = validateAvatarFile(file('image/heic', 1024));
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/HEIC/);
    expect(result.error).toMatch(/JPEG or PNG/);
  });

  test('refuses oversize and empty sources', () => {
    expect(validateAvatarFile(file('image/png', MAX_AVATAR_BYTES + 1)).ok).toBe(false);
    expect(validateAvatarFile(file('image/png', 0)).ok).toBe(false);
    expect(validateAvatarFile(null).ok).toBe(false);
    expect(validateAvatarFile(file('image/png', MAX_AVATAR_BYTES)).ok).toBe(true);
  });

  test('refuses a source below the dimension floor, and says the letter is better', () => {
    const small = validateAvatarDimensions({ width: 64, height: 400 });
    expect(small.ok).toBe(false);
    expect(small.error).toMatch(/initial will look better/);
    expect(validateAvatarDimensions({
      width: MIN_AVATAR_DIMENSION, height: MIN_AVATAR_DIMENSION,
    })).toEqual({ ok: true });
  });
});

describe('content addressing — the hash IS the cache-buster', () => {
  test('identical bytes hash identically; different bytes do not', async () => {
    const a = new Blob([new Uint8Array([1, 2, 3])]);
    const b = new Blob([new Uint8Array([1, 2, 3])]);
    const c = new Blob([new Uint8Array([1, 2, 4])]);
    const [ha, hb, hc] = await Promise.all([contentHash(a), contentHash(b), contentHash(c)]);
    expect(ha).toBe(hb);
    expect(ha).not.toBe(hc);
    expect(ha).toMatch(/^[0-9a-f]{16}$/);
  });

  test('the ladder shares ONE hash stem, so it is one sweep unit', () => {
    expect(avatarObjectPath('u1', 'deadbeefdeadbeef', 'master')).toBe('u1/deadbeefdeadbeef.webp');
    expect(avatarObjectPath('u1', 'deadbeefdeadbeef', 'standard')).toBe('u1/deadbeefdeadbeef-128.webp');
    expect(avatarObjectPath('u1', 'deadbeefdeadbeef', 'micro')).toBe('u1/deadbeefdeadbeef-32.webp');
  });

  test('a user writes only under their own id (the RLS folder shape)', () => {
    expect(avatarObjectPath('user-a', 'h', 'master').startsWith('user-a/')).toBe(true);
  });
});

describe('the sweep targets only our own objects', () => {
  test('recognises our bucket URL and recovers the path', () => {
    expect(avatarPathFromUrl(
      `https://x.supabase.co/storage/v1/object/public/${AVATAR_BUCKET}/u1/abc.webp`,
    )).toBe('u1/abc.webp');
  });

  test('returns null for anything not ours — a sweep can never aim elsewhere', () => {
    expect(avatarPathFromUrl('https://x.supabase.co/storage/v1/object/public/gallery-images/u1/a.jpg')).toBe(null);
    expect(avatarPathFromUrl('https://elsewhere.example.com/u1/abc.webp')).toBe(null);
    expect(avatarPathFromUrl('')).toBe(null);
    expect(avatarPathFromUrl(null)).toBe(null);
  });
});

describe('THE EXIF LAW — no source byte can reach storage', () => {
  test('every rung comes out of the encoder; the ladder has no passthrough arm', async () => {
    // A source that would tempt a shortcut: already square, already WebP.
    const sourceBlob = new Blob([new Uint8Array([9, 9, 9])], { type: 'image/webp' });
    const source = /** @type {never} */ ({ blob: sourceBlob, width: 512, height: 512 });

    const seen = [];
    const encodeRung = vi.fn(async (_src, size) => {
      seen.push(size);
      return new Blob([new Uint8Array([size & 0xff])], { type: 'image/webp' });
    });

    const ladder = await buildAvatarLadder(source, { encodeRung });

    // All three rungs were ENCODED — none was passed through.
    expect(encodeRung).toHaveBeenCalledTimes(3);
    expect(seen.sort((a, b) => a - b)).toEqual([AVATAR_RUNGS.micro, AVATAR_RUNGS.standard, AVATAR_RUNGS.master]);

    // And no rung is the source object itself.
    for (const rung of [ladder.master, ladder.standard, ladder.micro]) {
      expect(rung).not.toBe(sourceBlob);
      expect(rung).not.toBe(source);
    }
  });

  test('the ladder is exactly the three design rungs, no more and no fewer', async () => {
    const encodeRung = async (_src, size) => new Blob([new Uint8Array([size & 0xff])]);
    const ladder = await buildAvatarLadder(/** @type {never} */ ({}), { encodeRung });
    expect(Object.keys(ladder).sort()).toEqual(['master', 'micro', 'standard']);
  });
});
