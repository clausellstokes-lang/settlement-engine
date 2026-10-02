/**
 * tests/helpers/generationForkCensus.js — EM-P2's INSTRUMENTATION. The counting root proxy,
 * the headless runner, the declared 63-row census corpus, the classifier that fills every
 * Tier-1 field BY EXECUTION, the literal emitter, and the registerStep-aware symbol resolver.
 *
 * ⭐ THE TWIN, NAMED HERE SO THE NEXT READER DOES NOT RE-FIND IT (chair ruling, 2026-09-19).
 * `instrumentedRoot` and `runHeadless` already exist as MODULE-LOCAL, unexported functions in
 * tests/generators/pipelinePinnedMode.test.js (:107 and :79 — that file has no exports at all,
 * so nothing collides). EM-P2 keeps its own copy DELIBERATELY: exporting the originals would
 * be a MODIFY of a file EM-P0 landed, which is not this packet's change manifest. The
 * consolidation is slotted to TOOL-4, which owns shared-helper hygiene.
 *
 * ⛔ A PLAIN `.js` HELPER, NEVER A `.test.js`. Importing a symbol from a `.test.js` re-registers
 * that file's suites in every importer (the dormancyOracle incident, recorded in
 * tests/helpers/codeOnlySource.js's header). Nothing here registers a `describe` or an `it`,
 * so this module never enters the lighting census's denominator.
 *
 * ⛔ TIER 1 NEEDS NO MODULE MOCK, AND THAT IS STRUCTURAL. `runPipeline(initialContext, rng,
 * options)` takes the root PRNG as an ARGUMENT (EM-P2 VF-2) and `pipeline.js :: runPipeline` hands the
 * object the root's `fork` returned to `setActiveRng` (VF-3), so a test-side RECURSIVE counting
 * proxy over the root sees every channel a step's own stream carries — the ambient
 * `kernel/rngContext.js` helpers included — because they are all the same `random()`. The MINT
 * and HASH censuses are the census file's own `vi.mock` factories and are not this module's
 * business; this module only has to be reachable THROUGH them, which it is, because it imports
 * `createPRNG` by the same specifier the generator graph does.
 */
import { createHash } from 'node:crypto';

import { getStepMeta, getStepOrder, runPipeline } from '../../src/generators/pipeline.js';
import { resolveConfigWithUserContentTunables } from '../../src/domain/content/userContentTunables.js';
import { withCustomContent } from '../../src/lib/dependencyEngine.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { goldenCorpus } from './goldenMasterCorpus.js';
import { codeOnly } from './codeOnlySource.js';
// Side-effect import: the step registry is populated by the entry point, not by pipeline.js.
// Without it `getStepMeta()` returns [] and every census below would measure an empty tree.
import '../../src/generators/generateSettlementPipeline.js';

/** The index the golden corpus's structured GRID ends at; everything after it is the tail. */
const GRID_END = 504;
/** The value-hash index's minimum serialisation, in bytes (the recon's floor, kept). */
const HASH_FLOOR_BYTES = 12;
/** The record walk's depth ceiling (the recon's). */
const INDEX_DEPTH = 4;

/** Stable serialisation; `undefined` is given a distinguishable non-JSON spelling. */
function serialise(value) {
  try {
    const text = JSON.stringify(value);
    return text === undefined ? ' undefined' : text;
  } catch {
    return String(value);
  }
}

/** @param {unknown} value @returns {string} a short stable digest of `serialise(value)`. */
function hashOf(value) {
  return createHash('sha1').update(serialise(value)).digest('hex').slice(0, 16);
}

/** @param {string} text @returns {string} the same digest, over a string already serialised. */
function hashOfText(text) {
  return createHash('sha1').update(text).digest('hex').slice(0, 16);
}

/** @param {unknown} value @returns {boolean} true for an object or an array, never for a scalar. */
function isStructural(value) {
  return value !== null && typeof value === 'object';
}

/**
 * Wrap ONE minted stream recursively. Every method call is a draw; `fork` is recorded by label
 * and its child is wrapped too, so a sub-fork taken inside a step is still counted against the
 * step that took it.
 * @param {Record<string, unknown>} base
 * @param {{ random: number, other: number, draws: number, forkLabels: string[],
 *   methods: Record<string, number>, maxDepth: number }} record
 * @param {number} depth
 * @returns {Record<string, unknown>}
 */
