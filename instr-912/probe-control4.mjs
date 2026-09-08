import { segmentCount, openerOf } from '../laneINSTR/src/domain/prose/grammarWalker.js';
import { loadStateLeaves, loadCausalLeaf, poolCells } from '../laneINSTR/tests/helpers/dossierCorpus.js';
const r1 = await loadStateLeaves();
const cells = poolCells(r1);
let uniform=0, repeated=0, multi=0;
for (const [id, pool] of cells) {
  const segs = pool.map(v=>segmentCount(v.text));
  const ops  = pool.map(v=>openerOf(v.text));
  if (new Set(segs).size===1) uniform++;
  if (new Set(ops).size < ops.length) repeated++;
  if (pool.length>1) multi++;
}
console.log(`R1 pools ${cells.size} | multi-variant ${multi}`);
console.log(`uniform in SEGMENT count: ${uniform}/${cells.size} = ${(uniform/cells.size).toFixed(4)}   [target 407/708 = 0.575]`);
console.log(`with a REPEATED two-word opener: ${repeated}/${cells.size} = ${(repeated/cells.size).toFixed(4)}   [target 79/708 = 0.112]`);
// variants on the alternative denominators
const uniformMulti=[...cells.values()].filter(p=>p.length>1 && new Set(p.map(v=>segmentCount(v.text))).size===1).length;
const repMulti=[...cells.values()].filter(p=>p.length>1 && new Set(p.map(v=>openerOf(v.text))).size<p.length).length;
console.log(`uniform over MULTI-variant pools only: ${uniformMulti}/${multi} = ${(uniformMulti/multi).toFixed(4)}`);
console.log(`repeated over MULTI-variant pools only: ${repMulti}/${multi} = ${(repMulti/multi).toFixed(4)}`);
// with R2 included
const all = poolCells([...r1, ...await loadCausalLeaf()]);
let u2=0,r2c=0; for (const p of all.values()){ if(new Set(p.map(v=>segmentCount(v.text))).size===1) u2++; if(new Set(p.map(v=>openerOf(v.text))).size<p.length) r2c++; }
console.log(`R1+R2 pools ${all.size}: uniform ${u2} (${(u2/all.size).toFixed(4)}), repeated ${r2c} (${(r2c/all.size).toFixed(4)})`);
