/**
 * baseStateCapsule.test.js — the acceptance battery for scripts/base-state-capsule.mjs.
 *
 * THE ONE RULE THAT SHAPES EVERY CASE BELOW: this file may not build an expected value out of the
 * generator's own helpers. A pin that compares a list against itself proves nothing, and the
 * generator's whole job is to agree with homes it does not own — so every expectation here is
 * derived by THIS file's own code, from the same canonical homes, spelled differently (regex here,
 * espree there). Where the two engines agree, the agreement is evidence.
 *
 * ⚠ AND THE COMPARISON HARNESS ITSELF IS PROVED LIVE. A3 asserts the mismatch list is empty, which
 * an always-empty harness would satisfy vacuously; A8 therefore perturbs each compared reading by
 * exactly one and requires the harness to name that row. Without A8, A3 would be the
 * rendered-surface-negative class wearing a comparison's clothes.
 *
 * ⚠ THE SHELL-OUT ROWS ARE PROVED BY THEIR PARSERS, NOT BY RUNNING THEM. Two of the four run `tsc`
 * over the whole repository; wiring them live into a 28k-test suite would buy no extra evidence and
 * would put two type-check subprocesses in contention with the run measuring them. The real
 * boundary is proved end to end by the landing's own executed generator run, quoted in the receipt.
 *
 * ⛔ No `.each`, no `describe.runIf`, no `it.skipIf`, no nested describe, no `skip`, no `todo`:
 * every title is a string literal in a straight-line registration, which is what keeps this file
 * CREDITED rather than PARKED in the estate-wide lighting census.
 */
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { Linter } from 'eslint';
import {
  FIGURE_ORDER, PROVENANCE, capsuleFrom, dirtyMeasuredPaths, hotFileCeilings, main,
  parsePorcelainPaths, readAll,
} from '../../scripts/base-state-capsule.mjs';
import { enumerateInvariants } from '../lint/mutationCoverage.shared.mjs';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { scannerToolFiles } from '../../scripts/check-observed-shape-readers.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
const json = (rel) => JSON.parse(read(rel));

/**
 * A `--runtime-tests` count that clears the ratchet's MOVING scope floor.
 *
 * ⛔ NEVER HARDCODE THIS. The generator's floor is `baseline.totalTests * SCOPE_FLOOR_RATIO`, and it
 * RISES with every landing that adds tests. The literal 28032 that stood here sat SIX units above
 * the floor of the day it was written; a landing that added 82 tests moved the floor to 28100, and
 * the dirty-paths case below began failing on the floor guard instead of reaching the assertion it
 * exists to make. Nothing was wrong with the generator and nothing was wrong with the landing — the
 * fixture was a green with an expiry date nobody was watching.
 *
 * The baseline's own `totalTests` is the honest value: it is what a FULL run reports, and it can
 * never fall below its own 90%. Read from the canonical home with this file's own reader rather than
 * through the generator's helper, per the doctrine at the head of this file.
 */
const RUNTIME_TESTS = json('scripts/.test-ratchet-baseline.json').totalTests;

const CAPSULE = 'docs/implementation/BASE_STATE.json';
const STANDARD = 'docs/implementation/PACKET_STANDARD.md';
const RATCHET_BASELINE = 'scripts/.test-ratchet-baseline.json';
const CENSUS_REGISTER = 'tests/lint/.lighting-census-baseline.json';
const POOLS = 'tests/lint/kindPoolFloors.walker.test.js';

/** Canned stdout for the rows that cross a process boundary. */
const CANNED = Object.freeze({
  stampedAt: 'feedface\n',
  stampedDate: '2026-08-14\n',
  osrFindings: 'observed-shape readers: 1998 finding(s), exactly matching the frozen inventory.\n',
  typecheckRatchet: '[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).\n',
  strictDomainRatchet: '[domain-strict] no strict-type regressions (1134 errors, ceiling 1134).\n',
  validatePackets: '[implementation-packets] valid: 38 packets (2 READY)\n',
});
const cannedShell = (row) => {
  if (!(row in CANNED)) throw new Error(`the battery has no canned stdout for ${row}`);
  return CANNED[row];
};

