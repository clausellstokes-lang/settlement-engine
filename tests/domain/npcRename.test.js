/**
 * npcRename.test.js — THE NPC CASCADE DENOMINATOR PIN.
 *
 * The sibling of tests/domain/factionRename.test.js, built on the same method
 * and for the same reason: a character's display name is a JOIN KEY, and the two
 * rename lanes each moved a different subset of the places that hold it. The
 * store lane wrote exactly `npcs[index].name`; the library lane wrote that plus
 * the relationship joins and the neighbour contacts. NEITHER walked
 * `factions[].members[].name`.
 *
 * SAVES, NOT SETTLEMENTS. Every fixture here is JSON round-tripped through
 * `reloaded()` before it is renamed, because that is the step the bug hid behind.
 * At generation the member record IS the `npcs[]` object (power/factionGrouping.js
 * pushes the very reference), so an in-memory rename appears to move both homes
 * and every in-memory probe agrees. Serialization splits the alias, and the member
 * copies were the stale ones on every reloaded save — the ones the dossier renders
 * as faction member chips (tabs/RelationshipsTab.jsx).
 *
 * THE DENOMINATOR IS INDEPENDENT. `walkNpcNamePaths` walks the ENTIRE settlement
 * blob and reports the path shape of every string that equals, or whole-word
 * contains, a roster character's name. It reads nothing from the module under
 * test. Every shape it finds must be covered by NPC_RENAME_SURFACES (it cascades)
 * or NPC_NON_CASCADED_SURFACES (a written ruling), so a FUTURE field carrying a
 * character name reds this file instead of hiding behind an un-probed path.
 *
 * WHY THE EXEMPTION LIST IS ALL PROSE. No rename lane has ever rewritten
 * generated prose about a person, and doing so is new capability rather than
 * repair of the lane divergence this cascade closes — it is owner-gated and
 * recorded in NPC_NON_CASCADED_SURFACES rather than taken silently. These pins
 * therefore assert the KEY joins all move and the prose deliberately does not.
 */

import { describe, expect, test, beforeAll } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import {
  NPC_NON_CASCADED_SURFACES,
  NPC_RENAME_SURFACES,
  applyNpcRenameToPartner,
  applyNpcRenameToSettlement,
  npcRenameChanges,
} from '../../src/domain/factionRename.js';

const NEW_NAME = 'Wren Ashdown';

/**
 * Three worlds, deliberately unlike each other: tier drives roster size and the
 * relationship edge count, culture drives the name shapes the walk has to match.
 */
