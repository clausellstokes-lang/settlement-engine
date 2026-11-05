// node docs/census/declarations/_mute_scan.mjs <repo-root> <out.json> <count>: the economy desk's reads per soak birth, flattened (CENSUS-3b unit 4's mute scan; diff two runs with _mute_diff.mjs)
const [repo, out, n] = process.argv.slice(2);
const { birth, ensureLaws } = await import(repo + '/scripts/audit/soak-review/corpus.mjs');
const { economyDeskRead } = await import(repo + '/src/components/new/economyDeskRead.js');
const fs = await import('node:fs');
await ensureLaws();
const flat = (v, p, o) => { if (v == null) { o[p] = null; return o; } if (typeof v === 'string') { o[p] = v; return o; } if (typeof v === 'object') for (const [k, x] of Object.entries(v)) flat(x, p ? p + '.' + k : k, o); return o; };
const res = {};
for (let i = 0; i < Number(n); i++) { const s = birth(i).settlement; try { res[i] = flat(economyDeskRead(s), '', {}); } catch (e) { res[i] = { error: String(e) }; } }
fs.writeFileSync(out, JSON.stringify(res)); process.exit(0);
