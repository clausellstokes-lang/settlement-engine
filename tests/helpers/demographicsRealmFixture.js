/**
 * tests/helpers/demographicsRealmFixture.js — THE ONE DEMOGRAPHIC REALM FIXTURE.
 *
 * EXTRACTED VERBATIM from demographicsCure.test.js, which authored it, and the extraction
 * is the whole point: the CURE suite proves the model plateaus over three hundred years,
 * and the ENVELOPE suite (CAPACITY C3) asks whether the same model has anything to SHOW a
 * reader inside thirty. Those two questions are only comparable if they are asked of the
 * SAME realm. Two hand-copied realms that drift by one settlement produce two answers that
 * cannot be read against each other, and the estate's own most-bitten class is a quantity
 * with more than one home.
 *
 * ⛔ NOT A TUNING SURFACE. Every number below is a FIXTURE INPUT — a starting population and
 * a daily harvest — not a dial the engine reads. The dials live in the demographics family
 * and are the owner's, signed last. Changing a number here changes what the suites MEASURE,
 * never what the engine DOES, and any such change must state which suite's finding it moves.
 *
 * Pure: no store, no React, no clock, no randomness, no I/O.
 *
 * @enforced-by tests/domain/demographicsCure.test.js, tests/domain/demographicsEnvelope.test.js
 */
import {
  densityCeilingOf, effectiveBoundOf, foodCapacityOf,
} from '../../src/domain/worldPulse/demographicsRates.js';

/** The world every suite here runs in: the demographic term LIT. */
export const LIT = Object.freeze({ simulationRules: { demographicsEnabled: true } });

/** @param {{ id: string, tier: string, terrain: string, population: number, dailyProduction: number }} spec */
export function place({ id, tier, terrain, population, dailyProduction }) {
  return {
    population, tier, name: id,
    config: { tier, terrainType: terrain },
    economicState: {
      foodSecurity: {
        dailyNeed: population * 2, dailyProduction, deficitPct: 0, surplusPct: 5,
        importDependency: 0.2, storageMonths: 6, resilienceScore: 60,
      },
    },
    npcs: [],
  };
}

/** A realm shaped like the failing soak's: every tier, every terrain class, mixed
 *  granary-bound and wall-bound, from a thorp to a metropolis. */
export const REALM = Object.freeze([
  ['Ashford', { tier: 'town', terrain: 'plains', population: 1200, dailyProduction: 6000 }],
  ['Brackwater', { tier: 'hamlet', terrain: 'riverside', population: 320, dailyProduction: 1600 }],
  ['Cairnhold', { tier: 'thorp', terrain: 'mountain', population: 40, dailyProduction: 300 }],
  ['Dunmarch', { tier: 'city', terrain: 'hills', population: 7000, dailyProduction: 30000 }],
  ['Elderfen', { tier: 'village', terrain: 'forest', population: 700, dailyProduction: 2600 }],
  ['Fallowmere', { tier: 'metropolis', terrain: 'coastal', population: 30000, dailyProduction: 130000 }],
]);

export const realmUpdates = () => REALM.map(([id, spec]) => ({ saveId: id, settlement: place({ id, ...spec }) }));

/** @param {Array<{ saveId: string, settlement: object }>} updates */
export const snapshotOf = (updates) => ({
  settlements: updates.map((u) => ({ id: u.saveId, name: u.saveId, settlement: u.settlement })),
});

/** The authored bound each settlement is measured against, read from the live tables.
 *  @param {Array<{ saveId: string, settlement: object }>} updates @returns {Map<string, number>} */
export function boundsOf(updates) {
  const out = new Map();
  for (const u of updates) {
    out.set(u.saveId, effectiveBoundOf(foodCapacityOf(u.settlement, LIT, u.saveId), densityCeilingOf(u.settlement)).bound);
  }
  return out;
}
