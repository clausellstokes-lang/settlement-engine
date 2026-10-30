/** @vitest-environment jsdom */
/**
 * anonPreGenLocked.test.jsx — AN ANONYMOUS FORGE IS A TOWN WITH EVERYTHING ELSE ON RANDOM.
 *
 * THE OWNER (§934.34): "only with everything on random"; and (2026-10-30): "if you don't
 * sign in the only option, you have is a town". The Founding Worlds sample forks are
 * exempt by the chair's ruling of the same day (curated showcases, not the size picker).
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
import { accountHolderPhrase, ANON_SIZES, SIZE_LADDER, signInUnlocksSizes } from '../../src/config/tierFacts.js';
import { SAMPLE_SETTLEMENTS, forkConfigFor } from '../../src/data/sampleSettlements.js';
import { refusalCopy } from '../../src/components/primitives/RefusalNotice.jsx';
import { REFUSAL_REASONS } from '../../src/lib/refusalReasons.js';
import { GENERATION_INTENT_SAMPLE_FORK } from '../../src/lib/generationIntent.js';

/** The gate's own predicate, driven without the store: rank in [minTier, maxTier]. */
const RANK = { thorp: 0, hamlet: 1, village: 2, town: 3, city: 4, capital: 5, metropolis: 5 };
const allowedFor = (tier, size) => RANK[size] >= RANK[TIER_GATE[tier].minTier]
  && RANK[size] <= RANK[TIER_GATE[tier].maxTier];

afterEach(() => { cleanup(); });
beforeEach(() => { H.tier = 'anon'; H.mobile = false; });

describe('THE GATE — one range, one capability flag', () => {
  test('an anonymous visitor reaches exactly a town (the owner, 2026-10-30)', () => {
    const reachable = SIZE_LADDER.filter((size) => allowedFor('anon', size));
    expect(reachable).toEqual([...ANON_SIZES]);
    expect(reachable).toEqual(['town']);
    // anchored: town is asserted present in the same derivation, so a gate that admitted
    // nothing at all reds there first.
    expect(allowedFor('anon', 'thorp'), 'a thorpe requires an account (§934.34)').toBe(false);
    expect(allowedFor('anon', 'hamlet')).toBe(false);
    expect(allowedFor('anon', 'village')).toBe(false);
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
    expect(copy.body).toContain(signInUnlocksSizes());
    expect(copy.body).toContain('thorpe, hamlet, village, city, and metropolis');
    // …and it no longer offers an anonymous visitor a size choice they do not have.
    expect(copy.body, 'the locked notice still says the visitor chooses the size').not.toMatch(/choose the size/i);
    expect(copy.body).toMatch(/\btown\b/i);
    // anchored: copy.body was just proven to carry the derived sizes, so an unreplaced {sizes} would be a real leak in a real body.
    expect(copy.body, 'the sentence still carries an uninterpolated placeholder').not.toContain('{sizes}');
  });
});

