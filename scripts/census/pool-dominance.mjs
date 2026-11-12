/**
 * scripts/census/pool-dominance.mjs — THE DOMINANCE ARM (COHERENCE-QUARREL, 2026-11-11; the
 * chair's charter `docs/chair/2026-11-11/CHARTERS-COHERENCE-2026-11-11.md` §3; its noise rule and
 * six-tier corpus POOL-GUARD, 2026-11-12, `docs/DESIGN_POOL_CENSUS.md` §6).
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
 * THE CORPUS (`CORPUS_PLAN`) is the configuration a real browser sends, every dial on random, over
 * all six tiers, plus three forced stresses (famine, war, siege) at the tiers that carry them:
 * 2,050 settlements, seeds `<prefix>-<tier>-<i>` and `<prefix>-<tier>-<stress>-<i>`. The banked
 * prefix is `quarrel` (the 360 settlements this arm was born on are a subset); `--seed-prefix=<p>`
 * runs the same guard on towns nobody tuned to. It takes about 137 seconds alone on the seat's
 * machine (2026-11-12).
 *
 * THE RULE. A measure that sits above its ceiling is not, by itself, a loss of variety: a lane
 * that re-deals the corpus's draws moves every share by chance. So a row reds only when
 *   (1) its share rises above its ceiling by more than `NOISE_SE` standard errors of a share AT
 *       THE CEILING over the pool's own draws — the error taken over SETTLEMENTS (the ratio
 *       estimator's cluster variance: the draws inside one town are not independent), never
 *       below the binomial error; or
 *   (2) its `top1` crosses `DOMINATED.top1` — one line printing three of every four of the pool's
 *       lines — on a pool read over at least `DOMINATED.minDraws` draws, whatever the noise; or
 *   (3) it COLLAPSES: it printed two or more distinct lines at its banking (the row's `lines`) and
 *       prints one on the corpus, where chance does not explain it — the chance that every one of
 *       its towns printed the banked commonest line, `top1 ^ towns`, is under `COLLAPSE_CHANCE`.
 *       The least it needs is 10 towns (at a commonest line of one half); a pool whose commonest
 *       line already takes 0.9 needs 66. Whatever its share's error: the share test cannot see a
 *       pool whose commonest line was already near the whole of it.
 * A RISE MUST REPEAT (the chair, 2026-11-12): every lane that changes the generator re-deals the
 * births, so every merge point reads a fresh sample, and a fresh sample puts about one row over by
 * (1) or (2) on nothing. So when the corpus reads a row over by (1) or (2), the guard reads the
 * same corpus shape under the fixed second prefix `CONFIRM_SEED_PREFIX` at the same tree, against
 * the same ceiling and by the same rule; the row reds only if it is over on BOTH. Over on one
 * alone, it prints as a note carrying both readings. The second corpus is read only when there is
 * a row to confirm. A cured pool's target, the collapse arm (3) and the row-set checks are NOT
 * confirmed: they stay exact on the corpus read. What a second corpus cannot clear: a ceiling
 * banked low reads over on both (the procedure: `docs/DESIGN_POOL_CENSUS.md` §6.7).
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
 *                                                           drop the rows of pools no longer drawn, bank new pools,
 *                                                           and raise a row's count of distinct lines (never lower it)
 *   node scripts/census/pool-dominance.mjs --rebase [--hold=<pool>:<top1|top5>:<ceiling>]...
 *       a CORPUS CHANGE only (it refuses while the register's `corpus` is this one): bank every row
 *       at the new corpus's own measure, targets exactly as they are; a `--hold` keeps a row at a
 *       lower ceiling where the rule holds the measure there, and refuses where it does not. A
 *       ceiling is a statement about one pool on ONE population of towns; this door re-bases the
 *       instrument, by identity, and is used on a chair's ruling.
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

/** A pool that printed two or more lines and now prints one reds when chance explains that less often than this. */
export const COLLAPSE_CHANCE = 0.001;

