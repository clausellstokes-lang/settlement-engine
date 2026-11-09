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

import { NPC_FACTION_LOYALTY } from '../../../src/data/npcData.js';

/** The pool floors the measure sized (the magic pool is walked by a magic face alone and is not grown). */
const POOL_FLOOR = Object.freeze({ other: 40, government: 24, economy: 24, military: 24, religious: 18, criminal: 18, small_settlement: 18 });

describe('the person hooks wear across towns', () => {
  it('every category pool grown so far holds at least its measured floor (the title pools and the spread land with the last pool)', () => {
    for (const [pool, floor] of Object.entries(POOL_FLOOR)) expect(NPC_FACTION_LOYALTY[pool]?.length ?? 0, pool).toBeGreaterThanOrEqual(floor);
  });
});
