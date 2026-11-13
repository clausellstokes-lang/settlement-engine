/**
 * Fixture-git isolation walker — no test runs git in a throwaway folder with the hook's repository
 * variables still pointing at the real repository (tests/helpers/fixtureGit.js carries the class
 * and the incident: on 2026-11-13 the pre-push whole check, run from a linked worktree, moved a lane
 * branch, made two branches and rewrote the shared config through five such suites).
 *
 * TWO RULES, over the tracked .js/.mjs/.cjs files under tests/:
 *   R1  (test files) a direct child-process call that runs git (`'git'`, or a command string starting `git `)
 *       with a cwd that is not the repository root (absent, ROOT, REPO_ROOT, process.cwd()) must
 *       pass `env: fixtureEnv(…)`. A shared helper (tests/helpers/goldenRecordDoor.js's `root`) is
 *       outside R1: its cwd is its caller's, and five scripts that run outside vitest import it.
 *   R2  a file that BUILDS a git repository (a child-process or fixture-git file naming `init`,
 *       `clone` or `worktree`) must call `isolateFromHostRepo()`, because the library code and the
 *       CLIs it drives run git in the fixture with whatever `process.env` holds.
 * Each rule is shown to fire on the shape it forbids, and the helper is shown, by execution against
 * a throwaway repository, to keep an inherited GIT_DIR from reaching it.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { fixtureEnv, fixtureGit } from '../helpers/fixtureGit.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SELF = 'tests/lint/fixtureGitIsolation.walker.test.js';
const HELPER = 'tests/helpers/fixtureGit.js';

const CALL = /(?<![.\w])(execFileSync|execSync|spawnSync|spawn|execFile|exec)\s*\(/g;
const REPO_ROOT_CWD = /^(ROOT|REPO_ROOT|process\.cwd\(\))$/;
const BUILDS_REPO = /['"`](init|clone|worktree)['"`]|\bgit (init|clone|worktree)\b/;
const SPAWNS = /from\s+['"](node:)?child_process['"]|fixtureGit\.js['"]/;

/** The text of each direct child-process call in `src`, parentheses balanced. */
function callsIn(src) {
  const out = [];
  for (const m of src.matchAll(CALL)) {
    let i = m.index + m[0].length;
    let depth = 1;
    const end = Math.min(src.length, i + 4000);
    while (i < end && depth > 0) {
      if (src[i] === '(') depth += 1;
      else if (src[i] === ')') depth -= 1;
      i += 1;
    }
    out.push({ text: src.slice(m.index, i), line: src.slice(0, m.index).split('\n').length });
  }
  return out;
}