/** The fixed second prefix a rise by the noise arm or the dominated line must repeat on. */
export const CONFIRM_SEED_PREFIX = 'confirm';

/** The banked corpus's seed prefix. */
export const DEFAULT_SEED_PREFIX = 'quarrel';

/** @param {string} stress */
const forced = (stress) => Object.freeze({ selectedStressesRandom: false, selectedStresses: [stress] });

/**
 * The corpus, by tier: every tier on the browser's random dials, then the three forced stresses.
 * @type {ReadonlyArray<{ tier: string, n: number, stress?: string }>}
 */
export const CORPUS_PLAN = Object.freeze([
  { tier: 'thorp', n: 150 },
  { tier: 'hamlet', n: 200 },
  { tier: 'village', n: 350 },
  { tier: 'town', n: 550 },
  { tier: 'city', n: 350 },
  { tier: 'metropolis', n: 150 },
  { tier: 'village', n: 50, stress: 'famine' },
  { tier: 'town', n: 50, stress: 'famine' },
  { tier: 'town', n: 50, stress: 'wartime' },
  { tier: 'city', n: 50, stress: 'wartime' },
  { tier: 'town', n: 50, stress: 'under_siege' },
  { tier: 'city', n: 50, stress: 'under_siege' },
]);

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
  return CORPUS_PLAN.flatMap(({ tier, n, stress }) => Array.from({ length: n }, (_, i) => ({
    tier,
    seed: stress ? `${prefix}-${tier}-${stress}-${i}` : `${prefix}-${tier}-${i}`,
    config: stress ? { ...BROWSER_CONFIG, ...forced(stress) } : BROWSER_CONFIG,
  })));
}

/** @returns {string} the corpus's identity, banked in the register: a change of plan is a change of instrument */
export const corpusIdentity = () => JSON.stringify(CORPUS_PLAN);

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

/** @typedef {{ top1: number, top5: number, lines?: number, reason: string, targets?: string[] }} RegisterRow */

/** @returns {{ corpus?: string, census?: { secondWave?: unknown[] }, pools: Record<string, RegisterRow> }} */
export function readRegister() {
  return JSON.parse(readFileSync(REGISTER_PATH, 'utf8'));
}

/**
 * The register's findings against a measure: each one a line a reader can act on.
 * @param {Map<string, Pick<PoolMeasure, 'draws' | 'towns' | 'lines' | 'top1' | 'top5' | 'spread'>>} table
 * @param {ReturnType<typeof readRegister>} register
 * @param {{ exact?: boolean }} [options] `exact: false` (a foreign seed prefix) turns the row-set checks into notes
 * @returns {Findings} `repeatable` names the findings of `over` a second corpus must confirm
 */
