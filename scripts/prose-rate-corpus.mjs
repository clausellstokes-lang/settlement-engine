/**
 * scripts/prose-rate-corpus.mjs — ARCH car 0: THE RATE CORPUS.
 *
 * WHY A THIRD CORPUS (ARCH §3.4; E-F3, M-F1, X-F1, X-F2). The generator golden master's
 * 525 rows are a tier x culture x terrain grid at ONE seed plus sweeps: 516 of them carry
 * `golden-master-v3`, threat reads `civilized` on 522 of 525, and a frontier wall — the
 * owner's own worked example — occurs on ONE row. Every draw in the composed-prose model
 * is a function of seed and pool identity, so on that corpus two towns in one state cell
 * draw the same variant with probability 1. A rate, a departure bit, an occurrence floor
 * and a pair distribution cannot be read off it. This corpus is built for exactly those
 * four numbers and for nothing else.
 *
 * ── THE GRID, AND THE POPULATION IT REPRESENTS (SITTING §N.3, ARCH §13 row 7) ────────
 * UNIFORM OVER THE GAME'S CONFIGURATION CHOICES: threat 4 x route 8 x tier 6 = 192 cells,
 * 4 seeds each = 768 towns, with culture and terrain SWEPT across the cells so a predicate
 * that reads either sees every value. "Uncommon" is a property of the world's
 * configuration space and not of the launch funnel: a fact rare in the world reads as
 * notable to any reader, whichever towns players happen to generate.
 *
 * The funnel is not thrown away — it is printed BESIDE every rate as a REPORT column,
 * measured on a second corpus generated from `DEFAULT_CONFIG` verbatim (what a first-time
 * player meets). A declared re-cut waits for the beta's real distribution.
 *
 * ⚠ THE ROUTE AXIS IS EIGHT AND THE PANEL OFFERS SEVEN, AND THE EIGHTH IS DECLARED. The
 * configuration panel's Trade Route select carries `random_trade · road · river · port ·
 * crossroads · isolated · mountain_pass`. The eighth value is `none`, which is not a panel
 * option: it is the authored/legacy value `tradeRouteSemantics.ROUTE_TIER` tiers as
 * `isolated`, which the golden corpus carries on one row, and which `resolveConfig` passes
 * through verbatim because an authored route is a premise and not a value to rewrite. It
 * is in the axis so the grid is exactly the architecture's 192 cells and N is exactly 768
 * — the sample size every Wilson figure in ARCH §4.4 and §6.1 is stated at. Its rows carry
 * their own marginal in the output, so a reader who wants the seven-choice grid can drop
 * them and re-read at N = 672.
 *
 * ── HOW THE COMPOSERS ARE CALLED ────────────────────────────────────────────────────
 * Through the SHIPPED desk-read recipes, never with `{}` readings — the taste sample's own
 * hazard, where a composer called with empty readings selects its ABSENCE pool for every
 * seed. The sequence is INSTR-912 car 9's corrected one (the `politics` reading the power
 * tab passes; the general desk's bare sentence strings harvested and counted apart because
 * they carry no (block, pool) key at all).
 *
 * READ-ONLY except the `--out` file it is asked for. No threshold is set anywhere in this
 * script: the departure line and the co-occurrence floor are the chair's, and what ships
 * here is the distribution they are set from.
 */
import { writeFileSync } from 'node:fs';

import { coOccurringPairs } from '../src/domain/prose/wiringCensus.js';
import { CULTURES, TERRAIN_WEIGHTS } from '../src/generators/steps/resolveConfig.js';
import { DEFAULT_CONFIG } from '../src/store/configSlice.js';
import { generateSettlementPipeline } from '../src/generators/generateSettlementPipeline.js';
import { buildCensus, wilsonBp, wilsonFloorCount } from './wiring-census.mjs';

