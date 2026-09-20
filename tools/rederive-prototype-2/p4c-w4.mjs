/**
 * P4.c — the eight edits AGAIN, on the seam that actually reproduces (W4: last-writer
 * placement + ruling 8's trace partition + the mirror re-linked). Criterion 2 must hold on the
 * seam criterion 1 holds on, or the two criteria are being met by different machines.
 *
 * usage: node --import ./hook3.mjs p4c-w4.mjs
 */
import { h, clone, pathDiff, fmtTally, keyOf, sample63 } from './lib.mjs';
import { generate, heldOf, tryRederive, HELD_KEYS } from './seam.mjs';
import { instrumentedRoot, runHeadless, TREE } from './instrument.mjs';

const { applyNpcRenameToSettlement } = await import(`${TREE}/src/domain/factionRename.js`);
const H2 = ['generatePopulation', 'generatePower', 'corruptionPass', 'assembleInstitutions',
  'subsumptionPass', 'cascadePass', 'isolationPass', 'factionCorrelationPass', 'coherenceRepairPass'];

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
    let p = parts[i]; const arr = p.endsWith('[]'); if (arr) p = p.slice(0, -2);
    if (p === '*') { for (const val of Object.values(v)) { const t = arr ? (Array.isArray(val) ? val : []) : [val]; for (const x of t) w(x, i + 1); } return; }
    const next = p === '' ? v : v[p]; if (next === undefined) return;
    if (arr) { if (Array.isArray(next)) for (const x of next) w(x, i + 1); return; }
    w(next, i + 1);
  })(root, 0);
  return out;
}
const dangling = (rec) => {
  const T = tokensOf(rec); const bad = [];
  for (const [pattern, kinds] of JOINS) for (const v of valuesAt(rec, pattern)) {
    const key = pattern.endsWith('Id') || pattern.endsWith('.id') ? 'id' : 'name';
    if (!kinds.split('|').some(k => T[k]?.[key]?.has(v))) bad.push(`${pattern}="${v}"`);
  }
  return bad;
};

console.log('=== P4.c — the eight edits on the W4 seam (placement=last, relink=true, ruling-8 trace) ===');
console.log('row      edit                       threw  keys moved  FLICKER            newDangles  name kept  edit STICKS');
for (const t of ['village', 'town', 'city']) {
  const row = sample63().find(r => r.settType === t);
  let catalog = null;
  const rec = runHeadless(row, instrumentedRoot(row._seed).root, {
    onStep: (n, c) => { if (n === 'assembleInstitutions') catalog = clone(c.catalogForTier); },
  }).settlement;
  const held0 = heldOf(rec);
  const OPT = { nameMode: 'consume', relink: true, placement: 'last', tracePartition: rec, heldStepsForTrace: H2 };
  const ctrl = tryRederive(row, held0, OPT);
  const baseD = dangling(rec);
  console.log(`\n-- ${keyOf(row)}  control reproduces=${!ctrl.err && h(ctrl.out) === h(rec)}  baseline dangles=${baseD.length}`);
  const have = new Set((rec.institutions || []).map(i => i.name));
  let candidate = null;
  for (const [cat, b] of Object.entries(catalog || {})) { for (const [name, def] of Object.entries(b || {})) { if (!have.has(name)) { candidate = { category: cat, name, ...def, source: 'dm', catalogId: `dm_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}` }; break; } } if (candidate) break; }

  const run = (label, row2, H, stick) => {
    const edited = HELD_KEYS.filter(k => h(H[k]) !== h(held0[k]));
    const rr = tryRederive(row2, H, OPT);
    if (rr.err) { console.log(`   ${label.padEnd(28)} ⛔ THREW ${rr.err.slice(0, 70)}`); return; }
    const out = rr.out;
    const moved = [];
    for (const k of new Set([...Object.keys(ctrl.out), ...Object.keys(out)])) {
      if (h(ctrl.out[k]) === h(out[k])) continue;
      const d = pathDiff(ctrl.out[k], out[k]);
      moved.push([k, d.added.length + d.changed.length + d.removed.length]);
    }
    moved.sort((a, b) => b[1] - a[1]);
    const flick = moved.filter(([k]) => HELD_KEYS.includes(k) && !edited.includes(k));
    const nd = dangling(out).filter(x => !baseD.includes(x));
    console.log(`   ${label.padEnd(28)} no     ${moved.map(([k, n]) => `${k}:${n}`).join(' ').slice(0, 74).padEnd(76)}`);
    console.log(`   ${''.padEnd(28)}        FLICKER=${flick.length ? flick.map(([k, n]) => `${k}:${n}`).join(',') : 'NONE'} · newDangles=${nd.length}${nd.length ? ` (${[...new Set(nd)].slice(0, 3).join(' ; ')})` : ''} · name ${out.name === rec.name ? 'KEPT' : `⛔ ${rec.name}→${out.name}`}${stick ? ` · ${stick(out)}` : ''}`);
  };

  { const draft = clone(rec); const old = draft.npcs[1].name; applyNpcRenameToSettlement(draft, old, 'Aldhelm Prüfstein');
    run('1 rename NPC (cascade)', row, heldOf(draft), (o) => `renamed present=${(o.npcs || []).some(n => n.name === 'Aldhelm Prüfstein')}`); }
  { const H = clone(held0); const id = H.npcs[1].id; H.npcs[1].role = 'Harbourmaster';
    run('2 change NPC role', row, H, (o) => `role="${o.npcs?.[1]?.role}" mirror=${JSON.stringify((o.factions || []).flatMap(f => (f.members || []).filter(m => m.id === id).map(m => m.role)))}`); }
  { const H = clone(held0); if (candidate) H.institutions.push(clone(candidate));
    run('3 add institution', row, H, (o) => `institutions ${rec.institutions.length}→${o.institutions.length} · present=${(o.institutions || []).some(i => i.name === candidate?.name)}`); }
  { const H = clone(held0); const gone = H.institutions.splice(1, 1)[0];
    run('4 remove institution', row, H, (o) => `institutions ${rec.institutions.length}→${o.institutions.length} · "${gone?.name}" absent=${!(o.institutions || []).some(i => i.name === gone?.name)}`); }
  { const H = clone(held0); const f = H.powerStructure.factions[1]; const want = Math.max(1, Math.round((f.power || 20) * 0.5)); f.power = want;
    run('5 change power share', row, H, (o) => `wanted ${want} got ${o.powerStructure?.factions?.[1]?.power} STICKS=${o.powerStructure?.factions?.[1]?.power === want}`); }
  { const H = clone(held0); const fs = H.powerStructure.factions || []; const cur = fs.findIndex(f => f.isGoverning); const nx = fs.findIndex((f, i) => i !== cur);
    fs.forEach((f, i) => { f.isGoverning = i === nx; }); const want = fs[nx].faction || fs[nx].name; H.powerStructure.governingName = want;
    run('6 seat a new faction', row, H, (o) => `wanted "${want}" got "${o.powerStructure?.governingName}" STICKS=${o.powerStructure?.governingName === want}`); }
  run('7 terrain → desert', { ...row, terrainOverride: 'desert' }, clone(held0), (o) => `terrain=${o.config?.terrainOverride}`);
  run('8 culture → norse', { ...row, culture: 'norse' }, clone(held0), (o) => `culture=${o.config?.culture}`);
}
