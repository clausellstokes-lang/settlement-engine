/**
 * spBandFamilies.walker.test.js — SP-A. THE BAND-FAMILY RECONCILIATION WALKER.
 *
 * TWO CLASSES, ONE FILE, because they are two halves of the same claim: that a band
 * exists in exactly one place and says exactly one thing.
 *
 * ── HALF ONE: BANDS-LINE <-> TUNING-TABLE TOTALITY, BOTH DIRECTIONS ─────────────
 *
 * The tuning-ledger audit measured FOURTEEN drift instances between what a wave says it
 * bands and what its volume's tuning table lists for owner signature. Five of them were
 * significance bands. Drift in that pair is silent and expensive: a band named in a wave
 * and missing from the table never reaches the owner's signature, and a table row with
 * no wave behind it is a number nobody can explain at the soak redo.
 *
 * The cure is mechanical rather than editorial. Every SP wave block in §5 of
 * docs/DESIGN_FP_ARCH_SP.md carries a `**Bands:**` line; §7 lists each wave's rows; the
 * two sets must be EQUAL, verbatim row phrase for verbatim row phrase, in both
 * directions. A wave that has not yet authored its Bands line sits in a frozen
 * SHRINK-ONLY backlog, so the walker cannot red the volume at birth and every later SP
 * wave has to shrink the list by one to land.
 *
 * THE WAR VOLUME IS A FROZEN BACKLOG, NOT A SUBJECT. Its §7 is a compressed gathering
 * ("WR-1 term weights + deciding margin · WR-2 learn/decay/…") rather than a row-aligned
 * table, so its nine Bands lines cannot be reconciled against it without rewriting a
 * closed program's volume. They are counted and frozen shrink-only instead: a new Bands
 * line appearing in a build-complete volume is worth a look, and a removed one is a win.
 *
 * ── HALF TWO: THE MINT IS SINGULAR, AND THE TWO FAMILIES SHARE NO WORD ──────────
 *
 * SP-6b's severity ladder is a genuine mint (five severity spellings were measured in
 * the tree on 2026-08-04 and not one grades an outcome — the census is in the module
 * header). A mint's whole value is that it is the only one, and its rungs were chosen
 * to appear as quoted literals ZERO times anywhere under src/ so that reading the wrong
 * ladder is impossible by SPELLING rather than by discipline. This scan keeps that true
 * from here on: no module but the family's own may speak a severity rung, and the
 * significance family may be declared exactly once.
 *
 * BOTH HALVES CARRY A POSITIVE CONTROL. A doc parser that stopped matching would report
 * empty sets and pass having proved nothing; a literal scan that stopped matching would
 * report no offenders and do the same. Each is proven live against a subject that is
 * genuinely non-empty before any absence is asserted.
 *
 * @enforced-by itself (doc parsing + a source scan; no runtime coupling)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  SIGNIFICANCE_CLASSES,
  SEVERITY_LADDER,
} from '../../src/domain/worldPulse/bandFamilies.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const SP_VOLUME = 'docs/DESIGN_FP_ARCH_SP.md';
const WAR_VOLUME = 'docs/DESIGN_WAR_RULINGS_ARCHITECTURE.md';

/** The one module allowed to spell the two families. */
const FAMILY_HOME = 'src/domain/worldPulse/bandFamilies.js';

/**
 * SP waves that owe a Bands line and have not authored one yet. SHRINK-ONLY: each later
 * SP wave lands its own line and removes its id here. A wave may not be ADDED.
 */
const SP_WAVES_OWING_A_BANDS_LINE = Object.freeze(['SP-B', 'SP-C', 'SP-D', 'SP-E']);

/**
 * SP waves that carry no bands BY DESIGN, recorded so the totality below is a partition
 * rather than a list with a hole: SP-B2 is a supply shim riding SP-B's flags and authors
 * no band of its own; SP-F is a declared NON-WAVE (SP-8's era presets are J-D12's).
 */
const SP_WAVES_WITH_NO_BANDS_BY_DESIGN = Object.freeze(['SP-B2', 'SP-F']);

