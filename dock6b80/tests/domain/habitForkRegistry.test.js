/**
 * habitForkRegistry.test.js — HB-1's registry battery: the row SHAPE and the wave POSTURE.
 *
 * The totality partition and the three named-domain assertions live in the walker beside
 * this file, because they are claims about the TREE. What lives here are claims about the
 * registry as a record: that every row is well-formed against the closed vocabularies, that
 * the wave's posture (no row learns yet, every deferral says what it owes) really holds,
 * that the leaf's substrate argument is true — its only import is the habit vocabulary,
 * which is what lets its cross-layer reach be declared empty — and that every row's module
 * id is EXTENSIONLESS.
 *
 * ⭐⭐ WHY THE IDS ARE EXTENSIONLESS, and why the invariant is a test rather than a habit.
 * A registry that stores module paths as QUOTED TEXT joins the result of any raw-source scan
 * keyed on `/<name>\.js['"]/`, so it reads as an IMPORTER of every module it merely NAMES.
 * That is not hypothetical: the estate holds a live pin that walks `src` for one such regex
 * and asserts an EXACT importer list, and a `.js`-suffixed id here would join that list and
 * red it. The class is removed at THIS end — the registry's — rather than at twenty-six
 * foreign scans' ends, for zero effective lines. The walker appends the suffix at exactly
 * one normalization point; the invariant below is what stops a future row reintroducing the
 * class one paste at a time.
 */
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  FORK_ARITIES,
  FORK_CLASS_VOCABULARY,
  FORK_DISPOSITIONS,
  HABIT_FORK_REGISTRY,
  NAMED_DOMAIN_LABELS,
  OWNER_DOMAIN_MAPPING,
} from '../../src/domain/worldPulse/habitForkRegistry.js';
import { CIRCUMSTANCE_CLASSES } from '../../src/domain/worldPulse/habit/habitVocabulary.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const REGISTRY_HOME = 'src/domain/worldPulse/habitForkRegistry.js';
const REQUIRED_FIELDS = Object.freeze([
  'forkId', 'module', 'symbol', 'discovery', 'disposition', 'arity',
  'circumstanceClasses', 'actionVocabulary', 'closeSource', 'closeOwed', 'domain', 'reason',
]);
const DISCOVERY_KINDS = Object.freeze(['idiom', 'checklist', 'guard-chain']);

