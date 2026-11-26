/**
 * samenessCensus.walker.test.js — THE SAMENESS DOOR (SAME-1 brief 2, 2026-11-20;
 * `docs/chair/2026-11-20/content/same/SAME-1-DOOR-BRIEF.md`).
 *
 * The door (`node scripts/sameness-census.mjs --check`) renders every sentence the owner's page prints over a fixed corpus
 * (hxd, 150 places a size, six sizes), keys each by WHERE the page prints it (surface | printed position) and
 * judges it against `scripts/census/sameness-census.register.json`. TWO LAWS: a printed slot with no row reds; a ceiling
 * only tightens. The render takes minutes, so it is NOT run here: this file holds the judge's planted reds, run on
 * synthetic rows in memory, and the register's shape. It renders nothing.
 *
 * WHAT IT CATCHES: a judge that lets an unregistered slot through; a rise beyond the noise on both readings that does not
 * red; a rise on one reading that reds (it must be a note with both readings); a --write that would raise a ceiling (it
 * must refuse and write nothing); a --tighten that raises a ceiling or fails to lower a loose one; a label-prefixed line
 * ("Constraint: <stored sentence>") that files as composed instead of under its stored path; a pool whose wordings,
 * held by sibling stored paths, split into several slots (each "100%" of the places that drew it), or two mirrored paths
 * that flip the slot's identity between places; a register off its shape (law, corpus, classes, ceilings at or
 * above their meets, reasons cited by line instead of by symbol).
 * WHAT IT DOES NOT: render the page (the door's own `--check` does); judge the live register against a live reading.
 *
 * @enforced-by tests/lint/samenessCensus.walker.test.js
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'espree';
import ts from 'typescript';
import { describe, expect, test } from 'vitest';

import {
  CORPUS, LAW1_MEASURE, MIN_PLACES, NOISE_SE, REGISTER_PATH, SIZES, attributionOf, ceil2, confirmRises, emptyRegister,
  incompleteRender, judge, law1RedPlaces, law1WatchPlaces, measureSlots, readRegister, repeatsInPlace, shareError, slotKey,
  storedHeads, tighten, writeRows, notDrawnSentences, roleTitles, fixedCaptions, sentencesOf,
} from '../../scripts/sameness-census.mjs';
import { FACE_HONORIFICS, FACE_HONORIFICS_INLAND, FACE_HONORIFICS_BY_CULTURE } from '../../src/data/faceHonorifics.js';
import { faceRows } from '../../src/data/institutionalCatalog.js';
import { SEAT_MINT_TITLES, OTHER_MINT_ROWS } from '../../src/generators/people/mintTitles.js';
import { SECTION_HELP, SYSTEMS_HEALTH_VINTAGE } from '../../src/copy/sectionHelp.js';

const S = 'web:Summary/Overview';
const POS = 'OverviewTab > Section';
/** n synthetic places, each printing `line(i)` at one position; `stored(i)` is its stored index. */
function places(n, line, stored = () => ({})) {
  return Array.from({ length: n }, (_, i) => ({ seed: `p-${i}`, surfaces: { [S]: [[line(i), '', '', POS]] }, stored: stored(i) }));
}
const sentenceA = 'The river mill has turned since the founding of the town.';
/** A reading where `same` of `n` places print sentenceA and the rest a sentence of their own (one a place: TOP share). */
const reading = (n, same) => ({ thorp: measureSlots(places(n, (i) => (i < same ? sentenceA : `Place number ${'x'.repeat(i + 1)} prints its very own line here.`))) });
const SLOT = slotKey(S, ['', '', '', POS]);
/** A register holding SLOT at thorp with a ceiling. */
const registerAt = (ceiling, places = 50) => ({ ...emptyRegister(), rows: { [SLOT]: { class: 'STATE', reason: 'a planted row', sentence: sentenceA, paths: {}, sizes: { thorp: { places, of: places, distinct: 2, shareAll: ceiling, shareIn: ceiling, seen: 0, by: 'top', meet: ceiling, ceiling } } } } });

