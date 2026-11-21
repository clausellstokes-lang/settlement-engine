/**
 * KEY-PROBE instrument (SEAT-10, builder BKP). MEASURE ONLY: writes nothing but its --out file.
 *
 *   node --max-old-space-size=4096 probe.mjs --mode=pairs   --root=<tree> --arm=A|B --out=<json> --maxWorkers=1
 *   node --max-old-space-size=4096 probe.mjs --mode=readers --root=<repo> --a=<armA.json> --b=<armB.json> --out=<json> --maxWorkers=1
 *
 * (`--maxWorkers=1` is the gate-mutex shared-tier declaration; this is one process, no pool.)
 *
 * PAIRS MODE. Births 166 configs × seeds (the corpus's CONFIGS × SEEDS, plus six germanic sizes ×
 * kp-<size>-0..24) twice each, `_seatLawVersion: 1` then `2`, through
 * `generateSettlementPipeline(cfg, null, { seed, customContent: {} })` exactly as the corpus
 * calls it. Each birth is reduced to its set of KEY PATHS, the two sets are diffed, only the
 * difference is kept, and both records are dropped before the next pair. Held across pairs: the
 * per-path diff counters and the UNION of paths per law (schema-sized, not record-sized).
 *
 * THE FOLD (how dynamic maps are folded; the corpus's rules applied PER INSTANCE):
 *   - an array element is `[]`;
 *   - on an object, every key k whose value is a plain object with String(value.id) === k is
 *     folded to `{*}` (the corpus's exact-id rule, `discoverDynamicPlans :: exactIdKeys`);
 *   - otherwise, an object with >= 8 keys all object-valued (children's mean key-set Jaccard
 *     >= 0.6) or all array-valued has every key folded to `{*}` (the corpus's allObject /
 *     allArray >= 8 collapse);
 *   - the corpus's cross-instance CHURN rule is not applied (it needs many instances of one
 *     path); a small runtime-keyed map therefore keeps its named keys, and any noise from it is
 *     visible as a both-directions difference in the table.
 *   Map / Set / Date / null and primitives are leaves, as in the corpus's `observedFieldKind`.
 * A path's SHAPE is `shapeNameOf` of its parent: the last named field, ignoring `[]` and `{*}`
 * (root: `settlement`). Its identity is `<key> on <shape>`, the walker's finding identity.
 */
import { createHash } from 'node:crypto';
import { writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const m = /^--([^=]+)=(.*)$/.exec(a);
  return m ? [m[1], m[2]] : [a.replace(/^--/, ''), true];
}));

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const EXTRA_SEEDS = 25;
const HASH_PAIRS = 10;

const isPlain = (v) => v && typeof v === 'object' && !Array.isArray(v)
  && !(v instanceof Map) && !(v instanceof Set) && !(v instanceof Date);
const enc = (k) => (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : JSON.stringify(k));

function jaccardMean(sets) {
  if (sets.length < 2) return 1;
  let t = 0; let n = 0;
  for (let i = 0; i < sets.length; i += 1) {
    for (let j = i + 1; j < sets.length; j += 1) {
      let inter = 0;
      for (const k of sets[i]) if (sets[j].has(k)) inter += 1;
      const u = sets[i].size + sets[j].size - inter;
      t += u ? inter / u : 1; n += 1;
    }
  }
  return n ? t / n : 1;
}

function foldedKeysOf(obj) {
  if (args.nofold) return new Set(); // cross-check arm: no map folding at all
  const keys = Object.keys(obj);
  const folded = new Set();
  for (const k of keys) {
    const v = obj[k];
    if (isPlain(v) && String(v.id ?? '') === k) folded.add(k);
  }
  if (folded.size) return folded;
  if (keys.length >= 8) {
    if (keys.every((k) => isPlain(obj[k]))
      && jaccardMean(keys.map((k) => new Set(Object.keys(obj[k])))) >= 0.6) return new Set(keys);
    if (keys.every((k) => Array.isArray(obj[k]))) return new Set(keys);
  }
  return folded;
}