describe('HB-1 — the habit fork registry as a record', () => {
  test('every row carries every field, and the ids are unique', () => {
    expect(HABIT_FORK_REGISTRY.length).toBeGreaterThan(20);
    for (const row of HABIT_FORK_REGISTRY) {
      for (const field of REQUIRED_FIELDS) {
        expect(
          Object.prototype.hasOwnProperty.call(row, field),
          `${row.forkId} is missing the ${field} field`,
        ).toBe(true);
      }
      expect(Object.isFrozen(row)).toBe(true);
      expect(typeof row.module).toBe('string');
      expect(row.module.startsWith('src/domain/')).toBe(true);
    }
    expect(new Set(HABIT_FORK_REGISTRY.map((row) => row.forkId)).size)
      .toBe(HABIT_FORK_REGISTRY.length);
  });

  test('every row draws its disposition, arity and classes from the CLOSED vocabularies', () => {
    for (const row of HABIT_FORK_REGISTRY) {
      expect(FORK_DISPOSITIONS, `${row.forkId} has an unknown disposition`).toContain(row.disposition);
      expect(DISCOVERY_KINDS, `${row.forkId} has an unknown discovery kind`).toContain(row.discovery);
      if (row.arity !== null) {
        expect(FORK_ARITIES, `${row.forkId} has an unknown arity`).toContain(row.arity);
      }
      expect(Array.isArray(row.circumstanceClasses)).toBe(true);
      for (const cls of row.circumstanceClasses) {
        expect(FORK_CLASS_VOCABULARY, `${row.forkId} keys an unknown class`).toContain(cls);
      }
    }
    // The class vocabulary this registry keys against IS the family's one vocabulary, not a
    // second spelling of it.
    expect(FORK_CLASS_VOCABULARY).toBe(CIRCUMSTANCE_CLASSES);
  });

  test('⭐⭐ EVERY MODULE ID IS EXTENSIONLESS, AND EVERY ONE RESOLVES TO A REAL FILE', () => {
    // The F2 siting cure, asserted as an invariant rather than trusted as a convention.
    // BOTH halves are needed and neither implies the other: without the existence check an
    // extensionless id could be a typo nothing would ever catch, and without the suffix
    // check a future paste reintroduces the importer-scan class one row at a time.
    expect(HABIT_FORK_REGISTRY.length).toBeGreaterThan(20);
    const suffixed = HABIT_FORK_REGISTRY
      .filter((row) => /\.jsx?$/.test(row.module))
      .map((row) => `${row.forkId}: ${row.module}`);
    expect(
      suffixed,
      'a registry row stores a module id WITH its file extension. A registry that spells'
      + ' module paths the way an import does joins the result of every raw-source scan keyed'
      + ' on that filename, so the registry reads as an IMPORTER of a module it merely NAMES.'
      + ' Drop the suffix; the walker appends it at its one normalization point.',
    ).toEqual([]);
    const unresolved = HABIT_FORK_REGISTRY
      .filter((row) => !existsSync(join(ROOT, `${row.module}.js`)))
      .map((row) => `${row.forkId}: ${row.module}`);
    expect(
      unresolved,
      'a registry row names a module that does not exist. An extensionless id is not a'
      + ' licence to guess — every id must resolve to a real file under src/domain.',
    ).toEqual([]);
  });

  test('NOT ONE ROW SAYS LEARN at this wave, and every deferral says what it owes', () => {
    // The wave mints the registry, not the learning: the registry is born seeing the whole
    // surface, and later waves only shrink the defer list.
    // The disposition-vocabulary case proves every row carries a recognised disposition
    // over a registry asserted longer than twenty rows.
    // anchored: the length floor and the vocabulary case hold this collection non-empty
    expect(HABIT_FORK_REGISTRY.map((row) => row.disposition)).not.toContain('LEARN');
    for (const row of HABIT_FORK_REGISTRY) {
      if (row.disposition !== 'DEFER') continue;
      expect(
        String(row.closeOwed || '').trim().length,
        `${row.forkId} defers without saying what would have to exist — an absent reason is`
        + ' how a blind spot signs its own clearance',
      ).toBeGreaterThan(20);
    }
  });

  test('a PERMANENT ruling is recorded as STAY rather than filed as a deferral', () => {
    // Recording a settled ruling as pending would be a false record, not caution. Each STAY
    // row carries its reason and owes no close, because nothing is owed.
    const stays = HABIT_FORK_REGISTRY.filter((row) => row.disposition === 'STAY');
    expect(stays.length).toBeGreaterThan(0);
    for (const row of stays) {
      expect(row.closeOwed, `${row.forkId} is settled yet owes a close`).toBeNull();
      expect(String(row.reason).length, `${row.forkId} is settled without a stated reason`)
        .toBeGreaterThan(60);
    }
  });

  test('the label set and the owner mapping are closed, unique and TOTAL', () => {
    expect(NAMED_DOMAIN_LABELS).toHaveLength(8);
    expect(new Set(NAMED_DOMAIN_LABELS).size).toBe(NAMED_DOMAIN_LABELS.length);
    expect(Object.keys(OWNER_DOMAIN_MAPPING)).toHaveLength(7);
    const reached = new Set(Object.values(OWNER_DOMAIN_MAPPING).flatMap((labels) => [...labels]));
    expect([...reached].sort()).toEqual([...NAMED_DOMAIN_LABELS].sort());
    // ⛔ The eight-versus-seven gap is not an error to be "corrected": exactly one spoken
    // domain names TWO labels, and writing that down is what stops a later round collapsing
    // one number into the other.
    expect(Object.values(OWNER_DOMAIN_MAPPING).filter((labels) => labels.length > 1)).toHaveLength(1);
  });

  test('the registry leaf reaches ONLY the habit vocabulary, which is what its substrate row declares', () => {
    // The coupling ratchet records this leaf as argued-unlayered with an EMPTY cross-layer
    // reach. That claim is only true while its one import is itself argued-unlayered, so the
    // import list is pinned here rather than left to the ratchet alone.
    const src = readFileSync(join(ROOT, REGISTRY_HOME), 'utf8');
    const imports = [...src.matchAll(/^\s*import\b[\s\S]*?from\s*['"]([^'"]+)['"]/gm)].map((m) => m[1]);
    expect(imports).toEqual(['./habit/habitVocabulary.js']);
  });
});
