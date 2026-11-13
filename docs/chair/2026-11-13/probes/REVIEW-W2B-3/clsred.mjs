// REVIEW-W2B-3 item 6: class every red row at the tip against the same row at 9d5d6e091 and at 1fb15980d.
// node clsred.mjs <tip.rows> <b9d.rows> <b1f.rows>  (rows from redrows.mjs; a row absent from a tree's red list is green
// there, provided that tree ran the file — the caller runs the tip's red files at each tree)
import fs from 'node:fs';
const [tip, b9d, b1f] = process.argv.slice(2).map((f) => new Set(fs.readFileSync(f, 'utf8').split('\n').filter(Boolean)));
const cls = {}; const out = [];
for (const r of [...tip].sort()) { const k = `${b9d.has(r) ? 'red' : 'green'} at 9d5d6e091 / ${b1f.has(r) ? 'red' : 'green'} at 1fb15980d`; cls[k] = (cls[k] || 0) + 1; if (!b9d.has(r)) out.push(`${k}  ${r}`); }
console.log('tip red rows', tip.size, JSON.stringify(cls));
for (const o of out) console.log(o);
const greenAtTip = [...b1f].filter((r) => !tip.has(r)); console.log('red at 1fb15980d, green at the tip:', greenAtTip.length); for (const g of greenAtTip.slice(0, 15)) console.log('  ', g);