/**
 * THIS FILE'S OWN read of the standing hot-file table — a split-and-match spelling, kept
 * deliberately different from the generator's matchAll pair, per the header rule that no
 * expectation here may be built out of the code under test.
 */
const tableCeilings = (markdown = read(STANDARD)) => {
  const section = markdown.split(/^## /m).filter((part) => part.startsWith('Hot files'));
  if (section.length !== 1) throw new Error('the battery could not locate the Hot files section');
  return Object.fromEntries(section[0].split('\n')
    .map((line) => line.match(/^\|\s*`([^`]+)`\s*\|\s*\d+\s*\|\s*(\d+)\s*\|/))
    .filter(Boolean)
    .map((m) => [m[1], Number(m[2])]));
};

/** THIS FILE'S OWN reader — deliberately a different engine from the generator's espree. */
const numberNear = (source, re, label) => {
  const m = source.match(re);
  if (!m) throw new Error(`the battery could not independently read ${label}`);
  return Number(m[1]);
};

/**
 * Re-derive every cheap figure from its canonical home with this file's own code and return the
 * rows that disagree. Returning a LIST rather than asserting inline is what lets A8 prove the
 * harness discriminates instead of always agreeing.
 */
async function mismatchesAgainstHomes(readings) {
  const pools = read(POOLS);
  const kills = read('tests/design/deepCraftKillList.test.js');
  const baseline = json(RATCHET_BASELINE);
  const rules = await import('../../src/domain/worldPulse/simulationRules.js');
  const news = await import('../../src/domain/worldPulse/grammarNews.js');
  const receipts = await import('../../src/domain/worldPulse/grammarReceiptPools.js');
  const routing = await import('../../src/domain/realm/heraldRouting.js');
  const linter = new Linter({ configType: 'flat' });
  const effectiveOf = (rel) => {
    const found = linter.verify(read(rel), {
      languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
      rules: { 'max-lines': ['error', { max: 1, skipBlankLines: true, skipComments: true }] },
    }).find((m) => m.ruleId === 'max-lines');
    return found ? Number(String(found.message).match(/\((\d+)\)/)[1]) : 1;
  };
  // ⚠ THE CENSUS MOVED HOMES AT TE-EFF-1 CAR 2 (ODQ §778.2) AND THIS READER MOVED WITH IT. The
  // five figures are no longer a line in the walker; they are a JSON register the walker asserts
  // against, so this battery reads the REGISTER — and it still reads it with a DIFFERENT ENGINE
  // from the generator's, per this file's header rule that no expectation may be built out of the
  // code under test. The generator does `JSON.parse` plus a provenance check; this does a
  // line-anchored regex over the raw bytes.
  //
  // ⭐ THE HAZARD THE OLD READER CARRIED IS GONE, NOT MERELY MOVED, AND IT IS WORTH SAYING WHY.
  // The previous cut of this read was WRONG: a per-key `files: (\d+)` search matched the RETAINED
  // ANCESTRY-PIN COMMENTS above the live constant — five of them, each a real prior tuple — so it
  // read 2412/365/2047/19984/5638 off a history note and disagreed with the generator. Line
  // anchoring was the patch. The register has no history in it at all (the derivation history
  // stayed in the walker, deliberately), so there is no comment for a per-key search to collide
  // with; the anchor is kept anyway, because a `_doc` line could one day quote a figure.
  const registerText = read(CENSUS_REGISTER);
  const censusFigures = ['files', 'parked', 'credited', 'titles', 'suiteTitles'].map((key) =>
    numberNear(registerText, new RegExp(`^\\s*"${key}": (\\d+)`, 'm'), `the register's ${key}`));
  const expected = {
    lightingCensus: censusFigures.join('/'),
    killList: ['borderRadius', 'boxShadow', 'rgbaLiterals', 'tintedCallouts']
      .map((key) => numberNear(kills, new RegExp(`${key}: (\\d+),`), key)).join('/'),
    titleCensus: numberNear(read('tests/domain/guidanceRegistry.walker.test.js'),
      /TITLE_BASELINE = (\d+)/, 'TITLE_BASELINE'),
    frozenKnownFailures: Object.keys(baseline.entries).length,
    voiceMechanicsBankedArms: Object.keys(baseline.entries)
      .filter((id) => id.startsWith('tests/copy/voiceMechanics.test.js ::')).length,
    // ⚠⚠ THE ARRAY/OBJECT SPLIT IS SPELLED OUT PER SYMBOL BECAUSE A BARE `.length` HID A BUG.
    // GRAMMAR_RECEIPTS and EXACT_SECTION are keyed OBJECTS; the other three are arrays. A `.length`
    // on the objects yields `undefined`, the generator emitted `undefined`, JSON.stringify dropped
    // the key, and this harness compared `undefined` against `undefined` and agreed. Naming each
    // shape here is what stops the two engines from being wrong in the same direction.
    flagManifestRows: rules.ENGINE_GATED_VIRTUAL_RULE_KEYS.length,
    grammarKindRegistryRows: news.GRAMMAR_KIND_REGISTRY.length,
    grammarHeraldKinds: news.GRAMMAR_HERALD_KINDS.length,
    grammarReceiptsPools: Object.keys(receipts.GRAMMAR_RECEIPTS).length,
    routedTokens: Object.keys(routing.EXACT_SECTION).length,
    kindPoolFloorsRegisteredKinds: numberNear(pools, /REGISTERED_KIND_COUNT = (\d+)/, 'REGISTERED_KIND_COUNT'),
    kindPoolFloorsUnvoicedTokens: numberNear(pools, /LEGACY_UNVOICED_TOKENS = (\d+)/, 'LEGACY_UNVOICED_TOKENS'),
    kindPoolFloorsRegistries: numberNear(pools, /expect\(REGISTRIES\)\.toHaveLength\((\d+)\)/, 'REGISTRIES'),
    kindPoolFloorsRegisteredMinusRouted: numberNear(pools,
      /routedAndRegistered\.length\)\s*\.toBe\((\d+)\)/, 'the routed identity'),
    osrFindings: 1998,
    typecheckRatchet: '173/173',
    strictDomainRatchet: '1134/1134',
    validatePackets: '38 packets / 2 READY',
    stampedAt: 'feedface',
    stampedDate: '2026-08-14',
  };
  const rows = Object.entries(expected)
    .filter(([key, value]) => readings[key] !== value)
    .map(([key, value]) => `${key}: generator ${readings[key]} vs home ${value}`);
  // ⚠⚠ `hotFiles` COUNTS AS EXACTLY ONE TOWARD `compared`, HOWEVER MANY ROWS IT COMPARES.
  // A8 below asserts `Object.keys(readings).length - 1 === compared`, so widening this
  // comparison's WEIGHT would red the perturbation arm; widening its COVERAGE does not.
  // Coverage is what matters here: the capsule reported three rows for a four-row table for
  // a whole wave because only peaceTerms was ever compared.
  const homeCeilings = tableCeilings();
  const mismatched = [];
  for (const [path, ceiling] of Object.entries(homeCeilings)) {
    const want = `${effectiveOf(path)}/${ceiling}`;
    if (readings.hotFiles[path] !== want) mismatched.push(`${path}: generator ${readings.hotFiles[path]} vs home ${want}`);
  }
  for (const path of Object.keys(readings.hotFiles)) {
    if (!(path in homeCeilings)) mismatched.push(`${path}: emitted but absent from the standing table`);
  }
  if (mismatched.length) rows.push(`hotFiles: ${mismatched.join('; ')}`);
  return { rows, compared: Object.keys(expected).length + 1 };
}

let readings;

describe('base-state capsule generator', () => {
  beforeAll(async () => {
    readings = await readAll(RUNTIME_TESTS, { shell: cannedShell });
  }, 60_000);

  it('emits the committed artifact shape: six top-level keys and the frozen figure order', () => {
    const committed = json(CAPSULE);
    const built = capsuleFrom(readings);
    expect(Object.keys(built)).toEqual(Object.keys(committed));
    expect(built.schemaVersion).toBe(1);
    expect(Object.keys(built.figures)).toEqual(Object.keys(committed.figures));
    expect(Object.keys(built.figures)).toEqual([...FIGURE_ORDER]);
    expect(built.consumptionLaw).toBe(committed.consumptionLaw);
  });

  it('declares provenance for every emitted key and emits a key for every declared row', () => {
    const declared = Object.keys(PROVENANCE);
    const built = capsuleFrom(readings);
    const emitted = [...Object.keys(built.figures), 'stampedAt', 'stampedDate'];
    expect(declared.filter((row) => !emitted.includes(row))).toEqual([]);
    expect(emitted.filter((row) => !declared.includes(row))).toEqual([]);
    const figures = declared.filter((row) => PROVENANCE[row].target === 'figure');
    expect([...figures].sort()).toEqual([...FIGURE_ORDER].sort());
    for (const [row, meta] of Object.entries(PROVENANCE)) {
      expect(['MEASURED', 'PINNED', 'ARG'], `${row} declares no known kind`).toContain(meta.kind);
      expect(String(meta.home).length, `${row} declares no home`).toBeGreaterThan(0);
    }
    expect(Object.values(PROVENANCE).filter((meta) => meta.kind === 'ARG')).toHaveLength(1);
  });

  it('agrees with every canonical home this battery re-derives by its own independent code', async () => {
    const { rows, compared } = await mismatchesAgainstHomes(readings);
    expect(compared, 'the harness compared almost nothing — this arm would pass vacuously')
      .toBeGreaterThanOrEqual(20);
    expect(rows).toEqual([]);
  });

  it('names the row when any single reading is perturbed, so the agreement above is a real read', async () => {
    // ⚠⚠ EVERY COMPARED ROW IS PERTURBED, DERIVED FROM THE HARNESS ITSELF — NEVER A HAND-KEPT LIST.
    // The first cut of this case named eight rows by hand, and `grammarReceiptsPools` was not among
    // them; that is precisely the row whose reader was broken, whose value was `undefined`, and
    // whose comparison therefore agreed vacuously. A subset here is a subset of the evidence.
    const { rows: none, compared } = await mismatchesAgainstHomes(readings);
    expect(none).toEqual([]);
    const perturb = (value) => {
      if (typeof value === 'number') return value + 1;
      if (typeof value === 'string') return `${value}-perturbed`;
      return { ...value, 'src/domain/worldPulse/peaceTerms.js': '1/800' };
    };
    const keys = Object.keys(readings).filter((key) => key !== 'runtimeTests');
    expect(keys.length, 'nothing was perturbed — this arm would pass vacuously').toBe(compared);
    for (const key of keys) {
      const { rows } = await mismatchesAgainstHomes({ ...readings, [key]: perturb(readings[key]) });
      expect(rows.join(' | '), `perturbing ${key} was invisible to the harness`)
        .toContain(key === 'hotFiles' ? 'hotFiles' : key);
    }
  });

  it('parses the hot-file ceilings out of PACKET_STANDARD, and refuses every malformed table', () => {
    const mine = tableCeilings();
    // ⚠⚠ THE VACUITY GUARD, AND IT IS NOT DECORATIVE. If both engines were broken the same
    // way — the failure mode this file's header exists to prevent — `{}` would equal `{}`
    // and the agreement below would be about nothing. Requiring this file's own read to
    // find at least the four known rows FIRST is what makes the agreement evidence.
    expect(Object.keys(mine).length, 'the table read nothing — this arm would pass vacuously')
      .toBeGreaterThanOrEqual(4);
    expect(hotFileCeilings()).toEqual(mine);
    // …and the standing list is what the generator emits, not a second hand-kept copy.
    expect(Object.keys(readings.hotFiles)).toEqual(Object.keys(mine));

    const table = (...rows) => `# doc\n\n## Hot files\n\n| File | Effective | Ceiling | Headroom |\n|---|---:|---:|---:|\n${rows.join('\n')}\n\n## After\n`;
    const good = '| `src/domain/worldPulse/peaceTerms.js` | 797 | 800 | 3 |';
    const other = '| `src/components/OutputContainer.jsx` | 599 | 600 | 1 |';
    // F1 — absent, and duplicated: a renamed or doubled heading must not yield an empty list.
    expect(() => hotFileCeilings('hotFiles', '# doc\n\n## Other\n')).toThrow(/hotFiles.*0 "## Hot files" sections/);
    expect(() => hotFileCeilings('hotFiles', `${table(good)}## Hot files\n\n${good}\n`))
      .toThrow(/hotFiles.*2 "## Hot files" sections/);
    // F2 — zero rows parsed is the silently-zeroed figure this generator forbids outright.
    expect(() => hotFileCeilings('hotFiles', table())).toThrow(/hotFiles.*parsed ZERO rows/);
    // F3 — ⭐ THE STRUCTURAL CURE. A malformed ceiling cell drops one row out of an otherwise
    // healthy table, which F2 can never see, and which is the exact shape of the bug this
    // parse exists to end: the capsule shipped a three-of-four list for a whole wave.
    expect(() => hotFileCeilings('hotFiles', table(good, '| `src/domain/worldPulse/convergence.js` | 798 | eight hundred | 2 |')))
      .toThrow(/hotFiles.*2 backticked row\(s\) but 1 parsed/);
    // F4 — a rotted path would measure nothing and emit a default.
    expect(() => hotFileCeilings('hotFiles', table('| `src/domain/never-written.js` | 1 | 800 | 799 |')))
      .toThrow(/hotFiles.*does not exist: src\/domain\/never-written\.js/);
    // F5 — two ceilings for one file has no honest resolution.
    expect(() => hotFileCeilings('hotFiles', table(good, good))).toThrow(/hotFiles.*names src\/domain\/worldPulse\/peaceTerms\.js twice/);
    // …and the happy path over synthetic bytes, so the refusals above are not the only
    // thing this arm can observe.
    expect(hotFileCeilings('hotFiles', table(good, other))).toEqual({
      'src/domain/worldPulse/peaceTerms.js': 800,
      'src/components/OutputContainer.jsx': 600,
    });
  });

  it('refuses to write without a runtime-test count at or above the ratchet scope floor', async () => {
    const io = { shell: cannedShell };
    const before = read(CAPSULE);
    await expect(main([], { io, dirtyMeasuredPaths: () => [] }))
      .rejects.toThrow(/--runtime-tests=<N> is REQUIRED/);
    await expect(main(['--runtime-tests=0'], { io, dirtyMeasuredPaths: () => [] }))
      .rejects.toThrow(/below the ratchet's own scope floor of \d+/);
    await expect(main(['--runtime-tests=nope'], { io, dirtyMeasuredPaths: () => [] }))
      .rejects.toThrow(/--runtime-tests=<N> is REQUIRED/);
    expect(read(CAPSULE), 'a refused run still wrote the artifact').toBe(before);
  });

  it('reads porcelain by its column law, and throws naming the row when a home is missing, a shell-out reds, or the tree is dirty', async () => {
    await expect(readAll(RUNTIME_TESTS, { shell: (row) => { throw new Error(`boom in ${row}`); } }))
      .rejects.toThrow(/boom in/);
    await expect(readAll(RUNTIME_TESTS, { shell: () => 'nothing the parser recognises' }))
      .rejects.toThrow(/stdout did not match the declared parse/);
    await expect(main([`--runtime-tests=${RUNTIME_TESTS}`], {
      io: { shell: cannedShell }, dirtyMeasuredPaths: () => ['src/domain/worldPulse/peaceTerms.js'],
    })).rejects.toThrow(/measured paths are dirty/);
    expect(() => capsuleFrom({ ...readings, stray: 1 })).toThrow(/undeclared \[stray\]/);
    const withoutOne = { ...readings };
    delete withoutOne.lightingCensus;
    expect(() => capsuleFrom(withoutOne)).toThrow(/missing \[lightingCensus\]/);

    // ── D1-D7 — THE PORCELAIN READER ITSELF, which until this car no test executed at all.
    // `dirtyMeasuredPaths` was unexported and every arm that needed a dirty tree injected a
    // REPLACEMENT for it (three of them are in this very arm, above), so the record parse and the
    // DIRTY_SCOPES allowlist were proved by nothing. `dirtyMeasuredPaths` now takes the SHELL, so
    // these drive the real parser and the real allowlist over canned records — no subprocess, no
    // dirty tree, and nothing injected that is under test.
    const scoped = (porcelain) => dirtyMeasuredPaths(() => porcelain);

    // D1 — the exact record the whole-output-trim defect damages: a WORKTREE-ONLY modification,
    // whose status field opens with a SPACE and whose path therefore starts at column 4.
    expect(scoped(' M src/domain/worldPulse/peaceTerms.js\n'))
      .toEqual(['src/domain/worldPulse/peaceTerms.js']);

    // D2 — every status shape reaches column 4 the same way (unstaged, staged, untracked, added,
    // both-columns), and the trailing newline yields no phantom entry.
    expect(scoped(' M src/a.js\nM  scripts/b.mjs\n?? tests/c.test.js\nA  src/d.js\nMM src/e.js\n'))
      .toEqual(['src/a.js', 'scripts/b.mjs', 'tests/c.test.js', 'src/d.js', 'src/e.js']);

    // D3 — the allowlist is a SCOPE FILTER, not a pass-through. docs/ and api/ dirt is not this
    // capsule's business; the artifact's own path is, and it is matched exactly rather than by
    // prefix. A wrong answer here is a false-CLEAN, so both directions are pinned.
    expect(scoped(' M docs/DESIGN_X.md\n M api/gallery-meta.js\n M README.md\n')).toEqual([]);
    expect(scoped(` M ${CAPSULE}\n`)).toEqual([CAPSULE]);

    // D4 ⭐ THE PREVENTION, AND THE REASON THESE CASES EXIST. Hand the reader the SAME records with
    // the whole output trimmed — the one-line tidy on shellOut that would break this and nothing
    // else — and it must REFUSE and NAME the offending record.
    // MEASURED AGAINST THE PRE-CURE CODE, both shapes, and they fail differently: with these TWO
    // records the trim silently DROPPED record one and kept record two, so the refusal named half
    // a dirty tree; with a SINGLE record the list came back EMPTY and the generator went on to
    // stamp a capsule at HEAD over a tree it had not measured. A silently shorter list is the
    // failure in both, and a loud refusal is not.
    const records = ' M scripts/base-state-capsule.mjs\n M src/domain/worldPulse/peaceTerms.js\n';
    expect(scoped(records))
      .toEqual(['scripts/base-state-capsule.mjs', 'src/domain/worldPulse/peaceTerms.js']);
    expect(() => scoped(records.trim()))
      .toThrow(/dirty-tree: this is not a `git status --porcelain` record: "M scripts\/base-state-capsule\.mjs"/);

    // D5 — the column law is asserted PER RECORD, not as a special case for line one. Damage any
    // record and that record is the one named.
    expect(() => scoped(' M src/a.js\nM src/b.js\n')).toThrow(/record: "M src\/b\.js"/);

    // D6 — a truncated record REFUSES rather than yielding an empty path that a `.filter(Boolean)`
    // would drop without a word. Dropping is exactly how a record hides.
    expect(() => parsePorcelainPaths('probe', ' M\n'))
      .toThrow(/probe: this is not a `git status --porcelain` record/);

    // D7 — the parser is PURE and returns paths UNSCOPED; filtering is a separate step. It also
    // pins the deliberate rename behaviour: `R  old -> new` is read as one opaque string, which can
    // only ever ADD a path to the dirty list, never remove one — the conservative direction.
    expect(parsePorcelainPaths('probe', ' M docs/x.md\nR  old.js -> new.js\n'))
      .toEqual(['docs/x.md', 'old.js -> new.js']);
  });

  it('stays outside the mutation-coverage enumeration, so no manifest row is owed', () => {
    const picked = enumerateInvariants(ROOT);
    expect(picked.length, 'the enumeration walk collapsed — this arm would pass vacuously')
      .toBeGreaterThan(440);
    // The anchor travels the SAME walk as the subject: ciCheckParity is the one tests/build file
    // the NAME_PATTERN regex picks up, so it vanishes under exactly the drift that would make a
    // bare absence assertion here go vacuous.
    expectAbsentWithAnchor(picked, 'tests/scripts/baseStateCapsule.test.js',
      'tests/build/ciCheckParity.test.js');
    expect(picked.filter((row) => row.startsWith('tests/scripts/'))).toEqual([]);
  });

  it('adds no governed observed-shape input, so it moves no detector digest', () => {
    const governed = scannerToolFiles().map((path) => path.replace(`${ROOT}/`, ''));
    expect(governed.length).toBeGreaterThanOrEqual(11);
    // package.json is the governed list's own first entry and the reason the npm-script row was
    // deferred, so it is the anchor that travels the same path as the subject.
    expectAbsentWithAnchor(governed, 'scripts/base-state-capsule.mjs', 'package.json');
  });
});
