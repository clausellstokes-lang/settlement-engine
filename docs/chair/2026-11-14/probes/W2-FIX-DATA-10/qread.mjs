import fs from 'node:fs'; import zlib from 'node:zlib';
const [needle, ...FILES] = process.argv.slice(2); const out = [];
const walk = (v, p, s, seed) => { if (typeof v === 'string') { if (v.includes(needle)) out.push({ seed, tier: s.tier, stress: [].concat(s.config?.stressTypes || []).join("+") || "-", path: p, v }); } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`, s, seed)); else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, `${p}.${k}`, s, seed); };
for (const F of FILES) for (const l of zlib.gunzipSync(fs.readFileSync(F)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l); walk(s, '', s, seed); }
const tiers = {}; for (const o of out) tiers[o.tier] = (tiers[o.tier] || 0) + 1; console.log('printed', out.length, JSON.stringify(tiers));
for (const o of out) console.log(`${o.seed}\t${o.tier}\t${o.stress}\t${o.path}`);
