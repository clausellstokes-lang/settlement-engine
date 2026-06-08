import { describe, it, expect } from 'vitest';
import {
  validateImageFile,
  publicPathFromUrl,
  isOwnGalleryUpload,
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  GALLERY_IMAGE_BUCKET,
} from '../../src/lib/imageUpload.js';

const fakeFile = (type, size) => ({ type, size });

describe('validateImageFile', () => {
  it('accepts each allowed image type at a reasonable size', () => {
    for (const type of ACCEPTED_IMAGE_TYPES) {
      expect(validateImageFile(fakeFile(type, 1024)).ok).toBe(true);
    }
  });

  it('is case-insensitive on the MIME type', () => {
    expect(validateImageFile(fakeFile('IMAGE/JPEG', 1024)).ok).toBe(true);
  });

  it('rejects non-image and disallowed types', () => {
    expect(validateImageFile(fakeFile('application/pdf', 1024)).ok).toBe(false);
    expect(validateImageFile(fakeFile('image/svg+xml', 1024)).ok).toBe(false);
    expect(validateImageFile(fakeFile('text/html', 1024)).ok).toBe(false);
  });

  it('rejects empty, missing, and oversized files', () => {
    expect(validateImageFile(null).ok).toBe(false);
    expect(validateImageFile(fakeFile('image/png', 0)).ok).toBe(false);
    expect(validateImageFile(fakeFile('image/png', MAX_IMAGE_BYTES + 1)).ok).toBe(false);
    expect(validateImageFile(fakeFile('image/png', MAX_IMAGE_BYTES)).ok).toBe(true);
  });
});

describe('publicPathFromUrl', () => {
  const origin = 'https://abc.supabase.co';
  const base = `${origin}/storage/v1/object/public/${GALLERY_IMAGE_BUCKET}/`;

  it('extracts the object path from one of our public URLs', () => {
    expect(publicPathFromUrl(`${base}user-123/keep-abc.jpg`)).toBe('user-123/keep-abc.jpg');
  });

  it('strips query strings (cache-buster / transform params)', () => {
    expect(publicPathFromUrl(`${base}u/cover-x.jpg?width=200`)).toBe('u/cover-x.jpg');
  });

  it('decodes percent-encoding', () => {
    expect(publicPathFromUrl(`${base}u/a%20b.jpg`)).toBe('u/a b.jpg');
  });

  it('returns null for external / pasted URLs and junk', () => {
    expect(publicPathFromUrl('https://i.imgur.com/abc.jpg')).toBeNull();
    expect(publicPathFromUrl(`${origin}/storage/v1/object/public/other-bucket/x.jpg`)).toBeNull();
    expect(publicPathFromUrl('')).toBeNull();
    expect(publicPathFromUrl(null)).toBeNull();
  });

  it('isOwnGalleryUpload mirrors path extraction', () => {
    expect(isOwnGalleryUpload(`${base}u/c.jpg`)).toBe(true);
    expect(isOwnGalleryUpload('https://i.imgur.com/abc.jpg')).toBe(false);
  });
});
