import { readFileSync } from 'node:fs';
const B = JSON.parse(readFileSync('digest-BASE.json','utf8'));
const O = JSON.parse(readFileSync('digest-OFF.json','utf8'));
const N = JSON.parse(readFileSync('digest-ON.json','utf8'));
console.log('=== ARM 1 · DORMANCY: flag OFF at my tip vs the SEALED BASE ee0db96d3 ===');
let allSame = true;
for (const k of Object.keys(B)) {
  const same = B[k].digest === O[k].digest;
  const ih = B[k].inputsHash === O[k].inputsHash;
  if (!same || !ih) allSame = false;
  console.log(`  ${k.padEnd(10)} fabricDigest ${same ? 'IDENTICAL' : '*** DIFFERS ***'}  inputsHash ${ih ? 'IDENTICAL' : '*** DIFFERS ***'}  (${B[k].bytes} B)`);
  if (!same) console.log(`      base=${B[k].digest}\n      off =${O[k].digest}`);
}
console.log(`  VERDICT: ${allSame ? 'BYTE-FROZEN' : 'NOT FROZEN'}`);
console.log('\n=== ARM 2 · THE ARMED DIFFERENTIAL: flag ON vs the SEALED BASE ===');
for (const k of Object.keys(B)) {
  const c = N[k].cliffs;
  const moved = B[k].digest !== N[k].digest;
  const wallsMoved = B[k].wallsDigest !== N[k].wallsDigest;
  const term = N[k].walls.reduce((a,w)=>a+w.termini,0);
  const seg = N[k].walls.reduce((a,w)=>a+w.segments,0);
  const drop = N[k].walls.reduce((a,w)=>a+w.dropped,0);
  const fb = N[k].walls.reduce((a,w)=>a+w.fallbacks,0);
  console.log(`  ${k.padEnd(10)} cliffEdges=${String(c?c.edges:0).padStart(3)} (b${c?c.brink:0}/f${c?c.foot:0}) regions=${String(c?c.regions:0).padStart(2)} cragCells=${String(c?c.cragCells:0).padStart(4)} | segments=${seg} termini=${term} dropped=${drop} fallbacks=${fb} | fabric ${moved?'MOVED':'same'} walls ${wallsMoved?'MOVED':'same'}`);
}
console.log('\n=== ARM 3 · inputsHash moves exactly when the escarpment is consumed ===');
for (const k of Object.keys(B)) {
  console.log(`  ${k.padEnd(10)} base=${B[k].inputsHash.slice(0,12)} on=${N[k].inputsHash.slice(0,12)} ${B[k].inputsHash===N[k].inputsHash?'same':'MOVED'}   contentHash ${B[k].contentHash===N[k].contentHash?'same':'MOVED'}`);
}
