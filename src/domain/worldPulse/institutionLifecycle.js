/**
 * worldPulse/institutionLifecycle.js — economic growth/decline of institutions.
 *
 * A settlement whose economy is STABLY healthy over several consecutive ticks
 * has a damped chance to BUILD an institution that fills a missing supply-chain
 * step available at its tier (a smithy with iron deposits but no mine grows a
 * mine; a mine with no downstream works grows the works). A settlement whose
 * economy is stably distressed has a small damped chance to CLOSE an
 * institution — ordered by necessity, so the institutions anchoring the
 * settlement's economic makeup (export anchors, chain processors) close LAST
 * and impaired low-contribution institutions close FIRST. Closures are
 * deliberately uncommon: plausible decay, not collapse.
 *
 * Deliberately DISTINCT from the corruption/criminal loop (which RAMPS when
 * the economy is bad): criminal institutions are excluded from both build and
 * closure here, and the health signal is the causal economy composite — not
 * readCorruptionClimate's crime/security climate — so the two loops never
 * double-count the same downturn.
 *
 * Damping (the no-runaway contract):
 *   • Hysteresis — nothing happens until the SAME direction holds for a
 *     minimum streak of ticks; neutral ticks decay the streak; flips reset it.
 *   • Saturation — builds only target detected gaps, and each build closes its
 *     own gap; closures shield high-contribution institutions multiplicatively
 *     and every prior lifecycle event makes the next one harder.
 *   • Clamps — every probability is clamped to a tuned [min, max] band, rolled
 *     centrally by rollCandidates (volatility-scaled, budget-capped).
 *
 * Pure module: no rng, no store, no Date. Candidates carry their probability;
 * the single roll happens in rollCandidates (the tierResourceDynamics path).
 */

import { SUPPLY_CHAIN_NEEDS, RESOURCE_TO_CHAINS } from '../../data/supplyChainData.js';
import { RESOURCE_DATA } from '../../data/resourceData.js';
import { TIER_ORDER, tierAtLeast } from '../../data/constants.js';
import { computeActiveChains, institutionMatchesProcessor } from '../../generators/computeActiveChains.js';
import { institutionHasTag, TAG } from '../../lib/entities.js';
import { stablePart } from './worldState.js';
import { exactGoodId } from '../region/goodsCatalog.js';
import { normalizeSimulationRules, intensityMultiplier } from './simulationRules.js';
import { entriesForTier, catalogEntryByName, existingInstitutionNames } from './tierResourceDynamics.js';

const clamp01 = (x) => (Number.isFinite(x) ? Math.max(0, Math.min(1, x)) : 0);
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));

// Codepoint tiebreak, NOT localeCompare: these sorts decide WHICH institution
// is built or closed, and default-locale collation can reorder names across
// machines, breaking replay determinism (the seedBetrayalTraitor rule in
// applyWorldPulse.js).
const byCodepoint = (a, b) => {
  const x = String(a);
  const y = String(b);
  return x < y ? -1 : x > y ? 1 : 0;
};

// ── Tuning (every coefficient of the lifecycle in one place) ─────────────────
export const INSTITUTION_LIFECYCLE_TUNING = Object.freeze({
  // Economy-health thresholds on the 0..1 causal composite (0.5 = neutral).
  // The dead band between them is hysteresis: neutral ticks decay streaks.
  thresholds: Object.freeze({ prosperous: 0.62, declining: 0.4 }),
  // Streaks are capped so the dead-band decay window stays bounded: without a
  // cap, a 40-tick decline followed by years in the neutral band would keep
  // the settlement one bad tick away from an instant full-bonus closure —
  // the gate would be satisfied by ancient history, not current stability.
  streakCap: 10,
  // Builds: gated on a prosperity streak; chance grows with the streak and the
  // gap's resource affinity; every institution already built this way makes
  // the next one harder (a settlement does not sprawl unboundedly).
  build: Object.freeze({
    requiredStreak: 3,
    base: 0.1,
    streakStep: 0.05,
    streakBonusMax: 0.15,
    health: 0.15,
    affinity: 0.1,
    priorBuildPenalty: 0.35,
    min: 0.02,
    max: 0.35,
    cooldownTicks: 2,
  }),
  // Closures: longer streak gate and a lower band than builds — plausible but
  // uncommon. Contribution shields multiplicatively (the export-anchor smithy
  // is close to unclosable); impairment boosts; prior closures damp hard.
  close: Object.freeze({
    requiredStreak: 4,
    base: 0.04,
    streakStep: 0.02,
    streakBonusMax: 0.08,
    distress: 0.1,
    impairedBoost: 0.6,
    contributionShield: 2.5,
    priorClosePenalty: 0.6,
    min: 0.01,
    max: 0.15,
    cooldownTicks: 3,
  }),
  // Contribution weights — how much an institution anchors the economic makeup.
  contribution: Object.freeze({ exportAnchor: 0.6, chainProcessor: 0.4, foodAnchor: 0.4 }),
  // Gap affinity by kind: a dedicated extraction site for a worked resource is
  // the most natural growth; generic downstream expansion the least.
  gapAffinity: Object.freeze({ extraction: 0.9, upstream: 0.7, downstream: 0.45 }),
  // instBoost fraction (RESOURCE_DATA) at/above which a fragment counts as the
  // resource's dedicated extraction/refining institution.
  extractionBoostFloor: 2.0,
});