/** @param {string} call */
function runsGit(call) {
  const first = call.match(/\(\s*(['"`])((?:(?!\1)[\s\S])*)\1/);
  return Boolean(first) && (first[2] === 'git' || first[2].startsWith('git '));
}

/** @param {string} call  @returns {string|null} the cwd expression, or null when none is given */
function cwdOf(call) {
  const named = call.match(/\bcwd\s*:\s*([^,}\n]+)/);
  if (named) return named[1].trim();
  return /[{,]\s*cwd\s*[,}]/.test(call) ? 'cwd' : null;
}

/** R1's offences in one source text. */
function r1Offences(src) {
  return callsIn(src)
    .filter(({ text }) => runsGit(text))
    .filter(({ text }) => { const cwd = cwdOf(text); return cwd !== null && !REPO_ROOT_CWD.test(cwd); })
    .filter(({ text }) => !/\benv\s*:\s*fixtureEnv\(/.test(text))
    .map(({ line }) => line);
}

const buildsRepo = (src) => SPAWNS.test(src) && BUILDS_REPO.test(src);
const r2Offends = (src) => buildsRepo(src) && !/\bisolateFromHostRepo\(\)/.test(src);

// the tree this file sits in, whatever GIT_DIR the run inherited (under a foreign one, the subject
// test below reds rather than letting R1 and R2 pass over an empty list)
const files = fixtureGit(['ls-files', '-z', 'tests'], { cwd: ROOT, encoding: 'utf8' }).toString()
  .split('\0')
  .filter((f) => /\.[cm]?js$/.test(f) && f !== SELF && f !== HELPER);
const sources = new Map(files.map((f) => [f, readFileSync(join(ROOT, f), 'utf8')]));

describe('fixture-git isolation walker', () => {
  test('R1: no test runs git outside the repository with the inherited repository variables', () => {
    const offences = [];
    for (const [file, src] of [...sources].filter(([f]) => /\.test\.[cm]?js$/.test(f))) for (const line of r1Offences(src)) offences.push(`${file}:${line}`);
    expect(offences, 'pass `env: fixtureEnv()` from tests/helpers/fixtureGit.js').toEqual([]);
  });

  test('R2: every file that builds a git repository isolates itself from the host repository', () => {
    const offences = [...sources].filter(([, src]) => r2Offends(src)).map(([file]) => file);
    expect(offences, 'call `isolateFromHostRepo()` from tests/helpers/fixtureGit.js at module scope').toEqual([]);
  });

  test('the walk sees its subjects: the five suites that leaked on 2026-11-13 are repository builders', () => {
    const builders = [...sources].filter(([, src]) => buildsRepo(src)).map(([file]) => file);
    expect(builders).toEqual(expect.arrayContaining([
      'tests/lint/tuningRegister.walker.test.js',
      'tests/scripts/implementationPackets.test.js',
      'tests/scripts/implementationSession.test.js',
      'tests/scripts/landingStageMeasure.test.js',
      'tests/soak-harness/soakRegister.test.js',
    ]));
    // and R1 reads real git calls aimed at the repository root, and passes them
    const rootGitCalls = [...sources.values()].flatMap((src) => callsIn(src)).filter(({ text }) => runsGit(text));
    expect(rootGitCalls.length).toBeGreaterThan(10);
  });

  test('each rule fires on the shape it forbids (the leaked suites as they stood)', () => {
    const leaked = "import { execFileSync } from 'node:child_process';\n"
      + "const run = (...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' });\nrun('init', '-q');\n";
    expect(r1Offences(leaked)).toEqual([2]);
    expect(r2Offends(leaked)).toBe(true);
    const cured = "import { execFileSync } from 'node:child_process';\nimport { fixtureEnv, isolateFromHostRepo } from '../helpers/fixtureGit.js';\n"
      + 'isolateFromHostRepo();\n'
      + "const run = (...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8', env: fixtureEnv() });\nrun('init', '-q');\n";
    expect(r1Offences(cured)).toEqual([]);
    expect(r2Offends(cured)).toBe(false);
    // the root is not a fixture: a git call at ROOT or with no cwd is never R1's
    expect(r1Offences("execFileSync('git', ['status'], { cwd: ROOT });\nexecSync('git grep -l x -- src');")).toEqual([]);
    // a command string and a multi-line options object are read as git calls too
    expect(r1Offences("execSync(`git commit -q -m x`, {\n  cwd: repo,\n});")).toEqual([1]);
  });

  test('the helper keeps an inherited GIT_DIR from reaching the host (by execution, on a throwaway host)', () => {
    const host = mkdtempSync(join(tmpdir(), 'fixture-git-host-'));
    const folder = mkdtempSync(join(tmpdir(), 'fixture-git-folder-'));
    const folder2 = mkdtempSync(join(tmpdir(), 'fixture-git-folder-'));
    try {
      fixtureGit(['init', '-q'], { cwd: host });
      const hostConfig = () => readFileSync(join(host, '.git', 'config'), 'utf8');
      const before = hostConfig();
      const inherited = { ...process.env, GIT_DIR: join(host, '.git') };
      // the cure: the same inherited environment, stripped, acts on the folder
      execFileSync('git', ['init', '-q'], { cwd: folder, env: fixtureEnv({}, inherited) });
      execFileSync('git', ['config', 'user.name', 'Fixture'], { cwd: folder, env: fixtureEnv({}, inherited) });
      expect(hostConfig(), 'the host is untouched').toBe(before);
      expect(readFileSync(join(folder, '.git', 'config'), 'utf8')).toContain('name = Fixture');
      // the anchor: the raw inherited environment writes the HOST, which is the class
      execFileSync('git', ['config', 'user.name', 'Fixture'], { cwd: folder2, env: inherited });
      expect(hostConfig()).toContain('name = Fixture');
    } finally {
      for (const d of [host, folder, folder2]) rmSync(d, { recursive: true, force: true });
    }
  });
});
