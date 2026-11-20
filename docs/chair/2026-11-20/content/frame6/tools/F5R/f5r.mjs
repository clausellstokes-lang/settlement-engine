// FRAME-7 · F5R: digests (owner, stranger) over the 330-town calm pool at one tree, and the seat count. Read-only.
// argv: <pool.json> <tree src/ (trailing slash)> <out.json>
import fs from 'node:fs';
import crypto from 'node:crypto';
const [POOL, R, OUT] = process.argv.slice(2);
const T = await import(R + 'domain/summary/tonightSheet.js');
const { troubleOfWeight } = await import(R + 'domain/tension/troubleCast.js');
const { towns } = JSON.parse(fs.readFileSync(POOL, 'utf8'));
const d = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);
const digests = {}; const C = { towns: 0, calm: 0, framed: 0, dropped: 0, byStrain: {}, seatField: 0, seatEqStrangerRow: 0, faceAndField: 0, lines: [] , droppedList: [] };
for (const { seed, tier, s } of towns) {
  C.towns++;
  const owner = T.composeTonightSheet(s, { audience: 'owner' });
  const stranger = T.composeTonightSheet(s);
  digests[seed] = { owner: d(owner), stranger: d(stranger), framed: !!owner.frame };
  if (!owner.frame) { C.calm++; if ('seat' in owner || 'seat' in stranger) C.lines.push(`LEAK calm ${seed}`); continue; }
  if ('seat' in stranger) C.lines.push(`LEAK stranger ${seed}`);
  C.framed++;
  const row = stranger.people.find((p) => p.why === 'seat');
  const face = owner.frame.sides.some((x) => x.name === row?.name);
  const field = owner.seat;
  if (field) { C.seatField++; if (field.name === row.name && field.role === row.role && field.sourcePath === row.sourcePath) C.seatEqStrangerRow++; }
  if (face && field) C.faceAndField++;
  if (row && !face && !field) { C.dropped++; const k = troubleOfWeight(s).strain.strain; C.byStrain[k] = (C.byStrain[k] || 0) + 1; C.droppedList.push(seed); }
  if (field && T.seatLineOf) C.lines.push(`${seed} (${tier}): ${T.seatLineOf(field)}`);
}
fs.writeFileSync(OUT, JSON.stringify({ counts: C, digests }, null, 1));
const { lines, droppedList, ...c } = C;
console.log(JSON.stringify(c)); console.log(lines.join('\n')); console.log('dropped:', droppedList.join(' '));
