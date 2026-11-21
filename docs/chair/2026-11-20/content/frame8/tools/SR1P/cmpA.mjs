// SR1-P proof (a), the comparison. usage: node cmpA.mjs <tip-tree/> <base.jsonl> <tip.jsonl>
// Keys are read by the TIP's stakeReasonKey (it maps every pre-SR1 literal too).
import fs from 'node:fs';
const [R, A, B] = process.argv.slice(2);
const { stakeReasonKey } = await import(R + 'src/data/crisis/stakeReasonLines.js');
const read = (f) => new Map(fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)).map((d) => [`${d.pool}|${d.seed}`, d]));
const a = read(A), b = read(B);
const W4 = ['frame-calm-town-20', 'frame-calm-town-80', 'frame-calm-city-12', 'frame-calm-city-14', 'frame-calm-city-49', 'frame-calm-metropolis-51'];
const c = { crisis: 0, calm: 0, missing: 0, noRow: 0, noRowSame: 0, noRowRec: 0, noRowPage: 0, blankRec: 0, blankPage: 0, blankBoth: 0,
  withRow: 0, withRowRecSame: 0, calmRec: 0, calmPage: 0, calmBoth: 0, rows: 0, rowsChanged: 0, otherChanged: 0, keyMoved: 0, factionOrStakeMoved: 0, rowCountMoved: 0 };
const byKey = {}; const w4 = {}; const notes = [];
for (const [id, x] of a) {
  const y = b.get(id); if (!y) { c.missing++; continue; }
  if (x.pool === 'calm') {
    c.calm++; const r = x.rec === y.rec, p = x.page === y.page;
    if (r) c.calmRec++; if (p) c.calmPage++; if (r && p) c.calmBoth++; else notes.push(`calm differs ${x.seed}`);
    if (W4.includes(x.seed)) w4[x.seed] = r && p;
    continue;
  }
  c.crisis++;
  const keysA = x.rows.flatMap((e) => e.stakes.map((k) => stakeReasonKey(k[2])));
  const has = keysA.some((k) => k === 'loses' || k === 'split');
  if (!has) { c.noRow++; if (x.rec === y.rec) c.noRowRec++; if (x.page === y.page) c.noRowPage++; if (x.rec === y.rec && x.page === y.page) c.noRowSame++; else notes.push(`no-row town differs ${x.seed}`); }
  else { c.withRow++; if (x.rec === y.rec) c.withRowRecSame++; }
  if (x.recB === y.recB) c.blankRec++; if (x.pageB === y.pageB) c.blankPage++;
  if (x.recB === y.recB && x.pageB === y.pageB) c.blankBoth++; else notes.push(`blanked differs ${x.seed}`);
  if (JSON.stringify(x.rows.map((e) => [e.kind, e.stakes.length])) !== JSON.stringify(y.rows.map((e) => [e.kind, e.stakes.length]))) { c.rowCountMoved++; continue; }
  x.rows.forEach((e, i) => e.stakes.forEach((k, j) => {
    const t = y.rows[i].stakes[j]; c.rows++;
    if (k[0] !== t[0] || k[1] !== t[1]) c.factionOrStakeMoved++;
    const ka = stakeReasonKey(k[2]), kb = stakeReasonKey(t[2]);
    if (ka !== kb) c.keyMoved++;
    if (k[2] !== t[2]) { c.rowsChanged++; byKey[ka] = (byKey[ka] || 0) + 1; if (ka !== 'loses' && ka !== 'split') c.otherChanged++; }
  }));
}
console.log(JSON.stringify({ ...c, changedByKey: byKey, w4 }, null, 1));
for (const n of notes.slice(0, 30)) console.log('NOTE', n);
