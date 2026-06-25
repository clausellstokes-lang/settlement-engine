/**
 * domain/state tests — derivation + comparison invariants.
 *
 * The point isn't to lock the exact derivation values forever. The point
 * is to assert the *direction* of causality: a famine settlement scores
 * worse on resilience than a prosperous one, more conflicts → higher
 * volatility, more depleted resources → higher resource pressure. That
 * way we can refine the derivation formulas later without breaking
 * tests, but if the *direction* ever flips, CI fires immediately.
 */

import { describe, test, expect } from 'vitest';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';
import { compareSystemState } from '../../src/domain/state/compareSystemState.js';
import { bandFor, severityFor, clamp01 } from '../../src/domain/state/bands.js';

describe('bands', () => {
  test('thresholds are stable', () => {
    expect(bandFor(0)).toBe('Critical');
    expect(bandFor(24)).toBe('Critical');
    expect(bandFor(25)).toBe('Vulnerable');
    expect(bandFor(49)).toBe('Vulnerable');
    expect(bandFor(50)).toBe('Strained');
    expect(bandFor(74)).toBe('Strained');
    expect(bandFor(75)).toBe('Stable');
    expect(bandFor(100)).toBe('Stable');
  });

  test('clamp01 keeps values in range and handles non-numbers', () => {
    expect(clamp01(150)).toBe(100);
    expect(clamp01(-50)).toBe(0);
    expect(clamp01(NaN)).toBe(50);
    expect(clamp01(undefined)).toBe(50);
    expect(clamp01(42)).toBe(42);
  });

  test('severity classifier picks reasonable cutoffs', () => {
    expect(severityFor(20)).toBe('major');
    expect(severityFor(-15)).toBe('major');
    expect(severityFor(8)).toBe('moderate');
    expect(severityFor(-7)).toBe('moderate');
    expect(severityFor(3)).toBe('minor');
    expect(severityFor(-1)).toBe('minor');
  });
});

