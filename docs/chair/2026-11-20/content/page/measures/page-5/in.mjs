const [, , file, kinds, prefixes] = process.argv;
const rows = JSON.parse((await import('node:fs')).readFileSync(file, 'utf8'));
const re = new RegExp('^(' + prefixes + ')');
for (const k of kinds.split(',')) {
  const g = rows.filter((r) => r.tensions.some((x) => x.type === k)); const n = g.length; const c = new Map();
  for (const r of g) for (const f of r.F) if (re.test(f)) c.set(f, (c.get(f) || 0) + 1);
  console.log(`== ${k} (${n}): ` + [...c].filter(([, m]) => m / n >= 0.05).sort((a, b) => a[0].localeCompare(b[0])).map(([f, m]) => `${f} ${Math.round(100 * m / n)}`).join(' | '));
}
