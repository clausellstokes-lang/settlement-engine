/**
 * tests/domain/facts/displayDrawSites.test.js — CENSUS-1d unit 2: the DISPLAY draw sites of
 * `docs/DESIGN_POOL_CENSUS.md` Appendix B (rows 89–111) draw through `drawDeclared`.
 *
 * Each arm opens a presumption ledger around one site and holds that the site's draw is noted
 * under its pool's name with its draw kind. Before the wiring these sites made no ledger entry
 * (the render ledger counted 0 PDF and 0 Tonight draws, CENSUS-1c unit 4), so each arm is
 * red-first at the commit before its site's. The site's TEXT is held byte-identical by the
 * lane's hasher (525 golden records, soak1k-0..59 records and every rendered surface), recorded
 * in each commit.
 *
 * @enforced-by npx vitest run tests/domain/facts/displayDrawSites.test.js
 */
import { describe, expect, it } from 'vitest';
import { withPresumptionLedger } from '../../../src/domain/facts/presumptionLedger.js';
import { traditionHook, traditionBeatProse } from '../../../src/domain/traditions/prose.js';
import { createConflictHookDraw, foodGapHookLine } from '../../../src/domain/dossier/hookLines.js';

/** @param {() => unknown} fn */
const ledgerOf = (fn) => withPresumptionLedger(fn).ledger;

describe('Appendix B row 89 — the tradition prose pools (kind H)', () => {
  it('a hook and a beat note their draws, the text unchanged', () => {
    const rec = { id: 'tr-1', name: 'the Lantern Walk', lastOutcome: 'failure' };
    const out = withPresumptionLedger(() => traditionHook(rec, { town: 'Ashford' }));
    expect(out.result?.text).toBe(traditionHook(rec, { town: 'Ashford' })?.text);
    expect(out.ledger.map((e) => [e.pool, e.drawKind, e.surface])).toEqual([['TRAD_HOOKS.failure', 'H', 'plot_hooks']]);
    const beat = ledgerOf(() => traditionBeatProse({ outcome: 'cancelled', name: 'x', town: 'y', ownerBit: '', seed: 's' }));
    expect(beat.map((e) => e.pool)).toEqual(['TRAD_OUTCOME_PHRASE.cancelled', 'TRAD_CANCELLED_SUMMARY']);
  });
});

describe('Appendix B row 90 — the conflict-hook and food-gap pools (kind H)', () => {
  it('each draw is noted under its family; without replacement, as before', () => {
    const conflict = { parties: ['The Mill Guild', 'the Abbey'], issue: 'Control of the river tolls' };
    const plain = createConflictHookDraw();
    const expected = [plain(conflict)[0], plain(conflict)[0]];
    const draw = createConflictHookDraw();
    const out = withPresumptionLedger(() => [draw(conflict)[0], draw(conflict)[0]]);
    expect(out.result).toEqual(expected);
    expect(out.result[0]).not.toBe(out.result[1]);
    expect(out.ledger.map((e) => e.pool)).toEqual(['HOOK_LINE_POOLS.conflict.standing', 'HOOK_LINE_POOLS.conflict.standing']);
    const gap = withPresumptionLedger(() => foodGapHookLine({ name: 'Ashford', band: 'deficit' }));
    expect(gap.result).toBe(foodGapHookLine({ name: 'Ashford', band: 'deficit' }));
    expect(gap.ledger.map((e) => [e.pool, e.drawKind])).toEqual([['HOOK_LINE_POOLS.foodGap', 'H']]);
  });
});