/** Reduce one birth to Map<path, {key, shape}>; paths are strings. */
function pathsOf(record) {
  const out = new Map();
  const ancestors = new Set();
  const visit = (value, path, shape, depth) => {
    if (value == null || typeof value !== 'object') return;
    if (value instanceof Map || value instanceof Set || value instanceof Date) return;
    if (depth > 64) throw new Error(`depth > 64 at ${path}`);
    if (ancestors.has(value)) throw new Error(`cycle at ${path}`);
    ancestors.add(value);
    try {
      if (Array.isArray(value)) {
        for (const el of value) visit(el, `${path}[]`, shape, depth + 1);
        return;
      }
      const folded = foldedKeysOf(value);
      for (const [k, child] of Object.entries(value)) {
        const seg = folded.has(k) ? '{*}' : enc(k);
        const p = `${path}.${seg}`;
        if (!out.has(p)) out.set(p, { key: folded.has(k) ? '{*}' : k, shape });
        visit(child, p, folded.has(k) ? shape : k, depth + 1);
      }
    } finally {
      ancestors.delete(value);
    }
  };
  visit(record, 'settlement', 'settlement', 0);
  return out;
}

function stableHash(record) {
  try {
    return createHash('sha256').update(JSON.stringify(record)).digest('hex');
  } catch (e) {
    return `unhashable:${e.message}`;
  }
}

async function pairsMode() {
  const root = args.root;
  const arm = args.arm;
  const { generateSettlementPipeline } = await import(`${root}/src/generators/generateSettlementPipeline.js`);
  const { CONFIGS, SEEDS } = await import(`${root}/scripts/lib/observed-shape-corpus.mjs`);
  const { SEAT_CONTEST_LIT } = await import(`${root}/src/domain/seat/seatCircumstances.js`);
  const jobs = [];
  for (const cfg of CONFIGS) for (const seed of SEEDS) jobs.push({ group: 'corpus', cfg, seed });
  for (const settType of SIZES) {
    for (let i = 0; i < EXTRA_SEEDS; i += 1) {
      jobs.push({ group: 'sizes', cfg: { settType, culture: 'germanic' }, seed: `kp-${settType}-${i}` });
    }
  }
  if (args.limit) jobs.splice(Number(args.limit));
  /** path -> { key, shape, l2only, l1only, ex2, ex1 } */
  const diff = new Map();
  const union1 = new Map();
  const union2 = new Map();
  const hashes = [];
  const errors = [];
  let pairs = 0;
  let peakHeap = 0;
  const t0 = Date.now();
  for (const [i, job] of jobs.entries()) {
    const label = `${job.cfg.settType}/${job.cfg.culture}/${job.seed}`;
    let p1; let p2;
    try {
      let s1 = generateSettlementPipeline({ ...job.cfg, _seatLawVersion: 1 }, null, { seed: job.seed, customContent: {} });
      p1 = pathsOf(s1);
      if (i < HASH_PAIRS) hashes.push({ label, law1: stableHash(s1) });
      s1 = null;
      let s2 = generateSettlementPipeline({ ...job.cfg, _seatLawVersion: 2 }, null, { seed: job.seed, customContent: {} });
      p2 = pathsOf(s2);
      if (i < HASH_PAIRS) hashes[hashes.length - 1].law2 = stableHash(s2);
      s2 = null;
    } catch (e) {
      errors.push({ label, error: String(e?.stack || e).slice(0, 600) });
      continue;
    }
    for (const [p, meta] of p1) if (!union1.has(p)) union1.set(p, meta);
    for (const [p, meta] of p2) if (!union2.has(p)) union2.set(p, meta);
    const bump = (p, meta, side) => {
      let e = diff.get(p);
      if (!e) { e = { ...meta, l2only: 0, l1only: 0, ex2: null, ex1: null }; diff.set(p, e); }
      if (side === 2) { e.l2only += 1; e.ex2 ??= label; } else { e.l1only += 1; e.ex1 ??= label; }
    };
    for (const [p, meta] of p2) if (!p1.has(p)) bump(p, meta, 2);
    for (const [p, meta] of p1) if (!p2.has(p)) bump(p, meta, 1);
    p1 = null; p2 = null;
    pairs += 1;
    const heap = process.memoryUsage().heapUsed;
    peakHeap = Math.max(peakHeap, heap);
    if (i % 20 === 0) process.stderr.write(`[${arm}] pair ${i + 1}/${jobs.length} ${label} heap=${(heap / 1e6).toFixed(0)}MB t=${((Date.now() - t0) / 1000).toFixed(0)}s\n`);
  }
  const rows = [...diff].map(([path, e]) => ({
    path, key: e.key, shape: e.shape, l2only: e.l2only, l1only: e.l1only, ex2: e.ex2, ex1: e.ex1,
    inLaw1Union: union1.has(path), inLaw2Union: union2.has(path),
  })).sort((a, b) => a.path.localeCompare(b.path));
  const idSet = (u) => new Set([...u.values()].map(({ key, shape }) => `${key} on ${shape}`));
  const ids1 = idSet(union1);
  const ids2 = idSet(union2);
  const out = {
    arm, root, SEAT_CONTEST_LIT, fold: args.nofold ? 'none' : 'corpus-rules-per-instance', jobs: jobs.length, pairs, errors, hashes,
    peakHeapMB: Math.round(peakHeap / 1e6), seconds: Math.round((Date.now() - t0) / 1000),
    union1Paths: union1.size, union2Paths: union2.size,
    law2NeverLaw1Paths: [...union2.keys()].filter((p) => !union1.has(p)).sort(),
    law1NeverLaw2Paths: [...union1.keys()].filter((p) => !union2.has(p)).sort(),
    law2NeverLaw1Identities: [...ids2].filter((x) => !ids1.has(x)).sort(),
    law1NeverLaw2Identities: [...ids1].filter((x) => !ids2.has(x)).sort(),
    diffRows: rows,
  };
  writeFileSync(args.out, `${JSON.stringify(out, null, 1)}\n`);
  process.stderr.write(`[${arm}] done: ${pairs} pairs, ${errors.length} errors, ${rows.length} diff paths, peak ${out.peakHeapMB}MB, ${out.seconds}s\n`);
}