export function judge(table, register, { exact = true } = {}) {
  const rows = register.pools || {};
  const over = [], unregistered = [], stale = [], loose = [], notes = [];
  /** @type {Array<{ key: string, text: string }>} */
  const repeatable = [];
  for (const [pool, m] of table) {
    const row = rows[pool];
    if (!row) {
      if (exact) unregistered.push(pool);
      else notes.push(`${pool}: no row (${m.draws} draws)`);
      continue;
    }
    const targets = Array.isArray(row.targets) ? row.targets : [];
    const chance = row.top1 ** m.towns;
    if ((row.lines || 0) >= 2 && m.lines === 1 && chance < COLLAPSE_CHANCE) {
      over.push(`${pool}: collapses to one line (banked with ${row.lines}; over ${m.draws} draws in ${m.towns} towns, chance ${chance.toExponential(1)})`);
    }
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
        const text = `${pool}: ${metric} ${share.toFixed(4)} > ceiling ${ceiling} (${why})`;
        over.push(text);
        if (!targets.includes(metric)) repeatable.push({ key: `${pool}|${metric}`, text });
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
  return { over, unregistered, stale, loose, notes, repeatable };
}

/**
 * @typedef {{ over: string[], unregistered: string[], stale: string[], loose: string[], notes: string[],
 *   repeatable: Array<{ key: string, text: string }> }} Findings
 */

/**
 * A rise must repeat: each repeatable finding of the first reading stays a finding only if the second
 * reading has the same pool and share over too (by either arm); else it becomes a note with both readings.
 * @param {Findings} first @param {Findings} second @param {string} secondPrefix
 * @param {Map<string, Pick<PoolMeasure, 'draws' | 'top1' | 'top5'>>} secondTable the second reading's measure
 * @returns {Findings}
 */
export function confirmRises(first, second, secondPrefix, secondTable) {
  const again = new Map(second.repeatable.map((r) => [r.key, r.text]));
  const unconfirmed = new Set(first.repeatable.filter((r) => !again.has(r.key)).map((r) => r.text));
  const confirmedText = new Map(first.repeatable.filter((r) => again.has(r.key)).map((r) => [r.text, again.get(r.key)]));
  return {
    ...first,
    over: first.over.filter((t) => !unconfirmed.has(t)).map((t) => (confirmedText.has(t) ? `${t}; repeats on ${secondPrefix}: ${confirmedText.get(t)}` : t)),
    notes: [...first.notes, ...first.repeatable.filter((r) => unconfirmed.has(r.text)).map((r) => {
      const [pool, metric] = r.key.split(/\|(?=top[15]$)/);
      const m = secondTable.get(pool);
      const reading = m ? `${metric} ${m[/** @type {'top1' | 'top5'} */ (metric)].toFixed(4)} over ${m.draws} draws` : 'not drawn';
      return `${r.text}; does not repeat on ${secondPrefix} (${reading})`;
    })],
    repeatable: first.repeatable.filter((r) => again.has(r.key)),
  };
}

/**
 * The guard's whole reading: the corpus judged, and any rise by the noise arm or the dominated line
 * read again on the fixed second prefix.
 * @param {{ seedPrefix?: string, register?: ReturnType<typeof readRegister>, table?: Map<string, PoolMeasure> }} [options]
 * @returns {{ table: Map<string, PoolMeasure>, findings: Findings, confirmedOn: string | null, second: Map<string, PoolMeasure> | null }}
 */
export function judgeCorpus({ seedPrefix = DEFAULT_SEED_PREFIX, register = readRegister(), table = measureDominance({ seedPrefix }) } = {}) {
  const first = judge(table, register, { exact: seedPrefix === DEFAULT_SEED_PREFIX });
  if (!first.repeatable.length) return { table, findings: first, confirmedOn: null, second: null };
  const secondPrefix = seedPrefix === CONFIRM_SEED_PREFIX ? DEFAULT_SEED_PREFIX : CONFIRM_SEED_PREFIX;
  const second = measureDominance({ seedPrefix: secondPrefix });
  return { table, findings: confirmRises(first, judge(second, register, { exact: false }), secondPrefix, second), confirmedOn: secondPrefix, second };
}

const REGISTER_LAW = 'SHRINK-ONLY ON ONE CORPUS. One row per drawn pool: the ceiling for the share of its most-printed line (top1) and of its five most-printed lines (top5) over the corpus `corpus` names (scripts/census/pool-dominance.mjs). On that corpus a ceiling is only ever lowered (--tighten); a row leaves only when its pool is no longer drawn. A change of corpus is a change of instrument: the rows are re-based at the new corpus\'s measure through --rebase, on a chair\'s ruling, and never by hand. Held by tests/lint/poolDominance.walker.test.js.';
const BANKED_REASON = 'banked at the 2026-11-12 six-tier measure (POOL-GUARD): a pool the 360-settlement corpus never drew';
const REBASED_REASON = 'banked at the 2026-11-12 six-tier measure (POOL-GUARD): the instrument re-based by identity on the chair\'s ruling, not a tightening';

/**
 * The census the second wave reads: figures, not findings. Written by both doors from the measure;
 * `secondWave` (the rows a re-base found more dominated on the new towns beyond the noise) is
 * written by `--rebase` and carried forward by `--tighten`.
 * @param {Map<string, PoolMeasure>} table @param {unknown[]} [secondWave]
 */
function censusOf(table, secondWave = []) {
  const all = [...table];
  const highest = all.filter(([, m]) => m.draws >= 150 && m.lines > 1)
    .sort(([pa, a], [pb, b]) => b.top1 - a.top1 || (pa < pb ? -1 : 1)).slice(0, 12)
    .map(([pool, m]) => ({ pool, top1: ceil4(m.top1), top5: ceil4(m.top5), draws: m.draws, lines: m.lines }));
  return {
    _note: 'Figures for the second wave, never a red: re-written by every door.',
    pools: table.size,
    printOneLine: all.filter(([, m]) => m.lines === 1).length,
    measuredUnder30Draws: all.filter(([, m]) => m.draws < 30).length,
    highestSharesOver150Draws: highest,
    secondWave,
  };
}

/**
 * The re-base door: every row at the corpus's own measure, targets exactly as they are, each
 * `--hold` at its lower ceiling where the rule holds the measure there.
 * @param {Map<string, PoolMeasure>} table @param {ReturnType<typeof readRegister>} register @param {string[]} holds
 */
function rebase(table, register, holds) {
  if (register.corpus === corpusIdentity()) throw new Error('pool-dominance: --rebase is for a corpus change; the register is already banked on this corpus (use --tighten)');
  const rows = register.pools || {};
  /** @type {Record<string, RegisterRow>} */
  const next = {};
  for (const [pool, m] of table) {
    const row = rows[pool];
    const targets = row?.targets || [];
    next[pool] = row
      ? {
        ...row,
        top1: targets.includes('top1') ? row.top1 : ceil4(m.top1),
        top5: targets.includes('top5') ? row.top5 : ceil4(m.top5),
        lines: m.lines,
        reason: targets.length ? row.reason : REBASED_REASON,
      }
      : { top1: ceil4(m.top1), top5: ceil4(m.top5), lines: m.lines, reason: BANKED_REASON };
  }
  /** @type {unknown[]} the rows the new towns read more dominated than the old ceiling, beyond the noise */
  const secondWave = [];
  for (const [pool, m] of table) {
    const row = rows[pool];
    if (!row) continue;
    for (const metric of /** @type {const} */ (['top1', 'top5'])) {
      if (row.targets?.includes(metric)) continue;
      const se = shareError(m, metric, row[metric]);
      if (m[metric] > row[metric] + NOISE_SE * se + 1e-9) secondWave.push({ pool, metric, oldCeiling: row[metric], measure: ceil4(m[metric]), standardErrors: Number(((m[metric] - row[metric]) / se).toFixed(2)), draws: m.draws, towns: m.towns });
    }
  }
  for (const hold of holds) {
    const [, pool = '', metric = '', value = ''] = /^(.*):(top1|top5):([0-9.]+)$/.exec(hold) || [];
    const ceiling = Number(value);
    const m = table.get(pool);
    if (!m || !next[pool] || (metric !== 'top1' && metric !== 'top5') || !(ceiling > 0)) throw new Error(`pool-dominance: --hold=${hold} names no drawn pool's top1 or top5`);
    const held = { pools: { [pool]: { ...next[pool], [metric]: Math.min(next[pool][metric], ceiling) } } };
    const { over } = judge(new Map([[pool, m]]), held);
    if (over.length) throw new Error(`pool-dominance: --hold=${hold} does not hold: ${over.join('; ')}`);
    next[pool] = { ...held.pools[pool], reason: `held at or below its original ceiling ${ceiling} (point 43 re-banked it upward within two draws; restored by POOL-GUARD where the rule holds it): ${REBASED_REASON}` };
  }
  return { _law: REGISTER_LAW, corpus: corpusIdentity(), census: censusOf(table, secondWave), pools: next };
}

/** @param {string[]} argv @returns {string | undefined} */
function seedPrefixArg(argv) {
  const arg = argv.find((a) => a.startsWith('--seed-prefix='));
  return arg ? arg.slice('--seed-prefix='.length) : undefined;
}

function main() {
  const seedPrefix = seedPrefixArg(process.argv) || DEFAULT_SEED_PREFIX;
  const exact = seedPrefix === DEFAULT_SEED_PREFIX;
  if ((process.argv.includes('--tighten') || process.argv.includes('--rebase')) && !exact) throw new Error('pool-dominance: the doors read the banked corpus only; drop --seed-prefix');
  const table = measureDominance({ seedPrefix });
  if (process.argv.includes('--rebase')) {
    const holds = process.argv.filter((a) => a.startsWith('--hold=')).map((a) => a.slice('--hold='.length));
    const next = rebase(table, readRegister(), holds);
    writeFileSync(REGISTER_PATH, `${JSON.stringify(next, null, 2)}\n`);
    console.log(`pool-dominance: ${table.size} pools re-based on the corpus, ${holds.length} held`);
    return;
  }
  if (process.argv.includes('--tighten')) {
    const register = readRegister();
    if (register.corpus !== corpusIdentity()) throw new Error('pool-dominance: --tighten compares like with like; the register was banked on another corpus (--rebase, on a ruling)');
    const rows = register.pools || {};
    /** @type {Record<string, RegisterRow>} */
    const next = {};
    for (const [pool, m] of table) {
      const row = rows[pool];
      next[pool] = row
        ? {
          ...row,
          top1: row.targets?.includes('top1') ? row.top1 : Math.min(row.top1, ceil4(m.top1)),
          top5: row.targets?.includes('top5') ? row.top5 : Math.min(row.top5, ceil4(m.top5)),
          // The banked count of distinct lines only grows: a collapse is judged against the widest it was.
          lines: Math.max(row.lines || 0, m.lines),
        }
        : { top1: ceil4(m.top1), top5: ceil4(m.top5), lines: m.lines, reason: BANKED_REASON };
    }
    const census = censusOf(table, register.census?.secondWave || []);
    writeFileSync(REGISTER_PATH, `${JSON.stringify({ ...register, census, pools: next }, null, 2)}\n`);
    console.log(`pool-dominance: ${table.size} pools written`);
    return;
  }
  const register = readRegister();
  const { findings, confirmedOn } = judgeCorpus({ seedPrefix, register, table });
  const { over, unregistered, stale, loose, notes } = findings;
  if (confirmedOn) console.log(`pool-dominance: a rise was read again on ${confirmedOn}`);
  if (register.corpus !== corpusIdentity()) console.log('pool-dominance: the register was banked on another corpus (re-base it, on a ruling, with --rebase)');
  for (const line of [...over, ...unregistered.map((p) => `${p}: no row`), ...stale.map((p) => `${p}: no longer drawn`), ...loose]) console.log(line);
  for (const line of notes) console.log(`note: ${line}`);
  const worst = [...table].sort(([, a], [, b]) => b.top1 - a.top1 || b.draws - a.draws).filter(([, m]) => m.lines > 1).slice(0, 20);
  for (const [pool, m] of worst) console.log(`${(m.top1 * 100).toFixed(1)}% / ${(m.top5 * 100).toFixed(1)}%  ${m.draws} draws, ${m.lines} lines  ${pool}`);
  console.log(`pool-dominance: corpus ${seedPrefix} (${table.size} pools): ${over.length} over, ${unregistered.length} unregistered, ${stale.length} stale, ${loose.length} loose, ${notes.length} notes`);
  process.exitCode = over.length || unregistered.length || stale.length || loose.length || register.corpus !== corpusIdentity() ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