import * as general from '../src/domain/display/stateProse/generalStateProse.js';
import * as power from '../src/domain/display/stateProse/powerStateProse.js';
import * as defense from '../src/domain/display/stateProse/defenseStateProse.js';
import * as stressors from '../src/domain/display/stateProse/stressorsStateProse.js';
import * as warFaith from '../src/domain/display/stateProse/warFaithStateProse.js';
import { generalDeskLines } from '../src/components/new/generalDeskRead.js';
import { economyDeskRead } from '../src/components/new/economyDeskRead.js';
import { structuralLensOf } from '../src/domain/spatial/cohesionWeave.js';
import { coupContenders, coupRiskLabel } from '../src/domain/rulingPowerCoup.js';
import { deriveAllActiveConditions } from '../src/domain/activeConditions.js';
import { faithPanelModel } from '../src/components/settlement/faithPanelModel.js';
import { settlementBlocs } from '../src/domain/display/politicsRead.js';

/** The four threat choices the configuration panel offers, `random_threat` included. */
export const THREAT_AXIS = Object.freeze(['random_threat', 'heartland', 'frontier', 'plagued']);
/** The panel's seven route choices plus the authored `none` (see the header). */
export const ROUTE_AXIS = Object.freeze([
  'random_trade', 'road', 'river', 'port', 'crossroads', 'isolated', 'mountain_pass', 'none',
]);
/** The six canonical tiers. `random` and `custom` are rolls, not tiers, and are excluded. */
export const TIER_AXIS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
/** Seeds per cell. 192 x 4 = 768, the N every Wilson figure in ARCH is stated at. */
export const SEEDS_PER_CELL = 4;

const TERRAINS = TERRAIN_WEIGHTS.map(([t]) => t);

/**
 * THE GRID, built once and deterministically. Culture and terrain are SWEPT rather than
 * rolled: cell index i takes culture i mod 11 and terrain i mod 7, and the seed index
 * offsets both, so across 768 towns every culture and every terrain meets every threat,
 * route and tier rather than clustering behind one roll.
 * @returns {Array<{cell: number, seedIndex: number, seed: string, config: object}>}
 */
export function rateGrid() {
  /** @type {Array<{cell: number, seedIndex: number, seed: string, config: object}>} */
  const towns = [];
  let cell = 0;
  for (const monsterThreat of THREAT_AXIS) {
    for (const tradeRouteAccess of ROUTE_AXIS) {
      for (const settType of TIER_AXIS) {
        for (let s = 0; s < SEEDS_PER_CELL; s++) {
          towns.push({
            cell,
            seedIndex: s,
            seed: `rate-${cell}-${s}`,
            config: {
              settType,
              tradeRouteAccess,
              monsterThreat,
              culture: CULTURES[(cell + s) % CULTURES.length],
              terrainOverride: TERRAINS[(cell + s * 3) % TERRAINS.length],
            },
          });
        }
        cell += 1;
      }
    }
  }
  return towns;
}

/**
 * The WIZARD-DEFAULT corpus: `DEFAULT_CONFIG` verbatim, one seed per town. Its marginals
 * are whatever the shipped roll pools make them, which is the point — it is the funnel, not
 * the configuration space.
 * @param {number} n
 * @returns {Array<{cell: number, seedIndex: number, seed: string, config: object}>}
 */
export function wizardGrid(n) {
  return Array.from({ length: n }, (_, i) => ({
    cell: -1, seedIndex: i, seed: `rate-wizard-${i}`, config: { ...DEFAULT_CONFIG },
  }));
}

/** Walk a desk return for every rung carrying its (blockId, poolKey) provenance. */
function walk(node, found, depth = 0) {
  if (!node || typeof node !== 'object' || depth > 10) return;
  if (typeof node.blockId === 'string' && typeof node.poolKey === 'string') {
    found.push({ block: node.blockId, pool: node.poolKey });
    return;
  }
  const p = node.provenance;
  if (p && typeof p.blockId === 'string' && typeof p.poolKey === 'string') {
    found.push({ block: p.blockId, pool: p.poolKey });
    return;
  }
  for (const value of Object.values(node)) walk(value, found, depth + 1);
}

/** The general desk's finished SENTENCE STRINGS — the half no provenance walk can see. */
function harvestBare(node, out, depth = 0) {
  if (typeof node === 'string') {
    const s = node.trim();
    if (s.split(/\s+/).length >= 4 && /[.?!]$/.test(s)) out.push(s);
    return;
  }
  if (!node || typeof node !== 'object' || depth > 8) return;
  for (const value of Object.values(node)) harvestBare(value, out, depth + 1);
}

