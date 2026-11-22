// R5D-1 (VEIL-34's MEASURE builder V34-R5D1): the three tables over the extended arm's shards and the lit copy's shards.
//   node r5d1-an.mjs <arm outdir> <lit outdir>
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { T13 } from './templates.mjs';
const [dir, litDir] = process.argv.slice(2);
const towns = readdirSync(dir).filter((f) => /^arm-shard\d+\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')).towns);
const J = JSON.stringify; const L = (...a) => console.log(...a); const pct = (a, b) => (b ? `${(100 * a / b).toFixed(1)}%` : '-');
const inc = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
const IDS = [...T13.map((t) => t[0])];
L(`towns ${towns.length}; pages ${towns.reduce((s, t) => s + Object.keys(t.pages).length, 0)}; pages with y ${towns.reduce((s, t) => s + Object.values(t.pages).filter((p) => p.y).length, 0)}; yErr ${towns.reduce((s, t) => s + Object.values(t.pages).filter((p) => p.yErr).length, 0)}`);
// the record's copy pairs (R5D-0's dupBase): a record desc whose base equals another power's base in the same record
const copyNames = new Map(towns.map((t) => { const bs = t.x.rd.filter((r) => r.base); return [t.seed, new Set(bs.filter((r) => bs.some((o) => o !== r && o.base === r.base)).map((r) => r.n))]; }));
const minted = new Map(towns.map((t) => [t.seed, new Set((t.y?.hosts || []).map((h) => h[0]))]));
// ============ M1
L('\n== M1 THE 13: served instances by the card\'s kind (server, both reads; R5D-0\'s Q2 rows, T05+T06 its one row) ==');
const m1 = Object.fromEntries(IDS.map((i) => [i, { off: 0, dm: 0, kinds: {}, sizes: {}, offW: 0, nh: 0 }]));
for (const t of towns) for (const [k, p] of Object.entries(t.pages)) {
  const [read, , eng] = k.split('|'); if (eng !== 'sv' || !p.y) continue;
  for (const c of p.y.c) {
    const ids = [...c[2]]; if (copyNames.get(t.seed).has(c[0]) && minted.get(t.seed).has(c[0])) ids.push('T13');
    for (const i of ids) { const r = m1[i]; r[read] += 1; inc(r.kinds, c[1]); inc(r.sizes, t.size); if (p.W?.length) r.offW += 1; if (!p.hide) r.nh += 1; }
  }
}
for (const [id, sym, cond, reads, writes] of T13) { const r = m1[id]; L(`  ${id} ${sym}\n     picked by: ${cond}\n     reads: ${reads}; writes (by the read): ${writes}\n     served off ${r.off}, dm ${r.dm}; nothing-hidden ${r.nh}; on a withholding page ${r.offW}; by kind ${J(r.kinds)}; by size ${J(r.sizes)}`); }
const mintedServed = {}; for (const t of towns) for (const [k, p] of Object.entries(t.pages)) { if (!k.endsWith('|sv') || !p.y) continue; for (const c of p.y.c) if (minted.get(t.seed).has(c[0])) { inc(mintedServed, `${c[1]}`); if (c[9]) inc(mintedServed, 'contestsNiche served'); } }
L(`  minted rivals served (server, both reads) by kind: ${J(mintedServed)} (the host link 'contestsNiche' served on: ${mintedServed['contestsNiche served'] || 0})`);
// ============ M2
L('\n== M2 FIDELITY on the nothing-hidden pages: the page\'s picker (late options) over the served roster, each presence-picked base ==');
const m2 = {}; const miss = {}; const missEx = {}; const seedVar = {}; const allCards = {}; const lose = {}; const seat = { pages: 0, differ: 0, ex: [] };
for (const t of towns) { const causes = t.causes || {}; for (const [k, p] of Object.entries(t.pages)) {
  const [read, , eng] = k.split('|'); if (!p.y || p.hide) continue;
  if (eng === 'sv') { seat.pages += 1; if (p.y.seat[0] !== p.y.seat[1]) { seat.differ += 1; if (seat.ex.length < 4) seat.ex.push([t.seed, k, p.y.seat]); } }
  const sd = new Map((p.xsd || []).map((r) => [r[0], r[1]]));
  for (const c of p.y.c) {
    if (eng === 'sv') { inc(allCards, `kind:${c[1]}`); inc(allCards, `size:${t.size}`); inc(allCards, 'all'); }
    const ids = [...c[2]]; if (copyNames.get(t.seed).has(c[0]) && minted.get(t.seed).has(c[0])) ids.push('T13');
    if (eng === 'sv' && ids.length && c[3] !== 1) { inc(lose, `kind:${c[1]}`); inc(lose, `size:${t.size}`); inc(lose, 'all'); inc(lose, `how:${c[3] === -1 ? c[7] : 'picked, differs'}`); }
    if (eng === 'sv' && ids.length) { inc(allCards, 'tplCards'); inc(allCards, `tpl|kind:${c[1]}`); inc(allCards, `tpl|size:${t.size}`); }
    for (const i of ids) {
      const key = `${eng}|${i}`; const r = m2[key] || (m2[key] = { n: 0, L: 0, N0: 0, seedN: 0, seedEq: 0, seedVar: 0 }); r.n += 1; if (c[3] === 1) r.L += 1; if (c[4] === 1) r.N0 += 1;
      if (c[5] !== -2) { r.seedN += 1; if (c[5] === 1 && c[6] === 1) r.seedEq += 1; if (c[5] !== c[6]) { r.seedVar += 1; inc(seedVar, `${i}|${c[1]}|${t.size}`); } }
      if (c[3] !== 1) {
        let why;
        if (c[3] === -1) why = `no base picked: ${c[7]}`;
        else if (String(c[7]).startsWith('kind')) why = `the host by kind (${c[7]}): its base differs`;
        else if (c[5] !== -2 && c[5] !== c[6]) why = 'a seed draw (r5d1-a vs r5d1-b differ)';
        else if (p.y.seat[0] !== p.y.seat[1]) why = "the picker's seat differs from the served seat";
        else if (c[4] === 1) why = 'the late replay options (with them it differs; without, equal)';
        else if (causes[c[0]]?.steps?.length) why = `a step after the power step rewrote it: ${causes[c[0]].steps.join(' > ').slice(0, 90)}`;
        else if (sd.get(c[0]) === 0) why = 'the served page differs from the record';
        else why = 'differs (no step named)';
        inc(miss, `${eng}|${i}|${why}`); const mk = `${eng}|${i}|${why}`; if (!missEx[mk]) missEx[mk] = [t.seed, k, c[0], c[8]];
      }
    }
  }
} }
L(`  the picker's seat (generatePowerStructure's own, from config and houses) equal to the served seat: ${seat.pages - seat.differ} / ${seat.pages} server pages; differ e.g. ${J(seat.ex)}`);
for (const eng of ['sv', 'tw']) for (const i of IDS) { const r = m2[`${eng}|${i}`]; if (!r) { L(`  ${eng} ${i}: 0 served on nothing-hidden pages`); continue; } L(`  ${eng} ${i}: reproduced ${r.L} / ${r.n} (late options); ${r.N0} / ${r.n} (none)${eng === 'sv' ? `; seeds a,b both equal ${r.seedEq} / ${r.seedN}, a != b ${r.seedVar}` : ''}`); }
L('  MISSES by cause (late options):'); for (const k of Object.keys(miss).sort()) L(`    ${k}: ${miss[k]}  e.g. ${J(missEx[k]).slice(0, 520)}`);
L(`  seed-varying template cards (server) by id|kind|size: ${J(seedVar)}`);
L(`  SERVER nothing-hidden cards (all kinds) ${J(allCards)}`);
L(`  template cards the picker does NOT reproduce (would LOSE their base on a shared page), server: ${J(lose)}`);
for (const k of Object.keys(allCards).filter((x) => /^(kind|size):/.test(x)).sort()) L(`    ${k}: lose ${lose[k] || 0} of ${allCards[k]} cards (${pct(lose[k] || 0, allCards[k])}); of its ${allCards[`tpl|${k}`] || 0} presence-picked cards ${pct(lose[k] || 0, allCards[`tpl|${k}`] || 0)}`);
L(`    all: lose ${lose.all || 0} of ${allCards.all} (${pct(lose.all || 0, allCards.all)}); of ${allCards.tplCards} presence-picked cards ${pct(lose.all || 0, allCards.tplCards)}; by how ${J(Object.fromEntries(Object.entries(lose).filter(([x]) => x.startsWith('how:'))))}`);
if (0) for (const [k, n] of Object.entries(lose)) L(`    ${k}: ${n} of ${allCards[k] || 0} cards (${pct(n, allCards[k] || 0)})`);
const z = {}; for (const t of towns) for (const [k, p] of Object.entries(t.pages)) { if (!k.endsWith('|sv') || p.hide || !p.y) continue; for (const c of p.y.c) if (c[3] === 0 && !z[`${t.seed}|${c[0]}`]) z[`${t.seed}|${c[0]}`] = [k, c[7], c[2], c[8]]; }
L(`  every distinct (birth, card) the picker picks WRONG (code 0) on a nothing-hidden server page: ${Object.keys(z).length}`); for (const [kk, v] of Object.entries(z)) L(`    ${kk} ${J(v).slice(0, 600)}`);
// ============ M3 plants
L('\n== M3 THE PLANTS (the 140 births, read off, unmarked): the picker on the hiding read vs the place with that power never there ==');
const m3 = {}; const m3ex = {};
for (const t of towns) for (const pl of (t.y?.plants || [])) {
  if (pl.none) { inc(m3, `${pl.kind}|none`); continue; }
  for (const [eng, v] of Object.entries(pl.eng)) {
    const key = `${pl.kind}|${eng}`; const r = m3[key] || (m3[key] = { plants: 0, err: 0, hiddenServed: 0, masked: 0, seatEq: 0, cards: 0, eq: 0, tpl: 0, tplEq: 0, noPick: 0, tplPickNeStored: 0, storedEqNever: 0 }); r.plants += 1;
    if (v.err) { r.err += 1; continue; }
    r.hiddenServed += v.servedRow; r.masked += v.masked ? 1 : 0; if (v.seat[1] === v.seat[3]) r.seatEq += 1;
    for (const c of v.cards) { r.cards += 1; if (c[3] === 1) r.eq += 1; if (c[3] === -1) r.noPick += 1; if (c[4] === 1) r.storedEqNever += 1; const isT = c[2].length || c[8].length; if (isT) { r.tpl += 1; if (c[3] === 1) r.tplEq += 1; if (c[5] === 0) r.tplPickNeStored += 1; }
      if (c[3] !== 1) { const mk = `${key}|${c[3]}|${c[6]}`; inc(m3, `diff:${mk}`); if (!m3ex[mk]) m3ex[mk] = [t.seed, pl.n, c[0], c[7]]; } }
    for (const c of v.cards) if (c[9]) inc(m3, `${key}|picker != served base: ${c[9][0].startsWith(`${c[9][1]} `) ? 'a standing left on the served base (names the mask; the table does not cut it)' : 'the base itself'}`);
    if (eng === 'sv') for (const c of v.cards) if (c[9] && !c[9][0].startsWith(`${c[9][1]} `)) L(`  [plant ${pl.kind} ${t.seed} hides ${pl.n}] picker != the hiding read's served base: ${J([c[0], c[2], c[3], c[9]]).slice(0, 760)}`);
  }
}
for (const k of Object.keys(m3).sort()) L(`  ${k}: ${J(m3[k])}${m3ex[k.replace(/^diff:/, '')] ? `  e.g. ${J(m3ex[k.replace(/^diff:/, '')]).slice(0, 400)}` : ''}`);
// ============ M3 lit
if (litDir && existsSync(litDir)) {
  L('\n== M3 LIT (the copied litsurf probe, act T: the hidden taker; the picker on each read vs the place with it never there) ==');
  const rows = readdirSync(litDir).filter((f) => /^litsurf-shard\d+\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(`${litDir}/${f}`, 'utf8')).rows);
  const lt = {}; const lex = {}; const place = []; const ls = {}; const lsx = [];
  for (const row of rows) for (const a of (row.seat || [])) { if (a.scen !== 'T' || !a.y) continue;
    for (const [rk, v] of Object.entries(a.y)) { const r = lt[rk] || (lt[rk] = { acts: 0, err: 0, hidingReads: 0, seatPickEq: 0, cards: 0, eq: 0, tpl: 0, tplEq: 0, noPick: 0 }); r.acts += 1; if (v.err) { r.err += 1; continue; }
      if (!v.servedRow) r.hidingReads += 1; if (v.seat[1] === v.seat[3]) r.seatPickEq += 1;
      { const q = ls[rk] || (ls[rk] = { reads: 0, pickerSeatIsServedSeat: 0, tplCards: 0, pickerEqStored: 0, pickerNeStored: 0, noPick: 0 }); q.reads += 1; if (v.seat[0] === v.seat[1]) q.pickerSeatIsServedSeat += 1;
        for (const c of v.cards) if (c[2].length || c[8].length) { q.tplCards += 1; if (c[5] === 1) q.pickerEqStored += 1; else if (c[5] === 0) { q.pickerNeStored += 1; if (c[9] && c[9][0].startsWith(`${c[9][1]} `)) q.neIsStandingResidue = (q.neIsStandingResidue || 0) + 1; if (lsx.length < 6 && rk === 'off|server') lsx.push([row.seed, a.hiddenPower, v.seat, c[0], c[2], c[8], c[9]]); } else q.noPick += 1; } }
      for (const c of v.cards) { r.cards += 1; if (c[3] === 1) r.eq += 1; if (c[3] === -1) r.noPick += 1; const isT = c[2].length || c[8].length; if (isT) { r.tpl += 1; if (c[3] === 1) r.tplEq += 1; }
        if (c[3] !== 1) { const mk = `${rk}|${c[3]}|${c[6]}`; inc(lt, `diff:${mk}`); if (!lex[mk]) lex[mk] = [row.seed, a.hiddenPower, c[0], c[7]]; } }
      if (['jp6-city-8', 'jp6-city-2', 'jp6-village-6', 'jp6-metropolis-0'].includes(row.seed)) place.push([row.seed, rk, a.hiddenPower, `servedRow ${v.servedRow}`, `seat served/picker hide ${v.seat[0]}/${v.seat[1]} never ${v.seat[2]}/${v.seat[3]}`, `cards ${v.cards.length} equal ${v.cards.filter((c) => c[3] === 1).length}`, v.cards.filter((c) => c[9]).map((c) => [c[0], c[2], c[8], c[3], c[9][0].slice(0, 90), c[9][1].slice(0, 90)])]);
    } }
  L(`  births ${rows.length}; act T with y ${rows.reduce((s, r) => s + (r.seat || []).filter((a) => a.scen === 'T' && a.y).length, 0)}`);
  for (const k of Object.keys(lt).sort()) L(`  ${k}: ${J(lt[k])}${lex[k.replace(/^diff:/, '')] ? `  e.g. ${J(lex[k.replace(/^diff:/, '')]).slice(0, 400)}` : ''}`);
  L(`  the picker's seat (config) vs the served seat after the act; the template cards' picked base vs the base the read serves: ${J(ls)}`); for (const x of lsx) L(`    e.g. ${J(x).slice(0, 700)}`);
  L('  the four places:'); for (const p of place) L(`    ${J(p).slice(0, 900)}`);
}
