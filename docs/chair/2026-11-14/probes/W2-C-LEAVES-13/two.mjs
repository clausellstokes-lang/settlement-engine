// two.mjs <base.jsonl>: for the two goods, cards holding it in the record, shown or not, the houses on the roster matching the chain's houses, magic
import fs from 'node:fs';
const rows = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n').map((l) => JSON.parse(l));
for (const good of ['Rare spices and exotic dyes', 'Magical entertainment', 'Caravan trade goods', 'Exotic imports', 'Divination and scrying']) {
  let cards = 0, shown = 0; const houses = {}; const nohouse = []; let nomagic = 0; const ex = { exports: 0, local: 0 };
  for (const r of rows) {
    for (const x of r.exports) if (x.startsWith(good)) ex.exports++;
    for (const x of r.local) if (x.startsWith(good)) ex.local++;
    for (const c of r.cards) { if (!(c.all || []).includes(good)) continue; cards++; if (c.outs.includes(good)) shown++;
      if (!r.magic) nomagic++;
      const heads = (c.houses || []).map((h) => String(h).toLowerCase().split(/[\s(]/)[0]);
      const m = r.roster.filter((n) => !n.toLowerCase().startsWith('access to') && heads.some((h) => n.toLowerCase().includes(h)));
      if (!m.length) nohouse.push(r.seed); for (const n of new Set(m.map((x) => x.replace(/\s*\(.*$/, '')))) houses[n] = (houses[n] || 0) + 1; } }
  console.log(`${good}: cards ${cards} shown ${shown} nomagic ${nomagic} exports ${ex.exports} local ${ex.local} no-chain-house ${nohouse.length} | ${Object.entries(houses).sort((a, b) => b[1] - a[1]).slice(0, 14).map(([h, n]) => h + ':' + n).join(', ')}`);
}
