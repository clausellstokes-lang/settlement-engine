/**
 * tests/domain/traditionDescriptionIds.test.js — THE TRADITION TABLE'S LINE IDS (point 121, TAIL-PICKS; the chair's
 * ruling 121-1, U2; made append-only by ruling 121-4, F2). Every line of every pool of `data/traditionDescriptionTable.js`
 * (twins too) carries an `id` of the form `<TAG>.<pool>.<n>`, its tag and pool its own table's and pool's, `<n>` a
 * positive whole number; unique across the file; every pool holds a line. No density, no order and no total are pinned:
 * a retired id leaves a gap, and that is right. Renumbering, reuse and a move of an id between lines are held by the id
 * guard (tests/lint/stablePickIds.walker.test.js, the scopes `traditionDescription.<TABLE>`), not here.
 *
 * THE ROTATION'S PIN (ruling 121-4, F1, held by name): every pool traditionDescription.js :: drawTurn is handed holds
 * colour lines only and no twin, since a declared line there switches the rotation off for its whole pool.
 *
 * @enforced-by npx vitest run tests/domain/traditionDescriptionIds.test.js
 */
import { describe, expect, it } from 'vitest';
import * as TABLE from '../../src/data/traditionDescriptionTable.js';
import { isColourLine } from '../../src/domain/facts/factVocabulary.js';

const TAGS = { ACT_LEADS: 'LEAD', ELEMENT_GLOSS: 'GLOSS', HOUSE_FRAMES: 'HOUSE', POWER_FRAMES: 'POWER', OWNER_FRAMES: 'OWNER', KEEPER_FRAMES_TOO: 'TOO', CAUSE_FRAMES: 'CAUSE', ECONOMY_FRAMES: 'ECON' };
/** The tables whose pools traditionDescription.js hands drawTurn: the owner, house, power, cause (and the dead) and
 *  economy frames, and the keeper's `again` lines. */
const ROTATED = ['OWNER_FRAMES', 'HOUSE_FRAMES', 'POWER_FRAMES', 'CAUSE_FRAMES', 'ECONOMY_FRAMES', 'KEEPER_FRAMES_TOO'];

/** @param {string} name @returns {Record<string, ReadonlyArray<Record<string, unknown>>>} */
const poolsOf = (name) => {
  const table = /** @type {Record<string, unknown>} */ (TABLE)[name];
  return Array.isArray(table) ? { owner: table } : /** @type {Record<string, ReadonlyArray<Record<string, unknown>>>} */ (table);
};

describe('the tradition table: every line an id of its own table and pool, unique across the file (append-only)', () => {
  it('each id is <TAG>.<pool>.<n> with n a positive whole number; every pool holds a line; no id repeated', () => {
    /** @type {string[]} */ const all = [];
    for (const [name, tag] of Object.entries(TAGS)) {
      for (const [pool, lines] of Object.entries(poolsOf(name))) {
        expect(lines.length, `${name}.${pool}: a pool with no line`).toBeGreaterThan(0);
        const prefix = `${tag}.${pool}.`;
        for (const l of lines) {
          const id = String(l.id);
          expect(id.startsWith(prefix) && /^[1-9]\d*$/.test(id.slice(prefix.length)),
            `${name}.${pool}: the id '${id}' is not ${prefix}<n> (its own table's tag and pool, n a whole number from 1, no leading zero)`).toBe(true);
          all.push(id);
        }
      }
    }
    expect(all.filter((id, i) => all.indexOf(id) !== i), 'an id written on more than one line').toEqual([]);
  });
});

describe('the rotation\'s pin: every pool drawTurn is handed holds colour lines only, and no twin (ruling 121-4, F1)', () => {
  it('no declared line and no twin in a rotated pool', () => {
    /** @type {string[]} */ const bad = [];
    for (const name of ROTATED) {
      for (const [pool, lines] of Object.entries(poolsOf(name))) {
        for (const l of lines) {
          /** @type {boolean} */ let colour;
          try { colour = isColourLine(l); } catch { colour = false; }
          if (!colour || typeof l.twinOf === 'string') bad.push(`${name}.${pool} '${String(l.id)}'`);
        }
      }
    }
    expect(bad, 'a declared line or a twin in a pool the rotation walks (traditionDescription.js :: drawTurn) switches the '
      + 'rotation off for that WHOLE pool (`all.every(isColourLine)`), so towns that never print the new line move (the '
      + 'reader measured 30 | 15 of 900 on HOUSE_FRAMES.placePower, 4 | 1 on CAUSE_FRAMES.dead). Read drawTurn\'s doc '
      + 'comment and the chair\'s ruling 121-4, F1: a rotation over admitted lines is a new design, not this edit').toEqual([]);
  });
});
