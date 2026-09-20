/**
 * proto2.mjs — EM-R6 VERSION 2, at read-tip-e5bdfd031, under the chair's R3 ruling:
 * the three polysemous paths are CASCADED under the exact-match guard, so the
 * surface list is 36 rows (33 + landmarks + secondaryAffiliation×2 homes + chain label).
 *
 * It also executes the DISJOINTNESS ARM the chair ordered (a value that is BOTH an
 * institution name and a faction name reds), and measures what a REMOVAL does to the
 * chain label — the one new row whose removal rule is not obvious.
 */
import { writeFileSync } from 'node:fs';
import { runHeadless, instrumentedRoot, TREE } from './instrument2.mjs';
import { keyOf, sample63, goldenCorpus } from './lib2.mjs';

const OUT = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-em-compile-EM-R6-scratch';
const { anchorForInstitution } = await import(`${TREE}/src/domain/townMap/anchors.js`);
const WHICH = process.argv[2] || '63';
const rows = WHICH === '525' ? goldenCorpus() : sample63();

// ───────────────── the candidate module, version 2 ─────────────────

const SERVICE_CATEGORIES = Object.freeze([
  'equipment', 'legal', 'healing', 'employment', 'entertainment', 'food',
  'lodging', 'magic', 'information', 'transport', 'criminal',
]);
const DEFENSE_BUCKETS = Object.freeze([
  'garrison', 'magicDef', 'walls', 'watch', 'charter', 'mercenary', 'militia',
]);
const INSTITUTION_HOMES = Object.freeze(['npcs[]', 'factions[].members[]']);

/** ⭐ R3(ii): `secondaryAffiliation` JOINS the declared field list, so both homes get it free. */
const NPC_INSTITUTION_FIELDS = Object.freeze([
  { parent: null, key: 'institution', list: false, removal: 'delete-key' },
  { parent: null, key: 'secondaryAffiliation', list: false, removal: 'delete-key' },
  { parent: 'corruptTies', key: 'thievesGuild', list: false, removal: 'delete-key' },
  { parent: 'corruptTies', key: 'criminalInstitution', list: false, removal: 'delete-key' },
  { parent: null, key: 'linkedInstitutionIds', list: true, removal: 'drop-item' },
]);

const npcFieldPath = (home, f) => `${f.parent ? `${home}.${f.parent}` : home}.${f.key}${f.list ? '[]' : ''}`;

const SURFACES = Object.freeze([
  { path: 'institutions[].name', removal: 'drop-record' },
  ...SERVICE_CATEGORIES.map(c => ({ path: `availableServices.${c}[].institution`, removal: 'drop-entry' })),
  ...DEFENSE_BUCKETS.map(b => ({ path: `defenseProfile.institutions.${b}[].name`, removal: 'drop-entry' })),
  { path: 'economicState.activeChains[].processingInstitutions[]', removal: 'drop-item' },
  { path: 'resourceAnalysis.resourceChains[].processingInstitutions[]', removal: 'drop-item' },
  { path: 'resourceAnalysis.exploitation.fullyExploited[].processingInstitutions[]', removal: 'drop-item' },
  { path: 'resourceAnalysis.exploitation.partiallyExploited[].processingInstitutions[]', removal: 'drop-item' },
  { path: 'economicState.activeChains[].dependency.institution', removal: 'delete-dependency-object' },
  { path: 'economicState.tradeDependencies[].institution', removal: 'drop-entry' },
  { path: 'resourceAnalysis.gaps[].institution', removal: 'delete-key' },
  // ⭐ R3(i) and R3(iii) — the two new NON-NPC cascade rows
  { path: 'spatialLayout.quarters[].landmarks[]', removal: 'drop-item' },
  { path: 'economicState.activeChains[].label', removal: 'report-only' },
  ...INSTITUTION_HOMES.flatMap(h => NPC_INSTITUTION_FIELDS.map(f => ({
    path: npcFieldPath(h, f), removal: f.removal,
  }))),
]);

/** The REFERENCE paths whose strings are institution handles by construction — the DANGLE
 *  denominator. The three R3 rows are NOT here: they lawfully hold non-institution strings,
 *  so counting their non-matches as dangles would be a category error. */
