import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
const ROOT = process.argv[2];
const SRC = join(ROOT, 'src');
function stripCommentsAndStrings(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/`(?:\\.|[^`\\])*`/g, '``')
    .replace(/'(?:\\.|[^'\\\n])*'/g, "''")
    .replace(/"(?:\\.|[^"\\\n])*"/g, '""');
}
function sourceFiles(dir = SRC, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { sourceFiles(full, out); continue; }
    if (!/\.(js|jsx)$/.test(name)) continue;
    out.push(relative(ROOT, full).split(sep).join('/'));
  }
  return out;
}
const SELF = 'src/generators/generateSettlementPipeline.js';
const reachers = sourceFiles().filter(r => r !== SELF)
  .filter(r => /\bgenerateSettlementPipeline\b/.test(stripCommentsAndStrings(readFileSync(join(ROOT, r), 'utf-8'))));
console.log('REACHERS (' + reachers.length + '):');
for (const r of reachers.sort()) console.log('  ' + r);
console.log('settlementGenerateAction in reachers = ' + reachers.includes('src/store/settlementGenerateAction.js'));
