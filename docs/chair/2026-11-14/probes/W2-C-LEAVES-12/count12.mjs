// count12.mjs <renderdir>: the step-1 rows on the rendered tab dumps (+ the records' rosters)
import fs from 'node:fs';
const D = process.argv[2]; const seeds = fs.readdirSync(D + '/dumps').filter((f) => f.endsWith('.txt')).map((f) => f.slice(0, -4));
const c = { towns: seeds.length, mcwNoSmith: 0, lumberNoSawyer: 0, shipNoYard: 0, medicalRange: 0, anyRangeDefense: 0, worked: 0, millBeer: 0, fishMarketOil: 0, famineRawExport: 0, D_ironMcw: 0, D_medicalLines: 0, D_famineLivestockExports: 0, D_fullSentences: 0 };
const ex = {};
for (const s of seeds) {
  const L = fs.readFileSync(`${D}/dumps/${s}.txt`, 'utf8').split('\n');
  let rec = null; try { rec = JSON.parse(fs.readFileSync(`${D}/records/${s}.json`, 'utf8')); } catch { /* none */ }
  const roster = (rec?.institutions || []).map((i) => String(i?.name || ''));
  const has = (re) => roster.some((n) => re.test(n) && !/^access to/i.test(n));
  let section = '';
  for (let i = 0; i < L.length; i++) {
    const l = L[i]; if (l.startsWith('== ')) section = l;
    if (l === 'Outputs') { const o = L[i + 1] || ''; let head = ''; for (let k = i - 1; k > i - 12 && k > 0; k--) if (L[k] === 'From') { head = L[k - 1]; break; }
      if (/^Iron & Metalwork/.test(head) && o.includes('Master-crafted weapons')) c.D_ironMcw++;
      if (/^Iron & Metalwork/.test(head) && o.includes('Master-crafted weapons') && !has(/smith|forge|metalwork|armou?r|weapon/i)) { c.mcwNoSmith++; (ex.mcw ||= s); }
      if (o.includes('Milled lumber') && !has(/sawmill|sawyer|lumber|carpenter/i)) { c.lumberNoSawyer++; (ex.lumber ||= s); }
      if (/Ship construction|Ocean-going vessels/.test(o) && !has(/shipyard|shipwright/i)) { c.shipNoYard++; (ex.ship ||= s); } }
    if (section.includes('Defense') && /\(\d+\s*-\s*\d+\)/.test(l)) { c.anyRangeDefense++; if (/Medical Readiness/.test(l) || /Wounds and fevers/.test(l)) c.medicalRange++; (ex.range ||= s + ': ' + l.slice(0, 80)); }
    if (/^Medical Readiness/.test(l)) c.D_medicalLines++;
    if (/ finishes it, and it leaves as /.test(l)) c.D_fullSentences++;
    if (/worked all the way through/.test(l)) c.worked++;
    if (l === 'Exports' && rec?.economicState?.foodSecurity?.foodRecord?.failedSource === 'livestock') c.D_famineLivestockExports++;
    if (/Mill finishes it, and it leaves as beer/.test(l)) c.millBeer++;
    if (/Fish market finishes it, and it leaves as fish oil/.test(l)) c.fishMarketOil++;
    if (l === 'Exports' && rec?.economicState?.foodSecurity?.foodRecord?.failedSource === 'livestock' && /Raw wool|Livestock/.test(L[i + 1] || '') && JSON.stringify(rec?.stress || rec?.config?.selectedStresses || '').includes('famine')) { c.famineRawExport++; (ex.famine ||= s); }
  }
}
console.log(JSON.stringify(c)); console.log(JSON.stringify(ex).slice(0, 400));
