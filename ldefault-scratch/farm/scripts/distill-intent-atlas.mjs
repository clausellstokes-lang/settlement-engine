#!/usr/bin/env node
/**
 * distill-intent-atlas.mjs — THE SOAK PRIOR distiller for the AI intent atlas
 * (docs/DESIGN_AI_INTENT_ATLAS.md §7 and §8; owner ruling 2026-07-27, wave L-8a).
 *
 * WHY THIS EXISTS. The atlas was specified as an aggregate picture of how USERS build, and
 * that corpus does not exist yet: migration 134 is written and undeployed, so there are zero
 * telemetry rows to distil. The owner ruled that until user telemetry clears the statistical
 * threshold the atlas ships a PREMADE PRIOR derived from generated-world data, for the AI's
 * purposes only. This script produces that prior. Every cell it emits carries
 * `source: 'soak'`, is weight-capped at SOAK_WEIGHT_CAP so it can never outshout an observed
 * cell, and is retired outright by the supersession law the moment a users-cell names the same
 * key (src/domain/intentAtlas.js).
 *
 * WHAT IT MEASURES, AND WHY THESE FOUR DIMENSION FAMILIES. The atlas serves the walled
 * Surveyor surfaces where intent inference happens. A prior distilled from generated worlds
 * can only honestly answer questions ABOUT GENERATED WORLDS, so every dimension pairs a
 * REGISTERED CONFIG KEY the construction clerk may actually emit against something the
 * deterministic pipeline PRODUCES from it. Config-against-config would be circular (the pairing
 * would encode this script's own sampling grid and nothing else); output-against-output would
 * not be actionable, because no clerk can set an output.
 *
 *   surface `construct` (3 families) — the construct clerk compiles intent into generator
 *   config PLUS the coarse constraint bands it declares the result should satisfy, and
 *   intentComparator.js judges the result by exactly
 *   `coarseBand(deriveSystemState(settlement)[dimension].value)`. This script computes the
 *   coBucket with that same call, so a line here is a statement in the clerk's own constraint
 *   vocabulary about the comparator's own verdict:
 *     `settType.<axis>`       bucket ∈ SETT_TYPES minus the two resolver sentinels
 *     `tradeRoute.<axis>`     bucket ∈ the six routes the wizard offers
 *     `monsterThreat.<axis>`  bucket ∈ MONSTER_THREAT_TIERS
 *   where <axis> ranges over CONSTRAINT_DIMENSIONS and the coBucket over CONSTRAINT_BANDS.
 *
 *   surface `customContent` (1 family) — the custom-content clerk files a described
 *   institution onto a REGISTERED SHELF (institution.category, the INSTITUTION_GROUPINGS axis
 *   of data/categoryVocabulary.js). `settType.institutionShelf` reports which shelves a
 *   generated settlement of each tier actually carries, so a clerk filing "a smugglers' den in
 *   a thorp" knows the engine rarely builds that shelf at that tier and can say so instead of
 *   filing silently.
 *
 * SURFACES THE PRIOR DELIBERATELY LEAVES SILENT. `interpret` compiles table events into
 * session ops and `autonomy` composes stop conditions over live simulation signals. A corpus of
 * freshly generated settlements contains no session and no advance, so it holds no evidence
 * about either. Emitting cells there would mean inventing a pairing to fill a slot, and the
 * module's own rendered text promises that absence carries no information. Those two surfaces
 * therefore render the empty string exactly as they did before this script existed.
 *
 * CONFIG KEYS DELIBERATELY EXCLUDED AS DIMENSIONS. `contentProfile` is VARIED across the
 * corpus (so the prior is not silently specific to `grounded`) but is not tested as a
 * dimension: its registered effect is on content boundaries rather than on the four constraint
 * axes, and every untested pairing keeps the false-discovery denominator honest for the
 * pairings that are tested. `population` is left unset so the tier drives it. `magicExists`
 * stays at its DEFAULT_CONFIG value, keeping the design to three crossed factors.
 *
 * THE STATISTIC (design §7, unchanged). For a candidate cell, over W worlds:
 *   a = worlds with bucket AND coBucket, b = bucket without, c = coBucket without, d = neither
 *   effect = phi = (ad - bc) / sqrt((a+b)(c+d)(a+c)(b+d))
 *   n      = a + b, the worlds exhibiting the pair's BASE CONDITION (the bucket)
 *   chi2   = W * phi^2 (one degree of freedom), p = erfc(|phi| * sqrt(W/2))
 * then Benjamini-Hochberg across ALL tested cells of the run, and
 *   weight = 1 - (q / FDR_Q) * (1 - WEIGHT_FLOOR), clamped to [WEIGHT_FLOOR, 1], 2dp,
 *            then capped at SOAK_WEIGHT_CAP.
 * A cell whose base n is below MIN_N is not tested AT ALL rather than tested and dropped:
 * including it would inflate the correction's denominator and weaken every cell that was
 * genuinely in contention. A cell whose 2x2 table has a zero margin (a bucket or a coBucket
 * that every world exhibits, or none does) has no defined phi and is recorded as untestable.
 *
 * WHY 400 SEEDS. The design is three crossed factors drawn independently per world from a
 * seeded PRNG. At 400 worlds the smallest factor level (one of six settlement tiers, one of six
 * routes) draws roughly 67 worlds, comfortably above the MIN_N floor of 30 with room for the
 * draw to be uneven; the smallest cell base condition never approached the floor in practice.
 * It is also small enough to re-run in well under a minute, which matters more than it sounds:
 * a prior nobody can cheaply reproduce is a prior nobody will check. Raise it with --seeds.
 *
 * DETERMINISM IS THE CONTRACT. Seeded PRNG only, no Date.now, no Math.random, no wall-clock
 * anywhere in the artifact (which is also the id-free posture: the design forbids timestamps
 * finer than a week, and the simplest way to obey that is to carry none). Two runs of this
 * script over the same inputs produce byte-identical output, and tests/domain/intentAtlasSoakDistiller.test.js
 * proves it.
 *
 * THE JSON IMPORT SHIM. src/domain/intentAtlas.js imports its distillate with the repo's bare
 * `from './data/....json'` convention, which Vite resolves and plain Node does not. Rather than
 * fork the constants into this script (three opinions about one floor is precisely the failure
 * the module's docblock warns about) or change the module's import shape (a build-time risk for
 * a script-time problem), this script registers a synchronous module hook that loads .json the
 * way the bundler does, and then imports the REAL module. The floors this script applies are
 * therefore the same objects the gate pins and the renderer belts.
 *
 * USAGE
 *   node scripts/distill-intent-atlas.mjs                      # 400 seeds, write the artifact
 *   node scripts/distill-intent-atlas.mjs --seeds 800
 *   node scripts/distill-intent-atlas.mjs --out /tmp/a.json    # write elsewhere (determinism runs)
 *   node scripts/distill-intent-atlas.mjs --stdout             # print, write nothing
 *   node scripts/distill-intent-atlas.mjs --corpus <file.json> # distil a recorded corpus
 *
 * --corpus IS THE FORWARD PATH, and it is implemented rather than stubbed. It reads
 * `{ label, generatorVersion, observations: [...] }`, where each observation is one world in
 * the same shape this script's own extractor produces, and runs the identical statistics over
 * it. When the formal soak lane starts emitting per-world observation receipts, or when
 * migration 134's rollups arrive and are reshaped into observations, this script distils them
 * without a rewrite: only the tag on the resulting cells has to change, and that change is one
 * constant.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerHooks } from 'node:module';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');

// ── the JSON import shim (see the docblock) ──────────────────────────────────
registerHooks({
  load(url, context, nextLoad) {
    if (url.startsWith('file:') && url.endsWith('.json')) {
      const text = readFileSync(fileURLToPath(url), 'utf8');
      return { format: 'module', source: `export default ${text};`, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});

// Every src import is DYNAMIC on purpose: a static import is evaluated before this module's
// body runs, which would be before the hook above is registered.
const src = (rel) => import(new URL(`../src/${rel}`, import.meta.url).href);

const {
  EVIDENCE_FLOOR, SOAK_WEIGHT_CAP, ATLAS_SURFACES,
} = await src('domain/intentAtlas.js');
const {
  SETT_TYPES, CONSTRAINT_DIMENSIONS, CONSTRAINT_BANDS, CONSTRUCT_CONTENT_PROFILES, coarseBand,
} = await src('domain/construct/configVocabulary.js');
const { INSTITUTION_GROUPINGS } = await src('data/categoryVocabulary.js');
const { MONSTER_THREAT_TIERS } = await src('data/monsterThreat.js');
const { createPRNG } = await src('kernel/prng.js');
const { generateSettlementPipeline } = await src('generators/generateSettlementPipeline.js');
const { deriveSystemState } = await src('domain/state/deriveSystemState.js');

// ── CLI ──────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const arg = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] != null ? argv[i + 1] : dflt;
};
const SEED_COUNT = Math.max(1, Number(arg('seeds', 400)));
const SEED_PREFIX = String(arg('seed-prefix', 'atlas-soak'));
const CORPUS = String(arg('corpus', ''));
const OUT = String(arg('out', join(ROOT, 'src/domain/data/intentAtlas.distillate.json')));
const TO_STDOUT = argv.includes('--stdout');
const QUIET = argv.includes('--quiet') || TO_STDOUT;

/** The atlasVersion this distiller stamps. Moves with the DATA, not the section format. */
const ATLAS_VERSION = '0.2.0';
/** The tag every cell this script emits carries. One constant, per the --corpus note above. */
const CELL_SOURCE = 'soak';

