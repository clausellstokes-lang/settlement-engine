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
import { getInstitutionalCatalog } from '../../src/domain/institutionLookups.js';
import { FACTION_ARCHETYPES } from '../../src/domain/factionArchetypes.js';
import { NPC_STATUS_VALUES } from '../../src/domain/entities/npcs.js';
import { ENTITY_STATUS_VALUES } from '../../src/domain/entities/status.js';
import { TERRAIN_WEIGHTS, CULTURES } from '../../src/domain/worldFactOptions.js';
import { getCompatibleResources } from '../../src/domain/resourceTerrainCompatibility.js';
import { pantheonStandings } from '../../src/domain/display/pantheonDepth.js';
import { RESOURCE_DATA, SPECIAL_RESOURCES } from '../../src/data/resourceData.js';
import { TIER_ORDER } from '../../src/data/constants.js';
import { MONSTER_THREAT_TIERS, MONSTER_THREAT_RANDOM_POOL } from '../../src/data/monsterThreat.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { INSTITUTION_GROUPINGS } from '../../src/data/categoryVocabulary.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { OP_TYPES, makeOp, validateOp } from '../../src/domain/edit/operations.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { setActiveRng, clearActiveRng, random } from '../../src/kernel/rngContext.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF_REL = 'src/domain/edit/pools.js';
const LEAF_DIR = 'src/domain/edit';
const WIZARD_REL = 'src/components/ConfigurationPanel.jsx';

/** A real generated world: a concrete catalogue tier, which is the only thing a record holds. */
const TOWN = Object.freeze({ tier: 'town' });

/**
 * A POPULATED world (EM-A2b). The six appended pools are WORLD-DERIVED: five of them
 * answer the frozen empty list on a record that carries none of their fields, and that
 * emptiness is the contract rather than a fault, so the arms that hold every pool
 * against a real world take this one.
 *
 * EVERY VALUE HERE IS INVENTED. No real table is imported: the name bag, the roster,
 * the faction seats and the pantheon are the ones the CALLER supplies, which is what
 * proves the pools read the passed-in record and never reach behind it.
 */
