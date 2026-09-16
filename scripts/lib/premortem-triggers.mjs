/**
 * premortem-triggers.mjs — the trigger predicates for scripts/premortem.mjs.
 *
 * ── THE ONE RULE THIS FILE OBEYS ────────────────────────────────────────────
 * DERIVE THE TRIGGER; DO NOT HAND-LIST IT. A hand-restated derivable goes stale
 * and a stale predicate matches nothing — which is the worst failure an advisory
 * instrument can have, because "no warnings" and "the population went empty" are
 * the same green. So every predicate that CAN read its population out of a repo
 * artifact does, at run time, and declares that artifact in `sources` so the
 * self-check can prove the artifact still exists and still yields a NON-EMPTY
 * population.
 *
 * Each predicate declares `derivation`:
 *   'derived'  — the matched population is read from a repo artifact or from git
 *                itself at run time. Adding a sixth edge bundle, a new baselined
 *                file, or a new ratchet JSON extends the predicate with no edit.
 *   'hybrid'   — the population is derived but the MATCHING PATTERN is authored
 *                (a regex over added lines). Counted as AUTHORED in the headline
 *                ratio: the authored half is the half that rots.
 *   'authored' — a literal this repo supplies no artifact for.
 * scripts/premortem.mjs reports the ratio, because that ratio is this
 * instrument's predicted shelf life.
 *
 * ── ADVISORY, DELIBERATELY ──────────────────────────────────────────────────
 * These predicates are heuristics and WILL false-positive. The consumer prints
 * loudly and exits 0. A noisy blocker gets disabled, and a disabled instrument
 * is worth less than no instrument.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';

// ── Context: read artifacts from a git rev (retro mode) or the worktree ──────

/**
 * Build the artifact reader every predicate uses.
 * @param {{root: string, rev: string|null}} opts `rev` null => read the worktree.
 * @returns {object} context
 */
export function makeContext({ root, rev }) {
  const cache = new Map();
  const git = (args) => execFileSync('git', args, {
    cwd: root, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'],
  });

  const read = (rel) => {
    const key = `r:${rel}`;
    if (cache.has(key)) return cache.get(key);
    let out;
    try {
      out = rev ? git(['show', `${rev}:${rel}`]) : readFileSync(join(root, rel), 'utf8');
    } catch { out = null; }
    cache.set(key, out);
    return out;
  };

  const json = (rel) => {
    const key = `j:${rel}`;
    if (cache.has(key)) return cache.get(key);
    const raw = read(rel);
    let out = null;
    if (raw) { try { out = JSON.parse(raw); } catch { out = null; } }
    cache.set(key, out);
    return out;
  };

  /** Files directly under a directory, repo-relative, sorted. */
  const list = (dirRel) => {
    const key = `l:${dirRel}`;
    if (cache.has(key)) return cache.get(key);
    let out;
    try {
      if (rev) {
        out = git(['ls-tree', '--name-only', rev, `${dirRel}/`])
          .split('\n').map((s) => s.trim()).filter(Boolean);
      } else {
        out = readdirSync(join(root, dirRel))
          .filter((e) => statSync(join(root, dirRel, e)).isFile())
          .map((e) => `${dirRel}/${e}`);
      }
    } catch { out = []; }
    out.sort();
    cache.set(key, out);
    return out;
  };

  const exists = (rel) => read(rel) !== null || list(rel).length > 0;

  /**
   * Every TRACKED file whose bytes contain `literal`, at the context's rev.
   * This is how the rename/delete predicates stay fully derived: git does the
   * search, so nothing here can go stale against a list nobody updated.
   */
  const grepPath = (literal) => {
    const key = `g:${literal}`;
    if (cache.has(key)) return cache.get(key);
    let out;
    try {
      const args = ['grep', '-l', '-a', '-F', '--', literal];
      if (rev) args.push(rev);
      const raw = git(args);
      out = raw.split('\n').map((s) => s.trim()).filter(Boolean)
        .map((s) => (rev && s.startsWith(`${rev}:`) ? s.slice(rev.length + 1) : s));
    } catch { out = []; } // git grep exits 1 on no match — not an error here
    cache.set(key, out);
    return out;
  };

  return { root, rev, read, json, list, exists, grepPath };
}

// ── Small shared helpers ────────────────────────────────────────────────────

const SRC_EXT = /\.(js|jsx|mjs|ts|tsx)$/;
const TEST_FILE = /\.test\.(js|jsx)$/;

/** Every path a change touches: the new path, plus a rename's OLD path. */
function touched(change) {
  return change.oldPath ? [change.path, change.oldPath] : [change.path];
}

/**
 * THE INSTRUMENT MUST NOT MATCH ITSELF. Every content-scanning predicate below
 * declares its pattern as source text, so this file and its CLI contain, by
 * construction, a literal example of every hazard they hunt — the first dogfood
 * run reported a NUL-escape, a piped exit status and three single-writer claims,
 * all of them this file's own regexes. That is the recorded self-match class
 * (the gate-mutex check greps a word that its own command line contains), and
 * the cure is the same one tests/lint/contractTestAntiVacuity.walker.test.js
 * uses: SELF-EXCLUDE. The prefix is DERIVED from this module's own basename, so
 * renaming the instrument moves the exclusion with it.
 *
 * ⚠ THE COST, STATED RATHER THAN HIDDEN: a real hazard authored INTO the
 * pre-mortem's own sources is invisible to the pre-mortem. That is why the
 * self-check exists, and why this file is byte-scanned by
 * tests/lint/controlBytes.test.js like everything else.
 */
const SELF_STEM = basename(fileURLToPath(import.meta.url)).split('-')[0]; // 'premortem'
const SELF_RE = new RegExp('^scripts/(lib/)?' + SELF_STEM + '[^/]*' + '$');

/** Is this path part of the pre-mortem instrument itself? */
export function isSelf(p) { return SELF_RE.test(p); }

