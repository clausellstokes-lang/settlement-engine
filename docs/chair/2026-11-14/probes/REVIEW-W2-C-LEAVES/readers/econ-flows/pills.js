// Outputs pill rows: which chain, its houses as they stand, its ground, its chip; the pills against the record's outputs.
const { lines, ctxOf, roster } = require('./ctx.js');
const out = {};
for (const r of lines) {
  if (r.fam.startsWith('NEED') || !r.fam.startsWith('Economic Flows: ')) continue;
  const c = ctxOf(r);
  if (c.where !== 'body' || !c.chain) continue;
  if (/^(Druid|Arcane [fq]|Blessed|Sacred|Temple|Conjured|Normally yields)/.test(r.line)) continue;
  const ch = c.chain, rc = c.rchain, ros = roster(c.R).map((n) => n.toLowerCase());
  const joined = ch.outsShown.join('');
  const isPill = joined === r.line;
  const houses = (rc.processingInstitutions || []).map((h) => { const hd = h.toLowerCase().split(/[\s(]/)[0]; const m = ros.filter((n) => n.includes(hd)); return `${h}:${m.length ? (m.every((n) => n.startsWith('access to')) ? 'ACCESS' : 'own') : 'ABSENT'}`; });
  const k = `${isPill ? '' : 'NOT-PILL '}chain=${rc.chainId} chip=${c.card.chip} in=${rc.resourceInputKey}/${rc.resourceCondition} houses=[${houses.join(', ')}] dropped=[${ch.outputs.filter((o) => !ch.outsShown.includes(o)).join(', ')}]`;
  const f = (out[r.fam] = out[r.fam] || {}); (f[k] = f[k] || []).push(`${r.seed}${c.lv.crisis.length ? '(' + c.lv.crisis.join('+') + ')' : ''}`);
}
for (const [fam, f] of Object.entries(out)) { console.log('##', fam, Object.values(f).reduce((a, v) => a + v.length, 0)); for (const [k, v] of Object.entries(f).sort((a, b) => b[1].length - a[1].length)) console.log('   ', v.length, k, v.slice(0, 2).join(' ')); }
