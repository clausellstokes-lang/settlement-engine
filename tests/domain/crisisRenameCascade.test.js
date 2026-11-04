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
  NON_CASCADED_SURFACES,
  NPC_RENAME_SURFACES,
  applyFactionRenameToSettlement,
  applyNpcRenameToSettlement,
} from '../../src/domain/factionRename.js';

/** The first 48 soak records: every stress cell of the corpus's opening rotation, both container shapes. */
const SAMPLE = 48;
const NEW_FACTION = 'The Amber Concord';
const NEW_PERSON = 'Ysolde Amberlane';

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
