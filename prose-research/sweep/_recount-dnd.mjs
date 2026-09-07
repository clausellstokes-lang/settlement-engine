// Recount every feature's Support line in a section file against the state's kept/partial sets; check quotation lengths.
import { readFileSync } from 'node:fs';
const [,, secPath] = process.argv;
const st = JSON.parse(readFileSync('sweep/state-dnd.json','utf8'));
const kept = new Set(), part = new Set();
for (const [i,v] of Object.entries(st.verdicts)) { if (v.verdict==='VERIFIED_VERBATIM'||v.verdict==='VERIFIED_SUBSTANCE') kept.add(+i); else if (v.verdict==='PARTIAL') part.add(+i); }
const sec = readFileSync(secPath,'utf8').split('\n');
const clean = s => s.replace(/v\d\.\d+[a-z]?/g,' ').replace(/\b(19|20)\d\d\b/g,' ').replace(/\b\d+(st|nd|rd|th|e)\b/g,' ').replace(/\b[A-Z]+\d+\b/g,' ').replace(/[A-Za-z]+\d+\b/g,' ').replace(/\d+[.,]\d+/g,' ').replace(/\b\d+ ?(percent|%|words?|pages?|sentences?|feet|foot|gp|GP)\b/g,' ');
let cur=null; const out=[]; let errors=0;
for (let li=0; li<sec.length; li++) { const L=sec[li]; const m=L.match(/^\*\*(\d+)\. /); if (m) { cur=m[1]; continue; }
  if (cur && L.startsWith('Support:')) {
    const head = L.match(/^Support:\s*(\d+) kept rows? on (\d+) documents?(?:; (\d+) PARTIAL)?/);
    let body = L.replace(/^Support:[^.]*\.\s*/,''); body = clean(body);
    // segments by ';' ; a segment is P-scoped if it starts with (P or P  or contains "(P)"
    const segs = body.split(';');
    const keptCited=new Set(), pCited=new Set(), wrongK=[], wrongP=[];
    for (let seg of segs) { const isPseg = /^\s*\(?P\b/.test(seg) || /\(P\)/.test(seg);
      // within a non-P segment, tokens like "(P 23)" or "P 61" mark individual P cites
      const re=/(\(P\s*|\bP\s+)?(\d{1,4})\b/g; let t;
      while ((t=re.exec(seg))) { const n=+t[2]; if (n>1211) continue; const isP = isPseg || !!t[1]; if (isP) { pCited.add(n); if(!part.has(n)) wrongP.push(n); } else { keptCited.add(n); if(!kept.has(n)) wrongK.push(n+(part.has(n)?'(P!)':'('+(st.verdicts[n]?st.verdicts[n].verdict:'none')+')')); } }
    }
    const docs = new Set([...keptCited].filter(n=>kept.has(n)).map(n=>st.claims[n].url));
    const validK=[...keptCited].filter(n=>kept.has(n)).length;
    const ok = head && +head[1]===validK && +head[2]===docs.size && (+(head[3]||0))===pCited.size && !wrongK.length && !wrongP.length;
    if(!ok) errors++;
    out.push(`F${cur}: ${ok?'OK':'MISMATCH'} stated ${head?head[1]+'/'+head[2]+'/'+(head[3]||0):'?'} | counted kept ${validK} on ${docs.size} docs, P ${pCited.size}${wrongK.length?' | KEPT-CITED NOT KEPT: '+wrongK.join(','):''}${wrongP.length?' | P-CITED NOT PARTIAL: '+wrongP.join(','):''}`);
    cur=null; } }
console.log(out.join('\n')); console.log('features with Support lines:', out.length, 'mismatches:', errors);
// quotation length check: any "..." run of >= 12 words in body (outside tables)
const text = readFileSync(secPath,'utf8'); const qre=/"([^"\n]{20,400})"/g; let q; const long=[]; let n=0;
for (const line of text.split('\n')) { if (line.startsWith('|')) continue; qre.lastIndex=0; while ((q=qre.exec(line))) { n++; const w=q[1].replace(/…|\.\.\./g,' ').trim().split(/\s+/).filter(Boolean).length; if (w>=12) long.push(w+'w: '+q[1].slice(0,80)); } }
console.log('quotations checked:', n, 'at or over twelve words:', long.length); for (const l of long) console.log('  ', l);
// em dash and digit scan of Rule lines
let em=0; for (const line of text.split('\n')) { if (line.includes('—')) em++; } console.log('lines with an em dash:', em);
