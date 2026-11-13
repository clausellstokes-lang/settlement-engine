// For each removed "No one here works" line: the gap's resource keys (validationOnPage's own gapResourceKeys, replicated
// from its CHAIN_INPUTS words) and the chains the leaf says work them, with the houses they run through.
import fs from 'node:fs'; import zlib from 'node:zlib';
const TT=process.argv[2]; const rd=(f)=>{ const m=new Map(); for(const l of zlib.gunzipSync(fs.readFileSync(f)).toString().split('\n')) if(l){ const o=JSON.parse(l); m.set(o.seed,o.s);} return m; };
const T=rd(process.argv[3]); const rem=JSON.parse(fs.readFileSync(process.argv[4],'utf8'));
const { availableNativeResourceKeys } = await import(TT+'/src/domain/resourceSemantics.js');
const RD=(await import(TT+'/src/data/resourceData.js').catch(()=>null)); const leaf=await import(TT+'/src/domain/facts/chainWorking.js');
const src=fs.readFileSync(TT+'/src/domain/display/validationOnPage.js','utf8'); const rdImport=src.match(/import \{[^}]*RESOURCE_DATA[^}]*\} from '([^']+)'/);
const RESOURCE_DATA=(await import(TT+'/src/domain/display/'+rdImport[1])).RESOURCE_DATA;
const ci=src.slice(src.indexOf('const CHAIN_INPUTS'), src.indexOf('});', src.indexOf('const CHAIN_INPUTS'))+3); const CHAIN_INPUTS=eval('('+ci.replace(/^const CHAIN_INPUTS = Object.freeze\(/,'').replace(/\);$/,'')+')');
const norm=(x)=>` ${String(x).toLowerCase().replace(/[_/()\-,.]+/g,' ').replace(/\s+/g,' ').trim()} `; const holds=(t,w)=>t.includes(norm(w))||t.includes(norm(w+'s'));
const nounToSpec=(res)=>Object.entries(CHAIN_INPUTS).filter(([,v])=>(v.raw||v.noun)===res||v.noun===res||v.words.includes(res)||res.includes(v.noun));
const out=[]; const cls={};
for(const r of rem){ const s=T.get(r.seed); const specs=nounToSpec(r.res); const keys=new Set();
  for(const [,spec] of specs) for(const k of availableNativeResourceKeys(s.config||{})){ const text=[k,...(RESOURCE_DATA[k]?.commodities||[])].map(String).map(norm).join('|'); if(spec.words.some(w=>holds(text,w))) keys.add(k); }
  const ws=leaf.chainsWorking(s,[...keys]); const why=ws.map(c=>`${c.label||c.chainId} on ${c.resourceInputKey} via ${(c.processingInstitutions||[]).join('+')}`);
  const k2=r.res+' <- '+ws.map(c=>`${c.label||c.chainId} on ${c.resourceInputKey} via ${(c.processingInstitutions||[]).join('+')}`).join(' | '); cls[k2]=(cls[k2]||0)+1; out.push({...r,keys:[...keys],why}); }
for(const [k,v] of Object.entries(cls).sort((a,b)=>b[1]-a[1])) console.log(v, k.slice(0,230));
fs.writeFileSync(process.argv[5], JSON.stringify(out,null,1));
