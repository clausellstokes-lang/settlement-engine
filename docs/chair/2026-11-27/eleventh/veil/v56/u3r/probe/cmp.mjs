// U3R: BEFORE (fc2 on v52dsql) against AFTER (fc2 on v56cure), read by read (seed x copy x door), Reveal off.
// Counted after the cure: served strings that TELL a covert tie (prominentRelationship by the oracle; pressureSentence by
// the oracle and BY THE WRITER); and the strings the cure withholds (present before, absent after), each telling or CLEAN.
import { readFileSync, readdirSync } from 'node:fs';
const load = (O) => readdirSync(O).filter((f) => /^fc-shard\d+\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(`${O}/${f}`, 'utf8')).reads);
const [B, A] = [load(process.argv[2]), load(process.argv[3])];
const key = (r) => `${r.seed}|${r.copy}|${r.door}`;
const before = new Map(B.map((r) => [key(r), r]));
const L = (...a) => console.log(a.join(' '));
const COPIES = ['M', 'T', 'live']; const DOORS = ['gallery', 'import', 'map', 'link'];
L(`before ${process.argv[2]} (${B.length} reads); after ${process.argv[3]} (${A.length} reads)`);
L('AFTER, telling strings served: copy | door | reads | PR tells | PS tells (oracle) | PS a covert tie\'s phrasing (WRITER)');
for (const c of COPIES) for (const d of DOORS) {
  const rs = A.filter((r) => r.copy === c && r.door === d && r.body);
  L(`  ${c} | ${d} | ${rs.length} | ${rs.filter((r) => r.prTells).length} | ${rs.filter((r) => r.psTells).length} | ${rs.filter((r) => r.psWriterCovert).length}`);
}
L('THE CURE WITHHOLDS (present before, absent after): copy | door | PR telling | PR CLEAN | PS telling | PS CLEAN');
const ex = [];
for (const c of COPIES) for (const d of DOORS) {
  const v = { prT: 0, prC: 0, psT: 0, psC: 0 };
  for (const a of A.filter((r) => r.copy === c && r.door === d && r.body)) {
    const b = before.get(key(a)); if (!b || !b.body) continue;
    if (b.prIn && !a.prIn) { if (b.prTells) v.prT += 1; else { v.prC += 1; if (ex.length < 12) ex.push({ seed: a.seed, copy: c, door: d, key: 'prominentRelationship', s: b.prText }); } }
    if (b.psIn && !a.psIn) { if (b.psTells || b.psWriterCovert) v.psT += 1; else { v.psC += 1; if (ex.length < 12) ex.push({ seed: a.seed, copy: c, door: d, key: 'pressureSentence', s: b.psText }); } }
  }
  L(`  ${c} | ${d} | ${v.prT} | ${v.prC} | ${v.psT} | ${v.psC}`);
}
L('  CLEAN EXAMPLES:'); for (const e of ex) L(`    ${JSON.stringify(e)}`);
const gained = A.filter((a) => { const b = before.get(key(a)); return b && b.body && ((!b.prIn && a.prIn) || (!b.psIn && a.psIn)); });
L(`served AFTER and not BEFORE (must be 0): ${gained.length}${gained.length ? ` e.g. ${gained.slice(0, 3).map(key).join(', ')}` : ''}`);
