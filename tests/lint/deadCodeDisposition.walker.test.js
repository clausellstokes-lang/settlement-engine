/**
 * deadCodeDisposition.walker.test.js — THE DARK-MODULE DISPOSITION WALKER (FIX-D9,
 * chartered by the chair at ODQ §934.47 addendum 87).
 *
 * THE CLASS: a module that nothing reaches is invisible to every census built on
 * `grep`, because its own test still imports it. `docs/DEAD_CODE_DISPOSITION.md`'s
 * Round-3 rows are four such modules, and the doc records for each whether being dark
 * is DELIBERATE (a landed law ahead of its wiring) or a RETIREMENT waiting on the
 * owner. Prose decays; this file makes both halves of that record executable.
 *
 * ── WHAT IT PINS, AND IN WHICH DIRECTION ────────────────────────────────────────
 *
 *   1. THE HEADER IS PRESENT AND BYTE-EXACT. Every DARK-BY-DESIGN module carries
 *      CANONICAL_DARK_UNTIL verbatim. Delete it, reword it, or let two modules drift
 *      to two spellings, and this reds. That line is the only thing standing between
 *      a future reader and "this file has no importers, so it is dead".
 *   2. THE DARKNESS IS STILL TRUE. Every DARK-BY-DESIGN and RETIRE-PROPOSED module has
 *      ZERO importers outside `tests/`, measured by RESOLVING each import specifier to
 *      a path rather than by matching a name. A revival reds it AND NAMES THE IMPORTER,
 *      because the cure then is to strike the row, not to silence the walker.
 *   3. A RETIREMENT STAYS RETIRED. Every RETIRED module must be ABSENT from the tree.
 *      A retirement is a decision, not an event, and a file reappearing at a retired
 *      path is either a bad merge or a revival nobody re-argued.
 *   4. THE DOC AND THE CODE CANNOT DRIFT. The canonical sentence must appear in the
 *      doc too, so the disposition rows and the module headers say one thing.
 *
 * ⛔ THE ROSTER IS PARSED FROM THE DOC'S OWN TABLE, NEVER HAND-LISTED HERE. A hand list
 * is a second copy of the estate's state, and the copy is what rots: a row struck from
 * the doc would keep being enforced, and a row added would be enforced by nothing. The
 * parser keys on COLUMN NAME (`File`, `Disposition`), not column index, so re-ordering
 * or widening the table does not silently re-point the walk. Every table in the doc
 * carrying both columns is read, so a Round-4 section is governed the day it lands.
 *
 * ⚠ WHY A `rationale` ROW RATHER THAN A SWEEP PLANT (the manifest's own question). Every
 * figure here is DERIVED FROM DISK on each run and asserted as an exact set in both
 * directions: arm 2 reds on a module the doc names that has gained an importer, arm 1
 * reds on a module whose header was removed, and the parse arm reds on a table that
 * stopped yielding rows. The only available "mutation" is deleting a row or a marker,
 * which is precisely what those arms already assert; a plant would restate the
 * assertion rather than test it. The four controls below are the substitute, and each
 * drives the SAME function the live arm calls rather than a second copy of it.
 *
 * @enforced-by scripts/mutation-coverage-manifest.json (its own rationale row)
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DOC_REL = 'docs/DEAD_CODE_DISPOSITION.md';

/**
 * ⛔ THE CHAIR'S RULED PACKET SLOT, VERBATIM (ODQ §934.47 addendum 87). It is a
 * SLOT, not a schedule: the wiring car is chartered the day the owner signs the
 * register, and until then the darkness is the owner's standing decision rather
 * than an oversight. Changing this sentence is changing that ruling, so it is
 * pinned byte-exact in the three modules and required to appear in the doc.
 */
const CANONICAL_DARK_UNTIL =
  "// dark-until: Register VII's wiring car — chartered the day the owner signs "
  + '`REGISTER_VII_SIGNATURE`; until then DELIBERATE-DARK by the owner\'s unsigned register';

/**
 * The dispositions this walker enforces, and what each one owes. The three lists
 * PARTITION the vocabulary, and arm 1 asserts that partition is total — so a new
 * disposition word cannot be introduced in the doc and enforced by nothing.
 *
 *   EXISTENCE_GOVERNED  the module must BE THERE and must stay unimported
 *   ABSENCE_GOVERNED    the module must be GONE, and reappearing is the finding
 *   UNGOVERNED          LIVE: the zero was refuted, so neither arm applies
 */
const HEADER_OWED = 'DARK-BY-DESIGN';
const EXISTENCE_GOVERNED = ['DARK-BY-DESIGN', 'RETIRE-PROPOSED'];
const ABSENCE_GOVERNED = ['RETIRED'];
const UNGOVERNED = ['LIVE'];