// ── Economy health (causal scores → 0..1, high = good) ──────────────────────
// Mirrors the pressure model's 'economy' composite (pressureModel.js) without
// the inversion: the mean of the four causal economy scores. deriveSystemState
// is display-only (project memory) — sim health comes from causal.scores.
const ECONOMY_SCORE_KEYS = Object.freeze(['trade_connectivity', 'labor_capacity', 'infrastructure_condition', 'food_security']);

export function economyHealthScore(scores = {}) {
  let total = 0;
  for (const key of ECONOMY_SCORE_KEYS) {
    const value = Number(scores?.[key]);
    total += Number.isFinite(value) ? clamp(value, 0, 100) : 50;
  }
  return clamp01(total / ECONOMY_SCORE_KEYS.length / 100);
}

/** 'prosperous' | 'declining' | null (the dead band between thresholds). */
export function classifyEconomyDirection(health) {
  const t = INSTITUTION_LIFECYCLE_TUNING.thresholds;
  if (health >= t.prosperous) return 'prosperous';
  if (health <= t.declining) return 'declining';
  return null;
}

// ── Roster helpers ───────────────────────────────────────────────────────────
function activeInstitutions(settlement) {
  return (settlement?.institutions || []).filter(
    inst => inst && inst.status !== 'removed' && inst.status !== 'destroyed' && !inst._worldPulseInactive,
  );
}

function resourceList(settlement) {
  return [
    ...(settlement?.config?.nearbyResources || []),
    ...(settlement?.nearbyResources || []),
  ].filter(Boolean).map(String).filter((value, index, arr) => arr.indexOf(value) === index);
}

function depletedResources(settlement) {
  const depleted = new Set(settlement?.config?.nearbyResourcesDepleted || settlement?.nearbyResourcesDepleted || []);
  const states = settlement?.config?.nearbyResourcesState || {};
  for (const [key, state] of Object.entries(states)) {
    if (state === 'depleted') depleted.add(key);
    else depleted.delete(key);
  }
  return [...depleted];
}

function settlementTier(settlement) {
  return TIER_ORDER.includes(settlement?.tier) ? settlement.tier : 'village';
}

function tradeAccess(settlement) {
  return settlement?.economicState?.tradeAccess || settlement?.config?.tradeRouteAccess || 'road';
}

/** Fresh chain derivation — stored economicState.activeChains is generation-
 *  time stale, so the lifecycle recomputes from the live roster every tick. */
export function deriveLifecycleChains(settlement) {
  const tier = settlementTier(settlement);
  const insts = activeInstitutions(settlement);
  return computeActiveChains(
    insts,
    resourceList(settlement),
    tier,
    tradeAccess(settlement),
    [],
    depletedResources(settlement),
    Number.isFinite(settlement?.config?.priorityMagic) ? settlement.config.priorityMagic : 50,
  );
}

// Chains the lifecycle never builds toward: the criminal economy belongs to
// the corruption loop, and arcane chains follow magic priority, not economics.
const EXCLUDED_NEED_KEYS = new Set(['criminal_economy', 'arcane_magical']);

function tierRankOf(tier) {
  const idx = TIER_ORDER.indexOf(tier);
  return idx >= 0 ? idx : TIER_ORDER.indexOf('village');
}

function chainCatalogEntries(innerChainId) {
  const matches = [];
  for (const [needKey, need] of Object.entries(SUPPLY_CHAIN_NEEDS)) {
    if (EXCLUDED_NEED_KEYS.has(needKey)) continue;
    for (const chain of need.chains || []) {
      if (chain.id === innerChainId) matches.push({ needKey, chain });
    }
  }
  return matches;
}

function resourceFeedsChain(localResources, depletedSet, needKey, innerChainId) {
  const composite = `${needKey}.${innerChainId}`;
  return localResources.some(rk => !depletedSet.has(rk) && (RESOURCE_TO_CHAINS[rk] || []).includes(composite));
}

function namesOverlap(a, b) {
  const x = String(a || '').toLowerCase();
  const y = String(b || '').toLowerCase();
  if (!x || !y) return false;
  return x === y || x.includes(y) || y.includes(x);
}

/** The cheap generation gates a candidate entry must pass before the pulse
 *  may erect it: tier-legal, no unverifiable constraints, no roster collision. */
