// compare each pool's (vid, text) at the last close's tip and now: a text present at both whose vid differs is a RENUMBERING
import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
const load = async (dir) => {
  const out = new Map();
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.generated.js'))) {
    const m = await import(pathToFileURL(join(dir, f)).href);
    for (const leaf of Object.values(m)) {
      if (!leaf || typeof leaf !== 'object') continue;
      for (const [block, b] of Object.entries(leaf)) {
        if (!b || typeof b !== 'object' || !b.pools) continue;
        for (const [pool, rows] of Object.entries(b.pools)) out.set(`${block}::${pool}`, rows.map((r, i) => ({ vid: r.vid, text: r.text, pos: i })));
      }
    }
  }
  return out;
};
const [o, n] = [await load(process.argv[2]), await load(process.argv[3])];
let renum = 0, added = 0, removed = 0, reworded = 0, moved = 0; const poolsHit = new Set();
for (const [key, rowsN] of n) {
  const rowsO = o.get(key);
  if (!rowsO) continue;
  const byTextO = new Map(rowsO.map((r) => [r.text, r]));
  const byVidO = new Map(rowsO.map((r) => [r.vid, r]));
  for (const r of rowsN) {
    const old = byTextO.get(r.text);
    if (old && old.vid !== r.vid) { renum += 1; poolsHit.add(key); console.log(`RENUMBERED ${key}: "${r.text.slice(0, 60)}…" vid ${old.vid} -> ${r.vid}`); }
    else if (old && old.pos !== r.pos) { moved += 1; }
    else if (!old && byVidO.has(r.vid)) { reworded += 1; console.log(`SAME VID, OTHER TEXT ${key} vid ${r.vid}: "${byVidO.get(r.vid).text.slice(0, 50)}…" -> "${r.text.slice(0, 50)}…"`); }
    else if (!old) added += 1;
  }
  const textsN = new Set(rowsN.map((r) => r.text)); const vidsN = new Set(rowsN.map((r) => r.vid));
  for (const r of rowsO) if (!textsN.has(r.text) && !vidsN.has(r.vid)) { removed += 1; console.log(`REMOVED ${key} vid ${r.vid}: "${r.text.slice(0, 60)}…"`); }
}
const newPools = [...n.keys()].filter((k) => !o.has(k)); const gonePools = [...o.keys()].filter((k) => !n.has(k));
console.log(JSON.stringify({ poolsOld: o.size, poolsNew: n.size, newPools: newPools.length, gonePools, renumbered: renum, renumberedPools: [...poolsHit], sameVidOtherText: reworded, added, removed, positionMovedOnly: moved }, null, 1));