/**
 * ONE TOWN, composed through all six desks by their SHIPPED recipes (INSTR-912 car 9's
 * corrected sequence). Returns the (block, pool) keys that fired and the town's resolved
 * marginals, or null when the generator threw.
 * @param {{seed: string, config: object}} spec
 * @param {Map<string, number>} deskThrows
 * @returns {{tier: string, threat: string, route: string, fired: Array<{block: string, pool: string}>, bare: number}|null}
 */
export function composeTown(spec, deskThrows) {
  let s;
  try {
    s = generateSettlementPipeline(spec.config, null, { seed: spec.seed, customContent: {} });
  } catch { return null; }
  const seed = String(s._seed ?? s.id ?? spec.seed);
  const opts = { seed, audience: 'dm' };
  /** @type {Array<{block: string, pool: string}>} */
  const fired = [];
  const desk = (name, fn) => {
    try { walk(fn(), fired); } catch { deskThrows.set(name, (deskThrows.get(name) || 0) + 1); }
  };
  const eco = s.economicState || {};
  const dp = s.defenseProfile || {};
  const via = s.economicViability || {};
  desk('general', () => general.generalStateProse(s, {
    scores: dp.scores,
    prosperity: eco.prosperity,
    safetyLabel: eco.safetyProfile?.safetyLabel,
    viable: via.viable,
    readinessLabel: dp.readiness?.label,
    foodSecurityLabel: eco.foodSecurity?.label,
    terrainType: s.config?.terrainType,
    institutions: s.institutions,
    tradeRouteAccess: s.config?.tradeRouteAccess,
    isEntrepot: eco.isEntrepot,
    inst: eco.compound?.inst,
    conflicts: s.conflicts,
    structuralViolations: s.structuralViolations,
    structuralSuggestions: s.structuralSuggestions,
    coherenceNotes: s.coherenceNotes,
    govFaction: (s.powerStructure?.factions || []).find((f) => f?.isGoverning)?.faction,
    tier: s.tier,
    foodBalance: via.metrics?.foodBalance,
    history: s.history,
    prominentRelationship: s.prominentRelationship,
    relationships: s.relationships,
    criticalIssueCount: via.metrics?.criticalIssueCount,
    governingName: s.powerStructure?.governingName,
    activeChains: eco.activeChains,
    exploitation: s.resourceAnalysis?.exploitation,
    primaryImports: eco.primaryImports,
  }, opts));
  /** @type {string[]} */
  const bare = [];
  try {
    harvestBare(generalDeskLines(s, { publicDossier: false, playerView: false }), bare);
  } catch { deskThrows.set('generalDeskLines', (deskThrows.get('generalDeskLines') || 0) + 1); }
  desk('economy', () => economyDeskRead(s, opts));
  desk('power', () => {
    let contenders = null;
    try { contenders = coupContenders(s); } catch { /* the tab reads null too */ }
    return power.powerStateProse(s, {
      ...(contenders ? { contenders, riskLabel: coupRiskLabel(contenders) } : {}),
      structuralLens: structuralLensOf(s),
      politics: settlementBlocs({
        worldState: null, settlementId: s.id, includeGroundTruth: true, includeCovert: true,
      }),
    }, opts);
  });
  for (const name of ['defenseStateProse', 'defenseThreatProse', 'defenseForcesProse',
    'defensePostureProse', 'defenseWallRationaleProse', 'defenseMilitaryStatusProse',
    'defenseSupportingProse', 'defenseMagicDependencyProse']) {
    desk(name, () => defense[name](s, opts));
  }
  desk('stressors', () => stressors.stressorsStateProse(s, {
    banners: Array.isArray(s.stress) ? s.stress : (s.stress ? [s.stress] : []),
    conditions: deriveAllActiveConditions(s),
    worldStressor: null,
  }, opts));
  desk('warFaith', () => {
    const model = faithPanelModel(s);
    return warFaith.warFaithStateProse(s, { faith: model, hasPatron: !!model.hasEmbed }, opts);
  });
  return {
    tier: String(s.tier),
    threat: String(s.config?.monsterThreat),
    route: String(s.config?.tradeRouteAccess),
    fired,
    bare: bare.length,
  };
}

