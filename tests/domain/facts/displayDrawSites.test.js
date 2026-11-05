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
