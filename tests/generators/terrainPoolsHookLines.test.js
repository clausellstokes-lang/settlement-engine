/**
 * F5 unit 4 (2026-11-04): THE HOOK POOL'S SEA AND DOCK LINES ARE LICENSED ON `waterAccessKind`.
 * TERRAIN-POOLS' rule for institution descriptions (`steps/assembleInstitutions.js ::
 * shipFreeDesc`, `data/inlandDescriptions.js`), applied to the NPC hook pools: where the record's
 * water fact is 'none', a pool line that speaks of the sea, the docks, a harbour, ships or the
 * tide gives its inland twin (`data/inlandHookLines.js`), draw-free, so the stream is unmoved.
 * Red-first on soak1k-105: "Wants to find the person responsible for three unsolved dock-side
 * killings." in a town in the hills on a road.
 */
import { describe, expect, it } from 'vitest';
import { NPC_FACTION_GOALS, NPC_FACTION_LOYALTY, NPC_SECRETS, NPC_CRIMINAL_SECRETS, NPC_WANTS } from '../../src/data/npcData.js';
import { INLAND_HOOK_LINES, WET_HOOK_WORD, inlandHookLine } from '../../src/data/inlandHookLines.js';
import { waterAccessKind } from '../../src/domain/tradeRouteSemantics.js';

/** Every string a hook pool holds, however nested. @param {unknown} v @returns {string[]} */
const stringsOf = (v) => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(stringsOf) : v && typeof v === 'object' ? Object.values(v).flatMap(stringsOf) : []);
const POOLS = { NPC_FACTION_GOALS, NPC_FACTION_LOYALTY, NPC_SECRETS, NPC_CRIMINAL_SECRETS, NPC_WANTS };

describe('the hook pools\' wet lines', () => {
  it('every pool line with a sea, dock, harbour, ship or tide word has a dry inland twin', () => {
    const wet = Object.values(POOLS).flatMap(stringsOf).filter((x) => WET_HOOK_WORD.test(x));
    expect(wet.length).toBeGreaterThan(0);
    for (const line of wet) {
      expect(INLAND_HOOK_LINES[line], line).toBeTypeOf('string');
      expect(WET_HOOK_WORD.test(INLAND_HOOK_LINES[line]), INLAND_HOOK_LINES[line]).toBe(false);
    }
  });
  it('the twin is taken only where there is no water', () => {
    const line = 'Find the person responsible for three unsolved dock-side killings';
    expect(inlandHookLine(line, 'none')).not.toMatch(WET_HOOK_WORD); // anchored: two lines down the same function returns a live dry line unchanged for 'none'
    expect(inlandHookLine(line, 'maritime')).toBe(line);
    expect(inlandHookLine(line, 'river')).toBe(line);
    expect(inlandHookLine('Close a murder case that has made the merchants nervous', 'none')).toBe('Close a murder case that has made the merchants nervous');
  });
});

// 2026-11-07 PEOPLE-1 CAST: re-keyed by identity soak1k-105 -> soak1k-441 (a town in the hills on a road whose cast
// draws the three-killings goal), found by a probe over the 1,000 at the lane's tip; the claim is unchanged.
// 2026-11-07 PEOPLE-2 CAST-DERIVED (3aa160a70): re-keyed soak1k-441 -> soak1k-921 (441's cast no longer draws the goal;
// 921 is a town in the hills on a road whose watch captain does), found by a probe over the 1,000 at the car's tip.
describe('soak1k-921, a town in the hills on a road', () => {
  it('no NPC goal or hook of a landlocked record speaks of the docks or the sea', async () => {
    const { birth, ensureLaws } = await import('../../scripts/audit/soak-review/corpus.mjs');
    await ensureLaws();
    const s = birth(921).settlement;
    expect(waterAccessKind(s.config?.terrainType, s.config?.tradeRouteAccess)).toBe('none');
    const lines = (s.npcs || []).flatMap((n) => [n?.goal?.short, n?.goal?.long, ...(n?.plotHooks || [])]).filter((x) => typeof x === 'string');
    expect(lines.filter((x) => WET_HOOK_WORD.test(x))).toEqual([]);
    const captain = (s.npcs || []).find((n) => /three unsolved/.test(String(n?.goal?.short)));
    expect(captain, 'the Guard Captain keeps the goal\'s beat, three killings').toBeTruthy();
  });
});
