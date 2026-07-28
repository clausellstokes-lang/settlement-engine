/**
 * certificationClaimsParity.test.js — VISION V-10, THE CLAIMS-PARITY LAW.
 * [claims-parity-3] — the surface never claims what the soak has not proven.
 *
 * The mirror of tests/ui/pricingPageBands.test.jsx's copy-source guard, applied
 * to certification: walk the rendered view and assert that every proof — every
 * number, every endurance clause — traces to the manifest's soak result. With
 * the shipped EMPTY manifest the world may state ONLY that its proving is
 * scheduled: no numbers, no proof vocabulary.
 */
import { describe, expect, it } from 'vitest';
import { buildWorldCertification } from '../../src/domain/certification/certificationRead.js';
import {
  CERTIFICATION_REQUIRED_PROPERTY_KEYS,
  soakPropertyLabel,
} from '../../src/domain/certification/certificationSchema.js';
import { WORLD_CERTIFICATION_MANIFEST } from '../../src/domain/certification/certificationManifest.js';

/** Collect every string in a view (headline/detail/lines). */
function stringsOf(view) {
  return [view.headline, view.detail, ...view.lines].filter((s) => typeof s === 'string');
}

const PROOF_VOCAB = /\b(certified|proven|proof|guaranteed|soaked|byte-for-byte|endur\w*)\b/i;

describe('V-10 claims-parity — the shipped (empty) manifest claims NOTHING', () => {
  const view = buildWorldCertification({ manifest: WORLD_CERTIFICATION_MANIFEST, presetId: 'realistic_regional' });

  it('reads PENDING with no proof lines', () => {
    expect(view.status).toBe('pending');
    expect(view.lines).toEqual([]);
    expect(view.soak).toBeNull();
  });

  it('states no number and no proof vocabulary (only that the proving is scheduled)', () => {
    for (const s of stringsOf(view)) {
      expect(/\d/.test(s), `pending copy states a number: "${s}"`).toBe(false);
      expect(PROOF_VOCAB.test(s), `pending copy uses proof vocabulary: "${s}"`).toBe(false);
    }
  });

  it('is pending for ANY preset while the manifest is empty', () => {
    for (const preset of ['realistic_regional', 'full_simulation', null, 'whatever']) {
      expect(buildWorldCertification({ manifest: WORLD_CERTIFICATION_MANIFEST, presetId: preset }).status).toBe('pending');
    }
  });
});

describe('V-10 claims-parity — a certified view claims ONLY what the soak recorded', () => {
  const soak = {
    years: 100,
    seedsTested: 8,
    ticksAdvanced: 4800,
    properties: [...CERTIFICATION_REQUIRED_PROPERTY_KEYS],
    runAt: '2026-07-20T00:00:00.000Z',
    behavioralContractVersion: 1,
    evidenceDigest: 'a'.repeat(64),
    humanChronicleReviewDigest: 'b'.repeat(64),
  };
  const manifest = {
    manifestVersion: 1,
    generatedAt: '2026-07-20T00:00:00.000Z',
    bands: [{ bandId: 'sig_x', presetId: 'full_simulation', status: 'certified', soak }],
  };
  const view = buildWorldCertification({ manifest, presetId: 'full_simulation' });

  it('surfaces exactly one proof line per proven property (plus the span lead)', () => {
    expect(view.status).toBe('certified');
    // lead line + one per property
    expect(view.lines.length).toBe(1 + soak.properties.length);
    for (const key of soak.properties) {
      const label = soakPropertyLabel(key);
      expect(view.lines.some((l) => l.includes(label)), `missing proof line for ${key}`).toBe(true);
    }
  });

  it('EVERY number in the view is a value the soak recorded', () => {
    const allowed = new Set([String(soak.years), String(soak.seedsTested), String(soak.ticksAdvanced)]);
    for (const s of stringsOf(view)) {
      const nums = s.match(/\d+/g) || [];
      for (const n of nums) {
        expect(allowed.has(n), `view states number ${n} not present in the soak result: "${s}"`).toBe(true);
      }
    }
  });

  it('does not render unknown evidence outside the closed property vocabulary', () => {
    for (const line of view.lines.slice(1)) {
      expect(CERTIFICATION_REQUIRED_PROPERTY_KEYS.some((key) =>
        line.includes(soakPropertyLabel(key)))).toBe(true);
    }
  });
});

describe('V-10 claims-parity — measured evidence remains visibly partial', () => {
  const soak = {
    years: 30,
    seedsTested: 2,
    ticksAdvanced: 3120,
    properties: ['no_crash', 'rerun_identical'],
    runAt: '2026-07-20T00:00:00.000Z',
  };
  const manifest = {
    manifestVersion: 1,
    generatedAt: soak.runAt,
    bands: [{ bandId: 'sig_measure', presetId: 'full_simulation', status: 'measured', soak }],
  };

  it('shows only receipt-backed checks and explicitly withholds certification', () => {
    const view = buildWorldCertification({ manifest, presetId: 'full_simulation' });
    expect(view.status).toBe('measured');
    expect(view.detail).toMatch(/not full certification/i);
    expect(view.lines).toHaveLength(1 + soak.properties.length);
    expect(view.lines.join(' ')).not.toContain(soakPropertyLabel('no_stasis'));
  });
});