/**
 * The two SETT_TYPES entries that are resolver sentinels rather than settlement tiers. Named
 * here rather than sliced positionally, so a vocabulary that grows a tier keeps working and a
 * vocabulary that grows a sentinel fails loudly instead of silently sampling it.
 */
const SETT_TYPE_SENTINELS = new Set(['random', 'custom']);
const SETT_TIERS = SETT_TYPES.filter((t) => !SETT_TYPE_SENTINELS.has(t));

/**
 * The trade routes the wizard offers (src/components/ConfigurationPanel.jsx, the Trade Route
 * select), minus the `random_trade` sentinel. THIS IS THE ONE HAND-SPELLED VOCABULARY in the
 * design, and it is spelled here only because tradeRouteAccess has no exported vocabulary
 * anywhere in src: the construct wall types it as a bounded string, and the wizard's option
 * list is the whole of the user-reachable set. The list is not trusted on faith — the run
 * asserts that every drawn route survives resolveConfig unchanged into
 * `settlement.config.tradeRouteAccess`, so a route this list invents, or one the pipeline
 * rewrites, fails the run rather than quietly producing cells about a value nobody can request.
 */
const TRADE_ROUTES = ['crossroads', 'isolated', 'mountain_pass', 'port', 'river', 'road'];

// ── statistics ───────────────────────────────────────────────────────────────

