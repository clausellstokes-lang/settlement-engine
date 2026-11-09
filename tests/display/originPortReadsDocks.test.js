/**
 * SW-B1 CONTRADICTIONS (STYLE-RULINGS-2 B1(b); DS-GEN-6's `originRoutePoolKey`, SW-B2's leftover by the
 * chair's ruling of 02:5x): the Settlement-origin route pool folded on the trade route alone (`originRoutePoolKey`), so a port
 * route with no docks drew the port pool ("…'s living comes off the quay"), the same unread docks fact
 * #10's gate was cured of at a second writer. The cure: the port line reads the record's docks flag at its one call site (`portLineStruck`).
 */
import { describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { generalStateProse, portLineStruck } from '../../src/domain/display/stateProse/generalStateProse.js';

describe('SW-B1 · DS-GEN-6: the port origin pool is drawn only over real docks', () => {
  it('a port route with no docks draws no route pool; with docks, or unasked, the port pool', () => {
    expect(portLineStruck('port', { hasPort: false })).toBeNull();
    expect(portLineStruck('port', { hasPort: true })).toBe('port');
    expect(portLineStruck('port', undefined)).toBe('port');
    expect(portLineStruck('road', { hasPort: false })).toBe('road');
  });

  it('soak1k-0 (Albamunicipium, a mountain thorp on a port route, no docks): no origin line from the port pool', async () => {
    await ensureLaws();
    const s = birth(0).settlement;
    expect(s.config.tradeRouteAccess).toBe('port');
    expect(s.economicState.compound.inst.hasPort).toBe(false);
    const read = (/** @type {boolean|undefined} */ hasDocks) => generalStateProse(s, {
      tier: s.tier, tradeRouteAccess: 'port', inst: { ...s.economicState.compound.inst, hasPort: hasDocks }, foodBalance: s.economicViability?.metrics?.foodBalance,
    }).overview.origin.map((/** @type {any} */ l) => l?.provenance?.poolKey);
    expect(read(true), 'the positive control: over docks the port pool is drawn').toContain('port');
    expect(read(false)).not.toContain('port');
    expect(read(false).length, 'the tier line still stands').toBeGreaterThan(0);
  }, 60_000);
});
