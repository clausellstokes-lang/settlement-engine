/**
 * editPools.test.js — EM-A2a acceptance, A1 to A8.
 *
 * THE MEMBER: `src/domain/edit/pools.js` — the pool machinery (`POOLS`, `poolValues`,
 * `rollFrom`) and the eleven TABLE-backed pools the settlement editor offers a DM. It
 * lands DARK: nothing under `src/` imports it at this tip, so these arms drive the leaf
 * itself rather than a surface, and they hold every pool against the ENGINE'S OWN
 * vocabulary AT ITS LAWFUL SOURCE. That is the arm that matters: a forked copy of a
 * catalogue, a second tier gate or a re-typed wizard menu reds here instead of shipping.
 *
 * SHAPE (preamble section P3.4): ONE literal `describe`, EIGHT straight-line `it`, no
 * `.each`, no `runIf`, no nesting. Table arms report a FULL offender list rather than a
 * count, so a red names the row that broke. Every negative is anchored — through
 * `tests/helpers/anchoredNegatives.js` or by the positive that precedes it in the same
 * arm — and no loop body carries a bare assertion (the seed-loop floor class).
 *
 * THIS FILE IS NOT A SAME-SEED INSTRUMENT. It reads no environment variable of any
 * kind and writes no fixture, so the golden-freeze roster gains nothing and cannot be
 * moved here. The spelling is deliberate: that roster is derived FROM THE TREE, and a
 * file naming the reader even in prose is one grep away from looking like a member.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

import { POOLS, poolValues, rollFrom } from '../../src/domain/edit/pools.js';
import { FIELD_DECLARATIONS } from '../../src/domain/edit/fieldDeclarations.js';
import { compareCodepoint } from '../../src/domain/deterministicSort.js';
import { getInstitutionsForTier, getInstitutionalCatalog } from '../../src/domain/institutionLookups.js';
import { FACTION_ARCHETYPES } from '../../src/domain/factionArchetypes.js';
import { NPC_STATUS_VALUES } from '../../src/domain/entities/npcs.js';
import { ENTITY_STATUS_VALUES } from '../../src/domain/entities/status.js';
import { TERRAIN_WEIGHTS, CULTURES } from '../../src/domain/worldFactOptions.js';
import { RESOURCE_DATA, SPECIAL_RESOURCES } from '../../src/data/resourceData.js';
import { TIER_ORDER } from '../../src/data/constants.js';
import { MONSTER_THREAT_TIERS, MONSTER_THREAT_RANDOM_POOL } from '../../src/data/monsterThreat.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { setActiveRng, clearActiveRng, random } from '../../src/kernel/rngContext.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF_REL = 'src/domain/edit/pools.js';
const LEAF_DIR = 'src/domain/edit';
const WIZARD_REL = 'src/components/ConfigurationPanel.jsx';

/** A real generated world: a concrete catalogue tier, which is the only thing a record holds. */
const TOWN = Object.freeze({ tier: 'town' });

/** A line feed, BUILT rather than escaped (the raw-byte pin's stated cure 2). */
const LINE_BREAK = String.fromCharCode(10);

/**
 * A QUOTED module specifier ending in the pool leaf: an IMPORTER, not a prose mention.
 * The quote is what makes it an import site, so a future docblock that names the path
 * cannot red the dormancy arm and a real import cannot escape it.
 */
const POOL_LEAF_SPECIFIER = /['"][^'"]*edit\/pools\.js['"]/;

/** The same shape aimed at a sibling edit leaf that IS imported today, so A6 proves its matcher. */
const TYPES_LEAF_SPECIFIER = /['"][^'"]*edit\/types\.js['"]/;

/** The eleven modules the leaf may import, repo-relative, and nothing else. */
const FENCE = [
  'src/kernel/prng.js',
  'src/domain/deterministicSort.js',
  'src/domain/institutionLookups.js',
  'src/domain/factionArchetypes.js',
  'src/domain/entities/npcs.js',
  'src/domain/entities/status.js',
  'src/domain/worldFactOptions.js',
  'src/data/resourceData.js',
  'src/data/constants.js',
  'src/data/monsterThreat.js',
  'src/data/stressTypes.js',
];

