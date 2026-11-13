/**
 * chainPrintSites.walker.test.js — F1 (COHERENCE-AGREE-6, REVIEW-AGREE-2; the chair's ruling of 2026-11-12: the
 * rename at print time), WIDENED BY COHERENCE-AGREE-8 (REVIEW-AGREE-3 FINDING 1: the walker walked the print surfaces
 * only, and `src/generators/people/goals.js` baked the record's name into an NPC's goal unseen).
 *
 * An active chain's name and source are PRINTED through one leaf, `src/domain/display/chainPrintName.js ::
 * chainPrintName`, which says the toll's access ("River Toll — River traffic" on a river); the record keeps the
 * catalogue's strings.
 *
 * THE ROOTS ARE EVERY ROOT OF PRODUCT CODE, not the print surfaces: words made at birth (a goal, a receipt) print as
 * surely as words made on the page. `ROOTS` below is every top-level directory whose code runs in the product (the
 * app, the PDF, the Foundry export and world importer, the edge functions, the MCP server, the API, the build
 * scripts). `NOT_ROOTS` names every other directory of the repository with its reason; a new top-level directory
 * that holds code and is in neither list reds the walker.
 *
 * WHAT IT SEES (a reader): in a file of a root, a read `.label | .resource | .name | .chainName` of
 *   (A) a binding named `chain` or `ch` (anywhere), or `c` in a file that touches chains;
 *   (B) a binding taken FROM a chain list (`for (const x of …chains…)`, `…chains….map((x) =>`, `const x =
 *       …chains….find(…)`, one step through a local array that holds chains).
 * A chain list is `activeChains`, a `chains` / `…Chains` binding, or the projection `deriveAllSupplyChainStates(…)`.
 * Comments are out. WHAT IT DOES NOT SEE: a chain passed through a parameter whose name says nothing of chains, and
 * read under that name. The instrument that sees what such a reader prints is the sweep
 * (tests/generators/tollNamePrintedEverywhere.test.js): every stored string of the birth and every export it drives.
 *
 * THE LISTS. Every reader is in exactly one:
 * - `PRINT_SITES`: makes words of a chain's name or source, and imports the leaf (shrink-only).
 * - `PROJECTION_READERS`: prints the projection's `name` / `dependencies`, which `deriveSupplyChainState` names
 *   through the leaf; each imports the projection from `supplyChainState.js`.
 * - `EXEMPT`: reads a chain's strings and prints no active chain's name (a logic read the chair's ruling keeps on
 *   the record, the Compendium, a regional path, a custom chain), with its reason and the number of lines it reads
 *   (a new read in an exempt file reds: it is a new reader to classify).
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF = 'src/domain/display/chainPrintName.js';

/** Every directory whose code runs in the product, a page, a PDF or an export. */
const ROOTS = Object.freeze(['src', 'foundry-module', 'supabase', 'mcp-server', 'api', 'scripts', 'tools', 'schema']);
/** Every other top-level directory of the repository that holds code, with its reason. */
const NOT_ROOTS = Object.freeze({
  'tests': 'the test suite',
  'e2e': 'the browser tests',
  'docs': 'records and scratch probes, never shipped',
  'vendor': 'third-party code, not this project\'s',
  'public': 'static assets and built bundles of other packages (the map), never this source',
  'node_modules': 'dependencies',
  '.git': 'the repository',
  '.github': 'CI configuration',
  '.husky': 'git hooks',
  '.claude': 'session configuration',
});
/** Emitted artefacts of the roots: bundles built FROM `src`, held to their source by edgeSharedBundleReproducibility. */
const EMITTED = /^supabase\/functions\/_shared\/\w+Bundle\.js$/;

