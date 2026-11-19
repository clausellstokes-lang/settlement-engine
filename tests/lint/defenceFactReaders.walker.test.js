/**
 * defenceFactReaders.walker.test.js — COHERENCE-AGREE's second guard (the chair's charter of
 * 2026-11-11, §2): ONE FACT, ONE READER. The defence facts (walls, garrison, militia, watch,
 * mercenaries) have a home — `src/domain/facts/defence.js` over `src/domain/defense/defenseFacts.js`.
 * A private reader elsewhere answers the same question its own way, and the two answers drift: the
 * safety text named "a mercenary company" in towns whose defence record lists none, because
 * `priorityHelpers.js` keeps its own list of names.
 *
 * WHAT IS COUNTED, per source file under `src/` (outside the home, the data tables and generated
 * files), with comments stripped: a line that sets a private `hasWalls / hasGarrison / hasMilitia /
 * hasWatch / hasMercenary` flag from anything but the home, or a line that calls a name test
 * (`includes`, `test`, `some`, `hasAny`, `hasInst`, `match`, `find`, `filter`) with a string or
 * pattern literal holding a defence word. It is a count that points, not a proof: a row may hold a
 * line that reads another sense of the word, and is held as counted.
 *
 * THE REGISTER (`defenceFactReaders.register.json`) IS SHRINK-ONLY: every file's count equals its
 * row (a file that reads less lowers its row the same commit), no file outside the register may
 * read, and the register's total never rises above its first commit's.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { ATOM_WORDS, linesReading, reads, readsAtoms, readsCourtGate } from './defenceFactReaders.shared.mjs';
import { FACT_DIMENSIONS } from '../../src/domain/facts/factVocabulary.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const REGISTER = JSON.parse(readFileSync(join(ROOT, 'tests/lint/defenceFactReaders.register.json'), 'utf8'));
/** The register's total at its first commit: it never rises. */
const FIRST_TOTAL = 77;
const COURT_GATE_REGISTER = JSON.parse(readFileSync(join(ROOT, 'tests/lint/defenceFactReaders.courtGate.register.json'), 'utf8'));
/** The second member's total at its first commit (COHERENCE-AGREE-3, over 65ce74ce6): it never rises. */
const COURT_GATE_FIRST_TOTAL = 20;
const ATOMS_REGISTER = JSON.parse(readFileSync(join(ROOT, 'tests/lint/defenceFactReaders.atoms.register.json'), 'utf8'));
/** The third member's total at its first commit (COHERENCE-AGREE-7, over 293167b6f): it never rises. */
const ATOMS_FIRST_TOTAL = 16;
/**
 * THE THIRD MEMBER'S NAMED, EXACT EXEMPTION (STYLE-2-MERGE point 48, the chair's ruling on STOP 48b, 2026-11-13): a file
 * that is not a reader of the defence facts, left out of the atoms register and its total, held at its OWN EXACT count
 * (a second read in it reds; it can never hide a real reader). One entry; never a directory.
 */
const ATOMS_EXEMPT = Object.freeze({
  'src/domain/coherence/pageCensusFindings.js': [1, 'the page census instrument (W2-A-LEAVES b84d3ab76): it renders nothing; its one counted read tests a founder LINE\'s text for a word (a healer who founded the town, not one the town has). COMPOSED at point 48: green at the lane\'s tip and on the line, red only together'],
});

/** @param {string} dir @param {string[]} out @returns {string[]} */
const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out); else out.push(path);
  }
  return out;
};

