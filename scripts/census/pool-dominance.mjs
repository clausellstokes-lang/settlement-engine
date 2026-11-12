/**
 * scripts/census/pool-dominance.mjs — THE DOMINANCE ARM (COHERENCE-QUARREL, 2026-11-11; the
 * chair's charter `docs/chair/2026-11-11/CHARTERS-COHERENCE-2026-11-11.md` §3; its noise rule
 * POOL-GUARD, 2026-11-12, `docs/DESIGN_POOL_CENSUS.md` §6).
 *
 * THE CLASS IT GUARDS (class IV). A pool can look large in the source and still print a handful
 * of lines, because most of its lines wait behind gates that rarely open. The census measured
 * whether a line is ever REACHED; nothing measured how much of the output ONE line takes. This
 * arm measures that: for each drawn pool, over a fixed corpus, the share of its most-printed
 * line (`top1`) and of its five most-printed lines (`top5`), with names masked.
 *
 * TWO READERS, ONE TABLE.
 *   ledger  every draw the presumption ledger notes (`drawDeclared` and the kernel), keyed by the
 *           pool's own id and the line's stable id. A refused draw that printed nothing is not
 *           counted.
 *   record  three pools that print from the record and are named here by hand, because their
 *           draws did not pass through the ledger when this arm was born: the quarrels' issues,
 *           the quarrels' plot hooks and the safety record's plot hooks. Read off the printed
 *           record with the powers' names and the town's name masked.
 *
 * THE CORPUS is the configuration a real browser sends, every dial on random, at the charter's
 * sizes: 60 villages, 160 towns, 100 cities, 40 metropolises, seeds `<prefix>-<tier>-<i>`. The banked
 * prefix is `quarrel`; `--seed-prefix=<p>` runs the same guard on towns nobody tuned to.
 *
 * THE RULE. A measure that sits above its ceiling is not, by itself, a loss of variety: a lane
 * that re-deals the corpus's draws moves every share by chance. So a row reds only when
 *   (1) its share rises above its ceiling by more than `NOISE_SE` standard errors of a share AT
 *       THE CEILING over the pool's own draws — the error taken over SETTLEMENTS (the ratio
 *       estimator's cluster variance: the draws inside one town are not independent), never
 *       below the binomial error; or
 *   (2) its `top1` crosses `DOMINATED.top1` — one line printing three of every four of the pool's
 *       lines — on a pool read over at least `DOMINATED.minDraws` draws, whatever the noise.
 * A ceiling the charter set as a law for a cured pool (`targets`) is judged EXACTLY, with no
 * allowance. A ceiling is loose when its measure sits below it by more than the slack AND by more
 * than the same noise.
 *
 * THE REGISTER (`pool-dominance.register.json`) holds one row per pool: a ceiling for `top1` and
 * for `top5`, and its reason. It only TIGHTENS: `tests/lint/poolDominance.walker.test.js` reds
 * on a rise under the rule, when a drawn pool has no row, when a row's pool is no longer drawn,
 * and when a ceiling is loose. Under a foreign `--seed-prefix` the row-set checks are notes, not
 * findings: which one-draw pools a corpus happens to reach is itself chance.
 *
 * Usage (read-only unless `--tighten`):
 *   node scripts/census/pool-dominance.mjs                  print the findings, then the worst twenty
 *   node scripts/census/pool-dominance.mjs --seed-prefix=p  the same, on the corpus re-seeded with prefix p
 *   node scripts/census/pool-dominance.mjs --tighten        lower every ceiling to today's measure (never raise one),
 *                                                           drop the rows of pools no longer drawn, bank new pools
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';

export const REGISTER_PATH = fileURLToPath(new URL('./pool-dominance.register.json', import.meta.url));

/** How far a ceiling may sit above its measure before the register must be tightened. */
export const TIGHTEN_SLACK = 0.02;

/** How many standard errors of a share a measure may sit above its ceiling by chance. */
export const NOISE_SE = 3;

/** The line that means "this pool is dominated", read only where the corpus can read it. */
export const DOMINATED = Object.freeze({ top1: 0.75, minDraws: 30 });

