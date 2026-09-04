import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const DOCK='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree';
const req=createRequire(DOCK+'/package.json');
const { sanitizeJsPdfText }=await import(pathToFileURL(DOCK+'/src/utils/jsPdfText.js'));
const jspdfMod=await import(pathToFileURL(req.resolve('jspdf')));
const jsPDF=jspdfMod.jsPDF||jspdfMod.default?.jsPDF||jspdfMod.default;
const winAnsi=new jsPDF().getFont().metadata?.Unicode?.encoding?.WinAnsiEncoding;
const extra=new Set(Object.keys(winAnsi).map(Number));
const U=(cp)=>'U+'+cp.toString(16).toUpperCase().padStart(4,'0');

// The PROPOSED widened pass: today's class PLUS the 27 WinAnsi extras.
// A0 stays out (it is a declared `invisible` ban and both passes collapse it).
const extraClass=[...extra].sort((a,b)=>a-b).map(cp=>'\\u'+cp.toString(16).toUpperCase().padStart(4,'0')).join('');
const widenedRe=new RegExp('[^\\x09\\x0A\\x0D\\x20-\\x7E\\xA0-\\xFF'+extraClass+']','g');
const widened=(v)=>String(v||'').replace(widenedRe,' ').replace(/\s+/g,' ').trim();
console.log('proposed class tail:', extraClass);

// dossier font set
const fontkit=await import(pathToFileURL(req.resolve('fontkit')));
const fk=fontkit.default||fontkit;
const themeSrc=readFileSync(DOCK+'/src/pdf/theme.js','utf8');
const stripped=themeSrc.replace(/\/\*[\s\S]*?\*\//g,'').replace(/(^|[^:])\/\/[^\n]*/g,'$1');
const faces=[...stripped.matchAll(/src:\s*'(\/fonts\/[^'?]+\.ttf)(?:\?[^']*)?'/g)].map(m=>m[1]);
let dossier=null;
for(const f of faces){const s=new Set(fk.openSync(DOCK+'/public'+f).characterSet);dossier=dossier===null?s:new Set([...dossier].filter(c=>s.has(c)));}

const nd=readFileSync(DOCK+'/src/data/namingData.js','utf8');
const letterRe=/\p{L}/u;
const toks=[...nd.matchAll(/'([^'\n]{2,40})'|"([^"\n]{2,40})"/g)].map(m=>m[1]??m[2]);
const bad=[...new Set(toks.filter(t=>letterRe.test(t)&&sanitizeJsPdfText(t)!==t))];

let fixed=0, still=0;
const stillCps=new Map();
console.log('\n### ALL '+bad.length+' SHIPPED NAME TOKENS THE jsPDF PASS MANGLES TODAY');
console.log('name | today | after 27-widening | dossier-drawable');
for(const t of bad){
  const now=sanitizeJsPdfText(t), after=widened(t);
  const ok=after===t; ok?fixed++:still++;
  if(!ok) for(const ch of t){const cp=ch.codePointAt(0); if(cp>0x7f && !(cp>=0xa0&&cp<=0xff) && !extra.has(cp)) stillCps.set(U(cp)+' '+ch,(stillCps.get(U(cp)+' '+ch)||0)+1);}
  const dOk=[...t].every(ch=>dossier.has(ch.codePointAt(0)));
  console.log(`${JSON.stringify(t)} | ${JSON.stringify(now)} | ${JSON.stringify(after)} ${ok?'FIXED':'STILL MANGLED'} | dossier ${dOk?'OK':'NO'}`);
}
console.log('\nSUMMARY: tokens mangled today =',bad.length,' fully repaired by the 27-widening =',fixed,' still mangled =',still);
console.log('codepoints that keep mangling names after the widening (NOT in WinAnsi):');
for(const [k,v] of [...stillCps.entries()].sort()) console.log('   ',k,'in',v,'tokens');
console.log('\nall still-mangling codepoints drawable by the dossier fonts?',
  [...stillCps.keys()].every(k=>dossier.has(Number.parseInt(k.slice(2,6),16))));

// two named examples
for(const n of ['Uroš','Hadžić']){
  console.log(`\nEXAMPLE ${JSON.stringify(n)}: today ${JSON.stringify(sanitizeJsPdfText(n))} | after widening ${JSON.stringify(widened(n))} | dossier ${[...n].every(c=>dossier.has(c.codePointAt(0)))?'draws it intact':'cannot draw it'}`);
}
