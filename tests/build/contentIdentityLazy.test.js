/**
 * First-paint contract for custom-content identity and field intent.
 *
 * Config boot needs two values: the canonical vanilla environment pointer and
 * the record of public config fields the player explicitly touched. Those
 * paths do not need hashing, validation, or generator application. Campaign
 * persistence separately retains compact synchronous identity admission.
 * These assertions keep the config boundary structural; the dist-level
 * custom-schema closure guard then proves the routed result.
 */

import { describe, expect, it } from 'vitest';
import {
  existsSync,
  readFileSync,
  statSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const ROOT = process.cwd();
const SRC = resolve(ROOT, 'src');
const DIST = resolve(ROOT, 'dist');
const ASSETS = resolve(DIST, 'assets');

/** @param {string} source */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}

/** @param {string} from @param {string} specifier */
function resolveRelativeImport(from, specifier) {
  if (!specifier.startsWith('.')) return null;
  const base = resolve(dirname(from), specifier);
  for (const candidate of [
    base,
    `${base}.js`,
    `${base}.jsx`,
    join(base, 'index.js'),
    join(base, 'index.jsx'),
  ]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

/** @param {string} file */
function staticImports(file) {
  const source = stripComments(readFileSync(file, 'utf8'));
  const specifiers = [];
  for (const match of source.matchAll(
    /(?:^|[^.\w])import\s+(?:[^'"()]*?\sfrom\s+)?['"]([^'"]+)['"]/g,
  )) {
    specifiers.push(match[1]);
  }
  for (const match of source.matchAll(
    /(?:^|[^.\w])export\s+[^'"]*?\sfrom\s+['"]([^'"]+)['"]/g,
  )) {
    specifiers.push(match[1]);
  }
  return specifiers
    .map(specifier => resolveRelativeImport(file, specifier))
    .filter(Boolean);
}

function eagerSourceGraph() {
  const entry = resolve(SRC, 'main.jsx');
  const seen = new Set([entry]);
  const queue = [entry];
  while (queue.length > 0) {
    const file = queue.shift();
    for (const dependency of staticImports(file)) {
      if (seen.has(dependency)) continue;
      seen.add(dependency);
      queue.push(dependency);
    }
  }
  return seen;
}

/** @param {string} source */
function emittedStaticImports(source) {
  const imports = new Set();
  for (const match of source.matchAll(
    /\bfrom\s*["'](\.\/[^"']+\.js)["']/g,
  )) {
    imports.add(match[1].slice(2));
  }
  for (const match of source.matchAll(
    /(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g,
  )) {
    imports.add(match[1].slice(2));
  }
  return [...imports];
}

function emittedEntryClosure() {
  const html = readFileSync(resolve(DIST, 'index.html'), 'utf8');
  const entry = html.match(
    /<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/,
  )?.[1];
  if (!entry) throw new Error('Built index.html has no module entry.');
  const seen = new Set([entry]);
  const queue = [entry];
  while (queue.length > 0) {
    const file = queue.shift();
    const source = readFileSync(resolve(ASSETS, file), 'utf8');
    for (const dependency of emittedStaticImports(source)) {
      if (seen.has(dependency)) continue;
      seen.add(dependency);
      queue.push(dependency);
    }
  }
  return [...seen];
}

describe('custom-content first-paint identity leaves', () => {
  it('keeps vanilla identity and field intent dependency-free', () => {
    for (const relativePath of [
      'domain/content/contentEnvironmentDefaults.js',
      'domain/content/userContentTunableIntent.js',
    ]) {
      const source = stripComments(
        readFileSync(resolve(SRC, relativePath), 'utf8'),
      );
      expect(source, `${relativePath} must remain a zero-import eager leaf`)
        .not.toMatch(/^\s*import\s/m);
    }
  });

  it('keeps full tunable application and neighbour generation outside eager source', () => {
    const eager = eagerSourceGraph();
    const forbidden = [
      resolve(SRC, 'domain/content/userContentTunables.js'),
      resolve(SRC, 'generators/crossSettlementConflicts.js'),
    ];
    expect(
      forbidden.filter(file => eager.has(file)).map(file => file.slice(ROOT.length)),
      'lazy tunable or neighbour generation reached main.jsx statically',
    ).toEqual([]);
  });

  it('routes store intent through the eager leaf, never the full authority', () => {
    for (const relativePath of ['store/configSlice.js', 'store/persistMerge.js']) {
      const source = stripComments(
        readFileSync(resolve(SRC, relativePath), 'utf8'),
      );
      expect(source).toMatch(/userContentTunableIntent\.js/);
      expect(source).not.toMatch(/userContentTunables\.js/);
    }
  });

  it('the closed intent registry stays aligned with full tunable validation', async () => {
    const [{ USER_CONTENT_TUNABLE_INTENT_DEFAULTS }, { USER_CONTENT_TUNABLES }] =
      await Promise.all([
        import('../../src/domain/content/userContentTunableIntent.js'),
        import('../../src/domain/content/userContentTunables.js'),
      ]);
    expect(Object.keys(USER_CONTENT_TUNABLE_INTENT_DEFAULTS).sort())
      .toEqual(Object.keys(USER_CONTENT_TUNABLES).sort());
    for (const [key, defaultValue] of Object.entries(
      USER_CONTENT_TUNABLE_INTENT_DEFAULTS,
    )) {
      expect(USER_CONTENT_TUNABLES[key].defaultValue).toBe(defaultValue);
    }
  });

  it('the checked vanilla constant is admitted by the full lazy authority', async () => {
    const [{ VANILLA_CONTENT_ENVIRONMENT }, { admitContentEnvironmentRevision }] =
      await Promise.all([
        import('../../src/domain/content/contentEnvironmentDefaults.js'),
        import('../../src/domain/content/contentEnvironment.js'),
      ]);
    expect(admitContentEnvironmentRevision(VANILLA_CONTENT_ENVIRONMENT))
      .toEqual({ ok: true, environment: VANILLA_CONTENT_ENVIRONMENT });
  });
});

describe.runIf(existsSync(ASSETS))(
  'custom-content identity emitted chunk boundary',
  () => {
    it('loads compact identity eagerly without pulling full tunables', () => {
      const closure = emittedEntryClosure();
      expect(
        closure.filter(file => /^content-identity-/.test(file)),
        'strict campaign identity must remain synchronously available',
      ).toHaveLength(1);
      expect(
        closure.filter(file => /^custom-schema-/.test(file)),
        `full tunable/custom schema returned to first paint:\n${
          closure.join('\n')
        }`,
      ).toHaveLength(0);
    });
  },
);
