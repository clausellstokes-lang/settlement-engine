// CENSUS-2 holders: for each build lane, the files it changes against its own merge base with the line, and per file
// the commits that change it (so a file several lanes change is given to the lanes with commits of their OWN on it,
// as ROUND-3-CUT's own-holders.mjs ruled). Run in a clone that has fetched the lanes:
//   node holders.mjs <repo> <line-ref> <out.json> key=lane/branch ...
import fs from 'node:fs'; import { execSync } from 'node:child_process';
const [repo, line, out, ...pairs] = process.argv.slice(2);
const g = (c) => execSync(`git -C ${repo} ${c}`, { maxBuffer: 1 << 28 }).toString().trim();
const H = { _line: { ref: line, tip: g(`rev-parse ${line}`) } };
for (const p of pairs) {
  const [k, b] = p.split('='); const tip = g(`rev-parse origin/${b}`); const mb = g(`merge-base ${line} ${tip}`);
  const files = mb === tip ? [] : g(`diff --name-only ${mb} ${tip}`).split('\n').filter(Boolean);
  const commits = {}; if (files.length) for (const blk of g(`log --format=@@%H --name-only ${mb}..${tip}`).split('@@').filter(Boolean)) {
    const [c, ...fs2] = blk.trim().split('\n'); for (const f of fs2.filter(Boolean)) (commits[f] ||= []).push(c); }
  H[k] = { branch: b, tip, mergeBase: mb, files, commits };
  console.log(k.padEnd(4), b.padEnd(34), tip.slice(0, 9), 'mb', mb.slice(0, 9), 'files', files.length);
}
fs.writeFileSync(out, JSON.stringify(H));
