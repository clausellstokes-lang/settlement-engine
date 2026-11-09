/**
 * SW-B1 CONTRADICTIONS (STYLE-RULINGS-2 B1(b); the SURFACES audit's P71 and §2·D contradiction #2):
 * Albamunicipium (soak1k-0) is a mountain thorp on a port route with no docks, and its Viability verdict
 * read "Much of what Albamunicipium eats is brought in by sea" and its PDF lead "comes in by port trade"
 * — beside "controls mountain passes". The food balance named the import channel from the route alone.
 * The cure: the channel is "port trade" only over docks; with none it is plain "trade", and the
 * verdict's one route phrase reads "from outside".
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { deriveViability } from '../../src/domain/display/dossierViewModel.js';

describe('SW-B1 · P71: the food import channel says "by sea" only over docks', () => {
  /** @type {any} */ let s;
  beforeAll(async () => { await ensureLaws(); s = birth(0).settlement; }, 60_000);

  it('soak1k-0: a port route, no docks, a food deficit covered by imports', () => {
    expect(s.config.tradeRouteAccess).toBe('port');
    expect(s.economicState.compound.inst.hasPort).toBe(false);
    expect(s.economicViability.metrics.foodBalance.importCoverage).toBeGreaterThan(0);
  });

  it('its import channel is not "port trade", and its verdict names no sea', () => {
    expect(s.economicViability.metrics.foodBalance.importChannel).not.toBe('port trade');
    const v = deriveViability(s);
    expect(JSON.stringify(v).length, 'the verdict is derived, not empty').toBeGreaterThan(2);
    // anchored: the derived verdict is asserted non-empty on the line above
    expect(JSON.stringify(v)).not.toMatch(/by sea|port trade/);
  });
});
