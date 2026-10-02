/**
 * tests/lint/chooserRecordPathRegistry.walker.test.js — THE CHOOSER-RECORD-PATH WALKER (EM-R1c, the
 * re-entry family; judgments 206h-4 and 233).
 *
 * WHAT IT HOLDS. `src/generators/pipeline.js` declares `_CHOOSER_RECORD_PATHS`: the ctx keys whose
 * value does NOT live at `record.<ctxKey>` but at a NESTED or RENAMED path, and where that path is.
 * Like `_TRANSIENT_CHOOSERS` beside it, that declaration is a COPY of a measurement that lives
 * somewhere else — `src/domain/generation/generationForkRegistry.js :: GENERATION_TIER1`, where a
 * `provides` row's `recordPath` records exactly where the key lands. A copy of a measurement rots
 * silently: a step's chooser moves under `config`, a key stops landing where it used to, a row is
 * added because the path "looks right", and a bag builder quietly reads the wrong place. This
 * walker holds the two EQUAL IN BOTH DIRECTIONS, so the day either moves the rule reds BY NAME.
 *
 * ⛔ WHY THE DECLARATION IS A COPY AT ALL, AND WHY THAT IS NOT A DEFECT TO CURE HERE. The register
 * is PRODUCTION-UNREACHABLE by its own header's law: nothing under `src/` imports it, and a
 * generators-to-domain import edge would route its transitive closure into the eager `engine-core`
 * chunk (`vite.config.js :: computeEngineSharedDomain`). So the runner declares the map, this
 * walker is the joint, and acquiring a production importer stays a STOP rather than a refactor.
 *
 * ⛔ THE SECOND HALF THIS FILE HOLDS IS THE JOIN. A nested READ alone still leaves the DM's value
 * written at a literal leaf name, so unit 2 lands it at the DECLARED RECORD PATH of the entity the
 * root key NAMES, joined by the identity `src/domain/edit/recordRegister.js :: KEYED_COLLECTIONS`
 * declares (design §22.4's ruled identity: `institutions` by `name`, `npcs` by `id` — never a bare
 * `.id`, which 0 of 2,428 generated institutions carry). `powerStructure.factions` is the one
 * editable collection the register lists ATOMIC, and its own `CROSS_ENTRY_TOTALS` row says WHY —
 * the shares sum to 100 — not for want of a key. That one join is declared in the leaf and held
 * here against both registers.
 *
 * ⛔ THREE CONSTRUCTION RULES (packet §5.6), each with its own instrument:
 *   1. `it` and `describe` are bound EXACTLY ONCE each and never re-bound, not even as a callback
 *      parameter: the sovereignty-lighting census resolves an opener only where the module binds
 *      the word once, and a stray `(it) =>` parks the whole file.
 *   2. BOTH SETS ARE IMPORTED FROM THEIR PRODUCERS — the declaration through `getStepMeta()`, the
 *      register from its own module, the joins from the record register — and none is re-typed
 *      here. A local literal copy of a table is the shape
 *      `tests/lint/contractTestAntiVacuity.walker.test.js` Rule 2 convicts, and a re-typed set is
 *      how two instruments come to disagree while both report green.
 *   3. This file reads NO source, NO `dist` and spells NO repository root, so
 *      `tests/lint/moduleScopeCwdRatchet.test.js`'s banked population is unmoved by its arrival.
 *      It touches no census input and regenerates no register.
 *
 * AS OF THIS LANDING, MEASURED: the declaration is FOURTEEN keys carried by SEVEN of the twenty-two
 * registered steps, out of fifty-one distinct `provides` keys in the register. Those figures are
 * stated here as the measurement they are; the ARM is the both-directions equality, which follows a
 * lawful register change instead of convicting it.
 *
 * CANNOT-CATCH:
 * 1.  A DECLARED KEY NO REGISTERED STEP PROVIDES IS INVISIBLE TO BOTH DIRECTIONS. `getStepMeta()`
 *     computes each step's `recordPaths` by filtering that step's OWN `provides`, so a key in the
 *     runner's map that no step provides appears in no step's row, and the register side is built
 *     from `provides` keys too. The map can therefore carry a dead key forever and both sides stay
 *     equal. A1's equality is over LIVE choosers, never over the literal.
 * 2.  A key whose register row is MISSING ALTOGETHER reads as living at `record.<ctxKey>` and is
 *     read there. That is fail-closed — it is today's behaviour, unchanged — and it is not detected
 *     here; the register's own totality is
 *     `tests/lint/generationForkRegistry.contract.test.js`'s arm.
 * 3.  A2 drives the leaf through an INJECTED STUB roster, so it proves that `pinsFrom` reads the
 *     channel and obeys it; it does not prove the real roster's values, which is A1's half.
 * 4.  Nothing here asserts the CORPUS behaviour of the two cured cards. That an institution edit
 *     applies and lands its value, and that the faction card stops writing a key nothing reads, is
 *     `tests/property/dmLayerGoldenIsolation.test.js` territory; this file is the joint between
 *     three declarations.
 */
