/**
 * structuralValidatorDeterminism.test.js
 *
 * Guards the B08 structuralValidator + history-data fixes:
 *
 *  1. (findings #4, #8) checkStructuralValidity must be DETERMINISTIC. The
 *     subsistence_struggle gate for isolated thorps/hamlets previously came from
 *     a raw _rng() draw. The validator is also called on the re-render-heavy
 *     draft path (domain/coherence/checkDraftEdit) with NO active seeded RNG, so
 *     _rng() fell back to Math.random() and the warning flickered on/off each
 *     render. The gate is now a stable hash of the settlement's identity, so
 *     repeated calls with identical inputs return identical results.
 *
 *  2. (finding #12) In a no-magic world the random tension fill must not leak the
 *     'magical_controversy' event (the old filter checked the wrong token,
 *     'magical', which matched nothing).
 *
 *  3. (finding #11) On a small settlement with no real authority, the crime_wave
 *     description is reworded — the .replace() search strings must match the
 *     template verbatim or the generic wording leaks through.
 */

import { describe, expect, test } from 'vitest';

import { checkStructuralValidity } from '../../src/generators/structuralValidator.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

// ── 1. checkStructuralValidity is deterministic with no active RNG ─────────────

const hasType = (result, type) => (result.violations || []).some((v) => v.type === type);

describe('checkStructuralValidity is deterministic (no RNG flicker)', () => {
  const isolatedSmall = {
    institutions: [{ name: 'Village well' }, { name: 'Shrine' }],
    config: { tier: 'thorp', tradeRouteAccess: 'isolated' },
  };

  test('subsistence_struggle gate is stable across many calls (no active seeded RNG)', () => {
    const first = hasType(
      checkStructuralValidity(isolatedSmall.institutions, isolatedSmall.config),
      'subsistence_struggle',
    );
    // 50 re-validations stand in for the re-render-heavy draft path. A raw
    // Math.random() gate would flip with overwhelming probability across this
    // many tries; the hashed gate must never change.
    for (let i = 0; i < 50; i += 1) {
      const again = hasType(
        checkStructuralValidity(isolatedSmall.institutions, isolatedSmall.config),
        'subsistence_struggle',
      );
      expect(again).toBe(first);
    }
  });

  test('different isolated small settlements can resolve the gate differently (still input-driven)', () => {
    // The gate is keyed on tier + route + institution names, so two distinct
    // rosters are free to differ; what must NOT happen is a SINGLE roster
    // flickering. Assert each is internally stable.
    const rosters = [
      { tier: 'thorp', insts: [{ name: 'Village well' }] },
      { tier: 'hamlet', insts: [{ name: 'Chapel' }, { name: 'Mill' }] },
      { tier: 'thorp', insts: [{ name: 'Hunting lodge' }, { name: 'Trading post' }] },
    ];
    for (const r of rosters) {
      const cfg = { tier: r.tier, tradeRouteAccess: 'isolated' };
      const a = hasType(checkStructuralValidity(r.insts, cfg), 'subsistence_struggle');
      const b = hasType(checkStructuralValidity(r.insts, cfg), 'subsistence_struggle');
      expect(b).toBe(a);
    }
  });

  test('subsistence_economy (info) always present for isolated small settlements', () => {
    // This one is unconditional — a quick sanity check that the isolation block
    // still runs after the gate refactor.
    const result = checkStructuralValidity(isolatedSmall.institutions, isolatedSmall.config);
    expect(hasType(result, 'subsistence_economy')).toBe(true);
  });
});

// ── 2. No-magic worlds never surface magical_controversy as a tension ─────────

describe('no-magic worlds suppress the magical_controversy tension (finding #12)', () => {
  const genTensions = (magicExists, seed) => {
    const s = generateSettlementPipeline(
      {
        settType: 'city',
        culture: 'germanic',
        terrain: 'grassland',
        tradeRouteAccess: 'road',
        magicExists,
      },
      null,
      { seed, customContent: {} },
    );
    return (s.history?.currentTensions || []).map((t) => t.type);
  };

  test('magical_controversy never appears in currentTensions when magicExists is false', () => {
    const offenders = [];
    for (let i = 0; i < 40; i += 1) {
      const types = genTensions(false, `no-magic-history-${i}`);
      if (types.includes('magical_controversy')) offenders.push(`no-magic-history-${i}`);
    }
    expect(offenders, `magical_controversy leaked into no-magic world(s): ${offenders.join(', ')}`).toEqual([]);
  });

  test('the magical_controversy event CAN still appear when magic exists (test is not vacuous)', () => {
    // Without this the suppression test could pass simply because the event is
    // never picked anywhere. Confirm the magic-on world surfaces it at least once
    // across a spread of seeds.
    let seen = false;
    for (let i = 0; i < 80 && !seen; i += 1) {
      if (genTensions(true, `magic-on-history-${i}`).includes('magical_controversy')) seen = true;
    }
    expect(seen, 'magical_controversy never surfaced even with magic enabled').toBe(true);
  });
});

// ── 3. crime_wave reword strings match the template (finding #11) ─────────────

import { HISTORICAL_EVENTS_DATA } from '../../src/data/historyData.js';

describe('crime_wave small-settlement reword search strings match the template (finding #11)', () => {
  test('the crime_wave template still contains the exact phrases the reword targets', () => {
    const tmpl = HISTORICAL_EVENTS_DATA.find((e) => e.type === 'crime_wave');
    expect(tmpl, 'crime_wave template missing from HISTORICAL_EVENTS_DATA').toBeTruthy();
    // historyGenerator rewords these two phrases for authority-less hamlets; if
    // the template drifts, the .replace() silently becomes a no-op again.
    expect(tmpl.description).toContain('overwhelmed the authorities');
    expect(tmpl.description).toContain('vigilantes began to form');
  });
});
