/**
 * statusVocabularies.test.js — EM-P4's TYPEDEF-TO-VALUE PIN, BOTH DIRECTIONS.
 *
 * `NpcStatus` and `EntityStatus` are JSDoc unions: comments, which no runtime can read. A
 * card that offers a figure's or an institution's status needs the members as VALUES, so
 * EM-P4 gave each union one exported, frozen vocabulary IN THE UNION'S OWN HOME FILE.
 *
 * The risk a value-level copy creates is drift: the typedef gains a member and the array
 * does not, and every consumer of the array silently enumerates part of the union. These
 * arms close that in both directions by parsing each union FROM ITS OWN HOME FILE'S SOURCE
 * TEXT and set-equating it with the array — the same deliberate double read
 * `tests/lint/statusUnionTotality.walker.test.js` documents, and for the same reason.
 *
 * The placement of each array is itself load-bearing and is asserted here too: the NPC
 * vocabulary is spelled as literals because `npcs.js` is the union walker's first
 * consumer-roster file, while the entity vocabulary is built BY REFERENCE from the five
 * `STATUS_*` constants because `status.js` is not a roster file and quoted words there
 * would read as a FOREIGN vocabulary.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { NPC_STATUS_VALUES } from '../../src/domain/entities/npcs.js';
import {
  ENTITY_STATUS_VALUES, STATUS_ACTIVE, STATUS_DESTROYED, STATUS_IMPAIRED, STATUS_REMOVED, STATUS_VACANT,
} from '../../src/domain/entities/status.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const NPC_REL = 'src/domain/entities/npcs.js';
const STATUS_REL = 'src/domain/entities/status.js';

/** @param {string} rel @returns {string} */
const readSrc = (rel) => readFileSync(join(ROOT, rel), 'utf8');

/**
 * The members of a `@typedef {'a'|'b'} Name` union, READ FROM THE COMMENT ON PURPOSE —
 * the typedef is the contract, and a value-level array that agrees with itself proves nothing.
 * @param {string} raw @param {string} name @returns {string[]} sorted
 */
const parseUnion = (raw, name) => parseUnionInOrder(raw, name).sort();

/**
 * The same members in the typedef's OWN DOCUMENT ORDER. Order is a separate claim from
 * membership and it is load-bearing, so it is derived from the same source text rather
 * than pinned as a literal that could drift out from under the arm.
 * @param {string} raw @param {string} name @returns {string[]} in document order
 */
const parseUnionInOrder = (raw, name) => {
  const block = new RegExp(`@typedef\\s*\\{([^}]*)\\}\\s*${name}\\b`).exec(raw);
  if (!block) return [];
  return [...block[1].matchAll(/'([a-z_]+)'/g)].map((m) => m[1]);
};

/** The `Object.freeze([...])` bracket text of one exported const, read from source. */
const frozenBodyOf = (source, name) => {
  const at = new RegExp(`export const ${name} = Object\\.freeze\\(\\[([\\s\\S]*?)\\]\\)`).exec(source);
  return at ? at[1] : '';
};

const STATUS_CONSTANTS = {
  STATUS_ACTIVE, STATUS_IMPAIRED, STATUS_REMOVED, STATUS_DESTROYED, STATUS_VACANT,
};

