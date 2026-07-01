import { describe, expect, test } from 'vitest';

import { warResolveSignal, realmResolveSignals } from '../../../src/domain/display/warResolve.js';

/**
 * War & Resolve read-side projection (P5b). Pure, presentation-only. Proves: dormancy (a
 * peaceful/deity-free settlement is inert, never throws), the supply bypass rule (a besieged
 * town with a non-impaired teleport circle / airship is NOT granary-only), faith opposition
 * (a good+peaceable faith besieged by an evil+warbound one reads as opposed), and that a
 * besieged town's hope is read from its besiegers' real strength.
 */
function town(name, patch = {}) {
  return {
    id: name.toLowerCase(),
    name,
    tier: patch.tier || 'town',
    population: patch.population || 4000,
    config: { magicExists: patch.magicExists !== false, government: patch.government || 'Council', ...(patch.deity ? { primaryDeitySnapshot: patch.deity } : {}) },
    institutions: patch.institutions || [],
    economicState: { foodSecurity: patch.foodSecurity || { storageMonths: 6, deficitPct: 0 } },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60 },
      factions: patch.factions || [{ faction: 'Town Council', category: 'civic', power: 60, isGoverning: true }],
    },
    npcs: patch.npcs || [{ id: `n_${name}`, name: `Reeve of ${name}`, importance: 'key', temperament: 'steady' }],
  };
}
const circle = { name: 'The Astral Gate', status: 'active' }; // sniffs as 'teleportation'? no — needs the word
const teleportCircle = { name: 'Teleportation Circle', status: 'active' };
const airshipDock = { name: 'Airship Dock', status: 'active' };

describe('dormancy — a peaceful settlement is inert', () => {
  test('no war state ⇒ atWar false, hope null, no crash', () => {
    const sig = warResolveSignal({ settlement: town('Haven'), saveId: 'haven', worldState: {}, regionalGraph: null });
    expect(sig.atWar).toBe(false);
    expect(sig.besieged).toBe(false);
    expect(sig.hope).toBeNull();
    expect(sig.faith).toBeNull(); // no deity snapshot
    expect(sig.resolve).toHaveProperty('band'); // resolve is always present (latent read)
    expect(sig.supply.bypassChannel).toBeNull();
  });

  test('a totally empty settlement does not throw', () => {
    expect(() => warResolveSignal({ settlement: {}, saveId: 'x', worldState: {} })).not.toThrow();
  });
});

// A siege: Ravager besieges Aurelia (deployment ⇒ liveSieges picks it up).
const besiegingWorld = { deployments: { ravager: { targetId: 'aurelia', sinceTick: 0, role: 'siege' } }, warExhaustion: {} };

describe('supply bypass rule — a besieged circle-town is NOT granary-only', () => {
  const saves = (defenderInstitutions) => [
    { id: 'aurelia', settlement: town('Aurelia', { institutions: defenderInstitutions, foodSecurity: { storageMonths: 0.5, deficitPct: 40 } }) },
    { id: 'ravager', settlement: town('Ravager', { tier: 'city', population: 30000 }) },
  ];

  test('teleportation circle ⇒ blockade-proof supply (not starving), note says the blockade cannot touch it', () => {
    const [aurelia] = realmResolveSignals({ saves: saves([teleportCircle]), worldState: besiegingWorld });
    expect(aurelia.besieged).toBe(true);
    expect(aurelia.supply.bypassChannel).toBe('teleport');
    expect(aurelia.supply.band).toBe('supplied');
    expect(aurelia.supply.note).toMatch(/blockade cannot touch/i);
  });

  test('airship dock ⇒ running the blockade at reduced throughput, granary drains slowly', () => {
    const [aurelia] = realmResolveSignals({ saves: saves([airshipDock]), worldState: besiegingWorld });
    expect(aurelia.supply.bypassChannel).toBe('airship');
    expect(aurelia.supply.band).toBe('running the blockade');
    expect(aurelia.supply.note).toMatch(/reduced throughput|drains slowly/i);
  });

  test('no magical transport ⇒ granary alone, and a besieged low-granary town is starving', () => {
    const [aurelia] = realmResolveSignals({ saves: saves([circle]), worldState: besiegingWorld }); // 'Astral Gate' does not sniff
    expect(aurelia.supply.bypassChannel).toBeNull();
    expect(aurelia.supply.band).toBe('starving');
    expect(aurelia.supply.note).toMatch(/granary stands alone/i);
  });

  test('magicExists false ⇒ a circle is masonry, never a channel', () => {
    const s = town('Aurelia', { institutions: [teleportCircle], magicExists: false, foodSecurity: { storageMonths: 1, deficitPct: 40 } });
    const [aurelia] = realmResolveSignals({ saves: [{ id: 'aurelia', settlement: s }, { id: 'ravager', settlement: town('Ravager', { tier: 'city', population: 30000 }) }], worldState: besiegingWorld });
    expect(aurelia.supply.bypassChannel).toBeNull();
  });
});

