/**
 * scripts/census/pool-dominance.mjs — THE DOMINANCE ARM (COHERENCE-QUARREL, 2026-11-11; the
 * chair's charter `docs/chair/2026-11-11/CHARTERS-COHERENCE-2026-11-11.md` §3).
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
 * sizes: 60 villages, 160 towns, 100 cities, 40 metropolises, seeds `quarrel-<tier>-<i>`.
 *
 * THE REGISTER (`pool-dominance.register.json`) holds one row per pool: a ceiling for `top1` and
 * for `top5`, and its reason. It only TIGHTENS: `tests/lint/poolDominance.walker.test.js` reds
 * when a pool rises above its ceiling, when a drawn pool has no row, when a row's pool is no
 * longer drawn, and when a ceiling sits looser than the measure by more than the slack. A cured
 * pool's row may hold the charter's TARGET instead (`targets`: the ceilings that are a law, not a
 * measure); a target is never loose, and is only ever lowered by hand.
 *
 * Usage (read-only unless `--tighten`):
 *   node scripts/census/pool-dominance.mjs            print the pools over their ceilings, then the worst twenty
 *   node scripts/census/pool-dominance.mjs --tighten  lower every ceiling to today's measure (never raise one),
 *                                                     drop the rows of pools no longer drawn, bank new pools
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';

export const REGISTER_PATH = fileURLToPath(new URL('./pool-dominance.register.json', import.meta.url));

/** How far a ceiling may sit above its measure before the register must be tightened. */
export const TIGHTEN_SLACK = 0.02;

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

/** @returns {Array<{ tier: string, seed: string }>} the corpus, in a fixed order */
export function corpusSeeds() {
  return CORPUS_PLAN.flatMap(([tier, n]) => Array.from({ length: n }, (_, i) => ({ tier, seed: `quarrel-${tier}-${i}` })));
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
 * Generate the corpus and measure every drawn pool.
 * @returns {Map<string, { draws: number, lines: number, top1: number, top5: number }>}
 */
export function measureDominance() {
  /** @type {Map<string, Map<string, number>>} */
  const pools = new Map();
  for (const { tier, seed } of corpusSeeds()) {
    const { result: s, ledger } = withPresumptionLedger(() => generateSettlementPipeline({ settType: tier, ...BROWSER_CONFIG }, null, { seed }));
    const powerNames = (s.powerStructure?.factions || []).map((f) => f?.faction || f?.name).filter((n) => typeof n === 'string');
    const names = [s.name, ...powerNames].filter((n) => typeof n === 'string' && n !== '');
    for (const entry of ledger) {
      if (entry.resolvedBy === 'none') continue;
      count(pools, `ledger:${entry.pool}`, maskNames(String(entry.lineId), names));
    }
    readRecordPools(s, pools);
  }
  /** @type {Map<string, { draws: number, lines: number, top1: number, top5: number }>} */
  const table = new Map();
  for (const [pool, lines] of [...pools].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
    const counts = [...lines.values()].sort((a, b) => b - a);
    const draws = counts.reduce((a, b) => a + b, 0);
    table.set(pool, {
      draws,
      lines: counts.length,
      top1: counts[0] / draws,
      top5: counts.slice(0, 5).reduce((a, b) => a + b, 0) / draws,
    });
  }
  return table;
}

/** @param {number} share @returns {number} the share rounded UP to four places, so a ceiling never sits below its measure */
export const ceil4 = (share) => Math.ceil(share * 10000 - 1e-9) / 10000;

/** @returns {{ pools: Record<string, { top1: number, top5: number, reason: string, targets?: string[] }> }} */
export function readRegister() {
  return JSON.parse(readFileSync(REGISTER_PATH, 'utf8'));
}

/**
 * The register's findings against a measure: each one a line a reader can act on.
 * @param {ReturnType<typeof measureDominance>} table @param {ReturnType<typeof readRegister>} register
 * @returns {{ over: string[], unregistered: string[], stale: string[], loose: string[] }}
 */
export function judge(table, register) {
  const rows = register.pools || {};
  const over = [], unregistered = [], stale = [], loose = [];
  for (const [pool, m] of table) {
    const row = rows[pool];
    if (!row) { unregistered.push(pool); continue; }
    if (m.top1 > row.top1 + 1e-9) over.push(`${pool}: top1 ${m.top1.toFixed(4)} > ceiling ${row.top1}`);
    if (m.top5 > row.top5 + 1e-9) over.push(`${pool}: top5 ${m.top5.toFixed(4)} > ceiling ${row.top5}`);
    // A ceiling set to the charter's target for a cured pool (`targets`) is a law, not a measure:
    // it is never loose. Every other ceiling hugs its measure.
    const targets = Array.isArray(row.targets) ? row.targets : [];
    if (!targets.includes('top1') && row.top1 - m.top1 > TIGHTEN_SLACK) loose.push(`${pool}: top1 ceiling ${row.top1} sits above its measure ${m.top1.toFixed(4)}`);
    if (!targets.includes('top5') && row.top5 - m.top5 > TIGHTEN_SLACK) loose.push(`${pool}: top5 ceiling ${row.top5} sits above its measure ${m.top5.toFixed(4)}`);
  }
  for (const pool of Object.keys(rows)) if (!table.has(pool)) stale.push(pool);
  return { over, unregistered, stale, loose };
}

const BANKED_REASON = 'banked at the 2026-11-11 measure (99bcc6944): not a pool COHERENCE-QUARREL cures';

function main() {
  const table = measureDominance();
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
  const { over, unregistered, stale, loose } = judge(table, readRegister());
  for (const line of [...over, ...unregistered.map((p) => `${p}: no row`), ...stale.map((p) => `${p}: no longer drawn`), ...loose]) console.log(line);
  const worst = [...table].sort(([, a], [, b]) => b.top1 - a.top1 || b.draws - a.draws).filter(([, m]) => m.lines > 1).slice(0, 20);
  for (const [pool, m] of worst) console.log(`${(m.top1 * 100).toFixed(1)}% / ${(m.top5 * 100).toFixed(1)}%  ${m.draws} draws, ${m.lines} lines  ${pool}`);
  process.exitCode = over.length || unregistered.length || stale.length || loose.length ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
