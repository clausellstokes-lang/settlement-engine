// REVIEW-W2-C-LEAVES cures.mjs <leaves.jsonl> : the last read's findings 1 and 2, checked by a matcher of my own (not the stage's).
// F1: every "stops half-way: no {house} finishes it" line beside a house of the roster whose trade finishes that work.
// F2: every "Needed, and not brought in" good the town makes: an export, a raw local-production item, a working chain's
//     resource/output, or a maker house on the live roster (my own word list), or a nearby ground that yields it.
import fs from 'node:fs';
const rows = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n').map(JSON.parse);
const FIN = { // my own list of who finishes each missing house's work (broad on purpose: a reader's sense of the trade)
  leatherworkers: /leather|cobbler|furrier|saddler|cordwain|shoemak|glover/i, carpenters: /carpent|joiner|cooper|wheelwright|furniture|cabinet/i,
  sawmill: /sawmill|sawyer|lumber/i, apothecary: /apothecar|herbalist|alchemist|physician|hospital/i, alchemist: /alchemist|apothecar/i,
  blacksmiths: /smith|forge|armou?rer|metalwork/i, smelter: /smelter|foundry|ironworks|bloomery/i, goldsmiths: /goldsmith|silversmith|jewel/i,
  jewelers: /jewel|gem|lapidar|goldsmith/i, stonemasons: /mason|stonecut/i, weavers: /weav|textile|cloth|draper|tailor/i, dyers: /dyer/i,
  fulling: /fuller|fulling/i, glassblower: /glass/i, potter: /potter|pottery|kiln/i, brickmaker: /brick|potter/i, tannery: /tann/i,
  butcher: /butcher|slaughter/i, miller: /\bmill\b|miller/i, brewer: /brew|tavern|inn/i, vintner: /vint|winer/i, baker: /baker|bakery/i,
};
const finOf = (house) => { const h = house.toLowerCase(); for (const [k, re] of Object.entries(FIN)) if (h.includes(k.replace(/s$/, ''))) return re; return null; };
let f1 = 0, f1false = 0; const f1ex = [];
for (const r of rows) for (const g of r.gaps || []) {
  const t = String(g.impact || g.text || g); const m = t.match(/stops half-way: no (.+?) finishes it/); if (!m) continue; f1++;
  const re = finOf(m[1]); const own = r.roster.filter((n) => !/^access to/i.test(n));
  const hit = re && own.find((n) => re.test(n));
  if (hit) { f1false++; if (f1ex.length < 40) f1ex.push(`${r.seed} | ${t} | beside: ${hit}`); }
}
console.log(`F1 half-way lines ${f1}; beside a house of the finishing trade (my list) ${f1false}`); console.log(f1ex.join('\n'));
const words = (x) => String(x).toLowerCase().replace(/\(.*?\)/g, ' ').split(/[^a-z]+/).filter((w) => w.length > 3 && !/^(and|with|from|goods|local|trade|basic|fine|quality)$/.test(w));
let f2 = 0, f2made = 0, towns = new Set(); const f2ex = [];
for (const r of rows) {
  const needed = r.trade?.needed || []; if (!needed.length) continue;
  const working = (r.chains || []).filter((c) => /running|operational|entrepot|productive/.test(String(c.shown)));
  const made = [...r.rawExports.map((x) => ['export', x]), ...r.rawLocal.map((x) => ['raw local', x]),
    ...working.flatMap((c) => [c.resource, ...(c.outputs || [])].filter(Boolean).map((x) => [`chain ${c.id}`, x])),
    ...r.nearby.map((x) => ['ground', String(x).replace(/_/g, ' ')])];
  for (const n of needed) {
    f2++; const nw = words(n); const hit = made.find(([, x]) => { const xw = words(x); return nw.some((w) => xw.some((v) => v === w || (w.length > 4 && v.startsWith(w.slice(0, 5))))); });
    if (hit) { f2made++; towns.add(r.seed); if (f2ex.length < 60) f2ex.push(`${r.seed} (${r.tier}${r.crisis.length ? ' ' + r.crisis.join('+') : ''}) | need "${n}" | ${hit[0]}: ${hit[1]}`); }
  }
}
console.log(`F2 needs printed ${f2}; a word of the need in something the town makes or stands on (candidates, to read) ${f2made} in ${towns.size} towns`); console.log(f2ex.join('\n'));
