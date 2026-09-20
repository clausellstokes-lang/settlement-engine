/**
 * X6 — the root-edit experiments (the design's actual promise), run through the best seam X3
 * found (early pins + the pin consulted inside `enrichNpcCoherence`), extended to the whole
 * HELD set with an `onStep` restore at every producer — the scratch stand-in for "this producer
 * consults the pin", since `generatePopulation` is the only step that consults `ctx.__pins`.
 *
 * For each single edit: which record keys move and by how many leaf paths; whether any UNEDITED
 * HELD fact moved (FLICKER); whether any exact join from X5's graph now dangles.
 *
 * usage: node --import ./hook2.mjs x6-edits.mjs
 */
import { instrumentedRoot, runHeadless, getStepOrder, getStepMeta } from './instrument.mjs';
import { h, clone, pathDiff, fmtTally, keyOf, sample63 } from './lib.mjs';

const order = getStepOrder();
const META = getStepMeta();
const HELD = ['npcs', 'relationships', 'factions', 'conflicts', 'institutions', 'powerStructure', 'history'];
const CH = ['npcs', 'relationships', 'factions', 'conflicts'];
// ⛔ `assembleSettlement` is excluded from the restore placements: it is the TERMINAL step that
// BUILDS the record, so a restore after it lands on a ctx nobody reads. That exclusion is itself
// the measurement — `powerStructure`'s last pre-assembly producer is `powerEconomyReconcilePass`,
// and the assembly then mutates the structure with no seam in between.
const PRODUCERS = Object.fromEntries(HELD.map(k => [k,
  order.filter(s => s !== 'assembleSettlement').filter(s => { const m = META.find(x => x.name === s); return m.provides.includes(k) || m.mutates.includes(k); })]));

/**
 * The seam: pins for the four choosers + the enrichment behind the pin + an `onStep` restore.
 * `where` = 'every' (after every producing step) or 'last' (after the LAST producer only —
 * X7's measured placement).
 */
function rederive(row, held, where = 'last') {
  const at = Object.fromEntries(HELD.map(k => [k, where === 'every' ? PRODUCERS[k] : [PRODUCERS[k][PRODUCERS[k].length - 1]]]));
  globalThis.__FN_OVERRIDE__ = { enrichNpcCoherence: () => clone(held.npcs) };
  try {
    return runHeadless(row, instrumentedRoot(row._seed).root, {
      pins: Object.fromEntries(CH.map(k => [k, clone(held[k])])),
      onStep: (name, ctx) => { for (const k of HELD) if (at[k].includes(name)) ctx[k] = clone(held[k]); },
    }).settlement;
  } finally { globalThis.__FN_OVERRIDE__ = null; }
}
const tryRederive = (row, held, where) => { try { return { out: rederive(row, held, where) }; } catch (e) { return { err: e.message }; } };

/** The X5 exact-join graph, as paths to check for dangling references. */
const JOINS = [
  ['relationships[].npc1Name', 'npc', 'name'], ['relationships[].npc2Name', 'npc', 'name'],
  ['relationships[].npc1Id', 'npc', 'id'], ['relationships[].npc2Id', 'npc', 'id'],
  ['factions[].members[].name', 'npc', 'name'], ['factions[].members[].id', 'npc', 'id'],
  ['prominentRelationship.npc1', 'npc', 'name'], ['prominentRelationship.npc2', 'npc', 'name'],
  ['npcs[].factionAffiliation', 'powerFaction', 'name'],
  ['factions[].members[].factionAffiliation', 'powerFaction', 'name'],
  ['factions[].powerFactionName', 'powerFaction', 'name'],
  ['powerStructure.governingName', 'powerFaction', 'name'],
  ['powerStructure.government', 'powerFaction', 'name'],
  ['powerStructure.factionRelationships[].pair[]', 'powerFaction', 'name'],
  ['history.currentTensions[].factions[]', 'powerFaction', 'name'],
  ['npcs[].institution', 'institution', 'name'],
  ['npcs[].secondaryAffiliation', 'institution|powerFaction', 'name'],
  ['npcs[].corruptTies.criminalInstitution', 'institution', 'name'],
  ['availableServices.*[].institution', 'institution', 'name'],
  ['economicState.activeChains[].processingInstitutions[]', 'institution', 'name'],
  ['economicState.tradeDependencies[].institution', 'institution', 'name'],
  ['resourceAnalysis.gaps[].institution', 'institution', 'name'],
  ['spatialLayout.quarters[].landmarks[]', 'institution', 'name'],
  ['defenseProfile.institutions.*[].name', 'institution', 'name'],
  ['conflicts[].parties[]', 'npcFactionGroup', 'name'],
  ['powerStructure.conflicts[].parties[]', 'npcFactionGroup', 'name'],
];

