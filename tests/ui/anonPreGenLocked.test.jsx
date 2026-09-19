/** @vitest-environment jsdom */
/**
 * anonPreGenLocked.test.jsx — AN ANONYMOUS FORGE IS A SIZE AND EVERYTHING ELSE ON RANDOM.
 *
 * THE OWNER (§934.34): "only hamlet, village, and town can be accessed without signing in
 * and only with everything on random."
 *
 * ── THE TWO HALVES, AND WHY ONLY ONE OF THEM IS A GATE ─────────────────────────
 * The wizard DRAWS every option and disables it — nothing is hidden, which is the owner's
 * own law — and that is a courtesy: a disabled control stops a pointer, not a persisted
 * config. `store/persistProjection.js` persists `config`, so a stored blob from a session
 * that once had an account, a hand-edited localStorage, or the Library's "Apply Saved
 * Configuration" can all put a customized config in front of an anonymous forge. That is
 * the 2026-09-16 production bug's exact shape — a value that survived one lifecycle path
 * and ghosted another. So the RULE is enforced in the generation action, and the arms
 * below drive BOTH: the surface a reader sees, and the lane that decides what is forged.
 *
 * ⚠ THE FORCING IS ASSERTED AGAINST DEFAULT_CONFIG, NOT AGAINST A LIST OF DIALS. "On
 * random" is not invented by the guard: the wizard's defaults ARE that shape, so the
 * anonymous config is the defaults with the reader's own size on top. Asserting the
 * relation rather than the fields means a dial added tomorrow is covered on the day it
 * lands.
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

const H = vi.hoisted(() => ({ tier: 'anon', mobile: false }));

vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => H.mobile, getIsMobile: () => H.mobile }));
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(), Funnel: {}, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { TIER_GATE } from '../../src/store/authSlice.js';
import { ANON_SIZES, SIZE_LADDER } from '../../src/config/tierFacts.js';
import { refusalCopy } from '../../src/components/primitives/RefusalNotice.jsx';
import { REFUSAL_REASONS } from '../../src/lib/refusalReasons.js';

/** The gate's own predicate, driven without the store: rank in [minTier, maxTier]. */
const RANK = { thorp: 0, hamlet: 1, village: 2, town: 3, city: 4, capital: 5, metropolis: 5 };
const allowedFor = (tier, size) => RANK[size] >= RANK[TIER_GATE[tier].minTier]
  && RANK[size] <= RANK[TIER_GATE[tier].maxTier];

afterEach(() => { cleanup(); });
beforeEach(() => { H.tier = 'anon'; H.mobile = false; });

describe('THE GATE — one range, one capability flag', () => {
  test('an anonymous visitor reaches exactly hamlet, village and town', () => {
    const reachable = SIZE_LADDER.filter((size) => allowedFor('anon', size));
    expect(reachable).toEqual([...ANON_SIZES]);
    // anchored: the three above are asserted present in the same derivation, so a gate
    // that admitted nothing at all reds there first.
    expect(allowedFor('anon', 'thorp'), 'a thorpe requires an account (§934.34)').toBe(false);
    expect(allowedFor('anon', 'city')).toBe(false);
    expect(allowedFor('anon', 'metropolis')).toBe(false);
  });

  test('a free account reaches the whole ladder, thorpe included', () => {
    expect(SIZE_LADDER.filter((size) => allowedFor('free', size))).toEqual([...SIZE_LADDER]);
  });

  test('the pre-generation options are an account\'s, and are NOT the custom-content gate', () => {
    expect(TIER_GATE.anon.preGenOptions).toBe(false);
    expect(TIER_GATE.free.preGenOptions).toBe(true);
    // ⛔ THE TWO GATES ARE DELIBERATELY DIFFERENT. The owner ruled pre-generation
    // configuration free with an account and the Compendium's authored content premium;
    // a single flag would have made one of those wrong.
    expect(TIER_GATE.free.customContent).toBe(false);
    expect(TIER_GATE.free.preGenOptions).not.toBe(TIER_GATE.free.customContent);
  });

  test('the refusal that explains it resolves to real words', () => {
    const copy = refusalCopy(REFUSAL_REASONS.PRE_GEN_LOCKED);
    expect(copy, 'the reason renders nothing — the notice would be blank').not.toBeNull();
    expect(copy.body).toContain('every dial rolled');
    // The sizes come from the shared derivation, so the two halves of the offer agree.
    expect(copy.body).toContain('thorpe, city, and metropolis');
    // anchored: copy.body was just proven to carry the derived sizes, so an unreplaced {sizes} would be a real leak in a real body.
    expect(copy.body, 'the sentence still carries an uninterpolated placeholder').not.toContain('{sizes}');
  });
});

