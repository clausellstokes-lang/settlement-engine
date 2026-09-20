/**
 * P4 — CRITERION 2: THE EIGHT EDITS, on a VILLAGE, a TOWN and a CITY, through the whole §22 seam.
 *
 * Every diff is against the SAME ROW'S NO-EDIT CONTROL (not against the record), so the settling
 * shift P3 measured is factored out and what is left is attributable to the edit.
 *
 * usage: node --import ./hook3.mjs p4-edits.mjs
 */
import { h, clone, pathDiff, fmtTally, keyOf, sample63 } from './lib.mjs';
import { rederive, tryRederive, generate, heldOf, HELD_KEYS } from './seam.mjs';
import { instrumentedRoot, runHeadless, TREE } from './instrument.mjs';

const { applyNpcRenameToSettlement } = await import(`${TREE}/src/domain/factionRename.js`);

const OPTS = { nameMode: 'consume', relink: false };
const OPTS_RELINK = { nameMode: 'consume', relink: true };

// ── the X5 exact-join graph (the first recon's) ──────────────────────────────
const JOINS = [
  ['relationships[].npc1Name', 'npc'], ['relationships[].npc2Name', 'npc'],
  ['relationships[].npc1Id', 'npc'], ['relationships[].npc2Id', 'npc'],
  ['factions[].members[].name', 'npc'], ['factions[].members[].id', 'npc'],
  ['prominentRelationship.npc1', 'npc'], ['prominentRelationship.npc2', 'npc'],
  ['npcs[].factionAffiliation', 'powerFaction'],
  ['factions[].members[].factionAffiliation', 'powerFaction'],
  ['factions[].powerFactionName', 'powerFaction'],
  ['powerStructure.governingName', 'powerFaction'], ['powerStructure.government', 'powerFaction'],
  ['powerStructure.factionRelationships[].pair[]', 'powerFaction'],
  ['history.currentTensions[].factions[]', 'powerFaction'],
  ['npcs[].institution', 'institution'],
  ['npcs[].secondaryAffiliation', 'institution|powerFaction'],
  ['npcs[].corruptTies.criminalInstitution', 'institution'],
  ['availableServices.*[].institution', 'institution'],
  ['economicState.activeChains[].processingInstitutions[]', 'institution'],
  ['economicState.tradeDependencies[].institution', 'institution'],
  ['resourceAnalysis.gaps[].institution', 'institution'],
  ['spatialLayout.quarters[].landmarks[]', 'institution'],
  ['defenseProfile.institutions.*[].name', 'institution'],
  ['conflicts[].parties[]', 'npcFactionGroup'],
  ['powerStructure.conflicts[].parties[]', 'npcFactionGroup'],
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
    const next = p === '' ? v : v[p];
    if (next === undefined) return;
    if (arr) { if (Array.isArray(next)) for (const x of next) w(x, i + 1); return; }
    w(next, i + 1);
  })(root, 0);
  return out;
}
function dangling(rec) {
  const T = tokensOf(rec); const bad = [];
  for (const [pattern, kinds] of JOINS) {
    for (const v of valuesAt(rec, pattern)) {
      const key = pattern.endsWith('Id') || pattern.endsWith('.id') ? 'id' : 'name';
      if (!kinds.split('|').some(k => T[k]?.[key]?.has(v))) bad.push(`${pattern}="${v}"`);
    }
  }
  return bad;
}

const ROWS = ['village', 'town', 'city'].map(t => sample63().find(r => r.settType === t));

