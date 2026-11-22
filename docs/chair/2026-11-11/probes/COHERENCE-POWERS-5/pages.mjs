// pages.mjs <dumps-dir> — on the rendered pages: N3 (cards saying "Holds the seat"), N5 (the ruling three's heading
// against its names), N6 (the holder's own house's Connection row titled with another office word), N7 (the seat row's
// doubled office word; the caretaker's two titles), and the seat holder's card (the guard's four reads).
import fs from 'node:fs'; import path from 'node:path';
const dir = process.argv[2];
const C = {}; const inc = (k) => { C[k] = (C[k] || 0) + 1; }; const ex = {}; const note = (k, v) => { (ex[k] ||= []).length < 5 && ex[k].push(v); };
const { OFFICE_WORDS } = await import(path.resolve(process.argv[3] || '.') + '/src/data/officeTitles.js');
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.txt')).sort()) {
  const seed = f.replace(/\.txt$/, ''); const L = fs.readFileSync(path.join(dir, f), 'utf8').split('\n');
  inc('pages');
  // the seat row
  const seatRow = L.find((l) => l.startsWith('The seat')) || '';
  const m = seatRow.match(/^The seat(.+?), (the [^,]+?) and (.+)$/);
  if (m) { const tw = m[2].toLowerCase().split(/[\s-]+/).pop(); const ow = m[3].toLowerCase().split(/\s+/).pop(); if (tw === ow) { inc('N7.doubledOfficeWord'); note('N7.doubled', `${seed}: ${seatRow}`); } }
  // the caretaker: seat row in Acting form, DM block Steward
  if (/keeps the seat meanwhile/.test(seatRow) && L.some((l) => /^Steward · /.test(l))) { inc('N7.caretakerTwoTitles'); note('N7.caretaker', `${seed}: ${seatRow.slice(0, 120)}`); }
  // N5
  const r3 = L.findIndex((l) => /^The ruling three of/.test(l));
  if (r3 >= 0) { const n = ['Head ·', 'Second ·', 'Third ·', 'Steward ·'].filter((h) => L.slice(r3 + 1, r3 + 4).some((x) => x.startsWith(h))).length; if (n < 3) { inc('N5.rulingThreeFewer'); if (n === 1) inc('N5.rulingThreeOneName'); } }
  if (L.some((l) => /^↳1 member · first/.test(l))) inc('N5.oneMemberFirst');
  // N6: the holder's name from the seat row; every Connection row naming the holder
  const holder = m ? m[1].trim() : (seatRow.match(/^The seat(.+?), /)?.[1] || '').trim();
  const office = m ? m[3].trim() : '';
  if (holder && office) for (const l of L.filter((x) => x.startsWith('Connection: ') && x.includes(holder))) {
    const hon = l.slice(12, l.indexOf(holder)).trim();
    if (hon && hon !== office && hon !== `Acting ${office}` && OFFICE_WORDS.includes(hon)) { inc('N6.connectionOtherOffice'); note('N6', `${seed}: ${l} (seat: ${office})`); }
  }
  // N3 on the page: the NPC tab's cards that say "Holds the seat", and whose card it is
  const npcAt = L.findIndex((l) => l === '== World/NPCs =='); const end = L.findIndex((l, i) => i > npcAt && l.startsWith('== '));
  const npcLines = L.slice(npcAt, end < 0 ? undefined : end);
  let current = null; const holds = [];
  for (const l of npcLines) { const nm = l.match(/^(.+?)(●●●|●●|●)$/); if (nm) current = { name: nm[1], dots: nm[2] }; if (/^Holds the seat/.test(l) && current) holds.push(current.name); }
  const others = holds.filter((n) => n !== holder);
  if (others.length) { inc('N3.page.births'); note('N3.page', `${seed}: ${others.join(', ')} (seat: ${holder})`); }
}
console.log(C); for (const k of Object.keys(ex)) { console.log('--', k); ex[k].forEach((v) => console.log('  ', v.slice(0, 200))); }
