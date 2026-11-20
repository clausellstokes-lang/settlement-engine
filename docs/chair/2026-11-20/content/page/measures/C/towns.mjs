// PAGE-1 helper C: the chair's 300 towns (untouched settings), as the brief's recipe forges them, reduced to the
// fields section C reads. Shared by f4.mjs and f5.mjs. Import with the tree's absolute path as L.
// Recipe: origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/measures/holistic/batch2.mjs (first 10 lines).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

export async function loadTowns(L, nPerSize = 50, cache = null) {
  if (cache && existsSync(cache)) return JSON.parse(readFileSync(cache, 'utf8'));
  const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
  const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
  await loadGenerationLawPayloads();
  const towns = [];
  for (const size of SIZES) for (let i = 0; i < nPerSize; i++) {
    const seed = `hxd-${size}-${i}`;
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    towns.push({
      seed, size, tier: t.tier, name: t.name, stress: t.stress ? (t.stress.type || t.stress.label || true) : null,
      governingName: t.powerStructure?.governingName ?? null,
      factions: (t.powerStructure?.factions || []).map((f) => ({ faction: f.faction, category: f.category, isGoverning: !!f.isGoverning, power: f.power, powerLabel: f.powerLabel })),
      institutions: (t.institutions || []).map((i) => ({ name: i.name, category: i.category })),
      relationships: t.relationships || [], // the full ties: the card's tie lines are read from them (cardTies.js)
      npcsFull: t.npcs || [], // the full cards: the card's labels are computed by the display's own pure readers
      npcs: (t.npcs || []).map((n) => ({
        id: n.id, name: n.name, role: n.role, title: n.title, category: n.category, influence: n.influence, power: n.power,
        importance: n.importance, generatedAs: n.generatedAs ?? null, structuralRank: n.structuralRank, institution: n.institution || null, memberships: n.memberships || [],
        dominant: n.personality?.dominant ?? null, flaw: n.personality?.flaw ?? null,
        ambition: n.personality?.ambition ?? n.ambition ?? null, ideal: n.personality?.ideal ?? n.ideal ?? null,
        loyalty: n.loyalty ?? null, fear: n.fear ?? null,
        goal: n.goal ? { short: n.goal.short, long: n.goal.long, intent: n.goal.intent || null } : null,
        secret: n.secret ? (typeof n.secret === 'string' ? { what: n.secret } : { what: n.secret.what, stakes: n.secret.stakes }) : null,
        allegiance: n.allegiance ? { power: n.allegiance.power || null, house: n.allegiance.house || null } : null,
      })),
    });
  }
  if (cache) writeFileSync(cache, JSON.stringify(towns));
  return towns;
}

export const pct = (a, b) => (b ? `${(100 * a / b).toFixed(1)}%` : 'n/a');
export const tally = (a) => { const m = new Map(); for (const k of a) m.set(k, (m.get(k) || 0) + 1); return [...m].sort((x, y) => y[1] - x[1] || String(x[0]).localeCompare(String(y[0]))); };
