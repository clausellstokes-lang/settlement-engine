const T='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree';
const { NAMING_DATA } = await import(T+'/src/data/namingData.js');
const strings=[];
const walk=(n,p)=>{ if(typeof n==='string'){strings.push([p,n]);return;}
 if(Array.isArray(n)){n.forEach((c,i)=>walk(c,`${p}[${i}]`));return;}
 if(n&&typeof n==='object'){for(const [k,v] of Object.entries(n)) walk(v,`${p}.${k}`);} };
walk(NAMING_DATA,'NAMING_DATA');
console.log('pooled strings =', strings.length);
const inSet=cp=>(cp>=0x20&&cp<=0x7E)||(cp>=0xA1&&cp<=0xFF);
const counts=new Map(), ex=new Map(); let total=0;
for(const [p,v] of strings) for(const ch of v){ const cp=ch.codePointAt(0);
  if(inSet(cp)) continue; total++; counts.set(cp,(counts.get(cp)||0)+1); if(!ex.has(cp)) ex.set(cp,`${p} = ${v}`); }
const hx=c=>'U+'+c.toString(16).toUpperCase().padStart(4,'0');
console.log('TOTAL miss instances vs campaign-pdf 190-set =', total);
console.log('cp, char, instances, example');
for(const [cp,n] of [...counts].sort((a,b)=>a[0]-b[0])) console.log(`${hx(cp)}, ${String.fromCodePoint(cp)}, ${n}, ${ex.get(cp)}`);
// what the 27-widening cures
const WIDEN=new Set([0x0152,0x0153,0x0160,0x0161,0x0178,0x017D,0x017E,0x0192,0x02C6,0x02DC,0x2013,0x2014,0x2018,0x2019,0x201A,0x201C,0x201D,0x201E,0x2020,0x2021,0x2022,0x2026,0x2030,0x2039,0x203A,0x20AC,0x2122]);
let cured=0, remain=0; const remainCps=[];
for(const [cp,n] of counts){ if(WIDEN.has(cp)) cured+=n; else {remain+=n; remainCps.push(cp);} }
console.log(`\n27-WIDENING: cures ${cured} of ${total} instances (${(100*cured/total).toFixed(1)}%); ${remain} survive across ${remainCps.length} codepoints: ${remainCps.sort((a,b)=>a-b).map(hx).join(' ')}`);
// distinct mangled TOKENS
const tokens=new Set(), tokensCuredFully=new Set();
for(const [,v] of strings){ let bad=false, allWiden=true;
  for(const ch of v){const cp=ch.codePointAt(0); if(!inSet(cp)){bad=true; if(!WIDEN.has(cp)) allWiden=false;}}
  if(bad){ tokens.add(v); if(allWiden) tokensCuredFully.add(v); } }
console.log(`\ndistinct mangled name TOKENS = ${tokens.size}; fully repaired by the 27-widening = ${tokensCuredFully.size} -> ${[...tokensCuredFully].join(', ')}`);
console.log(`STILL MANGLED after the widening = ${tokens.size-tokensCuredFully.size}`);
console.log('sample survivors:', [...tokens].filter(t=>!tokensCuredFully.has(t)).slice(0,12).join(', '));
// what an embedded Lora-4 / Nunito-4 cures: all 8 pinned are covered -> 0
console.log('\nEMBEDDED FONT (Lora-4 or Nunito-4): every one of the 8 miss codepoints is in both intersections (measured earlier) => instances 0, tokens 0.');