/**
 * Trees an importer may live in for the module to count as REVIVED. `tests/` is
 * excluded on purpose and is the whole point of the walk: every module below already
 * has exactly one test importer, which is what makes it invisible to a name census.
 */
const PRODUCTION_ROOTS = ['src', 'scripts', 'api', 'supabase', 'e2e'];
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'coverage', '.vite', 'build']);
const SOURCE_EXT = /\.(jsx?|mjs|cjs|tsx?)$/;

// ── the instruments ──────────────────────────────────────────────────────────

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    if (SKIP_DIRS.has(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (SOURCE_EXT.test(e)) out.push(p);
  }
  return out;
}

/** Comments stripped before specifiers are read: a path NAMED in prose is not an edge. */
const stripComments = (code) => code
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

/** Resolve a RELATIVE specifier the way the bundler does. Bare specifiers cannot name
 *  a repo module, so they are dropped rather than guessed at. */
function resolveSpecifier(fromFile, spec) {
  if (!spec.startsWith('.')) return null;
  const base = resolve(dirname(fromFile), spec);
  const candidates = [base, `${base}.js`, `${base}.jsx`, `${base}.mjs`,
    join(base, 'index.js'), join(base, 'index.jsx')];
  for (const c of candidates) if (existsSync(c) && statSync(c).isFile()) return c;
  return null;
}

/**
 * Every specifier `code` imports, in the four shapes this estate actually writes:
 * static `import`/`export … from`, dynamic `import()`, `require()`, and the vitest
 * mock family (a mock names a real module and keeps it alive as a contract).
 * @returns {string[]} raw specifiers, unresolved
 */