const DANGLE_PATHS = new Set(SURFACES
  .map(s => s.path)
  .filter(p => p !== 'institutions[].name'
    && p !== 'spatialLayout.quarters[].landmarks[]'
    && p !== 'economicState.activeChains[].label'
    && !p.endsWith('.secondaryAffiliation')));

/** Every path the cascade claims, for the "nothing stale" arm. */
const CASCADE_PATHS = new Set(SURFACES.map(s => s.path));

const POLY_NON_CASCADED = new Set([
  'simulationTrace[].downstreamEffects[].target',
  'generationCoherenceReceipt.repairs[].subject',
  'resourceAnalysis.resourceConditions[].label',
  'availableServices.legal[].name',
  'economicState.activeChains[].resource',
]);

const isRecord = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const listOf = (v) => (Array.isArray(v) ? v : null);
const isSameName = (v, old) => typeof v === 'string' && v.trim() === old;

function rewriteKey(t, k, old, nu) { if (!isSameName(t?.[k], old)) return false; t[k] = nu; return true; }
function deleteKey(t, k, name) { if (!isSameName(t?.[k], name)) return false; delete t[k]; return true; }
function rewriteNameList(t, k, old, nu) {
  const l = listOf(t?.[k]); if (!l) return false;
  let m = false;
  for (let i = 0; i < l.length; i += 1) if (isSameName(l[i], old)) { l[i] = nu; m = true; }
  return m;
}
function dropFromNameList(t, k, name) {
  const l = listOf(t?.[k]); if (!l) return 0;
  let n = 0;
  for (let i = l.length - 1; i >= 0; i -= 1) if (isSameName(l[i], name)) { l.splice(i, 1); n += 1; }
  return n;
}
function dropEntries(arr, pred) {
  if (!Array.isArray(arr)) return 0;
  let n = 0;
  for (let i = arr.length - 1; i >= 0; i -= 1) if (pred(arr[i])) { arr.splice(i, 1); n += 1; }
  return n;
}
function chainRecords(s) {
  const out = [];
  for (const c of listOf(s?.economicState?.activeChains) || []) if (isRecord(c)) out.push({ c, path: 'economicState.activeChains[].processingInstitutions[]' });
  for (const c of listOf(s?.resourceAnalysis?.resourceChains) || []) if (isRecord(c)) out.push({ c, path: 'resourceAnalysis.resourceChains[].processingInstitutions[]' });
  for (const arm of ['fullyExploited', 'partiallyExploited']) {
    for (const c of listOf(s?.resourceAnalysis?.exploitation?.[arm]) || []) if (isRecord(c)) out.push({ c, path: `resourceAnalysis.exploitation.${arm}[].processingInstitutions[]` });
  }
  return out;
}
function forEachNpcHome(s, visit) {
  for (const n of listOf(s.npcs) || []) if (isRecord(n)) visit(n, INSTITUTION_HOMES[0]);
  for (const g of listOf(s.factions) || []) {
    if (!isRecord(g)) continue;
    for (const m of listOf(g.members) || []) if (isRecord(m)) visit(m, INSTITUTION_HOMES[1]);
  }
}

