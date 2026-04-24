/**
 * viewModel — translate a settlement save into PDF-ready slices.
 *
 * The PDF generator receives raw settlement data plus optional AI overlays
 * (aiSettlement, aiDailyLife). This module centralises the "raw vs AI" rules
 * and provides defensive defaults so each section component can stay
 * declarative — sections never reach into deeply nested optional paths
 * themselves.
 *
 * Returned shape:
 *   raw             — original settlement object
 *   ai              — original aiSettlement (or null)
 *   active          — whichever of the two the user is currently looking at
 *   narrativeMode   — true iff AI is actually being used (gates AI-only UI)
 *   aiDailyLife     — five dawn-to-night prose passages (or null)
 *
 *   identity, overview, daily, power, economics, defense, services,
 *   resources, viability, history, npcs, hooks, relationships, aiAppendix
 *     — pre-shaped, defensive slices keyed by section
 */

const TIER_LABELS = {
  thorp: 'Thorp', hamlet: 'Hamlet', village: 'Village',
  town: 'Town', city: 'City', metropolis: 'Metropolis',
};

const PROSPERITY_TONE = {
  thriving: 'good', wealthy: 'good',
  stable: 'gold', modest: 'muted', moderate: 'muted',
  struggling: 'warn', impoverished: 'bad', poor: 'bad',
};

const SAFETY_TONE = {
  safe: 'good', orderly: 'good',
  ordinary: 'muted', average: 'muted',
  tense: 'warn', uneasy: 'warn',
  dangerous: 'bad', lawless: 'bad', perilous: 'bad',
};

export function buildViewModel({
  settlement,
  aiSettlement = null,
  aiDailyLife = null,
  narrativeMode = false,
} = {}) {
  const raw = settlement || {};
  const ai = aiSettlement || null;
  const useAi = !!(narrativeMode && ai);
  const active = useAi ? ai : raw;

  return {
    raw,
    ai,
    active,
    aiDailyLife,
    narrativeMode: useAi,

    identity:      identitySlice(active),
    overview:      overviewSlice(active, ai, useAi),
    daily:         dailySlice(active, aiDailyLife),
    power:         powerSlice(active),
    economics:     economicsSlice(active),
    defense:       defenseSlice(active),
    services:      servicesSlice(active),
    resources:     resourcesSlice(active),
    viability:     viabilitySlice(active),
    history:       historySlice(active),
    npcs:          npcsSlice(active),
    hooks:         hooksSlice(active),
    relationships: relationshipsSlice(active),
    aiAppendix:    useAi ? appendixSlice(ai) : null,
  };
}

// ── slice builders ──────────────────────────────────────────────────────────

function identitySlice(s) {
  return {
    name:           s?.name || 'Unnamed Settlement',
    tier:           s?.tier ? (TIER_LABELS[s.tier] || s.tier) : null,
    tierKey:        s?.tier || null,
    population:     s?.population || 0,
    dominantRace:   s?.dominantRace || s?.race || null,
    terrain:        s?.resourceAnalysis?.terrain || s?.terrain || null,
    layout:         s?.spatialLayout?.layout || null,
    age:            s?.history?.age || null,
    tradeAccess:    s?.config?.tradeRouteAccess || null,
    governmentType: s?.powerStructure?.governmentType || s?.governmentType || null,
    founding:       s?.history?.founding || null,
    quarters:       s?.spatialLayout?.quarters || [],
  };
}

