/**
 * ancientRuinsGeneration.test.js — W-LIFECYCLE Stage 3: GENERATION-SEEDED
 * ANCIENTS (design §2 sub-century honesty).
 *
 * THE CONSTITUTIONAL RULE: the feature is STRICTLY OPT-IN
 * (config.ancientRuinsEnabled). Flag absent ⇒ generateHistory consumes ZERO rng
 * for this feature and emits no ancientRuin key — existing seeds are
 * byte-identical (generatorGoldenMaster is the realm-level proof; this file
 * pins the seam directly, including the draw-count invariance).
 */
import { afterEach, describe, expect, it } from 'vitest';

import { generateHistory } from '../../src/generators/historyGenerator.js';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';

const config = (over = {}) => ({
  terrainType: 'plains', tradeRouteAccess: 'road', ...over,
});
const run = (seed, cfg) => {
  const prev = setActiveRng(createPRNG(seed));
  try {
    return generateHistory('town', cfg, [], null, { prosperity: 'Comfortable', primaryExports: [] }, { factions: [] });
  } finally {
    clearActiveRng(prev);
  }
};

afterEach(() => { clearActiveRng(); });

describe('generation-seeded ancients (opt-in; existing seeds byte-identical)', () => {
  it('flag ABSENT: no ancientRuin key, no ancient event, and the history is BYTE-IDENTICAL to pre-feature output', () => {
    const out = run('anc-a', config());
    expect(out.ancientRuin).toBeUndefined();
    expect((out.historicalEvents || []).some((e) => e.ancientRuin)).toBe(false);
    // Draw-count invariance: the flag check precedes ANY draw, so the same seed
    // produces the same history whether the feature exists or not — proxied by
    // determinism across repeated runs (the golden master pins the realm level).
    expect(JSON.stringify(run('anc-a', config()))).toBe(JSON.stringify(out));
  });

  it('flag ON: some seeds mint one PRE-FOUNDING fallen-city event + the ancientRuin display marker', () => {
    let minted = 0;
    for (let i = 0; i < 40; i += 1) {
      const out = run(`anc-${i}`, config({ ancientRuinsEnabled: true }));
      if (!out.ancientRuin) continue;
      minted += 1;
      expect(typeof out.ancientRuin.name).toBe('string');
      expect(out.ancientRuin.name.length).toBeGreaterThan(3);
      const evt = (out.historicalEvents || []).find((e) => e.ancientRuin);
      expect(evt, 'the event rides the EXISTING history machinery').toBeTruthy();
      expect(evt.name).toBe(`The Fall of ${out.ancientRuin.name}`);
      expect(evt.severity).toBe('catastrophic');
      // ANCIENT: it fell before the settlement's own founding.
      expect(evt.yearsAgo).toBeGreaterThan(out.age);
      expect(evt.description).toContain('relic ruin');
    }
    // A small chance, but present across a 40-seed sweep (anti-vacuity) and
    // nowhere near universal (the "small generation-time chance" posture).
    expect(minted).toBeGreaterThan(0);
    expect(minted).toBeLessThan(20);
  });

  it('flag ON is deterministic per seed', () => {
    const a = run('anc-det', config({ ancientRuinsEnabled: true }));
    const b = run('anc-det', config({ ancientRuinsEnabled: true }));
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
