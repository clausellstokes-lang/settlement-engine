/**
 * CENSUS-1h — THE CHAIR'S R-AT: a resolution's tie-break key carries the settlement's identity.
 * The POLITICAL_FLAVOR cascade (`historyCoherence.js :: flavorOf`) and the loyalty draw's registry
 * resolution (`npcGenerator.js :: drawLoyalty`) key their argmax on the ACTIVE STREAM's own seed
 * (the settlement seed plus the stream's labels, read with no roll), so two settlements whose drawn
 * row is refused do not all resolve to the same admitted row. An unrefused draw never reads the key.
 */
import { describe, expect, it, vi } from 'vitest';

const keys = /** @type {Array<{ pool: string, key: string }>} */ ([]);
vi.mock('../../src/domain/facts/drawDeclared.js', async (importOriginal) => {
  const real = /** @type {any} */ (await importOriginal());
  return {
    ...real,
    drawDeclared: (/** @type {any} */ pool, /** @type {any} */ options) => {
      if (/NPC_FACTION_LOYALTY|^POLITICAL_FLAVOR\./.test(options?.poolId || '')) keys.push({ pool: options.poolId, key: options.key });
      return real.drawDeclared(pool, options);
    },
  };
});

describe('R-AT: the resolution key names the settlement', () => {
  it('both sites key on the settlement seed, on every birth', async () => {
    const corpus = await import('../../scripts/audit/soak-review/corpus.mjs');
    await corpus.ensureLaws();
    for (const i of [1, 2]) {
      keys.length = 0;
      corpus.birth(i);
      const flavour = keys.filter((k) => k.pool.startsWith('POLITICAL_FLAVOR.'));
      const loyalty = keys.filter((k) => k.pool.includes('NPC_FACTION_LOYALTY'));
      expect(flavour.length + loyalty.length).toBeGreaterThan(0);
      for (const k of [...flavour, ...loyalty]) expect(String(k.key)).toMatch(new RegExp(`^soak1k-${i}::`));
    }
  }, 60000);
});