/** The files that make words of an active chain's name or source, each through the leaf (shrink-only). */
const PRINT_SITES = Object.freeze({
  'src/components/new/tabs/EconomicsTab.jsx': 'the Economic Flows card: its name and its "From" source',
  'src/components/new/tabs/MagicTab.jsx': 'the magic-dependent chains, named beside their note',
  'src/components/new/dailyLifeLogic.js': 'the daily-life context\'s chain names',
  'src/pdf/sections/Services.jsx': 'the PDF\'s Active Supply Chains card: its name and its flow line\'s source',
  'src/pdf/sections/SupplyChainFlow.jsx': 'the PDF\'s Economic Flows node-flow: the source node',
  'src/generators/aiLayer.js': 'the AI layer\'s context line of chain names (a UI call, never stored at birth)',
  'src/generators/people/goals.js': 'an NPC\'s goal ("Get the most out of <chain> …"), written at birth and printed by the NPCs tab, the summary, the PDF and the Foundry journal',
  'src/generators/steps/generateEconomy.js': 'the chain receipts of `simulationTrace` ("Because of Resource: <source>"), printed by the pipeline rail',
  'src/domain/supplyChainState.js': 'the projection\'s `name` and `dependencies`, which the explanation rail and the causal readers print',
  'src/domain/worldPulse/institutionLifecycle.js': 'the growth gap "<chain> currently imports …"',
});

/** Files that print the projection's `name` / `dependencies` (named through the leaf by `deriveSupplyChainState`). */
const PROJECTION_READERS = Object.freeze({
  'src/domain/capacityModel.js': 'the supply contributors ("<chain> runs normally.")',
  'src/domain/causalState.js': 'the causal-state contributors',
  'src/domain/causalViews.js': 'the supply-chain view\'s summary',
  'src/domain/counterfactual.js': 'the counterfactual\'s chain labels',
  'src/domain/dailyLife.js': 'the food chains\' names in the daily-life lines',
  'src/domain/explanation.js': 'the explanation rail\'s chain envelopes and catalogue',
  'src/domain/summary/tonightAtTheTable.js': 'the disrupted supply\'s name, after its need label',
});
const IMPORTS_PROJECTION = /import \{[^}]*\bderive(?:All)?SupplyChainStates?\b[^}]*\} from '[./]+\/(?:domain\/)?supplyChainState\.js';/;

/** Files that read a chain's strings and print no active chain's name: [the lines they read, the reason]. */
const EXEMPT = Object.freeze({
  'src/components/compendium/SupplyChainsManager.jsx': [4, 'the Compendium: catalogue and custom chains in the abstract, no town'],
  'src/components/new/SupplyChainsPanel.jsx': [4, 'the Compendium\'s ChainRow; its `chainFlowFacts` is fed the printed name by its one page caller (EconomicsTab)'],
  'src/lib/prebuiltResourceChains.js': [3, 'the Compendium\'s prebuilt chains, no town'],
  'src/components/map/ChainEdges.jsx': [1, 'regional supply paths between settlements (`chain.path`), not a town\'s chain record'],
  'src/pdf/sections/EconomicsTrade.jsx': [3, 'its own chain reads are the custom chains\' (user-confirmed, §14); the active chains print through SupplyChainFlow, which it hands the town'],
  'src/pdf/sections/ResourcesProduction.jsx': [1, 'resource-exploitation rows (`resourceAnalysis.exploitation`), not active chains'],
  'src/pdf/lib/viewModelBodySlices.js': [2, 'the exploitation rows\' resource names; the chains\' `name` reads `c.name || c.chainName`, which the record never carries, so the flag-off path prints "Chain" (PART FIVE, found, not the lane\'s), never the record\'s label'],
  'src/foundry/journalPages.js': [3, 'the Foundry journal prints the PDF view model\'s chain `name` (viewModelBodySlices: "Chain", above) and the exploitation rows\' resources'],
  'src/pdf/lib/customSupplyChains.js': [2, 'the confirmed custom chains (§14), the user\'s own words'],
  'src/pdf/lib/viewModel.js': [1, 'a logic read (`isArcaneChain`: the label\'s magic words), which stays on the record by the chair\'s ruling'],
  'src/domain/display/stateProse/generalStateProse.js': [1, 'a logic read (`homeFedChain`: the resource against the worked land), which stays on the record'],
  'src/domain/content/customSupplyChainActivation.js': [4, 'the custom chains\' review blockers, the user\'s own chain names'],
  'src/domain/magicReliance.js': [1, 'a logic read (`chainNeedsMagic`: the label\'s magic words)'],
  'src/domain/region/propagation.js': [3, 'a logic read (`matchingGoods`: the resource against the goods catalogue)'],
  'src/domain/worldPulse/resourceDynamicsKernel.js': [1, 'a logic read (`resourceProjection`: the record\'s fields compared across a transition)'],
  'src/domain/worldPulse/supplyCompleteness.js': [1, 'a logic read (`chainGoodIds`: the resource\'s good id)'],
  'src/domain/worldPulse/supplyKernel.js': [2, 'a logic read (`resolveConsumingInstitution`, `countProducingChains`: the resource\'s good id)'],
  'src/domain/worldPulse/stressorGates.js': [1, 'a power\'s name in the conspiracy line: the walker\'s `c` in a file that touches chains, not a chain'],
  'src/domain/chainYield.js': [1, 'a logic read (`chainYieldRefused`: the resource\'s depletion)'],
  'src/domain/display/defenseDisplay.js': [1, 'defence capability rows (`caps`), the walker\'s `c` in a file that touches chains, not a chain'],
  'src/generators/computeActiveChains.js': [6, 'the record\'s writer: it sets the catalogue\'s strings the chair\'s ruling keeps'],
  'src/generators/economy/economicState.js': [1, 'a logic read (`allowsGeneratedContent(label)`)'],
  'src/generators/economy/viability.js': [4, 'a logic read (the resource against the analysis\'s resource names)'],
  [LEAF]: [1, 'the leaf itself, which reads the record'],
});

