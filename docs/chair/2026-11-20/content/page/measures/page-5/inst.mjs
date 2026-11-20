const [, , file, kind, filt] = process.argv;
const rows = JSON.parse((await import('node:fs')).readFileSync(file, 'utf8'));
const g = rows.filter((r) => r.tensions.some((x) => x.type === kind)); const n = g.length; const c = new Map(); const pc = new Map();
const re = new RegExp(filt, 'i');
for (const r of g) { for (const nm of new Set(r.insts.filter((i) => re.test(JSON.stringify(i))).map((i) => i.n))) c.set(nm, (c.get(nm) || 0) + 1); for (const p of new Set(r.powers.map((p) => `${p.c}:${p.n}`))) pc.set(p, (pc.get(p) || 0) + 1); }
console.log(`== ${kind} ${n} insts: ` + [...c].sort((a, b) => b[1] - a[1]).map(([k, m]) => `${k} ${Math.round(100 * m / n)}`).join(' | '));
console.log(`   powers: ` + [...pc].sort((a, b) => b[1] - a[1]).slice(0, 30).map(([k, m]) => `${k} ${Math.round(100 * m / n)}`).join(' | '));
