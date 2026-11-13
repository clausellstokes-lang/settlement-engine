// AGREE-FOLLOW-UP probe 5 — for every town whose row moved between two trees, its key and
// roster at each scanned commit, in order, so the commit that moved it is read off.
// usage: node siteAttribute.mjs <changed.json from siteDiff> <dir of <sha>.json scans> <sha>...
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const [changedPath, dir, ...shas] = process.argv.slice(2);
const changed = JSON.parse(readFileSync(changedPath, 'utf8'));
const scans = shas.map((s) => [s, existsSync(join(dir, `${s}.json`)) ? JSON.parse(readFileSync(join(dir, `${s}.json`), 'utf8')).rows : null]);
for (const c of changed) {
  console.log(`#${c.idx} ${c.id}: ${c.oldKey} -> ${c.newKey}`);
  let prev = null;
  for (const [sha, rows] of scans) {
    if (!rows) { console.log(`   ${sha.padEnd(11)} (no scan)`); continue; }
    const r = rows[c.idx];
    if (r.id !== c.id) throw new Error(`identity drift at ${sha}`);
    const line = `${r.key} | ${r.resources.join(',')} | ${JSON.stringify(r.tokenLines)}`;
    console.log(`   ${sha.padEnd(11)} ${line === prev ? '=' : line}`);
    prev = line;
  }
}
