// FRAME-9 · F3+F4: compare two f3f4.mjs outputs (base, tip): stranger equal, calm owner equal, framed owner moved by strain.
// argv: <base.json> <tip.json>
import fs from 'node:fs';
const [A, B] = process.argv.slice(2).map((p) => JSON.parse(fs.readFileSync(p, 'utf8')).digests);
const out = { towns: 0, strangerEqual: 0, calmOwner: 0, calmOwnerEqual: 0, framedOwner: 0, framedMovedByStrain: {}, framedEqualByStrain: {} };
for (const seed of Object.keys(A)) {
  const a = A[seed]; const b = B[seed];
  out.towns++;
  if (a.stranger === b.stranger) out.strangerEqual++;
  if (!a.framed) { out.calmOwner++; if (a.owner === b.owner) out.calmOwnerEqual++; continue; }
  out.framedOwner++;
  const k = a.owner === b.owner ? 'framedEqualByStrain' : 'framedMovedByStrain';
  out[k][a.strain] = (out[k][a.strain] || 0) + 1;
}
console.log(JSON.stringify(out));
