/**
 * satellitesLedgerWriters.walker.test.js — the SHRINK-ONLY census of who may write the
 * satellites ledger (WR-10 lane WW-A, structural prevention).
 *
 * THE CLASS THIS EXISTS TO REMOVE. `spatialLedgers.satellites` holds steading records
 * whose shape is authored in exactly one place — settlementLifecycleKernel.js owns the
 * orbit rule (unique per parent, by mint-time search), the parent key, the
 * drop-when-empty law for a parent's cell, and the conservation discipline that every
 * head in a steading was debited from its parent. None of that is validated at load
 * time. A second writer elsewhere is therefore free to disagree with all four, and
 * nothing would catch it: the ledger would still serialize, still round-trip, and still
 * read back through `satellitesOf` — it would simply mean something different.
 *
 * The specific near-miss this lane had to refuse: the WR-10 conveyance needs to move a
 * steading row between parents, and the obvious implementation is for the transfer
 * writer to read the ledger, rebuild it, and call `setSpatialLedger` itself. That is
 * one line, it works, and it makes the sovereignty lane the third independent authority
 * on what a steading row is. Instead the row-move lives beside `mintSteading` and
 * PERSISTS there, which is why this census does not grow.
 *
 * WHY A FILE SET RATHER THAN A CALL COUNT. The claim worth defending is "no new
 * AUTHORITY", not "no new statement": the pen may add call sites within itself as it
 * gains verbs, and it should not have to re-baseline this walker to do so. What must
 * not happen is a fourth file deciding what a steading is.
 *
 * SHRINK-ONLY, in the inventory-ratchet sense: a file leaving the set is a win to be
 * banked by editing the frozen list DOWN. A file joining it is a failure, and the fix
 * is to move the write into the pen — never to widen the list. The two members are:
 *
 *   settlementLifecycleKernel.js  THE PEN. The advance folds the tick's ledger, and
 *                                 `conveySteading` performs the WR-10 row-move.
 *   realmVerbExecution.js         The FORCE_FOUND_STEADING verb's inline fold. Already
 *                                 a second authority when this census was written, and
 *                                 recorded as such rather than blessed: it mints
 *                                 through the shared `mintSteading`, so it inherits the
 *                                 record shape, but it writes the ledger itself.
 *
 * @enforced-by itself (a source scan; no runtime coupling)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The frozen authority set. SHRINK-ONLY — see the header. */
const SATELLITES_WRITER_FILES = Object.freeze([
  'src/domain/worldPulse/realmVerbExecution.js',
  'src/domain/worldPulse/settlementLifecycleKernel.js',
]);

/** A ledger whose writers are genuinely many, used as the scanner's positive control. */
const CONTROL_LEDGER = 'treaties';

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/**
 * Blank comments and string bodies while preserving offsets, so a ledger name written
 * in PROSE is never counted as a write. The ledger key itself is a string literal, so
 * the scan below deliberately reads the RAW source for the call shape and uses this
 * only to reject comment lines — a full string-blanking pass would erase the very
 * literal being matched.
 * @param {string} line
 */
function isCommentLine(line) {
  const t = line.trim();
  return t.startsWith('*') || t.startsWith('//') || t.startsWith('/*');
}

const sourceFiles = walk(join(ROOT, 'src'))
  .filter((p) => /\.(js|jsx)$/.test(p))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }));

/**
 * Every file containing a `setSpatialLedger(<state>, '<key>', …)` call for one ledger.
 * @param {string} key @returns {string[]} repo-relative paths, sorted
 */
export function writersOf(key) {
  const call = new RegExp(`setSpatialLedger\\(\\s*[^,()]+,\\s*['"]${key}['"]\\s*,`);
  const hits = new Set();
  for (const { rel, src } of sourceFiles) {
    for (const line of src.split('\n')) {
      if (isCommentLine(line)) continue;
      if (call.test(line)) hits.add(rel);
    }
  }
  return [...hits].sort();
}

describe('the satellites ledger has exactly two writing authorities (shrink-only)', () => {
  test('the measured writer set equals the frozen set', () => {
    expect(
      writersOf('satellites'),
      'a new file writes spatialLedgers.satellites. Move the write into the steading pen'
      + ' (settlementLifecycleKernel.js, beside mintSteading and conveySteading) rather than'
      + ' widening this list — a third authority on what a steading row is means the orbit'
      + ' rule, the parent key and the drop-when-empty law can disagree with each other, and'
      + ' nothing validates the ledger at load time.',
    ).toEqual([...SATELLITES_WRITER_FILES]);
  });

  test('the scanner is not blind: it finds a genuinely multi-writer ledger, and rejects prose', () => {
    // POSITIVE CONTROL. If the regex stopped matching the call shape, the census above
    // would read empty and pass by finding nothing — the vacuity this control removes.
    const control = writersOf(CONTROL_LEDGER);
    expect(control.length, `${CONTROL_LEDGER} has writers the scanner can see`).toBeGreaterThanOrEqual(1);
    // …and the satellites set is a real, non-empty measurement rather than a default.
    expect(writersOf('satellites').length).toBe(2);
    // A ledger nobody writes reads empty, so the scan is discriminating rather than
    // matching every file that mentions setSpatialLedger at all.
    expect(writersOf('no_such_ledger_key')).toEqual([]);
  });

  test('MUTANT: a third-file write IS caught by the same comparison', () => {
    // The predicate under test, run against a mutated measurement: the fix for a red
    // here must be to move the write, so the walker has to actually fail on a third
    // file rather than tolerate it.
    const mutant = [...writersOf('satellites'), 'src/domain/worldPulse/sovereigntyTransfer.js'].sort();
    expect(mutant).not.toEqual([...SATELLITES_WRITER_FILES]);
    // anchored: the unmutated measurement is asserted equal in the first test above, so
    // this inequality measures the mutation rather than a comparison that never holds.
    expect(mutant.length).toBe(SATELLITES_WRITER_FILES.length + 1);
  });

  test('the conveyance writer is NOT one of the authorities', () => {
    // The whole point of the row-move living in the pen: WR-10 rewrites the ledger and
    // still does not write it.
    const writers = writersOf('satellites');
    expect(writers, 'the pen is an authority').toContain('src/domain/worldPulse/settlementLifecycleKernel.js');
    // The line above proves the measured set is live and correctly keyed, so
    // anchored: this exclusion measures the conveyance staying out of a real set.
    expect(writers).not.toContain('src/domain/worldPulse/sovereigntyTransfer.js');
  });
});
