/**
 * nameHeldThroughAssembly.test.js — EM-R4's acceptance battery (A1-A7).
 *
 * THE BEHAVIOUR. The settlement's NAME is a HELD fact. `assembleSettlement` mints it exactly as
 * it does today — the same expression, the same place, the same two draws on the step's SHARED
 * ambient stream, the same `customName` short-circuit — and then consults the runner's pin
 * channel for `name` over the ALREADY-MINTED value. With no pin the consult returns that value
 * and nothing moves (A1). With a pin the minted value is DISCARDED while its draws stay spent,
 * so the record reproduces byte for byte under its own name (A3) and only the five leaves that
 * speak the name follow a changed one (A4). The F8 stress re-render speaks `settlement.name`, so
 * no persisted summary can name a town the record does not carry.
 *
 * ⭐ WHY CONSUME AND DISCARD, AND NOT A SKIP (design §22.1 correction 1; §22.2 ruling 11). The
 * mint's two draws land on the ASSEMBLY STEP'S OWN ambient stream, which the pressure sentence
 * and the arrival scene read one to three draws later — not on a named child stream of its own,
 * which is the only place §22.1 admits a skip. A2 prices that: `chooseOrPin` does not advance the
 * stream when a pin is present, so a consult WRAPPING the mint would spend zero where the mint
 * spends two, and the step's whole later phase moves. A3 is the arm that convicts it, and a
 * golden-neutrality arm alone would pass all three candidate placements (§9a).
 *
 * ⭐ WHY THE BAG IS HANDED TO THE RUNNER AND NOT BUILT BY `dmLayer :: pinsFrom`. `pinsFrom`
 * builds its bag from the STEP roster's `provides` closure, and `name` is no step's `provides`
 * (`heldKeyWriterCensus.walker.test.js :: STEP_ROSTER` carries no `name` row), so no `rederive`
 * call can carry a `name` pin today — which is also why the runner's partial-pin refusal cannot
 * fire on a `{ name }` bag. A rename is not re-derivation at all: it travels the cascade
 * (design §12.3) and is EM-R6's. These arms therefore drive the REAL registered pipeline through
 * the runner's own pins option, which is the channel EM-R6 will hand the name down.
 *
 * ⛔ FOUR CONSTRUCTION RULES (packet §9b):
 *   1. `it`, `test` and `describe` are bound EXACTLY ONCE each and never re-bound, not even as an
 *      arrow parameter: the sovereignty-lighting census parks a whole file for that alone.
 *      Registration is straight-line — seven literal `it`s under ONE literal `describe`.
 *   2. Every asserted set is IMPORTED from its producer (`RECORD_CLASSES`, `censusCorpus`,
 *      `goldenCorpus`, `chooseOrPin`) and every record is DERIVED by running the real generator,
 *      never a local literal copy (`tests/lint/contractTestAntiVacuity.walker.test.js` Rule 2).
 *   3. No bare seed loop: a loop COLLECTS and the arm asserts once outside it
 *      (`tests/lint/seedLoopTotality.walker.test.js`).
 *   4. The mint is never IMPORTED here. Its two draws are priced at the STEP, through the
 *      `customName` short-circuit that makes the call vanish, so this file becomes the first test
 *      importer of nothing (judgment 148).
 *
 * ⚠ A1 AND A7 ARE WRITTEN-CONTRACT ARMS (§P6): their claims hold at the base, so each carries its
 * own measured counterforce inside the arm rather than a red-first. A2, A3, A4, A5 and A6 are RED
 * against the unedited step.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { chooseOrPin } from '../../src/generators/pipeline.js';
import { RECORD_CLASSES } from '../../src/domain/edit/recordRegister.js';
import { censusCorpus, instrumentedRoot, runHeadless as runCorpusRow } from '../helpers/generationForkCensus.js';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';

const GOLDEN_MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'generator-golden-master.json');
const ASSEMBLY_STEP = 'assembleSettlement';
const ASSEMBLY_FILE = resolve(process.cwd(), 'src', 'generators', 'steps', 'assembleSettlement.js');
/** The record path this member holds. Read from the register in A6, spelled here for the bags. */
const NAME_KEY = 'name';
/** A placename the generator's own vocabulary cannot mint, so a record carrying it was PINNED. */
const HELD_NAME = 'EM-R4 Held Placename';
/** The custom name A5 forces through `effectiveConfig.customName`, which suppresses the mint. */
const CUSTOM_NAME = 'EM-R4 Custom Placename';
/** The mint's own price on the step's ambient stream: a prefix index and a suffix index. It is a
 *  FLOOR on the deficit a skipped mint leaves, never an equality: removing two draws re-phases
 *  the shared stream, and on some rows a later assembly writer then takes a different branch. */
