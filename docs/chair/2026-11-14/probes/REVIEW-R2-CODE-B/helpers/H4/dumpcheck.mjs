import fs from 'node:fs';
const D='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/render-tip/dumps/';
const tsv=(f)=>fs.readFileSync(f,'utf8').trim().split('\n').map(l=>l.split('\t'));
const sec=(txt,name)=>{const L=txt.split('\n');let p=false;const o=[];for(const l of L){if(l.startsWith('== ')){p=l.includes(name);continue;}if(p)o.push(l);}return o;};
const R={}; const inc=(k)=>R[k]=(R[k]||0)+1; const ex={};const note=(k,v)=>{(ex[k]=ex[k]||[]).length<4&&ex[k].push(v)};
const cache=new Map(); const read=(s)=>{if(!cache.has(s)){const f=D+s+'.txt';cache.set(s,fs.existsSync(f)?fs.readFileSync(f,'utf8'):null);}return cache.get(s);};
// 1 keeper relationships
for(const r of tsv('keeper.tsv')){const t=read(r[0]); if(!t) continue; inc('keeperTowns'); const rel=sec(t,'World/Relationships'); const form=r[7]; const stored=r[5];
 const roleLines=rel.filter(l=>/ · /.test(l)&&!/^All \(/.test(l)); const withForm=roleLines.filter(l=>l.split(' · ').some(p=>p.trim()===form)).length;
 if(+r[9]>0){ inc('keeperTownsWithRels'); if(withForm>0) inc('keeperFormShown'); else note('keeperFormMissing',r[0]); }
 const seat=t.includes(r[8]); if(seat) inc('seatLineAgrees'); else note('seatLineDiff',r[0]+' '+r[8]); }
// 2 allegiance
const al=tsv('alleg.tsv'); const byTown={}; for(const r of al)(byTown[r[0]]=byTown[r[0]]||[]).push(r);
for(const [s,rows] of Object.entries(byTown)){const t=read(s); if(!t) continue; inc('allegTowns'); for(const r of rows){ const line='answers to '+r[4]+(r[11]==='true'?', through '+r[7]:''); const ok=t.split('\n').some(l=>l.endsWith(line)); ok?inc('allegLineOk'):(inc('allegLineMissing'),note('allegMissing',s+' '+line)); }}
// 3 seat heading
for(const r of tsv('strata.tsv')){const t=read(r[0]); if(!t) continue; inc('strataTowns'); const pw=sec(t,'Systems/Power'); const h=pw.find(l=>/^(The Seat|Contenders for the Seat)/.test(l)); const want=r[3]; if(h&&h.replace(/[▲▼]/g,'').trim()===want) inc('seatHeadOk'); else {inc('seatHeadDiff'); note('seatHead',r[0]+' got:'+h+' want:'+want);} }
// 4 traditions
for(const r of tsv('trad.tsv')){const t=read(r[0]); if(!t) continue; const tr=sec(t,'World/Traditions').join('\n'); const shown=tr.includes(r[4]); const k=`trad ${r[2]} expShown=${r[3]} got=${shown}`; inc(k); if(String(shown)!==r[3]) note(k,r[0]+' '+r[4]); }
// 5 panel handler rows outside house
for(const r of tsv('dmview.tsv')){const t=read(r[0]); if(!t) continue; inc('panelOutsideRows'); const w=t.includes('handled by '+r[3]); if(w) inc('panelOutsideHandlerPrinted'); }
console.log(R); console.log(ex);
