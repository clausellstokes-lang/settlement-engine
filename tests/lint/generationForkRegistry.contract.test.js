/**
 * generationForkRegistry.contract.test.js — EM-P2's STATIC ARMS.
 *
 * Three claims that need no pipeline run, and one capability that EM-A1 asked for.
 *
 *   A2  TOTALITY BY CONSTRUCTION — the register's `(step, key)` set equals the live registry's
 *       in BOTH directions, in the registry's own order. The denominator is DERIVED from
 *       `getStepMeta()` and `getStepOrder()` at run time, never transcribed, so a step added
 *       or a key renamed reds here rather than drifting past a hand-kept list.
 *   A3s EVERY DERIVED FIELD IS DERIVED, NOT AUTHORED — `class` from its two counts, and each
 *       landing class from its OWN triple, for all 75 rows and for both comparands. `class` is
 *       redundant with the counts BY DESIGN: the redundancy is what makes a hand-edited word
 *       impossible to hide.
 *   A8s TIER 2's STATIC HALF — every row's holding `(step, key)` exists in Tier 1 with
 *       `forkId === step`, and every `module#symbol` is DECLARED EXACTLY ONCE in its own file
 *       by the registerStep-aware resolver, which is proved on its own controls first.
 *
 * ⛔ WHY THE RESOLVER IS registerStep-AWARE, AND WHY THE ESTATE'S EXISTING ONE CANNOT SERVE.
 * `assembleInstitutions` is declared nowhere as a function or a const. It exists only as
 * `registerStep('assembleInstitutions', …)`, so a form set that knows only `function` and
 * `const` finds ZERO of the 22 steps and a register keyed on steps could not name its own
 * writers. The control below exercises that form set, quoted from
 * tests/lint/chooserTotality.walker.test.js, purely as a NEGATIVE CONTROL: the model's own
 * resolver answers the opposite question (which symbol ENCLOSES this offset) and is neither
 * copied nor used here.
 *
 * ⚠ THE SUBTLETY THE RESOLVER RESTS ON. `codeOnly` blanks string CONTENTS, so a step's own
 * name is gone from the blanked source. Offsets are preserved, so the name is read back from
 * the RAW source at the same index. A8s's guard-the-guard plants that case deliberately: a
 * name appearing ONLY in a line comment, ONLY in a quoted string, or ONLY inside a template
 * literal must NOT be counted, while a real `registerStep('actuallyHere', …)` and a real
 * `export function alsoHere()` both must be.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { getStepMeta, getStepOrder } from '../../src/generators/pipeline.js';
import '../../src/generators/generateSettlementPipeline.js';
import {
  GENERATION_BLIND_HALVES,
  GENERATION_CENSUS_ROWS,
  GENERATION_CHANNELS,
  GENERATION_TIER1,
  GENERATION_TIER2,
  tier1For,
  tier2For,
} from '../../src/domain/generation/generationForkRegistry.js';
import { declaredSymbols } from '../helpers/generationForkCensus.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const CHOOSER_WALKER = 'tests/lint/chooserTotality.walker.test.js';
/**
 * THE MODEL'S FORM SET, quoted from the walker above as a negative control and pinned to it,
 * so a control cannot go on describing a thing that changed. It knows `function` and `const`
 * and nothing else, which is exactly why it cannot name a registered step.
 */
const MODEL_DECL_LINE = 'const decl = /^(?:export\\s+)?(?:async\\s+)?function\\s+([A-Za-z_$][\\w$]*)'
  + '|^(?:export\\s+)?const\\s+([A-Za-z_$][\\w$]*)\\s*=/gm;';
const modelDeclaredSymbols = (raw) => {
  const decl = /^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)|^(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=/gm;
  const counts = new Map();
  for (const match of raw.matchAll(decl)) {
    const name = match[1] || match[2];
    counts.set(name, (counts.get(name) || 0) + 1);
  }
  return counts;
};
const sourceOf = (rel) => readFileSync(join(ROOT, rel), 'utf8');

/** The registry's OWN pair order: every step in run order, provides first, then new mutates. */
function registryPairs() {
  const meta = new Map(getStepMeta().map((entry) => [entry.name, entry]));
  const pairs = [];
  for (const step of getStepOrder()) {
    const entry = meta.get(step);
    const seen = new Set();
    for (const key of entry.provides) { pairs.push({ step, key, via: 'provides' }); seen.add(key); }
    for (const key of entry.mutates) if (!seen.has(key)) pairs.push({ step, key, via: 'mutates' });
  }
  return pairs;
}

