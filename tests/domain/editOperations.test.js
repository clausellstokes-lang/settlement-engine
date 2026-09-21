/**
 * editOperations.test.js — EM-B1a's acceptance battery, A1 to A8.
 *
 * ONE literal `describe`, EIGHT straight-line `it`, no `.each`, no `runIf`, no nesting
 * (EM-PREAMBLE §P3.4). Every table arm reports a FULL offender list rather than the first
 * failure, and every negative carries its `// anchored:` reason on the line above it.
 *
 * ⛔ THE REPO ROOT IS DERIVED FROM `import.meta.url`, NEVER FROM `process.cwd()`. A harness
 * that imports this file from another directory would otherwise measure the MAIN CHECKOUT
 * and print a silent false zero, which bit two pre-proof lanes on 2026-09-21 (TOOL-31).
 *
 * ⛔ THIS FILE DOES NOT RE-PARSE THE `NpcStatus` TYPEDEF AND SPELLS NO SCREAMING_SNAKE LIST
 * OF ITS MEMBERS. A7 asserts the pool BY REFERENCE against `NPC_STATUS_VALUES` and delegates
 * the typedef-to-value pin, by name, to EM-P4's `tests/domain/statusVocabularies.test.js`.
 * A hand-spelled vocabulary of those words is what emptied `statusUnionTotality`'s derived
 * trigger at version 8, and the cure is to read the union's own value-level home instead.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { commentsOnly } from '../helpers/codeOnlySource.js';
import { compareCodepoint } from '../../src/domain/deterministicSort.js';
import { NPC_STATUS_VALUES } from '../../src/domain/entities/npcs.js';
import {
  STATUS_ACTIVE, STATUS_DESTROYED, STATUS_IMPAIRED, STATUS_REMOVED, STATUS_VACANT,
} from '../../src/domain/entities/status.js';
import { FACTION_RENAME_SURFACES } from '../../src/domain/factionRename.js';
import { COUP_STRESSOR_TYPE } from '../../src/domain/worldPulse/coup.js';
import { PRIMARY_RELATIONSHIP_TYPES } from '../../src/domain/worldPulse/relationshipCompatibility.js';
import {
  OP_CONSEQUENCE_POLICIES, OP_STAGES, OP_TYPES, makeOp, validateOp,
} from '../../src/domain/edit/operations.js';
import { WORLD_CONDITIONS } from '../../src/domain/edit/worldConditions.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const OPERATIONS_REL = 'src/domain/edit/operations.js';
const CONDITIONS_REL = 'src/domain/edit/worldConditions.js';
const sourceOf = (rel) => readFileSync(join(ROOT, rel), 'utf8');
/** The module's CODE, with every comment blanked by the estate's one shared strip. */
const codeOf = (rel) => commentsOnly(sourceOf(rel));

/** ⭐ §6's ONE LIST. Every other roster claim in this file names THIS constant. */
const THE_FOURTEEN = [
  'add-faction', 'add-institution', 'add-npc', 'found-phantom', 'promote-phantom',
  'rebalance-power', 'remove-faction', 'remove-institution', 'remove-npc', 'set-field',
  'set-institution-state', 'set-npc-status', 'set-power-holder', 'set-relationship',
];

/** The five the chair's ruling R8 moved to EM-B1c, plus the struck one. */
const B1C_FIVE = [
  'rename-faction', 'rename-npc', 'rename-settlement', 'schedule-event', 'set-world-fact',
];
const STRUCK = 'set-state';

/** The eleven keys of §6's `OpTypeDeclaration`. EM-A1's `Op` carries ten; they differ. */
const ROW_KEYS = [
  'conflictsWith', 'consequence', 'duration', 'enables', 'guards', 'guardsStated',
  'payload', 'relatedTo', 'requires', 'stage', 'target',
];

const THE_TEN_CONDITIONS = [
  'beliefExists', 'envoyArrived', 'forceInField', 'npcPresent', 'openRoute',
  'pendingPeaceOffer', 'plotInMotion', 'siegeInProgress', 'tradeWith', 'warInProgress',
];
const ABSENT_CONDITIONS = ['envoyArrived', 'pendingPeaceOffer'];

const GOOD_TARGET = Object.freeze({ kind: 'institution', id: 'i1' });
const campaign = (worldState, regionalGraph) => ({ worldState, regionalGraph });
const SUBJECT = Object.freeze({ id: 'me' });

/** Every `.js` / `.jsx` file under a directory, repo-relative. */
function walkSources(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkSources(full, out);
    else if (/\.jsx?$/.test(entry)) out.push(relative(ROOT, full).replace(/\\/g, '/'));
  }
  return out;
}

/**
 * The relative specifiers a module imports, resolved to repo-relative paths, read from
 * CODE rather than raw bytes so a JSDoc `@typedef {import('...')}` is not counted: a
 * type reference enters no bundle closure, which is the whole of the +0 B claim.
 */
