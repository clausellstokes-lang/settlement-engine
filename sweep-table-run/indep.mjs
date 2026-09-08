// INDEPENDENT re-implementation of a subset of §3's rows, written from the printed
// definitions, over run6b80/corpus.json. Does NOT import metrics.mjs.
import { readFileSync } from 'node:fs';
const rows = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const W = (s) => s.trim().split(/\s+/).filter(Boolean);
const SEG = (s) => s.replace(/\{[a-z_0-9]+\}/gi, 'X')
  .split(/(?<=[.?!]["'”’)\]]?)\s+(?=["“'(]?[A-Z])/).map(x => x.trim()).filter(Boolean);
const r3 = x => +x.toFixed(3), r1 = x => +x.toFixed(1);
const pct = (a, p) => a[Math.floor(p * (a.length - 1))];
const by = {}; for (const r of rows) (by[r.register] ||= []).push(r);
const ORDER = ['R1','R2','R3','R4','R4b','R5','R6','R7','R8','R9','R10','R11','R12','R14','R15','R16','R17','R18','A-U','A-W'];
const out = {};
for (const id of ORDER) {
  const rs = by[id]; const n = rs.length;
  const lens = []; const segCounts = [];
  let term=0, semi=0, colon=0, q=0, paren=0, em=0, bang=0, rat=0, gloss=0, there=0, digits=0, contr=0, slot=0, pcs=0;
  const files = new Set();
  for (const r of rs) {
    const t = r.text, lc = t.toLowerCase();
    files.add(r.file);
    const ss = SEG(t); segCounts.push(ss.length);
    for (const s of ss) { lens.push(W(s).length); if (/^(There|It) (is|was|were|are)\b/.test(s)) there++; }
    if (/[.?!]["’')\]]?$/.test(t.trim())) term++;
    if (/\{[a-z_][a-z_0-9]*\}/i.test(t)) slot++;
    if (t.includes(';')) semi++;
    if (/:\s/.test(t)) colon++;
    if (t.includes('?')) q++;
    if (t.includes('(')) paren++;
    if (/—|&mdash;/.test(t)) em++;
    if (t.includes('!')) bang++;
    if (/\brather than\b/.test(lc)) rat++;
    if (/,\s*which\b/.test(t)) gloss++;
    if (/\d/.test(t.replace(/\{[^}]*\}/g, ''))) digits++;
    if (/\b\w+['’](s|t|re|ve|ll|d|m)\b/.test(t) && /\b(don|doesn|isn|aren|can|won|couldn|wouldn|shouldn|hasn|haven|it|that|there|they|you|we|he|she|what|who|here)['’](s|t|re|ve|ll|d|m)\b/i.test(t)) contr++;
    if (/\bthe PCs\b/.test(t)) pcs++;
  }
  const sorted = [...lens].sort((a,b)=>a-b);
  const mean = lens.reduce((a,b)=>a+b,0)/lens.length;
  const sd = Math.sqrt(lens.reduce((a,b)=>a+(b-mean)**2,0)/lens.length);
  out[id] = {
    'N variants (deduped)': n,
    'files': files.size,
    'segments': lens.length,
    'segments / variant': r3(lens.length/n),
    'terminal-stop share': r3(term/n),
    'slot-bearing share': r3(slot/n),
    '1-segment share': r3(segCounts.filter(c=>c===1).length/n),
    '2-segment share': r3(segCounts.filter(c=>c===2).length/n),
    '3+-segment share': r3(segCounts.filter(c=>c>=3).length/n),
    'words/segment mean': r1(mean),
    'words/segment sd': r1(sd),
    'words/segment p10': pct(sorted,0.10),
    'words/segment p50': pct(sorted,0.50),
    'words/segment p90': pct(sorted,0.90),
    'share segments < 8 words': r3(lens.filter(x=>x<8).length/lens.length),
    'share segments > 30 words': r3(lens.filter(x=>x>30).length/lens.length),
    '"rather than" rate': r3(rat/n),
    'gloss tail ", which" rate': r3(gloss/n),
    '"There/It is" opener rate': r3(there/lens.length),
    'semicolon rate': r3(semi/n),
    'colon rate': r3(colon/n),
    'question rate': r3(q/n),
    'parenthesis rate': r3(paren/n),
    'em dashes (count)': em,
    'exclamations (count)': bang,
    'digits-in-prose rate': r3(digits/n),
    'contraction rate': r3(contr/n),
    '"the PCs" (count)': pcs,
  };
}
// compare against the published table
const doc = readFileSync(process.argv[3],'utf8').split('\n');
const i = doc.findIndex(l=>l.startsWith('## 3.'));
const s = doc.findIndex((l,k)=>k>i&&l.startsWith('| metric |'));
const P=(l)=>l.replace(/^\|/,'').replace(/\|$/,'').split('|').map(x=>x.replace(/\*\*/g,'').trim());
const tbl=[];for(let k=s;k<doc.length;k++){if(!doc[k].startsWith('|'))break;if(/^\|\s*-+/.test(doc[k]))continue;tbl.push(P(doc[k]));}
const hdr=tbl[0]; const colIdx={}; hdr.forEach((h,ix)=>{const m=h.match(/^([A-Z0-9b-]+)\s*\(/);if(m)colIdx[m[1]]=ix;});
let diffs=0,checked=0;
for(const row of tbl.slice(1)){
  const label=row[0]; if(!out.R1[label]&&out.R1[label]!==0) continue;
  for(const id of ORDER){
    const ix=colIdx[id]; if(ix===undefined){console.log('no col for',id);continue;}
    const pubv=row[ix], mv=out[id][label]; checked++;
    if(Math.abs(Number(pubv)-Number(mv))>1e-9){diffs++;console.log(`DIFF ${label.padEnd(30)} ${id.padEnd(4)} published=${pubv} independent=${mv}`);}
  }
}
console.log(`\nINDEPENDENT check: ${checked} cells over ${new Set(tbl.slice(1).map(r=>r[0])).size} published rows; diffs: ${diffs}`);
