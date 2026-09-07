/**
 * kindPoolWalker.test.js — THE GUARD ON THE GUARD (SP-E).
 *
 * `tests/helpers/kindPoolWalker.js` is the template every later FP volume imports instead of
 * transcribing a floor table. Its whole value rests on two claims, and both are EXECUTED here
 * rather than asserted in prose:
 *
 *   1. THE DERIVATION REPRODUCES THE ESTATE. The arithmetic table must equal, number for
 *      number, every hand-transcribed `FLOOR_BY_SIGNIFICANCE` already living in tests/lint.
 *      If it does not, the helper is not a drop-in replacement — it is a TENTH opinion, and
 *      importing it would install the very drift it exists to prevent. This scan reads those
 *      files and compares; it is the reason the four transcriptions can be retired safely.
 *
 *   2. THE CONSTITUTION'S SENTENCE IS A VALUE. "A two-variant chronic kind is exactly as
 *      broken as an unregistered one" is compared with `toEqual` on the typed reason set, not
 *      paraphrased in a comment. Both probes, and the compliant control that keeps the
 *      comparison from being green because the predicate reds everything.
 *
 * THE REASON SETS ARE PINNED WITH `toEqual`, NEVER WITH A BOOLEAN. The credit-side enumeration
 * class: three guards in this estate passed all thirty-one of their arms with the load-bearing
 * clause DELETED, because each answered a yes/no question that stayed "no" for a second reason.
 * The deletion mutant below is executed for the same reason — a predicate is only proven when
 * a version of it WITHOUT the clause is shown to disagree.
 *
 * @enforced-by this file
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  CADENCE_STEP,
  CHRONIC_COMPLIANT_PROBE,
  CHRONIC_FLOOR,
  CHRONIC_TWO_VARIANT_PROBE,
  FREQUENCY_FLOORS,
  POOL_REASONS,
  UNREGISTERED_PROBE,
  floorFor,
  floorReasons,
  floorViolations,
  poolDepth,
  registrationReasons,
} from './kindPoolWalker.js';
import { SIGNIFICANCE_CLASSES } from '../../src/domain/worldPulse/bandFamilies.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LINT_DIR = join(ROOT, 'tests/lint');

/**
 * Every hand-transcribed floor table currently living in a kind-pool walker, parsed out of the
 * source. Read rather than listed: a fifth transcription appearing in a new walker joins this
 * comparison on the day it lands, which is the only way this pin keeps working.
 * @returns {{ file: string, table: Record<string, number> }[]}
 */
function transcribedFloorTables() {
  const out = [];
  for (const name of readdirSync(LINT_DIR).sort()) {
    if (!/KindPools\.walker\.test\.js$/.test(name)) continue;
    const src = readFileSync(join(LINT_DIR, name), 'utf8');
    const m = /FLOOR_BY_SIGNIFICANCE\s*=\s*Object\.freeze\(\{([^}]*)\}\)/.exec(src);
    if (!m) continue;
    /** @type {Record<string, number>} */
    const table = {};
    for (const pair of m[1].matchAll(/'?([\w/]+)'?\s*:\s*(\d+)/g)) table[pair[1]] = Number(pair[2]);
    out.push({ file: name, table });
  }
  return out;
}