function tokensOf(rec) {
  return {
    npc: { name: new Set((rec.npcs || []).map(n => n?.name).filter(Boolean)), id: new Set((rec.npcs || []).map(n => String(n?.id)).filter(Boolean)) },
    powerFaction: { name: new Set((rec.powerStructure?.factions || []).flatMap(f => [f?.faction, f?.name]).filter(Boolean)) },
    npcFactionGroup: { name: new Set((rec.factions || []).flatMap(f => [f?.name, f?.faction]).filter(Boolean)) },
    institution: { name: new Set((rec.institutions || []).map(i => i?.name).filter(Boolean)) },
  };
}

function valuesAt(root, pattern) {
  const out = [];
  const parts = pattern.split('.');
  (function w(v, i) {
    if (v === undefined || v === null) return;
    if (i >= parts.length) { if (typeof v === 'string') out.push(v); return; }
    let p = parts[i];
    const arr = p.endsWith('[]'); if (arr) p = p.slice(0, -2);
    if (p === '*') { for (const val of Object.values(v)) { const t = arr ? (Array.isArray(val) ? val : []) : [val]; for (const x of t) w(x, i + 1); } return; }
    const next = p === '' ? v : v[p];
    if (next === undefined) return;
    if (arr) { if (Array.isArray(next)) for (const x of next) w(x, i + 1); return; }
    w(next, i + 1);
  })(root, 0);
  return out;
}

function dangling(rec) {
  const T = tokensOf(rec);
  const bad = [];
  for (const [pattern, kinds] of JOINS) {
    const vals = valuesAt(rec, pattern);
    for (const v of vals) {
      const ok = kinds.split('|').some(kind => {
        const key = pattern.endsWith('Id') || pattern.endsWith('.id') ? 'id' : 'name';
        return T[kind]?.[key]?.has(v);
      });
      if (!ok) bad.push(`${pattern}="${v}"`);
    }
  }
  return bad;
}

const ROWS = [sample63().find(r => r.settType === 'town'), sample63().find(r => r.settType === 'city')];