/** The banked corpus's seed prefix. */
export const DEFAULT_SEED_PREFIX = 'quarrel';

/** The charter's corpus sizes, by tier. */
export const CORPUS_PLAN = Object.freeze([['village', 60], ['town', 160], ['city', 100], ['metropolis', 40]]);

/** The configuration a real browser sends: every dial on random (the charter §0.4). */
export const BROWSER_CONFIG = Object.freeze({
  tradeRouteAccess: 'random_trade',
  culture: 'random_culture',
  monsterThreat: 'random_threat',
  nearbyResourcesRandom: true,
  selectedStressesRandom: true,
  _randomizePriorities: true,
  magicExists: true,
  contentProfile: 'grounded',
});

/**
 * @param {string} [prefix]
 * @returns {Array<{ tier: string, seed: string, config: Record<string, unknown> }>} the corpus, in a fixed order
 */
export function corpusSeeds(prefix = DEFAULT_SEED_PREFIX) {
  return CORPUS_PLAN.flatMap(([tier, n]) => Array.from({ length: n }, (_, i) => ({ tier, seed: `${prefix}-${tier}-${i}`, config: BROWSER_CONFIG })));
}

/** @param {string} text @param {string[]} names @returns {string} the text with each name masked */
export function maskNames(text, names) {
  let out = String(text);
  for (const name of [...names].filter(Boolean).sort((a, b) => b.length - a.length)) out = out.split(name).join('<NAME>');
  return out;
}

/** @param {Map<string, Map<string, number>>} pools @param {string} pool @param {string} line */
function count(pools, pool, line) {
  const lines = pools.get(pool) || new Map();
  lines.set(line, (lines.get(line) || 0) + 1);
  pools.set(pool, lines);
}

/**
 * The record pools, read off one printed settlement.
 * @param {Record<string, any>} s @param {Map<string, Map<string, number>>} pools
 */
function readRecordPools(s, pools) {
  const powerNames = (s.powerStructure?.factions || []).map((f) => f?.faction || f?.name).filter((n) => typeof n === 'string');
  const names = [s.name, ...powerNames].filter((n) => typeof n === 'string' && n !== '');
  for (const conflict of s.conflicts || []) {
    if (typeof conflict?.issue === 'string') count(pools, 'record:conflicts.issue', conflict.issue);
    for (const hook of conflict?.plotHooks || []) {
      if (typeof hook === 'string') count(pools, 'record:conflicts.plotHooks', maskNames(hook, [...names, ...(conflict.parties || [])]));
    }
  }
  for (const hook of s.economicState?.safetyProfile?.plotHooks || []) {
    if (typeof hook === 'string') count(pools, 'record:safetyProfile.plotHooks', maskNames(hook, names));
  }
}

/**
 * The sums a share's error over settlements needs: for the share's lines, per settlement i, the
 * count x_i of those lines and the pool's draws n_i there.
 * @typedef {{ xx: number, xn: number, nn: number }} Spread
 */

/**
 * @typedef {{ draws: number, towns: number, lines: number, top1: number, top5: number,
 *   spread: { top1: Spread, top5: Spread } }} PoolMeasure
 */

/**
 * Generate the corpus and measure every drawn pool.
 * @param {{ seedPrefix?: string }} [options]
 * @returns {Map<string, PoolMeasure>}
 */
