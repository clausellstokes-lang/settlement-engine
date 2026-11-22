/**
 * writer-reach-scan.mjs — THE WRITER-WITH-NO-READER SCANNER (HORIZON §7, §1.10).
 *
 * ── THE CLASS ────────────────────────────────────────────────────────────────
 * OSR (`check-observed-shape-readers.mjs`) asks the READER question: does this
 * read find a key some writer produces? WRWALKER is its dual and asks the WRITER
 * question: is this GENERATED FACT ever shown to a customer? A key the engine
 * writes on every world and no customer surface reads is work the player paid for
 * and never sees. "Generated and silently unshown" is the defect; this module is
 * the detector.
 *
 * The two instruments share ONE corpus builder and ONE identity grammar (§1.3):
 * `buildObservedCorpus()` is borrowed WHOLE and never edited (editing any of the
 * eleven `scannerToolFiles()` would be an OSR schema migration), and
 * `writerIdentity(k, s)` is pinned EQUAL to OSR's `identityOf` by an executed
 * test. They are one builder and TWO executions, so the walker also freezes
 * `shapesDigest` — counts-equal is not shapes-equal.
 *
 * ── ⭐ THE SPLIT SURFACE VOCABULARY (⟦G0-2⟧ ⟦CHAIR §882.3⟧) ──────────────────
 * The design's single `web` class was MEASURED by Car 0 at 1,562 of 2,143 src
 * files, with 380 of 437 `src/domain/worldPulse` files inside it (86.96 %). A
 * class that wide answers "is this key's NAME mentioned in three quarters of the
 * codebase", not "does a customer surface show this fact". So `web` SPLITS:
 *
 *   web-display    = closure(web) INTERSECT WEB_DISPLAY_DIRS   — THE COUNTING CLASS
 *   web-transitive = closure(web) MINUS web-display            — REPORTED ONLY
 *
 * No `src/domain/worldPulse` file is under a display dir by construction, so the
 * kernel leak-through became a REPORTED figure rather than a STOP. Under the
 * split the tally at C' is 547 LIT / 4,647 LIT-NAME / 1,326 DARK (20.34 %),
 * against 608 / 5,033 / 879 with `web` whole.
 *
 * ── THE GRADES, AND WHY `N` COUNTS ──────────────────────────────────────────
 *   R — the OSR resolver GROUNDS the receiver to this shape. The strong claim.
 *   N — a name-level read of `.key` on an unresolvable receiver, credited to
 *       EVERY known shape carrying that key. Deliberately over-permissive: the
 *       conservative direction for a DARKNESS claim.
 *   A — the export allowlist arm (`json-export`), which does NOT count.
 *
 * `N` is not a convenience. OSR's resolver reaches 7.67 % of reads, and grading
 * on `R` alone makes 91.61 % of the population DARK under the split — thirty
 * points past the instrument's own 60 % STOP. `N` counts PERMANENTLY until the
 * resolver's reach is raised (WRW-4; the retraction is recorded in §7.7 R3).
 *
 * ── WHAT THIS MODULE MAY NEVER DO ───────────────────────────────────────────
 * Zero `src/` bytes; the producers are called READ-ONLY; nothing here regenerates
 * a world. `BUILTIN_MEMBERS` below is a byte-exact TWIN of OSR's module-private
 * set, pinned by a test that extracts OSR's literal from its source TEXT (a text
 * read of a governed file is not an edit). The twin matters: Car 0's probe used a
 * hand-written 75-name set that ADDED `name`, `from` and `test` — all WRITTEN
 * keys — which suppressed every `.name` property read in 1,563 files and moved
 * the tally by twelve identities. A twin that drifts is a silent miscount.
 *
 * @see docs/DESIGN_HORIZON.md §7, §1.3, §1.10  (the charter; on the ledger line)
 * @see scripts/check-writer-reach.mjs           (the CLI and the frozen register)
 * @see tests/lint/writerReach.walker.test.js    (the gate authority)
 */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve as resolvePath } from 'node:path';
import ts from 'typescript';

import { buildIndex, makeResolver } from './legacy-reader-shape-scan.mjs';
import { MIN_ROWS } from './observed-shape-baseline.mjs';

// ── §1.10 THE CLOSED VOCABULARY ─────────────────────────────────────────────