describe('law 1, tied to the bar (the chair, 18:52 UTC): an unregistered slot reds by its TOP sentence\'s places', () => {
  test('an unregistered slot whose top sentence prints at 15 of 150 places REDS', () => {
    const f = judge(reading(150, 15), emptyRegister());
    expect(f.unregistered.map((x) => x.slot)).toEqual([SLOT]);
    expect(f.watch).toEqual([]);
  });
  test('at 14 of 150 it is WATCH, not red', () => {
    const f = judge(reading(150, 14), emptyRegister());
    expect(f.unregistered).toEqual([]);
    expect(f.watch.map((x) => x.slot)).toEqual([SLOT]);
  });
  test('at 7 of 150 it is neither red nor watch (a note)', () => {
    const f = judge(reading(150, 7), emptyRegister());
    expect(f.unregistered).toEqual([]);
    expect(f.watch).toEqual([]);
    expect(f.rare.map((x) => x.slot)).toEqual([SLOT]);
  });
  test('a slot printed in 150 of 150 places with 150 distinct sentences is neither (the top sentence, not the slot, is counted)', () => {
    const r = reading(150, 0);
    expect([...r.thorp.values()][0]).toMatchObject({ places: 150, distinct: 150 });
    const f = judge(r, emptyRegister());
    expect(f.unregistered).toEqual([]);
    expect(f.watch).toEqual([]);
    expect(f.rare.map((x) => x.slot)).toEqual([SLOT]);
  });
  test('the two lines are the ruling\'s: 15 and 8 of 150, cited', () => {
    expect([law1RedPlaces(150), law1WatchPlaces(150)]).toEqual([15, 8]);
    expect(LAW1_MEASURE).toMatch(/18:52 UTC/);
  });
  test('--write still registers a slot printed in MIN_PLACES places, though law 1 no longer reds it', () => {
    const at = (/** @type {number} */ k) => ({ thorp: measureSlots(places(150, (i) => (i < k ? sentenceA : ''))) });
    expect(judge(at(MIN_PLACES), emptyRegister()).unregistered).toEqual([]);
    const classify = () => ({ cls: 'STATE', reason: 'planted' });
    expect(Object.keys(writeRows(at(MIN_PLACES), at(MIN_PLACES), emptyRegister(), { classify }).next.rows)).toEqual([SLOT]);
    expect(writeRows(at(MIN_PLACES - 1), at(MIN_PLACES - 1), emptyRegister(), { classify }).next.rows).toEqual({});
  });
  test('a row whose slot is no longer printed is a stale note, never dropped silently', () => {
    const f = judge({ thorp: new Map() }, registerAt(0.4));
    expect(f.stale.map((x) => x.slot)).toEqual([SLOT]);
    expect(f.unregistered).toEqual([]);
  });
});

describe('law 2: a rise reds only beyond the noise and only on both readings', () => {
  const reg = registerAt(0.4);
  const over = reading(50, 40); // shareAll 0.8 against 0.4: (0.8 - 0.4) / sqrt(0.24 / 50) = 5.8 SE
  const calm = reading(50, 21); // shareAll 0.42: inside the noise
  test('the planted rise is beyond NOISE_SE on one reading and inside it on the other', () => {
    expect((0.8 - 0.4) / shareError(0.4, 50)).toBeGreaterThan(NOISE_SE);
    expect(judge(over, reg).over).toHaveLength(1);
    expect(judge(calm, reg).over).toHaveLength(0);
  });
  test('over on BOTH readings: red, carrying both', () => {
    const c = confirmRises(judge(over, reg), judge(over, reg));
    expect(c.over).toHaveLength(1);
    expect(c.over[0].text).toContain(CORPUS.confirm);
  });
  test('over on ONE reading only: a note with both readings, not a red', () => {
    const c = confirmRises(judge(over, reg), judge(calm, reg));
    expect(c.over).toEqual([]);
    expect(c.notes.join('\n')).toContain('does not repeat');
  });
});

