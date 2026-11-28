import fs from 'node:fs';
const [tree, file] = process.argv.slice(2);
const { DOSSIER_STATE_PROSE_DEFENSE: D } = await import(tree + '/src/data/dossierStateProse/defense.generated.js');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const res = []; for (const b of Object.values(D)) for (const vs of Object.values(b.pools || {})) for (const v of vs) res.push(new RegExp(v.text.split(/\{[a-zA-Z]+\}/).map((x) => x.slice(0, 40)).filter((x) => x.length > 12).map(esc)[0] || "^$"));
for (const l of fs.readFileSync(file, 'utf8').split('\n')) { if (!/^\s+(SAME|GONE|CHANGED)/.test(l)) continue; const t = l.split(' | ').slice(1).join(' | '); console.log((res.some((r) => r.test(t)) ? 'DESK ' : 'other') + l); }