const RICH_WORLD = Object.freeze({
  ...TOWN,
  culture: 'qhemric',
  namingData: {
    qhemric: {
      settlementPrefixes: ['Zorv', 'Quill'],
      settlementSuffixes: ['march', 'holt'],
      maleNames: ['Vashken'],
      femaleNames: ['Ilrune'],
      surnames: ['Tarrowmere', 'Ysgil'],
    },
  },
  institutions: [{ name: 'The Ninefold Assay', role: 'assayer' }, { name: 'The Quiet Almshouse' }],
  powerStructure: {
    factions: [
      { faction: 'The Ashen Circle' },
      { faction: 'The Bellwright Guild' },
      { faction: 'The Copewardens' },
    ],
  },
  pantheon: { Ilvareth: { seats: 3 }, Zhurun: { seats: 1 } },
  tradeRoute: 'port',
  terrain: 'coastal',
});

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
  'src/domain/resourceTerrainCompatibility.js',
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
      .map((id) => [id, faultIn(poolValues(id, RICH_WORLD))])
      .filter(([, fault]) => fault !== '');
    expect(faults, 'every pool answers a frozen non-empty duplicate-free string list').toEqual([]);

    // ⭐ U81 RE-RECORDED (cure lane D2, 2026-09-23): institution.class is the tier-gated
    // catalogue's CATEGORY AXIS, not its leaves. The field it fills is the institution
    // card's `category` (`institutions[].category`) and the declared writer fills it with
    // the table's second-level key, so the pool read the wrong level: 85 institution NAMES
    // where ten groupings were owed. Same table, same domain address, its keys.
    expect(poolValues('institution.class', TOWN), 'institution.class IS the tier-gated catalogue s category axis')
      .toEqual(Object.keys(getInstitutionalCatalog('town')).sort(compareCodepoint));
    expect(poolValues('institution.class', TOWN).length, 'ten groupings at town, executed').toBe(10);
    expect(poolValues('faction.category', TOWN), 'faction.category IS the archetype table')
      .toEqual([...Object.values(FACTION_ARCHETYPES)].sort(compareCodepoint));
    expect(poolValues('faction.category', TOWN).length, 'thirteen archetypes').toBe(13);
    expect(poolValues('tier', TOWN), 'tier IS the ladder, in the ladder order').toEqual([...TIER_ORDER]);

    const declared = [...new Set(
      Object.values(FIELD_DECLARATIONS).flat().filter((row) => row.pool).map((row) => row.pool),
    )].sort(compareCodepoint);
    // ⭐ EM-F3 MOVES THIS NUMBER BY ONE, BY ADDITION AND NEVER BY DELETION. EM-A1's phantom card
    // declares `tier` — the pool that had a source here and no field asking for it, and the same
    // pool EM-F1's `PHANTOM_TRAIT_POOLS.size` rolls a counterparty's size from. So `declared`
    // gains it and the `own` residue below loses it; no row of POOLS moved, in either direction.
    expect(declared.length, 'EM-A1 declares twelve pool ids').toBe(12);
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
      'cause.remove', 'commodity', 'deity', 'faction.category', 'institution.class',
      'institution.state', 'name.npc', 'name.settlement', 'npc.role', 'npc.status',
      'power.holder', 'tier', 'worldFact.culture', 'worldFact.monsterThreat',
      'worldFact.resources', 'worldFact.stressors', 'worldFact.terrain',
    ];
    expect(ids, 'POOLS holds exactly the contract ids, both directions').toEqual(contractIds);
    expect(pending, 'declared but not pooled: EM-A2b has landed, so the residue is empty').toEqual(
      [],
    );
    expect(own, 'pooled but declared by no field today: the two packets own exactly these five').toEqual(
      ['cause.remove', 'commodity', 'deity', 'name.npc', 'name.settlement'],
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

    // ⭐ U81 RE-RECORDED (cure lane D2): the same three readings on the CATEGORY axis —
    // ten groupings at town, eleven at city (the city table opens `Exotic`), eight at the
    // village default. The tier gate still separates them, which is what these rows pin.
    expect(poolValues('institution.class', { tier: 'town' }).length, 'a real tier reads its own catalogue').toBe(10);
    expect(poolValues('institution.class', { tier: 'city' }).length, 'and a second real tier a different one').toBe(11);
    expect(poolValues('institution.class', null).length, 'absence reads this module own village default').toBe(8);
    expect(poolValues('institution.class', undefined).length, 'and so does an absent argument').toBe(8);
    expect(poolValues('institution.class', {}).length, 'and so does a world with no tier at all').toBe(8);
    expect(poolValues('institution.class', { tier: 'nonsense' }), 'a non-catalogue tier string answers empty').toEqual([]);
    expect(poolValues('institution.class', { tier: 'random' }), 'and so do the wizard sentinels, which no stored record carries').toEqual([]);
    expect(poolValues('institution.class', { tier: 'custom' }), 'both of them').toEqual([]);
    expect(poolValues('no.such.pool', TOWN), 'an unknown pool id is the frozen empty array, never a throw').toEqual([]);
    expect(rollFrom('institution.class', { tier: 'nonsense' }, 'seed-a', 'entry-1', 0), 'an empty pool rolls null, never undefined').toBe(null);
  });

  it('A3 source identity, the import scan, wizard parity, and the tier gate proved live', () => {
    const sources = [
      ['institution.class', Object.keys(getInstitutionalCatalog('town'))],
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
    expect(specifiers.length, 'the import scan really found the leaf imports, so the filters below are live').toBe(12);
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

    // ⭐ U81 RE-RECORDED (cure lane D2), IN TWO HALVES, BECAUSE THE POOL MOVED AXIS AND
    // ONE OF THE TWO GATES IS NO LONGER OBSERVABLE THROUGH IT — said rather than faked.
    //
    // (1) THE TIER LADDER, still proved THROUGH THE POOL: the city table opens a grouping
    // the town table has no entry for, and the thorp table opens half of them. Derived
    // from the pool's own answers, never typed.
    const townClasses = poolValues('institution.class', { tier: 'town' });
    const cityClasses = poolValues('institution.class', { tier: 'city' });
    const cityOnly = cityClasses.filter((grouping) => !townClasses.includes(grouping));
    expect([cityOnly, [poolValues('institution.class', { tier: 'thorp' }).length, townClasses.length, cityClasses.length]],
      'the tier gate on the category axis, executed: a city offers a grouping a town has no'
      + ' entry for at all, and the ladder widens five to ten to eleven')
      .toEqual([['Exotic'], [5, 10, 11]]);

    // (2) THE `minTier` GATE, proved on the READER the pool reads through. It removes
    // ROWS, and no tier of the catalogue loses a whole grouping to it, so the pool's own
    // answers cannot witness it any more. The reader still can, and the pool's values are
    // that reader's keys — so a collapse of the gate still reds one line from here.
    const namesIn = (tier) => Object.values(getInstitutionalCatalog(tier)).flatMap((group) => Object.keys(group));
    const gated = Object.values(getInstitutionalCatalog('metropolis'))
      .flatMap((category) => Object.entries(category))
      .filter(([, definition]) => definition && definition.minTier === 'metropolis')
      .map(([name]) => name)
      .sort(compareCodepoint);
    const cityNames = namesIn('city');
    const metroNames = namesIn('metropolis');
    expect([gated.length > 0, cityNames.length, metroNames.length],
      'the catalogue really holds metropolis-gated rows, and the two tables the gate separates are live')
      .toEqual([true, 81, 115]);
    expect(metroNames, 'a metropolis-gated row IS in the table at metropolis').toContain(gated[0]);
    expectAbsentWithAnchor(
      cityNames, gated[0], metroNames.find((name) => cityNames.includes(name)), 'the minTier gate at city',
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
    const strays = ids.filter((id) => !poolValues(id, RICH_WORLD).includes(rollFrom(id, RICH_WORLD, 'seed-a', 'entry-1', 0)));
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

    expect(calls, 'eighty-five rolls across the seventeen pools').toBe(85);
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
    // ⭐ EM-D0e is the pool leaf's FIRST runtime importer under src/, and ⭐ EM-F3 WIDENS THIS
    // ROSTER IN PLACE, BY ADDITION AND NEVER BY DELETION, with its SECOND: the phantom mint
    // binds `rollFrom` as EM-F1's injected roller and reads `poolValues` to refuse a DM's word
    // that is not on its own list. BOTH are LAZY in the sense this arm measures — the door is
    // mounted only by the edit shell and the mint module is imported only by that same shell,
    // which `src/App.jsx` reaches through one `lazy(() => import(...))` edge — so the leaf still
    // enters no eager closure and no golden can move behind this arm's back.
    expect(sources.filter(({ text }) => POOL_LEAF_SPECIFIER.test(text)).map(({ rel }) => rel).sort(),
      'the pool leaf\'s importers under src are EXACTLY these two, in both directions: EM-D0e\'s'
      + ' editor door and EM-F3\'s phantom mint, both reached only through the edit shell\'s one'
      + ' lazy edge, so no bundle closure gains it and no golden can move')
      .toEqual(['src/components/edit/CardEditorDialog.jsx', 'src/store/phantomMintAction.js']);
  });

  it('A7 the import fence, in both directions', () => {
    const specifiers = importSpecifiers(readFileSync(join(ROOT, LEAF_REL), 'utf8'));
    expect(specifiers.length, 'the scan found imports at all, so the exclusions below are not vacuous').toBe(12);
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

  it('B1 seventeen ids across the two packets, both directions, and every appended pool answers live', () => {
    const ids = Object.keys(POOLS);
    const A2A_ELEVEN = [
      'cause.remove', 'commodity', 'faction.category', 'institution.class', 'institution.state',
      'npc.status', 'tier', 'worldFact.culture', 'worldFact.monsterThreat',
      'worldFact.stressors', 'worldFact.terrain',
    ];
    const A2B_SIX = [
      'deity', 'name.npc', 'name.settlement', 'npc.role', 'power.holder', 'worldFact.resources',
    ];

    // GUARD THE GUARD, POPULATED AND FIRST: every appended pool answers a frozen,
    // non-empty, blank-free, duplicate-free list of strings on a REAL world, so no
    // negative below can pass on nothing. Five of the six answer the empty list on a
    // bare record, and that emptiness is the contract rather than a fault (B2).
    const faults = A2B_SIX
      .map((id) => [id, faultIn(poolValues(id, RICH_WORLD))])
      .filter(([, fault]) => fault !== '');
    expect(faults, 'every appended pool answers a frozen non-empty duplicate-free string list').toEqual([]);

    expect(ids.length, 'seventeen pools once both packets have landed').toBe(17);
    expect([...A2A_ELEVEN, ...A2B_SIX].sort(compareCodepoint),
      'and the two halves really are those seventeen, both directions, with no overlap')
      .toEqual([...ids].sort(compareCodepoint));
    expect(A2A_ELEVEN.filter((id) => !ids.includes(id)),
      'not one of A2a eleven was dropped by this landing').toEqual([]);
    expect(A2B_SIX.filter((id) => !ids.includes(id)),
      'and every one of these six arrived, so a row dropped by either packet reds here').toEqual([]);
  });

  it('B2 absence is the typed value: the world-derived pools answer empty and never throw', () => {
    const A2B_SIX = [
      'deity', 'name.npc', 'name.settlement', 'npc.role', 'power.holder', 'worldFact.resources',
    ];
    // THE POPULATED CONTROL, ASSERTED FIRST.
    const populated = A2B_SIX.filter((id) => poolValues(id, RICH_WORLD).length === 0);
    expect(populated, 'all six answer a non-empty list on a populated world').toEqual([]);

    const probes = [
      null, undefined, {}, TOWN,
      { namingData: null }, { pantheon: null }, { institutions: null }, { powerStructure: null },
      { pantheon: 'not an object' }, { institutions: 'not a roster' },
    ];
    const faults = [];
    for (const world of probes) {
      for (const id of A2B_SIX) {
        let answer;
        try {
          answer = poolValues(id, world);
        } catch (error) {
          faults.push([id, `threw: ${String(error)}`]);
          continue;
        }
        if (!Array.isArray(answer)) faults.push([id, 'not an array']);
        else if (!Object.isFrozen(answer)) faults.push([id, 'not frozen']);
      }
    }
    expect(faults, 'no absent or malformed world throws, and every answer is a frozen array').toEqual([]);

    expect(poolValues('name.settlement', TOWN), 'no namingData: the settlement name pool is empty').toEqual([]);
    expect(poolValues('name.npc', TOWN), 'and so is the npc name pool').toEqual([]);
    expect(poolValues('deity', TOWN), 'no pantheon: the deity pool is empty').toEqual([]);
    expect(poolValues('npc.role', TOWN), 'no institutions: the role pool is empty').toEqual([]);
    expect(poolValues('power.holder', TOWN), 'no power structure: the holder pool is empty').toEqual([]);
  });

  it('B3 the name bag is the one the caller passed in, and the real table is imported nowhere', () => {
    const invented = 'Xolvruq';
    const planted = {
      ...RICH_WORLD,
      namingData: { qhemric: { settlementPrefixes: [invented], settlementSuffixes: ['gate'] } },
    };
    expect(poolValues('name.settlement', planted),
      'the invented prefix reaches the pool, so the read is off the SUPPLIED bag')
      .toEqual([`${invented}gate`]);
    expect(poolValues('name.settlement', { ...RICH_WORLD, namingData: undefined }),
      'and a world carrying no bag answers empty rather than reaching for the real table').toEqual([]);

    const reached = importSpecifiers(readFileSync(join(ROOT, LEAF_REL), 'utf8')).map(addressOf);
    expect(reached.length, 'the scan really found the leaf imports, so the exclusion below is live').toBe(12);
    const banned = (address) => address === 'src/data/namingData.js'
      || address === 'src/generators/npcGenerator.js'
      || /\.jsx$/.test(address);
    expect(reached.filter(banned),
      'the leaf imports neither the name table nor the refuted generator nor any JSX').toEqual([]);
    const control = [
      'src/data/namingData.js', 'src/generators/npcGenerator.js', 'src/components/Probe.jsx',
    ];
    expect(control.filter(banned), 'THE MATCHER, PROVED LIVE on a planted trio it must catch').toEqual(control);
  });

  it('B4 the resource pool IS the engine gate read at its own home, and the gate is the flag', () => {
    const rows = getCompatibleResources('port', 'coastal');
    const gated = rows.filter((row) => row.compatible).map((row) => row.key);
    const ungated = rows.map((row) => row.key);
    const pool = poolValues('worldFact.resources', RICH_WORLD);

    expect(rows.length, 'the catalogue comes back WHOLE and annotated, never pre-filtered').toBe(33);
    expect(gated.length, 'six of those thirty-three are legal at a coastal port').toBe(6);
    expect(pool, 'and the pool set-equals the engine own gated read at its own address')
      .toEqual([...gated].sort(compareCodepoint));

    // THE COUNTERFORCE: an UNFILTERED read of the same call is a different, larger set,
    // so a pool built from the raw catalogue cannot pass this arm.
    expect(ungated.length, 'the unfiltered read is thirty-three at this very route and terrain').toBe(33);
    expect(sameSet(pool, ungated), 'so the ungated catalogue and the gated pool are NOT the same set').toBe(false);

    const labels = rows.map((row) => row.label).filter((label) => typeof label === 'string');
    expect(labels.length, 'the catalogue rows really carry labels, so the exclusion below is live').toBeGreaterThan(0);
    expect(pool.filter((value) => labels.includes(value)),
      'and the pool holds catalogue KEYS, never a display label').toEqual([]);
  });

  it('B5 boundary: the resource gate fires, and an absent route falls back to the road', () => {
    const portCoastal = poolValues('worldFact.resources', { ...RICH_WORLD, tradeRoute: 'port', terrain: 'coastal' });
    const isolatedDesert = poolValues('worldFact.resources', { ...RICH_WORLD, tradeRoute: 'isolated', terrain: 'desert' });
    expect(portCoastal.length, 'six at a coastal port').toBe(6);
    expect(isolatedDesert.length, 'nineteen at an isolated desert').toBe(19);

    const symmetric = [
      ...portCoastal.filter((key) => !isolatedDesert.includes(key)),
      ...isolatedDesert.filter((key) => !portCoastal.includes(key)),
    ];
    expect(symmetric.length,
      'and the two differ by twenty-one keys, so the gate FIRES rather than returning one fixed list').toBe(21);

    const fallback = poolValues('worldFact.resources', TOWN);
    expect(fallback.length, 'an absent route and terrain fall back to the road and still answer sixteen').toBe(16);
    expect(Object.isFrozen(fallback), 'and that answer is frozen like every other').toBe(true);
  });

  it('B6 determinism across the combined set, and the no-draw law over all seventeen pools', () => {
    const A2B_SIX = [
      'deity', 'name.npc', 'name.settlement', 'npc.role', 'power.holder', 'worldFact.resources',
    ];
    const unstable = A2B_SIX.filter(
      (id) => rollFrom(id, RICH_WORLD, 'seed-a', 'entry-1', 3) !== rollFrom(id, RICH_WORLD, 'seed-a', 'entry-1', 3),
    );
    expect(unstable, 'the same call answers the same value for every appended pool').toEqual([]);

    const inOrder = [];
    for (let index = 0; index < 10; index += 1) {
      inOrder.push(rollFrom('name.npc', RICH_WORLD, 'seed-a', 'entry-1', index));
    }
    expect(inOrder.filter((value) => typeof value !== 'string'), 'ten rolls, every one a member').toEqual([]);
    expect(rollFrom('name.npc', RICH_WORLD, 'seed-a', 'entry-1', 3),
      'roll three taken ALONE equals roll three taken in sequence: the reopen guarantee').toBe(inOrder[3]);
    const movedByEntry = A2B_SIX.filter(
      (id) => rollFrom(id, RICH_WORLD, 'seed-a', 'entry-1', 0) !== rollFrom(id, RICH_WORLD, 'seed-a', 'entry-2', 0),
    );
    expect(movedByEntry.length, 'and a different entry id moves at least one of the six').toBeGreaterThan(0);

    const ids = Object.keys(POOLS);
    const outer = setActiveRng(createPRNG('probe-b6'));
    const firstDraw = random();
    const secondDraw = random();
    clearActiveRng(outer);

    setActiveRng(createPRNG('probe-b6'));
    const firstAgain = random();
    const touched = new Set();
    let calls = 0;
    for (let index = 0; index < 50; index += 1) {
      const id = ids[index % ids.length];
      rollFrom(id, RICH_WORLD, 'seed-a', 'entry-1', index);
      touched.add(id);
      calls += 1;
    }
    const nextAmbient = random();
    clearActiveRng(outer);

    expect(calls, 'fifty rolls').toBe(50);
    expect(touched.size, 'spread across all seventeen pools').toBe(17);
    expect(firstAgain, 'the ambient stream really re-seeded, so the arm below is not vacuous').toBe(firstDraw);
    expect(nextAmbient, 'and the NEXT ambient draw is still the second one: no pool took a world draw')
      .toBe(secondDraw);
  });

  it('B7 the deity pool is the world own record, read through no display seam', () => {
    const three = { ...RICH_WORLD, pantheon: { Ilvareth: {}, Qesh: {}, Zhurun: {} } };
    expect(poolValues('deity', three), 'the pool IS the world own pantheon ids')
      .toEqual(['Ilvareth', 'Qesh', 'Zhurun']);
    expect(poolValues('deity', three), 'and it equals the projection own ids after normalization')
      .toEqual([...pantheonStandings(three).map((entry) => entry.id)].sort(compareCodepoint));
    expect(poolValues('deity', { ...RICH_WORLD, pantheon: { Yggrathuun: {} } }),
      'an invented id planted in the SUPPLIED record appears in the pool').toEqual(['Yggrathuun']);
    expect(poolValues('deity', { ...RICH_WORLD, pantheon: 'not an object' }),
      'a non-object pantheon answers empty: the typeof guard, pinned').toEqual([]);
    expect(pantheonStandings({ ...RICH_WORLD, pantheon: 'not an object' }),
      'and so does the projection, which is what makes the two the SAME answer').toEqual([]);
    expect(poolValues('deity', TOWN), 'a world with no pantheon at all answers empty').toEqual([]);

    // THE STRUCTURAL HALF OF THE DOCTRINE. Faith is culture, never theology: the module
    // holds no premade deity vocabulary, and it reaches no seam that could relabel one.
    const leaf = readFileSync(join(ROOT, LEAF_REL), 'utf8');
    const vocabularies = [...leaf.matchAll(/\[\s*'[^']*'(?:\s*,\s*'[^']*')*\s*,?\s*\]/g)].map((hit) => hit[0]);
    expect(vocabularies.length, 'the module really holds a literal vocabulary, so the arm below is live').toBe(1);
    expect(vocabularies[0], 'and the ONE literal vocabulary is the owner five removal causes, not a deity list')
      .toContain('dissolved');
    expect(leaf, 'the deity row reads the record own keys').toContain('Object.keys(world.pantheon)');
    expectAbsentWithAnchor(leaf, 'pantheonStandings', 'Object.keys(world.pantheon)', 'the pantheon projection');

    const reached = importSpecifiers(leaf).map(addressOf);
    const isDisplay = (address) => /^src\/domain\/display\//.test(address);
    expect(reached.filter(isDisplay), 'and the module imports nothing under the display layer').toEqual([]);
    expect(['src/domain/display/pantheonDepth.js'].filter(isDisplay),
      'THE MATCHER, PROVED LIVE on the one address in the estate that projects a pantheon')
      .toEqual(['src/domain/display/pantheonDepth.js']);
  });

  it('U81 institution.class offers the CATEGORY the writer writes, never an institution NAME', () => {
    // THE FIELD THIS POOL FILLS, read from the declaration rather than assumed: the
    // institution card's `category`, whose declared writer is assembleInstitutions and
    // whose record path is `institutions[].category`.
    const declared = FIELD_DECLARATIONS.institution
      .filter((row) => row.pool === 'institution.class')
      .map((row) => [row.field, row.outputKey, row.writer]);
    expect(declared, 'the ANCHOR: exactly one field draws from this pool, and it is a category')
      .toEqual([['category', 'institutions[].category',
        'src/generators/steps/assembleInstitutions.js#assembleInstitutions']]);

    // THE WRITER'S OWN VOCABULARY, at its two lawful homes. assembleInstitutions walks
    // `institutionalCatalog[tier]` and writes each entry's SECOND-LEVEL KEY as its
    // `category`; categoryVocabulary.js is the canonical declaration of that axis, and
    // tests/data/categoryGovernance.test.js holds the catalogue to it. So the set the
    // writer can produce at a tier is the tier table's own keys, and every one of them
    // is a grouping.
    const written = (tier) => Object.keys(institutionalCatalog[tier] || {}).sort(compareCodepoint);
    const strays = TIER_ORDER.flatMap(written)
      .filter((category) => !INSTITUTION_GROUPINGS.includes(category));
    expect(strays, 'the ANCHOR for the join below: every category the writer writes at any'
      + ' tier is a declared grouping, so the two homes agree before the pool is asked')
      .toEqual([]);

    // THE MEMBER. The pool used to read `getInstitutionsForTier` — the tier's institution
    // NAMES — so the DM was offered "Adventurers' charter hall" for a field the writer
    // only ever fills with "Adventuring". Not one of the 85 values it offered at town was
    // a category any writer writes.
    const offered = poolValues('institution.class', TOWN);
    const notACategory = offered.filter((value) => !INSTITUTION_GROUPINGS.includes(value));
    expect([notACategory, offered],
      'every value the pool offers is a declared grouping, and the set IS the writer own'
      + ' table for that tier — read at the tier-gated catalogue, never re-typed')
      .toEqual([[], written('town')]);

    // AND THE OP THE DM WOULD MINT. `validateOp` judges a pool field by its DECLARATION,
    // not by pool membership, so it said `ok` either way — which is exactly why this was
    // silent: the catalogue accepted an op carrying a value the record never holds.
    const minted = makeOp('add-institution',
      { kind: OP_TYPES['add-institution'].target, id: 'Almshouse' },
      { name: 'Almshouse', category: offered[0] });
    expect([validateOp(minted, TOWN).ok, INSTITUTION_GROUPINGS.includes(minted.payload.category)],
      'the op validates AND the category it carries is one the writer writes — the second'
      + ' half is the one the catalogue could not check')
      .toEqual([true, true]);
  });

  it('B8 the seat pool is the faction roster off the record, and nothing else', () => {
    const seated = ['The Ashen Circle', 'The Bellwright Guild', 'The Copewardens'];
    expect(poolValues('power.holder', RICH_WORLD), 'the pool set-equals the roster own faction names, sorted')
      .toEqual([...seated].sort(compareCodepoint));
    expect(poolValues('power.holder', { ...RICH_WORLD, powerStructure: { factions: [{ faction: 'Qelvarren Hold' }] } }),
      'an invented faction planted in the SUPPLIED roster appears in the pool').toEqual(['Qelvarren Hold']);

    const empties = [
      ['no power structure', TOWN],
      ['an empty roster', { ...RICH_WORLD, powerStructure: { factions: [] } }],
      ['a blank faction field', { ...RICH_WORLD, powerStructure: { factions: [{ faction: '  ' }] } }],
    ];
    const faults = [];
    for (const [label, world] of empties) {
      let answer;
      try {
        answer = poolValues('power.holder', world);
      } catch (error) {
        faults.push([label, `threw: ${String(error)}`]);
        continue;
      }
      if (!Object.isFrozen(answer) || answer.length !== 0) faults.push([label, 'not the frozen empty answer']);
    }
    expect(faults, 'every empty case answers the frozen empty list and never throws').toEqual([]);

    // ⚠ ARCH §9 reads "holder pool over factions/npcs" and the record has no NPC half:
    // `governingName` is written only from the faction roster (R5). An npc roster on the
    // same world contributes nothing, and the verdict is recorded here rather than left
    // as an oversight.
    expect(poolValues('power.holder', { ...RICH_WORLD, npcs: [{ name: 'Sorrel Vane', faction: 'Vane House' }] }),
      'an npc roster on the same world contributes no member: the pool is the FACTION roster')
      .toEqual([...seated].sort(compareCodepoint));

    const leaf = readFileSync(join(ROOT, LEAF_REL), 'utf8');
    expect(leaf, 'the holder row walks the faction roster').toContain('powerStructure?.factions');
    expectAbsentWithAnchor(leaf, 'governingName', 'powerStructure?.factions', 'the seated-faction readback');
  });
});
