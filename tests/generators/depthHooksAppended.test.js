/**
 * depthHooksAppended.test.js — THE PERSON HOOKS OF BOTH TRANCHES ARE APPENDED, TAGGED AND DRAWN. The first
 * tranche, 60 hooks, on the chair's word of 2026-11-20 14:50 UTC (the lines of
 * docs/chair/2026-11-20/content/depth/lines/HOOKS-1.md and HOOKS-2.md); the second, 36 hooks, on the chair's
 * words of 2026-11-20 16:22 and 16:35 UTC (the 25 approved lines of HOOKS-3.md and the 11 of HOOKS-3B.md).
 *
 * Four pools of `src/data/npcData.js :: NPC_FACTION_LOYALTY` grew by APPENDING only: `other` 30 + 30,
 * `government` 8, `economy` 14 + 6, `criminal` 8. An append keeps every stored index and every saved town's
 * hook where it was; an insert or an edit would not. So the claims are:
 *   (a) each pool is longer than its base by exactly its count;
 *   (b) THE APPENDED RULE: the base rows are the first n rows (none of the tail's rows sits among them),
 *       and every tail row carries a theme (`src/domain/hookThemes.js`), never `untyped`;
 *   (c) THE DRAW TAKES THEM: the city births `hxd-city-0` .. `hxd-city-4` (the measure's own birth,
 *       docs/chair/2026-11-20/content/depth/measure/born.mjs) print at least one tail row on a card.
 *
 * Every hook sentence here is COMPUTED from the pools (tests/helpers/drawnProse.js states the law): the
 * test quotes none, so a reworded line moves nothing but the line.
 */
import { beforeAll, describe, expect, it } from 'vitest';

import { NPC_FACTION_LOYALTY } from '../../src/data/npcData.js';
import { UNTYPED, isHookTheme, themeOfText } from '../../src/domain/hookThemes.js';
import { lineText } from '../../src/domain/facts/drawDeclared.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** Each pool's length before the first tranche (read at the line), and the rows both tranches appended to it. */
const BASE = Object.freeze({ other: 40, government: 24, economy: 24, criminal: 18 });
const ADDED = Object.freeze({ other: 60, government: 8, economy: 20, criminal: 8 });

/** @param {string} pool */
const textsOf = (pool) => (NPC_FACTION_LOYALTY[pool] || []).map(lineText);
/** @param {string} pool */
const tailOf = (pool) => textsOf(pool).slice(BASE[pool]);

describe('the person hooks of both tranches are appended to their pools', () => {
  it('(a) each pool is longer than its base by exactly its count', () => {
    for (const pool of Object.keys(BASE)) {
      expect(textsOf(pool).length, pool).toBe(BASE[pool] + ADDED[pool]);
    }
  });

  it('(b) the base rows keep their indices: no tail row sits among them, and every tail row is themed', () => {
    for (const pool of Object.keys(BASE)) {
      const head = new Set(textsOf(pool).slice(0, BASE[pool]));
      const tail = tailOf(pool);
      // anchored: the tail is the appended block, so the checks below are not read over nothing
      expect(tail.length, `${pool} tail`).toBe(ADDED[pool]);
      expect(tail.filter((t) => head.has(t)), `${pool}: a tail row repeats a base row`).toEqual([]);
      expect(new Set(tail).size, `${pool}: a tail row is appended twice`).toBe(tail.length);
      const untyped = tail.filter((t) => themeOfText(t) === UNTYPED || !isHookTheme(themeOfText(t)));
      expect(untyped, `${pool}: tail row(s) without a theme`).toEqual([]);
    }
  });

  describe('(c) the draw takes them', () => {
    beforeAll(async () => { await loadGenerationLawPayloads(); });

    it('the city births hxd-city-0 .. hxd-city-4 print at least one appended row on a card', () => {
      const tails = new Set(Object.keys(BASE).flatMap(tailOf));
      expect(tails.size).toBe(96);
      let cards = 0;
      let hooks = 0;
      let drawn = 0;
      for (let i = 0; i < 5; i += 1) {
        const town = generateSettlementPipeline(
          birthConfig({ ...DEFAULT_CONFIG, settType: 'city' }), null, { seed: `hxd-city-${i}`, customContent: {} },
        );
        for (const npc of town.npcs || []) {
          cards += 1;
          for (const hook of npc.plotHooks || []) {
            hooks += 1;
            if (tails.has(String(hook))) drawn += 1;
          }
        }
      }
      // anchored: five towns of cards holding hooks, so "drawn" is not counted over nothing
      expect(cards).toBeGreaterThan(0);
      expect(hooks).toBeGreaterThan(0);
      expect(drawn).toBeGreaterThanOrEqual(1);
    }, 240_000);
  });
});
