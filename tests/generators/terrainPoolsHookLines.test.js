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
import { NPC_FACTION_GOALS, NPC_FACTION_LOYALTY, NPC_SECRETS, NPC_CRIMINAL_SECRETS, NPC_WANTS, NPC_HOOK_SIBLINGS } from '../../src/data/npcData.js';
import { resolveSibling } from '../../src/domain/facts/drawDeclared.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';

// CENSUS-1c unit 1: the text-keyed table `data/inlandHookLines.js` dissolved into the declared
// sibling sets beside the originals (`npcData.js :: NPC_HOOK_SIBLINGS`); re-keyed by that cause.
/** A pool line's water words (the A-11 vocabulary plus the sea and the tide), moved here from the retired table. */
const WET_HOOK_WORD = /\b(?:sea|seas|dock-side|dockside|docks?|harbou?rs?|ships?|shipping|shipwrights?|tides?|tidal|wharf|wharves|quays?|sailors?|fleet|boats?|fishermen|fishing)\b/i;
const twinOf = (/** @type {string} */ line) => NPC_HOOK_SIBLINGS[line]?.find((l) => l.twinOf === line)?.text;
const inlandHookLine = (/** @type {any} */ line, /** @type {'maritime'|'river'|'none'} */ kind) => resolveSibling(line, NPC_HOOK_SIBLINGS, { facts: factsOf({}, { waterKind: kind }), poolId: 'test', drawKind: 'T' });
import { waterAccessKind } from '../../src/domain/tradeRouteSemantics.js';

/** Every string a hook pool holds, however nested. @param {unknown} v @returns {string[]} */
// CENSUS-4f: a declared row's column (`needs`, `excludes`, `crisis`, `twinOf`, `tags`) is a declaration, not prose — `needs: ['docks']` is no wet line.
const DECLARATION_KEYS = new Set(['needs', 'excludes', 'crisis', 'twinOf', 'tags']);
const stringsOf = (v) => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(stringsOf) : v && typeof v === 'object' ? Object.entries(v).filter(([k]) => !DECLARATION_KEYS.has(k)).flatMap(([, x]) => stringsOf(x)) : []);
const POOLS = { NPC_FACTION_GOALS, NPC_FACTION_LOYALTY, NPC_SECRETS, NPC_CRIMINAL_SECRETS, NPC_WANTS };

describe('the hook pools\' wet lines', () => {
  it('every pool line with a sea, dock, harbour, ship or tide word has a dry inland twin', () => {
    const wet = Object.values(POOLS).flatMap(stringsOf).filter((x) => WET_HOOK_WORD.test(x));
    expect(wet.length).toBeGreaterThan(0);
    for (const line of wet) {
      expect(twinOf(line), line).toBeTypeOf('string');
      expect(WET_HOOK_WORD.test(twinOf(line)), twinOf(line)).toBe(false);
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
