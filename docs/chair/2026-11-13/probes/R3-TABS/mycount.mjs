// mycount.mjs <dumpsdir>: this seat's patterns, counted as lines (one per view line) and towns.
import fs from 'node:fs';
const dir=process.argv[2]; const C={}; const add=(k,seed)=>{ C[k]=C[k]||{lines:0,towns:new Set()}; C[k].lines++; C[k].towns.add(seed); };
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.txt'))){
  const seed=f.replace(/\.txt$/,''); let view=''; const lines=fs.readFileSync(dir+'/'+f,'utf8').split('\n');
  let ovFood=null, fdFood=null, siege=false, trade=null;
  for(const l of lines){ if(l.startsWith('== ')){ view=l; continue; }
    if(/Defense/.test(view)){ if(l==='REQ') add('Defense: REQ',seed); if(l==='FORCED') add('Defense: FORCED',seed); if(/^Underworld: .* · /.test(l)) add('Defense: Underworld with a band',seed); }
    if(/History/.test(view)){ if(/(minor|major|catastrophic)(minor|major|catastrophic)$/.test(l)) add('History: two severity chips run together',seed); if(l.includes('Exile & Return')) add('History: "Exile & Return"',seed); if(/^Origin:/.test(l)) add('History: Origin row (kept, named)',seed); }
    if(/Summary\/Overview/.test(view)&&l.startsWith('Food Security')&&!l.endsWith('▲')) ovFood=l.slice('Food Security'.length);
    if(/Foundations/.test(view)){ const m=l.match(/^Food(.+)$/); if(m&&!/^ /.test(m[1])) fdFood=m[1]; const t=l.match(/^Trade connectivity(.+)$/); if(t) trade=t[1]; }
    if(/Summary\/Crisis/.test(view)&&/siege/i.test(l)) siege=true;
  }
  if(fdFood&&ovFood&&fdFood.toLowerCase()!==ovFood.toLowerCase()) add('Foundations Food word ≠ Overview food word',seed);
  if(fdFood&&ovFood) add('(towns with both food words)',seed);
  if(trade&&/^(Surplus|Adequate|Strained|Critical|Collapsed)$/.test(trade)&&seed.includes('under_siege')) add('Foundations trade band word in a siege seed',seed);
}
for(const k of Object.keys(C).sort()) console.log(`${k}\tlines ${C[k].lines}\ttowns ${C[k].towns.size}`);
