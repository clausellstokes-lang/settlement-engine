// FRAME-7 · F5R: six framed owner sheets as plain text, at the tip, against the base. Measure only.
// argv: <pool.json> <base src/> <tip src/> <out.txt> <base sha> <tip sha>
import fs from 'node:fs'; import crypto from 'node:crypto';
const [POOL, B, T, OUT, BSHA, TSHA] = process.argv.slice(2);
const base = await import(B + 'domain/summary/tonightSheet.js');
const tip = await import(T + 'domain/summary/tonightSheet.js');
const { troubleOfWeight } = await import(T + 'domain/tension/troubleCast.js');
const { generateSettlementPipeline: genB } = await import(B + 'generators/generateSettlementPipeline.js');
const { generateSettlementPipeline: genT } = await import(T + 'generators/generateSettlementPipeline.js');
const { towns } = JSON.parse(fs.readFileSync(POOL, 'utf8'));
const d = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const pick = []; const framedBySize = {};
for (const size of SIZES) {
  const framed = towns.filter((t) => t.tier === size && tip.composeTonightSheet(t.s, { audience: 'owner' }).frame);
  framedBySize[size] = framed.length;
  const withSeat = framed.find((t) => tip.composeTonightSheet(t.s, { audience: 'owner' }).seat);
  if (withSeat) pick.push({ ...withSeat, why: `the first ${size} by seed index whose framed sheet carries the seat line` });
}
const face = towns.find((t) => { const o = tip.composeTonightSheet(t.s, { audience: 'owner' }); return o.frame && !o.seat; });
pick.push({ ...face, why: 'the first framed town of the pool whose holder IS a face: no seat line (his side names him)' });
const L = [];
L.push('FRAME-7 · F5R — the seat line on six framed owner sheets, for the chair\'s eye before the merge.');
L.push(`BEFORE = the base ${BSHA} (FRAME-7's lane tip, C2b merged). AFTER = the F5R tip, ${TSHA}. Each town born fresh at each tree by that tree's own generator: generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} }).`);
L.push('OWNER = composeTonightSheet(s, { audience: \'owner\' }); STRANGER = composeTonightSheet(s). Digests: sha256 of the sheet\'s JSON, 16 hex.');
L.push(`THE ONE LINE (tonightSheet.js :: seatLineOf): "${tip.TONIGHT_COPY.seat}: {name}, {office}." — the calm sheet's own seat row's name and office (its role), printed under the three sides on the Table View, Session Mode, the PDF and the journal; never among the people to voice.`);
L.push(`Framed owner sheets in the 330-town calm pool, by size: ${SIZES.map((z) => `${z} ${framedBySize[z]}`).join(', ')}. THE THORP HAS NONE: no calm thorp of the pool holds a trouble of weight, so no thorp sheet is framed and none carries the line.`);
L.push('Five sheets below are one a size (hamlet to metropolis), each the first of its size by seed index whose holder stands on no side; the sixth is the first framed sheet whose holder IS a face, which prints no seat line.');
L.push('Format: each side is \'words: who — why. Wants…\'; the people to voice are \'name · role [why]\'; each hook ends with its source.');
for (const { seed, tier, why } of pick) {
  const sB = genB({ settType: tier }, null, { seed, customContent: {} });
  const sT = genT({ settType: tier }, null, { seed, customContent: {} });
  const before = base.composeTonightSheet(sB, { audience: 'owner' });
  const after = tip.composeTonightSheet(sT, { audience: 'owner' });
  const strB = base.composeTonightSheet(sB); const strT = tip.composeTonightSheet(sT);
  const { seat, ...rest } = after;
  const onlySeat = JSON.stringify(rest) === JSON.stringify(before);
  const top = troubleOfWeight(sT);
  L.push('');
  L.push(`=== ${seed} (${tier}) — ${top.strain.strain} ${top.strain.grade}, opening on ${after.frame.type}; ${why}`);
  L.push(`--- digests: owner before ${d(before)} · owner after ${d(after)} · stranger before ${d(strB)} · stranger after ${d(strT)} (${d(strB) === d(strT) ? 'EQUAL' : 'DIFFERS'})`);
  L.push(`--- before -> after: ${seat ? (onlySeat ? 'the sheet gains its seat line and nothing else' : 'MORE THAN THE SEAT LINE MOVED') : (d(before) === d(after) ? 'unchanged, byte for byte' : 'MOVED')}`);
  L.push(`Opening: ${after.opening}`);
  L.push(`${tip.TONIGHT_COPY.sides}:`);
  for (const side of after.frame.sides) { const r = tip.sideReadOf(side); L.push(`  - ${r.words}: ${r.who ? `${r.who} — ` : ''}${r.why}${r.wants ? ` ${r.wants}` : ''}`); }
  if (seat) L.push(`  >>> ${tip.seatLineOf(seat)}`);
  L.push(`${tip.TONIGHT_COPY.people}:`);
  for (const p of after.people) L.push(`  - ${[p.name, p.role].filter(Boolean).join(' · ')} [${p.why}]`);
  L.push('Facts:'); for (const f of after.facts) L.push(`  ${f.label}: ${f.text}`);
  L.push('Hooks:'); for (const h of after.hooks) L.push(`  * ${h.text}${h.source ? ` (${h.source})` : ''}`);
}
L.push('');
L.push('##### ALL 32 SEAT LINES OF THE POOL (every framed owner sheet whose holder stands on no side), by size and seed');
for (const t of towns) { const o = tip.composeTonightSheet(t.s, { audience: 'owner' }); if (o.seat) L.push(`  ${t.seed}: ${tip.seatLineOf(o.seat)}`); }
fs.writeFileSync(OUT, L.join('\n') + '\n');
console.log(pick.map((p) => p.seed).join(' '));
