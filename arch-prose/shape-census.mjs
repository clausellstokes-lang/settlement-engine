import { readdirSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const gdir=path.join(D,'src/data/dossierStateProse');
const load=async(p)=>{const m=await import(pathToFileURL(p).href);return Object.values(m)[0];};
const tables=[];
for (const f of readdirSync(gdir).filter(f=>f.endsWith('.generated.js'))) tables.push([f, await load(path.join(gdir,f))]);
const causal=await load(path.join(D,'src/data/dossierCausalProse.generated.js'));
function census(label, entries){
  const blockKeys=new Map(), varKeys=new Map(), angles=new Map(), marks=new Map();
  let blocks=0,pools=0,variants=0; const perBlockPools=[], perPoolVars=new Map(); let poolsWithEmDash=0, soleP=0;
  const poolKeySamples=[];
  for (const [bid,b] of entries){ blocks++;
    for (const k of Object.keys(b)) blockKeys.set(k,(blockKeys.get(k)||0)+1);
    const pk=Object.keys(b.pools||{}); perBlockPools.push([bid,pk.length]);
    for (const [pkey,vs] of Object.entries(b.pools||{})){ pools++;
      if(/[—–]/.test(pkey)) poolsWithEmDash++;
      if(pkey==='*') soleP++;
      perPoolVars.set(vs.length,(perPoolVars.get(vs.length)||0)+1);
      if(poolKeySamples.length<0) poolKeySamples.push(pkey);
      for (const v of vs){ variants++;
        for (const k of Object.keys(v)) varKeys.set(k,(varKeys.get(k)||0)+1);
        angles.set(v.angle,(angles.get(v.angle)||0)+1);
        for (const m of v.marks||[]) marks.set(m,(marks.get(m)||0)+1);
      }
    }
  }
  console.log(`\n== ${label}: ${blocks} blocks, ${pools} pools, ${variants} variants (mean ${(variants/pools).toFixed(2)}/pool)`);
  console.log('block-level keys:', [...blockKeys].map(([k,n])=>`${k}=${n}`).join(' '));
  console.log('variant-level keys:', [...varKeys].map(([k,n])=>`${k}=${n}`).join(' '));
  console.log('angles:', [...angles].sort((a,b)=>b[1]-a[1]).map(([k,n])=>`${k}=${n}`).join(' '));
  console.log('marks:', [...marks].sort((a,b)=>b[1]-a[1]).map(([k,n])=>`${k}=${n}`).join(' '));
  console.log('variants-per-pool histogram:', [...perPoolVars].sort((a,b)=>a[0]-b[0]).map(([k,n])=>`${k}→${n}`).join(' '));
  console.log(`pool keys containing an em/en dash: ${poolsWithEmDash}; SOLE_POOL '*' pools: ${soleP}`);
  const top=perBlockPools.sort((a,b)=>b[1]-a[1]).slice(0,12);
  console.log('pools per block (top 12):', top.map(([b,n])=>`${b}=${n}`).join(' '));
  console.log('pools per block (min):', perBlockPools.slice(-6).map(([b,n])=>`${b}=${n}`).join(' '));
}
const stateEntries=tables.flatMap(([,t])=>Object.entries(t));
census('STATE (6 desk leaves)', stateEntries);
census('CAUSAL', Object.entries(causal));
for (const [f,t] of tables) { let p=0,v=0; for(const b of Object.values(t)){for(const vs of Object.values(b.pools)){p++;v+=vs.length;}} console.log(`  leaf ${f}: ${Object.keys(t).length} blocks ${p} pools ${v} variants`); }
