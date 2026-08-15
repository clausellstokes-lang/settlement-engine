/**
 * Arrival-scene grounding — regression for the cross-wired arrival tables
 * (Wave 6 #1, GENERATION_COHERENCE_AUDIT high).
 *
 * ARRIVAL_SCENES is keyed by SCENE (market/port/river/smoke/guild/ordinary) but was
 * indexed by the raw trade ROUTE — only 'river' ever hit; every other
 * settlement opened on the bare '… comes into view.' fallback. ARRIVAL_ADDONS
 * is keyed by ROUTE but was indexed by economicState.tradeCommodity — a field
 * nothing writes on economicState — so addons never fired at all.
 * generateArrivalScene now routes through ROUTE_TO_SCENE and indexes the
 * addons by route.
 *
 * Also pins generateSiegeCapability: currentTensions is an ARRAY of tension
 * objects; interpolating it raw printed '[object Object]' and the
 * `|| fallback` never fired because an empty array is truthy.
 */

import { afterEach, beforeEach, describe, test, expect } from 'vitest';
import {
  generateArrivalScene,
  generateSettlementReason,
  generateSiegeCapability,
  ROUTE_TO_SCENE,
} from '../../src/generators/narrativeGenerator.js';
import { ARRIVAL_SCENES, ARRIVAL_ADDONS } from '../../src/data/narrativeData.js';
import { CULTURE_PROFILES } from '../../src/data/cultureProfiles.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

// generateArrivalScene draws through the ambient rngContext, which now fails
// CLOSED (throws) with no active seeded RNG — so seed one per test. The
// assertions below stay pool-wide (they accept ANY template of the mapped
// pool), so they are independent of which draw the seed produces.
beforeEach(() => setActiveRng(createPRNG('narrative-arrival-test')));
afterEach(() => clearActiveRng());

// The full route vocabulary the config UI / resolveConfig can produce.
const ROUTES = ['road', 'river', 'port', 'crossroads', 'isolated', 'mountain_pass'];

const settlementFor = (route) => ({
  name: 'Testford',
  tier: 'town',
  config: { tradeRouteAccess: route, culture: 'germanic', priorityMagic: 0 },
  institutions: [],
  stress: null,
});

// Render every template of a pool so the assertion is independent of which
// one the (seeded) picker chose.
const renderPool = (pool, name, tier) =>
  (pool || []).map(t => (typeof t === 'function' ? t(name, tier) : t));

describe('arrival scene resolves for every route value (no bare fallback)', () => {
  test.each(ROUTES)('route %s opens on a real scene from its mapped pool', (route) => {
    const scene = generateArrivalScene(settlementFor(route));
    expect(typeof scene).toBe('string');

    const sceneKey = ROUTE_TO_SCENE[route] || 'ordinary';
    const candidates = renderPool(ARRIVAL_SCENES[sceneKey], 'Testford', 'town');
    expect(candidates.length).toBeGreaterThan(0);
    expect(
      candidates.some(c => scene.startsWith(c)),
      `route '${route}' must open on an ARRIVAL_SCENES['${sceneKey}'] template, got: ${scene}`,
    ).toBe(true);
    expect(scene.startsWith('Testford comes into view.')).toBe(false);
  });

  test('unknown / legacy route values fall to the ordinary pool, not the bare line', () => {
    const scene = generateArrivalScene(settlementFor('caravanserai'));
    const candidates = renderPool(ARRIVAL_SCENES.ordinary, 'Testford', 'town');
    expect(candidates.some(c => scene.startsWith(c))).toBe(true);
  });

  test('stress vignettes still win over the route scene', () => {
    const s = { ...settlementFor('river'), stress: [{ type: 'famine' }] };
    const scene = generateArrivalScene(s);
    const riverOpenings = renderPool(ARRIVAL_SCENES.river, 'Testford', 'town');
    expect(riverOpenings.some(c => scene.startsWith(c))).toBe(false);
  });
});

describe('arrival addons fire keyed by route (tradeCommodity was never written)', () => {
  test.each(Object.keys(ARRIVAL_ADDONS))('route %s appends one of its addon templates', (route) => {
    const scene = generateArrivalScene(settlementFor(route));
    const addons = renderPool(ARRIVAL_ADDONS[route], 'Testford', 'town');
    expect(addons.length).toBeGreaterThan(0);
    expect(
      addons.some(a => scene.includes(a)),
      `route '${route}' must carry one of its ARRIVAL_ADDONS, got: ${scene}`,
    ).toBe(true);
  });

  test('a route with no addon pool (mountain_pass) stays addon-free without crashing', () => {
    expect(ARRIVAL_ADDONS.mountain_pass).toBeUndefined();
    expect(() => generateArrivalScene(settlementFor('mountain_pass'))).not.toThrow();
  });
});