/** The war volume's Bands lines at this commit. SHRINK-ONLY (measured `<=`). */
const WAR_VOLUME_FROZEN_BANDS_LINES = 9;

const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

/** Collapse a wrapped markdown paragraph to one line. */
const flatten = (s) => s.replace(/\s+/g, ' ').trim();

/** Strip one trailing sentence period from a row phrase. */
const stripDot = (s) => s.replace(/\.$/, '').trim();

/**
 * Split a markdown doc into `### <WAVE ID> — …` blocks.
 * @param {string} src @returns {Map<string, string>}
 */
function waveBlocks(src) {
  const out = new Map();
  const lines = src.split('\n');
  let current = null;
  let buf = [];
  const flush = () => { if (current) out.set(current, buf.join('\n')); };
  for (const line of lines) {
    const m = line.match(/^### ((?:SP|WR|GR|TR|WF|POP|IN|INT|CW)-[A-Z0-9]+)\b/);
    if (m) { flush(); current = m[1]; buf = []; continue; }
    if (/^## /.test(line)) { flush(); current = null; buf = []; continue; }
    if (current) buf.push(line);
  }
  flush();
  return out;
}

/**
 * The `**Bands…:**` paragraph of a wave block, flattened, or null.
 * @param {string} block @returns {string | null}
 */
function bandsParagraph(block) {
  const lines = block.split('\n');
  const start = lines.findIndex((l) => /^(?:- )?\*\*Bands\b/.test(l));
  if (start < 0) return null;
  const buf = [];
  for (let i = start; i < lines.length; i += 1) {
    if (i > start && lines[i].trim() === '') break;
    buf.push(lines[i]);
  }
  return flatten(buf.join(' ')).replace(/^(?:- )?\*\*Bands[^*]*:\*\*\s*/, '');
}

/**
 * §7's per-wave rows, keyed by wave id.
 * @param {string} src @returns {Map<string, string[]>}
 */
function tuningTableRows(src) {
  const start = src.indexOf('## §7 THE TUNING SURFACE');
  const end = src.indexOf('## §8 ');
  if (start < 0 || end < 0 || end <= start) {
    throw new Error(`${SP_VOLUME}: §7/§8 anchors moved — re-anchor this walker`);
  }
  const body = src
    .slice(start, end)
    .split('\n')
    .filter((l) => !/^## /.test(l))
    .join(' ');
  const flat = flatten(body);
  const out = new Map();
  const parts = flat.split(/(?=\bSP-[A-Z]\d?:)/);
  for (const part of parts) {
    const m = part.match(/^(SP-[A-Z]\d?):\s*([\s\S]*)$/);
    if (!m) continue;
    out.set(m[1], m[2].split('·').map((r) => stripDot(r.trim())).filter(Boolean));
  }
  return out;
}

const spSrc = read(SP_VOLUME);
const warSrc = read(WAR_VOLUME);
const spBlocks = waveBlocks(spSrc);
const spTuning = tuningTableRows(spSrc);

describe('SP band families — Bands line <-> tuning table, both directions', () => {
  test('the doc parsers see a real denominator (guard the guard)', () => {
    expect([...spBlocks.keys()].sort()).toEqual(['SP-A', 'SP-B', 'SP-B2', 'SP-C', 'SP-D', 'SP-E', 'SP-F']);
    expect([...spTuning.keys()].sort()).toEqual(['SP-A', 'SP-B', 'SP-C', 'SP-D', 'SP-E']);
    for (const [wave, rows] of spTuning) {
      expect(rows.length, `${wave} parsed zero tuning rows — the §7 shape moved`).toBeGreaterThanOrEqual(2);
    }
  });

  test('every doc-reading anchor this walker uses appears EXACTLY ONCE', () => {
    // The first-match retargeting law: `indexOf('# WR-7')` matches `## WR-7a`, and a pin
    // that silently retargets guards a neighbour instead of its subject.
    const occurrences = (src, needle) => src.split(needle).length - 1;
    expect(occurrences(spSrc, '## §7 THE TUNING SURFACE')).toBe(1);
    expect(occurrences(spSrc, '## §8 ')).toBe(1);
    expect(occurrences(spSrc, '\nSP-A: ')).toBe(1);
    expect(occurrences(spSrc, '\n**Bands:**')).toBe(1);
    expect(occurrences(spSrc, 'THE LADDER LAW (J-FP-2)')).toBe(1);
  });

  test('SP-A carries its Bands line and it EQUALS §7 both ways', () => {
    const line = bandsParagraph(spBlocks.get('SP-A'));
    expect(line, 'SP-A lost its Bands line').toBeTruthy();
    const declared = line.split('·').map((r) => stripDot(r.trim())).filter(Boolean);
    expect(declared.length).toBe(3);
    // FORWARD (every declared band reaches the owner's signature surface) and REVERSE
    // (every signable row is a band some wave actually authored) in one equality.
    expect(declared).toEqual(spTuning.get('SP-A'));
  });

  test('every SP wave is in exactly one of: has-a-line, owes-a-line, none-by-design', () => {
    const withLine = [];
    const without = [];
    for (const [wave, block] of spBlocks) {
      (bandsParagraph(block) ? withLine : without).push(wave);
    }
    expect(withLine, 'SP-A is the only wave with a Bands line today').toEqual(['SP-A']);
    const classified = [...SP_WAVES_OWING_A_BANDS_LINE, ...SP_WAVES_WITH_NO_BANDS_BY_DESIGN].sort();
    expect(without.sort()).toEqual(classified);
  });

  test('the backlog is SHRINK-ONLY: a wave may leave it, never join it', () => {
    const stillOwing = [...spBlocks.keys()]
      .filter((w) => !bandsParagraph(spBlocks.get(w)))
      .filter((w) => !SP_WAVES_WITH_NO_BANDS_BY_DESIGN.includes(w));
    for (const wave of stillOwing) {
      expect(
        SP_WAVES_OWING_A_BANDS_LINE,
        `${wave} owes a Bands line and is not in the frozen backlog — author the line`
        + ' rather than widening the list; §7 already holds the rows it must equal',
      ).toContain(wave);
    }
    // The list is proven live by the equality in the previous test, so this bound
    // measures the ratchet rather than an empty set.
    expect(stillOwing.length).toBeLessThanOrEqual(SP_WAVES_OWING_A_BANDS_LINE.length);
  });

  test('every §7 wave key is either reconciled or in the backlog — no orphan tuning rows', () => {
    for (const wave of spTuning.keys()) {
      const reconciled = Boolean(spBlocks.has(wave) && bandsParagraph(spBlocks.get(wave)));
      expect(
        reconciled || SP_WAVES_OWING_A_BANDS_LINE.includes(wave),
        `§7 lists rows for ${wave} but no §5 wave block claims them`,
      ).toBe(true);
    }
  });

  test('MUTANT: a Bands line that drifts from §7 by ONE ROW is caught, in both directions', () => {
    const declared = bandsParagraph(spBlocks.get('SP-A')).split('·').map((r) => stripDot(r.trim()));
    const table = spTuning.get('SP-A');
    // A wave that bands something the table never lists (the row never reaches the owner).
    expect(declared.concat('the appetite learn rate')).not.toEqual(table);
    // A table row no wave claims (a number nobody can explain at the soak redo).
    // anchored: `declared` is asserted EQUAL to `table` two tests above, so both
    // inequalities here measure the planted drift rather than a comparison that never held.
    expect(declared.slice(0, 2)).not.toEqual(table);
    // …and a re-spelling, which is the drift class that actually happened fourteen times.
    expect(declared.map((r) => r.replace('half-life', 'halflife'))).not.toEqual(table);
  });

  test("the war volume's Bands lines are a FROZEN shrink-only backlog", () => {
    const measured = (warSrc.match(/^\*\*Bands\b/gm) || []).length;
    expect(measured, 'the war volume parsed zero Bands lines — re-anchor this count').toBeGreaterThanOrEqual(1);
    expect(
      measured,
      'a Bands line joined a build-complete volume whose §7 is not row-aligned and cannot'
      + ' be reconciled — look at it rather than raising this number',
    ).toBeLessThanOrEqual(WAR_VOLUME_FROZEN_BANDS_LINES);
  });
});

// ── HALF TWO: the mint is singular ────────────────────────────────────────────

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const SRC_FILES = walk(join(ROOT, 'src'))
  .filter((p) => /\.(js|jsx)$/.test(p))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }))
  .sort((a, b) => a.rel.localeCompare(b.rel));

