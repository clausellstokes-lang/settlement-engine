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

/**
 * Never walked: vendored or generated output.
 *
 * ⛔ `build` WAS IN THIS SET AND WAS A BLIND SPOT, not a saving (FIX-C2b, measured
 * 2026-09-20). `collectFiles` matches a bare name at EVERY depth, so the entry meant
 * for a repo-root build output silently hid `tests/build/` — 59 test files — from the
 * walk AND from `buildTargetIndex`. The cost was paid twice: the 7 citations written
 * inside those files were scanned by no arm, and every citation ELSEWHERE that named
 * one of them (`vendorPdfLazy.test.js` x18, `townMapLazy.test.js` x6, …, 44 in all)
 * resolved to nothing and was SKIPPED as an unreadable target rather than checked.
 *
 * It could never have earned its keep: `collectFiles` is only ever called on the eight
 * INDEX_ROOTS, and `buildTargetIndex` reads root-level FILES only — a repo-root
 * `build/` is unreachable from either, so this entry could only ever hide a NESTED
 * directory that is source. Measured at this tip: the only directory named `build`
 * under any indexed root is `tests/build`, there is no root `build/`, and `.gitignore`
 * does not name one. Re-admitting the directory adds ZERO past-EOF findings to ARM 1
 * (measured: 0) and moves ARM 3 from 2 findings to 3.
 *
 * ⚠ THE LAW THIS LEAVES BEHIND: a skip list matched by bare name is matched at every
 * depth. Any entry added here must be a name that can NEVER be a source directory.
 */
export const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'coverage', '.vite']);

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

/** Where the implementation programme records every packet's status. */
export const PACKET_MANIFEST_REL = 'docs/implementation/PACKET_MANIFEST.json';

/**
 * THE LANDED-PACKET RULE — the archival rule for `docs/implementation/packets/`,
 * read from the manifest's own `status` field and NEVER from a hand list.
 *
 * A LANDED packet is a historical record in the same sense a `docs/review-r2/`
 * result is: it states what the tree held at the base it names, it carries the
 * sha it was implemented at, and its own header says "do not redispatch". Its
 * addresses were true at that base and re-addressing them to today's tree would
 * FALSIFY the record rather than repair it. MEASURED 2026-09-20 (FIX-C2c): 192
 * of the manifest's 194 rows are LANDED, and excluding their bodies takes ARM 3's
 * widened docs report from 443 findings to 223 — the suppressed 220 are larger
 * than the surviving population, which is the whole reason the rule must exist.
 *
 * ⚠ THE RULE IS DELIBERATELY NARROWER THAN "a packet". It excludes LANDED and
 * nothing else. A SUPERSEDED, READY or in-flight packet is LIVE, and so is a
 * packet FILE the manifest does not list at all (measured: 196 files under
 * `packets/`, 194 manifest rows — `MF-CH2B.md` and `TC-3.md` carry no row).
 * Unknown status is not frozen status; that is the same one-directional bias the
 * archival rules already carry — a live document wrongly excluded is a permanent
 * blind spot, a frozen one wrongly included costs a printed line.
 *
 * ⚠ IT IS NOT WIRED INTO `archivalReason`, and that is deliberate. ARM 2's
 * baseline is a ratchet AT ZERO over `docs.live`; moving 192 documents out of
 * that corpus would silence any past-EOF citation inside them with no record of
 * the silencing. This rule narrows ONE report-only arm and touches no gate.
 *
 * @param {string} root repo root (absolute)
 * @returns {Set<string>} repo-relative packetPaths whose status is LANDED
 */
export function landedPacketPaths(root) {
  /** @type {Set<string>} */
  const out = new Set();
  /** @type {unknown} */
  let parsed;
  try { parsed = JSON.parse(readFileSync(join(root, PACKET_MANIFEST_REL), 'utf8')); }
  catch { return out; }
  const packets = /** @type {{ packets?: unknown }} */ (parsed)?.packets;
  if (!Array.isArray(packets)) return out;
  for (const row of packets) {
    const entry = /** @type {{ status?: unknown, packetPath?: unknown }} */ (row);
    if (entry?.status === 'LANDED' && typeof entry.packetPath === 'string') out.add(entry.packetPath);
  }
  return out;
}

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
 * resolve to the same bucket.
 *
 * Extracted from `buildTargetIndex` (FIX-C2c) so the resolver and the
 * ambiguity reader share ONE walk of the eight index roots — the walk is the
 * expensive half, and a second copy of it would also be a second thing to keep
 * true.
 * @param {string} root repo root (absolute)
 * @returns {Map<string, string[]>} suffix -> every file that ends with it
 */
