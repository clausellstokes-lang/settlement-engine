#!/usr/bin/env node
/**
 * scripts/taste-candidates.mjs — WHERE THE TASTE'S SEVEN MODIFIER POOLS ACTUALLY FIRE, ON THE
 * RATE CORPUS'S 768 TOWNS (TASTE car M-3; ARCH §4.3's norm bit, §6.3-§6.5's arithmetic).
 *
 * THE THREE FIGURES, AND WHY THEY ARE THREE. A modifier pool's life has three gates and they
 * do not answer the same question, so a single "it fires on N towns" hides the two that
 * matter:
 *
 *   CANDIDATE  the pool's own predicate held on this town's readings. This is the rate ARCH
 *              §4.3 freezes the DEPARTURE bit from — a property of the FACT, not of what the
 *              page happened to have room for.
 *   ATTACHED   a spine of the pool's attach set actually drew at the mount, so the pool COULD
 *              seat. Candidate minus attached is the cost of the attach narrowing.
 *   SEATED     the composer seated it: it survived the audience filter, the attach filter,
 *              the salience ranking and the fact and position budgets, and its text is on the
 *              page. This is what a reader meets.
 *
 * ⛔ COMPOSED THROUGH THE SHIPPED DESK-READ RECIPE AND NEVER WITH `{}` READINGS. Every desk is
 * called through `deskReturns` in scripts/prose-rate-corpus.mjs — the one spelling of the
 * fourteen-argument reading bag — because a composer called with empty readings selects its
 * ABSENCE pool for every seed, which is the taste sample's own named hazard. The candidate
 * half calls the SAME leaves the desks call, with the SAME bags.
 *
 *   node scripts/taste-candidates.mjs                 the whole 768-town grid
 *   node scripts/taste-candidates.mjs --limit 96      a cheap deterministic slice
 *   node scripts/taste-candidates.mjs --out <file>    the machine-readable table beside it
 *
 * READ-ONLY except the `--out` file it is asked for.
 */
import { writeFileSync } from 'node:fs';

import { generateSettlementPipeline } from '../src/generators/generateSettlementPipeline.js';
import { deskReturns, generalReadings, rateGrid } from './prose-rate-corpus.mjs';
import { defenseStateProseCandidates } from '../src/domain/display/stateProse/defenseStateProseCandidates.js';
import { generalStateProseCandidates } from '../src/domain/display/stateProse/generalStateProseCandidates.js';
import { TASTE_POOLS } from './prose-licence-card.mjs';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../src/data/dossierStateProse/general.generated.js';

/** The two desks whose leaves the taste authored, and how each is handed its readings. */
const LEAVES = Object.freeze({
  'DS-DEF-11': (settlement) => defenseStateProseCandidates('DS-DEF-11', settlement),
  'DS-DEF-2': (settlement) => defenseStateProseCandidates('DS-DEF-2', settlement),
  'DS-GEN-3': (settlement) => generalStateProseCandidates('DS-GEN-3', generalReadings(settlement)),
});

/** The projected attach set per pool, read from the leaves rather than re-typed. */
export function attachOf(block, pool) {
  const corpus = block === 'DS-GEN-3' ? DOSSIER_STATE_PROSE_GENERAL : DOSSIER_STATE_PROSE_DEFENSE;
  return corpus[block]?.poolMeta?.[pool]?.attach || [];
}

/**
 * Walk a desk return for every composed rung, keeping the SPINE key and the pieces.
 * @param {unknown} node
 * @param {Array<{block: string, spine: string, pieces: ReadonlyArray<object>}>} out
 * @param {number} [depth]
 */
function walkUnits(node, out, depth = 0) {
  if (!node || typeof node !== 'object' || depth > 10) return;
  const rung = /** @type {any} */ (node);
  const p = rung.provenance;
  if (p && typeof p.blockId === 'string' && typeof p.poolKey === 'string') {
    out.push({ block: p.blockId, spine: p.poolKey, pieces: p.pieces || [] });
    return;
  }
  for (const value of Object.values(node)) walkUnits(value, out, depth + 1);
}

/**
 * ONE TOWN: which taste pools were CANDIDATES, which had a spine they could attach to, and
 * which the composer SEATED.
 * @param {{seed: string, config: object}} spec
 * @param {string} audience
 * @returns {{tier: string, threat: string, candidates: Set<string>, attached: Set<string>,
 *   seated: Set<string>, spines: Map<string, string[]>}|null}
 */