for (const row of ROWS) {
  console.log(`\n${'='.repeat(104)}\n=== ${keyOf(row)} ===`);
  let catalog = null;
  const rec = runHeadless(row, instrumentedRoot(row._seed).root, {
    onStep: (n, c) => { if (n === 'assembleInstitutions') catalog = clone(c.catalogForTier); },
  }).settlement;
  const held0 = heldOf(rec);

  const ctrlR = tryRederive(row, held0, OPTS);
  if (ctrlR.err) { console.log(`CONTROL THREW: ${ctrlR.err}`); continue; }
  const ctrl = ctrlR.out;
  const ctrlDiff = [];
  for (const k of new Set([...Object.keys(rec), ...Object.keys(ctrl)])) if (h(rec[k]) !== h(ctrl[k])) ctrlDiff.push(k);
  console.log(`CONTROL (no edit): reproduces=${h(ctrl) === h(rec)}  keys that settled: ${ctrlDiff.join(',') || 'none'}`);
  const baseDangles = dangling(rec);
  console.log(`baseline dangling refs on the RECORD: ${baseDangles.length}`);

  const have = new Set((rec.institutions || []).map(i => i.name));
  let candidate = null;
  for (const [cat, bucket] of Object.entries(catalog || {})) {
    for (const [name, def] of Object.entries(bucket || {})) {
      if (!have.has(name)) { candidate = { category: cat, name, ...def, source: 'dm', catalogId: `dm_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}` }; break; }
    }
    if (candidate) break;
  }

  const report = (label, out, editedKeys, extra = '') => {
    const moved = [];
    for (const k of new Set([...Object.keys(ctrl), ...Object.keys(out)])) {
      if (h(ctrl[k]) === h(out[k])) continue;
      const d = pathDiff(ctrl[k], out[k]);
      moved.push([k, d.added.length + d.changed.length + d.removed.length, fmtTally([...d.added, ...d.changed, ...d.removed], 4)]);
    }
    moved.sort((a, b) => b[1] - a[1]);
    const flicker = moved.filter(([k]) => HELD_KEYS.includes(k) && !editedKeys.includes(k));
    const newD = dangling(out).filter(x => !baseDangles.includes(x));
    console.log(`\n--- EDIT: ${label}   (held keys edited: ${editedKeys.join(',') || 'none'})`);
    console.log(`    keys moved (${moved.length}): ${moved.map(([k, n]) => `${k}:${n}`).join(' ')}`);
    console.log(`    FLICKER (unedited HELD fact moved): ${flicker.length ? flicker.map(([k, n, s]) => `${k}:${n} [${s}]`).join(' ; ') : 'NONE'}`);
    console.log(`    NEW dangling refs (Δ vs the record): ${newD.length}${newD.length ? ` — ${[...new Set(newD)].slice(0, 6).join(' , ')}` : ''}`);
    console.log(`    name: "${rec.name}" → "${out.name}"  ${rec.name === out.name ? '(KEPT)' : '⛔ CHANGED'}`);
    if (extra) console.log(`    ${extra}`);
    for (const [k, n, s] of moved.slice(0, 6)) console.log(`      ${k.padEnd(26)} ${String(n).padStart(5)}  ${s}`);
  };

  // 1. RENAME through the cascade, then re-derive with the cascaded facts held (ruling 7).
  {
    const NEW = 'Aldhelm Prüfstein';
    const draft = clone(rec);
    const old = draft.npcs[1].name;
    const res = applyNpcRenameToSettlement(draft, old, NEW);
    const H = heldOf(draft);
    const edited = HELD_KEYS.filter(k => h(H[k]) !== h(held0[k]));
    const rr = tryRederive(row, H, OPTS);
    if (rr.err) console.log(`\n--- EDIT: rename an NPC (cascade → re-derive)\n    ⛔ THREW: ${rr.err}`);
    else report(`rename an NPC via applyNpcRenameToSettlement ("${old}" → "${NEW}"; cascade touched ${res.touched.length}: ${res.touched.join(', ')})`, rr.out, edited,
      `renamed npc present in the output: ${(rr.out.npcs || []).some(n => n.name === NEW)}`);
    // the same edit with the member mirror RE-LINKED instead of held
    const rr2 = tryRederive(row, H, OPTS_RELINK);
    if (!rr2.err) {
      const same = h(rr2.out) === h(rr.err ? {} : rr.out);
      console.log(`    [relink=true variant: identical to relink=false? ${same}]`);
    }
  }

  // 2. role, 3. add institution, 4. remove institution, 5. power share, 6. seat
  const EDITS = [
    ['change an NPC\'s role', (H) => { H.npcs[1].role = 'Harbourmaster'; }, (out, H) => `role on npcs[1]: "${out.npcs?.[1]?.role}"  |  member mirror still says: ${JSON.stringify((out.factions || []).flatMap(f => (f.members || []).filter(m => m.id === H.npcs[1].id).map(m => m.role)))}`],
    ['add an institution from the tier catalogue', (H) => { if (candidate) H.institutions.push(clone(candidate)); }, (out) => `institutions ${rec.institutions.length} → ${out.institutions.length}`],
    ['remove an institution', (H) => { H.institutions.splice(1, 1); }, (out) => `institutions ${rec.institutions.length} → ${out.institutions.length}`],
    ['change one faction\'s power share', (H) => { const f = H.powerStructure.factions[1]; if (f) { H.__wanted = Math.max(1, Math.round((f.power || 20) * 0.5)); f.power = H.__wanted; } },
      (out, H) => `wanted power=${H.__wanted} on "${H.powerStructure.factions[1]?.faction}"; got ${out.powerStructure?.factions?.[1]?.power} — STICKS=${out.powerStructure?.factions?.[1]?.power === H.__wanted}`],
    ['seat a different governing faction', (H) => {
      const fs = H.powerStructure.factions || [];
      const cur = fs.findIndex(f => f.isGoverning);
      const next = fs.findIndex((f, i) => i !== cur);
      if (next >= 0) { fs.forEach((f, i) => { f.isGoverning = i === next; }); H.powerStructure.governingName = fs[next].faction || fs[next].name; H.__seat = H.powerStructure.governingName; }
    }, (out, H) => `wanted seat "${H.__seat}"; got governingName="${out.powerStructure?.governingName}" — STICKS=${out.powerStructure?.governingName === H.__seat}`],
  ];
  for (const [label, apply, note] of EDITS) {
    const H = clone(held0);
    apply(H);
    const edited = HELD_KEYS.filter(k => h(H[k]) !== h(held0[k]));
    const { __wanted, __seat, ...bag } = H;
    const rr = tryRederive(row, bag, OPTS);
    if (rr.err) { console.log(`\n--- EDIT: ${label}   (held keys edited: ${edited.join(',')})\n    ⛔ THREW: ${rr.err}`); continue; }
    report(label, rr.out, edited, note ? note(rr.out, H) : '');
  }

  // 7, 8. world facts
  for (const [label, mut] of [['world fact: terrain → desert', r => ({ ...r, terrainOverride: 'desert' })], ['world fact: culture → norse', r => ({ ...r, culture: 'norse' })]]) {
    const rr = tryRederive(mut(row), held0, OPTS);
    if (rr.err) { console.log(`\n--- EDIT: ${label}\n    ⛔ THREW: ${rr.err}`); continue; }
    report(label, rr.out, [], `config.terrainOverride=${rr.out.config?.terrainOverride} culture=${rr.out.config?.culture}`);
  }
}
