/**
 * tests/generators/stressSecretNoCommodity.test.js — R2-CODE-A-3, round three's cut (lane ra), HIGH #651 and
 * #327: "The original recovered contract that created the debt…" (rr2s-town-indebted-port-1, first export
 * "Recovered artefacts") and "The milled operation they authorised six months ago disturbed a nesting site"
 * (rr2s-village-monster_pressure-rand-1, "Milled flour"). The {commodity} slot of a crisis secret is the export
 * scan's label or, failing one, the export's first word, which is no commodity; the plague's "medicinal
 * {commodity}" read "medicinal milled" the same way. No secret reads the slot now.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { STRESS_INSTITUTION_EFFECTS } from '../../src/data/stressInstitutionEffects.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

describe('the crisis secrets read no commodity slot', () => {
  it('no secret or stakes carries {commodity}', () => {
    const all = Object.values(STRESS_INSTITUTION_EFFECTS).flat().flatMap((e) => [e.secret, e.stakes]);
    expect(all.filter((t) => /\{commodity\}/.test(String(t)))).toEqual([]);
  });
});

describe("the reader's towns, born as the app births them", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** @param {string} seed @param {string} settType @param {string[]} stresses @param {object} [route] */
  const born = (seed, settType, stresses, route = {}) => /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType, selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} }));
  /** @param {any} s */
  const secrets = (s) => (s.npcs || []).map((n) => n.secret?.what || '');
  it("Qal'atqala (#651): the debt's contract names no first word", () => {
    const s = born('rr2s-town-indebted-port-1', 'town', ['indebted'], { tradeRouteAccess: 'port' });
    expect(secrets(s).filter((t) => /recovered contract/.test(t))).toEqual([]);
    expect(secrets(s)).toContain('The original contract that created the debt was based on projections they knew were false at the time of signing');
  });
  it('the monster village (#327): the work that disturbed the nest names no first word', () => {
    const s = born('rr2s-village-monster_pressure-rand-1', 'village', ['monster_pressure']);
    expect(secrets(s).filter((t) => /milled operation/.test(t))).toEqual([]);
    expect(secrets(s)).toContain('The work they authorised six months ago disturbed a nesting site. The attacks started three weeks later');
  });
});
