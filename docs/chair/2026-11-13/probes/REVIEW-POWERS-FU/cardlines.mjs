// cardlines.mjs <baseDumps> <tipDumps> <seedsFile|-> : per card on World/NPCs, the STRUCTURAL lines (position / constraint, i.e.
// every line that is not a header, house row, title, relationship, called-by, want, disposition, dealing, secret or flaw)
// lost and gained base -> tip. Prints totals and every line, with a "Holds the seat" tally of non-holders.
import fs from 'node:fs';
const [B,T,SF]=process.argv.slice(2);
const seeds = SF && SF!=='-' ? fs.readFileSync(SF,'utf8').trim().split('\n') : fs.readdirSync(T).map(f=>f.replace(/\.txt$/,''));
const REL=/^(Called by|Pragmatic Alliance|Professional Rivalry|Mentor and Successor|Outstanding Debt|Mutual Leverage|Genuine Respect|Unresolved History|Family Complication|Financial Dependence|Silent Partnership|Active Suppression|Bitter Enmity|Old Debt|Patron|Political Obligation|Blood Feud|Secret Alliance|Rival|Ally|Enemy)/;
const SKIP=/^(Wants |Disposition |How they deal|Secret:|Flaw:|Temperament:|All●|↺|▲|▼|\d+ Key Figures|Unranked members)/;
function cards(f){ const out=new Map(); if(!fs.existsSync(f)) return null; let inV=false, cur=null;
  for(const l of fs.readFileSync(f,'utf8').split('\n')){ const m=l.match(/^== (.+?) ==/); if(m){ inV=m[1]==='World/NPCs'; cur=null; continue;} if(!inV) continue;
    const h=l.match(/^(.+?)(●+)$/); if(h){ cur=h[1].trim(); if(!out.has(cur)) out.set(cur,[]); continue; }
    if(/\(\d+\)[▲▼]?$/.test(l)) { cur=null; continue; }
    if(!cur) continue; if(REL.test(l)||SKIP.test(l)) continue; if(/ · (first|second|third|member) of /.test(l)||/^[A-Z][^.]{0,40}$/.test(l)&&!/[.:]/.test(l)) continue; // house row / title
    out.get(cur).push(l); }
  return out; }
let lost=[], gained=[], n=0; const holdsTip={}, holdsBase={};
for(const s of seeds){ const b=cards(`${B}/${s}.txt`), t=cards(`${T}/${s}.txt`); if(!b||!t) continue; n++;
  for(const [name,tl] of t){ const bl=b.get(name)||[]; for(const l of bl) if(!tl.includes(l)) lost.push(`${s} | ${name} | ${l}`); for(const l of tl) if(!bl.includes(l)) gained.push(`${s} | ${name} | ${l}`); }
  for(const [name,bl] of b) if(!t.has(name)) for(const l of bl) lost.push(`${s} | ${name} (card gone) | ${l}`);
  holdsTip[s]=[...t].filter(([,ls])=>ls.some(l=>/^Holds the seat/.test(l))).map(([k])=>k); holdsBase[s]=[...b].filter(([,ls])=>ls.some(l=>/^Holds the seat/.test(l))).map(([k])=>k); }
const multi=(h)=>Object.entries(h).filter(([,v])=>v.length>1);
console.log(`towns ${n} | structural lines lost ${lost.length} gained ${gained.length} | towns with >1 "Holds the seat" card: base ${multi(holdsBase).length} tip ${multi(holdsTip).length}`);
console.log('--- LOST'); console.log(lost.join('\n')); console.log('--- GAINED'); console.log(gained.join('\n'));
console.log('--- MULTI HOLDS (tip)'); console.log(multi(holdsTip).map(([k,v])=>k+': '+v.join(', ')).join('\n'));