describe('a sentence repeated inside one place (the chair, 20:14: an owner\'s stop condition)', () => {
  const line = 'The two of them have not spoken since the flood took the lower mill.';
  const LIST = 'RelationshipsTab.0.0 > Section.4 > TieCard.*.0';
  test('two cards in one list printing one line: the place is counted, at its one position', () => {
    const rows = [{ seed: 'p-0', surfaces: { 'web:World/Relationships': [[line, '', '', LIST], [line, '', '', LIST]] }, stored: {} }];
    const r = repeatsInPlace(rows);
    expect(r.places).toBe(1);
    expect(r.sentences).toHaveLength(1);
    expect(r.sentences[0]).toMatchObject({ family: 'web', sentence: line, places: 1, onePosition: 1, positions: [`web:World/Relationships | ${LIST}`] });
  });
  test('the line once in each of two places: not counted', () => {
    const one = (/** @type {number} */ i) => ({ seed: `p-${i}`, surfaces: { 'web:World/Relationships': [[line, '', '', LIST]] }, stored: {} });
    expect(repeatsInPlace([one(0), one(1)])).toMatchObject({ places: 0, sentences: [] });
  });
  test('the web dossier is one family (two tabs repeat); two PDF forms are two (no repeat)', () => {
    const tabs = [{ seed: 'p-0', surfaces: { 'web:Summary/Overview': [[line, '', '', 'A']], 'web:World/Relationships': [[line, '', '', 'B']] }, stored: {} }];
    expect(repeatsInPlace(tabs)).toMatchObject({ places: 1, sentences: [{ onePosition: 0 }] });
    const forms = [{ seed: 'p-0', surfaces: { 'pdf:canon_dossier': [[line, '', '', 'A']], 'pdf:draft_brief': [[line, '', '', 'A']] }, stored: {} }];
    expect(repeatsInPlace(forms).places).toBe(0);
  });
});

describe('an incomplete render gives no verdict (SAME-2, fault F)', () => {
  const full = () => Object.fromEntries(SIZES.map((s) => [s, 150]));
  test('a complete render passes', () => {
    expect(incompleteRender(full(), 150, SIZES, [0, 0, 0, 0])).toEqual([]);
  });
  test('a size short by one row is the fault, named', () => {
    const faults = incompleteRender({ ...full(), metropolis: 149 }, 150, SIZES);
    expect(faults).toHaveLength(1);
    expect(faults[0]).toContain('metropolis');
  });
  test('a size with no rows at all, or a fork that exited non-zero, is the fault', () => {
    const { thorp, ...rest } = full();
    expect(thorp).toBe(150);
    expect(incompleteRender(rest, 150, SIZES)).toHaveLength(1);
    expect(incompleteRender(full(), 150, SIZES, [0, 1, 0, 0])[0]).toContain('fork 1');
  });
});

