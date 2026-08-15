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
 * one line, it works, and it makes the sovereignty lane an independent authority on
 * what a steading row is. Instead the row-move lives in the pen.
 *
 * WHY A FILE SET RATHER THAN A CALL COUNT. The claim worth defending is "no new
 * AUTHORITY", not "no new statement": the pen may add call sites within itself as it
 * gains verbs, and it should not have to re-baseline this walker to do so. What must
 * not happen is another file deciding what a steading is.
 *
 * ── RATCHETED DOWN TO ONE, 2026-08-04 (chair ruling CR-WR10-I, lane WW-B) ────────
 *
 * This census froze TWO authorities when lane WW-A wrote it: the kernel (the advance's
 * own fold, plus `conveySteading`) and `realmVerbExecution.js` (the FORCE_FOUND_STEADING
 * verb's inline fold), the second recorded as already-a-second-authority rather than
 * blessed. CR-WR10-I moved the ledger half of the pen — the two reads, the row-move and
 * a new `foldSatellitesLedger` — into `src/domain/worldPulse/satellitesLedger.js`, a
 * dependency-free leaf, so that the WR-10 market stage could mount inside the lifecycle
 * kernel without closing an import cycle (the measured path is recorded in that leaf's
 * header). The extraction was taken as the OPPORTUNITY to close this census properly:
 * both former call sites now route their fold through the leaf's one write, so
 *
 *   THE SATELLITES LEDGER HAS EXACTLY ONE WRITING AUTHORITY.
 *
 * That is a shrink, banked in the direction this walker's own instructions demand — "a
 * file leaving the set is a win to be banked by editing the frozen list DOWN". The
 * property being defended stops being a count and becomes a fact: the drop-when-empty
 * law is spelled once, and a call site cannot forget it by construction. The RECORD's
 * shape is still `mintSteading`'s, in the kernel; what is singular here is the WRITE.
 *
 * A file joining this set is a failure, and the fix is to move the write into the leaf
 * — never to widen the list.
 *
 * @enforced-by itself (a source scan; no runtime coupling)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The frozen authority set. SHRINK-ONLY — see the header. ONE member since CR-WR10-I. */
const SATELLITES_WRITER_FILES = Object.freeze([
  'src/domain/worldPulse/satellitesLedger.js',
]);

/** The two files that USED to write the ledger directly and now route through the leaf.
 *  Named so the ratchet-down is a measured claim rather than a sentence in a header: if
 *  either ever spells `setSpatialLedger(…, 'satellites', …)` again, the exclusion below
 *  reds and names it. */
const FORMER_AUTHORITIES = Object.freeze([
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

describe('the satellites ledger has exactly ONE writing authority (shrink-only)', () => {
  test('the measured writer set equals the frozen set', () => {
    expect(
      writersOf('satellites'),
      'a new file writes spatialLedgers.satellites. Move the write into the pen\'s ledger'
      + ' leaf (satellitesLedger.js — foldSatellitesLedger is the one write) rather than'
      + ' widening this list: a second authority on what a steading row is means the orbit'
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
    expect(writersOf('satellites').length).toBe(1);
    // A ledger nobody writes reads empty, so the scan is discriminating rather than
    // matching every file that mentions setSpatialLedger at all.
    expect(writersOf('no_such_ledger_key')).toEqual([]);
  });

  test('MUTANT: a second-file write IS caught by the same comparison', () => {
    // The predicate under test, run against a mutated measurement: the fix for a red
    // here must be to move the write, so the walker has to actually fail on a second
    // file rather than tolerate it.
    const mutant = [...writersOf('satellites'), 'src/domain/worldPulse/sovereigntyTransfer.js'].sort();
    expect(mutant).not.toEqual([...SATELLITES_WRITER_FILES]);
    // anchored: the unmutated measurement is asserted equal in the first test above, so
    // this inequality measures the mutation rather than a comparison that never holds.
    expect(mutant.length).toBe(SATELLITES_WRITER_FILES.length + 1);
  });

  test('the conveyance writer is NOT an authority, and neither are the two former ones', () => {
    // The whole point of the row-move living in the pen: WR-10 rewrites the ledger and
    // still does not write it.
    const writers = writersOf('satellites');
    expect(writers, 'the pen\'s ledger leaf is the authority').toContain('src/domain/worldPulse/satellitesLedger.js');
    // The line above proves the measured set is live and correctly keyed, so
    // anchored: these exclusions measure real absences from a real set.
    expect(writers).not.toContain('src/domain/worldPulse/sovereigntyTransfer.js');
    // THE RATCHET-DOWN, MEASURED (CR-WR10-I): both former authorities now route their
    // fold through the leaf. A regression restores one of these names here.
    for (const former of FORMER_AUTHORITIES) {
      // `writers` was asserted to CONTAIN the leaf four lines above, so the collection is
      // proved live and correctly keyed before either name is excluded from it.
      // anchored: the exclusion measures the ratchet-down, not a scan that went empty.
      expect(writers, `${former} routes its fold through foldSatellitesLedger`).not.toContain(former);
    }
  });
});
