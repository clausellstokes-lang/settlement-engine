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
function pathsOf(record, rootName = 'settlement') {
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
  visit(record, rootName, rootName, 0);
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


/**
 * PLAY MODE (the addendum). 6 sizes × kpp-<size>-0..4, germanic; each pair born under law 1 and
 * law 2 in the --root tree (the lit clone), then for each law, the SAME play:
 *   (a) six one-month `simulateCampaignWorldPulse` intervals, commit:true, fixed now, the corpus's
 *       pulse-producer campaign with the one save (its tier-coverage one-save form: no edges, no
 *       relationshipStates), every discovered `*Enabled` rule lit except advanceEpochEnabled;
 *   (b) on the (a) save: `mutateSettlementChecked` with CHANGE_RULING_POWER at the first
 *       non-governing faction in roster order (`affordanceManifest.js :: rulingPowerTargets`);
 *   (c) on the (a) save: one `power_transfer` outcome, built by hand in `coup.js`'s fall shape with
 *       the winner `coupContenders(settlement).challengers[0]`, applied through
 *       `applyWorldPulseOutcomes` (applyWorldPulse.js) with a `buildWorldSnapshot` snapshot, as
 *       `applyWorldPulseProposal` drives it.
 * Records diffed per step: save after (a) [root 'save'], pulse result of each interval
 * [root 'pulseResult'], save after (b), save after (c).
 */
async function playMode() {
  const root = args.root;
  const imp = (rel) => import(`${root}/${rel}`);
  const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
  const { simulateCampaignWorldPulse } = await imp('src/domain/worldPulse/index.js');
  const { ensureRegionalGraph } = await imp('src/domain/region/index.js');
  const { buildSpatialDigest } = await imp('src/domain/spatial/index.js');
  const { makeGridPack, placeSettlements } = await imp('tests/fixtures/spatialPackFixtures.js');
  const { discoverSimulationFlags } = await imp('scripts/lib/observed-shape-corpus.mjs');
  const { mutateSettlementChecked } = await imp('src/domain/events/mutate.js');
  const { applyWorldPulseOutcomes } = await imp('src/domain/worldPulse/applyWorldPulse.js');
  const { buildWorldSnapshot } = await imp('src/domain/worldPulse/worldSnapshot.js');
  const { governingFactionOf } = await imp('src/domain/rulingPower.js');
  const { coupContenders } = await imp('src/domain/rulingPowerCoup.js');
  const { holderOf } = await imp('src/domain/seat/holderOfSeat.js');
  const { SEAT_CONTEST_LIT } = await imp('src/domain/seat/seatCircumstances.js');
  const { readdirSync, statSync } = await import('node:fs');
  const domainFiles = [];
  (function walkDir(d) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) walkDir(p); else if (p.endsWith('.js')) domainFiles.push(p);
    }
  }(join(root, 'src/domain')));
  const flags = discoverSimulationFlags(readFileSync, domainFiles);
  const simulationRules = Object.fromEntries(flags.map((f) => [f, true]));
  simulationRules.advanceEpochEnabled = false;
  const NOW = '2026-01-01T00:00:00.000Z';
  const INTERVALS = 6;
  const PER_SIZE = Number(args.perSize ?? 5);
  const jobs = [];
  for (const settType of SIZES) for (let i = 0; i < PER_SIZE; i += 1) jobs.push({ cfg: { settType, culture: 'germanic' }, seed: `kpp-${settType}-${i}` });
  if (args.limit) jobs.splice(Number(args.limit));

  const nameOf = (f) => String(f?.faction || f?.name || '');
  const govOnly = (s) => nameOf(governingFactionOf(s)) || null;
  // The seat as both laws know it: the governing power AND (law 2) the holder, owner audience.
  const govName = (s) => {
    let h = null;
    try { h = holderOf(s, { audience: 'owner' })?.holder; } catch { h = null; }
    return `${govOnly(s)}|${h ? nameOf(h) || String(h.id || '?') : '-'}`;
  };
  const firstNonGoverning = (s) => {
    const g = governingFactionOf(s);
    const fs = s?.powerStructure?.factions || s?.factions || [];
    const t = fs.find((f) => f && f !== g && nameOf(f));
    return t ? nameOf(t) : null;
  };

  function play(law, job) {
    const id = 'kpp000';
    const settlement = generateSettlementPipeline({ ...job.cfg, _seatLawVersion: law }, null, { seed: job.seed, customContent: {} });
    const pack = makeGridPack({ cols: 10, rows: 8 });
    const [place] = placeSettlements(pack, 1);
    let campaign = {
      id: 'key-probe-play', name: 'Key probe play', settlementIds: [id],
      worldState: {
        rngSeed: 'observed-shape-corpus', tick: 1, simulationRules,
        calendar: { elapsedWeeks: 20, year: 1 }, spatialCanonVersion: 1,
        spatialDigest: buildSpatialDigest({ pack, placements: [{ id, cellId: place.cellId }] }),
        relationshipStates: {}, stressors: [],
      },
      regionalGraph: ensureRegionalGraph({ edges: [], channels: [] }),
      wizardNews: { currentTick: 1, entries: [] },
    };
    let saves = [{ id, name: 'Probe', phase: 'canon', settlement, campaignState: { phase: 'canon', eventLog: [], locks: {} } }];
    const records = new Map();
    const transfers = { pulse: 0, pulseByCoupRoad: 0, dm: 0, coup: 0 };
    const notes = [];
    const gov0 = govName(settlement);
    for (let i = 0; i < INTERVALS; i += 1) {
      const before = govName(saves[0].settlement);
      const out = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_month', commit: true, now: NOW });
      if (out?.worldState) campaign = { ...campaign, worldState: out.worldState };
      if (out?.wizardNews) campaign = { ...campaign, wizardNews: out.wizardNews };
      if (out?.regionalGraph) campaign = { ...campaign, regionalGraph: out.regionalGraph };
      if (Array.isArray(out?.saves) && out.saves.length) saves = out.saves;
      const after = govName(saves[0].settlement);
      if (after !== before) transfers.pulse += 1;
      const pts = (out?.autoApplied || []).filter((o) => o?.type === 'power_transfer' || o?.powerTransfer);
      for (const o of pts) { if (o.candidateType === 'coup_succeeded') transfers.pulseByCoupRoad += 1; notes.push(`interval ${i + 1}: autoApplied ${o.type}/${o.candidateType}`); }
      records.set(`a.pulseResult.${i + 1}`, pathsOf(out, 'pulseResult'));
    }
    const saveA = saves[0];
    records.set('a.save', pathsOf(saveA, 'save'));
    // (b)
    const target = firstNonGoverning(saveA.settlement);
    let bVeto = null;
    if (target) {
      const res = mutateSettlementChecked({
        settlement: saveA.settlement,
        event: { id: `kpp.dm.${job.seed}`, type: 'CHANGE_RULING_POWER', targetId: target, payload: {} },
        now: NOW,
      });
      bVeto = res.veto ? (res.veto.code || JSON.stringify(res.veto).slice(0, 80)) : null;
      if (govName(res.settlement) !== govName(saveA.settlement)) transfers.dm += 1;
      records.set('b.save', pathsOf({ ...saveA, settlement: res.settlement }, 'save'));
    } else notes.push('b: no non-governing faction');
    // (c)
    const cont = coupContenders(saveA.settlement);
    const winner = cont?.challengers?.[0]?.name || null;
    let cRefused = null;
    if (winner) {
      const tick = campaign.worldState?.tick || 0;
      const outcome = {
        id: `world_outcome.coup_verdict.kpp.${tick}`, ruleFamily: 'stressor', probability: 1, targetSaveId: id,
        metadata: { verdict: { holds: false, winner, incumbent: cont.incumbent, challengers: cont.challengers, variant: null } },
        type: 'power_transfer', candidateType: 'coup_succeeded', ruleId: 'coup_verdict_fall', applyMode: 'auto',
        severity: 0.6, headline: `${winner} seizes power`, summary: 'probe', reasons: ['probe'],
        powerTransfer: { toPowerName: winner, cause: 'coup', tick, losers: cont.challengers.filter((c) => c.name !== winner).map((c) => c.name), sourceStressorId: 'kpp.coup' },
        condition: { archetype: 'government_overthrown', severity: 0.5, triggeredAt: { tick, sourceEventType: 'COUP_VERDICT', sourceEventTargetId: 'kpp.coup' }, causes: [{ source: 'kpp.coup', effect: 'government_overthrown', reason: 'probe' }] },
      };
      const snapshot = buildWorldSnapshot({
        campaign: { ...campaign, settlementIds: [id] }, saves: [{ ...saveA, phase: 'canon' }],
        worldState: campaign.worldState, regionalGraph: campaign.regionalGraph,
      });
      const res = applyWorldPulseOutcomes({
        snapshot, worldState: campaign.worldState, regionalGraph: campaign.regionalGraph, wizardNews: campaign.wizardNews,
        settlementMap: new Map([[id, { saveId: id, save: saveA, settlement: saveA.settlement }]]),
        outcomes: [outcome], tick, now: NOW, advanceNewsTick: false, advanceRegionalImpacts: false,
        simulationRules: campaign.worldState?.simulationRules,
      });
      const upd = (res.settlementUpdates || []).find((u) => String(u.saveId) === id);
      const cSettlement = upd?.settlement || saveA.settlement;
      if (govName(cSettlement) !== govName(saveA.settlement)) transfers.coup += 1;
      else cRefused = 'no seat change';
      records.set('c.save', pathsOf({ ...saveA, settlement: cSettlement }, 'save'));
    } else notes.push('c: no coup contender');
    return { records, transfers, notes, gov0, govA: govName(saveA.settlement), target, bVeto, winner, cRefused };
  }

  const steps = new Map(); // step -> { pairs, diff Map, union1, union2 }
  const stepOf = (k) => {
    if (!steps.has(k)) steps.set(k, { pairs: 0, diff: new Map(), union1: new Map(), union2: new Map() });
    return steps.get(k);
  };
  const perPair = [];
  const errors = [];
  const t0 = Date.now();
  let peakHeap = 0;
  for (const [i, job] of jobs.entries()) {
    const label = `${job.cfg.settType}/${job.seed}`;
    const tp = Date.now();
    let r1; let r2;
    try { r1 = play(1, job); r2 = play(2, job); } catch (e) { errors.push({ label, error: String(e?.stack || e).slice(0, 800) }); continue; }
    for (const k of new Set([...r1.records.keys(), ...r2.records.keys()])) {
      const p1 = r1.records.get(k); const p2 = r2.records.get(k);
      if (!p1 || !p2) { errors.push({ label, error: `step ${k} ran under one law only` }); continue; }
      const st = stepOf(k);
      st.pairs += 1;
      for (const [p, m] of p1) if (!st.union1.has(p)) st.union1.set(p, m);
      for (const [p, m] of p2) if (!st.union2.has(p)) st.union2.set(p, m);
      const bump = (p, m, side) => {
        let e = st.diff.get(p);
        if (!e) { e = { ...m, l2only: 0, l1only: 0, ex2: null, ex1: null }; st.diff.set(p, e); }
        if (side === 2) { e.l2only += 1; e.ex2 ??= label; } else { e.l1only += 1; e.ex1 ??= label; }
      };
      for (const [p, m] of p2) if (!p1.has(p)) bump(p, m, 2);
      for (const [p, m] of p1) if (!p2.has(p)) bump(p, m, 1);
    }
    const strip = (r) => ({ transfers: r.transfers, notes: r.notes, gov0: r.gov0, govA: r.govA, dmTarget: r.target, dmVeto: r.bVeto, coupWinner: r.winner, coupRefused: r.cRefused });
    perPair.push({ label, seconds: Math.round((Date.now() - tp) / 100) / 10, law1: strip(r1), law2: strip(r2) });
    r1 = null; r2 = null;
    peakHeap = Math.max(peakHeap, process.memoryUsage().heapUsed);
    process.stderr.write(`[play] pair ${i + 1}/${jobs.length} ${label} ${perPair.at(-1).seconds}s heap=${(process.memoryUsage().heapUsed / 1e6).toFixed(0)}MB\n`);
  }
  const stepsOut = {};
  const all1 = new Map(); const all2 = new Map();
  for (const [k, st] of [...steps].sort()) {
    for (const [p, m] of st.union1) all1.set(p, m);
    for (const [p, m] of st.union2) all2.set(p, m);
    stepsOut[k] = {
      pairs: st.pairs, union1Paths: st.union1.size, union2Paths: st.union2.size,
      law2NeverLaw1Paths: [...st.union2.keys()].filter((p) => !st.union1.has(p)).sort(),
      law1NeverLaw2Paths: [...st.union1.keys()].filter((p) => !st.union2.has(p)).sort(),
      diffRows: [...st.diff].map(([path, e]) => ({ path, ...e, inLaw1Union: st.union1.has(path), inLaw2Union: st.union2.has(path) })).sort((a, b) => a.path.localeCompare(b.path)),
    };
  }
  const dynamicCheck = (a, b, otherUnion) => a.map((p) => {
    const parent = p.replace(/\.("(?:[^"\\]|\\.)*"|[^."]+)$/, '');
    const entryRe = /^(.*\.provenance)\.("(?:[^"\\]|\\.)*"|[^.]+)/;
    const em = entryRe.exec(p);
    const tail = em ? p.slice(em[0].length) : null;
    const sameShapeEntries = em ? [...otherUnion.keys()].filter((q) => { const qm = entryRe.exec(q); return qm && qm[1] === em[1] && q.slice(qm[0].length) === tail; }).length : null;
    return { path: p, parent, sameShapeEntriesInOtherLaw: sameShapeEntries };
  });
  const sumT = (law, k) => perPair.reduce((n, p) => n + p[law].transfers[k], 0);
  const out = {
    mode: 'play', root, SEAT_CONTEST_LIT, intervals: INTERVALS, jobs: jobs.length, pairsRun: perPair.length, errors,
    seconds: Math.round((Date.now() - t0) / 1000), peakHeapMB: Math.round(peakHeap / 1e6),
    transfers: Object.fromEntries(['pulse', 'pulseByCoupRoad', 'dm', 'coup'].map((k) => [k, { law1: sumT('law1', k), law2: sumT('law2', k) }])),
    allStepsLaw2NeverLaw1Paths: [...all2.keys()].filter((p) => !all1.has(p)).sort(),
    allStepsLaw1NeverLaw2Paths: [...all1.keys()].filter((p) => !all2.has(p)).sort(),
    law2OnlyEntryCheck: dynamicCheck([...all2.keys()].filter((p) => !all1.has(p)).sort(), null, all1),
    law1OnlyEntryCheck: dynamicCheck([...all1.keys()].filter((p) => !all2.has(p)).sort(), null, all2),
    provenanceEntryCounts: { law1: [...all1.keys()].filter((p) => /spatialLedgers\.provenance\.[^.]+$|spatialLedgers\.provenance\."[^"]*"$/.test(p)).length, law2: [...all2.keys()].filter((p) => /spatialLedgers\.provenance\.[^.]+$|spatialLedgers\.provenance\."[^"]*"$/.test(p)).length },
    steps: stepsOut, perPair,
  };
  writeFileSync(args.out, `${JSON.stringify(out, null, 1)}\n`);
  process.stderr.write(`[play] done ${perPair.length} pairs, ${errors.length} errors, ${out.seconds}s\n`);
}

if (args.mode === 'pairs') await pairsMode();
else if (args.mode === 'play') await playMode();
else if (args.mode === 'readers') await readersMode();
else throw new Error('--mode=pairs|play|readers');