/** THE closed vocabulary of customer surfaces. Finite semantics: never widened ad hoc. */
export const SURFACE_CLASSES = Object.freeze([
  'web-display', 'web-transitive', 'dossier-pdf', 'campaign-pdf',
  'world-book', 'foundry', 'json-export', 'news',
]);

/** Classes whose reach makes an identity LIT. */
export const COUNTING_CLASSES = Object.freeze([
  'web-display', 'dossier-pdf', 'campaign-pdf', 'world-book', 'foundry', 'news',
]);

/**
 * Classes COMPUTED and REPORTED but never counted toward LIT.
 * `web-transitive` — reachable only through files the web root drags in, never
 * through a component, a display read model or the PDF (⟦G0-2⟧).
 * `json-export` — the export CONTROL is not wired (`worldExport.js`, "a
 * deliberate deferred follow-on"), and a key only an unwired exporter would emit
 * is still unshown (WRW-1).
 */
export const REPORT_ONLY_CLASSES = Object.freeze(['web-transitive', 'json-export']);

/** The dirs that make a web-closure file a DISPLAY file — the counting half. */
export const WEB_DISPLAY_DIRS = Object.freeze(['src/components/', 'src/domain/display/', 'src/pdf/']);

/** Roots per class. `web` is two-phase (see `surfaceClosures`); `news` is a TAG. */
export const SURFACE_ROOTS = Object.freeze({
  web: Object.freeze(['src/main.jsx']),
  'dossier-pdf': Object.freeze([
    'src/pdf/SettlementPDF.jsx', 'src/utils/generateSettlementPDF.js', 'src/utils/pdfRender.worker.js',
  ]),
  'campaign-pdf': Object.freeze(['src/utils/generateCampaignPDF.js']),
  'world-book': Object.freeze(['src/utils/generateWorldBook.js']),
  foundry: Object.freeze(['src/foundry/generateFoundryModule.js', 'src/foundry/journalPages.js']),
  'json-export': Object.freeze(['src/lib/worldExport.js']),
});

/**
 * THE STOP SET — the engine boundary every closure halts at. Load-bearing at the
 * FILE level (Car 0 control 3: the same read planted at a `src/generators/` path
 * lights nothing). WORKER's core and lane body are STOP by construction (§1.12),
 * so neither can ever be credited or convicted.
 *
 * ⚠ NOT `src/domain/worldPulse/**`: display modules import pulse leaves for
 * constants and read models, and a STOP inside domain would mint false DARKs by
 * the hundred. The cost that judgment priced is now `web-transitive`'s REPORTED
 * figure rather than a leak into the counting class.
 */
export const SURFACE_CLOSURE_STOP = Object.freeze([
  'src/generators/', 'src/store/', 'src/workers/', 'src/lib/instantWorld/',
]);

/** A TAG applied over the web closure — the NEWS ADDRESS LAW's reach half. */
export const NEWS_TAG_PATTERNS = Object.freeze([
  /(^|\/)region\/wizardNews\.js$/,
  /(^|\/)worldPulse\/[^/]*News[^/]*\.js$/,
  /(^|\/)worldPulse\/eventProse\.js$/,
  /(^|\/)worldPulse\/chronicle\.js$/,
  /(^|\/)lib\/chronicle\.js$/,
  /(^|\/)display\/news[^/]*\.js$/,
  /(^|\/)components\/map\/herald[^/]*\.js$/,
]);

/** The reasons a DARK identity may be registered rather than banked. */
export const DARK_VERDICTS = Object.freeze(['LIT', 'LIT-NAME', 'DARK', 'THIN']);

/** Suffixes tried when resolving a relative specifier — OSR's `resolveSpec` resolves the literal ONLY. */
export const RESOLVE_SUFFIXES = Object.freeze(['', '.js', '.jsx', '/index.js', '/index.jsx']);

/**
 * A byte-exact TWIN of OSR's module-private `BUILTIN_MEMBERS`
 * (`legacy-reader-shape-scan.mjs:67`). 72 unique names; the source literal
 * carries 73 with `add` written twice. Pinned EQUAL by
 * `osrBuiltinMembersFromSource` in the walker — see the header for why.
 */