describe('the doors that write', () => {
  test('--write adds the unregistered slot at the HIGHER of the two readings, rounded up to 0.01', () => {
    const r = writeRows(reading(50, 20), reading(50, 23), emptyRegister(), { classify: () => ({ cls: 'STATE', reason: 'planted' }) });
    expect(r.refused).toEqual([]);
    expect(r.next.rows[SLOT].sizes.thorp).toMatchObject({ by: 'top', ceiling: ceil2(23 / 50) });
    expect(r.changed).toHaveLength(1);
  });
  test('--write that would raise a ceiling is REFUSED and writes nothing', () => {
    const reg = registerAt(0.4);
    const r = writeRows(reading(50, 40), reading(50, 41), reg);
    expect(r.refused.length).toBeGreaterThan(0);
    expect(r.next).toBe(reg);
    expect(r.changed).toEqual([]);
  });
  test('--write retires a row printed on neither reading by name, with its last reading', () => {
    const r = writeRows({ thorp: new Map() }, { thorp: new Map() }, registerAt(0.4));
    expect(r.next.rows[SLOT]).toBeUndefined();
    expect(r.next.retired[`${SLOT} @ thorp`].last.ceiling).toBe(0.4);
  });
  // SAMENESS-KEYS (the tenth chair's G52): a slot is keyed by its printed position, and a position index drifts when a page
  // gains or loses a row above it; the drifted slot must not come back as a new row at today's (higher) reading.
  const POS2 = 'OverviewTab > Section.2';
  const SLOT2 = slotKey(S, ['', '', '', POS2]);
  /** a reading where the same sentence prints at the DRIFTED position: `same` of `n` places print sentenceA (one a place) */
  const drifted = (/** @type {number} */ n, /** @type {number} */ same, pos = POS2, sentence = sentenceA) => ({ thorp: measureSlots(Array.from({ length: n }, (_, i) => ({ seed: `p-${i}`, surfaces: { [S]: [[i < same ? sentence : `Place number ${'x'.repeat(i + 1)} prints its very own line here.`, '', '', pos]] }, stored: {} }))) });
  test('SAMENESS-KEYS: a drifted slot (same surface, size and sentence) that RISES above the retired ceiling is a rise: the --write is REFUSED', () => {
    const reg = registerAt(0.4);
    const r = writeRows(drifted(50, 40), drifted(50, 41), reg, { classify: () => ({ cls: 'STATE', reason: 'planted' }) });
    expect(r.refused.length).toBe(1);
    expect(r.refused[0]).toContain(SLOT2);
    expect(r.refused[0]).toContain(SLOT);
    expect(r.next).toBe(reg);
    expect(r.changed).toEqual([]);
  });
  test('SAMENESS-KEYS: a drifted slot within its retired ceiling INHERITS that ceiling (not today\'s lower reading); the retirement names its successor', () => {
    const r = writeRows(drifted(50, 15), drifted(50, 16), registerAt(0.4), { classify: () => ({ cls: 'STATE', reason: 'planted' }) });
    expect(r.refused).toEqual([]);
    expect(r.next.rows[SLOT]).toBeUndefined();
    expect(r.next.rows[SLOT2].sizes.thorp).toMatchObject({ by: 'top', ceiling: 0.4, inherits: SLOT });
    expect(r.next.retired[`${SLOT} @ thorp`]).toMatchObject({ sentence: sentenceA, to: SLOT2 });
    expect(r.next.retired[`${SLOT} @ thorp`].last.ceiling).toBe(0.4);
  });
  test('SAMENESS-KEYS: no inheritance across a surface, a size or a sentence: a new slot there is added at its own reading', () => {
    const other = 'A different sentence entirely prints at the drifted place.';
    const r = writeRows(drifted(50, 15, POS2, other), drifted(50, 16, POS2, other), registerAt(0.4), { classify: () => ({ cls: 'STATE', reason: 'planted' }) });
    expect(r.next.rows[SLOT2].sizes.thorp).toMatchObject({ ceiling: ceil2(16 / 50) });
    expect(r.next.rows[SLOT2].sizes.thorp.inherits).toBeUndefined();
    expect(r.next.retired[`${SLOT} @ thorp`].to).toBeUndefined();
    const reg = registerAt(0.4); reg.rows[SLOT].sizes.hamlet = reg.rows[SLOT].sizes.thorp; delete reg.rows[SLOT].sizes.thorp;
    const h = writeRows({ ...drifted(50, 40), hamlet: new Map() }, { ...drifted(50, 41), hamlet: new Map() }, reg, { classify: () => ({ cls: 'STATE', reason: 'planted' }) });
    expect(h.refused).toEqual([]);
    expect(h.next.rows[SLOT2].sizes.thorp).toMatchObject({ ceiling: ceil2(41 / 50) });
  });
  test('--tighten lowers a ceiling loose on both readings to the higher reading, and never raises one', () => {
    const loose = registerAt(0.9);
    const t = tighten(reading(50, 20), reading(50, 22), loose);
    expect(t.next.rows[SLOT].sizes.thorp.ceiling).toBe(ceil2(22 / 50));
    expect(t.changed).toHaveLength(1);
    const tight = registerAt(0.3);
    const u = tighten(reading(50, 40), reading(50, 40), tight);
    expect(u.next.rows[SLOT].sizes.thorp.ceiling).toBe(0.3);
    expect(u.changed).toEqual([]);
    const oneSide = tighten(reading(50, 20), reading(50, 44), loose);
    expect(oneSide.next.rows[SLOT].sizes.thorp.ceiling).toBe(0.9);
  });
});

