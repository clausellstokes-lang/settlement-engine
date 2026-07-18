/**
 * tests/domain/autonomy/stopConditions.test.js — the SCHEMA WALL + the pure evaluator
 * (SURVEYOR S7). An unregistered signal is STRUCTURALLY DEAD (the no-op-type-no-effect
 * law applied to reads); type-mismatched tests die at validation; the combinator caps
 * hold; evaluation is pure (deep-frozen world, zero writes) and deterministic.
 */

import { describe, expect, test } from 'vitest';

import {
  MAX_CONDITION_DEPTH, MAX_CONDITION_TESTS,
  validateStopCondition, evaluateStopCondition, describeStopCondition,
} from '../../../src/domain/autonomy/stopConditions.js';
import { prepareSignalFrame } from '../../../src/domain/autonomy/signalRegistry.js';
import { autonomyFixture, deepFreeze } from './fixture.js';

const T = (signalId, test, target = { settlementId: 'ashford' }) =>
  ({ kind: 'test', signalId, ...target, test });
const cond = (root, label) => ({ version: 1, label, root });

describe('the schema wall (validation)', () => {
  test('an UNREGISTERED signal id is structurally rejected', () => {
    const v = validateStopCondition(cond(T('made.up.signal', { op: 'gte', value: 1 })));
    expect(v.ok).toBe(false);
    expect(v.errors.join('\n')).toMatch(/unregistered signal "made\.up\.signal"/);
  });

  test('a threshold test on a BAND signal is rejected (typed wall)', () => {
    const v = validateStopCondition(cond(T('causal.food_security.band', { op: 'gte', value: 30 })));
    expect(v.ok).toBe(false);
    expect(v.errors.join('\n')).toMatch(/is a band/);
  });

  test('a set test naming a value OUTSIDE the closed vocabulary is rejected', () => {
    const v = validateStopCondition(cond(T('causal.food_security.band', { in: ['collapsed', 'ruined'] })));
    expect(v.ok).toBe(false);
    expect(v.errors.join('\n')).toMatch(/"ruined" is outside its closed vocabulary/);
  });

  test('a bool test on a number signal is rejected', () => {
    const v = validateStopCondition(cond(T('world.tick', { is: true }, {})));
    expect(v.ok).toBe(false);
  });

  test('scope requirements: settlement-scoped without settlementId, pair-scoped without otherId', () => {
    expect(validateStopCondition(cond(T('pressure.food', { op: 'gte', value: 0.5 }, {}))).ok).toBe(false);
    expect(validateStopCondition(cond(T('pair.relationship', { in: ['hostile'] }, { settlementId: 'ashford' }))).ok).toBe(false);
  });

  test(`depth beyond ${MAX_CONDITION_DEPTH} is rejected`, () => {
    const deep = cond({
      kind: 'all', children: [{
        kind: 'some', children: [{
          kind: 'all', children: [T('world.tick', { op: 'gte', value: 1 }, {})],
        }],
      }],
    });
    const v = validateStopCondition(deep);
    expect(v.ok).toBe(false);
    expect(v.errors.join('\n')).toMatch(/depth 4 exceeds the cap/);
  });

  test(`more than ${MAX_CONDITION_TESTS} leaf tests is rejected`, () => {
    const many = cond({
      kind: 'some',
      children: Array.from({ length: MAX_CONDITION_TESTS + 1 }, () => T('world.tick', { op: 'gte', value: 1 }, {})),
    });
    const v = validateStopCondition(many);
    expect(v.ok).toBe(false);
    expect(v.errors.join('\n')).toMatch(/more than 8 tests/);
  });

  test('a well-formed bounded condition validates', () => {
    const v = validateStopCondition(cond({
      kind: 'some', children: [
        T('causal.food_security.band', { in: ['critical', 'collapsed'] }),
        { kind: 'all', children: [
          T('settlement.atWar', { is: true }),
          T('pressure.conflict', { op: 'gte', value: 0.6 }),
        ] },
        T('world.tick', { op: 'gte', value: 12 }, {}),
      ],
    }, 'crisis or a dozen weeks'));
    expect(v.errors).toEqual([]);
    expect(v.ok).toBe(true);
    expect(v.testCount).toBe(4);
    expect(v.depth).toBe(3);
  });

  test('an empty group and an unknown node kind are rejected', () => {
    expect(validateStopCondition(cond({ kind: 'all', children: [] })).ok).toBe(false);
    expect(validateStopCondition(cond({ kind: 'nor', children: [T('world.tick', { op: 'gte', value: 1 }, {})] })).ok).toBe(false);
    expect(validateStopCondition({ version: 2, root: T('world.tick', { op: 'gte', value: 1 }, {}) }).ok).toBe(false);
  });
});

