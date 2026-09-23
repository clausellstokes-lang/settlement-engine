/**
 * opGuardCoverage.walker.test.js — THE OP GUARD-COVERAGE WALKER (EM-B1b, cases C5 to C8;
 * design §6 instrument 3, §12.8; ARCH §5 and §8.3).
 *
 * THE LAW. Every op type in the composed catalogue declares its guard coverage, and says so
 * even when the coverage is EMPTY: ARCH §5's *"stated when empty"*. Unfinished coverage can
 * therefore never be silent — it is a declared `guards: []` with a written `guardsStated`,
 * visible to this walker, and EM-C3's population will move it where anyone can see.
 *
 * THE PARTITION HAS TWO HALVES AND THEY ARE MEASURED SEPARATELY, which is the whole point:
 * DISCOVERED is a SOURCE SCAN over the catalogue's own authored row keys, and DECLARED is
 * the loaded catalogue's rows that really declare coverage. Asserting them SET-EQUAL in both
 * directions catches the two failures a single-sided check cannot: a row authored into the
 * catalogue with no coverage declaration (an unregistered type), and a coverage entry left
 * standing after its row was deleted (a stale row). This is HB-1's shape
 * (`tests/lint/chooserTotality.walker.test.js`), taken deliberately rather than re-invented.
 *
 * ⭐ THE SCAN ROSTER IS DERIVED, NEVER LISTED. The catalogue is a composition of frozen maps:
 * `operations.js` authors its own rows inline and SPREADS the rest in from sibling leaves. So
 * the modules this walker reads are read OUT of `operations.js` — every spread name inside the
 * `OP_TYPES` literal, resolved through that file's own import list. A leaf added tomorrow joins
 * the scan on the day its spread lands, and a totality walker whose roster misses a whole
 * module does not report a gap, it reports SUCCESS.
 *
 * ⛔ §12.8 BITES ONLY ON A DECLARED RULE, of which there are ZERO at this wave, so C7 pins
 * that as the CURRENT STATE with its reason rather than asserting a vacuous absence: a
 * declared entry that is not a function reds, and a populated roster under a sentence still
 * claiming that no guard is wired reds. The rules themselves are EM-C3's; none is authored here.
 *
 * ⛔ THE MUTANTS DRIVE THE LIVE PREDICATE, never a re-implementation of it. Each one is a
 * SPREAD COPY of the real catalogue with one row bent, handed to the same `coverageProblems`
 * and `declaredKeys` the live arms call, so a detector that silently stopped detecting cannot
 * pass this file. No file on disk is mutated by any arm here.
 *
 * @enforced-by itself (a source scan plus a catalogue query; no runtime coupling)
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { commentsOnly } from '../helpers/codeOnlySource.js';
import { compareCodepoint } from '../../src/domain/deterministicSort.js';
import { GUARD_RULES, rulesFor } from '../../src/domain/edit/guardRules.js';
import { OP_TYPES } from '../../src/domain/edit/operations.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SELF_REL = 'tests/lint/opGuardCoverage.walker.test.js';
const CATALOGUE_REL = 'src/domain/edit/operations.js';
const MANIFEST_REL = 'scripts/mutation-coverage-manifest.json';

/** The module's CODE with comments blanked and STRING TEXT KEPT: a row key IS a literal. */
const codeOf = (rel) => commentsOnly(readFileSync(join(ROOT, rel), 'utf8'));

/** An authored catalogue row: a quoted kebab key mapped to a constructor call. */
const ROW_KEY_RE = /^\s{2,}'([a-z][a-z0-9-]*)':\s*[A-Za-z_$][\w$.]*\(/gm;
/** A spread of a sibling leaf's rows into the catalogue literal. */
const SPREAD_RE = /^\s*\.\.\.([A-Za-z_$][\w$]*),/gm;
/** A one-line static named import, which is the form the catalogue's imports are pinned to. */
const IMPORT_RE = /^import\s*\{([^}]*)\}\s*from\s*'(\.[^']+)';$/gm;
/** A row whose sentence claims no guard is wired. Both spellings the estate uses. */
const EMPTINESS_CLAIM = /\bno guard\b/i;