/** Every address the leaf may never reach, by pattern. The plant in A7 proves each fires. */
const FORBIDDEN = [
  /^src\/generators\//,
  /^src\/components\//,
  /^src\/store\//,
  /\.jsx$/,
  /^src\/kernel\/rngContext\.js$/,
  /^src\/data\/namingData\.js$/,
  /^src\/domain\/dossier\/powerStrata\.js$/,
  /^src\/domain\/display\//,
];

/** Why an answer is not a lawful pool answer, or the empty string when it is. */
function faultIn(values) {
  if (!Array.isArray(values)) return 'not an array';
  if (!Object.isFrozen(values)) return 'not frozen';
  if (values.length === 0) return 'empty on a real town world';
  if (values.some((value) => typeof value !== 'string')) return 'holds a non-string';
  if (values.some((value) => value === '')) return 'holds a blank';
  if (new Set(values).size !== values.length) return 'holds a duplicate';
  return '';
}

/** Set equality over two string lists, order-free. */
function sameSet(left, right) {
  const a = new Set(left);
  const b = new Set(right);
  return a.size === b.size && [...a].every((value) => b.has(value));
}

/** Every static import specifier of a module's source text, in source order. */
function importSpecifiers(text) {
  const found = [];
  const pattern = /^\s*import\s[^;]*?from\s*['"]([^'"]+)['"]/gm;
  let hit = pattern.exec(text);
  while (hit !== null) {
    found.push(hit[1]);
    hit = pattern.exec(text);
  }
  return found;
}

/** A specifier as the leaf spells it, resolved to a repo-relative address. */
function addressOf(specifier) {
  return relative(ROOT, resolve(join(ROOT, LEAF_DIR), specifier)).split('\\').join('/');
}

/** The commodity vocabulary as its two source tables hold it, before normalization. */
function commoditySource() {
  return [
    ...Object.keys(RESOURCE_DATA).flatMap((key) => RESOURCE_DATA[key]?.commodities ?? []),
    ...Object.keys(SPECIAL_RESOURCES),
  ];
}

/** The terrain `option` values the wizard renders, read from the component's own source. */
function wizardTerrainValues() {
  const text = readFileSync(join(ROOT, WIZARD_REL), 'utf8');
  const start = text.indexOf('<Lbl topic="terrain">');
  const end = text.indexOf('</Sel>', start);
  const block = text.slice(start, end);
  return [...block.matchAll(/<option value="([^"]+)"/g)].map((hit) => hit[1]);
}

/** Every JavaScript and JSX source file under a directory, with its text. */
function sourceFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (/\.(js|jsx)$/.test(entry)) {
      out.push({ rel: relative(ROOT, full).split('\\').join('/'), text: readFileSync(full, 'utf8') });
    }
  }
  return out;
}