export function measureDominance({ seedPrefix = DEFAULT_SEED_PREFIX } = {}) {
  /** @type {Map<string, Map<string, number>>} every pool's lines over the corpus */
  const pools = new Map();
  /** @type {Map<string, Array<Map<string, number>>>} every pool's lines, one map per settlement that drew it */
  const perTown = new Map();
  for (const { tier, seed, config } of corpusSeeds(seedPrefix)) {
    const { result: s, ledger } = withPresumptionLedger(() => generateSettlementPipeline({ settType: tier, ...config }, null, { seed }));
    const powerNames = (s.powerStructure?.factions || []).map((f) => f?.faction || f?.name).filter((n) => typeof n === 'string');
    const names = [s.name, ...powerNames].filter((n) => typeof n === 'string' && n !== '');
    /** @type {Map<string, Map<string, number>>} */
    const town = new Map();
    for (const entry of ledger) {
      if (entry.resolvedBy === 'none') continue;
      count(town, `ledger:${entry.pool}`, maskNames(String(entry.lineId), names));
    }
    readRecordPools(s, town);
    for (const [pool, lines] of town) {
      const all = pools.get(pool) || new Map();
      for (const [line, n] of lines) all.set(line, (all.get(line) || 0) + n);
      pools.set(pool, all);
      const list = perTown.get(pool) || [];
      list.push(lines);
      perTown.set(pool, list);
    }
  }
  /** @type {Map<string, PoolMeasure>} */
  const table = new Map();
  for (const [pool, lines] of [...pools].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
    const ranked = [...lines].sort(([la, a], [lb, b]) => b - a || (la < lb ? -1 : la > lb ? 1 : 0));
    const draws = ranked.reduce((sum, [, n]) => sum + n, 0);
    const towns = perTown.get(pool) || [];
    /** @param {string[]} chosen @returns {Spread} */
    const spreadOf = (chosen) => {
      const spread = { xx: 0, xn: 0, nn: 0 };
      for (const town of towns) {
        let x = 0, n = 0;
        for (const [line, c] of town) { n += c; if (chosen.includes(line)) x += c; }
        spread.xx += x * x; spread.xn += x * n; spread.nn += n * n;
      }
      return spread;
    };
    table.set(pool, {
      draws,
      towns: towns.length,
      lines: ranked.length,
      top1: ranked[0][1] / draws,
      top5: ranked.slice(0, 5).reduce((sum, [, n]) => sum + n, 0) / draws,
      spread: { top1: spreadOf(ranked.slice(0, 1).map(([l]) => l)), top5: spreadOf(ranked.slice(0, 5).map(([l]) => l)) },
    });
  }
  return table;
}

/**
 * The standard error of a pool's share at a ceiling: over settlements (the ratio estimator's
 * cluster variance, the sum over towns of (x_i - c n_i)^2), never below the binomial error over draws.
 * @param {Pick<PoolMeasure, 'draws' | 'towns' | 'spread'>} m @param {'top1' | 'top5'} metric @param {number} ceiling
 * @returns {number}
 */
export function shareError(m, metric, ceiling) {
  const binomial = Math.sqrt(Math.max(ceiling * (1 - ceiling), 0) / m.draws);
  if (m.towns < 2) return binomial;
  const { xx, xn, nn } = m.spread[metric];
  const ss = Math.max(xx - 2 * ceiling * xn + ceiling * ceiling * nn, 0);
  return Math.max(binomial, Math.sqrt((m.towns / (m.towns - 1)) * ss) / m.draws);
}

/** @param {number} share @returns {number} the share rounded UP to four places, so a ceiling never sits below its measure */
export const ceil4 = (share) => Math.ceil(share * 10000 - 1e-9) / 10000;

/** @returns {{ pools: Record<string, { top1: number, top5: number, reason: string, targets?: string[] }> }} */
export function readRegister() {
  return JSON.parse(readFileSync(REGISTER_PATH, 'utf8'));
}

/**
 * The register's findings against a measure: each one a line a reader can act on.
 * @param {Map<string, Pick<PoolMeasure, 'draws' | 'towns' | 'top1' | 'top5' | 'spread'>>} table
 * @param {ReturnType<typeof readRegister>} register
 * @param {{ exact?: boolean }} [options] `exact: false` (a foreign seed prefix) turns the row-set checks into notes
 * @returns {{ over: string[], unregistered: string[], stale: string[], loose: string[], notes: string[] }}
 */
