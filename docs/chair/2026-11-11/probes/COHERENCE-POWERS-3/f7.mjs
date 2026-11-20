// node f7.mjs <dump.jsonl> — F7: vacant seats where a place prints the office as held; the three places' agreement; doubled titles
import fs from 'node:fs';
const rows = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n').map((l) => JSON.parse(l));
let vacant = 0, held = 0, disagree = 0; const ex = []; let doubled = 0; const dex = [];
const care = /^(Acting |Regent\b)/;
for (const r of rows) {
  if (r.conn?.text && /\(([^)]+)\), \1$/.test(r.conn.text)) { doubled++; if (dex.length < 2) dex.push(`${r.key}: ${r.conn.text}`); }
  const gov = r.powers.find((p) => p.g); if (!gov || !gov.mods.includes('vacant')) continue;
  vacant++;
  const k = r.cards.find((c) => c.id === gov.first); if (!k) continue;
  const hat = k.ik === 'house' && k.r && k.r !== k.t && !String(k.r).startsWith('the ');
  const cardForm = hat ? (String(k.line).split(',')[0]) : k.h;
  const connForm = r.conn && r.conn.id === k.id ? r.conn.text : null;
  const seat = r.seat.absence || '';
  const bad = [];
  if (!care.test(cardForm || '')) bad.push(`card "${cardForm}"`);
  if (connForm && !care.test(connForm)) bad.push(`conn "${connForm}"`);
  if (!/keeps the seat meanwhile/.test(seat)) bad.push('seat row names no keeper');
  if (bad.length) { held++; if (ex.length < 4) ex.push(`${r.key} (${r.gov}): ${bad.join('; ')}`); continue; }
  const form = care.test(cardForm) ? cardForm.match(/^(Acting [^,]+?|Regent)(?=$| [A-Z])/)?.[0] || cardForm : cardForm;
  if ((connForm && !connForm.startsWith(form)) || !seat.includes(form)) { disagree++; if (ex.length < 6) ex.push(`${r.key}: disagree "${form}" | ${connForm} | ${seat}`); }
}
console.log('vacant', vacant, 'a place prints the office as held', held, 'the three disagree', disagree, 'doubled titles on a Connection row', doubled);
for (const e of [...ex, ...dex]) console.log(' ', e);