function passesBuildGates(entry, settlement, existingNames) {
  if (!entry) return null;
  const tier = settlementTier(settlement);
  if (entry.nativeTier && !tierAtLeast(tier, entry.nativeTier)) return null;
  if (entry.spec.minTier && !tierAtLeast(tier, entry.spec.minTier)) return null;
  // Conservative gates: skip anything with generation-time constraints the
  // pulse cannot verify (terrain, bespoke exclusion predicates).
  if (entry.spec.terrainRequired || entry.spec.terrainAccess || entry.spec.exclusionConditions) return null;
  const access = tradeAccess(settlement);
  if (Array.isArray(entry.spec.forbiddenTradeRoutes) && entry.spec.forbiddenTradeRoutes.includes(access)) return null;
  if (entry.spec.tradeRouteRequired) {
    const required = Array.isArray(entry.spec.tradeRouteRequired) ? entry.spec.tradeRouteRequired : [entry.spec.tradeRouteRequired];
    if (!required.includes(access)) return null;
  }
  // Substring overlap either way blocks upgrade-chain doubles ('Blacksmith' vs
  // 'Blacksmiths (3-10)') and the external-mill alias trap.
  for (const existing of existingNames) {
    if (namesOverlap(existing, entry.name)) return null;
  }
  if (entry.spec.exclusiveGroup) {
    for (const existing of existingNames) {
      const other = catalogEntryByName(existing);
      if (other?.spec?.exclusiveGroup === entry.spec.exclusiveGroup) return null;
    }
  }
  return entry;
}

/** A catalog entry the settlement could actually erect, by exact name. */
function buildableCatalogEntry(name, settlement, existingNames) {
  return passesBuildGates(catalogEntryByName(name), settlement, existingNames);
}

/**
 * Chain processingInstitutions strings were written for computeActiveChains'
 * fuzzy 12-char-prefix matcher, not as exact catalog names — an exact-name
 * join silently drops the chains whose processor spelling differs from the
 * catalog at that tier ('Barracks (town)' vs 'Barracks'). Resolve them with
 * the same bidirectional prefix idiom the chain code uses for dependencies,
 * then emit the resolved EXACT catalog name (every economic join is
 * name-keyed, so only real catalog names may ever reach a build patch).
 */
function buildableEntryForProcessor(pattern, settlement, existingNames) {
  const exact = buildableCatalogEntry(pattern, settlement, existingNames);
  if (exact) return exact;
  const p = String(pattern || '').toLowerCase();
  if (!p) return null;
  const pSlice = p.slice(0, 12);
  const maxRank = tierRankOf(settlementTier(settlement));
  const matches = [];
  const seen = new Set();
  for (let rank = 0; rank <= maxRank; rank++) {
    const nativeTier = TIER_ORDER[rank];
    for (const entry of entriesForTier(nativeTier)) {
      const n = entry.name.toLowerCase();
      if (seen.has(n)) continue;
      if (n.includes(pSlice) || p.includes(n.slice(0, 12))) {
        seen.add(n);
        matches.push({ ...entry, nativeTier });
      }
    }
  }
  matches.sort((a, b) => byCodepoint(a.name, b.name));
  for (const match of matches) {
    const entry = passesBuildGates(match, settlement, existingNames);
    if (entry) return entry;
  }
  return null;
}

/**
 * Missing supply-chain steps the settlement could plausibly grow at its tier.
 * Three families, all anchored to the LIVE local economy:
 *   extraction — a worked resource with no dedicated extraction/refining site
 *                (the smithy-with-ore-but-no-mine case);
 *   upstream   — an active chain importing an intermediate it could source
 *                locally (chain.upstreamMissing);
 *   downstream — an inactive tier-legal chain fed by an active local chain or
 *                a local resource (the mine-with-no-works case).
 * Returns [{name, category, spec, nativeTier, kind, affinity, reason, context}]
 * sorted best-first, deduped by institution name. Pure + deterministic.
 */
