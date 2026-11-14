import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,T]=process.argv.slice(2);
const t=await import(T+'/src/domain/display/tradeListDisplay.js'); const { crisisOf } = await import(T+'/src/domain/facts/crisisKind.js');
let sieges=0, withImp=0, pills=0, pdf=0, fdy=0; const ex=[];
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l);
  if(!crisisOf(s).has('under_siege')) continue; sieges++;
  const a=t.importsAsPrinted(s).arriving; if(a.length){withImp++; pills+=a.length; if(ex.length<6) ex.push(`${seed} [${s.stress?.type||(s.stresses||[]).map(x=>x.type).join('+')}] ${a.join(' · ').slice(0,150)}`);}
  if((s.economicState?.primaryImports||[]).length) pdf++;
  if(t.displayTradeList(s.economicState?.primaryImports, s, {side:'imports',exports:s.economicState?.primaryExports}).length) fdy++;
}
console.log(`towns under a siege in force ${sieges}; Imports row with goods ${withImp} (${pills} pills); PDF Imports list ${pdf}; Foundry Imports ${fdy}`); console.log(ex.join('\n'));
