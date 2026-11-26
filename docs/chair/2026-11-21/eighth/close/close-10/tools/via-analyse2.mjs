import { readFileSync } from 'node:fs';
const strip = (s) => String(s).replace(/^[^:]*: /, '');
const food = (r) => r.foodLb > 0 || (r[process.env.FOODKEY || 'arrivingFoodSrc'] || []).length > 0, any = (r) => r.foodLb > 0 || r.arriving.length > 0;
const LINES = [
  ['L1', /feeds itself and pays its own way\./, (r) => [food(r) && 'food', r.debt && 'debt']],
  ['L2', /grows what it eats and makes what it needs/, (r) => [food(r) && 'food', r.needed.length && 'needed', r.debt && 'debt']],
  ['L3', /^Nothing .* needs to get through the year has to come from outside\./, (r) => [food(r) && 'food', r.needed.length && 'needed']],
  ['L4', /feeds itself and pays its way, and buys in some of what it cannot make/, (r) => [food(r) && 'food', r.debt && 'debt', !any(r) && 'nothing arrives']],
  ['L5', /it grows, and what it spends it earns/, (r) => [food(r) && 'food', r.debt && 'debt', !any(r) && 'nothing arrives']],
  ['twinA', /gets through the year, buying in (some of )?what its own land and trades do not provide/, (r) => [!/some of/.test(r.summary) && r.needed.length && 'needed', !any(r) && 'nothing arrives']],
  ['twinB', /on its own land and trades, and goes without/, (r) => [any(r) && 'something arrives']],
  ['strained', /keeps order and pays its way, but it has to buy food/, (r) => [r.debt && 'debt']],
];
const falseOf = (r) => { const t = strip(r.summary); for (const [n, rx, why] of LINES) if (rx.test(t)) return [n, why(r).filter(Boolean)]; return [null, []]; };
for (const P of process.argv.slice(3)) {
  const rd = (n) => new Map(readFileSync(`${process.argv[2]}/via2-${P}-${n}.jsonl`, 'utf8').trim().split('\n').map(JSON.parse).map((o) => [o.seed, o]));
  const B = rd('base'), T = rd('tree'); const res = {}; let gen = [0, 0, 0, 0]; let movedTrueShrunk = 0; let movedTrue = 0, moved = 0, recs = 0; const mtEx = [];
  for (const [seed, t] of T) { const b = B.get(seed); if (b.recordHash !== t.recordHash) recs++;
    for (const [tag, r] of [['before', b], ['after', t]]) { const [n, w] = falseOf(r); if (!n) continue; const k = `${n}`; res[k] ||= { before: [0, 0], after: [0, 0] }; res[k][tag][0]++; if (w.length) res[k][tag][1]++; }
    for (const r of [b, t]) if (r.genBuysIn) { const k = r === b ? 0 : 2; gen[k]++; if ((!r.genSome && r.needed.length) || !any(r)) gen[k + 1]++; }
    if (b.summary !== t.summary) { moved++; const [n, w] = falseOf(b); if (n && !w.length) { movedTrue++; const [n2] = falseOf(t); if (!(n === 'twinA' && n2 === 'twinA')) movedTrueShrunk++; if (mtEx.length < 3) mtEx.push(`${seed}: "${strip(b.summary)}" -> "${strip(t.summary)}"`); } } }
  console.log(`== ${P}: records moved ${recs}; summaries moved ${moved}, of them TRUE before ${movedTrue} (admitted set shrank: ${movedTrueShrunk}); general line before prints ${gen[0]} false ${gen[1]}, after prints ${gen[2]} false ${gen[3]}`);
  for (const [k, v] of Object.entries(res)) console.log(`  ${k}: before prints ${v.before[0]} false ${v.before[1]} | after prints ${v.after[0]} false ${v.after[1]}`);
  mtEx.forEach((e) => console.log('   ' + e));
}