import { describe, expect, it } from 'vitest';

import { getStepMeta } from '../../src/generators/pipeline.js';
// Side-effect import: the step registry is populated by the entry point, not by pipeline.js.
// Without it `getStepMeta()` returns [] and every equality below would hold on nothing.
import '../../src/generators/generateSettlementPipeline.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { pinsFrom } from '../../src/domain/edit/dmLayer.js';
import { GENERATION_TIER1 } from '../../src/domain/generation/generationForkRegistry.js';
import { ATOMIC_COLLECTIONS, CROSS_ENTRY_TOTALS, KEYED_COLLECTIONS } from '../../src/domain/edit/recordRegister.js';
import { censusCorpus } from '../helpers/generationForkCensus.js';

/** The live roster length, the anti-vacuity floor every set equality here rests on. */
const REGISTERED_STEPS = 22;

/** The census corpus's own declared row count (EM-P2's 63): the floor A3's join figures rest on. */
const CENSUS_ROWS = 63;

/** The register's `provides` rows — the only half of Tier 1 a chooser's record path can be read from. */
const PROVIDES_ROWS = GENERATION_TIER1.filter((row) => row.via === 'provides');

/** Every register row that declares `key` as a chooser, at whatever step declares it. */
const providesRowsFor = (key) => PROVIDES_ROWS.filter((row) => row.key === key);

/**
 * THE REGISTER'S OWN ANSWER: a chooser needs a declared path exactly when it HAS `provides` rows
 * and every one of them records a recordPath that is a string OTHER than the identity
 * `record.<ctxKey>`. Spelled once, used by both arms and by the control.
 */
const registerNestsPath = (key) => {
  const rows = providesRowsFor(key);
  return rows.length > 0
    && rows.every((row) => typeof row.recordPath === 'string' && row.recordPath !== `record.${key}`);
};

/** The register's own record path for a key, as the SET of distinct paths its rows record. */
const registerPathsFor = (key) => [...new Set(providesRowsFor(key).map((row) => row.recordPath))];

/** A layer holding exactly the overrides given, at EM-C4a's own root-key spelling. */
const layerOf = (pairs) => ({ roots: Object.fromEntries(pairs), worldFacts: {}, minted: {}, phantoms: {} });

/** A one-field declaration consult, the shape `pinsFrom` takes as its third argument. */
const consultFor = (field, outputKey) => ({
  declarationsFor: (cardType) => (cardType === 'stub' ? [{ field, outputKey }] : []),
});