describe('kindPoolWalker — the derivation reproduces every transcription in the estate', () => {
  test('the scan sees a real denominator (guard the guard)', () => {
    const tables = transcribedFloorTables();
    // Without this the emptiness of the disagreement list below would prove nothing: a regex
    // that stopped matching reports no transcriptions and therefore no disagreements.
    expect(tables.length, 'the transcription scan matched no walker — re-anchor it')
      .toBeGreaterThanOrEqual(4);
    expect(tables.map((t) => t.file)).toContain('envoyKindPools.walker.test.js');
    for (const { file, table } of tables) {
      expect(Object.keys(table).length, `${file}: parsed an empty table`).toBeGreaterThanOrEqual(3);
    }
  });

  test('every transcribed table AGREES with the derived one, class for class', () => {
    /** @type {string[]} */
    const disagreements = [];
    for (const { file, table } of transcribedFloorTables()) {
      for (const [cls, floor] of Object.entries(table)) {
        // `n/a` is GR-0's declared exception, not a class of the family — it is checked
        // separately below, where its written reason lives.
        if (!Object.hasOwn(FREQUENCY_FLOORS, cls)) continue;
        if (FREQUENCY_FLOORS[cls] !== floor) {
          disagreements.push(`${file}: ${cls} transcribed as ${floor}, derived as ${FREQUENCY_FLOORS[cls]}`);
        }
      }
    }
    expect(
      disagreements,
      'a transcribed floor table disagrees with the derivation. Either the arithmetic is wrong'
      + ' or a walker mistyped a number — resolve it before any volume imports the helper.',
    ).toEqual([]);
  });

  test('the derived table is the estate\'s measured one, and it INVERTS against rank', () => {
    // The frozen expectation, spelled once, so the derivation cannot silently become a
    // different law while still "agreeing with itself".
    expect(FREQUENCY_FLOORS).toEqual({ routine: 8, notable: 6, major: 4 });
    expect(Object.keys(FREQUENCY_FLOORS)).toEqual([...SIGNIFICANCE_CLASSES]);
    // The inversion IS the law: chronic kinds need the deepest pools. Stated as a comparison
    // between adjacent classes rather than as three literals, so a re-tuning that kept the
    // numbers plausible but flipped the direction still reds.
    expect(FREQUENCY_FLOORS.routine).toBeGreaterThan(FREQUENCY_FLOORS.notable);
    expect(FREQUENCY_FLOORS.notable).toBeGreaterThan(FREQUENCY_FLOORS.major);
    expect(FREQUENCY_FLOORS.routine - FREQUENCY_FLOORS.notable).toBe(CADENCE_STEP);
    expect(FREQUENCY_FLOORS.routine).toBe(CHRONIC_FLOOR);
  });
});

describe('kindPoolWalker — the constitution\'s sentence, executed', () => {
  test('an unregistered kind reds, and reds as STARVED', () => {
    expect(poolDepth(UNREGISTERED_PROBE)).toBe(0);
    expect(floorReasons(UNREGISTERED_PROBE)).toEqual(['starved']);
  });

  test('a two-variant CHRONIC kind reds EXACTLY AS an unregistered one', () => {
    // The constitution's own sentence, as a value comparison. A chronic kind with two voices
    // is not "nearly compliant" — a reader who meets it every season has heard both by the
    // second year, which is the same silence an unregistered kind offers.
    expect(poolDepth(CHRONIC_TWO_VARIANT_PROBE)).toBe(2);
    expect(floorReasons(CHRONIC_TWO_VARIANT_PROBE)).toEqual(['starved']);
    expect(floorReasons(CHRONIC_TWO_VARIANT_PROBE)).toEqual(floorReasons(UNREGISTERED_PROBE));
  });

  test('the POSITIVE control keeps the two above from being vacuous', () => {
    // Without this, a predicate that returned ['starved'] for every input would satisfy both
    // arms above and prove nothing whatsoever.
    expect(poolDepth(CHRONIC_COMPLIANT_PROBE)).toBe(CHRONIC_FLOOR);
    expect(floorReasons(CHRONIC_COMPLIANT_PROBE)).toEqual([]);
    // …and the floor really is the boundary, not a value near it: one voice short reds.
    const oneShort = { ...CHRONIC_COMPLIANT_PROBE, pool: CHRONIC_COMPLIANT_PROBE.pool.slice(1) };
    expect(floorReasons(oneShort)).toEqual(['starved']);
  });

  test('a RARE kind at four voices is compliant where a chronic one at four is starved', () => {
    // The scaling itself, executed on the same depth: identical pool, opposite verdicts.
    const pool = ['one', 'two', 'three', 'four'];
    expect(floorReasons({ kind: 'rare', significance: 'major', pool })).toEqual([]);
    expect(floorReasons({ kind: 'chronic', significance: 'routine', pool })).toEqual(['starved']);
  });

  test('MUTANT: the floor clause DELETED goes blind to both probes', () => {
    // The predicate under test, re-expressed WITHOUT its floor comparison — the shape a sed
    // that removed the clause would leave behind. It must disagree with the real one, or the
    // greens above were never measuring the clause.
    const withoutFloorClause = (/** @type {{significance: string}} */ row) => (
      Object.hasOwn(FREQUENCY_FLOORS, row.significance) ? [] : ['unknown-significance']
    );
    expect(withoutFloorClause(CHRONIC_TWO_VARIANT_PROBE)).toEqual([]);
    expect(withoutFloorClause(UNREGISTERED_PROBE)).toEqual([]);
    // anchored: both probes are asserted to equal ['starved'] under the real predicate two
    // tests above, so these inequalities measure the deleted clause rather than a comparison
    // that never held.
    expect(floorReasons(CHRONIC_TWO_VARIANT_PROBE)).not.toEqual(withoutFloorClause(CHRONIC_TWO_VARIANT_PROBE));
    expect(floorReasons(UNREGISTERED_PROBE)).not.toEqual(withoutFloorClause(UNREGISTERED_PROBE));
    // …and the mutant agrees with the real predicate on the COMPLIANT row, which is why a
    // walker that only ever tested compliant rows would never have noticed the deletion.
    expect(withoutFloorClause(CHRONIC_COMPLIANT_PROBE)).toEqual(floorReasons(CHRONIC_COMPLIANT_PROBE));
  });
});

