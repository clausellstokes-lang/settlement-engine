/**
 * habitBandsReconciliation.walker.test.js — HB-0. THE HABIT VOLUME'S BANDS-LINE
 * RECONCILIATION, and it exists because its sibling provably does not generalize.
 *
 * MEASURED: `tests/lint/spBandFamilies.walker.test.js` splits its volume on
 * `^### <PREFIX>-<ID>` over a nine-prefix alternation that does not contain HB, and the
 * habit volume's waves are BOLD PARAGRAPHS under `## §4`, not `###` headings. Its target
 * is that volume's own tuning table; HB's target is `### 8.2 THE TUNING SEAM`. Copying
 * the sibling would have produced a walker that parsed nothing and passed.
 *
 * ⭐ THE SUBJECT SET IS DERIVED, NEVER LISTED (the derive-don't-restate law). Both sides
 * of the reconciliation are read out of the volume at run time: the wave ids and their
 * Bands lines come from §4, and the tuning-bearing set and the count of waves that carry
 * none come from §8.2's own sentence. This file holds no wave list, no wave count and no
 * band phrase of its own — a walker seeded with a transcribed denominator is the same
 * defect as a prose sentence seeded with one; it just fails green instead of reading
 * wrong.
 *
 * ⚠ THE ANCHOR IS §8.2, NEVER §7. The amendment's spelling ("equal verbatim to its §7
 * rows") is struck as incoherent: §7 is the chair-questions section, holds no band rows,
 * and a walker chartered to reconcile against it would have red against its own volume on
 * day one — the guard-the-guard failure this estate reds elsewhere.
 *
 * @enforced-by itself (doc parsing only; no runtime coupling)
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const HB_VOLUME = 'docs/DESIGN_FP_ARCH_HB.md';
const NONE_BY_DESIGN = 'NONE BY DESIGN';

/** Word to integer, for §8.2's spelled count. A parser primitive, not a denominator. */
const NUMBER_WORDS = Object.freeze({
  ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5,
  SIX: 6, SEVEN: 7, EIGHT: 8, NINE: 9, TEN: 10,
});

const SRC = readFileSync(join(ROOT, HB_VOLUME), 'utf8');

/** The body of one `## §<n> …` section, by its opening anchor. */
function section(openAnchor, closeAnchor) {
  const start = SRC.indexOf(openAnchor);
  const end = SRC.indexOf(closeAnchor, start + 1);
  if (start < 0 || end < 0 || end <= start) {
    throw new Error(`${HB_VOLUME}: the ${openAnchor} / ${closeAnchor} anchors moved — re-anchor this walker`);
  }
  return SRC.slice(start, end);
}

const WAVES_SECTION = section('## §4 THE WAVES', '## §5 ');
const TUNING_SEAM = section('### 8.2 THE TUNING SEAM', '### 8.3 ');

/**
 * The §4 wave blocks, keyed by wave id. A block opens on a bold `**HB-<n> — …` paragraph
 * and runs to the next one.
 * @returns {Map<string, string>}
 */
function waveBlocks() {
  const out = new Map();
  let current = null;
  let buf = [];
  const flush = () => { if (current) out.set(current, buf.join('\n')); };
  for (const line of WAVES_SECTION.split('\n')) {
    const m = line.match(/^\*\*(HB-\d+) — /);
    if (m) { flush(); current = m[1]; buf = [line]; continue; }
    if (current) buf.push(line);
  }
  flush();
  return out;
}

/** The `**Bands:**` line of a block, flattened, or null. */
function bandsLineOf(block) {
  const lines = block.split('\n');
  const start = lines.findIndex((l) => /^\*\*Bands\b/.test(l));
  if (start < 0) return null;
  const buf = [];
  for (let i = start; i < lines.length; i += 1) {
    if (i > start && (lines[i].trim() === '' || /^\*\*HB-\d+ — /.test(lines[i]))) break;
    buf.push(lines[i]);
  }
  return buf.join(' ').replace(/\s+/g, ' ').replace(/^\*\*Bands[^*]*:\*\*\s*/, '').trim();
}

const BLOCKS = waveBlocks();
const BANDS = new Map([...BLOCKS].map(([wave, block]) => [wave, bandsLineOf(block)]));

/** Waves whose Bands line is a real band list rather than the declared absence. */
const MEASURED_BEARING = [...BANDS]
  .filter(([, line]) => line !== null && !line.startsWith(NONE_BY_DESIGN))
  .map(([wave]) => wave).sort();

