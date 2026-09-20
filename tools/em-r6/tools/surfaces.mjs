/**
 * surfaces.mjs — EM-R6 compile lane: the institution-name surface denominator,
 * per-path container SHAPE, polysemy counts, and the pre-existing dangle baseline.
 *
 * Writes ONLY through an absolute path under this lane's scratch.
 * Usage: node tools/surfaces.mjs [63|525]
 */
import { writeFileSync } from 'node:fs';
import { runHeadless, instrumentedRoot, TREE } from './instrument.mjs';
import { goldenCorpus, keyOf, sample63 } from './lib.mjs';

const OUT = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-em-compile-EM-R6-scratch';
const WHICH = process.argv[2] || '63';
const rows = WHICH === '525' ? goldenCorpus() : sample63();

/** Walk every string leaf, reporting (collapsedPath, value, containerKind). */
function walkStrings(root, sink, maxDepth = 25) {
  const stack = [[root, '', 0, null]];
  while (stack.length) {
    const [v, p, d, inArray] = stack.pop();
    if (d > maxDepth || v == null) continue;
    if (typeof v === 'string') { sink(p, v, inArray ? 'string-in-array' : 'scalar-field'); continue; }
    if (typeof v !== 'object') continue;
    if (Array.isArray(v)) { for (const x of v) stack.push([x, `${p}[]`, d + 1, true]); continue; }
    for (const k of Object.keys(v)) stack.push([v[k], p ? `${p}.${k}` : k, d + 1, false]);
  }
}

const bump = (m, k, n = 1) => m.set(k, (m.get(k) || 0) + n);

const agg = {
  rows: 0,
  // per collapsed path: total string occurrences, matches against the roster,
  // observed container kinds
  pathTotal: new Map(),
  pathMatch: new Map(),
  pathKind: new Map(),
  // per-institution handle distribution (STRICT paths only)
  instHandleHist: new Map(),
  instWithHandles: 0, instTotal: 0, strictHandleTotal: 0, maxHandles: 0, maxHandleName: '',
  // pre-existing dangling STRICT joins per settlement, by tier
  dangleByTier: new Map(),
  danglePaths: new Map(),
  // service / defense entry shapes
  serviceEntryKeys: new Map(),
  defenseEntryKeys: new Map(),
  chainKeys: new Map(),
  tradeDepKeys: new Map(),
  gapKeys: new Map(),
  quarterKeys: new Map(),
  landmarkStats: { total: 0, matchRoster: 0 },
  // anchor-keyed containers present on a generated record?
  anchorContainers: new Map(),
};

// The STRICT reference paths (the 32 that reference an institution, excluding the
// subject `institutions[].name`). Anything else found is polysemous or the subject.
const SERVICE_CATS = ['equipment', 'legal', 'healing', 'employment', 'entertainment', 'food', 'lodging', 'magic', 'information', 'transport', 'criminal'];
const DEFENSE_BUCKETS = ['garrison', 'magicDef', 'walls', 'watch', 'charter', 'mercenary', 'militia'];
const STRICT = new Set([
  ...SERVICE_CATS.map(c => `availableServices.${c}[].institution`),
  'economicState.activeChains[].processingInstitutions[]',
  'economicState.tradeDependencies[].institution',
  'economicState.activeChains[].dependency.institution',
  'resourceAnalysis.gaps[].institution',
  'resourceAnalysis.resourceChains[].processingInstitutions[]',
  'resourceAnalysis.exploitation.fullyExploited[].processingInstitutions[]',
  'resourceAnalysis.exploitation.partiallyExploited[].processingInstitutions[]',
  ...DEFENSE_BUCKETS.map(b => `defenseProfile.institutions.${b}[].name`),
  'npcs[].institution',
  'factions[].members[].institution',
  'npcs[].corruptTies.thievesGuild',
  'npcs[].corruptTies.criminalInstitution',
  'factions[].members[].corruptTies.thievesGuild',
  'factions[].members[].corruptTies.criminalInstitution',
  'npcs[].linkedInstitutionIds[]',
]);

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

  const insts = Array.isArray(s.institutions) ? s.institutions : [];
  const instNames = new Set(insts.map(i => String(i?.name ?? '')).filter(Boolean));

  for (const k of ['mapEdits', 'interiorEdits', 'fogSessions', 'userCanon', 'aiOverlays', 'dmLayer', 'decrees']) {
    if (s[k] !== undefined) bump(agg.anchorContainers, k);
  }

  // per-institution strict handle counts, and the pre-existing dangle count
  const perInst = new Map();
  let dangles = 0;
  walkStrings(s, (p, v, kind) => {
    const t = v.trim();
    if (!t) return;
    bump(agg.pathTotal, p);
    const kinds = agg.pathKind.get(p) || new Set();
    kinds.add(kind); agg.pathKind.set(p, kinds);
    if (instNames.has(t)) {
      bump(agg.pathMatch, p);
      if (STRICT.has(p)) { bump(perInst, t); agg.strictHandleTotal += 1; }
    } else if (STRICT.has(p)) {
      dangles += 1; bump(agg.danglePaths, p);
    }
    if (p === 'spatialLayout.quarters[].landmarks[]') {
      agg.landmarkStats.total += 1;
      if (instNames.has(t)) agg.landmarkStats.matchRoster += 1;
    }
  });

  agg.instTotal += insts.length;
  for (const name of instNames) {
    const n = perInst.get(name) || 0;
    bump(agg.instHandleHist, n);
    if (n > 0) agg.instWithHandles += 1;
    if (n > agg.maxHandles) { agg.maxHandles = n; agg.maxHandleName = `${name} (${tier})`; }
  }

  const rec = agg.dangleByTier.get(tier) || { rows: 0, list: [] };
  rec.rows += 1; rec.list.push(dangles);
  agg.dangleByTier.set(tier, rec);

  // entry shapes
  for (const cat of SERVICE_CATS) {
    for (const e of (Array.isArray(s.availableServices?.[cat]) ? s.availableServices[cat] : [])) {
      if (e && typeof e === 'object') for (const k of Object.keys(e)) bump(agg.serviceEntryKeys, k);
    }
  }
  for (const b of DEFENSE_BUCKETS) {
    for (const e of (Array.isArray(s.defenseProfile?.institutions?.[b]) ? s.defenseProfile.institutions[b] : [])) {
      if (e && typeof e === 'object') for (const k of Object.keys(e)) bump(agg.defenseEntryKeys, k);
    }
  }
  for (const c of (Array.isArray(s.economicState?.activeChains) ? s.economicState.activeChains : [])) {
    if (c && typeof c === 'object') for (const k of Object.keys(c)) bump(agg.chainKeys, k);
  }
  for (const c of (Array.isArray(s.economicState?.tradeDependencies) ? s.economicState.tradeDependencies : [])) {
    if (c && typeof c === 'object') for (const k of Object.keys(c)) bump(agg.tradeDepKeys, k);
  }
  for (const c of (Array.isArray(s.resourceAnalysis?.gaps) ? s.resourceAnalysis.gaps : [])) {
    if (c && typeof c === 'object') for (const k of Object.keys(c)) bump(agg.gapKeys, k);
  }
  for (const q of (Array.isArray(s.spatialLayout?.quarters) ? s.spatialLayout.quarters : [])) {
    if (q && typeof q === 'object') for (const k of Object.keys(q)) bump(agg.quarterKeys, k);
  }
}

