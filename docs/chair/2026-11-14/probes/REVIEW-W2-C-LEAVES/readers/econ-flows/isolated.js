// Isolated forms: does the same page print the goods on its Imports list, or speak of a road / carts bringing goods in?
const { lines, dump, LV } = require('./ctx.js');
const res = {};
for (const r of lines) {
  if (!/run on stored|by magic/.test(r.fam)) continue;
  const d = dump(r.seed); const i = d.indexOf('Imports'); const imp = i >= 0 && d[i - 1] !== undefined ? d[i + 1] : '';
  const econ = d.slice(d.indexOf('== Systems/Economics =='), d.findIndex((x) => x.startsWith('Economic Flows (')));
  const goods = r.line.match(/(?:stored|depend on) (.+?)(?: brought in by magic)?(?::|\.$)/)[1].split(/, | and /);
  const onImp = goods.filter((g) => imp.toLowerCase().includes(g.split(/ or | for /)[0].split(' ')[0].toLowerCase()));
  const road = econ.filter((x) => /\broad\b|\bcarts?\b|caravans? (come|bring)|traders? (come|bring)/i.test(x) && !/no trade road/.test(x)).map((x) => x.slice(0, 120));
  const k = `${r.fam.slice(6, 60)} | onImports=${onImp.length === goods.length ? 'all' : onImp.length ? 'some' : 'none'} | roadText=${road.length > 0}`;
  (res[k] = res[k] || []).push({ seed: r.seed, line: r.line, imp: imp.slice(0, 120), road: road[0] });
}
for (const [k, v] of Object.entries(res)) { console.log(new Set(v.map((x) => x.seed)).size, 'towns', v.length, 'lines', k); v.slice(0, 2).forEach((x) => console.log('     ', x.seed, '|', x.line, '\n        IMP:', x.imp, '\n        ROAD:', x.road)); }
require('fs').writeFileSync(__dirname + '/isolated.json', JSON.stringify(res));
