/**
 * W2-FIX-DATA (2026-11-13) — the history lines the REVIEW-W2B cold list read false
 * (`docs/chair/2026-11-13/REVIEW-W2B-COLD-LIST.json`, rows in `src/data/historyData.js` and
 * `src/data/historyDescVariants.js`). A declared hook is refused by the history's own door (the timeline's
 * `resolveTimelineHook`, the tensions' `filterDeclared`) in the town that makes it false; a reworded line
 * presumes nothing false at any size.
 */
import { describe, expect, it } from 'vitest';
import { HISTORICAL_EVENTS_DATA } from '../../src/data/historyData.js';
import { HISTORY_DESC_VARIANTS } from '../../src/data/historyDescVariants.js';
import { declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { lineText } from '../../src/domain/facts/drawDeclared.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';

const hooks = HISTORICAL_EVENTS_DATA.flatMap((t) => t.plotHooks || []);
const hook = (/** @type {string} */ start) => hooks.find((h) => String(lineText(h)).startsWith(start));
const town = (/** @type {string[]} */ houses) => factsOf({ tier: 'town', institutions: houses.map((name) => ({ name })), config: {} });
const admits = (/** @type {any} */ l, /** @type {any} */ f) => declarationAdmits(declarationOf(l), f).admitted;
const texts = JSON.stringify([HISTORICAL_EVENTS_DATA, HISTORY_DESC_VARIANTS]);

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

describe('W2-FIX-DATA: history lines reworded to presume nothing false', () => {
  it('no physician the town may lack knows of the poisoning (c15)', () => {
    expect(texts).toMatch(/and someone in the household knows/);
    // anchored: the reworded line is asserted present on the line above, so the table cannot have drifted away
    expect(texts).not.toMatch(/and the physician knows/);
  });
  it('the seized relic was bound for a vault, not a temple\'s the town may lack (c20)', () => {
    expect(texts).toMatch(/never reached the vault it was bound for/);
    // anchored: the reworded line is asserted present on the line above, so the table cannot have drifted away
    expect(texts).not.toMatch(/temple vault/);
  });
  it('collaborators and resisters keep apart, not to quarters a hamlet has none of (c02, c07)', () => {
    expect(texts).toMatch(/families still keep apart/);
    // anchored: the reworded line is asserted present on the line above, so the table cannot have drifted away
    expect(texts).not.toMatch(/separate quarters/);
  });
  it('a succession crisis names no throne an elder council lacks (c03)', () => {
    expect(texts).toMatch(/rivals maneuvered quietly to take that place/);
    // anchored: the reworded line is asserted present on the line above, so the table cannot have drifted away
    expect(texts).not.toMatch(/maneuvered quietly for the throne/);
  });
  it('the economic divide names no merchants a hamlet lacks (c08)', () => {
    expect(texts).toMatch(/between the well-off and the working poor/);
    // anchored: the reworded line is asserted present on the line above, so the table cannot have drifted away
    expect(texts).not.toMatch(/between wealthy merchants and working poor/);
  });
});