/** Waves §8.2 itself names as tuning-bearing, read out of its own sentence. */
function declaredBearing() {
  const m = TUNING_SEAM.match(/THE TUNING-BEARING WAVES ARE([\s\S]*?);/);
  if (!m) throw new Error(`${HB_VOLUME} §8.2: the tuning-bearing sentence moved — re-anchor this walker`);
  return [...new Set([...m[1].matchAll(/\bHB-\d+\b/g)].map((hit) => hit[0]))].sort();
}

/** The count §8.2 states for the waves that carry no bands. */
function declaredAbsentCount() {
  const m = TUNING_SEAM.match(/the other ([A-Z]+) carry/);
  const value = m ? NUMBER_WORDS[m[1]] : undefined;
  if (value === undefined) throw new Error(`${HB_VOLUME} §8.2: the "the other N carry" count moved — re-anchor this walker`);
  return value;
}

describe('HB — the Bands line reconciles against the tuning seam, both directions', () => {
  test('the parsers see a real denominator, and every wave in the volume carries a line', () => {
    // Guard the guard: a parser that stopped matching would report empty sets and pass
    // having proved nothing. Every absence claim below rests on these three.
    expect(BLOCKS.size).toBeGreaterThanOrEqual(10);
    expect([...BLOCKS.keys()]).toContain('HB-0');
    const missing = [...BANDS].filter(([, line]) => line === null).map(([wave]) => wave);
    expect(
      missing,
      'a §4 wave block carries no **Bands:** line at all. Every wave declares either its'
      + ' bands or an explicit absence with the reason — silence is the drift this walker exists to catch',
    ).toEqual([]);
  });

  test('the waves the seam NAMES as tuning-bearing are exactly the waves that carry bands', () => {
    expect(declaredBearing().length).toBeGreaterThan(0);
    expect(
      MEASURED_BEARING,
      'a §4 wave authors bands the tuning seam does not name, or the seam names a'
      + ' tuning-bearing wave whose block declares no bands. A band named in a wave and'
      + ' missing from the seam never reaches the owner\'s signature',
    ).toEqual(declaredBearing());
  });

  test('the count of no-bands waves the seam states equals the count the volume carries', () => {
    const absent = [...BANDS].filter(([, line]) => line !== null && line.startsWith(NONE_BY_DESIGN));
    expect(absent.length).toBe(declaredAbsentCount());
    expect(absent.length + MEASURED_BEARING.length).toBe(BLOCKS.size);
  });

  test('every declared absence NAMES what the wave authors instead', () => {
    const bare = [...BANDS]
      .filter(([, line]) => line !== null && line.startsWith(NONE_BY_DESIGN))
      .filter(([, line]) => line.replace(NONE_BY_DESIGN, '').replace(/^[\s—.-]+/, '').length < 20)
      .map(([wave]) => wave);
    expect(
      bare,
      'a wave declares no bands and does not say what it authors instead. The note is the'
      + ' whole content of the declaration: without it the absence is indistinguishable'
      + ' from an author who forgot',
    ).toEqual([]);
  });

  test('the Bands token STARTS its line, so decoration can never hide a declaration', () => {
    // The measured lesson: one wave's line was authored with a leading decoration and the
    // parser walked past it, which is how a 10%-compliant law looked compliant.
    const decorated = [...BLOCKS]
      .filter(([, block]) => /^[^\n*]*\*\*Bands\b/m.test(block) && !/^\*\*Bands\b/m.test(block))
      .map(([wave]) => wave);
    expect(
      decorated,
      'a **Bands:** declaration is preceded by decoration on its own line — the token'
      + ' starts the line and decoration goes AFTER it',
    ).toEqual([]);
  });

  test('GUARD-THE-GUARD: a Bands line planted on a no-bands wave REDS', () => {
    // The detector under test, run against a mutated document rather than the live one.
    // Without this the reconciliation could be an always-empty comparison and nobody
    // would know until a real band went unsigned.
    const victim = [...BANDS].find(([, line]) => line !== null && line.startsWith(NONE_BY_DESIGN));
    expect(victim, 'no wave declares an absence, so this control has no subject').toBeTruthy();
    const planted = new Map(BANDS);
    planted.set(victim[0], 'learning rate by law band · a planted row nobody signed');
    const mutated = [...planted]
      .filter(([, line]) => line !== null && !line.startsWith(NONE_BY_DESIGN))
      .map(([wave]) => wave).sort();
    expect(mutated).not.toEqual(declaredBearing());
    expect(mutated).toContain(victim[0]);
  });
});
