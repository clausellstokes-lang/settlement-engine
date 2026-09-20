/**
 * proto.mjs — EM-R6's candidate cascade + removal sweep, PROTOTYPED IN SCRATCH and
 * executed on real pipeline records after a JSON save→load round trip.
 *
 * Nothing is written into the read tree. The module below is the packet's §6
 * contract in executable form; the measurements it produces are the packet's
 * acceptance evidence.
 */
import { writeFileSync } from 'node:fs';
import { runHeadless, instrumentedRoot, TREE } from './instrument.mjs';
import { keyOf, sample63 } from './lib.mjs';

const OUT = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-em-compile-EM-R6-scratch';
const { anchorForInstitution } = await import(`${TREE}/src/domain/townMap/anchors.js`);

// ───────────────────────── the candidate module ─────────────────────────

const SERVICE_CATEGORIES = Object.freeze([
  'equipment', 'legal', 'healing', 'employment', 'entertainment', 'food',
  'lodging', 'magic', 'information', 'transport', 'criminal',
]);
const DEFENSE_BUCKETS = Object.freeze([
  'garrison', 'magicDef', 'walls', 'watch', 'charter', 'mercenary', 'militia',
]);
const INSTITUTION_HOMES = Object.freeze(['npcs[]', 'factions[].members[]']);

/** Every institution-name-bearing field an NPC record carries, declared ONCE. */
const NPC_INSTITUTION_FIELDS = Object.freeze([
  { parent: null, key: 'institution', list: false },
  { parent: 'corruptTies', key: 'thievesGuild', list: false },
  { parent: 'corruptTies', key: 'criminalInstitution', list: false },
  { parent: null, key: 'linkedInstitutionIds', list: true },
]);

const npcFieldPath = (home, f) => `${f.parent ? `${home}.${f.parent}` : home}.${f.key}${f.list ? '[]' : ''}`;

/** removal: 'drop-record' | 'drop-entry' | 'drop-item' | 'clear-field' */
const SURFACES = Object.freeze([
  { path: 'institutions[].name', removal: 'drop-record' },
  ...SERVICE_CATEGORIES.map(c => ({ path: `availableServices.${c}[].institution`, removal: 'drop-entry' })),
  ...DEFENSE_BUCKETS.map(b => ({ path: `defenseProfile.institutions.${b}[].name`, removal: 'drop-entry' })),
  { path: 'economicState.activeChains[].processingInstitutions[]', removal: 'drop-item' },
  { path: 'economicState.activeChains[].dependency.institution', removal: 'clear-field' },
  { path: 'economicState.tradeDependencies[].institution', removal: 'clear-field' },
  { path: 'resourceAnalysis.gaps[].institution', removal: 'clear-field' },
  { path: 'resourceAnalysis.resourceChains[].processingInstitutions[]', removal: 'drop-item' },
  { path: 'resourceAnalysis.exploitation.fullyExploited[].processingInstitutions[]', removal: 'drop-item' },
  { path: 'resourceAnalysis.exploitation.partiallyExploited[].processingInstitutions[]', removal: 'drop-item' },
  ...INSTITUTION_HOMES.flatMap(h => NPC_INSTITUTION_FIELDS.map(f => ({
    path: npcFieldPath(h, f), removal: f.list ? 'drop-item' : 'clear-field',
  }))),
]);

const isRecord = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const listOf = (v) => (Array.isArray(v) ? v : null);
const isSameName = (v, old) => typeof v === 'string' && v.trim() === old;

function rewriteKey(t, k, old, nu) { if (!isSameName(t?.[k], old)) return false; t[k] = nu; return true; }
function rewriteNameList(t, k, old, nu) {
  const l = listOf(t?.[k]); if (!l) return false;
  let m = false;
  for (let i = 0; i < l.length; i += 1) if (isSameName(l[i], old)) { l[i] = nu; m = true; }
  return m;
}
function dropFromNameList(t, k, old) {
  const l = listOf(t?.[k]); if (!l) return 0;
  let n = 0;
  for (let i = l.length - 1; i >= 0; i -= 1) if (isSameName(l[i], old)) { l.splice(i, 1); n += 1; }
  return n;
}