describe('the pure evaluator', () => {
  const { campaign, saves } = autonomyFixture();
  deepFreeze(saves); // purity: a single evaluator write throws
  const frame = prepareSignalFrame({ campaign, saves });

  test('an INVALID condition is structurally dead: never fires, errors ride the result', () => {
    const dead = evaluateStopCondition(cond(T('made.up.signal', { op: 'gte', value: 0 })), frame);
    expect(dead.fired).toBe(false);
    expect(dead.evaluations).toEqual([]);
    expect(dead.errors.length).toBeGreaterThan(0);
  });

  test('all = AND, some = OR — and every leaf lands in the receipt (no short-circuit)', () => {
    const both = evaluateStopCondition(cond({
      kind: 'all', children: [
        T('world.tick', { op: 'lte', value: 0 }, {}),                 // true at tick 0
        T('pair.relationship', { in: ['rival'] }, { settlementId: 'ashford', otherId: 'bramwick' }), // true
      ],
    }), frame);
    expect(both.fired).toBe(true);
    expect(both.evaluations).toHaveLength(2);

    const either = evaluateStopCondition(cond({
      kind: 'some', children: [
        T('world.tick', { op: 'gte', value: 100 }, {}),               // false
        T('settlement.legitimacy.score', { op: 'gte', value: 50 }),   // true (54)
      ],
    }), frame);
    expect(either.fired).toBe(true);
    expect(either.evaluations).toHaveLength(2);
    expect(either.evaluations[0].pass).toBe(false);
    expect(either.evaluations[1]).toMatchObject({ value: 54, pass: true });

    const neither = evaluateStopCondition(cond({
      kind: 'all', children: [
        T('world.tick', { op: 'gte', value: 100 }, {}),
        T('settlement.legitimacy.score', { op: 'gte', value: 50 }),
      ],
    }), frame);
    expect(neither.fired).toBe(false);
    expect(neither.evaluations).toHaveLength(2); // the false leaf did not hide the second
  });

  test('an UNREADABLE signal never fires — it records its reason and evaluates false', () => {
    const r = evaluateStopCondition(cond(T('pressure.food', { op: 'gte', value: 0 }, { settlementId: 'ghost' })), frame);
    expect(r.fired).toBe(false);
    expect(r.evaluations[0]).toMatchObject({ pass: false, value: null, reason: 'unknown_settlement' });
  });

  test('determinism: the same frame evaluates JSON-identically, twice', () => {
    const c = cond({
      kind: 'some', children: [
        T('causal.food_security.band', { in: ['critical', 'collapsed'] }),
        T('pressure.conflict', { op: 'gte', value: 0.2 }),
      ],
    });
    expect(JSON.stringify(evaluateStopCondition(c, frame))).toBe(JSON.stringify(evaluateStopCondition(c, frame)));
  });

  test('describeStopCondition renders a one-line human reading', () => {
    const line = describeStopCondition(cond({
      kind: 'all', children: [
        T('settlement.atWar', { is: true }),
        T('world.tick', { op: 'gte', value: 10 }, {}),
      ],
    }, 'war and time'));
    expect(line).toContain('war and time');
    expect(line).toContain('settlement.atWar');
    expect(line).toContain('AND');
  });
});
