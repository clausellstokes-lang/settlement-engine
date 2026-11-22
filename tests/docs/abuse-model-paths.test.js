/**
 * abuse-model-paths.test.js — doc-lint for docs/abuse-model.md.
 *
 * The abuse model names concrete repo files as evidence for each mitigation
 * (`_shared/requestMeta.ts#botGuard`, `supabase/tests/profile_security.sql`,
 * the contract/grounding test files, …). Those references are load-bearing:
 * a reader trusts the doc because it points at code they can open. A future
 * rename would silently rot the pointer — the mitigation still exists, but the
 * doc now lies about where it lives.
 *
 * This pin extracts every path-like backtick span from the doc and asserts it
 * resolves to a real file on disk, so a rename fails the gate instead of the
 * doc going stale unnoticed. It is deliberately narrow: it validates PATHS,
 * not prose claims (those are argued in the doc's own coverage sections).
 *
 * Token shapes handled:
 *   - full repo-relative paths           (`tests/…`, `supabase/tests/…`, `supabase/functions/`)
 *   - functions-relative + `#symbol`     (`_shared/requestMeta.ts#botGuard`)
 *   - bare filenames                     (`Cover.jsx`, `anonGenCounter.js`, `config.toml`)
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..');
const rel = (p) => path.join(REPO, p);
const DOC = 'docs/abuse-model.md';

// A backtick span counts as a path reference if it contains a slash or ends in
// a known source extension. `#symbol` anchors and trailing slashes are allowed.
const PATH_TOKEN_RE = /\/|\.(?:js|jsx|ts|tsx|sql|toml|md)(?:#|$)/;
const EXT_RE = /\.(?:js|jsx|ts|tsx|sql|toml|md)$/;

/** Roots a bare filename may live under (excludes node_modules + git worktrees). */
const SEARCH_ROOTS = ['src', 'supabase', 'tests', 'docs', 'scripts'];

function findFilename(name, dir, depth = 0) {
  if (depth > 8 || !fs.existsSync(dir)) return false;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'worktrees' || e.name === '.git') continue;
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (findFilename(name, fp, depth + 1)) return true;
    } else if (e.name === name) {
      return true;
    }
  }
  return false;
}

/** Resolve a doc path token to a real file; returns null on success or a reason string. */
function resolvePathToken(raw) {
  // Strip a trailing `#symbol` anchor and any trailing slash.
  const token = raw.replace(/#.*$/, '').replace(/\/$/, '');
  if (!token) return null; // e.g. a lone `/` — nothing to check

  // 1. Literal repo-relative path (file or directory).
  if (token.includes('/')) {
    if (fs.existsSync(rel(token))) return null;
    // 2. Functions-relative shorthand (`_shared/…` lives under supabase/functions/).
    if (fs.existsSync(rel(path.join('supabase/functions', token)))) return null;
    return `no file at "${token}" (nor under supabase/functions/)`;
  }

  // 3. Bare filename — must be a real source file findable under a known root.
  if (!EXT_RE.test(token)) return null; // not a path token after all
  for (const root of SEARCH_ROOTS) {
    if (findFilename(token, rel(root))) return null;
  }
  return `bare filename "${token}" not found under ${SEARCH_ROOTS.join('/')}`;
}

const docText = fs.readFileSync(rel(DOC), 'utf8');
const spans = [...docText.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
const pathTokens = [...new Set(spans.filter((s) => PATH_TOKEN_RE.test(s)))];

describe('abuse-model.md path references resolve to real files', () => {
  it('the doc exists and contains path references (regex did not silently break)', () => {
    expect(fs.existsSync(rel(DOC))).toBe(true);
    expect(pathTokens.length).toBeGreaterThanOrEqual(5);
  });

  it('every path-like backtick span resolves to a file on disk', () => {
    const broken = [];
    for (const t of pathTokens) {
      const why = resolvePathToken(t);
      if (why) broken.push(`\`${t}\`: ${why}`);
    }
    expect(broken, `\nStale path references in ${DOC}:\n${broken.join('\n')}\n`).toEqual([]);
  });

  // Positive/negative controls so a green pass means the resolver discriminates.
  it('resolver discriminates (controls)', () => {
    expect(resolvePathToken('supabase/tests/profile_security.sql')).toBeNull();
    expect(resolvePathToken('_shared/requestMeta.ts#botGuard')).toBeNull();
    expect(resolvePathToken('Cover.jsx')).toBeNull();
    expect(resolvePathToken('tests/__nope__/missing.test.js')).toMatch(/no file/);
    expect(resolvePathToken('__never_a_real_file__.js')).toMatch(/not found/);
  });
});
