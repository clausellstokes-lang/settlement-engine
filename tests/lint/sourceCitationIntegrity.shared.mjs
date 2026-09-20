/**
 * sourceCitationIntegrity.shared.mjs — the `<path>:<line>` citation engine,
 * shared between tests/lint/sourceCitationIntegrity.walker.test.js (the gate)
 * and any tooling that re-measures the estate.
 *
 * Kept out of the test file so the measurement behind a baseline refresh runs
 * the SHIPPED detector rather than a second copy of it — the drift that let the
 * tuning inventory's own hand-written addresses rot (FIX-C2 §0).
 *
 * Pure: reads the filesystem, nothing else. No git, no network, no ambient
 * state. It reads FROM DISK deliberately — `git grep` without a rev reads the
 * INDEX, and a planted file (the mutation sweep's probe) is untracked, so an
 * index-based walk would be blind to the very mutant that proves this gate.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, relative } from 'node:path';

/** Trees whose citations are GATE-WIRED with no baseline: live code. */
export const CODE_TREES = ['src', 'tests', 'scripts'];

/** Extensions a citation can be written in (prose and code alike). */
export const TEXT_EXT = /\.(js|jsx|mjs|cjs|ts|tsx|md|json|sh|yml|yaml|css|html|txt)$/;

/** Never walked: vendored, generated or build output. */
export const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'coverage', '.vite', 'build']);

/**
 * Trees searched for citation TARGETS. A token that resolves to no file here —
 * a vendored `jspdf.es.js`, a synthetic `fixture.ts` inside a test assertion —
 * is skipped rather than convicted: this gate only ever judges an address it
 * can read.
 */
export const INDEX_ROOTS = ['src', 'tests', 'scripts', 'docs', 'api', 'supabase', 'public', 'e2e'];

/**
 * A `<path>:<line>` citation. Handles the three spellings the estate uses:
 * `file.js:123`, `file.js:1-17` (range) and `file.js:211,229,244` (list), in
 * bare-basename or full-path form. A naive split(':') sees none of the last two.
 */
export const CITATION = /(?<![\w/.\-])((?:[\w.\-]+\/)*[\w.\-]+\.(?:js|jsx|mjs|cjs|ts|tsx)):(\d+(?:-\d+)?(?:\s*,\s*\d+(?:-\d+)?)*)/g;

/** Directory trees that are frozen records by construction. */
export const ARCHIVAL_TREES = ['docs/review-r2/', 'docs/shift-records/'];

/** A filename carrying an ISO date is a snapshot of that date. */
export const DATED_BASENAME = /\d{4}-\d{2}-\d{2}/;

/**
 * The estate's OWN archival marker: a blockquote status banner naming
 * HISTORICAL in the opening lines (docs/README.md §"HISTORICAL — point-in-time
 * audit / plan / status exhaust (not maintained)"). The blockquote is required
 * because docs/README.md discusses the word in body prose while being the most
 * live document in the tree.
 */
export const HISTORICAL_BANNER = /^\s*>.*HISTORICAL/;