export function specifiersIn(code) {
  const clean = stripComments(code);
  const out = [];
  for (const m of clean.matchAll(/(?:^|[^.\w])import\s+(?:[^'"()]*?\sfrom\s+)?['"]([^'"]+)['"]/g)) out.push(m[1]);
  for (const m of clean.matchAll(/(?:^|[^.\w])export\s+[^'"]*?\sfrom\s+['"]([^'"]+)['"]/g)) out.push(m[1]);
  for (const m of clean.matchAll(/\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g)) out.push(m[1]);
  for (const m of clean.matchAll(/\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g)) out.push(m[1]);
  for (const m of clean.matchAll(/\bvi\.(?:mock|doMock|importActual|importMock)\s*\(\s*['"]([^'"]+)['"]/g)) out.push(m[1]);
  return out;
}

/**
 * Importers of `targetRel` across `roots`, by RESOLVED PATH.
 * @param {string} targetRel repo-relative module
 * @param {string[]} roots trees to search
 * @returns {string[]} sorted repo-relative importers
 */
export function importersOf(targetRel, roots) {
  const target = join(ROOT, targetRel);
  const found = new Set();
  for (const root of roots) {
    for (const file of walk(join(ROOT, root))) {
      if (file === target) continue;
      for (const spec of specifiersIn(readFileSync(file, 'utf8'))) {
        if (resolveSpecifier(file, spec) === target) found.add(relative(ROOT, file).split('\\').join('/'));
      }
    }
  }
  return [...found].sort();
}

/**
 * Parse EVERY markdown table in `text` that carries both a `File` and a `Disposition`
 * column, keyed BY NAME so a re-ordered or widened table cannot silently re-point this
 * walk. Returns one row per module.
 * @returns {{ path: string, disposition: string, table: number }[]}
 */
export function parseDispositionRows(text) {
  const lines = text.split('\n');
  const rows = [];
  let table = 0;
  const cells = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
  for (let i = 0; i < lines.length; i += 1) {
    if (!lines[i].trim().startsWith('|')) continue;
    const head = cells(lines[i]).map((c) => c.replace(/\*/g, '').trim());
    const fileCol = head.indexOf('File');
    const dispCol = head.indexOf('Disposition');
    if (fileCol === -1 || dispCol === -1) continue;
    if (!(lines[i + 1] || '').trim().startsWith('|-')) continue;   // the separator row
    table += 1;
    for (let k = i + 2; k < lines.length && lines[k].trim().startsWith('|'); k += 1) {
      const row = cells(lines[k]);
      const path = (row[fileCol] || '').match(/`([^`]+)`/)?.[1];
      const disposition = (row[dispCol] || '').replace(/\*/g, '').trim();
      if (path && disposition) rows.push({ path, disposition, table });
    }
  }
  return rows;
}

// ── the live measurement, taken once ─────────────────────────────────────────

const docText = readFileSync(join(ROOT, DOC_REL), 'utf8');
const rows = parseDispositionRows(docText);
const governed = rows.filter((r) => EXISTENCE_GOVERNED.includes(r.disposition));
const retired = rows.filter((r) => ABSENCE_GOVERNED.includes(r.disposition));
const darkByDesign = rows.filter((r) => r.disposition === HEADER_OWED);

process.stdout.write(
  `\n[deadCodeDisposition] ${DOC_REL}: ${rows.length} dispositioned row(s) — `
  + `${darkByDesign.length} ${HEADER_OWED}, `
  + `${governed.length - darkByDesign.length} RETIRE-PROPOSED, ${retired.length} RETIRED; `
  + `importer scan over ${PRODUCTION_ROOTS.join('/')}\n`,
);

describe('dead-code disposition — the doc is executable, not a promise', () => {
  it('THE PARSE IS NOT VACUOUS: the doc still yields its rows and every path exists', () => {
    expect(rows.length, `${DOC_REL} yielded no dispositioned rows — the table moved or was reshaped`)
      .toBeGreaterThanOrEqual(4);
    expect(darkByDesign.length, `${DOC_REL} yielded no ${HEADER_OWED} rows`).toBeGreaterThanOrEqual(3);

    // ⛔ THE PARTITION IS TOTAL. Stated as a set-equality rather than a per-category
    // floor, because a floor rots the moment a category empties (RETIRE-PROPOSED went to
    // zero the day addendum 98 signed the retirement, and a `>= 1` there would have RED
    // on a correct tree). What must never happen is a row falling out of EVERY arm.
    const vocabulary = [...EXISTENCE_GOVERNED, ...ABSENCE_GOVERNED, ...UNGOVERNED];
    const unknown = [...new Set(rows.map((r) => r.disposition))].filter((d) => !vocabulary.includes(d));
    expect(
      unknown,
      `\nUnknown disposition word(s) in ${DOC_REL}. The vocabulary is ${vocabulary.join(', ')};`
      + ` a new word needs an arm here before it means anything, or the row it labels is`
      + ` enforced by nothing:\n${unknown.join('\n')}\n`,
    ).toEqual([]);
    expect(
      governed.length + retired.length + rows.filter((r) => UNGOVERNED.includes(r.disposition)).length,
      'a dispositioned row fell out of every category — the partition above is not total',
    ).toBe(rows.length);

    const missing = governed.filter((r) => !existsSync(join(ROOT, r.path))).map((r) => r.path);
    expect(
      missing,
      `\nThese modules are dispositioned in ${DOC_REL} but are not on disk. A module that was`
      + ` DELETED must have its row flipped to RETIRED, not left standing as though it were`
      + ` still there:\n${missing.join('\n')}\n`,
    ).toEqual([]);
  });

  it('every RETIRED module is still ABSENT from the tree', () => {
    // A retirement is a decision, not an event: the module staying gone is the thing that
    // was signed. A file reappearing at a retired path is either a bad merge or a revival
    // nobody re-argued, and both want a human before the path is live again.
    const resurrected = retired
      .filter((r) => existsSync(join(ROOT, r.path)))
      .map((r) => r.path);
    expect(
      resurrected,
      `\n⛔ A module ${DOC_REL} records as RETIRED is back on disk. It was deleted under a signed`
      + ` decision (§934.47 addendum 98 for the Round-3 row), so its return is either a merge`
      + ` accident or a revival that needs re-arguing — RE-GRADE THE ROW if the revival is`
      + ` wanted, and delete the file again if it is not:\n${resurrected.join('\n')}\n`,
    ).toEqual([]);
  });

  // ⚠ Every title here is a PLAIN STRING LITERAL, never a template: the lighting census
  // reads titles statically, and a computed title is one it cannot credit.
  it('every DARK-BY-DESIGN module carries the canonical dark-until line, byte-exact', () => {
    const offenders = [];
    for (const { path } of darkByDesign) {
      const full = join(ROOT, path);
      if (!existsSync(full)) continue;                     // named by the arm above
      const lines = readFileSync(full, 'utf8').split('\n');
      const marked = lines.filter((l) => l.startsWith('// dark-until:'));
      if (marked.length === 0) offenders.push(`${path}: carries NO '// dark-until:' line`);
      else if (!marked.includes(CANONICAL_DARK_UNTIL)) {
        offenders.push(`${path}: dark-until line is not the chair's ruled value.\n    found:  ${marked[0]}`);
      }
    }
    expect(
      offenders,
      `\n⛔ A ${HEADER_OWED} module's header is the only thing telling the next reader that having`
      + ` no importer is DELIBERATE. Restore the line exactly, or change the module's disposition in`
      + ` ${DOC_REL} first:\n    want:   ${CANONICAL_DARK_UNTIL}\n${offenders.join('\n')}\n`,
    ).toEqual([]);
  });

  it('every governed module still has ZERO importers outside tests/', () => {
    const revived = [];
    for (const { path, disposition } of governed) {
      if (!existsSync(join(ROOT, path))) continue;
      const importers = importersOf(path, PRODUCTION_ROOTS);
      if (importers.length) revived.push(`${path} (${disposition}) is imported by: ${importers.join(', ')}`);
    }
    expect(
      revived,
      `\n⭐ GOOD NEWS, PROBABLY: a module ${DOC_REL} records as dark now has a real importer, so the`
      + ` disposition is out of date. STRIKE OR RE-GRADE THE ROW (and drop the dark-until header if it`
      + ` was DARK-BY-DESIGN) — do not silence this walker, which is the only thing that would have`
      + ` noticed:\n${revived.join('\n')}\n`,
    ).toEqual([]);
  });

  it('the doc states the canonical slot too, so doc and code cannot drift', () => {
    // The sentence, minus the comment marker: the doc writes it as prose in the rows.
    const sentence = CANONICAL_DARK_UNTIL.replace(/^\/\/ dark-until: /, '');
    expect(
      docText.includes(sentence),
      `${DOC_REL} no longer states the chair's ruled packet slot verbatim. The modules pin it and the`
      + ` doc must agree:\n    want: ${sentence}`,
    ).toBe(true);
  });
});

describe('dead-code disposition — the controls (each proves an arm CAN red)', () => {
  it('CONTROL: the importer scanner finds a real importer (else every arm passes vacuously)', () => {
    // Driven on the SAME function the live arm calls. densityBands.js is imported by the
    // density family; if this returns nothing the scanner is broken and arm 3 is a lie.
    const live = importersOf('src/domain/density/densityBands.js', PRODUCTION_ROOTS);
    expect(
      live.length,
      'the resolved-path importer scanner found NO importer of a module known to have several',
    ).toBeGreaterThanOrEqual(2);
    expect(live).toContain('src/generators/density/densityAscension.js');
  });

  it('CONTROL: the specifier reader sees all five shapes, and reads none out of a comment', () => {
    const seen = specifiersIn([
      "import { a } from './static.js';",
      "export { b } from './reexport.js';",
      "const c = await import('./dynamic.js');",
      "const d = require('./required.js');",
      "vi.mock('./mocked.js', () => ({}));",
      "// import { e } from './commented.js';",
      "/* import { f } from './blocked.js'; */",
    ].join('\n'));
    expect(seen.sort()).toEqual(
      ['./dynamic.js', './mocked.js', './reexport.js', './required.js', './static.js'],
    );
  });

  it('CONTROL: the header detector reports ABSENCE and refuses a near-miss spelling', () => {
    const has = (src) => src.split('\n').includes(CANONICAL_DARK_UNTIL);
    expect(has(`/** header */\n${CANONICAL_DARK_UNTIL}\nimport x from './y.js';`)).toBe(true);
    expect(has("/** header */\nimport x from './y.js';")).toBe(false);
    // A reworded slot is a changed ruling, so it must NOT satisfy the pin.
    expect(has(`${CANONICAL_DARK_UNTIL.replace('DELIBERATE-DARK', 'deliberately dark')}`)).toBe(false);
  });

  it('CONTROL: the absence check sees a file that IS there (else RETIRED rows self-approve)', () => {
    // The RETIRED arm is an existsSync over paths that are all absent today, so on its own
    // it would pass even if existsSync were broken or the paths were misspelled. Drive it
    // on a path known to be present, and on the retired paths' own DIRECTORIES, so a typo
    // in a row cannot masquerade as a successful retirement.
    expect(existsSync(join(ROOT, DOC_REL)), 'existsSync cannot see a file that is there').toBe(true);
    const unrooted = retired.filter((r) => !existsSync(join(ROOT, r.path.split('/').slice(0, -1).join('/'))));
    expect(
      unrooted.map((r) => r.path),
      `\nA RETIRED row names a path whose DIRECTORY does not exist either. That is usually a`
      + ` misspelled row rather than a retirement, and it would pass the absence arm forever:\n`
      + `${unrooted.map((r) => r.path).join('\n')}\n`,
    ).toEqual([]);
  });

  it('CONTROL: the table parser keys on column NAME and refuses a table without one', () => {
    const doc = [
      '| File | Lines | Disposition |',
      '|---|---|---|',
      '| `src/a.js` | 10 | **DARK-BY-DESIGN** |',
      '',
      '| Disposition | File |',                       // columns REVERSED
      '|---|---|',
      '| **RETIRE-PROPOSED** | `src/b.js` |',
      '',
      '| File | Lines | Purpose | Recommendation |',  // no Disposition column
      '|---|---|---|---|',
      '| `src/c.js` | 10 | a thing | **DELETE** |',
    ].join('\n');
    const parsed = parseDispositionRows(doc);
    expect(parsed.map((r) => `${r.path}=${r.disposition}`))
      .toEqual(['src/a.js=DARK-BY-DESIGN', 'src/b.js=RETIRE-PROPOSED']);
    expect(parseDispositionRows('no tables here')).toEqual([]);
  });
});
