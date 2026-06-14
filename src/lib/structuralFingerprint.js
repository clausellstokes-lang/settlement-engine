/**
 * structuralFingerprint.js — privacy-safe structural extraction (Plane 2 core).
 *
 * THE INVERSE of a sanitizer: instead of stripping known-bad fields, this COPIES
 * ONLY KNOWN-GOOD PATHS — primitives, enums, bands, counts. Prose, names, and
 * secrets cannot enter the output by construction. The guarantee is a TEST
 * (tests/lib/structuralFingerprint.test.js recursively scans output for fixture
 * names/secrets/prose), not a convention.
 *
 *   - extractReducedFingerprint(settlement) — enum/count-only; ESSENTIAL class
 *     (folds into generation_completed props; no research consent needed).
 *   - extractSettlementFingerprint(settlement, save?) — full structural payload;
 *     RESEARCH class (the _seed and richer arrays require explicit opt-in).
 *
 * NEVER copied: settlement.name; any npc field (name/personality/goal/secret);
 * institution/faction names; all prose (history, hooks, dailyLife, thesis,
 * dmCompass, notes); dossierNotes; eventLog labels; map coordinates; emails.
 */

import { deriveCausalState, SYSTEM_VARIABLES } from '../domain/causalState.js';

// ── Banding helpers ──────────────────────────────────────────────────────────
export function populationBand(pop) {
  const n = Number(pop) || 0;
  if (n < 100) return 'hamlet_lt100';
  if (n < 500) return 'village_100_500';
  if (n < 2000) return 'small_town_500_2k';
  if (n < 10000) return 'town_2k_10k';
  return 'city_gt_10k';
}
/** Generic 5-band quintile of a 0–100 score. */
export function band5(score) {
  const n = Number(score);
  if (!Number.isFinite(n)) return 'unknown';
  if (n < 20) return 'b0';
  if (n < 40) return 'b1';
  if (n < 60) return 'b2';
  if (n < 80) return 'b3';
  return 'b4';
}
export function severityBand(sev) {
  const n = Number(sev);
  if (!Number.isFinite(n)) return 'unknown';
  if (n < 0.25) return 'low';
  if (n < 0.5) return 'moderate';
  if (n < 0.75) return 'high';
  return 'severe';
}

const arr = (v) => (Array.isArray(v) ? v : []);
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : undefined);
const str = (v) => (typeof v === 'string' && v.length <= 64 ? v : undefined); // enum-length guard

/** Counts of array entries grouped by a single enum field. */
function countByCategory(list, field) {
  const out = {};
  for (const item of arr(list)) {
    const key = str(item?.[field]) || 'unknown';
    out[key] = (out[key] || 0) + 1;
  }
  return out;
}

// ── Causal: scores + bands ONLY (contributors carry text — dropped) ──────────
function causalDigest(settlement) {
  let derived;
  try { derived = deriveCausalState(settlement); } catch { return { scores: {}, bands: {} }; }
  const variables = derived?.variables || derived || {};
  const scores = {}; const bands = {};
  for (const name of SYSTEM_VARIABLES) {
    const v = variables[name];
    if (!v) continue;
    if (num(v.score) !== undefined) scores[name] = v.score;
    if (str(v.band)) bands[name] = v.band;
  }
  return { scores, bands };
}

// ── Reduced fingerprint — ESSENTIAL (enums + counts only) ────────────────────
export function extractReducedFingerprint(settlement) {
  if (!settlement || typeof settlement !== 'object') return null;
  const cfg = settlement.config || {};
  const { bands } = causalDigest(settlement);
  return {
    tier: str(settlement.tier),
    population_band: populationBand(settlement.population),
    culture: str(cfg.culture),
    terrainType: str(cfg.terrainType),
    tradeRouteAccess: str(cfg.tradeRouteAccess),
    magicLevel: str(cfg.magicLevel),
    monsterThreat: str(cfg.monsterThreat),
    prosperity: str(settlement.economicState?.prosperity),
    stressor_count: arr(settlement.stressors || settlement.stress).length,
    condition_count: arr(settlement.activeConditions).length,
    institution_count: arr(settlement.institutions).length,
    npc_count: arr(settlement.npcs).length,
    faction_count: arr(settlement.powerStructure?.factions).length,
    causal_bands: bands,
  };
}