/** A header that pins the tree this document describes. */
export const SNAPSHOT_PIN = /^\s*(?:[*#>\s]*)\*\*(?:Snapshot base|Frozen at|Pinned at|Snapshot)\b/i;

/** How many opening lines the banner and pin rules read. */
export const BANNER_LINES = 10;
export const PIN_LINES = 30;

/**
 * The one file excluded from the walk by name. It is a REGISTER OF STALE
 * ADDRESSES — every row in it is a citation this gate has convicted — so
 * scanning it would convict the gate of its own findings.
 */
export const BASELINE_REL = 'tests/lint/.source-citation-baseline.json';

/**
 * Walk a tree from disk, skipping vendored and generated directories.
 * @param {string} root repo root (absolute)
 * @param {string} tree repo-relative subtree
 * @returns {string[]} repo-relative forward-slash paths
 */
export function collectFiles(root, tree) {
  /** @type {string[]} */
  const out = [];
  const visit = (dir) => {
    /** @type {string[]} */
    let entries;
    try { entries = readdirSync(dir); } catch { return; }
    for (const entry of entries) {
      if (SKIP_DIRS.has(entry)) continue;
      const p = join(dir, entry);
      /** @type {import('node:fs').Stats} */
      let st;
      try { st = statSync(p); } catch { continue; }
      if (st.isDirectory()) visit(p);
      else out.push(relative(root, p).replace(/\\/g, '/'));
    }
  };
  visit(join(root, tree));
  return out.filter((p) => TEXT_EXT.test(p));
}

/**
 * A line reader with a per-run cache. `null` for anything unreadable.
 * @param {string} root repo root (absolute)
 */
export function createReader(root) {
  /** @type {Map<string, string[] | null>} */
  const cache = new Map();
  return (rel) => {
    if (!cache.has(rel)) {
      try { cache.set(rel, readFileSync(join(root, rel), 'utf8').split('\n')); }
      catch { cache.set(rel, null); }
    }
    return cache.get(rel) ?? null;
  };
}

/**
 * Index every trailing path-segment run of every indexable file, so
 * `warDeployment.js`, `worldPulse/warDeployment.js` and the full path all
 * resolve. A token matched by 2+ files is AMBIGUOUS and resolves to nothing.
 * @param {string} root repo root (absolute)
 * @returns {(token: string) => string | null}
 */
export function buildTargetIndex(root) {
  /** @type {string[]} */
  const paths = [];
  for (const tree of INDEX_ROOTS) paths.push(...collectFiles(root, tree));
  for (const entry of readdirSync(root)) {
    try { if (statSync(join(root, entry)).isFile() && TEXT_EXT.test(entry)) paths.push(entry); }
    catch { /* unreadable root entry */ }
  }
  /** @type {Map<string, string[]>} */
  const bySuffix = new Map();
  for (const p of paths) {
    const segs = p.split('/');
    for (let i = 0; i < segs.length; i += 1) {
      const key = segs.slice(i).join('/');
      const bucket = bySuffix.get(key);
      if (bucket) bucket.push(p);
      else bySuffix.set(key, [p]);
    }
  }
  return (token) => {
    const found = bySuffix.get(token);
    return found && found.length === 1 ? found[0] : null;
  };
}

/** A range spec may not be expanded past this many lines (a typo is not a corpus). */
export const MAX_RANGE = 2000;

/**
 * The lines a spec ADDRESSES. `:123` is one line; `:1-17` is seventeen; a list
 * is the union. Expanding the range matters: `tuningRegister.walker.test.js:75-91`
 * names a constant declared at :84, and an endpoints-only reader calls that
 * true citation stale.
 * @param {string} spec the text after the colon
 * @returns {Set<number>}
 */
export function citedLines(spec) {
  /** @type {Set<number>} */
  const lines = new Set();
  for (const part of spec.split(',')) {
    const bounds = part.trim().split('-').map(Number);
    const lo = bounds[0];
    const hi = bounds.length > 1 ? bounds[bounds.length - 1] : lo;
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || hi < lo || hi - lo > MAX_RANGE) {
      if (Number.isFinite(lo)) lines.add(lo);
      continue;
    }
    for (let n = lo; n <= hi; n += 1) lines.add(n);
  }
  return lines;
}

/**
 * Every citation on one line of text.
 * @param {string} text
 * @returns {{ token: string, spec: string, numbers: number[], cited: Set<number>, start: number, column: number }[]}
 */
export function citationsIn(text) {
  /** @type {{ token: string, spec: string, numbers: number[], cited: Set<number>, start: number, column: number }[]} */
  const out = [];
  CITATION.lastIndex = 0;
  let m = CITATION.exec(text);
  while (m !== null) {
    const spec = m[2];
    const numbers = (spec.match(/\d+/g) ?? []).map(Number);
    out.push({ token: m[1], spec, numbers, cited: citedLines(spec), start: numbers[0], column: m.index });
    m = CITATION.exec(text);
  }
  return out;
}

/** Cheap pre-filter: a line with no code extension on it holds no citation. */
const MAY_CITE = /\.(js|jsx|mjs|cjs|ts|tsx)/;

/**
 * Is this docs path a frozen record of its day?
 * @param {string} rel repo-relative path
 * @param {(rel: string) => string[] | null} read
 * @returns {string | null} the rule that fired, or null for a LIVE document
 */
export function archivalReason(rel, read) {
  if (ARCHIVAL_TREES.some((tree) => rel.startsWith(tree))) return 'tree';
  if (DATED_BASENAME.test(basename(rel))) return 'dated';
  const lines = read(rel);
  if (!lines) return null;
  if (lines.slice(0, BANNER_LINES).some((line) => HISTORICAL_BANNER.test(line))) return 'banner';
  if (lines.slice(0, PIN_LINES).some((line) => SNAPSHOT_PIN.test(line))) return 'sha-pin';
  return null;
}

/**
 * THE EOF ARM. Every citation whose line number is past the end of the file it
 * addresses. Objective: no symbol, no heuristic, no judgment — the address
 * cannot be right, whatever it meant to name.
 *
 * @param {object} args
 * @param {string[]} args.files repo-relative citing files
 * @param {(token: string) => string | null} args.resolve
 * @param {(rel: string) => string[] | null} args.read
 * @param {{ seen: number, resolvable: number }} [args.stats] filled in place, so a
 *   caller can prove the walk was not vacuous without a second pass over the tree
 * @returns {{ from: string, line: number, cite: string, start: number, target: string, targetLines: number }[]}
 */
export function eofFindings({ files, resolve, read, stats }) {
  /** @type {{ from: string, line: number, cite: string, start: number, target: string, targetLines: number }[]} */
  const rows = [];
  for (const from of files) {
    if (from === BASELINE_REL) continue;
    const lines = read(from);
    if (!lines) continue;
    for (let i = 0; i < lines.length; i += 1) {
      const text = lines[i];
      if (!MAY_CITE.test(text)) continue;
      for (const c of citationsIn(text)) {
        const target = resolve(c.token);
        if (stats) {
          stats.seen += 1;
          if (target) stats.resolvable += 1;
        }
        if (!target) continue;
        const targetLines = read(target)?.length;
        if (!targetLines) continue;
        if (c.start > targetLines) {
          rows.push({ from, line: i + 1, cite: `${c.token}:${c.spec}`, start: c.start, target, targetLines });
        }
      }
    }
  }
  return rows;
}

// ── THE SYMBOL ARM (report-only) ─────────────────────────────────────────────

const BACKTICKED = /`([^`\n]{1,200})`/g;
const IDENTIFIER = /[A-Za-z_$][A-Za-z0-9_$]*/g;
/**
 * camelCase, SCREAMING_SNAKE or PascalCase. The first two are the conservative
 * shape that measured 17/17 by hand; PascalCase joined them because the estate's
 * React components ARE symbols and the sharpest propagation in the census is a
 * PascalCase one (`Collapsible`, cited off by six from ten files). A wrong
 * attribution costs a printed line here, never a red — and the declaration test
 * below is the real filter: an English word in backticks is never declared.
 */
const SYMBOL_SHAPED = /^(?:[a-z][a-z0-9]*(?:[A-Z][A-Za-z0-9]*)+|[A-Z][A-Z0-9]*_[A-Z0-9_]+|[A-Z][a-z0-9]+(?:[A-Z][A-Za-z0-9]*)*)$/;
/** How far from the citation a backticked span may sit and still be "adjacent". */
export const ADJACENCY = 48;

/**
 * Lines in `lines` that DECLARE `symbol` (function / const / let / var / class,
 * or an object-literal key, or a method).
 * @param {string[]} lines
 * @param {string} symbol
 * @returns {number[]} 1-based
 */
export function declarationLines(lines, symbol) {
  const e = symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(
    `\\b(?:async\\s+)?function\\s*\\*?\\s*${e}\\b`
    + `|\\b(?:const|let|var|class)\\s+${e}\\b`
    + `|^\\s*${e}\\s*[:(]`,
  );
  /** @type {number[]} */
  const out = [];
  for (let i = 0; i < lines.length; i += 1) if (re.test(lines[i])) out.push(i + 1);
  return out;
}

/**
 * The last line of the construct that starts at `decl`, by bracket balance.
 * Bounded so a file of unbalanced prose cannot run away.
 * @param {string[]} lines
 * @param {number} decl 1-based
 * @returns {number} 1-based
 */
export function blockEnd(lines, decl) {
  let depth = 0;
  let started = false;
  for (let i = decl - 1; i < Math.min(lines.length, decl + 600); i += 1) {
    for (const ch of lines[i]) {
      if (ch === '{' || ch === '[' || ch === '(') { depth += 1; started = true; }
      else if (ch === '}' || ch === ']' || ch === ')') depth -= 1;
    }
    if (started && depth <= 0) return i + 1;
    if (!started && i > decl + 1) return decl;
  }
  return Math.min(lines.length, decl + 600);
}

/**
 * THE SYMBOL ARM — REPORT-ONLY. A citation whose adjacent, backticked, declared
 * symbol is not on the cited line.
 *
 * ⚠ ITS CEILING IS STRUCTURAL, and it is why this arm never gates. A citation is
 * checkable only when a symbol is named ON THE SAME LINE as the number, and the
 * estate routinely wraps the sentence between them. Widening the window to a
 * paragraph pushed the measured finding count from 38 to 8,120 on common nouns
 * ("tabs", "source", "settlement") read as symbols. Precision and coverage
 * trade directly here; this arm keeps the precision and reports what it sees.
 *
 * @param {object} args
 * @param {string[]} args.files
 * @param {(token: string) => string | null} args.resolve
 * @param {(rel: string) => string[] | null} args.read
 * @returns {{ from: string, line: number, cite: string, symbol: string, target: string, declaredAt: number[] }[]}
 */
export function symbolFindings({ files, resolve, read }) {
  /** @type {{ from: string, line: number, cite: string, symbol: string, target: string, declaredAt: number[] }[]} */
  const rows = [];
  for (const from of files) {
    if (from === BASELINE_REL) continue;
    const lines = read(from);
    if (!lines) continue;
    for (let i = 0; i < lines.length; i += 1) {
      const text = lines[i];
      if (!MAY_CITE.test(text) || !text.includes('`')) continue;
      for (const c of citationsIn(text)) {
        const target = resolve(c.token);
        if (!target) continue;
        const targetLines = read(target);
        if (!targetLines || c.start > targetLines.length) continue;
        const stem = basename(c.token).split('.')[0];
        /** @type {{ distance: number, symbol: string }[]} */
        const adjacent = [];
        BACKTICKED.lastIndex = 0;
        let span = BACKTICKED.exec(text);
        while (span !== null) {
          const encloses = span.index <= c.column && c.column + c.token.length <= span.index + span[0].length;
          const distance = encloses ? 0
            : span.index + span[0].length <= c.column ? c.column - (span.index + span[0].length)
              : span.index >= c.column ? span.index - c.column : 0;
          if (distance <= ADJACENCY) {
            IDENTIFIER.lastIndex = 0;
            let id = IDENTIFIER.exec(span[1]);
            while (id !== null) {
              if (SYMBOL_SHAPED.test(id[0]) && id[0] !== stem) adjacent.push({ distance, symbol: id[0] });
              id = IDENTIFIER.exec(span[1]);
            }
          }
          span = BACKTICKED.exec(text);
        }
        adjacent.sort((a, b) => a.distance - b.distance);
        for (const { symbol } of adjacent.slice(0, 3)) {
          const declaredAt = declarationLines(targetLines, symbol);
          if (declaredAt.length === 0) continue;
          const uses = [];
          const use = new RegExp(`(?<![\\w$])${symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w$])`);
          for (let k = 0; k < targetLines.length; k += 1) if (use.test(targetLines[k])) uses.push(k + 1);
          if (declaredAt.some((d) => c.cited.has(d)) || uses.some((u) => c.cited.has(u))) break;
          // Pointing INSIDE the named symbol's own block is benign: the citation
          // names the construct's body, not a rotted address.
          const inBlock = declaredAt.some((d) => d <= c.start && c.start <= blockEnd(targetLines, d));
          if (!inBlock) rows.push({ from, line: i + 1, cite: `${c.token}:${c.spec}`, symbol, target, declaredAt });
          break;
        }
      }
    }
  }
  return rows;
}

/**
 * Split the docs tree into the live corpus (baselined) and the frozen records
 * (excluded). Returned together so the walker can print both counts: an
 * exclusion nobody counts is an exclusion nobody audits.
 * @param {string} root repo root (absolute)
 * @param {(rel: string) => string[] | null} read
 */
export function partitionDocs(root, read) {
  const all = collectFiles(root, 'docs');
  /** @type {string[]} */
  const live = [];
  /** @type {{ path: string, reason: string }[]} */
  const archival = [];
  for (const p of all) {
    const reason = archivalReason(p, read);
    if (reason) archival.push({ path: p, reason });
    else live.push(p);
  }
  return { all, live, archival };
}

/** The baseline's row identity: the citing file and the address it writes. */
export function rowKey(row) {
  return `${row.from} :: ${row.cite}`;
}
