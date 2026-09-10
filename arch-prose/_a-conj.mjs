// read-only: per-block count of pools whose KEY carries a conjunction marker, plus multi-sentence variant share per block
import { readdirSync } from 'node:fs';
const dir = new URL('../laneB6/src/data/dossierStateProse/', import.meta.url);
const CONJ = /\bAND\b|\bNO\b|\bwith\b|\bwithout\b| × | · |\bonly\b|\bneither\b|\bbut\b/;
let corp = {};
for (const f of readdirSync(dir).filter((f) => f.endsWith('.generated.js'))) {
  const mod = await import(new URL(f, dir));
  for (const v of Object.values(mod)) if (v && typeof v === 'object') Object.assign(corp, v);
}
const rows = [];
let totConj = 0, totPools = 0, totV = 0, totMulti = 0;
for (const [id, b] of Object.entries(corp)) {
  const keys = Object.keys(b.pools);
  const conj = keys.filter((k) => CONJ.test(k));
  const vs = Object.values(b.pools).flat();
  const multi = vs.filter((v) => v.text.split(/(?<=[.?!])\s+(?=[A-Z"'(])/).length > 1).length;
  totConj += conj.length; totPools += keys.length; totV += vs.length; totMulti += multi;
  rows.push({ id, pools: keys.length, conj: conj.length, variants: vs.length, multi, slotOnlySettlement: vs.every((v) => (v.slots||[]).every((s) => s === 'settlement')) });
}
rows.sort((a, b) => b.conj - a.conj || b.pools - a.pools);
console.log(`blocks ${rows.length} pools ${totPools} conj-keyed pools ${totConj} variants ${totV} multi-sentence ${totMulti}`);
console.log('top conj-keyed blocks:');
for (const r of rows.slice(0, 16)) console.log(`  ${r.id.padEnd(9)} pools ${String(r.pools).padStart(2)} conj ${String(r.conj).padStart(2)} variants ${String(r.variants).padStart(3)} multi ${String(r.multi).padStart(3)} settlementOnly=${r.slotOnlySettlement}`);
console.log('blocks with zero conj-keyed pools:', rows.filter((r) => r.conj === 0).length);
for (const id of ['DS-DEF-11','DS-GEN-3','DS-ECO-1','DS-ECO-2','DS-DEF-2']) { const r = rows.find((x) => x.id === id); console.log(`  ${id}: pools ${r.pools} conj ${r.conj} variants ${r.variants} multi ${r.multi}`); }
