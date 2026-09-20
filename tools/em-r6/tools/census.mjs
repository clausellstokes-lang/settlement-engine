/** RECON-ID census: identity keys + the name-handle reverse index, over the corpus. */
import { writeFileSync } from 'node:fs';
import { runHeadless, instrumentedRoot, TREE } from './instrument.mjs';
import { goldenCorpus, keyOf, sample63 } from './lib.mjs';

const OUT = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-em-compile-EM-R6-scratch';
const WHICH = process.argv[2] || '63';
const rows = WHICH === '525' ? goldenCorpus() : sample63();

const { anchorForInstitution } = await import(`${TREE}/src/domain/townMap/anchors.js`);

/** collect every (collapsedPath -> Set of string values) in one walk */
function walkStrings(root, sink, maxDepth = 25) {
  const stack = [[root, '', 0]];
  while (stack.length) {
    const [v, p, d] = stack.pop();
    if (d > maxDepth || v == null) continue;
    if (typeof v === 'string') { sink(p, v); continue; }
    if (typeof v !== 'object') continue;
    if (Array.isArray(v)) { for (const x of v) stack.push([x, `${p}[]`, d + 1]); continue; }
    for (const k of Object.keys(v)) stack.push([v[k], p ? `${p}.${k}` : k, d + 1]);
  }
}

const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1);

// aggregates
const agg = {
  rows: 0,
  npc: { count: 0, idPresent: 0, idPattern: new Map(), dupIdRows: 0, idAbsentRows: 0 },
  inst: { count: 0, idPresent: 0, catalogId: 0, localUid: 0, custom: 0, anchorClass: new Map(), anchorDupRows: 0, byTier: new Map() },
  psFac: { count: 0, keys: new Map(), idPresent: 0, namePresent: 0, factionPresent: 0, dupNameRows: 0 },
  grpFac: { count: 0, keys: new Map(), idPresent: 0 },
  rel: { count: 0, npc1Id: 0, npc2Id: 0, idResolves: 0, idDangles: 0 },
  settlementIdSpelling: new Map(),
  topKeysMissing: new Map(),
  // reverse indexes: collapsedPath -> occurrences where the string EXACTLY equals an entity name
  instNamePaths: new Map(),
  facNamePaths: new Map(),
  npcNamePaths: new Map(),
  // shapes
  conflictKeys: new Map(), condKeys: new Map(), tensionKeys: new Map(), overlayKeys: new Map(),
  npcKeys: new Map(), instKeys: new Map(),
};

