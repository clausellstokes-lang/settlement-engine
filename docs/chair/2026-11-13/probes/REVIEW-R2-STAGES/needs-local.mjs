// C item 4b: of the needs the tab now prints "Needed, and not brought in", which the town makes itself (export, local
// production, or a chain of the record that is running/productive on it), matched by C's own needMetBy families.
import fs from 'node:fs'; import zlib from 'node:zlib';
const T=process.env.TREE; const rd=(f)=>{ const m=new Map(); for(const l of zlib.gunzipSync(fs.readFileSync(f)).toString().split('\n')) if(l){ const o=JSON.parse(l); m.set(o.seed,o.s);} return m; };
const { importsAsPrinted, needMetBy } = await import(T+'/src/domain/display/tradeListDisplay.js');
const C=rd(process.argv[2]); let towns=0, needs=0, local=0, tl=new Set(); const ex=[]; const byNeed={};
for(const [k,s] of C){ const { needed } = importsAsPrinted(s); if(!needed.length) continue; towns++;
  const eco=s.economicState||{}; const chains=(eco.activeChains||[]).filter(c=>!/impaired|broken|failed|depleted|dormant/i.test(String(c.status)));
  const localItems=[...(eco.primaryExports||[]).map(x=>['export',x]), ...(eco.localProduction||[]).map(x=>['local production',typeof x==='string'?x:(x.name||x.good||JSON.stringify(x))]), ...chains.flatMap(c=>[c.resource,...(c.outputs||[]),c.label||c.chainId].filter(Boolean).map(x=>['chain '+(c.label||c.chainId)+' '+c.status,String(x)]))];
  for(const n of needed){ needs++; const hit=localItems.find(([,x])=>needMetBy(n,String(x))); if(hit){ local++; tl.add(k); byNeed[n]=(byNeed[n]||0)+1; if(ex.length<400) ex.push([k,n,hit[0],hit[1]]); } } }
console.log(`towns with a needs line ${towns}; needs printed ${needs}; of them made here (export, local production or a working chain) ${local} in ${tl.size} towns`);
console.log('by need:', Object.entries(byNeed).sort((a,b)=>b[1]-a[1]).slice(0,15).map(([k,v])=>k+' '+v).join(' · '));
fs.writeFileSync(process.argv[3], JSON.stringify(ex,null,0).replace(/\],\[/g,'],\n['));
