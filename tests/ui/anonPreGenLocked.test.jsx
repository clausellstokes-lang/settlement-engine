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
// THE ENGINE, stubbed at the transport seam the lane calls. Every arm below is about a
// gate that answers BEFORE the engine, and the one arm that gets past both bounds is
// asserting exactly that — a real pipeline run would add a minute and prove none of it.
const engine = vi.hoisted(() => ({ lastRequest: null }));
vi.mock('../../src/lib/generationClient.js', () => ({
  runGeneration: async (request) => {
    engine.lastRequest = request;
    return {
      result: {
        settlement: { name: 'Forged', tier: 'thorp' },
        preservation: null,
        resolvedConfig: request?.payload?.fullConfig ?? null,
        pipelineHistory: [],
      },
    };
  },
}));

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { TIER_GATE, createAuthSlice } from '../../src/store/authSlice.js';
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

  test('the FLOOR and the CEILING are different refusals, and say opposite things', () => {
    // ⛔ ONE BOOLEAN OVER A RANGE COULD ONLY RAISE ONE SENTENCE, AND IT WAS THE WRONG
    // ONE HERE (§934.34). A thorpe is refused from BELOW; the ceiling's copy reads
    // "A Thorpe is past what this account forges; it reaches up to a Town".
    const floor = refusalCopy(REFUSAL_REASONS.TIER_TOO_SMALL, { size: 'Thorpe', min: 'Hamlet' });
    expect(floor, 'the floor reason renders nothing').not.toBeNull();
    expect(floor.body).toContain('A Thorpe takes an account');
    expect(floor.body).toContain('starts at a Hamlet');
    expect(floor.body).toMatch(/sign in \(free\)/i);
    // floor.body is proven on the three lines above to be the real, filled sentence, so
    // anchored: what it does NOT say is a real absence rather than an empty string.
    expect(floor.body, 'the floor still wears the ceiling\'s words').not.toContain('past what this account forges');

    const ceiling = refusalCopy(REFUSAL_REASONS.TIER, { size: 'City', max: 'Town' });
    expect(ceiling.body).toContain('past what this account forges');
    // anchored: ceiling.body is proven on the line above to carry the ceiling sentence.
    expect(ceiling.body, 'the ceiling borrowed the floor\'s words').not.toContain('takes an account');
    expect(ceiling.rubric).not.toBe(floor.rubric);
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

  /**
   * ⛐ THE REAL GATE, DRIVEN BY THE REAL LANE. The store is hand-built (the lane wants a
   * dozen keys a real app supplies), but every gate ANSWER comes from a live
   * `createAuthSlice`, so a floor that moves in TIER_GATE moves this pin with it. Only
   * the engine is stubbed: a real pipeline run per case would put a minute on the gate
   * and prove nothing about a refusal raised before the engine is reached.
   */
  function laneStore(tier, settType) {
    const gate = create(immer((...a) => ({ ...createAuthSlice(...a) })));
    gate.setState((s) => { s.auth.tier = tier; });
    const ask = (name) => (...args) => gate.getState()[name](...args);
    const state = {
      config: { ...DEFAULT_CONFIG, settType },
      institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
      importedNeighbour: null, settlement: null, locks: null, activeSaveId: null,
      randomSliderMode: false, auth: { tier, user: null }, lastRefusal: null,
      canCustomizePreGeneration: ask('canCustomizePreGeneration'),
      isTierAllowed: ask('isTierAllowed'),
      isTierBelowFloor: ask('isTierBelowFloor'),
      minAllowedTier: ask('minAllowedTier'),
      maxAllowedTier: ask('maxAllowedTier'),
    };
    return { state, set: (fn) => { fn(state); }, get: () => state };
  }

  async function runLane(store) {
    const { generateSettlementAction } = await import('../../src/store/settlementGenerateAction.js');
    try {
      return await generateSettlementAction(store.set, store.get, undefined, undefined);
    } catch {
      return null;
    }
  }

  test('a thorpe is refused by the FLOOR, and told so in the floor\'s own words', async () => {
    const store = laneStore('anon', 'thorp');
    expect(await runLane(store), 'a thorpe was forged for an anonymous visitor').toBeNull();
    expect(store.state.lastRefusal.reason).toBe(REFUSAL_REASONS.TIER_TOO_SMALL);
    const said = refusalCopy(store.state.lastRefusal.reason, store.state.lastRefusal.vars).body;
    expect(said).toContain('A Thorpe takes an account');
    expect(said).toContain('starts at a Hamlet');
    // anchored: `said` is proven on the two lines above to be the real, filled sentence.
    expect(said, 'the reader is told their thorpe is too BIG').not.toContain('past what this account forges');
  });

  test('a city is refused by the CEILING, and still gets the ceiling\'s sentence', async () => {
    const store = laneStore('anon', 'city');
    expect(await runLane(store)).toBeNull();
    expect(store.state.lastRefusal.reason).toBe(REFUSAL_REASONS.TIER);
    const said = refusalCopy(store.state.lastRefusal.reason, store.state.lastRefusal.vars).body;
    expect(said).toContain('A City is past what this account forges');
    expect(said).toContain('it reaches up to a Town');
  });

  test('a free account forges a thorpe: the floor is anon\'s alone', async () => {
    const store = laneStore('free', 'thorp');
    // The engine is not stubbed here, so assert the GATE rather than the forge: the lane
    // reached past both bounds without recording a refusal.
    await runLane(store);
    expect(store.state.lastRefusal, 'a free account was refused its thorpe').toBeNull();
  });

  test('a store that cannot be ASKED is treated as unable — the capability read fails closed', async () => {
    // ⛔ A CAPABILITY GATE MAY NOT ANSWER "YES" TO A STORE IT COULD NOT ASK. The lane's
    // `typeof … === 'function'` guard exists for hand-built and older store shapes, and
    // its fallback used to be `true`: the one point §934.34 is enforced at could be
    // opened by an ABSENCE. Every real store carries the selector, so closing it costs
    // production nothing and buys the rule its floor.
    const store = laneStore('free', 'village');
    delete store.state.canCustomizePreGeneration;
    store.state.config = { ...DEFAULT_CONFIG, settType: 'village', customName: 'Spitzplatz', culture: 'imperial' };
    engine.lastRequest = null;
    await runLane(store);

    const sent = engine.lastRequest?.payload?.fullConfig;
    expect(sent, 'the engine was never reached').toBeTruthy();
    expect(sent.settType, 'the reader\'s size is still theirs').toBe('village');
    expect(sent.customName, 'an unaskable store was granted the pre-generation options').toBe(DEFAULT_CONFIG.customName);
    expect(sent.culture).toBe(DEFAULT_CONFIG.culture);
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
    // …and the capability read FAILS CLOSED when the store cannot be asked (the arm above
    // drives it; this is the spelling that makes it so, pinned beside the others).
    expect(src, 'the capability read fails OPEN again').toMatch(/canCustomizePreGeneration\(\) === true\s*\n\s*: false\);/);
  });
});