describe('deriveSystemState', () => {
  test('empty settlement returns shape without throwing', () => {
    const s = deriveSystemState({});
    expect(s).toHaveProperty('resilience');
    expect(s).toHaveProperty('volatility');
    expect(s).toHaveProperty('externalThreat');
    expect(s).toHaveProperty('resourcePressure');
    for (const dim of Object.values(s)) {
      expect(typeof dim.value).toBe('number');
      expect(['Stable', 'Strained', 'Vulnerable', 'Critical']).toContain(dim.band);
      expect(Array.isArray(dim.drivers)).toBe(true);
      expect(Array.isArray(dim.risks)).toBe(true);
    }
  });

  test('null settlement is safe', () => {
    const s = deriveSystemState(null);
    expect(s.resilience.value).toBeGreaterThanOrEqual(0);
  });

  test('prosperous settlement has higher resilience than struggling one', () => {
    const wealthy = deriveSystemState({
      economicState: { prosperity: 'Wealthy', exports: ['a', 'b', 'c', 'd', 'e'] },
    });
    const struggling = deriveSystemState({
      economicState: { prosperity: 'Struggling', exports: [] },
    });
    expect(wealthy.resilience.value).toBeGreaterThan(struggling.resilience.value);
  });

  test('food deficit lowers resilience', () => {
    const fed = deriveSystemState({
      economicState: { foodSecurity: { surplusPct: 50 } },
    });
    const starving = deriveSystemState({
      economicState: { foodSecurity: { deficitPct: 30 } },
    });
    expect(fed.resilience.value).toBeGreaterThan(starving.resilience.value);
  });

  test('many factions + active conflicts raise volatility', () => {
    const calm = deriveSystemState({
      powerStructure: { factions: [{}, {}], conflicts: [] },
    });
    const stormy = deriveSystemState({
      powerStructure: {
        factions: [{}, {}, {}, {}, {}, {}],
        conflicts: [{ a: 'x' }, { a: 'y' }, { a: 'z' }],
      },
    });
    expect(stormy.volatility.value).toBeGreaterThan(calm.volatility.value);
  });

  // P3.3b Stage 2a: the legitimacy branch read publicLegitimacy as a bare number,
  // but the generator emits { score, label, ... } — so low legitimacy never raised
  // volatility. Now reads .score; a doubted ruling order destabilises again.
  test('low public legitimacy raises volatility; strong legitimacy lowers it', () => {
    const shaky = deriveSystemState({ powerStructure: { publicLegitimacy: { score: 20 } } });
    const solid = deriveSystemState({ powerStructure: { publicLegitimacy: { score: 85 } } });
    expect(shaky.volatility.value).toBeGreaterThan(solid.volatility.value);
    expect(shaky.volatility.risks.some(r => /legitimacy/i.test(r))).toBe(true);
  });

  test('legacy bare-number legitimacy still works (backward compatible)', () => {
    const shaky = deriveSystemState({ powerStructure: { publicLegitimacy: 20 } });
    const solid = deriveSystemState({ powerStructure: { publicLegitimacy: 85 } });
    expect(shaky.volatility.value).toBeGreaterThan(solid.volatility.value);
  });

  test('plagued region raises external threat over safe region', () => {
    const safe = deriveSystemState({ config: { monsterThreat: 'civilized' } });
    const plagued = deriveSystemState({ config: { monsterThreat: 'plagued' } });
    expect(plagued.externalThreat.value).toBeGreaterThan(safe.externalThreat.value);
  });

  test('hostile neighbours raise external threat', () => {
    const isolated = deriveSystemState({ neighbourNetwork: [] });
    const surrounded = deriveSystemState({
      neighbourNetwork: [
        { relationshipType: 'hostile' },
        { relationshipType: 'hostile' },
        { relationshipType: 'cold_war' },
      ],
    });
    expect(surrounded.externalThreat.value).toBeGreaterThan(isolated.externalThreat.value);
  });

  test('depleted resources raise resource pressure', () => {
    const flush = deriveSystemState({
      config: { nearbyResourcesState: { iron: 'allow', timber: 'allow' } },
    });
    const tapped = deriveSystemState({
      config: { nearbyResourcesState: { iron: 'depleted', timber: 'depleted', salt: 'depleted' } },
    });
    expect(tapped.resourcePressure.value).toBeGreaterThan(flush.resourcePressure.value);
  });

  // A covert IMPOSE_CORRUPTION mark bumps the institution's status to 'impaired'
  // (withImpairment side effect), but it is hidden by design. Surfacing it as a
  // visible "impaired institution" resilience risk leaks the covert capture into
  // public derived state — the inverse of its intent.
  test('a covert-only institution impairment does not leak as a visible impaired-institution risk', () => {
    const covertOnly = deriveSystemState({
      institutions: [
        {
          id: 'i1', name: 'City Watch', status: 'impaired',
          impairments: [{ type: 'corruption', severity: 0.3, covert: true, causeEventId: 'e1' }],
        },
      ],
    });
    expect(covertOnly.resilience.risks.some(r => /impaired institution/.test(r))).toBe(false);

    // A PUBLIC (non-covert) impairment must still surface as before.
    const publicImpair = deriveSystemState({
      institutions: [
        {
          id: 'i1', name: 'City Watch', status: 'impaired',
          impairments: [{ type: 'capacity', severity: 0.5, causeEventId: 'e1' }],
        },
      ],
    });
    expect(publicImpair.resilience.risks.some(r => /impaired institution/.test(r))).toBe(true);
    // The hidden mark also costs no resilience value the public hit does.
    expect(covertOnly.resilience.value).toBeGreaterThan(publicImpair.resilience.value);
  });

  // A mixed institution (one covert mark + one public impairment) is genuinely,
  // publicly impaired — it must still count.
  test('an institution with a covert AND a public impairment still counts as impaired', () => {
    const mixed = deriveSystemState({
      institutions: [
        {
          id: 'i1', name: 'City Watch', status: 'impaired',
          impairments: [
            { type: 'corruption', severity: 0.3, covert: true, causeEventId: 'e1' },
            { type: 'capacity', severity: 0.5, causeEventId: 'e2' },
          ],
        },
      ],
    });
    expect(mixed.resilience.risks.some(r => /impaired institution/.test(r))).toBe(true);
  });
});

