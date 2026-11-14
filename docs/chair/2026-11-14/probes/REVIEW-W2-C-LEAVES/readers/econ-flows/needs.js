// Every NEED sentence: form vs the town's state; goods vs Imports / local production / exports; house on roster.
const fs = require('fs');
const { lines, ctxOf, roster, OUT } = require('./ctx.js');
const RE = /^(.+?) here (depend on|run on stored) (.+?)( brought in by magic| brought in| from outside)?(, which a siege, a closed road or a blockade would cut off|, which the siege has cut off)?(: no trade road reaches (.+))?\.$/;
const res = {}; const flags = [];
const lc = (s) => String(s).toLowerCase();
const goodsList = (g) => g.split(/, | and (?!rags)/).map((x) => x.trim()).filter(Boolean);
const stem = (g) => lc(g).split(/ or | for /)[0].split(/\s/)[0].replace(/s$/, '');
for (const r of lines) {
  if (!r.fam.startsWith('NEED')) continue;
  const c = ctxOf(r); const R = c.R, lv = c.lv, dep = c.rchain && c.rchain.dependency;
  const m = r.line.match(RE);
  const f = (res[r.fam] = res[r.fam] || { towns: new Set(), lines: 0, bad: {} });
  f.towns.add(r.seed); f.lines++;
  const bad = [];
  if (!m) bad.push('UNPARSED');
  else {
    const [, svcs, verb, goods, how, cons, , town] = m;
    const siege = lv.crisis.includes('under_siege');
    const iso = R.economicState.tradeAccess === 'isolated';
    if (cons && cons.includes('siege has cut') && !siege) bad.push('siege-form outside siege');
    if (siege && !(cons && cons.includes('siege has cut'))) bad.push('calm/isolated form under siege');
    if (how === ' brought in' && iso) bad.push('brought in (road) but isolated');
    if (town && !iso) bad.push('no trade road but route=' + R.economicState.tradeAccess);
    if (town && town !== R.name) bad.push('names ' + town + ' not ' + R.name);
    if (how === ' brought in by magic') {
      const t = lv.traditions || {};
      if (!R.config?.magicExists) bad.push('magic form, magicExists=false');
      else if (!t.hasArcane && !t.hasArcaneGuild && !t.hasDivine && !t.hasDruid && !t.hasAlchemy) bad.push('magic form, no tradition');
      else if (!t.hasArcane && !t.hasArcaneGuild) bad.push('magic form, no arcane tradition (has ' + Object.keys(t).filter((k) => t[k]).join('/') + ')');
    }
    if (lv.blockaded && how === ' brought in') bad.push('brought in but blockaded:' + JSON.stringify(lv.blockaded).slice(0, 60));
    // goods
    const arr = (lv.trade.arriving || []).map(lc), loc = (lv.trade.local || []).concat(lv.rawLocal || []).map(lc), exp = (lv.trade.exports || []).map(lc);
    for (const g of goodsList(goods)) {
      const s = stem(g);
      const inImp = arr.some((a) => a.includes(s)) || (lv.rawImports || []).map(lc).some((a) => a.includes(s));
      if (!inImp) bad.push(`good "${g}" not in Imports`);
      const made = loc.filter((a) => new RegExp('\\b' + s).test(a));
      if (made.length) bad.push(`good "${g}" made locally: ${made.slice(0, 2).join('; ')}`);
      const ex = exp.filter((a) => new RegExp('^' + s).test(a));
      if (ex.length) bad.push(`good "${g}" exported: ${ex.slice(0, 2).join('; ')}`);
    }
    // house
    if (!dep) bad.push('no dependency on chain');
    else {
      const ros = roster(R);
      if (!ros.includes(dep.institution)) bad.push('house not on roster: ' + dep.institution);
      if (/^access to/i.test(dep.institution)) bad.push('access house');
      const want = (dep.affectedServices || []).slice(0, 3).join(', ').toLowerCase();
      if (lc(svcs).replace(/ and /g, ', ') !== want.replace(/ and /g, ', ')) bad.push('services differ: ' + want);
      // service words naming things the town lacks
      if (/\bgate\b/i.test(svcs) && !ros.some((n) => /gate|wall|palisade|stockade/i.test(n))) bad.push('gate service, no gates/walls on roster');
      if (/\bharbou?r|dock|ship/i.test(svcs) && !ros.some((n) => /harbou?r|dock|port|ship|wharf|quay|pier/i.test(n))) bad.push('harbour service, no harbour on roster');
      if (/\bsiege\b/i.test(svcs) && siege && cons && !cons.includes('siege has cut')) bad.push('siege service under siege calm form');
      r._dep = dep.institution;
    }
  }
  for (const b of bad) {
    const k = b.replace(/"[^"]*"/, '"*"').replace(/: .*/, '');
    (f.bad[k] = f.bad[k] || []).push({ seed: r.seed, line: r.line, b, house: r._dep, crisis: lv.crisis.join('+'), route: R.economicState.tradeAccess });
  }
}
for (const [fam, f] of Object.entries(res)) {
  console.log('##', fam, 'towns', f.towns.size, 'lines', f.lines);
  for (const [k, v] of Object.entries(f.bad)) { console.log('   ', v.length, 'lines /', new Set(v.map((x) => x.seed)).size, 'towns:', k); v.slice(0, 2).forEach((x) => console.log('        ', x.seed, '|', x.b, '|', x.line.slice(0, 120), '|', x.house, x.crisis, x.route)); }
}
fs.writeFileSync(OUT + '/needs-bad.json', JSON.stringify(Object.fromEntries(Object.entries(res).map(([k, f]) => [k, { towns: f.towns.size, lines: f.lines, bad: f.bad }]))));
