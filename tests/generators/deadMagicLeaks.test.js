/**
 * tests/generators/deadMagicLeaks.test.js — Wave 5 #3 (dead-magic leaks).
 *
 * Magic-as-supplement is load-bearing: when a tradition props up an impaired
 * chain, the DM must see it (magicNote / magically_sustained). These pins keep
 * that supplement HONEST about whether magic exists at all:
 *
 *   - The divine food tradition was the one tradition with no magic gate
 *     (druid/arcane/alchemy ride magicPriority thresholds), so a
 *     magicExists:false campaign still read 'Temple granaries blessed; divine
 *     provision fills the gap' — the plan's flagship dead-magic leak.
 *   - hasTeleportationInfra sniffed institution names only, so a legacy
 *     'Teleportation circle' kept magical trade alive in a no-magic world at
 *     every call site that didn't re-check magicExists externally.
 *
 * resolveConfig zeroes the magic dial when config.magicExists === false, so
 * magicPriority 0 is the dead-magic signal inside the chain layer; the
 * economicGenerator call site also threads magicExists -> 0 defensively.
 * A magic-enabled world (dial >= 1) keeps every current behavior.
 *
 * (Producer contract + the gen→sim 'substituted' seam live in
 * chainMagicSubstitution.test.js — this file owns the existence gate.)
 */

import { describe, it, expect } from 'vitest';
import { computeActiveChains } from '../../src/generators/computeActiveChains.js';
import { applyMagicSubstitution } from '../../src/generators/chainMagicSubstitution.js';
import { hasTeleportationInfra } from '../../src/generators/priorityHelpers.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const inst = (...names) => names.map(name => ({ name }));

// Monastery satisfies BOTH divine tradition lists (institution + clergy proxy);
// Mill activates the grain chain; grain_fields present-but-depleted puts the
// chain on the substitution path. No druid/arcane/alchemy institutions, so the
// divine tradition is the only candidate substitute.
const depletedGrainVillage = (magicPriority) => computeActiveChains(
  inst('Monastery', 'Mill'),
  ['grain_fields'],
  'village',
  'road',
  [],
  ['grain_fields'],
  magicPriority,
);

describe('divine food tradition requires a world where magic functions (Wave 5 #3)', () => {
  it('control: in a magic world the blessed-granaries supplement fires and is visible', () => {
    const grain = depletedGrainVillage(50).find(c => c.chainId === 'grain');
    expect(grain).toBeTruthy();
    expect(grain.magicNote).toBe('Temple granaries blessed; divine provision fills the gap');
    expect(grain.magicRecovery).toBe(0.40);
    expect(grain.exportable).toBe(false); // supplement feeds locals, never exports
  });

  it('the divine supplement fires at ANY magic-enabled dial (>= 1) — no behavior change for magic worlds', () => {
    const grain = depletedGrainVillage(1).find(c => c.chainId === 'grain');
    expect(grain.magicNote).toBe('Temple granaries blessed; divine provision fills the gap');
  });

  it('dead-magic world (dial 0): religion stays, divine provision does not', () => {
    const chains = depletedGrainVillage(0);
    const grain = chains.find(c => c.chainId === 'grain');
    expect(grain).toBeTruthy(); // the chain itself still exists (depleted, mundane)
    expect(grain.resourceDepleted).toBe(true);
    for (const c of chains) {
      expect(c.magicNote).toBeUndefined();
      expect(c.magicRecovery).toBeUndefined();
      expect(c.status).not.toBe('magically_sustained');
    }
    expect(JSON.stringify(chains)).not.toMatch(/blessed|divine provision/i);
  });
});

describe('applyMagicSubstitution internal dead-magic guard', () => {
  const allTraditions = { druid: true, divine: true, arcane: true, alchemy: true };
  const impairedGrain = () => ([{ chainId: 'grain', status: 'impaired', resourceDepleted: true, exportable: true }]);

  it('at magic 0 no tradition substitutes, however the traditions object was built', () => {
    const chains = impairedGrain();
    applyMagicSubstitution(chains, allTraditions, 0, 'town');
    expect(chains[0].status).toBe('impaired');
    expect(chains[0].magicNote).toBeUndefined();
    expect(chains[0].exportable).toBe(true);
  });

  it('magic world unchanged: druids sustain the same impaired chain', () => {
    const chains = impairedGrain();
    applyMagicSubstitution(chains, allTraditions, 50, 'town');
    expect(chains[0].status).toBe('magically_sustained'); // druid 0.65 >= 0.55
    expect(chains[0].magicNote).toMatch(/Druidic cultivation/);
  });
});

describe('hasTeleportationInfra is internally gated on magicExists (Wave 5 #3)', () => {
  const circle = inst('Teleportation circle');

  it('a legacy Teleportation circle is inert masonry in a dead-magic world', () => {
    expect(hasTeleportationInfra(circle, { magicExists: false })).toBe(false);
  });

  it('every magical-transit sniff goes dark, Airship Dock included', () => {
    // The helper sniffs teleportation/planar/extradimensional/airship names —
    // the guard sits above ALL of them, so each reads false in a no-magic world.
    expect(hasTeleportationInfra(inst('Airship Dock'), { magicExists: false })).toBe(false);
    expect(hasTeleportationInfra(inst('Extradimensional warehouse'), { magicExists: false })).toBe(false);
    expect(hasTeleportationInfra(inst('Airship Dock'), {})).toBe(true); // magic world control
  });

  it('a stale _magicTradeOnly flag cannot resurrect magical transit either', () => {
    expect(hasTeleportationInfra(circle, { magicExists: false, _magicTradeOnly: true })).toBe(false);
    expect(hasTeleportationInfra([], { magicExists: false, _magicTradeOnly: true })).toBe(false);
  });

  it('magic worlds keep every current behavior', () => {
    expect(hasTeleportationInfra(circle, {})).toBe(true);
    expect(hasTeleportationInfra(circle, { magicExists: true })).toBe(true);
    expect(hasTeleportationInfra(inst('Planar embassy'), {})).toBe(true);
    expect(hasTeleportationInfra([], { _magicTradeOnly: true })).toBe(true);
    expect(hasTeleportationInfra(inst('Granary'), {})).toBe(false);
  });
});

// ── Full-pipeline leak scan + magic-world identity ───────────────────────

describe('generation-level pins (Wave 5 #3)', () => {
  it('a magicExists:false generation leaks no magical sustenance anywhere in the settlement', () => {
    const s = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic', magicExists: false },
      null,
      { seed: 'wave5-dead-magic-city', customContent: {} },
    );
    const chains = s.economicState?.activeChains || [];
    expect(chains.length).toBeGreaterThan(0);
    for (const c of chains) {
      expect(c.status).not.toBe('magically_sustained');
      expect(c.magicNote).toBeUndefined();
    }
    const json = JSON.stringify(s);
    expect(json).not.toMatch(/Temple granaries blessed/i);
    expect(json).not.toMatch(/magically.sustained/i);
    expect(json).not.toMatch(/divine provision/i);
  });

  it('same-seed identity: a magic-enabled fixture reproduces its chain economy exactly', () => {
    const run = () => generateSettlementPipeline(
      { settType: 'town', culture: 'germanic', priorityMagic: 60 },
      null,
      { seed: 'wave5-magic-identity', customContent: {} },
    );
    const a = run();
    const b = run();
    expect(JSON.stringify(a.economicState?.activeChains)).toBe(JSON.stringify(b.economicState?.activeChains));
    expect(a.institutions.map(i => i.name)).toEqual(b.institutions.map(i => i.name));
  });
});
