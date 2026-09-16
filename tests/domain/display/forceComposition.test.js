import { describe, expect, test } from 'vitest';

import {
  UNIT_TYPES,
  FORCE_COMPOSITION_TABLES,
  contingentTotal,
  deriveForceComposition,
  forceCompositionLine,
  forceCompositionStandings,
} from '../../../src/domain/display/forceComposition.js';
import { magicRoleBands } from '../../../src/domain/magicProfile.js';
import { ARMY_STRENGTH_PHRASES } from '../../../src/domain/display/armyStrength.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';

// ─────────────────────────────────────────────────────────────────────────────
// WEAVE NAME-4 — the typed force-composition clerk. This suite replaces the
// house no-digit-leak assertion (which cannot apply to a clerk whose charter is
// to return integers) with the two invariants that carry the same weight: the
// keys are a subset of the frozen vocabulary, and the counts sum EXACTLY to the
// banded total. The prose half is still held to the no-digit law.
// ─────────────────────────────────────────────────────────────────────────────

const NAMES = /** @type {Record<string, string>} */ ({ ashford: 'Ashford', kelby: 'Kelby' });
const nameFor = (/** @type {unknown} */ id) => NAMES[String(id)] || String(id);

/** A STATEFUL deployment record, as warArmyRecord.seedDeploymentState builds one. */
const record = (/** @type {Record<string, unknown>} */ over = {}) => ({
  targetId: 'ashford',
  sinceTick: 4,
  role: 'siege',
  objective: 'conquest',
  maxStartStrength: 70,
  currentEffectiveStrength: 70,
  accumulatedAttrition: 0,
  manpower: 0.7,
  morale: 0.6,
  commandQuality: 0.65,
  equipmentCondition: 0.55,
  supplyIntegrity: 0.6,
  foodReserve: 0.6,
  magicSupport: 0.5,
  logisticsBurden: 0.3,
  returnCondition: 'pending',
  ...over,
});

const deadMagic = { name: 'Kelby', config: { magicExists: false, magicLevel: 'none' }, institutions: [], factions: [] };
/** A living-magic realm whose ARCANE faction power decides the military role band. */
const magicRealm = (/** @type {number} */ arcanePower) => ({
  name: 'Kelby',
  config: { magicExists: true, magicLevel: 'high' },
  institutions: [{ name: "Wizard's tower" }, { name: 'Arcane academy' }],
  factions: [{ name: "Mages' Guild", power: arcanePower }],
});

const sumOf = (/** @type {Record<string, number>} */ c) => Object.values(c).reduce((a, b) => a + b, 0);

describe('force composition — the frozen vocabulary and the summing invariant', () => {
  test('the vocabulary is codepoint-ordered, unique, and every member is authored', () => {
    expect([...UNIT_TYPES].sort()).toEqual([...UNIT_TYPES]);
    expect(new Set(UNIT_TYPES).size).toBe(UNIT_TYPES.length);
    for (const type of UNIT_TYPES) {
      expect(FORCE_COMPOSITION_TABLES.UNIT_WORDS[type], `${type} has no world word`).toBeDefined();
      expect(FORCE_COMPOSITION_TABLES.MUSTER_ORDER, `${type} is missing from the muster order`).toContain(type);
    }
    expect([...FORCE_COMPOSITION_TABLES.MUSTER_ORDER].sort()).toEqual([...UNIT_TYPES]);
  });

  test('the contingent bands are cut at armyStrength\'s own floors', () => {
    const strengthFloors = ARMY_STRENGTH_PHRASES.STRENGTH_BANDS.map((b) => b.floor);
    expect(FORCE_COMPOSITION_TABLES.CONTINGENT_BANDS.map((b) => b.floor)).toEqual(strengthFloors);
  });

  test('every key is in the vocabulary and the counts sum to the banded total, across the reachable space', () => {
    let sawEveryCoreType = new Set();
    for (const strength of [0, 5, 26, 41, 42, 59, 60, 77, 78, 100]) {
      for (const objective of ['conquest', 'field']) {
        for (const readiness of [undefined, 0.9]) {
          for (const settlement of [deadMagic, magicRealm(70)]) {
            const composition = deriveForceComposition({
              settlement,
              record: record({ currentEffectiveStrength: strength, objective, role: objective === 'conquest' ? 'siege' : 'field', ...(readiness === undefined ? {} : { readiness }) }),
            });
            expect(composition, `strength ${strength} produced no composition`).not.toBeNull();
            for (const key of Object.keys(composition)) {
              expect(UNIT_TYPES, `${key} is outside the frozen vocabulary`).toContain(key);
              expect(Number.isInteger(composition[key]) && composition[key] > 0).toBe(true);
              sawEveryCoreType.add(key);
            }
            expect(sumOf(composition), `strength ${strength} did not sum to its band`)
              .toBe(contingentTotal(strength));
          }
        }
      }
    }
    // Anti-vacuity: the sweep above must actually have drawn every type, or the
    // subset assertion would pass on a vocabulary nothing can produce.
    expect([...sawEveryCoreType].sort()).toEqual([...UNIT_TYPES]);
  });
});