export const BUILTIN_MEMBERS = new Set([
  'length', 'map', 'filter', 'find', 'findIndex', 'findLast', 'findLastIndex', 'forEach',
  'reduce', 'reduceRight', 'some', 'every', 'slice', 'splice', 'concat', 'join', 'sort',
  'reverse', 'includes', 'indexOf', 'lastIndexOf', 'flat', 'flatMap', 'push', 'pop',
  'shift', 'unshift', 'at', 'fill', 'keys', 'values', 'entries', 'toString', 'valueOf',
  'hasOwnProperty', 'constructor', 'then', 'catch', 'finally', 'call', 'apply', 'bind',
  'trim', 'split', 'replace', 'replaceAll', 'toLowerCase', 'toUpperCase', 'startsWith',
  'endsWith', 'padStart', 'padEnd', 'repeat', 'match', 'matchAll', 'charAt', 'charCodeAt',
  'codePointAt', 'normalize', 'localeCompare', 'substring', 'substr', 'size', 'get', 'set',
  'has', 'add', 'delete', 'clear', 'add', 'toFixed', 'prototype', 'default',
]);

/**
 * Extract OSR's `BUILTIN_MEMBERS` literal from its SOURCE TEXT. A text read of a
 * governed file is not an edit, and it is the only way to pin a module-private
 * set without a schema migration.
 * @param {string} source the text of `scripts/lib/legacy-reader-shape-scan.mjs`
 * @returns {Set<string>}
 */