describe('port and cultural arrival vocabulary remain semantically grounded', () => {
  test('port arrivals never inherit the inland-river scene vocabulary', () => {
    const inlandRiverTerms = /\b(?:river|upriver|downriver|riverbank|ford|willows?|mill wheel)\b/i;
    const maritimeTerms = /\b(?:harbou?r|sea|salt|masts?|gulls?|quays?|coast|port)\b/i;

    for (let i = 0; i < 32; i++) {
      setActiveRng(createPRNG(`port-not-river-${i}`));
      const scene = generateArrivalScene(settlementFor('port'));
      // The maritime assertion runs FIRST: it proves this seed produced real port prose,
      // so the river-vocabulary exclusion below cannot pass on a bare fallback line.
      expect(scene, `seed ${i} lacked maritime grounding`).toMatch(maritimeTerms);
      // anchored: the maritime-terms assertion above proves the scene is live port prose
      expect(scene, `seed ${i} used inland-river language`).not.toMatch(inlandRiverTerms);
    }
  });

  test('materialized cultural identity is the architectural source of truth', () => {
    const scene = generateArrivalScene({
      ...settlementFor('road'),
      culturalIdentity: {
        architecturalDetail: 'blue-glazed brick courts step down toward the civic square',
      },
    });
    expect(scene).toContain('blue-glazed brick courts step down toward the civic square');
  });

  test('legacy saves use the requested culture profile, never the Germanic fallback', () => {
    setActiveRng(createPRNG('legacy-east-asian-arrival'));
    const scene = generateArrivalScene({
      ...settlementFor('road'),
      config: {
        ...settlementFor('road').config,
        culture: 'east_asian',
      },
    });
    expect(
      CULTURE_PROFILES.east_asian.architecturalDetails.some(detail => scene.includes(detail)),
    ).toBe(true);
    expect(
      CULTURE_PROFILES.germanic.architecturalDetails.some(detail => scene.includes(detail)),
    ).toBe(false);
  });

  test('metropolis scale reads above an ordinary city', () => {
    setActiveRng(createPRNG('metropolis-scale'));
    const scene = generateArrivalScene({
      ...settlementFor('road'),
      tier: 'metropolis',
    });
    expect(scene).toContain("region's great urban centre");
    // The metropolis line REPLACES the city line; the metropolis phrase is the sibling
    // proving the scale sentence rendered at all.
    expectAbsentWithAnchor(
      scene,
      'It is a city in its own right',
      "region's great urban centre",
      'metropolis scale line supersedes the city line',
    );
  });

  test('a riverside port is described as an inland river port, never a seaport', () => {
    const [reason] = generateSettlementReason(
      'town',
      'port',
      null,
      { terrainType: 'riverside' },
    );
    expect(reason).toMatch(/\briver port\b/i);
    // anchored: the river-port assertion above proves `reason` is live founding prose
    expect(reason).not.toMatch(/\bcoastal\b|\bsea\b/i);

    setActiveRng(createPRNG('riverside-port-arrival'));
    const scene = generateArrivalScene({
      ...settlementFor('port'),
      config: {
        ...settlementFor('port').config,
        terrainType: 'riverside',
      },
    });
    expect(scene).toMatch(/\briver|barge|waterfront|quay|dock\b/i);
    // anchored: the river/wharf assertion above proves the scene is live riverside prose
    expect(scene).not.toMatch(/\bsea|coastal|gulls?\b/i);
  });
});

describe('generateSiegeCapability joins the tensions array honestly', () => {
  const recentEvents = [{ name: 'Sack of the Granary', type: 'political', yearsAgo: 5 }];

  test('uses the primary tension prose, never [object Object]', () => {
    const out = generateSiegeCapability(recentEvents, [
      { type: 'resource_scarcity', description: 'The supply of grain is under pressure' },
      { type: 'external_threat', description: 'Raiders probe the outlying farms' },
    ], 100);
    expect(out).toBe(
      'The Sack of the Granary is still present in living memory — The supply of grain is under pressure.',
    );
    // The toBe above pins `out` to an exact full string, so this exclusion cannot
    // survive the subject drifting away — it names the defect that string encodes.
    // anchored: `out` is pinned to an exact string by the toBe assertion above
    expect(out).not.toContain('[object Object]');
  });

  test('an EMPTY tensions array reaches the fallback clause (arrays are truthy)', () => {
    const out = generateSiegeCapability(recentEvents, [], 100);
    expect(out).toBe(
      'The Sack of the Granary is still present in living memory — its effects shape current decisions.',
    );
  });

  test('plain-string tensions (legacy) pass through the join', () => {
    const out = generateSiegeCapability(recentEvents, ['old debts to the crown'], 100);
    expect(out).toContain('— old debts to the crown.');
  });

  test('normalizes event articles and preserves existing terminal punctuation', () => {
    const out = generateSiegeCapability(
      [{
        name: 'The Succession Crisis',
        type: 'political',
        yearsAgo: 5,
      }],
      [{
        type: 'resource_scarcity',
        description: 'The supply of grain is under pressure.',
      }],
      100,
    );
    expect(out).toBe(
      'The Succession Crisis is still present in living memory — The supply of grain is under pressure.',
    );
    // The toBe above pins `out` to an exact full string, so this exclusion cannot
    // survive the subject drifting away — it names the defects that string encodes.
    // anchored: `out` is pinned to an exact string by the toBe assertion above
    expect(out).not.toMatch(/\bThe The\b|\.\.$/);
  });

  test('no recent events → array pass-through (caller nulls non-strings)', () => {
    const tensions = [{ type: 'resource_scarcity' }];
    expect(generateSiegeCapability([], tensions, 100)).toBe(tensions);
  });

  // BLOCKED ON OWNER (master merge W6 — golden-shifting, proven empirically):
  // master fixed the recent-event pick to read the TAIL of the oldest-first
  // timeline (the head-slice reads the founding era and usually filters to
  // nothing). Porting it SHIFTS the same-seed generator golden (byte-diff
  // observed on generatorGoldenMaster), so the fix joins the owner's
  // W3-continuation signed-regen cluster. The two tests pinning tail selection
  // ('finds the recent event at the TAIL…', 'picks the FRESHEST…') were removed
  // until that wave lands; the [object Object]/join guards above stay green.
});
