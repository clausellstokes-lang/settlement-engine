import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
const ROOT = process.argv[2];
const baseline = JSON.parse(readFileSync(`${ROOT}/scripts/.observed-shape-readers-baseline.json`, 'utf8'));
const recorded = new Map(baseline.manifests.detectorTree.entries.map((e) => [e.path, e]));
console.log(`predecessor detectorTree digest: ${baseline.manifests.detectorTree.digest}`);
console.log(`predecessor detectorTree entries: ${recorded.size}`);
const moved = []; const same = [];
for (const [path, entry] of recorded) {
  const buf = readFileSync(`${ROOT}/${path}`);
  const sha = createHash('sha256').update(buf).digest('hex');
  const st = statSync(`${ROOT}/${path}`);
  const row = { path, was: entry.sha256, now: sha, wasSize: entry.size, nowSize: buf.length };
  if (sha === entry.sha256 && buf.length === entry.size) same.push(row); else moved.push(row);
}
console.log(`\nMOVED (${moved.length}):`);
for (const r of moved) console.log(`  ${r.path}\n      was ${r.was.slice(0,16)}… ${r.wasSize}B\n      now ${r.now.slice(0,16)}… ${r.nowSize}B`);
console.log(`\nBYTE-SAME (${same.length}):`);
for (const r of same) console.log(`  ${r.path}  (${r.nowSize}B)`);