/** @param {(line: string) => boolean} [test] @param {Readonly<Record<string, unknown>>} [exempt] */
const counted = (test = reads, exempt = {}) => {
  /** @type {Record<string, number>} */
  const out = {};
  for (const path of walk(join(ROOT, 'src'))) {
    const rel = relative(ROOT, path).replace(/\\/g, '/');
    if (!/\.(js|jsx)$/.test(rel) || /\.generated\.js$/.test(rel)) continue;
    if (/^src\/(?:domain\/facts|domain\/defense|data)\//.test(rel)) continue;
    if (rel in exempt) continue;
    const n = linesReading(readFileSync(path, 'utf8'), test);
    if (n) out[rel] = n;
  }
  return out;
};

describe('the defence facts have one reader (shrink-only)', () => {
  test('guard-the-guard: the patterns catch a private reader and pass the home', () => {
    expect(reads("const hasMilitia = names.some(n => n.includes('militia'));")).toBe(true);
    expect(reads("hasMercenary: hasAny(names, ['mercenary company']),")).toBe(true);
    expect(reads("  const watchExists = instNames.some(n => /watch|guard/i.test(n));")).toBe(true);
    expect(reads('hasMercenary: defence.mercenary,')).toBe(false);
    expect(reads('hasMercenary: home.hasMercenary,')).toBe(false);
    expect(reads("const inScope = wall.scope.includes('*') || wall.scope.includes(register);")).toBe(false);
    expect(Object.keys(counted()).length).toBeGreaterThan(10);
  });

  test('every file reads exactly its banked count, and no file reads outside the register', () => {
    const now = counted();
    const banked = Object.fromEntries(Object.entries(REGISTER.rows).map(([file, row]) => [file, row.count]));
    expect(now).toEqual(banked);
  });

  test('every row carries its reason, and the total never rises', () => {
    for (const row of Object.values(REGISTER.rows)) expect(String(row.reason || '').length).toBeGreaterThan(20);
    const total = Object.values(REGISTER.rows).reduce((sum, row) => sum + row.count, 0);
    expect(total).toBeLessThanOrEqual(FIRST_TOTAL);
  });
});

/**
 * THE SECOND MEMBER (COHERENCE-AGREE-3, REVIEW-AGREE F9, 2026-11-12). The first member saw only literal
 * walls/garrison/militia/watch/mercenar* words: a reader of the COURT or the GATE (the two facts the lane gave
 * a home in the flag bag), or of a hired company named any other way (the names priorityHelpers.js listed for
 * it before cure 9 — "hireling hall", "free company", "hired muscle", "veteran's lodge" — and "sellsword"),
 * passed unseen (the review planted each and the walker passed). What it still does NOT see: a defence word
 * held in a constant and tested through the constant (`const W = 'courthouse'; n.includes(W)`).
 */
describe('the court, the gate and a hired company by its other names have one reader (shrink-only)', () => {
  test('guard-the-guard: the review\'s plants are caught, the home and the constant are not', () => {
    expect(readsCourtGate("const sits = names.some(n => n.includes('courthouse'));")).toBe(true);
    expect(readsCourtGate("const hired = names.some(n => n.includes('hireling hall'));")).toBe(true);
    expect(readsCourtGate("const gated = names.some(n => /\\bgates?\\b/i.test(n));")).toBe(true);
    expect(readsCourtGate("const hired = n.includes('sellsword') || n.includes('free company');")).toBe(true);
    expect(readsCourtGate('hasGates: home.hasGate,')).toBe(false);
    expect(readsCourtGate('hasCourtSystem: home.hasCourt,')).toBe(false);
    // a bare name with no binding in its file is not a literal (the line alone tests nothing it can see)
    expect(readsCourtGate('const sits = names.some(n => n.includes(COURT_WORD));')).toBe(false);
    expect(Object.keys(counted(readsCourtGate)).length).toBeGreaterThan(5);
  });
  test('every file reads exactly its banked count, and no file reads outside the register', () => {
    const banked = Object.fromEntries(Object.entries(COURT_GATE_REGISTER.rows).map(([file, row]) => [file, row.count]));
    expect(counted(readsCourtGate)).toEqual(banked);
  });
  test('every row carries its reason, and the total never rises', () => {
    for (const row of Object.values(COURT_GATE_REGISTER.rows)) expect(String(row.reason || '').length).toBeGreaterThan(20);
    const total = Object.values(COURT_GATE_REGISTER.rows).reduce((sum, row) => sum + row.count, 0);
    expect(total).toBeLessThanOrEqual(COURT_GATE_FIRST_TOTAL);
  });
});

/**
 * A WORD HELD IN A CONSTANT (COHERENCE-AGREE-6, REVIEW-AGREE-2 F8 (i), the chair's ruling of 2026-11-12): the walker
 * reads an identifier bound to a name-like string in the same file as that string, so a reader cannot hide its
 * word behind a name. The review's plant, red; a prose constant with a comma (a sentence, not a name) is not.
 */
describe('a defence word held in a constant is read as the word', () => {
  test('the review\'s plant: const MERC = \'mercenary\'; … n.includes(MERC)', () => {
    expect(linesReading("const MERC = 'mercenary';\nconst hired = names.some((n) => n.includes(MERC));\n", reads)).toBe(1);
    expect(linesReading("const COURT_WORD = 'courthouse';\nconst sits = names.some((n) => n.includes(COURT_WORD));\n", readsCourtGate)).toBe(1);
    // controls: the binding alone tests nothing; a prose constant is not a name; a property key is not the constant
    expect(linesReading("const MERC = 'mercenary';\n", reads)).toBe(0);
    expect(linesReading("const LINE = 'dawn, the market, the tavern, the watch';\nconst hit = lines.find((x) => x.includes(LINE));\n", reads)).toBe(0);
    expect(linesReading("const MERC = 'mercenary';\nconst row = { MERC: names.some((n) => n.includes(other)) };\n", reads)).toBe(0);
  });
});

/**
 * THE THIRD MEMBER (COHERENCE-AGREE-7, REVIEW-AGREE-2 F8 (ii), the chair's ruling of 2026-11-12). The defence home holds
 * four atoms the first two members never named: the palisade, the prison, the hospital and the healer. The review
 * planted `n.includes('prison')` and the walker passed it. The words now live in ONE table keyed to the home's atoms
 * (`defenceFactReaders.shared.mjs :: ATOM_WORDS`), each with the member that counts it, and the atom test below holds
 * that every atom the vocabulary homes on the defence record has a word there: an atom homed later without teaching the
 * walker goes red. Two shapes are ruled out by rule, not by row: a name list tested against a person's role archetype
 * (a healer the person IS) and an agreement check that reads the home's own answer on the same line.
 */
describe('the palisade, the prison, the hospital and the healer have one reader (shrink-only)', () => {
  test('guard-the-guard: a private reader of each atom is caught; the home, a role and an agreement check are not', () => {
    expect(readsAtoms("const held = names.some(n => n.includes('prison'));")).toBe(true);
    expect(readsAtoms("const tended = names.some(n => /\\bhospital/i.test(n));")).toBe(true);
    expect(readsAtoms("const tended = names.some(n => n.includes('infirmary'));")).toBe(true);
    expect(readsAtoms("const timber = names.some(n => n.includes('palisade') || n.includes('earthwork'));")).toBe(true);
    expect(readsAtoms("const cure = hasInst('healer');")).toBe(true);
    expect(readsAtoms("hasPrison: hasAny(names, ['gaol']),")).toBe(true);
    expect(readsAtoms('hasPrison: home.hasPrison,')).toBe(false);
    expect(readsAtoms('hasHospital: home.hasHospital || home.hasHealer,')).toBe(false);
    expect(readsAtoms("&& ['healer', 'religious'].includes(state.roleArchetype),")).toBe(false);
    expect(readsAtoms("if (out.includes('on pasture and earthwork') && !factsOf(source).defence.walls) {")).toBe(false);
    expect(Object.keys(counted(readsAtoms)).length).toBeGreaterThan(5);
  });
  test('every file reads exactly its banked count, and no file reads outside the register', () => {
    const banked = Object.fromEntries(Object.entries(ATOMS_REGISTER.rows).map(([file, row]) => [file, row.count]));
    expect(counted(readsAtoms, ATOMS_EXEMPT)).toEqual(banked);
  });
  test('the named exemption: each exempt file reads EXACTLY its named count, with its reason', () => {
    for (const [file, [n, reason]] of Object.entries(ATOMS_EXEMPT)) {
      expect(linesReading(readFileSync(join(ROOT, file), 'utf8'), readsAtoms), file).toBe(n);
      expect(String(reason).length).toBeGreaterThan(20);
    }
  });
  test('every row carries its reason, and the total never rises', () => {
    for (const row of Object.values(ATOMS_REGISTER.rows)) expect(String(row.reason || '').length).toBeGreaterThan(20);
    const total = Object.values(ATOMS_REGISTER.rows).reduce((sum, row) => sum + row.count, 0);
    expect(total).toBeLessThanOrEqual(ATOMS_FIRST_TOTAL);
  });
});

/** The member that counts a word of ATOM_WORDS. @type {Record<number, (line: string) => boolean>} */
const MEMBER = { 1: reads, 2: readsCourtGate, 3: readsAtoms };
const anyMember = (/** @type {string} */ source) => [reads, readsCourtGate, readsAtoms].reduce((n, t) => n + linesReading(source, t), 0);

describe('THE ATOM TEST: every atom the vocabulary homes on the defence record is a word the walker reads', () => {
  test('every defence-homed dimension of FACT_DIMENSIONS has a row in ATOM_WORDS', () => {
    const homed = Object.entries(FACT_DIMENSIONS).filter(([, d]) => d.home === 'defence').map(([atom]) => atom).sort();
    expect(homed.length).toBeGreaterThanOrEqual(11);
    const taught = new Set(ATOM_WORDS.map(([atom]) => atom));
    expect(homed.filter((atom) => !taught.has(atom))).toEqual([]);
  });
  test('every word of ATOM_WORDS, planted as a name test, is counted by its own member', () => {
    for (const [atom, member, word] of ATOM_WORDS) {
      const spelled = word.replace(/\(\?:[^)]*\)\??|\?|\\w\*/g, '');
      const plant = `const seen = names.some((n) => n.includes("${spelled}"));`;
      expect(MEMBER[member](plant), `${atom}: '${spelled}' (member ${member})`).toBe(true);
    }
  });
});

