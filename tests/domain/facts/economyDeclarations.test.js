/**
 * tests/domain/facts/economyDeclarations.test.js — CENSUS-3b: THE DS-ECO / DS-SUP / DS-POP
 * DECLARATIONS DO WHAT THEY SAY (unit 2, the owed economy claims; later units append).
 *
 * Unit 2: "closes every year ahead" (DS-ECO-8 COMFORTABLE v1) declares `no crisis: indebted`
 * (a fact atom in the tag slot, read against `factsOf`), so a place under a debt never draws it,
 * and a place without one still can. The `no hunger` marks of DS-ECO-10 established v1 and
 * DS-ECO-12 one-source v3 are held by `tests/domain/crisisBlindDossierProse.test.js`.
 *
 * @enforced-by npx vitest run tests/domain/facts/economyDeclarations.test.js
 */
import { describe, expect, it } from 'vitest';
import { readStateProse } from '../../../src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../../src/data/dossierStateProse/economy.generated.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';

const SEEDS = Array.from({ length: 200 }, (_, i) => `s${i}`);
const CLAIM = /closes every year ahead/;

/** @param {object} record */
function drawsOf(record) {
  const facts = factsOf(record);
  return SEEDS.map((seed) => readStateProse(DOSSIER_STATE_PROSE_ECONOMY, 'DS-ECO-8', 'COMFORTABLE',
    { slots: { settlement: 'X' }, seed, audience: 'dm', facts })?.text ?? null);
}

describe('unit 2: the year closed ahead is refused under a debt', () => {
  it('under indebted: never drawn, and the pool still speaks', () => {
    const texts = drawsOf({ tier: 'town', stress: [{ type: 'indebted' }], institutions: [] });
    expect(texts.filter((t) => t && CLAIM.test(t))).toEqual([]);
    expect(texts.every((t) => typeof t === 'string')).toBe(true);
  });
  it('without a debt (calm, or another crisis): still drawable', () => {
    expect(drawsOf({ tier: 'town', institutions: [] }).some((t) => t && CLAIM.test(t))).toBe(true);
    expect(drawsOf({ tier: 'town', stress: [{ type: 'famine' }], institutions: [] }).some((t) => t && CLAIM.test(t))).toBe(true);
  });
});
