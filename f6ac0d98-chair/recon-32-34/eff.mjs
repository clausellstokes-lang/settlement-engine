import { readFileSync } from 'node:fs';
const ROOT='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/lane-932-headroom/';
for (const f of process.argv.slice(2)) {
  const lines = readFileSync(ROOT+f,'utf8').split('\n');
  let inBlock=false, eff=0;
  for (let L of lines) {
    let t=L.trim();
    if (inBlock) { if (t.includes('*/')) { inBlock=false; t=t.slice(t.indexOf('*/')+2).trim(); } else continue; }
    while (t.startsWith('/*')) { const e=t.indexOf('*/'); if (e===-1){inBlock=true;t='';break;} t=t.slice(e+2).trim(); }
    if (inBlock) continue;
    if (t==='') continue;
    if (t.startsWith('//')) continue;
    eff++;
  }
  console.log(String(eff).padStart(5), f);
}
