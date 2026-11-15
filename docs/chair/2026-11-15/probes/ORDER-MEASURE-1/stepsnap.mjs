// ORDER-MEASURE-1 · the per-step snapshot instrument.
// TREE=<tree with snap-hooks.patch applied> SEEDS=<seeds.txt> OUT=<file.ndjson.gz> CFG=<CENSUS-3 seedcfg.mjs> node stepsnap.mjs
// Births each seed exactly as the census does (seedcfg.mjs), and at every pipeline step's end (the runner's own
// onStep hook) and at every assembly sub-step (the patch's globalThis.__OM_SNAP hooks) takes:
//   - the FACT FAMILIES' compact fingerprints (stored only when they change), and
//   - the set of PROSE strings (>= 4 words) the record holds at that moment.
// Writes, per town: the snapshot labels, each family's value at each change, and every FINAL prose string with the
// index-free path it sits at in the final record and the first snapshot at which that exact text existed (its BIRTH).
// Draw-free: the hooks read only; a birth through this instrument is byte-identical to a plain birth (checked by
// stepsnap-identity.mjs).
import fs from 'node:fs'; import zlib from 'node:zlib'; import crypto from 'node:crypto';
const R = process.env.TREE + '/src';
const { makeCfgFor } = await import(process.env.CFG);
const { generateSettlementPipeline } = await import(R + '/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + '/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R + '/store/configSlice.js');
await loadGenerationLawPayloads();
const cfgFor = makeCfgFor(birthConfig, DEFAULT_CONFIG);
const seeds = fs.readFileSync(process.env.SEEDS, 'utf8').trim().split('\n').filter(Boolean);

const RECORD_KEYS = new Set(['name', 'institutions', 'economicState', 'spatialLayout', 'availableServices', 'powerStructure',
  'settlementReason', 'npcs', 'relationships', 'conflicts', 'resourceAnalysis', 'economicViability', 'history', 'isolationSupport',
  'culturalIdentity', 'culturalNotes', 'stress', 'arrivalScene', 'defenseProfile', 'prominentRelationship', 'coherenceNotes',
  'pressureSentence', 'activeConditions', 'crisisCast', 'neighborRelationship', 'neighbourProfile', 'structuralViolations', 'structuralSuggestions']);
const isProse = (s) => typeof s === 'string' && s.length >= 16 && (s.match(/ /g) || []).length >= 3;
const proseOf = (view) => {
  const out = new Map();
  const walk = (x, p, d) => {
    if (d > 12 || x == null) return;
    if (typeof x === 'string') { if (isProse(x) && !out.has(x)) out.set(x, p); return; }
    if (typeof x !== 'object') return;
    if (Array.isArray(x)) { for (const y of x) walk(y, p + '[]', d + 1); return; }
    for (const k of Object.keys(x)) walk(x[k], p ? p + '.' + k : k, d + 1);
  };
  for (const k of Object.keys(view || {})) if (RECORD_KEYS.has(k)) walk(view[k], k, 0);
  return out;
};
const chainState = (c) => [c.chainId, c.status ?? c.state ?? null, c.resourceActive ?? null, c.resourceInputAvailable ?? null];
const FAM = {
  powers: (v) => { const ps = v.powerStructure; if (!ps) return null; return { gov: ps.governingName ?? null, f: (ps.factions || []).map((f) => [f.faction ?? f.name, f.category ?? null, f.power ?? null, f.powerLabel ?? null]) }; },
  powerText: (v) => { const ps = v.powerStructure; if (!ps) return null; return (ps.factions || []).map((f) => [f.faction ?? f.name, f.desc ?? null]); },
  houses: (v) => (v.institutions ? v.institutions.map((i) => i.name).sort() : null),
  chains: (v) => (v.economicState?.activeChains ? v.economicState.activeChains.map(chainState) : null),
  trade: (v) => { const e = v.economicState; if (!e) return null; return { x: e.primaryExports || [], m: e.primaryImports || [], n: (e.necessityImports || []).map((i) => (typeof i === 'string' ? i : i?.good ?? i?.name ?? JSON.stringify(i))) }; },
  income: (v) => { const e = v.economicState; if (!e) return null; return { p: e.prosperity ?? null, i: (e.incomeSources || []).map((s) => [s.source, s.percentage]) }; },
  food: (v) => { const f = v.economicState?.foodSecurity; if (!f) return null; return [f.label ?? null, f.deficitPct ?? null, f.surplusPct ?? null]; },
  safety: (v) => { const s = v.economicState?.safetyProfile; if (!s) return null; return [s.safetyLabel ?? null, (s.criminalInstitutions || []).map((c) => (typeof c === 'string' ? c : c?.name ?? null))]; },
  defence: (v) => { const d = v.defenseProfile; if (!d) return null; return { r: d.readiness?.label ?? null, s: d.scores ?? null }; },
  people: (v) => (v.npcs ? v.npcs.map((n) => [n.id, n.role ?? null, (n.memberships || []).map((m) => m.power).join('|'), n.institution?.key ?? null]) : null),
  ties: (v) => (v.relationships ? v.relationships.map((r) => [r.from, r.to, r.type]) : null),
  history: (v) => { const h = v.history; if (!h) return null; return { t: (h.currentTensions || []).map((t) => [t.type, (t.factions || []).join('|')]), e: (h.historicalEvents || []).length }; },
  stress: (v) => { const s = v.stress; if (!s) return null; return (Array.isArray(s) ? s : [s]).map((e) => e?.type ?? null); },
  conditions: (v) => (v.activeConditions ? v.activeConditions.map((c) => c.archetype ?? c.id) : null),
};
const FAMS = Object.keys(FAM);

const out = zlib.createGzip(); const done = new Promise((r) => out.pipe(fs.createWriteStream(process.env.OUT)).on('finish', r));
let n = 0, err = 0;
for (const seed of seeds) {
  const labels = []; const fam = Object.fromEntries(FAMS.map((k) => [k, []])); const last = {}; const birth = new Map();
  const snap = (label, view) => {
    const i = labels.length; labels.push(label);
    for (const k of FAMS) { let v; try { v = JSON.stringify(FAM[k](view)); } catch { v = '"ERR"'; } if (v !== last[k]) { fam[k].push([i, v === undefined ? null : JSON.parse(v)]); last[k] = v; } }
    for (const t of proseOf(view).keys()) if (!birth.has(t)) birth.set(t, i);
  };
  globalThis.__OM_SNAP = (label, settlement) => snap(label, settlement);
  try {
    const s = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {},
      onStep: (name, ctx) => snap(name, name === 'assembleSettlement' || name === 'resolveCrisisCast' ? ctx.settlement : ctx) });
    snap('FINAL', s);
    const fin = proseOf(s);
    const prose = [...fin].map(([t, p]) => [p, birth.get(t), t]);
    const h = crypto.createHash('sha256').update(JSON.stringify(s)).digest('hex').slice(0, 16);
    out.write(JSON.stringify({ seed, h, labels, fam, prose }) + '\n'); n++;
  } catch (e) { err++; console.error(seed, e.message); }
}
globalThis.__OM_SNAP = undefined;
out.end(); await done; console.log('snapped', n, 'errors', err);
process.exit(err || n !== seeds.length ? 1 : 0);
