/**
 * tests/helpers/gitFixture.test.js — a fixture's git never reaches the repository a hook
 * exported, proved against a decoy.
 *
 * ── WHAT IS PROVED, AND AGAINST WHAT ─────────────────────────────────────────────────────
 * Every arm that points a hook's variables at a repository builds its own DECOY in a temp
 * directory — a main checkout and a linked worktree, because the linked worktree is where
 * git exports an absolute GIT_DIR to a hook. No arm can reach the checkout this suite belongs
 * to with a mutating git: every environment that carries a hostile variable is built from
 * `withoutRepositoryEnv()` first, so even a worker that had inherited a real GIT_DIR could
 * only ever hand git a decoy's.
 *
 * ── EVERY "UNCHANGED" IS PAIRED WITH A "CHANGED" ─────────────────────────────────────────
 * "The decoy is byte-identical" is true of a guard that works and of a decoy nothing ever
 * pointed at. So each hostile environment is first run through a RAW git — the spelling the
 * four fixture suites used before this module existed — against a decoy of its own, and
 * that decoy must CHANGE, in the file the row names. Only then is the same environment run
 * through `fixtureGit`, against a fresh decoy that must not move by a byte. A guard that
 * cannot be reddened cannot be proven; this one reddens its own control on every run.
 *
 * ── ⛔ AND THE GUARD MAY NOT BE THE LEAK ──────────────────────────────────────────────────
 * This file drives real, mutating git. Its first cut trusted the module under test to put
 * those verbs in a temp directory, and when a probe broke the module they ran in the
 * checkout the probe was started from. The module now refuses that by itself (see its
 * header), and the arm marked ⛔ injects exactly that fault — aimed at a decoy — to prove it.
 * ⇒ PLANT A REGRESSION IN tests/helpers/gitFixture.js ONLY IN A COPY OF THE TREE THAT IS
 *   OUTSIDE EVERY REPOSITORY (`git archive <sha> | tar -x`, node_modules linked in).
 *
 * ⚠ THE TABLES ARE `for` LOOPS INSIDE ONE `test` BODY, the estate's standing idiom (see
 * tests/scripts/implementationPackets.test.js): a per-row vitest table is a shape the
 * lighting walker parks a whole file on.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync,
} from 'node:fs';
import { devNull, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { expectAbsentWithAnchor } from './anchoredNegatives.js';
import {
  REPOSITORY_ENV,
  REPOSITORY_ENV_CONFIGURATION,
  fixtureGit,
  fixtureGitEnv,
  scrubRepositoryEnv,
  withoutRepositoryEnv,
} from './gitFixture.js';

const SUITE_ROOT = realpathSync(join(dirname(fileURLToPath(import.meta.url)), '../..'));

/** The record tests/setup/gitEnvIsolation.js leaves. Named by symbol, never imported. */
const GIT_ENV_ISOLATION = Symbol.for('settlementforge.tests.gitEnvIsolation');

const temps = [];
afterEach(() => {
  for (const dir of temps.splice(0)) rmSync(dir, { recursive: true, force: true });
});

/** @param {string} prefix @returns {string} a new temp directory, as its physical path */
function tempDir(prefix) {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), prefix)));
  temps.push(dir);
  return dir;
}

/** The decoy's commits carry their identity in the environment, so its config has no `[user]`. */
const DECOY_IDENTITY = Object.freeze({
  GIT_AUTHOR_NAME: 'Decoy',
  GIT_AUTHOR_EMAIL: 'decoy@example.invalid',
  GIT_AUTHOR_DATE: '2026-01-01T00:00:00Z',
  GIT_COMMITTER_NAME: 'Decoy',
  GIT_COMMITTER_EMAIL: 'decoy@example.invalid',
  GIT_COMMITTER_DATE: '2026-01-01T00:00:00Z',
});

/**
 * A throw-away repository shaped like the real one: a main checkout with a commit and a
 * tag, plus a linked worktree on a branch of its own.
 */
