/**
 * editDeclarations.walker.test.js — EM-A1's DECLARATION WALKER (cases A5, A5b, A6).
 *
 * Three arms, each holding the declaration table against a PRODUCER rather than against
 * a second spelling of itself:
 *   ARM I-2  POOLS   — every `kind: 'pool'` row carries a non-blank, unique pool id and
 *                      no row of any other kind carries one. The id set is PRINTED so
 *                      EM-A2a's own totality arm can be held against it. ⛔ MEMBERSHIP of
 *                      `POOLS` is asserted NOWHERE here: `POOLS` does not exist at this
 *                      base and that half of the arm is EM-A2a's (§11 BLOCK-4).
 *   ARM P    PENCIL  — the marker EM-D1 will mint is found EXACTLY ZERO times under
 *                      `src/components/**`, over a corpus asserted non-empty in the same
 *                      test. A totality over the empty set with a proven denominator: it
 *                      becomes load-bearing the day EM-D1 mints the first pencil, with no
 *                      edit here.
 *   ARM I-4  ROOTS   — three branches; a root row joins `GENERATION_TIER2` on (card,
 *                      outputKey) or carries a `createdBy`; an annotation row is out of
 *                      the population; a world-fact row's field is a `WORLD_FACT_SOURCES`
 *                      key whose Tier-1 pair resolves and holds its record path.
 *   ARM I-3  WRITERS — every `writer` parses as `path#symbol`, the path exists, and the
 *                      symbol is declared in it EXACTLY ONCE by the LANDED resolver.
 *   ARM I-5  MINT    — EM-F3's fourth provenance. A `dm` row declares a field of a
 *                      DM-MINTED ENTITY, so it has no producer in the generation
 *                      register to join against; the producer it DOES have is the mint
 *                      itself, and the join is exact: the card's pooled fields are the
 *                      mint's own trait names, each row's pool id is the pool that trait
 *                      is rolled from, and the free field is the mint's one free
 *                      argument. IMPORTED from `phantoms.js`, never re-typed.
 *
 * ⛔ NOTHING HERE RE-TYPES A PRODUCER'S SET. `GENERATION_TIER1`, `GENERATION_TIER2`,
 * their cardShape strings, `WORLD_FACT_SOURCES`'s keys and `DECL_FORMS` are all IMPORTED.
 * The frozen wave-1 packet id list is NOT here either: it has one home, and it is
 * `tests/domain/editDeclarations.test.js`, with ARM I-1, the arm that owns the question.
 * ARM I-4 takes `createdBy` PRESENCE only.
 *
 * ⭐ EVERY ARM IS A FUNCTION ITS PLANTS RE-ENTER, so a guard-the-guard drives the detector
 * under test rather than a re-implementation of it.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';
import { FIELD_DECLARATIONS } from '../../src/domain/edit/fieldDeclarations.js';
import {
  GENERATION_TIER1,
  GENERATION_TIER2,
  tier1For,
  tier2For,
} from '../../src/domain/generation/generationForkRegistry.js';
import { WORLD_FACT_SOURCES } from '../../src/domain/worldFactOptions.js';
import { PHANTOM_RECORD_KEYS, PHANTOM_TRAIT_POOLS } from '../../src/domain/edit/phantoms.js';
import { POOLS } from '../../src/domain/edit/pools.js';
import { declaredSymbols } from '../helpers/generationForkCensus.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ALL_ROWS = Object.values(FIELD_DECLARATIONS).flat();

/**
 * ⚠ THE PENCIL MARKER, IN ONE PLACE. §11 BLOCK-3 is REPORTED and not blocking: whether
 * the pencil binds by a minted attribute, by file, or by an export EM-D1 adds is the
 * chair's ruling, and nothing waits on it. The arm below is written so that ruling costs
 * exactly one constant: EM-D1 re-points this line and the arm becomes load-bearing.
 */
const PENCIL_MARKER = 'data-edit-pencil';