function overviewSlice(active, ai, useAi) {
  const stress = (active?.stress || []).map(s => ({
    icon:    s?.icon,
    label:   s?.label,
    summary: s?.summary,
    hook:    s?.crisisHook,
  }));
  const tensions = (active?.history?.currentTensions || [])
    .map(t => t?.label || t?.type)
    .filter(Boolean);
  const prosperity = active?.economicState?.prosperity || null;
  const safety = active?.economicState?.safetyProfile?.safetyLabel || null;
  return {
    thesis:             useAi ? (ai?.thesis || null) : null,
    character:          active?.history?.historicalCharacter || null,
    prosperity,
    prosperityTone:     PROSPERITY_TONE[(prosperity || '').toLowerCase()] || 'muted',
    safety,
    safetyTone:         SAFETY_TONE[(safety || '').toLowerCase()] || 'muted',
    viability:          active?.economicViability?.viable,
    viabilitySummary:   active?.economicViability?.summary || null,
    stability:          active?.powerStructure?.stability || null,
    stress,
    tensions,
    foodBalance:        active?.economicViability?.metrics?.foodBalance || null,
    economyOutput:      active?.economicState?.compound?.economyOutput ?? null,
    economicComplexity: active?.economicState?.economicComplexity || null,
    defenseScores:      active?.defenseProfile?.scores || {},
    defenseReadiness:   active?.defenseProfile?.readiness || null,
    magicDependency:    !!active?.defenseProfile?.magicDependency,
    primaryExports:     active?.economicState?.primaryExports || [],
    primaryImports:     active?.economicState?.primaryImports || [],
    institutionsCount: (active?.institutions || []).length,
    npcsCount:         (active?.npcs || []).length,
    factionsCount:     (active?.powerStructure?.factions || active?.factions || []).length,
  };
}

function dailySlice(active, aiDailyLife) {
  const passages = aiDailyLife
    ? [
        { time: 'Dawn',    text: aiDailyLife.dawn },
        { time: 'Morning', text: aiDailyLife.morning },
        { time: 'Midday',  text: aiDailyLife.midday },
        { time: 'Evening', text: aiDailyLife.evening },
        { time: 'Night',   text: aiDailyLife.night },
      ].filter(p => p.text)
    : [];
  return {
    hasPassages: passages.length > 0,
    passages,
    foodBalance: active?.economicViability?.metrics?.foodBalance || null,
    services:    active?.availableServices || {},
    institutions: active?.institutions || [],
    safetyRatio: active?.economicState?.safetyProfile?.safetyRatio,
    stress:      active?.stress || [],
  };
}

function powerSlice(active) {
  const factions = (active?.powerStructure?.factions || active?.factions || []).map(f => ({
    name:        f?.faction || f?.name || '',
    power:       f?.power || 0,
    isGoverning: !!f?.isGoverning,
    blurb:       f?.blurb || null,
    modifiers:   f?.modifiers || [],
  }));
  return {
    factions,
    stability:       active?.powerStructure?.stability || null,
    recentConflict:  active?.powerStructure?.recentConflict || null,
    legitimacy:      active?.powerStructure?.publicLegitimacy || null,
    criminalCapture: active?.powerStructure?.criminalCaptureState || null,
    conflicts:       active?.conflicts || [],
    tensions:        active?.history?.currentTensions || [],
  };
}

function economicsSlice(active) {
  const ec = active?.economicState || {};
  return {
    prosperity:         ec.prosperity || null,
    economicComplexity: ec.economicComplexity || null,
    economyOutput:      ec.compound?.economyOutput ?? null,
    tradeAccess:        ec.tradeAccess || null,
    incomeSources:      ec.incomeSources || [],
    primaryExports:     ec.primaryExports || [],
    primaryImports:     ec.primaryImports || [],
    localProduction:    ec.localProduction || [],
    tradeDependencies:  ec.tradeDependencies || [],
    isEntrepot:         !!ec.isEntrepot,
    safetyHooks:        ec.safetyProfile?.plotHooks || [],
    viabilityIssues:    active?.economicViability?.issues || [],
    viabilityHooks:     active?.economicViability?.plotHooks || [],
    foodBalance:        active?.economicViability?.metrics?.foodBalance || null,
    criticalImports:    active?.resourceAnalysis?.imports?.critical || [],
  };
}

