import { sample63 } from './lib.mjs';
import { generate } from './seam.mjs';
const rows = sample63();
const rec = generate(rows.find(r => r.settType === 'city'));
console.log('foodSecurity =', JSON.stringify(rec.economicState.foodSecurity));
// which boolean flags sit beside a label anywhere in the record?
const flags = new Map();
(function w(v, p) {
  if (v === null || typeof v !== 'object') return;
  if (Array.isArray(v)) { v.forEach((x, i) => w(x, `${p}[${i}]`)); return; }
  const ks = Object.keys(v);
  const bools = ks.filter(k => typeof v[k] === 'boolean' && /^is[A-Z]|^has[A-Z]/.test(k));
  const lbl = ks.find(k => /^(label|status|band|severityBand|prosperity)$/.test(k));
  if (bools.length && lbl) flags.set(p || '(root)', `${lbl}="${v[lbl]}" flags=${bools.map(b => `${b}=${v[b]}`).join(',')}`);
  for (const k of ks) w(v[k], p ? `${p}.${k}` : k);
})(rec, '');
for (const [p, s] of flags) console.log(`  ${p.padEnd(46)} ${s}`);
