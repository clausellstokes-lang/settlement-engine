const [, , file, kinds] = process.argv;
const rows = JSON.parse((await import('node:fs')).readFileSync(file, 'utf8'));
for (const k of kinds.split(',')) { const m = new Map(); const bt = {}; for (const r of rows) for (const x of r.tensions) if (x.type === k) { m.set(x.d, (m.get(x.d) || 0) + 1); }
  console.log(`== ${k}: ` + [...m].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([d, c]) => `${c}× ${d.slice(0, 150)}`).join('\n   ')); }