/**
 * The complementary error function, Abramowitz and Stegun 7.1.26 (public domain), maximum
 * absolute error 1.5e-7. That bound is far below anything this run can act on: every weight
 * decision happens in the q band between roughly 0.017 and FDR_Q, where 1.5e-7 cannot move a
 * two-decimal weight, and a p-value small enough for the approximation's error to dominate it
 * is a cell whose weight saturates at 1 and is then capped anyway.
 * @param {number} x @returns {number}
 */
function erfc(x) {
  const z = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * z);
  const poly = ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t
    + 0.254829592) * t;
  const erf = 1 - poly * Math.exp(-z * z);
  const signed = x >= 0 ? erf : -erf;
  return Math.min(1, Math.max(0, 1 - signed));
}

/**
 * One candidate cell's 2x2 association over the corpus.
 * @param {number} a both @param {number} b bucket only
 * @param {number} c coBucket only @param {number} d neither
 * @returns {{ n: number, phi: number, p: number }|null} null when phi is undefined
 */
function associate(a, b, c, d) {
  const w = a + b + c + d;
  const denomSq = (a + b) * (c + d) * (a + c) * (b + d);
  if (w === 0 || denomSq === 0) return null;
  const phi = (a * d - b * c) / Math.sqrt(denomSq);
  const bounded = Math.min(1, Math.max(-1, phi));
  return { n: a + b, phi: bounded, p: erfc(Math.abs(bounded) * Math.sqrt(w / 2)) };
}