function renameNpcRecord(npc, home, old, nu, mark) {
  if (!isRecord(npc)) return;
  for (const f of NPC_INSTITUTION_FIELDS) {
    const owner = f.parent ? npc[f.parent] : npc;
    if (!isRecord(owner)) continue;
    mark(npcFieldPath(home, f), f.list
      ? rewriteNameList(owner, f.key, old, nu)
      : rewriteKey(owner, f.key, old, nu));
  }
}
function sweepNpcRecord(npc, home, name, mark) {
  if (!isRecord(npc)) return;
  for (const f of NPC_INSTITUTION_FIELDS) {
    const owner = f.parent ? npc[f.parent] : npc;
    if (!isRecord(owner)) continue;
    if (f.list) { mark(npcFieldPath(home, f), dropFromNameList(owner, f.key, name) > 0); continue; }
    if (!isSameName(owner[f.key], name)) continue;
    delete owner[f.key]; mark(npcFieldPath(home, f), true);
  }
}

/** every `{ container, key }` an institution-name array/objectlist lives at */
function chainArrays(s) {
  const out = [];
  for (const c of listOf(s?.economicState?.activeChains) || []) if (isRecord(c)) out.push(c);
  for (const c of listOf(s?.resourceAnalysis?.resourceChains) || []) if (isRecord(c)) out.push(c);
  for (const k of ['fullyExploited', 'partiallyExploited']) {
    for (const c of listOf(s?.resourceAnalysis?.exploitation?.[k]) || []) if (isRecord(c)) out.push(c);
  }
  return out;
}
const chainPathFor = (s, c) => {
  if ((listOf(s?.economicState?.activeChains) || []).includes(c)) return 'economicState.activeChains[].processingInstitutions[]';
  if ((listOf(s?.resourceAnalysis?.resourceChains) || []).includes(c)) return 'resourceAnalysis.resourceChains[].processingInstitutions[]';
  if ((listOf(s?.resourceAnalysis?.exploitation?.fullyExploited) || []).includes(c)) return 'resourceAnalysis.exploitation.fullyExploited[].processingInstitutions[]';
  return 'resourceAnalysis.exploitation.partiallyExploited[].processingInstitutions[]';
};

export function applyInstitutionRenameToSettlement(s, old, nu) {
  const touched = [];
  if (!isRecord(s) || !old || !nu || old === nu) return { changed: false, touched };
  const mark = (p, moved) => { if (moved && !touched.includes(p)) touched.push(p); };

  for (const i of listOf(s.institutions) || []) {
    if (isRecord(i)) mark('institutions[].name', rewriteKey(i, 'name', old, nu));
  }
  for (const cat of SERVICE_CATEGORIES) {
    for (const e of listOf(s.availableServices?.[cat]) || []) {
      if (isRecord(e)) mark(`availableServices.${cat}[].institution`, rewriteKey(e, 'institution', old, nu));
    }
  }
  for (const b of DEFENSE_BUCKETS) {
    for (const e of listOf(s.defenseProfile?.institutions?.[b]) || []) {
      if (isRecord(e)) mark(`defenseProfile.institutions.${b}[].name`, rewriteKey(e, 'name', old, nu));
    }
  }
  for (const c of chainArrays(s)) {
    mark(chainPathFor(s, c), rewriteNameList(c, 'processingInstitutions', old, nu));
    if (isRecord(c.dependency)) mark('economicState.activeChains[].dependency.institution', rewriteKey(c.dependency, 'institution', old, nu));
  }
  for (const d of listOf(s.economicState?.tradeDependencies) || []) {
    if (isRecord(d)) mark('economicState.tradeDependencies[].institution', rewriteKey(d, 'institution', old, nu));
  }
  for (const g of listOf(s.resourceAnalysis?.gaps) || []) {
    if (isRecord(g)) mark('resourceAnalysis.gaps[].institution', rewriteKey(g, 'institution', old, nu));
  }
  for (const n of listOf(s.npcs) || []) renameNpcRecord(n, INSTITUTION_HOMES[0], old, nu, mark);
  for (const g of listOf(s.factions) || []) {
    if (!isRecord(g)) continue;
    for (const m of listOf(g.members) || []) renameNpcRecord(m, INSTITUTION_HOMES[1], old, nu, mark);
  }
  return { changed: touched.length > 0, touched };
}

