import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
const T='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree';
const FD=join(T,'public/fonts');
const fontkit=await import(join(T,'node_modules/fontkit/dist/module.mjs')).catch(()=>null);
function fkSet(p){ return new Set(fontkit.default? fontkit.default.openSync(p).characterSet : fontkit.openSync(p).characterSet); }
function inter(files){ let s=null; for(const f of files){const t=fkSet(join(FD,f)); s=s===null?new Set(t):new Set([...s].filter(c=>t.has(c)));} return s; }
function toRangeString(cps){ const s=[...cps].sort((a,b)=>a-b); const hex=c=>c.toString(16).toUpperCase(); const out=[]; let st=null,pv=null;
  for(const c of s){ if(st===null){st=c;pv=c;continue;} if(c===pv+1){pv=c;continue;} out.push(st===pv?hex(st):`${hex(st)}-${hex(pv)}`); st=c;pv=c;}
  if(st!==null) out.push(st===pv?hex(st):`${hex(st)}-${hex(pv)}`); return out.join(' '); }
const ALL8=readdirSync(FD).filter(f=>f.endsWith('.ttf')).sort();
const LORA3=['Lora-Regular.ttf','Lora-Bold.ttf','Lora-Italic.ttf'];
const LORA4=[...LORA3,'Lora-BoldItalic.ttf'];
const NUN3=['Nunito-Regular.ttf','Nunito-Bold.ttf','Nunito-Italic.ttf'];
const dossier=inter(ALL8);
console.log('fontkit dossier intersection (today, manifest says 759) =', dossier.size);
const rows=[['8-face (dossier, today)',ALL8],['Lora-3 (R/B/I)',LORA3],['Lora-4',LORA4],['Nunito-3 (R/B/I)',NUN3]];
const todayRanges='20-7E A1-FF';
console.log(`\ntoday campaign-pdf: count=190  ranges="${todayRanges}" (${todayRanges.length} chars)`);
for(const [name,files] of rows){
  const s=inter(files); const r=toRangeString(s);
  const bytes=files.reduce((a,f)=>a+statSync(join(FD,f)).size,0);
  const sha=createHash('sha256'); for(const f of files) sha.update(readFileSync(join(FD,f)));
  console.log(`${name.padEnd(26)} count=${String(s.size).padStart(4)}  rangesChars=${String(r.length).padStart(4)} (+${r.length-todayRanges.length})  ttfBytes=${bytes}  inputsSha256=${sha.digest('hex').slice(0,16)}…`);
  if(name.startsWith('Lora-3')){ console.log('   Lora-3 ranges =', r); 
    const dj=[...dossier].filter(c=>s.has(c)); console.log('   dossier ∩ this =', dj.length, '(today that arithmetic pin reads 189)'); }
  if(name.startsWith('Nunito-3')){ const dj=[...dossier].filter(c=>s.has(c)); console.log('   dossier ∩ this =', dj.length); }
}
// generated file size delta estimate
const genJs=join(T,'src/domain/content/customContentCharset.generated.js');
const genTs=join(T,'supabase/functions/_shared/customContentCharset.generated.ts');
const l3=toRangeString(inter(LORA3));
console.log(`\ngenerated artifact size today: .js=${statSync(genJs).size} B  .ts=${statSync(genTs).size} B`);
console.log(`predicted delta (Lora-3): +2 × (${l3.length} - ${todayRanges.length}) = +${2*(l3.length-todayRanges.length)} B per artifact (campaign-pdf AND world-book carry the string)`);
