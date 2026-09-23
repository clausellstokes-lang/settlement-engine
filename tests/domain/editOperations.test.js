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

import { codeOnly, commentsOnly } from '../helpers/codeOnlySource.js';
import { compareCodepoint } from '../../src/domain/deterministicSort.js';
import { NPC_STATUS_VALUES } from '../../src/domain/entities/npcs.js';
import {
  STATUS_ACTIVE, STATUS_DESTROYED, STATUS_IMPAIRED, STATUS_REMOVED, STATUS_VACANT,
} from '../../src/domain/entities/status.js';
import { FACTION_RENAME_SURFACES, NPC_RENAME_SURFACES } from '../../src/domain/factionRename.js';
import { EDIT_KINDS } from '../../src/domain/pendingEdits.js';
import { COUP_STRESSOR_TYPE } from '../../src/domain/worldPulse/coup.js';
import {
  draftPeaceOffer, withPeaceOffer, withoutPeaceOffer,
} from '../../src/domain/worldPulse/peaceTermsDrafting.js';
import { PRIMARY_RELATIONSHIP_TYPES } from '../../src/domain/worldPulse/relationshipCompatibility.js';
import {
  OP_CONSEQUENCE_POLICIES, OP_STAGES, OP_TYPES, makeOp, validateOp,
} from '../../src/domain/edit/operations.js';
import { NPC_RENAME_OP_TYPES } from '../../src/domain/edit/operationsNpcRename.js';
import {
  OFF_1, OFF_2, OFF_3, OFF_4, OFF_STAGE_OP_TYPES,
} from '../../src/domain/edit/operationsOffStage.js';
import { WORLD_CONDITIONS } from '../../src/domain/edit/worldConditions.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const OPERATIONS_REL = 'src/domain/edit/operations.js';
const CONDITIONS_REL = 'src/domain/edit/worldConditions.js';
const LEAF_REL = 'src/domain/edit/operationsNpcRename.js';
const sourceOf = (rel) => readFileSync(join(ROOT, rel), 'utf8');
/** The module's CODE, with every comment blanked by the estate's one shared strip. */
const codeOf = (rel) => commentsOnly(sourceOf(rel));

/** ⭐ §6's ONE LIST. Every other roster claim in this file names THIS constant. */
const THE_FOURTEEN = [
  'add-faction', 'add-institution', 'add-npc', 'found-phantom', 'promote-phantom',
  'rebalance-power', 'remove-faction', 'remove-institution', 'remove-npc', 'set-field',
  'set-institution-state', 'set-npc-status', 'set-power-holder', 'set-relationship',
];

/**
 * ⭐ EM-B1c1's ONE ROW, and the composed FIFTEEN **DERIVED** from §6's own list rather than
 * hand-spelled: the file's header rule is that every other roster claim names THE_FOURTEEN,
 * so the fifteenth is that constant plus this key, re-sorted with the tree's own comparator.
 * A hand-written fifteen would let the two lists drift the day either packet moves a row.
 */
const B1C1_ROW = 'set-npc-name';
const THE_FIFTEEN = [...THE_FOURTEEN, B1C1_ROW].sort(compareCodepoint);

/**
 * ⭐ EM-B1b's OWN LIST — the seven OFF-STAGE acts of design §13, and the composed catalogue
 * DERIVED from the two rosters above rather than hand-spelled, for the same reason the
 * fifteen is derived: a third hand-written list would let all three drift the day any one
 * packet moves a row. THE_FIFTEEN is NOT edited — A3 and B1 read it as the HOME roster.
 */
const THE_SEVEN = [
  'close-trade', 'declare-war', 'make-peace', 'open-trade', 'recall-force',
  'resolve-outcome', 'send-force',
];
const THE_TWENTY_TWO = [...THE_FIFTEEN, ...THE_SEVEN].sort(compareCodepoint);
const OFF_STAGE_REL = 'src/domain/edit/operationsOffStage.js';

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
/**
 * ⭐ ONE, NOT TWO, SINCE U28. `pendingPeaceOffer` moved to LIVE the day EM-E4's standing
 * offer record landed on the receiving settlement; the arm below reads it through E4's own
 * writer, so this roster shrinks only when a row's state actually exists.
 */
