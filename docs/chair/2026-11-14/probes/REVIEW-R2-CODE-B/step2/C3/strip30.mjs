import fs from 'node:fs';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out';
const RX=/\(\d+ ?[-–] ?\d+[^)]*\)|\(\d+\+[^)]*\)|\((high magic|if walled|multiple)\)/;
const strip=(l)=>l.replace(/\s*\((?:\d+ ?[-–] ?\d+[^)]*|\d+\+[^)]*|high magic|if walled)\)/g,'').replace(/Inn \(multiple\)/g,'Inns');
const tabs=(t)=>{const m={}; for(const sec of t.split(/^== /m)){ const i=sec.indexOf(' ==\n'); if(i<0) continue; m[sec.slice(0,i)]=sec.slice(i+4).split('\n'); } return m;};
const files=fs.readdirSync(S+'/render-q/dumps'); const byTab={}; let total=0, matched=0, unmatched=[];
for(const f of files){ const q=tabs(fs.readFileSync(S+'/render-q/dumps/'+f,'utf8')), t=tabs(fs.readFileSync(S+'/render-tip/dumps/'+f,'utf8'));
  for(const [tab,ls] of Object.entries(q)){ const tset=new Set(t[tab]||[]); for(const l of ls){ if(!RX.test(l)) continue; if((t[tab]||[]).includes(l)) continue; total++; const s=strip(l); const ok=tset.has(s);
    if(ok) matched++; else if(unmatched.length<400) unmatched.push(f+' '+tab+' :: '+l.slice(0,160));
    (byTab[tab]=byTab[tab]||[]).push([f,l,ok?s:'(NO STRIPPED TWIN)']); } } }
console.log({total,matched,unmatchedN:total-matched});
fs.writeFileSync('unmatched.txt',unmatched.join('\n'));
for(const [tab,a] of Object.entries(byTab)){ const step=Math.max(1,Math.floor(a.length/4)); for(let i=0,k=0;i<a.length&&k<4;i+=step,k++) console.log('['+tab+'] '+a[i][0]+'\n   Q: '+a[i][1].slice(0,170)+'\n tip: '+a[i][2].slice(0,170)); }