export function detectInstitutionGaps(settlement, precomputedChains = null) {
  if (!settlement) return [];
  const chains = precomputedChains || deriveLifecycleChains(settlement);
  const existingNames = existingInstitutionNames(settlement);
  const localResources = resourceList(settlement);
  const depletedSet = new Set(depletedResources(settlement));
  const tier = settlementTier(settlement);
  const affinityOf = INSTITUTION_LIFECYCLE_TUNING.gapAffinity;
  const found = new Map();

  const addGap = (entry, kind, reason, context) => {
    if (!entry || found.has(entry.name)) return;
    found.set(entry.name, {
      name: entry.name,
      category: entry.category,
      spec: entry.spec,
      nativeTier: entry.nativeTier,
      kind,
      affinity: affinityOf[kind] ?? 0.5,
      reason,
      context,
    });
  };

  const activeInnerIds = new Set(chains.map(c => c.chainId));

  // extraction — a non-depleted resource feeding ≥1 active chain, with none of
  // its high-boost institutions present (RESOURCE_DATA.instBoosts is the
  // resource→institution affinity table the generator itself uses).
  for (const rk of localResources) {
    if (depletedSet.has(rk)) continue;
    const data = RESOURCE_DATA[rk];
    if (!data?.instBoosts) continue;
    const fedChains = (RESOURCE_TO_CHAINS[rk] || []).filter(composite => {
      const inner = composite.split('.').slice(1).join('.');
      return activeInnerIds.has(inner) && !EXCLUDED_NEED_KEYS.has(composite.split('.')[0]);
    });
    if (!fedChains.length) continue;
    const fragments = Object.entries(data.instBoosts)
      .filter(([, boost]) => boost >= INSTITUTION_LIFECYCLE_TUNING.extractionBoostFloor)
      .sort((a, b) => b[1] - a[1]);
    if (!fragments.length) continue;
    const hasDedicated = fragments.some(([fragment]) => [...existingNames].some(n => n.includes(fragment.toLowerCase())));
    if (hasDedicated) continue;
    for (const [fragment] of fragments) {
      const candidates = entriesForTier(tier)
        .filter(e => e.name.toLowerCase().includes(fragment.toLowerCase()))
        .sort((a, b) => byCodepoint(a.name, b.name));
      // entriesForTier only covers the settlement's own tier table; fall back
      // to the cross-tier catalog scan for lower-tier entries (e.g. a town
      // building the hamlet-tier 'Mine (open cast)').
      const fallback = candidates.length ? candidates : lowerTierEntriesMatching(fragment, tier);
      for (const candidate of fallback) {
        const entry = buildableCatalogEntry(candidate.name, settlement, existingNames);
        if (entry) {
          addGap(entry, 'extraction',
            `${data.label || rk} feeds a working local industry but has no dedicated ${entry.name.toLowerCase()}.`,
            { resource: rk });
          break;
        }
      }
      if ([...found.values()].some(g => g.context?.resource === rk)) break;
    }
  }

  // upstream — an active chain flags upstreamMissing: it imports an
  // intermediate the settlement could produce (resource-fed or resource-free).
  for (const chain of chains) {
    for (const missingId of chain.upstreamMissing || []) {
      const siblings = chainCatalogEntries(missingId);
      for (const { needKey, chain: catalogChain } of siblings) {
        if (tierRankOf(tier) < tierRankOf(catalogChain.minTier || 'thorp')) continue;
        if (catalogChain.resource && !resourceFeedsChain(localResources, depletedSet, needKey, missingId)) continue;
        for (const processor of catalogChain.processingInstitutions || []) {
          const entry = buildableEntryForProcessor(processor, settlement, existingNames);
          if (entry) {
            addGap(entry, 'upstream',
              `${chain.label} currently imports ${catalogChain.label.toLowerCase()} the settlement could produce itself.`,
              { chainId: missingId, needKey, downstreamOf: chain.chainId });
            break;
          }
        }
      }
    }
  }

  // downstream — an inactive tier-legal chain adjacent to the live economy:
  // fed by an active local chain (upstreamChains) or by a local resource.
  for (const [needKey, need] of Object.entries(SUPPLY_CHAIN_NEEDS)) {
    if (EXCLUDED_NEED_KEYS.has(needKey)) continue;
    for (const catalogChain of need.chains || []) {
      if (activeInnerIds.has(catalogChain.id)) continue;
      if (tierRankOf(tier) < tierRankOf(catalogChain.minTier || 'thorp')) continue;
      const upstreamActive = (catalogChain.upstreamChains || []).some(id => activeInnerIds.has(id));
      const resourceFed = !!catalogChain.resource
        && resourceFeedsChain(localResources, depletedSet, needKey, catalogChain.id);
      if (!upstreamActive && !resourceFed) continue;
      for (const processor of catalogChain.processingInstitutions || []) {
        const entry = buildableEntryForProcessor(processor, settlement, existingNames);
        if (entry) {
          addGap(entry, 'downstream',
            upstreamActive
              ? `Local production already feeds ${catalogChain.label.toLowerCase()} but nothing works it further.`
              : `Local resources could support ${catalogChain.label.toLowerCase()} at this tier.`,
            { chainId: catalogChain.id, needKey });
          break;
        }
      }
    }
  }

  return [...found.values()].sort((a, b) => b.affinity - a.affinity || byCodepoint(a.name, b.name));
}

function lowerTierEntriesMatching(fragment, tier) {
  const needle = fragment.toLowerCase();
  const maxRank = tierRankOf(tier);
  const out = [];
  for (let rank = 0; rank <= maxRank; rank++) {
    for (const entry of entriesForTier(TIER_ORDER[rank])) {
      if (entry.name.toLowerCase().includes(needle)) out.push(entry);
    }
  }
  return out.sort((a, b) => byCodepoint(a.name, b.name));
}

