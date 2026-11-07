/**
 * Rung 2D, unit 2 (the chair's ruling on rung 2C open question 2,
 * `docs/SOAK_10000_RUNG2C_2026-11-04.md` §3c): "…the {seat} is safe for the plainest reason a
 * seat can be safe" (DS-POW-4 · `riskLabel: Stable (no challengers)` v3) printed under a slave
 * revolt (`soak1k-1`, the Elder Council, legitimacy 19) and an insurgency (`soak1k-3001`, the
 * Household Council, legitimacy 8). The unrest family denies the seat's safety as well as the
 * succession family: the instrument's claim table reads it under both
 * (`coherence/crisisBlindFindings.js`), and the variant carries `no unrest` beside
 * `succession settled` (the annex, re-projected), so an unrest crisis never draws it.
 *
 * Red first at the unit-1 tip: the instrument read the claim under succession alone, and the
 * variant carried only `succession settled`. The claim is read by the instrument itself, never
 * quoted (`tests/lint/proseDrawnAnchors.walker.test.js`).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { crisisBlindFindings } from '../../src/domain/coherence/crisisBlindFindings.js';
import { crisisDimensionsOf } from '../../src/domain/crisis/crisisFacts.js';
import { eligibleVariants } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
// CENSUS-5: DS-POW-4 v1/v2 declare `no crisis: unrest` (R-F 1), so the pool reads against the record's facts, as the desk's does.
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const POOL = DOSSIER_STATE_PROSE_POWER['DS-POW-4'].pools['riskLabel: Stable (no challengers)'];
/** The pool's own seat-safety variant, found by the instrument under a succession crisis. */
const SEAT_SAFE = POOL.find((v) => crisisBlindFindings({ stress: [{ type: 'succession_void' }] }, { power: v.text })
  .some((f) => f.claim === 'the seat is safe'));

/** @type {Record<number, any>} */
const born = {};
beforeAll(async () => {
  await ensureLaws();
  for (const i of [1, 3001]) born[i] = birth(i).settlement;
}, 180_000);

describe('rung 2D · the seat-safety line is denied by unrest as well as succession', () => {
  it('the pool carries the seat-safety variant (non-vacuity)', () => {
    expect(SEAT_SAFE).toBeDefined();
  });

  // LANDING-R2 seat E: the two seed tables run as plain parameterless tests, every seed collected.
  it('soak1k-1 (slave_revolt) and -3001 (insurgency): the instrument reads the line as crisis-blind under the unrest family', () => {
    const failures = collectSeedFailures([[1, 'slave_revolt'], [3001, 'insurgency']], ([i, type]) => {
      const s = born[i];
      expect((Array.isArray(s.stress) ? s.stress : [s.stress]).map((x) => x?.type), `soak1k-${i}`).toContain(type);
      const hits = crisisBlindFindings(s, { power: SEAT_SAFE.text });
      expect(hits.map((f) => [f.claim, f.family]), `soak1k-${i} (${type})`).toEqual([['the seat is safe', 'unrest']]);
    });
    expectNoSeedFailures(failures, 'the seat-safety line reads crisis-blind under each unrest crisis');
  });

  it('soak1k-1 and -3001: the desk pool never draws the line under its unrest crisis, and is not mute', () => {
    const failures = collectSeedFailures([1, 3001], (i) => {
      const s = born[i];
      const slots = Object.fromEntries(POOL.flatMap((v) => v.slots || []).map((slot) => [slot, 'X']));
      const eligible = eligibleVariants(POOL, { slots, audience: 'dm', dimensions: { walls: 'no walls', ...crisisDimensionsOf(s) }, facts: factsOf(s) });
      expect(eligible.length, `soak1k-${i}: the pool is not mute`).toBeGreaterThan(0);
      expect(eligible.filter((v) => crisisBlindFindings(s, { power: v.text }).length), `soak1k-${i}`).toEqual([]);
    });
    expectNoSeedFailures(failures, 'the desk pool never draws the seat-safety line under its unrest crisis');
  });

  it('a crisis-free place still draws it (the walled control)', () => {
    const eligible = eligibleVariants(POOL, { slots: { settlement: 'X', seat: 'X', faction: 'X' }, audience: 'dm', dimensions: { walls: 'no walls', ...crisisDimensionsOf({}) }, facts: factsOf({}) });
    expect(eligible).toContain(SEAT_SAFE);
  });
});