// ── Full fingerprint — RESEARCH (structural arrays, still no prose/names) ─────
export function extractSettlementFingerprint(settlement, save = null) {
  if (!settlement || typeof settlement !== 'object') return null;
  const cfg = settlement.config || {};
  const eco = settlement.economicState || {};
  const power = settlement.powerStructure || {};
  const causal = causalDigest(settlement);

  const fp = {
    // identity / versioning
    schemaVersion: str(settlement.schemaVersion),
    generatorVersion: str(settlement.generatorVersion),
    seed: str(settlement._seed) || str(settlement.config?._seed), // research-tier; replays procedural output, never user edits
    tier: str(settlement.tier),
    population_band: populationBand(settlement.population),
    // config
    config: {
      culture: str(cfg.culture),
      terrainType: str(cfg.terrainType),
      tradeRouteAccess: str(cfg.tradeRouteAccess),
      magicLevel: str(cfg.magicLevel),
      monsterThreat: str(cfg.monsterThreat),
      selectedStresses: arr(cfg.selectedStresses).map(str).filter(Boolean),
    },
    // economy (category ids / labels — catalog enums, not user content)
    economy: {
      prosperity: str(eco.prosperity),
      food_resilience: num(eco.foodSecurity?.resilienceScore),
      primaryExports: arr(eco.primaryExports).map(str).filter(Boolean),
      primaryImports: arr(eco.primaryImports).map(str).filter(Boolean),
    },
    // power — faction NAMES dropped; topology preserved via stable indices
    power: {
      legitimacy_score: num(power.publicLegitimacy?.score),
      legitimacy_label: str(power.publicLegitimacy?.label),
      factions: arr(power.factions).map((f, i) => ({
        idx: `f${i}`,
        category: str(f?.category),
        power_band: band5(f?.power),
      })),
      conflict_count: arr(power.conflicts).length,
    },
    // defense
    defense: {
      scores: {
        military: num(settlement.defenseProfile?.scores?.military),
        monster: num(settlement.defenseProfile?.scores?.monster),
        internal: num(settlement.defenseProfile?.scores?.internal),
        economic: num(settlement.defenseProfile?.scores?.economic),
        magical: num(settlement.defenseProfile?.scores?.magical),
      },
      readiness: str(settlement.defenseProfile?.readiness?.label),
    },
    // stress / conditions — archetype ids + bands only
    conditions: arr(settlement.activeConditions).map(c => ({
      archetype: str(c?.archetype),
      severityBand: severityBand(c?.severity),
      status: str(c?.status),
      affectedSystems: arr(c?.affectedSystems).map(str).filter(Boolean),
    })),
    // institutions / npcs — counts + category distributions, never names
    institutions_by_category: countByCategory(settlement.institutions, 'category'),
    npc_count: arr(settlement.npcs).length,
    npc_importance_dist: countByCategory(settlement.npcs, 'importance'),
    relationship_count: arr(settlement.relationships).length,
    hook_count: arr(settlement.plotHooks || settlement.hooks).length,
    service_count: arr(settlement.services).length,
    // neighbours — relationship types only
    neighbours: arr(settlement.neighbourNetwork || settlement.neighbours)
      .map(n => str(n?.relationshipType)).filter(Boolean),
    // causal — scores + bands (contributors dropped)
    causal,
  };

  // lifecycle (from the save envelope, if provided)
  if (save && typeof save === 'object') {
    const cs = save.campaignState || {};
    fp.lifecycle = {
      phase: str(cs.phase),
      eventLog_count: arr(cs.eventLog).length,
      versionHistory_count: arr(save.versionHistory).length,
    };
    const ai = save.aiData || save.ai_data;
    if (ai && typeof ai === 'object') {
      fp.ai = {
        has_narrative: !!ai.aiSettlement,
        has_daily_life: !!ai.aiDailyLife,
        narrativeMode: str(ai.narrativeMode),
      };
    }
  }
  return fp;
}

// ── Stable stringify + hash ──────────────────────────────────────────────────
/** Deterministic JSON with sorted keys (so the same fingerprint hashes equal). */
export function stableStringify(value) {
  const seen = new WeakSet();
  const walk = (v) => {
    if (v === null || typeof v !== 'object') return v;
    if (seen.has(v)) return null;
    seen.add(v);
    if (Array.isArray(v)) return v.map(walk);
    const out = {};
    for (const k of Object.keys(v).sort()) {
      if (v[k] === undefined) continue;
      out[k] = walk(v[k]);
    }
    return out;
  };
  return JSON.stringify(walk(value));
}

/** Truncated SHA-256 of the stable string; FNV-1a fallback where crypto absent. */
export async function computeFingerprintHash(fingerprint) {
  const s = stableStringify(fingerprint);
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
    }
  } catch { /* fall through */ }
  // FNV-1a 32-bit fallback (non-crypto; fine for client-side dedup/chaining).
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return ('00000000' + (h >>> 0).toString(16)).slice(-8);
}
