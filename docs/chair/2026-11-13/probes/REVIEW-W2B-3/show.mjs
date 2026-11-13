// REVIEW-W2B-3: print drawn lines with the facts their words read. node show.mjs <draw.json> <from> <to>
import fs from 'node:fs';
const d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).drawn;
for (const e of d.slice(Number(process.argv[3]) - 1, Number(process.argv[4]))) {
  const t = e.town; const w = e.words.join(',');
  let f = `${t.tier} ${t.population} crisis=${t.crisis.join('+') || '-'}`;
  if (/clergy|religious/.test(w)) f += ` faith=${JSON.stringify(t.faith)} sacred=${t.sacredHouse}`;
  if (/armedForce|guard|armoury|prisoner|physician/.test(w)) f += ` guard=${t.guard} def=${Object.keys(t.defence).join('+')}`;
  if (/market/.test(w)) f += ` market=${t.market}`;
  if (/practitioner/.test(w)) f += ` practitioners=${t.practitioners}`;
  if (/powers|ruling|almost/.test(w)) f += ` powers=[${t.powers.join('; ')}] rulingThree=${JSON.stringify(t.rulingThree)}`;
  if (/onlyJust|smallMargin/.test(w)) f += ` food=${JSON.stringify(t.food)}`;
  if (/smith|mason|notary|alchemist|physician|prisoner|religious|clergy|market/.test(w)) f += ` roster=[${t.roster.join('; ')}]`.slice(0, 700);
  console.log(`#${e.n} [${w}] ${e.views[0]} ${e.seed} (${e.source} ${e.file})\n   Q: ${e.quote}\n   F: ${f}\n   C: ${e.context.join(' || ').slice(0, 300)}`);
}
