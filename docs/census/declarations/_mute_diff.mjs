import fs from 'node:fs';
const [a, b] = process.argv.slice(2).map((p) => JSON.parse(fs.readFileSync(p, 'utf8')));
const muted = {}, moved = {}, spoke = {};
for (const i of Object.keys(a)) for (const k of new Set([...Object.keys(a[i]), ...Object.keys(b[i] || {})])) {
  const x = a[i][k], y = b[i]?.[k];
  if (typeof x === 'string' && (y == null)) (muted[k] ||= []).push(i);
  else if (x == null && typeof y === 'string') (spoke[k] ||= []).push(i);
  else if (x !== y) (moved[k] ||= []).push(i);
}
const c = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v.length]));
console.log('MUTED', JSON.stringify(muted)); console.log('MOVED', JSON.stringify(c(moved))); console.log('SPOKE', JSON.stringify(c(spoke)));