export function buildSuffixIndex(root) {
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
  return bySuffix;
}

/**
 * THE GATE'S RESOLVER. A token matched by 2+ files is AMBIGUOUS and resolves to
 * NOTHING — which is what keeps those citations out of ARM 1 (live code, no
 * baseline) and ARM 2 (live docs, a ratchet AT ZERO).
 *
 * ⛔ ITS NULL IS LOAD-BEARING AND MUST STAY (FIX-C2c). Teaching THIS function to
 * guess would hand both gating arms a set of addresses nobody has ever checked:
 * `docs/FIRST_CONTACT_BACKLOG.md:2830` alone cites `en.js:1549`, and a
 * newly-resolvable past-EOF citation in a live document is an instant red with no
 * baseline to absorb it. The disambiguation added by FIX-C2c therefore lives in
 * `disambiguateToken`, is consumed only by the report-only ambiguity arm, and
 * leaves this function byte-identical in behaviour.
 * @param {string} root repo root (absolute)
 * @returns {(token: string) => string | null}
 */
export function buildTargetIndex(root) {
  const bySuffix = buildSuffixIndex(root);
  return (token) => {
    const found = bySuffix.get(token);
    return found && found.length === 1 ? found[0] : null;
  };
}

/**
 * Every file a token could name — the whole bucket, where `buildTargetIndex`
 * collapses a 2+ bucket to null. `[]` for a token this tree does not hold.
 * @param {string} root repo root (absolute)
 * @returns {(token: string) => string[]}
 */
export function buildCandidateIndex(root) {
  const bySuffix = buildSuffixIndex(root);
  return (token) => bySuffix.get(token) ?? [];
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

// ── THE BARE `:NNN` ARM (report-only) ────────────────────────────────────────

/**
 * A bare line address — `:83`, `:383-394`, `:211,229` — with no path in front of
 * it, inheriting its file from a `<path>:<line>` citation earlier in the SAME
 * SENTENCE — as in `peaceTerms.js:213, :269` (both true here, deliberately: this
 * arm reads its own header, so an illustrative address must be a real one). The
 * CITATION regex
 * cannot see these at all: it requires a path token, so every arm is blind to
 * them. MEASURED 2026-09-20 (FIX-C2b): 661 of them live in the estate, 59 in
 * live code and 602 in live docs — four times the population of ARM 1's whole
 * reach — and 6 address a line past the end of the file their sentence names.
 */
export const BARE_ADDRESS = /(?<![\w/.\-:])[:](\d+(?:-\d+)?(?:\s*,\s*\d+(?:-\d+)?)*)(?![\d\-,])/g;

/**
 * Sentence-ish spans of one line, each with its start offset. The scope is a
 * SENTENCE and not a paragraph on purpose: widening ARM 3's window to a
 * paragraph took its finding count from 38 to 8,120. A span ends at `.`/`!`/`?`
 * followed by a space (never after a digit, so `:1-17.` and `v1.2` survive) or
 * at a table-cell pipe.
 * @param {string} text
 * @returns {{ start: number, text: string }[]}
 */
export function sentenceSpans(text) {
  /** @type {{ start: number, text: string }[]} */
  const out = [];
  let start = 0;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    const ends = (ch === '.' || ch === '!' || ch === '?')
      && (next === ' ' || next === undefined) && !/\d/.test(text[i - 1] ?? '');
    if (ends || ch === '|') {
      out.push({ start, text: text.slice(start, i + 1) });
      start = i + 1;
    }
  }
  if (start < text.length) out.push({ start, text: text.slice(start) });
  return out;
}

