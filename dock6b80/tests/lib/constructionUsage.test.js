/**
 * constructionUsage.test.js — the Analytics-v2 construction-insight derivations
 * (DESIGN_ANALYTICS_V2 §1.2 config archetype + §1.3 realm shape). Pins the coarse,
 * id-free classifiers: the demand-signal archetype and the realm topology class.
 */
import { describe, it, expect } from 'vitest';
import { configArchetype, realmShape } from '../../src/lib/constructionUsage.js';

describe('configArchetype (§1.2 priority-profile cluster)', () => {
  it('the default 50s (no dominant axis) read balanced', () => {
    expect(configArchetype({
      priorityEconomy: 50, priorityMilitary: 50, priorityMagic: 50, priorityReligion: 50, priorityCriminal: 50,
    })).toBe('balanced');
  });

  it('maps each dominant slider to its named cluster', () => {
    // military_fortress-shaped
    expect(configArchetype({ priorityEconomy: 28, priorityMilitary: 92, priorityMagic: 18, priorityReligion: 42, priorityCriminal: 28 })).toBe('martial');
    // merchant_republic-shaped
    expect(configArchetype({ priorityEconomy: 82, priorityMilitary: 38, priorityMagic: 42, priorityReligion: 32, priorityCriminal: 62 })).toBe('mercantile');
    // theocracy-shaped
    expect(configArchetype({ priorityEconomy: 38, priorityMilitary: 52, priorityMagic: 35, priorityReligion: 92, priorityCriminal: 18 })).toBe('pious');
    // mage_city-shaped
    expect(configArchetype({ priorityEconomy: 62, priorityMilitary: 28, priorityMagic: 92, priorityReligion: 22, priorityCriminal: 38 })).toBe('arcane');
    // criminal_haven-shaped
    expect(configArchetype({ priorityEconomy: 72, priorityMilitary: 25, priorityMagic: 35, priorityReligion: 20, priorityCriminal: 90 })).toBe('criminal-leaning');
  });

  it('a barely-elevated axis (under the lead margin) stays balanced', () => {
    expect(configArchetype({ priorityEconomy: 55, priorityMilitary: 50, priorityMagic: 50, priorityReligion: 50, priorityCriminal: 50 })).toBe('balanced');
  });

  it('is total: missing/garbage config → balanced, never throws', () => {
    expect(configArchetype(undefined)).toBe('balanced');
    expect(configArchetype({})).toBe('balanced');
    expect(configArchetype(null)).toBe('balanced');
  });

  it('emits only a coarse enum — never an id, name, or the raw slider values', () => {
    const out = configArchetype({ priorityMilitary: 92, customName: 'Blackreach' });
    expect(typeof out).toBe('string');
    expect(out).not.toContain('Blackreach');
  });
});

describe('realmShape (§1.3 realm construction)', () => {
  const nodes = (n) => Array.from({ length: n }, (_, i) => ({ id: `s${i}`, tier: i === 0 ? 'city' : 'town' }));
  const pathEdges = (n) => Array.from({ length: n - 1 }, (_, i) => ({ from: `s${i}`, to: `s${i + 1}` }));
  const ringEdges = (n) => [...pathEdges(n), { from: `s${n - 1}`, to: 's0' }];
  const hubEdges = (n) => Array.from({ length: n - 1 }, (_, i) => ({ from: 's0', to: `s${i + 1}` }));

  it('classifies a path/chain as linear-valley', () => {
    const g = { nodes: nodes(6), edges: pathEdges(6) };
    expect(realmShape(g).topology_class).toBe('linear-valley');
  });

  it('classifies a cycle as coastal-ring', () => {
    const g = { nodes: nodes(6), edges: ringEdges(6) };
    expect(realmShape(g).topology_class).toBe('coastal-ring');
  });

  it('classifies a star as hub-and-spoke', () => {
    const g = { nodes: nodes(7), edges: hubEdges(7) };
    expect(realmShape(g).topology_class).toBe('hub-and-spoke');
  });

  it('classifies a sparse/disconnected graph as scattered', () => {
    const g = { nodes: nodes(8), edges: [{ from: 's0', to: 's1' }] };
    expect(realmShape(g).topology_class).toBe('scattered');
  });

  it('reports a coarse count band and an id-free tier mix', () => {
    const g = { nodes: nodes(6), edges: pathEdges(6) };
    const out = realmShape(g);
    expect(out.settlement_count_band).toBe('5_9');
    expect(out.tier_mix).toEqual({ city: 1, town: 5 });
    // never emits a node id/name
    expect(JSON.stringify(out)).not.toContain('s0');
  });

  it('falls back to the settlement list for count/tier when the graph is empty', () => {
    const out = realmShape({}, [{ tier: 'village' }, { tier: 'village' }, { tier: 'town' }]);
    expect(out.settlement_count_band).toBe('2_4');
    expect(out.tier_mix).toEqual({ village: 2, town: 1 });
    expect(out.topology_class).toBe('scattered'); // no edges → scattered
  });

  it('is total on garbage input', () => {
    expect(() => realmShape(undefined)).not.toThrow();
    expect(realmShape(undefined).settlement_count_band).toBe('single');
  });
});
