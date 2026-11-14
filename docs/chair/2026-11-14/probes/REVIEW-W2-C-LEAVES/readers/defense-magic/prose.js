const fs=require("fs");const B="/tmp/claude-0/rw2c/run/";const o=require("./crime-towns.json");
const L=fs.readFileSync(B+"fam-all/defense-magic.jsonl","utf8").trim().split("\n").map(JSON.parse).filter(r=>/Criminal/.test(r.sec)&&!/^Criminal structure|^Criminal activity is coordinated/.test(r.line));
const OP=[["A",/^Rival crews at/],["B",/^Everyone at .* knows someone takes a cut/],["C",/^Criminal work at .* is coordinated enough/]];
const SS=[["bmBuy",/can buy contraband or stolen goods at the black market/],["bmToll",/Nothing sold at .*black market reaches the toll book, so the (\w+)/],["smugToll",/Goods moved by smuggling never pass .* a due the (\w+) does not collect/],["smugNet",/A smuggling network runs through .*sold in the (\w+) never paid/],["fewThefts",/Few thefts at .* written into the (\w+)'s books: a thieves' guild/],["guild",/answer to a guild, and the guild decides/],["tax",/gangs take in never appears on the tax lists, and the (\w+) is poorer/],["footing",/Criminal gangs at .* keep a footing in the (\w+),/]];
const rows=[];
for(const r of L){const t=o[r.seed];const op=OP.find(x=>x[1].test(r.line));const s2=SS.find(x=>x[1].test(r.line));const m=s2&&r.line.match(s2[1]);
 const ros=t.ros.join("|");const tierWord=m&&m[1];
 const f={seed:r.seed,fam:r.fam,line:r.line,op:op&&op[0],s2:s2&&s2[0],tier:t.tier,pop:t.pop,crisis:t.crisis,
  gov:t.crimF.some(x=>x.g),govName:t.crimF.filter(x=>x.g).map(x=>x.n).join(","),tg:t.ros.some(n=>/thie/i.test(n)),rival:t.ci.includes("Rival Gangs"),nCrimF:t.crimF.length,
  bm:/black market/i.test(ros),smug:/smuggl/i.test(ros),front:/front/i.test(ros),gang:/gang|multiple criminal/i.test(ros),tierWord,tierOK:!tierWord||tierWord===t.tier};
 rows.push(f);}
fs.writeFileSync("prose-rows.json",JSON.stringify(rows,null,1));
const c={};for(const f of rows){const k=`${f.op}/${f.s2} gov=${f.gov} tg=${f.tg} rival=${f.rival} bm=${f.bm} smug=${f.smug} gang=${f.gang} front=${f.front} tierOK=${f.tierOK}`;c[k]=(c[k]||0)+1}
Object.entries(c).sort().forEach(x=>console.log(x[1],x[0]));console.log(rows.length, new Set(rows.map(r=>r.seed)).size, rows.filter(r=>!r.op||!r.s2).length);
