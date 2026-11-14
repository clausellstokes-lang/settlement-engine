// Targeted pill checks: a house that makes the good, by the roster; the route and exports where the pill is a trade.
const { lines, ctxOf, roster } = require('./ctx.js');
const tests = {
  'Milled lumber': [/sawmill|carpent|lumber|timber|woodcut|joiner|wright/i, 'sawmill/woodworker'],
  'Master-crafted weapons': [/smith|forge|weapon|armou?r|metalwork/i, 'smith/weaponmaker'],
  'Ship construction': [/shipyard|shipwright|boat|dock|wharf/i, 'shipyard/boatwright/docks'],
  'Vessel maintenance': [/shipyard|shipwright|boat|dock|wharf|harbou?r/i, 'yard/docks/harbour'],
  'Dyed cloth': [/dyer/i, 'dyer'],
  'Fine textiles': [/weav|silk|textile|tailor|draper|cloth|merchant/i, 'weaver/silk/merchant'],
  'Books and manuscripts': [/print|scriptor|bookbind|librar|universit|scribe|sage|academ/i, 'print/scribe/library/sage/academy'],
  'Legal services': [/court|magistrat|lawyer|notar|judge|town hall|city hall/i, 'court/hall'],
};
const res = {};
for (const r of lines) {
  if (r.fam.startsWith('NEED')) continue;
  const c = ctxOf(r); if (c.where !== 'body' || !c.chain || c.chain.outsShown.join('') !== r.line) continue;
  const ros = roster(c.R).filter((n) => !/^access to/i.test(n));
  for (const p of c.chain.outsShown) {
    const t = tests[p]; if (!t) continue;
    const hit = ros.filter((n) => t[0].test(n));
    const k = `${p} | ${r.fam.slice(16)}`;
    const f = (res[k] = res[k] || { n: 0, miss: [] }); f.n++;
    if (!hit.length) f.miss.push(`${r.seed}(${c.R.tier} ${c.R.population}) houses=${c.rchain.processingInstitutions.join('/')} roster~${ros.filter((n) => /mill|thatch|mine|fuller|glass|hall|harbou?r|dock|wizard|college/i.test(n)).join('/')}`);
  }
}
for (const [k, f] of Object.entries(res)) { console.log(f.miss.length, '/', f.n, k); f.miss.slice(0, 6).forEach((m) => console.log('     ', m)); }
