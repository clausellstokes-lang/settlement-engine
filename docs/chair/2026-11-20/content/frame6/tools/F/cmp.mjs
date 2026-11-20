import fs from 'node:fs';
const [A, B] = process.argv.slice(2).map((f) => JSON.parse(fs.readFileSync(f, 'utf8')).digests);
let st = 0, calm = 0, calmEq = 0, fr = 0, frEq = 0; const moved = [];
for (const k of Object.keys(A)) {
  if (A[k].stranger === B[k].stranger) st++;
  if (!A[k].framed) { calm++; if (A[k].owner === B[k].owner) calmEq++; }
  else { fr++; if (A[k].owner === B[k].owner) frEq++; else moved.push(k); }
  if (A[k].framed !== B[k].framed) console.log('FRAMED FLAG MOVED', k);
}
console.log(`stranger ${st}/${Object.keys(A).length}; calm owner ${calmEq}/${calm}; framed owner equal ${frEq}/${fr}, moved ${moved.length}`);
console.log(moved.join(' '));
