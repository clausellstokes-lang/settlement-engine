import { readFileSync } from 'node:fs';
const S = process.argv[2];
const M = JSON.parse(readFileSync(`${S}/d13-on-master.json`)), L = JSON.parse(readFileSync(`${S}/d13-on-line.json`));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const tmplRx = (t) => new RegExp('^' + esc(t).replace(/\\\{\w+\\\}/g, '.+') + '$');
// Daily Life
const dl = { slots: 0, same: 0, moved: 0, movedReDealt: 0, movedRefusedOrGone: 0, gone: 0, masterEmpty: 0, lineEmpty: 0 }; const bySlot = {}; const ex = [];
for (const [seed, m] of Object.entries(M)) { const l = L[seed];
  for (const [slot, mt] of Object.entries(m.dlText)) { const lt = l.dlText[slot] ?? null; dl.slots++; const b = (bySlot[slot] ||= { n: 0, same: 0, reDealt: 0, refusedOrGone: 0, inPool: 0 }); b.n++;
    if (mt === lt) { dl.same++; b.same++; continue; }
    if (!mt) { dl.masterEmpty++; continue; }
    dl.moved++;
    const call = l.dlCalls.find((c) => c.key.includes(`dailyLife.${slot}::`));
    const elig = call ? call.texts.some((t) => t && tmplRx(t).test(mt)) : false;
    if (elig) { dl.movedReDealt++; b.reDealt++; if (ex.length < 4) ex.push(`${seed} ${slot}: master "${mt}" -> line "${lt}"`); } else { dl.movedRefusedOrGone++; b.refusedOrGone++; }
  } }
console.log('DAILY LIFE', JSON.stringify(dl)); console.log(JSON.stringify(bySlot)); ex.forEach((e) => console.log('  ' + e));
// viability
let vm = 0; for (const [s, m] of Object.entries(M)) if (m.via !== L[s].via) vm++; console.log('VIABILITY moved', vm, 'of', Object.keys(M).length);
// state prose by path
const sp = { slots: 0, same: 0, movedSamePool: 0, vidKeptElsewhere: 0, poolChanged: 0, gone: 0 }; const ex2 = [];
for (const [s, m] of Object.entries(M)) { const lmap = new Map(L[s].sp.map((p) => [p.path, p])); for (const p of m.sp) { sp.slots++; const q = lmap.get(p.path); if (!q) { sp.gone++; continue; }
  if (p.sentence === q.sentence) { sp.same++; continue; }
  if (p.poolKey === q.poolKey && p.blockId === q.blockId) { if (JSON.stringify(p.vids) !== JSON.stringify(q.vids)) { sp.movedSamePool++; if (ex2.length < 4) ex2.push(`${s} ${p.blockId} ${p.poolKey} vids ${p.vids}->${q.vids}: "${p.sentence}" -> "${q.sentence}"`); } else sp.vidKeptElsewhere++; } else sp.poolChanged++; } }
console.log('STATE PROSE', JSON.stringify(sp)); ex2.forEach((e) => console.log('  ' + e));
