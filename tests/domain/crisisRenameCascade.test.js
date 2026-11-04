/**
 * crisisRenameCascade.test.js — a DM rename on a town with an active crisis leaves
 * nothing stale on the crisis record (RUNG1B-F7, 2026-11-04).
 *
 * The crisis car (CRISIS-3) gave every stress entry a derived `cast`
 * (docs/DESIGN_CRISIS_TAB.md): roles naming people, factions and houses, a stake per
 * faction keyed on its display name, and the levers with their office-holders. The
 * three rename writers never heard of it, so a renamed faction left every stake on the
 * old name, a renamed house left its lever row, and a renamed person left their row.
 *
 * REAL RECORDS, RELOADED. The sample is the soak corpus (scripts/audit/soak-review/
 * corpus.mjs :: birth), the records the soak reviews, every one JSON round-tripped:
 * on a reloaded save `stressors` is a separate copy of `stress`, and a single crisis is
 * an entry OBJECT where several are an ARRAY, so the cast lives at four homes.
 */

import { beforeAll, describe, expect, test } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import {
  CRISIS_CAST_HOMES,
  FACTION_RENAME_SURFACES,
  NON_CASCADED_SURFACES,
  NPC_NON_CASCADED_SURFACES,
  NPC_RENAME_SURFACES,
  applyFactionRenameToSettlement,
  applyNpcRenameToSettlement,
} from '../../src/domain/factionRename.js';
import {
  INSTITUTION_RENAME_SURFACES,
  NON_CASCADED_SURFACES as INSTITUTION_NON_CASCADED,
  applyInstitutionRenameToSettlement,
} from '../../src/domain/institutionRename.js';
import { applyInstitutionRemovalToSettlement } from '../../src/domain/institutionRemoval.js';

/** The first 48 soak records: every stress cell of the corpus's opening rotation, both container shapes. */
const SAMPLE = 48;
const NEW_FACTION = 'The Amber Concord';
const NEW_PERSON = 'Ysolde Amberlane';
const NEW_HOUSE = 'The Amber Concord Hall';

