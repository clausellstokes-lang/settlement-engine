/**
 * Join harness — governingName write + derived-config strip (Cohesion Wave 4a).
 *
 * Two seams pinned here:
 *
 * 1. powerStructure.governingName. Seven sim consumers key off this field
 *    (factionProfile legitimacy inheritance, deriveRulingAuthority
 *    governing-faction power, hook escalation, simulation spine, world-event
 *    legitimacy deltas, the generatePower trace) but for years NOTHING wrote
 *    it — every faction sat at legitimacy 50 and the rail could never answer
 *    "why is this faction governing?". generatePowerStructure now returns the
 *    isGoverning faction's name as governingName, and the generatePower trace
 *    keys off f.isGoverning directly. The dead `_neighbourGovBias` plumbing
 *    (computed in resolveNeighbour, threaded into generatePower, read by
 *    nothing) was deleted along with its false "neighbour gov bias applied"
 *    receipt.
 *
 * 2. Derived-config echo. settlement.config is the RESOLVED effectiveConfig
 *    snapshot: resolveStress writes stressTypes onto it, resolveConfig floors
 *    priorityMilitary under 'plagued', isolation writes _magicTradeOnly.
 *    Readers (validator, narrative, sim, UI) depend on that snapshot — so it
 *    stays — but it must never re-enter the pipeline as user input, or
 *    emergent stress becomes FORCED stress on every what-if edit (with a
 *    false "selected by user config" receipt) and a plague-era military
 *    floor outlives the threat. applyChange regenerates from the raw
 *    settlement._config; its legacy fallback (pre-_config saves) is run
 *    through stripDerivedConfigKeys.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deriveAllFactionProfiles } from '../../src/domain/factionProfile.js';
import { deriveCausalState } from '../../src/domain/causalState.js';
import {
  stripDerivedConfigKeys,
  DERIVED_CONFIG_KEYS,
} from '../../src/store/settlementSlice.js';

const gen = (config, seed, neighbour = null) =>
  generateSettlementPipeline(config, neighbour, { seed, customContent: {} });

const BASE_CFG = {
  culture: 'germanic',
  tradeRouteAccess: 'road',
  monsterThreat: 'frontier',
  priorityMilitary: 40,
};

/** Exactly how settlementSlice.applyChange rebuilds the next run's input. */
const buildNextConfig = (settlement) => ({
  ...(settlement?._config
    || stripDerivedConfigKeys(settlement?.config)
    || {}),
});

const govOf = (s) => (s.powerStructure?.factions || []).find((f) => f.isGoverning);

// ── 1. governingName is written and names the governing roster faction ──────

describe('join: powerStructure.governingName names the governing roster faction', () => {
  test.each(['village', 'town', 'city'])('%s: governingName matches the isGoverning entry', (tier) => {
    const s = gen({ ...BASE_CFG, settType: tier }, `powercfg-${tier}`);
    const governing = govOf(s);
    expect(governing, 'roster must contain an isGoverning faction').toBeTruthy();
    expect(typeof s.powerStructure.governingName).toBe('string');
    expect(s.powerStructure.governingName).toBe(governing.faction);
  });
});

// ── 2. The sim consumers actually engage it ─────────────────────────────────