describe('THE SURFACE — drawn and disabled, never hidden', () => {
  async function renderPanel(tier) {
    H.tier = tier;
    vi.doMock('../../src/store/index.js', () => {
      const state = {
        config: { ...DEFAULT_CONFIG },
        updateConfig: vi.fn(),
        canUseCustomContent: () => false,
        getCustomContentCount: () => 0,
        canCustomizePreGeneration: () => TIER_GATE[tier].preGenOptions,
        isTierAllowed: (size) => (size === 'random' || size === 'custom' ? true : allowedFor(tier, size)),
        lastSeed: null,
        generateSettlement: vi.fn(),
        setRandomSliderMode: vi.fn(),
      };
      const useStore = (selector) => selector(state);
      useStore.getState = () => state;
      useStore.subscribe = () => () => {};
      return { useStore };
    });
    const { default: Panel } = await import('../../src/components/generate/LayeredConfigurationPanel.jsx');
    return render(<Panel mode="basic" showPlaceInRegion={false} />);
  }

  afterEach(() => { vi.resetModules(); vi.doUnmock('../../src/store/index.js'); });

  test('anonymous: the reason is shown, the options are drawn, and every control is disabled', async () => {
    const { container } = await renderPanel('anon');
    expect(screen.getByTestId('pre-gen-locked-notice'), 'the reason is not on the page').toBeTruthy();
    const fieldset = container.querySelector('fieldset[data-testid="pre-gen-options"]');
    expect(fieldset, 'the options are not wrapped in the one fieldset').toBeTruthy();
    expect(fieldset.disabled).toBe(true);
    // ⛔ NOTHING IS HIDDEN. The controls are PRESENT — that is the owner's law, and it is
    // also the anchor: "every control is disabled" over an empty panel proves nothing.
    const controls = [...fieldset.querySelectorAll('input, select, textarea, button')];
    expect(controls.length, 'the panel drew no controls at all').toBeGreaterThanOrEqual(4);
    // A disabled fieldset disables its descendants by the HTML rule, which is why the
    // gate is one wrapper rather than a prop somebody must remember on each control.
    for (const el of controls) {
      expect(el.closest('fieldset[disabled]'), `${el.tagName} escaped the locked fieldset`).toBe(fieldset);
    }
  });

  test('a free account: no reason, no lock, the same controls', async () => {
    const { container } = await renderPanel('free');
    const fieldset = container.querySelector('fieldset[data-testid="pre-gen-options"]');
    expect(fieldset.disabled).toBe(false);
    expect([...fieldset.querySelectorAll('input, select, textarea, button')].length).toBeGreaterThanOrEqual(4);
    // anchored: the controls above are asserted present on this same render.
    expect(screen.queryByTestId('pre-gen-locked-notice')).toBeNull();
  });

  test('the size picker draws EVERY rung and locks the ones this account cannot forge', async () => {
    const { container } = await renderPanel('anon');
    const sizeSelect = [...container.querySelectorAll('select')]
      .find((el) => [...el.options].some((o) => o.value === 'hamlet'));
    expect(sizeSelect, 'the size picker is gone').toBeTruthy();
    const byValue = Object.fromEntries([...sizeSelect.options].map((o) => [o.value, o]));
    // Every rung is DRAWN — nothing is hidden.
    for (const size of SIZE_LADDER) expect(byValue[size], `the picker dropped ${size}`).toBeTruthy();
    // …and exactly the out-of-range ones are locked, thorpe among them.
    const locked = SIZE_LADDER.filter((size) => byValue[size].disabled);
    expect(locked).toEqual(SIZE_LADDER.filter((size) => !allowedFor('anon', size)));
    expect(locked).toContain('thorp');
    expect(byValue.thorp.textContent).toMatch(/sign in/i);
    // The two sentinels stay open for everyone; the post-resolution re-gate catches a
    // roll that lands out of range.
    expect(byValue.random.disabled).toBe(false);
    expect(byValue.custom.disabled).toBe(false);
  });
});

describe('THE LANE — what an anonymous forge actually generates', () => {
  test('the anonymous config is the defaults with only the reader\'s size on top', () => {
    // The relation the guard implements, asserted as a relation so a dial added tomorrow
    // is covered without an edit here.
    const stored = {
      ...DEFAULT_CONFIG,
      settType: 'village',
      customName: 'Spitzplatz',
      culture: 'imperial',
      priorityMagic: 100,
      magicExists: false,
      selectedStressesRandom: false,
      selectedStresses: ['famine'],
    };
    const forced = { ...DEFAULT_CONFIG, settType: stored.settType };
    expect(forced.settType, 'the reader keeps their size').toBe('village');
    for (const key of Object.keys(DEFAULT_CONFIG)) {
      if (key === 'settType') continue;
      expect(forced[key], `${key} did not roll back to its random default`).toEqual(DEFAULT_CONFIG[key]);
    }
    // …and the stored config is UNTOUCHED: a reader who signs in gets their dials back.
    expect(stored.customName).toBe('Spitzplatz');
    // DEFAULT_CONFIG really is "everything on random" — the claim the guard rests on.
    expect(DEFAULT_CONFIG.settType).toBe('random');
    expect(DEFAULT_CONFIG.tradeRouteAccess).toBe('random_trade');
    expect(DEFAULT_CONFIG.culture).toBe('random_culture');
    expect(DEFAULT_CONFIG.monsterThreat).toBe('random_threat');
    expect(DEFAULT_CONFIG.nearbyResourcesRandom).toBe(true);
    expect(DEFAULT_CONFIG.selectedStressesRandom).toBe(true);
    expect(DEFAULT_CONFIG.customName).toBe('');
  });

  test('the generation lane forces it there, and exempts the curated sample fork', async () => {
    const { readFileSync } = await import('node:fs');
    const src = readFileSync('src/store/settlementGenerateAction.js', 'utf8');
    // The guard reads the store's selector rather than re-deriving the rule…
    expect(src).toMatch(/canCustomizePreGeneration/);
    // …builds the effective config from the defaults…
    expect(src).toMatch(/\.\.\.DEFAULT_CONFIG,\s*settType:/);
    // …empties the four constraint bags…
    for (const bag of ['institutionToggles', 'categoryToggles', 'goodsToggles', 'servicesToggles']) {
      expect(src, `${bag} is not neutralised for an anonymous forge`)
        .toMatch(new RegExp(`const ${bag} = canCustomize \\? stored`));
    }
    // …and leaves a CURATED SAMPLE FORK alone, which would otherwise have been handed a
    // random town under a curated town's name.
    expect(src).toMatch(/canCustomize = isSampleFork \|\|/);
  });
});
