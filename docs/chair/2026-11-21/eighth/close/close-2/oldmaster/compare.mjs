import { readFileSync } from 'node:fs';
const [a, b] = process.argv.slice(2).map((p) => JSON.parse(readFileSync(p, 'utf8')));
const tiers = ['thorp','hamlet','village','town','city','metropolis'];
const tab = {}; const fullDiff = Object.fromEntries(tiers.map((t)=>[t,0])); const tierN = Object.fromEntries(tiers.map((t)=>[t,0]));
const factsDiff = {};
for (const k of Object.keys(a)) {
  const A = a[k], B = b[k]; const t = A.facts.settType; tierN[t]++;
  if (A.full !== B.full) fullDiff[t]++;
  const fs = new Set([...Object.keys(A.fields), ...Object.keys(B.fields)]);
  for (const f of fs) if (A.fields[f] !== B.fields[f]) { tab[f] ??= Object.fromEntries(tiers.map((t)=>[t,0])); tab[f][t]++; }
  for (const f of Object.keys(A.facts)) if (JSON.stringify(A.facts[f]) !== JSON.stringify(B.facts[f])) factsDiff[f] = (factsDiff[f]||0)+1;
  const ka = Object.keys(A.fields), kb = Object.keys(B.fields);
  const added = kb.filter((x)=>!ka.includes(x)), removed = ka.filter((x)=>!kb.includes(x));
  if (added.length||removed.length) factsDiff['__keys:+'+added+' -'+removed] = (factsDiff['__keys:+'+added+' -'+removed]||0)+1;
}
console.log('tierN', JSON.stringify(tierN)); console.log('fullDiff', JSON.stringify(fullDiff));
const rowsT = Object.entries(tab).map(([f,c])=>[f, tiers.reduce((s,t)=>s+c[t],0), c]).sort((x,y)=>y[1]-x[1]);
for (const [f,tot,c] of rowsT) console.log(`| ${f} | ${tot} | ${tiers.map((t)=>c[t]).join(' | ')} |`);
console.log('factsDiff', JSON.stringify(factsDiff));