describe('force composition — what the record decides', () => {
  test('a bigger host fields more contingents, monotonically', () => {
    const totals = [0, 26, 42, 60, 78].map(contingentTotal);
    expect(totals).toEqual([...totals].sort((a, b) => a - b));
    expect(new Set(totals).size).toBe(totals.length);
  });

  test('readiness lifts the professional core and nothing else', () => {
    const base = deriveForceComposition({ settlement: deadMagic, record: record({ currentEffectiveStrength: 85 }) });
    const drilled = deriveForceComposition({ settlement: deadMagic, record: record({ currentEffectiveStrength: 85, readiness: 0.9 }) });
    expect(drilled.men_at_arms).toBeGreaterThan(base.men_at_arms);
    expect(sumOf(drilled)).toBe(sumOf(base));
  });

  test('an army that did not march to take a place carries fewer engineers', () => {
    const siege = deriveForceComposition({ settlement: deadMagic, record: record({ currentEffectiveStrength: 85 }) });
    const field = deriveForceComposition({
      settlement: deadMagic,
      record: record({ currentEffectiveStrength: 85, role: 'field', objective: 'field' }),
    });
    expect(field.siege_crew).toBeLessThan(siege.siege_crew);
  });

  test('a starved column fields a thinner train than a supplied one', () => {
    const supplied = deriveForceComposition({ settlement: deadMagic, record: record({ currentEffectiveStrength: 85, supplyIntegrity: 0.95, foodReserve: 0.95 }) });
    const starved = deriveForceComposition({ settlement: deadMagic, record: record({ currentEffectiveStrength: 85, supplyIntegrity: 0.05, foodReserve: 0.05 }) });
    expect(supplied.baggage_train).toBeGreaterThan(starved.baggage_train || 0);
  });

  test('the clerk self-gates: no record, no target, and a LIGHT record all surface nothing', () => {
    expect(deriveForceComposition({ settlement: deadMagic })).toBeNull();
    expect(deriveForceComposition({})).toBeNull();
    expect(deriveForceComposition({ settlement: deadMagic, record: { sinceTick: 3 } })).toBeNull();
    // A LIGHT (legacy / hand-seeded) record carries no strength to compose.
    expect(deriveForceComposition({ settlement: deadMagic, record: { targetId: 'ashford', sinceTick: 3, role: 'siege' } })).toBeNull();
  });

  test('the same record always composes the same way', () => {
    const once = deriveForceComposition({ settlement: magicRealm(70), record: record({}) });
    const twice = deriveForceComposition({ settlement: magicRealm(70), record: record({}) });
    expect(once).toEqual(twice);
  });
});