async function readersMode() {
  const root = args.root;
  const A = JSON.parse(readFileSync(args.a, 'utf8'));
  const B = JSON.parse(readFileSync(args.b, 'utf8'));
  const ts = (await import(`${root}/node_modules/typescript/lib/typescript.js`)).default;
  const { buildObservedCorpus } = await import(`${root}/scripts/lib/observed-shape-corpus.mjs`);
  const { scanReaders: scanLegacyReaders } = await import(`${root}/scripts/lib/legacy-reader-shape-scan.mjs`);
  const chk = await import(`${root}/scripts/check-observed-shape-readers.mjs`);
  const { MIN_ROWS } = await import(`${root}/scripts/lib/observed-shape-baseline.mjs`);
  const baseline = JSON.parse(readFileSync(join(root, 'scripts/.observed-shape-readers-baseline.json'), 'utf8'));

  // Candidates: identities of every path law 2 writes and law 1 never does, in either arm.
  const cand = new Map(); // identity -> { key, shape, paths:Set, arms:Set }
  for (const R of [A, B]) {
    const byPath = new Map(R.diffRows.map((r) => [r.path, r]));
    for (const p of R.law2NeverLaw1Paths) {
      const r = byPath.get(p);
      const id = `${r.key} on ${r.shape}`;
      if (!cand.has(id)) cand.set(id, { key: r.key, shape: r.shape, paths: new Set(), arms: new Set() });
      cand.get(id).paths.add(p); cand.get(id).arms.add(R.arm);
    }
  }
  const t0 = Date.now();
  const corpus = await buildObservedCorpus();
  const tCorpus = Math.round((Date.now() - t0) / 1000);
  const files = chk.sourceFiles(root);

  // Scan 1: the LIVE heuristic scan, driven as the walker drives it (law-1 corpus, unchanged).
  const live = scanLegacyReaders({
    files, shapes: corpus.shapes, arrayShapes: corpus.arrayShapes, singleHome: corpus.singleHome,
    rootShapes: corpus.rootShapes, minRows: MIN_ROWS, root,
  });
  const family = chk.applyShapeFamilyFilter({ scanMode: 'legacy-leaf', corpus, scan: live });
  const dom = chk.applyDomGlobalReceiverFilter({ scanMode: 'legacy-leaf', corpus, scan: family });
  const lang = chk.applyLanguageSurfaceFilter({ scanMode: 'legacy-leaf', corpus, scan: dom });
  const expl = chk.applyExplainedWriterFilter({ scanMode: 'legacy-leaf', scan: lang });
  const gated = chk.applyVirtualDormantWriterFilter({ scanMode: 'legacy-leaf', scan: expl });
  const fid = (f) => `${f.key} on ${f.shapes.join('+')}`;
  const gatedSet = new Set(gated.findings.map((f) => `${f.file}:${f.line}:${fid(f)}`));

  // Scan 2: READ discovery. Candidate keys are REMOVED from their shape's key list (keys never
  // steer resolution: `makeResolver` reads names and rows only), and a candidate shape the law-1
  // corpus never observed (or observed under MIN_ROWS) is ADDED at MIN_ROWS rows so the resolver
  // can bind a receiver to it. Every remaining raw finding on a candidate identity is a READ.
  const shapes2 = {};
  for (const [n, s] of Object.entries(corpus.shapes)) shapes2[n] = { rows: s.rows, keys: [...s.keys] };
  const addedShapes = [];
  for (const { key, shape } of cand.values()) {
    if (!shapes2[shape]) { shapes2[shape] = { rows: MIN_ROWS, keys: [] }; addedShapes.push(shape); }
    else if (shapes2[shape].rows < MIN_ROWS) { shapes2[shape] = { ...shapes2[shape], rows: MIN_ROWS }; addedShapes.push(`${shape} (rows ${corpus.shapes[shape].rows} -> ${MIN_ROWS})`); }
    shapes2[shape].keys = shapes2[shape].keys.filter((k) => k !== key);
  }
  const probeScan = scanLegacyReaders({
    files, shapes: shapes2, arrayShapes: corpus.arrayShapes, singleHome: corpus.singleHome,
    rootShapes: corpus.rootShapes, minRows: MIN_ROWS, root,
  });

  const symbolAt = (file, pos) => {
    const sf = ts.createSourceFile(file, readFileSync(join(root, file), 'utf8'), ts.ScriptTarget.Latest, true);
    const names = [];
    const walk = (node) => {
      if (pos < node.getStart(sf) || pos >= node.getEnd()) return;
      let nm = null;
      if ((ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node) || ts.isClassDeclaration(node)) && node.name) nm = node.name.getText(sf);
      else if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)
        && node.initializer && (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))) nm = node.name.text;
      else if (ts.isPropertyAssignment(node) && (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))) nm = node.name.getText(sf);
      if (nm) names.push(nm);
      ts.forEachChild(node, walk);
    };
    walk(sf);
    return names.length ? names.join(' > ') : '(module)';
  };

  const inventoryIds = new Map(); // identity -> [files]
  for (const [file, ids] of Object.entries(baseline.inventory)) {
    for (const id of Object.keys(ids)) {
      if (!inventoryIds.has(id)) inventoryIds.set(id, []);
      inventoryIds.get(id).push(file);
    }
  }
  const exemptIds = new Set(chk.EXPLAINED_WRITER_EXEMPTIONS.map((e) => e.identity));
  const rowTagged = new Map();
  for (const [file, tags] of Object.entries(baseline.rowTags || {})) {
    for (const [id, tag] of Object.entries(tags)) rowTagged.set(`${file}::${id}`, tag);
  }

  const rows = [];
  for (const [id, c] of [...cand].sort((a, b) => a[0].localeCompare(b[0]))) {
    const reads = probeScan.findings.filter((f) => f.key === c.key && f.shapes.length === 1 && f.shapes[0] === c.shape)
      .map((f) => ({
        file: f.file, line: f.line, symbol: symbolAt(f.file, f.pos), text: f.text,
        liveRawFinding: live.findings.some((g) => g.file === f.file && g.line === f.line && fid(g) === id),
        liveGatedFinding: gatedSet.has(`${f.file}:${f.line}:${id}`),
      }));
    const inBaseline = inventoryIds.get(id) || [];
    rows.push({
      identity: id, key: c.key, shape: c.shape, arms: [...c.arms].sort(), paths: [...c.paths].sort(),
      law1CorpusShapeRows: corpus.shapes[c.shape]?.rows ?? 0,
      law1CorpusWritesKeyOnShape: Boolean(corpus.shapes[c.shape]?.keys.includes(c.key)),
      reads,
      baselineInventoryFiles: inBaseline,
      baselineRowTags: inBaseline.map((f) => rowTagged.get(`${f}::${id}`)).filter(Boolean),
      explainedWriterExemption: exemptIds.has(id),
    });
  }

  const pairEq = A.hashes.map((h, i) => ({
    label: h.label,
    law1Equal: h.law1 === B.hashes[i]?.law1 && B.hashes[i]?.label === h.label,
    law2Equal: h.law2 === B.hashes[i]?.law2,
  }));
  const out = {
    corpusSeconds: tCorpus, corpusMeta: corpus.meta, minRows: MIN_ROWS,
    liveScan: { stats: live.stats, rawFindings: live.findings.length, gatedFindings: gated.findings.length },
    probeScan: { stats: probeScan.stats, rawFindings: probeScan.findings.length, addedShapes },
    armBLaw1EqualsArmA: pairEq,
    candidates: rows,
  };
  writeFileSync(args.out, `${JSON.stringify(out, null, 1)}\n`);
  process.stderr.write(`readers done: ${rows.length} candidate identities, corpus ${tCorpus}s, total ${Math.round((Date.now() - t0) / 1000)}s\n`);
}

if (args.mode === 'pairs') await pairsMode();
else if (args.mode === 'readers') await readersMode();
else throw new Error('--mode=pairs|readers');
