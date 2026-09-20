/**
 * Q3 + Q4 + Q5 — the eight edits under §22.1's MERGE, on a village, a town, a city and a
 * metropolis. usage: node --import ./hook3.mjs q3-merge-edits.mjs [arm]
 *   arm = 'edited' (the §22.1 literal: held facts from the edited record) | 'R1'
 */
import { h, clone, pathDiff, fmtTally, keyOf, sample63 } from './lib.mjs';
import { generate, heldOf, tryRederive, HELD_KEYS } from './seam.mjs';
import { merge } from './merge.mjs';
import { checkExact, checkBands, observeBands, checkFlags, observeFlags } from './invariants.mjs';
import { instrumentedRoot, runHeadless, TREE } from './instrument.mjs';

const ARM = process.argv[2] || 'edited';
const { applyNpcRenameToSettlement } = await import(`${TREE}/src/domain/factionRename.js`);
const OPT = { nameMode: 'consume', relink: true, pinAwareAsserts: true, holdPower: true }; // placement='every' — §22.1's seam

// ── the dangling-join instrument (the second recon's, grouped BY KIND)
const JOINS = [
  ['relationships[].npc1Name', 'npc'], ['relationships[].npc2Name', 'npc'],
  ['relationships[].npc1Id', 'npc'], ['relationships[].npc2Id', 'npc'],
  ['factions[].members[].name', 'npc'], ['factions[].members[].id', 'npc'],
  ['prominentRelationship.npc1', 'npc'], ['prominentRelationship.npc2', 'npc'],
  ['npcs[].factionAffiliation', 'powerFaction'], ['factions[].members[].factionAffiliation', 'powerFaction'],
  ['factions[].powerFactionName', 'powerFaction'], ['powerStructure.governingName', 'powerFaction'],
  ['powerStructure.government', 'powerFaction'], ['powerStructure.factionRelationships[].pair[]', 'powerFaction'],
  ['history.currentTensions[].factions[]', 'powerFaction'], ['npcs[].institution', 'institution'],
  ['npcs[].secondaryAffiliation', 'institution|powerFaction'], ['npcs[].corruptTies.criminalInstitution', 'institution'],
  ['availableServices.*[].institution', 'institution'], ['economicState.activeChains[].processingInstitutions[]', 'institution'],
  ['economicState.tradeDependencies[].institution', 'institution'], ['resourceAnalysis.gaps[].institution', 'institution'],
  ['spatialLayout.quarters[].landmarks[]', 'institution'], ['defenseProfile.institutions.*[].name', 'institution'],
  ['conflicts[].parties[]', 'npcFactionGroup'], ['powerStructure.conflicts[].parties[]', 'npcFactionGroup'],
];
const tokensOf = (rec) => ({
  npc: { name: new Set((rec.npcs || []).map(n => n?.name).filter(Boolean)), id: new Set((rec.npcs || []).map(n => String(n?.id)).filter(Boolean)) },
  powerFaction: { name: new Set((rec.powerStructure?.factions || []).flatMap(f => [f?.faction, f?.name]).filter(Boolean)) },
  npcFactionGroup: { name: new Set((rec.factions || []).flatMap(f => [f?.name, f?.faction]).filter(Boolean)) },
  institution: { name: new Set((rec.institutions || []).map(i => i?.name).filter(Boolean)) },
});
function valuesAt(root, pattern) {
  const out = []; const parts = pattern.split('.');
  (function w(v, i) {
    if (v === undefined || v === null) return;
    if (i >= parts.length) { if (typeof v === 'string') out.push(v); return; }
    let p = parts[i]; const a = p.endsWith('[]'); if (a) p = p.slice(0, -2);
    if (p === '*') { for (const val of Object.values(v)) { const t = a ? (Array.isArray(val) ? val : []) : [val]; for (const x of t) w(x, i + 1); } return; }
    const next = p === '' ? v : v[p]; if (next === undefined) return;
    if (a) { if (Array.isArray(next)) for (const x of next) w(x, i + 1); return; }
    w(next, i + 1);
  })(root, 0);
  return out;
}
const dangling = (rec) => {
  const T = tokensOf(rec); const bad = [];
  for (const [pattern, kinds] of JOINS) for (const v of valuesAt(rec, pattern)) {
    const key = pattern.endsWith('Id') || pattern.endsWith('.id') ? 'id' : 'name';
    if (!kinds.split('|').some(k => T[k]?.[key]?.has(v))) bad.push({ s: `${pattern}="${v}"`, kind: kinds, pattern });
  }
  return bad;
};