/**
 * ⭐ EM-B2b's JOIN (judgment 241 ruling 2) — the step a world-fact row's OWN `tier1.step` names,
 * as a repo-relative path. The row is bound to that producer by the register already, so joining
 * `inputKey` against it is a join against a PRODUCER rather than a second spelling of the list.
 */
const stepPathFor = (step) => `src/generators/steps/${step}.js`;

/**
 * ⛔ THE NON-IDENTIFIER LOOKAHEAD IS LOAD-BEARING, AND IT WAS MEASURED RATHER THAN ASSUMED: a bare
 * substring scores `config.terrain` at FIVE, because it is a prefix of BOTH `config.terrainOverride`
 * and `config.terrainType`, so the clause would have passed on the very spelling it exists to
 * refuse. ⚠ `git grep -E` silently ignores `\b`, so this is a JS `RegExp` and never a shelled grep.
 * @param {string} source @param {string} inputKey @returns {number} sites of `config.<inputKey>`
 */
function configReadCount(source, inputKey) {
  return (source.match(new RegExp(`config\\.${inputKey}(?![A-Za-z0-9_$])`, 'g')) ?? []).length;
}

/**
 * ARM I-2 — the pool arm. Returns one message per offending row.
 * @param {readonly import('../../src/domain/edit/types.js').FieldDeclaration[]} rows
 * @returns {string[]}
 */
function poolOffenders(rows) {
  const offenders = [];
  const claimed = new Map();
  for (const row of rows) {
    const at = `${row.card}.${row.field}`;
    const carries = Object.hasOwn(row, 'pool');
    if (row.kind === 'pool') {
      if (!carries || typeof row.pool !== 'string' || row.pool.trim().length === 0) {
        offenders.push(`${at}: a kind 'pool' row carries a non-blank pool id`);
        continue;
      }
      if (claimed.has(row.pool)) offenders.push(`${at}: pool id '${row.pool}' is already claimed by ${claimed.get(row.pool)}`);
      else claimed.set(row.pool, at);
    } else if (carries) {
      offenders.push(`${at}: kind '${row.kind}' carries a pool id ('${row.pool}'), and only a 'pool' row may`);
    }
  }
  return offenders;
}

/**
 * ARM I-4 — the root arm, three branches. Returns one message per offending row, each
 * naming the card, the field, the key it joined on and the branch it took.
 * @param {readonly import('../../src/domain/edit/types.js').FieldDeclaration[]} rows
 * @returns {string[]}
 */
