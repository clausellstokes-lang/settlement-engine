// rows13.mjs <c2dir>: towns printing each row's fixed words in the rendered dossier (CENSUS-2 dumps), widest first
import fs from 'node:fs';
const dir = process.argv[2] + '/dumps';
const ROWS = [
  ['#62/#98 Mother on a man (PARKED: the owner\'s words)', /\bMother [A-Z][a-z]+ [A-Z]/],
  ['#26 Sells ore by the cart', /Sells ore by the cart; hires workers by the week\./],
  ['#101 Offers food, a bed and a fresh team', /Offers food, a bed and a fresh team; full of news of the road\./],
  ['#18 roughly even with the military', /They are roughly even with the military: the garrison can arrest their people/],
  ['#17 Well-funded city watch', /Well-funded city watch; it keeps order reliably and is growing more sure of its own authority\./],
  ['#291/#292 market levies (cured)', /debating market levies for three months/],
  ['census candidate: courts are all ecclesiastical', /tithes, land, and courts are all ecclesiastical/],
  ['ww#1048 trouble is inside the government', /The trouble is inside the government, not in the streets\./],
  ['ww#377 Undermanned and underfunded', /Undermanned and underfunded; unable to enforce law consistently/],
  ['pf#524 The crown rules here directly', /The crown rules here directly\./],
  ['pf#164 controls a distinct district or institution', /controls a distinct district or institution\./],
  ['pf#234 External administrative body', /External administrative body; all significant decisions require approval or reversal\./],
  ['pf#486 Hereditary or institutional claim', /Hereditary or institutional claim; has legal arguments; lacks popular support\./],
  ['ww#850 Holds the title; the decisions that matter', /Holds the title; the decisions that matter are made by/],
  ['ww#375 Free of the criminals', /Free of the criminals\. Nobody at the head of/],
  ['pf#520 a third share', /holds a third share in/],
  ['pf#481/#474/#488 Acting Fixer', /Acting Fixer/],
  ['ww#440 Merchants with local reach', /Merchants with local reach; a consistent civic presence/],
  ['raw modifier key on any tab', /\b(?:mage-advised|arcane-advised|military-dominated|theocratic-aligned|commerce-driven|corruption-riddled|church-guided|merchant-led|arms-backed)\b/i],
];
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.txt'));
const out = ROWS.map(([label, re]) => { const towns = files.filter((f) => re.test(fs.readFileSync(dir + '/' + f, 'utf8'))).map((f) => f.slice(0, -4)); return { label, n: towns.length, ex: towns.slice(0, 5) }; });
console.log('towns', files.length);
for (const r of out.sort((a, b) => b.n - a.n)) console.log(String(r.n).padStart(4), r.label, '|', r.ex.join(' '));