/**
 * Benjamini-Hochberg step-up. Returns q per input index, in input order.
 * @param {readonly number[]} pValues @returns {number[]}
 */
function benjaminiHochberg(pValues) {
  const m = pValues.length;
  const order = pValues.map((p, i) => ({ p, i })).sort((x, y) => (x.p - y.p) || (x.i - y.i));
  const q = new Array(m).fill(1);
  let running = 1;
  for (let rank = m; rank >= 1; rank -= 1) {
    const { p, i } = order[rank - 1];
    running = Math.min(running, (p * m) / rank);
    q[i] = Math.min(1, Math.max(0, running));
  }
  return q;
}

/**
 * The design's weight convention, then the prior's ceiling.
 * @param {number} q @returns {number}
 */
function weightFor(q) {
  const raw = 1 - (q / EVIDENCE_FLOOR.FDR_Q) * (1 - EVIDENCE_FLOOR.WEIGHT_FLOOR);
  const clamped = Math.min(1, Math.max(EVIDENCE_FLOOR.WEIGHT_FLOOR, raw));
  return Math.min(SOAK_WEIGHT_CAP, Number(clamped.toFixed(2)));
}

/** Two decimals as a NUMBER, so the artifact never carries float noise. */
const round2 = (x) => Number(Number(x).toFixed(2));

// ── the corpus ───────────────────────────────────────────────────────────────

/**
 * One world reduced to the facts the statistics read. Deliberately small and JSON-shaped: this
 * is exactly what --corpus consumes, so the recorded and the generated paths cannot diverge.
 * @typedef {{ settType: string, tradeRoute: string, monsterThreat: string,
 *             contentProfile: string,
 *             bands: Record<string, string>, shelves: string[] }} Observation
 */

/**
 * Generate the corpus by running the REAL settlement pipeline once per seed.
 *
 * The pipeline entry is the one the product calls (generateSettlementPipeline, options THIRD),
 * with an explicit empty customContent blob so the run is headless and independent of any app
 * state. Config factors are drawn independently per world from one seeded PRNG, which keeps the
 * three factors uncorrelated by construction: a modular rotation over factor lists whose
 * lengths share a divisor would make one factor a function of another and manufacture
 * associations that are artefacts of the sampler.
 * @param {number} count @returns {{ observations: Observation[], generatorVersion: string }}
 */
function generateCorpus(count) {
  const design = createPRNG(`${SEED_PREFIX}-design`);
  /** @type {Observation[]} */
  const observations = [];
  /** @type {Set<string>} */
  const versions = new Set();

  for (let i = 0; i < count; i += 1) {
    const settType = design.pick([...SETT_TIERS]);
    const tradeRouteAccess = design.pick([...TRADE_ROUTES]);
    const monsterThreat = design.pick([...MONSTER_THREAT_TIERS]);
    const contentProfile = design.pick([...CONSTRUCT_CONTENT_PROFILES]);

    const settlement = generateSettlementPipeline(
      { settType, tradeRouteAccess, monsterThreat, contentProfile },
      null,
      { seed: `${SEED_PREFIX}-${i}`, customContent: {} },
    );

    // THE FIDELITY ASSERTIONS. Every bucket this script reports must be the value the pipeline
    // actually ran with, not the value this script asked for. A silently rewritten tier or
    // route would turn every cell about it into a claim about a world that was never built.
    if (settlement.tier !== settType) {
      throw new Error(`[distill-intent-atlas] seed ${i}: requested settType "${settType}" but the pipeline resolved tier "${settlement.tier}"`);
    }
    const resolvedRoute = settlement.config?.tradeRouteAccess;
    if (resolvedRoute !== tradeRouteAccess) {
      throw new Error(`[distill-intent-atlas] seed ${i}: requested route "${tradeRouteAccess}" but the pipeline resolved "${resolvedRoute}"`);
    }
    const resolvedThreat = settlement.config?.monsterThreat;
    if (resolvedThreat !== monsterThreat) {
      throw new Error(`[distill-intent-atlas] seed ${i}: requested threat "${monsterThreat}" but the pipeline resolved "${resolvedThreat}"`);
    }
    versions.add(String(settlement.generatorVersion || 'unknown'));

    const state = deriveSystemState(settlement);
    /** @type {Record<string, string>} */
    const bands = {};
    for (const axis of CONSTRAINT_DIMENSIONS) {
      // The comparator's own call, so a line in this artifact is a claim about the verdict the
      // construct surface will actually report back to the user.
      bands[axis] = coarseBand(Number(state[axis]?.value));
    }

    const shelves = [...new Set(
      (settlement.institutions || [])
        .map((inst) => inst && inst.category)
        .filter((cat) => INSTITUTION_GROUPINGS.includes(cat)),
    )].sort();

    observations.push({
      settType, tradeRoute: tradeRouteAccess, monsterThreat, contentProfile, bands, shelves,
    });
    if (!QUIET && (i + 1) % 50 === 0) process.stderr.write(`  ${i + 1}/${count} worlds\n`);
  }

  if (versions.size !== 1) {
    throw new Error(`[distill-intent-atlas] the corpus spans more than one generatorVersion: ${[...versions].sort().join(', ')}`);
  }
  return { observations, generatorVersion: [...versions][0] };
}

