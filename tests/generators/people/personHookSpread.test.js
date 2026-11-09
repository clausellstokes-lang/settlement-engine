/**
 * personHookSpread.test.js — THE PERSON HOOKS WEAR ACROSS TOWNS (SW-10 HOOKS, 2026-11-09; STYLE-2-WAVE's
 * row; WIRING-RULINGS §7, the owner's durability law).
 *
 * The defect, measured on the soak's 1,000 at bd07005b9: the Plot Hooks tab's repetition figure read
 * 0.299 all / 0.355 same-tier (city 0.627, metropolis 0.777) against STYLE-0's 0.157 / 0.213, and
 * 0.274 of it was the person hooks drawn from the seven category pools of
 * `data/npcData.js :: NPC_FACTION_LOYALTY` (11–17 lines each, drawn by every card in every town;
 * the dry walk falls to `other` first). The cure grew the pools to the measured size (other 40;
 * government, economy, military 24; religious, criminal, the small settlement's 18) and every title
 * pool of `data/personHooksByTitle.js` to the four-vantage floor; the 1,000 then read 0.154 / 0.202.
 *
 * The planted figure: sixteen city and metropolis births of the soak's own corpus, the share of one
 * town's person hooks another town also prints, averaged over ordered pairs — 0.721 before, 0.450 after.
 */
import { describe, expect, it } from 'vitest';

import { birth, ensureLaws, tierFor } from '../../../scripts/audit/soak-review/corpus.mjs';
import { NPC_FACTION_LOYALTY } from '../../../src/data/npcData.js';
import { PERSON_HOOKS_BY_TITLE } from '../../../src/data/personHooksByTitle.js';

/** The pool floors the measure sized (the magic pool is walked by a magic face alone and is not grown). */
const POOL_FLOOR = Object.freeze({ other: 40, government: 24, economy: 24, military: 24, religious: 18, criminal: 18, small_settlement: 18 });

describe('the person hooks wear across towns', () => {
  it('every category pool the cards draw holds at least its measured floor, every title pool at least four lines', () => {
    for (const [pool, floor] of Object.entries(POOL_FLOOR)) expect(NPC_FACTION_LOYALTY[pool]?.length ?? 0, pool).toBeGreaterThanOrEqual(floor);
    const titles = Object.entries(PERSON_HOOKS_BY_TITLE);
    expect(titles.length).toBeGreaterThanOrEqual(40);
    for (const [title, lines] of titles) expect(lines.length, title).toBeGreaterThanOrEqual(4);
  });

  it('sixteen cities and metropolises share under 0.55 of their person hooks pairwise (0.721 at bd07005b9)', async () => {
    await ensureLaws();
    /** @type {Set<string>[]} */
    const towns = [];
    for (let i = 0; towns.length < 16; i += 1) {
      if (!['city', 'metropolis'].includes(tierFor(i))) continue;
      const s = birth(i).settlement;
      towns.push(new Set((s.npcs || []).flatMap((n) => n.plotHooks || []).map(String)));
    }
    // anchored: sixteen towns, each holding person hooks, so the figure is not read over nothing
    for (const t of towns) expect(t.size).toBeGreaterThan(5);
    let sum = 0; let pairs = 0;
    for (let a = 0; a < towns.length; a += 1) {
      for (let b = 0; b < towns.length; b += 1) {
        if (a === b) continue;
        const B = [...towns[b]];
        sum += B.filter((x) => towns[a].has(x)).length / B.length;
        pairs += 1;
      }
    }
    expect(sum / pairs).toBeLessThan(0.55);
  }, 240_000);
});
