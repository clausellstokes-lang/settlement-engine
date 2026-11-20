// prints, for the given seeds, each side's face at two trees: words: name (kind/rule) — reason
import fs from 'node:fs';
const [POOL, RA, RB, ...seeds] = process.argv.slice(2);
const A = await import(RA + 'domain/summary/tonightSheet.js'), B = await import(RB + 'domain/summary/tonightSheet.js');
const { towns } = JSON.parse(fs.readFileSync(POOL, 'utf8'));
const show = (sh) => [...(sh.frame?.sides || []).map((x) => `${x.words}: ${x.name || '(no one named)'}${x.role ? ` · ${x.role}` : ''} [${x.kind}] — ${x.reason}`), `people: ${sh.people.map((p) => `${p.name}[${p.why}]`).join(', ')}`, `facts: ${sh.facts.map((f) => `${f.label}: ${f.text}`).join(' | ')}`];
for (const seed of seeds) {
  const { s } = towns.find((t) => t.seed === seed);
  const a = show(A.composeTonightSheet(s, { audience: 'owner' })), b = show(B.composeTonightSheet(s, { audience: 'owner' }));
  console.log(`== ${seed}`);
  a.forEach((x, i) => console.log(x === b[i] ? `   ${x}` : `  -${x}\n  +${b[i]}`));
}
