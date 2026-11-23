
// ── VEIL-29, ruling 72 (b): GATE-2's chance level. (1) the cells the comparison holds; (2) CONTROLS against CONTROLS: the 48
// controls split at random 24/24 (2,000 splits, seeded), the same one-sided Fisher at every gated setting x read (twin; the
// controls are read by the twin only): red cells per split (mean, 95th percentile, max) out of the cells a split holds, and the
// red RATE beside the hidden comparison's; (3) the hidden pages failing L3 grouped by separating family (towns and pages),
// beside the controls' failing pages by the same families.
{
  let seed = 29; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const cellsHidden = GATED.length * READS.length * 2;
  let redHidden = 0; for (const set of GATED) for (const rd of READS) { const c = g2(3, ctl, 'twin', rd, set).length;
    for (const eng of ['twin', 'server']) if (fisher(g2(3, hid, eng, rd, set).length, hid.length, c, ctl.length) < 0.05) redHidden += 1; }
  const cellsSplit = GATED.length * READS.length; const reds = [];
  for (let i = 0; i < 2000; i += 1) { const sh = [...ctl].map((t) => [rnd(), t]).sort((a, b) => a[0] - b[0]).map((x) => x[1]); const A2 = sh.slice(0, 24); const B2 = sh.slice(24);
    let r = 0; for (const set of GATED) for (const rd of READS) { const a = g2(3, A2, 'twin', rd, set).length; const c = g2(3, B2, 'twin', rd, set).length;
      if (fisher(a, A2.length, c, B2.length) < 0.05) r += 1; if (fisher(c, B2.length, a, A2.length) < 0.05) r += 1; } reds.push(r); }
  reds.sort((a, b) => a - b); const mean = reds.reduce((a, b) => a + b, 0) / reds.length;
  console.log(`\nCHANCE (ruling 72 (b)): THE HIDDEN COMPARISON: ${redHidden} red of ${cellsHidden} cells (${GATED.length} settings x ${READS.length} reads x 2 engines)`);
  console.log(`CHANCE: CONTROLS AGAINST CONTROLS, 2,000 random 24/24 splits, both directions, ${cellsSplit * 2} cells a split: red cells mean ${mean.toFixed(2)}, 95th pct ${reds[Math.floor(reds.length * 0.95)]}, max ${reds[reds.length - 1]}; splits with any red ${reds.filter((x) => x > 0).length} of 2000`);
  console.log(`CHANCE: red rate hidden ${(redHidden / cellsHidden).toFixed(3)} against controls-vs-controls mean ${(mean / (cellsSplit * 2)).toFixed(4)}`);
  console.log('CHANCE: CONTROLS FAILING L3 per gated setting (Reveal off / DM, of 48): ' + GATED.map((s) => `${s} ${g2(3, ctl, 'twin', 'off', s).length}/${g2(3, ctl, 'twin', 'dm', s).length}`).join(', '));
  const fam = (ts, engs) => { const o = {}; for (const t of ts) for (const eng of engs) for (const rd of READS) for (const set of GATED) { const s = sigAt(t, eng, rd, set); if (s === undefined || jMember(3, t.size, rd, s)) continue;
    for (const d of sepOf(t.size, rd, s)) { const f = d.split(':')[0]; const e = (o[f] ||= { towns: new Set(), pages: 0, dir: {} }); e.towns.add(t.seed); e.pages += 1; const dr = d.slice(f.length + 1); e.dir[dr] = (e.dir[dr] || 0) + 1; } } return o; };
  const H = fam(hid, ['twin', 'server']); const C = fam(ctl, ['twin']);
  console.log('CHANCE: THE FAILING PAGES BY SEPARATING FAMILY: family | hidden towns (of 92) / pages (twin+server) [directions] | controls (of 48) / pages (twin)');
  for (const [f, e] of Object.entries(H).sort((a, b) => b[1].towns.size - a[1].towns.size)) console.log(`  ${f} | ${e.towns.size} / ${e.pages} [${Object.entries(e.dir).map(([k, v]) => `${k} ${v}`).join(', ')}] | ${C[f] ? `${C[f].towns.size} / ${C[f].pages}` : '0 / 0'}`);
  for (const [f, e] of Object.entries(C)) if (!H[f]) console.log(`  ${f} | 0 / 0 | ${e.towns.size} / ${e.pages}`);
}