function rootOffenders(rows) {
  const offenders = [];
  for (const row of rows) {
    const at = `${row.card}.${row.field}`;
    // (b) an annotation row is OUT of this arm's population by construction. The §6.2
    // shape law owns "an annotation row carries no outputKey"; asserting it here too is
    // what made version 4's plants red on two arms at once.
    if (row.provenance === 'annotation') continue;
    // (d) ⭐ EM-F3 WIDENS THIS ARM IN PLACE, BY ADDITION AND NEVER BY DELETION. A `dm` row is
    // OUT of this arm's population because the register it joins against is the GENERATION
    // register: a DM-minted entity is by definition a thing generation never made, so there is
    // no Tier-2 row to find and no step to read a config key from. The join a `dm` row owes is
    // ARM I-5's, below, and it is against the MINT rather than against the generator.
    if (row.provenance === 'dm') continue;
    if (row.provenance === 'root') {
      // (a) PRESENCE only: membership of the frozen wave-1 list is ARM I-1's, in the
      // domain file, which is the one home that list has.
      if (Object.hasOwn(row, 'createdBy')) continue;
      if (tier2For(row.card, row.outputKey).length < 1) {
        offenders.push(`${at} [branch a, root]: no GENERATION_TIER2 row joins (cardShape '${row.card}', outputKey '${row.outputKey}') and the row carries no createdBy`);
      }
      continue;
    }
    // (c) world-fact.
    if (!Object.hasOwn(WORLD_FACT_SOURCES, row.field)) {
      offenders.push(`${at} [branch c, world-fact]: '${row.field}' is not a key of WORLD_FACT_SOURCES`);
      continue;
    }
    const pair = row.tier1 ?? { step: '', key: '' };
    const held = tier1For(pair.step, pair.key);
    if (!held) {
      offenders.push(`${at} [branch c, world-fact]: no GENERATION_TIER1 row joins (step '${pair.step}', key '${pair.key}')`);
      continue;
    }
    const want = `record.${row.outputKey}`;
    // Two forms only, and the packet says which row takes which: equality, or a PREFIX,
    // the second solely because GENERATION_BLIND_HALVES' field-rootness row states that
    // Tier 1 classes a (step, key) PAIR and never a field inside the key.
    const exact = held.recordPath === want;
    const prefix = typeof held.recordPath === 'string' && want.startsWith(`${held.recordPath}.`);
    if (!exact && !prefix) {
      offenders.push(`${at} [branch c, world-fact]: Tier-1 pair (${pair.step}, ${pair.key}) holds recordPath '${held.recordPath}', which neither equals nor prefixes '${want}'`);
      continue;
    }
    // ⭐ EM-B2b's inputKey CLAUSE (judgment 241 ruling 2). `outputKey` says where the value LANDS
    // and `tier1` names the ctx key; NEITHER is the key the engine READS, and a `config′` keyed by
    // either moves nothing while echoing the DM's word back onto `record.config` — the estate's
    // cardinal applied-looking-and-absent class. So the row's own declared `inputKey` must be READ
    // as `config.<inputKey>` by the step its own `tier1.step` names.
    const inputKey = row.inputKey;
    if (typeof inputKey !== 'string' || !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(inputKey)) {
      offenders.push(`${at} [branch c, world-fact]: inputKey '${inputKey}' is not a declared identifier-shaped config key`);
      continue;
    }
    const stepPath = stepPathFor(pair.step);
    if (!existsSync(join(ROOT, stepPath))) {
      offenders.push(`${at} [branch c, world-fact]: the step its tier1 names has no source at '${stepPath}'`);
      continue;
    }
    if (configReadCount(readFileSync(join(ROOT, stepPath), 'utf8'), inputKey) === 0) {
      offenders.push(`${at} [branch c, world-fact]: ${stepPath} never reads 'config.${inputKey}', so the declared inputKey is a key the engine reads NOWHERE`);
    }
  }
  return offenders;
}

/**
 * ARM I-3 — the writer arm. Returns one message per offending row.
 * @param {readonly import('../../src/domain/edit/types.js').FieldDeclaration[]} rows
 * @returns {string[]}
 */
function writerOffenders(rows) {
  const offenders = [];
  for (const row of rows) {
    // A row with no `writer` is OUT of this arm's population, by construction: every
    // world-fact row, every annotation row, and the one `createdBy` root row.
    if (!Object.hasOwn(row, 'writer')) continue;
    const at = `${row.card}.${row.field}`;
    const parts = String(row.writer).split('#');
    if (parts.length !== 2 || parts[0].length === 0 || parts[1].length === 0) {
      offenders.push(`${at}: writer '${row.writer}' does not parse as exactly one 'path#symbol' pair`);
      continue;
    }
    const [path, symbol] = parts;
    if (!existsSync(join(ROOT, path))) {
      offenders.push(`${at}: writer path '${path}' does not exist`);
      continue;
    }
    const count = declaredSymbols(readFileSync(join(ROOT, path), 'utf8')).get(symbol) ?? 0;
    if (count !== 1) {
      offenders.push(`${at}: '${symbol}' is declared ${count} times in ${path} (exactly once required)`);
    }
  }
  return offenders;
}

/** Every `.js` / `.jsx` file under a directory, repo-relative. */
function walkSources(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkSources(full, out);
    else if (/\.jsx?$/.test(entry)) out.push(relative(ROOT, full).replace(/\\/g, '/'));
  }
  return out;
}