describe('kindPoolWalker — the class vocabulary is closed', () => {
  test('an unknown significance class THROWS rather than defaulting', () => {
    expect(() => floorFor('chronic')).toThrow(/unknown significance/);
    expect(() => floorFor('n/a')).toThrow(/unknown significance/);
    // The reason set says so too, rather than silently reporting a compliant row.
    expect(floorReasons({ kind: 'k', significance: 'chronic', pool: [] })).toEqual(['unknown-significance']);
  });

  test('a DECLARED exception is honoured, and only the declared one', () => {
    // GR-0's `n/a`: a dossier line or a DM chip files no Herald desk, so it carries no
    // significance class, yet a reader meets it as often as a notable kind.
    const declaredExceptions = { 'n/a': FREQUENCY_FLOORS.notable };
    expect(floorFor('n/a', { declaredExceptions })).toBe(6);
    const chip = { kind: 'treaty_true_state_chip', significance: 'n/a', pool: Array.from({ length: 8 }, () => 'v') };
    expect(floorReasons(chip, { declaredExceptions })).toEqual([]);
    // anchored: the same row WITHOUT the declaration is proven to red one test above, so the
    // green here is the declaration doing work rather than the predicate ignoring the class.
    expect(floorReasons(chip)).toEqual(['unknown-significance']);
    // A different undeclared class is still refused — the exception is not a general amnesty.
    expect(floorReasons({ ...chip, significance: 'occasional' }, { declaredExceptions }))
      .toEqual(['unknown-significance']);
  });

  test('the GR-0 declared floor of six matches that walker\'s own transcription', () => {
    // The one transcribed number the derivation does NOT produce, checked against its author
    // so the exception cannot drift away from the walker that declares it.
    const grammar = transcribedFloorTables().find((t) => t.file === 'grammarLifecycleKindPools.walker.test.js');
    expect(grammar, 'the grammar walker lost its floor table').toBeTruthy();
    expect(grammar.table['n/a']).toBe(FREQUENCY_FLOORS.notable);
  });
});

