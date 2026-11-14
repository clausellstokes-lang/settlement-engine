// hallv.mjs <tree> <birthsdir>...: the hall's line by rung/variant start, with the town's occupation / outside-shaping state
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const [tree, ...dirs] = process.argv.slice(2);
const { dmPowerViewOf } = await import(path.join(tree, 'src/domain/people/patronage.js'));
const t = {}; const ex = {};
for (const dir of dirs) for (const file of fs.readdirSync(dir).filter((x) => x.endsWith('.ndjson.gz')).sort())
  for (const line of zlib.gunzipSync(fs.readFileSync(dir + '/' + file)).toString().split('\n')) {
    if (!line) continue; const { key, s } = JSON.parse(line);
    const h = dmPowerViewOf(s)?.hall; if (!h || h.rung !== 'none') continue;
    const v = /make their own decisions/.test(h.line) ? 'v1' : /rules in its own name/.test(h.line) ? 'v2' : /^None of the head/.test(h.line) ? 'v1new' : /No criminal house gives/.test(h.line) ? 'v2new' : 'v0';
    const st = String(s.powerStructure?.stability || '');
    const occ = (s.config?.stressTypes || [s.config?.stressType]).includes('occupied') ? 'OCCUPIED' : /shaped from outside/.test(st) ? 'OUTSIDE' : 'other';
    const k = `${v} ${occ}`; t[k] = (t[k] || 0) + 1; (ex[k] ||= []).length < 5 && ex[k].push(`${key}[${s.tier}]`);
  }
for (const k of Object.keys(t).sort()) console.log(t[k], k, ex[k].join(' '));