describe('EM-A1 — the declaration walker: pools, the pencil, the root join and the writers', () => {
  test('A5: every pool row names a unique pool id, no other kind does, and no pencil exists yet', () => {
    // ARM I-2. The population is asserted non-empty before zero offenders means anything.
    const poolRows = ALL_ROWS.filter((row) => row.kind === 'pool');
    expect(poolRows.length, 'no pool row at all, so the pool arm would report zero offenders vacuously').toBe(12);
    expect(poolOffenders(ALL_ROWS)).toEqual([]);

    // PRINTED for EM-A2a's totality arm to be held against. process.stdout.write, not
    // console.log: vitest's default reporter drops a PASSING test's console output, and a
    // report-only arm written that way is silent.
    const ids = poolRows.map((row) => row.pool).sort();
    process.stdout.write(`\nEM-A1 ARM I-2 — the ${ids.length} declared pool ids:\n  ${ids.join('\n  ')}\n`);

    // ARM P. A totality over the empty set WITH a proven non-empty denominator.
    const components = walkSources(join(ROOT, 'src/components'));
    expect(components.length, 'the src/components walk found nothing, so the absence below would be vacuous').toBeGreaterThan(200);
    const pencils = components.filter((rel) => readFileSync(join(ROOT, rel), 'utf8').includes(PENCIL_MARKER));
    expect(
      pencils,
      `a component carries the pencil marker '${PENCIL_MARKER}' while wave 1 is still headless.`
      + ' Every card that grows a pencil must first have a declaration in FIELD_DECLARATIONS,'
      + ' which is the whole contract this arm exists to hold. EM-D1 mints the first one.',
    ).toEqual([]);
  });

  test('A5b: ARM I-4 — every root row joins the register or names its maker, every world fact holds its record path, and four planted rows RED', () => {
    // Step 0: the arm REDS on an empty producer rather than passing vacuously.
    expect(GENERATION_TIER2.length, 'GENERATION_TIER2 is empty, so branch (a) could not convict').toBeGreaterThan(0);
    expect(GENERATION_TIER1.length, 'GENERATION_TIER1 is empty, so branch (c) could not convict').toBeGreaterThan(0);
    expect(Object.keys(WORLD_FACT_SOURCES).length, 'WORLD_FACT_SOURCES is empty, so branch (c) could not convict').toBeGreaterThan(0);

    // The root rows' cards are a SUBSET of the register's own distinct cardShape set, read
    // from the register and never re-typed. The world-fact card is the fifth spelling the
    // register is silent on, which is itself a measurement rather than a preference.
    const registerShapes = new Set(GENERATION_TIER2.map((registerRow) => registerRow.cardShape));
    const rootCards = [...new Set(ALL_ROWS.filter((row) => row.provenance === 'root').map((row) => row.card))];
    expect(rootCards.filter((card) => !registerShapes.has(card))).toEqual([]);
    const worldFactCards = [...new Set(ALL_ROWS.filter((row) => row.provenance === 'world-fact').map((row) => row.card))];
    expect(worldFactCards.filter((card) => registerShapes.has(card))).toEqual([]);
    expect(worldFactCards.length, 'the world-fact rows use one card spelling').toBe(1);

    expect(rootOffenders(ALL_ROWS)).toEqual([]);

    // GUARD-THE-GUARD, four plants, each through the SAME predicate and each reddening on
    // its own branch only.
    const withRow = (extra) => [...ALL_ROWS, Object.freeze(extra)];

    // P1 — a REAL derived reading of the power structure, present on every record.
    expect(rootOffenders(withRow({
      card: 'powerSeat', field: 'stability', kind: 'share', provenance: 'root', label: 'Stability', group: 'standing', outputKey: 'powerStructure.stability', writer: 'src/generators/steps/generatePower.js#generatePower',
    }))).toEqual([
      "powerSeat.stability [branch a, root]: no GENERATION_TIER2 row joins (cardShape 'powerSeat', outputKey 'powerStructure.stability') and the row carries no createdBy",
    ]);

    // P2 — a REAL outputKey on the WRONG card, proving the join takes BOTH halves of the key.
    expect(rootOffenders(withRow({
      card: 'faction', field: 'isGoverning', kind: 'pool', provenance: 'root', label: 'Governing', group: 'standing', outputKey: 'powerStructure.factions[].isGoverning', pool: 'faction.governing', writer: 'src/generators/steps/generatePower.js#generatePower',
    }))).toEqual([
      "faction.isGoverning [branch a, root]: no GENERATION_TIER2 row joins (cardShape 'faction', outputKey 'powerStructure.factions[].isGoverning') and the row carries no createdBy",
    ]);

    // P3 — the charter's own eighth world fact, which WORLD_FACT_SOURCES does not carry.
    expect(rootOffenders(withRow({
      card: 'worldFact', field: 'tradeAccess', kind: 'pool', provenance: 'world-fact', label: 'Trade access', group: 'world', outputKey: 'config.tradeRouteAccess', pool: 'worldFact.tradeAccess', tier1: { step: 'resolveConfig', key: 'effectiveConfig' },
    }))).toEqual([
      "worldFact.tradeAccess [branch c, world-fact]: 'tradeAccess' is not a key of WORLD_FACT_SOURCES",
    ]);

    // P4 — a real world fact whose Tier-1 pair resolves to nothing.
    expect(rootOffenders(withRow({
      card: 'worldFact', field: 'terrain', kind: 'pool', provenance: 'world-fact', label: 'Terrain', group: 'world', outputKey: 'config.terrainType', inputKey: 'terrainOverride', pool: 'worldFact.terrain.planted', tier1: { step: 'resolveConfig', key: 'noSuchCtxKey' },
    }))).toEqual([
      "worldFact.terrain [branch c, world-fact]: no GENERATION_TIER1 row joins (step 'resolveConfig', key 'noSuchCtxKey')",
    ]);

    // ⭐ P8 (EM-B2b, judgment 241 ruling 2) — THE VOCABULARY'S OWN GUARD-THE-GUARD. The row is the
    // LIVE terrain declaration with one word changed: `inputKey: 'terrain'`, the FIELD-name
    // spelling versions 3 and 4 of the packet carried. `resolveConfig` never reads
    // `config.terrain`, so it REDS BY NAME — and it is the plant that proves the non-identifier
    // lookahead is doing work, because a bare substring scores that same spelling at FIVE.
    expect(rootOffenders(withRow({
      card: 'worldFact', field: 'terrain', kind: 'pool', provenance: 'world-fact', label: 'Terrain', group: 'world', outputKey: 'config.terrainType', inputKey: 'terrain', pool: 'worldFact.terrain.planted', tier1: { step: 'resolveConfig', key: 'terrainType' },
    }))).toEqual([
      "worldFact.terrain [branch c, world-fact]: src/generators/steps/resolveConfig.js never reads 'config.terrain', so the declared inputKey is a key the engine reads NOWHERE",
    ]);
  });

  test('A6: ARM I-3 — every writer resolves to exactly one declaration, and three planted rows RED', () => {
    const writerRows = ALL_ROWS.filter((row) => Object.hasOwn(row, 'writer'));
    expect(writerRows.length, 'no row carries a writer, so this arm would report zero offenders vacuously').toBe(9);
    expect(writerOffenders(ALL_ROWS)).toEqual([]);

    // ⭐⭐ THE REGRESSION CONTROL, and the ONE place the SUPERSEDED predicate survives.
    // Every Tier-2 step symbol is declared only by `registerStep('<name>', …)`. The LANDED
    // resolver finds exactly one; version 3's two-form set — "a function declaration or a
    // const arrow" — finds ZERO for the same symbol, which is why a resolver without the
    // registerStep form would have reported every writer in this table as undeclared.
    const stepPath = 'src/generators/steps/assembleInstitutions.js';
    const stepSource = readFileSync(join(ROOT, stepPath), 'utf8');
    expect(declaredSymbols(stepSource).get('assembleInstitutions')).toBe(1);
    const supersededForms = [
      /^[ \t]*(?:export[ \t]+)?(?:async[ \t]+)?function[ \t]+([A-Za-z_$][\w$]*)/gm,
      /^[ \t]*(?:export[ \t]+)?const[ \t]+([A-Za-z_$][\w$]*)[ \t]*=[ \t]*(?:async[ \t]*)?\(/gm,
    ];
    const supersededHits = supersededForms.flatMap((form) => [...stepSource.matchAll(form)])
      .filter((hit) => hit[1] === 'assembleInstitutions');
    expect(supersededHits).toEqual([]);

    // GUARD-THE-GUARD, three plants, each through the SAME predicate.
    const replacing = (card, field, writer) => ALL_ROWS.map((row) => (row.card === card && row.field === field
      ? Object.freeze({ ...row, writer })
      : row));

    // P5 — a symbol that module declares zero times.
    expect(writerOffenders(replacing('npc', 'role', 'src/generators/steps/generatePopulation.js#noSuchChooser'))).toEqual([
      "npc.role: 'noSuchChooser' is declared 0 times in src/generators/steps/generatePopulation.js (exactly once required)",
    ]);

    // P6 — a path that does not exist.
    expect(writerOffenders(replacing('npc', 'role', 'src/generators/steps/noSuchStep.js#generatePopulation'))).toEqual([
      "npc.role: writer path 'src/generators/steps/noSuchStep.js' does not exist",
    ]);

    // P7 — version 3's spelling, on the LIVE npc.status row: a packet id is not a path.
    expect(writerOffenders(replacing('npc', 'status', 'EM-B1a#set-npc-status'))).toEqual([
      "npc.status: writer path 'EM-B1a' does not exist",
    ]);
  });

  test('A9: ARM I-5 — EM-F3\'s dm card joins THE MINT: its pooled fields are the mint\'s own traits, and two planted rows RED', () => {
    // Step 0: both producers are non-empty, or every equality below would be vacuous.
    const dmRows = ALL_ROWS.filter((row) => row.provenance === 'dm');
    expect(dmRows.length, 'no dm row at all, so this arm would be vacuous').toBe(2);
    expect(Object.keys(PHANTOM_TRAIT_POOLS).length, 'the mint rolls no trait, so the join below is vacuous').toBe(3);

    // (i) THE CARD IS ONE. A `dm` row's card is the phantom's, and no other card carries one:
    // the fourth provenance is not a licence to file a record field under it.
    expect([...new Set(dmRows.map((row) => row.card))], 'the dm rows use one card spelling').toEqual(['phantom']);

    // (ii) THE POOLED FIELDS ARE A SUBSET OF THE MINT'S OWN TRAIT NAMES, and each one's pool id
    // is EXACTLY the pool that trait is rolled from. A trait the card does not offer is lawful
    // (the seed rolls it); a pooled field the mint does not roll is not.
    const traits = Object.keys(PHANTOM_TRAIT_POOLS);
    const pooled = dmRows.filter((row) => row.kind === 'pool');
    expect(pooled.map((row) => row.field).filter((field) => !traits.includes(field)),
      'a pooled dm field the mint rolls no trait for would be a control that writes nowhere').toEqual([]);
    expect(pooled.map((row) => `${row.field}=${row.pool}`),
      'and each pooled field names the pool ITS OWN trait is rolled from, read off the mint')
      .toEqual(pooled.map((row) => `${row.field}=${PHANTOM_TRAIT_POOLS[row.field]}`));
    expect(pooled.map((row) => Object.hasOwn(POOLS, row.pool)),
      'every one of those pool ids is a live row of the pool table').toEqual(pooled.map(() => true));

    // (iii) THE FREE FIELD IS THE MINT'S OWN FREE ARGUMENT, joined to the record's key list.
    const free = dmRows.filter((row) => row.kind === 'free');
    expect(free.map((row) => row.field), 'the card offers exactly the one free field the mint takes')
      .toEqual(['name']);
    expect(free.map((row) => PHANTOM_RECORD_KEYS.includes(row.field)),
      'and that field IS a key of the minted record').toEqual(free.map(() => true));

    // GUARD-THE-GUARD, through the SAME two equalities: a pooled field the mint rolls nothing
    // for, and a real trait pointed at the wrong pool, each convicted on its own clause.
    const planted = [...pooled, { card: 'phantom', field: 'stance', kind: 'pool', pool: 'tier' }];
    expect(planted.map((row) => row.field).filter((field) => !traits.includes(field)),
      'a field the mint rolls no trait for must convict').toEqual(['stance']);
    const crossed = pooled.map((row) => ({ ...row, pool: 'commodity' }));
    expect(crossed.map((row) => `${row.field}=${row.pool}`))
      .not.toEqual(crossed.map((row) => `${row.field}=${PHANTOM_TRAIT_POOLS[row.field]}`));
  });

  test('A8: EM-B2b — every world fact\'s inputKey is READ by the step its own tier1 names, the three superseded spellings are refused, and the lookahead is load-bearing', () => {
    // Step 0: the population is asserted before zero offenders means anything, and the producer
    // sets are IMPORTED above rather than re-typed here.
    const worldFactRows = ALL_ROWS.filter((row) => row.provenance === 'world-fact');
    expect(worldFactRows.length, 'no world-fact row at all, so this arm would be vacuous').toBe(5);
    expect(Object.keys(WORLD_FACT_SOURCES).length, 'WORLD_FACT_SOURCES is empty, so the rows below join nothing').toBeGreaterThan(0);

    // THE JOIN, ROW BY ROW AND MEASURED: the step each row's OWN tier1 names must read
    // `config.<inputKey>` at least once. The counts are asserted as a set of positives rather
    // than pinned to exact numbers, because a step gaining or losing one read of its own config
    // key is not this table's business — the key being read NOWHERE is.
    const measured = worldFactRows.map((row) => {
      const stepPath = stepPathFor(row.tier1.step);
      expect(existsSync(join(ROOT, stepPath)), `${row.card}.${row.field}: the step its tier1 names must have a source`).toBe(true);
      return {
        at: `${row.card}.${row.field}`,
        sites: configReadCount(readFileSync(join(ROOT, stepPath), 'utf8'), row.inputKey),
      };
    });
    expect(
      measured.filter((probe) => probe.sites === 0),
      'a declared inputKey the engine reads NOWHERE is the estate\'s applied-looking-and-absent'
      + ' class: the DM\'s word is echoed back onto record.config while the fact she edited never'
      + ' moves. Every world fact\'s input key is joined to its producing step, measured.',
    ).toEqual([]);

    // ⛔ THE NEGATIVE CONTROL, BOTH DIRECTIONS. The three FIELD-name spellings versions 3 and 4 of
    // EM-B2b carried score ZERO on the same clause, so it CONVICTS the old vocabulary rather than
    // passing vacuously over it. Read through the same counter the live arm runs.
    const superseded = [['resolveConfig', 'terrain'], ['resolveStress', 'stressors'], ['resolveResources', 'resources']];
    expect(
      superseded.map(([step, wrong]) => `${wrong}=${configReadCount(readFileSync(join(ROOT, stepPathFor(step)), 'utf8'), wrong)}`),
      'the superseded FIELD-name spellings must all score zero, or the clause proves nothing',
    ).toEqual(['terrain=0', 'stressors=0', 'resources=0']);

    // ⛔ THE LOOKAHEAD IS LOAD-BEARING, MEASURED AND NOT ASSUMED. `config.terrain` is a PREFIX of
    // both `config.terrainOverride` and `config.terrainType`, so a bare substring scores it at
    // FIVE in the very step that reads it nowhere — the clause would have passed on the exact
    // spelling it exists to refuse.
    const resolveConfigSource = readFileSync(join(ROOT, stepPathFor('resolveConfig')), 'utf8');
    const bareSubstring = (resolveConfigSource.match(/config\.terrain/g) ?? []).length;
    expect(bareSubstring, 'a bare substring join scores the refused spelling as a PASS').toBe(5);
    expect(configReadCount(resolveConfigSource, 'terrain'), 'the lookahead scores the same spelling ZERO').toBe(0);
    expect(configReadCount(resolveConfigSource, 'terrainOverride'), 'and it still finds the real key').toBe(5);
  });
});