describe('kindPoolWalker — the registration joins are one typed set', () => {
  const joins = {
    phrases: { known_kind: 'a thing the town noticed' },
    sectionOf: (/** @type {string} */ kind) => (kind === 'known_kind' ? 'events' : 'war'),
  };

  test('a fully joined row carries NO reasons', () => {
    const row = {
      kind: 'known_kind',
      significance: 'major',
      pool: ['a', 'b', 'c', 'd'],
      requiredSlots: [[], [], [], []],
      section: 'events',
    };
    expect(registrationReasons(row, joins)).toEqual([]);
  });

  test('each broken join adds its OWN reason, and the reasons compose', () => {
    const base = {
      kind: 'known_kind',
      significance: 'major',
      pool: ['a', 'b', 'c', 'd'],
      requiredSlots: [[], [], [], []],
      section: 'events',
    };
    expect(registrationReasons({ ...base, requiredSlots: [[]] }, joins)).toEqual(['slot-arity']);
    expect(registrationReasons({ ...base, kind: 'silent_kind', section: 'war' }, joins)).toEqual(['unphrased']);
    expect(registrationReasons({ ...base, section: 'war' }, joins)).toEqual(['desk-drift']);
    // Composition: a starved, unphrased, desk-drifted row reports all three at once rather
    // than short-circuiting on the first — a walker that stopped at one would leave the other
    // two to be discovered a wave later.
    expect(registrationReasons({
      kind: 'silent_kind', significance: 'routine', pool: ['a'], requiredSlots: [[]], section: 'faith',
    }, joins)).toEqual(['desk-drift', 'starved', 'unphrased']);
  });

  test('a declared section ALIAS is a decision, not a special case', () => {
    // The envoy family files `adjudication` rows at the `events` desk. Naming the rewrite makes
    // it reviewable; leaving it implicit made every walker carry a bare ternary.
    const row = { kind: 'known_kind', significance: 'major', pool: ['a', 'b', 'c', 'd'], section: 'adjudication' };
    expect(registrationReasons(row, { ...joins, sectionAliases: { adjudication: 'events' } })).toEqual([]);
    // anchored: the same row without the alias reds, so the green above is the alias doing
    // work rather than the desk join being switched off.
    expect(registrationReasons(row, joins)).toEqual(['desk-drift']);
  });

  test('every reason a predicate can emit is in the closed vocabulary', () => {
    const emitted = new Set([
      ...registrationReasons({
        kind: 'silent_kind', significance: 'routine', pool: ['a'], requiredSlots: [], section: 'faith',
      }, joins),
      ...floorReasons({ kind: 'k', significance: 'nonsense', pool: [] }),
    ]);
    expect([...emitted].sort()).toEqual(['desk-drift', 'slot-arity', 'starved', 'unknown-significance', 'unphrased']);
    for (const reason of emitted) expect(POOL_REASONS).toContain(reason);
    // The vocabulary is exactly what the predicates can produce — no phantom reason nobody
    // emits, which would let a walker pin a set that can never appear.
    expect([...POOL_REASONS].sort()).toEqual([...emitted].sort());
  });
});

describe('kindPoolWalker — violations are ROWS, not a count', () => {
  test('a violation names the kind, its class, its depth and its floor', () => {
    const violations = floorViolations([
      CHRONIC_COMPLIANT_PROBE,
      CHRONIC_TWO_VARIANT_PROBE,
      UNREGISTERED_PROBE,
    ]);
    expect(violations).toEqual([
      { kind: 'sp_e_chronic_two_variant_probe', significance: 'routine', depth: 2, floor: 8 },
      { kind: 'sp_e_unregistered_probe', significance: 'routine', depth: 0, floor: 8 },
    ]);
    // L7's attribution law in one line: the compliant row is ABSENT, so the list is a
    // violation set rather than a census of everything.
    expect(violations.map((v) => v.kind)).not.toContain(CHRONIC_COMPLIANT_PROBE.kind);
  });

  test('an unknown class reports a NULL floor rather than inventing one', () => {
    expect(floorViolations([{ kind: 'k', significance: 'chronic', pool: [] }]))
      .toEqual([{ kind: 'k', significance: 'chronic', depth: 0, floor: null }]);
  });
});
