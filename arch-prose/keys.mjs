import { readdirSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const gdir=path.join(D,'src/data/dossierStateProse');
const all={};
for (const f of readdirSync(gdir).filter(f=>f.endsWith('.generated.js'))) { const m=await import(pathToFileURL(path.join(gdir,f)).href); Object.assign(all, Object.values(m)[0]); }
const keys=[]; for(const [bid,b] of Object.entries(all)) for(const k of Object.keys(b.pools)) keys.push([bid,k]);
console.log('total pool keys', keys.length);
const colon=keys.filter(([,k])=>k.includes(': ')).length;
console.log('keys with a ": " group join:', colon);
console.log('keys with UPPERCASE lead word:', keys.filter(([,k])=>/^[A-Z][A-Z ]+/.test(k)).length);
console.log('keys starting "COMBINATION":', keys.filter(([,k])=>/^COMBINATION/.test(k)).length);
const lens=keys.map(([,k])=>k.length).sort((a,b)=>a-b);
console.log('key length min/median/max:', lens[0], lens[Math.floor(lens.length/2)], lens[lens.length-1]);
console.log('longest key:', JSON.stringify(keys.map(x=>x[1]).sort((a,b)=>b.length-a.length)[0]));
console.log('blocks without sectionTarget:', Object.entries(all).filter(([,b])=>!b.sectionTarget).map(([i])=>i).join(' '));
console.log('state block with arms:', Object.entries(all).filter(([,b])=>b.arms).map(([i,b])=>`${i}:[${b.arms}]`).join(' '));
console.log('blocks whose block.slots is empty:', Object.entries(all).filter(([,b])=>!b.slots||b.slots.length===0).map(([i])=>i).join(' '));
// slot declared at block level but never used by a variant, and vice versa
let declaredUnused=0, usedUndeclared=[];
for (const [bid,b] of Object.entries(all)){ const used=new Set(); for(const vs of Object.values(b.pools)) for(const v of vs) for(const s of v.slots) used.add(s);
  for (const s of b.slots||[]) if(!used.has(s)) declaredUnused++;
  for (const s of used) if(!(b.slots||[]).includes(s)) usedUndeclared.push(`${bid}/{${s}}`); }
console.log('block-declared slots never used by a variant:', declaredUnused);
console.log('variant slots not in block.slots:', usedUndeclared.join(' ')||'(none)');
// variants with zero slots
let zero=0,tot=0; for(const b of Object.values(all)) for(const vs of Object.values(b.pools)) for(const v of vs){tot++; if(v.slots.length===0) zero++;}
console.log(`variants naming NO slot: ${zero} of ${tot}`);
// text length classes
const L=[]; for(const b of Object.values(all)) for(const vs of Object.values(b.pools)) for(const v of vs) L.push(v.text.split(/\s+/).length);
L.sort((a,b)=>a-b); console.log('variant word-count min/p25/median/p75/max:', L[0], L[Math.floor(L.length*0.25)], L[Math.floor(L.length/2)], L[Math.floor(L.length*0.75)], L[L.length-1]);
