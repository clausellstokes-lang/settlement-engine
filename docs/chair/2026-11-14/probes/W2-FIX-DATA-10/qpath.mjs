import fs from 'node:fs'; import zlib from 'node:zlib';
const [F, seeds, needle] = process.argv.slice(2); const want = new Set(seeds.split(','));
const walk = (v, p, out) => { if (typeof v === 'string') { if (v.includes(needle)) out.push(p); } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`, out)); else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, `${p}.${k}`, out); return out; };
for (const l of zlib.gunzipSync(fs.readFileSync(F)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l); if (want.has(seed)) console.log(seed, walk(s, '', []).join(' ')); }