const DENOMINATOR_CASES = Object.freeze([
  { seed: 'npc-rename-cascade-a', config: { settType: 'city', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' } },
  { seed: 'npc-rename-cascade-b', config: { settType: 'town', culture: 'coastal', terrain: 'coastal', tradeRouteAccess: 'river' } },
  { seed: 'npc-rename-cascade-c', config: { settType: 'metropolis', culture: 'imperial', terrain: 'hills', tradeRouteAccess: 'crossroads' } },
]);

/** A settlement as a RELOADED SAVE. See the file header. */
function reloaded(settlement) {
  return JSON.parse(JSON.stringify(settlement));
}

/** Resolve a DECLARED surface path (`factions[].members[].name`) against a blob. */
function valuesAtPath(root, path) {
  let nodes = [root];
  for (const segment of path.split('.')) {
    const isList = segment.endsWith('[]');
    const key = isList ? segment.slice(0, -2) : segment;
    const next = [];
    for (const node of nodes) {
      if (!node || typeof node !== 'object') continue;
      const value = node[key];
      if (value === undefined || value === null) continue;
      if (isList) {
        if (Array.isArray(value)) next.push(...value);
      } else {
        next.push(value);
      }
    }
    nodes = next;
  }
  return nodes;
}

/** The whole-word test the module's own prose substitution uses. */
function wholeWordRe(name) {
  return new RegExp(
    `(?<![\\p{L}\\p{N}\\p{M}_])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}\\p{M}_])`,
    'u',
  );
}

/** Values a key-surface path returned that EXACTLY equal `name`. */
function exactHits(values, name) {
  return values.filter(v => typeof v === 'string' && v.trim() === name).length;
}

/**
 * THE INDEPENDENT DENOMINATOR. Walk every string in the blob and return the path
 * SHAPE (array indices collapsed to `[]`) of each one that exactly equals, or
 * whole-word contains, `name`.
 *
 * @returns {Map<string, { count: number, sample: string }>}
 */
function walkNpcNamePaths(root, name) {
  const re = wholeWordRe(name);
  /** @type {Map<string, { count: number, sample: string }>} */
  const shapes = new Map();
  (function rec(node, path) {
    if (typeof node === 'string') {
      if (node.trim() !== name && !re.test(node)) return;
      const shape = path.replace(/\[\d+\]/g, '[]');
      const entry = shapes.get(shape) || { count: 0, sample: node };
      entry.count += 1;
      shapes.set(shape, entry);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((value, index) => rec(value, `${path}[${index}]`));
      return;
    }
    if (node && typeof node === 'object') {
      for (const [key, value] of Object.entries(node)) rec(value, path ? `${path}.${key}` : key);
    }
  })(root, '');
  return shapes;
}

const DECLARED_PATHS = new Set(NPC_RENAME_SURFACES.map(s => s.path));
const NON_CASCADED_PATHS = new Set(NPC_NON_CASCADED_SURFACES.map(s => s.path));

/** Roster names that whole-word contain, or are contained by, another roster name. */
function collidingNames(roster) {
  return roster.filter(a => roster.some(b => b !== a && wholeWordRe(a).test(b)));
}

/** @type {Array<{ seed: string, save: any, roster: string[] }>} */
let worlds = [];
let base;
let leadName;

beforeAll(() => {
  worlds = DENOMINATOR_CASES.map(({ seed, config }) => {
    const settlement = generateSettlementPipeline(config, null, { seed, customContent: {} });
    return {
      seed,
      save: reloaded(settlement),
      roster: (settlement.npcs || []).map(npc => npc?.name).filter(Boolean),
    };
  });
  base = worlds[0].save;
  leadName = worlds[0].roster[0];
});

describe('NPC rename — the INDEPENDENT denominator', () => {
  test('every stored path that carries a character name is declared, or ruled out in writing', () => {
    /** @type {Map<string, { sample: string, seeds: Set<string> }>} */
    const seen = new Map();
    for (const world of worlds) {
      for (const name of world.roster) {
        for (const [shape, info] of walkNpcNamePaths(world.save, name)) {
          const entry = seen.get(shape) || { sample: info.sample, seeds: new Set() };
          entry.seeds.add(world.seed);
          seen.set(shape, entry);
        }
      }
    }

    // Anti-vacuity: the walk must have found real ground. If the generator stops
    // emitting NPCs, or the walk breaks, this floor says so rather than an empty
    // "no undeclared paths" green.
    expect(
      seen.size,
      `the whole-blob walk found only ${seen.size} character-name-bearing paths across ${worlds.length} worlds`,
    ).toBeGreaterThanOrEqual(8);

    const undeclared = [...seen.entries()]
      .filter(([shape]) => !DECLARED_PATHS.has(shape) && !NON_CASCADED_PATHS.has(shape))
      .map(([shape, info]) => `${shape}  (seeds: ${[...info.seeds].join(', ')})  e.g. ${JSON.stringify(info.sample.slice(0, 80))}`)
      .sort();

    expect(
      undeclared,
      '\nStored paths hold a character display name but appear in NEITHER'
      + ' NPC_RENAME_SURFACES nor NPC_NON_CASCADED_SURFACES.\nEither cascade the path'
      + ' or record why it must not move:\n' + undeclared.map(u => `  ${u}`).join('\n') + '\n',
    ).toEqual([]);
  });

  test('renaming any character on any seed leaves no KEY join holding the dead name', () => {
    const cases = worlds.flatMap(world => world.roster.map(name => ({ seed: world.seed, name, save: world.save })));
    expect(cases.length, 'no characters to rename across the denominator worlds').toBeGreaterThanOrEqual(10);

    const failures = collectSeedFailures(cases, ({ seed, name, save }) => {
      const collisions = collidingNames([name, ...worlds.find(w => w.seed === seed).roster.filter(n => n !== name)]);
      const settlement = reloaded(save);

      // PRESENT-THEN-ABSENT anchor: prove the name is really in the blob before
      // measuring its removal, so a walk that silently returns nothing cannot pass.
      const before = walkNpcNamePaths(settlement, name);
      expect(before.size, `"${name}" holds no path at all before the rename`).toBeGreaterThan(0);

      applyNpcRenameToSettlement(settlement, name, NEW_NAME);

      const stale = [...walkNpcNamePaths(settlement, name).keys()]
        .filter(shape => !NON_CASCADED_PATHS.has(shape))
        .sort();
      expect(
        stale,
        `renaming "${name}" left these paths holding the old name: ${stale.join(', ')}`
        + (collisions.length ? ` (NOTE: roster name collision — ${collisions.join(' / ')})` : ''),
      ).toEqual([]);
    });
    expectNoSeedFailures(failures, 'every character on every denominator seed renames cleanly');
  });

  test('the two ledgers are disjoint and every non-cascade decision carries its reason', () => {
    const both = [...DECLARED_PATHS].filter(p => NON_CASCADED_PATHS.has(p));
    expect(both, `paths declared as BOTH cascaded and not cascaded: ${both.join(', ')}`).toEqual([]);
    for (const entry of NPC_NON_CASCADED_SURFACES) {
      expect(entry.why.length, `NPC_NON_CASCADED_SURFACES entry ${entry.path} has no written reason`)
        .toBeGreaterThan(10);
    }
    // Every cascaded surface is an exact-name join; the prose is exempted, not
    // substituted. A 'prose' entry appearing here means that ruling changed.
    expect(NPC_RENAME_SURFACES.filter(s => s.kind !== 'key')).toEqual([]);
    expect(NPC_RENAME_SURFACES.length).toBeGreaterThanOrEqual(5);
  });
});

describe('NPC rename — the second home (the regression this pin exists for)', () => {
  test('a saved-and-reloaded character is renamed at BOTH homes', () => {
    const settlement = reloaded(base);
    const members = (settlement.factions || []).flatMap(group => group.members || []);
    // Anchored: the fixture provably carries a SEPARATE member copy of this
    // character, so the assertion below cannot pass by the copy being absent.
    const held = members.filter(m => m?.name === leadName);
    expect(held.length, `no faction group member carries "${leadName}" on this seed`).toBeGreaterThan(0);
    expect(members.some(m => m === settlement.npcs?.[0]), 'members must be separate objects after reload')
      .toBe(false);

    const result = applyNpcRenameToSettlement(settlement, leadName, NEW_NAME);
    expect(result.changed).toBe(true);
    expect(result.touched).toContain('factions[].members[].name');

    const stillStale = (settlement.factions || [])
      .flatMap(group => group.members || [])
      .filter(m => m?.name === leadName);
    expect(stillStale, `${stillStale.length} member copies kept the dead name`).toEqual([]);
    expect(members.filter(m => m?.name === NEW_NAME).length).toBe(held.length);
  });

  test('the relationship edges are joined by NAME and follow the rename', () => {
    const settlement = reloaded(base);
    const ends = (edge) => [edge?.npc1Name, edge?.npc2Name];
    const before = (settlement.relationships || []).filter(edge => ends(edge).includes(leadName));
    // Anchored: this seed's edge list provably names the renamed character.
    expect(before.length, `no relationship edge names "${leadName}" on this seed`).toBeGreaterThan(0);

    applyNpcRenameToSettlement(settlement, leadName, NEW_NAME);

    const stale = (settlement.relationships || []).filter(edge => ends(edge).includes(leadName));
    expect(stale, `${stale.length} relationship edges kept the dead name`).toEqual([]);
    expect((settlement.relationships || []).filter(edge => ends(edge).includes(NEW_NAME)).length)
      .toBe(before.length);
  });
});

describe('NPC rename — the declared surface set', () => {
  test('TOTALITY: a fixture holding the name at every declared surface moves all of them', () => {
    const OLD = 'Aldis Vane';
    /** One character record, built fresh at each home — a RELOADED save has no aliases. */
    const npcRecord = () => ({ id: 'npc.1', name: OLD, role: 'Guildmaster' });
    const settlement = {
      name: 'Bramblewatch',
      npcs: [npcRecord()],
      factions: [{ name: 'Harbour Compact', members: [npcRecord()] }],
      relationships: [
        { npc1Id: 'npc.1', npc2Id: 'npc.2', npc1Name: OLD, npc2Name: 'Mira Solt' },
        { npc1Id: 'npc.3', npc2Id: 'npc.1', npc1Name: 'Bex Harrow', npc2Name: OLD },
      ],
      interSettlementRelationships: [
        { partnerSettlement: 'Elsewhere', npcName: OLD, partnerName: 'Odo Wick' },
      ],
    };
    // Anti-vacuity: prove the fixture really holds every surface BEFORE renaming.
    const unheld = NPC_RENAME_SURFACES
      .filter(surface => exactHits(valuesAtPath(settlement, surface.path), OLD) === 0)
      .map(surface => surface.path);
    expect(unheld, `totality fixture does not exercise: ${unheld.join(', ')}`).toEqual([]);

    const result = applyNpcRenameToSettlement(settlement, OLD, NEW_NAME);
    expect(result.changed).toBe(true);
    expect([...result.touched].sort()).toEqual([...NPC_RENAME_SURFACES.map(s => s.path)].sort());

    const stale = NPC_RENAME_SURFACES
      .filter(surface => exactHits(valuesAtPath(settlement, surface.path), OLD) > 0)
      .map(surface => surface.path);
    expect(stale, `surfaces STILL holding the old name: ${stale.join(', ')}`).toEqual([]);
    const lost = NPC_RENAME_SURFACES
      .filter(surface => exactHits(valuesAtPath(settlement, surface.path), NEW_NAME) === 0)
      .map(surface => surface.path);
    expect(lost, `surfaces that did not gain the new name: ${lost.join(', ')}`).toEqual([]);
    // The OTHER end of each edge, and the neighbour's own person, stay put.
    expect(settlement.relationships[0].npc2Name).toBe('Mira Solt');
    expect(settlement.relationships[1].npc1Name).toBe('Bex Harrow');
    expect(settlement.interSettlementRelationships[0].partnerName).toBe('Odo Wick');
  });
});

describe('NPC rename — what it must NOT touch', () => {
  test('generated prose keeps the old name (the owner-gated exemption, asserted)', () => {
    // This is the ledger's claim stated as behavior. If the prose policy is ever
    // ruled and the cascade widened, THIS is the test that must be rewritten —
    // deliberately, rather than a silent widening nobody notices.
    const settlement = {
      npcs: [{ id: 'npc.1', name: 'Aldis Vane', secret: { what: 'Aldis Vane sells manifests.' } }],
      relationships: [{ npc1Name: 'Aldis Vane', npc2Name: 'Mira Solt', description: 'Aldis Vane owes Mira Solt.' }],
    };
    applyNpcRenameToSettlement(settlement, 'Aldis Vane', NEW_NAME);
    expect(settlement.npcs[0].name).toBe(NEW_NAME);
    expect(settlement.relationships[0].npc1Name).toBe(NEW_NAME);
    expect(settlement.npcs[0].secret.what).toBe('Aldis Vane sells manifests.');
    expect(settlement.relationships[0].description).toBe('Aldis Vane owes Mira Solt.');
  });

  test('a character record never GAINS a field it did not carry', () => {
    const settlement = { npcs: [{ id: 'npc.1', name: 'Aldis Vane' }] };
    applyNpcRenameToSettlement(settlement, 'Aldis Vane', NEW_NAME);
    expect(Object.keys(settlement.npcs[0]).sort()).toEqual(['id', 'name']);
  });

  test('a neighbour contact naming a DIFFERENT person is left alone', () => {
    // `npcName` is this save's own person and `partnerName` is the neighbour's;
    // renaming ours must not rewrite a link that merely mentions the name in the
    // partner slot (that is a stranger who happens to share it).
    const settlement = {
      npcs: [{ id: 'npc.1', name: 'Aldis Vane' }],
      interSettlementRelationships: [
        { partnerSettlement: 'Elsewhere', npcName: 'Bex Harrow', partnerName: 'Aldis Vane' },
      ],
    };
    applyNpcRenameToSettlement(settlement, 'Aldis Vane', NEW_NAME);
    const link = settlement.interSettlementRelationships[0];
    expect(link.npcName).toBe('Bex Harrow');
    expect(link.partnerName).toBe('Aldis Vane');
  });

  test('a no-op rename reports no change and touches nothing', () => {
    const settlement = reloaded(base);
    const before = JSON.stringify(settlement);
    expect(applyNpcRenameToSettlement(settlement, leadName, leadName).changed).toBe(false);
    expect(applyNpcRenameToSettlement(settlement, leadName, '').changed).toBe(false);
    expect(JSON.stringify(settlement)).toBe(before);
  });
});

describe('NPC rename — the immutable form used by the library lane', () => {
  test('npcRenameChanges returns only touched buckets and never mutates its input', () => {
    const settlement = reloaded(base);
    const before = JSON.stringify(settlement);
    const { changed, changes } = npcRenameChanges(settlement, leadName, NEW_NAME);
    expect(changed).toBe(true);
    expect(JSON.stringify(settlement)).toBe(before);
    expect(changes.npcs.some(npc => npc.name === NEW_NAME)).toBe(true);
    // Buckets the settlement does not declare are not invented.
    const invented = Object.keys(changes).filter(k => settlement[k] === undefined);
    expect(invented).toEqual([]);
  });

  test('the immutable form carries the same surfaces as the in-place form', () => {
    const inPlace = reloaded(base);
    const direct = applyNpcRenameToSettlement(inPlace, leadName, NEW_NAME);
    const viaChanges = npcRenameChanges(reloaded(base), leadName, NEW_NAME);
    expect([...viaChanges.touched].sort()).toEqual([...direct.touched].sort());
  });
});

describe('NPC rename — the neighbour cascade', () => {
  const HOST = 'Bramblewatch';

  test("a partner's contact with the renamed person is rewritten", () => {
    const partner = {
      interSettlementRelationships: [
        { partnerSettlement: HOST, npcName: 'Odo Wick', partnerName: 'Aldis Vane' },
      ],
    };
    const { settlement, changed } = applyNpcRenameToPartner(partner, HOST, 'Aldis Vane', NEW_NAME);
    expect(changed).toBe(true);
    expect(settlement.interSettlementRelationships[0].partnerName).toBe(NEW_NAME);
    // The partner's OWN person is untouched.
    expect(settlement.interSettlementRelationships[0].npcName).toBe('Odo Wick');
  });

  test('a link pointing at a DIFFERENT settlement is left alone even on a name collision', () => {
    const partner = {
      interSettlementRelationships: [
        { partnerSettlement: 'Somewhere Else', partnerName: 'Aldis Vane' },
      ],
    };
    const { settlement, changed } = applyNpcRenameToPartner(partner, HOST, 'Aldis Vane', NEW_NAME);
    expect(changed).toBe(false);
    expect(settlement.interSettlementRelationships[0].partnerName).toBe('Aldis Vane');
  });

  test('a partner holding its own same-named person keeps it', () => {
    const partner = {
      npcs: [{ id: 'npc.9', name: 'Aldis Vane' }],
      interSettlementRelationships: [
        { partnerSettlement: HOST, npcName: 'Aldis Vane', partnerName: 'Odo Wick' },
      ],
    };
    const { changed } = applyNpcRenameToPartner(partner, HOST, 'Aldis Vane', NEW_NAME);
    expect(changed).toBe(false);
    expect(partner.npcs[0].name).toBe('Aldis Vane');
  });
});
