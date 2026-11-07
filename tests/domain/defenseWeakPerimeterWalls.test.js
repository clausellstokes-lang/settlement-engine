/**
 * CENSUS-5b (2026-11-05), unit 1: DS-DEF-1 `readiness WEAK` v2 ("…how much of the perimeter has
 * nobody on it…") presumes the PERIMETER, so it declares `walls` (the chair's ruling 3: `walls`
 * means the perimeter only) in the annex tag slot — the census channel, which is the same word as
 * the kernel mark (R-O) and which the kernel's pre-filter reads (`eligibleVariants`, law 5: the
 * DS-DEF-1 desk answers walls through `wallsAnswered`). CENSUS-5 left the line "declared
 * calm-under-threat/unrest only" with `walls` owed (its question 3, answered by R-O).
 */
import { describe, expect, it } from 'vitest';
import { eligibleVariants, noteDrawnVariant } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { CALM_FACTS_ADMIT_ALL } from '../helpers/calmFactsDouble.js';

const POOL = DOSSIER_STATE_PROSE_DEFENSE['DS-DEF-1'].pools['readiness WEAK'];
const PERIMETER = POOL.find((v) => /perimeter has nobody on it/.test(v.text));

/** @param {'walls'|'no walls'} walls */
const drawable = (walls) => eligibleVariants(POOL, {
  slots: { settlement: 'X' }, audience: 'dm', dimensions: { walls, threat: 'no threat', hunger: 'no hunger', succession: 'succession settled', unrest: 'no unrest', crisis: 'no crisis' },
  facts: CALM_FACTS_ADMIT_ALL, crisisScoped: true,
}).map((v) => v.vid);

describe('CENSUS-5b unit 1 · DS-DEF-1 readiness WEAK v2 presumes the perimeter', () => {
  it('the line exists and carries the walls mark (the census channel = the kernel word, R-O)', () => {
    expect(PERIMETER, 'the perimeter line').toBeTruthy();
    expect(PERIMETER.marks).toContain('walls');
  });

  it('is refused where the record has no perimeter, and the pool stays readable there', () => {
    const vids = drawable('no walls');
    expect(vids.length, 'the pool went mute without walls').toBeGreaterThan(0);
    expect(vids).not.toContain(PERIMETER.vid); // anchored: the line above proves the pool still draws without walls
  });

  it('is drawable where the perimeter stands', () => {
    expect(drawable('walls')).toContain(PERIMETER.vid);
  });

  it('a drawn perimeter line notes `walls` in the presumption ledger (the self-check re-asserts it)', () => {
    const { ledger } = withPresumptionLedger(() => noteDrawnVariant(PERIMETER, { blockId: 'DS-DEF-1', poolKey: 'readiness WEAK', crisisScoped: true }));
    expect(ledger[0].atoms).toContain('walls');
  });
});
