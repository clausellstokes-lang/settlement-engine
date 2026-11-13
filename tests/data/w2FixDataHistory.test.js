/**
 * W2-FIX-DATA (2026-11-13) — the history lines the REVIEW-W2B cold list read false
 * (`docs/chair/2026-11-13/REVIEW-W2B-COLD-LIST.json`, rows in `src/data/historyData.js` and
 * `src/data/historyDescVariants.js`). A declared hook is refused by the history's own door (the timeline's
 * `resolveTimelineHook`, the tensions' `filterDeclared`) in the town that makes it false; a reworded line
 * presumes nothing false at any size.
 */
import { describe, expect, it } from 'vitest';
import { HISTORICAL_EVENTS_DATA } from '../../src/data/historyData.js';
import { declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { lineText } from '../../src/domain/facts/drawDeclared.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';

const hooks = HISTORICAL_EVENTS_DATA.flatMap((t) => t.plotHooks || []);
const hook = (/** @type {string} */ start) => hooks.find((h) => String(lineText(h)).startsWith(start));
const town = (/** @type {string[]} */ houses) => factsOf({ tier: 'town', institutions: houses.map((name) => ({ name })), config: {} });
const admits = (/** @type {any} */ l, /** @type {any} */ f) => declarationAdmits(declarationOf(l), f).admitted;

describe('W2-FIX-DATA: a history hook prints only where it is true', () => {
  it('a guard captain only where a watch stands, not a household levy (c04)', () => {
    expect(admits(hook('A guard captain'), town(['Household levy']))).toBe(false);
    expect(admits(hook('A guard captain'), town(['Town watch']))).toBe(true);
  });
  it('a journeyman denied mastership, and a guild master\'s records, only where a guild stands (c10)', () => {
    for (const start of ['A journeyman denied mastership', "A guild master's records"]) {
      expect(admits(hook(start), town([]))).toBe(false);
      expect(admits(hook(start), town(['Craft guilds (5-15)']))).toBe(true);
    }
  });
});
