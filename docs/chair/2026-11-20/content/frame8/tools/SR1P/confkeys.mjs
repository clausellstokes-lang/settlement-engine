// SR1-P proof (c), each differing stake reason read by key. usage: node confkeys.mjs <tip-tree/> <born-before> <born-after>
// Reads `{golden,census}.jsonl` written by tools/confinement/trees.mjs; for every document, every stress entry's
// cast.stakes[] row (the `stress` field; `stressors` is its alias), by the TIP's stakeReasonKey: before key -> after key.
import fs from 'node:fs';
import readline from 'node:readline';
import { join } from 'node:path';
const [R, BEFORE, AFTER] = process.argv.slice(2);
const { stakeReasonKey } = await import(R + 'src/data/crisis/stakeReasonLines.js');
const rowsOf = (doc) => (Array.isArray(doc?.stress) ? doc.stress : doc?.stress ? [doc.stress] : []).map((e) => (e?.cast?.stakes || []).map((k) => [k.factionId, k.stake, k.reason]));
async function* lines(f) { for await (const l of readline.createInterface({ input: fs.createReadStream(f) })) if (l) yield JSON.parse(l); }
for (const corpus of ['golden', 'census']) {
  const after = new Map();
  for await (const d of lines(join(AFTER, `${corpus}.jsonl`))) after.set(JSON.stringify(d.key), rowsOf(d.doc));
  const c = { docs: 0, docsWithDiff: 0, differing: 0, shapeMoved: 0, powerOrStakeMoved: 0, keyMoved: 0, unkeyed: 0 }; const pairs = {};
  for await (const d of lines(join(BEFORE, `${corpus}.jsonl`))) {
    c.docs++; const x = rowsOf(d.doc); const y = after.get(JSON.stringify(d.key));
    if (!y || JSON.stringify(x.map((e) => e.length)) !== JSON.stringify(y.map((e) => e.length))) { c.shapeMoved++; continue; }
    let any = false;
    x.forEach((e, i) => e.forEach((k, j) => {
      const t = y[i][j];
      if (k[0] !== t[0] || k[1] !== t[1]) c.powerOrStakeMoved++;
      if (k[2] === t[2]) return;
      any = true; c.differing++;
      const ka = stakeReasonKey(k[2]), kb = stakeReasonKey(t[2]);
      if (ka === null || kb === null) c.unkeyed++;
      if (ka !== kb) c.keyMoved++;
      pairs[`${ka} -> ${kb}`] = (pairs[`${ka} -> ${kb}`] || 0) + 1;
    }));
    if (any) c.docsWithDiff++;
  }
  console.log(corpus, JSON.stringify({ ...c, pairs }));
}
