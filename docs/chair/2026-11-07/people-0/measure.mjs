// PEOPLE-0 measurement (2026-11-07). Measure-only: births settlements, writes one JSON line each.
//   node docs/chair/2026-11-07/people-0/measure.mjs golden <out.jsonl>
//   node docs/chair/2026-11-07/people-0/measure.mjs soak <out.jsonl> [from] [to]
import { appendFileSync, writeFileSync } from 'node:fs';
import { INSTITUTION_FAMILIES, isFabricInstitution, familyNamesByTier } from '../../../../src/data/institutionalCatalog.js';
import { backingRowFor } from '../../../../src/data/institutionBacking.js';
import { houseBacksOf } from '../../../../src/domain/dossier/powerSupport.js';
import { factionArchetype } from '../../../../src/domain/factionArchetypes.js';
import { collectPlotHooks } from '../../../../src/domain/dossier/plotHooks.js';
import { generateSettlementPipeline } from '../../../../src/generators/generateSettlementPipeline.js';
import { FACES } from './faces.mjs';

const FAMILY_OF = new Map(); const SHELF_OF = new Map();
for (const f of INSTITUTION_FAMILIES) {
  const names = familyNamesByTier(f); const key = f.shared?.name || names[0].name;
  SHELF_OF.set(key, f.shelf);
  for (const n of names) if (!FAMILY_OF.has(n.name.toLowerCase())) FAMILY_OF.set(n.name.toLowerCase(), key);
}

