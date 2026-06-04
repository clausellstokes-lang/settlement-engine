/**
 * tests/domain/provenance.test.js - Tier 5.6 lean tests.
 */

import { describe, it, expect } from 'vitest';
import { deriveProvenanceSummary, provenanceTrustKeys } from '../../src/domain/provenance.js';

describe('deriveProvenanceSummary()', () => {
  it('returns canonical envelope shape', () => {
    const p = deriveProvenanceSummary({
      institutions: [{ name: 'Granary' }],
    });
    expect(p).toHaveProperty('procedurallyGenerated');
    expect(p).toHaveProperty('userAuthored');
    expect(p).toHaveProperty('eventApplied');
    expect(p).toHaveProperty('aiPolished');
    expect(p).toHaveProperty('hasAiPolish');
    expect(p).toHaveProperty('hasUserCanon');
    expect(p).toHaveProperty('hasAppliedEvents');
    expect(Array.isArray(p.summary)).toBe(true);
    expect(Array.isArray(p.trustSignals)).toBe(true);
  });

  it('returns zero counts for nullish settlement', () => {
    const p = deriveProvenanceSummary(null);
    expect(p.procedurallyGenerated).toBe(0);
    expect(p.summary).toEqual([]);
  });

  it('counts user-authored entities', () => {
    const p = deriveProvenanceSummary({
      institutions: [
        { name: 'Granary' },
        { name: 'User Hall', _authored: true },
      ],
    });
    expect(p.userAuthored).toBe(1);
    expect(p.hasUserCanon).toBe(true);
  });

  it('counts event-applied entries', () => {
    const p = deriveProvenanceSummary({
      eventLog: [{ event: { type: 'X' }, appliedAt: '2026-05-19T00:00Z' }],
    });
    expect(p.eventApplied).toBe(1);
    expect(p.hasAppliedEvents).toBe(true);
  });

  it('detects AI overlays', () => {
    const p = deriveProvenanceSummary({
      aiOverlays: [{ kind: 'polish', appliedAt: '2026-05-19' }],
    });
    expect(p.hasAiPolish).toBe(true);
  });

  it('summary opens with the procedural-simulation line', () => {
    const p = deriveProvenanceSummary({ institutions: [{ name: 'X' }] });
    expect(p.summary[0]).toMatch(/procedural simulation/i);
  });

  it('summary calls out "AI not used" when no AI applied', () => {
    const p = deriveProvenanceSummary({ institutions: [{ name: 'X' }] });
    expect(p.summary.some(l => /AI not used/i.test(l))).toBe(true);
  });

  it('summary calls out "facts unchanged" when AI applied', () => {
    const p = deriveProvenanceSummary({ aiOverlays: [{ kind: 'polish' }] });
    expect(p.summary.some(l => /facts unchanged/i.test(l))).toBe(true);
  });

  it('trustSignals always includes procedural', () => {
    const p = deriveProvenanceSummary({ institutions: [{ name: 'X' }] });
    expect(p.trustSignals.some(s => s.key === 'procedural')).toBe(true);
  });

  it('trustSignals toggles ai_off vs ai_polished', () => {
    const without = deriveProvenanceSummary({ institutions: [{ name: 'X' }] });
    const withAi = deriveProvenanceSummary({ aiOverlays: [{ kind: 'polish' }] });
    expect(without.trustSignals.some(s => s.key === 'ai_off')).toBe(true);
    expect(withAi.trustSignals.some(s => s.key === 'ai_polished')).toBe(true);
  });
});

describe('purity', () => {
  it('does not mutate settlement', () => {
    const s = {
      institutions: [{ name: 'X' }],
      aiOverlays: [{ kind: 'polish' }],
    };
    const before = JSON.stringify(s);
    deriveProvenanceSummary(s);
    expect(JSON.stringify(s)).toBe(before);
  });
});

describe('provenanceTrustKeys()', () => {
  it('exposes the trust signal vocabulary', () => {
    expect(provenanceTrustKeys()).toContain('procedural');
    expect(provenanceTrustKeys()).toContain('ai_off');
    expect(provenanceTrustKeys()).toContain('ai_polished');
  });
});