describe('EM-P4 — each status union has a value-level vocabulary in its own home, pinned to the typedef', () => {
  it('P7a: NPC_STATUS_VALUES set-equals the NpcStatus union parsed from npcs.js, in both directions', () => {
    const parsed = parseUnion(readSrc(NPC_REL), 'NpcStatus');
    expect(parsed, 'the NpcStatus typedef did not parse — every equality below would be vacuous')
      .toEqual(['active', 'dead', 'exiled', 'jailed', 'missing', 'removed', 'retired']);
    expect(
      [...NPC_STATUS_VALUES].sort(),
      'NPC_STATUS_VALUES and the NpcStatus typedef disagree. Add a member to BOTH in one edit:'
      + ' a consumer reading the array would otherwise enumerate part of the union forever.',
    ).toEqual(parsed);
    expect(parsed.filter((m) => !NPC_STATUS_VALUES.includes(m)), 'the typedef names a member the array omits').toEqual([]);
    expect([...NPC_STATUS_VALUES].filter((m) => !parsed.includes(m)), 'the array names a member the typedef does not').toEqual([]);
    // GUARD THE GUARD, both directions, on synthetic sources.
    expect(parseUnion("/** @typedef {'a'|'b'} Probe */", 'Probe'), 'the parser stopped reading a real union').toEqual(['a', 'b']);
    expect(parseUnion('/** no typedef here */', 'Probe'), 'the parser invents members out of nothing').toEqual([]);
  });

  it('P7b: ENTITY_STATUS_VALUES set-equals the EntityStatus union parsed from status.js, in both directions', () => {
    const parsed = parseUnion(readSrc(STATUS_REL), 'EntityStatus');
    expect(parsed, 'the EntityStatus typedef did not parse, or it moved out of its own home file')
      .toEqual(['active', 'destroyed', 'impaired', 'removed', 'vacant']);
    expect(
      [...ENTITY_STATUS_VALUES].sort(),
      'ENTITY_STATUS_VALUES and the EntityStatus typedef disagree',
    ).toEqual(parsed);
    expect(parsed.filter((m) => !ENTITY_STATUS_VALUES.includes(m)), 'the typedef names a member the array omits').toEqual([]);
    expect([...ENTITY_STATUS_VALUES].filter((m) => !parsed.includes(m)), 'the array names a member the typedef does not').toEqual([]);
  });

  it('P7c: both vocabularies are frozen, duplicate-free, and in their own typedef\'s order', () => {
    expect(Object.isFrozen(NPC_STATUS_VALUES), 'NPC_STATUS_VALUES is not frozen at module load').toBe(true);
    expect(Object.isFrozen(ENTITY_STATUS_VALUES), 'ENTITY_STATUS_VALUES is not frozen at module load').toBe(true);
    expect(new Set(NPC_STATUS_VALUES).size, 'NPC_STATUS_VALUES repeats a member').toBe(NPC_STATUS_VALUES.length);
    expect(new Set(ENTITY_STATUS_VALUES).size, 'ENTITY_STATUS_VALUES repeats a member').toBe(ENTITY_STATUS_VALUES.length);
    // ⛔ ORDER IS LOAD-BEARING, not presentation: a pool built from either array is consumed
    // positionally, so a reorder moves what a stored choice resolves to.
    const npcOrder = parseUnionInOrder(readSrc(NPC_REL), 'NpcStatus');
    const entityOrder = parseUnionInOrder(readSrc(STATUS_REL), 'EntityStatus');
    // The document-order parser is real work in its own right: EntityStatus is NOT written in
    // codepoint order, so an order claim read through the sorting parser would be vacuous.
    expect(
      [...entityOrder].sort().join('|') === entityOrder.join('|'),
      'the document-order parser returned a sorted list, so the order arms below would be vacuous',
    ).toBe(false);
    expect([...NPC_STATUS_VALUES], 'NPC_STATUS_VALUES is not in the typedef\'s own order').toEqual(npcOrder);
    expect([...ENTITY_STATUS_VALUES], 'ENTITY_STATUS_VALUES is not in the typedef\'s own order').toEqual(entityOrder);
  });

  it('P8a: every entity value IS the STATUS_* constant of that name, built by reference and not re-spelled', () => {
    const byIdentity = ENTITY_STATUS_VALUES.map((value) => {
      const named = Object.entries(STATUS_CONSTANTS).find(([, constant]) => constant === value);
      return [value, named ? named[0] : 'NO CONSTANT HOLDS THIS VALUE'];
    });
    expect(
      byIdentity,
      'an entity status value is not one of the five exported STATUS_* constants — a second spelling'
      + ' of a vocabulary this file already owns',
    ).toEqual([
      ['active', 'STATUS_ACTIVE'], ['impaired', 'STATUS_IMPAIRED'], ['removed', 'STATUS_REMOVED'],
      ['destroyed', 'STATUS_DESTROYED'], ['vacant', 'STATUS_VACANT'],
    ]);
    // ⛔ THE FORM IS THE RULING, so the SOURCE is asserted, not only the values. status.js is not
    // a consumer-roster file of statusUnionTotality: an array of quoted words here would be read
    // as a FOREIGN vocabulary and could empty that walker's derived trigger.
    const body = frozenBodyOf(readSrc(STATUS_REL), 'ENTITY_STATUS_VALUES');
    expect(body.trim().length, 'the ENTITY_STATUS_VALUES declaration was not found in source').toBeGreaterThan(20);
    expect(
      [...body.matchAll(/'([^']*)'|"([^"]*)"/g)].map((m) => m[1] ?? m[2]),
      'ENTITY_STATUS_VALUES spells quoted literals. It must be built BY REFERENCE from the five'
      + ' STATUS_* constants, or statusUnionTotality reads status.js as a foreign vocabulary.',
    ).toEqual([]);
    expect(
      Object.keys(STATUS_CONSTANTS).filter((name) => !body.includes(name)),
      'the declaration no longer names all five STATUS_* constants',
    ).toEqual([]);
    // The NPC side is the opposite ruling, and it is asserted the same way: npcs.js IS the
    // roster's first file, so literals there are the union's OWN vocabulary.
    const npcBody = frozenBodyOf(readSrc(NPC_REL), 'NPC_STATUS_VALUES');
    expect(
      [...npcBody.matchAll(/'([^']*)'/g)].map((m) => m[1]),
      'NPC_STATUS_VALUES stopped spelling its seven members as literals in the union\'s own home',
    ).toEqual(['active', 'dead', 'exiled', 'jailed', 'missing', 'removed', 'retired']);
  });

  it('P8b: the two vocabularies overlap in exactly active and removed', () => {
    const shared = [...NPC_STATUS_VALUES].filter((member) => ENTITY_STATUS_VALUES.includes(member)).sort();
    expect(
      shared,
      'the overlap between the NPC and entity status vocabularies moved. The two unions are'
      + ' DIFFERENT FACTS (a figure\'s lifecycle and an entity\'s), and widening either one without'
      + ' re-reading this file is exactly how they quietly merge.',
    ).toEqual(['active', 'removed']);
    // Anti-vacuity: both vocabularies are populated, so an empty intersection could not pass here.
    expect(NPC_STATUS_VALUES.length, 'the NPC vocabulary is empty').toBe(7);
    expect(ENTITY_STATUS_VALUES.length, 'the entity vocabulary is empty').toBe(5);
  });
});