describe('the slot identity', () => {
  test('a label-prefixed line attributes to the stored path of the stored sentence it contains', () => {
    const stored = { 'With nothing to hold the gate, the watch sleeps by the fire.': ['npcs[].activeConstraint'] };
    const printed = 'Constraint: With nothing to hold the gate, the watch sleeps by the fire.';
    expect(attributionOf(printed, stored, storedHeads(stored))).toEqual(['npcs[].activeConstraint']);
    const m = measureSlots(places(6, () => printed, () => stored));
    expect([...m.keys()]).toEqual([SLOT]);
    expect([...m.values()][0]).toMatchObject({ sentence: printed, paths: { 'npcs[].activeConstraint': 6 } });
  });
  test('three wordings of one pool, held by three stored paths and spread across places, are ONE slot holding every place', () => {
    const lines = ['The town keeps no wards against what walks at night.', 'No charter binds a company of arms to this town.', 'A paid garrison holds the gate and walks the wall.'];
    const paths = ['publicProse.blocks.defense:forces.arcane.sentence', 'publicProse.blocks.defense:forces.charter.sentence', 'publicProse.blocks.defense:forces.force.sentence'];
    const rows = [...places(6, () => lines[0], () => ({ [lines[0]]: [paths[0]] })), ...places(3, () => lines[1], () => ({ [lines[1]]: [paths[1]] })),
      ...places(1, () => lines[2], () => ({ [lines[2]]: [paths[2]] })), ...places(10, () => '')];
    const m = measureSlots(rows);
    expect([...m.keys()]).toEqual([SLOT]);
    const r = /** @type {any} */ ([...m.values()][0]);
    expect(r).toMatchObject({ places: 10, of: 20, distinct: 3, shareIn: 0.6, shareAll: 0.3 });
    expect(Object.keys(r.paths).sort()).toEqual([...paths].sort());
  });
  test('two mirrored paths at one position never flip the slot: a sentence co-held or held alone is the same slot', () => {
    const agree = 'Crime is rising faster than those in charge can answer it.';
    const rows = places(10, (i) => (i < 5 ? agree : `The quarrel number ${'y'.repeat(i)} goes on at the mill.`), (i) => (i < 5
      ? { [agree]: ['pressureSentence', 'powerStructure.recentConflict'] }
      : { [`The quarrel number ${'y'.repeat(i)} goes on at the mill.`]: ['powerStructure.recentConflict'] }));
    expect([...measureSlots(rows).keys()]).toEqual([SLOT]);
  });
});

describe('the register', () => {
  const register = readRegister();
  test('its law, its corpus and its identity rule', () => {
    expect(REGISTER_PATH).toMatch(/scripts\/census\/sameness-census\.register\.json$/);
    expect(register._law).toMatch(/A CEILING ONLY TIGHTENS/);
    expect(register._law).toMatch(/TIED TO THE BAR/);
    expect(register.corpus).toEqual({ ...CORPUS, sizes: [...CORPUS.sizes] });
    expect(typeof register.identity._rule).toBe('string');
    expect(Object.keys(register.rows).length).toBeGreaterThan(100);
  });
  test('every row: a class, a reason cited by symbol, and entries whose ceiling bounds its meet', () => {
    const bad = [];
    for (const [slot, row] of Object.entries(register.rows)) {
      if (slot.split(' | ').length !== 2) bad.push(`${slot}: not <surface> | <position>`);
      if (!/^(CATALOGUE|LABEL|STATE|NARRATIVE)\??$/.test(row.class)) bad.push(`${slot}: class ${row.class}`);
      if (!row.reason || /\.(m?jsx?|json):\d/.test(row.reason)) bad.push(`${slot}: reason cites by line or is empty`);
      for (const [size, e] of Object.entries(row.sizes)) {
        if (!CORPUS.sizes.includes(size)) bad.push(`${slot}: size ${size}`);
        if (!['top', 'seen'].includes(e.by) || !(e.meet <= e.ceiling + 1e-9) || e.ceiling > 1 || Math.round(e.ceiling * 100) / 100 !== e.ceiling
          || e.of !== CORPUS.n || !(e.shareAll <= e.shareIn + 1e-9) || (e.by === 'top' && e.meet < e.shareAll - 1e-9)) bad.push(`${slot} ${size}: ${JSON.stringify(e)}`);
      }
    }
    expect(bad).toEqual([]);
  });
  test('the classes file cites by symbol, never by line', () => {
    const classes = readFileSync(new URL('../../scripts/census/sameness-census.classes.json', import.meta.url), 'utf8');
    expect(classes.match(/\.(m?jsx?):\d+/g) || []).toEqual([]);
  });
});