const m2o = (m) => Object.fromEntries([...m.entries()].sort((a, b) => b[1] - a[1]));
const stats = (arr) => {
  const a = [...arr].sort((x, y) => x - y);
  return { min: a[0], median: a[Math.floor(a.length / 2)], max: a[a.length - 1], sum: a.reduce((p, c) => p + c, 0) };
};

const result = {
  which: WHICH, rows: agg.rows, seconds: Math.round((Date.now() - t0) / 100) / 10,
  instTotal: agg.instTotal,
  instWithHandles: agg.instWithHandles,
  strictHandleTotal: agg.strictHandleTotal,
  meanStrictHandles: Math.round((agg.strictHandleTotal / agg.instTotal) * 1000) / 1000,
  maxHandles: agg.maxHandles, maxHandleName: agg.maxHandleName,
  instHandleHist: Object.fromEntries([...agg.instHandleHist.entries()].sort((a, b) => a[0] - b[0])),
  pathTotal: m2o(agg.pathTotal),
  pathMatch: m2o(agg.pathMatch),
  pathKind: Object.fromEntries([...agg.pathKind.entries()].map(([k, v]) => [k, [...v]])),
  danglePaths: m2o(agg.danglePaths),
  dangleByTier: Object.fromEntries([...agg.dangleByTier.entries()].map(([k, v]) => [k, { rows: v.rows, ...stats(v.list) }])),
  landmarkStats: agg.landmarkStats,
  serviceEntryKeys: m2o(agg.serviceEntryKeys),
  defenseEntryKeys: m2o(agg.defenseEntryKeys),
  chainKeys: m2o(agg.chainKeys),
  tradeDepKeys: m2o(agg.tradeDepKeys),
  gapKeys: m2o(agg.gapKeys),
  quarterKeys: m2o(agg.quarterKeys),
  anchorContainers: m2o(agg.anchorContainers),
};
writeFileSync(`${OUT}/surfaces-${WHICH}.json`, JSON.stringify(result, null, 2));
console.log(`rows=${agg.rows} seconds=${result.seconds}`);
console.log('institutions', agg.instTotal, 'withHandles', agg.instWithHandles,
  `(${Math.round((agg.instWithHandles / agg.instTotal) * 1000) / 10}%)`,
  'strictHandles', agg.strictHandleTotal, 'mean', result.meanStrictHandles,
  'max', agg.maxHandles, agg.maxHandleName);
console.log('dangleByTier', JSON.stringify(result.dangleByTier));
console.log('anchorContainers on a generated record:', JSON.stringify(result.anchorContainers));
console.log('serviceEntryKeys', JSON.stringify(result.serviceEntryKeys));
console.log('defenseEntryKeys', JSON.stringify(result.defenseEntryKeys));
console.log('chainKeys', JSON.stringify(result.chainKeys));
console.log('tradeDepKeys', JSON.stringify(result.tradeDepKeys));
console.log('gapKeys', JSON.stringify(result.gapKeys));
console.log('quarterKeys', JSON.stringify(result.quarterKeys));