function countingStream(base, record, depth) {
  if (depth > record.maxDepth) record.maxDepth = depth;
  /** @type {Record<string, unknown>} */
  const proxy = {};
  for (const key of Object.keys(base)) {
    const value = base[key];
    if (typeof value !== 'function') { proxy[key] = value; continue; }
    if (key === 'fork') {
      proxy[key] = (/** @type {string} */ label) => {
        record.forkLabels.push(String(label));
        return countingStream(value(label), record, depth + 1);
      };
    } else if (key === 'random') {
      proxy[key] = (/** @type {unknown[]} */ ...args) => {
        record.random += 1; record.draws += 1;
        return value(...args);
      };
    } else {
      proxy[key] = (/** @type {unknown[]} */ ...args) => {
        record.other += 1; record.draws += 1;
        record.methods[key] = (record.methods[key] || 0) + 1;
        return value(...args);
      };
    }
  }
  return proxy;
}

/** @returns {{ random: number, other: number, draws: number, forkLabels: string[],
 *   methods: Record<string, number>, maxDepth: number }} a fresh per-step record. */
function newRecord() {
  return { random: 0, other: 0, draws: 0, forkLabels: [], methods: {}, maxDepth: 0 };
}

/**
 * A root PRNG whose per-step forks are each a recursive counting proxy.
 *
 * THE PERTURBATION, exactly: one step's fork label gains a `::perturbed` suffix, so that step's
 * INPUTS are identical to the baseline run's and only its OWN stream moved. Every other step
 * forks the same label it forked in the baseline.
 *
 * @param {string} seed the run's root seed
 * @param {{ perturbStep?: string | null }} [opts]
 * @returns {{ root: Record<string, unknown>, perStep: Map<string, ReturnType<typeof newRecord>> }}
 */
export function instrumentedRoot(seed, opts = {}) {
  const perturbStep = opts.perturbStep ?? null;
  const base = createPRNG(seed);
  /** @type {Map<string, ReturnType<typeof newRecord>>} */
  const perStep = new Map();
  /** @type {Record<string, unknown>} */
  const root = {};
  for (const key of Object.keys(base)) {
    const value = base[key];
    if (typeof value !== 'function') { root[key] = value; continue; }
    if (key === 'fork') continue;
    root[key] = (/** @type {unknown[]} */ ...args) => value(...args);
  }
  root.fork = (/** @type {string} */ label) => {
    const record = newRecord();
    perStep.set(String(label), record);
    const child = (perturbStep !== null && String(label) === perturbStep)
      ? base.fork(`${label}::perturbed`)
      : base.fork(label);
    return countingStream(child, record, 0);
  };
  return { root, perStep };
}

/**
 * The initial context `generateSettlementPipeline` builds, so a direct runner call is honest.
 * @param {Record<string, unknown>} row a corpus row (config fields plus `_seed`)
 * @returns {Record<string, unknown>}
 */
function initialContextFor(row) {
  const { _seed: seed, ...cfg } = row;
  return {
    config: resolveConfigWithUserContentTunables({ ...cfg }, {}),
    importedNeighbour: null,
    _seed: seed,
    _traceClock: 0,
  };
}

/**
 * Run the REAL registered pipeline headlessly over one corpus row.
 * @param {Record<string, unknown>} row
 * @param {Record<string, unknown>} rng the root stream (normally `instrumentedRoot(...).root`)
 * @param {Record<string, unknown>} [options] the runner's options bag (`onStep`, `pins`, …)
 * @returns {Record<string, unknown>} the finished context
 */
export function runHeadless(row, rng, options = {}) {
  return withCustomContent({}, () => runPipeline(initialContextFor(row), rng, options));
}

/**
 * THE CENSUS CORPUS, DECLARED AND NOT SAMPLED (EM-P2 §6.4): every `(settType × terrainOverride)`
 * pair ONCE, taken in corpus order over the golden corpus's structured grid, PLUS every row of
 * the tail from `GRID_END` to the end.
 *
 * ⛔ THE TAIL IS NOT OPTIONAL. `resolveConfig|tradeRoute` is drawn in 5 of the golden's 525 rows
 * and `terrainType`/`resolvedTerrain` in 3, all of them in that tail, so every stride sample up
 * to 105 rows misses at least one drawn row while costing more.
 *
 * @returns {Array<Record<string, unknown>>} the corpus rows, grid first then tail
 */
