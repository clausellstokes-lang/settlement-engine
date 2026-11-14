/**
 * factionRename.test.js — THE CASCADE DENOMINATOR PIN (owner queue #14).
 *
 * A faction's display name is a JOIN KEY in more than twenty stored places. The
 * two historical rename lanes each moved a subset and neither knew about the
 * other's, which is exactly why the atlas called this "the sharpest finding in
 * the slice". A cascade test that only checks the roster entry would pass while
 * the roster silently detached from its own members.
 *
 * WHY THIS FILE WAS REBUILT (R-5 closing cure). The first version of this pin
 * measured FACTION_RENAME_SURFACES against a hand-written PROBES map that named
 * the very same paths. That is a self-referential exam: the denominator was the
 * module's own answer sheet, so a stored field the module had never heard of was
 * invisible to the test BY CONSTRUCTION, and the pin reported a confident green
 * over four reader-visible surfaces that never moved. Both halves of that defect
 * are now gone:
 *
 *   1. THE DENOMINATOR IS INDEPENDENT. `walkFactionNamePaths` walks the ENTIRE
 *      settlement blob and reports the path shape of every string that equals, or
 *      whole-word contains, a roster faction name. It never reads the module's
 *      declarations. Every shape it finds must be covered by
 *      FACTION_RENAME_SURFACES (it cascades) or NON_CASCADED_SURFACES (a written
 *      ruling), so a FUTURE field carrying a faction name reds this file instead
 *      of hiding behind an un-probed path.
 *   2. THE PROBES ARE GONE. `valuesAtPath` resolves a DECLARED path against the
 *      data generically, so a surface cannot be mis-probed into agreement with
 *      itself, and a new surface needs no second spelling in this file.
 *
 * SAVES, NOT SETTLEMENTS. Every fixture here is JSON round-tripped through
 * `reloaded()` before it is renamed. That is not a convenience clone: at
 * generation one NPC object is SHARED between `settlement.npcs[]` and
 * `settlement.factions[].members[]`, so an in-memory rename appears to move both
 * homes and every in-memory probe agrees. Serialization splits the alias, and the
 * member copies were the stale ones on every reloaded save. Testing the live
 * object would reproduce the exact blindness that let the bug ship.
 *
 * HOW THIS PIN CAN RED FOR A NON-BUG (read before "fixing" it): if the generator
 * ever emits two roster factions whose names whole-word contain one another
 * ("City Council" beside "Grand City Council"), renaming the shorter one leaves
 * the longer one's record matching the walk, and this file reports it as stale.
 * That is a real hazard of whole-word prose substitution rather than a cascade
 * miss, and the failure message names the colliding pair.
 */

import { describe, expect, test, beforeAll } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { nameOf } from '../../src/domain/rulingPower.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import {
  DEFENSE_CATEGORIES,
  FACTION_RENAME_SURFACES,
  NON_CASCADED_SURFACES,
  applyFactionRenameToPartner,
  applyFactionRenameToSettlement,
  factionRenameChanges,
  resolveFactionForRename,
} from '../../src/domain/factionRename.js';

const SEED = 'faction-rename-cascade-2026-07-27';
const NEW_NAME = 'The Amber Concord';

/**
 * Three worlds, deliberately unlike each other: tier drives roster size and
 * tension count, culture and terrain drive which archetypes appear at all. One
 * seed would pin one roster shape and call it the estate.
 */
