/**
 * tests/generators/politicalFlavorSacredHouse.test.js — CENSUS-2f unit 5: POLITICAL_FLAVOR
 * religious_heavy [0] ("…the institution persisted; the unity didn't") and [2] ("…the local
 * clergy and the civic authority…") presume a house of worship of any kind: they declare the
 * `sacredHouse` composite (R-AE, CENSUS-1f `fc45cc1`), which CENSUS-1f's cascade wiring
 * (`historyCoherence.js :: flavorOf`, `b26ed12`) enforces. Measured settled at the draw (R-V,
 * R-AN): the draw-time value equals the final record's on all 1,000 soak births. A refused row
 * moves to the hash argmax over the admitted rows (no roll).
 *
 * @enforced-by npx vitest run tests/generators/politicalFlavorSacredHouse.test.js
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { factsOf } from '../../src/domain/facts/factsOf.js';

// Re-keyed at W5 HIS's style pass (2026-11-07): the row still presumes the house of worship; its words are plain now.
const INSTITUTION_PERSISTED = /its house of worship survived, but the congregation never came back together/;
const LOCAL_CLERGY = /local clergy and the civic authority/;

describe('POLITICAL_FLAVOR religious_heavy declares sacredHouse (CENSUS-2f unit 5)', () => {
  beforeAll(async () => { await ensureLaws(); });

  it('a place with no sacred house prints neither row (soak1k-313, -331, -378, -642; -73, -517)', () => {
    for (const i of [313, 331, 378, 642, 73, 517]) {
      const s = birth(i).settlement;
      expect(factsOf(s).sacredHouse, `soak1k-${i}`).toBe(false);
      const hc = String(s.history?.historicalCharacter || '');
      expect(INSTITUTION_PERSISTED.test(hc) || LOCAL_CLERGY.test(hc), `soak1k-${i}: ${hc}`).toBe(false);
    }
  }, 60_000);

  it('a place with a sacred house keeps its row (soak1k-784, -866)', () => {
    expect(INSTITUTION_PERSISTED.test(String(birth(784).settlement.history?.historicalCharacter || ''))).toBe(true);
    expect(LOCAL_CLERGY.test(String(birth(866).settlement.history?.historicalCharacter || ''))).toBe(true);
  }, 30_000);
});
