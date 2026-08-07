/**
 * observed-shape-corpus.mjs — THE EXECUTED KEY CENSUS.
 *
 * The reader-with-no-writer class (TCD-1/2/3, and the recorded
 * `faction-key-defect-class`) is invisible to types and invisible to review: the
 * read is defensively guarded, so a key no writer produces degrades to a default
 * instead of throwing. The only authority on which keys a record shape ACTUALLY
 * carries is a real run of the real producers. This module is that run.
 *
 * ⚠ DERIVE, DO NOT RESTATE. Nothing in this file transcribes a key name into a
 * fixture. Every key in the corpus is read off an object a shipped producer just
 * built. A fixture that mirrors the deriver produces dead arms (recorded class,
 * 2026-07); a hand-restated derivable goes stale and greens a shrink-only walker
 * (recorded class, 2026-08-06). The three producers are:
 *
 *   1. `generateSettlementPipeline` over a MULTI-SEED × MULTI-CONFIG corpus. A
 *      single seed is vacuous here: `modifier`, `isGoverning`, `modifiers` and
 *      `legitimacyCrisis` are all situational and appear in some seeds only. THE
 *      RULE IS UNION, NEVER INTERSECTION — a key present in ANY run is written,
 *      and only a key present in NO run is a finding. Getting that backwards
 *      floods the walker with false positives and gets it turned off.
 *   2. `simulateCampaignWorldPulse` over those REAL generated saves, with every
 *      discovered `*Enabled` simulation rule LIT, for N intervals. Lighting the
 *      flags is a coverage decision in the SAFE direction: more writers run,
 *      more keys observed, fewer false findings.
 *   3. `applyRealmVerbOrder` driving FORCE_FOUND_STEADING. The satellite
 *      founding gate (seeding integrator + cooldown + tier cap) is not reached
 *      by the pulse corpus above — 40 intervals mint zero steadings — so the
 *      SatelliteRecord shape would be absent from the corpus and every read of
 *      it would go unmeasured. The verb path is the SAME mint (`mintSteading`)
 *      and the SAME ledger fold the organic path uses ("force ≡ organic by
 *      construction", settlementLifecycleKernel.js), so the record it produces
 *      is the record the engine writes. Only the ORDER is authored here; every
 *      key on the resulting record comes from the shipped writer.
 *
 * ── SHAPE IDENTITY, AND WHY DICTIONARIES ARE TRANSPARENT ────────────────────
 * A shape is named by the CONTAINER KEY the object was found under (array
 * indices collapse: `powerStructure.factions[]` rows are shape `factions`).
 * Id-keyed maps would poison that: `spatialLedgers.satellites` is
 * `{ [parentId]: ParentSatellites }`, so naively the shape called `satellites`
 * would have the parent ids as its "keys" and every real read of it would look
 * like a finding.
 *
 * Dictionaries are therefore detected STRUCTURALLY and made TRANSPARENT — their
 * values inherit the dictionary's own name, and their id keys never enter the
 * corpus. The detector is derived, not a list: a path is a dictionary when it
 * has 2+ children, every child is a plain object, and the children's key sets
 * agree (mean pairwise Jaccard ≥ 0.6). `satellites` and `steadings` both
 * classify; `powerStructure` (factions[] / conflicts[] / publicLegitimacy{})
 * does not, because its children disagree.
 *   ACCEPTED COST, recorded rather than hidden: a genuine RECORD whose every
 *   field holds a same-shaped object would misclassify as a dictionary and lose
 *   its own key set. Nothing in the measured corpus does, and the failure is in
 *   the quiet direction (a shape drops out; no false finding is minted).
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const require_ = createRequire(import.meta.url);
export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** Seeds and configs. Both axes matter: situational keys need seed spread, and
 *  tier/terrain/route spread reaches arms a single town never enters. */
