/**
 * tradeListWriters.walker.test.js — EVERY WRITER OF A TOWN'S TRADE LISTS, BY A CENSUS IN SOURCE (COHERENCE-AGREE-8,
 * REVIEW-AGREE-3 FINDING 2: a fifth writer, the institutional services, listed "Financial services (letters of
 * credit)" beside an impaired bank card; the hand-back had counted four).
 *
 * THE RULE (COHERENCE-AGREE-6, F2, the chair's ruling of 2026-11-12): a good only refused chains make
 * (`domain/chainYield.js :: goodsOnlyRefusedChainsMake`) stands on neither `economicState.primaryExports` nor
 * `economicState.localProduction`. The receipt's member ("A trade list carries a good only a refused chain makes",
 * `generationCoherence.js`) judges the FINAL lists, so it judges every writer's good, whatever wrote it; this walker
 * holds the WRITERS, so that a sixth cannot stand unseen.
 *
 * A WRITER is a line, in a file of the product's roots (the same roots as chainPrintSites.walker), that pushes,
 * splices, empties or assigns `primaryExports` / `localProduction`, or builds an object with either key. Every file
 * that holds one is classed below with the number of such lines (a new line in a classed file reds: re-class it):
 * - ASKS: the file reads the leaf's set, or writes only what a writer that reads it returns.
 * - TAKES_AWAY: it filters, splices, empties or re-folds a list it is given; it adds no good.
 * - USER: the good is the user's own word (a forced trade good, a custom trade endpoint).
 * - ADDS_UNASKED: it adds a good without the leaf, by a rule of its own; the receipt's member judges it on the final
 *   list (measured on the lane's 4,141 at COHERENCE-AGREE-8: 0 findings).
 * - COPIES: it copies, reads or projects the record's list (a view model, a prop, a fingerprint, a prose reader).
 * - FIXTURE: a probe's or a soak's hand-built town.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ROOTS = ['src', 'foundry-module', 'supabase', 'mcp-server', 'api', 'scripts', 'tools', 'schema'];
const EMITTED = /^supabase\/functions\/_shared\/\w+Bundle\.js$/;

/** file → [class, the writer lines it holds, the reason] */
const WRITERS = Object.freeze({
  'src/generators/economy/economicState.js': ['ASKS', 8, 'the chain-derived exports, the institutional services and the export bonus each ask the leaf (`goodsOnlyRefusedChainsMake`); the military and slave-trade streams name the institution\'s trade, which no chain makes; the rest return the lists'],
  'src/domain/worldPulse/resourceDynamicsKernel.js': ['ASKS', 3, 'a resource transition re-derives both lists through `deriveExportsFromChains` and `deriveLocalProductionFromChains`, which ask the leaf'],
  'src/generators/economy/primaryTradeLists.js': ['USER', 5, 'the pre-chain exports, which economicState replaces with the chain-derived list; the forced and forbidden goods are the user\'s (`goodsToggles`)'],
  'src/generators/economy/customTradeEndpointIntegration.js': ['USER', 5, 'the user\'s custom trade goods and endpoints'],
  'src/domain/content/customTradeEndpointProjection.js': ['USER', 1, 'the user\'s custom trade endpoints'],
  'src/generators/steps/economyReconcilePass.js': ['TAKES_AWAY', 2, 'subsumes and reconciles the list it is given'],
  'src/generators/steps/generateEconomy.js': ['TAKES_AWAY', 2, 'keeps and folds the list it is given'],
  'src/domain/worldPulse/calamityKernel.js': ['TAKES_AWAY', 2, 'drops the exports a severed chain no longer makes'],
  'src/generators/economy/neighbourEconomicBias.js': ['ADDS_UNASKED', 3, 'a dependent economy exports the good its patron weights; trims the list to its cap'],
  'src/generators/economy/tradeGoods.js': ['COPIES', 1, 'a local list of the land\'s commodities, read for the necessity imports'],
  'src/generators/historyGenerator.js': ['COPIES', 1, 'the history\'s economic context'],
  'src/generators/neighbourGenerator.js': ['COPIES', 1, 'a neighbour\'s record read'],
  'src/generators/resourceGenerator.js': ['COPIES', 1, 'the analysis\'s context'],
  'src/domain/worldPulse/warCosts.js': ['COPIES', 1, 'the goods a war can cost, read'],
  'src/domain/region/deriveRegionalState.js': ['COPIES', 2, 'the regional projection'],
  'src/domain/prose/holderTable.js': ['COPIES', 2, 'the table of each field\'s writer'],
  'src/domain/display/stateProse/economyStateProse.js': ['COPIES', 2, 'the economy prose\'s read'],
  'src/domain/display/visibilityAudit.js': ['COPIES', 1, 'a visibility audit\'s view'],
  'src/lib/structuralFingerprint.js': ['COPIES', 1, 'the fingerprint\'s good ids'],
  'src/pdf/lib/viewModel.js': ['COPIES', 1, 'the PDF view model'],
  'src/pdf/lib/viewModelBodySlices.js': ['COPIES', 2, 'the PDF view model\'s economics slice'],
  'src/pdf/sections/EconomicsTrade.jsx': ['COPIES', 1, 'a prop: the record\'s list handed to a section'],
  'src/pdf/sections/SupplyChainFlow.jsx': ['COPIES', 4, 'props: the record\'s list handed down the flow'],
  'src/components/compendium/SupplyChainsManager.jsx': ['COPIES', 2, 'the Compendium\'s props'],
  'scripts/audit/religion-coup-soak.mjs': ['FIXTURE', 1, 'a soak\'s hand-built town'],
  'scripts/audit/religion-plane-soak.mjs': ['FIXTURE', 3, 'a soak\'s hand-built towns'],
  'scripts/audit/religion-soak.mjs': ['FIXTURE', 3, 'a soak\'s hand-built towns'],
  'scripts/audit/story-census.mjs': ['FIXTURE', 1, 'a census\'s hand-built town'],
  'scripts/audit/war-cluster-soak.mjs': ['FIXTURE', 1, 'a soak\'s hand-built town'],
  'scripts/probe-ej-family2.mjs': ['FIXTURE', 1, 'a probe\'s hand-built town'],
});
const ASKS_LEAF = /\bgoodsOnlyRefusedChainsMake\b|\bderiveExportsFromChains\b|\bderiveLocalProductionFromChains\b/;

