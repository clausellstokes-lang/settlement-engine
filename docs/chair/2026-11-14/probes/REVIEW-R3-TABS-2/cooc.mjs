// cooc.mjs <facts.jsonl> <desk.jsonl>: the rulings' co-occurrences, counted over every town (the desk's own lines).
import fs from 'node:fs';
const rd=(f)=>fs.readFileSync(f,'utf8').trim().split('\n').map(JSON.parse);
const F=new Map(rd(process.argv[2]).map(o=>[o.seed,o])); const D=rd(process.argv[3]);
const C={}; const ex={}; const hit=(k,s)=>{ C[k]=(C[k]||0)+1; (ex[k]??=[]).length<4&&ex[k].push(s); };
for(const o of D){ const f=F.get(o.seed); const L=o.lines||{}; const p=L['posture.posture']; const inv=L['threat.invasion']?.sentence||''; const bea=L['threat.beasts']?.sentence||'';
  const ps=p?.sentence||''; const v=/reads as a defended place from the road in/.test(ps)?1:/can field and what .* has built are both in good order/.test(ps)?2:/does not spend much time thinking about being attacked/.test(ps)?3:/^Nothing presses .* at present/.test(ps)?4:0; const strong=v>0; const band=strong?'STRONG':/covered against what it is likely|looks defended in the ordinary way|expect to hold against the usual trouble|enough for the usual trouble/.test(ps)?'ADEQUATE':/brawl or a thief|perimeter has nobody|struggle to hold/.test(ps)?'WEAK':/all but undefended|could not survive a serious attack|without being stopped/.test(ps)?'CRITICAL':ps?'OTHER':'NONE'; const occ=f.stress.includes('occupied'); const siege=f.stress.includes('under_siege'); const fam=f.stress.includes('famine');
  const short=/make do|worse off every month|go short of food|runs short/.test(inv); const supplied=/busy and well stocked|kept supplied|will not go short|balances/.test(inv);
  const watchOnly=f.watch&&!f.garrison&&!f.militia&&!f.merc;
  if(strong){ if(occ) hit('strong posture under occupation',o.seed); if(/WEAK|CRITICAL/.test(f.mil)) hit('strong posture beside Weak/Critical bar',o.seed);
    if(/exists on paper/.test(f.guard||'')) hit('strong posture beside guard on paper',o.seed); if(short) hit('strong posture beside supply-short sentence',o.seed);
    if(siege) hit('strong posture under siege',o.seed); if(f.stress.includes('wartime')&&v!==1) hit('strong v2-4 under war',o.seed);
    if(v===1&&!f.walls) hit('strong v1 no walls',o.seed); if(v===1&&!f.watch&&!f.garrison) hit('strong v1 no watch/garrison',o.seed);
    if(v===2&&!f.walls) hit('strong v2 ("what X has built") no walls',o.seed); if(fam) hit('strong posture under famine',o.seed);
    if(/people rather than works/.test(inv)) hit('strong posture beside "people rather than works"',o.seed);
    hit('strong posture (all)',o.seed); }
  if(p?.sentence && occ) hit('posture under occupation: '+band,o.seed);
  if(supplied&&(siege||fam)) hit('supplied clause under siege/famine',o.seed);
  if(supplied&&occ) hit('supplied clause under occupation',o.seed);
  if(/Every household|townspeople behind them|walls and townsfolk|townsfolk/.test(inv)&&!f.militia) hit('townsfolk/household invasion line without militia/levy',o.seed);
  if(watchOnly&&(/a wall to hold and there are people|wall and armed people/.test(bea))) hit('held-perimeter beasts line in watch-only town',o.seed);
  if(watchOnly&&inv) hit('watch-only town with an invasion sentence',o.seed);
  if(watchOnly&&!bea) hit('watch-only town, beasts row silent',o.seed);
  if(siege&&/raiders stay away|would think again|could be held|see off a raid/.test(inv)) hit('siege: invasion line of deterrence ("raiders stay away"/"think again"/"could be held")',o.seed);
  if(occ&&/could be held|raiders stay away|would think again/.test(inv)) hit('occupation: invasion line of the town holding ("could be held"/"raiders stay away")',o.seed);
}
for(const [k,n] of Object.entries(C).sort()) console.log(String(n).padStart(5)+'  '+k+'   e.g. '+ex[k].join(' '));