export function osrBuiltinMembersFromSource(source) {
  const OPEN = 'const BUILTIN_MEMBERS = new Set([';
  const start = String(source ?? '').indexOf(OPEN);
  if (start < 0) {
    throw new Error('writer-reach: OSR BUILTIN_MEMBERS literal not found in legacy-reader-shape-scan.mjs.'
      + ' The twin cannot be pinned against a set it cannot read; re-derive the extractor, never drop the pin.');
  }
  const end = source.indexOf(']);', start);
  if (end < 0) throw new Error('writer-reach: OSR BUILTIN_MEMBERS literal is unterminated');
  const body = source.slice(start + OPEN.length, end);
  return new Set([...body.matchAll(/'([^']+)'/g)].map((m) => m[1]));
}

// ── THE IDENTITY (§1.3) ─────────────────────────────────────────────────────

/**
 * The estate's ONE identity spelling, shared with OSR's `identityOf`, COVERAGE's
 * `BandField.id`, CHARSET's `customContentFieldOsrIdentity` and READERREVIEW's
 * rubric. Never the line number.
 * @param {string} key @param {string} shape @returns {string}
 */
export function writerIdentity(key, shape) {
  if (typeof key !== 'string' || !key || typeof shape !== 'string' || !shape) {
    throw new Error(`writer-reach identity requires a nonempty key and shape: ${JSON.stringify({ key, shape })}`);
  }
  return `${key} on ${shape}`;
}

// ── THE EDGE KINDS AND THE CLOSURES (§7.1) ──────────────────────────────────

/**
 * Resolve a RELATIVE specifier into `src/`. Only relative specifiers are edges.
 * The five-suffix resolution is load-bearing: the 25 lazy dossier tabs are
 * spelled extensionless (`import('../new/tabs/FaithTab.jsx')` through
 * `dossierLazyTabs.js`), and OSR's own `resolveSpec` resolves the literal only —
 * exactly the blindness ODQ §880.5 recorded.
 */
export function resolveSpecifier(fromFile, spec, sources) {
  if (!spec || !spec.startsWith('.')) return null;
  const base = resolvePath(dirname(fromFile), spec);
  for (const suffix of RESOLVE_SUFFIXES) {
    const candidate = base + suffix;
    if (sources.has(candidate)) return candidate;
  }
  return null;
}

/**
 * The FIVE edge kinds, extracted from the TypeScript AST `buildIndex` already
 * holds: static `import`, `export … from`, `import()`, `new URL(…,
 * import.meta.url)` (the worker construction edge), and `require()`.
 */
export function importEdgesOf(sourceFile, file, sources) {
  const out = new Set();
  const add = (spec) => {
    const target = resolveSpecifier(file, spec, sources);
    if (target) out.add(target);
  };
  const visit = (node) => {
    if (ts.isImportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      add(node.moduleSpecifier.text);
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      add(node.moduleSpecifier.text);
    } else if (ts.isCallExpression(node)) {
      if (node.expression.kind === ts.SyntaxKind.ImportKeyword
        && node.arguments[0] && ts.isStringLiteralLike(node.arguments[0])) {
        add(node.arguments[0].text);
      } else if (ts.isIdentifier(node.expression) && node.expression.text === 'require'
        && node.arguments[0] && ts.isStringLiteralLike(node.arguments[0])) {
        add(node.arguments[0].text);
      }
    } else if (ts.isNewExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'URL'
      && node.arguments && node.arguments[0] && ts.isStringLiteralLike(node.arguments[0])) {
      add(node.arguments[0].text);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return out;
}

/** Breadth-first reachability over the edge map, halting at `stop`. */
export function reachFrom(roots, edgesByFile, stop = () => false) {
  const seen = new Set();
  const queue = [];
  for (const root of roots) {
    if (edgesByFile.has(root) && !stop(root)) { seen.add(root); queue.push(root); }
  }
  while (queue.length) {
    const file = queue.pop();
    for (const target of (edgesByFile.get(file) || [])) {
      if (!seen.has(target) && !stop(target)) { seen.add(target); queue.push(target); }
    }
  }
  return seen;
}

/**
 * Every class closure, keyed by `SURFACE_CLASSES`, plus the internal `web` whole
 * and `liveComponents` count the report carries.
 *
 * `web` is TWO-PHASE: phase A walks ALL edges from `src/main.jsx` with NO stop and
 * keeps the `src/components/**` files it reaches (the LIVE components — a derived
 * set, because the tab registry is one of at least three lazy registries and a
 * hand list rots the day a tab is added); phase B walks from those LIVE
 * components with the STOP applied. The result is then PARTITIONED by
 * `WEB_DISPLAY_DIRS`.
 */
export function surfaceClosures({
  edgesByFile, root, stopSet = SURFACE_CLOSURE_STOP, webRootsOverride = null,
}) {
  const rel = relativeTo(root);
  const inStop = (file) => stopSet.some((prefix) => rel(file).startsWith(prefix));
  const never = () => false;
  const closures = {};

  let liveComponents = null;
  let web;
  if (webRootsOverride) {
    web = reachFrom(webRootsOverride, edgesByFile, inStop);
  } else {
    const phaseA = reachFrom(SURFACE_ROOTS.web.map((p) => join(root, p)), edgesByFile, never);
    const live = [...phaseA].filter((f) => rel(f).startsWith('src/components/'));
    liveComponents = live.length;
    web = reachFrom(live, edgesByFile, inStop);
  }

  closures['web-display'] = new Set([...web].filter((f) => WEB_DISPLAY_DIRS.some((p) => rel(f).startsWith(p))));
  closures['web-transitive'] = new Set([...web].filter((f) => !closures['web-display'].has(f)));
  for (const cls of ['dossier-pdf', 'campaign-pdf', 'world-book', 'foundry', 'json-export']) {
    closures[cls] = reachFrom(SURFACE_ROOTS[cls].map((p) => join(root, p)), edgesByFile, inStop);
  }
  closures.news = new Set([...web].filter((f) => NEWS_TAG_PATTERNS.some((re) => re.test(rel(f)))));
  return { closures, web, liveComponents };
}

/** `file -> Set<file>` over every parsed source. */
export function edgeMapOf(index) {
  const edgesByFile = new Map();
  for (const [file, sourceFile] of index.sources) {
    edgesByFile.set(file, importEdgesOf(sourceFile, file, index.sources));
  }
  return edgesByFile;
}

const relativeTo = (root) => (file) => (
  file.startsWith(root) ? file.slice(root.length + 1) : file
).split('\\').join('/');

// ── THE READ CENSUS (§7.1) ──────────────────────────────────────────────────

/**
 * A ten-line local twin of OSR's module-private `isWriteTarget`
 * (`legacy-reader-shape-scan.mjs:516`). A write is not a read: `x.k = v`,
 * `x.k += v`, `delete x.k`, `x.k++`.
 */
export function isWriteTarget(node) {
  const parent = node.parent;
  if (!parent) return false;
  if (ts.isBinaryExpression(parent) && parent.left === node) {
    const kind = parent.operatorToken.kind;
    return kind === ts.SyntaxKind.EqualsToken
      || (kind >= ts.SyntaxKind.FirstCompoundAssignment && kind <= ts.SyntaxKind.LastCompoundAssignment);
  }
  if (ts.isDeleteExpression(parent)) return true;
  if ((ts.isPrefixUnaryExpression(parent) || ts.isPostfixUnaryExpression(parent)) && parent.operand === node) {
    return true;
  }
  return false;
}

/** `key -> string[]` of KNOWN shapes carrying it — the population `N` is credited across. */
export function keysToShapesOf(corpus, minRows = MIN_ROWS) {
  const map = new Map();
  for (const [shape, record] of Object.entries(corpus.shapes)) {
    if (record.rows < minRows) continue;
    for (const key of record.keys) {
      let list = map.get(key);
      if (!list) { list = []; map.set(key, list); }
      list.push(shape);
    }
  }
  return map;
}

/**
 * Record every READ SITE of a written key across the in-closure files, over OSR's
 * resolver unchanged. Four site kinds: property access, string element access,
 * object binding patterns (the destructuring form OSR does not count — its
 * `scanReaders` visits `PropertyAccessExpression` only), and `'k' in x`.
 * Destructuring and `in` sites are `N` only, by construction: neither carries a
 * receiver the resolver can ground.
 *
 * @returns {{ reads: Map<string, {R: Set<string>, N: Set<string>}>, stats: object }}
 */
export function scanSurfaceReads({ index, corpus, files, root, minRows = MIN_ROWS, keysToShapes, relOverride = null }) {
  const { resolve, known } = makeResolver(
    index, corpus.shapes, corpus.arrayShapes, minRows, corpus.singleHome, corpus.rootShapes,
  );
  const rel = relOverride || relativeTo(root);
  const reads = new Map();
  const stats = {
    files: 0, sites: 0, propRead: 0, elemRead: 0, destructure: 0, inOp: 0,
    rGrades: 0, nGrades: 0, resolvedReceivers: 0,
  };
  const entryFor = (identity) => {
    let entry = reads.get(identity);
    if (!entry) { entry = { R: new Set(), N: new Set() }; reads.set(identity, entry); }
    return entry;
  };
  const creditR = (shape, key, relPath) => {
    entryFor(writerIdentity(key, shape)).R.add(relPath);
    stats.rGrades += 1;
  };
  const creditN = (key, relPath) => {
    const shapes = keysToShapes.get(key);
    if (!shapes) return;
    for (const shape of shapes) {
      entryFor(writerIdentity(key, shape)).N.add(relPath);
      stats.nGrades += 1;
    }
  };
  const groundR = (receiver, file, key, relPath) => {
    const tokens = resolve(receiver, file);
    if (!tokens.size) return;
    stats.resolvedReceivers += 1;
    for (const token of tokens) {
      if (token.startsWith('[]') || !known.has(token)) continue;
      if (corpus.shapes[token].keys.includes(key)) creditR(token, key, relPath);
    }
  };

  for (const file of files) {
    const sourceFile = index.sources.get(file);
    if (!sourceFile) continue;
    stats.files += 1;
    const relPath = rel(file);
    const visit = (node) => {
      if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.name)) {
        const key = node.name.text;
        if (!BUILTIN_MEMBERS.has(key) && keysToShapes.has(key) && !isWriteTarget(node)) {
          stats.sites += 1; stats.propRead += 1;
          creditN(key, relPath);
          groundR(node.expression, file, key, relPath);
        }
      } else if (ts.isElementAccessExpression(node) && node.argumentExpression
        && ts.isStringLiteralLike(node.argumentExpression)) {
        const key = node.argumentExpression.text;
        if (keysToShapes.has(key) && !isWriteTarget(node)) {
          stats.sites += 1; stats.elemRead += 1;
          creditN(key, relPath);
          groundR(node.expression, file, key, relPath);
        }
      } else if (ts.isObjectBindingPattern(node)) {
        for (const element of node.elements) {
          const name = element.propertyName ?? element.name;
          if (!name) continue;
          const text = (ts.isIdentifier(name) || ts.isStringLiteralLike(name)) ? name.text : null;
          if (text && keysToShapes.has(text)) {
            stats.sites += 1; stats.destructure += 1;
            creditN(text, relPath);
          }
        }
      } else if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.InKeyword
        && ts.isStringLiteralLike(node.left) && keysToShapes.has(node.left.text)) {
        stats.sites += 1; stats.inOp += 1;
        creditN(node.left.text, relPath);
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
  }
  return { reads, stats };
}

// ── THE VERDICT (§1.10 `WriterVerdict`) ─────────────────────────────────────

/**
 * Grade every written identity on a judgeable shape.
 * THIN if the shape carries fewer than `minRows` rows (reported, never judged);
 * LIT if any COUNTING class reaches it at `R`; LIT-NAME if only at `N`; else DARK.
 * `web-transitive` and `json-export` are computed into `reach` and REPORTED.
 */
export function judgeWriters({
  corpus, closures, reads, root, minRows = MIN_ROWS, allowlist = new Set(),
  counting = COUNTING_CLASSES,
}) {
  const rel = relativeTo(root);
  const relClosures = {};
  for (const cls of SURFACE_CLASSES) {
    relClosures[cls] = new Set([...(closures[cls] || [])].map(rel));
  }
  const known = new Set(Object.keys(corpus.shapes).filter((n) => corpus.shapes[n].rows >= minRows));
  const verdicts = new Map();
  let thinKeys = 0;
  let thinShapes = 0;

  for (const [shape, record] of Object.entries(corpus.shapes)) {
    if (!known.has(shape)) { thinKeys += record.keys.length; thinShapes += 1; continue; }
    for (const key of record.keys) {
      const identity = writerIdentity(key, shape);
      const entry = reads.get(identity) || { R: new Set(), N: new Set() };
      const reach = {};
      for (const cls of SURFACE_CLASSES) {
        const closure = relClosures[cls];
        let grade = null;
        for (const file of entry.R) if (closure.has(file)) { grade = 'R'; break; }
        if (!grade) for (const file of entry.N) if (closure.has(file)) { grade = 'N'; break; }
        if (grade) reach[cls] = grade;
      }
      if (allowlist.has(identity)) reach['json-export'] = 'A';
      let verdict = 'DARK';
      if (counting.some((cls) => reach[cls] === 'R')) verdict = 'LIT';
      else if (counting.some((cls) => reach[cls] === 'N')) verdict = 'LIT-NAME';
      verdicts.set(identity, {
        identity, key, shape, rows: record.rows, verdict, reach,
        readers: { R: [...entry.R].sort(), N: [...entry.N].sort() },
      });
    }
  }
  return { verdicts, thinKeys, thinShapes, knownShapes: known };
}

/** `"<class>=<grade> …"`, the frozen `surfaceReach` grammar. Sorted, so it round-trips. */
export function formatReach(reach) {
  return Object.entries(reach).sort(([a], [b]) => (a < b ? -1 : 1)).map(([c, g]) => `${c}=${g}`).join(' ');
}

/** The inverse of `formatReach`. `parse(format(reach))` equals `reach`. */
export function parseReach(text) {
  const reach = {};
  for (const token of String(text ?? '').split(' ').filter(Boolean)) {
    const [cls, grade] = token.split('=');
    if (!SURFACE_CLASSES.includes(cls)) throw new Error(`writer-reach: unknown surface class in reach: ${cls}`);
    if (!['R', 'N', 'A'].includes(grade)) throw new Error(`writer-reach: unknown reach grade: ${grade}`);
    reach[cls] = grade;
  }
  return reach;
}

/** Every class an identity reaches, for CHARSET and READERREVIEW (§7.4). */
export function surfaceClassesOf(identity, verdicts) {
  const verdict = verdicts.get(identity);
  if (!verdict) return null;
  return { identity, verdict: verdict.verdict, reach: { ...verdict.reach }, formatted: formatReach(verdict.reach) };
}

/**
 * THE REPORTING RULE (⟦G0-5⟧ ⟦CHAIR §882.3 F2⟧). The cohort is BANKED WHOLE — a
 * shrink-only ceiling must hold everything the corpus writes, or a save-id shape
 * crossing `MIN_ROWS` mints hundreds of unbanked DARK rows at once (the §875
 * detonation class). But it is REPORTED by this RULE, never a hand list: the
 * corpus's own synthetic save-id shapes (`osr000…osr015`) and the reference-data
 * spellings that are not JS identifiers are not review material. At C' the cohort
 * is 1,326 and the reviewable slice is 526.
 */
export function reviewableDark(cohort) {
  const identifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
  const saveIdShape = /^osr0(0\d|1[0-5])$/;
  return cohort.filter((row) => (
    identifier.test(row.key) && identifier.test(row.shape) && !saveIdShape.test(row.shape)
  ));
}

// ── THE CROSS-JOIN (§1.10) ──────────────────────────────────────────────────

/**
 * "A shape-mismatched key": an OSR raw finding reads `key` on shape sR inside a
 * COUNTING closure while a writer produces `key` on a DIFFERENT shape sW. The
 * static twin of READERREVIEW's `cross_document_disagreement`.
 *
 * ⚠ Spec-faithful and UNUSABLE as a bare alert: 9,998 rows at C' under the split,
 * because a common key (`name`, `id`, `status`) joins against every written shape
 * carrying it. Car 2 reports it grouped by key under a banked per-key ceiling and
 * ASSERTS only the named classes exactly.
 */
export function crossJoin({ osrFindings, corpus, closures, root, minRows = MIN_ROWS, counting = COUNTING_CLASSES }) {
  const rel = relativeTo(root);
  const inCounting = new Set();
  for (const cls of counting) for (const file of (closures[cls] || [])) inCounting.add(rel(file));
  const writtenByKey = new Map();
  for (const [shape, record] of Object.entries(corpus.shapes)) {
    if (record.rows < minRows) continue;
    for (const key of record.keys) {
      let list = writtenByKey.get(key);
      if (!list) { list = []; writtenByKey.set(key, list); }
      list.push(shape);
    }
  }
  const rows = [];
  for (const finding of osrFindings) {
    if (!inCounting.has(finding.file)) continue;
    const readerShapes = new Set(finding.shapes);
    for (const writerShape of (writtenByKey.get(finding.key) || [])) {
      if (readerShapes.has(writerShape)) continue;
      rows.push({
        key: finding.key,
        file: finding.file,
        readerShape: finding.shapes.join('|'),
        writerShape,
      });
    }
  }
  return rows;
}

// ── DIGESTS ─────────────────────────────────────────────────────────────────

/** Stable JSON: object keys sorted at every depth, so a digest is a BIT, not an order. */
export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${canonicalJson(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value === undefined ? null : value);
}

const sha256 = (text) => createHash('sha256').update(text).digest('hex');

/**
 * `sha256(canonical(corpus.shapes))`. The one-truth pin holds nine COUNTS equal,
 * which two executions of one builder can satisfy while a shape's key set
 * differs — so the digest is the bit that counts-equal cannot supply.
 */
export function shapesDigestOf(shapes) { return sha256(canonicalJson(shapes)); }

/** The verdict digest — identity, verdict and formatted reach, sorted. */
export function verdictDigestOf(verdicts) {
  return sha256(canonicalJson([...verdicts.values()]
    .map((v) => [v.identity, v.verdict, formatReach(v.reach)])
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))));
}

