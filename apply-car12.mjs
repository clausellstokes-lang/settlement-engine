import { readFileSync, writeFileSync } from 'node:fs';
const f = process.argv[2];
let src = readFileSync(f, 'utf8');
const edits = [
  ['state.config — the Library',        'state.config: the Library'],
  ['by prefix — so what keeps this ',   'by prefix. So what keeps this '],
  ['changed BYTES — the entry chunk',   'changed BYTES: the entry chunk'],
];
for (const [before, after] of edits) {
  const n = src.split(before).length - 1;
  if (n !== 1) { console.error(`REFUSED: ${n} occurrences of ${JSON.stringify(before)}`); process.exit(2); }
  src = src.replace(before, after);
  console.log(`OK  ${JSON.stringify(before)}\n -> ${JSON.stringify(after)}`);
}
writeFileSync(f, src);
console.log('written');