const DENOMINATOR_CASES = Object.freeze([
  { seed: SEED, config: { settType: 'city', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' } },
  { seed: 'faction-rename-denominator-b', config: { settType: 'town', culture: 'coastal', terrain: 'coastal', tradeRouteAccess: 'river' } },
  { seed: 'faction-rename-denominator-c', config: { settType: 'metropolis', culture: 'imperial', terrain: 'hills', tradeRouteAccess: 'crossroads' } },
]);

/**
 * A settlement as a RELOADED SAVE. See the file header: serialization is the step
 * that splits the npcs/members alias, and the bug lived on the far side of it.
 */
function reloaded(settlement) {
  return JSON.parse(JSON.stringify(settlement));
}

/**
 * Resolve a DECLARED surface path (`npcs[].secret.what`) against a settlement,
 * returning every leaf value it addresses. Generic on purpose: the hand-written
 * probe map this replaced was a second spelling of the cascade, so a surface and
 * its probe could agree with each other while agreeing with nothing in the data.
 */
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

/** Values a prose-surface path returned that CONTAIN `name` as a whole word. */
function proseHits(values, name) {
  const re = wholeWordRe(name);
  return values.filter(v => typeof v === 'string' && re.test(v)).length;
}

function hitsFor(surface, settlement, name) {
  const values = valuesAtPath(settlement, surface.path);
  return surface.kind === 'key' ? exactHits(values, name) : proseHits(values, name);
}

/**
 * THE INDEPENDENT DENOMINATOR. Walk every string in the blob and return the path
 * SHAPE (array indices collapsed to `[]`) of each one that exactly equals, or
 * whole-word contains, `name`. Reads nothing from the module under test.
 *
 * @returns {Map<string, { count: number, sample: string }>}
 */
function walkFactionNamePaths(root, name) {
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

const DECLARED_PATHS = new Set(FACTION_RENAME_SURFACES.map(s => s.path));

/**
 * A crisis cast holding `name` at every faction surface it carries (RUNG1B-F7): a stake
 * and a faction-kind row. The house and person rows beside it share nothing with it.
 */
function castFixture(name) {
  return {
    nature: 'social',
    roles: [
      { role: 'instigator', kind: 'faction', id: name, name, reason: 'the faction with the most to gain', temporary: false },
      { role: 'target', kind: 'npc', id: 'npc.9', name: 'Odo Wick', reason: 'the seat', temporary: false },
    ],
    stakes: [{ factionId: name, stake: 'gains', reason: 'gains while the seat weakens' }],
    levers: [{ institution: 'Customs House', holderId: null, holderName: null }],
  };
}
const NON_CASCADED_PATHS = new Set(NON_CASCADED_SURFACES.map(s => s.path));

/** Roster names that whole-word contain, or are contained by, another roster name. */
function collidingNames(roster) {
  return roster.filter(a => roster.some(b => b !== a && wholeWordRe(a).test(b)));
}

/** @type {Array<{ seed: string, save: any, roster: string[] }>} */
let worlds = [];
let base;
let governingName;

beforeAll(() => {
  worlds = DENOMINATOR_CASES.map(({ seed, config }) => {
    const settlement = generateSettlementPipeline(config, null, { seed, customContent: {} });
    return {
      seed,
      save: reloaded(settlement),
      roster: (settlement.powerStructure?.factions || []).map(nameOf).filter(Boolean),
    };
  });
  base = worlds[0].save;
  governingName = nameOf((base.powerStructure?.factions || []).find(f => f?.isGoverning)
    || base.powerStructure?.factions?.[0]);
});

describe('faction rename — the INDEPENDENT denominator', () => {
  test('every stored path that carries a faction name is declared, or ruled out in writing', () => {
    /** @type {Map<string, { sample: string, seeds: Set<string> }>} */
    const seen = new Map();
    for (const world of worlds) {
      for (const name of world.roster) {
        for (const [shape, info] of walkFactionNamePaths(world.save, name)) {
          const entry = seen.get(shape) || { sample: info.sample, seeds: new Set() };
          entry.seeds.add(world.seed);
          seen.set(shape, entry);
        }
      }
    }

    // Anti-vacuity: the walk must have found real ground. If the generator stops
    // emitting factions, or the walk breaks, this floor is the thing that says so
    // rather than an empty "no undeclared paths" green.
    expect(
      seen.size,
      `the whole-blob walk found only ${seen.size} faction-name-bearing paths across ${worlds.length} worlds`,
    ).toBeGreaterThanOrEqual(14);

    const undeclared = [...seen.entries()]
      .filter(([shape]) => !DECLARED_PATHS.has(shape) && !NON_CASCADED_PATHS.has(shape))
      .map(([shape, info]) => `${shape}  (seeds: ${[...info.seeds].join(', ')})  e.g. ${JSON.stringify(info.sample.slice(0, 80))}`)
      .sort();

    expect(
      undeclared,
      '\nStored paths hold a faction display name but appear in NEITHER'
      + ' FACTION_RENAME_SURFACES nor NON_CASCADED_SURFACES.\nEither cascade the path'
      + ' or record why it must not move:\n' + undeclared.map(u => `  ${u}`).join('\n') + '\n',
    ).toEqual([]);
  });

  test('renaming any roster faction on any seed leaves nothing stale but the declared exemptions', () => {
    const cases = worlds.flatMap(world => world.roster.map(name => ({ seed: world.seed, name, save: world.save })));
    expect(cases.length, 'no roster factions to rename across the denominator worlds').toBeGreaterThanOrEqual(10);

    const failures = collectSeedFailures(cases, ({ seed, name, save }) => {
      const collisions = collidingNames([name, ...worlds.find(w => w.seed === seed).roster.filter(n => n !== name)]);
      const settlement = reloaded(save);

      // PRESENT-THEN-ABSENT anchor: prove the name is actually in the blob before
      // measuring its removal, so a walk that silently returns nothing cannot pass.
      const before = walkFactionNamePaths(settlement, name);
      expect(before.size, `"${name}" holds no path at all before the rename`).toBeGreaterThan(0);

      applyFactionRenameToSettlement(settlement, name, NEW_NAME);

      const stale = [...walkFactionNamePaths(settlement, name).keys()]
        .filter(shape => !NON_CASCADED_PATHS.has(shape))
        .sort();
      expect(
        stale,
        `renaming "${name}" left these paths holding the old name: ${stale.join(', ')}`
        + (collisions.length ? ` (NOTE: roster name collision — ${collisions.join(' / ')})` : ''),
      ).toEqual([]);
    });
    expectNoSeedFailures(failures, 'every roster faction on every denominator seed renames cleanly');
  });

  test('the two ledgers are disjoint and every non-cascade decision carries its reason', () => {
    const both = [...DECLARED_PATHS].filter(p => NON_CASCADED_PATHS.has(p));
    expect(both, `paths declared as BOTH cascaded and not cascaded: ${both.join(', ')}`).toEqual([]);
    for (const entry of NON_CASCADED_SURFACES) {
      expect(entry.why.length, `NON_CASCADED_SURFACES entry ${entry.path} has no written reason`)
        .toBeGreaterThan(10);
    }
    expect(FACTION_RENAME_SURFACES.length).toBeGreaterThanOrEqual(26);
  });
});

describe('faction rename — the declared surface set', () => {
  test('the generator actually exercises the cascade (the fixture is not empty)', () => {
    expect(governingName).toBeTruthy();
    const exercised = FACTION_RENAME_SURFACES
      .filter(surface => hitsFor(surface, base, governingName) > 0)
      .map(surface => surface.path);
    // Measured on this seed. The floor is what says the cascade test below has
    // gone vacuous; the surfaces this seed does not reach are covered
    // deterministically by the totality fixture further down.
    expect(exercised.length, `surfaces holding the governing name on real pipeline output: ${exercised.join(', ')}`)
      .toBeGreaterThanOrEqual(9);
  });

  test('TOTALITY: a fixture holding the name at every declared surface moves all of them', () => {
    const OLD = 'Harbour Compact';
    /** One NPC record, built fresh at each home — a RELOADED save has no aliases. */
    const npcRecord = () => ({
      id: 'npc.1',
      name: 'Aldis',
      // PEOPLE-5B (M-7): the v2 card carries no factionAffiliation / secondaryAffiliation / linkedFactionIds /
      // factionGoal — its powers are `memberships` below, the cascade's one key row.
      // The title and the goal line both carry the faction token (added 2026-08-01
      // with the surfaces themselves; see NPC_FACTION_FIELDS in factionRename.js).
      role: `${OLD} Harbourmaster`,
      // The succession-void goal names a faction too (added 2026-09-30 with its surface).
      // ALLEGIANCE-CAR4 (2026-11-09): the goals rebuilt name a power in the long goal too, and a keyed goal that targets a
      // power holds its name as the intent's target id (factionRename.js's three new surfaces).
      goal: { short: `Position themselves before ${OLD} moves first`, long: `Lead ${OLD} one day, with or without a blessing.`,
        intent: { short: { family: 'POWER', kind: 'tense', key: 'expand_influence', target: { kind: 'power', id: OLD } },
          long: { family: 'RANK', kind: 'enter', key: 'secure_office', target: { kind: 'power', id: OLD } } } },
      secret: { what: `Aldis sells ${OLD} manifests to the Militia.`, stakes: `The ${OLD} would drown them for it.` },
      // PEOPLE-1 CAST (2026-11-07): the card's powers and, for a minted face, the power it stands for.
      title: `the head of ${OLD}`,
      institution: { kind: 'power', key: OLD, family: null, title: `the head of ${OLD}` },
      memberships: [{ power: OLD, rank: 1, share: 1 }, { power: 'Militia', rank: null, share: 0.2 }],
      // ALLEGIANCE-CAR1 (2026-11-08): the hidden allegiance names the criminal power it answers to (factionRename.js's new surface)
      allegiance: { power: OLD, house: 'Customs House', vector: 'greed', via: 'office', handler: null, share: 0.15, veiled: true, covert: true },
    });
    const settlement = {
      name: 'Bramblewatch',
      pressureSentence: `The ${OLD} has the quays by the throat and everyone knows it.`,
      powerStructure: {
        // The second record is a doubled-niche rival naming the niche it contests (RUNG1B-F7).
        factions: [{ faction: OLD, name: OLD, desc: `The ${OLD} keeps the quays.`, isGoverning: true }, { faction: 'Quay Wardens', contestsNiche: OLD }],
        governingName: OLD,
        government: OLD,
        recentConflict: `The ${OLD} broke the grain cartel.`,
        // GS-2 (ODQ §934.101): the conflict mirror, a SEPARATE record as on a reloaded save.
        conflicts: [{ parties: [OLD, 'Militia'], desc: `${OLD} and Militia are in high conflict.`, plotHooks: [`A clerk of the ${OLD} sells the Militia a ledger.`] }],
        factionRelationships: [{
          pair: [OLD, 'Militia'],
          narrative: `${OLD} commands, Militia executes.`,
          dmNote: `The ${OLD} will not be refused twice.`,
        }],
      },
      npcs: [npcRecord()],
      // The in-settlement edge list: only the per-end TITLES carry a faction token.
      // The name halves belong to the NPC rename lane and stay put here.
      relationships: [{
        npc1Name: 'Aldis', npc2Name: 'Bryn',
        npc1Role: `${OLD} Harbourmaster`, npc2Role: `${OLD} Tollwright`,
      }],
      institutions: [{ name: 'Customs House', factionSource: OLD }],
      // PEOPLE-5B (M-7): no grouping `factions` — a v2 record's card has one home.
      // GS-2 (ODQ §934.101): a conflict is fought between POWER factions, so its party keys,
      // its sentence and its hooks carry the faction's name at the top-level home too.
      conflicts: [{ parties: [OLD, 'Militia'], desc: `${OLD} and Militia are in high conflict.`, plotHooks: [`A clerk of the ${OLD} sells the Militia a ledger.`] }],
      history: {
        founding: { story: `The ${OLD} laid the first stone.` },
        currentTensions: [{ type: 'guild_conflict', factions: [OLD, 'Militia'] }],
      },
      interSettlementRelationships: [
        { partnerSettlement: 'Elsewhere', factionName: OLD, partnerFactionName: OLD },
      ],
      // RUNG1B-F7: the defence profile's institution copies, every bucket.
      defenseProfile: { institutions: Object.fromEntries(DEFENSE_CATEGORIES.map(c => [c, [{ name: `Harbour ${c}`, factionSource: OLD }]])) },
      coherenceNotes: [{ severity: 'contradiction', note: `${OLD} holds 40% of power in this transit hub.` }],
      // RUNG1B-F7: the crisis cast. A single crisis is an entry OBJECT, several an ARRAY;
      // this fixture holds the object at `stress` and the array at `stressors`, and the
      // mirror below holds the other two homes, so every declared home is exercised.
      stress: { type: 'insurgency', cast: castFixture(OLD) },
      stressors: [{ type: 'insurgency', cast: castFixture(OLD) }],
    };
    const mirror = { stress: [{ type: 'insurgency', cast: castFixture(OLD) }], stressors: { type: 'insurgency', cast: castFixture(OLD) } };
    const fixtures = [settlement, mirror];
    const anyHits = (surface, name) => fixtures.some(f => hitsFor(surface, f, name) > 0);
    // Anti-vacuity: prove the fixture really holds every surface BEFORE renaming.
    const unheld = FACTION_RENAME_SURFACES
      .filter(surface => !anyHits(surface, OLD))
      .map(surface => surface.path);
    expect(unheld, `totality fixture does not exercise: ${unheld.join(', ')}`).toEqual([]);

    const result = applyFactionRenameToSettlement(settlement, OLD, NEW_NAME);
    const mirrorResult = applyFactionRenameToSettlement(mirror, OLD, NEW_NAME);
    expect(result.changed).toBe(true);
    expect(mirrorResult.changed).toBe(true);
    expect([...new Set([...result.touched, ...mirrorResult.touched])].sort()).toEqual([...FACTION_RENAME_SURFACES.map(s => s.path)].sort());
    const stale = FACTION_RENAME_SURFACES
      .filter(surface => anyHits(surface, OLD))
      .map(surface => surface.path);
    expect(stale, `surfaces STILL holding the old name: ${stale.join(', ')}`).toEqual([]);
    const lost = FACTION_RENAME_SURFACES
      .filter(surface => !anyHits(surface, NEW_NAME))
      .map(surface => surface.path);
    expect(lost, `surfaces that did not gain the new name: ${lost.join(', ')}`).toEqual([]);

    // The membership list keeps its sibling power: only the renamed power's entry moves.
    expect(settlement.npcs[0].memberships.map((m) => m.power)).toEqual([NEW_NAME, 'Militia']);
    // `history` is cascaded for the tension roster ONLY. The founding story names
    // the old faction and must be left exactly as recorded.
    expect(settlement.history.founding.story).toBe(`The ${OLD} laid the first stone.`);
  });
});

describe('faction rename — every exercised surface moves', () => {
  test('renaming the governing faction carries the name through the whole settlement', () => {
    const settlement = reloaded(base);
    const exercised = FACTION_RENAME_SURFACES
      .filter(surface => hitsFor(surface, settlement, governingName) > 0);

    const result = applyFactionRenameToSettlement(settlement, governingName, NEW_NAME);
    expect(result.changed).toBe(true);

    /** @type {string[]} */
    const stale = [];
    /** @type {string[]} */
    const missing = [];
    for (const surface of exercised) {
      if (hitsFor(surface, settlement, governingName) > 0) stale.push(surface.path);
      if (hitsFor(surface, settlement, NEW_NAME) === 0) missing.push(surface.path);
      // Each exercised surface must also be reported in `touched`, so a receipt
      // can never understate what a rename moved.
      expect(result.touched, `surface moved but not reported: ${surface.path}`)
        .toContain(surface.path);
    }
    expect(stale, `surfaces STILL holding the old faction name after the cascade: ${stale.join(', ')}`)
      .toEqual([]);
    expect(missing, `surfaces that lost the name entirely instead of gaining the new one: ${missing.join(', ')}`)
      .toEqual([]);
  });

  // PEOPLE-5B (2026-11-07, M-7): the SECOND HOME LEFT with the grouping (factionRename.js :: NPC_HOMES is
  // ['npcs[]']). The regression this arm pinned — a reloaded member copy keeping the dead name — cannot occur on a
  // v2 record, which carries no member copy; what stands in its place is the one home's proof on a reloaded save.
  test('a saved-and-reloaded card is healed at its ONE home, and the record carries no second', () => {
    const settlement = reloaded(base);
    expect('factions' in settlement, 'a v2 record carries no grouping').toBe(false);
    const held = settlement.npcs.filter(n => (n.memberships || []).some(m => m.power === governingName));
    // Anchored: the fixture provably carries cards standing in the renamed power.
    expect(held.length, 'no card stands in the governing power on this seed').toBeGreaterThan(0);
    applyFactionRenameToSettlement(settlement, governingName, NEW_NAME);
    const stillStale = settlement.npcs.filter(n => (n.memberships || []).some(m => m.power === governingName));
    expect(stillStale, `${stillStale.length} cards kept the dead power name`).toEqual([]);
  });

  test('the resolver reads through nameOf precedence, canonical list first', () => {
    const settlement = reloaded(base);
    const resolved = resolveFactionForRename(settlement, 0);
    expect(resolved?.currentName).toBe(nameOf(settlement.powerStructure.factions[0]));
    // PEOPLE-5B (M-7): the grouping fallback LEFT — a v1 save is migrated before it is edited, and a
    // record with no powers has nothing to rename.
    const legacyOnly = { factions: [{ name: 'Old Mirror' }] };
    expect(resolveFactionForRename(legacyOnly, 0)).toBeNull();
  });
});

describe('faction rename — what it must NOT touch', () => {
  test('a sibling faction keeps its name', () => {
    const settlement = reloaded(base);
    const roster = settlement.powerStructure.factions;
    const sibling = roster.find(f => nameOf(f) !== governingName);
    if (!sibling) {
      // A one-faction settlement cannot exercise this; say so rather than pass.
      expect(roster.length).toBe(1);
      return;
    }
    const siblingName = nameOf(sibling);
    applyFactionRenameToSettlement(settlement, governingName, NEW_NAME);
    expect(nameOf(roster.find(f => f === sibling))).toBe(siblingName);
  });

  test("a SIBLING's blurb naming the renamed faction follows the rename", () => {
    // The blurb is prose about relationships: a rival's description routinely
    // names the faction it is rival to. Scoping the desc rewrite to the renamed
    // record left every one of those stale on the page.
    const settlement = {
      powerStructure: {
        factions: [
          { faction: 'Harbour Compact', desc: 'The Harbour Compact keeps the quays.' },
          { faction: 'Militia', desc: 'Paid by the Harbour Compact, loyal to nobody.' },
        ],
      },
    };
    applyFactionRenameToSettlement(settlement, 'Harbour Compact', NEW_NAME);
    expect(settlement.powerStructure.factions[1].desc).toBe(`Paid by the ${NEW_NAME}, loyal to nobody.`);
    // ...without the sibling's own name moving.
    expect(settlement.powerStructure.factions[1].faction).toBe('Militia');
  });

  test('prose substitution respects word boundaries', () => {
    const settlement = {
      powerStructure: {
        factions: [{ faction: 'Rusk', desc: 'Rusk rules Ruskovia from the Ruskgate.' }],
      },
    };
    applyFactionRenameToSettlement(settlement, 'Rusk', 'Vale');
    expect(settlement.powerStructure.factions[0].desc)
      .toBe('Vale rules Ruskovia from the Ruskgate.');
  });

  test('the regime lineage is recorded history and is left alone', () => {
    const settlement = {
      powerStructure: {
        factions: [{ faction: 'Town Council', name: 'Town Council' }],
        governingName: 'Town Council',
        previousGovernments: [{ label: 'Town Council', cause: 'coup', tick: 3 }],
      },
    };
    applyFactionRenameToSettlement(settlement, 'Town Council', NEW_NAME);
    expect(settlement.powerStructure.governingName).toBe(NEW_NAME);
    // anchored: the lineage array is asserted non-empty on the line above's
    // fixture, so this cannot pass by the array vanishing.
    expect(settlement.powerStructure.previousGovernments).toHaveLength(1);
    expect(settlement.powerStructure.previousGovernments[0].label).toBe('Town Council');
  });

  test('the generation trace is a recorded receipt and is left alone', () => {
    const settlement = {
      powerStructure: { factions: [{ faction: 'Town Council' }] },
      simulationTrace: [{
        targetType: 'faction',
        causes: [{ reason: 'As the governing faction, Town Council inherits the legitimacy score.' }],
      }],
    };
    applyFactionRenameToSettlement(settlement, 'Town Council', NEW_NAME);
    expect(settlement.powerStructure.factions[0].faction).toBe(NEW_NAME);
    expect(settlement.simulationTrace[0].causes[0].reason)
      .toBe('As the governing faction, Town Council inherits the legitimacy score.');
  });

  test('a faction record never GAINS a name spelling it did not carry', () => {
    const canonicalOnly = { powerStructure: { factions: [{ faction: 'Guild Council' }] } };
    applyFactionRenameToSettlement(canonicalOnly, 'Guild Council', NEW_NAME);
    const record = canonicalOnly.powerStructure.factions[0];
    expect(record.faction).toBe(NEW_NAME);
    expect(Object.keys(record)).toEqual(['faction']);
  });

  test('an NPC record never GAINS a field it did not carry', () => {
    const settlement = { npcs: [{ id: 'npc.1', factionAffiliation: 'Guild Council' }] };
    applyFactionRenameToSettlement(settlement, 'Guild Council', NEW_NAME);
    expect(Object.keys(settlement.npcs[0]).sort()).toEqual(['factionAffiliation', 'id']);
  });

  test('a divergent legacy alias heals to the canonical name', () => {
    const divergent = { powerStructure: { factions: [{ faction: 'Guild Council', name: 'Stale Alias' }] } };
    applyFactionRenameToSettlement(divergent, 'Guild Council', NEW_NAME);
    expect(divergent.powerStructure.factions[0]).toEqual({ faction: NEW_NAME, name: NEW_NAME });
  });

  test('a no-op rename reports no change and touches nothing', () => {
    const settlement = reloaded(base);
    const before = JSON.stringify(settlement);
    expect(applyFactionRenameToSettlement(settlement, governingName, governingName).changed).toBe(false);
    expect(applyFactionRenameToSettlement(settlement, governingName, '').changed).toBe(false);
    expect(JSON.stringify(settlement)).toBe(before);
  });
});

describe('faction rename — the immutable form used by the library lane', () => {
  test('factionRenameChanges returns only touched buckets and never mutates its input', () => {
    const settlement = reloaded(base);
    const before = JSON.stringify(settlement);
    const { changed, changes } = factionRenameChanges(settlement, governingName, NEW_NAME);
    expect(changed).toBe(true);
    expect(JSON.stringify(settlement)).toBe(before);
    expect(nameOf(changes.powerStructure.factions.find(f => nameOf(f) === NEW_NAME))).toBe(NEW_NAME);
    // Buckets the settlement does not declare are not invented.
    const invented = Object.keys(changes).filter(k => settlement[k] === undefined);
    expect(invented).toEqual([]);
  });

  test('the immutable form carries the same surfaces as the in-place form', () => {
    const inPlace = reloaded(base);
    const direct = applyFactionRenameToSettlement(inPlace, governingName, NEW_NAME);
    const viaChanges = factionRenameChanges(reloaded(base), governingName, NEW_NAME);
    expect([...viaChanges.touched].sort()).toEqual([...direct.touched].sort());
  });
});

describe('faction rename — the neighbour cascade', () => {
  const HOST = 'Bramblewatch';

  test('a partner link naming this faction is rewritten', () => {
    const partner = {
      interSettlementRelationships: [
        { partnerSettlement: HOST, partnerFactionName: 'Old Guild', factionName: 'Their Own Guild' },
      ],
    };
    const { settlement, changed } = applyFactionRenameToPartner(partner, HOST, 'Old Guild', NEW_NAME);
    expect(changed).toBe(true);
    expect(settlement.interSettlementRelationships[0].partnerFactionName).toBe(NEW_NAME);
    expect(settlement.interSettlementRelationships[0].factionName).toBe('Their Own Guild');
  });

  test('a faction sharing a name with a town or a person does not drag them along', () => {
    // The broad renameInterSettlementReference rewrites partnerName and npcName
    // too. A FACTION rename must not: those are a settlement and a person.
    const settlement = {
      powerStructure: { factions: [{ faction: 'Ravensmark' }] },
      interSettlementRelationships: [
        { partnerSettlement: 'Elsewhere', partnerName: 'Ravensmark', npcName: 'Ravensmark', factionName: 'Ravensmark' },
      ],
    };
    applyFactionRenameToSettlement(settlement, 'Ravensmark', NEW_NAME);
    const link = settlement.interSettlementRelationships[0];
    expect(link.factionName).toBe(NEW_NAME);
    expect(link.partnerName).toBe('Ravensmark');
    expect(link.npcName).toBe('Ravensmark');
  });

  test('a link pointing at a DIFFERENT settlement is left alone even on a name collision', () => {
    const partner = {
      interSettlementRelationships: [
        { partnerSettlement: 'Elsewhere', partnerFactionName: 'Old Guild' },
      ],
    };
    const { settlement, changed } = applyFactionRenameToPartner(partner, HOST, 'Old Guild', NEW_NAME);
    expect(changed).toBe(false);
    expect(settlement.interSettlementRelationships[0].partnerFactionName).toBe('Old Guild');
  });
});