export function applyInstitutionRemovalToSettlement(s, name) {
  const touched = [];
  const refusals = [];
  if (!isRecord(s) || !name) return { changed: false, touched, refusals };
  const mark = (p, moved) => { if (moved && !touched.includes(p)) touched.push(p); };
  const dropEntries = (arr, pred, path) => {
    if (!Array.isArray(arr)) return;
    let n = 0;
    for (let i = arr.length - 1; i >= 0; i -= 1) if (pred(arr[i])) { arr.splice(i, 1); n += 1; }
    mark(path, n > 0);
  };

  dropEntries(listOf(s.institutions), (i) => isRecord(i) && isSameName(i.name, name), 'institutions[].name');
  for (const cat of SERVICE_CATEGORIES) {
    dropEntries(listOf(s.availableServices?.[cat]), (e) => isRecord(e) && isSameName(e.institution, name), `availableServices.${cat}[].institution`);
  }
  for (const b of DEFENSE_BUCKETS) {
    dropEntries(listOf(s.defenseProfile?.institutions?.[b]), (e) => isRecord(e) && isSameName(e.name, name), `defenseProfile.institutions.${b}[].name`);
  }
  for (const c of chainArrays(s)) {
    const before = (listOf(c.processingInstitutions) || []).length;
    const n = dropFromNameList(c, 'processingInstitutions', name);
    if (n > 0) {
      mark(chainPathFor(s, c), true);
      if (before - n === 0) refusals.push({ kind: 'chain-sole-processor', chainId: c.chainId ?? c.label ?? c.resource ?? '(unnamed)', path: chainPathFor(s, c) });
    }
    if (isRecord(c.dependency) && isSameName(c.dependency.institution, name)) {
      delete c.dependency; mark('economicState.activeChains[].dependency.institution', true);
    }
  }
  dropEntries(listOf(s.economicState?.tradeDependencies), (d) => isRecord(d) && isSameName(d.institution, name), 'economicState.tradeDependencies[].institution');
  for (const g of listOf(s.resourceAnalysis?.gaps) || []) {
    if (isRecord(g) && isSameName(g.institution, name)) { delete g.institution; mark('resourceAnalysis.gaps[].institution', true); }
  }
  for (const n of listOf(s.npcs) || []) sweepNpcRecord(n, INSTITUTION_HOMES[0], name, mark);
  for (const g of listOf(s.factions) || []) {
    if (!isRecord(g)) continue;
    for (const m of listOf(g.members) || []) sweepNpcRecord(m, INSTITUTION_HOMES[1], name, mark);
  }
  return { changed: touched.length > 0, touched, refusals };
}

// ───────────────────────── the measurement harness ─────────────────────────

const STRICT_PATHS = new Set(SURFACES.map(s => s.path).filter(p => p !== 'institutions[].name'));
const POLY_PATHS = new Set([
  'spatialLayout.quarters[].landmarks[]', 'simulationTrace[].downstreamEffects[].target',
  'npcs[].secondaryAffiliation', 'factions[].members[].secondaryAffiliation',
  'generationCoherenceReceipt.repairs[].subject', 'economicState.activeChains[].label',
  'resourceAnalysis.resourceConditions[].label', 'availableServices.legal[].name',
  'economicState.activeChains[].resource',
]);
// The FIXED landmark tables in src/generators/spatialGenerator.js (read at the tip).
const FIXED_LANDMARKS = new Set([
  'Tannery Row', 'Slaughterhouse', "Dyer's Bridge", 'Main Wharf', 'Warehouse Row',
  "Sailors' Quarter", 'Barge Wharf', 'River Landing', 'Common well', 'Alehouse',
  'Notice post', 'Drying racks', 'Net mending post', 'Beaching ground', 'Timber stacks',
  'Tool shed', 'Charcoal pit', "The Rat's Nest (tavern)", 'Blind Alley', 'The Warren (slums)',
  "Noble's Row", 'Merchant Estates', 'Garden District', "Tanners' Lane", "Weavers' Street",
  "Cooper's Close",
]);

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
/** Dangling STRICT joins, by path. A string at a strict path naming no roster institution. */
function dangles(s) {
  const names = new Set((listOf(s.institutions) || []).map(i => String(i?.name ?? '')).filter(Boolean));
  const byPath = new Map(); let total = 0;
  walkStrings(s, (p, v) => {
    if (!STRICT_PATHS.has(p)) return;
    const t = v.trim(); if (!t) return;
    if (names.has(t)) return;
    byPath.set(p, (byPath.get(p) || 0) + 1); total += 1;
  });
  return { total, byPath };
}
/** every stored handle EXACTLY equal to `name`, by path (strict + poly + anywhere). */
function handlesOf(s, name) {
  const byPath = new Map(); let total = 0;
  walkStrings(s, (p, v) => {
    if (v.trim() !== name) return;
    byPath.set(p, (byPath.get(p) || 0) + 1); total += 1;
  });
  return { total, byPath };
}
const reload = (v) => JSON.parse(JSON.stringify(v));
const NEW_NAME = 'ZZ Verdant Circle QQ';