function importsOf(rel, code) {
  const out = [];
  for (const match of code.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)) {
    const specifier = match[1];
    if (!specifier.startsWith('.')) continue;
    out.push(relative(ROOT, resolve(dirname(join(ROOT, rel)), specifier)).replace(/\\/g, '/'));
  }
  return out;
}

/** Does this code WRITE the named field: `name:` or `name =`. Proved live in A3. */
const writesField = (code, name) => new RegExp(`\\b${name}\\s*[:=]`).test(code);

/** Is `symbol` a real export of the module at `rel`. Proved live in A2. */
const exportsSymbol = (rel, symbol) => new RegExp(
  `export\\s+(?:const|let|var|function|class)\\s+${symbol}\\b`,
).test(sourceOf(rel));

describe('EM-B1a — the op vocabulary, the fourteen home ops, and the world half of requires', () => {
  it('A1: OP_TYPES is exactly the fourteen home types, every row carries all eleven fields', () => {
    // GUARD-THE-GUARD, FIRST: the positive control. If the catalogue did not load, or loaded
    // empty, every set-equality below would pass vacuously against an empty offender list.
    expect(Object.keys(OP_TYPES).length, 'the catalogue loaded nothing, so every roster claim'
      + ' below would be vacuous').toBe(14);
    expect(THE_FOURTEEN.length, 'the expectation list itself is the fourteen').toBe(14);

    const live = Object.keys(OP_TYPES);
    const undeclared = live.filter((t) => !THE_FOURTEEN.includes(t));
    const missing = THE_FOURTEEN.filter((t) => !live.includes(t));
    expect({ undeclared, missing }, 'OP_TYPES and the ruling R8 roster must be SET-EQUAL in both'
      + ' directions; these are the full offender lists').toEqual({ undeclared: [], missing: [] });

    expect(live, 'Object.keys(OP_TYPES) is authored in compareCodepoint order, so a new row'
      + ' cannot be appended wherever').toEqual([...live].sort(compareCodepoint));
    expect(live, 'and that order is the one §6 spells').toEqual(THE_FOURTEEN);

    const rowProblems = [];
    for (const [type, row] of Object.entries(OP_TYPES)) {
      const keys = Object.keys(row).sort(compareCodepoint);
      if (keys.join(',') !== ROW_KEYS.join(',')) rowProblems.push(`${type}: keys ${keys.join('+')}`);
      if (typeof row.target !== 'string' || !row.target) rowProblems.push(`${type}: target`);
      if (!row.payload || typeof row.payload !== 'object') rowProblems.push(`${type}: payload`);
      if (!OP_STAGES.includes(row.stage)) rowProblems.push(`${type}: stage`);
      if (!OP_CONSEQUENCE_POLICIES.includes(row.consequence)) rowProblems.push(`${type}: consequence`);
      if (!Array.isArray(row.requires.world) || !Array.isArray(row.requires.registry)) {
        rowProblems.push(`${type}: requires is not the { world, registry } split`);
      }
      for (const relation of ['enables', 'relatedTo', 'conflictsWith']) {
        if (!Array.isArray(row[relation])) rowProblems.push(`${type}: ${relation}`);
      }
      if (row.duration !== null && !Number.isFinite(row.duration)) rowProblems.push(`${type}: duration`);
      if (!Array.isArray(row.guards)) rowProblems.push(`${type}: guards`);
      if (typeof row.guardsStated !== 'string' || row.guardsStated.length === 0) {
        rowProblems.push(`${type}: guardsStated is empty, and empty coverage still owes a statement`);
      }
    }
    expect(rowProblems, 'every field is REQUIRED on every row: none optional, none omitted when'
      + ' empty. An empty relation is [], an absent duration is null, and empty guard coverage is'
      + ' guards: [] PLUS a non-empty guardsStated').toEqual([]);

    const struckWhy = `${STRUCK} is STRUCK (ruling 2; design §14 makes system states derived),`
      + ' so restoring it must red here';
    // anchored: the fourteen are asserted set-equal two assertions above, so this cannot go vacuous.
    expect(live, struckWhy).not.toContain(STRUCK);
    const reabsorbed = B1C_FIVE.filter((t) => live.includes(t));
    expect(reabsorbed, 'EM-B1c\'s five are absent BY NAME, so the split cannot be quietly'
      + ' re-absorbed; B1c\'s landing reds here until this arm is widened deliberately')
      .toEqual([]);

    const op = makeOp('set-field', GOOD_TARGET, { field: 'name', value: 'Aldermoor' });
    expect(op && op.type, 'makeOp builds one op from a declared type').toBe('set-field');
    expect(op.stage, 'and copies the declared stage').toBe(OP_TYPES['set-field'].stage);
    expect(op.consequence, 'and the declared consequence').toBe(OP_TYPES['set-field'].consequence);
    expect(op.relatedTo, 'and the declared relations').toEqual(OP_TYPES['set-field'].relatedTo);
  });

  it('A2: absence and malformed input never throw, and the world conditions are scoped and staged', () => {
    const malformed = [
      ['unknown type', 'no-such-op', GOOD_TARGET],
      ['null target', 'set-field', null],
      ['nonsense kind', 'set-field', { kind: 'nonsense', id: 'i1' }],
      ['a string op type', 42, GOOD_TARGET],
      ['undefined type', undefined, GOOD_TARGET],
      ['an id-less target', 'set-field', { kind: 'institution' }],
    ];
    const notNull = [];
    for (const [label, type, target] of malformed) {
      if (makeOp(type, target, {}) !== null) notNull.push(label);
    }
    expect(notNull, 'makeOp returns null for every malformed input and never a partial op')
      .toEqual([]);
    expect(makeOp('set-field', GOOD_TARGET, {}), 'the positive control: a well-formed call still'
      + ' builds, so the nulls above measure refusal rather than a dead constructor').not.toBeNull();

    expect(validateOp(null, {}), 'validateOp(null) answers the exact frozen string')
      .toEqual({ ok: false, errors: ['op is absent'] });
    const threw = [];
    for (const [label, op] of [['a string', 'set-field'], ['undefined', undefined],
      ['a number', 7], ['an array', []], ['a bare object', {}]]) {
      try { validateOp(op, {}); } catch { threw.push(label); }
    }
    expect(threw, 'validateOp is TOTAL: it reports on every input and throws on none').toEqual([]);

    const missingField = validateOp({ type: 'add-npc', target: { kind: 'npc', id: 'n1' }, payload: { name: 'x' } }, {});
    expect(missingField.errors, 'an omitted required field names that field')
      .toContain('payload.role is required');
    const badEnum = validateOp({
      type: 'set-npc-status', target: { kind: 'npc', id: 'n1' }, payload: { status: 'nonsense' },
    }, {});
    expect(badEnum.errors, 'an enum value outside spec.values names that field')
      .toContain('payload.status is not one of the declared values');
    const undeclaredKey = validateOp({
      type: 'add-npc', target: { kind: 'npc', id: 'n1' }, payload: { name: 'x', role: 'y', bogus: 1 },
    }, {});
    expect(undeclaredKey.errors, 'an undeclared payload key names itself and its op type')
      .toContain('payload.bogus is not declared for add-npc');

    // ── THE ROSTER IS TEN AND THE ABSENT SET IS TWO, BY NAME ───────────────────────────
    const ids = Object.keys(WORLD_CONDITIONS);
    expect(ids.length, 'ten ids; openRoute is ONE id answered by TWO readers, not two ids').toBe(10);
    expect({
      undeclared: ids.filter((i) => !THE_TEN_CONDITIONS.includes(i)),
      missing: THE_TEN_CONDITIONS.filter((i) => !ids.includes(i)),
    }, 'the roster is set-equal to §16.1 in both directions').toEqual({ undeclared: [], missing: [] });
    const absent = ids.filter((i) => WORLD_CONDITIONS[i].source === 'EM-E4').sort(compareCodepoint);
    expect(absent, 'exactly two rows are honestly absent, and openRoute and plotInMotion are'
      + ' asserted OUT of that set by name: design §19 ruling 6 made structural').toEqual(ABSENT_CONDITIONS);
    // anchored: `absent` is asserted exactly equal to the two ids above, so this is never vacuous.
    expect(absent, 'openRoute is LIVE, not an EM-E4 gap').not.toContain('openRoute');
    // anchored: the same exact set-equality two assertions above anchors this negative too.
    expect(absent, 'plotInMotion is LIVE, not an EM-E4 gap').not.toContain('plotInMotion');

    // ── EVERY LIVE ROW DECLARES A READER; EVERY ABSENT ROW DECLARES NONE ───────────────
    const readerProblems = [];
    for (const id of ids) {
      const row = WORLD_CONDITIONS[id];
      if (row.source === 'EM-E4') {
        if (row.readers.length !== 0) readerProblems.push(`${id}: an absent row declares readers`);
        if (row.predicate(SUBJECT, campaign({}))) readerProblems.push(`${id}: an absent row answered true`);
        continue;
      }
      if (row.readers.length < 1) readerProblems.push(`${id}: a live row declares no reader`);
      for (const reader of row.readers) {
        if (!exportsSymbol(reader.module, reader.symbol)) {
          readerProblems.push(`${id}: ${reader.module} does not export ${reader.symbol}`);
        }
      }
    }
    expect(readerProblems, 'a reader renamed or deleted upstream must RED here rather than'
      + ' returning a silent false that reads as "the world does not offer this seal"').toEqual([]);
    expect(exportsSymbol(CONDITIONS_REL, 'WORLD_CONDITIONS'), 'the export matcher is proved live'
      + ' on a symbol that IS exported, or every row above passed vacuously').toBe(true);
    expect(exportsSymbol(CONDITIONS_REL, 'noSuchExport'), 'and proved to refuse one that is not')
      .toBe(false);

    // ── THE GATED READER IS DARK BY DEFAULT, AND THE SEAL NAMES WHICH ──────────────────
    const channelWorld = campaign({}, {
      channels: [{ from: 'me', to: 'x', type: 'trade_route', status: 'confirmed', visibility: 'public' }],
    });
    const network = (grade) => ({
      spatialLedgers: { routeNetwork: { edges: { e1: { a: 'me', b: 'x', grade, mode: 'land', charter: {}, provenance: 'generated' } } } },
    });
    const lit = (world) => ({ ...world, simulationRules: { routeLifecycleEnabled: true } });
    const { openRoute } = WORLD_CONDITIONS;
    const naming = (state) => openRoute.readers
      .filter((r) => r.gate === null || r.gate(state)).map((r) => r.id);

    expect(openRoute.predicate(SUBJECT, channelWorld), 'a confirmed trade_route channel from this'
      + ' settlement answers from the regional-channel reader alone').toBe(true);
    expect(naming(channelWorld), 'and the seal names only the ungated reader').toEqual(['regional-channel']);
    const darkNetwork = campaign(network('road'));
    expect(openRoute.predicate(SUBJECT, darkNetwork), 'routeLifecycleEnabled has no entry in'
      + ' DEFAULT_SIMULATION_RULES, so the route-network reader is DARK and its edge cannot answer')
      .toBe(false);
    expect(naming(darkNetwork), 'and the seal names no gated reader in a world without the flag')
      .toEqual(['regional-channel']);
    const litNetwork = campaign(lit(network('road')));
    expect(openRoute.predicate(SUBJECT, litNetwork), 'with the flag planted true AND an edge on'
      + ' one of my endpoints, the gated reader answers').toBe(true);
    expect(naming(litNetwork), 'and the seal names BOTH readers').toEqual(['regional-channel', 'route-network']);

    // ── THE SCOPING LAW, MADE EXECUTABLE (the chair's ruling R9) ───────────────────────
    // Per live row: the NEIGHBOUR'S world does not offer my seal, a FINISHED process does
    // not offer its seal, and each is paired with its positive control, because an arm that
    // only ever asserts false passes on a predicate broken to always-false.
    const beliefs = (owner) => campaign({ spatialLedgers: { beliefMaps: { [owner]: { axes: 1 } } } });
    const deployed = (home) => campaign({ deployments: { [home]: { targetId: 'x' } } });
    const besieged = (target) => campaign({ deployments: { attacker: { targetId: target } } });
    const traded = (from, key) => campaign(
      { relationshipStates: { [key]: { relationshipType: 'trade_partner' } } },
      { edges: [{ from, to: 'x', id: key }], channels: [] },
    );
    // The graph always connects me to x, so the NEIGHBOUR case below asks about a real
    // counterparty of mine and its `false` measures scoping rather than an empty sweep.
    const warring = (from, to) => campaign({}, {
      edges: [{ from: 'me', to: 'x', id: 'edge-1' }],
      channels: [{ from, to, type: 'war_front', status: 'confirmed', visibility: 'public' }],
    });
    const coup = (stage, ids) => campaign({
      stressors: [{ type: COUP_STRESSOR_TYPE, lifecycleStage: stage, affectedSettlementIds: ids }],
    });
    const peopled = (status) => ({ id: 'me', npcs: [{ name: 'n', status }] });

    const scoping = [];
    const check = (label, id, record, state, expected) => {
      if (WORLD_CONDITIONS[id].predicate(record, state) !== expected) {
        scoping.push(`${id} ${label}: expected ${expected}`);
      }
    };
    check('POSITIVE my own belief map', 'beliefExists', SUBJECT, beliefs('me'), true);
    check('NEIGHBOUR a map belonging to another observer', 'beliefExists', SUBJECT, beliefs('other'), false);
    check('POSITIVE my own deployment', 'forceInField', SUBJECT, deployed('me'), true);
    check('NEIGHBOUR a deployment keyed to another town', 'forceInField', SUBJECT, deployed('other'), false);
    check('POSITIVE a present person', 'npcPresent', peopled(STATUS_ACTIVE), campaign({}), true);
    check('POSITIVE a person stored without the key', 'npcPresent', { id: 'me', npcs: [{ name: 'n' }] }, campaign({}), true);
    check('STAGE nobody present', 'npcPresent', peopled('dead'), campaign({}), false);
    check('POSITIVE a channel from me', 'openRoute', SUBJECT, channelWorld, true);
    check('NEIGHBOUR a confirmed trade_route from somewhere else', 'openRoute', SUBJECT,
      campaign({}, { channels: [{ from: 'other', to: 'x', type: 'trade_route', status: 'confirmed', visibility: 'public' }] }), false);
    check('STAGE an overgrown remnant at grade hidden', 'openRoute', SUBJECT, campaign(lit(network('hidden'))), false);
    check('POSITIVE a live coup on me', 'plotInMotion', SUBJECT, coup('active', ['me']), true);
    check('NEIGHBOUR a coup on town B', 'plotInMotion', SUBJECT, coup('active', ['other']), false);
    check('STAGE a coup already resolved', 'plotInMotion', SUBJECT, coup('resolved', ['me']), false);
    check('POSITIVE a siege whose target is me', 'siegeInProgress', SUBJECT, besieged('me'), true);
    check('NEIGHBOUR a siege whose target and coalition exclude me', 'siegeInProgress', SUBJECT, besieged('other'), false);
    check('POSITIVE a trade edge on my own pair', 'tradeWith', SUBJECT, traded('me', 'edge-1'), true);
    check('NEIGHBOUR a trade edge between two others', 'tradeWith', SUBJECT, traded('a', 'edge-2'), false);
    check('POSITIVE a war front on my own pair', 'warInProgress', SUBJECT, warring('me', 'x'), true);
    check('NEIGHBOUR a war between two neighbours', 'warInProgress', SUBJECT, warring('a', 'b'), false);
    expect(scoping, 'THE LAW: every world-state predicate is scoped to the card\'s SUBJECT and to'
      + ' the LIVE stage of its process. A seal offered on town A because town B has a coup, or'
      + ' because a coup already resolved, is a DEFECT').toEqual([]);

    const empty = campaign(undefined, undefined);
    const threwOnAbsence = ids.filter((id) => {
      try { return WORLD_CONDITIONS[id].predicate(undefined, empty) !== false; } catch { return true; }
    });
    expect(threwOnAbsence, 'PURE, TOTAL, FALSE-ON-ABSENCE: an absent field yields false, never a'
      + ' throw, so a card simply does not offer the seal').toEqual([]);
  });

  it('A3: the stage partition is set-equal, and the seat moves the flag rather than the name', () => {
    const code = codeOf(OPERATIONS_REL);
    expect(writesField('const planted = { governingName: \'x\' };', 'governingName'),
      'the write matcher is proved LIVE on a planted string, or its silence below means nothing')
      .toBe(true);
    expect(writesField(code, 'governingName'), 'set-power-holder MOVES the isGoverning flag and'
      + ' its declared writer is rulingPower\'s transfer path; the canonical name FOLLOWS the'
      + ' flag, so this module writes governingName nowhere').toBe(false);
    expect(writesField(code, 'government'), 'and it writes government nowhere either: a direct'
      + ' write would put the canonical name out of step with the flag every sim consumer keys on')
      .toBe(false);
    expect(Object.keys(OP_TYPES['set-power-holder'].payload), 'the payload names a HOLDER')
      .toEqual(['holder']);

    expect(OP_STAGES, 'the closed stage vocabulary carries BOTH members, because it is the'
      + ' partition\'s definition and EM-B1b appends rows against it').toEqual(['home', 'off-stage']);
    expect(OP_CONSEQUENCE_POLICIES, 'and so does the consequence vocabulary')
      .toEqual(['home', 'by-target-reality']);
    expect(Object.isFrozen(OP_STAGES) && Object.isFrozen(OP_CONSEQUENCE_POLICIES),
      'both are frozen').toBe(true);

    const home = Object.keys(OP_TYPES).filter((t) => OP_TYPES[t].stage === 'home');
    const homeConsequence = Object.keys(OP_TYPES).filter((t) => OP_TYPES[t].consequence === 'home');
    expect(home, 'every one of the fourteen is stage home').toEqual(THE_FOURTEEN);
    expect(homeConsequence, 'and every one is consequence home').toEqual(THE_FOURTEEN);
    expect(home, 'and the two partitions are SET-EQUAL TO EACH OTHER, so the fields can never'
      + ' drift apart').toEqual(homeConsequence);
    const offStage = Object.keys(OP_TYPES).filter((t) => OP_TYPES[t].stage === 'off-stage');
    expect(offStage, 'the off-stage member is declared but provably unreached at this tip, which'
      + ' is what lets EM-B1b append without editing a frozen constant').toEqual([]);

    const forkWhy = 'consequenceFor is EM-F1\'s and is defined nowhere in this module';
    const engineWhy = 'and rederive is EM-B2\'s and is called nowhere in it either';
    expect(code.length, 'the module source is live, so the two absences below are measured against'
      + ' a real body rather than an empty string').toBeGreaterThan(1000);
    // anchored: the line above pins this same source as non-empty, and A6 pins its exact imports.
    expect(code, forkWhy).not.toMatch(/\bconsequenceFor\b/);
    // anchored: the same live-source length assertion two lines up anchors this negative too.
    expect(code, engineWhy).not.toMatch(/\brederive\s*\(/);
  });

  it('A4: relational integrity is total, symmetric and closed over the fourteen', () => {
    const types = Object.keys(OP_TYPES);
    const conditions = Object.keys(WORLD_CONDITIONS);
    const unknown = [];
    for (const type of types) {
      const row = OP_TYPES[type];
      for (const named of row.requires.world) {
        if (!conditions.includes(named)) unknown.push(`${type}.requires.world -> ${named}`);
      }
      for (const [relation, members] of [['requires.registry', row.requires.registry],
        ['enables', row.enables], ['relatedTo', row.relatedTo],
        ['conflictsWith', row.conflictsWith]]) {
        for (const named of members) {
          if (!types.includes(named)) unknown.push(`${type}.${relation} -> ${named}`);
        }
      }
    }
    expect(unknown, 'every string in requires.registry, enables, relatedTo and conflictsWith is a'
      + ' key of OP_TYPES, and every string in requires.world is an id of WORLD_CONDITIONS; this'
      + ' is the full offender list').toEqual([]);
    expect(conditions.length, 'the condition roster is live, or the world half above passed'
      + ' vacuously').toBe(10);

    const asymmetric = [];
    for (const type of types) {
      for (const other of OP_TYPES[type].conflictsWith) {
        if (!OP_TYPES[other].conflictsWith.includes(type)) asymmetric.push(`conflictsWith ${type} -> ${other}`);
      }
      for (const other of OP_TYPES[type].relatedTo) {
        if (!OP_TYPES[other].relatedTo.includes(type)) asymmetric.push(`relatedTo ${type} -> ${other}`);
      }
      for (const other of OP_TYPES[type].enables) {
        if (!OP_TYPES[other].requires.registry.includes(type)) asymmetric.push(`enables ${type} -> ${other}`);
      }
      for (const other of OP_TYPES[type].requires.registry) {
        if (!OP_TYPES[other].enables.includes(type)) asymmetric.push(`requires ${type} -> ${other}`);
      }
    }
    expect(asymmetric, 'conflictsWith and relatedTo are SYMMETRIC and requires/enables are EXACT'
      + ' INVERSES, because a one-sided relation makes a guard fire for one ordering and not the'
      + ' other').toEqual([]);
    const related = types.filter((t) => OP_TYPES[t].relatedTo.length > 0);
    expect(related.length, 'some row actually declares a relation, or the symmetry sweep above'
      + ' ran over nothing').toBeGreaterThan(0);

    const foreign = types.flatMap((type) => [
      ...OP_TYPES[type].requires.registry, ...OP_TYPES[type].enables,
      ...OP_TYPES[type].relatedTo, ...OP_TYPES[type].conflictsWith,
    ]).filter((named) => B1C_FIVE.includes(named) || !THE_FOURTEEN.includes(named));
    expect([...new Set(foreign)], 'no home row names an off-stage type and none names one of'
      + ' EM-B1c\'s five: the fourteen are CLOSED OVER THEMSELVES at this tip, and EM-B1b re-runs'
      + ' this arm over all twenty-five').toEqual([]);
  });

  it('A5: the rename ops delegate to the existing cascade and this module re-implements none of it', () => {
    const live = Object.keys(OP_TYPES);
    const renames = B1C_FIVE.filter((t) => t.startsWith('rename-'));
    expect(renames.length, 'the three rename-* names are the ones under test').toBe(3);
    expect(renames.filter((t) => live.includes(t)), 'the three rename-* rows are EM-B1c\'s (R8),'
      + ' and their absence here is the reason this module owns no rename logic').toEqual([]);

    const code = codeOf(OPERATIONS_REL);
    const planted = `${code}\nconst surface = 'powerStructure.governingName';\n`;
    const hits = (text) => FACTION_RENAME_SURFACES.map((s) => s.path).filter((p) => text.includes(p));
    expect(FACTION_RENAME_SURFACES.length, 'the declared join surfaces are live, or the scan'
      + ' below measures nothing').toBeGreaterThan(0);
    expect(hits(planted).length, 'the surface matcher is proved LIVE on a planted path, or its'
      + ' silence below means nothing').toBeGreaterThan(0);
    expect(hits(code), 'the join-key law is honoured BY DELEGATION (HZ-JOINKEY): this module'
      + ' re-implements no path in FACTION_RENAME_SURFACES and mints no second cascade')
      .toEqual([]);
  });

  it('A6: makeOp and validateOp are pure, the import list is exactly five, and nothing imports the leaf', () => {
    const target = { kind: 'npc', id: 'n1' };
    const payload = { name: 'Halvard', role: 'reeve' };
    const clone = JSON.parse(JSON.stringify(payload));
    const first = makeOp('add-npc', target, payload);
    const second = makeOp('add-npc', target, payload);
    expect(first, 'identical inputs give identical results').toEqual(second);
    expect(payload, 'the input payload is UNMUTATED against a pre-call clone').toEqual(clone);
    const verdicts = [];
    for (let n = 0; n < 100; n += 1) verdicts.push(JSON.stringify(validateOp(first, {})));
    expect([...new Set(verdicts)], '100 calls change nothing observable: no draw, no id, no state')
      .toEqual([JSON.stringify({ ok: true, errors: [] })]);

    const code = codeOf(OPERATIONS_REL);
    const specifiers = [...code.matchAll(/from\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
    expect(specifiers, 'the EXACT import list, in source order: version 9\'s own NPC_STATUS_VALUES'
      + ' import is the fifth specifier the version-8 arm did not carry (judgment 115 Q6)')
      .toEqual([
        '../deterministicSort.js', '../entities/npcs.js', '../entities/status.js',
        '../worldPulse/relationshipCompatibility.js', './fieldDeclarations.js',
      ]);
    const fenced = specifiers.filter((s) => /prng|rngContext|\/store\/|\/components\/|force|muster|casualty|upkeep/.test(s));
    expect(fenced, 'the import fence: no PRNG, no rngContext, no store, no components, and no'
      + ' force, muster, casualty or upkeep module').toEqual([]);

    const leaves = [OPERATIONS_REL, CONDITIONS_REL];
    const scanned = walkSources(join(ROOT, 'src')).filter((rel) => !leaves.includes(rel));
    expect(scanned.length, 'the src/ walk found nothing, so the dormancy claim below would be'
      + ' vacuous').toBeGreaterThan(400);
    const importers = [];
    for (const rel of scanned) {
      for (const resolved of importsOf(rel, commentsOnly(sourceOf(rel)))) {
        if (leaves.includes(resolved)) importers.push(`${rel} imports ${resolved}`);
      }
    }
    expect(importers, 'this packet lands DARK: nothing under src/ imports either leaf, so neither'
      + ' enters any bundle closure and the +0 B price is true by construction').toEqual([]);
    expect(importsOf('src/components/edit/Planted.jsx',
      "import { makeOp } from '../../domain/edit/operations.js';\n"),
    'the importer matcher is proved LIVE on a planted runtime import, or the absence above is'
    + ' vacuous').toEqual([OPERATIONS_REL]);
  });

  it('A7: the two vocabularies are the tree\'s own, and the editable field is category', () => {
    const statusSpec = OP_TYPES['set-npc-status'].payload.status;
    expect(statusSpec.kind, 'FINITE-SEMANTICS: a typed root from a pool, never free text').toBe('enum');
    expect(statusSpec.values, 'the pool IS NPC_STATUS_VALUES BY REFERENCE, so it cannot be a copy'
      + ' that drifts from the union\'s own value-level home').toBe(NPC_STATUS_VALUES);
    expect(statusSpec.values.includes('jailed'), 'and it reads jailed, the member EM-B1d landed')
      .toBe(true);
    expect(statusSpec.values.length, 'the union reads SEVEN').toBe(7);
    expect(readFileSync(join(ROOT, 'tests/domain/statusVocabularies.test.js'), 'utf8').length,
      'the typedef-to-value pin is DELEGATED BY NAME to EM-P4\'s statusVocabularies.test.js,'
      + ' which reads the typedef source and reds in both directions; this file must NOT re-parse'
      + ' the typedef, because a hand-spelled vocabulary of those words is what emptied'
      + ' statusUnionTotality\'s derived trigger at version 8').toBeGreaterThan(0);

    const code = codeOf(OPERATIONS_REL);
    const spelled = ['dead', 'exiled', 'retired'].filter((w) => code.includes(`'${w}'`) || code.includes(`"${w}"`));
    expect(spelled, 'the walker\'s own trigger condition made local: this module quotes none of'
      + ' the discriminating members, because a SCREAMING_SNAKE list of them in a non-roster file'
      + ' reads as a foreign vocabulary and empties the derived trigger').toEqual([]);

    const stateSpec = OP_TYPES['set-institution-state'].payload.state;
    expect(stateSpec.kind, 'also an enum, never free text').toBe('enum');
    expect([...stateSpec.values].sort(compareCodepoint), 'the OP\'S OWN SIX-MEMBER POOL: the'
      + ' EntityStatus five PLUS ruined, which is the PULSE\'s word')
      .toEqual([STATUS_ACTIVE, STATUS_DESTROYED, STATUS_IMPAIRED, STATUS_REMOVED, 'ruined', STATUS_VACANT].sort(compareCodepoint));

    const unionSource = readFileSync(join(ROOT, 'src/domain/entities/status.js'), 'utf8');
    const typedef = (unionSource.match(/@typedef\s*\{([^}]*)\}\s*EntityStatus/) || [])[1] || '';
    const members = [...typedef.matchAll(/'([^']+)'/g)].map((m) => m[1]).sort(compareCodepoint);
    expect(members, 'EntityStatus is parsed from its own typedef and asserted UNWIDENED at the'
      + ' FIVE: EM-B1d widened NpcStatus ONLY (ODQ §934.47 add. 6)')
      .toEqual([STATUS_ACTIVE, STATUS_DESTROYED, STATUS_IMPAIRED, STATUS_REMOVED, STATUS_VACANT].sort(compareCodepoint));
    const ruinedWhy = 'ruined is this op\'s POOL member and is NOT a member of the union; the'
      + ' two are different facts and neither may drift into the other';
    // anchored: `members` is asserted exactly equal to the parsed FIVE above, never an empty list.
    expect(members, ruinedWhy).not.toContain('ruined');

    const payloadKeys = [...new Set([...Object.keys(OP_TYPES['set-field'].payload),
      ...Object.keys(OP_TYPES['add-faction'].payload)])];
    expect(payloadKeys.includes('category'), 'add-faction spells category').toBe(true);
    const derived = payloadKeys.filter((k) => k === 'archetype' || k === 'type');
    expect(derived, 'and never archetype or type: archetype is a DERIVATION from category'
      + ' (factionArchetype(f)) and design §14 forbids editing one').toEqual([]);
    const editable = OP_TYPES['set-field'].payload.field.values;
    expect(editable.includes('category'), 'category is an editable field name').toBe(true);
    const derivedFields = editable.filter((f) => f === 'archetype');
    expect(derivedFields, 'and archetype is not among the editable names').toEqual([]);

    const distinct = ['set-institution-state', 'remove-institution']
      .filter((t) => Object.hasOwn(OP_TYPES, t));
    expect(distinct, 'destroying and removing are DIFFERENT ACTS and both are declared: the'
      + ' record KEEPS what was destroyed and FORGETS what was removed, and the tree already'
      + ' spells both').toEqual(['set-institution-state', 'remove-institution']);
    expect(stateSpec.values.includes(STATUS_DESTROYED), 'destroyed is a STATE in the pool')
      .toBe(true);
    expect(OP_TYPES['remove-institution'].payload.state, 'and removal declares no state at all,'
      + ' because erasure is not a value the record keeps').toBeUndefined();
    expect(PRIMARY_RELATIONSHIP_TYPES.includes('trade_partner'), 'the relationship vocabulary is'
      + ' the tree\'s own and is read by reference').toBe(true);
  });

  it('A8: ok is derived from errors, errors are frozen and sorted, and set-world-fact is not a row', () => {
    const cases = [
      ['valid add-npc', { type: 'add-npc', target: { kind: 'npc', id: 'n1' }, payload: { name: 'a', role: 'b' } }],
      ['valid set-field', { type: 'set-field', target: { kind: 'settlement', id: 's1' }, payload: { field: 'name', value: 'v' } }],
      ['unknown type', { type: 'no-such-op', target: GOOD_TARGET, payload: {} }],
      ['malformed target', { type: 'add-npc', target: 'nope', payload: { name: 'a', role: 'b' } }],
      ['missing required', { type: 'add-npc', target: { kind: 'npc', id: 'n1' }, payload: {} }],
      ['undeclared key', { type: 'add-npc', target: { kind: 'npc', id: 'n1' }, payload: { name: 'a', role: 'b', z: 1 } }],
    ];
    const broken = [];
    const frozen = [];
    const unsorted = [];
    for (const [label, op] of cases) {
      const result = validateOp(op, {});
      if (result.ok !== (result.errors.length === 0)) broken.push(label);
      if (!Object.isFrozen(result.errors)) frozen.push(label);
      if (JSON.stringify(result.errors) !== JSON.stringify([...result.errors].sort(compareCodepoint))) {
        unsorted.push(label);
      }
    }
    expect(broken, 'ok is DERIVED from errors and never set independently, so the two can never'
      + ' disagree').toEqual([]);
    expect(frozen, 'errors is ALWAYS frozen').toEqual([]);
    expect(unsorted, 'and ALWAYS compareCodepoint-sorted').toEqual([]);
    const okCount = cases.filter(([, op]) => validateOp(op, {}).ok).length;
    expect(okCount, 'the table carries both valid and invalid ops, or the invariant above was'
      + ' measured on one side only').toBe(2);

    const three = validateOp({
      type: 'add-npc', target: { kind: 'npc', id: 'n1' }, payload: { zebra: 1 },
    }, {});
    expect(three.errors, 'a THREE-error case asserted in EXACT sorted order, which is the'
      + ' ordering claim a length check alone cannot make').toEqual([
      'payload.name is required',
      'payload.role is required',
      'payload.zebra is not declared for add-npc',
    ]);

    const worldFact = validateOp({
      type: 'set-world-fact', target: { kind: 'settlement', id: 's1' }, payload: { fact: 'terrain', value: 'hill' },
    }, {});
    expect(worldFact.ok, 'the set-world-fact ROW is EM-B1c\'s (R8 moved it with the other four),'
      + ' so at the fourteen it is an unknown op type').toBe(false);
    expect(worldFact.errors, 'and the error names it exactly, which is the same protection stated'
      + ' at the fourteen').toContain('unknown op type: set-world-fact');

    const code = codeOf(OPERATIONS_REL);
    const derivedWhy = 'no re-derivation of any kind: the §14 engine stays EM-B2\'s (HZ-DERIVED)';
    expect(code.length, 'the module source is live, so the absence below is measured against a'
      + ' real body').toBeGreaterThan(1000);
    // anchored: the line above pins this same source as non-empty, and A6 pins its exact imports.
    expect(code, derivedWhy).not.toMatch(/\brederive\s*\(/);
    const poolImports = [...code.matchAll(/from\s*['"]([^'"]+)['"]/g)]
      .map((m) => m[1]).filter((s) => /pool/i.test(s));
    expect(poolImports, 'and this module resolves NO pool: pool resolution is the dialog\'s'
      + ' (EM-D2) and the guard engine\'s').toEqual([]);
  });
});