describe('EM-A2a — the pool machinery and the eleven TABLE pools', () => {
  it('A1 every pool answers live, and the totality arm EM-A1 assigned to this packet', () => {
    const ids = Object.keys(POOLS).sort(compareCodepoint);

    // GUARD THE GUARD, BEFORE ANY NEGATIVE: every pool answers a frozen, non-empty,
    // blank-free, duplicate-free list of strings on a real town world, so no later arm
    // can pass on nothing.
    const faults = ids
      .map((id) => [id, faultIn(poolValues(id, TOWN))])
      .filter(([, fault]) => fault !== '');
    expect(faults, 'every pool answers a frozen non-empty duplicate-free string list').toEqual([]);

    expect(poolValues('institution.class', TOWN), 'institution.class IS the tier-gated catalogue')
      .toEqual([...getInstitutionsForTier('town')].sort(compareCodepoint));
    expect(poolValues('institution.class', TOWN).length, 'eighty-five at town, executed').toBe(85);
    expect(poolValues('faction.category', TOWN), 'faction.category IS the archetype table')
      .toEqual([...Object.values(FACTION_ARCHETYPES)].sort(compareCodepoint));
    expect(poolValues('faction.category', TOWN).length, 'thirteen archetypes').toBe(13);
    expect(poolValues('tier', TOWN), 'tier IS the ladder, in the ladder order').toEqual([...TIER_ORDER]);

    const declared = [...new Set(
      Object.values(FIELD_DECLARATIONS).flat().filter((row) => row.pool).map((row) => row.pool),
    )].sort(compareCodepoint);
    expect(declared.length, 'EM-A1 declares eleven pool ids').toBe(11);
    const pending = declared.filter((id) => !ids.includes(id));
    const own = ids.filter((id) => !declared.includes(id));
    expect(ids.filter((id) => declared.includes(id)).length, 'shared is declared minus pending')
      .toBe(declared.length - pending.length);

    // THE TOTALITY ARM, AND THE ONE HUNK A SIBLING RE-SPELLS. EM-A1's declaration walker
    // asserts membership of POOLS nowhere and says so: that half of the arm is this
    // packet's. The three assertions below are deliberately CONTIGUOUS, with the id list
    // beside them, because EM-A2b's landing moves all of them at once (eleven becomes
    // seventeen, the pending residue empties, the own residue grows) and that re-spell
    // must be ONE diff hunk and not four.
    const contractIds = [
      'cause.remove', 'commodity', 'faction.category', 'institution.class',
      'institution.state', 'npc.status', 'tier', 'worldFact.culture',
      'worldFact.monsterThreat', 'worldFact.stressors', 'worldFact.terrain',
    ];
    expect(ids, 'POOLS holds exactly the contract ids, both directions').toEqual(contractIds);
    expect(pending, 'declared but not pooled: EM-A2b owes exactly these three').toEqual(
      ['npc.role', 'power.holder', 'worldFact.resources'],
    );
    expect(own, 'pooled but declared by no field today: this packet owns exactly these three').toEqual(
      ['cause.remove', 'commodity', 'tier'],
    );
  });

  it('A2 absence is the typed value, nothing throws, and the tier gate rests on a real tier', () => {
    const probes = [null, undefined, {}, { tier: 'nonsense' }, { institutions: null }];
    const ids = [...Object.keys(POOLS), 'no.such.pool'];
    const faults = [];
    for (const world of probes) {
      for (const id of ids) {
        let answer;
        try {
          answer = poolValues(id, world);
        } catch (error) {
          faults.push([id, `threw: ${String(error)}`]);
          continue;
        }
        if (!Array.isArray(answer)) faults.push([id, 'not an array']);
        else if (!Object.isFrozen(answer)) faults.push([id, 'not frozen']);
        else if (answer.length === 0 && rollFrom(id, world, 'seed-a', 'entry-1', 0) !== null) {
          faults.push([id, 'an empty pool did not roll null']);
        }
      }
    }
    expect(faults, 'every pool answers a frozen array on every absent world, and an empty pool rolls null')
      .toEqual([]);

    expect(poolValues('institution.class', { tier: 'town' }).length, 'a real tier reads its own catalogue').toBe(85);
    expect(poolValues('institution.class', { tier: 'city' }).length, 'and a second real tier a different one').toBe(81);
    expect(poolValues('institution.class', null).length, 'absence reads this module own village default').toBe(58);
    expect(poolValues('institution.class', undefined).length, 'and so does an absent argument').toBe(58);
    expect(poolValues('institution.class', {}).length, 'and so does a world with no tier at all').toBe(58);
    expect(poolValues('institution.class', { tier: 'nonsense' }), 'a non-catalogue tier string answers empty').toEqual([]);
    expect(poolValues('institution.class', { tier: 'random' }), 'and so do the wizard sentinels, which no stored record carries').toEqual([]);
    expect(poolValues('institution.class', { tier: 'custom' }), 'both of them').toEqual([]);
    expect(poolValues('no.such.pool', TOWN), 'an unknown pool id is the frozen empty array, never a throw').toEqual([]);
    expect(rollFrom('institution.class', { tier: 'nonsense' }, 'seed-a', 'entry-1', 0), 'an empty pool rolls null, never undefined').toBe(null);
  });

  it('A3 source identity, the import scan, wizard parity, and the tier gate proved live', () => {
    const sources = [
      ['institution.class', [...getInstitutionsForTier('town')]],
      ['faction.category', Object.values(FACTION_ARCHETYPES)],
      ['commodity', commoditySource()],
      ['tier', [...TIER_ORDER]],
      ['npc.status', [...NPC_STATUS_VALUES]],
      ['institution.state', [...ENTITY_STATUS_VALUES]],
      ['worldFact.terrain', TERRAIN_WEIGHTS.map(([key]) => key)],
      ['worldFact.culture', [...CULTURES]],
      ['worldFact.monsterThreat', [...MONSTER_THREAT_TIERS]],
      ['worldFact.stressors', Object.keys(STRESS_TYPE_MAP)],
    ];
    expect(sources.length, 'ten catalogue pools, plus the one owner-given literal').toBe(10);
    const drifted = sources.filter(([id, source]) => !sameSet(poolValues(id, TOWN), source)).map(([id]) => id);
    expect(drifted, 'every catalogue pool set-equals its live source, so a forked copy reds here').toEqual([]);
    expect(poolValues('commodity', TOWN).length, 'the flattened commodity vocabulary, de-duplicated').toBe(34);

    const specifiers = importSpecifiers(readFileSync(join(ROOT, LEAF_REL), 'utf8'));
    expect(specifiers.length, 'the import scan really found the leaf imports, so the filters below are live').toBe(11);
    const reached = specifiers.map(addressOf);
    expect(reached.filter((address) => FORBIDDEN.some((pattern) => pattern.test(address))),
      'no generator path, no component, no store, no JSX, no display seam, no ambient RNG').toEqual([]);
    // The plant is JOINED at runtime rather than spelled with an escape: a
    // control-character escape in a file a tool writes is the vector the raw-byte
    // pin exists for, and LINE_BREAK carries no byte through any tool pass.
    const planted = importSpecifiers([
      "import { probe } from '../../generators/probe.js';",
      "import Probe from './probe.jsx';",
      '',
    ].join(LINE_BREAK));
    expect(planted, 'THE MATCHER, PROVED LIVE on a planted pair it must catch')
      .toEqual(['../../generators/probe.js', './probe.jsx']);
    expect(planted.map(addressOf).filter((address) => FORBIDDEN.some((pattern) => pattern.test(address))).length,
      'and both planted addresses are convicted by the fence').toBe(2);

    const wizard = wizardTerrainValues();
    expect(wizard, 'the wizard terrain menu was really read').toContain('auto');
    const offered = wizard.filter((value) => value !== 'auto').sort(compareCodepoint);
    expect(offered.length, 'seven terrains behind the auto sentinel').toBe(7);
    expect(poolValues('worldFact.terrain', TOWN), 'the wizard menu and the generator table agree').toEqual(offered);
    expect(poolValues('worldFact.culture', TOWN), 'culture is the wizard own set at the domain address')
      .toEqual([...CULTURES].sort(compareCodepoint));
    expect(poolValues('worldFact.culture', TOWN).length, 'eleven cultures').toBe(11);
    expect(poolValues('worldFact.monsterThreat', TOWN), 'the three canonical tiers, as a list and never as a length')
      .toEqual(['frontier', 'heartland', 'plagued']);
    expect(poolValues('worldFact.monsterThreat', TOWN), 'and never the generator weighted roll pool, which is a different set')
      .not.toEqual([...MONSTER_THREAT_RANDOM_POOL]);

    const cityClasses = poolValues('institution.class', { tier: 'city' });
    const metroClasses = poolValues('institution.class', { tier: 'metropolis' });
    const gated = Object.values(getInstitutionalCatalog('metropolis'))
      .flatMap((category) => Object.entries(category))
      .filter(([, definition]) => definition && definition.minTier === 'metropolis')
      .map(([name]) => name)
      .sort(compareCodepoint);
    expect(gated.length, 'the catalogue really holds metropolis-gated rows').toBeGreaterThan(0);
    expect(cityClasses.length, 'the city catalogue, executed').toBe(81);
    expect(metroClasses.length, 'the metropolis catalogue, executed').toBe(115);
    expect(metroClasses, 'a metropolis-gated row IS offered at metropolis').toContain(gated[0]);
    expectAbsentWithAnchor(
      cityClasses, gated[0], metroClasses.find((name) => cityClasses.includes(name)), 'the minTier gate at city',
    );
  });

  it('A4 boundary: the codepoint order everywhere, and the one stated exception', () => {
    const unsorted = Object.keys(POOLS)
      .filter((id) => id !== 'tier')
      .filter((id) => {
        const values = poolValues(id, TOWN);
        const sorted = [...values].sort(compareCodepoint);
        return values.some((value, index) => value !== sorted[index]);
      });
    expect(unsorted, 'every pool but tier is in codepoint order').toEqual([]);

    const tiers = poolValues('tier', TOWN);
    const alphabetical = [...tiers].sort(compareCodepoint);
    expect(tiers, 'tier keeps TIER_ORDER verbatim, smallest settlement to largest').toEqual([...TIER_ORDER]);
    expect(tiers, 'and it is deliberately NOT codepoint-sorted, so nobody can quietly fix it')
      .not.toEqual(alphabetical);
    expect(tiers.indexOf('city'), 'city FOLLOWS hamlet here, because size is the meaning')
      .toBeGreaterThan(tiers.indexOf('hamlet'));
    expect(alphabetical.indexOf('city'), 'although it PRECEDES it alphabetically: the exemption, pinned both ways')
      .toBeLessThan(alphabetical.indexOf('hamlet'));
  });

  it('A5 idempotency, the reopen guarantee, and both key segments proved live', () => {
    const thrice = [
      rollFrom('commodity', TOWN, 'seed-a', 'entry-1', 3),
      rollFrom('commodity', TOWN, 'seed-a', 'entry-1', 3),
      rollFrom('commodity', TOWN, 'seed-a', 'entry-1', 3),
    ];
    expect(typeof thrice[0], 'the roll answers a member at all').toBe('string');
    expect(thrice[1], 'the same call answers the same value').toBe(thrice[0]);
    expect(thrice[2], 'and again').toBe(thrice[0]);

    const inOrder = [];
    for (let index = 0; index < 10; index += 1) {
      inOrder.push(rollFrom('commodity', TOWN, 'seed-a', 'entry-1', index));
    }
    expect(inOrder.filter((value) => typeof value !== 'string'), 'ten rolls, every one a member').toEqual([]);
    expect(rollFrom('commodity', TOWN, 'seed-a', 'entry-1', 3),
      'roll three taken ALONE on a fresh call, with zero to two never replayed: the reopen guarantee')
      .toBe(inOrder[3]);

    const ids = Object.keys(POOLS);
    const movedByEntry = ids.filter(
      (id) => rollFrom(id, TOWN, 'seed-a', 'entry-1', 0) !== rollFrom(id, TOWN, 'seed-a', 'entry-2', 0),
    );
    const movedBySeed = ids.filter(
      (id) => rollFrom(id, TOWN, 'seed-a', 'entry-1', 0) !== rollFrom(id, TOWN, 'seed-b', 'entry-1', 0),
    );
    expect(movedByEntry.length, 'the entry segment of the key is live for at least one pool').toBeGreaterThan(0);
    expect(movedBySeed.length, 'and so is the seed segment').toBeGreaterThan(0);
    const strays = ids.filter((id) => !poolValues(id, TOWN).includes(rollFrom(id, TOWN, 'seed-a', 'entry-1', 0)));
    expect(strays, 'and every roll is a member of its own pool').toEqual([]);
  });

  it('A6 the no-draw law, and the golden structural proof', () => {
    const outer = setActiveRng(createPRNG('probe'));
    const firstDraw = random();
    const secondDraw = random();
    clearActiveRng(outer);

    setActiveRng(createPRNG('probe'));
    const firstAgain = random();
    let calls = 0;
    for (const id of Object.keys(POOLS)) {
      for (let index = 0; index < 5; index += 1) {
        rollFrom(id, TOWN, 'seed-a', 'entry-1', index);
        calls += 1;
      }
    }
    const nextAmbient = random();
    clearActiveRng(outer);

    expect(calls, 'fifty-five rolls across the eleven pools').toBe(55);
    expect(firstAgain, 'the ambient stream really re-seeded, so the arm below is not vacuous').toBe(firstDraw);
    expect(nextAmbient, 'and the NEXT ambient draw is still the second one: the world stream did not advance')
      .toBe(secondDraw);
    expect(() => rollFrom('tier', TOWN, 'seed-a', 'entry-1', 0),
      'and with no ambient RNG active at all the roller does not throw').not.toThrow();

    const sources = sourceFiles(join(ROOT, 'src'));
    expect(sources.length, 'the walk really read the source tree').toBeGreaterThan(1000);
    expect(sources.filter(({ text }) => TYPES_LEAF_SPECIFIER.test(text)).length,
      'THE MATCHER, PROVED LIVE: the same shape DOES find a sibling edit leaf that is imported')
      .toBeGreaterThan(0);
    expect(sources.filter(({ text }) => POOL_LEAF_SPECIFIER.test(text)).map(({ rel }) => rel),
      'the leaf lands DARK: nothing under src imports it, so no golden can move').toEqual([]);
  });

  it('A7 the import fence, in both directions', () => {
    const specifiers = importSpecifiers(readFileSync(join(ROOT, LEAF_REL), 'utf8'));
    expect(specifiers.length, 'the scan found imports at all, so the exclusions below are not vacuous').toBe(11);
    const reached = specifiers.map(addressOf).sort(compareCodepoint);
    expect(reached, 'exactly the eleven fenced modules, and not one more').toEqual([...FENCE].sort(compareCodepoint));
    expect(reached.filter((address) => FORBIDDEN.some((pattern) => pattern.test(address))),
      'and not one forbidden address among them').toEqual([]);

    const plant = [
      'src/generators/lookups.js',
      'src/generators/steps/resolveConfig.js',
      'src/generators/npcGenerator.js',
      'src/kernel/rngContext.js',
      'src/data/namingData.js',
      'src/domain/dossier/powerStrata.js',
      'src/domain/display/resourceDisplayName.js',
      'src/components/ConfigurationPanel.jsx',
      'src/store/editSlice.js',
    ];
    expect(plant.filter((address) => FORBIDDEN.some((pattern) => pattern.test(address))),
      'THE FENCE, PROVED LIVE: every banned address is convicted by it').toEqual(plant);
  });

  it('A8 the two state vocabularies are the tree own, read at their homes', () => {
    const statuses = poolValues('npc.status', TOWN);
    const states = poolValues('institution.state', TOWN);

    expect(statuses, 'npc.status IS NPC_STATUS_VALUES, read at src/domain/entities/npcs.js')
      .toEqual([...NPC_STATUS_VALUES].sort(compareCodepoint));
    expect(statuses.length, 'seven members, the tree own union').toBe(7);
    expect(statuses, 'and jailed is a member BY NAME, which the tree gained at 95e494bdb').toContain('jailed');

    expect(states, 'institution.state IS ENTITY_STATUS_VALUES, read at src/domain/entities/status.js')
      .toEqual([...ENTITY_STATUS_VALUES].sort(compareCodepoint));
    expect(states.length, 'five members').toBe(5);
    expect(states, 'destruction is a state the record KEEPS').toContain('destroyed');
    expect(states, 'and removal is its own distinct state, which is design section 15 made structural')
      .toContain('removed');
    expect(new Set(states).size, 'the two are distinct values, not one word spelled twice').toBe(states.length);
    expect(Object.isFrozen(statuses) && Object.isFrozen(states), 'and both answers are frozen').toBe(true);
  });
});