/**
 * THE BARE-ADDRESS ARM — REPORT-ONLY, and the reason is measured rather than
 * cautious. A bare `:NNN` inherits the NEAREST PRECEDING path citation in its
 * sentence — never the sentence's last, which mis-attributed `peaceTerms.js:230,
 * :863` to a `peaceTermsSale.js` named later and convicted a true citation.
 *
 * ⛔ AND THE ATTRIBUTION IS STILL NOT SOUND, WHICH IS WHY IT MUST NEVER GATE. A
 * bare number can inherit a path that the sentence names WITHOUT a line number,
 * which is invisible to this reader. MEASURED: MF-UC1.md:178 cites
 * `resolveTerrain.js:57`, then lists seven `TERRAIN_DATA` classes as `:51`,
 * `:128` … `:623` — those inherit `src/data/geographyData.js`, named two clauses
 * later as a bare grep argument. Six of the twelve past-EOF findings are that one
 * sentence. Restricting to sentences with a single path citation does NOT fix it
 * (measured: the same six survive), so there is no precision knob that makes this
 * arm gateable. It prints leads for a reader, exactly as ARM 3 does.
 *
 * @param {object} args
 * @param {string[]} args.files
 * @param {(token: string) => string | null} args.resolve
 * @param {(rel: string) => string[] | null} args.read
 * @param {{ seen: number }} [args.stats] filled in place with the whole population
 * @returns {{ from: string, line: number, bare: string, inherits: string, target: string, targetLines: number }[]}
 */
export function bareFindings({ files, resolve, read, stats }) {
  /** @type {{ from: string, line: number, bare: string, inherits: string, target: string, targetLines: number }[]} */
  const rows = [];
  for (const from of files) {
    if (from === BASELINE_REL) continue;
    const lines = read(from);
    if (!lines) continue;
    for (let i = 0; i < lines.length; i += 1) {
      const text = lines[i];
      if (!text.includes(':') || !MAY_CITE.test(text)) continue;
      for (const span of sentenceSpans(text)) {
        const anchors = citationsIn(span.text);
        if (anchors.length === 0) continue;
        BARE_ADDRESS.lastIndex = 0;
        let m = BARE_ADDRESS.exec(span.text);
        while (m !== null) {
          const isAnchorsOwn = anchors.some((a) => a.column + a.token.length === m.index);
          const before = anchors.filter((a) => a.column < m.index);
          if (!isAnchorsOwn && before.length > 0) {
            if (stats) stats.seen += 1;
            const anchor = before[before.length - 1];
            const target = resolve(anchor.token);
            const targetLines = target ? read(target)?.length : null;
            const start = Number((m[1].match(/\d+/) ?? ['0'])[0]);
            if (target && targetLines && start > targetLines) {
              rows.push({ from, line: i + 1, bare: `:${m[1]}`, inherits: anchor.token, target, targetLines });
            }
          }
          m = BARE_ADDRESS.exec(span.text);
        }
      }
    }
  }
  return rows;
}

// ── THE AMBIGUOUS-BASENAME ARM (report-only) ─────────────────────────────────

/**
 * An import specifier in the citing file, in any of the three spellings the
 * estate writes. The captured group is the specifier.
 */