describe('behavior: governing faction engages the legitimacy consumers', () => {
  // Scan a fixed seed list for a settlement whose public legitimacy is NOT
  // the neutral 50 — otherwise "inherits legitimacy" would be indistinguishable
  // from the old all-50 bug. Deterministic: the list is fixed, first hit wins.
  const findLegitimacyFixture = () => {
    for (const seed of ['powercfg-town', 'powercfg-leg-1', 'powercfg-leg-2', 'powercfg-leg-3', 'powercfg-leg-4']) {
      const s = gen({ ...BASE_CFG, settType: 'town' }, seed);
      if ((s.powerStructure?.publicLegitimacy?.score ?? 50) !== 50 && govOf(s)) return s;
    }
    return null;
  };

  test('governing faction inherits public legitimacy; non-governing factions sit at 50', () => {
    const s = findLegitimacyFixture();
    expect(s, 'no fixture with non-neutral legitimacy found in seed list').toBeTruthy();

    const legitimacy = s.powerStructure.publicLegitimacy.score;
    const govName = s.powerStructure.governingName;
    const profiles = deriveAllFactionProfiles(s);
    expect(profiles.length).toBeGreaterThan(1);

    const govProfile = profiles.find((p) => p.name === govName);
    expect(govProfile, 'governing faction must have a profile').toBeTruthy();
    expect(govProfile.legitimacy).toBe(legitimacy);

    // Non-governing factions stay at the neutral baseline. Skip names whose
    // first token appears in govName — legitimacyFor's substring matcher
    // (consumer-side, out of this slice's scope) would catch those too.
    const nonGov = profiles.filter((p) => {
      if (p.name === govName) return false;
      const token = (p.name || '').toLowerCase().split(/[\s/(]/)[0];
      return token && !govName.toLowerCase().includes(token);
    });
    expect(nonGov.length).toBeGreaterThan(0);
    for (const p of nonGov) {
      expect(p.legitimacy, `${p.name} is not governing`).toBe(50);
    }
  });

  test('ruling_authority gains a governing_power contributor from the governing faction', () => {
    const s = gen({ ...BASE_CFG, settType: 'town' }, 'powercfg-town');
    const ra = deriveCausalState(s).variables.ruling_authority;
    const govContrib = (ra.contributors || []).find((c) => c.effect === 'governing_power');
    expect(govContrib, 'deriveRulingAuthority must engage the governing faction').toBeTruthy();
  });

  test('the generatePower trace emits exactly one governing receipt with the legitimacy cause', () => {
    const s = gen({ ...BASE_CFG, settType: 'town' }, 'powercfg-town');
    const govTraces = (s.simulationTrace || []).filter(
      (t) => t.step === 'generatePower' && t.result === 'governing',
    );
    expect(govTraces).toHaveLength(1);
    const sources = (govTraces[0].causes || []).map((c) => c.source);
    expect(sources).toContain('governingFaction');
  });
});

// ── 3. The dead neighbour gov bias and its false receipt are gone ───────────

describe('receipt honesty: no trace claims a neighbour gov bias', () => {
  test('neighbour-bound generation emits the bound receipt without the gov-bias claim', () => {
    const neighbour = gen({ ...BASE_CFG, settType: 'town' }, 'powercfg-neighbour');
    const s = gen(
      { ...BASE_CFG, settType: 'village', _neighbourRelType: 'allied' },
      'powercfg-bound',
      neighbour,
    );

    const bound = (s.simulationTrace || []).find(
      (t) => t.step === 'resolveNeighbour' && t.result === 'bound',
    );
    expect(bound, 'neighbour binding must still emit its receipt').toBeTruthy();

    // The honest influences remain (econ bias + faction mirroring)…
    const targets = (bound.downstreamEffects || []).map((e) => e.target);
    expect(targets).toContain('economicState');
    expect(targets).toContain('factions');

    // …but nothing anywhere claims the gov bias that no generator ever read.
    const lyingEffects = (s.simulationTrace || []).flatMap((t) =>
      (t.downstreamEffects || []).filter((e) => /gov bias/i.test(e.effect || '')),
    );
    expect(lyingEffects).toEqual([]);
  });
});

// ── 4. Derived state does not echo back into the next config ────────────────

describe('config echo: applyChange-style rebuild does not re-feed derived state', () => {
  // Scan fixed seeds for a settlement that picked up EMERGENT stress (none
  // requested in config). Deterministic — fixed list, first hit wins.
  const findEmergentStressFixture = () => {
    for (const seed of ['powercfg-city', 'powercfg-stress-1', 'powercfg-stress-2', 'powercfg-stress-3', 'powercfg-stress-4']) {
      const s = gen({ ...BASE_CFG, settType: 'city' }, seed);
      if ((s.config?.stressTypes || []).length > 0) return s;
    }
    return null;
  };

  test('resolved snapshot keeps derived keys for readers; raw _config never has them', () => {
    const s = findEmergentStressFixture();
    expect(s, 'no emergent-stress fixture found in seed list').toBeTruthy();

    // Readers (validator, narrative, sim) consume the snapshot — derived keys stay.
    expect(s.config.stressTypes.length).toBeGreaterThan(0);
    expect(s.config.tier).toBe(s.tier);
    expect(typeof s.config._population).toBe('number');

    // The raw config never carried them.
    expect(s._config.stressTypes).toBeUndefined();
    expect(s._config.stressType).toBeUndefined();
  });

  test('what-if rebuild carries no emergent stress forward (and the receipt stays honest)', () => {
    const s = findEmergentStressFixture();
    expect(s).toBeTruthy();
    const emergent = [...s.config.stressTypes];

    const next = buildNextConfig(s);
    expect(next.stressTypes).toBeUndefined();
    expect(next.stressType).toBeUndefined();
    expect(next.intendedStressTypes).toBeUndefined();

    // Same seed + raw config: the edit cycle is identity-stable and the
    // stress is re-derived as EMERGENT — never relabeled "selected by user".
    const again = gen(next, s._seed);
    expect(again.config.stressTypes).toEqual(emergent);
    expect((again.institutions || []).map((i) => i.name))
      .toEqual((s.institutions || []).map((i) => i.name));
    expect(again.powerStructure.governingName).toBe(s.powerStructure.governingName);
    const stressTraces = (again.simulationTrace || []).filter((t) => t.step === 'resolveStress');
    expect(stressTraces.length).toBeGreaterThan(0);
    for (const t of stressTraces) {
      expect(t.result, `stressor ${t.targetId} must not be relabeled as user-selected`).toBe('emergent');
    }
  });

  test('the echo it prevents: feeding the resolved snapshot back forges a "selected by user" receipt', () => {
    const s = findEmergentStressFixture();
    expect(s).toBeTruthy();

    // This is what a legacy (pre-_config) save replayed WITHOUT the strip:
    // the emergent stress re-enters as Mode-0 forced stress and the trace lies.
    const echoed = gen({ ...s.config }, s._seed);
    const applied = (echoed.simulationTrace || []).filter(
      (t) => t.step === 'resolveStress' && t.result === 'applied',
    );
    expect(applied.length).toBeGreaterThan(0);
  });

  test('a plague-era military floor does not outlive the user slider', () => {
    const s = gen(
      { ...BASE_CFG, settType: 'town', monsterThreat: 'plagued', priorityMilitary: 10 },
      'powercfg-floor',
    );
    // Snapshot shows the floored value the generation actually used…
    expect(s.config.priorityMilitary).toBe(25);
    // …but the rebuild starts from the user's own slider again.
    expect(buildNextConfig(s).priorityMilitary).toBe(10);
  });

  test('stripDerivedConfigKeys removes exactly the derived keys, never user vocabulary', () => {
    const s = findEmergentStressFixture();
    expect(s).toBeTruthy();
    const stripped = stripDerivedConfigKeys(s.config);

    for (const key of DERIVED_CONFIG_KEYS) {
      expect(stripped[key], `${key} is derived and must be stripped`).toBeUndefined();
    }
    // User-facing vocabulary survives the legacy fallback.
    expect(stripped.settType).toBe('city');
    expect(stripped.culture).toBe('germanic');
    expect(stripped.tradeRouteAccess).toBeDefined();
    expect(stripped.monsterThreat).toBeDefined();
    expect(typeof stripped.priorityMilitary).toBe('number');
    // Pure function — the snapshot itself is untouched.
    expect(s.config.stressTypes.length).toBeGreaterThan(0);
  });
});