for (const row of ROWS) {
  console.log(`\n${'='.repeat(100)}\n=== ${keyOf(row)} ===`);
  // baseline + the catalogue the tier offers
  let catalog = null;
  const base = runHeadless(row, instrumentedRoot(row._seed).root, {
    onStep: (n, c) => { if (n === 'assembleInstitutions') catalog = clone(c.catalogForTier); },
  });
  const rec = base.settlement;
  const held0 = Object.fromEntries(HELD.map(k => [k, clone(rec[k])]));

  // ── CONTROL: no edit, both restore placements ─────────────────────────────
  let WHERE = 'last'; let ctrl = null;
  for (const w of ['last', 'every']) {
    const r = tryRederive(row, held0, w);
    if (r.err) { console.log(`CONTROL (no edit, restore=${w}): THREW ${r.err.slice(0, 110)}`); continue; }
    const same = h(r.out) === h(rec);
    const bad = [];
    if (!same) for (const k of new Set([...Object.keys(rec), ...Object.keys(r.out)])) if (h(rec[k]) !== h(r.out[k])) bad.push(k);
    console.log(`CONTROL (no edit, restore=${w}): reproduces=${same}${same ? '' : `  differing keys: ${bad.join(',')}`}`);
    if (!ctrl || (bad.length <= 1 && bad.every(x => x === 'simulationTrace'))) { ctrl = r.out; WHERE = w; }
  }
  if (!ctrl) { console.log('  no usable control — skipping this row'); continue; }
  console.log(`  → edits run with restore=${WHERE}`);
  const baseDangles = dangling(rec);
  console.log(`baseline dangling refs: ${baseDangles.length}  ${baseDangles.length ? `→ ${[...new Set(baseDangles)].slice(0, 14).join(' , ')}` : ''}`);

  // catalogForTier is { <Category>: { <Name>: def } }
  const have = new Set((rec.institutions || []).map(i => i.name));
  let candidate = null;
  for (const [cat, bucket] of Object.entries(catalog || {})) {
    for (const [name, def] of Object.entries(bucket || {})) {
      if (!have.has(name)) { candidate = { category: cat, name, ...def, source: 'dm', catalogId: `dm_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}` }; break; }
    }
    if (candidate) break;
  }
  console.log(`catalogue candidate for the add: ${candidate ? `${candidate.category} / ${candidate.name}` : 'NONE FOUND'}`);

  const EDITS = [
    ['rename an NPC', (H) => { H.npcs[1].name = 'Aldhelm Prüfstein'; }],
    ['change an NPC\'s role', (H) => { H.npcs[1].role = 'Harbourmaster'; }],
    ['remove an institution', (H) => { H.institutions.splice(1, 1); }],
    ['add an institution from the tier catalogue', (H) => { if (candidate) H.institutions.push(clone(candidate)); }],
    ['change one faction\'s power share', (H) => { const f = H.powerStructure.factions[1]; if (f) f.power = Math.max(1, Math.round((f.power || 20) * 0.5)); }],
    ['seat a different governing faction', (H) => {
      const fs = H.powerStructure.factions || [];
      const cur = fs.findIndex(f => f.isGoverning);
      const next = fs.findIndex((f, i) => i !== cur);
      if (next >= 0) { fs.forEach((f, i) => { f.isGoverning = i === next; }); H.powerStructure.governingName = fs[next].faction || fs[next].name; }
    }],
  ];

  for (const [label, apply] of EDITS) {
    const H = clone(held0);
    apply(H);
    const editedKeys = HELD.filter(k => h(H[k]) !== h(held0[k]));
    const rr = tryRederive(row, H, WHERE);
    if (rr.err) { console.log(`\n--- EDIT: ${label}   (held keys edited: ${editedKeys.join(',') || 'none'})\n    ⛔ THREW: ${rr.err}`); continue; }
    const out = rr.out;
    const moved = [];
    for (const k of new Set([...Object.keys(ctrl), ...Object.keys(out)])) {
      if (h(ctrl[k]) === h(out[k])) continue;
      const d = pathDiff(ctrl[k], out[k]);
      moved.push([k, d.added.length + d.changed.length + d.removed.length, fmtTally([...d.added, ...d.changed, ...d.removed], 4)]);
    }
    moved.sort((a, b) => b[1] - a[1]);
    const flicker = moved.filter(([k]) => HELD.includes(k) && !editedKeys.includes(k));
    const dOut = dangling(out); const dBase = dangling(rec);
    const newDangles = dOut.filter(x => !dBase.includes(x));
    console.log(`\n--- EDIT: ${label}   (held keys edited: ${editedKeys.join(',') || 'none'})`);
    console.log(`    record keys moved (${moved.length}): ${moved.map(([k, n]) => `${k}:${n}`).join(' ')}`);
    console.log(`    FLICKER (an unedited HELD fact moved): ${flicker.length ? flicker.map(([k, n, s]) => `${k}:${n} [${s}]`).join(' ; ') : 'NONE'}`);
    console.log(`    NEW dangling refs: ${newDangles.length}${newDangles.length ? ` — ${[...new Set(newDangles)].slice(0, 6).join(' , ')}` : ''}`);
    for (const [k, n, s] of moved.slice(0, 8)) console.log(`      ${k.padEnd(26)} ${String(n).padStart(4)}  ${s}`);
  }

  // ── world facts ───────────────────────────────────────────────────────────
  for (const [label, mut] of [['world fact: terrain → desert', r => ({ ...r, terrainOverride: 'desert' })], ['world fact: culture → norse', r => ({ ...r, culture: 'norse' })]]) {
    const row2 = mut(row);
    const rr = tryRederive(row2, held0, WHERE);
    if (rr.err) { console.log(`\n--- EDIT: ${label}\n    ⛔ THREW: ${rr.err}`); continue; }
    const out = rr.out;
    const moved = [];
    for (const k of new Set([...Object.keys(ctrl), ...Object.keys(out)])) {
      if (h(ctrl[k]) === h(out[k])) continue;
      const d = pathDiff(ctrl[k], out[k]);
      moved.push([k, d.added.length + d.changed.length + d.removed.length, fmtTally([...d.added, ...d.changed, ...d.removed], 4)]);
    }
    moved.sort((a, b) => b[1] - a[1]);
    const flicker = moved.filter(([k]) => HELD.includes(k));
    const newDangles = dangling(out).filter(x => !dangling(rec).includes(x));
    console.log(`\n--- EDIT: ${label}`);
    console.log(`    record keys moved (${moved.length}): ${moved.map(([k, n]) => `${k}:${n}`).join(' ')}`);
    console.log(`    FLICKER (a HELD fact moved): ${flicker.length ? flicker.map(([k, n, s]) => `${k}:${n} [${s}]`).join(' ; ') : 'NONE'}`);
    console.log(`    NEW dangling refs: ${newDangles.length}${newDangles.length ? ` — ${[...new Set(newDangles)].slice(0, 6).join(' , ')}` : ''}`);
    for (const [k, n, s] of moved.slice(0, 10)) console.log(`      ${k.padEnd(26)} ${String(n).padStart(4)}  ${s}`);
  }
}
