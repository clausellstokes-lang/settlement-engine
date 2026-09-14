import { readFileSync } from 'node:fs';
for (const f of process.argv.slice(2)) {
  const cells = JSON.parse(readFileSync(f, 'utf8')).cells;
  const byPos = new Map();
  for (const c of cells) {
    const p = c.cell.split('::');
    const at = `${p[0]}::${p.slice(2).join('::')}`;
    const seat = byPos.get(at) || {}; seat[p[1]] = c; byPos.set(at, seat);
  }
  const rows = [];
  for (const [at, s] of byPos) {
    if (s.dm && s.player && s.dm.block === 'DS-POW-1' && s.dm.pool === 'governanceFractured true') {
      rows.push({ at, dmVid: s.dm.vid, plVid: s.player.vid, dmIdx: s.dm.index, plIdx: s.player.index });
    }
  }
  const pairs = new Map();
  for (const r of rows) pairs.set(`dm#${r.dmVid} / player#${r.plVid}`, (pairs.get(`dm#${r.dmVid} / player#${r.plVid}`)||0)+1);
  console.log(`\n${f.split('/').pop()}  DS-POW-1 governanceFractured true · positions ${rows.length}`);
  for (const [k,n] of [...pairs].sort()) console.log(`   ${k}  x${n}`);
}
