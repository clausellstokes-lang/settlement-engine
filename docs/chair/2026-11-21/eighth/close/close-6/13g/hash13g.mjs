// 13G (CLOSE-6, the chair's N97): NO OTHER BYTE MOVES. A per-birth sha256 of JSON.stringify(birth) for the census's 900
// (`dp-<size>-<i>`, 150 a size), LIT (the product's birth: birthConfig({ settType })) and DARK (both laws forced to 1 on
// the config birthConfig returns, which clamps an incoming marker off), on one tree.
// usage: TREE=<tree root> [DUMP=<seed,...> DUMP_DIR=<dir>] node hash13g.mjs <out.tsv>
//   (columns: seed, lit sha256, dark sha256; a header line first). DUMP writes those births' records (lit and dark) as JSON
//   to DUMP_DIR, so a moved birth's bytes can be diffed field by field.
// Compare two runs (before and after the cure) with compare13g.mjs.
import { mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const TREE = process.env.TREE; if (!TREE) throw new Error('TREE=<tree root>');
const R = TREE + '/src/';
// a scratch copy (git archive of a commit's src, no .git) reads 'no-git' for both
const git = (args) => { try { return execFileSync('git', ['-C', TREE, ...args], { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { return 'no-git'; } };
const head = () => git(['rev-parse', '--short=9', 'HEAD']);
const dirty = () => git(['status', '--porcelain', '--', 'src']);
const headAtStart = head(); const srcAtStart = dirty();
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
await loadGenerationLawPayloads();
const [out] = process.argv.slice(2); if (!out) throw new Error('usage: node hash13g.mjs <out.tsv>');
const DUMP = new Set(String(process.env.DUMP || '').split(',').filter(Boolean)); const DUMP_DIR = process.env.DUMP_DIR || '.';
const LAW_1 = { _seatLawVersion: 1, _fortuneLawVersion: 1 };
const sha = (o) => createHash('sha256').update(JSON.stringify(o)).digest('hex');
const rows = [`# tree=${TREE} head=${headAtStart} src-changes=${JSON.stringify(srcAtStart)}`, 'seed\tlit\tdark'];
for (const settType of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (let i = 0; i < 150; i++) {
  const seed = `dp-${settType}-${i}`;
  const lit = generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} });
  const dark = generateSettlementPipeline({ ...birthConfig({ settType }), ...LAW_1 }, null, { seed, customContent: {} });
  rows.push(`${seed}\t${sha(lit)}\t${sha(dark)}`);
  if (DUMP.has(seed)) { mkdirSync(DUMP_DIR, { recursive: true }); writeFileSync(`${DUMP_DIR}/${seed}.lit.json`, JSON.stringify(lit, null, 1)); writeFileSync(`${DUMP_DIR}/${seed}.dark.json`, JSON.stringify(dark, null, 1)); }
}
if (head() !== headAtStart || dirty() !== srcAtStart) throw new Error('the tree moved under the run');
writeFileSync(out, rows.join('\n') + '\n');
console.log(JSON.stringify({ out, head: headAtStart, srcChanges: srcAtStart, births: rows.length - 2 }));
