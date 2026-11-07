/**
 * plotHookTruthGate.test.js — THE PLOT HOOKS CHECK THE PLACE BEFORE THEY SPEAK.
 *
 * The defect, measured on this lane's 120-settlement corpus (twenty per tier, seeds
 * `hooks-lane-2026-11-03-<tier>-<i>`) before the cure:
 *   - 36 of 120 settlements read "The settlement is starving. Villagers are turning to
 *     banditry…" while the engine's own food analysis calls them Import-Dependent with
 *     1.9 months of grain in store;
 *   - 5 of 5 "N days of food left / reserves" hooks printed the harvest share × 30 (a
 *     metropolis with 15 months in store read "12 days");
 *   - 4 hooks named "their soldiers" where no garrison, militia or mercenary existed;
 *   - 21 hooks called the residents of a town, city or metropolis "villagers";
 *   - 4 of 60 small places read "the town's leaders".
 *
 * Every case below is built from a hand-made record rather than from the generator, so a
 * change in generation cannot make one of these assertions vacuous: the hook is PLANTED
 * and the fact it lies about is written beside it in the same literal.
 */
import { describe, expect, test } from 'vitest';

import { HOOK_LINE_POOLS } from '../../../src/domain/dossier/hookLines.js';
import { FOOD_SECURITY_BANDS } from '../../../src/data/bandLadders.js';
import { collectPlotHooks } from '../../../src/domain/dossier/plotHooks.js';
import { textOf } from '../../../src/domain/facts/textOf.js';

/**
 * One settlement record carrying exactly the facts a hook could lie about.
 * @param {{ tier?: string, band?: string, months?: number, hooks?: string[],
 *   roster?: Record<string, Array<{ name: string }>>, institutions?: Array<{ name: string }>,
 *   magicExists?: boolean }} spec
 */
function record(spec) {
  return {
    name: 'Testholm',
    tier: spec.tier || 'town',
    economicState: {
      foodSecurity: {
        label: spec.band || 'Secure',
        storageMonths: spec.months === undefined ? 15 : spec.months,
              },
    },
    defenseProfile: { institutions: spec.roster || {} },
    institutions: spec.institutions || [],
    // The magic axis as the generator writes it: a settlement carries the dial, and
    // `magicLedger` reads a config with no dial at all as "no magic axis present" — which is
    // why the dial is here and not just the switch (src/domain/magicLedger.js :: magicLedger).
    config: spec.magicExists === undefined
      ? {}
      : { magicExists: spec.magicExists, priorityMagic: spec.magicExists ? 60 : 0 },
    economicViability: {
      plotHooks: (spec.hooks || []).map((hook) => ({ category: 'Survival Crisis', hook, severity: 'critical' })),
    },
  };
}

const STARVING = 'The settlement is starving. Villagers are turning to banditry, and a merchant has offered to supply food at a price the settlement cannot pay in coin.';

describe('the plot hooks check the place before they speak — food', () => {
  test('a fed place does not read as starving', () => {
    const fed = collectPlotHooks(record({ band: 'Secure', months: 15, hooks: [STARVING] }));
    // The marker is read ONLY on the assertion's own line or the one directly above it.
    // anchored: the same text IS collected on the famine record below — never a dead collector.
    expect(fed.map((h) => h.text)).not.toContain(STARVING);
    // A VILLAGE for the famine arm, deliberately: the writer's sentence calls the residents
    // "villagers", which is true of a village and false of the town above — the measured
    // 21-hook defect. One record may not prove both halves of two different rulings.
    const famine = collectPlotHooks(record({ tier: 'village', band: FOOD_SECURITY_BANDS.famine.label, months: 0.5, hooks: [STARVING] }));
    expect(famine.some((h) => /starving/i.test(h.text))).toBe(true);
  });

  test('the measured case: Import-Dependent with 1.9 months in store is not starving', () => {
    const hooks = collectPlotHooks(record({ tier: 'thorp', band: 'Import-Dependent', months: 1.9, hooks: [STARVING] }));
    expect(hooks.filter((h) => /\bstarving\b|\bbanditry\b/i.test(h.text))).toHaveLength(0);
  });

  test('the chair\'s case: a very large place one per cent short with months in store never reads starving', () => {
    // A metropolis 1,000 lb short out of 100,000 lb needed, holding 15 months of grain —
    // the trace's own example (deriveSupplyRiskAnalysis returns the starving hook for it).
    // One per cent short is the Secure band, and Secure licenses no famine sentence at all.
    const hooks = collectPlotHooks(record({ tier: 'metropolis', band: 'Secure', months: 15, hooks: [STARVING] }));
    expect(hooks.filter((h) => /\bstarving\b|\bbanditry\b/i.test(h.text))).toHaveLength(0);
    // …and because the place is FED, it gets no replacement food hook either.
    expect(hooks.filter((h) => h.category === 'economics')).toHaveLength(0);
  });

  test('a Deficit band with fifteen months of grain is not starving either', () => {
    const hooks = collectPlotHooks(record({ tier: 'metropolis', band: 'Deficit', months: 15, hooks: [STARVING] }));
    expect(hooks.filter((h) => /\bstarving\b/i.test(h.text))).toHaveLength(0);
  });

  test('a real gap still gets a food hook, and it is about the price of grain', () => {
    const hooks = collectPlotHooks(record({ tier: 'town', band: 'Import-Dependent', months: 1.9, hooks: [STARVING] }));
    const food = hooks.filter((h) => h.category === 'economics');
    expect(food).toHaveLength(1);
    expect(food[0].text).not.toMatch(/starving|banditry/i); // anchored: `food` has exactly one member by the assertion above
    expect(HOOK_LINE_POOLS.foodGap.map(textOf)).toContain(food[0].text); // CENSUS-2c: a declared row reads through textOf
  });

  test('"N days of reserves" prints the stored months, converted', () => {
    const hooks = collectPlotHooks(record({
      tier: 'metropolis',
      band: 'Deficit',
      months: 15,
      hooks: ['An enemy fleet blockades the port. The settlement has 12 days of reserves, and nothing enters or leaves until that changes.'],
    }));
    const line = hooks.find((h) => /days of reserves/i.test(h.text));
    expect(line).toBeTruthy();
    expect(line?.text).toContain('450 days of reserves');
  });
});