const MINT_DRAWS = 2;
/** The mint's call site, byte for byte. A5 reads it to refute the in-mint placement at source. */
const MINT_EXPRESSION = 'const settlementName = (effectiveConfig.customName?.trim()) || generateSettlementName(culture);';
/** The three tiers A5 drives the short-circuit on. */
const CUSTOM_TIERS = ['village', 'town', 'city'];
/** The base A5's three rows are built from; the corpus's own base config, one tier at a time. */
const CUSTOM_BASE = {
  culture: 'germanic',
  terrainOverride: 'plains',
  tradeRouteAccess: 'road',
  monsterThreat: 'civilized',
  _seed: 'em-r4-custom-name',
};
/**
 * THE FIVE LEAF PATHS A HELD NAME REACHES, as top-level record keys. `stress` and `stressors` are
 * the dual-written containers whose entries carry a re-rendered `summary`; `pressureSentence` and
 * `arrivalScene` are readings that speak the name (§22 ruling 2). A4 holds the moved set to a
 * SUBSET of these and every other top-level key byte-identical.
 */
const NAME_SPEAKING_KEYS = Object.freeze(['arrivalScene', 'name', 'pressureSentence', 'stress', 'stressors']);

/** The golden master's own hash, spelled exactly as `generatorGoldenMaster.test.js` spells it. */
function hashFor(config) {
  const { _seed, ...cfg } = config;
  const settlement = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  return createHash('sha256').update(JSON.stringify(settlement)).digest('hex');
}

/** One census row run through the REAL registry, instrumented, with an optional pins bag. */
function runRow(row, options = {}) {
  const instrument = instrumentedRoot(row._seed);
  const ctx = runCorpusRow(row, instrument.root, options);
  return { ctx, record: ctx.settlement, step: instrument.perStep.get(ASSEMBLY_STEP), instrument };
}

/** Every top-level key of `before` whose serialisation `after` does not reproduce. */
function movedKeys(before, after) {
  return Object.keys(before)
    .filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]))
    .sort();
}