const IMPORT_SPEC = /(?:from|import|require)\s*\(?\s*['"]([^'"\n]+)['"]/g;

/** Per-process memo of a code file's resolved import specifiers. */
const IMPORT_SPECS_BY_FILE = new Map();

/**
 * Resolve a specifier that may be relative to the citing file's directory into a
 * repo-relative forward-slash path. Absolute-ish and bare specifiers come back
 * unchanged, which is right: a suffix match handles them.
 * @param {string} spec
 * @param {string} fromRel repo-relative path of the citing file
 * @returns {string}
 */
function resolveSpec(spec, fromRel) {
  if (!spec.startsWith('.')) return spec.replace(/^\/+/, '');
  const base = fromRel.split('/').slice(0, -1);
  for (const seg of spec.split('/')) {
    if (seg === '.' || seg === '') continue;
    if (seg === '..') base.pop();
    else base.push(seg);
  }
  return base.join('/');
}

/**
 * THE DISAMBIGUATION READER. One objective filter, then three kinds of evidence,
 * each of which must narrow the bucket to EXACTLY ONE candidate or hand on:
 *
 *   extent     FIRST, and the only OBJECTIVE step: a candidate with fewer lines
 *              than the address cites cannot be the file the sentence means —
 *              ARM 1's own test, used to narrow rather than to convict. It
 *              carries every other rule: `institutionServices.js:1567` has two
 *              candidates and only one of them is long enough to hold line 1567.
 *              When it eliminates ALL candidates the bucket is left whole, so a
 *              citation that is merely stale cannot be silently re-homed.
 *   directory  a discriminating directory segment of exactly one candidate is
 *              written in the citation's own SENTENCE (`peaceTerms.js` beside
 *              the words `worldPulse/`). The segments compared are only those
 *              the candidates do NOT share — a segment every candidate carries
 *              discriminates nothing.
 *   import     the CITING FILE imports exactly one of the candidates. Only ever
 *              fires for a code citation, and it is the strongest evidence there
 *              is: the file's own module graph.
 *   symbol     exactly one candidate DECLARES a backticked, symbol-shaped name
 *              from the citing line — `declarationLines`, the same reader ARM 3
 *              uses, so the two arms cannot disagree about what a declaration is.
 *
 * ⛔ IT IS A READER, NOT A RESOLVER, and nothing it returns may reach a gate. It
 * answers "which file did this sentence mean", which is a question about PROSE;
 * `buildTargetIndex` answers "which file can I read with certainty", which is the
 * question a gate is allowed to ask. Keeping them apart is why widening the first
 * cannot red the second.
 *
 * @param {object} args
 * @param {string} args.token the cited token, e.g. `index.ts`
 * @param {string[]} args.candidates every file the token could name (2+)
 * @param {string} args.sentence the citation's own sentence span
 * @param {string} args.citingFile repo-relative path of the citing file
 * @param {(rel: string) => string[] | null} args.read
 * @param {number} [args.cites] the highest line the citation addresses
 * @returns {{ path: string, by: 'extent' | 'directory' | 'import' | 'symbol' } | null}
 */
export function disambiguateToken({ token, candidates, sentence, citingFile, read, cites }) {
  let pool = candidates;
  if (Number.isFinite(cites)) {
    const longEnough = pool.filter((c) => (read(c)?.length ?? 0) >= /** @type {number} */ (cites));
    if (longEnough.length === 1) return { path: longEnough[0], by: 'extent' };
    if (longEnough.length > 1) pool = longEnough;
  }
  const dirsOf = (p) => p.split('/').slice(0, -1);
  const shared = new Set(dirsOf(pool[0]));
  for (const c of pool.slice(1)) {
    const mine = new Set(dirsOf(c));
    for (const seg of [...shared]) if (!mine.has(seg)) shared.delete(seg);
  }
  const byDir = pool.filter((c) => dirsOf(c).some((seg) => !shared.has(seg) && sentence.includes(`${seg}/`)));
  if (byDir.length === 1) return { path: byDir[0], by: 'directory' };

  // ⛔ CODE FILES ONLY, AND THE JOIN HAPPENS ONCE. A prose document has no module
  // graph to consult, and joining one to look for an `import` is how this reader
  // OOM-killed a `tests/lint` run: the first draft re-evaluated `citing.join('\n')`
  // inside the match loop, allocating a fresh copy of a million-byte document per
  // match, once per ambiguous citation in it. The memo then keeps a file that DOES
  // have a module graph from being re-scanned for each of its citations.
  if (/\.(js|jsx|mjs|cjs|ts|tsx)$/.test(citingFile)) {
    let specs = IMPORT_SPECS_BY_FILE.get(citingFile);
    if (!specs) {
      specs = new Set();
      const citing = read(citingFile);
      if (citing) {
        const source = citing.join('\n');
        IMPORT_SPEC.lastIndex = 0;
        let m = IMPORT_SPEC.exec(source);
        while (m !== null) { specs.add(resolveSpec(m[1], citingFile)); m = IMPORT_SPEC.exec(source); }
      }
      IMPORT_SPECS_BY_FILE.set(citingFile, specs);
    }
    const byImport = pool.filter((c) => {
      const stem = c.replace(/\.[^./]+$/, '');
      return specs.has(c) || specs.has(stem);
    });
    if (byImport.length === 1) return { path: byImport[0], by: 'import' };
  }

  const stem = basename(token).split('.')[0];
  /** @type {Set<string>} */
  const named = new Set();
  BACKTICKED.lastIndex = 0;
  let span = BACKTICKED.exec(sentence);
  while (span !== null) {
    IDENTIFIER.lastIndex = 0;
    let id = IDENTIFIER.exec(span[1]);
    while (id !== null) {
      if (SYMBOL_SHAPED.test(id[0]) && id[0] !== stem) named.add(id[0]);
      id = IDENTIFIER.exec(span[1]);
    }
    span = BACKTICKED.exec(sentence);
  }
  if (named.size > 0) {
    const bySymbol = pool.filter((c) => {
      const lines = read(c);
      return lines ? [...named].some((n) => declarationLines(lines, n).length > 0) : false;
    });
    if (bySymbol.length === 1) return { path: bySymbol[0], by: 'symbol' };
  }
  return null;
}

/**
 * THE AMBIGUOUS-BASENAME ARM — REPORT-ONLY.
 *
 * A citation whose token matches 2+ files was, until FIX-C2c, dropped by every
 * arm WITHOUT A WORD: `buildTargetIndex` returned null and `eofFindings`,
 * `symbolFindings` and `bareFindings` all `continue` on a null target. MEASURED
 * 2026-09-20 at `578272a99`: 166 citations across 12 distinct basenames, the
 * largest of them `en.js` (67), `index.js` (21, thirteen candidates) and
 * `index.ts` (13, thirty-two supabase function entrypoints).
 *
 * It resolves what the prose actually says (see `disambiguateToken`) and NAMES
 * the rest with their candidates, so the blind spot is a counted set instead of
 * a silence. It never gates, for the same measured reason ARMS 3 and 4 never
 * gate: the resolution is evidence about English, not about a file.
 *
 * @param {object} args
 * @param {string[]} args.files
 * @param {(token: string) => string[]} args.candidatesFor
 * @param {(rel: string) => string[] | null} args.read
 * @param {{ seen: number, resolved: number }} [args.stats] filled in place
 * @returns {{ from: string, line: number, cite: string, token: string,
 *   candidates: string[], resolved: string | null, by: string | null }[]}
 */
export function ambiguousFindings({ files, candidatesFor, read, stats }) {
  /** @type {{ from: string, line: number, cite: string, token: string, candidates: string[], resolved: string | null, by: string | null }[]} */
  const rows = [];
  for (const from of files) {
    if (from === BASELINE_REL) continue;
    const lines = read(from);
    if (!lines) continue;
    for (let i = 0; i < lines.length; i += 1) {
      const text = lines[i];
      if (!MAY_CITE.test(text)) continue;
      // ⛔ THE CHEAP TEST FIRST, AND IT IS NOT A MICRO-OPTIMISATION. Splitting a line
      // into sentence spans allocates a substring per stop, and 91,823 lines in this
      // estate carry a code extension while only 9,477 hold a citation and ~169 hold
      // an AMBIGUOUS one — 11.5 MB of slicing for a set that fits on a page. Together
      // with the import-join defect above, that garbage OOM-killed a `tests/lint` run
      // (2026-09-20, no count line printed). Resolve the token first; span the line
      // only when one of its citations is actually ambiguous.
      const onLine = citationsIn(text);
      if (onLine.length === 0) continue;
      if (!onLine.some((c) => candidatesFor(c.token).length >= 2)) continue;
      for (const span of sentenceSpans(text)) {
        for (const c of citationsIn(span.text)) {
          const candidates = candidatesFor(c.token);
          if (candidates.length < 2) continue;
          if (stats) stats.seen += 1;
          const hit = disambiguateToken({
            token: c.token,
            candidates,
            sentence: span.text,
            citingFile: from,
            read,
            cites: Math.max(...c.cited),
          });
          if (hit && stats) stats.resolved += 1;
          rows.push({
            from,
            line: i + 1,
            cite: `${c.token}:${c.spec}`,
            token: c.token,
            candidates,
            resolved: hit ? hit.path : null,
            by: hit ? hit.by : null,
          });
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