describe('faith relation — opposed patrons under siege', () => {
  test('a good+peaceable defender besieged by an evil+warbound aggressor reads as opposed on both axes', () => {
    const saves = [
      { id: 'aurelia', settlement: town('Aurelia', { deity: { name: 'Aurel', alignmentAxis: 'good', temperamentAxis: 'peacelike' } }) },
      { id: 'ravager', settlement: town('Ravager', { tier: 'city', population: 30000, deity: { name: 'Malok', alignmentAxis: 'evil', temperamentAxis: 'warlike' } }) },
    ];
    const [aurelia] = realmResolveSignals({ saves, worldState: besiegingWorld });
    expect(aurelia.faith.patron).toEqual({ name: 'Aurel', alignment: 'good', temper: 'peacelike' });
    expect(aurelia.faith.opposed).toHaveLength(1);
    expect(aurelia.faith.opposed[0].deity).toBe('Malok');
    expect(aurelia.faith.opposed[0].opposedOn.sort()).toEqual(['alignment', 'temperament']);
  });

  test('a like-minded besieger is NOT flagged opposed', () => {
    const saves = [
      { id: 'aurelia', settlement: town('Aurelia', { deity: { name: 'Kor', alignmentAxis: 'evil', temperamentAxis: 'warlike' } }) },
      { id: 'ravager', settlement: town('Ravager', { deity: { name: 'Malok', alignmentAxis: 'evil', temperamentAxis: 'warlike' } }) },
    ];
    const [aurelia] = realmResolveSignals({ saves, worldState: besiegingWorld });
    expect(aurelia.faith.opposed).toHaveLength(0);
  });
});

describe('hope + roles read from live war state', () => {
  test('a besieged town carries hope odds ∈ [0,1] and names its besiegers; the besieger is marked besieging', () => {
    const saves = [
      { id: 'aurelia', settlement: town('Aurelia') },
      { id: 'ravager', settlement: town('Ravager', { tier: 'city', population: 40000 }) },
    ];
    const list = realmResolveSignals({ saves, worldState: besiegingWorld });
    const aurelia = list.find(s => s.id === 'aurelia');
    const ravager = list.find(s => s.id === 'ravager');
    expect(aurelia.besieged).toBe(true);
    expect(aurelia.besiegedBy).toContain('ravager');
    expect(aurelia.hope.odds).toBeGreaterThanOrEqual(0);
    expect(aurelia.hope.odds).toBeLessThanOrEqual(1);
    expect(ravager.besieging).toContain('aurelia');
    expect(ravager.besieged).toBe(false);
    expect(ravager.hope).toBeNull(); // not under siege
  });

  test('realmResolveSignals is codepoint-sorted by id', () => {
    const saves = [{ id: 'zeta', settlement: town('Zeta') }, { id: 'alpha', settlement: town('Alpha') }];
    const ids = realmResolveSignals({ saves, worldState: {} }).map(s => s.id);
    expect(ids).toEqual(['alpha', 'zeta']);
  });
});
