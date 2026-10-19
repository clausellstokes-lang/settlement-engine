// PR-r2-verify probe: the volume's own §3.2 arithmetic (DRAFT constants as written).
// peaceShare = clamp(0.6 + 0.4*(0.5 - appetite01) + 0.2*harsh01, 0.4, 1.0); peace fielded = ceil(max*peaceShare);
// campaign kept (default) = ceil(max*0.75). Flags: (a) peace fielded == max (§7.5's harassment trigger);
// (b) campaign kept < peace fielded (the owner's "more during wartime" inverted).
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const courts = [
  { name: 'bold (a=1,h=0)', a: 1, h: 0 }, { name: 'median (a=.5,h=0)', a: 0.5, h: 0 },
  { name: 'wary (a=0,h=0)', a: 0, h: 0 }, { name: 'lawful-cruel (a=.5,h=1)', a: 0.5, h: 1 },
  { name: 'wary+harsh (a=.25,h=.5)', a: 0.25, h: 0.5 },
];
let atMax = 0, inverted = 0, rows = 0;
for (const c of courts) {
  const ps = clamp(0.6 + 0.4 * (0.5 - c.a) + 0.2 * c.h, 0.4, 1.0);
  for (let max = 1; max <= 12; max++) {
    const peace = Math.ceil(max * ps), camp = Math.ceil(max * 0.75);
    const fa = peace === max, fb = camp < peace;
    rows++; if (fa) atMax++; if (fb) inverted++;
    if (fa || fb) console.log(`${c.name.padEnd(26)} peaceShare=${ps.toFixed(2)} max=${String(max).padStart(2)} peace=${peace} campaign=${camp}${fa ? '  (a) peace at max' : ''}${fb ? '  (b) campaign < peace' : ''}`);
  }
}
console.log(`rows=${rows} peaceAtMax=${atMax} campaignBelowPeace=${inverted}`);