function mulberry(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function hashStr(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

export function measure(s, label) {
  const tier = s.tier;
  const backs = houseBacksOf(s);
  const powers = (s.powerStructure?.factions || []).map((f) => ({ name: f.faction || f.name, cat: f.category || '', arch: factionArchetype(f) || '', gov: Boolean(f.isGoverning), power: Number(f.power) || 0 }));
  const houses = [];
  for (const inst of s.institutions || []) {
    const name = String(inst?.name || '');
    if (isFabricInstitution(inst)) { houses.push({ name, fam: FAMILY_OF.get(name.toLowerCase()) || null, v: 'fabric' }); continue; }
    const fam = FAMILY_OF.get(name.toLowerCase()) || null;
    const verdict = fam ? (FACES[fam]?.[0] || 'MISSING') : 'unplaced';
    const row = backingRowFor(name);
    const list = backs.get(name) || [];
    houses.push({ name, fam, shelf: fam ? SHELF_OF.get(fam) : inst.category, v: verdict, w: row ? row.weight : 1,
      backs: list.filter((b) => b.share > 0).map((b) => [b.faction, Math.round(b.share * 100) / 100]), dflt: list.length > 0 && list.every((b) => b.share === 0) });
  }
  // proposed membership: a face backs every power it has a share in (default-only houses: the seat at no weight)
  const reps = houses.filter((h) => h.v === 'face'); const repsJ = houses.filter((h) => h.v === 'face' || h.v === 'judge');
  const perPower = (set) => {
    const m = Object.fromEntries(powers.map((p) => [p.name, []]));
    for (const h of set) {
      if (h.backs.length) for (const [f, sh] of h.backs) { if (m[f]) m[f].push({ h: h.name, shelf: h.shelf, score: sh * Math.max(h.w, 0.5), w: h.w }); }
      else { const g = powers.find((p) => p.gov); if (g && m[g.name]) m[g.name].push({ h: h.name, shelf: h.shelf, score: 0, w: h.w }); }
    }
    return m;
  };
  const pp = perPower(reps); const ppJ = perPower(repsJ);
  const gov = powers.find((p) => p.gov);
  const govSeatFace = gov ? (pp[gov.name] || []).some((r) => r.shelf === 'Government') : false;
  // today's NPCs
  const npcs = s.npcs || [];
  const groups = (s.factions || []).map((g) => g.members?.length || 0);
  const rung = {}; for (const n of npcs) { const k = n.densityRungRole || 'none'; rung[k] = (rung[k] || 0) + 1; }
  const hooksPerNpc = npcs.map((n) => (n.plotHooks || []).length);
  // hooks
  const hooks = collectPlotHooks(s);
  const hk = {}; const party = {};
  for (const h of hooks) {
    const cat = h.crisis ? 'crisis' : (h.source === 'Traditions' ? 'tradition' : h.category);
    hk[cat] = (hk[cat] || 0) + 1;
    const kinds = [...new Set((h.links || []).map((l) => l.kind))].sort().join('+') || (h.category === 'history' ? 'historical' : 'none');
    party[kinds] = (party[kinds] || 0) + 1;
  }
  const rawHooks = { tensions: (s.history?.currentTensions || []).reduce((a, t) => a + (t.plotHooks || []).length, 0),
    events: (s.history?.historicalEvents || []).reduce((a, e) => a + (e.plotHooks || []).length, 0),
    conflicts: (s.conflicts || []).length, currentTensions: (s.history?.currentTensions || []).length, historicalEvents: (s.history?.historicalEvents || []).length };
  // relationships
  const rels = s.relationships || [];
  const deg = {}; const rk = {}; const pairRoles = {};
  for (const r of rels) { deg[r.npc1Id] = (deg[r.npc1Id] || 0) + 1; deg[r.npc2Id] = (deg[r.npc2Id] || 0) + 1; rk[r.type] = (rk[r.type] || 0) + 1;
    const ca = npcs.find((n) => n.id === r.npc1Id)?.category || '?'; const cb = npcs.find((n) => n.id === r.npc2Id)?.category || '?';
    const key = [ca, cb].sort().join('~'); pairRoles[key] = (pairRoles[key] || 0) + 1; }
  const degs = npcs.map((n) => deg[n.id] || 0);
  // one-outgoing simulation (PLAUSIBLE: a target weighted by house weight, ×3 when the pair share a power)
  const rnd = mulberry(hashStr(label));
  const inDeg = new Array(reps.length).fill(0);
  const repPowers = reps.map((h) => new Set(h.backs.map((b) => b[0])));
  for (let i = 0; i < reps.length; i += 1) {
    let tot = 0; const ws = reps.map((h, j) => { if (j === i) return 0; let w = Math.max(h.w, 0.5); for (const p of repPowers[i]) if (repPowers[j].has(p)) { w *= 3; break; } tot += w; return w; });
    if (tot <= 0) continue; let x = rnd() * tot; let j = 0; while (j < ws.length - 1 && x >= ws[j]) { x -= ws[j]; j += 1; } inDeg[j] += 1;
  }
  return { label, tier, pop: s.population, nInst: (s.institutions || []).length,
    v: houses.reduce((a, h) => ((a[h.v] = (a[h.v] || 0) + 1), a), {}),
    faces: reps.map((h) => h.fam), judges: houses.filter((h) => h.v === 'judge').map((h) => h.fam), missing: houses.filter((h) => h.v === 'MISSING' || h.v === 'unplaced').map((h) => h.name),
    powers: powers.map((p) => ({ ...p, reps: pp[p.name]?.length || 0, repsJ: ppJ[p.name]?.length || 0, top: (pp[p.name] || []).sort((a, b) => b.score - a.score).slice(0, 3).map((r) => r.w) })),
    govSeatFace, defaultOnly: reps.filter((h) => !h.backs.length).length, multiPower: reps.filter((h) => h.backs.length > 1).length,
    npcs: npcs.length, groups, rung, hooksPerNpc, npcsNoFaction: npcs.filter((n) => !n.factionAffiliation).length,
    hk, party, nHooks: hooks.length, rawHooks, nRels: rels.length, rk, pairRoles, degs, inDeg,
    crisisEntries: (s.stress && (Array.isArray(s.stress) ? s.stress.length : (s.stress.type ? 1 : 0))) || 0 };
}

const [mode, out, from = '0', to = '1000'] = process.argv.slice(2);
if (mode) {
  writeFileSync(out, '');
  if (mode === 'golden') {
    const { goldenCorpus, keyOf } = await import('../../../../tests/helpers/goldenMasterCorpus.js');
    const rows = goldenCorpus();
    for (const cfg of rows) {
      const { _seed, ...rest } = cfg;
      const s = generateSettlementPipeline(rest, null, { seed: _seed, customContent: {} });
      appendFileSync(out, JSON.stringify(measure(s, keyOf(cfg))) + '\n');
    }
  } else {
    const { birth, ensureLaws } = await import('../../../../scripts/audit/soak-review/corpus.mjs');
    await ensureLaws();
    for (let i = Number(from); i < Number(to); i += 1) {
      const s = birth(i).settlement;
      appendFileSync(out, JSON.stringify(measure(s, `soak1k-${i}`)) + '\n');
    }
  }
}
