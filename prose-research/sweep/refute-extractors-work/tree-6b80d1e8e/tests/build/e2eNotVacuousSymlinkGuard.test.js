/**
 * tests/build/e2eNotVacuousSymlinkGuard.test.js — direct-invocation guard works
 * under a symlinked invocation.
 *
 * The bug: check-e2e-not-vacuous.mjs decided "am I being run directly?" with
 * `import.meta.url === \`file://${process.argv[1]}\``. import.meta.url is already
 * symlink-RESOLVED (and percent-encoded), but argv[1] is the raw invoked path —
 * so when the script is invoked through a SYMLINK (or any path needing URL
 * encoding) the two never match, the CLI block silently no-ops, and the gate
 * exits 0 having run nothing. A CI step that shells the script via a symlinked
 * bin/ would go green-on-nothing — exactly the failure class this script exists
 * to prevent.
 *
 * The fix compares against pathToFileURL(realpathSync(argv[1])).href, normalizing
 * both sides. This test invokes the REAL script through a symlink with no args
 * and asserts the CLI actually RAN (it must exit non-zero with the usage error,
 * not no-op to 0).
 */
import { describe, it, expect, afterEach } from 'vitest';
import { symlinkSync, rmSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SCRIPT = join(ROOT, 'scripts/check-e2e-not-vacuous.mjs');

function runNode(scriptPath) {
  try {
    const stdout = execFileSync('node', [scriptPath], { cwd: ROOT, encoding: 'utf8' });
    return { code: 0, output: stdout };
  } catch (err) {
    return { code: err.status ?? 1, output: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
}

describe('check-e2e-not-vacuous.mjs CLI fires under a symlinked invocation', () => {
  let dir;
  afterEach(() => dir && rmSync(dir, { recursive: true, force: true }));

  it('runs the CLI (does not no-op) when invoked through a symlink with no args', () => {
    dir = mkdtempSync(join(tmpdir(), 'e2e-symlink-'));
    const link = join(dir, 'symlinked-check.mjs');
    symlinkSync(SCRIPT, link);

    // No args → the CLI must reach its usage check and exit non-zero. Under the
    // old `file://${argv[1]}` guard this no-ops to 0 (the bug).
    const { code, output } = runNode(link);
    expect(code, 'the CLI must run under a symlinked invocation, not silently no-op').not.toBe(0);
    expect(output).toMatch(/anti-vacuity check FAILED|usage:/);
  });
});
