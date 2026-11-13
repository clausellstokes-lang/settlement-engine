// the lords' plot hooks and secrets that presume a trade (a customer, takings, a landlord, an apprentice, a tool lent,
// a batch sold, a small venture, a shop), counted on one tree, with whether the line prints in the town's dump
import fs from 'node:fs'; import zlib from 'node:zlib';
const rows = zlib.gunzipSync(fs.readFileSync(process.env.CORPUS)).toString().trim().split('\n').map((l) => JSON.parse(l));
const TRADE = /\bcustomer|takings|landlord|apprentice|tool they lent|sold a batch|small venture|their shop|their stall|the rent\b|their supplier|suppliers/i;
const OFFICE = /\b(signed an order|their seal|their office|their deputy|their staff|records from|reassigned|a clerk in their)\b/i;
let lords = 0, trade = 0, office = 0, printed = 0; const ex = [];
for (const { seed, s } of rows) { let d = ''; try { d = fs.readFileSync(`${process.env.DUMPS}/${seed}.txt`, 'utf8'); } catch {}
  for (const c of s.npcs || []) if (c.title === 'the lord') { lords++;
    for (const h of [...(c.plotHooks || []).map((x) => typeof x === 'string' ? x : x?.text || ''), c.secret?.what || '']) {
      const p = d.includes(String(h).slice(0, 50));
      if (TRADE.test(h)) { trade++; if (p) printed++; if (ex.length < Number(process.env.NEX || 12)) ex.push(`${seed} ${c.name} (${c.gender}) prints=${p}: ${h}`); }
      if (OFFICE.test(h)) office++; } } }
console.log(JSON.stringify({ lords, tradeHooks: trade, tradePrinted: printed, officeHooks: office }), '\n' + ex.join('\n'));