const codeOf = (/** @type {string} */ s) => s
  .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  .replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');
const TOUCHES = /\bactiveChains\b|\{\s*chains?\b|\bchains\s*[,=)]|\bderive(?:All)?SupplyChainStates?\b/;
const ATTR = String.raw`\??\.(?:label|resource|name|chainName)\b`;
const SOURCE = String.raw`(?:\bactiveChains\b|\bchains\b|\b\w+Chains\b(?!\s*\()|\bchainsByHouse\b|\bderiveAllSupplyChainStates\()`;
const ITER = String.raw`\.(?:map|filter|find|findLast|forEach|some|every|flatMap)\(\s*\(?\s*`;
const escapeRx = (/** @type {string} */ s) => s.replace(/[$]/g, '\\$');

/** The bindings of a file that hold a chain. @param {string} code @returns {Set<string>} */
function chainBindings(code) {
  const items = new Set(['chain', 'ch']);
  if (TOUCHES.test(code)) items.add('c');
  /** @type {Set<string>} */
  const arrays = new Set();
  for (let pass = 0; pass < 2; pass++) {
    const src = arrays.size ? `(?:${SOURCE}|\\b(?:${[...arrays].map(escapeRx).join('|')})\\b)` : SOURCE;
    for (const m of code.matchAll(new RegExp(String.raw`(?:const|let)\s+(\w+)\s*=\s*[^;\n=]*${src}[^;\n]*`, 'g'))) {
      if (/\.(?:find|findLast)\(|\[\d+\]/.test(m[0])) items.add(m[1]); else arrays.add(m[1]);
    }
    for (const m of code.matchAll(new RegExp(String.raw`${src}[\w.?\])]*\s*${ITER}(\w+)`, 'g'))) items.add(m[1]);
    for (const m of code.matchAll(new RegExp(String.raw`for\s*\(\s*(?:const|let)\s+(\w+)\s+of\s+[^)\n]*${src}`, 'g'))) items.add(m[1]);
  }
  return items;
}
/** The lines of a file that read a chain's strings. @param {string} code */
function readLines(code) {
  const names = [...chainBindings(code)].map(escapeRx).join('|');
  const rx = new RegExp(String.raw`\b(?:${names})${ATTR}`);
  return code.split('\n').filter((l) => rx.test(l));
}

/** @param {string} dir @param {string[]} out @returns {string[]} */
const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir).sort()) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) { if (entry !== 'node_modules') walk(path, out); } else out.push(path);
  }
  return out;
};
const CODE = /\.(?:m?js|cjs|jsx|ts|tsx)$/;
const files = ROOTS.filter((r) => existsSync(join(ROOT, r))).flatMap((d) => walk(join(ROOT, d)))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
  .filter((f) => CODE.test(f) && !/\.d\.ts$/.test(f) && !EMITTED.test(f));
