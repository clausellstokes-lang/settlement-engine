// crime.mjs IN=<births.gz> TREE=<tree>: every crime-pattern row as the tip prints it, its two functions copied VERBATIM
// from the tip's DefenseTab.jsx (sentencesNotIn, wholeSentencesWithin; checked equal by grep in crime-check), against the
// line's truncateAtWord(desc, 200): rows, rows cut at the line, distinct tip texts that differ, how each ends.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const { truncateAtWord } = await import(process.env.TREE+'/src/lib/text.js');
function sentencesNotIn(text, printed) {
  const t = typeof text === 'string' ? text : '';
  const p = typeof printed === 'string' ? printed : '';
  if (!t || !p) return t;
  const sentences = t.split(/(?<=[.!?])\s+/);
  const kept = sentences.filter((x) => !(x.trim().split(/\s+/).length >= 8 && p.includes(x.trim())));
  return kept.length === sentences.length ? t : kept.join(' ');
}
function wholeSentencesWithin(text, maxChars) {
  const t = typeof text === 'string' ? text.trim() : '';
  if (t.length <= maxChars) return t;
  const head = t.slice(0, maxChars + 1);
  const ends = [...head.matchAll(/[.!?][\x22\x27)\]]?(?=\s|$)/g)];
  const last = ends[ends.length - 1];
  return last ? t.slice(0, last.index + last[0].length) : t;
}
const rl=readline.createInterface({input:fs.createReadStream(process.env.IN).pipe(zlib.createGunzip()),crlfDelay:Infinity});
let rows=0,cutLine=0,changed=0,overLong=0,noEnd=0; const tails={}, distinct=new Map();
for await (const l of rl){ const {seed,s}=JSON.parse(l); const sp=s.economicState?.safetyProfile||{}; for(const ct of sp.crimeTypes||[]){ rows++;
  const desc=sentencesNotIn(ct.desc, sp.safetyDesc); if(!desc) continue; const a=truncateAtWord(desc,200), b=wholeSentencesWithin(desc,200);
  if(a!==desc) cutLine++; if(a!==b){ changed++; const k=b.replace(s.name,'{S}'); distinct.set(k,(distinct.get(k)||{n:0,seed,full:desc}).n+1===1?{n:1,seed,full:desc.replace(s.name,'{S}')}:{...distinct.get(k),n:distinct.get(k).n+1}); }
  if(b.length>200){ overLong++; } if(!/[.!?]["')\]]?$/.test(b)) noEnd++; const w=b.split(/\s+/).slice(-1)[0]; tails[w]=(tails[w]||0)+1; } }
console.log({rows,cutLine,changed,overLong,noEnd,distinctChanged:distinct.size});
for(const [k,v] of [...distinct].sort((a,b)=>b[1].n-a[1].n)) console.log(`${v.n}\t${v.seed}\tTIP: ${k}\n\t\tFULL(${v.full.length}): ${v.full.slice(0,400)}`);