const TIERS = ['village', 'town', 'city', 'metropolis'];
const records = TIERS.map(t => { const row = sample63().find(r => r.settType === t); return { t, row, rec: generate(row) }; });
const OBS = observeBands(records.map(x => x.rec));
const FOBS = observeFlags(sample63().map(r => generate(r)));
// widen the band observations with every re-derivation we make, so the sandwich is strict
const allSeen = [];

const HONESTY = []; const Q3ROWS = []; const Q5ROWS = []; const RIDEALONGS = [];

for (const { t, row, rec } of records) {
  let catalog = null;
  runHeadless(row, instrumentedRoot(row._seed).root, { onStep: (n, c) => { if (n === 'assembleInstitutions') catalog = clone(c.catalogForTier); } });
  const held0 = heldOf(rec);
  const r0 = tryRederive(row, held0, OPT);
  if (r0.err) { console.log(`⛔ ${t}: R0 THREW ${r0.err}`); continue; }
  const R0 = r0.out;
  allSeen.push(R0);
  const baseD = dangling(rec); const baseDs = baseD.map(x => x.s);
  const baseInv = new Set([...checkExact(rec), ...checkBands(rec, OBS), ...checkFlags(rec, FOBS)]);
  const ctrl = merge(rec, R0, clone(R0), { heldFrom: ARM });
  console.log(`\n######## ${keyOf(row)}   (arm heldFrom='${ARM}')`);
  console.log(`  no-edit control: merge(record,R0,R0)===record ? ${h(ctrl.out) === h(rec)} · baseline dangles=${baseD.length} · baseline invariant violations=${baseInv.size}`);
  console.log(`  R0 vs record: ${Object.keys(rec).filter(k => h(rec[k]) !== h(R0[k])).join(' ') || '(identical)'}`);

  const have = new Set((rec.institutions || []).map(i => i.name));
  let candidate = null;
  for (const [cat, b] of Object.entries(catalog || {})) { for (const [name, def] of Object.entries(b || {})) { if (!have.has(name)) { candidate = { category: cat, name, ...def, source: 'dm', catalogId: `dm_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}` }; break; } } if (candidate) break; }

  const trials = [];
  { const draft = clone(rec); const old = draft.npcs[1].name; applyNpcRenameToSettlement(draft, old, 'Aldhelm Prüfstein');
    trials.push({ n: 1, label: 'rename NPC (cascade)', row2: row, H: heldOf(draft), recEdited: draft, stick: (o) => `renamed present=${(o.npcs || []).some(n => n.name === 'Aldhelm Prüfstein')}` }); }
  { const H = clone(held0); const id = H.npcs[1].id; H.npcs[1].role = 'Harbourmaster';
    trials.push({ n: 2, label: 'change NPC role', row2: row, H, stick: (o) => `role="${o.npcs?.[1]?.role}" mirror=${JSON.stringify((o.factions || []).flatMap(f => (f.members || []).filter(m => m.id === id).map(m => m.role)))}` }); }
  { const H = clone(held0); if (candidate) H.institutions.push(clone(candidate));
    trials.push({ n: 3, label: `add institution`, row2: row, H, stick: (o) => `${rec.institutions.length}→${o.institutions.length} present=${(o.institutions || []).some(i => i.name === candidate?.name)}` }); }
  { const H = clone(held0); const gone = H.institutions.splice(1, 1)[0];
    trials.push({ n: 4, label: `remove institution`, row2: row, H, stick: (o) => `${rec.institutions.length}→${o.institutions.length} "${gone?.name}" absent=${!(o.institutions || []).some(i => i.name === gone?.name)}` }); }
  { const H = clone(held0); const f = H.powerStructure.factions[1]; const want = Math.max(1, Math.round((f.power || 20) * 0.5)); f.power = want;
    trials.push({ n: 5, label: 'change power share', row2: row, H, stick: (o) => `wanted ${want} got ${o.powerStructure?.factions?.[1]?.power}` }); }
  { const H = clone(held0); const fs = H.powerStructure.factions || []; const cur = fs.findIndex(f => f.isGoverning); const nx = fs.findIndex((f, i) => i !== cur);
    fs.forEach((f, i) => { f.isGoverning = i === nx; }); const want = fs[nx].faction || fs[nx].name; H.powerStructure.governingName = want;
    trials.push({ n: 6, label: 'seat a new faction', row2: row, H, stick: (o) => `wanted "${want}" got "${o.powerStructure?.governingName}"` }); }
  trials.push({ n: 7, label: 'terrain → desert', row2: { ...row, terrainOverride: 'desert' }, H: clone(held0), stick: (o) => `terrain=${o.config?.terrainOverride}` });
  trials.push({ n: 8, label: 'culture → norse', row2: { ...row, culture: 'norse' }, H: clone(held0), stick: (o) => `culture=${o.config?.culture}` });

  for (const tr of trials) {
    const recEdited = tr.recEdited || (() => { const c = clone(rec); for (const k of HELD_KEYS) c[k] = clone(tr.H[k]); return c; })();
    const edited = HELD_KEYS.filter(k => h(tr.H[k]) !== h(held0[k]));
    const worldEdit = h(tr.row2) !== h(row);
    const rr = tryRederive(tr.row2, tr.H, OPT);
    if (rr.err) { console.log(`   ${String(tr.n)} ${tr.label.padEnd(24)} ⛔ THREW ${rr.err.slice(0, 80)}`); continue; }
    const R1 = rr.out; allSeen.push(R1);
    const { out: M, stats } = merge(recEdited, R0, R1, { heldFrom: ARM });

    // which keys moved, merged vs the EDITED record
    const moved = [];
    for (const k of new Set([...Object.keys(recEdited), ...Object.keys(M)])) {
      if (h(recEdited[k]) === h(M[k])) continue;
      const d = pathDiff(recEdited[k], M[k]);
      moved.push([k, d.added.length + d.changed.length + d.removed.length]);
    }
    moved.sort((a, b) => b[1] - a[1]);
    const movedHeld = moved.filter(([k]) => HELD_KEYS.includes(k) && !edited.includes(k));
    // FLICKER at the source: does the SEAM move an unedited held fact in R1?
    const flickR1 = HELD_KEYS.filter(k => !edited.includes(k) && h(R1[k]) !== h(tr.H[k]))
      .map(k => `${k}:${(() => { const d = pathDiff(tr.H[k], R1[k]); return d.added.length + d.changed.length + d.removed.length; })()}`);
    // dangling delta BY KIND
    const nd = dangling(M).filter(x => !baseDs.includes(x.s));
    const byKind = new Map(); for (const x of nd) byKind.set(x.pattern, (byKind.get(x.pattern) || 0) + 1);
    // invariants, as a DELTA against the record's own — split into THE EDIT'S OWN (already true
    // of the edited record before any merge) and THE MERGE'S (introduced by mixing R1 into it)
    const editInvSet = new Set([...checkExact(recEdited), ...checkBands(recEdited, OBS), ...checkFlags(recEdited, FOBS)].filter(x => !baseInv.has(x)));
    const r1InvSet = new Set([...checkExact(R1), ...checkBands(R1, OBS), ...checkFlags(R1, FOBS)].filter(x => !baseInv.has(x)));
    const invAll = [...checkExact(M), ...checkBands(M, OBS), ...checkFlags(M, FOBS)].filter(x => !baseInv.has(x));
    const inv = invAll.filter(x => !editInvSet.has(x));
    const invEdit = invAll.filter(x => editInvSet.has(x));
    // ⭐ Q5's structural instrument: an object whose children MIX a leaf taken from R1 with a
    // sibling KEPT from the record where the record already differed from R0 (a stale leaf
    // sitting beside a freshly derived one).
    const par = (x) => String(x).replace(/\.[^.]*$/, '').replace(/\[\d+\]$/, '');
    const takenPar = new Set(stats.takenR1.map(par));
    const mixed = [...new Set(stats.settled.map(par))].filter(x => takenPar.has(x));
    // honesty cost
    const ride = stats.ridealong;
    HONESTY.push({ t, n: tr.n, label: tr.label, taken: stats.takenR1.length, ride: ride.length });
    RIDEALONGS.push(...ride.map(x => ({ t, n: tr.n, label: tr.label, ...x })));
    Q3ROWS.push({ t, n: tr.n, label: tr.label, moved, movedHeld, flickR1, nd: nd.length, byKind, inv, invEdit, mixed, reorder: stats.reorder });

    console.log(`   ${tr.n} ${tr.label.padEnd(24)} ok   moved: ${moved.map(([k, n]) => `${k}:${n}`).join(' ').slice(0, 110)}`);
    console.log(`     ${''.padEnd(24)}      heldMovedInMerge=${movedHeld.length ? movedHeld.map(([k, n]) => `${k}:${n}`).join(',') : 'NONE'} · flickerInR1=${flickR1.length ? flickR1.join(',') : 'NONE'} · newDangles=${nd.length}${nd.length ? ` [${[...byKind.entries()].map(([p, c]) => `${p}×${c}`).join(' ')}]` : ''}`);
    console.log(`     ${''.padEnd(24)}      NEW violations — the MERGE's=${inv.length}${inv.length ? ` ⛔ ${inv.slice(0, 2).join(' | ')}` : ''} · the EDIT's own=${invEdit.length}${invEdit.length ? ` ⛔ ${invEdit.slice(0, 2).join(' | ')}` : ''} · R1's own=${r1InvSet.size}`);
    console.log(`     ${''.padEnd(24)}      reordered collections=${stats.reorder.length ? [...new Set(stats.reorder)].join(',') : 'none'} · ⭐ MIXED objects (a stale record leaf beside an R1 leaf)=${mixed.length}${mixed.length ? ` [${mixed.slice(0, 4).join(' ')}]` : ''}`);
    if (movedHeld.length) { for (const [k] of movedHeld) { const d = pathDiff(recEdited[k], M[k]); console.log(`     ${''.padEnd(24)}      heldMoved ${k}: ${[...d.added, ...d.changed, ...d.removed].join(' ')}`); } }
    console.log(`     ${''.padEnd(24)}      HONESTY: leaves taking R1=${stats.takenR1.length}, of which the record ALREADY differed from R0=${ride.length} (${stats.takenR1.length ? Math.round(100 * ride.length / stats.takenR1.length) : 0}%) · ${tr.stick ? tr.stick(M) : ''} · name ${M.name === rec.name ? 'KEPT' : `⛔ ${rec.name}→${M.name}`}`);
  }
}