/**
 * Load a recorded corpus instead of generating one (--corpus).
 * @param {string} path @returns {{ observations: Observation[], generatorVersion: string, label: string }}
 */
function loadCorpus(path) {
  const parsed = JSON.parse(readFileSync(path, 'utf8'));
  const observations = Array.isArray(parsed.observations) ? parsed.observations : null;
  if (!observations || observations.length === 0) {
    throw new Error(`[distill-intent-atlas] --corpus ${path} holds no observations array`);
  }
  return {
    observations,
    generatorVersion: String(parsed.generatorVersion || 'unknown'),
    label: String(parsed.label || 'recorded-corpus'),
  };
}

// ── the candidate cells ──────────────────────────────────────────────────────

/**
 * Every pairing the run tests, as pure predicates over an observation. Adding a family is
 * adding an entry here; nothing downstream knows what a family means.
 * @param {readonly Observation[]} worlds
 * @returns {Array<{ surface: string, dimension: string, bucket: string, coBucket: string,
 *                   left: (o: Observation) => boolean, right: (o: Observation) => boolean }>}
 */
function candidates() {
  /** @type {Array<{ surface: string, dimension: string, bucket: string, coBucket: string, left: (o: Observation) => boolean, right: (o: Observation) => boolean }>} */
  const out = [];

  /** The three construct-config factors, each crossed with every constraint axis and band. */
  const FACTORS = [
    { dimension: 'settType', values: SETT_TIERS, read: (/** @type {Observation} */ o) => o.settType },
    { dimension: 'tradeRoute', values: TRADE_ROUTES, read: (/** @type {Observation} */ o) => o.tradeRoute },
    { dimension: 'monsterThreat', values: [...MONSTER_THREAT_TIERS], read: (/** @type {Observation} */ o) => o.monsterThreat },
  ];

  for (const factor of FACTORS) {
    for (const axis of CONSTRAINT_DIMENSIONS) {
      for (const bucket of factor.values) {
        for (const band of CONSTRAINT_BANDS) {
          out.push({
            surface: 'construct',
            dimension: `${factor.dimension}.${axis}`,
            bucket,
            coBucket: band,
            left: (o) => factor.read(o) === bucket,
            right: (o) => o.bands[axis] === band,
          });
        }
      }
    }
  }

  for (const bucket of SETT_TIERS) {
    for (const shelf of INSTITUTION_GROUPINGS) {
      out.push({
        surface: 'customContent',
        dimension: 'settType.institutionShelf',
        bucket,
        coBucket: shelf,
        left: (o) => o.settType === bucket,
        right: (o) => Array.isArray(o.shelves) && o.shelves.includes(shelf),
      });
    }
  }

  return out;
}

// ── the distillation ─────────────────────────────────────────────────────────

