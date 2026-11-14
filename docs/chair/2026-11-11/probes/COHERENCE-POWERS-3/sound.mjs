// node sound.mjs <tree> <dump.jsonl> — the review's sound results, on every birth of the dump
import fs from 'node:fs'; import path from 'node:path';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const { backingRowFor } = await imp('src/data/institutionBacking.js');
const { FACE_SEAT, faceOfInstitution, familyOfInstitution } = await imp('src/data/institutionalCatalog.js');
const kindOf = (c) => {
  if (c.ik !== 'house') return 'office';
  const row = { name: c.ikey }; const fam = familyOfInstitution(row);
  if (faceOfInstitution(row) === FACE_SEAT || fam?.shelf === 'Government') return 'office';
  const b = backingRowFor(c.ikey); if (!b) return 'unplaced';
  const top = Object.entries(b.shares).sort((x, y) => y[1] - x[1])[0][0]; return top === 'government' ? 'office' : top;
};
const SEAT = (await imp('src/generators/people/representatives.js')).SEAT_CARD_ID;
const KINDS = ['religious', 'military', 'merchant', 'arcane', 'noble', 'craft'];
const out = { births: 0, seatRowNotLeader: [], connNotLeader: [], officeBesideHead: [], councilNoHouse: [], ladderTopNotLeader: [], powerTopNotFirst: 0, twoCardsShareName: [] };
for (const l of fs.readFileSync(process.argv[3], 'utf8').trim().split('\n')) {
  const r = JSON.parse(l); out.births++;
  const gov = r.powers.find((p) => p.g);
  const leader = gov && r.cards.find((c) => c.id === gov.first);
  if (r.seat.name && leader && r.seat.name !== leader.n) out.seatRowNotLeader.push(r.key);
  if (r.conn?.id && leader && r.conn.id !== leader.id) out.connNotLeader.push(r.key);
  if (leader && kindOf(leader) !== 'office' && r.cards.some((c) => c.id !== leader.id && ((r.conn && c.ik === 'house' && c.ikey === r.conn.house) || c.id === SEAT))) out.officeBesideHead.push(r.key);
  if (gov && KINDS.includes(gov.a) && !r.cards.some((c) => kindOf(c) === gov.a)) out.councilNoHouse.push(r.key);
  if (gov && gov.first && gov.top !== gov.firstLadder) out.ladderTopNotLeader.push(r.key);
  for (const p of r.powers) if (!p.g && p.first && p.top !== p.firstLadder) out.powerTopNotFirst++;
  const names = r.cards.map((c) => c.n); if (new Set(names).size !== names.length) out.twoCardsShareName.push(r.key);
}
for (const [k, v] of Object.entries(out)) console.log(k, Array.isArray(v) ? `${v.length} ${v.slice(0, 6).join(' ')}` : v);