/**
 * The DETECTOR digest — this module plus the OSR libs it borrows. R9's cure: a
 * future OSR schema migration changing `buildIndex`/`makeResolver`/`foldCorpus`
 * signatures is NAMED as drift rather than silently changing the verdicts.
 */
export const DETECTOR_SOURCES = Object.freeze([
  'scripts/lib/writer-reach-scan.mjs',
  'scripts/lib/writer-dark-register.mjs',
  'scripts/check-writer-reach.mjs',
  'scripts/lib/legacy-reader-shape-scan.mjs',
  'scripts/lib/observed-shape-corpus.mjs',
  'scripts/lib/observed-shape-baseline.mjs',
]);

export function detectorDigestOf(root, read = (p) => readFileSync(join(root, p), 'utf8')) {
  return sha256(DETECTOR_SOURCES.map((p) => `${p}\u0000${sha256(read(p))}`).join('\u0000'));
}

/**
 * @typedef {'web-display'|'web-transitive'|'dossier-pdf'|'campaign-pdf'|'world-book'|'foundry'|'json-export'|'news'} SurfaceClass
 * @typedef {'R'|'N'|'A'} ReachGrade
 * @typedef {{ identity: string, key: string, shape: string, rows: number,
 *   verdict: 'LIT'|'LIT-NAME'|'DARK'|'THIN',
 *   reach: Partial<Record<SurfaceClass, ReachGrade>>,
 *   readers: { R: string[], N: string[] } }} WriterVerdict
 */

export { buildIndex, MIN_ROWS };
