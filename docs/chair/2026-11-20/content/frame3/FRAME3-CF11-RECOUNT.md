# FRAME-3 — CF11 re-counted from the ruling's words (not from the lane's code)

Written 2026-11-20T08:24:07Z (`date -u`) by FRAME-3. Pool: the FRAME-1 pool script (`FRAME-1-HANDBACK.md`), 484 births tried, 330 calm (55 a tier), born at the lane's tree 79db75eb2 (the calm pool is generation only; the frame lane changes no generation). Script: `cf11final.mjs` below, run as `node cf11final.mjs pool.json <src/> framed.txt`.

## The count

| measure | thorp | hamlet | village | town | city | metropolis | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| calm towns | 55 | 55 | 55 | 55 | 55 | 55 | 330 |
| a trouble of weight | 0 | 7 | 14 | 5 | 12 | 18 | 56 |
| …of it W1+seat tension | 0 | 4 | 13 | 0 | 0 | 0 | 17 |
| …of it W2 high, both sides | 0 | 0 | 0 | 0 | 7 | 6 | 13 |
| …of it W3+matter | 0 | 3 | 2 | 5 | 5 | 13 | 28 |
| (with corruption_scandal as a seat type) | 0 | 8 | 15 | 5 | 12 | 18 | 58 |
opening by type [["crime_wave",12],["succession_crisis",10],["trade_dispute",10],["outside_debt",6],["trade_collapse",5],["resource_scarcity",5],["tyranny",3],["legitimacy_crisis",3],["popular_uprising",2]]
opening by grade (0 leg<30, 1 W1, 2 high conflict, 3 W3) {"1":17,"2":13,"3":26}
opening by type (corruption read as seat) [["crime_wave",12],["succession_crisis",10],["trade_dispute",10],["outside_debt",6],["trade_collapse",5],["resource_scarcity",5],["tyranny",3],["legitimacy_crisis",3],["corruption_scandal",2],["popular_uprising",2]]

"Strict" reads no corruption_scandal as a seat type; the lane's rule (`troubleCast.js :: WEIGHT_MATTER.seatWhereItNamesTheRuler`) admits one whose sides name the ruler, which adds exactly frame-calm-hamlet-19 and frame-calm-village-10 (both #0 corruption_scandal, legitimacy below 45): 58.

## The framed towns (strict reading: seed, the opening tension's place, type, the strain's grade: 1 seat, 2 high conflict with both powers as sides, 3 a material strain)

```
frame-calm-hamlet-7 #0 trade_collapse g3
frame-calm-hamlet-17 #0 succession_crisis g1
frame-calm-hamlet-35 #0 trade_collapse g3
frame-calm-hamlet-49 #0 resource_scarcity g3
frame-calm-hamlet-62 #0 popular_uprising g1
frame-calm-hamlet-73 #0 tyranny g1
frame-calm-hamlet-74 #0 succession_crisis g1
frame-calm-village-0 #0 tyranny g1
frame-calm-village-5 #1 tyranny g1
frame-calm-village-20 #1 resource_scarcity g3
frame-calm-village-35 #0 popular_uprising g1
frame-calm-village-38 #1 legitimacy_crisis g1
frame-calm-village-40 #1 succession_crisis g1
frame-calm-village-45 #0 succession_crisis g1
frame-calm-village-48 #0 succession_crisis g1
frame-calm-village-49 #1 succession_crisis g1
frame-calm-village-53 #1 succession_crisis g1
frame-calm-village-58 #0 legitimacy_crisis g1
frame-calm-village-75 #0 succession_crisis g1
frame-calm-village-76 #0 legitimacy_crisis g1
frame-calm-village-81 #0 succession_crisis g1
frame-calm-town-1 #1 outside_debt g3
frame-calm-town-33 #0 trade_dispute g3
frame-calm-town-56 #1 trade_collapse g3
frame-calm-town-68 #0 trade_collapse g3
frame-calm-town-74 #0 trade_collapse g3
frame-calm-city-8 #0 crime_wave g2
frame-calm-city-14 #0 crime_wave g2
frame-calm-city-22 #1 outside_debt g3
frame-calm-city-23 #1 trade_dispute g3
frame-calm-city-25 #0 crime_wave g2
frame-calm-city-27 #1 outside_debt g3
frame-calm-city-30 #0 outside_debt g3
frame-calm-city-33 #0 crime_wave g2
frame-calm-city-35 #0 crime_wave g2
frame-calm-city-45 #1 crime_wave g2
frame-calm-city-52 #0 trade_dispute g3
frame-calm-city-57 #0 crime_wave g2
frame-calm-metropolis-1 #2 trade_dispute g3
frame-calm-metropolis-5 #1 trade_dispute g3
frame-calm-metropolis-8 #0 crime_wave g2
frame-calm-metropolis-12 #0 trade_dispute g3
frame-calm-metropolis-14 #1 trade_dispute g3
frame-calm-metropolis-19 #0 crime_wave g2
frame-calm-metropolis-21 #2 outside_debt g3
frame-calm-metropolis-22 #1 trade_dispute g3
frame-calm-metropolis-39 #1 trade_dispute g3
frame-calm-metropolis-44 #0 outside_debt g3
frame-calm-metropolis-48 #1 resource_scarcity g3
frame-calm-metropolis-53 #0 trade_dispute g3
frame-calm-metropolis-56 #0 crime_wave g2
frame-calm-metropolis-57 #1 resource_scarcity g3
frame-calm-metropolis-59 #1 resource_scarcity g3
frame-calm-metropolis-64 #0 crime_wave g2
frame-calm-metropolis-66 #0 succession_crisis g2
frame-calm-metropolis-68 #0 crime_wave g2
```

