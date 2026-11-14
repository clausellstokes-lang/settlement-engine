// For each family: the smallest town, the largest, and a town under a siege/famine/occupation it prints in; dump their cards.
const fs = require('fs');
const { lines, ctxOf, LV } = require('./ctx.js');
const by = {};
for (const r of lines) (by[r.fam] = by[r.fam] || []).push(r);
const pick = {}; let txt = '';
for (const [fam, rs] of Object.entries(by)) {
  const seeds = [...new Set(rs.map((r) => r.seed))];
  const pop = (s) => LV[s].pop;
  const sorted = seeds.slice().sort((a, b) => pop(a) - pop(b));
  const cr = seeds.find((s) => LV[s].crisis.some((k) => ['under_siege', 'famine', 'occupied'].includes(k)));
  const ch = [...new Set([sorted[0], sorted[sorted.length - 1], cr].filter(Boolean))];
  pick[fam] = ch;
  txt += `\n######## ${fam}\n`;
  for (const s of ch) {
    const r = rs.find((x) => x.seed === s); const c = ctxOf(r);
    txt += `-- ${s} ${LV[s].tier} ${LV[s].pop} [${LV[s].crisis.join('+')}] route=${c.R.economicState.tradeAccess}\n   LINE: ${r.line}\n`;
    if (c.card) txt += `   CARD: ${c.card.header} / ${c.card.lines.join(' / ').slice(0, 400)}\n`;
    else txt += `   SECTION: ${c.t.head.slice(0, 60)} / ${c.t.tabs}\n`;
  }
}
fs.writeFileSync(__dirname + '/handread.txt', txt); fs.writeFileSync(__dirname + '/handpick.json', JSON.stringify(pick));
console.log(txt.length);