/**
 * THE NINE PLANTS (REVIEW-AGREE-2 F8): the review planted nine private readers in a scratch file. Seven were caught
 * before this seat; the word held in a constant was caught by COHERENCE-AGREE-6 (F8 (i)) and the prison word by the
 * third member here. Each plant, written as the review wrote it, is counted by some member.
 */
describe('the review\'s nine plants are each counted', () => {
  const PLANTS = [
    "const hired = names.some((n) => n.includes('mercenary'));",
    "const hired = names.some((n) => n.includes('hireling hall'));",
    "const sits = names.some((n) => n.includes('courthouse'));",
    "const gated = names.some((n) => /\\bgates?\\b/i.test(n));",
    "const hired = names.some((n) => n.includes('sellsword') || n.includes('free company'));",
    "const armed = ['garrison', 'militia'].some((w) => names.some((n) => n.includes(w)));",
    "const sits = names.some((n) => /court/.test(n));",
    "const MERC = 'mercenary';\nconst hired = names.some((n) => n.includes(MERC));",
    "const held = names.some((n) => n.includes('prison'));",
  ];
  test.each(PLANTS.map((plant, i) => [i + 1, plant]))('plant %i is counted', (_, plant) => {
    expect(anyMember(`${plant}\n`)).toBeGreaterThan(0);
  });
});
