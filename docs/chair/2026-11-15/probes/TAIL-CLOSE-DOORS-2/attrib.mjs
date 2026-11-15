// usage: node attrib.mjs <walkDir> <allCommits> -> per family: the first-parent commits where its projection changed
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
const [dir, list] = process.argv.slice(2);
const commits = readFileSync(list, 'utf8').trim().split('\n');
const P = commits.map((c) => existsSync(`${dir}/${c}.json`) ? JSON.parse(readFileSync(`${dir}/${c}.json`, 'utf8')) : { _error: 'missing' });
const errs = commits.filter((c, i) => P[i]._error); if (errs.length) console.log('ERRORS', errs.length, errs.slice(0, 5).join(' '));
const fams = new Set(); for (const p of P) for (const k of Object.keys(p)) if (k !== '_error') fams.add(k);
const byCommit = {};
for (const f of [...fams].sort()) {
  let prev = P[0][f]; const moves = [];
  for (let i = 1; i < P.length; i++) { if (P[i]._error) continue; if (P[i][f] !== prev) { moves.push(commits[i]); (byCommit[commits[i]] ||= []).push(f); prev = P[i][f]; } }
  if (moves.length) console.log(`F ${f}: ${moves.map((c) => c.slice(0, 9)).join(' ')}`);
}
console.log('== BY COMMIT');
for (const c of commits) if (byCommit[c]) {
  const subj = execSync(`git -C /home/user/doors2 log -1 --format=%s ${c}`).toString().trim().slice(0, 150);
  console.log(`C ${c.slice(0, 9)} [${byCommit[c].length}] ${subj}\n    ${byCommit[c].join(', ').slice(0, 900)}`);
}
