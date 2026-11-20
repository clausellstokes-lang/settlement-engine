// GOALS-3 builder 9 (scratch check, docs only): EVERY NEW PERSONALITY LINE AGAINST ITS CLUSTER'S RESERVE. For each new
// PERSONALITY drawn line of the given WANT-LINES files, every GOAL_RESERVE_LINES.PERSONALITY line of the same cluster (both
// vantages; its own vantage marked '='), and every drawn line of the cluster, with the share of content words they hold in
// common (a pointer for the reader, not the verdict: the verdicts are read by eye and kept in PERSONALITY-RESERVE-CHECK.md).
// Usage: node want-lines-reserve.mjs <tree> <WANT-LINES-n.md>...
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const [, , L, ...FILES] = process.argv;
const GF = await import(pathToFileURL(path.join(L, 'src/data/people/goalFamilies.js')).href);
const STOP = new Set('a an the and or of to in on at for with by from as is be been being their them they this that these those every any one some no not never all who what when where which so if it its than then there here more most only own other others someone anyone everyone season'.split(' '));
const words = (s) => new Set(String(s).toLowerCase().match(/[a-z']+/g).filter((w) => !STOP.has(w) && w.length > 2).map((w) => w.replace(/(ing|ed|es|s)$/, '')));
const share = (a, b) => { const A = words(a), B = words(b); const i = [...A].filter((w) => B.has(w)).length; return i / Math.max(1, Math.min(A.size, B.size)); };
const text = (l) => (typeof l === 'string' ? l : l.line);
let n = 0, flagged = 0;
for (const f of FILES) { let cell = null, on = false;
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const h = /^### \d+ · (\w+)\/(\w+)\/(short|long) /.exec(line); if (h) { cell = h.slice(1, 4); on = false; continue; }
    if (/^New:\s*$/.test(line)) { on = true; continue; }
    const m = /^(\d+)\. (.+)$/.exec(line); if (!(cell && on && m) || cell[0] !== 'PERSONALITY') continue;
    const [, k, v] = cell; const mine = m[2].trim(); n++;
    console.log(`\n${path.basename(f)} PERSONALITY/${k}/${v} #${m[1]}: ${mine}`);
    for (const w of ['short', 'long']) for (const r of (GF.GOAL_RESERVE_LINES.PERSONALITY?.[k]?.[w] || []).map(text)) {
      const s = share(mine, r); if (s >= 0.5) flagged++;
      console.log(`  reserve ${w === v ? '=' : ' '}${w.padEnd(5)} ${s.toFixed(2)}${s >= 0.5 ? ' !' : '  '} ${r}`); }
    const top = ['short', 'long'].flatMap((w) => (GF.GOAL_FAMILY_LINES.PERSONALITY[k][w] || []).map((l) => [w, text(l), share(mine, text(l))])).sort((a, b) => b[2] - a[2])[0];
    if (top) console.log(`  nearest drawn line (${top[0]}) ${top[2].toFixed(2)}: ${top[1]}`);
  } }
console.log(`\n${n} new PERSONALITY lines; pairs with a word share >= 0.50 against the reserve: ${flagged}`);