const reloaded = (value) => JSON.parse(JSON.stringify(value));
const escape = (name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const wholeWordRe = (name) => new RegExp(`(?<![\\p{L}\\p{N}\\p{M}_])${escape(name)}(?![\\p{L}\\p{N}\\p{M}_])`, 'u');

/** Every string in the record, as [path shape, value], array indices collapsed to `[]`. */
function stringsOf(root) {
  /** @type {Array<[string, string]>} */
  const out = [];
  (function rec(node, path) {
    if (typeof node === 'string') { out.push([path, node]); return; }
    if (Array.isArray(node)) { for (const item of node) rec(item, `${path}[]`); return; }
    if (node && typeof node === 'object') for (const [key, value] of Object.entries(node)) rec(value, path ? `${path}.${key}` : key);
  })(root, '');
  return out;
}

/** The stress entries of a record, whichever container shape it carries. */
const entriesOf = (container) => (Array.isArray(container) ? container : container ? [container] : []).filter(Boolean);
const castsOf = (save) => [...entriesOf(save.stress), ...entriesOf(save.stressors)].map((entry) => entry.cast).filter(Boolean);
const rosterFactions = (save) => (save.powerStructure?.factions || []).map((f) => String(f?.faction || f?.name || '').trim()).filter(Boolean);
const rosterHouses = (save) => new Set((save.institutions || []).map((h) => String(h?.name || '').trim()).filter(Boolean));

/** @type {Array<{ index: number, save: any }>} */
const crises = [];
const homesSeen = new Set();

beforeAll(async () => {
  await ensureLaws();
  for (let index = 0; index < SAMPLE; index += 1) {
    const save = reloaded(birth(index).settlement);
    if (!castsOf(save).some((cast) => (cast.roles || []).length)) continue;
    crises.push({ index, save });
    for (const key of ['stress', 'stressors']) if (save[key]) homesSeen.add(Array.isArray(save[key]) ? `${key}[].cast` : `${key}.cast`);
  }
}, 300000);

describe('the crisis cast follows a FACTION rename', () => {
  test('renaming every faction a crisis stakes leaves no stale name anywhere on the record', () => {
    expect(crises.length, 'anti-vacuity: too few crisis-bearing records in the sample').toBeGreaterThanOrEqual(30);
    expect([...homesSeen].sort(), 'anti-vacuity: the sample must carry both container shapes at both containers').toEqual([...CRISIS_CAST_HOMES].sort());
    const exempt = new Set(NON_CASCADED_SURFACES.map((row) => row.path));
    const failures = [];
    let renamed = 0;
    let stakesMoved = 0;
    for (const { index, save } of crises) {
      const roster = rosterFactions(save);
      const houses = rosterHouses(save);
      const staked = new Set(castsOf(save).flatMap((cast) => (cast.stakes || []).map((stake) => stake.factionId)));
      for (const name of staked) {
        // A name whole-word inside another roster name, or shared with a house, cannot be
        // told apart by a string walk; the two ledgers' mirror rows govern that collision.
        if (roster.some((other) => other !== name && (wholeWordRe(name).test(other) || wholeWordRe(other).test(name)))) continue;
        if (houses.has(name)) continue;
        const record = reloaded(save);
        const before = castsOf(record).flatMap((cast) => cast.stakes || []).filter((stake) => stake.factionId === name).length;
        applyFactionRenameToSettlement(record, name, NEW_FACTION);
        renamed += 1;
        const re = wholeWordRe(name);
        const stale = [...new Set(stringsOf(record).filter(([path, value]) => !exempt.has(path) && (value.trim() === name || re.test(value))).map(([path]) => path))];
        if (stale.length) failures.push(`soak1k-${index} "${name}": ${stale.join(', ')}`);
        const after = castsOf(record).flatMap((cast) => cast.stakes || []).filter((stake) => stake.factionId === NEW_FACTION).length;
        if (after !== before) failures.push(`soak1k-${index} "${name}": ${before} stakes before, ${after} under the new name`);
        stakesMoved += after;
      }
    }
    expect(renamed, 'anti-vacuity: no staked faction was renamed').toBeGreaterThanOrEqual(60);
    expect(stakesMoved, 'anti-vacuity: no stake moved').toBeGreaterThan(0);
    expect(failures, `a faction rename left the old name on the record:\n${failures.join('\n')}`).toEqual([]);
  });

  test('a faction rename moves the faction row only, never a house or person sharing its name', () => {
    const SHARED = 'Democratic assembly';
    const cast = () => ({
      roles: [
        { role: 'instigator', kind: 'faction', id: SHARED, name: SHARED, reason: 'r', temporary: false },
        { role: 'lever', kind: 'institution', id: SHARED, name: SHARED, reason: 'r', temporary: false },
        { role: 'target', kind: 'npc', id: 'npc.1', name: SHARED, reason: 'r', temporary: false },
      ],
      stakes: [{ factionId: SHARED, stake: 'gains', reason: 'r' }],
      levers: [{ institution: SHARED, holderId: 'npc.1', holderName: SHARED }],
    });
    const record = { stress: [{ type: 'insurgency', cast: cast() }], stressors: { type: 'insurgency', cast: cast() } };
    const result = applyFactionRenameToSettlement(record, SHARED, NEW_FACTION);
    expect(result.touched.sort()).toEqual([
      'stress[].cast.roles[].id', 'stress[].cast.roles[].name', 'stress[].cast.stakes[].factionId',
      'stressors.cast.roles[].id', 'stressors.cast.roles[].name', 'stressors.cast.stakes[].factionId',
    ]);
    for (const moved of [record.stress[0].cast, record.stressors.cast]) {
      expect(moved.roles.map((row) => `${row.kind}:${row.id}:${row.name}`)).toEqual([
        `faction:${NEW_FACTION}:${NEW_FACTION}`, `institution:${SHARED}:${SHARED}`, `npc:npc.1:${SHARED}`,
      ]);
      expect(moved.stakes[0].factionId).toBe(NEW_FACTION);
      expect(moved.levers[0]).toEqual({ institution: SHARED, holderId: 'npc.1', holderName: SHARED });
    }
  });
});

describe('the crisis cast follows a PERSON rename', () => {
  test('renaming every person a crisis casts leaves no key join holding the dead name', () => {
    const keyPaths = new Set(NPC_RENAME_SURFACES.map((row) => row.path));
    const failures = [];
    let renamed = 0;
    for (const { index, save } of crises) {
      const people = new Set(castsOf(save).flatMap((cast) => [
        ...(cast.roles || []).filter((row) => row.kind === 'npc').map((row) => row.name),
        ...(cast.levers || []).map((lever) => lever.holderName).filter(Boolean),
      ]));
      const factionsAndHouses = new Set([...rosterFactions(save), ...rosterHouses(save)]);
      for (const name of people) {
        if (factionsAndHouses.has(name)) continue;
        const record = reloaded(save);
        applyNpcRenameToSettlement(record, name, NEW_PERSON);
        renamed += 1;
        // Every cast home, and every declared key join, is clear of the old name.
        const stale = [...new Set(stringsOf(record)
          .filter(([path, value]) => value.trim() === name && (keyPaths.has(path) || CRISIS_CAST_HOMES.some((home) => path.startsWith(`${home}.`))))
          .map(([path]) => path))];
        if (stale.length) failures.push(`soak1k-${index} "${name}": ${stale.join(', ')}`);
      }
    }
    expect(renamed, 'anti-vacuity: no cast person was renamed').toBeGreaterThanOrEqual(60);
    expect(failures, `a person rename left the old name on the record:\n${failures.join('\n')}`).toEqual([]);
  });

  test('a person rename moves the person row and the lever holder only', () => {
    const SHARED = 'Mira Solt';
    const record = {
      stress: {
        type: 'famine',
        cast: {
          roles: [
            { role: 'lever', kind: 'npc', id: 'npc.1', name: SHARED, reason: 'r', temporary: false },
            { role: 'brunt', kind: 'faction', id: SHARED, name: SHARED, reason: 'r', temporary: false },
          ],
          stakes: [{ factionId: SHARED, stake: 'loses', reason: 'r' }],
          levers: [{ institution: 'Town granary', holderId: 'npc.1', holderName: SHARED }],
        },
      },
    };
    const result = applyNpcRenameToSettlement(record, SHARED, NEW_PERSON);
    expect(result.touched.sort()).toEqual(['stress.cast.levers[].holderName', 'stress.cast.roles[].name']);
    expect(record.stress.cast.roles.map((row) => `${row.kind}:${row.id}:${row.name}`)).toEqual([`npc:npc.1:${NEW_PERSON}`, `faction:${SHARED}:${SHARED}`]);
    expect(record.stress.cast.stakes[0].factionId).toBe(SHARED);
    expect(record.stress.cast.levers[0].holderId).toBe('npc.1');
  });
});

describe('the crisis cast follows a HOUSE rename', () => {
  test('renaming every house a crisis turns on leaves no stale name outside the declared exemptions', () => {
    const exempt = new Set(INSTITUTION_NON_CASCADED.map((row) => row.path));
    const failures = [];
    let renamed = 0;
    let leversMoved = 0;
    for (const { index, save } of crises) {
      const factions = new Set(rosterFactions(save));
      const cast = castsOf(save);
      const houses = new Set(cast.flatMap((c) => [
        ...(c.levers || []).map((lever) => lever.institution),
        ...(c.roles || []).filter((row) => row.kind === 'institution').map((row) => row.name),
      ]));
      for (const name of houses) {
        // A house named like a faction is the governing-body collision the mirror rows govern.
        if (factions.has(name)) continue;
        const record = reloaded(save);
        const before = castsOf(record).flatMap((c) => c.levers || []).filter((lever) => lever.institution === name).length;
        applyInstitutionRenameToSettlement(record, name, NEW_HOUSE);
        renamed += 1;
        const stale = [...new Set(stringsOf(record).filter(([path, value]) => !exempt.has(path) && value.trim() === name).map(([path]) => path))];
        if (stale.length) failures.push(`soak1k-${index} "${name}": ${stale.join(', ')}`);
        const after = castsOf(record).flatMap((c) => c.levers || []).filter((lever) => lever.institution === NEW_HOUSE).length;
        if (after !== before) failures.push(`soak1k-${index} "${name}": ${before} levers before, ${after} under the new name`);
        leversMoved += after;
      }
    }
    expect(renamed, 'anti-vacuity: no cast house was renamed').toBeGreaterThanOrEqual(30);
    expect(leversMoved, 'anti-vacuity: no lever moved').toBeGreaterThan(0);
    expect(failures, `a house rename left the old name on the record:\n${failures.join('\n')}`).toEqual([]);
  });

  test('a house rename and a house removal move the house row only, never a faction or person sharing its name', () => {
    const SHARED = 'Democratic assembly';
    const record = () => ({
      institutions: [{ name: SHARED }],
      stress: {
        type: 'politically_fractured',
        cast: {
          roles: [
            { role: 'instigator', kind: 'faction', id: SHARED, name: SHARED, reason: 'r', temporary: false },
            { role: 'lever', kind: 'institution', id: SHARED, name: SHARED, reason: 'r', temporary: false },
            { role: 'target', kind: 'npc', id: 'npc.1', name: SHARED, reason: 'r', temporary: false },
          ],
          stakes: [{ factionId: SHARED, stake: 'gains', reason: 'r' }],
          levers: [{ institution: SHARED, holderId: 'npc.1', holderName: 'Odo Wick' }],
        },
      },
    });
    const renamed = record();
    const result = applyInstitutionRenameToSettlement(renamed, SHARED, NEW_HOUSE);
    expect(result.touched.filter((path) => path.startsWith('stress')).sort())
      .toEqual(['stress.cast.levers[].institution', 'stress.cast.roles[].id', 'stress.cast.roles[].name']);
    expect(renamed.stress.cast.roles.map((row) => `${row.kind}:${row.id}:${row.name}`))
      .toEqual([`faction:${SHARED}:${SHARED}`, `institution:${NEW_HOUSE}:${NEW_HOUSE}`, `npc:npc.1:${SHARED}`]);
    expect(renamed.stress.cast.stakes[0].factionId).toBe(SHARED);
    expect(renamed.stress.cast.levers[0].institution).toBe(NEW_HOUSE);

    const removed = record();
    applyInstitutionRemovalToSettlement(removed, SHARED);
    expect(removed.stress.cast.roles.map((row) => row.kind)).toEqual(['faction', 'npc']);
    expect(removed.stress.cast.levers).toEqual([]);
    expect(removed.stress.cast.stakes[0].factionId).toBe(SHARED);
  });

  test('the criminal service label is NOT a handle: where it names a house, its own institution is a different house', () => {
    const houseRows = new Set(INSTITUTION_RENAME_SURFACES.map((row) => row.path));
    expect(houseRows.has('availableServices.criminal[].institution'), 'the entry handle is cascaded').toBe(true);
    expect(houseRows.has('availableServices.criminal[].name'), 'the label is ruled out, not cascaded').toBe(false);
    let named = 0;
    const sameHouse = [];
    for (let index = 0; index < SAMPLE; index += 1) {
      const save = crises.find((c) => c.index === index)?.save;
      if (!save) continue;
      const houses = rosterHouses(save);
      for (const entry of save.availableServices?.criminal || []) {
        if (!houses.has(String(entry?.name || '').trim())) continue;
        named += 1;
        if (entry.name === entry.institution) sameHouse.push(`soak1k-${index}: ${entry.name}`);
      }
    }
    expect(named, 'anti-vacuity: no criminal service in the sample names a roster house').toBeGreaterThan(0);
    expect(sameHouse, 'a criminal service names its OWN house, so the label ruling is refuted: cascade the row').toEqual([]);
  });
});

describe('the whole-record walk: a future writer cannot add an undeclared name path', () => {
  /**
   * The INDEPENDENT denominator, over records that carry a crisis. Every string on the
   * record is scored against the roster's faction names (exact or whole word), house names
   * (exact) and person names (exact), and its path shape must be declared by that kind's
   * ledger, cascaded or ruled out in writing. It reads the ledgers only to ask "declared?",
   * never to decide what to look for, so a field the ledgers never heard of reds here.
   */
  test('every path holding a faction, house or person name is declared by its ledger', () => {
    const ledgers = {
      faction: new Set([...FACTION_RENAME_SURFACES, ...NON_CASCADED_SURFACES].map((row) => row.path)),
      house: new Set([...INSTITUTION_RENAME_SURFACES, ...INSTITUTION_NON_CASCADED].map((row) => row.path)),
      person: new Set([...NPC_RENAME_SURFACES, ...NPC_NON_CASCADED_SURFACES].map((row) => row.path)),
    };
    /** @type {Map<string, string>} */
    const undeclared = new Map();
    const found = { faction: 0, house: 0, person: 0 };
    for (const { index, save } of crises) {
      const factions = rosterFactions(save).map((name) => [name, wholeWordRe(name)]);
      const houses = rosterHouses(save);
      const people = new Set((save.npcs || []).map((npc) => String(npc?.name || '').trim()).filter(Boolean));
      for (const [path, value] of stringsOf(save)) {
        const held = value.trim();
        const hits = {
          faction: factions.some(([name, re]) => held === name || re.test(value)),
          house: houses.has(held),
          person: people.has(held),
        };
        for (const kind of /** @type {const} */ (['faction', 'house', 'person'])) {
          if (!hits[kind]) continue;
          found[kind] += 1;
          if (!ledgers[kind].has(path) && !undeclared.has(`${kind} ${path}`)) undeclared.set(`${kind} ${path}`, `soak1k-${index} e.g. ${JSON.stringify(value.slice(0, 60))}`);
        }
      }
    }
    for (const kind of Object.keys(found)) expect(found[kind], `anti-vacuity: the walk found no ${kind} name at all`).toBeGreaterThan(100);
    const rows = [...undeclared.entries()].map(([key, sample]) => `${key}  (${sample})`).sort();
    expect(rows, '\nStored paths on a crisis-bearing record hold a name that NO ledger of its kind declares.'
      + '\nCascade the path in its rename module or rule it out in that module\'s NON_CASCADED list:\n'
      + rows.map((row) => `  ${row}`).join('\n') + '\n').toEqual([]);
  });
});

describe('the control', () => {
  test('a no-op rename, and a rename of a name the record never carries, leave every crisis record byte-identical', () => {
    const moved = [];
    for (const { index, save } of crises) {
      const before = JSON.stringify(save);
      const name = rosterFactions(save)[0];
      for (const [label, apply] of [
        ['faction no-op', (r) => applyFactionRenameToSettlement(r, name, name)],
        ['faction absent', (r) => applyFactionRenameToSettlement(r, 'Nobody Of That Name', NEW_FACTION)],
        ['person absent', (r) => applyNpcRenameToSettlement(r, 'Nobody Of That Name', NEW_PERSON)],
        ['house no-op', (r) => applyInstitutionRenameToSettlement(r, [...rosterHouses(save)][0] || 'x', [...rosterHouses(save)][0] || 'x')],
        ['house absent', (r) => applyInstitutionRenameToSettlement(r, 'Nobody Of That Name', NEW_HOUSE)],
      ]) {
        const record = reloaded(save);
        const result = apply(record);
        if (result.changed || JSON.stringify(record) !== before) moved.push(`soak1k-${index}: ${label}`);
      }
    }
    expect(crises.length).toBeGreaterThan(0);
    expect(moved, 'a rename that should move nothing moved the record').toEqual([]);
  });
});