const t0 = Date.now();
for (const row of rows) {
  const seed = row._seed ?? keyOf(row);
  const { root } = instrumentedRoot(seed);
  let out;
  try { out = await runHeadless(row, root); } catch (e) { console.error('ROW FAIL', keyOf(row), e.message); continue; }
  const s = out?.settlement ?? out;
  if (!s) continue;
  agg.rows += 1;
  const tier = s.tier || row.settType || '?';

  // settlement id
  const sid = String(s.id ?? '');
  bump(agg.settlementIdSpelling, sid === '' ? '(absent)' : /^[0-9a-f-]{20,}$/i.test(sid) ? 'uuid-like' : /^\d+$/.test(sid) ? 'numeric' : sid.slice(0, 12));

  // NPCs
  const npcs = Array.isArray(s.npcs) ? s.npcs : [];
  const npcIds = [];
  for (const n of npcs) {
    agg.npc.count += 1;
    for (const k of Object.keys(n)) bump(agg.npcKeys, k);
    const id = n?.id;
    if (typeof id === 'string' && id) {
      agg.npc.idPresent += 1; npcIds.push(id);
      bump(agg.npc.idPattern, /^npc_\d+$/.test(id) ? 'npc_<n>' : /^npc\.[a-z0-9_]+_[0-9a-f]+$/.test(id) ? 'npc.<slug>_<hash>' : /^npc\./.test(id) ? 'npc.<other>' : 'OTHER:' + id.slice(0, 16));
    }
  }
  if (npcIds.length !== new Set(npcIds).size) agg.npc.dupIdRows += 1;
  if (npcIds.length !== npcs.length) agg.npc.idAbsentRows += 1;

  // institutions
  const insts = Array.isArray(s.institutions) ? s.institutions : [];
  const anchors = [];
  const tierRec = agg.inst.byTier.get(tier) || { count: 0, cat: 0, uid: 0, name: 0, rows: 0 };
  tierRec.rows += 1;
  for (const i of insts) {
    agg.inst.count += 1; tierRec.count += 1;
    for (const k of Object.keys(i)) bump(agg.instKeys, k);
    if (i?.id != null && i.id !== '') agg.inst.idPresent += 1;
    if (typeof i?.catalogId === 'string' && i.catalogId) agg.inst.catalogId += 1;
    if (typeof i?.localUid === 'string' && i.localUid) agg.inst.localUid += 1;
    if (i?.isCustom || i?.source === 'custom') agg.inst.custom += 1;
    const a = anchorForInstitution(i); anchors.push(a);
    const cls = a.split(':')[0];
    bump(agg.inst.anchorClass, cls);
    tierRec[cls] += 1;
  }
  agg.inst.byTier.set(tier, tierRec);
  if (anchors.length !== new Set(anchors).size) agg.inst.anchorDupRows += 1;

  // power factions
  const psf = Array.isArray(s.powerStructure?.factions) ? s.powerStructure.factions : [];
  const facNames = [];
  for (const f of psf) {
    agg.psFac.count += 1;
    for (const k of Object.keys(f)) bump(agg.psFac.keys, k);
    if (f?.id != null && f.id !== '') agg.psFac.idPresent += 1;
    if (typeof f?.name === 'string' && f.name) agg.psFac.namePresent += 1;
    if (typeof f?.faction === 'string' && f.faction) agg.psFac.factionPresent += 1;
    const nm = f?.faction || f?.name; if (nm) facNames.push(String(nm));
  }
  if (facNames.length !== new Set(facNames).size) agg.psFac.dupNameRows += 1;

  const gf = Array.isArray(s.factions) ? s.factions : [];
  for (const g of gf) {
    agg.grpFac.count += 1;
    for (const k of Object.keys(g)) bump(agg.grpFac.keys, k);
    if (g?.id != null && g.id !== '') agg.grpFac.idPresent += 1;
  }

  // relationships
  const idSet = new Set(npcIds);
  for (const r of (Array.isArray(s.relationships) ? s.relationships : [])) {
    agg.rel.count += 1;
    if (r?.npc1Id != null) agg.rel.npc1Id += 1;
    if (r?.npc2Id != null) agg.rel.npc2Id += 1;
    for (const k of ['npc1Id', 'npc2Id']) {
      const v = r?.[k]; if (v == null) continue;
      if (idSet.has(String(v))) agg.rel.idResolves += 1; else agg.rel.idDangles += 1;
    }
  }

  for (const c of (Array.isArray(s.conflicts) ? s.conflicts : [])) for (const k of Object.keys(c || {})) bump(agg.conflictKeys, k);
  for (const c of (Array.isArray(s.activeConditions) ? s.activeConditions : [])) for (const k of Object.keys(c || {})) bump(agg.condKeys, k);
  for (const c of (Array.isArray(s.history?.currentTensions) ? s.history.currentTensions : [])) for (const k of Object.keys(c || {})) bump(agg.tensionKeys, k);
  const ov = s.aiOverlays; if (ov && typeof ov === 'object') for (const k of Object.keys(ov)) bump(agg.overlayKeys, k);

  // reverse index
  const instNames = new Set(insts.map(i => String(i?.name ?? '')).filter(Boolean));
  const facNameSet = new Set(facNames);
  const npcNames = new Set(npcs.map(n => String(n?.name ?? '')).filter(Boolean));
  walkStrings(s, (p, v) => {
    const t = v.trim();
    if (!t) return;
    if (instNames.has(t)) bump(agg.instNamePaths, p);
    if (facNameSet.has(t)) bump(agg.facNamePaths, p);
    if (npcNames.has(t)) bump(agg.npcNamePaths, p);
  });
}

const m2o = (m) => Object.fromEntries([...m.entries()].sort((a, b) => b[1] - a[1]));
const result = {
  which: WHICH, rows: agg.rows, seconds: Math.round((Date.now() - t0) / 100) / 10,
  npc: { ...agg.npc, idPattern: m2o(agg.npc.idPattern) },
  inst: { ...agg.inst, anchorClass: m2o(agg.inst.anchorClass), byTier: Object.fromEntries(agg.inst.byTier) },
  psFac: { ...agg.psFac, keys: m2o(agg.psFac.keys) },
  grpFac: { ...agg.grpFac, keys: m2o(agg.grpFac.keys) },
  rel: agg.rel,
  settlementIdSpelling: m2o(agg.settlementIdSpelling),
  npcKeys: m2o(agg.npcKeys), instKeys: m2o(agg.instKeys),
  conflictKeys: m2o(agg.conflictKeys), condKeys: m2o(agg.condKeys), tensionKeys: m2o(agg.tensionKeys), overlayKeys: m2o(agg.overlayKeys),
  instNamePaths: m2o(agg.instNamePaths), facNamePaths: m2o(agg.facNamePaths), npcNamePaths: m2o(agg.npcNamePaths),
};
writeFileSync(`${OUT}/census-${WHICH}.json`, JSON.stringify(result, null, 2));
console.log(`rows=${agg.rows} seconds=${result.seconds}`);
console.log('npc:', JSON.stringify(result.npc));
console.log('inst:', JSON.stringify({ ...result.inst, byTier: undefined }));
console.log('inst.byTier:', JSON.stringify(result.inst.byTier));
console.log('psFac:', JSON.stringify(result.psFac));
console.log('grpFac:', JSON.stringify(result.grpFac));
console.log('rel:', JSON.stringify(result.rel));
console.log('settlementId:', JSON.stringify(result.settlementIdSpelling));