export function judge(table, register, { exact = true } = {}) {
  const rows = register.pools || {};
  const over = [], unregistered = [], stale = [], loose = [], notes = [];
  for (const [pool, m] of table) {
    const row = rows[pool];
    if (!row) {
      if (exact) unregistered.push(pool);
      else notes.push(`${pool}: no row (${m.draws} draws)`);
      continue;
    }
    const targets = Array.isArray(row.targets) ? row.targets : [];
    for (const metric of /** @type {const} */ (['top1', 'top5'])) {
      const ceiling = row[metric], share = m[metric];
      const se = shareError(m, metric, ceiling);
      // A target is a law, judged exactly. Every other ceiling allows the pool's own noise.
      const allowance = targets.includes(metric) ? 0 : NOISE_SE * se;
      const beyondNoise = share > ceiling + allowance + 1e-9;
      const dominated = metric === 'top1' && m.draws >= DOMINATED.minDraws && ceiling < DOMINATED.top1 && share >= DOMINATED.top1;
      if (share > ceiling + 1e-9 && (beyondNoise || dominated)) {
        const why = beyondNoise
          ? `${se > 0 ? ((share - ceiling) / se).toFixed(1) : 'inf'} SE over ${m.draws} draws in ${m.towns} towns`
          : `crosses the dominated line ${DOMINATED.top1} over ${m.draws} draws`;
        over.push(`${pool}: ${metric} ${share.toFixed(4)} > ceiling ${ceiling} (${why})`);
      }
      if (!targets.includes(metric) && ceiling - share > TIGHTEN_SLACK && ceiling - share > NOISE_SE * se) {
        loose.push(`${pool}: ${metric} ceiling ${ceiling} sits above its measure ${share.toFixed(4)}`);
      }
    }
  }
  for (const pool of Object.keys(rows)) {
    if (table.has(pool)) continue;
    if (exact) stale.push(pool);
    else notes.push(`${pool}: not drawn`);
  }
  return { over, unregistered, stale, loose, notes };
}

const BANKED_REASON = 'banked at the 2026-11-11 measure (99bcc6944): not a pool COHERENCE-QUARREL cures';

/** @param {string[]} argv @returns {string | undefined} */
function seedPrefixArg(argv) {
  const arg = argv.find((a) => a.startsWith('--seed-prefix='));
  return arg ? arg.slice('--seed-prefix='.length) : undefined;
}

function main() {
  const seedPrefix = seedPrefixArg(process.argv) || DEFAULT_SEED_PREFIX;
  const exact = seedPrefix === DEFAULT_SEED_PREFIX;
  if (process.argv.includes('--tighten') && !exact) throw new Error('pool-dominance: --tighten reads the banked corpus only; drop --seed-prefix');
  const table = measureDominance({ seedPrefix });
  if (process.argv.includes('--tighten')) {
    const register = readRegister();
    const rows = register.pools || {};
    /** @type {Record<string, { top1: number, top5: number, reason: string, targets?: string[] }>} */
    const next = {};
    for (const [pool, m] of table) {
      const row = rows[pool];
      next[pool] = row
        ? {
          ...row,
          top1: row.targets?.includes('top1') ? row.top1 : Math.min(row.top1, ceil4(m.top1)),
          top5: row.targets?.includes('top5') ? row.top5 : Math.min(row.top5, ceil4(m.top5)),
        }
        : { top1: ceil4(m.top1), top5: ceil4(m.top5), reason: BANKED_REASON };
    }
    writeFileSync(REGISTER_PATH, `${JSON.stringify({ ...register, pools: next }, null, 2)}\n`);
    console.log(`pool-dominance: ${table.size} pools written`);
    return;
  }
  const { over, unregistered, stale, loose, notes } = judge(table, readRegister(), { exact });
  for (const line of [...over, ...unregistered.map((p) => `${p}: no row`), ...stale.map((p) => `${p}: no longer drawn`), ...loose]) console.log(line);
  for (const line of notes) console.log(`note: ${line}`);
  const worst = [...table].sort(([, a], [, b]) => b.top1 - a.top1 || b.draws - a.draws).filter(([, m]) => m.lines > 1).slice(0, 20);
  for (const [pool, m] of worst) console.log(`${(m.top1 * 100).toFixed(1)}% / ${(m.top5 * 100).toFixed(1)}%  ${m.draws} draws, ${m.lines} lines  ${pool}`);
  console.log(`pool-dominance: corpus ${seedPrefix} (${table.size} pools): ${over.length} over, ${unregistered.length} unregistered, ${stale.length} stale, ${loose.length} loose, ${notes.length} notes`);
  process.exitCode = over.length || unregistered.length || stale.length || loose.length ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
