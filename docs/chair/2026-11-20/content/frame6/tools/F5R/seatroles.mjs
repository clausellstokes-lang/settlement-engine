// probe: the calm seat row's role vs the card's role/title vs the office tables, over the pool
import fs from 'node:fs';
const [POOL, R] = process.argv.slice(2);
const { composeTonightSheet } = await import(R + 'domain/summary/tonightSheet.js');
const { OFFICE_WORDS } = await import(R + 'data/officeTitles.js');
const { CULTURE_OFFICE_WORDS } = await import(R + 'data/cultureOfficeTitles.js');
const { rulingChainOf } = await import(R + 'domain/dossier/powerStrata.js');
const words = new Set([...OFFICE_WORDS, ...CULTURE_OFFICE_WORDS.map((r) => r.word)].map((w) => w.toLowerCase()));
const { towns } = JSON.parse(fs.readFileSync(POOL, 'utf8'));
const tally = {}; let n = 0, framedN = 0;
for (const { seed, s } of towns) {
  const st = composeTonightSheet(s); const ow = composeTonightSheet(s, { audience: 'owner' });
  const seat = st.people.find((p) => p.why === 'seat');
  if (!seat) { console.log('NOSEAT', seed); continue; }
  n++;
  const npc = s.npcs[Number(seat.sourcePath.match(/\d+/)[0])];
  const isOffice = words.has(String(seat.role).toLowerCase().replace(/^acting /, ''));
  const k = `${isOffice ? 'office' : 'NOT-office'}`; tally[k] = (tally[k] || 0) + 1;
  const framed = !!ow.frame; if (framed) framedN++;
  const face = framed && ow.frame.sides.some((x) => x.name === seat.name);
  if (!isOffice || (framed && !face)) console.log(`${seed} framed=${framed} face=${face} role="${seat.role}" card.role="${npc.role}" card.title="${npc.title}" inst.title="${npc.institution?.title || ''}" says=${seat.says} chain="${rulingChainOf(s).npc?.name}"`);
}
console.log(JSON.stringify({ n, framedN, tally }));
