import fs from 'node:fs';
const rd = (f) => Object.fromEntries(fs.readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).map((r) => [r.seed, r]));
const [a, b] = [rd(process.argv[2]), rd(process.argv[3])]; const want = process.argv[4]; const mode = process.argv[5] || 'gone';
const out = [];
for (const s of Object.keys(a)) { const A = a[s], B = b[s];
  A.cards.forEach((c, i) => { const bo = B.cards[i]?.outs || [];
    if (c.outs.includes(want) && (mode === 'gone' ? !bo.includes(want) : bo.includes(want))) out.push(`${s}(${A.pop})[${(c.houses||[]).slice(0,3).join('/')}] roster-hit:${A.roster.filter((r)=>new RegExp(process.argv[6]||'^$','i').test(r)).slice(0,2).join('/')}`); }); }
console.log(out.length, out.slice(0, 6).join(' ; '));