describe('EM-R4 — the settlement name is held through assembly', () => {
  it('A1 — EM-R4: inert with no pins: the golden corpus and an empty bag leave every byte where it was', () => {
    // (1) THE COMMITTED FIXTURE is the authority: a stride of the golden master's own corpus,
    // hashed the way `generatorGoldenMaster.test.js` hashes it. A byte this member moved on the
    // unpinned path reds here.
    const rows = goldenCorpus();
    const manifest = JSON.parse(readFileSync(GOLDEN_MANIFEST, 'utf-8'));
    const stride = Math.max(1, Math.floor(rows.length / 40));
    const moved = [];
    let checked = 0;
    for (let index = 0; index < rows.length; index += stride) {
      const row = rows[index];
      checked += 1;
      if (manifest[keyOf(row)] !== hashFor(row)) moved.push(keyOf(row));
    }
    expect(checked).toBeGreaterThanOrEqual(40);
    expect(moved, 'a golden row moved with no pin bag anywhere').toEqual([]);

    // (2) AN EMPTY BAG IS THE UNPINNED PATH, at the runner. `chooseOrPin` consults own-presence,
    // so `{}` carries no `name` and the consult returns the minted value untouched.
    const row = censusCorpus()[0];
    const plain = runRow(row);
    const empty = runRow(row, { pins: {} });
    expect(Object.keys(empty.ctx)).toEqual(Object.keys(plain.ctx));
    expect(JSON.stringify(empty.record)).toBe(JSON.stringify(plain.record));
    expect(empty.step.draws, 'an empty bag moved the assembly step off its draw position')
      .toBe(plain.step.draws);

    // (3) THE COUNTERFORCE (§P6). This arm's claim holds at the base, so the instrument itself is
    // proved live rather than red-first: a row hashed under a DIFFERENT seed must NOT match the
    // manifest's entry. An instrument that reported "unmoved" for everything would red here.
    const control = hashFor({ ...rows[0], _seed: `${rows[0]._seed}-em-r4-control` });
    expect(control === manifest[keyOf(rows[0])],
      'the counterforce is vacuous: the golden instrument cannot see a moved row').toBe(false);
  }, 600_000);

  it('A2 — EM-R4: the draws are CONSUMED: a held name leaves the step on its exact draw position', () => {
    const rows = censusCorpus();
    expect(rows, 'the census corpus is the floor every figure here rests on').toHaveLength(63);

    // COLLECT, THEN ASSERT ONCE: a bare per-row expect is the shape seedLoopTotality convicts.
    const tally = { rows: 0, live: 0, parity: 0, took: 0, threw: 0, drifted: [] };
    for (const row of rows) {
      tally.rows += 1;
      const plain = runRow(row);
      // ANTI-VACUITY, PER ROW: the unpinned step really does draw, so "the same count" below is
      // a measurement of a live stream and not of two silent ones.
      if (plain.step.draws > 0) tally.live += 1;
      let held = null;
      try {
        held = runRow(row, { pins: { [NAME_KEY]: plain.record.name } });
      } catch {
        tally.threw += 1;
      }
      if (held === null) continue;
      if (held.step.draws === plain.step.draws) tally.parity += 1;
      else tally.drifted.push(`${keyOf(row)}: ${plain.step.draws} -> ${held.step.draws}`);
      // THE TAKENNESS HALF, and it is what makes this arm RED against the unedited step: the same
      // channel with an ALTERED name must reach the record. Without it, "the counts agree" is
      // true of a step that ignores the bag entirely.
      const altered = runRow(row, { pins: { [NAME_KEY]: HELD_NAME } });
      if (altered.record.name === HELD_NAME) tally.took += 1;
    }
    expect(tally.rows).toBe(63);
    expect(tally.live, 'the unpinned assembly step drew nothing: every count below is vacuous').toBe(63);
    expect(tally.threw, 'a `{ name }` bag threw: `name` is no step\'s `provides`, so the runner\'s partial-pin refusal must not fire').toBe(0);
    expect(tally.drifted, 'a held name moved the assembly step off its unpinned draw count').toEqual([]);
    expect(tally.parity, 'the step consumed its mint draws on every row').toBe(63);
    expect(tally.took, 'the held name never reached the record: the consult is not wired').toBe(63);

    // THE PRICE OF THE SKIP, THROUGH THE REAL PRIMITIVE. `chooseOrPin` does not call its draw
    // thunk when the key is own-present, so a consult WRAPPING the mint spends zero draws.
    const calls = { pinned: 0, unpinned: 0 };
    const pinnedValue = chooseOrPin({ [NAME_KEY]: HELD_NAME }, NAME_KEY, () => { calls.pinned += 1; return 'MINTED'; });
    const unpinnedValue = chooseOrPin({}, NAME_KEY, () => { calls.unpinned += 1; return 'MINTED'; });
    expect([pinnedValue, unpinnedValue]).toEqual([HELD_NAME, 'MINTED']);
    expect(calls, 'the primitive advanced the stream under a pin, or refused to draw without one')
      .toEqual({ pinned: 0, unpinned: 1 });

    // AND THE MINT'S OWN PRICE AT THE STEP, measured where the call vanishes: with `customName`
    // set the mint is never called and the step's ambient stream reads FEWER draws. The floor is
    // the mint's own two; the deficit is never smaller and is often larger, because a re-phased
    // shared stream sends later assembly writers down different variable-draw branches (§0.B).
    // That deficit IS what a consult wrapping the mint would spend nowhere.
    const first = censusCorpus()[0];
    const withoutMint = runRow({ ...first, customName: CUSTOM_NAME });
    const withMint = runRow(first);
    expect(withMint.step.draws - withoutMint.step.draws,
      'the mint costs the step nothing, so a skip placement would be free').toBeGreaterThanOrEqual(MINT_DRAWS);
  }, 900_000);

  it('A3 — EM-R4: the record REPRODUCES under its own name, on every census row', () => {
    const rows = censusCorpus();
    const tally = { rows: 0, reproduced: 0, threw: 0, took: 0, diverged: [] };
    for (const row of rows) {
      tally.rows += 1;
      const plain = runRow(row);
      const before = JSON.stringify(plain.record);
      let held = null;
      try {
        held = runRow(row, { pins: { [NAME_KEY]: plain.record.name } });
      } catch {
        tally.threw += 1;
      }
      if (held !== null) {
        if (JSON.stringify(held.record) === before) tally.reproduced += 1;
        else tally.diverged.push(`${keyOf(row)}: ${movedKeys(plain.record, held.record).join(',')}`);
      }
      // THE CONTROL THAT MAKES THE REPRODUCTION A MEASUREMENT. A step that ignored the bag would
      // reproduce the record trivially, so the same channel is driven with a name the generator
      // cannot mint: it must reach the record on the same row.
      const altered = runRow(row, { pins: { [NAME_KEY]: HELD_NAME } });
      if (altered.record.name === HELD_NAME) tally.took += 1;
    }
    expect(tally.rows).toBe(63);
    expect(tally.threw, 'a bag holding only `name` threw inside the runner').toBe(0);
    expect(tally.diverged, 'the record did not reproduce under its own name: the draws were not consumed').toEqual([]);
    expect(tally.reproduced, 'the record reproduces under its own name on every row').toBe(63);
    expect(tally.took, 'the control is vacuous: the pin never reached the record, so the reproduction above is the empty claim').toBe(63);
  }, 900_000);

  it('A4 — EM-R4: the pin is TAKEN and only what speaks the name moves', () => {
    const rows = censusCorpus();
    const tally = {
      rows: 0, named: 0, outsideTheFive: [], others: new Set(), perKey: {}, otherKeyCounts: new Set(),
    };
    for (const row of rows) {
      tally.rows += 1;
      const plain = runRow(row);
      const held = runRow(row, { pins: { [NAME_KEY]: HELD_NAME } });
      if (held.record.name === HELD_NAME) tally.named += 1;
      const moved = movedKeys(plain.record, held.record);
      for (const key of moved) {
        tally.perKey[key] = (tally.perKey[key] || 0) + 1;
        if (!NAME_SPEAKING_KEYS.includes(key)) tally.outsideTheFive.push(`${keyOf(row)}:${key}`);
      }
      const others = Object.keys(plain.record).filter((key) => !NAME_SPEAKING_KEYS.includes(key));
      tally.otherKeyCounts.add(others.length);
      for (const key of others) tally.others.add(key);
    }
    expect(tally.rows).toBe(63);
    expect(tally.named, 'the held name did not reach the record on every row').toBe(63);
    expect(tally.outsideTheFive, 'a record key that does not speak the name moved under a held name').toEqual([]);
    // ANTI-VACUITY: the blast radius is not the empty set, and the name itself is always in it.
    expect(tally.perKey[NAME_KEY], 'the name key itself never moved: the arm measured nothing').toBe(63);
    expect(Object.keys(tally.perKey).length, 'more than the name moved, which is the point of the five').toBeGreaterThan(1);
    // THE OTHER KEYS ARE A STABLE 36 ON EVERY ROW, and every one of them is byte-identical.
    expect([...tally.otherKeyCounts], 'the record\'s top-level key count is not uniform across the corpus').toEqual([36]);
    expect(tally.others.size).toBe(36);
  }, 900_000);

  it('A5 — EM-R4: the customName short-circuit keeps the held name, where an in-mint consult loses it', () => {
    // (1) THE IN-MINT PLACEMENT IS REFUTED AT THE SOURCE (§0.C item 1). The mint is the RIGHT
    // operand of `||`, behind the trimmed custom name, so on the custom path it is never
    // EVALUATED — and a consult placed inside `generateSettlementName` runs nowhere. This is the
    // `requiredSymbols` text of the member's own contract, read from the step it governs.
    const stepSource = readFileSync(ASSEMBLY_FILE, 'utf-8');
    expect(stepSource, 'the mint is no longer short-circuited by the custom name').toContain(MINT_EXPRESSION);

    const priced = [];
    const custom = [];
    const held = [];
    for (const settType of CUSTOM_TIERS) {
      const row = { ...CUSTOM_BASE, settType };
      const plain = runRow(row);
      const named = runRow({ ...row, customName: CUSTOM_NAME });
      priced.push([settType, plain.step.draws - named.step.draws]);
      custom.push([settType, named.record.name]);
      const pinned = runRow({ ...row, customName: CUSTOM_NAME }, { pins: { [NAME_KEY]: HELD_NAME } });
      held.push([settType, pinned.record.name]);
    }
    // (2) THE SHORT-CIRCUIT IS LIVE: the custom name wins the record on every tier...
    expect(custom).toEqual(CUSTOM_TIERS.map((settType) => [settType, CUSTOM_NAME]));
    // ...and the absent call is visible on the step's own stream, at least the mint's two draws
    // (more where the re-phasing moves a later variable-draw branch — §0.B).
    expect(priced.filter(([, delta]) => delta < MINT_DRAWS),
      'the mint still drew on the customName path, so the in-mint refutation is vacuous').toEqual([]);

    // (3) AND THE HELD NAME STILL WINS, 3/3 — which an in-mint consult could not do on this path.
    expect(held, 'a held name lost to a custom name: the consult sits where the mint short-circuits it')
      .toEqual(CUSTOM_TIERS.map((settType) => [settType, HELD_NAME]));
  }, 600_000);

  it('A6 — EM-R4: the class register is the source: the pin key is imported, never re-typed', () => {
    // THE KEY IS READ FROM THE REGISTER (`recordRegister.js`, EM-R0a), never spelled by this arm.
    const heldKeys = Object.keys(RECORD_CLASSES).filter((key) => RECORD_CLASSES[key] === 'HELD');
    // ANTI-VACUITY FIRST: an empty denominator would make the membership below meaningless.
    expect(heldKeys.length, 'the register declares no HELD key at all').toBeGreaterThan(0);
    expect(heldKeys).toContain(NAME_KEY);
    expect(RECORD_CLASSES.name).toBe('HELD');

    const registerKey = heldKeys.find((key) => key === NAME_KEY);
    const row = censusCorpus()[0];
    const plain = runRow(row);
    const byRegister = runRow(row, { pins: { [registerKey]: HELD_NAME } });
    expect(byRegister.record.name, 'the register-named key did not reach the consult').toBe(HELD_NAME);

    // THE PERTURBED-INPUT COUNTERFORCE (§P6): a bag keyed on a NON-held neighbour of the same
    // record leaves the minted name standing, so the line above is about THIS key.
    const perturbed = runRow(row, { pins: { [`${registerKey}-not-a-record-path`]: HELD_NAME } });
    expect(perturbed.record.name, 'any key at all drove the consult: the register reading is vacuous')
      .toBe(plain.record.name);
  }, 600_000);

  it('A7 — EM-R4: no new stream and no new fork: the step keeps its own ambient stream', () => {
    // (1) THE STEP MINTS NO ROOT. A consume-and-discard uses the stream the step already has, so
    // the entropy census's `createPRNG(` count for this file stays at zero.
    const stepSource = readFileSync(ASSEMBLY_FILE, 'utf-8');
    expect(stepSource.match(/createPRNG\(/g), 'the assembly step minted a PRNG root of its own').toBeNull();
    // LIVENESS: the file really is the assembly step, so the null above is a property of ITS text.
    expect(stepSource).toContain("registerStep('assembleSettlement', {");

    // (2) THE FORK LABELS ARE SET-EQUAL under a held name: no child stream appears or retires.
    const row = censusCorpus()[0];
    const plain = runRow(row);
    const held = runRow(row, { pins: { [NAME_KEY]: HELD_NAME } });
    const plainLabels = [...plain.step.forkLabels].sort();
    const heldLabels = [...held.step.forkLabels].sort();
    // ANTI-VACUITY: the step DOES fork children, so two equal lists are not two empty ones.
    expect(plainLabels.length, 'the assembly step forked nothing: the equality below is vacuous')
      .toBeGreaterThan(0);
    expect(heldLabels, 'a child stream appeared or retired under a held name').toEqual(plainLabels);

    // (3) THE COUNTERFORCE (§P6): the recorder CAN see a different label set, so the equality
    // above is a measurement. Another step's forks are a different list on the same run.
    const population = plain.instrument.perStep.get('generatePopulation');
    expect(population, 'the run this arm reads did not reach the population step').toBeDefined();
    expect(JSON.stringify([...population.forkLabels].sort()) === JSON.stringify(plainLabels),
      'the counterforce is vacuous: every step reports the same fork labels').toBe(false);
  }, 600_000);
});