/**
 * Run one corpus and return its per-town firing record with the resolved marginals.
 * @param {Array<{seed: string, config: object}>} spec
 * @returns {{towns: Array<object>, genThrows: number, deskThrows: Array<[string, number]>, bare: number, seconds: number}}
 */
export function runCorpus(spec) {
  /** @type {Map<string, number>} */
  const deskThrows = new Map();
  /** @type {Array<object>} */
  const towns = [];
  let genThrows = 0;
  let bare = 0;
  const started = Date.now();
  for (const town of spec) {
    const composed = composeTown(town, deskThrows);
    if (!composed) { genThrows += 1; continue; }
    bare += composed.bare;
    towns.push(composed);
  }
  return {
    towns, genThrows, deskThrows: [...deskThrows], bare, seconds: Math.round((Date.now() - started) / 1000),
  };
}

/**
 * THE RATE TABLE. Per (block, pool): the firing share over the whole corpus and per TIER,
 * both in basis points, both with their own N so a reader can recompute either.
 * @param {{towns: Array<object>}} run
 * @returns {{rows: Array<object>, tiers: Array<[string, number]>}}
 */
export function rateTable(run) {
  /** @type {Map<string, number>} */
  const byTier = new Map();
  for (const town of run.towns) byTier.set(town.tier, (byTier.get(town.tier) || 0) + 1);
  /** @type {Map<string, {total: number, tiers: Map<string, number>}>} */
  const counts = new Map();
  for (const town of run.towns) {
    for (const key of new Set(town.fired.map((f) => `${f.block} ${f.pool}`))) {
      let seat = counts.get(key);
      if (!seat) { seat = { total: 0, tiers: new Map() }; counts.set(key, seat); }
      seat.total += 1;
      seat.tiers.set(town.tier, (seat.tiers.get(town.tier) || 0) + 1);
    }
  }
  const n = run.towns.length;
  const rows = [...counts].map(([key, seat]) => {
    const [block, pool] = key.split(' ');
    const interval = wilsonBp(seat.total, n);
    return {
      block,
      pool,
      towns: seat.total,
      n,
      rateBp: interval.rateBp,
      loBp: interval.loBp,
      hiBp: interval.hiBp,
      byTier: Object.fromEntries([...byTier].map(([tier, tierN]) => [tier, {
        towns: seat.tiers.get(tier) || 0, n: tierN, rateBp: wilsonBp(seat.tiers.get(tier) || 0, tierN).rateBp,
      }])),
    };
  }).sort((a, b) => b.towns - a.towns || (a.block < b.block ? -1 : 1));
  return { rows, tiers: [...byTier].sort((a, b) => b[1] - a[1]) };
}

/**
 * THE PER-TIER SILENCE FINDINGS, CLASSIFIED (SITTING §O.5, ARCH §16 item 7). A pool that
 * never fires at a tier where its BLOCK MOUNTS is a per-tier finding: a hamlet with no walls
 * is LAWFUL silence, and a city block dark at city is a MISSING-AT-TIER row the authoring
 * wave inherits. §O.5 asks the lane to mark the lawful ones by reading the field's domain,
 * so here is the ground, stated before the code and not after:
 *
 *   THE RUNG is a pool's own (block, key function) — the ladder that produced its key. Where
 *   the census recovered no key function the rung falls back to the BLOCK, which is coarser,
 *   and every row says which grain answered it.
 *
 *   LAWFUL · `value-class` — some OTHER pool of the SAME RUNG fired at that tier. The ladder
 *   RAN there and chose a different value class, so the field cannot hold this pool's firing
 *   value at that size on this corpus. That is `walls at a thorp` exactly: `wallRationale`
 *   answers UNWALLED-SMALL on 128 thorps and never WALLED-anything.
 *
 *   MISSING-AT-TIER · `rung-dark` — NO pool of the rung fired at that tier at all, though the
 *   block mounts there. The reader gets silence at that size from a rung that speaks at every
 *   other, which is the wave's row.
 *
 * ⚠ WHAT LAWFUL MEANS HERE, EXACTLY: the value class does not occur at that size on 128
 * towns per tier. It is a MEASUREMENT of the shipped generator and never a proof, and the
 * count ships with its N so the chair reads it as one.
 * @param {Array<object>} rateRows
 * @param {Array<[string, number]>} tiers
 * @param {Map<string, string[]>} sitesByBlock
 * @param {ReadonlyArray<object>} [censusRows] the census, for each pool's key function
 * @returns {Array<{block: string, pool: string, tier: string, firedOverall: number,
 *   sites: number, verdict: string, limb: string, rung: string, grain: string}>}
 */