/**
 * @param {readonly Observation[]} worlds
 * @returns {{ cells: object[], tested: number, untestable: number, underSampled: number }}
 */
function distil(worlds) {
  const specs = candidates();
  /** @type {Array<{ spec: object, n: number, phi: number, p: number }>} */
  const tested = [];
  let untestable = 0;
  let underSampled = 0;

  for (const spec of specs) {
    let a = 0; let b = 0; let c = 0; let d = 0;
    for (const o of worlds) {
      const l = spec.left(o);
      const r = spec.right(o);
      if (l && r) a += 1;
      else if (l) b += 1;
      else if (r) c += 1;
      else d += 1;
    }
    // MIN_N is a precondition for TESTING, not a post-hoc filter: a cell whose base condition
    // is under-sampled contributes nothing but a larger correction denominator.
    if (a + b < EVIDENCE_FLOOR.MIN_N) { underSampled += 1; continue; }
    const stat = associate(a, b, c, d);
    if (!stat) { untestable += 1; continue; }
    tested.push({ spec, ...stat });
  }

  const qs = benjaminiHochberg(tested.map((t) => t.p));
  const cells = [];
  tested.forEach((t, i) => {
    if (qs[i] > EVIDENCE_FLOOR.FDR_Q) return;
    const weight = weightFor(qs[i]);
    if (weight < EVIDENCE_FLOOR.WEIGHT_FLOOR) return;
    const spec = /** @type {{ surface: string, dimension: string, bucket: string, coBucket: string }} */ (t.spec);
    cells.push({
      surface: spec.surface,
      dimension: spec.dimension,
      bucket: spec.bucket,
      coBucket: spec.coBucket,
      n: t.n,
      effect: round2(t.phi),
      weight,
      source: CELL_SOURCE,
    });
  });

  cells.sort((x, y) => (
    (x.surface < y.surface ? -1 : x.surface > y.surface ? 1 : 0)
    || (x.dimension < y.dimension ? -1 : x.dimension > y.dimension ? 1 : 0)
    || (x.bucket < y.bucket ? -1 : x.bucket > y.bucket ? 1 : 0)
    || (x.coBucket < y.coBucket ? -1 : x.coBucket > y.coBucket ? 1 : 0)
  ));

  return { cells, tested: tested.length, untestable, underSampled };
}

// ── run ──────────────────────────────────────────────────────────────────────

const corpus = CORPUS
  ? loadCorpus(resolve(CORPUS))
  : { ...generateCorpus(SEED_COUNT), label: 'soak-prior' };

const { cells, tested, untestable, underSampled } = distil(corpus.observations);

const artifact = {
  atlasVersion: ATLAS_VERSION,
  generatedFrom: {
    kind: CORPUS ? 'soak-corpus' : 'soak-prior',
    label: corpus.label,
    seedCount: corpus.observations.length,
    seedPrefix: CORPUS ? null : SEED_PREFIX,
    generatorVersion: corpus.generatorVersion,
  },
  evidence: {
    fdrQ: EVIDENCE_FLOOR.FDR_Q,
    minN: EVIDENCE_FLOOR.MIN_N,
    weightFloor: EVIDENCE_FLOOR.WEIGHT_FLOOR,
    soakWeightCap: SOAK_WEIGHT_CAP,
    cellsTested: tested,
    cellsKept: cells.length,
    cellsUntestable: untestable,
    cellsUnderSampled: underSampled,
  },
  cells,
};

const json = `${JSON.stringify(artifact, null, 2)}\n`;

if (TO_STDOUT) {
  process.stdout.write(json);
} else {
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, json);
  const perSurface = ATLAS_SURFACES
    .map((s) => `${s}=${cells.filter((c) => c.surface === s).length}`)
    .join(' ');
  process.stderr.write(
    `# intent-atlas soak prior\n`
    + `  worlds ${corpus.observations.length} (generatorVersion ${corpus.generatorVersion})\n`
    + `  tested ${tested}, kept ${cells.length}, untestable ${untestable}, under-sampled ${underSampled}\n`
    + `  cells per surface: ${perSurface}\n`
    + `  wrote ${OUT}\n`,
  );
}