export function applyInstitutionRenameToSettlement(s, old, nu) {
  const touched = [];
  if (!isRecord(s) || !old || !nu || old === nu) return { changed: false, touched };
  const mark = (p, moved) => { if (moved && !touched.includes(p)) touched.push(p); };

  for (const i of listOf(s.institutions) || []) if (isRecord(i)) mark('institutions[].name', rewriteKey(i, 'name', old, nu));
  for (const cat of SERVICE_CATEGORIES) {
    for (const e of listOf(s.availableServices?.[cat]) || []) if (isRecord(e)) mark(`availableServices.${cat}[].institution`, rewriteKey(e, 'institution', old, nu));
  }
  for (const b of DEFENSE_BUCKETS) {
    for (const e of listOf(s.defenseProfile?.institutions?.[b]) || []) if (isRecord(e)) mark(`defenseProfile.institutions.${b}[].name`, rewriteKey(e, 'name', old, nu));
  }
  for (const { c, path } of chainRecords(s)) {
    mark(path, rewriteNameList(c, 'processingInstitutions', old, nu));
    if (isRecord(c.dependency)) mark('economicState.activeChains[].dependency.institution', rewriteKey(c.dependency, 'institution', old, nu));
  }
  // ⭐ R3(iii) — the chain LABEL, exact-match guarded
  for (const c of listOf(s.economicState?.activeChains) || []) {
    if (isRecord(c)) mark('economicState.activeChains[].label', rewriteKey(c, 'label', old, nu));
  }
  for (const d of listOf(s.economicState?.tradeDependencies) || []) if (isRecord(d)) mark('economicState.tradeDependencies[].institution', rewriteKey(d, 'institution', old, nu));
  for (const g of listOf(s.resourceAnalysis?.gaps) || []) if (isRecord(g)) mark('resourceAnalysis.gaps[].institution', rewriteKey(g, 'institution', old, nu));
  // ⭐ R3(i) — the quarter's LANDMARK list, exact-match guarded
  for (const q of listOf(s.spatialLayout?.quarters) || []) {
    if (isRecord(q)) mark('spatialLayout.quarters[].landmarks[]', rewriteNameList(q, 'landmarks', old, nu));
  }
  forEachNpcHome(s, (npc, home) => {
    for (const f of NPC_INSTITUTION_FIELDS) {
      const owner = f.parent ? npc[f.parent] : npc;
      if (!isRecord(owner)) continue;
      mark(npcFieldPath(home, f), f.list
        ? rewriteNameList(owner, f.key, old, nu)
        : rewriteKey(owner, f.key, old, nu));
    }
  });
  return { changed: touched.length > 0, touched };
}

export function applyInstitutionRemovalToSettlement(s, name) {
  const touched = [];
  const orphaned = [];
  if (!isRecord(s) || !name) return { changed: false, touched, orphaned };
  const mark = (p, moved) => { if (moved && !touched.includes(p)) touched.push(p); };

  mark('institutions[].name', dropEntries(listOf(s.institutions), (i) => isRecord(i) && isSameName(i.name, name)) > 0);
  for (const cat of SERVICE_CATEGORIES) {
    mark(`availableServices.${cat}[].institution`, dropEntries(listOf(s.availableServices?.[cat]), (e) => isRecord(e) && isSameName(e.institution, name)) > 0);
  }
  for (const b of DEFENSE_BUCKETS) {
    mark(`defenseProfile.institutions.${b}[].name`, dropEntries(listOf(s.defenseProfile?.institutions?.[b]), (e) => isRecord(e) && isSameName(e.name, name)) > 0);
  }
  for (const { c, path } of chainRecords(s)) {
    const before = (listOf(c.processingInstitutions) || []).length;
    const dropped = dropFromNameList(c, 'processingInstitutions', name);
    if (dropped > 0) {
      mark(path, true);
      if (before - dropped === 0) orphaned.push({ kind: 'chain-lost-its-last-processor', path, chainId: c.chainId ?? null });
    }
    if (isRecord(c.dependency) && isSameName(c.dependency.institution, name)) {
      delete c.dependency; mark('economicState.activeChains[].dependency.institution', true);
    }
  }
  // ⭐ R3(iii) removal: the LABEL STANDS (present on 6,676/6,676 — absence is not a shape
  // this record carries) and the loss is carried by the orphan note instead.
  for (const c of listOf(s.economicState?.activeChains) || []) {
    if (!isRecord(c) || !isSameName(c.label, name)) continue;
    orphaned.push({
      kind: 'chain-label-names-a-removed-house',
      path: 'economicState.activeChains[].label',
      chainId: c.chainId ?? null,
      processorsLeft: (listOf(c.processingInstitutions) || []).length,
    });
  }
  mark('economicState.tradeDependencies[].institution', dropEntries(listOf(s.economicState?.tradeDependencies), (d) => isRecord(d) && isSameName(d.institution, name)) > 0);
  for (const g of listOf(s.resourceAnalysis?.gaps) || []) if (isRecord(g)) mark('resourceAnalysis.gaps[].institution', deleteKey(g, 'institution', name));
  for (const q of listOf(s.spatialLayout?.quarters) || []) {
    if (isRecord(q)) mark('spatialLayout.quarters[].landmarks[]', dropFromNameList(q, 'landmarks', name) > 0);
  }
  forEachNpcHome(s, (npc, home) => {
    for (const f of NPC_INSTITUTION_FIELDS) {
      const owner = f.parent ? npc[f.parent] : npc;
      if (!isRecord(owner)) continue;
      mark(npcFieldPath(home, f), f.list
        ? dropFromNameList(owner, f.key, name) > 0
        : deleteKey(owner, f.key, name));
    }
  });
  return { changed: touched.length > 0, touched, orphaned };
}