export function tasteFiringsOf(spec, audience = 'dm') {
  let settlement;
  try {
    settlement = generateSettlementPipeline(spec.config, null, { seed: spec.seed, customContent: {} });
  } catch { return null; }
  const seed = String(settlement._seed ?? settlement.id ?? spec.seed);
  /** @type {Set<string>} */
  const candidates = new Set();
  for (const [block, call] of Object.entries(LEAVES)) {
    for (const row of call(settlement)) candidates.add(`${block} :: ${row.key}`);
  }
  /** @type {Array<{block: string, spine: string, pieces: ReadonlyArray<object>}>} */
  const units = [];
  for (const entry of deskReturns(settlement, { seed, audience })) walkUnits(entry.value, units);
  /** @type {Map<string, string[]>} block -> the spine keys that drew there */
  const spines = new Map();
  /** @type {Set<string>} */
  const seated = new Set();
  for (const unit of units) {
    const seat = spines.get(unit.block);
    if (seat) seat.push(unit.spine); else spines.set(unit.block, [unit.spine]);
    for (const piece of unit.pieces) {
      if (piece.role === 'modifier') seated.add(`${unit.block} :: ${piece.key}`);
    }
  }
  /** @type {Set<string>} */
  const attached = new Set();
  for (const at of candidates) {
    const [block, pool] = at.split(' :: ');
    const drew = spines.get(block) || [];
    if (attachOf(block, pool).some((key) => drew.includes(key))) attached.add(at);
  }
  return {
    tier: String(settlement.tier),
    // ⛔ THE RESOLVED THREAT, NOT THE GRID'S. `random_threat` is a ROLL and not a tier: a
    // reader comparing the predicate against the grid's raw config value measures the panel's
    // choices rather than the towns the panel produced.
    threat: String(settlement.config?.monsterThreat ?? ''),
    candidates,
    attached,
    seated,
    spines,
  };
}

/**
 * The whole census over a grid.
 * @param {ReadonlyArray<{seed: string, config: object}>} towns
 * @param {string} [audience]
 */
export function tasteCandidateCensus(towns, audience = 'dm') {
  const keys = TASTE_POOLS.map((p) => `${p.block} :: ${p.pool}`);
  /** @type {Map<string, {candidate: number, attached: number, seated: number,
   *   cells: Map<string, number>, byTier: Map<string, number>}>} */
  const table = new Map(keys.map((k) => [k, {
    candidate: 0, attached: 0, seated: 0, cells: new Map(), byTier: new Map(),
  }]));
  let walked = 0;
  let genThrows = 0;
  for (const town of towns) {
    const firing = tasteFiringsOf(town, audience);
    if (!firing) { genThrows += 1; continue; }
    walked += 1;
    for (const at of firing.candidates) {
      const seat = table.get(at);
      if (!seat) continue;
      seat.candidate += 1;
      seat.byTier.set(firing.tier, (seat.byTier.get(firing.tier) || 0) + 1);
      const [block, pool] = at.split(' :: ');
      for (const spine of firing.spines.get(block) || []) {
        if (attachOf(block, pool).includes(spine)) seat.cells.set(spine, (seat.cells.get(spine) || 0) + 1);
      }
    }
    for (const at of firing.attached) { const seat = table.get(at); if (seat) seat.attached += 1; }
    for (const at of firing.seated) { const seat = table.get(at); if (seat) seat.seated += 1; }
  }
  return { walked, genThrows, table };
}

/** @param {ReturnType<typeof tasteCandidateCensus>} census @param {number} n */
export function censusLines(census, n) {
  const lines = [`TASTE CANDIDATES · ${census.walked} towns of ${n} · genThrows ${census.genThrows}`,
    `  ${'pool'.padEnd(40)} ${'cand'.padStart(5)} ${'attach'.padStart(6)} ${'seat'.padStart(5)}  bp   the cells it attaches to`];
  for (const [key, row] of census.table) {
    const bp = census.walked ? Math.round((row.candidate / census.walked) * 10000) : 0;
    const cells = [...row.cells].sort((a, b) => b[1] - a[1])
      .map(([spine, count]) => `${spine} ${count}`).join(' · ') || '(none)';
    lines.push(`  ${key.padEnd(40)} ${String(row.candidate).padStart(5)} ${String(row.attached).padStart(6)}`
      + ` ${String(row.seated).padStart(5)}  ${String(bp).padStart(4)}  ${cells}`);
  }
  return lines;
}

/** The entry point. */
async function main() {
  const argv = process.argv.slice(2);
  const limitAt = argv.indexOf('--limit');
  const outAt = argv.indexOf('--out');
  const grid = rateGrid();
  const towns = limitAt >= 0 ? grid.slice(0, Number(argv[limitAt + 1])) : grid;
  const started = Date.now();
  const census = tasteCandidateCensus(towns);
  for (const line of censusLines(census, towns.length)) console.log(line);
  console.log(`  ${Math.round((Date.now() - started) / 1000)} s`);
  if (outAt >= 0 && argv[outAt + 1]) {
    writeFileSync(argv[outAt + 1], `${JSON.stringify({
      towns: towns.length,
      walked: census.walked,
      rows: [...census.table].map(([key, row]) => ({
        key,
        candidate: row.candidate,
        attached: row.attached,
        seated: row.seated,
        rateBp: census.walked ? Math.round((row.candidate / census.walked) * 10000) : 0,
        byTier: Object.fromEntries(row.byTier),
        cells: Object.fromEntries(row.cells),
      })),
    }, null, 1)}\n`);
    console.log(`  wrote ${argv[outAt + 1]}`);
  }
}

if (process.argv[1] && process.argv[1].endsWith('taste-candidates.mjs')) await main();