const source = (/** @type {string} */ f) => codeOf(readFileSync(join(ROOT, f), 'utf8'));
const readers = new Map(files.map((f) => [f, readLines(source(f)).length]).filter(([, n]) => Number(n) > 0));
const IMPORTS_LEAF = /import \{[^}]*\bchainPrintName\b[^}]*\} from '[./]+\/(?:domain\/)?display\/chainPrintName\.js';/;

describe('F1: every file that makes words of an active chain\'s name or source asks the leaf', () => {
  test('guard-the-guard: the patterns see a chain held under any name taken from a chain list, and the imports', () => {
    expect(readLines('const chains = eco.activeChains || [];\nconst x = <span>{chain.label}</span>;')).toHaveLength(1);
    expect(readLines('for (const row of s.economicState.activeChains) out.push(`${row.label} runs`);')).toHaveLength(1);
    expect(readLines('const own = ctx.chainsByHouse.get(k) || [];\nown.filter((x) => x.ok).map((y) => y.resource);\nfor (const z of own) say(z.label);')).toHaveLength(1);
    expect(readLines('const toll = econ.activeChains.find((q) => q.chainId === id);\nsay(toll.label);')).toHaveLength(1);
    expect(readLines('const bad = deriveAllSupplyChainStates(s)\n  .filter(ok);\nconst f = bad[0];\nsay(f.name);')).toHaveLength(1);
    expect(readLines('export const goal = (ch) => `Wants ${ch.label}`;')).toHaveLength(1);
    expect(readLines('const shown = chainPrintName(chain, town);\nsay(shown.label);')).toHaveLength(0);
    expect(readLines('const f = factions.map((p) => p.name);')).toHaveLength(0);
    expect(IMPORTS_LEAF.test("import { chainPrintName } from '../../domain/display/chainPrintName.js';")).toBe(true);
    expect(IMPORTS_LEAF.test("import { chainPrintName } from './display/chainPrintName.js';")).toBe(true);
    expect(IMPORTS_PROJECTION.test("import { deriveAllSupplyChainStates } from './supplyChainState.js';")).toBe(true);
    expect(files.length, 'the roots are walked').toBeGreaterThan(2500);
  });
  test('the roots are every top-level directory of code: a new one is classed before it is walked or passed over', () => {
    const dirs = readdirSync(ROOT).filter((e) => statSync(join(ROOT, e)).isDirectory());
    const holdsCode = (/** @type {string} */ d) => walk(join(ROOT, d)).some((p) => CODE.test(p));
    expect(dirs.filter((d) => !ROOTS.includes(d) && !(d in NOT_ROOTS) && holdsCode(d))).toEqual([]);
    for (const reason of Object.values(NOT_ROOTS)) expect(reason.length).toBeGreaterThan(5);
  });
  test('every print site imports the leaf, and every projection reader imports the projection', () => {
    expect(Object.keys(PRINT_SITES).filter((f) => !IMPORTS_LEAF.test(source(f)))).toEqual([]);
    expect(Object.keys(PROJECTION_READERS).filter((f) => !IMPORTS_PROJECTION.test(source(f)))).toEqual([]);
  });
  test('no file reads a chain\'s name or source outside the three lists', () => {
    expect(readers.size, 'anti-vacuity: the walker finds the classed readers').toBeGreaterThanOrEqual(30);
    expect([...readers.keys()].filter((f) => !(f in PRINT_SITES) && !(f in PROJECTION_READERS) && !(f in EXEMPT))).toEqual([]);
  });
  test('an exempt file reads no more lines than its row says (a new read in it is a new reader to class)', () => {
    const grown = Object.entries(EXEMPT).filter(([f, [n]]) => (readers.get(f) || 0) > n).map(([f, [n]]) => `${f}: ${readers.get(f)} > ${n}`);
    expect(grown).toEqual([]);
  });
  test('every listed reader is still there, with its reason', () => {
    expect(Object.keys(EXEMPT).filter((f) => !readers.has(f)), 'a stale exemption').toEqual([]);
    expect(Object.keys(PROJECTION_READERS).filter((f) => !readers.has(f)), 'a stale projection reader').toEqual([]);
    for (const reason of [...Object.values(EXEMPT).map(([, r]) => r), ...Object.values(PRINT_SITES), ...Object.values(PROJECTION_READERS)]) {
      expect(reason.length).toBeGreaterThan(15);
    }
  });
});
