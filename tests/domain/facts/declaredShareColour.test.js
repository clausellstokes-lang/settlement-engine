/**
 * tests/domain/facts/declaredShareColour.test.js — THE COMPOSE, unit 2 item 3 (the chair's ruling of
 * 2026-11-05 11:0x on CENSUS-4h's question 1): `declared-share` COUNTS A `colour` MARK AS DECLARED.
 *
 * The registers already count a colour line as declared (R-AO: "read; presumes nothing"); the soak's
 * share read it as silence, so marking a line LOWERED the share. The draw, the kernel and the self-check
 * still read colour as no atom (it moves no birth); only the ledger entry carries `colour: true`, and
 * `declaredShare` counts it. Three channels, as the registers read them: the annex mark on a state
 * variant, a table row `{ text, colour: true }`, and the pool's own `{colour}` brace.
 *
 * @enforced-by npx vitest run tests/domain/facts/declaredShareColour.test.js
 */
import { describe, expect, it } from 'vitest';
import { withPresumptionLedger } from '../../../src/domain/facts/presumptionLedger.js';
import { declaredShare, presumptionFindings } from '../../../src/domain/facts/presumptionCheck.js';
import { drawDeclared } from '../../../src/domain/facts/drawDeclared.js';
import { noteDrawnVariant, readStateProse } from '../../../src/domain/display/stateProse/stateProseKernel.js';

describe('declared-share counts a colour mark as declared (CENSUS-4h Q1, ruled yes)', () => {
  it('a state variant marked `colour` is noted colour and counted declared', () => {
    const { ledger } = withPresumptionLedger(() => {
      noteDrawnVariant({ angle: 'street', marks: ['colour'], text: 'a', slots: [], vid: 1 }, { blockId: 'B', poolKey: 'P' });
      noteDrawnVariant({ angle: 'street', text: 'b', slots: [], vid: 2 }, { blockId: 'B', poolKey: 'P' });
    });
    expect(ledger.map((e) => e.colour === true)).toEqual([true, false]);
    expect(declaredShare(ledger)).toEqual({ dossier: { drawn: 2, declared: 1 } });
    expect(presumptionFindings({}, ledger)).toEqual([]);
  });

  it('a table row `{ text, colour: true }` is noted colour; a bare string is not', () => {
    const pool = Object.freeze([{ text: 'x', colour: true }, 'y']);
    const { ledger } = withPresumptionLedger(() => {
      for (const i of [0, 1]) drawDeclared(pool, { draw: (p) => p[i], facts: null, poolId: 't:T', surface: 'npcs' });
    });
    expect(ledger.map((e) => e.colour === true)).toEqual([true, false]);
    expect(declaredShare(ledger)).toEqual({ npcs: { drawn: 2, declared: 1 } });
  });

  it('a pool braced `{colour}` counts every draw from it as declared', () => {
    const corpus = { B: { pools: { P: [{ angle: 'street', text: 'only', slots: [], vid: 7 }] }, poolMeta: { P: { colour: true } } } };
    const { ledger } = withPresumptionLedger(() => { readStateProse(corpus, 'B', 'P', { seed: 's' }); });
    expect(ledger).toHaveLength(1);
    expect(ledger[0].colour).toBe(true);
    expect(declaredShare(ledger)).toEqual({ dossier: { drawn: 1, declared: 1 } });
  });
});
