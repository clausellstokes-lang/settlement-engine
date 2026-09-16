/**
 * tests/domain/crisisConversion.test.js — Phase 4 W-F4 "chaos converts in the cracks".
 *
 * A CHAOS-SIDE creed reads extra conversion receptivity where order is broken. The
 * bonus is ADDITIVE to a newcomer's receptivity (never its patron fit), keyed on the
 * deity's chaos coordinate and a bounded DISORDER scalar over five contexts (active
 * stressors, war/occupation, the small-tier ladder, compromise depth, inverse
 * prosperity). Pinned here through the live driver:
 *  - ASYMMETRY: in the SAME disordered settlement a chaotic creed converts FASTER
 *    than an otherwise-identical lawful creed (the lawful creed takes NO mirror
 *    penalty — its lift is exactly 0).
 *  - CRACKS: the same chaotic creed converts faster in a disordered thorp than in a
 *    stable peaceful settlement.
 *  - STABLE-PEACE BYTE-IDENTITY: in a stable high-tier peace the disorder scalar is
 *    0, so a chaotic and a lawful creed convert IDENTICALLY — the chaos axis is
 *    invisible to conversion exactly as before the term existed.
 */

import { describe, expect, test } from 'vitest';
import { advanceReligionStates } from '../../src/domain/worldPulse/religiousContest.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/kernel/prng.js';

const NOW = '2026-01-01T00:00:00.000Z';

function deity(name, { rank = 'major', law = 'neutral', align = 'neutral' } = {}) {
  // W-F5 stage-1 re-fixture (axis retirement): temper DERIVES from alignment, so the
  // authoring knob is `align` (never a stored temper). The embedded temperamentAxis
  // mirrors the derivation for shape honesty — it is inert to every engine temper read.
  const temper = align === 'evil' ? 'warlike' : align === 'good' ? 'peacelike' : 'neutral';
  return { _deityRef: `custom:lu_${name.toLowerCase()}`, name, alignmentAxis: align, temperamentAxis: temper, lawAxis: law, rankAxis: rank };
}

function settlement(name, { patron, prosperity = 'Moderate', crimeZero = false } = {}) {
  // A fixed high-capacity tier (city) so the source coexists with the incumbent
  // (shares reflect relative strength, never a forced single-deity monopoly).
  const safetyProfile = crimeZero ? { compound: { criminalEffective: 0 }, safetyRatio: 2.5 } : {};
  return {
    name, tier: 'city', population: 40000,
    config: { tradeRouteAccess: 'road', ...(patron ? { primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron } : {}) },
    institutions: [],
    economicState: { primaryExports: [], primaryImports: [], prosperity, safetyProfile },
    powerStructure: {
      publicLegitimacy: { score: 30, label: 'Shaky' },
      factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
      conflicts: [],
    },
    npcs: [], activeConditions: [],
  };
}

const save = (id, name, opts) => ({ id, name, phase: 'canon', settlement: settlement(name, opts), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

/**
 * Drive N ticks of the source creed spreading into convert C, feeding religionStates
 * back each tick. Returns C's share of the source creed after N ticks. A LAW-NEUTRAL
 * GOOD-aligned incumbent (derived temper: peacelike) keeps C contested and sits in a
 * DIFFERENT niche (so the neutral-niche source coexists), while methodClash(source,
 * incumbent) = 0 for both a chaotic and a lawful source — isolating the crisis
 * receptivity lift as the only differentiator.
 */
function convertShare({ sourceLaw, prosperity, stressed, crimeZero = false }, ticks = 40) {
  // Ranks chosen so the source's equilibrium share is STRENGTH-limited (not step-
  // limited): a step-limited climb hides the receptivity lift; the equilibrium plateau
  // exposes it. Run to equilibrium (~40 ticks) so the plateau, not the climb, is read.
  // The incumbent is GOOD-aligned so its DERIVED niche (peacelike:good) stays distinct
  // from the neutral-aligned source's (neutral:neutral) — coexistence preserved, and
  // both the chaotic and lawful source variants face the SAME incumbent (aligned
  // channels cancel in the comparison; the crisis lift stays the only differentiator).
  const src = deity('Storm', { rank: 'minor', law: sourceLaw });
  const incumbent = deity('Faded', { rank: 'cult', law: 'neutral', align: 'good' });
  const saves = [save('src', 'Src', { patron: src }), save('cconv', 'Cconv', { prosperity, patron: incumbent, crimeZero })];
  const stressors = stressed ? [{ id: 'st1', type: 'famine', status: 'active', severity: 0.9, affectedSettlementIds: ['cconv'] }] : [];
  const regionalGraph = ensureRegionalGraph({ edges: [{ id: 'edge.src.cconv', from: 'src', to: 'cconv', relationshipType: 'allied' }], channels: [] });
  const campaign = { id: 'fx', name: 'fx', settlementIds: ['src', 'cconv'], regionalGraph, worldState: {} };
  let religionStates = {};
  for (let t = 0; t < ticks; t++) {
    const worldState = { rngSeed: 'seed', tick: t, simulationRules: { faithSpreadEnabled: true }, stressors, religionStates };
    const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
    const res = advanceReligionStates({ snapshot, worldState, tick: t, now: NOW, rules: { faithSpreadEnabled: true }, rng: createPRNG(`seed::${t}`) });
    religionStates = res.religionStates || {};
  }
  return Number(religionStates?.cconv?.deities?.[src._deityRef]?.share) || 0;
}

describe('crisis conversion — chaos converts in the cracks', () => {
  test('ASYMMETRY: in the same disordered settlement a chaotic creed converts faster than a lawful one', () => {
    const chaotic = convertShare({ sourceLaw: 'chaotic', prosperity: 'Struggling', stressed: true });
    const lawful = convertShare({ sourceLaw: 'lawful', prosperity: 'Struggling', stressed: true });
    expect(chaotic).toBeGreaterThan(0);
    expect(chaotic).toBeGreaterThan(lawful);
  });

  test('CRACKS: the same chaotic creed converts faster where order is broken than in stable prosperity', () => {
    const crisis = convertShare({ sourceLaw: 'chaotic', prosperity: 'Struggling', stressed: true });
    const calm = convertShare({ sourceLaw: 'chaotic', prosperity: 'Wealthy', stressed: false, crimeZero: true });
    expect(crisis).toBeGreaterThan(calm);
  });

  test('STABLE-PEACE BYTE-IDENTITY: with disorder zero a chaotic and lawful creed convert identically', () => {
    // Wealthy, un-stressed, crime-zeroed, high tier ⇒ disorder scalar 0 ⇒ the chaos
    // axis is invisible to conversion exactly as before the term existed (no lift).
    const chaotic = convertShare({ sourceLaw: 'chaotic', prosperity: 'Wealthy', stressed: false, crimeZero: true });
    const lawful = convertShare({ sourceLaw: 'lawful', prosperity: 'Wealthy', stressed: false, crimeZero: true });
    expect(chaotic).toBe(lawful);
  });
});
