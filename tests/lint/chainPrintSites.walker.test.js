/**
 * chainPrintSites.walker.test.js — F1 (COHERENCE-AGREE-6, REVIEW-AGREE-2; the chair's ruling of 2026-11-12: the
 * rename at print time). An active chain's name and source are PRINTED through one leaf,
 * `src/domain/display/chainPrintName.js :: chainPrintName`, which says the toll's access ("River Toll — River
 * traffic" on a river); the record keeps the catalogue's strings.
 *
 * THE LISTS. `PRINT_SITES`: every file that prints an active chain's name or source. Each imports the leaf, and the
 * list only shrinks (a site that stops printing leaves it). `EXEMPT`: every other file on a print surface that reads
 * a chain-shaped `.label` or `.resource`, each with its reason (a Compendium chain, a resource-exploitation row, a
 * logic read that stays on the record by the chair's ruling). A file on a print surface that reads a chain's
 * `.label`/`.resource` and is in neither list reds the walker, so a page written later that prints the record's
 * name cannot arrive unseen.
 *
 * WHAT IT SEES: a read `chain|ch|c` `?.label|resource` in a file that touches chains (`activeChains`, or a
 * `chain`/`chains` binding), comments out, under the print surfaces below. WHAT IT DOES NOT SEE: a chain held under
 * another name (`row.label`), or a print in a file off those surfaces.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SURFACES = ['src/components', 'src/pdf', 'src/foundry', 'src/lib', 'src/domain/display', 'src/domain/prose', 'src/domain/summary', 'src/domain/dossier'];
const EXTRA = ['src/generators/aiLayer.js'];
const LEAF = 'src/domain/display/chainPrintName.js';

/** The files that print an active chain's name or source, each through the leaf (shrink-only). */
const PRINT_SITES = Object.freeze({
  'src/components/new/tabs/EconomicsTab.jsx': 'the Economic Flows card: its name and its "From" source',
  'src/components/new/tabs/MagicTab.jsx': 'the magic-dependent chains, named beside their note',
  'src/components/new/dailyLifeLogic.js': 'the daily-life context\'s chain names',
  'src/pdf/sections/Services.jsx': 'the PDF\'s Active Supply Chains card: its name and its flow line\'s source',
  'src/pdf/sections/SupplyChainFlow.jsx': 'the PDF\'s Economic Flows node-flow: the source node',
  'src/generators/aiLayer.js': 'the AI layer\'s context line of chain names (a UI call, never stored at birth)',
});

/** Files on a print surface that read a chain-shaped `.label`/`.resource` and print no active chain's name. */
const EXEMPT = Object.freeze({
  'src/components/compendium/SupplyChainsManager.jsx': 'the Compendium: catalogue and custom chains in the abstract, no town',
  'src/components/new/SupplyChainsPanel.jsx': 'the Compendium\'s ChainRow; its `chainFlowFacts` is fed the printed name by its one page caller (EconomicsTab)',
  'src/lib/prebuiltResourceChains.js': 'the Compendium\'s prebuilt chains, no town',
  'src/components/map/ChainEdges.jsx': 'regional supply paths between settlements (`chain.path`), not a town\'s chain record',
  'src/pdf/sections/EconomicsTrade.jsx': 'its own chain reads are the custom chains\' (user-confirmed, §14); the active chains print through SupplyChainFlow, which it hands the town',
  'src/pdf/sections/ResourcesProduction.jsx': 'resource-exploitation rows (`resourceAnalysis.exploitation`), not active chains',
  'src/pdf/lib/viewModelBodySlices.js': 'the exploitation rows\' resource names, and a projection the writers print from',
  'src/pdf/lib/viewModel.js': 'a logic read (`isArcaneChain`: the label\'s magic words), which stays on the record by the chair\'s ruling',
  'src/domain/display/defenseDisplay.js': 'defence capability rows (`row.label`), not chains',
  'src/domain/display/stateProse/generalStateProse.js': 'a logic read (`homeFedChain`: the resource against the worked land), which stays on the record',
  [LEAF]: 'the leaf itself, which reads the record',
});

const codeOf = (/** @type {string} */ s) => s
  .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  .replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');
const TOUCHES = /\bactiveChains\b|\{\s*chains?\b|\bchains\s*[,=)]/;
const READS = /\b(?:chain|ch|c)\??\.(?:label|resource)\b/;
const IMPORTS_LEAF = /import \{[^}]*\bchainPrintName\b[^}]*\} from '[./]+\/domain\/display\/chainPrintName\.js';/;

/** @param {string} dir @param {string[]} out @returns {string[]} */
const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir).sort()) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out); else out.push(path);
  }
  return out;
};
const files = [...SURFACES.flatMap((d) => walk(join(ROOT, d))).map((p) => relative(ROOT, p).replace(/\\/g, '/')), ...EXTRA]
  .filter((f) => /\.(?:js|jsx)$/.test(f) && !/\.generated\.js$/.test(f));
const source = (/** @type {string} */ f) => codeOf(readFileSync(join(ROOT, f), 'utf8'));

describe('F1: every page that prints an active chain\'s name or source asks the leaf', () => {
  test('guard-the-guard: the patterns see a print of the record\'s name, and the leaf\'s import', () => {
    expect(TOUCHES.test('const chains = eco.activeChains || [];') && READS.test('<span>{chain.label}</span>')).toBe(true);
    expect(READS.test('<span>{shown.label}</span>')).toBe(false);
    expect(IMPORTS_LEAF.test("import { chainPrintName } from '../../domain/display/chainPrintName.js';")).toBe(true);
    expect(files.length).toBeGreaterThan(100);
  });
  test('every print site imports the leaf', () => {
    expect(Object.keys(PRINT_SITES).filter((f) => !IMPORTS_LEAF.test(source(f)))).toEqual([]);
  });
  test('no file prints a chain\'s name or source outside the two lists', () => {
    const readers = files.filter((f) => { const c = source(f); return TOUCHES.test(c) && READS.test(c); });
    expect(readers.length, 'anti-vacuity: the walker finds the exempt readers').toBeGreaterThanOrEqual(5);
    expect(readers.filter((f) => !(f in PRINT_SITES) && !(f in EXEMPT))).toEqual([]);
  });
  test('every exemption names a reader that is still there, with its reason', () => {
    const readers = new Set(files.filter((f) => { const c = source(f); return TOUCHES.test(c) && READS.test(c); }));
    expect(Object.keys(EXEMPT).filter((f) => f !== LEAF && !readers.has(f)), 'a stale exemption').toEqual([]);
    for (const reason of [...Object.values(EXEMPT), ...Object.values(PRINT_SITES)]) expect(reason.length).toBeGreaterThan(15);
  });
});
