/**
 * tests/domain/traditionDescriptionIds.test.js — THE TRADITION TABLE'S LINE IDS (point 121, TAIL-PICKS; the chair's
 * ruling 121-1, U2). Every line of every pool of `data/traditionDescriptionTable.js` (twins too) carries an `id` of the
 * form `<TABLE>.<pool>.<n>`, written once in source order and unique across the file; the description's draw is the
 * door's ranked mode on it, so a later edit to a pool moves only the places that printed, or now out-rank to, that line.
 *
 * @enforced-by npx vitest run tests/domain/traditionDescriptionIds.test.js
 */
import { describe, expect, it } from 'vitest';
import * as TABLE from '../../src/data/traditionDescriptionTable.js';

const TAGS = { ACT_LEADS: 'LEAD', ELEMENT_GLOSS: 'GLOSS', HOUSE_FRAMES: 'HOUSE', POWER_FRAMES: 'POWER', OWNER_FRAMES: 'OWNER', KEEPER_FRAMES_TOO: 'TOO', CAUSE_FRAMES: 'CAUSE', ECONOMY_FRAMES: 'ECON' };

describe('the tradition table: every line an id, in source order, unique across the file', () => {
  it('each pool\'s lines are <TABLE>.<pool>.1 … n in order; 143 ids, none repeated', () => {
    /** @type {string[]} */ const all = [];
    for (const [name, tag] of Object.entries(TAGS)) {
      const table = /** @type {Record<string, unknown>} */ (TABLE)[name];
      const pools = Array.isArray(table) ? { owner: table } : /** @type {Record<string, ReadonlyArray<{ id?: string }>>} */ (table);
      for (const [pool, lines] of Object.entries(pools)) {
        expect(lines.map((l) => l.id), `${name}.${pool}`).toEqual(lines.map((_, i) => `${tag}.${pool}.${i + 1}`));
        all.push(...lines.map((l) => String(l.id)));
      }
    }
    expect(all).toHaveLength(143);
    expect(new Set(all).size).toBe(all.length);
  });
});
