// counts.mjs <stored.json> <served.json>: every place in the SERVED payload a number equals a STORED list length the veil shrank
import { readFileSync } from 'node:fs';
const A = JSON.parse(readFileSync(process.argv[2])); const S = JSON.parse(readFileSync(process.argv[3]));
const lens = {}; const walk = (v, p, f) => { if (Array.isArray(v)) { f(p, v); v.forEach((x) => walk(x, `${p}[]`, f)); } else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, p ? `${p}.${k}` : k, f); };
walk(A, '', (p, v) => { (lens[p] = lens[p] || []).push(v.length); });
const slens = {}; walk(S, '', (p, v) => { (slens[p] = slens[p] || []).push(v.length); });
const shrunk = Object.entries(lens).filter(([p, a]) => slens[p] && a.reduce((x, y) => x + y, 0) > slens[p].reduce((x, y) => x + y, 0)).map(([p, a]) => [p, a.reduce((x, y) => x + y, 0), slens[p].reduce((x, y) => x + y, 0)]);
console.log('shrunk lists (stored total -> served total):'); for (const s of shrunk) console.log(' ', s.join(' '));
const targets = new Map(); for (const [p, a, b] of shrunk) if (a > 2) targets.set(a, `${p} stored=${a} served=${b}`);
const hits = []; const scan = (v, p) => { if (typeof v === 'number' && targets.has(v)) hits.push(`${p} = ${v}   <- ${targets.get(v)}`); else if (typeof v === 'string') { for (const m of v.matchAll(/\b(\d{1,4})\b/g)) if (targets.has(Number(m[1]))) hits.push(`${p} ~ "${v.slice(Math.max(0, m.index - 60), m.index + 40)}"   <- ${targets.get(Number(m[1]))}`); } else if (Array.isArray(v)) v.forEach((x) => scan(x, `${p}[]`)); else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) scan(x, p ? `${p}.${k}` : k); };
scan(S, ''); console.log(`hits ${hits.length}`); for (const h of [...new Set(hits)].slice(0, 60)) console.log(' ', h);