// ───────────────── the harness ─────────────────

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
function dangles(s) {
  const names = new Set((listOf(s.institutions) || []).map(i => String(i?.name ?? '')).filter(Boolean));
  const byPath = new Map(); let total = 0;
  walkStrings(s, (p, v) => {
    if (!DANGLE_PATHS.has(p)) return;
    const t = v.trim(); if (!t || names.has(t)) return;
    byPath.set(p, (byPath.get(p) || 0) + 1); total += 1;
  });
  return { total, byPath };
}
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
const bump = (m, k, n = 1) => m.set(k, (m.get(k) || 0) + n);

const agg = {
  rows: 0,
  rename: { cases: 0, handlesBefore: 0, staleOnCascadeRows: 0, staleAfterAny: 0, stalePaths: new Map(), newDangles: 0, newDangleKinds: new Map(), touchedRows: new Set() },
  removal: { cases: 0, newDangles: 0, newDangleKinds: new Map(), orphanKinds: new Map(), residual: new Map(), removalKindsSeen: new Set() },
  // ⭐ THE DISJOINTNESS ARM the chair ordered
  disjoint: { values: 0, instOnly: 0, facOnly: 0, both: 0, neither: 0, bothSamples: [] },
  // the chain-label removal question
  chainLabel: { rowsWithStaleLabel: 0, notes: 0, keptProcessors: 0, samples: [] },
  landmarkFixed: { matches: 0, fixedTable: 0 },
};
const FIXED_LANDMARKS = new Set([
  'Tannery Row', 'Slaughterhouse', "Dyer's Bridge", 'Main Wharf', 'Warehouse Row',
  "Sailors' Quarter", 'Barge Wharf', 'River Landing', 'Common well', 'Alehouse',
  'Notice post', 'Drying racks', 'Net mending post', 'Beaching ground', 'Timber stacks',
  'Tool shed', 'Charcoal pit', "The Rat's Nest (tavern)", 'Blind Alley', 'The Warren (slums)',
  "Noble's Row", 'Merchant Estates', 'Garden District', "Tanners' Lane", "Weavers' Street",
  "Cooper's Close",
]);

