/**
 * safetyForceLines.test.js — COHERENCE-UPKEEP-7, item 3 (the round-three cut, REVIEW-R2-STAGES, lane "up"): two lines
 * of the safety profile that named a force the town does not have, or denied one it has.
 *   #640: "A mercenary company provides enforcement: …" where a town watch stands (rr2s-town-indebted-port-1: a Free
 *         company hall and a Town watch): the branch now needs no watch, so the watch's own line prints.
 *   #104: "Crime exists but is well-managed. Local enforcement is present and responsive." in a thorp of seven with no
 *         force (rr2s-thorp-calm-port-1; its tab: "Nobody here is paid to keep order."): where no garrison, watch or
 *         militia stands, the line says who does keep order.
 * The reader's own shape (render.rr2s.jsx :: cfgFor).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { defenceOf } from '../../src/domain/facts/defence.js';

/** @param {string} seed */
function birth(seed) {
  const m = /^rr2s-(\w+)-([a-z_+]+)-([a-z_]+)-(\d+)$/.exec(seed);
  if (!m) throw new Error(seed);
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  const cfg = birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true });
  return generateSettlementPipeline(cfg, null, { seed, customContent: {} });
}

/** @type {any[]} */
const corpus = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city']) {
    for (const route of ['rand', 'port']) for (let i = 0; i < 8; i++) corpus.push(birth(`rr2s-${tier}-calm-${route}-${i}`));
  }
}, 600000);

describe('the safety profile names only a force that stands (item 3)', () => {
  test('RED-FIRST #640: no "A mercenary company provides enforcement" where a town watch stands', () => {
    const s = birth('rr2s-town-indebted-port-1');
    const d = defenceOf({ institutions: s.institutions });
    expect(d.watch && d.mercenary, 'anchored: a watch and a hired body stand').toBe(true);
    expect(s.economicState.safetyProfile.guardEffectivenessDesc.startsWith('A mercenary company provides enforcement')).toBe(false);
    for (const t of corpus) {
      const dd = defenceOf({ institutions: t.institutions });
      if (dd.watch) expect(t.economicState.safetyProfile.guardEffectivenessDesc.startsWith('A mercenary company provides enforcement'), t.name).toBe(false);
    }
  });

  test('RED-FIRST #104: no "Local enforcement is present" where no garrison, watch or militia stands', () => {
    const s = birth('rr2s-thorp-calm-port-1');
    const d = defenceOf({ institutions: s.institutions });
    expect(d.garrison || d.watch || d.militia, 'anchored: no force stands').toBe(false);
    expect(s.economicState.safetyProfile.safetyLabel, 'anchored: the Safe line').toBe('Safe');
    expect(s.economicState.safetyProfile.safetyDesc).not.toContain('Local enforcement is present');
    for (const t of corpus) expect(t.economicState.safetyProfile.safetyDesc, t.name).not.toContain('Local enforcement is present');
  });
});
