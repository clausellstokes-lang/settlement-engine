/**
 * tests/domain/facts/noteDeclared.test.js — CENSUS-1f unit 3: a declared line a site keeps as
 * drawn (no twin, never pre-filtered: the faction names of `FACTION_NAME_SIBLINGS`) is NOTED with
 * its atoms so the birth self-check judges it; nothing is changed, a non-key is not noted, and a
 * whole birth that prints such a name carries it in its ledger.
 *
 * @enforced-by npx vitest run tests/domain/facts/noteDeclared.test.js
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { noteDeclared } from '../../../src/domain/facts/drawDeclared.js';
import { withPresumptionLedger } from '../../../src/domain/facts/presumptionLedger.js';
import { FACTION_NAME_SIBLINGS } from '../../../src/data/powerData.js';
import { birth, ensureLaws } from '../../../scripts/audit/soak-review/corpus.mjs';

describe('noteDeclared (CENSUS-1f unit 3)', () => {
  beforeAll(async () => { await ensureLaws(); });

  it('notes a declared key with its atoms, and nothing else', () => {
    const { ledger } = withPresumptionLedger(() => {
      noteDeclared('The Garrison Bloc', FACTION_NAME_SIBLINGS, { poolId: 'p', surface: 'power' });
      noteDeclared('The Merchant Bloc', FACTION_NAME_SIBLINGS, { poolId: 'p', surface: 'power' });
      noteDeclared(null, FACTION_NAME_SIBLINGS, { poolId: 'p', surface: 'power' });
    });
    expect(ledger).toHaveLength(1);
    expect(ledger[0]).toMatchObject({ pool: 'p', atoms: ['garrison'], surface: 'power', resolvedBy: 'drawn' });
  });

  it('a birth whose roster carries a declared pool name notes it', () => {
    let found = 0;
    for (let i = 0; i < 120 && !found; i++) {
      const { result, ledger } = withPresumptionLedger(() => birth(i));
      const names = (result.settlement.powerStructure?.factions || []).map((f) => f.faction);
      if (!names.some((n) => Object.prototype.hasOwnProperty.call(FACTION_NAME_SIBLINGS, n))) continue;
      if (ledger.some((e) => String(e.pool).startsWith('powerData:FACTION_DESCRIPTORS'))) found += 1;
    }
    expect(found).toBe(1);
  }, 120_000);
});
