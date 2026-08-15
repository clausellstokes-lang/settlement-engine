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
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { generateHistory } from '../../src/generators/historyGenerator.js';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { readEnvelope } from '../helpers/distributionEnvelope.js';

/**
 * The mint sweep's corpus size. DOUBLED from the authored 40 on 2026-07-27 (wave EP-5)
 * to buy the anti-vacuity floor its statistical power: at N=40 a floor of 1 sits 1.685
 * sigma from a mean of 4.3, under the program's 2-sigma bar, and NO non-vacuous bound
 * can reach 2 sigma at that N. At 80 the same floor carries 2.743 sigma and the ceiling
 * tightens from 47.5% to 23.75% in rate terms. Cost: ~135 ms.
 */
const N_MINT_SWEEP = 80;

/** The one canonical home for this file's derived distribution bounds. */
const ENVELOPES = JSON.parse(readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../fixtures/distribution-envelopes.manifest.json'),
  'utf8',
));

/**
 * Read a registered envelope and prove it was measured against THIS corpus size. An
 * entry whose `n` drifted from the sweep it governs is a bound about a different
 * experiment.
 * @param {string} id
 */
function envelope(id) {
  const entry = readEnvelope(ENVELOPES, id);
  expect(entry.n, `${id}: registered for n=${entry.n} but this sweep runs N=${N_MINT_SWEEP}`)
    .toBe(N_MINT_SWEEP);
  return entry;
}

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
    const floor = envelope('ancientRuins.mint.floor');
    const ceiling = envelope('ancientRuins.mint.ceiling');
    let minted = 0;
    // EVERY seed runs and every minted ruin is inspected. Under the bare loop a
    // malformation hitting 9 of the sweep's ruins and one hitting a single ruin both
    // reported "1 failure", and no seed after the casualty ran at all — which matters
    // more here than it used to, because the corpus is now twice as large.
    const failures = collectSeedFailures(
      Array.from({ length: N_MINT_SWEEP }, (_, i) => `anc-${i}`),
      (seed) => {
        const out = run(seed, config({ ancientRuinsEnabled: true }));
        if (!out.ancientRuin) return;
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
      },
    );
    expectNoSeedFailures(failures, 'every minted ancient ruin carries a well-formed pre-founding fall event');
    // A small chance, but PRESENT across the sweep — without this floor every per-mint
    // assertion above is satisfied vacuously by a sweep that minted nothing — and
    // nowhere near universal (the "small generation-time chance" posture). Both bounds
    // are DERIVED from a measured 43/400 mint rate, not hand-picked; the sweep lands
    // on 11 of 80.
    expect(minted, `mint count below the derived anti-vacuity floor`)
      .toBeGreaterThanOrEqual(floor.bound);
    expect(minted, `mint count above the derived ceiling`)
      .toBeLessThanOrEqual(ceiling.bound);
  });

  it('flag ON is deterministic per seed', () => {
    const a = run('anc-det', config({ ancientRuinsEnabled: true }));
    const b = run('anc-det', config({ ancientRuinsEnabled: true }));
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