export function censusCorpus() {
  const all = goldenCorpus();
  const tail = all.slice(GRID_END);
  /** @type {Array<Record<string, unknown>>} */
  const oneEach = [];
  const seen = new Set();
  for (const row of all.slice(0, GRID_END)) {
    const key = `${row.settType}|${row.terrainOverride}`;
    if (seen.has(key)) continue;
    seen.add(key);
    oneEach.push(row);
  }
  return [...oneEach, ...tail];
}

/**
 * One walk of a finished record: a value-hash index and a first-occurrence name index, to
 * `INDEX_DEPTH`.
 *
 * ⭐ THE HASH INDEX ADMITS OBJECTS AND ARRAYS ONLY, AND THAT IS A FIX, NOT A PREFERENCE (chair
 * ruling Q-7). The recon's stated intent was "serialisations >= 12 bytes only, so a scalar
 * cannot match by coincidence", and a byte floor does not deliver it: `"crossroads"` serialises
 * to 12 bytes and `"mountain_pass"` to 15, so a long enum string DOES match a coincidental
 * sibling. Measured: under the bare byte floor `resolveConfig|tradeRoute` reads `varies`
 * (absent 58, same 5) because its value collided with `record.economicState.tradeAccess`;
 * objects-only makes it `absent` 63/63, which is the recon's own published verdict for that key.
 *
 * @param {Record<string, unknown>} record
 * @returns {{ byHash: Map<string, string>, byName: Map<string, string> }}
 */
function buildIndex(record) {
  /** @type {Map<string, string>} */ const byHash = new Map();
  /** @type {Map<string, string>} */ const byName = new Map();
  const visit = (node, path, depth) => {
    if (depth > INDEX_DEPTH || !isStructural(node)) return;
    for (const [key, value] of Object.entries(node)) {
      const here = `${path}.${key}`;
      if (!byName.has(key)) byName.set(key, here);
      const text = serialise(value);
      if (isStructural(value) && text.length >= HASH_FLOOR_BYTES) {
        const digest = hashOfText(text);
        if (!byHash.has(digest)) byHash.set(digest, here);
      }
      visit(value, here, depth + 1);
    }
  };
  visit(record, 'record', 0);
  return { byHash, byName };
}

/**
 * THE PER-ROW LADDER, applied identically to both comparands (EM-P2 §6.2).
 * (1) own property, value hash matches → `same` at `record.<key>`; (2) own property, hash
 * differs → `transformed` there; (3) not own, but the value is an OBJECT OR ARRAY of at least
 * `HASH_FLOOR_BYTES` whose hash is found elsewhere at depth <= `INDEX_DEPTH` → `same` at that
 * path; (4) not found by value but the KEY NAME appears elsewhere → `transformed` at its first
 * occurrence; (5) otherwise `absent`.
 *
 * @param {{ byHash: Map<string, string>, byName: Map<string, string> }} index
 * @param {Record<string, unknown>} record
 * @param {string} key
 * @param {string} valueHash
 * @param {number} valueBytes
 * @param {boolean} valueStructural
 * @returns {{ onRecord: 'absent' | 'same' | 'transformed', recordPath: string | null }}
 */
function verdictFor(index, record, key, valueHash, valueBytes, valueStructural) {
  if (key === 'settlement') return { onRecord: 'same', recordPath: 'record' };
  if (Object.prototype.hasOwnProperty.call(record, key)) {
    return hashOf(record[key]) === valueHash
      ? { onRecord: 'same', recordPath: `record.${key}` }
      : { onRecord: 'transformed', recordPath: `record.${key}` };
  }
  if (valueStructural && valueBytes >= HASH_FLOOR_BYTES) {
    const found = index.byHash.get(valueHash);
    if (found) return { onRecord: 'same', recordPath: found };
  }
  const named = index.byName.get(key);
  if (named) return { onRecord: 'transformed', recordPath: named };
  return { onRecord: 'absent', recordPath: null };
}

