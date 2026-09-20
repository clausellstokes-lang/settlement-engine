/** RECON-ID reproductions: what each rename leaves stale, on REAL pipeline data. */
import { runHeadless, instrumentedRoot, TREE } from './instrument.mjs';
import { goldenCorpus, keyOf } from './lib.mjs';
const { applyFactionRenameToSettlement, applyNpcRenameToSettlement,
        FACTION_RENAME_SURFACES, NPC_RENAME_SURFACES,
        NON_CASCADED_SURFACES, NPC_NON_CASCADED_SURFACES } = await import(`${TREE}/src/domain/factionRename.js`);
const { anchorForInstitution } = await import(`${TREE}/src/domain/townMap/anchors.js`);

function paths(root, pred, maxDepth = 25) {
  const hits = []; const stack = [[root, '', 0]];
  while (stack.length) {
    const [v, p, d] = stack.pop();
    if (d > maxDepth || v == null) continue;
    if (typeof v === 'string') { if (pred(v)) hits.push(p); continue; }
    if (typeof v !== 'object') continue;
    if (Array.isArray(v)) { for (const x of v) stack.push([x, `${p}[]`, d + 1]); continue; }
    for (const k of Object.keys(v)) stack.push([v[k], p ? `${p}.${k}` : k, d + 1]);
  }
  return hits;
}
const tally = (ps) => { const m = new Map(); for (const p of ps) m.set(p, (m.get(p)||0)+1); return [...m].sort((a,b)=>b[1]-a[1]); };
const RT = (o) => JSON.parse(JSON.stringify(o));   // the save -> load round trip: splits aliases

// pick a rich town row
const ALL = goldenCorpus();
const row = ALL.find(r => r.settType === 'city') || ALL[200];
const { root } = instrumentedRoot(row._seed ?? keyOf(row));
const base = (await runHeadless(row, root)).settlement;
console.log('### ROW', keyOf(row), 'tier', base.tier, 'name', base.name);
console.log('    npcs', base.npcs.length, 'institutions', base.institutions.length,
            'powerFactions', base.powerStructure.factions.length, 'groupingFactions', base.factions.length);

const surf = new Set([...FACTION_RENAME_SURFACES, ...NPC_RENAME_SURFACES].map(s=>s.path));
const nonCasc = new Set([...NON_CASCADED_SURFACES, ...NPC_NON_CASCADED_SURFACES].map(s=>s.path));

function report(label, before, after, oldName) {
  const stale = tally(paths(after, v => v.trim() === oldName));
  console.log(`\n--- ${label}: "${oldName}"`);
  const preCount = paths(before, v => v.trim() === oldName).length;
  console.log(`    exact-name handles BEFORE: ${preCount}; STALE AFTER: ${stale.reduce((a,[,n])=>a+n,0)}`);
  for (const [p, n] of stale) {
    const onList = surf.has(p) ? 'ON-CASCADE(missed!)' : nonCasc.has(p) ? 'declared-non-cascaded' : '⛔ NOT ON ANY LIST';
    console.log(`      ${String(n).padStart(4)}  ${p}   [${onList}]`);
  }
  return stale;
}

// ===== A. FACTION RENAME =====
{
  const s = RT(base);
  const f = s.powerStructure.factions[0];
  const oldName = f.faction || f.name;
  const before = RT(s);
  const r = applyFactionRenameToSettlement(s, oldName, 'ZZQQ Renamed Faction');
  console.log('\n=== A. FACTION RENAME (the existing cascade) ===  changed=', r.changed, 'touched=', r.touched.length);
  report('faction', before, s, oldName);
}

// ===== B. NPC RENAME =====
{
  const s = RT(base);
  const n0 = s.npcs.find(n => s.relationships.some(r => r.npc1Name === n.name || r.npc2Name === n.name)) || s.npcs[0];
  const oldName = n0.name;
  const before = RT(s);
  const r = applyNpcRenameToSettlement(s, oldName, 'ZZQQ Renamed Person');
  console.log('\n=== B. NPC RENAME (the existing cascade) ===  changed=', r.changed, 'touched=', r.touched.length);
  report('npc', before, s, oldName);
}

// ===== C. INSTITUTION RENAME — NO WRITER EXISTS =====
{
  const s = RT(base);
  // choose the institution with the MOST stored references
  let best = null;
  for (const inst of s.institutions) {
    const n = paths(s, v => v.trim() === inst.name).length;
    if (!best || n > best.n) best = { inst, n };
  }
  const oldName = best.inst.name;
  const before = RT(s);
  // the ONLY thing a DM edit / the editor's merge-by-name can do today:
  for (const inst of s.institutions) if (inst.name === oldName) inst.name = 'ZZQQ Renamed Hall';
  console.log('\n=== C. INSTITUTION RENAME (there is NO cascade in src) ===');
  console.log(`    chosen: "${oldName}"  (anchor ${anchorForInstitution(best.inst)}, source ${best.inst.source})`);
  report('institution', before, s, oldName);
}
