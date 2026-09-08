/**
 * proposedSoakBands.test.js — the R-15 TUNING-BAND MANIFEST guard.
 *
 * The soak proves the world against committed RATIFIED distribution bands. These tests
 * pin the manifest's integrity (the same invariants scripts/check-tuning-bands.mjs
 * gates), the owner-signature law (every band is RATIFIED), the
 * six-coupling coverage, and the §10 envelope-projection contract (the manifest can feed
 * runWeeklyTuningJob unchanged).
 */
import { describe, it, expect } from 'vitest';
import {
  RATIFIED_SOAK_BANDS,
  SOAK_COUPLINGS,
  SOAK_BAND_MANIFEST_VERSION,
  validateSoakBand,
  assertValidSoakBands,
  toEnvelopes,
} from '../../src/domain/tuning/proposedSoakBands.js';
import { runWeeklyTuningJob } from '../../src/domain/tuning/weeklyTuningJob.js';

describe('the manifest ships valid', () => {
  it('every band passes the schema validator', () => {
    for (const band of RATIFIED_SOAK_BANDS) {
      const { ok, reasons } = validateSoakBand(band);
      expect(reasons).toEqual([]);
      expect(ok).toBe(true);
    }
  });

  it('assertValidSoakBands accepts the whole manifest', () => {
    expect(assertValidSoakBands(RATIFIED_SOAK_BANDS)).toBe(true);
  });

  it('has a stable version and a non-empty set', () => {
    expect(SOAK_BAND_MANIFEST_VERSION).toBe(2);
    expect(RATIFIED_SOAK_BANDS.length).toBeGreaterThanOrEqual(6);
  });
});

describe('the owner-signature law', () => {
  it('EVERY band is RATIFIED', () => {
    for (const band of RATIFIED_SOAK_BANDS) expect(band.status).toBe('RATIFIED');
  });

  it('every band names a governing constant + module', () => {
    for (const band of RATIFIED_SOAK_BANDS) {
      expect(Array.isArray(band.constantIds) && band.constantIds.length).toBeTruthy();
      expect(band.constantModule).toMatch(/^src\/domain\//);
      expect(band.rationale.length).toBeGreaterThanOrEqual(20);
    }
  });
});

describe('coverage of the six couplings the soak proves', () => {
  it('every named coupling family has at least one band', () => {
    for (const coupling of SOAK_COUPLINGS) {
      expect(RATIFIED_SOAK_BANDS.some((b) => b.coupling === coupling)).toBe(true);
    }
  });

  it('no duplicate metric ids', () => {
    const ids = RATIFIED_SOAK_BANDS.map((b) => b.metric);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('the schema validator rejects malformed bands', () => {
  const base = RATIFIED_SOAK_BANDS[0];
  it('rejects a flipped band (min >= max)', () => {
    expect(validateSoakBand({ ...base, min: 5, max: 1 }).ok).toBe(false);
  });
  it('rejects an unknown coupling', () => {
    expect(validateSoakBand({ ...base, coupling: 'not_a_coupling' }).ok).toBe(false);
  });
  it('rejects an unsigned proposed status', () => {
    expect(validateSoakBand({ ...base, status: 'PROPOSED' }).ok).toBe(false);
  });
  it('rejects an empty constant list', () => {
    expect(validateSoakBand({ ...base, constantIds: [] }).ok).toBe(false);
  });
  it('rejects a null currentValue without emergent:true', () => {
    expect(validateSoakBand({ ...base, currentValue: null, emergent: false }).ok).toBe(false);
  });
});

describe('the §10 envelope projection is lossless', () => {
  it('yields one { metric, min, max } envelope per band', () => {
    const envelopes = toEnvelopes(RATIFIED_SOAK_BANDS);
    expect(envelopes.length).toBe(RATIFIED_SOAK_BANDS.length);
    for (const env of envelopes) {
      expect(typeof env.metric).toBe('string');
      expect(env.min).toBeLessThan(env.max);
    }
  });

  it('feeds runWeeklyTuningJob and diagnoses a divergence outside a band', () => {
    const envelopes = toEnvelopes(RATIFIED_SOAK_BANDS);
    // An observed value FAR above the first band's ceiling must surface as a divergence.
    const target = envelopes[0];
    const rollups = [{ metric: target.metric, dims: {}, value: target.max + 100 }];
    const { healthReport } = runWeeklyTuningJob({ rollups, envelopes });
    expect(healthReport.divergences).toBeGreaterThanOrEqual(1);
  });
});
