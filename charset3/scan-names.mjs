import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const DOCK='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree';
const { sanitizeJsPdfText } = await import(pathToFileURL(DOCK+'/src/utils/jsPdfText.js'));
const U=(cp)=>'U+'+cp.toString(16).toUpperCase().padStart(4,'0');

// 1) which data files carry letters the jsPDF pass strips
const stripped=(ch)=>{const a='a'+ch+'a';return sanitizeJsPdfText(a)!==a;};
const files=[];
function walk(d){for(const e of readdirSync(d)){const p=join(d,e);const st=statSync(p);
 if(st.isDirectory()){if(e==='node_modules')continue;walk(p);}
 else if(/\.(js|jsx|json)$/.test(e)) files.push(p);}}
walk(join(DOCK,'src'));

const letterRe=/\p{L}/u;
const byFile=new Map();
for(const p of files){
  const src=readFileSync(p,'utf8');
  for(const ch of src){
    const cp=ch.codePointAt(0);
    if(cp<0x80) continue;
    if(!letterRe.test(ch)) continue;      // letters only — not box-drawing / arrows / math
    if(!stripped(ch)) continue;            // only what the jsPDF pass erases
    const k=p.slice(DOCK.length+1);
    const rec=byFile.get(k)||new Map(); rec.set(U(cp)+' '+ch,(rec.get(U(cp)+' '+ch)||0)+1); byFile.set(k,rec);
  }
}
console.log('### FILES IN src/ WHOSE LETTERS THE jsPDF PASS ERASES');
for(const [f,m] of [...byFile.entries()].sort((a,b)=>[...b[1].values()].reduce((x,y)=>x+y,0)-[...a[1].values()].reduce((x,y)=>x+y,0))){
  const tot=[...m.values()].reduce((x,y)=>x+y,0);
  console.log(String(tot).padStart(5), f, '|', [...m.entries()].map(([k,v])=>k+'×'+v).join(' '));
}

// 2) extract the actual affected name tokens from namingData.js
const nd=readFileSync(join(DOCK,'src/data/namingData.js'),'utf8');
const toks=[...nd.matchAll(/'([^'\n]{2,40})'|"([^"\n]{2,40})"/g)].map(m=>m[1]??m[2]);
const bad=[...new Set(toks.filter(t=>letterRe.test(t)&&sanitizeJsPdfText(t)!==t))];
console.log('\n### namingData.js STRING LITERALS THE jsPDF PASS MANGLES:', bad.length);
for(const t of bad) console.log('   ', JSON.stringify(t), '->', JSON.stringify(sanitizeJsPdfText(t)));