describe('force composition — the magic gate', () => {
  test('the weight table covers the magic role ladder exactly', () => {
    expect(Object.keys(FORCE_COMPOSITION_TABLES.MAGIC_ROLE_WEIGHTS).sort())
      .toEqual([...magicRoleBands()].sort());
    expect(FORCE_COMPOSITION_TABLES.MAGIC_ROLE_WEIGHTS.absent).toBe(0);
  });

  test('a dead-magic world fields no mages, and neither does a settlement we were not given', () => {
    // `levy_spears` is the anchor: it travels the same apportionment as `war_mages`
    // and vanishes under the same drift, so the absence cannot go vacuous.
    const dead = deriveForceComposition({ settlement: deadMagic, record: record({ currentEffectiveStrength: 100, magicSupport: 1 }) });
    expectAbsentWithAnchor(Object.keys(dead), 'war_mages', 'levy_spears', 'dead-magic composition');
    expect(sumOf(dead)).toBe(contingentTotal(100));
    const ungated = deriveForceComposition({ record: record({ currentEffectiveStrength: 100, magicSupport: 1 }) });
    expectAbsentWithAnchor(Object.keys(ungated), 'war_mages', 'levy_spears', 'ungated composition');
    expect(sumOf(ungated)).toBe(contingentTotal(100));
  });

  test('the bands are DISTINGUISHABLE in the drawing, not merely ordered', () => {
    const at = (/** @type {number} */ power) => deriveForceComposition({
      settlement: magicRealm(power), record: record({ currentEffectiveStrength: 85 }),
    }).war_mages || 0;
    const integral = at(70);
    const common = at(40);
    const occasional = at(0);
    expect(integral).toBeGreaterThan(common);
    expect(common).toBeGreaterThan(occasional);
    expect(occasional).toBe(0);
  });

  test('an occasional military role still fields a circle when the army carries deep support', () => {
    const thin = deriveForceComposition({ settlement: magicRealm(0), record: record({ currentEffectiveStrength: 85, magicSupport: 0.5 }) });
    const deep = deriveForceComposition({ settlement: magicRealm(0), record: record({ currentEffectiveStrength: 85, magicSupport: 0.95 }) });
    expect(thin.war_mages || 0).toBe(0);
    expect(deep.war_mages).toBeGreaterThan(0);
  });
});

describe('force composition — the muster roll in world words', () => {
  test('the roll names the actor, the errand and the host, with no digit anywhere', () => {
    const line = forceCompositionLine({ settlement: deadMagic, record: record({}), homeId: 'kelby', nameFor });
    expect(line).toContain("under Kelby's banner");
    expect(line).toContain('before Ashford');
    expect(line).toContain('companies of spears');
    // anchored: the three containment assertions above prove this is the composed sentence, not an empty string
    expect(line).not.toMatch(/\d/);
  });

  test('a single contingent takes the singular word', () => {
    const line = forceCompositionLine({ settlement: deadMagic, record: record({ currentEffectiveStrength: 10 }), homeId: 'kelby', nameFor });
    expect(line).toMatch(/one (company|troop|siege crew|baggage train)/);
    // anchored: the singular match above pins a real sentence
    expect(line).not.toMatch(/\d/);
  });

  test('every number word the bands can reach is spelled, never digited', () => {
    for (const strength of [0, 26, 42, 60, 78, 100]) {
      const line = forceCompositionLine({ settlement: magicRealm(70), record: record({ currentEffectiveStrength: strength }), homeId: 'kelby', nameFor });
      expect(line.length, `strength ${strength} produced no roll`).toBeGreaterThan(0);
      // anchored: the non-empty assertion on the line above
      expect(line).not.toMatch(/\d/);
    }
  });

  test('the roll self-gates with the clerk', () => {
    expect(forceCompositionLine({ settlement: deadMagic })).toBeNull();
    expect(forceCompositionLine({ settlement: deadMagic, record: { targetId: 'ashford' } })).toBeNull();
  });

  test('the standings are codepoint-sorted and inert when the ledger is dormant', () => {
    expect(forceCompositionStandings({ worldState: {} })).toEqual([]);
    expect(forceCompositionStandings({})).toEqual([]);
    const standings = forceCompositionStandings({
      worldState: {
        deployments: {
          kelby: record({}),
          ashford: record({ targetId: 'kelby', currentEffectiveStrength: 30 }),
          morrow: { targetId: 'kelby', sinceTick: 1, role: 'siege' },
        },
      },
      settlementFor: () => deadMagic,
      nameFor,
    });
    expect(standings.map((s) => s.homeId)).toEqual(['ashford', 'kelby']);
    expect(sumOf(standings[1].composition)).toBe(contingentTotal(70));
    expect(standings[0].line).toContain('before Kelby');
  });
});
