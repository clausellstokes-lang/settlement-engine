import { readFileSync } from 'node:fs';
for (const f of process.argv.slice(2)) {
  const cells = JSON.parse(readFileSync(f, 'utf8')).cells;
  const byPos = new Map();
  for (const c of cells) {
    const p = c.cell.split('::');
    const at = `${p[0]}::${p.slice(2).join('::')}`;
    const seat = byPos.get(at) || {}; seat[p[1]] = c; byPos.set(at, seat);
  }
  let differ = 0, dmOnly = 0, playerOnly = 0; const pools = new Map();
  for (const [, s] of byPos) {
    if (s.dm && !s.player) { dmOnly++; continue; }
    if (!s.dm && s.player) { playerOnly++; continue; }
    if (s.dm.pool !== s.player.pool || s.dm.vid !== s.player.vid || s.dm.textSha !== s.player.textSha) {
      differ++; const k = `${s.dm.block} :: ${s.dm.pool}`; pools.set(k, (pools.get(k)||0)+1);
    }
  }
  console.log(`\n${f.split('/').pop()}: differ ${differ} · dmOnly ${dmOnly} · playerOnly ${playerOnly} · pools ${pools.size}`);
  for (const [k,n] of [...pools].sort((a,b)=>b[1]-a[1])) console.log(`   ${k}  ${n}`);
  // how many positions exist on each of the two mixed pools at all
  const seen = new Map();
  for (const [, s] of byPos) { if (s.dm && s.player) { const k = `${s.dm.block} :: ${s.dm.pool}`; if (k.startsWith('DS-ECO-6')) seen.set(k,(seen.get(k)||0)+1);} }
  for (const [k,n] of seen) console.log(`   [positions on ${k}] ${n}`);
}
