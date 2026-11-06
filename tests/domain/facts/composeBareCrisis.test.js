/**
 * THE COMPOSE, unit 2 item 6 (the chair's ruling of 2026-11-05 10:3x; R-I; CENSUS-5e's waiting list):
 * the two lines that presume SOME crisis is active, whichever, declare the bare presence atom
 * `crisis` (`needs: crisis`) now that CENSUS-1i unit 8 put the kernel's crisis marks on the
 * vocabulary's dimension:
 *   DS-FTH-1 SINK arc rising v1         "…Crisis has a way of ending indifference."
 *   DS-DEF-2 Economic Survival STRONG v3 "Trouble at {settlement} has not turned into a collapse…"
 * Refused in calm; admitted under any active crisis; the pool is never mute either way.
 *
 * @enforced-by npx vitest run tests/domain/facts/composeBareCrisis.test.js
 */
import { describe, expect, it } from 'vitest';
import { eligibleVariants } from '../../../src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../../src/data/dossierStateProse/warFaith.generated.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../../src/data/dossierStateProse/defense.generated.js';
import { CALM_FACTS_ADMIT_ALL } from '../../helpers/calmFactsDouble.js';

const IN_CRISIS = Object.freeze({
  ...CALM_FACTS_ADMIT_ALL,
  crisis: Object.freeze({ types: ['plague'], kinds: ['plague'], conditionKinds: [], families: [], active: true, has: (k) => k === 'plague' }),
});

function drawable(leaf, blockId, poolKey, facts) {
  const pool = leaf[blockId].pools[poolKey];
  const meta = (leaf[blockId].poolMeta || {})[poolKey] || {};
  const slots = Object.fromEntries(pool.flatMap((v) => v.slots || []).map((slot) => [slot, 'X']));
  const out = new Set();
  const crisis = facts.crisis.active ? 'crisis' : 'no crisis'; // answered as `crisisAnswered` answers it
  for (const walls of ['walls', 'no walls']) {
    for (const v of eligibleVariants(pool, { slots, audience: 'dm', dimensions: { walls, crisis }, facts, ...(meta.crisisScoped ? { crisisScoped: true } : {}) })) out.add(v.text);
  }
  return [...out];
}

const LINES = Object.freeze([
  [DOSSIER_STATE_PROSE_WAR_FAITH, 'DS-FTH-1', 'SINK: unaffiliated present, arc rising', /Crisis has a way of ending indifference/],
  [DOSSIER_STATE_PROSE_DEFENSE, 'DS-DEF-2', 'Economic Survival: STRONG', /has not turned into a collapse/],
]);

describe('the compose · the two bare `needs: crisis` lines (R-I)', () => {
  for (const [leaf, blockId, poolKey, line] of LINES) {
    it(`${blockId} :: ${poolKey}: declares \`crisis\`, refused in calm, admitted under a crisis`, () => {
      const pool = leaf[blockId].pools[poolKey];
      expect(pool, `pool ${poolKey}`).toBeTruthy();
      const variant = pool.find((v) => line.test(v.text));
      expect(variant).toBeTruthy();
      expect(variant.marks || []).toContain('crisis');
      const calm = drawable(leaf, blockId, poolKey, CALM_FACTS_ADMIT_ALL);
      expect(calm.some((t) => line.test(t)), 'refused in calm').toBe(false);
      expect(calm.length, 'the pool speaks in calm').toBeGreaterThan(0);
      expect(drawable(leaf, blockId, poolKey, IN_CRISIS).some((t) => line.test(t)), 'admitted under a crisis').toBe(true);
    });
  }
});
