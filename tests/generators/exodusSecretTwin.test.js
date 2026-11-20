/**
 * CENSUS-4b, the chair's answer 5 (R-G): ONE exodus twin pair for the `mass_migration` secrets —
 * the influx relief pair mirrored. Under an exodus a drawn relief secret (it presumes an influx)
 * resolves to its twin; under an influx the twin is never drawn (it stands outside the draw's
 * domain), so no birth moves where the place fills.
 *
 * @enforced-by npx vitest run tests/generators/exodusSecretTwin.test.js
 */
import { describe, expect, it } from 'vitest';
import { STRESS_INSTITUTION_EFFECTS } from '../../src/data/stressInstitutionEffects.js';
import { drawDeclared } from '../../src/domain/facts/drawDeclared.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';

const pool = STRESS_INSTITUTION_EFFECTS.mass_migration;
const relief = pool.find((e) => e.secret.startsWith('Diverted the relief meant for the newcomer camp'));
const placeOf = (direction) => factsOf({ tier: 'town', institutions: [], stress: [{ type: 'mass_migration', direction }] });
/** the site's draw, as the soak's: one pick that lands on the relief secret */
const drawRelief = (p) => p.find((e) => e === relief);

describe('the exodus twin of the relief secret (answer 5)', () => {
  it('under an exodus the drawn relief secret resolves to its twin', () => {
    const r = drawDeclared(pool, { draw: drawRelief, facts: placeOf('exodus'), poolId: 'stressInstitutionEffects:STRESS_INSTITUTION_EFFECTS' });
    expect(r.resolvedBy).toBe('twin');
    expect(r.line.secret).toMatch(/^Diverted the coin meant to keep the departing families here/);
    expect(r.line.stakes).toBe('More households go every week for want of it. The blame is holding, for now');
  });
  it('under an influx the original is kept, and the twin is outside the draw', () => {
    const seen = [];
    const r = drawDeclared(pool, { draw: (p) => { seen.push(p.length); return drawRelief(p); }, facts: placeOf('influx'), poolId: 'x' });
    expect(r.resolvedBy).toBe('drawn');
    expect(r.line).toBe(relief);
    expect(seen).toEqual([pool.length - 1]);
  });
});
