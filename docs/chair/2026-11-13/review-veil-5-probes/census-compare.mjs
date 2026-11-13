// REVIEW-VEIL-5 — compare two census files (master, tip): keys only on one side, per record kind.
import { readFileSync } from 'node:fs';
const [a, b] = process.argv.slice(2).map((f) => JSON.parse(readFileSync(f, 'utf-8')));
console.log(`towns: master ${a.towns}, tip ${b.towns}`);
for (const bucket of [...new Set([...Object.keys(a.census), ...Object.keys(b.census)])].sort()) {
  const A = a.census[bucket] || {}; const B = b.census[bucket] || {};
  const onlyA = Object.keys(A).filter((k) => !(k in B)); const onlyB = Object.keys(B).filter((k) => !(k in A));
  const typ = Object.keys(A).filter((k) => k in B && Object.keys(A[k].types).sort().join() !== Object.keys(B[k].types).sort().join());
  if (!onlyA.length && !onlyB.length && !typ.length) { console.log(`= ${bucket}: ${Object.keys(A).length} keys, same on both sides`); continue; }
  console.log(`# ${bucket}`);
  if (onlyA.length) console.log(`   only on MASTER (retired at the tip): ${onlyA.map((k) => `${k}(${A[k].n};${Object.keys(A[k].types).join('/')})`).join(', ')}`);
  if (onlyB.length) console.log(`   only at the TIP (new): ${onlyB.map((k) => `${k}(${B[k].n};${Object.keys(B[k].types).join('/')})`).join(', ')}`);
  if (typ.length) console.log(`   type changed: ${typ.map((k) => `${k}: ${Object.keys(A[k].types).join('/')} -> ${Object.keys(B[k].types).join('/')}`).join('; ')}`);
}
console.log('id shapes master', JSON.stringify(a.idShapes)); console.log('id shapes tip   ', JSON.stringify(b.idShapes));
console.log('linkedFactionIds (master):', JSON.stringify(a.linked));
