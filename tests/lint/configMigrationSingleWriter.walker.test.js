/**
 * configMigrationSingleWriter.walker.test.js — MG-3f (leak L8): HABITAT REMOVAL for the
 * FORKED SAVE-MIGRATION class.
 *
 * THE CLASS: the saved-config forward migration decides whether a legacy settlement is
 * magical AT ALL — `magicExists` inferred from the priority dial when the save predates
 * the axis. That single bit gates the entire realm magic toggle's behaviour on every
 * old save. It was spelled THREE times in the tree (the saves-panel helper, a rotted
 * zero-caller copy in SettlementDetail, and a deliberate inline fork in the create
 * surface), and the register that found the leak only saw two of them. A change to one
 * copy forks the others silently, and the fork is invisible until a world comes back
 * mundane that should not have.
 *
 * THE WALK: scan all of src/ for the inference's own shape — an assignment to
 * `magicExists` guarded by a `priorityMagic` read — and require that exactly ONE file
 * carries it: the leaf that owns it. A fix belongs in the leaf; a fourth copy fails here
 * the day it lands, which is the only moment it is cheap to remove.
 *
 * This is deliberately a SHAPE scan rather than an import census: the fork that actually
 * happened was a hand-inlined re-implementation, which no import graph would ever show.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');

/** The one file permitted to spell the rule. */
const OWNER = 'src/lib/settlementConfigMigration.js';

/** The inference's shape: assign magicExists from a priorityMagic read. */
const INFERENCE_RE = /magicExists\s*=\s*\(?\s*c?o?n?f?i?g?\.?\s*\w*\.?priorityMagic/;

/** A looser tell for the same rule written across two lines. */
const GUARD_RE = /magicExists\s*===\s*undefined/;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir).sort()) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue;
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) walk(abs, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(abs);
  }
  return out;
}

describe('config-migration single writer (MG-3f habitat removal)', () => {
  const files = walk(SRC);

  test('exactly ONE file infers magicExists from the priority dial', () => {
    const carriers = files
      .filter((abs) => {
        const src = readFileSync(abs, 'utf8');
        return INFERENCE_RE.test(src) || GUARD_RE.test(src);
      })
      .map((abs) => relative(ROOT, abs))
      .sort();
    expect(carriers).toEqual([OWNER]);
  });

  test('guard the guard — the owner really does carry the rule (never satisfied by deletion)', () => {
    const src = readFileSync(join(ROOT, OWNER), 'utf8');
    expect(INFERENCE_RE.test(src)).toBe(true);
    expect(src).toContain('export function migrateSettlementConfig');
  });
});