/** E13d-2: the four homes the skipped sentences are derived from (the guard does not read them as pools). */
const SKIP_HOMES = new Set(['data/faceHonorifics.js', 'data/institutionalCatalog.js', 'generators/people/mintTitles.js', 'copy/sectionHelp.js']);
/**
 * E13d-2: read ONE source file's literals by its syntax tree. `rel` is the path under src/. Every string literal, template
 * (its expressions as `{…}`), JSX text and JSON value is cut by the door's `sentencesOf` after the door's digit mask; an
 * object key is not a line; an array whose every element is a role title is a title table. Style sheets hold no pool.
 * @param {string} rel @param {string} src @param {Set<string>} skip @param {Set<string>} titles
 */
function scanSource(rel, src, skip, titles) {
  /** @type {{ hits: string[], unread: string[], literals: number, titleTables: number }} */
  const out = { hits: [], unread: [], literals: 0, titleTables: 0 };
  const check = (/** @type {string} */ text, /** @type {string} */ at) => { out.literals++; for (const x of sentencesOf(String(text).replace(/\d+/g, '0'))) if (skip.has(x)) out.hits.push(`${rel}${at}: ${x}`); };
  if (/\.css$/.test(rel)) return out;
  if (/\.json$/.test(rel)) {
    let v; try { v = JSON.parse(src); } catch (e) { out.unread.push(`${rel}: ${String(e)}`); return out; }
    const walkJson = (/** @type {unknown} */ x) => { if (typeof x === 'string') check(x, ''); else if (Array.isArray(x)) x.forEach(walkJson); else if (x && typeof x === 'object') Object.values(x).forEach(walkJson); };
    walkJson(v); return out;
  }
  if (/\.ts$/.test(rel)) {
    const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true);
    if (/** @type {any} */ (sf).parseDiagnostics?.length) { out.unread.push(`${rel}: ${/** @type {any} */ (sf).parseDiagnostics.length} parse errors`); return out; }
    const walkTs = (/** @type {import('typescript').Node} */ n) => { if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) check(n.text, ''); ts.forEachChild(n, walkTs); };
    walkTs(sf); return out;
  }
  if (!/\.(m?js|jsx)$/.test(rel)) { out.unread.push(`${rel}: not a source the guard can read`); return out; }
  let ast; try { ast = parse(src, { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true }, loc: true }); } catch (e) { out.unread.push(`${rel}: ${String(e)}`); return out; }
  const walk = (/** @type {any} */ n) => {
    if (!n || typeof n.type !== 'string') return;
    if (n.type === 'Literal') { if (typeof n.value === 'string') check(n.value, `:${n.loc.start.line}`); return; }
    if (n.type === 'TemplateLiteral') { check(n.quasis.map((/** @type {any} */ q, /** @type {number} */ i) => q.value.cooked + (i < n.expressions.length ? '{…}' : '')).join(''), `:${n.loc.start.line}`); n.expressions.forEach(walk); return; }
    if (n.type === 'JSXText') { if (n.value.trim()) check(n.value.trim(), `:${n.loc.start.line}`); return; }
    if (n.type === 'ArrayExpression' && n.elements.length >= 2 && n.elements.every((/** @type {any} */ e) => e?.type === 'Literal' && typeof e.value === 'string' && titles.has(e.value))) { out.titleTables++; return; }
    const isStr = (/** @type {any} */ e) => (e?.type === 'Literal' && typeof e.value === 'string') || e?.type === 'TemplateLiteral';
    if (n.type === 'ArrayExpression' && n.elements.length >= 2 && isStr(n.elements[0]) && titles.has(n.elements[0].value) && !n.elements.slice(1).some(isStr)) { out.titleTables++; n.elements.slice(1).forEach(walk); return; } // a row keyed by its title (["<title>", 304, [...]]): the title is the row's key, its body is read
    for (const [k, c] of Object.entries(n)) {
      if (k === 'loc' || k === 'range' || k === 'parent') continue;
      if (n.type === 'Property' && k === 'key' && !n.computed) continue; // a key is never printed as a line
      if (Array.isArray(c)) c.forEach(walk); else if (c && typeof c === 'object') walk(c);
    }
  };
  walk(ast); return out;
}
/** E13d-2: every file under src/, read by `scanSource`; the four homes are not read as pools. @param {Set<string>} skip @param {Set<string>} titles */
function scanSourceTree(skip, titles) {
  const root = fileURLToPath(new URL('../../src/', import.meta.url));
  /** @type {{ hits: string[], unread: string[], literals: number, titleTables: string[], files: number }} */
  const out = { hits: [], unread: [], literals: 0, titleTables: [], files: 0 };
  const walkDir = (/** @type {string} */ d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, e.name);
      if (e.isDirectory()) { walkDir(full); continue; }
      const rel = relative(root, full).split(sep).join('/');
      if (SKIP_HOMES.has(rel)) continue;
      out.files++;
      const r = scanSource(rel, readFileSync(full, 'utf8'), skip, titles);
      out.hits.push(...r.hits); out.unread.push(...r.unread); out.literals += r.literals;
      if (r.titleTables) out.titleTables.push(rel);
    }
  };
  walkDir(root);
  return out;
}