## The script

```js
// FRAME-3, an independent re-count of CF11 FINAL (the chair's ruling of 2026-11-20), written from the ruling's words,
// not from FRAME-2's code: W1 (incumbent not gated, or legitimacy < 45 by the gates' read) WITH a seat-type tension;
// W2 a conflicts row of intensity HIGH whose TWO powers are BOTH sides of the tension; W3 an impaired chain (or food
// below secure, or a creditor power) WITH a supply/debt/food tension. argv: pool.json [src/]
import fs from 'node:fs';
const R = process.argv[3] || '/home/user/settlement-engine/src/';
const { coupContenders } = await import(R + 'domain/rulingPowerCoup.js');
const { governanceLedger } = await import(R + 'domain/governanceLedger.js');
const { towns } = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const norm = (x) => String(x || '').toLowerCase().replace(/^the\s+/, '').trim();
const SEAT = new Set(['legitimacy_crisis', 'succession_crisis', 'leadership_vacuum', 'tyranny', 'popular_uprising']);
const MATTER = new Set(['trade_collapse', 'trade_dispute', 'resource_scarcity', 'outside_debt', 'market_crash']);
const FOOD_OK = new Set(['Surplus', 'Secure']);
const T = Object.fromEntries(TIERS.map((t) => [t, { n: 0, w1: 0, w2: 0, w3: 0, any: 0, anyCorr: 0 }]));
const open = {}, openCorr = {}, strainOpen = {};
const framed = [];
for (const { seed, tier, s } of towns) {
  const ps = s.powerStructure || {}, X = T[tier]; X.n++;
  const cc = coupContenders(s), leg = governanceLedger(s).legitimacyScore;
  const W1 = cc.incumbent.gated === false || leg < 45;
  const high = (ps.conflicts || []).filter((r) => r.intensity === 'high');
  const food = s.economicState?.foodSecurity?.label;
  const W3 = (!!food && !FOOD_OK.has(food)) || (ps.factions || []).some((f) => /creditor/i.test(f.faction || ''))
    || (s.economicState?.activeChains || []).some((ch) => ch.status === 'impaired');
  const tensions = s.history?.currentTensions || [];
  const hits = [], hitsCorr = [];
  tensions.forEach((t, i) => {
    const sides = (t.factions || []).map(norm);
    const g = [];
    if (W1 && leg < 30 && SEAT.has(t.type)) g.push(0);
    if (W1 && SEAT.has(t.type)) g.push(1);
    if (high.some((r) => (r.parties || []).length === 2 && r.parties.every((p) => sides.includes(norm(p))))) g.push(2);
    if (W3 && MATTER.has(t.type)) g.push(3);
    if (g.length) hits.push({ i, type: t.type, grade: Math.min(...g), strains: g });
    const gc = [...g]; if (W1 && t.type === 'corruption_scandal') gc.push(leg < 30 ? 0 : 1);
    if (gc.length) hitsCorr.push({ i, type: t.type, grade: Math.min(...gc) });
  });
  const pick = (h) => h.slice().sort((a, b) => a.grade - b.grade || a.i - b.i)[0];
  if (hits.length) { X.any++; const p = pick(hits); open[p.type] = (open[p.type] || 0) + 1; strainOpen[p.grade] = (strainOpen[p.grade] || 0) + 1;
    if (hits.some((h) => h.strains.includes(1))) X.w1++; if (hits.some((h) => h.strains.includes(2))) X.w2++; if (hits.some((h) => h.strains.includes(3))) X.w3++;
    framed.push(`${seed} #${p.i} ${p.type} g${p.grade}`); }
  if (hitsCorr.length) { X.anyCorr++; const p = pick(hitsCorr); openCorr[p.type] = (openCorr[p.type] || 0) + 1; }
}
const tot = (k) => TIERS.reduce((a, t) => a + T[t][k], 0);
console.log(`| measure | ${TIERS.join(' | ')} | total |\n|---|${TIERS.map(() => '---:').join('|')}|---:|`);
for (const [k, l] of [['n', 'calm towns'], ['any', 'a trouble of weight'], ['w1', '…of it W1+seat tension'], ['w2', '…of it W2 high, both sides'], ['w3', '…of it W3+matter'], ['anyCorr', '(with corruption_scandal as a seat type)']])
  console.log(`| ${l} | ${TIERS.map((t) => T[t][k]).join(' | ')} | ${tot(k)} |`);
console.log('opening by type', JSON.stringify(Object.entries(open).sort((a, b) => b[1] - a[1])));
console.log('opening by grade (0 leg<30, 1 W1, 2 high conflict, 3 W3)', JSON.stringify(strainOpen));
console.log('opening by type (corruption read as seat)', JSON.stringify(Object.entries(openCorr).sort((a, b) => b[1] - a[1])));
fs.writeFileSync(process.argv[4] || '/dev/null', framed.join('\n') + '\n');
```