/** The `(step, key)` pair set, IN ORDER, derived from the live registry and nothing else. */
function pairsFromRegistry() {
  const order = getStepOrder();
  const meta = new Map(getStepMeta().map((entry) => [entry.name, entry]));
  /** @type {Array<{ step: string, key: string, via: 'provides' | 'mutates' }>} */
  const pairs = [];
  for (const step of order) {
    const entry = meta.get(step);
    const seen = new Set();
    for (const key of entry.provides) { pairs.push({ step, key, via: 'provides' }); seen.add(key); }
    for (const key of entry.mutates) if (!seen.has(key)) pairs.push({ step, key, via: 'mutates' });
  }
  return { order, meta, pairs };
}

/** The derived entropy class (§6.2): the two counts decide it, never a hand-written word. */
function classOf(stepDraws, keyMoves) {
  if (keyMoves === 0) return 'pure';
  return stepDraws > 0 ? 'drawn' : 'label';
}

/** The derived landing class (§6.2): unanimous over the sample, or `varies`. */
function landingClassOf(triple, rows) {
  if (triple.absent === rows) return 'absent';
  if (triple.same === rows) return 'same';
  if (triple.transformed === rows) return 'transformed';
  return 'varies';
}

/** The landing path seen in the most rows, and whether it was unanimous across them. */
function pathOf(paths) {
  if (paths.size === 0) return { path: null, unanimous: true };
  if (paths.size === 1) return { path: [...paths.keys()][0], unanimous: true };
  const ranked = [...paths.entries()].sort((a, b) => b[1] - a[1]);
  return { path: ranked[0][0], unanimous: false };
}

/**
 * THE CLASSIFIER — one pass that fills every Tier-1 field by EXECUTION.
 *
 * Per corpus row: ONE baseline run (which captures each step's post-step patch view at
 * `onStep` time, the finished context, and the record), then ONE perturbed run per registered
 * step. `stepDraws` counts the corpus rows in which the STEP drew at all; `keyMoves` counts the
 * rows in which THIS key's value moved under the step's perturbed stream.
 *
 * BOTH LANDING COMPARANDS are filled from the same ladder: `onRecord` places the key's FINAL
 * value against the record, `producedOnRecord` places the value THAT STEP left in the context.
 * They are different claims (design §22; chair ruling Q-6), and the register carries both.
 *
 * @param {{ corpus?: Array<Record<string, unknown>> }} [options]
 * @returns {{ rows: Array<Record<string, unknown>>, stepDrew: Map<string, number>,
 *   corpusRows: number, steps: string[], drawingSteps: string[], wallMs: number,
 *   pathDiffRows: Array<{ id: string, count: number, example: string }> }}
 */