export const SEEDS = Object.freeze(['osr-a', 'osr-b', 'osr-c', 'osr-d']);
export const CONFIGS = Object.freeze([
  { settType: 'town', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road' },
  { settType: 'city', culture: 'nordic', terrainOverride: 'coastal', tradeRouteAccess: 'river' },
  { settType: 'village', culture: 'celtic', terrainOverride: 'forest', tradeRouteAccess: 'isolated' },
  { settType: 'town', culture: 'mediterranean', terrainOverride: 'mountain', tradeRouteAccess: 'mountain_pass' },
]);

/** Intervals of `simulateCampaignWorldPulse` driven over the generated saves. */
export const PULSE_INTERVALS = 12;

/** Every `<name>Enabled` simulation rule the domain tree reads, DISCOVERED from
 *  source rather than listed, so a new flag lights itself. */
export function discoverSimulationFlags(readFileSync, globFiles) {
  const flags = new Set();
  for (const abs of globFiles) {
    const src = readFileSync(abs, 'utf8');
    for (const m of src.matchAll(/simulationRules[^\n]{0,40}?\.([A-Za-z][A-Za-z0-9]*Enabled)\b/g)) flags.add(m[1]);
    for (const m of src.matchAll(/\b([a-z][A-Za-z0-9]*Enabled)\b\s*[:=]\s*(?:true|false)/g)) flags.add(m[1]);
  }
  return [...flags].sort();
}

// ── The walk ────────────────────────────────────────────────────────────────

/** Path segments join on `|>` — a pair no observed key contains, where a bare `.`
 *  would be split apart by the ids the engine mints (`steading.osr000.99`). */
const SEP = '|>';

/** @typedef {{ instances: number, keys: Map<string, number>, children: Set<string> }} PathNode */

/** Collect per-PATH key sets against a known dictionary set. Array indices
 *  collapse to `[]`; every child of a KNOWN dictionary collapses to `*`. */
function collectPaths(path, value, paths, dicts, seen, depth = 0) {
  if (value == null || depth > 16) return;
  if (Array.isArray(value)) {
    for (const el of value) collectPaths(`${path}[]`, el, paths, dicts, seen, depth + 1);
    return;
  }
  if (typeof value !== 'object') return;
  if (value instanceof Map || value instanceof Set || value instanceof Date) return;
  if (seen.has(value)) return;
  seen.add(value);
  let node = paths.get(path);
  if (!node) { node = { instances: 0, keys: new Map(), children: new Set() }; paths.set(path, node); }
  node.instances += 1;
  const collapsed = dicts.has(path);
  for (const [k, v] of Object.entries(value)) {
    node.keys.set(k, (node.keys.get(k) || 0) + 1);
    node.children.add(k);
    collectPaths(`${path}${SEP}${collapsed ? '*' : k}`, v, paths, dicts, seen, depth + 1);
  }
}

/** Mean pairwise Jaccard over a list of key sets (1 when fewer than two sets). */
function meanJaccard(sets) {
  if (sets.length < 2) return 1;
  let total = 0;
  let pairs = 0;
  for (let i = 0; i < sets.length; i += 1) {
    for (let j = i + 1; j < sets.length; j += 1) {
      const a = sets[i];
      const b = sets[j];
      let inter = 0;
      for (const k of a) if (b.has(k)) inter += 1;
      const union = a.size + b.size - inter;
      total += union ? inter / union : 1;
      pairs += 1;
    }
  }
  return pairs ? total / pairs : 1;
}

/** Structural dictionary detection (see the header for the accepted cost).
 *  MONOTONE: a path once classed a dictionary stays one, so the fixed point below
 *  terminates. */
function dictionaryPaths(paths, known) {
  const dicts = new Set(known);
  for (const [path, node] of paths) {
    if (dicts.has(path)) continue;
    const kids = [...node.children];
    if (kids.length < 2) continue;
    const childNodes = kids.map((k) => paths.get(`${path}${SEP}${k}`)).filter(Boolean);
    if (childNodes.length !== kids.length) continue;       // a primitive child ⇒ a record
    if (childNodes.some((c) => c.keys.size < 2)) continue;  // thin children ⇒ not a record map
    if (meanJaccard(childNodes.map((c) => new Set(c.keys.keys()))) < 0.6) continue;
    dicts.add(path);
  }
  return dicts;
}

/** Resolve the SHAPE NAME of a path: the last real container segment. A `*`
 *  segment is a collapsed dictionary level, so the values inherit the
 *  dictionary's own name. */
export function shapeNameOf(path) {
  let name = '';
  for (const seg of path.split(SEP)) {
    if (seg === '*' || seg === '[]') continue;
    name = seg.replace(/\[\]$/, '');
  }
  return name;
}

/**
 * Fold a set of walked roots into `{ shapeName -> { rows, keys[] } }`.
 *
 * The walk runs to a FIXED POINT because dictionaries nest: the satellites
 * ledger is `satellites[parentId].steadings[satId]`, and until the OUTER map is
 * known to be a dictionary the inner one is scattered across one path per parent
 * — each with a single child, which no structural test can recognise as a map.
 * One pass finds `satellites`, the next finds `steadings` underneath it.
 * @param {Array<{ name: string, value: unknown }>} roots
 */
export function foldCorpus(roots) {
  let dicts = new Set();
  let paths = new Map();
  for (let iter = 0; iter < 8; iter += 1) {
    paths = new Map();
    for (const { name, value } of roots) collectPaths(name, value, paths, dicts, new WeakSet());
    const next = dictionaryPaths(paths, dicts);
    if (next.size === dicts.size) break;
    dicts = next;
  }
  /** @type {Map<string, { rows: number, keys: Set<string> }>} */
  const shapes = new Map();
  /** Names whose container was observed holding an ARRAY. The reader scan needs
   *  this: without it every `factions.map(...)` reads as a key no writer wrote. */
  const arrayShapes = new Set();
  /** Name → the set of PARENT shapes it was observed under. A name with exactly
   *  ONE home is the only kind the reader scan will bind an UNGROUNDED receiver
   *  to: `steadings` lives in one place, so `entry.steadings` is unambiguous,
   *  while `entries`, `plan`, `status` and `result` live everywhere and binding
   *  them by name alone mints thousands of false findings (measured, 2026-08-07:
   *  14,027 against 305 shapes before this rule). */
  /** @type {Map<string, Set<string>>} */
  const homes = new Map();
  for (const [path, node] of paths) {
    if (dicts.has(path)) continue;                          // an id-keyed map is not a shape
    const name = shapeNameOf(path);
    if (!name) continue;
    if (path.endsWith('[]')) arrayShapes.add(name);
    const parentPath = path.split(SEP).slice(0, -1).join(SEP);
    const parent = parentPath ? shapeNameOf(parentPath) : '';
    if (parent && parent !== name) {
      if (!homes.has(name)) homes.set(name, new Set());
      homes.get(name).add(parent);
    }
    let e = shapes.get(name);
    if (!e) { e = { rows: 0, keys: new Set() }; shapes.set(name, e); }
    e.rows += node.instances;
    for (const k of node.keys.keys()) e.keys.add(k);
  }
  /** @type {Record<string, { rows: number, keys: string[] }>} */
  const out = {};
  for (const [name, e] of [...shapes].sort((a, b) => a[0].localeCompare(b[0]))) {
    out[name] = { rows: e.rows, keys: [...e.keys].sort() };
  }
  const singleHome = [...homes].filter(([, v]) => v.size === 1).map(([k]) => k).sort();
  return { shapes: out, arrayShapes: [...arrayShapes].sort(), singleHome };
}

// ── The executed producers ──────────────────────────────────────────────────

/**
 * Run all three producers and fold their output into the corpus.
 * @returns {Promise<{ shapes: Record<string, {rows:number, keys:string[]}>, meta: Record<string, unknown> }>}
 */
export async function buildObservedCorpus({ intervals = PULSE_INTERVALS, quiet = true } = {}) {
  const { generateSettlementPipeline } = await import(`${ROOT}/src/generators/generateSettlementPipeline.js`);
  const { simulateCampaignWorldPulse } = await import(`${ROOT}/src/domain/worldPulse/index.js`);
  const { applyRealmVerbOrder } = await import(`${ROOT}/src/domain/worldPulse/realmVerbExecution.js`);
  const { ensureRegionalGraph } = await import(`${ROOT}/src/domain/region/index.js`);
  const { buildSpatialDigest } = await import(`${ROOT}/src/domain/spatial/index.js`);
  const { makeGridPack, placeSettlements } = await import(`${ROOT}/tests/fixtures/spatialPackFixtures.js`);
  const { readFileSync, readdirSync, statSync } = require_('node:fs');

  const domainFiles = [];
  (function walkDir(d) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) walkDir(p);
      else if (p.endsWith('.js')) domainFiles.push(p);
    }
  }(join(ROOT, 'src/domain')));
  const flags = discoverSimulationFlags(readFileSync, domainFiles);
  const simulationRules = Object.fromEntries(flags.map((f) => [f, true]));

  /** @type {Array<{name:string, value:unknown}>} */
  const roots = [];

  // ── Producer 1: the settlement generator, multi-seed × multi-config. ──
  /** @type {unknown[]} */
  const generated = [];
  for (const cfg of CONFIGS) {
    for (const seed of SEEDS) {
      const s = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
      generated.push(s);
      roots.push({ name: 'settlement', value: s });
    }
  }

  // ── Producer 2: the campaign world pulse over those REAL saves. ──
  const ids = generated.map((_, i) => `osr${String(i).padStart(3, '0')}`);
  const saves = generated.map((settlement, i) => ({
    id: ids[i], name: `Observed ${i}`, phase: 'canon', settlement,
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  }));
  const pack = makeGridPack({ cols: 10, rows: 8 });
  const placed = placeSettlements(pack, ids.length);
  const spatialDigest = buildSpatialDigest({
    pack, placements: placed.map((p, i) => ({ id: ids[i], cellId: p.cellId })),
  });
  const edges = [];
  const channels = [];
  for (let i = 1; i < ids.length; i += 1) {
    const relationshipType = i % 3 === 0 ? 'rival' : 'trade_partner';
    edges.push({ id: `edge.${ids[0]}.${ids[i]}`, from: ids[0], to: ids[i], relationshipType });
    if (relationshipType === 'trade_partner') {
      channels.push({ from: ids[0], to: ids[i], type: 'trade_route', status: 'confirmed', strength: 0.6 });
    }
  }
  let campaign = {
    id: 'observed-shape-corpus', name: 'Observed Shape Corpus', settlementIds: [...ids],
    worldState: {
      rngSeed: 'observed-shape-corpus', tick: 1, simulationRules,
      calendar: { elapsedWeeks: 20, year: 1 },
      spatialCanonVersion: 1, spatialDigest,
      relationshipStates: { [`edge.${ids[0]}.${ids[1]}`]: { relationshipType: 'trade_partner', trust: 0.4, resentment: 0.2 } },
      stressors: [],
    },
    regionalGraph: ensureRegionalGraph({ edges, channels }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  let curSaves = saves;
  for (let i = 0; i < intervals; i += 1) {
    const out = simulateCampaignWorldPulse({
      campaign, saves: curSaves, interval: 'one_month', commit: true, now: '2026-01-01T00:00:00.000Z',
    });
    if (out?.worldState) campaign = { ...campaign, worldState: out.worldState };
    if (out?.wizardNews) campaign = { ...campaign, wizardNews: out.wizardNews };
    if (Array.isArray(out?.saves) && out.saves.length) curSaves = out.saves;
    roots.push({ name: 'pulseResult', value: out });
  }
  roots.push({ name: 'worldState', value: campaign.worldState });
  roots.push({ name: 'wizardNews', value: campaign.wizardNews });
  roots.push({ name: 'campaign', value: { ...campaign, worldState: undefined, wizardNews: undefined } });
  for (const s of curSaves) roots.push({ name: 'save', value: s });

  // ── Producer 3: the steading mint, through the shipped realm verb. ──
  let steadingsMinted = 0;
  const settlementUpdates = new Map(curSaves.map((s) => [String(s.id), { id: s.id, settlement: s.settlement }]));
  const snapshot = { settlements: curSaves.map((s) => ({ id: s.id, settlement: s.settlement })), campaign };
  let verbState = campaign.worldState;
  for (const s of curSaves) {
    const res = applyRealmVerbOrder({
      state: verbState, snapshot, settlementUpdates,
      outcome: { id: `osr:${s.id}`, proposalPayload: { verb: 'FORCE_FOUND_STEADING', args: { parentId: String(s.id) } } },
      tick: 99, now: '2026-01-01T00:00:00.000Z',
    });
    if (res?.refusal) { if (!quiet) console.warn('steading refused', s.id, res.refusal); continue; }
    verbState = res.worldState;
    roots.push({ name: 'worldState', value: res.worldState });
    steadingsMinted += 1;
  }

  const { shapes, arrayShapes, singleHome } = foldCorpus(roots);
  return {
    shapes,
    arrayShapes,
    singleHome,
    /** The names the walk STARTED from. Only these may bind a bare identifier
     *  the resolver could not follow; anything wider binds `window`, `raw` and
     *  `plan` to unrelated corpus shapes. */
    rootShapes: [...new Set(roots.map((r) => r.name))].sort(),
    meta: {
      seeds: SEEDS.length,
      configs: CONFIGS.length,
      generations: generated.length,
      pulseIntervals: intervals,
      simulationFlagsLit: flags.length,
      steadingsMinted,
      shapeCount: Object.keys(shapes).length,
    },
  };
}