function buildDecoy() {
  const home = tempDir('git-fixture-decoy-');
  const main = join(home, 'main');
  const lane = join(home, 'lane');
  mkdirSync(main);
  fixtureGit(main, ['init', '-q', '-b', 'main']);
  writeFileSync(join(main, 'kept.txt'), 'the decoy keeps this file\n');
  fixtureGit(main, ['add', '.']);
  fixtureGit(main, ['commit', '-q', '-m', 'decoy: the one commit'], { env: DECOY_IDENTITY });
  fixtureGit(main, ['tag', 'decoy-tag']);
  fixtureGit(main, ['worktree', 'add', '-q', '-b', 'lane', lane]);
  const gitDir = join(main, '.git');
  return { home, main, lane, gitDir, laneGitDir: join(gitDir, 'worktrees', 'lane') };
}

/**
 * Every file under `dir` as `{ relative path: sha256 }`, read with `fs` and never with git —
 * git may rewrite an index while it is only being asked a question.
 * @param {string} dir @param {string[]} [skip] top-level names to leave out
 * @returns {Record<string, string>}
 */
function manifestOf(dir, skip = []) {
  /** @type {Record<string, string>} */
  const out = {};
  const walk = (absolute, relativePath) => {
    for (const entry of readdirSync(absolute, { withFileTypes: true })) {
      if (relativePath === '' && skip.includes(entry.name)) continue;
      const next = relativePath === '' ? entry.name : `${relativePath}/${entry.name}`;
      if (entry.isDirectory()) walk(join(absolute, entry.name), next);
      else out[next] = createHash('sha256').update(readFileSync(join(absolute, entry.name))).digest('hex');
    }
  };
  walk(dir, '');
  return out;
}

/** The decoy as bytes: the three things a leak was seen to move, then everything else. */
function pictureOf(decoy) {
  const packed = join(decoy.gitDir, 'packed-refs');
  return {
    config: readFileSync(join(decoy.gitDir, 'config'), 'utf8'),
    head: readFileSync(join(decoy.gitDir, 'HEAD'), 'utf8'),
    laneHead: readFileSync(join(decoy.laneGitDir, 'HEAD'), 'utf8'),
    refs: manifestOf(join(decoy.gitDir, 'refs')),
    packedRefs: existsSync(packed) ? readFileSync(packed, 'utf8') : null,
    gitDir: manifestOf(decoy.gitDir),
    mainWorkTree: manifestOf(decoy.main, ['.git']),
    laneWorkTree: manifestOf(decoy.lane, ['.git']),
  };
}

/** The git-dir paths whose bytes differ between two pictures, sorted. */
function movedPaths(before, after) {
  const names = new Set([...Object.keys(before.gitDir), ...Object.keys(after.gitDir)]);
  return [...names].filter((name) => before.gitDir[name] !== after.gitDir[name]).sort();
}

/**
 * What a hook can hand a test run. `env` builds the variables for a given decoy; `exposes`
 * names the decoy file a RAW git is expected to move under them — the control each row
 * must pass before its guard counts.
 */
const HOSTILE_ENVIRONMENTS = Object.freeze([
  {
    name: 'GIT_DIR on the main git dir',
    exposes: 'config',
    env: (decoy) => ({ GIT_DIR: decoy.gitDir }),
  },
  {
    name: 'a pre-push hook in a linked worktree (GIT_DIR, GIT_PREFIX)',
    exposes: 'config',
    env: (decoy) => ({ GIT_DIR: decoy.laneGitDir, GIT_PREFIX: '' }),
  },
  {
    name: 'git --git-dir --work-tree (GIT_DIR, GIT_WORK_TREE)',
    exposes: 'config',
    env: (decoy) => ({ GIT_DIR: decoy.gitDir, GIT_WORK_TREE: decoy.main }),
  },
  {
    name: 'a commit hook in a linked worktree (GIT_DIR, GIT_INDEX_FILE, the author)',
    exposes: 'config',
    env: (decoy) => ({
      GIT_DIR: decoy.laneGitDir,
      GIT_INDEX_FILE: join(decoy.laneGitDir, 'index'),
      GIT_AUTHOR_NAME: 'Hostile',
      GIT_AUTHOR_EMAIL: 'hostile@example.invalid',
      GIT_COMMITTER_NAME: 'Hostile',
      GIT_COMMITTER_EMAIL: 'hostile@example.invalid',
    }),
  },
  {
    name: 'the index alone (GIT_INDEX_FILE)',
    exposes: 'index',
    env: (decoy) => ({ GIT_INDEX_FILE: join(decoy.gitDir, 'index') }),
  },
  {
    name: 'the config file alone (GIT_CONFIG)',
    exposes: 'config',
    env: (decoy) => ({ GIT_CONFIG: join(decoy.gitDir, 'config') }),
  },
  {
    name: 'configuration carried by the environment (git -c, GIT_CONFIG_COUNT)',
    exposes: 'config',
    env: (decoy) => ({
      GIT_DIR: decoy.gitDir,
      GIT_CONFIG_PARAMETERS: "'user.name'='Hostile' 'user.email'='hostile@example.invalid'",
      GIT_CONFIG_COUNT: '1',
      GIT_CONFIG_KEY_0: 'user.name',
      GIT_CONFIG_VALUE_0: 'Hostile',
    }),
  },
]);

