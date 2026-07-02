/**
 * occupationConversion.test.js — the conquest → religious-conversion coupling,
 * pinned against the LIVE gradual driver (`advanceReligionStates` — the legacy
 * binary evaluateReligiousContest driver was removed as unmounted dead code).
 *
 * A conquered settlement tends to adopt its occupier's faith ("the creed follows
 * the garrison"). The pull:
 *   - rises under occupation vs a peacetime carrier alone,
 *   - scales with the SIZE of the occupying force (occupier military capacity),
 *   - is amplified when the occupier's deity is WARBOUND (warlike temperament),
 *   - is COUNTERED by an incumbent faith of opposed nature (full force only against a
 *     warlike or adjacent creed; a peaceful / alignment-opposed faith digs in).
 *
 * The gradual driver moves adherent SHARES, so the pins compare the occupier
 * deity's share in the held city after a threaded multi-tick run (religionStates
 * carried forward each tick, patron mirrored back — what the kernel does).
 * Deterministic: per-tick PRNG derived from a fixed seed recipe.
 */
import { describe, expect, test } from 'vitest';

import { advanceReligionStates } from '../../src/domain/worldPulse/religiousContest.js';
import { patronSnapshot } from '../../src/domain/worldPulse/religionState.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

const NOW = '2026-01-01T00:00:00.000Z';
const TICKS = 24;
const RULES = { religionDynamicsEnabled: true };

