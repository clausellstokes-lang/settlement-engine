// show.mjs <file.json> <marker-regex>   REVIEW-VEIL-8: every key or string value matching the regex, with its path.
import fs from 'node:fs';
const [file, rx] = process.argv.slice(2); const re = new RegExp(rx, 'i');
const doc = JSON.parse(fs.readFileSync(file, 'utf8')); let n = 0;
const walk = (v, p) => { if (typeof v === 'string') { if (re.test(v)) { n++; console.log(`${p} = ${v.length > 90 ? v.slice(0, 90) + '…' : v}`); } }
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { if (re.test(k)) { n++; console.log(`KEY ${p}.${k}`); } walk(x, `${p}.${k}`); } };
walk(doc, '$'); console.log(`hits: ${n}`);