describe('THE SURFACE — drawn and disabled, never hidden', () => {
  async function renderPanel(tier, configOverride = {}) {
    H.tier = tier;
    vi.doMock('../../src/store/index.js', () => {
      const state = {
        config: { ...DEFAULT_CONFIG, ...configOverride },
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

  // ⛔ AN ANONYMOUS FORGE IS A TOWN (the owner, 2026-10-30: "if you don't sign in the only
  // option, you have is a town"). The picker used to draw every rung and lock the ones out
  // of range; the anonymous panel now shows ONE fixed size where the picker was, and no
  // custom-population field however the stored config reads.
  test('anonymous: the size is a fixed Town, with no picker and no custom population', async () => {
    const { container } = await renderPanel('anon', { settType: 'custom', population: 90000 });
    const fixed = container.querySelector('[data-anon-size]');
    expect(fixed, 'the fixed Town is not where the picker was').toBeTruthy();
    expect(fixed.getAttribute('data-anon-size')).toBe('town');
    expect(fixed.textContent).toMatch(/^Town\b/);
    // anchored: the fixed Town is proven on this render above, so these absences are real.
    const sizeSelect = [...container.querySelectorAll('select')]
      .find((el) => [...el.options].some((o) => o.value === 'hamlet'));
    expect(sizeSelect, 'an anonymous visitor still meets a size picker').toBeUndefined();
    expect(container.querySelector('input[aria-label="Custom Population"]'), 'the custom population field leaked').toBeNull();
  });

  test('a free account: the picker draws every rung, all of them open', async () => {
    const { container } = await renderPanel('free');
    const sizeSelect = [...container.querySelectorAll('select')]
      .find((el) => [...el.options].some((o) => o.value === 'hamlet'));
    expect(sizeSelect, 'the size picker is gone for an account').toBeTruthy();
    const byValue = Object.fromEntries([...sizeSelect.options].map((o) => [o.value, o]));
    for (const size of SIZE_LADDER) {
      expect(byValue[size], `the picker dropped ${size}`).toBeTruthy();
      expect(byValue[size].disabled, `${size} is locked for an account`).toBe(false);
    }
    expect(byValue.random.disabled).toBe(false);
    expect(byValue.custom.disabled).toBe(false);
    // anchored: the picker is proven present on this render above.
    expect(container.querySelector('[data-anon-size]'), 'an account was shown the fixed Town').toBeNull();
  });
});

describe('THE LANE — what an anonymous forge actually generates', () => {
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

  async function runLane(store, options = undefined) {
    const { generateSettlementAction } = await import('../../src/store/settlementGenerateAction.js');
    engine.lastRequest = null;
    // Each arm is one forge on a fresh day: the anonymous daily cap is not under test here.
    window.localStorage.clear();
    try {
      return await generateSettlementAction(store.set, store.get, undefined, options);
    } catch {
      return null;
    }
  }

  /** The config the lane actually handed the engine on the last run. */
  const sent = () => engine.lastRequest?.payload?.fullConfig ?? null;

  test('the anonymous config is the defaults with Town on top, whatever the stored dials say', async () => {
    const store = laneStore('anon', 'village');
    store.state.config = {
      ...DEFAULT_CONFIG,
      settType: 'village',
      customName: 'Spitzplatz',
      culture: 'imperial',
      priorityMagic: 100,
      magicExists: false,
      selectedStressesRandom: false,
      selectedStresses: ['famine'],
    };
    await runLane(store);
    const forged = sent();
    expect(forged, 'the engine was never reached').toBeTruthy();
    expect(forged.settType, 'an anonymous forge took the stored size').toBe('town');
    for (const key of Object.keys(DEFAULT_CONFIG)) {
      if (key === 'settType') continue;
      expect(forged[key], `${key} did not roll back to its random default`).toEqual(DEFAULT_CONFIG[key]);
    }
    // …and the stored config is UNTOUCHED: a reader who signs in gets their dials back.
    expect(store.state.config.customName).toBe('Spitzplatz');
    expect(store.state.config.settType).toBe('village');
    // DEFAULT_CONFIG really is "everything on random" — the claim the guard rests on.
    expect(DEFAULT_CONFIG.settType).toBe('random');
    expect(DEFAULT_CONFIG.tradeRouteAccess).toBe('random_trade');
    expect(DEFAULT_CONFIG.culture).toBe('random_culture');
    expect(DEFAULT_CONFIG.monsterThreat).toBe('random_threat');
    expect(DEFAULT_CONFIG.nearbyResourcesRandom).toBe(true);
    expect(DEFAULT_CONFIG.selectedStressesRandom).toBe(true);
    expect(DEFAULT_CONFIG.customName).toBe('');
  });

  test('a hand-edited metropolis config forges a Town for an anonymous visitor', async () => {
    const store = laneStore('anon', 'metropolis');
    const forged = await runLane(store);
    expect(forged, 'the anonymous forge was refused instead of clamped').toBeTruthy();
    expect(sent().settType).toBe('town');
    expect(store.state.lastRefusal).toBeNull();
  });

  test('every stored size, sentinels included, reaches the engine as a Town', async () => {
    for (const settType of ['thorp', 'hamlet', 'village', 'city', 'metropolis', 'random', 'custom']) {
      const store = laneStore('anon', settType);
      await runLane(store);
      expect(sent()?.settType, `an anonymous ${settType} config was not clamped`).toBe('town');
      expect(store.state.lastRefusal, `an anonymous ${settType} config was refused`).toBeNull();
    }
  });

  test('a free account keeps the size it asked for', async () => {
    const store = laneStore('free', 'metropolis');
    await runLane(store);
    expect(sent()?.settType).toBe('metropolis');
  });

  // ⛔ THE FOUNDING WORLDS ARE EXEMPT (chair ruling, 2026-10-30): a curated fixed-seed
  // sample is a showcase, not the forge's size selector, so a signed-out visitor forks it
  // at the card's own tier. The exemption is read off the call's INTENT, never off the
  // persisted `_forkedFromSample` stamp, which outlives the fork that wrote it.
  test('a sample fork carrying _forkedFromSample is forged at the sample\'s own tier', async () => {
    const store = laneStore('anon', 'village');
    store.state.config = { ...DEFAULT_CONFIG, settType: 'village', culture: 'celtic', _forkedFromSample: 'cnocby' };
    await runLane(store, { intent: GENERATION_INTENT_SAMPLE_FORK });
    expect(sent()?.settType, 'the curated village was clamped to a Town').toBe('village');
    expect(sent()?.culture, 'the curated dials were rolled').toBe('celtic');
  });

  // ⛔ THE FLOOR IS BYPASSED BY A CURATED FORK, NEVER THE CEILING (chair ruling,
  // 2026-10-30). The anonymous range is now Town alone, so a gate that judged a fork by
  // the floor would refuse Cnocby; a fork at or under the ceiling forges at its own tier,
  // and Black Crag (a city, over the ceiling) still refuses with the sign-in door.
  test('the three Founding Worlds, forked anonymously: Cnocby a village, Mossgate a town, Black Crag refused', async () => {
    const byTier = Object.fromEntries(SAMPLE_SETTLEMENTS.map((sample) => [sample.tier, sample]));
    expect(Object.keys(byTier).sort(), 'the Founding Worlds fixture moved').toEqual(['city', 'town', 'village']);
    for (const tier of ['village', 'town']) {
      const sample = byTier[tier];
      const store = laneStore('anon', tier);
      store.state.config = { ...DEFAULT_CONFIG, ...forkConfigFor(sample), _forkedFromSample: sample.id };
      const forged = await runLane(store, { intent: GENERATION_INTENT_SAMPLE_FORK });
      expect(forged, `${sample.name} was refused for an anonymous visitor`).toBeTruthy();
      expect(store.state.lastRefusal).toBeNull();
      expect(sent()?.settType, `${sample.name} was not forged at its own tier`).toBe(tier);
    }
    const crag = byTier.city;
    const store = laneStore('anon', 'city');
    store.state.config = { ...DEFAULT_CONFIG, ...forkConfigFor(crag), _forkedFromSample: crag.id };
    expect(await runLane(store, { intent: GENERATION_INTENT_SAMPLE_FORK })).toBeNull();
    expect(store.state.lastRefusal.reason).toBe(REFUSAL_REASONS.TIER);
    expect(refusalCopy(store.state.lastRefusal.reason, store.state.lastRefusal.vars).body).toMatch(/sign in/i);
  });

  test('a free-form anonymous village is still a Town, floor or no floor', async () => {
    const store = laneStore('anon', 'village');
    expect(await runLane(store), 'the free-form village was refused').toBeTruthy();
    expect(sent()?.settType).toBe('town');
    expect(store.state.lastRefusal).toBeNull();
  });

  test('a stale _forkedFromSample stamp without the fork intent is still clamped', async () => {
    const store = laneStore('anon', 'village');
    store.state.config = { ...DEFAULT_CONFIG, settType: 'village', _forkedFromSample: 'cnocby' };
    await runLane(store);
    expect(sent()?.settType, 'a persisted fork stamp reopened the size picker').toBe('town');
  });

  test('the Black Crag city fork is still refused by the CEILING, in the ceiling\'s sentence', async () => {
    // The tier gate still binds a fork (§934.24(b)); the town clamp does not reach it.
    const store = laneStore('anon', 'city');
    store.state.config = { ...DEFAULT_CONFIG, settType: 'city', _forkedFromSample: 'black-crag' };
    expect(await runLane(store, { intent: GENERATION_INTENT_SAMPLE_FORK })).toBeNull();
    expect(store.state.lastRefusal.reason).toBe(REFUSAL_REASONS.TIER);
    const said = refusalCopy(store.state.lastRefusal.reason, store.state.lastRefusal.vars).body;
    // ⛔ AND IT NAMES WHOSE FORGE IT IS TALKING ABOUT (REVIEW-P F13, 2026-09-20). The phrase
    // is DERIVED from the same single home the gate reads (config/tierFacts.js).
    expect(store.state.lastRefusal.vars.holder).toBe(accountHolderPhrase('anon'));
    expect(said).toContain(`A City is past what ${accountHolderPhrase('anon')} forges`);
    expect(said).toContain('it reaches up to a Town');
    // anchored: the two lines above prove `said` is the resolved ceiling sentence, so the absence below is real.
    expect(said).not.toContain(accountHolderPhrase('free'));
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
    expect(sent.settType, 'an unaskable store was granted the size picker').toBe('town');
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
