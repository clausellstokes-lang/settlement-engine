/**
 * tests/domain/facts/census2fColour.test.js — CENSUS-2f, after the chair's messages of 06:59 and 07:25:
 *  (1) R-AP amended — a key guarantees exactly what its picker reads, and a line that presumes more
 *      declares the rest: under the fish key a CATCH declares `fish`, water traffic `navigable`, both
 *      where both (the sense `dominant` pool, picked by the exports' fish trade, re-read the same way);
 *  (2) R-AO — the bare lines this seat READ in its MIXED pools are marked `{ text, colour: true }`
 *      ("read; presumes nothing"): the draw and the ledger read them as silence, so nothing moves.
 *      A calm row of a `{crisis-scoped}` pool is NOT marked: there silence presumes calm.
 *
 * @enforced-by npx vitest run tests/domain/facts/census2fColour.test.js
 */
import { describe, expect, it } from 'vitest';
import { ARRIVAL_SENSES } from '../../../src/data/arrivalProse.js';
import { POLITICAL_FLAVOR, POLITICAL_FLAVOR_CRISIS_SCOPED } from '../../../src/generators/narrativeText.js';
import { declarationOf, EMPTY_DECLARATION } from '../../../src/domain/facts/factVocabulary.js';

const sense = (key) => ARRIVAL_SENSES.find((s) => s.key === key);
const needsOf = (line) => (typeof line === 'function' ? [] : declarationOf(line).needs ?? []);
const isColour = (line) => Boolean(line && typeof line === 'object' && line.colour === true);
// TAIL-HISTORY-5 (2026-11-15, the chair's Y17 (2)): the fish family's catch lines take a twin each under `crisis: hunger`;
// the pins below are re-keyed BY IDENTITY over the originals (a twin is reached only by resolution, never drawn).
const originals = (pool) => pool.filter((line) => !(line && typeof line === 'object' && typeof line.twinOf === 'string'));

describe('R-AP amended: the fish key\'s lines declare the catch and the water they presume', () => {
  it('lines: the stalls\' catch (market, navigable, fish); the wet baskets (fish, market); the nets, the flapping basket (fish)', () => {
    const [stalls, monger, nets, basket] = originals(sense('fish').lines);
    // BAR4-SCENES-2 (2026-11-16, the chair's ruling HW1; re-keyed by identity): each catch line also needs its trade at work (some fish
    // house not short: `trade at work: fish`), first; the catch and the water it presumes are unchanged
    expect(needsOf(stalls)).toEqual(['trade at work: fish', 'market', 'navigable', 'fish']);
    // W2-FIX-DATA (the REVIEW-W2B cold list, c05): the fishmonger shouts a price at a market, so the wet baskets need one too
    expect(needsOf(monger)).toEqual(['trade at work: fish', 'fish', 'market']);
    for (const l of [nets, basket]) expect(needsOf(l)).toEqual(['trade at work: fish', 'fish']);
  });
  it('dominant: the racks of catch (navigable, fish); the gutting (fish); the salt barrels and their gulls (navigable)', () => {
    const [racks, gutting, barrels] = originals(sense('fish').dominant);
    // BAR8-SCENES (2026-11-17, item 3, J's 11b; re-keyed by identity): the racks and the gutting declare the catch TAKEN here, the
    // fish story's key of the same atom (`trade at work: fish taken here`), in the place of the plain key; the water and the catch as before
    expect(needsOf(racks)).toEqual(['trade at work: fish taken here', 'navigable', 'fish']); // BAR4-SCENES-2 (HW1, re-keyed by identity): as above
    expect(needsOf(gutting)).toEqual(['trade at work: fish taken here', 'fish']);
    expect(needsOf(barrels)).toEqual(['trade at work: fish', 'navigable']);
  });
});

/** the bare lines this seat read in its mixed pools, by pool and index (R-AO) */
// TAIL-HISTORY batch 1 (2026-11-15, the chair's Y6): bread.lines[1], the baking since before dawn, leaves the colour mark and
// declares `no crisis: hunger` (a line a crisis can make false is not colour): [0, 1, 3] → [0, 3]
// BAR4-SCENES-2 (2026-11-16, re-keyed by identity): the mill wheel's twin joins bread.lines after the mill wheel, so the warm oven moves [3] → [4]
// BAR5-THINGS (2026-11-16, LAW 5, re-keyed by identity): bread.lines[0], the fresh bread on the road in, leaves the colour mark and
// declares `no crisis: hunger, no crisis: under_siege`; its twin joins after it, so the warm oven moves [4] → [5]: [0, 4] → [5]
const ARRIVAL_COLOUR = { 'bread.lines': [5], 'faith.lines': [2], 'herbs.dominant': [4] }; // BAR6-SCENES (2026-11-16, LAW 6 rule 6b; re-keyed by identity): the spice sacks declare `trade at work: spice` and leave the colour mark (a fact can make them false); two twins join before the remedy line
const FLAVOR_COLOUR = { disaster_heavy: [0, 1, 2, 3, 5], religious_heavy: [1, 3, 4, 5, 6], magical_heavy: [0, 3, 5] };

describe('R-AO: the read bare lines of the mixed pools are marked colour, and declare nothing', () => {
  it('the arrival senses', () => {
    for (const [pool, idx] of Object.entries(ARRIVAL_COLOUR)) {
      const [key, field] = pool.split('.');
      for (const i of idx) {
        const line = sense(key)[field][i];
        expect(isColour(line), `${pool}[${i}]`).toBe(true);
        expect(declarationOf(line)).toBe(EMPTY_DECLARATION);
      }
    }
  });
  it('POLITICAL_FLAVOR (the crisis-scoped `stable` keeps its calm rows bare)', () => {
    for (const [pool, idx] of Object.entries(FLAVOR_COLOUR)) {
      for (const i of idx) {
        expect(isColour(POLITICAL_FLAVOR[pool][i]), `${pool}[${i}]`).toBe(true);
        expect(declarationOf(POLITICAL_FLAVOR[pool][i])).toBe(EMPTY_DECLARATION);
      }
    }
    expect(POLITICAL_FLAVOR_CRISIS_SCOPED).toContain('stable');
    for (const row of POLITICAL_FLAVOR.stable) expect(isColour(row)).toBe(false);
  });
  it('every other row of those pools declares (the pools are fully read)', () => {
    for (const [pool, idx] of Object.entries(FLAVOR_COLOUR)) {
      POLITICAL_FLAVOR[pool].forEach((row, i) => {
        if (!idx.includes(i)) expect(typeof row === 'object' && !isColour(row), `${pool}[${i}] declares`).toBe(true);
      });
    }
  });
});