const t0 = Date.now();
for (const row of rows) {
  const seed = row._seed ?? keyOf(row);
  const { root } = instrumentedRoot(seed);
  let out; try { out = await runHeadless(row, root); } catch { continue; }
  const base = out?.settlement ?? out; if (!base) continue;
  agg.rows += 1;
  const saved = reload(base);
  const instNames = new Set((listOf(saved.institutions) || []).map(i => String(i?.name ?? '')).filter(Boolean));
  const facNames = new Set((listOf(saved.powerStructure?.factions) || []).map(f => String(f?.faction || f?.name || '')).filter(Boolean));

  // ── THE DISJOINTNESS ARM: is any secondaryAffiliation value BOTH? ──
  forEachNpcHome(saved, (npc) => {
    const v = npc?.secondaryAffiliation;
    if (typeof v !== 'string' || !v.trim()) return;
    const t = v.trim(); agg.disjoint.values += 1;
    const i = instNames.has(t); const f = facNames.has(t);
    if (i && f) { agg.disjoint.both += 1; if (agg.disjoint.bothSamples.length < 8) agg.disjoint.bothSamples.push(t); }
    else if (i) agg.disjoint.instOnly += 1;
    else if (f) agg.disjoint.facOnly += 1;
    else agg.disjoint.neither += 1;
  });

  for (const q of listOf(saved.spatialLayout?.quarters) || []) {
    for (const l of listOf(q?.landmarks) || []) {
      const t = String(l).trim();
      if (!instNames.has(t)) continue;
      agg.landmarkFixed.matches += 1;
      if (FIXED_LANDMARKS.has(t)) agg.landmarkFixed.fixedTable += 1;
    }
  }

  const names = [...instNames];
  if (!names.length) continue;
  let target = names[0], best = -1;
  for (const n of names) {
    const h = handlesOf(saved, n);
    let c = 0; for (const [p, k] of h.byPath) if (CASCADE_PATHS.has(p) && p !== 'institutions[].name') c += k;
    if (c > best) { best = c; target = n; }
  }

  { // RENAME
    const s = reload(saved);
    const before = handlesOf(s, target);
    const d0 = dangles(s);
    const { touched } = applyInstitutionRenameToSettlement(s, target, NEW_NAME);
    for (const t of touched) agg.rename.touchedRows.add(t);
    const after = handlesOf(s, target);
    const d1 = dangles(s);
    agg.rename.cases += 1;
    agg.rename.handlesBefore += before.total;
    for (const [p, c] of after.byPath) {
      if (CASCADE_PATHS.has(p)) agg.rename.staleOnCascadeRows += c;
      agg.rename.staleAfterAny += c;
      bump(agg.rename.stalePaths, p, c);
    }
    agg.rename.newDangles += d1.total - d0.total;
    for (const [p, c] of d1.byPath) { const w = d0.byPath.get(p) || 0; if (c > w) bump(agg.rename.newDangleKinds, p, c - w); }
  }
  { // REMOVAL
    const s = reload(saved);
    const d0 = dangles(s);
    const { touched, orphaned } = applyInstitutionRemovalToSettlement(s, target);
    const d1 = dangles(s);
    agg.removal.cases += 1;
    agg.removal.newDangles += d1.total - d0.total;
    for (const [p, c] of d1.byPath) { const w = d0.byPath.get(p) || 0; if (c > w) bump(agg.removal.newDangleKinds, p, c - w); }
    for (const o of orphaned) {
      bump(agg.removal.orphanKinds, o.kind);
      if (o.kind === 'chain-label-names-a-removed-house') {
        agg.chainLabel.notes += 1;
        if (o.processorsLeft > 0) agg.chainLabel.keptProcessors += 1;
        if (agg.chainLabel.samples.length < 6) agg.chainLabel.samples.push(o);
      }
    }
    if (orphaned.some(o => o.kind === 'chain-label-names-a-removed-house')) agg.chainLabel.rowsWithStaleLabel += 1;
    for (const t of touched) {
      const row = SURFACES.find(x => x.path === t);
      if (row) agg.removal.removalKindsSeen.add(row.removal);
    }
    const residual = handlesOf(s, target);
    for (const [p, c] of residual.byPath) bump(agg.removal.residual, p, c);
  }
}

const m2o = (m) => Object.fromEntries([...m.entries()].sort((a, b) => b[1] - a[1]));
const result = {
  tip: 'e5bdfd031', which: WHICH, rows: agg.rows, seconds: Math.round((Date.now() - t0) / 100) / 10,
  declaredSurfaces: SURFACES.length,
  rename: { ...agg.rename, stalePaths: m2o(agg.rename.stalePaths), newDangleKinds: m2o(agg.rename.newDangleKinds), touchedRows: [...agg.rename.touchedRows].sort() },
  removal: { ...agg.removal, newDangleKinds: m2o(agg.removal.newDangleKinds), orphanKinds: m2o(agg.removal.orphanKinds), residual: m2o(agg.removal.residual), removalKindsSeen: [...agg.removal.removalKindsSeen].sort() },
  disjoint: agg.disjoint, chainLabel: agg.chainLabel, landmarkFixed: agg.landmarkFixed,
  nonCascadedExpected: [...POLY_NON_CASCADED].sort(),
};
writeFileSync(`${OUT}/proto2-${WHICH}.json`, JSON.stringify(result, null, 2));
console.log(`tip=e5bdfd031 rows=${agg.rows} seconds=${result.seconds}  declared surfaces=${SURFACES.length}`);
console.log('RENAME  :', JSON.stringify({ ...result.rename, touchedRows: `${result.rename.touchedRows.length} distinct rows observed moving` }));
console.log('REMOVAL :', JSON.stringify(result.removal));
console.log('⭐ DISJOINTNESS ARM:', JSON.stringify(result.disjoint));
console.log('CHAIN LABEL on removal:', JSON.stringify(result.chainLabel));
console.log('LANDMARK fixed-table collision:', JSON.stringify(result.landmarkFixed));
