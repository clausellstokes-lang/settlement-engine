// VEIL-19's builder (B, C, D): two runs of bcd-born.probe.jsx (a base chain and twin, a tree chain and twin), row for row.
//   node bcd-born-cmp.mjs <base.json> <tree.json>
// Per veil (the default veil, every eye shut): the rows whose fingerprint differs; of them those that differ OUTSIDE the
// trace, the two flag copies, the income rows and the economy prose rungs (0 wanted: B, C and D move only those); and what
// each item moves:
//   B   trace entries, causes and effects withheld (Reveal DM reads), allegiance receipts withheld, and any the tree sends
//       that the base withheld (0 wanted)
//   C   every flag that moves, per flag; a move is lawful where the engine's getInstFlags over the STORED records of the
//       houses the read still lists does not raise it (`served`); a flag raised where the base did not raise it (0 wanted)
//   D   reads that withhold an income row, and on them the sum of the served shares (base | tree; 100 wanted on the tree);
//       `weight` sent (0 wanted on the tree); the prose rungs withheld
// and reads that raise, server against twin (gallery and import).
import { readFileSync } from 'node:fs';
const [fa, fb] = process.argv.slice(2);
const a = JSON.parse(readFileSync(fa, 'utf8')); const b = JSON.parse(readFileSync(fb, 'utf8'));
const key = (r) => `${r.town} ${r.shape} ${r.kind} ${r.dm ? 'dm' : 'off'} ${r.read}`;
const mb = new Map(b.rows.map((r) => [key(r), r]));
const st = new Map(a.stored.map((s) => [s.town, s]));
const ek = (e) => JSON.stringify(e);
console.log(`towns ${a.towns} | ${b.towns}; rows ${a.rows.length} | ${b.rows.length}`);
for (const kind of ['default', 'all']) {
  const t = { rows: 0, differ: 0, outside: 0, missing: 0, errA: 0, errB: 0, twinA: 0, twinB: 0,
    bEntries: 0, bCauses: 0, bEffects: 0, bAlly: 0, bAllyLines: 0, bRows: 0, bSends: 0,
    cMoves: {}, cUnlawful: 0, cRaise: 0, cRows: 0,
    dRows: 0, dSumA: {}, dSumB: {}, dWeightA: 0, dWeightB: 0, dProse: 0, dRowsWithheld: 0, dSends: 0 };
  const ex = [];
  for (const r of a.rows.filter((x) => x.kind === kind)) {
    t.rows += 1;
    const s = mb.get(key(r)); if (!s) { t.missing += 1; continue; }
    if (r.error) t.errA += 1; if (s.error) t.errB += 1;
    if (r.twin) t.twinA += 1; if (s.twin) t.twinB += 1;
    if (r.h !== s.h) t.differ += 1;
    if (r.hRest !== s.hRest) { t.outside += 1; if (ex.length < 6) ex.push(`OUTSIDE ${key(r)}`); }
    // B
    if (r.trace && s.trace) {
      // the tree's trace is the base's with entries withheld and lists shortened: match in order (an entry's target, its
      // type and its step), each base entry to the next tree entry of the same key, else withheld
      const id = (e) => `${e.tt}|${e.ti}|${e.st}`;
      let j = 0; let moved = false;
      for (const e of r.trace) {
        const f = s.trace[j];
        if (!f || id(f) !== id(e)) { t.bEntries += 1; moved = true; if (e.st === 'people-allegiance') { t.bAlly += 1; t.bAllyLines += e.ar.length; } continue; }
        j += 1;
        t.bCauses += e.c.length - f.c.length; t.bEffects += e.e.length - f.e.length;
        if (e.c.length !== f.c.length || e.e.length !== f.e.length) moved = true;
        if (f.c.some((c) => !e.c.includes(c)) || f.e.some((x) => !e.e.includes(x))) t.bSends += 1;
      }
      if (j < s.trace.length) t.bSends += 1;
      if (moved) t.bRows += 1;
    } else if (!r.trace && s.trace) t.bSends += 1;
    // C
    let cMoved = false;
    for (const [copy, fa2, fb2] of [['econ', r.flags, s.flags], ['safety', r.sflags, s.sflags]]) {
      if (!fa2 || !fb2) { if (!fa2 && fb2) t.cRaise += 1; continue; }
      for (const k of new Set([...Object.keys(fa2), ...Object.keys(fb2)])) {
        if (fa2[k] === fb2[k]) continue;
        cMoved = true;
        if (fb2[k] === true || (fa2[k] !== true && fb2[k] !== undefined)) { t.cRaise += 1; if (ex.length < 12) ex.push(`RAISE ${copy}.${k} ${key(r)}`); continue; }
        const m = `${copy}.${k}`; t.cMoves[m] = (t.cMoves[m] || 0) + 1;
        if (s.served?.[k] === true) { t.cUnlawful += 1; if (ex.length < 12) ex.push(`SERVED RAISES ${copy}.${k} ${key(r)}`); }
      }
    }
    if (cMoved) t.cRows += 1;
    // D
    const town = st.get(r.town);
    if (Array.isArray(r.income) && Array.isArray(s.income)) {
      const stored = town.income.length;
      if (s.income.length < stored) {
        t.dRowsWithheld += 1;
        const sa = r.income.reduce((n, x) => n + (Number(x[2]) || 0), 0); const sb2 = s.income.reduce((n, x) => n + (Number(x[2]) || 0), 0);
        t.dSumA[sa] = (t.dSumA[sa] || 0) + 1; t.dSumB[sb2] = (t.dSumB[sb2] || 0) + 1;
      }
      if (s.income.length > r.income.length) t.dSends += 1;
      if (r.income.some((x) => typeof x[3] === 'number')) t.dWeightA += 1;
      if (s.income.some((x) => typeof x[3] === 'number')) t.dWeightB += 1;
      if (ek(r.income) !== ek(s.income)) t.dRows += 1;
    }
    if (r.prose && s.prose && s.prose.length < r.prose.length) t.dProse += 1;
  }
  console.log(`${kind === 'all' ? 'EVERY EYE SHUT' : 'THE DEFAULT VEIL'}: rows ${t.rows}; differ ${t.differ}; differ OUTSIDE the trace, the flags, the income rows and the economy prose ${t.outside}; missing ${t.missing}; reads that raise ${t.errA} | ${t.errB}; server-twin rows ${t.twinA} | ${t.twinB}`);
  console.log(`  B: rows whose trace moves ${t.bRows}; entries withheld ${t.bEntries} (allegiance receipts ${t.bAlly}, with ${t.bAllyLines} power/handler lines); causes withheld ${t.bCauses}; effects withheld ${t.bEffects}; rows that send what the base withheld ${t.bSends}`);
  console.log(`  C: rows whose flags move ${t.cRows}; moves ${JSON.stringify(t.cMoves)}; moves where the served houses raise the flag ${t.cUnlawful}; flags raised ${t.cRaise}`);
  console.log(`  D: reads that withhold an income row ${t.dRowsWithheld}; their sums base ${JSON.stringify(t.dSumA)} | tree ${JSON.stringify(t.dSumB)}; reads whose rows move ${t.dRows}; rows sent the base withheld ${t.dSends}; reads sending weight ${t.dWeightA} | ${t.dWeightB}; reads that lose an income prose rung ${t.dProse}`);
  for (const e of ex) console.log(`  ${e}`);
}
