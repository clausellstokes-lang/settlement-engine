/**
 * stressorEchoFootprint.test.js — a resolved crisis's echo collapses to its ORIGIN.
 *
 * Regression pin for the medium-severity finding: echoOf spread `...resolvedStressor`,
 * carrying affectedSettlementIds and severityBySettlement verbatim. A crisis that
 * spread A→B→C then resolved left an echo still listing A,B,C, so it kept participating
 * as a synergy companion at spread targets where the crisis was never at origin
 * strength (a resolved famine amplifying a later disease_outbreak at a distant C). The
 * fix collapses the echo footprint to the origin and clears severityBySettlement, so the
 * memory only influences synergy where the crisis was born; memoryStrength governs it.
 */
import { describe, expect, test } from 'vitest';

import { echoOf, normalizeStressor } from '../../src/domain/worldPulse/stressors.js';

const NOW = '2026-01-01T00:00:00.000Z';

describe('echoOf — footprint collapses to origin', () => {
  test('a spread crisis echoes only at its origin, with no per-settlement severity map', () => {
    const resolved = normalizeStressor({
      type: 'famine',
      originSettlementId: 'origin',
      affectedSettlementIds: ['origin', 'spread1', 'spread2'],
      severityBySettlement: { origin: 0.08, spread1: 0.06, spread2: 0.05 },
      severity: 0.08,
      peakSeverity: 0.9,
      status: 'resolved',
      lifecycleStage: 'resolved',
    });

    const echo = echoOf(resolved, NOW);

    expect(echo.affectedSettlementIds).toEqual(['origin']);
    // severityBySettlement is cleared (null or empty) so no attenuated spread value
    // lingers as a synergy companion.
    expect(echo.severityBySettlement == null || Object.keys(echo.severityBySettlement).length === 0).toBe(true);
    expect(echo.status).toBe('residual');
    // The memory strength is preserved from the crisis peak (¬forgotten).
    expect(echo.memoryStrength).toBeGreaterThan(0);
  });

  test('falls back to the first affected id when originSettlementId is absent', () => {
    const resolved = normalizeStressor({
      type: 'plague',
      affectedSettlementIds: ['first', 'second'],
      severity: 0.05,
      peakSeverity: 0.7,
      status: 'resolved',
    });
    const echo = echoOf(resolved, NOW);
    expect(echo.affectedSettlementIds).toEqual(['first']);
  });
});
