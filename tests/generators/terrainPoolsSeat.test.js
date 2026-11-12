/**
 * THE UNSEATED ECCLESIASTICAL COUNCIL (soak 1000 row 20, battery check 'seat unfilled',
 * soak1k-694 on the dry run's corpus; hand-built since 2026-11-04, below). The city's mandated
 * head (npcGenerator.js :: TIER_MANDATORY_ROLES, first role; mirrored by seatHolder.js :: TIER_HEAD) was minted only from the candidate pool,
 * which offers a 'government' role only where a government-shelf institution stands. This
 * city's City hall is filed on infrastructure and no government row stood, so no Mayor was
 * made and nobody held the council's seat. The tier's head is now minted from its own row.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { getUpgradeOpportunities } from '../../src/generators/economy/upgradeOpportunities.js';
import { seatHolderFindings } from '../../src/domain/coherence/seatHolderFindings.js';
import { rulingChainOf } from '../../src/domain/dossier/powerStrata.js';
import { governingFactionOf } from '../../src/domain/rulingPower.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { leaderHouseOf, officeLiteralOf } from '../helpers/dualHatOracle.js'; // COHERENCE-POWERS-3 (F9): the expectation's own oracle, literals
import { backingArchetypeOf } from '../../src/domain/dossier/powerSupport.js';
import { nameOf } from '../../src/domain/rulingPower.js';

// HAND-BUILT 2026-11-04 (rung-1 pins, unit 4; the chair's ruling): the seed soak1k-694 carried this
// case on the dry run's corpus, and no seed in soak1k-0..4,999 carries it on the de-aliased corpus
// (about 53 Ecclesiastical Council cities, every one with a Mayor in its pool). The record is now
// BUILT, not found: a religion-led city (priorityReligion 100, the other dials 0) whose DM has
// switched off every city row that offers the government role (the Government shelf, and every
// row whose priorityCategory is 'government' — the pool's two axes, upgradeOpportunities.js ::
// getUpgradeOpportunities). Its pool can then offer no Mayor on ANY seed, so the mandate rule
// (npcGenerator.js :: generateNPCs, mandatedRoleCandidate) is pinned without a seed's luck.
const GOVERNMENT_OFFERING = Object.entries(institutionalCatalog.city)
  .flatMap(([group, rows]) => Object.entries(rows)
    .filter(([, row]) => group === 'Government' || row.priorityCategory === 'government')
    .map(([name]) => `city::${group}::${name}`));
const COUNCIL_CITY = Object.freeze({
  settType: 'city', culture: 'germanic', tradeRouteAccess: 'road',
  priorityReligion: 100, priorityMilitary: 0, priorityEconomy: 0,
  _institutionToggles: Object.fromEntries(GOVERNMENT_OFFERING.map((key) => [key, { allow: false }])),
});
const SEEDS = ['terrain-pools-seat-0', 'terrain-pools-seat-1', 'terrain-pools-seat-2', 'terrain-pools-seat-3', 'terrain-pools-seat-4'];

describe('the council case, hand-built (was soak1k-694)', () => {
  /** @type {any[]} */ let cities = [];
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    cities = SEEDS.map((seed) => generateSettlementPipeline(COUNCIL_CITY, null, { seed, customContent: {} }));
  }, 120_000);

  it('is the case: an Ecclesiastical Council city whose pool offers no Mayor, on every seed', () => {
    expect(GOVERNMENT_OFFERING.length).toBeGreaterThanOrEqual(9); // the Government shelf at least
    for (const s of cities) {
      expect(s.tier).toBe('city');
      expect(governingFactionOf(s)?.faction).toBe('Ecclesiastical Council');
      const pool = getUpgradeOpportunities(s.institutions, s.tier, {}).map((c) => c.role);
      expect(pool.length).toBeGreaterThan(0);
      expect(pool).not.toContain('Mayor'); // anchored: the line above proves the upgrade pool is live
    }
  });

  it('seats a named Mayor in the governing council, and the seat check is clean', () => {
    for (const s of cities) {
      const chain = rulingChainOf(s);
      // 2026-11-07 PEOPLE-1 CAST (M-1b): the seat is the card ranked FIRST in the governing council; its role is its title
      const seated = (s.npcs || []).find((n) => n.name === chain.npc?.name);
      // RE-KEYED BY IDENTITY 2026-11-12, COHERENCE-POWERS (the owner's dual-hat law, 2026-11-11): where a house of the town
      // leads (representatives.js :: dualHatHouseOf), its face keeps its title and its role is the office (officeTitleFor:
      // an Ecclesiastical Council city's 'Lord Warden'); where none does, the role is still the title.
      const hat = leaderHouseOf(s.institutions || [], nameOf(governingFactionOf(s)), backingArchetypeOf(governingFactionOf(s)));
      expect(seated?.role).toBe(hat && seated?.institution?.key === hat ? officeLiteralOf(String(governingFactionOf(s)?.faction || ''), s.tier) : seated?.title);
      expect((seated?.memberships || []).some((m) => m.rank === 1 && m.power === String(chain.faction?.faction || chain.faction?.name || ''))).toBe(true);
      expect(String(chain.npc?.name || '')).not.toMatch(/^The /); // anchored: the line above pins the seat's Mayor live
      expect(seatHolderFindings(s)).toEqual([]);
    }
  });
});
