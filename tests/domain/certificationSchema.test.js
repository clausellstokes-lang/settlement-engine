/**
 * certificationSchema.test.js — VISION V-10 THE CERTIFICATE, schema-wall pins.
 *
 * The manifest is a claim about the world's endurance; the schema is the wall
 * that keeps the claim honest. These pins prove: the shipped manifest is valid
 * and INERT (zero bands ⇒ nothing to over-claim); the status↔soak lockstep holds
 * (no certified band without a receipt, no pending band that claims a soak); the
 * closed property vocabulary is enforced; and the band lookup is seed-independent.
 */
import { describe, expect, it } from 'vitest';
import {
  CERTIFICATION_MANIFEST_VERSION,
  CERTIFICATION_REQUIRED_PROPERTY_KEYS,
  SOAK_PROPERTY_KEYS,
  validateSoakResult,
  validateCertificationBand,
  validateCertificationManifest,
  certificationForBand,
} from '../../src/domain/certification/certificationSchema.js';
import { WORLD_CERTIFICATION_MANIFEST } from '../../src/domain/certification/certificationManifest.js';

/** A syntactically valid certified band (used across the lockstep pins). */
const goodSoak = {
  years: 100,
  seedsTested: 8,
  ticksAdvanced: 4800,
  properties: [...CERTIFICATION_REQUIRED_PROPERTY_KEYS],
  runAt: '2026-07-20T00:00:00.000Z',
  buildHash: 'abc1234',
};
const certifiedBand = { bandId: 'sig_deadbeef', presetId: 'full_simulation', status: 'certified', soak: goodSoak };
const measuredBand = {
  bandId: 'sig_measured',
  presetId: 'full_simulation',
  status: 'measured',
  soak: { ...goodSoak, properties: ['no_crash', 'rerun_identical'] },
};
const pendingBand = { bandId: 'sig_cafef00d', presetId: 'realistic_regional', status: 'pending', soak: null };

describe('V-10 — the shipped manifest is valid and inert-honest', () => {
  it('the committed manifest validates', () => {
    const res = validateCertificationManifest(WORLD_CERTIFICATION_MANIFEST);
    expect(res.errors).toEqual([]);
    expect(res.ok).toBe(true);
  });
  it('ships EMPTY (no soak has run) — nothing to over-claim', () => {
    expect(WORLD_CERTIFICATION_MANIFEST.manifestVersion).toBe(CERTIFICATION_MANIFEST_VERSION);
    expect(WORLD_CERTIFICATION_MANIFEST.generatedAt).toBeNull();
    expect(WORLD_CERTIFICATION_MANIFEST.bands).toEqual([]);
  });
});

describe('V-10 — status↔soak lockstep (the claims-parity wall at the schema)', () => {
  it('a certified band with a full soak is valid', () => {
    expect(validateCertificationBand(certifiedBand)).toEqual({ ok: true, errors: [] });
  });
  it('a pending band with soak:null is valid', () => {
    expect(validateCertificationBand(pendingBand)).toEqual({ ok: true, errors: [] });
  });
  it('a measured band carries partial evidence without claiming certification', () => {
    expect(validateCertificationBand(measuredBand)).toEqual({ ok: true, errors: [] });
  });
  it('REJECTS a certified band missing any required property', () => {
    const res = validateCertificationBand({
      ...certifiedBand,
      soak: { ...goodSoak, properties: ['no_crash'] },
    });
    expect(res.ok).toBe(false);
    expect(res.errors.join(' ')).toMatch(/missing required properties/);
  });
  it('REJECTS a certified band with no soak (a claim without a receipt)', () => {
    const res = validateCertificationBand({ ...certifiedBand, soak: null });
    expect(res.ok).toBe(false);
    expect(res.errors.join(' ')).toMatch(/must carry a soak result/);
  });
  it('REJECTS a pending band that carries a soak (claiming a proof it lacks)', () => {
    const res = validateCertificationBand({ ...pendingBand, soak: goodSoak });
    expect(res.ok).toBe(false);
    expect(res.errors.join(' ')).toMatch(/must carry soak:null/);
  });
  it('REJECTS an unknown status', () => {
    expect(validateCertificationBand({ ...pendingBand, status: 'gold-star' }).ok).toBe(false);
  });
  it('REJECTS a measured band without a receipt', () => {
    expect(validateCertificationBand({ ...measuredBand, soak: null }).ok).toBe(false);
  });
});

describe('V-10 — the closed property vocabulary', () => {
  it('REJECTS a soak claiming a property outside SOAK_PROPERTY_KEYS', () => {
    const res = validateSoakResult({ ...goodSoak, properties: ['no_crash', 'runs_forever'] });
    expect(res.ok).toBe(false);
    expect(res.errors.join(' ')).toMatch(/unknown soak property: runs_forever/);
  });
  it('REJECTS a negative or non-finite metric', () => {
    expect(validateSoakResult({ ...goodSoak, years: -1 }).ok).toBe(false);
    expect(validateSoakResult({ ...goodSoak, ticksAdvanced: Infinity }).ok).toBe(false);
  });
  it('REJECTS duplicate property claims', () => {
    const res = validateSoakResult({ ...goodSoak, properties: ['no_crash', 'no_crash'] });
    expect(res.ok).toBe(false);
    expect(res.errors.join(' ')).toMatch(/duplicate soak property/);
  });
  it('every vocabulary key is a valid single-property soak', () => {
    for (const key of SOAK_PROPERTY_KEYS) {
      expect(validateSoakResult({ ...goodSoak, properties: [key] }).ok).toBe(true);
    }
  });
});

describe('V-10 — manifest-level governance', () => {
  it('REJECTS a wrong manifestVersion', () => {
    expect(validateCertificationManifest({ manifestVersion: 999, generatedAt: null, bands: [] }).ok).toBe(false);
  });
  it('REJECTS duplicate bandIds', () => {
    const dup = { manifestVersion: 1, generatedAt: null, bands: [certifiedBand, { ...pendingBand, bandId: 'sig_deadbeef' }] };
    const res = validateCertificationManifest(dup);
    expect(res.ok).toBe(false);
    expect(res.errors.join(' ')).toMatch(/duplicate bandId/);
  });
  it('is total on garbage (never throws)', () => {
    for (const junk of [null, undefined, 42, 'x', [], { bands: 'no' }]) {
      expect(() => validateCertificationManifest(junk)).not.toThrow();
      expect(validateCertificationManifest(junk).ok).toBe(false);
    }
  });
});

describe('V-10 — certificationForBand is seed-independent', () => {
  const manifest = { manifestVersion: 1, generatedAt: '2026-07-20T00:00:00.000Z', bands: [certifiedBand, pendingBand] };
  it('matches by bandId (the config signature) first', () => {
    expect(certificationForBand(manifest, { bandId: 'sig_deadbeef' })).toBe(certifiedBand);
  });
  it('falls back to presetId (the named band)', () => {
    expect(certificationForBand(manifest, { presetId: 'realistic_regional' })).toBe(pendingBand);
  });
  it('returns null when no band covers the world', () => {
    expect(certificationForBand(manifest, { presetId: 'nonesuch' })).toBeNull();
    expect(certificationForBand(null, { presetId: 'full_simulation' })).toBeNull();
  });
});
