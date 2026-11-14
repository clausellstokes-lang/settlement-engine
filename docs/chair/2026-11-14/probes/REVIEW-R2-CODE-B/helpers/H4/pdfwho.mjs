import fs from 'node:fs';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/surf-tip/';
const r={files:0,blocks:0,rows:0,dupTitle:0,range:0,handled:0,fronts:0,undef:0}; const ex=[];
for(const f of fs.readdirSync(S).filter(x=>/\.pdf-(canon_dossier|draft_brief)\.txt$/.test(x))){ r.files++; const L=fs.readFileSync(S+f,'utf8').split('\n'); const i=L.indexOf(L.find(l=>/^Who really runs this /.test(l))); if(i<0) continue; r.blocks++;
 for(let j=i+1;j<Math.min(L.length,i+200);j++){ const l=L[j]; if(/^THE HALL|^The hall/i.test(l)) break; r.rows++; if(/\((the [^)]+)\), \1/.test(l)){r.dupTitle++; ex.push(f+' '+l.slice(0,120));} if(/\(\d+\s*-|\(high magic\)/.test(l)){r.range++; ex.push(f+' '+l.slice(0,120));} if(/undefined|NaN|\[object/.test(l)) r.undef++; if(/^handled by /.test(l)) r.handled++; if(/ fronts for /.test(l)) r.fronts++; } }
console.log(r, ex.slice(0,6));