/**
 * The catalogue module and every sibling leaf it spreads rows in from, repo-relative.
 * @returns {string[]}
 */
function catalogueModules() {
  const code = codeOf(CATALOGUE_REL);
  const byName = new Map();
  for (const hit of code.matchAll(IMPORT_RE)) {
    const target = relative(ROOT, resolve(dirname(join(ROOT, CATALOGUE_REL)), hit[2]))
      .replace(/\\/g, '/');
    for (const name of hit[1].split(',').map((each) => each.trim()).filter(Boolean)) {
      byName.set(name, target);
    }
  }
  const spread = [...code.matchAll(SPREAD_RE)].map((hit) => byName.get(hit[1]));
  return [CATALOGUE_REL, ...new Set(spread.filter(Boolean))];
}

/**
 * Every op-type key AUTHORED in the catalogue's own source, from the modules above.
 * @param {readonly string[]} modules @returns {string[]}
 */
function authoredKeys(modules) {
  const found = new Set();
  for (const rel of modules) {
    for (const hit of codeOf(rel).matchAll(ROW_KEY_RE)) found.add(hit[1]);
  }
  return [...found].sort(compareCodepoint);
}

/** A row DECLARES coverage when `guards` is an array and `guardsStated` is a real sentence. */
const declaresCoverage = (row) => Array.isArray(row.guards)
  && typeof row.guardsStated === 'string' && row.guardsStated.length > 0;

/**
 * The keys of a catalogue that declare coverage, in the estate's one string order.
 * @param {Record<string, object>} catalogue @returns {string[]}
 */
const declaredKeys = (catalogue) => Object.keys(catalogue)
  .filter((type) => declaresCoverage(catalogue[type])).sort(compareCodepoint);

/**
 * THE PREDICATE, as a pure function of a catalogue, so every mutant below drives the very
 * code the live arm drives.
 * @param {Record<string, object>} catalogue @returns {string[]} one message per offender
 */
function coverageProblems(catalogue) {
  const problems = [];
  for (const type of Object.keys(catalogue)) {
    const row = catalogue[type];
    if (!Array.isArray(row.guards)) {
      problems.push(`${type}: guards is not an array`);
    } else {
      const inert = row.guards.filter((guard) => typeof guard !== 'function').length;
      if (inert > 0) problems.push(`${type}: ${inert} declared guard cannot fire`);
      if (row.guards.length > 0 && EMPTINESS_CLAIM.test(String(row.guardsStated))) {
        problems.push(`${type}: guards is populated while guardsStated still claims none is wired`);
      }
    }
    if (typeof row.guardsStated !== 'string' || row.guardsStated.length === 0) {
      problems.push(`${type}: guardsStated is empty, and empty coverage still owes a statement`);
    }
  }
  return problems.sort(compareCodepoint);
}

/** One row of a real catalogue, bent, with every other row left exactly as it is. */
const bend = (type, patch) => ({ ...OP_TYPES, [type]: { ...OP_TYPES[type], ...patch } });

const MODULES = catalogueModules();
const DISCOVERED = authoredKeys(MODULES);
const DECLARED = declaredKeys(OP_TYPES);
const MANIFEST = JSON.parse(readFileSync(join(ROOT, MANIFEST_REL), 'utf8'));

