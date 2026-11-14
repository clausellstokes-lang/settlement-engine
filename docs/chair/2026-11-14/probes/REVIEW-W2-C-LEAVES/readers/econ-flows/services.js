// Service cards printed Impaired: is each house they run through marked Impaired on the Institutions tab, and is it
// on the roster at all? And does the service's own trade stop under the crisis in force?
const { lines, ctxOf, dump, roster } = require('./ctx.js');
const instStatus = (seed) => {
  const d = dump(seed); const a = d.indexOf('== Systems/Institutions =='), b = d.findIndex((x, i) => i > a && x.startsWith('== '));
  const m = {};
  for (let i = a + 1; i < b; i++) {
    const mm = d[i].match(/^(.+?)(REQ)?(Adventuring|Crafts|Criminal|Defense|Economy|Religious|Religion|Government|Infrastructure|Magic|Arcane|Healing|Education|Entertainment|Food|Agriculture|Trade|Social|Civic|Knowledge|Military|Maritime|Transport|Industry|Residential|Services)(Impaired)?$/);
    if (mm) m[mm[1].toLowerCase()] = mm[4] ? 'impaired' : 'ok';
  }
  return m;
};
const out = {};
for (const r of lines) {
  if (!/Service(Export)?Impaired$/.test(r.fam)) continue;
  const c = ctxOf(r);
  const via = (c.card.lines.find((l) => l.startsWith('Via:')) || '').slice(4).split(' · ').map((s) => s.trim().toLowerCase()).filter(Boolean);
  const st = instStatus(r.seed);
  const svc = (c.R.economicState.institutionalServices || []).find((s) => r.line.startsWith(s.label));
  const houses = svc ? svc.institutions.map((h) => h.toLowerCase()) : via;
  const rs = houses.map((h) => st[h] || 'NOTFOUND');
  const k = `${rs.every((x) => x === 'impaired') ? 'allImpaired' : rs.join(',')} rec=${svc && svc.status}`;
  const f = (out[r.fam] = out[r.fam] || {});
  (f[k] = f[k] || []).push(`${r.seed}[${houses.join('/')}|${c.lv.crisis.join('+')}]`);
}
for (const [fam, f] of Object.entries(out)) { console.log('##', fam); for (const [k, v] of Object.entries(f)) console.log('  ', v.length, k, v.slice(0, 3).join(' ')); }