export function classify(options = {}) {
  const corpus = options.corpus ?? censusCorpus();
  const rows = corpus.length;
  const { order, meta, pairs } = pairsFromRegistry();
  const state = new Map(pairs.map((pair) => [`${pair.step}|${pair.key}`, {
    ...pair,
    keyMoves: 0,
    runs: 0,
    fin: { absent: 0, same: 0, transformed: 0 },
    finPaths: new Map(),
    post: { absent: 0, same: 0, transformed: 0 },
    postPaths: new Map(),
    pathDiff: 0,
    pathDiffExample: '',
  }]));
  const stepDrew = new Map(order.map((step) => [step, 0]));

  const started = Date.now();
  for (const row of corpus) {
    const baseline = instrumentedRoot(row._seed);
    /** @type {Map<string, { hash: string, bytes: number, structural: boolean }>} */
    const produced = new Map();
    /** @type {Map<string, Record<string, string>>} */
    const baseSeen = new Map();
    const context = runHeadless(row, baseline.root, {
      onStep: (step, ctx) => {
        const entry = meta.get(step);
        /** @type {Record<string, string>} */
        const bag = {};
        for (const key of new Set([...entry.provides, ...entry.mutates])) {
          const present = key in ctx;
          bag[key] = present ? hashOf(ctx[key]) : ' ABSENT';
          if (present) {
            produced.set(`${step}|${key}`, {
              hash: hashOf(ctx[key]),
              bytes: serialise(ctx[key]).length,
              structural: isStructural(ctx[key]),
            });
          }
        }
        baseSeen.set(step, bag);
      },
    });
    for (const step of order) {
      if ((baseline.perStep.get(step)?.draws || 0) > 0) stepDrew.set(step, stepDrew.get(step) + 1);
    }

    const record = context.settlement;
    const index = buildIndex(record);
    for (const pair of pairs) {
      const id = `${pair.step}|${pair.key}`;
      const cell = state.get(id);
      const finalPresent = pair.key in context;
      const finalVerdict = finalPresent
        ? verdictFor(index, record, pair.key, hashOf(context[pair.key]),
          serialise(context[pair.key]).length, isStructural(context[pair.key]))
        : { onRecord: 'absent', recordPath: null };
      cell.fin[finalVerdict.onRecord] += 1;
      if (finalVerdict.recordPath) {
        cell.finPaths.set(finalVerdict.recordPath, (cell.finPaths.get(finalVerdict.recordPath) || 0) + 1);
      }
      const post = produced.get(id);
      const postVerdict = post === undefined
        ? { onRecord: 'absent', recordPath: null }
        : verdictFor(index, record, pair.key, post.hash, post.bytes, post.structural);
      cell.post[postVerdict.onRecord] += 1;
      if (postVerdict.recordPath) {
        cell.postPaths.set(postVerdict.recordPath, (cell.postPaths.get(postVerdict.recordPath) || 0) + 1);
      }
      // A null is not a landing, it is an absence the `producedOnRecord` triple already
      // reports, so only a row where BOTH comparands land can disagree about WHERE.
      if (finalVerdict.recordPath && postVerdict.recordPath
        && finalVerdict.recordPath !== postVerdict.recordPath) {
        cell.pathDiff += 1;
        if (!cell.pathDiffExample) {
          cell.pathDiffExample = `final=${finalVerdict.recordPath} post=${postVerdict.recordPath}`;
        }
      }
    }

    for (const step of order) {
      const perturbed = instrumentedRoot(row._seed, { perturbStep: step });
      /** @type {Map<string, Record<string, string>>} */
      const perSeen = new Map();
      runHeadless(row, perturbed.root, {
        onStep: (seenStep, ctx) => {
          if (seenStep !== step) return;
          const entry = meta.get(seenStep);
          /** @type {Record<string, string>} */
          const bag = {};
          for (const key of new Set([...entry.provides, ...entry.mutates])) {
            bag[key] = key in ctx ? hashOf(ctx[key]) : ' ABSENT';
          }
          perSeen.set(seenStep, bag);
        },
      });
      const entry = meta.get(step);
      for (const key of new Set([...entry.provides, ...entry.mutates])) {
        const cell = state.get(`${step}|${key}`);
        cell.runs += 1;
        if (baseSeen.get(step)[key] !== perSeen.get(step)[key]) cell.keyMoves += 1;
      }
    }
  }
  const wallMs = Date.now() - started;

  const measured = pairs.map((pair) => {
    const cell = state.get(`${pair.step}|${pair.key}`);
    const onRecordClass = landingClassOf(cell.fin, rows);
    const landing = pathOf(cell.finPaths);
    return {
      step: pair.step,
      key: pair.key,
      via: pair.via,
      stepDraws: stepDrew.get(pair.step),
      keyMoves: cell.keyMoves,
      rows,
      class: classOf(stepDrew.get(pair.step), cell.keyMoves),
      onRecord: { ...cell.fin },
      onRecordClass,
      producedOnRecord: { ...cell.post },
      producedOnRecordClass: landingClassOf(cell.post, rows),
      recordPath: onRecordClass === 'absent' ? null : landing.path,
      recordPathUnanimous: landing.unanimous,
      recordPathCounts: [...cell.finPaths.entries()],
      perturbationRuns: cell.runs,
    };
  });

  return {
    rows: measured,
    stepDrew,
    corpusRows: rows,
    steps: order,
    drawingSteps: order.filter((step) => stepDrew.get(step) > 0),
    wallMs,
    pathDiffRows: pairs
      .map((pair) => ({ pair, cell: state.get(`${pair.step}|${pair.key}`) }))
      .filter(({ cell }) => cell.pathDiff > 0)
      .map(({ pair, cell }) => ({
        id: `${pair.step}|${pair.key}`,
        count: cell.pathDiff,
        example: cell.pathDiffExample,
      })),
  };
}

/**
 * Build the FRESH literal as the exact source text of `GENERATION_TIER1`.
 *
 * ⛔ IT PRINTS AND FAILS; IT NEVER WRITES (§6.7, STOP-10). There is no `--update` flag and no
 * env-gated refreeze here: the human copies the printed literal in and re-runs, and THAT green
 * is the proof. A census that rewrites its own baseline proves nothing.
 *
 * @param {Array<Record<string, unknown>>} rows the measured rows, in registry order
 * @returns {string} the source text of the declaration, ready to paste into the leaf
 */