describe('EM-B1b — op guard coverage is declared, visible and never silently empty', () => {
  it('C5: the scan, the roster and the catalogue are all real, and every composed row declares guards as an array with a non-empty guardsStated', () => {
    // GUARD-THE-GUARD, FIRST. Every set-equality and every offender list below is worthless
    // if the module roster, the source scan or the catalogue silently emptied.
    expect(MODULES.length, 'the derived roster reaches no sibling leaf, so the scan is reading'
      + ' the catalogue file alone and a spread leaf could hide a whole module of rows')
      .toBeGreaterThan(1);
    expect(MODULES, 'and the catalogue module itself is always in it').toContain(CATALOGUE_REL);
    const unresolved = MODULES.filter((rel) => !existsSync(join(ROOT, rel)));
    expect(unresolved, 'every module the roster names resolves on disk: a spread whose import'
      + ' the reader could not follow would drop that leaf\'s rows out of the scan silently')
      .toEqual([]);
    expect(DISCOVERED.length, 'the source scan found no authored row at all, so both directions'
      + ' of C6 would pass vacuously').toBeGreaterThan(0);
    expect(DISCOVERED, 'and it finds the catalogue\'s own anchor row, which is authored inline'
      + ' in the catalogue file').toContain('set-field');
    expect(Object.keys(OP_TYPES).length, 'the composed catalogue loaded, or the declaration'
      + ' claim below is a claim about an empty map').toBeGreaterThan(0);
    // AND THE DERIVED READER, which C7's table below is a claim about (EM-C3, judgment 251): an
    // absent rulesFor, an empty rule roster or one guard-free row each make that table vacuous.
    expect([typeof rulesFor, GUARD_RULES.length > 0, Object.keys(OP_TYPES).filter((type) => rulesFor(type).length === 0)],
      'the DERIVED coverage reader is live, and EVERY composed row reaches a NON-EMPTY rule set')
      .toEqual(['function', true, []]);

    expect(coverageProblems(OP_TYPES), 'EVERY row of the composed catalogue declares guards as'
      + ' an ARRAY and guardsStated as a NON-EMPTY string. ARCH §5 states coverage even when it'
      + ' is empty, so a row that simply omits the pair is an omission rather than a default;'
      + ' this is the full offender list').toEqual([]);
  });

  it('C6: the declared coverage set and the live source scan are SET-EQUAL in both directions, with the full offender list', () => {
    const undeclared = DISCOVERED.filter((type) => !DECLARED.includes(type));
    const stale = DECLARED.filter((type) => !DISCOVERED.includes(type));
    expect({ undeclared, stale }, 'an op type AUTHORED in the catalogue source with no coverage'
      + ' declaration is UNDECLARED, and a coverage declaration whose row no source authors is'
      + ' STALE. Both are reported by name, and both reds are the instrument working')
      .toEqual({ undeclared: [], stale: [] });
    expect(DECLARED, 'and the two sides are equal AS SEQUENCES, in the estate\'s one string'
      + ' order, so the set-equality above cannot pass on two lists that merely agree on size')
      .toEqual(DISCOVERED);

    // THE PLANTED CONTROLS, driving the SAME two readers the arm above calls. Without them a
    // reader that had stopped reading would report an empty offender list and read as success.
    const silenced = bend('send-force', { guardsStated: '' });
    expect(DISCOVERED.filter((type) => !declaredKeys(silenced).includes(type)),
      'an authored row that stops declaring coverage is convicted BY NAME as undeclared')
      .toEqual(['send-force']);
    const invented = { ...OP_TYPES, 'never-authored-anywhere': OP_TYPES['set-field'] };
    expect(declaredKeys(invented).filter((type) => !DISCOVERED.includes(type)),
      'and a declaration whose row no catalogue module authors is convicted BY NAME as stale')
      .toEqual(['never-authored-anywhere']);
  });

  it('C7: a declared rule that cannot fire reds, an emptiness claim contradicted by a populated roster reds, and the current state is pinned with its reason', () => {
    // §12.8: "the op-coverage walker refuses a declared rule that cannot fire." Four mutants,
    // each a real catalogue with one row bent, each handed to the live predicate.
    expect(coverageProblems(bend('declare-war', { guards: 'a rule' })),
      'a guards field that is not an array at all is convicted first, by name')
      .toEqual(['declare-war: guards is not an array']);
    expect(coverageProblems(bend('make-peace', { guards: ['a rule'] })),
      'a DECLARED entry that is not a function CANNOT FIRE, which is exactly the shape design'
      + ' §12.8 refuses: a rule named in prose is not a rule. BOTH refusals fire on this mutant'
      + ' and that is the measured truth rather than a tidier expectation — the entry is inert'
      + ' AND the row now claims a coverage it does not have, which are two different faults')
      .toEqual([
        'make-peace: 1 declared guard cannot fire',
        'make-peace: guards is populated while guardsStated still claims none is wired',
      ]);
    expect(coverageProblems(bend('open-trade', { guardsStated: '' })),
      'and empty coverage with no statement is an omission, never a default')
      .toEqual(['open-trade: guardsStated is empty, and empty coverage still owes a statement']);
    expect(coverageProblems(bend('send-force', { guards: [() => true] })),
      'THE CONTRADICTION ARM: a row whose roster is populated while its sentence still says no'
      + ' guard is wired is reporting one thing and doing another')
      .toEqual(['send-force: guards is populated while guardsStated still claims none is wired']);

    // THE CURRENT STATE, PINNED WITH ITS REASON rather than asserted as a bare absence — and
    // from EM-C3 (the chair's judgment 251) the reason is a RULING rather than a wave's delay.
    // ⭐ COVERAGE IS DERIVED FROM THE RULES AND IS NEVER AUTHORED ON A ROW, so `guards: []` and
    // its `guardsStated` sentence are ARCH §5's "stated when empty" PERMANENTLY, not until some
    // later member populates them. The measurement that closed the population: `OP_TYPES` is a
    // frozen module-scope literal whose rows reach a rule function only if `operations.js`
    // imports `guardRules.js` — which the shared rules-interface clause forbids in BOTH members
    // — `.guards` has ZERO runtime readers under `src/`, and `rulesFor(type)` is already the one
    // home of the applies-to fact, so a populated array would be a SECOND enumeration of it.
    // The table below asserts that derivation instead of a copy of it. Do not re-open this.
    const populated = Object.keys(OP_TYPES).filter((type) => OP_TYPES[type].guards.length > 0);
    expect(populated, 'not one row carries a guard rule, and that is the declared state rather'
      + ' than an oversight: the rules are EM-C3\'s, coverage is derived from them, and none is'
      + ' authored in the catalogue').toEqual([]);
    // THE DERIVED COVERAGE TABLE, IN BOTH DIRECTIONS and with every set derived or imported: the
    // rows reaching FIVE rules are exactly the op types the one NARROWED rule names (read off
    // GUARD_RULES, not re-typed), the other nineteen reach FOUR, and the two limbs partition the
    // composed catalogue with nothing left over and nothing counted twice.
    const atFive = Object.keys(OP_TYPES).filter((type) => rulesFor(type).length === 5).sort(compareCodepoint);
    const atFour = Object.keys(OP_TYPES).filter((type) => rulesFor(type).length === 4).sort(compareCodepoint);
    expect([atFive, atFour.length, [...atFive, ...atFour].sort(compareCodepoint)],
      'the derived coverage table, in both directions, and the partition it rests on')
      .toEqual([GUARD_RULES.flatMap((rule) => rule.appliesTo ?? []).sort(compareCodepoint), 19, Object.keys(OP_TYPES).sort(compareCodepoint)]);
    const unexplained = Object.keys(OP_TYPES)
      .filter((type) => !EMPTINESS_CLAIM.test(OP_TYPES[type].guardsStated));
    expect(unexplained, 'and every one of them SAYS SO in its own sentence, which is the half of'
      + ' ARCH §5 that a length check alone cannot make').toEqual([]);
    expect(EMPTINESS_CLAIM.test('Two rules are wired here and both fire at the door.'),
      'the emptiness matcher is proved to REFUSE a sentence that claims coverage, or the sweep'
      + ' above convicts nothing and the contradiction arm is a claim about nothing').toBe(false);
  });

  it('C8: this walker owns its entry in the mutation-coverage manifest, asserted from the test side', () => {
    const entry = MANIFEST.invariants[SELF_REL];
    expect(Boolean(entry) && typeof entry === 'object', 'tests/lint is the FIRST of the enforcer'
      + ' dirs, so every file here owes an invariants entry. Asserting it FROM THE TEST SIDE'
      + ' means a dropped row reds in this walker rather than at a train terminal')
      .toBe(true);
    expect(entry.kind, 'the kind is rationale: this walker\'s remover-proof is its own build\'s'
      + ' red-first, not a planted sweep label').toBe('rationale');
    expect(String(entry.rationale || '').length, 'and the rationale carries a written reason'
      + ' rather than a pointer, at the register\'s own forty-character floor')
      .toBeGreaterThanOrEqual(40);
    expect(Object.keys(MANIFEST.invariants).length, 'the register parsed to a live population,'
      + ' or the lookup above answered out of an empty object').toBeGreaterThan(400);
  });
});