/** All added lines across the changeset as [path, line] pairs. */
function allAdded(changeset, filter = () => true) {
  const out = [];
  for (const [path, lines] of changeset.added) {
    if (isSelf(path)) continue;
    if (!filter(path)) continue;
    for (const line of lines) out.push([path, line]);
  }
  return out;
}

/** Non-underscore keys of a baseline map (the `_doc`/`_note` keys are prose). */
function realKeys(obj) {
  return obj && typeof obj === 'object' ? Object.keys(obj).filter((k) => !k.startsWith('_')) : [];
}

const EDGE_SHARED_DIR = 'supabase/functions/_shared';

/** Every bundle meta under the edge _shared dir — GLOBBED, never listed. */
function bundleMetas(ctx) {
  return ctx.list(EDGE_SHARED_DIR)
    .filter((p) => p.endsWith('.meta.json'))
    .map((p) => ({ path: p, meta: ctx.json(p) }))
    .filter((r) => r.meta && Array.isArray(r.meta.inputs));
}

/** path -> [bundle meta paths that name it as a build input]. */
function bundleInputIndex(ctx) {
  const idx = new Map();
  for (const { path, meta } of bundleMetas(ctx)) {
    for (const inp of meta.inputs) {
      if (!idx.has(inp)) idx.set(inp, []);
      idx.get(inp).push(path);
    }
  }
  return idx;
}

/** The five (or however many) built artifacts a full rebuild rewrites. */
function bundleArtifacts(ctx) {
  const out = new Set();
  for (const { path, meta } of bundleMetas(ctx)) {
    out.add(path);
    out.add(path.replace(/\.meta\.json$/, '.js'));
    if (meta.entry) out.add(meta.entry);
  }
  return out;
}

/**
 * Every scripts/*.json baseline that is a FLAT ARRAY OF REPO PATHS, keyed by the
 * baseline that holds it. Globbed so a new allowlist ratchet is covered the day
 * it lands, with no edit here.
 */
function pathAllowlists(ctx) {
  const out = [];
  for (const rel of ctx.list('scripts')) {
    if (!rel.endsWith('.json')) continue;
    if (rel.endsWith('hazard-registry.json')) continue;
    const j = ctx.json(rel);
    if (!Array.isArray(j) || j.length === 0) continue;
    if (!j.every((v) => typeof v === 'string' && SRC_EXT.test(v) && v.includes('/'))) continue;
    out.push({ baseline: rel, paths: new Set(j) });
  }
  return out;
}

/** The two per-file tsc ceilings, merged: path -> {baseline, ceiling}. */
function typecheckCeilings(ctx) {
  const out = new Map();
  for (const rel of ['scripts/.full-typecheck-baseline.json', 'scripts/.domain-strict-baseline.json']) {
    const j = ctx.json(rel);
    if (!j || !j.files) continue;
    for (const [p, n] of Object.entries(j.files)) {
      if (!out.has(p)) out.set(p, []);
      out.get(p).push({ baseline: rel, ceiling: n });
    }
  }
  return out;
}

/** The source roots the full-typecheck ratchet scans — read out of the baseline. */
function typecheckRoots(ctx) {
  const j = ctx.json('scripts/.full-typecheck-baseline.json');
  return Array.isArray(j && j.roots) ? j.roots : [];
}

/** Extract a JS array-of-strings literal assigned to `name` from source text. */
function extractStringArray(text, name) {
  if (!text) return [];
  const m = new RegExp(`${name}\\s*=\\s*\\[([^\\]]*)\\]`).exec(text);
  if (!m) return [];
  return [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]);
}

/** The src symbols an enforcer test imports — the seam that test guards. */
function enforcerImportedSymbols(ctx, testRel) {
  const text = ctx.read(testRel);
  if (!text) return [];
  const out = [];
  for (const m of text.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g)) {
    if (!/\/src\//.test(m[2]) && !m[2].startsWith('../../src')) continue;
    for (const sym of m[1].split(',')) {
      const s = sym.trim().split(/\s+as\s+/)[0].trim();
      if (s) out.push(s);
    }
  }
  return [...new Set(out)];
}

// Control bytes, built by code point so no NUL or other raw control byte is ever
// AUTHORED into this file. (Recorded hazard: an editor turns a backslash-u-0000
// spelling into a real NUL byte, and it has bitten six times.)
const CONTROL_CHARS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((c) => String.fromCharCode(c));

// ── The predicates ──────────────────────────────────────────────────────────