describe('compareSystemState', () => {
  function s(values) {
    const out = {};
    for (const [k, v] of Object.entries(values)) {
      out[k] = { value: v, band: bandFor(v), drivers: [], risks: [] };
    }
    return out;
  }

  test('no change → empty deltas', () => {
    const before = s({ resilience: 60, volatility: 40, externalThreat: 30, resourcePressure: 50 });
    expect(compareSystemState(before, before)).toEqual([]);
  });

  test('returns one delta per changed dimension', () => {
    const before = s({ resilience: 60, volatility: 40, externalThreat: 30, resourcePressure: 50 });
    const after  = s({ resilience: 45, volatility: 55, externalThreat: 30, resourcePressure: 50 });
    const deltas = compareSystemState(before, after);
    expect(deltas).toHaveLength(2);
    expect(deltas.map(d => d.key).sort()).toEqual(['resilience', 'volatility']);
  });

  test('sorts by absolute change descending', () => {
    const before = s({ resilience: 60, volatility: 40, externalThreat: 30, resourcePressure: 50 });
    const after  = s({ resilience: 58, volatility: 60, externalThreat: 30, resourcePressure: 50 });
    const deltas = compareSystemState(before, after);
    expect(deltas[0].key).toBe('volatility'); // change of 20
    expect(deltas[1].key).toBe('resilience'); // change of -2
  });

  test('explanation calls out band crossings', () => {
    const before = s({ resilience: 80, volatility: 40, externalThreat: 30, resourcePressure: 50 });
    const after  = s({ resilience: 60, volatility: 40, externalThreat: 30, resourcePressure: 50 });
    const [delta] = compareSystemState(before, after);
    expect(delta.explanation).toContain('Stable');
    expect(delta.explanation).toContain('Strained');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// S2 — 15-var causal movement folded into the 4-dim drivers/risks.
//
// The war-layer / religion causal movement (war_drain on economic_capacity, the
// deepened religious_authority, war_pressure, army_deployed) surfaces as NAMED
// drivers/risks within the EXISTING four dimensions — NOT a new section. The
// hard guarantee: a settlement with NO war/religion conditions produces the
// IDENTICAL drivers/risks as before; the new entries appear ONLY when the
// matching condition/deity is present.
// ─────────────────────────────────────────────────────────────────────────────
describe('S2 — war/religion causal movement as named drivers/risks', () => {
  const base = (patch = {}) => ({
    economicState: { prosperity: 'Moderate', primaryExports: ['grain'] },
    powerStructure: { factions: [{ faction: 'A' }, { faction: 'B' }] },
    institutions: [],
    config: {},
    ...patch,
  });

  test('no-condition settlement is byte-identical with vs without empty arrays', () => {
    const plain = base();
    const withEmpties = base({ activeConditions: [], stress: [] });
    expect(JSON.stringify(deriveSystemState(withEmpties)))
      .toBe(JSON.stringify(deriveSystemState(plain)));
  });

  test('a plain settlement carries NONE of the war/religion strings', () => {
    const st = deriveSystemState(base());
    const allText = JSON.stringify(st);
    expect(allText).not.toContain('War economy');
    expect(allText).not.toContain('wartime pressure');
    expect(allText).not.toContain('deployed abroad');
    expect(allText).not.toContain('religious authority');
  });

  test('war_drain surfaces a war-labeled FALLING economic driver in resilience', () => {
    const plain = deriveSystemState(base());
    const war = deriveSystemState(base({ activeConditions: [{ archetype: 'war_drain', severity: 0.5 }] }));
    expect(war.resilience.risks).toContain('War economy is bleeding the home treasury');
    // It is a FALLING driver — resilience drops vs the same town at peace.
    expect(war.resilience.value).toBeLessThan(plain.resilience.value);
    // The plain town does NOT carry the string.
    expect(plain.resilience.risks).not.toContain('War economy is bleeding the home treasury');
  });

  test('war_pressure + army_deployed surface as external-threat risks', () => {
    const plain = deriveSystemState(base());
    const war = deriveSystemState(base({ activeConditions: [
      { archetype: 'war_pressure', severity: 0.6 },
      { archetype: 'army_deployed', severity: 0.5 },
    ] }));
    expect(war.externalThreat.risks).toContain('Under active wartime pressure');
    expect(war.externalThreat.risks).toContain('Standing army deployed abroad. Home garrison thinned.');
    // External threat RISES — these are pressures, not relief.
    expect(war.externalThreat.value).toBeGreaterThan(plain.externalThreat.value);
  });

  test('a dominant deity surfaces a religious_authority driver in volatility', () => {
    const plain = deriveSystemState(base());
    const deityTown = deriveSystemState(base({ config: { primaryDeitySnapshot: { name: 'Pelor', rankAxis: 'major' } } }));
    expect(deityTown.volatility.drivers).toContain('Pelor anchors religious authority');
    expect(plain.volatility.drivers).not.toContain('Pelor anchors religious authority');
  });

  test('a minor/cult deity surfaces a weaker, named religious driver', () => {
    const cultTown = deriveSystemState(base({ config: { primaryDeitySnapshot: { name: 'The Whispered One', rankAxis: 'cult' } } }));
    expect(cultTown.volatility.drivers).toContain('The Whispered One shapes religious authority');
  });

  test('a deity with no recognized rankAxis is inert (no driver, byte-neutral)', () => {
    const plain = deriveSystemState(base());
    const weird = deriveSystemState(base({ config: { primaryDeitySnapshot: { name: 'X', rankAxis: 'unknown' } } }));
    expect(JSON.stringify(weird.volatility)).toBe(JSON.stringify(plain.volatility));
  });
});
