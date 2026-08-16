/**
 * advanceEpochSingleWriter.walker.test.js — THE L4 SINGLE-WRITER LAW for
 * `spatialLedgers.advanceEpoch` (wave EP-3 slice A; docs/DESIGN_FP_ARCH_EP.md §3b.1a).
 *
 * THE CLASS. The advance-epoch ledger is the ONE conditional sub-key this program adds to
 * persisted state, and its correctness rests entirely on having exactly one writer: the
 * `latest` stamp is readable only when `latest.tick === worldState.tick`, so a SECOND
 * writer anywhere — a later stage that "helpfully" re-stamps, a repair pass that rebuilds
 * the namespace, a migration that back-fills — silently breaks the current-tick selection
 * rule that makes the whole family-1 half dark-identical BY CONSTRUCTION.
 *
 * ⛔ A SECOND WRITER IS INVISIBLE TO EVERY BEHAVIOUR TEST. It writes a well-formed record
 * that reads back cleanly; nothing crashes, nothing looks wrong, and the draws it corrupts
 * are still valid draws. That is precisely the shape a source scan exists for, and it is
 * why this file asserts a universally quantified NEGATIVE with a planted positive control
 * rather than trusting the convention.
 *
 * @enforced-by this test
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');

/** The ONE sanctioned writer module, and the ONE key it owns. */
const LEAF = 'src/domain/advanceEpochLedger.js';
const LEDGER_KEY = 'advanceEpoch';

/** A `setSpatialLedger(<world>, 'advanceEpoch', …)` write, in either quote style, and also
 *  the indirect spelling where the key arrives through a module-level constant. */
const WRITE_RE = new RegExp(
  `setSpatialLedger\\s*\\([^,]*,\\s*(?:'${LEDGER_KEY}'|"${LEDGER_KEY}"|LEDGER_KEY)\\s*,`,
);
/** A `dropSpatialLedger(<world>, 'advanceEpoch')` — the other way to write the sub-key. */
const DROP_RE = new RegExp(
  `dropSpatialLedger\\s*\\([^,]*,\\s*(?:'${LEDGER_KEY}'|"${LEDGER_KEY}"|LEDGER_KEY)\\s*\\)`,
);
const COMMENT_LINE = /^\s*(?:\/\/|\/\*|\*)/;

/** Every .js/.jsx under src/, repo-relative. */
function sourceFiles(dir = SRC, out = []) {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) sourceFiles(abs, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(relative(ROOT, abs).replace(/\\/g, '/'));
  }
  return out;
}

/** Fail-closed: an unreadable or empty source must throw, never report a clean scan. */
function read(rel) {
  const text = readFileSync(join(ROOT, rel), 'utf8');
  if (!text.trim()) throw new Error(`${rel} is empty — the scan below would be vacuous`);
  return text;
}

/** THE DETECTOR, taken as (rel, text) so a CONTROL can run the REAL one over a fixture.
 *  A control that re-implements the detector proves nothing about the detector. */
function writeSitesIn(file, text) {
  return text.split('\n')
    .map((line, i) => ({ file, line: line.trim(), n: i + 1 }))
    .filter(({ line }) => !COMMENT_LINE.test(line) && (WRITE_RE.test(line) || DROP_RE.test(line)));
}

const ALL_FILES = sourceFiles();

describe('EP-3A · the single-writer law for spatialLedgers.advanceEpoch', () => {
  test('exactly ONE module in src writes the sub-key, and it is the sanctioned leaf', () => {
    const writers = ALL_FILES.flatMap((f) => writeSitesIn(f, read(f)));
    expect(
      [...new Set(writers.map((w) => w.file))],
      'A SECOND WRITER of spatialLedgers.advanceEpoch appeared. The current-tick selection'
      + ' rule — the property that makes a stamp written under a lit flag unreadable once the'
      + ' flag goes dark — assumes exactly one writer, stamping once per tick immediately'
      + ' after the calendar advance. Route the write through stampAdvanceEpochYear; do not'
      + ' widen this scan.',
    ).toEqual([LEAF]);
    // …and it writes it exactly ONCE, so a second call inside the leaf itself also reds.
    expect(writers, 'the leaf holds exactly one write site').toHaveLength(1);
  });

  test('THE PLANTED CONTROL: the detector fires on a second writer, in both key spellings', () => {
    // Without this the empty-set assertion above could be a broken regex matching nothing.
    const planted = "  memoryState = setSpatialLedger(memoryState, 'advanceEpoch', { latest });";
    expect(writeSitesIn('src/domain/worldPulse/someKernel.js', planted)).toHaveLength(1);
    expect(writeSitesIn('f.js', '  ws = setSpatialLedger(ws, "advanceEpoch", value);')).toHaveLength(1);
    expect(writeSitesIn('f.js', "  ws = dropSpatialLedger(ws, 'advanceEpoch');")).toHaveLength(1);
    // …and it DISCRIMINATES: another layer's ledger, and a mention in prose, are not writes.
    expect(writeSitesIn('f.js', "  ws = setSpatialLedger(ws, 'provenance', next);")).toEqual([]);
    expect(writeSitesIn('f.js', " * setSpatialLedger(worldState, 'advanceEpoch', …) is the one writer")).toEqual([]);
  });

  test('the leaf is the ONE module the kernel imports the writer from, and it exports one writer', () => {
    const leaf = read(LEAF);
    expect(leaf).toContain('export function stampAdvanceEpochYear');
    // The dark-returns-first ordering is the dormancy property: `setSpatialLedger` CREATES
    // the namespace, so the guard must precede it or an aspatial dark world grows a key.
    const body = leaf.slice(leaf.indexOf('export function stampAdvanceEpochYear'));
    expect(body.indexOf('if (!epochTerm) return worldState;')).toBeGreaterThan(-1);
    expect(body.indexOf('if (!epochTerm) return worldState;'))
      .toBeLessThan(body.indexOf('setSpatialLedger'));
    // The kernel reaches it by import rather than re-deriving the write inline.
    expect(read('src/domain/worldPulse/pulseKernel.js'))
      .toContain("import { stampAdvanceEpochYear } from '../advanceEpochLedger.js';");
  });

  test('the corpus the scan walks is real', () => {
    // The fail-closed floor: every assertion above is over ALL_FILES, so an empty or
    // mis-rooted collection would green them all at once.
    expect(ALL_FILES.length).toBeGreaterThan(500);
    expect(ALL_FILES).toContain(LEAF);
  });
});
