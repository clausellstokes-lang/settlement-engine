// born.mjs — RECONSTRUCTED by DEPTH-1 (the chair's owner-q3 born.mjs was not committed): batch.mjs's birth and masker; mulberry32 rng.
export const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
export async function bornAll(L, n = 50) {
  const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
  await loadGenerationLawPayloads();
  const towns = [];
  for (const size of SIZES) for (let i = 0; i < n; i++) { const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} }); if (t.tier !== size) t.tier = t.tier || size; towns.push(t); }
  return { towns, SIZES };
}
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function masker(t) {
  const names = new Set();
  const add = (s) => { if (typeof s === 'string' && s.trim().length > 2) names.add(s.trim()); };
  add(t.name);
  for (const n of t.npcs || []) { add(n.name); for (const p of String(n.name || '').split(/\s+/)) if (p.length > 3) add(p); add(n.institution); add(n.role); add(n.title); }
  for (const f of t.powerStructure?.factions || []) { add(f.faction); }
  add(t.powerStructure?.government); add(t.powerStructure?.governingName);
  for (const i of t.institutions || []) { add(i.name); add(String(i.name || '').replace(/\s*\(.*\)\s*$/, '')); }
  const list = [...names].sort((a, b) => b.length - a.length);
  const re = list.length ? new RegExp(list.map(esc).join('|'), 'gi') : null;
  return (s) => typeof s === 'string' ? (re ? s.replace(re, '§') : s).replace(/\b(the|The|a|an|A|An)\s+§/g, '§').replace(/\d+/g, '#') : '';
}
export function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
