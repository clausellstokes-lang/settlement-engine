/**
 * THE UNSEATED ECCLESIASTICAL COUNCIL (soak 1000 row 20, battery check 'seat unfilled',
 * soak1k-694). The city's mandated head (npcGenerator.js :: TIER_MANDATORY_ROLES, first
 * role; mirrored by seatHolder.js :: TIER_HEAD) was minted only from the candidate pool,
 * which offers a 'government' role only where a government-shelf institution stands. This
 * city's City hall is filed on infrastructure and no government row stood, so no Mayor was
 * made and nobody held the council's seat. The tier's head is now minted from its own row.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { getUpgradeOpportunities } from '../../src/generators/economy/upgradeOpportunities.js';
import { seatHolderFindings } from '../../src/domain/coherence/seatHolderFindings.js';
import { rulingChainOf } from '../../src/domain/dossier/powerStrata.js';
import { governingFactionOf } from '../../src/domain/rulingPower.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

describe('the council case from the seed (soak1k-694)', () => {
  /** @type {any} */ let s;
  beforeAll(async () => { await ensureLaws(); s = birth(694).settlement; });

  it('is the case: an Ecclesiastical Council city whose pool offers no Mayor', () => {
    expect(s.tier).toBe('city');
    expect(governingFactionOf(s)?.faction).toBe('Ecclesiastical Council');
    const pool = getUpgradeOpportunities(s.institutions, s.tier, {}).map((c) => c.role);
    expect(pool).not.toContain('Mayor');
  });

  it('seats a named Mayor in the governing council, and the seat check is clean', () => {
    const chain = rulingChainOf(s);
    expect(chain.npc?.role).toBe('Mayor');
    expect(String(chain.npc?.name || '')).not.toMatch(/^The /);
    expect(seatHolderFindings(s)).toEqual([]);
  });
});