export function tierSilences(rateRows, tiers, sitesByBlock, censusRows) {
  /** @type {Map<string, string>} `block :: pool` to the key function the census recovered */
  const keyFunctionOf = new Map();
  for (const row of censusRows || []) keyFunctionOf.set(`${row.block} :: ${row.pool}`, row.keyFunction || '');
  /** @type {Map<string, Set<string>>} block to the RUNG KINDS the census recovered on it */
  const rungKinds = new Map();
  for (const row of censusRows || []) {
    if (!rungKinds.has(row.block)) rungKinds.set(row.block, new Set());
    (rungKinds.get(row.block) || new Set()).add(row.rung);
  }
  /** @param {object} row @returns {{id: string, grain: string}} */
  const rungOf = (row) => {
    const fn = keyFunctionOf.get(`${row.block} :: ${row.pool}`) || '';
    return fn ? { id: `${row.block} :: ${fn}`, grain: 'keyFunction' } : { id: `${row.block} :: (block)`, grain: 'block' };
  };
  /** @type {Map<string, Set<string>>} tier to the rungs that spoke at it */
  const spokeAt = new Map();
  /** @type {Map<string, Set<string>>} tier to the BLOCKS that spoke at it, through any rung */
  const blockSpokeAt = new Map();
  for (const [tier] of tiers) { spokeAt.set(tier, new Set()); blockSpokeAt.set(tier, new Set()); }
  for (const row of rateRows) {
    for (const [tier] of tiers) {
      if ((row.byTier[tier]?.towns || 0) === 0) continue;
      (spokeAt.get(tier) || new Set()).add(rungOf(row).id);
      (blockSpokeAt.get(tier) || new Set()).add(row.block);
    }
  }
  /** @type {Array<{block: string, pool: string, tier: string, firedOverall: number, sites: number, verdict: string, limb: string, rung: string, grain: string}>} */
  const out = [];
  for (const row of rateRows) {
    const sites = sitesByBlock.get(row.block) || [];
    if (sites.length === 0) continue;
    const rung = rungOf(row);
    for (const [tier] of tiers) {
      if ((row.byTier[tier]?.towns || 0) > 0) continue;
      const lawful = (spokeAt.get(tier) || new Set()).has(rung.id);
      out.push({
        block: row.block,
        pool: row.pool,
        tier,
        firedOverall: row.towns,
        sites: sites.length,
        verdict: lawful ? 'LAWFUL' : 'MISSING-AT-TIER',
        limb: lawful ? 'value-class' : 'rung-dark',
        rung: rung.id,
        grain: rung.grain,
        // ⚠ THE OVER-COUNT LIMB, DECLARED AND COUNTED RATHER THAN CURED. A block whose
        // ladder splits across a module-level key table and the function that carries its
        // `||` fallback is TWO rung ids to this instrument and ONE ladder to the reader:
        // `originTierPoolKey` answers `tier overlay: other tiers` while `TIER_OVERLAY_OF`
        // answers the named tiers, so each looks dark where the other spoke. This bit says
        // the pool's BLOCK spoke at that tier through some other rung, which is the shape
        // that flag catches, and it is a number in the print rather than a silent cure.
        siblingRungSpoke: !lawful && (blockSpokeAt.get(tier) || new Set()).has(row.block),
        splitLadder: !lawful && (rungKinds.get(row.block) || new Set()).has('table')
          && [...(rungKinds.get(row.block) || new Set())].some((k) => k === 'literal' || k === 'template'),
      });
    }
  }
  return out;
}

/** @param {number} n @param {number} rateBp @returns {string} */
const share = (n, rateBp) => `${n} (${rateBp} bp)`;