export function emitTier1Literal(rows) {
  const quote = (value) => (value === null ? 'null' : `'${value}'`);
  const lines = rows.map((row) => `  { step: '${row.step}', key: '${row.key}', via: '${row.via}',`
    + ` stepDraws: ${row.stepDraws}, keyMoves: ${row.keyMoves}, rows: ${row.rows},`
    + ` class: '${row.class}',`
    + ` onRecord: { absent: ${row.onRecord.absent}, same: ${row.onRecord.same},`
    + ` transformed: ${row.onRecord.transformed} }, onRecordClass: '${row.onRecordClass}',`
    + ` producedOnRecord: { absent: ${row.producedOnRecord.absent},`
    + ` same: ${row.producedOnRecord.same}, transformed: ${row.producedOnRecord.transformed} },`
    + ` producedOnRecordClass: '${row.producedOnRecordClass}',`
    + ` recordPath: ${quote(row.recordPath)} },`);
  return 'export const GENERATION_TIER1 = Object.freeze(/** @type {GenerationTier1Row[]} */ (['
    + `\n${lines.join('\n')}\n]).map(freezeRow));`;
}

/**
 * THE DECLARATION FORMS, each anchored `[ \t]*` and never `\s*`.
 *
 * ⛔ WHY NOT `\s*`. Under `/m` the `\s` class eats the preceding NEWLINES: total length is
 * preserved but line starts are destroyed, so `^`-anchored declaration matching drifts (the
 * EM-P2 v2 STOP's S5 rider, recorded against the model's own resolver, which is NOT edited).
 *
 * ⛔ `registerStep('<name>'` IS A DECLARATION FORM, and it is what makes a STEP nameable at all:
 * `assembleInstitutions` is declared nowhere as a function or a const, only as
 * `registerStep('assembleInstitutions', …)`, so the model's form set finds 0 of 22 steps.
 */
const DECL_FORMS = [
  ['function', /^[ \t]*(?:export[ \t]+)?(?:default[ \t]+)?(?:async[ \t]+)?function[ \t]*\*?[ \t]*([A-Za-z_$][\w$]*)/gm],
  ['binding', /^[ \t]*(?:export[ \t]+)?(?:const|let|var)[ \t]+([A-Za-z_$][\w$]*)[ \t]*=/gm],
  ['class', /^[ \t]*(?:export[ \t]+)?class[ \t]+([A-Za-z_$][\w$]*)/gm],
  ['registerStep', /^[ \t]*registerStep[ \t]*\([ \t]*['"`]/gm],
];

/**
 * Every symbol a file DECLARES, and how many times — the capability EM-A1 §1c.1 property 2 asked
 * for ("`symbol` must resolve against SOURCE, not exports", because `pickFirst` is module-local).
 *
 * ⚠ `codeOnly` BLANKS STRING CONTENTS, so a step's own name is gone from the blanked source.
 * OFFSETS ARE PRESERVED, so the name is read back from the RAW source at the same index: the
 * match ends on the opening quote, and the name runs to the next occurrence of that same quote
 * character. A name that is not a plain identifier is skipped. This is the one subtlety a
 * reader of this module must not lose.
 *
 * @param {string} raw the file's source text, unmodified
 * @returns {Map<string, number>} symbol -> declaration count
 */
export function declaredSymbols(raw) {
  const code = codeOnly(raw);
  /** @type {Map<string, number>} */
  const counts = new Map();
  for (const [kind, re] of DECL_FORMS) {
    re.lastIndex = 0;
    for (const match of code.matchAll(re)) {
      let name = match[1];
      if (kind === 'registerStep') {
        const quoteAt = match.index + match[0].length - 1;
        const quote = raw[quoteAt];
        const close = raw.indexOf(quote, quoteAt + 1);
        if (close < 0) continue;
        name = raw.slice(quoteAt + 1, close);
        if (!/^[A-Za-z_$][\w$]*$/.test(name)) continue;
      }
      if (!name) continue;
      counts.set(name, (counts.get(name) || 0) + 1);
    }
  }
  return counts;
}