function defenseSlice(active) {
  const dp = active?.defenseProfile || {};
  const sp = active?.economicState?.safetyProfile || {};
  return {
    scores:                dp.scores || {},
    readiness:             dp.readiness || null,
    institutions:          dp.institutions || {},
    safetyLabel:           sp.safetyLabel || null,
    safetyRatio:           sp.safetyRatio,
    criminalInstitutions:  sp.criminalInstitutions || [],
    crimeTypes:            sp.crimeTypes || [],
    blackMarketCapture:    sp.blackMarketCapture || null,
    foodResilience:        active?.economicViability?.foodSecurity?.resilienceScore,
    tradeAccess:           active?.config?.tradeRouteAccess || null,
    stress:                active?.stress || [],
  };
}

function servicesSlice(active) {
  return {
    available:    active?.availableServices || {},
    activeChains: active?.economicState?.activeChains || [],
    tier:         active?.tier || null,
    institutions: active?.institutions || [],
  };
}

function resourcesSlice(active) {
  const ra = active?.resourceAnalysis || {};
  return {
    terrain:            ra.terrain || null,
    strategicValue:     ra.strategicValue || null,
    economicStrengths:  ra.economicStrengths || [],
    exploitation:       ra.exploitation || {},
    imports:            ra.imports || {},
  };
}

function viabilitySlice(active) {
  const v = active?.economicViability || {};
  return {
    viable:                v.viable,
    summary:               v.summary || null,
    metrics:               v.metrics || {},
    issues:                v.issues || [],
    warnings:              v.warnings || [],
    structuralViolations:  active?.structuralViolations || [],
    stress:                active?.stress || [],
  };
}

function historySlice(active) {
  const h = active?.history || {};
  return {
    age:                 h.age || null,
    historicalCharacter: h.historicalCharacter || null,
    founding:            h.founding || null,
    events:              h.historicalEvents || [],
    tensions:            h.currentTensions || [],
    timeline:            h.eventsTimeline || [],
  };
}

function npcsSlice(active) {
  const npcs = active?.npcs || [];
  return {
    all:      npcs,
    sorted:   [...npcs].sort((a, b) => (b?.power || 0) - (a?.power || 0)),
    factions: active?.powerStructure?.factions || active?.factions || [],
  };
}

function hooksSlice(active) {
  const hooks = [];
  for (const npc of (active?.npcs || [])) {
    for (const h of (npc?.plotHooks || [])) {
      hooks.push({ source: 'npc', sourceName: npc.name || npc.title || 'NPC', hook: h });
    }
  }
  for (const c of (active?.conflicts || [])) {
    for (const h of (c?.plotHooks || [])) {
      hooks.push({
        source: 'conflict',
        sourceName: Array.isArray(c.parties) ? c.parties.join(' vs ') : 'Conflict',
        hook: h,
      });
    }
  }
  for (const h of (active?.economicState?.safetyProfile?.plotHooks || [])) {
    hooks.push({ source: 'crime', sourceName: 'Underworld', hook: h });
  }
  for (const h of (active?.economicViability?.plotHooks || [])) {
    hooks.push({ source: 'crisis', sourceName: 'Economic Crisis', hook: h });
  }
  return {
    all:      hooks,
    tensions: active?.history?.currentTensions || [],
  };
}

function relationshipsSlice(active) {
  return {
    internal:        active?.relationships || [],
    interSettlement: active?.interSettlementRelationships || [],
    crossConflicts:  active?.crossSettlementConflicts || [],
    neighbours:      active?.neighbourNetwork || [],
    neighborSingle:  active?.neighborRelationship || null,
    npcs:            active?.npcs || [],
  };
}

function appendixSlice(ai) {
  if (!ai) return null;
  return {
    thesis:          ai.thesis || null,
    identityMarkers: ai.identityMarkers || [],
    frictionPoints:  ai.frictionPoints || [],
    connectionsMap:  ai.connectionsMap || [],
    dmCompass:       ai.dmCompass || null,
  };
}

export default buildViewModel;