/** Run `fn` with extra variables in this process's own environment, then put it back. */
function withProcessEnv(extra, fn) {
  const saved = new Map(Object.keys(extra).map((name) => [name, process.env[name]]));
  Object.assign(process.env, extra);
  try {
    return fn();
  } finally {
    for (const [name, value] of saved) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
}

/**
 * The verbs the estate's four fixture suites drive, in their order: init, three config
 * writes, add, commit, a branch switch, a second commit. `git` is the door under test.
 * @param {string} dir @param {(args: string[]) => string} git
 */
function driveFixture(dir, git) {
  git(['init', '-q', '-b', 'fixture']);
  git(['config', 'user.email', 'fixture@example.test']);
  git(['config', 'user.name', 'Fixture']);
  git(['config', 'commit.gpgsign', 'false']);
  writeFileSync(join(dir, 'fixture.txt'), 'a fixture file\n');
  git(['add', '.']);
  git(['commit', '-q', '-m', 'fixture base']);
  git(['switch', '-q', '-c', 'other']);
  git(['commit', '--allow-empty', '-q', '-m', 'move head']);
}

describe('fixture git — the repository a hook exported is out of reach', () => {
  test('this worker carries none of the repository variables, and the wiring that removed them is live', () => {
    const record = globalThis[GIT_ENV_ISOLATION];
    expect(record, 'tests/setup/gitEnvIsolation.js did not run in this worker. It must be listed'
      + ' in vite.config.js `test.setupFiles`: without it a script under test spawns git with a'
      + ' hook\'s GIT_DIR and writes to the real repository.').toBeTruthy();
    expect(Array.isArray(record.removed)).toBe(true);
    const leftovers = record.removed.filter((name) => !REPOSITORY_ENV.includes(name.toUpperCase()));
    expect(leftovers, 'the setup file removed a variable REPOSITORY_ENV does not name').toEqual([]);

    const present = Object.keys(process.env).map((name) => name.toUpperCase());
    for (const name of REPOSITORY_ENV) {
      expectAbsentWithAnchor(present, name, 'PATH', `process.env after the runner-level scrub: ${name}`);
    }
  });

  test('REPOSITORY_ENV names every variable this git calls repository-local', () => {
    const dir = tempDir('git-fixture-vars-');
    const gitsOwn = fixtureGit(dir, ['rev-parse', '--local-env-vars']).split('\n').filter(Boolean);
    // The anchor: the question was answered, and with the variable this whole file is about.
    expect(gitsOwn).toContain('GIT_DIR');
    const named = new Set([...REPOSITORY_ENV, ...REPOSITORY_ENV_CONFIGURATION]);
    const unnamed = gitsOwn.filter((name) => !named.has(name));
    expect(unnamed, 'this git treats the variable(s) above as belonging to ONE repository — it'
      + ' clears them before running in another — and tests/helpers/gitFixture.js does not'
      + ' name them. Add each to REPOSITORY_ENV (it redirects which repository, index or'
      + ' object store git uses) or to REPOSITORY_ENV_CONFIGURATION (it only carries'
      + ' configuration), and to the `unset` line of .husky/pre-push.').toEqual([]);
    // The two lists are disjoint, and the split is the documented one.
    expect(REPOSITORY_ENV.filter((name) => REPOSITORY_ENV_CONFIGURATION.includes(name))).toEqual([]);
    expect([...REPOSITORY_ENV_CONFIGURATION]).toEqual(['GIT_CONFIG_PARAMETERS', 'GIT_CONFIG_COUNT']);
  });

  test('the runner-level scrub removes the repository variables and nothing else', () => {
    const env = {
      PATH: '/usr/bin',
      HOME: '/home/someone',
      GIT_DIR: '/elsewhere/.git',
      GIT_WORK_TREE: '/elsewhere',
      GIT_INDEX_FILE: '/elsewhere/.git/index',
      GIT_COMMON_DIR: '/elsewhere/.git',
      GIT_PREFIX: 'sub/',
      Git_Object_Directory: '/elsewhere/.git/objects',
      GIT_CONFIG_COUNT: '1',
      GIT_CONFIG_KEY_0: 'safe.directory',
      GIT_CONFIG_VALUE_0: '*',
      GIT_CONFIG_PARAMETERS: "'safe.directory'='*'",
      GIT_AUTHOR_NAME: 'Someone',
      GIT_SSL_CAINFO: '/etc/ca.crt',
    };
    const copy = withoutRepositoryEnv(env);
    expect(Object.keys(copy).sort()).toEqual([
      'GIT_AUTHOR_NAME', 'GIT_CONFIG_COUNT', 'GIT_CONFIG_KEY_0', 'GIT_CONFIG_PARAMETERS',
      'GIT_CONFIG_VALUE_0', 'GIT_SSL_CAINFO', 'HOME', 'PATH',
    ]);
    // The copy is a copy: the caller's object still holds everything it held.
    expect(Object.keys(env)).toHaveLength(14);
    expect(scrubRepositoryEnv(env)).toEqual([
      'GIT_COMMON_DIR', 'GIT_DIR', 'GIT_INDEX_FILE', 'GIT_PREFIX', 'GIT_WORK_TREE', 'Git_Object_Directory',
    ]);
    expect(env).toEqual(copy);
    // Idempotent, and it says so: a second pass removes nothing.
    expect(scrubRepositoryEnv(env)).toEqual([]);
  });

  test('a raw git obeys its cwd once the runner-level scrub has run, and reaches the decoy before it', () => {
    // The git this arm is about is one this module never wraps: a script under test that
    // spawns `git` with `cwd` on a fixture root and whatever environment it inherited.
    const hostile = (decoy) => ({ ...withoutRepositoryEnv(), GIT_DIR: decoy.laneGitDir });
    const rawInit = (dir, env) => execFileSync('git', ['init', '-q'], { cwd: dir, env, stdio: 'ignore' });

    // BEFORE the scrub: `git init` in an empty temp directory re-initialises the DECOY. From a
    // linked worktree's git dir that is the write that sets `core.bare = true`.
    const exposed = buildDecoy();
    const exposedBefore = pictureOf(exposed);
    const untouched = tempDir('git-fixture-raw-');
    rawInit(untouched, hostile(exposed));
    expect(existsSync(join(untouched, '.git')), 'the raw init never created a repository in'
      + ' its own cwd — it went to GIT_DIR instead').toBe(false);
    expect(movedPaths(exposedBefore, pictureOf(exposed))).toContain('config');
    expect(pictureOf(exposed).config).toContain('bare = true');

    // AFTER it: the same spawn, the same cwd, and the decoy does not move.
    const guarded = buildDecoy();
    const guardedBefore = pictureOf(guarded);
    const dir = tempDir('git-fixture-raw-');
    rawInit(dir, withoutRepositoryEnv(hostile(guarded)));
    expect(existsSync(join(dir, '.git'))).toBe(true);
    expect(pictureOf(guarded)).toEqual(guardedBefore);
  }, 60_000);

  test('⭐ with a hook\'s variables pointed at a decoy, fixtureGit leaves its config, HEAD and refs byte-identical', () => {
    for (const row of HOSTILE_ENVIRONMENTS) {
      // ── THE CONTROL: this environment really does expose a repository. A raw git, given
      // the row's variables, moves the file the row names in a decoy built for the purpose.
      const exposed = buildDecoy();
      const exposedBefore = pictureOf(exposed);
      const rawDir = tempDir('git-fixture-raw-');
      const rawEnv = { ...withoutRepositoryEnv(), ...row.env(exposed) };
      const raw = (args) => {
        try {
          return execFileSync('git', args, { cwd: rawDir, env: rawEnv, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
        } catch {
          // A leaking fixture also FAILS in odd places (a bare repository has no work tree to
          // add from). The control measures what reached the decoy, not whether git was happy.
          return '';
        }
      };
      driveFixture(rawDir, raw);
      expect(movedPaths(exposedBefore, pictureOf(exposed)), `control [${row.name}]: a raw git`
        + ` did not move the decoy's ${row.exposes}, so this row exposes nothing and its guard`
        + ' below would pass for no reason').toContain(row.exposes);

      // ── THE GUARD: the same variables, in this process's own environment as a hook would
      // leave them, and the same verbs through fixtureGit.
      const decoy = buildDecoy();
      const before = pictureOf(decoy);
      const dir = tempDir('git-fixture-guard-');
      const facts = withProcessEnv(row.env(decoy), () => {
        driveFixture(dir, (args) => fixtureGit(dir, args));
        return {
          gitDir: fixtureGit(dir, ['rev-parse', '--path-format=absolute', '--git-dir']).trim(),
          bare: fixtureGit(dir, ['rev-parse', '--is-bare-repository']).trim(),
          branch: fixtureGit(dir, ['symbolic-ref', '--short', 'HEAD']).trim(),
          commits: fixtureGit(dir, ['log', '--format=%an <%ae> / %cn <%ce> / %s']).trim().split('\n'),
          localName: fixtureGit(dir, ['config', '--local', '--get', 'user.name']).trim(),
          status: fixtureGit(dir, ['status', '--porcelain=v1', '--untracked-files=all']),
        };
      });

      const after = pictureOf(decoy);
      expect(after.config, `[${row.name}] the decoy's config`).toBe(before.config);
      expect(after.head, `[${row.name}] the decoy's HEAD`).toBe(before.head);
      expect(after.laneHead, `[${row.name}] the decoy worktree's HEAD`).toBe(before.laneHead);
      expect(after.refs, `[${row.name}] the decoy's refs`).toEqual(before.refs);
      expect(after.packedRefs, `[${row.name}] the decoy's packed refs`).toBe(before.packedRefs);
      expect(movedPaths(before, after), `[${row.name}] every other byte of the decoy's git dir`).toEqual([]);
      expect(after, `[${row.name}] the decoy's work trees`).toEqual(before);

      // …and the fixture got everything the decoy did not: its own git dir, its own branch,
      // its own two commits under the identity the TEST configured.
      expect(facts.gitDir, `[${row.name}]`).toBe(join(dir, '.git'));
      expect(facts.bare, `[${row.name}]`).toBe('false');
      expect(facts.branch, `[${row.name}]`).toBe('other');
      expect(facts.commits, `[${row.name}]`).toEqual([
        'Fixture <fixture@example.test> / Fixture <fixture@example.test> / move head',
        'Fixture <fixture@example.test> / Fixture <fixture@example.test> / fixture base',
      ]);
      expect(facts.localName, `[${row.name}]`).toBe('Fixture');
      expect(facts.status, `[${row.name}]`).toBe('');
      expectAbsentWithAnchor(facts.commits.join('\n'), 'Hostile', 'Fixture <fixture@example.test>',
        `[${row.name}] the hook's identity never signs a fixture commit`);
    }
  }, 120_000);

  test('a fixture sees no ambient GIT_* variable, no global configuration, and only the extras it asked for', () => {
    const dir = tempDir('git-fixture-env-');
    const env = withProcessEnv({
      GIT_DIR: join(dir, 'elsewhere', '.git'),
      GIT_NAMESPACE: 'hostile',
      GIT_TEMPLATE_DIR: join(dir, 'templates'),
      GIT_CONFIG_GLOBAL: join(dir, 'hostile.gitconfig'),
      GIT_AUTHOR_DATE: '1999-01-01T00:00:00Z',
      GIT_EXEC_PATH: '/kept/by/design',
    }, () => fixtureGitEnv(dir, { GIT_AUTHOR_DATE: '2026-01-01T00:00:00Z' }));

    const gitNames = Object.keys(env).filter((name) => name.toUpperCase().startsWith('GIT_')).sort();
    expect(gitNames).toEqual([
      'GIT_AUTHOR_DATE', 'GIT_CEILING_DIRECTORIES', 'GIT_CONFIG_GLOBAL', 'GIT_CONFIG_NOSYSTEM',
      'GIT_EXEC_PATH', 'GIT_TERMINAL_PROMPT',
    ]);
    expect(env.GIT_AUTHOR_DATE).toBe('2026-01-01T00:00:00Z');
    expect(env.GIT_CEILING_DIRECTORIES).toBe(dirname(dir));
    // The extras are applied LAST, so they also outrank this module's own defaults: a
    // fixture that needs a global file of its own names one, and gets that file.
    const ownGlobal = join(dir, 'own.gitconfig');
    expect(fixtureGitEnv(dir, { GIT_CONFIG_GLOBAL: ownGlobal }).GIT_CONFIG_GLOBAL).toBe(ownGlobal);
    expect(env.GIT_CONFIG_GLOBAL, 'and without that extra, the global file is nothing at all')
      .toBe(devNull);
    // …but an extra may never say WHICH repository: that is the root's job alone.
    for (const name of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'git_common_dir']) {
      expect(() => fixtureGitEnv(dir, { [name]: join(dir, 'elsewhere') }), name)
        .toThrow(/fixtureGit REFUSED: the extra environment names /);
    }
    expect(env.GIT_CONFIG_NOSYSTEM).toBe('1');
    expect(env.GIT_EXEC_PATH).toBe('/kept/by/design');
    // Everything that is not git's is passed through untouched — PATH above all.
    expect(env.PATH).toBe(process.env.PATH);

    // And the global file really is out of reach: an identity set there does not exist here.
    const home = tempDir('git-fixture-home-');
    writeFileSync(join(home, '.gitconfig'), '[user]\n\tname = FromTheGlobalFile\n');
    const seen = withProcessEnv({ HOME: home, XDG_CONFIG_HOME: join(home, 'xdg') }, () => {
      fixtureGit(dir, ['init', '-q']);
      fixtureGit(dir, ['config', 'user.email', 'fixture@example.test']);
      return fixtureGit(dir, ['config', '--list', '--show-origin']);
    });
    expectAbsentWithAnchor(seen, 'FromTheGlobalFile', 'user.email=fixture@example.test',
      'the configuration a fixture git reads');
  }, 60_000);

  test('a fixture root is never this checkout, and a directory that is not a repository fails closed', () => {
    expect(() => fixtureGit(SUITE_ROOT, ['status'])).toThrow(/fixtureGit REFUSED: .* is the checkout this suite belongs to/);
    expect(() => fixtureGitEnv(SUITE_ROOT)).toThrow(/fixtureGit REFUSED/);
    expect(() => fixtureGit('', ['status'])).toThrow(/the fixture root must be a directory path/);

    // A plain directory INSIDE a fixture repository. Without the ceiling, git would walk up
    // and answer for the repository above it — the same walk that, from a temp directory
    // inside a checkout, ends in the real one.
    const outer = tempDir('git-fixture-outer-');
    fixtureGit(outer, ['init', '-q', '-b', 'fixture']);
    const inner = join(outer, 'plain');
    mkdirSync(inner);
    // The control: the nesting is real — asked from the outer root, git finds it from below.
    expect(fixtureGit(outer, ['-C', 'plain', 'rev-parse', '--show-toplevel']).trim()).toBe(outer);
    expect(() => fixtureGit(inner, ['rev-parse', '--show-toplevel'])).toThrow(/not a git repository/);
  }, 60_000);

  test('⛔ a helper that has lost its direction refuses before a single verb runs', async () => {
    // THE FAULT, INJECTED: both directions gone at once — git's own `-C <root>` stripped from
    // the arguments and the spawn's `cwd` replaced. That is what a regression of the module
    // looks like from git's side, and it is aimed at a DECOY: the fault names the directory
    // git lands in, and this arm never lets that be anything but a temp repository.
    const landIn = (elsewhere) => (real) => (file, args, options) => real(
      file, args[0] === '-C' ? args.slice(2) : args, { ...options, cwd: elsewhere },
    );
    const fresh = tempDir('git-fixture-lost-');

    // THE CONTROL: the fault is a real one. Spawned through it with a fixture's own
    // environment, an ordinary config write lands in the decoy.
    const exposed = buildDecoy();
    const exposedBefore = pictureOf(exposed);
    landIn(exposed.main)(execFileSync)('git', ['-C', fresh, 'config', 'user.name', 'Leaked'], {
      cwd: fresh, env: fixtureGitEnv(fresh), encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    });
    expect(movedPaths(exposedBefore, pictureOf(exposed))).toEqual(['config']);

    // THE GUARD: the module itself, loaded afresh over that same fault.
    const decoy = buildDecoy();
    const before = pictureOf(decoy);
    vi.resetModules();
    vi.doMock('node:child_process', async (importOriginal) => {
      const real = await importOriginal();
      return { ...real, execFileSync: landIn(decoy.main)(real.execFileSync) };
    });
    try {
      const faulty = await import('./gitFixture.js');
      const refusal = /fixtureGit REFUSED: git, started for the fixture root .* would use the repository at .*Nothing was run/s;
      expect(() => faulty.fixtureGit(fresh, ['init', '-q'])).toThrow(refusal);
      expect(() => faulty.fixtureGit(fresh, ['config', 'user.name', 'Leaked'])).toThrow(refusal);
      expect(() => faulty.fixtureGit(fresh, ['commit', '--allow-empty', '-m', 'leaked'])).toThrow(refusal);
    } finally {
      vi.doUnmock('node:child_process');
      vi.resetModules();
    }
    expect(pictureOf(decoy), 'the faulted module was refused, and refused BEFORE anything ran:'
      + ' the repository it would have written to is byte-identical').toEqual(before);
    expect(existsSync(join(fresh, '.git'))).toBe(false);
  }, 60_000);

  test('the pre-push hook forgets the same variables, and does it before it starts the check', () => {
    // The third level. `npm run check` is the hook's whole body and Vitest is only one of its
    // steps: unset at the top of the hook, the variables never reach ANY of them.
    const hook = readFileSync(join(SUITE_ROOT, '.husky/pre-push'), 'utf8');
    // The file as sh reads it: a backslash-newline joins two physical lines into one.
    const logicalLines = hook.replace(/\\\n/g, ' ').split('\n');
    const unsetAt = logicalLines.findIndex((line) => /^\s*unset\s/.test(line));
    const firstCommandAt = logicalLines.findIndex((line) => /^\s*npm\s/.test(line));
    expect(logicalLines.filter((line) => /^\s*unset\s/.test(line)), '.husky/pre-push carries exactly'
      + ' ONE `unset` statement, so there is one list to keep and one line to read').toHaveLength(1);
    expect(firstCommandAt, 'the hook no longer starts an npm script — this arm lost its subject')
      .toBeGreaterThan(-1);
    expect(unsetAt, 'the hook must forget the repository BEFORE its first command: an `unset`'
      + ' below `npm run check` protects nothing that check spawns').toBeLessThan(firstCommandAt);
    const statement = logicalLines[unsetAt].trim();
    expect(statement.split(/\s+/).slice(1).sort(), 'the hook and tests/helpers/gitFixture.js must'
      + ' name the SAME variables. Change REPOSITORY_ENV and this statement together.')
      .toEqual([...REPOSITORY_ENV].sort());

    // AND EXECUTED — the hook's own bytes, under sh, in an environment that carries every one.
    const hostile = Object.fromEntries(REPOSITORY_ENV.map((name) => [name, `/hostile/${name}`]));
    const survivors = execFileSync('sh', ['-ec', `${statement}\nenv`], {
      env: { ...withoutRepositoryEnv(), ...hostile, GIT_CONFIG_COUNT: '0', KEPT_BY_THE_HOOK: 'yes' },
      encoding: 'utf8',
    }).split('\n').map((line) => line.split('=')[0]);
    for (const name of REPOSITORY_ENV) {
      expectAbsentWithAnchor(survivors, name, 'KEPT_BY_THE_HOOK', `the environment after the hook's unset: ${name}`);
    }
    // Configuration is not a location, and the hook leaves it exactly where it found it.
    expect(survivors).toContain('GIT_CONFIG_COUNT');
  });
});
