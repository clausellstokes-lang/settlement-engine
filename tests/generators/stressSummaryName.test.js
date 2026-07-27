/**
 * tests/generators/stressSummaryName.test.js — F8 regression guard.
 *
 * resolveStress (step 3) rolls stress BEFORE the settlement name is minted
 * (assembleSettlement, ~16 steps later), so the summary used to be baked with an
 * empty name: 9 of the templates interpolate a bare `${name}`, so the flagship
 * Active Crisis card shipped prose like " is under active siege…". F8 splits the
 * summary into a roll (rng-derived token) + a render (pure text): buildStressEntry
 * stashes the token as `summaryRoll`, and assembleSettlement re-renders the summary
 * with the REAL name and deletes the transient token.
 *
 * These tests pin that behavior:
 *   (a) no generated stress summary is a bare leading-space fragment, and every
 *       name-embedding summary uses the real settlement name;
 *   (b) no persisted entry carries the transient `summaryRoll` token;
 *   (c) same-seed determinism — identical config+seed → identical summaries;
 *   (d) the wartime rng branch (profit vs loss) still varies across seeds, proving
 *       the rng draw was preserved through the roll/render split.
 */

import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const BASE = { settType: 'city', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'road', monsterThreat: 'civilized' };

const mk = (over = {}, seed = 'f8') => {
  // slave_revolt is deliberately outside the grounded default boundary. This
  // suite exercises every registered renderer, so opt into grim only for that
  // sensitive authored case while leaving every ordinary probe at the default.
  const contentProfile = over.stressType === 'slave_revolt'
    ? 'grim'
    : 'grounded';
  return generateSettlementPipeline(
    { ...BASE, contentProfile, ...over },
    null,
    { seed, customContent: {} },
  );
};

/** Normalize the stress container (null / bare object / array) to an entry array. */
const entriesOf = (s) => {
  const c = s.stress;
  return Array.isArray(c) ? c : c ? [c] : [];
};

// monster_pressure is the ONE template with no name interpolation.
const NAMELESS_TYPES = new Set(['monster_pressure']);
const ALL_TYPES = Object.keys(STRESS_TYPE_MAP);

describe('F8 — stress summaries render with the real settlement name', () => {
  it('never emits a bare leading-space summary and embeds the real name', () => {
    for (const type of ALL_TYPES) {
      const s = mk({ stressType: type });
      const entries = entriesOf(s);
      // Forced single stress always produces exactly one entry of this type.
      expect(entries.length, `forced ${type} should produce a stress entry`).toBeGreaterThan(0);
      for (const e of entries) {
        expect(typeof e.summary, `${type} summary is a string`).toBe('string');
        // LIVENESS ANCHOR for the four exclusions below: an empty summary satisfies
        // every one of them vacuously (`''` matches no leading-space pattern and
        // contains no artifact), so pin that there is rendered prose to inspect.
        expect(e.summary.trim().length, `${type} summary is rendered prose`).toBeGreaterThan(0);
        // The bug's signature: a summary that leads with the missing name.
        // anchored: the non-empty assertion above (plus the real-name containment below for named types) pins this summary as live rendered text.
        expect(e.summary, `${type} summary must not lead with whitespace`).not.toMatch(/^\s/);
        // anchored: same live-prose anchor as the assertion above.
        expect(e.summary, `${type} summary must not lead with " is/was/has"`).not.toMatch(/^ (is|was|has)/);
        if (!NAMELESS_TYPES.has(e.type)) {
          expect(e.summary, `${type} summary must contain the real name "${s.name}"`).toContain(s.name);
        }
        // The empty-name artifacts must be gone.
        // anchored: same live-prose anchor; the summary is non-empty rendered text.
        expect(e.summary).not.toContain('in  ');    // "spreading in  " (double space)
        // anchored: same live-prose anchor; the summary is non-empty rendered text.
        expect(e.summary).not.toContain('of  died'); // "leader of  died"
      }
    }
  }, 120_000);

  it('leaves NO summaryRoll token on any persisted stress entry', () => {
    // Forced types + a broad probabilistic seed sweep (the original bug surfaced
    // on emergent stress on 5/60 seeds).
    const configs = [
      ...ALL_TYPES.map((t) => ({ over: { stressType: t }, seed: 'roll' })),
      ...Array.from({ length: 60 }, (_, i) => ({ over: {}, seed: `sweep-${i}` })),
    ];
    const failures = collectSeedFailures(configs, ({ over, seed }) => {
      const s = mk(over, seed);
      for (const e of entriesOf(s)) {
        expect(Object.prototype.hasOwnProperty.call(e, 'summaryRoll'),
          `entry ${e.type} (seed ${seed}) must not persist summaryRoll`).toBe(false);
      }
      // Dual-write invariant: stress and stressors carry the same rendered text.
      const st = entriesOf(s);
      const so = Array.isArray(s.stressors) ? s.stressors : s.stressors ? [s.stressors] : [];
      expect(so.map((e) => e.summary), `stress/stressors parity (seed ${seed})`).toEqual(st.map((e) => e.summary));
    });
    expectNoSeedFailures(failures, 'no persisted stress entry carries a summaryRoll token');
  });

  it('is deterministic — same config+seed reproduces identical summaries', () => {
    for (const type of ['under_siege', 'wartime', 'religious_conversion', 'plague_onset']) {
      const a = entriesOf(mk({ stressType: type }, 'det')).map((e) => e.summary);
      const b = entriesOf(mk({ stressType: type }, 'det')).map((e) => e.summary);
      expect(b).toEqual(a);
    }
  });

  it('preserves the wartime rng branch — profit vs loss varies across seeds', () => {
    const branches = new Set();
    for (let i = 0; i < 20; i++) {
      const e = entriesOf(mk({ stressType: 'wartime' }, `war-${i}`))[0];
      branches.add(
        e.summary.includes('positioned to profit') ? 'profit'
        : e.summary.includes('may not win') ? 'loss'
        : 'other'
      );
    }
    // Both outcomes of the `rng() < 0.45` coin must appear — the roll survived
    // the roll/render split.
    expect(branches.has('profit')).toBe(true);
    expect(branches.has('loss')).toBe(true);
    expect(branches.has('other')).toBe(false);
  });
});
