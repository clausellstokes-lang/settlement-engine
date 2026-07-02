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
 * dmCompass, notes); dossierNotes; eventLog labels; map coordinates; emails;
 * user-authored trade-good labels (ADD_TRADE_GOOD / custom content — folded
 * to catalog ids or counted, see tradeGoodIdList).
 */

import { deriveCausalState, SYSTEM_VARIABLES } from '../domain/causalState.js';
import { normalizeGood } from '../domain/region/goodsCatalog.js';

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

/** Counts grouped by an arbitrary key accessor (numeric keys → strings). */
function countBy(list, keyFn) {
  const out = {};
  for (const item of arr(list)) {
    let k = keyFn(item);
    if (k == null) continue;
    k = typeof k === 'string' ? (k.length <= 48 ? k : null) : String(k);
    if (k == null) continue;
    out[k] = (out[k] || 0) + 1;
  }
  return out;
}

/**
 * NPC goal/role/evolution distributions — generation-time roster (settlement.npcs)
 * plus the campaign sim-state (save.campaignState.worldState.npcStates), which
 * carries the enum GOALS / role archetypes / dot-rank / faction seat that evolve
 * over world pulses. ALL enum/count distributions — never names, goal prose, or
 * personality. The sim-state block only appears once a campaign has pulsed.
 */
function npcDistributions(settlement, save, opts = {}) {
  const npcs = arr(settlement?.npcs);
  // npcStates live on the CAMPAIGN worldState (passed via opts), not on a per-save
  // campaignState — the old save.campaignState.worldState path was always empty.
  const statesObj = opts.npcStates || save?.campaignState?.worldState?.npcStates;
  let states = statesObj && typeof statesObj === 'object' ? Object.values(statesObj) : [];
  // Filter to THIS settlement's NPCs so a per-settlement snapshot doesn't fold in
  // the whole campaign's sim-state (npcState records carry settlementId).
  if (opts.settlementUuid != null) {
    const sid = String(opts.settlementUuid);
    states = states.filter(s => String(s?.settlementId) === sid);
  }
  const block = {
    category_dist: countByCategory(npcs, 'category'),
    influence_dist: countByCategory(npcs, 'influence'),
    structural_rank_dist: countByCategory(npcs, 'structuralRank'),
    corrupt_count: npcs.filter(n => n?.corrupt).length,
  };
  if (states.length) {
    block.role_archetype_dist = countByCategory(states, 'roleArchetype');
    block.dotrank_dist = countBy(states, s => s?.dotRank);
    block.seat_dist = countByCategory(states, 'factionSeat');
    const goalDist = {};
    for (const s of states) {
      for (const g of [s?.shortGoal, s?.longGoal]) {
        const k = str(g);
        if (k) goalDist[k] = (goalDist[k] || 0) + 1;
      }
    }
    block.goal_dist = goalDist;
    block.ousted_count = states.filter(s => s?.ousted).length;
  }
  return block;
}

/**
 * Trade lists → canonical catalog good/service ids ONLY. primaryExports /
 * primaryImports are NOT catalog-pure: ADD_TRADE_GOOD (event composer) and
 * custom-content trade goods write user-authored labels verbatim into
 * economicState. normalizeGood folds catalog labels/aliases to stable ids;
 * anything it can't resolve comes back as a custom.<slug> entry whose slug
 * still carries the user's text — those are COUNTED, never copied.
 */
