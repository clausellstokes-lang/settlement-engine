/**
 * cohesionWeave.test.js — THE COHESION WEAVE battery (E1a companion; design
 * DESIGN_COHESION_WEAVE.md §B + §C). Covers: the four faith×alignment quadrants + their
 * generosity modulators, the cross-pressure peacemaker read, and the structural-lens
 * table (economic base × ruling power) with its generosity-relevant modulators.
 */
import { describe, it, expect } from 'vitest';
import {
  QUADRANT_TUNING, ECONOMIC_BASES, RULING_POWERS,
  faithAlignmentQuadrant, crossPressureMediation,
  structuralLens, normalizeEconomicBase, rulingPowerFromArchetype,
} from '../../src/domain/spatial/cohesionWeave.js';

describe('§B faith × alignment quadrants — the four named postures', () => {
  it('same patron + kindred alignment ⇒ BROTHERS (max bond, generosity easiest)', () => {
    const q = faithAlignmentQuadrant({ samePatron: true, alignmentKinship01: 0.9 });
    expect(q.quadrant).toBe('brothers');
    expect(q.modulators.bond).toBeGreaterThan(1);
    expect(q.modulators.gate).toBeGreaterThan(1);
  });
  it('same patron + opposite alignment ⇒ SCHISM_AXIS (guilt-driven: conscience up, bond down)', () => {
    const q = faithAlignmentQuadrant({ samePatron: true, alignmentKinship01: 0.1 });
    expect(q.quadrant).toBe('schism_axis');
    expect(q.modulators.conscience).toBeGreaterThan(1);
    expect(q.modulators.bond).toBeLessThan(1);
  });
  it('rival patron + kindred alignment ⇒ RESPECTABLE_RIVAL (neutral — runs on strategy/history)', () => {
    const q = faithAlignmentQuadrant({ samePatron: false, alignmentKinship01: 0.8 });
    expect(q.quadrant).toBe('respectable_rival');
  });
  it('rival patron + opposite alignment ⇒ NATURAL_ENEMY (the gate almost never opens)', () => {
    const q = faithAlignmentQuadrant({ samePatron: false, alignmentKinship01: 0.1 });
    expect(q.quadrant).toBe('natural_enemy');
    expect(q.modulators.gate).toBeLessThan(1);
    expect(q.modulators.bond).toBeLessThan(1);
  });
  it('garbage/absent inputs land on a defined quadrant (total on garbage — never throws)', () => {
    const q = faithAlignmentQuadrant();
    expect(['brothers', 'schism_axis', 'respectable_rival', 'natural_enemy']).toContain(q.quadrant);
  });
});

describe('§B cross-pressure peacemaker — the torn neighbour becomes the mediator', () => {
  it('a mediator who is a faith-brother of A and an alignment-kin of B is CROSS-PRESSURED', () => {
    const toA = faithAlignmentQuadrant({ samePatron: true, alignmentKinship01: 0.9 });   // brothers (faith-led)
    const toB = faithAlignmentQuadrant({ samePatron: false, alignmentKinship01: 0.9 });  // respectable rival (alignment-led)
    const cp = crossPressureMediation({ toA, toB });
    expect(cp.crossPressured).toBe(true);
    expect(cp.mediationImpulse).toBeGreaterThan(0);
  });
  it('a mediator who relates to both sides the SAME way is not cross-pressured (just picks a side)', () => {
    const toA = faithAlignmentQuadrant({ samePatron: true, alignmentKinship01: 0.9 });
    const toB = faithAlignmentQuadrant({ samePatron: true, alignmentKinship01: 0.9 });
    expect(crossPressureMediation({ toA, toB }).crossPressured).toBe(false);
  });
  it('a natural enemy of one side is not a broker', () => {
    const toA = faithAlignmentQuadrant({ samePatron: true, alignmentKinship01: 0.9 });
    const toB = faithAlignmentQuadrant({ samePatron: false, alignmentKinship01: 0.1 }); // natural enemy
    expect(crossPressureMediation({ toA, toB }).crossPressured).toBe(false);
  });
});

describe('§C structural lenses — economic base × ruling power', () => {
  it('a temple/theocratic seat gives ALMS (conscience up); a merchant league gives LOANS (leverage up)', () => {
    const temple = structuralLens({ economicBase: 'agrarian', governingArchetype: 'religious' });
    const league = structuralLens({ economicBase: 'trade_hub', governingArchetype: 'merchant' });
    expect(temple.rulingPower).toBe('theocracy');
    expect(temple.modulators.conscience).toBeGreaterThan(1);
    expect(league.rulingPower).toBe('merchant_league');
    expect(league.modulators.leverage).toBeGreaterThan(1);
    expect(league.modulators.conscience).toBeLessThan(1); // "they'll trade with anyone"
  });
  it('a warlord (military/noble seat) gives only STRATEGY (conscience down, strategy up)', () => {
    const warlord = structuralLens({ economicBase: 'extraction', governingArchetype: 'military' });
    expect(warlord.rulingPower).toBe('autocrat');
    expect(warlord.modulators.strategy).toBeGreaterThanOrEqual(1);
  });
  it('a council widens the decision deadband (averaged, sticky decisions — §C tempo)', () => {
    const council = structuralLens({ economicBase: 'mixed', governingArchetype: 'government' });
    expect(council.rulingPower).toBe('council');
    expect(council.hysteresisWiden).toBeGreaterThan(1);
    expect(council.legitimacyNerve).toBe('unrest');
  });
  it('a trade-hub economy fears route cuts and prices an upstream partner\'s famine more heavily', () => {
    const hub = structuralLens({ economicBase: 'trade_hub', governingArchetype: 'merchant' });
    const agrarian = structuralLens({ economicBase: 'agrarian', governingArchetype: 'merchant' });
    expect(hub.modulators.supplyFear).toBeGreaterThan(agrarian.modulators.supplyFear);
  });
  it('normalizeEconomicBase + rulingPowerFromArchetype fail soft to defined values', () => {
    expect(ECONOMIC_BASES).toContain(normalizeEconomicBase('mining'));
    expect(normalizeEconomicBase('gibberish')).toBe('mixed');
    expect(RULING_POWERS).toContain(rulingPowerFromArchetype('criminal'));
    expect(rulingPowerFromArchetype('unknown')).toBe('mixed');
  });
});
