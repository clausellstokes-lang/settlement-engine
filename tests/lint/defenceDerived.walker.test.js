/**
 * defenceDerived.walker.test.js — COHERENCE-UPKEEP-5's guard: DEFENCE IS DERIVED. Readiness is
 * the sum of parts read from the town's facts through their homes, so the defence code may not
 *   (i)   read a stored defence value (`defenseProfile`, or a defence-only field of it: the
 *         readiness, the gates, the chain modifiers, the magic dependency): a derived thing that
 *         reads itself back is no longer derived;
 *   (ii)  import or call anything random: the profile is a function of the record;
 *   (iii) test an institution or power NAME anywhere but the roster's defence home,
 *         `src/domain/institutions/defenseInstitutionBuckets.js` (`.includes(`, `.test(`,
 *         `.match(`, `.search(`, `.indexOf(`, `.startsWith(`, `.endsWith(`, a regex literal, or
 *         `nativeSemanticName`): one reader of the roster's names;
 *   (iv)  carry a numeric literal in `defenseGenerator.js`: every number defence uses lives in
 *         `src/data/defenceWeights.js :: DEFENCE_TUNING`. STRUCTURAL numbers are allowed and
 *         named here: 0 and 1 (identity, empty sums, "nothing"), 2 (halving: unmanned walls
 *         count half), 5 and 10 (tenths: a readiness point is ten tenths; 5 is the half-tenth),
 *         100 (a score's full scale, and hundredths for the gates' two decimals).
 *
 * THE MANIFEST is the defence code's files. A new defence file joins it, or it is not guarded.
 * Every measurement reads CODE: comments and string contents are blanked (`codeOnly`), so prose
 * naming a rule is not a use of it.
 *
 * AND THE PAGE SHOWS THE RATINGS, NOT THE MACHINERY (the owner, the chair's record 328). The parts
 * list is NOT stored (COHERENCE-UPKEEP-6, ruling 2): `defenceGenerator.js :: defencePartsOf` computes it
 * from the record for the owner, the reviewer and the tests; no reader surface prints or serialises it.
 * A fifth arm walks the reader surfaces — `src/components/**`,
 * `src/pdf/**`, `src/foundry/**` and the export writers `src/lib/*Export.js` — with comments
 * stripped and strings KEPT (`commentsOnly`: a rendered word lives inside a literal), and reds on
 *   (v)   a read of `defenseProfile.parts` (or of the words table `src/data/defenceWeights.js`,
 *         whose labels are the record's), or one of the struck words in the model's sense:
 *         "held in reserve", "more than enough", "Martial will", "paid as a".
 *
 * Each arm is PLANTED red inside this file on a fixture source string, so an arm that cannot fire
 * cannot report green.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { codeOnly, commentsOnly } from '../helpers/codeOnlySource.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The defence code. */
const MANIFEST = Object.freeze([
  'src/generators/defenseGenerator.js',
  'src/data/defenceWeights.js',
  'src/domain/institutions/defenseInstitutionBuckets.js',
  'src/domain/facts/keep.js',
]);
/** The roster's defence home: the one file that may read an institution's name. */
const NAME_HOME = 'src/domain/institutions/defenseInstitutionBuckets.js';
/** The one file whose numbers must all live in the weights table. */
const NUMBERLESS = 'src/generators/defenseGenerator.js';
/** The structural numbers (see the header for why each is structural). */
const STRUCTURAL = new Set([0, 1, 2, 5, 10, 100]);