const ABSENT_CONDITIONS = ['envoyArrived'];

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
  it('A1: OP_TYPES is exactly the composed twenty-two, the fourteen home types among them, every row carries all eleven fields', () => {
    // GUARD-THE-GUARD, FIRST: the positive control. If the catalogue did not load, or loaded
    // empty, every set-equality below would pass vacuously against an empty offender list.
    expect(Object.keys(OP_TYPES).length, 'the catalogue loaded nothing, so every roster claim'
      + ' below would be vacuous').toBe(22);
    expect(THE_FOURTEEN.length, 'the expectation list itself is the fourteen').toBe(14);

    const live = Object.keys(OP_TYPES);
    const undeclared = live.filter((t) => !THE_TWENTY_TWO.includes(t));
    const missing = THE_TWENTY_TWO.filter((t) => !live.includes(t));
    expect({ undeclared, missing }, 'OP_TYPES and the ruling R8 roster PLUS EM-B1c1\'s one row'
      + ' PLUS EM-B1b\'s seven off-stage rows must be SET-EQUAL in both directions, so a row'
      + ' dropped by ANY of the three packets reds here; these are the full offender lists')
      .toEqual({ undeclared: [], missing: [] });

    expect(live, 'Object.keys(OP_TYPES) is authored in compareCodepoint order, so a new row'
      + ' cannot be appended wherever').toEqual([...live].sort(compareCodepoint));
    expect(live, 'and that order is the one §6 spells, with EM-B1c1\'s row and each of'
      + ' EM-B1b\'s FOUR off-stage runs SPLICED at their codepoint positions rather than'
      + ' appended').toEqual(THE_TWENTY_TWO);

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
    // anchored: the twenty-two are asserted set-equal two assertions above, so this cannot go vacuous.
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
    expect(absent, 'exactly ONE row is honestly absent, and openRoute, plotInMotion and'
      + ' pendingPeaceOffer are asserted OUT of that set by name: design §19 ruling 6 made'
      + ' structural, and U28 re-pointed the peace row at the record EM-E4 landed')
      .toEqual(ABSENT_CONDITIONS);
    // anchored: `absent` is asserted exactly equal to the two ids above, so this is never vacuous.
    expect(absent, 'openRoute is LIVE, not an EM-E4 gap').not.toContain('openRoute');
    // anchored: the same exact set-equality two assertions above anchors this negative too.
    expect(absent, 'plotInMotion is LIVE, not an EM-E4 gap').not.toContain('plotInMotion');
    // anchored: the same exact set-equality three assertions above anchors this negative too.
    expect(absent, 'pendingPeaceOffer is LIVE since U28, not an EM-E4 gap').not.toContain('pendingPeaceOffer');

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
    // ⭐ U28 — THE SAVE IS BUILT BY EM-E4's OWN WRITER, never by hand. `withPeaceOffer` is
    // the one path that mints the key and `draftPeaceOffer` the one that shapes an offer, so
    // this pair proves the round trip from the writer to the condition rather than asserting
    // against a record shape a test invented. SCOPING IS STRUCTURAL HERE and so has no
    // NEIGHBOUR row: the offers stand ON THE RECEIVER'S OWN RECORD, so a neighbour's standing
    // offer is a key on a record this predicate is never handed.
    const sued = (fromId) => withPeaceOffer(SUBJECT, draftPeaceOffer({
      fromId, toId: 'me', terms: [{ type: 'tribute' }], budgetSpent: 1, tick: 3,
    }));

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
    check('POSITIVE a standing offer sued on my own record', 'pendingPeaceOffer', sued('greymoor'), campaign({}), true);
    check('STAGE nobody has sued for peace', 'pendingPeaceOffer', SUBJECT, campaign({}), false);
    check('STAGE the one standing offer accepted or refused away', 'pendingPeaceOffer',
      withoutPeaceOffer(sued('greymoor'), 'greymoor'), campaign({}), false);
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
    expect(home, 'every one of the fifteen is stage home').toEqual(THE_FIFTEEN);
    expect(homeConsequence, 'and every one is consequence home').toEqual(THE_FIFTEEN);
    expect(home, 'and the two partitions are SET-EQUAL TO EACH OTHER, so the fields can never'
      + ' drift apart').toEqual(homeConsequence);
    const offStage = Object.keys(OP_TYPES).filter((t) => OP_TYPES[t].stage === 'off-stage');
    expect(offStage, 'the off-stage member is now REACHED, by EM-B1b\'s seven and by nothing'
      + ' else: the vocabulary carried both members from EM-B1a\'s landing precisely so that'
      + ' appending these rows never edited a frozen constant').toEqual(THE_SEVEN);

    const forkWhy = 'consequenceFor is EM-F1\'s and is defined nowhere in this module';
    const engineWhy = 'and rederive is EM-B2\'s and is called nowhere in it either';
    expect(code.length, 'the module source is live, so the two absences below are measured against'
      + ' a real body rather than an empty string').toBeGreaterThan(1000);
    // anchored: the line above pins this same source as non-empty, and A6 pins its exact imports.
    expect(code, forkWhy).not.toMatch(/\bconsequenceFor\b/);
    // anchored: the same live-source length assertion two lines up anchors this negative too.
    expect(code, engineWhy).not.toMatch(/\brederive\s*\(/);
  });

  it('A4: relational integrity is total, symmetric and closed over the composed twenty-two, with the home fourteen still closed over themselves', () => {
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

    const relationsOf = (type) => [
      ...OP_TYPES[type].requires.registry, ...OP_TYPES[type].enables,
      ...OP_TYPES[type].relatedTo, ...OP_TYPES[type].conflictsWith,
    ];
    const foreign = types.flatMap(relationsOf)
      .filter((named) => B1C_FIVE.includes(named) || !THE_TWENTY_TWO.includes(named));
    expect([...new Set(foreign)], 'no row names one of EM-B1c\'s five and none names a type'
      + ' outside the composed catalogue: the twenty-two are CLOSED OVER THEMSELVES, which is'
      + ' the closure EM-B1b\'s seven re-run this arm over').toEqual([]);
    // ⭐ THE ORIGINAL CLAUSE IS KEPT, NOT REPLACED, and it is the sharper half: EM-B1b's rows
    // may name each other freely, but a HOME row naming an off-stage type would force the
    // inverse or the symmetric counterpart onto one of EM-B1a's landed rows, which this
    // packet's §11 makes a STOP. Restricting the subject to the home roster keeps that
    // narrower claim assertable after the widening above.
    const foreignHome = THE_FIFTEEN.flatMap(relationsOf)
      .filter((named) => B1C_FIVE.includes(named) || !THE_FOURTEEN.includes(named));
    expect([...new Set(foreignHome)], 'and no HOME row names an off-stage type or one of'
      + ' EM-B1c\'s five: the fourteen stay closed over THEMSELVES, so EM-B1b\'s landing added'
      + ' no relation to a row it does not own').toEqual([]);
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

  // ⭐⭐ THE TITLE IS RE-WORDED BY EM-B1b, UNDER ITS OWN TEST ROW (the chair's judgment 156).
  // Both halves of the old wording had gone false while every assertion stayed true: the
  // import list is no longer five, and EM-C4a's cure widened the dormancy roster to name the
  // ONE runtime importer, the lazy store slice. The cure lane could not re-word it, because a
  // cure lane adds no title by law; this member already holds a TEST row on this file, so the
  // rename lands here. A rename is COUNT-NEUTRAL in the lighting census, which pins counts
  // rather than title text, and no banked failure names this arm.
  it('A6: makeOp and validateOp are pure, the import list is exactly seven, and the leaf\'s only runtime importer is the lazy store', () => {
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
      + ' import is the fifth specifier the version-8 arm did not carry (judgment 115 Q6), the'
      + ' sixth is EM-B1c1\'s own leaf, and the SEVENTH is EM-B1b\'s off-stage leaf, which this'
      + ' file composes rather than re-declares. It is ONE line by contract: a four-line import'
      + ' costs three more effective lines than the 250-line family budget leaves')
      .toEqual([
        '../deterministicSort.js', '../entities/npcs.js', '../entities/status.js',
        '../worldPulse/relationshipCompatibility.js', './fieldDeclarations.js',
        './operationsNpcRename.js', './operationsOffStage.js',
      ]);
    const fenced = specifiers.filter((s) => /prng|rngContext|\/store\/|\/components\/|force|muster|casualty|upkeep/.test(s));
    expect(fenced, 'the import fence: no PRNG, no rngContext, no store, no components, and no'
      + ' force, muster, casualty or upkeep module').toEqual([]);

    const leaves = [OPERATIONS_REL, CONDITIONS_REL];
    const scanned = walkSources(join(ROOT, 'src')).filter((rel) => !leaves.includes(rel));
    expect(scanned.length, 'the src/ walk found nothing, so the dormancy claim below would be'
      + ' vacuous').toBeGreaterThan(400);
    // ⭐⭐ EM-C4a WIDENS THIS ROSTER IN PLACE, BY ADDITION AND NEVER BY DELETION. The ONE entry
    // is `src/store/editSlice.js`, the settlement editor's plain-edit store half and this
    // catalogue's FIRST RUNTIME IMPORTER. It is LAZY, and that is MEASURED rather than argued:
    // `src/store/index.js` names it nowhere and it has ZERO importers under `src/`, static or
    // dynamic, at this tip — so it is composed by no eager slice, enters no first-paint closure,
    // and the +0 B price is unmoved.
    //
    // ⭐ EM-E4d WIDENS IT ONCE MORE, AND ITS ROW IS THE WORLD-CONDITION LEAF'S FIRST IMPORTER
    // ANYWHERE. The paragraph above used to end "The world-condition leaf still has NO importer
    // at all, so any row naming it here would be a NEW closure edge", and that stopped being
    // true the day design §18's preconditions got a reader: judgment 296 forbids OFFERING a
    // seal whose act is unbound and forbids opening one whose condition nothing asked, so
    // something under `src/` has to ask. It is the STORE that asks and not the shell — the
    // shell's `src/domain/edit/*` edge set is pinned at the declaration table alone in two
    // homes (editShellPlusDoor D5, editModeShell A7), lane S EXECUTED the direct shell edge and
    // red both, and EM-F1e took this same store route for the reality badge on the chair's
    // judgment 298. The edge is still LAZY and the price still +0 B, MEASURED: that leaf's only
    // importer under `src/` is the edit shell, which `src/App.jsx` reaches through one
    // `lazy(() => import(…))` edge, and `EAGER_FIRST_PAINT_MODULES` walks STATIC edges only and
    // still reads 270 with this row in place.
    // ⚠ AND ONE ROW IS NOT EM-E4d's: `campaignAdvanceSession.js` took U72's DYNAMIC edge to the
    // catalogue (design §20.3's stale-vocabulary resolver at the head of the tick) and this
    // roster was not told, so the arm has been RED at every tip since that landing while its
    // SIBLING roster — `tests/domain/editDeclarations.test.js`'s second-order scan — has listed
    // the same edge with its full reason all along. It is recorded here because this member is
    // re-recording the roster anyway and a second seat editing these same lines would collide;
    // the edge itself is U72's and unchanged, and the price is still +0 B because
    // `EAGER_FIRST_PAINT_MODULES` walks STATIC edges only.
    const EXPECTED_IMPORTERS = [
      'src/store/campaignAdvanceSession.js imports src/domain/edit/operations.js',
      'src/store/editSlice.js imports src/domain/edit/operations.js',
      'src/store/phantomMintAction.js imports src/domain/edit/worldConditions.js',
    ];
    const importers = [];
    for (const rel of scanned) {
      for (const resolved of importsOf(rel, commentsOnly(sourceOf(rel)))) {
        if (leaves.includes(resolved)) importers.push(`${rel} imports ${resolved}`);
      }
    }
    expect(importers, 'EM-B1a LANDED dark: the ONLY module under src/ that imports either leaf is'
      + ' EM-C4a\'s LAZY store slice, which no eager slice composes, so neither leaf enters a'
      + ' first-paint closure and the +0 B price is true by construction. An UNLISTED importer'
      + ' invalidates that price; a MISSING listed one means the sanctioned edge is gone and the'
      + ' roster has aged instead of convicting').toEqual(EXPECTED_IMPORTERS);
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

  // ── EM-B1c1 — THE ONE-ROW SLICE: set-npc-name in its own leaf (B1 to B6) ────────────
  // Six straight-line literal `it`s appended to EM-B1a's ONE literal describe. The three
  // landed arms this row puts red (A1, A3 and A6) are widened ABOVE, by ADDITION inside
  // the arm each strengthens, so these six are the only titles the file gains.

  it('B1: the catalogue is the fourteen PLUS set-npc-name, spliced at its codepoint position, and all five of EM-B1c\'s names stay absent', () => {
    const live = Object.keys(OP_TYPES);
    expect(live.length, 'the composed catalogue loaded, or every roster claim below is vacuous')
      .toBe(22);
    expect(THE_FIFTEEN.length, 'and the DERIVED expectation list is fifteen, so the two lists'
      + ' cannot drift: it is THE_FOURTEEN plus this key, never a hand-spelled roster').toBe(15);

    const undeclared = live.filter((t) => !THE_TWENTY_TWO.includes(t));
    const missing = THE_TWENTY_TWO.filter((t) => !live.includes(t));
    expect({ undeclared, missing }, 'SET-EQUAL in both directions, so a row dropped by ANY of'
      + ' the three packets reds here; these are the full offender lists')
      .toEqual({ undeclared: [], missing: [] });

    const reabsorbed = B1C_FIVE.filter((t) => live.includes(t));
    expect(reabsorbed, 'ALL FIVE of EM-B1c\'s names stay ABSENT BY NAME. This member spells'
      + ' set-npc-name, not rename-npc, so EM-B1c\'s landing still reds here until its own arms'
      + ' are widened deliberately').toEqual([]);

    expect(live, 'the composition is authored in compareCodepoint order')
      .toEqual([...live].sort(compareCodepoint));
    const at = live.indexOf(B1C1_ROW);
    expect([at, live[at - 1], live[at + 1]], 'THE SPLICE, BY POSITION: index 18 of 22, between'
      + ' set-institution-state and set-npc-status. A trailing spread would put the row LAST and'
      + ' red the order clause of A1. ⭐ EM-B1b RE-ADDRESSED THE INDEX, under its own TEST row'
      + ' (the chair\'s judgment 152c): its seven off-stage keys all sort BEFORE set-npc-name,'
      + ' so the index moves 11 to 18 while the two NEIGHBOURS are unchanged, which is exactly'
      + ' what a positional claim should report when a sibling splices ahead of it')
      .toEqual([18, 'set-institution-state', 'set-npc-status']);

    expect(Object.isFrozen(NPC_RENAME_OP_TYPES), 'the leaf\'s own map is frozen').toBe(true);
    const thawed = live.filter((t) => !Object.isFrozen(OP_TYPES[t]));
    expect(thawed, 'and EVERY ONE of the fifteen composed rows is frozen. Object.freeze over a'
      + ' spread freezes the OUTER map only, and EM-B1a\'s home map is exported by nothing, so'
      + ' this is the arm that closes the hole from the declared exports').toEqual([]);

    const op = makeOp(B1C1_ROW, { kind: 'npc', id: 'n1' }, { newName: 'X' });
    expect(op && op.type, 'makeOp is ARITY THREE and builds one op from the new row').toBe(B1C1_ROW);
    expect([op.stage, op.consequence], 'it copies the declared home stage and home consequence')
      .toEqual(['home', 'home']);
    expect([op.requires, op.enables, op.relatedTo, op.conflictsWith], 'and FOUR EMPTY ARRAYS on the'
      + ' Op: requires is FLATTENED from the declaration\'s { world, registry } pair into EM-A1\'s'
      + ' readonly string[], which is why an arm asserting the pair on the Op would red'
      + ' typecheck:domain:strict').toEqual([[], [], [], []]);
  });

  it('B2: the rename DELEGATES and this leaf writes no name field and re-implements no join surface', () => {
    const decl = OP_TYPES[B1C1_ROW];
    expect(decl.target, 'the row targets an npc').toBe('npc');
    expect(Object.keys(decl.payload), 'and declares exactly one payload field').toEqual(['newName']);
    expect([decl.payload.newName.kind, decl.payload.newName.required], 'a REQUIRED free field: a'
      + ' name is the estate\'s one free-cascade fact, so the freedom is in the value and the'
      + ' safety is in the delegation').toEqual(['free', true]);
    expect([decl.stage, decl.consequence], 'home and home').toEqual(['home', 'home']);
    expect(decl.requires, 'the TWO-KIND requires, both halves empty: design §18 gives a rename no'
      + ' world precondition, and an omitted key would be an A1 red rather than a default')
      .toEqual({ world: [], registry: [] });
    expect(decl.guardsStated.includes('npcRenameChanges')
      && decl.guardsStated.includes('applyNpcRenameToSettlement'),
    'guardsStated NAMES the existing cascade as prose-data, because OpTypeDeclaration has no'
    + ' writer key and a twelfth field would be a stored-shape change').toBe(true);

    const leafCode = codeOf(LEAF_REL);
    expect(leafCode.length, 'the leaf source is live, so the absences below are measured against a'
      + ' real body rather than an empty string').toBeGreaterThan(200);

    // ⛔ THE NAME-WRITE CLAIM IS THE SURFACE SCAN, NOT A BARE `name:` REGEX. The five
    // NPC_RENAME_SURFACES paths ARE the name fields a rename writes, and they are read from the
    // FROZEN LIST rather than re-typed, so an upstream change to the cascade reds here instead
    // of drifting into a silent pass. (A generic `\bname\s*[:=]` matcher was measured against
    // this leaf and convicts its guardsStated PROSE, which writes nothing: an instrument that
    // cannot tell a sentence from an assignment proves neither.)
    expect(NPC_RENAME_SURFACES.length, 'the five declared join surfaces are live, or the scan'
      + ' below measures nothing').toBe(5);
    const surfaceHits = (text) => NPC_RENAME_SURFACES.map((s) => s.path).filter((p) => text.includes(p));
    const plantedWrite = `${leafCode}\nconst planted = { '${NPC_RENAME_SURFACES[0].path}': 'X' };\n`;
    expect(surfaceHits(plantedWrite), 'the matcher is proved LIVE on a planted ASSIGNMENT to'
      + ' npcs[].name, or its silence below means nothing').toEqual(['npcs[].name']);
    expect(surfaceHits(leafCode), 'HZ-JOINKEY, honoured BY DELEGATION: this module writes no name'
      + ' field and re-implements NONE of the five NPC_RENAME_SURFACES paths, so it mints no'
      + ' second cascade').toEqual([]);

    expect(importsOf(LEAF_REL, leafCode), 'and it imports NOTHING AT ALL. operations.js imports'
      + ' THIS module\'s rows, so an import back for the vocabularies would be a module cycle with'
      + ' both const bindings in the temporal dead zone at initialisation').toEqual([]);
  });

  it('B3: relational integrity is total, symmetric and closed over the composed fifteen', () => {
    const types = Object.keys(OP_TYPES);
    const row = OP_TYPES[B1C1_ROW];
    expect([row.requires.world, row.requires.registry, row.enables, row.relatedTo,
      row.conflictsWith], 'the row\'s FIVE arrays are asserted EMPTY rather than trusted: the'
    + ' DECLARATION\'s requires is the two-kind PAIR, so an arm that iterated it as one flat'
    + ' array would throw. The flat form is the Op\'s, not the row\'s')
      .toEqual([[], [], [], [], []]);

    const conditions = Object.keys(WORLD_CONDITIONS);
    const unknown = [];
    for (const type of types) {
      const r = OP_TYPES[type];
      for (const named of r.requires.world) {
        if (!conditions.includes(named)) unknown.push(`${type}.requires.world -> ${named}`);
      }
      for (const [relation, members] of [['requires.registry', r.requires.registry],
        ['enables', r.enables], ['relatedTo', r.relatedTo], ['conflictsWith', r.conflictsWith]]) {
        for (const named of members) {
          if (!types.includes(named)) unknown.push(`${type}.${relation} -> ${named}`);
        }
      }
    }
    expect(unknown, 'every relation string is a key of the COMPOSED OP_TYPES and every world'
      + ' requirement an id of WORLD_CONDITIONS; this is the full offender list').toEqual([]);

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
    expect(asymmetric, 'A4\'s symmetry law RE-RUN over all fifteen: conflictsWith and relatedTo'
      + ' SYMMETRIC, requires and enables EXACT INVERSES').toEqual([]);
    const related = types.filter((t) => OP_TYPES[t].relatedTo.length > 0);
    expect(related.length, 'some row actually declares a relation, or the sweep above ran over'
      + ' nothing').toBeGreaterThan(0);

    const namesASibling = [...row.requires.registry, ...row.enables, ...row.relatedTo,
      ...row.conflictsWith].filter((t) => B1C_FIVE.includes(t));
    expect(namesASibling, 'and this row names NONE of EM-B1c\'s remaining four, by name, so the'
      + ' split cannot be re-coupled through a relation').toEqual([]);
  });

  it('B4: the two-kind requires is the declaration\'s, and the vocabularies are proved from the test where there is no cycle', () => {
    const row = OP_TYPES[B1C1_ROW];
    expect(Object.keys(row.requires).sort(compareCodepoint), 'the declaration carries the'
      + ' { world, registry } SPLIT, both halves present').toEqual(['registry', 'world']);
    expect(OP_STAGES.includes(row.stage), 'stage is a MEMBER of OP_STAGES, asserted from the TEST'
      + ' because the leaf imports nothing: operations.js imports the leaf, so an import back'
      + ' would put both const bindings in the TDZ').toBe(true);
    expect(OP_CONSEQUENCE_POLICIES.includes(row.consequence), 'and consequence a member of'
      + ' OP_CONSEQUENCE_POLICIES. This arm reds the day either vocabulary loses a member').toBe(true);
    expect([OP_STAGES.length, OP_CONSEQUENCE_POLICIES.length], 'both vocabularies are live and'
      + ' carry both members, or the two memberships above pass vacuously').toEqual([2, 2]);
    expect(NPC_RENAME_OP_TYPES[B1C1_ROW], 'and the composed row IS the leaf\'s row, by value: the'
      + ' spread copies it and freezes the outer map only').toEqual(row);
  });

  it('B5: makeOp and validateOp are pure over the new row, the leaf imports nothing, and exactly one module imports the leaf', () => {
    const target = { kind: 'npc', id: 'n1' };
    const payload = { newName: 'Halvard' };
    const clone = JSON.parse(JSON.stringify(payload));
    const first = makeOp(B1C1_ROW, target, payload);
    const second = makeOp(B1C1_ROW, target, payload);
    expect(first, 'identical inputs give identical results').toEqual(second);
    expect(payload, 'the input payload is UNMUTATED against a pre-call clone').toEqual(clone);
    const verdicts = [];
    for (let n = 0; n < 100; n += 1) verdicts.push(JSON.stringify(validateOp(first, {})));
    expect([...new Set(verdicts)], '100 calls change nothing observable: no draw, no id, no state')
      .toEqual([JSON.stringify({ ok: true, errors: [] })]);

    const leafCode = codeOf(LEAF_REL);
    const specifiers = [...leafCode.matchAll(/from\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
    expect(specifiers, 'THE LEAF\'S IMPORT LIST IS EXACTLY EMPTY. Its only references to types.js'
      + ' are JSDoc @typedef lines, which the estate\'s comment strip blanks, so the leaf enters'
      + ' no bundle closure').toEqual([]);
    const fenced = specifiers.filter((s) => /prng|rngContext|\/store\/|\/components\/|factionRename|edit\/operations\.js/.test(s));
    expect(fenced, 'the import fence, stated even at zero: no PRNG, no rngContext, no store, no'
      + ' components, not factionRename.js and not operations.js').toEqual([]);

    const scanned = walkSources(join(ROOT, 'src')).filter((rel) => rel !== LEAF_REL);
    expect(scanned.length, 'the src/ walk found nothing, so the importer claim below would be'
      + ' vacuous').toBeGreaterThan(400);
    const importers = [];
    for (const rel of scanned) {
      for (const resolved of importsOf(rel, commentsOnly(sourceOf(rel)))) {
        if (resolved === LEAF_REL) importers.push(rel);
      }
    }
    expect(importers, 'the leaf lands DARK with EXACTLY ONE importer, which is its own spread')
      .toEqual([OPERATIONS_REL]);
    expect(importsOf('src/components/edit/Planted.jsx',
      "import { NPC_RENAME_OP_TYPES } from '../../domain/edit/operationsNpcRename.js';\n"),
    'the importer matcher is proved LIVE on a planted runtime import, or the roster above is'
    + ' vacuous').toEqual([LEAF_REL]);
  });

  it('B6: the op catalogue and the shipped EDIT_KINDS vocabulary are disjoint over every row minted after the fourteen', () => {
    const live = Object.keys(OP_TYPES);
    expect(EDIT_KINDS.length, 'the shipped pending-edit vocabulary is read BY IMPORT and never'
      + ' re-typed: a hand-spelled copy would drift the day a kind is added and make this whole'
      + ' claim a claim about nothing').toBeGreaterThan(0);

    const minted = live.filter((t) => !THE_FOURTEEN.includes(t));
    expect(minted, 'THE POPULATION THIS MEMBER CAN ANSWER FOR: every row minted AFTER EM-B1a\'s'
      + ' fourteen. ⭐ EM-B1b WIDENED THIS ROSTER under its own TEST row (judgment 152c): it is'
      + ' EIGHT today — this member\'s one plus EM-B1b\'s seven off-stage acts — and the'
      + ' expectation is DERIVED from the composed catalogue so no third list can drift;'
      + ' tomorrow EM-B1c\'s remaining four join it')
      .toEqual(THE_TWENTY_TWO.filter((t) => !THE_FOURTEEN.includes(t)));

    const collide = (rows) => rows.filter((t) => EDIT_KINDS.includes(t));
    expect(collide(minted), 'THE GUARD: no row minted after the fourteen may take a shipped'
      + ' EDIT_KINDS verb\'s name. One string may not mean two typed things, and the cure when'
      + ' this reds is to RENAME THE OP, never to add an exemption').toEqual([]);

    expect(collide(THE_FOURTEEN), 'THE BANKED PAIR, asserted EXACTLY in both directions:'
      + ' add-institution and remove-institution are EM-B1a\'s LANDED rows and shipped EDIT_KINDS'
      + ' members. A NEW inherited collision reds, and a CURED one must be BANKED by shrinking'
      + ' this list rather than pocketed silently. It is also this arm\'s POSITIVE CONTROL: a'
      + ' non-empty result proves the matcher and both rosters are live, so the empty above is'
      + ' never a vacuous green').toEqual(['add-institution', 'remove-institution']);

    expect(collide([...minted, 'rename-npc']), 'and the matcher is proved live on the exact'
      + ' collision this member\'s rename cured').toEqual(['rename-npc']);
    // ⛔ THE MARKER SITS ON THE LINE IMMEDIATELY ABOVE THE `.not.` ITSELF, which is why the
    // message is hoisted into a const: the walker reads the assertion's own line and the ONE
    // line above it, so a marker above a WRAPPED `expect(` opener anchors nothing.
    const avoidWhy = 'the op layer avoids the shipped verb BY DESIGN: rename-npc keeps its name,'
      + ' its payload, its intent id and its canon lock at the queue seam';
    // anchored: the planted control one assertion above returns exactly ['rename-npc'] for this key, so the matcher can FIND it, and minted is asserted exactly equal to the derived EIGHT above that.
    expect(minted, avoidWhy).not.toContain('rename-npc');
  });

  // ── EM-B1b — THE SEVEN OFF-STAGE ACTS under the phantom consequence rule (C1 to C4) ──
  // Four straight-line literal `it`s appended to EM-B1a's ONE literal describe. The six
  // landed arms these rows put red (A1, A3, A4, A6 and EM-B1c1's B1 and B6) are widened
  // ABOVE, by ADDITION inside the arm each strengthens, so these four are the only titles
  // this file gains. The ids are C, not B: EM-B1c1 landed B1 to B6 in this very describe.

  it('C1: the catalogue is the fifteen PLUS the seven off-stage acts, spliced at four codepoint positions, every row eleven fields and every row frozen', () => {
    const live = Object.keys(OP_TYPES);
    expect(live.length, 'the composed catalogue loaded, or every roster claim below is vacuous')
      .toBe(22);
    expect(THE_SEVEN.length, 'and §6\'s own expectation list is SEVEN, so the claims below are'
      + ' judged against an authored roster rather than a length read off the thing under test')
      .toBe(7);

    const undeclared = live.filter((t) => !THE_TWENTY_TWO.includes(t));
    const missing = THE_TWENTY_TWO.filter((t) => !live.includes(t));
    expect({ undeclared, missing }, 'STATED AS A DERIVATION, NEVER AS AN ABSOLUTE: OP_TYPES is'
      + ' set-equal, both directions, to EM-B1a\'s home roster PLUS EM-B1c1\'s row PLUS this'
      + ' member\'s seven. A row dropped by any of the three reds here, and a sibling landing'
      + ' between them does not make the arm wrong; these are the full offender lists')
      .toEqual({ undeclared: [], missing: [] });

    expect(live, 'THE ORDER IS THE ARM THE FOUR-POSITION SPLICE EXISTS FOR. Object spread fixes'
      + ' a key\'s position at its FIRST insertion, so one map spread four times lands all seven'
      + ' at the first anchor and a trailing spread puts them LAST; either shape reds here')
      .toEqual([...live].sort(compareCodepoint));

    const rowProblems = [];
    for (const type of THE_SEVEN) {
      const row = OP_TYPES[type];
      const keys = Object.keys(row).sort(compareCodepoint);
      if (keys.join(',') !== ROW_KEYS.join(',')) rowProblems.push(`${type}: keys ${keys.join('+')}`);
      if (row.target !== 'phantom') rowProblems.push(`${type}: target is not phantom`);
      if (row.duration !== null) rowProblems.push(`${type}: duration`);
      if (!Array.isArray(row.guards) || row.guards.length !== 0) rowProblems.push(`${type}: guards`);
      if (typeof row.guardsStated !== 'string' || row.guardsStated.length === 0) {
        rowProblems.push(`${type}: guardsStated is empty, and empty coverage still owes a statement`);
      }
    }
    expect(rowProblems, 'every one of the ELEVEN declaration fields is REQUIRED on every'
      + ' off-stage row, with target phantom, duration null, guards [] and a non-empty'
      + ' guardsStated; this is the full offender list').toEqual([]);

    const thawed = live.filter((t) => !Object.isFrozen(OP_TYPES[t]));
    expect(thawed, 'EVERY ONE of the twenty-two composed rows is frozen. Object.freeze over a'
      + ' spread freezes the OUTER map only, so the rows are the arm that closes the hole')
      .toEqual([]);
    const unfrozen = [['OFF_1', OFF_1], ['OFF_2', OFF_2], ['OFF_3', OFF_3], ['OFF_4', OFF_4],
      ['OFF_STAGE_OP_TYPES', OFF_STAGE_OP_TYPES]]
      .filter(([, group]) => !Object.isFrozen(group)).map(([name]) => name);
    expect(unfrozen, 'and so are all FIVE of the leaf\'s declared exports, which are nameable'
      + ' from here: otherwise a row could be mutated through a source group while OP_TYPES'
      + ' still reported frozen').toEqual([]);
  });

  it('C2: the §13 stage partition is TOTAL and SET-EQUAL to the consequence partition, and the resolver is defined nowhere in the leaf', () => {
    const live = Object.keys(OP_TYPES);
    const offStage = live.filter((t) => OP_TYPES[t].stage === 'off-stage');
    const byTargetReality = live.filter((t) => OP_TYPES[t].consequence === 'by-target-reality');
    const home = live.filter((t) => OP_TYPES[t].stage === 'home');
    const homeConsequence = live.filter((t) => OP_TYPES[t].consequence === 'home');
    expect(offStage, 'the off-stage set is EXACTLY these seven, asserted as a sorted list and'
      + ' never as a length').toEqual(THE_SEVEN);
    expect(byTargetReality, 'and the by-target-reality set SET-EQUALS it, so the two fields can'
      + ' never drift apart: the consequence policy IS the stage partition').toEqual(offStage);
    expect(home, 'every other type is home, which is EM-B1a\'s roster plus EM-B1c1\'s row')
      .toEqual(THE_FIFTEEN);
    expect(homeConsequence, 'and the home consequence set SET-EQUALS the home stage set')
      .toEqual(home);
    expect(offStage.length + home.length, 'the partition is TOTAL over the composed catalogue:'
      + ' no row sits outside both halves').toBe(live.length);

    const leafCode = commentsOnly(sourceOf(OFF_STAGE_REL));
    expect(leafCode.length, 'the leaf source is live, so the absence below is measured against a'
      + ' real body rather than an empty string').toBeGreaterThan(1000);
    expect(commentsOnly('const why = \'resolved by consequenceFor(target)\';'),
      'THE COUNTERFORCE IS PROVED LIVE ON A PLANTED STRING, and the string form is the whole'
      + ' point: this strip KEEPS string text, so a guardsStated sentence naming the resolver'
      + ' convicts prose that writes nothing, which is exactly what must red here')
      .toMatch(/\bconsequenceFor\b/);
    const forkWhy = 'consequenceFor is EM-F1\'s. This packet declares the POLICY as data and'
      + ' nothing more: the resolver is defined, imported and referenced nowhere in the leaf,'
      + ' in code OR in a sentence';
    // anchored: the planted control one assertion above proves this matcher fires on a quoted mention, and the length assertion above that proves the subject is a live body.
    expect(leafCode, forkWhy).not.toMatch(/\bconsequenceFor\b/);
  });

  it('C3: no off-stage prerequisite names world state, and relational integrity is closed over the composed twenty-two', () => {
    const worldly = THE_SEVEN.filter((t) => OP_TYPES[t].requires.world.length > 0);
    expect(worldly, 'design §13 clause (d) made STRUCTURAL by the row shape rather than by a'
      + ' naming convention: requires.world is EMPTY on every off-stage row, because a phantom'
      + ' counterparty carries no war state, treaty, route or envoy state to require')
      .toEqual([]);
    const prerequisites = ['close-trade', 'make-peace', 'recall-force', 'resolve-outcome']
      .map((t) => [t, OP_TYPES[t].requires]);
    expect(prerequisites, 'and each prerequisite names a prior ENTRY IN THE REGISTRY, pinned by'
      + ' name: an act the record already carries, never a condition of the world').toEqual([
      ['close-trade', { world: [], registry: ['open-trade'] }],
      ['make-peace', { world: [], registry: ['declare-war'] }],
      ['recall-force', { world: [], registry: ['send-force'] }],
      ['resolve-outcome', { world: [], registry: ['send-force'] }],
    ]);

    const namesAHomeType = THE_SEVEN.flatMap((type) => [
      ...OP_TYPES[type].requires.registry, ...OP_TYPES[type].enables,
      ...OP_TYPES[type].relatedTo, ...OP_TYPES[type].conflictsWith,
    ]).filter((named) => !THE_SEVEN.includes(named));
    expect([...new Set(namesAHomeType)], 'THE CLOSURE ARM: every relation on the seven is closed'
      + ' OVER the seven, because conflictsWith and relatedTo are symmetric and requires and'
      + ' enables are exact inverses, so naming a HOME type would force the counterpart onto one'
      + ' of EM-B1a\'s landed rows').toEqual([]);

    const types = Object.keys(OP_TYPES);
    const conditions = Object.keys(WORLD_CONDITIONS);
    const unknown = [];
    const asymmetric = [];
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
      for (const other of row.conflictsWith) {
        if (!OP_TYPES[other].conflictsWith.includes(type)) asymmetric.push(`conflictsWith ${type} -> ${other}`);
      }
      for (const other of row.relatedTo) {
        if (!OP_TYPES[other].relatedTo.includes(type)) asymmetric.push(`relatedTo ${type} -> ${other}`);
      }
      for (const other of row.enables) {
        if (!OP_TYPES[other].requires.registry.includes(type)) asymmetric.push(`enables ${type} -> ${other}`);
      }
      for (const other of row.requires.registry) {
        if (!OP_TYPES[other].enables.includes(type)) asymmetric.push(`requires ${type} -> ${other}`);
      }
    }
    expect(unknown, 'A4\'s totality law RE-RUN over all twenty-two: every relation string is a'
      + ' key of the composed OP_TYPES and every world requirement an id of WORLD_CONDITIONS')
      .toEqual([]);
    expect(asymmetric, 'and A4\'s symmetry law with it: conflictsWith and relatedTo SYMMETRIC,'
      + ' requires.registry and enables EXACT INVERSES').toEqual([]);
    const declaring = THE_SEVEN.filter((t) => OP_TYPES[t].enables.length > 0
      || OP_TYPES[t].conflictsWith.length > 0);
    expect(declaring.length, 'some off-stage row actually declares a relation, or the two sweeps'
      + ' above ran over nothing').toBeGreaterThan(0);
    expect(conditions.length, 'the condition roster is live, or the world half above passed'
      + ' vacuously').toBe(10);
  });

  it('C4: a well-formed off-stage op against a phantom target VALIDATES, and the leaf grows no second force-return path', () => {
    const target = { kind: 'phantom', id: 'p1' };
    const counterparty = { kind: 'phantom', id: 'p2' };
    const wellFormed = validateOp({
      type: 'send-force', target, payload: { counterparty, strength: 3 },
    }, {});
    expect(wellFormed, 'THE REPORT-NEVER-REFUSE LAW: a well-formed off-stage op against a phantom'
      + ' target validates ok, because validateOp reports MALFORMATION and never refuses an act')
      .toEqual({ ok: true, errors: [] });
    const badOutcome = validateOp({
      type: 'resolve-outcome', target, payload: { counterparty, outcome: 'nonsense' },
    }, {});
    expect(badOutcome.errors, 'and it still names a malformed field exactly, so the law above is'
      + ' permission rather than silence').toContain('payload.outcome is not one of the declared values');
    const built = makeOp('declare-war', target, { counterparty });
    expect([built.stage, built.consequence], 'makeOp copies the declared off-stage stage and the'
      + ' by-target-reality consequence onto the Op').toEqual(['off-stage', 'by-target-reality']);
    expect(built.requires, 'and FLATTENS the declaration\'s { world, registry } pair onto EM-A1\'s'
      + ' readonly string[]: declare-war requires nothing at all').toEqual([]);

    const leafCode = codeOnly(sourceOf(OFF_STAGE_REL));
    expect(leafCode.length, 'the leaf CODE is live, so the absence below is measured against a'
      + ' real body rather than a blanked one').toBeGreaterThan(500);
    const returnPath = /muster|casualty|upkeep/i;
    expect(returnPath.test(codeOnly('const returned = musterForce(home);')),
      'the matcher is proved LIVE on a planted CALL, or its silence below means nothing')
      .toBe(true);
    expect(returnPath.test(leafCode), 'NO SECOND FORCE-RETURN MECHANISM: a returning force'
      + ' resolves through the home\'s EXISTING muster, casualty and upkeep mechanics, which are'
      + ' EM-F1\'s. This module writes none and names none as a write target')
      .toBe(false);
    expect(importsOf(OFF_STAGE_REL, commentsOnly(sourceOf(OFF_STAGE_REL))),
      'and the leaf imports NOTHING AT ALL: operations.js imports THIS module\'s four groups, so'
      + ' an import back for the vocabularies would be a module cycle with both const bindings in'
      + ' the temporal dead zone at initialisation').toEqual([]);
  });
});