// ── Contribution + closure eligibility ──────────────────────────────────────
function tokenOverlap(a, b) {
  const tokens = String(a || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(/\s+/).filter(t => t.length >= 4);
  const haystack = String(b || '').toLowerCase();
  return tokens.some(t => haystack.includes(t));
}

// The 12-char-prefix PROCESSOR_MATCH moved into the shared id-first
// join (institutionMatchesProcessor) — stamped institutions compare by
// catalogId, unstamped ones keep the legacy fuzzy name match.

const FOOD_ANCHOR_RE = /granary|mill|farm|fishery|fishing|bakehouse|brewery|orchard|pasture/;
// Sawmills / lumber mills cut wood, not flour — the same carve-out the events
// path makes (mutate.js isFoodAnchorInstitution); 'mill' alone must not
// food-shield timber industry in the closure ranking.
const NOT_FOOD_RE = /saw|lumber|timber/;

/**
 * 0..1 — how much this institution anchors the settlement's economic makeup.
 * Export anchors (chain whose outputs/resource appear in primaryExports) score
 * highest, then live chain processors, then food anchors. Drives the closure
 * shield: the smithy a smithed-goods economy rests on closes last.
 */
export function institutionContribution(settlement, inst, precomputedChains = null) {
  if (!settlement || !inst) return 0;
  const chains = precomputedChains || deriveLifecycleChains(settlement);
  const weights = INSTITUTION_LIFECYCLE_TUNING.contribution;
  const exportsList = settlement?.economicState?.primaryExports || [];
  const exportsText = exportsList.join(' ');
  // Canonical good ids alongside the token check: subsumption renames within
  // a good ('Boots and shoes' surviving as 'Leather goods') share no >=4-char
  // token, but the id still matches — the closure shield must not drop its
  // exportAnchor weight over a label spelling.
  const exportIds = new Set(exportsList.map(exactGoodId).filter(Boolean));
  let score = 0;
  const memberOf = chains.filter(chain =>
    (chain.processingInstitutions || []).some(p => institutionMatchesProcessor(inst, p)));
  if (memberOf.length) {
    score += weights.chainProcessor;
    const anchorsExports = memberOf.some(chain =>
      (chain.outputs || []).some(o => { const id = exactGoodId(o); return id != null && exportIds.has(id); }) ||
      (exportsText && tokenOverlap(`${(chain.outputs || []).join(' ')} ${chain.label || ''} ${chain.resource || ''}`, exportsText)));
    if (anchorsExports) score += weights.exportAnchor;
    if (memberOf.some(chain => chain.needKey === 'food_security')) score += weights.foodAnchor;
  }
  if (!memberOf.length && exportsText && tokenOverlap(inst.name, exportsText)) {
    score += weights.exportAnchor;
  }
  const nameLower = String(inst.name || '').toLowerCase();
  if (FOOD_ANCHOR_RE.test(nameLower) && !NOT_FOOD_RE.test(nameLower) && !memberOf.some(c => c.needKey === 'food_security')) {
    score += weights.foodAnchor;
  }
  return clamp01(score);
}

/** 0..1 — compounded impairment load (impaired institutions close first). */
export function institutionImpairmentLoad(inst) {
  let load = 0;
  if (inst?.status === 'impaired' || inst?.status === 'critical') load = 0.3;
  const impairments = Array.isArray(inst?.impairments) ? inst.impairments : [];
  if (impairments.length) {
    const compounded = 1 - impairments.reduce((acc, imp) => acc * (1 - clamp01(Number(imp?.severity) || 0)), 1);
    load = Math.max(load, compounded);
  }
  return clamp01(load);
}

/**
 * Whether economic decline may close this institution at all. Required
 * institutions, criminal institutions (the corruption loop's domain),
 * essentials, governments, and DM-authored customs are never candidates.
 * Pass the settlement so tier-required names are caught even when the
 * instance lacks the generation-time `required` flag (legacy/imported
 * rosters): catalogEntryByName alone returns the LOWEST tier's spec, and
 * e.g. 'Weekly market' is optional at village but required at town.
 */
export function isClosableInstitution(inst, settlement = null) {
  if (!inst || !inst.name) return false;
  if (inst.status === 'removed' || inst.status === 'destroyed' || inst._worldPulseInactive) return false;
  if (inst.required || inst.requiredForTier) return false;
  if (inst.isCustom || inst.source === 'custom') return false;
  if (/criminal/i.test(String(inst.category || '')) || institutionHasTag(inst, TAG.CRIMINAL)) return false;
  const tags = Array.isArray(inst.tags) ? inst.tags : [];
  if (tags.includes('essential')) return false;
  const entry = catalogEntryByName(inst.name);
  if (entry) {
    if (entry.spec.required) return false;
    if ((entry.spec.tags || []).includes('essential')) return false;
    if (['government', 'waterSupply'].includes(entry.spec.exclusiveGroup)) return false;
  }
  if (settlement) {
    const needle = String(inst.name).toLowerCase();
    const tierEntry = entriesForTier(settlementTier(settlement)).find(e => e.name.toLowerCase() === needle);
    if (tierEntry?.spec?.required) return false;
  }
  return true;
}

// ── Damped chances ───────────────────────────────────────────────────────────
export function buildChance({ streak = 0, health = 0.5, affinity = 0.5, priorBuilds = 0 } = {}) {
  const t = INSTITUTION_LIFECYCLE_TUNING.build;
  if (streak < t.requiredStreak) return 0;
  let p = t.base
    + Math.min(t.streakBonusMax, (streak - t.requiredStreak) * t.streakStep)
    + clamp01(health) * t.health
    + clamp01(affinity) * t.affinity;
  p /= 1 + t.priorBuildPenalty * Math.max(0, priorBuilds);
  return clamp(p, t.min, t.max);
}

export function closeChance({ streak = 0, distress = 0.5, contribution = 0, impairment = 0, priorCloses = 0 } = {}) {
  const t = INSTITUTION_LIFECYCLE_TUNING.close;
  if (streak < t.requiredStreak) return 0;
  let p = t.base
    + Math.min(t.streakBonusMax, (streak - t.requiredStreak) * t.streakStep)
    + clamp01(distress) * t.distress;
  p *= 1 + t.impairedBoost * clamp01(impairment);
  p /= 1 + t.contributionShield * clamp01(contribution);
  p /= 1 + t.priorClosePenalty * Math.max(0, priorCloses);
  return clamp(p, t.min, t.max);
}

// ── Evaluator (the world-pulse phase) ────────────────────────────────────────
const LIFECYCLE_BUILD_FATES = new Set(['built', 'reopened']);
const LIFECYCLE_CLOSE_FATES = new Set(['shuttered', 'bankrupt', 'closed_for_want_of_custom']);

// Damping counters come from institutionHistory rather than instance booleans:
// booleans saturate after one close/reopen cycle, which would let a settlement
// flapping across the thresholds churn the same institution with no added
// damping. The history cap (24) means only RECENT events damp — amnesty for
// ancient history is the right shape for an equilibrium, not a ratchet.
function priorLifecycleCounts(settlement) {
  let builds = 0;
  let closes = 0;
  for (const entry of settlement?.institutionHistory || []) {
    if (LIFECYCLE_BUILD_FATES.has(entry?.fate)) builds += 1;
    else if (LIFECYCLE_CLOSE_FATES.has(entry?.fate)) closes += 1;
  }
  return { builds, closes };
}

function closureFateForInstitution(inst) {
  const text = `${inst?.name || ''} ${(inst?.tags || []).join(' ')} ${inst?.category || ''}`.toLowerCase();
  if (/market|shop|tavern|inn|bath|theater|theatre|gambl|festival/.test(text)) return 'shuttered';
  if (/guild|craft|smith|mill|works|yard|forge|tannery|weaver/.test(text)) return 'bankrupt';
  return 'closed_for_want_of_custom';
}

/**
 * Per-tick evaluator. Tracks an economyDrift streak per settlement (alongside
 * tierDrift in worldState.settlementTickStates) and emits at most ONE
 * lifecycle candidate per settlement per tick — a build under a sustained
 * prosperous streak, a closure under a sustained declining streak. Candidates
 * flow through rollCandidates (volatility + budgets) like tier/resource drift.
 * Pure + deterministic: no rng here; the probability rides on the candidate.
 */
export function evaluateInstitutionLifecycle(worldState, snapshot, pressureIdx, context = {}) {
  const rules = normalizeSimulationRules(context.simulationRules || worldState?.simulationRules);
  const tick = Number.isFinite(context.tick) ? context.tick : worldState?.tick || 0;
  if (!rules.institutionLifecycleEnabled) return { worldState, candidates: [] };

  const settlementTickStates = { ...(worldState?.settlementTickStates || {}) };
  const candidates = [];
  const multiplier = intensityMultiplier(rules);

  for (const item of snapshot?.settlements || []) {
    const settlement = item.settlement || {};
    const previous = settlementTickStates[item.id] || {};
    const prior = previous.economyDrift || null;
    const health = economyHealthScore(item.causal?.scores);
    const direction = classifyEconomyDirection(health);

    let drift;
    if (direction) {
      drift = {
        direction,
        health,
        streak: Math.min(
          prior?.direction === direction ? (prior.streak || 0) + 1 : 1,
          INSTITUTION_LIFECYCLE_TUNING.streakCap,
        ),
        lastEvaluatedTick: tick,
        lastCandidateTick: prior?.lastCandidateTick ?? null,
      };
    } else if (prior) {
      // Dead band: decay rather than reset, so a single soft tick doesn't
      // erase a long stable run (hysteresis, not amnesia).
      drift = { ...prior, streak: Math.max(0, (prior.streak || 0) - 1), lastEvaluatedTick: tick };
    } else {
      drift = null;
    }
    settlementTickStates[item.id] = { ...previous, economyDrift: drift };
    if (!drift || !direction) continue;

    const { builds: priorBuilds, closes: priorCloses } = priorLifecycleCounts(settlement);

    if (direction === 'prosperous') {
      const t = INSTITUTION_LIFECYCLE_TUNING.build;
      if (drift.streak < t.requiredStreak) continue;
      if (drift.lastCandidateTick != null && tick - drift.lastCandidateTick < t.cooldownTicks) continue;
      const chains = deriveLifecycleChains(settlement);
      const gaps = detectInstitutionGaps(settlement, chains);
      if (!gaps.length) continue;
      const gap = gaps[0];
      const probability = buildChance({ streak: drift.streak, health, affinity: gap.affinity, priorBuilds });
      if (probability <= 0) continue;
      const severity = clamp01(0.34 + gap.affinity * 0.18 + multiplier * 0.1);
      // Cooldown is stamped on EMISSION, not application: a candidate that
      // loses its roll (or the maxAuto budget) still burns the cooldown. The
      // error direction is conservative — realized rates undershoot the raw
      // chance in busy ticks, never overshoot — so balance passes should
      // measure realized build/close rates, not these chances in isolation.
      drift.lastCandidateTick = tick;
      settlementTickStates[item.id] = { ...previous, economyDrift: drift };
      candidates.push({
        id: `candidate.institution.build.${stablePart(item.id)}.${stablePart(gap.name)}.${tick}`,
        type: 'institution',
        candidateType: 'institution_build',
        ruleId: `institution_build_${gap.kind}`,
        ruleFamily: 'institution_lifecycle',
        targetSaveId: item.id,
        severity,
        probability,
        applyMode: rules.majorChangesRequireProposal && severity >= 0.78 ? 'proposal' : 'auto',
        headline: `${item.name || item.id} may raise a ${gap.name}`,
        summary: `Sustained prosperity is filling a missing supply-chain step: ${gap.reason}`,
        reasons: [
          gap.reason,
          `Economy stably healthy for ${drift.streak} tick(s) (minimum ${t.requiredStreak}).`,
          `Build chance now ${Math.round(probability * 100)}%.`,
        ],
        institutionPatch: {
          saveId: item.id,
          action: 'build',
          name: gap.name,
          category: gap.category,
          description: gap.spec?.desc || '',
          tags: Array.isArray(gap.spec?.tags) ? [...gap.spec.tags] : [],
          gapKind: gap.kind,
          chainContext: gap.context || null,
          reason: gap.reason,
        },
        proposalPayload: { kind: 'institution_build', saveId: item.id, name: gap.name, category: gap.category },
        metadata: { health, streak: drift.streak, gapKind: gap.kind, affinity: gap.affinity, priorBuilds },
        conflictTags: [`${item.id}:institution:${stablePart(gap.name)}`, `${item.id}:institution:lifecycle`],
      });
    } else {
      const t = INSTITUTION_LIFECYCLE_TUNING.close;
      if (drift.streak < t.requiredStreak) continue;
      if (drift.lastCandidateTick != null && tick - drift.lastCandidateTick < t.cooldownTicks) continue;
      const chains = deriveLifecycleChains(settlement);
      const closable = activeInstitutions(settlement).filter(inst => isClosableInstitution(inst, settlement));
      if (!closable.length) continue;
      // Most vulnerable first: contributing least and impaired most.
      const ranked = closable
        .map(inst => {
          const contribution = institutionContribution(settlement, inst, chains);
          const impairment = institutionImpairmentLoad(inst);
          return { inst, contribution, impairment, vulnerability: (1 - contribution) * 0.6 + impairment * 0.4 };
        })
        .sort((a, b) => b.vulnerability - a.vulnerability || byCodepoint(a.inst.name, b.inst.name));
      const target = ranked[0];
      const distress = 1 - health;
      const probability = closeChance({
        streak: drift.streak,
        distress,
        contribution: target.contribution,
        impairment: target.impairment,
        priorCloses,
      });
      if (probability <= 0) continue;
      const severity = clamp01(0.3 + target.contribution * 0.35 + distress * 0.15);
      drift.lastCandidateTick = tick;
      settlementTickStates[item.id] = { ...previous, economyDrift: drift };
      candidates.push({
        id: `candidate.institution.close.${stablePart(item.id)}.${stablePart(target.inst.name)}.${tick}`,
        type: 'institution',
        candidateType: 'institution_closure',
        ruleId: 'institution_closure',
        ruleFamily: 'institution_lifecycle',
        targetSaveId: item.id,
        severity,
        probability,
        applyMode: rules.majorChangesRequireProposal && severity >= 0.78 ? 'proposal' : 'auto',
        headline: `${target.inst.name} in ${item.name || item.id} may close its doors`,
        summary: 'Sustained economic decline is squeezing out the institutions the settlement leans on least.',
        reasons: [
          `Economy stably distressed for ${drift.streak} tick(s) (minimum ${t.requiredStreak}).`,
          `Economic contribution ${Math.round(target.contribution * 100)}%, impairment ${Math.round(target.impairment * 100)}%.`,
          `Closure chance now ${Math.round(probability * 100)}%.`,
        ],
        institutionPatch: {
          saveId: item.id,
          action: 'close',
          name: target.inst.name,
          category: target.inst.category || null,
          fate: closureFateForInstitution(target.inst),
          contribution: target.contribution,
          impairment: target.impairment,
          reason: 'Sustained economic decline; lowest-necessity institution.',
        },
        proposalPayload: { kind: 'institution_closure', saveId: item.id, name: target.inst.name, category: target.inst.category || null },
        metadata: { health, streak: drift.streak, contribution: target.contribution, impairment: target.impairment, priorCloses },
        conflictTags: [`${item.id}:institution:${stablePart(target.inst.name)}`, `${item.id}:institution:lifecycle`],
      });
    }
  }

  return { worldState: { ...worldState, settlementTickStates }, candidates };
}

// ── Outcome application ──────────────────────────────────────────────────────
function appendInstitutionHistory(settlement, entry) {
  return [
    ...(Array.isArray(settlement.institutionHistory) ? settlement.institutionHistory.slice(-23) : []),
    entry,
  ].slice(-24);
}

/**
 * Applies a build/close institutionPatch to the settlement. Same-reference
 * no-op when nothing changes (the house contract). Self-contained: proposals
 * re-apply this from the stored outcome alone, possibly ticks later, so every
 * guard re-checks against the CURRENT settlement.
 */
export function applyInstitutionLifecycleOutcome(settlement, outcome) {
  const patch = outcome?.institutionPatch;
  if (!settlement || !patch?.name) return settlement;
  const institutions = Array.isArray(settlement.institutions) ? settlement.institutions : [];
  const needle = String(patch.name).toLowerCase();
  const index = institutions.findIndex(inst => String(inst?.name || '').toLowerCase() === needle);

  if (patch.action === 'build') {
    if (index >= 0) {
      const existing = institutions[index];
      const inactive = existing.status === 'removed' || existing._worldPulseInactive;
      if (!inactive) return settlement; // idempotent: already standing
      // Reopening clears economic wear but NOT corruption scandals — those
      // belong to the reform loop (advanceInstitutionReform), and a close →
      // reopen cycle must not launder them for free.
      const keptImpairments = (Array.isArray(existing.impairments) ? existing.impairments : [])
        .filter(imp => imp?.type === 'corruption' || String(imp?.causeEventId || '').startsWith('corruption:'));
      const restored = {
        ...existing,
        status: 'active',
        impairments: keptImpairments,
        _worldPulseInactive: false,
        _worldPulseEconomyClosed: false,
        worldPulseFate: null,
        _worldPulseEconomyBuilt: true,
        reopenedByWorldPulseOutcomeId: outcome.id || null,
      };
      const next = [...institutions];
      next[index] = restored;
      return {
        ...settlement,
        institutions: next,
        institutionHistory: appendInstitutionHistory(settlement, {
          name: existing.name,
          category: existing.category || patch.category || null,
          fate: 'reopened',
          tier: settlement.tier || null,
          outcomeId: outcome.id || null,
          reason: patch.reason || 'Rebuilt during sustained prosperity.',
        }),
      };
    }
    const built = {
      id: `institution.${stablePart(patch.name)}`,
      name: patch.name,
      category: patch.category || 'civic',
      status: 'active',
      description: patch.description || '',
      tags: Array.isArray(patch.tags) ? [...patch.tags] : [],
      required: false,
      _worldPulseEconomyBuilt: true,
      createdByWorldPulseOutcomeId: outcome.id || null,
      builtReason: patch.reason || null,
    };
    return {
      ...settlement,
      institutions: [...institutions, built],
      institutionHistory: appendInstitutionHistory(settlement, {
        name: built.name,
        category: built.category,
        fate: 'built',
        tier: settlement.tier || null,
        outcomeId: outcome.id || null,
        reason: patch.reason || 'Built during sustained prosperity.',
      }),
    };
  }

  if (patch.action === 'close') {
    if (index < 0) return settlement;
    const target = institutions[index];
    // Re-verify at apply time — the settlement may have changed since the
    // candidate (or proposal) was created, and required/criminal/essential
    // institutions must never fall to economic closure.
    if (!isClosableInstitution(target, settlement)) return settlement;
    const fate = patch.fate || closureFateForInstitution(target);
    const closed = {
      ...target,
      status: 'remnant',
      _worldPulseInactive: true,
      _worldPulseEconomyClosed: true,
      worldPulseFate: fate,
      closedByWorldPulseOutcomeId: outcome.id || null,
      remnantReason: `Closed after sustained economic decline (${fate.replace(/_/g, ' ')}).`,
    };
    const next = [...institutions];
    next[index] = closed;
    return {
      ...settlement,
      institutions: next,
      institutionHistory: appendInstitutionHistory(settlement, {
        name: target.name,
        category: target.category || null,
        fate,
        tier: settlement.tier || null,
        outcomeId: outcome.id || null,
        reason: patch.reason || 'Sustained economic decline.',
      }),
    };
  }

  return settlement;
}