/** @type {Array<object>} */
export const PREDICATES = [
  // ────────────────────────────────────────────────────────── DERIVED ───────
  {
    id: 'edge-bundle-input-touched',
    classIds: ['HZ-EDGEBUNDLE'],
    derivation: 'derived',
    sources: [EDGE_SHARED_DIR],
    what: 'a file inside an edge bundle\'s recorded input closure changed',
    population: (ctx) => ({ label: 'bundle build inputs', items: [...bundleInputIndex(ctx).keys()] }),
    run(ctx, cs) {
      const idx = bundleInputIndex(ctx);
      const out = [];
      for (const ch of cs.changes) {
        for (const p of touched(ch)) {
          const metas = idx.get(p);
          if (!metas) continue;
          out.push({
            severity: 'warn',
            message: `${p} is a build input of ${metas.length} edge bundle(s) — run \`npm run build:edge-shared\` IN THIS COMMIT`,
            evidence: metas,
          });
        }
      }
      return out;
    },
    synthetic: (ctx) => {
      const first = [...bundleInputIndex(ctx).keys()][0];
      return first ? { changes: [{ status: 'M', path: first, oldPath: null }] } : null;
    },
  },
  {
    id: 'edge-bundle-input-renamed',
    classIds: ['HZ-EDGEBUNDLE'],
    derivation: 'derived',
    sources: [EDGE_SHARED_DIR],
    what: 'a bundled input was RENAMED — zero bytes changed, and every meta that records its PATH is now a lie',
    population: (ctx) => ({ label: 'bundle build inputs', items: [...bundleInputIndex(ctx).keys()] }),
    run(ctx, cs) {
      const idx = bundleInputIndex(ctx);
      const out = [];
      for (const ch of cs.changes) {
        if (ch.status !== 'R' || !ch.oldPath) continue;
        const metas = idx.get(ch.oldPath);
        if (!metas) continue;
        out.push({
          severity: 'warn',
          message: `PURE RENAME of a bundled input: ${ch.oldPath} -> ${ch.path}. This is the exact shape that bit the chair — "touching a bundled input" was read as not covering a git mv. The metas record the OLD path.`,
          evidence: metas,
        });
      }
      return out;
    },
    synthetic: (ctx) => {
      const first = [...bundleInputIndex(ctx).keys()][0];
      return first ? { changes: [{ status: 'R', path: `${first}.moved`, oldPath: first }] } : null;
    },
  },
  {
    id: 'edge-bundle-partial-rebuild',
    classIds: ['HZ-EDGEBUNDLE', 'HZ-DIRTYBUILD'],
    derivation: 'derived',
    sources: [EDGE_SHARED_DIR],
    what: 'some but not all edge bundle artifacts moved — the builder rewrites every bundle, always',
    population: (ctx) => ({ label: 'edge bundle artifacts', items: [...bundleArtifacts(ctx)] }),
    run(ctx, cs) {
      const metas = bundleMetas(ctx);
      if (metas.length === 0) return [];
      const changed = new Set(cs.changes.map((c) => c.path));
      // THE META IS THE TELL, NOT THE .js. A real `npm run build:edge-shared`
      // rewrites every meta (generatedAt churn alone moves it) even when a
      // bundle's emitted code is byte-identical. So "all metas moved" is a full
      // rebuild and must NOT warn — that is the negative control this predicate
      // exists to pass, and reading the .js set instead failed it.
      const movedMetas = metas.filter((m) => changed.has(m.path)).map((m) => m.path);
      const touchedAny = metas.some((m) => changed.has(m.path)
        || changed.has(m.path.replace(/\.meta\.json$/, '.js')));
      if (!touchedAny) return [];
      const out = [];
      if (movedMetas.length !== metas.length) {
        out.push({
          severity: 'warn',
          message: `edge bundle artifacts changed but only ${movedMetas.length} of ${metas.length} bundle METAS moved. A real rebuild rewrites ALL ${metas.length} metas (generatedAt churn included) — a partial set means the rebuild was hand-trimmed, never ran, or the tree was dirty when it did.`,
          evidence: metas.map((m) => `${changed.has(m.path) ? 'moved  ' : 'STATIC '} ${m.path}`),
        });
      }
      for (const m of metas) {
        const js = m.path.replace(/\.meta\.json$/, '.js');
        if (changed.has(js) && !changed.has(m.path)) {
          out.push({
            severity: 'warn',
            message: `${js} changed while ${m.path} did not. A built artifact edited without its meta is a HAND EDIT — the freshness test compares the meta's sourceHash, so this can go green while the bundle no longer matches its inputs.`,
            evidence: [js, m.path],
          });
        }
      }
      return out;
    },
    synthetic: (ctx) => {
      const metas = bundleMetas(ctx);
      if (metas.length < 2) return null;
      return { changes: [{ status: 'M', path: metas[0].path.replace(/\.meta\.json$/, '.js'), oldPath: null }] };
    },
  },
  {
    id: 'size-ceiling-file',
    classIds: ['HZ-SIZECEILING'],
    derivation: 'derived',
    sources: ['scripts/.size-baseline.json'],
    what: 'a file with a FROZEN, tolerance-zero max-lines ceiling was edited',
    population: (ctx) => ({ label: 'size-baselined files', items: realKeys(ctx.json('scripts/.size-baseline.json')) }),
    run(ctx, cs) {
      const base = ctx.json('scripts/.size-baseline.json') || {};
      const out = [];
      for (const ch of cs.changes) {
        for (const p of touched(ch)) {
          if (!(p in base) || p.startsWith('_')) continue;
          out.push({
            severity: 'warn',
            message: `${p} sits at an EXACT frozen ceiling of ${base[p]} effective lines (skipBlankLines+skipComments). Tolerance is zero and JSX comments count. New logic goes in a lazy leaf, not here.`,
            evidence: ['scripts/.size-baseline.json'],
          });
        }
      }
      return out;
    },
    synthetic: (ctx) => {
      const k = realKeys(ctx.json('scripts/.size-baseline.json'))[0];
      return k ? { changes: [{ status: 'M', path: k, oldPath: null }] } : null;
    },
  },
  {
    id: 'new-source-zero-ceiling',
    classIds: ['HZ-NEWFILECEILING'],
    derivation: 'derived',
    sources: ['scripts/.full-typecheck-baseline.json', 'scripts/.domain-strict-baseline.json'],
    what: 'a NEW source file arrived under a ratchet root, so its per-file error ceiling is ZERO',
    population: (ctx) => ({ label: 'typecheck ratchet roots', items: typecheckRoots(ctx) }),
    run(ctx, cs) {
      const roots = typecheckRoots(ctx);
      const ceilings = typecheckCeilings(ctx);
      if (roots.length === 0) return [];
      const out = [];
      for (const ch of cs.changes) {
        if (ch.status !== 'A' && ch.status !== 'R') continue;
        const p = ch.path;
        if (!SRC_EXT.test(p) || ceilings.has(p)) continue;
        if (!roots.some((r) => p.startsWith(r))) continue;
        out.push({
          severity: 'warn',
          message: `NEW un-baselined source file ${p}: its per-file ceiling is implicitly ZERO in both tsc ratchets. A net-zero total will NOT save it — the total was 177 before and after 67f8a58e and the per-file zero-ceiling law still reddened. Type it at the source; never widen the baseline.`,
          evidence: ['npm run typecheck:ratchet', 'npm run typecheck:domain:strict'],
        });
      }
      return out;
    },
    synthetic: (ctx) => {
      const r = typecheckRoots(ctx)[0];
      return r ? { changes: [{ status: 'A', path: `${r}__premortem_synthetic__.js`, oldPath: null }] } : null;
    },
  },
  {
    id: 'typecheck-ceiling-file',
    classIds: ['HZ-NEWFILECEILING'],
    derivation: 'derived',
    sources: ['scripts/.full-typecheck-baseline.json', 'scripts/.domain-strict-baseline.json'],
    what: 'a file carrying an EXACT tsc error ceiling was edited',
    population: (ctx) => ({ label: 'per-file tsc ceilings', items: [...typecheckCeilings(ctx).keys()] }),
    run(ctx, cs) {
      const ceilings = typecheckCeilings(ctx);
      const out = [];
      for (const ch of cs.changes) {
        for (const p of touched(ch)) {
          const rows = ceilings.get(p);
          if (!rows) continue;
          out.push({
            severity: 'note',
            message: `${p} has a frozen per-file error ceiling (${rows.map((r) => `${r.ceiling} in ${r.baseline}`).join('; ')}). Shrink-only: one new error reds, and a per-file tsc run is a VACUUM — run the ratchet, not tsc on the file.`,
            evidence: rows.map((r) => r.baseline),
          });
        }
      }
      return out;
    },
    synthetic: (ctx) => {
      const k = [...typecheckCeilings(ctx).keys()][0];
      return k ? { changes: [{ status: 'M', path: k, oldPath: null }] } : null;
    },
  },
  {
    id: 'observed-shape-inventory-file',
    classIds: ['HZ-READERNOWRITER'],
    derivation: 'derived',
    sources: ['scripts/.observed-shape-readers-baseline.json'],
    what: 'a file with FROZEN observed-shape reader rows was edited (or a new src file entered the scan)',
    population: (ctx) => {
      const j = ctx.json('scripts/.observed-shape-readers-baseline.json');
      return { label: 'observed-shape inventory files', items: realKeys(j && j.inventory) };
    },
    run(ctx, cs) {
      const j = ctx.json('scripts/.observed-shape-readers-baseline.json');
      const inv = (j && j.inventory) || {};
      const out = [];
      for (const ch of cs.changes) {
        for (const p of touched(ch)) {
          if (!(p in inv)) continue;
          const n = Object.keys(inv[p]).length;
          out.push({
            severity: 'note',
            message: `${p} holds ${n} frozen observed-shape reader row(s). A new optional-chained read of a nested key, or a \`= {}\` default, adds a row and reds the shrink-only inventory. Cure at the SOURCE (type the contract), never by re-freezing.`,
            evidence: ['npm run check:observed-shape-readers'],
          });
        }
      }
      for (const ch of cs.changes) {
        if (ch.status !== 'A' || !ch.path.startsWith('src/') || !SRC_EXT.test(ch.path)) continue;
        out.push({
          severity: 'note',
          message: `NEW src file ${ch.path} enters the observed-shape scan (every .js/.jsx under src/). Its unresolved reads land in the inventory — expect a re-freeze conversation, and the gate has caught its own author here before.`,
          evidence: ['scripts/.observed-shape-readers-baseline.json'],
        });
      }
      return out;
    },
    synthetic: (ctx) => {
      const j = ctx.json('scripts/.observed-shape-readers-baseline.json');
      const k = realKeys(j && j.inventory)[0];
      return k ? { changes: [{ status: 'M', path: k, oldPath: null }] } : null;
    },
  },
  {
    id: 'test-ratchet-red-file',
    classIds: ['HZ-REDRATCHETGROWS'],
    derivation: 'derived',
    sources: ['scripts/.test-ratchet-baseline.json'],
    what: 'a test file that already carries BASELINED-RED rows was edited',
    population: (ctx) => {
      const j = ctx.json('scripts/.test-ratchet-baseline.json');
      const e = (j && j.entries) || {};
      return { label: 'files with baselined-red tests', items: [...new Set(Object.values(e).map((r) => r.file))] };
    },
    run(ctx, cs) {
      const j = ctx.json('scripts/.test-ratchet-baseline.json');
      const entries = (j && j.entries) || {};
      const byFile = new Map();
      for (const row of Object.values(entries)) {
        if (!byFile.has(row.file)) byFile.set(row.file, []);
        byFile.get(row.file).push(row.test);
      }
      const out = [];
      for (const ch of cs.changes) {
        for (const p of touched(ch)) {
          const rows = byFile.get(p);
          if (!rows) continue;
          out.push({
            severity: 'warn',
            message: `${p} has ${rows.length} BASELINED-RED test(s). A red row cannot redden further, so anything this edit breaks inside it is INVISIBLE. Diff the red ratchet's CONTENTS across archives at wave end, not just its row count.`,
            evidence: rows.slice(0, 3),
          });
        }
      }
      return out;
    },
    synthetic: (ctx) => {
      const j = ctx.json('scripts/.test-ratchet-baseline.json');
      const row = Object.values((j && j.entries) || {})[0];
      return row ? { changes: [{ status: 'M', path: row.file, oldPath: null }] } : null;
    },
  },
  {
    id: 'mutation-manifest-row-owed',
    classIds: ['HZ-MUTANTNOOP', 'HZ-TESTVACUITY'],
    derivation: 'derived',
    sources: ['tests/lint/mutationCoverage.shared.mjs', 'scripts/mutation-coverage-manifest.json'],
    what: 'a new test file the E-A enumeration RULE claims, with no manifest row',
    population: (ctx) => {
      const man = ctx.json('scripts/mutation-coverage-manifest.json');
      const rows = man && typeof man === 'object'
        ? Object.keys(man).filter((k) => k.startsWith('tests/'))
        : [];
      return { label: 'mutation-manifest rows', items: rows.length ? rows : realKeys(man) };
    },
    run(ctx, cs) {
      const rule = ctx.enumRule; // injected: the imported enumeration rule, or null
      const man = ctx.json('scripts/mutation-coverage-manifest.json') || {};
      const known = new Set(Object.keys(man));
      const out = [];
      for (const ch of cs.changes) {
        if (ch.status !== 'A' && ch.status !== 'R') continue;
        if (!TEST_FILE.test(ch.path)) continue;
        const claimed = rule ? rule.claims(ch.path) : null;
        if (claimed === false) continue;
        if (known.has(ch.path)) continue;
        out.push({
          severity: 'warn',
          message: `${ch.path} is claimed by the E-A enumeration rule${claimed === null ? ' (rule module unreadable — assuming claimed)' : ''} and has NO row in scripts/mutation-coverage-manifest.json. Every enumerated invariant needs kind:'mutation' | 'rationale' | 'uncovered', and 'uncovered' counts against a shrink-only baseline.`,
          evidence: ['tests/lint/mutationCoverageManifest.test.js'],
        });
      }
      return out;
    },
    synthetic: () => ({ changes: [{ status: 'A', path: 'tests/lint/__premortemSynthetic.test.js', oldPath: null }] }),
  },
  {
    id: 'renamed-path-still-addressed',
    classIds: ['HZ-LINEADDR', 'HZ-EDGEBUNDLE', 'HZ-MUTANTNOOP'],
    derivation: 'derived',
    sources: [],
    what: 'a renamed path is still written, by name, inside other tracked files',
    population: null, // git itself is the population; nothing to go stale
    run(ctx, cs) {
      const changedNow = new Set(cs.changes.map((c) => c.path));
      const out = [];
      for (const ch of cs.changes) {
        if (ch.status !== 'R' || !ch.oldPath) continue;
        const holders = ctx.grepPath(ch.oldPath).filter((h) => !changedNow.has(h));
        if (holders.length === 0) continue;
        out.push({
          severity: 'warn',
          message: `${ch.oldPath} -> ${ch.path}: ${holders.length} OTHER tracked file(s) still spell the old path. A filename-anchored pin goes VACUOUS rather than red, and a baseline keyed on the old path silently un-guards.`,
          evidence: holders.slice(0, 8),
        });
      }
      return out;
    },
    synthetic: null, // proven live by the retro corpus instead of a synthetic
  },
  {
    id: 'deleted-path-still-addressed',
    classIds: ['HZ-LINEADDR'],
    derivation: 'derived',
    sources: [],
    what: 'a deleted path is still written, by name, inside other tracked files',
    population: null,
    run(ctx, cs) {
      const changedNow = new Set(cs.changes.map((c) => c.path));
      const out = [];
      for (const ch of cs.changes) {
        if (ch.status !== 'D') continue;
        const holders = ctx.grepPath(ch.path).filter((h) => !changedNow.has(h));
        if (holders.length === 0) continue;
        out.push({
          severity: 'warn',
          message: `${ch.path} is DELETED but ${holders.length} other tracked file(s) still name it. A guard that points at a file which no longer exists reads as "nothing to check".`,
          evidence: holders.slice(0, 8),
        });
      }
      return out;
    },
    synthetic: null,
  },
  {
    id: 'path-allowlist-baselined-file',
    classIds: ['HZ-SINGLEWRITER', 'HZ-REDRATCHETGROWS'],
    derivation: 'derived',
    sources: ['scripts'],
    what: 'a file named in some scripts/*.json path-allowlist ratchet was edited',
    population: (ctx) => ({
      label: 'path-allowlist ratchet members',
      items: pathAllowlists(ctx).flatMap((a) => [...a.paths]),
    }),
    run(ctx, cs) {
      const lists = pathAllowlists(ctx);
      const out = [];
      for (const ch of cs.changes) {
        for (const p of touched(ch)) {
          const hits = lists.filter((l) => l.paths.has(p)).map((l) => l.baseline);
          if (hits.length === 0) continue;
          out.push({
            severity: 'note',
            message: `${p} is a grandfathered member of ${hits.length} shrink-only allowlist(s). Editing it is the moment to REMOVE it, not to rely on the grandfather.`,
            evidence: hits,
          });
        }
      }
      return out;
    },
    synthetic: (ctx) => {
      const l = pathAllowlists(ctx)[0];
      return l ? { changes: [{ status: 'M', path: [...l.paths][0], oldPath: null }] } : null;
    },
  },
  {
    id: 'epistemic-generation-facing-test',
    classIds: ['HZ-EPISTEMIC'],
    derivation: 'derived',
    sources: ['tests/lint/negativeAssertionAnchor.walker.test.js'],
    what: 'a test under a GENERATION-FACING root, where anchored negatives and seed-failure helpers are mandatory',
    population: (ctx) => ({
      label: 'generation-facing test roots',
      items: extractStringArray(ctx.read('tests/lint/negativeAssertionAnchor.walker.test.js'), 'GENERATION_FACING_ROOTS'),
    }),
    run(ctx, cs) {
      const roots = extractStringArray(ctx.read('tests/lint/negativeAssertionAnchor.walker.test.js'), 'GENERATION_FACING_ROOTS');
      if (roots.length === 0) return [];
      const out = [];
      for (const ch of cs.changes) {
        if (ch.status === 'D') continue;
        if (!TEST_FILE.test(ch.path)) continue;
        if (!roots.some((r) => ch.path.startsWith(`${r}/`))) continue;
        out.push({
          severity: 'warn',
          message: `${ch.path} is generation-facing. Negative assertions must use tests/helpers/anchoredNegatives.js and seed loops tests/helpers/seedFailures.js, or the walker reds — an un-anchored \`.not.toMatch\` is a test that CANNOT fail.`,
          evidence: roots,
        });
      }
      return out;
    },
    synthetic: (ctx) => {
      const r = extractStringArray(ctx.read('tests/lint/negativeAssertionAnchor.walker.test.js'), 'GENERATION_FACING_ROOTS')[0];
      return r ? { changes: [{ status: 'A', path: `${r}/__premortemSynthetic.test.js`, oldPath: null }] } : null;
    },
  },
  {
    id: 'migration-added',
    classIds: ['HZ-SEARCHPATH', 'HZ-NETCURRENT'],
    derivation: 'derived',
    sources: ['scripts/check-migration-head.mjs'],
    what: 'a new SQL migration',
    population: (ctx) => {
      const t = ctx.read('scripts/check-migration-head.mjs') || '';
      const m = /['"`][^'"`]*?(supabase\/migrations)['"`]|\.\.\/(supabase\/migrations)/.exec(t);
      const dir = m ? (m[1] || m[2]) : null;
      return { label: 'migrations dir', items: dir ? [dir] : [] };
    },
    run(ctx, cs) {
      const pop = this.population(ctx);
      const dir = pop.items[0];
      if (!dir) return [];
      const out = [];
      for (const ch of cs.changes) {
        if (ch.status !== 'A' || !ch.path.startsWith(`${dir}/`)) continue;
        out.push({
          severity: 'warn',
          message: `New migration ${ch.path}. (1) A definer function recreated BARE re-opens the search_path hole and stays GREEN against a baselined name. (2) A header that QUOTES a create statement is matched by any unanchored extractor — anchor with ^ and the m flag.`,
          evidence: ['tests/lint/migrationSearchPathPin.test.js', 'tests/lint/netCurrentExtractorAnchor.walker.test.js'],
        });
      }
      return out;
    },
    synthetic(ctx) {
      const dir = this.population(ctx).items[0];
      return dir ? { changes: [{ status: 'A', path: `${dir}/00000000_premortem_synthetic.sql`, oldPath: null }] } : null;
    },
  },
  {
    id: 'registry-enforcer-touched',
    classIds: [],
    derivation: 'derived',
    sources: ['scripts/hazard-registry.json'],
    what: 'the changeset edits a file the hazard registry names as an ENFORCER',
    population: (ctx) => {
      const r = ctx.json('scripts/hazard-registry.json');
      const items = [];
      for (const c of (r && r.classes) || []) for (const p of (c.enforcer && c.enforcer.paths) || []) items.push(p);
      return { label: 'registry enforcer paths', items };
    },
    run(ctx, cs) {
      const r = ctx.json('scripts/hazard-registry.json');
      const owners = new Map();
      for (const c of (r && r.classes) || []) {
        for (const p of (c.enforcer && c.enforcer.paths) || []) {
          if (!owners.has(p)) owners.set(p, []);
          owners.get(p).push(c.id);
        }
      }
      const out = [];
      for (const ch of cs.changes) {
        for (const p of touched(ch)) {
          const ids = owners.get(p);
          if (!ids) continue;
          out.push({
            severity: ch.status === 'D' || ch.status === 'R' ? 'warn' : 'note',
            classIds: ids,
            message: `${p} is the ENFORCER for ${ids.join(', ')}. ${ch.status === 'D' || ch.status === 'R' ? 'Moving or deleting it makes the registry claim a class is defended by a file that is not there — validate:hazard-registry reds.' : 'Weakening it silently downgrades that class from MACHINERY to a document.'}`,
            evidence: ids,
          });
        }
      }
      return out;
    },
    synthetic: (ctx) => {
      const r = ctx.json('scripts/hazard-registry.json');
      for (const c of (r && r.classes) || []) {
        const p = (c.enforcer && c.enforcer.paths) || [];
        if (p.length) return { changes: [{ status: 'M', path: p[0], oldPath: null }] };
      }
      return null;
    },
  },

  // ─────────────────────────────────────────────────────────── HYBRID ───────
  {
    id: 'config-slot-misuse',
    classIds: ['HZ-CONFIGSLOT'],
    derivation: 'hybrid',
    sources: ['tests/generators/pipelineSeedSlotContract.test.js'],
    what: 'a call to the seeded-generation seam whose seed is not in the options slot',
    population: (ctx) => ({
      label: 'guarded generation seam symbols',
      items: enforcerImportedSymbols(ctx, 'tests/generators/pipelineSeedSlotContract.test.js'),
    }),
    run(ctx, cs) {
      const syms = enforcerImportedSymbols(ctx, 'tests/generators/pipelineSeedSlotContract.test.js');
      if (syms.length === 0) return [];
      const out = [];
      for (const [path, line] of allAdded(cs)) {
        for (const sym of syms) {
          const call = new RegExp(`\\b${sym}\\s*\\(`).exec(line);
          if (!call) continue;
          const rest = line.slice(call.index + call[0].length);
          // The two spellings the contract test refuses, plus the bare-second-arg shape.
          const seedInConfig = /^\s*\{[^}]*\b(seed|tier|terrain|settType\s*:\s*[^,}]*seed)\b/.test(rest)
            && /\bseed\b/.test(rest.split('}')[0] || '');
          const optionsInNeighbourSlot = /\}\s*,\s*\{/.test(rest) && !/\}\s*,\s*(null|undefined|[A-Za-z_$][\w$]*)\s*,/.test(rest);
          const bareSecondArg = /\}\s*,\s*(['"`\d]|[A-Za-z_$][\w$]*\s*\))/.test(rest);
          if (!seedInConfig && !optionsInNeighbourSlot && !bareSecondArg) continue;
          out.push({
            severity: 'warn',
            message: `${path}: \`${sym}(...)\` — the seed belongs in the THIRD argument only: ${sym}(config, null, { seed }). A seed in the config slot or an options bag in the importedNeighbour slot used to be dropped silently, so the caller believed it was seeded and was not. Assert \`_seed\` arrived.`,
            evidence: [line.trim().slice(0, 160)],
          });
          break;
        }
      }
      return out;
    },
    synthetic: (ctx) => {
      const s = enforcerImportedSymbols(ctx, 'tests/generators/pipelineSeedSlotContract.test.js')[0];
      if (!s) return null;
      return {
        changes: [{ status: 'A', path: 'tests/domain/__premortemSynthetic.test.js', oldPath: null }],
        added: [['tests/domain/__premortemSynthetic.test.js', [`  const g = ${s}({ tier }, seed);`]]],
      };
    },
  },
  {
    id: 'single-writer-claim',
    classIds: ['HZ-SINGLEWRITER'],
    derivation: 'hybrid',
    sources: ['tests/lint'],
    what: 'a new "the only writer" / "single source of truth" claim in a comment',
    population: (ctx) => ({
      label: 'existing single-writer walkers',
      items: ctx.list('tests/lint').filter((p) => /SingleWriter|SingleSource/i.test(p)),
    }),
    run(ctx, cs) {
      const walkers = ctx.list('tests/lint').filter((p) => /SingleWriter|SingleSource/i.test(p));
      const out = [];
      for (const [path, line] of allAdded(cs)) {
        if (!/(the only writer|single writer|sole writer|single source of truth|SINGLE SOURCE)/i.test(line)) continue;
        out.push({
          severity: 'warn',
          message: `${path}: a single-writer claim was AUTHORED. Unenforced, it is prose that the second writer will not read. ${walkers.length} such walkers already exist — copy one.`,
          evidence: walkers.slice(0, 3).concat([line.trim().slice(0, 120)]),
        });
      }
      return out;
    },
    synthetic: () => ({
      changes: [{ status: 'M', path: 'src/__premortemSynthetic.js', oldPath: null }],
      added: [['src/__premortemSynthetic.js', ['// This module is the only writer of foo.']]],
    }),
  },

  // ───────────────────────────────────────────────────────── AUTHORED ───────
  {
    id: 'new-test-file',
    classIds: ['HZ-TESTVACUITY', 'HZ-EPISTEMIC'],
    derivation: 'authored',
    sources: [],
    what: 'any new tests/ file',
    population: null,
    run(ctx, cs) {
      const out = [];
      for (const ch of cs.changes) {
        if (ch.status !== 'A' || !TEST_FILE.test(ch.path)) continue;
        out.push({
          severity: 'warn',
          message: `NEW test file ${ch.path}. Three standing consequences: (1) the lighting census counts test files and reds on ANY addition — re-measure off a git archive of your ACTUAL PARENT, never the live tree; (2) it owes a mutation-coverage-manifest row if the enumeration rule claims it; (3) a contract/lint/security test must be proven non-vacuous — a guard that cannot be reddened cannot be proven.`,
          evidence: ['tests/lint/sovereigntyLightingContract.walker.test.js', 'tests/lint/contractTestAntiVacuity.walker.test.js'],
        });
      }
      return out;
    },
    synthetic: null,
  },
  {
    id: 'control-bytes-authored',
    classIds: ['HZ-NUL'],
    derivation: 'authored',
    sources: [],
    what: 'a raw control byte, or a NUL escape spelling, in added content',
    population: null,
    run(ctx, cs) {
      const out = [];
      for (const [path, line] of allAdded(cs)) {
        const raw = CONTROL_CHARS.find((c) => line.includes(c));
        const spelled = /\\u0000|\\x00/.test(line);
        if (!raw && !spelled) continue;
        out.push({
          severity: 'warn',
          message: `${path}: ${raw ? 'a RAW control byte' : 'a NUL escape spelling'} in an added line. This has bitten six times: the editor turns the escape into a real NUL, and grep/diff then go silently EMPTY on the file (use grep -a). Byte-scan every file you write.`,
          evidence: [CONTROL_CHARS.reduce((s, c) => s.split(c).join('?'), line).trim().slice(0, 120)],
        });
      }
      return out;
    },
    synthetic: null,
  },
  {
    id: 'piped-exit-status',
    classIds: ['HZ-PIPEEXIT'],
    derivation: 'authored',
    sources: ['scripts/gate-tail.sh'],
    what: 'a pipeline whose exit status will be read from the wrong command',
    population: null,
    run(ctx, cs) {
      const out = [];
      for (const [path, line] of allAdded(cs, (p) => /\.(sh|mjs|js|md|json)$/.test(p))) {
        if (!/\|\s*(tail|head|grep|tee|sed|awk)\b/.test(line)) continue;
        if (/gate-tail\.sh|PIPESTATUS|pipefail/.test(line)) continue;
        out.push({
          severity: 'warn',
          message: `${path}: a pipeline ends in a filter. Its exit status is the FILTER's, not the command's. This class fired four times in one day, twice by the chair who was briefing others against it. Use \`sh scripts/gate-tail.sh <cmd>\` or capture the status into a variable immediately.`,
          evidence: [line.trim().slice(0, 140)],
        });
      }
      return out;
    },
    synthetic: null,
  },
  {
    id: 'gate-mutex-self-match',
    classIds: ['HZ-GATEMUTEX'],
    derivation: 'authored',
    sources: ['scripts/gate-mutex.sh'],
    what: 'a mutex check on the same line as the word it greps for',
    population: null,
    run(ctx, cs) {
      const out = [];
      for (const [path, line] of allAdded(cs)) {
        if (!/gate-mutex/.test(line)) continue;
        if (!/vitest/.test(line)) continue;
        out.push({
          severity: 'warn',
          message: `${path}: a gate-mutex invocation on the SAME LINE as the word "vitest". The check SELF-MATCHES its own shell command line and waits on a phantom holder — up to 40 minutes burned per gate. Run it standalone and demand pid lines.`,
          evidence: [line.trim().slice(0, 140)],
        });
      }
      return out;
    },
    synthetic: null,
  },
  {
    id: 'public-payload-builder',
    classIds: ['HZ-VEIL'],
    derivation: 'authored',
    sources: ['tests/security/publicPayloadVeilTotality.test.js'],
    what: 'a new public/gallery/export payload builder',
    population: null,
    run(ctx, cs) {
      const out = [];
      for (const [path, line] of allAdded(cs, (p) => p.startsWith('src/'))) {
        if (!/^\s*export\s+(async\s+)?function\s+\w*(public|gallery|export|anon)\w*Payload|^\s*export\s+const\s+\w*(public|gallery|export|anon)\w*Payload/i.test(line)) continue;
        out.push({
          severity: 'warn',
          message: `${path}: a new public-facing payload builder. EVERY public payload must RETURN through veilPublicPayload — the seam is the return, not the caller.`,
          evidence: [line.trim().slice(0, 140)],
        });
      }
      return out;
    },
    synthetic: null,
  },
  {
    id: 'restated-derivable-figure',
    classIds: ['HZ-DERIVERESTATE'],
    derivation: 'authored',
    sources: [],
    what: 'a hand-restated count/size in a doc or comment',
    population: null,
    run(ctx, cs) {
      const out = [];
      for (const [path, line] of allAdded(cs, (p) => /\.(md|js|jsx|mjs|ts|tsx)$/.test(p))) {
        if (!/^[\s*/#>-]*.{0,120}\b(exactly|all|total(?:ling)?|census(?:ed)?|measured at)\s+\d{2,}\b/i.test(line)) continue;
        if (/derive|derived|computed|read out of|re-measured/i.test(line)) continue;
        out.push({
          severity: 'note',
          message: `${path}: a figure is STATED. If anything can derive it, derive it — a restated derivable goes stale and then greens a shrink-only walker against a number that moved. It bit in four homes on one day.`,
          evidence: [line.trim().slice(0, 140)],
        });
      }
      return out;
    },
    synthetic: null,
  },
  {
    id: 'faction-display-name-read',
    classIds: ['HZ-FACTIONKEY'],
    derivation: 'authored',
    sources: ['tests/lint/factionNamePrecedenceScan.test.js'],
    what: 'a new read of a faction display name',
    population: null,
    run(ctx, cs) {
      const out = [];
      for (const [path, line] of allAdded(cs, (p) => p.startsWith('src/'))) {
        if (!/faction\s*\.\s*name|\.faction\b|factionArchetype|governingFactionOf/.test(line)) continue;
        if (/nameOf\s*\(/.test(line)) continue;
        out.push({
          severity: 'note',
          message: `${path}: a faction key/name read that does not go through nameOf(). The faction-key defect class lives in exactly these four accessors (nameOf / governingFactionOf / factionArchetype / npcInFaction), and storing .archetype on a faction is forbidden.`,
          evidence: [line.trim().slice(0, 140)],
        });
      }
      return out;
    },
    synthetic: null,
  },
  {
    id: 'line-address-authored',
    classIds: ['HZ-LINEADDR'],
    derivation: 'authored',
    sources: ['tests/lint/pulseKernelLineAddress.walker.test.js'],
    what: 'a hand-keyed file:line address',
    population: null,
    run(ctx, cs) {
      const out = [];
      for (const [path, line] of allAdded(cs)) {
        if (!/[A-Za-z0-9_]+\.(js|jsx|mjs|ts|tsx):\d+/.test(line)) continue;
        out.push({
          severity: 'note',
          message: `${path}: a file:line address was authored. Line addresses rot on the next edit and then point at innocent code. Point at a SYMBOL, not a line.`,
          evidence: [line.trim().slice(0, 140)],
        });
      }
      return out;
    },
    synthetic: null,
  },
  {
    id: 'service-catalog-touched',
    classIds: ['HZ-SERVICECAT'],
    derivation: 'authored',
    sources: [],
    what: 'an institution-service catalog edit',
    population: null,
    run(ctx, cs) {
      const out = [];
      for (const [path, line] of allAdded(cs, (p) => p.startsWith('src/'))) {
        if (!/SERVICE_CATEGORY|institutionalCatalog|serviceKeys/.test(line)) continue;
        out.push({
          severity: 'note',
          message: `${path}: a service-catalog surface changed. A service add MOVES GOLDENS unless registered \`on:false\`, an unregistered name never reds, and p>=1 is NOT stream-neutral at criminal hosts. Run \`npm run gen:institution-service-keys\`.`,
          evidence: [line.trim().slice(0, 140)],
        });
      }
      return out;
    },
    synthetic: null,
  },
];

/**
 * The registry classes that no changeset predicate can express, with why.
 * Named rather than silently absent: an instrument's blind spots are part of it.
 */
export const NOT_CHANGESET_EXPRESSIBLE = {
  'HZ-WRONGLINEAGE': 'a session/cwd property, not a property of a diff — the cure is a hard-gate first clause in every state-mutating compound',
  'HZ-SHAREDINDEX': 'a concurrency property of the working tree at commit time — commit by plumbing with a private GIT_INDEX_FILE and an old-value CAS',
  'HZ-DIRTYBUILD': 'partly expressible (see edge-bundle-partial-rebuild); the rest is "was the tree dirty when the generator ran", which the diff cannot show',
  'HZ-DISTBOOT': 'a whole-graph property of the emitted bundle — `npm run build` exits 0 on an un-bootable dist; only `npm run smoke:boot` sees it',
  'HZ-GROUNDMOVE': 'a rendered-geometry property — a ground move breaks riders that the diff does not mention; re-census ALL riders',
  'HZ-DEADBAND': 'reachability of a band/conjunction is a property of the generated corpus, not of the source line that declares it',
  'HZ-CAMELBLIND': 'a guard\'s blindness to a camelCase field is a property of that guard\'s regex, not of the changeset that adds the field',
};

/**
 * Load the E-A enumeration rule as a live module so the manifest predicate uses
 * THE RULE ITSELF rather than a copy of it. Returns null if unreadable.
 * @param {string} root repo root
 */
export async function loadEnumerationRule(root) {
  const rel = 'tests/lint/mutationCoverage.shared.mjs';
  const abs = join(root, rel);
  if (!existsSync(abs)) return null;
  try {
    const mod = await import(pathToFileURL(abs).href);
    if (!Array.isArray(mod.ENFORCER_DIRS) || !(mod.NAME_PATTERN instanceof RegExp)) return null;
    return {
      source: rel,
      claims: (p) => mod.ENFORCER_DIRS.some((d) => p.startsWith(`${d}/`))
        || mod.NAME_PATTERN.test(p.slice(p.lastIndexOf('/') + 1)),
    };
  } catch { return null; }
}

export const _internals = { dirname, bundleInputIndex, pathAllowlists, typecheckCeilings, extractStringArray };
