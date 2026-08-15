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
  FIGURE_ORDER, PROVENANCE, capsuleFrom, hotFileCeilings, main, readAll,
} from '../../scripts/base-state-capsule.mjs';
import { enumerateInvariants } from '../lint/mutationCoverage.shared.mjs';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { scannerToolFiles } from '../../scripts/check-observed-shape-readers.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
const json = (rel) => JSON.parse(read(rel));

const CAPSULE = 'docs/implementation/BASE_STATE.json';
const STANDARD = 'docs/implementation/PACKET_STANDARD.md';
const RATCHET_BASELINE = 'scripts/.test-ratchet-baseline.json';
const LIGHTING = 'tests/lint/sovereigntyLightingContract.walker.test.js';
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
  const lighting = read(LIGHTING);
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
  // ⚠ THE CENSUS READ IS ANCHORED TO THE LIVE LINE ON PURPOSE, AND THE FIRST CUT OF IT WAS WRONG.
  // A per-key `files: (\d+)` search matches the RETAINED ANCESTRY-PIN COMMENTS above the live
  // constant — five of them, each a real prior tuple — so it read 2412/365/2047/19984/5638 off a
  // history note and disagreed with the generator's espree read of the actual `CENSUS` object.
  // The generator was right and this reader was wrong, which is the exact reason the two engines
  // are kept different. Anchoring at line start excludes every `// … files: N` comment form.
  const censusLine = lighting.match(
    /^\s*files: (\d+), parked: (\d+), credited: (\d+), titles: (\d+), suiteTitles: (\d+),/m,
  );
  if (!censusLine) throw new Error('the battery could not independently read the live CENSUS line');
  const expected = {
    lightingCensus: censusLine.slice(1, 6).join('/'),
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
    readings = await readAll(28032, { shell: cannedShell });
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

  it('throws and names the row when a home is missing, a shell-out reds, or the tree is dirty', async () => {
    await expect(readAll(28032, { shell: (row) => { throw new Error(`boom in ${row}`); } }))
      .rejects.toThrow(/boom in/);
    await expect(readAll(28032, { shell: () => 'nothing the parser recognises' }))
      .rejects.toThrow(/stdout did not match the declared parse/);
    await expect(main(['--runtime-tests=28032'], {
      io: { shell: cannedShell }, dirtyMeasuredPaths: () => ['src/domain/worldPulse/peaceTerms.js'],
    })).rejects.toThrow(/measured paths are dirty/);
    expect(() => capsuleFrom({ ...readings, stray: 1 })).toThrow(/undeclared \[stray\]/);
    const withoutOne = { ...readings };
    delete withoutOne.lightingCensus;
    expect(() => capsuleFrom(withoutOne)).toThrow(/missing \[lightingCensus\]/);
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
