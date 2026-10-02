/**
 * tests/generators/arrivalScene.test.js — THE ARRIVAL SCENE AS A PLACE (the Voice Program wave 3).
 *
 * The owner, 2026-10-02: "if you read the introductory paragraph to settlement. It's always bland", "each variant
 * should insight something regarding either senses, culture, about the people, … trade dynamics, recent history or
 * events, the economic makeup", under the rule "pools that speak to what's in the dossier and simply not
 * contradicted". Pins src/data/arrivalProse.js (the pools) and src/generators/narrative/arrivalScene.js (the beats):
 *   - every line clears the voice bible's bars and claims no magic, sea power or excluded theme;
 *   - every pool's key is a real fact of its producer's vocabulary (cultures, history templates);
 *   - every beat is ANCHORED: drawn only where its fact is present, and never where the settlement lacks it;
 *   - the scene is deterministic on its stream, and real generated settlements clear the coherence receipt.
 */
import { afterEach, describe, expect, it } from 'vitest';

import {
  ARRIVAL_MEMORIES, ARRIVAL_PEOPLE, ARRIVAL_SENSES, ARRIVAL_TENSIONS,
} from '../../src/data/arrivalProse.js';
import { ARRIVAL_SCENES, STRESS_DESCS } from '../../src/data/narrativeData.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { nativeSemanticNames } from '../../src/domain/content/customContentSemanticAuthority.js';
import { HISTORICAL_EVENTS_DATA } from '../../src/data/historyData.js';
import { CULTURES } from '../../src/data/worldFactOptions.js';
import { resolveCultureProfileKey } from '../../src/data/cultureProfiles.js';
import { generatedContentTopicsOf } from '../../src/domain/generationContentProfile.js';
import { textAssertsFunctionalMagic } from '../../src/domain/magicAssertionText.js';
import { textAssertsMaritimeCapability } from '../../src/generators/generationContext.js';
import { STRUCTURE_CLAIMS, composeArrivalScene, unheldClaims } from '../../src/generators/narrative/arrivalScene.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';
import { goldenCorpus } from '../helpers/goldenMasterCorpus.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The History tab's own "Living memory" cut, EXTRACTED from the component rather than restated, so the
 * memory beat and the label printed beside the event can never disagree (the DS-GEN-9 mirror's idiom).
 */
const LIVING_MEMORY_CUT = (() => {
  const src = readFileSync(join(process.cwd(), 'src/components/new/tabs/HistoryTab.jsx'), 'utf8');
  const m = /yrs<=(\d+)\?'Living memory'/.exec(src);
  if (!m) throw new Error('HistoryTab.jsx recencyLabel no longer spells its Living memory cut');
  return Number(m[1]);
})();

afterEach(() => clearActiveRng());

const NAME = 'Ashford';
const render = (pool) => (pool || []).map((line) => line(NAME));

/** Every line of every pool, with where it lives. */
const ALL_LINES = [
  ...ARRIVAL_SENSES.flatMap((s) => [
    ...render(s.lines).map((text) => ({ where: `sense.${s.key}`, text, arcane: Boolean(s.arcane) })),
    ...render(s.dominant).map((text) => ({ where: `sense.${s.key}.dominant`, text, arcane: Boolean(s.arcane) })),
  ]),
  ...Object.entries(ARRIVAL_PEOPLE).flatMap(([k, pool]) => render(pool).map((text) => ({ where: `people.${k}`, text }))),
  ...Object.entries(ARRIVAL_TENSIONS).flatMap(([k, pool]) => render(pool).map((text) => ({ where: `tension.${k}`, text }))),
  ...Object.entries(ARRIVAL_MEMORIES).flatMap(([k, pool]) => render(pool).map((text) => ({ where: `memory.${k}`, text, arcane: k === 'wild_magic' }))),
];

/** Run the composer on its own seeded stream, as the assembly step does. */
function scene(settlement, seed) {
  setActiveRng(createPRNG(seed).fork('arrival-scene'));
  try { return composeArrivalScene(settlement); } finally { clearActiveRng(); }
}

const base = (over = {}) => ({
  name: NAME,
  tier: 'town',
  config: { tradeRouteAccess: 'road', culture: 'germanic', priorityMagic: 0, ...(over.config || {}) },
  institutions: [],
  stress: null,
  culturalIdentity: { architecturalDetail: 'steep roofs mark the older lanes' },
  economicState: { prosperity: 'Moderate', safetyProfile: { safetyLabel: 'Moderate' }, primaryExports: [], incomeSources: [] },
  history: { historicalEvents: [] },
  ...over,
  ...(over.config ? { config: { tradeRouteAccess: 'road', culture: 'germanic', priorityMagic: 0, ...over.config } } : {}),
});
const inst = (...names) => names.map((name) => ({ name }));
const SEEDS = Array.from({ length: 24 }, (_, i) => `arrival-${i}`);
const linesOf = (key, field = 'lines') => render(ARRIVAL_SENSES.find((s) => s.key === key)[field]);
const hasAny = (text, lines) => lines.some((line) => text.includes(line));

describe('the pools: every line clears the voice bible and the world law', () => {
  it('voice bars: trimmed, one capitalized sentence form, no em dash, exclamation, digit or leak', () => {
    expect(ALL_LINES.length, 'anti-vacuity').toBeGreaterThan(180);
    for (const { where, text } of ALL_LINES) {
      expect(text, where).toBe(text.trim());
      expect(text, `${where} opens lower-case`).toMatch(/^[A-Z"]/);
      expect(text, `${where} does not end a sentence`).toMatch(/[.]$/);
      // anchored: the trim, capital and full-stop assertions above prove `text` is a live rendered sentence
      expect(text, `${where} em dash`).not.toMatch(/—|–/);
      // anchored: the same live sentence as above
      expect(text, `${where} exclamation`).not.toContain('!');
      // anchored: the same live sentence as above
      expect(text, `${where} digit`).not.toMatch(/\d/);
      // anchored: the same live sentence as above
      expect(text, `${where} leaks a template`).not.toMatch(/\$\{|undefined|\[object| {2}/);
    }
  });

  it('no line claims functional magic unless it is drawn only where magic is real', () => {
    const offenders = ALL_LINES.filter((line) => !line.arcane && textAssertsFunctionalMagic(line.text));
    expect(offenders.map((line) => line.where)).toEqual([]);
    // Anti-vacuity: the detector is live on the gated lines.
    expect(ALL_LINES.some((line) => line.arcane && textAssertsFunctionalMagic(line.text))).toBe(true);
  });

  it('no line claims sea power or a theme outside the grounded profile', () => {
    for (const { where, text } of ALL_LINES) {
      expect(textAssertsMaritimeCapability(text), `${where} maritime claim`).toBe(false);
      expect(generatedContentTopicsOf(text), `${where} excluded theme`).toEqual([]);
    }
  });

  it('every pool is deep enough to vary, and no line repeats across the whole corpus', () => {
    for (const s of ARRIVAL_SENSES) {
      if (s.lines.length) expect(s.lines.length, s.key).toBeGreaterThanOrEqual(3);
      if (s.dominant.length) expect(s.dominant.length, `${s.key}.dominant`).toBeGreaterThanOrEqual(3);
    }
    for (const [k, pool] of Object.entries({ ...ARRIVAL_PEOPLE, ...ARRIVAL_TENSIONS })) expect(pool.length, k).toBeGreaterThanOrEqual(4);
    for (const [k, pool] of Object.entries(ARRIVAL_MEMORIES)) expect(pool.length, k).toBeGreaterThanOrEqual(2);
    const texts = ALL_LINES.map((line) => line.text);
    expect(texts.filter((t, i) => texts.indexOf(t) !== i)).toEqual([]);
  });
});

describe('the keys: every pool speaks for a real fact of its producer', () => {
  it('people: every catalogue culture resolves to a pool, and the unknown ones to `mixed`', () => {
    expect(CULTURES.length, 'anti-vacuity').toBeGreaterThan(10);
    for (const culture of CULTURES) expect(ARRIVAL_PEOPLE[resolveCultureProfileKey(culture)], culture).toBeDefined();
    expect(resolveCultureProfileKey('no_such_culture')).toBe('mixed');
    expect(ARRIVAL_PEOPLE.mixed).toBeDefined();
  });

  it('memory: every key is a history template type the generator can record', () => {
    const types = new Set(HISTORICAL_EVENTS_DATA.map((template) => template.type));
    expect(types.size, 'anti-vacuity').toBeGreaterThan(20);
    expect(Object.keys(ARRIVAL_MEMORIES).filter((key) => !types.has(key))).toEqual([]);
  });

  it('sense: every key carries institutions, and only `arms` speaks solely when its trade dominates', () => {
    for (const s of ARRIVAL_SENSES) {
      expect(s.institutions.length, s.key).toBeGreaterThan(0);
      if (!s.lines.length) {
        expect(s.key).toBe('arms');
        expect(s.dominant.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('the beats are anchored: drawn where the fact is, never where it is not', () => {
  it('a sawmill is not a mill, and "Access to external mill" is not a mill at all', () => {
    const settlement = base({ institutions: inst('Sawmill', 'Access to external mill') });
    const bread = [...linesOf('bread'), ...linesOf('bread', 'dominant')];
    const timber = [...linesOf('timber'), ...linesOf('timber', 'dominant')];
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const text = scene(settlement, seed);
      expect(hasAny(text, timber), `${seed}: the sawmill speaks (anchor): ${text}`).toBe(true);
      expect(hasAny(text, bread), `${seed}: a mill the settlement lacks: ${text}`).toBe(false);
    });
    expectNoSeedFailures(failures, 'a sawmill speaks as timber, and no absent mill speaks as bread');
  });

  it('a settlement exporting weapons hears its forges everywhere (the owner\'s own example)', () => {
    const settlement = base({
      institutions: inst('Blacksmiths (3-10)', 'Bowyers & fletchers (guild)', 'Bakers (5-15)'),
      economicState: { ...base().economicState, primaryExports: ['Weapons and armour', 'Baked goods'] },
    });
    const arms = linesOf('arms', 'dominant');
    const breadDominant = linesOf('bread', 'dominant');
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const text = scene(settlement, seed);
      expect(hasAny(text, arms) || hasAny(text, breadDominant), `${seed}: ${text}`).toBe(true);
    });
    expectNoSeedFailures(failures, 'a weapons exporter always speaks a dominant trade');
    expect(SEEDS.some((seed) => hasAny(scene(settlement, seed), arms)), 'arms never won').toBe(true);
  });

  it('a smithy alone is a smithy: the arms lines need the exports', () => {
    const settlement = base({ institutions: inst('Blacksmith') });
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const text = scene(settlement, seed);
      expect(hasAny(text, linesOf('smiths')), `${seed}: anchor: ${text}`).toBe(true);
      expect(hasAny(text, linesOf('arms', 'dominant')), `${seed}: ${text}`).toBe(false);
    });
    expectNoSeedFailures(failures, 'a smithy alone speaks as a smithy, never as an arms trade');
  });

  it('the arcane sense is drawn only where magic is real', () => {
    const arcane = [...linesOf('arcane'), ...linesOf('arcane', 'dominant')];
    const mundane = base({ institutions: inst('Alchemist', 'Blacksmith'), config: { priorityMagic: 0 } });
    const magical = base({ institutions: inst('Alchemist'), config: { priorityMagic: 70 } });
    const failures = collectSeedFailures(SEEDS, (seed) => {
      expect(hasAny(scene(mundane, seed), arcane), seed).toBe(false);
    });
    expectNoSeedFailures(failures, 'no arcane sense where magic does not work');
    expect(SEEDS.every((seed) => hasAny(scene(magical, seed), arcane)), 'the gate is live').toBe(true);
  });

  it('a crossroads opens on its market only where it has one', () => {
    const market = render(ARRIVAL_SCENES.market);
    const ordinary = render(ARRIVAL_SCENES.ordinary);
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const without = scene(base({ config: { tradeRouteAccess: 'crossroads' } }), seed);
      expect(ordinary.some((o) => without.startsWith(o)), `${seed}: ${without}`).toBe(true);
      const withMarket = scene(base({ config: { tradeRouteAccess: 'crossroads' }, institutions: inst('Weekly market') }), seed);
      expect(market.some((m) => withMarket.startsWith(m)), `${seed}: ${withMarket}`).toBe(true);
    });
    expectNoSeedFailures(failures, 'a crossroads opens on a market only where it has one');
  });

  it('people: the line is the settlement\'s own culture', () => {
    for (const culture of CULTURES) {
      const pool = render(ARRIVAL_PEOPLE[resolveCultureProfileKey(culture)]);
      const others = Object.entries(ARRIVAL_PEOPLE).filter(([k]) => k !== resolveCultureProfileKey(culture)).flatMap(([, p]) => render(p));
      const text = scene(base({ config: { culture } }), `people-${culture}`);
      expect(hasAny(text, pool), `${culture}: ${text}`).toBe(true);
      expect(hasAny(text, others), `${culture}: another culture's people: ${text}`).toBe(false);
    }
  });
});

describe('the hook names only structures the settlement holds (the Voice Program wave 4)', () => {
  const STRESSES = Object.keys(STRESS_TYPE_MAP);
  const vignettesOf = (type) => STRESS_DESCS[type].map((line) => line(NAME));

  it('every registered stress carries at least two structure-free vignettes, the floor the filter stands on', () => {
    expect(STRESSES.length, 'anti-vacuity').toBeGreaterThan(10);
    const thin = STRESSES.filter((type) => vignettesOf(type).filter((text) => unheldClaims(text, []).length === 0).length < 2);
    expect(thin).toEqual([]);
    // The detector is live: the stock of structure-naming vignettes is the reason the filter exists.
    expect(STRESSES.flatMap(vignettesOf).filter((text) => unheldClaims(text, []).length > 0).length).toBeGreaterThan(40);
    expect(STRUCTURE_CLAIMS.map((entry) => entry.family).sort()).toEqual(['faith', 'granary', 'guard', 'market', 'perimeter']);
  });

  it('a settlement with no wall, gate, market, guard or temple never hears of one, whatever its stress', () => {
    const cases = STRESSES.flatMap((type) => SEEDS.slice(0, 8).map((seed) => ({ type, seed })));
    const failures = collectSeedFailures(cases, ({ type, seed }) => {
      const text = scene(base({ stress: [{ type }], institutions: inst('Subsistence farming', 'Water source') }), `${type}-${seed}`);
      const hook = vignettesOf(type).find((line) => text.startsWith(line));
      expect(hook, `${type}: the scene opens on its own stress (anchor): ${text}`).toBeDefined();
      expect(unheldClaims(hook, ['subsistence farming', 'water source']), `${type}: ${hook}`).toEqual([]);
    });
    expectNoSeedFailures(failures, 'a structure-free settlement hears of no structure it lacks');
  });

  it('a walled, garrisoned town still draws the vignettes that name its walls', () => {
    const walled = base({ stress: [{ type: 'under_siege' }], institutions: inst('Town walls', 'Garrison', 'Weekly market', 'Town granary') });
    expect(SEEDS.some((seed) => /\bwalls?\b/i.test(scene(walled, seed))), 'the walls never spoke').toBe(true);
  });
});

describe('the closing beat: a printed danger, else a memory, else poverty or plenty, and none under a vignette', () => {
  const event = (over) => ({ yearsAgo: 14, type: 'disaster', templateType: 'great_fire', severity: 'catastrophic', ...over });
  const closingOf = (settlement, seed = 'closing') => {
    const text = scene(settlement, seed);
    const hit = Object.entries({ ...ARRIVAL_TENSIONS, ...ARRIVAL_MEMORIES })
      .filter(([, pool]) => hasAny(text, render(pool))).map(([k]) => k);
    return { text, hit };
  };

  it('the printed dangers outrank everything, criminal governance first', () => {
    const fire = { history: { historicalEvents: [event()] } };
    const label = (safetyLabel) => base({ ...fire, economicState: { ...base().economicState, prosperity: 'Wealthy', safetyProfile: { safetyLabel } } });
    expect(closingOf(label('Dangerous — Criminal Governance')).hit).toEqual(['criminal_governance']);
    expect(closingOf(label('Controlled — Authoritarian')).hit).toEqual(['controlled']);
    expect(closingOf(label('Unsafe')).hit).toEqual(['unsafe']);
    expect(closingOf(label('Dangerous')).hit).toEqual(['unsafe']);
  });

  it('a major event within living memory leaves its trace; an old or minor one does not', () => {
    expect(LIVING_MEMORY_CUT, 'anti-vacuity: the tab\'s cut was read').toBeGreaterThan(10);
    expect(closingOf(base({ history: { historicalEvents: [event()] } })).hit).toEqual(['great_fire']);
    // Both sides of the History tab's own cut: the last year it labels "Living memory", and the first it does not.
    expect(closingOf(base({ history: { historicalEvents: [event({ yearsAgo: LIVING_MEMORY_CUT })] } })).hit).toEqual(['great_fire']);
    expect(closingOf(base({ history: { historicalEvents: [event({ yearsAgo: LIVING_MEMORY_CUT + 1 })] } })).hit).toEqual([]);
    expect(closingOf(base({ history: { historicalEvents: [event({ severity: 'minor' })] } })).hit).toEqual([]);
    // The MOST RECENT qualifying event speaks.
    const two = [event({ yearsAgo: 20, templateType: 'great_flood' }), event({ yearsAgo: 13, templateType: 'plague_years' })];
    expect(closingOf(base({ history: { historicalEvents: two } })).hit).toEqual(['plague_years']);
  });

  it('wild magic is remembered only where magic is real', () => {
    const wild = { history: { historicalEvents: [event({ templateType: 'wild_magic' })] } };
    expect(closingOf(base({ ...wild, config: { priorityMagic: 0 } })).hit).toEqual([]);
    expect(closingOf(base({ ...wild, config: { priorityMagic: 70 } })).hit).toEqual(['wild_magic']);
  });

  it('with no danger and no memory, poverty or plenty at the extremes, and silence in between', () => {
    const at = (prosperity) => closingOf(base({ economicState: { ...base().economicState, prosperity } })).hit;
    expect(at('Struggling')).toEqual(['poor']);
    expect(at('Wealthy')).toEqual(['prosperous']);
    expect(at('Comfortable')).toEqual([]);
  });

  it('under a stress vignette the vignette is the tension: no sight and no closing beat', () => {
    const stressed = base({
      stress: [{ type: 'famine' }],
      history: { historicalEvents: [event()] },
      economicState: { ...base().economicState, safetyProfile: { safetyLabel: 'Unsafe' } },
    });
    const { text, hit } = closingOf(stressed);
    expect(hit, text).toEqual([]);
    expect(text.length, 'anchor: the vignette rendered').toBeGreaterThan(80);
    // anchored: the length assertion above proves the vignette rendered, so the sight's absence is real
    expect(text, 'the sight yields').not.toContain('Steep roofs mark the older lanes.');
  });
});

describe('the scene on real settlements', () => {
  it('is deterministic on its stream', () => {
    const settlement = base({ institutions: inst('Blacksmith', 'Weekly market', 'Parish church') });
    const failures = collectSeedFailures(SEEDS.slice(0, 6), (seed) => {
      expect(scene(settlement, seed)).toBe(scene(settlement, seed));
    });
    expectNoSeedFailures(failures, 'the same stream yields the same paragraph');
  });

  it('a generated corpus reads as places: no retired template, every scene clears the coherence receipt', () => {
    const rows = goldenCorpus();
    const stride = Math.max(1, Math.floor(rows.length / 36));
    const scenes = [];
    for (let i = 0; i < rows.length; i += stride) {
      const { _seed, ...cfg } = rows[i];
      const s = generateSettlementPipeline(cfg, null, { seed: `${_seed}::arrival-read-${i}`, customContent: {} });
      scenes.push(s.arrivalScene);
      const checks = s.generationCoherenceReceipt?.checks || [];
      expect(checks.length, `${i}: the receipt is live`).toBeGreaterThan(5);
      const findings = checks.flatMap((c) => c.findings || []);
      expect(findings.filter((f) => String(f.path).startsWith('arrivalScene')), `${i}: ${s.arrivalScene}`).toEqual([]);
      expect(s.arrivalScene.length, `${i}: the scene rendered`).toBeGreaterThan(80);
      // A stressed row's hook names no structure the settlement lacks (wave 4).
      const names = nativeSemanticNames(s.institutions).map((n) => n.toLowerCase())
        .filter((n) => !/^(?:access to|traveling|travelling) /.test(n));
      const vignette = Object.values(STRESS_DESCS).flat().map((line) => line(s.name)).find((line) => s.arrivalScene.startsWith(line));
      if (vignette) expect(unheldClaims(vignette, names), `${i}: ${vignette}`).toEqual([]);
      for (const retired of ['magelight lamp post', 'A proper village', 'A market town of substance', "region's great urban centre"]) {
        // anchored: the length assertion above proves the scene rendered
        expect(s.arrivalScene, `${i}: retired template`).not.toContain(retired);
      }
    }
    expect(scenes.length, 'anti-vacuity').toBeGreaterThanOrEqual(30);
    // The place beats are live on real settlements: most scenes carry a sense line.
    const senseLines = ARRIVAL_SENSES.flatMap((s) => [...s.lines, ...s.dominant]);
    const withSense = scenes.filter((text) => senseLines.some((line) => {
      const probe = line('\u0000').split('\u0000');
      return probe.every((part) => text.includes(part));
    }));
    expect(withSense.length / scenes.length).toBeGreaterThan(0.6);
  }, 600_000);
});