const STORED_READ = /\bdefen[cs]eProfile\b|\.readiness\b|\.economicGates\b|\.chainModifiers\b|\.magicDependency\b/g;
const RANDOM = /\b_?rng\w*\b|\brandom\w*\b|\bRandom\w*\b|rngContext|\bunseeded\w*|\bchance\s*\(|\bpick\s*\(|\brandInt\b|\bshuffle\s*\(|\bweightedPick\b|\bgetActiveRng\b|\bcreatePRNG\b|\bgetRng\b/g;
const NAME_TEST = /\.(?:includes|test|match|matchAll|search|indexOf|startsWith|endsWith)\s*\(|\bnativeSemanticName\b|(?:^|[=(,:[!&|?{};]|\breturn)\s*\/(?![/*\s])(?:\\.|[^/\n\\])+\/[dgimsuy]*/gm;
const MACHINERY = /\bdefen[cs]eProfile\b[\w$?.\s]*?\.\s*parts\b|(?:JSON\s*\.\s*stringify|structuredClone)\s*\([^;]*?\bdefen[cs]eProfile\b|defenceWeights|\bDEFENCE_(?:WORDS|TUNING|WEIGHT_REASONS)\b|held in reserve|more than enough|martial will|paid as an? /gi;
const NUMBER = /(?<![\w.$])(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?(?![\w.])/g;

/** @param {string} code @param {RegExp} re @returns {string[]} `line: text` of each hit */
function hits(code, re) {
  const out = [];
  for (const m of code.matchAll(re)) {
    const line = code.slice(0, m.index).split('\n').length;
    out.push(`${line}: ${m[0].trim()}`);
  }
  return out;
}

/**
 * The four arms over one file's source. @param {string} file @param {string} source
 * @returns {{ stored: string[], random: string[], names: string[], numbers: string[] }}
 */
function convictions(file, source) {
  const code = codeOnly(source);
  return {
    stored: hits(code, STORED_READ),
    random: hits(code, RANDOM),
    names: file === NAME_HOME ? [] : hits(code, NAME_TEST),
    numbers: file === NUMBERLESS ? hits(code, NUMBER).filter((h) => !STRUCTURAL.has(Number(h.split(': ')[1]))) : [],
  };
}

/** The reader surfaces: every page, the PDF, the Foundry export and the export writers. */
const SURFACE_ROOTS = Object.freeze(['src/components', 'src/pdf', 'src/foundry']);
const SURFACE_FILES = Object.freeze(['src/lib/worldExport.js', 'src/lib/realmMapExport.js', 'src/lib/operatorMessageExport.js']);
/** @param {string} rel @param {string[]} out @returns {string[]} */
function walkSurface(rel, out = []) {
  for (const name of readdirSync(join(ROOT, rel))) {
    const child = `${rel}/${name}`;
    if (statSync(join(ROOT, child)).isDirectory()) walkSurface(child, out);
    else if (/\.(js|jsx|mjs)$/.test(name)) out.push(child);
  }
  return out;
}
/** The fifth arm over one reader surface's source. @param {string} source @returns {string[]} */
const machineryOn = (source) => hits(commentsOnly(source), MACHINERY);

describe('defence is derived: the walker over the defence code', () => {
  for (const file of MANIFEST) {
    test(`${file}: no stored defence read, no draw, no name test outside the home, no number outside the table`, () => {
      expect(convictions(file, readFileSync(join(ROOT, file), 'utf8'))).toEqual({ stored: [], random: [], names: [], numbers: [] });
    });
  }

  test('the manifest is the defence code (each file exists and the generator is on it)', () => {
    for (const file of MANIFEST) expect(readFileSync(join(ROOT, file), 'utf8').length, file).toBeGreaterThan(0);
    expect(MANIFEST).toContain(NUMBERLESS);
    expect(MANIFEST).toContain(NAME_HOME);
  });
});

describe('the page shows the ratings, not the machinery: the reader surfaces', () => {
  const surfaces = [...SURFACE_ROOTS.flatMap((root) => walkSurface(root)), ...SURFACE_FILES];

  test('the walk is not vacuous: the Defense tab, the PDF and the export writers are on it', () => {
    expect(surfaces).toContain('src/components/new/tabs/DefenseTab.jsx');
    expect(surfaces.some((f) => f.startsWith('src/pdf/'))).toBe(true);
    expect(surfaces.some((f) => f.startsWith('src/foundry/'))).toBe(true);
    for (const f of SURFACE_FILES) expect(readFileSync(join(ROOT, f), 'utf8').length, f).toBeGreaterThan(0);
  });

  test('(v) no reader surface prints a part, its points, the record\'s part words, or a struck word', () => {
    const bad = surfaces.flatMap((f) => machineryOn(readFileSync(join(ROOT, f), 'utf8')).map((h) => `${f}:${h}`));
    expect(bad).toEqual([]);
  });
});

describe('the walker is planted red, five ways, on fixture sources', () => {
  const clean = 'const a = W.walls.mil * 2; // a defenseProfile in a comment is prose\nconst s = \'random words in a string\';\n';

  test('the clean fixture is clean (prose and strings are not uses)', () => {
    expect(convictions(NUMBERLESS, clean)).toEqual({ stored: [], random: [], names: [], numbers: [] });
  });

  test('(i) a read of the stored profile, or a defence-only field of it, reds', () => {
    const got = convictions(NUMBERLESS, 'const old = settlement.defenseProfile;\nconst r = old.readiness.score;\nconst g = p.economicGates;\n');
    expect(got.stored).toEqual(['1: defenseProfile', '2: .readiness', '3: .economicGates']);
  });

  test('(ii) an rng import or a random call reds, the codebase\'s own streams among them', () => {
    const got = convictions(NUMBERLESS, "import { random as _rng } from '../kernel/rngContext.js';\nconst x = Math.random();\nif (chance(p)) y = pick(list);\n");
    expect(got.random.length).toBeGreaterThanOrEqual(5);
    expect(got.random.join(' ')).toMatch(/_rng/);
    expect(got.random.join(' ')).toMatch(/random/);
    expect(got.random.join(' ')).toMatch(/chance/);
    expect(got.random.join(' ')).toMatch(/pick/);
    // The reviewer's plant ii: the codebase's own active streams are drawing too (REVIEW-UPKEEP-2, C12).
    const streams = convictions(NUMBERLESS, 'const r = getActiveRng();\nconst p = createPRNG(seed)();\nconst q = getRng();\n');
    expect(streams.random.join(' ')).toMatch(/getActiveRng/);
    expect(streams.random.join(' ')).toMatch(/createPRNG/);
    expect(streams.random.join(' ')).toMatch(/getRng/);
  });

  test('(iii) a name test outside the roster home reds; the home itself may', () => {
    const plant = "const t = institutions.some((i) => nativeSemanticName(i).toLowerCase().includes('wizard'));\nconst w = /warden/i.test(name);\nif (name.startsWith('Martial')) x = 1;\n";
    const got = convictions(NUMBERLESS, plant);
    expect(got.names).toEqual(expect.arrayContaining(['1: nativeSemanticName', '1: .includes(', '2: .test(', '3: .startsWith(']));
    expect(got.names.some((h) => h.includes('/warden/i'))).toBe(true);
    expect(convictions(NAME_HOME, plant).names).toEqual([]);
  });

  test('(v) a reader surface that renders the parts, imports the part words or prints a struck word reds; prose about them in a comment does not', () => {
    const plant = [
      "const rows = settlement.defenseProfile.parts.map((p) => <li>{p.label} {p.points}</li>);",
      "const list = r.defenseProfile?.parts ?? [];",
      "import { DEFENCE_WORDS } from '../../data/defenceWeights.js';",
      "const note = 'Military: more than enough, held in reserve';",
      "<span>Martial will</span>",
      "const pay = `Paid as a ${standing} town`;",
      "const blob = JSON.stringify(s.defenseProfile);",
      '// a comment may say defenseProfile.parts and Martial will: prose is not a print',
    ].join('\n');
    const got = machineryOn(plant);
    expect(got.filter((h) => h.startsWith('1:')).length).toBe(1);
    expect(got.filter((h) => h.startsWith('2:')).length).toBe(1);
    expect(got.filter((h) => h.startsWith('3:')).length).toBe(2);
    expect(got.filter((h) => h.startsWith('4:')).length).toBe(2);
    expect(got.filter((h) => h.startsWith('5:')).length).toBe(1);
    expect(got.filter((h) => h.startsWith('6:')).length).toBe(1);
    // The reviewer's plant v-prime: serialising the whole profile reds (REVIEW-UPKEEP-2, §3, C12).
    expect(got.filter((h) => h.startsWith('7:')).length).toBe(1);
    expect(got.filter((h) => h.startsWith('8:'))).toEqual([]);
    expect(machineryOn("const dp = settlement.defenseProfile; const band = dp.readiness.label;\n")).toEqual([]);
  });

  test('(iv) a numeric literal in the generator outside the structural set reds; elsewhere it is the table\'s', () => {
    const plant = 'const m = 30 + walls;\nconst f = x * 0.6;\nconst ok = Math.round(v * 10) / 10 + 100 - 1;\n';
    expect(convictions(NUMBERLESS, plant).numbers).toEqual(['1: 30', '2: 0.6']);
    expect(convictions('src/data/defenceWeights.js', plant).numbers).toEqual([]);
  });
});
