/**
 * worldCode.test.js — Vision V-13 THE SEED POST.
 *
 * Pins: code ROUND-TRIP (encode→decode is exact) · fail-CLOSED decode (tampered /
 * truncated / unknown-scheme / unknown-version → null) · and the same-digest
 * replay — a decoded code composes to the IDENTICAL world fingerprint as the
 * direct tuple (the "code → identical world" guarantee), asserted RELATIVELY
 * against the existing composer so it mints no new frozen golden family.
 */
import { describe, it, expect } from 'vitest';
import {
  encodeWorldCode,
  decodeWorldCode,
  WORLD_CODE_SCHEME,
} from '../../src/lib/worldCode.js';
import { composeInstantWorld, instantWorldFingerprint } from '../../src/lib/instantWorld/composeInstantWorld.js';

describe('worldCode — round trip', () => {
  it('encode→decode returns the seed and canonical preset exactly', () => {
    const world = { seed: 'realm-alpha', basicConfig: { realmSize: 'small', tone: 'dramatic_campaign', mapKind: 'highIsland' } };
    const code = encodeWorldCode(world);
    expect(code.startsWith(`${WORLD_CODE_SCHEME}.`)).toBe(true);
    const decoded = decodeWorldCode(code);
    expect(decoded).toEqual({ version: 1, seed: 'realm-alpha', basicConfig: { realmSize: 'small', tone: 'dramatic_campaign', mapKind: 'highIsland' } });
  });

  it('canonicalizes the preset — drops unknown keys, keeps only the three knobs', () => {
    const code = encodeWorldCode({ seed: 's1', basicConfig: { realmSize: 'large', junk: 'x', tone: 'quiet_local' } });
    expect(decodeWorldCode(code).basicConfig).toEqual({ realmSize: 'large', tone: 'quiet_local' });
  });

  it('accepts a numeric seed and round-trips it as a string', () => {
    const code = encodeWorldCode({ seed: 12345, basicConfig: {} });
    expect(decodeWorldCode(code).seed).toBe('12345');
  });

  it('encoding is deterministic (same input → same code)', () => {
    const world = { seed: 'abc', basicConfig: { realmSize: 'medium' } };
    expect(encodeWorldCode(world)).toBe(encodeWorldCode({ ...world }));
  });

  it('throws when the seed is missing (a seedless world cannot be shared)', () => {
    expect(() => encodeWorldCode({ basicConfig: {} })).toThrow(/seed/);
    expect(() => encodeWorldCode({ seed: '' })).toThrow(/seed/);
  });
});

describe('worldCode — fail closed', () => {
  const good = encodeWorldCode({ seed: 'realm-alpha', basicConfig: { realmSize: 'small' } });

  it('rejects non-strings / empty', () => {
    for (const bad of [null, undefined, '', 42, {}, []]) {
      expect(decodeWorldCode(/** @type {any} */ (bad))).toBeNull();
    }
  });

  it('rejects a wrong number of parts', () => {
    expect(decodeWorldCode('w1.onlytwo')).toBeNull();
    expect(decodeWorldCode('w1.a.b.c')).toBeNull();
  });

  it('rejects an unknown scheme', () => {
    const parts = good.split('.');
    expect(decodeWorldCode(`w9.${parts[1]}.${parts[2]}`)).toBeNull();
  });

  it('rejects a corrupted payload (checksum mismatch)', () => {
    const parts = good.split('.');
    const tampered = parts[1].slice(0, -1) + (parts[1].endsWith('A') ? 'B' : 'A');
    expect(decodeWorldCode(`w1.${tampered}.${parts[2]}`)).toBeNull();
  });

  it('rejects a truncated code (checksum mismatch)', () => {
    expect(decodeWorldCode(good.slice(0, -3))).toBeNull();
  });

  it('rejects an invalid base64url character', () => {
    const parts = good.split('.');
    expect(decodeWorldCode(`w1.${parts[1]}*.${parts[2]}`)).toBeNull();
  });
});

describe('worldCode — same-digest replay (code → identical world)', () => {
  it('a decoded code composes to the identical world fingerprint as the direct tuple', () => {
    const seed = 'realm-alpha';
    const basicConfig = { realmSize: 'small', tone: 'realistic_regional', mapKind: 'highIsland' };
    const code = encodeWorldCode({ seed, basicConfig });
    const decoded = decodeWorldCode(code);

    const fromCode = composeInstantWorld({ seed: decoded.seed, basicConfig: decoded.basicConfig });
    const direct = composeInstantWorld({ seed, basicConfig });

    expect(fromCode.fingerprint).toEqual(direct.fingerprint);
    expect(fromCode.fingerprint).toEqual(instantWorldFingerprint(fromCode));
  });

  it('a different code yields a different world fingerprint', () => {
    const a = decodeWorldCode(encodeWorldCode({ seed: 'seed-1', basicConfig: { realmSize: 'small' } }));
    const b = decodeWorldCode(encodeWorldCode({ seed: 'seed-2', basicConfig: { realmSize: 'small' } }));
    const fa = composeInstantWorld({ seed: a.seed, basicConfig: a.basicConfig }).fingerprint;
    const fb = composeInstantWorld({ seed: b.seed, basicConfig: b.basicConfig }).fingerprint;
    expect(fa).not.toEqual(fb);
  });
});