/**
 * Files spelling any of `words` as a quoted string literal.
 * @param {readonly string[]} words @returns {string[]}
 */
function filesSpelling(words) {
  const res = words.map((w) => new RegExp(`['"\`]${w}['"\`]`));
  return SRC_FILES.filter(({ src }) => res.some((re) => re.test(src))).map(({ rel }) => rel);
}

/**
 * Files declaring an array literal whose quoted members are EXACTLY `words` (order
 * irrelevant) and nothing else — i.e. a second declaration of that vocabulary.
 * @param {readonly string[]} words @returns {string[]}
 */
function filesDeclaringVocabulary(words) {
  const target = [...words].sort().join('|');
  const hits = [];
  for (const { rel, src } of SRC_FILES) {
    for (const m of src.matchAll(/\[([^[\]]*)\]/g)) {
      const quoted = [...m[1].matchAll(/'([^']*)'/g)].map((q) => q[1]);
      if (quoted.length !== words.length) continue;
      if ([...quoted].sort().join('|') === target) { hits.push(rel); break; }
    }
  }
  return hits;
}

describe('SP band families — one mint, and no word on two ladders', () => {
  test('the source scan sees a real denominator (guard the guard)', () => {
    expect(SRC_FILES.length).toBeGreaterThan(500);
    expect(SRC_FILES.map((f) => f.rel)).toContain(FAMILY_HOME);
    // The detectors are proven live on a vocabulary that IS declared more than once
    // before either is used to assert an absence.
    const tierDeclarers = filesDeclaringVocabulary(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
    expect(tierDeclarers.length, 'the array-vocabulary detector matched nothing').toBeGreaterThanOrEqual(2);
    expect(filesSpelling(['notable']).length, 'the literal scan matched nothing').toBeGreaterThanOrEqual(5);
  });

  test('NO module but the family home speaks a SEVERITY rung', () => {
    const offenders = filesSpelling(SEVERITY_LADDER).filter((rel) => rel !== FAMILY_HOME);
    expect(
      offenders,
      `a module spells one of ${SEVERITY_LADDER.join('/')} — the SP-6b ladder's rungs were`
      + ' chosen to collide with nothing so that reading the wrong ladder is impossible by'
      + ' spelling. Import the family rather than re-typing a rung.',
    ).toEqual([]);
    // The family home DOES speak them, so the emptiness above is a real absence rather
    // than a scan that stopped matching.
    expect(filesSpelling(SEVERITY_LADDER)).toEqual([FAMILY_HOME]);
  });

  test('the SIGNIFICANCE family is declared exactly once', () => {
    expect(
      filesDeclaringVocabulary(SIGNIFICANCE_CLASSES),
      'a second module declares the three significance classes as its own vocabulary —'
      + ' the twelve-independently-authored-scales class. Import SIGNIFICANCE_CLASSES.',
    ).toEqual([FAMILY_HOME]);
  });

  test('the SEVERITY ladder is declared exactly once', () => {
    expect(filesDeclaringVocabulary(SEVERITY_LADDER)).toEqual([FAMILY_HOME]);
  });

  test('MUTANT: a second declaration and a stray rung are both caught', () => {
    // The predicates under test, run against mutated measurements — the fix for a red
    // must be to import the family, so the comparison has to actually fail on a second
    // file rather than tolerate it.
    const secondDeclaration = [FAMILY_HOME, 'src/domain/worldPulse/warCostsNews.js'];
    // anchored: both single-element sets are asserted EQUAL to [FAMILY_HOME] above, so
    // these inequalities measure the mutation and not an always-false comparison.
    expect(secondDeclaration).not.toEqual([FAMILY_HOME]);
    const strayRung = filesSpelling(SEVERITY_LADDER).concat('src/components/map/heraldFeed.js');
    expect(strayRung.filter((rel) => rel !== FAMILY_HOME)).not.toEqual([]);
  });
});