const codeOf = (/** @type {string} */ s) => s
  .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  .replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');
const WRITES = /\b(?:primaryExports|localProduction)\b\s*(?:\.\s*(?:push|unshift|splice)\(|\.length\s*=\s*0|=(?![=>]))|\b(?:primaryExports|localProduction)\s*:(?!:)/;
const writerLines = (/** @type {string} */ code) => code.split('\n').filter((l) => WRITES.test(l)).length;
/** @param {string} dir @param {string[]} out @returns {string[]} */
const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir).sort()) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) { if (entry !== 'node_modules') walk(path, out); } else out.push(path);
  }
  return out;
};
const files = ROOTS.filter((r) => existsSync(join(ROOT, r))).flatMap((d) => walk(join(ROOT, d)))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
  .filter((f) => /\.(?:m?js|cjs|jsx|ts|tsx)$/.test(f) && !/\.d\.ts$/.test(f) && !EMITTED.test(f));
const source = (/** @type {string} */ f) => codeOf(readFileSync(join(ROOT, f), 'utf8'));
const writers = new Map(files.map((f) => [f, writerLines(source(f))]).filter(([, n]) => Number(n) > 0));

describe('F2: every writer of the trade lists is classed, and the ones that add a chain\'s good ask the leaf', () => {
  test('guard-the-guard: the pattern sees a push, a splice, an emptying, an assignment and a key; not a read', () => {
    expect(writerLines('primaryExports.push(x);\nlocalProduction.splice(0, 1);\neco.primaryExports.length = 0;\neco.localProduction = [];\nconst o = { primaryExports: a };')).toBe(5);
    expect(writerLines('const n = eco.primaryExports.length;\nif (eco.primaryExports === b) f();\nconst f = (primaryExports) => primaryExports.map(g);')).toBe(0);
    expect(files.length).toBeGreaterThan(2500);
  });
  test('no file writes a trade list outside the census', () => {
    expect(writers.size, 'anti-vacuity').toBeGreaterThanOrEqual(25);
    expect([...writers.keys()].filter((f) => !(f in WRITERS))).toEqual([]);
  });
  test('a classed file holds no more writer lines than its row (a new one is a new writer to class)', () => {
    expect(Object.entries(WRITERS).filter(([f, [, n]]) => (writers.get(f) || 0) > n).map(([f, [, n]]) => `${f}: ${writers.get(f)} > ${n}`)).toEqual([]);
  });
  test('every ASKS file reads the leaf\'s set or a writer that reads it; every row is live and has its reason', () => {
    expect(Object.entries(WRITERS).filter(([f, [k]]) => k === 'ASKS' && !ASKS_LEAF.test(source(f))).map(([f]) => f)).toEqual([]);
    expect(Object.keys(WRITERS).filter((f) => !writers.has(f)), 'a stale row').toEqual([]);
    for (const [k, , reason] of Object.values(WRITERS)) {
      expect(['ASKS', 'TAKES_AWAY', 'USER', 'ADDS_UNASKED', 'COPIES', 'FIXTURE']).toContain(k);
      expect(reason.length).toBeGreaterThan(10);
    }
  });
  test('the five writers that add a chain\'s good read the one set', () => {
    // the export bonus, the land's raw goods, the chain exports, "Produced locally" and the institutional services
    const cac = source('src/generators/computeActiveChains.js');
    expect(cac).toMatch(/export function deriveServiceExports\(institutionalServices, refusedOnly = new Set\(\)\)/);
    expect(cac.match(/goodsOnlyRefusedChainsMake\(activeChains/g)?.length, 'the exports and "Produced locally"').toBe(2);
    const eco = source('src/generators/economy/economicState.js');
    expect(eco).toMatch(/deriveServiceExports\(instServices, goodsOnlyRefusedChainsMake\(activeChainsList\)\)/);
    expect(eco).toMatch(/refusedOnly: goodsOnlyRefusedChainsMake\(activeChainsList\)/);
    expect(source('src/generators/economy/finishedGoodsDemand.js')).toMatch(/refusedOnly = new Set\(\)/);
  });
});