const rows = sample63();
const agg = {
  rows: 0,
  rename: { cases: 0, handlesBefore: 0, staleAfterStrict: 0, staleAfterAny: 0, stalePaths: new Map(), newDanglesTotal: 0, newDangleKinds: new Map() },
  removal: { cases: 0, handlesBefore: 0, newDanglesTotal: 0, newDangleKinds: new Map(), refusals: new Map(), residualPaths: new Map() },
  mirror: { cases: 0, disagreeBeforeAnyEdit: 0, disagreeAfterRenameNoMirrorWalk: 0, disagreeAfterRenameWithMirrorWalk: 0 },
  anchor: { renamed: 0, moved: 0, movedNameClass: 0 },
  landmarkFixedCollision: { matches: 0, fixedTable: 0, samples: [] },
  polyStaleAfterRename: new Map(),
};
const bump = (m, k, n = 1) => m.set(k, (m.get(k) || 0) + n);

const t0 = Date.now();
for (const row of rows) {
  const seed = row._seed ?? keyOf(row);
  const { root } = instrumentedRoot(seed);
  let out; try { out = await runHeadless(row, root); } catch { continue; }
  const base = out?.settlement ?? out; if (!base) continue;
  agg.rows += 1;

  // Landmark polysemy: how many matching landmarks are FIXED-TABLE prose?
  {
    const names = new Set((listOf(base.institutions) || []).map(i => String(i?.name ?? '')).filter(Boolean));
    for (const q of listOf(base.spatialLayout?.quarters) || []) {
      for (const l of listOf(q?.landmarks) || []) {
        const t = String(l).trim();
        if (!names.has(t)) continue;
        agg.landmarkFixedCollision.matches += 1;
        if (FIXED_LANDMARKS.has(t)) {
          agg.landmarkFixedCollision.fixedTable += 1;
          if (agg.landmarkFixedCollision.samples.length < 8) agg.landmarkFixedCollision.samples.push({ landmark: t, quarter: q?.name });
        }
      }
    }
  }

  // pick the institution with the MOST strict handles (the worst case)
  const saved = reload(base);
  const names = (listOf(saved.institutions) || []).map(i => String(i?.name ?? '')).filter(Boolean);
  if (!names.length) continue;
  let target = names[0], bestN = -1;
  for (const n of names) {
    const h = handlesOf(saved, n);
    let strictN = 0;
    for (const [p, c] of h.byPath) if (STRICT_PATHS.has(p)) strictN += c;
    if (strictN > bestN) { bestN = strictN; target = n; }
  }

  // ── MIRROR: do the two homes agree before any edit, on a RELOADED record? ──
  {
    const a = (listOf(saved.npcs) || []).map(n => `${n?.name}|${n?.institution ?? ''}`).sort().join('');
    const b = (listOf(saved.factions) || []).flatMap(g => listOf(g?.members) || [])
      .map(n => `${n?.name}|${n?.institution ?? ''}`).sort().join('');
    agg.mirror.cases += 1;
    if (a !== b) agg.mirror.disagreeBeforeAnyEdit += 1;
  }

  // ── RENAME arm ──
  {
    const s = reload(saved);
    const before = handlesOf(s, target);
    const d0 = dangles(s);
    const instBefore = (listOf(s.institutions) || []).find(i => String(i?.name) === target);
    const anchorBefore = anchorForInstitution(instBefore);
    applyInstitutionRenameToSettlement(s, target, NEW_NAME);
    const after = handlesOf(s, target); // anything still spelling the OLD name
    const d1 = dangles(s);
    agg.rename.cases += 1;
    agg.rename.handlesBefore += before.total;
    for (const [p, c] of after.byPath) {
      if (STRICT_PATHS.has(p)) agg.rename.staleAfterStrict += c;
      agg.rename.staleAfterAny += c;
      bump(agg.rename.stalePaths, p, c);
      if (POLY_PATHS.has(p)) bump(agg.polyStaleAfterRename, p, c);
    }
    const nd = d1.total - d0.total;
    agg.rename.newDanglesTotal += nd;
    for (const [p, c] of d1.byPath) {
      const was = d0.byPath.get(p) || 0;
      if (c > was) bump(agg.rename.newDangleKinds, p, c - was);
    }
    const instAfter = (listOf(s.institutions) || []).find(i => String(i?.name) === NEW_NAME);
    const anchorAfter = anchorForInstitution(instAfter);
    agg.anchor.renamed += 1;
    if (anchorBefore !== anchorAfter) {
      agg.anchor.moved += 1;
      if (String(anchorBefore).startsWith('name:')) agg.anchor.movedNameClass += 1;
    }

    // mirror composition after the rename, on the RELOADED (aliases broken) record
    const a = (listOf(s.npcs) || []).map(n => `${n?.name}|${n?.institution ?? ''}`).sort().join('');
    const b = (listOf(s.factions) || []).flatMap(g => listOf(g?.members) || [])
      .map(n => `${n?.name}|${n?.institution ?? ''}`).sort().join('');
    if (a !== b) agg.mirror.disagreeAfterRenameWithMirrorWalk += 1;

    // and WITHOUT the second home (the bug the mirror walk exists to close)
    const s2 = reload(saved);
    for (const n of listOf(s2.npcs) || []) renameNpcRecord(n, 'npcs[]', target, NEW_NAME, () => {});
    const a2 = (listOf(s2.npcs) || []).map(n => `${n?.name}|${n?.institution ?? ''}`).sort().join('');
    const b2 = (listOf(s2.factions) || []).flatMap(g => listOf(g?.members) || [])
      .map(n => `${n?.name}|${n?.institution ?? ''}`).sort().join('');
    if (a2 !== b2) agg.mirror.disagreeAfterRenameNoMirrorWalk += 1;
  }

  // ── REMOVAL arm ──
  {
    const s = reload(saved);
    const before = handlesOf(s, target);
    const d0 = dangles(s);
    const { refusals } = applyInstitutionRemovalToSettlement(s, target);
    const d1 = dangles(s);
    const residual = handlesOf(s, target);
    agg.removal.cases += 1;
    agg.removal.handlesBefore += before.total;
    agg.removal.newDanglesTotal += d1.total - d0.total;
    for (const [p, c] of d1.byPath) {
      const was = d0.byPath.get(p) || 0;
      if (c > was) bump(agg.removal.newDangleKinds, p, c - was);
    }
    for (const r of refusals) bump(agg.removal.refusals, r.kind);
    for (const [p, c] of residual.byPath) bump(agg.removal.residualPaths, p, c);
  }
}

