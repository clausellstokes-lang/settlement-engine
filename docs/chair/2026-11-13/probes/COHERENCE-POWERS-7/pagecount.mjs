// node pagecount.mjs <dumpsdir> [corpus.ndjson.gz]: towns printing each of the list's mechanisms on the owner's page
import fs from 'node:fs'; import path from 'node:path'; import { recs } from './rd.mjs';
const D=process.argv[2]; const REC=process.argv[3];
const recBy=new Map(); if (REC) for await (const {seed,s} of recs(REC)) recBy.set(seed,{ npcs:(s.npcs||[]).map(n=>({name:n.name,gender:n.gender,title:n.title})), gov:s.powerStructure?.government, terrain:s.config?.terrainType, ct:s.config?.contentBoundaries });
const C={}; const ex={}; const hit=(k,seed,l)=>{ (C[k]??=new Set()).add(seed); (ex[k]??=[]).length<4 && ex[k].push(`${seed}: ${l.slice(0,140)}`); };
for (const f of fs.readdirSync(D)) { const seed=f.replace(/\.txt$/,''); const txt=fs.readFileSync(path.join(D,f),'utf8'); let view='';
  const powersN=new Set(); const r=recBy.get(seed);
  for (const l of txt.split('\n')) { if (l.startsWith('== ')) { view=l; continue; }
    if (/^(Prosperity|Safety|Defense|Food) [+-]?\d+$/.test(l)) hit('A breakdown chips',seed,l);
    let m=l.match(/^The Powers \((\d+)\)/); if (m && /Power/.test(view)) powersN.add(m[1]);
    if (/^(Connection: )?Goodwife\b/.test(l) && r) { const nm=l.replace(/^(Connection: )?Goodwife ?/,''); const n=r.npcs.find(x=>nm && x.name===nm) ; if(!nm || (n && n.gender==='male')) hit('C goodwife',seed,l); }
    if (/the boats, the catch|every ship and household|stolen ship's stores|river's driftwood|selling some of the foundlings/.test(l)) hit('D presentation/secret',seed,l);
    if (/\((?:[^)]*\d+-\d+\+?|[^)]*high magic|[^)]*\d[\d,]*\+)\)\s·\sbrings/.test(l)) hit('F patronage range',seed,l);
    if (/Three powers stand almost level/.test(l)) hit('H level',seed,l);
    if (/The gap between them and .* is narrow/.test(l)) hit('H narrow',seed,l);
    if (/A slow war with the guild/.test(l)) hit('H slowwar',seed,l);
    if (/Crown supply carts|A crown officer came last week|Crown-appointed emergency body|Crown authority flows/.test(l)) hit('I crown',seed,l+` [gov ${r?.gov}]`);
    if (/Under the ruling power, with no power of its own kind here/.test(l)) hit('E powerSupport',seed,l);
    if (/Runs a smaller house behind the leading one/.test(l)) hit('G smaller house',seed,l);
    if (/An external interest with embedded assets/.test(l)) hit('K external',seed,l);
    if (/^The power.*\)[a-z]+-[a-z]+$|arcane-advised|\)(royal|merchant|military|arcane|church)-[a-z]+$/.test(l)) hit('J modifier id',seed,l);
    if (/Church institutions hold direct temporal power/.test(l)) hit('J church temporal',seed,l);
    if (/elected council cannot easily override/.test(l)) hit('J elected council',seed,l);
    if (/The oldest heads of the community decide things together/.test(l)) hit('J oldest heads',seed,l);
    if (/Armed patrol of able-bodied residents/.test(l)) hit('J armed patrol',seed,l);
  }
  if (powersN.size>1) hit('B two counts',seed,[...powersN].join(' vs '));
}
for (const k of Object.keys(C).sort()) console.log(k.padEnd(24), C[k].size, '\n   ', ex[k].join('\n    '));