console.log(`\n\n======== Q5 — MIXED objects (a record leaf the re-derivation disagrees with, beside an R1 leaf) ========`);
const mixCount = new Map();
for (const r of Q3ROWS) for (const m of r.mixed) mixCount.set(m, (mixCount.get(m) || 0) + 1);
console.log(`distinct mixed object paths across the 32 trials: ${mixCount.size}`);
for (const [p, n] of [...mixCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30)) console.log(`   ${p.padEnd(62)} trials=${n}`);
console.log(`\n======== Q5 — NEW invariant violations, attributed ========`);
for (const r of Q3ROWS) if (r.inv.length || r.invEdit.length) console.log(`   ${r.t.padEnd(11)} #${r.n} ${r.label.padEnd(22)} merge=${JSON.stringify(r.inv)} edit=${JSON.stringify(r.invEdit)}`);
console.log(`\n======== Q3 — reordered collections (an untouched reading whose ORDER moved) ========`);
for (const r of Q3ROWS) if (r.reorder.length) console.log(`   ${r.t.padEnd(11)} #${r.n} ${r.label.padEnd(22)} ${[...new Set(r.reorder)].join(' ')}`);

console.log(`\n\n======== Q4 — THE HONESTY COST, by edit × tier ========`);
console.log('edit'.padEnd(26) + TIERS.map(t => t.slice(0, 10).padEnd(20)).join(''));
for (const n of [1, 2, 3, 4, 5, 6, 7, 8]) {
  const lbl = HONESTY.find(x => x.n === n)?.label || `#${n}`;
  console.log(`${n} ${lbl}`.padEnd(26) + TIERS.map(t => {
    const e = HONESTY.find(x => x.n === n && x.t === t);
    return (e ? `${e.ride}/${e.taken} (${e.taken ? Math.round(100 * e.ride / e.taken) : 0}%)` : '-').padEnd(20);
  }).join(''));
}
const totT = HONESTY.reduce((a, x) => a + x.taken, 0); const totR = HONESTY.reduce((a, x) => a + x.ride, 0);
console.log(`TOTAL`.padEnd(26) + `${totR}/${totT} leaves (${Math.round(100 * totR / totT)}% of every leaf the merge took from R1 was a leaf the record already disagreed with R0 about)`);

console.log(`\n======== Q4 — the ride-along leaves that a DM can SEE (label/score/summary/count paths) ========`);
const VISIBLE = /label|score|prosperity|summary|status|severity|readiness|band|verdict|viable|deficitPercent|name|desc/i;
const vis = RIDEALONGS.filter(x => VISIBLE.test(x.path));
const grouped = new Map();
for (const x of vis) { const k = `${x.t}|${x.n}|${x.path}`; if (!grouped.has(k)) grouped.set(k, x); }
console.log(`ride-along leaves total=${RIDEALONGS.length}, of which DM-visible by path=${vis.length}, distinct=${grouped.size}`);
for (const x of [...grouped.values()].slice(0, 40)) {
  console.log(`  ${x.t.padEnd(11)} #${x.n} ${x.label.padEnd(22)} ${x.path.slice(0, 54).padEnd(56)} record=${JSON.stringify(x.rec)?.slice(0, 26)} R0=${JSON.stringify(x.r0)?.slice(0, 26)} R1=${JSON.stringify(x.r1)?.slice(0, 26)}`);
}