describe('E13d (G35): the door does not count a role title or a fixed caption as a drawn sentence', () => {
  const skip = notDrawnSentences();
  test('not vacuous: the four long face titles the door met and the NPCs pill are in the set', () => {
    for (const x of ['the senior craft-guild master', 'the senior charter master', 'the speaker of the assembly', 'the guildmaster of thieves', 'The people worth knowing and what each one holds.']) expect(skip.has(x)).toBe(true);
  });
  test('every skipped string comes from the homes, by import: a face title (its own case or sentence case) or a sentence of a section caption', () => {
    const homeTitles = new Set([...Object.keys(FACE_HONORIFICS), ...Object.keys(FACE_HONORIFICS_INLAND), ...Object.values(FACE_HONORIFICS_BY_CULTURE).flatMap((t) => Object.keys(t)),
      ...faceRows().map((r) => r.face).filter((f) => typeof f === 'string'), ...Object.values(SEAT_MINT_TITLES).map(String), ...Object.values(OTHER_MINT_ROWS).map((r) => String(r.title))]);
    for (const t of roleTitles()) expect({ t, home: homeTitles.has(t) }).toEqual({ t, home: true });
    expect([...fixedCaptions()].sort()).toEqual([...Object.values(SECTION_HELP), SYSTEMS_HEALTH_VINTAGE].sort());
    const fromHomes = new Set([...roleTitles().flatMap((t) => [t, t.charAt(0).toUpperCase() + t.slice(1)]), ...fixedCaptions()].flatMap((x) => sentencesOf(x.replace(/\d+/g, '0'))));
    expect([...skip].filter((x) => !fromHomes.has(x))).toEqual([]);
  });
  // E13d-2 (the tenth chair's G52): THE GUARD READS EVERY POOL WHATEVER ITS SHAPE AND HOME. A pool is handed to the door
  // (`drawDeclared` and its kin) at its call site, so no register resolves a pool to its lines: the guard reads every string,
  // template and JSX text literal of every source file under src/ by its syntax tree (plain arrays, `{ text }` rows, nested
  // tables, a pool built inside a function), cut and masked as the door cuts and masks. A literal outside the four homes that
  // is a skipped sentence FAILS, save a table whose every element is a role title (an order, a key list), a row keyed by its title
  // (`["<title>", 304, [...]]`: the key passes, the body is read) and an object KEY (a key is never printed as a line). A file the guard cannot read FAILS: it is never skipped.
  test('no line of any pool under src/ is in the set, whatever its shape and home; and the register\'s drawn rows (STATE, NARRATIVE, CATALOGUE) neither', () => {
    const drawnRows = Object.entries(readRegister().rows).filter(([, r]) => /^(STATE|NARRATIVE|CATALOGUE)\??$/.test(r.class));
    expect(drawnRows.length).toBeGreaterThan(100);
    expect(drawnRows.filter(([, r]) => skip.has(r.sentence)).map(([k]) => k)).toEqual([]);
    const scan = scanSourceTree(skip, new Set(roleTitles()));
    expect(scan.unread).toEqual([]);
    expect(scan.files).toBeGreaterThan(2500);
    expect(scan.literals).toBeGreaterThan(200000); // not vacuous: the second reader counted 304,427 source literals
    expect(scan.titleTables).toEqual(expect.arrayContaining(['data/stressPowerFaces.js', 'data/people/titleSecretsPresentations.js'])); // not vacuous: a literal title table outside the homes is met and passed over as a table
    expect(scan.hits).toEqual([]);
  }, 300000);
  test('the guard reads a pool of any shape: a planted skipped sentence in a { text } row, a nested table, a template, JSX text or a JSON value is a hit; a key and a title table are not; an unreadable file is a failure', () => {
    const titles = new Set(roleTitles());
    const caption = 'Who holds power and how firmly.';
    expect(skip.has(caption)).toBe(true);
    const plants = {
      'data/a.js': `export const P = Object.freeze({ food: [{ id: 'F1', text: 'Who holds power and how firmly.', needs: [] }] });`,
      'domain/b.js': `const T = { a: { b: [['x', "Who holds power and how firmly."]] } }; export default T;`,
      'domain/c.js': `export const f = (n) => \`Who holds power and how firmly.\`;`,
      'components/d.jsx': `export const D = () => <p>Who holds power and how firmly.</p>;`,
    };
    for (const [file, src] of Object.entries(plants)) expect({ file, hits: scanSource(file, src, skip, titles).hits.length }).toEqual({ file, hits: 1 });
    expect(scanSource('data/e.json', JSON.stringify({ k: ['a', caption] }), skip, titles).hits).toHaveLength(1);
    expect(scanSource('data/f.js', `export const K = { 'Who holds power and how firmly.': 1 };`, skip, titles).hits).toEqual([]);
    expect(scanSource('data/g.js', `export const ORDER = ['the senior craft-guild master', 'the senior charter master'];`, skip, titles)).toMatchObject({ hits: [], titleTables: 1 });
    // the chair's condition (G52, accepted reading): a table of titles with ONE drawn sentence added is NOT a title table
    expect(scanSource('data/m.js', `export const P = ['the senior craft-guild master', 'the senior charter master', 'Who holds power and how firmly.'];`, skip, titles)).toMatchObject({ titleTables: 0, hits: ['data/m.js:1: the senior craft-guild master', 'data/m.js:1: the senior charter master', 'data/m.js:1: Who holds power and how firmly.'] });
    expect(scanSource('data/k.js', `export const ROWS = [['the senior charter master', 304, [['Who holds power and how firmly.', 'x']]]];`, skip, titles)).toMatchObject({ hits: ['data/k.js:1: Who holds power and how firmly.'], titleTables: 1 }); // a row keyed by its title: the key passes, its body is read
    expect(scanSource('data/l.js', `export const P = ['the senior charter master', 'A line of the pool that is long enough.'];`, skip, titles).hits).toEqual(['data/l.js:1: the senior charter master']); // a title as a LINE of a pool is a hit
    expect(scanSource('data/h.js', `export const X = [ 'Who holds power and how firmly.' `, skip, titles).unread).toHaveLength(1);
    expect(scanSource('data/i.yaml', 'x: 1', skip, titles).unread).toHaveLength(1);
  });
  test('the door skips by the whole sentence, never by length or by slot: a title alone is not counted, a drawn line beside it still is, and a line that holds a title is counted', () => {
    const title = 'the senior craft-guild master';
    const drawn = 'The guild keeps its own books and will not open them.';
    const holds = 'The senior craft-guild master keeps the guild\'s books.';
    const sameLength = 'x'.repeat(title.length - 4) + ' y z'; // as long as the title, with spaces: counted
    expect(sameLength.length).toBe(title.length);
    const rows = Array.from({ length: 20 }, (_, i) => ({ seed: `p-${i}`, surfaces: { [S]: [[title, '', '', POS], [i < 10 ? drawn : holds, '', '', POS], [sameLength, '', '', 'Other > Row']] }, stored: {} }));
    const m = measureSlots(rows);
    const at = /** @type {any} */ (m.get(SLOT));
    expect(at).toMatchObject({ places: 20, distinct: 2, topPlaces: 10 });
    expect([at.sentence === drawn || at.sentence === holds]).toEqual([true]);
    expect(m.get(slotKey(S, ['', '', '', 'Other > Row']))).toMatchObject({ places: 20, distinct: 1, sentence: sameLength });
    const onlyTitle = measureSlots(places(20, () => title));
    expect([...onlyTitle.keys()]).toEqual([]);
  });
});
