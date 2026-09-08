import { readdirSync } from 'node:fs';
const dir = process.argv[2];
const files = readdirSync(dir).filter(f=>f.endsWith('.generated.js'));
let blocks=0, pools=0, variants=0;
const sentDist={}, slotUse={}, marks={}, angles={}, poolSizes={};
let multi=0, chars=0, maxChars=0;
const perLeaf={};
const startsLower=[];
for (const f of files) {
  const mod = await import(`${dir}/${f}`);
  const corpus = Object.values(mod)[0];
  perLeaf[f]={blocks:0,pools:0,variants:0};
  for (const [bid, block] of Object.entries(corpus)) {
    blocks++; perLeaf[f].blocks++;
    for (const [pk, pool] of Object.entries(block.pools||{})) {
      pools++; perLeaf[f].pools++;
      poolSizes[pool.length]=(poolSizes[pool.length]||0)+1;
      for (const v of pool) {
        variants++; perLeaf[f].variants++;
        const n = (v.text.match(/[.!?]["')”]?(\s|$)/g)||[]).length || 1;
        sentDist[n]=(sentDist[n]||0)+1;
        if (n>1) multi++;
        chars += v.text.length; if (v.text.length>maxChars) maxChars=v.text.length;
        for (const s of (v.slots||[])) slotUse[s]=(slotUse[s]||0)+1;
        for (const m of (v.marks||[])) marks[m]=(marks[m]||0)+1;
        angles[v.angle||'(none)']=(angles[v.angle||'(none)']||0)+1;
        if (/^[a-z]/.test(v.text)) startsLower.push(`${bid}|${pk}`);
      }
    }
  }
}
console.log('blocks',blocks,'pools',pools,'variants',variants);
console.log('sentences-per-variant', sentDist, 'multi-sentence variants', multi, `(${(100*multi/variants).toFixed(1)}%)`);
console.log('mean chars', (chars/variants).toFixed(1), 'max', maxChars);
console.log('pool sizes (variants->#pools)', poolSizes);
console.log('slot uses', Object.fromEntries(Object.entries(slotUse).sort((a,b)=>b[1]-a[1])));
console.log('marks', marks);
console.log('angles', Object.fromEntries(Object.entries(angles).sort((a,b)=>b[1]-a[1])));
console.log('sentence-initial-lowercase variants', startsLower.length);
console.log('per leaf', perLeaf);