describe('EM-R1c — the chooser record-path declaration is the register, and the join is the record register', () => {
  it('A1 — EM-R1c: the runner\'s record-path map and the register\'s nested-path set are equal, and the register is a function', () => {
    const roster = getStepMeta();
    expect(roster, 'the roster is live, or every equality below holds on nothing')
      .toHaveLength(REGISTERED_STEPS);

    const declared = [...new Set(roster.flatMap((step) => Object.keys(step.recordPaths)))].sort();
    const fromRegister = [...new Set(roster.flatMap((step) => step.provides))]
      .filter(registerNestsPath)
      .sort();

    expect(declared.length, 'the declaration is empty: the runner reads every chooser at the top level again')
      .toBeGreaterThan(0);
    expect(fromRegister.length, 'the register names no nested chooser: the predicate broke')
      .toBeGreaterThan(0);
    // ⭐ THE ARM. A sorted-array equality is a set equality in BOTH directions: a key the runner
    // declares that the register does not nest, and a key the register nests that the runner
    // forgot, each red here by name.
    expect(declared, 'the runner\'s record-path map and the register\'s measurement disagree')
      .toEqual(fromRegister);

    // ⭐ THE SECOND ARM: the PATHS agree too, not only the key sets. A map that named the right
    // fourteen keys and read one of them at the wrong place would pass the equality above.
    /** The comparison itself, spelled ONCE so the control below runs the identical predicate. */
    const disagreementsIn = (rows) => rows.flatMap((step) => Object.entries(step.recordPaths)
      .filter(([key, path]) => {
        const registerPaths = registerPathsFor(key);
        return registerPaths.length !== 1 || registerPaths[0] !== path;
      })
      .map(([key, path]) => `${step.name}|${key}|runner=${path}|register=${JSON.stringify(registerPathsFor(key))}`));

    const declaredRows = roster.reduce((total, step) => total + Object.keys(step.recordPaths).length, 0);
    expect(declaredRows, 'the walk visited no declaration at all, so the list below is empty for the '
      + 'wrong reason').toBeGreaterThan(0);
    // ⭐ THE CONTROL FIRST: the SAME predicate over a roster whose one path is deliberately wrong
    // must convict it, so the emptiness below measures the declaration rather than a dead comparison.
    const planted = disagreementsIn([{ name: 'plantedStep', recordPaths: { generationRepairs: 'record.WRONG' } }]);
    expect(planted, 'the comparison cannot tell a wrong record path from the register\'s own')
      .toEqual(['plantedStep|generationRepairs|runner=record.WRONG|register=["record.generationCoherenceReceipt.repairs"]']);
    // anchored: the planted control above proves this exact predicate convicts a wrong path, and
    // the row count above proves it ran over a non-empty declaration.
    expect(disagreementsIn(roster), 'a declared key is read at a path the register does not record')
      .toEqual([]);

    // ⭐ (key -> recordPath) IS A FUNCTION OVER THE REGISTER: zero keys carry two paths. Without
    // this the map above could be a lossy choice between two lawful readings of one key.
    const registerKeys = [...new Set(PROVIDES_ROWS.map((row) => row.key))];
    expect(registerKeys.length, 'the register declares no provides key at all').toBeGreaterThan(declared.length);
    const multiPath = registerKeys.filter((key) => registerPathsFor(key).length > 1);
    // anchored: the line above proves the register's key population is non-empty and strictly
    // larger than the declared map, so this emptiness measures the register rather than a blank list.
    expect(multiPath, 'a chooser key carries TWO record paths: the map cannot be a function of it')
      .toEqual([]);

    // Every declaring step really carries one, so the union above is not assembled from an empty
    // roster of empty objects.
    const carriers = roster.filter((step) => Object.keys(step.recordPaths).length > 0).map((step) => step.name);
    expect(carriers.length, 'no registered step carries a nested chooser').toBeGreaterThan(0);
    expect(carriers.length, 'every step carries one, so the filter measured nothing')
      .toBeLessThan(roster.length);
  });

  it('A2 — EM-R1c: the leaf reads a NESTED record path through the injected handle, and is blind to it without the map', () => {
    // NO REAL REGISTRY AND NO GENERATION: a one-chooser stub step whose value lives NOT at
    // `record.alpha` but two levels down. That is the whole shape unit 1 turns on.
    const record = { nested: { alpha: { leaf: 'the record\'s own value' } } };
    const rosterWith = [{
      name: 'stubStep', provides: ['alpha'], transient: [], recordPaths: { alpha: 'record.nested.alpha' },
    }];
    const rosterWithout = [{ name: 'stubStep', provides: ['alpha'], transient: [], recordPaths: {} }];
    const consult = consultFor('leaf', 'alpha.leaf');
    const layer = layerOf([['stub:one:leaf', 'THE DM VALUE']]);

    const read = pinsFrom(record, layer, consult, { getStepMeta: () => rosterWith });
    expect(read.unapplied, 'a nested chooser still blocks the closure: the leaf is not reading the '
      + 'record path the roster declares').toEqual([]);
    expect(Object.keys(read.pins), 'the closure pins the nested chooser under its CTX KEY, never '
      + 'under its path').toEqual(['alpha']);
    expect(read.pins.alpha.leaf, 'the DM\'s value is written at the leaf inside the CLONE')
      .toBe('THE DM VALUE');
    expect(record.nested.alpha.leaf, 'the record itself was written through')
      .toBe('the record\'s own value');

    // ⭐ THE CONTROL: the identical roster with the declaration REMOVED refuses by name. A leaf
    // that stopped reading the channel reds on the arm above; a leaf that ignores the roster
    // entirely reds here, because the two calls would then agree.
    const blind = pinsFrom(record, layer, consult, { getStepMeta: () => rosterWithout });
    expect(Object.keys(blind.pins), 'without the declaration the closure must not be buildable')
      .toEqual([]);
    expect(blind.unapplied.map((row) => row.reason),
      'the undeclared run must refuse by the closed reason the leaf exports')
      .toEqual(['step_not_pinnable']);

    // ⭐ ABSENCE IS `Object.hasOwn` AT EVERY SEGMENT, NEVER TRUTHINESS: a declared path whose value
    // is `undefined` is HELD, and a path whose MIDDLE segment is missing is not.
    const undefinedValue = pinsFrom({ nested: { alpha: undefined } }, layerOf([]), consult,
      { getStepMeta: () => rosterWith });
    expect(Object.keys(undefinedValue.pins), 'a dormant layer pins nothing whatever the record holds')
      .toEqual([]);
    const missingSegment = pinsFrom({ nested: {} }, layer, consult, { getStepMeta: () => rosterWith });
    expect(missingSegment.unapplied.map((row) => row.reason),
      'a missing middle segment must read as NOT HELD, not as an empty object')
      .toEqual(['step_not_pinnable']);
  });

  it('A3 — EM-R1c: the entity join is the record register\'s own, and its field is present and unique on every corpus entry', () => {
    // ⭐ THE JOINS ARE IMPORTED, NEVER RE-TYPED: the two keyed collections from the record register,
    // the atomic one from this member's declaration, proved through the leaf rather than asserted
    // about a private symbol.
    expect(KEYED_COLLECTIONS.institutions, 'the register stopped declaring the institution join')
      .toBe('name');
    expect(KEYED_COLLECTIONS.npcs, 'the register stopped declaring the npc join').toBe('id');
    expect(ATOMIC_COLLECTIONS.includes('powerStructure.factions'),
      'the faction collection is no longer atomic, so this member\'s one declared row is stale')
      .toBe(true);
    expect(CROSS_ENTRY_TOTALS['powerStructure.factions'].field,
      'the register\'s own reason for the atomic row — a CROSS-ENTRY TOTAL, not a missing key')
      .toBe('power');

    // THE BEHAVIOURAL HALF: three stub records, one per collection, each entity found by ITS OWN
    // declared field. A leaf that joined on `.id` reaches no institution at all (0 of 2,428
    // generated institutions carry one), which is the defect unit 2 removes.
    const roster = [{
      name: 'stubStep',
      provides: ['institutions', 'npcs', 'powerStructure'],
      transient: [],
      recordPaths: {},
    }];
    const engine = { getStepMeta: () => roster };
    const record = {
      institutions: [{ name: 'Alpha Hall', state: 'stable' }, { name: 'Beta Hall', state: 'stable' }],
      npcs: [{ id: 'npc-1', status: 'active' }, { id: 'npc-2', status: 'active' }],
      powerStructure: { factions: [{ faction: 'The Alphas', power: 60 }, { faction: 'The Betas', power: 40 }] },
    };
    const landings = [];
    const refusals = [];
    for (const probe of [
      { collection: 'institutions', outputKey: 'institutions[].state', field: 'state', entity: 'Beta Hall',
        value: 'struggling', read: (pins) => pins.institutions.find((row) => row.name === 'Beta Hall').state },
      { collection: 'npcs', outputKey: 'npcs[].status', field: 'status', entity: 'npc-2',
        value: 'retired', read: (pins) => pins.npcs.find((row) => row.id === 'npc-2').status },
      { collection: 'powerStructure', outputKey: 'powerStructure.factions[].power', field: 'power',
        entity: 'The Betas', value: 25,
        read: (pins) => pins.powerStructure.factions.find((row) => row.faction === 'The Betas').power },
    ]) {
      const consult = consultFor(probe.field, probe.outputKey);
      const hit = pinsFrom(record, layerOf([[`stub:${probe.entity}:${probe.field}`, probe.value]]), consult, engine);
      landings.push(`${probe.collection}=${JSON.stringify(probe.read(hit.pins))}`);
      refusals.push(...hit.unapplied.map((row) => `${probe.collection}:${row.reason}`));
      // THE NEGATIVE CONTROL, per collection: the SAME edit under an entity id nothing carries must
      // refuse by name rather than write a literal key nobody reads.
      const stray = pinsFrom(record, layerOf([[`stub:no-such-entity:${probe.field}`, probe.value]]), consult, engine);
      refusals.push(...stray.unapplied.map((row) => `${probe.collection}-absent:${row.reason}`));
      landings.push(`${probe.collection}-strayKeys=${JSON.stringify(stray.pins).includes('[].')}`);
    }
    expect(landings, 'the DM\'s value did not land at the declared leaf of the NAMED entity of every '
      + 'collection, or a literal bracket key survived').toEqual([
      'institutions="struggling"', 'institutions-strayKeys=false',
      'npcs="retired"', 'npcs-strayKeys=false',
      'powerStructure=25', 'powerStructure-strayKeys=false',
    ]);
    expect(refusals, 'the three joins and their three absent-entity controls did not refuse exactly '
      + 'once each, by the closed reason').toEqual([
      'institutions-absent:unknown_key', 'npcs-absent:unknown_key', 'powerStructure-absent:unknown_key',
    ]);

    // ⭐ THE CORPUS HALF: the join field the register names is PRESENT and UNIQUE on every entry of
    // every row, so "the sole entry whose join equals the root key" is a total rule rather than a
    // lucky one. Collected first and asserted once (`seedLoopTotality`).
    const collections = [
      ['institutions', KEYED_COLLECTIONS.institutions, (world) => world.institutions],
      ['npcs', KEYED_COLLECTIONS.npcs, (world) => world.npcs],
      ['powerStructure.factions', 'faction', (world) => world.powerStructure.factions],
    ];
    const tally = new Map(collections.map(([name]) => [name, { rows: 0, sound: 0, entries: 0 }]));
    for (const row of censusCorpus()) {
      const { _seed: seed, ...config } = row;
      const world = generateSettlementPipeline(config, null, { seed, customContent: {} });
      for (const [name, field, read] of collections) {
        const entries = read(world);
        const cell = tally.get(name);
        cell.rows += 1;
        cell.entries += entries.length;
        const values = entries.map((entry) => entry[field]);
        const present = values.every((value) => typeof value === 'string' && value.length > 0);
        if (present && new Set(values).size === entries.length) cell.sound += 1;
      }
    }
    const measured = [...tally].map(([name, cell]) => `${name}:${cell.sound}/${cell.rows}`);
    expect([...tally].map(([, cell]) => cell.entries).every((count) => count > 0),
      'a collection carried no entry on any row, so its soundness below is a claim about nothing')
      .toBe(true);
    expect(measured, 'the declared join field is absent or repeated on some corpus row, so the '
      + 'sole-entry rule cannot be total').toEqual([
      `institutions:${CENSUS_ROWS}/${CENSUS_ROWS}`,
      `npcs:${CENSUS_ROWS}/${CENSUS_ROWS}`,
      `powerStructure.factions:${CENSUS_ROWS}/${CENSUS_ROWS}`,
    ]);
  }, 900_000);
});
