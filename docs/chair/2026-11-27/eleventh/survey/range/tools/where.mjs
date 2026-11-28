// RANGE-MEASURE (E): rank keys by (prints on C+V) x (how alike their lines are) x (how few lines).
// alike: the hand class where the sample read the key, else the script's v2 class: PARAPHRASE 1, ANGLES 0.4, DISTINCT 0.1;
// few: 1 / (lines). node where.mjs <cls-C+V.json> <hand170.json> - <out.json>
import { readFileSync, writeFileSync } from 'node:fs';
const [CL, SA, HA, OUT] = process.argv.slice(2);
const hand = new Map(JSON.parse(readFileSync(SA, 'utf8')).map((x) => [x.ki, { P: 'PARAPHRASE', A: 'ANGLES', D: 'DISTINCT' }[x.hand]]));
const W = { PARAPHRASE: 1, ANGLES: 0.4, DISTINCT: 0.1 };
const rows = JSON.parse(readFileSync(CL, 'utf8')).filter((r) => !r.chrome && !r.listLike && !r.noChoice).map((r) => {
  const cls = hand.get(r.ki) || r.cls; const prints = r.printsC + r.printsV;
  return { ...r, final: cls, by: hand.has(r.ki) ? 'hand' : 'script', prints, score: prints * W[cls] / r.n };
}).sort((a, b) => b.score - a.score);
writeFileSync(OUT, JSON.stringify(rows));
rows.slice(0, 40).forEach((r, i) => console.log(`${i + 1}\t${r.ki}\t${Math.round(r.score)}\t${r.prints}\t${r.pagesC + r.pagesV}\t${r.n}\t${r.final}\t${r.by}\t${r.key.replace(/^src\//, '').slice(0, 100)}`));