describe('the plot hooks check the place before they speak — the thing must exist', () => {
  const SOLDIERS = "Someone is paying their soldiers more than their salary. The soldiers aren't saying who.";

  test('no soldiers where the defence roster holds no force', () => {
    const none = collectPlotHooks(record({ tier: 'village', roster: { walls: [], garrison: [], militia: [] }, hooks: [SOLDIERS] }));
    // anchored: the garrisoned record below collects the same sentence.
    expect(none.map((h) => h.text)).not.toContain(SOLDIERS);
    const garrisoned = collectPlotHooks(record({
      // the force stands on the LIVE roster, which `defenseFactsOf` reads (lane WIRING-2);
      // the birth snapshot only says the record carries a defence roster at all.
      tier: 'town', roster: { garrison: [{ name: 'Barracks' }] }, institutions: [{ name: 'Barracks' }], hooks: [SOLDIERS],
    }));
    expect(garrisoned.map((h) => h.text)).toContain(SOLDIERS);
  });

  test('no hospital where there is no hospital', () => {
    const HOSPITAL = 'The hospital has been turning away patients who can pay, and nobody will say on whose orders.';
    const without = collectPlotHooks(record({ tier: 'city', hooks: [HOSPITAL] }));
    // anchored: the same sentence is collected on the record that holds a hospital.
    expect(without.map((h) => h.text)).not.toContain(HOSPITAL);
    const with_ = collectPlotHooks(record({ tier: 'city', institutions: [{ name: 'Hospital' }], hooks: [HOSPITAL] }));
    expect(with_.map((h) => h.text)).toContain(HOSPITAL);
  });

  test('no magic words on a world where magic does not work', () => {
    const SPELL = 'A spell laid on the granary door has started to fail, and the miller will not say who laid it.';
    const off = collectPlotHooks(record({ tier: 'town', magicExists: false, hooks: [SPELL] }));
    // anchored: the magic-on record collects the same sentence.
    expect(off.map((h) => h.text)).not.toContain(SPELL);
    const on = collectPlotHooks(record({ tier: 'town', magicExists: true, hooks: [SPELL] }));
    expect(on.map((h) => h.text)).toContain(SPELL);
  });
});

describe('a hook never says town for a place that is not one', () => {
  test('a thorp reads its own noun', () => {
    const hooks = collectPlotHooks(record({
      tier: 'thorp',
      hooks: ["The condemned doctrine is quietly practised still, by more of the town's leaders than would admit it"],
    }));
    const line = hooks.find((h) => /doctrine/.test(h.text));
    expect(line?.text).toContain("the thorp's leaders");
  });

  test('a town keeps its own noun', () => {
    const hooks = collectPlotHooks(record({
      tier: 'town',
      hooks: ["The condemned doctrine is quietly practised still, by more of the town's leaders than would admit it"],
    }));
    expect(hooks.find((h) => /doctrine/.test(h.text))?.text).toContain("the town's leaders");
  });

  test('"villagers" is for small places only', () => {
    const VILLAGERS = 'Villagers have started leaving offerings at a stone nobody remembers raising.';
    const city = collectPlotHooks(record({ tier: 'city', hooks: [VILLAGERS] }));
    // anchored: the village record collects the same sentence.
    expect(city.map((h) => h.text)).not.toContain(VILLAGERS);
    expect(collectPlotHooks(record({ tier: 'village', hooks: [VILLAGERS] })).map((h) => h.text)).toContain(VILLAGERS);
  });
});

describe('a record that carries none of the facts is left alone', () => {
  test('an unknown food band keeps its hook', () => {
    const bare = { name: 'Nowhere', economicViability: { plotHooks: [{ hook: STARVING }] } };
    expect(collectPlotHooks(bare).map((h) => h.text)).toContain(STARVING);
  });
});