function tradeGoodIdList(list) {
  const ids = [];
  const seen = new Set();
  let customCount = 0;
  for (const item of arr(list)) {
    let good;
    try { good = normalizeGood(item); } catch { good = null; }
    if (!good) continue;
    if (good.custom) { customCount += 1; continue; }
    if (!seen.has(good.id)) { seen.add(good.id); ids.push(good.id); }
  }
  return { ids, customCount };
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
export function extractSettlementFingerprint(settlement, save = null, opts = {}) {
  if (!settlement || typeof settlement !== 'object') return null;
  const cfg = settlement.config || {};
  const eco = settlement.economicState || {};
  const power = settlement.powerStructure || {};
  const causal = causalDigest(settlement);
  const tradeExports = tradeGoodIdList(eco.primaryExports);
  const tradeImports = tradeGoodIdList(eco.primaryImports);

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
    // economy (canonical catalog ids only — user-authored labels counted, not copied)
    economy: {
      prosperity: str(eco.prosperity),
      food_resilience: num(eco.foodSecurity?.resilienceScore),
      primaryExports: tradeExports.ids,
      primaryImports: tradeImports.ids,
      custom_export_count: tradeExports.customCount,
      custom_import_count: tradeImports.customCount,
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
    // npc goals + evolution (generation-time roster + sim-state from the
    // campaign world; all enum/count distributions, never names/goal-prose)
    npc: npcDistributions(settlement, save, opts),
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

// ── Generation variance: config signature + stressor genesis ─────────────────
// The variance question ("hold config constant, vary seed, measure the spread")
// needs a deterministic, SEED-INDEPENDENT key to GROUP BY. Nothing produced one:
// computeFingerprintHash hashes OUTPUT (seed-dependent). computeConfigSignature
// hashes the resolved-INTENT config (sentinels intact, _seed excluded), so two
// generations differing only by seed share a signature.

/** Sorted truthy keys of a toggle map (handles string- or object-valued maps). */
function toggleKeys(map, pred) {
  if (!map || typeof map !== 'object') return [];
  return Object.keys(map)
    .filter(k => pred(map[k]))
    .sort();
}

/** The canonical, enum/flag-only projection of config INTENT (pre-hash). */
function configProjection(config) {
  const cfg = config || {};
  const inst = cfg._institutionToggles || cfg.institutionToggles || {};
  const isRequire = (v) => v === 'require' || v === true || v?.require === true;
  const isExclude = (v) => v === 'exclude' || v === 'forceExclude' || v?.forceExclude === true || v?.exclude === true;
  const stresses = [
    ...arr(cfg.selectedStresses),
    ...arr(cfg.stressTypes),
    ...(cfg.stressType ? [cfg.stressType] : []),
  ].map(str).filter(Boolean);
  return {
    settType: str(cfg.settType),
    culture: str(cfg.culture),
    terrainType: str(cfg.terrainType) || str(cfg.terrainOverride),
    tradeRouteAccess: str(cfg.tradeRouteAccess),
    monsterThreat: str(cfg.monsterThreat),
    magicExists: !!cfg.magicExists,
    magicLevel: str(cfg.magicLevel),
    // priorities collapse to the literal 'random' when the slider mode rolls
    // them per-generation — so a randomized-priority config has ONE signature.
    priorities: cfg._randomizePriorities
      ? 'random'
      : {
          economy: num(cfg.priorityEconomy), military: num(cfg.priorityMilitary),
          religion: num(cfg.priorityReligion), criminal: num(cfg.priorityCriminal),
          magic: num(cfg.priorityMagic),
        },
    nearbyResourcesRandom: cfg.nearbyResourcesRandom !== false,
    forcedInstitutions: toggleKeys(inst, isRequire),
    excludedInstitutions: toggleKeys(inst, isExclude),
    categoryToggles: toggleKeys(cfg._categoryToggles || cfg.categoryToggles, Boolean),
    goodsToggles: toggleKeys(cfg._goodsToggles || cfg.goodsToggles, Boolean),
    servicesToggles: toggleKeys(cfg._servicesToggles || cfg.servicesToggles, Boolean),
    intendedStresses: [...new Set(stresses)].sort(),
    selectedStressesRandom: cfg.selectedStressesRandom !== false,
    neighbourPresent: !!(cfg._importedNeighbor || cfg._neighbourRelType || cfg.importedNeighbour),
    neighbourRel: str(cfg._neighbourRelType),
    customContent: cfg.useCustomContent !== false,
  };
}

/**
 * Deterministic, seed-independent config signature (16-hex). The raw projection
 * (which may name catalog institutions as toggle keys) is HASHED, so the emitted
 * value carries no names/prose — only a grouping key.
 */
export async function computeConfigSignature(config) {
  return computeFingerprintHash(configProjection(config));
}

/** True when any identity axis was left to chance (a moving-target generation). */
export function usedRandomSentinels(config) {
  const cfg = config || {};
  const rolled = (v) => typeof v === 'string' && (v === 'random' || v.startsWith('random'));
  return !!(
    cfg._randomizePriorities ||
    cfg.nearbyResourcesRandom !== false ||
    rolled(cfg.settType) || rolled(cfg.culture) || rolled(cfg.terrainType) ||
    rolled(cfg.tradeRouteAccess) || rolled(cfg.monsterThreat) || rolled(cfg.magicLevel)
  );
}

/**
 * Per-type stressor GENESIS at generation, derived from the in-object
 * simulationTrace (already records applied/emergent/declined/suppressed). Maps
 * each stressor TYPE → genesis enum. Non-personal: types are catalog ids; the
 * trace's reason prose is dropped.
 */
export function extractStressorGenesis(settlement) {
  const trace = arr(settlement?.simulationTrace);
  const out = {};
  for (const t of trace) {
    if (t?.targetType !== 'stressor') continue;
    const m = str(t.targetId)?.match(/^stressor\.(.+)$/);
    const type = m && m[1] && m[1].length <= 48 ? m[1] : null;
    if (!type) continue;
    const result = str(t.result);
    const source = str(arr(t.causes)[0]?.source);
    let genesis;
    if (result === 'emergent') genesis = 'generation';
    else if (result === 'declined') genesis = 'declined';
    else if (result === 'suppressed_by_institutions') genesis = 'suppressed';
    else if (result === 'applied') genesis = source === 'event' ? 'user_forced_post_gen' : 'user_forced_pre_gen';
    else continue;
    out[type] = genesis; // last write wins; an applied type overrides an earlier declined trace
  }
  return out;
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