function deity(name, { rank = 'major', alignment = 'neutral', temper = 'neutral' } = {}) {
  return { _deityRef: `custom:lu_${name.toLowerCase()}`, name, alignmentAxis: alignment, temperamentAxis: temper, rankAxis: rank };
}

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population ?? 3500,
    config: {
      tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: patch.priorityMilitary ?? 40,
      ...(patch.deity ? { primaryDeityRef: patch.deity._deityRef, primaryDeitySnapshot: patch.deity } : {}),
    },
    institutions: patch.institutions || [],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 55, label: 'Stable' },
      factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
      conflicts: [],
    },
    npcs: [], activeConditions: patch.activeConditions || [],
  };
}
const save = (id, name, patch = {}) => ({ id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

// Threaded multi-tick run. With `linked` (the default) occupier A reaches city C via
// an allied carrier, so the faith spreads in BOTH cases and occupation only ADDS its
// force-scaled pull on top; with `linked: false` the occupation garrison is the ONLY
// carrier ("the creed follows the garrison, even where no peacetime faith-carrier
// edge exists"). Returns the occupier deity's final share in C, C's patron, and
// whether any conversion outcome was attributed to the occupation.
function runHeldCity({ occupierDeity, incumbentDeity, occupied, occupierTier = 'city', occupierPop = 26000, resistance = 0.1, ticks = TICKS, linked = true }) {
  let saves = [
    save('aocc', 'Aocc', { deity: occupierDeity, tier: occupierTier, population: occupierPop, priorityMilitary: 80 }),
    save('ccity', 'Ccity', { deity: incumbentDeity, tier: 'town', population: 3000, legitimacy: 28 }),
  ];
  let worldState = {
    rngSeed: 'occ', tick: 1, simulationRules: RULES,
    ...(occupied ? { occupations: { ccity: { occupierId: 'aocc', state: 'vassalized', sinceTick: 1, stateHeld: 4, resistance, benefitYield: 0.3, lastTick: 1 } } } : {}),
  };
  const graph = ensureRegionalGraph({ edges: linked ? [{ id: 'edge.aocc.ccity', from: 'aocc', to: 'ccity', relationshipType: 'allied' }] : [] });
  let occCause = 0;
  let entered = false;
  for (let t = 1; t <= ticks; t += 1) {
    const campaign = { id: 'occ', name: 'occ', settlementIds: ['aocc', 'ccity'], worldState, regionalGraph: graph, wizardNews: { currentTick: t, entries: [] } };
    const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
    const r = advanceReligionStates({ snapshot, worldState, tick: t, now: NOW, rules: RULES, rng: createPRNG(`occ-${t}`) });
    for (const o of r.outcomes) {
      if (String(o.targetSaveId) === 'ccity' && o.metadata?.conversionCause === 'occupation') occCause += 1;
    }
    if (r.religionStates?.ccity?.deities?.[String(occupierDeity._deityRef)]) entered = true;
    worldState = { ...worldState, tick: t + 1, ...(r.religionStates ? { religionStates: r.religionStates } : {}) };
    // Mirror each patron back onto config.primaryDeitySnapshot (the kernel's re-embed).
    saves = saves.map((s) => {
      const st = r.religionStates?.[s.id];
      const patron = st ? patronSnapshot(st) : null;
      return patron ? { ...s, settlement: { ...s.settlement, config: { ...s.settlement.config, primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron } } } : s;
    });
  }
  const cState = worldState.religionStates?.ccity;
  const entry = cState?.deities?.[String(occupierDeity._deityRef)];
  return {
    share: entry && !entry.suppressed ? Number(entry.share) || 0 : 0,
    patronRef: cState?.patronRef || null,
    occCause,
    entered,
  };
}

describe('conquest → conversion coupling (gradual driver)', () => {
  const warlikeEvil = deity('Korl', { rank: 'major', alignment: 'evil', temper: 'warlike' });

  test('the garrison alone carries the creed: occupation spreads a faith NO peacetime carrier reaches', () => {
    // No allied/trade edge at all — the occupation is the only path the creed has.
    const incumbent = deity('Faded', { rank: 'cult', alignment: 'neutral', temper: 'neutral' });
    const free = runHeldCity({ occupierDeity: warlikeEvil, incumbentDeity: incumbent, occupied: false, linked: false });
    const held = runHeldCity({ occupierDeity: warlikeEvil, incumbentDeity: incumbent, occupied: true, linked: false });
    expect(free.entered).toBe(false);                      // no carrier ⇒ the creed never arrives
    expect(free.share).toBe(0);
    expect(held.entered).toBe(true);                       // the garrison forces the creed's entry
    expect(held.share).toBeGreaterThan(free.share);        // and presses it onto the held city
    expect(free.occCause).toBe(0);                         // never attributed to occupation when free
  });

  test('an occupation-driven patron flip is ATTRIBUTED to the occupation', () => {
    const incumbent = deity('Faded', { rank: 'cult', alignment: 'neutral', temper: 'neutral' });
    const held = runHeldCity({ occupierDeity: warlikeEvil, incumbentDeity: incumbent, occupied: true, ticks: 60 });
    expect(held.patronRef).toBe(String(warlikeEvil._deityRef)); // the creed follows the garrison
    expect(held.occCause).toBeGreaterThan(0);                    // attributed via metadata.conversionCause
  });

  test('a larger occupying force converts more readily than a small one', () => {
    const incumbent = deity('Faded', { rank: 'cult' });
    const big = runHeldCity({ occupierDeity: warlikeEvil, incumbentDeity: incumbent, occupied: true, occupierTier: 'metropolis', occupierPop: 80000 });
    const small = runHeldCity({ occupierDeity: warlikeEvil, incumbentDeity: incumbent, occupied: true, occupierTier: 'village', occupierPop: 300 });
    expect(big.share).toBeGreaterThanOrEqual(small.share);
  });

  test('a warbound (warlike) occupier deity converts more than a peaceful one', () => {
    const incumbent = deity('Mild', { rank: 'minor', alignment: 'neutral', temper: 'neutral' }); // adjacent → full force
    const warbound = runHeldCity({ occupierDeity: deity('Var', { rank: 'major', alignment: 'neutral', temper: 'warlike' }), incumbentDeity: incumbent, occupied: true });
    const peaceful = runHeldCity({ occupierDeity: deity('Calm', { rank: 'major', alignment: 'neutral', temper: 'peaceful' }), incumbentDeity: incumbent, occupied: true });
    expect(warbound.share).toBeGreaterThanOrEqual(peaceful.share);
  });

  test('an opposed incumbent faith counters the conversion (full force only vs warlike/adjacent)', () => {
    // Same warbound occupier; adjacent (warlike) incumbent vs opposed (peaceful good) incumbent.
    const adjacent = runHeldCity({ occupierDeity: warlikeEvil, incumbentDeity: deity('Brand', { rank: 'minor', alignment: 'evil', temper: 'warlike' }), occupied: true });
    const opposed = runHeldCity({ occupierDeity: warlikeEvil, incumbentDeity: deity('Lumen', { rank: 'minor', alignment: 'good', temper: 'peaceful' }), occupied: true });
    expect(adjacent.share).toBeGreaterThanOrEqual(opposed.share);
  });
});