const m2o = (m) => Object.fromEntries([...m.entries()].sort((a, b) => b[1] - a[1]));
const result = {
  rows: agg.rows, seconds: Math.round((Date.now() - t0) / 100) / 10,
  rename: { ...agg.rename, stalePaths: m2o(agg.rename.stalePaths), newDangleKinds: m2o(agg.rename.newDangleKinds) },
  removal: { ...agg.removal, newDangleKinds: m2o(agg.removal.newDangleKinds), refusals: m2o(agg.removal.refusals), residualPaths: m2o(agg.removal.residualPaths) },
  mirror: agg.mirror, anchor: agg.anchor,
  landmarkFixedCollision: agg.landmarkFixedCollision,
  polyStaleAfterRename: m2o(agg.polyStaleAfterRename),
  surfaceCount: SURFACES.length,
};
writeFileSync(`${OUT}/proto-63.json`, JSON.stringify(result, null, 2));
console.log(`rows=${agg.rows} seconds=${result.seconds}  declared surfaces=${SURFACES.length}`);
console.log('RENAME  :', JSON.stringify(result.rename));
console.log('REMOVAL :', JSON.stringify(result.removal));
console.log('MIRROR  :', JSON.stringify(result.mirror));
console.log('ANCHOR  :', JSON.stringify(result.anchor));
console.log('LANDMARK:', JSON.stringify(result.landmarkFixedCollision));
console.log('POLY stale after rename:', JSON.stringify(result.polyStaleAfterRename));