const tallyOf = (rows, field) => rows.reduce((acc, row) => {
  acc[row[field]] = (acc[row[field]] || 0) + 1;
  return acc;
}, {});

describe('EM-P2 — the generation fork register: totality, derivation, and Tier 2 against source', () => {
  it('A2 — totality by construction: the register\'s pair set is the live registry\'s, in both directions and in its order', () => {
    const pairs = registryPairs();
    // ANTI-VACUITY FIRST: an empty registry would make every equality below trivially true.
    expect(pairs.length, 'the live registry produced no pairs').toBeGreaterThan(70);
    expect(getStepOrder().length, 'the live step order').toBe(22);

    expect(GENERATION_TIER1.length, 'the register declares one row per live pair').toBe(pairs.length);
    expect(GENERATION_TIER1.length, 'the measured denominator at this base').toBe(75);

    const declared = GENERATION_TIER1.map((row) => `${row.step}|${row.key}`);
    const live = pairs.map((pair) => `${pair.step}|${pair.key}`);
    expect(declared.filter((id) => !live.includes(id)), 'declared rows the registry does not produce').toEqual([]);
    expect(live.filter((id) => !declared.includes(id)), 'registry pairs the register does not declare').toEqual([]);
    // ORDER, not merely membership: getStepOrder()'s order, provides then mutates within a step.
    expect(declared, 'the register is out of registry order').toEqual(live);

    const viaMismatch = pairs
      .filter((pair, index) => GENERATION_TIER1[index].via !== pair.via)
      .map((pair) => `${pair.step}|${pair.key}: registry ${pair.via}`);
    expect(viaMismatch, 'a row\'s `via` disagrees with the registry').toEqual([]);
    expect(GENERATION_TIER1.filter((row) => row.via === 'provides').length, 'provides entries').toBe(57);
    expect(GENERATION_TIER1.filter((row) => row.via === 'mutates').length, 'mutates-only entries').toBe(18);

    // The accessors: a miss is `null` and `[]`, never `undefined` and never `null`.
    expect(tier1For('resolveConfig', 'tier'), 'tier1For hit').toBe(GENERATION_TIER1[0]);
    expect(tier1For('noSuchStep', 'noSuchKey'), 'tier1For miss is null, never undefined').toBeNull();
    expect(tier2For('npc', 'npcs[].name').length, 'tier2For is one-to-many').toBe(1);
    expect(tier2For('npc', 'no.such.key'), 'tier2For miss is [], never null').toEqual([]);
  });

  it('A3s — every derived field is derived: class from its counts, each landing class from its own triple, both comparands, all 75 rows', () => {
    expect(GENERATION_TIER1.length, 'anti-vacuity: the register is populated').toBeGreaterThan(70);
    expect(GENERATION_CENSUS_ROWS, 'the declared denominator').toBe(63);

    const problems = [];
    for (const row of GENERATION_TIER1) {
      const id = `${row.step}|${row.key}`;
      const expectedClass = row.keyMoves === 0 ? 'pure' : (row.stepDraws > 0 ? 'drawn' : 'label');
      if (row.class !== expectedClass) problems.push(`${id}.class: '${row.class}' but stepDraws ${row.stepDraws} / keyMoves ${row.keyMoves} derive '${expectedClass}'`);
      if (row.rows !== GENERATION_CENSUS_ROWS) problems.push(`${id}.rows: ${row.rows} is not GENERATION_CENSUS_ROWS`);
      if (row.stepDraws < 0 || row.stepDraws > row.rows) problems.push(`${id}.stepDraws ${row.stepDraws} is outside 0..${row.rows}`);
      if (row.keyMoves < 0 || row.keyMoves > row.rows) problems.push(`${id}.keyMoves ${row.keyMoves} is outside 0..${row.rows}`);
      for (const [triple, label] of [['onRecord', 'onRecordClass'], ['producedOnRecord', 'producedOnRecordClass']]) {
        const counts = row[triple];
        const sum = counts.absent + counts.same + counts.transformed;
        if (sum !== row.rows) problems.push(`${id}.${triple} sums to ${sum}, not ${row.rows}`);
        const derived = counts.absent === row.rows ? 'absent'
          : counts.same === row.rows ? 'same'
            : counts.transformed === row.rows ? 'transformed' : 'varies';
        if (row[label] !== derived) problems.push(`${id}.${label}: '${row[label]}' but ${triple} ${JSON.stringify(counts)} derives '${derived}'`);
      }
      // ABSENCE, EXACTLY: null when and only when the final comparand never lands, never ''.
      if (row.onRecordClass === 'absent' && row.recordPath !== null) problems.push(`${id}.recordPath is ${JSON.stringify(row.recordPath)} on an 'absent' row`);
      if (row.onRecordClass !== 'absent' && (typeof row.recordPath !== 'string' || row.recordPath.length === 0)) {
        problems.push(`${id}.recordPath is ${JSON.stringify(row.recordPath)} on a '${row.onRecordClass}' row`);
      }
      if (Object.prototype.hasOwnProperty.call(row, 'producedPath')) problems.push(`${id} carries a producedPath: one recordPath serves both triples (VF-20)`);
      if (!Object.isFrozen(row)) problems.push(`${id} is not frozen`);
      if (!Object.isFrozen(row.onRecord)) problems.push(`${id}.onRecord is not frozen`);
      if (!Object.isFrozen(row.producedOnRecord)) problems.push(`${id}.producedOnRecord is not frozen`);
    }
    expect(problems, `derived fields that do not follow from their own numbers:\n${problems.join('\n')}`).toEqual([]);

    expect(Object.isFrozen(GENERATION_TIER1), 'GENERATION_TIER1 is frozen').toBe(true);
    expect(Object.isFrozen(GENERATION_TIER2), 'GENERATION_TIER2 is frozen').toBe(true);
    expect(Object.isFrozen(GENERATION_BLIND_HALVES), 'GENERATION_BLIND_HALVES is frozen').toBe(true);
    expect(Object.isFrozen(GENERATION_CHANNELS), 'GENERATION_CHANNELS is frozen').toBe(true);

    expect(tallyOf(GENERATION_TIER1, 'class'), 'the entropy tally').toEqual({ drawn: 28, label: 1, pure: 46 });
    expect(GENERATION_TIER1.filter((row) => row.class === 'label').map((row) => `${row.step}|${row.key}`),
      'the single label row: a key that moves under a zero-draw step').toEqual(['generatePower|powerIntent']);
    expect(tallyOf(GENERATION_TIER1, 'onRecordClass'), 'the FINAL comparand tally')
      .toEqual({ absent: 19, same: 35, transformed: 15, varies: 6 });
    expect(tallyOf(GENERATION_TIER1, 'producedOnRecordClass'), 'the POST-STEP comparand tally')
      .toEqual({ absent: 27, same: 18, transformed: 15, varies: 15 });

    // §6.2b: the register carries both comparands BECAUSE eighteen rows disagree, and every
    // one of them is a key a LATER step rewrites. The set is derived from the register itself.
    const disagreeing = GENERATION_TIER1
      .filter((row) => row.onRecordClass !== row.producedOnRecordClass)
      .map((row) => `${row.step}|${row.key}`);
    process.stdout.write(`\n[A3s] the two comparands disagree on ${disagreeing.length} rows: ${disagreeing.join(', ')}\n`);
    expect(disagreeing.length, 'the disagreement count is the register\'s reason for carrying both').toBe(18);
    expect(GENERATION_TIER1.filter((row) => row.key === 'effectiveConfig'
      && row.onRecordClass === 'same' && row.producedOnRecordClass === 'absent').length,
    'the seven effectiveConfig rows: the config IS on the record, and no writer handed it there').toBe(7);

    // The blind halves are declared, not implied: each carries a statement and what refutes it.
    expect(GENERATION_BLIND_HALVES.map((half) => half.id), 'the declared blind halves')
      .toEqual(['field-rootness', 'hash-channel', 'corpus-ceiling', 'second-seedrandom-importer']);
    const thin = GENERATION_BLIND_HALVES.filter((half) => !half.statement || !half.refutableBy
      || half.statement.length < 40 || half.refutableBy.length < 20).map((half) => half.id);
    expect(thin, 'a blind half that states nothing refutable is a blind half in name only').toEqual([]);
  });

  it('A8s — Tier 2 against source: every holding pair is a Tier-1 row, and every module#symbol is declared exactly once', () => {
    expect(GENERATION_TIER2.length, 'the declared Tier-2 rows').toBe(10);

    // ── GUARD THE GUARD, FIRST. Nothing below means anything until the resolver is proved.
    const steps = getStepMeta().map((entry) => entry.name);
    expect(steps.length, 'anti-vacuity: the live step list').toBe(22);
    const ourHits = [];
    const modelHits = [];
    for (const step of steps) {
      const raw = sourceOf(`src/generators/steps/${step}.js`);
      if ((declaredSymbols(raw).get(step) || 0) === 1) ourHits.push(step);
      if ((modelDeclaredSymbols(raw).get(step) || 0) === 1) modelHits.push(step);
    }
    expect(ourHits.length, 'every registered step is declared exactly once in its own step file').toBe(22);
    expect(modelHits, 'the model\'s form set cannot name a registerStep host, which is why this resolver exists').toEqual([]);
    expect(sourceOf(CHOOSER_WALKER), `${CHOOSER_WALKER} no longer spells the form set this control quotes`)
      .toContain(MODEL_DECL_LINE);

    // A module-local const arrow that is never exported: EM-A1 §1c.1 property 2's own case, and
    // the reason this resolver is the CAPABILITY EM-A1 asked for rather than an export scan.
    expect(declaredSymbols(sourceOf('src/generators/npcGenerator.js')).get('pickFirst'),
      'pickFirst is module-local and never exported').toBe(1);
    expect(declaredSymbols(sourceOf('src/generators/power/rulingStructure.js')).get('generatePowerStructure'),
      'generatePowerStructure is an export const').toBe(1);
    expect(declaredSymbols(sourceOf('src/generators/steps/generatePower.js')).has('generatePowerX'),
      'a symbol that does not exist must resolve to nothing').toBe(false);
    expect(declaredSymbols(sourceOf('src/generators/npcGenerator.js')).has('pickSecond'),
      'a symbol that does not exist must resolve to nothing').toBe(false);

    // THE PLANTED PROBE: prose can never manufacture a declaration, and a real one is found.
    const probe = [
      '// const ghostInComment = 1;',
      "const real = 'const ghostInString = 2;';",
      'const realTwo = `registerStep(\'ghostInTemplate\', {`;',
      "registerStep('actuallyHere', {",
      '  provides: [],',
      '}, () => {});',
      'export function alsoHere() {}',
    ].join('\n');
    const planted = declaredSymbols(probe);
    expect(planted.get('actuallyHere'), 'a real registerStep host is declared').toBe(1);
    expect(planted.get('alsoHere'), 'a real export function is declared').toBe(1);
    expect(planted.has('ghostInComment'), 'a name in a line comment is not a declaration').toBe(false);
    expect(planted.has('ghostInString'), 'a name in a quoted string is not a declaration').toBe(false);
    expect(planted.has('ghostInTemplate'), 'a name in a template literal is not a declaration').toBe(false);

    // ── ARM B: every holding pair is a Tier-1 row, and the fork id IS the step name.
    const problems = [];
    for (const row of GENERATION_TIER2) {
      const id = `${row.cardShape}|${row.outputKey}`;
      if (!tier1For(row.step, row.key)) problems.push(`${id}: holding pair ${row.step}|${row.key} is not a Tier-1 row`);
      if (row.forkId !== row.step) problems.push(`${id}: forkId '${row.forkId}' is not the step name '${row.step}'`);
      if (!['drawn', 'computed'].includes(row.origin)) problems.push(`${id}: origin '${row.origin}' is neither drawn nor computed`);
      if (Object.prototype.hasOwnProperty.call(row, 'producer')) problems.push(`${id} carries a producer column (STOP-9)`);
      if (Object.prototype.hasOwnProperty.call(row, 'editable')) problems.push(`${id} carries an editable field (STOP-8)`);
      if (!Object.isFrozen(row)) problems.push(`${id} is not frozen`);
      // ── ARM D: the declared writer names a symbol DECLARED EXACTLY ONCE in its own file.
      const count = declaredSymbols(sourceOf(row.module)).get(row.symbol) || 0;
      if (count !== 1) problems.push(`${id}: ${row.module}#${row.symbol} is declared ${count} times, not once`);
    }
    expect(problems, `Tier-2 rows that do not resolve against source:\n${problems.join('\n')}`).toEqual([]);

    // ORDER: cardShape order institution, npc, faction, powerSeat, then §6.5's table order.
    const shapeOrder = ['institution', 'npc', 'faction', 'powerSeat'];
    const seenShapes = [...new Set(GENERATION_TIER2.map((row) => row.cardShape))];
    expect(seenShapes, 'the Tier-2 card-shape order').toEqual(shapeOrder);
    expect(GENERATION_TIER2.map((row) => row.cardShape),
      'the rows are grouped by card shape, never interleaved')
      .toEqual(seenShapes.flatMap((shape) => GENERATION_TIER2.filter((row) => row.cardShape === shape).map(() => shape)));
    expect(GENERATION_TIER2.filter((row) => row.origin === 'computed').length,
      'five rows are computed, and all ten stay editable: origin is recorded, never a gate').toBe(5);
  });
});