/**
 * WHAT A PAIR MEMBER IS, and why the whole distribution cannot be read as facts (the
 * car-10 cure-4 lesson, applied to the pair table). `coOccurringPairs` builds a town's
 * facts from the PREDICATE fields of the keys that fired, and two of those field shapes
 * are the instrument's own bookkeeping rather than a reading of the world:
 *
 *   `synthetic` the TABLE rung writes `"<reader> (via <TABLE> in <file>)"` as its field, so
 *               a pair over one is a pair over a label this census invented
 *   `unrooted`  a bare key-function PARAMETER no call site supplied a traceable argument
 *               for (`axis`, `label`, `granary`). It matches no held reading and the same
 *               token appears in several composers, so pairing on it joins two desks that
 *               were never talking about one fact
 *
 * A pair is USABLE only when BOTH members are dotted, re-rooted reading paths. Both counts
 * ship: the chair sets the floor from the usable distribution and can see what was excluded.
 * @param {string} field
 * @returns {'synthetic'|'unrooted'|'fact'}
 */
export function pairMemberClass(field) {
  if (String(field).includes(' (via ')) return 'synthetic';
  return String(field).includes('.') ? 'fact' : 'unrooted';
}

/** The entry point. */
async function main() {
  const argv = process.argv.slice(2);
  const outAt = argv.indexOf('--out');
  const wizardN = argv.includes('--no-wizard') ? 0 : Number(
    argv.includes('--wizard') ? argv[argv.indexOf('--wizard') + 1] : SEEDS_PER_CELL * 192,
  );
  const grid = rateGrid();
  console.log(`RATE CORPUS · threat ${THREAT_AXIS.length} x route ${ROUTE_AXIS.length}`
    + ` x tier ${TIER_AXIS.length} = ${THREAT_AXIS.length * ROUTE_AXIS.length * TIER_AXIS.length} cells`
    + ` x ${SEEDS_PER_CELL} seeds = ${grid.length} towns`);
  const run = runCorpus(grid);
  console.log(`  generated ${run.towns.length} of ${grid.length} (generator throws ${run.genThrows})`
    + ` in ${run.seconds} s · desk throws ${run.deskThrows.length ? run.deskThrows.map(([k, v]) => `${k} ${v}`).join(' · ') : 'none'}`
    + ` · general-desk bare sentences ${run.bare}`);
  const table = rateTable(run);
  console.log(`  tier marginals: ${table.tiers.map(([t, n]) => `${t} ${n}`).join(' · ')}`);
  const threats = new Map();
  const routes = new Map();
  for (const town of run.towns) {
    threats.set(town.threat, (threats.get(town.threat) || 0) + 1);
    routes.set(town.route, (routes.get(town.route) || 0) + 1);
  }
  // ⚠ THE AXIS IS UNIFORM AND THE RESOLVED VALUE IS NOT, and both are printed. The grid
  // asks for 192 towns at each of the four threat CHOICES and 96 at each of the eight route
  // choices; `random_threat` and `random_trade` then roll from the shipped weighted pools,
  // so the RESOLVED marginals below are the configuration space as the engine realises it.
  console.log(`  requested per threat choice ${grid.length / THREAT_AXIS.length}`
    + ` · per route choice ${grid.length / ROUTE_AXIS.length} · per tier ${grid.length / TIER_AXIS.length}`);
  console.log(`  threat marginals (resolved): ${[...threats].sort().map(([t, x]) => `${t} ${x}`).join(' · ')}`);
  console.log(`  route marginals (resolved): ${[...routes].sort().map(([t, x]) => `${t} ${x}`).join(' · ')}`);
  console.log(`  pools that fired: ${table.rows.length} of 708`);

  const census = await buildCensus();
  const n0 = run.towns.length;
  /** @type {Map<string, string[]>} */
  const sitesByBlock = new Map();
  for (const row of census.rows) if (!sitesByBlock.has(row.block)) sitesByBlock.set(row.block, row.sites || []);
  const silences = tierSilences(table.rows, table.tiers, sitesByBlock, census.rows);
  const lawful = silences.filter((s) => s.verdict === 'LAWFUL');
  const missingAtTier = silences.filter((s) => s.verdict === 'MISSING-AT-TIER');
  const coarse = silences.filter((s) => s.grain === 'block');
  console.log(`  PER-TIER SILENCE FINDINGS: ${silences.length} (pool, tier) rows where a MOUNTED block's pool`
    + ' fired somewhere and never at that tier');
  console.log(`    LAWFUL (value-class: the rung spoke at that tier and chose another class) ${lawful.length}`
    + ` · MISSING-AT-TIER (rung-dark: the rung said nothing at that size) ${missingAtTier.length}`
    + ` · of ${silences.length}, at ${Math.round(n0 / TIER_AXIS.length)} towns per tier`);
  console.log(`    rows resting on the coarser BLOCK grain because the census recovered no key function: ${coarse.length}`);
  console.log(`    of the ${missingAtTier.length} MISSING-AT-TIER rows, those whose BLOCK spoke at that tier through`
    + ` another rung: ${missingAtTier.filter((s) => s.siblingRungSpoke).length}`
    + ' — so no BLOCK is dark at a size on this corpus and only a RUNG is,'
    + ` and ${missingAtTier.filter((s) => s.splitLadder).length} sit on a block whose ladder SPLITS across a key table`
    + ' and the function carrying its fallback, where the two halves cannot see each other');
  const byBlock = new Map();
  for (const s of missingAtTier) byBlock.set(s.block, (byBlock.get(s.block) || 0) + 1);
  console.log(`    MISSING-AT-TIER by block: ${[...byBlock].sort((a, b) => b[1] - a[1]).map(([b, n]) => `${b} ${n}`).join(' · ')}`);
  for (const s of missingAtTier.slice(0, 12)) console.log(`    MISSING-AT-TIER ${s.block} :: ${s.pool} — silent at ${s.tier} (fired on ${s.firedOverall} towns overall)`);
  for (const s of lawful.slice(0, 4)) console.log(`    LAWFUL          ${s.block} :: ${s.pool} — silent at ${s.tier} (its rung ${s.rung} spoke there)`);

  // THE DEPARTURE BIT, AS A REPORT AND NOTHING ELSE (ARCH E-F14a, §4.3). The 10 % line is
  // an ESTIMATE until the MODIFIER candidates' own rates exist; no leaf is written here.
  const departure = table.rows.filter((r) => r.rateBp < 1000);
  console.log(`  DEPARTURE bits at the 10 % report line: ${departure.length} of ${table.rows.length} fired pools`
    + ` would read 1 (uncommon); ${table.rows.length - departure.length} would read 0`);

  const pairs = coOccurringPairs({
    firings: run.towns.map((t) => t.fired), rows: census.rows, minTowns: 1,
  });
  const n = n0;
  const bound = wilsonFloorCount(n, 500);
  const withInterval = pairs.pairs.map((p) => ({
    ...p,
    ...wilsonBp(p.towns, n),
    aClass: pairMemberClass(p.a),
    bClass: pairMemberClass(p.b),
    usable: pairMemberClass(p.a) === 'fact' && pairMemberClass(p.b) === 'fact',
  }));
  const usable = withInterval.filter((p) => p.usable);
  const clearing = withInterval.filter((p) => p.loBp >= 500);
  const usableClearing = usable.filter((p) => p.loBp >= 500);
  console.log(`  CO-OCCURRING FACT PAIRS WITH NO POOL: ${withInterval.length} distinct pairs over ${n} towns`);
  console.log(`    the Wilson 95 % lower bound clears 5 % at >= ${bound} of ${n} towns`);
  console.log(`    ALL pairs clearing the bound: ${clearing.length} of ${withInterval.length}`);
  console.log(`    USABLE pairs (both members a dotted reading path): ${usable.length}`
    + ` · clearing the bound ${usableClearing.length}`);
  const excluded = withInterval.length - usable.length;
  console.log(`    excluded as the instrument's own labels: ${excluded}`
    + ` (a table-rung synthetic label on ${withInterval.filter((p) => p.aClass === 'synthetic' || p.bClass === 'synthetic').length},`
    + ` an unrooted bare parameter on ${withInterval.filter((p) => p.aClass === 'unrooted' || p.bClass === 'unrooted').length})`);
  const buckets = [1, 8, 39, 77, 154, 385, 768];
  const spread = (rows) => buckets.map((b, i) => {
    const hi = buckets[i + 1] ?? Infinity;
    return `[${b}${hi === Infinity ? '+' : `-${hi - 1}`}] ${rows.filter((p) => p.towns >= b && p.towns < hi).length}`;
  }).join(' · ');
  console.log(`    distribution, ALL:    ${spread(withInterval)}`);
  console.log(`    distribution, USABLE: ${spread(usable)}`);
  console.log('    the twenty most frequent USABLE pairs, with their intervals:');
  for (const p of usable.slice(0, 20)) {
    console.log(`    ${share(p.towns, p.rateBp).padStart(14)} [${p.loBp}, ${p.hiBp}] bp  ${p.a} + ${p.b}`);
  }

  /** @type {object|null} */
  let wizard = null;
  if (wizardN > 0) {
    const wizardRun = runCorpus(wizardGrid(wizardN));
    const wizardTable = rateTable(wizardRun);
    wizard = {
      towns: wizardRun.towns.length,
      seconds: wizardRun.seconds,
      tiers: wizardTable.tiers,
      rows: wizardTable.rows.map((r) => ({ block: r.block, pool: r.pool, rateBp: r.rateBp, towns: r.towns })),
    };
    const byKey = new Map(wizard.rows.map((r) => [`${r.block} ${r.pool}`, r]));
    for (const row of table.rows) {
      const hit = byKey.get(`${row.block} ${row.pool}`);
      row.wizardRateBp = hit ? hit.rateBp : 0;
    }
    console.log(`  WIZARD-DEFAULT REPORT COLUMN: ${wizardRun.towns.length} towns from DEFAULT_CONFIG in ${wizardRun.seconds} s`
      + ` · pools that fired ${wizardTable.rows.length}`);
    console.log(`    tier marginals: ${wizardTable.tiers.map(([t, x]) => `${t} ${x}`).join(' · ')}`);
    const moved = table.rows.filter((r) => Math.abs((r.wizardRateBp || 0) - r.rateBp) >= 1000);
    console.log(`    pools whose two weightings differ by 10 percentage points or more: ${moved.length}`);
    for (const r of moved.slice(0, 10)) console.log(`      ${r.block} :: ${r.pool} — uniform ${r.rateBp} bp · wizard ${r.wizardRateBp} bp`);
  }

  const totalSeconds = run.seconds + (wizard ? wizard.seconds : 0);
  console.log(`  COST: ${run.seconds} s for ${run.towns.length} towns`
    + `${wizard ? ` plus ${wizard.seconds} s for the wizard column` : ''}`
    + ` · ${Math.round((totalSeconds * 1000) / Math.max(1, run.towns.length + (wizard ? wizard.towns : 0)))} ms per town`);

  if (outAt >= 0 && argv[outAt + 1]) {
    writeFileSync(argv[outAt + 1], `${JSON.stringify({
      corpus: {
        kind: 'RATE',
        threatAxis: THREAT_AXIS,
        routeAxis: ROUTE_AXIS,
        tierAxis: TIER_AXIS,
        cells: THREAT_AXIS.length * ROUTE_AXIS.length * TIER_AXIS.length,
        seeds: SEEDS_PER_CELL,
        towns: run.towns.length,
        genThrows: run.genThrows,
        deskThrows: run.deskThrows,
        bareSentences: run.bare,
        seconds: run.seconds,
        tierMarginals: table.tiers,
        threatMarginals: [...threats].sort(),
        routeMarginals: [...routes].sort(),
      },
      rows: table.rows,
      tierSilences: silences,
      departureReport: { lineBp: 1000, uncommon: departure.length, common: table.rows.length - departure.length },
      pairs: {
        n,
        boundCount: bound,
        clearing: clearing.length,
        usable: usable.length,
        usableClearing: usableClearing.length,
        rows: withInterval,
      },
      wizard,
    }, null, 2)}\n`);
    console.log(`  wrote ${argv[outAt + 1]}`);
  }
}

if (process.argv[1] && process.argv[1].endsWith('prose-rate-corpus.mjs')) await main();
