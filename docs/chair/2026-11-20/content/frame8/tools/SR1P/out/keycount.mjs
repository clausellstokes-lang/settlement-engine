import fs from 'node:fs';
const { stakeReasonKey } = await import(process.argv[2] + 'src/data/crisis/stakeReasonLines.js');
const c = {};
for (const l of fs.readFileSync(process.argv[3], 'utf8').split('\n').filter(Boolean)) { const d = JSON.parse(l); if (d.pool !== 'crisis') continue; for (const e of d.rows) for (const k of e.stakes) { const key = stakeReasonKey(k[2]); c[key] = (c[key] || 0) + 1; } }
console.log(JSON.stringify(c));
